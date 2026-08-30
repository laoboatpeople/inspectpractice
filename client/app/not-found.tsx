import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found — Inspect Practice',
  description: 'The page you are looking for does not exist. Browse our ICC exam resources, practice questions, and study guides.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#102631] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="text-8xl font-bold bg-gradient-to-r from-[#176B87] to-[#176B87] bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
          <p className="text-[#586A73] mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link href="/" className="p-4 rounded-xl border border-[#DCE4E7] bg-white hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">🏠 Home</h3>
              <p className="text-xs text-[#7A8B94]">Back to the Inspect Practice homepage</p>
            </Link>
            <Link href="/free-icc-practice-questions" className="p-4 rounded-xl border border-[#DCE4E7] bg-white hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📝 Practice Questions</h3>
              <p className="text-xs text-[#7A8B94]">Free ICC-style open-book code questions</p>
            </Link>
            <Link href="/blog" className="p-4 rounded-xl border border-[#DCE4E7] bg-white hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📚 Blog & Resources</h3>
              <p className="text-xs text-[#7A8B94]">Certification guides, code navigation, and tips</p>
            </Link>
            <Link href="/study-checklist" className="p-4 rounded-xl border border-[#DCE4E7] bg-white hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📋 Study Checklist</h3>
              <p className="text-xs text-[#7A8B94]">30-day printable ICC exam prep plan</p>
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/auth/login" className="px-6 py-3 rounded-lg bg-[#CBEA32] hover:bg-[#B5D51F] text-[#071D2B] font-semibold text-sm font-medium transition-colors">
              Get Started Free
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-lg border border-[#DCE4E7] hover:bg-white/[0.05] text-[#102631] text-sm font-medium transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
