'use client';

import { useState } from 'react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    topic: 'IRC — Building Planning',
    stem: 'Under the International Residential Code (IRC), what is the minimum required height for a guard on a residential balcony more than 30 inches above grade?',
    options: [
      'A: 30 inches (762 mm)',
      'B: 36 inches (914 mm)',
      'C: 42 inches (1067 mm)',
      'D: 48 inches (1219 mm)',
    ],
    correctIndex: 1,
    explanation:
      'IRC R312 requires guards to be at least 36 inches (914 mm) above the walking surface for balconies, porches, and mezzanines located more than 30 inches above grade. Guards protect against accidental falls from elevated walking surfaces.',
    ref: 'IRC R312',
  },
  {
    id: 2,
    topic: 'IRC — Foundations',
    stem: 'A cast-in-place concrete footing is being poured in a region where the local frost line is 42 inches. What is the minimum depth required for the footing?',
    options: [
      'A: 24 inches in all cases',
      'B: The local frost line depth of 42 inches, unless an approved frost-protected shallow foundation is used',
      'C: 36 inches regardless of the frost line',
      'D: No requirement — depth is at the inspector\u2019s discretion',
    ],
    correctIndex: 1,
    explanation:
      'IRC R403.1.4 requires footings to extend below the local frost line. A frost-protected shallow foundation (R403.3) is an approved alternative in certain conditions, but the default requirement is protection from frost heave.',
    ref: 'IRC R403.1.4, R403.3',
  },
  {
    id: 3,
    topic: 'IRC — Roofing',
    stem: 'What is the minimum slope required for asphalt shingle roof covering under the IRC?',
    options: [
      'A: 1:12',
      'B: 2:12',
      'C: 3:12',
      'D: 4:12',
    ],
    correctIndex: 1,
    explanation:
      'IRC R905.2.2 requires a minimum 2:12 slope for asphalt shingles. Below this slope, low-slope (membrane-type) roof covering is required instead.',
    ref: 'IRC R905.2.2',
  },
  {
    id: 4,
    topic: 'IRC — Fire Safety',
    stem: 'In a two-family dwelling, what openings are permitted in the wall separating the two dwelling units?',
    options: [
      'A: Windows with wired glass are permitted',
      'B: Openings are permitted if they total no more than 25% of the wall area',
      'C: No openings are permitted in the wall separating dwelling units',
      'D: A single door opening is permitted',
    ],
    correctIndex: 2,
    explanation:
      'IRC R302.2 prohibits openings in the wall separating dwelling units. This is a key fire-safety requirement for two-family and townhouse construction — the wall must maintain its fire-resistance rating.',
    ref: 'IRC R302.2',
  },
  {
    id: 5,
    topic: 'IRC — Stairways',
    stem: 'An interior stair serving a single residential level must have a minimum clear width of?',
    options: [
      'A: 24 inches',
      'B: 30 inches',
      'C: 36 inches',
      'D: 44 inches',
    ],
    correctIndex: 2,
    explanation:
      'IRC R311.7.1 requires a minimum clear width of 36 inches for residential stairways, measured between handrails or walls.',
    ref: 'IRC R311.7.1',
  },
  {
    id: 6,
    topic: 'IBC — Means of Egress',
    stem: 'Under the International Building Code (IBC), which of the following is true about the exit access travel distance for a business occupancy (Group B) without sprinklers?',
    options: [
      'A: 100 feet',
      'B: 200 feet',
      'C: 300 feet',
      'D: 400 feet',
    ],
    correctIndex: 1,
    explanation:
      'IBC Table 1020.2 allows a maximum exit access travel distance of 200 feet for Group B occupancies without an automatic sprinkler system. Sprinklered buildings generally get a 50% increase (300 feet).',
    ref: 'IBC Table 1020.2',
  },
  {
    id: 7,
    topic: 'NEC — Services',
    stem: 'Under the National Electrical Code (NEC), where must the service disconnecting means be located for a one-family dwelling?',
    options: [
      'A: At any location on the property',
      'B: At a readily accessible location nearest the point of entrance of the service conductors',
      'C: Inside the garage only',
      'D: On the utility pole',
    ],
    correctIndex: 1,
    explanation:
      'NEC 230.70 requires the service disconnecting means to be installed at a readily accessible location nearest the point of entrance of the service conductors. This ensures first responders can disconnect power quickly in an emergency.',
    ref: 'NEC 230.70',
  },
  {
    id: 8,
    topic: 'IPC — Venting',
    stem: 'Under the International Plumbing Code (IPC), what is the primary purpose of venting a drainage system?',
    options: [
      'A: To provide a drain for condensate',
      'B: To protect trap seals by equalizing pressure in the drainage system',
      'C: To provide access for cleaning the system',
      'D: To reduce water velocity in the drains',
    ],
    correctIndex: 1,
    explanation:
      'IPC Chapter 9 (Vents) requires venting to protect trap seals by equalizing air pressure in the drainage system. Without vents, siphoning or back-pressure can empty trap seals and allow sewer gas into the building.',
    ref: 'IPC Ch. 9',
  },
  {
    id: 9,
    topic: 'IMC — Combustion Air',
    stem: 'Under the International Mechanical Code (IMC), what happens to the combustion air opening requirement when a furnace is installed in a confined space?',
    options: [
      'A: No combustion air is required for sealed combustion units',
      'B: Combustion air must be provided from outdoors or from adjoining spaces per the code\u2019s sizing rules',
      'C: A single 1-inch opening is sufficient',
      'D: Combustion air is optional if the space is ventilated in summer',
    ],
    correctIndex: 1,
    explanation:
      'IMC Chapter 7 (Combustion Air) requires that fuel-burning appliances in confined spaces receive combustion air from outdoors or from adjoining spaces, sized per the code\u2019s formulas. Sealed-combustion units have separate requirements, but the default rule is a properly sized opening.',
    ref: 'IMC Ch. 7',
  },
  {
    id: 10,
    topic: 'IRC — Mixed Scenario',
    stem: 'During a B1 inspection, you find a bedroom window that opens but does not meet the minimum opening area for emergency escape. Which section of the IRC did the installation most likely violate?',
    options: [
      'A: R302 — Fire-resistant construction',
      'B: R310 — Emergency escape and rescue openings',
      'C: R405 — Foundation drainage',
      'D: R602 — Wall construction',
    ],
    correctIndex: 1,
    explanation:
      'IRC R310 requires emergency escape and rescue openings in sleeping rooms and basements, with minimum clear opening area, width, and height. A bedroom window that opens but fails the opening-size requirement violates R310.',
    ref: 'IRC R310',
  },
];

function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'sample-questions' }),
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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
        📥 Get 10 Free ICC Practice Questions
      </h3>
      <p className="text-sm text-[#94A3B8] mb-4">
        Subscribe to the Inspect Practice newsletter and we&apos;ll send you a free sample pack.
      </p>
      {status === 'success' ? (
        <p className="text-green-400 text-sm font-medium">✅ You&apos;re subscribed! Check your email for your free sample questions PDF.</p>
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
            {status === 'loading' ? 'Sending...' : 'Get Free Sample'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Try again or email us directly.</p>
      )}
    </div>
  );
}

function QuestionCard({ q }: { q: typeof questions[0] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C8102E] text-white text-xs font-bold">
          {q.id}
        </span>
        <span className="text-xs font-medium text-[#C8102E] uppercase tracking-wider">{q.topic}</span>
      </div>
      <p className="text-sm text-[#F8FAFC] font-medium mb-4">{q.stem}</p>
      <ul className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <li
            key={i}
            className={`text-xs text-[#94A3B8] p-2 rounded ${
              i === q.correctIndex ? 'border-l-2 border-[#C8102E] bg-[#C8102E]/5' : ''
            }`}
          >
            {opt}
          </li>
        ))}
      </ul>
      <details className="group">
        <summary className="inline-flex items-center gap-1 text-xs font-medium text-[#C8102E] hover:text-[#60A5FA] cursor-pointer list-none">
          <span>▶</span>
          <span>Show Answer</span>
        </summary>
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-xs font-medium text-green-400 mb-1">
            ✅ Correct Answer: {q.options[q.correctIndex]}
          </p>
          <p className="text-xs text-[#94A3B8]">{q.explanation}</p>
          <p className="text-xs text-[#64748B] mt-1 italic">Reference: {q.ref}</p>
        </div>
      </details>
    </div>
  );
}

export default function FreePracticeQuestionsClient() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
          </a>
          <a href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            ← Back to Blog
          </a>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Free ICC Practice Questions</h1>
        <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-6">
          10 realistic open-book questions covering the IRC, IBC, NEC, IPC, and IMC — with the exact code
          reference for every answer. Click to reveal the answer and explanation.
        </p>
        <a
          href="/auth/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C8102E] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors"
        >
          Start Your Free Practice →
        </a>
      </header>

      {/* Email Capture (Top) */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <EmailCapture />
      </div>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="text-sm text-[#94A3B8] leading-relaxed">
          <p>
            These 10 sample questions represent the type of questions you will
            encounter on ICC building inspector exams. Each question covers a
            specific code area — IRC building planning and foundations, IBC means
            of egress, NEC services, IPC venting, and IMC combustion air.
          </p>
          <p className="mt-4">
            Click the <strong className="text-[#F8FAFC]">Show Answer</strong> button under each question to see
            the correct answer, a detailed explanation, and the code
            reference. Use these questions to practice your code-navigation
            skills and identify areas that need more study.
          </p>
          <p className="mt-4">
            Inspect Practice has <strong className="text-[#F8FAFC]">2,500+ ICC practice questions</strong> covering all
            five certifications — B1, B2, E1, P1, and M1. Sign up
            for free to access the full question bank with adaptive difficulty,
            timed simulations, and AI-powered explanations.
          </p>
        </div>
      </section>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-6 space-y-6 mb-16">
        {questions.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#C8102E]/10 to-[#4C7FBF]/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">
            Ready for 2,500+ Questions?
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto mb-6">
            Get unlimited access to ICC-style open-book practice questions
            with adaptive difficulty, timed simulations, AI Tutor explanations,
            and detailed progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/auth/register"
              className="px-6 py-3 rounded-lg bg-[#C8102E] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors"
            >
              Create Free Account
            </a>
            <a
              href="/pricing"
              className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/[0.05] text-[#F8FAFC] text-sm font-medium transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Email Capture (Bottom) */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <EmailCapture />
      </div>

      {/* Related Resources */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-6">📚 More Study Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/blog/icc-b1-certification-guide" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">The Complete ICC B1 Certification Guide</h3>
            <p className="text-xs text-[#64748B]">Everything you need to earn your B1 certification.</p>
          </a>
          <a href="/blog/irc-study-guide" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">IRC Study Guide</h3>
            <p className="text-xs text-[#64748B]">Master navigation of the International Residential Code.</p>
          </a>
          <a href="/blog/icc-exam-structure" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">ICC Exam Structure</h3>
            <p className="text-xs text-[#64748B]">Questions, time limits, and passing scores for all 5 exams.</p>
          </a>
          <a href="/study-checklist" className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <h3 className="font-semibold text-[#F8FAFC] mb-1 text-sm">30-Day Study Checklist</h3>
            <p className="text-xs text-[#64748B]">Printable day-by-day ICC exam prep plan.</p>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
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
