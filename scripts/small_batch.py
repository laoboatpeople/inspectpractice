#!/usr/bin/env python3
"""Small batch generator: 5 Q per chapter per call. Multiple passes."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()

CH_AF = {7:'8cd8b62b-536d-4104-8e02-75950f424edc',8:'d313ae79-ec0c-42a6-a7c8-634ac936cf32',9:'2183b76d-a4e8-4eca-a070-2dfdb713ac8a',10:'54ce568c-3862-46ad-97cc-95a435de5564',11:'bcd5c0e1-6dd7-41ab-ba8f-506be1008cff',12:'70fa715a-3945-4952-b989-4bd67b014599'}
CH_PP = {7:'0735cc87-a56c-4c68-bc7c-43d76b7c42e8',8:'6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',9:'00d49e64-cc9a-41c1-be2d-017b0ad086cd',10:'5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',11:'50f189b9-fb91-4bea-bc53-6fc45fd7dcef',12:'f7b87cdd-613d-4b41-b70f-bef63afc9d28'}
CH_AF_12 = {1:'cf079001-08a4-4c0b-8974-447003927d1b',2:'468e6e10-55ed-41b1-944a-63c42dc5e7b6',3:'f3d91ffb-4e94-4d31-b02a-27959f15038b',4:'b770f06d-83ea-4711-a228-2feb9b0ebaae',5:'0b9b6a9b-d688-4b3e-a356-565387dd83e8',6:'e64ba043-9e64-4cd3-9d6f-bd6ee5feb649'}
AF_EXAM='5e52edd3-2698-4788-9eee-1427332d92c0'
PP_EXAM='8116a886-bb07-4bca-9a5b-3728bb8b219f'
URL="https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"

def save_ch(exam_id, ch_id, questions):
    if not questions: return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        for retry in range(3):
            try:
                body = {'questions': batch, 'examId': exam_id, 'chapterId': ch_id}
                req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-save',
                    data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
                resp = urllib.request.urlopen(req, timeout=60)
                total += json.loads(resp.read().decode()).get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                if 'explanation' in e.read().decode():
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                    continue
                break
            except: break
    return total

def call_and_save(exam_id, ch_map, c1, c2, topic1, topic2):
    """Single call: 5 Q per chapter. Save immediately."""
    prompt = f"Generate 5 MCQ for Ch{c1}({topic1}, chapter={c1}) and 5 for Ch{c2}({topic2}, chapter={c2}). Each: question, options[A)B)C)D], correctAnswer(A-D), explanation(3-5sentences), type=MCQ, difficulty, chapter=INTEGER. JSON {{questions:[...]}}"
    
    try:
        body = {"contentIds":[],"urls":[URL],"instructions":prompt,"count":20,"type":"MCQ","difficulty":"MIXED"}
        req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-generate',
            data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
        resp = urllib.request.urlopen(req, timeout=300)
        questions = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
        
        if not questions:
            print(f'  0 Q')
            return 0
        
        total = 0
        for ch in [c1, c2]:
            qs = [q for q in questions if str(q.get('chapter','')) == str(ch)]
            if not qs: continue
            ch_id = ch_map.get(ch)
            if not ch_id: continue
            seen = set()
            unique = []
            for q in qs:
                opts = list(q.get('options',[]))
                nq = {'question':q.get('question',''),'options':opts,'correctAnswer':str(q.get('correctAnswer','A')).strip().upper()[-1:],'explanation':q.get('explanation','') or 'Ref: TC.','type':'MCQ','difficulty':q.get('difficulty','MEDIUM')}
                key = re.sub(r'[^\w\s]','',nq['question'].lower())[:80]
                if len(nq['question'])>=5 and key not in seen:
                    seen.add(key)
                    unique.append(nq)
            saved = save_ch(exam_id, ch_id, unique)
            total += saved
            print(f'  Ch{ch}: {len(unique)}→{saved}', end='')
        print(f'  ({total})')
        return total
    except Exception as e:
        print(f'  Error: {str(e)[:60]}')
        return 0

# ── Runs: 3 rounds per pair, 5 Q per chapter per round = 15 Q per chapter ──
ROUNDS = 3
TOTAL = 0

# M-AIRFRAME Ch7-12
pairs_af = [(7,8,'Landing Gear/Brakes','Warning/Ice/Rain'),(9,10,'Pressurization/Oxygen','Fuel Systems'),(11,12,'Flight Controls','Fire Protection')]
for c1, c2, t1, t2 in pairs_af:
    print(f'\n--- AF Ch{c1}-{c2} ---')
    attr = 0
    for r in range(ROUNDS):
        print(f'  Round {r+1}: ', end='')
        s = call_and_save(AF_EXAM, CH_AF, c1, c2, t1, t2)
        attr += s
        time.sleep(5)
    print(f'  ✅ Total: {attr}')
    TOTAL += attr

# M-POWERPLANT Ch7-12
pairs_pp = [(7,8,'Turbine Lube/Sealing','Fuel Controls/FADEC'),(9,10,'Turbine Ignition','Engine Indicating'),(11,12,'Propeller','Installation/Fire')]
for c1, c2, t1, t2 in pairs_pp:
    print(f'\n--- PP Ch{c1}-{c2} ---')
    attr = 0
    for r in range(ROUNDS):
        print(f'  Round {r+1}: ', end='')
        s = call_and_save(PP_EXAM, CH_PP, c1, c2, t1, t2)
        attr += s
        time.sleep(5)
    print(f'  ✅ Total: {attr}')
    TOTAL += attr

print(f'\n{"="*50}')
print(f'🔥 TOTAL NEW: {TOTAL}')
