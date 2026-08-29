import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const msgs = await p.contactMessage.findMany({
    where: {
      repliedAt: null,
      direction: 'inbound',
      source: { in: ['contact_form', 'imap_inbound'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  console.log(JSON.stringify({ count: msgs.length, messages: msgs }, null, 2));
} catch (err) {
  console.error('DB_ERROR:', err.message);
} finally {
  await p.$disconnect();
}
