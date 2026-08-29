#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SOURCE = 'tp14038e-exhaustive-2026-05-08';
const TARGET_SOURCE = 'tp14038e-exhaustive-2026-05-08-v2';
const OUT_DIR = path.join(process.cwd(), 'artifacts', TARGET_SOURCE);

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function subtopicFromExplanation(exp) {
  const m = exp?.match(/\[Subtopic:\s*([^\]]+)\]/i);
  return m ? m[1].trim() : 'Sous-topic non précisé';
}

function seededPick(arr, seed) {
  let x = 0;
  for (const c of seed) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  return arr[x % arr.length];
}

function tokenSet(s) {
  return new Set(norm(s).split(' ').filter(Boolean));
}

function jaccard(a, b) {
  const A = tokenSet(a), B = tokenSet(b);
  const inter = [...A].filter(t => B.has(t)).length;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
}

async function rewriteOne(q, chapterName) {
  const payload = {
    id: q.id,
    difficulty: q.difficulty,
    subtopic: subtopicFromExplanation(q.explanation),
    oldQuestion: q.question,
  };

  const system = `Tu es chef examinateur AME Canada. Tu rédiges UNE question QCM style Transport Canada TP14038E, indistinguable d'un vrai examen.\nRègles: scénario AMO réaliste, 4 options plausibles, une seule meilleure réponse, explication 2-4 phrases, français pro aviation.\nRetourne JSON strict: {"item":{id,question,options,correctAnswer,explanation,difficulty}}`;
  const user = `Chapitre: ${chapterName}\nRéécris cet item:\n${JSON.stringify(payload)}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
  });
  const parsed = JSON.parse(res.choices?.[0]?.message?.content || '{}');
  const i = parsed.item;
  if (!i || !Array.isArray(i.options) || i.options.length !== 4 || !i.options.includes(i.correctAnswer)) {
    throw new Error(`rewriteOne invalide ${q.id}`);
  }
  return {
    id: q.id,
    question: String(i.question || '').trim(),
    options: i.options.map(o => String(o).trim()),
    correctAnswer: String(i.correctAnswer || '').trim(),
    explanation: `${String(i.explanation || '').trim()} [Subtopic: ${subtopicFromExplanation(q.explanation)}]`,
    difficulty: q.difficulty,
  };
}

async function rewriteBatch(batch, chapterName) {
  const payload = batch.map(q => ({
    id: q.id,
    difficulty: q.difficulty,
    subtopic: subtopicFromExplanation(q.explanation),
    oldQuestion: q.question,
  }));

  const system = `Tu es chef examinateur AME Canada. Tu rédiges des questions QCM de style Transport Canada indistinguables d'un vrai examen TP14038E.\nRègles STRICTES:\n- Français professionnel aviation maintenance.\n- Chaque item = scénario AMO réaliste (troubleshooting, conformité CARs, release, dossiers techniques, HF/SMS).\n- 4 options plausibles, une seule meilleure réponse.\n- Éviter formulations templates/répétitives.\n- Conserver niveau de difficulté demandé.\n- Inclure logique technique/réglementaire dans explication, 2-4 phrases.\n- Ne pas utiliser "toutes ces réponses".\n- L'option correcte doit être reproduite exactement dans correctAnswer.\nRetourne UNIQUEMENT du JSON valide: {"items":[{id,question,options,correctAnswer,explanation,difficulty}]}`;

  const user = `Chapitre: ${chapterName}\nRéécris ces items (${batch.length}) en conservant id et difficulty:\n${JSON.stringify(payload)}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      });
      const text = res.choices?.[0]?.message?.content || '{}';
      const parsed = JSON.parse(text);
      if (!parsed.items || !Array.isArray(parsed.items)) throw new Error('items manquant');
      const byId = new Map(parsed.items.map(i => [i.id, i]));
      const out = [];
      for (const q of batch) {
        const i = byId.get(q.id);
        if (!i) throw new Error(`id manquant ${q.id}`);
        if (!Array.isArray(i.options) || i.options.length !== 4) throw new Error(`options invalides ${q.id}`);
        if (!i.options.includes(i.correctAnswer)) throw new Error(`correctAnswer pas dans options ${q.id}`);
        out.push({
          id: q.id,
          question: String(i.question || '').trim(),
          options: i.options.map(o => String(o).trim()),
          correctAnswer: String(i.correctAnswer || '').trim(),
          explanation: `${String(i.explanation || '').trim()} [Subtopic: ${subtopicFromExplanation(q.explanation)}]`,
          difficulty: q.difficulty,
        });
      }
      return out;
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rows = await prisma.question.findMany({
    where: { aiSource: SOURCE },
    include: { chapter: true, exam: true },
    orderBy: [{ chapterId: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }]
  });

  if (rows.length !== 300) throw new Error(`Attendu 300, trouvé ${rows.length}`);

  const beforeByChapter = {};
  const beforeByDiff = {};
  for (const r of rows) {
    beforeByChapter[r.chapter.name] = (beforeByChapter[r.chapter.name] || 0) + 1;
    beforeByDiff[r.difficulty] = (beforeByDiff[r.difficulty] || 0) + 1;
  }

  const rewritten = [];
  const grouped = new Map();
  for (const r of rows) {
    const k = `${r.chapter.id}::${r.chapter.name}`;
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push(r);
  }

  for (const [k, items] of grouped.entries()) {
    const chapterName = k.split('::')[1];
    for (let i = 0; i < items.length; i += 10) {
      const batch = items.slice(i, i + 10);
      let rr;
      try {
        rr = await rewriteBatch(batch, chapterName);
      } catch (e) {
        rr = [];
        for (const q of batch) {
          rr.push(await rewriteOne(q, chapterName));
        }
      }
      rewritten.push(...rr);
      console.log(`Rewritten ${chapterName}: ${Math.min(i + 10, items.length)}/${items.length}`);
    }
  }

  // update DB (no new rows)
  let updates = 0;
  for (let i = 0; i < rewritten.length; i += 25) {
    const chunk = rewritten.slice(i, i + 25);
    await prisma.$transaction(chunk.map(item => prisma.question.update({
      where: { id: item.id },
      data: {
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        difficulty: item.difficulty,
        status: 'PENDING',
        aiSource: TARGET_SOURCE,
      }
    })));
    updates += chunk.length;
  }

  // QA metrics
  const after = await prisma.question.findMany({
    where: { aiSource: TARGET_SOURCE },
    include: { chapter: true },
    orderBy: { id: 'asc' }
  });

  const exactMap = new Map();
  for (const q of after) {
    const n = norm(q.question);
    exactMap.set(n, (exactMap.get(n) || 0) + 1);
  }
  const exactDupQuestions = [...exactMap.values()].filter(v => v > 1).reduce((a, b) => a + (b - 1), 0);

  let fuzzyPairs = 0;
  for (let i = 0; i < after.length; i++) {
    for (let j = i + 1; j < after.length; j++) {
      if (jaccard(after[i].question, after[j].question) >= 0.85) fuzzyPairs++;
    }
  }

  const afterByChapter = {};
  const afterByDiff = {};
  for (const r of after) {
    afterByChapter[r.chapter.name] = (afterByChapter[r.chapter.name] || 0) + 1;
    afterByDiff[r.difficulty] = (afterByDiff[r.difficulty] || 0) + 1;
  }

  const beforeMap = new Map(rows.map(r => [r.id, r]));
  const beforeAfterExamples = after.slice(0, 10).map(a => ({
    id: a.id,
    chapter: a.chapter.name,
    difficulty: a.difficulty,
    beforeQuestion: beforeMap.get(a.id).question,
    afterQuestion: a.question,
  }));

  const shuffled = [...after].sort((a, b) => (a.id > b.id ? 1 : -1));
  const sample20 = [];
  for (let i = 0; i < 20; i++) {
    const pick = shuffled[(i * 13) % shuffled.length];
    sample20.push({
      id: pick.id,
      chapter: pick.chapter.name,
      difficulty: pick.difficulty,
      question: pick.question,
      options: pick.options,
      correctAnswer: pick.correctAnswer,
      explanation: pick.explanation,
      status: pick.status,
      aiSource: pick.aiSource,
    });
  }

  const report = {
    timestamp: new Date().toISOString(),
    source: SOURCE,
    targetSource: TARGET_SOURCE,
    totalRowsBefore: rows.length,
    totalRowsUpdated: updates,
    totalRowsAfter: after.length,
    uniqueness: {
      exactDuplicateQuestions: exactDupQuestions,
      exactUniquenessRate: Number((((after.length - exactDupQuestions) / after.length) * 100).toFixed(2)),
      fuzzyNearDuplicatePairs_jaccard_ge_0_85: fuzzyPairs,
    },
    distribution: {
      difficultyBefore: beforeByDiff,
      difficultyAfter: afterByDiff,
      chapterBefore: beforeByChapter,
      chapterAfter: afterByChapter,
      coveragePreserved100: JSON.stringify(beforeByChapter) === JSON.stringify(afterByChapter),
    },
    sampleBeforeAfter: beforeAfterExamples,
    randomSample20Path: path.join(OUT_DIR, 'tp14038e_v2_sample20.json'),
  };

  fs.writeFileSync(path.join(OUT_DIR, 'tp14038e_v2_qa_report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'tp14038e_v2_sample20.json'), JSON.stringify(sample20, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'tp14038e_v2_full_rewrite_preview.json'), JSON.stringify(rewritten, null, 2));

  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
