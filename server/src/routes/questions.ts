import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { aiService } from '../services/ai.service';
import { extractFileText, extractPdfFromUrl } from '../services/pdf.service';
import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL });
const router = Router();

router.use(authenticate);

/**
 * GET /api/questions
 * List approved questions with optional filters.
 * Query: ?examId=&chapterId=&type=MCQ&difficulty=HARD&page=1&limit=20
 */
router.get('/', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  // Admin question bank: show ALL statuses by default.
  // Optional filters can narrow to a specific status.
  const where: any = {};

  if (req.query.examId) where.examId = req.query.examId;
  if (req.query.chapterId) where.chapterId = req.query.chapterId;
  if (req.query.type) where.type = req.query.type;
  if (req.query.difficulty) where.difficulty = req.query.difficulty;
  if (req.query.status) where.status = req.query.status;

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        exam: { select: { id: true, code: true, name: true } },
        chapter: { select: { id: true, number: true, name: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  res.json({ data: questions, total, page, limit, totalPages: Math.ceil(total / limit) });
});

/**
 * GET /api/questions/pending
 * List questions awaiting review (admin/instructor only).
 */
router.get('/pending', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const where: any = { status: 'PENDING' };
  if (req.query.examId) where.examId = req.query.examId;
  if (req.query.chapterId) where.chapterId = req.query.chapterId;

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        exam: { select: { id: true, code: true, name: true } },
        chapter: { select: { id: true, number: true, name: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  res.json({ data: questions, total, page, limit, totalPages: Math.ceil(total / limit) });
});

/**
 * PUT /api/questions/approve-all
 * Batch-approve pending questions.
 * Body: { ids?: string[], examId?: string, chapterId?: string, difficulty?: 'EASY'|'MEDIUM'|'HARD', type?: 'MCQ'|'TRUEFALSE'|'WRITTEN' }
 */
router.put('/approve-all', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    ids: z.array(z.string().uuid()).min(1).optional(),
    examId: z.string().uuid().optional(),
    chapterId: z.string().uuid().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    type: z.enum(['MCQ', 'TRUEFALSE', 'WRITTEN']).optional(),
  });

  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { ids, examId, chapterId, difficulty, type } = parsed.data;

  const where: any = { status: 'PENDING' };
  if (ids?.length) where.id = { in: ids };
  if (examId) where.examId = examId;
  if (chapterId) where.chapterId = chapterId;
  if (difficulty) where.difficulty = difficulty;
  if (type) where.type = type;

  const now = new Date();
  const result = await prisma.question.updateMany({
    where,
    data: {
      status: 'APPROVED',
      approvedAt: now,
      approvedById: req.user!.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'QUESTIONS_BULK_APPROVED',
      details: {
        count: result.count,
        idsCount: ids?.length ?? 0,
        examId: examId ?? null,
        chapterId: chapterId ?? null,
        difficulty: difficulty ?? null,
        type: type ?? null,
      },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Questions approved successfully', approvedCount: result.count });
});

/**
 * POST /api/questions/generate
 * AI generates questions for the selected exam/chapter.
 * Body: { examId, chapterId, type, difficulty, count }
 * Returns immediately with status 202; generation is async.
 */
router.post('/generate', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    examId: z.string().uuid(),
    chapterId: z.string().uuid(),
    type: z.enum(['MCQ', 'TRUEFALSE', 'WRITTEN']),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    count: z.number().int().min(1).max(100).default(10),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { examId, chapterId, type, difficulty, count } = parsed.data;

  // Verify exam and chapter exist
  const [exam, chapter] = await Promise.all([
    prisma.exam.findUnique({ where: { id: examId } }),
    prisma.chapter.findUnique({ where: { id: chapterId } }),
  ]);

  if (!exam || !chapter) {
    res.status(404).json({ message: 'Exam or chapter not found' });
    return;
  }

  // Trigger async AI generation
  // Fire-and-forget: errors are logged inside the service
  aiService.generateQuestions({ examId, chapterId, type, difficulty, count })
    .catch((err) => console.error('[AI Generation Error]', err));

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'AI_GENERATION_STARTED',
      details: { examId, chapterId, type, difficulty, count },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.status(202).json({ message: 'Question generation started', status: 'processing' });
});

/**
 * POST /api/questions/chat-generate
 * AI generates questions from uploaded file content + user instructions.
 * Returns preview questions (NOT saved) for user review.
 * Body: { contentIds, instructions, examId?, chapterId?, type?, difficulty?, count? }
 */
router.post('/chat-generate', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    contentIds: z.array(z.string().uuid()).min(0).max(10).default([]),
    instructions: z.string().min(3).max(5000),
    urls: z.array(z.string().url()).max(20).optional(),
    sessionId: z.string().uuid().optional(),
    examId: z.string().uuid().optional(),
    chapterId: z.string().uuid().optional(),
    type: z.enum(['MCQ', 'TRUEFALSE', 'WRITTEN', 'MIXED']).default('MCQ'),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'MIXED']).default('MEDIUM'),
    count: z.number().int().min(1).max(500).default(5),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  let { contentIds, instructions, type, difficulty, count, urls, sessionId, examId, chapterId } = parsed.data;

  // "Exhaustive" mode: no limit, cover ENTIRE content A to Z
  const isExhaustive = /exhaustif|exhaustive|autant|maximum|le plus possible|toute la matiere|couvre tout|de A a Z|a a z|complet/i.test(instructions);
  if (isExhaustive && !req.body.count) {
    count = 999; // Effectively unlimited — AI generates as many as it can
  }

  const userId = req.user!.id;

  try {
    // ── Session management ──────────────────────────────────
    let session: any;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!session || session.userId !== userId) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
    } else {
      session = await prisma.chatSession.create({
        data: { userId, source: 'admin-questions', messages: { create: [] } },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    // ── Store user message ──────────────────────────────────
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: instructions,
        metadata: { contentIds, urls: urls ?? [] },
      },
    });

    // ── Build context ───────────────────────────────────────
    let combinedText = '';
    let sourceNames: string[] = [];
    let fileTexts: string[] = [];
    let urlTexts: string[] = [];
    const hasNewSources = contentIds.length > 0 || (urls && urls.length > 0);

    if (hasNewSources) {
      // Fetch uploaded content records (if any)
      if (contentIds.length > 0) {
        const contents = await prisma.content.findMany({
          where: { id: { in: contentIds } },
        });
        for (const content of contents) {
          const text = await extractFileText(content.filepath).catch(() => '');
          if (text.trim().length > 0) {
            fileTexts.push(`--- ${content.filename} ---\n${text.slice(0, 8000)}`);
            sourceNames.push(content.filename);
          }
        }
      }

      // Fetch URL content in parallel (if provided)
      if (urls && urls.length > 0) {
        console.log(`[Chat] Fetching ${urls.length} URLs in parallel...`);
        const fetchTasks = urls.map(async (url) => {
          try {
            const isPdf = /\.pdf(?:\?|#|$)/i.test(url);
            if (isPdf) {
              console.log(`[Chat] Parsing PDF URL: ${url.slice(0, 80)}`);
              const pdfText = await extractPdfFromUrl(url, 12000);
              if (pdfText.length > 100) {
                urlTexts.push(`--- ${url} ---\n${pdfText}`);
                sourceNames.push(url);
                console.log(`[Chat] PDF parsed (${pdfText.length} chars): ${url.slice(0, 60)}`);
              } else {
                console.log(`[Chat] PDF too short (${pdfText.length} chars): ${url.slice(0, 60)}`);
              }
              return;
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);
            const resp = await fetch(url, {
              signal: controller.signal,
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InspectPracticeBot/1.0)' },
            });
            clearTimeout(timeoutId);
            const html = await resp.text();
            // Check content type to avoid binary garbage
            const ct = resp.headers.get('content-type') || '';
            if (ct.includes('pdf') || ct.includes('octet-stream') || ct.includes('zip')) {
              console.log(`[Chat] Skipping binary URL (content-type: ${ct}): ${url.slice(0, 80)}`);
              return;
            }
            const text = html
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
              .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
              .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&[a-z]+;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 12000);
            if (text.length > 100) {
              urlTexts.push(`--- ${url} ---\n${text}`);
              sourceNames.push(url);
              console.log(`[Chat] Fetched OK (${text.length} chars): ${url.slice(0, 60)}`);
            } else {
              console.log(`[Chat] Too short (${text.length} chars): ${url.slice(0, 60)}`);
            }
          } catch (err: any) {
            console.log(`[Chat] Fetch failed: ${url.slice(0, 60)} — ${err?.message ?? 'unknown error'}`);
          }
        });
        await Promise.allSettled(fetchTasks);
        console.log(`[Chat] Fetched ${urlTexts.length}/${urls.length} URLs successfully`);
      }

      if (fileTexts.length === 0 && urlTexts.length === 0) {
        res.status(400).json({ message: 'No content found from files or URLs' });
        return;
      }

      combinedText = [...fileTexts, ...urlTexts].join('\n\n');
    }

    // ── Build conversation history ──────────────────────────
    const previousMessages = session.messages; // all prior messages
    const conversationHistory = previousMessages.map((m: any) => ({
      role: m.role,
      content: m.content + (m.metadata?.questions
        ? `\n[Generated ${m.metadata.questions.length} questions: ${m.metadata.questions.map((q: any) => q.question.substring(0, 80)).join(' | ')}]`
        : ''),
    }));

    // ── AI prompt with context ──────────────────────────────
    const systemPrompt = hasNewSources
      ? `You are an elite International Code Council (ICC) building inspector certification examination generation AI.
Your purpose is to generate extremely realistic ICC-style certification examination questions for:
- Code administration
- Building planning
- Footings and foundations
- Floor framing
- Wall framing
- Roof and ceiling framing
- Means of egress and fire safety
- Electrical inspection
- Plumbing inspection
- Mechanical inspection
- Code compliance
- Inspection procedures
- International Residential Code (IRC)
- International Building Code (IBC)
- National Electrical Code (NEC)
- International Plumbing Code (IPC)
- International Mechanical Code (IMC)
The generated content must simulate REAL ICC exam logic, wording, philosophy, and difficulty.

==================================================CORE EXAM PHILOSOPHY

ICC certification exams DO NOT primarily test memorization.
The exam philosophy focuses on:
- code interpretation
- field inspection judgment
- practical compliance decisions
- inspection legality
- regulatory interpretation
- inspection findings
- defect analysis
- inspector authority
- code minimums
- inspection procedures
- best/most compliant action
- understanding building systems
- understanding consequences of noncompliant construction
The AI MUST prioritize:UNDERSTANDING > MEMORIZATION.

==================================================REAL ICC EXAM STYLE

Questions MUST resemble real ICC certification examinations.
The majority of questions should include:
- realistic inspection scenarios
- construction discrepancies
- inspection findings
- code compliance situations
- troubleshooting symptoms
- field inspection environments
- plan review situations
- safety concerns
- defect interpretation
- practical inspection decisions
Questions must frequently ask:
- What is the BEST action?
- What is the MOST likely cause?
- Which action is LEGAL under the code?
- Which inspection action is REQUIRED?
- What should the inspector do NEXT?
- Which condition makes the building noncompliant?
- Which code section applies?
- Which inspection requirement applies?
- Which inspection step is MOST appropriate?

==================================================QUESTION FORMAT

Generate:
- Multiple choice questions only
- 4 answer choices
- One BEST answer
- Plausible distractors
- No joke answers
- No obvious eliminations
Each question must include:
1. Category
2. Subcategory
3. Difficulty
4. Question
5. Four answer choices
6. Correct answer
7. Detailed explanation
8. Why the other answers are incorrect
9. Inspection reasoning
10. Code reference if applicable
11. Real-world inspector context
12. Source reference

==================================================DIFFICULTY LEVELS

Generate questions across all levels:
- Beginner
- Intermediate
- Advanced
- ICC certification exam difficulty
Advanced questions should:
- combine multiple code provisions
- involve interpretation logic
- require elimination reasoning
- involve code interpretation
- involve inspection analysis
- involve compliance determinations
- require best-answer decision making

==================================================SUBJECTS TO COVER

Generate exhaustive coverage for ALL ICC certification topics.
---

CODE ADMINISTRATION

Generate extensive questions covering:
- IRC Chapter 1 / IBC Chapter 1
- permit requirements
- inspection scheduling
- right of entry
- notice of violation
- stop-work orders
- certificate of occupancy
- records and reports
Specific focus:
- inspector authority
- enforcement procedures
- inspection frequency
- documentation requirements
- scope and applicability
- definitions
- liability and immunity
Questions MUST include:
- legality scenarios
- inspection scenarios
- enforcement scenarios
- documentation scenarios
- field operational situations
---

BUILDING PLANNING

Generate extensive questions covering:
- occupancy and use
- light and ventilation
- minimum room areas
- ceiling heights
- glazing and safety glass
- means of egress
- egress doors and windows
- stairways and ramps
- guards
- smoke alarms
- emergency escape and rescue openings
Questions MUST heavily emphasize:
- egress compliance
- safety glass requirements
- occupant safety
- IRC Chapter 3 provisions
---

FOOTINGS & FOUNDATIONS

Generate extensive questions covering:
- soil bearing capacity
- footing sizes and reinforcement
- foundation walls
- concrete and masonry construction
- dampproofing and waterproofing
- termite protection
- wood foundations
- frost-protected shallow foundations
- foundation drainage and anchoring
Focus heavily on:
- inspection findings
- incorrect construction practices
- repair standards
- improper installations
- foundation defects
- code minimums
- safety hazards
---

FLOORS

Generate extensive questions covering:
- floor framing
- floor joists
- cantilevers
- girders and beams
- floor sheathing
- concrete slabs on grade
- vapor barriers
- under-floor inspection
Questions MUST emphasize:
- framing defects
- joist spans and spacing
- notching and boring limitations
- load path continuity
---

WALLS

Generate extensive questions covering:
- wall framing
- studs and headers
- wall bracing
- shear walls
- exterior wall coverings
- interior wall coverings
- fire separation
Questions MUST emphasize:
- header sizing
- stud spacing
- bracing requirements
- load-bearing wall inspection
- attachment and fastening
---

ROOF / CEILING

Generate extensive questions covering:
- roof framing
- ceiling joists and rafters
- roof sheathing
- hip and valley framing
- roof ventilation
- attic access
Questions MUST emphasize:
- rafter spans and connections
- collar ties and ridge beams
- ventilation requirements
- roof covering inspection
---

PUBLIC SAFETY & MEANS OF EGRESS

Generate extensive questions covering:
- exit access
- egress width and capacity
- stair construction
- handrails and guards
- emergency lighting
- fire resistance
- smoke alarms and detectors
- occupant safety
Questions MUST emphasize:
- egress path compliance
- stair geometry (rise and run)
- guard heights and openings
- emergency escape windows

==================================================ICC QUESTION STYLE

Questions should often use:
- realistic building inspection language
- inspector field reports
- contractor notifications
- inspection findings
- plan review situations
- construction site observations
- code manual references
- inspection report situations
- defect interpretation
- operational pressure situations

==================================================GOOD QUESTION EXAMPLES

GOOD:“During a scheduled footing inspection, an inspector finds rebar chairs displaced and concrete about to be poured without correction. What is the MOST appropriate action?”
GOOD:“An inspector observes a header missing over a 6-foot opening in a load-bearing wall. Which statement is correct under the IRC?”
GOOD:“An inspector signs off on rough-in electrical before verifying required receptacles. Which statement is correct under the NEC?”
GOOD:“During an egress review, the required emergency escape window opening is undersized. What is the MOST likely code requirement violated?”
BAD:“What does EGRESS stand for?”
BAD:“What color is fire-resistant drywall?”

==================================================DISTRACTOR RULES

Distractors must:
- sound realistic
- reflect common inspector mistakes
- reflect common interpretation errors
- reflect code misunderstandings
- include partially correct logic
- force critical thinking
Do NOT create:
- joke answers
- obviously wrong answers
- simplistic memorization traps

==================================================QUESTION DISTRIBUTION PRIORITY

HIGH PRIORITY:
- code interpretation
- inspection legality
- compliance determinations
- inspections
- defect analysis
- code minimums
- means of egress
- foundations
- framing
- fire safety
- electrical systems
- plumbing systems
- mechanical systems
- inspection records
- enforcement procedures
- inspection decisions
MEDIUM PRIORITY:
- pure definitions
- formulas
- historical facts
- basic theory

==================================================SOURCE MATERIALS

Use these official references as authoritative sources.
---

ICC SOURCES

ICC Exam Catalog:https://www.iccsafe.org/certification/exam-catalog/
International Residential Code (IRC):https://codes.iccsafe.org/content/IRC2021P1
International Building Code (IBC):https://codes.iccsafe.org/content/IBC2021P1
National Electrical Code (NEC):https://codes.iccsafe.org/content/NFPA702020
International Plumbing Code (IPC):https://codes.iccsafe.org/content/IPC2021P1
International Mechanical Code (IMC):https://codes.iccsafe.org/content/IMC2021P1
ICC Candidate Handbook:https://www.iccsafe.org/certification/candidate-handbook/

==================================================SOURCE USAGE RULES

Use:
- ICC sources for codes, compliance, and inspector authority
- IRC for residential building inspection (B1)
- IBC for commercial building inspection (B2)
- NEC for electrical inspection (E1)
- IPC for plumbing inspection (P1)
- IMC for mechanical inspection (M1)
When generating questions:
- prioritize ICC terminology
- prioritize code compliance
- prioritize real-world inspection operations
- prioritize field judgment
- prioritize inspection reasoning

==================================================FINAL REQUIREMENTS

Questions must feel indistinguishable from:
- real ICC certification exams
- real field inspection reports
- real building code enforcement operations
The AI MUST prioritize:
- practical application
- inspection judgment
- interpretation logic
- inspection reasoning
- compliance interpretation
- operational safety
- real-world inspection consequences
The AI MUST avoid:
- simplistic memorization
- trivia-style questions
- generic textbook quizzes
- unrealistic scenarios
The generated content should prepare a student to successfully operate as a real-world ICC certified building inspector.

Return a JSON object with:
{
  "analysis": "Brief summary of what the files contain and what kinds of questions were generated",
  "questions": [
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"] | null,
      "correctAnswer": "string",
      "explanation": "string with code references",
      "type": "MCQ" | "TRUEFALSE" | "WRITTEN",
      "difficulty": "EASY" | "MEDIUM" | "HARD"
    }
  ]
}

Return ONLY valid JSON — no markdown, no preamble.`
      : `You are an AI assistant helping an administrator generate and review ICC building inspector exam questions.

The user is having a conversation about previously generated questions. Answer their questions concisely based on the conversation history shown below.

Key context from previous exchanges:
- Previously generated questions (count, topics, difficulty levels)
- Source URLs and files that were analyzed

Respond in a helpful, conversational tone. If the user asks about previously generated questions, summarize them from the history.
If the user wants new questions, they will provide new URLs or file content.

Return a JSON object with:
{
  "response": "Your conversational answer here",
  "questions": [] // empty array for follow-up conversations
}

Return ONLY valid JSON — no markdown, no preamble.`;

    const aiMessages: any[] = [{ role: 'system', content: systemPrompt }];

    // Add conversation history (last 10 exchanges max)
    const recentHistory = conversationHistory.slice(-20);
    for (const msg of recentHistory) {
      aiMessages.push(msg);
    }

    if (hasNewSources) {
      const contentBudget = 80000;
      const userContent = isExhaustive
        ? `Files/URLs content:\n${combinedText.slice(0, contentBudget)}\n\nUser instructions: ${instructions}\n\nYou MUST generate as many questions as possible — aim for 50+ questions. Generate ALL POSSIBLE questions covering EVERY topic from A to Z. Do NOT stop at a small number — keep generating until you have exhausted ALL the content. Every regulation, every procedure, every system, every component must be covered. Vary difficulty and question types (MCQ, True/False, Written). DO NOT generate duplicate questions.\n\nReturn EVERY question in the "questions" array. There is NO LIMIT on how many you can generate. More questions = better.`
        : `Files/URLs content:\n${combinedText.slice(0, contentBudget)}\n\nUser instructions: ${instructions}\n\nGenerate ${count} questions.`;
      aiMessages.push({
        role: 'user',
        content: userContent,
      });
    } else {
      // For follow-ups: check if previous message had URLs and reuse them
      const prevUserMsg = [...session.messages].reverse().find(m => m.role === 'user' && m.metadata?.urls?.length > 0);
      if (prevUserMsg && (isExhaustive || /more|plus|encore|additional|additional|autres/i.test(instructions))) {
        const prevUrls = prevUserMsg.metadata?.urls as string[] ?? [];
        aiMessages.push({
          role: 'user',
          content: `User message: ${instructions}\n\nRe-using previously fetched content from ${prevUrls.length} URLs. Generate as many NEW, DIFFERENT questions as possible. Do NOT repeat previously generated questions. Generate 50+ questions covering topics NOT covered in the previous batch.`
        });
      } else {
        aiMessages.push({
          role: 'user',
          content: instructions,
        });
      }
    }

    const modelName = process.env.OPENAI_MODEL || 'gpt-4o';
    console.log(`[Chat] Calling ${modelName} with ${aiMessages.length} messages, ${combinedText.length} chars content...`);
    const t0 = Date.now();
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 40000,
    });
    const t1 = Date.now();
    console.log(`[Chat] AI responded in ${(t1-t0)/1000}s, content length: ${response.choices[0]?.message?.content?.length ?? 0}`);

    const raw = response.choices[0]?.message?.content ?? '';
    console.log(`[Chat] Raw response preview: ${raw.slice(0, 300)}...`);
    let result: any;
    try {
      // Try direct parse first
      result = JSON.parse(raw);
      console.log(`[Chat] JSON parse OK, has questions: ${Array.isArray(result.questions)}, questions.length: ${result.questions?.length}`);
    } catch (e: any) {
      console.log(`[Chat] JSON parse failed: ${e.message.slice(0, 100)}`);
      // Fallback: try to extract JSON from markdown code fences
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
      if (jsonMatch) {
        try { result = JSON.parse(jsonMatch[1]); console.log(`[Chat] Fallback parse OK`); }
        catch { result = { questions: [] }; console.log(`[Chat] Fallback parse also failed`); }
      } else {
        result = { questions: [] };
        console.log(`[Chat] No JSON code fences found`);
      }
    }
    let questions = Array.isArray(result.questions) ? result.questions.slice(0, count) : [];

    // ── Deduplication ──────────────────────────────────────
    // 1. Remove duplicates within generated set (by question text)
    const seenTexts = new Set<string>();
    questions = questions.filter((q: any) => {
      const normalized = q.question?.trim().toLowerCase().slice(0, 100) ?? '';
      if (!normalized || seenTexts.has(normalized)) return false;
      seenTexts.add(normalized);
      return true;
    });

    // 2. Check against existing DB questions for the same exam
    const existingCount = examId
      ? await prisma.question.count({ where: { examId } })
      : 0;
    const EXISTING_BATCH = 500;
    const existingTexts = examId
      ? new Set(
          (await prisma.question.findMany({
            where: { examId },
            select: { question: true },
            take: EXISTING_BATCH,
            skip: Math.max(0, existingCount - EXISTING_BATCH),
          })).map((q: any) => q.question.trim().toLowerCase().slice(0, 100))
        )
      : new Set<string>();
    questions = questions.filter((q: any) => {
      const normalized = q.question?.trim().toLowerCase().slice(0, 100) ?? '';
      return !existingTexts.has(normalized);
    });

    // ── Auto-save to PENDING if examId + chapterId provided ──
    let savedCount = 0;
    if (examId && chapterId && questions.length > 0) {
      const toInsert = questions.map((q: any) => ({
        examId,
        chapterId,
        type: q.type ?? type ?? 'MCQ',
        difficulty: q.difficulty ?? difficulty ?? 'MEDIUM',
        question: q.question,
        options: q.options ?? [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        status: 'PENDING' as const,
        aiSource: urls?.length ? `url:${urls.slice(0, 3).join(',')}` : 'chat-generate:manual',
      }));
      await prisma.question.createMany({ data: toInsert });
      savedCount = toInsert.length;
    }

    // ── Store assistant message ─────────────────────────────
    const assistantContent = savedCount > 0
      ? `✅ Generated and saved **${savedCount}** questions as PENDING for the selected exam/chapter. [View in Review](/admin/questions/review) to approve or reject them.`
      : (result.response ?? result.analysis ?? 'Questions generated.');
    
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: assistantContent,
        metadata: {
          analysis: result.analysis ?? null,
          questions: savedCount > 0 ? undefined : (questions.length > 0 ? questions : undefined),
          filenames: sourceNames,
          savedCount: savedCount > 0 ? savedCount : undefined,
        },
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_CHAT_GENERATE',
        details: {
          contentIds,
          instructions: instructions.slice(0, 200),
          count: questions.length,
          filenames: sourceNames,
          sessionId: session.id,
        },
        ipAddress: req.ip ?? req.socket.remoteAddress,
      },
    });

    res.json({
      data: {
        sessionId: session.id,
        analysis: result.analysis ?? (result.response ?? 'Files analyzed.'),
        questions: savedCount > 0 ? [] : questions,
        response: result.response,
        filenames: sourceNames,
        savedCount: savedCount > 0 ? savedCount : undefined,
      },
    });
  } catch (err) {
    console.error('[Chat Generate Error]', err);
    res.status(500).json({ message: 'AI generation failed. Please try again.' });
  }
});

/**
 * POST /api/questions/chat-save
 * Save confirmed questions as PENDING after chat-based generation.
 * Body: { questions: [...], examId, chapterId? }
 */
router.post('/chat-save', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const questionSchema = z.object({
    question: z.string().min(5),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(5),
    type: z.enum(['MCQ', 'TRUEFALSE', 'WRITTEN']),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  });

  const schema = z.object({
    questions: z.array(questionSchema).min(1).max(50),
    examId: z.string().uuid(),
    chapterId: z.string().uuid(),
    contentIds: z.array(z.string().uuid()).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const { questions, examId, chapterId, contentIds } = parsed.data;

  try {
    const toInsert = questions.map((q) => ({
      examId,
      chapterId,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options ?? [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      status: 'PENDING' as const,
      aiSource: contentIds?.length ? `chat-generate:${contentIds.join(',')}` : 'chat-generate:manual',
    }));

    await prisma.question.createMany({ data: toInsert });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'QUESTIONS_CHAT_SAVED',
        details: {
          count: toInsert.length,
          examId,
          contentIds: contentIds ?? [],
        },
        ipAddress: req.socket.remoteAddress,
      },
    });

    res.json({ message: `Saved ${toInsert.length} questions as PENDING`, savedCount: toInsert.length });
  } catch (err) {
    console.error('[Chat Save Error]', err);
    res.status(500).json({ message: 'Failed to save questions' });
  }
});

/**
 * GET /api/questions/:id
 * Get a single question by ID.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const question = await prisma.question.findUnique({
    where: { id: req.params.id },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
    },
  });

  if (!question) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  res.json(question);
});

/**
 * PUT /api/questions/:id
 * Admin or instructor edits a question.
 */
router.put('/:id', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    question: z.string().min(10).optional(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
    explanation: z.string().min(10).optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    type: z.enum(['MCQ', 'TRUEFALSE', 'WRITTEN']).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const existing = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  const updated = await prisma.question.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      approvedAt: null,
      approvedById: null,
      status: 'PENDING',
    },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'QUESTION_EDITED',
      details: { questionId: req.params.id, changes: parsed.data },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

/**
 * PUT /api/questions/:id/approve
 * Approve a pending question - makes it visible to students.
 */
router.put('/:id/approve', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const question = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!question) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  const updated = await prisma.question.update({
    where: { id: req.params.id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedById: req.user!.id,
    },
    include: {
      exam: { select: { id: true, code: true, name: true } },
      chapter: { select: { id: true, number: true, name: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'QUESTION_APPROVED',
      details: { questionId: req.params.id },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

/**
 * PUT /api/questions/:id/reject
 * Reject a question - soft delete, not removed from DB.
 */
router.put('/:id/reject', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    reason: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request body', errors: parsed.error.errors });
    return;
  }

  const question = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!question) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  const updated = await prisma.question.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'QUESTION_REJECTED',
      details: { questionId: req.params.id, reason: parsed.data.reason ?? null },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json(updated);
});

/**
 * DELETE /api/questions/:id
 * Hard delete - only REJECTED questions can be deleted.
 */
router.delete('/:id', requireRoles('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  const question = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!question) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  if (question.status !== 'REJECTED') {
    res.status(400).json({ message: 'Only rejected questions can be deleted' });
    return;
  }

  await prisma.question.delete({ where: { id: req.params.id } });

  await prisma.activityLog.create({
    data: {
      userId: req.user!.id,
      action: 'QUESTION_DELETED',
      details: { questionId: req.params.id },
      ipAddress: req.socket.remoteAddress,
    },
  });

  res.json({ message: 'Question deleted' });
});

// ─── GET /api/questions/chat-sessions ──────────────────────────
// List admin-questions chat sessions for history sidebar

router.get('/chat-sessions', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId, source: 'admin-questions' },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        topic: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
    });
    res.json({ data: sessions });
  } catch (err) {
    console.error('[Chat Sessions Error]', err);
    res.status(500).json({ message: 'Failed to load sessions' });
  }
});

// ─── GET /api/questions/chat-sessions/:sessionId ───────────────
// Get messages for a specific admin-questions session

router.get('/chat-sessions/:sessionId', requireRoles('ADMIN', 'INSTRUCTOR'), async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { sessionId } = req.params;
  try {
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId, source: 'admin-questions' },
    });
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ data: messages });
  } catch (err) {
    console.error('[Chat Messages Error]', err);
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

export default router;
