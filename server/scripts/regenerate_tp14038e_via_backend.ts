import { prisma } from '../src/config/database';
import { aiService } from '../src/services/ai.service';

const PLAN = [
  { code: 'TP14038E-CARS', chapter: 'CARs, Standards, Certification & Maintenance Release' },
  { code: 'TP14038E-STD', chapter: 'Standard Practices, Documentation, Tools & NDT' },
  { code: 'TP14038E-AF', chapter: 'Airframe Structures & Systems' },
  { code: 'TP14038E-PP', chapter: 'Powerplant & Propulsion' },
  { code: 'TP14038E-EA', chapter: 'Electrical, Avionics & Instrumentation' },
  { code: 'TP14038E-HF', chapter: 'Human Factors, SMS & Operational Decision Making' },
] as const;

async function main() {
  // Cleanup old generated rows for these TP exams (v2/v3/custom imports or prior generated runs)
  const tpExams = await prisma.exam.findMany({
    where: { code: { startsWith: 'TP14038E-' } },
    select: { id: true, code: true, chapters: { select: { id: true, number: true } } },
  });

  if (tpExams.length !== 6) {
    throw new Error(`Expected 6 TP14038E exams, found ${tpExams.length}`);
  }

  const examIds = tpExams.map(e => e.id);
  const cleanup = await prisma.question.deleteMany({ where: { examId: { in: examIds } } });
  console.log(`[cleanup] deleted ${cleanup.count} existing TP14038E questions`);

  let generated = 0;

  for (const p of PLAN) {
    const exam = tpExams.find(e => e.code === p.code);
    if (!exam) throw new Error(`Exam not found: ${p.code}`);
    const chapter = exam.chapters[0];
    if (!chapter) throw new Error(`No chapter for exam ${p.code}`);

    // 50/exam => 20 EASY + 20 MEDIUM + 10 HARD
    for (const step of [
      { difficulty: 'EASY' as const, count: 20 },
      { difficulty: 'MEDIUM' as const, count: 20 },
      { difficulty: 'HARD' as const, count: 10 },
    ]) {
      console.log(`[generate] ${p.code} ch.${chapter.number} ${step.difficulty} x${step.count}`);
      await aiService.generateQuestions({
        examId: exam.id,
        chapterId: chapter.id,
        type: 'MCQ',
        difficulty: step.difficulty,
        count: step.count,
      });
      generated += step.count;
    }
  }

  // Retag to explicit batch source while keeping provenance that it came from backend generator
  const retag = await prisma.question.updateMany({
    where: {
      examId: { in: examIds },
      aiSource: { startsWith: 'generated:TP14038E-' },
    },
    data: { aiSource: 'generated-backend:tp14038e-full-2026-05-08' },
  });

  const byExam = await prisma.exam.findMany({
    where: { id: { in: examIds } },
    select: {
      code: true,
      _count: { select: { questions: true } },
    },
    orderBy: { code: 'asc' },
  });

  const byDifficulty = await prisma.question.groupBy({
    by: ['difficulty'],
    where: { examId: { in: examIds }, aiSource: 'generated-backend:tp14038e-full-2026-05-08' },
    _count: { _all: true },
  });

  const total = await prisma.question.count({
    where: { examId: { in: examIds }, aiSource: 'generated-backend:tp14038e-full-2026-05-08' },
  });

  console.log(JSON.stringify({
    generatedRequested: generated,
    retagged: retag.count,
    total,
    byExam,
    byDifficulty,
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
