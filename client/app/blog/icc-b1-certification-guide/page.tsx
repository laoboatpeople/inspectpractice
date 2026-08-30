import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'How to Get Your ICC B1 Residential Building Inspector Certification — Inspect Practice',
  description:
    'Complete step-by-step guide to earning your ICC B1 Residential Building Inspector certification. Eligibility, the open-book IRC exam, study strategy, and how to prepare with Inspect Practice.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/icc-b1-certification-guide',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-b1-certification-guide',
    },
  },
  openGraph: {
    title: 'How to Get Your ICC B1 Residential Building Inspector Certification — Inspect Practice',
    description:
      'Complete step-by-step guide to earning your ICC B1 Residential Building Inspector certification. Eligibility, the open-book IRC exam, study strategy, and prep tips.',
    url: 'https://inspectpractice.com/blog/icc-b1-certification-guide',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'ICC B1 Certification Guide',
      },
    ],
  },
  twitter: {
    title: 'How to Get Your ICC B1 Residential Building Inspector Certification — Inspect Practice',
  },
  other: {
    'article:published_time': '2025-03-15',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccB1CertificationGuidePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="How to Get Your ICC B1 Residential Building Inspector Certification"
        description="Complete step-by-step guide to obtaining your ICC B1 Residential Building Inspector certification. Learn eligibility requirements, the open-book IRC exam format, and how to prepare effectively."
        datePublished="2025-03-15"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'How to Get Your ICC B1 Certification', url: 'https://inspectpractice.com/blog/icc-b1-certification-guide' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/blog" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← Blog</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-2 py-1 rounded">Certification</span>
              <span className="text-xs text-[#7A8B94]">March 15, 2025 *updated August 18, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 10 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How to Get Your ICC B1 Residential Building Inspector Certification</h1>
            <p className="text-lg text-[#586A73]">
              Earning the ICC B1 Residential Building Inspector certification proves you can inspect one- and
              two-family dwellings against the International Residential Code (IRC). The exam is open book, so
              success comes from knowing where to look in the code — not from memorizing it. This guide covers
              every step, from eligibility to passing your first attempt.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#176B87] to-[#123B52] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#102631]">Inspect Practice Team</p>
              <p className="text-xs text-[#7A8B94]">ICC exam preparation specialists — helping building inspectors earn their certifications since 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">What Is the ICC B1 Certification?</h2>
            <p>
              The International Code Council (ICC) B1 certification is the standard credential for residential
              building inspectors in the United States. B1-certified inspectors are qualified to perform plan
              reviews and field inspections of one- and two-family dwellings and townhouses up to three stories,
              verifying compliance with the International Residential Code (IRC).
            </p>
            <p>
              Municipalities, counties, and third-party inspection agencies across the U.S. require or strongly
              prefer ICC certifications for their inspection staff. The B1 certification is the entry point for
              residential inspection careers — and for many inspectors it is the first step toward the B2
              (commercial) certification and the E1, P1, and M1 trade certifications.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Step 1: Meet the Basic Requirements</h2>
            <p>Before you can sit for the B1 exam, make sure you meet these foundational eligibility criteria:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>No formal education requirement</strong> — ICC certifications do not require a degree. Many inspectors enter the field from construction, home inspection, engineering technology, or code enforcement.</li>
              <li><strong>Experience helps but is not mandatory</strong> — while ICC recommends experience in building inspection or construction, candidates routinely pass B1 with focused study and a good understanding of the IRC.</li>
              <li><strong>Work experience verification</strong> — some jurisdictions and employers ask for documented field experience; the ICC exam itself does not gate you on it.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Step 2: Understand the Exam Format</h2>
            <p>
              The B1 exam is an <strong>open-book, multiple-choice exam</strong> administered by ICC. Knowing the
              format in advance removes most of the exam-day anxiety:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>60 questions</strong> drawn from the 2024 International Residential Code (IRC).</li>
              <li><strong>2 hours (120 minutes)</strong> to complete the exam.</li>
              <li><strong>75% passing score</strong> — you need 45 of 60 questions correct.</li>
              <li><strong>Open book</strong> — you may bring the IRC and approved references. Speed and accuracy at finding code sections is the real skill being tested.</li>
            </ul>
            <p>
              Content areas follow the IRC chapters: code administration (Ch. 1), definitions (Ch. 2), building
              planning (Ch. 3), foundations (Ch. 4), floors (Ch. 5), wall construction (Ch. 6), wall covering
              (Ch. 7), roof-ceiling construction (Ch. 8), roofs (Ch. 9), chimneys and fireplaces (Ch. 10), and
              energy efficiency (Ch. 11).
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Step 3: Master Open-Book Code Navigation</h2>
            <p>
              The B1 exam does not test whether you have memorized the IRC — it tests whether you can find the
              right section quickly. Here is how to build that skill:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Learn the chapter map.</strong> Know which chapter covers which system: foundations are Ch. 4, walls are Ch. 6, roofing is Ch. 9. When you read a question, your first move is to identify the chapter.</li>
              <li><strong>Use the table of contents and index.</strong> ICC exams reward inspectors who use the code's own navigation tools. Practice looking up terms in the index first, then jumping to the section.</li>
              <li><strong>Understand section numbering.</strong> IRC sections follow an R-prefix pattern (e.g., R302, R403, R905). Section titles tell you the subject; sub-sections (R403.1.4) narrow it down.</li>
              <li><strong>Practice timed lookups.</strong> In the real exam you have about 2 minutes per question. Drill yourself with timed practice questions that require finding the exact code reference.</li>
            </ul>
            <p>
              For a full walkthrough of the code's structure, see our{' '}
              <a href="/blog/irc-study-guide" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                IRC study guide
              </a>.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Step 4: Build a Study Plan Around Practice Questions</h2>
            <p>
              Because the exam is open book, passive reading is the least efficient way to prepare. The fastest
              path is active practice with exam-style questions that force you to open the code:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Start with a diagnostic quiz</strong> to see which IRC chapters are your weak spots.</li>
              <li><strong>Drill chapter by chapter</strong>, focusing first on foundations, walls, and roofing — the highest-weight content areas.</li>
              <li><strong>Take full-length timed simulations</strong> under exam conditions (60 questions, 120 minutes, code book beside you).</li>
              <li><strong>Review every explanation</strong>, especially the code reference — that is how you build the "where to look" mental map.</li>
            </ul>
            <p>
              Inspect Practice mirrors the real B1 format: open-book style questions with code references,
              adaptive difficulty, and full-length simulations. Try{' '}
              <a href="/free-icc-practice-questions" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                free ICC practice questions
              </a>{' '}
              to see the format before you commit to a plan.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Step 5: Register and Take the Exam</h2>
            <p>
              Once you feel ready, register for the B1 exam through the ICC. You can take the exam at an ICC
              computer-based testing center or via ICC's remote proctoring. Bring your current edition of the IRC
              and any approved references. On exam day:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pace yourself</strong> — 2 minutes per question on average. Flag hard questions and come back.</li>
              <li><strong>Read questions twice</strong> — ICC questions often hinge on a single qualifier like "minimum," "maximum," or "unprotected."</li>
              <li><strong>Trust your code navigation</strong> — if you practiced lookups, the section will be where you expect it.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">How Long Does It Take to Get B1?</h2>
            <p>
              Most candidates pass B1 with <strong>4 to 8 weeks</strong> of focused preparation, studying 45–60
              minutes per day. Candidates coming from construction or home inspection backgrounds often need less
              time because they already know what the systems look like — they just need to learn the code's
              language and layout. Plan an extra 2–3 weeks if you are new to the IRC entirely.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">After B1: Your Certification Path</h2>
            <p>
              The B1 certification is the foundation of a broader credential set. Many inspectors go on to add:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>B2 — Commercial Building Inspector</strong> (International Building Code, IBC)</li>
              <li><strong>E1 — Residential Electrical Inspector</strong> (NEC + IRC electrical chapters)</li>
              <li><strong>P1 — Residential Plumbing Inspector</strong> (IPC + IRC plumbing chapters)</li>
              <li><strong>M1 — Residential Mechanical Inspector</strong> (IMC + IRC mechanical chapters)</li>
            </ul>
            <p>
              Each additional certification makes you more valuable to employers and unlocks higher-level
              inspection work. Inspect Practice covers all five certifications with code-aligned practice
              questions.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="ICC B1 Residential Building Inspector Certification Guide"
        description="Complete guide to ICC B1 certification covering the IRC, open-book exam format, eligibility, study strategy, and preparation."
        educationalLevel="Professional"
        teaches={['ICC B1 Certification', 'IRC Code Navigation', 'Residential Building Inspection', 'Open-Book Exam Strategy', 'Foundations & Framing', 'Roofing & Exterior']}
        resourceType="Guide"
      />
    </>
  );
}
