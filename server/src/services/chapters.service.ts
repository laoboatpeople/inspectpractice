import { prisma } from '../config/database';
import { Chapter, Prisma } from '@prisma/client';

// ─── Types ────────────────────────────────────────────────────────

export interface CreateChapterInput {
  examId: string;
  number: number;
  name: string;
}

export interface UpdateChapterInput {
  number?: number;
  name?: string;
  isActive?: boolean;
}

// ─── Service ──────────────────────────────────────────────────────

export const chaptersService = {
  /**
   * List chapters with optional filters.
   */
  async findMany(filters?: { examId?: string; isActive?: boolean }) {
    const where: Prisma.ChapterWhereInput = {};
    if (filters?.examId) where.examId = filters.examId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return prisma.chapter.findMany({
      where,
      orderBy: [{ examId: 'asc' }, { number: 'asc' }],
      include: {
        exam: { select: { id: true, code: true, name: true } },
        _count: { select: { questions: { where: { status: 'APPROVED' } } } },
      },
    });
  },

  /**
   * Get a single chapter by ID.
   */
  async findById(id: string) {
    return prisma.chapter.findUnique({
      where: { id },
      include: {
        exam: { select: { id: true, code: true, name: true, country: true, licenseType: true } },
        _count: { select: { questions: true } },
      },
    });
  },

  /**
   * Create a new chapter.
   * Fails if exam doesn't exist or chapter number already exists for that exam.
   */
  async create(data: CreateChapterInput) {
    const exam = await prisma.exam.findUnique({ where: { id: data.examId } });
    if (!exam) {
      throw new Error('EXAM_NOT_FOUND');
    }

    const existing = await prisma.chapter.findUnique({
      where: { examId_number: { examId: data.examId, number: data.number } },
    });
    if (existing) {
      throw new Error('CHAPTER_NUMBER_EXISTS');
    }

    return prisma.chapter.create({
      data,
      include: { exam: { select: { id: true, code: true, name: true } } },
    });
  },

  /**
   * Update chapter fields.
   * If number is changed, checks for conflicts.
   */
  async update(id: string, data: UpdateChapterInput) {
    const chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) {
      throw new Error('CHAPTER_NOT_FOUND');
    }

    // If number is being changed, ensure no conflict
    if (data.number !== undefined && data.number !== chapter.number) {
      const conflict = await prisma.chapter.findUnique({
        where: { examId_number: { examId: chapter.examId, number: data.number } },
      });
      if (conflict) {
        throw new Error('CHAPTER_NUMBER_EXISTS');
      }
    }

    return prisma.chapter.update({
      where: { id },
      data,
      include: { exam: { select: { id: true, code: true, name: true } } },
    });
  },

  /**
   * Soft-delete a chapter (sets isActive = false).
   */
  async delete(id: string) {
    const chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) {
      throw new Error('CHAPTER_NOT_FOUND');
    }

    return prisma.chapter.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
