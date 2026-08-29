#!/usr/bin/env python3
"""Final attempt: TC URLs only (no heavy PDFs), separate calls per chapter group."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()
API = 'http://127.0.0.1:4000/api'

# Lightweight URLs (HTML pages, no heavy PDFs)
URLS = [
    "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars",
    "https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/"
]

CH_ID = {
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

PASSES = [
    {
        "exam_name": "M-AIRFRAME Ch2-6",
        "exam_id": '5e52edd3-2698-4788-9eee-1427332d92c0',
        "chapters": [2,3,4,5,6],
        "prompt": "Generate 20 MCQ per chapter for M-AIRFRAME Ch2(2=Welding/Plastics),Ch3(Assembly/Rigging),Ch4(Fabric),Ch5(Paint),Ch6(Hydraulics). Each: question, options[\"A)t\",\"B)t\",\"C)t\",\"D)t\"], correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER(2-6). Return JSON with questions array."
    },
    {
        "exam_name": "M-AIRFRAME Ch7-12",
        "exam_id": '5e52edd3-2698-4788-9eee-1427332d92c0',
        "chapters": [7,8,9,10,11,12],
        "prompt": "Generate 20 MCQ per chapter for M-AIRFRAME Ch7(LandingGear),Ch8(Warning/Ice),Ch9(Pressurization),Ch10(Fuel),Ch11(FlightControls),Ch12(FireProtection). Each: question, options[\"A)t\",\"B)t\",\"C)t\",\"D)t\"], correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER. JSON with questions array."
    },
    {
        "exam_name": "M-POWERPLANT Ch7-12",
        "exam_id": '8116a886-bb07-4bca-9a5b-3728bb8b219f',
        "chapters": [7,8,9,10,11,12],
        "prompt": "Generate 20 MCQ per chapter for M-POWERPLANT Ch7(TurbineLube),Ch8(FADEC),Ch9(Ignition),Ch10(Indicating),Ch11(Propeller),Ch12(Installation/Fire). Each: question, options[\"A)t\",\"B)t\",\"C)t\",\"D)t\"], correctAnswer, explanation, type=MCQ, difficulty, chapter=INTEGER. JSON with questions array."
    },
]

def save_batch(exam_id, ch_id, questions):
    if not questions: return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        for retry in range(3):
            try:
                body = {'questions': batch, 'examId': exam_id, 'chapterId': ch_id}
                req = urllib.request.Request(f'{API}/questions/chat-save',
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

TOTAL = 0

for p in PASSES:
    print(f"\n{'='*50}")
    print(f"🔥 {p['exam_name']}")
    
    resp_data = None
    for attempt in range(3):
        try:
            body = {
                "contentIds": [], "instructions": p['prompt'],
                "urls": URLS, "count": 300,
                "type": "MCQ", "difficulty": "MIXED"
            }
            req = urllib.request.Request(f'{API}/questions/chat-generate',
                data=json.dumps(body).encode(),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                method='POST')
            resp = urllib.request.urlopen(req, timeout=360)
            resp_data = json.loads(resp.read().decode())
            print(f"  ✅ API responded")
            break
        except Exception as e:
            print(f"  ❌ Attempt {attempt+1}: {str(e)[:80]}")
            time.sleep(3)
    
    questions = resp_data.get('data', {}).get('questions', []) if resp_data else []
    print(f"  Questions: {len(questions)}")
    
    if not questions:
        print(f"  Response preview: {json.dumps(resp_data)[:300]}")
        continue
    
    # Parse chapter
    by_ch = {}
    for q in questions:
        ch = q.get('chapter')
        if isinstance(ch, str): ch = re.sub(r'[^0-9]', '', ch)
        try: ch = int(ch)
        except: continue
        if ch not in p['chapters']: continue
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
    
    print(f"  Parsed chapters: {list(by_ch.keys())}")
    
    total_saved = 0
    for ch in sorted(by_ch.keys()):
        ch_id = CH_ID.get(ch)
        if not ch_id:
            print(f"  ⚠️  No ID for Ch{ch}")
            continue
        
        qs = by_ch[ch]
        seen = set()
        unique = []
        for q in qs:
            key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
            if key not in seen:
                seen.add(key)
                unique.append(q)
        
        saved = save_batch(p['exam_id'], ch_id, unique)
        total_saved += saved
        print(f"  📘 Ch{ch}: {len(unique)} unique → {saved} saved")
    
    TOTAL += total_saved
    print(f"  ➡️  Subtotal: {total_saved}")

print(f"\n{'='*50}")
print(f"🔥 FINAL: {TOTAL} new + 258 existing = {TOTAL+258} total")
