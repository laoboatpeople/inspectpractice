import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const msgs = await prisma.contactMessage.findMany({
    where: {
      repliedAt: null,
      createdAt: { gte: new Date('2026-06-07T11:43:03Z') }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(msgs, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
