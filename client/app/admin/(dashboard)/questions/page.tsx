'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Plus,
  Trash2,
  Upload,
  FileText,
  Check,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  BookOpen,
  Download,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { Exam, Chapter } from '@/types';
import { renderAIResponse } from '@/lib/ai-markdown';

// ─── Types ──────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  questions?: PreviewQuestion[];
  analysis?: string;
  filenames?: string[];
}

interface PreviewQuestion {
  question: string;
  options?: string[] | null;
  correctAnswer: string;
  explanation: string;
  type: 'MCQ' | 'TRUEFALSE' | 'WRITTEN';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  _confirmed?: boolean;
}

interface UploadedFile {
  id: string;
  filename: string;
  pages: number;
  uploadedAt: string;
}

// ─── Helpers ────────────────────────────────────────────────

function getTypeBadge(type: string) {
  switch (type) {
    case 'MCQ': return { label: 'QCM', cls: 'text-blue bg-blue/10 border-blue/20' };
    case 'TRUEFALSE': return { label: 'V/F', cls: 'text-cyan bg-cyan/10 border-cyan/20' };
    case 'WRITTEN': return { label: 'Écrite', cls: 'text-purple bg-purple/10 border-purple/20' };
    default: return { label: type, cls: 'text-text-secondary bg-hover border-border' };
  }
}

function getDifficultyBadge(d: string) {
  switch (d) {
    case 'EASY': return { label: 'Facile', cls: 'text-green bg-green/10 border-green/20' };
    case 'MEDIUM': return { label: 'Moyen', cls: 'text-amber bg-amber/10 border-amber/20' };
    case 'HARD': return { label: 'Difficile', cls: 'text-red bg-red/10 border-red/20' };
    default: return { label: d, cls: 'text-text-secondary bg-hover border-border' };
  }
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ─── Question Card (preview in chat) ─────────────────────────

function QuestionPreviewCard({
  q,
  index,
  onToggleConfirm,
}: {
  q: PreviewQuestion;
  index: number;
  onToggleConfirm: (idx: number) => void;
}) {
  const typeBadge = getTypeBadge(q.type);
  const diffBadge = getDifficultyBadge(q.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card border p-4 transition-colors ${
        q._confirmed
          ? 'bg-green/5 border-green/30'
          : 'bg-card border-border'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-tertiary bg-hover px-2 py-0.5 rounded">
            Q{index + 1}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${typeBadge.cls}`}>
            {typeBadge.label}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${diffBadge.cls}`}>
            {diffBadge.label}
          </span>
        </div>
        <button
          onClick={() => onToggleConfirm(index)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border transition-colors shrink-0 ${
            q._confirmed
              ? 'bg-green/10 border-green/30 text-green hover:bg-green/20'
              : 'bg-hover border-border text-text-secondary hover:text-text-primary hover:bg-border'
          }`}
        >
          {q._confirmed ? (
            <><Check size={10} /> Confirmé</>
          ) : (
            <><Check size={10} /> Confirmer</>
          )}
        </button>
      </div>

      {/* Question */}
      <p className="text-sm text-text-primary leading-relaxed mb-3">{q.question}</p>

      {/* Options (MCQ only) */}
      {q.options && q.options.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {q.options.map((opt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-2 rounded text-xs ${
                opt === q.correctAnswer
                  ? 'bg-green/10 border border-green/20 text-green'
                  : 'bg-hover text-text-secondary'
              }`}
            >
              <span className="shrink-0 font-mono w-4">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Correct answer */}
      {(!q.options || q.options.length === 0) && (
        <div className="mb-3">
          <span className="text-[10px] font-medium text-green uppercase tracking-wide">Réponse : </span>
          <span className="text-xs text-green">{q.correctAnswer}</span>
        </div>
      )}

      {/* Explanation */}
      <div className="p-3 rounded bg-blue/5 border border-blue/10">
        <p className="text-[10px] font-medium text-blue uppercase tracking-wide mb-1">Explication</p>
        <p className="text-xs text-text-secondary leading-relaxed">{q.explanation}</p>
      </div>
    </motion.div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────

function MessageBubble({
  message,
  onToggleConfirm,
  onSaveQuestions,
  onRegenerate,
}: {
  message: ChatMessage;
  onToggleConfirm: (idx: number) => void;
  onSaveQuestions: () => void;
  onRegenerate: () => void;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const hasQuestions = message.questions && message.questions.length > 0;
  const confirmedCount = message.questions?.filter((q) => q._confirmed).length ?? 0;

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-2"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-hover border border-border rounded-full">
          {message.filenames && message.filenames.length > 0 ? (
            <>
              <Upload size={12} className="text-blue" />
              <span className="text-xs text-text-secondary">
                Téléversé : {message.filenames.join(', ')}
              </span>
            </>
          ) : (
            <span className="text-xs text-text-tertiary">{message.content}</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-purple/20 flex items-center justify-center shrink-0">
          {hasQuestions ? (
            <Sparkles size={14} className="text-purple" />
          ) : (
            <Bot size={14} className="text-purple" />
          )}
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-1' : ''}`}>
        {/* Analysis text */}
        {message.analysis && (
          <div className="mb-3 px-4 py-3 rounded-card bg-card border border-border text-sm text-text-secondary leading-relaxed">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={13} className="text-blue" />
              <span className="text-[10px] font-medium text-blue uppercase tracking-wide">Analyse</span>
            </div>
            <p>{message.analysis}</p>
          </div>
        )}

        {/* Text content */}
        {message.content && (
          <div
            className={`px-4 py-3 rounded-card text-sm leading-relaxed ${
              isUser
                ? 'bg-purple text-white rounded-br-sm'
                : 'bg-card border border-border text-text-primary rounded-bl-sm [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto [&_svg]:my-3 [&_svg]:block [&_svg]:rounded-lg [&_svg]:border [&_svg]:border-border [&_svg]:p-2 [&_svg]:bg-white [&_li]:list-disc'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div
                className="whitespace-pre-wrap [&_svg]:whitespace-normal"
                dangerouslySetInnerHTML={{ __html: renderAIResponse(message.content) }}
              />
            )}
          </div>
        )}

        {/* Question previews */}
        {hasQuestions && (
          <div className="mt-3 space-y-3">
            {message.questions!.map((q, idx) => (
              <QuestionPreviewCard
                key={idx}
                q={q}
                index={idx}
                onToggleConfirm={onToggleConfirm}
              />
            ))}

            {/* Actions bar */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <Button
                variant="default"
                size="sm"
                onClick={onSaveQuestions}
                disabled={confirmedCount === 0}
                className="bg-purple hover:bg-purple/90"
              >
                <Download size={13} />
                Sauvegarder {confirmedCount > 0 ? `${confirmedCount} confirmée${confirmedCount > 1 ? 's' : ''}` : 'les questions'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onRegenerate}>
                <RefreshCw size={13} />
                Regénérer
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-right text-purple-200' : 'text-text-tertiary'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-purple flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function AIQuestionsPage() {
  const router = useRouter();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionSessionId, setQuestionSessionId] = useState<string | null>(null);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exam/Chapter selectors for saving
  const [exams, setExams] = useState<Exam[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{
    questions: PreviewQuestion[];
    messageId: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat history sidebar
  const [historySessions, setHistorySessions] = useState<Array<{id: string; topic: string | null; updatedAt: string; messages: {content: string; createdAt: string}[]}>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // ── Load chat history ─────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/chat-sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        setHistorySessions(json.data ?? []);
      }
    } catch { /* ignore */ }
    setLoadingHistory(false);
  }, []);

  // ── Load session messages into chat ──────────────────────────
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/chat-sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        const msgs = (json.data ?? []).map((m: any, i: number) => ({
          id: `${m.role}-${i}`,
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
          questions: m.metadata?.questions ?? undefined,
          analysis: m.metadata?.analysis ?? undefined,
          filenames: m.metadata?.filenames ?? undefined,
        }));
        setMessages(msgs);
        setQuestionSessionId(sessionId);
        setShowHistory(false);
      }
    } catch { /* ignore */ }
  }, []);

  // ── Load exams on mount ────────────────────────────────────

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
        if (res.ok) {
          const json = await res.json();
          setExams(json.data ?? []);
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // ── Load chapters when exam changes ────────────────────────

  useEffect(() => {
    if (!selectedExamId) { setChapters([]); return; }
    async function fetchChapters() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams/chapters/list?examId=${selectedExamId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const json = await res.json();
          setChapters(json.data ?? []);
        }
      } catch {}
    }
    fetchChapters();
  }, [selectedExamId]);

  // ── Auto-scroll ────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── File upload ────────────────────────────────────────────

  const handleUploadFiles = useCallback(async (files: FileList) => {
    const token = localStorage.getItem('token');
    if (!token || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError(`"${file.name}" n'est pas un format supporté (PDF, DOC, DOCX)`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/content/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (res.ok) {
          const data = await res.json();
          newFiles.push({
            id: data.id,
            filename: data.filename,
            pages: data.pages,
            uploadedAt: data.uploadedAt,
          });
        }
      } catch {
        setError(`Échec du téléversement de "${file.name}"`);
      }
    }

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Add system message confirming upload
      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: '',
        timestamp: new Date().toISOString(),
        filenames: newFiles.map((f) => f.filename),
      };
      setMessages((prev) => [...prev, sysMsg]);
    }

    setUploading(false);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // ── Send message to AI ─────────────────────────────────────

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    // Extract URLs from the input text
    const urlRegex = /https?:\/\/[^\s]+/g;
    const foundUrls = text.match(urlRegex) || [];
    const instructions = foundUrls.length > 0
      ? text.replace(urlRegex, '').trim()
      : text;

    setInput('');
    setSending(true);
    setError(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const token = localStorage.getItem('token');
      const body: Record<string, any> = {
        contentIds: uploadedFiles.map((f) => f.id),
        instructions: instructions || text,
      };
      if (foundUrls.length > 0) {
        body.urls = foundUrls;
      }
      if (questionSessionId) {
        body.sessionId = questionSessionId;
      }
      if (selectedExamId && selectedChapterId) {
        body.examId = selectedExamId;
        body.chapterId = selectedChapterId;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/chat-generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Échec de la génération');
      }

      const json = await res.json();
      const result = json.data;

      // Store session ID for follow-up messages
      if (result.sessionId) {
        setQuestionSessionId(result.sessionId);
      }

      // Add assistant response with questions or conversational response
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.response ?? '',
        timestamp: new Date().toISOString(),
        analysis: result.analysis,
        questions: (result.questions ?? []).map((q: PreviewQuestion) => ({
          ...q,
          _confirmed: false,
        })),
        filenames: result.filenames,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Échec de la génération';
      setError(errMsg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setSending(false);
    }
  }, [input, sending, uploadedFiles, router, questionSessionId, selectedExamId, selectedChapterId]);

  // ── Toggle question confirmation ───────────────────────────

  const handleToggleConfirm = useCallback((messageId: string, qIdx: number) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId || !m.questions) return m;
        const updated = [...m.questions];
        updated[qIdx] = {
          ...updated[qIdx],
          _confirmed: !updated[qIdx]._confirmed,
        };
        return { ...m, questions: updated };
      })
    );
  }, []);

  // ── Save confirmed questions ───────────────────────────────

  const handleOpenSaveDialog = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.questions) return;
    const confirmed = msg.questions.filter((q) => q._confirmed);
    if (confirmed.length === 0) return;
    setPendingSaveData({ questions: confirmed, messageId });
    setShowSaveDialog(true);
  }, [messages]);

  const handleSaveQuestions = useCallback(async () => {
    if (!pendingSaveData || !selectedExamId || !selectedChapterId) return;
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/chat-save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questions: pendingSaveData.questions.map((q) => ({
              question: q.question,
              options: q.options ?? undefined,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              type: q.type,
              difficulty: q.difficulty,
            })),
            examId: selectedExamId,
            chapterId: selectedChapterId,
            contentIds: uploadedFiles.map((f) => f.id),
          }),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Échec de l\'enregistrement');
      }

      const data = await res.json();

      // Add success message
      const successMsg: ChatMessage = {
        id: `success-${Date.now()}`,
        role: 'assistant',
        content: `✅ ${data.savedCount} question${data.savedCount > 1 ? 's' : ''} enregistrée${data.savedCount > 1 ? 's' : ''} comme EN ATTENTE. ${data.savedCount > 1 ? 'Elles' : 'Elle est'} maintenant dans la file de révision.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, successMsg]);

      setShowSaveDialog(false);
      setPendingSaveData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  }, [pendingSaveData, selectedExamId, selectedChapterId, uploadedFiles, router]);

  // ── Regenerate ─────────────────────────────────────────────

  const handleRegenerate = useCallback(async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.questions) return;

    const instructions = 'Regenerate with more variety. Keep the same count and style.';
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/questions/chat-generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentIds: uploadedFiles.map((f) => f.id),
            instructions,
            count: msg.questions.length,
            ...(questionSessionId ? { sessionId: questionSessionId } : {}),
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const result = json.data;
        const updatedQuestions = (result.questions ?? []).map((q: PreviewQuestion) => ({
          ...q,
          _confirmed: false,
        }));

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, questions: updatedQuestions, analysis: result.analysis }
              : m
          )
        );
      }
    } catch {
      setError('Échec de la régénération');
    } finally {
      setSending(false);
    }
  }, [messages, uploadedFiles, questionSessionId]);

  // ── New chat ───────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setUploadedFiles([]);
    setInput('');
    setError(null);
    setShowSaveDialog(false);
    setPendingSaveData(null);
    setQuestionSessionId(null);
  }, []);

  // ── Key handler ────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Empty state ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-8">
      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="w-72 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <History size={14} /> Historique
            </h2>
            <button onClick={() => setShowHistory(false)} className="text-text-tertiary hover:text-text-primary transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={16} className="animate-spin text-text-tertiary" />
              </div>
            ) : historySessions.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-8">Aucune session précédente</p>
            ) : (
              historySessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-hover transition-colors ${
                    s.id === questionSessionId ? 'bg-purple/5 border-l-2 border-l-purple' : ''
                  }`}
                >
                  <p className="text-xs font-medium text-text-primary truncate">
                    {s.topic ?? 'Session sans titre'}
                  </p>
                  <p className="text-[10px] text-text-tertiary mt-0.5 truncate">
                    {s.messages?.[0]?.content?.slice(0, 80) ?? 'Aucun message'}
                  </p>
                  <p className="text-[9px] text-text-tertiary/60 mt-0.5">
                    {new Date(s.updatedAt).toLocaleDateString()} {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-border shrink-0">
            <button
              onClick={loadHistory}
              disabled={loadingHistory}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              <RefreshCw size={11} className={loadingHistory ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-primary">
        {/* Header */}
        <div className="px-6 py-3 pl-10 border-b border-border bg-card shrink-0">
          <h1 className="text-sm font-semibold text-text-primary">Générateur de Questions IA</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Téléversez des PDFs, discutez avec l'IA, générez et confirmez des questions d'examen
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 pl-10 py-6 space-y-4">
          {messages.length === 0 ? (
            /* Welcome state */
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="h-16 w-16 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-purple" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Générateur de Questions IA</h2>
              <p className="text-sm text-text-secondary text-center max-w-md mb-6">
                Téléversez des documents PDF et Word (codes ICC, manuels de référence, manuels scolaires) et discutez avec l'IA
                pour générer des questions d'examen de style ICC. Révisez, confirmez et enregistrez-les.
              </p>

              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-lg border-2 border-dashed rounded-card p-8 text-center transition-colors ${
                  dragOver
                    ? 'border-purple bg-purple/5'
                    : 'border-border hover:border-purple/50 hover:bg-hover'
                }`}
              >
                <Upload size={24} className="mx-auto mb-3 text-text-tertiary" />
                <p className="text-sm text-text-secondary mb-2">
                  Déposez les fichiers PDF ici ou{' '}
                  <button
                    onClick={triggerFilePicker}
                    className="text-purple hover:text-purple/80 underline"
                  >
                    parcourir
                  </button>
                </p>
                <p className="text-[10px] text-text-tertiary">Documents PDF et Word (.pdf, .doc, .docx)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="w-full max-w-lg mt-6 flex flex-wrap gap-2">
                  {uploadedFiles.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-card text-xs"
                    >
                      <FileText size={12} className="text-blue" />
                      <span className="text-text-primary truncate max-w-[150px]">{f.filename}</span>
                      <span className="text-text-tertiary">{f.pages}p</span>
                      <button
                        onClick={() => removeFile(f.id)}
                        className="text-text-tertiary hover:text-red transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <p className="mt-4 text-xs text-text-secondary">
                  Fichiers téléversés. Tapez maintenant les instructions ci-dessous pour générer des questions.
                </p>
              )}
            </div>
          ) : (
            /* Chat messages */
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onToggleConfirm={(idx) => handleToggleConfirm(msg.id, idx)}
                onSaveQuestions={() => handleOpenSaveDialog(msg.id)}
                onRegenerate={() => handleRegenerate(msg.id)}
              />
            ))
          )}

          {/* Uploaded files bar (shown during chat) */}
          {messages.length > 0 && uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2 py-1">
              {uploadedFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-1.5 px-2 py-1 bg-hover border border-border rounded text-[10px]"
                >
                  <FileText size={10} className="text-blue" />
                  <span className="text-text-tertiary truncate max-w-[100px]">{f.filename}</span>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-text-tertiary hover:text-red"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={triggerFilePicker}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-blue hover:text-blue/80 border border-dashed border-blue/30 rounded"
              >
                <Plus size={10} /> Ajouter des fichiers
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
              />
            </div>
          )}

          {/* Loading indicator */}
          {sending && (
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="w-7 h-7 rounded-full bg-purple/20 flex items-center justify-center">
                <Loader2 size={12} className="text-purple animate-spin" />
              </div>
              <p className="text-xs">L'IA analyse les fichiers et génère des questions...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red/60 hover:text-red">
                <X size={14} />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border bg-card px-6 pl-10 py-4 shrink-0">
          {/* Action links */}
          <div className="flex items-center gap-3 mb-3">
            <a onClick={handleNewChat} className="flex items-center gap-1 px-3 py-1.5 rounded-btn bg-purple text-white text-xs font-medium hover:bg-purple/90 transition-colors cursor-pointer">
              <Plus size={12} />
              Nouveau Chat
            </a>
            <button
              onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadHistory(); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                showHistory ? 'bg-purple/20 text-purple' : 'bg-hover text-text-secondary hover:text-text-primary'
              }`}
            >
              <History size={12} />
              Historique
            </button>
            <a href="/admin/questions/review" className="flex items-center gap-1 px-3 py-1.5 rounded-btn bg-green/20 text-green text-xs font-medium hover:bg-green/30 transition-colors">
              Réviser en attente
            </a>
            <span className="text-[10px] text-text-tertiary ml-auto">Sélectionnez l'examen et le chapitre pour enregistrer automatiquement les questions</span>
          </div>
          {/* Exam/Chapter selectors for auto-save */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <select
                value={selectedExamId}
                onChange={(e) => { setSelectedExamId(e.target.value); setSelectedChapterId(''); }}
                className="w-full px-3 py-2 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple/50"
              >
                <option value="">Mode aperçu (pas d'enregistrement automatique)</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>{exam.code} — {exam.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={!selectedExamId}
                className="w-full px-3 py-2 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-50"
              >
                <option value="">Sélectionnez un chapitre...</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>Ch. {ch.number} — {ch.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Décrivez les questions à générer (ex: "Créez 5 questions QCM sur la corrosion")...'
                disabled={sending}
                rows={2}
                className="w-full px-4 py-3 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple resize-none transition-colors disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex items-center justify-center w-10 h-10 rounded-btn bg-purple hover:bg-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shrink-0"
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          {selectedExamId && selectedChapterId && (
            <p className="text-[10px] text-green mt-2">
              🔵 Mode d'enregistrement automatique : les questions seront enregistrées directement comme EN ATTENTE dans l'examen/chapitre sélectionné.
            </p>
          )}
        </div>
      </div>

      {/* Save dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSaveDialog(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#1A2035] border border-[#2D3A52] rounded-card shadow-2xl p-6"
            >
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Enregistrer les Questions
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                {pendingSaveData?.questions.length ?? 0} question{pendingSaveData?.questions.length !== 1 ? 's' : ''} confirmée{pendingSaveData?.questions.length !== 1 ? 's' : ''} seront enregistrée{pendingSaveData?.questions.length !== 1 ? 's' : ''} comme EN ATTENTE.
              </p>

              {/* Exam selector */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Examen cible</label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => { setSelectedExamId(e.target.value); setSelectedChapterId(''); }}
                    className="w-full px-3 py-2 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple/50"
                  >
                    <option value="">Sélectionnez un examen...</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>{exam.code} — {exam.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Chapitre</label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    disabled={!selectedExamId}
                    className="w-full px-3 py-2 bg-[#0A0E1A] border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-50"
                  >
                    <option value="">Sélectionnez un chapitre...</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>Ch. {ch.number} — {ch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowSaveDialog(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveQuestions}
                  disabled={!selectedExamId || !selectedChapterId || saving}
                  className="bg-purple hover:bg-purple/90"
                >
                  {saving ? (
                    <><Loader2 size={13} className="animate-spin" /> Enregistrement...</>
                  ) : (
                    <><Download size={13} /> Enregistrer {pendingSaveData?.questions.length ?? 0} Question{pendingSaveData?.questions.length !== 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
