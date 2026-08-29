import rateLimit from 'express-rate-limit';

/**
 * Per-route rate limiters for sensitive endpoints.
 *
 * These provide tighter limits on top of the global 500/15min limiter.
 */

// ── Auth routes ─────────────────────────────────────────────────
//
// 10 requests per minute for login — prevents brute-force attacks
// while still allowing normal retry attempts.
// 30 requests per minute for auth endpoints.
// Login brute-force is still rate-limited at the route level in auth.ts.
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in a minute.' },
});

// 5 requests per 15 minutes for registration — limits account creation
// abuse while being generous enough for legitimate sign-ups.
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again later.' },
});

// 3 requests per hour for forgot-password — prevents email bombing
// and password-reset-spam attacks.
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password reset requests. Please try again later.' },
});

// ── AI / Chat routes ────────────────────────────────────────────
//
// 30 requests per minute — generous enough for interactive chat while
// preventing runaway billing from a single misbehaving client.
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many chat requests. Please slow down.' },
});

// ── Contact form ─────────────────────────────────────────────────
//
// 5 requests per 15 minutes per IP — prevents email spam via the
// public contact form while being generous enough for real users.
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages sent. Please try again later.' },
});

// ── Newsletter ────────────────────────────────────────────────────
//
// 5 requests per 15 minutes per IP — prevents email subscription abuse
// while allowing multiple legitimate subscriptions (e.g., re-subscribes).
export const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many subscription attempts. Please try again later.' },
});

// ── General API ─────────────────────────────────────────────────
//
// 100 requests per minute for general API endpoints that aren't
// otherwise rate-limited (users, questions, exams, etc.).
export const generalAPILimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' },
});
