import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const lastCheckStr = process.env.LAST_CHECK || '2026-06-08T12:00:00.000Z';
  const lastCheck = new Date(lastCheckStr);

  console.error(`[ContactCron] Last check: ${lastCheck.toISOString()}, Now: ${now.toISOString()}`);

  const msgs = await prisma.contactMessage.findMany({
    where: {
      repliedAt: null,
      createdAt: { gte: lastCheck },
      source: 'contact_form',
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log(JSON.stringify(msgs, null, 2));

  // Update last check file
  const fs = await import('fs');
  fs.writeFileSync('.contact_last_check', now.toISOString());
  fs.writeFileSync('../.hermes/contact_last_check.txt', now.toISOString());

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
