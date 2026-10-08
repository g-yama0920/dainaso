import re, json
D='/home/claude/dinaso/'
def numbered(block):
    return [re.sub(r'^\d+\.\s*','',l).strip() for l in block.split('\n') if re.match(r'^\d+\.\s',l.strip())]
def sections(text, level):
    # returns list of (title, body) for headings of given level
    pat=re.compile(r'^'+'#'*level+r' (.+)$',re.M)
    ms=list(pat.finditer(text)); out=[]
    for i,m in enumerate(ms):
        end=ms[i+1].start() if i+1<len(ms) else len(text)
        out.append((m.group(1).strip(), text[m.end():end]))
    return out
def sec2(text,key):
    for t,b in sections(text,2):
        if t.startswith(key): return b
    raise KeyError(key)
t1=open(D+'lines-01-gen.md',encoding='utf-8').read()
t2=open(D+'lines-02-timeofday.md',encoding='utf-8').read()
t3=open(D+'lines-03-events.md',encoding='utf-8').read()
t4=open(D+'lines-04-nasomeshi.md',encoding='utf-8').read()
L={}
b=sec2(t1,'first（'); L['first']=numbered(b)
L['first2']=sec2(t1,'first2').strip().split('\n')[0].strip()
L['gen']=numbered(sec2(t1,'gen'))
for k in ['early','morning','noon','afternoon','evening','night','late','deep']:
    L[k]=numbered(sec2(t2,k+'（'))
w=sec2(t3,'week'); L['week']=[numbered(b) for t,b in sections(w,3)]
L['rain']=numbered(sec2(t3,'rain'))
mon=[]
for l in sec2(t3,'month').split('\n'):
    m=re.match(r'- \*\*(\d+)月\*\* (.+)',l.strip())
    if m: mon.append([x.strip() for x in m.group(2).split('／')])
L['month']=mon
ab=[]
rng={'2〜3日ぶり':[2,3],'4〜7日ぶり':[4,7],'8〜30日ぶり':[8,30],'31日以上ぶり':[31,99999]}
for t,b in sections(sec2(t3,'absent'),3):
    ab.append(rng[t]+[numbered(b)])
L['absent']=ab
L['same']=[numbered(b) for t,b in sections(sec2(t3,'same'),3)]
L['growth']=[numbered(b) for t,b in sections(sec2(t3,'growth'),3)]
L['birthday']=numbered(sec2(t3,'birthday'))
L['myBirthday']=numbered(sec2(t3,'myBirthday'))
mi=[]
for l in sec2(t3,'mile（').split('\n'):
    m=re.match(r'- (\d+)日 … (.+)',l.strip())
    if m: mi.append([int(m.group(1)),m.group(2).strip()])
L['mile']=mi
om=[]
for l in sec2(t3,'openMile').split('\n'):
    m=re.match(r'- (\d+)日 … (.+)',l.strip())
    if m: om.append([int(m.group(1)),m.group(2).strip()])
L['openMile']=om
for l in sec2(t3,'ratioHi').split('\n'):
    m=re.match(r'- (Hi|Lo) … (.+)',l.strip())
    if m: L['ratio'+m.group(1)]=[x.strip() for x in m.group(2).split('／')]
hint={}
idmap={'やくそう':'yakusou','焼きたてのパン':'pan','干し肉':'niku','きのこのスープ':'soup','チーズ':'cheese','木の実':'nuts'}
for t,b in sections(sec2(t3,'hint'),3): hint[idmap[t]]=numbered(b)
L['hint']=hint
bad={}
for t,b in sections(sec2(t3,'bad'),3): bad={'あやしいキノコ':'kinoko','ひじき':'hijiki'}[t] and bad or bad; bad[{'あやしいキノコ':'kinoko','ひじき':'hijiki'}[t]]=numbered(b)
L['bad']=bad
L['full']=numbered(sec2(t3,'full'))
# なそ飯
A=sec2(t4,'A.'); B=sec2(t4,'B.'); C=sec2(t4,'C.'); Dm=sec2(t4,'D.'); E=sec2(t4,'E.')
L['mine']=numbered(A)+numbered(B)
cs=sections(C,3); L['early']+=numbered(cs[0][1]); L['noon']+=numbered(cs[1][1])
ev=numbered(cs[2][1]); L['evening']+=ev[:8]; L['night']+=ev[8:]
for i,l in enumerate([l for l in Dm.split('\n') if l.strip().startswith('- **')]):
    L['month'][i].append(re.sub(r'- \*\*\d+月\*\* ','',l.strip()))
cook={}
for t,b in sections(E,3): cook[t]=numbered(b)
L['cookSay']=cook
json.dump(L,open('/home/claude/dinaso-app/src/lines.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
tot=0
for k,v in L.items():
    n=sum(len(x) if isinstance(x,list) and not isinstance(x[0] if x else None,int) else 1 for x in (v.values() if isinstance(v,dict) else v)) if not isinstance(v,str) else 1
    print(k, len(v) if not isinstance(v,str) else 1)
