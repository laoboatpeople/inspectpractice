#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const BASE_DELAY_MS = 1200;  // increased to 1.2s between calls
const REPORT_INTERVAL = 50;
const MAX_RETRIES = 5;

/**
 * Call MyMemory API to translate a single text from en to fr.
 * Implements exponential backoff on 429 rate limits.
 */
async function translateText(text, retryCount = 0) {
  if (!text || text.trim().length === 0) return text;

  const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|fr`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        const backoff = Math.pow(2, retryCount + 1) * 1000; // 2s, 4s, 8s, 16s, 32s
        console.warn(`  WARN: Rate limited (429), retry ${retryCount + 1}/${MAX_RETRIES} after ${backoff}ms`);
        await sleep(backoff);
        return translateText(text, retryCount + 1);
      }
      console.warn(`  WARN: MyMemory returned HTTP ${response.status} for: "${text.substring(0, 60)}..."`);
      return null;
    }
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    } else if (data.responseStatus === 429 && retryCount < MAX_RETRIES) {
      const backoff = Math.pow(2, retryCount + 1) * 1000;
      console.warn(`  WARN: Rate limited (429 in body), retry ${retryCount + 1}/${MAX_RETRIES} after ${backoff}ms`);
      await sleep(backoff);
      return translateText(text, retryCount + 1);
    } else {
      console.warn(`  WARN: MyMemory responseStatus ${data.responseStatus} for: "${text.substring(0, 60)}..."`);
      return null;
    }
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const backoff = Math.pow(2, retryCount + 1) * 1000;
      console.warn(`  WARN: Network error, retry ${retryCount + 1}/${MAX_RETRIES} after ${backoff}ms: ${err.message}`);
      await sleep(backoff);
      return translateText(text, retryCount + 1);
    }
    console.warn(`  ERROR: Network/fetch error translating: "${text.substring(0, 60)}..." - ${err.message}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== Pre-translate Script (v2 - with backoff) ===');
  console.log('Fetching all questions where question_fr IS NULL...\n');

  const questions = await prisma.question.findMany({
    where: { question_fr: null },
    orderBy: { createdAt: 'asc' },
  });

  const total = questions.length;
  console.log(`Found ${total} questions to translate.\n`);

  if (total === 0) {
    console.log('Nothing to do. Exiting.');
    await prisma.$disconnect();
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < total; i++) {
    const q = questions[i];
    const idx = i + 1;
    const shortId = q.id.substring(0, 8);

    console.log(`[${idx}/${total}] Question ${shortId}: translating question text...`);
    const translatedQuestion = await translateText(q.question);
    if (!translatedQuestion) {
      console.log(`  -> FAILED to translate question text (skipping this question)`);
      failCount++;
      await sleep(BASE_DELAY_MS);
      continue;
    }

    await sleep(BASE_DELAY_MS);

    console.log(`  -> translating explanation...`);
    const translatedExplanation = q.explanation ? await translateText(q.explanation) : null;
    await sleep(BASE_DELAY_MS);

    console.log(`  -> translating ${q.options.length} options...`);
    const translatedOptions = [];
    for (const opt of q.options) {
      const translated = await translateText(opt);
      translatedOptions.push(translated || opt);
      await sleep(BASE_DELAY_MS);
    }

    try {
      await prisma.question.update({
        where: { id: q.id },
        data: {
          question_fr: translatedQuestion,
          explanation_fr: translatedExplanation,
          options_fr: JSON.stringify(translatedOptions),
        },
      });
      successCount++;
      console.log(`  -> SAVED OK`);
    } catch (dbErr) {
      console.log(`  -> DB ERROR: ${dbErr.message}`);
      failCount++;
    }

    if ((i + 1) % REPORT_INTERVAL === 0) {
      console.log(`\n*** Progress: ${idx}/${total} (${successCount} OK, ${failCount} failed) ***\n`);
    }
  }

  console.log('\n=== Translation Complete ===');
  console.log(`Total: ${total}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Fatal error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
