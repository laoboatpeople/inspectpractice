import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { prisma } from './config/database';

// Custom middleware
import { requestLogger } from './middleware/logger';
import { sanitizeResponse } from './middleware/sanitize';
import { authenticate } from './middleware/auth';
import {
  authLimiter,
  chatLimiter,
  generalAPILimiter,
  newsletterLimiter,
} from './middleware/rateLimits';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import questionRoutes from './routes/questions';
import examRoutes from './routes/exams';
import chapterRoutes from './routes/chapters';
import contentRoutes from './routes/content';
import analyticsRoutes from './routes/analytics';
import publicRoutes from './routes/public';
import testAuthRoutes from './routes/testAuth';
import subscriptionRoutes from './routes/subscriptions';
import settingsRoutes from './routes/settings';
import studentRoutes from './routes/student';
import chatRoutes from './routes/chat';
import stripeRoutes from './routes/stripe';
import contactRoutes from './routes/contact';
import contactAdminRoutes from './routes/contactAdmin';
import tutorFeedbackRoutes from './routes/tutorFeedback';
import theoryFeedbackRoutes from './routes/theoryFeedback';
import newsletterRoutes from './routes/newsletter';
import checklistRoutes from './routes/checklist';
import adminTheoryRoutes from './routes/adminTheory';

const app = express();

// ─── Security middleware ────────────────────────────────────────

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// ─── Rate limiting ─────────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);

// Stripe webhook needs raw body for signature verification — must be BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// ─── Body parsing ──────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request logging (after body parsing, before routes) ───────
//
// Logs all incoming requests with sensitive fields (passwords, tokens,
// Authorization headers) redacted.

app.use(requestLogger);

// ─── CSRF protection note ──────────────────────────────────────
//
// This is a JSON API using JWT bearer tokens stored client-side
// (typically in localStorage or memory). CSRF relies on SameSite
// cookie behavior for protection.
//
// Since:
//   - No session cookies are used (JWT is sent via Authorization header)
//   - CORS is configured with a strict origin + credentials: true
//   - SameSite cookies (if any are introduced) default to Lax
//   - Stripe webhook uses a raw body endpoint (exempt from JSON parsing)
//   - All sensitive mutations require JWT authentication
//
// → CSRF is inherently mitigated.  No additional CSRF token middleware
//   is needed.  If session cookies are introduced later, add
//   csurf / csrf-csrf for state-mutating POST/PUT/DELETE endpoints.

// ─── Response sanitization ─────────────────────────────────────
//
// Strips sensitive fields (passwordHash, __v, etc.) from all JSON
// responses automatically — defense-in-depth against spread leaks.

app.use(sanitizeResponse);

// ─── Health check ─────────────────────────────────────────────

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (err) {
    console.error('[Health Check] DB connectivity failed:', err);
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
});

app.use('/api/student', studentRoutes);
// ─── API routes ────────────────────────────────────────────────

// Public read-only routes — no auth (AI crawlers, SEO tooling)
app.use('/api/public', generalAPILimiter, publicRoutes);

// Test auth — NO rate limiter (secret URL)
app.use('/api/test', testAuthRoutes);

// Auth routes: 10 req/min on all auth endpoints (login, register, forgot-password, etc.)
// Individual sub-routes may have tighter limiters applied inside auth.ts
app.use('/api/auth', authLimiter, authRoutes);

// General API routes: 100 req/min for users, questions, exams, etc.
app.use('/api/users', generalAPILimiter, userRoutes);
app.use('/api/questions', generalAPILimiter, questionRoutes);
app.use('/api/exams', generalAPILimiter, examRoutes);
app.use('/api/chapters', generalAPILimiter, chapterRoutes);
app.use('/api/content', generalAPILimiter, contentRoutes);
app.use('/api/analytics', generalAPILimiter, analyticsRoutes);
app.use('/api/subscriptions', generalAPILimiter, subscriptionRoutes);
app.use('/api/settings', generalAPILimiter, settingsRoutes);

// Chat routes: 30 req/min for AI chat
app.use('/api/chat', chatLimiter, chatRoutes);

// Stripe routes: 100 req/min (webhook already uses raw body)
app.use('/api/stripe', generalAPILimiter, stripeRoutes);

// Contact routes: 100 req/min
app.use('/api/contact', generalAPILimiter, contactRoutes);

// Contact admin routes: admin-only contact message management
app.use('/api/admin/contact-messages', authenticate, contactAdminRoutes);

// Tutor feedback admin routes: admin-only view of AI tutor feedback
app.use('/api/admin/tutor-feedback', authenticate, tutorFeedbackRoutes);

// Theory feedback routes: student thumbs up/down on theory chapters
app.use('/api/student/theory-feedback', authenticate, theoryFeedbackRoutes);

// Newsletter routes: 5 req/15min (public subscription endpoint)
app.use('/api/newsletter', newsletterRoutes);

// Checklist routes: public PDF download (no auth required)
app.use('/api/checklist', checklistRoutes);

// Admin theory routes: generate theory content from questions
app.use('/api/admin/theory', adminTheoryRoutes);

// ─── 404 handler ─────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start server ─────────────────────────────────────────────

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, () => {
  console.log(`Inspect Practice API running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// Allow long-running AI requests (DeepSeek with 80K chars takes ~2-3 min)
server.timeout = 300000; // 5 minutes

// ─── Graceful shutdown ────────────────────────────────────────

process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received — shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason: Error | any) => {
  console.error('[Unhandled Rejection]', reason);
  console.log('Triggering graceful shutdown due to unhandled rejection');
  server.close();
  prisma.$disconnect().then(() => process.exit(1)).catch(() => process.exit(1));
});
