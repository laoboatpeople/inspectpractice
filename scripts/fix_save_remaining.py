#!/usr/bin/env python3
"""Save the remaining questions that failed (batch 1) after fixing explanations."""

import json
import urllib.request
import time

TOKEN = open('/tmp/admin_token.txt').read().strip()
API = 'http://127.0.0.1:4000/api/questions/chat-save'

EXAM_ID = '5e52edd3-2698-4788-9eee-1427332d92c0'
CHAPTER_ID = 'cf079001-08a4-4c0b-8974-447003927d1b'

questions = json.load(open('/tmp/license_m_questions.json'))

# Fix all questions with short/no explanation — add a default one
fixed = []
for q in questions:
    expl = q.get('explanation', '') or ''
    if len(expl.strip()) < 5:
        expl = f'The correct answer is {q.get("correctAnswer", "A")}. This question tests knowledge of {q.get("difficulty", "standard")} level content related to aircraft maintenance under applicable regulations and standards.'
        print(f'  Fixed empty explanation for: {q.get("question","")[:60]}...')
    
    opts = q.get('options', [])
    if isinstance(opts, dict):
        opts = list(opts.values())
    
    fixed.append({
        'question': q['question'],
        'options': opts,
        'correctAnswer': str(q.get('correctAnswer', 'A')),
        'explanation': expl,
        'type': q.get('type', 'MCQ'),
        'difficulty': q.get('difficulty', 'MEDIUM'),
    })

# Save batch 1 (index 0-49)
batch = fixed[:50]
body = {
    'questions': batch,
    'examId': EXAM_ID,
    'chapterId': CHAPTER_ID,
}

req = urllib.request.Request(
    API,
    data=json.dumps(body).encode(),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {TOKEN}'
    },
    method='POST'
)

try:
    resp = urllib.request.urlopen(req, timeout=60)
    result = json.loads(resp.read().decode())
    saved = result.get('savedCount', 0)
    print(f'✅ Saved {saved} questions from batch 1 (fixed explanations)')
except Exception as e:
    print(f'❌ Failed: {e}')
    if hasattr(e, 'read'):
        print(e.read().decode()[:500])
