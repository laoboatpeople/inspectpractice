import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos de Inspect Practice — Préparation aux examens ICC',
  description:
    "Plateforme de préparation aux examens d'inspecteur en bâtiment ICC alimentée par IA. Plus de 2 500 questions pour réussir vos certifications B1, B2, E1, P1 et M1.",
  alternates: {
    canonical: 'https://inspectpractice.com/fr/about',
    languages: {
      en: 'https://inspectpractice.com/about',
      fr: 'https://inspectpractice.com/fr/about',
    },
  },
  openGraph: {
    title: 'À propos de Inspect Practice — Préparation aux examens ICC',
    description:
      "Découvrez Inspect Practice : notre mission d'aider les inspecteurs en bâtiment à réussir leurs certifications ICC grâce à notre plateforme IA avec plus de 2 500 questions.",
    url: 'https://inspectpractice.com/fr/about',
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Inspect Practice',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/about.jpg',
        width: 1200,
        height: 630,
        alt: "Plateforme de préparation aux examens ICC Inspect Practice",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Inspect Practice — Préparation aux examens ICC',
    description:
      "Découvrez Inspect Practice : notre mission d'aider les inspecteurs en bâtiment à réussir leurs certifications ICC, notre plateforme alimentée par IA avec plus de 2 500 questions, et l'histoire derrière notre fondateur.",
    images: ['https://inspectpractice.com/images/og/about.jpg'],
  },
  other: {
    'article:published_time': '2025-01-15',
    'article:modified_time': '2026-08-18',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/fr" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">IP</span>
            </div>
            <span className="font-bold text-lg">Inspect Practice</span>
          </a>
          <a href="/fr" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            ← Retour à l&apos;accueil
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium text-[#C8102E] bg-[#C8102E]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
            À Propos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
            À propos de Inspect Practice
          </h1>
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
            Nous construisons la plateforme d&apos;étude la plus efficace pour les examens
            de certification d&apos;inspecteur en bâtiment ICC (B1, B2, E1, P1 et M1) — alliant la
            technologie de l&apos;IA à une véritable expertise des codes du bâtiment pour aider
            les candidats à réussir avec confiance.
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="bg-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#C8102E]/20 flex items-center justify-center text-[#C8102E]">★</span>
              Notre Mission
            </h2>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Notre mission est simple : aider chaque candidat à réussir ses examens de
              certification ICC du premier coup. Les examens d&apos;inspecteur en bâtiment sont
              à livre ouvert — la réussite dépend de la capacité à naviguer dans le code
              rapidement et avec précision. Pourtant, trop de candidats se présentent à
              l&apos;examen sans être préparés — non pas parce qu&apos;ils manquent de compétences,
              mais parce qu&apos;ils n&apos;ont pas accès à des outils d&apos;étude qui reflètent la
              véritable expérience d&apos;examen.
            </p>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Les supports d&apos;étude traditionnels pour les examens ICC sont statiques,
              difficiles à naviguer, et offrent rarement la profondeur de pratique nécessaire
              pour maîtriser les codes (CRI/IRC, IBC, NEC, IPC, IMC). Les codes sont denses et
              le programme peut sembler écrasant sans une approche structurée. Nous avons
              entrepris de changer cela en construisant une plateforme qui s&apos;adapte au rythme
              d&apos;apprentissage de chaque candidat, identifie les points faibles et offre une
              pratique ciblée de navigation dans les codes.
            </p>
            <p className="text-[#CBD5E1] leading-relaxed">
              Au cœur de notre mission se trouve un engagement envers la sécurité du public.
              Chaque inspecteur certifié qui approuve une construction est responsable de la
              sécurité des occupants. En veillant à ce que les candidats soient parfaitement
              préparés, nous contribuons à des bâtiments plus sûrs aux États-Unis et au-delà.
            </p>
          </div>
        </section>

        {/* Our Platform */}
        <section className="mb-16">
          <div className="bg-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#4C7FBF]/20 flex items-center justify-center text-[#4C7FBF]">◆</span>
              Notre Plateforme
            </h2>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Inspect Practice n&apos;est pas une simple application de fiches de révision. C&apos;est
              une plateforme d&apos;étude spécialisée, alimentée par l&apos;IA, conçue dès le départ
              autour des examens ouverts des certifications ICC : B1 (Inspecteur en bâtiment
              résidentiel — CRI/IRC), B2 (Inspecteur en bâtiment commercial — IBC), E1
              (Inspecteur en électricité résidentielle — NEC), P1 (Inspecteur en plomberie
              résidentielle — IPC) et M1 (Inspecteur en mécanique résidentielle — IMC).
            </p>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Notre banque de questions contient plus de 2 500 questions générées par IA et
              révisées par des experts, couvrant les chapitres des codes pertinents pour chaque
              certification. Chaque question est étiquetée par code, chapitre, sujet, niveau de
              difficulté et référence précise à la section (par ex. R403.1.4, NEC 230.70) — ce
              qui permet aux candidats de cibler facilement leurs points faibles et d&apos;entraîner
              leur vitesse de recherche.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#C8102E]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#C8102E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Difficulté Adaptative par IA</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  L&apos;IA ajuste la difficulté des questions en temps réel en fonction de vos
                  performances. Maîtrisez un chapitre et le système vous challenge davantage ;
                  si vous rencontrez des difficultés, il vous propose des exercices plus
                  fondamentaux. Cela garantit des sessions d&apos;étude efficaces et ciblées.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#4C7FBF]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#4C7FBF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Simulations d&apos;Examen à Livre Ouvert</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Des examens chronométrés reproduisent l&apos;environnement réel de test ICC.
                  Gagnez en rapidité et en confiance avant l&apos;examen réel grâce à des formats
                  de questions, des durées et des niveaux de difficulté conformes aux normes
                  officielles.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Tuteur IA</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Obtenez des explications instantanées en langage clair sur les exigences des
                  codes. Posez vos questions naturellement et recevez des réponses axées sur
                  l&apos;examen qui font référence aux sections exactes des codes.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Analytique de Progression</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Des analyses détaillées montrent vos performances dans chaque chapitre du
                  code. Suivez votre précision par chapitre, surveillez la progression de la
                  difficulté et consultez votre historique d&apos;examen — sachez toujours
                  exactement où vous en êtes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Founder */}
        <section className="mb-16">
          <div className="bg-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">👤</span>
              Notre Fondateur
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center text-white text-4xl font-bold shrink-0">
                CO
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Chuck Onekeo</h3>
                <p className="text-sm text-[#C8102E] font-medium mb-4">
                  Programmeur &amp; Spécialiste en IA — Fondateur de Inspect Practice
                </p>
                <p className="text-[#CBD5E1] leading-relaxed mb-4">
                  Chuck Onekeo est un programmeur et spécialiste en IA avec une vaste expérience
                  dans la création de systèmes intelligents pour l&apos;enseignement technique.
                  Frustré par le manque d&apos;outils d&apos;étude modernes et adaptatifs disponibles
                  pour les candidats aux certifications techniques, Chuck a décidé de construire
                  la plateforme qu&apos;il aurait aimé avoir lorsqu&apos;il étudiait pour ses propres
                  certifications.
                </p>
                <p className="text-[#CBD5E1] leading-relaxed mb-4">
                  Alliant son expertise en intelligence artificielle, apprentissage automatique
                  et développement full-stack, Chuck a conçu Inspect Practice de A à Z comme un
                  système d&apos;apprentissage adaptatif spécialement adapté aux examens à livre
                  ouvert des certifications ICC. Le moteur d&apos;IA de la plateforme ajuste
                  dynamiquement la difficulté des questions, génère des explications
                  contextuelles avec références aux codes et fournit des recommandations
                  d&apos;étude personnalisées basées sur les performances individuelles.
                </p>
                <p className="text-[#CBD5E1] leading-relaxed">
                  La vision de Chuck pour Inspect Practice va au-delà du simple fait d&apos;aider
                  les candidats à réussir leurs examens. Il croit que des inspecteurs bien
                  préparés rendent les bâtiments plus sûrs pour tout le monde, et que la
                  technologie — en particulier l&apos;IA — a le pouvoir d&apos;améliorer
                  considérablement la façon dont les professionnels techniques se préparent aux
                  examens de certification à enjeux élevés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="mb-16">
          <div className="bg-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">⚡</span>
              Pourquoi Nous Avons Créé Ceci
            </h2>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Le parcours vers les certifications ICC est exigeant. Les candidats doivent
              maîtriser des codes volumineux (CRI/IRC, IBC, NEC, IPC, IMC), réussir des examens
              à livre ouvert chronométrés, et développer la vitesse de navigation qui fait la
              différence le jour J. Malgré les enjeux élevés, la plupart des candidats se
              fient à des manuels denses, des PDF éparpillés et des conseils de bouche à
              oreille pour se préparer.
            </p>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Nous avons vu une lacune que la technologie pouvait combler. Les mêmes techniques
              d&apos;IA qui alimentent les systèmes de recommandation, les modèles de langage et
              les plateformes de tutorat adaptatif pouvaient être appliquées à la préparation
              aux examens d&apos;inspection — et le résultat est une expérience d&apos;étude plus
              efficace, plus engageante et plus performante que tout ce qui est actuellement
              disponible pour les candidats ICC.
            </p>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Principaux problèmes que nous avons entrepris de résoudre :
            </p>
            <ul className="space-y-3 text-[#CBD5E1]">
              <li className="flex items-start gap-3">
                <span className="text-[#C8102E] mt-1.5">▸</span>
                <span><strong className="text-[#F8FAFC]">Pénurie de questions d&apos;entraînement</strong> — La plupart des candidats rapportent que trouver suffisamment de questions d&apos;entraînement réalistes est leur plus grand défi. Nous avons construit une banque de plus de 2 500 questions couvrant les cinq certifications ICC.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C8102E] mt-1.5">▸</span>
                <span><strong className="text-[#F8FAFC]\">Supports d&apos;étude universels</strong> — Chaque candidat apprend différemment. Notre IA adaptative adapte la difficulté et l&apos;orientation de chaque session d&apos;étude aux performances de l&apos;individu.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C8102E] mt-1.5">▸</span>
                <span><strong className="text-[#F8FAFC]">Absence d&apos;outils de simulation d&apos;examen</strong> — Les candidats ont besoin d&apos;une pratique chronométrée et réaliste pour gagner en confiance. Notre mode examen reproduit l&apos;environnement réel de test ICC à livre ouvert.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C8102E] mt-1.5">▸</span>
                <span><strong className="text-[#F8FAFC]">Manque de visibilité sur la progression</strong> — Sans analytique, les candidats ne savent pas sur quoi se concentrer. Notre plateforme fournit des mesures de performance détaillées pour chaque chapitre du code.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C8102E] mt-1.5">▸</span>
                <span><strong className="text-[#F8FAFC]">Absence d&apos;options d&apos;étude mobile</strong> — Les inspecteurs sont très occupés. Inspect Practice est disponible sur mobile, tablette et ordinateur pour que vous puissiez étudier à tout moment, n&apos;importe où.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#4C7FBF]/20 flex items-center justify-center text-[#4C7FBF]">♥</span>
              Notre Engagement
            </h2>
            <p className="text-[#CBD5E1] leading-relaxed mb-4">
              Nous nous engageons à construire une plateforme qui aide réellement les candidats
              ICC à réussir. Cela signifie :
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#C8102E]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#C8102E] text-2xl font-bold">Q</span>
                </div>
                <h3 className="font-semibold mb-2">Contenu de Qualité</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Chaque question est révisée conformément aux codes en vigueur. Nous mettons
                  régulièrement à jour notre banque de questions pour rester alignés sur les
                  nouvelles éditions des codes et les bulletins d&apos;examen ICC.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#4C7FBF]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#4C7FBF] text-2xl font-bold">$</span>
                </div>
                <h3 className="font-semibold mb-2">Prix Équitables</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Nous offrons un niveau gratuit pour que chaque candidat puisse essayer la
                  plateforme, ainsi que des forfaits mensuels et à vie abordables. Pas de frais
                  cachés, pas de surprises.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#8B5CF6] text-2xl font-bold">S</span>
                </div>
                <h3 className="font-semibold mb-2">Réussite des Candidats</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Notre succès se mesure à votre succès. Nous améliorons continuellement la
                  plateforme en fonction des retours des candidats et des données de
                  performance pour maximiser les taux de réussite.
                </p>
              </div>
            </div>
            <p className="text-[#CBD5E1] leading-relaxed mt-8">
              Nous ne faisons que commencer. La plateforme évolue constamment avec de nouvelles
              fonctionnalités, plus de questions et des capacités d&apos;IA améliorées. Notre
              vision à long terme est de devenir la ressource d&apos;étude de référence pour chaque
              candidat ICC aux États-Unis — et d&apos;étendre éventuellement notre soutien à
              d&apos;autres certifications en inspection. Que vous débutiez tout juste votre parcours
              B1 ou que vous ajoutiez E1, P1 ou M1 à votre profil, Inspect Practice est conçu
              pour vous.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pb-20">
          <div className="bg-gradient-to-r from-[#C8102E]/10 to-[#4C7FBF]/10 rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-3">Prêt à Réussir Votre Examen ICC ?</h2>
            <p className="text-[#94A3B8] mb-6 max-w-xl mx-auto">
              Rejoignez des milliers d&apos;inspecteurs qui se préparent avec Inspect Practice.
              Commencez gratuitement, passez à un forfait payant quand vous êtes prêt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors"
              >
                Commencer Gratuitement
              </a>
              <a
                href="/fr/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                Voir les Tarifs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
