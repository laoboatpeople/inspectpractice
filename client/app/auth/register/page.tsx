'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Plane } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Captcha from '@/components/Captcha';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function RegisterPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  useEffect(() => { document.title = `${t('auth_createAccount')} | Inspect Practice`; }, [t]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth_passwordMismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('pwTooShort'));
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (siteKey && !captchaToken) {
      setError(t('auth_captchaFailed'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, language: locale, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('auth_registrationFailed'));
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue flex items-center justify-center">
              <Plane size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary font-inter">Inspect Practice</span>
          </Link>
          <p className="text-sm text-text-secondary mt-1">{t('auth_createStudentAccount')}</p>
        </div>

        <div className="bg-card border border-border rounded-card p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-1">{t('auth_signUp')}</h2>
          <p className="text-sm text-text-secondary mb-6">
            {t('auth_registerSubtitle')}
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-btn">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('auth_fullNameLabel')}
              type="text"
              placeholder={t('auth_fullNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={16} />}
              required
              autoComplete="name"
            />

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
                placeholder={t('auth_passwordMinPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
                autoComplete="new-password"
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

            <div className="relative">
              <Input
                label={t('auth_confirmPasswordLabel')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth_confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? t('auth_hidePassword') : t('auth_showPassword')}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Captcha
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
            />

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? t('auth_registerCreating') : t('auth_createAccount')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-tertiary">{t('auth_alreadyHaveAccount')} </span>
            <Link
              href="/auth/login"
              className="text-blue hover:text-blue/80 transition-colors font-medium"
            >
              {t('auth_signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
