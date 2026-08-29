'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Loader2, Search, Trash2, Send, X, ChevronLeft, Mail, Reply, Clock, User, CheckCheck, Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  direction?: string;
  status: string;
  replyText?: string | null;
  repliedAt?: string | null;
  repliedBy?: string | null;
  createdAt: string;
}

interface Conversation {
  email: string;
  name: string;
  messageCount: number;
  pendingCount: number;
  lastActivityAt: string;
  messages: ContactMessage[];
}

export default function ContactMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [replyMsg, setReplyMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingConv, setDeletingConv] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConvs, setTotalConvs] = useState(0);
  const limit = 20;
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Compose (new email) modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeName, setComposeName] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeStatus, setComposeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [composeMsg, setComposeMsg] = useState('');

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) { router.replace('/auth/admin-login'); return; }
    try {
      const res = await fetch(`${API_URL}/api/admin/contact-messages/conversations?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
      if (!res.ok) throw new Error('Failed to load conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
      setTotalPages(data.totalPages || 1);
      setTotalConvs(data.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, router, page, limit]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Auto-scroll to bottom when selecting a conversation
  useEffect(() => {
    if (selectedConv && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv]);

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setDeletingId(id);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchConversations();
      // If the deleted message was in the selected conversation, refresh selection
      if (selectedConv) {
        const stillHasMessages = selectedConv.messages.some(m => m.id !== id);
        if (!stillHasMessages) {
          setSelectedConv(null);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteConversation = async (email: string) => {
    if (!confirm(`Delete entire conversation with ${email}?`)) return;
    setDeletingConv(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/admin/contact-messages/conversation/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete conversation');
      setSelectedConv(null);
      fetchConversations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingConv(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    // Find the latest pending message to reply to
    const targetMsg = selectedConv.messages
      .filter(m => m.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    setReplyStatus('loading');
    setReplyMsg('');
    const token = getToken();
    try {
      let res: Response;
      if (targetMsg) {
        // Reply to the pending inbound message
        res = await fetch(`${API_URL}/api/admin/contact-messages/${targetMsg.id}/reply`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ replyText: replyText.trim() }),
        });
      } else {
        // No pending message — send a new proactive message to the conversation
        res = await fetch(`${API_URL}/api/admin/contact-messages/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            to: selectedConv.email,
            toName: selectedConv.name || '',
            subject: 'InspectPractice',
            body: replyText.trim(),
          }),
        });
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }
      setReplyStatus('success');
      setReplyMsg(targetMsg ? 'Reply sent successfully!' : 'Message sent successfully!');
      setReplyText('');
      // Refresh to show the new message / replied status
      fetchConversations();
      setTimeout(() => {
        setReplyStatus('idle');
        setReplyMsg('');
      }, 2000);
    } catch (err: any) {
      setReplyStatus('error');
      setReplyMsg(err.message);
    }
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;
    setComposeStatus('loading');
    setComposeMsg('');
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/admin/contact-messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          to: composeTo.trim(),
          toName: composeName.trim(),
          subject: composeSubject.trim(),
          body: composeBody.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      if (!data.emailSent) throw new Error("L'email n'a pas pu être envoyé (vérifiez la configuration Resend).");
      setComposeStatus('success');
      setComposeMsg('Email envoyé avec succès !');
      setComposeTo(''); setComposeName(''); setComposeSubject(''); setComposeBody('');
      fetchConversations();
      setTimeout(() => { setComposeOpen(false); setComposeStatus('idle'); setComposeMsg(''); }, 1500);
    } catch (err: any) {
      setComposeStatus('error');
      setComposeMsg(err.message);
    }
  };

  const filtered = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase()) ||
    conv.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = conversations.reduce((sum, c) => sum + c.pendingCount, 0);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-CA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Contact Messages</h1>
          <p className="text-sm text-text-secondary mt-1">
            {totalPending} pending &middot; {totalConvs} conversations
          </p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Envoyer un email
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex-shrink-0">
          {error}
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left panel — conversation list */}
        <div className={`flex flex-col w-full ${selectedConv ? 'hidden lg:flex lg:w-1/3' : ''} bg-secondary rounded-xl border border-border overflow-hidden flex-shrink-0`}>
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-tertiary">
                {search ? 'No conversations match your search.' : 'No conversations yet.'}
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.email}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-hover transition-colors ${
                    selectedConv?.email === conv.email ? 'bg-blue/5 border-l-2 border-l-blue' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{conv.name}</span>
                        {conv.pendingCount > 0 && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-medium">
                            {conv.pendingCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">{conv.email}</p>
                      <p className="text-xs text-text-secondary mt-1 truncate">
                        {conv.messages[conv.messages.length - 1]?.message.substring(0, 80) || ''}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] text-text-tertiary whitespace-nowrap">
                        {formatDate(conv.lastActivityAt)}
                      </p>
                      <p className="text-[10px] text-text-tertiary mt-1">
                        {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-tertiary flex-shrink-0">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary border border-border text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs text-text-tertiary">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary border border-border text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Right panel — thread view */}
        <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden lg:flex lg:items-center lg:justify-center' : ''} bg-secondary rounded-xl border border-border overflow-hidden`}>
          {!selectedConv ? (
            <div className="text-center p-8">
              <MessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
              <p className="text-sm text-text-tertiary">Select a conversation to view messages</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-tertiary flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="lg:hidden p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-text-primary truncate">{selectedConv.name}</h2>
                    <p className="text-xs text-text-tertiary truncate">{selectedConv.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDeleteConversation(selectedConv.email)}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete entire conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-text-tertiary">
                    {selectedConv.messageCount} message{selectedConv.messageCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Messages thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConv.messages.map((msg) => (
                  <div key={msg.id}>
                    {/* Outbound message (sent by admin via email) */}
                    {msg.direction === 'outbound' ? (
                      <div className="flex items-start gap-3 ml-11 group">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-green-400">You said</span>
                            <span className="text-[10px] text-text-tertiary">{formatDate(msg.createdAt)}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm text-text-primary whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingId === msg.id}
                          className="p-1 rounded text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Delete message"
                        >
                          {deletingId === msg.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Inbound message */}
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-text-primary">{msg.name}</span>
                              <span className="text-[10px] text-text-tertiary">{formatDate(msg.createdAt)}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-tertiary border border-border text-sm text-text-primary whitespace-pre-wrap">
                              {msg.message}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            disabled={deletingId === msg.id}
                            className="p-1 rounded text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Delete message"
                          >
                            {deletingId === msg.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Reply via admin panel */}
                        {msg.replyText && (
                          <div className="flex items-start gap-3 mt-3 ml-11">
                            <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                              <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-green-400">You replied</span>
                                {msg.repliedAt && (
                                  <span className="text-[10px] text-text-tertiary">{formatDate(msg.repliedAt)}</span>
                                )}
                              </div>
                              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm text-text-primary whitespace-pre-wrap">
                                {msg.replyText}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-border bg-tertiary flex-shrink-0">
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50"
                  />
                  <button
                    type="submit"
                    disabled={replyStatus === 'loading' || !replyText.trim()}
                    className="px-4 py-2.5 rounded-lg bg-blue text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 flex-shrink-0"
                  >
                    {replyStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </form>
                {replyMsg && (
                  <p className={`mt-2 text-xs ${replyStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {replyMsg}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compose (new email) modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => composeStatus !== 'loading' && setComposeOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue/10 border border-blue/20 flex items-center justify-center">
                  <Mail size={14} className="text-blue" />
                </div>
                <p className="text-sm font-semibold text-text-primary">Envoyer un email</p>
              </div>
              <button onClick={() => composeStatus !== 'loading' && setComposeOpen(false)} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCompose} className="px-6 py-5 space-y-4">
              {composeMsg && (
                <p className={`text-xs px-3 py-2 rounded-lg border ${composeStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {composeMsg}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Destinataire *</label>
                  <input
                    type="email"
                    placeholder="email@exemple.com"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Nom (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Nom du destinataire"
                    value={composeName}
                    onChange={(e) => setComposeName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Sujet *</label>
                <input
                  type="text"
                  placeholder="Sujet de l'email"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Message *</label>
                <textarea
                  placeholder="Votre message…"
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-4">
                <button type="button" onClick={() => setComposeOpen(false)} disabled={composeStatus === 'loading'} className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={composeStatus === 'loading'} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {composeStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {composeStatus === 'loading' ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
