import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { sendSubscriptionNotification, sendPlanChangeConfirmation } from '../services/email';
import stripe from '../config/stripe';

const router = Router();

router.use(authenticate);

// Plan prices in CAD (cents)
const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  MONTHLY: 2999,
  YEARLY: 9900,
  LIFETIME: 19900,
};

/**
 * GET /api/subscriptions
 * Returns dashboard data: stats + paginated subscription list + recent transactions.
 * Query: ?page=1&limit=10&status=ACTIVE&plan=MONTHLY&search=
 */
router.get('/', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    user: { role: { notIn: ['ADMIN', 'INSTRUCTOR'] } },
  };

  if (req.query.status) {
    const validStatuses = ['ACTIVE', 'PAST_DUE', 'CANCELLED'];
    if (validStatuses.includes(req.query.status as string)) {
      where.status = req.query.status;
    }
  }

  if (req.query.plan) {
    const validPlans = ['FREE', 'MONTHLY', 'YEARLY', 'LIFETIME'];
    if (validPlans.includes(req.query.plan as string)) {
      where.plan = req.query.plan;
    }
  }

  // Fetch all subscriptions (for stats) and paginated slice
  // Owner/admin accounts are excluded (they are not real customers).
  const [allSubscriptions, paginatedSubscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where: { user: { role: { notIn: ['ADMIN', 'INSTRUCTOR'] } } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subscription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.subscription.count({ where }),
  ]);

  // Compute stats
  const totalActive = allSubscriptions.filter((s) => s.status === 'ACTIVE').length;
  const activeSubscriptions = allSubscriptions.filter((s) => s.status === 'ACTIVE');
  const monthlySubs = activeSubscriptions.filter((s) => s.plan === 'MONTHLY').length;
  const yearlySubs = activeSubscriptions.filter((s) => s.plan === 'YEARLY').length;
  const lifetimeSubs = activeSubscriptions.filter((s) => s.plan === 'LIFETIME').length;
  const monthlyRevenue = (monthlySubs * PLAN_PRICES.MONTHLY) / 100;
  const yearlyRevenue = (yearlySubs * PLAN_PRICES.YEARLY + lifetimeSubs * PLAN_PRICES.LIFETIME) / 100;
  const totalCancelled = allSubscriptions.filter((s) => s.status === 'CANCELLED').length;
  const churnRate = allSubscriptions.length > 0
    ? Math.round((totalCancelled / allSubscriptions.length) * 10000) / 100
    : 0;

  // Transform subscriptions to frontend format
  const subscriptions = paginatedSubscriptions.map((sub) => ({
    id: sub.id,
    userId: sub.userId,
    user: { name: sub.user.name, email: sub.user.email },
    plan: sub.plan as 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME',
    status: sub.status,
    startedAt: sub.currentPeriodStart.toISOString(),
    renewsAt: sub.currentPeriodEnd.toISOString(),
    amount: (PLAN_PRICES[sub.plan] ?? 0) / 100,
    cancelAtPeriodEnd: false,
  }));

  // Recent transactions: derive from activity logs about subscriptions
  const txPage = Math.max(1, parseInt(req.query.txPage as string) || 1);
  const txLimit = Math.min(50, Math.max(1, parseInt(req.query.txLimit as string) || 10));
  const txSkip = (txPage - 1) * txLimit;

  const txWhere = {
    action: {
      in: ['SUBSCRIPTION_CREATED', 'SUBSCRIPTION_UPDATED', 'PAYMENT_SUCCEEDED', 'PAYMENT_FAILED'],
    },
  };

  const [txTotalCount, activityLogs] = await Promise.all([
    prisma.activityLog.count({ where: txWhere }),
    prisma.activityLog.findMany({
      where: txWhere,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: txSkip,
      take: txLimit,
    }),
  ]);

  const transactions = activityLogs.map((log) => {
    let status: 'succeeded' | 'pending' | 'failed' = 'pending';
    if (log.action === 'PAYMENT_SUCCEEDED' || log.action === 'SUBSCRIPTION_CREATED') status = 'succeeded';
    if (log.action === 'PAYMENT_FAILED') status = 'failed';
    const details = log.details as Record<string, unknown> | null;
    return {
      id: log.id,
      userId: log.userId ?? '',
      user: log.user ? { name: log.user.name, email: log.user.email } : { name: 'Unknown', email: '' },
      plan: (details?.plan as string ?? 'FREE') as 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME',
      amount: (PLAN_PRICES[details?.plan as string ?? 'FREE'] ?? 0) / 100,
      status,
      createdAt: log.createdAt.toISOString(),
    };
  });

  res.json({
    totalActive,
    monthlyRevenue,
    yearlyRevenue,
    churnRate,
    subscriptions,
    transactions,
    totalCount: total,
    page,
    totalPages: Math.ceil(total / limit),
    txTotalCount,
    txPage,
    txTotalPages: Math.ceil(txTotalCount / txLimit),
  });
});

/**
 * GET /api/subscriptions/:id
 * Get a single subscription.
 */
router.get('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!subscription) {
    res.status(404).json({ message: 'Subscription not found' });
    return;
  }

  res.json(subscription);
});

/**
 * POST /api/subscriptions
 * Create or update a subscription manually (admin override).
 * Used when Stripe webhook is delayed or for free-tier upgrades.
 */
router.post('/', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    userId: z.string().uuid(),
    plan: z.enum(['FREE', 'MONTHLY', 'YEARLY', 'LIFETIME']),
    stripeCustomerId: z.string().optional(),
    stripeSubId: z.string().optional(),
    currentPeriodStart: z.string().datetime().optional(),
    currentPeriodEnd: z.string().datetime().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const now = new Date();
  const periodStart = parsed.data.currentPeriodStart
    ? new Date(parsed.data.currentPeriodStart)
    : now;

  const periodEnd = parsed.data.currentPeriodEnd
    ? new Date(parsed.data.currentPeriodEnd)
    : (parsed.data.plan === 'MONTHLY'
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000));

  // Upsert: update if active sub exists for user, otherwise create
  const existing = await prisma.subscription.findFirst({
    where: { userId: parsed.data.userId, status: 'ACTIVE' },
  });

  const data = {
    userId: parsed.data.userId,
    plan: parsed.data.plan,
    status: 'ACTIVE' as const,
    stripeCustomerId: parsed.data.stripeCustomerId ?? null,
    stripeSubId: parsed.data.stripeSubId ?? null,
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
  };

  const subscription = existing
    ? await prisma.subscription.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.subscription.create({ data });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SUBSCRIPTION_CREATED',
      details: { subscriptionId: subscription.id, plan: subscription.plan, userId: subscription.userId },
      ipAddress: req.socket.remoteAddress,
    },
  });

  // Send confirmation email to the user
  sendPlanChangeConfirmation(user.email, user.name, subscription.plan, existing?.plan ?? 'FREE').catch(() => {});

  res.status(201).json(subscription);
});

/**
 * PUT /api/subscriptions/:id
 * Update plan or status (admin override).
 */
router.put('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    plan: z.enum(['FREE', 'MONTHLY', 'YEARLY', 'LIFETIME']).optional(),
    status: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELLED']).optional(),
    currentPeriodEnd: z.string().datetime().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const existing = await prisma.subscription.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ message: 'Subscription not found' });
    return;
  }

  const updated = await prisma.subscription.update({
    where: { id: req.params.id },
    data: {
      ...(parsed.data.plan && { plan: parsed.data.plan }),
      ...(parsed.data.status && { status: parsed.data.status }),
      ...(parsed.data.currentPeriodEnd && { currentPeriodEnd: new Date(parsed.data.currentPeriodEnd) }),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SUBSCRIPTION_UPDATED',
      details: { subscriptionId: req.params.id, changes: parsed.data },
      ipAddress: req.socket.remoteAddress,
    },
  });

  // Send confirmation email to the user if plan changed
  if (parsed.data.plan && parsed.data.plan !== existing.plan && updated.user) {
    sendPlanChangeConfirmation(updated.user.email, updated.user.name, parsed.data.plan, existing.plan).catch(() => {});
  }

  res.json(updated);
});

/**
 * POST /api/subscriptions/me/cancel
 * Cancel the current user's own subscription.
 */
router.post('/me/cancel', async (req: Request, res: Response): Promise<void> => {
  const subscription = await prisma.subscription.findFirst({
    where: { userId: req.user!.id, status: 'ACTIVE' },
  });

  if (!subscription) {
    res.status(404).json({ message: 'No active subscription to cancel' });
    return;
  }

  // Cancel in Stripe first (best-effort, continue even if fails)
  if (subscription.stripeSubId && stripe) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubId);
      console.log(`[Stripe] Subscription ${subscription.stripeSubId} cancelled via API`);
    } catch (err: any) {
      console.warn(`[Stripe] Failed to cancel subscription ${subscription.stripeSubId}: ${err.message}`);
    }
  } else if (!subscription.stripeSubId) {
    console.log('[Stripe] No stripeSubId on subscription — skipping Stripe cancel');
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'CANCELLED' },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SUBSCRIPTION_CANCELLED',
      details: { subscriptionId: subscription.id, plan: subscription.plan },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Subscription cancelled' });
});

/**
 * DELETE /api/subscriptions/:id
 * Cancel a subscription (soft — sets status to CANCELLED). Admin only.
 */
router.delete('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const subscription = await prisma.subscription.findUnique({ where: { id: req.params.id } });
  if (!subscription) {
    res.status(404).json({ message: 'Subscription not found' });
    return;
  }

  // Cancel in Stripe first (best-effort, continue even if fails)
  if (subscription.stripeSubId && stripe) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubId);
      console.log(`[Stripe] Subscription ${subscription.stripeSubId} cancelled via API (admin)`);
    } catch (err: any) {
      console.warn(`[Stripe] Failed to cancel subscription ${subscription.stripeSubId}: ${err.message}`);
    }
  }

  await prisma.subscription.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SUBSCRIPTION_CANCELLED',
      details: { subscriptionId: req.params.id, userId: subscription.userId },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Subscription cancelled' });
});

export default router;
