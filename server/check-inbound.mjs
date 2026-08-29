import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const msgs = await p.contactMessage.findMany({
    where: {
      repliedAt: null,
      direction: 'inbound',
      source: 'contact_form',
      // Only messages that look like genuine inquiries (not our outbound logs)
      createdAt: { gte: new Date('2026-06-01T00:00:00Z') }
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  console.log(JSON.stringify(msgs, null, 2));
} catch (err) {
  console.error('DB_ERROR:', err.message);
} finally {
  await p.$disconnect();
}
