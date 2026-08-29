"use strict";
/**
 * Inspect Practice — Seed Script
 * Step 0.9: Canada AME — Chapter 566 (Aircraft Structures)
 *
 * Run: npm run db:seed
 * Requires: DATABASE_URL in .env
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('\n========================================');
    console.log('  Inspect Practice — Seed: Canada AME Ch.566');
    console.log('========================================\n');
    // ── Admin user ────────────────────────────────────────────────────────────
    const adminEmail = 'admin@inspectpractice.ca';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    let adminId;
    if (existingAdmin) {
        adminId = existingAdmin.id;
        console.log('  [SKIP] Admin already exists:', adminEmail);
    }
    else {
        const hash = await bcrypt.hash('Admin1234!', 12);
        const admin = await prisma.user.create({
            data: { email: adminEmail, passwordHash: hash, name: 'SkyAdmin', role: 'ADMIN' },
        });
        adminId = admin.id;
        console.log('  [CREATE] Admin user:', adminEmail);
    }
    // ── Exam: TC-AME-M1 ───────────────────────────────────────────────────────
    // M1 = Mechanical: Structures, Systems and Components
    const examCode = 'TC-AME-M1';
    const existingExam = await prisma.exam.findUnique({ where: { code: examCode } });
    let examId;
    if (existingExam) {
        examId = existingExam.id;
        console.log('  [SKIP] Exam already exists:', examCode);
    }
    else {
        const exam = await prisma.exam.create({
            data: {
                code: examCode,
                name: 'Transport Canada AME — M1: Structures, Systems & Components',
                description: 'Transport Canada Aircraft Maintenance Engineer examination for Category M1 — Structures, Systems and Components. ' +
                    'Covers aircraft airframe structures, mechanical systems, and component maintenance.',
                country: 'CA',
                licenseType: 'TC-AME',
                isActive: true,
            },
        });
        examId = exam.id;
        console.log('  [CREATE] Exam:', examCode);
    }
    // ── Chapter 566: Aircraft Structures ─────────────────────────────────────
    const chapterNumber = 566;
    const existingChapter = await prisma.chapter.findUnique({
        where: { examId_number: { examId, number: chapterNumber } },
    });
    let chapterId;
    if (existingChapter) {
        chapterId = existingChapter.id;
        console.log('  [SKIP] Chapter 566 already exists');
    }
    else {
        const chapter = await prisma.chapter.create({
            data: {
                examId,
                number: chapterNumber,
                name: 'Aircraft Structures',
                isActive: true,
            },
        });
        chapterId = chapter.id;
        console.log('  [CREATE] Chapter 566: Aircraft Structures');
    }
    // ── Sample Questions for Chapter 566 ──────────────────────────────────────
    // Topics covered:
    //   1. Structural components (fuselage, wing,empennage)
    //   2. Materials (Al alloys, composites, steel)
    //   3. Corrosion identification & treatment
    //   4. Rivet installation & inspection
    //   5. Sheet metal repair
    //   6. Nondestructive testing (NDT)
    const questions = [
        // ── MCQ / Easy ──────────────────────────────────────────────────────────
        {
            type: 'MCQ',
            difficulty: 'EASY',
            question: 'Which aluminum alloy is most commonly used in aircraft skin panels and structural members?',
            options: ['2024-T3', '6061-T6', '7075-T6', '5052-H32'],
            correctAnswer: '2024-T3',
            explanation: '2024-T3 is a heat-treated aluminum-copper alloy (4.5% Cu) widely used in aircraft skin, ' +
                'especially for wing and fuselage skins, due to its high strength-to-weight ratio and excellent ' +
                'fatigue resistance. 6061-T6 is structural but less used for airframe skins; 7075-T6 is used in ' +
                'high-strength fittings; 5052-H32 is a corrosion-resistant sheet alloy but lower strength.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'EASY',
            question: 'Which of the following is classified as a "longitudinal" structural member of a fuselage?',
            options: ['Frame', 'Bulkhead', 'Stringer', 'Skin'],
            correctAnswer: 'Stringer',
            explanation: 'Stringers (also called longerons when running full length) are longitudinal members that run ' +
                'along the fuselage axis and carry bending loads. Frames and bulkheads are transverse members; ' +
                'the skin carries shear loads and contributes to overall stiffness.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'EASY',
            question: 'What is the primary purpose of a doubler plate in aircraft structural repair?',
            options: [
                'To reduce weight',
                'To provide corrosion resistance',
                'To restore or increase structural strength',
                'To improve aerodynamics',
            ],
            correctAnswer: 'To restore or increase structural strength',
            explanation: 'A doubler (or reinforcement plate) is added over existing structure to restore strength ' +
                'lost due to damage or corrosion. It carries load over the damaged area. Doublers add weight ' +
                'and do not primarily serve aerodynamic or corrosion-resistance purposes.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'EASY',
            question: 'Intergranular corrosion is most likely to occur in which aluminum alloy condition?',
            options: [
                '2024-T3 clad sheet',
                '6061-T6 solution heat-treated',
                '7075-T6 over-aged (T73)',
                '2024-T3 un-clad bare',
            ],
            correctAnswer: '2024-T3 un-clad bare',
            explanation: 'Intergranular (exfoliation) corrosion occurs in 2024-T3 bare (un-clad) sheet when grain ' +
                'boundaries are sensitized, allowing attack along grain interfaces. Clad 2024-T3 (Alclad) has ' +
                'a protective pure-aluminum layer that resists this. 7075-T73 is specifically over-aged to resist ' +
                'this type of attack. Corrosion in bare 2024-T3 can lift layers of material (exfoliation).',
            status: 'APPROVED',
        },
        // ── MCQ / Medium ─────────────────────────────────────────────────────────
        {
            type: 'MCQ',
            difficulty: 'MEDIUM',
            question: 'A sheet metal repair uses a flush rivet instead of a protruding-head rivet. What is the main reason for choosing flush rivets?',
            options: [
                'Greater shear strength',
                'Improved aerodynamic surface',
                'Lower cost',
                'Easier installation',
            ],
            correctAnswer: 'Improved aerodynamic surface',
            explanation: 'Flush (countersunk) rivets provide a smooth aerodynamic surface with no protruding head. ' +
                'They do NOT provide greater shear strength (in fact, the countersunk head is weaker) and are ' +
                'more expensive and difficult to install correctly than standard protruding-head rivets.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'MEDIUM',
            question: 'Which NDT method uses a ferro-magnetic powder to detect surface and near-surface discontinuities?',
            options: ['Dye penetrant', 'Ultrasonic testing', 'Magnetic particle inspection', 'Eddy current testing'],
            correctAnswer: 'Magnetic particle inspection',
            explanation: 'Magnetic particle inspection (MPI) magnetizes a ferromagnetic part and applies iron powder; ' +
                'the powder clusters at flux leakage sites, revealing cracks and defects. Dye penetrant is ' +
                'used on non-magnetic materials; ultrasonic uses sound waves; eddy current uses electromagnetic ' +
                'induction. MPI is a key NDT for steel landing gear and engine components.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'MEDIUM',
            question: 'In a shear splice repair of a 2024-T3 skin panel, what is the maximum permissible gap between the splice plates before a filler material must be used?',
            options: ['0.010 inch', '0.020 inch', '0.030 inch', '0.060 inch'],
            correctAnswer: '0.030 inch',
            explanation: 'TC and FAR/TSO repair manuals generally specify a maximum gap of 0.030 inch (0.76 mm) ' +
                'between splice plates and the underlying structure before a filler/sealant must be used to ' +
                'prevent galvanic corrosion and ensure load transfer. Gaps exceeding this must be filled.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'MEDIUM',
            question: 'What type of fatigue crack propagation pattern would you expect in a 2024-T3 alloy sheet loaded in tension?',
            options: [
                'Straight line perpendicular to principal stress',
                'Stepped/flat facet pattern (beach marks)',
                '45-degree shear lip pattern only',
                'Random branching pattern',
            ],
            correctAnswer: 'Stepped/flat facet pattern (beach marks)',
            explanation: 'Fatigue cracks in 2024-T3 propagate with characteristic striations (beach marks) visible ' +
                'under magnification. These represent incremental crack advance. The crack usually initiates at a ' +
                'stress concentration (hole, edge), propagates initially on 45° shear planes, then transitions ' +
                'to a tensile (perpendicular to stress) mode with flat facet striations before final overload.',
            status: 'APPROVED',
        },
        // ── MCQ / Hard ───────────────────────────────────────────────────────────
        {
            type: 'MCQ',
            difficulty: 'HARD',
            question: 'A honeycomb composite panel with aluminum facings has sustained impact damage. What is the correct repair sequence according to SRM Chapter 51?',
            options: [
                'Remove only damaged facing, re-honeycomb, apply Doubler',
                'Remove damaged facing and all damaged honeycomb cells to sound core, replace honeycomb, install bonded patch',
                'Fill damage area with epoxy filler, install mechanically fastened doubler',
                'Apply scuff coat over damage, seal with high-build primer',
            ],
            correctAnswer: 'Remove damaged facing and all damaged honeycomb cells to sound core, replace honeycomb, install bonded patch',
            explanation: 'Honeycomb repair requires complete removal of damaged core and facing back to sound structure. ' +
                'The repair involves: (1) drill stop-drill holes at damage boundary, (2) remove all damaged ' +
                'honeycomb to sound core, (3) clean and prepare surfaces, (4) install new honeycomb core sections ' +
                'with adhesive, (5) bond new face sheet (pre-impregnated orwet layup) or mechanically attach a ' +
                'pre-made patch. Epoxy filler alone is not acceptable for structural honeycomb damage.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'HARD',
            question: 'Under sustained tensile loading at elevated temperature (100°C), which failure mechanism is most critical for 7075-T6 aluminum alloy?',
            options: [
                'Transgranular cleavage',
                'Stress corrosion cracking (SCC)',
                'Low-cycle fatigue',
                'Creep (diffusional creep)',
            ],
            correctAnswer: 'Stress corrosion cracking (SCC)',
            explanation: '7075-T6 is highly susceptible to Stress Corrosion Cracking (SCC) when simultaneously subject ' +
                'to tensile stress, a susceptible environment (moisture, especially water vapor), and elevated ' +
                'temperature (even 100°C accelerates SCC). The susceptible grain boundary precipitates in the T6 ' +
                'temper make 7075-T6 particularly vulnerable. Creep (diffusional) is not significant in aluminum ' +
                'alloys at 100°C (creep becomes relevant only above ~0.5 Tm). Cleavage and low-cycle fatigue ' +
                'are not the primary mechanisms at these conditions.',
            status: 'APPROVED',
        },
        {
            type: 'MCQ',
            difficulty: 'HARD',
            question: 'When installing solid rivets in a 2024-T3 skin repair, which rivet material and condition would be most compatible with the existing structure?',
            options: ['2117-T3 aluminum rivets', '2024-T4 aluminum rivets', 'Monel (K-500) nickel-copper', 'A-286 iron-base superalloy'],
            correctAnswer: '2117-T3 aluminum rivets',
            explanation: '2117-T3 (formerly QQ-A-430) is the standard rivet alloy for aircraft structures, including ' +
                '2024-T3 skin. It is softer than 2024-T3 (making it easier to set without cracking), has good ' +
                'corrosion resistance, and is compatible in galvanic series. 2024-T4 rivets are too hard and ' +
                'prone to cracking during setting. Monel and A-286 are reserved for high-temperature or special ' +
                'applications where their coefficient of thermal expansion must match the structure.',
            status: 'APPROVED',
        },
        // ── TRUE/FALSE ───────────────────────────────────────────────────────────
        {
            type: 'TRUEFALSE',
            difficulty: 'EASY',
            question: 'Alclad 2024-T3 sheet has a pure aluminum coating on both surfaces to improve corrosion resistance.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Alclad is a composite sheet: a core of 2024-T3 is bonded between two layers of commercially ' +
                'pure (99%+ Al) aluminum. The pure Al cladding acts as a sacrificial anode, protecting the ' +
                'copper-rich core from intergranular and pitting corrosion. If the cladding is worn through, ' +
                'the exposed core will corrode rapidly.',
            status: 'APPROVED',
        },
        {
            type: 'TRUEFALSE',
            difficulty: 'MEDIUM',
            question: 'Cold-working a hole (bushhed or expanded bushed) increases its fatigue life by introducing beneficial compressive residual stresses at the hole edge.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Cold-expansion processes (e.g., split-sleeve cold expansion, ILDR or "expanded and reduced" ' +
                'bushings) introduce compressive residual hoop stresses around the hole. These stresses oppose ' +
                'the tensile stresses applied in service, delaying crack initiation and significantly increasing ' +
                'fatigue life. This technique is widely used in aircraft structures at high-stress hole locations.',
            status: 'APPROVED',
        },
        {
            type: 'TRUEFALSE',
            difficulty: 'HARD',
            question: 'For a corrosion-patch repair on 2024-T3 bare (un-clad) sheet, it is acceptable to use 6061-T6 alloy for the patch doubler.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: '6061-T6 has a different coefficient of thermal expansion and different galvanic potential than ' +
                '2024-T3. Using 6061-T6 as a dissimilar-material doubler can cause galvanic corrosion at the ' +
                'faying surfaces, especially in presence of moisture. SRM repairs for 2024-T3 bare sheet require ' +
                '2024-T3 or 7075-T6 doublers (depending on location), or specifically approved alternatives. ' +
                'Sealant alone between dissimilar metals does not prevent galvanic corrosion long-term.',
            status: 'APPROVED',
        },
    ];
    // ── Insert questions (skip duplicates by question text) ─────────────────
    let created = 0;
    let skipped = 0;
    for (const q of questions) {
        const existing = await prisma.question.findFirst({
            where: { question: q.question, chapterId },
        });
        if (existing) {
            skipped++;
            continue;
        }
        await prisma.question.create({
            data: {
                examId,
                chapterId,
                type: q.type,
                difficulty: q.difficulty,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                status: q.status,
                approvedById: adminId,
                approvedAt: new Date(),
            },
        });
        created++;
    }
    console.log(`\n  [DONE] Questions — ${created} created, ${skipped} skipped (already exist)`);
    console.log('\n========================================');
    console.log('  Seed complete — Canada AME Ch. 566');
    console.log('========================================\n');
}
main()
    .catch((e) => {
    console.error('\n  [ERROR] Seed failed:', e.message);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map