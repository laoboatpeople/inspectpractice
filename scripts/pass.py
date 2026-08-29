#!/usr/bin/env python3
"""Single-pass generator for one group of chapters. Run serially."""

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
    7: '0735cc87-a56c-4c68-bc7c-43d76b7c42e8',
    8: '6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',
    9: '00d49e64-cc9a-41c1-be2d-017b0ad086cd',
    10: '5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',
    11: '50f189b9-fb91-4bea-bc53-6fc45fd7dcef',
    12: 'f7b87cdd-613d-4b41-b70f-bef63afc9d28',
}

ARGS = sys.argv[1:]
if len(ARGS) < 4:
    print("Usage: python3 pass.py <examId> <chapters_csv> <name> <prompt>")
    sys.exit(1)

EXAM_ID = ARGS[0]
CHAPTER_CSV = ARGS[1]  # e.g. "2,3,4,5,6"
NAME = ARGS[2]
PROMPT = ARGS[3]

chapters = [int(x) for x in CHAPTER_CSV.split(',')]
ch_map = CH_AF if EXAM_ID == '5e52edd3-2698-4788-9eee-1427332d92c0' else CH_PP

URLS = ["https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/amt_airframe_hb_vol_1.pdf",
        "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-31B_Aviation_Maintenance_Technician_Handbook.pdf"]

print(f"\n{'='*50}")
print(f"PASS: {NAME}")
print(f"{'='*50}")

body = {
    "contentIds": [],
    "instructions": PROMPT,
    "urls": URLS,
    "count": 500,
    "type": "MCQ",
    "difficulty": "MIXED"
}

questions = []
for attempt in range(3):
    try:
        req = urllib.request.Request(
            'http://127.0.0.1:4000/api/questions/chat-generate',
            data=json.dumps(body).encode(),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
            method='POST'
        )
        resp = urllib.request.urlopen(req, timeout=360)
        data = json.loads(resp.read().decode())
        questions = data.get('data', {}).get('questions', [])
        print(f"✅ Generated {len(questions)} questions")
        break
    except Exception as e:
        print(f"❌ Attempt {attempt+1}: {str(e)[:120]}")
        time.sleep(5)

if not questions:
    print("❌ No questions generated")
    sys.exit(1)

# Sort into chapters
by_ch = {}
for q in questions:
    ch = q.get('chapter')
    if ch is None:
        ch = chapters[0]  # default to first chapter if missing
    # Handle "Ch7", "Chapter 7", "7" variants
    if isinstance(ch, str):
        ch = re.sub(r'[^0-9]', '', ch)
    ch = int(ch) if ch else chapters[0]
    if ch not in by_ch:
        by_ch[ch] = []
    
    nq = {
        'question': q.get('question', ''),
        'options': list(q.get('options', [])),
        'correctAnswer': str(q.get('correctAnswer', 'A')),
        'explanation': q.get('explanation', '') or f'The correct answer is {q.get("correctAnswer","A")}.',
        'type': q.get('type', 'MCQ'),
        'difficulty': q.get('difficulty', 'MEDIUM'),
    }
    if len(nq['question']) >= 5 and len(nq['explanation']) >= 5:
        by_ch[ch].append(nq)

total_saved = 0
for ch in sorted(by_ch.keys()):
    qs = by_ch[ch]
    ch_id = ch_map.get(ch)
    if not ch_id:
        print(f"  ⚠️  Ch{ch}: no chapter ID")
        continue
    
    seen = set()
    unique = []
    for q in qs:
        key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
        if key not in seen:
            seen.add(key)
            unique.append(q)
    
    # Save in batches
    ch_saved = 0
    for i in range(0, len(unique), 50):
        batch = unique[i:i+50]
        for retry in range(3):
            try:
                req = urllib.request.Request(
                    'http://127.0.0.1:4000/api/questions/chat-save',
                    data=json.dumps({'questions': batch, 'examId': EXAM_ID, 'chapterId': ch_id}).encode(),
                    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                    method='POST'
                )
                resp = urllib.request.urlopen(req, timeout=60)
                result = json.loads(resp.read().decode())
                cnt = result.get('savedCount', 0)
                ch_saved += cnt
                break
            except urllib.error.HTTPError as e:
                err = e.read().decode()
                if 'explanation' in err:
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                    continue
                elif 'Duplicate' in err:
                    ch_saved += len(batch)  # Already exists
                    break
                else:
                    print(f"    HTTP {e.code}: {err[:100]}")
                    break
            except Exception as e:
                print(f"    Error: {str(e)[:60]}")
                break
    
    print(f"  📘 Ch{ch}: {len(unique)} unique → {ch_saved} saved")
    total_saved += ch_saved

print(f"\n🔥 Subtotal: {total_saved} questions saved for {NAME}")
