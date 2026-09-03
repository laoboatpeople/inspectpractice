import Link from 'next/link';
import type { Metadata } from 'next';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import NewsletterSection from '@/components/marketing/NewsletterSection';
import BlogFilter from './BlogFilter';

export const metadata: Metadata = {
  title: 'ICC Exam Guide Blog — Inspect Practice',
  description:
    'Expert guides for ICC building inspector exam prep. B1, B2, E1, P1 & M1 certification guides, IRC/IBC code navigation, open-book study techniques, and exam structure breakdowns.',
  alternates: {
    canonical: 'https://inspectpractice.com/blog',
    languages: {
      en: 'https://inspectpractice.com/blog',
    },
  },
  openGraph: {
    title: 'ICC Exam Guide Blog — Inspect Practice',
    description:
      'Expert guides and resources for ICC building inspector exam prep. B1, B2, E1, P1 & M1 certifications, code navigation, and study techniques.',
    url: 'https://inspectpractice.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICC Exam Guide Blog — Inspect Practice',
  },
  other: {
    'article:published_time': '2025-03-01',
    'article:modified_time': '2026-08-18',
  },
};

const posts = [
  {
    slug: 'icc-b1-certification-guide',
    title: 'How to Get Your ICC B1 Residential Building Inspector Certification',
    description:
      'A complete step-by-step guide to earning your ICC B1 Residential Building Inspector certification, including eligibility, the open-book IRC exam format, and study strategy.',
    date: 'March 15, 2025 *updated August 18, 2026',
    readTime: '10 min read',
    category: 'Certification',
  },
  {
    slug: 'irc-study-guide',
    title: 'IRC Study Guide: How to Navigate the International Residential Code',
    description:
      'Master the International Residential Code for your ICC B1 exam. Chapter-by-chapter map, section-numbering system, index strategies, and open-book lookup drills.',
    date: 'April 2, 2025 *updated August 18, 2026',
    readTime: '8 min read',
    category: 'Code Navigation',
  },
  {
    slug: 'ai-icc-exam-preparation',
    title: 'How AI Is Changing ICC Exam Preparation',
    description:
      'Discover how artificial intelligence is transforming ICC exam preparation. Adaptive learning, personalized study paths, instant code-referenced explanations, and AI tutoring.',
    date: 'May 16, 2026 *updated August 18, 2026',
    readTime: '9 min read',
    category: 'Technology',
  },
  {
    slug: 'icc-exam-structure',
    title: 'ICC Exam Structure: B1, B2, E1, P1 & M1 — Questions, Time & Passing Scores',
    description:
      'Complete comparison of all 5 ICC certification exams with a detailed table showing question counts, time limits, passing scores, and reference codes.',
    date: 'May 20, 2026 *updated August 18, 2026',
    readTime: '14 min read',
    category: 'Exams',
  },
  {
    slug: 'icc-exam-study-resources',
    title: 'ICC Exam Study Resources: Best Codes, Books & Tools',
    description:
      'The definitive list of ICC exam study resources: official codes (IRC, IBC, NEC, IPC, IMC), ICC training materials, practice tests, and AI-powered study tools.',
    date: 'May 22, 2026 *updated August 18, 2026',
    readTime: '10 min read',
    category: 'Reference',
  },
  {
    slug: 'icc-exam-study-plan',
    title: '12-Week ICC Exam Study Plan: A Step-by-Step Schedule',
    description:
      'A proven 12-week study plan for ICC certification exams. Week-by-week schedule covering code navigation, practice questions, and timed simulations.',
    date: 'May 22, 2026 *updated August 18, 2026',
    readTime: '11 min read',
    category: 'Study Plan',
  },
  {
    slug: 'icc-study-mistakes',
    title: 'Top 10 Mistakes ICC Exam Candidates Make (And How to Avoid Them)',
    description:
      'The most common mistakes ICC exam candidates make — from ignoring the exam bulletin to memorizing instead of navigating. Learn how to pass on your first try.',
    date: 'May 22, 2026 *updated August 18, 2026',
    readTime: '9 min read',
    category: 'Exam Strategy',
  },
  {
    slug: 'icc-study-techniques',
    title: 'How to Study for ICC Open-Book Exams: 10 Proven Techniques',
    description:
      'Discover 10 proven study techniques for ICC open-book exams. From code navigation drills and index-first lookups to timed simulations — techniques that actually work.',
    date: 'May 23, 2026 *updated August 18, 2026',
    readTime: '12 min read',
    category: 'Study Skills',
  },
  {
    slug: 'nhie-home-inspector-exam',
    title: 'NHIE Home Inspector Exam: The Complete Guide for 2026',
    description:
      'Everything home inspectors need to know about the EBPHI National Home Inspector Examination: exam structure, the 70/20/10 domain split, scoring, state requirements, and how to prepare.',
    date: 'September 3, 2026',
    readTime: '8 min read',
    category: 'Home Inspection',
  },
];

const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Blog', url: 'https://inspectpractice.com/blog' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
      {/* Nav */}
      <nav className="border-b border-[#DCE4E7] bg-[#0B3344]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main-light.png?v=5" alt="Inspect Practice" className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← Back to Home</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-4">ICC Exam Guide</h1>
        <p className="text-lg text-[#586A73] max-w-2xl">
          Expert resources to help you prepare for ICC building inspector exams.
          Each guide covers the B1, B2, E1, P1 &amp; M1 certifications and the open-book
          code navigation skills the exams reward.
        </p>
      </div>

      <BlogFilter posts={posts} categories={categories} basePath="/blog" />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <div className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <a
            href="/faq"
            className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors"
          >
            Visit our FAQ →
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
