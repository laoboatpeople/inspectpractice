import { FAQPageJsonLd, BreadcrumbListJsonLd } from "@/components/seo/JsonLd";
import RelatedStudyPlatforms from "@/components/marketing/RelatedStudyPlatforms";

const faqs = [
  {
    question: "What is Inspect Practice?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice is an AI-powered web application designed to help building inspectors prepare for International Code Council (ICC) certification exams.",
      },
      {
        type: "p",
        text: "It covers all five core ICC inspector certifications plus the NHIE national home inspector exam:",
      },
      {
        type: "ul",
        items: [
          "B1 — Residential Building Inspector (IRC)",
          "B2 — Commercial Building Inspector (IBC)",
          "E1 — Residential Electrical Inspector (NEC)",
          "P1 — Residential Plumbing Inspector (IPC)",
          "M1 — Residential Mechanical Inspector (IMC)",
          "NHIE — National Home Inspector Exam (EBPHI)",
        ],
      },
      {
        type: "p",
        text: "The platform combines adaptive difficulty, open-book exam simulations, and code-referenced explanations to build real code-navigation skills.",
      },
    ],
  },
  {
    question: "Which ICC certifications does Inspect Practice cover?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice covers all five core ICC inspector certifications plus the NHIE national home inspector exam:",
      },
      {
        type: "ul",
        items: [
          "B1 — IRC (one- and two-family dwellings)",
          "B2 — IBC (commercial buildings)",
          "E1 — NEC + IRC electrical chapters",
          "P1 — IPC + IRC plumbing chapters",
          "M1 — IMC + IRC mechanical chapters",
          "NHIE — National Home Inspector Exam (EBPHI)",
        ],
      },
    ],
  },
  {
    question: "Are ICC exams open book?",
    answer: [
      {
        type: "p",
        text: "Yes. All ICC inspector certification exams are open book, multiple-choice exams. You bring the current edition of the applicable code and are tested on your ability to find and apply its requirements.",
      },
      {
        type: "p",
        text: "Success depends on code navigation:",
      },
      {
        type: "ul",
        items: [
          "Knowing which chapter covers which system",
          "Using the index efficiently under time pressure",
          "Reading sections carefully, including their exceptions",
        ],
      },
      {
        type: "p",
        text: "Inspect Practice questions are designed to build exactly that skill.",
      },
    ],
  },
  {
    question: "How does the AI adaptive difficulty work?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice adjusts question difficulty based on your performance:",
      },
      {
        type: "ul",
        items: [
          "Score 80% or higher on a set of questions → difficulty increases (EASY → MEDIUM → HARD)",
          "Score below 50% → difficulty decreases",
        ],
      },
      {
        type: "p",
        text: "This ensures you are always studying at the right level to maximize learning efficiency.",
      },
    ],
  },
  {
    question: "Is Inspect Practice available on mobile?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice is a web application optimized for desktop and mobile browsers. You can study anywhere, anytime from your phone, tablet, or computer — no app download required. The responsive design adapts to any screen size.",
      },
    ],
  },
  {
    question: "What is the AI Tutor and how does it work?",
    answer: [
      {
        type: "p",
        text: "The AI Tutor is an interactive chat feature that helps you understand difficult concepts. When you encounter a question you do not understand, you can ask the AI Tutor for a simplified explanation.",
      },
      {
        type: "p",
        text: "It uses AI to break down complex code requirements into clear, digestible answers, citing the relevant sections.",
      },
    ],
  },
  {
    question: "What plans are available?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice offers four plans:",
      },
      {
        type: "ul",
        items: [
          "FREE — first chapter of every exam category in practice mode",
          "MONTHLY — $29.99 per month, full access to all exams and features",
          "YEARLY — $99 per year (2 months free vs Monthly)",
          "LIFETIME — $199 one-time payment for permanent access to all current and future content",
        ],
      },
    ],
  },
  {
    question: "How many questions are in the question bank?",
    answer: [
      {
        type: "p",
        text: "Inspect Practice includes a comprehensive question bank of over 7,200 questions covering B1, B2, E1, P1, and M1.",
      },
      {
        type: "ul",
        items: [
          "Scenario-based questions with exact code references (IRC R-section numbers, NEC articles, IPC/IMC chapters)",
          "New questions regularly added to stay aligned with current code editions",
        ],
      },
      {
        type: "p",
        text: "FREE users have access to a subset of questions, while paid subscribers get the full bank.",
      },
    ],
  },
  {
    question: "What is covered in the B1 (Residential Building Inspector) certification?",
    answer: [
      {
        type: "p",
        text: "The B1 certification covers one- and two-family dwellings and townhouses up to three stories, based on the International Residential Code (IRC).",
      },
      {
        type: "p",
        text: "The question bank covers:",
      },
      {
        type: "ul",
        items: [
          "Code administration",
          "Building planning",
          "Foundations, floors and wall construction",
          "Wall covering and roof-ceiling construction",
          "Roofing, chimneys and fireplaces",
          "Energy efficiency",
        ],
      },
    ],
  },
  {
    question: "What is covered in the B2 (Commercial Building Inspector) certification?",
    answer: [
      {
        type: "p",
        text: "The B2 certification covers commercial buildings based on the International Building Code (IBC).",
      },
      {
        type: "p",
        text: "The question bank covers:",
      },
      {
        type: "ul",
        items: [
          "Occupancy classification",
          "Types of construction",
          "Fire protection systems",
          "Means of egress",
          "Accessibility",
          "Structural provisions",
        ],
      },
    ],
  },
  {
    question: "What is covered in E1, P1, and M1?",
    answer: [
      {
        type: "p",
        text: "The three trade-specific certifications each cover their own code discipline:",
      },
      {
        type: "ul",
        items: [
          "E1 (Residential Electrical Inspector) — National Electrical Code plus IRC electrical chapters: services, branch circuits, wiring methods, grounding and bonding",
          "P1 (Residential Plumbing Inspector) — IPC plus IRC plumbing chapters: fixtures, water supply, drainage and venting",
          "M1 (Residential Mechanical Inspector) — IMC plus IRC mechanical chapters: HVAC equipment, duct systems, combustion air, and venting",
        ],
      },
    ],
  },
  {
    question: "Which certification should I choose — B1, B2, E1, P1, or M1?",
    answer: [
      {
        type: "p",
        text: "Most inspectors start with B1 (Residential Building Inspector), the entry point for residential inspection careers. From there, B2 adds commercial work, while E1, P1, and M1 add trade-specific credentials (electrical, plumbing, and mechanical).",
      },
      {
        type: "p",
        text: "The right choice depends on your jurisdiction and career goals — many inspectors build a portfolio of certifications over time. Inspect Practice covers all five so you can study for multiple certifications on one platform.",
      },
    ],
  },
  {
    question: "Can I track my progress across exams?",
    answer: [
      {
        type: "p",
        text: "Yes, Inspect Practice provides detailed analytics to help you identify weak areas and focus your study time:",
      },
      {
        type: "ul",
        items: [
          "Accuracy by chapter",
          "Difficulty progression",
          "Exam history",
          "Performance trends",
        ],
      },
    ],
  },
  {
    question: "How do I get started?",
    answer: [
      {
        type: "p",
        text: "Getting started takes three steps:",
      },
      {
        type: "ul",
        items: [
          "Visit inspectpractice.com and create a free account",
          "Choose the FREE plan to try the platform",
          "Upgrade to MONTHLY, YEARLY, or LIFETIME when you are ready for full access",
        ],
      },
    ],
  },
];

const answerPlain = (faq: (typeof faqs)[number]) =>
  faq.answer
    .map((b) =>
      b.type === "ul" ? (b.items ?? []).join(". ") : (b as { text: string }).text,
    )
    .join(" ");

export default function FAQPage() {
  return (
    <>
      <FAQPageJsonLd
        questions={faqs.map((f) => ({
          question: f.question,
          answer: answerPlain(f),
        }))}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "https://inspectpractice.com" },
          { name: "FAQ", url: "https://inspectpractice.com/faq" },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        {/* Nav */}
        <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <a
              href="/"
              className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#586A73] max-w-2xl">
            Everything you need to know about Inspect Practice, ICC certification,
            and how our AI-powered platform works.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-0 divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-6 cursor-pointer">
              <summary className="flex items-start justify-between gap-4 list-none">
                <h2 className="text-lg font-medium text-[#102631] group-hover:text-[#176B87] transition-colors">
                  {faq.question}
                </h2>
                <span className="text-[#176B87] text-xl group-open:rotate-180 transition-transform flex-shrink-0">
                  ▼
                </span>
              </summary>
              <div className="mt-4 text-sm text-[#586A73] leading-relaxed space-y-3">
                {faq.answer.map((block, bi) =>
                  block.type === "ul" ? (
                    <ul key={bi} className="list-disc pl-5 space-y-1.5">
                      {(block.items ?? []).map((item, ii) => (
                        <li key={ii}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={bi}>{(block as { text: string }).text}</p>
                  ),
                )}
              </div>
            </details>
          ))}
        </div>

        <RelatedStudyPlatforms />

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="border-t border-white/5 pt-16 text-center">
            <h2 className="text-2xl font-bold text-[#102631] mb-2">
              Still have questions?
            </h2>
            <p className="text-[#586A73] mb-6">
              Our team is here to help you on your certification journey.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#176B87] hover:bg-[#176B87] rounded-lg text-sm font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
