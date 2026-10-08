  /* ---------- だいなそーの部品（リグ）----------
     座標は「足元 (200,486)」の描画座標。部屋には translate(CX+cx, FY) scale(S2) translate(-200 -486) で置く */
  var rootG = $("root"), shadow = $("shadow"), drops = $("drops"), burst = $("burst"), pre = $("pre"), zzz = $("zzz"), foodG = $("foodG");
  var S2 = 1.2, SH_L = [100, 298], SH_R = [300, 298], HIP_L = [172, 420], HIP_R = [228, 420], NECK = [200, 262], ARM_LEN = 110;
  var HLs = 'fill="none" stroke="#ffffff" stroke-linecap="round"', ENs = 'fill="none" stroke="#a87a2c" stroke-width="1.8" stroke-linecap="round"';
  function rv(x, y, r) { r = r || 5; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#gold)" stroke-width="2"/><circle cx="' + (x - r * .35) + '" cy="' + (y - r * .35) + '" r="' + (r * .35) + '" fill="#fff" stroke="none" opacity=".9"/>'; }
  function gS(inner) { return '<g stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>'; }
  var MIR = 'transform="translate(400 0) scale(-1 1)"';
  var R_SKIRT_BACK = '<path d="M96 380 L304 380 L316 456 C270 466 130 466 84 456Z" fill="url(#armorD)"/><path d="M110 390 L104 450 M290 390 L296 450" stroke="#7d8796" stroke-width="2" opacity=".6"/>';
  var R_SKIRT_L = '<path d="M92 382 L156 384 L150 452 L80 452 C78 430 84 404 92 382Z" fill="url(#armor)"/><path d="M98 388 L100 446" ' + HLs + ' stroke-width="3" opacity=".9"/>' +
    '<path d="M106 392 L110 446 M128 392 L130 446" stroke="url(#gold)" stroke-width="3"/><path d="M140 392 L136 448" stroke="#8f99a8" stroke-width="2" opacity=".6"/>' +
    '<path d="M78 448 C84 440 92 446 96 442 C102 436 110 444 116 440 C122 434 130 442 136 438 C142 434 150 440 152 446 C152 458 146 466 138 464 C130 470 122 462 114 468 C106 472 100 464 92 468 C84 470 76 462 78 448Z" fill="#f7f5ef"/>' +
    '<path d="M86 452 l4 8 M96 450 l3 10 M106 452 l4 9 M118 450 l3 10 M128 452 l4 8 M140 450 l3 9" stroke="#b8b2a4" stroke-width="1.8"/>';
  var R_TORSO =
    '<path d="M108 256 C76 282 70 342 86 380 L314 380 C330 342 324 282 292 256 C264 242 136 242 108 256Z" fill="url(#cloth)"/>' +
    '<path d="M112 262 C90 294 88 340 104 378 L296 378 C312 340 310 294 288 262 C260 248 140 248 112 262Z" fill="url(#armor)"/>' +
    '<path d="M200 262 L200 376 L296 376 C310 340 310 294 288 262 C262 250 220 248 200 250Z" fill="#8f99a8" opacity=".16" stroke="none"/>' +
    '<path d="M200 266 L200 372" stroke="#9aa4b2" stroke-width="3"/><path d="M196 270 L196 368" ' + HLs + ' stroke-width="2" opacity=".9"/>' +
    '<path d="M118 280 C104 304 102 340 112 366" ' + HLs + ' stroke-width="5" opacity=".95"/>' +
    '<path d="M124 270 C106 300 104 342 116 372 M276 270 C294 300 296 342 284 372" fill="none" stroke="url(#gold)" stroke-width="5"/>' +
    '<path d="M132 300 c10 -8 22 -4 22 6 c0 8 -12 10 -14 2 M268 300 c-10 -8 -22 -4 -22 6 c0 8 12 10 14 2 M128 336 c12 -6 22 0 18 10 c-4 8 -14 4 -12 -2 M272 336 c-12 -6 -22 0 -18 10 c4 8 14 4 12 -2" ' + ENs + '/>' +
    '<path d="M176 304 C160 296 140 302 134 318 C146 312 158 314 168 322 M224 304 C240 296 260 302 266 318 C254 312 242 314 232 322" fill="none" stroke="#8a6220" stroke-width="6.5"/>' +
    '<path d="M176 304 C160 296 140 302 134 318 C146 312 158 314 168 322 M224 304 C240 296 260 302 266 318 C254 312 242 314 232 322" fill="none" stroke="url(#gold)" stroke-width="3.5"/>' +
    '<path d="M200 280 L226 290 L224 314 C220 330 210 338 200 344 C190 338 180 330 176 314 L174 290Z" fill="url(#gold)"/>' +
    '<path d="M200 286 L220 294 L218 314 C215 326 208 332 200 336" fill="none" stroke="#8a6220" stroke-width="1.8" opacity=".8"/><path d="M180 294 L182 312" ' + HLs + ' stroke-width="3" opacity=".8"/>' +
    '<circle cx="200" cy="310" r="8" fill="#3d8fb8" stroke-width="2.4"/><circle cx="200" cy="311" r="5" fill="#6cc4e6" stroke="none"/><circle cx="197" cy="307" r="2.2" fill="#fff" stroke="none"/>' +
    '<path d="M100 340 L126 340 M98 356 L124 356 M302 340 L274 340 M300 356 L276 356" stroke="url(#leather)" stroke-width="7"/>' +
    rv(120, 340, 3.5) + rv(118, 356, 3.5) + rv(280, 340, 3.5) + rv(282, 356, 3.5) +
    '<path d="M88 372 L312 372 L314 394 L86 394Z" fill="url(#leather)"/><path d="M92 377 L308 377 M92 389 L308 389" stroke="#a07a54" stroke-width="1.6" stroke-dasharray="5 4" opacity=".9"/>' +
    '<rect x="172" y="364" width="56" height="38" rx="8" fill="url(#gold)"/><rect x="182" y="372" width="36" height="22" rx="5" fill="#9c6e22" stroke-width="2.4"/>' +
    '<path d="M190 383 c6 -8 14 -8 20 0 c-6 8 -14 8 -20 0z" fill="url(#gold)" stroke-width="1.8"/><path d="M178 370 L222 370" ' + HLs + ' stroke-width="2.5" opacity=".85"/>' +
    '<path d="M150 394 L196 394 L194 420 C180 426 160 424 152 418Z" fill="url(#armor)"/><path d="M250 394 L204 394 L206 420 C220 426 240 424 248 418Z" fill="url(#armor)"/>' +
    '<path d="M156 400 L190 400 M244 400 L210 400" ' + HLs + ' stroke-width="2.5" opacity=".9"/>';
  var R_COLLAR = '<ellipse cx="200" cy="276" rx="104" ry="14" fill="#1c2131" opacity=".35" stroke="none" filter="url(#soft)"/>' +
    '<path d="M136 262 C150 238 250 238 264 262 L256 274 C232 262 168 262 144 274Z" fill="url(#armor)"/>' +
    '<path d="M142 266 C164 252 236 252 258 266" fill="none" stroke="url(#gold)" stroke-width="4.5"/><path d="M150 254 C170 244 230 244 250 254" ' + HLs + ' stroke-width="2.5" opacity=".9"/>';
  var R_PAULD_L =
    '<path d="M58 324 C54 308 66 300 82 304 L128 312 C130 324 122 334 108 336 C88 340 66 338 58 324Z" fill="url(#armorD)"/>' +
    '<path d="M62 330 C80 336 104 336 120 330" fill="none" stroke="url(#gold)" stroke-width="3"/>' +
    '<path d="M52 306 C46 288 60 276 80 280 L132 290 C136 304 128 316 112 318 C88 322 62 320 52 306Z" fill="url(#armor)"/>' +
    '<path d="M56 312 C78 320 106 320 126 312" fill="none" stroke="url(#gold)" stroke-width="3.5"/><path d="M60 296 C80 300 108 302 126 298" ' + HLs + ' stroke-width="2.5" opacity=".8"/>' +
    '<path d="M50 290 C40 254 74 232 128 238 C146 254 146 284 132 300 C104 312 70 310 50 290Z" fill="url(#armor)"/>' +
    '<path d="M60 286 C56 262 80 246 120 248" ' + HLs + ' stroke-width="6" opacity=".95"/><path d="M96 300 C114 300 128 292 134 280" fill="none" stroke="#8f99a8" stroke-width="3" opacity=".6"/>' +
    '<path d="M56 294 C82 306 112 306 134 296" fill="none" stroke="url(#gold)" stroke-width="5"/><path d="M70 262 C86 250 106 246 124 248" fill="none" stroke="url(#gold)" stroke-width="3.5"/>' +
    '<path d="M84 270 c8 -6 18 -2 16 6 c-2 6 -10 4 -10 -1" ' + ENs + '/>' +
    '<path d="M78 252 L88 222 L102 248Z" fill="url(#gold)"/><path d="M84 246 L88 230" ' + HLs + ' stroke-width="2" opacity=".9"/>' + rv(96, 276, 6) + rv(70, 300, 3.5) + rv(122, 300, 3.5);
  var R_SLEEVE = '<path d="M-18 -6 C-30 20 -30 60 -24 84 L20 84 C22 60 22 26 16 -4Z" fill="url(#cloth)"/><path d="M-10 4 C-16 30 -16 60 -12 80" fill="none" stroke="#4a5370" stroke-width="3" opacity=".8"/>';
  var R_GUARD = '<path d="M-26 48 L22 48 L18 96 L-22 96Z" fill="url(#armor)"/><path d="M-20 54 L-18 92" ' + HLs + ' stroke-width="3.5" opacity=".9"/>' +
    '<path d="M10 52 L8 94" stroke="#8f99a8" stroke-width="3" opacity=".5"/><path d="M-25 62 L21 62 M-23 80 L19 80" stroke="url(#gold)" stroke-width="3.5"/><path d="M-26 48 L-32 38 L-14 44" fill="url(#armor)"/>';
  var R_FIST = '<path d="M-22 96 L18 96 C24 114 18 128 -2 128 C-20 128 -28 114 -22 96Z" fill="url(#armor)"/><path d="M-18 108 L14 108" stroke="url(#gold)" stroke-width="3"/>' +
    '<path d="M-14 114 L-12 124 M-4 114 L-3 126 M6 114 L6 124" stroke="#8f99a8" stroke-width="2" opacity=".7"/><path d="M-18 100 C-20 108 -18 116 -14 120" ' + HLs + ' stroke-width="2.5" opacity=".9"/>';
  var R_LEG = '<path d="M-22 -40 L22 -40 L22 12 L-22 12Z" fill="url(#cloth)"/>' +
    '<path d="M-22 -2 L22 -2 L24 50 C24 62 16 66 4 66 L-38 66 C-54 66 -56 52 -46 46 L-24 40Z" fill="url(#armor)"/>' +
    '<path d="M-16 4 L-16 40" ' + HLs + ' stroke-width="3" opacity=".9"/><path d="M-42 50 C-34 46 -24 46 -18 50" ' + HLs + ' stroke-width="2.5" opacity=".9"/>' +
    '<path d="M-22 26 L23 26" stroke="url(#gold)" stroke-width="3.5"/><path d="M-24 0 L0 -22 L24 0 L16 18 L-16 18Z" fill="url(#armor)"/>' +
    '<path d="M-14 6 L0 -8 L14 6" fill="none" stroke="url(#gold)" stroke-width="3"/><path d="M-18 0 L0 -16" ' + HLs + ' stroke-width="2.5" opacity=".9"/>' + rv(0, 10, 3.5);

  var MOUTHS = {
    smile: '<path d="M186 290 Q200 299 214 290" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>',
    grin:  '<path d="M184 286 Q200 306 216 286 Z" fill="#6e2a24" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M192 296 Q200 302 208 296" fill="none" stroke="#c96a5e" stroke-width="3" stroke-linecap="round"/>',
    o:     '<ellipse cx="200" cy="292" rx="5.5" ry="5.5" fill="#6e2a24" stroke="' + INK + '" stroke-width="2.8"/>',
    oo:    '<ellipse cx="200" cy="296" rx="8" ry="9" fill="#6e2a24" stroke="' + INK + '" stroke-width="3"/>',
    chew:  '<path d="M186 290 Q193 296 200 290 Q207 296 214 290" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>',
    flat:  '<path d="M188 292 Q200 295 212 292" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>',
    sip:   '<ellipse cx="202" cy="292" rx="5" ry="4" fill="#6e2a24" stroke="' + INK + '" stroke-width="2.6"/>',
    puff:  '<path d="M192 290 L208 290" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>',
    yawn:  '<ellipse cx="200" cy="292" rx="12" ry="15" fill="#6e2a24" stroke="' + INK + '" stroke-width="3"/>',
    wavy:  '<path d="M184 292 Q189 286 194 292 Q199 298 204 292 Q209 286 214 292" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>',
    open:  '<path d="M186 286 Q200 302 214 286 Z" fill="#6e2a24" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>',
    tongue:'<path d="M184 286 Q200 302 216 286" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/><path d="M196 293 C194 308 210 310 210 294" fill="#e9837a" stroke="' + INK + '" stroke-width="2.6"/>'
  };
  var EYES = ["N", "Smile", "Side", "Sleep", "Down"], BROWS = ["N", "Up", "Sad", "Calm", "Focus", "Mix"];
  var WORN = {
    towel: '<path d="M64 150 C60 80 120 34 200 34 C280 34 340 80 336 150 C300 130 100 130 64 150Z" fill="#fbfaf4" stroke="' + INK + '" stroke-width="3.5"/><path d="M110 90 C150 66 250 66 290 90" fill="none" stroke="#d6d2c4" stroke-width="4"/><path d="M300 120 C330 130 344 160 336 190" fill="#fbfaf4" stroke="' + INK + '" stroke-width="3.5"/>',
    nightcap: '<path d="M70 150 C70 70 150 30 220 40 C290 50 330 90 350 40 C370 30 380 60 366 80 C350 100 340 120 330 150 C280 132 120 132 70 150Z" fill="#5a6ab8" stroke="' + INK + '" stroke-width="3.5"/><circle cx="364" cy="44" r="16" fill="#fbfaf4" stroke="' + INK + '" stroke-width="3"/><path d="M70 150 C120 132 280 132 330 150 L332 164 C280 148 120 148 68 164Z" fill="#fbfaf4" stroke="' + INK + '" stroke-width="3"/>',
    leafcrown: '<path d="M80 120 C120 90 280 90 320 120" fill="none" stroke="#4f9a56" stroke-width="10"/><path d="M110 104 l-10 -22 l20 10z M160 92 l-6 -24 l18 14z M200 88 l0 -26 l12 20z M240 92 l6 -24 l8 22z M290 104 l10 -22 l4 24z" fill="#7fbf5a" stroke="' + INK + '" stroke-width="2.5"/>'
  };
  var CROWN = '<path d="M150 60 L140 8 L172 34 L200 -6 L228 34 L260 8 L250 60 C230 70 170 70 150 60Z" fill="url(#gold)" stroke="' + INK + '" stroke-width="3.5"/><circle cx="200" cy="40" r="9" fill="#c9304a" stroke="' + INK + '" stroke-width="2.5"/><circle cx="166" cy="48" r="6" fill="#3d8fb8" stroke="' + INK + '" stroke-width="2"/><circle cx="234" cy="48" r="6" fill="#3d8fb8" stroke="' + INK + '" stroke-width="2"/>';
  var TEAR = '<path d="M120 236 C112 252 114 262 122 262 C130 262 132 252 120 236Z M280 236 C272 252 274 262 282 262 C290 262 292 252 280 236Z" fill="#a9dcef" stroke="' + INK + '" stroke-width="3"/>';

  // ---- 小道具 ----
  function pS(inner, w) { return '<g stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>'; }
  function swordAt(x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')">' + pS(
      '<path d="M-9 -10 L-9 -150 L0 -170 L9 -150 L9 -10Z" fill="url(#armor)"/><path d="M0 -16 L0 -160" stroke="#8f99a8" stroke-width="2.5"/><path d="M-5 -16 L-5 -148" ' + HLs + ' stroke-width="2.5" opacity=".95"/>' +
      '<rect x="-6" y="-6" width="12" height="34" rx="3" fill="url(#leather)"/><path d="M-6 2 L6 6 M-6 10 L6 14 M-6 18 L6 22" stroke="#a07a54" stroke-width="1.6"/>' + rv(0, 34, 8) +
      '<path d="M-30 -12 L30 -12 L26 0 L-26 0Z" fill="url(#gold)"/><path d="M-26 -9 L26 -9" ' + HLs + ' stroke-width="2" opacity=".85"/>' + rv(0, -6, 4)) + '</g>';
  }
  var ICON_G = function (id, s) { return '<g transform="scale(' + (s || .8) + ') translate(-32 -32)">' + (ICONS[id] || "") + '</g>'; };
  var HP = {  // 手に持つもの（腕の座標：こぶしの中心 (-2,110)、腕は +y 方向）
    sword: '<g transform="translate(-2 110) rotate(180) translate(0 -11)">' + swordAt(0, 0, 0) + '</g>',
    shield: '<g transform="translate(-2 110)">' + pS('<circle r="64" fill="url(#armor)"/><circle r="56" fill="none" stroke="url(#gold)" stroke-width="6"/><path d="M0 -34 L24 0 L0 34 L-24 0Z" fill="url(#gold)"/><circle r="9" fill="#3d8fb8"/><circle cx="-3" cy="-3" r="3" fill="#fff" stroke="none"/><path d="M-44 -24 C-36 -42 -18 -52 0 -54" ' + HLs + ' stroke-width="5" opacity=".9"/>', 3.5) + '</g>',
    knife: '<g transform="translate(-2 110)">' + pS('<rect x="-5" y="-14" width="10" height="26" rx="3" fill="url(#leather)"/><path d="M-7 12 L7 12 L8 60 C0 66 -8 60 -8 52Z" fill="url(#armor)"/><path d="M-3 16 L-3 54" ' + HLs + ' stroke-width="2"/>') + '</g>',
    ladle: '<g transform="translate(-2 110)">' + pS('<path d="M0 0 L0 64" stroke="#8a6a46" stroke-width="7"/><ellipse cx="0" cy="70" rx="14" ry="9" fill="#8a6a46"/>') + '</g>',
    ladleSoup: '<g transform="translate(-2 110)">' + pS('<path d="M0 0 L0 60" stroke="#8a6a46" stroke-width="7"/><ellipse cx="0" cy="66" rx="14" ry="9" fill="#8a6a46"/><ellipse cx="0" cy="64" rx="10" ry="5" fill="#d9a35a" stroke="none"/>') + '</g>',
    cloth: '<g transform="translate(-2 116)">' + pS('<path d="M-20 -14 C-4 -22 14 -16 22 -6 C18 10 4 20 -12 18 C-22 8 -24 -4 -20 -14Z" fill="#8fd0e0"/>') + '</g>',
    towel: '<g transform="translate(-2 116)">' + pS('<path d="M-24 -16 C-4 -26 18 -18 26 -6 C22 14 4 24 -14 22 C-26 10 -28 -4 -24 -16Z" fill="#fbfaf4"/><path d="M-14 -8 L14 -4" stroke="#d6d2c4" stroke-width="3"/>') + '</g>',
    fan: '<g transform="translate(-2 110) rotate(180)">' + pS('<path d="M0 0 L0 -26" stroke="#6b4a32" stroke-width="5"/><path d="M0 -24 C-34 -30 -38 -78 0 -86 C38 -78 34 -30 0 -24Z" fill="#7fbf5a"/><path d="M0 -28 L0 -80" stroke="#5a9044" stroke-width="3"/>') + '</g>',
    quill: '<g transform="translate(-2 110) rotate(200)">' + pS('<path d="M0 30 L0 -10" stroke="#3a2a20" stroke-width="3"/><path d="M0 -6 C-14 -20 -12 -50 0 -64 C10 -50 12 -20 0 -6Z" fill="#fffaf0"/>') + '</g>',
    stone: '<g transform="translate(-2 104)">' + pS('<rect x="-20" y="-10" width="40" height="20" rx="5" fill="#8a8f98"/><path d="M-14 -3 L14 -3" stroke="#b3b8c0" stroke-width="2.5"/>') + '</g>',
    herb: '<g transform="translate(-2 116)">' + pS('<path d="M0 0 l-6 30" stroke="#4f9a56" stroke-width="4"/><ellipse cx="-8" cy="34" rx="8" ry="5" fill="#7fbf5a"/>') + '</g>',
    cup: '<g transform="translate(-2 118)">' + pS('<rect x="-14" y="-14" width="28" height="28" rx="5" fill="#f4efe0"/><path d="M14 -6 q13 2 0 14" fill="none"/>') + '</g>',
    nut: '<g transform="translate(-2 124)">' + pS('<ellipse cx="0" cy="0" rx="10" ry="12" fill="#a9763e"/><path d="M-10 -4 Q0 -16 10 -4" fill="#6b4a32"/>') + '</g>',
    bread: '<g transform="translate(-2 126)">' + pS('<path d="M-26 0 C-30 -24 30 -24 26 0 C20 10 -20 10 -26 0Z" fill="#e0a356"/><path d="M-12 -12 l6 8 M0 -14 l6 8 M12 -12 l6 8" stroke="#a96d2a"/>') + '</g>',
    dango: '<g transform="translate(-2 110)">' + pS('<path d="M0 0 V70" stroke="#c9965a" stroke-width="3.5"/><circle cx="0" cy="22" r="11" fill="#f6b8cc"/><circle cx="0" cy="44" r="11" fill="#fff"/><circle cx="0" cy="64" r="11" fill="#a8d08a"/>') + '</g>',
    flower: '<g transform="translate(-2 110)">' + pS('<path d="M0 0 V50" stroke="#4f9a56" stroke-width="4"/><circle cx="0" cy="58" r="12" fill="#f08aa8"/><circle cx="0" cy="58" r="4" fill="#f2c94c"/>') + '</g>'
  };
  function foodHP(id) { return '<g transform="translate(-2 126)">' + ICON_G(id, .75) + '</g>'; }
  var WP = {  // 体の前・うしろ・足もとに置くもの（体の座標）
    board: pS('<rect x="126" y="404" width="148" height="22" rx="6" fill="#c9965a"/><path d="M134 410 L266 410" stroke="#e2b57c" stroke-width="3"/><path d="M150 398 L206 404 L206 412 L150 412 C140 412 140 398 150 398Z" fill="#f08a3c"/><path d="M206 402 L218 396 M206 406 L220 404" stroke="#4f9a56" stroke-width="4"/><path d="M166 400 L166 412 M182 401 L182 412" stroke="#c96a26" stroke-width="2.5"/>'),
    pot: pS('<path d="M108 416 L292 416 L284 470 C280 484 266 488 250 488 L150 488 C134 488 120 484 116 470Z" fill="#3b3f46"/><ellipse cx="200" cy="416" rx="96" ry="14" fill="#5a3a22"/><ellipse cx="200" cy="416" rx="80" ry="9" fill="#c98a3a" stroke="none"/><path d="M98 428 C86 428 86 446 100 446 M302 428 C314 428 314 446 300 446" fill="none" stroke-width="6"/><path d="M132 450 L268 450" stroke="#585e68"/><path d="M124 430 L130 470" ' + HLs + ' stroke-width="3" opacity=".35"/>'),
    plate: pS('<ellipse cx="200" cy="384" rx="76" ry="20" fill="#fffdf6"/><ellipse cx="200" cy="382" rx="58" ry="12" fill="#f1e9d6" stroke-width="2.5"/><path d="M154 380 C160 344 240 344 246 380Z" fill="#c9773a"/><circle cx="182" cy="366" r="7" fill="#f08a3c" stroke-width="2.5"/><circle cx="214" cy="362" r="6" fill="#f3e2b0" stroke-width="2.5"/><circle cx="202" cy="372" r="5" fill="#4f9a56" stroke-width="2.5"/>'),
    plateL: pS('<ellipse cx="176" cy="386" rx="70" ry="18" fill="#fffdf6"/><ellipse cx="176" cy="384" rx="52" ry="11" fill="#f1e9d6" stroke-width="2.5"/><path d="M136 382 C142 350 210 350 216 382Z" fill="#c9773a"/>'),
    book: pS('<path d="M130 338 L197 346 L197 402 L130 394Z M203 346 L270 338 L270 394 L203 402Z" fill="#8a3a2e"/><path d="M136 334 L197 341 L197 396 L136 389Z M203 341 L264 334 L264 389 L203 396Z" fill="#fbf4e2" stroke-width="2.5"/><path d="M146 350 L186 355 M146 364 L186 369 M214 355 L254 350 M214 369 L254 364" stroke="#c9b48c" stroke-width="2.5"/>', 3),
    map: pS('<path d="M114 332 L286 332 L286 406 L114 406Z" fill="#f3e2b4"/><path d="M140 386 C170 352 210 392 250 356" fill="none" stroke="#b5462e" stroke-width="3.5" stroke-dasharray="7 6"/><path d="M244 348 l12 12 M256 348 l-12 12" stroke="#b5462e" stroke-width="4"/><path d="M130 358 l12 -18 l12 18 M160 354 l10 -14 l10 14" fill="none" stroke="#7a6a4a"/>'),
    bowl: pS('<path d="M138 380 L262 380 C258 420 230 432 200 432 C170 432 142 420 138 380Z" fill="#c9965a"/><ellipse cx="200" cy="380" rx="62" ry="10" fill="#a9763e"/><path d="M160 380 C164 358 236 358 240 380" fill="#fbeed2" stroke-width="3.5"/>'),
    tub: pS('<path d="M108 432 L292 432 L280 490 L120 490Z" fill="#b98a52"/><path d="M112 452 L288 452 M116 472 L284 472" stroke="#7a5a3a" stroke-width="4"/><ellipse cx="200" cy="432" rx="92" ry="12" fill="#bfe3f0"/><circle cx="160" cy="418" r="13" fill="#fff"/><circle cx="182" cy="408" r="9" fill="#fff"/><circle cx="230" cy="416" r="14" fill="#fff"/><circle cx="256" cy="402" r="8" fill="#fff"/>'),
    campfire: pS('<path d="M150 492 L250 476 M250 492 L150 476" stroke="#6b4a32" stroke-width="12"/>') + '<g transform="translate(200 486)">' + flameSVG(1.1) + '</g>',
    swordFlat: pS('<path d="M152 388 L302 388 L320 396 L302 404 L152 404Z" fill="url(#armor)"/><path d="M158 396 L308 396" stroke="#8f99a8" stroke-width="3"/><path d="M148 372 L152 420 L140 420 L136 372Z" fill="url(#gold)"/><rect x="106" y="390" width="34" height="12" rx="3" fill="url(#leather)"/>' + rv(102, 396, 8)),
    paper: pS('<path d="M142 398 L250 392 L254 432 L146 438Z" fill="#fffaf0"/><path d="M156 408 L226 404 M158 422 L206 419" stroke="#9aa0a8" stroke-width="2.5"/><path d="M226 418 c4 -8 14 -8 12 2 c-2 8 -12 6 -12 -2z" fill="#e9837a" stroke-width="2"/>'),
    swordPlanted: swordAt(200, 341, 180),
    sparkles: '<path d="M252 296 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4z M160 330 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3z" fill="#fff8c8" stroke="#e2b04a" stroke-width="2"/>'
  };

  // ---- リグの組み立て（起動時に1回）----
  function armG(id, fore) {
    return '<g id="' + id + '"><g class="seg">' + (fore ? "" : R_SLEEVE) + R_GUARD + '</g><g class="fist">' + R_FIST + '</g><g class="hp"></g></g>';
  }
  var head = '<g transform="translate(40 30) scale(.8)"><use href="#head"/><g id="dCheek" display="none"><use href="#cheekPuff"/></g>' +
    '<g id="dBrows">' + BROWS.map(function (b) { return '<use href="#brows' + b + '" data-k="' + b + '"/>'; }).join("") + '</g>' +
    '<g id="dBare" display="none"><use href="#eyesBare"/></g>' +
    '<g id="dGlass"><use href="#lenses"/><g id="dEyes">' + EYES.map(function (e) { return '<use href="#eyes' + e + '" data-k="' + e + '"/>'; }).join("") + '</g><use href="#frame"/></g>' +
    '<g id="dMouth">' + Object.keys(MOUTHS).map(function (k) { return '<g data-k="' + k + '">' + MOUTHS[k] + '</g>'; }).join("") + '</g>' +
    '<g id="dTear" display="none">' + TEAR + '</g><g id="dWorn"></g><g id="dCrown" display="none">' + CROWN + '</g></g>';
  rootG.innerHTML =
    '<g id="dBody"><g id="dUpA">' + gS(R_SKIRT_BACK + R_SKIRT_L + '<g ' + MIR + '>' + R_SKIRT_L + '</g>') + '</g>' +
    gS('<g id="dLegL">' + R_LEG + '</g><g id="dLegR">' + R_LEG + '</g>') +
    '<g id="dUpB">' + gS(R_TORSO) + '<g id="dBehind"></g>' + gS(armG("dArmL") + armG("dArmR")) +
    gS(R_PAULD_L + '<g ' + MIR + '>' + R_PAULD_L + '</g>' + R_COLLAR) +
    '<g id="dHead">' + head + '</g><g id="dHeld"></g>' + gS(armG("dArmLf", 1) + armG("dArmRf", 1)) + '<g id="dFront"></g></g>' +
    '<g id="dTop"></g></g>';
  var R = {};
  ["dBody", "dUpA", "dUpB", "dLegL", "dLegR", "dArmL", "dArmR", "dArmLf", "dArmRf", "dHead", "dHeld", "dFront", "dBehind", "dTop", "dCheek", "dBare", "dGlass", "dTear", "dWorn", "dCrown"].forEach(function (k) { R[k] = $(k); });
  ["dArmL", "dArmR", "dArmLf", "dArmRf"].forEach(function (k) { var e = R[k]; e._seg = e.querySelector(".seg"); e._fist = e.querySelector(".fist"); e._hp = e.querySelector(".hp"); e._hpk = null; });
  function kids(id) { var o = {}; Array.prototype.forEach.call($(id).children, function (c) { o[c.getAttribute("data-k")] = c; }); return o; }
  var R_EYES = kids("dEyes"), R_BROWS = kids("dBrows"), R_MOUTH = kids("dMouth");
  function showOne(map, k, prev) { if (prev === k) return k; for (var x in map) map[x].setAttribute("display", x === k ? "inline" : "none"); return k; }
  var rgEye = null, rgBrow = null, rgMouth = null, rgBare = null, rgWorn = null, rgSlots = { dBehind: "", dHeld: "", dFront: "", dTop: "" };
  function setArm(el, side, a, s, hpk, vis) {
    if (!vis) { if (el._v !== 0) { el.setAttribute("display", "none"); el._v = 0; } return; }
    if (el._v !== 1) { el.setAttribute("display", "inline"); el._v = 1; }
    var p = side === "L" ? SH_L : SH_R;
    el.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ")" + (side === "R" ? " scale(-1 1)" : "") + " rotate(" + a.toFixed(1) + ")");
    el._seg.setAttribute("transform", "scale(1 " + s.toFixed(3) + ")");
    el._fist.setAttribute("transform", "translate(0 " + (ARM_LEN * s - ARM_LEN).toFixed(1) + ")");
    el._hp.setAttribute("transform", "translate(0 " + (ARM_LEN * s - ARM_LEN).toFixed(1) + ")");
    if (el._hpk !== hpk) { el._hpk = hpk; el._hp.innerHTML = !hpk ? "" : hpk.indexOf("food:") === 0 ? foodHP(hpk.slice(5)) : (HP[hpk] || ""); }
  }
  function setLeg(el, side, r, lift, up) {
    var p = side === "L" ? HIP_L : HIP_R;
    el.setAttribute("transform", "translate(" + p[0] + " " + (p[1] - lift + up).toFixed(1) + ")" + (side === "R" ? " scale(-1 1)" : "") + " rotate(" + r.toFixed(1) + ")");
  }
  function setSlot(id, key) { if (rgSlots[id] !== key) { rgSlots[id] = key; R[id].innerHTML = key ? (WP[key] || "") : ""; } }
  // 手（こぶし）の位置：描画座標
  function handPos(side, a, s) { var r = a * Math.PI / 180, L = ARM_LEN * (s || 1); return side === "L" ? [SH_L[0] - L * Math.sin(r), SH_L[1] + L * Math.cos(r)] : [SH_R[0] + L * Math.sin(r), SH_R[1] + L * Math.cos(r)]; }
  // 描画座標 → 部屋の座標
  function roomX(x) { return CX + cur.cx + (x - 200) * S2; }
  function roomY(y) { return FY + (y - 486 + cur.dy + cur.up) * S2; }

  /* ---------- speech / coin pop ---------- */
  var sayEl = $("say"), sayTimer = 0;
  function sayMs(text, ms) { return (ms || 2400) + 120 * String(text).length; }
  function say(text, ms) {
    sayEl.textContent = text; sayEl.className = "say"; sayEl.hidden = false;
    sayEl.style.animation = "none"; void sayEl.offsetWidth; sayEl.style.animation = "";
    clearTimeout(sayTimer); sayTimer = setTimeout(function () { sayEl.hidden = true; }, sayMs(text, ms));
  }
  function coinPop(n, tag) {
    var el = document.createElement("div");
    el.className = "pop" + (n === 0 ? " zero" : ""); el.textContent = "+" + fmt(n) + (tag ? " " + tag : "");
    $("pops").appendChild(el); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1700);
  }
  function showCoins() { $("coins").textContent = fmt(SV.coins); }
  showCoins();
