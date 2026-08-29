#!/usr/bin/env node
/**
 * Fix the 7 "both X and Y" questions:
 * 1. Rewrite the "both X and Y" option text to reference the ACTUAL option
 *    texts (post-reorder), e.g. "both B and C" -> "Both thermal runaway and
 *    memory effect" — so the user sees real content, not letter refs.
 * 2. Correct correctAnswer when the explanation confirms BOTH components as
 *    correct (5 questions). Keep correctAnswer for the 2 where a single
 *    option is genuinely the answer (lead-acid sulfation; AME already D).
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BOTH = /both\s+([A-D])\s+and\s+([A-D])/i;

// Post-reorder option arrays (verified above). Letter = position 0..3.
const TARGETS = [
  {
    id: "56163fc5-2872-4c5b-8e63-8727bdb6d97a", // multimeter
    letters: ["A", "B"], // "Both A and B" -> options at idx 0 and 1
    correct: "D", // explanation: AC/DC setting AND highest range = both
  },
  {
    id: "47b77eba-b98c-47f9-a828-629eb403e60e", // carbureted idle
    letters: ["B", "C"],
    correct: "D",
  },
  {
    id: "cc30f0cb-7e9b-4f0e-beaa-e8025e1cb04a", // AME modification
    letters: ["A", "C"],
    correct: "D", // already D — just rewrite text
  },
  {
    id: "c4a603b0-ab45-40cf-9fdb-c80e77867043", // nickel-cadmium
    letters: ["B", "C"],
    correct: "D",
  },
  {
    id: "dc835a77-3d55-4d15-a284-f5768cb30bf2", // wire bundle
    letters: ["B", "C"],
    correct: "D",
  },
  {
    id: "0bdc59aa-9c3e-45ac-952c-124a77779169", // lead-acid
    letters: ["B", "C"],
    correct: "A", // keep A (sulfation) — both is a distractor here
  },
  {
    id: "3b4fa351-75ad-4ddc-a531-4817053cbe72", // carburetor throttle
    letters: ["A", "B"],
    correct: "C", // both at idx 2 = C
  },
];

const clean = (s) => s.replace(/^[A-H][).:\s]+/, "").trim();

(async () => {
  for (const t of TARGETS) {
    const q = await prisma.question.findUnique({
      where: { id: t.id },
      select: { id: true, options: true, options_fr: true, correctAnswer: true, question: true },
    });
    if (!q) {
      console.log("MISSING", t.id);
      continue;
    }
    const opts = [...q.options];
    const bi = opts.findIndex((o) => BOTH.test(o));
    if (bi === -1) {
      console.log("NO BOTH OPTION", t.id);
      continue;
    }
    const l1 = t.letters[0];
    const l2 = t.letters[1];
    const idx1 = l1.charCodeAt(0) - 65;
    const idx2 = l2.charCodeAt(0) - 65;
    const text1 = clean(opts[idx1] || "?");
    const text2 = clean(opts[idx2] || "?");
    opts[bi] = `Both ${text1} and ${text2}`;

    let frOpts = null;
    if (q.options_fr) {
      try {
        frOpts = JSON.parse(q.options_fr);
        const frBi = frOpts.findIndex((o) => /à la fois|both/i.test(o));
        if (frBi !== -1) {
          const frText1 = clean(frOpts[idx1] || "?");
          const frText2 = clean(frOpts[idx2] || "?");
          frOpts[frBi] = `À la fois ${frText1} et ${frText2}`;
        }
      } catch {}
    }

    const update = {
      options: opts,
      correctAnswer: t.correct,
      ...(frOpts ? { options_fr: JSON.stringify(frOpts) } : {}),
    };
    await prisma.question.update({ where: { id: q.id }, data: update });
    console.log("FIXED", q.id);
    console.log("  Q:", q.question.slice(0, 60));
    console.log("  opts:", JSON.stringify(opts));
    console.log("  fr  :", JSON.stringify(frOpts));
    console.log("  ca  :", q.correctAnswer, "->", t.correct);
    console.log();
  }
  await prisma.$disconnect();
})();
