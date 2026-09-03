/**
 * Generate theory content for NHIE chapters only (approved questions exist).
 * Run: set -a && . server/.env && npx tsx scripts/nhie_theory.ts
 */
import { prisma } from '../server/src/config/database';
import { aiService } from '../server/src/services/ai.service';

async function main() {
  console.log('🔍 Finding NHIE chapters with approved questions...\n');

  const exam = await prisma.exam.findUnique({ where: { code: 'NHIE' } });
  if (!exam) {
    console.error('❌ NHIE exam not found');
    await prisma.$disconnect();
    process.exit(1);
  }

  const chapters = await prisma.chapter.findMany({
    where: {
      examId: exam.id,
      isActive: true,
      questions: { some: { status: 'APPROVED' } },
    },
    include: {
      exam: { select: { code: true } },
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
    orderBy: { number: 'asc' },
  });

  console.log(`📊 Found ${chapters.length} NHIE chapters.\n`);

  for (const ch of chapters) {
    const label = `NHIE / Ch.${ch.number} — ${ch.name}`;
    console.log(`⏳ Generating theory for ${label} (${ch._count.questions} questions)...`);
    try {
      const result = await aiService.generateTheory(ch.id);
      console.log(`✅ ${label} — EN: ${result.en.length} chars, FR: ${result.fr.length} chars\n`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${label} — Failed: ${msg}\n`);
    }
  }

  console.log('🎉 NHIE theory generation complete');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal:', err);
  prisma.$disconnect().then(() => process.exit(1));
});
