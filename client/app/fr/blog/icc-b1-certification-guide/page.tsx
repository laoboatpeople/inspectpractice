import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel) — Inspect Practice',
  description:
    "Guide complet étape par étape pour obtenir votre certification ICC B1 d'inspecteur en bâtiment résidentiel. Admissibilité, examen à livre ouvert sur le CRI (IRC), stratégie d'étude et préparation.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/icc-b1-certification-guide',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-b1-certification-guide',
      fr: 'https://inspectpractice.com/fr/blog/icc-b1-certification-guide',
    },
  },
  openGraph: {
    title: 'Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel) — Inspect Practice',
    description:
      "Guide complet étape par étape pour obtenir votre certification ICC B1 d'inspecteur en bâtiment résidentiel. Admissibilité, examen à livre ouvert sur le CRI (IRC), stratégie d'étude.",
    url: 'https://inspectpractice.com/fr/blog/icc-b1-certification-guide',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'Guide de certification ICC B1',
      },
    ],
  },
  twitter: {
    title: 'Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel) — Inspect Practice',
  },
  other: {
    'article:published_time': '2025-03-15',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccB1CertificationGuidePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel)"
        description="Guide complet étape par étape pour obtenir votre certification ICC B1 d'inspecteur en bâtiment résidentiel. Admissibilité, format de l'examen à livre ouvert sur le CRI, stratégie d'étude."
        datePublished="2025-03-15"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: 'Comment obtenir votre certification ICC B1', url: 'https://inspectpractice.com/fr/blog/icc-b1-certification-guide' },
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
              <a href="/blog/icc-b1-certification-guide" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Certification</span>
              <span className="text-xs text-[#64748B]">15 mars 2025 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 10 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Comment obtenir votre certification ICC B1 (Inspecteur en bâtiment résidentiel)</h1>
            <p className="text-lg text-[#94A3B8]">
              La certification ICC B1 prouve que vous pouvez inspecter les maisons unifamiliales et bifamiliales
              conformément au Code résidentiel international (CRI/IRC). L'examen est à livre ouvert : la réussite
              dépend de votre capacité à trouver la bonne section rapidement. Ce guide couvre chaque étape.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — au service des inspecteurs en bâtiment depuis 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Qu'est-ce que la certification ICC B1 ?</h2>
            <p>
              La certification B1 de l'International Code Council (ICC) est la référence pour les inspecteurs en
              bâtiment résidentiel aux États-Unis. Les inspecteurs certifiés B1 sont habilités à effectuer la
              revue de plans et les inspections de chantier des habitations unifamiliales et bifamiliales, ainsi
              que des maisons de ville de trois étages au plus, en vérifiant la conformité au CRI (IRC).
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Étape 1 : Vérifier les conditions d'admissibilité</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Aucun diplôme exigé</strong> — les certifications ICC n'exigent pas de diplôme universitaire. Beaucoup d'inspecteurs viennent de la construction, de l'inspection immobilière ou du contrôle des bâtiments.</li>
              <li><strong>L'expérience aide mais n'est pas obligatoire</strong> — l'ICC recommande une expérience en inspection ou en construction, mais des candidats motivés réussissent avec une préparation ciblée.</li>
              <li><strong>Vérification d'expérience</strong> — certains employeurs demandent une expérience documentée; l'examen lui-même ne la conditionne pas.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Étape 2 : Comprendre le format de l'examen</h2>
            <p>L'examen B1 est un <strong>examen à choix multiples, à livre ouvert</strong> administré par l'ICC :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>60 questions</strong> tirées du Code résidentiel international (CRI) en vigueur.</li>
              <li><strong>2 heures (120 minutes)</strong> pour compléter l'examen.</li>
              <li><strong>Note de passage de 75 %</strong> — il faut 45 bonnes réponses sur 60.</li>
              <li><strong>Livre ouvert</strong> — vous pouvez apporter le CRI et les références approuvées. La vitesse de recherche est la véritable compétence évaluée.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Étape 3 : Maîtriser la navigation dans le code</h2>
            <p>L'examen B1 ne teste pas la mémorisation du CRI — il teste votre capacité à trouver la bonne section rapidement :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Apprenez la carte des chapitres.</strong> Chapitre 4 : fondations, chapitre 6 : murs, chapitre 9 : toitures. À la lecture d'une question, identifiez d'abord le chapitre.</li>
              <li><strong>Utilisez la table des matières et l'index.</strong> Entraînez-vous à chercher les termes dans l'index, puis à sauter directement à la section.</li>
              <li><strong>Comprenez la numérotation.</strong> Les sections du CRI suivent le modèle R + chapitre + section (R302, R403, R905).</li>
              <li><strong>Pratiquez les recherches minutées.</strong> À l'examen, vous disposez d'environ 2 minutes par question.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Étape 4 : Construire un plan d'étude fondé sur la pratique</h2>
            <p>
              Parce que l'examen est à livre ouvert, la lecture passive est la méthode la moins efficace. Le
              chemin le plus rapide passe par des questions d'entraînement qui vous forcent à ouvrir le code :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Commencez par un quiz diagnostique</strong> pour identifier vos chapitres faibles.</li>
              <li><strong>Entraînez-vous chapitre par chapitre</strong>, en commençant par les fondations, les murs et les toitures.</li>
              <li><strong>Faites des simulations complètes chronométrées</strong> dans les conditions réelles (60 questions, 120 minutes, code ouvert).</li>
              <li><strong>Révisez chaque explication</strong>, surtout la référence au code — c'est ainsi que se construit la carte mentale.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Étape 5 : S'inscrire et passer l'examen</h2>
            <p>
              Inscrivez-vous à l'examen B1 auprès de l'ICC, dans un centre d'examen informatisé ou en télésurveillance.
              Apportez l'édition en vigueur du CRI. Le jour J : gérez votre rythme (2 minutes par question), lisez
              chaque question deux fois — les questions ICC reposent souvent sur un mot qualificatif (« minimum »,
              « maximum », « non protégé ») — et faites confiance à votre navigation.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Combien de temps faut-il pour obtenir le B1 ?</h2>
            <p>
              La plupart des candidats réussissent le B1 en <strong>4 à 8 semaines</strong> de préparation ciblée,
              à raison de 45 à 60 minutes par jour. Les candidats issus de la construction ou de l'inspection
              immobilière ont souvent besoin de moins de temps.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Après le B1 : votre parcours de certification</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>B2 — Inspecteur en bâtiment commercial</strong> (Code international du bâtiment, IBC)</li>
              <li><strong>E1 — Inspecteur en électricité résidentielle</strong> (NEC + chapitres électriques du CRI)</li>
              <li><strong>P1 — Inspecteur en plomberie résidentielle</strong> (IPC + chapitres plomberie du CRI)</li>
              <li><strong>M1 — Inspecteur en mécanique résidentielle</strong> (IMC + chapitres mécanique du CRI)</li>
            </ul>
            <p>
              Inspect Practice couvre les cinq certifications avec des questions d'entraînement alignées sur les
              codes. Pour le guide de navigation du CRI, voir{' '}
              <a href="/fr/blog/irc-study-guide" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                notre guide d'étude du CRI
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Guide de la certification ICC B1 — Inspecteur en bâtiment résidentiel"
        description="Guide complet de la certification ICC B1 : CRI, format de l'examen à livre ouvert, admissibilité, stratégie d'étude et préparation."
        educationalLevel="Professional"
        teaches={['Certification ICC B1', 'Navigation dans le CRI', 'Inspection résidentielle', "Stratégie d'examen à livre ouvert"]}
        resourceType="Guide"
      />
    </>
  );
}
