'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookMarked,
  BookOpen,
  Layers,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Wrench,
  Cpu,
  Shield,
  FileText,
  Sparkles,
  GraduationCap,
  Loader2,
  Share2,
  Search,
  SearchX,
  X,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  Droplets,
} from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';
import { submitTheoryFeedback, getTheoryFeedback } from '@/lib/student-api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Types ────────────────────────────────────────────────

interface TheoryChapter {
  id: string;
  number: number;
  name: string;
  questionCount: number;
  theoryContent: string | null;
  hasTheory: boolean;
  examId?: string;
}

interface TheoryCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  country: string;
  licenseType: string;
  chapterCount: number;
  questionCount: number;
  chapters: TheoryChapter[];
}

type SectionColor = 'blue' | 'amber' | 'cyan' | 'purple' | 'green';

const SECTION_STYLES: Record<SectionColor, { bg: string; border: string; text: string; bar: string; icon: React.ReactNode }> = {
  blue: {
    bg: 'bg-blue/10', border: 'border-blue/20', text: 'text-blue', bar: 'bg-blue',
    icon: <BookOpen size={20} />,
  },
  amber: {
    bg: 'bg-amber/10', border: 'border-amber/20', text: 'text-amber', bar: 'bg-amber',
    icon: <Wrench size={20} />,
  },
  cyan: {
    bg: 'bg-cyan/10', border: 'border-cyan/20', text: 'text-cyan', bar: 'bg-cyan',
    icon: <Cpu size={20} />,
  },
  green: {
    bg: 'bg-green/10', border: 'border-green/20', text: 'text-green', bar: 'bg-green',
    icon: <Droplets size={20} />,
  },
  purple: {
    bg: 'bg-purple/10', border: 'border-purple/20', text: 'text-purple', bar: 'bg-purple',
    icon: <Shield size={20} />,
  },
};

const COLOR_MAP: Record<SectionColor, string> = {
  blue: 'blue',
  amber: 'amber',
  cyan: 'cyan',
  purple: 'purple',
  green: 'green',
};

// ─── Simple Markdown Renderer ─────────────────────────────

function TheoryRenderer({ content, color }: { content: string; color: SectionColor }) {
  const segments = useMemo(() => {
    const result: { type: string; content: string; level?: number }[] = [];

    // Split content into text and SVG blocks so SVGs survive line-by-line parsing
    const parts = content.split(/(<svg[\s\S]*?<\/svg>)/gi);

    for (const part of parts) {
      if (!part.trim()) continue;

      // SVG block — pass through as-is for inline rendering
      if (part.trim().toLowerCase().startsWith('<svg')) {
        result.push({ type: 'svg', content: part.trim() });
        continue;
      }

      // Regular text — process line by line
      const lines = part.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Headings
        const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (hMatch) {
          const headingText = hMatch[2].trim();
          // Skip the bare "Diagram" section heading (EN theory content) — SVGs are rendered separately
          if (/^diagram$/i.test(headingText)) continue;
          result.push({ type: 'heading', level: hMatch[1].length, content: headingText });
          continue;
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          result.push({ type: 'bullet', content: trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') });
          continue;
        }

        // Numbered list
        if (trimmed.match(/^\d+\.\s+/)) {
          result.push({ type: 'numbered', content: trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') });
          continue;
        }

        // Horizontal rule
        if (trimmed === '---') {
          result.push({ type: 'hr', content: '' });
          continue;
        }

        // Regular paragraphs with inline formatting
        result.push({
          type: 'paragraph',
          content: trimmed
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>'),
        });
      }
    }
    return result;
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none">
      {segments.map((seg, i) => {
        if (seg.type === 'svg') {
          return (
            <div key={i} className="my-4 flex justify-center overflow-x-auto rounded-card border border-border bg-white p-3"
              dangerouslySetInnerHTML={{ __html: seg.content }} />
          );
        }
        if (seg.type === 'hr') {
          return <hr key={i} className="my-4 border-border" />;
        }
        if (seg.type === 'heading') {
          const H = `h${Math.min(seg.level! + 1, 4)}` as keyof JSX.IntrinsicElements;
          const sizeClass = seg.level === 1 ? 'text-base font-bold mt-5 mb-2'
            : seg.level === 2 ? 'text-sm font-semibold mt-4 mb-2'
            : 'text-xs font-semibold mt-3 mb-1';
          return (
            <H key={i} className={`${sizeClass} text-text-primary`}>
              {seg.content}
            </H>
          );
        }
        if (seg.type === 'bullet') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-${COLOR_MAP[color]}/50 shrink-0 mt-1.5`} />
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        if (seg.type === 'numbered') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`text-xs font-medium text-${COLOR_MAP[color]} shrink-0 mt-0.5`}>{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: seg.content }} />
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────

function SkeletonPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-8 w-64 rounded mb-2" />
      <div className="skeleton h-4 w-96 rounded mb-6" />
      {[1, 2, 3].map((s) => (
        <div key={s} className="bg-card border border-border rounded-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-5 w-48 rounded mb-1" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((c) => (
              <div key={c} className="skeleton h-20 rounded-card" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Chapter Section ──────────────────────────────────────

function ChapterSection({ chapter, color, preselected, onContentLoaded }: { chapter: TheoryChapter; color: SectionColor; preselected?: boolean; onContentLoaded?: (chapterId: string, content: string) => void }) {
  const [expanded, setExpanded] = useState(preselected || false);
  const [content, setContent] = useState<string | null>(chapter.theoryContent);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  // Theory feedback (thumbs up/down)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ rating: 'up' | 'down' } | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  // Tracks the latest in-flight request so a stale fetch result is ignored
  // without cancelling it mid-flight (React cleanup + setState loop bug).
  const contentRequestRef = useRef(0);
  const headerRef = useRef<HTMLButtonElement>(null);
  const colors = SECTION_STYLES[color];
  const { t, locale } = useLocale();
  const router = useRouter();

  const shareChapter = useCallback((ch: TheoryChapter) => {
    const url = `${window.location.origin}/theory?chapterId=${ch.id}`;
    const title = `${ch.number}. ${ch.name} | InspectPractice`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { navigator.share({ title, url }); } catch {}
    } else {
      try { navigator.clipboard.writeText(url); } catch {}
    }
  }, []);

  // ── Theory feedback (thumbs up/down) ─────────────────────
  // Restore existing feedback state when the chapter mounts
  useEffect(() => {
    let cancelled = false;
    getTheoryFeedback(chapter.id)
      .then((res) => {
        if (!cancelled && res.data) {
          setFeedback(res.data.rating === 'up' ? 'up' : 'down');
          setFeedbackComment(res.data.comment ?? '');
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [chapter.id]);

  const handleFeedback = useCallback((rating: 'up' | 'down') => {
    setFeedbackModal({ rating });
    setFeedbackError('');
  }, []);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackModal) return;
    setFeedbackSaving(true);
    setFeedbackError('');
    try {
      await submitTheoryFeedback(chapter.id, feedbackModal.rating, feedbackComment.trim() || undefined);
      setFeedback(feedbackModal.rating);
      setFeedbackModal(null);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setFeedbackSaving(false);
    }
  }, [feedbackModal, feedbackComment, chapter.id]);

  useEffect(() => {
    if (preselected && headerRef.current) {
      setTimeout(() => {
        const rect = headerRef.current!.getBoundingClientRect();
        const navbarH = 64;
        window.scrollTo({ top: window.scrollY + rect.top - navbarH, behavior: 'smooth' });
      }, 600);
    }
  }, [preselected]);

  // Ensure expanded opens when preselected (e.g. jump from search results)
  useEffect(() => {
    if (preselected) setExpanded(true);
  }, [preselected]);

  // Save expanded chapter to localStorage so we remember it on page return
  useEffect(() => {
    if (expanded) {
      try { localStorage.setItem('lastTheoryChapter', chapter.id); } catch {}
    } else {
      try {
        const saved = localStorage.getItem('lastTheoryChapter');
        if (saved === chapter.id) localStorage.removeItem('lastTheoryChapter');
      } catch {}
    }
  }, [expanded, chapter.id]);

  // ── Lazy on-demand load of the theory content ───────────
  // Fires the first time the chapter is expanded and its content isn't
  // already in memory. Cached in local state so re-expanding is instant.
  useEffect(() => {
    if (!expanded || !chapter.hasTheory || content !== null || contentLoading) return;
    // Guard against the classic React loop: setContentLoading(true) in this
    // effect would re-trigger it (contentLoading is a dep), the cleanup would
    // mark the in-flight fetch cancelled, and the finally block would never
    // run → spinner forever. Instead, tag the request and ignore stale results.
    const requestId = ++contentRequestRef.current;
    setContentLoading(true);
    setContentError(false);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/student/theory/${chapter.id}/content?locale=${locale}`, { headers });
        if (!res.ok) throw new Error('Failed to load chapter');
        const json = await res.json();
        const text: string | null = json?.data?.theoryContent ?? null;
        if (requestId !== contentRequestRef.current) return;
        setContent(text);
        if (text) onContentLoaded?.(chapter.id, text);
      } catch {
        if (requestId === contentRequestRef.current) setContentError(true);
      } finally {
        if (requestId === contentRequestRef.current) setContentLoading(false);
      }
    })();
  }, [expanded, chapter.hasTheory, chapter.id, content, contentLoading, locale, onContentLoaded, retryNonce]);

  if (chapter.questionCount === 0 && !chapter.hasTheory) return null;

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <button
        ref={headerRef}
        onClick={() => setExpanded(!expanded)}
        data-chapter-id={chapter.id}
        aria-expanded={expanded}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-hover/50 transition-colors"
      >
        <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
          <Layers size={14} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {chapter.number}. {chapter.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-tertiary">
              {chapter.questionCount} {chapter.questionCount > 1 ? t('questions') : t('question')}
            </span>
            {chapter.hasTheory && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                <span className="text-[10px] font-medium text-blue flex items-center gap-1">
                  <Sparkles size={10} />
                  {t('theoryAvailable')}
                </span>
              </>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronDown size={16} className="shrink-0 text-text-tertiary" />
        ) : (
          <ChevronRight size={16} className="shrink-0 text-text-tertiary" />
        )}
      </button>

      <AnimatePresence>
        {expanded && chapter.hasTheory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-5">
              {contentLoading && (
                <div className="flex items-center justify-center gap-2 py-8 text-text-tertiary">
                  <Loader2 size={18} className="animate-spin text-blue" />
                  <span className="text-sm">{t('theoryLoading')}</span>
                </div>
              )}
              {!contentLoading && contentError && (
                <div className="flex flex-col items-center justify-center gap-3 py-8">
                  <AlertCircle size={20} className="text-red" />
                  <p className="text-xs text-text-secondary">{t('theoryLoadError')}</p>
                  <button
                    onClick={() => { setContent(null); setContentError(false); setRetryNonce(n => n + 1); }}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-3 py-1.5 rounded-lg bg-blue/10 hover:bg-blue/20"
                  >
                    <RefreshCw size={12} />
                    {t('retry')}
                  </button>
                </div>
              )}
              {!contentLoading && !contentError && content && (
                <>
                  <TheoryRenderer content={content} color={color} />
                  <div className="mt-4 flex items-center justify-start gap-2">
                    {chapter.examId && chapter.questionCount > 0 && (
                      <button
                        onClick={() => router.push(`/exams/${chapter.examId}`)}
                        className="flex items-center gap-1.5 text-xs font-medium text-green hover:text-green/80 transition-colors px-3 py-1.5 rounded-lg bg-green/10 hover:bg-green/20"
                      >
                        <ClipboardList size={14} />
                        {t('testKnowledge')}
                      </button>
                    )}
                    <button
                      onClick={() => shareChapter(chapter)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-3 py-1.5 rounded-lg bg-blue/10 hover:bg-blue/20"
                    >
                      <Share2 size={14} />
                      {t('share')}
                    </button>
                    <button
                      onClick={() => handleFeedback('up')}
                      title={feedback === 'up' ? t('feedbackUpdate') : t('feedbackHelpful')}
                      aria-label={t('feedbackHelpful')}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg ${
                        feedback === 'up'
                          ? 'text-green bg-green/15'
                          : 'text-text-tertiary hover:text-text-primary bg-transparent hover:bg-hover'
                      }`}
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => handleFeedback('down')}
                      title={feedback === 'down' ? t('feedbackUpdate') : t('feedbackNotHelpful')}
                      aria-label={t('feedbackNotHelpful')}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg ${
                        feedback === 'down'
                          ? 'text-red bg-red/15'
                          : 'text-text-tertiary hover:text-text-primary bg-transparent hover:bg-hover'
                      }`}
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                </>
              )}

              {feedbackModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
                  onClick={() => setFeedbackModal(null)}
                >
                  <div
                    className="bg-card border border-border rounded-card p-6 w-full max-w-md shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      {feedbackModal.rating === 'up' ? t('feedbackTitleUp') : t('feedbackTitleDown')}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">{t('feedbackSubtitle')}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setFeedbackModal({ rating: 'up' })}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-btn border transition-colors ${
                          feedbackModal.rating === 'up'
                            ? 'bg-green/15 border-green/40 text-green'
                            : 'border-border text-text-tertiary hover:text-text-primary'
                        }`}
                      >
                        <ThumbsUp size={16} /> {t('feedbackHelpful')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackModal({ rating: 'down' })}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-btn border transition-colors ${
                          feedbackModal.rating === 'down'
                            ? 'bg-red/15 border-red/40 text-red'
                            : 'border-border text-text-tertiary hover:text-text-primary'
                        }`}
                      >
                        <ThumbsDown size={16} /> {t('feedbackNotHelpful')}
                      </button>
                    </div>

                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder={t('feedbackCommentPlaceholder')}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-input bg-[#071D2B] border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary transition-colors resize-none"
                    />

                    {feedbackError && (
                      <p className="text-sm text-red mt-2">{feedbackError}</p>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setFeedbackModal(null)}
                        className="px-4 py-2 rounded-btn text-sm text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={handleFeedbackSubmit}
                        disabled={feedbackSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-btn bg-blue text-white text-sm hover:bg-blue/90 transition-colors disabled:opacity-40"
                      >
                        {feedbackSaving && <Loader2 size={14} className="animate-spin" />}
                        {t('feedbackSubmit')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && !chapter.hasTheory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-8 text-center">
              <FileText size={24} className="mx-auto text-text-tertiary mb-2" />
              <p className="text-sm text-text-secondary">
                {t('theoryInPreparation')}
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {t('theoryBasedOn', { count: chapter.questionCount })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────

function CategoryCard({ category, preselectedChapterId, onChapterContentLoaded, displayName }: { category: TheoryCategory; preselectedChapterId?: string; onChapterContentLoaded?: (chapterId: string, content: string) => void; displayName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const color = getSectionColor(category.code);
  const colors = SECTION_STYLES[color];
  const chaptersWithTheory = category.chapters.filter(ch => ch.hasTheory).length;
  const chaptersWithQuestions = category.chapters.filter(ch => ch.questionCount > 0).length;
  const { t } = useLocale();
  const hasPreselected = category.chapters.some(ch => ch.id === preselectedChapterId);

  const shareCategory = useCallback((cat: TheoryCategory) => {
    // Share the first available chapter in the category so it auto-expands to the right section
    const firstChapter = cat.chapters.find(ch => ch.id);
    const url = firstChapter
      ? `${window.location.origin}/theory?chapterId=${firstChapter.id}`
      : window.location.origin + '/theory';
    const title = `${cat.name} | InspectPractice`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { navigator.share({ title, url }); } catch {}
    } else {
      try { navigator.clipboard.writeText(url); } catch {}
    }
  }, []);

  useEffect(() => {
    if (hasPreselected) setExpanded(true);
  }, [hasPreselected]);

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden transition-all duration-200 hover:border-blue/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <span className={colors.text}>{colors.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary">{displayName ?? category.name}</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-tertiary">
              {category.code}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); shareCategory(category); }}
              className="flex items-center gap-1 text-xs font-medium text-blue hover:text-blue/80 transition-colors px-2 py-1 rounded-lg bg-blue/10 hover:bg-blue/20 shrink-0 ml-auto"
              title={t('share')}
            >
              <Share2 size={12} />
            </button>
          </div>
          {category.description && (
            <p className="text-xs text-text-secondary line-clamp-1 mb-2">{category.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Layers size={12} className="text-amber" />
              {category.chapterCount} {category.chapterCount > 1 ? t('chapters') : t('chapter')}
            </span>
            {chaptersWithTheory > 0 && (
              <span className="flex items-center gap-1 text-blue">
                <Sparkles size={12} />
                {t('theoryProgress', { withTheory: chaptersWithTheory, total: chaptersWithQuestions })}
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronDown size={18} className="shrink-0 text-text-tertiary mt-1" />
        ) : (
          <ChevronRight size={18} className="shrink-0 text-text-tertiary mt-1" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 space-y-3">
              {category.chapters.filter(ch => ch.questionCount > 0).length > 0 ? (
                category.chapters
                  .filter(ch => ch.questionCount > 0)
                  .map((ch) => (
                    <ChapterSection key={ch.id} chapter={ch} color={color} preselected={ch.id === preselectedChapterId} onContentLoaded={onChapterContentLoaded} />
                  ))
              ) : (
                <div className="py-8 text-center">
                  <HelpCircle size={24} className="mx-auto text-text-tertiary mb-2" />
                  <p className="text-sm text-text-secondary">{t('noContent')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getSectionColor(code: string): SectionColor {
  if (code.startsWith('M-')) return 'amber';
  if (code.startsWith('E-')) return 'cyan';
  if (code.startsWith('S-')) return 'purple';
  return 'blue';
}

// ─── Full-text search ─────────────────────────────────────

/** Lowercase + strip accents so "generatrice" matches "génératrice". */
function normalizeText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface SearchResult {
  chapter: TheoryChapter;
  category: TheoryCategory;
  score: number;
  /** Raw snippet around the first content match (null for name-only matches). */
  snippet: string | null;
  snippetStart: number;
}

/**
 * Build a ~120-char window around the FIRST occurrence of `normQuery`
 * inside the normalized content, snapped to word boundaries.
 */
function extractSnippet(normContent: string, rawContent: string, normQuery: string): { snippet: string; start: number } | null {
  const idx = normContent.indexOf(normQuery);
  if (idx === -1) return null;
  const matchEnd = idx + normQuery.length;
  let start = Math.max(0, idx - 45);
  let end = Math.min(rawContent.length, matchEnd + 75);
  // Snap to word boundaries for cleaner snippets
  if (start > 0) {
    while (start < idx && !/\s/.test(rawContent[start])) start++;
    while (start < idx && /\s/.test(rawContent[start])) start++;
  } else {
    start = 0;
  }
  while (end < rawContent.length && !/\s/.test(rawContent[end - 1])) end++;
  return { snippet: rawContent.slice(start, end).replace(/\s+/g, ' ').trim(), start };
}

/**
 * Client-side full-text search over every chapter of every category.
 * Ranking: chapter name > category name/code > theory content.
 * `contentIndex` maps chapterId -> theoryContent (loaded on demand).
 */
function searchTheory(categories: TheoryCategory[], query: string, contentIndex: Map<string, string>): SearchResult[] {
  const normQuery = normalizeText(query.trim());
  if (normQuery.length < 2) return [];
  const results: SearchResult[] = [];
  for (const category of categories) {
    const normCatName = normalizeText(category.name);
    const normCatCode = normalizeText(category.code);
    for (const chapter of category.chapters) {
      if (chapter.questionCount === 0 && !chapter.hasTheory) continue;
      const normChName = normalizeText(chapter.name);
      let score = 0;
      if (normChName.includes(normQuery)) {
        score = normChName.startsWith(normQuery) ? 100 : 90; // chapter name match
      } else if (normCatName.includes(normQuery) || normCatCode === normQuery) {
        score = 60; // category match
      } else {
        const content = contentIndex.get(chapter.id);
        if (content) {
          const normContent = normalizeText(content);
          const hit = extractSnippet(normContent, content, normQuery);
          if (hit) score = 30; // content match
          if (score > 0) {
            results.push({ chapter, category, score, snippet: hit!.snippet, snippetStart: hit!.start });
            continue;
          }
        }
      }
      if (score > 0) {
        results.push({ chapter, category, score, snippet: null, snippetStart: 0 });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score || a.chapter.number - b.chapter.number);
}

/** Snippet text with every occurrence of the query highlighted (accent-insensitive). */
function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    const normText = normalizeText(text);
    const normQuery = normalizeText(query.trim());
    if (!normQuery) return [{ text, hit: false }];
    const out: { text: string; hit: boolean }[] = [];
    let cursor = 0;
    let idx = normText.indexOf(normQuery);
    while (idx !== -1) {
      if (idx > cursor) out.push({ text: text.slice(cursor, idx), hit: false });
      out.push({ text: text.slice(idx, idx + normQuery.length), hit: true });
      cursor = idx + normQuery.length;
      idx = normText.indexOf(normQuery, cursor);
    }
    if (cursor < text.length) out.push({ text: text.slice(cursor), hit: false });
    return out.length > 0 ? out : [{ text, hit: false }];
  }, [text, query]);

  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="bg-amber/20 text-amber rounded px-0.5 font-medium">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function TheoryPage() {
  const { t, locale } = useLocale();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<TheoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preselectedChapterId, setPreselectedChapterId] = useState<string | null>(null);
  const [preselectedSection, setPreselectedSection] = useState<string | null>(null);

  // Read chapterId / section from URL params or localStorage
  useEffect(() => {
    const chId = searchParams.get('chapterId');
    const section = searchParams.get('section');
    if (chId) {
      setPreselectedChapterId(chId);
    } else {
      // Restore last opened chapter from localStorage
      try {
        const saved = localStorage.getItem('lastTheoryChapter');
        if (saved) setPreselectedChapterId(saved);
      } catch {}
    }
    if (section) {
      setPreselectedSection(section);
    }
  }, [searchParams]);

  // Scroll to a preselected license section (deep-link ?section=common|m|e|s)
  useEffect(() => {
    if (!preselectedSection || loading || categories.length === 0) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-section="${preselectedSection}"]`) as HTMLElement | null;
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [preselectedSection, loading, categories.length]);

  // ─── Full-text search state ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─── Licence rating filter (same pattern as /exams) ────
  const [licenseFilter, setLicenseFilter] = useState<'ALL' | 'B1' | 'B2' | 'E1' | 'P1' | 'M1'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('license');
      if (p && ['B1', 'B2', 'E1', 'P1', 'M1', 'ALL'].includes(p)) return p as any;
      const s = sessionStorage.getItem('theory_license');
      if (s && ['B1', 'B2', 'E1', 'P1', 'M1'].includes(s)) return s as any;
    }
    return 'ALL';
  });

  // Persist licence filter in URL (?license=) + sessionStorage so it survives back-navigation
  const selectLicense = (r: 'ALL' | 'B1' | 'B2' | 'E1' | 'P1' | 'M1') => {
    setLicenseFilter(r);
    if (r === 'ALL') sessionStorage.removeItem('theory_license');
    else sessionStorage.setItem('theory_license', r);
    const url = new URL(window.location.href);
    if (r === 'ALL') url.searchParams.delete('license');
    else url.searchParams.set('license', r);
    window.history.replaceState(null, '', url.toString());
  };

  // Debounce input ~200ms before running the search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // "/" anywhere on the page focuses the search (unless already typing)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchActive = debouncedQuery.trim().length >= 2;

  // ─── On-demand search index ─────────────────────────────
  // The heavy theory content is NOT loaded with the page anymore. When the
  // user starts typing a search, we fetch all content once and build an
  // index (chapterId -> content). Chapters expanded by the user also feed
  // this index incrementally via onChapterContentLoaded.
  const [contentIndex, setContentIndex] = useState<Map<string, string>>(() => new Map());
  const [searchIndexLoading, setSearchIndexLoading] = useState(false);
  const searchIndexLoadedRef = useRef(false);
  // Same request-tagging pattern as ChapterSection: prevents the classic
  // setState-in-effect re-trigger loop that leaves searchIndexLoading stuck true.
  const searchRequestRef = useRef(0);

  const handleChapterContentLoaded = useCallback((chapterId: string, content: string) => {
    setContentIndex(prev => {
      if (prev.has(chapterId)) return prev;
      const next = new Map(prev);
      next.set(chapterId, content);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!searchActive || searchIndexLoadedRef.current || searchIndexLoading) return;
    const requestId = ++searchRequestRef.current;
    setSearchIndexLoading(true);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/student/theory/all-content?locale=${locale}`, { headers });
        if (!res.ok) throw new Error('Failed to load search index');
        const json = await res.json();
        if (requestId !== searchRequestRef.current) return;
        setContentIndex(prev => {
          const next = new Map(prev);
          for (const row of (json.data || [])) {
            if (row.theoryContent) next.set(row.id, row.theoryContent);
          }
          return next;
        });
        searchIndexLoadedRef.current = true;
      } catch {
        // Non-fatal: name/code matches still work without the content index.
      } finally {
        if (requestId === searchRequestRef.current) setSearchIndexLoading(false);
      }
    })();
  }, [searchActive, searchIndexLoading, locale]);

  const searchResults = useMemo(
    () => (searchActive ? searchTheory(categories, debouncedQuery, contentIndex) : []),
    [categories, debouncedQuery, searchActive, contentIndex]
  );

  // Jump from a search result to its chapter: clear search, expand the
  // category + chapter, scroll to it — reuses the preselectedChapterId
  // mechanism ([data-chapter-id] click + ChapterSection preselected effect).
  const jumpToResult = useCallback((result: SearchResult) => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPreselectedChapterId(result.chapter.id);
    try { localStorage.setItem('lastTheoryChapter', result.chapter.id); } catch {}
    // Categories re-render after the state update; give the DOM a tick
    // before looking up the chapter element to expand + scroll.
    setTimeout(() => {
      const el = document.querySelector(`[data-chapter-id="${result.chapter.id}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (el.getAttribute('aria-expanded') !== 'true') {
          el.click();
        }
      }
    }, 150);
  }, []);

  useEffect(() => {
    document.title = `${t('theory')} | Inspect Practice`;
  }, [t]);

  async function fetchTheory() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/student/theory/outline?locale=${locale}`, { headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setCategories(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTheory();
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const LICENSE_SECTIONS = [
    {
      key: 'b1',
      title: t('licenseM'),
      subtitle: t('licenseMSub'),
      color: 'blue' as SectionColor,
      codeFilter: (code: string) => code.startsWith('ICC-B1'),
    },
    {
      key: 'b2',
      title: t('licenseE'),
      subtitle: t('licenseESub'),
      color: 'cyan' as SectionColor,
      codeFilter: (code: string) => code.startsWith('ICC-B2'),
    },
    {
      key: 'e1',
      title: t('licenseS'),
      subtitle: t('licenseSSub'),
      color: 'amber' as SectionColor,
      codeFilter: (code: string) => code.startsWith('ICC-E1'),
    },
    {
      key: 'p1',
      title: t('licenseP1'),
      subtitle: t('licenseP1Sub'),
      color: 'green' as SectionColor,
      codeFilter: (code: string) => code.startsWith('ICC-P1'),
    },
    {
      key: 'm1',
      title: t('licenseM1'),
      subtitle: t('licenseM1Sub'),
      color: 'purple' as SectionColor,
      codeFilter: (code: string) => code.startsWith('ICC-M1'),
    },
  ];

  const totalQuestions = categories.reduce((sum, c) => sum + c.questionCount, 0);
  const totalChapters = categories.reduce((sum, c) => sum + c.chapterCount, 0);
  const totalTheory = categories.reduce((sum, c) => sum + c.chapters.filter(ch => ch.hasTheory).length, 0);

  // Standard Practices label follows the selected licence (SPM/SPE/SPS)
  const getCategoryDisplayName = useCallback((cat: TheoryCategory): string => {
    return cat.name;
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue/20 to-purple/20 flex items-center justify-center">
            <GraduationCap size={22} className="text-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{t('theory')}</h1>
            <p className="text-sm text-text-secondary">
              {t('theorySubtitle')}
            </p>
          </div>
        </div>
        {!loading && categories.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
            <span>{categories.length} {t('categories')}</span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span>{totalChapters} {t('chapters')}</span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span className="font-medium text-blue">{t('theoryWithTheory', { count: totalTheory })}</span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span>{totalQuestions} {t('questions')}</span>
          </div>
        )}
      </div>

      {/* Licence rating filter — same pattern as /exams */}
      {!loading && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {(['ALL', 'B1', 'B2', 'E1', 'P1', 'M1'] as const).map((r) => (
            <button
              key={r}
              onClick={() => selectLicense(r)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                licenseFilter === r
                  ? 'bg-blue text-white shadow-md shadow-blue/25'
                  : 'bg-card border border-border text-text-secondary hover:border-blue/40 hover:text-text-primary'
              }`}
            >
              {r === 'ALL' ? t('ratingAll') : r}
            </button>
          ))}
        </div>
      )}

      {/* Full-text search bar */}
      {!loading && categories.length > 0 && (
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none transition-colors group-focus-within:text-blue"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchQuery('');
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder={t('theoryFullSearchPlaceholder')}
            aria-label={t('theoryFullSearchPlaceholder')}
            className="w-full bg-card border border-border focus:border-blue/50 focus:ring-2 focus:ring-blue/15 rounded-xl pl-11 pr-12 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label={t('theoryClearSearch')}
              title={t('theoryClearSearch')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-hover/60 transition-colors"
            >
              <X size={15} />
            </button>
          ) : (
            !searchFocused && (
              <kbd
                aria-hidden="true"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center h-6 w-6 rounded-md border border-border bg-primary/40 text-[11px] font-mono text-text-tertiary pointer-events-none"
              >
                /
              </kbd>
            )
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchTheory} className="ml-auto underline hover:no-underline text-text-secondary hover:text-text-primary">
            <RefreshCw size={14} className="inline mr-1" />
            {t('retry')}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <SkeletonPage />}

      {/* Empty */}
      {!loading && !error && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
            <BookMarked size={24} className="text-text-tertiary" />
          </div>
          <h2 className="text-lg font-medium text-text-primary mb-1">{t('theoryEmptyTitle')}</h2>
          <p className="text-sm text-text-secondary max-w-sm text-center">
            {t('theoryEmptyDesc')}
          </p>
        </div>
      )}

      {/* Search results — replaces the license sections while a query is active */}
      {!loading && searchActive && (
        <div>
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm text-text-secondary">
                  {t('theorySearchResultsCount', { count: searchResults.length, query: debouncedQuery.trim() })}
                </p>
                {searchIndexLoading && (
                  <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <Loader2 size={12} className="animate-spin text-blue" />
                    {t('theoryIndexing')}
                  </span>
                )}
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
                className="space-y-2"
              >
                {searchResults.map((result) => {
                  const color = getSectionColor(result.category.code);
                  const colors = SECTION_STYLES[color];
                  return (
                    <motion.button
                      key={result.chapter.id}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                      }}
                      onClick={() => jumpToResult(result)}
                      className="w-full text-left bg-card border border-border rounded-card px-4 py-3.5 hover:border-blue/40 hover:bg-hover/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`h-7 w-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                          <Layers size={13} className={colors.text} />
                        </span>
                        <p className="text-sm font-semibold text-text-primary group-hover:text-blue transition-colors min-w-0">
                          {result.chapter.number}. {result.chapter.name}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-text-tertiary">
                          {result.category.code}
                        </span>
                        <span className="ml-auto text-xs text-text-tertiary shrink-0">
                          {result.chapter.questionCount} {result.chapter.questionCount > 1 ? t('questions') : t('question')}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed pl-[38px]">
                        {result.snippet ? (
                          <>
                            {result.snippetStart > 0 && <span className="text-text-tertiary">…</span>}
                            <HighlightedSnippet text={result.snippet} query={debouncedQuery} />
                            <span className="text-text-tertiary">…</span>
                          </>
                        ) : (
                          <span className="text-text-tertiary italic">{getCategoryDisplayName(result.category)}</span>
                        )}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <SearchX size={22} className="text-text-tertiary" />
              </div>
              <h2 className="text-base font-medium text-text-primary mb-1">
                {t('theorySearchNoResults', { query: debouncedQuery.trim() })}
              </h2>
              <p className="text-sm text-text-secondary max-w-sm text-center">
                {t('theorySearchNoResultsDesc')}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Sections */}
      {!loading && !searchActive && categories.length > 0 && LICENSE_SECTIONS.map((section) => {
        // Licence filter: M/E/S shows the common core + its own section (same as /exams path)
        if (licenseFilter !== 'ALL' && section.key !== 'common' && section.key !== licenseFilter.toLowerCase()) return null;
        const colors = SECTION_STYLES[section.color];
        const filtered = categories.filter(c => section.codeFilter(c.code));
        if (filtered.length === 0) return null;

        const sectionTheory = filtered.reduce((s, c) => s + c.chapters.filter(ch => ch.hasTheory).length, 0);

        return (
          <section key={section.key} data-section={section.key}>
            {/* Section header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-1 h-10 rounded-full ${colors.bar} shrink-0 mt-1`} />
              <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <span className={colors.text}>{SECTION_STYLES[section.color].icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-text-primary">{section.title}</h2>
                  {sectionTheory > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue/10 text-blue flex items-center gap-1">
                      <Sparkles size={10} />
                      {t('theoryWithTheory', { count: sectionTheory })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">{section.subtitle}</p>
              </div>
            </div>

            {/* Category cards */}
            <div className="space-y-3">
              {filtered.map((cat) => (
                <CategoryCard key={cat.id} category={cat} displayName={getCategoryDisplayName(cat)} preselectedChapterId={preselectedChapterId || undefined} onChapterContentLoaded={handleChapterContentLoaded} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
