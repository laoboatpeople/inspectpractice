import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { sendPlanChangeConfirmation } from '../services/email';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users
 * List all users with pagination and optional role filter.
 * Query: ?page=1&limit=20&role=STUDENT&search=john
 */
router.get('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;
  const subscription = req.query.subscription as string | undefined;
  const sort = (req.query.sort as string) || 'createdAt';
  const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

  const allowedSorts = ['createdAt', 'name', 'email', 'role'];
  const sortField = allowedSorts.includes(sort) ? sort : 'createdAt';

  const where: any = {};
  if (role && ['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(role)) {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (subscription && ['FREE', 'MONTHLY', 'LIFETIME'].includes(subscription)) {
    // FREE: users with plan=FREE OR users with no subscription record at all
    if (subscription === 'FREE') {
      where.OR = [
        { subscriptions: { some: { plan: 'FREE' } } },
        { subscriptions: { none: {} } },
      ];
    } else {
      where.subscriptions = { some: { plan: subscription } };
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortField]: order },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastActiveAt: true,
        createdAt: true,
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { examAttempts: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  // Transform to match frontend User type (subscription: single object, not array)
  const transformedUsers = users.map(u => ({
    ...u,
    subscription: u.subscriptions[0] ?? null,
    subscriptions: undefined,
  }));

  res.json({
    data: transformedUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

/**
 * GET /api/users/:id
 * Get a single user's full profile including exam history and stats.
 */
router.get('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { examAttempts: true },
      },
    },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // ── Exam progress: per-exam stats for progress dashboard ──
  const allAttempts = await prisma.examAttempt.findMany({
    where: { userId: id },
    include: {
      exam: { select: { id: true, code: true, name: true, passingScore: true } },
    },
    orderBy: { completedAt: 'desc' },
  });

  const totalAttempts = allAttempts.length;
  const avgScore = totalAttempts > 0
    ? allAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
    : null;

  const passingAttempts = allAttempts.filter(a => a.exam.passingScore != null && a.score >= a.exam.passingScore).length;
  const passRate = totalAttempts > 0 ? (passingAttempts / totalAttempts) * 100 : null;

  // Group by exam for per-exam progress
  const examMap = new Map<string, {
    examId: string;
    examCode: string;
    examName: string;
    passingScore: number;
    totalAttempts: number;
    bestScore: number;
    avgScore: number;
    lastScore: number;
    lastPassed: boolean;
    trend: 'up' | 'down' | 'stable';
    recentScores: { score: number; passed: boolean; completedAt: string }[];
  }>();

  for (const a of allAttempts) {
    if (!examMap.has(a.examId)) {
      examMap.set(a.examId, {
        examId: a.examId,
        examCode: a.exam.code,
        examName: a.exam.name,
        passingScore: a.exam.passingScore,
        totalAttempts: 0,
        bestScore: 0,
        avgScore: 0,
        lastScore: 0,
        lastPassed: false,
        trend: 'stable',
        recentScores: [],
      });
    }
    const g = examMap.get(a.examId)!;
    g.totalAttempts++;
    if (a.score > g.bestScore) g.bestScore = a.score;
    g.lastScore = a.score;
    g.lastPassed = a.exam.passingScore != null && a.score >= a.exam.passingScore;
    g.recentScores.push({
      score: a.score,
      passed: a.exam.passingScore != null && a.score >= a.exam.passingScore,
      completedAt: a.completedAt.toISOString(),
    });
  }

  // Compute avg + trend per exam
  for (const [, g] of examMap) {
    const scores = g.recentScores.map(s => s.score);
    g.avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (scores.length >= 2) {
      const delta = scores[0] - scores[scores.length - 1]; // newest - oldest
      g.trend = delta > 2 ? 'up' : delta < -2 ? 'down' : 'stable';
    }
  }

  const examProgress = Array.from(examMap.values()).sort((a, b) => b.totalAttempts - a.totalAttempts);

  // recentActivity: last 10 ActivityLog entries
  const recentActivity = await prisma.activityLog.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      action: true,
      details: true,
      ipAddress: true,
      createdAt: true,
    },
  });

  // examAttempts: last 5 with exam name
  const examAttemptsLast5 = allAttempts.slice(0, 5).map(a => ({
    id: a.id,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctCount: a.correctCount,
    timeSpent: a.timeSpent,
    completedAt: a.completedAt,
    examCode: a.exam.code,
    examName: a.exam.name,
    examId: a.examId,
  }));

  // ── Admin-only metrics: logins, billing, customer value, risk signals ──
  const PLAN_AMOUNTS: Record<string, number> = { FREE: 0, MONTHLY: 29.99, LIFETIME: 199.00 };

  const loginLogs = await prisma.activityLog.findMany({
    where: { userId: id, action: 'LOGIN' },
    orderBy: { createdAt: 'desc' },
    select: { ipAddress: true, createdAt: true, details: true },
  });
  const uniqueIps = Array.from(new Set(loginLogs.map(l => l.ipAddress).filter(Boolean)));
  const lastLoginAt = loginLogs.length > 0 ? loginLogs[0].createdAt : null;

  const checkoutLogs = await prisma.activityLog.findMany({
    where: { userId: id, action: 'CHECKOUT_SESSION_CREATED' },
    orderBy: { createdAt: 'desc' },
    select: { details: true, createdAt: true },
  });
  const cancelLogs = await prisma.activityLog.findMany({
    where: { userId: id, action: 'SUBSCRIPTION_CANCELLED' },
    orderBy: { createdAt: 'desc' },
    select: { details: true, createdAt: true },
  });

  const subscriptionHistory = await prisma.subscription.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, plan: true, status: true, currentPeriodStart: true, currentPeriodEnd: true, createdAt: true },
  });

  const estimatedRevenue = subscriptionHistory.reduce((sum, s) => {
    return sum + (PLAN_AMOUNTS[s.plan ?? ''] ?? 0);
  }, 0);

  const now = new Date();
  const daysSinceLastLogin = lastLoginAt
    ? Math.floor((now.getTime() - new Date(lastLoginAt).getTime()) / 86400000)
    : null;
  const daysSinceSignup = Math.floor((now.getTime() - new Date(user.createdAt).getTime()) / 86400000);
  const currentSub = user.subscriptions[0] ?? null;

  const riskSignals: { level: 'high' | 'medium' | 'low'; label: string }[] = [];
  if (!user.isActive) riskSignals.push({ level: 'high', label: 'Compte suspendu' });
  if (currentSub?.status === 'PAST_DUE') riskSignals.push({ level: 'high', label: 'Paiement en retard' });
  if (currentSub?.status === 'CANCELLED') riskSignals.push({ level: 'medium', label: 'Abonnement annulé' });
  if (daysSinceLastLogin !== null && daysSinceLastLogin > 30) riskSignals.push({ level: 'medium', label: `Inactif depuis ${daysSinceLastLogin}j` });
  if (totalAttempts === 0 && daysSinceSignup > 7) riskSignals.push({ level: 'low', label: 'Aucun examen après 7j' });
  if (loginLogs.length === 0 && daysSinceSignup > 3) riskSignals.push({ level: 'low', label: 'Jamais connecté' });

  const adminMetrics = {
    logins: {
      total: loginLogs.length,
      lastAt: lastLoginAt,
      uniqueIps: uniqueIps.length,
      recent: loginLogs.slice(0, 5).map(l => ({
        ip: l.ipAddress,
        at: l.createdAt,
        method: (l.details as Record<string, unknown>)?.method ?? null,
      })),
    },
    billing: {
      checkouts: subscriptionHistory.map(s => ({
        plan: s.plan ?? null,
        at: s.createdAt,
      })),
      cancellations: cancelLogs.map(c => ({ at: c.createdAt })),
      estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
      subscriptionHistory,
    },
    risk: {
      signals: riskSignals,
      daysSinceLastLogin,
      daysSinceSignup,
    },
  };

  // ── Student dashboard view (mirrors /api/student/stats) so admin sees the same content ──
  const totalExams = await prisma.exam.count({ where: { isActive: true } });

  const averageScore = totalAttempts > 0
    ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;
  const passedAttemptsCount = allAttempts.filter(a => a.score >= (a.exam.passingScore ?? 70)).length;
  const dashPassRate = totalAttempts > 0 ? Math.round((passedAttemptsCount / totalAttempts) * 100) : 0;

  const byExamMap = new Map<string, {
    examId: string;
    examCode: string;
    examName: string;
    totalAttempts: number;
    scores: number[];
    passedCount: number;
  }>();
  for (const a of allAttempts) {
    if (!byExamMap.has(a.examId)) {
      byExamMap.set(a.examId, {
        examId: a.examId,
        examCode: a.exam.code,
        examName: a.exam.name,
        totalAttempts: 0,
        scores: [],
        passedCount: 0,
      });
    }
    const e = byExamMap.get(a.examId)!;
    e.totalAttempts++;
    e.scores.push(a.score);
    if (a.score >= (a.exam.passingScore ?? 70)) e.passedCount++;
  }
  const byExam = Array.from(byExamMap.values()).map(e => {
    const total = e.scores.length;
    const avg = Math.round(e.scores.reduce((s, v) => s + v, 0) / total);
    return {
      examId: e.examId,
      examCode: e.examCode,
      examName: e.examName,
      totalAttempts: e.totalAttempts,
      averageScore: avg,
      bestScore: Math.max(...e.scores),
      lastScore: e.scores[e.scores.length - 1],
      passedCount: e.passedCount,
      passRate: Math.round((e.passedCount / total) * 100),
    };
  }).sort((a, b) => b.totalAttempts - a.totalAttempts);

  // study streak: consecutive days with at least one attempt
  let studyStreak = 0;
  if (allAttempts.length > 0) {
    const dates = [...new Set(allAttempts.map(a => a.completedAt.toISOString().split('T')[0]))].sort().reverse();
    let checkDate = dates[0];
    let i = 0;
    while (i < dates.length) {
      if (dates[i] === checkDate) {
        studyStreak++;
        const d = new Date(checkDate);
        d.setDate(d.getDate() - 1);
        checkDate = d.toISOString().split('T')[0];
        i++;
      } else if (dates[i] < checkDate) {
        break;
      } else {
        i++;
      }
    }
  }

  const recentAttempts = allAttempts.slice(0, 10).map(a => ({
    id: a.id,
    examId: a.examId,
    examName: a.exam.name,
    examCode: a.exam.code,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctCount: a.correctCount,
    timeSpent: a.timeSpent,
    passed: a.score >= (a.exam.passingScore ?? 70),
    completedAt: a.completedAt.toISOString(),
  }));

  const bestScore = totalAttempts > 0 ? Math.max(...allAttempts.map(a => a.score)) : 0;
  const examsPassedUnique = Array.from(byExamMap.values()).filter(e => e.passedCount > 0).length;
  const totalQuestionsAnswered = allAttempts.reduce((s, a) => s + a.totalQuestions, 0);
  const totalCorrect = allAttempts.reduce((s, a) => s + a.correctCount, 0);
  const lastAttemptAt = totalAttempts > 0 ? allAttempts[0].completedAt.toISOString() : null;

  let momentum = 0;
  if (totalAttempts >= 6) {
    const last3 = allAttempts.slice(0, 3);
    const prev3 = allAttempts.slice(3, 6);
    const lastAvg = last3.reduce((s, a) => s + a.score, 0) / 3;
    const prevAvg = prev3.reduce((s, a) => s + a.score, 0) / 3;
    momentum = Math.round(lastAvg - prevAvg);
  } else if (totalAttempts >= 2) {
    const rest = allAttempts.slice(1);
    const restAvg = rest.reduce((s, a) => s + a.score, 0) / rest.length;
    momentum = Math.round(allAttempts[0].score - restAvg);
  }

  const dashboardStats = {
    totalExams,
    totalAttempts,
    averageScore,
    passRate: dashPassRate,
    studyStreak,
    byExam,
    recentAttempts,
    bestScore,
    examsPassedUnique,
    totalQuestionsAnswered,
    totalCorrect,
    momentum,
    lastAttemptAt,
  };

  // ── Recent tutor chat sessions (admin view) ──
  const chatSessions = await prisma.chatSession.findMany({
    where: { userId: id },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      topic: true,
      source: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  res.json({
    ...user,
    subscription: user.subscriptions[0] ?? null,
    examAttemptsCount: user._count.examAttempts,
    avgScore: avgScore !== null ? Math.round(avgScore * 100) / 100 : null,
    passRate: passRate !== null ? Math.round(passRate * 100) / 100 : null,
    studyStreak,
    recentActivity,
    examAttempts: examAttemptsLast5,
    examProgress,
    adminMetrics,
    dashboardStats,
    chatSessions,
  });
});

/**
 * PUT /api/users/me
 * User updates their own name and email.
 */
router.put('/me', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const bodySchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  // Check email uniqueness if changed
  if (parsed.data.email) {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== userId) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.json({ user: updated });
});

/**
 * PUT /api/users/:id
 * Update name, role, or isActive. Password change is separate.
 */
router.put('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const updateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT']).optional(),
    isActive: z.boolean().optional(),
  });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'USER_UPDATED',
      details: { targetId: id, changes: parsed.data },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

/**
 * PUT /api/users/:id/password
 * Admin resets a user's password.
 */
router.put('/:id/password', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const bodySchema = z.object({
    newPassword: z.string().min(8),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id },
    data: { passwordHash },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'PASSWORD_RESET',
      details: { targetId: id },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Password updated' });
});

/**
 * PUT /api/users/:id/subscription
 * Update a user's subscription plan.
 */
router.put('/:id/subscription', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const bodySchema = z.object({
    plan: z.enum(['FREE', 'MONTHLY', 'LIFETIME']).optional(),
    status: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELLED']).optional(),
    currentPeriodStart: z.string().optional(),
    currentPeriodEnd: z.string().optional(),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  if (!parsed.data.plan && !parsed.data.status) {
    res.status(400).json({ message: 'At least plan or status must be provided' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Capture old plan before changes
  const oldSub = await prisma.subscription.findFirst({
    where: { userId: id, status: 'ACTIVE' },
  });
  const oldPlan = oldSub?.plan ?? 'FREE';

  // Cancel existing active subscriptions
  await prisma.subscription.updateMany({
    where: { userId: id, status: 'ACTIVE' },
    data: { status: 'CANCELLED' },
  });

  let subscription = null;

  // Only create a new subscription record for paid plans
  // FREE = no subscription record (frontend treats null as FREE)
  if (parsed.data.plan && parsed.data.plan !== 'FREE') {
    const now = new Date();
    const periodEnd = parsed.data.plan === 'MONTHLY'
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    subscription = await prisma.subscription.create({
      data: {
        userId: id,
        plan: parsed.data.plan,
        status: parsed.data.status ?? 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SUBSCRIPTION_UPDATED',
      details: { targetId: id, plan: parsed.data.plan },
      ipAddress: req.socket.remoteAddress,
    },
  });

  // Send confirmation email to the user if plan changed
  const newPlan = parsed.data.plan ?? 'FREE';
  if (newPlan !== oldPlan) {
    sendPlanChangeConfirmation(user.email, user.name, newPlan, oldPlan).catch(() => {});
  }

  res.json(subscription);
});

/**
 * PUT /api/users/me/password
 * User changes their own password.
 */
router.put('/me/password', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const bodySchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PASSWORD_CHANGED',
      details: {},
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Password updated successfully' });
});

/**
 * DELETE /api/users/me
 * Self-deletion — permanently deletes the current user's account.
 */
router.delete('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  await prisma.$transaction([
    prisma.examAttempt.deleteMany({ where: { userId } }),
    prisma.examAttemptQuestion.deleteMany({ where: { attempt: { userId } } }),
    prisma.chatMessage.deleteMany({ where: { session: { userId } } }),
    prisma.chatSession.deleteMany({ where: { userId } }),
    prisma.activityLog.deleteMany({ where: { userId } }),
    prisma.subscription.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  res.json({ message: 'Account permanently deleted' });
});



/**
 * DELETE /api/users/:id
 * Permanently deletes the user from the database.
 */
router.delete('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (id === req.user!.id) {
    res.status(400).json({ message: 'Cannot delete your own account' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  await prisma.user.delete({ where: { id } });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'USER_DELETED',
      details: { targetId: id, targetEmail: user.email, targetName: user.name },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'User deactivated' });
});

/**
 * POST /api/users/:id/impersonate
 * Mint a short-lived JWT (1h) for the target user so an admin can view
 * their /app dashboard exactly as the user sees it.
 */
router.post('/:id/impersonate', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    const target = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!target) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const token = jwt.sign(
      { id: target.id, email: target.email, role: target.role, impersonating: true },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: target });
  } catch (err) {
    console.error('[Admin] Impersonate error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
