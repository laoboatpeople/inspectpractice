'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Captcha from '@/components/Captcha';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    document.title = `${t('auth_adminSignIn')} | Inspect Practice`;
  }, [t]);

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
        if (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') {
          router.push('/admin');
        }
      } catch { /* ignore */ }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (siteKey && !captchaToken) {
      setError(t('auth_captchaFailed'));
      setLoading(false);
      return;
    }

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

      // Block students from admin login
      if (data.user?.role === 'STUDENT') {
        setError(t('auth_adminLoginError'));
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `auth_role=${data.user?.role || 'ADMIN'}; path=/; max-age=86400; SameSite=Lax`;
      router.push('/admin');
    } catch {
      setError(t('unableToConnect'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">{t('auth_adminPortal')}</span>
          </Link>
          <p className="text-sm text-text-secondary mt-1">Inspect Practice — {t('auth_adminSignIn')}</p>
        </div>

        <div className="bg-card border border-border rounded-card p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-1">{t('auth_adminSignIn')}</h2>
          <p className="text-sm text-text-secondary mb-6">
            {t('auth_adminLoginSubtitle')}
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

            <Captcha onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

            <Button type="submit" className="w-full" loading={loading}>
              {t('auth_adminSignIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-text-tertiary hover:text-blue transition-colors"
            >
              ← {t('auth_studentPortal')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
