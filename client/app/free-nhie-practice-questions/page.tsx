import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

type SampleQuestion = {
  ch: number;
  q: string;
  options: string[];
  answer: string;
  explanation: string;
};

const QUESTIONS: SampleQuestion[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'app/free-nhie-practice-questions/questions.json'), 'utf-8')
);

export const metadata: Metadata = {
  title: 'Free NHIE Practice Questions — National Home Inspector Exam — Inspect Practice',
  description:
    'Try real NHIE-style questions covering site conditions, electrical systems, life-safety equipment and professional responsibilities. No signup needed — from the Inspect Practice NHIE bank of 1,200 questions.',
  alternates: {
    canonical: 'https://inspectpractice.com/free-nhie-practice-questions',
  },
  openGraph: {
    title: 'Free NHIE Practice Questions — Inspect Practice',
    description:
      'Sample NHIE home inspector exam questions with answers and explanations. Full 15-chapter bank available with Inspect Practice.',
    url: 'https://inspectpractice.com/free-nhie-practice-questions',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/free-nhie-practice-questions.jpg',
        width: 1200,
        height: 630,
        alt: 'Free NHIE Practice Questions — Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free NHIE Practice Questions — Inspect Practice',
  },
};

export default function FreeNhiePracticeQuestionsPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Free NHIE Practice Questions — National Home Inspector Exam"
        description="Real NHIE-style questions covering site conditions, electrical systems, life-safety equipment and professional responsibilities."
        datePublished="2026-09-03"
        dateModified="2026-09-03"
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Free NHIE Practice Questions', url: 'https://inspectpractice.com/free-nhie-practice-questions' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <div className="flex items-center gap-4">
              <a href="/faq" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">← FAQ</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-2 py-1 rounded">Free Questions</span>
              <span className="text-xs text-[#7A8B94]">September 3, 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Free NHIE Practice Questions</h1>
            <p className="text-lg text-[#586A73]">
              Six real questions from the Inspect Practice NHIE bank — site conditions, electrical systems,
              life-safety equipment and professional responsibilities. Click each question to reveal the
              answer and explanation. The full NHIE curriculum covers 15 chapters with 1,200 questions.
            </p>
          </header>

          <div className="space-y-5">
            {QUESTIONS.map((item, i) => (
              <details key={i} className="group bg-white border border-[#DCE4E7] rounded-xl overflow-hidden">
                <summary className="cursor-pointer list-none p-5 flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-[#176B87] text-white text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[#102631] font-medium leading-relaxed">{item.q}</span>
                </summary>
                <div className="px-5 pb-5 border-t border-[#DCE4E7] bg-[#F4F7F8]">
                  <ul className="pt-4 space-y-2">
                    {item.options.map((opt, oi) => (
                      <li key={oi} className="flex items-start gap-2 text-sm text-[#102631]">
                        <span className="font-mono font-semibold text-[#176B87]">{String.fromCharCode(65 + oi)}.</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold text-[#176B87]">Correct answer: {item.answer}</span>
                    <span className="text-[#586A73]"> — {item.explanation}</span>
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-[#071D2B] p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready for the full NHIE curriculum?</h2>
            <p className="text-[#A9B8C0] mb-6 text-sm">
              All 15 chapters, 1,200 questions, theory with animated diagrams, simulations and the AI tutor.
              The first chapter of every exam is free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/auth/login" className="px-6 py-3 bg-[#CBEA32] hover:bg-[#B5D51F] text-[#071D2B] rounded-xl font-semibold transition-colors">
                Start Free
              </a>
              <a href="/nhie-certification-guide" className="px-6 py-3 text-white border border-white/40 hover:bg-white/10 rounded-xl font-semibold transition-colors">
                Read the NHIE Guide
              </a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
