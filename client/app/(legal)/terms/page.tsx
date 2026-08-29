'use client';

import en from "../../../messages/en.json";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

export default function TermsPage() {
  const msgs: Record<string, unknown> = en;

  const tm = (key: string) => {
    const keys = key.split('.');
    let val: any = msgs;
    for (const k of keys) { val = val?.[k]; }
    return val || key;
  };

  const content: string[] = tm("legal.page.terms.content");
  const lastUpdated: string = tm("legal.lastUpdated");
  const title: string = tm("legal.page.terms.title");

  const renderContent = (text: string, index: number) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={index} className="text-[#94A3B8] leading-relaxed mb-4">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-[#F8FAFC] font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Terms of Service', url: 'https://inspectpractice.com/terms' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A]">
      {/* Simple nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {tm("nav.home") || "Home"}
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C8102E]/10 border border-[#C8102E]/20 text-xs text-[#C8102E] font-medium">
              {lastUpdated}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="space-y-1">
            {Array.isArray(content) ? content.map((paragraph: string, idx: number) => renderContent(paragraph, idx)) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#94A3B8]">{tm("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("footer.privacy")}</Link>
            <Link href="/terms" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("footer.terms")}</Link>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
