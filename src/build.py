import json, re
src=open('/home/claude/tuntu/index.html',encoding='utf-8').read().split('\n')
def L(a,b): return src[a-1:b]   # 1-indexed inclusive
def rd(p): return open('/home/claude/dinaso-app/src/'+p,encoding='utf-8').read().rstrip('\n').split('\n')
lines=json.load(open('/home/claude/dinaso-app/src/lines.json',encoding='utf-8'))
B=[l.replace('/*LINES_JSON*/',json.dumps(lines,ensure_ascii=False)) for l in rd('B_talk.js')]
rep=[  # (start,end,new_lines)  original numbering, applied bottom-up
 (2711,2985,B),
 (2144,2709,rd('C_loop.js')),
 (1780,2141,rd('D_events.js')),
 (1647,1667,[]),
 (1480,1595,rd('F_state.js')),
 (1193,1297,rd('H_sound.js')),
 (1155,1191,rd('I_rig.js')),
 (642,1144,rd('J_room.js')),
 (490,584,rd('K_data.js')),
 (485,488,['  var KEY = "dinaso-v1";','  // だいなそーは描画座標（足元 200,486）で描き、部屋の CX/FY に S2 倍で置く（リグ側）','  var S = 1.6, CX = 640, FY = 1008;','']),
 (254,444,open('/home/claude/dinaso-app/src/M_scene.html',encoding='utf-8').read().rstrip('\n').split('\n')),
]
rep.sort(key=lambda r:-r[0])
out=src[:]
for a,b,new in rep:
    out[a-1:b]=new
open('/home/claude/dinaso-app/index.html','w',encoding='utf-8').write('\n'.join(out))
print(len(out))
