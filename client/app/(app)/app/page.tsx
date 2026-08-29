'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Target,
  BarChart3,
  Award,
  Trophy,
  CheckCircle2,
  ListChecks,
  History,
  Minus,
  AlertTriangle,
  Brain,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import type { StudentStats, ExamPerformance, UserExamAttempt, ChapterStat } from '@/types/student';
import { getStudentStats, resetStudentStats } from '@/lib/student-api';
import { useLocale } from '@/src/contexts/LocaleContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

// ─── Skeleton component ────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-border rounded" />
        <div className="h-8 w-8 rounded-lg bg-border" />
      </div>
      <div className="h-7 w-16 bg-border rounded mt-1" />
      <div className="h-3 w-20 bg-border rounded mt-2" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="h-4 w-32 bg-border rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-40 bg-border rounded flex-1" />
            <div className="h-4 w-12 bg-border rounded" />
            <div className="h-4 w-16 bg-border rounded" />
            <div className="h-4 w-24 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const colorMap = {
  blue: { bg: 'bg-blue/10', text: 'text-blue', icon: 'text-blue' },
  green: { bg: 'bg-green/10', text: 'text-green', icon: 'text-green' },
  amber: { bg: 'bg-amber/10', text: 'text-amber', icon: 'text-amber' },
  purple: { bg: 'bg-purple/10', text: 'text-purple', icon: 'text-purple' },
  red: { bg: 'bg-red/10', text: 'text-red', icon: 'text-red' },
};

function StatCard({ title, value, icon, subtitle, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-card p-5 hover:border-blue/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {title}
        </span>
        <div className={`h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <div className={c.icon}>{icon}</div>
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

// ─── Performance by Exam Section ─────────────────────────────

function PerformanceSection({ byExam }: { byExam: ExamPerformance[] }) {
  const { t, locale } = useLocale();
  const fr = false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border border-border rounded-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <BarChart3 size={16} className="text-text-tertiary" />
          {t('performanceTitle')}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('exams')}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('attempts')}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('avgScore')}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('bestScore')}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('lastScore')}</th>
              <th className="text-center px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('trending')}</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">{t('passRate')}</th>
            </tr>
          </thead>
          <tbody>
            {byExam.map((exam, i) => {
              const trending = exam.lastScore >= exam.averageScore;
              const isCombined = exam.examCode.endsWith('-COMBINED');
              return (
                <motion.tr
                  key={exam.examId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className={`border-b border-border/50 last:border-b-0 transition-colors ${
                    isCombined ? '' : 'hover:bg-hover/30 cursor-pointer'
                  }`}
                  onClick={isCombined ? undefined : () => window.location.href = `/exams/${exam.examId}`}
                >
                  <td className="px-5 py-3 text-text-primary font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue/10 text-blue font-mono">{exam.examCode}</span>
                      <span>{fr ? exam.examNameFr : exam.examName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-text-primary font-mono tabular-nums">{exam.totalAttempts}</td>
                  <td className={`px-5 py-3 text-right font-mono tabular-nums ${exam.averageScore >= 70 ? 'text-green' : 'text-amber'}`}>
                    {exam.averageScore}%
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-green">{exam.bestScore}%</td>
                  <td className={`px-5 py-3 text-right font-mono tabular-nums ${exam.lastScore >= 70 ? 'text-green' : 'text-red'}`}>
                    {exam.lastScore}%
                  </td>
                  <td className="px-5 py-3 text-center">
                    {trending ? (
                      <TrendingUp size={16} className="text-green mx-auto" />
                    ) : (
                      <TrendingDown size={16} className="text-red mx-auto" />
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${exam.passRate >= 70 ? 'text-green' : 'text-red'}`}>
                      {exam.passedCount}/{exam.totalAttempts}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {byExam.length === 0 && (
        <div className="px-5 py-8 text-center text-sm text-text-secondary">
          {t('noAttempts')}
        </div>
      )}
    </motion.div>
  );
}

// ─── Time-ago helper ────────────────────────────────────────────

function timeAgo(iso: string, t: (path: string, vars?: Record<string, string | number>) => string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t('timeAgoNow');
  if (mins < 60) return t('timeAgoMin', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('timeAgoHour', { count: hours });
  const days = Math.floor(hours / 24);
  return t('timeAgoDay', { count: days });
}

// ─── Recent Attempts Section ────────────────────────────────────

function RecentAttemptsSection({ attempts }: { attempts: UserExamAttempt[] }) {
  const { t, locale } = useLocale();
  const fr = false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <History size={16} className="text-text-tertiary" />
          {t('recentAttempts')}
        </h2>
      </div>
      <div className="divide-y divide-border/50">
        {attempts.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.03 }}
            className={`flex items-center gap-4 px-5 py-3 transition-colors ${
              a.examCode.endsWith('-COMBINED') ? '' : 'hover:bg-hover/30 cursor-pointer'
            }`}
            onClick={a.examCode.endsWith('-COMBINED') ? undefined : () => (window.location.href = `/results/${a.id}`)}
          >
            <span
              className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                a.passed ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
              }`}
            >
              {a.score}%
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue/10 text-blue font-mono mr-2">{a.examCode}</span>
                {fr ? a.examNameFr : a.examName}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {a.correctCount}/{a.totalQuestions} · {timeAgo(a.completedAt, t)}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                a.passed ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
              }`}
            >
              {a.passed ? t('passed') : t('failed')}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Chapter Analysis Section (Strengths / Areas to Improve / Needs review) ──

function ChapterAnalysis({
  strengths,
  weaknesses,
  needsReview,
}: {
  strengths: ChapterStat[];
  weaknesses: ChapterStat[];
  needsReview: ChapterStat[];
}) {
  const { t, locale } = useLocale();
  const fr = false;

  const chapterLabel = (c: ChapterStat) =>
    `${fr ? c.examNameFr : c.examName} > ${fr ? c.chapterNameFr : c.chapterName}`;

  const hasAny =
    strengths.length > 0 || weaknesses.length > 0 || needsReview.length > 0;
  if (!hasAny) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-4"
    >
      {/* Strengths / Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-green" />
            <h3 className="font-semibold text-text-primary">{t('chapterStrengths')}</h3>
          </div>
          {strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((s) => (
                <div key={s.chapterId}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-text-secondary truncate pr-2">{chapterLabel(s)}</span>
                    <span className="text-green font-medium flex-shrink-0">{s.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                    <div className="h-full bg-green rounded-full" style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('chapterNoData')}</p>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red" />
            <h3 className="font-semibold text-text-primary">{t('chapterAreasToImprove')}</h3>
          </div>
          {weaknesses.length > 0 ? (
            <div className="space-y-2">
              {weaknesses.map((w) => (
                <div key={w.chapterId}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-text-secondary truncate pr-2">{chapterLabel(w)}</span>
                    <span className="text-red font-medium flex-shrink-0">{w.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                    <div className="h-full bg-red rounded-full" style={{ width: `${w.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('chapterNoData')}</p>
          )}

          {needsReview.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-text-secondary mb-1.5">{t('chapterNeedsReview')}</p>
              <div className="flex flex-wrap gap-1.5">
                {needsReview.map((ch) => (
                  <Link
                    key={ch.chapterId}
                    href={`/theory?examId=${ch.examId}&chapterId=${ch.chapterId}`}
                    className="text-xs bg-red/10 border border-red/20 text-red px-2 py-0.5 rounded-full hover:bg-red/20 transition-colors"
                  >
                    {chapterLabel(ch)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chapter Performance Section ────────────────────────────────

function ChapterDonut({ percentage }: { percentage: number }) {
  const isPass = percentage >= 70;
  const isWarn = percentage >= 50 && !isPass;
  const color = isPass ? '#10B981' : isWarn ? '#F59E0B' : '#EF4444';
  const textColor = isPass ? 'text-green' : isWarn ? 'text-amber' : 'text-red';
  const R = 15.9155; // circumference = 100
  const offset = 100 - Math.min(percentage, 100);
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 42 42" className="h-14 w-14 -rotate-90">
        <circle cx="21" cy="21" r={R} fill="none" stroke="#2A4068" strokeWidth="4" />
        <circle
          cx="21"
          cy="21"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
}

function ChapterPerformanceSection({ chapterPerformance }: { chapterPerformance: ChapterStat[] }) {
  const { t, locale } = useLocale();
  const fr = false;
  if (chapterPerformance.length === 0) return null;
  const sorted = [...chapterPerformance].sort((a, b) => b.percentage - a.percentage);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {/* Performance by Chapter */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Brain size={18} className="text-purple" />
          {t('chapterPerformance')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map((ch) => (
            <Link
              key={ch.chapterId}
              href={`/exams/${ch.examId}?chapterId=${ch.chapterId}`}
              className="group bg-card border border-border rounded-card p-4 flex items-center gap-4 transition-colors hover:border-blue/50 hover:bg-hover/20"
              aria-label={`${fr ? ch.chapterNameFr : ch.chapterName} — ${t('chapterPerformancePractice')}`}
            >
              <ChapterDonut percentage={ch.percentage} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-blue transition-colors">
                  {fr ? ch.chapterNameFr : ch.chapterName}
                </p>
                <p className="text-[11px] text-text-tertiary truncate mt-1 flex items-center gap-1.5">
                  <span className="text-xs px-1 py-px rounded bg-blue/10 text-blue font-mono shrink-0">
                    {ch.examCode}
                  </span>
                  <span className="truncate">{fr ? ch.examNameFr : ch.examName}</span>
                </p>
                <p className="text-[11px] text-text-tertiary tabular-nums mt-1">
                  {ch.correct}/{ch.attempted}
                  {ch.total > ch.attempted && (
                    <span className="text-text-tertiary/60"> · {ch.total} {fr ? 'en chapitre' : 'in chapter'}</span>
                  )}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-text-tertiary/50 group-hover:text-blue group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Error State ────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="h-14 w-14 rounded-full bg-red/10 flex items-center justify-center">
        <XCircle size={28} className="text-red" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-text-primary">
          {t('somethingWentWrong')}
        </h3>
        <p className="text-sm text-text-secondary mt-1 max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-btn bg-card border border-border text-text-primary text-sm font-medium hover:bg-hover transition-colors"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}

// ─── Main Dashboard Page ───────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const { t, locale } = useLocale();
  const fr = false;

  function loadStats() {
    setLoading(true);
    setError(null);
    getStudentStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || t('somethingWentWrong'));
        setLoading(false);
      });
  }

  async function handleResetStats() {
    setResetting(true);
    setResetError(null);
    try {
      await resetStudentStats();
      setShowResetModal(false);
      loadStats();
    } catch (err) {
      setResetError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.title = `${t('dashboard')} | Inspect Practice`;
  }, [t]);

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t('dashboard')}</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Skeleton table */}
        <TableSkeleton />
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t('dashboard')}</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadStats} />
      </div>
    );
  }

  // ── Loaded state ────────────────────────────────────────
  const {
    totalExams,
    totalAttempts,
    averageScore,
    passRate,
    studyStreak,
    byExam,
    recentAttempts,
    bestScore,
    examsPassedUnique,
    totalQuestionsAnswered,
    totalCorrect,
    momentum,
    lastAttemptAt,
    chapterPerformance = [],
    strengths = [],
    weaknesses = [],
    needsReview = [],
  } = stats!;
  const totalPassed = byExam.reduce((sum, e) => sum + e.passedCount, 0);
  const accuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t('dashboard')}</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {t('subtitle')}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResetModal(true)}
          className="shrink-0 border-red/30 text-red hover:bg-red/10 hover:border-red/40"
        >
          <Trash2 size={14} className="mr-1.5" />
          {t('resetStats')}
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Link href="/exams">
          <StatCard
            title={t('examsAvailable')}
            value={totalExams}
            icon={<BookOpen size={16} />}
            color="blue"
            subtitle={t('practicedCount', { practiced: byExam.length, total: totalExams })}
          />
        </Link>
        <StatCard
          title={t('totalAttempts')}
          value={totalAttempts}
          icon={<Zap size={16} />}
          color="purple"
          subtitle={t('attemptsSubtitle')}
        />
        <StatCard
          title={t('averageScore')}
          value={`${Math.round(averageScore)}%`}
          icon={<TrendingUp size={16} />}
          color={averageScore >= 70 ? 'green' : 'amber'}
          subtitle={
            totalAttempts === 1
              ? t('scoreContext').replace('{count}', '1')
              : t('scoreContextPlural').replace('{count}', String(totalAttempts))
          }
        />
        <StatCard
          title={t('passRate')}
          value={`${Math.round(passRate)}%`}
          icon={<Target size={16} />}
          color={passRate >= 70 ? 'green' : 'amber'}
          subtitle={totalAttempts === 0 ? t('yet') : `${totalPassed} / ${totalAttempts} ≥70%`}
        />
        <StatCard
          title={t('studyStreak')}
          value={studyStreak === 1 ? t('studyStreakValue', { count: studyStreak }) : t('studyStreakValuePlural', { count: studyStreak })}
          icon={<Clock size={16} />}
          color="amber"
          subtitle={t('streakSubtitle')}
        />
      </div>

      {/* Insights row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title={t('personalBest')}
          value={`${bestScore}%`}
          icon={<Trophy size={16} />}
          color={bestScore >= 70 ? 'green' : 'amber'}
          subtitle={t('personalBestSubtitle')}
        />
        <StatCard
          title={t('examsPassed')}
          value={`${examsPassedUnique}/${totalExams}`}
          icon={<CheckCircle2 size={16} />}
          color={examsPassedUnique > 0 ? 'green' : 'amber'}
          subtitle={t('examsPassedSubtitle', { count: examsPassedUnique, total: totalExams })}
        />
        <StatCard
          title={t('questionsAnswered')}
          value={totalQuestionsAnswered}
          icon={<ListChecks size={16} />}
          color="blue"
          subtitle={t('questionsAnsweredSubtitle', { correct: `${totalCorrect} (${accuracy}%)` })}
        />
        <StatCard
          title={t('momentum')}
          value={
            momentum > 0
              ? `+${momentum}%`
              : momentum < 0
                ? `${momentum}%`
                : '±0%'
          }
          icon={
            momentum > 0 ? (
              <TrendingUp size={16} />
            ) : momentum < 0 ? (
              <TrendingDown size={16} />
            ) : (
              <Minus size={16} />
            )
          }
          color={momentum > 0 ? 'green' : momentum < 0 ? 'red' : 'amber'}
          subtitle={
            totalAttempts < 2
              ? t('momentumSubtitle')
              : momentum > 0
                ? t('momentumUp')
                : momentum < 0
                  ? t('momentumDown')
                  : t('momentumFlat')
          }
        />
        <StatCard
          title={t('lastActivity')}
          value={lastAttemptAt ? timeAgo(lastAttemptAt, t) : t('yet')}
          icon={<History size={16} />}
          color="purple"
          subtitle={t('lastActivitySubtitle')}
        />
      </div>

      {/* Strength / Weakness cards */}
      {byExam.length >= 1 && (() => {
        const sorted = [...byExam].sort((a, b) => b.averageScore - a.averageScore);
        const strongest = sorted[0].averageScore > 0 ? sorted[0] : null;
        // Weakest = lowest average score, shown as soon as it's below 70% (no attempts gate)
        const weakest = sorted[sorted.length - 1].averageScore < 70 ? sorted[sorted.length - 1] : null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {strongest && (
              <div
                className={`bg-card border border-green/20 rounded-card p-4 transition-colors ${
                  strongest.examCode.endsWith('-COMBINED') ? '' : 'cursor-pointer hover:bg-hover/30'
                }`}
                onClick={strongest.examCode.endsWith('-COMBINED') ? undefined : () => window.location.href = `/exams/${strongest.examId}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award size={14} className="text-green" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-green">{t('strength')}</span>
                </div>
                <p className="text-sm font-medium text-text-primary truncate">{strongest.examCode} — {fr ? strongest.examNameFr : strongest.examName}</p>
                <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                  <span>{t('avgShort')} <span className="text-green font-semibold">{strongest.averageScore}%</span></span>
                  <span>{t('bestShort')} <span className="text-green font-semibold">{strongest.bestScore}%</span></span>
                  <span>{strongest.totalAttempts} {t('attemptsShort')}</span>
                </div>
              </div>
            )}
            {weakest && (
              <div
                className={`bg-card border border-red/20 rounded-card p-4 transition-colors ${
                  weakest.examCode.endsWith('-COMBINED') ? '' : 'cursor-pointer hover:bg-hover/30'
                }`}
                onClick={weakest.examCode.endsWith('-COMBINED') ? undefined : () => window.location.href = `/exams/${weakest.examId}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-red" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red">{t('weakness')}</span>
                </div>
                <p className="text-sm font-medium text-text-primary truncate">{weakest.examCode} — {fr ? weakest.examNameFr : weakest.examName}</p>
                <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                  <span>{t('avgShort')} <span className="text-red font-semibold">{weakest.averageScore}%</span></span>
                  <span>{t('bestShort')} <span className="text-amber font-semibold">{weakest.bestScore}%</span></span>
                  <span>{weakest.totalAttempts} {t('attemptsShort')}</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* Chapter analysis — Strengths / Areas to Improve / Needs review */}
      <ChapterAnalysis
        strengths={strengths}
        weaknesses={weaknesses}
        needsReview={needsReview}
      />

      {/* Performance by exam */}
      {byExam.length > 0 && <PerformanceSection byExam={byExam} />}

      {/* Performance by chapter — right after exam performance, no cards between */}
      <ChapterPerformanceSection chapterPerformance={chapterPerformance} />

      {/* Recent attempts */}
      {recentAttempts.length > 0 && <RecentAttemptsSection attempts={recentAttempts} />}

      {/* Reset stats confirmation modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={t('resetStatsConfirmTitle')}
        description={t('resetStatsConfirmDesc')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowResetModal(false)} disabled={resetting}>
              {t('resetStatsCancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleResetStats}
              disabled={resetting}
            >
              {resetting ? t('loading') : t('resetStatsConfirm')}
            </Button>
          </>
        }
      >
        {resetError && (
          <p className="text-sm text-red">{resetError}</p>
        )}
      </Modal>
    </div>
  );
}
