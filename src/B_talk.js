  /* ---------- lines (AIなし：あらかじめ書いたセリフを、日・時間帯・空いた日数・成長で選ぶ) ---------- */
  var HUNGRY = /食べたい|おなか.{0,3}(すい|へ)|ごはんはまだ/;
  function pick(a) {
    var t = "";
    for (var i = 0; i < 12; i++) { t = a[Math.floor(Math.random() * a.length)]; if (!(typeof t === "string" && HUNGRY.test(t) && fullLeft() > 0)) return t; }
    return t;
  }
  var L = /*LINES_JSON*/;
  function isBirthday(d) { return d.getMonth() === 1 && d.getDate() === 14; }
  function isMyBirthday(d) { return d.getMonth() === 8 && d.getDate() === 20; }
  function bandOfT(t) { return t < 3 ? "late" : t < 5 ? "deep" : t <= 9 ? "early" : t < 11 ? "morning" : t < 14 ? "noon" : t < 17 ? "afternoon" : t < 19 ? "evening" : "night"; }
  function growthOf(openDays) { return openDays < 7 ? 0 : openDays < 30 ? 1 : openDays < 100 ? 2 : 3; }
  L.fulltalk = ["グミちゃん、おなかいっぱいで、ちょっと動けないんだ", "グミちゃん、ふう…しあわせだなあ", "グミちゃん、さっきのごはん、おいしかったよ", "グミちゃん、ごちそうさま。ありがとうね", "グミちゃん、食べたあとは、ゆっくりするのも修行なんだ"];
  L.lonely = ["グミちゃん、来てくれたんだね。待ってたよ", "グミちゃん、会いたかったんだ。ほんとうだよ", "グミちゃん、ひとりで修行してたけど、やっぱりさびしかったな", "グミちゃん、おかえり。焚き火、ずっと消さないでおいたんだ", "グミちゃん、顔が見られて、ほっとしたよ", "グミちゃん、なそ、窓の外ばかり見てたんだ", "グミちゃん、来てくれてありがとう。それだけでうれしいんだ", "グミちゃん、待ってるあいだ、なそ飯の練習をしてたよ"];
  function hintLine() { if (fullLeft() > 0) return Math.random() < .5 ? pick(L.fulltalk) : chatLine(); return pick(L.hint[favIdOf(todayIdx())]); }
  function chatLine() {
    var d = new Date(), t = d.getHours() + d.getMinutes() / 60, g = growthOf(SV.openDays);
    var cand = [[4, L[bandOfT(t)]], [2, L.gen], [1, L.week[d.getDay()]], [1, L.month[d.getMonth()]], [1, L.growth[g]]];
    if (rainyOf(todayIdx())) cand.push([2, L.rain]);
    if (isBirthday(d)) cand.push([3, L.birthday]);
    if (isMyBirthday(d)) cand.push([3, L.myBirthday]);
    var tot = 0; cand.forEach(function (c) { tot += c[0]; });
    var r = Math.random() * tot;
    for (var i = 0; i < cand.length; i++) { r -= cand[i][0]; if (r <= 0) return pick(cand[i][1]); }
    return pick(L.gen);
  }
  function bandLine() { return chatLine(); }
  function mineLine() { return pick(L.mine); }
  function selfBdayNow() { return isMyBirthday(new Date()); }
  function buildGreeting(ctx) {
    var d = new Date(), g = growthOf(ctx.openDays), i;
    if (ctx.first) return [pick(L.first), L.first2];
    if (selfBdayNow() && !ctx.sameDay) return ["グミちゃん、今日はなその誕生日なんだ。…来てくれて、うれしいな"];
    var lonely = ctx.hours >= 12 && !(ctx.absence >= 2 && Math.random() < .5);
    if (!ctx.sameDay) {
      if (isBirthday(d)) return [pick(L.birthday)];
      var m = null;
      for (i = 0; i < L.mile.length; i++) if (L.mile[i][0] <= ctx.elapsed && L.mile[i][0] > (SV.mileShown || 0)) m = L.mile[i];
      if (m) { SV.mileShown = m[0]; save(); return [m[1]]; }
      var om = null;
      for (i = 0; i < L.openMile.length; i++) if (L.openMile[i][0] <= ctx.openDays && L.openMile[i][0] > (SV.openMileShown || 0)) om = L.openMile[i];
      if (om) { SV.openMileShown = om[0]; save(); return [om[1]]; }
    }
    if (lonely) return [pick(L.lonely)];
    if (ctx.absence >= 2) { for (i = 0; i < L.absent.length; i++) if (ctx.absence >= L.absent[i][0] && ctx.absence <= L.absent[i][1]) return [pick(L.absent[i][2])]; }
    if (ctx.sameDay) return [pick(L.same[Math.min(2, g)])];
    if (ctx.elapsed >= 14 && Math.random() < .2) {
      var ratio = ctx.openDays / (ctx.elapsed + 1);
      if (ratio >= .8) return [pick(L.ratioHi)];
      if (ratio < .3) return [pick(L.ratioLo)];
    }
    return [chatLine()];
  }

  // 起動時の記録（初回起動日・開いた日数・前回からの日数）
  var openCtx = (function () {
    var t = todayIdx(), nowTs = Date.now();
    var first = SV.firstOpenDay === null, hours = SV.lastOpenTs ? (nowTs - SV.lastOpenTs) / 3600000 : 0;
    var absence = SV.lastOpenDay === null ? 0 : t - SV.lastOpenDay;
    var sameDay = SV.lastOpenDay === t && (nowTs - SV.lastOpenTs) > 20 * 60 * 1000;
    if (first) SV.firstOpenDay = t;
    if (SV.lastOpenDay !== t) { SV.openDays++; SV.lastOpenDay = t; }
    SV.lastOpenTs = nowTs; save();
    return { first: first, hours: hours, absence: absence, sameDay: sameDay, openDays: SV.openDays, elapsed: t - SV.firstOpenDay };
  })();

  var nextTalk = performance.now() + 60000;
  function talkPrefix() { return mode === "sleep" ? "むにゃ… " : mode === "read" ? "ふむふむ… " : mode === "meditate" ? "すー… " : ""; }
  function talkTick(now) {
    if (now < nextTalk) return;
    if (gameOn) { nextTalk = now + 4000; return; }
    nextTalk = now + 60000;
    if (!isBase(mode) || !sayEl.hidden || (STATES[mode].angry && mode !== "sleep" && mode !== "read" && mode !== "meditate")) { nextTalk = now + 4000; return; }
    talkSay(talkPrefix(), (Math.random() < .2 ? mineLine() : Math.random() < .5 ? hintLine() : bandLine()), 3600);
  }
  $("talk").addEventListener("click", function () {
    if (!isBase(mode)) return;
    talkSay(talkPrefix(), (Math.random() < .2 ? mineLine() : Math.random() < .5 ? hintLine() : chatLine()), 3800); nextTalk = performance.now() + 60000;
  });

  (function intro() {
    var now0 = new Date(), bd = isBirthday(now0), q;
    if (bd) {
      var gift = { t: "プレゼントだよ。930ゴールド。9・3・0で、グミなんだ", fn: function () { SV.coins += 930; SV.bdayGift = now0.getFullYear(); save(); showCoins(); coinPop(930, "🎂"); sndCoin(); vibrate(30); refreshPanels(); } };
      if (openCtx.sameDay) q = [pick(L.birthday)];
      else {
        q = (openCtx.first ? [pick(L.first)] : []).concat(["グミちゃん、お誕生日おめでとう", "拠点をかざってみたんだ。…どうかな"]);
        if (SV.bdayGift !== now0.getFullYear()) q.push(gift);
        q.push(pick(L.birthday));
      }
      setTimeout(function () { spawnConf(60); }, 600);
    } else q = buildGreeting(openCtx).concat([hintLine()]);
    if (selfBdayNow()) setTimeout(function () { spawnConf(60); }, 600);
    var first = true;
    function next() {
      if (!q.length) return;
      var t = q.shift(), txt = typeof t === "string" ? t : t.t;
      if (first || (isBase(mode) && sayEl.hidden)) { say(txt, 3800); if (typeof t !== "string") t.fn(); }
      else if (typeof t !== "string") { t.fn(); }
      first = false;
      setTimeout(next, sayMs(txt, 3800) + 800);
    }
    setTimeout(next, 700);
    if (openCtx.hours >= 24 && !openCtx.first) setTimeout(function () { if (isBase(mode)) startCry(performance.now()); }, 900);
  })();

