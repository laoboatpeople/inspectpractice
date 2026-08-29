#!/usr/bin/env node
/**
 * Clean letter-prefixed options (A), B), C), D)) at the SOURCE in DB.
 *
 * Why: the quiz UI already renders its own A/B/C/D labels
 * (String.fromCharCode(65 + idx)). Options stored WITH prefixes ("A) text")
 * render as "A A) text" — duplicated prefix. Also EN options were stored in
 * RANDOM order (A, D, C, B) while correctAnswer is a letter, so the letter
 * must be matched to the option carrying that prefix.
 *
 * Fix: for every question where correctAnswer is a single letter AND all
 * options carry letter prefixes:
 *   1. Reorder options by their prefix letter (A → first, B → second, ...)
 *   2. Strip the prefix from each option text (EN and FR)
 *   3. Keep correctAnswer unchanged (the letter now equals the position)
 *
 * Full-text correctAnswer questions (TP14038E format) are NOT touched.
 * Questions with plain (unprefixed) options are NOT touched.
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const PREFIX = /^([A-H])[).:\s]+/;
const LETTER = /^[A-H]$/;

function stripPrefix(opt) {
  return opt.replace(PREFIX, "").trim();
}

function reorderByPrefix(opts) {
  const keyed = opts.map((o, i) => {
    const m = PREFIX.exec(o);
    return { letter: m ? m[1] : String.fromCharCode(65 + i), text: o, idx: i };
  });
  keyed.sort((a, b) => a.letter.localeCompare(b.letter));
  return keyed.map((k) => stripPrefix(k.text));
}

(async () => {
  const qs = await prisma.question.findMany({
    select: { id: true, options: true, options_fr: true, correctAnswer: true },
  });

  const backup = [];
  let updated = 0;
  let skipped = 0;

  for (const q of qs) {
    const opts = q.options || [];
    const ca = String(q.correctAnswer || "").trim();
    if (!LETTER.test(ca)) {
      skipped++; // full-text ca — do not touch
      continue;
    }
    const prefCount = opts.filter((o) => PREFIX.test(o)).length;
    if (prefCount !== opts.length) {
      skipped++; // plain or partial — do not touch
      continue;
    }

    const newOpts = reorderByPrefix(opts);
    let newOptsFr = null;
    if (q.options_fr) {
      try {
        const fr = JSON.parse(q.options_fr);
        if (fr.length === opts.length && fr.every((o) => PREFIX.test(o))) {
          newOptsFr = JSON.stringify(reorderByPrefix(fr));
        }
      } catch {
        newOptsFr = null;
      }
    }

    backup.push({
      id: q.id,
      options: q.options,
      options_fr: q.options_fr,
      correctAnswer: q.correctAnswer,
    });

    await prisma.question.update({
      where: { id: q.id },
      data: { options: newOpts, ...(newOptsFr ? { options_fr: newOptsFr } : {}) },
    });
    updated++;
  }

  fs.writeFileSync(
    "/home/chuck/projects/inspectpractice/server/backups/prefix_clean_20260805.json",
    JSON.stringify(backup, null, 2)
  );
  console.log(`Updated: ${updated} | Skipped (plain/fulltext): ${skipped}`);
  console.log("Backup: server/backups/prefix_clean_20260805.json");
  await prisma.$disconnect();
})();
