import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us — Inspect Practice',
  description:
    'Get in touch with the Inspect Practice team. We are here to help with any questions about ICC exam preparation, pricing, or the platform.',
  alternates: {
    canonical: 'https://inspectpractice.com/contact',
    languages: {
      en: 'https://inspectpractice.com/contact',
      fr: 'https://inspectpractice.com/fr/contact',
    },
  },
  openGraph: {
    title: 'Contact Us — Inspect Practice',
    description:
      'Get in touch with the Inspect Practice team. We are here to help with any questions about ICC exam preparation, pricing, or the platform.',
    url: 'https://inspectpractice.com/contact',
    type: 'website',
  },
  twitter: {
    title: 'Contact Us — Inspect Practice',
  },
  other: {
    'article:published_time': '2025-03-01',
    'article:modified_time': '2026-05-12',
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Contact', url: 'https://inspectpractice.com/contact' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SL</span>
            </div>
            <span className="font-bold text-lg">Inspect Practice</span>
          </a>
          <a
            href="/"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            ← Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-[#94A3B8]">
            Have a question about ICC exam prep, your account, or the platform? Send us a message and we&apos;ll get back to you.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
    </>
  );
}
