import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const msgs = await p.contactMessage.findMany({ where: { repliedAt: null }, orderBy: { createdAt: 'desc' }, take: 10 });
  console.log(JSON.stringify(msgs, null, 2));
} finally {
  await p.$disconnect();
}
