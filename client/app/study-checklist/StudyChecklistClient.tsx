'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

const weeks = [
  {
    week: 1,
    title: 'Assessment & Code Map',
    subtitle: 'Review the exam bulletin, take a diagnostic quiz, and learn the IRC chapter map.',
    days: [
      {
        day: 1,
        title: 'Download & Review the ICC Exam Bulletin',
        tasks: [
          "Download the official ICC exam bulletin from the ICC website for your certification (B1, B2, E1, P1, or M1).",
          'Read the content areas, question count, time limit, and passing score (usually 75%).',
          'Note the code edition your exam is based on (e.g., 2024 IRC for B1).',
        ],
      },
      {
        day: 2,
        title: 'Take a Full Diagnostic Quiz',
        tasks: [
          'Log in to Inspect Practice and take one full diagnostic quiz spanning all chapters.',
          'Record your scores per chapter to identify weak areas.',
          'Review every wrong answer and read the provided code references.',
        ],
      },
      {
        day: 3,
        title: 'Organize Your Study Materials',
        tasks: [
          'Gather your references: the current edition of your code (IRC, IBC, NEC, IPC, or IMC).',
          'Tab every chapter and add a few tabs for high-weight sections.',
          'Set up a study tracker — print or save this checklist to mark progress.',
        ],
      },
      {
        day: 4,
        title: 'IRC Chapter Map — Part 1',
        tasks: [
          'Skim IRC Chapters 1–4: Scope & Administration, Definitions, Building Planning, Foundations.',
          'Write one line per chapter about what it covers.',
          'Read the definitions chapter carefully — many exam questions hinge on defined terms.',
        ],
      },
      {
        day: 5,
        title: 'IRC Chapter Map — Part 2',
        tasks: [
          'Skim IRC Chapters 5–8: Floors, Wall Construction, Wall Covering, Roof-Ceiling Construction.',
          'Note the section-numbering pattern (R + chapter + section, e.g., R602).',
          'Take a 15-question building-planning quiz on Inspect Practice.',
        ],
      },
      {
        day: 6,
        title: 'IRC Chapter Map — Part 3',
        tasks: [
          'Skim IRC Chapters 9–11: Roof Assemblies, Chimneys & Fireplaces, Energy Efficiency.',
          'Practice index-first lookups: find 10 random subjects in the index, then flip to the section.',
          'Take a mixed 25-question quiz covering the chapters you mapped this week.',
        ],
      },
      {
        day: 7,
        title: 'Week 1 Review & Weak Area Deep Dive',
        tasks: [
          'Revisit your diagnostic scores from Day 2 — which chapters need the most work?',
          'Spend 2 hours on your weakest chapter from this week.',
          'Take a 30-question progress quiz and aim for 75%+.',
        ],
      },
    ],
  },
  {
    week: 2,
    title: 'Deep Study: High-Weight Chapters',
    subtitle: 'Focus on foundations, walls, roofing, and fire-safety sections — the heaviest exam territory.',
    days: [
      {
        day: 8,
        title: 'Foundations (IRC Ch. 4)',
        tasks: [
          'Read R401–R408: footings, foundation walls, frost protection, dampproofing, waterproofing.',
          'Know R403.1.4 (frost line depth) and R403.3 (frost-protected shallow foundations).',
          'Complete 20 foundation practice questions with the code open.',
        ],
      },
      {
        day: 9,
        title: 'Building Planning & Fire Safety (IRC Ch. 3)',
        tasks: [
          'Study R302 (fire-resistant construction), R310 (emergency escape), R311 (egress & stairs), R312 (guards).',
          'Learn the prohibition on openings in walls separating dwelling units (R302.2).',
          'Take a 15-question quiz focused on fire safety and egress.',
        ],
      },
      {
        day: 10,
        title: 'Wall Construction (IRC Ch. 6)',
        tasks: [
          'Review R601–R611: stud walls, headers, bracing, wall sheathing.',
          'Practice interpreting bracing requirements and header spans.',
          'Complete 20 wall-construction practice questions.',
        ],
      },
      {
        day: 11,
        title: 'Roof Assemblies (IRC Ch. 9)',
        tasks: [
          'Study R901–R908: roof covering materials, minimum slopes, underlayment.',
          'Know R905.2.2 (asphalt shingle minimum slope 2:12).',
          'Take a mixed 20-question quiz on roofing and ceiling construction.',
        ],
      },
      {
        day: 12,
        title: 'Floors & Wall Covering (IRC Ch. 5 & 7)',
        tasks: [
          'Review floor framing (R501–R509) and wall covering/veneers (R701–R707).',
          'Note inspection checkpoints for floor joists, girders, and sheathing.',
          'Complete 20 questions on floors and wall covering.',
        ],
      },
      {
        day: 13,
        title: 'Trade Chapters (E1/P1/M1 candidates)',
        tasks: [
          'E1: study NEC services (230), feeders & branch circuits (210), grounding (250).',
          'P1: study IPC fixtures, water supply, drainage & venting.',
          'M1: study IMC combustion air (Ch. 7), duct systems, and venting.',
          'B1/B2 candidates: continue drilling IRC building planning and add chimney/fireplace sections.',
        ],
      },
      {
        day: 14,
        title: 'Week 2 Review & Mixed Quiz',
        tasks: [
          'Take a 50-question mixed exam covering foundations, walls, roofing, and fire safety.',
          'Log every missed question and its code reference.',
          'Spend 1 hour on your weakest sub-topic from this week.',
        ],
      },
    ],
  },
  {
    week: 3,
    title: 'Practice Mode',
    subtitle: 'Shift from reading to active recall with daily quizzes, AI Tutor sessions, and timed drills.',
    days: [
      {
        day: 15,
        title: 'Index-First Lookup Drills',
        tasks: [
          'Do 20 timed lookups: read a subject, find it in the index, flip to the section, read the exact language.',
          'Target under 45 seconds per lookup.',
          'Record which chapters you know cold and which slow you down.',
        ],
      },
      {
        day: 16,
        title: 'Chapter-by-Chapter Drills (Weak Chapters)',
        tasks: [
          'Re-drill your three weakest chapters from Week 2 with the code open.',
          'Focus on reading sections including their exceptions ("unless," "except").',
          'Complete 30 questions across your weak chapters.',
        ],
      },
      {
        day: 17,
        title: 'Definitions & Terminology Day',
        tasks: [
          'Re-read the definitions chapter of your code.',
          'Quiz yourself: 20 questions that hinge on defined terms.',
          'Use the AI Tutor to explain any term that is still fuzzy.',
        ],
      },
      {
        day: 18,
        title: 'Timed Chapter Drills',
        tasks: [
          'Take three 20-question timed drills (10 minutes each) across different chapters.',
          'Simulate exam pacing: about 2 minutes per question.',
          'Review every miss and log the reference.',
        ],
      },
      {
        day: 19,
        title: 'AI Tutor Review Session',
        tasks: [
          'Ask the AI Tutor to explain your three most-missed topics in plain language.',
          'Generate 10 follow-up questions on those topics and answer them with the code open.',
          'Update your weak-area list.',
        ],
      },
      {
        day: 20,
        title: 'Trade-Chapter Drills (E1/P1/M1)',
        tasks: [
          'E1: drill NEC grounding, bonding, and service-entrance requirements.',
          'P1: drill IPC venting and trap-seal protection.',
          'M1: drill IMC combustion air sizing and appliance venting.',
          'B1/B2: drill building planning and means-of-egress requirements.',
        ],
      },
      {
        day: 21,
        title: 'Week 3 Review & Timed Mixed Exam',
        tasks: [
          'Take a 60-question timed exam (90 minutes) spanning all chapters.',
          'Review every wrong answer and its code reference.',
          'Update your weak-chapter priority list for Week 4.',
        ],
      },
    ],
  },
  {
    week: 4,
    title: 'Exam Simulation',
    subtitle: 'Full-length, timed, open-book simulations under exam conditions — then target weak areas.',
    days: [
      {
        day: 22,
        title: 'Simulation 1 — Full Length',
        tasks: [
          'Take a full-length simulation: 60 questions (80 for B2), 2 hours (3.5 for B2), open book, no interruptions.',
          'Mark questions you guessed on.',
          'Afterwards, review every miss and log the code reference.',
        ],
      },
      {
        day: 23,
        title: 'Weak-Chapter Focus',
        tasks: [
          'Re-drill your bottom two chapters from Simulation 1.',
          'Complete 30 targeted questions with the code open.',
          'Read the full sections (including exceptions) for your most-missed topics.',
        ],
      },
      {
        day: 24,
        title: 'Simulation 2 — Full Length',
        tasks: [
          'Take a second full-length simulation under exam conditions.',
          'Focus on pacing — you should finish with time to spare now.',
          'Review every miss; note whether the cause was navigation speed or content gaps.',
        ],
      },
      {
        day: 25,
        title: 'Speed & Accuracy Day',
        tasks: [
          'Do 30 rapid index-first lookups, timing each one.',
          'Take three 15-question timed drills (7 minutes each).',
          'Target 85%+ accuracy with lookups under 40 seconds.',
        ],
      },
      {
        day: 26,
        title: 'Simulation 3 — Full Length',
        tasks: [
          'Take a third full-length simulation. Score target: 80%+.',
          'Identify any remaining weak chapters and drill them for 1 hour.',
          'Update your mistake log with the references you keep missing.',
        ],
      },
      {
        day: 27,
        title: 'Final Weak-Area Attack',
        tasks: [
          'Spend 2 hours on your single weakest chapter.',
          'Read the definitions chapter one more time.',
          'Take a 30-question mixed quiz on your former weak areas — aim for 85%+.',
        ],
      },
      {
        day: 28,
        title: 'Final Review — Code Map & High-Weight Sections',
        tasks: [
          'Quick-scan the chapters you studied: R302, R310, R311, R312, R403, R602, R905 (B1); IBC Ch. 3, 6, 9, 10 (B2).',
          'Review the 10 most common question types you encountered.',
          'Final 30-question mixed quiz. Score target: 85%+.',
        ],
      },
      {
        day: 29,
        title: 'Rest & Light Review',
        tasks: [
          'NO new content. Light review only — skim notes, revisit your strongest topics.',
          'Prepare your exam materials: ID, exam confirmation, code book, tabs.',
          'Go to bed early. Aim for 8 hours of sleep.',
        ],
      },
      {
        day: 30,
        title: 'Exam Day!',
        tasks: [
          'Eat a good breakfast. Arrive 30 minutes early.',
          'Trust your preparation — you have put in the work.',
          'Read each question twice, watch for qualifiers ("minimum," "maximum," "unless"), and manage your time.',
        ],
      },
    ],
  },
];

function EmailCapture({ variant }: { variant: 'top' | 'bottom' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 ${variant === 'top' ? 'no-print' : ''}`}>
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
        📥 {variant === 'top' ? 'Subscribe to Our Newsletter' : 'Subscribe for the Free PDF'}
      </h3>
      <p className="text-sm text-[#94A3B8] mb-4">
        Subscribe to the Inspect Practice newsletter and we&apos;ll send you the printable PDF version of this 30-day checklist.
      </p>
      {status === 'success' ? (
        <p className="text-green-400 text-sm font-medium">✅ You&apos;re subscribed! Check your email for the PDF.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#1A2035] border border-white/10 text-[#F8FAFC] text-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#C8102E]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-lg bg-[#C8102E] hover:bg-[#2563EB] text-white text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Sending...' : 'Get PDF'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Try again or email us directly.</p>
      )}
    </div>
  );
}

function WeekSection({
  week,
  title,
  subtitle,
  days,
}: {
  week: number;
  title: string;
  subtitle: string;
  days: { day: number; title: string; tasks: string[] }[];
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C8102E] text-white text-sm font-bold">
          {week}
        </span>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">
          Week {week}: {title}
        </h2>
      </div>
      <p className="text-sm text-[#94A3B8] mb-6 ml-11">{subtitle}</p>
      <div className="space-y-3">
        {days.map((d) => (
          <div
            key={d.day}
            className="flex items-start gap-4 p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold text-[#C8102E]">
              {d.day}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#F8FAFC] text-sm mb-2">{d.title}</h3>
              <ul className="space-y-1">
                {d.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                    <span className="text-[#C8102E] mt-1">☐</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudyChecklistClient({ faqs }: Props) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
          </a>
          <a href="/" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          30-Day ICC Exam Prep Checklist
        </h1>
        <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-6">
          A day-by-day study plan to prepare for your ICC building inspector
          certification exams. Print it, check it, pass it.
        </p>
      </header>

      {/* Email Capture (Top) */}
      <div className="max-w-4xl mx-auto px-6 mb-8 no-print">
        <EmailCapture variant="top" />
      </div>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="prose prose-invert max-w-none text-sm text-[#94A3B8] leading-relaxed">
          <p>
            Passing your ICC certification exam requires more than just
            reading the code. You need a structured plan that covers every
            chapter, tests your navigation speed under exam conditions, and helps you
            identify weak areas before test day.
          </p>
          <p className="mt-4">
            This 30-day checklist is built around open-book code navigation and
            covers the IRC chapter map, index-first lookups, chapter drills, and
            full-length timed simulations. Whether you are pursuing B1 (IRC), B2
            (IBC), E1 (NEC + IRC electrical), P1 (IPC + IRC plumbing), or M1
            (IMC + IRC mechanical), this plan provides the foundation you need.
            Use it alongside{' '}
            <Link href="/" className="text-[#C8102E] hover:text-[#60A5FA]">
              Inspect Practice
            </Link>{' '}
            for daily practice questions, AI Tutor explanations, and progress
            tracking.
          </p>
          <p className="mt-4">
            Not sure which certification is right for you? Read our{' '}
            <Link href="/blog/icc-b1-certification-guide" className="text-[#C8102E] hover:text-[#60A5FA]">
              ICC B1 certification guide
            </Link>
            . Need a refresher on the code&apos;s structure? Check the{' '}
            <Link href="/blog/irc-study-guide" className="text-[#C8102E] hover:text-[#60A5FA]">
              IRC study guide
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">
            The Four-Week Structure
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-[#F8FAFC]">Week 1: Assessment &amp; Code Map</strong> — Review the
              exam bulletin, take a diagnostic quiz, identify your weak
              areas, and build a solid mental map of the code&apos;s chapters.
            </li>
            <li>
              <strong className="text-[#F8FAFC]">Week 2: Deep Study</strong> — Dive into the high-weight
              chapters (foundations, walls, roofing, fire safety) and the
              trade chapters for your certification.
            </li>
            <li>
              <strong className="text-[#F8FAFC]">Week 3: Practice Mode</strong> — Shift from passive reading
              to active recall with daily quizzes, index-first lookup drills,
              and timed practice questions at mixed difficulty levels.
            </li>
            <li>
              <strong className="text-[#F8FAFC]">Week 4: Exam Simulation</strong> — Take full-length,
              timed, open-book simulations, review every wrong answer, target weak
              areas, and arrive on exam day fully prepared.
            </li>
          </ul>
        </div>
      </section>

      {/* The Checklist */}
      <div className="max-w-4xl mx-auto px-6">
        {weeks.map((w) => (
          <WeekSection
            key={w.week}
            week={w.week}
            title={w.title}
            subtitle={w.subtitle}
            days={w.days}
          />
        ))}
      </div>

      {/* Tips Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">
            💡 Tips for Maximizing This Checklist
          </h3>
          <ul className="space-y-3 text-sm text-[#94A3B8]">
            <li className="flex gap-3">
              <span className="text-[#C8102E] flex-shrink-0">1.</span>
              <span><strong className="text-[#CBD5E1]">Consistency over intensity:</strong> Studying 2 hours every day is vastly more effective than cramming 8 hours on weekends.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#C8102E] flex-shrink-0">2.</span>
              <span><strong className="text-[#CBD5E1]">Always study with the code open:</strong> The exam is open book — every practice question is a navigation drill.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#C8102E] flex-shrink-0">3.</span>
              <span><strong className="text-[#CBD5E1]">Track your weak areas:</strong> After every quiz, log the chapters you got wrong. Spend the next day reviewing them.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#C8102E] flex-shrink-0">4.</span>
              <span><strong className="text-[#CBD5E1]">Simulate real exam conditions:</strong> In Week 4, take simulations in a quiet room with no phone, a strict timer, and only your code book.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#C8102E] flex-shrink-0">5.</span>
              <span><strong className="text-[#CBD5E1]">Use the Inspect Practice AI Tutor:</strong> When a code requirement doesn&apos;t click, ask the AI Tutor to explain it in plain language.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer text-[#F8FAFC] font-medium text-sm hover:bg-white/[0.06] transition-colors">
                <span>{faq.question}</span>
                <span className="text-[#C8102E] text-lg group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[#94A3B8] leading-relaxed border-t border-white/5 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Email Capture (Bottom) */}
      <div className="max-w-4xl mx-auto px-6 mb-16 no-print">
        <EmailCapture variant="bottom" />
      </div>

      {/* Related Resources */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-6">📚 Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/blog/icc-b1-certification-guide" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">The Complete ICC B1 Certification Guide</h3>
            <p className="text-xs text-[#64748B]">Proven strategies, eligibility, exam format, and code navigation tips.</p>
          </a>
          <a href="/blog/irc-study-guide" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">IRC Study Guide</h3>
            <p className="text-xs text-[#64748B]">Complete breakdown of the International Residential Code structure.</p>
          </a>
          <a href="/blog/icc-exam-structure" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">ICC Exam Structure</h3>
            <p className="text-xs text-[#64748B]">Questions, time limits, and passing scores for all 5 certifications.</p>
          </a>
          <a href="/blog/icc-study-techniques" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">Open-Book Study Techniques</h3>
            <p className="text-xs text-[#64748B]">10 proven techniques for open-book code exams.</p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 no-print">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-[#64748B]">
          <p className="mb-2">
            <a href="/" className="hover:text-[#94A3B8] transition-colors">Home</a>
            <span className="mx-2">·</span>
            <a href="/blog" className="hover:text-[#94A3B8] transition-colors">Blog</a>
            <span className="mx-2">·</span>
            <a href="/about" className="hover:text-[#94A3B8] transition-colors">About</a>
            <span className="mx-2">·</span>
            <a href="/pricing" className="hover:text-[#94A3B8] transition-colors">Pricing</a>
            <span className="mx-2">·</span>
            <a href="/privacy" className="hover:text-[#94A3B8] transition-colors">Privacy</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="hover:text-[#94A3B8] transition-colors">Terms</a>
          </p>
          <p>&copy; {new Date().getFullYear()} Inspect Practice. All rights reserved. Inspect Practice is not affiliated with the International Code Council.</p>
        </div>
      </footer>
    </div>
  );
}
