'use client';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

// In-memory cache
const translationCache = new Map<string, { question: string; explanation: string; options: string[] }>();

export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  if (!text || fromLang === toLang) return text;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;

  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    const res = await fetch(url, controller ? { signal: controller.signal } : undefined);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function translateQuestion(
  question: { id: string; question?: string; explanation?: string; options?: string[] },
  toLang: string
) {
  if (toLang === 'en') return question;

  const cacheKey = `${question.id}-${toLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return {
      ...question,
      question: cached.question,
      explanation: cached.explanation,
      options: cached.options,
    };
  }

  const [q, expl] = await Promise.all([
    question.question
      ? translateText(question.question, 'en', toLang)
      : Promise.resolve(question.question),
    question.explanation
      ? translateText(question.explanation, 'en', toLang)
      : Promise.resolve(question.explanation),
  ]);

  const opts = question.options
    ? await Promise.all(question.options.map((o: string) => translateText(o, 'en', toLang)))
    : question.options;

  translationCache.set(cacheKey, {
    question: q!,
    explanation: expl!,
    options: opts ?? [],
  });

  return { ...question, question: q, explanation: expl, options: opts };
}

export async function translateQuestions(
  questions: { id: string; question?: string; explanation?: string; options?: string[] }[],
  toLang: string
): Promise<{ id: string; question?: string; explanation?: string; options?: string[] }[]> {
  if (toLang === 'en') return questions;
  return Promise.all(questions.map((q) => translateQuestion(q, toLang)));
}
