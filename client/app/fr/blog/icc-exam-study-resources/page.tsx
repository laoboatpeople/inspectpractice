import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: "Ressources d'étude pour les examens ICC : codes, livres et outils — Inspect Practice",
  description:
    "La liste définitive des ressources d'étude pour les examens ICC : codes officiels (CRI, IBC, NEC, IPC, IMC), matériel de formation ICC, tests pratiques et outils d'étude par IA pour B1, B2, E1, P1 et M1.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/icc-exam-study-resources',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-study-resources',
      fr: 'https://inspectpractice.com/fr/blog/icc-exam-study-resources',
    },
  },
  openGraph: {
    title: "Ressources d'étude pour les examens ICC : codes, livres et outils — Inspect Practice",
    description:
      "La liste définitive des ressources d'étude pour les examens ICC : codes officiels, matériel de formation ICC, tests pratiques et outils d'étude par IA pour B1, B2, E1, P1 et M1.",
    url: 'https://inspectpractice.com/fr/blog/icc-exam-study-resources',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: "Ressources d'étude pour les examens ICC",
      },
    ],
  },
  twitter: {
    title: "Ressources d'étude pour les examens ICC : codes, livres et outils — Inspect Practice",
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStudyResourcesPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Ressources d'étude pour les examens ICC : codes, livres et outils"
        description="Liste complète des meilleures ressources d'étude pour les examens de certification ICC — codes officiels, matériel de formation, tests pratiques et plateforme d'étude par IA."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: "Ressources d'étude pour les examens ICC", url: 'https://inspectpractice.com/fr/blog/icc-exam-study-resources' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
        <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/fr" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">IP</span>
              </div>
              <span className="font-bold text-lg">Inspect Practice</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/fr/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">← Blog</a>
              <a href="/blog/icc-exam-study-resources" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Référence</span>
              <span className="text-xs text-[#64748B]">22 mai 2026 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 10 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Ressources d'étude pour les examens ICC : codes, livres et outils</h1>
            <p className="text-lg text-[#94A3B8]">
              Que vous prépariez le B1, le B2, l'E1, le P1 ou le M1, les bonnes ressources font toute la
              différence entre des mois de lecture dispersée et une réussite confiante. Voici tout ce qu'il vous
              faut, classé par impact.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — curateurs des meilleurs outils d'étude des codes</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">1. Les codes eux-mêmes (indispensables)</h2>
            <p>Chaque examen de certification ICC est à livre ouvert, et le code est votre arme principale. Vous devez posséder l'édition en vigueur du code de votre certification :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>B1 — Code résidentiel international (CRI/IRC)</strong> : habitations unifamiliales et bifamiliales.</li>
              <li><strong>B2 — Code international du bâtiment (IBC)</strong> : bâtiments commerciaux et multifamiliaux.</li>
              <li><strong>E1 — Code national de l'électricité (NEC)</strong> + chapitres électriques du CRI (Ch. 34–43).</li>
              <li><strong>P1 — Code international de plomberie (IPC)</strong> + chapitres plomberie du CRI (Ch. 25–33).</li>
              <li><strong>M1 — Code international de mécanique (IMC)</strong> + chapitres mécanique du CRI (Ch. 12–24).</li>
            </ul>
            <p>
              Achetez l'édition sur laquelle repose votre examen (vérifiez le bulletin officiel ICC — par
              exemple 2024 ou 2021). Ongletez les chapitres les plus utilisés.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">2. Matériel officiel de l'ICC</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bulletins d'examen ICC</strong> — PDF gratuits qui listent les domaines de contenu, le nombre de questions, les limites de temps et les notes de passage. Lisez le vôtre en premier.</li>
              <li><strong>Examens pratiques ICC</strong> — tests officiels au même format que l'examen réel.</li>
              <li><strong>Cours de formation ICC</strong> — cours en ligne et en présentiel pour chaque certification.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">3. Ouvrages de référence terrain</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Guides de l'inspecteur résidentiel</strong> — déroulés d'inspection système par système.</li>
              <li><strong>Série Code Check</strong> — cartes de référence rapide pour la charpente, l'électricité, la plomberie et la mécanique.</li>
              <li><strong>Manuels de construction</strong> — un bon ouvrage de base (par ex. « Building Construction Illustrated ») construit le modèle mental derrière le code.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">4. Plateformes de questions pratiques (votre temps le plus rentable)</h2>
            <p>
              Parce que les examens sont à livre ouvert, l'activité au meilleur rendement est de répondre à des
              questions avec le code sous les yeux. <a href="/fr/blog" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">Inspect Practice</a>{' '}
              est conçu pour cela : questions de style examen pour B1, B2, E1, P1 et M1, chacune avec la
              référence exacte au code, difficulté adaptative et simulations chronométrées.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">5. Ressources gratuites utiles</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Site de l'ICC</strong> — bulletins d'examen, FAQ sur la certification et formation continue.</li>
              <li><strong>Le service du bâtiment de votre municipalité</strong> — de nombreux services publient des listes de contrôle d'inspection.</li>
              <li><strong>Les questions gratuites d'Inspect Practice</strong> — testez le format avant de vous engager.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Une séquence d'étude plus intelligente</h2>
            <p>
              Lisez le bulletin d'examen → survolez la carte des chapitres → entraînez-vous chapitre par chapitre
              → révisez les explications (surtout les références) → faites des simulations complètes → ciblez les
              chapitres faibles. Pour un calendrier semaine par semaine, voir notre{' '}
              <a href="/fr/blog/icc-exam-study-plan" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                plan d'étude ICC de 12 semaines
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Ressources d'étude pour les examens ICC"
        description="Liste organisée des ressources d'étude pour les examens ICC : codes officiels, matériel de formation, références terrain et plateformes de pratique par IA."
        educationalLevel="Professional"
        teaches={['Préparation aux examens ICC', 'Codes officiels', 'Examens pratiques ICC', 'Navigation dans les codes']}
        resourceType="Guide"
      />
    </>
  );
}
