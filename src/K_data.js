  /* ---------- data ---------- */
  var FOODS = [
    { id: "yakusou", name: "やくそう" },
    { id: "pan", name: "焼きたてパン" },
    { id: "niku", name: "干し肉" },
    { id: "soup", name: "きのこスープ" },
    { id: "cheese", name: "チーズ" },
    { id: "nuts", name: "木の実" },
    { id: "kinoko", name: "あやしいキノコ", bad: true },
    { id: "hijiki", name: "ひじき", bad: true }
  ];
  var GOODFOODS = FOODS.filter(function (f) { return !f.bad; });
  var FULL_MS = 6 * 3600 * 1000, FULL_AT = 3;
  var INK = "#2a1d14";
  var ICONS = {
    yakusou: '<path d="M32 60 C30 46 22 36 10 28 C24 27 33 37 34 48 C33 32 29 18 33 4 C42 17 41 34 37 49 C42 37 50 31 59 30 C51 41 41 49 35 60Z" fill="#6fb35a" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M33 10 C34 24 35 36 35 52 M14 30 C22 34 28 40 32 50 M55 32 C47 37 41 44 37 54" fill="none" stroke="#3f7a32" stroke-width="2"/><path d="M24 52 L44 52" stroke="#c9965a" stroke-width="6" stroke-linecap="round"/><path d="M24 52 L44 52" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="3 3"/>',
    pan: '<path d="M6 40 C6 20 22 10 32 10 C42 10 58 20 58 40 C58 52 46 56 32 56 C18 56 6 52 6 40Z" fill="#d99a4a" stroke="' + INK + '" stroke-width="3"/><path d="M12 38 C12 22 24 15 32 15 C40 15 52 22 52 36" fill="none" stroke="#f2c98a" stroke-width="5" stroke-linecap="round"/><path d="M20 28 L28 36 M30 24 L38 32 M40 26 L46 32" stroke="#8a5a24" stroke-width="3" stroke-linecap="round"/>',
    niku: '<path d="M8 22 C18 14 30 18 38 12 C46 8 56 14 56 24 C56 34 48 36 42 44 C36 52 22 56 14 50 C6 44 2 30 8 22Z" fill="#9c4a32" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M16 26 C26 22 34 28 44 22 M14 38 C24 34 32 40 42 34" fill="none" stroke="#e8b49a" stroke-width="3" stroke-linecap="round"/><path d="M50 18 C52 22 52 26 50 30" fill="none" stroke="#c66a4e" stroke-width="2.5" stroke-linecap="round"/>',
    soup: '<path d="M6 30 H58 C58 48 46 58 32 58 C18 58 6 48 6 30Z" fill="#8a5a3a" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><ellipse cx="32" cy="30" rx="26" ry="7" fill="#d9a35a" stroke="' + INK + '" stroke-width="2.5"/><path d="M20 30 c2 -6 10 -6 12 0z M36 31 c2 -6 9 -6 11 0z" fill="#f4e2c0" stroke="' + INK + '" stroke-width="2"/><path d="M22 20 q-4 -6 0 -12 M32 18 q-4 -6 0 -12 M42 20 q-4 -6 0 -12" fill="none" stroke="#b8b0a2" stroke-width="2.5" stroke-linecap="round"/>',
    cheese: '<path d="M6 44 L52 14 L58 24 L58 50 L6 50Z" fill="#f5c84a" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M6 44 L58 24" stroke="' + INK + '" stroke-width="2.5"/><circle cx="22" cy="46" r="3.5" fill="#d9a12a"/><circle cx="40" cy="42" r="4.5" fill="#d9a12a"/><circle cx="50" cy="34" r="3" fill="#d9a12a"/><circle cx="46" cy="22" r="2.5" fill="#d9a12a"/>',
    nuts: '<ellipse cx="20" cy="38" rx="11" ry="14" fill="#a9763e" stroke="' + INK + '" stroke-width="3"/><path d="M8 32 Q20 16 32 32Z" fill="#6b4a32" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><ellipse cx="44" cy="42" rx="12" ry="13" fill="#c9965a" stroke="' + INK + '" stroke-width="3"/><path d="M44 30 C40 36 40 48 44 54 M36 38 C40 42 48 42 52 38" fill="none" stroke="#8a5a2a" stroke-width="2"/><path d="M20 18 v-6" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>',
    kinoko: '<path d="M26 34 H38 L40 58 H24Z" fill="#efe2c8" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M6 36 C6 16 20 6 32 6 C44 6 58 16 58 36 Z" fill="#8a3aa8" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="24" r="5" fill="#f2e04a"/><circle cx="36" cy="16" r="4" fill="#f2e04a"/><circle cx="46" cy="28" r="5" fill="#f2e04a"/><circle cx="28" cy="32" r="3" fill="#f2e04a"/><path d="M28 46 l2 -3 2 3 M34 46 l2 -3 2 3" fill="none" stroke="' + INK + '" stroke-width="2"/>',
    hijiki: '<path d="M6 33H58C58 49 47 59 32 59C17 59 6 49 6 33Z" fill="#e9dcc2" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M11 33Q15 17 21 30Q25 12 30 30Q35 15 39 30Q44 19 53 33Z" fill="#2b2622" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M16 27L20 21M30 22L33 14M44 26L49 22" stroke="#2b2622" stroke-width="3" stroke-linecap="round"/>'
  };

  // 気分のパターン（47種＋食事）。weight=抽選の重み、tod=[深夜0-5, 朝5-9, 日中9-17, 夕方17-20, 夜20-24]の倍率、
  // angry があると「集中中」の状態（さわると困る：だいなそーは怒らない）、homes があるとその位置まで歩いてから始まる。
  function ST(w, tod, extra) { var o = { weight: w, min: 18, max: 22, tod: tod }; for (var k in extra) o[k] = extra[k]; return o; }
  var STATES = {
    idle:     ST(3,   [1, 1, 1, 1, 1]),
    wave:     ST(1.4, [.3, 1.3, 1, 1, .6]),
    clasp:    ST(1.1, [1, 1, 1, 1, 1]),
    walk:     ST(2.5, [.3, 1, 1.2, 1, .7]),
    sit:      ST(2,   [1, 1, 1, 1, 1]),
    daze:     ST(1.3, [1, 1, 1, 1.2, 1]),
    sleep:    ST(2.5, [4, .6, .5, .8, 2.2], { homes: [-230, 0], angry: ["グミちゃん…？ ごめん、なそ、寝ちゃってた", "ふああ…グミちゃんの声だ。おはよう", "あれ、もう朝かな。…まだ夜だね"] }),
    jump:     ST(1,   [.1, 1, 1.3, 1, .3]),
    dash:     ST(1,   [.1, 1, 1.4, 1, .3]),
    swing:    ST(2.2, [.1, 2, 1.4, .8, .3], { angry: ["グミちゃん、危ないよ。なその剣、重いんだ", "あ、数がわからなくなっちゃった。…まあいいか", "もう少しで百回だったんだけどね"] }),
    pushup:   ST(1.3, [.1, 1.8, 1, .6, .3], { angry: ["グミちゃん、今…腕が…ぷるぷるなんだ", "待って、あと三回だけ。…やっぱりもういいや", "見ててくれるなら、もう少しがんばれるかも"] }),
    meditate: ST(1.4, [1, 1.6, .6, 1, 1.5], { angry: ["グミちゃん、気配でわかったよ。目をつぶってても", "うん、いいんだ。グミちゃんの声なら", "心を静かにする修行なんだけどね。…うれしくて乱れちゃった"] }),
    sharpen:  ST(1.3, [.3, .6, 1, 1.6, 1.2], { angry: ["グミちゃん、刃に気をつけてね。よく切れるんだ", "手がすべるとあぶないから、少し離れててね", "これが終わったら、おいしいもの作ってあげる"] }),
    shield:   ST(1.2, [.1, 1, 1.3, 1, .4], { angry: ["グミちゃん、今かまえてるところなんだ", "おっと、よろけちゃった。まだまだだね", "盾はね、守るためのものなんだよ"] }),
    watch:    ST(1.4, [1.6, 1.4, .8, 1, 1.4], { homes: [-290], angry: ["グミちゃん、見張りの途中なんだ。でも大丈夫だよ", "だれか来たのかと思った。グミちゃんでよかった", "ここからだと遠くまで見えるんだ"] }),
    run:      ST(1.2, [.1, 2, 1, .6, .2]),
    balance:  ST(1,   [.2, 1, 1.2, 1, .5]),
    breathe:  ST(.9,  [.5, 1, 1, 1, .8]),
    polish:   ST(1.2, [.2, .8, 1.3, 1, .6], { angry: ["グミちゃん、手が油でべたべたなんだ。さわれなくてごめんね", "もう少しで光るところだったんだ", "鎧をみがくと、気持ちまで整うんだよ"] }),
    chop:     ST(1.5, [.1, 1.4, .6, 2, .6], { homes: [70, 230], angry: ["グミちゃん、包丁を持ってるから、少し待ってね", "あぶないから、こっちには来ないでね", "そのかわり、おいしいの作るから"] }),
    stir:     ST(1.5, [.1, .8, .6, 2.2, 1], { homes: [70, 230], angry: ["グミちゃん、手がはなせないんだ。焦げちゃう", "もう少しで煮えるからね。待っててね", "いいにおいがしてきただろ"] }),
    taste:    ST(1.1, [.1, .8, .8, 1.8, 1]),
    fire:     ST(1.2, [.6, .6, .4, 1.8, 1.8], { angry: ["グミちゃん、火のそばはあついよ。気をつけてね", "火加減はね、目をはなすとだめなんだ", "もうちょっとで、ちょうどよくなるよ"] }),
    knead:    ST(1.1, [.1, 2, .8, .6, .2], { angry: ["グミちゃん、手が粉だらけなんだ。ごめんね", "こねるのをやめると、かたくなっちゃうんだ", "もう少しだけ待っててね"] }),
    plate:    ST(1,   [.1, 1, 1, 1.6, .6]),
    serve:    ST(1.2, [.1, 1.2, 1.2, 1.6, .6], { say: ["グミちゃん、できたよ。…どうぞ", "グミちゃん、熱いから気をつけてね", "グミちゃん、たくさん食べてね"] }),
    wash:     ST(1,   [.1, .6, .6, 1, 1.8], { angry: ["グミちゃん、手がぬれてるんだ。ちょっと待ってね", "片づけまでが料理なんだよ", "すぐ終わるから、座ってて"] }),
    read:     ST(2,   [1, .8, .8, 1.4, 1.4], { angry: ["グミちゃん、ちょっと待ってね。ここまで読んだら", "あ、どこまで読んだかな。…まあいいや、グミちゃんが来たから", "この本ね、旅のことが書いてあるんだ"] }),
    map:      ST(1.4, [.3, 1, 1.2, 1, 1]),
    fireside: ST(1.6, [1.2, .3, .3, 1.4, 2]),
    hum:      ST(1.2, [.2, .8, 1.2, 1.2, .8]),
    nuts:     ST(1.2, [.3, .6, 1.2, 1.4, 1]),
    star:     ST(1,   [1.2, .2, .3, 1, 1.8], { say: ["空に星をかくよ", "グミちゃん、星をかいたんだ"] }),
    letter:   ST(1,   [.5, .6, 1, 1, 1.2], { angry: ["グミちゃん、まだ見ちゃだめだよ。…てれるから", "あ、字がにじんじゃった", "これはね、ないしょの手紙なんだ"] }),
    furifuri: ST(1,   [.4, 1, 1.2, 1.2, .8], { say: ["うれしくて、からだがゆれちゃうんだ", "ふりふり。グミちゃんも、どうかな"] }),
    funny:    ST(.8,  [.5, 1, 1.2, 1.2, 1], { say: ["変な顔、してみるね。…べー", "グミちゃん、笑ってくれるかな"] }),
    tale:     ST(1.2, [.3, .8, 1.2, 1.4, 1]),
    wait:     ST(1,   [.4, .8, 1, 1.4, 1.2], { homes: [-290], say: ["グミちゃん、まだかな", "グミちゃん、もうすぐかな"] }),
    surprise: ST(1,   [1, 1, 1, 1, 1], { short: 2.6, say: ["わっ！ びっくりしたあ", "えっ！？ いま なにか動いたよね"] }),
    yawn:     ST(1.2, [1.5, 1.8, .6, .8, 1.5], { short: 4.4, say: ["ふあぁ…ねむいなあ", "ふあぁ…ちょっとねむくなってきたよ"] }),
    stretch:  ST(1.4, [.5, 2, 1, .8, .6], { short: 6, say: ["うーん、からだがかたまっちゃった", "のびをするよ。んーっ！"] }),
    shiver:   ST(1.2, [1.3, 1.3, .8, 1, 1.3], { short: 4.6, say: ["ぶるっ。少し寒いね", "ちょっと冷えてきたね。グミちゃん、あったかくしてね"] }),
    hot:      ST(1.2, [.8, .8, 1.5, 1, .8], { short: 5, say: ["あついね…", "あついね。グミちゃん、お水のんでね"] }),
    growl:    ST(1,   [.6, 1, 1.2, 1.4, .8], { short: 4, say: ["おなかがすいたなあ", "おなかの虫が鳴いちゃった"] }),
    hiccup:   ST(1,   [1, 1, 1, 1, 1], { short: 2.4, say: ["ヒック！ しゃっくりが出ちゃった", "ヒック…びっくりしたあ"] }),
    sweat:    ST(1.2, [.3, 1.4, 1.2, 1, .6], { short: 5, say: ["ふう、いい汗かいたよ", "汗をふかなきゃ。ふう"] }),
    puff:     ST(1,   [1, 1, 1, 1, 1], { short: 4, say: ["ぷくー。おこってないよ", "ほっぺがふくらんじゃった"] })
  };
  var STATE_KEYS = Object.keys(STATES);

  var ITEMS = [
    { id: "straw",     name: "わらのクッション", price: 15 },
    { id: "herbbag",   name: "やくそう袋",       price: 20 },
    { id: "barrel",    name: "木のたる",         price: 25 },
    { id: "wshield",   name: "まるい盾",         price: 30 },
    { id: "stump",     name: "切り株のいす",     price: 40 },
    { id: "fur",       name: "毛皮のしきもの",   price: 50 },
    { id: "wmap",      name: "世界地図",         price: 70 },
    { id: "bellows",   name: "ふいご",           price: 90 },
    { id: "banner",    name: "旅の旗",           price: 100 },
    { id: "lantern",   name: "ランタン",         price: 130 },
    { id: "herbpot",   name: "やくそうの鉢",     price: 170 },
    { id: "table",     name: "木のテーブル",     price: 210 },
    { id: "sillherb",  name: "窓辺のハーブ",     price: 260 },
    { id: "bookshelf", name: "魔法書の棚",       price: 320 },
    { id: "kamado",    name: "かまど",           price: 400 },
    { id: "rack",      name: "剣かけ",           price: 500 },
    { id: "stonewall", name: "石づくりの壁",     price: 650 },
    { id: "chandelier",name: "鉄のシャンデリア", price: 800 }
  ];
