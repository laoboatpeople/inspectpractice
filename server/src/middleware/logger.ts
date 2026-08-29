import { Request, Response, NextFunction } from 'express';

/**
 * Sensitive fields whose values should be redacted from log output.
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'newPassword',
  'currentPassword',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'authorization',
  'captchaToken',
  'turnstile',
  'stripeToken',
  'cardNumber',
  'cvc',
  'cvv',
  'ssn',
  'authorization',
]);

/**
 * Recursively redact sensitive fields from an object, returning a
 * new object safe for logging. Returns primitives as-is.
 */
function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = redactSensitive(val);
      }
    }
    return sanitized;
  }

  return value;
}

/**
 * Middleware that logs incoming HTTP requests with sanitized bodies,
 * query strings, and headers.
 *
 * Sensitive fields (passwords, tokens, Authorization headers, etc.)
 * are replaced with `[REDACTED]` before logging.
 *
 * Log format:  METHOD /path ?query {body} [statusCode durationMs]
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Sanitize request body for logging
  const safeBody = req.body && typeof req.body === 'object'
    ? redactSensitive(req.body)
    : req.body;

  // Sanitize query string for logging
  const safeQuery = req.query && typeof req.query === 'object'
    ? redactSensitive(req.query)
    : req.query;

  // Redact Authorization header for logging
  const safeHeaders: Record<string, string> = {};
  if (req.headers.authorization) {
    safeHeaders.authorization = '[REDACTED]';
  }
  if (req.headers['x-api-key']) {
    safeHeaders['x-api-key'] = '[REDACTED]';
  }

  // Log request details
  const queryStr = Object.keys(req.query).length > 0
    ? ` ${JSON.stringify(safeQuery)}`
    : '';
  const bodyStr = safeBody && Object.keys(safeBody as object).length > 0
    ? ` ${JSON.stringify(safeBody)}`
    : '';

  console.log(`→ ${req.method} ${req.path}${queryStr}${bodyStr}`);

  // Intercept response finish to log status + duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}
