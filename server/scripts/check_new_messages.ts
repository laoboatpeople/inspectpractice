import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Last check: 2026-06-07T13:18:32Z
  const lastCheck = new Date('2026-06-07T13:18:32Z');
  
  const msgs = await prisma.contactMessage.findMany({
    where: {
      createdAt: { gte: lastCheck },
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
