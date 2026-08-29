import { BlogPostingJsonLd, BreadcrumbListJsonLd, LearningResourceJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import type { Metadata } from 'next';
import RelatedStudyPlatforms from '@/components/marketing/RelatedStudyPlatforms';

export const metadata: Metadata = {
  title: "Plan d'étude ICC de 12 semaines : un calendrier étape par étape — Inspect Practice",
  description:
    "Un plan d'étude éprouvé de 12 semaines pour les examens de certification ICC (B1, B2, E1, P1, M1). Calendrier semaine par semaine : navigation dans les codes, questions pratiques et simulations chronométrées.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/blog/icc-exam-study-plan',
    languages: {
      en: 'https://inspectpractice.com/blog/icc-exam-study-plan',
      fr: 'https://inspectpractice.com/fr/blog/icc-exam-study-plan',
    },
  },
  openGraph: {
    title: "Plan d'étude ICC de 12 semaines : un calendrier étape par étape — Inspect Practice",
    description:
      "Un plan d'étude éprouvé de 12 semaines pour les examens de certification ICC (B1, B2, E1, P1, M1). Calendrier semaine par semaine : navigation dans les codes, questions pratiques et simulations chronométrées.",
    url: 'https://inspectpractice.com/fr/blog/icc-exam-study-plan',
    type: 'article',
    locale: 'fr_CA',
    images: [
      {
        url: 'https://inspectpractice.com/images/blog/ame-license-canada.jpg',
        width: 1200,
        height: 630,
        alt: "Plan d'étude ICC de 12 semaines",
      },
    ],
  },
  twitter: {
    title: "Plan d'étude ICC de 12 semaines : un calendrier étape par étape — Inspect Practice",
  },
  other: {
    'article:published_time': '2026-05-22',
    'article:modified_time': '2026-08-18',
  },
};

export default function IccExamStudyPlanPage() {
  return (
    <>
      <BlogPostingJsonLd
        headline="Plan d'étude ICC de 12 semaines : un calendrier étape par étape"
        description="Un plan d'étude éprouvé de 12 semaines pour les examens ICC. Calendrier semaine par semaine : carte du code, exercices par chapitre et simulations chronométrées pour B1, B2, E1, P1 et M1."
        datePublished="2026-05-22"
        dateModified="2026-08-18"
        image={["https://inspectpractice.com/images/blog/ame-license-canada.jpg"]}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Accueil', url: 'https://inspectpractice.com/fr' },
          { name: 'Blog', url: 'https://inspectpractice.com/fr/blog' },
          { name: "Plan d'étude ICC de 12 semaines", url: 'https://inspectpractice.com/fr/blog/icc-exam-study-plan' },
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
              <a href="/blog/icc-exam-study-plan" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors">EN</a>
            </div>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">Plan d'étude</span>
              <span className="text-xs text-[#64748B]">22 mai 2026 *mis à jour le 18 août 2026</span>
              <span className="text-xs text-[#64748B]">· 11 min de lecture</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Plan d'étude ICC de 12 semaines : un calendrier étape par étape</h1>
            <p className="text-lg text-[#94A3B8]">
              Douze semaines est la durée idéale pour la préparation aux certifications ICC : assez de temps pour
              maîtriser la carte du code, assez court pour rester concentré. Ce plan fonctionne pour B1, B2, E1,
              P1 et M1 — adaptez les chapitres à votre code.
            </p>
          </header>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Équipe Inspect Practice</p>
              <p className="text-xs text-[#64748B]">Spécialistes de la préparation aux examens ICC — des plans structurés pour les inspecteurs occupés</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#CBD5E1] leading-relaxed space-y-6">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Comment fonctionne ce plan</h2>
            <p>
              Le plan comporte trois phases : <strong>Cartographie (semaines 1–2)</strong> pour apprendre la
              structure du code, <strong>Exercices (semaines 3–8)</strong> pour construire la vitesse de
              navigation chapitre par chapitre, et <strong>Simulations (semaines 9–12)</strong> pour verrouiller
              la performance du jour J. Prévoyez 45 à 60 minutes par jour, 5 à 6 jours par semaine.
            </p>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 1 : Cartographier le code (semaines 1–2)</h2>
            <p>Votre objectif : une carte mentale des chapitres de votre code, pas la maîtrise :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Semaine 1 :</strong> Lisez le bulletin officiel ICC et notez les domaines de contenu. Parcourez la table des matières du code — chapitre par chapitre — en écrivant une ligne par chapitre. Lisez le chapitre des définitions.</li>
              <li><strong>Semaine 2 :</strong> Faites un quiz diagnostique (20–30 questions, sans chrono, livre ouvert). Notez votre précision par chapitre. Vos chapitres faibles deviennent votre liste de priorités.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 2 : Exercices chapitre par chapitre (semaines 3–8)</h2>
            <p>Chaque semaine couvre un ou deux chapitres avec le même rythme : lire les sections clés, puis s'entraîner avec des questions, le code ouvert, en révisant chaque explication et sa référence.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Semaine 3 :</strong> Planification du bâtiment et issues (la zone à plus fort poids de la plupart des examens).</li>
              <li><strong>Semaine 4 :</strong> Fondations et planchers (ou les chapitres structurels de votre code).</li>
              <li><strong>Semaine 5 :</strong> Murs et revêtements (charpente, contreventement, parements).</li>
              <li><strong>Semaine 6 :</strong> Construction toit-plafond et ensembles de toiture.</li>
              <li><strong>Semaine 7 :</strong> Chapitres restants — cheminées/foyers, énergie, ou le contenu de métier pour E1/P1/M1.</li>
              <li><strong>Semaine 8 :</strong> Revenez sur vos trois chapitres les plus faibles du diagnostic. Re-entraînez-vous jusqu'à dépasser 80 % de précision.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Phase 3 : Simuler et consolider (semaines 9–12)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Semaine 9 :</strong> Première simulation complète chronométrée (par ex. 60 questions, 2 heures, livre ouvert). Révisez chaque échec.</li>
              <li><strong>Semaine 10 :</strong> Deuxième simulation. Concentrez-vous sur le rythme — vous devriez maintenant terminer avec du temps de reste.</li>
              <li><strong>Semaine 11 :</strong> Troisième simulation plus exercices ciblés sur les chapitres faibles. Commencez des échauffements quotidiens de recherche à l'index (5 minutes).</li>
              <li><strong>Semaine 12 :</strong> Une dernière simulation en milieu de semaine. Ensuite, révision légère seulement — définitions, sections à fort poids, journal des erreurs. Reposez-vous la veille.</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Rythme quotidien (45–60 minutes)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>5 min :</strong> Échauffement recherche à l'index — 5 sujets aléatoires, chronométrés.</li>
              <li><strong>30–40 min :</strong> Exercices de chapitre — 20 à 30 questions pratiques, code ouvert.</li>
              <li><strong>10 min :</strong> Révision des échecs et journal des références.</li>
              <li><strong>5 min :</strong> Auto-test sur les numéros de section de mémoire (rappel actif).</li>
            </ul>

            <h2 className="text-xl font-semibold text-[#F8FAFC] mt-10">Les outils pour exécuter ce plan</h2>
            <p>
              Inspect Practice réunit tout ce dont ce plan a besoin : questions organisées par chapitre avec
              références au code, difficulté adaptative, analyses par chapitre et simulations complètes
              chronométrées. Commencez avec{' '}
              <a href="/fr/blog" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                des questions pratiques ICC gratuites
              </a>{' '}
              pour établir votre base cette semaine.
            </p>
          </div>

          <RelatedStudyPlatforms />
        </article>
      </div>

      <LearningResourceJsonLd
        name="Plan d'étude ICC de 12 semaines"
        description="Calendrier d'étude de 12 semaines pour les examens de certification ICC — cartographie du code, exercices par chapitre et simulations chronométrées."
        educationalLevel="Professional"
        teaches={['Calendrier d\'étude ICC', 'Exercices de navigation', 'Simulations chronométrées', 'Analyses par chapitre']}
        resourceType="Guide"
      />
    </>
  );
}
