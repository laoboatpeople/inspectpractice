// Create M-License exams (M-AIRFRAME, M-POWERPLANT) with chapters from TP 14038E syllabus
// Run: node scripts/create_license_m_exams.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const exams = [
  {
    code: 'M-AIRFRAME',
    name: 'M — Airframe (Cellule)',
    description: 'Transport Canada AME M License — Airframe maintenance, structures, systems, landing gear, flight controls, hydraulics, pneumatics, pressurization, ice protection',
    licenseType: 'TC-AME',
    country: 'CA',
    chapters: [
      { number: 1, name: 'Aircraft Structures — Sheet Metal & Composites' },
      { number: 2, name: 'Aircraft Structures — Welding & Plastics' },
      { number: 3, name: 'Aircraft Assembly & Rigging' },
      { number: 4, name: 'Aircraft Fabric Covering' },
      { number: 5, name: 'Aircraft Painting & Finishing' },
      { number: 6, name: 'Hydraulic & Pneumatic Power Systems' },
      { number: 7, name: 'Landing Gear Systems' },
      { number: 8, name: 'Position & Warning Systems / Ice & Rain Protection' },
      { number: 9, name: 'Cabin Atmosphere & Pressurization' },
      { number: 10, name: 'Aircraft Fuel Systems' },
      { number: 11, name: 'Flight Controls — Primary & Secondary' },
      { number: 12, name: 'Fire Protection Systems' },
    ],
  },
  {
    code: 'M-POWERPLANT',
    name: 'M — Powerplant (Groupe motopropulseur)',
    description: 'Transport Canada AME M License — Reciprocating and turbine engines, propellers, fuel metering, ignition, exhaust, engine systems',
    licenseType: 'TC-AME',
    country: 'CA',
    chapters: [
      { number: 1, name: 'Reciprocating Engine — Theory & Construction' },
      { number: 2, name: 'Reciprocating Engine — Lubrication & Cooling' },
      { number: 3, name: 'Reciprocating Engine — Ignition & Starting' },
      { number: 4, name: 'Reciprocating Engine — Fuel Metering (Carburetor & FADEC)' },
      { number: 5, name: 'Reciprocating Engine — Induction & Exhaust' },
      { number: 6, name: 'Turbine Engine — Theory & Construction' },
      { number: 7, name: 'Turbine Engine — Lubrication & Sealing' },
      { number: 8, name: 'Turbine Engine — Fuel Controls & FADEC' },
      { number: 9, name: 'Turbine Engine — Ignition & Starting' },
      { number: 10, name: 'Engine Indicating & Instrumentation' },
      { number: 11, name: 'Propeller Systems' },
      { number: 12, name: 'Engine Installation, Fire Protection & Troubleshooting' },
    ],
  },
];

async function main() {
  console.log('Creating M License exams...\n');

  for (const examData of exams) {
    // Check if exam already exists
    const existing = await prisma.exam.findUnique({ where: { code: examData.code } });
    if (existing) {
      console.log(`  [SKIP] Exam ${examData.code} already exists (id: ${existing.id})`);
      continue;
    }

    const { chapters, ...examFields } = examData;
    const exam = await prisma.exam.create({ data: examFields });
    console.log(`  [OK] Created exam: ${exam.code} (id: ${exam.id})`);

    // Create chapters
    for (const ch of chapters) {
      await prisma.chapter.create({
        data: { examId: exam.id, ...ch },
      });
      console.log(`    [OK] Chapter ${ch.number}: ${ch.name}`);
    }
    console.log('');
  }

  console.log('\nDone! M License exams are ready.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
