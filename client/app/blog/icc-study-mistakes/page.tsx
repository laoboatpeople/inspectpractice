import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them) — Inspect Practice',
  description:
    'The most common mistakes ICC exam candidates make — from ignoring the exam bulletin to memorizing instead of navigating. Learn how to avoid these pitfalls and pass your ICC exam on the first try.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/icc-study-mistakes',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-study-mistakes',
    },
  },
  openGraph: {
    title: 'Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them) — Inspect Practice',
    description:
      'The most common mistakes ICC exam candidates make — from ignoring the exam bulletin to memorizing instead of navigating. Learn how to avoid these pitfalls and pass on your first try.',
    url: 'https://inspectpractice.com/blog/icc-study-mistakes',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'ICC Exam Mistakes',
      },
    ],
  },
  twitter: {
    title: 'Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them) — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccStudyMistakesPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them)"
        description="The most common mistakes ICC exam candidates make — from ignoring the exam bulletin to memorizing instead of navigating the code. Learn how to avoid these pitfalls and pass your ICC exam on the first try."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/og/home.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'Top 10 Mistakes ICC Exam Candidates Make', url: 'https://inspectpractice.com/blog/icc-study-mistakes' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <nav className="border-b border-[#DCE4E7] bg-[#0B3344]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=5" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/blog" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← Blog</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#145A73] bg-[#145A73]/10 px-2 py-1 rounded">Exam Strategy</span>
              <span className="text-xs text-[#7A8B94]">May 22, 2026 *updated August 18, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 9 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them)</h1>
            <p className="text-lg text-[#586A73]">
              Every year, qualified inspectors fail ICC exams for avoidable reasons. These are the ten most
              common mistakes we see — and the simple fixes that turn a near-miss into a confident pass.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#145A73] to-[#10455B] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#102631]">Inspect Practice Team</p>
              <p className="text-xs text-[#7A8B94]">ICC exam preparation specialists — helping inspectors pass the first time</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">1. Studying the Wrong Edition of the Code</h2>
            <p>
              ICC exams are based on a specific code edition, listed in the exam bulletin. Studying the 2021 IRC
              when your exam uses the 2024 edition means learning sections that may have changed. <strong>Fix:</strong>{' '}
              download the official ICC exam bulletin first and buy exactly the edition it specifies.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">2. Treating an Open-Book Exam Like a Closed-Book Exam</h2>
            <p>
              Memorizing code text is the classic mistake. The exam rewards <em>navigation speed</em>, not
              recall. <strong>Fix:</strong> practice finding sections — chapter map first, then index-first
              lookups, then timed drills with the code open.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">3. Ignoring the Exam Bulletin's Content Areas</h2>
            <p>
              The bulletin lists exactly what is tested and how many questions per area. Candidates who skip it
              waste weeks on low-weight content. <strong>Fix:</strong> read the bulletin, map its content areas to
              your study plan, and weight your time accordingly.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">4. Never Taking a Full-Length Timed Simulation</h2>
            <p>
              Walking into a 2-hour, 60-question exam without having done one timed run is like flying without
              instruments. <strong>Fix:</strong> take a full simulation weekly in the final month — same length,
              same time limit, code book beside you.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">5. Skipping the Definitions Chapter</h2>
            <p>
              The IRC and IBC definitions chapters are pure exam gold. Many questions hinge on a defined term —
              "dwelling unit," "story above grade," "fire partition." <strong>Fix:</strong> read the definitions
              chapter early and revisit it whenever a question's wording feels ambiguous.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">6. Missing the "Except" Clauses</h2>
            <p>
              Code requirements are full of exceptions, and exam questions love them. Answer choices often quote
              the general rule while the correct answer applies the exception. <strong>Fix:</strong> read the full
              section including all exceptions before choosing; circle "unless" and "except" in the question.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">7. Over-Tabbing or Under-Tabbing the Code</h2>
            <p>
              Too many tabs create noise; too few cost time. <strong>Fix:</strong> tab every chapter, plus a
              handful of high-weight sections you repeatedly search. Keep it to one glance per chapter.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">8. Not Reviewing Missed Questions</h2>
            <p>
              Practice questions only help if you learn from them. Candidates who blast through questions without
              reviewing explanations repeat the same mistakes. <strong>Fix:</strong> review every miss and log the
              code reference. Missed questions are a map of your weak chapters.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">9. Studying Alone with No Feedback Loop</h2>
            <p>
              Without feedback, you cannot tell whether you are ready. <strong>Fix:</strong> use a platform with
              analytics (like Inspect Practice) to track chapter-level accuracy, or join a study group where
              candidates compare lookup strategies and share high-weight sections.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">10. Cramming the Week Before</h2>
            <p>
              Cramming works against you on open-book exams: it crowds out the navigation practice that actually
              determines your score. <strong>Fix:</strong> in the final week, do short daily lookup drills and one
              full simulation — then rest. A fresh mind navigates faster than a tired one.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Avoid the Mistakes with the Right Tools</h2>
            <p>
              The right study system prevents most of these mistakes automatically. Build your plan with our{' '}
              <a href="/blog/icc-exam-study-plan" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                12-week study plan
              </a>{' '}
              and start practicing with{' '}
              <a href="/free-icc-practice-questions" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                free ICC practice questions
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Top 10 Mistakes ICC Exam Candidates Make"
        description="The most common ICC exam mistakes and how to avoid them — code edition errors, closed-book studying, missed exceptions, and more."
        educationalLevel="Professional"
        teaches={['ICC Exam Strategy', 'Avoiding Common Mistakes', 'Code Navigation', 'Timed Simulations', 'Exam Readiness']}
        resourceType="Guide"
      />
    </>
  );
}
