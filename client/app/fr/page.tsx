import type { Metadata } from 'next';
import { BreadcrumbListJsonLd, FAQPageJsonLd, LearningResourceJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import FrenchLandingPage from '@/components/marketing/FrenchLandingPage';

export const metadata: Metadata = {
  title: 'Préparation aux examens ICC — Inspect Practice | Inspecteur en bâtiment',
  description:
    "Préparez-vous aux examens ICC avec Inspect Practice. Certifications B1, B2, E1, P1 & M1. Navigation dans les codes à livre ouvert, plus de 2 500 questions d'entraînement.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr',
    languages: {
      en: 'https://inspectpractice.com',
      fr: 'https://inspectpractice.com/fr',
    },
  },
  openGraph: {
    title: 'Préparation aux examens ICC — Inspect Practice | Inspecteur en bâtiment',
    description:
      "Plateforme de préparation aux examens d'inspecteur en bâtiment ICC. Certifications B1, B2, E1, P1 & M1. Navigation dans les codes CRI/IBC/NEC/IPC/IMC à livre ouvert.",
    url: 'https://inspectpractice.com/fr',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice — Préparation aux examens ICC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Préparation aux examens ICC — Inspect Practice',
    description:
      "Plateforme de préparation aux examens d'inspecteur en bâtiment ICC avec apprentissage adaptatif par IA.",
    images: ['https://inspectpractice.com/images/og/home.jpg'],
  },
  other: {
    'article:published_time': '2025-01-01',
    'article:modified_time': '2026-08-18',
  },
};

export default function FrenchRootPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
        ]}
      />
      <FAQPageJsonLd
        questions={[
          {
            question: "Comment obtenir une certification d'inspecteur en bâtiment ICC ?",
            answer: "Pour obtenir une certification ICC, vous devez choisir votre certification (B1 — résidentiel/CRI, B2 — commercial/IBC, E1 — électricité/NEC, P1 — plomberie/IPC, M1 — mécanique/IMC), vous procurer l'édition en vigueur du code, maîtriser la navigation dans le code, puis vous inscrire à l'examen auprès de l'International Code Council. Inspect Practice offre des questions d'entraînement adaptatives couvrant les cinq certifications.",
          },
          {
            question: "Quelle est la différence entre les certifications ICC B1, B2, E1, P1 et M1 ?",
            answer: "B1 (Inspecteur en bâtiment résidentiel) couvre les habitations unifamiliales et bifamiliales selon le Code résidentiel international (CRI/IRC). B2 (Inspecteur en bâtiment commercial) couvre les bâtiments commerciaux selon le Code international du bâtiment (IBC). E1 couvre l'électricité résidentielle (NEC + chapitres électriques du CRI), P1 la plomberie résidentielle (IPC + chapitres plomberie du CRI) et M1 la mécanique résidentielle (IMC + chapitres mécanique du CRI).",
          },
          {
            question: "Les examens ICC sont-ils à livre ouvert ?",
            answer: "Oui. Tous les examens d'inspecteur ICC sont à livre ouvert : vous apportez l'édition en vigueur du code applicable et vous êtes évalué sur votre capacité à trouver et appliquer ses exigences. La réussite dépend de la navigation dans le code — connaître le chapitre de chaque système, utiliser l'index efficacement et lire les sections avec leurs exceptions.",
          },
          {
            question: "Combien de temps faut-il pour obtenir une certification ICC ?",
            answer: "La plupart des candidats réussissent leur première certification (généralement B1) en 4 à 8 semaines de préparation ciblée. Aucun diplôme n'est exigé et vous pouvez vous inscrire directement à l'examen auprès de l'International Code Council.",
          },
          {
            question: "Quelle est la note de passage des examens ICC ?",
            answer: "La plupart des examens de certification d'inspecteur ICC exigent une note de passage de 75 %. Par exemple, l'examen B1 comporte 60 questions avec une limite de 2 heures, et il faut 45 bonnes réponses pour réussir. Vérifiez toujours les chiffres exacts dans le bulletin d'examen ICC officiel.",
          },
          {
            question: "Puis-je étudier pour l'examen ICC en ligne ?",
            answer: "Oui ! Inspect Practice est entièrement optimisé pour les navigateurs mobiles et de bureau. Vous pouvez vous entraîner avec des questions de style ICC à livre ouvert qui citent la section exacte du code, faire des simulations chronométrées, et bénéficier d'un apprentissage adaptatif par IA qui cible vos points faibles.",
          },
        ]}
      />
      <HowToJsonLd
        name="Comment obtenir votre certification ICC d'inspecteur en bâtiment"
        description="Guide étape par étape pour devenir inspecteur en bâtiment certifié ICC aux États-Unis."
        totalTime="P2M"
        steps={[
          { name: 'Choisissez votre certification', text: 'Sélectionnez votre parcours : B1 (résidentiel, CRI), B2 (commercial, IBC), E1 (électricité, NEC), P1 (plomberie, IPC) ou M1 (mécanique, IMC).' },
          { name: 'Procurez-vous le code', text: "Achetez l'édition en vigueur du code applicable (par ex. le CRI 2024 pour B1) spécifiée dans le bulletin d'examen ICC officiel." },
          { name: 'Apprenez la navigation dans le code', text: "Parce que l'examen est à livre ouvert, maîtrisez la carte des chapitres, la numérotation des sections et les stratégies de recherche à l'index avant de vous entraîner." },
          { name: 'Entraînez-vous avec des questions de style examen', text: "Répondez à des questions pratiques avec le code ouvert, révisez chaque explication et sa référence, et faites des simulations complètes chronométrées." },
          { name: 'Inscrivez-vous à l\'examen', text: "Inscrivez-vous auprès de l'ICC et passez l'examen dans un centre d'examen informatisé ou en télésurveillance." },
          { name: 'Réussissez et ajoutez des certifications', text: 'Réussissez avec 75 % ou plus, puis élargissez votre profil — les candidats B1 enchaînent souvent avec B2, E1, P1 et M1.' },
        ]}
      />
      <LearningResourceJsonLd
        name="Guide des certifications ICC d'inspecteur en bâtiment"
        description="Guide complet des certifications ICC aux États-Unis. Couvre B1, B2, E1, P1 et M1, les codes internationaux, les examens à livre ouvert et les parcours professionnels."
        educationalLevel="Professional"
        teaches={['Certification ICC B1', 'Certification ICC B2', 'Certification ICC E1', 'Certification ICC P1', 'Certification ICC M1', 'Codes internationaux']}
        resourceType="Guide"
      />
      <FrenchLandingPage />
    </>
  );
}
