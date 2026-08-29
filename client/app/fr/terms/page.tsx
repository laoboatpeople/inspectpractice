import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Inspect Practice",
  description:
    "Conditions d'utilisation de Inspect Practice. Découvrez les modalités régissant l'utilisation de notre plateforme de préparation aux examens de certification d'inspecteur en bâtiment.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/terms',
    languages: {
      en: 'https://inspectpractice.com/terms',
      fr: 'https://inspectpractice.com/fr/terms',
    },
  },
  openGraph: {
    title: "Conditions d'utilisation — Inspect Practice",
    description:
      "Conditions d'utilisation de Inspect Practice. Découvrez les modalités régissant l'utilisation de notre plateforme de préparation aux examens ICC.",
    url: 'https://inspectpractice.com/fr/terms',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: "Conditions d'utilisation Inspect Practice",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Conditions d'utilisation — Inspect Practice",
    description:
      "Conditions d'utilisation de Inspect Practice. Découvrez les modalités régissant l'utilisation de notre plateforme de préparation aux examens ICC.",
    images: ['https://inspectpractice.com/images/og/home.jpg'],
  },
};

const content = [
  "Bienvenue sur Inspect Practice. En accédant ou en utilisant notre site Web et notre application mobile, vous acceptez d'être lié par les présentes conditions d'utilisation (« Conditions »). Si vous n'acceptez pas une partie quelconque de ces Conditions, vous ne devez pas utiliser nos services.",
  "**Utilisation du service :** Inspect Practice fournit une plateforme de préparation aux examens basée sur l'IA pour les candidats aux certifications d'inspecteur en bâtiment (B1, B2, E1, P1, M1) de l'International Code Council (ICC). Vous devez avoir au moins 18 ans ou avoir le consentement parental pour utiliser nos services. Vous êtes responsable de la confidentialité de vos identifiants de compte.",
  "**Abonnements et paiements :** Certaines fonctionnalités nécessitent un abonnement payant. Les frais sont facturés à l'avance sur une base mensuelle ou annuelle selon l'option choisie. Tous les frais sont non remboursables, sauf indication contraire expresse dans notre politique de remboursement. Nous nous réservons le droit de modifier nos prix avec un préavis de 30 jours. Le renouvellement automatique a lieu sauf en cas d'annulation avant la date de renouvellement.",
  "**Propriété intellectuelle :** Tout le contenu, les fonctionnalités et les caractéristiques de Inspect Practice — y compris les questions d'examen, les documents générés par l'IA, les analyses, l'interface utilisateur et les algorithmes propriétaires — sont la propriété de Inspect Practice et sont protégés par les lois américaines et internationales sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer, modifier ou créer des œuvres dérivées sans notre consentement écrit exprès.",
  "**Conduite de l'utilisateur :** Vous acceptez de ne pas partager vos identifiants de compte, tenter de contourner nos mesures de surveillance par IA, utiliser des outils automatisés ou des robots pour accéder à la plateforme, télécharger du code malveillant ou vous livrer à toute activité perturbant le service pour les autres utilisateurs. Toute violation peut entraîner la résiliation immédiate du compte.",
  "**Clause de non-garantie :** Inspect Practice est fourni « tel quel » sans garantie d'aucune sorte. Bien que nous nous efforcions d'assurer l'exactitude, le contenu des examens est fourni à des fins éducatives et ne garantit pas la réussite des examens de certification ICC. Nous ne sommes pas affiliés à l'International Code Council ni approuvés par celui-ci.",
  "**Limitation de responsabilité :** En aucun cas, Inspect Practice ne peut être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de ou liés à votre utilisation de la plateforme, y compris la perte de données, de temps d'étude ou de résultats d'examen.",
  "**Droit applicable :** Les présentes Conditions sont régies et interprétées conformément aux lois de la province de l'Ontario et aux lois fédérales du Canada qui y sont applicables. Tout litige sera résolu devant les tribunaux de l'Illinois.",
  "**Modifications des Conditions :** Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous informerons les utilisateurs des modifications importantes par courriel ou avis sur la plateforme. L'utilisation continue après les modifications constitue une acceptation des nouvelles Conditions.",
];

const renderContent = (text: string, index: number) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={index} className="text-[#94A3B8] leading-relaxed mb-4">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-[#F8FAFC] font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </p>
  );
};

export default function FrenchTermsPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: "Conditions d'utilisation", url: 'https://inspectpractice.com/fr/terms' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A]">
        {/* Simple nav */}
        <nav className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/fr" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Inspect Practice</span>
            </Link>
            <Link
              href="/fr"
              className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="prose prose-invert max-w-none">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C8102E]/10 border border-[#C8102E]/20 text-xs text-[#C8102E] font-medium">
                Dernière mise à jour : 15 mai 2026
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
              Conditions d'utilisation
            </h1>
            <div className="space-y-1">
              {content.map((paragraph: string, idx: number) =>
                renderContent(paragraph, idx),
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#94A3B8]">
              &copy; {new Date().getFullYear()} Inspect Practice. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/fr/privacy"
                className="text-sm text-[#94A3B8] hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/fr/terms"
                className="text-sm text-[#94A3B8] hover:text-white transition-colors"
              >
                Conditions
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
