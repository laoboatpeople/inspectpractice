import {
  BreadcrumbListJsonLd,
  FAQPageJsonLd,
  LearningResourceJsonLd,
} from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'The Complete NHIE Guide — National Home Inspector Exam | Inspect Practice',
  description:
    'Everything you need to know about the EBPHI National Home Inspector Examination (NHIE): exam structure (70/20/10 domains), 4-hour format, scaled passing score of 500, state registration, and how Inspect Practice prepares you with 1,200 practice questions across 15 chapters.',
  alternates: {
    canonical: 'https://inspectpractice.com/nhie-certification-guide',
  },
  openGraph: {
    title: 'The Complete NHIE Guide — National Home Inspector Exam | Inspect Practice',
    description:
      'Pass the EBPHI National Home Inspector Exam with Inspect Practice: NHIE structure, exam day rules, 15-chapter curriculum and career insights.',
    url: 'https://inspectpractice.com/nhie-certification-guide',
    type: 'article',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/nhie-certification-guide.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete NHIE Guide — Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Complete NHIE Guide — National Home Inspector Exam',
    description:
      'NHIE structure, exam-day rules, 15-chapter curriculum and how to pass with Inspect Practice.',
  },
  other: {
    'article:published_time': '2026-09-03',
    'article:modified_time': '2026-09-03',
  },
};

const CHAPTERS = [
  ['1', 'Site Conditions and Grounds', '5%'],
  ['2', 'Building Exterior Components', '5%'],
  ['3', 'Roof Components', '6%'],
  ['4', 'Structural Components', '6%'],
  ['5', 'Electrical Systems', '7%'],
  ['6', 'Cooling Systems', '4%'],
  ['7', 'Heating Systems', '5%'],
  ['8', 'Insulation, Moisture Management and Ventilation', '5%'],
  ['9', 'Mechanical Exhaust Systems', '5%'],
  ['10', 'Plumbing and Fuel Distribution Systems', '6%'],
  ['11', 'Interior Components', '4%'],
  ['12', 'Fireplaces, Fuel-Burning Appliances and Chimney/Vent Systems', '6%'],
  ['13', 'Life Safety Equipment and Systems', '6%'],
  ['14', 'Analysis of Findings and Reporting', '20%'],
  ['15', 'Professional Responsibilities', '10%'],
];

export default function NhieCertificationGuidePage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'NHIE Certification Guide', url: 'https://inspectpractice.com/nhie-certification-guide' },
        ]}
      />
      <FAQPageJsonLd
        questions={[
          {
            question: 'What is the NHIE?',
            answer:
              'The NHIE (National Home Inspector Examination) is the national competency exam for home inspectors, developed and administered by the Examination Board of Professional Home Inspectors (EBPHI). It is accepted or required by roughly 30 U.S. states and several Canadian provinces for home inspector licensing.',
          },
          {
            question: 'What does the NHIE cover?',
            answer:
              'The NHIE has three content domains: Property and Building Inspection / Site Review (70% of questions), Analysis of Findings and Reporting (20%), and Professional Responsibilities (10%). Topics include site conditions, exterior, roofing, structural, electrical, cooling, heating, insulation, exhaust, plumbing, interior, fireplaces, life-safety equipment, reporting and professional practice.',
          },
          {
            question: 'Is the NHIE open book?',
            answer:
              'No. Unlike ICC certification exams, the NHIE is a closed-book exam — you cannot bring the IRC or other reference books into the testing room, and calculators are not permitted. Preparation therefore focuses on solid knowledge of components, defects, safety issues and standards of practice rather than code navigation.',
          },
          {
            question: 'How is the NHIE scored?',
            answer:
              'The NHIE uses scaled scoring from 200 to 800, with a passing scaled score of 500 (roughly 70% of questions correct). You are given four hours to complete the exam. If you do not pass, you may retake it after a 30-day wait; each attempt requires a separate registration fee.',
          },
          {
            question: 'How is the NHIE different from ICC B1?',
            answer:
              'ICC B1 certifies municipal-style building inspectors who verify code compliance during construction (open-book, IRC-based). The NHIE certifies private home inspectors who evaluate the condition of existing homes for real-estate buyers (closed-book, general knowledge). They share much of the same building-knowledge foundation, which is why Inspect Practice covers both.',
          },
        ]}
      />
      <LearningResourceJsonLd
        name="NHIE Certification Guide — National Home Inspector Exam"
        description="Complete guide to the EBPHI National Home Inspector Examination: structure, exam-day rules, the 15-chapter curriculum and career paths."
        educationalLevel="Professional"
        teaches={['NHIE Property and Building Inspection', 'NHIE Analysis of Findings and Reporting', 'NHIE Professional Responsibilities']}
        resourceType="Guide"
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <nav className="border-b border-[#DCE4E7] bg-[#0B3344]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=5" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/faq" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← FAQ</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#145A73] bg-[#145A73]/10 px-2 py-1 rounded">Certification</span>
              <span className="text-xs text-[#7A8B94]">September 3, 2026</span>
              <span className="text-xs text-[#7A8B94]">· 8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">The Complete NHIE Guide</h1>
            <p className="text-lg text-[#586A73]">
              The National Home Inspector Examination (NHIE) is the national standard credential for home
              inspectors in the United States. This guide explains what the exam tests, how it is scored, and
              exactly how Inspect Practice prepares you — across all 15 chapters, with theory and 1,200
              practice questions.
            </p>
          </header>

          <div className="prose prose-invert max-w-none text-[#DCE4E7] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#102631] mt-10">What Is the NHIE?</h2>
            <p>
              The NHIE is a proctored, closed-book, multiple-choice exam owned by the{' '}
              <strong>Examination Board of Professional Home Inspectors (EBPHI)</strong>. State regulatory
              bodies adopt it as the competency standard for licensed home inspectors — the professionals who
              evaluate the condition of existing homes for real-estate buyers, sellers and lenders.
            </p>
            <p>
              Roughly <strong>30 states and several Canadian provinces</strong> use the NHIE for licensing.
              Registration runs through the testing administrators: PSI in most states, Pearson VUE in
              Florida, Texas and Nevada, and AMP in Illinois, South Dakota, Washington and Canada. The exam
              fee is about $225 per attempt, and eligible veterans can be reimbursed through GI Bill benefits.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Exam Structure</h2>
            <p>
              You are given <strong>four hours</strong> to complete the exam. Questions are drawn from three
              official content domains:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Property and Building Inspection / Site Review — 70%</strong>: site conditions, exterior, roofing, structural, electrical, cooling, heating, insulation and moisture management, mechanical exhaust, plumbing and fuel distribution, interior, fireplaces and fuel-burning appliances, and life-safety equipment.</li>
              <li><strong>Analysis of Findings and Reporting — 20%</strong>: describing what was inspected, reporting limitations, describing defective or non-functioning systems, and recommending further evaluation.</li>
              <li><strong>Professional Responsibilities — 10%</strong>: pre-inspection agreements, conflicts of interest, objectivity, and professional liability.</li>
            </ul>
            <p>
              The NHIE is <strong>closed book</strong> — no code books, no calculators. Passing requires a
              scaled score of <strong>500</strong> (on the 200–800 scale, roughly 70% raw). If you fail, you
              must wait <strong>30 days</strong> before retaking the exam, and each attempt carries a new fee.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">The 15 Chapters on Inspect Practice</h2>
            <p>
              Inspect Practice mirrors the official NHIE outline chapter by chapter, so your practice
              proportions match the real exam:
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#DCE4E7]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0B3344] text-left text-[#CBEA32]">
                    <th className="px-4 py-2 font-semibold">Chapter</th>
                    <th className="px-4 py-2 font-semibold">Topic</th>
                    <th className="px-4 py-2 font-semibold text-right">Exam weight</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAPTERS.map(([n, name, w]) => (
                    <tr key={n} className="border-t border-[#DCE4E7] bg-white/60">
                      <td className="px-4 py-2 text-[#145A73] font-mono">{n}</td>
                      <td className="px-4 py-2 text-[#102631]">{name}</td>
                      <td className="px-4 py-2 text-right text-[#586A73]">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">NHIE vs ICC B1</h2>
            <p>
              Both credentials involve inspecting buildings, but they serve different roles. An{' '}
              <a href="/icc-certification-guide" className="text-[#145A73] hover:text-[#4794B8] transition-colors">
                ICC B1 inspector
              </a>{' '}
              works as a code official — often for a municipality — verifying
              that construction complies with the IRC, using an open-book code exam. An{' '}
              <strong>NHIE home inspector</strong> works privately, inspecting existing homes for buyers and
              reporting on condition rather than code compliance, on a closed-book general-knowledge exam.
              Because the underlying building knowledge overlaps heavily, Inspect Practice prepares you for
              both on one platform.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">How to Prepare</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Learn the standards of practice.</strong> Understand what a standard home inspection includes — and what it does not.</li>
              <li><strong>Know components and typical defects.</strong> For each system, learn the common materials, failure indicators and safety issues.</li>
              <li><strong>Practice scenario questions.</strong> The exam rewards recognition of defects and correct reporting judgment.</li>
              <li><strong>Work on reporting and professional responsibilities.</strong> Limitations, severity language and ethics carry 30% combined weight.</li>
              <li><strong>Simulate the 4-hour exam.</strong> Timed, closed-book practice builds stamina and pacing.</li>
            </ol>
            <p>
              Inspect Practice covers the NHIE with 1,200 exam-style questions across the 15 chapters,
              adaptive difficulty, full English theory with animated diagrams, and an AI tutor. Start free
              and try chapter one of the NHIE today.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Career Outlook</h2>
            <p>
              Home inspection is a real-estate-driven profession: inspectors are hired by buyers before
              purchase, and regulated states require the NHIE for licensure. The role suits career changers
              from construction, trades and property management. Many inspectors also add ICC credentials
              later for municipal or compliance work — Inspect Practice covers both paths.
            </p>

            <h2 className="text-xl font-semibold text-[#102631] mt-10">Ready to Start?</h2>
            <p>
              Create your free account and open the first NHIE chapter — no credit card required. The full
              NHIE curriculum (all 15 chapters, simulations and the AI tutor) is included in every paid plan.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>
    </>
  );
}
