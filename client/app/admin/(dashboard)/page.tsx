'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  History,
  AlertCircle,
  HelpCircle,
  DollarSign,
  BookOpen,
  CheckCircle2,
  XCircle,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Types ───────────────────────────────────────────────────

interface DashboardData {
  totalUsers: number;
  userGrowth: number;
  activeSubscriptions: number;
  totalExamsTaken: number;
  overallPassRate: number;
  activeUsersToday: number;
  userGrowthData: Array<{ date: string; count: number }>;
  revenueByMonth: Array<{ month: string; amount: number }>;
  questionsByDifficulty: { easy: number; medium: number; hard: number };
  passRateByExam: Array<{ examCode: string; passRate: number; totalAttempts: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    user?: { name: string; email: string };
    details?: Record<string, unknown>;
  }>;
  recentAttempts: Array<{
    id: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    completedAt: string;
    user: { id: string; name: string; email: string };
    exam: { code: string; name: string };
  }>;
  recentAnswers: Array<{
    id: string;
    userAnswer: string;
    isCorrect: boolean;
    question: { id: string; text: string; difficulty: string };
    user: { id: string; name: string; email: string } | null;
    completedAt: string;
  }>;
  recentChats: Array<{
    id: string;
    topic: string | null;
    source: string;
    messageCount: number;
    updatedAt: string;
    user: { id: string; name: string; email: string };
  }>;
  topFailedQuestions: Array<{
    id: string;
    question: string;
    difficulty: string;
    passRate: number;
    totalAttempts: number;
  }>;
}

const DATE_RANGES = [
  { label: '7 jours', value: 7 },
  { label: '30 jours', value: 30 },
  { label: '90 jours', value: 90 },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

const TOOLTIP_STYLE = {
  backgroundColor: '#1A2035',
  border: '1px solid #2D3A52',
  borderRadius: 8,
  color: '#F8FAFC',
  fontSize: 12,
};

// ─── Helpers ─────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-6">
      <div className="skeleton h-4 w-28 rounded mb-3" />
      <div className="skeleton h-9 w-20 rounded mb-2" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}j`;
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('fr', { month: 'short', year: '2-digit' });
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('fr-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ─── Auth redirect ───────────────────────────────────────────

function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.push('/auth/admin-login'); }, [router]);
  return null;
}

// ─── Main component ──────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(typeof window !== 'undefined' ? !!localStorage.getItem('token') : false);
  }, []);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/analytics/dashboard?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setHasToken(false);
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // Compute userGrowth % vs previous period
      const currentPeriodUsers = json.totalUsers;
      const growthArr = json.userGrowth ?? [];
      const halfPoint = Math.floor(growthArr.length / 2);
      const prevPeriodUsers = growthArr
        .slice(0, halfPoint)
        .reduce((sum: number, g: { count: number }) => sum + g.count, 0);
      const userGrowth = prevPeriodUsers > 0
        ? Math.round(((currentPeriodUsers - prevPeriodUsers) / prevPeriodUsers) * 100)
        : 0;

      setData({
        ...json,
        userGrowth,
        userGrowthData: growthArr,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (hasToken) fetchDashboard();
  }, [hasToken, fetchDashboard]);

  if (hasToken === false) return <AdminLoginRedirect />;

  if (hasToken === null || (loading && data === null && error === null)) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  // ─── Derived metrics ─────────────────────────────────────

  const totalQuestions = data
    ? Object.values(data.questionsByDifficulty).reduce((a, b) => a + b, 0)
    : 0;

  const revenueThisMonth = data?.revenueByMonth?.length
    ? data.revenueByMonth[data.revenueByMonth.length - 1].amount
    : 0;

  const stats = [
    {
      label: 'Utilisateurs',
      value: data?.totalUsers ?? '—',
      trend: data ? (data.userGrowth >= 0 ? `+${data.userGrowth}%` : `${data.userGrowth}%`) : null,
      up: data ? data.userGrowth >= 0 : true,
      icon: Users,
      color: 'text-blue',
      href: '/admin/users',
    },
    {
      label: 'Abonnements actifs',
      value: data?.activeSubscriptions ?? '—',
      trend: null,
      up: true,
      icon: CreditCard,
      color: 'text-green',
      href: '/admin/subscriptions',
    },
    {
      label: 'Examens passés',
      value: data?.totalExamsTaken ?? '—',
      trend: null,
      up: true,
      icon: FileText,
      color: 'text-cyan',
      href: '/admin/exams',
    },
    {
      label: 'Taux de réussite',
      value: data ? `${data.overallPassRate}%` : '—%',
      trend: null,
      up: data ? data.overallPassRate >= 70 : true,
      icon: TrendingUp,
      color: 'text-amber',
      href: null,
    },
    {
      label: 'Banque de questions',
      value: totalQuestions || '—',
      trend: null,
      up: true,
      icon: BookOpen,
      color: 'text-purple',
      href: '/admin/questions',
    },
    {
      label: 'Revenus (mois)',
      value: formatCurrency(revenueThisMonth),
      trend: null,
      up: true,
      icon: DollarSign,
      color: 'text-green',
      href: null,
    },
    {
      label: 'Actifs aujourd\'hui',
      value: data?.activeUsersToday ?? 0,
      trend: null,
      up: true,
      icon: UserCheck,
      color: 'text-cyan',
      href: null,
    },
  ];

  // ─── Chart data ──────────────────────────────────────────

  const difficultyData = data
    ? Object.entries(data.questionsByDifficulty).map(([key, value]) => ({
        name: DIFFICULTY_LABELS[key] ?? key,
        value,
        fill: DIFFICULTY_COLORS[key] ?? '#64748B',
      }))
    : [];

  const revenueData = (data?.revenueByMonth ?? []).map((r) => ({
    ...r,
    month: formatMonthLabel(r.month),
    dollars: Math.round(r.amount / 100),
  }));

  const userGrowthData = (data?.userGrowthData ?? []).map((g) => ({
    ...g,
    date: new Date(g.date).toLocaleDateString('fr', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="p-8 animate-fade-in">
      {/* Header + date range */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Tableau de bord</h1>
          <p className="text-sm text-text-secondary mt-1">
            Vue d'ensemble de Inspect Practice
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-btn p-1">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1.5 text-sm rounded-btn transition-colors ${
                dateRange === range.value
                  ? 'bg-blue text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Stat cards — 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(({ label, value, trend, up, icon: Icon, color, href }) => (
              <div
                key={label}
                onClick={() => href && router.push(href)}
                className={`bg-card border border-border rounded-card p-5 card-glow ${
                  href ? 'cursor-pointer hover:bg-hover transition-colors' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-secondary text-xs">{label}</p>
                    <p className={`text-2xl font-bold text-text-primary mt-1.5 ${color}`}>
                      {value}
                    </p>
                    {trend !== null && (
                      <p className={`text-[10px] mt-1 flex items-center gap-1 ${up ? 'text-green' : 'text-red'}`}>
                        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {trend} vs période préc.
                      </p>
                    )}
                  </div>
                  <Icon size={18} className={color} strokeWidth={1.75} />
                </div>
              </div>
            ))}
      </div>

      {/* Charts 2x2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Croissance des utilisateurs</h3>
          {loading ? (
            <div className="h-48 skeleton rounded" />
          ) : userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="count" stroke="#C8102E" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Nouveaux" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-tertiary text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Revenue */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Revenus par mois</h3>
          {loading ? (
            <div className="h-48 skeleton rounded" />
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => [`$${value}`, 'Revenu']} />
                <Bar dataKey="dollars" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-tertiary text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Questions by Difficulty */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Questions par difficulté</h3>
          {loading ? (
            <div className="h-48 skeleton rounded" />
          ) : difficultyData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {difficultyData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {difficultyData.map(({ name, value, fill }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fill }} />
                    <span className="text-sm text-text-secondary">
                      {name}: <span className="text-text-primary font-medium">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-tertiary text-sm">Aucune donnée</div>
          )}
        </div>

        {/* Pass Rate by Exam */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Taux de réussite par examen</h3>
          {loading ? (
            <div className="h-48 skeleton rounded" />
          ) : data?.passRateByExam && data.passRateByExam.length > 0 ? (
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={data.passRateByExam} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A52" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2D3A52' }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="examCode" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => [`${value}%`, 'Réussite']} />
                <Bar dataKey="passRate" fill="#D4A843" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-tertiary text-sm">Aucune donnée</div>
          )}
        </div>
      </div>

      {/* Tables: Activity + Top Failed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Activité récente</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="skeleton h-2 w-2 rounded-full" />
                  <div className="skeleton h-3 w-40 rounded" />
                </div>
              ))}
            </div>
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {data.recentActivity.slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <History size={13} className="text-text-tertiary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-secondary leading-snug">
                      <span className="text-text-primary font-medium">{log.user?.name ?? 'Système'}</span>
                      {' — '}
                      {log.action.replace(/_/g, ' ').toLowerCase()}
                      {(() => {
                        const d = log.details as Record<string, string> | undefined;
                        if (d?.targetEmail) return <span className="text-text-tertiary"> — {d.targetName ?? d.targetEmail}</span>;
                        return null;
                      })()}
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{formatRelativeTime(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-tertiary">Aucune activité</div>
          )}
        </div>

        {/* Top Failed Questions */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Questions les plus échouées</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-3 w-full rounded" />
              ))}
            </div>
          ) : data?.topFailedQuestions && data.topFailedQuestions.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {data.topFailedQuestions.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-xs text-text-tertiary w-4 text-right flex-shrink-0 mt-0.5">{idx + 1}.</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-secondary leading-snug line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: DIFFICULTY_COLORS[q.difficulty] ?? '#64748B' }}
                      >
                        {DIFFICULTY_LABELS[q.difficulty] ?? q.difficulty}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        {q.passRate}% réussite · {q.totalAttempts} tentatives
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-tertiary">Aucune donnée</div>
          )}
        </div>
      </div>

      {/* Activity monitoring — 3 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Recent Exam Attempts */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Derniers examens complétés</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded" />
              ))}
            </div>
          ) : data?.recentAttempts && data.recentAttempts.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentAttempts.map((a) => {
                const passed = a.score >= 70;
                return (
                  <div key={a.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-hover transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? 'bg-green/15' : 'bg-red/15'}`}>
                      {passed ? <CheckCircle2 size={14} className="text-green" /> : <XCircle size={14} className="text-red" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary truncate">{a.user.name || a.user.email}</p>
                      <p className="text-[10px] text-text-tertiary">
                        {a.exam.code} · {a.correctCount}/{a.totalQuestions} · {Math.round(a.score)}%
                      </p>
                    </div>
                    <span className="text-[10px] text-text-tertiary flex-shrink-0">{formatRelativeTime(a.completedAt)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-tertiary">Aucun examen</div>
          )}
        </div>

        {/* Recent Answered Questions */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Dernières questions répondues</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded" />
              ))}
            </div>
          ) : data?.recentAnswers && data.recentAnswers.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentAnswers.map((aq) => (
                <div key={aq.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-hover transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${aq.isCorrect ? 'bg-green/15' : 'bg-red/15'}`}>
                    {aq.isCorrect ? <CheckCircle2 size={12} className="text-green" /> : <XCircle size={12} className="text-red" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-secondary leading-snug line-clamp-2">{aq.question.text}</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">
                      {aq.user?.name ?? aq.user?.email ?? 'Inconnu'} · {formatRelativeTime(aq.completedAt)}
                    </p>
                  </div>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded text-white flex-shrink-0"
                    style={{ backgroundColor: DIFFICULTY_COLORS[aq.question.difficulty.toLowerCase()] ?? '#64748B' }}
                  >
                    {DIFFICULTY_LABELS[aq.question.difficulty.toLowerCase()] ?? aq.question.difficulty}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-tertiary">Aucune réponse</div>
          )}
        </div>

        {/* Recent Chat Sessions */}
        <div className="bg-card border border-border rounded-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Conversations tuteur récentes</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-10 w-full rounded" />
              ))}
            </div>
          ) : data?.recentChats && data.recentChats.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.recentChats.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => router.push(`/admin/users/${cs.user.id}?chat=${cs.id}`)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-hover transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-blue/15 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={14} className="text-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary truncate">{cs.user.name || cs.user.email}</p>
                    <p className="text-[10px] text-text-tertiary">
                      {cs.topic ?? 'Sans sujet'} · {cs.messageCount} messages
                    </p>
                  </div>
                  <span className="text-[10px] text-text-tertiary flex-shrink-0">{formatRelativeTime(cs.updatedAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-text-tertiary">Aucune conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
