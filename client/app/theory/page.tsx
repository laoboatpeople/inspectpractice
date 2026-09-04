import type { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { BookOpen, ChevronRight, Home, ArrowRight } from 'lucide-react';
import theoryData from '@/src/data/theory-data.json';
import {
  BreadcrumbListJsonLd,
  LearningResourceJsonLd,
} from '@/components/seo/JsonLd';

type TheoryChapter = {
  number: number;
  name: string;
  id: string;
  content: string;
  code?: string;
};

const chapters = theoryData as TheoryChapter[];

// Exam code -> human label used to group the hub (matches the app's license sections)
const CODE_GROUPS: { code: string; title: string; subtitle: string }[] = [
  { code: 'ICC-B1', title: 'B1 — Residential Building Inspector', subtitle: 'ICC Residential Building Inspector (IRC): code administration, building planning, foundations, floors, walls, roofs.' },
  { code: 'ICC-B2', title: 'B2 — Commercial Building Inspector', subtitle: 'ICC Commercial Building Inspector (IBC): occupancy, construction types, fire protection, egress.' },
  { code: 'ICC-E1', title: 'E1 — Residential Electrical Inspector', subtitle: 'ICC Residential Electrical Inspector (NEC): wiring, services, grounding, overcurrent protection.' },
  { code: 'ICC-P1', title: 'P1 — Residential Plumbing', subtitle: 'ICC Residential Plumbing Inspector (IPC): fixtures, water supply, drainage, vents, traps.' },
  { code: 'ICC-M1', title: 'M1 — Residential Mechanical', subtitle: 'ICC Residential Mechanical Inspector (IMC): ventilation, ducts, combustion air, appliances.' },
  { code: 'NHIE', title: 'NHIE — National Home Inspector Exam', subtitle: 'NHIE (EBPHI): site conditions, exterior and interior systems, structure, electrical, plumbing, HVAC.' },
];

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV'];

// Freshness dates derived from the actual content file (stable at build time).
const THEORY_DATA_MTIME = new Date(
  fs.statSync(path.join(process.cwd(), 'src/data/theory-data.json')).mtimeMs
).toISOString().slice(0, 10);

function excerpt(content: string, max = 140): string {
  const plain = content
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/[#*`>|_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? `${plain.slice(0, max - 3).trimEnd()}...` : plain;
}

export const metadata: Metadata = {
  title: 'Home Inspection Theory — ICC & NHIE Study Guides | InspectPractice',
  description:
    'Free ICC and NHIE theory study guides for home inspection exams — 54 chapters across building (B1, B2), electrical (E1), plumbing (P1), mechanical (M1) and the National Home Inspector Exam (NHIE).',
  alternates: {
    canonical: 'https://inspectpractice.com/theory',
    languages: {
      en: 'https://inspectpractice.com/theory',
    },
  },
  openGraph: {
    title: 'Home Inspection Theory — ICC & NHIE Study Guides | InspectPractice',
    description:
      '54 free study guides across ICC B1/B2/E1/P1/M1 and the NHIE National Home Inspector Exam.',
    url: 'https://inspectpractice.com/theory',
    type: 'website',
    locale: 'en',
    siteName: 'InspectPractice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/theory.jpg',
        width: 1200,
        height: 630,
        alt: 'InspectPractice — Home Inspection Theory Study Guides',
      },
    ],
  },
  twitter: {
    title: 'Home Inspection Theory — ICC & NHIE Study Guides | InspectPractice',
  },
  other: {
    'article:published_time': THEORY_DATA_MTIME,
    'article:modified_time': THEORY_DATA_MTIME,
  },
};

export default function TheoryIndexPage() {
  return (
    <>
      <LearningResourceJsonLd
        name="Home Inspection Exam Theory — ICC & NHIE Complete Study Guides"
        description="Free complete theory study guides for home inspection certification exams: ICC Residential and Commercial Building Inspector (B1/B2), Residential Electrical (E1), Plumbing (P1), Mechanical (M1) and the NHIE National Home Inspector Exam."
        educationalLevel="Professional"
        teaches={[
          'NHIE Exam',
          'ICC Exam',
          'Building Inspection',
          'Electrical Inspection',
          'Plumbing Inspection',
          'Mechanical Inspection',
          'Home Inspection',
        ]}
        resourceType="StudyGuide"
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Theory', url: 'https://inspectpractice.com/theory' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        <header className="border-b border-[#DCE4E7] bg-[#0B3344]/95 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="InspectPractice home">
              <img src="/logo/logo-main-light.png?v=5" alt="InspectPractice" className="h-7 w-auto" />
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/theory" className="text-[#F4F7F8] font-medium transition-colors">All Chapters</Link>
              <Link href="/exams" className="text-[#DCE4E7] hover:text-[#F4F7F8] transition-colors">Practice Exams</Link>
              <Link href="/pricing" className="px-4 py-2 rounded-lg bg-[#CBEA32] text-[#0B3344] font-medium transition-colors">Pricing</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <nav className="flex items-center gap-2 text-xs text-[#586A73] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#145A73] flex items-center gap-1"><Home size={13} /> Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#145A73] font-medium">Theory</span>
          </nav>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#145A73]/10 border border-[#145A73]/20 flex items-center justify-center shrink-0">
              <BookOpen size={22} className="text-[#145A73]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#145A73] uppercase tracking-wide mb-1">ICC & NHIE</div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#102631] leading-tight">Complete Theory — All 54 Chapters</h1>
            </div>
          </div>
          <p className="text-sm text-[#586A73] max-w-2xl mb-10">
            Free, in-depth study guides mapped to the ICC certification exams and the NHIE National Home Inspector
            Exam. Each exam has its own chapter set — pick your exam below and work through every chapter, then test
            yourself with exam-aligned questions.
          </p>

          {CODE_GROUPS.map((group) => {
            const groupChapters = chapters
              .filter((c) => (group.code === 'NHIE' ? (c.code || '').startsWith('NHIE') : (c.code || '').startsWith(group.code)))
              .sort((a, b) => a.number - b.number);
            if (groupChapters.length === 0) return null;
            return (
              <section key={group.code} className="mb-10">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#102631]">{group.title}</h2>
                  <p className="text-xs text-[#586A73] mt-1">{group.subtitle}</p>
                </div>
                <div className="space-y-2">
                  {groupChapters.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/theory/${ch.id}`}
                      className="group flex items-center gap-4 bg-white border border-[#DCE4E7] rounded-2xl p-4 transition-colors hover:border-[#145A73]/40"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#145A73]/10 border border-[#145A73]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#145A73]">{ROMAN[ch.number - 1] || ch.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#102631] group-hover:text-[#145A73] transition-colors leading-snug">{ch.name}</h3>
                        <p className="text-xs text-[#586A73] mt-1 line-clamp-1 hidden md:block">{excerpt(ch.content)}</p>
                      </div>
                      <ArrowRight size={16} className="text-[#586A73] group-hover:text-[#145A73] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="mt-10 bg-gradient-to-r from-[#145A73]/10 to-[#0B3344]/5 border border-[#145A73]/20 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-[#102631] mb-2">Ready to test what you learned?</h2>
            <p className="text-sm text-[#586A73] mb-4">Practice with exam-aligned questions and timed simulations.</p>
            <Link href="/exams" className="inline-block px-6 py-3 rounded-lg bg-[#145A73] text-white text-sm font-medium transition-colors">
              Start Practicing Free
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
