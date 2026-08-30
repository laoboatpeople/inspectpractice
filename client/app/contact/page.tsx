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
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
      {/* Nav */}
      <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
          </a>
          <a
            href="/"
            className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors"
          >
            ← Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-[#586A73]">
            Have a question about ICC exam prep, your account, or the platform? Send us a message and we&apos;ll get back to you.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
    </>
  );
}
