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
process.env.RESEND_API_KEY = parsed.RESEND_API_KEY;

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  const messages = await prisma.contactMessage.findMany({
    where: {
      repliedAt: null,
      direction: 'inbound',
      source: { in: ['contact_form', 'imap_inbound'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  if (messages.length === 0) {
    console.log('NO_NEW_INBOUND_MESSAGES');
    return;
  }

  for (const m of messages) {
    console.log(`--- MESSAGE ---`);
    console.log(`ID: ${m.id}`);
    console.log(`From: ${m.name} <${m.email}>`);
    console.log(`Subject: ${m.subject || '(no subject)'}`);
    console.log(`Source: ${m.source}`);
    console.log(`Date: ${m.createdAt.toISOString()}`);
    console.log(`Message:`);
    console.log(m.message);
    console.log();
  }
}

main()
  .catch((err) => {
    console.error('DB_ERROR:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
