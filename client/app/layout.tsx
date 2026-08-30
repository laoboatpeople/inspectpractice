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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png?v=4', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png?v=4', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png?v=4', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png?v=4', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png?v=4', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicon-192x192.png?v=4', sizes: '192x192', type: 'image/png' }],
  },
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
