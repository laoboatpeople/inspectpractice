import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { Difficulty, QStatus } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { aiService } from '../services/ai.service';

const router = Router();

/**
 * Resolve the correct option index from a question's correctAnswer.
 * Handles both storage formats found in the DB:
 *  - full option text  ("A decrease in compressor efficiency")
 *  - letter            ("B", "Option B") when options are prefixed ("B) A decrease...")
 * Returns -1 when no match is found.
 */
function resolveCorrectIndex(correctAnswer: string | null | undefined, options: string[] | null | undefined): number {
  if (!options || options.length === 0 || !correctAnswer) return -1;
  const answer = String(correctAnswer).trim();

  // Case 1: correctAnswer is the full option text (exact match)
  const exact = options.indexOf(answer);
  if (exact !== -1) return exact;

  // Case 2: correctAnswer is a letter (e.g. "B", "Option B", "B)") while options are prefixed ("B) text")
  const letterMatch = answer.match(/^(?:option\s*)?([A-H])\s*[).:]?$/i);
  if (letterMatch) {
    const letter = letterMatch[1].toUpperCase();
    const idx = options.findIndex((o) => {
      const m = String(o).trim().match(/^([A-H])\s*[).:]\s*/i);
      return m ? m[1].toUpperCase() === letter : false;
    });
    if (idx !== -1) return idx;

    // Case 3: letter answer with unprefixed options → letter position maps to index (A=0, B=1, ...)
    const position = letter.charCodeAt(0) - 65;
    if (position >= 0 && position < options.length) return position;
  }

  return -1;
}

/**
 * GET /api/student/exam-categories
 * List active exams (exam categories) available to students.
 * Free plan users see only 1 exam category; paid plan users see all.
 * Requires authentication.
 * Returns: { data: Exam[] }
 */
router.get('/exam-categories', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const locale = (req.query.locale as string) || 'en';
  const useFr = locale === 'fr';

  // Look up the user's subscription to determine their plan
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: { plan: true },
  });

  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'INSTRUCTOR';
  const isFreePlan = !isAdmin && (subscription?.plan ?? 'FREE') === 'FREE';

  let exams = await prisma.exam.findMany({
    where: { isActive: true },
    orderBy: [{ country: 'asc' }, { displayOrder: 'asc' }],
    select: {
      id: true,
      code: true,
      name: true,
      name_fr: true,
      description: true,
      description_fr: true,
      country: true,
      licenseType: true,
      displayOrder: true,
      timeLimit: true,
      passingScore: true,
      questionsPerSimulation: true,
      randomizeOrder: true,
      _count: {
        select: {
          chapters: { where: { isActive: true } },
          questions: { where: { status: 'APPROVED' } },
        },
      },
    },
  });

  // Sort by displayOrder so FREE plan unlocks the entry exam (ICC-B1)
  exams.sort((a, b) => a.displayOrder - b.displayOrder || a.code.localeCompare(b.code));

  // Free plan: only first category is unlocked; mark others as locked
  const data = exams.map((exam, index) => ({
    id: exam.id,
    code: exam.code,
    name: useFr && exam.name_fr ? exam.name_fr : exam.name,
    description: useFr && exam.description_fr ? exam.description_fr : exam.description,
    country: exam.country,
    licenseType: exam.licenseType,
    timeLimit: exam.timeLimit,
    passingScore: exam.passingScore,
    questionsPerSimulation: exam.questionsPerSimulation,
    randomizeOrder: exam.randomizeOrder,
    chapterCount: exam._count.chapters,
    questionCount: exam._count.questions,
    locked: isFreePlan && index > 0,
    // Official exam simulation (mode=exam) is always paid for FREE users
    simulationLocked: isFreePlan,
  }));

  res.json({ data });
});

// ─── Public endpoints (no auth required) ─────────────────────────

/**
 * GET /api/student/exam-categories/:examId/chapters
 * List all active chapters for a specific exam.
 * Returns: { data: Chapter[] }
 */
router.get('/exam-categories/:examId/chapters', async (req: Request, res: Response): Promise<void> => {
  const { examId } = req.params;
  const locale = (req.query.locale as string) || 'en';
  const useFr = locale === 'fr';

  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  const chapters = await prisma.chapter.findMany({
    where: { examId, isActive: true },
    orderBy: { number: 'asc' },
    select: {
      id: true,
      number: true,
      name: true,
      name_fr: true,
      syllabusRef: true,
      licenseScope: true,
      _count: {
        select: { questions: { where: { status: 'APPROVED' } } },
      },
    },
  });

  const data = chapters.map(chapter => ({
    id: chapter.id,
    number: chapter.number,
    name: useFr && chapter.name_fr ? chapter.name_fr : chapter.name,
    questionCount: chapter._count.questions,
    syllabusRef: chapter.syllabusRef ?? null,
    licenseScope: chapter.licenseScope ?? 'SHARED',
  }));

  res.json({ data });
});

/**
 * GET /api/student/chapters/:chapterId/questions
 * List all approved questions for a specific chapter.
 * Returns: { data: Question[] }
 */
router.get('/chapters/:chapterId/questions', async (req: Request, res: Response): Promise<void> => {
  const { chapterId } = req.params;

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  const questions = await prisma.question.findMany({
    where: { chapterId, status: 'APPROVED' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      type: true,
      difficulty: true,
      question: true,
      options: true,
    },
  });

  res.json({ data: questions });
});

/**
 * GET /api/student/exams/:examId/quiz?count=10
 * Get a practice quiz with random approved questions for an exam.
 * Returns questions with correctAnswer included (for immediate grading).
 * This is a PRACTICE exam so answers are shown after submission.
 * Query: count=10 (number of questions, default 10)
 */
router.get('/exams/:examId/quiz', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { examId } = req.params;
  const count = Math.min(200, Math.max(1, parseInt(req.query.count as string) || 10));
  const locale = (req.query.locale as string) || 'en';
  const useFr = locale === 'fr';
  const difficulty = ['EASY', 'MEDIUM', 'HARD'].includes((req.query.difficulty as string)?.toUpperCase())
    ? (req.query.difficulty as string).toUpperCase() as Difficulty
    : undefined;
  // Optional chapter-scoped quiz (e.g. "Test my knowledge" from the theory page)
  const chapterId = (req.query.chapterId as string) || undefined;
  // Official exam simulation mode (official question count + timer + pass mark)
  const mode = (req.query.mode as string) === 'exam' ? 'exam' : 'practice';

  const exam = await prisma.exam.findUnique({ where: { id: examId, isActive: true } });
  if (!exam) { res.status(404).json({ message: 'Exam not found' }); return; }

  // Subscription guard: FREE users may only access the first exam in sorted order
  const userSubscription = await prisma.subscription.findFirst({
    where: { userId: req.user!.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: { plan: true },
  });
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'INSTRUCTOR';
  const isFreePlan = !isAdmin && (userSubscription?.plan ?? 'FREE') === 'FREE';

  if (isFreePlan) {
    // Official exam simulation is always paid for FREE users (even the first exam)
    if (mode === 'exam') {
      res.status(403).json({ message: 'Upgrade to access the official exam simulation' });
      return;
    }
    const allExams = await prisma.exam.findMany({
      where: { isActive: true },
      select: { id: true, code: true },
    });
    allExams.sort((a, b) => a.code.localeCompare(b.code));
    const examIndex = allExams.findIndex(e => e.id === examId);
    if (examIndex > 0) {
      res.status(403).json({ message: 'Upgrade to access this exam category' });
      return;
    }
  }

  // Get all approved questions for this exam (optionally scoped to a chapter)
  // Combined exams (ICC-B5 = B1 + B2) draw from their source exams.
  const COMBINED_SOURCES: Record<string, string[]> = {
    'ICC-B5': ['ICC-B1', 'ICC-B2'],
  };
  const sourceCodes = COMBINED_SOURCES[exam.code];
  let combinedWhere: { examId: { in: string[] } } | undefined;
  if (sourceCodes) {
    const sources = await prisma.exam.findMany({
      where: { code: { in: sourceCodes }, isActive: true },
      select: { id: true },
    });
    combinedWhere = { examId: { in: sources.map(s => s.id) } };
  }

  const questions = await prisma.question.findMany({
    where: {
      ...(combinedWhere ?? { examId }),
      status: 'APPROVED',
      ...(difficulty ? { difficulty } : {}),
      ...(chapterId ? { chapterId } : {}),
    },
    select: {
      id: true, type: true, difficulty: true,
      question: true, question_fr: true,
      options: true, options_fr: true,
      correctAnswer: true,
      explanation: true, explanation_fr: true,
      chapterId: true,
      chapter: { select: { name: true, name_fr: true } },
    },
  });

  if (questions.length === 0) { res.json({ data: [], exam: { id: exam.id, name: exam.name, passingScore: exam.passingScore } }); return; }

  // Shuffle and pick
  const shuffled = questions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Transform to mobile format (include correctAnswer for practice grading)
  const data = selected.map(q => {
    // Resolve correctIndex against the ENGLISH source options ALWAYS:
    // correctAnswer may be a full EN text or a letter; the FR options are a
    // same-order translation, so the positional index is language-independent.
    const correctIndex = resolveCorrectIndex(q.correctAnswer, q.options);
    const options = useFr && q.options_fr ? (JSON.parse(q.options_fr) as string[]) : q.options;

    return {
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      question: useFr && q.question_fr ? q.question_fr : q.question,
      options,
      correctIndex,
      explanation: useFr && q.explanation_fr ? q.explanation_fr : q.explanation,
      chapterId: q.chapterId,
      chapter: q.chapter ? (useFr && q.chapter.name_fr ? q.chapter.name_fr : q.chapter.name) : null,
    };
  });

  res.json({
    data,
    exam: {
      id: exam.id,
      name: useFr && exam.name_fr ? exam.name_fr : exam.name,
      code: exam.code,
      passingScore: exam.passingScore,
      timeLimit: exam.timeLimit,
      questionsPerSimulation: exam.questionsPerSimulation,
    },
    totalAvailable: questions.length,
  });
});

/**
 * POST /api/student/tutor/explain
 * Uses AI to simplify an exam question explanation in plain language for struggling students.
 * Body: { question: string, explanation: string }
 * Returns: { simplified: string }
 */
router.post('/tutor/explain', async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    question: z.string().min(1, 'Question is required'),
    explanation: z.string().min(1, 'Explanation is required'),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { question, explanation } = parsed.data;

  try {
    const simplified = await aiService.tutorExplain(question, explanation);
    res.json({ simplified });
  } catch (err) {
    console.error('[Tutor Explain] AI error:', err);
    res.status(500).json({ message: 'Failed to generate simplified explanation' });
  }
});

// ─── Protected endpoint (auth required) ──────────────────────────

/**
 * POST /api/student/exam-attempts
 * Submit a completed exam attempt.
 * Body: { examId, answers: [{ questionId, userAnswer }] }
 * Requires authentication.
 */
router.post('/exam-attempts', authenticate, async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    examId: z.string().uuid('Invalid exam ID'),
    answers: z.array(z.object({
      questionId: z.string().uuid(),
      userAnswer: z.string(),
    })).min(1, 'At least one answer is required'),
    totalQuestions: z.number().int().min(1).optional(),
    timeSpent: z.number().min(0).max(36000).optional(),
    mode: z.enum(['practice', 'exam']).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { examId, answers, totalQuestions: clientTotalQuestions, timeSpent: clientTimeSpent, mode = 'practice' } = parsed.data;

  // Verify exam exists and is active
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  // Subscription guard: FREE users may only submit attempts for the first exam
  const userSubscription = await prisma.subscription.findFirst({
    where: { userId: req.user!.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: { plan: true },
  });
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'INSTRUCTOR';
  const isFreePlan = !isAdmin && (userSubscription?.plan ?? 'FREE') === 'FREE';

  if (isFreePlan) {
    // Official exam simulation is always paid for FREE users (even the first exam)
    if (mode === 'exam') {
      res.status(403).json({ message: 'Upgrade to access the official exam simulation' });
      return;
    }
    const allExams = await prisma.exam.findMany({
      where: { isActive: true },
      select: { id: true, code: true },
    });
    allExams.sort((a, b) => a.code.localeCompare(b.code));
    const examIndex = allExams.findIndex(e => e.id === examId);
    if (examIndex > 0) {
      res.status(403).json({ message: 'Upgrade to access this exam category' });
      return;
    }
  }

  // Fetch all questions for this exam in one query
  // Combined exams (ICC-B5 = B1 + B2) accept questions from any source exam.
  const questionIds = answers.map(a => a.questionId);
  const COMBINED_SOURCES: Record<string, string[]> = {
    'ICC-B5': ['ICC-B1', 'ICC-B2'],
  };
  const sourceCodes = COMBINED_SOURCES[exam.code];
  let questionExamFilter: { examId: string } | { examId: { in: string[] } } = { examId };
  if (sourceCodes) {
    const sources = await prisma.exam.findMany({
      where: { code: { in: sourceCodes }, isActive: true },
      select: { id: true },
    });
    questionExamFilter = { examId: { in: sources.map(s => s.id) } };
  }

  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds }, ...questionExamFilter, status: 'APPROVED' },
    select: { id: true, correctAnswer: true, options: true },
  });

  const questionMap = new Map(questions.map(q => [q.id, String(resolveCorrectIndex(q.correctAnswer, q.options))]));

  // Validate all answer questionIds belong to this exam
  const invalidIds = questionIds.filter(id => !questionMap.has(id));
  if (invalidIds.length > 0) {
    res.status(400).json({ message: 'One or more question IDs are invalid or do not belong to this exam' });
    return;
  }

  // Calculate results
  let correctCount = 0;
  const attemptAnswers: { questionId: string; userAnswer: string; isCorrect: boolean }[] = [];

  for (const answer of answers) {
    const correctIdx = questionMap.get(answer.questionId);
    const isCorrect = answer.userAnswer !== '' && answer.userAnswer === correctIdx;
    if (isCorrect) correctCount++;
    attemptAnswers.push({
      questionId: answer.questionId,
      userAnswer: answer.userAnswer,
      isCorrect,
    });
  }

  // Denominator: the quiz total when provided (partial submits count
  // unanswered questions as incorrect), otherwise the answers submitted.
  const totalQuestions = clientTotalQuestions ?? answers.length;
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const timeSpent = clientTimeSpent ?? 0;

  // Create exam attempt
  const attempt = await prisma.examAttempt.create({
    data: {
      userId: req.user!.id,
      examId,
      score,
      totalQuestions,
      correctCount,
      timeSpent,
      answers: {
        create: attemptAnswers,
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'EXAM_ATTEMPT_SUBMITTED',
      details: { attemptId: attempt.id, examId, score, correctCount, totalQuestions },
      ipAddress: req.socket.remoteAddress,
    },
  });

  // Track last activity (exam submission = user activity)
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { lastActiveAt: new Date() },
  }).catch(() => {});

  res.status(201).json({
    id: attempt.id,
    examId,
    score,
    totalQuestions,
    correctCount,
    timeSpent,
    passed: score >= exam.passingScore,
    completedAt: attempt.completedAt,
  });
});

/**
 * GET /api/student/attempts
 * List all exam attempts for the current authenticated user.
 * Returns: { data: UserExamAttempt[] }
 */
router.get('/attempts', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const attempts = await prisma.examAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
    take: 50,
    include: {
      exam: { select: { id: true, name: true, name_fr: true, code: true, passingScore: true } },
    },
  });

  const data = attempts.map(a => ({
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

  res.json({ data });
});

/**
 * DELETE /api/student/attempts
 * Delete all exam attempts (and their answers) for the current user.
 * Used by the "Reset stats" button on the dashboard.
 */
router.delete('/attempts', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const result = await prisma.$transaction(async (tx) => {
    const deletedAnswers = await tx.examAttemptQuestion.deleteMany({
      where: { attempt: { userId } },
    });
    const deletedAttempts = await tx.examAttempt.deleteMany({
      where: { userId },
    });
    return { deletedAnswers: deletedAnswers.count, deletedAttempts: deletedAttempts.count };
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'STATS_RESET',
      details: { deletedAttempts: result.deletedAttempts, deletedAnswers: result.deletedAnswers },
      ipAddress: req.socket.remoteAddress ?? null,
    },
  });

  res.json({ success: true, ...result });
});

/**
 * GET /api/student/stats
 * Get dashboard stats for the current user.
 * Returns: StudentStats
 */
router.get('/stats', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const [attempts, totalExams] = await Promise.all([
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        exam: { select: { id: true, name: true, name_fr: true, code: true, passingScore: true } },
      },
    }),
    prisma.exam.count({ where: { isActive: true } }),
  ]);

  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;
  const passedAttempts = attempts.filter(a => a.score >= (a.exam.passingScore ?? 70)).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  // Aggregate by exam for strengths/weaknesses
  const byExamMap = new Map<string, {
    examId: string;
    examCode: string;
    examName: string;
    examNameFr: string;
    totalAttempts: number;
    scores: number[];
    passedCount: number;
    lastExamName: string;
  }>();

  for (const a of attempts) {
    const key = a.examId;
    if (!byExamMap.has(key)) {
      byExamMap.set(key, {
        examId: a.examId,
        examCode: a.exam.code,
        examName: a.exam.name,
        examNameFr: a.exam.name_fr || a.exam.name,
        totalAttempts: 0,
        scores: [],
        passedCount: 0,
        lastExamName: a.exam.name,
      });
    }
    const e = byExamMap.get(key)!;
    e.totalAttempts++;
    e.scores.push(a.score);
    if (a.score >= (a.exam.passingScore ?? 70)) e.passedCount++;
  }

  const byExam = Array.from(byExamMap.values()).map(e => {
    const total = e.scores.length;
    const avg = Math.round(e.scores.reduce((s, v) => s + v, 0) / total);
    const best = Math.max(...e.scores);
    const last = e.scores[e.scores.length - 1];
    return {
      examId: e.examId,
      examCode: e.examCode,
      examName: e.examName,
      examNameFr: e.examNameFr,
      totalAttempts: e.totalAttempts,
      averageScore: avg,
      bestScore: best,
      lastScore: last,
      passedCount: e.passedCount,
      passRate: Math.round((e.passedCount / total) * 100),
    };
  }).sort((a, b) => b.averageScore - a.averageScore); // highest average score first

  // Calculate study streak: consecutive days with at least one attempt
  let studyStreak = 0;
  if (attempts.length > 0) {
    const dates = [...new Set(attempts.map(a => a.completedAt.toISOString().split('T')[0]))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    // Start from most recent attempt date
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
        // gap in streak
        break;
      } else {
        i++;
      }
    }
  }

  const recentAttempts = attempts.slice(0, 10).map(a => ({
    id: a.id,
    examId: a.examId,
    examName: a.exam.name,
    examNameFr: a.exam.name_fr || a.exam.name,
    examCode: a.exam.code,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctCount: a.correctCount,
    timeSpent: a.timeSpent,
    passed: a.score >= (a.exam.passingScore ?? 70),
    completedAt: a.completedAt.toISOString(),
  }));

  // ── Extra insights (computed from already-loaded attempts, no extra queries) ──
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
  const examsPassedUnique = Array.from(byExamMap.values()).filter(e => e.passedCount > 0).length;
  const totalQuestionsAnswered = attempts.reduce((s, a) => s + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((s, a) => s + a.correctCount, 0);
  const lastAttemptAt = totalAttempts > 0 ? attempts[0].completedAt.toISOString() : null;

  // Momentum: recent performance vs slightly older performance.
  // Positive = improving, negative = slipping.
  let momentum = 0;
  if (totalAttempts >= 6) {
    const last3 = attempts.slice(0, 3);
    const prev3 = attempts.slice(3, 6);
    const lastAvg = last3.reduce((s, a) => s + a.score, 0) / 3;
    const prevAvg = prev3.reduce((s, a) => s + a.score, 0) / 3;
    momentum = Math.round(lastAvg - prevAvg);
  } else if (totalAttempts >= 2) {
    const rest = attempts.slice(1);
    const restAvg = rest.reduce((s, a) => s + a.score, 0) / rest.length;
    momentum = Math.round(attempts[0].score - restAvg);
  }

  // ── Chapter-level performance (Strengths / Areas to Improve / Needs review) ──
  // Reconstructed from per-question answers: ExamAttemptQuestion → Question → Chapter.
  // Mirrors the student-facing "Areas to Improve" analysis.
  let chapterPerformance: {
    chapterId: string; chapterNumber: number; chapterName: string; chapterNameFr: string;
    examId: string; examCode: string; examName: string; examNameFr: string;
    correct: number; total: number; attempted: number; percentage: number;
  }[] = [];
  let chapterStrengths: typeof chapterPerformance = [];
  let chapterWeaknesses: typeof chapterPerformance = [];
  let chapterNeedsReview: typeof chapterPerformance = [];

  if (totalAttempts > 0) {
    const attemptIds = attempts.map(a => a.id);
    const answers = await prisma.examAttemptQuestion.findMany({
      where: { attemptId: { in: attemptIds } },
      select: {
        isCorrect: true,
        question: {
          select: {
            id: true,
            chapterId: true,
            chapter: {
              select: {
                id: true,
                number: true,
                name: true,
                name_fr: true,
                exam: { select: { id: true, code: true, name: true, name_fr: true } },
              },
            },
          },
        },
      },
    });

    const chapterMap = new Map<string, {
      chapterNumber: number; chapterName: string; chapterNameFr: string;
      examId: string; examCode: string; examName: string; examNameFr: string;
      correctIds: Set<string>;
      attemptedIds: Set<string>;
    }>();

    for (const ans of answers) {
      const ch = ans.question?.chapter;
      if (!ch) continue;
      const existing = chapterMap.get(ch.id) || {
        chapterNumber: ch.number,
        chapterName: ch.name,
        chapterNameFr: ch.name_fr || ch.name,
        examId: ch.exam.id,
        examCode: ch.exam.code,
        examName: ch.exam.name,
        examNameFr: ch.exam.name_fr || ch.exam.name,
        correctIds: new Set<string>(),
        attemptedIds: new Set<string>(),
      };
      if (ans.question?.id) existing.attemptedIds.add(ans.question.id);
      if (ans.isCorrect && ans.question?.id) existing.correctIds.add(ans.question.id);
      chapterMap.set(ch.id, existing);
    }

    // Denominator = the chapter's full approved question bank, so unanswered
    // questions count as incorrect (same rule as realtylicence).
    const chapterIds = Array.from(chapterMap.keys());
    const chapterCounts = await prisma.question.groupBy({
      by: ['chapterId'],
      where: { chapterId: { in: chapterIds }, status: 'APPROVED' },
      _count: { _all: true },
    });
    const totalByChapter = new Map(chapterCounts.map(c => [c.chapterId, c._count._all]));

    chapterPerformance = Array.from(chapterMap.entries())
      .map(([chapterId, d]) => {
        const total = totalByChapter.get(chapterId) ?? 0;
        const correct = d.correctIds.size;
        const attempted = d.attemptedIds.size;
        return {
          chapterId,
          chapterNumber: d.chapterNumber,
          chapterName: d.chapterName,
          chapterNameFr: d.chapterNameFr,
          examId: d.examId,
          examCode: d.examCode,
          examName: d.examName,
          examNameFr: d.examNameFr,
          correct,
          total,
          attempted,
          // Denominator = what the user actually attempted, so a 10-question
          // quiz shows 3/10, not 3/57. The full bank (total) is shown as context.
          percentage: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
        };
      })
      .sort((a, b) => b.percentage - a.percentage); // highest percentage first

    // Same thresholds as the student dashboard: strengths ≥75% (min 5 attempted),
    // weaknesses <60% (min 5 attempted), needs review <60% (min 3 attempted).
    // Thresholds use ATTEMPTED (unique questions actually tried), not the full
    // bank — otherwise every chapter passes and the sections duplicate.
    chapterStrengths = chapterPerformance.filter(c => c.attempted >= 5 && c.percentage >= 75).slice(0, 3);
    chapterWeaknesses = chapterPerformance.filter(c => c.attempted >= 5 && c.percentage < 60).slice(0, 3);
    chapterNeedsReview = chapterPerformance.filter(c => c.attempted >= 3 && c.percentage < 60);
  }

  res.json({
    totalExams,
    totalAttempts,
    averageScore,
    passRate,
    studyStreak,
    byExam,
    recentAttempts,
    bestScore,
    examsPassedUnique,
    totalQuestionsAnswered,
    totalCorrect,
    momentum,
    lastAttemptAt,
    chapterPerformance,
    strengths: chapterStrengths,
    weaknesses: chapterWeaknesses,
    needsReview: chapterNeedsReview,
  });
});

/**
 * GET /api/student/theory
 * List all exam categories with their chapters and AI-generated theory content.
 * The theory content is synthesized from question explanations into
 * cohesive study material — no Q&A, just pure textbook-style reference.
 */
router.get('/theory', authenticate, async (_req: Request, res: Response): Promise<void> => {
  const locale = (_req.query.locale as string) || 'en';
  const useFr = locale === 'fr';

  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    orderBy: [{ country: 'asc' }, { displayOrder: 'asc' }],
    select: {
      id: true,
      code: true,
      name: true,
      name_fr: true,
      description: true,
      description_fr: true,
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
          name_fr: true,
          theoryContent: true,
          theoryContentFr: true,
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
    name: useFr && exam.name_fr ? exam.name_fr : exam.name,
    description: useFr && exam.description_fr ? exam.description_fr : exam.description,
    country: exam.country,
    licenseType: exam.licenseType,
    chapterCount: exam._count.chapters,
    questionCount: exam._count.questions,
    chapters: exam.chapters.map(ch => {
      // Extract SVG block from EN content for FR fallback
      let theoryContent: string | null;
      if (useFr) {
        theoryContent = ch.theoryContentFr || ch.theoryContent || null;
        // If FR content lacks SVG but EN has one, append the EN SVG so diagrams still render
        if (theoryContent && !theoryContent.includes('<svg') && ch.theoryContent?.includes('<svg')) {
          const svgMatch = ch.theoryContent.match(/<svg[\s\S]*?<\/svg>/);
          if (svgMatch) theoryContent += '\n\n' + svgMatch[0];
        }
      } else {
        theoryContent = ch.theoryContent || null;
      }
      return {
        id: ch.id,
        number: ch.number,
        name: useFr && ch.name_fr ? ch.name_fr : ch.name,
        questionCount: ch._count.questions,
        theoryContent,
        hasTheory: (ch.theoryContent !== null && ch.theoryContent.length > 0),
      };
    }),
  }));

  res.json({ data });
});

/**
 * GET /api/student/theory/outline
 * Lightweight metadata-only listing (NO theoryContent) for fast initial
 * page render. Content is fetched on demand via /theory/:chapterId/content.
 */
router.get('/theory/outline', authenticate, async (_req: Request, res: Response): Promise<void> => {
  const locale = (_req.query.locale as string) || 'en';
  const useFr = locale === 'fr';

  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    orderBy: [{ country: 'asc' }, { displayOrder: 'asc' }],
    select: {
      id: true,
      code: true,
      name: true,
      name_fr: true,
      description: true,
      description_fr: true,
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
          name_fr: true,
          theoryContent: true,
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
    name: useFr && exam.name_fr ? exam.name_fr : exam.name,
    description: useFr && exam.description_fr ? exam.description_fr : exam.description,
    country: exam.country,
    licenseType: exam.licenseType,
    chapterCount: exam._count.chapters,
    questionCount: exam._count.questions,
    chapters: exam.chapters.map(ch => ({
      id: ch.id,
      number: ch.number,
      name: useFr && ch.name_fr ? ch.name_fr : ch.name,
      questionCount: ch._count.questions,
      theoryContent: null,
      examId: exam.id,
      hasTheory: (ch.theoryContent !== null && ch.theoryContent.length > 0),
    })),
  }));

  res.json({ data });
});

/**
 * GET /api/student/theory/all-content
 * Full content for every chapter — used ONLY to build the client-side
 * search index on demand (not on initial page load).
 */
router.get('/theory/all-content', authenticate, async (_req: Request, res: Response): Promise<void> => {
  const locale = (_req.query.locale as string) || 'en';
  const useFr = locale === 'fr';

  const chapters = await prisma.chapter.findMany({
    where: { isActive: true },
    select: { id: true, theoryContent: true, theoryContentFr: true },
  });

  const data = chapters.map(ch => {
    let theoryContent: string | null;
    if (useFr) {
      theoryContent = ch.theoryContentFr || ch.theoryContent || null;
      if (theoryContent && !theoryContent.includes('<svg') && ch.theoryContent?.includes('<svg')) {
        const svgMatch = ch.theoryContent.match(/<svg[\s\S]*?<\/svg>/);
        if (svgMatch) theoryContent += '\n\n' + svgMatch[0];
      }
    } else {
      theoryContent = ch.theoryContent || null;
    }
    return { id: ch.id, theoryContent };
  });

  res.json({ data });
});

/**
 * GET /api/student/theory/:chapterId/content
 * Full content for a single chapter — loaded when the user expands it.
 */
router.get('/theory/:chapterId/content', authenticate, async (req: Request, res: Response): Promise<void> => {
  const locale = (req.query.locale as string) || 'en';
  const useFr = locale === 'fr';
  const { chapterId } = req.params;

  const ch = await prisma.chapter.findFirst({
    where: { id: chapterId, isActive: true },
    select: { id: true, theoryContent: true, theoryContentFr: true },
  });

  if (!ch) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  let theoryContent: string | null;
  if (useFr) {
    theoryContent = ch.theoryContentFr || ch.theoryContent || null;
    if (theoryContent && !theoryContent.includes('<svg') && ch.theoryContent?.includes('<svg')) {
      const svgMatch = ch.theoryContent.match(/<svg[\s\S]*?<\/svg>/);
      if (svgMatch) theoryContent += '\n\n' + svgMatch[0];
    }
  } else {
    theoryContent = ch.theoryContent || null;
  }

  res.json({ data: { id: ch.id, theoryContent } });
});

export default router;
