import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { aiService } from '../services/ai.service';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * POST /api/admin/theory/generate/:chapterId
 * Generate theory content for a specific chapter using AI.
 * Requires ADMIN role.
 */
router.post('/generate/:chapterId', async (req: Request, res: Response): Promise<void> => {
  const { chapterId } = req.params;

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  try {
    const result = await aiService.generateTheory(chapterId);
    res.json({
      message: 'Theory content generated successfully',
      chapterId,
      chapterName: chapter.name,
      enLength: result.en.length,
      frLength: result.fr.length,
    });
  } catch (err) {
    console.error('[Admin Theory] Generation failed:', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    res.status(500).json({ message });
  }
});

/**
 * POST /api/admin/theory/generate-all
 * Generate theory content for ALL chapters that have approved questions.
 * Processes chapters one by one.
 */
router.post('/generate-all', async (req: Request, res: Response): Promise<void> => {
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
    res.json({ message: 'No chapters with approved questions found', results: [] });
    return;
  }

  // Send immediate response saying it's started
  res.json({
    message: `Theory generation started for ${chapters.length} chapters. Each takes ~30s.`,
    total: chapters.length,
    chapters: chapters.map(c => ({
      id: c.id,
      examCode: c.exam?.code,
      chapterNumber: c.number,
      chapterName: c.name,
      questionCount: c._count.questions,
    })),
  });

  // Generate in background (fire and forget)
  for (const chapter of chapters) {
    try {
      await aiService.generateTheory(chapter.id);
      console.log(`[Admin Theory] Generated for ${chapter.exam?.code || '?'} / Ch.${chapter.number}`);
    } catch (err) {
      console.error(`[Admin Theory] Failed for chapter ${chapter.id}:`, err);
    }
  }

  console.log('[Admin Theory] All generations complete');
});

/**
 * GET /api/admin/theory/status
 * Show which chapters have theory content and which don't.
 */
router.get('/status', async (_req: Request, res: Response): Promise<void> => {
  const chapters = await prisma.chapter.findMany({
    where: { isActive: true },
    include: {
      exam: { select: { id: true, code: true } },
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
    orderBy: [{ examId: 'asc' }, { number: 'asc' }],
  });

  const data = chapters.map(ch => ({
    id: ch.id,
    examCode: ch.exam?.code ?? '?',
    chapterNumber: ch.number,
    chapterName: ch.name,
    questionCount: ch._count.questions,
    hasTheoryEn: ch.theoryContent !== null && ch.theoryContent.length > 0,
    hasTheoryFr: ch.theoryContentFr !== null && ch.theoryContentFr.length > 0,
    theoryLength: ch.theoryContent?.length ?? 0,
  }));

  const hasTheory = data.filter(d => d.hasTheoryEn).length;
  const total = data.length;

  res.json({
    total,
    withTheory: hasTheory,
    coverage: total > 0 ? Math.round((hasTheory / total) * 100) : 0,
    chapters: data,
  });
});

export default router;
