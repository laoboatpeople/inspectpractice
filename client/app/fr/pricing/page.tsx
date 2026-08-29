import { FAQPageJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs — Préparation aux examens ICC Inspect Practice',
  description:
    "Forfait Inspect Practice : Gratuit, Mensuel 29,99 $/mois ou À vie 199 $. Commencez votre préparation ICC dès aujourd'hui.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/pricing',
    languages: {
      en: 'https://inspectpractice.com/pricing',
      fr: 'https://inspectpractice.com/fr/pricing',
    },
  },
  openGraph: {
    title: 'Tarifs — Préparation aux examens ICC Inspect Practice',
    description:
      'Forfaits flexibles pour la préparation aux examens ICC : Gratuit, Mensuel 29,99 $/mois ou À vie 199 $. Étude assistée par IA avec plus de 2 500 questions.',
    url: 'https://inspectpractice.com/fr/pricing',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'Forfaits de tarification Inspect Practice pour la préparation aux examens ICC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarifs — Préparation aux examens ICC Inspect Practice',
    description:
      'Forfaits flexibles : Gratuit, Mensuel 29,99 $/mois ou À vie 199 $. Étude par IA avec plus de 2 500 questions.',
    images: ['https://inspectpractice.com/images/og/pricing.jpg'],
  },
  other: {
    'article:published_time': '2025-01-15',
    'article:modified_time': '2026-05-18',
  },
};

const plans = [
  {
    name: 'Gratuit',
    price: '0 $',
    period: 'à jamais',
    description: 'Essayez avant de vous engager. Découvrez la plateforme avec un accès limité.',
    features: [
      { included: true, text: '1 catégorie d\'examen' },
      { included: true, text: 'Statistiques de progression de base' },
      { included: true, text: 'Banque de questions limitée' },
      { included: false, text: 'Toutes les catégories d\'examen' },
      { included: false, text: 'Difficulté adaptative par IA' },
      { included: false, text: 'Examens pratiques illimités' },
      { included: true, text: '50 messages avec le tuteur IA' },
      { included: false, text: 'Analyses détaillées' },
      { included: false, text: 'Support prioritaire' },
    ],
    cta: 'Commencer gratuitement',
    highlighted: false,
  },
  {
    name: 'Mensuel',
    price: '29,99 $',
    period: '/mois',
    description: 'Accès complet à tout ce que Inspect Practice offre. Annulez à tout moment.',
    features: [
      { included: true, text: 'Toutes les catégories d\'examen' },
      { included: true, text: 'Difficulté adaptative par IA' },
      { included: true, text: 'Examens pratiques illimités' },
      { included: true, text: 'Tuteur IA illimité' },
      { included: true, text: 'Analyses détaillées' },
      { included: true, text: 'Banque complète de questions (2 500+)' },
      { included: true, text: 'Suivi de la progression' },
      { included: false, text: 'Mises à jour à vie' },
    ],
    cta: 'Commencer Mensuel',
    highlighted: false,
  },
  {
    name: 'À vie',
    price: '199 $',
    period: 'unique',
    description: 'Payez une fois, possédez pour toujours. Meilleur rapport qualité-prix pour les candidats ICC sérieux.',
    features: [
      { included: true, text: 'Toutes les catégories d\'examen' },
      { included: true, text: 'Difficulté adaptative par IA' },
      { included: true, text: 'Examens pratiques illimités' },
      { included: true, text: 'Tuteur IA illimité' },
      { included: true, text: 'Analyses détaillées' },
      { included: true, text: 'Banque complète de questions (2 500+)' },
      { included: true, text: 'Suivi de la progression' },
      { included: true, text: 'Toutes les mises à jour futures' },
    ],
    cta: 'Obtenir l\u2019accès à vie',
    highlighted: true,
  },
];

const pricingFaqs = [
  {
    question: 'Puis-je changer de forfait plus tard ?',
    answer:
      'Oui. Vous pouvez passer de Gratuit à Mensuel ou À vie à tout moment. Si vous êtes Mensuel et décidez de passer À vie, vous pouvez effectuer la mise à niveau en ne payant que la différence. Vos progrès et données sont conservés lors de tout changement de forfait.',
  },
  {
    question: 'Existe-t-il un essai gratuit pour les forfaits payants ?',
    answer:
      'Le forfait Gratuit est notre essai. Vous pouvez l\'utiliser indéfiniment avec accès à une catégorie d\'examen et aux fonctionnalités de base. Lorsque vous êtes prêt pour un accès complet, passez à Mensuel ou À vie. Aucune carte de crédit n\'est requise pour commencer avec le forfait Gratuit.',
  },
  {
    question: 'Quels modes de paiement sont acceptés ?',
    answer:
      'Nous acceptons toutes les principales cartes de crédit (Visa, Mastercard, American Express) et les cartes de débit. Tous les paiements sont traités de manière sécurisée via notre fournisseur de paiement. Les informations de votre carte ne sont jamais stockées sur nos serveurs.',
  },
  {
    question: 'Puis-je obtenir un remboursement ?',
    answer:
      'Oui. Si vous n\'êtes pas satisfait de Inspect Practice, contactez-nous dans les 14 jours suivant votre achat pour un remboursement complet. Nous croyons en notre plateforme et voulons que vous soyez confiant dans votre investissement.',
  },
  {
    question: 'Le forfait À vie inclut-il toutes les mises à jour futures ?',
    answer:
      'Oui. Le forfait À vie inclut tout le contenu actuel et toutes les mises à jour futures. Au fur et à mesure que nous ajoutons de nouvelles questions, fonctionnalités et catégories d\'examen, votre accès À vie couvre tout. C\'est le meilleur rapport qualité-prix pour les candidats qui prévoient étudier sur une période prolongée.',
  },
  {
    question: 'Y a-t-il une réduction pour les étudiants ou les groupes ?',
    answer:
      'Nous offrons occasionnellement des tarifs promotionnels. Contactez-nous si vous représentez un établissement d\'enseignement ou un groupe d\'étudiants — nous pouvons discuter de tarifs personnalisés pour des licences en gros ou institutionnelles.',
  },
];

export default function PricingPage() {
  return (
    <>
      <FAQPageJsonLd questions={pricingFaqs} />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Tarifs', url: 'https://inspectpractice.com/fr/pricing' },
        ]}
      />
      <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
        {/* Nav */}
        <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/fr/" className="flex items-center gap-2">
              <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
              <span className="font-bold text-lg">Inspect Practice</span>
            </a>
            <a href="/fr/" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
              ← Retour à l&apos;accueil
            </a>
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-16">
            <span className="text-[11px] font-medium text-[#C8102E] bg-[#C8102E]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Tarifs
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
              Des tarifs simples et transparents
            </h1>
            <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
              Commencez gratuitement, passez à un forfait supérieur quand vous êtes prêt. Pas de frais cachés, pas de surprises.
              Chaque forfait vous donne accès à la plateforme de préparation aux examens ICC propulsée par l&apos;IA de Inspect Practice.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-[#C8102E]/10 to-[#4C7FBF]/10 border-2 border-[#C8102E]/40'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider px-4 py-1 rounded-full border border-white/20 bg-white/[0.04] text-white/70 backdrop-blur-sm">
                      🏆 Meilleur rapport qualité-prix
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-[#94A3B8]">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-[#94A3B8]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={feature.included ? 'text-[#CBD5E1]' : 'text-[#64748B] line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/auth/login"
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg text-sm font-medium transition-colors bg-[#C8102E] hover:bg-[#2563EB] text-white"
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-10">Comparer les forfaits en détail</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 pr-6 text-sm font-medium text-[#94A3B8]">Fonctionnalité</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#94A3B8]">Gratuit</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#C8102E]">Mensuel</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#94A3B8]">À vie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { feature: 'Catégories d\'examen', free: '1', monthly: 'Toutes', lifetime: 'Toutes' },
                    { feature: 'Accès à la banque de questions', free: 'Limitée', monthly: '2 500+', lifetime: '2 500+' },
                    { feature: 'Difficulté adaptative par IA', free: '—', monthly: '✓', lifetime: '✓' },
                    { feature: 'Examens pratiques illimités', free: '—', monthly: '✓', lifetime: '✓' },
                    { feature: 'Tuteur IA', free: '50 msg', monthly: 'Illimité', lifetime: 'Illimité' },
                    { feature: 'Analyses détaillées', free: 'De base', monthly: 'Complètes', lifetime: 'Complètes' },
                    { feature: 'Suivi de la progression', free: 'De base', monthly: 'Complet', lifetime: 'Complet' },
                    { feature: 'Support prioritaire', free: '—', monthly: '✓', lifetime: '✓' },
                    { feature: 'Mises à jour futures', free: '—', monthly: 'Pendant l\'abonnement', lifetime: '✓' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-6 text-sm text-[#CBD5E1]">{row.feature}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#94A3B8]">{row.free}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#F8FAFC]">{row.monthly}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#F8FAFC]">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-center mb-10">Questions fréquentes</h2>
            <div className="space-y-0 divide-y divide-white/5">
              {pricingFaqs.map((faq, i) => (
                <details key={i} className="group py-5 cursor-pointer">
                  <summary className="flex items-start justify-between gap-4 list-none">
                    <span className="text-base font-medium text-[#F8FAFC] group-hover:text-[#C8102E] transition-colors">
                      {faq.question}
                    </span>
                    <svg
                      className="w-5 h-5 text-[#64748B] mt-0.5 shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[#94A3B8] leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pb-20">
            <div className="bg-gradient-to-r from-[#C8102E]/10 to-[#4C7FBF]/10 rounded-2xl p-10">
              <h2 className="text-2xl font-bold mb-3">Encore indécis ?</h2>
              <p className="text-[#94A3B8] mb-6 max-w-xl mx-auto">
                Commencez avec le forfait Gratuit — aucune carte de crédit requise. Découvrez Inspect Practice
                par vous-même et passez à un forfait supérieur quand vous serez prêt.
              </p>
              <a
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
              >
                Commencer gratuitement
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
