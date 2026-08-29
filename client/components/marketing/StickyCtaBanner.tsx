'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function StickyCtaBanner() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.4 && !visible) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible, dismissed]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setTimeout(() => setDismissed(true), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-[#0F172A] border-t border-[#1E293B] px-4 py-3 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">🏗️ <strong>{isFr ? "Questions d'entraînement ICC gratuites" : 'Free ICC practice questions'}</strong></p>
            <p className="text-xs text-[#94A3B8] hidden sm:block mt-0.5">
              {isFr ? 'Testez vos connaissances avec de vraies questions de style ICC à livre ouvert' : 'Test your knowledge with real ICC-style open-book code questions'}
            </p>
          </div>

          {status === 'success' ? (
            <p className="text-sm text-green shrink-0">{isFr ? '✓ Abonné !' : '✓ Subscribed!'}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 shrink-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? 'Votre courriel' : 'Your email'}
                required
                className="w-44 sm:w-56 px-3 py-1.5 text-sm bg-[#1E293B] border border-[#2D3A52] rounded-lg text-white placeholder-[#64748B] focus:outline-none focus:border-[#C8102E]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-1.5 text-sm font-medium bg-[#C8102E] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 shrink-0"
              >
                {status === 'loading' ? '...' : isFr ? 'Obtenir des questions gratuites' : 'Get Free Questions'}
              </button>
            </form>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-[#64748B] hover:text-white transition-colors shrink-0"
            aria-label={isFr ? 'Fermer' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
