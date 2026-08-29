'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Layers,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Target,
  Lock,
  Wrench,
  Cpu,
  Shield,
  HardHat,
  Info,
} from 'lucide-react';
import { getStudentExamCategories } from '@/lib/student-api';
import type { StudentExamCategory } from '@/types/student';
import { useLocale } from '@/src/contexts/LocaleContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
} as const;

type SectionColor = 'blue' | 'amber' | 'cyan' | 'purple';

const SECTION_STYLES: Record<SectionColor, { bg: string; border: string; text: string; bar: string }> = {
  blue: {
    bg: 'bg-blue/10',
    border: 'border-blue/20',
    text: 'text-blue',
    bar: 'bg-blue',
  },
  amber: {
    bg: 'bg-amber/10',
    border: 'border-amber/20',
    text: 'text-amber',
    bar: 'bg-amber',
  },
  cyan: {
    bg: 'bg-cyan/10',
    border: 'border-cyan/20',
    text: 'text-cyan',
    bar: 'bg-cyan',
  },
  purple: {
    bg: 'bg-purple/10',
    border: 'border-purple/20',
    text: 'text-purple',
    bar: 'bg-purple',
  },
};

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="skeleton h-5 w-16 rounded mb-3" />
      <div className="skeleton h-5 w-3/4 rounded mb-2" />
      <div className="skeleton h-3 w-full rounded mb-1" />
      <div className="skeleton h-3 w-2/3 rounded mb-4" />
      <div className="flex items-center gap-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export default function StudentExamsPage() {
  const { t } = useLocale();
  const router = useRouter();

  const CATEGORY_TRANSLATIONS: Record<string, string> = {
    'bc172cd8-3cb9-46b4-ab5f-34a66a48902c': 'cat_B1Admin',
    '669718ac-2307-4804-9f97-b9fd1dfb6e32': 'cat_B1Walls',
    '7de3ed61-9242-4d6e-afa9-0173a925dd91': 'cat_B1Planning',
    'dc971218-05cd-488a-bfb3-a3f41f3d0268': 'cat_B1Foundations',
    '4e8f5360-33b7-4567-be14-878d63489d37': 'cat_E1Electrical',
    'bff23548-52a9-49f4-bccf-c7d7c7ec0e9a': 'cat_B1Egress',
    '5e52edd3-2698-4788-9eee-1427332d92c0': 'cat_B1PlanningPrac',
    '8116a886-bb07-4bca-9a5b-3728bb8b219f': 'cat_B1FoundationsPrac',
    'dad311a9-dad8-4d99-b7a5-839bbb8b1d28': 'cat_E1ElectricalPrac',
    'b2f6c1c0-2156-4a02-8025-0a0e4ded0533': 'cat_B2Commercial',
  };

  const LICENSE_SECTIONS: {
    key: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBig: React.ReactNode;
    color: SectionColor;
    codeFilter: (code: string) => boolean;
  }[] = [
    {
      key: 'common',
      title: t('licenseCommon'),
      subtitle: t('licenseCommonSub'),
      icon: <BookOpen size={16} />,
      iconBig: <BookOpen size={22} />,
      color: 'blue',
      codeFilter: (code: string) => code.startsWith('ICC-B1'),
    },
    {
      key: 'm',
      title: t('licenseM'),
      subtitle: t('licenseMSub'),
      icon: <Wrench size={16} />,
      iconBig: <Wrench size={22} />,
      color: 'amber',
      codeFilter: (code: string) => code.startsWith('ICC-B2'),
    },
    {
      key: 'e',
      title: t('licenseE'),
      subtitle: t('licenseESub'),
      icon: <Cpu size={16} />,
      iconBig: <Cpu size={22} />,
      color: 'cyan',
      codeFilter: (code: string) => code.startsWith('ICC-E1'),
    },
    {
      key: 's',
      title: t('licenseS'),
      subtitle: t('licenseSSub'),
      icon: <Shield size={16} />,
      iconBig: <Shield size={22} />,
      color: 'purple',
      codeFilter: (code: string) => code.startsWith('ICC-P1') || code.startsWith('ICC-M1'),
    },
  ] as const;

  useEffect(() => {
    document.title = `${t('examCategories')} | Inspect Practice`;
  }, [t]);

  const [categories, setCategories] = useState<StudentExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<'ALL' | 'B1' | 'B2' | 'E1' | 'P1' | 'M1'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('rating');
      if (p && ['B1', 'B2', 'E1', 'P1', 'M1', 'ALL'].includes(p)) return p as any;
      const s = sessionStorage.getItem('exams_rating');
      if (s && ['B1', 'B2', 'E1', 'P1', 'M1'].includes(s)) return s as any;
    }
    return 'ALL';
  });

  // Persist rating filter in URL (?rating=) + sessionStorage so it survives back-navigation
  const selectRating = (r: 'ALL' | 'B1' | 'B2' | 'E1' | 'P1' | 'M1') => {
    setRatingFilter(r);
    if (r === 'ALL') sessionStorage.removeItem('exams_rating');
    else sessionStorage.setItem('exams_rating', r);
    const url = new URL(window.location.href);
    if (r === 'ALL') url.searchParams.delete('rating');
    else url.searchParams.set('rating', r);
    window.history.replaceState(null, '', url.toString());
  };

  // Official exam path per ICC certification: B1/B2/E1/P1/M1 map to their ICC-* exam code
  const matchesRating = useCallback((code: string): boolean => {
    if (ratingFilter === 'ALL') return true;
    if (ratingFilter === 'B1') return code.startsWith('ICC-B1');
    if (ratingFilter === 'B2') return code.startsWith('ICC-B2');
    if (ratingFilter === 'E1') return code.startsWith('ICC-E1');
    if (ratingFilter === 'P1') return code.startsWith('ICC-P1');
    if (ratingFilter === 'M1') return code.startsWith('ICC-M1');
    return true;
  }, [ratingFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentExamCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function getExamColor(code: string): SectionColor {
    if (code.startsWith('ICC-B2')) return 'amber';
    if (code.startsWith('ICC-E1')) return 'cyan';
    if (code.startsWith('ICC-P1') || code.startsWith('ICC-M1')) return 'purple';
    return 'blue';
  }

  function getExamIcon(code: string, size = 18) {
    if (code.startsWith('ICC-B1')) return <HardHat size={size} />;

    if (code.startsWith('ICC-E1')) return <Cpu size={size} />;
    if (code.startsWith('ICC-P1') || code.startsWith('ICC-M1')) return <Shield size={size} />;
    return <BookOpen size={size} />;
  }

  // Icons: HardHat for B1, Cpu for E1, Shield for P1/M1

  function renderExamCard(category: StudentExamCategory, sectionColor: SectionColor) {
    const colors = SECTION_STYLES[sectionColor];
    const cardIcon = getExamIcon(category.code, 18);

    return (
      <motion.div
        key={category.id}
        variants={cardVariants}
        onClick={() => {
          if (category.locked) {
            router.push('/subscription');
          } else {
            router.push(`/exams/${category.id}`);
          }
        }}
        className={`bg-card border rounded-card p-5 cursor-pointer transition-all duration-200 group relative overflow-hidden ${
          category.locked
            ? 'border-red/30 opacity-60 hover:opacity-80'
            : 'border-border hover:border-blue/30 hover:bg-hover/50'
        }`}
      >
        {/* Lock overlay for locked exams */}
        {category.locked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-card">
            <div className="flex flex-col items-center gap-1 text-white">
              <Lock size={28} />
              <span className="text-xs font-semibold uppercase tracking-wider">{t('locked')}</span>
            </div>
          </div>
        )}

        {/* Top row: icon + code badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-9 w-9 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
            <span className={colors.text}>{cardIcon}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium border rounded ${
              category.locked
                ? 'text-red bg-red/10 border-red/20'
                : `${colors.text} ${colors.bg} ${colors.border}`
            }`}>
              {category.locked && <Lock size={13} />}
              {category.code}
            </span>
            <span className="text-[10px] text-text-tertiary font-medium px-2 py-0.5 bg-hover rounded">
              {category.country}
            </span>
          </div>
        </div>

        {/* Name & Description */}
        <h3 className="text-sm font-semibold text-text-primary group-hover:text-blue transition-colors mb-1">
          {t(CATEGORY_TRANSLATIONS[category.id] || '') || category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
            {category.description}
          </p>
        )}
        {!category.description && (
          <div className="mb-4" />
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <Layers size={13} className="text-cyan" />
            {category.chapterCount} {category.chapterCount !== 1 ? t('chapters') : t('chapter')}
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle size={13} className="text-amber" />
            {category.questionCount} {category.questionCount !== 1 ? t('questions') : t('question')}
          </span>
        </div>

        {/* Extra info row */}
        <div className="flex items-center gap-3 mt-2 text-[10px] text-text-tertiary">
          {category.timeLimit && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {category.timeLimit} {t('min')}
            </span>
          )}
          {category.passingScore && (
            <span className="flex items-center gap-1">
              <Target size={11} />
              {category.passingScore}% {t('pass')}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-text-primary">{t('examCategories')}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {t('examsSub')}
        </p>
      </div>

      {/* Rating path selector — ICC certification structure */}
      {!loading && !error && categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(['ALL', 'B1', 'B2', 'E1', 'P1', 'M1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => selectRating(r)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  ratingFilter === r
                    ? 'bg-blue text-white shadow-md shadow-blue/25'
                    : 'bg-card border border-border text-text-secondary hover:border-blue/40 hover:text-text-primary'
                }`}
              >
                {r === 'ALL' ? t('ratingAll') : r}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-card bg-card border border-blue/20 bg-gradient-to-br from-blue/[0.06] to-transparent">
            <h2 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Info size={15} className="text-blue" />
              {t('examPathTitle')}
            </h2>
            <p className="text-xs text-text-secondary mb-3">{t('examPathNote')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue/10 border border-blue/20 text-text-primary">
                <span className="font-bold text-blue">B1</span> {t('examPathB1')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber/10 border border-amber/20 text-text-primary">
                <span className="font-bold text-amber">B2</span> {t('examPathB2')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan/10 border border-cyan/20 text-text-primary">
                <span className="font-bold text-cyan">E1</span> {t('examPathE1')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green/10 border border-green/20 text-text-primary">
                <span className="font-bold text-green">P1</span> {t('examPathP1')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple/10 border border-purple/20 text-text-primary">
                <span className="font-bold text-purple">M1</span> {t('examPathM1')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button
            onClick={fetchCategories}
            className="ml-auto underline hover:no-underline text-text-secondary hover:text-text-primary"
          >
            <RefreshCw size={14} className="inline mr-1" />
            {t('retry')}
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-8">
          <div>
            <div className="skeleton h-6 w-64 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-text-tertiary" />
          </div>
          <h2 className="text-lg font-medium text-text-primary mb-1">{t('noExams')}</h2>
          <p className="text-sm text-text-secondary max-w-sm text-center">
            {t('noExamsDesc')}
          </p>
        </div>
      )}

      {/* Sections */}
      {!loading && categories.length > 0 && (
        LICENSE_SECTIONS.map((section) => {
          const colors = SECTION_STYLES[section.color];
          const filtered = section.codeFilter
            ? categories.filter(c => section.codeFilter(c.code) && matchesRating(c.code))
            : categories.filter(c => matchesRating(c.code));

          // Skip empty sections (no placeholder needed when all sections have data)
          if (filtered.length === 0) return null;

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Section header — prominent with left accent bar + colored icon */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-1 h-10 rounded-full ${colors.bar} shrink-0 mt-1`} />
                <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                  <span className={colors.text}>{section.iconBig}</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-text-primary">{section.title}</h2>
                  <p className="text-xs text-text-tertiary mt-0.5">{section.subtitle}</p>
                </div>
              </div>

              {/* Exam cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.map(cat => renderExamCard(cat, section.color))}
              </motion.div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
