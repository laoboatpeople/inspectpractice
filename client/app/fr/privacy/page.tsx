import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Inspect Practice',
  description:
    "Politique de confidentialité de Inspect Practice. Découvrez comment nous protégeons vos informations sur notre plateforme de préparation aux examens ICC.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/privacy',
    languages: {
      en: 'https://inspectpractice.com/privacy',
      fr: 'https://inspectpractice.com/fr/privacy',
    },
  },
  openGraph: {
    title: 'Politique de confidentialité — Inspect Practice',
    description:
      'Politique de confidentialité de Inspect Practice. Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles.',
    url: 'https://inspectpractice.com/fr/privacy',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Politique de confidentialité Inspect Practice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politique de confidentialité — Inspect Practice',
    description:
      'Politique de confidentialité de Inspect Practice. Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles.',
    images: ['https://inspectpractice.com/images/og/home.jpg'],
  },
};

const content = [
  'Chez Inspect Practice (« nous », « notre » ou « nos »), nous prenons votre vie privée au sérieux. La présente politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site Web et utilisez notre application web de préparation aux examens de certification d\'inspecteur en bâtiment (ICC).',
  '**Informations que nous collectons :** Nous recueillons les informations personnelles que vous fournissez directement, telles que votre nom, votre adresse courriel et vos informations de paiement lorsque vous créez un compte ou vous abonnez à nos services. Nous collectons également automatiquement certaines informations lorsque vous utilisez notre plateforme, notamment les données relatives à l\'appareil, l\'adresse IP, le type de navigateur et les données d\'utilisation telles que les tentatives d\'examen, les scores et les habitudes d\'étude.',
  '**Comment nous utilisons vos informations :** Nous utilisons vos informations pour fournir, maintenir et améliorer nos services de préparation aux examens ICC ; pour traiter les transactions et gérer votre abonnement ; pour vous envoyer des avis techniques, des mises à jour et des messages d\'assistance ; pour surveiller et analyser les tendances d\'utilisation ; et pour personnaliser votre expérience d\'apprentissage.',
  '**Partage et divulgation des données :** Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos données avec des fournisseurs de services tiers de confiance qui nous aident à exploiter notre plateforme (tels que les processeurs de paiement et les fournisseurs d\'hébergement infonuagique), si la loi l\'exige, ou pour protéger nos droits et la sécurité de nos utilisateurs.',
  '**Sécurité des données :** Nous mettons en œuvre des mesures de sécurité conformes aux normes de l\'industrie, notamment le chiffrement en transit (TLS 1.3) et au repos, l\'authentification sécurisée et des audits de sécurité réguliers pour protéger vos informations personnelles. Cependant, aucune méthode de transmission sur Internet n\'est sécurisée à 100 %.',
  '**Vos droits :** Selon votre juridiction, vous pouvez avoir le droit d\'accéder à vos données personnelles, de les corriger, de les supprimer ou de les transférer. Vous pouvez gérer les paramètres de votre compte ou nous contacter à privacy@inspectpractice.com pour exercer ces droits.',
  '**Conservation :** Nous conservons vos informations personnelles aussi longtemps que votre compte est actif ou selon les besoins pour vous fournir des services, et pendant une période raisonnable par la suite à des fins commerciales légitimes ou selon les exigences de la loi.',
  '**Témoins :** Nous utilisons des témoins essentiels pour l\'authentification et la sécurité, des témoins analytiques pour comprendre l\'utilisation de la plateforme et des témoins fonctionnels pour mémoriser vos préférences. Vous pouvez contrôler les paramètres des témoins via votre navigateur.',
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

export default function FrenchPrivacyPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Politique de confidentialité', url: 'https://inspectpractice.com/fr/privacy' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A]">
        {/* Simple nav */}
        <nav className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/fr" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-8 w-auto" />
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
              Politique de confidentialité
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
