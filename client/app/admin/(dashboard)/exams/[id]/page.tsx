'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronRight,
  Plus,
  X,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Clock,
  Target,
  Shuffle,
  BarChart3,
  Eye,
  Edit2,
  Loader2,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import type { Exam, Chapter, ChapterWithStats } from '@/types';

interface ExamDetail extends Omit<Exam, '_count'> {
  chapters: ChapterWithStats[];
  _count?: { chapters: number; questions: number };
}

interface QuestionStatusCount {
  approved: number;
  pending: number;
  rejected: number;
}

interface ChapterStats {
  id: string;
  number: number;
  name: string;
  isActive: boolean;
  questionCounts: QuestionStatusCount;
}

interface ExamAttempt {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  completedAt: string;
  user?: { name: string; email: string };
}

function StatsCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ?? 'bg-blue/10'}`}>
        <Icon size={18} className={accent ? 'text-white' : 'text-blue'} />
      </div>
      <div>
        <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-text-primary mt-0.5">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function QuestionCountBadge({ counts }: { counts: QuestionStatusCount }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-xs text-green">
        <CheckCircle2 size={12} />
        {counts.approved}
      </span>
      <span className="flex items-center gap-1 text-xs text-amber">
        <Clock3 size={12} />
        {counts.pending}
      </span>
      <span className="flex items-center gap-1 text-xs text-red">
        <XCircle size={12} />
        {counts.rejected}
      </span>
    </div>
  );
}

interface AddChapterModalProps {
  examId: string;
  examCode: string;
  existingChapters: Chapter[];
  onClose: () => void;
  onCreated: (chapter: Chapter) => void;
}

function AddChapterModal({ examId, examCode, existingChapters, onClose, onCreated }: AddChapterModalProps) {
  const maxNumber = existingChapters.length > 0
    ? Math.max(...existingChapters.map((c) => c.number))
    : 0;
  const [number, setNumber] = useState(maxNumber + 1);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/chapters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examId, number, name: name.trim() }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || `HTTP ${res.status}`);
      }
      const chapter = await res.json();
      onCreated(chapter);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'ajout du chapitre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Plus size={14} className="text-cyan" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Ajouter un chapitre</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-xs text-text-tertiary">
            Ajout du chapitre à <span className="text-blue font-mono font-medium">{examCode}</span>
          </p>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red/10 border border-red/20 rounded text-sm text-red">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Numéro du chapitre</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                min={1}
                required
                className="w-full px-3 py-2 bg-hover border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:border-blue/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Prochain disponible : <span className="text-green">{maxNumber + 1}</span>
              </label>
              <p className="text-[10px] text-text-tertiary pt-2">{existingChapters.length} chapitre(s) existant(s)</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Nom du chapitre <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Train d'atterrissage"
              maxLength={200}
              required
              className="w-full px-3 py-2 bg-hover border border-border rounded-btn text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-btn text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Ajouter un chapitre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings form state
  const [timeLimit, setTimeLimit] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [questionsPerSim, setQuestionsPerSim] = useState('');
  const [randomize, setRandomize] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Modal state
  const [showAddChapter, setShowAddChapter] = useState(false);

  // Attempts
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  const fetchExam = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams/${examId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        router.push('/auth/admin-login');
        return;
      }
      if (res.status === 404) { setError('Examen introuvable'); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setExam(data);

      // Populate settings from exam data (may be undefined if backend doesn't have these fields yet)
      if (data.timeLimit !== undefined) setTimeLimit(String(data.timeLimit));
      if (data.passingScore !== undefined) setPassingScore(String(data.passingScore));
      if (data.questionsPerSimulation !== undefined) setQuestionsPerSim(String(data.questionsPerSimulation));
      if (data.randomizeOrder !== undefined) setRandomize(data.randomizeOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du chargement de l\'examen');
    } finally {
      setLoading(false);
    }
  }, [examId, router]);

  // Fetch attempts — best effort, no dedicated endpoint
  const fetchAttempts = useCallback(async () => {
    if (!exam) return;
    setAttemptsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // Try analytics endpoint for exam stats
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/analytics/exams`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        const examData = Array.isArray(json) ? json : json.data ?? json;
        const match = examData.find((a: any) => a.examId === examId);
        if (match?.recentAttempts) {
          setAttempts(match.recentAttempts.slice(0, 5));
        }
      }
    } catch { /* silently fail */ }
    finally { setAttemptsLoading(false); }
  }, [exam, examId]);

  useEffect(() => { fetchExam(); }, [fetchExam]);
  useEffect(() => { if (exam) fetchAttempts(); }, [exam, fetchAttempts]);

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('token');
    if (!token || !exam) return;
    setSettingsLoading(true);
    setSettingsSaved(false);
    try {
      const body: Record<string, unknown> = {};
      if (timeLimit !== '') body.timeLimit = Number(timeLimit);
      if (passingScore !== '') body.passingScore = Number(passingScore);
      if (questionsPerSim !== '') body.questionsPerSimulation = Number(questionsPerSim);
      body.randomizeOrder = randomize;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams/${examId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch { /* fail silently */ }
    finally { setSettingsLoading(false); }
  };

  const handleChapterCreated = (chapter: Chapter) => {
    setExam((prev) =>
      prev
        ? {
            ...prev,
            chapters: [...prev.chapters, chapter as ChapterWithStats].sort((a, b) => a.number - b.number),
            _count: { chapters: (prev._count?.chapters ?? 0) + 1, questions: prev._count?.questions ?? 0 },
          }
        : prev
    );
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="skeleton h-6 w-64 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-card" />)}
        </div>
        <div className="skeleton h-64 rounded-card" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="p-8">
        <button
          onClick={() => router.push('/admin/exams')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Retour aux examens
        </button>
        <div className="flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error ?? 'Examen introuvable'}
        </div>
      </div>
    );
  }

  const chapters: ChapterStats[] = (exam.chapters ?? []).map((ch) => ({
    id: ch.id,
    number: ch.number,
    name: ch.name,
    isActive: ch.isActive,
    // Backend only returns approved count; pending/rejected are unknown until backend supports it
    questionCounts: {
      approved: typeof ch._count?.questions === 'object' && ch._count?.questions !== null
        ? (ch._count.questions as any).approved ?? 0
        : typeof ch._count?.questions === 'number'
        ? ch._count.questions
        : 0,
      pending: 0,
      rejected: 0,
    },
  }));

  const totalApproved = chapters.reduce((sum, c) => sum + c.questionCounts.approved, 0);
  const totalPending = chapters.reduce((sum, c) => sum + c.questionCounts.pending, 0);
  const totalRejected = chapters.reduce((sum, c) => sum + c.questionCounts.rejected, 0);

  return (
    <div className="p-8 animate-fade-in space-y-8">
      {/* Breadcrumb + header */}
      <div>
        <button
          onClick={() => router.push('/admin/exams')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Retour aux examens
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-tertiary mb-2">
              <span>Examens</span>
              <ChevronRight size={12} />
              <span className="font-mono text-blue">{exam.code}</span>
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">{exam.name}</h1>
            {exam.description && (
              <p className="text-sm text-text-secondary mt-1">{exam.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${
                exam.isActive
                  ? 'text-green bg-green/10 border-green/20'
                  : 'text-text-tertiary bg-hover border-border'
              }`}>
                {exam.isActive ? 'Actif' : 'Inactif'}
              </span>
              <span className="text-xs text-text-tertiary">{exam.country} · {exam.licenseType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={BookOpen}
          label="Total Chapitres"
          value={chapters.length}
          sub={`${exam._count?.chapters ?? chapters.length} configuré(s)`}
        />
        <StatsCard
          icon={CheckCircle2}
          label="Questions approuvées"
          value={totalApproved}
          accent="bg-green/10"
          sub={`dans ${chapters.length} chapitre${chapters.length !== 1 ? 's' : ''}`}
        />
        <StatsCard
          icon={Clock3}
          label="Questions en attente"
          value={totalPending}
          accent="bg-amber/10"
          sub="en attente de révision"
        />
        <StatsCard
          icon={XCircle}
          label="Questions rejetées"
          value={totalRejected}
          accent="bg-red/10"
          sub="non utilisées dans les examens"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapters section — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Chapitres</h2>
            <button
              onClick={() => setShowAddChapter(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue text-white rounded-btn text-xs font-medium hover:bg-blue/90 transition-colors"
            >
              <Plus size={13} />
              Ajouter un chapitre
            </button>
          </div>

          <div className="bg-card border border-border rounded-card overflow-hidden">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BookOpen size={24} className="text-text-tertiary mb-3" />
                <p className="text-sm text-text-secondary">Aucun chapitre pour l'instant</p>
                <p className="text-xs text-text-tertiary mt-1">Ajoutez des chapitres pour organiser les questions par sujet</p>
                <button
                  onClick={() => setShowAddChapter(true)}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue text-white rounded-btn text-xs font-medium hover:bg-blue/90 transition-colors"
                >
                  <Plus size={13} />
                  Ajouter le premier chapitre
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {chapters.map((ch) => (
                  <div key={ch.id} className="px-5 py-4 hover:bg-hover/30 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-blue bg-blue/10 border border-blue/20 rounded px-1.5 py-0.5">
                            Ch. {ch.number}
                          </span>
                          <p className="text-sm text-text-primary font-medium truncate">{ch.name}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5">
                          <QuestionCountBadge counts={ch.questionCounts} />
                          <span className="text-[10px] text-text-tertiary">
                            {ch.questionCounts.approved + ch.questionCounts.pending + ch.questionCounts.rejected} au total
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/admin/questions?chapterId=${ch.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/20 rounded-btn transition-colors"
                          title="Voir les questions"
                        >
                          <Eye size={12} />
                          Questions
                        </button>
                        <button
                          onClick={() => {/* edit chapter — future */}}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-amber hover:bg-amber/10 border border-transparent hover:border-amber/20 rounded-btn transition-colors"
                          title="Modifier le chapitre"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Settings + History */}
        <div className="space-y-6">
          {/* Settings */}
          <div>
            <h2 className="text-base font-semibold text-text-primary mb-4">Paramètres de l'examen</h2>
            <div className="bg-card border border-border rounded-card p-5 space-y-4">
              {/* Note if settings aren't saved to backend yet */}
              {exam.timeLimit === undefined && exam.passingScore === undefined && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber/5 border border-amber/20 rounded text-xs text-amber">
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                  Les paramètres ne sont pas encore persistés par le backend. L'enregistrement ici est local jusqu'à la mise à jour du schéma serveur.
                </div>
              )}

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-1.5">
                  <Clock size={12} className="text-cyan" />
                  Limite de temps (minutes)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="ex. 60"
                  min={1}
                  className="w-full px-3 py-2 bg-[#243047] border border-border rounded-btn text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-1.5">
                  <Target size={12} className="text-green" />
                  Score de réussite (%)
                </label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  placeholder="ex. 70"
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 bg-[#243047] border border-border rounded-btn text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-1.5">
                  <BarChart3 size={12} className="text-purple" />
                  Questions par simulation
                </label>
                <input
                  type="number"
                  value={questionsPerSim}
                  onChange={(e) => setQuestionsPerSim(e.target.value)}
                  placeholder="ex. 40"
                  min={1}
                  className="w-full px-3 py-2 bg-[#243047] border border-border rounded-btn text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-1.5">
                  <Shuffle size={12} className="text-amber" />
                  Ordre aléatoire des questions
                </label>
                <button
                  type="button"
                  onClick={() => setRandomize(!randomize)}
                  className={`flex items-center gap-2 w-full px-3 py-2 bg-[#243047] border rounded-btn text-sm transition-colors ${
                    randomize ? 'border-blue/30 text-blue' : 'border-border text-text-secondary'
                  }`}
                >
                  {randomize ? <Shuffle size={14} /> : <Shuffle size={14} opacity={0.4} />}
                  <span className={randomize ? 'text-blue' : 'text-text-secondary'}>
                    {randomize ? 'Oui — mélanger au démarrage' : 'Non — ordre fixe'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50"
                >
                  {settingsLoading && <Loader2 size={13} className="animate-spin" />}
                  Enregistrer les paramètres
                </button>
                {settingsSaved && (
                  <span className="text-xs text-green flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Enregistré
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Exam History */}
          <div>
            <h2 className="text-base font-semibold text-text-primary mb-4">Recent Attempts</h2>
            <div className="bg-card border border-border rounded-card overflow-hidden">
              {attemptsLoading ? (
                <div className="p-5 space-y-3">
                  {[0, 1, 2].map((i) => <div key={i} className="skeleton h-10 rounded" />)}
                </div>
              ) : attempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <Users size={20} className="text-text-tertiary mb-2" />
                  <p className="text-xs text-text-secondary text-center">
                    No attempts yet
                  </p>
                  <p className="text-[10px] text-text-tertiary text-center mt-0.5">
                    Student attempts will appear here once the exam is published.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="px-4 py-3 hover:bg-hover/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-text-primary truncate">
                            {attempt.user?.name ?? 'Unknown user'}
                          </p>
                          <p className="text-[10px] text-text-tertiary">
                            {new Date(attempt.completedAt).toLocaleDateString('en-CA', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-semibold ${
                            (attempt.correctCount / attempt.totalQuestions) * 100 >= (exam.passingScore ?? 70)
                              ? 'text-green'
                              : 'text-red'
                          }`}>
                            {attempt.correctCount}/{attempt.totalQuestions}
                          </p>
                          <p className="text-[10px] text-text-tertiary">
                            {Math.round((attempt.correctCount / attempt.totalQuestions) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <AddChapterModal
          examId={exam.id}
          examCode={exam.code}
          existingChapters={exam.chapters ?? []}
          onClose={() => setShowAddChapter(false)}
          onCreated={handleChapterCreated}
        />
      )}
    </div>
  );
}
