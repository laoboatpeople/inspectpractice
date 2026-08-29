import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: '12-Week ICC Exam Study Plan: A Step-by-Step Schedule — Inspect Practice',
  description:
    'A proven 12-week study plan for ICC certification exams (B1, B2, E1, P1, M1). Week-by-week schedule covering code navigation, practice questions, and timed simulations.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/icc-exam-study-plan',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-study-plan',
    },
  },
  openGraph: {
    title: '12-Week ICC Exam Study Plan: A Step-by-Step Schedule — Inspect Practice',
    description:
      'A proven 12-week study plan for ICC certification exams (B1, B2, E1, P1, M1). Week-by-week schedule covering code navigation, practice questions, and timed simulations.',
    url: 'https://inspectpractice.com/blog/icc-exam-study-plan',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: '12-Week ICC Exam Study Plan',
      },
    ],
  },
  twitter: {
    title: '12-Week ICC Exam Study Plan: A Step-by-Step Schedule — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStudyPlanPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="12-Week ICC Exam Study Plan: A Step-by-Step Schedule"
        description="A proven 12-week study plan for ICC certification exams. Week-by-week schedule covering the code map, chapter drills, and timed simulations for B1, B2, E1, P1 & M1."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: '12-Week ICC Exam Study Plan', url: 'https://inspectpractice.com/blog/icc-exam-study-plan' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
        <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">← Blog</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Study Plan</span>
              <span className="text-xs text-[#64748B]">May 22, 2026 *updated August 18, 2026</span>
              <span className="text-xs text-[#64748B]">· 11 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">12-Week ICC Exam Study Plan: A Step-by-Step Schedule</h1>
            <p className="text-lg text-[#94A3B8]">
              Twelve weeks is the sweet spot for ICC certification prep: enough time to learn the code map
              deeply, short enough to keep you focused. This plan works for B1, B2, E1, P1, and M1 — adjust the
              chapter lists to your code.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Inspect Practice Team</p>
              <p className="text-xs text-[#64748B]">ICC exam preparation specialists — structured plans for busy inspectors</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">How This Plan Works</h2>
            <p>
              The plan has three phases: <strong>Map (Weeks 1–2)</strong> to learn the code's structure,{' '}
              <strong>Drill (Weeks 3–8)</strong> to build navigation speed chapter by chapter, and{' '}
              <strong>Simulate (Weeks 9–12)</strong> to lock in exam-day performance. Plan on 45–60 minutes per
              day, 5–6 days per week.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 1: Map the Code (Weeks 1–2)</h2>
            <p>Your goal in these two weeks is a mental chapter map of your code, not mastery:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Week 1:</strong> Read the official ICC exam bulletin and note the content areas. Skim the code's table of contents — chapter by chapter — writing one line per chapter about what it covers. Read the definitions chapter.</li>
              <li><strong>Week 2:</strong> Take a diagnostic practice quiz (20–30 questions, untimed, open book). Record your accuracy per chapter. This is your baseline — your weak chapters are your priority list for Phase 2.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 2: Drill Chapter by Chapter (Weeks 3–8)</h2>
            <p>Each week covers one or two chapters with the same rhythm: read the chapter's key sections, then drill practice questions with the code open, reviewing every explanation and its reference.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Week 3:</strong> Building planning and egress (your code's planning/egress chapters — the highest-weight area on most exams).</li>
              <li><strong>Week 4:</strong> Foundations and floors (or the structural chapters for your code).</li>
              <li><strong>Week 5:</strong> Walls and wall covering (framing, bracing, veneers).</li>
              <li><strong>Week 6:</strong> Roof-ceiling construction and roof assemblies.</li>
              <li><strong>Week 7:</strong> Remaining chapters — chimneys/fireplaces, energy, or the trade-specific content for E1/P1/M1.</li>
              <li><strong>Week 8:</strong> Revisit your bottom three chapters from the diagnostic. Re-drill until your accuracy clears 80%.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 3: Simulate and Harden (Weeks 9–12)</h2>
            <p>This phase is all about exam conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Week 9:</strong> First full-length timed simulation (e.g., 60 questions, 2 hours, open book). Review every miss.</li>
              <li><strong>Week 10:</strong> Second simulation. Focus on pacing — you should be finishing with time to spare now. Target the chapters that cost you the most time.</li>
              <li><strong>Week 11:</strong> Third simulation plus targeted drills on remaining weak chapters. Start doing daily 5-minute index-lookup warmups.</li>
              <li><strong>Week 12:</strong> One final simulation mid-week. After that, light review only — definitions, high-weight sections, and your mistake log. Rest the day before the exam.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Daily Rhythm (45–60 Minutes)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>5 min:</strong> Index-lookup warmup — 5 random subjects, timed.</li>
              <li><strong>30–40 min:</strong> Chapter drill — 20–30 practice questions with the code open.</li>
              <li><strong>10 min:</strong> Review misses and log references.</li>
              <li><strong>5 min:</strong> Quiz yourself on section numbers from memory (active recall).</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Tools to Run This Plan</h2>
            <p>
              Inspect Practice gives you everything this plan needs in one place: chapter-organized questions
              with code references, adaptive difficulty, analytics that track your chapter-level accuracy, and
              full-length timed simulations in the real exam format. Start with{' '}
              <a href="/free-icc-practice-questions" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                free ICC practice questions
              </a>{' '}
              to build your baseline this week.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="12-Week ICC Exam Study Plan"
        description="Step-by-step 12-week study schedule for ICC certification exams — code mapping, chapter drills, and timed simulations."
        educationalLevel="Professional"
        teaches={['ICC Exam Study Schedule', 'Code Navigation Drills', 'Timed Simulations', 'Chapter-Level Analytics']}
        resourceType="Guide"
      />
    </>
  );
}
