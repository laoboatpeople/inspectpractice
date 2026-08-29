'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Loader2,
  ChevronRight,
  Bot,
  User,
  Lock,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import type { ChatSession, ChatMessage } from '@/types/student';
import {
  getChatSessions,
  getChatHistory,
  sendChatMessage,
  deleteChatSession,
  submitTutorFeedback,
  getTutorFeedback,
} from '@/lib/student-api';
import { useLocale } from '@/src/contexts/LocaleContext';
import { renderAIResponse } from '@/lib/ai-markdown';


// ─── Skeleton ────────────────────────────────────────────────

function SidebarSkeleton() {
  return (
    <div className="w-72 shrink-0 border-r border-border bg-card flex flex-col animate-pulse">
      <div className="p-4 border-b border-border">
        <div className="h-9 w-full bg-border rounded-btn" />
      </div>
      <div className="p-3 space-y-2 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-border rounded-card" />
        ))}
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col animate-pulse">
      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex gap-3 ${i % 2 === 0 ? 'justify-end' : ''}`}
          >
            <div
              className={`h-16 rounded-card ${
                i % 2 === 0
                  ? 'w-3/5 bg-blue/20'
                  : 'w-2/5 bg-border'
              }`}
            />
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <div className="h-12 w-full bg-border rounded-btn" />
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────

function EmptyChatState({ onNewChat }: { onNewChat: () => void }) {
  const { t } = useLocale();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="h-16 w-16 rounded-full bg-blue/10 flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-blue" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">
        {t('tutorTitle')}
      </h2>
      <p className="text-sm text-text-secondary text-center max-w-md mb-6">
        {t('emptyDesc')}
      </p>
      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors"
      >
        <Plus size={16} />
        {t('startNewChat')}
      </button>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useLocale();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="h-16 w-16 rounded-full bg-red/10 flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-red" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {t('somethingWentWrong')}
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-btn bg-card border border-border text-text-primary text-sm font-medium hover:bg-hover transition-colors"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}

// ─── Chat Message Bubble ─────────────────────────────────────

function MessageBubble({
  message,
  feedback,
  onFeedback,
}: {
  message: ChatMessage;
  feedback?: 'up' | 'down';
  onFeedback?: (rating: 'up' | 'down') => void;
}) {
  const isUser = message.role === 'user';
  const { t, locale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-blue/20 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-blue" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-card text-sm leading-relaxed ${
          isUser
            ? 'bg-blue text-white rounded-br-sm'
            : 'bg-card border border-border text-text-primary rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="whitespace-pre-wrap [&_svg]:whitespace-normal [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto [&_svg]:my-3 [&_svg]:block [&_svg]:rounded-lg [&_svg]:border [&_svg]:border-border [&_svg]:p-2 [&_svg]:bg-white [&_li]:list-disc"
            dangerouslySetInnerHTML={{ __html: renderAIResponse(message.content) }}
          />
        )}
        {message.createdAt && (
          <p
            className={`text-[10px] mt-1.5 ${
              isUser ? 'text-blue-200' : 'text-text-tertiary'
            }`}
          >
            {new Date(message.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
        {!isUser && onFeedback && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => onFeedback('up')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'up'
                  ? 'bg-green/15 text-green'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-border'
              }`}
              title={feedback === 'up' ? t('feedbackUpdate') : t('feedbackHelpful')}
              aria-label={t('feedbackHelpful')}
            >
              <ThumbsUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => onFeedback('down')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'down'
                  ? 'bg-red/15 text-red'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-border'
              }`}
              title={feedback === 'down' ? t('feedbackUpdate') : t('feedbackNotHelpful')}
              aria-label={t('feedbackNotHelpful')}
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-blue flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ─── Sidebar Session Item ────────────────────────────────────

function SessionItem({
  session,
  isActive,
  onClick,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-card text-sm transition-colors group ${
        isActive
          ? 'bg-blue/10 border border-blue/20'
          : 'hover:bg-hover border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        <MessageSquare
          size={14}
          className={`shrink-0 ${
            isActive ? 'text-blue' : 'text-text-tertiary'
          }`}
        />
        <span
          className={`flex-1 truncate ${
            isActive ? 'text-blue font-medium' : 'text-text-secondary'
          }`}
        >
          {session.topic || t('newChat')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-red transition-all p-0.5"
          title={t('deleteSession')}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-text-tertiary">
          {session.messageCount} {t('messagesCount')}
        </span>
        {isActive && <ChevronRight size={12} className="text-blue ml-auto" />}
      </div>
    </button>
  );
}

// ─── Main Tutor Page ─────────────────────────────────────────

export default function TutorPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const chapterId = searchParams.get('chapterId');
  const initialQuestion = searchParams.get('question');
  const questionIdx = searchParams.get('questionIdx');

  // Context initial from search params (set once, not reactive)
  const initialQuestionRef = useRef(initialQuestion);

  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [showMobileSessions, setShowMobileSessions] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down'>>({});
  const [feedbackComments, setFeedbackComments] = useState<Record<string, string>>({});
  const [feedbackModal, setFeedbackModal] = useState<{ messageId: string; rating: 'up' | 'down' } | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Load sessions ──────────────────────────────────────────

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    setError(null);
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('somethingWentWrong')
      );
    } finally {
      setLoadingSessions(false);
    }
  }, [t]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    document.title = `${t('tutorTitle')} | Inspect Practice`;
  }, [t]);

  // ── Auto-send initial question from URL param ──────────────

  useEffect(() => {
    const q = initialQuestionRef.current;
    if (!q || loadingSessions) return;
    // Clear so it only fires once
    initialQuestionRef.current = null;
    const autoSend = async () => {
      setSending(true);
      const userMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: q,
        createdAt: new Date().toISOString(),
      };
      setMessages([userMsg]);
      setShowNewChatInput(false);
      try {
        const result = await sendChatMessage(q, {
          examId: examId || undefined,
          chapterId: chapterId || undefined,
        });
        const assistantMsg: ChatMessage = {
          id: result.assistantMessageId || `resp-${Date.now()}`,
          role: 'assistant',
          content: result.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (result.sessionId) {
          setActiveSessionId(result.sessionId);
          loadSessions();
        }
      } catch (err) {
        setMessages([]);
        setError(err instanceof Error ? err.message : t('somethingWentWrong'));
      } finally {
        setSending(false);
      }
    };
    autoSend();
  }, [loadingSessions, examId, loadSessions, t]);

  // ── Load chat history ──────────────────────────────────────

  const loadHistory = useCallback(async (sessionId: string) => {
    setShowMobileSessions(false);
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await getChatHistory(sessionId);
      setMessages(data);
      setActiveSessionId(sessionId);
      // Load existing feedback for this session (restore icon state)
      try {
        const fb = await getTutorFeedback(sessionId);
        const map: Record<string, 'up' | 'down'> = {};
        const cmap: Record<string, string> = {};
        for (const f of fb.data ?? []) {
          map[f.chatMessageId] = f.rating as 'up' | 'down';
          if (f.comment) cmap[f.chatMessageId] = f.comment;
        }
        setFeedbackMap(map);
        setFeedbackComments(cmap);
      } catch {
        /* non-critical — icons start unselected */
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('somethingWentWrong')
      );
    } finally {
      setLoadingMessages(false);
    }
  }, [t]);

  // ── Send message ───────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await sendChatMessage(text, {
        examId: examId || undefined,
        chapterId: chapterId || undefined,
        sessionId: activeSessionId || undefined,
      });

      // Add assistant reply
      const assistantMsg: ChatMessage = {
        id: result.assistantMessageId || `resp-${Date.now()}`,
        role: 'assistant',
        content: result.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // If this was a new session, update the active session ID
      if (!activeSessionId && result.sessionId) {
        setActiveSessionId(result.sessionId);
        setShowNewChatInput(false);
        // Refresh sessions list to show the new session
        loadSessions();
      }
    } catch (err) {
      const e = err as Error & { code?: string; status?: number };
      if (e.status === 403 && e.code === 'TUTOR_LIMIT_REACHED') {
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setLimitReached(true);
        setSending(false);
        return;
      }
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setError(
        e instanceof Error ? e.message : t('somethingWentWrong')
      );
    } finally {
      setSending(false);
    }
  }, [input, sending, examId, activeSessionId, loadSessions, t]);

  // ── New chat ───────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setInput('');
    setError(null);
    setLimitReached(false);
    setShowNewChatInput(true);
    setShowMobileSessions(false);
  }, []);

  // ── Delete session ─────────────────────────────────────────

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      // Optimistically remove from list — no stale click possible
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      try {
        await deleteChatSession(sessionId);
      } catch (err) {
        // Revert on failure — re-fetch from server
        loadSessions();
        setError(
          err instanceof Error
            ? err.message
            : t('somethingWentWrong')
        );
      }
    },
    [activeSessionId, loadSessions, t]
  );

  // ── Tutor feedback (thumbs up/down) ────────────────────────

  const handleFeedback = useCallback((messageId: string, rating: 'up' | 'down') => {
    setFeedbackModal({ messageId, rating });
    setFeedbackComment(feedbackComments[messageId] ?? '');
    setFeedbackError('');
  }, [feedbackComments]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedbackModal) return;
    setFeedbackSaving(true);
    setFeedbackError('');
    try {
      await submitTutorFeedback(
        feedbackModal.messageId,
        feedbackModal.rating,
        feedbackComment.trim() || undefined
      );
      setFeedbackMap((prev) => ({ ...prev, [feedbackModal.messageId]: feedbackModal.rating }));
      setFeedbackComments((prev) => ({ ...prev, [feedbackModal.messageId]: feedbackComment.trim() }));
      setFeedbackModal(null);
      setFeedbackComment('');
    } catch (err) {
      // Surface the failure instead of silently closing — silent close made
      // users think feedback was saved when the POST had failed.
      setFeedbackError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setFeedbackSaving(false);
    }
  }, [feedbackModal, feedbackComment, t]);

  // ── Auto-scroll to bottom ──────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Handle Enter to send ───────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 md:-m-6 lg:-m-8">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex lg:hidden items-center gap-2 px-4 py-3 bg-card border-b border-border">
        {examId && (
          <button
            onClick={() => router.push(`/quiz/${examId}${questionIdx ? `?questionIdx=${questionIdx}` : ''}`)}
            className="flex items-center gap-1 text-xs text-blue hover:text-blue/80 transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            <span>{t('quiz_backToResults')}</span>
          </button>
        )}
        <button
          onClick={() => setShowMobileSessions(!showMobileSessions)}
          className="flex items-center justify-center w-9 h-9 rounded-btn text-text-secondary hover:bg-hover transition-colors shrink-0"
          title={t('sessions')}
        >
          <MessageSquare size={18} />
        </button>
        <div className="flex-1" />
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-blue text-white text-xs font-medium hover:bg-blue/90 transition-colors shrink-0"
        >
          <Plus size={14} />
          <span>{t('newChat')}</span>
        </button>
      </div>

      {/* Mobile sessions overlay */}
      {showMobileSessions && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setShowMobileSessions(false)}
        />
      )}

      {/* Sidebar */}
      {loadingSessions ? (
        <div className="hidden lg:flex w-72 shrink-0 border-r border-border bg-card flex flex-col animate-pulse">
          <div className="p-4 border-b border-border">
            <div className="h-9 w-full bg-border rounded-btn" />
          </div>
          <div className="p-3 space-y-2 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-border rounded-card" />
            ))}
          </div>
        </div>
      ) : (
        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0A0E1A] border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
          showMobileSessions ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Back to results */}
          {examId && (
            <div className="p-4 pb-0">
              <button
                onClick={() => router.push(`/quiz/${examId}${questionIdx ? `?questionIdx=${questionIdx}` : ''}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-card border border-border text-text-secondary text-sm font-medium hover:text-blue hover:border-blue/30 transition-colors"
              >
                <ArrowLeft size={14} />
                {t('quiz_backToResults')}
              </button>
            </div>
          )}

          {/* New Chat button */}
          <div className="p-4 border-b border-border">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors"
            >
              <Plus size={16} />
              {t('newChat')}
            </button>
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-medium px-3 pb-2">
              {t('chatHistory')}
            </p>
            {sessions.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center px-3 py-6">
                {t('noConversations')}
              </p>
            ) : (
              sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={activeSessionId === session.id}
                  onClick={() => loadHistory(session.id)}
                  onDelete={() => handleDeleteSession(session.id)}
                />
              ))
            )}
          </div>
        </aside>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-primary min-w-0 pt-[52px] lg:pt-0">
        {activeSessionId === null && messages.length === 0 && !error && !showNewChatInput && !limitReached ? (
          <EmptyChatState onNewChat={handleNewChat} />
        ) : error && messages.length === 0 && !limitReached ? (
          <ErrorState message={error} onRetry={loadSessions} />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={24} className="text-blue animate-spin" />
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id || Math.random()}
                      message={msg}
                      feedback={msg.role === 'assistant' && msg.id ? feedbackMap[msg.id] : undefined}
                      onFeedback={msg.role === 'assistant' && msg.id ? (r) => handleFeedback(msg.id!, r) : undefined}
                    />
                  ))}
                </AnimatePresence>
              )}
              {sending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-blue" />
                  </div>
                  <div className="bg-card border border-border rounded-card rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              {limitReached && (
                <div className="mb-3 flex flex-col items-start gap-3 rounded-card border border-blue/30 bg-blue/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/20">
                      <Lock size={16} className="text-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {t('tutorLimitReached')}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {t('tutorLimitUpgrade')}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex shrink-0 items-center gap-2 rounded-btn bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue/90"
                  >
                    <Lock size={14} />
                    {t('tutorLimitUpgrade')}
                  </Link>
                </div>
              )}
              {error && (
                <p className="text-xs text-red mb-2 px-1">{error}</p>
              )}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    examId
                      ? t('sendPlaceholder')
                      : t('sendPlaceholder')
                  }
                  disabled={sending || limitReached}
                  className="flex-1 h-10 px-4 py-2.5 rounded-input bg-[#0A0E1A] border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending || limitReached}
                  className="flex items-center justify-center p-2.5 rounded-btn bg-blue text-white hover:bg-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tutor feedback modal */}
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
                onClick={() => setFeedbackModal({ ...feedbackModal, rating: 'up' })}
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
                onClick={() => setFeedbackModal({ ...feedbackModal, rating: 'down' })}
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
              className="w-full px-3 py-2.5 rounded-input bg-[#0A0E1A] border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary transition-colors resize-none"
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
  );
}
