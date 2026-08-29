'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, Search, Plus, Trash2, X, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Subscriber {
  id: string;
  email: string;
  status: string;
  subscribedAt: string;
}

export default function NewsletterPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [addMsg, setAddMsg] = useState('');

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const fetchSubscribers = useCallback(async () => {
    const token = getToken();
    if (!token) { router.replace('/auth/admin-login'); return; }
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); router.push('/auth/admin-login'); return; }
      if (!res.ok) throw new Error('Failed to load subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatus('loading');
    setAddMsg('');
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setAddStatus('success');
      setAddMsg('Subscriber added successfully!');
      setNewEmail('');
      fetchSubscribers();
      setTimeout(() => { setShowAdd(false); setAddStatus('idle'); }, 1500);
    } catch (err: any) {
      setAddStatus('error');
      setAddMsg(err.message);
    }
  };

  const handleToggleStatus = async (sub: Subscriber) => {
    const token = getToken();
    const newStatus = sub.status === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE';
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribers/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchSubscribers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchSubscribers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Newsletter Subscribers</h1>
          <p className="text-sm text-text-secondary mt-1">
            {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setAddStatus('idle'); setAddMsg(''); setNewEmail(''); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Subscriber
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50"
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0A0E1A] border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary">Add Subscriber</h2>
              <button onClick={() => setShowAdd(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50"
              />
              {addMsg && (
                <p className={`text-sm ${addStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {addMsg}
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addStatus === 'loading'}
                  className="px-4 py-2 rounded-lg bg-blue text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
                >
                  {addStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-tertiary border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Subscribed</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-tertiary">
                    {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-hover transition-colors">
                    <td className="px-4 py-3 text-sm text-text-primary">{sub.email}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          sub.status === 'ACTIVE'
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                        title={sub.status === 'ACTIVE' ? 'Click to unsubscribe' : 'Click to reactivate'}
                      >
                        {sub.status === 'ACTIVE' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {sub.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
