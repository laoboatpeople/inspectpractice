import { prisma } from '../src/config/database';
import { aiService } from '../src/services/ai.service';

const FINAL_SOURCE = 'generated-backend:tp14038e-full-2026-05-08';
const targetPerExam = 50;

async function main() {
  const exams = await prisma.exam.findMany({
    where: { code: { startsWith: 'TP14038E-' } },
    select: { id: true, code: true, chapters: { select: { id: true, number: true } } },
    orderBy: { code: 'asc' },
  });

  if (exams.length !== 6) throw new Error(`Expected 6 TP exams, found ${exams.length}`);

  const examIds = exams.map(e => e.id);
  const del = await prisma.question.deleteMany({ where: { examId: { in: examIds } } });
  console.log(`[reset] deleted ${del.count} TP14038E questions`);

  const diffCycle: Array<'EASY' | 'MEDIUM' | 'HARD'> = ['EASY', 'MEDIUM', 'HARD', 'MEDIUM'];

  for (const exam of exams) {
    const chapter = exam.chapters[0];
    if (!chapter) throw new Error(`Missing chapter for ${exam.code}`);

    let attempts = 0;
    let current = 0;

    while (current < targetPerExam && attempts < 16) {
      const missing = targetPerExam - current;
      const ask = Math.min(10, Math.max(4, missing));
      const difficulty = diffCycle[attempts % diffCycle.length];

      console.log(`[gen] ${exam.code} ch.${chapter.number} has ${current}/${targetPerExam}, ask ${ask} ${difficulty}`);
      await aiService.generateQuestions({
        examId: exam.id,
        chapterId: chapter.id,
        type: 'MCQ',
        difficulty,
        count: ask,
      });

      current = await prisma.question.count({ where: { examId: exam.id } });
      attempts++;
    }

    if (current < targetPerExam) {
      throw new Error(`Could not reach ${targetPerExam} for ${exam.code}. current=${current}`);
    }

    if (current > targetPerExam) {
      const extra = current - targetPerExam;
      const newest = await prisma.question.findMany({
        where: { examId: exam.id },
        orderBy: [{ createdAt: 'desc' }],
        select: { id: true },
        take: extra,
      });
      await prisma.question.deleteMany({ where: { id: { in: newest.map(n => n.id) } } });
      current = await prisma.question.count({ where: { examId: exam.id } });
      console.log(`[trim] ${exam.code} removed ${extra}, now ${current}`);
    }
  }

  const retag = await prisma.question.updateMany({
    where: { examId: { in: examIds } },
    data: { aiSource: FINAL_SOURCE, status: 'PENDING' },
  });

  const byExam = await prisma.exam.findMany({
    where: { id: { in: examIds } },
    select: { code: true, _count: { select: { questions: true } } },
    orderBy: { code: 'asc' },
  });
  const total = await prisma.question.count({ where: { examId: { in: examIds }, aiSource: FINAL_SOURCE } });
  const byDifficulty = await prisma.question.groupBy({
    by: ['difficulty'],
    where: { examId: { in: examIds }, aiSource: FINAL_SOURCE },
    _count: { _all: true },
  });

  console.log(JSON.stringify({ retagged: retag.count, total, byExam, byDifficulty }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
