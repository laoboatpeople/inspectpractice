/**
 * Public read-only routes — no authentication.
 * Safe for AI crawlers (GPTBot, Perplexity, Claude, Gemini) and SEO tooling.
 * Only metadata (titles/counts) is exposed — NEVER theoryContent or questions.
 */
import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

/**
 * GET /api/public/theory-outline
 * Lightweight curriculum listing (exams + chapters, EN-only).
 * Deliberately excludes theoryContent — the premium content stays auth-gated.
 */
router.get('/theory-outline', async (_req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      orderBy: [{ country: 'asc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        country: true,
        licenseType: true,
        _count: {
          select: {
            chapters: { where: { isActive: true } },
            questions: { where: { status: 'APPROVED' } },
          },
        },
        chapters: {
          where: { isActive: true },
          orderBy: { number: 'asc' },
          select: {
            id: true,
            number: true,
            name: true,
            _count: {
              select: { questions: { where: { status: 'APPROVED' } } },
            },
          },
        },
      },
    });

    const data = exams.map(exam => ({
      id: exam.id,
      code: exam.code,
      name: exam.name,
      description: exam.description,
      country: exam.country,
      licenseType: exam.licenseType,
      chapterCount: exam._count.chapters,
      questionCount: exam._count.questions,
      chapters: exam.chapters.map(ch => ({
        id: ch.id,
        number: ch.number,
        name: ch.name,
        questionCount: ch._count.questions,
      })),
    }));

    res.json({ data });
  } catch (err) {
    console.error('[Public Theory Outline] error:', err);
    res.status(500).json({ message: 'Failed to load curriculum' });
  }
});

/**
 * GET /api/public/theory/:chapterId
 * Full theory content for one chapter — PUBLIC (theory is free on the free plan).
 * Rendered as static HTML pages for AI crawlers (GPTBot, Perplexity, Claude, Gemini).
 */
router.get('/theory/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        number: true,
        name: true,
        theoryContent: true,
        exam: { select: { id: true, code: true, name: true, description: true } },
        _count: { select: { questions: { where: { status: 'APPROVED' } } } },
      },
    });
    if (!chapter) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }
    res.json({
      data: {
        id: chapter.id,
        number: chapter.number,
        name: chapter.name,
        theoryContent: chapter.theoryContent || '',
        questionCount: chapter._count.questions,
        exam: chapter.exam,
      },
    });
  } catch (err) {
    console.error('[Public Theory Chapter] error:', err);
    res.status(500).json({ message: 'Failed to load chapter' });
  }
});

export default router;
