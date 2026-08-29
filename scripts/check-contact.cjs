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
  const messages = await prisma.contactMessage.findMany({
    where: { repliedAt: null },
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
    createdAt: m.createdAt.toISOString(),
  }));

  console.log(JSON.stringify(output));
}

main()
  .catch((err) => {
    console.error('DB_ERROR:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
