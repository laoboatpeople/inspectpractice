import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as path from 'path';
import { IncomingMessage } from 'http';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { countPages, extractAndEmbed } from '../services/pdf.service';
import { extractFileText } from '../services/pdf.service';

// Multer imported via require to avoid ESM/commonjs interop issues with @types/multer
// eslint-disable-next-line @typescript-eslint/no-require-imports
const multer = require('multer') as any;

const router = Router();

// Multer: store PDFs in ./uploads with original filename preserved
const storage = multer.diskStorage({
  destination: (_req: IncomingMessage, _file: Express.Multer.File, cb: (e: Error | null, dest: string) => void) => {
    cb(null, path.resolve(env.UPLOAD_DIR));
  },
  filename: (_req: IncomingMessage, file: Express.Multer.File, cb: (e: Error | null, name: string) => void) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(env.MAX_FILE_SIZE_MB) * 1024 * 1024 },
  fileFilter: (_req: IncomingMessage, file: Express.Multer.File, cb: (e: Error | null, acceptFile: boolean) => void) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed'), false);
      return;
    }
    cb(null, true);
  },
});

router.use(authenticate);

/**
 * GET /api/content
 * List all uploaded content with optional filters.
 * Query: ?examId=&page=1&limit=20
 */
router.get('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (req.query.examId) where.examId = req.query.examId;

  const [files, total] = await Promise.all([
    prisma.content.findMany({
      where,
      skip,
      take: limit,
      orderBy: { uploadedAt: 'desc' },
      include: {
        exam: { select: { id: true, code: true, name: true } },
        chapter: { select: { id: true, number: true, name: true } },
      },
    }),
    prisma.content.count({ where }),
  ]);

  res.json({ data: files, total, page, limit, totalPages: Math.ceil(total / limit) });
});

/**
 * POST /api/content/upload
 * Upload a PDF and trigger async embedding extraction.
 * Requires multipart form: file (PDF) + examId (optional) + chapterId (optional)
 */
router.post('/upload', requireRoles('ADMIN', 'INSTRUCTOR'), upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const schema = z.object({
    examId: z.string().uuid().optional(),
    chapterId: z.string().uuid().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  // Count PDF pages asynchronously (Word docs don't have pages)
  let pageCount = 0;
  if (req.file.mimetype === 'application/pdf') {
    pageCount = await countPages(req.file.path).catch(() => 0);
  }

  const content = await prisma.content.create({
    data: {
      filename: req.file.originalname,
      filepath: req.file.path,
      examId: parsed.data.examId ?? null,
      chapterId: parsed.data.chapterId ?? null,
      pages: pageCount,
    },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
    },
  });

  // Trigger async text extraction and embedding generation
  extractAndEmbed(content.id, req.file.path)
    .catch((err: unknown) => console.error('[PDF Embedding Error]', err));

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CONTENT_UPLOADED',
      details: { contentId: content.id, filename: req.file!.originalname },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.status(201).json(content);
});

/**
 * GET /api/content/:id
 * Get a single content item.
 */
router.get('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const content = await prisma.content.findUnique({
    where: { id: req.params.id },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
    },
  });

  if (!content) {
    res.status(404).json({ message: 'Content not found' });
    return;
  }

  res.json(content);
});

/**
 * PUT /api/content/:id
 * Update exam/chapter association or re-tag content.
 */
router.put('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    examId: z.string().uuid().nullable().optional(),
    chapterId: z.string().uuid().nullable().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const content = await prisma.content.findUnique({ where: { id: req.params.id } });
  if (!content) {
    res.status(404).json({ message: 'Content not found' });
    return;
  }

  const updated = await prisma.content.update({
    where: { id: req.params.id },
    data: {
      examId: parsed.data.examId !== undefined ? parsed.data.examId : content.examId,
      chapterId: parsed.data.chapterId !== undefined ? parsed.data.chapterId : content.chapterId,
    },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
    },
  });

  res.json(updated);
});

/**
 * DELETE /api/content/:id
 * Remove content record and delete the file from disk.
 */
router.delete('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const content = await prisma.content.findUnique({ where: { id: req.params.id } });
  if (!content) {
    res.status(404).json({ message: 'Content not found' });
    return;
  }

  // Delete file from disk
  try {
    const fs = await import('fs');
    if (fs.existsSync(content.filepath)) {
      fs.unlinkSync(content.filepath);
    }
  } catch (err) {
    console.error('[File Delete Error]', err);
  }

  await prisma.content.delete({ where: { id: req.params.id } });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'CONTENT_DELETED',
      details: { contentId: req.params.id, filename: content.filename },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Content deleted' });
});

export default router;
