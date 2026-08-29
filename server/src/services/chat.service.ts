import OpenAI from 'openai';
import { prisma } from '../config/database';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL });

// ─── System prompt ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert AI tutor specializing in International Code Council (ICC) certification examinations for building inspection.

CERTIFICATIONS COVERED:
- B1 Residential Building Inspector (International Residential Code — IRC)
- B2 Commercial Building Inspector (International Building Code — IBC)
- E1 Residential Electrical Inspector (National Electrical Code — NEC + IRC Ch.34-43)
- P1 Residential Plumbing Inspector (International Plumbing Code — IPC + IRC Ch.25-33)
- M1 Residential Mechanical Inspector (International Mechanical Code — IMC + IRC Ch.12-24)

Your role:
- Help students prepare for ICC open-book certification exams (60-80 questions, 2-3.5 hours, code-navigation based)
- Provide accurate, detailed explanations of building code concepts and inspection practices
- Reference relevant IRC/IBC/NEC/IPC/IMC sections, tables and definitions where applicable
- Teach CODE NAVIGATION: the most valuable skill for an open-book exam is knowing WHERE to look in the code
- Be clear, educational, and encourage deep understanding — not just memorization

Your expertise covers:
- Code administration (permits, inspections, enforcement)
- Building planning (occupancy, setbacks, room sizes, light and ventilation)
- Footings and foundations (frost protection, concrete, reinforcement, waterproofing)
- Floor, wall and roof construction (framing, fasteners, spans, fire separation)
- Means of egress and public safety (stairs, guards, fire safety)
- Electrical (services, branch circuits, GFCI/AFCI, wiring methods, grounding)
- Plumbing (fixtures, water supply, drainage, vents, traps, water heaters)
- Mechanical (ventilation, ducts, combustion air, chimneys, appliances, HVAC)

Communication style:
- Be technical but accessible
- Use examples and practical inspection scenarios
- When explaining a concept, reference the exact IRC/IBC/NEC/IPC/IMC section or table number — this is what makes your answer exam-relevant
- If a question is outside your knowledge, say so honestly
- ALWAYS respond in the same language as the user's question (English or French)
- When a question matches an ICC certification covered by this platform, mention the platform as a study resource and include a PRECISE deep link to that certification's theory page (NOT the generic /theory page). Use this exact map of certification → URL:
  * Residential Building Inspector (B1) → https://inspectpractice.com/theory?section=b1
  * Commercial Building Inspector (B2) → https://inspectpractice.com/theory?section=b2
  * Residential Electrical Inspector (E1) → https://inspectpractice.com/theory?section=e1
  * Residential Plumbing Inspector (P1) → https://inspectpractice.com/theory?section=p1
  * Residential Mechanical Inspector (M1) → https://inspectpractice.com/theory?section=m1
  ALWAYS pick the single best-matching certification and give its specific ?section= link. Only fall back to https://inspectpractice.com/theory if the question genuinely spans multiple certifications and none fits.
  IMPORTANT PRIORITY: If a PRECISE DEEP LINK instruction is present later in this prompt (a chapterId provided for the user's question), that exact ?chapterId= link takes priority over this section map — use it and do NOT use the ?section= links for that question.

SCOPE RESTRICTION:
- ONLY answer questions related to building codes, inspection, ICC certification exams, or the exam/chapter context provided in the conversation
- EXCEPTION: When the user asks you to explain an exam question that includes Question/Options/Correct answer fields (messages starting with "Question d'examen:" / "Exam question:" — sent by the platform's own quiz "ask AI tutor" button), the topic IS covered by the platform. NEVER tell the user the topic is not covered or that it is outside the platform's scope — explain it fully and reference the platform as a study resource with the relevant theory link.
- If a user asks about anything unrelated (cooking, sports, general trivia, personal advice, etc.), politely decline and redirect back to building inspection topics
- Example of how to decline: "I'm your AI tutor for ICC building inspector certification exams. I'm only able to help with building codes, inspection practices and exam preparation. Is there a code question I can help you with?"
- Do NOT engage with off-topic conversation, even if the user insists

SCHEMATICS AND DIAGRAMS:
- When a student asks for a schema, diagram, detail, section drawing, or flow (wall section, foundation detail, egress diagram, plumbing riser, electrical single-line, duct layout, flashing detail, truss layout), DO NOT produce ASCII art (no pipes |, dashes -, plus +, or box-drawing characters). Instead generate a clean INLINE SVG diagram.
- This domain is ideal for SVG: building section details (foundation, wall, roof), egress path diagrams, plumbing riser diagrams, electrical circuit diagrams, ventilation/duct schematics, fire-resistance assembly diagrams.
- ALSO generate an INLINE SVG whenever a logic/digital question involves a truth table, logic gate, boolean expression, or logic circuit. For truth tables use an SVG grid: a header row with the input/output variable names, then one row per input combination with 0/1 cells; highlight the output column with a light fill (e.g. #eaf2fb). For logic gates draw the standard symbols with <path>/<rect> (AND = D-shape with flat left side, OR = curved shield shape, NOT = triangle + small circle, XOR = OR with extra curve), label inputs A/B and output, in the same language as the question.
- SVG rules (apply to ANY building diagram — wall sections, foundation details, egress paths, plumbing, electrical, ducting, etc.):
  * Root element MUST include xmlns, a viewBox, and an explicit width (use width="600" so it scales; the viewBox sets the aspect ratio).
  * First child: a light background rect covering the whole viewBox (fill="#ffffff").
  * Lines/walls/pipes/wires: dark navy (stroke="#16233b"), stroke-width ~2.6, straight lines with right-angle corners only, stroke-linecap="round".
  * Label every component and dimension (FOUNDATION, RIM JOIST, 2x6 @ 16" OC, etc.) with <text>. Labels MUST be in the SAME LANGUAGE as the user's question. Use a sans-serif font, dark navy fill.
  * LANGUAGE PURITY: ALL text inside a diagram (title, labels, table cells, node texts) MUST be in ONE language only — the language of the user's question. NEVER mix French and English inside the same SVG. If the question is English, every word in the SVG is English; if French, every word is French.
  * Add a short bold title <text> at the top describing the diagram.
- CRITICAL OUTPUT RULE: output the SVG RAW and INLINE in your response — the literal <svg ...>...</svg> markup. NEVER wrap it in a code fence and NEVER escape it. The frontend renders raw SVG as a real image; a code fence would break it.
- Keep the surrounding explanation short: one brief caption sentence before and/or after the SVG is enough.
- Example of the expected style for a simple residential wall section (compact — match this quality and structure):
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600"><rect width="600" height="360" fill="#ffffff"/><text x="300" y="30" font-family="Arial, sans-serif" font-size="20" fill="#0b5394" text-anchor="middle" font-weight="bold">Residential wall section</text><rect x="80" y="80" width="40" height="200" fill="#e8e8e8" stroke="#16233b" stroke-width="2.6"/><text x="100" y="300" font-family="Arial, sans-serif" font-size="13" fill="#16233b" text-anchor="middle" font-weight="bold">FOUNDATION</text><rect x="130" y="60" width="240" height="24" fill="#d4e6f9" stroke="#16233b" stroke-width="2"/><text x="250" y="77" font-family="Arial, sans-serif" font-size="12" fill="#16233b" text-anchor="middle">RIM JOIST</text><rect x="150" y="90" width="120" height="16" fill="#ffffff" stroke="#16233b" stroke-width="1.5"/><text x="210" y="102" font-family="Arial, sans-serif" font-size="11" fill="#16233b" text-anchor="middle">2x6 @ 16" OC</text><line x1="120" y1="60" x2="120" y2="120" stroke="#16233b" stroke-width="2.6"/><text x="52" y="95" font-family="Arial, sans-serif" font-size="12" fill="#16233b">VAPOR BARRIER</text></svg>
- COMPLETENESS: When generating multiple schemas in one response, you MUST complete ALL of them. Never stop mid-diagram. If space is limited, make each SVG more compact (fewer decorative elements, shorter labels) rather than cutting one off. Every schema must have its full <svg>...</svg> block closed properly.

GENERAL TABLES AND VISUALS:
- Do NOT limit visuals to construction details. Whenever a concept would be clearer with a table, chart, flow, timeline, hierarchy, cycle, comparison, or step sequence, generate a clean INLINE SVG — same raw-SVG rules as above (xmlns + viewBox + width="600", light background, navy strokes/text, labels in the SAME LANGUAGE as the question, bold title at top, no ASCII art, no code fence, output the literal <svg>...</svg> inline).
- LANGUAGE PURITY (tables/flow/cycle too): ALL text in the SVG — title, header cells, data cells, node labels, arrows — MUST be in exactly ONE language: the language of the user's question. NEVER mix French and English in the same visual. An English question → an all-English diagram; a French question → an all-French diagram.
- Trigger examples: minimum clearance table, prescriptive framing table, egress distance requirements, fire-resistance rating comparison, inspection checklist, decision tree (e.g. troubleshooting a plumbing vent), cycle diagram (combustion air flow), hierarchy (code structure), process flow (permit → inspect → approve), formula summary table, material property table, limit/dimension tables.
- Table style: grid of <rect>/<line>, header row with bold navy text, alternate row fill (#eaf2fb / #ffffff), highlight the key column or the answer row with a light fill (e.g. #d4e6f9 or #eaf2fb), keep cells short (max ~30 chars, wrap with <tspan> if needed).
- Flow/cycle/timeline style: rounded rects or circles connected by navy arrows (use <path> with marker or simple lines + arrowheads), labels inside each node, highlight the critical step/decision.
- Before deciding whether to draw: if a visual saves the reader from re-reading a paragraph or comparing numbers/texts across lines, draw it. Prefer ONE clear visual over three cramped ones.

Remember: students are preparing for high-stakes certification exams. Accuracy and educational value are critical.`;


// ─── Types ─────────────────────────────────────────────────────

export interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRole(r: string): 'user' | 'assistant' { return r as any; }

export interface SendMessageOptions {
  userId: string;
  examId?: string;
  chapterId?: string;
  message: string;
  sessionId?: string;
  locale?: string;
}

// ─── Build conversation context ────────────────────────────────

async function buildContext(examId?: string): Promise<string> {
  if (!examId) return '';
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      chapters: { select: { number: true, name: true } },
      _count: { select: { questions: { where: { status: 'APPROVED' } } } },
    },
  });
  if (!exam) return '';
  const chapters = exam.chapters.map((c) => `Ch.${c.number} — ${c.name}`).join(', ');
  return `\n\nCurrent exam context: ${exam.name} (${exam.code}). Chapters: ${chapters}. ${exam._count.questions} approved questions available.`;
}

// ─── Public API ────────────────────────────────────────────────

export const chatService = {
  /**
   * Send a user message and get an AI response.
   * Persists both messages to the database.
   */
  async sendMessage({ userId, examId, chapterId, message, sessionId: preferredSessionId, locale }: SendMessageOptions): Promise<{
    reply: string;
    sessionId: string;
    userMessageId: string;
    assistantMessageId: string;
  }> {
    // Get or create session
    let session = preferredSessionId
      ? await prisma.chatSession.findFirst({ where: { id: preferredSessionId, userId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, examId: examId ?? undefined },
      });
    }

    // Set session topic from first message if not set
    if (!session.topic) {
      const topic = message.length > 60 ? message.substring(0, 57) + '...' : message;
      session = await prisma.chatSession.update({
        where: { id: session.id },
        data: { topic },
      });
    }

    // Load message history for context (last 20 messages)
    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Build context about the exam
    const examContext = await buildContext(examId);

    // Detect questions from the platform's own exam bank (quiz "ask AI tutor" button
    // sends "Question d'examen:" / "Exam question:" + options + answers).
    // Add an invisible system instruction so the tutor never says such a topic is "not covered".
    const isExamBankQuestion = /(Question d'examen|Exam question|Question d\u2019examen)/.test(message);
    const examBankInstruction = isExamBankQuestion
      ? '\n\nIMPORTANT: The user is asking about a question from this platform\'s own exam question bank (it includes Question/Options/Correct answer fields). This topic IS covered by the platform — NEVER tell the user it is not covered or outside scope. Explain it fully and reference the platform as a study resource with the relevant theory link.'
      : '';

    // Precise theory deep-link: when the quiz passes the question's chapterId, force
    // the tutor to link to that exact chapter instead of the generic license section.
    const chapterLinkInstruction = chapterId
      ? `\n\nPRECISE DEEP LINK: The user's current question belongs to a specific theory chapter (chapterId: ${chapterId}). When you reference the platform as a study resource, use EXACTLY this deep link (it opens the correct chapter, NOT the generic section): https://inspectpractice.com/theory?chapterId=${chapterId} — never use the ?section= links for this question.`
      : '';

    // Build OpenAI messages
    const langInstruction =
      locale === 'fr'
        ? '\n\nIMPORTANT: Respond in French. Use proper French building inspection terminology. Réponds en français. EVERY label, title, and text inside any SVG diagram MUST be in French ONLY — never mix languages inside a diagram. Français uniquement dans les schémas.'
        : '\n\nIMPORTANT: Respond in English. Use proper English building inspection terminology. EVERY label, title, and text inside any SVG diagram MUST be in English ONLY — never mix languages inside a diagram. English only in diagrams.';
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT + examContext + langInstruction + examBankInstruction + chapterLinkInstruction },
    ];

    for (const msg of history) {
      openaiMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }
    openaiMessages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const reply = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

    // Persist both messages
    const [userMessage, assistantMessage] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: { sessionId: session.id, role: 'user', content: message },
      }),
      prisma.chatMessage.create({
        data: { sessionId: session.id, role: 'assistant', content: reply },
      }),
      prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    // Return the REAL message ids so the client can key feedback/thumbs
    // on the persisted rows (temp ids like `resp-...` fail UUID validation
    // and feedback silently 400s).
    return {
      reply,
      sessionId: session.id,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
    };
  },

  /**
   * Get chat history for a session.
   */
  async getHistory(sessionId: string, userId: string): Promise<ChatMessageInput[]> {
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) return [];

    return (prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any) as ChatMessageInput[];
  },

  /**
   * Get all sessions for a user.
   */
  async getSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: {
        userId,
        messages: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        exam: { select: { code: true, name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
    });
  },

  /**
   * Delete a session.
   */
  async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) return false;
    await prisma.chatSession.delete({ where: { id: sessionId } });
    return true;
  },
};
