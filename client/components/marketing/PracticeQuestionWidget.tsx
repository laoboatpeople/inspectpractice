"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// ─── Practice Questions Data (FR) ────────────────────────

const frQuestions = [
  {
    id: 1,
    topic: 'IRC — Planning du bâtiment',
    stem: 'Selon l\'IRC (International Residential Code), quelle est la hauteur minimale d\'une garde (garde-corps) sur un balcon résidentiel au-dessus du niveau du sol?',
    options: [
      '30 pouces (762 mm)',
      '36 pouces (914 mm)',
      '42 pouces (1067 mm)',
      '48 pouces (1219 mm)',
    ],
    correctIndex: 1,
    explanation:
      'L\'IRC R312 exige une garde de 36 pouces (914 mm) minimum au-dessus du niveau de la surface de marche pour les balcons, porches et mezzanines situés à plus de 30 pouces au-dessus du sol.',
    ref: 'IRC R312',
  },
  {
    id: 2,
    topic: 'IRC — Fondations',
    stem: 'Quelle est la profondeur minimale de gel pour les fondations en béton coulé dans une région où la ligne de gel locale est de 42 pouces?',
    options: [
      'La profondeur minimale de gel locale, soit 42 pouces, à moins qu\'une dalle isolée approuvée ne soit utilisée',
      '24 pouces dans tous les cas',
      '36 pouces indépendamment de la ligne de gel',
      'Aucune exigence — la profondeur est laissée à la discrétion de l\'inspecteur',
    ],
    correctIndex: 0,
    explanation:
      'L\'IRC R403.1.4 exige que les fondations descendent sous la ligne de gel locale. La protection contre le gel (R403.3) permet une alternative approuvée pour les dalles.',
    ref: 'IRC R403.1.4, R403.3',
  },
  {
    id: 3,
    topic: 'IRC — Toiture',
    stem: 'Quelle est la pente minimale pour un revêtement de toiture en bardeaux d\'asphalte?',
    options: [
      '1:12',
      '2:12',
      '3:12',
      '4:12',
    ],
    correctIndex: 1,
    explanation:
      'L\'IRC R905.2.2 exige une pente minimale de 2:12 pour les bardeaux d\'asphalte. En dessous de cette pente, un revêtement de toiture à faible pente (type membrane) est requis.',
    ref: 'IRC R905.2.2',
  },
  {
    id: 4,
    topic: 'IRC — Murs',
    stem: 'Quelle est la hauteur maximale d\'une ouverture non protégée (fenêtre) dans un mur coupe-feu entre deux maisons jumelées?',
    options: [
      'Aucune ouverture n\'est autorisée dans un mur coupe-feu',
      '3 pieds',
      'La surface totale ne doit pas excéder 25% de la surface du mur',
      'Les ouvertures sont autorisées si elles sont protégées par des fenêtres à verre armé',
    ],
    correctIndex: 0,
    explanation:
      'L\'IRC R302.2 interdit les ouvertures dans le mur coupe-feu entre logements. C\'est une exigence clé de sécurité incendie pour les bâtiments multifamiliaux.',
    ref: 'IRC R302.2',
  },
  {
    id: 5,
    topic: 'IRC — Sécurité publique',
    stem: 'Un escalier intérieur desservant un seul niveau résidentiel doit avoir une largeur minimale de passage de?',
    options: [
      '24 pouces',
      '30 pouces',
      '36 pouces',
      '44 pouces',
    ],
    correctIndex: 2,
    explanation:
      'L\'IRC R311.7.1 exige une largeur minimale de 36 pouces pour les escaliers résidentiels, mesurée entre les mains courantes ou les parois.',
    ref: 'IRC R311.7.1',
  },
];
const enQuestions = [
  {
    id: 1,
    topic: 'IRC — Building Planning',
    stem: 'Under the IRC, what is the minimum required height for a guard (guardrail) on a residential balcony above grade?',
    options: [
      '30 inches (762 mm)',
      '36 inches (914 mm)',
      '42 inches (1067 mm)',
      '48 inches (1219 mm)',
    ],
    correctIndex: 1,
    explanation:
      'IRC R312 requires guards to be at least 36 inches (914 mm) above the walking surface for balconies, porches and mezzanines located more than 30 inches above grade.',
    ref: 'IRC R312',
  },
  {
    id: 2,
    topic: 'IRC — Foundations',
    stem: 'What is the minimum depth for cast-in-place concrete footings in a region where the local frost line is 42 inches?',
    options: [
      'The local frost line depth of 42 inches, unless an approved frost-protected shallow foundation is used',
      '24 inches in all cases',
      '36 inches regardless of the frost line',
      'No requirement — depth is at the inspector\'s discretion',
    ],
    correctIndex: 0,
    explanation:
      'IRC R403.1.4 requires footings to extend below the local frost line. Frost-protected shallow foundation alternatives are permitted under R403.3.',
    ref: 'IRC R403.1.4, R403.3',
  },
  {
    id: 3,
    topic: 'IRC — Roofing',
    stem: 'What is the minimum slope for asphalt shingle roof covering?',
    options: [
      '1:12',
      '2:12',
      '3:12',
      '4:12',
    ],
    correctIndex: 1,
    explanation:
      'IRC R905.2.2 requires a minimum 2:12 slope for asphalt shingles. Below this slope, low-slope (membrane-type) roof covering is required.',
    ref: 'IRC R905.2.2',
  },
  {
    id: 4,
    topic: 'IRC — Walls',
    stem: 'What is the maximum height of an unprotected opening (window) in the fire wall between two attached dwelling units?',
    options: [
      'No openings are permitted in the fire wall',
      '3 feet',
      'The total area must not exceed 25% of the wall area',
      'Openings are allowed if protected by wired glass windows',
    ],
    correctIndex: 0,
    explanation:
      'IRC R302.2 prohibits openings in the wall separating dwelling units. This is a key fire-safety requirement for multi-family buildings.',
    ref: 'IRC R302.2',
  },
  {
    id: 5,
    topic: 'IRC — Public Safety',
    stem: 'An interior stair serving a single residential level must have a minimum clear width of?',
    options: [
      '24 inches',
      '30 inches',
      '36 inches',
      '44 inches',
    ],
    correctIndex: 2,
    explanation:
      'IRC R311.7.1 requires a minimum width of 36 inches for residential stairways, measured between handrails or walls.',
    ref: 'IRC R311.7.1',
  },
];

// ─── Practice Question Widget Component ──────────────────

export default function PracticeQuestionWidget() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');
  const questions = isFr ? frQuestions : enQuestions;
  const [question] = useState(
    () => questions[Math.floor(Math.random() * questions.length)]
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedIndex(idx);
    setRevealed(true);
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const answered = revealed;

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4C7FBF]/5 via-transparent to-[#C8102E]/5" />
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            🔥{' '}
            <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
              {isFr ? 'Essayez une vraie question ICC' : 'Try a Real ICC Question'}
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            {isFr
              ? 'Découvrez comment Inspect Practice vous prépare aux examens ICC à livre ouvert. Sélectionnez votre réponse ci-dessous pour tester vos connaissances.'
              : 'See how Inspect Practice prepares you for ICC open-book exams. Select your answer below to test your knowledge.'}
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A2035] to-[#0A0E1A] p-6 md:p-8 shadow-xl"
        >
          {/* Topic badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#C8102E]/20 text-[#C8102E] text-xs font-bold">
              ?
            </span>
            <span className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
              {question.topic}
            </span>
          </div>

          {/* Question stem */}
          <p className="text-sm md:text-base text-[#F8FAFC] font-medium leading-relaxed mb-6">
            {question.stem}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let optionStyle =
                'border border-white/10 bg-white/[0.03] hover:border-[#C8102E]/30 hover:bg-white/[0.06]';

              if (!answered) {
                optionStyle =
                  'border border-white/10 bg-white/[0.03] hover:border-[#C8102E]/30 hover:bg-white/[0.06] cursor-pointer';
              } else if (idx === question.correctIndex) {
                optionStyle = 'border border-green bg-green/10';
              } else if (idx === selectedIndex && !isCorrect) {
                optionStyle = 'border border-red bg-red/10';
              } else {
                optionStyle = 'border border-white/5 bg-white/[0.02] opacity-50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-200 ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 ${
                        answered && idx === question.correctIndex
                          ? 'bg-green text-white'
                          : answered && idx === selectedIndex && !isCorrect
                          ? 'bg-red text-white'
                          : 'bg-white/10 text-[#94A3B8]'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm md:text-sm text-[#94A3B8] leading-relaxed">
                      {opt}
                    </span>
                    {answered && idx === question.correctIndex && (
                      <span className="text-green text-sm flex-shrink-0 ml-auto font-bold">✓</span>
                    )}
                    {answered && idx === selectedIndex && !isCorrect && (
                      <span className="text-red text-sm flex-shrink-0 ml-auto font-bold">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {/* Feedback banner */}
              <div
                className={`p-4 rounded-xl mb-4 ${
                  isCorrect
                    ? 'bg-green/10 border border-green/30'
                    : 'bg-red/10 border border-red/30'
                }`}
              >
                <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-green' : 'text-red'}`}>
                  {isCorrect
                    ? (isFr ? '✅ Correct !' : '✅ Correct!')
                    : (isFr ? '❌ Pas tout à fait.' : '❌ Not quite.')}
                </p>
                <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
                  {question.explanation}
                </p>
                {question.ref && (
                  <p className="text-xs text-[#64748B] mt-2 italic">
                    {isFr ? 'Référence : ' : 'Reference: '}{question.ref}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300"
                >
                  {isFr ? 'Envie d\'en voir plus ? → Commencer gratuitement' : 'Want to see more? → Start Free'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={isFr ? '/fr/blog' : 'https://inspectpractice.com/free-icc-practice-questions'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-[#94A3B8] hover:text-white text-sm font-medium transition-all duration-300"
                >
                  📄 {isFr ? 'Télécharger les questions ICC gratuites' : 'Download Free ICC questions'}
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
