import {
  BlogPostingJsonLd,
  BreadcrumbListJsonLd,
  LearningResourceJsonLd,
  FAQPageJsonLd,
  HowToJsonLd,
} from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'Complete ICC Certification Guide — Inspect Practice',
  description:
    'The definitive guide to ICC building inspector certifications in the United States. Covers B1, B2, E1, P1, and M1 certifications, the International Codes (IRC, IBC, NEC, IPC, IMC), open-book exam formats, and career outlook.',
  alternates: {
    canonical: 'https://inspectpractice.com/icc-certification-guide',
    languages: {
      en: 'https://inspectpractice.com/icc-certification-guide',
    },
  },
  openGraph: {
    title: 'The Complete ICC Certification Guide — Inspect Practice',
    description:
      'Full guide to ICC certifications: B1 (Residential Building), B2 (Commercial), E1 (Electrical), P1 (Plumbing), M1 (Mechanical). Exam details, code references, and career insights.',
    url: 'https://inspectpractice.com/icc-certification-guide',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete ICC Certification Guide',
      },
    ],
  },
  twitter: {
    title: 'The Complete ICC Certification Guide — Inspect Practice',
    description:
      'Learn everything about ICC certifications — B1, B2, E1, P1, M1, the International Codes, open-book exams, and career prospects.',
  },
  other: {
    'article:published_time': '2026-07-07',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccCertificationGuidePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="The Complete ICC Certification Guide"
        description="The definitive guide to ICC building inspector certifications in the United States covering B1, B2, E1, P1, and M1 certifications, the International Codes, open-book exam formats, and career outlook."
        datePublished="2026-07-07"
        dateModified="2026-08-18"
        url="https://inspectpractice.com/icc-certification-guide"
        image={['https://inspectpractice.com/images/blog/ame-license-canada.jpg']}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'ICC Certification Guide', url: 'https://inspectpractice.com/icc-certification-guide' },
        ]}
      />
      <FAQPageJsonLd
        questions={[
          {
            question: 'What is the difference between ICC B1, B2, E1, P1, and M1 certifications?',
            answer:
              'B1 (Residential Building Inspector) covers one- and two-family dwellings under the International Residential Code (IRC). B2 (Commercial Building Inspector) covers commercial buildings under the International Building Code (IBC). E1 (Residential Electrical Inspector) covers the National Electrical Code (NEC) plus IRC electrical chapters. P1 (Residential Plumbing Inspector) covers the International Plumbing Code (IPC) plus IRC plumbing chapters. M1 (Residential Mechanical Inspector) covers the International Mechanical Code (IMC) plus IRC mechanical chapters.',
          },
          {
            question: 'How long does it take to get an ICC certification?',
            answer:
              'Most candidates earn their first ICC certification (typically B1) in 4–8 weeks of focused preparation. You do not need a degree, and you can register for the exam directly through the International Code Council. Each additional certification builds on the same code-navigation skills, so subsequent exams usually take less preparation time.',
          },
          {
            question: 'Are ICC exams open book?',
            answer:
              'Yes. All ICC inspector certification exams are open book, multiple-choice exams. You may bring the applicable code (IRC, IBC, NEC, IPC, or IMC) and approved references. Because the exams are open book, success depends on knowing where to look in the code — not memorizing it. Most exams require a 75% passing score.',
          },
          {
            question: 'What is the passing score for ICC exams?',
            answer:
              'Most ICC inspector certification exams require a passing score of 75%. For example, the B1 exam has 60 questions with a 2-hour time limit, and you need 45 correct answers to pass. Always verify the exact numbers in the official ICC exam bulletin for your certification and code edition.',
          },
          {
            question: 'Can I study for ICC exams online?',
            answer:
              'Yes. Inspect Practice is fully optimized for mobile and desktop browsers. You can practice with ICC-style open-book questions that cite the exact code section, take timed simulations, and use AI-powered adaptive learning that focuses on your weak areas.',
          },
          {
            question: 'What is the career outlook for building inspectors?',
            answer:
              'Demand for certified building inspectors is strong across the United States. Municipalities, counties, and third-party inspection agencies require or strongly prefer ICC certifications. ICC-certified inspectors work in residential and commercial inspection, plan review, code enforcement, and related fields, with opportunities to add certifications over time.',
          },
        ]}
      />
      <HowToJsonLd
        name="How to Get Your ICC Building Inspector Certification"
        description="Step-by-step guide to becoming ICC-certified as a building inspector in the United States."
        totalTime="P2M"
        steps={[
          { name: 'Choose Your Certification', text: 'Select your path: B1 (Residential, IRC), B2 (Commercial, IBC), E1 (Electrical, NEC), P1 (Plumbing, IPC), or M1 (Mechanical, IMC). Most inspectors start with B1.' },
          { name: 'Get the Code', text: 'Purchase the current edition of the applicable code (e.g., the 2024 IRC for B1) specified in the official ICC exam bulletin.' },
          { name: 'Learn Code Navigation', text: 'Because the exam is open book, master the chapter map, section numbering, and index-first lookup strategies before drilling questions.' },
          { name: 'Practice with Exam-Style Questions', text: 'Drill practice questions with the code open, review every explanation and its code reference, and take full-length timed simulations.' },
          { name: 'Register for the Exam', text: 'Register through the ICC and take the exam at a computer-based testing center or via ICC remote proctoring.' },
          { name: 'Pass and Add Certifications', text: 'Pass with 75% or better, then expand your credential set — B1 candidates often go on to B2, E1, P1, and M1.' },
        ]}
      />
      <LearningResourceJsonLd
        name="ICC Certification Guide — Building Inspector"
        description="Complete guide to ICC certifications in the United States. Covers B1, B2, E1, P1, and M1, the International Codes, open-book exams, and career paths."
        educationalLevel="Professional"
        teaches={['ICC B1 Certification', 'ICC B2 Certification', 'ICC E1 Certification', 'ICC P1 Certification', 'ICC M1 Certification', 'International Codes']}
        resourceType="Guide"
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/faq" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← FAQ</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-2 py-1 rounded">Certification</span>
              <span className="text-xs text-[#7A8B94]">July 7, 2026 *updated August 18, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 12 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">The Complete ICC Certification Guide</h1>
            <p className="text-lg text-[#586A73]">
              The International Code Council (ICC) certifications are the standard credentials for building
              inspectors in the United States. This guide covers all five core certifications — B1, B2, E1, P1,
              and M1 — the codes behind them, and exactly how to prepare.
            </p>
          </header>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">What Are ICC Certifications?</h2>
            <p>
              ICC certifications verify that an inspector understands the model codes used across the United
              States — the International Codes. A certified inspector is qualified to perform plan reviews and
              field inspections, verifying that buildings comply with the code requirements for life safety,
              structural integrity, and systems performance.
            </p>
            <p>
              Municipalities, counties, and third-party inspection agencies across the U.S. require or strongly
              prefer ICC certifications for inspection staff. The credential set is modular: you can hold one
              certification or build a full portfolio.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">The Five Core Certifications</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>B1 — Residential Building Inspector:</strong> one- and two-family dwellings and townhouses up to three stories, based on the International Residential Code (IRC). The entry point for most inspectors.</li>
              <li><strong>B2 — Commercial Building Inspector:</strong> commercial and multi-family buildings, based on the International Building Code (IBC).</li>
              <li><strong>E1 — Residential Electrical Inspector:</strong> electrical systems in dwellings, based on the National Electrical Code (NEC) plus the IRC electrical chapters.</li>
              <li><strong>P1 — Residential Plumbing Inspector:</strong> plumbing systems in dwellings, based on the International Plumbing Code (IPC) plus the IRC plumbing chapters.</li>
              <li><strong>M1 — Residential Mechanical Inspector:</strong> mechanical systems in dwellings, based on the International Mechanical Code (IMC) plus the IRC mechanical chapters.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Exam Format: Open Book, Code in Hand</h2>
            <p>
              Every one of these exams is <strong>open book</strong>. You bring the current edition of the
              applicable code, and you are tested on your ability to find and apply its requirements. Typical
              format: 60 questions (80 for B2), a 75% passing score, and time limits from 2 hours (B1, E1, P1,
              M1) to 3.5 hours (B2).
            </p>
            <p>
              Because the code is in your hands, the exam does not reward memorization — it rewards{' '}
              <strong>code navigation</strong>: knowing which chapter covers which system, using the index
              efficiently, and reading sections including their exceptions.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">How to Prepare</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Download your exam bulletin.</strong> The official ICC bulletin lists the exact content areas, question count, time limit, and passing score — and the code edition your exam is based on.</li>
              <li><strong>Get the right code edition.</strong> Buy the edition specified in the bulletin (e.g., 2024 IRC for B1). Tab the chapters.</li>
              <li><strong>Learn the chapter map.</strong> Know where each system lives in the code before you open a practice question.</li>
              <li><strong>Drill with the code open.</strong> Answer practice questions with the code beside you, then verify the exact section. Review every explanation.</li>
              <li><strong>Simulate under exam conditions.</strong> Full-length, timed, open-book simulations at least once a week in the final month.</li>
            </ol>
            <p>
              Inspect Practice covers all five certifications with code-referenced questions, adaptive
              difficulty, and timed simulations. Start with{' '}
              <a href="/free-icc-practice-questions" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                free ICC practice questions
              </a>{' '}
              to see the format.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Career Outlook</h2>
            <p>
              Certified building inspectors work for municipalities, counties, state agencies, and private
              inspection firms. The role spans new construction inspection, existing-building inspections, plan
              review, and code enforcement. Adding certifications — moving from B1 to B2, or adding E1, P1, and
              M1 — unlocks more senior roles and higher pay.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Ready to Start?</h2>
            <p>
              Follow the full{' '}
              <a href="/blog/icc-b1-certification-guide" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                B1 certification guide
              </a>,{' '}
              learn the{' '}
              <a href="/blog/irc-study-guide" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                IRC navigation system
              </a>,{' '}
              and build a{' '}
              <a href="/blog/icc-exam-study-plan" className="text-[#176B87] hover:text-[#4794B8] transition-colors">
                12-week study plan
              </a>{' '}
              that fits your schedule.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>
    </>
  );
}
