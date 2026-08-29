const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lastCheck = new Date('2026-06-06T11:15:00Z');
  const messages = await prisma.contactMessage.findMany({
    where: {
      direction: 'inbound',
      createdAt: { gt: lastCheck },
      repliedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (messages.length === 0) {
    console.log('NO_NEW_INBOUND');
    await prisma.$disconnect();
    return;
  }

  for (const msg of messages) {
    console.log('--- MESSAGE ---');
    console.log(JSON.stringify({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      direction: msg.direction,
      source: msg.source,
      repliedAt: msg.repliedAt,
      createdAt: msg.createdAt,
    }));
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
