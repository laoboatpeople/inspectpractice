/**
 * Script: Generate theory content for ALL chapters with approved questions.
 * Run from project root: npx tsx server/scripts/generate-theory.ts
 */
import { prisma } from '../server/src/config/database';
import { aiService } from '../server/src/services/ai.service';

async function main() {
  console.log('🔍 Finding chapters with approved questions...\n');

  const chapters = await prisma.chapter.findMany({
    where: {
      isActive: true,
      questions: { some: { status: 'APPROVED' } },
    },
    include: {
      exam: { select: { code: true } },
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
    orderBy: [{ examId: 'asc' }, { number: 'asc' }],
  });

  if (chapters.length === 0) {
    console.log('❌ No chapters with approved questions found.');
    await prisma.$disconnect();
    return;
  }

  console.log(`📊 Found ${chapters.length} chapters with questions.\n`);

  for (const ch of chapters) {
    const label = `${ch.exam?.code ?? '?'} / Ch.${ch.number} — ${ch.name}`;
    console.log(`⏳ Generating theory for ${label} (${ch._count.questions} questions)...`);

    try {
      const result = await aiService.generateTheory(ch.id);
      console.log(`✅ ${label} — EN: ${result.en.length} chars, FR: ${result.fr.length} chars\n`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${label} — Failed: ${msg}\n`);
    }
  }

  console.log('🎉 All done!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal:', err);
  prisma.$disconnect().then(() => process.exit(1));
});
