import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { sendTheoryFeedbackNotification } from '../services/email';

const router = Router();

/**
 * POST /api/student/theory-feedback
 * Submit (or update) thumbs up/down feedback on a theory chapter.
 * Body: { chapterId, rating, comment? }
 */
const theoryFeedbackSchema = z.object({
  chapterId: z.string().uuid(),
  rating: z.enum(['up', 'down']),
  comment: z.string().max(2000).optional(),
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = theoryFeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid feedback payload' });
    return;
  }
  const { chapterId, rating, comment } = parsed.data;
  const userId = req.user!.id;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { id: true, number: true, name: true, name_fr: true },
    });
    if (!chapter) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }

    const feedback = await prisma.tutorFeedback.upsert({
      where: { chapterId_userId: { chapterId, userId } },
      create: { chapterId, userId, source: 'theory', rating, comment: comment || null },
      // Never wipe an existing comment with an empty one — only update rating
      update: { rating, ...(comment ? { comment } : {}) },
    });

    // Track last activity (theory feedback = user activity)
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    // Fire-and-forget notification email to site owner
    sendTheoryFeedbackNotification({
      siteName: 'InspectPractice Canada',
      adminUrl: 'https://inspectpractice.com',
      rating,
      comment: comment || null,
      userEmail: req.user!.email,
      userName: (req.user as { name?: string | null }).name ?? null,
      chapterName: chapter.name,
      chapterId,
    }).catch(() => {});

    res.json({ data: feedback });
  } catch (err) {
    console.error('[Theory Feedback Error]', err);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

/**
 * GET /api/student/theory-feedback/mine?chapterId=
 * Get the current user's feedback for a chapter (restore icon state).
 */
router.get('/mine', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const chapterId = req.query.chapterId as string | undefined;
  if (!chapterId) {
    res.status(400).json({ message: 'chapterId query param is required' });
    return;
  }
  try {
    const feedback = await prisma.tutorFeedback.findUnique({
      where: { chapterId_userId: { chapterId, userId } },
      select: { chapterId: true, rating: true, comment: true },
    });
    res.json({ data: feedback ?? null });
  } catch (err) {
    console.error('[Theory Feedback Error]', err);
    res.status(500).json({ message: 'Failed to load feedback' });
  }
});

export default router;
