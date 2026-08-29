#!/usr/bin/env python3
"""Deduplicate and save generated questions as PENDING to M-AIRFRAME Ch1."""

import json
import urllib.request
import time
import re
import sys

TOKEN = open('/tmp/admin_token.txt').read().strip()
API = 'http://127.0.0.1:4000/api/questions/chat-save'

# M-AIRFRAME exam + chapter 1 (most general, we'll re-assign later)
EXAM_ID = '5e52edd3-2698-4788-9eee-1427332d92c0'
CHAPTER_ID = 'cf079001-08a4-4c0b-8974-447003927d1b'

# Load generated questions
questions = json.load(open('/tmp/license_m_questions.json'))
print(f'Loaded {len(questions)} raw questions')

# ── Step 1: Dedup by normalizing question text ──
def normalize(q):
    """Lowercase, strip punctuation, remove extra spaces."""
    t = q.lower()
    t = re.sub(r'[^\w\s]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# First pass: dedup within the batch
seen = {}
unique = []
for q in questions:
    key = normalize(q.get('question', ''))
    # Only keep first 100 chars as key (avoids minor wording differences)
    short_key = key[:100]
    if short_key not in seen:
        seen[short_key] = True
        unique.append(q)

print(f'After in-batch dedup: {len(unique)} unique questions')

# ── Step 2: Check against existing DB questions ──
# Get all existing questions for M exams
req = urllib.request.Request(
    f'http://127.0.0.1:4000/api/questions/review?limit=5000',
    headers={'Authorization': f'Bearer {TOKEN}'}
)
try:
    resp = urllib.request.urlopen(req, timeout=15)
    existing_data = json.loads(resp.read().decode())
    existing = existing_data.get('data', [])
    print(f'Existing questions in DB: {len(existing)}')

    # Build set of normalized question keys from DB
    existing_keys = set()
    for e in existing:
        key = normalize(e.get('question', ''))[:100]
        existing_keys.add(key)

    # Filter out duplicates
    before = len(unique)
    unique = [q for q in unique if normalize(q.get('question', ''))[:100] not in existing_keys]
    print(f'After DB dedup: {len(unique)} (removed {before - len(unique)} duplicates)')
except Exception as e:
    print(f'Warning: could not check DB: {e}')
    print('Proceeding with in-batch dedup only')

if len(unique) == 0:
    print('No new questions to save. Exiting.')
    sys.exit(0)

# ── Step 3: Fix options format ──
# Options are ["A) text", "B) text", ...] — need to strip letter prefix for proper format
fixed = []
for q in unique:
    opts = q.get('options', [])
    # Ensure options is an array
    if isinstance(opts, dict):
        opts = list(opts.values())
    
    # Normalize: if options are strings, keep as-is (expected by DB)
    fixed.append({
        'question': q['question'],
        'options': opts,
        'correctAnswer': str(q.get('correctAnswer', 'A')),
        'explanation': q.get('explanation', ''),
        'type': q.get('type', 'MCQ'),
        'difficulty': q.get('difficulty', 'MEDIUM'),
    })

# ── Step 4: Save in batches of 50 ──
total_saved = 0
batch_size = 50

for i in range(0, len(fixed), batch_size):
    batch = fixed[i:i+batch_size]
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

    max_retries = 3
    for attempt in range(max_retries):
        try:
            resp = urllib.request.urlopen(req, timeout=60)
            result = json.loads(resp.read().decode())
            saved = result.get('savedCount', 0)
            total_saved += saved
            print(f'  Batch {i//batch_size + 1}/{(len(fixed)-1)//batch_size + 1}: saved {saved} questions')
            time.sleep(0.5)
            break
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f'  ❌ Batch {i//batch_size + 1} attempt {attempt+1}: HTTP {e.code} — {error_body[:200]}')
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                print(f'  ➡️  Skipping batch after {max_retries} failures')
        except Exception as e:
            print(f'  ❌ Batch {i//batch_size + 1} attempt {attempt+1}: {e}')
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                print(f'  ➡️  Skipping batch after {max_retries} failures')

print(f'\n🔥 FINAL: Saved {total_saved} questions as PENDING under M-AIRFRAME / Ch1')
print(f'   View at: https://inspectpractice.com/admin/questions/review')
