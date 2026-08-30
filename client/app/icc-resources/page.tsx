import { BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'ICC Resources Hub — Inspect Practice Exam Prep',
  description:
    'The best resources for ICC building inspector exam prep: B1, B2, E1, P1 & M1 certification guides, IRC/IBC code navigation, study checklists, and free practice questions.',
  alternates: {
    canonical: 'https://inspectpractice.com/icc-resources',
    languages: {
      en: 'https://inspectpractice.com/icc-resources',
    },
  },
  openGraph: {
    title: 'ICC Resources Hub — Inspect Practice Exam Prep',
    description:
      'The best resources for ICC building inspector exam prep: B1, B2, E1, P1 & M1 certification guides, IRC/IBC code navigation, study checklists, and free practice questions.',
    url: 'https://inspectpractice.com/icc-resources',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'ICC Resources Hub — Inspect Practice',
      },
    ],
  },
  twitter: {
    title: 'ICC Resources Hub — Inspect Practice Exam Prep',
  },
  other: {
    'article:published_time': '2026-05-20',
    'article:modified_time': '2026-08-18',
  },
};

interface ResourceLink {
  title: string;
  href: string;
  description: string;
}

const sections: {
  id: string;
  title: string;
  description: string;
  resources: ResourceLink[];
}[] = [
  {
    id: 'new-students',
    title: 'For New Students',
    description:
      'Starting your journey to becoming an ICC-certified building inspector? These guides walk you through the certification process, explain the different credentials, and help you choose the right path for your career.',
    resources: [
      {
        title: 'How to Get Your ICC B1 Residential Building Inspector Certification',
        href: '/blog/icc-b1-certification-guide',
        description:
          'A complete step-by-step guide covering ICC requirements, the open-book IRC exam format, eligibility, and study tips to help you navigate the journey from candidate to certified B1 inspector.',
      },
      {
        title: 'ICC Exam Structure: B1, B2, E1, P1 & M1',
        href: '/blog/icc-exam-structure',
        description:
          'A side-by-side comparison of all five ICC certifications — question counts, time limits, passing scores, and reference codes. Choose the right certification for your goals.',
      },
      {
        title: 'IRC Study Guide: How to Navigate the International Residential Code',
        href: '/blog/irc-study-guide',
        description:
          'Master the chapter map, section numbering, and index-first lookup strategies that open-book ICC exams reward. The single most important skill for B1 success.',
      },
      {
        title: 'About Inspect Practice',
        href: '/about',
        description:
          'Learn about our mission to help every building inspector pass their ICC certification exams. Discover how our AI-powered platform combines code expertise with modern technology to transform exam preparation.',
      },
    ],
  },
  {
    id: 'study-tools',
    title: 'Study Tools & Reference',
    description:
      'Build your knowledge with structured study guides, interactive checklists, and comprehensive reference materials. These resources are designed to help you study efficiently and track your progress.',
    resources: [
      {
        title: 'ICC Exam Study Resources: Best Codes, Books & Tools',
        href: '/blog/icc-exam-study-resources',
        description:
          'The definitive list of ICC exam study resources — official codes (IRC, IBC, NEC, IPC, IMC), ICC training materials, field references, and AI-powered practice tools.',
      },
      {
        title: '30-Day ICC Exam Prep Checklist',
        href: '/study-checklist',
        description:
          'A free, printable 30-day study plan designed for focused exam preparation. Features daily tasks covering the code map, index-first lookups, chapter drills, and full-length timed simulations. Perfect for candidates with foundational knowledge who want a structured sprint to exam day.',
      },
      {
        title: 'How to Study for ICC Open-Book Exams: 10 Proven Techniques',
        href: '/blog/icc-study-techniques',
        description:
          'Ten proven techniques for open-book code exams — chapter mapping, active recall, timed lookups, and weak-chapter targeting. Techniques that actually move your score.',
      },
      {
        title: 'Frequently Asked Questions',
        href: '/faq',
        description:
          'Answers to common questions about ICC certification, open-book exam strategy, Inspect Practice features, pricing, and how our AI-powered adaptive learning platform works.',
      },
    ],
  },
  {
    id: 'specific-certifications',
    title: 'For Specific Certifications',
    description:
      'Deep-dive resources tailored to each ICC certification. Whether you are pursuing B1, B2, E1, P1, or M1, these guides break down the specific codes, exam formats, and study strategies for your chosen path.',
    resources: [
      {
        title: 'ICC B1 Certification Guide',
        href: '/blog/icc-b1-certification-guide',
        description:
          'The complete guide to the B1 Residential Building Inspector certification — IRC scope, exam format, code-navigation strategy, and a step-by-step path to passing.',
      },
      {
        title: 'IRC Study Guide: Code Navigation',
        href: '/blog/irc-study-guide',
        description:
          'A comprehensive guide to navigating the International Residential Code. Chapter-by-chapter map, section-numbering system, index strategies, and high-weight sections to know cold.',
      },
      {
        title: 'How AI Is Changing ICC Exam Preparation',
        href: '/blog/ai-icc-exam-preparation',
        description:
          'How AI-powered platforms are transforming ICC exam prep — adaptive question curation, code-referenced explanations, and AI tutoring for B1, B2, E1, P1 & M1.',
      },
      {
        title: 'Top 10 Mistakes ICC Exam Candidates Make',
        href: '/blog/icc-study-mistakes',
        description:
          'The most common mistakes ICC exam candidates make — from studying the wrong code edition to memorizing instead of navigating. Learn how to pass on your first try.',
      },
    ],
  },
  {
    id: 'exam-preparation',
    title: 'Exam Preparation & Practice',
    description:
      'Practice makes permanent. These resources help you drill exam-style open-book questions, build navigation speed, and simulate the real exam before test day.',
    resources: [
      {
        title: 'Free ICC Practice Questions',
        href: '/free-icc-practice-questions',
        description:
          '10 free open-book practice questions covering the IRC, IBC, NEC, IPC, and IMC — with the exact code reference for every answer. No signup needed.',
      },
      {
        title: '12-Week ICC Exam Study Plan',
        href: '/blog/icc-exam-study-plan',
        description:
          'A step-by-step 12-week schedule: code mapping, chapter drills, and timed simulations. The sweet spot between thorough preparation and staying focused.',
      },
      {
        title: 'ICC Exam Structure — All 5 Exams',
        href: '/blog/icc-exam-structure',
        description:
          'Question counts, time limits, and passing scores for B1, B2, E1, P1, and M1 — verify the details in the official ICC exam bulletin for your certification.',
      },
      {
        title: 'Pricing Plans',
        href: '/pricing',
        description:
          'Compare Inspect Practice plans and choose the one that fits your study needs. Start free and upgrade when you are ready to go all in.',
      },
    ],
  },
];

export default function IccResourcesPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'ICC Resources', url: 'https://inspectpractice.com/icc-resources' },
        ]}
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

        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">ICC Resources Hub</h1>
          <p className="text-lg text-[#586A73] max-w-2xl mx-auto">
            Everything you need to prepare for ICC building inspector certification
            exams — B1, B2, E1, P1 &amp; M1 — in one place.
          </p>
        </header>

        {/* Sections */}
        <div className="max-w-4xl mx-auto px-6 space-y-14 pb-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-2xl font-bold text-[#102631] mb-2">{section.title}</h2>
              <p className="text-sm text-[#586A73] mb-6">{section.description}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {section.resources.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    className="group p-6 rounded-xl border border-[#DCE4E7] bg-white hover:bg-white/[0.05] hover:border-[#176B87]/30 transition-all"
                  >
                    <h3 className="font-semibold text-[#102631] mb-2 group-hover:text-[#176B87] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-sm text-[#586A73] leading-relaxed">{r.description}</p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* About ICC Certifications */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="rounded-2xl border border-[#DCE4E7] bg-white p-8">
            <h2 className="text-2xl font-bold text-[#102631] mb-4">
              The ICC Certification System
            </h2>
            <div className="space-y-4 text-[#DCE4E7] leading-relaxed">
              <p>
                The International Code Council issues certification credentials for
                building inspectors across the United States. The five core
                certifications are B1 (Residential Building Inspector, based on the
                International Residential Code), B2 (Commercial Building Inspector,
                based on the International Building Code), E1 (Residential Electrical
                Inspector, based on the NEC plus IRC electrical chapters), P1
                (Residential Plumbing Inspector, based on the IPC plus IRC plumbing
                chapters), and M1 (Residential Mechanical Inspector, based on the IMC
                plus IRC mechanical chapters).
              </p>
              <p>
                Every ICC inspector exam is <strong>open book</strong>: you bring the
                current edition of the applicable code, and you are tested on your
                ability to find and apply its requirements. Success depends on code
                navigation — knowing which chapter covers which system, using the
                index efficiently, and reading sections including their exceptions —
                not on memorization.
              </p>
              <p>
                Inspect Practice is designed to complement your preparation by providing
                code-referenced practice questions, adaptive difficulty that adjusts to
                your knowledge level, and an AI Tutor that explains code requirements
                in plain language. Whether you are a new inspector, a home inspector
                adding credentials, or a municipal employee — or studying
                independently — our platform helps you target your weak areas and build
                exam confidence through deliberate practice.
              </p>
            </div>
          </div>
        </div>

        {/* Related Study Platforms */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <RelatedStudyPlatforms />
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="text-center bg-gradient-to-r from-[#176B87]/10 to-[#176B87]/10 rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-3">
              Ready to Start Studying?
            </h2>
            <p className="text-[#586A73] mb-6 max-w-xl mx-auto">
              Create your free account and start practising with AI-powered open-book
              questions tailored to the ICC certifications. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#176B87] hover:bg-[#176B87] rounded-lg text-sm font-medium transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[#DCE4E7] hover:border-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>

      <LearningResourceJsonLd
        name="ICC Resources Hub"
        description="Curated resources for ICC building inspector exam preparation — B1, B2, E1, P1 & M1 certification guides, IRC/IBC code navigation, and study tools."
        educationalLevel="Professional"
        teaches={['ICC B1/B2/E1/P1/M1 Exam Prep', 'IRC/IBC Code Navigation', 'Open-Book Exam Strategy', 'ICC Certification Guides']}
        resourceType="Collection"
      />
    </>
  );
}
