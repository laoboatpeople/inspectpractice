import { ArticleJsonLd, BreadcrumbListJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import StudyChecklistClient from './StudyChecklistClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '30-Day ICC Exam Prep Checklist: Printable Study Plan — Inspect Practice',
  description:
    'Free 30-day printable ICC exam prep checklist for B1, B2, E1, P1 & M1. Daily tasks covering IRC/IBC code navigation, practice questions, and full simulations.',
  alternates: {
    canonical: 'https://inspectpractice.com/study-checklist',
    languages: {
      en: 'https://inspectpractice.com/study-checklist',
    },
  },
  openGraph: {
    title: '30-Day ICC Exam Prep Checklist: Printable Study Plan — Inspect Practice',
    description:
      'Free 30-day printable ICC exam prep checklist. Daily study covering IRC/IBC code navigation, practice questions, and timed simulations.',
    url: 'https://inspectpractice.com/study-checklist',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/study-checklist-og.jpg',
        width: 1200,
        height: 630,
        alt: '30-Day ICC Exam Prep Checklist',
      },
    ],
  },
  twitter: {
    title: '30-Day ICC Exam Prep Checklist: Printable Study Plan — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-20',
    'article:modified_time': '2026-08-18',
  },
};

const faqs = [
  {
    question: 'Is the 30-day ICC exam prep checklist really enough to pass?',
    answer:
      'The 30-day checklist is designed for focused, intensive preparation. It works best for candidates who already have foundational knowledge of construction and inspection. If you are starting from zero, consider combining this plan with an 8-12 week study timeline using the Inspect Practice adaptive platform to build baseline knowledge before the 30-day sprint.',
  },
  {
    question: 'Which ICC certification does this checklist cover?',
    answer:
      'This checklist covers the core code-navigation skills shared by all five certifications — B1 (IRC), B2 (IBC), E1 (NEC + IRC electrical), P1 (IPC + IRC plumbing), and M1 (IMC + IRC mechanical). The chapter lists follow the IRC/IBC structure; trade candidates should substitute their trade chapters (NEC, IPC, IMC) during the chapter drill weeks.',
  },
  {
    question: 'How many hours per day should I study?',
    answer:
      'Most candidates should plan for 2–4 hours of focused study per day. Some days in Weeks 1 and 2 may require 3–4 hours for code reading, while Weeks 3 and 4 focus more on active practice (quizzes and simulations). Consistency matters more than cramming — study every day, even if only for 90 minutes.',
  },
  {
    question: 'Can I print the checklist?',
    answer:
      'Yes! The print view uses a clean white background with black text for easy reading and checkmark tracking. You can also download the free PDF by entering your email in the signup form at the top or bottom of this page.',
  },
  {
    question: 'What if I miss a day?',
    answer:
      "Don't panic. The 30-day plan is a guide, not a rigid requirement. If you fall behind, combine lighter days or extend the plan by a few days. The key is to maintain momentum — completing Weeks 3 and 4 (practice mode and exam simulations) is critical for exam readiness. Use the Inspect Practice AI Tutor to catch up on missed topics quickly.",
  },
  {
    question: 'Does this checklist include the IRC chapter map?',
    answer:
      'Absolutely. The plan is built around code navigation: Week 1 maps the chapters (foundations in Ch. 4, walls in Ch. 6, roofing in Ch. 9, etc.), Week 2 drills index-first lookups, and Weeks 3–4 alternate chapter drills with full-length timed simulations. For a complete breakdown of the IRC structure, read our IRC study guide.',
  },
];

export default function StudyChecklistPage() {
  return (
    <>
      <ArticleJsonLd
        headline="30-Day ICC Exam Prep Checklist: Printable Study Plan"
        description="Free 30-day printable ICC exam prep checklist covering code navigation, chapter drills, and timed simulations for B1, B2, E1, P1 & M1."
        datePublished="2026-05-20"
        dateModified="2026-08-18"
        image={['https://inspectpractice.com/images/study-checklist-og.jpg']}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: '30-Day ICC Exam Prep Checklist', url: 'https://inspectpractice.com/study-checklist' },
        ]}
      />
      <FAQPageJsonLd questions={faqs} />
      <StudyChecklistClient faqs={faqs} />
    </>
  );
}
