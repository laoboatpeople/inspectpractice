import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Inspect Practice',
  description:
    'Inspect Practice terms of service. Review the terms and conditions governing your use of our ICC exam preparation platform.',
  alternates: {
    canonical: 'https://inspectpractice.com/terms',
    languages: {
      en: 'https://inspectpractice.com/terms',
      fr: 'https://inspectpractice.com/fr/terms',
    },
  },
  openGraph: {
    title: 'Terms of Service — Inspect Practice',
    description:
      'Inspect Practice terms of service. Review the terms and conditions governing your use of our ICC exam preparation platform.',
    url: 'https://inspectpractice.com/terms',
    type: 'website',
  },
  twitter: {
    title: 'Terms of Service — Inspect Practice',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
