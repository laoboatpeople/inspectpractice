#!/usr/bin/env python3
"""Generate ICC exam content (theory + MCQs) for inspectpractice — EN only, status APPROVED.
Usage: python3 gen_icc_content.py <EXAM_CODE> [--chapters 1-8] [--questions-per-chapter 150]
Original summaries/questions only (ICC codes are copyrighted — no verbatim code text).
"""
import json, os, re, sys, time, urllib.request, subprocess, random

ROOT = "/home/chuck/projects/inspectpractice"
ENV_PATH = os.path.join(ROOT, "server/.env")

def load_env(path):
    env = {}
    for line in open(path):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env

env = load_env(ENV_PATH)
API_KEY = env.get("OPENAI_API_KEY")
DB_URL = env.get("DATABASE_URL")
API_URL = (env.get("OPENAI_BASE_URL") or "https://api.deepseek.com").rstrip("/") + "/chat/completions"

def call(prompt, model, max_tokens=10000, temperature=0.5):
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }).encode()
    req = urllib.request.Request(API_URL, data=body, headers={
        "Content-Type": "application/json", "Authorization": "Bearer " + API_KEY})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                resp = json.loads(r.read().decode())
            return resp["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"    (essai {attempt+1}: {str(e)[:120]})", flush=True)
            time.sleep(10)
    return None

def psql(sql):
    r = subprocess.run(["psql", DB_URL, "-t", "-A", "-c", sql], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[:300])
    return r.stdout.strip()

# ---------- Exam / chapter prompts ----------
THEORY_PROMPT = """You are an ICC (International Code Council) exam preparation expert for the {cert} certification, based on the {code} ({ref}).

Write a complete, original study chapter in English (US) titled "{chapter}" for this certification exam. The exam is OPEN BOOK — candidates bring the {ref} to the test center.

Requirements:
- Pure theory / reference content (NOT questions-and-answers). Textbook-style.
- Structure: learning objectives first, then sections (## 1.1, 1.2...) with clear headings.
- Cover the key code concepts, minimum requirements, tables, and definitions candidates must know for THIS chapter's content area.
- Include a "Code Navigation" section: WHERE in the {ref} to find each concept (chapter/section numbers, table numbers) — this is critical for an open-book exam.
- Include practical inspection points (what an inspector checks on site).
- Use original wording. Do NOT reproduce verbatim text from the code — summarize and paraphrase.
- Plain text markdown. No SVG. No LaTeX (use Unicode: ×, ≤, ≥, °).
- Length: 1200-1800 words.
"""

QUESTIONS_PROMPT = """You are an ICC (International Code Council) exam preparation expert for the {cert} certification ({code}, {ref}).

Generate exactly {N} original multiple-choice practice questions for the chapter "{chapter}". The exam is OPEN BOOK and code-navigation based.

Rules:
- Each question must be realistic exam-style: code lookup ("In which {ref} section would you find..."), minimum requirements, dimensions, definitions, inspection scenarios.
- 4 options labeled a), b), c), d). Exactly ONE correct. Distractors must be plausible (wrong values, wrong sections, common mistakes).
- Explanation: 1-3 sentences with the code reference (e.g. "IRC R302.5") and why the answer is correct.
- Original wording only — do NOT reproduce verbatim code text (the ICC codes are copyrighted).
- Output ONLY a JSON array, no markdown fences, no extra text:
[{{"question":"...","options":["...","...","...","..."],"answer":"a","explanation":"...","difficulty":"EASY|MEDIUM|HARD"}}]
- difficulty distribution: roughly 25% EASY, 55% MEDIUM, 20% HARD.
"""

def gen_theory(exam, chapter):
    prompt = THEORY_PROMPT.format(cert=exam["name"], code=exam["code"], ref=exam["ref"], chapter=chapter["name"])
    return call(prompt, "deepseek-chat", max_tokens=8000, temperature=0.4)

def extract_json_array(text):
    m = re.search(r"\[.*\]", text, re.S)
    if not m: return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None

def gen_questions_batch(exam, chapter, n):
    prompt = QUESTIONS_PROMPT.format(cert=exam["name"], code=exam["code"], ref=exam["ref"], chapter=chapter["name"], N=n)
    out = call(prompt, "deepseek-chat", max_tokens=12000, temperature=0.8)
    if not out: return []
    return extract_json_array(out) or []

def main():
    exam_code = sys.argv[1] if len(sys.argv) > 1 else "ICC-B1"
    chapters_arg = sys.argv[2] if len(sys.argv) > 2 else "all"
    per_chapter = int(sys.argv[3]) if len(sys.argv) > 3 else 150

    row = psql(f'SELECT id, name FROM exams WHERE code=\'{exam_code}\' AND is_active=TRUE')
    if not row:
        print(f"EXAM NOT FOUND: {exam_code}"); return
    exam_id, exam_name = row.split("|")

    REF = {"ICC-B1": "International Residential Code (IRC)", "ICC-B2": "International Building Code (IBC)",
           "ICC-E1": "National Electrical Code (NEC)", "ICC-P1": "International Plumbing Code (IPC)",
           "ICC-M1": "International Mechanical Code (IMC)"}
    exam = {"code": exam_code, "name": exam_name, "ref": REF.get(exam_code, "I-Code")}

    ch_rows = psql(f'SELECT id, number, name FROM chapters WHERE exam_id=\'{exam_id}\' ORDER BY number').splitlines()
    chapters = [dict(zip(("id", "number", "name"), r.split("|", 2))) for r in ch_rows]

    for ch in chapters:
        num = int(ch["number"])
        if chapters_arg != "all" and num not in [int(x) for x in chapters_arg.split(",")]:
            continue
        print(f"=== {exam_code} ch{num}: {ch['name']} ===", flush=True)

        has_theory = psql(f"SELECT (theory_content IS NOT NULL AND theory_content != '') FROM chapters WHERE id='{ch['id']}'")
        if has_theory == "t":
            print("  theory: SKIP (exists)", flush=True)
        else:
            print("  theory: generating...", flush=True)
            theory = gen_theory(exam, ch)
            if theory:
                esc = theory.replace("'", "''")
                psql(f"UPDATE chapters SET theory_content='{esc}' WHERE id='{ch['id']}'")
                print(f"  theory: OK ({len(theory)} chars)", flush=True)
            else:
                print("  theory: FAILED", flush=True)

        qcount = int(psql(f"SELECT count(*) FROM questions WHERE chapter_id='{ch['id']}'"))
        print(f"  questions: {qcount} existing, target {per_chapter}", flush=True)
        if qcount >= per_chapter:
            print("  questions: SKIP", flush=True)
            continue

        all_q = []
        while len(all_q) < per_chapter:
            batch = gen_questions_batch(exam, ch, 25)
            for q in batch:
                if not all(k in q for k in ("question", "options", "answer", "explanation")): continue
                if not isinstance(q["options"], list) or len(q["options"]) != 4: continue
                if q["answer"] not in "abcd": continue
                diff = q.get("difficulty", "MEDIUM")
                if diff not in ("EASY", "MEDIUM", "HARD"): diff = "MEDIUM"
                q["difficulty"] = diff
                all_q.append(q)
            print(f"    +{len(batch)} -> {len(all_q)}/{per_chapter}", flush=True)

        for q in all_q[:per_chapter]:
            try:
                question = q["question"].replace("'", "''")
                opts = q["options"]
                opts_sql = "ARRAY[" + ",".join("'" + o.replace("'", "''") + "'" for o in opts) + "]"
                ans = q["answer"][0]
                expl = (q.get("explanation") or "").replace("'", "''")
                diff = q["difficulty"]
                psql(f"INSERT INTO questions (id, exam_id, chapter_id, type, difficulty, question, options, correct_answer, explanation, status, ai_source) VALUES (gen_random_uuid()::text, '{exam_id}','{ch['id']}','MCQ','{diff}','{question}',{opts_sql},'{ans}','{expl}','APPROVED','icc-gen-v1')")
            except Exception as e:
                print(f"    insert skip: {str(e)[:100]}", flush=True)
        print(f"  questions: inserted {min(len(all_q), per_chapter)}", flush=True)
        time.sleep(1)

    print(f"DONE {exam_code}")

if __name__ == "__main__":
    main()
