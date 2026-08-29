'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { useLocale } from '@/src/contexts/LocaleContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function ResetPasswordForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError(t('pwTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth_passwordMismatch'));
      return;
    }
    if (!token) {
      setError(t('auth_resetMissingToken'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('auth_resetErrorExpired'));
        return;
      }

      setSuccess(true);
    } catch {
      setError(t('unableToConnect'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-accent-red" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">{t('auth_resetInvalidLink')}</h2>
        <p className="text-sm text-text-secondary mb-6">
          {t('auth_resetInvalidDesc')}
        </p>
        <Link
          href="/auth/forgot-password"
          className="block w-full text-center py-2.5 bg-accent-blue text-white rounded-btn text-sm font-medium hover:bg-accent-blue/90 transition-colors"
        >
          {t('auth_resetRequestNew')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      {success ? (
        <>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-accent-green" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">{t('auth_resetSuccess')}</h2>
            <p className="text-sm text-text-secondary">{t('auth_resetSuccessDesc')}</p>
          </div>
          <Link
            href="/auth/login"
            className="block w-full text-center py-2.5 bg-accent-blue text-white rounded-btn text-sm font-medium hover:bg-accent-blue/90 transition-colors"
          >
            {t('auth_resetSignIn')}
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
              <h2 className="text-xl font-semibold text-text-primary">{t('auth_resetSetNew')}</h2>
              <p className="text-sm text-text-secondary mt-0.5">
                {t('auth_resetSubtitle')}
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
              label={t('newPassword')}
              type="password"
              placeholder={t('auth_passwordMinPlaceholder')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
              autoComplete="new-password"
            />
            <Input
              label={t('auth_confirmPasswordLabel')}
              type="password"
              placeholder={t('auth_confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              {t('auth_resetButton')}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/admin" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-blue flex items-center justify-center">
              <span className="text-white text-lg font-bold">SL</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">Inspect Practice</span>
          </Link>
        </div>
        <Suspense fallback={<div className="bg-card border border-border rounded-lg p-8 text-center text-text-secondary">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
