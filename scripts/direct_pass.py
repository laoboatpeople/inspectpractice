#!/usr/bin/env python3
"""
Direct DeepSeek API call — bypass the backend's long system prompt.
Fetches FAA PDFs directly via PyMuPDF, calls DeepSeek, saves via chat-save.
"""

import json, urllib.request, urllib.error, sys, time, re, os, subprocess

TOKEN = open('/tmp/admin_token.txt').read().strip()
DEEPSEEK_KEY = open('/home/chuck/projects/inspectpractice/server/.env').read().split('AI_API_KEY=')[1].split('\n')[0].strip().strip('"').strip("'")

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

# ── Fetch PDF content via Hermes Python (has PyMuPDF) ──
def fetch_pdf_text(url, max_chars=15000):
    """Use system python3 with PyMuPDF to extract PDF text."""
    script = f"""
import json, urllib.request, tempfile, os, sys
url = {json.dumps(url)}
try:
    resp = urllib.request.urlopen(url, timeout=30)
    data = resp.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as f:
        f.write(data)
        tmppath = f.name
    import fitz
    doc = fitz.open(tmppath)
    text = ''
    for page in doc:
        text += page.get_text()
    doc.close()
    os.unlink(tmppath)
    print(text[:{max_chars}])
except Exception as e:
    print(f'ERROR: {{e}}')
"""
    proc = subprocess.run(['python3', '-c', script], capture_output=True, text=True, timeout=60)
    out = proc.stdout.strip()
    if out.startswith('ERROR:'):
        print(f'  ⚠️  PDF fetch failed: {out}')
        return ''
    return out

# ── Call DeepSeek directly ──
def call_deepseek(system_prompt, user_prompt):
    body = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 16000,
    }
    req = urllib.request.Request(
        'https://api.deepseek.com/v1/chat/completions',
        data=json.dumps(body).encode(),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {DEEPSEEK_KEY}'
        },
        method='POST'
    )
    resp = urllib.request.urlopen(req, timeout=300)
    data = json.loads(resp.read().decode())
    content = data['choices'][0]['message']['content']
    
    # Try to extract JSON
    try:
        return json.loads(content)
    except:
        pass
    m = re.search(r'```(?:json)?\s*([\s\S]+?)\s*```', content)
    if m:
        try:
            return json.loads(m.group(1))
        except:
            pass
    # Find first { and last }
    start = content.find('{')
    end = content.rfind('}')
    if start >= 0 and end > start:
        try:
            return json.loads(content[start:end+1])
        except:
            pass
    return {"questions": []}

# ── Save questions to DB ──
def save_questions(exam_id, chapter_id, questions):
    if not questions:
        return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        body = {
            'questions': batch,
            'examId': exam_id,
            'chapterId': chapter_id,
        }
        for attempt in range(3):
            try:
                req = urllib.request.Request(
                    'http://127.0.0.1:4000/api/questions/chat-save',
                    data=json.dumps(body).encode(),
                    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                    method='POST'
                )
                resp = urllib.request.urlopen(req, timeout=60)
                result = json.loads(resp.read().decode())
                total += result.get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                err = e.read().decode()
                if 'explanation' in err:
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                    continue
                else:
                    print(f'    HTTP {e.code}: {err[:80]}')
                    break
            except Exception as e:
                print(f'    Error: {str(e)[:60]}')
                break
    return total

# ── MAIN ──
if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) < 2:
        print("Usage: python3 direct_pass.py <title> <topic>")
        print("  title: e.g. 'AF-2-6' or 'PP-7-12'")
        print("  topic: short description")
        sys.exit(1)
    
    title = args[0]  # e.g. "M-AIRFRAME Ch2-6"
    topic = ' '.join(args[1:])
    
    print(f"\n{'='*50}")
    print(f"PASS: {title}")
    print(f"Topic: {topic}")
    print(f"{'='*50}")
    
    # Determine config from title
    is_airframe = 'AIRFRAME' in title or 'AF-' in title
    ch_map = CH_AF if is_airframe else CH_PP
    exam_id = '5e52edd3-2698-4788-9eee-1427332d92c0' if is_airframe else '8116a886-bb07-4bca-9a5b-3728bb8b219f'
    
    # Chapters from title
    ch_range = re.findall(r'Ch([0-9]+)-([0-9]+)', title)
    if not ch_range:
        ch_range = re.findall(r'([0-9]+)-([0-9]+)', title)
    if ch_range:
        ch_start, ch_end = int(ch_range[0][0]), int(ch_range[0][1])
        chapters = list(range(ch_start, ch_end + 1))
    else:
        chapters = list(ch_map.keys())
    
    print(f"Chapters: {chapters}")
    
    # Fetch PDF content
    print("Fetching FAA handbooks...")
    pdf_texts = []
    pdfs = [
        ("FAA AMT Airframe Vol 1", "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/amt_airframe_hb_vol_1.pdf"),
        ("FAA AMT Handbook", "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-31B_Aviation_Maintenance_Technician_Handbook.pdf")
    ]
    for name, url in pdfs:
        print(f"  Fetching {name}...")
        text = fetch_pdf_text(url, 20000)
        if text:
            pdf_texts.append(f"--- {name} ---\n{text}")
            print(f"    ✅ {len(text)} chars")
        else:
            print(f"    ⚠️  Empty")
    
    combined = '\n\n'.join(pdf_texts) if pdf_texts else 'No source content available.'
    
    # Build prompts
    chapters_str = ', '.join([f'Ch{c}: {topic.split("Ch" + str(c))[1].split(",")[0] if "Ch" + str(c) in topic else ""}' for c in chapters])
    
    system_prompt = """You are an AME exam question writer for Transport Canada License M.
Generate MCQ questions for aircraft maintenance exams.
Each question must be a realistic maintenance scenario.
Return ONLY valid JSON: {"questions": [{"question": "string", "options": ["A) text", "B) text", "C) text", "D) text"], "correctAnswer": "A-D", "explanation": "string", "type": "MCQ", "difficulty": "EASY|MEDIUM|HARD", "chapter": integer}]}
Do NOT include markdown, preamble, or anything else. ONLY the JSON object."""

    user_prompt = f"""Source content:
{combined[:40000]}

Generate 15 MCQ questions per chapter for {title}.
Chapters: {chapters}

For each question:
- Set the "chapter" field to the chapter number (integer, not string)
- Use realistic aircraft maintenance scenarios
- Reference FAA AC43.13 and TC standards where applicable
- Difficulty: mix of EASY, MEDIUM, HARD
- All must be type "MCQ"
- Each option must start with "A) ", "B) ", "C) ", or "D) "
- correctAnswer must be a single letter: A, B, C, or D
- explanation should be detailed (3-5 sentences)

Return ONLY the JSON object, no markdown."""

    print("\nCalling DeepSeek...")
    t0 = time.time()
    result = call_deepseek(system_prompt, user_prompt)
    elapsed = time.time() - t0
    questions = result.get('questions', [])
    print(f"✅ DeepSeek returned {len(questions)} questions in {elapsed:.0f}s")
    
    if not questions:
        if 'questions' in result:
            print(f"   questions key exists but empty: {json.dumps(result)[:200]}")
        else:
            print(f"   No 'questions' key. Result keys: {list(result.keys())}")
        sys.exit(1)
    
    # Parse chapter numbers and save
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
        
        nq = {
            'question': q.get('question', ''),
            'options': [o for o in list(q.get('options', [])) if o.startswith(('A)', 'B)', 'C)', 'D)'))],
            'correctAnswer': str(q.get('correctAnswer', 'A')).replace(')', '').strip(),
            'explanation': q.get('explanation', '') or f'The correct answer is {q.get("correctAnswer","A")}.',
            'type': q.get('type', 'MCQ'),
            'difficulty': q.get('difficulty', 'MEDIUM'),
        }
        if len(nq['question']) >= 5:
            by_ch[ch].append(nq)
    
    print(f"\nSaving to DB:")
    for ch in sorted(by_ch.keys()):
        ch_id = ch_map.get(ch)
        if not ch_id:
            print(f"  ⚠️  No ID for Ch{ch}")
            continue
        qs = by_ch[ch]
        
        # Dedup within chapter
        seen = set()
        unique = []
        for q in qs:
            key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
            if key not in seen:
                seen.add(key)
                unique.append(q)
        
        saved = save_questions(exam_id, ch_id, unique)
        total_saved += saved
        print(f"  📘 Ch{ch}: {len(unique)} unique → {saved} saved")
    
    print(f"\n🔥 Subtotal: {total_saved} questions saved for {title}")
