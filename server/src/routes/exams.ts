import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate);

// ─── Exams ──────────────────────────────────────────────────────

/**
 * GET /api/exams
 * List all exams with optional country/licenseType filter.
 */
router.get('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const where: any = {};
  if (req.query.country) where.country = req.query.country;
  if (req.query.licenseType) where.licenseType = req.query.licenseType;
  if (req.query.isActive) where.isActive = req.query.isActive === 'true';

  const exams = await prisma.exam.findMany({
    where,
    orderBy: [{ country: 'asc' }, { code: 'asc' }],
    include: {
      _count: { select: { chapters: true, questions: { where: { status: 'APPROVED' } } } },
    },
  });

  res.json({ data: exams });
});

/**
 * GET /api/exams/chapters/list
 * List chapters, optionally filtered by examId.
 * Query: ?examId=uuid
 * NOTE: defined before /:id to avoid being shadowed.
 */
router.get('/chapters/list', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const where: any = { isActive: true };
  if (req.query.examId) where.examId = req.query.examId;

  const chapters = await prisma.chapter.findMany({
    where,
    orderBy: { number: 'asc' },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
  });

  res.json({ data: chapters });
});

/**
 * GET /api/exams/:id/chapters
 * Get all chapters for an exam (joined from ExamChapter + Chapter).
 * Returns { chapters: [...] }
 */
router.get('/:id/chapters', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  // Fetch chapters via ExamChapter join (through Exam -> chapters relation)
  const chapters = await prisma.chapter.findMany({
    where: { examId: id, isActive: true },
    orderBy: { number: 'asc' },
    include: {
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
  });

  res.json({ chapters });
});

/**
 * GET /api/exams/:id
 * Get a single exam with its chapters and question counts per status per chapter.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const exam = await prisma.exam.findUnique({
    where: { id, isActive: true },
    include: {
      chapters: {
        where: { isActive: true },
        orderBy: { number: 'asc' },
      },
    },
  });

  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  // Fetch question counts grouped by chapterId and status in ONE query to avoid N+1
  const questionCountsRaw = await prisma.question.groupBy({
    by: ['chapterId', 'status'],
    where: {
      examId: id,
      chapterId: { in: exam.chapters.map(c => c.id) },
    },
    _count: { _all: true },
  });

  // Transform into map: chapterId -> { approved, pending, rejected, total }
  const countsMap: Record<string, { approved: number; pending: number; rejected: number; total: number }> = {};
  for (const row of questionCountsRaw) {
    if (!countsMap[row.chapterId]) {
      countsMap[row.chapterId] = { approved: 0, pending: 0, rejected: 0, total: 0 };
    }
    countsMap[row.chapterId][row.status.toLowerCase() as 'approved' | 'pending' | 'rejected'] = row._count._all;
    countsMap[row.chapterId].total += row._count._all;
  }

  const chaptersWithCounts = exam.chapters.map(chapter => ({
    id: chapter.id,
    number: chapter.number,
    name: chapter.name,
    isActive: chapter.isActive,
    questionCounts: countsMap[chapter.id] ?? { approved: 0, pending: 0, rejected: 0, total: 0 },
  }));

  res.json({
    ...exam,
    chapters: chaptersWithCounts,
  });
});

/**
 * GET /api/exams/:id/attempts
 * List last 10 attempts for an exam (admin only).
 */
router.get('/:id/attempts', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  const attempts = await prisma.examAttempt.findMany({
    where: { examId: req.params.id },
    orderBy: { completedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      userId: true,
      score: true,
      totalQuestions: true,
      correctCount: true,
      timeSpent: true,
      completedAt: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const result = attempts.map(a => ({
    id: a.id,
    userId: a.userId,
    userName: a.user.name,
    userEmail: a.user.email,
    score: a.score,
    totalQuestions: a.totalQuestions,
    correctCount: a.correctCount,
    timeSpent: a.timeSpent,
    completedAt: a.completedAt,
  }));

  res.json({ data: result });
});

/**
 * POST /api/exams
 * Create a new exam (admin only).
 */
router.post('/', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(200),
    description: z.string().optional(),
    country: z.string().length(2).default('US'),
    licenseType: z.string().default('ICC-B1'),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const existing = await prisma.exam.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    res.status(409).json({ message: 'An exam with this code already exists' });
    return;
  }

  const exam = await prisma.exam.create({ data: parsed.data });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'EXAM_CREATED',
      details: { examId: exam.id, code: exam.code },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.status(201).json(exam);
});

/**
 * PUT /api/exams/:id
 * Update exam fields (admin only).
 */
router.put('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    timeLimit: z.number().int().min(1).optional(),
    passingScore: z.number().min(0).max(100).optional(),
    questionsPerSimulation: z.number().int().min(1).optional(),
    randomizeOrder: z.boolean().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  const updated = await prisma.exam.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'EXAM_UPDATED',
      details: { examId: exam.id, changes: parsed.data },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

// ─── Chapters ──────────────────────────────────────────────────

/**
 * POST /api/exams/:examId/chapters
 * Add a chapter to an exam (admin/instructor).
 */
router.post('/:examId/chapters', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    number: z.number().int().min(1),
    name: z.string().min(1).max(200),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const exam = await prisma.exam.findUnique({ where: { id: req.params.examId } });
  if (!exam) {
    res.status(404).json({ message: 'Exam not found' });
    return;
  }

  const existing = await prisma.chapter.findUnique({
    where: { examId_number: { examId: req.params.examId, number: parsed.data.number } },
  });
  if (existing) {
    res.status(409).json({ message: 'A chapter with this number already exists for this exam' });
    return;
  }

  const chapter = await prisma.chapter.create({
    data: { examId: req.params.examId, ...parsed.data },
    include: { exam: { select: { id: true, code: true } } },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CHAPTER_CREATED',
      details: { chapterId: chapter.id, examId: req.params.examId },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.status(201).json(chapter);
});

/**
 * PUT /api/exams/:examId/chapters/:id
 * Update a chapter (admin/instructor).
 */
router.put('/:examId/chapters/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    number: z.number().int().min(1).optional(),
    name: z.string().min(1).max(200).optional(),
    isActive: z.boolean().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const chapter = await prisma.chapter.findUnique({ where: { id: req.params.id } });
  if (!chapter || chapter.examId !== req.params.examId) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  const updated = await prisma.chapter.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: { exam: { select: { id: true, code: true } } },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CHAPTER_UPDATED',
      details: { chapterId: chapter.id, changes: parsed.data },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

/**
 * DELETE /api/exams/:examId/chapters/:id
 * Soft-delete a chapter (admin only).
 */
router.delete('/:examId/chapters/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const chapter = await prisma.chapter.findUnique({ where: { id: req.params.id } });
  if (!chapter || chapter.examId !== req.params.examId) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  await prisma.chapter.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CHAPTER_DELETED',
      details: { chapterId: chapter.id, examId: req.params.examId },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Chapter deactivated' });
});

export default router;
