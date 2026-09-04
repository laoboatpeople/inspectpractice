'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Play,
  HelpCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Timer,
  Clock,
  Target,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import { getStudentExamChapters, getStudentExamCategories } from '@/lib/student-api';
import type { StudentExamCategory, StudentChapter } from '@/types/student';
import { useLocale } from '@/src/contexts/LocaleContext';

const DIFFICULTY_OPTIONS = [
  { value: 'ALL', label: 'app.examDetail.allDifficulties', description: 'app.examDetail.allDesc' },
  { value: 'EASY', label: 'app.examDetail.easy', description: 'app.examDetail.easyDesc' },
  { value: 'MEDIUM', label: 'app.examDetail.medium', description: 'app.examDetail.mediumDesc' },
  { value: 'HARD', label: 'app.examDetail.hard', description: 'app.examDetail.hardDesc' },
] as const;

type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]['value'];

const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50, 100, 150] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
} as const;

export default function StudentExamDetailPage() {
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<StudentExamCategory | null>(null);
  const [chapters, setChapters] = useState<StudentChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(10);

  useEffect(() => {
    // Read adaptive difficulty from localStorage
    const saved = localStorage.getItem(`inspectpractice_adaptive_${examId}`);
    if (saved && ['ALL', 'EASY', 'MEDIUM', 'HARD'].includes(saved)) {
      setDifficulty(saved as Difficulty);
    }
  }, [examId]);

  useEffect(() => {
    document.title = `${t('app.exams.title')} | Inspect Practice`;
  }, [t]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch chapters and categories in parallel
      const [chaptersData, categoriesData] = await Promise.all([
        getStudentExamChapters(examId),
        getStudentExamCategories(),
      ]);

      setChapters(chaptersData);

      // Find the matching exam category
      const match = categoriesData.find((c) => c.id === examId);
      if (match) {
        setExam(match);
      } else {
        // Exam not found in categories — still show chapters, but no header info
        setExam(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('app.examDetail.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [examId, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartQuiz = () => {
    // Clean up any previous quiz results stored for this exam (written at
    // submission for the tutor-return flow). Without this, re-mounting the
    // quiz page restores the old result screen from sessionStorage.
    sessionStorage.removeItem(`quiz_results_${examId}`);
    // Cap the requested count to the total questions available in this exam
    const effectiveCount = Math.min(questionCount, totalQuestions > 0 ? totalQuestions : questionCount);
    const params = new URLSearchParams({ count: String(effectiveCount), difficulty });
    // Unique timestamp param: guarantees a full page load every time.
    // Without it, navigating to a URL already in history (right after Back)
    // makes the browser restore the previous page from bfcache — including
    // the completed quiz result state.
    params.set('t', String(Date.now()));
    window.location.href = `/quiz/${examId}?${params}`;
  };

  const handleStartExamSimulation = () => {
    if (!exam || exam.locked || exam.simulationLocked) {
      router.push('/subscription');
      return;
    }
    sessionStorage.removeItem(`quiz_results_${examId}`);
    // Official format: questionsPerSimulation (50 REGS / 90 technical), mode=exam
    // -> quiz page applies the official timer (exam.timeLimit x 60) automatically.
    const params = new URLSearchParams({
      count: String(exam.questionsPerSimulation ?? (exam.code === 'ICC-B2' ? 80 : 60)),
      mode: 'exam',
      difficulty: 'ALL',
    });
    params.set('t', String(Date.now()));
    window.location.href = `/quiz/${examId}?${params}`;
  };

  const handleSelectChapter = (chapterId: string, chapterCount: number) => {
    // Clean up any previous quiz results stored for this exam — see
    // handleStartQuiz comment.
    sessionStorage.removeItem(`quiz_results_${examId}`);
    // Launch the quiz directly, scoped to this chapter, all difficulties.
    const params = new URLSearchParams({
      count: String(chapterCount),
      chapterId,
      difficulty: 'ALL',
    });
    // Unique timestamp param — see handleStartQuiz comment.
    params.set('t', String(Date.now()));
    window.location.href = `/quiz/${examId}?${params}`;
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="skeleton h-4 w-32 rounded mb-6" />

        {/* Header skeleton */}
        <div className="skeleton h-8 w-48 rounded mb-2" />
        <div className="skeleton h-4 w-72 rounded mb-6" />

        {/* Stats skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="skeleton h-16 w-36 rounded-card" />
          <div className="skeleton h-16 w-36 rounded-card" />
        </div>

        {/* Chapters skeleton */}
        <div className="skeleton h-6 w-28 rounded mb-4" />
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-14 rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => router.push('/exams')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          {t('app.examDetail.backToExams')}
        </button>
        <div className="flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button
            onClick={fetchData}
            className="ml-auto underline hover:no-underline text-text-secondary hover:text-text-primary"
          >
            <RefreshCw size={14} className="inline mr-1" />
            {t('app.exams.retry')}
          </button>
        </div>
      </div>
    );
  }

  // If exam is null but chapters were returned, show partial info
  const displayName = exam?.name ?? t('app.examDetail.unknownExam');
  const displayCode = exam?.code ?? '—';
  const totalQuestions = chapters.reduce((sum, ch) => sum + ch.questionCount, 0);

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.push('/exams')}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        {t('app.examDetail.backToExams')}
      </button>

      {/* Exam header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-text-tertiary mb-2">
          <span>{t('app.exams.title')}</span>
          <ChevronRight size={12} />
          <span className="font-mono text-blue">{displayCode}</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">{displayName}</h1>
        {exam?.description && (
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">{exam.description}</p>
        )}

        {/* Info chips */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {/* Country badge */}
          {exam?.country && (
            <span className="text-[10px] font-medium text-text-tertiary px-2 py-1 bg-hover rounded">
              {exam.country}
            </span>
          )}

          {/* License type */}
          {exam?.licenseType && (
            <span className="text-[10px] font-medium text-text-tertiary px-2 py-1 bg-hover rounded">
              {exam.licenseType}
            </span>
          )}
        </div>
      </div>

      {/* Official Exam Simulation — distinct hero design */}
      {exam && (
        <div className="relative overflow-hidden p-6 rounded-card border border-purple/30 bg-gradient-to-br from-purple/15 via-purple/[0.07] to-card shadow-lg shadow-purple/10 mb-4">
          {/* subtle glow blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple/15 border border-purple/30 flex items-center justify-center shrink-0">
                  <Timer size={20} className="text-purple" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary leading-tight">
                    {t('app.examDetail.examSimulation')}
                  </h2>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-purple bg-purple/10 border border-purple/25 px-1.5 py-0.5 rounded">
                    <BadgeCheck size={11} />
                    {t('app.examDetail.officialBadge')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary">{t('app.examDetail.examSimDesc')}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple/10 border border-purple/20 text-xs text-text-primary">
                  <HelpCircle size={12} className="text-purple" />
                  <span className="font-semibold">{exam.questionsPerSimulation ?? 90}</span>
                  {t('app.examDetail.questionsCount')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple/10 border border-purple/20 text-xs text-text-primary">
                  <Clock size={12} className="text-purple" />
                  <span className="font-semibold">{exam.timeLimit ?? 180}</span>
                  {t('app.examDetail.minLabel')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple/10 border border-purple/20 text-xs text-text-primary">
                  <Target size={12} className="text-purple" />
                  <span className="font-semibold">{exam.passingScore ?? 70}%</span>
                  {t('app.examDetail.passLabel')}
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={handleStartExamSimulation}
                className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-btn text-sm font-semibold transition-all active:scale-[0.98] whitespace-nowrap w-full sm:w-auto shrink-0 ${
                  exam.locked || exam.simulationLocked
                    ? 'bg-blue text-white hover:bg-blue/90'
                    : 'bg-gradient-to-r from-purple to-blue text-white shadow-md shadow-purple/25 hover:shadow-purple/40 hover:brightness-110'
                }`}
              >
                <Play size={16} className="fill-current" />
                {t('app.examDetail.examSimStart')}
              </button>
              {(exam.locked || exam.simulationLocked) && (
                <span
                  className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red text-white border-2 border-card shadow-sm"
                  title={t('app.examDetail.examSimLocked')}
                >
                  <Lock size={10} />
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Practice Quiz section */}
      <div className="bg-card border border-border rounded-card p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-text-primary mb-1">{t('app.examDetail.practiceQuiz')}</h2>
            <p className="text-xs text-text-secondary">
              {t('app.examDetail.practiceDesc', { count: chapters.length })}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {/* Question count selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-tertiary whitespace-nowrap">{t('app.examDetail.questionCountLabel')}</span>
              <div className="flex flex-wrap bg-hover border border-border rounded-btn">
                {QUESTION_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setQuestionCount(opt)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      questionCount === opt
                        ? 'bg-blue text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Capped notice when selection exceeds available questions */}
            {totalQuestions > 0 && questionCount > totalQuestions && (
              <p className="text-xs text-amber flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                {t('app.examDetail.questionCountCapped', {
                  requested: questionCount,
                  available: totalQuestions,
                })}
              </p>
            )}

            {/* Difficulty selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-tertiary whitespace-nowrap">{t('app.examDetail.difficulty')}</span>
              <div className="flex flex-wrap bg-hover border border-border rounded-btn">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      difficulty === opt.value
                        ? 'bg-blue text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                    }`}
                    title={t(opt.description)}
                  >
                    {t(opt.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleStartQuiz}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors active:scale-[0.98] whitespace-nowrap w-full sm:w-auto"
              >
                <Play size={15} />
                {t('app.examDetail.startPractice')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <BookOpen size={16} className="text-cyan" />
            {t('app.examDetail.chapters')}
            <span className="text-xs font-normal text-text-tertiary ml-1">
              {t('app.examDetail.totalLabel', { count: chapters.length })}
            </span>
          </h2>
          <span className="text-xs text-text-tertiary flex items-center gap-1">
            <HelpCircle size={12} />
            {totalQuestions} {totalQuestions !== 1 ? t('app.examDetail.questionsCount') : t('app.examDetail.questionSingular')}
          </span>
        </div>

        {/* Chapter-by-chapter hint */}
        <p className="text-xs text-text-secondary mb-4 flex items-start gap-1.5">
          <BookOpen size={12} className="text-cyan shrink-0 mt-0.5" />
          <span>{t('app.examDetail.chaptersHint')}</span>
        </p>

        {chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-card">
            <BookOpen size={24} className="text-text-tertiary mb-3" />
            <p className="text-sm text-text-secondary">{t('app.examDetail.noChapters')}</p>
            <p className="text-xs text-text-tertiary mt-1">
              {t('app.examDetail.noChaptersDesc')}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                className="relative bg-card border border-border rounded-card px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-hover/30 transition-colors"
              >
                {chapter.locked && (
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push('/subscription'); }}
                    className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red text-white border-2 border-card shadow-sm cursor-pointer hover:bg-red/80 transition-colors"
                    title={t('app.examDetail.testChapterLocked')}
                    aria-label={t('app.examDetail.testChapterLocked')}
                  >
                    <Lock size={10} />
                  </button>
                )}
                <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue/10 border border-blue/20 text-xs font-mono font-bold text-blue flex-shrink-0">
                    {chapter.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary leading-snug">
                      {chapter.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-text-tertiary">
                        {t('app.examDetail.chapterNum', { number: chapter.number })}
                      </p>
                      {chapter.syllabusRef && (
                        <span className="text-[9px] font-mono text-cyan/70 bg-cyan/5 px-1.5 py-0.5 rounded border border-cyan/10">
                          {chapter.syllabusRef}
                        </span>
                      )}
                      {chapter.licenseScope && chapter.licenseScope !== 'SHARED' && (
                        <span className="text-[9px] font-medium text-amber/80 bg-amber/5 px-1.5 py-0.5 rounded border border-amber/10">
                          {chapter.licenseScope}
                        </span>
                      )}
                      <a
                        href={`/theory?chapterId=${chapter.id}`}
                        className="flex items-center justify-center gap-1 px-2.5 py-1 bg-blue/10 border border-blue/20 text-blue rounded-btn text-[10px] font-medium hover:bg-blue/20 transition-colors whitespace-nowrap"
                        title={t('app.examDetail.studyChapterDesc')}
                      >
                        <BookOpen size={11} />
                        {t('app.examDetail.studyChapter')}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto sm:justify-end justify-between">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5 px-2 py-1 bg-hover border border-border rounded whitespace-nowrap">
                    <HelpCircle size={11} className="text-amber" />
                    {chapter.questionCount} {chapter.questionCount !== 1 ? t('app.examDetail.questionsCount') : t('app.examDetail.questionSingular')}
                  </span>
                  {chapter.questionCount > 0 && (
                    <button
                      onClick={chapter.locked ? () => router.push('/subscription') : () => handleSelectChapter(chapter.id, chapter.questionCount)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-btn text-xs font-medium transition-colors whitespace-nowrap ${
                        chapter.locked
                          ? 'bg-red/10 text-red hover:bg-red/20 border border-red/30'
                          : 'bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20'
                      }`}
                      title={chapter.locked ? t('app.examDetail.testChapterLocked') : t('app.examDetail.testChapterDesc')}
                    >
                      {chapter.locked ? <Lock size={12} /> : <Play size={12} />}
                      {chapter.locked ? t('app.examDetail.upgradeForAll') : t('app.examDetail.testChapter')}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  );
}
