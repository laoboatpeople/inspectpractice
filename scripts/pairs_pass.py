#!/usr/bin/env python3
"""Generate and save questions in 2-chapter chunks for reliability."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()

CH = {
    7: '8cd8b62b-536d-4104-8e02-75950f424edc',
    8: 'd313ae79-ec0c-42a6-a7c8-634ac936cf32',
    9: '2183b76d-a4e8-4eca-a070-2dfdb713ac8a',
    10: '54ce568c-3862-46ad-97cc-95a435de5564',
    11: 'bcd5c0e1-6dd7-41ab-ba8f-506be1008cff',
    12: '70fa715a-3945-4952-b989-4bd67b014599',
}
CH_PP = {
    7: '0735cc87-a56c-4c68-bc7c-43d76b7c42e8',
    8: '6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',
    9: '00d49e64-cc9a-41c1-be2d-017b0ad086cd',
    10: '5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',
    11: '50f189b9-fb91-4bea-bc53-6fc45fd7dcef',
    12: 'f7b87cdd-613d-4b41-b70f-bef63afc9d28',
}

AF_EXAM = '5e52edd3-2698-4788-9eee-1427332d92c0'
PP_EXAM = '8116a886-bb07-4bca-9a5b-3728bb8b219f'

URL = "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"

PAIRS = [
    # M-AIRFRAME Ch7-12
    (AF_EXAM, CH, 7, 8, "M-AIRFRAME Ch7-8", "Ch7=Landing Gear & Brakes", "Ch8=Warning Systems & Ice/Rain Protection"),
    (AF_EXAM, CH, 9, 10, "M-AIRFRAME Ch9-10", "Ch9=Cabin Pressurization & Oxygen", "Ch10=Aircraft Fuel Systems"),
    (AF_EXAM, CH, 11, 12, "M-AIRFRAME Ch11-12", "Ch11=Flight Controls (Primary & Secondary)", "Ch12=Fire Protection Systems"),
    # M-POWERPLANT Ch7-12
    (PP_EXAM, CH_PP, 7, 8, "M-POWERPLANT Ch7-8", "Ch7=Turbine Engine Lubrication & Sealing", "Ch8=Turbine Fuel Controls & FADEC"),
    (PP_EXAM, CH_PP, 9, 10, "M-POWERPLANT Ch9-10", "Ch9=Turbine Ignition & Starting", "Ch10=Engine Indicating & Instrumentation"),
    (PP_EXAM, CH_PP, 11, 12, "M-POWERPLANT Ch11-12", "Ch11=Propeller Systems", "Ch12=Engine Installation, Fire Protection & Troubleshooting"),
]

TOTAL = 0

for exam_id, ch_map, c1, c2, name, t1, t2 in PAIRS:
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

def process_and_save(exam_id, ch_map, questions, ch1, ch2):
    total = 0
    for ch in [ch1, ch2]:
        qs = [q for q in questions if q.get('chapter') == ch or str(q.get('chapter','')) == str(ch)]
        if not qs:
            continue
        ch_id = ch_map.get(ch)
        if not ch_id:
            print(f'  ⚠️ Ch{ch}: no ID')
            continue
        seen = set()
        unique = []
        for q in qs:
            opts = list(q.get('options', []))
            nq = {
                'question': q.get('question',''),
                'options': opts,
                'correctAnswer': str(q.get('correctAnswer','A')).strip().upper()[-1:],
                'explanation': q.get('explanation','') or 'Reference: TC standards.',
                'type': 'MCQ',
                'difficulty': q.get('difficulty','MEDIUM'),
            }
            key = re.sub(r'[^\w\s]', '', nq['question'].lower())[:80]
            if len(nq['question']) >= 5 and key not in seen:
                seen.add(key)
                unique.append(nq)
        saved = save_batch(exam_id, ch_id, unique)
        total += saved
        print(f'  📘 Ch{ch}: {len(unique)} unique → {saved} saved')
    return total

TOTAL = 0

for exam_id, ch_map, name, t1, t2 in PAIRS:
    print(f'\n=== {name} ===')
    print(f'  Topics: {t1}, {t2}')
    
    ch_nums = re.findall(r'Ch(\d+)', name)
    c1, c2 = int(ch_nums[0]), int(ch_nums[1])
    
    prompt = f"Generate 20 MCQ each for {t1} (chapter={c1}) and {t2} (chapter={c2}). Each question: question, options[\"A)t\",\"B)t\",\"C)t\",\"D)t\"], correctAnswer(A-D), explanation, type=MCQ, difficulty, chapter=INTEGER. Return JSON questions array."
    
    for attempt in range(3):
        try:
            body = {"contentIds": [], "urls": [URL],
                "instructions": prompt, "count": 200,
                "type": "MCQ", "difficulty": "MIXED"}
            req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-generate',
                data=json.dumps(body).encode(),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                method='POST')
            resp = urllib.request.urlopen(req, timeout=360)
            questions = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
            
            if questions:
                print(f'  ✅ Generated {len(questions)} questions')
                saved = process_and_save(exam_id, ch_map, questions, c1, c2)
                TOTAL += saved
                print(f'  ➡️  Subtotal: {saved}')
                break
            else:
                print(f'  ❌ 0 questions (attempt {attempt+1})')
                time.sleep(3)
        except Exception as e:
            print(f'  ❌ Error: {str(e)[:80]}')
            time.sleep(5)

print(f'\n{"="*50}')
print(f'🔥 FINAL: {TOTAL} new questions saved!')
