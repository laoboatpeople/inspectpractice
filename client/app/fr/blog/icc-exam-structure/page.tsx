import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: "Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage — Inspect Practice",
  description:
    "Comparaison complète des 5 examens de certification ICC avec un tableau détaillé : nombre de questions, limites de temps et notes de passage pour B1, B2, E1, P1 et M1.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/icc-exam-structure',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-structure',
      fr: 'https://inspectpractice.com/fr/blog/icc-exam-structure',
    },
  },
  openGraph: {
    title: "Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage — Inspect Practice",
    description:
      "Comparaison complète des 5 examens de certification ICC avec un tableau détaillé : nombre de questions, limites de temps et notes de passage pour B1, B2, E1, P1 et M1.",
    url: 'https://inspectpractice.com/fr/blog/icc-exam-structure',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: 'Structure des examens ICC',
      },
    ],
  },
  twitter: {
    title: "Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage — Inspect Practice",
  },
  other: {
    'article:published_time': '2026-05-20',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStructurePage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage"
        description="Comparaison complète des 5 examens de certification ICC : nombre de questions, limites de temps, notes de passage et codes de référence pour B1, B2, E1, P1 et M1."
        datePublished="2026-05-20"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: 'Structure des examens ICC', url: 'https://inspectpractice.com/fr/blog/icc-exam-structure' },
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
              <a href="/blog/icc-exam-structure" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Examens</span>
              <span className="text-xs text-[#64748B]">20 mai 2026 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 14 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Structure des examens ICC : B1, B2, E1, P1 & M1 — questions, temps et notes de passage</h1>
            <p className="text-lg text-[#94A3B8]">
              Les cinq certifications d'inspecteur en bâtiment ICC sont des examens à choix multiples à livre
              ouvert — mais les détails diffèrent. Ce guide compare chaque examen côte à côte pour que vous
              sachiez exactement ce qui vous attend.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — données vérifiées contre les bulletins officiels</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Les cinq certifications en un coup d'œil</h2>
            <p>Tous les examens d'inspecteur ICC partagent la même formule : livre ouvert, choix multiples, 75 % pour réussir. Voici la comparaison complète :</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse my-6">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2 pr-4 text-[#F8FAFC]">Cert.</th>
                    <th className="py-2 pr-4 text-[#F8FAFC]">Portée</th>
                    <th className="py-2 pr-4 text-[#F8FAFC]">Code</th>
                    <th className="py-2 pr-4 text-[#F8FAFC]">Questions</th>
                    <th className="py-2 pr-4 text-[#F8FAFC]">Temps</th>
                    <th className="py-2 text-[#F8FAFC]">Passage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#F8FAFC]">B1</td>
                    <td className="py-2 pr-4">Inspecteur en bâtiment résidentiel</td>
                    <td className="py-2 pr-4">CRI</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 heures</td>
                    <td className="py-2">75 %</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#F8FAFC]">B2</td>
                    <td className="py-2 pr-4">Inspecteur en bâtiment commercial</td>
                    <td className="py-2 pr-4">IBC</td>
                    <td className="py-2 pr-4">80</td>
                    <td className="py-2 pr-4">3,5 heures</td>
                    <td className="py-2">75 %</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#F8FAFC]">E1</td>
                    <td className="py-2 pr-4">Inspecteur en électricité résidentielle</td>
                    <td className="py-2 pr-4">NEC + CRI</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 heures</td>
                    <td className="py-2">75 %</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#F8FAFC]">P1</td>
                    <td className="py-2 pr-4">Inspecteur en plomberie résidentielle</td>
                    <td className="py-2 pr-4">IPC + CRI</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 heures</td>
                    <td className="py-2">75 %</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-[#F8FAFC]">M1</td>
                    <td className="py-2 pr-4">Inspecteur en mécanique résidentielle</td>
                    <td className="py-2 pr-4">IMC + CRI</td>
                    <td className="py-2 pr-4">60</td>
                    <td className="py-2 pr-4">2 heures</td>
                    <td className="py-2">75 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <em>Note :</em> vérifiez les chiffres exacts dans le bulletin officiel ICC en vigueur pour votre
              certification et votre édition du code — l'ICC met parfois à jour les formats.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">B1 — Inspecteur en bâtiment résidentiel (CRI)</h2>
            <p>
              La certification d'entrée couvrant les habitations unifamiliales et bifamiliales et les maisons de
              ville de trois étages au plus. Le contenu suit le CRI : administration, planification, fondations,
              planchers, murs, revêtements, toitures, cheminées et efficacité énergétique. 60 questions en 2
              heures — environ 2 minutes par question.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">B2 — Inspecteur en bâtiment commercial (IBC)</h2>
            <p>
              La contrepartie commerciale, fondée sur le Code international du bâtiment. Le B2 est l'examen le
              plus long de la famille : 80 questions en 3,5 heures. Le contenu couvre la classification des
              usages, les types de construction, la protection incendie, les issues, l'accessibilité et les
              dispositions structurelles.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">E1 — Inspecteur en électricité résidentielle (NEC + CRI)</h2>
            <p>
              L'examen E1 teste le Code national de l'électricité ainsi que les chapitres électriques du CRI
              (Ch. 34–43). Attendez-vous à des questions sur les services, les dérivations, les méthodes de
              câblage, la mise à la terre et la protection contre les surintensités.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">P1 — Inspecteur en plomberie résidentielle (IPC + CRI)</h2>
            <p>
              L'examen P1 couvre le Code international de plomberie plus les chapitres plomberie du CRI (Ch.
              25–33) : appareils, alimentation en eau, drainage et ventilation, siphons et inspection des
              systèmes de plomberie.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">M1 — Inspecteur en mécanique résidentielle (IMC + CRI)</h2>
            <p>
              L'examen M1 couvre le Code international de mécanique plus les chapitres mécanique du CRI (Ch.
              12–24) : équipements de chauffage et de climatisation, conduits, air de combustion, ventilation et
              systèmes au gaz combustible.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Comment le format à livre ouvert change votre stratégie</h2>
            <p>
              Chacun de ces examens est à livre ouvert, votre préparation doit donc être axée sur la navigation :
              apprenez la carte des chapitres de votre code, entraînez la recherche à l'index et pratiquez avec
              des questions qui citent des sections exactes. Consultez notre{' '}
              <a href="/fr/blog/irc-study-guide" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                guide de navigation du CRI
              </a>{' '}
              et nos{' '}
              <a href="/fr/blog/icc-study-techniques" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                techniques d'étude à livre ouvert
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Structure des examens ICC : B1, B2, E1, P1 & M1"
        description="Comparaison côte à côte des cinq examens de certification ICC — nombre de questions, limites de temps, notes de passage et codes de référence."
        educationalLevel="Professional"
        teaches={['Examen ICC B1', 'Examen ICC B2', 'Examen ICC E1', 'Examen ICC P1', 'Examen ICC M1']}
        resourceType="Guide"
      />
    </>
  );
}
