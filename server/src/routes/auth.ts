import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { env, verifyTurnstile } from '../config/env';
import { authenticate } from '../middleware/auth';
import { registerLimiter, forgotPasswordLimiter } from '../middleware/rateLimits';
import { sendWelcomeEmail, sendPasswordResetEmail, sendEmail } from '../services/email';
import { settings } from './settings';

const router = Router();

// Validation schemas

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  captchaToken: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  language: z.enum(['fr', 'en', 'es']).optional().default('fr'),
  captchaToken: z.string().optional(),
  role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT']).optional().default('STUDENT'),
});

// Helpers

async function logActivity(
  userId: string | null,
  action: string,
  details: Record<string, unknown> | null,
  ipAddress: string | undefined
): Promise<void> {
  await prisma.activityLog.create({
    data: { userId, action, details: details as Prisma.InputJsonValue, ipAddress },
  });
}

function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

// Routes

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
      return;
    }

    const { email, password, captchaToken } = parsed.data;

    // Verify Turnstile captcha
    const captchaValid = await verifyTurnstile(captchaToken, req.socket.remoteAddress);
    if (!captchaValid) {
      res.status(400).json({ message: 'Security verification failed. Please try again.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Allow any active user to log in (both admin and student)
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    await logActivity(
      user.id,
      'LOGIN',
      { method: 'email' },
      req.socket.remoteAddress
    );

    // Track last activity so admin dashboards show real user activity
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(400).json({ message: 'Invalid request' });
  }
});

/**
 * POST /api/auth/register
 * Open registration - always creates STUDENT accounts.
 */
router.post('/register', registerLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { email, password, name, language, captchaToken, role } = parsed.data;

  // Skip captcha for admin-created users (authenticated admin via Bearer token)
  let isAdminRequest = false;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(authHeader.slice(7), env.JWT_SECRET) as { role?: string };
      isAdminRequest = payload?.role === 'ADMIN';
    } catch { /* not a valid admin token */ }
  }

  if (!isAdminRequest) {
    const captchaValid = await verifyTurnstile(captchaToken, req.socket.remoteAddress);
    if (!captchaValid) {
      res.status(400).json({ message: 'Security verification failed. Please try again.' });
      return;
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: isAdminRequest ? role : 'STUDENT',
    },
  });

  await logActivity(
    user.id,
    'REGISTER',
    { role: user.role },
    req.socket.remoteAddress
  );

  // Send welcome email (best-effort)
  sendWelcomeEmail(user.email, user.name, language).catch(() => {});

  // Notify admin of new registration (best-effort)
  if (settings.notifications?.adminNewUserAlert !== false) {
    const adminEmail = settings.notifications?.adminNotificationEmail || 'chuck.onekeo@gmail.com';
    const adminMsg = `Nouvelle inscription sur Skylicence.cloud (Canada)\n\nEmail: ${email}\nNom: ${name || 'Non fourni'}\nRôle: ${isAdminRequest ? role : 'STUDENT'}\nDate: ${new Date().toLocaleString('fr-CA')}`;
    sendEmail(adminEmail, `Nouvelle inscription — ${email}`, adminMsg).catch(() => {});
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

/**
 * POST /api/auth/logout
 * Client-side token discard is the actual logout.
 * Here we just log the event for audit.
 */
router.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
  await logActivity(
    req.user!.id,
    'LOGOUT',
    null,
    req.socket.remoteAddress
  );
  res.json({ message: 'Logged out' });
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  captchaToken: z.string().optional(),
});

/**
 * POST /api/auth/forgot-password
 * Sends a password reset email with a time-limited JWT link.
 * Always returns 200 to prevent email enumeration.
 */
router.post('/forgot-password', forgotPasswordLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid email address' });
    return;
  }

  const { email, captchaToken } = parsed.data;

  // Verify Turnstile captcha
  const captchaValid = await verifyTurnstile(captchaToken, req.socket.remoteAddress);
  if (!captchaValid) {
    res.status(400).json({ message: 'Security verification failed. Please try again.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const resetToken = jwt.sign(
      { sub: user.id, purpose: 'password_reset' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink, 'en');

    await logActivity(
      user.id,
      'PASSWORD_RESET_REQUESTED',
      { email },
      req.socket.remoteAddress
    );
  }

  // Always return 200 to prevent email enumeration
  res.json({
    message: 'If an account exists with this email, a reset link has been sent.',
  });
});

/**
 * POST /api/auth/reset-password
 * Accepts a reset token and a new password.
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', errors: parsed.error.errors });
    return;
  }

  const { token, newPassword } = parsed.data;

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; purpose: string };

    if (payload.purpose !== 'password_reset') {
      res.status(400).json({ message: 'Invalid reset token' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await logActivity(
      user.id,
      'PASSWORD_RESET_COMPLETED',
      { email: user.email },
      req.socket.remoteAddress
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
});

/**
 * GET /api/auth/me
 * Returns the current user's profile + active subscription if any.
 */
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { currentPeriodEnd: 'desc' },
        take: 1,
      },
    },
  });

  if (!user || !user.isActive) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    subscription: user.subscriptions[0] ?? null,
  });
});

export default router;
