import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const EXAMS: any[] = [
  {
    code: 'ICC-B1', name: 'Residential Building Inspector (B1)',
    description: 'ICC B1 Residential Building Inspector — 2024 International Residential Code (IRC). 60 questions, 2 hours, open book, 75% passing. Covers IRC Chapters 1-11.',
    country: 'US', licenseType: 'ICC-B1', timeLimit: 120, passingScore: 75,
    questionsPerSimulation: 60, displayOrder: 10,
    chapters: [
      { number: 1, name: 'Code Administration', syllabusRef: 'IRC Ch.1' },
      { number: 2, name: 'Building Planning', syllabusRef: 'IRC Ch.3' },
      { number: 3, name: 'Footings & Foundations', syllabusRef: 'IRC Ch.4' },
      { number: 4, name: 'Floors', syllabusRef: 'IRC Ch.5' },
      { number: 5, name: 'Walls', syllabusRef: 'IRC Ch.6' },
      { number: 6, name: 'Roof & Ceiling', syllabusRef: 'IRC Ch.7-8' },
      { number: 7, name: 'Public Safety', syllabusRef: 'IRC Ch.3' },
      { number: 8, name: 'Means of Egress & Fire Safety', syllabusRef: 'IRC Ch.3' },
    ],
  },
  {
    code: 'ICC-B2', name: 'Commercial Building Inspector (B2)',
    description: 'ICC B2 Commercial Building Inspector — International Building Code (IBC). 80 questions, 3.5 hours, open book, 75% passing.',
    country: 'US', licenseType: 'ICC-B2', timeLimit: 210, passingScore: 75,
    questionsPerSimulation: 80, displayOrder: 20,
    chapters: [
      { number: 1, name: 'Code Administration', syllabusRef: 'IBC Ch.1' },
      { number: 2, name: 'Building Planning & Occupancy', syllabusRef: 'IBC Ch.3' },
      { number: 3, name: 'Types of Construction', syllabusRef: 'IBC Ch.6' },
      { number: 4, name: 'Fire Protection Systems', syllabusRef: 'IBC Ch.9' },
      { number: 5, name: 'Means of Egress', syllabusRef: 'IBC Ch.10' },
      { number: 6, name: 'Interior Finishes & Structures', syllabusRef: 'IBC Ch.8,16' },
      { number: 7, name: 'Accessibility', syllabusRef: 'IBC Ch.11' },
      { number: 8, name: 'Exterior Walls & Roof', syllabusRef: 'IBC Ch.14,15' },
    ],
  },
  {
    code: 'ICC-E1', name: 'Residential Electrical Inspector (E1)',
    description: 'ICC E1 Residential Electrical Inspector — National Electrical Code (NEC) + IRC Chapters 34-43. 60 questions, open book, 75% passing.',
    country: 'US', licenseType: 'ICC-E1', timeLimit: 120, passingScore: 75,
    questionsPerSimulation: 60, displayOrder: 30,
    chapters: [
      { number: 1, name: 'Code Administration', syllabusRef: 'NEC 90' },
      { number: 2, name: 'General Requirements', syllabusRef: 'NEC Ch.1' },
      { number: 3, name: 'Wiring & Protection', syllabusRef: 'NEC Ch.2' },
      { number: 4, name: 'Wiring Methods & Materials', syllabusRef: 'NEC Ch.3' },
      { number: 5, name: 'Equipment & Lamps', syllabusRef: 'NEC Ch.4' },
      { number: 6, name: 'Special Occupancies & Equipment', syllabusRef: 'NEC Ch.5-6' },
      { number: 7, name: 'Communications Systems', syllabusRef: 'NEC Ch.8' },
      { number: 8, name: 'Residential IRC Electrical (E3400-E4200)', syllabusRef: 'IRC Ch.34-43' },
    ],
  },
  {
    code: 'ICC-P1', name: 'Residential Plumbing Inspector (P1)',
    description: 'ICC P1 Residential Plumbing Inspector — International Plumbing Code (IPC) + IRC Chapters 25-33. 60 questions, open book, 75% passing.',
    country: 'US', licenseType: 'ICC-P1', timeLimit: 120, passingScore: 75,
    questionsPerSimulation: 60, displayOrder: 40,
    chapters: [
      { number: 1, name: 'Code Administration', syllabusRef: 'IPC Ch.1' },
      { number: 2, name: 'General Regulations', syllabusRef: 'IPC Ch.3' },
      { number: 3, name: 'Fixtures & Faucets', syllabusRef: 'IPC Ch.4' },
      { number: 4, name: 'Water Heaters', syllabusRef: 'IPC Ch.5' },
      { number: 5, name: 'Water Supply & Distribution', syllabusRef: 'IPC Ch.6' },
      { number: 6, name: 'Sanitary Drainage', syllabusRef: 'IPC Ch.7' },
      { number: 7, name: 'Vents', syllabusRef: 'IPC Ch.9' },
      { number: 8, name: 'Traps, Interceptors & Storm Drainage', syllabusRef: 'IPC Ch.10-11' },
    ],
  },
  {
    code: 'ICC-M1', name: 'Residential Mechanical Inspector (M1)',
    description: 'ICC M1 Residential Mechanical Inspector — International Mechanical Code (IMC) + IRC Chapters 12-24. 60 questions, open book, 75% passing.',
    country: 'US', licenseType: 'ICC-M1', timeLimit: 120, passingScore: 75,
    questionsPerSimulation: 60, displayOrder: 50,
    chapters: [
      { number: 1, name: 'Code Administration', syllabusRef: 'IMC Ch.1' },
      { number: 2, name: 'General Regulations', syllabusRef: 'IMC Ch.3' },
      { number: 3, name: 'Ventilation', syllabusRef: 'IMC Ch.4' },
      { number: 4, name: 'Exhaust Systems', syllabusRef: 'IMC Ch.5' },
      { number: 5, name: 'Duct Systems', syllabusRef: 'IMC Ch.6' },
      { number: 6, name: 'Combustion Air', syllabusRef: 'IMC Ch.7' },
      { number: 7, name: 'Chimneys & Vents', syllabusRef: 'IMC Ch.8' },
      { number: 8, name: 'Appliances & HVAC', syllabusRef: 'IMC Ch.9-15' },
    ],
  },
];

async function main() {
  for (const def of EXAMS) {
    const existing = await prisma.exam.findUnique({ where: { code: def.code } });
    const exam = existing ?? (await prisma.exam.create({
      data: {
        code: def.code, name: def.name, description: def.description,
        country: def.country, licenseType: def.licenseType,
        timeLimit: def.timeLimit, passingScore: def.passingScore,
        questionsPerSimulation: def.questionsPerSimulation, displayOrder: def.displayOrder,
      },
    }));
    for (const ch of def.chapters) {
      const existingCh = await prisma.chapter.findUnique({ where: { examId_number: { examId: exam.id, number: ch.number } } });
      if (!existingCh) {
        await prisma.chapter.create({ data: { examId: exam.id, number: ch.number, name: ch.name, syllabusRef: ch.syllabusRef } });
      }
    }
    console.log(`${existing ? '[SKIP]' : '[CREATE]'} ${def.code} — ${def.chapters.length} chapters`);
  }
}

main().finally(() => prisma.$disconnect());
