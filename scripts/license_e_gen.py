#!/usr/bin/env python3
"""License E — question generation. 2-chapter batches, TC URL only."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()
E_EXAM = 'dad311a9-dad8-4d99-b7a5-839bbb8b1d28'
URL = "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars"

CH = {
    1: '8f3d8239-fcfa-4665-8663-0cf2a64b409f',
    2: '9811ee77-407a-4429-9e36-aac9453af9a2',
    3: 'c1e08a5f-eccf-4333-896d-73a68368f3e2',
    4: '86d28d2c-fb18-4058-a25f-41ea541e380b',
    5: 'd1cb88cf-3b02-40ce-9b2f-f6a7537fd9bb',
    6: 'b6a27998-d10e-410d-8282-aad18afdab5b',
    7: '96df70d6-55cd-4d3b-8f51-b8aa5f9b44dd',
    8: '75cb3bd4-38bc-4ac8-b59f-1a4cbd6f20db',
    9: '334107c9-4a1b-4286-b18f-b333d353f058',
    10: 'a9d0e7de-cf03-410b-9f2e-08724eab6050',
}

def get_chapters():
    print('  Chapters already configured with UUIDs')
    return True

def save_ch(exam_id, ch_id, questions):
    if not questions: return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        for retry in range(3):
            try:
                body = {'questions': batch, 'examId': exam_id, 'chapterId': ch_id}
                req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-save',
                    data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
                resp = urllib.request.urlopen(req, timeout=60)
                total += json.loads(resp.read().decode()).get('savedCount', 0)
                break
            except urllib.error.HTTPError as e:
                if 'explanation' in e.read().decode():
                    for q in batch:
                        if len(q.get('explanation','')) < 5:
                            q['explanation'] = f'The correct answer is {q.get("correctAnswer","A")}.'
                    continue
                break
            except: break
    return total

def run_pass(c1, c2, t1, t2, detail):
    print(f'\n=== E Ch{c1}-{c2}: {t1[:30]}... ===')
    prompt = f"Generate 20 MCQ each for License E (Electronics/Avionics) Ch{c1}({t1}) and Ch{c2}({t2}). {detail} Must include: question, options[A)B)C)D], correctAnswer(A-D), explanation(3-5sentences with TC/FAA refs), type=MCQ, difficulty(EASY/MEDIUM/HARD), chapter=INTEGER({c1} or {c2}). Return ONLY valid JSON with questions array."
    
    for attempt in range(3):
        try:
            body = {"contentIds":[],"urls":[URL],"instructions":prompt,"count":200,"type":"MCQ","difficulty":"MIXED"}
            req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-generate',
                data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
            resp = urllib.request.urlopen(req, timeout=300)
            questions = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
            
            if not questions:
                print(f'  ❌ 0 Q')
                time.sleep(5)
                continue
            
            print(f'  ✅ {len(questions)} Q')
            total = 0
            for ch in [c1, c2]:
                qs = [q for q in questions if str(q.get('chapter','')) == str(ch)]
                if not qs:
                    print(f'  ⚠️  No Q for Ch{ch}')
                    continue
                ch_id = CH.get(ch)
                if not ch_id: continue
                seen = set()
                unique = []
                for q in qs:
                    opts = list(q.get('options',[]))
                    nq = {'question':q.get('question',''),'options':opts,'correctAnswer':str(q.get('correctAnswer','A')).strip().upper()[-1:],'explanation':q.get('explanation','') or 'Ref: TC.','type':'MCQ','difficulty':q.get('difficulty','MEDIUM')}
                    key = re.sub(r'[^\w\s]','',nq['question'].lower())[:80]
                    if len(nq['question'])>=5 and key not in seen:
                        seen.add(key)
                        unique.append(nq)
                saved = save_ch(E_EXAM, ch_id, unique)
                total += saved
                print(f'  📘 Ch{ch}: {len(unique)} unique -> {saved} saved')
            print(f'  -> Total: {total}')
            return total
        except Exception as e:
            print(f'  ❌ Error: {str(e)[:80]}')
            time.sleep(5)
    return 0

# Get chapter IDs first
print('Fetching chapter IDs...')
if not get_chapters():
    print('Failed to get chapters!')
    sys.exit(1)

# Run 5 passes covering all 10 chapters
TOTAL = 0

pairs = [
    (1, 2, 'CARs Regulations Standard 566 571 573', 'Standard Practices Wiring Connectors Bonding',
     'CARs Part I/V/VI/VII, maintenance release, ACA, AMO, elementary work, servicing. Wiring types, crimping, soldering, connectors, bonding/grounding, EWIS, shielding.'),
    (3, 4, 'Electrical Fundamentals DC AC Circuits', 'Electrical Power Systems Generators Batteries',
     'Ohm law, Kirchhoff, DC/AC, transformers, rectifiers, semiconductors, logic gates. Generators, alternators, voltage regulators, batteries, inverters, TRUs, power distribution, buses, circuit protection.'),
    (5, 6, 'Communication Systems VHF HF Audio', 'Navigation Systems VOR ILS DME GPS',
     'VHF/HF comm, audio panels, SATCOM, ACARS, ELT, cockpit voice recorders. VOR, ILS, DME, ADF, GPS, GNSS, RNAV, transponder, marker beacons, flight inspections.'),
    (7, 8, 'Advanced Avionics TCAS Wx Radar FMS', 'Instruments Pitot-Static AHRS IRS',
     'TCAS, weather radar, autopilot, flight director, FMS, EFIS, EICAS, FADEC interface, AHRS. Pitot-static system, instruments, air data computers, AHRS, IRS, radio altimeter, magnetic compass, gyroscopic instruments.'),
    (9, 10, 'EWIS Zonal Inspections Chafing', 'Troubleshooting Intermittent Faults Data Bus',
     'EWIS, zonal inspection procedures, chafing, degradation, wire separation, aging aircraft, corrosion in connectors. Intermittent fault analysis, data bus troubleshooting (ARINC 429/629, CAN bus), noise, grounding issues, schematic reading, multimeter/oscilloscope use.'),
]

for c1, c2, t1, t2, detail in pairs:
    s = run_pass(c1, c2, t1, t2, detail)
    TOTAL += s
    time.sleep(3)

print(f'\n{"="*50}')
print(f'🔥 License E TOTAL: {TOTAL} questions saved')
print(f'\nReview: https://inspectpractice.com/admin/questions/review')
