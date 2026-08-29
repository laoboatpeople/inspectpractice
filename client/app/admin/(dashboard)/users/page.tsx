'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Eye,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  RefreshCw,
  Users as UsersIcon,
  ChevronDown,
  Plus,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  EyeOff,
  Edit2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import type { User, Plan, Role } from '@/types';

const ROLE_OPTIONS = [
  { value: '', label: 'Tous les Rôles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'INSTRUCTOR', label: 'Instructeur' },
  { value: 'STUDENT', label: 'Étudiant' },
];

const SUBSCRIPTION_OPTIONS = [
  { value: '', label: 'Tous les Forfaits' },
  { value: 'FREE', label: 'Gratuit' },
  { value: 'MONTHLY', label: 'Mensuel' },
                  { value: 'LIFETIME', label: 'À vie' },
];

function getRoleColor(role: string) {
  switch (role) {
    case 'ADMIN':      return 'text-purple bg-purple/10 border-purple/20';
    case 'INSTRUCTOR': return 'text-cyan bg-cyan/10 border-cyan/20';
    case 'STUDENT':    return 'text-blue bg-blue/10 border-blue/20';
    default:           return 'text-text-secondary bg-hover border-border';
  }
}

function getSubscriptionColor(plan: string) {
  switch (plan) {
    case 'FREE':   return 'text-text-secondary bg-hover border-border';
    case 'MONTHLY': return 'text-blue bg-blue/10 border-blue/20';
    case 'LIFETIME':  return 'text-green bg-green/10 border-green/20';
    default:        return 'text-text-secondary bg-hover border-border';
  }
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-9 h-9 text-xs';
  const colors = [
    'bg-blue/20 text-blue',
    'bg-cyan/20 text-cyan',
    'bg-purple/20 text-purple',
    'bg-green/20 text-green',
    'bg-amber/20 text-amber',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-semibold ${colors[idx]}`}>
      {initials}
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Jamais';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}j`;
  return formatDate(dateStr);
}

interface DeleteModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (deletedId: string) => void;
}

function DeleteModal({ user, onClose, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }
      onConfirm(user.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red/10 border border-red/20 flex items-center justify-center">
              <Trash2 size={14} className="text-red" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Supprimer l'utilisateur</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}
          <p className="text-sm text-text-secondary">
            Êtes-vous sûr de vouloir supprimer définitivement <span className="font-medium text-text-primary">{user.name}</span> ? Cette action est irréversible.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            {loading ? 'Suppression…' : 'Supprimer l\'utilisateur'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SuspendModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (deletedId?: string, updatedUser?: User) => void;
}

function SuspendModal({ user, onClose, onConfirm }: SuspendModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }
      onConfirm(undefined, { ...user, isActive: !user.isActive });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
      return;
    } finally {
      setLoading(false);
    }
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber/10 border border-amber/20 flex items-center justify-center">
              <UserX size={14} className="text-amber" />
            </div>
            <p className="text-sm font-semibold text-text-primary">
              {user.isActive ? 'Suspendre l\'utilisateur' : 'Réactiver l\'utilisateur'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}
          <p className="text-sm text-text-secondary">
            {user.isActive
              ? `Êtes-vous sûr de vouloir suspendre ${user.name} ? Il/elle ne pourra plus se connecter.`
              : `Êtes-vous sûr de vouloir réactiver ${user.name} ? Il/elle retrouvera l'accès.`}
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant={user.isActive ? 'danger' : 'success'}
            onClick={handleConfirm}
            loading={loading}
          >
            {loading ? 'Traitement…' : user.isActive ? 'Suspendre' : 'Réactiver'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); return; }
      onSuccess();
      onClose();
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Plus size={14} className="text-blue" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Créer un utilisateur</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Nom complet</label>
            <input
              type="text"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={handleChange('name')}
              required
              autoComplete="name"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              placeholder="jean@exemple.com"
              value={form.email}
              onChange={handleChange('email')}
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Shield size={11} className="text-text-tertiary" /> Role</span>
            </label>
            <select
              value={form.role}
              onChange={handleChange('role')}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary appearance-none focus:outline-none focus:border-blue/50"
            >
              <option value="STUDENT">Étudiant</option>
              <option value="INSTRUCTOR">Instructeur</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 caractères"
              value={form.password}
              onChange={handleChange('password')}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30px] text-text-tertiary hover:text-text-secondary">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Répéter le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <CheckCircle size={12} className={form.password.length >= 8 ? 'text-green' : 'text-text-tertiary'} />
            <span className={`text-xs ${form.password.length >= 8 ? 'text-text-secondary' : 'text-text-tertiary'}`}>Au moins 8 caractères</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-4">
            <Button variant="secondary" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={loading}>Créer l'utilisateur</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    plan: user.subscription?.plan ?? 'FREE',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: 'name' | 'email' | 'role' | 'plan') => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      // 1. Update user fields (name, email, role, isActive)
      const userRes = await fetch(`${apiBase}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          isActive: form.isActive,
        }),
      });
      const userData = await userRes.json();
      if (!userRes.ok) { setError(userData.message || 'Update failed'); return; }

      // 2. If plan changed, update subscription separately
      const originalPlan = user.subscription?.plan ?? 'FREE';
      let newSubscription = user.subscription ?? null;
      if (form.plan !== originalPlan) {
        const subRes = await fetch(`${apiBase}/api/users/${user.id}/subscription`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan: form.plan }),
        });
        if (!subRes.ok) {
          const subData = await subRes.json().catch(() => ({}));
          setError(subData.message || 'Subscription update failed'); return;
        }
        const subData = await subRes.json();
        newSubscription = subData;
      }

      // 3. If new password provided, update password separately
      if (newPassword) {
        const pwRes = await fetch(`${apiBase}/api/users/${user.id}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        });
        if (!pwRes.ok) {
          const pwData = await pwRes.json().catch(() => ({}));
          setError(pwData.message || 'Password update failed'); return;
        }
      }

      const updated: User = {
        ...user,
        name: form.name,
        email: form.email,
        role: form.role as User['role'],
        isActive: form.isActive,
        subscription: newSubscription
          ? { ...newSubscription }
          : undefined,
      };
      onSuccess(updated);
      onClose();
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Edit2 size={14} className="text-blue" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Modifier l'utilisateur</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Nom complet</label>
            <input
              type="text"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={handleChange('name')}
              required
              autoComplete="name"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              placeholder="jean@exemple.com"
              value={form.email}
              onChange={handleChange('email')}
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Shield size={11} className="text-text-tertiary" /> Role</span>
            </label>
            <select
              value={form.role}
              onChange={handleChange('role')}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary appearance-none focus:outline-none focus:border-blue/50"
            >
              <option value="STUDENT">Étudiant</option>
              <option value="INSTRUCTOR">Instructeur</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Forfait d'abonnement</label>
            <select
              value={form.plan}
              onChange={handleChange('plan')}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary appearance-none focus:outline-none focus:border-blue/50"
            >
              <option value="FREE">Gratuit</option>
              <option value="MONTHLY">Mensuel</option>
              <option value="LIFETIME">À vie</option>
            </select>
          </div>

          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isActive ? 'bg-green' : 'bg-red/50'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm font-medium ${form.isActive ? 'text-green' : 'text-red'}`}>
              {form.isActive ? 'Actif' : 'Suspendu'}
            </span>
          </div>

          {/* Password reset section */}
          <div className="pt-2 mt-4 border-t border-border">
            <p className="text-xs font-medium text-text-secondary mb-3">Réinitialiser le mot de passe</p>
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Nouveau mot de passe</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-[#0A0E1A] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30px] text-text-tertiary hover:text-text-secondary">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Répéter le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-[#0A0E1A] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
                />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red">Les mots de passe ne correspondent pas</p>
              )}
              {newPassword && newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-red">Le mot de passe doit contenir au moins 8 caractères</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-4">
            <Button variant="secondary" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={loading}>Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EmailUserModalProps {
  user: User;
  onClose: () => void;
}

function EmailUserModal({ user, onClose }: EmailUserModalProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/contact-messages/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            to: user.email,
            toName: user.name || '',
            subject: subject.trim(),
            body: body.trim(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      if (data.emailSent) {
        setSent(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setError("L'email n'a pas pu être envoyé (vérifiez la configuration Resend).");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Mail size={14} className="text-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Envoyer un email</p>
              <p className="text-[11px] text-text-tertiary">{user.name} · {user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {sent && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green/10 border border-green/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
              <p className="text-sm text-green">Email envoyé avec succès.</p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red mt-0.5 shrink-0" />
              <p className="text-sm text-red">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Sujet *</label>
            <input
              type="text"
              placeholder="Sujet de l'email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Message *</label>
            <textarea
              placeholder="Votre message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-bg-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-blue/50 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-4">
            <Button variant="secondary" type="button" onClick={onClose} disabled={sending}>Annuler</Button>
            <Button type="submit" loading={sending} disabled={sent}>
              <Send size={13} className="mr-1" />
              {sending ? 'Envoi…' : 'Envoyer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [createUser, setCreateUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [emailUser, setEmailUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      const params = new URLSearchParams({
        page: String(resetPage ? 1 : page),
        limit: String(limit),
        sort: 'registered',
        order: 'desc',
      });
      if (roleFilter) params.set('role', roleFilter);
      if (subscriptionFilter) params.set('subscription', subscriptionFilter);
      if (search) params.set('search', search);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        router.push('/auth/admin-login');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setUsers(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, subscriptionFilter, search, router]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(true);
  };

  const clearFilters = () => {
    setRoleFilter('');
    setSubscriptionFilter('');
    setSearch('');
    setPage(1);
  };

  const handleUserAction = (deletedId?: string, _updatedUser?: User) => {
    setDeleteUser(null);
    setSuspendUser(null);
    setEditUser(null);
    if (deletedId) {
      setUsers(prev => prev.filter(u => u.id !== deletedId));
    }
    // Always re-fetch from server after any action to ensure data consistency
    setPage(1);
    fetchUsers(true);
  };

  const hasActiveFilters = roleFilter || subscriptionFilter || search;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Utilisateurs</h1>
          <p className="text-sm text-text-secondary mt-1">
            {total > 0 ? `${total} utilisateur${total !== 1 ? 's' : ''} inscrit${total !== 1 ? 's' : ''}` : 'Gérer les utilisateurs de la plateforme'}
          </p>
        </div>
        <Button onClick={() => setCreateUser(true)}>
          <Plus size={14} className="mr-1.5" /> Créer un utilisateur
        </Button>
      </div>

      {/* Filters bar */}
      <div className="bg-card border border-border rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Rechercher par email ou nom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={14} />}
            />
          </form>

          {/* Role filter */}
          <Select
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={(val) => { setRoleFilter(val); setPage(1); }}
            placeholder="Tous les Rôles"
            className="min-w-[140px]"
          />

          {/* Subscription filter */}
          <Select
            options={SUBSCRIPTION_OPTIONS}
            value={subscriptionFilter}
            onChange={(val) => { setSubscriptionFilter(val); setPage(1); }}
            placeholder="Tous les Forfaits"
            className="min-w-[140px]"
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X size={13} />
              Effacer
            </Button>
          )}

          {/* Refresh */}
          <Button variant="ghost" size="sm" onClick={() => fetchUsers(true)} disabled={loading} className="ml-auto">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] text-text-tertiary flex items-center gap-1">
              <Filter size={10} /> Filtres actifs :
            </span>
            {roleFilter && (
              <span className={`px-2 py-0.5 border text-[10px] rounded ${getRoleColor(roleFilter)}`}>
                {roleFilter.charAt(0) + roleFilter.slice(1).toLowerCase()}
              </span>
            )}
            {subscriptionFilter && (
              <span className={`px-2 py-0.5 border text-[10px] rounded ${getSubscriptionColor(subscriptionFilter)}`}>
                {subscriptionFilter.charAt(0) + subscriptionFilter.slice(1).toLowerCase()}
              </span>
            )}
            {search && (
              <span className="px-2 py-0.5 bg-purple/10 border border-purple/20 text-purple text-[10px] rounded">
                &quot;{search}&quot;
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => fetchUsers(true)} className="ml-auto underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="skeleton h-9 w-9 rounded-full" />
                <div className="skeleton h-3 w-32 rounded" />
                <div className="skeleton h-3 w-48 rounded" />
                <div className="skeleton h-4 w-16 rounded" />
                <div className="skeleton h-4 w-16 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-8 w-16 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-hover flex items-center justify-center mb-4">
              <UsersIcon size={24} className="text-text-tertiary" />
            </div>
            <h2 className="text-lg font-medium text-text-primary mb-1">No users found</h2>
            <p className="text-sm text-text-secondary max-w-sm text-center">
              {hasActiveFilters
                ? 'No users match your current filters. Try adjusting your search criteria.'
                : 'No users have registered yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table header — desktop (CSS grid, aligned with rows) */}
            <div className="hidden lg:grid grid-cols-[48px_1fr_112px_96px_112px_112px_176px] xl:grid-cols-[48px_1fr_112px_96px_112px_112px_252px] gap-4 items-center px-6 py-3 border-b border-border bg-hover/50 text-[10px] font-medium text-text-tertiary uppercase tracking-wide">
              <div className="shrink-0">Avatar</div>
              <div className="min-w-0">Name / Email</div>
              <div className="text-center">Role</div>
              <div className="text-center">Plan</div>
              <div>Registered</div>
              <div>Last Active</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className="hidden lg:grid grid-cols-[48px_1fr_112px_96px_112px_112px_176px] xl:grid-cols-[48px_1fr_112px_96px_112px_112px_252px] gap-4 items-center px-6 py-4 hover:bg-hover/30 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    <Avatar name={user.name} />
                  </div>

                  {/* Name / Email */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                    <p className="text-[11px] text-text-tertiary truncate">{user.email}</p>
                    <p className="text-[10px] text-text-tertiary lg:hidden mt-0.5">
                      {user.role} · {user.subscription?.plan ?? 'FREE'}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="flex justify-center">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {/* Subscription */}
                  <div className="flex justify-center">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getSubscriptionColor(user.subscription?.plan ?? 'FREE')}`}>
                      {user.subscription?.plan ?? 'FREE'}
                    </span>
                  </div>

                  {/* Registered */}
                  <div>
                    <span className="text-xs text-text-secondary">{formatDate(user.createdAt)}</span>
                  </div>

                  {/* Last Active */}
                  <div>
                    <span className="text-xs text-text-secondary">{formatRelativeTime(user.lastActiveAt ?? user.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 lg:gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEmailUser(user); }} title="Email">
                      <Mail size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditUser(user); }} title="Edit">
                      <Edit2 size={13} />
                      <span className="hidden xl:inline ml-1 text-xs">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSuspendUser(user); }} title={user.isActive ? 'Suspend' : 'Activate'}>
                      <UserX size={13} />
                      <span className="hidden xl:inline ml-1 text-xs">{user.isActive ? 'Suspend' : 'Activate'}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteUser(user); }} title="Delete">
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Mobile cards */}
              <div className="lg:hidden divide-y divide-border">
                {users.map((user) => (
                  <div key={user.id} onClick={() => router.push(`/admin/users/${user.id}`)} className="p-4 hover:bg-hover/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded border ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <p className="text-xs text-text-tertiary truncate mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-text-secondary">
                          <span className={`px-1.5 py-0.5 rounded border ${getSubscriptionColor(user.subscription?.plan ?? 'FREE')}`}>
                            {user.subscription?.plan ?? 'FREE'}
                          </span>
                          <span>{formatDate(user.createdAt)}</span>
                          <span className="ml-auto text-text-tertiary">{formatRelativeTime(user.lastActiveAt ?? user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEmailUser(user) }}>
                            <Mail size={12} className="mr-1" />
                            <span className="text-xs">Email</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditUser(user) }}>
                            <Edit2 size={12} className="mr-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSuspendUser(user) }}>
                            <UserX size={12} className="mr-1" />
                            <span className="text-xs">{user.isActive ? 'Suspend' : 'Activate'}</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteUser(user) }}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-xs text-text-tertiary">
                  Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-text-tertiary text-xs px-1">…</span>
                        <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)}>
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleUserAction}
        />
      )}
      {suspendUser && (
        <SuspendModal
          user={suspendUser}
          onClose={() => setSuspendUser(null)}
          onConfirm={handleUserAction}
        />
      )}
      {createUser && (
        <CreateUserModal
          onClose={() => setCreateUser(false)}
          onSuccess={handleUserAction}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={(updatedUser) => handleUserAction(undefined, updatedUser)}
        />
      )}
      {emailUser && (
        <EmailUserModal
          user={emailUser}
          onClose={() => setEmailUser(null)}
        />
      )}
    </div>
  );
}
