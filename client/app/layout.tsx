import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Providers from './providers';
import { OrganizationJsonLd, WebSiteJsonLd, ProductJsonLd, CourseJsonLd } from '@/components/seo/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Inspect Practice',
  metadataBase: new URL('https://inspectpractice.com'),
  alternates: {
    canonical: 'https://inspectpractice.com',
    languages: {
      en: 'https://inspectpractice.com',
    },
  },
  other: {
    'google': 'nositelinkssearchbox',
    'googlebot-news': 'index, follow, max-snippet:-1, max-image-preview:large',
    'classification': 'educational',
    'perplexity': 'index, follow',
    'bingbot': 'index, follow',
    'GPTBot': 'index, follow',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the locale set by middleware (x-locale) so <html lang> is correct
  // server-side for FR pages — Google must not see lang="en" on /fr/* pages.
  let locale = 'en';
  try {
    const headersList = headers();
    locale = headersList.get('x-locale') || 'en';
  } catch {
    // headers() may throw during static fallback — default to en
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="alternate" hrefLang="en" href="https://inspectpractice.com" />
        <link rel="alternate" hrefLang="x-default" href="https://inspectpractice.com" />
      </head>
      <body className={inter.variable}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ProductJsonLd />
        <CourseJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
