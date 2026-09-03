#!/usr/bin/env node
/**
 * Export theory chapters to a static JSON consumed by SSG pages at /theory/[id].
 * Run after any theory content change (from repo root):
 *   node server/scripts/export-theory.cjs
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: true });

async function main() {
  const prisma = new PrismaClient();
  const rows = await prisma.$queryRawUnsafe(
    `SELECT c.id AS id, c.number AS number, c.name AS name, c.theory_content AS content, e.code AS code
     FROM chapters c JOIN exams e ON e.id = c.exam_id
     WHERE c.is_active = true ORDER BY e.code, c.number`
  );
  const out = rows
    .filter((r) => r && r.id && r.content && r.content.trim().length > 0)
    .map((r) => ({ id: String(r.id), number: Number(r.number) || 0, name: String(r.name || 'Chapter'), content: r.content, code: String(r.code || '') }));
  const target = path.join(__dirname, '..', '..', 'client', 'src', 'data', 'theory-data.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(out));
  console.log(`Exported ${out.length} chapters to ${target} (${(fs.statSync(target).size / 1024).toFixed(0)} KB)`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
