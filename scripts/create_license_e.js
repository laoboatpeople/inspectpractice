const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create exam
  const exam = await prisma.exam.create({
    data: {
      id: 'e-license-exam',
      code: 'E-ELECTRONICS',
      name: 'E — Electronics (Avionics)',
      name_fr: 'E — Électronique (Avionique)',
      description: 'Transport Canada AME License E — Electronics: avionics systems, electrical fundamentals, instruments, communication/navigation, maintenance practices.',
      country: 'CA',
      licenseType: 'TC-AME',
      isActive: true,
      timeLimit: 90,
      passingScore: 70.0,
      questionsPerSimulation: 50,
      randomizeOrder: true,
    }
  });
  console.log('Exam created:', exam.code);

  // Create chapters
  const chapters = [
    { number: 1, name: 'CARs & Regulations — Standard 566, 571, 573, Maintenance Release' },
    { number: 2, name: 'Standard Practices — Wiring, Connectors, Crimping, Bonding & EWIS' },
    { number: 3, name: 'Electrical Fundamentals — DC/AC Circuits, Components & Measurements' },
    { number: 4, name: 'Electrical Power Systems — Generators, Alternators, Batteries, Buses' },
    { number: 5, name: 'Communication Systems — VHF, HF, Audio, SATCOM, ACARS' },
    { number: 6, name: 'Navigation Systems — VOR, ILS, DME, ADF, GPS, GNSS, Transponder' },
    { number: 7, name: 'Advanced Avionics — TCAS, Weather Radar, FMS, Autopilot, EFIS, EICAS' },
    { number: 8, name: 'Instruments & Sensors — Pitot-Static, AHRS, IRS, Radio Altimeter, ADCs' },
    { number: 9, name: 'EWIS — Zonal Inspections, Chafing, Degradation, Aging Aircraft' },
    { number: 10, name: 'Troubleshooting — Intermittent Faults, Data Bus, Noise, Schematic Reading' },
  ];

  for (const ch of chapters) {
    await prisma.chapter.create({
      data: {
        examId: exam.id,
        number: ch.number,
        name: ch.name,
      }
    });
  }
  console.log('Chapters created:', chapters.length);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
