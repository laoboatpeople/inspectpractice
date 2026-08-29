import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

const FROM_EMAIL = 'InspectPractice <info@inspectpractice.com>';

/**
 * GET /api/admin/contact-messages
 *
 * Admin-only endpoint. Returns all contact messages, newest first.
 * Requires a valid admin Bearer token.
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ messages });
  } catch (err) {
    console.error('[ContactAdmin] List error:', err);
    res.status(500).json({ error: 'Failed to load contact messages.' });
  }
});

/**
 * GET /api/admin/contact-messages/conversations
 *
 * Admin-only endpoint. Returns contact messages grouped as conversations.
 * External messages (not from admin) become conversation keys.
 * Admin messages (from info@inspectpractice.com) are merged into the
 * external conversation whose messages are closest in time.
 * Requires a valid admin Bearer token.
 */
router.get('/conversations', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Known admin emails — these are outbound messages (sent by us)
    const ADMIN_EMAILS = ['info@inspectpractice.com'];

    // Separate external messages from admin messages
    const externalMessages = messages.filter(
      m => !ADMIN_EMAILS.includes(m.email.toLowerCase().trim())
    );
    const adminMessages = messages.filter(
      m => ADMIN_EMAILS.includes(m.email.toLowerCase().trim())
    );

    // Group external messages by email (this creates the conversation keys)
    const groups = new Map<string, {
      email: string;
      name: string;
      messages: Array<typeof messages[0] & { direction: string }>;
      lastActivityAt: Date;
      pendingCount: number;
    }>();

    for (const msg of externalMessages) {
      const key = msg.email.toLowerCase().trim();
      if (!groups.has(key)) {
        groups.set(key, {
          email: msg.email,
          name: msg.name,
          messages: [],
          lastActivityAt: msg.createdAt,
          pendingCount: 0,
        });
      }
      const group = groups.get(key)!;
      // Preserve DB direction if explicitly set (e.g. 'outbound' for sent emails)
      const direction = (msg as any).direction === 'outbound' ? 'outbound' : 'inbound';
      group.messages.push({ ...msg, direction });
      if (msg.createdAt > group.lastActivityAt) group.lastActivityAt = msg.createdAt;
      if (!msg.repliedAt && direction !== 'outbound') group.pendingCount++;
    }

    // For each admin message, find the closest external conversation by time
    // and insert it as an outbound message (shows as "You said" in the thread)
    for (const msg of adminMessages) {
      const adminTime = msg.createdAt.getTime();
      let bestGroup: any = null;
      let bestDiff = Infinity;

      for (const group of groups.values()) {
        for (const groupMsg of group.messages) {
          const diff = Math.abs(groupMsg.createdAt.getTime() - adminTime);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestGroup = group;
          }
        }
      }

      if (bestGroup) {
        bestGroup.messages.push({ ...msg, direction: 'outbound' });
        if (msg.createdAt > bestGroup.lastActivityAt) {
          bestGroup.lastActivityAt = msg.createdAt;
        }
      } else {
        // Orphan admin message — standalone conversation
        const key = msg.email.toLowerCase().trim();
        if (!groups.has(key)) {
          groups.set(key, {
            email: msg.email,
            name: msg.name,
            messages: [],
            lastActivityAt: msg.createdAt,
            pendingCount: 0,
          });
        }
        groups.get(key)!.messages.push({ ...msg, direction: 'outbound' });
      }
    }

    // Sort each conversation's messages chronologically
    for (const group of groups.values()) {
      group.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    // Sort conversations by most recent activity first
    const allConversations = Array.from(groups.values())
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());

    const total = allConversations.length;
    const totalPages = Math.ceil(total / limit);

    // Paginate
    const paginated = allConversations.slice(offset, offset + limit);

    const conversations = paginated.map(g => ({
      email: g.email,
      name: g.name,
      messageCount: g.messages.length,
      pendingCount: g.pendingCount,
      lastActivityAt: g.lastActivityAt.toISOString(),
      messages: g.messages.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message,
        direction: m.direction,
        replyText: m.replyText,
        repliedAt: m.repliedAt?.toISOString() ?? null,
        repliedBy: m.repliedBy,
        createdAt: m.createdAt.toISOString(),
        status: m.repliedAt ? 'replied' : 'pending',
      })),
    }));

    res.json({ conversations, page, limit, total, totalPages });
  } catch (err) {
    console.error('[ContactAdmin] Conversations list error:', err);
    res.status(500).json({ error: 'Failed to load conversations.' });
  }
});

/**
 * PATCH /api/admin/contact-messages/:id/reply
 *
 * Admin-only endpoint. Marks a contact message as replied with the given reply text.
 * Requires a valid admin Bearer token.
 */
router.patch('/:id/reply', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || typeof replyText !== 'string') {
      res.status(400).json({ error: 'replyText is required and must be a string.' });
      return;
    }

    // Get the original message to know recipient
    const original = await prisma.contactMessage.findUnique({ where: { id } });
    if (!original) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    // Send email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const emailText = [
        `Hello ${original.name},`,
        '',
        original.replyText ? replyText.trim() : replyText.trim(),
        '',
        '---',
        'InspectPractice — ICC Building Inspector Exam Preparation',
        'https://inspectpractice.com',
      ].join('\n');

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [original.email],
            reply_to: 'info@inspectpractice.com',
            subject: `Re: [InspectPractice] Contact from ${original.name}`,
            text: emailText,
          }),
        });
      } catch (emailErr) {
        console.error('[ContactAdmin] Email send error:', emailErr);
        // Don't fail — the DB save is the critical part
      }
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        replyText: replyText.trim(),
        repliedAt: new Date(),
        repliedBy: user.id,
      },
    });

    res.json({ success: true, message: updated });
  } catch (err) {
    console.error('[ContactAdmin] Reply error:', err);
    res.status(500).json({ error: 'Failed to mark message as replied.' });
  }
});

/**
 * POST /api/admin/contact-messages/send
 *
 * Admin-only endpoint. Send a new email to any address (proactive outreach).
 * Body: { to, toName?, subject, body }
 */
router.post('/send', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { to, toName, subject, body } = req.body;

    if (!to || !subject || !body) {
      res.status(400).json({ error: 'to, subject, and body are required.' });
      return;
    }

    // Send email via Resend
    let emailSent = false;
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const emailText = [
        `Hello ${toName || to},`,
        '',
        body.trim(),
        '',
        '---',
        'InspectPractice — ICC Building Inspector Exam Preparation',
        'https://inspectpractice.com',
      ].join('\n');

      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [to],
            reply_to: 'info@inspectpractice.com',
            subject,
            text: emailText,
          }),
        });
        emailSent = emailRes.ok;
        if (!emailRes.ok) {
          console.error('[ContactAdmin] Send email error:', emailRes.status, await emailRes.text());
        }
      } catch (emailErr) {
        console.error('[ContactAdmin] Send email error:', emailErr);
      }
    }

    // Record as outbound message
    await prisma.contactMessage.create({
      data: {
        name: toName || to,
        email: to,
        message: `[${subject}]\n\n${body.trim()}`,
        direction: 'outbound',
        source: 'admin_outreach',
        subject,
        repliedBy: user.id,
      },
    });

    res.json({ success: true, emailSent });
  } catch (err) {
    console.error('[ContactAdmin] Send error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

/**
 * DELETE /api/admin/contact-messages/conversation/:email
 *
 * Admin-only endpoint. Deletes all contact messages for a conversation
 * identified by the external user's email. Requires a valid admin Bearer token.
 */
router.delete('/conversation/:email', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);

    await prisma.contactMessage.deleteMany({
      where: { email: { equals: decodedEmail, mode: 'insensitive' } },
    });

    res.json({ success: true, deletedEmail: decodedEmail });
  } catch (err) {
    console.error('[ContactAdmin] Delete conversation error:', err);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

/**
 * DELETE /api/admin/contact-messages/:id
 *
 * Admin-only endpoint. Deletes a contact message by ID.
 * Requires a valid admin Bearer token.
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('[ContactAdmin] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete contact message.' });
  }
});

export default router;
