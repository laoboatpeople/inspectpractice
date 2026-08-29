'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  BookOpen,
  Zap,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Crown,
  ArrowRight,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { UserProfile } from '@/types/student';
import { getMe, getStripePortal } from '@/lib/student-api';
import { useLocale } from '@/src/contexts/LocaleContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Helpers ────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPlanBadge(plan: string | undefined) {
  switch (plan) {
    case 'FREE':
      return { label: 'freePlan', color: 'text-text-secondary', bg: 'bg-border/50' };
    case 'MONTHLY':
      return { label: 'monthlyPlan', color: 'text-blue', bg: 'bg-blue/10' };
    case 'LIFETIME':
      return { label: 'lifetimePlan', color: 'text-amber', bg: 'bg-amber/10' };
    default:
      return { label: 'freePlan', color: 'text-text-secondary', bg: 'bg-border/50' };
  }
}

// ─── Skeleton ────────────────────────────────────────────────

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-card border border-border rounded-card p-6 animate-pulse">
      <div className="h-4 w-32 bg-border rounded mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-border rounded mb-2 last:mb-0" style={{ width: `${60 + i * 20}%` }} />
      ))}
    </div>
  );
}

// ─── Section Card ────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-card overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <div className="text-text-tertiary">{icon}</div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

// ─── Profile Page ────────────────────────────────────────────

export default function ProfilePage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Change password
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Manage subscription
  const [portalLoading, setPortalLoading] = useState(false);

  // Edit profile
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadData();
  }, [router]);

  useEffect(() => {
    document.title = `${t('profile')} | Inspect Practice`;
  }, [t]);

  async function loadData() {
    setLoading(true);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err: any) {
      setError(err.message || t('couldNotLoad'));
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPassword.length < 8) {
      setPwError(t('pwTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(t('pwMismatch'));
      return;
    }

    setPwLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwError(data.message || t('failedToChange'));
        return;
      }

      setPwSuccess(t('passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePw(false);
    } catch {
      setPwError(t('unableToConnect'));
    } finally {
      setPwLoading(false);
    }
  }

  function startEditing() {
    setEditName(user!.name);
    setEditEmail(user!.email);
    setEditError('');
    setEditSuccess('');
    setEditing(true);
  }

  async function handleSaveProfile() {
    setEditError('');
    setEditSuccess('');

    if (!editName.trim() || editName.trim().length < 2) {
      setEditError(t('nameTooShort'));
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setEditError(t('invalidEmail'));
      return;
    }

    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim(), email: editEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message || t('failedToUpdate'));
        return;
      }

      setUser((prev) => prev ? { ...prev, name: data.user.name, email: data.user.email } : prev);
      setEditSuccess(t('profileUpdated'));
      setEditing(false);
    } catch {
      setEditError(t('unableToConnect'));
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError('');
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      router.push('/auth/login');
    } catch (err: any) {
      setDeleteError(err.message || 'Unable to delete account');
    } finally {
      setDeleting(false);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const result = await getStripePortal();
      if (result.url) {
        window.open(result.url, '_blank');
      } else if (result.message) {
        // LIFETIME user — just show message, nothing to manage
        alert(result.message);
      }
    } catch {
      alert(t('unableToConnect'));
    } finally {
      setPortalLoading(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-border animate-pulse" />
          <div>
            <div className="h-5 w-32 bg-border rounded animate-pulse" />
            <div className="h-3 w-48 bg-border rounded mt-1 animate-pulse" />
          </div>
        </div>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={6} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 gap-4">
        <div className="h-14 w-14 rounded-full bg-red/10 flex items-center justify-center">
          <XCircle size={28} className="text-red" />
        </div>
        <p className="text-text-secondary text-sm">{error || t('couldNotLoad')}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-btn bg-card border border-border text-sm text-text-primary hover:bg-hover transition-colors"
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  const plan = getPlanBadge(user.subscription?.plan);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-text-primary">{t('profile')}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{t('manageAccount')}</p>
      </motion.div>

      {/* User info */}
      <SectionCard title={t('personalInfo')} icon={<User size={16} />} delay={0}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-blue/15 flex items-center justify-center">
            <span className="text-lg font-bold text-blue">{getInitials(editing ? editName : user.name)}</span>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0A0E1A] text-text-primary rounded-btn px-3 py-2 text-sm border border-border focus:outline-none focus:border-blue transition-colors"
                  placeholder={t('namePlaceholder')}
                />
                <div className="relative">
                  <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#0A0E1A] text-text-primary rounded-btn pl-9 pr-3 py-2 text-sm border border-border focus:outline-none focus:border-blue transition-colors"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-text-primary">{user.name}</p>
                <p className="text-sm text-text-secondary flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} />
                  {user.email}
                </p>
              </div>
            )}
          </div>
          {!editing && (
            <button
              onClick={startEditing}
              className="shrink-0 px-3 py-1.5 rounded-btn bg-card border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-hover transition-colors"
            >
              {t('edit')}
            </button>
          )}
        </div>

        {editError && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-btn text-sm text-red">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {editError}
          </div>
        )}
        {editSuccess && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-green/10 border border-green/20 rounded-btn text-sm text-green">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            {editSuccess}
          </div>
        )}

        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              disabled={editLoading}
              className="px-4 py-2 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50"
            >
              {editLoading ? t('saving') : t('save')}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditError('');
                setEditSuccess('');
              }}
              className="px-4 py-2 rounded-btn bg-card border border-border text-text-secondary text-sm hover:text-text-primary transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield size={14} className="text-text-tertiary shrink-0" />
              <span className="text-text-secondary">{t('role')}</span>
              <span className="text-text-primary ml-auto capitalize">{user.role.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={14} className="text-text-tertiary shrink-0" />
              <span className="text-text-secondary">{t('memberSince')}</span>
              <span className="text-text-primary ml-auto">{formatDate(user.createdAt, locale)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 size={14} className="text-text-tertiary shrink-0" />
              <span className="text-text-secondary">{t('status')}</span>
              <span className={`ml-auto ${user.isActive ? 'text-green' : 'text-red'}`}>
                {user.isActive ? t('active') : t('inactive')}
              </span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Subscription */}
      <SectionCard title={t('subscription')} icon={<CreditCard size={16} />} delay={0.1}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${plan.bg} flex items-center justify-center`}>
              {user.subscription?.plan === 'LIFETIME' ? (
                <Crown size={18} className={plan.color} />
              ) : (
                <CreditCard size={18} className={plan.color} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{t(plan.label)}</p>
              <p className={`text-xs ${plan.color} font-medium`}>
                {user.subscription?.status === 'ACTIVE' ? t('activeStatus') : t('noSubscription')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {user.subscription?.plan === 'FREE' || !user.subscription ? (
            <Link
              href="/subscription"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors"
            >
              {t('upgradePlan')}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-card border border-border text-text-primary text-sm font-medium hover:bg-hover transition-colors disabled:opacity-50"
            >
              <ExternalLink size={14} />
              {portalLoading ? t('loading') : t('manageBilling')}
            </button>
          )}
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title={t('security')} icon={<Lock size={16} />} delay={0.3}>
        {!showChangePw ? (
          <button
            onClick={() => setShowChangePw(true)}
            className="text-sm text-blue hover:text-blue/80 transition-colors flex items-center gap-1.5"
          >
            <Lock size={14} />
            {t('changePassword')}
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwError && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-btn text-sm text-red">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-start gap-2 px-4 py-3 bg-green/10 border border-green/20 rounded-btn text-sm text-green">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                {pwSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {t('currentPassword')}
              </label>
              <div className="relative">
                <input
                  type={showCurPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#0A0E1A] text-text-primary rounded-btn px-4 py-2.5 pr-10 text-sm border border-border focus:outline-none focus:border-blue transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  onClick={() => setShowCurPw(!showCurPw)}
                  tabIndex={-1}
                >
                  {showCurPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {t('newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0A0E1A] text-text-primary rounded-btn px-4 py-2.5 pr-10 text-sm border border-border focus:outline-none focus:border-blue transition-colors"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  onClick={() => setShowNewPw(!showNewPw)}
                  tabIndex={-1}
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0A0E1A] text-text-primary rounded-btn px-4 py-2.5 pr-10 text-sm border border-border focus:outline-none focus:border-blue transition-colors"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  onClick={() => setShowConfPw(!showConfPw)}
                  tabIndex={-1}
                >
                  {showConfPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={pwLoading}
                className="px-5 py-2 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50"
              >
                {pwLoading ? t('saving') : t('updatePassword')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePw(false);
                  setPwError('');
                  setPwSuccess('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 rounded-btn bg-card border border-border text-text-secondary text-sm hover:text-text-primary transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        )}
      </SectionCard>

      {/* Delete Account */}
      <SectionCard title={'Delete Account'} icon={<XCircle size={16} />} delay={0.4}>
        <p className="text-sm text-text-secondary mb-3">
          {'Deleting your account permanently removes all your data, quizzes, sessions, and subscriptions. This action is irreversible.'}
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-btn bg-red/10 border border-red/30 text-red text-sm font-medium hover:bg-red/20 transition-colors"
          >
            {'Delete my account'}
          </button>
        ) : (
          <div className="space-y-3 p-4 rounded-btn bg-red/5 border border-red/20">
            <p className="text-sm text-red font-semibold">
              {'Are you absolutely sure? This cannot be undone.'}
            </p>
            {deleteError && (
              <p className="text-sm text-red">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-btn bg-red text-white text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, permanently delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteError('');
                }}
                disabled={deleting}
                className="px-4 py-2 rounded-btn bg-card border border-border text-text-secondary text-sm hover:text-text-primary transition-colors disabled:opacity-50"
              >
                {'Delete my account'}
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
