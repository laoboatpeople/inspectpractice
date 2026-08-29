import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN'));

/**
 * GET /api/analytics
 * Admin dashboard stats.
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [
    totalUsers,
    activeSubscriptions,
    totalExamsTaken,
    allAttempts,
    userGrowth,
    questionsByDifficulty,
    passRateByExamRaw,
    topFailedQuestionsRaw,
  ] = await Promise.all([
    // totalUsers
    prisma.user.count(),

    // activeSubscriptions
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),

    // totalExamsTaken
    prisma.examAttempt.count(),

    // all attempts for overall pass rate
    prisma.examAttempt.findMany({ select: { score: true } }),

    // userGrowth: last 30 days
    prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { _all: true },
    }),

    // questionsByDifficulty
    prisma.question.groupBy({
      by: ['difficulty'],
      _count: { _all: true },
    }),

    // passRateByExam
    prisma.exam.findMany({
      select: {
        code: true,
        passingScore: true,
        attempts: { select: { score: true } },
      },
    }),

    // topFailedQuestions: top 10 lowest pass rate
    prisma.question.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        question: true,
        difficulty: true,
        _count: { select: { answers: true } },
        answers: {
          where: { isCorrect: true },
          select: { id: true },
        },
      },
      take: 100,
    }),
  ]);

  // overallPassRate (% attempts with score >= 70)
  const overallPassRate = allAttempts.length > 0
    ? Math.round((allAttempts.filter(a => a.score >= 70).length / allAttempts.length) * 10000) / 100
    : 0;

  // userGrowth: group by date (YYYY-MM-DD)
  const growthMap: Record<string, number> = {};
  for (const row of userGrowth) {
    const dateKey = row.createdAt.toISOString().slice(0, 10);
    growthMap[dateKey] = (growthMap[dateKey] ?? 0) + row._count._all;
  }
  const userGrowthArray = Object.entries(growthMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // questionsByDifficulty: { easy, medium, hard }
  const difficultyMap: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
  for (const row of questionsByDifficulty) {
    const key = row.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    difficultyMap[key] = row._count._all;
  }

  // passRateByExam
  const passRateByExam = passRateByExamRaw.map(exam => {
    const total = exam.attempts.length;
    const passing = exam.attempts.filter(a => a.score >= (exam.passingScore ?? 70)).length;
    return {
      examCode: exam.code,
      passRate: total > 0 ? Math.round((passing / total) * 10000) / 100 : 0,
      totalAttempts: total,
    };
  });

  // topFailedQuestions: lowest pass rate
  const questionStats = topFailedQuestionsRaw.map(q => {
    const total = q._count.answers; // answers = all attempts for this question
    const correct = q.answers.length;
    const passRate = total > 0 ? Math.round((correct / total) * 10000) / 100 : 0;
    return { id: q.id, question: q.question.slice(0, 80), difficulty: q.difficulty, passRate, totalAttempts: total };
  });
  questionStats.sort((a, b) => a.passRate - b.passRate);
  const topFailedQuestions = questionStats.slice(0, 10);

  // revenueByMonth: last 12 months — group active subscriptions by plan per month
  const subsLast12Months = await prisma.subscription.findMany({
    where: {
      createdAt: { gte: twelveMonthsAgo },
      status: 'ACTIVE',
    },
    select: {
      plan: true,
      createdAt: true,
    },
  });
  const revenueMap: Record<string, { month: string; amount: number }> = {};
  for (const sub of subsLast12Months) {
    const monthKey = sub.createdAt.toISOString().slice(0, 7); // YYYY-MM
    if (!revenueMap[monthKey]) {
      revenueMap[monthKey] = { month: monthKey, amount: 0 };
    }
    // Simple count-based "revenue" — you may want to integrate real Stripe amounts
    const planAmount: Record<string, number> = { FREE: 0, MONTHLY: 2999, LIFETIME: 19900 };
    revenueMap[monthKey].amount += planAmount[sub.plan] ?? 0;
  }
  const revenueByMonth = Object.values(revenueMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  res.json({
    totalUsers,
    activeSubscriptions,
    totalExamsTaken,
    overallPassRate,
    userGrowth: userGrowthArray,
    revenueByMonth,
    questionsByDifficulty: difficultyMap,
    passRateByExam,
    topFailedQuestions,
  });
});

/**
 * GET /api/analytics/dashboard
 * Full analytics for the admin dashboard — includes recentActivity.
 * Query: ?days=30
 */
router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  const days = Math.min(365, Math.max(1, parseInt(req.query.days as string) || 30));
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [
    totalUsers,
    activeSubscriptions,
    totalExamsTaken,
    allAttempts,
    userGrowth,
    questionsByDifficulty,
    passRateByExamRaw,
    recentActivityLogs,
    topFailedQuestionsRaw,
    recentExamAttempts,
    recentAnsweredQuestions,
    recentChatSessions,
    activeUsersTodayRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.examAttempt.count(),
    prisma.examAttempt.findMany({ select: { score: true } }),
    // userGrowth for selected period
    prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: { _all: true },
    }),
    prisma.question.groupBy({
      by: ['difficulty'],
      _count: { _all: true },
    }),
    prisma.exam.findMany({
      select: {
        code: true,
        passingScore: true,
        attempts: { select: { score: true } },
      },
    }),
    // recent activity — last 20 entries
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    // topFailedQuestions: top 10 lowest pass rate
    prisma.question.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        question: true,
        difficulty: true,
        _count: { select: { answers: true } },
        answers: {
          where: { isCorrect: true },
          select: { id: true },
        },
      },
      take: 100,
    }),
    // recent exam attempts — last 15 with user + exam info
    prisma.examAttempt.findMany({
      orderBy: { completedAt: 'desc' },
      take: 15,
      include: {
        user: { select: { id: true, name: true, email: true } },
        exam: { select: { code: true, name: true } },
      },
    }),
    // recent answered questions — last 25 individual answers
    prisma.examAttemptQuestion.findMany({
      orderBy: { attempt: { completedAt: 'desc' } },
      take: 25,
      include: {
        question: { select: { id: true, question: true, difficulty: true } },
        attempt: {
          select: {
            completedAt: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    }),
    // recent chat sessions — last 10
    prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } },
      },
    }),
    // active users today (distinct users with exam attempts or chat today)
    prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(DISTINCT u."id")::int as count FROM "users" u
       WHERE EXISTS (SELECT 1 FROM "exam_attempts" ea WHERE ea."user_id" = u."id" AND ea."completed_at" >= $1)
          OR EXISTS (SELECT 1 FROM "chat_sessions" cs WHERE cs."user_id" = u."id" AND cs."updated_at" >= $1)`,
      [new Date(new Date().setHours(0, 0, 0, 0)).toISOString()]
    ).catch(() => [{ count: BigInt(0) }]),
  ]);

  // overallPassRate
  const overallPassRate = allAttempts.length > 0
    ? Math.round((allAttempts.filter(a => a.score >= 70).length / allAttempts.length) * 10000) / 100
    : 0;

  // userGrowth: group by date (YYYY-MM-DD)
  const growthMap: Record<string, number> = {};
  for (const row of userGrowth) {
    const dateKey = row.createdAt.toISOString().slice(0, 10);
    growthMap[dateKey] = (growthMap[dateKey] ?? 0) + row._count._all;
  }
  const userGrowthArray = Object.entries(growthMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // questionsByDifficulty
  const difficultyMap: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
  for (const row of questionsByDifficulty) {
    const key = row.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    difficultyMap[key] = row._count._all;
  }

  // passRateByExam
  const passRateByExam = passRateByExamRaw.map(exam => {
    const total = exam.attempts.length;
    const passing = exam.attempts.filter(a => a.score >= (exam.passingScore ?? 70)).length;
    return {
      examCode: exam.code,
      passRate: total > 0 ? Math.round((passing / total) * 10000) / 100 : 0,
      totalAttempts: total,
    };
  });

  // recentActivity
  const recentActivity = recentActivityLogs.map(log => ({
    id: log.id,
    action: log.action,
    createdAt: log.createdAt.toISOString(),
    user: log.user ? { name: log.user.name, email: log.user.email } : undefined,
    details: log.details as Record<string, unknown> | undefined,
  }));

  // recentExamAttempts — last completed exams with user + exam
  const recentAttempts = recentExamAttempts.map(a => ({
    id: a.id,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctCount: a.correctCount,
    completedAt: a.completedAt.toISOString(),
    user: { id: a.user.id, name: a.user.name, email: a.user.email },
    exam: { code: a.exam.code, name: a.exam.name },
  }));

  // recentAnsweredQuestions — individual answers with user + question
  const recentAnswers = recentAnsweredQuestions.map(aq => ({
    id: aq.id,
    userAnswer: aq.userAnswer,
    isCorrect: aq.isCorrect,
    question: { id: aq.question.id, text: aq.question.question.slice(0, 100), difficulty: aq.question.difficulty },
    user: aq.attempt.user ? { id: aq.attempt.user.id, name: aq.attempt.user.name, email: aq.attempt.user.email } : null,
    completedAt: aq.attempt.completedAt.toISOString(),
  }));

  // recentChatSessions — tutor conversations
  const recentChats = recentChatSessions.map(cs => ({
    id: cs.id,
    topic: cs.topic,
    source: cs.source,
    messageCount: cs._count.messages,
    updatedAt: cs.updatedAt.toISOString(),
    user: { id: cs.user.id, name: cs.user.name, email: cs.user.email },
  }));

  // activeUsersToday
  const activeUsersToday = Number(activeUsersTodayRaw?.[0]?.count ?? 0);

  // topFailedQuestions: lowest pass rate
  const questionStats = topFailedQuestionsRaw.map(q => {
    const total = q._count.answers;
    const correct = q.answers.length;
    const passRate = total > 0 ? Math.round((correct / total) * 10000) / 100 : 0;
    return { id: q.id, question: q.question.slice(0, 80), difficulty: q.difficulty, passRate, totalAttempts: total };
  });
  questionStats.sort((a, b) => a.passRate - b.passRate);
  const topFailedQuestions = questionStats.slice(0, 10);

  // revenueByMonth
  const subsLast12Months = await prisma.subscription.findMany({
    where: { createdAt: { gte: twelveMonthsAgo }, status: 'ACTIVE' },
    select: { plan: true, createdAt: true },
  });
  const revenueMap: Record<string, { month: string; amount: number }> = {};
  for (const sub of subsLast12Months) {
    const monthKey = sub.createdAt.toISOString().slice(0, 7);
    if (!revenueMap[monthKey]) {
      revenueMap[monthKey] = { month: monthKey, amount: 0 };
    }
    const planAmount: Record<string, number> = { FREE: 0, MONTHLY: 2999, LIFETIME: 19900 };
    revenueMap[monthKey].amount += planAmount[sub.plan] ?? 0;
  }
  const revenueByMonth = Object.values(revenueMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  res.json({
    totalUsers,
    activeSubscriptions,
    totalExamsTaken,
    overallPassRate,
    activeUsersToday,
    userGrowth: userGrowthArray,
    revenueByMonth,
    questionsByDifficulty: difficultyMap,
    passRateByExam,
    recentActivity,
    recentAttempts,
    recentAnswers,
    recentChats,
    topFailedQuestions,
  });
});

/**
 * GET /api/analytics/chat-sessions/:id
 * Return a full tutor chat session with all its messages (admin view).
 */
router.get('/chat-sessions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (err) {
    console.error('GET /api/analytics/chat-sessions/:id error:', err);
    res.status(500).json({ message: 'Failed to load chat session' });
  }
});

export default router;