#!/usr/bin/env python3
"""NHIE setup: create Exam + 15 chapters (official EBPHI outline) + parse outline knowledge seeds."""
import json, os, re, uuid, psycopg2

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)

def load_db_url():
    with open(os.path.join(REPO, "server/.env")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("DATABASE_URL="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("DATABASE_URL not found")

CHAPTERS = [
    (1,  "Site Conditions and Grounds", 5),
    (2,  "Building Exterior Components", 5),
    (3,  "Roof Components", 6),
    (4,  "Structural Components", 6),
    (5,  "Electrical Systems", 7),
    (6,  "Cooling Systems", 4),
    (7,  "Heating Systems", 5),
    (8,  "Insulation, Moisture Management and Ventilation Systems", 5),
    (9,  "Mechanical Exhaust Systems", 5),
    (10, "Plumbing and Fuel Distribution Systems", 6),
    (11, "Interior Components", 4),
    (12, "Fireplaces, Fuel-Burning Appliances and Chimney and Vent Systems", 6),
    (13, "Life Safety Equipment and Systems", 6),
    (14, "Analysis of Findings and Reporting", 20),
    (15, "Professional Responsibilities", 10),
]
assert sum(w for _, _, w in CHAPTERS) == 100, "weights must total 100"
TARGET = 1200
PER_CH = {n: round(TARGET * w / 100) for n, _, w in CHAPTERS}
PER_CH[1] += TARGET - sum(PER_CH.values())  # fix rounding to exactly 1200

OUTLINE_MD = "/home/chuck/.hermes/profiles/orchestrator/cache/web/nationalhomeinspectorexam.org-c13c594cb0.md"

def parse_outline():
    text = open(OUTLINE_MD, encoding="utf-8").read()
    # normalize inconsistent header styles: '**TASK 1:**' (colon inside bold) -> '**TASK 1** :'
    text = re.sub(r"\*\*TASK (\d+):\*\*", r"**TASK \1** :", text)
    # split on '### **TASK N** :' style headers
    parts = re.split(r"### \*\*TASK (\d+)\*\*[:\s]*", text)
    # parts[0] is preamble; then pairs (num, body)
    tasks = []
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        body = parts[i+1] if i + 1 < len(parts) else ""
        m = re.search(r"Identify and inspect (.*?) to assess defects", body, re.S)
        title = re.sub(r"\s+", " ", m.group(1)).strip() if m else ""
        # weight percent in the body near start
        wm = re.search(r"\((\d+)%\)", body[:400])
        weight = int(wm.group(1)) if wm else 0
        # Knowledge subtopics = A./B./C. lines with following content; keep a trimmed seed
        sub = re.findall(r"\*\*([A-Z])\.\*\*\s*(.*?)(?=\n\*\*[A-Z]\.\*\*|\n### |\Z)", body, re.S)
        seeds = []
        for letter, content in sub:
            clean = re.sub(r"\s+", " ", content).strip()
            seeds.append(clean[:600])
        tasks.append({"num": num, "title": title, "weight": weight, "seeds": seeds})
    # map: first 13 tasks -> chapters 1..13 ; next 4 -> ch14 ; next 2 -> ch15
    mapping = {}
    for idx, t in enumerate(tasks):
        if idx < 13:
            ch = idx + 1
        elif idx < 17:
            ch = 14
        else:
            ch = 15
        mapping.setdefault(ch, []).append(t)
    return mapping

def main():
    conn = psycopg2.connect(load_db_url())
    cur = conn.cursor()
    exam_id = uuid.uuid4().hex
    cur.execute("""
        INSERT INTO exams (id, code, name, name_fr, description, country, "licenseType",
                           is_active, "timeLimit", "passingScore", "questionsPerSimulation",
                           "randomizeOrder", display_order, created_at)
        VALUES (%s, 'NHIE', %s, NULL, %s, 'US', 'NHIE', TRUE, 240, 70.0, 50, TRUE, %s, now())
        ON CONFLICT (code) DO NOTHING
    """, (exam_id,
          "National Home Inspector Exam (NHIE)",
          "EBPHI National Home Inspector Examination: property and building inspection and site review (70%), analysis of findings and reporting (20%), and professional responsibilities (10%).",
          6))
    # if already exists (rerun), fetch existing id
    cur.execute("SELECT id FROM exams WHERE code='NHIE'")
    row = cur.fetchone()
    if row and row[0] != exam_id:
        exam_id = row[0]
    cur.execute("DELETE FROM chapters WHERE exam_id=%s", (exam_id,))
    ids = {"exam": exam_id, "chapters": {}}
    outline_map = parse_outline()
    for number, name, weight in CHAPTERS:
        ch_id = uuid.uuid4().hex
        seeds = outline_map.get(number, [])
        cur.execute("""
            INSERT INTO chapters (id, exam_id, number, name, name_fr, is_active, syllabus_ref)
            VALUES (%s, %s, %s, %s, NULL, TRUE, %s)
        """, (ch_id, exam_id, number, name, f"NHIE outline {weight}% ({len(seeds)} task(s))"))
        ids["chapters"][number] = {"id": ch_id, "name": name, "weight": weight, "target": PER_CH[number]}
    with open(os.path.join(BASE, "nhie_ids.json"), "w") as f:
        json.dump(ids, f, indent=2)
    with open(os.path.join(BASE, "nhie_outline_tasks.json"), "w") as f:
        json.dump({str(k): v for k, v in outline_map.items()}, f, indent=2)
    conn.commit()
    cur.execute("SELECT count(*) FROM chapters WHERE exam_id=%s", (exam_id,))
    print("Exam NHIE id:", exam_id, "| chapters:", cur.fetchone()[0], "| targets:", PER_CH, "| total:", sum(PER_CH.values()))
    conn.close()

if __name__ == "__main__":
    main()
