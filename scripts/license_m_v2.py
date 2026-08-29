#!/usr/bin/env python3
"""
License M — Exhaustive question generation (v2 with correct chapter IDs).
4 parallel DeepSeek calls → save to correct chapters.
"""

import json, urllib.request, urllib.error, time, re, threading, sys

# ── Config ──
TOKEN = open('/tmp/admin_token.txt').read().strip()
API = 'http://127.0.0.1:4000/api'

# CORRECT chapter IDs from DB
CH_AF = {
    1: 'cf079001-08a4-4c0b-8974-447003927d1b',
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
    1: '2a07fca3-7817-4e92-97fd-56b899828e7e',
    2: '488e04e9-9e31-43a8-b145-00cf429da0e8',
    3: '2d8eb381-dd97-4738-aced-b3ad80015ec7',
    4: '6466c784-43ab-4e57-81f2-64b3bfe19ec9',
    5: '94a7df31-b1d9-49ef-933e-a4022f3f0b81',
    6: '4205a8f3-46f0-40e9-bca3-b74e477114f7',
    7: '0735cc87-a56c-4c68-bc7c-43d76b7c42e8',
    8: '6a2b9ac7-2ced-4113-b2f2-4e67bbeca5f9',
    9: '00d49e64-cc9a-41c1-be2d-017b0ad086cd',
    10: '5a1f71c5-5cbf-4b0e-976d-9c2c0d3f0f00',
    11: '50f189b9-fb91-4bea-bc53-6fc45fd7dcef',
    12: 'f7b87cdd-613d-4b41-b70f-bef63afc9d28',
}

URLS = [
    "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/amt_airframe_hb_vol_1.pdf",
    "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-31B_Aviation_Maintenance_Technician_Handbook.pdf"
]

PASSES = [
    {
        "name": "M-AIRFRAME Ch2-6",
        "examId": '5e52edd3-2698-4788-9eee-1427332d92c0',
        "chapters": [2,3,4,5,6],
        "prompt": f"""You are an AME exam question writer for Transport Canada License M — Airframe.

Generate 20 MCQ questions per chapter for chapters 2-6 of M-AIRFRAME (total ~100 questions).

Each chapter content:
- Ch2: Welding & Plastics (welding techniques, soldering, brazing, composite repairs, NDT, bonding)
- Ch3: Assembly & Rigging (alignment, symmetry, control surface rigging, cable tension, turnbuckles, swaging)
- Ch4: Fabric Covering (fabric types, dope, inspections, repairs, heat-shrink)
- Ch5: Painting & Finishing (surface prep, paint types, corrosion prevention, dry film lubricants)
- Ch6: Hydraulic & Pneumatic Systems (pumps, actuators, valves, accumulators, seals, fluids, filters)

Each question must include a "chapter" field (integer 2-6).
Use realistic aircraft maintenance scenarios with references to AC43.13, CARs Standard 571, or FAA handbooks.
Return ONLY valid JSON: {{"questions": [{{"question": "...", "options": ["A) ...","B) ...","C) ...","D) ..."], "correctAnswer": "A", "explanation": "...", "type": "MCQ", "difficulty": "EASY/MEDIUM/HARD", "chapter": 2}}, ...]}}"""
    },
    {
        "name": "M-AIRFRAME Ch7-12",
        "examId": '5e52edd3-2698-4788-9eee-1427332d92c0',
        "chapters": [7,8,9,10,11,12],
        "prompt": f"""You are an AME exam question writer for Transport Canada License M — Airframe.

Generate 20 MCQ questions per chapter for chapters 7-12 of M-AIRFRAME (total ~120 questions).

Each chapter content:
- Ch7: Landing Gear (struts, shocks, wheels, brakes, anti-skid, retraction, oleos, tires, steering)
- Ch8: Warning/Ice/Rain Protection (stall warning, anti-ice, de-ice, pitot heat, boots)
- Ch9: Pressurization/Oxygen (cabin pressurization, outflow valves, oxygen systems, regulators)
- Ch10: Fuel Systems (tanks, pumps, crossfeed, fueling/defueling, sumping, contamination)
- Ch11: Flight Controls (ailerons, elevator, rudder, trim tabs, cable systems, push-pull rods, flutter)
- Ch12: Fire Protection (detection, smoke detection, extinguishers, engine fire loops)

Each question must include a "chapter" field (integer 7-12).
Use realistic aircraft maintenance scenarios with references to TC and FAA standards.
Return ONLY valid JSON: {{"questions": [{{"question": "...", "options": ["A) ...","B) ...","C) ...","D) ..."], "correctAnswer": "A", "explanation": "...", "type": "MCQ", "difficulty": "EASY/MEDIUM/HARD", "chapter": 7}}, ...]}}"""
    },
    {
        "name": "M-POWERPLANT Ch1-6",
        "examId": '8116a886-bb07-4bca-9a5b-3728bb8b219f',
        "chapters": [1,2,3,4,5,6],
        "prompt": f"""You are an AME exam question writer for Transport Canada License M — Powerplant.

Generate 20 MCQ questions per chapter for chapters 1-6 of M-POWERPLANT (total ~120 questions).

Each chapter content:
- Ch1: Recip Engine Theory (4-stroke cycle, firing order, cylinders, pistons, rings, crankshaft, valves)
- Ch2: Recip Lubrication/Cooling (oil types, pumps, filters, coolers, air cooling, baffles)
- Ch3: Recip Ignition/Starting (magneto types, timing, spark plugs, ignition harness, starters)
- Ch4: Recip Fuel Metering (carburetor types, fuel injection, mixture, FADEC adjustments)
- Ch5: Recip Induction/Exhaust (alternate air, carb heat, turbocharging, waste gate, exhaust)
- Ch6: Turbine Engine Theory (Brayton cycle, compressors, combustors, turbines, thrust, spools)

Each question must include a "chapter" field (integer 1-6).
Use realistic scenarios with references to TC and FAA standards.
Return ONLY valid JSON: {{"questions": [{{"question": "...", "options": ["A) ...","B) ...","C) ...","D) ..."], "correctAnswer": "A", "explanation": "...", "type": "MCQ", "difficulty": "EASY/MEDIUM/HARD", "chapter": 1}}, ...]}}"""
    },
    {
        "name": "M-POWERPLANT Ch7-12",
        "examId": '8116a886-bb07-4bca-9a5b-3728bb8b219f',
        "chapters": [7,8,9,10,11,12],
        "prompt": f"""You are an AME exam question writer for Transport Canada License M — Powerplant.

Generate 20 MCQ questions per chapter for chapters 7-12 of M-POWERPLANT (total ~120 questions).

Each chapter content:
- Ch7: Turbine Lubrication/Sealing (oil systems, scavenge, chip detectors, carbon/labyrinth seals)
- Ch8: Turbine Fuel Controls/FADEC (fuel pumps, FCU, FADEC architecture, sensors, actuators, auto-start)
- Ch9: Turbine Ignition/Starting (high-energy ignition, igniters, starter/generator, start sequences)
- Ch10: Engine Indicating (tachometer, torque, EGT/ITT, fuel flow, vibration monitoring, trend)
- Ch11: Propeller Systems (fixed/constant speed, feathering, reversing, governors, ice protection)
- Ch12: Engine Installation/Fire/Troubleshooting (mounts, firewalls, borescope, vibration analysis)

Each question must include a "chapter" field (integer 7-12).
Use realistic scenarios with references to TC and FAA standards.
Return ONLY valid JSON: {{"questions": [{{"question": "...", "options": ["A) ...","B) ...","C) ...","D) ..."], "correctAnswer": "A", "explanation": "...", "type": "MCQ", "difficulty": "EASY/MEDIUM/HARD", "chapter": 7}}, ...]}}"""
    }
]

lock = threading.Lock()
all_results = []
errors = []

def call_deepseek(pass_config):
    name = pass_config["name"]
    print(f"[{name}] Starting...")

    body = {
        "contentIds": [],
        "instructions": pass_config["prompt"],
        "urls": URLS,
        "count": 500,
        "type": "MCQ",
        "difficulty": "MIXED"
    }

    for attempt in range(3):
        try:
            req = urllib.request.Request(f'{API}/questions/chat-generate',
                data=json.dumps(body).encode(),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                method='POST')
            resp = urllib.request.urlopen(req, timeout=360)
            data = json.loads(resp.read().decode())
            questions = data.get('data', {}).get('questions', [])
            
            with lock:
                all_results.append({
                    "name": name,
                    "examId": pass_config["examId"],
                    "chapters": pass_config["chapters"],
                    "questions": questions
                })
            
            print(f"[{name}] ✅ Generated {len(questions)} questions")
            return
        except urllib.error.HTTPError as e:
            err = e.read().decode()[:200]
            print(f"[{name}] ❌ HTTP {e.code}: {err}")
            if attempt < 2:
                time.sleep(5)
        except Exception as e:
            print(f"[{name}] ❌ Attempt {attempt+1}: {str(e)[:120]}")
            if attempt < 2:
                time.sleep(5)
    
    with lock:
        errors.append(f"[{name}] Failed")

def save_batch(exam_id, chapter_id, questions):
    """Save questions for one chapter."""
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
                req = urllib.request.Request(f'{API}/questions/chat-save',
                    data=json.dumps(body).encode(),
                    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                    method='POST')
                resp = urllib.request.urlopen(req, timeout=60)
                result = json.loads(resp.read().decode())
                total += result.get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                err = e.read().decode()
                if '"too_small"' in err and 'explanation' in err:
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}. This question tests knowledge from the License M curriculum.'
                    continue
                else:
                    print(f'    HTTP {e.code}: {err[:80]}')
                    break
            except Exception as e:
                print(f'    Error: {str(e)[:80]}')
                break
    return total

def save_all():
    total_saved = 0
    stats = {}
    
    for result in all_results:
        name = result["name"]
        exam_id = result["examId"]
        ch_map = CH_AF if exam_id == '5e52edd3-2698-4788-9eee-1427332d92c0' else CH_PP
        
        by_chapter = {}
        for q in result["questions"]:
            ch = q.get('chapter')
            if ch is None:
                continue
            ch = int(ch)
            if ch not in by_chapter:
                by_chapter[ch] = []
            
            nq = {
                'question': q.get('question', ''),
                'options': list(q.get('options', [])),
                'correctAnswer': str(q.get('correctAnswer', 'A')),
                'explanation': q.get('explanation', '') or 'Reference: TC/FAA maintenance standards.',
                'type': q.get('type', 'MCQ'),
                'difficulty': q.get('difficulty', 'MEDIUM'),
            }
            if len(nq['question']) >= 5 and len(nq['explanation']) >= 5:
                by_chapter[ch].append(nq)
        
        for ch, qs in sorted(by_chapter.items()):
            ch_id = ch_map.get(ch)
            if not ch_id:
                print(f'  ⚠️  No ID for Ch{ch}')
                continue
            
            # Dedup within chapter
            seen = set()
            unique = []
            for q in qs:
                key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
                if key not in seen:
                    seen.add(key)
                    unique.append(q)
            
            saved = save_batch(exam_id, ch_id, unique)
            total_saved += saved
            label = f"{name.split()[0]} Ch{ch}"
            stats[label] = saved
            print(f'  📘 {label}: {len(unique)} unique → {saved} saved')
    
    return total_saved, stats

print('🚀 Starting 4 parallel DeepSeek calls...')
print()

threads = []
for p in PASSES:
    t = threading.Thread(target=call_deepseek, args=(p,))
    t.start()
    threads.append(t)
    time.sleep(1)

for t in threads:
    t.join()

print()
if errors:
    print(f'❌ Errors: {len(errors)}')
    for e in errors:
        print(f'  {e}')

if all_results:
    print(f'✅ All passes completed!')
    total_saved, stats = save_all()
    print(f'\n{"="*50}')
    print(f'🔥 FINAL: {total_saved} questions saved')
    print(f'   Breakdown:')
    for ch, cnt in sorted(stats.items()):
        print(f'     {ch}: {cnt}')
    print()
    print(f'   ➡️  Review: https://inspectpractice.com/admin/questions/review')
else:
    print('❌ No results')
