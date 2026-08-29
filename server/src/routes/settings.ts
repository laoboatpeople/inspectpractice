import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN'));

const SETTINGS_PATH = path.join(__dirname, '../../../data/settings.json');

function loadSettings(): PlatformSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch { /* ignore corrupt file */ }
  return { ...defaultSettings };
}

function saveSettings(s: PlatformSettings): void {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Settings] Failed to persist:', e);
  }
}

// In-memory settings store (persisted to data/settings.json)
interface PlatformSettings {
  organization: {
    name: string;
    email: string;
    timezone: string;
  };
  examDefaults: {
    passingScore: number;
    timeLimit: number;
    questionsPerSimulation: number;
    randomizeOrder: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    welcomeEmail: boolean;
    reminderEmails: boolean;
    adminNewUserAlert: boolean;
    adminNotificationEmail: string;
  };
  security: {
    sessionTimeout: number;
    requireEmailVerification: boolean;
    apiKeys: Array<{ id: string; name: string; key: string; createdAt: string }>;
  };
}

const defaultSettings: PlatformSettings = {
  organization: {
    name: 'Inspect Practice Inc.',
    email: 'admin@inspectpractice.ca',
    timezone: 'America/Toronto',
  },
  examDefaults: {
    passingScore: 70,
    timeLimit: 60,
    questionsPerSimulation: 50,
    randomizeOrder: false,
  },
  notifications: {
    emailNotifications: true,
    welcomeEmail: true,
    reminderEmails: true,
    adminNewUserAlert: true,
    adminNotificationEmail: 'chuck.onekeo@gmail.com',
  },
  security: {
    sessionTimeout: 60,
    requireEmailVerification: false,
    apiKeys: [],
  },
};

// Singleton settings instance
let settings: PlatformSettings = loadSettings();
export { settings };

const updateSettingsSchema = z.object({
  organization: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    timezone: z.string().min(1),
  }).optional(),
  examDefaults: z.object({
    passingScore: z.number().min(50).max(100),
    timeLimit: z.number().min(15).max(300),
    questionsPerSimulation: z.number().min(10).max(200),
    randomizeOrder: z.boolean(),
  }).optional(),
  notifications: z.object({
    emailNotifications: z.boolean(),
    welcomeEmail: z.boolean(),
    reminderEmails: z.boolean(),
    adminNewUserAlert: z.boolean(),
    adminNotificationEmail: z.string().email().optional(),
  }).optional(),
  security: z.object({
    sessionTimeout: z.number().min(5).max(480),
    requireEmailVerification: z.boolean(),
  }).optional(),
});

/**
 * GET /api/settings
 * Returns current platform settings.
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.json(settings);
});

/**
 * PUT /api/settings
 * Update platform settings.
 * Body: partial settings object
 */
router.put('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = updateSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid settings', errors: parsed.error.errors });
    return;
  }

  const updates = parsed.data;

  if (updates.organization) {
    settings.organization = { ...settings.organization, ...updates.organization };
  }
  if (updates.examDefaults) {
    settings.examDefaults = { ...settings.examDefaults, ...updates.examDefaults };
  }
  if (updates.notifications) {
    settings.notifications = { ...settings.notifications, ...updates.notifications };
  }
  if (updates.security) {
    settings.security = { ...settings.security, ...updates.security };
  }

  // Persist to disk
  saveSettings(settings);

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'SETTINGS_UPDATED',
      details: { updatedSections: Object.keys(updates) },
      ipAddress: req.socket.remoteAddress ?? null,
    },
  });

  res.json(settings);
});

/**
 * GET /api/settings/export
 * Export all platform data as JSON (for backup).
 */
router.get('/export', async (_req: Request, res: Response): Promise<void> => {
  const [users, subscriptions, exams, questions, activityLogs] = await Promise.all([
    prisma.user.findMany({ include: { subscriptions: true, examAttempts: true } }),
    prisma.subscription.findMany(),
    prisma.exam.findMany({ include: { chapters: { include: { questions: true } } } }),
    prisma.question.findMany(),
    prisma.activityLog.findMany({ take: 1000, orderBy: { createdAt: 'desc' } }),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    platform: 'Inspect Practice',
    version: '1.0.0',
    settings,
    data: {
      users: users.map(u => ({ ...u, passwordHash: undefined })),
      subscriptions,
      exams,
      questions,
      activityLogs,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="inspectpractice-export-${new Date().toISOString().split('T')[0]}.json"`);
  res.json(exportData);
});

/**
 * POST /api/settings/clear-test-data
 * Remove all test users and their exam attempts.
 */
router.post('/clear-test-data', async (req: Request, res: Response): Promise<void> => {
  // Find test users (email contains 'test' or 'demo')
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'test', mode: 'insensitive' } },
        { email: { contains: 'demo', mode: 'insensitive' } },
        { email: { contains: 'example', mode: 'insensitive' } },
      ],
    },
  });

  const testUserIds = testUsers.map(u => u.id);

  if (testUserIds.length === 0) {
    res.json({ message: 'No test data found', deleted: 0 });
    return;
  }

  await prisma.examAttemptQuestion.deleteMany({
    where: { attempt: { userId: { in: testUserIds } } },
  });
  await prisma.examAttempt.deleteMany({
    where: { userId: { in: testUserIds } },
  });
  await prisma.subscription.deleteMany({
    where: { userId: { in: testUserIds } },
  });
  await prisma.activityLog.deleteMany({
    where: { userId: { in: testUserIds } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: testUserIds } },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'TEST_DATA_CLEARED',
      details: { deletedUsers: testUsers.length },
      ipAddress: req.socket.remoteAddress ?? null,
    },
  });

  res.json({ message: 'Test data cleared', deleted: testUserIds.length });
});

/**
 * POST /api/settings/reset
 * WARNING: Permanently delete ALL data. Use with extreme caution.
 * The frontend shows a 3-step confirmation dialog before calling this.
 */
router.post('/reset', async (req: Request, res: Response): Promise<void> => {
  // Delete in correct order to respect foreign keys
  await prisma.examAttemptQuestion.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.question.deleteMany({ where: { status: 'PENDING' } });
  await prisma.question.deleteMany({ where: { status: 'APPROVED' } });
  await prisma.question.deleteMany({ where: { status: 'REJECTED' } });
  await prisma.chapter.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'STUDENT' } });
  await prisma.user.deleteMany({ where: { role: 'INSTRUCTOR' } });

  // Reset settings to defaults
  settings = { ...defaultSettings };

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'PLATFORM_RESET',
      details: { resetBy: req.user!.id },
      ipAddress: req.socket.remoteAddress ?? null,
    },
  });

  res.json({ message: 'Platform has been reset' });
});

export default router;
