'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Captcha from '@/components/Captcha';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (siteKey && !captchaToken) {
      setError(t('auth_captchaFailed') || 'Please complete the security check');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, captchaToken }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('auth_forgotErrorSend'));
        return;
      }

      setSuccess(true);
    } catch {
      setError(t('unableToConnect'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-blue flex items-center justify-center">
              <span className="text-white text-lg font-bold">SL</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">Inspect Practice</span>
          </Link>
          <p className="text-sm text-text-secondary mt-1">{t('auth_tcAmePlatform')}</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          {success ? (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{t('auth_forgotCheckEmail')}</h2>
                <p className="text-sm text-text-secondary">
                  {t('auth_forgotSuccessText', { email })}
                </p>
              </div>
              <p className="text-center text-sm text-text-tertiary mb-6">
                {t('auth_forgotNotReceived')}{' '}
                <button
                  onClick={() => { setSuccess(false); setEmail(''); }}
                  className="text-accent-blue hover:text-accent-blue/80"
                >
                  {t('auth_forgotTryAgain')}
                </button>
                .
              </p>
              <Link
                href="/auth/login"
                className="block w-full text-center py-2.5 border border-border rounded-btn text-sm text-text-secondary hover:text-text-primary hover:border-border transition-colors"
              >
                {t('auth_signIn')}
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Link
                  href="/auth/login"
                  className="p-2 -ml-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors"
                >
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">{t('auth_forgotTitle')}</h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {t('auth_forgotSubtitle')}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-accent-red mt-0.5 shrink-0" />
                  <p className="text-sm text-accent-red">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label={t('auth_emailLabel')}
                  type="email"
                  placeholder={t('auth_emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={16} />}
                  required
                  autoComplete="email"
                />

                <Captcha
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken('')}
                />

                <Button type="submit" className="w-full" loading={loading}>
                  {t('auth_forgotSendLink')}
                </Button>
              </form>
            </>
          )}
        </div>

        {!success && (
          <p className="text-center text-sm text-text-tertiary mt-6">
            {t('auth_forgotRememberPassword')}{' '}
            <Link
              href="/auth/login"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              {t('auth_signIn')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
