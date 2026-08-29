#!/usr/bin/env node
const { PrismaClient } = require('/home/chuck/projects/inspectpractice/server/node_modules/@prisma/client');
const dotenv = require('/home/chuck/projects/inspectpractice/server/node_modules/dotenv');
const path = require('path');
const fs = require('fs');

// Load env from server's .env
const envPath = path.join(__dirname, '..', 'server', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const parsed = dotenv.parse(envContent);
process.env.DATABASE_URL = parsed.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  // Find inbound messages that haven't been replied to
  const messages = await prisma.contactMessage.findMany({
    where: {
      direction: "inbound",
      repliedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  if (messages.length === 0) {
    console.log('NO_NEW_MESSAGES');
    return;
  }

  const output = messages.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    direction: m.direction,
    source: m.source,
    createdAt: m.createdAt.toISOString(),
  }));

  // Also get total counts for diagnostics
  const totalInbound = await prisma.contactMessage.count({ where: { direction: "inbound" } });
  const totalUnreplied = await prisma.contactMessage.count({ where: { direction: "inbound", repliedAt: null } });
  const totalOutbound = await prisma.contactMessage.count({ where: { direction: "outbound" } });

  console.log(JSON.stringify({
    messages: output,
    stats: {
      total_inbound: totalInbound,
      inbound_unreplied: totalUnreplied,
      total_outbound: totalOutbound,
    }
  }));
}

main()
  .catch((err) => {
    console.error('DB_ERROR:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
