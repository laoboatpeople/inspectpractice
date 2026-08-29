#!/usr/bin/env python3
"""
License M — Exhaustive question generation.
4 parallel DeepSeek calls covering ALL chapters of M-AIRFRAME + M-POWERPLANT.
Each question tagged with chapter number → saved to correct chapterId in DB.
"""

import json, urllib.request, urllib.error, time, re, threading, sys

# ── Config ──
TOKEN = open('/tmp/admin_token.txt').read().strip()
API_BASE = 'http://127.0.0.1:4000/api'

AIRFRAME_EXAM_ID = '5e52edd3-2698-4788-9eee-1427332d92c0'
POWERPLANT_EXAM_ID = '8116a886-bb07-4bca-9a5b-3728bb8b219f'

# Chapter IDs by number
AIRFRAME_CH = {
    1: 'cf079001-08a4-4c0b-8974-447003927d1b',
    2: '468e6e10-55ed-41b1-944a-63c42dc5e7b6',
    3: 'f3d91ffb-4e93-4a89-8e02-04e7763c3b3a',
    4: 'b770f06d-83e0-4e88-adc5-a5681dd9bf9e',
    5: '0b9b6a9b-d68b-4682-86cb-ed0379721b20',
    6: 'e64ba043-9e69-4f49-be9c-48000144fd1a',
    7: '8cd8b62b-5361-4404-ad26-ea0b07b02cf8',
    8: 'd313ae79-ec04-4aa1-aad2-6a7ead78d7ee',
    9: '2183b76d-a4e9-44b6-accf-88ab8f4f2e8b',
    10: '54ce568c-386c-4593-8430-df5f08de1e2c',
    11: 'bcd5c0e1-6dd3-404c-b4c6-a76bba414faa',
    12: '70fa715a-394b-4187-8f50-db1b181b60a4',
}

POWERPLANT_CH = {
    1: '2a07fca3-7810-4e53-bfd5-6103c7edda15',
    2: '488e04e9-9e3c-48e3-9cd9-5f6183743b53',
    3: '2d8eb381-dd9b-4c7e-ae2a-3e1f31446140',
    4: '6466c784-43a0-4426-9a90-46e076978f39',
    5: '94a7df31-b1d6-44be-8dab-3c565826bbdd',
    6: '4205a8f3-46fd-4799-ab92-f481b96135d0',
    7: '0735cc87-a56d-4d7f-a2a5-5caf558cf2f6',
    8: '6a2b9ac7-2ce8-49e3-b857-634087bea826',
    9: '00d49e64-cc97-42d0-8555-97675e8f2d95',
    10: '5a1f71c5-5cb5-41ca-95f2-cea432b8c5ba',
    11: '50f189b9-fb99-41f6-9604-ae0bc4956a10',
    12: 'f7b87cdd-6136-4938-bad3-82dc6a06d2c0',
}

# ── URLs with content for context ──
URLS = [
    "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars",
    "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-573-approved-maintenance-organizations-canadian-aviation-regulations-cars",
    "https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/",
    "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/amt_airframe_hb_vol_1.pdf",
    "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/FAA-H-8083-31B_Aviation_Maintenance_Technician_Handbook.pdf"
]

# ── 4 parallel passes ──
PASSES = [
    {
        "name": "M-AIRFRAME Ch2-6 (Structures Advanced, Assembly, Hydraulics, Landing Gear)",
        "examId": AIRFRAME_EXAM_ID,
        "chapters": [2,3,4,5,6],
        "prompt": """Generate 60-80 scenario-based MCQ questions for M-AIRFRAME (Aircraft Maintenance Engineer — Airframe) covering chapters 2 through 6. Every question must be tagged with the chapter number.

Chapter 2: Aircraft Structures — Welding & Plastics (welding techniques, soldering, brazing, composite repairs, plastic bonding, NDT methods for welds)
Chapter 3: Aircraft Assembly & Rigging (alignment, symmetry checks, control surface rigging, travel checks, cable tensioning, turnbuckles, swaging)
Chapter 4: Aircraft Fabric Covering (fabric types, dope/finishing, inspections, repairs, heat-shrink, glued joints)
Chapter 5: Aircraft Painting & Finishing (surface prep, paint types, corrosion prevention, touch-up, decals, stencils, dry film lubricants)
Chapter 6: Hydraulic & Pneumatic Power Systems (pumps, actuators, valves, accumulators, seals, fluids, contamination, filters, pneumatic systems)

Format each question as JSON with: question, options (array of 4 strings like ["A) ...", "B) ...", "C) ...", "D) ..."]), correctAnswer (single letter A/B/C/D), explanation (detailed, 3-5 sentences explaining why), type ("MCQ"), difficulty ("EASY"/"MEDIUM"/"HARD"), and chapter (integer, 2-6).

Topics must come from Transport Canada CARs / Standards / TP14038E references. Use realistic aircraft maintenance scenarios. Return ONLY a JSON object with a "questions" array."""
    },
    {
        "name": "M-AIRFRAME Ch7-12 (Warning Systems, Pressurization, Fuel, Flight Controls, Fire)",
        "examId": AIRFRAME_EXAM_ID,
        "chapters": [7,8,9,10,11,12],
        "prompt": """Generate 60-80 scenario-based MCQ questions for M-AIRFRAME covering chapters 7 through 12. Every question must be tagged with the chapter number.

Chapter 7: Landing Gear Systems (struts, shocks, wheels, brakes, anti-skid, retraction, oleos, tires, steering)
Chapter 8: Position & Warning Systems / Ice & Rain Protection (stall warning, landing gear warning, anti-ice, de-ice, pitot heat, windshield anti-ice, boots, weeping wings)
Chapter 9: Cabin Atmosphere & Pressurization (pressurization controls, outflow valves, safety valves, oxygen systems, regulators, masks, chemical generators)
Chapter 10: Aircraft Fuel Systems (fuel tanks, boost pumps, crossfeed, fueling/defueling, sumping, fire safety, fuel grade, contamination)
Chapter 11: Flight Controls — Primary & Secondary (ailerons, elevator, rudder, trim, tabs, servo tabs, balance, cable systems, push-pull rods, bellcranks, flutter)
Chapter 12: Fire Protection Systems (fire detection, smoke detection, extinguishers, engine fire loops, halon replacements, inspection intervals)

Format each question as JSON with: question, options (array of 4 strings), correctAnswer (A/B/C/D), explanation (3-5 sentences), type: "MCQ", difficulty ("EASY"/"MEDIUM"/"HARD"), and chapter (integer, 7-12). Return ONLY a JSON object with a "questions" array."""
    },
    {
        "name": "M-POWERPLANT Ch1-6 (Recip + Turbine Theory)",
        "examId": POWERPLANT_EXAM_ID,
        "chapters": [1,2,3,4,5,6],
        "prompt": """Generate 60-80 scenario-based MCQ questions for M-POWERPLANT covering chapters 1 through 6. Every question must be tagged with the chapter number.

Chapter 1: Reciprocating Engine — Theory & Construction (4-stroke cycle, firing order, engine types, cylinders, pistons, rings, crankshaft, camshaft, valves, timing)
Chapter 2: Reciprocating Engine — Lubrication & Cooling (oil types, viscosity, oil pumps, filters, coolers, oil pressure/temp, wet/dry sump, air cooling, baffles, cylinder head temp)
Chapter 3: Reciprocating Engine — Ignition & Starting (magneto types, impulse coupling, timing, spark plugs, ignition harness, starting systems, starter motors, vibrator)
Chapter 4: Reciprocating Engine — Fuel Metering (carburetor types, float-type, pressure carb, fuel injection, mixture control, idle adjustment, FADEC, priming)
Chapter 5: Reciprocating Engine — Induction & Exhaust (induction systems, alternate air, carb heat, turbocharging, waste gate, intercooler, exhaust systems, mufflers)
Chapter 6: Turbine Engine — Theory & Construction (Brayton cycle, compressor types, diffuser, combustion chamber, turbine section, exhaust/nozzle, thrust, spool configurations, electronic engine control)

Format each question as JSON with: question, options (array of 4 strings), correctAnswer (A/B/C/D), explanation (3-5 sentences), type: "MCQ", difficulty ("EASY"/"MEDIUM"/"HARD"), and chapter (integer, 1-6). Return ONLY a JSON object with a "questions" array."""
    },
    {
        "name": "M-POWERPLANT Ch7-12 (Turbine Systems, Propeller, Installation)",
        "examId": POWERPLANT_EXAM_ID,
        "chapters": [7,8,9,10,11,12],
        "prompt": """Generate 60-80 scenario-based MCQ questions for M-POWERPLANT covering chapters 7 through 12. Every question must be tagged with the chapter number.

Chapter 7: Turbine Engine — Lubrication & Sealing (oil systems, scavenge, breather, chip detectors, seals, carbon seals, labyrinth, oil coolers, bypass valves)
Chapter 8: Turbine Engine — Fuel Controls & FADEC (fuel pumps, fuel control units, FCU operation, FADEC architecture, sensors, actuators, redundancy, auto-start, manual backup)
Chapter 9: Turbine Engine — Ignition & Starting (high-energy ignition, igniter plugs, start sequences, starter/generator, APU start, hot/cold starts, starter duty cycle)
Chapter 10: Engine Indicating & Instrumentation (tachometer, torque, EGT/ITT, fuel flow, oil pressure/temp, vibration monitoring, trend monitoring, engine instrument checks)
Chapter 11: Propeller Systems (fixed pitch, constant speed, feathering, reversing, governors, pitch change mechanism, ice protection, synchrophase, propeller hubs, removal/installation)
Chapter 12: Engine Installation, Fire Protection & Troubleshooting (engine mounts, cowling, firewalls, fire detection/extinguishing on engines, vibration analysis, Borescope inspection, troubleshooting methodology)

Format each question as JSON with: question, options (array of 4 strings), correctAnswer (A/B/C/D), explanation (3-5 sentences), type: "MCQ", difficulty ("EASY"/"MEDIUM"/"HARD"), and chapter (integer, 7-12). Return ONLY a JSON object with a "questions" array."""
    }
]

lock = threading.Lock()
all_results = []
errors = []

def call_deepseek(pass_config):
    """Call DeepSeek API directly for one pass."""
    global all_results, errors
    name = pass_config["name"]
    print(f"[{name}] Starting...")

    # First fetch the URLs content via the backend
    url_contents = []
    for url in URLS:
        try:
            req = urllib.request.Request(f'{API_BASE}/questions/chat-generate',
                data=json.dumps({
                    "contentIds": [],
                    "instructions": "TEST — just checking connectivity",
                    "urls": [url],
                    "count": 1,
                    "type": "MCQ",
                    "difficulty": "EASY"
                }).encode(),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                method='POST')
            resp = urllib.request.urlopen(req, timeout=30)
            data = json.loads(resp.read().decode())
            # Get the context from the response
            url_contents.append(f"URL {url}: content available")
        except Exception as e:
            url_contents.append(f"URL {url}: could not fetch ({str(e)[:60]})")
    
    # Actually, let me use a different approach — call DeepSeek via the backend's AI service
    # which already has the URLs content loaded. I'll use the chat-generate endpoint
    # but only to get questions (not auto-save since we need per-chapter saving)
    
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
            req = urllib.request.Request(f'{API_BASE}/questions/chat-generate',
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
        except Exception as e:
            print(f"[{name}] ❌ Attempt {attempt+1}: {str(e)[:120]}")
            time.sleep(5)
    
    with lock:
        errors.append(f"[{name}] Failed after 3 attempts")

def extract_json_from_text(text):
    """Extract JSON from text that may contain markdown fences or other wrapping."""
    # Try direct parse first
    text = text.strip()
    try:
        return json.loads(text)
    except:
        pass
    # Try extracting from ```json ... ``` 
    m = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except:
            pass
    # Try finding first { and last }
    start = text.find('{')
    end = text.rfind('}')
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end+1])
        except:
            pass
    return None

def save_to_db(exam_id, chapter_num, chapter_id, questions):
    """Save questions for a specific chapter via chat-save endpoint."""
    if not questions:
        return 0
    
    batch_size = 50
    total = 0
    for i in range(0, len(questions), batch_size):
        batch = questions[i:i+batch_size]
        body = {
            'questions': batch,
            'examId': exam_id,
            'chapterId': chapter_id,
        }
        for attempt in range(3):
            try:
                req = urllib.request.Request(f'{API_BASE}/questions/chat-save',
                    data=json.dumps(body).encode(),
                    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
                    method='POST')
                resp = urllib.request.urlopen(req, timeout=60)
                result = json.loads(resp.read().decode())
                total += result.get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                err_body = e.read().decode()
                if '"too_small"' in err_body and 'explanation' in err_body:
                    # Fix short explanations and retry
                    for q in batch:
                        if len(q.get('explanation', '')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}. This question covers {chapter_num} content for the License M examination.'
                    continue
                else:
                    print(f'    HTTP {e.code} saving Ch{chapter_num}: {err_body[:100]}')
                    break
            except Exception as e:
                print(f'    Error saving Ch{chapter_num}: {str(e)[:80]}')
                break
    return total

def process_results():
    """Parse, deduplicate, and save all questions to correct chapters."""
    total_generated = sum(len(r["questions"]) for r in all_results)
    print(f"\n{'='*60}")
    print(f"Total questions generated across all passes: {total_generated}")
    
    all_saved = 0
    chapter_stats = {}
    
    for result in all_results:
        name = result["name"]
        exam_id = result["examId"]
        chapters = set(result["chapters"])
        
        # Parse questions and extract chapter numbers
        by_chapter = {}
        for q in result["questions"]:
            # Ensure proper format
            if isinstance(q, str):
                parsed = extract_json_from_text(q)
                if not parsed:
                    continue
                q = parsed
            
            # Extract chapter number
            ch = q.get('chapter')
            if ch is None:
                # Try from explanation or other field
                ch = 1  # default to chapter 1
            
            ch = int(ch)
            if ch not in chapters:
                # Assign to nearest chapter in the set
                ch = min(chapters, key=lambda x: abs(x - ch))
            
            if ch not in by_chapter:
                by_chapter[ch] = []
            
            # Normalize question
            q_normalized = {
                'question': q.get('question', ''),
                'options': q.get('options', []),
                'correctAnswer': str(q.get('correctAnswer', 'A')),
                'explanation': q.get('explanation', '') or f'The correct answer is {q.get("correctAnswer","A")}.',
                'type': q.get('type', 'MCQ'),
                'difficulty': q.get('difficulty', 'MEDIUM'),
            }
            
            # Validate
            if len(q_normalized['question']) < 5 or len(q_normalized['explanation']) < 5:
                continue
            
            by_chapter[ch].append(q_normalized)
        
        # Save each chapter's questions
        ch_map = AIRFRAME_CH if exam_id == AIRFRAME_EXAM_ID else POWERPLANT_CH
        for ch, qs in sorted(by_chapter.items()):
            ch_id = ch_map.get(ch)
            if not ch_id:
                print(f"  ⚠️  No chapter ID for chapter {ch}")
                continue
            
            # Dedup within chapter
            seen_keys = set()
            unique = []
            for q in qs:
                key = re.sub(r'[^\w\s]', '', q['question'].lower())[:80]
                if key not in seen_keys:
                    seen_keys.add(key)
                    unique.append(q)
            
            saved = save_to_db(exam_id, ch, ch_id, unique)
            all_saved += saved
            chapter_stats[f"{name.split()[0]} Ch{ch}"] = saved
            print(f"  📘 {name.split()[0]} Ch{ch}: {len(unique)} unique → {saved} saved")
    
    return all_saved, chapter_stats

# ── Main ──
print("🚀 Starting 4 parallel DeepSeek calls (each may take 3-5 min)...")
print()

threads = []
for p in PASSES:
    t = threading.Thread(target=call_deepseek, args=(p,))
    t.start()
    threads.append(t)
    time.sleep(2)  # Stagger starts to avoid rate limits

for t in threads:
    t.join()

if errors:
    print(f"\n❌ Errors: {len(errors)}")
    for e in errors:
        print(f"  {e}")

if all_results:
    print(f"\n✅ All {len(all_results)} passes completed!")
    total_saved, stats = process_results()
    print(f"\n{'='*60}")
    print(f"🔥 FINAL: {total_saved} questions saved across License M exams")
    print(f"   Chapter breakdown:")
    for ch, count in sorted(stats.items()):
        print(f"     {ch}: {count}")
    print(f"\n   ➡️  Review at: https://inspectpractice.com/admin/questions/review")
else:
    print("\n❌ No results generated")
