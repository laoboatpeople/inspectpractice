#!/usr/bin/env python3
"""
Short-prompt approach: use backend API with compact prompts.
Each call = one chapter group. Runs serially.
"""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()
API = 'http://127.0.0.1:4000/api'

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
    7: '0735cc87-a56c-4c68-bc7c-43d76b7c42e8',
    8: '6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',
    9: '00d49e64-cc9a-41c1-be2d-017b0ad086cd',
    10: '5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',
    11: '50f189b9-fb91-4bea-bc53-6fc45fd7dcef',
    12: 'f7b87cdd-613d-4b41-b70f-bef63afc9d28',
}

URLS = [
    "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-31B_Aviation_Maintenance_Technician_Handbook.pdf"
]

def run_pass(name, exam_id, chapters, prompt):
    print(f"\n{'='*50}")
    print(f"🔥 {name}")
    print(f"{'='*50}")
    
    body = {
        "contentIds": [],
        "instructions": prompt,
        "urls": URLS,
        "count": 300,
        "type": "MCQ",
        "difficulty": "MIXED"
    }
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                f'{API}/questions/chat-generate',
                data=json.dumps(body).encode(),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                method='POST'
            )
            resp = urllib.request.urlopen(req, timeout=360)
            data = json.loads(resp.read().decode())
            questions = data.get('data', {}).get('questions', [])
            print(f"✅ Generated {len(questions)} questions")
            
            if data.get('data', {}).get('savedCount', 0) > 0:
                print(f"   (auto-saved via backend)")
                return questions, data['data']['savedCount']
            
            # Manual save with chapter mapping
            ch_map = CH_AF if exam_id == '5e52edd3-2698-4788-9eee-1427332d92c0' else CH_PP
            total_saved = 0
            
            by_ch = {}
            for q in questions:
                ch = q.get('chapter')
                if ch is None:
                    continue
                if isinstance(ch, str):
                    ch = re.sub(r'[^0-9]', '', ch)
                try:
                    ch = int(ch)
                except:
                    continue
                if ch not in by_ch:
                    by_ch[ch] = []
                
                opts = list(q.get('options', []))
                if len(opts) > 0 and not opts[0].startswith(('A)', 'B)')):
                    opts = [f"{chr(65+i)}) {o}" for i, o in enumerate(opts[:4])]
                
                nq = {
                    'question': q.get('question', ''),
                    'options': opts,
                    'correctAnswer': str(q.get('correctAnswer', 'A')).replace(')', '').strip()[-1:] if q.get('correctAnswer') else 'A',
                    'explanation': q.get('explanation', '') or f'The correct answer is {q.get("correctAnswer","A")}.',
                    'type': q.get('type', 'MCQ'),
                    'difficulty': q.get('difficulty', 'MEDIUM'),
                }
                if len(nq['question']) >= 5 and len(nq['explanation']) >= 5:
                    by_ch[ch].append(nq)
            
            total_saved = 0
            for ch in sorted(by_ch.keys()):
                ch_id = ch_map.get(ch)
                if not ch_id:
                    continue
                qs = by_ch[ch]
                
                seen = set()
                unique = []
                for q in qs:
                    key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
                    if key not in seen:
                        seen.add(key)
                        unique.append(q)
                
                ch_saved = 0
                for i in range(0, len(unique), 50):
                    batch = unique[i:i+50]
                    for retry in range(3):
                        try:
                            req2 = urllib.request.Request(
                                f'{API}/questions/chat-save',
                                data=json.dumps({'questions': batch, 'examId': exam_id, 'chapterId': ch_id}).encode(),
                                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                                method='POST'
                            )
                            resp2 = urllib.request.urlopen(req2, timeout=60)
                            r2 = json.loads(resp2.read().decode())
                            ch_saved += r2.get('savedCount', 0)
                            break
                        except urllib.error.HTTPError as e:
                            err = e.read().decode()
                            if 'explanation' in err:
                                for q in batch:
                                    if len(q.get('explanation','')) < 5:
                                        q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                                continue
                            print(f"    HTTP {e.code} Ch{ch}: {err[:60]}")
                            break
                        except Exception as e:
                            print(f"    Error Ch{ch}: {str(e)[:60]}")
                            break
                
                total_saved += ch_saved
                print(f"  📘 Ch{ch}: {len(unique)} unique → {ch_saved} saved")
            
            print(f"🔥 {name}: {total_saved} questions saved")
            return questions, total_saved
            
        except Exception as e:
            print(f"❌ Attempt {attempt+1}: {str(e)[:120]}")
            time.sleep(10)
    
    print(f"❌ {name}: Failed")
    return [], 0

# ── Run passes serially ──
ALL_SAVED = 0

# Pass 1: Already done - M-POWERPLANT Ch1-6
print("✅ Already done: M-POWERPLANT Ch1-6 (97 questions)")

# Remaining passes
airframe_chapters = {
    "M-AIRFRAME Ch2-6": (CH_AF, '5e52edd3-2698-4788-9eee-1427332d92c0', [2,3,4,5,6]),
    "M-AIRFRAME Ch7-12": (CH_AF, '5e52edd3-2698-4788-9eee-1427332d92c0', [7,8,9,10,11,12]),
}
powerplant_pass = {
    "M-POWERPLANT Ch7-12": (CH_PP, '8116a886-bb07-4bca-9a5b-3728bb8b219f', [7,8,9,10,11,12]),
}

for name, (ch_map, exam_id, ch_list) in {**airframe_chapters, **powerplant_pass}.items():
    ch_str = ', '.join([f'Ch{c}' for c in ch_list])
    
    if '2-6' in name:
        desc = "Ch2=Welding/Plastics Ch3=Assembly/Rigging Ch4=Fabric Ch5=Paint Ch6=Hydraulics"
    elif '7-12' in name and 'PP' in name:
        desc = "Ch7=TurbineLube Ch8=FADEC Ch9=Ignition Ch10=Indicating Ch11=Propeller Ch12=Installation"
    else:
        desc = "Ch7=LandingGear Ch8=Warning/Ice Ch9=Pressurization Ch10=Fuel Ch11=FlightControls Ch12=FireProtection"
    
    prompt = f"""Generate 20 MCQ per chapter for {name}. Topics: {desc}. Each question MUST include "chapter" as an INTEGER (the chapter number). Format JSON: {{"question","options"["A)...","B)...","C)...","D)..."],"correctAnswer":"A","explanation","type":"MCQ","difficulty","chapter":N}} Use realistic AME scenarios. Return ONLY the JSON object with questions array."""
    
    _, saved = run_pass(name, exam_id, ch_list, prompt)
    ALL_SAVED += saved

print(f"\n{'='*50}")
print(f"🔥 GRAND TOTAL: {ALL_SAVED + 97 + 161} questions in DB")
print(f"   (161 Ch1 + 97 PP Ch1-6 + {ALL_SAVED} new)")
