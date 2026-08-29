import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: "Guide d'étude du CRI : comment naviguer le Code résidentiel international — Inspect Practice",
  description:
    "Maîtrisez le Code résidentiel international (CRI/IRC) pour votre examen ICC B1. Carte des chapitres, système de numérotation, stratégies d'index et exercices de recherche à livre ouvert.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/irc-study-guide',
    languages: {
      en: 'https://inspectpractice.com/blog/irc-study-guide',
      fr: 'https://inspectpractice.com/fr/blog/irc-study-guide',
    },
  },
  openGraph: {
    title: "Guide d'étude du CRI : comment naviguer le Code résidentiel international — Inspect Practice",
    description:
      "Maîtrisez le Code résidentiel international (CRI/IRC) pour votre examen ICC B1. Carte des chapitres, système de numérotation, stratégies d'index et exercices de recherche à livre ouvert.",
    url: 'https://inspectpractice.com/fr/blog/irc-study-guide',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: "Guide d'étude du CRI",
      },
    ],
  },
  twitter: {
    title: "Guide d'étude du CRI : comment naviguer le Code résidentiel international — Inspect Practice",
  },
  other: {
    'article:published_time': '2025-04-02',
    'article:modified_time': '2026-08-18',
  },
};

export default function IrcStudyGuidePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Guide d'étude du CRI : comment naviguer le Code résidentiel international"
        description="Maîtrisez le Code résidentiel international (CRI/IRC) pour votre examen ICC B1. Carte des chapitres, système de numérotation, stratégies d'index et exercices à livre ouvert."
        datePublished="2025-04-02"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: "Guide d'étude du CRI", url: 'https://inspectpractice.com/fr/blog/irc-study-guide' },
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
              <a href="/blog/irc-study-guide" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Navigation dans le code</span>
              <span className="text-xs text-[#64748B]">2 avril 2025 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 8 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Guide d'étude du CRI : comment naviguer le Code résidentiel international</h1>
            <p className="text-lg text-[#94A3B8]">
              L'examen ICC B1 est à livre ouvert — la compétence la plus importante est donc de trouver la bonne
              section rapidement. Ce guide cartographie l'ensemble du Code résidentiel international pour que
              vous naviguiez comme un inspecteur expérimenté.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — exercices de navigation pour examens à livre ouvert</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Pourquoi la navigation prime sur la mémorisation</h2>
            <p>
              Les examens à livre ouvert changent complètement la donne. Plutôt que de mémoriser des centaines
              d'exigences, vous devez savoir <em>où vit chaque exigence</em> et comment y accéder en moins de
              deux minutes. Les candidats qui traitent le CRI comme un manuel de référence — et non comme un
              manuel à mémoriser — réussissent systématiquement mieux.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">La carte des chapitres du CRI</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chapitre 1 — Portée et administration :</strong> permis, inspections et application du code.</li>
              <li><strong>Chapitre 2 — Définitions :</strong> le vocabulaire du code. En cas de doute, vérifiez d'abord les définitions.</li>
              <li><strong>Chapitre 3 — Planification du bâtiment :</strong> éclairage, ventilation, issues, escaliers, garde-corps (R302–R325).</li>
              <li><strong>Chapitre 4 — Fondations :</strong> semelles, murs de fondation, protection contre le gel (R401–R408).</li>
              <li><strong>Chapitre 5 — Planchers :</strong> charpente de plancher, solives, revêtement (R501–R509).</li>
              <li><strong>Chapitre 6 — Construction des murs :</strong> murs à colombages, linteaux, contreventement (R601–R611).</li>
              <li><strong>Chapitre 7 — Revêtement des murs :</strong> revêtements intérieurs et extérieurs (R701–R707).</li>
              <li><strong>Chapitre 8 — Construction toit-plafond :</strong> charpente de toit, chevrons (R801–R806).</li>
              <li><strong>Chapitre 9 — Ensembles de toiture :</strong> matériaux de couverture, pentes, sous-couche (R901–R908).</li>
              <li><strong>Chapitre 10 — Cheminées et foyers :</strong> systèmes en maçonnerie et préfabriqués (R1001–R1006).</li>
              <li><strong>Chapitre 11 — Efficacité énergétique :</strong> isolation, infiltration d'air, fenestration.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Comprendre la numérotation des sections</h2>
            <p>
              Chaque section du CRI suit le modèle <strong>R + chapitre + section</strong>. R403 se trouve au
              chapitre 4 (Fondations); R905 au chapitre 9 (Ensembles de toiture). Les sous-sections ajoutent des
              décimales : R403.1.4 est le quatrième sous-élément de R403.1.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Stratégie « index d'abord »</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Lisez la question, identifiez le sujet</strong> — par exemple « largeur minimale d'escalier », « hauteur de garde-corps ».</li>
              <li><strong>Ouvrez l'index et trouvez le sujet</strong> — l'index donne directement le numéro de section.</li>
              <li><strong>Allez à la section et lisez le texte exact</strong> — attention aux exceptions (« sauf », « à moins que »).</li>
              <li><strong>Confirmez que la section correspond</strong> — la bonne réponse paraphrase le texte du code.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Sections à fort poids à connaître par cœur</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>R302</strong> — construction résistante au feu entre unités</li>
              <li><strong>R311</strong> — issues, escaliers et garde-corps</li>
              <li><strong>R312</strong> — protection contre les chutes (garde-corps, fenêtres)</li>
              <li><strong>R403</strong> — semelles et protection contre le gel</li>
              <li><strong>R602</strong> — charpente et contreventement des murs</li>
              <li><strong>R905</strong> — matériaux de couverture et pentes</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Entraînez-vous avec de vraies questions</h2>
            <p>
              La banque de questions B1 d'Inspect Practice est construite autour de scénarios à livre ouvert :
              chaque question inclut la référence exacte au CRI et les simulations chronométrées reproduisent
              l'examen réel. Commencez avec{' '}
              <a href="/fr/blog" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                des questions pratiques ICC gratuites
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Guide d'étude du CRI — Code résidentiel international"
        description="Guide chapitre par chapitre du Code résidentiel international (CRI) avec numérotation des sections, stratégies de recherche à l'index et exercices pour examen à livre ouvert."
        educationalLevel="Professional"
        teaches={['Carte des chapitres du CRI', 'Numérotation des sections', 'Recherche à l\'index', 'Examen à livre ouvert']}
        resourceType="Guide"
      />
    </>
  );
}
