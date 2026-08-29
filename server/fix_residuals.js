#!/usr/bin/env node
/**
 * Fix residual prefixed options:
 * CAT1: fulltext correctAnswer + EN options prefixed (43) — strip prefixes
 *       from BOTH options and correctAnswer (keep exact-match semantics).
 * CAT2: letter correctAnswer + EN plain + FR options prefixed (115) — strip
 *       prefixes from FR options only.
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PREFIX = /^([A-H])[).:]\s/;
const LETTER = /^[A-H]$/;

const strip = (s) => s.replace(PREFIX, "").trim();

(async () => {
  const qs = await prisma.question.findMany({
    select: { id: true, options: true, options_fr: true, correctAnswer: true },
  });
  let cat1 = 0;
  let cat2 = 0;
  const backups = [];

  for (const q of qs) {
    const opts = q.options || [];
    const ca = String(q.correctAnswer || "").trim();
    const enPref = opts.some((o) => PREFIX.test(o));
    let fr = [];
    let frPref = false;
    if (q.options_fr) {
      try {
        fr = JSON.parse(q.options_fr);
        frPref = fr.some((o) => PREFIX.test(o));
      } catch {}
    }

    let newOpts = opts;
    let newCa = ca;
    let newFr = q.options_fr;

    if (!LETTER.test(ca) && enPref) {
      // CAT1: fulltext ca + EN prefixed
      newOpts = opts.map(strip);
      newCa = strip(ca);
      if (frPref) newFr = JSON.stringify(fr.map(strip));
      cat1++;
    } else if (LETTER.test(ca) && !enPref && frPref) {
      // CAT2: letter ca + EN plain + FR prefixed
      newFr = JSON.stringify(fr.map(strip));
      cat2++;
    } else {
      continue;
    }

    backups.push({ id: q.id, options: q.options, options_fr: q.options_fr, correctAnswer: q.correctAnswer });
    await prisma.question.update({
      where: { id: q.id },
      data: { options: newOpts, correctAnswer: newCa, options_fr: newFr },
    });
  }

  const fs = require("fs");
  fs.writeFileSync(
    "/home/chuck/projects/inspectpractice/server/backups/prefix_residuals_20260805.json",
    JSON.stringify(backups, null, 2)
  );
  console.log(`CAT1 fixed (fulltext): ${cat1} | CAT2 fixed (FR-only): ${cat2}`);
  console.log("Backup: server/backups/prefix_residuals_20260805.json");
  await prisma.$disconnect();
})();
