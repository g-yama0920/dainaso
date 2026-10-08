  /* ---------- main loop ---------- */
  var tearK = 0;
  // 数値でなめらかに動かすもの
  var DEF = { cx: 0, dy: 0, rot: 0, sx: 1, sy: 1, aL: 10, aR: 10, sL: 1, sR: 1, legL: 0, legR: 0, liftL: 0, liftR: 0, up: 0, tilt: 0, hy: 0, gy: 0, zzz: 0 };
  var KEYS = Object.keys(DEF);
  var cur = {}; KEYS.forEach(function (k) { cur[k] = DEF[k]; });
  var last = performance.now();
  function newP() {
    var P = {}; KEYS.forEach(function (k) { P[k] = DEF[k]; });
    P.eyes = "N"; P.brows = "N"; P.mouth = "smile"; P.hpL = ""; P.hpR = ""; P.behind = ""; P.held = ""; P.front = ""; P.top = "";
    P.puff = 0; P.tear = 0; P.worn = ""; P.sfx = ""; P.fx = null; P.overL = null; P.overR = null; P.blink = true;
    return P;
  }
  function SIT(P) { P.up = 28; P.legL = P.legR = 74; }
  function walkPose(P, w, dir) {
    P.liftL = 12 * Math.max(0, Math.sin(w)); P.liftR = 12 * Math.max(0, -Math.sin(w));
    P.legL = 6 * Math.sin(w); P.legR = -6 * Math.sin(w);
    P.dy = -4 * Math.abs(Math.sin(w)); P.rot = 1.5 * Math.sin(w) + dir * 2;
    P.aL = -14 * Math.sin(w) + 6; P.aR = 14 * Math.sin(w) + 6; P.mouth = "smile";
  }
  function once(key, fn) { if (!cyc[key]) { cyc[key] = 1; fn(); } }
  function every(key, idx, fn) { if (cyc[key] !== idx) { cyc[key] = idx; fn(); } }

  // ---- 気分ごとの姿勢（P に書きこむ。me=その気分になってからの秒、tt=時計の秒） ----
  var SP = {
    idle: function (P, me, tt) { P.sy = 1 + .012 * AMP * Math.sin(tt * 2.2); P.tilt = 2 * Math.sin(tt * .5); },
    wave: function (P, me, tt) { var wv = (me % 6) < 3.6; P.aR = wv ? 150 + 14 * Math.sin(tt * 9) : 10; P.eyes = "Smile"; P.mouth = wv ? "grin" : "smile"; P.tilt = 2 * Math.sin(tt * 2); },
    clasp: function (P, me, tt) { P.aL = P.aR = -62; P.sL = P.sR = 1.03; P.eyes = "Smile"; P.tilt = 2 * Math.sin(tt * .8); },
    walk: function (P, me, tt, now, dt) {
      var dir = walkTarget > cxBase ? 1 : -1; cxBase += dir * 90 * dt; P.cx = cxBase; walkPose(P, tt * 8, dir);
      if (Math.abs(walkTarget - cxBase) < 5) walkTarget = cxBase > 0 ? -rand(140, 300) : rand(140, 300);
    },
    sit: function (P, me, tt) { SIT(P); P.aL = P.aR = 22; P.tilt = 2 * Math.sin(tt * .6); P.sy = 1 + .01 * Math.sin(tt * 2); },
    daze: function (P, me, tt) { P.tilt = 6 + 2 * Math.sin(tt * .6); P.brows = "Calm"; P.mouth = "o"; P.aL = P.aR = 4; P.sfx = (me % 8 < 4) ? "ぽけー" : ""; },
    sleep: function (P, me, tt) { SIT(P); P.aL = P.aR = 6; P.eyes = "Sleep"; P.brows = "Calm"; P.mouth = "o"; P.tilt = 9 + 2 * Math.sin(tt * 1.4); P.hy = 6; P.sy = 1 + .015 * Math.sin(tt * 1.4); P.zzz = 1; P.blink = false; },
    jump: function (P, me, tt) {
      var jp = Math.abs(Math.sin(tt * 3.4)), jl = Math.pow(1 - jp, 4);
      P.dy = -80 * jp; P.sy = 1.03 - .08 * jl; P.sx = .99 + .05 * jl; P.aL = P.aR = 10 + 140 * jp; P.legL = P.legR = 18 * jp; P.eyes = "Smile"; P.mouth = "grin"; P.sfx = jp > .95 ? "ぴょん！" : "";
    },
    dash: function (P, me, tt) {
      var dw = me * 16, dc = Math.cos(me * 1.5); P.cx = cxBase + 220 * Math.sin(me * 1.5);
      P.liftL = 14 * Math.max(0, Math.sin(dw)); P.liftR = 14 * Math.max(0, -Math.sin(dw)); P.dy = -8 * Math.abs(Math.sin(dw));
      P.aL = -50 * Math.sin(dw); P.aR = 50 * Math.sin(dw); P.rot = 4 * (dc > 0 ? 1 : -1); P.brows = "Focus"; P.mouth = "open"; P.sfx = "ダダダ";
    },
    swing: function (P, me, tt) {
      var c = me % 1.7, p = c / 1.7, n = Math.floor(me / 1.7);
      if (p < .45) P.aR = 30 + 120 * easeInOut(p / .45); else if (p < .58) P.aR = 150 - 125 * easeOut((p - .45) / .13); else P.aR = 25;
      P.sR = .82; P.hpR = "sword"; P.aL = -6; P.brows = "Focus"; P.mouth = p > .45 && p < .7 ? "open" : "flat";
      P.dy = p > .45 && p < .6 ? 4 : 0;
      if (p > .45) every("sw", n, function () { sndSwish(); });
      P.sfx = p > .45 && p < .8 ? (n % 3 === 2 ? (n + 1) + "回！" : "えいっ！") : "";
    },
    pushup: function (P, me, tt) {
      var c = .5 - .5 * Math.cos(me * 2.6); SIT(P); P.up = 28 + 22 * c; P.aL = P.aR = -16; P.sL = P.sR = 1.14 - .2 * c; P.brows = "Focus";
      P.mouth = c > .6 ? "puff" : "flat"; P.puff = c > .6 ? 1 : 0; P.sfx = c > .9 ? ["いち！", "に！", "さん！", "し！"][Math.floor(me * 2.6 / 6.283) % 4] : "";
    },
    meditate: function (P, me, tt) { SIT(P); P.aL = P.aR = -30; P.sL = P.sR = .95; P.eyes = "Sleep"; P.brows = "Calm"; P.mouth = "flat"; P.sy = 1 + .02 * Math.sin(tt * .9); P.blink = false; P.sfx = (Math.floor(me / 3) % 2) ? "はー…" : "すー…"; },
    sharpen: function (P, me, tt) { SIT(P); P.aL = -20; P.aR = -20 + 9 * Math.sin(tt * 7); P.overL = P.overR = 1; P.held = "swordFlat"; P.hpR = "stone"; P.eyes = "Down"; P.brows = "Focus"; P.mouth = "flat"; P.sfx = (me % 3 < 2) ? "しゃっしゃっ" : ""; },
    shield: function (P, me, tt) { P.aL = -48; P.hpL = "shield"; P.aR = 18; P.brows = "Focus"; P.mouth = "flat"; P.dy = -2 * Math.abs(Math.sin(tt * 2)); P.sfx = me < 3 ? "かまえ！" : ""; },
    watch: function (P, me, tt) { P.aL = P.aR = -72; P.sL = P.sR = .955; P.overL = P.overR = 1; P.held = "swordPlanted"; P.eyes = "Side"; P.brows = "Focus"; P.mouth = "flat"; P.tilt = -4 + 3 * Math.sin(tt * .5); P.sfx = (me % 7 < 2) ? "じーっ" : ""; },
    run: function (P, me, tt) { var w = tt * 10; P.liftL = 18 * Math.max(0, Math.sin(w)); P.liftR = 18 * Math.max(0, -Math.sin(w)); P.dy = -6 * Math.abs(Math.sin(w)); P.aL = -45 * Math.sin(w) - 5; P.aR = 45 * Math.sin(w) - 5; P.mouth = "open"; P.sfx = "ほっほっ"; },
    balance: function (P, me, tt) { P.legL = 52; P.liftL = 26; P.aL = P.aR = 74; P.rot = 3 * Math.sin(tt * 2.3); P.tilt = 5 * Math.sin(tt * 1.7); P.brows = "Focus"; P.mouth = "flat"; P.sfx = Math.abs(Math.sin(tt * 2.3)) > .9 ? "ぐらぐら" : ""; },
    breathe: function (P, me, tt) { var c = me % 5; if (c < 3.6) { P.puff = 1; P.mouth = "puff"; P.brows = "Focus"; P.sfx = "むむむ…"; P.sx = 1.02; } else { P.mouth = "open"; P.sfx = "ぷはっ"; } P.aL = P.aR = 18; },
    polish: function (P, me, tt) { P.aR = -62 + 8 * Math.sin(tt * 8); P.sR = .85; P.hpR = "cloth"; P.aL = 8; P.eyes = "Down"; P.front = "sparkles"; P.sfx = (me % 3 < 2) ? "きゅっきゅっ" : ""; },
    chop: function (P, me, tt) { P.behind = "board"; P.aR = -30 + 9 * Math.abs(Math.sin(tt * 10)); P.hpR = "knife"; P.aL = -28; P.eyes = "Down"; P.sfx = "とんとん"; },
    stir: function (P, me, tt) { P.top = "pot"; P.fx = "steam"; P.aR = -18 + 7 * Math.sin(tt * 4); P.sR = 1 + .05 * Math.cos(tt * 4); P.hpR = "ladle"; P.aL = -10; P.eyes = "Down"; P.sfx = (me % 4 < 2) ? "ぐるぐる" : "ことこと"; },
    taste: function (P, me, tt) {
      var c = me % 4.5, k = c < 1.1 ? easeInOut(c / 1.1) : c < 2.8 ? 1 : c < 3.6 ? 1 - easeInOut((c - 2.8) / .8) : 0;
      P.aR = -40 - 110 * k; P.sR = 1 - .38 * k; P.hpR = "ladleSoup"; P.aL = 8; P.tilt = -4 * k;
      P.mouth = k > .9 ? "sip" : "smile"; P.eyes = k > .9 ? "Smile" : "N"; P.sfx = k > .9 ? (c < 2 ? "ずずっ" : "うん、おいしい") : "";
    },
    fire: function (P, me, tt) { SIT(P); P.aL = P.aR = -20; P.top = "campfire"; P.brows = "Calm"; var b = (me % 3) < 1.8; P.mouth = b ? "o" : "smile"; P.puff = b ? 1 : 0; P.sfx = b ? "ふーっ" : "ぱちぱち"; },
    knead: function (P, me, tt) { P.front = "bowl"; P.aL = -42 + 6 * Math.sin(tt * 5); P.aR = -42 + 6 * Math.sin(tt * 5 + Math.PI); P.dy = 3 * Math.abs(Math.sin(tt * 5)); P.eyes = "Down"; P.sfx = (me % 3 < 2) ? "よいしょ" : ""; },
    plate: function (P, me, tt) { P.front = "plateL"; P.aL = -46; P.aR = -74 + 6 * Math.sin(tt * 3); P.sR = .9; P.hpR = "herb"; P.eyes = "Down"; P.sfx = (me % 6 < 3) ? "きれいにね" : ""; },
    serve: function (P, me, tt) { P.front = "plate"; P.fx = "steam"; P.aL = P.aR = -44; P.eyes = "Smile"; P.mouth = "grin"; P.dy = -2 * Math.abs(Math.sin(tt * 2)); P.sfx = (me % 6 < 3) ? "どうぞ" : ""; },
    wash: function (P, me, tt) { P.top = "tub"; P.aL = -16 + 8 * Math.sin(tt * 7); P.aR = -16 + 8 * Math.sin(tt * 7 + Math.PI); P.sL = P.sR = 1.15; P.eyes = "Down"; P.sfx = "ごしごし"; },
    read: function (P, me, tt) { P.front = "book"; P.aL = P.aR = -46; P.sL = P.sR = .95; P.eyes = "Down"; P.brows = "Calm"; P.mouth = "flat"; P.tilt = 2 * Math.sin(tt * .7); P.hy = 4; },
    map: function (P, me, tt) { P.front = "map"; P.aL = P.aR = -46; P.sL = P.sR = .95; P.eyes = "Down"; P.tilt = 3 * Math.sin(tt * .8); P.sfx = (me % 8 < 3) ? "どこ行こうかな" : ""; },
    fireside: function (P, me, tt) { SIT(P); P.aL = P.aR = -16; P.top = "campfire"; P.brows = "Calm"; P.tilt = 2 * Math.sin(tt * .7); P.sfx = (me % 5 < 2) ? "ぱちぱち" : ""; },
    hum: function (P, me, tt) { P.aL = 16; P.aR = -8; P.tilt = -6 + 4 * Math.sin(tt * 2); P.eyes = "Smile"; P.mouth = Math.sin(tt * 3) > 0 ? "o" : "smile"; P.rot = 2 * Math.sin(tt * 2); P.sfx = (Math.floor(me) % 2) ? "♪" : "♫"; },
    nuts: function (P, me, tt) { var c = me % 3, up = c < 2.2; P.aR = up ? -150 : -40; P.sR = up ? .6 : 1; P.hpR = "nut"; P.aL = 10; P.eyes = "Smile"; P.mouth = up && Math.floor(me * 6) % 2 ? "chew" : "smile"; P.sfx = up ? "ぽりぽり" : ""; },
    star: function (P, me, tt) { P.aR = 140 + 22 * Math.sin(tt * 2); P.sR = .9; P.aL = 10; P.eyes = "Smile"; P.fx = "trail"; P.tilt = -3; },
    letter: function (P, me, tt) { SIT(P); P.held = "paper"; P.hpR = "quill"; P.aR = -34 + 4 * Math.sin(tt * 7); P.aL = -28; P.overR = 1; P.eyes = "Down"; P.sfx = (me % 4 < 2) ? "カキカキ" : ""; },
    furifuri: function (P, me, tt) { P.rot = 6 * Math.sin(tt * 6); P.dy = -3 * Math.abs(Math.sin(tt * 6)); P.cx = cxBase + 10 * Math.sin(tt * 3); P.aL = 20 + 12 * Math.sin(tt * 6); P.aR = 20 - 12 * Math.sin(tt * 6); P.eyes = "Smile"; P.mouth = "grin"; P.sfx = (me % 4 < 2) ? "ふりふり" : ""; },
    funny: function (P, me, tt) {
      var f = Math.floor(me / 1.6) % 3; P.aL = P.aR = 40; P.rot = 2 * Math.sin(tt * 8);
      if (f === 0) { P.mouth = "tongue"; P.brows = "Mix"; P.sfx = "べー"; } else if (f === 1) { P.eyes = "Bare"; P.gy = 22; P.mouth = "oo"; P.brows = "Up"; P.sfx = "ずれー"; } else { P.puff = 1; P.mouth = "puff"; P.sfx = "ぷくー"; }
    },
    tale: function (P, me, tt) { P.aL = 56 + 20 * Math.sin(tt * 3); P.aR = -50 + 20 * Math.sin(tt * 3 + 1); P.sR = .9; P.eyes = "Smile"; P.mouth = Math.floor(tt * 5) % 2 ? "open" : "grin"; P.sfx = (me % 6 < 2) ? "それでね…" : ""; },
    wait: function (P, me, tt) { var c = me % 4; P.aL = P.aR = -30; P.eyes = "Side"; P.brows = "Calm"; P.tilt = -8 + 3 * Math.sin(tt); P.dy = c < .4 ? -10 * Math.sin(Math.PI * c / .4) : 0; P.sfx = (me % 8 < 3) ? "まだかな" : ""; },
    surprise: function (P, me, tt) { P.eyes = "Bare"; P.gy = 46; P.brows = "Up"; P.mouth = "oo"; P.aL = P.aR = 50; P.dy = me < .5 ? -18 * Math.sin(Math.PI * me / .5) : 0; P.sfx = me < 1.6 ? "えっ！？" : ""; P.blink = false; },
    yawn: function (P, me, tt) {
      var y = Math.sin(Math.PI * clamp(me / 3.4, 0, 1)); P.aR = y > .15 ? -150 : 10; P.sR = y > .15 ? .62 : 1;
      P.mouth = y > .3 ? "yawn" : "smile"; P.eyes = y > .2 ? "Sleep" : "N"; P.tear = y > .6 ? 1 : 0; P.sy = 1 + .03 * y; P.sfx = y > .5 ? "ふあぁ…" : ""; P.blink = false;
    },
    stretch: function (P, me, tt) { var s3 = .5 - .5 * Math.cos(2 * Math.PI * (me % 6) / 6); P.aL = P.aR = 10 + 158 * s3; P.sL = P.sR = 1 + .15 * s3; P.eyes = s3 > .4 ? "Sleep" : "N"; P.mouth = s3 > .4 ? "oo" : "smile"; P.dy = -6 * s3; P.sy = 1 + .04 * s3; P.sfx = s3 > .6 ? "んーっ！" : ""; P.blink = false; },
    shiver: function (P, me, tt) { P.aL = P.aR = -64; P.sL = P.sR = .82; P.cx = cxBase + 2 * Math.sin(me * 70); P.brows = "Sad"; P.mouth = "wavy"; P.sfx = "ぶるぶる"; },
    hot: function (P, me, tt) { P.aR = 150 + 12 * Math.sin(me * 14); P.sR = .82; P.hpR = "fan"; P.aL = 10; P.brows = "Sad"; P.mouth = "open"; P.sfx = "あつい～"; },
    growl: function (P, me, tt) { P.aL = P.aR = -40; P.sL = P.sR = .85; P.brows = "Sad"; P.mouth = "flat"; P.sy = 1 + .02 * Math.sin(me * 8); P.sfx = "ぐぅ～"; },
    hiccup: function (P, me, tt) { var hq = me < .25 ? Math.sin(Math.PI * me / .25) : 0; P.dy = -14 * hq; P.brows = "Up"; P.mouth = "o"; P.aL = P.aR = 10 + 20 * hq; P.sfx = me < .6 ? "ヒック！" : ""; once("hic", sndPop); },
    sweat: function (P, me, tt) { P.aR = -158 + 6 * Math.sin(me * 8); P.sR = 1.1; P.hpR = "towel"; P.aL = 10; P.eyes = "Smile"; P.sfx = me > 1.5 ? "ふう" : ""; },
    puff: function (P, me, tt) { P.puff = 1; P.mouth = "puff"; P.brows = "Calm"; P.aL = P.aR = 20; P.sfx = "ぷくー"; }
  };

  var confG = $("confG"), confs = [], confAt = 0;
  function isSelfBdayNow() { return !!(env && env.m === 9 && env.d === 20); }
  function isBdayNow() { return !!(env && env.m === 2 && env.d === 14); }
  function spawnConf(n) {
    for (var i = 0; i < n && confs.length < 90; i++) {
      var el = document.createElementNS(NS, "rect"), w = 8 + Math.random() * 8;
      el.setAttribute("width", w); el.setAttribute("height", w * .55);
      el.style.fill = ["#c94a3a", "#f2c94c", "#3a5aa8", "#4f9a56", "#e98aa8", "#b79be0"][randInt(0, 5)];
      confG.appendChild(el);
      confs.push({ el: el, x: 100 + Math.random() * 1080, y: 20 - Math.random() * 80, vx: rand(-25, 25), vy: rand(90, 190), r: rand(0, 360), vr: rand(-260, 260), ph: rand(0, 6) });
    }
  }
  function stepConf(dt, now) {
    if ((isBdayNow() || isSelfBdayNow()) && now > confAt) { confAt = now + 160; spawnConf(AMP < 1 ? 1 : 2); }
    for (var i = confs.length - 1; i >= 0; i--) {
      var c = confs[i]; c.y += c.vy * dt; c.x += (c.vx + 30 * Math.sin(now / 400 + c.ph)) * dt; c.r += c.vr * dt;
      if (c.y > 1020) { confG.removeChild(c.el); confs.splice(i, 1); continue; }
      c.el.setAttribute("transform", "translate(" + c.x.toFixed(1) + " " + c.y.toFixed(1) + ") rotate(" + c.r.toFixed(0) + ")");
    }
  }
  function stepParticles(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i]; p.life += dt; p.vy += 1400 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      var k = 1 - p.life / p.max;
      if (k <= 0) { drops.removeChild(p.el); particles.splice(i, 1); continue; }
      p.el.setAttribute("cx", p.x); p.el.setAttribute("cy", p.y); p.el.setAttribute("opacity", clamp(k * 1.6, 0, 1));
    }
  }
  var sfxEl = $("sfx"), sfxCur = 0, blinkUntil = 0;

  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tt = now / 1000;
    if (isBase(mode) && now > nextChange) pickState(now);
    envTick(now); talkTick(now);

    var P = newP(); P.cx = cxBase;
    tearK = 0;
    var speed = 7, food = null;
    var me = (now - modeT0) / 1000;

    if (isBase(mode) && modeAt !== null && Math.abs(modeAt - cxBase) > 6) {
      var adir = modeAt > cxBase ? 1 : -1; cxBase += adir * 90 * dt; P.cx = cxBase; walkPose(P, tt * 8, adir);
    } else if (isBase(mode)) {
      SP[mode](P, me, tt, now, dt);
    } else if (mode === "ev") {
      var EE = EVC;
      if (!EE) { endEvent(now); }
      else if (evPhase === 0) {
        if (Math.abs(evX - cxBase) <= 6 || me > 12) { evPhase = 1; modeT0 = now; evSaid = 1; evLine(EE, 0, new Date()); sndPop(); }
        else { var edir = evX > cxBase ? 1 : -1; cxBase += edir * 90 * dt; P.cx = cxBase; walkPose(P, tt * 8, edir); }
      } else {
        var ect = (now - modeT0) / 1000;
        if (evSaid === 1 && EE.say && EE.say.length > 1 && ect > 4.5) { evSaid = 2; evLine(EE, 1, new Date()); }
        (POSE[EE.pose] || POSE.smile)(ect, P, EE.a || {});
        if (EE.hp && !P.hpR) P.hpR = EE.hp;
        if (EE.worn) P.worn = EE.worn;
        if (EE.fx) P.fx = EE.fx;
        if (ect >= EE.dur) endEvent(now);
      }
    } else if (mode === "react") {
      speed = 18; var rt = me, rd = RDUR[rk] || 1.5;
      P.blink = false;
      if (rk === "giggle") { P.eyes = "Smile"; P.mouth = "grin"; P.dy = -6 * Math.abs(Math.sin(rt * 16)); P.aL = P.aR = -30; P.sfx = "えへへ"; }
      else if (rk === "hop") { var hj = rt < .55 ? Math.sin(Math.PI * rt / .55) : 0; P.dy = -50 * hj; P.aL = P.aR = 60; P.brows = "Up"; P.mouth = "oo"; P.sfx = hj > .3 ? "わっ！" : ""; }
      else if (rk === "shy") { POSE.shy(rt, P); }
      else if (rk === "wavebk") { P.aR = 150 + 14 * Math.sin(rt * 9); P.eyes = "Smile"; P.mouth = "grin"; P.sfx = "やっほー"; }
      else if (rk === "bow") { POSE.bow(rt, P); }
      else if (rk === "hifive") { P.aR = 140 + 6 * Math.sin(rt * 10); P.eyes = "Smile"; P.mouth = "grin"; P.sfx = (rt > .5 && rt < 1.2) ? "パチン！" : "ハイタッチ"; if (rt > .5 && !rsaid) { rsaid = true; sndPop(); vibrate(25); } }
      else if (rk === "salute") { POSE.salute(rt, P, {}); }
      else if (rk === "dizzy") { P.tilt = 8 * Math.sin(rt * 4); P.rot = 4 * Math.sin(rt * 4 + 1); P.eyes = "Sleep"; P.mouth = "wavy"; P.aL = 10 + 20 * Math.sin(rt * 4); P.aR = 10 - 20 * Math.sin(rt * 4); P.sfx = "ふらふら"; }
      else if (rk === "shrink") { var sp = rt < .18 ? rt / .18 : Math.max(0, 1 - (rt - .18) / .9); P.sy = 1 - .12 * sp; P.sx = 1 + .06 * sp; P.aL = P.aR = -50 * sp; P.eyes = sp > .4 ? "Sleep" : "N"; P.brows = "Up"; P.mouth = "oo"; P.sfx = sp > .3 ? "ひゃっ" : ""; }
      else if (rk === "glasses") { P.eyes = "Bare"; P.gy = rt < 1.6 ? 46 : 46 * Math.max(0, 1 - (rt - 1.6) / .5); P.brows = "Up"; P.mouth = "oo"; P.aR = -150; P.sR = .7; P.sfx = rt < 1.4 ? "あわわ" : "よいしょ"; }
      else if (rk === "spin") { speed = 30; P.sx = Math.cos(rt * 11); P.dy = -12 * Math.sin(Math.PI * Math.min(1, rt / .95)); P.eyes = "Smile"; P.mouth = "grin"; P.sfx = rt < .9 ? "くるくる" : ""; }
      else if (rk === "nod") { P.hy = 8 * Math.abs(Math.sin(rt * 6)); P.eyes = "Smile"; P.sfx = "うんうん"; }
      else if (rk === "hug") { POSE.hug(rt, P, { sfx: "ぎゅー" }); }
      else { POSE.muscle(rt, P); P.sfx = "えっへん"; }
      if (rt >= rd) { mode = "idle"; modeT0 = now; nextChange = now + rand(7000, 12000); blinkAt = now + 900; }
    } else if (mode === "cry") {
      speed = 10; var cr = me;
      P.aL = P.aR = -150; P.sL = P.sR = .62; P.eyes = "Sleep"; P.brows = "Sad"; P.mouth = (Math.floor(cr * 1.2) % 2) ? "wavy" : "smile"; P.tear = 1; P.rot = 1.5 * Math.sin(cr * 7); P.blink = false;
      P.sfx = (Math.floor(cr * 1.2) % 2) ? "うるうる" : "うれしいなあ";
      if (cr >= 6) { mode = "idle"; modeT0 = now; nextChange = now + rand(7000, 12000); blinkAt = now + 900; }
    } else if (mode === "angry") {
      speed = 20; var ea = me, k = Math.max(0, 1 - ea / angryDur);
      P.brows = "Sad"; P.eyes = "Side"; P.mouth = "wavy"; P.aL = P.aR = -40 + 10 * Math.sin(ea * 20) * k; P.cx = cxBase + 2 * Math.sin(ea * 40) * k; P.tilt = 4 * Math.sin(ea * 6) * k; P.blink = false;
      P.sfx = ea < 1.2 ? "あわわ" : "";
      if (ea >= angryDur) { mode = "idle"; modeT0 = now; nextChange = now + rand(9000, 15000); }
    } else if (mode === "refuse") {
      speed = 14; var er = me;
      P.aL = P.aR = -40; P.sL = P.sR = .85; P.eyes = "Smile"; P.tilt = 5 * Math.sin(er * 12) * Math.max(0, 1 - er / 1.5); P.blink = false;
      if (er > 1.6) { mode = "idle"; modeT0 = now; lockUntil = now + 600; nextChange = now + rand(8000, 12000); }
    } else if (mode === "eat") {
      speed = 16; var e = me, mx = roomX(200), my = roomY(262) - 6;
      P.blink = false;
      if (e < .55) {
        var p = easeInOut(e / .55); P.mouth = "oo"; P.brows = "Up";
        food = { x: mx, y: (FY + 120) + (my - FY - 120) * p, s: 1 + .5 * p };
      } else if (e < 1.9) {
        P.eyes = "Smile"; P.mouth = Math.floor(e * 8) % 2 ? "chew" : "smile"; P.sy = 1 + .02 * Math.sin(e * 14); P.dy = -2 * Math.abs(Math.sin(e * 7));
        P.aR = -150; P.sR = .6;
        food = e < .8 ? { x: mx, y: my, s: 1.5 * (1 - (e - .55) / .25) } : null;
      } else if (e < 2.6) {
        P.eyes = "Smile"; P.mouth = "grin"; P.dy = -14 * Math.sin(Math.PI * (e - 1.9) / .7); P.aL = P.aR = 120;
        if (!rewarded) {
          rewarded = true; var bn = bonusFlag;
          SV.coins += reward; SV.fedCount++; if (SV.fedCount >= FULL_AT) SV.fullSince = Date.now(); commitFeed(foodId); save(); showCoins(); showStreak(); renderZukan(); paintNote();
          coinPop(reward, bn ? "×2" : ""); if (favFlag) sndYum(); else sndCoin(); if (bn) setTimeout(sndCoin, 260); vibrate(25);
          say(bn ? "グミちゃん、3日つづけてくれたね。ボーナスだよ！ ありがとう" : (favFlag ? "グミちゃん、これが食べたかったんだ！ ありがとう" : pick(["ありがとう、グミちゃん。おいしいよ", "グミちゃん、ありがとう。元気が出るよ", "おいしい！ グミちゃん、ありがとう", "グミちゃんがくれると、もっとおいしいんだ"])), 3000);
          if (!shopEl.hidden) renderShop();
        }
      } else { mode = "idle"; modeT0 = now; lockUntil = now + 2500; nextChange = now + rand(7000, 12000); foodG.innerHTML = ""; }
    }

    // まばたき：メガネの奥の目を一瞬とじる
    if (P.blink && P.eyes === "N") {
      if (now > blinkAt && blinkT < 0) blinkT = now;
      if (blinkT >= 0) { if (now - blinkT > 150) { blinkT = -1; blinkAt = now + 1800 + Math.random() * 3200; } else P.eyes = "Sleep"; }
    }

    // なめらかに近づける
    var kf = 1 - Math.exp(-dt * speed);
    for (var i = 0; i < KEYS.length; i++) { var key = KEYS[i]; cur[key] += (P[key] - cur[key]) * kf; }

    // ---- リグに反映 ----
    rootG.setAttribute("transform", "translate(" + (CX + cur.cx).toFixed(1) + " " + FY + ") scale(" + S2 + ") translate(-200 -486)");
    R.dBody.setAttribute("transform", "translate(0 " + cur.dy.toFixed(1) + ") rotate(" + cur.rot.toFixed(2) + " 200 486) translate(200 486) scale(" + cur.sx.toFixed(3) + " " + cur.sy.toFixed(3) + ") translate(-200 -486)");
    var up = cur.up.toFixed(1);
    R.dUpA.setAttribute("transform", "translate(0 " + up + ")");
    R.dUpB.setAttribute("transform", "translate(0 " + up + ")");
    setLeg(R.dLegL, "L", cur.legL, cur.liftL, cur.up); setLeg(R.dLegR, "R", cur.legR, cur.liftR, cur.up);
    var oL = P.overL !== null ? !!P.overL : Math.abs(cur.aL) > 105, oR = P.overR !== null ? !!P.overR : Math.abs(cur.aR) > 105;
    setArm(R.dArmL, "L", cur.aL, cur.sL, oL ? "" : P.hpL, true); setArm(R.dArmR, "R", cur.aR, cur.sR, oR ? "" : P.hpR, true);
    setArm(R.dArmLf, "L", cur.aL, cur.sL, P.hpL, oL); setArm(R.dArmRf, "R", cur.aR, cur.sR, P.hpR, oR);
    R.dHead.setAttribute("transform", "translate(0 " + cur.hy.toFixed(1) + ") rotate(" + cur.tilt.toFixed(2) + " " + NECK[0] + " " + NECK[1] + ")");
    var bare = P.eyes === "Bare";
    if (bare !== rgBare) { rgBare = bare; R.dBare.setAttribute("display", bare ? "inline" : "none"); }
    R.dGlass.setAttribute("transform", "translate(0 " + cur.gy.toFixed(1) + ")");
    rgEye = showOne(R_EYES, bare ? "-" : P.eyes, rgEye); rgBrow = showOne(R_BROWS, P.brows, rgBrow); rgMouth = showOne(R_MOUTH, P.mouth, rgMouth);
    R.dCheek.setAttribute("display", P.puff ? "inline" : "none");
    R.dTear.setAttribute("display", P.tear ? "inline" : "none");
    if (P.worn !== rgWorn) { rgWorn = P.worn; R.dWorn.innerHTML = P.worn ? WORN[P.worn] || "" : ""; }
    R.dCrown.setAttribute("display", (isBdayNow() || isSelfBdayNow()) && !P.worn ? "inline" : "none");
    setSlot("dBehind", P.behind); setSlot("dHeld", P.held); setSlot("dFront", P.front); setSlot("dTop", P.top);
    var shW = (cur.up > 10 ? 158 : 128) * S2;
    shadow.setAttribute("cx", CX + cur.cx); shadow.setAttribute("rx", shW);

    var evOn = mode === "ev" && evPhase === 1 && EVC;
    var kOn = evOn && EVC.id === "m_kusu";
    kusuG.setAttribute("opacity", kOn ? 1 : 0);
    if (kOn) {
      var ko = clamp((kusuT - 1.2) / .5, 0, 1);
      kusuR.setAttribute("transform", "rotate(" + (-105 * ko) + " 912 958)");
      kusuB.setAttribute("opacity", ko); kusuB.setAttribute("transform", "translate(0 " + (-30 * (1 - ko)) + ")");
    }
    fxStep(P.fx, tt, P.fx ? 1 : 0);

    // 擬音
    var sfx = P.sfx || "";
    sfxCur += ((sfx ? 1 : 0) - sfxCur) * Math.min(1, dt * 10);
    if (sfx && sfxEl.textContent !== sfx) sfxEl.textContent = sfx;
    sfxEl.setAttribute("opacity", clamp(sfxCur, 0, 1));
    sfxEl.setAttribute("transform", "translate(" + roomX(345).toFixed(1) + " " + (roomY(110) - 6 * Math.sin(tt * 5)).toFixed(1) + ") rotate(6)");
    stepConf(dt, now);
    zzz.setAttribute("opacity", clamp(cur.zzz, 0, 1));
    zzz.setAttribute("transform", "translate(" + (cur.cx + 70) + " -230)");
    if (cur.zzz > .05) {
      for (var z = 1; z <= 3; z++) { var zp = ((tt * .5 + z * .33) % 1), ze = $("z" + z); ze.setAttribute("transform", "translate(" + (14 * zp) + " " + (-40 * zp) + ")"); ze.setAttribute("opacity", Math.sin(Math.PI * zp)); }
    }
    if (food) { foodG.setAttribute("opacity", 1); foodG.setAttribute("transform", "translate(" + (food.x - 32 * food.s * 1.2) + " " + (food.y - 32 * food.s * 1.2) + ") scale(" + (food.s * 1.2) + ")"); }
    else foodG.setAttribute("opacity", 0);
    stepParticles(dt);

    var busy = !isBase(mode) || now < lockUntil;
    if (busy !== uiBusy) {
      uiBusy = busy;
      var bs = foodsEl.children; for (var j = 0; j < bs.length; j++) bs[j].classList.toggle("lock", busy);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- environment tick ---------- */
  var envSig = "", envAt = 0;
  function applyEnv() {
    env = computeEnv();
    var sig = envSigOf(env);
    if (sig !== envSig) { envSig = sig; renderRoom(); refreshPanels(); }
    else {
      glowG.innerHTML = glowSVG(SV.owned, env);
      nightO.setAttribute("opacity", nightOp(env).toFixed(3));
    }
  }
  function envTick(now) { if (now > envAt) { envAt = now + 15000; applyEnv(); paintNote(); } }

