  /* ---------- state machine ---------- */
  var mode = "idle", modeT0 = 0, nextChange = performance.now() + 5000, lockUntil = 0;
  var foodId = null, reward = 0, favFlag = false, bonusFlag = false, rewarded = false, angryDur = 1.9, uiBusy = null;
  var blinkAt = 2200, blinkT = -1;
  var particles = [], cxBase = 0, walkTarget = 0, cyc = {};

  function isBase(m) { return !!STATES[m]; }
  var modeAt = null, homeBag = [], lastShortAt = -1e9;
  function nearSlot(x) { return x < -115 ? -230 : x > 115 ? 230 : 0; }
  function pickHome(allowed) {
    var cs = nearSlot(cxBase), c;
    if (allowed) { var opts = allowed.filter(function (h) { return Math.abs(h - cxBase) > 40; }); if (!opts.length) opts = allowed; return opts[randInt(0, opts.length - 1)]; }
    if (!homeBag.length) homeBag = shuffleSeed([-230, 0, 230], randInt(1, 1e9));
    c = homeBag.pop();
    if (c === cs && homeBag.length) { var t = homeBag.pop(); homeBag.push(c); c = t; }
    return c;
  }
  // 短いアクション（あくび・しゃっくりなど）は単発。20秒ルールの例外で、連続しない。
  function startShort(now, ti) {
    var m = new Date().getMonth(), full = fullLeft() > 0;
    var cold = (m >= 10 || m <= 1) ? 3 : (m === 2 || m === 9) ? 1 : .2, hot = (m >= 5 && m <= 8) ? 3 : .1;
    var c = [];
    ["yawn", "hiccup", "sweat", "stretch", "surprise", "shiver", "hot", "growl", "puff"].forEach(function (k) {
      var w = STATES[k].tod[ti];
      if (k === "shiver") w *= cold; if (k === "hot") w *= hot; if (k === "growl" && full) w = 0;
      c.push([k, w]);
    });
    var tot = 0; c.forEach(function (x) { tot += x[1]; });
    var r = Math.random() * tot, k = "yawn";
    for (var i = 0; i < c.length; i++) { r -= c[i][1]; if (r <= 0) { k = c[i][0]; break; } }
    lastShortAt = now;
    enterState(k, now);
  }
  function pickState(now) {
    var hr = new Date().getHours(), ti = hr < 5 ? 0 : hr < 9 ? 1 : hr < 17 ? 2 : hr < 20 ? 3 : 4;
    var prevShort = !!(STATES[mode] && STATES[mode].short);
    if (!prevShort && now - lastShortAt > 45000 && Math.random() < .3) { startShort(now, ti); return; }
    var pool = [], total = 0;
    STATE_KEYS.forEach(function (k) {
      if (k === mode || STATES[k].short) return;
      var w = STATES[k].weight * STATES[k].tod[ti];
      if ((isBdayNow() || isSelfBdayNow()) && (k === "furifuri" || k === "jump" || k === "hum" || k === "serve")) w *= 2.5;
      if (w <= 0) return;
      pool.push({ k: k, w: w }); total += w;
    });
    var r = Math.random() * total, pick2 = pool[0].k;
    for (var i = 0; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) { pick2 = pool[i].k; break; } }
    enterState(pick2, now);
  }
  function enterState(pk0, now) {
    mode = pk0; modeT0 = now; cyc = {};
    var st = STATES[pk0];
    nextChange = now + (st.short ? st.short * 1000 : rand(st.min * 1000, st.max * 1000));
    modeAt = (st.short || pk0 === "walk" || pk0 === "dash") ? null : pickHome(st.homes);
    if (pk0 === "walk") { walkTarget = clamp(cxBase + (Math.random() < .5 ? -1 : 1) * rand(160, 330), -300, 300); if (Math.abs(walkTarget - cxBase) < 100) walkTarget = cxBase > 0 ? -250 : 250; }
    if (st.say) say(pick(st.say), 3000);
    if (pk0 === "surprise" || pk0 === "jump") sndPop();
    if (pk0 === "stir" || pk0 === "fire") sndSizzle();
  }
  // 集中しているときにさわられた・苦手なものを出された：怒らずに、困る
  function startAngry(now, lines) {
    mode = "angry"; modeT0 = now; angryDur = 2.1;
    say(lines[randInt(0, lines.length - 1)], 2200); sndOops(); vibrate(30);
  }
  function startEat(now, id) {
    mode = "eat"; modeT0 = now; foodId = id; rewarded = false;
    foodG.innerHTML = '<g id="foodInner">' + ICONS[id] + '</g>';
    sndMunch();
    favFlag = id === favIdOf(todayIdx());
    bonusFlag = bonusPending();
    reward = (favFlag ? 5 : randInt(1, 3)) * (bonusFlag ? 2 : 1);
  }
  function startRefuse(now) {
    mode = "refuse"; modeT0 = now;
    say(pick(L.full), 2600); sndPop();
  }
  var REACTS = ["giggle", "hop", "shy", "wavebk", "bow", "hifive", "salute", "dizzy", "shrink", "glasses", "spin", "nod", "hug", "proud"];
  var RDUR = { giggle: 1.7, hop: 1.2, shy: 2.1, wavebk: 1.8, bow: 1.9, hifive: 1.7, salute: 2, dizzy: 2.3, shrink: 1.3, glasses: 2.2, spin: 1.1, nod: 1.8, hug: 2.2, proud: 2 };
  var RSAY = {
    giggle: ["えへへ、くすぐったいよ、グミちゃん", "あはは、グミちゃん、やめてよ〜", "ふふっ、くすぐったいな"],
    hop: ["わっ！ びっくりしたあ", "おっと、グミちゃんか", "ふいうちだね、グミちゃん"],
    shy: ["てれるなあ、グミちゃん…", "そんなに見られると、はずかしいよ", "えへへ…"],
    wavebk: ["グミちゃん、やっほー", "グミちゃん、来てくれたんだね"],
    bow: ["ぺこり。グミちゃん、いつもありがとう", "グミちゃん、ごていねいにどうも"],
    hifive: ["ハイタッチだね、グミちゃん！", "いえーい、グミちゃん！"],
    salute: ["なそにまかせて！", "グミちゃんは、なそが守るよ"],
    dizzy: ["ふらふらするよ…", "グミちゃん、目がまわっちゃう"],
    shrink: ["ひゃっ！ つめたいよ", "ひゃあ、びっくりだね", "グミちゃん、指がつめたいね"],
    glasses: ["あっ、メガネがずれちゃった", "わわっ、前が見えないよ〜"],
    spin: ["くるっ！", "まわっちゃった。えへへ"],
    nod: ["うんうん。グミちゃんの話、ちゃんと聞いてるよ", "うん、わかるよ"],
    hug: ["ぎゅー。グミちゃん、あったかいね", "えへへ、ぎゅーだね"],
    proud: ["えっへん。なそ、強くなったでしょ", "見て見て、力こぶ！"]
  };
  var rk = "giggle", rlast = "", rsaid = false, rdir = 1;
  function startReact(now) {
    var cand = REACTS.filter(function (k) { return k !== rlast; });
    var k = cand[randInt(0, cand.length - 1)]; rlast = k;
    mode = "react"; modeT0 = now; rk = k; rsaid = false; rdir = cxBase > 0 ? -1 : 1;
    say(pick(RSAY[k]), 2200);
    if (k === "hop" || k === "shrink" || k === "glasses") sndClink(); else sndTap();
    vibrate(20);
  }
  var cryT = 0;
  function startCry(now) { mode = "cry"; modeT0 = now; cryT = 0; }
  function feed(id) {
    var now = performance.now();
    if (!isBase(mode) || now < lockUntil) return;
    var fd = FOODS.filter(function (f) { return f.id === id; })[0];
    if (fd && fd.bad) { startAngry(now, L.bad[id]); return; }
    if (STATES[mode].angry) { startAngry(now, STATES[mode].angry); return; }
    if (fullLeft() > 0) { startRefuse(now); return; }
    startEat(now, id);
  }
