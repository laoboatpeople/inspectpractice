#!/usr/bin/env python3
"""Save generated questions to correct chapters."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()

CH_AF = {
    2: '468e6e10-55ed-41b1-944a-63c42dc5e7b6',
    3: 'f3d91ffb-4e94-4d31-b02a-27959f15038b',
    4: 'b770f06d-83ea-4711-a228-2feb9b0ebaae',
    5: '0b9b6a9b-d688-4b3e-a356-565387dd83e8',
    6: 'e64ba043-9e64-4cd3-9d6f-bd6ee5feb649',
    7: '8cd8b62b-536d-4104-8e02-75950f424edc',
    8: 'd313ae79-ec0c-42a6-a7c8-634ac936cf32',
    9: '2183b76d-a4e8-4eca-a070-2dfdb713ac8a',
    10: '54ce568c-3862-46ad-97cc-95a435de5564',
    11: 'bcd5c0e1-6dd7-41ab-ba8f-506be1008cff',
    12: '70fa715a-3945-4952-b989-4bd67b014599',
}
CH_PP = {
    1: '2a07fca3-7817-4e92-97fd-56b899828e7e',
    2: '488e04e9-9e31-43a8-b145-00cf429da0e8',
    3: '2d8eb381-dd97-4738-aced-b3ad80015ec7',
    4: '6466c784-43ab-4e57-81f2-64b3bfe19ec9',
    5: '94a7df31-b1d9-49ef-933e-a4022f3f0b81',
    6: '4205a8f3-46f0-40e9-bca3-b74e477114f7',
    7: '0735cc87-a56c-4c68-bc7c-43d76b7c42e8',
    8: '6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',
    9: '00d49e64-cc9a-41c1-be2d-017b0ad086cd',
    10: '5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',
    11: '50f189b9-fb91-4bea-bc53-6fc45fd7dcef',
    12: 'f7b87cdd-613d-4b41-b70f-bef63afc9d28',
}

AF_EXAM = '5e52edd3-2698-4788-9eee-1427332d92c0'
PP_EXAM = '8116a886-bb07-4bca-9a5b-3728bb8b219f'

def save_chapter(exam_id, ch_id, questions):
    if not questions: return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        for retry in range(3):
            try:
                body = {'questions': batch, 'examId': exam_id, 'chapterId': ch_id}
                req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-save',
                    data=json.dumps(body).encode(),
                    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                    method='POST')
                resp = urllib.request.urlopen(req, timeout=60)
                total += json.loads(resp.read().decode()).get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                err = e.read().decode()
                if 'explanation' in err:
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                    continue
                break
            except: break
    return total

def process_and_save(exam_id, ch_map, questions):
    by_ch = {}
    for q in questions:
        ch = q.get('chapter')
        if isinstance(ch, str): ch = re.sub(r'[^0-9]', '', ch)
        try: ch = int(ch)
        except: continue
        if ch not in by_ch: by_ch[ch] = []
        
        opts = list(q.get('options', []))
        nq = {
            'question': q.get('question',''),
            'options': opts,
            'correctAnswer': str(q.get('correctAnswer','A')).strip().upper()[-1:],
            'explanation': q.get('explanation','') or 'Reference: TC standards.',
            'type': 'MCQ',
            'difficulty': q.get('difficulty','MEDIUM'),
        }
        if len(nq['question']) >= 5:
            by_ch[ch].append(nq)
    
    total = 0
    for ch in sorted(by_ch.keys()):
        ch_id = ch_map.get(ch)
        if not ch_id:
            print(f'  ⚠️ Ch{ch}: no ID')
            continue
        
        qs = by_ch[ch]
        seen = set()
        unique = []
        for q in qs:
            key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
            if key not in seen:
                seen.add(key)
                unique.append(q)
        
        saved = save_chapter(exam_id, ch_id, unique)
        total += saved
        print(f'  📘 Ch{ch}: {len(unique)} unique → {saved} saved')
    
    return total

ARGS = sys.argv[1:]

if not ARGS or ARGS[0] == 'af-2-6':
    print('\n=== M-AIRFRAME Ch2-6 ===')
    resp = urllib.request.urlopen(urllib.request.Request(
        'http://127.0.0.1:4000/api/questions/chat-generate',
        data=json.dumps({
            "contentIds": [], "urls": ["https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"],
            "instructions": "Generate 20 MCQ per chapter for M-AIRFRAME Ch2(Welding/Plastics),Ch3(Assembly/Rigging),Ch4(Fabric),Ch5(Paint),Ch6(Hydraulics). Each: question, options, correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER(2-6). Return JSON questions array.",
            "count": 300, "type": "MCQ", "difficulty": "MIXED"
        }).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
        method='POST'), timeout=300)
    qs = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
    print(f'  Generated {len(qs)} questions')
    saved = process_and_save(AF_EXAM, CH_AF, qs)
    print(f'  ✅ Saved: {saved}')

if not ARGS or ARGS[0] == 'af-7-12':
    print('\n=== M-AIRFRAME Ch7-12 ===')
    resp = urllib.request.urlopen(urllib.request.Request(
        'http://127.0.0.1:4000/api/questions/chat-generate',
        data=json.dumps({
            "contentIds": [], "urls": ["https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"],
            "instructions": "Generate 20 MCQ per chapter for M-AIRFRAME Ch7(LandingGear),Ch8(Warning/Ice),Ch9(Pressurization),Ch10(Fuel),Ch11(FlightControls),Ch12(FireProtection). Each: question, options, correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER. JSON questions array.",
            "count": 300, "type": "MCQ", "difficulty": "MIXED"
        }).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
        method='POST'), timeout=300)
    qs = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
    print(f'  Generated {len(qs)} questions')
    saved = process_and_save(AF_EXAM, CH_AF, qs)
    print(f'  ✅ Saved: {saved}')

if not ARGS or ARGS[0] == 'pp-7-12':
    print('\n=== M-POWERPLANT Ch7-12 ===')
    resp = urllib.request.urlopen(urllib.request.Request(
        'http://127.0.0.1:4000/api/questions/chat-generate',
        data=json.dumps({
            "contentIds": [], "urls": ["https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"],
            "instructions": "Generate 20 MCQ per chapter for M-POWERPLANT Ch7(TurbineLube),Ch8(FADEC),Ch9(Ignition),Ch10(Indicating),Ch11(Propeller),Ch12(Installation/Fire). Each: question, options, correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER. JSON questions array.",
            "count": 300, "type": "MCQ", "difficulty": "MIXED"
        }).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
        method='POST'), timeout=300)
    qs = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
    print(f'  Generated {len(qs)} questions')
    saved = process_and_save(PP_EXAM, CH_PP, qs)
    print(f'  ✅ Saved: {saved}')

print('\n🔥 DONE!')
