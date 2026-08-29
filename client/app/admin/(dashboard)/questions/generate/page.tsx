'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Exam {
  id: string;
  code: string;
  name: string;
}

interface Chapter {
  id: string;
  number: number;
  name: string;
  exam: { id: string; code: string; name: string };
}

export default function AIGeneratorPage() {
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [examId, setExamId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [type, setType] = useState<'MCQ' | 'TRUEFALSE' | 'WRITTEN'>('MCQ');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [count, setCount] = useState(10);

  const [loadingExams, setLoadingExams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Fetch exams on mount
  useEffect(() => {
    async function fetchExams() {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setExams(json.data ?? []);
      } catch {
        setResult({ ok: false, message: 'Échec du chargement des examens.' });
      } finally {
        setLoadingExams(false);
      }
    }
    fetchExams();
  }, []);

  // Fetch chapters when exam changes
  useEffect(() => {
    if (!examId) { setChapters([]); setChapterId(''); return; }

    async function fetchChapters() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams/chapters/list?examId=${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setChapters(json.data ?? []);
        setChapterId('');
      } catch {
        setResult({ ok: false, message: 'Échec du chargement des chapitres.' });
      }
    }
    fetchChapters();
  }, [examId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/admin-login'); return; }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examId, chapterId, type, difficulty, count }),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        setResult({ ok: false, message: data.message ?? 'Échec de la génération. Veuillez réessayer.' });
        setSubmitting(false);
        return;
      }

      const selectedExam = exams.find((ex) => ex.id === examId);
      const selectedChapter = chapters.find((ch) => ch.id === chapterId);
      setResult({
        ok: true,
        message: `Génération lancée pour ${count} question${count > 1 ? 's' : ''} ${type} (${difficulty === 'EASY' ? 'Facile' : difficulty === 'MEDIUM' ? 'Moyenne' : 'Difficile'}) — ${selectedExam?.code} Chap.${selectedChapter?.number}. Les questions apparaîtront dans la file de révision sous peu.`,
      });
      setSubmitting(false);
    } catch {
      setResult({ ok: false, message: 'Impossible de se connecter au serveur.' });
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-btn bg-purple/10 border border-purple/20">
            <Sparkles size={18} className="text-purple" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Générateur IA</h1>
        </div>
        <p className="text-sm text-text-secondary">
          Générez des questions d'examen avec l'IA. Les résultats sont enregistrés comme en attente et nécessitent une révision.
        </p>
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`flex items-start gap-3 px-4 py-3 mb-6 border rounded-card text-sm ${
            result.ok
              ? 'bg-green/10 border-green/20 text-green'
              : 'bg-red/10 border-red/20 text-red'
          }`}
        >
          {result.ok ? (
            <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          )}
          <span>{result.message}</span>
        </div>
      )}

      {/* Form card */}
      <div className="bg-card border border-border rounded-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Exam */}
          <div>
            <label htmlFor="exam" className="block text-sm font-medium text-text-secondary mb-1.5">
              Examen
            </label>
            <div className="relative">
              <select
                id="exam"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                required
                disabled={loadingExams}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#0A0E1A] text-text-primary">
                  {loadingExams ? 'Chargement des examens...' : 'Sélectionnez un examen'}
                </option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id} className="bg-[#0A0E1A] text-text-primary">
                    {exam.code} — {exam.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
            </div>
          </div>

          {/* Chapter */}
          <div>
            <label htmlFor="chapter" className="block text-sm font-medium text-text-secondary mb-1.5">
              Chapitre
            </label>
            <div className="relative">
              <select
                id="chapter"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                required
                disabled={!examId || chapters.length === 0}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors cursor-pointer disabled:opacity-50"
              >
                <option value="" className="bg-[#0A0E1A] text-text-primary">
                  {!examId ? `Sélectionnez d'abord un examen` : chapters.length === 0 ? 'Aucun chapitre trouvé' : 'Sélectionnez un chapitre'}
                </option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id} className="bg-[#0A0E1A] text-text-primary">
                    Chapitre {ch.number} — {ch.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
            </div>
          </div>

          {/* Type + Difficulty (2-col grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1.5">
                Type de question
              </label>
              <div className="relative">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors cursor-pointer"
                >
                  <option value="MCQ" className="bg-[#0A0E1A] text-text-primary">MCQ</option>
                  <option value="TRUEFALSE" className="bg-[#0A0E1A] text-text-primary">Vrai / Faux</option>
                  <option value="WRITTEN" className="bg-[#0A0E1A] text-text-primary">Écrite</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-text-secondary mb-1.5">
                Difficulté
              </label>
              <div className="relative">
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors cursor-pointer"
                >
                  <option value="EASY" className="bg-[#0A0E1A] text-text-primary">Facile</option>
                  <option value="MEDIUM" className="bg-[#0A0E1A] text-text-primary">Moyenne</option>
                  <option value="HARD" className="bg-[#0A0E1A] text-text-primary">Difficile</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Count */}
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-text-secondary mb-1.5">
              Nombre de questions
            </label>
            <input
              id="count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              required
              className="w-full pl-4 pr-4 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !examId || !chapterId}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple hover:bg-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-btn transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles size={14} strokeWidth={1.75} />
                Générer les questions
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
