'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  type: string;
  exam?: { code: string; name: string };
  chapter?: { number: number; name: string };
}

interface ApiError {
  message: string;
}

export default function QuestionsReviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [approvingAll, setApprovingAll] = useState(false);

  useEffect(() => {
    fetchPendingQuestions();
  }, []);

  const fetchPendingQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/admin-login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setQuestions(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du chargement des questions en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await performAction(id, 'approve');
  };

  const handleReject = async (id: string) => {
    await performAction(id, 'reject');
  };

  const handleApproveAll = async () => {
    if (questions.length === 0 || approvingAll) return;
    try {
      setActionError(null);
      setSuccessMsg(null);
      setApprovingAll(true);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/admin-login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/approve-all`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Échec de l\'approbation de certaines questions');
      }

      const data = await res.json().catch(() => ({}));
      const approvedCount = data.approvedCount ?? questions.length;
      setQuestions([]);
      setSuccessMsg(`${approvedCount} question${approvedCount > 1 ? 's' : ''} approuvée${approvedCount > 1 ? 's' : ''}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Échec de l\'approbation de toutes les questions');
    } finally {
      setProcessingIds(new Set());
      setApprovingAll(false);
    }
  };

  const performAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setActionError(null);
      setSuccessMsg(null);
      setProcessingIds((prev) => new Set(prev).add(id));

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/admin-login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/${id}/${action}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Échec de ${action === 'approve' ? "l'approbation" : "du rejet"} de la question`);
      }

      // Remove the question from the list
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setSuccessMsg(`Question ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Échec de ${action === 'approve' ? "l'approbation" : "du rejet"} de la question`);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green bg-green/10 border-green/20';
      case 'medium':
        return 'text-amber bg-amber/10 border-amber/20';
      case 'hard':
        return 'text-red bg-red/10 border-red/20';
      default:
        return 'text-text-secondary bg-hover border-border';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'multiple_choice':
        return 'text-blue bg-blue/10 border-blue/20';
      case 'true_false':
        return 'text-cyan bg-cyan/10 border-cyan/20';
      default:
        return 'text-purple bg-purple/10 border-purple/20';
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Chargement des questions en attente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Révision des Questions</h1>
          <p className="text-sm text-text-secondary mt-1">
            Révisez et modérez les questions générées par l'IA avant publication
          </p>
        </div>
        <button
          onClick={handleApproveAll}
          disabled={questions.length === 0 || approvingAll || loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-green text-white rounded-btn text-sm font-medium hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {approvingAll ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Tout Approuver
          {questions.length > 0 && !approvingAll && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
              {questions.length}
            </span>
          )}
        </button>
      </div>

      {/* Messages */}
      {actionError && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {actionError}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-green/10 border border-green/20 rounded-card text-sm text-green">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button
            onClick={fetchPendingQuestions}
            className="ml-auto underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && questions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-hover flex items-center justify-center mb-4">
            <FileText size={24} className="text-text-tertiary" />
          </div>
          <h2 className="text-lg font-medium text-text-primary mb-1">Aucune question en attente</h2>
          <p className="text-sm text-text-secondary max-w-sm">
            Aucune question en attente de révision. Revenez plus tard.
          </p>
        </div>
      )}

      {/* Questions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-card border border-border rounded-card p-6 card-glow"
          >
            {/* Question header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getDifficultyColor(
                    q.difficulty
                  )}`}
                >
                  {q.difficulty ?? 'Inconnu'}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getTypeColor(
                    q.type
                  )}`}
                >
                  {q.type?.replace(/_/g, ' ') ?? 'Inconnu'}
                </span>
                {q.exam && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded border text-purple bg-purple/10 border-purple/20">
                    {q.exam.code} — {q.exam.name}
                  </span>
                )}
                {q.chapter && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded border text-cyan bg-cyan/10 border-cyan/20">
                    Ch. {q.chapter.number}: {q.chapter.name}
                  </span>
                )}
              </div>
            </div>

            {/* Question text */}
            <p className="text-sm font-medium text-text-primary mb-4 leading-relaxed">
              {q.question}
            </p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {q.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded ${
                    option === q.correctAnswer
                      ? 'bg-green/10 border border-green/20'
                      : 'bg-hover border border-transparent'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      option === q.correctAnswer
                        ? 'bg-green text-white'
                        : 'bg-border text-text-tertiary'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span
                    className={`text-sm ${
                      option === q.correctAnswer ? 'text-green font-medium' : 'text-text-secondary'
                    }`}
                  >
                    {option}
                  </span>
                  {option === q.correctAnswer && (
                    <CheckCircle size={14} className="text-green ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Explanation */}
            {q.explanation && (
              <div className="mb-4 p-3 bg-blue/5 border border-blue/10 rounded">
                <p className="text-[10px] font-medium text-blue uppercase tracking-wide mb-1">
                  Explication
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button
                onClick={() => handleApprove(q.id)}
                disabled={processingIds.has(q.id)}
                className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-green text-white rounded-btn text-sm font-medium hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingIds.has(q.id) ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Approuver
              </button>
              <button
                onClick={() => handleReject(q.id)}
                disabled={processingIds.has(q.id)}
                className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-red text-white rounded-btn text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingIds.has(q.id) ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <X size={14} />
                )}
                Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
