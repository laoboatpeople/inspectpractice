'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit2, ChevronDown, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import type { Question, Exam, Chapter } from '@/types';
import type { QType, Difficulty } from '@/types';

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Form state
  const [examId, setExamId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [type, setType] = useState<QType>('MCQ');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Fetch question
  useEffect(() => {
    async function fetchQuestion() {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const q: Question = json.data ?? json;

        setQuestion(q);
        setExamId(q.examId ?? '');
        setChapterId(q.chapterId ?? '');
        setType(q.type ?? 'MCQ');
        setDifficulty(q.difficulty ?? 'MEDIUM');
        setQuestionText(q.question ?? '');
        setOptions(q.options && q.options.length > 0 ? q.options : ['', '', '', '']);
        setCorrectAnswer(q.correctAnswer ?? '');
        setExplanation(q.explanation ?? '');
      } catch {
        setResult({ ok: false, message: 'Échec du chargement de la question.' });
      } finally {
        setLoadingQuestion(false);
      }
    }
    fetchQuestion();
  }, [id, router]);

  // Fetch exams
  useEffect(() => {
    async function fetchExams() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setExams(json.data ?? json);
      } catch {
        setResult({ ok: false, message: 'Échec du chargement des examens.' });
      } finally {
        setLoadingExams(false);
      }
    }
    fetchExams();
  }, [router]);

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
        // Reset chapter if it's no longer valid
        if (chapterId && !json.data?.find((c: Chapter) => c.id === chapterId)) {
          setChapterId('');
        }
      } catch {
        setResult({ ok: false, message: 'Échec du chargement des chapitres.' });
      }
    }
    fetchChapters();
  }, [examId]);

  function handleOptionChange(index: number, value: string) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  function addOption() {
    setOptions([...options, '']);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    // Adjust correct answer if needed
    if (correctAnswer === options[index]) {
      setCorrectAnswer('');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/admin-login'); return; }

    const payload: Record<string, unknown> = {
      examId,
      chapterId,
      type,
      difficulty,
      question: questionText,
      correctAnswer,
      explanation,
    };

    if (type === 'MCQ' && options.length > 0) {
      payload.options = options.filter((o) => o.trim() !== '');
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        setResult({ ok: false, message: data.message ?? 'Échec de la mise à jour. Veuillez réessayer.' });
        setSubmitting(false);
        return;
      }

      setResult({ ok: true, message: 'Question mise à jour avec succès. Redirection...' });
      setSubmitting(false);
      setTimeout(() => router.push('/admin/questions'), 1500);
    } catch {
      setResult({ ok: false, message: 'Impossible de se connecter au serveur.' });
      setSubmitting(false);
    }
  }

  const isMCQ = type === 'MCQ';
  const isTrueFalse = type === 'TRUEFALSE';

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
          </button>
          <div className="p-2 rounded-btn bg-blue/10 border border-blue/20">
            <Edit2 size={18} className="text-blue" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Modifier la question</h1>
        </div>
        <p className="text-sm text-text-secondary">
          Mettez à jour les détails de la question ci-dessous.
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

      {/* Loading state */}
      {loadingQuestion && (
        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-text-tertiary" />
          </div>
        </div>
      )}

      {/* Form card */}
      {!loadingQuestion && question && (
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
                    {!examId ? "Sélectionnez d'abord un examen" : chapters.length === 0 ? 'Aucun chapitre trouvé' : 'Sélectionnez un chapitre'}
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
                    onChange={(e) => {
                      const newType = e.target.value as QType;
                      setType(newType);
                      if (newType === 'TRUEFALSE') {
                        setOptions(['True', 'False']);
                        setCorrectAnswer('');
                      } else if (newType === 'WRITTEN') {
                        setOptions([]);
                        setCorrectAnswer('');
                      }
                    }}
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
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
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

            {/* Question text */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-text-secondary mb-1.5">
                Question
              </label>
              <textarea
                id="question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                rows={4}
                className="w-full pl-4 pr-4 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors resize-none"
                placeholder="Saisissez le texte de la question..."
              />
            </div>

            {/* Options (MCQ only) */}
            {isMCQ && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-secondary">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-xs text-blue hover:text-blue/80 transition-colors"
                  >
                    + Ajouter une option
                  </button>
                </div>
                <div className="space-y-2">
                  {options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-border flex items-center justify-center text-xs font-bold text-text-tertiary">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 pl-4 pr-4 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="flex-shrink-0 p-2 rounded-btn text-text-tertiary hover:text-red hover:bg-red/10 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options for TRUEFALSE */}
            {isTrueFalse && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Options
                </label>
                <div className="flex items-center gap-4">
                  {['True', 'False'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-btn border cursor-pointer transition-colors ${
                        correctAnswer === opt
                          ? 'bg-green/10 border-green/30 text-green'
                          : 'bg-primary border-border text-text-secondary hover:border-blue/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="truefalse"
                        value={opt}
                        checked={correctAnswer === opt}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer */}
            {!isTrueFalse && (
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Réponse correcte
                </label>
                {isMCQ ? (
                  <div className="relative">
                    <select
                      id="correctAnswer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      required
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-[#0A0E1A] text-text-primary">Sélectionnez l'option correcte</option>
                      {options.map((opt, idx) => (
                        opt.trim() && (
                          <option key={idx} value={opt} className="bg-[#0A0E1A] text-text-primary">
                            {String.fromCharCode(65 + idx)}. {opt}
                          </option>
                        )
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                    />
                  </div>
                ) : (
                  <input
                    id="correctAnswer"
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                    className="w-full pl-4 pr-4 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                    placeholder="Saisissez la réponse correcte"
                  />
                )}
              </div>
            )}

            {/* Explanation */}
            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-text-secondary mb-1.5">
                Explication
              </label>
              <textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={3}
                className="w-full pl-4 pr-4 py-2.5 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors resize-none"
                placeholder="Expliquez pourquoi c'est la réponse correcte..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-btn transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Edit2 size={14} strokeWidth={1.75} />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
