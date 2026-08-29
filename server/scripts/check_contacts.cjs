const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const lastCheck = new Date('2026-06-06T09:10:00Z');

async function main() {
  const messages = await prisma.contactMessage.findMany({
    where: {
      createdAt: { gt: lastCheck },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (messages.length === 0) {
    console.log('NO_NEW_MESSAGES');
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
      replyText: msg.replyText,
      replyBy: msg.repliedBy,
      createdAt: msg.createdAt,
    }));
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
