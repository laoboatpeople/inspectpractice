import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Inspect Practice — ICC Exam Prep Platform',
  description:
    'AI-powered exam prep for ICC building inspector certifications. 2,500+ code-referenced questions to help you pass your B1, B2, E1, P1 & M1 exams.',
  alternates: {
    canonical: 'https://inspectpractice.com/about',
    languages: {
      en: 'https://inspectpractice.com/about',
    },
  },
  openGraph: {
    title: 'About Inspect Practice — ICC Exam Prep Platform',
    description:
      'Learn about Inspect Practice: our mission to help building inspectors pass ICC certification exams with our AI-powered platform and 2,500+ questions.',
    url: 'https://inspectpractice.com/about',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/about.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice ICC Exam Preparation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Inspect Practice — ICC Exam Prep Platform',
  },
  other: {
    'article:published_time': '2025-01-15',
    'article:modified_time': '2026-08-18',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
      {/* Nav */}
      <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
          </a>
          <a href="/" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
            About
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
            About Inspect Practice
          </h1>
          <p className="text-lg md:text-xl text-[#586A73] max-w-3xl mx-auto leading-relaxed">
            We are building the most effective study platform for ICC building
            inspector certification exams — combining AI technology with real
            code expertise to help candidates pass with confidence.
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#176B87]/20 flex items-center justify-center text-[#176B87]">★</span>
              Our Mission
            </h2>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              Our mission is simple: help every building inspector pass their ICC
              certification exam on the first try. We believe preparing for ICC
              certification should not be a guessing game. Too many candidates
              walk into the exam unprepared — not because they lack skills, but
              because they lack access to study tools that reflect the true exam
              experience.
            </p>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              Traditional study materials for the ICC exams are outdated, difficult
              to navigate, and rarely offer the depth of open-book practice needed
              to build real confidence. The codes are dense, practice questions are
              scarce, and the IRC/IBC/NEC/IPC/IMC structure can feel overwhelming
              without a structured approach. We set out to change that by building
              a platform that adapts to each candidate&apos;s learning pace, identifies
              weak points, and offers targeted practice where it matters most.
            </p>
            <p className="text-[#DCE4E7] leading-relaxed">
              At the heart of our mission is a commitment to public safety. Every
              inspector who approves a construction project is responsible for the
              safety of its occupants. By ensuring that certification candidates
              are thoroughly prepared, we are contributing to safer buildings across
              the United States and beyond.
            </p>
          </div>
        </section>

        {/* Our Platform */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#176B87]/20 flex items-center justify-center text-[#176B87]">◆</span>
              Our Platform
            </h2>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              Inspect Practice is not a simple flashcard app. It is a specialized,
              AI-powered study platform engineered from the ground up around the
              ICC certification exams: B1 (Residential Building Inspector — IRC),
              B2 (Commercial Building Inspector — IBC), E1 (Residential Electrical
              Inspector — NEC), P1 (Residential Plumbing Inspector — IPC), and M1
              (Residential Mechanical Inspector — IMC). Every question, every
              explanation, and every algorithm is designed to reflect the true
              open-book exam experience.
            </p>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              Our question bank contains over 2,500 AI-generated, expert-reviewed
              questions covering the relevant chapters of each code. Every question
              is tagged by code, chapter, topic, difficulty level, and exact code
              reference — making it easy for candidates to target their weak areas
              and train their code-navigation speed.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#176B87]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#176B87]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">AI Adaptive Difficulty</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  The AI adjusts question difficulty in real time based on your
                  performance. Master a topic and the system challenges you further;
                  struggle and it offers more foundational exercises. This ensures
                  efficient, targeted study sessions.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#176B87]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#176B87]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Realistic Open-Book Simulations</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  Timed practice exams replicate the actual ICC testing environment.
                  Build speed and confidence before the real exam with question
                  formats, durations, and difficulty levels aligned to official
                  standards.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#176B87]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#176B87]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">AI Tutor</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  Get instant, plain-language explanations of complex code
                  requirements. Ask questions naturally and receive exam-focused
                  answers that reference the exact code sections.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#F5B942]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#F5B942]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Progress Analytics</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  Detailed analytics show your performance in every chapter of the
                  code. Track accuracy by chapter, monitor difficulty progression,
                  and review your exam history — always know exactly where you stand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Founder */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F5B942]/20 flex items-center justify-center text-[#F5B942]">👤</span>
              Our Founder
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#176B87] to-[#176B87] flex items-center justify-center text-white text-4xl font-bold shrink-0">
                CO
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Chuck Onekeo</h3>
                <p className="text-sm text-[#176B87] font-medium mb-4">
                  Programmer &amp; AI Specialist — Founder of Inspect Practice
                </p>
                <p className="text-[#DCE4E7] leading-relaxed mb-4">
                  Chuck Onekeo is a programmer and AI specialist with extensive
                  experience building intelligent systems for technical education.
                  Frustrated by the lack of modern, adaptive study tools available
                  to certification candidates, Chuck decided to build the platform
                  he wished he had when studying for his own technical
                  certifications.
                </p>
                <p className="text-[#DCE4E7] leading-relaxed mb-4">
                  Combining his expertise in artificial intelligence, machine
                  learning, and full-stack development, Chuck designed Inspect
                  Practice from the ground up as an adaptive learning system
                  tailored specifically to the open-book ICC certification exams.
                  The platform&apos;s AI engine dynamically adjusts question difficulty,
                  generates contextual explanations, and provides personalized
                  study recommendations based on individual performance.
                </p>
                <p className="text-[#DCE4E7] leading-relaxed">
                  Chuck&apos;s vision for Inspect Practice goes beyond helping
                  candidates pass their exams. He believes that well-prepared
                  inspectors make buildings safer for everyone, and that technology
                  — especially AI — has the power to dramatically improve how
                  technical professionals prepare for high-stakes certification
                  exams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#176B87]/20 flex items-center justify-center text-[#176B87]">⚡</span>
              Why We Built This
            </h2>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              The path to ICC certification is demanding. Candidates must master
              massive codes (IRC, IBC, NEC, IPC, IMC), pass timed open-book exams,
              and develop the navigation speed that makes the difference on exam
              day. Despite the high stakes, most candidates rely on dense manuals,
              scattered PDFs, and word-of-mouth advice to prepare.
            </p>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              We saw a gap that technology could fill. The same AI techniques that
              power recommendation systems, language models, and adaptive tutoring
              platforms could be applied to inspection exam preparation — and the
              result is a study experience that is more effective, more engaging,
              and more performant than anything currently available to ICC
              candidates.
            </p>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              Key problems we set out to solve:
            </p>
            <ul className="space-y-3 text-[#DCE4E7]">
              <li className="flex items-start gap-3">
                <span className="text-[#176B87] mt-1.5">▸</span>
                <span><strong className="text-[#102631]">Scarcity of practice questions</strong> — Most candidates report that finding enough realistic practice questions is their biggest challenge. We built a bank of 2,500+ questions covering all five ICC certifications.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#176B87] mt-1.5">▸</span>
                <span><strong className="text-[#102631]">One-size-fits-all study materials</strong> — Every candidate learns differently. Our adaptive AI tailors the difficulty and focus of every study session to the individual&apos;s performance.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#176B87] mt-1.5">▸</span>
                <span><strong className="text-[#102631]">Lack of exam simulation tools</strong> — Candidates need timed, realistic practice to build confidence. Our exam mode replicates the actual open-book ICC testing environment.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#176B87] mt-1.5">▸</span>
                <span><strong className="text-[#102631]">No visibility into progress</strong> — Without analytics, candidates don&apos;t know what to focus on. Our platform provides detailed performance metrics for every chapter and topic.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#176B87] mt-1.5">▸</span>
                <span><strong className="text-[#102631]">No mobile study options</strong> — Inspectors are busy professionals. Inspect Practice is available on mobile, tablet, and desktop so you can study anytime, anywhere.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#176B87]/20 flex items-center justify-center text-[#176B87]">♥</span>
              Our Commitment
            </h2>
            <p className="text-[#DCE4E7] leading-relaxed mb-4">
              We are committed to building a platform that genuinely helps ICC
              candidates succeed. That means:
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#176B87]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#176B87] text-2xl font-bold">Q</span>
                </div>
                <h3 className="font-semibold mb-2">Quality Content</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  Every question is reviewed against current codes. We regularly
                  update our question bank to stay aligned with new code editions
                  and ICC exam bulletins.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#176B87]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#176B87] text-2xl font-bold">$</span>
                </div>
                <h3 className="font-semibold mb-2">Fair Pricing</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  We offer a free tier so every candidate can try the platform,
                  plus affordable monthly and lifetime plans. No hidden fees, no
                  surprises.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#176B87]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#176B87] text-2xl font-bold">S</span>
                </div>
                <h3 className="font-semibold mb-2">Student Success</h3>
                <p className="text-sm text-[#586A73] leading-relaxed">
                  Our success is measured by your success. We continuously improve
                  the platform based on candidate feedback and performance data to
                  maximize pass rates.
                </p>
              </div>
            </div>
            <p className="text-[#DCE4E7] leading-relaxed mt-8">
              We are just getting started. The platform evolves constantly with new
              features, more questions, and improved AI capabilities. Our long-term
              vision is to become the go-to study resource for every ICC candidate
              in the United States — and eventually extend our support to related
              inspection certifications worldwide. Whether you are just beginning
              your B1 journey or adding E1, P1, or M1 to your profile, Inspect
              Practice is built for you.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pb-20">
          <div className="bg-gradient-to-r from-[#176B87]/10 to-[#176B87]/10 rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-3">Ready to Pass Your ICC Exam?</h2>
            <p className="text-[#586A73] mb-6 max-w-xl mx-auto">
              Join thousands of inspectors preparing with Inspect Practice. Start
              free, upgrade when you are ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
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
    </div>
  );
}
