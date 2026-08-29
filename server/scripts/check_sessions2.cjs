const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, source: true, topic: true, createdAt: true }
  });
  console.log('Sessions:', JSON.stringify(sessions, null, 2));
}
main().catch(e => console.error('Error:', e.message, e.stack?.slice(0, 200))).finally(() => prisma.$disconnect());
