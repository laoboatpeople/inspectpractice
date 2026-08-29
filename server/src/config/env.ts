import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // OpenAI / Compatible API (OpenAI, DeepSeek, etc.)
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  OPENAI_MODEL: z.string().default('gpt-4o'),

  // Stripe (optional until billing is enabled)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_LIFETIME_PRICE_ID: z.string().optional(),

  // Resend (email)
  RESEND_API_KEY: z.string().optional(),

  // Turnstile (captcha — optional, skipped when not configured)
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // File uploads
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.string().default('50'),

  // Redis (optional - uses in-memory fallback if not set)
  REDIS_URL: z.string().default(''),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('\n');
    console.error('Invalid environment variables:\n' + errors);
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Verify a Turnstile captcha token. Fail-closed: missing secret or missing token => refuse. */
export async function verifyTurnstile(token: string | undefined, remoteIp: string | undefined): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return false; // fail-closed: no secret configured -> refuse (never skip silently)
  if (!token || token.length === 0) return false; // fail-closed: missing token -> refuse (all public forms render the widget)

  try {
    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);
    if (remoteIp) form.append('remoteip', remoteIp);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
    });
    const data = await res.json() as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Ensure upload directory exists
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
