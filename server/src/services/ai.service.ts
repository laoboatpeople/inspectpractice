import OpenAI from 'openai';
import { z } from 'zod';
import { prisma } from '../config/database';
import { env } from '../config/env';

// ─── Types ─────────────────────────────────────────────────────

export type QType = 'MCQ' | 'TRUEFALSE' | 'WRITTEN';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface GenerateOptions {
  examId: string;
  chapterId: string;
  type: QType;
  difficulty: Difficulty;
  count: number;
}

// ─── OpenAI client ─────────────────────────────────────────────

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL });

// ─── Output schemas (Zod) ─────────────────────────────────────

const mcqSchema = z.object({
  question: z.string().min(20),
  options: z.array(z.string().min(2)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(40),
}).superRefine((q, ctx) => {
  // correctAnswer must match an option text exactly.
  if (!q.options.includes(q.correctAnswer)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'correctAnswer must match one option text exactly',
      path: ['correctAnswer'],
    });
  }
});

const trueFalseSchema = z.object({
  question: z.string(),
  correctAnswer: z.enum(['TRUE', 'FALSE']),
  explanation: z.string(),
});

const writtenSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

// ─── Quality guards ─────────────────────────────────────────────

function hasGenericPlaceholderOptions(options: string[]): boolean {
  const normalized = options.map((o) => o.trim().toUpperCase());
  const placeholders = new Set(['A', 'B', 'C', 'D', 'OPTION A', 'OPTION B', 'OPTION C', 'OPTION D']);
  return normalized.every((o) => placeholders.has(o));
}

function looksMemorizationOnly(question: string): boolean {
  const q = question.toLowerCase();
  return (
    q.startsWith('what does ') ||
    q.startsWith('define ') ||
    q.startsWith('which of the following is the definition')
  );
}

function hasScenarioSignal(question: string): boolean {
  const q = question.toLowerCase();
  const signals = [
    'during', 'after', 'while', 'inspection', 'defect', 'violation', 'deficiency',
    'code', 'building', 'foundation', 'framing', 'egress', 'fire', 'electrical',
    'plumbing', 'mechanical', 'install', 'noncompliant'
  ];
  return signals.some((s) => q.includes(s));
}

function passesQualityGuards(item: Record<string, unknown>, type: QType): boolean {
  if (type !== 'MCQ') return true;

  const question = String(item.question ?? '').trim();
  const explanation = String(item.explanation ?? '').trim();
  const options = Array.isArray(item.options) ? item.options.map((x) => String(x)) : [];
  const correct = String(item.correctAnswer ?? '').trim();

  if (!question || !explanation || options.length !== 4 || !correct) return false;
  if (hasGenericPlaceholderOptions(options)) return false;
  if (!options.includes(correct)) return false;
  if (looksMemorizationOnly(question)) return false;
  if (!hasScenarioSignal(question)) return false;

  const hasRefSignal = /IRC\s?R\d{3}|IBC\s?\d{3}|NEC\s?\d{2}\.\d{2}|IPC\s?\d{3}|IMC\s?\d{3}/i.test(explanation);
  if (!hasRefSignal) return false;

  return true;
}


// ─── Prompt builders ───────────────────────────────────────────

function buildSystemPrompt(type: QType, difficulty: Difficulty): string {
  const mcqRules = `
CRITICAL — MCQ FORMAT: You MUST return a JSON ARRAY where each element is:
{
  "question": "string",
  "options": ["real option 1", "real option 2", "real option 3", "real option 4"],
  "correctAnswer": "exact text of one option",
  "explanation": "detailed explanation with IRC/IBC/NEC/IPC/IMC reference cue"
}
Rules:
- MUST return a JSON ARRAY (not an object, not wrapped in { questions: [] })
- options MUST be exactly 4 plausible full-text distractors
- NEVER use placeholder options like "A", "B", "C", "D"
- correctAnswer MUST match one option text exactly
- explanation MUST be non-empty, practical, and include at least one code reference cue (e.g., IRC R302, IBC 1005, NEC 210.8, IPC 903, IMC 601)
- Every question MUST be scenario-based (field inspection/code enforcement context), not memorization-only
- Return ONLY the array — no markdown, no preamble, no commentary.`;

  const base = `You are an International Code Council (ICC) building inspector examination generator AI.

Your goal is to generate extremely realistic ICC certification exam questions based on the official ICC exam catalog and the current International Codes: the International Residential Code (IRC), International Building Code (IBC), National Electrical Code (NEC), International Plumbing Code (IPC), and International Mechanical Code (IMC).

IMPORTANT:
The questions must simulate REAL ICC exam logic and philosophy, not generic textbook quizzes.

The exam style MUST prioritize:

* scenario-based reasoning
* code interpretation
* field inspection judgment
* code compliance decision making
* “best answer” logic
* practical application
* real building inspection environments
* inspection report situations
* inspection findings
* defect analysis
* human factors
* code exceptions
* minimum code requirements
* safety implications

The questions must test UNDERSTANDING, not memorization.

==================================================
EXAM STYLE REQUIREMENTS
=======================

Generate questions similar to real ICC certification exams:

* Multiple choice
* 4 answer choices
* One best answer
* Distractors must be plausible
* Questions should often contain:

  * building inspection scenarios
  * inspector field reports
  * defect symptoms
  * code compliance situations
  * code interpretations
  * inspection records
  * plan review procedures
  * inspection findings

Questions should frequently require:

* interpreting IRC/IBC/NEC/IPC/IMC provisions
* determining code compliance
* identifying the correct inspection action
* determining proper inspection steps
* determining correct documentation
* identifying applicable code sections
* analyzing inspection situations

DO NOT generate simple memorization-only questions unless necessary.

==================================================
QUESTION DISTRIBUTION
=====================

Distribute questions according to realistic ICC emphasis:

HIGH PRIORITY:

* code administration
* building planning
* footings and foundations
* floor framing
* wall framing
* roof and ceiling framing
* means of egress
* fire safety
* electrical systems
* plumbing systems
* mechanical systems
* inspection procedures
* code compliance
* safety hazards
* inspector responsibilities

MEDIUM PRIORITY:

* formulas
* pure theory
* definitions
* historical information

==================================================
SUBJECTS TO COVER
=================

Use the ICC exam catalog topics exhaustively.

Generate questions for ALL applicable topics:

---

## Code Administration

* permit requirements
* inspections required
* inspection authority
* right of entry
* notice of violation
* stop-work orders
* certificate of occupancy
* records and reports
* liability and immunity
* enforcement procedures
* scope and applicability
* definitions
* IRC Chapter 1 administration

---

## Building Planning

* occupancy and use
* light and ventilation
* minimum room areas
* ceiling heights
* glazing and safety glass
* means of egress
* egress doors
* egress windows
* stairways
* ramps
* guards
* smoke alarms
* emergency escape and rescue openings
* IRC Chapter 3 building planning

---

## Footings & Foundations

* soil bearing capacity
* footing sizes and reinforcement
* foundation walls
* concrete and masonry
* dampproofing and waterproofing
* termite protection
* wood foundations
* frost-protected shallow foundations
* foundation drainage
* anchoring requirements
* IRC Chapter 4 foundations

---

## Floors

* floor framing
* floor joists
* cantilevers
* girders
* floor sheathing
* concrete slabs on grade
* vapor barriers
* under-floor inspection
* IRC Chapter 5 floors

---

## Walls

* wall framing
* studs and headers
* wall bracing
* shear walls
* exterior wall coverings
* interior wall coverings
* fire separation
* IRC Chapter 6 wall construction

---

## Roof / Ceiling

* roof framing
* ceiling joists and rafters
* roof sheathing
* hip and valley framing
* roof ventilation
* attic access
* IRC Chapters 7-8 roof-ceiling construction

---

## Public Safety & Means of Egress

* exit access
* egress width and capacity
* stair construction
* handrails and guards
* emergency lighting
* fire resistance
* smoke control
* occupant safety
* IRC Chapter 3 / IBC Chapter 10

==================================================
OFFICIAL SOURCE LINKS
=====================

Use these official references as primary source material when generating questions, explanations, and study content.

---

## ICC SOURCES

ICC Certification Exam Catalog (B1 Residential Building Inspector, B2 Commercial Building Inspector, E1 Electrical, P1 Plumbing, M1 Mechanical):
https://www.iccsafe.org/certification/exam-catalog/

International Residential Code (IRC) — official code:
https://codes.iccsafe.org/content/IRC2021P1

International Building Code (IBC) — official code:
https://codes.iccsafe.org/content/IBC2021P1

National Electrical Code (NEC) — official code:
https://codes.iccsafe.org/content/NFPA702020

International Plumbing Code (IPC) — official code:
https://codes.iccsafe.org/content/IPC2021P1

International Mechanical Code (IMC) — official code:
https://codes.iccsafe.org/content/IMC2021P1

ICC Certification Candidate Handbook:
https://www.iccsafe.org/certification/candidate-handbook/

==================================================
SOURCE USAGE RULES
==================

When generating questions:

* Prefer ICC codes and terminology first.
* Use IRC for residential building inspection content (B1).
* Use IBC for commercial building inspection content (B2).
* Use NEC for electrical inspection content (E1).
* Use IPC for plumbing inspection content (P1).
* Use IMC for mechanical inspection content (M1).
* Use ICC exam catalog outlines for subject weighting.

Questions must combine:

* code provisions
* real-world building inspection
* practical compliance judgment
* inspector operational context
* ICC exam philosophy

==================================================
QUESTION FORMATTING
===================

For each generated question provide:

1. Question category
2. Difficulty level
3. Question
4. Four answer choices
5. Correct answer
6. Detailed explanation
7. Why the other answers are wrong
8. Code reference if applicable
9. Inspection reasoning
10. Real-world inspection context

==================================================
DIFFICULTY LEVELS
=================

Generate:

* Beginner
* Intermediate
* Advanced
* ICC certification exam difficulty

Advanced questions should:

* combine multiple code provisions
* include partial symptoms
* require elimination logic
* involve code interpretation
* require “best/most compliant” inspection decisions

==================================================
SCENARIO EXAMPLES
=================

Examples of desired style:

GOOD:
“During a footing inspection, concrete is poured before the required inspection is performed. What is the MOST appropriate action for the inspector?”

GOOD:
“An inspector finds an opening in a load-bearing wall framed without a header over a 6-foot span. Which IRC provision applies?”

GOOD:
“An inspector observes an egress window installed with a sill height above the maximum allowed by the IRC. What is the correct determination?”

BAD:
“What does EGRESS stand for?”

==================================================
OUTPUT REQUIREMENTS
===================

Generate:

* highly varied questions
* no duplicates
* realistic distractors
* professional code terminology
* authentic inspection context
* American terminology where applicable

Questions must feel indistinguishable from actual ICC preparation material.

Prioritize:
UNDERSTANDING > MEMORIZATION.`;

  return type === 'MCQ' ? `${base}${mcqRules}` : base;
}

function buildUserPrompt(
  chapterName: string,
  examName: string,
  type: QType,
  difficulty: Difficulty,
  count: number
): string {
  const typeLabel = {
    MCQ: `${count} multiple-choice questions (4 options each)`,
    TRUEFALSE: `${count} true/false statements`,
    WRITTEN: `${count} written/short-answer questions`,
  }[type];

  return `Generate ${typeLabel} for the following chapter:
- Exam: ${examName}
- Chapter: ${chapterName}
- Difficulty: ${difficulty}
- Output format: JSON array as specified in the schema.

Hard constraints for this batch:
1) Use ICC certification exam style (scenario-based, code interpretation, compliance judgment, best/most compliant action).
2) Use realistic field-inspection context and professional code terminology.
3) For MCQ, provide 4 full-text plausible options (NO placeholders like A/B/C/D).
4) correctAnswer must be the exact text of one option.
5) explanation must include practical inspection reasoning + at least one reference cue (IRC R302, IBC 1005, NEC 210.8, IPC 903, IMC 601).
6) Avoid pure definition/memorization stems.
7) Questions must be meaningfully varied (no duplicates/rephrasings).

Return ONLY the JSON array with no additional text.`;
}

// ─── Core generation ───────────────────────────────────────────

async function generateForType(
  chapterName: string,
  examName: string,
  type: QType,
  difficulty: Difficulty,
  count: number
): Promise<unknown[]> {
  const systemPrompt = buildSystemPrompt(type, difficulty);
  const userPrompt = buildUserPrompt(chapterName, examName, type, difficulty, count);

  const schema = type === 'MCQ' ? mcqSchema
    : type === 'TRUEFALSE' ? trueFalseSchema
    : writtenSchema;

  const validated: unknown[] = [];
  const seenQuestions = new Set<string>();

  // Retry loop: keep requesting until we have enough valid high-quality items or hit max attempts.
  const maxAttempts = 5;
  let attempt = 0;

  while (validated.length < count && attempt < maxAttempts) {
    const remaining = count - validated.length;
    const requestCount = Math.min(remaining + 6, Math.max(remaining, 8));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${userPrompt}\n\nAttempt ${attempt + 1}/${maxAttempts}. Generate ${requestCount} items to compensate for strict validation filtering.`
        },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content ?? '[]';

    let parsed: unknown;
    try {
      const json = JSON.parse(raw);
      parsed = Array.isArray(json) ? json : (json.questions ?? json.data ?? []);
    } catch {
      console.warn('[AI Parse Error] malformed JSON, skipping attempt');
      attempt += 1;
      continue;
    }

    if (!Array.isArray(parsed)) {
      console.warn('[AI Parse Error] response is not array, skipping attempt');
      attempt += 1;
      continue;
    }

    for (const item of parsed) {
      try {
        const result = schema.parse(item) as Record<string, unknown>;

        if (!passesQualityGuards(result, type)) {
          continue;
        }

        const key = String(result.question ?? '').trim().toLowerCase();
        if (!key || seenQuestions.has(key)) {
          continue;
        }

        seenQuestions.add(key);
        validated.push(result);

        if (validated.length >= count) break;
      } catch (err) {
        console.warn('[AI Validation Error]', err);
      }
    }

    attempt += 1;
  }

  return validated.slice(0, count);
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Generate a simplified explanation of an exam question for struggling students.
 * Uses plain, simple language (2-3 sentences).
 */
async function tutorExplain(question: string, explanation: string): Promise<string> {
  const prompt = `Explique cette question d'examen ICC (inspecteur en bâtiment) en termes simples comme si tu expliquais à un étudiant qui a de la difficulté. Question: ${question}. Réponse correcte: ${explanation}. Donne une explication courte (2-3 phrases) en langage très simple.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: 'Tu es un tuteur ICC qui explique des concepts de code du bâtiment en langage très simple et accessible.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content?.trim() ?? '';
  return content || 'Désolé, je n\'ai pas pu générer une explication simplifiée pour le moment.';
}

export const aiService = {
  /**
   * Simplify an exam question explanation for the tutor feature.
   * Returns a short plain-language explanation (2-3 sentences) in French.
   */
  async tutorExplain(question: string, explanation: string): Promise<string> {
    return tutorExplain(question, explanation);
  },

  /**
   * Generate questions for a chapter and persist as PENDING.
   * Callers: questions route POST /generate
   */
  /**
   * Generate questions for a chapter and persist as PENDING.
   * Callers: questions route POST /generate
   */
  async generateQuestions(opts: GenerateOptions): Promise<void> {
    const { examId, chapterId, type, difficulty, count } = opts;

    const [exam, chapter] = await Promise.all([
      prisma.exam.findUnique({ where: { id: examId } }),
      prisma.chapter.findUnique({ where: { id: chapterId } }),
    ]);

    if (!exam || !chapter) {
      throw new Error('Exam or chapter not found');
    }

    const questions = await generateForType(
      chapter.name,
      exam.name,
      type,
      difficulty,
      count
    );

    if (questions.length < count) {
      throw new Error(`AI generated insufficient valid questions: requested ${count}, got ${questions.length}`);
    }

    // Batch insert all as PENDING
    const toInsert = questions.map((q: unknown) => {
      const qObj = q as Record<string, unknown>;
      return {
        examId,
        chapterId,
        type,
        difficulty,
        question: qObj.question as string,
        options: (qObj.options as string[]) ?? [],
        correctAnswer: String(qObj.correctAnswer),
        explanation: qObj.explanation as string,
        status: 'PENDING' as const,
        aiSource: `generated:${exam.code}:${chapter.number}`,
      };
    });

    await prisma.question.createMany({ data: toInsert });

    console.log(`[AI] Generated ${toInsert.length} questions for ${exam.code} / Ch.${chapter.number}`);
  },

  /**
   * Generate theory content for a chapter based on its approved questions.
   * Uses AI to synthesize all question explanations into cohesive study material.
   * Saves to theoryContent / theoryContentFr on the Chapter record.
   * Returns { en: string, fr: string }.
   */
  async generateTheory(chapterId: string): Promise<{ en: string; fr: string }> {
    const [chapter, questions] = await Promise.all([
      prisma.chapter.findUnique({
        where: { id: chapterId },
        include: { exam: { select: { code: true, name: true } } },
      }),
      prisma.question.findMany({
        where: { chapterId, status: 'APPROVED' },
        select: { question: true, question_fr: true, explanation: true, explanation_fr: true },
        take: 100,
      }),
    ]);

    if (!chapter) throw new Error('Chapter not found');
    if (questions.length === 0) throw new Error('No approved questions in this chapter');

    const examCode = chapter.exam?.code ?? '';
    const chapterName = chapter.name;

    // Build source material for AI
    const enMaterial = questions.map((q, i) =>
      `Q${i + 1}: ${q.question}\nExplanation: ${q.explanation}`
    ).join('\n---\n');

    const frMaterial = questions.map((q, i) =>
      `Q${i + 1}: ${q.question_fr || q.question}\nExplication: ${q.explanation_fr || q.explanation}`
    ).join('\n---\n');

    // Generate English theory
    const enPrompt = `You are an ICC building inspector textbook author. Based on the following exam questions and their explanations for chapter "${chapterName}" of exam "${examCode}", write comprehensive, well-structured theory/study material. 

The goal is NOT to list the questions and answers. Instead, synthesize the KNOWLEDGE behind them into proper textbook-style reference material.

Structure your response with:
1. A brief overview of what this chapter covers
2. Key concepts explained in detail with technical accuracy
3. Important formulas, regulations, or procedures
4. Common relationships between concepts

Write in clear, professional English suitable for ICC certification exam preparation. Use markdown formatting with headings (##, ###), bullet points, and emphasis where appropriate.

CRITICAL: Respond directly with the theory content. No preamble, no introductory phrases like "Absolutely", "Here is", "Certainly", or "Of course". Start immediately with the first heading.

Here are the source questions and explanations:\n\n${enMaterial}`;

    const frPrompt = `Tu es un auteur de manuel de préparation aux examens d'inspecteur en bâtiment ICC. À partir des questions d'examen et leurs explications pour le chapitre "${chapter.name_fr || chapterName}" de l'examen "${examCode}", rédige un contenu théorique / matériel d'étude complet et bien structuré.

Le but N'EST PAS de lister les questions et réponses. Tu dois plutôt synthétiser les CONNAISSANCES derrière ces questions en un véritable contenu de référence de type manuel.

Structure ta réponse avec :
1. Un aperçu de ce que couvre ce chapitre
2. Les concepts clés expliqués en détail avec précision technique
3. Les formules, règlements ou procédures importantes
4. Les relations entre les concepts

Écris en français clair et professionnel adapté à la préparation aux examens ICC. Utilise le format markdown avec des titres (##, ###), listes à puces et emphase où approprié.

CRITIQUE : Réponds directement avec le contenu théorique. Aucun préambule, aucune phrase d'introduction comme "Absolument", "Voici", "D'accord", "Bien sûr". Commence immédiatement par le premier titre.

Voici les questions et explications sources :\n\n${frMaterial}`;

    const [enResponse, frResponse] = await Promise.all([
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert ICC textbook author creating study material for building inspectors.' },
          { role: 'user', content: enPrompt },
        ],
        temperature: 0.4,
        max_tokens: 16384,
      }),
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Tu es un auteur expert de manuel ICC créant du matériel d\'étude pour les inspecteurs en bâtiment.' },
          { role: 'user', content: frPrompt },
        ],
        temperature: 0.4,
        max_tokens: 16384,
      }),
    ]);

    const en = enResponse.choices[0]?.message?.content?.trim() ?? '';
    const fr = frResponse.choices[0]?.message?.content?.trim() ?? '';

    // Save to chapter
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { theoryContent: en, theoryContentFr: fr },
    });

    console.log(`[AI] Generated theory for ${examCode} / Ch.${chapter.number}`);

    return { en, fr };
  },
};
