import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { chatService } from '../services/chat.service';
import { prisma } from '../config/database';
import { dbIdSchema } from '../config/dbId';
import { sendTutorFeedbackNotification } from '../services/email';

const router = Router();

const FREE_TUTOR_MESSAGE_LIMIT = 50;

// All chat routes require authentication
router.use(authenticate);

// ─── POST /api/chat ────────────────────────────────────────────
// Send a message and get AI response

const sendSchema = z.object({
  message: z.string().min(1).max(2000),
  examId: dbIdSchema.optional(),
  chapterId: dbIdSchema.optional(),
  sessionId: z.string().uuid().optional(),
  locale: z.string().optional(),
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', errors: parsed.error.errors });
    return;
  }

  const { message, examId, chapterId, sessionId, locale } = parsed.data;
  const userId = req.user!.id;

  try {
    // FREE-plan cap: users without an active paid (MONTHLY/LIFETIME) subscription
    // are limited to FREE_TUTOR_MESSAGE_LIMIT tutor messages.
    const paidSub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE', plan: { in: ['MONTHLY', 'LIFETIME'] } },
      select: { id: true },
    });
    if (!paidSub) {
      const messageCount = await prisma.chatMessage.count({
        where: { role: 'user', session: { userId, source: 'tutor' } },
      });
      if (messageCount >= FREE_TUTOR_MESSAGE_LIMIT) {
        res.status(403).json({
          code: 'TUTOR_LIMIT_REACHED',
          message: 'Free plan limit reached',
          limit: FREE_TUTOR_MESSAGE_LIMIT,
          count: messageCount,
        });
        return;
      }
    }

    // If sessionId provided, verify ownership
    if (sessionId) {
      const existing = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
      if (!existing) {
        res.status(403).json({ message: 'Session not found or access denied' });
        return;
      }
    }

    const { reply, sessionId: newSessionId, userMessageId, assistantMessageId } = await chatService.sendMessage({
      userId,
      examId,
      chapterId,
      message,
      sessionId: sessionId ?? undefined,
      locale: locale ?? 'en',
    });

    // Track last activity (tutor question = user activity)
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    res.json({ reply, sessionId: newSessionId, userMessageId, assistantMessageId });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
});

// ─── GET /api/chat ─────────────────────────────────────────────
// Get all chat sessions for current user

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const sessions = await chatService.getSessions(userId);
    res.json({ data: sessions });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ message: 'Failed to load chat sessions' });
  }
});

// ─── POST /api/chat/feedback ─────────────────────────────────
// Submit (or update) thumbs up/down feedback on an AI tutor message

const feedbackSchema = z.object({
  chatMessageId: z.string().uuid(),
  rating: z.enum(['up', 'down']),
  comment: z.string().max(2000).optional(),
});

router.post('/feedback', async (req: Request, res: Response): Promise<void> => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid feedback payload' });
    return;
  }
  const { chatMessageId, rating, comment } = parsed.data;
  const userId = req.user!.id;

  try {
    // The message must belong to a chat session owned by this user
    const message = await prisma.chatMessage.findFirst({
      where: { id: chatMessageId, session: { userId } },
      select: { id: true, content: true, session: { select: { topic: true } } },
    });
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    const feedback = await prisma.tutorFeedback.upsert({
      where: { chatMessageId_userId: { chatMessageId, userId } },
      create: { chatMessageId, userId, rating, comment: comment || null },
      // Never wipe an existing comment with an empty one — only update rating
      update: { rating, ...(comment ? { comment } : {}) },
    });

    // Track last activity (tutor feedback = user activity)
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    // Fire-and-forget notification email to site owner
    sendTutorFeedbackNotification({
      siteName: 'InspectPractice Canada',
      adminUrl: 'https://inspectpractice.com',
      rating,
      comment: comment || null,
      userEmail: req.user!.email,
      userName: (req.user as { name?: string | null }).name ?? null,
      messagePreview: message.content,
      sessionTopic: message.session.topic,
    }).catch(() => {});

    res.json({ data: feedback });
  } catch (err) {
    console.error('[Chat Feedback Error]', err);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

// ─── GET /api/chat/feedback?sessionId= ────────────────────────
// Get the current user's feedback for a session (restore icon state)

router.get('/feedback', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const sessionId = req.query.sessionId as string | undefined;
  if (!sessionId) {
    res.status(400).json({ message: 'sessionId query param is required' });
    return;
  }
  try {
    const feedbacks = await prisma.tutorFeedback.findMany({
      where: { userId, message: { sessionId } },
      select: { chatMessageId: true, rating: true, comment: true },
    });
    res.json({ data: feedbacks });
  } catch (err) {
    console.error('[Chat Feedback Error]', err);
    res.status(500).json({ message: 'Failed to load feedback' });
  }
});

// ─── GET /api/chat/:sessionId ─────────────────────────────────
// Get message history for a session

router.get('/:sessionId', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { sessionId } = req.params;

  try {
    const messages = await chatService.getHistory(sessionId, userId);
    res.json({ data: messages });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ message: 'Failed to load chat history' });
  }
});

// ─── DELETE /api/chat/:sessionId ───────────────────────────────
// Delete a chat session

router.delete('/:sessionId', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { sessionId } = req.params;

  try {
    const deleted = await chatService.deleteSession(sessionId, userId);
    if (!deleted) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

export default router;
