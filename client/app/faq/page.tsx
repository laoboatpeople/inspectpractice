import { FAQPageJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata = {
  title: 'FAQ — Inspect Practice ICC Exam Preparation',
  description:
    'Frequently asked questions about ICC building inspector certifications, the Inspect Practice platform, pricing, and how AI-powered exam preparation works.',
  alternates: {
    canonical: 'https://inspectpractice.com/faq',
    languages: {
      en: 'https://inspectpractice.com/faq',
    },
  },
  openGraph: {
    title: 'Inspect Practice FAQ — ICC Exam Preparation',
    description:
      'Find answers to common questions about ICC certification, the International Codes, and our AI-powered study platform.',
    url: 'https://inspectpractice.com/faq',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice FAQ - ICC Exam Preparation',
      },
    ],
  },
  twitter: {
    title: 'FAQ — Inspect Practice ICC Exam Preparation',
  },
};

const faqs = [
  {
    question: 'What is Inspect Practice?',
    answer:
      'Inspect Practice is an AI-powered web application designed to help building inspectors prepare for International Code Council (ICC) certification exams. It covers B1 (Residential Building Inspector — IRC), B2 (Commercial Building Inspector — IBC), E1 (Residential Electrical Inspector — NEC), P1 (Residential Plumbing Inspector — IPC), and M1 (Residential Mechanical Inspector — IMC) with adaptive difficulty, open-book exam simulations, and code-referenced explanations.',
  },
  {
    question: 'Which ICC certifications does Inspect Practice cover?',
    answer:
      'Inspect Practice covers all five core ICC inspector certifications: B1 (IRC — one- and two-family dwellings), B2 (IBC — commercial buildings), E1 (NEC + IRC electrical chapters), P1 (IPC + IRC plumbing chapters), and M1 (IMC + IRC mechanical chapters).',
  },
  {
    question: 'Are ICC exams open book?',
    answer:
      'Yes. All ICC inspector certification exams are open book, multiple-choice exams. You bring the current edition of the applicable code and are tested on your ability to find and apply its requirements. Success depends on code navigation — knowing which chapter covers which system, using the index efficiently, and reading sections including their exceptions. Inspect Practice questions are designed to build exactly that skill.',
  },
  {
    question: 'How does the AI adaptive difficulty work?',
    answer:
      'Inspect Practice adjusts question difficulty based on your performance. Score 80% or higher on a set of questions, and the system increases difficulty (EASY → MEDIUM → HARD). Score below 50%, and the difficulty decreases. This ensures you are always studying at the right level to maximize learning efficiency.',
  },
  {
    question: 'Is Inspect Practice available on mobile?',
    answer:
      'Inspect Practice is a web application optimized for desktop and mobile browsers. You can study anywhere, anytime from your phone, tablet, or computer — no app download required. The responsive design adapts to any screen size.',
  },
  {
    question: 'What is the AI Tutor and how does it work?',
    answer:
      'The AI Tutor is an interactive chat feature that helps you understand difficult concepts. When you encounter a question you do not understand, you can ask the AI Tutor for a simplified explanation. It uses AI to break down complex code requirements into clear, digestible answers, citing the relevant sections.',
  },
  {
    question: 'What plans are available?',
    answer:
      'Inspect Practice offers four plans: FREE (limited access to one exam category), MONTHLY ($29.99 per month with full access to all exams and features), YEARLY ($99 per year — 2 months free vs Monthly), and LIFETIME ($199 one-time payment for permanent access to all current and future content).',
  },
  {
    question: 'How many questions are in the question bank?',
    answer:
      'Inspect Practice includes a comprehensive question bank of over 2,500 questions covering B1, B2, E1, P1, and M1. Questions are scenario-based with exact code references (IRC R-section numbers, NEC articles, IPC/IMC chapters). New questions are regularly added and updated to stay aligned with current code editions. FREE users have access to a subset of questions, while paid subscribers get the full bank.',
  },
  {
    question: 'What is covered in the B1 (Residential Building Inspector) certification?',
    answer:
      'The B1 certification covers one- and two-family dwellings and townhouses up to three stories, based on the International Residential Code (IRC). The question bank covers code administration, building planning, foundations, floors, wall construction, wall covering, roof-ceiling construction, roofing, chimneys and fireplaces, and energy efficiency.',
  },
  {
    question: 'What is covered in the B2 (Commercial Building Inspector) certification?',
    answer:
      'The B2 certification covers commercial buildings based on the International Building Code (IBC). The question bank covers occupancy classification, types of construction, fire protection systems, means of egress, accessibility, and structural provisions.',
  },
  {
    question: 'What is covered in E1, P1, and M1?',
    answer:
      'E1 (Residential Electrical Inspector) covers the National Electrical Code plus IRC electrical chapters: services, branch circuits, wiring methods, grounding and bonding. P1 (Residential Plumbing Inspector) covers the IPC plus IRC plumbing chapters: fixtures, water supply, drainage and venting. M1 (Residential Mechanical Inspector) covers the IMC plus IRC mechanical chapters: HVAC equipment, duct systems, combustion air, and venting.',
  },
  {
    question: 'Which certification should I choose — B1, B2, E1, P1, or M1?',
    answer:
      'Most inspectors start with B1 (Residential Building Inspector), the entry point for residential inspection careers. From there, B2 adds commercial work, while E1, P1, and M1 add trade-specific credentials (electrical, plumbing, and mechanical). The right choice depends on your jurisdiction and career goals — many inspectors build a portfolio of certifications over time. Inspect Practice covers all five so you can study for multiple certifications on one platform.',
  },
  {
    question: 'Can I track my progress across exams?',
    answer:
      'Yes, Inspect Practice provides detailed analytics including accuracy by chapter, difficulty progression, exam history, and performance trends. This helps you identify weak areas and focus your study time effectively.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Visit inspectpractice.com to get started. Create a free account, choose the FREE plan to try it out, and upgrade to MONTHLY, YEARLY, or LIFETIME when you are ready for full access.',
  },
];

export default function FAQPage() {
  return (
    <>
      <FAQPageJsonLd questions={faqs} />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'FAQ', url: 'https://inspectpractice.com/faq' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
        {/* Nav */}
        <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <a
              href="/"
              className="text-sm text-[#94A3B8] hover:text-white transition-colors"
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
          <p className="text-lg text-[#94A3B8] max-w-2xl">
            Everything you need to know about Inspect Practice, ICC certification,
            and how our AI-powered platform works.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-0 divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-6 cursor-pointer">
              <summary className="flex items-start justify-between gap-4 list-none">
                <h2 className="text-lg font-medium text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">
                  {faq.question}
                </h2>
                <span className="text-[#3B82F6] text-xl group-open:rotate-180 transition-transform flex-shrink-0">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-sm text-[#94A3B8] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <RelatedStudyPlatforms />

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="border-t border-white/5 pt-16 text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">
              Still have questions?
            </h2>
            <p className="text-[#94A3B8] mb-6">
              Our team is here to help you on your certification journey.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
