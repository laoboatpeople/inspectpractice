// Cron job: check new contact messages from DB
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();
const LAST_CHECK_FILE = '/home/chuck/projects/inspectpractice/server/.contact_last_check';

async function main() {
  // Read last check time
  let lastCheckStr: string;
  try {
    lastCheckStr = fs.readFileSync(LAST_CHECK_FILE, 'utf-8').trim();
  } catch {
    lastCheckStr = '2026-06-08T00:00:00.000Z';
  }
  const lastCheck = new Date(lastCheckStr);
  const now = new Date();

  // Get new unreplied messages since last check
  const msgs = await prisma.contactMessage.findMany({
    where: {
      repliedAt: null,
      createdAt: { gte: lastCheck },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Output as JSON for parsing
  const output = {
    lastCheck: lastCheck.toISOString(),
    now: now.toISOString(),
    count: msgs.length,
    messages: msgs.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      direction: m.direction,
      source: m.source,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  console.log(JSON.stringify(output));

  // Write new last check time
  fs.writeFileSync(LAST_CHECK_FILE, now.toISOString());
  fs.writeFileSync('/home/chuck/.hermes/contact_last_check.txt', now.toISOString());

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(JSON.stringify({ error: e.message }));
  prisma.$disconnect();
  process.exit(1);
});
