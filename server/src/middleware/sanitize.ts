import { Request, Response, NextFunction } from 'express';

/**
 * Sensitive / internal-only field names that should never be sent to
 * clients.
 *
 * Strips fields recursively from JSON responses to prevent accidental
 * data leaks via `...spread` patterns or future code changes.
 */
const STRIPPED_KEYS = new Set([
  'passwordHash',
  'password',
  '__v',            // MongoDB version key (unused here but defensive)
  'stripeCustomerId',
  'resetToken',
  'emailVerificationToken',
  'turnstileSecret',
]);

/**
 * Recursively strip sensitive keys from an object.
 */
function stripSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripSensitive);
  }

  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (STRIPPED_KEYS.has(key)) {
        continue; // omit the field entirely
      }
      sanitized[key] = stripSensitive(val);
    }
    return sanitized;
  }

  return value;
}

/**
 * Express middleware that sanitizes all JSON responses before they are
 * sent to the client.
 *
 * Intercepts `res.json()` to strip fields like passwordHash, __v, etc.
 * from the response payload automatically.
 *
 * This is a defense-in-depth measure — route handlers should already
 * be using Prisma `select` to avoid leaking sensitive fields.
 */
export function sanitizeResponse(req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    const sanitized = stripSensitive(body);
    return originalJson(sanitized);
  } as Response['json'];

  next();
}
