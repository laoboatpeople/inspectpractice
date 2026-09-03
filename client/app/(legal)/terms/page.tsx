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
      <p key={index} className="text-[#586A73] leading-relaxed mb-4">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-[#102631] font-semibold">{part.slice(2, -2)}</strong>;
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
      <div className="min-h-screen bg-[#F4F7F8]">
      {/* Simple nav */}
      <nav className="border-b border-[#DCE4E7]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main-light.png?v=5" alt="Inspect Practice" className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors"
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
            <span className="inline-block px-3 py-1 rounded-full bg-[#145A73]/10 border border-[#145A73]/20 text-xs text-[#145A73] font-medium">
              {lastUpdated}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#145A73] to-[#145A73] bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="space-y-1">
            {Array.isArray(content) ? content.map((paragraph: string, idx: number) => renderContent(paragraph, idx)) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE4E7] py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#586A73]">{tm("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">{tm("footer.privacy")}</Link>
            <Link href="/terms" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">{tm("footer.terms")}</Link>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
