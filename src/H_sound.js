  /* ---------- sound（8ビットのレトロRPG風）----------
     iPhone の WebAudio はマナーモードで無音になるため、音を WAV に合成して <audio> で鳴らす（マナーモードでも鳴る） */
  var soundOn = true, sndBtn = $("snd"), SR = 22050, URIS = {}, pool = [], poolI = 0, unlocked = false;
  try { if (localStorage.getItem("dinaso-snd") === "off") soundOn = false; } catch (e) {}
  function paintSnd() { sndBtn.setAttribute("aria-pressed", soundOn ? "true" : "false"); sndBtn.textContent = soundOn ? "音 ON" : "音 OFF"; }
  paintSnd();
  function synth(evs) {
    var len = 0; evs.forEach(function (e) { len = Math.max(len, e.t + e.d); });
    var N = Math.ceil((len + .05) * SR), out = new Float32Array(N);
    evs.forEach(function (e) {
      var i0 = Math.floor(e.t * SR), n = Math.floor(e.d * SR), att = e.att || .02, ph = 0, z1 = 0, z2 = 0, rnd = 12345 + Math.floor(e.t * 1000);
      for (var i = 0; i < n; i++) {
        var tt = i / SR, pr = tt / e.d, f = e.f0 * Math.pow(e.f1 / e.f0, pr);
        var env = tt < att ? .0001 * Math.pow(e.v / .0001, tt / att) : e.v * Math.pow(.0001 / e.v, (tt - att) / Math.max(.001, e.d - att));
        var x;
        if (e.k === "t") {
          ph += f / SR; var u = ph % 1;
          x = e.type === "square" ? (u < .5 ? 1 : -1) * .6 : e.type === "pulse" ? (u < .25 ? 1 : -1) * .6 : e.type === "pulse12" ? (u < .125 ? 1 : -1) * .6
            : e.type === "sawtooth" ? 2 * u - 1 : e.type === "triangle" ? 4 * Math.abs(u - .5) - 1 : Math.sin(2 * Math.PI * ph);
        } else {
          rnd = (rnd * 1664525 + 1013904223) >>> 0; var w = (rnd / 4294967296) * 2 - 1;
          var w0 = 2 * Math.PI * f / SR, al = Math.sin(w0) / (2 * e.q), c = Math.cos(w0), b0 = al, a0 = 1 + al, a1 = -2 * c, a2 = 1 - al;
          var y = (b0 / a0) * w - (a1 / a0) * z1 - (a2 / a0) * z2; z2 = z1; z1 = y; x = y * 3;
        }
        out[i0 + i] += x * env;
      }
    });
    return out;
  }
  function wavUri(f) {
    var n = f.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    function ws(o, t) { for (var i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); }
    ws(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); ws(8, "WAVE"); ws(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); ws(36, "data"); v.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, f[i])) * 32767, true);
    var bytes = new Uint8Array(buf), bin = "";
    for (var j = 0; j < bytes.length; j += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(j, j + 8192));
    return "data:audio/wav;base64," + btoa(bin);
  }
  var T_ = function (t, d, f0, f1, v, type) { return { k: "t", t: t, d: d, f0: f0, f1: f1, v: v, type: type || "sine" }; };
  var N_ = function (t, d, f0, f1, q, v, att) { return { k: "n", t: t, d: d, f0: f0, f1: f1, q: q, v: v, att: att }; };
  var NOTE = (function () { var o = {}, nm = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; for (var oc = 2; oc <= 8; oc++) nm.forEach(function (n, i) { o[n + oc] = 440 * Math.pow(2, (oc - 4) + (i - 9) / 12); }); return o; })();
  function P_(t, d, n, v, type) { var f = NOTE[n]; return T_(t, d, f, f, v, type || "pulse"); }
  function kick(t) { return N_(t, .09, 220, 90, 1, .14, .003); }
  function snare(t) { return N_(t, .11, 3200, 2200, .8, .1, .003); }
  var SPECS = {
    cursor: [P_(0, .06, "G6", .14)],
    clink: [N_(0, .05, 6000, 4000, 1.2, .8, .002), T_(0, .3, 2350, 2340, .06), T_(0, .26, 3420, 3400, .04), T_(0, .2, 5120, 5100, .03), N_(.07, .04, 5000, 3500, 1.2, .45, .002)],
    tap: [P_(0, .08, "C6", .12), P_(.07, .08, "E6", .12), P_(.14, .2, "G6", .12), P_(0, .34, "C5", .1, "triangle"), T_(.14, .3, NOTE.G7, NOTE.G7, .02)],
    sparkle: ["E6", "G6", "C7", "E7"].map(function (n, i) { return P_(i * .04, .12, n, .08); }).concat([T_(.12, .4, NOTE.E7, NOTE.E7, .03)]),
    oops: [P_(0, .15, "G5", .14, "triangle"), T_(.16, .34, NOTE["D#5"], NOTE.D5, .14, "triangle"), T_(.16, .34, NOTE["D#4"], NOTE.D4, .04, "pulse12")],
    munch: [0, .22, .44].reduce(function (a, t) { return a.concat([N_(t, .07, 2200, 1400, 1.5, .6, .003), P_(t, .06, "A3", .1)]); }, []),
    yum: [P_(0, .1, "G5", .1), P_(.09, .1, "C6", .1), P_(.18, .1, "E6", .1), P_(.27, .4, "G6", .1), T_(.27, .4, NOTE.G7, NOTE.G7, .03), P_(0, .6, "C4", .08, "triangle")],
    gold: [P_(0, .07, "A6", .12), P_(.06, .42, "E7", .12), T_(.06, .42, NOTE.E8, NOTE.E8, .025), T_(.06, .42, NOTE.B7, NOTE.B7, .03)],
    swish: [N_(0, .16, 700, 4200, 1.4, .7, .06), N_(.15, .1, 4200, 1500, 1.4, .4, .005)],
    sizzle: [N_(0, .75, 6500, 5000, .7, .45, .03)].concat([.05, .13, .2, .31, .38, .5, .58].map(function (t, i) { return N_(t, .02, 3000 + i * 400, 2500, 2, .5, .001); })),
    buy: [P_(0, .06, "C6", .12), P_(.07, .06, "E6", .12), P_(.15, .07, "A6", .12), P_(.21, .42, "E7", .12), T_(.21, .42, NOTE.B7, NOTE.B7, .03)],
    place: [N_(0, .06, 520, 300, 2.5, .9, .003), T_(0, .13, 190, 140, .2, "triangle"), N_(.08, .03, 3000, 2000, 1.5, .25, .002)],
    snap: [N_(0, .04, 5000, 3000, 1, .8, .002), P_(.03, .06, "C6", .08), P_(.09, .06, "G6", .08), P_(.15, .2, "C7", .08), T_(.15, .3, NOTE.G7, NOTE.G7, .02)],
    ok: [P_(0, .07, "C6", .12), P_(.07, .2, "G6", .12)],
    ng: [P_(0, .2, "G3", .14, "pulse12"), T_(.18, .26, NOTE.D3, NOTE["C#3"], .14, "pulse12")],
    win: (function () {
      var e = [kick(0), snare(.24), kick(.48), snare(.66)];
      [["E6", 0, .1], ["G6", .12, .1], ["C7", .24, .22], ["B6", .48, .08], ["C7", .58, .08], ["E7", .68, .6]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .11)); });
      [["C6", .68, .6], ["G6", .68, .6]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .05, "pulse12")); });
      [["C4", 0, .24], ["G3", .24, .24], ["A3", .48, .2], ["C4", .68, .7]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .16, "triangle")); });
      return e;
    })(),
    lose: (function () {
      var e = [];
      [["G5", 0, .16], ["E5", .18, .16], ["C5", .36, .16], ["D5", .56, .55]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .12, "triangle")); e.push(P_(x[1], x[2], x[0], .03, "pulse12")); });
      [["C4", 0, .5], ["G3", .56, .6]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .1, "triangle")); });
      return e;
    })(),
    fanfare: (function () {
      var e = [snare(0), snare(.06), snare(.12)];
      [["E5", .2, .1], ["G5", .3, .1], ["C6", .4, .3], ["D6", .74, .1], ["C6", .84, .1], ["A5", .94, .24], ["B5", 1.22, .12], ["D6", 1.34, .12], ["G6", 1.46, .42]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .11)); });
      [["C5", .4, .3], ["F5", .94, .24], ["B5", 1.46, .42]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .05, "pulse12")); });
      [["C3", .2, .52], ["F3", .74, .46], ["G3", 1.22, .66], ["C3", 1.94, 1.1]].forEach(function (x) { e.push(P_(x[1], x[2], x[0], .17, "triangle")); });
      ["C6", "E6", "G6", "C7"].forEach(function (n, i) { e.push(P_(1.94 + i * .03, 1.1, n, .07, i % 2 ? "pulse12" : "pulse")); });
      [.2, .74, 1.22, 1.94].forEach(function (t) { e.push(kick(t)); });
      [.47, 1.0, 1.7].forEach(function (t) { e.push(snare(t)); });
      ["C7", "G7", "E7", "C8", "G7", "E8"].forEach(function (n, i) { e.push(T_(2.2 + i * .12, .2, NOTE[n], NOTE[n] * 1.02, .04)); });
      return e;
    })()
  };
  var LEVEL = { cursor: .5, clink: .7, tap: .6, sparkle: .5, oops: .6, munch: .6, yum: .55, gold: .55, swish: .7, sizzle: .5, buy: .55, place: .7, snap: .6, ok: .55, ng: .55, win: .7, lose: .6, fanfare: .8 };
  function getUri(name) {
    if (URIS[name]) return URIS[name];
    var f = synth(SPECS[name]), m = 0, i;
    for (i = 0; i < f.length; i++) m = Math.max(m, Math.abs(f[i]));
    var g = m > 0 ? LEVEL[name] / m : 1;
    for (i = 0; i < f.length; i++) f[i] *= g;
    return (URIS[name] = wavUri(f));
  }
  function mkAudio() { var a = new Audio(); a.preload = "auto"; return a; }
  function playSnd(name) {
    if (!soundOn) return;
    try {
      if (!pool.length) for (var i = 0; i < 4; i++) pool.push(mkAudio());
      var a = pool[poolI++ % pool.length]; a.src = getUri(name); a.currentTime = 0;
      var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
  }
  function unlockAudio() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try {
      if (!pool.length) for (var i = 0; i < 4; i++) pool.push(mkAudio());
      var u = getUri("cursor");
      pool.forEach(function (a) { a.src = u; a.muted = true; var pr = a.play(); if (pr && pr.then) pr.then(function () { a.pause(); a.muted = false; unlocked = true; }).catch(function () { a.muted = false; }); });
    } catch (e) {}
  }
  ["pointerdown", "touchend", "click"].forEach(function (ev) { document.addEventListener(ev, function () { if (!unlocked) unlockAudio(); }, true); });
  sndBtn.addEventListener("click", function () {
    soundOn = !soundOn; paintSnd();
    try { localStorage.setItem("dinaso-snd", soundOn ? "on" : "off"); } catch (e) {}
    if (soundOn) { unlocked = false; unlockAudio(); setTimeout(function () { sndCoin(); }, 60); }
  });
  function sndPop() { playSnd("cursor"); }
  function sndCoin() { playSnd("gold"); }
  function sndClink() { playSnd("clink"); }
  function sndTap() { playSnd("tap"); }
  function sndSparkle() { playSnd("sparkle"); }
  function sndOops() { playSnd("oops"); }
  function sndMunch() { playSnd("munch"); }
  function sndYum() { playSnd("yum"); }
  function sndSwish() { playSnd("swish"); }
  function sndSizzle() { playSnd("sizzle"); }
  function sndBuy() { playSnd("buy"); }
  function sndPlace() { playSnd("place"); }
  function sndShutter() { playSnd("snap"); }
  function sndOk() { playSnd("ok"); }
  function sndNg() { playSnd("ng"); }
  function sndWin() { playSnd("win"); }
  function sndLose() { playSnd("lose"); }
