'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Loader2, MessageSquare, BookMarked, Clock, RefreshCw, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface TutorFeedback {
  id: string;
  rating: string; // 'up' | 'down'
  comment: string | null;
  createdAt: string;
  source?: string; // 'tutor' | 'theory'
  user: { id: string; name: string; email: string };
  message: {
    id: string;
    content: string;
    createdAt: string;
    session: { id: string; topic: string | null };
  } | null;
  chapter: {
    id: string;
    number: number;
    name: string;
    name_fr: string | null;
    exam: { code: string; name: string };
  } | null;
}

function messagePreview(content: string): string {
  // Compact plain-text preview: strip SVG diagrams + markdown syntax
  const noSvg = content.replace(/<svg[\s\S]*?<\/svg>/gi, '[diagram]');
  const plain = noSvg
    .replace(/[#>*`_[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 180 ? plain.slice(0, 180) + '…' : plain;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-CA', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function TutorFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<TutorFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const fetchFeedbacks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/tutor-feedback`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401 || res.status === 403) {
        setError('Unauthorized — admin access required');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setFeedbacks(data.data ?? []);
    } catch {
      setError('Failed to load tutor feedback');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Refetch silently when the tab regains focus (e.g. coming back from /tutor)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchFeedbacks(true);
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchFeedbacks]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this feedback?')) return;
      try {
        const res = await fetch(`${API_URL}/api/admin/tutor-feedback/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error('Failed to delete');
        fetchFeedbacks(true);
      } catch {
        setError('Failed to delete feedback');
      }
    },
    [getToken, fetchFeedbacks]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Feedback</h1>
          <p className="text-sm text-text-secondary mt-1">
            Thumbs up/down from theories and AI tutor
          </p>
        </div>
        {!loading && !error && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-tertiary">
              {feedbacks.length} feedback{feedbacks.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={() => fetchFeedbacks()}
              className="inline-flex items-center gap-1.5 text-xs text-blue hover:underline"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-blue animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-red">{error}</p>
        </div>
      )}

      {!loading && !error && feedbacks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <ThumbsUp size={28} className="mb-2" />
          <p className="text-sm">No feedback yet</p>
        </div>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-card border border-border rounded-card p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      fb.rating === 'up'
                        ? 'bg-green/15 text-green'
                        : 'bg-red/15 text-red'
                    }`}
                  >
                    {fb.rating === 'up' ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                    {fb.rating === 'up' ? 'Helpful' : 'Not helpful'}
                  </span>
                  <Link
                    href={`/admin/users/${fb.user.id}`}
                    className="text-sm font-medium text-blue hover:underline"
                  >
                    {fb.user.name}
                  </Link>
                  <span className="text-xs text-text-tertiary">{fb.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock size={12} />
                    {formatDate(fb.createdAt)}
                  </span>
                  {fb.source === 'theory' && fb.chapter ? (
                    <Link
                      href={`/theory?chapterId=${fb.chapter.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan hover:underline"
                    >
                      <BookMarked size={12} />
                      View theory section
                    </Link>
                  ) : fb.message ? (
                    <Link
                      href={`/admin/users/${fb.user.id}?chat=${fb.message.session.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-cyan hover:underline"
                    >
                      <MessageSquare size={12} />
                      View conversation
                    </Link>
                  ) : null}
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="inline-flex items-center gap-1 text-xs text-red hover:underline"
                    title="Delete feedback"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {fb.comment && (
                <p className="mt-3 text-sm text-text-primary bg-hover border border-border rounded-btn px-3 py-2">
                  “{fb.comment}”
                </p>
              )}

              {fb.source === 'theory' && fb.chapter ? (
                <p className="mt-2 text-xs text-text-tertiary leading-relaxed">
                  {fb.chapter.exam.code} — {fb.chapter.number}. {fb.chapter.name}
                  {fb.chapter.name_fr && fb.chapter.name_fr !== fb.chapter.name ? ` · ${fb.chapter.name_fr}` : ''}
                </p>
              ) : fb.message ? (
                <p className="mt-2 text-xs text-text-tertiary leading-relaxed">
                  {messagePreview(fb.message.content)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
