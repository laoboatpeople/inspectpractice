import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores — Inspect Practice',
  description:
    'Complete comparison of all 5 ICC certification exams with a detailed table showing question counts, time limits, and passing scores for B1, B2, E1, P1 and M1 building inspector certifications.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog/icc-exam-structure',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-structure',
    },
  },
  openGraph: {
    title: 'ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores — Inspect Practice',
    description:
      'Complete comparison of all 5 ICC certification exams with a detailed table showing question counts, time limits, and passing scores for B1, B2, E1, P1 and M1.',
    url: 'https://inspectpractice.com/blog/icc-exam-structure',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'ICC Exam Structure',
      },
    ],
  },
  twitter: {
    title: 'ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-20',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStructurePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores"
        description="Complete comparison of all 5 ICC certification exams with a detailed table showing question counts, time limits, passing scores, and main reference codes for the B1, B2, E1, P1 and M1 certifications."
        datePublished="2026-05-20"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
          { name: 'ICC Exam Structure', url: 'https://inspectpractice.com/blog/icc-exam-structure' },
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
              <span className="text-[11px] font-medium text-[#145A73] bg-[#145A73]/10 px-2 py-1 rounded">Exams</span>
              <span className="text-xs text-[#7A8B94]">May 20, 2026 *updated August 18, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 14 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores</h1>
            <p className="text-lg text-[#586A73]">
              All five ICC building-inspector certifications are open-book, multiple-choice exams — but the
              details differ. This guide compares every exam side by side so you know exactly what you are
              walking into.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#145A73] to-[#10455B] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#102631]">Inspect Practice Team</p>
              <p className="text-xs text-[#7A8B94]">ICC exam preparation specialists — exam-structure data verified against official ICC bulletins</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">The Five Certifications at a Glance</h2>
            <p>All ICC inspector exams share the same DNA: open book, multiple choice, 75% to pass. Here is the full comparison:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse my-6">
                <thead>
                  <tr className="border-b border-[#DCE4E7] text-left">
                    <th className="py-2 pr-4 text-[#102631]">Cert</th>
                    <th className="py-2 pr-4 text-[#102631]">Scope</th>
                    <th className="py-2 pr-4 text-[#102631]">Code</th>
                    <th className="py-2 pr-4 text-[#102631]">Questions</th>
                    <th className="py-2 pr-4 text-[#102631]">Time</th>
                    <th className="py-2 text-[#102631]">Pass</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#102631]">B1</td>
                    <td className="py-2 pr-4">Residential Building Inspector</td>
                    <td className="py-2 pr-4">IRC</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 hours</td>
                    <td className="py-2">75%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#102631]">B2</td>
                    <td className="py-2 pr-4">Commercial Building Inspector</td>
                    <td className="py-2 pr-4">IBC</td>
                    <td className="py-2 pr-4">80</td>
                    <td className="py-2 pr-4">3.5 hours</td>
                    <td className="py-2">75%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#102631]">E1</td>
                    <td className="py-2 pr-4">Residential Electrical Inspector</td>
                    <td className="py-2 pr-4">NEC + IRC</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 hours</td>
                    <td className="py-2">75%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#102631]">P1</td>
                    <td className="py-2 pr-4">Residential Plumbing Inspector</td>
                    <td className="py-2 pr-4">IPC + IRC</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 hours</td>
                    <td className="py-2">75%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#102631]">M1</td>
                    <td className="py-2 pr-4">Residential Mechanical Inspector</td>
                    <td className="py-2 pr-4">IMC + IRC</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 hours</td>
                    <td className="py-2">75%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <em>Note:</em> verify the exact numbers in the current official ICC exam bulletin for your
              certification and code edition — ICC occasionally updates formats.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">B1 — Residential Building Inspector (IRC)</h2>
            <p>
              The entry-point certification covering one- and two-family dwellings and townhouses up to three
              stories. Content follows the IRC: administration, building planning, foundations, floors, walls,
              wall covering, roof-ceiling construction, roofing, chimneys, and energy efficiency. 60 questions in
              2 hours — about 2 minutes per question.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">B2 — Commercial Building Inspector (IBC)</h2>
            <p>
              The commercial counterpart, based on the International Building Code. B2 is the longest exam in the
              family: 80 questions in 3.5 hours. Content covers occupancy classification, types of construction,
              fire protection, means of egress, accessibility, and structural provisions.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">E1 — Residential Electrical Inspector (NEC + IRC)</h2>
            <p>
              The E1 exam tests the National Electrical Code along with the IRC electrical chapters (Ch. 34–43).
              Expect questions on services, feeders, branch circuits, wiring methods, grounding and bonding,
              overcurrent protection, and residential electrical inspection procedures.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">P1 — Residential Plumbing Inspector (IPC + IRC)</h2>
            <p>
              The P1 exam covers the International Plumbing Code plus the IRC plumbing chapters (Ch. 25–33):
              fixtures, water supply, drainage and venting, traps, and inspection of plumbing systems in
              residential construction.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">M1 — Residential Mechanical Inspector (IMC + IRC)</h2>
            <p>
              The M1 exam covers the International Mechanical Code plus the IRC mechanical chapters (Ch. 12–24):
              heating and cooling equipment, duct systems, combustion air, venting, and fuel-gas systems in
              residential buildings.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">How the Open-Book Format Changes Your Strategy</h2>
            <p>
              Every one of these exams is open book, so your preparation should be navigation-heavy: learn the
              chapter map of your code, drill index-first lookups, and practice with questions that cite exact
              sections. Read our{' '}
              <a href="/blog/irc-study-guide" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                IRC navigation guide
              </a>{' '}
              and{' '}
              <a href="/blog/icc-study-techniques" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                open-book study techniques
              </a>{' '}
              to build that skill.
            </p>
            <p>
              Ready to practice? Try{' '}
              <a href="/free-icc-practice-questions" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                free ICC practice questions
              </a>{' '}
              in the real exam format.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="ICC Exam Structure: B1, B2, E1, P1 & M1"
        description="Side-by-side comparison of all five ICC certification exams — question counts, time limits, passing scores, and reference codes."
        educationalLevel="Professional"
        teaches={['ICC B1 Exam', 'ICC B2 Exam', 'ICC E1 Exam', 'ICC P1 Exam', 'ICC M1 Exam']}
        resourceType="Guide"
      />
    </>
  );
}
