import { ArticleJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import FreePracticeQuestionsClient from './FreePracticeQuestionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free ICC Practice Questions — Open-Book Code Questions — Inspect Practice',
  description:
    '10 free ICC-style open-book practice questions covering the IRC, IBC, NEC, IPC, and IMC with exact code references. Start practicing today — no signup needed.',
  alternates: {
    canonical: 'https://inspectpractice.com/free-icc-practice-questions',
    languages: {
      en: 'https://inspectpractice.com/free-icc-practice-questions',
    },
  },
  openGraph: {
    title: 'Free ICC Practice Questions — Open-Book Code Questions — Inspect Practice',
    description:
      '10 free ICC-style practice questions covering the IRC, IBC, NEC, IPC, and IMC. Test your code-navigation skills with realistic open-book questions.',
    url: 'https://inspectpractice.com/free-icc-practice-questions',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/free-ame-practice-questions.jpg',
        width: 1200,
        height: 630,
        alt: 'Free ICC Practice Questions - Inspect Practice',
      },
    ],
  },
  twitter: {
    title: 'Free ICC Practice Questions — Open-Book Code Questions — Inspect Practice',
  },
  other: {
    'article:published_time': '2026-05-20',
    'article:modified_time': '2026-08-18',
  },
};

export default function FreeIccPracticeQuestionsPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Free ICC Practice Questions — Open-Book Code Questions"
        description="10 free ICC-style open-book practice questions covering the IRC, IBC, NEC, IPC, and IMC with exact code references."
        datePublished="2026-05-20"
        dateModified="2026-08-18"
        image={['https://inspectpractice.com/images/free-ame-practice-questions.jpg']}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Free ICC Practice Questions', url: 'https://inspectpractice.com/free-icc-practice-questions' },
        ]}
      />
      <FreePracticeQuestionsClient />
    </>
  );
}
