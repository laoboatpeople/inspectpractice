import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: "Les 10 erreurs des candidats aux examens ICC (et comment les éviter) — Inspect Practice",
  description:
    "Les erreurs les plus courantes des candidats aux examens ICC — de l'ignorance du bulletin d'examen à la mémorisation au lieu de la navigation. Évitez ces pièges et réussissez du premier coup.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/icc-study-mistakes',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-study-mistakes',
      fr: 'https://inspectpractice.com/fr/blog/icc-study-mistakes',
    },
  },
  openGraph: {
    title: "Les 10 erreurs des candidats aux examens ICC (et comment les éviter) — Inspect Practice",
    description:
      "Les erreurs les plus courantes des candidats aux examens ICC — de l'ignorance du bulletin d'examen à la mémorisation au lieu de la navigation. Évitez ces pièges et réussissez du premier coup.",
    url: 'https://inspectpractice.com/fr/blog/icc-study-mistakes',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: "Erreurs aux examens ICC",
      },
    ],
  },
  twitter: {
    title: "Les 10 erreurs des candidats aux examens ICC (et comment les éviter) — Inspect Practice",
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccStudyMistakesPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Les 10 erreurs des candidats aux examens ICC (et comment les éviter)"
        description="Les erreurs les plus courantes des candidats aux examens ICC — de l'ignorance du bulletin d'examen à la mémorisation au lieu de la navigation dans les codes. Évitez ces pièges."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: "Les 10 erreurs des candidats aux examens ICC", url: 'https://inspectpractice.com/fr/blog/icc-study-mistakes' },
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
              <a href="/blog/icc-study-mistakes" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Stratégie d'examen</span>
              <span className="text-xs text-[#64748B]">22 mai 2026 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 9 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Les 10 erreurs des candidats aux examens ICC (et comment les éviter)</h1>
            <p className="text-lg text-[#94A3B8]">
              Chaque année, des inspecteurs qualifiés échouent aux examens ICC pour des raisons évitables. Voici
              les dix erreurs les plus courantes — et les correctifs simples qui transforment un échec de justesse
              en réussite confiante.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — pour réussir du premier coup</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">1. Étudier la mauvaise édition du code</h2>
            <p>
              Les examens ICC reposent sur une édition précise du code, indiquée dans le bulletin d'examen.
              Étudier le CRI 2021 alors que votre examen utilise l'édition 2024, c'est apprendre des sections qui
              ont peut-être changé. <strong>Correctif :</strong> téléchargez d'abord le bulletin officiel ICC et
              achetez exactement l'édition qu'il spécifie.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">2. Traiter un examen à livre ouvert comme un examen à livre fermé</h2>
            <p>
              Mémoriser le texte du code est l'erreur classique. L'examen récompense la <em>vitesse de
              navigation</em>, pas la mémoire. <strong>Correctif :</strong> entraînez-vous à trouver les sections —
              carte des chapitres d'abord, recherche à l'index ensuite, exercices chronométrés avec le code ouvert.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">3. Ignorer les domaines de contenu du bulletin</h2>
            <p>
              Le bulletin liste exactement ce qui est testé et le nombre de questions par domaine. Les candidats
              qui l'ignorent perdent des semaines sur du contenu à faible poids. <strong>Correctif :</strong>{' '}
              lisez le bulletin, cartographiez ses domaines et pondérez votre temps.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">4. Ne jamais faire de simulation complète chronométrée</h2>
            <p>
              Arriver à un examen de 2 heures et 60 questions sans avoir fait une seule répétition chronométrée,
              c'est voler sans instruments. <strong>Correctif :</strong> une simulation complète par semaine
              pendant le dernier mois — même durée, même limite de temps, code sous les yeux.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">5. Sauter le chapitre des définitions</h2>
            <p>
              Les chapitres de définitions du CRI et de l'IBC sont de l'or pur pour l'examen. Beaucoup de
              questions reposent sur un terme défini — « logement », « étage au-dessus du sol ».{' '}
              <strong>Correctif :</strong> lisez les définitions tôt et revenez-y en cas d'ambiguïté.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">6. Manquer les clauses « sauf »</h2>
            <p>
              Les exigences des codes sont pleines d'exceptions, et les questions d'examen les adorent. Les choix
              de réponse citent souvent la règle générale tandis que la bonne réponse applique l'exception.{' '}
              <strong>Correctif :</strong> lisez la section complète avec toutes les exceptions; encerclez
              « sauf » et « à moins que » dans la question.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">7. Sur-ongleter ou sous-ongleter le code</h2>
            <p>
              Trop d'onglets créent du bruit; trop peu coûtent du temps. <strong>Correctif :</strong> ongletez
              chaque chapitre, plus quelques sections à fort poids que vous cherchez souvent.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">8. Ne pas réviser les questions manquées</h2>
            <p>
              Les questions pratiques n'aident que si vous en tirez des leçons. Les candidats qui enchaînent les
              questions sans réviser répètent les mêmes erreurs. <strong>Correctif :</strong> révisez chaque échec
              et notez la référence au code.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">9. Étudier seul sans boucle de rétroaction</h2>
            <p>
              Sans retour d'information, vous ne savez pas si vous êtes prêt. <strong>Correctif :</strong>{' '}
              utilisez une plateforme avec analyses (comme Inspect Practice) pour suivre votre précision par
              chapitre, ou joignez un groupe d'étude.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">10. Bachoter la semaine avant l'examen</h2>
            <p>
              Le bachotage joue contre vous sur un examen à livre ouvert : il chasse la pratique de navigation qui
              détermine réellement votre score. <strong>Correctif :</strong> la dernière semaine, faites de courts
              exercices de recherche quotidiens et une simulation complète — puis reposez-vous.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Évitez ces erreurs avec les bons outils</h2>
            <p>
              Construisez votre plan avec notre{' '}
              <a href="/fr/blog/icc-exam-study-plan" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                plan d'étude ICC de 12 semaines
              </a>{' '}
              et commencez avec{' '}
              <a href="/fr/blog" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                des questions pratiques ICC gratuites
              </a>.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Les 10 erreurs des candidats aux examens ICC"
        description="Les erreurs les plus courantes aux examens ICC et comment les éviter — mauvaise édition du code, étude à livre fermé, exceptions manquées."
        educationalLevel="Professional"
        teaches={['Stratégie d\'examen ICC', 'Éviter les erreurs courantes', 'Navigation dans les codes', 'Simulations chronométrées']}
        resourceType="Guide"
      />
    </>
  );
}
