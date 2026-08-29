import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { newsletterLimiter } from '../middleware/rateLimits';
import { sendNewsletterNotification, sendNewsletterConfirmation, sendSampleQuestionsConfirmation } from '../services/email';

const router = Router();

/**
 * GET /api/newsletter/subscribers
 *
 * Admin-only endpoint. Returns all newsletter subscribers.
 * Requires a valid admin Bearer token.
 */
router.get('/subscribers', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
      },
    });

    res.json({ subscribers });
  } catch (err) {
    console.error('[Newsletter] List error:', err);
    res.status(500).json({ error: 'Failed to load subscribers.' });
  }
});

/**
 * POST /api/newsletter/subscribers
 *
 * Admin-only. Manually add a subscriber.
 */
router.post('/subscribers', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: trimmed },
      update: { status: 'ACTIVE' },
      create: { email: trimmed, status: 'ACTIVE' },
    });

    res.json({ success: true, subscriber: subscription });
  } catch (err) {
    console.error('[Newsletter] Create error:', err);
    res.status(500).json({ error: 'Failed to add subscriber.' });
  }
});

/**
 * PATCH /api/newsletter/subscribers/:id
 *
 * Admin-only. Update subscriber status.
 */
router.patch('/subscribers/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'ACTIVE' && status !== 'UNSUBSCRIBED') {
      res.status(400).json({ error: 'Status must be ACTIVE or UNSUBSCRIBED.' });
      return;
    }

    const updated = await prisma.newsletterSubscription.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, subscriber: updated });
  } catch (err) {
    console.error('[Newsletter] Update error:', err);
    res.status(500).json({ error: 'Failed to update subscriber.' });
  }
});

/**
 * DELETE /api/newsletter/subscribers/:id
 *
 * Admin-only. Delete a subscriber.
 */
router.delete('/subscribers/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    await prisma.newsletterSubscription.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('[Newsletter] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete subscriber.' });
  }
});

/**
 * POST /api/newsletter/subscribe
 * GET  /api/newsletter/subscribe?email=x
 *
 * Public endpoint — no auth required.
 * Subscribes an email address to the newsletter.
 * Rate-limited: 5 requests per 15 minutes per IP.
 */
router.all('/subscribe', newsletterLimiter, async (req: Request, res: Response): Promise<void> => {
  const email = req.method === 'GET' ? (req.query.email as string) : req.body?.email;
  const locale = req.body?.locale === 'fr' ? 'fr' : 'en';
  const type = req.body?.type === 'sample-questions' ? 'sample-questions' : 'checklist';

  const invalidEmailMsg = locale === 'fr'
    ? 'Une adresse courriel valide est requise.'
    : 'A valid email address is required.';

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: invalidEmailMsg });
    return;
  }

  const trimmed = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    res.status(400).json({ error: invalidEmailMsg });
    return;
  }

  try {
    // Upsert: if already subscribed, keep the existing record
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: trimmed },
      update: {
        status: 'ACTIVE',
      },
      create: {
        email: trimmed,
        status: 'ACTIVE',
      },
    });

    // Fire-and-forget: notify admin of new subscriber
    sendNewsletterNotification(trimmed).catch((err) =>
      console.error('[Newsletter] Notification send failed:', err)
    );

    // Fire-and-forget: send confirmation to subscriber with the right content
    if (type === 'sample-questions') {
      sendSampleQuestionsConfirmation(trimmed, locale).catch((err) =>
        console.error('[Newsletter] Sample questions send failed:', err)
      );
    } else {
      sendNewsletterConfirmation(trimmed, locale).catch((err) =>
        console.error('[Newsletter] Confirmation send failed:', err)
      );
    }

    const subscribeMessage = locale === 'fr'
      ? 'Vous êtes abonné à la newsletter !'
      : 'You have been subscribed to the newsletter!';

    res.json({
      success: true,
      message: subscribeMessage,
      subscription: {
        id: subscription.id,
        email: subscription.email,
        status: subscription.status,
        subscribedAt: subscription.subscribedAt,
      },
    });
  } catch (err) {
    console.error('[Newsletter] Subscription error:', err);
    const errorMsg = locale === 'fr'
      ? 'Échec de l\'abonnement. Veuillez réessayer plus tard.'
      : 'Failed to subscribe. Please try again later.';

    res.status(500).json({ error: errorMsg });
  }
});

export default router;
