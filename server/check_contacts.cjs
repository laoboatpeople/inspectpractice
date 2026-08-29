const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const messages = await prisma.contactMessage.findMany({
    where: { repliedAt: null },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(messages, null, 2));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
