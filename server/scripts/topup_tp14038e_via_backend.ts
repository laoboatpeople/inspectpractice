import { prisma } from '../src/config/database';
import { aiService } from '../src/services/ai.service';

const TARGET_PER_EXAM = 50;
const SOURCE_PREFIX = 'generated:TP14038E-';
const FINAL_SOURCE = 'generated-backend:tp14038e-full-2026-05-08';

async function countByExam() {
  const exams = await prisma.exam.findMany({
    where: { code: { startsWith: 'TP14038E-' } },
    select: {
      id: true,
      code: true,
      chapters: { select: { id: true, number: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { code: 'asc' },
  });
  return exams;
}

async function main() {
  let exams = await countByExam();

  for (const exam of exams) {
    const chapter = exam.chapters[0];
    if (!chapter) throw new Error(`No chapter for ${exam.code}`);

    let current = exam._count.questions;
    let guard = 0;

    while (current < TARGET_PER_EXAM && guard < 8) {
      const missing = TARGET_PER_EXAM - current;
      const ask = Math.min(12, Math.max(4, missing + 2));
      const difficulty = missing > 6 ? 'MEDIUM' : 'EASY';

      console.log(`[topup] ${exam.code} has ${current}, missing ${missing}, requesting ${ask} (${difficulty})`);
      await aiService.generateQuestions({
        examId: exam.id,
        chapterId: chapter.id,
        type: 'MCQ',
        difficulty,
        count: ask,
      });

      const after = await prisma.question.count({ where: { examId: exam.id, aiSource: { startsWith: SOURCE_PREFIX } } });
      current = after;
      guard += 1;
    }

    if (current > TARGET_PER_EXAM) {
      const extra = current - TARGET_PER_EXAM;
      const toDelete = await prisma.question.findMany({
        where: { examId: exam.id, aiSource: { startsWith: SOURCE_PREFIX } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
        take: extra,
      });
      if (toDelete.length) {
        await prisma.question.deleteMany({ where: { id: { in: toDelete.map(x => x.id) } } });
      }
      console.log(`[trim] ${exam.code} removed ${toDelete.length} extras`);
    }
  }

  // Retag entire TP bank to final source tag
  const retag = await prisma.question.updateMany({
    where: {
      exam: { code: { startsWith: 'TP14038E-' } },
      aiSource: { startsWith: SOURCE_PREFIX },
    },
    data: { aiSource: FINAL_SOURCE, status: 'PENDING' },
  });

  const finalExams = await prisma.exam.findMany({
    where: { code: { startsWith: 'TP14038E-' } },
    select: { code: true, _count: { select: { questions: true } } },
    orderBy: { code: 'asc' },
  });

  const total = await prisma.question.count({ where: { aiSource: FINAL_SOURCE } });
  const byDifficulty = await prisma.question.groupBy({
    by: ['difficulty'],
    where: { aiSource: FINAL_SOURCE },
    _count: { _all: true },
  });

  console.log(JSON.stringify({ retagged: retag.count, total, finalExams, byDifficulty }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
