import { BlogPostingJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NHIE Home Inspector Exam: The Complete Guide for 2026 — Inspect Practice',
  description:
    'Everything home inspectors need to know about the EBPHI National Home Inspector Examination: exam structure, 70/20/10 domains, scoring, state requirements, and the smartest way to prepare with practice questions and theory.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/nhie-home-inspector-exam',
  },
  openGraph: {
    title: 'NHIE Home Inspector Exam: The Complete Guide for 2026',
    description:
      'NHIE structure, scoring, state requirements and how to prepare. Plus how Inspect Practice covers all 15 NHIE chapters with 1,200 questions.',
    url: 'https://inspectpractice.com/blog/nhie-home-inspector-exam',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/blog-nhie-home-inspector-exam.jpg',
        width: 1200,
        height: 630,
        alt: 'NHIE Home Inspector Exam Guide — Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHIE Home Inspector Exam: The Complete Guide for 2026',
  },
  other: {
    'article:published_time': '2026-09-03',
    'article:modified_time': '2026-09-03',
  },
};

export default function NhieBlogPostPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="NHIE Home Inspector Exam: The Complete Guide for 2026"
        description="Everything home inspectors need to know about the EBPHI National Home Inspector Examination: structure, scoring, state requirements and preparation strategy."
        datePublished="2026-09-03"
        dateModified="2026-09-03"
        url="https://inspectpractice.com/blog/nhie-home-inspector-exam"
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'NHIE Home Inspector Exam Guide', url: 'https://inspectpractice.com/blog/nhie-home-inspector-exam' },
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
              <span className="text-[11px] font-medium text-[#145A73] bg-[#145A73]/10 px-2 py-1 rounded">Home Inspection</span>
              <span className="text-xs text-[#7A8B94]">September 3, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">NHIE Home Inspector Exam: The Complete Guide for 2026</h1>
            <p className="text-lg text-[#586A73]">
              Thinking about becoming a licensed home inspector? The National Home Inspector Examination
              (NHIE) is the national standard credential — here is exactly what it tests, how it is scored,
              and how to prepare.
            </p>
          </header>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">What Is the NHIE?</h2>
            <p>
              The NHIE is a proctored, closed-book, multiple-choice exam developed and owned by the{' '}
              <strong>Examination Board of Professional Home Inspectors (EBPHI)</strong>, a nonprofit created
              in 1999 to set the national standard of competence for home inspectors. State regulators adopt
              the exam as the licensing gate for the professionals who inspect existing homes for real-estate
              buyers, sellers and lenders.
            </p>
            <p>
              Roughly <strong>30 U.S. states and several Canadian provinces</strong> recognize or require the
              NHIE. Registration and delivery are handled by PSI (most states), Pearson VUE (Florida, Texas,
              Nevada) and AMP (Illinois, South Dakota, Washington and Canada). The exam fee is about{' '}
              <strong>$225</strong> per attempt, and eligible veterans can be reimbursed through GI Bill
              benefits.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">NHIE Exam Structure: The 70/20/10 Split</h2>
            <p>
              Candidates are given <strong>four hours</strong> to complete the exam. Questions come from three
              official content domains, weighted by the EBPHI role-delineation study:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Property and Building Inspection / Site Review — 70%</strong>: site conditions and grounds, exterior components, roofing, structural, electrical, cooling, heating, insulation and moisture management, mechanical exhaust, plumbing and fuel distribution, interior, fireplaces and fuel-burning appliances, and life-safety equipment.</li>
              <li><strong>Analysis of Findings and Reporting — 20%</strong>: describing what was inspected, stating limitations (what was NOT inspected and why), describing defective or non-functioning systems, and recommending further evaluation.</li>
              <li><strong>Professional Responsibilities — 10%</strong>: pre-inspection agreements, conflicts of interest, objectivity and professional liability.</li>
            </ul>
            <p>
              The NHIE is <strong>closed book</strong>: no reference books and no calculators are permitted.
              Success comes from genuine knowledge of building components, typical defects, safety issues and
              reporting standards — not from code navigation.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Scoring and Retakes</h2>
            <p>
              The NHIE uses scaled scoring from <strong>200 to 800</strong> with a passing score of{' '}
              <strong>500</strong> — roughly 70% of questions correct, adjusted for form difficulty. If you do
              not pass, you can retake the exam after a <strong>30-day wait</strong>; each attempt requires a
              separate registration fee. Most candidates plan for one sitting with several weeks of focused
              practice.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">NHIE vs ICC B1: Two Different Careers</h2>
            <p>
              Both credentials involve inspecting buildings and both are offered on Inspect Practice, but they
              prepare you for different roles. The{' '}
              <a href="/icc-certification-guide" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                ICC B1 credential
              </a>{' '}
              qualifies municipal-style
              building inspectors who verify code compliance during construction — it is an open-book exam
              based on the IRC. The <strong>NHIE</strong> qualifies private home inspectors who assess the
              condition of existing homes for transactions — a closed-book exam of general knowledge. Because
              the underlying building knowledge overlaps heavily, many inspectors pursue both over their
              career.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">How to Prepare for the NHIE</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Learn the standards of practice.</strong> Know what a standard inspection covers — and its limits (visual, accessible areas only).</li>
              <li><strong>Build component knowledge system by system.</strong> For roofing, structure, electrical, plumbing, HVAC and interiors: common materials, failure indicators, and safety issues.</li>
              <li><strong>Drill scenario questions.</strong> The exam rewards recognizing defects in realistic situations and choosing the correct reporting response.</li>
              <li><strong>Practice reporting judgment.</strong> Analysis of findings and professional responsibilities carry 30% of the exam combined — limitations language, severity classification and ethics.</li>
              <li><strong>Simulate exam conditions.</strong> Timed, closed-book practice sessions build the stamina and pacing needed for four hours.</li>
            </ol>
            <p>
              Inspect Practice covers the entire NHIE outline — 15 chapters with 1,200 exam-style questions,
              English theory with animated diagrams, timed simulations and an AI tutor. Try six{' '}
              <a href="/free-nhie-practice-questions" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                free NHIE practice questions
              </a>{' '}
              or read the{' '}
              <a href="/nhie-certification-guide" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                complete NHIE certification guide
              </a>{' '}
              with the full chapter-by-chapter breakdown.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Is Home Inspection Right for You?</h2>
            <p>
              Home inspection is a real-estate-driven profession with a low barrier to entry for experienced
              tradespeople, contractors and property professionals. Regulated states require the NHIE for
              licensure, which keeps the profession standardized. It pairs naturally with ICC credentials for
              inspectors who later want municipal or compliance roles — both paths are covered on one
              platform at Inspect Practice.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
