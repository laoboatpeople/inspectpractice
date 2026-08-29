import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contactez-nous — Inspect Practice',
  description:
    'Communiquez avec l\'équipe Inspect Practice. Nous sommes là pour répondre à toutes vos questions sur la préparation aux examens ICC, les tarifs ou la plateforme.',
  alternates: {
    canonical: 'https://inspectpractice.com/fr/contact',
    languages: {
      en: 'https://inspectpractice.com/contact',
      fr: 'https://inspectpractice.com/fr/contact',
    },
  },
  openGraph: {
    title: 'Contactez-nous — Inspect Practice',
    description:
      'Communiquez avec l\'équipe Inspect Practice. Nous sommes là pour répondre à toutes vos questions sur la préparation aux examens ICC, les tarifs ou la plateforme.',
    url: 'https://inspectpractice.com/fr/contact',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contactez Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contactez-nous — Inspect Practice',
    description:
      'Communiquez avec l\'équipe Inspect Practice. Nous sommes là pour répondre à toutes vos questions sur la préparation aux examens ICC, les tarifs ou la plateforme.',
    images: ['https://inspectpractice.com/images/og/contact.jpg'],
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
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Contact', url: 'https://inspectpractice.com/fr/contact' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/fr/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SL</span>
            </div>
            <span className="font-bold text-lg">Inspect Practice</span>
          </a>
          <a
            href="/fr/"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            ← Accueil
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contactez-nous</h1>
          <p className="text-[#94A3B8]">
            Vous avez une question sur la préparation aux examens ICC, votre compte ou la plateforme&nbsp;? Envoyez-nous un message et nous vous répondrons.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
    </>
  );
}
