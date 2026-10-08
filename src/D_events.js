  /* ---------- 時間帯・季節・家具の限定動作（各1日1回） ---------- */
  var EVL = [], EVMAP = {}, EVC = null, evPhase = 0, evX = 0, evSaid = 0, evLastEnd = -1e9;
  var evFxEl = $("evFx"), fxEls = [];
  (function () { for (var i = 0; i < 16; i++) { var e = document.createElementNS(NS, "ellipse"); e.setAttribute("opacity", 0); evFxEl.appendChild(e); fxEls.push(e); } })();
  function mk(o) { EVL.push(o); EVMAP[o.id] = o; }
  // 時間帯：win=[開始h,開始m,終了h,終了m]  [id, win, pose, a, dur, hp(手に持つもの), worn, fx, target, say]
  [
    ["t_train", [6, 30, 7, 0], "swing", {}, 10, null, null, null, "window0", ["グミちゃん、朝の素振りだよ。いち、に！", "朝の修行は、気持ちがいいんだ"]],
    ["t_breakfast", [7, 30, 8, 0], "knead", {}, 10, null, null, null, null, ["グミちゃん、朝ごはんのパンをこねてるんだ", "焼けたら、いいにおいがするよ"]],
    ["t_lunch", [12, 0, 12, 30], "eat", { food: "pan" }, 9, null, null, null, null, ["グミちゃん、お昼ごはんの時間だね", "焼きたてのパン、おいしいなあ"]],
    ["t_snack", [15, 0, 15, 30], "eat", { food: "nuts", sfx: "ぽりぽり" }, 9, null, null, null, null, ["グミちゃん、おやつの時間だよ", "木の実をつまむのが好きなんだ"]],
    ["t_sunset", [18, 0, 18, 30], "gaze", { sfx: "きれいだなあ" }, 9, null, null, null, "window", ["グミちゃん、夕やけがきれいだよ"]],
    ["t_dinner", [18, 30, 19, 0], "stir", {}, 10, null, null, "steam", null, ["グミちゃん、夕ごはんを作ってるんだ", "もうすぐできるからね"]],
    ["t_bath", [20, 0, 20, 30], "sit", { sfx: "ほかほか" }, 9, null, "towel", "steam", null, ["グミちゃん、お風呂、気持ちよかったよ", "グミちゃんも、ゆっくりつかってね"]],
    ["t_ready", [22, 0, 22, 30], "doze", {}, 9, null, "nightcap", null, null, ["グミちゃん、そろそろ寝る時間だね"]],
    ["t_late", [0, 0, 0, 10], "doze", { wake: 1 }, 9, null, null, null, null, ["グミちゃん、まだ起きてるんだね。なそも起きてるよ"]],
    ["t_early", [5, 0, 5, 30], "stretch", {}, 9, null, null, null, "window0", ["グミちゃん、早起きだね。えらいなあ"]],
    ["t_work", [9, 0, 9, 30], "write", {}, 9, "quill", null, null, null, ["グミちゃん、今日もがんばってね", "なそも、修行の記録をつけるんだ"]],
    ["t_tea", [10, 0, 10, 30], "sip", {}, 9, "cup", null, null, null, ["グミちゃん、ちょっと休憩しようか", "やくそう茶、にがいけどおいしいよ"]],
    ["t_nap", [13, 0, 13, 30], "doze", {}, 10, null, null, null, null, ["グミちゃん、ねむくなる時間だね…"]],
    ["t_smell", [17, 0, 17, 30], "sniff", {}, 8, null, null, "steam", null, ["グミちゃん、いいにおいがしない？"]],
    ["t_stretch", [21, 30, 22, 0], "stretch", {}, 9, null, null, null, null, ["グミちゃん、今日もおつかれさま"]],
    ["t_star", [23, 0, 23, 30], "gaze", { sfx: "きらきら" }, 9, null, null, "stars", "window", ["グミちゃん、今日はいい日だったかな"]],
    ["t_watch", [2, 0, 2, 30], "watch", {}, 10, null, null, null, "window", ["グミちゃん、夜の見張りをしてるんだ。安心して寝てね"]]
  ].forEach(function (r) { mk({ id: r[0], kind: "time", win: r[1], pose: r[2], a: r[3], dur: r[4], hp: r[5], worn: r[6], fx: r[7], target: r[8], say: r[9] }); });
  // 季節：from/to=[月,日]、hours=[開始h,終了h]
  [
    ["s_hanami", [3, 20], [4, 10], null, "eat", { hp: "dango", sfx: "もぐもぐ" }, null, "petals", ["グミちゃん、お花見したいね", "おだんご、おいしいなあ"]],
    ["s_new", [4, 1], [4, 15], null, "bow", {}, null, null, ["グミちゃん、新しい季節もよろしくね"]],
    ["s_kodomo", [5, 1], [5, 5], null, "salute", { sfx: "えいっ！" }, "leafcrown", null, ["グミちゃん、強くなったでしょ", "こどもの日だね"]],
    ["s_rain", [6, 1], [7, 10], null, "gaze", { sfx: "ざあざあ" }, null, null, ["グミちゃん、傘は持ったかな", "雨つぶがおちてくるね"], "window"],
    ["s_tanabata", [7, 1], [7, 7], null, "gaze", { sfx: "ねがいごと…" }, null, "stars", ["グミちゃん、願いごとは決めたかな"], "window"],
    ["s_summer", [7, 10], [8, 31], null, "hot", {}, null, null, ["グミちゃん、水分とってね", "夏は旅の季節だったね"]],
    ["s_hanabi", [8, 1], [8, 31], [19, 21], "clap", {}, null, "fireworks", ["グミちゃん、ドーンってきたよ", "きれいだなあ"], "window"],
    ["s_tsukimi", [9, 10], [10, 10], [18, 24], "eat", { hp: "dango", sfx: "もぐもぐ" }, null, null, ["グミちゃん、月がきれいだね", "おだんごもおいしいよ"]],
    ["s_harvest", [10, 1], [10, 31], null, "stir", {}, null, "steam", ["グミちゃん、秋のきのこでスープを作るよ", "実りの季節だね"]],
    ["s_leaves", [11, 1], [11, 30], null, "gaze", { sfx: "ひらひら" }, null, "leaves", ["グミちゃん、秋だね", "落ち葉がきれいだよ"]],
    ["s_winter", [12, 10], [12, 25], null, "gaze", { sfx: "わくわく" }, null, "snow", ["グミちゃん、雪がふってきたね", "冬のおまつり、楽しみだね"]],
    ["s_newyear", [12, 31], [1, 3], null, "bow", {}, null, null, [function (d) { return d.getMonth() === 11 ? "グミちゃん、今年もありがとう。良いお年を" : "グミちゃん、あけましておめでとう。今年もよろしくね"; }]]
  ].forEach(function (r) { mk({ id: r[0], kind: "season", from: r[1], to: r[2], hours: r[3], pose: r[4], a: r[5], dur: 9, hp: r[5].hp || null, worn: r[6], fx: r[7], say: r[8], target: r[9] || null }); });
  // 家具：req=置いてある家具のid  [id, pose, a, hp, fx, say]
  [
    ["straw", "sit", { sfx: "ふかふか" }, null, null, ["わらのクッション、ふかふかだね"]],
    ["herbbag", "sniff", {}, null, null, ["やくそうのにおい、落ち着くなあ"]],
    ["barrel", "sit", { sfx: "よいしょ" }, null, null, ["たるに座ると、旅の宿を思い出すんだ"]],
    ["wshield", "gaze", { sfx: "ぴかぴか" }, null, null, ["この盾で、たくさん守ってきたんだ"]],
    ["stump", "sit", {}, null, null, ["切り株のいす、座りごこちがいいね"]],
    ["fur", "sit", { sfx: "ごろん" }, null, null, ["毛皮の上はあったかいね、グミちゃん"]],
    ["wmap", "gaze", { sfx: "ふむふむ" }, null, null, ["グミちゃん、次はどこに行こうか"]],
    ["bellows", "fire", {}, null, "steam", ["ふいごで、ぷしゅーっと火を強くするんだ"]],
    ["banner", "salute", {}, null, null, ["旅の旗を見ると、元気が出るんだ"]],
    ["lantern", "handsup", { sfx: "ぽっ" }, null, "sparkle", ["ランタンをつけたよ。あかるいね"]],
    ["herbpot", "pet", {}, null, null, ["やくそうが、ぐんぐん育ってるよ"]],
    ["table", "serve", {}, null, "steam", ["グミちゃん、テーブルにならべたよ。どうぞ"]],
    ["sillherb", "sniff", {}, null, null, ["窓辺のハーブ、料理に使うんだ"]],
    ["bookshelf", "read", {}, null, null, ["魔法書を一冊とってきたよ。…むずかしいなあ"]],
    ["kamado", "stir", {}, null, "steam", ["かまどで、なそ飯を作るよ"]],
    ["rack", "sharpen", {}, null, null, ["剣かけから一本とって、研いでおくね"]],
    ["stonewall", "proud", {}, null, null, ["石づくりの壁、かっこいいでしょ"]],
    ["chandelier", "handsup", { sfx: "きらきら" }, null, "sparkle", ["シャンデリアがきらきらだね"]],
    ["d_dragon", "hug", { sfx: "ぎゅー" }, null, null, ["竜のぬいぐるみ、ぎゅーってすると落ち着くんだ"]],
    ["d_mushpot", "gaze", { sfx: "ぽわー" }, null, "sparkle", ["光るきのこ、夜にきれいなんだ"]],
    ["d_crystal", "gaze", { sfx: "じーっ" }, null, "sparkle", ["水晶玉に、グミちゃんの明日がうつってるよ。…いい日だって"]],
    ["d_cactus", "poke", { sfx2: "いたっ！" }, null, null, ["いたっ！ サボテンはさわっちゃだめだね"]],
    ["d_diary", "write", {}, "quill", null, ["旅の日記に、今日のことを書くよ"]],
    ["d_portrait", "gaze", { sfx: "なつかしいね" }, null, null, ["グミちゃん、この絵、旅のころのぼくたちなんだ"]],
    ["d_doll", "pet", {}, null, null, ["木彫りの人形、手作りなんだよ"]],
    ["d_lute", "hum", {}, null, null, ["リュートの音に合わせて、歌うよ"]],
    ["d_goldbag", "proud", { sfx: "ちゃりん" }, null, "sparkle", ["幸運のコイン袋、いいことありそうだね"]],
    ["d_staffs", "gaze", {}, null, null, ["魔法の杖、なそには使えないんだけどね"]],
    ["d_hourglass", "gaze", { sfx: "さらさら" }, null, null, ["砂がさらさら落ちていくね"]],
    ["d_chest", "proud", { sfx: "なにかな" }, null, "sparkle", ["宝箱の中身はね…ないしょだよ"]],
    ["s_mask", "salute", { sfx: "えいっ！" }, null, null, ["魔よけのお面、悪いものを追いはらうんだ"]],
    ["s_snowknight", "salute", {}, null, "snow", ["雪だるまの騎士、なそのライバルなんだ"]],
    ["s_chocobox", "smile", {}, null, "sparkle", ["グミちゃんの誕生月だね。チョコの箱、かわいいでしょ"]],
    ["s_royals", "bow", {}, null, null, ["王さまと王女さまに、ごあいさつ"]],
    ["s_sakura", "gaze", {}, null, "petals", ["桜の枝がきれいだね"]],
    ["s_dragonflag", "salute", { sfx: "ひらひら" }, null, null, ["竜のぼりみたいに、元気にいくよ"]],
    ["s_bouquet", "sniff", {}, "flower", null, ["花束、いいにおいだね"]],
    ["s_ajisai", "gaze", {}, null, null, ["あじさい、いい色だね"]],
    ["s_wishsasa", "gaze", { sfx: "ねがいごと…" }, null, "stars", ["笹に、グミちゃんが元気でいられますようにって書いたよ"]],
    ["s_shellchime", "gaze", { sfx: "ちりん…" }, null, null, ["風鈴の音で、すずしくなるね"]],
    ["s_himawari", "smile", {}, null, null, ["ひまわりみたいに元気だよ"]],
    ["s_crown", "proud", { sfx: "えへへ" }, null, "sparkle", ["なその誕生月なんだ。…かんむり、似合うかな"]],
    ["s_tsukimi", "eat", { hp: "dango", sfx: "もぐもぐ" }, "dango", null, ["お月見だんご、いただきます"]],
    ["s_higan", "gaze", {}, null, null, ["彼岸花が赤いね"]],
    ["s_nutbasket", "eat", { food: "nuts", sfx: "ぽりぽり" }, null, null, ["木の実をたくさん集めたよ"]],
    ["s_pumpkin", "scared", {}, null, null, ["かぼちゃがこっちを見てるよ…"]],
    ["s_momiji", "gaze", {}, null, "leaves", ["もみじがきれいだね"]],
    ["s_startree", "gaze", { sfx: "きらきら" }, null, "sparkle", ["星かざりの木、きらきらだね"]],
    ["s_hearth", "fireside", { sfx: "ぬくぬく" }, null, null, ["だんろの前、ぬくぬくだね"]],
    ["s_kagami", "bow", {}, null, null, ["鏡もちだね。今年もよろしくね"]]
  ].forEach(function (r) { mk({ id: "f_" + r[0], req: r[0], kind: "furn", pose: r[1], a: r[2], dur: 9, hp: r[3], worn: null, fx: r[4], say: r[5], target: "furn" }); });

  mk({ id: "t_selfbday", kind: "time", win: [0, 0, 24, 0], ok: function (d) { return isMyBirthday(d); }, pose: "proud", onStart: function () { var y = new Date().getFullYear(); if (SV.selfBdayGift !== y) { SV.selfBdayGift = y; SV.coins += 100; save(); showCoins(); setTimeout(function () { coinPop(100, "🎂"); sndCoin(); }, 2500); } }, a: { sfx: "えへへ" }, dur: 10, hp: null, worn: null, fx: "sparkle", say: ["今日はなその誕生日なんだ。グミちゃん、いっしょにいてくれてありがとう", "ケーキはね、自分で焼いたんだ。…なそ飯だよ"], target: null });
  // 宝箱（くす玉）：7日・30日、そのあと100日ごと（100・200・300・400…）
  function kusuNext() {
    var d = SV.openDays || 0, k = SV.kusu || 0, m = 0, h = Math.floor(d / 100) * 100;
    if (d >= 7 && k < 7) m = 7;
    if (d >= 30 && k < 30) m = 30;
    if (h >= 100 && k < h) m = h;
    return m;
  }
  mk({ id: "m_kusu", kind: "time", win: [0, 0, 24, 0], ok: function () { return kusuNext() > 0; }, pose: "kusu", a: {}, dur: 9, hp: null, worn: null, fx: null, say: [function () { return "グミちゃん、拠点を開いて" + SV.kusu + "日目だよ！ 宝箱をあけるね"; }, "おめでとう！ いつもありがとう、グミちゃん"], target: null, onStart: function () { SV.kusu = kusuNext() || SV.kusu; save(); kusuDone = false; } });
  var kusuT = -1, kusuDone = false, kusuG = $("kusuG"), kusuL = $("kusuL"), kusuR = $("kusuR"), kusuB = $("kusuB");
  function seasonOk(e, d) {
    var x = (d.getMonth() + 1) * 100 + d.getDate(), a = e.from[0] * 100 + e.from[1], b = e.to[0] * 100 + e.to[1];
    if (!(a <= b ? (x >= a && x <= b) : (x >= a || x <= b))) return false;
    if (e.hours) { var h = d.getHours(); if (h < e.hours[0] || h >= e.hours[1]) return false; }
    return true;
  }
  function winOk(e, d) { var m = d.getHours() * 60 + d.getMinutes(); return m >= e.win[0] * 60 + e.win[1] && m < e.win[2] * 60 + e.win[3]; }
  function evAvail() {
    var d = new Date(), t = todayIdx(), tm = [], ot = [];
    EVL.forEach(function (e) {
      if (SV.evDone[e.id] === t) return;
      if (e.kind === "free") return;
      if (e.kind === "time") { if (winOk(e, d) && (!e.ok || e.ok(d))) tm.push(e); }
      else if (e.kind === "season") { if (seasonOk(e, d)) ot.push(e); }
      else if (SV.owned[e.req]) ot.push(e);
    });
    return { time: tm, other: ot };
  }
  function furnX(id) {
    var g = document.querySelector('.itm[data-id="' + id + '"]');
    if (!g) return 0;
    try { var b = g.getBBox(), p = (SV.pos && SV.pos[id]) || { x: 0 }; return clamp(b.x + b.width / 2 + p.x - CX, -300, 300); } catch (e) { return 0; }
  }
  function startEvent(e, now) {
    if (e.kind !== "free") { SV.evDone[e.id] = todayIdx(); save(); }
    EVC = e; mode = "ev"; modeT0 = now; evSaid = 0; evPhase = 0; cyc = {}; if (e.onStart) e.onStart();
    evX = e.target === "window" ? -290 : e.target === "furn" ? furnX(e.req) : e.target === "window0" ? -240 : cxBase;
    nextChange = 1e15; modeAt = null;
  }
  function evLine(e, i, d) { var l = e.say && e.say[i]; if (!l) return; say(typeof l === "function" ? l(d) : l, 3800); }
  function endEvent(now) {
    EVC = null; mode = "idle"; modeT0 = now; evLastEnd = now; nextChange = now + rand(6000, 10000); blinkAt = now + 800;
  }
  setInterval(function () {
    var now = performance.now();
    if (gameOn || !isBase(mode) || performance.now() < 5000 || STATES[mode].short) return;
    var av = evAvail();
    if (av.time.length && now - evLastEnd > 15000) { startEvent(av.time[randInt(0, av.time.length - 1)], now); return; }
    if (!av.other.length || now - evLastEnd < 90000 || mode === "sleep" || Math.random() > .25 || !sayEl.hidden) return;
    startEvent(av.other[randInt(0, av.other.length - 1)], now);
  }, 4000);

  /* ---- できごと・ひとりごとの動き（P に姿勢を書きこむ。ct=経過秒、a=追加の設定） ---- */
  var POSE = {
    swing: function (ct, P, a) { SP.swing(P, ct, ct); },
    calis: function (ct, P) { var u = .5 + .5 * Math.sin(ct * 3); P.aL = P.aR = 20 + 140 * u; P.dy = -6 * Math.abs(Math.cos(ct * 3)); P.mouth = "open"; P.sfx = ["いち！", "に！", "さん！", "し！"][Math.floor(ct * 1.5) % 4]; },
    stretch: function (ct, P) { SP.stretch(P, ct % 6, ct); },
    sit: function (ct, P, a) { SP.sit(P, ct, ct); P.sfx = a.sfx || ""; },
    eat: function (ct, P, a) {
      var c = ct % 3, up = c < 2.2; P.aR = up ? -150 : -40; P.sR = up ? .6 : 1; P.hpR = a.hp || ("food:" + (a.food || "pan")); P.aL = 8;
      P.eyes = "Smile"; P.mouth = up && Math.floor(ct * 6) % 2 ? "chew" : "smile"; P.sfx = a.sfx || "もぐもぐ";
    },
    sip: function (ct, P, a) { var c = ct % 4; P.aR = c < 2.6 ? -150 : -40; P.sR = c < 2.6 ? .62 : 1; P.hpR = "cup"; P.mouth = c > 1 && c < 2.6 ? "sip" : "smile"; P.eyes = c > 1 && c < 2.6 ? "Smile" : "N"; P.sfx = a.sfx || (c > 1 && c < 2.6 ? "ずずっ" : "ふーふー"); },
    gaze: function (ct, P, a) { P.tilt = -4 + 1.5 * Math.sin(ct * 1.3); P.eyes = "Side"; P.brows = "Calm"; P.mouth = "smile"; P.sfx = ct < 6 ? (a.sfx || "") : ""; },
    clap: function (ct, P) { var c = Math.abs(Math.sin(ct * 7)); P.aL = P.aR = -40 - 24 * c; P.eyes = "Smile"; P.mouth = "grin"; P.dy = -4 * c; P.sfx = c > .8 ? "パチパチ" : ""; },
    bow: function (ct, P) { var b = Math.sin(Math.PI * clamp((ct % 4.5) / 2.4, 0, 1)); P.hy = 26 * b; P.sy = 1 - .04 * b; P.eyes = b > .4 ? "Sleep" : "N"; P.aL = P.aR = -20 * b; P.sfx = b > .7 ? "ぺこり" : ""; },
    sniff: function (ct, P, a) { P.tilt = -3; P.eyes = "Sleep"; P.brows = "Calm"; P.mouth = "o"; P.hy = -4 * Math.abs(Math.sin(ct * 4)); P.sfx = a.sfx || "くんくん"; },
    scared: function (ct, P, a) { SP.shiver(P, ct, ct); P.eyes = "Bare"; P.gy = 26; P.brows = "Up"; P.sfx = a.sfx || "ぶるぶる"; },
    write: function (ct, P) { SP.letter(P, ct, ct); },
    doze: function (ct, P, a) {
      var w = a.wake && (ct % 6) > 5, nod = Math.sin(ct * 1.2);
      P.eyes = w ? "N" : "Sleep"; P.brows = w ? "Up" : "Calm"; P.hy = w ? -6 : 8 + 6 * nod; P.tilt = w ? 0 : 4 * nod; P.mouth = w ? "oo" : "o"; P.aL = P.aR = 6;
      P.sfx = w ? "はっ！" : (ct % 3 < 1.5 ? "うとうと" : "…すぅ");
    },
    handsup: function (ct, P, a) { P.aL = P.aR = 156 + 6 * Math.sin(ct * 3); P.eyes = "Smile"; P.mouth = "grin"; P.tilt = 2 * Math.sin(ct * 2); P.sfx = a.sfx || ""; },
    wave: function (ct, P, a) { SP.wave(P, ct % 3.6, ct); P.sfx = a.sfx || ""; },
    hug: function (ct, P, a) { P.aL = P.aR = -64; P.sL = P.sR = .82; P.eyes = "Smile"; P.mouth = "smile"; P.rot = 3 * Math.sin(ct * 2); P.sfx = a.sfx || ""; },
    poke: function (ct, P, a) {
      var c = ct % 4; P.aR = c < 1.4 ? -20 - 40 * (c / 1.4) : -20; P.brows = "N"; P.mouth = "flat";
      if (c >= 1.4 && c < 2.6) { P.dy = -18 * Math.sin(Math.PI * (c - 1.4) / 1.2); P.mouth = "oo"; P.brows = "Up"; P.sfx = a.sfx2 || "いたっ！"; P.aR = 60; }
    },
    proud: function (ct, P, a) { P.aL = P.aR = -6; P.sL = P.sR = .78; P.sy = 1.03; P.brows = "Focus"; P.mouth = "grin"; P.eyes = "Smile"; P.dy = -2 * Math.abs(Math.sin(ct * 3)); P.sfx = a.sfx || "えっへん"; },
    salute: function (ct, P, a) { P.aR = 134 + 6 * Math.sin(ct * 4); P.sR = .78; P.hpR = "sword"; P.aL = -6; P.brows = "Focus"; P.mouth = "grin"; P.sfx = a.sfx || "まかせて！"; },
    dance: function (ct, P) { SP.furifuri(P, ct, ct); },
    pet: function (ct, P) { P.aR = -40 + 10 * Math.sin(ct * 3); P.aL = 10; P.eyes = "Smile"; P.mouth = "smile"; P.rot = 2 * Math.sin(ct * 1.5); P.sfx = "なでなで"; },
    read: function (ct, P) { SP.read(P, ct, ct); },
    muscle: function (ct, P) { var pu = .5 + .5 * Math.sin(ct * 7); P.aL = P.aR = 96; P.sL = P.sR = .8; P.brows = "Focus"; P.mouth = "grin"; P.sx = 1.03 + .02 * pu; P.dy = -3 * pu; P.sfx = "ムキッ"; },
    wait: function (ct, P) { SP.wait(P, ct, ct); },
    kusu: function (ct, P) {
      kusuT = ct; P.eyes = ct > 1.4 ? "Smile" : "N";
      if (ct > 1.4) { var c = Math.abs(Math.sin(ct * 7)); P.aL = P.aR = -40 - 24 * c; P.dy = -5 * c; P.mouth = "grin"; P.sfx = c > .8 ? "パチパチ" : ""; }
      else { P.aL = P.aR = 150; P.mouth = "o"; P.brows = "Up"; P.sfx = "わくわく"; }
      if (ct > 1.4 && !kusuDone) {
        kusuDone = true; spawnConf(90); vibrate(40);
        playSnd("fanfare"); setTimeout(function () { spawnConf(60); }, 900);
        SV.coins += 100; save(); showCoins(); setTimeout(function () { coinPop(100, "おいわい"); sndCoin(); }, 1400);
      }
    },
    yawn: function (ct, P) { SP.yawn(P, ct % 4.4, ct); },
    shoulder: function (ct, P) { P.aL = 10 + 50 * Math.sin(ct * 5); P.aR = 10 - 50 * Math.sin(ct * 5); P.dy = -3 * Math.abs(Math.sin(ct * 5)); P.sfx = "ぐるぐる"; },
    neck: function (ct, P) { P.tilt = 9 * Math.sin(ct * 3); P.eyes = "Sleep"; P.sfx = "ぐるーり"; },
    march: function (ct, P) { walkPose(P, ct * 8, 0); P.sfx = "てくてく"; },
    hot: function (ct, P) { SP.hot(P, ct, ct); },
    full: function (ct, P) { P.aL = P.aR = -40; P.sL = P.sR = .85; P.eyes = "Smile"; P.mouth = "smile"; P.sy = 1 + .02 * Math.sin(ct * 3); P.sfx = (ct % 3) < 2 ? "ふう、まんぷく" : ""; },
    belly: function (ct, P) { SP.growl(P, ct, ct); },
    smile: function (ct, P) { P.eyes = "Smile"; P.mouth = "grin"; P.dy = -4 * Math.abs(Math.sin(ct * 5)); P.rot = 2 * Math.sin(ct * 3); P.sfx = "にこっ"; },
    shy: function (ct, P) { P.aR = 168; P.sR = .9; P.aL = -18; P.eyes = "Side"; P.brows = "Sad"; P.mouth = "smile"; P.tilt = -5 + 2 * Math.sin(ct * 5); P.sfx = "てれっ"; },
    sob: function (ct, P) { P.aL = P.aR = -150; P.sL = P.sR = .62; P.eyes = "Sleep"; P.brows = "Sad"; P.mouth = "wavy"; P.tear = 1; P.rot = 1.5 * Math.sin(ct * 7); P.sfx = "うるうる"; },
    pat: function (ct, P) { P.aL = -20 + 15 * Math.abs(Math.sin(ct * 7)); P.aR = -20 + 15 * Math.abs(Math.cos(ct * 7)); P.eyes = "Down"; P.sfx = "ぽんぽん"; },
    think: function (ct, P) { P.aR = -150; P.sR = .62; P.aL = -30; P.tilt = 6 + 2 * Math.sin(ct * 1.5); P.eyes = "Side"; P.brows = "Calm"; P.mouth = "flat"; P.sfx = "うーん"; },
    stir: function (ct, P) { SP.stir(P, ct, ct); }, chop: function (ct, P) { SP.chop(P, ct, ct); }, taste: function (ct, P) { SP.taste(P, ct, ct); },
    serve: function (ct, P) { SP.serve(P, ct, ct); }, fire: function (ct, P) { SP.fire(P, ct, ct); }, polish: function (ct, P) { SP.polish(P, ct, ct); },
    sharpen: function (ct, P) { SP.sharpen(P, ct, ct); }, map: function (ct, P) { SP.map(P, ct, ct); }, star: function (ct, P) { SP.star(P, ct, ct); },
    meditate: function (ct, P) { SP.meditate(P, ct, ct); }, knead: function (ct, P) { SP.knead(P, ct, ct); }, wash: function (ct, P) { SP.wash(P, ct, ct); },
    fireside: function (ct, P, a) { SP.fireside(P, ct, ct); P.sfx = a.sfx || P.sfx; }, watch: function (ct, P) { SP.watch(P, ct, ct); },
    shield: function (ct, P) { SP.shield(P, ct, ct); }, run: function (ct, P) { SP.run(P, ct, ct); }, tale: function (ct, P) { SP.tale(P, ct, ct); },
    hum: function (ct, P) { SP.hum(P, ct, ct); }, balance: function (ct, P) { SP.balance(P, ct, ct); }, plate: function (ct, P) { SP.plate(P, ct, ct); }
  };

  // ひとりごとの言葉 → 動き（上にあるものが先に効く）
  var ACT = [
    [/お風呂/, { pose: "sit", a: { sfx: "ほかほか" }, worn: "towel", fx: "steam" }],
    [/素振り|剣を研|剣といっしょ/, { pose: "swing" }], [/剣/, { pose: "salute" }],
    [/腕立て/, { pose: "muscle" }], [/瞑想|心を静か/, { pose: "meditate" }], [/盾/, { pose: "shield" }], [/見張り|見守/, { pose: "watch" }],
    [/走り込み|走/, { pose: "run" }], [/片足/, { pose: "balance" }], [/鎧/, { pose: "polish" }],
    [/包丁|切る|下ごしらえ/, { pose: "chop" }], [/鍋|煮|スープ|汁もの|煮込み/, { pose: "stir", fx: "steam" }], [/味見|味を/, { pose: "taste" }],
    [/火加減|焚き火|たき火|火を見|火の前/, { pose: "fireside" }], [/こね/, { pose: "knead" }], [/盛り付け|見た目/, { pose: "plate" }],
    [/できたよ|どうぞ|おかわり|作るよ|作ってあげ|作ろう|作るね/, { pose: "serve" }], [/片づけ|洗/, { pose: "wash" }],
    [/地図|行き先|次はどこ/, { pose: "map" }], [/本|読/, { pose: "read" }], [/星/, { pose: "star", fx: "stars" }], [/手紙/, { pose: "write" }],
    [/寒|冷え|あったかく|あったかい上着/, { pose: "scared", a: { sfx: "ぶるぶる" } }], [/暑|あつい/, { pose: "hot" }],
    [/おなか(が|の)?(すい|へ|鳴)|おなかの虫/, { pose: "belly" }],
    [/やくそう/, { pose: "eat", a: { food: "yakusou" } }], [/パン/, { pose: "eat", a: { food: "pan" } }], [/干し肉/, { pose: "eat", a: { food: "niku" } }],
    [/チーズ/, { pose: "eat", a: { food: "cheese" } }], [/木の実/, { pose: "eat", a: { food: "nuts" } }], [/きのこのスープ/, { pose: "eat", a: { food: "soup" } }],
    [/お茶|飲みもの|お水/, { pose: "sip" }],
    [/食べ|ごはん|なそ飯/, { pose: "eat", a: { food: "pan" } }],
    [/ありがと/, { pose: "bow" }], [/照れ|てれ|恥ずかし|はずかし|ないしょ/, { pose: "shy" }],
    [/誕生|おめでと/, { pose: "clap", fx: "sparkle", on: function () { spawnConf(30); } }],
    [/泣/, { pose: "sob" }], [/待って|まだかな|待ってる/, { pose: "wait" }],
    [/おやすみ|眠|ねむ|寝/, { pose: "yawn" }], [/のび|背すじ/, { pose: "stretch" }], [/肩/, { pose: "shoulder" }], [/首/, { pose: "neck" }], [/散歩|歩/, { pose: "march" }],
    [/雨|傘/, { pose: "gaze", a: { sfx: "ざあざあ" } }], [/空|窓|夕やけ|遠く|山/, { pose: "gaze", a: { sfx: "きれいだなあ" } }],
    [/強く|守る|まかせて|修行/, { pose: "muscle" }],
    [/うれし|好き|しあわせ|楽し|たのし|笑/, { pose: "smile" }],
    [/心配|大丈夫かな/, { pose: "think" }], [/？/, { pose: "think" }]
  ];
  function actFor(text) {
    var raw = String(text);
    if (!actFor.hs) { actFor.hs = {}; Object.keys(L.hint).forEach(function (k) { L.hint[k].forEach(function (x) { actFor.hs[x] = 1; }); }); }
    if (actFor.hs[raw]) return { pose: "belly" };  // ヒント台詞は食べ物を持たず、おなかをさするだけ
    for (var i = 0; i < ACT.length; i++) { if (ACT[i][0].test(raw)) return ACT[i][1]; }
    return null;
  }
  function act(text) {
    if (!isBase(mode) || STATES[mode].short || STATES[mode].angry || mode === "sleep" || mode === "read") return;
    var r = actFor(text); if (!r) return;
    startEvent({ id: "act", kind: "free", pose: r.pose, a: r.a || {}, dur: 5, hp: (r.a && r.a.hp) || null, worn: r.worn || null, fx: r.fx || null, say: null, target: null }, performance.now());
    if (r.on) r.on();
  }
  function talkSay(prefix, text, ms) { say(prefix + text, ms); act(text); }
  function fxStep(kind, tt, k) {
    var i, e, p, hide = !kind || k < .01;
    for (i = 0; i < 16; i++) {
      e = fxEls[i];
      if (hide) { if (e._v) { e.setAttribute("opacity", 0); e._v = 0; } continue; }
      e._v = 1; p = (tt * (kind === "steam" ? .35 : kind === "fireworks" ? .35 : .12) + i / 16) % 1;
      var cx = 0, cy = 0, rx = 6, ry = 6, fill = "#fff", op = k, rot = 0;
      if (kind === "petals" || kind === "leaves") {
        cx = 150 + (i * 67) % 1000 + 40 * Math.sin(p * 9 + i); cy = 40 + p * 1050; rx = kind === "leaves" ? 11 : 9; ry = kind === "leaves" ? 6 : 5;
        fill = kind === "leaves" ? ["#e07a2f", "#c8402a", "#d9a02a"][i % 3] : (i % 2 ? "#f6b8cc" : "#fbd5e0"); rot = p * 400 + i * 30; op = k * .9;
      } else if (kind === "snow") { cx = 150 + (i * 71) % 1000 + 25 * Math.sin(p * 7 + i); cy = 40 + p * 1050; rx = ry = 5; op = k * .9; }
      else if (kind === "trail") {
        var ph2 = (tt * .22) % 1, ccx = roomX(330), ccy = roomY(130), u = i / 16, px, py;
        var v = u * 10, vk = Math.floor(v), vf = v - vk, a1 = (-90 + 36 * vk) * Math.PI / 180, a2 = (-90 + 36 * (vk + 1)) * Math.PI / 180, r1 = vk % 2 ? 26 : 62, r2 = (vk + 1) % 2 ? 26 : 62;
        px = (1 - vf) * r1 * Math.cos(a1) + vf * r2 * Math.cos(a2); py = (1 - vf) * r1 * Math.sin(a1) + vf * r2 * Math.sin(a2); fill = "#ffd93b";
        cx = ccx + px; cy = ccy + py; rx = ry = 6; op = (u < ph2 * 1.25) ? (1 - Math.max(0, ph2 - .85) / .15) : 0;
      }
      else if (kind === "stars") { if (i > 8) { op = 0; } else { cx = 190 + (i * 53) % 150; cy = 170 + (i * 71) % 160; rx = ry = 4 + 2 * Math.sin(tt * 3 + i); fill = "#fff6b0"; op = k * (.5 + .5 * Math.sin(tt * 3 + i)); } }
      else if (kind === "sparkle") { cx = 400 + (i * 97) % 480; cy = 90 + (i * 59) % 200; rx = ry = 5 + 3 * Math.sin(tt * 4 + i); fill = "#ffe27a"; op = k * (.5 + .5 * Math.sin(tt * 4 + i * 2)); }
      else if (kind === "steam") { cx = roomX(170 + (i % 5) * 15); cy = roomY(400) - p * 160; rx = ry = 8 + p * 14; op = k * (1 - p) * .7; }
      else if (kind === "fireworks") {
        var b = Math.floor(i / 5), ph = (tt * .35 + b / 3) % 1, cc = [[235, 230], [310, 300], [260, 350]][b % 3], an = (i % 5) / 5 * 6.283 + b;
        cx = cc[0] + 60 * ph * Math.cos(an); cy = cc[1] + 60 * ph * Math.sin(an); rx = ry = 2 + 5 * (1 - ph); fill = ["#ff6b6b", "#ffd93b", "#6bc5ff"][b % 3]; op = k * (1 - ph); if (i === 15) op = 0;
      }
      e.setAttribute("cx", cx); e.setAttribute("cy", cy); e.setAttribute("rx", rx); e.setAttribute("ry", ry); e.setAttribute("fill", fill); e.setAttribute("opacity", clamp(op, 0, 1));
      e.setAttribute("transform", rot ? "rotate(" + rot + " " + cx + " " + cy + ")" : "");
    }
  }
