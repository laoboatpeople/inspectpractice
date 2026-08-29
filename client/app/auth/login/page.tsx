'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Plane, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Captcha from '@/components/Captcha';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  useEffect(() => { document.title = `${t('auth_signIn')} | Inspect Practice`; }, [t]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userStr = localStorage.getItem('user');
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.role === 'STUDENT') {
          router.push('/app');
        } else {
          router.push('/app');
        }
      } catch {
        router.push('/app');
      }
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('auth_invalidCredentials'));
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `auth_role=${data.user?.role || 'STUDENT'}; path=/; max-age=86400; SameSite=Lax`;

      router.push('/app');
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
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue flex items-center justify-center">
              <Plane size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary font-inter">Inspect Practice</span>
          </Link>
          <p className="text-sm text-text-secondary mt-1">{t('auth_studentPortal')}</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-card p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-1">{t('auth_signIn')}</h2>
          <p className="text-sm text-text-secondary mb-6">
            {t('auth_loginSubtitle')}
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-btn">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
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

            <div className="relative">
              <Input
                label={t('auth_passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth_passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? t('auth_hidePassword') : t('auth_showPassword')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Captcha
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-primary text-blue focus:ring-blue focus:ring-offset-primary cursor-pointer"
                />
                <span className="text-sm text-text-secondary">{t('auth_rememberMe')}</span>
              </label>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {t('auth_signIn')}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-text-tertiary hover:text-blue transition-colors flex items-center gap-1"
            >
              <HelpCircle size={13} />
              {t('auth_forgotTitle')}?
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/register"
                className="text-blue hover:text-blue/80 transition-colors font-medium"
              >
                {t('auth_createAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}