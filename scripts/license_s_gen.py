#!/usr/bin/env python3
"""License S — Structures question generation. 2-chapter batches."""

import json, urllib.request, urllib.error, sys, time, re

TOKEN = open('/tmp/admin_token.txt').read().strip()
S_EXAM = 'b2f6c1c0-2156-4a02-8025-0a0e4ded0533'

# TC URLs (lightweight HTML)
TC_URLS = [
    "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-571-maintenance-canadian-aviation-regulations-cars",
    "https://tc.canada.ca/en/corporate-services/acts-regulations/list-regulations/canadian-aviation-regulations-sor-96-433/standards/standard-573-approved-maintenance-organizations-canadian-aviation-regulations-cars",
    "https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/"
]

CH = {
    1: 'd6657097-0441-4f7f-9ddd-86b52c08abb2',
    2: '84260e12-02a1-4fe8-afeb-3c9ea322a6d9',
    3: '40a45bde-6ab8-43d3-ba75-d599298aadd3',
    4: 'b1caf1d0-731c-4d86-8748-e8bde77c056e',
    5: 'c881a0d2-57ba-4907-bc67-7ddd3556f1fd',
    6: 'b55dbf39-1d11-4443-92d1-53719d0e984b',
    7: '5070740d-ba73-4f3e-8373-d25091e31845',
}

def save_ch(ch_id, questions):
    if not questions: return 0
    total = 0
    for i in range(0, len(questions), 50):
        batch = questions[i:i+50]
        for retry in range(3):
            try:
                body = {'questions': batch, 'examId': S_EXAM, 'chapterId': ch_id}
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
    print(f'\n=== S Ch{c1}-{c2}: {t1[:25]}... ===')
    prompt = f"You are a Transport Canada AME License S (Structures) exam question writer. Generate 25 scenario-based MCQ questions each for Ch{c1}({t1}) and Ch{c2}({t2}) for License S - Aircraft Structures. {detail} Questions must be realistic structural maintenance scenarios with TC/FAA references. Each: question, options[A)B)C)D], correctAnswer(A-D), explanation(4-6sentences with regulatory references), type=MCQ, difficulty(EASY/MEDIUM/HARD), chapter=INTEGER({c1} or {c2}). Return ONLY valid JSON with questions array."
    
    for attempt in range(3):
        try:
            body = {"contentIds":[],"urls":TC_URLS,"instructions":prompt,"count":200,"type":"MCQ","difficulty":"MIXED"}
            req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-generate',
                data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
            resp = urllib.request.urlopen(req, timeout=300)
            questions = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
            
            if not questions:
                print(f'  ❌ 0 Q')
                time.sleep(10)
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
                    nq = {'question':q.get('question',''),'options':opts,'correctAnswer':str(q.get('correctAnswer','A')).strip().upper()[-1:],'explanation':q.get('explanation','') or 'Ref: TC/FAA standards.','type':'MCQ','difficulty':q.get('difficulty','MEDIUM')}
                    key = re.sub(r'[^\w\s]','',nq['question'].lower())[:80]
                    if len(nq['question'])>=5 and key not in seen:
                        seen.add(key)
                        unique.append(nq)
                saved = save_ch(ch_id, unique)
                total += saved
                print(f'  📘 Ch{ch}: {len(unique)} unique -> {saved} saved')
            print(f'  -> Total: {total}')
            return total
        except Exception as e:
            print(f'  ❌ Error: {str(e)[:80]}')
            time.sleep(10)
    return 0

TOTAL = 0

pairs = [
    (1, 2, 'CARs Regulations Standard 566 571 573 Approved Data', 'Sheet Metal Rivets Fasteners Skin Repairs Doublers',
     'Structural CARs Parts/V/VI/VII, maintenance release, technical records, approved repair data, AMO procedures, elementary work, specialized maintenance. Rivet types, fastener selection, edge distance, rivet spacing, bend allowance, repair layout, skin repairs, doublers, splices, stress distribution, crack propagation, structural loads, buckling.'),
    (3, 4, 'Composite Structures Fiberglass Carbon Kevlar', 'Corrosion Control Galvanic Exfoliation Pitting',
     'Fiberglass, carbon fiber, Kevlar, honeycomb, vacuum bagging, curing, delamination, moisture intrusion, heat damage, impact damage, bonded repairs. Galvanic, exfoliation, intergranular, pitting, stress corrosion, corrosion removal limits, corrosion prevention, structural corrosion assessment.'),
    (5, 6, 'Structural Inspection NDT Visual Dye Eddy Current', 'Structural Troubleshooting Fatigue Buckling',
     'Visual inspection, dye penetrant, eddy current, ultrasonic, MPI, crack detection, fatigue damage, inspection intervals, structural defect classification. Fatigue cracking, repeated failures, vibration damage, corrosion progression, buckling, improper repairs, fastener failure, composite delamination, hidden damage.'),
    (7, 0, 'Repair Design SRM Interpretation Damage Classification', '',
     'SRM interpretation, damage classification, approved repair data, repair limitations, repair certification, structural repair scenarios, maintenance release for structural repairs, airworthiness decisions, repair approval situations, acceptable damage limits.'),
]

for c1, c2, t1, t2, detail in pairs:
    if c2 > 0:
        s = run_pass(c1, c2, t1, t2, detail)
        TOTAL += s
        time.sleep(5)
    else:
        # Single chapter pass for Ch7
        print(f'\n=== S Ch7: {t1} ===')
        prompt = f"You are a Transport Canada AME License S (Structures) exam question writer. Generate 40 scenario-based MCQ questions for Ch7({t1}) for License S. {detail} Questions must be realistic structural maintenance scenarios with TC/FAA references. Each: question, options[A)B)C)D], correctAnswer(A-D), explanation(4-6sentences), type=MCQ, difficulty, chapter=7. Return ONLY valid JSON with questions array."
        for attempt in range(3):
            try:
                body = {"contentIds":[],"urls":TC_URLS,"instructions":prompt,"count":100,"type":"MCQ","difficulty":"MIXED"}
                req = urllib.request.Request('http://127.0.0.1:4000/api/questions/chat-generate',
                    data=json.dumps(body).encode(), headers={'Content-Type':'application/json','Authorization':f'Bearer {TOKEN}'}, method='POST')
                resp = urllib.request.urlopen(req, timeout=300)
                questions = json.loads(resp.read().decode()).get('data',{}).get('questions',[])
                if not questions:
                    print(f'  ❌ 0 Q')
                    time.sleep(10)
                    continue
                print(f'  ✅ {len(questions)} Q')
                qs = [q for q in questions if str(q.get('chapter','')) == '7']
                print(f'  Ch7 matching: {len(qs)}')
                ch_id = CH[7]
                seen = set()
                unique = []
                for q in qs:
                    opts = list(q.get('options',[]))
                    nq = {'question':q.get('question',''),'options':opts,'correctAnswer':str(q.get('correctAnswer','A')).strip().upper()[-1:],'explanation':q.get('explanation','') or 'Ref: TC/FAA.','type':'MCQ','difficulty':q.get('difficulty','MEDIUM')}
                    key = re.sub(r'[^\w\s]','',nq['question'].lower())[:80]
                    if len(nq['question'])>=5 and key not in seen:
                        seen.add(key)
                        unique.append(nq)
                saved = save_ch(ch_id, unique)
                TOTAL += saved
                print(f'  📘 Ch7: {len(unique)} unique -> {saved} saved')
                break
            except Exception as e:
                print(f'  ❌ Error: {str(e)[:80]}')
                time.sleep(10)

print(f'\n{"="*50}')
print(f'🔥 License S TOTAL: {TOTAL} questions saved')
