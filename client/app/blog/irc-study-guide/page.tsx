import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'IRC Study Guide: How to Navigate the International Residential Code — Inspect Practice',
  description:
    'Master the International Residential Code (IRC) for your ICC B1 exam. Chapter-by-chapter map, section-numbering system, index strategies, and open-book lookup drills.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/irc-study-guide',
    languages: {
      en: 'https://inspectpractice.com/blog/irc-study-guide',
    },
  },
  openGraph: {
    title: 'IRC Study Guide: How to Navigate the International Residential Code — Inspect Practice',
    description:
      'Master the International Residential Code (IRC) for your ICC B1 exam. Chapter-by-chapter map, section-numbering system, index strategies, and open-book lookup drills.',
    url: 'https://inspectpractice.com/blog/irc-study-guide',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'IRC Study Guide',
      },
    ],
  },
  twitter: {
    title: 'IRC Study Guide: How to Navigate the International Residential Code — Inspect Practice',
  },
  other: {
    'article:published_time': '2025-04-02',
    'article:modified_time': '2026-08-18',
  },
};

export default function IrcStudyGuidePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="IRC Study Guide: How to Navigate the International Residential Code"
        description="Master the International Residential Code (IRC) for your ICC B1 exam. Chapter-by-chapter map, section-numbering system, index strategies, and open-book lookup drills."
        datePublished="2025-04-02"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/og/home.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'IRC Study Guide', url: 'https://inspectpractice.com/blog/irc-study-guide' },
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
              <span className="text-[11px] font-medium text-[#145A73] bg-[#145A73]/10 px-2 py-1 rounded">Code Navigation</span>
              <span className="text-xs text-[#7A8B94]">April 2, 2025 *updated August 18, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">IRC Study Guide: How to Navigate the International Residential Code</h1>
            <p className="text-lg text-[#586A73]">
              The ICC B1 exam is open book — which means the single most important skill is finding the right
              section fast. This guide maps the entire International Residential Code so you can navigate it the
              way experienced inspectors do.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#145A73] to-[#10455B] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#102631]">Inspect Practice Team</p>
              <p className="text-xs text-[#7A8B94]">ICC exam preparation specialists — code navigation drills for open-book exams</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">Why Navigation Beats Memorization</h2>
            <p>
              Open-book exams change the game entirely. Instead of memorizing hundreds of code requirements, you
              need to know <em>where each requirement lives</em> and how to reach it in under two minutes.
              Candidates who treat the IRC like a reference manual — not a textbook to memorize — consistently
              outperform those who cram.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">The IRC Chapter Map</h2>
            <p>The IRC is organized by construction sequence and system. Here is the mental map you need:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chapter 1 — Scope and Administration:</strong> permits, inspections, and enforcement. Know the inspector's authority and the required inspection sequence.</li>
              <li><strong>Chapter 2 — Definitions:</strong> the code's vocabulary. Many exam questions turn on a defined term — when in doubt, check the definitions first.</li>
              <li><strong>Chapter 3 — Building Planning:</strong> light, ventilation, egress, stairways, guards, and fire safety between dwelling units (R302–R325). Heavy exam territory.</li>
              <li><strong>Chapter 4 — Foundations:</strong> footings, foundation walls, frost protection, dampproofing, and waterproofing (R401–R408).</li>
              <li><strong>Chapter 5 — Floors:</strong> floor framing, girders, floor sheathing (R501–R509).</li>
              <li><strong>Chapter 6 — Wall Construction:</strong> stud walls, headers, bracing, and wall sheathing (R601–R611).</li>
              <li><strong>Chapter 7 — Wall Covering:</strong> interior and exterior wall coverings, including veneers (R701–R707).</li>
              <li><strong>Chapter 8 — Roof-Ceiling Construction:</strong> ceiling and roof framing, rafters, and ceiling joists (R801–R806).</li>
              <li><strong>Chapter 9 — Roof Assemblies:</strong> roof covering materials, slopes, and underlayment (R901–R908).</li>
              <li><strong>Chapter 10 — Chimneys and Fireplaces:</strong> masonry and factory-built systems (R1001–R1006).</li>
              <li><strong>Chapter 11 — Energy Efficiency:</strong> insulation, air leakage, and fenestration requirements.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Understanding Section Numbering</h2>
            <p>
              Every IRC section follows the pattern <strong>R + Chapter + Section</strong>. R403 is in Chapter 4
              (Foundations); R905 is in Chapter 9 (Roof Assemblies). Subsections add decimals: R403.1.4 is the
              fourth sub-item of R403.1, itself the first sub-item of R403.
            </p>
            <p>
              On the exam, the answer choices often cite different sections. If you recognize that a question
              about foundation depth must live in Chapter 4, you can eliminate every answer citing a section from
              another chapter — even before you open the book.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Index-First Strategy</h2>
            <p>The fastest lookup technique on open-book exams is index-first navigation:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Read the question, identify the subject</strong> — e.g., "minimum stair width," "guard height," "frost depth."</li>
              <li><strong>Go to the index, find the subject</strong> — the index lists the section number directly.</li>
              <li><strong>Flip to the section and read the exact language</strong> — watch for exceptions ("unless," "except") that modify the rule.</li>
              <li><strong>Confirm the section matches</strong> — the correct answer will be a paraphrase of the code text.</li>
            </ul>
            <p>
              Practice this loop until it is automatic. With 60 questions and 120 minutes, you have roughly two
              minutes per question — index-first navigation comfortably fits in that window.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">High-Weight Sections to Know Cold</h2>
            <p>While the whole code is fair game, these sections appear disproportionately often on B1 exams:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>R302</strong> — fire-resistant construction and opening protection between units</li>
              <li><strong>R311</strong> — means of egress, stairways, and guards</li>
              <li><strong>R312</strong> — guard and window fall protection</li>
              <li><strong>R403</strong> — footings and frost protection</li>
              <li><strong>R602</strong> — wall framing and bracing</li>
              <li><strong>R905</strong> — roof covering materials and slopes</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Drill with Real Practice Questions</h2>
            <p>
              Reading about navigation is not enough — you need reps. Inspect Practice's B1 question bank is
              built around open-book scenarios: every question includes the exact IRC reference so you learn the
              pattern, and timed simulations replicate the real exam. Start with{' '}
              <a href="/free-icc-practice-questions" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                free ICC practice questions
              </a>{' '}
              to practice your lookup speed today.
            </p>
            <p>
              For the full certification roadmap, see our{' '}
              <a href="/blog/icc-b1-certification-guide" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                ICC B1 certification guide
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="IRC Study Guide — International Residential Code Navigation"
        description="Chapter-by-chapter guide to the International Residential Code (IRC) with section-numbering, index-first lookup strategies, and open-book exam drills."
        educationalLevel="Professional"
        teaches={['IRC Chapter Map', 'Section Numbering', 'Index-First Lookups', 'Open-Book Exam Strategy', 'High-Weight IRC Sections']}
        resourceType="Guide"
      />
    </>
  );
}
