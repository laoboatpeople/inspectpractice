import { Router, Request, Response } from 'express';
import { contactLimiter } from '../middleware/rateLimits';
import { verifyTurnstile } from '../config/env';
import { prisma } from '../config/database';

const router = Router();

const FROM_EMAIL = 'InspectPractice <info@inspectpractice.com>';
const TO_EMAIL = 'chuck.onekeo@gmail.com';

/**
 * POST /api/contact
 * Public endpoint — no auth required.
 * Sends a contact form submission via Resend.
 */
router.post('/', contactLimiter, async (req: Request, res: Response): Promise<void> => {
  const { name, email, message, captchaToken } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  // Verify captcha
  const captchaValid = await verifyTurnstile(captchaToken, req.socket.remoteAddress);
  if (!captchaValid) {
    res.status(400).json({ error: 'Security verification failed. Please try again.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Contact] RESEND_API_KEY not configured');
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  const text = [
    `New contact form submission — ${name}`,
    '',
    '── Contact ──',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    '── Message ──',
    message,
    '',
    `View in admin: https://inspectpractice.com/admin/contact-messages`,
  ].join('\n');

  // Persist the message so the contact form handler cron can see and reply to it.
  // Without this, submissions only reach Chuck's inbox and are lost if missed.
  await prisma.contactMessage
    .create({
      data: {
        name,
        email,
        message,
        direction: 'inbound',
        source: 'contact_form',
      },
    })
    .catch((err) => console.error('[Contact] DB save error:', err));

  try {
    const fetchRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[InspectPractice] Contact from ${name}`,
        text,
      }),
    });

    if (!fetchRes.ok) {
      const errBody = await fetchRes.text();
      console.error('[Contact] Resend error:', fetchRes.status, errBody);
      res.status(500).json({ error: 'Failed to send message' });
      return;
    }


    res.json({ success: true });
  } catch (err) {
    console.error('[Contact] Network error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
