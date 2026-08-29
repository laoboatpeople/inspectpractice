import { FAQPageJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: 'FAQ — Préparation aux examens ICC | Inspect Practice',
  description:
    "Questions fréquentes sur les certifications d'inspecteur en bâtiment ICC, la plateforme Inspect Practice, les tarifs, et notre préparation aux examens par IA.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/faq',
    languages: {
      en: 'https://inspectpractice.com/faq',
      fr: 'https://inspectpractice.com/fr/faq',
    },
  },
  openGraph: {
    title: 'FAQ Inspect Practice — Préparation aux examens ICC',
    description:
      "Trouvez des réponses à vos questions sur les certifications ICC B1/B2/E1/P1/M1, la navigation dans les codes, et notre plateforme d'étude adaptative par IA.",
    url: 'https://inspectpractice.com/fr/faq',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/faq.jpg',
        width: 1200,
        height: 630,
        alt: 'FAQ Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ Inspect Practice — Préparation aux examens ICC',
    description:
      "Trouvez des réponses à vos questions sur les certifications ICC et notre plateforme d'étude adaptative par IA.",
    images: ['https://inspectpractice.com/images/og/faq.jpg'],
  },
  other: {
    'article:published_time': '2025-01-15',
    'article:modified_time': '2026-08-18',
  },
};

const faqs = [
  {
    question: "Qu'est-ce que Inspect Practice ?",
    answer:
      "Inspect Practice est une plateforme d'étude web propulsée par IA, conçue pour aider les inspecteurs en bâtiment à se préparer aux examens de certification de l'International Code Council (ICC). Elle couvre B1 (Inspecteur en bâtiment résidentiel — CRI/IRC), B2 (Inspecteur en bâtiment commercial — IBC), E1 (Inspecteur en électricité résidentielle — NEC), P1 (Inspecteur en plomberie résidentielle — IPC) et M1 (Inspecteur en mécanique résidentielle — IMC) avec difficulté adaptative, simulations d'examens à livre ouvert et explications avec références aux codes.",
  },
  {
    question: 'Quelles certifications ICC sont couvertes par Inspect Practice ?',
    answer:
      "Inspect Practice couvre les cinq certifications d'inspecteur en bâtiment ICC : B1 (CRI — habitations unifamiliales et bifamiliales), B2 (IBC — bâtiments commerciaux), E1 (NEC + chapitres électriques du CRI), P1 (IPC + chapitres plomberie du CRI) et M1 (IMC + chapitres mécanique du CRI).",
  },
  {
    question: 'Les examens ICC sont-ils à livre ouvert ?',
    answer:
      "Oui. Tous les examens de certification d'inspecteur ICC sont à livre ouvert et à choix multiples. Vous apportez l'édition en vigueur du code applicable et vous êtes évalué sur votre capacité à trouver et appliquer ses exigences. La réussite dépend de la navigation dans le code — connaître le chapitre de chaque système, utiliser l'index efficacement et lire les sections avec leurs exceptions. Les questions d'Inspect Practice sont conçues pour développer exactement cette compétence.",
  },
  {
    question: 'Comment fonctionne la difficulté adaptative par IA ?',
    answer:
      "Inspect Practice ajuste le niveau de difficulté des questions selon votre performance. Obtenez 80 % ou plus à une série de questions, et le système augmente la difficulté (FACILE → MOYEN → DIFFICILE). Obtenez moins de 50 %, et la difficulté diminue. Cela garantit que vous étudiez toujours au niveau optimal pour maximiser votre apprentissage.",
  },
  {
    question: 'Est-ce que Inspect Practice est disponible sur mobile ?',
    answer:
      "Inspect Practice est une application web optimisée pour les navigateurs mobiles et de bureau. Vous pouvez étudier partout, à tout moment depuis votre téléphone, votre tablette ou votre ordinateur — sans téléchargement d'application. Le design adaptatif s'ajuste à toutes les tailles d'écran.",
  },
  {
    question: "Qu'est-ce que le Tuteur IA et comment fonctionne-t-il ?",
    answer:
      "Le Tuteur IA est une fonction de clavardage interactive qui vous aide à comprendre les exigences complexes des codes. Lorsque vous rencontrez une question que vous ne comprenez pas, vous pouvez demander au Tuteur IA une explication simplifiée. Il utilise l'intelligence artificielle pour décomposer les exigences des codes en réponses claires, en citant les sections pertinentes.",
  },
  {
    question: 'Quels sont les forfaits disponibles ?',
    answer:
      "Inspect Practice offre quatre forfaits : GRATUIT (accès limité à une catégorie d'examen), MENSUEL (29,99 $ par mois avec accès complet à tous les examens et fonctionnalités), ANNUEL (99 $ par an — 2 mois gratuits vs Mensuel) et À VIE (199 $ — paiement unique pour un accès permanent à tout le contenu actuel et futur).",
  },
  {
    question: 'Combien de questions y a-t-il dans la banque de questions ?',
    answer:
      "Inspect Practice comprend une banque de plus de 2 500 questions couvrant B1, B2, E1, P1 et M1. Les questions sont basées sur des scénarios avec des références exactes aux codes (numéros de section R du CRI, articles du NEC, chapitres de l'IPC/IMC). De nouvelles questions sont ajoutées régulièrement et mises à jour pour rester alignées sur les éditions en vigueur des codes.",
  },
  {
    question: "Qu'est-ce qui est couvert dans la certification B1 (Inspecteur en bâtiment résidentiel) ?",
    answer:
      "La certification B1 couvre les habitations unifamiliales et bifamiliales et les maisons de ville de trois étages au plus, selon le Code résidentiel international (CRI/IRC). La banque de questions couvre l'administration du code, la planification du bâtiment, les fondations, les planchers, la construction des murs, les revêtements, la construction toit-plafond, les toitures, les cheminées et foyers, et l'efficacité énergétique.",
  },
  {
    question: "Qu'est-ce qui est couvert dans la certification B2 (Inspecteur en bâtiment commercial) ?",
    answer:
      "La certification B2 couvre les bâtiments commerciaux selon le Code international du bâtiment (IBC). La banque de questions couvre la classification des usages, les types de construction, les systèmes de protection incendie, les issues de secours, l'accessibilité et les dispositions structurelles.",
  },
  {
    question: "Qu'est-ce qui est couvert dans E1, P1 et M1 ?",
    answer:
      "E1 (Inspecteur en électricité résidentielle) couvre le Code national de l'électricité plus les chapitres électriques du CRI : services, dérivations, méthodes de câblage, mise à la terre et liaison équipotentielle. P1 (Inspecteur en plomberie résidentielle) couvre l'IPC plus les chapitres plomberie du CRI : appareils sanitaires, alimentation en eau, drainage et éventage. M1 (Inspecteur en mécanique résidentielle) couvre l'IMC plus les chapitres mécanique du CRI : équipements CVC, conduits, air de combustion et ventilation.",
  },
  {
    question: 'Quelle certification choisir — B1, B2, E1, P1 ou M1 ?',
    answer:
      "La plupart des inspecteurs commencent par B1 (Inspecteur en bâtiment résidentiel), la porte d'entrée des carrières en inspection résidentielle. Ensuite, B2 ajoute le travail commercial, tandis que E1, P1 et M1 ajoutent des titres de compétences de métier (électricité, plomberie et mécanique). Le bon choix dépend de votre juridiction et de vos objectifs de carrière — de nombreux inspecteurs construisent un portfolio de certifications au fil du temps. Inspect Practice couvre les cinq pour que vous puissiez étudier plusieurs certifications sur une seule plateforme.",
  },
  {
    question: 'Puis-je suivre ma progression à travers les examens ?',
    answer:
      "Oui, Inspect Practice fournit des analyses détaillées incluant la précision par chapitre du code, la progression de la difficulté, l'historique des examens et les tendances de performance. Cela vous aide à identifier vos points faibles et à concentrer votre temps d'étude efficacement.",
  },
  {
    question: 'Comment commencer avec Inspect Practice ?',
    answer:
      "Visitez inspectpractice.com pour commencer. Créez un compte gratuit, choisissez le forfait GRATUIT pour essayer la plateforme, et passez au forfait MENSUEL, ANNUEL ou À VIE lorsque vous êtes prêt pour un accès complet.",
  },
];

export default function FrenchFAQPage() {
  return (
    <>
      <FAQPageJsonLd questions={faqs} />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'FAQ', url: 'https://inspectpractice.com/fr/faq' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
        {/* Nav */}
        <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/fr" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
              <span className="font-bold text-lg">Inspect Practice</span>
            </a>
            <a
              href="/fr"
              className="text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              ← Retour à l&rsquo;accueil
            </a>
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
          <h1 className="text-4xl font-bold mb-4">
            Foire aux questions — Examens ICC
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl">
            Tout ce que vous devez savoir sur Inspect Practice, la préparation aux
            certifications ICC, et comment fonctionne notre plateforme propulsée par IA.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-0 divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-6 cursor-pointer">
              <summary className="flex items-start justify-between gap-4 list-none">
                <h2 className="text-lg font-medium text-[#F8FAFC] group-hover:text-[#C8102E] transition-colors">
                  {faq.question}
                </h2>
                <svg
                  className="w-5 h-5 text-[#64748B] mt-1 shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-[#94A3B8] leading-relaxed max-w-3xl">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Plateformes d'étude connexes */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <RelatedStudyPlatforms />
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="border-t border-white/5 pt-16 text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">
              Encore des questions ?
            </h2>
            <p className="text-[#94A3B8] mb-6">
              Notre équipe est là pour vous accompagner dans votre parcours de certification.
            </p>
            <a
              href="/fr/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
            >
              Contactez-nous
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
