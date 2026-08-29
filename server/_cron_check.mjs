import { PrismaClient } from '@prisma/client';

async function main() {
  const p = new PrismaClient();
  try {
    const r = await p.contactMessage.findMany({
      where: {
        repliedAt: null,
        createdAt: { gte: new Date('2026-06-07T21:43:21Z') }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('COUNT:', r.length);
    for (const m of r) {
      console.log(JSON.stringify({
        id: m.id, name: m.name, email: m.email,
        subject: m.subject, message: m.message.substring(0, 300),
        direction: m.direction, source: m.source,
        repliedAt: m.repliedAt, createdAt: m.createdAt
      }));
    }
  } catch (err) {
    console.error('DB_ERROR:', err.message);
  } finally {
    await p.$disconnect();
  }
}

main();
