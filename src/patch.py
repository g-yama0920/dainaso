# build.py のあとに実行：残りの文言・スタイル・ゲームを差し替える
import re
p='/home/claude/dinaso-app/index.html'; s=open(p,encoding='utf-8').read()
def R(a,b,count=1):
    global s
    n=s.count(a)
    if n==0 and a.startswith("'") and b.startswith("'"):
        a=a[1:]; b=b[1:]; n=s.count(a)
    if n==0 and a.endswith("'") and b.endswith("'"):
        a=a[:-1]; b=b[:-1]; n=s.count(a)
    if n==0: raise SystemExit('NOT FOUND: '+a[:80])
    if count and n!=count: raise SystemExit('COUNT %d != %d: %s'%(n,count,a[:80]))
    s=s.replace(a,b)
# ---------- head / CSS ----------
R('<meta name="theme-color" content="#fdf0d2">','<meta name="theme-color" content="#e9dcbf">')
R('<meta name="apple-mobile-web-app-title" content="つんつ君">','<meta name="apple-mobile-web-app-title" content="だいなそー">')
R('<title>つんつ君</title>','<title>だいなそー</title>')
R('family=Dela+Gothic+One&family=Zen+Maru+Gothic:wght@500;700','family=DotGothic16&family=Zen+Maru+Gothic:wght@500;700')
R('''/* Layout: header / room stage (flex) / bottom panel with ごはん + おみせ tabs. */
:root {
  --bg: #fdf0d2;
  --fg: #4a3a22;
  --muted: #8f7b55;
  --line: #1c1a17;
  --body: #f7e2ab;
  --body-hi: #fbeec6;
  --body-lo: #f0d598;
  --snot: #c4ecdf;
  --shadow: rgba(60, 40, 10, .22);
  --burst: #d9573a;
  --wall: #f1ebdb;
  --floor: #d8c79e;
  --trim: #c1b08a;
  --glass: #cfe7ef; --glassR: #aebcc7; --glassN: #243058;
  --wp1: #f4dcd2;
  --wp2: #eac6ba;
  --panel: #f7e6c0;
  --card: #fff8e6;
  --coin: #e8a920;
  --font-display: "Dela Gothic One", "Hiragino Sans", "Yu Gothic", sans-serif;''','''/* Layout: header / 冒険者の拠点（stage）/ 下のパネル（ごはん・おみせ…）。吹き出しはRPGのメッセージウィンドウ */
:root {
  --bg: #e9dcbf;
  --fg: #3a2a1a;
  --muted: #7d6a4c;
  --line: #2a1d14;
  --shadow: rgba(40, 25, 10, .25);
  --burst: #c94a3a;
  --wall: #b98a5a;
  --floor: #a9a294;
  --trim: #7a5636;
  --glass: #bfe0f0; --glassR: #9aaebb; --glassN: #1f2a50;
  --wp1: #9aa0a8;
  --wp2: #6f7680;
  --panel: #dccaa2;
  --card: #f7eed8;
  --coin: #e2b04a;
  --win: #151a30; --winText: #f4f1e6;
  --font-display: "DotGothic16", "Hiragino Kaku Gothic ProN", "Yu Gothic", monospace;''')
R('''.say { position: absolute; left: 50%; top: 4%; transform: translateX(-50%); max-width: 88%; background: #fff; color: #1c1a17; border: 2.5px solid var(--line); border-radius: 18px; padding: 8px 14px; font: 700 1.02rem/1.4''','''.say { position: absolute; left: 50%; top: 4%; transform: translateX(-50%); max-width: 88%; background: var(--win); color: var(--winText); border: 3px solid var(--winText); box-shadow: 0 0 0 3px var(--win); border-radius: 8px; padding: 9px 14px 8px; font: 400 1.02rem/1.5''')
s=re.sub(r'(\.say \{[^}]*?)font-family: var\(--font-body\)',r'\1font-family: var(--font-display)',s,count=1)
s=re.sub(r'\.say::after \{[^}]*\}','.say::after { content: ""; position: absolute; left: 50%; bottom: -12px; width: 16px; height: 16px; background: var(--win); border-right: 3px solid var(--winText); border-bottom: 3px solid var(--winText); transform: translateX(-50%) rotate(45deg); }',s,count=1)
R('h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 1.35rem; letter-spacing: .03em; white-space: nowrap; }','h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; letter-spacing: .06em; white-space: nowrap; }')
R('.game .cup .lid { position: absolute; left: 4%; right: 4%; bottom: 0; height: 74px; background: #f4c85a; border: 2.5px solid var(--line); border-radius: 8px 8px 22px 22px; transition: transform .25s ease; }',
  '.game .cup .lid { position: absolute; left: 4%; right: 4%; bottom: 0; height: 74px; background: linear-gradient(#b06a36 0 34%, #e2b04a 34% 44%, #9a5a2e 44%); border: 2.5px solid var(--line); border-radius: 26px 26px 6px 6px; transition: transform .25s ease; }')
R('.game .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #a9dcc8; }','.game .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: linear-gradient(90deg, #f2c94c, #e9837a); }')
R('.game .gt { font-weight: 800; font-size: 1rem; margin-bottom: 2px; }','.game .gt { font-family: var(--font-display); font-weight: 400; font-size: 1.1rem; margin-bottom: 2px; letter-spacing: .04em; }')
# ---------- header / html ----------
R('<h1>つんつ君</h1>','<h1>だいなそー</h1>')
R('''<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#f2b92e" stroke="#1c1a17" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#b5760f" stroke-width="2"/><path d="M9.5 12h5M12 9.5v5" stroke="#b5760f" stroke-width="1.8" stroke-linecap="round"/></svg>
        <b id="coins">0</b><small>つんつ</small>''','''<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#f2c94c" stroke="#2a1d14" stroke-width="2"/><circle cx="12" cy="12" r="7" fill="none" stroke="#b5821f" stroke-width="1.6"/><text x="12" y="16.2" text-anchor="middle" font-size="11" font-weight="700" fill="#8a5a10" font-family="sans-serif">G</text></svg>
        <b id="coins">0</b><small>ゴールド</small>''')
R('aria-label="つんつ君をつつく"','aria-label="だいなそーにふれる"')
R('<img id="vimg" alt="つんつ君の写真">','<img id="vimg" alt="だいなそーの写真">')
# ---------- パネル・家具 ----------
R('"まだ家具がないぞ。「おみせ」で買おう"','"まだ家具がないんだ。「おみせ」で買おうね"')
R('say("しまったぞ", 1600)','say("しまったよ", 1600)')
R('say("季節になったら 出てくるぞ", 2200)','say("季節になったら 出てくるよ", 2200)')
R('btn.textContent = fmt(it.price) + " つんつ";','btn.textContent = fmt(it.price) + " G";')
R('say("つんつが たりないな", 1800)','say("ゴールドが たりないね", 1800)')
R('renderZukan(); sndCoin();\n','renderZukan(); sndBuy();\n')
R('''say(seasonal ? "よし、" + it.tag + "の 時期に 飾るぞ" : (n === ITEMS.length ? "もう 何もいらねえな。いい部屋だ" : ["おっ、いいじゃないか", "部屋が にぎやかになってきたな", "悪くないな"][n % 3]), 2600);''',
  '''say(seasonal ? "うん、" + it.tag + "の 時期に かざるね" : (n === ITEMS.length ? "拠点が すっかり 立派になったね。ありがとう" : ["わあ、いいね", "拠点が にぎやかになってきたね", "グミちゃん、ありがとう。大事にするね"][n % 3]), 2600);''')
R('save(); selectItem(null); renderRoom(); sndPop();','save(); selectItem(null); renderRoom(); sndPlace();')
R('say(pick(["ここがいいな", "いい感じだな", "模様替えだな。悪くない"]), 1800);','say(pick(["ここがいいね", "いい感じだね", "模様替えだね。いいなあ"]), 1800);')
R('say("しまったぞ。「かぐ」から また置けるぞ", 2400)','say("しまったよ。「かぐ」から また置けるよ", 2400)')
R('function placeFurn(id, off) {\n    SV.owned[id] = 1;','function placeFurn(id, off) {\n    sndPlace(); SV.owned[id] = 1;')
# ---------- アルバム ----------
R('var ALKEY = "tsuntsu-album-v1"','var ALKEY = "dinaso-album-v1"')
R('"つんつのアルバム　"','"冒険のアルバム　"')
R('"まだ写真がないぞ、グミ。<br>「さつえい」ボタンで撮ってくれ"','"まだ写真がないんだ、グミちゃん。<br>「さつえい」ボタンで撮ってね"')
R('"tsuntsu-" + it.d + ".jpg"','"dinaso-" + it.d + ".jpg"')
R('title: "つんつ君" });','title: "だいなそー" });')
R('''var css = ".ink{stroke:#1c1a17;stroke-linecap:round;stroke-linejoin:round}.ink:not([fill]){fill:none}" +
      ".burst-text{font-family:'Dela Gothic One','Hiragino Sans','Yu Gothic',sans-serif;''','''var css = ".ink{stroke:#2a1d14;stroke-linecap:round;stroke-linejoin:round}.ink:not([fill]){fill:none}.flame{transform-box:fill-box;transform-origin:50% 100%}" +
      ".burst-text{font-family:'DotGothic16','Hiragino Sans','Yu Gothic',sans-serif;''')
R("""c.font = "700 " + fs + "px 'Zen Maru Gothic','Hiragino Maru Gothic ProN','Yu Gothic',sans-serif";""","""c.font = "400 " + fs + "px 'DotGothic16','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif";""")
R('c.fillStyle = ang ? "#ffe3dc" : "#fff"; c.strokeStyle = "#1c1a17"; c.lineWidth = 2.5 * k;','c.fillStyle = "#151a30"; c.strokeStyle = "#f4f1e6"; c.lineWidth = 3 * k;')
R('c.fillStyle = ang ? "#a32a12" : "#1c1a17"; c.textAlign = "center";','c.fillStyle = "#f4f1e6"; c.textAlign = "center";')
R('var rd = 18 * k;','var rd = 8 * k;')
R('c.strokeText("つんつ君", 14, H - 12); c.fillText("つんつ君", 14, H - 12);','c.strokeText("だいなそー", 14, H - 12); c.fillText("だいなそー", 14, H - 12);')
R('c.fillStyle = cs.getPropertyValue("--bg").trim() || "#fdf0d2";','c.fillStyle = cs.getPropertyValue("--bg").trim() || "#e9dcbf";')
R('if (!url) { say("うまく撮れなかったぞ…", 2200); return; }','if (!url) { say("うまく撮れなかったよ…", 2200); return; }')
R('say(pick(ok ? ["いい写真だな、グミ", "アルバムに入れたぞ", "おれ、かっこよく撮れたか？", "はい、チーズだぞ"] : ["写真がいっぱいで保存できないぞ"]), 2400);',
  'say(pick(ok ? ["いい写真だね、グミちゃん", "アルバムに入れたよ", "なそ、かっこよく撮れたかな", "はい、チーズ"] : ["写真がいっぱいで、保存できないんだ"]), 2400);')
# ---------- ゲーム ----------
R('/* ---------- つんつ君と勝負（じゃんけん毎日／ほか3種は気まぐれで1日1回） ---------- */','/* ---------- だいなそーと勝負（じゃんけん毎日／ほかは気まぐれで1日1回） ---------- */')
R('var GAME_NAME = { jk: "じゃんけん", mem: "神経衰弱", dir: "あっち向いてホイ", fast: "早押し", baba: "ババ抜き", cups: "コップあて", nose: "鼻水のばし", weigh: "重さくらべ", bingo: "ビンゴ", sugo: "すごろく", simon: "いろ当て", stopw: "ストップウォッチ", big: "おっきい数字" };',
  'var GAME_NAME = { jk: "じゃんけん", mem: "ずかん合わせ", dir: "あっち向いてホイ", fast: "いあい斬り", baba: "ドクロぬき", cups: "宝箱あて", nose: "ちからため", weigh: "にもつくらべ", bingo: "ビンゴ", sugo: "ぼうけんすごろく", simon: "まほうの石", stopw: "ちょうど3秒", big: "ちからくらべ" };')
R('startEvent({ id: "act", kind: "free", pose: pose, a: a || {}, dur: 4, held: null, worn: null, fx: null, say: null, target: null }, performance.now());','startEvent({ id: "act", kind: "free", pose: pose, a: a || {}, dur: 4, hp: null, worn: null, fx: null, say: null, target: null }, performance.now());')
R('''      if (reward) { SV.coins += reward; save(); showCoins(); coinPop(reward, "かち！"); sndCoin(); vibrate(30); }
      say(reward ? "くっ…負けたぞ。つんつ " + reward + "つ、持ってけ" : "くっ…負けたぞ", 4200); gPose("sob", {});
      gHtml(name + "：グミの勝ち！", (reward ? "つんつを " + reward + " もらった" : "（れんしゅう）"), "🎉", '<div class="gr">' + gBtn("close", "とじる", "sub") + '</div>');
    } else {
      say("つんつの勝ちだぞ。ふふん", 3800); gPose("proud", { sfx: "ふふん" });
      gHtml(name + "：つんつ君の勝ち", "また あした しょうぶだ", "😏", '<div class="gr">' + gBtn("close", "とじる", "sub") + '</div>');''','''      sndWin(); if (reward) { SV.coins += reward; save(); showCoins(); setTimeout(function () { coinPop(reward, "かち！"); sndCoin(); }, 900); vibrate(30); }
      say(pick(["グミちゃん、強いなあ。旅のときと変わってないね", "まいった。グミちゃんにはかなわないんだ", "すごいね、グミちゃん。なそ、もっと修行しなきゃ", "負けちゃった。でも、楽しかったよ"]), 4200); gPose("smile", {});
      gHtml(name + "：グミちゃんの勝ち！", (reward ? reward + "ゴールド もらった" : "（れんしゅう）"), "🎉", '<div class="gr">' + gBtn("close", "とじる", "sub") + '</div>');
    } else {
      sndLose(); say(pick(["あ、勝っちゃった。…ごめんね、グミちゃん", "なその勝ちだね。修行のおかげかな", "今日はなそだったね。また明日、やろうね", "グミちゃん、おしかったよ。ほんとうに"]), 3800); gPose("proud", { sfx: "えへへ" });
      gHtml(name + "：だいなそーの勝ち", "また あした しょうぶしよう", "😊", '<div class="gr">' + gBtn("close", "とじる", "sub") + '</div>');''')
pairs=[
 ('"グミの勝ち！"','"グミちゃんの勝ち！"',None),('"つんつの勝ち！"','"なその勝ち！"',None),
 ('"グミ " + HANDS[me] + "<small>vs</small>つんつ " + HANDS[him]','"グミちゃん " + HANDS[me] + "<small>vs</small>なそ " + HANDS[him]',1),
 ('"グミの勝ち！ゆびさす 方向を えらべ" : "つんつの勝ち！むく 方向を えらべ"','"グミちゃんの勝ち！ゆびさす 方向を えらんでね" : "なその勝ち！むく 方向を えらんでね"',1),
 ('"つんつも 同じ方向を むいた！"','"なそも 同じ方向を むいちゃった！"',1),
 ('"グミ ゆび " + DIRS[me][0] + "<small>つんつ かお</small>"','"グミちゃん ゆび " + DIRS[me][0] + "<small>なそ かお</small>"',1),
 ('"つんつ ゆび " + DIRS[him][0] + "<small>グミ かお</small>"','"なそ ゆび " + DIRS[him][0] + "<small>グミちゃん かお</small>"',1),
 ('say("もう一回だ", 1200)','say("もう一回だね", 1200)',1),('say("むむ、もう一回だ", 1200)','say("うーん、もう一回だね", 1200)',1),
 ('"「いま！」と出たら すぐ タップ"','"「斬れ！」と出たら すぐ タップ"',1),('btn.textContent = "いま！";','btn.textContent = "斬れ！";',1),
 ('say("はやすぎるぞ！", 2000)','say("あっ、はやかったね。まだ合図の前だよ", 2200)',1),
 ('"グミ " + (rt / 1000).toFixed(2) + "秒<small>vs</small>つんつ "','"グミちゃん " + (rt / 1000).toFixed(2) + "秒<small>vs</small>なそ "',1),
 ('var ids = ["onigiri", "curry", "pudding", "fish", "ramen"]','var ids = ["yakusou", "pan", "niku", "soup", "cheese"]',1),
 ('"グミの番：カードを2まい めくれ" : "つんつの番…"','"グミちゃんの番：カードを2まい めくってね" : "なその番…"',1),
 ("'<div class=\"gs\" style=\"margin-top:6px\">グミ ' + sc.me + ' － ' + sc.him + ' つんつ</div>'","'<div class=\"gs\" style=\"margin-top:6px\">グミちゃん ' + sc.me + ' － ' + sc.him + ' なそ</div>'",1),
 ('matched.push(a, b); sc[who]++; delete seen[a]; delete seen[b]; open = []; sndCoin();','matched.push(a, b); sc[who]++; delete seen[a]; delete seen[b]; open = []; sndOk();',1),
 ('"ペア！もう一回" : "つんつがペア！"','"ペア！もう一回" : "なそがペア！"',1),
 ('draw("つんつの番…"); gT(ai, 800);','draw("なその番…"); gT(ai, 800);',1),
 ('draw(who === "me" ? "" : "つんつの番…");','draw(who === "me" ? "" : "なその番…");',1),
 ('var types = ["onigiri", "curry", "pudding", "fish"]','var types = ["yakusou", "pan", "niku", "cheese"]',1),
 ('c === "joker" ? "👻" :','c === "joker" ? "💀" :',1),
 ("'<div class=\"gs\">つんつの手札('","'<div class=\"gs\">なその手札('",1),
 ("'<div class=\"gs\" style=\"margin-top:6px\">グミの手札</div>'","'<div class=\"gs\" style=\"margin-top:6px\">グミちゃんの手札</div>'",1),
 ('"ペア！すてた" : (c === "joker" ? "ババだ…！" : "ペアなし")','"ペア！すてたよ" : (c === "joker" ? "ドクロだ…！" : "ペアなし")',1),
 ('say("つんつの番だぞ", 1200); draw("つんつが ひく…", false);','say("なその番だよ", 1200); draw("なそが ひくよ…", false);',1),
 ('"つんつ、ペアですてた" : (c === "joker" ? "つんつ、ババを ひいた！" : "つんつ、ペアなし")','"なそ、ペアですてたよ" : (c === "joker" ? "なそ、ドクロを ひいちゃった！" : "なそ、ペアなし")',1),
 ('draw("グミの番：つんつの手札から 1まい ひけ", true);','draw("グミちゃんの番：なその手札から 1まい ひいてね", true);',1),
 ('draw("グミの番：つんつの手札から 1まい ひけ（👻がババ）", true);','draw("グミちゃんの番：なその手札から 1まい ひいてね（💀がドクロ）", true);',1),
 ('round + "回目：おにぎりを よく 見ておけ"','round + "回目：金貨を よく 見ててね"',1),
 ("ICONS.onigiri + '</svg>'","'<circle cx=\"32\" cy=\"32\" r=\"24\" fill=\"#f2c94c\" stroke=\"#2a1d14\" stroke-width=\"3\"/><circle cx=\"32\" cy=\"32\" r=\"17\" fill=\"none\" stroke=\"#b5821f\" stroke-width=\"2.5\"/><text x=\"32\" y=\"41\" text-anchor=\"middle\" font-size=\"24\" font-weight=\"700\" fill=\"#8a5a10\" font-family=\"sans-serif\">G</text></svg>'",1),
 ("' － ' + losses + ' つんつ（2かい あてたら勝ち）</div>'","' － ' + losses + ' なそ（2かい あてたら勝ち）</div>'",1),
 ("'<div class=\"gs\">グミ ' + wins + ' － ' + losses + ' なそ（2かい","'<div class=\"gs\">グミちゃん ' + wins + ' － ' + losses + ' なそ（2かい",1),
 ('gameEl.querySelector(".gs").textContent = "おにぎりは どれだ？ タップ！";','gameEl.querySelector(".gs").textContent = "金貨は どの宝箱かな？ タップ！";',1),
 ('var ok = i === ball; if (ok) wins++; else losses++;\n          if (ok) sndCoin(); else sndPop();','var ok = i === ball; if (ok) wins++; else losses++;\n          if (ok) sndOk(); else sndNg();',1),
 ('function cm(p) { return (p / 2).toFixed(1) + "cm"; }','function cm(p) { return Math.round(p * 10) + "パワー"; }',1),
 ('"ボタンを おしてる間、鼻水がのびる。赤い線に いちばん近く はなせ"','"ボタンを おしてる間、剣にちからが たまる。赤い線に いちばん近く はなしてね"',1),
 ("'<div class=\"gs\">つんつの めやす：'","'<div class=\"gs\">なその めやす：'",1),
 ('gBtn("hold", "おして のばす", "big")','gBtn("hold", "おして ためる", "big")',1),
 ('say("つんつは " + cm(tgt) + " くらいのばせるぞ", 3600);','say("なそは " + cm(tgt) + " くらい ためられるよ", 3600);',1),
 ('say("ちぎれたぞ！", 1800); gHtml(GAME_NAME.nose, "のばしすぎて ちぎれた！", "💦", "");','say("わっ、ちからがあふれちゃった", 1800); gHtml(GAME_NAME.nose, "ためすぎて ちからが あふれた！", "💥", "");',1),
 ('"グミのほうが めやすに近い！" : "つんつのほうが めやすに近い", "グミ " + cm(v) + "<small>vs</small>つんつ " + cm(him)','"グミちゃんのほうが めやすに近い！" : "なそのほうが めやすに近い", "グミちゃん " + cm(v) + "<small>vs</small>なそ " + cm(him)',1),
 ('var items = [["onigiri", "おにぎり", 110], ["pudding", "プリン", 120], ["curry", "カレーパン", 150], ["fish", "焼き魚", 170]];','var items = [["yakusou", "やくそう", 60], ["nuts", "木の実", 120], ["niku", "干し肉", 150], ["pan", "焼きたてパン", 180], ["cheese", "チーズ", 240]];',1),
 ("'<div class=\"gs\">グミ ' + wins + ' － ' + losses + ' つんつ（2もん 当てたら勝ち）</div>'","'<div class=\"gs\">グミちゃん ' + wins + ' － ' + losses + ' なそ（2もん 当てたら勝ち）</div>'",1),
 ('say("つんつは " + (guess ? b : a)[1] + " だと思うぞ", 2800);','say("なそは " + (guess ? b : a)[1] + " だと思うな", 2800);',1),
 ('var ok = +v === heavy; if (ok) wins++; else losses++;\n        if (ok) sndCoin(); else sndPop();','var ok = +v === heavy; if (ok) wins++; else losses++;\n        if (ok) sndOk(); else sndNg();',1),
 ("'<div class=\"gs\" style=\"margin-top:4px\">グミのカード　／　つんつのカード</div>'","'<div class=\"gs\" style=\"margin-top:4px\">グミちゃんのカード　／　なそのカード</div>'",1),
 ('gM[n] = 1; sndCoin(); draw("マーク！");','gM[n] = 1; sndOk(); draw("マーク！");',1),
 ('say(win ? "ビンゴだと！？" : "ビンゴだぞ！", 2200)','say(win ? "ビンゴだって！？ すごいね" : "ビンゴだよ！", 2200)',1),
 ('draw("カードの 同じ数字を タップ！");','draw("カードの 同じ数字を タップしてね！");',1),
 ('function mark(i) { if (i === G) return "🏁";','function mark(i) { if (i === G) return "🏰";',1),
 ("border:1.5px solid #1c1a17;border-radius:50%;width:18px;height:18px;display:inline-block\"></i>' : \"🧍\")","border:1.5px solid #2a1d14;border-radius:50%;width:18px;height:18px;display:inline-block;background:#83bd66\"></i>' : \"🧍\")",1),
 ("'<div class=\"row2\">グミ</div>' + row(0) + '<div class=\"row2\">つんつ</div>'","'<div class=\"row2\">グミちゃん</div>' + row(0) + '<div class=\"row2\">なそ</div>'",1),
 ("▶ すすむ　◀ もどる　💤 1回休み　🏁 ゴール","▶ すすむ　◀ もどる　💤 1回休み　🏰 ゴール",1),
 ('nm = w ? "つんつ" : "グミ";','nm = w ? "なそ" : "グミちゃん";',1),
 ('draw((w ? "つんつ" : "グミ") + "は おやすみ", false);','draw((w ? "なそ" : "グミちゃん") + "は おやすみ", false);',1),
 ('if (w === 0) draw("グミの番：サイコロ(1〜3)", true);\n      else { draw("つんつの番…", false);','if (w === 0) draw("グミちゃんの番：サイコロ(1〜3)", true);\n      else { draw("なその番…", false);',1),
 ('cols = ["#e86a5c", "#f2c94c", "#6cc08b", "#6a9be8"]','cols = ["#d9304a", "#f2c94c", "#3f9a56", "#3a6ad8"]',1),
 ('len - 3 + "だんめ：光る順番を おぼえろ"','len - 3 + "だんめ：まほうの石が光る順番を おぼえてね"',1),
 ('gameEl.querySelector(".gs").textContent = "同じ順に タップ！";','gameEl.querySelector(".gs").textContent = "同じ順に タップしてね！";',1),
 ('if (c !== seq[k]) { gClear(); gT(function () { gFinish("simon", false, 0); }, 500); return; }','if (c !== seq[k]) { gClear(); sndNg(); gT(function () { gFinish("simon", false, 0); }, 500); return; }',1),
 ('gClear(); sndCoin();\n            if (len >= 6)','gClear(); sndOk();\n            if (len >= 6)',1),
 ('"ちょうど " + T + " 秒で とめろ！（途中から数字は見えなくなる）"','"砂時計が ちょうど " + T + " 秒になったら とめてね！（途中から数字は見えなくなる）"',1),
 ('"グミのほうが " + T + "秒に近い！" : "つんつのほうが " + T + "秒に近い", "グミ " + me.toFixed(2) + "<small>vs</small>つんつ "','"グミちゃんのほうが " + T + "秒に近い！" : "なそのほうが " + T + "秒に近い", "グミちゃん " + me.toFixed(2) + "<small>vs</small>なそ "',1),
 ('"3まいの合計が 大きいほうが勝ち"','"3まいの こうげき力の合計が 大きいほうが勝ち"',1),
 ("'<div class=\"gs\">グミのカード' + (swapped","'<div class=\"gs\">グミちゃんのカード' + (swapped",1),
 ("'<div class=\"gs\">つんつのカード</div>'","'<div class=\"gs\">なそのカード</div>'",1),
 ('"グミ " + a + "<small>vs</small>つんつ " + b','"グミちゃん " + a + "<small>vs</small>なそ " + b',1),
 ("'<span style=\"width:100%\">れんしゅう（つんつは もらえない）</span>'","'<span style=\"width:100%\">れんしゅう（ゴールドは もらえない）</span>'",1),
 ('say("グミ、つんつと" + GAME_NAME[kind] + "しないか？", 9000);','say(pick(["グミちゃん、なそと" + GAME_NAME[kind] + "しない？", "グミちゃん、ひと勝負しようよ。" + GAME_NAME[kind] + "だよ", "グミちゃん、旅のときみたいに遊ぼうよ"]), 9000);',1),
 ('gHtml("つんつ君から しょうぶ！", GAME_NAME[kind] + "：勝つと " + rw + "つんつ",','gHtml("だいなそーが さそってる！", GAME_NAME[kind] + "：勝つと " + rw + "ゴールド",',1),
 ('say("むぅ、じゃあ あとでな。また誘うぞ", 2800);','say(pick(["うん、いいよ。またあとでね", "わかった。なそ、待ってるね"]), 2800);',1),
]
for a,b,c in pairs: R(a,b,c if c is not None else 0)
# 東京・セトリ（つんつ君だけのできごと）を外す
i=s.index('  function tokyoTick() {'); j=s.index('  applyEnv(); envAt = performance.now() + 15000;')
s=s[:i]+s[j:]
# say window font + gentle 困る color
R("padding: 9px 14px 8px; font: 400 1.02rem/1.5 var(--font-body);","padding: 9px 14px 8px; font: 400 1.02rem/1.55 var(--font-display);")
R(".say.angry { background: #ffe3dc; color: #a32a12; font-family: var(--font-display); font-weight: 400; }",".say.angry { background: #2b1f3a; color: #ffe9a8; }")
R(".say.angry::after { background: #ffe3dc; }",".say.angry::after { background: #2b1f3a; }")
open(p,'w',encoding='utf-8').write(s)
print('ok', s.count('つんつ'), s.count('グミ、'))
