import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'ICC Exam Study Resources: Best Codes, Books & Tools — Inspect Practice',
  description:
    'The definitive list of ICC exam study resources: official codes (IRC, IBC, NEC, IPC, IMC), ICC training materials, practice tests, and AI-powered study tools for B1, B2, E1, P1 & M1.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/icc-exam-study-resources',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-study-resources',
    },
  },
  openGraph: {
    title: 'ICC Exam Study Resources: Best Codes, Books & Tools — Inspect Practice',
    description:
      'The definitive list of ICC exam study resources: official codes (IRC, IBC, NEC, IPC, IMC), ICC training materials, practice tests, and AI-powered study tools for B1, B2, E1, P1 & M1.',
    url: 'https://inspectpractice.com/blog/icc-exam-study-resources',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'ICC Exam Study Resources',
      },
    ],
  },
  twitter: {
    title: 'ICC Exam Study Resources: Best Codes, Books & Tools — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStudyResourcesPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="ICC Exam Study Resources: Best Codes, Books & Tools"
        description="Comprehensive list of the best study resources for ICC certification exams — official codes, ICC training materials, practice tests, and Inspect Practice's AI-powered study platform."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'ICC Exam Study Resources', url: 'https://inspectpractice.com/blog/icc-exam-study-resources' },
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
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Reference</span>
              <span className="text-xs text-[#64748B]">May 22, 2026 *updated August 18, 2026</span>
              <span className="text-xs text-[#64748B]">· 10 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">ICC Exam Study Resources: Best Codes, Books & Tools</h1>
            <p className="text-lg text-[#94A3B8]">
              Whether you are pursuing the B1, B2, E1, P1, or M1 certification, the right resources make the
              difference between months of unfocused reading and a confident pass. Here is everything you need,
              ranked by how much it moves the needle.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Inspect Practice Team</p>
              <p className="text-xs text-[#64748B]">ICC exam preparation specialists — curating the best code-study tools since 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">1. The Codes Themselves (Non-Negotiable)</h2>
            <p>Every ICC certification exam is open book, and the code is your primary weapon. You must own the current edition of the code for your certification:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>B1 — International Residential Code (IRC)</strong>: one- and two-family dwellings, townhouses up to 3 stories.</li>
              <li><strong>B2 — International Building Code (IBC)</strong>: commercial and multi-family buildings.</li>
              <li><strong>E1 — National Electrical Code (NEC)</strong> plus the IRC electrical chapters (Ch. 34–43).</li>
              <li><strong>P1 — International Plumbing Code (IPC)</strong> plus the IRC plumbing chapters (Ch. 25–33).</li>
              <li><strong>M1 — International Mechanical Code (IMC)</strong> plus the IRC mechanical chapters (Ch. 12–24).</li>
            </ul>
            <p>
              Buy the code edition your exam is based on (check the ICC exam bulletin for the current edition —
              e.g., 2024 or 2021). Tab the chapters you use most, and add sticky notes for the index if that
              helps you move faster.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">2. Official ICC Study Materials</h2>
            <p>The ICC publishes exam-specific study guides and practice tests. These are the closest thing to the real exam:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>ICC Exam Bulletins</strong> — free PDFs that list the exact content areas, number of questions, time limits, and passing scores for each exam. Read yours first; it tells you what to study.</li>
              <li><strong>ICC Practice Exams</strong> — official practice tests in the same format as the real thing. Worth doing once you have covered the content.</li>
              <li><strong>ICC Training Courses</strong> — instructor-led and online courses for each certification. Good structure, but the cost adds up.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">3. Inspection Field References</h2>
            <p>Books that teach you how the systems actually go together help you interpret code language:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Residential Building Inspector Field Guide</strong> — system-by-system inspection walkthroughs.</li>
              <li><strong>Code Check series</strong> — quick-reference cards for framing, electrical, plumbing, and mechanical requirements. Excellent for the visual learner.</li>
              <li><strong>Building construction textbooks</strong> — a solid fundamentals text (e.g., "Building Construction Illustrated") builds the mental model behind the code.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">4. Practice Question Platforms (Where You Should Spend Most of Your Time)</h2>
            <p>
              Because the exams are open book, the highest-ROI activity is answering questions with the code in
              front of you. <a href="/free-icc-practice-questions" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">Inspect Practice</a>{' '}
              is purpose-built for this: exam-style questions for B1, B2, E1, P1, and M1, each with the exact
              code reference, adaptive difficulty, and timed simulations that mirror the real exam conditions.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Use the code reference on every question</strong> — even when you know the answer, open the book and find the section. That is the skill the exam rewards.</li>
              <li><strong>Track your weak chapters</strong> — analytics tell you exactly which IRC/IBC chapters need another pass.</li>
              <li><strong>Simulate under exam conditions</strong> — full-length, timed, open-book sessions at least once a week.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">5. Free Resources Worth Your Time</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>ICC website</strong> — exam bulletins, certification FAQs, and continuing education.</li>
              <li><strong>Your jurisdiction's code department</strong> — many municipal building departments publish inspection checklists that mirror the code requirements.</li>
              <li><strong>Inspect Practice's free questions</strong> — try the format before committing to a plan.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">A Smarter Study Sequence</h2>
            <p>
              Read the exam bulletin → skim the code chapter map → drill practice questions chapter by chapter →
              review explanations (especially references) → take full simulations → target weak chapters → retake
              simulations. For a week-by-week schedule, see our{' '}
              <a href="/blog/icc-exam-study-plan" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                12-week ICC study plan
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="ICC Exam Study Resources"
        description="Curated list of ICC exam study resources: official codes (IRC, IBC, NEC, IPC, IMC), ICC training materials, field references, and AI-powered practice platforms."
        educationalLevel="Professional"
        teaches={['ICC B1/B2/E1/P1/M1 Exam Prep', 'Official ICC Codes', 'ICC Practice Exams', 'Code Navigation', 'Study Tools']}
        resourceType="Guide"
      />
    </>
  );
}
