import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import theoryData from '@/src/data/theory-data.json';
import { TheoryContent } from '@/lib/theory-markdown';

type TheoryChapter = {
  number: number;
  name: string;
  id: string;
  content: string;
};

const chapters = theoryData as TheoryChapter[];
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV'];

function excerpt(content: string): string {
  const plain = content
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/[#*`>|_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 155 ? `${plain.slice(0, 152).trimEnd()}...` : plain;
}

export function generateStaticParams() {
  return chapters.map((ch) => ({ id: ch.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const chapter = chapters.find((ch) => ch.id === id);
  if (!chapter) return {};
  const title = `${chapter.name} — ICC Study Guide | InspectPractice`;
  const description = excerpt(chapter.content);
  return {
    title,
    description,
    alternates: {
      canonical: `https://inspectpractice.com/theory/${chapter.id}`,
      languages: { en: `https://inspectpractice.com/theory/${chapter.id}` },
    },
    openGraph: {
      title,
      description,
      url: `https://inspectpractice.com/theory/${chapter.id}`,
      type: 'article',
      locale: 'en',
      siteName: 'InspectPractice',
    },
  };
}

export default async function TheoryChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = chapters.find((ch) => ch.id === id);
  if (!chapter) notFound();

  const prev = chapters.find((ch) => ch.number === chapter.number - 1);
  const next = chapters.find((ch) => ch.number === chapter.number + 1);

  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
      <header className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="InspectPractice home">
            <img src="/logo/logo-main-light.png?v=4" alt="InspectPractice" className="h-7 w-auto" />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/theory" className="text-[#DCE4E7] hover:text-[#F4F7F8] transition-colors">All Chapters</Link>
            <Link href="/exams" className="text-[#DCE4E7] hover:text-[#F4F7F8] transition-colors">Practice Exams</Link>
            <Link href="/pricing" className="px-4 py-2 rounded-lg bg-[#176B87] text-[#071D2B] font-medium transition-colors">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-xs text-[#586A73] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#F4F7F8] flex items-center gap-1"><Home size={13} /> Home</Link>
          <ChevronRight size={14} />
          <Link href="/theory" className="hover:text-[#F4F7F8]">Theory</Link>
          <ChevronRight size={14} />
          <span className="text-[#DCE4E7]">Chapter {chapter.number}</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#176B87]/10 border border-[#176B87]/20 flex items-center justify-center shrink-0">
            <BookOpen size={22} className="text-[#176B87]" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#176B87] uppercase tracking-wide mb-1">Chapter {ROMAN[chapter.number - 1] || chapter.number}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F4F7F8] leading-tight">{chapter.name}</h1>
            <p className="text-sm text-[#586A73] mt-2 max-w-2xl">InspectPractice study guide with diagrams.</p>
          </div>
        </div>

        <div className="bg-[#12294D] border border-[#DCE4E7] rounded-2xl p-6 md:p-8">
          <TheoryContent content={chapter.content} color="blue" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/theory/${prev.id}`} className="group flex items-center gap-2 text-sm text-[#586A73] hover:text-[#F4F7F8] border border-[#DCE4E7] rounded-xl p-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="truncate"><span className="block text-xs opacity-60">Chapter {prev.number}</span>{prev.name}</span>
            </Link>
          ) : (<span />)}
          {next ? (
            <Link href={`/theory/${next.id}`} className="group flex items-center justify-end gap-2 text-sm text-[#586A73] hover:text-[#F4F7F8] border border-[#DCE4E7] rounded-xl p-4 text-right">
              <span className="truncate"><span className="block text-xs opacity-60">Chapter {next.number}</span>{next.name}</span>
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : null}
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#176B87]/10 to-[#176B87]/5 border border-[#176B87]/20 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold text-[#F4F7F8] mb-2">Ready to test this chapter?</h2>
          <p className="text-sm text-[#586A73] mb-4">Practice with exam-aligned questions and timed simulations.</p>
          <Link href="/exams" className="inline-block px-6 py-3 rounded-lg bg-[#176B87] text-white text-sm font-medium transition-colors">Start Practicing Free</Link>
        </div>
      </main>
    </div>
  );
}
