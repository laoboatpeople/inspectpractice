import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const inbound = await p.contactMessage.findMany({
    where: {
      direction: 'inbound',
      source: { notIn: ['outreach', 'imap_outbound', 'resend_api', 'auto_reply'] },
      createdAt: { gte: new Date('2026-06-01T00:00:00Z') }
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, name: true, email: true, subject: true, createdAt: true, message: true }
  });
  console.log('INBOUND count:', inbound.length);
  if (inbound.length > 0) console.log(JSON.stringify(inbound, null, 2));
  else console.log('No new inbound inquiries since June 1.');
} catch (err) {
  console.error('DB_ERROR:', err.message);
} finally {
  await p.$disconnect();
}
