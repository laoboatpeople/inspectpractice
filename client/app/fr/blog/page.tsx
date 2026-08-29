import Link from 'next/link';
import type { Metadata } from 'next';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import NewsletterSection from '@/components/marketing/NewsletterSection';
import BlogFilter from '../../blog/BlogFilter';

export const metadata: Metadata = {
  title: 'Blog Guide des Examens ICC — Inspect Practice',
  description:
    "Guides experts pour les examens d'inspecteur en bâtiment ICC. Certifications B1, B2, E1, P1 & M1, navigation dans le CRI/IBC, techniques d'étude à livre ouvert et structure des examens.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog',
    languages: {
      en: 'https://inspectpractice.com/blog',
      fr: 'https://inspectpractice.com/fr/blog',
    },
  },
  openGraph: {
    title: 'Blog Guide des Examens ICC — Inspect Practice',
    description:
      "Guides experts pour la préparation aux examens d'inspecteur en bâtiment ICC. Certifications B1, B2, E1, P1 & M1, navigation dans les codes et techniques d'étude.",
    url: 'https://inspectpractice.com/fr/blog',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Guide des Examens ICC — Inspect Practice',
    description:
      "Guides experts pour la préparation aux examens ICC d'inspecteur en bâtiment.",
    images: ['https://inspectpractice.com/images/og/home.jpg'],
  },
  other: {
    'article:published_time': '2025-03-01',
    'article:modified_time': '2026-08-18',
  },
};

const posts = [
  {
    slug: 'icc-b1-certification-guide',
    title: 'Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel)',
    description:
      "Guide complet étape par étape pour obtenir votre certification ICC B1, incluant l'admissibilité, le format de l'examen à livre ouvert sur le CRI et la stratégie d'étude.",
    date: '15 mars 2025 *mis à jour 18 août 2026',
    readTime: '10 min de lecture',
    category: 'Certification',
  },
  {
    slug: 'irc-study-guide',
    title: "Guide d'étude du CRI : comment naviguer le Code résidentiel international",
    description:
      "Maîtrisez le Code résidentiel international pour votre examen ICC B1. Carte des chapitres, système de numérotation, stratégies d'index et exercices de recherche à livre ouvert.",
    date: '2 avril 2025 *mis à jour 18 août 2026',
    readTime: '8 min de lecture',
    category: 'Navigation dans le code',
  },
  {
    slug: 'ai-icc-exam-preparation',
    title: "Comment l'IA transforme la préparation aux examens ICC",
    description:
      "Découvrez comment l'intelligence artificielle transforme la préparation aux examens ICC. Apprentissage adaptatif, parcours personnalisés, explications avec références au code et tutorat par IA.",
    date: '16 mai 2026 *mis à jour 18 août 2026',
    readTime: '9 min de lecture',
    category: 'Technologie',
  },
  {
    slug: 'icc-exam-structure',
    title: "Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage",
    description:
      "Comparaison complète des 5 examens de certification ICC avec un tableau détaillé : nombre de questions, limites de temps, notes de passage et codes de référence.",
    date: '20 mai 2026 *mis à jour 18 août 2026',
    readTime: '14 min de lecture',
    category: 'Examens',
  },
  {
    slug: 'icc-exam-study-resources',
    title: "Ressources d'étude pour les examens ICC : codes, livres et outils",
    description:
      "La liste définitive des ressources d'étude pour les examens ICC : codes officiels (CRI, IBC, NEC, IPC, IMC), matériel de formation ICC, tests pratiques et outils d'étude par IA.",
    date: '22 mai 2026 *mis à jour 18 août 2026',
    readTime: '10 min de lecture',
    category: 'Référence',
  },
  {
    slug: 'icc-exam-study-plan',
    title: "Plan d'étude ICC de 12 semaines : un calendrier étape par étape",
    description:
      "Un plan d'étude éprouvé de 12 semaines pour les examens de certification ICC. Calendrier semaine par semaine : navigation dans les codes, questions pratiques et simulations chronométrées.",
    date: '22 mai 2026 *mis à jour 18 août 2026',
    readTime: '11 min de lecture',
    category: "Plan d'étude",
  },
  {
    slug: 'icc-study-mistakes',
    title: 'Les 10 erreurs des candidats aux examens ICC (et comment les éviter)',
    description:
      "Les erreurs les plus courantes des candidats aux examens ICC — de l'ignorance du bulletin d'examen à la mémorisation au lieu de la navigation. Réussissez du premier coup.",
    date: '22 mai 2026 *mis à jour 18 août 2026',
    readTime: '9 min de lecture',
    category: "Stratégie d'examen",
  },
  {
    slug: 'icc-study-techniques',
    title: "Comment étudier pour les examens ICC à livre ouvert : 10 techniques",
    description:
      "Découvrez 10 techniques d'étude éprouvées pour les examens ICC à livre ouvert. De la navigation dans les codes aux simulations chronométrées — des techniques qui fonctionnent vraiment.",
    date: '23 mai 2026 *mis à jour 18 août 2026',
    readTime: '12 min de lecture',
    category: "Méthodes d'étude",
  },
];

const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

export default function FrBlogIndexPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/fr" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">IP</span>
            </div>
            <span className="font-bold text-lg">Inspect Practice</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/fr" className="text-sm text-[#94A3B8] hover:text-white transition-colors">← Retour à l&apos;accueil</a>
            <a href="/blog" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-4">Guide des Examens ICC</h1>
        <p className="text-lg text-[#94A3B8] max-w-2xl">
          Des ressources expertes pour vous préparer aux examens d&apos;inspecteur en
          bâtiment ICC. Chaque guide couvre les certifications B1, B2, E1, P1 &amp; M1
          et les compétences de navigation à livre ouvert que les examens récompensent.
        </p>
      </div>

      <BlogFilter posts={posts} categories={categories} basePath="/fr/blog" />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <div className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <a
            href="/fr/faq"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            Visitez notre FAQ →
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
