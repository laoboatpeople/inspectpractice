'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const Captcha = dynamic(() => import('@/components/Captcha'), { ssr: false });

export default function ContactForm() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, captchaToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || (isFr ? 'Échec de l\'envoi' : 'Failed to send'));
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : (isFr ? 'Quelque chose s\'est mal passé' : 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green" />
        </div>
        <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">{isFr ? 'Message envoyé !' : 'Message sent!'}</h3>
        <p className="text-sm text-[#94A3B8] mb-4">
          {isFr ? 'Nous vous répondrons dès que possible.' : 'We\'ll get back to you as soon as possible.'}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm text-[#C8102E] hover:text-[#60A5FA] transition-colors"
        >
          {isFr ? 'Envoyer un autre message' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
          <p className="text-sm text-red">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{isFr ? 'Votre nom' : 'Your Name'}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={isFr ? 'Jean Dupont' : 'John Smith'}
          className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-white/10 rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#C8102E]/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{isFr ? 'Votre courriel' : 'Your Email'}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={isFr ? 'vous@exemple.com' : 'you@example.com'}
          className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-white/10 rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#C8102E]/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{isFr ? 'Message' : 'Message'}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder={isFr ? 'Comment pouvons-nous vous aider ?' : 'How can we help?'}
          className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-white/10 rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#C8102E]/50 transition-colors resize-vertical"
        />
      </div>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <Captcha onVerify={(token) => setCaptchaToken(token)} />

      <button
        type="submit"
        disabled={loading || !captchaToken}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {isFr ? 'Envoi en cours...' : 'Sending...'}
          </span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {isFr ? 'Envoyer le message' : 'Send Message'}
          </>
        )}
      </button>
    </form>
  );
}
