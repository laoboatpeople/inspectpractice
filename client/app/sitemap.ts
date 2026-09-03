import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import theoryData from '@/src/data/theory-data.json';

/** Read the real mtime of a page.tsx file and return its Date (or fallback). */
function fileMtime(relPath: string): Date {
  try {
    const full = path.join(process.cwd(), 'app', relPath, 'page.tsx');
    return new Date(fs.statSync(full).mtimeMs);
  } catch {
    return new Date('2026-05-20');
  }
}

const EN_SLUGS = [
  'icc-b1-certification-guide', 'irc-study-guide', 'ai-icc-exam-preparation',
  'icc-exam-structure', 'icc-exam-study-resources', 'icc-exam-study-plan',
  'icc-study-mistakes', 'icc-study-techniques', 'nhie-home-inspector-exam',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://inspectpractice.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: fileMtime('.'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: fileMtime('about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, lastModified: fileMtime('pricing'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: fileMtime('contact'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, lastModified: fileMtime('faq'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: fileMtime('privacy'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: fileMtime('terms'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, lastModified: fileMtime('blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/study-checklist`, lastModified: fileMtime('study-checklist'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/icc-resources`, lastModified: fileMtime('icc-resources'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/free-icc-practice-questions`, lastModified: fileMtime('free-icc-practice-questions'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/icc-certification-guide`, lastModified: fileMtime('icc-certification-guide'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/nhie-certification-guide`, lastModified: fileMtime('nhie-certification-guide'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/free-nhie-practice-questions`, lastModified: fileMtime('free-nhie-practice-questions'), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const enBlog: MetadataRoute.Sitemap = EN_SLUGS.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: fileMtime(`blog/${slug}`),
    changeFrequency: 'monthly' as const,
    priority: (
      slug === 'icc-b1-certification-guide' || slug === 'icc-exam-structure' || slug === 'irc-study-guide' ? 0.9 :
      slug === 'nhie-home-inspector-exam' ? 0.9 :
      slug === 'icc-exam-study-resources' || slug === 'icc-exam-study-plan' ? 0.8 :
      0.7
    ),
  }));

  const theoryChapters: MetadataRoute.Sitemap = theoryData.map((ch) => ({
    url: `${base}/theory/${ch.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...theoryChapters, ...staticPages, ...enBlog];
}
