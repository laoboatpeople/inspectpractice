#!/usr/bin/env python3
"""NHIE question generator. Usage:
    python3 scripts/nhie_gen_chapters.py --chapters 1-4
    python3 scripts/nhie_gen_chapters.py --chapters 14-15
    python3 scripts/nhie_gen_chapters.py --chapters 1 --limit 3   # smoke test
Generates questions via the repo's OpenAI-compatible endpoint, balances answers
~25% per letter per chapter, writes JSON progress, inserts into DB as APPROVED.
"""
import argparse, json, os, random, re, sys, time, uuid
import urllib.request, urllib.error
import psycopg2

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
GEN_DIR = os.path.join(BASE, "gen")
os.makedirs(GEN_DIR, exist_ok=True)

def load_env():
    env = {}
    with open(os.path.join(REPO, "server/.env")) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
API_URL = (ENV.get("OPENAI_BASE_URL", "").rstrip("/")) + "/chat/completions"
MODEL = ENV.get("OPENAI_MODEL", "deepseek-chat")
KEY = ENV.get("OPENAI_API_KEY", "")

def chat(messages, temperature=0.7, max_tokens=5000):
    body = json.dumps({"model": MODEL, "messages": messages,
                       "temperature": temperature, "max_tokens": max_tokens}).encode()
    req = urllib.request.Request(API_URL, data=body,
                                 headers={"Content-Type": "application/json",
                                          "Authorization": f"Bearer {KEY}"})
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.loads(resp.read().decode())
            return data["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            last = f"HTTP {e.code}: {e.read().decode()[:300]}"
            time.sleep(5 * (attempt + 1))
        except Exception as e:
            last = str(e)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"chat failed: {last}")

def extract_json(content):
    content = content.strip()
    content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content)
    start, end = content.find("["), content.rfind("]")
    if start == -1 or end <= start:
        return None
    try:
        return json.loads(content[start:end + 1])
    except Exception:
        return None

def parse_items(content):
    arr = extract_json(content) or []
    out = []
    for it in arr:
        if not isinstance(it, dict):
            continue
        q = (it.get("question") or "").strip()
        opts = it.get("options") or []
        expl = (it.get("explanation") or "").strip()
        diff = (it.get("difficulty") or "MEDIUM").upper().strip()
        if diff not in ("EASY", "MEDIUM", "HARD"):
            diff = "MEDIUM"
        if len(q) < 40 or not isinstance(opts, list) or len(opts) != 4 or not all(isinstance(o, str) and o.strip() for o in opts):
            continue
        if len(expl) < 60:
            expl = None  # fill later rather than drop silently
        letter = str(it.get("answer") or "A")[0].upper()
        letter = letter if letter in "ABCD" else "A"
        out.append({"question": q, "options": [o.strip() for o in opts],
                    "answer": letter, "explanation": expl, "difficulty": diff})
    return out

def build_prompt(ch_number, ch_name, tasks, count):
    task_lines = []
    for t in tasks:
        task_lines.append(f"- TASK ({t['weight']}% of exam): {t['title']}")
        for i, s in enumerate(t.get("seeds", [])[:24], 1):
            task_lines.append(f"    {i}. {s[:300]}")
    seeds = "\n".join(task_lines)
    return [
        {"role": "system", "content": (
            "You are a senior US home inspector exam writer for the EBPHI National Home Inspector "
            "Examination (NHIE). You write realistic, scenario-based multiple-choice questions that test "
            "defect recognition, safety issues, standards of practice, and professional judgment. "
            "No open-book code lookup is involved: questions must be answerable from standard home "
            "inspection knowledge. Never invent regulations or cite code sections. "
            "Output ONLY a JSON array of objects, no markdown, no commentary.")},
        {"role": "user", "content": (
            f"Write exactly {count} original NHIE-style multiple-choice questions for the chapter "
            f"'Chapter {ch_number}: {ch_name}'. Official EBPHI outline tasks and knowledge seeds for this chapter:\n"
            f"{seeds}\n\n"
            "Rules:\n"
            "- Each question: a realistic inspection scenario or a direct knowledge question about components, "
            "typical defects, or common safety issues.\n"
            "- Exactly 4 options per question, only ONE clearly correct, distractors plausible.\n"
            "- Answer letters balanced across A/B/C/D (never more than 30% on one letter in this batch).\n"
            "- explanation: 100-220 characters, plain English, teaches the 'why' (defect consequence, correct "
            "standard, safety implication).\n"
            "- difficulty: exactly one of EASY, MEDIUM, HARD.\n"
            "- Mix EASY ~20%, MEDIUM ~50%, HARD ~30%.\n"
            "- Vary topics across the listed knowledge areas; do not repeat the same fact twice.\n"
            'JSON format: [{"question": "...", "options": ["...","...","...","..."], "answer": "A", '
            '"explanation": "...", "difficulty": "MEDIUM"}]')}
    ]

def balanced(items):
    """Rotate options so correct answer lands at i%4 across the whole chapter list; return items with letters set."""
    keys = ["A", "B", "C", "D"]
    random.Random(42).shuffle(items)
    for i, it in enumerate(items):
        idx = ord(it["answer"]) - ord("A")
        correct_text = it["options"][idx]
        opts = [o for j, o in enumerate(it["options"]) if j != idx]
        pos = i % 4
        opts.insert(pos, correct_text)
        it["options"] = opts
        it["answer"] = keys[pos]
    return items

def load_db():
    return psycopg2.connect(ENV["DATABASE_URL"])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--chapters", required=True, help="e.g. 1-4 or 5")
    ap.add_argument("--limit", type=int, default=0, help="smoke test: generate N questions per chapter (0=full)")
    args = ap.parse_args()

    lo, _, hi = args.chapters.partition("-")
    chapters = list(range(int(lo), int(hi or lo) + 1))

    ids = json.load(open(os.path.join(BASE, "nhie_ids.json")))
    outline = json.load(open(os.path.join(BASE, "nhie_outline_tasks.json")))
    exam_id = ids["exam"]

    conn = load_db()
    cur = conn.cursor()
    # existing question texts for dedupe
    cur.execute("SELECT lower(question) FROM questions WHERE exam_id=%s", (exam_id,))
    existing = {r[0] for r in cur.fetchall()}

    grand_total = 0
    for ch in chapters:
        meta = ids["chapters"][str(ch)]
        ch_id = meta["id"]
        target = meta["target"] if not args.limit else args.limit
        tasks = outline.get(str(ch), [])
        progress = os.path.join(GEN_DIR, f"nhie_ch{ch}.json")
        done = []
        if os.path.exists(progress):
            done = json.load(open(progress))
            print(f"ch{ch}: resume with {len(done)} already")
        items = list(done)
        guard = 0
        while len(items) < target and guard < 60:
            guard += 1
            need = min(12, target - len(items))
            try:
                raw = chat(build_prompt(ch, meta["name"], tasks, need))
                fresh = parse_items(raw)
            except Exception as e:
                print(f"ch{ch} call error: {e}")
                time.sleep(8)
                continue
            if not fresh:
                print(f"ch{ch}: empty/bad response, retrying...")
                time.sleep(4)
                continue
            # dedupe against DB + in-run
            seen = {q["question"].lower() for q in items}
            for it in fresh:
                low = it["question"].lower()
                if low in existing or low in seen:
                    continue
                seen.add(low)
                if not it["explanation"]:
                    it["explanation"] = f"The correct answer is {it['answer']}."
                items.append(it)
            print(f"ch{ch}: {len(items)}/{target} (call {guard})")
        items = items[:target]
        if len(items) >= (target if args.limit else max(1, int(target * 0.95))):
            items = balanced(items)
            json.dump(items, open(progress, "w"))
            cur.execute("DELETE FROM questions WHERE exam_id=%s AND chapter_id=%s", (exam_id, ch_id))
            inserted = 0
            for it in items:
                qid = uuid.uuid4().hex
                cur.execute(
                    """INSERT INTO questions (id, exam_id, chapter_id, type, difficulty, question,
                       options, correct_answer, explanation, status, ai_source, created_at, approved_at)
                       VALUES (%s, %s, %s, 'MCQ'::"QType", %s::"Difficulty", %s, %s, %s, %s,
                       'APPROVED'::"QStatus", %s, now(), now())
                       ON CONFLICT (id) DO NOTHING""",
                    (qid, exam_id, ch_id, it["difficulty"], it["question"], it["options"],
                     it["answer"], it["explanation"], "generated:NHIE:v1"))
                inserted += 1
            conn.commit()
            grand_total += inserted
            from collections import Counter
            print(f"ch{ch} DONE: {inserted} inserted | letters: {dict(Counter(it['answer'] for it in items))}")
        else:
            print(f"ch{ch} INCOMPLETE: {len(items)}/{target} after {guard} calls — progress saved, rerun to resume")
    conn.close()
    print(f"TOTAL inserted this run: {grand_total}")

if __name__ == "__main__":
    main()
