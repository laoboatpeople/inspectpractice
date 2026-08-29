import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const msgs = await p.contactMessage.findMany({
    where: { repliedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: { id: true, name: true, email: true, direction: true, source: true, subject: true, createdAt: true, message: true }
  });
  for (const m of msgs) {
    console.log(`[${m.createdAt.toISOString()}] ${m.direction}/${m.source} | ${m.name} <${m.email}> | Subj: ${m.subject || '(none)'} | Msg: ${m.message.substring(0, 80)}`);
  }
} catch (err) {
  console.error('DB_ERROR:', err.message);
} finally {
  await p.$disconnect();
}
