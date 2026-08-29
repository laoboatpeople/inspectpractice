import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { chaptersService } from '../services/chapters.service';

const router = Router();

router.use(authenticate);

// ─── Validation schemas ───────────────────────────────────────────

const createSchema = z.object({
  examId: z.string().uuid('Invalid exam ID'),
  number: z.number().int().min(1, 'Chapter number must be at least 1'),
  name: z.string().min(1, 'Name is required').max(200),
});

const updateSchema = z.object({
  number: z.number().int().min(1).optional(),
  name: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
});

// ─── Routes ────────────────────────────────────────────────────────

/**
 * GET /api/chapters
 * List all chapters, optionally filtered by examId or isActive.
 * Query params: ?examId=uuid&isActive=true
 */
router.get('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const filters: { examId?: string; isActive?: boolean } = {};
  if (req.query.examId) filters.examId = req.query.examId as string;
  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

  const chapters = await chaptersService.findMany(filters);
  res.json({ data: chapters });
});

/**
 * GET /api/chapters/:id
 * Get a single chapter by ID.
 */
router.get('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const chapter = await chaptersService.findById(req.params.id);

  if (!chapter) {
    res.status(404).json({ message: 'Chapter not found' });
    return;
  }

  res.json(chapter);
});

/**
 * POST /api/chapters
 * Create a new chapter (admin/instructor).
 * Body: { examId, number, name }
 */
router.post('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { examId, number, name } = parsed.data;
  const result = await chaptersService.create({ examId, number, name });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CHAPTER_CREATED',
      details: { chapterId: result.id, examId: parsed.data.examId },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.status(201).json(result);
});

/**
 * PUT /api/chapters/:id
 * Update chapter fields (admin/instructor).
 * Body: { number?, name?, isActive? }
 */
router.put('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  try {
    const updated = await chaptersService.update(req.params.id, parsed.data);

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'CHAPTER_UPDATED',
        details: { chapterId: req.params.id, changes: parsed.data },
        ipAddress: req.socket.remoteAddress,
      },
    });

    res.json(updated);
  } catch (err: any) {
    if (err.message === 'CHAPTER_NOT_FOUND') {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }
    if (err.message === 'CHAPTER_NUMBER_EXISTS') {
      res.status(409).json({ message: 'A chapter with this number already exists for this exam' });
      return;
    }
    throw err;
  }
});

/**
 * DELETE /api/chapters/:id
 * Soft-delete a chapter — sets isActive = false (admin only).
 */
router.delete('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    await chaptersService.delete(req.params.id);

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'CHAPTER_DELETED',
        details: { chapterId: req.params.id },
        ipAddress: req.socket.remoteAddress,
      },
    });

    res.json({ message: 'Chapter deactivated' });
  } catch (err: any) {
    if (err.message === 'CHAPTER_NOT_FOUND') {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }
    throw err;
  }
});

export default router;
