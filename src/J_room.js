  var DAILY = [
    { id: "d_dragon",    name: "ちいさな竜のぬいぐるみ", price: 90 },
    { id: "d_mushpot",   name: "光るきのこの鉢",   price: 110 },
    { id: "d_crystal",   name: "星読みの水晶玉",   price: 120 },
    { id: "d_cactus",    name: "砂漠のサボテン",   price: 60 },
    { id: "d_diary",     name: "旅の日記",         price: 80 },
    { id: "d_portrait",  name: "仲間の肖像画",     price: 70 },
    { id: "d_doll",      name: "木彫りの人形",     price: 70 },
    { id: "d_lute",      name: "吟遊詩人のリュート", price: 100 },
    { id: "d_goldbag",   name: "幸運のコイン袋",   price: 150 },
    { id: "d_staffs",    name: "杖立て",           price: 80 },
    { id: "d_hourglass", name: "砂時計",           price: 110 },
    { id: "d_chest",     name: "宝箱",             price: 130 }
  ];
  // 限定家具は毎月 9日・19日・29日 に 1つずつ入荷（その日だけ買える）
  var LIMIT_DAYS = [9, 19, 29];
  function limitedOf(d) {
    var slot = LIMIT_DAYS.indexOf(d.getDate());
    if (slot < 0) return null;
    return DAILY[(d.getFullYear() * 36 + d.getMonth() * 3 + slot) % DAILY.length];
  }
  function nextLimitedDate(d) {
    for (var i = 0; i < LIMIT_DAYS.length; i++) if (LIMIT_DAYS[i] > d.getDate()) return new Date(d.getFullYear(), d.getMonth(), LIMIT_DAYS[i]);
    return new Date(d.getFullYear(), d.getMonth() + 1, LIMIT_DAYS[0]);
  }
  var SEASONAL = [
    { id: "s_mask",       months: [1, 2],       name: "魔よけのお面",         price: 100, from: [1, 25],  to: [2, 3],   tag: "節分" },
    { id: "s_snowknight", months: [1, 2],       name: "雪だるまの騎士",       price: 120, from: [1, 11],  to: [2, 20],  tag: "雪の季節" },
    { id: "s_chocobox",   months: [2],          name: "ハートのチョコ箱",     price: 140, from: [2, 1],   to: [2, 14],  tag: "グミちゃんの誕生月" },
    { id: "s_royals",     months: [2, 3],       name: "王さまと王女さまの人形", price: 200, from: [2, 15], to: [3, 3],   tag: "ひなまつり" },
    { id: "s_sakura",     months: [3, 4],       name: "桜の枝",               price: 150, from: [3, 20],  to: [4, 10],  tag: "お花見" },
    { id: "s_dragonflag", months: [4, 5],       name: "竜のぼり",             price: 150, from: [4, 20],  to: [5, 5],   tag: "こどもの日" },
    { id: "s_bouquet",    months: [5],          name: "花束",                 price: 100, from: [5, 1],   to: [5, 14],  tag: "母の日" },
    { id: "s_ajisai",     months: [6],          name: "あじさい",             price: 100, from: [6, 1],   to: [6, 24],  tag: "梅雨" },
    { id: "s_wishsasa",   months: [6, 7],       name: "ねがいごとの笹",       price: 120, from: [6, 25],  to: [7, 7],   tag: "七夕" },
    { id: "s_shellchime", months: [7, 8],       name: "貝がらの風鈴",         price: 100, from: [7, 15],  to: [8, 31],  tag: "夏" },
    { id: "s_himawari",   months: [7, 8],       name: "ひまわり",             price: 120, from: [7, 20],  to: [8, 31],  tag: "夏" },
    { id: "s_crown",      months: [9],          name: "ちいさなかんむり",     price: 140, from: [9, 1],   to: [9, 20],  tag: "なその誕生月" },
    { id: "s_tsukimi",    months: [9, 10],      name: "お月見だんご",         price: 100, from: [9, 10],  to: [10, 10], tag: "お月見" },
    { id: "s_higan",      months: [9],          name: "彼岸花",               price: 100, from: [9, 15],  to: [9, 30],  tag: "秋の彼岸" },
    { id: "s_nutbasket",  months: [9, 10, 11],  name: "木の実のかご",         price: 100, from: [9, 20],  to: [11, 20], tag: "秋" },
    { id: "s_pumpkin",    months: [10],         name: "おばけかぼちゃ",       price: 120, from: [10, 1],  to: [10, 31], tag: "ハロウィン" },
    { id: "s_momiji",     months: [11],         name: "もみじの枝",           price: 100, from: [11, 1],  to: [11, 30], tag: "紅葉" },
    { id: "s_startree",   months: [12],         name: "星かざりの木",         price: 200, from: [12, 1],  to: [12, 25], tag: "冬のおまつり" },
    { id: "s_hearth",     months: [12, 1, 2],   name: "だんろ",               price: 180, from: [12, 1],  to: [2, 28],  tag: "冬" },
    { id: "s_kagami",     months: [12, 1],      name: "鏡もち",               price: 100, from: [12, 26], to: [1, 10],  tag: "お正月" }
  ];
  var ALL_ITEMS = ITEMS.concat(DAILY, SEASONAL);

  function ink(w) { return ' class="ink" stroke-width="' + w + '"'; }
  function at(x, y, inner) { return '<g transform="translate(' + x + ' ' + y + ')">' + inner + '</g>'; }
  var HLW = ' fill="none" stroke="#fff" stroke-linecap="round" opacity=".55"';   // ハイライト
  var SHD = ' fill="#2a1d14" opacity=".14" stroke="none"';                     // 影
  function flameSVG(s) {
    s = s || 1;
    return '<g transform="scale(' + s + ')"><path class="flame" d="M0 -64 C14 -44 28 -30 22 -10 C16 4 -16 4 -22 -10 C-28 -30 -10 -38 0 -64Z" fill="#f08a3c"' + ink(3) + '/>' +
      '<path class="flame" style="animation-delay:-.2s" d="M0 -38 C8 -26 14 -18 10 -8 C6 0 -6 0 -10 -8 C-14 -18 -6 -24 0 -38Z" fill="#f8d65a"/></g>';
  }
  var DRAW = {
    d_dragon: function () {
      return at(330, 1088,
        '<path d="M28 -30 C54 -34 64 -14 52 -4 C46 2 38 -8 40 -16" fill="#7fbf5a"' + ink(3.5) + '/>' +
        '<ellipse cx="0" cy="-24" rx="34" ry="26" fill="#8fcf6a"' + ink(3.5) + '/><ellipse cx="0" cy="-18" rx="20" ry="14" fill="#f3e6b0"' + ink(2.5) + '/>' +
        '<path d="M-22 -40 L-34 -64 L-12 -50Z M-4 -48 L-6 -72 L10 -52Z" fill="#f2c94c"' + ink(3) + '/>' +
        '<circle cx="-6" cy="-70" r="26" fill="#8fcf6a"' + ink(3.5) + '/><path d="M-26 -84 L-34 -100 L-18 -92Z M14 -86 L22 -102 L4 -94Z" fill="#f3e6b0"' + ink(3) + '/>' +
        '<circle cx="-15" cy="-72" r="4" fill="#2a1d14"/><circle cx="5" cy="-72" r="4" fill="#2a1d14"/><path d="M-12 -60 Q-6 -56 0 -60" fill="none"' + ink(2.5) + '/>' +
        '<path d="M-20 -62 C-24 -78 -12 -92 6 -90"' + HLW + ' stroke-width="4"/>');
    },
    d_mushpot: function () {
      return at(480, 1100,
        '<path d="M-40 -34 H40 L32 0 H-32Z" fill="#a9643e"' + ink(3.5) + '/><path d="M-40 -34 H40" stroke="#c9845a" stroke-width="6"/>' +
        '<circle cx="-14" cy="-58" r="22" fill="#7fd6e8" opacity=".35"/><circle cx="16" cy="-70" r="26" fill="#a7f0c8" opacity=".35"/>' +
        '<path d="M-18 -36 V-52 M14 -36 V-62 M-2 -36 V-46" ' + ink(5) + '/>' +
        '<path d="M-34 -52 Q-18 -76 -2 -52Z" fill="#6fd0e0"' + ink(3) + '/><path d="M-4 -62 Q16 -92 34 -62Z" fill="#8ff0b8"' + ink(3) + '/><path d="M-14 -46 Q-2 -62 10 -46Z" fill="#f2e04a"' + ink(3) + '/>' +
        '<circle cx="-22" cy="-60" r="2.5" fill="#fff"/><circle cx="10" cy="-74" r="3" fill="#fff"/>');
    },
    d_crystal: function () {
      return at(820, 1100,
        '<path d="M-36 0 L-26 -20 H26 L36 0Z" fill="#7a5a3a"' + ink(3.5) + '/><path d="M-20 -20 L-14 -30 H14 L20 -20Z" fill="url(#gold)"' + ink(3) + '/>' +
        '<circle cx="0" cy="-62" r="34" fill="#b9a4e8" fill-opacity=".85"' + ink(3.5) + '/><circle cx="0" cy="-62" r="22" fill="#e6dcff" opacity=".6"/>' +
        '<path d="M-18 -78 Q-10 -90 4 -90"' + HLW + ' stroke-width="5"/><path d="M8 -60 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3z" fill="#fff"/>');
    },
    d_cactus: function () {
      return at(1000, 1110,
        '<path d="M-34 -30 H34 L28 0 H-28Z" fill="#c8734a"' + ink(3.5) + '/>' +
        '<path d="M-12 -30 V-110 C-12 -126 12 -126 12 -110 V-30Z" fill="#6aa856"' + ink(3.5) + '/>' +
        '<path d="M12 -64 H24 C30 -64 32 -70 32 -78 V-92 C32 -100 24 -100 24 -92 V-78 H12Z" fill="#6aa856"' + ink(3) + '/>' +
        '<path d="M-12 -54 H-22 C-28 -54 -30 -60 -30 -66 V-80 C-30 -88 -22 -88 -22 -80 V-66 H-12Z" fill="#6aa856"' + ink(3) + '/>' +
        '<path d="M-4 -110 V-36 M4 -112 V-36" stroke="#4f8a3e" stroke-width="2"/><circle cx="0" cy="-124" r="7" fill="#f08aa8"' + ink(2.5) + '/>');
    },
    d_diary: function () {
      return at(760, 1120,
        '<path d="M-56 -8 L-2 -2 L-2 8 L-56 2Z" fill="#7a3a2a"' + ink(3) + '/><path d="M2 -2 L56 -8 L56 2 L2 8Z" fill="#7a3a2a"' + ink(3) + '/>' +
        '<path d="M-52 -14 L-2 -8 L-2 0 L-52 -6Z M2 -8 L52 -14 L52 -6 L2 0Z" fill="#fbf2dc"' + ink(2.5) + '/>' +
        '<path d="M-44 -10 L-12 -6 M12 -6 L44 -10" stroke="#a89878" stroke-width="2"/><path d="M30 -12 L36 10" stroke="#c94a3a" stroke-width="3"/>');
    },
    d_portrait: function () {
      return at(850, 250,
        '<rect x="-60" y="-70" width="120" height="140" rx="6" fill="url(#gold)"' + ink(4) + '/><rect x="-46" y="-56" width="92" height="112" fill="#e8dcc0"' + ink(3) + '/>' +
        '<circle cx="-16" cy="-12" r="14" fill="#83bd66"' + ink(2.5) + '/><path d="M-30 -16 Q-16 -36 -2 -16" fill="#f0d07a"' + ink(2) + '/><path d="M-34 40 Q-16 6 2 40Z" fill="#e8ecf0"' + ink(2.5) + '/>' +
        '<circle cx="18" cy="-8" r="13" fill="#f2d6b8"' + ink(2.5) + '/><path d="M4 -10 Q18 -30 32 -10 Q30 4 34 14 Q18 8 4 14 Q8 4 4 -10Z" fill="#6b4a32"' + ink(2) + '/><path d="M2 40 Q18 10 34 40Z" fill="#d97a8a"' + ink(2.5) + '/>');
    },
    d_doll: function () {
      return at(420, 1080,
        '<ellipse cx="0" cy="-4" rx="24" ry="6" fill="#8a6a46"' + ink(3) + '/><path d="M-16 -4 C-20 -30 -14 -48 0 -50 C14 -48 20 -30 16 -4Z" fill="#c9965a"' + ink(3) + '/>' +
        '<circle cx="0" cy="-64" r="17" fill="#d9a86a"' + ink(3) + '/><path d="M-8 -66 h3 M5 -66 h3" stroke="#2a1d14" stroke-width="3" stroke-linecap="round"/><path d="M-5 -58 Q0 -55 5 -58" fill="none"' + ink(2) + '/>' +
        '<path d="M-10 -30 Q0 -24 10 -30 M-8 -18 Q0 -12 8 -18" fill="none" stroke="#8a5a2a" stroke-width="2"/>');
    },
    d_lute: function () {
      return at(900, 930,
        '<g transform="rotate(-14)"><path d="M-6 -150 L6 -150 L6 -60 L-6 -60Z" fill="#8a5a3a"' + ink(3) + '/><path d="M-12 -170 L12 -170 L8 -150 L-8 -150Z" fill="#6b4a32"' + ink(3) + '/>' +
        '<path d="M0 -70 C40 -70 46 -10 30 6 C18 18 -18 18 -30 6 C-46 -10 -40 -70 0 -70Z" fill="#d99a4a"' + ink(3.5) + '/><circle cx="0" cy="-28" r="12" fill="#5a3a22"' + ink(2.5) + '/>' +
        '<path d="M-3 -150 V2 M3 -150 V2" stroke="#fbf2dc" stroke-width="1.5"/><path d="M-20 -50 C-26 -34 -24 -14 -16 -2"' + HLW + ' stroke-width="4"/></g>');
    },
    d_goldbag: function () {
      return at(560, 1120,
        '<path d="M-34 -4 C-44 -40 -20 -54 -12 -56 L12 -56 C20 -54 44 -40 34 -4 C28 6 -28 6 -34 -4Z" fill="#b8925a"' + ink(3.5) + '/>' +
        '<path d="M-14 -56 L-20 -70 L20 -70 L14 -56" fill="#a07a42"' + ink(3) + '/><path d="M-16 -56 H16" stroke="#c94a3a" stroke-width="5"/>' +
        '<ellipse cx="-30" cy="0" rx="12" ry="5" fill="url(#gold)"' + ink(2.5) + '/><ellipse cx="34" cy="2" rx="12" ry="5" fill="url(#gold)"' + ink(2.5) + '/><ellipse cx="22" cy="-6" rx="10" ry="4" fill="url(#gold)"' + ink(2) + '/>' +
        '<text x="0" y="-18" text-anchor="middle" style="font:700 22px var(--font-display);fill:#f2c94c;stroke:none">G</text>');
    },
    d_staffs: function () {
      return at(1150, 1034,
        '<path d="M-14 -70 L-30 -210 M2 -70 L4 -230 M14 -70 L32 -200" fill="none"' + ink(6) + '/>' +
        '<circle cx="-32" cy="-220" r="12" fill="#e9837a"' + ink(3) + '/><circle cx="4" cy="-242" r="13" fill="#6cc4e6"' + ink(3) + '/><path d="M26 -214 L38 -214 L32 -194Z" fill="#f2e04a"' + ink(3) + '/>' +
        '<path d="M-28 -70 H28 L22 0 H-22 Z" fill="#7a5a3a"' + ink(4) + '/><path d="M-26 -52 H26 M-24 -24 H24" stroke="url(#gold)" stroke-width="4"/>');
    },
    d_hourglass: function () {
      return at(770, 300,
        '<rect x="-52" y="0" width="104" height="10" rx="3" fill="#8a6a4a"' + ink(4) + '/>' +
        '<rect x="-24" y="-6" width="48" height="8" rx="3" fill="url(#gold)"' + ink(3) + '/><rect x="-24" y="-80" width="48" height="8" rx="3" fill="url(#gold)"' + ink(3) + '/>' +
        '<path d="M-18 -72 H18 L3 -38 L18 -6 H-18 L-3 -38Z" style="fill:var(--glass);fill-opacity:.8"' + ink(3.5) + '/>' +
        '<path d="M-12 -14 H12 L4 -26 H-4Z" fill="#e8c25a"/><path d="M-10 -66 H10 L1 -48Z" fill="#e8c25a"/><path d="M0 -44 V-26" stroke="#e8c25a" stroke-width="2"/>');
    },
    d_chest: function () {
      return at(400, 1082,
        '<path d="M-56 -44 H56 V0 H-56Z" fill="#9a5a2e"' + ink(4) + '/><path d="M-56 -44 C-56 -84 56 -84 56 -44Z" fill="#b06a36"' + ink(4) + '/>' +
        '<path d="M-56 -44 H56 M-34 -78 V0 M34 -78 V0" stroke="url(#gold)" stroke-width="7"/><path d="M-56 -44 H56" ' + ink(2) + '/>' +
        '<rect x="-10" y="-52" width="20" height="22" rx="3" fill="url(#gold)"' + ink(2.5) + '/><circle cx="0" cy="-43" r="3" fill="#2a1d14"/>' +
        '<path d="M-48 -56 C-40 -72 -20 -76 -6 -76"' + HLW + ' stroke-width="4"/>');
    },
    // ---- 季節 ----
    s_mask: function () {
      return at(1100, 410,
        '<path d="M-36 -30 L-48 -66 L-20 -44Z M36 -30 L48 -66 L20 -44Z" fill="#f2e6b0"' + ink(3.5) + '/>' +
        '<path d="M0 -48 C34 -48 46 -20 42 8 C38 34 18 46 0 46 C-18 46 -38 34 -42 8 C-46 -20 -34 -48 0 -48Z" fill="#3a8a9a"' + ink(4) + '/>' +
        '<path d="M-30 -10 L-8 -4 M30 -10 L8 -4" stroke="#2a1d14" stroke-width="6" stroke-linecap="round"/><circle cx="-18" cy="4" r="6" fill="#f2e04a"' + ink(2.5) + '/><circle cx="18" cy="4" r="6" fill="#f2e04a"' + ink(2.5) + '/>' +
        '<path d="M-20 24 Q0 14 20 24 Q0 34 -20 24Z" fill="#fbf2dc"' + ink(2.5) + '/><path d="M0 -40 L6 -26 L0 -18 L-6 -26Z" fill="url(#gold)"' + ink(2) + '/>');
    },
    s_snowknight: function () {
      return at(905, 1085,
        '<circle cx="0" cy="-44" r="46" fill="#fbfcff"' + ink(4) + '/><circle cx="0" cy="-118" r="34" fill="#fbfcff"' + ink(4) + '/>' +
        '<path d="M-34 -134 Q0 -176 34 -134 L30 -126 H-30Z" fill="url(#armor)"' + ink(3.5) + '/><path d="M-30 -128 H30" stroke="url(#gold)" stroke-width="4"/><path d="M0 -168 V-180" ' + ink(4) + '/><circle cx="0" cy="-184" r="6" fill="#d94a3a"' + ink(2.5) + '/>' +
        '<circle cx="-12" cy="-116" r="4" fill="#2a1d14"/><circle cx="12" cy="-116" r="4" fill="#2a1d14"/><path d="M-2 -106 L18 -100 L-2 -98Z" fill="#f08a3c"' + ink(2) + '/>' +
        '<path d="M44 -60 L80 -110" ' + ink(5) + '/><path d="M74 -124 L86 -128 L84 -94 L72 -98Z" fill="url(#armor)"' + ink(2.5) + '/>' +
        '<circle cx="0" cy="-60" r="4" fill="#2a1d14"/><circle cx="0" cy="-36" r="4" fill="#2a1d14"/>');
    },
    s_chocobox: function () {
      return at(560, 1110,
        '<path d="M0 -6 C-40 -30 -46 -70 -22 -76 C-10 -78 -2 -70 0 -62 C2 -70 10 -78 22 -76 C46 -70 40 -30 0 -6Z" fill="#c9304a"' + ink(4) + '/>' +
        '<path d="M-40 -46 C-20 -40 20 -40 40 -46" fill="none" stroke="url(#gold)" stroke-width="6"/><path d="M0 -62 C-10 -76 -22 -70 -14 -60 C-8 -56 -2 -58 0 -62 C2 -58 8 -56 14 -60 C22 -70 10 -76 0 -62Z" fill="url(#gold)"' + ink(2.5) + '/>' +
        '<path d="M-26 -66 C-30 -56 -26 -46 -20 -40"' + HLW + ' stroke-width="4"/>');
    },
    s_royals: function () {
      function doll(x, robe, crown) {
        return '<path d="M' + (x - 28) + ' 0 L' + (x - 18) + ' -60 H' + (x + 18) + ' L' + (x + 28) + ' 0Z" fill="' + robe + '"' + ink(3.5) + '/>' +
          '<circle cx="' + x + '" cy="-76" r="18" fill="#f2d6b8"' + ink(3) + '/><path d="M' + (x - 14) + ' -90 L' + (x - 14) + ' -108 L' + (x - 6) + ' -98 L' + x + ' -112 L' + (x + 6) + ' -98 L' + (x + 14) + ' -108 L' + (x + 14) + ' -90Z" fill="url(#gold)"' + ink(2.5) + '/>' +
          '<circle cx="' + (x - 6) + '" cy="-76" r="2.5" fill="#2a1d14"/><circle cx="' + (x + 6) + '" cy="-76" r="2.5" fill="#2a1d14"/>' + (crown || "");
      }
      return at(760, 1060, '<rect x="-80" y="-4" width="160" height="16" fill="#c94a3a"' + ink(3.5) + '/>' + doll(-34, "#3a5aa8") + doll(34, "#e98aa8"));
    },
    s_sakura: function () {
      var d = '<path d="M-26 -50 H26 L20 0 H-20Z" fill="#3a5a8a"' + ink(3.5) + '/><path d="M-24 -40 H24" stroke="#fff" stroke-width="3" opacity=".5"/>' +
        '<path d="M0 -50 Q-10 -110 -40 -160 M0 -50 Q14 -120 40 -180 M-6 -100 Q16 -120 30 -130" fill="none" stroke="#6b4a32" stroke-width="6" stroke-linecap="round"/>';
      [[-40, -160], [40, -180], [30, -130], [-18, -128], [16, -150], [-34, -140], [44, -158]].forEach(function (c) { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="12" fill="#fbd5e0"' + ink(2.5) + '/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="4" fill="#f08aa8"/>'; });
      return at(1000, 1080, d);
    },
    s_dragonflag: function () {
      return at(1150, 700,
        '<path d="M0 -260 V240" ' + ink(6) + '/><circle cx="0" cy="-266" r="10" fill="url(#gold)"' + ink(3) + '/>' +
        '<path d="M0 -230 C-50 -240 -110 -220 -150 -200 L-128 -184 L-150 -168 C-110 -150 -50 -150 0 -160Z" fill="#4f9a56"' + ink(4) + '/>' +
        '<path d="M-20 -224 C-40 -214 -60 -214 -80 -206 M-20 -188 C-40 -180 -60 -180 -80 -174" fill="none" stroke="#8fcf6a" stroke-width="5"/>' +
        '<circle cx="-30" cy="-196" r="10" fill="#fff"' + ink(2.5) + '/><circle cx="-32" cy="-196" r="5" fill="#2a1d14"/><path d="M-6 -230 L10 -248 L4 -226Z" fill="#f2c94c"' + ink(2) + '/>');
    },
    s_bouquet: function () {
      var d = '<path d="M-22 0 L0 -60 L22 0Z" fill="#fbf2dc"' + ink(3.5) + '/><path d="M-12 -24 Q0 -16 12 -24" fill="none" stroke="#c94a3a" stroke-width="5"/>';
      [[-22, -78, "#e9837a"], [0, -92, "#f2c94c"], [22, -78, "#b98ad8"], [-10, -64, "#f08aa8"], [12, -62, "#fff"]].forEach(function (c) { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="14" fill="' + c[2] + '"' + ink(2.5) + '/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="4" fill="#f2c94c"/>'; });
      return at(860, 1100, d);
    },
    s_ajisai: function () {
      var d = '<path d="M-36 -34 H36 L30 0 H-30Z" fill="#a9643e"' + ink(3.5) + '/>';
      [[-20, -60], [10, -72], [26, -52], [-4, -48], [-26, -80], [8, -96]].forEach(function (c, i) { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="17" fill="' + (i % 2 ? "#8aa6e8" : "#b98ad8") + '"' + ink(2.5) + '/><path d="M' + (c[0] - 5) + ' ' + c[1] + ' h10 M' + c[0] + ' ' + (c[1] - 5) + ' v10" stroke="#fff" stroke-width="2.5" opacity=".7"/>'; });
      return at(480, 1090, d + '<path d="M-36 -40 C-50 -50 -54 -66 -44 -72 C-38 -60 -34 -50 -30 -42Z" fill="#5f9a4e"' + ink(2.5) + '/>');
    },
    s_wishsasa: function () {
      var d = '<path d="M0 0 V-300" stroke="#4f9a56" stroke-width="10" stroke-linecap="round"/><path d="M0 -60 L-60 -100 M0 -130 L60 -170 M0 -200 L-56 -240 M0 -260 L40 -290" stroke="#4f9a56" stroke-width="5" stroke-linecap="round"/>';
      [[-60, -100], [60, -170], [-56, -240], [40, -290]].forEach(function (c, i) { d += '<path d="M' + c[0] + ' ' + c[1] + ' l-26 -10 l14 14 l-24 8 l28 2z" fill="#6fb35a"' + ink(2) + '/><rect x="' + (c[0] + 4) + '" y="' + (c[1] + 6) + '" width="14" height="40" fill="' + ["#f2d65a", "#f08aa8", "#8aa6e8", "#fff"][i] + '"' + ink(2) + '/>'; });
      return at(1140, 900, d);
    },
    s_shellchime: function () {
      return at(265, 140,
        '<path d="M0 0 V20" ' + ink(3) + '/><path d="M-24 50 C-24 18 24 18 24 50 L18 46 L12 52 L6 46 L0 52 L-6 46 L-12 52 L-18 46Z" fill="#f8e0d0"' + ink(3) + '/>' +
        '<path d="M-14 46 L-10 28 M0 48 V26 M14 46 L10 28" stroke="#e9a88a" stroke-width="2"/><path class="sway" d="M0 52 V84 M-10 84 H10 L6 112 H-6Z" fill="#9fd6e8"' + ink(2.5) + '/>');
    },
    s_himawari: function () {
      var d = '<path d="M0 0 V-170" stroke="#4f9a56" stroke-width="8"/><path d="M0 -70 C-30 -80 -44 -64 -40 -52 C-24 -50 -10 -58 0 -70Z M0 -110 C30 -120 44 -104 40 -92 C24 -90 10 -98 0 -110Z" fill="#5f9a4e"' + ink(3) + '/>';
      for (var i = 0; i < 12; i++) { var a = i * 30; d += '<ellipse cx="0" cy="-212" rx="10" ry="22" transform="rotate(' + a + ' 0 -182)" fill="#f2c94c"' + ink(2.5) + '/>'; }
      return at(1160, 880, d + '<circle cx="0" cy="-182" r="22" fill="#7a4a24"' + ink(3) + '/><path d="M-30 -2 H30 L24 40 H-24Z" fill="#c8734a"' + ink(3.5) + '/>');
    },
    s_crown: function () {
      return at(980, 1100,
        '<ellipse cx="0" cy="-10" rx="56" ry="18" fill="#c94a3a"' + ink(3.5) + '/><path d="M-40 -16 C-30 -24 30 -24 40 -16" fill="none" stroke="url(#gold)" stroke-width="4"/>' +
        '<path d="M-34 -24 L-38 -70 L-18 -48 L0 -80 L18 -48 L38 -70 L34 -24 C20 -18 -20 -18 -34 -24Z" fill="url(#gold)"' + ink(3.5) + '/>' +
        '<circle cx="0" cy="-42" r="7" fill="#c9304a"' + ink(2) + '/><circle cx="-22" cy="-36" r="5" fill="#3d8fb8"' + ink(2) + '/><circle cx="22" cy="-36" r="5" fill="#3d8fb8"' + ink(2) + '/>' +
        '<path d="M-28 -32 L-30 -56"' + HLW + ' stroke-width="3"/>');
    },
    s_tsukimi: function () {
      var d = '<path d="M-60 0 H60 L52 -24 H-52Z" fill="#c8a066"' + ink(4) + '/><path d="M-44 -24 H44 L36 -40 H-36Z" fill="#fbf2dc"' + ink(3) + '/>';
      [[-24, -54], [0, -54], [24, -54], [-12, -78], [12, -78], [0, -100]].forEach(function (c) { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="14" fill="#fffaf0"' + ink(3) + '/>'; });
      return at(820, 1090, d);
    },
    s_higan: function () {
      var d = '';
      [[-24, -110], [10, -130], [34, -100]].forEach(function (c) {
        d += '<path d="M' + (c[0] * .4) + ' 0 Q' + c[0] + ' ' + (c[1] / 2) + ' ' + c[0] + ' ' + c[1] + '" fill="none" stroke="#4f9a56" stroke-width="5"/>';
        for (var i = 0; i < 6; i++) { var a = i * 60; d += '<path d="M' + c[0] + ' ' + c[1] + ' q12 -18 30 -14 q-12 4 -18 14" fill="none" stroke="#d9304a" stroke-width="4" stroke-linecap="round" transform="rotate(' + a + ' ' + c[0] + ' ' + c[1] + ')"/>'; }
      });
      return at(480, 1100, d);
    },
    s_nutbasket: function () {
      var d = '<path d="M-50 -30 H50 L40 0 H-40Z" fill="#c9965a"' + ink(3.5) + '/><path d="M-46 -20 H46 M-44 -10 H44" stroke="#8a5a2a" stroke-width="2.5"/><path d="M-40 -30 C-40 -80 40 -80 40 -30" fill="none" stroke="#8a5a2a" stroke-width="6"/>';
      [[-28, -36], [-8, -40], [12, -38], [30, -34], [0, -50], [-18, -50], [20, -50]].forEach(function (c, i) { d += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="10" ry="12" fill="' + (i % 2 ? "#a9763e" : "#c98a4a") + '"' + ink(2.5) + '/>'; });
      return at(700, 1110, d);
    },
    s_pumpkin: function () {
      return at(905, 1080,
        '<ellipse cx="-30" cy="-46" rx="32" ry="44" fill="#ee8a3a"' + ink(4) + '/><ellipse cx="30" cy="-46" rx="32" ry="44" fill="#ee8a3a"' + ink(4) + '/><ellipse cx="0" cy="-46" rx="34" ry="48" fill="#f49a46"' + ink(4) + '/>' +
        '<path d="M-4 -92 Q0 -116 14 -120" fill="none" stroke="#4f7a32" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M-30 -60 L-14 -70 L-14 -52Z M30 -60 L14 -70 L14 -52Z" fill="#3a2010"/><path d="M-30 -30 L-18 -22 L-8 -32 L2 -22 L12 -32 L22 -22 L30 -30 L20 -12 L-20 -12Z" fill="#3a2010"/>' +
        '<path d="M-48 -70 C-52 -54 -50 -34 -42 -20"' + HLW + ' stroke-width="4"/>');
    },
    s_momiji: function () {
      var d = '<path d="M-24 -50 H24 L18 0 H-18Z" fill="#6b4a8a"' + ink(3.5) + '/><path d="M0 -50 Q-8 -110 -30 -150 M0 -50 Q16 -100 36 -140" fill="none" stroke="#6b4a32" stroke-width="5" stroke-linecap="round"/>';
      [[-30, -150], [36, -140], [-16, -116], [20, -104], [-36, -124], [8, -150]].forEach(function (c, i) { d += '<path d="M' + c[0] + ' ' + (c[1] - 16) + ' L' + (c[0] + 5) + ' ' + (c[1] - 4) + ' L' + (c[0] + 16) + ' ' + (c[1] - 6) + ' L' + (c[0] + 7) + ' ' + (c[1] + 2) + ' L' + (c[0] + 10) + ' ' + (c[1] + 14) + ' L' + c[0] + ' ' + (c[1] + 6) + ' L' + (c[0] - 10) + ' ' + (c[1] + 14) + ' L' + (c[0] - 7) + ' ' + (c[1] + 2) + ' L' + (c[0] - 16) + ' ' + (c[1] - 6) + ' L' + (c[0] - 5) + ' ' + (c[1] - 4) + 'Z" fill="' + ["#d9402a", "#e07a2f", "#c8302a"][i % 3] + '"' + ink(2) + '/>'; });
      return at(1000, 1080, d);
    },
    s_startree: function () {
      var d = '<rect x="-14" y="-40" width="28" height="40" fill="#6b4a32"' + ink(3.5) + '/>' +
        '<path d="M0 -320 L70 -200 L40 -200 L96 -110 L56 -110 L120 -36 H-120 L-56 -110 L-96 -110 L-40 -200 L-70 -200Z" fill="#3f8a4a"' + ink(4) + '/>' +
        '<path d="M0 -346 L8 -326 L30 -324 L13 -310 L19 -290 L0 -301 L-19 -290 L-13 -310 L-30 -324 L-8 -326Z" fill="url(#gold)"' + ink(3) + '/>';
      [[-30, -180, "#f2c94c"], [36, -150, "#6cc4e6"], [-50, -90, "#e9837a"], [60, -76, "#f2c94c"], [0, -120, "#fff"], [-10, -230, "#e9837a"], [20, -250, "#6cc4e6"]].forEach(function (c) { d += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="9" fill="' + c[2] + '"' + ink(2.5) + '/>'; });
      return at(1120, 1000, d);
    },
    s_hearth: function () {
      return at(850, 940,
        '<path d="M-110 0 V-170 H110 V0Z" fill="#9aa0a8"' + ink(4) + '/><path d="M-110 -120 H110 M-110 -60 H110 M-50 -170 V-120 M40 -170 V-120 M-80 -120 V-60 M10 -120 V-60 M70 -120 V-60" stroke="#6f7680" stroke-width="3"/>' +
        '<path d="M-130 -170 H130 V-196 H-130Z" fill="#6b4a32"' + ink(4) + '/><path d="M-60 0 V-80 C-60 -110 60 -110 60 -80 V0Z" fill="#2a1d14"' + ink(3) + '/>' +
        '<path d="M-44 -6 L40 -20 M-40 -20 L44 -6" stroke="#6b4a32" stroke-width="10" stroke-linecap="round"/>' + at(0, -10, flameSVG(1)));
    },
    s_kagami: function () {
      return at(760, 1100,
        '<path d="M-56 0 H56 L50 -20 H-50Z" fill="#fbf2dc"' + ink(3.5) + '/><ellipse cx="0" cy="-40" rx="50" ry="22" fill="#fffdf6"' + ink(3.5) + '/><ellipse cx="0" cy="-72" rx="36" ry="17" fill="#fffdf6"' + ink(3.5) + '/>' +
        '<circle cx="0" cy="-96" r="14" fill="#f2a83a"' + ink(3) + '/><path d="M-4 -110 l6 -6 l6 4" fill="none" stroke="#4f9a56" stroke-width="3"/>');
    }
  };
  function bdaySVG(mine) {
    var d = '', cols = ["#c94a3a", "#f2c94c", "#3a5aa8", "#4f9a56", "#e98aa8"];
    [[100, 50, 370, 170, 640, 62], [640, 62, 910, 170, 1180, 50]].forEach(function (g) {
      d += '<path d="M' + g[0] + ' ' + g[1] + ' Q' + g[2] + ' ' + g[3] + ' ' + g[4] + ' ' + g[5] + '" fill="none"' + ink(3.5) + '/>';
      for (var i = 1; i <= 7; i++) {
        var t = i / 8, x = (1 - t) * (1 - t) * g[0] + 2 * (1 - t) * t * g[2] + t * t * g[4], y = (1 - t) * (1 - t) * g[1] + 2 * (1 - t) * t * g[3] + t * t * g[5];
        d += '<path d="M' + (x - 18) + ' ' + (y - 2) + ' L' + (x + 18) + ' ' + (y - 2) + ' L' + x + ' ' + (y + 40) + 'Z" fill="' + cols[i % 5] + '"' + ink(3) + '/>';
      }
    });
    d += '<text x="640" y="250" class="burst-text" font-size="54" style="fill:#c94a3a;stroke-width:12px">' + (mine ? "なその たんじょうび" : "グミちゃん おたんじょうび おめでとう！") + '</text>';
    d += at(1020, 1085,
      '<ellipse cx="0" cy="-2" rx="84" ry="14" fill="#f4ead2"' + ink(4) + '/>' +
      '<path d="M-72 -4 V-52 Q0 -34 72 -52 V-4 Q0 12 -72 -4Z" fill="#f7c3d0"' + ink(4.5) + '/>' +
      '<path d="M-50 -52 V-92 Q0 -76 50 -92 V-52 Q0 -36 -50 -52Z" fill="#fff4e0"' + ink(4.5) + '/>' +
      '<path d="M-72 -40 q12 14 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#c94a3a" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="-26" cy="-98" r="7" fill="#d9304a"' + ink(3) + '/><circle cx="24" cy="-100" r="7" fill="#d9304a"' + ink(3) + '/>' +
      [-30, 0, 30].map(function (x) { return '<rect x="' + (x - 4) + '" y="-128" width="8" height="30" fill="#6fb3e0"' + ink(2.5) + '/><ellipse class="flame" cx="' + x + '" cy="-138" rx="6" ry="11" fill="#f6b73a"' + ink(2.5) + '/>'; }).join(''));
    return d;
  }
  var glowG = $("glowG"), nightO = $("nightO");
  function windowSVG(env) {
    var f = env.night ? "--glassN" : (env.rain ? "--glassR" : "--glass");
    var h = '<rect x="170" y="150" width="190" height="270" style="fill:var(' + f + ')"/>';
    // 遠くの山と草原
    h += '<path d="M170 330 L215 280 L248 312 L290 262 L338 318 L360 300 V420 H170Z" style="fill:' + (env.night ? "#2a3550" : "#8fa6b8") + '"/>';
    h += '<path d="M170 372 Q230 350 280 366 Q320 378 360 362 V420 H170Z" style="fill:' + (env.night ? "#22402e" : "#7fb35a") + '"/>';
    if (env.night && !env.rain) {
      h += '<circle cx="300" cy="205" r="22" fill="#f6efc8"/><circle cx="310" cy="198" r="19" style="fill:var(--glassN)"/>';
      [[200, 190], [230, 250], [205, 230], [250, 210], [330, 250], [322, 180], [215, 270]].forEach(function (c) { h += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="2.6" fill="#fff" opacity=".85"/>'; });
    } else if (!env.rain) {
      h += '<path d="M196 214 q12 -14 26 -4 q14 -10 26 4 z" fill="#fff" opacity=".9"/><circle cx="318" cy="196" r="18" fill="#fbe08a"/>';
    }
    if (env.rain) {
      [188, 214, 240, 292, 318, 344, 266].forEach(function (x, i) {
        h += '<line class="rain" x1="' + x + '" y1="158" x2="' + x + '" y2="412" style="animation-delay:-' + (i * 0.17).toFixed(2) + 's"/>';
      });
    }
    h += '<rect x="170" y="150" width="190" height="270"' + ink(7) + ' style="fill:none"/>';
    return h;
  }
  function lightLv(o) { return (o.lantern ? 1 : 0) + (o.chandelier ? 1.3 : 0) + (o.kamado ? .6 : 0); }
  function nightOp(env) { return env.dark * (isDarkTheme() ? .22 : .30) * (1 - .2 * lightLv(SV.owned)); }
  function glowSVG(o, env) {
    var d = env.dark, h = "";
    var lg = lightLv(o) + .5;
    h += '<rect x="-1600" y="-1600" width="4400" height="4000" fill="#ffd9a0" opacity="' + (0.06 + 0.08 * lg * (0.6 + 0.8 * d)).toFixed(3) + '"/>';
    var P = SV.pos || {}, pc = P.chandelier || { x: 0, y: 0 }, pl = P.lantern || { x: 0, y: 0 }, pk = P.kamado || { x: 0, y: 0 };
    if (o.chandelier) h += '<ellipse cx="' + (640 + pc.x) + '" cy="' + (150 + pc.y) + '" rx="240" ry="160" fill="url(#glow)" opacity="' + (0.5 + 0.5 * d).toFixed(2) + '"/>';
    else h += '<circle cx="640" cy="150" r="140" fill="url(#glow)" opacity="' + (0.04 + 0.8 * d).toFixed(2) + '"/>';
    if (o.lantern) h += '<circle cx="' + (440 + pl.x) + '" cy="' + (150 + pl.y) + '" r="200" fill="url(#glow)" opacity="' + (0.4 + 0.6 * d).toFixed(2) + '"/>';
    if (o.kamado) h += '<circle cx="' + (1030 + pk.x) + '" cy="' + (880 + pk.y) + '" r="180" fill="url(#glow)" opacity="' + (0.3 + 0.6 * d).toFixed(2) + '"/>';
    h += '<circle cx="930" cy="1060" r="200" fill="url(#glow)" opacity="' + (0.15 + 0.75 * d).toFixed(2) + '"/>';   // たき火（いつもある）
    return h;
  }

  var env = null;
  function computeEnv() {
    var d = new Date(), day = dayIdxOf(d), dk = darkOf(d);
    return { day: day, m: d.getMonth() + 1, d: d.getDate(), dark: dk, night: dk > .25, rain: rainyOf(day), date: d };
  }
  function envSigOf(e) { var a = [e.day, e.night ? 1 : 0, e.rain ? 1 : 0]; SEASONAL.forEach(function (it) { a.push(inSeason(it, e.date) ? 1 : 0); }); return a.join(); }
  /* ---------- room：冒険者の拠点 ---------- */
  function roomSVG(o, env) {
    var h = "";
    // 壁（木の板 / 石づくり）・床（石だたみ）
    h += '<rect x="-1600" y="-1600" width="4400" height="2540" style="fill:' + (o.stonewall ? "url(#wp)" : "var(--wall)") + '"/>';
    if (!o.stonewall) {
      var pl = ""; for (var x = 100; x < 1200; x += 92) pl += "M" + x + " 30V918";
      h += '<path d="' + pl + '" style="stroke:var(--trim)" stroke-width="4" opacity=".55"/>';
      h += '<path d="M146 300 h4 M330 560 h4 M512 210 h4 M790 640 h4 M972 320 h4 M1064 780 h4" stroke="#6b4a32" stroke-width="6" stroke-linecap="round" opacity=".5"/>';
    }
    h += '<rect x="-1600" y="30" width="4400" height="30" fill="#6b4a32"/><path d="M-1600 60H2800" stroke="' + INK + '" stroke-width="4"/>';
    h += '<rect x="-1600" y="940" width="4400" height="2400" style="fill:var(--floor)"/>';
    h += '<path d="M-1600 1010H2800M-1600 1090H2800M220 940L200 1010M500 940L490 1010M780 940L780 1010M1060 940L1070 1010M120 1010L100 1090M380 1010L370 1090M650 1010L650 1090M920 1010L930 1090M1180 1010L1190 1090M240 1090L230 1170M520 1090L515 1170M800 1090L800 1170M1080 1090L1090 1170" style="stroke:var(--trim)" stroke-width="4" fill="none" opacity=".8"/>';
    h += '<rect x="-1600" y="918" width="4400" height="24" fill="#6b4a32"/><path d="M-1600 918H2800" stroke="' + INK + '" stroke-width="4"/>';

    h += windowSVG(env);
    h += '<path d="M265 150V420M170 285H360" class="ink" stroke-width="6"/>';
    h += '<rect x="150" y="420" width="230" height="20" rx="3" fill="#8a5a3a" class="ink" stroke-width="4"/>';
    if (o.banner) {
      h += "\x01banner\x02";
      h += '<path d="M110 120H420" class="ink" stroke-width="6"/>';
      h += '<path d="M118 126H156V300L137 280L118 300Z M374 126H412V300L393 280L374 300Z" fill="#b8343a" class="ink" stroke-width="4"/>';
      h += '<path d="M137 170 L148 190 L137 210 L126 190Z M393 170 L404 190 L393 210 L382 190Z" fill="url(#gold)" class="ink" stroke-width="2.5"/>';
      h += '<path d="M118 140H156M374 140H412" stroke="url(#gold)" stroke-width="5"/>';
    }
    if (o.wmap) {
      h += "\x01wmap\x02";
      h += '<path d="M1030 196 L1176 190 L1172 312 L1026 318Z" fill="#f0dca8" class="ink" stroke-width="4"/>';
      h += '<path d="M1046 230 q20 -18 40 0 q24 18 46 -4 M1050 280 q30 -14 60 6 q20 10 44 -6" fill="none" stroke="#8a6a46" stroke-width="3"/>';
      h += '<path d="M1060 250 C1090 280 1110 230 1146 266" fill="none" stroke="#b5462e" stroke-width="3" stroke-dasharray="7 6"/><path d="M1140 258 l12 12 M1152 258 l-12 12" stroke="#b5462e" stroke-width="4"/>';
      h += '<circle cx="1034" cy="200" r="5" fill="#c94a3a"/><circle cx="1170" cy="196" r="5" fill="#c94a3a"/>';
    }
    if (o.lantern) {
      h += "\x01lantern\x02";
      h += '<path d="M400 96 H446 V108" class="ink" stroke-width="5"/>';
      h += '<path d="M424 108 L456 108 L462 120 L418 120Z" fill="#3a3f46" class="ink" stroke-width="3.5"/><rect x="420" y="120" width="40" height="52" rx="4" fill="#ffe7a0" class="ink" stroke-width="4"/>';
      h += '<path d="M440 120 V172 M420 146 H460" stroke="#3a3f46" stroke-width="3"/><path d="M418 172 H462 L456 182 H424Z" fill="#3a3f46" class="ink" stroke-width="3.5"/>';
      h += at(440, 160, flameSVG(.35));
    }
    if (o.bookshelf) {
      h += "\x01bookshelf\x02";
      h += '<rect x="120" y="470" width="220" height="450" fill="#7a5034" class="ink" stroke-width="5"/>';
      h += '<rect x="134" y="484" width="192" height="422" fill="#4a2e1c" stroke="' + INK + '" stroke-width="3"/>';
      h += '<path d="M134 590H326M134 700H326M134 810H326" stroke="#7a5034" stroke-width="10"/>';
      var cols = ["#7a2a2a", "#2a4a7a", "#5a3a7a", "#2f5a3a", "#8a6a2a", "#6a2a4a"];
      [484, 590, 700, 810].forEach(function (y0, r) {
        var x = 142;
        for (var b = 0; b < 6; b++) {
          var bh = 70 + ((b * 13 + r * 7) % 24), bw = 20 + ((b * 5 + r * 3) % 9);
          h += '<rect x="' + x + '" y="' + (y0 + 102 - bh) + '" width="' + bw + '" height="' + bh + '" fill="' + cols[(b + r * 2) % 6] + '" stroke="' + INK + '" stroke-width="2.5"/><path d="M' + (x + 3) + ' ' + (y0 + 102 - bh + 10) + ' h' + (bw - 6) + '" stroke="url(#gold)" stroke-width="3"/>';
          x += bw + 3;
        }
      });
      h += '<path d="M300 582 v-26 q0 -8 6 -8 v-6 h8 v6 q6 0 6 8 v26z" fill="#8ad0e8" class="ink" stroke-width="2.5"/><path d="M296 692 v-22 q0 -6 5 -6 h10 q5 0 5 6 v22z" fill="#e9837a" class="ink" stroke-width="2.5"/>';
    }
    if (o.kamado) {
      h += "\x01kamado\x02";
      h += '<path d="M1060 560 V720" stroke="#3a3f46" stroke-width="22"/><path d="M1060 560 V720" stroke="' + INK + '" stroke-width="3" stroke-dasharray="1 160"/>';
      h += '<path d="M954 940 V760 Q954 720 1000 720 H1104 Q1150 720 1150 760 V940Z" fill="#a8968a" class="ink" stroke-width="5"/>';
      h += '<path d="M954 790H1150M954 860H1150M1010 720V790M1090 720V790M980 790V860M1050 790V860M1120 790V860" stroke="#7a6a60" stroke-width="3"/>';
      h += '<path d="M1004 940 V880 Q1004 846 1052 846 Q1100 846 1100 880 V940Z" fill="#2a1d14" class="ink" stroke-width="3"/>' + at(1052, 932, flameSVG(.75));
      h += '<rect x="996" y="706" width="112" height="18" rx="4" fill="#3a3f46" class="ink" stroke-width="3"/>';
    }
    if (o.herbpot) {
      h += "\x01herbpot\x02";
      h += '<path d="M1090 860L1178 860L1166 940L1102 940Z" fill="#b8643e" class="ink" stroke-width="4"/><path d="M1094 874 H1174" stroke="#d9845a" stroke-width="5"/>';
      [[1134, 780, 20, 72, 0], [1108, 796, 16, 58, -30], [1160, 796, 16, 58, 30], [1122, 760, 12, 44, -12], [1148, 762, 12, 44, 14]].forEach(function (l) { h += '<ellipse cx="' + l[0] + '" cy="' + l[1] + '" rx="' + l[2] + '" ry="' + l[3] + '" transform="rotate(' + l[4] + ' ' + l[0] + ' ' + (l[1] + l[3]) + ')" fill="#6fb35a" class="ink" stroke-width="3.5"/>'; });
      h += '<circle cx="1122" cy="716" r="6" fill="#fff" class="ink" stroke-width="2"/><circle cx="1150" cy="720" r="6" fill="#fff" class="ink" stroke-width="2"/><circle cx="1136" cy="706" r="5" fill="#fff" class="ink" stroke-width="2"/>';
    }
    if (o.fur) {
      h += "\x01fur\x02";
      h += '<path d="M180 1062 C200 1010 320 994 420 1000 C520 980 760 980 860 1000 C960 994 1080 1010 1100 1062 C1080 1112 960 1130 860 1124 C760 1144 520 1144 420 1124 C320 1130 200 1112 180 1062Z" fill="#e8e0d0" class="ink" stroke-width="4"/>';
      h += '<path d="M240 1060 C300 1030 980 1030 1040 1060 C980 1094 300 1094 240 1060Z" fill="#cdbfa8" opacity=".6"/>';
      h += '<path d="M300 1020 l8 14 M420 1010 l6 14 M560 1004 l6 14 M720 1004 l6 14 M860 1010 l6 14 M980 1020 l6 14 M320 1104 l8 -14 M500 1120 l6 -14 M700 1122 l6 -14 M900 1112 l6 -14" stroke="#a89878" stroke-width="3" stroke-linecap="round"/>';
    }
    if (o.straw) {
      h += "\x01straw\x02";
      h += '<ellipse cx="240" cy="1034" rx="92" ry="30" fill="#e2c26a" class="ink" stroke-width="4"/><ellipse cx="240" cy="1026" rx="78" ry="20" fill="#f0d68a"/>';
      h += '<path d="M174 1030 l20 -6 M206 1040 l22 -8 M250 1042 l24 -8 M282 1032 l20 -6 M190 1018 l16 4 M240 1014 l18 4" stroke="#b8943e" stroke-width="3" stroke-linecap="round"/>';
    }
    if (o.wshield) {
      h += "\x01wshield\x02";
      h += '<circle cx="650" cy="318" r="74" fill="#8a5a3a" class="ink" stroke-width="5"/><circle cx="650" cy="318" r="64" fill="none" stroke="#3a3f46" stroke-width="10"/>';
      h += '<path d="M650 254 V382 M586 318 H714" stroke="#6b4a32" stroke-width="4" opacity=".7"/><circle cx="650" cy="318" r="18" fill="url(#armor)" class="ink" stroke-width="3.5"/>';
      [0, 60, 120, 180, 240, 300].forEach(function (a) { var r = a * Math.PI / 180; h += '<circle cx="' + (650 + 64 * Math.cos(r)).toFixed(1) + '" cy="' + (318 + 64 * Math.sin(r)).toFixed(1) + '" r="4" fill="#cfd6dc"/>'; });
      h += '<path d="M604 290 Q612 266 634 256"' + HLW + ' stroke-width="5"/>';
    }
    if (o.sillherb) {
      h += "\x01sillherb\x02";
      h += '<path d="M290 420L330 420L324 396L296 396Z M190 420L222 420L218 400L194 400Z" fill="#b8643e" class="ink" stroke-width="3.5"/>';
      h += '<path d="M310 396Q310 376 302 364M310 396Q318 378 328 370M310 396Q300 382 292 378 M206 400 Q204 384 198 376 M206 400 Q212 386 220 382" fill="none" stroke="#4f9a56" stroke-width="5" stroke-linecap="round"/>';
      h += '<circle cx="302" cy="360" r="6" fill="#b98ad8" class="ink" stroke-width="2.5"/><circle cx="328" cy="368" r="5" fill="#fff" class="ink" stroke-width="2.5"/>';
    }
    if (o.table) {
      h += "\x01table\x02";
      h += '<path d="M972 1054 L1128 1054 L1140 1070 L960 1070Z" fill="#9a6a42" class="ink" stroke-width="4"/>';
      h += '<path d="M976 1070L968 1134M1124 1070L1132 1134M1010 1070V1124M1090 1070V1124" class="ink" stroke-width="8" fill="none"/>';
      h += '<path d="M1000 1054 Q1000 1030 1030 1030 Q1060 1030 1060 1054Z" fill="#f4ead2" class="ink" stroke-width="3"/><path d="M1076 1052 C1074 1036 1110 1036 1108 1052Z" fill="#d99a4a" class="ink" stroke-width="3"/>';
    }
    if (o.stump) {
      h += "\x01stump\x02";
      h += '<path d="M546 1074 V1124 Q580 1138 614 1124 V1074Z" fill="#8a5a3a" class="ink" stroke-width="4"/><path d="M558 1084 V1126 M600 1084 V1128" stroke="#6b4a32" stroke-width="3"/>';
      h += '<ellipse cx="580" cy="1074" rx="34" ry="12" fill="#e2c08a" class="ink" stroke-width="4"/><ellipse cx="580" cy="1074" rx="20" ry="6" fill="none" stroke="#b8945a" stroke-width="2.5"/><ellipse cx="580" cy="1074" rx="9" ry="3" fill="none" stroke="#b8945a" stroke-width="2"/>';
    }
    if (o.bellows) {
      h += "\x01bellows\x02";
      h += '<path d="M1090 1110 L1170 1090 L1176 1118 L1096 1132Z" fill="#7a5034" class="ink" stroke-width="4"/>';
      h += '<path d="M1094 1108 C1110 1080 1150 1074 1172 1088" fill="#b88a5a" class="ink" stroke-width="3.5"/><path d="M1090 1120 L1060 1128" class="ink" stroke-width="7"/><circle cx="1180" cy="1096" r="8" fill="#7a5034" class="ink" stroke-width="3"/>';
    }
    if (o.barrel) {
      h += "\x01barrel\x02";
      h += '<path d="M128 1000 Q120 1050 128 1100 L212 1100 Q220 1050 212 1000Z" fill="#a8703e" class="ink" stroke-width="4"/>';
      h += '<path d="M126 1020 H214 M124 1080 H216" stroke="#3a3f46" stroke-width="7"/><path d="M150 1002 V1098 M170 1000 V1100 M190 1002 V1098" stroke="#7a5034" stroke-width="2.5"/>';
      h += '<ellipse cx="170" cy="1000" rx="42" ry="10" fill="#c9905a" class="ink" stroke-width="4"/>';
    }
    if (o.herbbag) {
      h += "\x01herbbag\x02";
      h += '<path d="M676 1124 C664 1100 676 1078 690 1074 L716 1074 C730 1078 742 1100 730 1124 C724 1132 682 1132 676 1124Z" fill="#c8a878" class="ink" stroke-width="3.5"/>';
      h += '<path d="M688 1074 L684 1062 L722 1062 L718 1074" fill="#b8946a" class="ink" stroke-width="3"/><path d="M692 1062 C686 1040 700 1034 704 1048 C708 1030 724 1036 714 1062" fill="#6fb35a" class="ink" stroke-width="3"/>';
    }
    if (o.rack) {
      h += "\x01rack\x02";
      h += '<path d="M100 1110 H210 M114 1110 V940 M196 1110 V940 M108 960 H202 M108 1040 H202" class="ink" stroke-width="7" fill="none"/>';
      h += '<path d="M134 1100 V880 L140 860 L146 880 V1100Z" fill="url(#armor)" class="ink" stroke-width="3"/><path d="M124 1010 H156" stroke="url(#gold)" stroke-width="6"/>';
      h += '<path d="M176 1100 V900" class="ink" stroke-width="6"/><path d="M176 920 C150 900 150 950 176 960 Z M176 920 C202 904 204 950 176 960" fill="url(#armor)" class="ink" stroke-width="3"/>';
    }
    if (o.chandelier) {
      h += "\x01chandelier\x02";
      h += '<path d="M640 60V110 M600 150 L640 110 L680 150" class="ink" stroke-width="4" fill="none"/>';
      h += '<ellipse cx="640" cy="152" rx="110" ry="22" fill="none" stroke="#3a3f46" stroke-width="10"/><ellipse cx="640" cy="152" rx="110" ry="22" fill="none" class="ink" stroke-width="2.5"/>';
      [-100, -50, 0, 50, 100].forEach(function (dx, i) {
        var y = 152 + (i === 2 ? 20 : i % 2 ? 14 : 4);
        h += '<rect x="' + (636 + dx) + '" y="' + (y - 34) + '" width="10" height="30" fill="#fbf2dc" class="ink" stroke-width="2.5"/>' + at(641 + dx, y - 34, flameSVG(.32));
      });
    } else {
      h += "\x03";
      h += '<path d="M640 60V112" class="ink" stroke-width="4"/>';
      h += '<path d="M624 112 H656 L662 126 H618Z" fill="#3a3f46" class="ink" stroke-width="3"/><path d="M620 126 Q640 172 660 126Z" fill="#ffe7a0" class="ink" stroke-width="3.5"/>' + at(640, 140, flameSVG(.25));
    }
    // たき火（最初からある・しまえない）
    h += "\x03";
    h += at(930, 1100,
      '<ellipse cx="0" cy="0" rx="80" ry="16" fill="#3a3f46" opacity=".25"/>' +
      [[-60, -4], [-30, 6], [0, 10], [30, 6], [60, -4], [-44, -14], [44, -14]].map(function (s) { return '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="16" ry="10" fill="#9aa0a8"' + ink(3) + '/>'; }).join('') +
      '<path d="M-44 -6 L40 -22 M-40 -22 L44 -6" stroke="#6b4a32" stroke-width="12" stroke-linecap="round"/><path d="M-44 -6 L40 -22 M-40 -22 L44 -6" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      at(0, -14, flameSVG(.9)));
    h += "\x03";
    if (env.m === 2 && env.d === 14) h += bdaySVG(false);
    else if (env.m === 9 && env.d === 20) h += bdaySVG(true);
    DAILY.forEach(function (it) { if (o[it.id]) h += "\x01" + it.id + "\x02" + DRAW[it.id](env) + "\x03"; });
    SEASONAL.forEach(function (it) { if (o[it.id] && inSeason(it, env.date)) h += "\x01" + it.id + "\x02" + DRAW[it.id](env) + "\x03"; });
    var pos = SV.pos || {};
    h = h.replace(/\x01([a-z_0-9]+)\x02([\s\S]*?)(?=\x01|\x03|$)/g, function (m, id, body) {
      var q = pos[id];
      return '<g class="itm" data-id="' + id + '"' + (q ? ' transform="translate(' + q.x + ' ' + q.y + ')"' : '') + '>' + body + '</g>';
    }).replace(/\x03/g, "");
    return h;
  }
