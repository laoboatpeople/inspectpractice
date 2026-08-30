import type { Metadata } from 'next';
import MarketingLandingPage from "@/components/marketing/LandingPage";
import { VideoObjectJsonLd, BreadcrumbListJsonLd, FAQPageJsonLd, LearningResourceJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Inspect Practice — Pass Your ICC Building Inspector Exam',
  description:    'AI-curated ICC exam prep for building inspector certifications — B1, B2, E1, P1 & M1. Open-book code navigation drills matched to your weak areas from 2,500+ practice questions.',
  alternates: {
    canonical: 'https://inspectpractice.com',
    languages: {
      en: 'https://inspectpractice.com',
    },
  },
  openGraph: {
    title: 'Inspect Practice — Pass Your ICC Building Inspector Exam',
    description:
      'AI-curated ICC exam prep platform covering B1, B2, E1, P1 & M1. Open-book code navigation questions matched to your weak areas for smarter studying.',
    url: 'https://inspectpractice.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Inspect Practice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice ICC Exam Preparation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inspect Practice — Pass Your ICC Building Inspector Exam',
    description:
      'AI-curated ICC exam prep platform covering B1, B2, E1, P1 & M1. Questions matched to your weak areas for smarter studying.',
    images: ['https://inspectpractice.com/images/og/home.jpg'],
  },
};

export default function RootPage() {
  return (
    <>
      <VideoObjectJsonLd
        name="Inspect Practice — Dan's ICC B1 Story Demo"
        description="Dan, a residential building inspector, prepares for the ICC B1 exam with Inspect Practice — practice questions, simulated exams, and the AI tutor. See his journey from failure to certified."
        thumbnailUrl="https://inspectpractice.com/images/og/home.jpg"
        contentUrl="https://inspectpractice.com/videos/inspectpractice-demo-en.mp4"
        embedUrl="https://inspectpractice.com/"
        uploadDate="2026-08-30T00:00:00Z"
        duration="PT1M8S"
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
        ]}
      />
      <FAQPageJsonLd
        questions={[
          {
            question: 'How do I get an ICC building inspector certification?',
            answer: 'To get an ICC certification, choose your certification (B1 — Residential/IRC, B2 — Commercial/IBC, E1 — Electrical/NEC, P1 — Plumbing/IPC, M1 — Mechanical/IMC), get the current edition of the applicable code, master code navigation, and register for the exam through the International Code Council. Inspect Practice provides AI-powered practice questions covering all five certifications to help you prepare efficiently.',
          },
          {
            question: 'What is the difference between ICC B1, B2, E1, P1, and M1 certifications?',
            answer: 'B1 (Residential Building Inspector) covers one- and two-family dwellings under the International Residential Code (IRC). B2 (Commercial Building Inspector) covers commercial buildings under the International Building Code (IBC). E1 covers residential electrical (NEC + IRC electrical chapters), P1 covers residential plumbing (IPC + IRC plumbing chapters), and M1 covers residential mechanical (IMC + IRC mechanical chapters). Each has its own open-book exam administered by the ICC.',
          },
          {
            question: 'Are ICC exams open book?',
            answer: 'Yes. All ICC inspector certification exams are open book, multiple-choice exams. You bring the current edition of the applicable code and are tested on your ability to find and apply its requirements. Success depends on code navigation — knowing which chapter covers which system, using the index efficiently, and reading sections including their exceptions.',
          },
          {
            question: 'How long does it take to get an ICC certification?',
            answer: 'Most candidates earn their first ICC certification (typically B1) in 4-8 weeks of focused preparation. You do not need a degree, and you can register for the exam directly through the International Code Council. Each additional certification builds on the same code-navigation skills.',
          },
          {
            question: 'What is the passing score for ICC exams?',
            answer: 'Most ICC inspector certification exams require a passing score of 75%. For example, the B1 exam has 60 questions with a 2-hour time limit, and you need 45 correct answers to pass. Always verify the exact numbers in the official ICC exam bulletin for your certification and code edition.',
          },
          {
            question: 'How much do building inspectors earn?',
            answer: 'Certified building inspectors in the United States earn salaries that vary by state, employer, and experience, with median earnings typically in the $50,000–$80,000+ range. Municipal, county, and private inspection roles all value ICC certifications, and adding certifications (B1 → B2, E1, P1, M1) unlocks higher-level positions.',
          },
          {
            question: 'Can I study for the ICC exam online?',
            answer: 'Yes! Inspect Practice is fully optimized for mobile and desktop browsers. You can practice with ICC-style open-book questions that cite the exact code section, take timed simulations, and use AI-powered adaptive learning that focuses on your weak areas.',
          },
          {
            question: 'What are the pass rates for ICC exams?',
            answer: 'ICC exam pass rates vary by certification and code edition. Using structured practice with platforms like Inspect Practice significantly improves your chances by building code-navigation speed and identifying knowledge gaps before exam day.',
          },
        ]}
      />
      <HowToJsonLd
        name="How to Get Your ICC Building Inspector Certification"
        description="Step-by-step guide to becoming ICC-certified as a building inspector in the United States."
        totalTime="P2M"
        steps={[
          { name: 'Choose Your Certification', text: 'Select your path: B1 (Residential, IRC), B2 (Commercial, IBC), E1 (Electrical, NEC), P1 (Plumbing, IPC), or M1 (Mechanical, IMC). Most inspectors start with B1.' },
          { name: 'Get the Code', text: 'Purchase the current edition of the applicable code (e.g., the 2024 IRC for B1) specified in the official ICC exam bulletin.' },
          { name: 'Learn Code Navigation', text: 'Because the exam is open book, master the chapter map, section numbering, and index-first lookup strategies before drilling questions.' },
          { name: 'Practice with Exam-Style Questions', text: 'Drill practice questions with the code open, review every explanation and its code reference, and take full-length timed simulations.' },
          { name: 'Register for the Exam', text: 'Register through the ICC and take the exam at a computer-based testing center or via ICC remote proctoring.' },
          { name: 'Pass and Add Certifications', text: 'Pass with 75% or better, then expand your credential set — B1 candidates often go on to B2, E1, P1, and M1.' },
        ]}
      />
      <LearningResourceJsonLd
        name="ICC Building Inspector Certification Guide"
        description="Complete guide to becoming an ICC-certified building inspector in the United States. Covers B1, B2, E1, P1, and M1 certifications, the International Codes, and career outlook."
        educationalLevel="Professional"
        teaches={['ICC B1 Certification', 'ICC B2 Certification', 'ICC E1 Certification', 'ICC P1 Certification', 'ICC M1 Certification', 'International Codes']}
        resourceType="Guide"
      />
      <MarketingLandingPage />
    </>
  );
}
