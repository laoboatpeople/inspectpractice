'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Clock,
  TrendingUp,
  Award,
  Flame,
  X,
  AlertCircle,
  CheckCircle,
  Settings2,
  Lock,
  User,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Minus,
  CheckCircle2,
  DollarSign,
  Globe,
  AlertTriangle,
  Activity,
  LogIn,
  ShieldAlert,
  ClipboardList,
  Target,
  Trophy,
  ListChecks,
  TrendingDown,
  BookOpen,
  Zap,
  History,
  MessageSquare,
  Loader2,
  Eye,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import type { UserWithStats, Role, Plan, SubStatus, ChatSessionSummary } from '@/types';
import { renderAIResponse } from '@/lib/ai-markdown';

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
    case 'FREE':    return 'text-text-secondary bg-hover border-border';
    case 'MONTHLY': return 'text-blue bg-blue/10 border-blue/20';
    case 'LIFETIME':  return 'text-green bg-green/10 border-green/20';
    default:        return 'text-text-secondary bg-hover border-border';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':    return 'text-green bg-green/10 border-green/20';
    case 'PAST_DUE': return 'text-amber bg-amber/10 border-amber/20';
    case 'CANCELLED': return 'text-red bg-red/10 border-red/20';
    default:         return 'text-text-secondary bg-hover border-border';
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeSpent(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hrs}h ${remainingMins}m`;
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
  return `${diffDays}j`;
}

function Avatar({ name, size = 'lg' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const sizeClass =
    size === 'sm' ? 'w-7 h-7 text-[10px]' :
    size === 'md' ? 'w-9 h-9 text-xs' :
    size === 'xl' ? 'w-20 h-20 text-2xl' :
    'w-14 h-14 text-xl';
  const colors = [
    'bg-blue/20 text-blue',
    'bg-cyan/20 text-cyan',
    'bg-purple/20 text-purple',
    'bg-green/20 text-green',
    'bg-amber/20 text-amber',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold ${colors[idx]}`}>
      {initials}
    </div>
  );
}

type EditTab = 'profile' | 'subscription' | 'security';

interface EditUserModalProps {
  user: UserWithStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

function EditUserModal({ user, isOpen, onClose, onUpdated }: EditUserModalProps) {
  const [activeTab, setActiveTab] = useState<EditTab>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const nameParts = user.name.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] ?? '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') ?? '');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<Role>(user.role);
  const [isActive, setIsActive] = useState(user.isActive);

  // Subscription fields
  const [plan, setPlan] = useState<Plan>(user.subscription?.plan ?? 'FREE');
  const [subStatus, setSubStatus] = useState<SubStatus>(user.subscription?.status ?? 'ACTIVE');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete confirm
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  // Reset state when user changes
  useEffect(() => {
    if (!isOpen) return;
    const nameParts = user.name.split(' ');
    setFirstName(nameParts[0] ?? '');
    setLastName(nameParts.slice(1).join(' ') ?? '');
    setEmail(user.email);
    setRole(user.role);
    setIsActive(user.isActive);
    setPlan(user.subscription?.plan ?? 'FREE');
    setSubStatus(user.subscription?.status ?? 'ACTIVE');
    setNewPassword('');
    setConfirmPassword('');
    setConfirmDeleteText('');
    setError(null);
    setActiveTab('profile');
  }, [isOpen, user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            role,
            isActive,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}/subscription`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Échec de la mise à jour de l'abonnement`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}/password`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (confirmDeleteText !== user.name) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${user.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      onUpdated();
      onClose();
      window.location.href = '/admin/users';
    } catch (err) {
      setError(err instanceof Error ? err.message : `Échec de la suppression de l'utilisateur`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: EditTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profil', icon: <User size={14} /> },
    { id: 'subscription', label: 'Abonnement', icon: <CreditCard size={14} /> },
    { id: 'security', label: 'Sécurité', icon: <Lock size={14} /> },
  ];

  const hasProfileChanges =
    `${firstName} ${lastName}`.trim() !== user.name ||
    email !== user.email ||
    role !== user.role ||
    isActive !== user.isActive;

  const hasSubChanges = plan !== (user.subscription?.plan ?? 'FREE');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      {/* Modal header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue/10 border border-blue/20 flex items-center justify-center">
            <Settings2 size={14} className="text-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Modifier l'utilisateur</p>
            <p className="text-[11px] text-text-tertiary">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={loading}
          className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors disabled:opacity-50 ${
              activeTab === tab.id
                ? 'border-blue text-blue'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 py-5 min-h-[320px]">
        {error && (
          <div className="mb-4 p-3 rounded-btn bg-red/10 border border-red/20 text-sm text-red flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
              />
              <Input
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <Select
              label="Rôle"
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'INSTRUCTOR', label: 'Instructeur' },
                { value: 'STUDENT', label: 'Étudiant' },
              ]}
            />
            <div className="pt-1">
              <Checkbox
                checked={isActive}
                onChange={setIsActive}
                label="Compte actif"
                description="L'utilisateur peut se connecter et utiliser la plateforme lorsque activé"
              />
            </div>

            {/* Password reset — always visible */}
            <div className="border-t border-border pt-5 mt-2">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Réinitialiser le mot de passe</h3>
              <p className="text-xs text-text-tertiary mb-4">Définir un nouveau mot de passe temporaire pour cet utilisateur.</p>
              <div className="space-y-3">
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                />
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répéter le mot de passe"
                  error={confirmPassword && newPassword !== confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
                />
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={handleResetPassword}
                  loading={loading}
                  disabled={newPassword.length < 8 || newPassword !== confirmPassword}
                >
                  Réinitialiser le mot de passe
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Plan"
                value={plan}
                onChange={(v) => setPlan(v as Plan)}
                options={[
                  { value: 'FREE', label: 'Gratuit' },
                  { value: 'MONTHLY', label: 'Mensuel' },
                  { value: 'LIFETIME', label: 'À vie' },
                ]}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Statut</label>
                <div className="h-10 flex items-center">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusColor(subStatus)}`}>
                    {subStatus.charAt(0) + subStatus.slice(1).toLowerCase()}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-text-tertiary">Le statut est géré automatiquement</p>
              </div>
            </div>

            {user.subscription && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Début de période</p>
                    <p className="text-sm text-text-primary mt-0.5">{formatDate(user.subscription.currentPeriodStart)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Fin de période</p>
                    <p className="text-sm text-text-primary mt-0.5">{formatDate(user.subscription.currentPeriodEnd)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Créé le</p>
                  <p className="text-sm text-text-primary mt-0.5">{formatDate(user.subscription.createdAt)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security tab — Danger Zone only */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-t border-border pt-5">
              <h3 className="text-sm font-semibold text-red mb-1">Zone de danger</h3>
              <p className="text-xs text-text-tertiary mb-4">La désactivation d'un utilisateur révoque son accès immédiatement.</p>
              <div className="space-y-3">
                <Input
                  label={`Tapez "${user.name}" pour confirmer la suppression`}
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  placeholder={user.name}
                />
                <Button
                  variant="danger"
                  onClick={handleDeleteUser}
                  loading={loading}
                  disabled={confirmDeleteText !== user.name}
                >
                  Supprimer l'utilisateur
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer — only for profile and subscription tabs */}
      {activeTab !== 'security' && (
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="default"
            loading={loading}
            onClick={activeTab === 'profile' ? handleSaveProfile : handleSaveSubscription}
            disabled={
              loading ||
              (activeTab === 'profile' && !hasProfileChanges) ||
              (activeTab === 'subscription' && !hasSubChanges)
            }
          >
            Enregistrer les modifications
          </Button>
        </div>
      )}
    </Modal>
  );
}

// ── Student dashboard preview — what the student sees on /app ──

function StudentDashboardPreview({ stats }: { stats: NonNullable<UserWithStats['dashboardStats']> }) {
  const {
    totalExams, totalAttempts, averageScore, passRate, studyStreak, byExam, recentAttempts,
    bestScore, examsPassedUnique, totalQuestionsAnswered, totalCorrect, momentum, lastAttemptAt,
  } = stats;

  const totalPassed = byExam.reduce((sum, e) => sum + e.passedCount, 0);
  const accuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  // Strength / weakness — SAME logic as /app dashboard
  const sorted = [...byExam].sort((a, b) => b.averageScore - a.averageScore);
  const strongest = byExam.length >= 2 && sorted[0].averageScore > 0 ? sorted[0] : null;
  const weakest = byExam.length >= 2
    ? (sorted.find(e => e.averageScore < 70 && e.totalAttempts >= 2) || null)
    : null;

  type Card = { label: string; value: string | number; icon: typeof Zap; color: string; subtitle?: string };

  const statCards: Card[] = [
    { label: 'Examens dispo', value: totalExams, icon: BookOpen, color: 'text-blue', subtitle: `${byExam.length}/${totalExams} pratiqués` },
    { label: 'Tentatives', value: totalAttempts, icon: Zap, color: 'text-purple', subtitle: 'au total' },
    { label: 'Score moyen', value: `${averageScore}%`, icon: TrendingUp, color: averageScore >= 70 ? 'text-green' : 'text-amber', subtitle: `${totalAttempts} passage${totalAttempts > 1 ? 's' : ''}` },
    { label: 'Taux de réussite', value: `${passRate}%`, icon: Target, color: passRate >= 70 ? 'text-green' : 'text-amber', subtitle: totalAttempts === 0 ? '—' : `${totalPassed}/${totalAttempts} ≥70%` },
    { label: "Jours d'étude", value: studyStreak, icon: Clock, color: 'text-amber', subtitle: 'série en cours' },
  ];

  const insightCards: Card[] = [
    { label: 'Record personnel', value: `${bestScore}%`, icon: Trophy, color: bestScore >= 70 ? 'text-green' : 'text-amber', subtitle: 'meilleur score' },
    { label: 'Examens réussis', value: `${examsPassedUnique}/${totalExams}`, icon: CheckCircle2, color: examsPassedUnique > 0 ? 'text-green' : 'text-amber', subtitle: 'réussis ≥1 fois' },
    { label: 'Questions répondues', value: totalQuestionsAnswered, icon: ListChecks, color: 'text-blue', subtitle: `${totalCorrect} bonnes (${accuracy}%)` },
    {
      label: 'Élan',
      value: momentum > 0 ? `+${momentum}%` : momentum < 0 ? `${momentum}%` : '±0%',
      icon: momentum > 0 ? TrendingUp : momentum < 0 ? TrendingDown : Minus,
      color: momentum > 0 ? 'text-green' : momentum < 0 ? 'text-red' : 'text-amber',
      subtitle: totalAttempts < 2 ? 'pas assez de données' : momentum > 0 ? 'en progrès' : momentum < 0 ? 'en baisse' : 'stable',
    },
    { label: 'Dernière activité', value: lastAttemptAt ? formatRelativeTime(lastAttemptAt) : '—', icon: History, color: 'text-purple', subtitle: 'dernier examen' },
  ];

  const CardGrid = ({ cards }: { cards: Card[] }) => (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-bg rounded-lg border border-border p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <c.icon size={14} className={c.color} />
            <span className="text-[10px] text-text-tertiary uppercase tracking-wide leading-tight">{c.label}</span>
          </div>
          <p className="text-xl font-bold text-text-primary">{c.value}</p>
          {c.subtitle && <p className="text-[10px] text-text-tertiary mt-0.5 truncate">{c.subtitle}</p>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Activity size={16} className="text-cyan" />
        <h2 className="text-base font-semibold text-text-primary">Vue du dashboard étudiant</h2>
        <span className="ml-auto text-[10px] text-text-tertiary uppercase tracking-wide">aperçu /app</span>
      </div>
      <div className="p-6 space-y-6">
        {totalAttempts === 0 ? (
          <p className="text-sm text-text-tertiary">Aucune donnée — l&apos;utilisateur n&apos;a pas encore passé d&apos;examen.</p>
        ) : (
          <>
            {/* Stat cards (row 1) */}
            <CardGrid cards={statCards} />

            {/* Insight cards (row 2) */}
            <CardGrid cards={insightCards} />

            {/* Strength / Weakness — same logic as /app */}
            {(strongest || weakest) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {strongest && (
                  <div className="bg-green/5 border border-green/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={14} className="text-green" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-green">Point fort</span>
                    </div>
                    <p className="text-sm font-medium text-text-primary truncate">{strongest.examCode} — {strongest.examName}</p>
                    <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                      <span>Moy. <span className="text-green font-semibold">{strongest.averageScore}%</span></span>
                      <span>Meilleur <span className="text-green font-semibold">{strongest.bestScore}%</span></span>
                      <span>{strongest.totalAttempts} tent.</span>
                    </div>
                  </div>
                )}
                {weakest && (
                  <div className="bg-red/5 border border-red/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-red" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-red">Point faible</span>
                    </div>
                    <p className="text-sm font-medium text-text-primary truncate">{weakest.examCode} — {weakest.examName}</p>
                    <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                      <span>Moy. <span className="text-red font-semibold">{weakest.averageScore}%</span></span>
                      <span>Meilleur <span className="text-amber font-semibold">{weakest.bestScore}%</span></span>
                      <span>{weakest.totalAttempts} tent.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent attempts */}
            {recentAttempts.length > 0 && (
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">Tentatives récentes</p>
                <div className="space-y-2">
                  {recentAttempts.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 bg-bg rounded-lg border border-border px-4 py-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.passed ? 'bg-green' : 'bg-red'}`} />
                      <span className="text-sm font-medium text-text-primary flex-1">{a.examCode}</span>
                      <span className="text-xs text-text-tertiary">{a.correctCount}/{a.totalQuestions}</span>
                      <span className={`text-sm font-bold ${a.passed ? 'text-green' : 'text-red'}`}>{a.score}%</span>
                      <span className="text-xs text-text-tertiary w-16 text-right">{formatRelativeTime(a.completedAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Admin Intelligence — metrics the student never sees ──────────

function AdminIntelligence({ metrics }: { metrics: NonNullable<UserWithStats['adminMetrics']> }) {
  const { logins, billing, risk } = metrics;

  const riskColor: Record<string, string> = {
    high: 'text-red bg-red/10 border-red/20',
    medium: 'text-amber bg-amber/10 border-amber/20',
    low: 'text-text-secondary bg-hover border-border',
  };

  return (
    <div className="space-y-6">
      {/* Risk signals */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber" />
          <h2 className="text-base font-semibold text-text-primary">Signaux de risque</h2>
        </div>
        <div className="p-6">
          {risk.signals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {risk.signals.map((s, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${riskColor[s.level]}`}
                >
                  <AlertTriangle size={12} />
                  {s.label}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green">
              <CheckCircle2 size={16} />
              Aucun signal — utilisateur sain
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Inscrit depuis</p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">{risk.daysSinceSignup}j</p>
            </div>
            <div>
              <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Dernière connexion</p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">
                {risk.daysSinceLastLogin === null ? 'Jamais' : `il y a ${risk.daysSinceLastLogin}j`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer value / billing */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <DollarSign size={16} className="text-green" />
          <h2 className="text-base font-semibold text-text-primary">Valeur client</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green">${billing.estimatedRevenue.toFixed(2)}</span>
            <span className="text-xs text-text-tertiary">revenu estimé</span>
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">
              Historique de paiement ({billing.checkouts.length})
            </p>
            {billing.checkouts.length > 0 ? (
              <div className="space-y-1.5">
                {billing.checkouts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {c.plan === 'LIFETIME' ? 'À vie' : c.plan === 'MONTHLY' ? 'Mensuel' : c.plan ?? '—'}
                    </span>
                    <span className="text-text-tertiary text-xs">{formatDate(c.at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">Aucun paiement</p>
            )}
          </div>
          {billing.cancellations.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1.5">Annulations</p>
              {billing.cancellations.map((c, i) => (
                <p key={i} className="text-xs text-red">{formatDate(c.at)}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login / connection intelligence */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <LogIn size={16} className="text-blue" />
          <h2 className="text-base font-semibold text-text-primary">Connexions</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue" />
              <div>
                <p className="text-lg font-bold text-text-primary">{logins.total}</p>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Total</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-cyan" />
              <div>
                <p className="text-lg font-bold text-text-primary">{logins.uniqueIps}</p>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wide">IPs uniques</p>
              </div>
            </div>
          </div>
          {logins.recent.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">Dernières connexions</p>
              <div className="space-y-1.5">
                {logins.recent.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-mono">{l.ip ?? '—'}</span>
                    <span className="text-text-tertiary">{formatRelativeTime(l.at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── View-as-user (impersonation) ──
  const [impersonating, setImpersonating] = useState(false);

  const handleImpersonate = useCallback(async () => {
    if (!user) return;
    setImpersonating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${userId}/impersonate`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to impersonate');
      const data = await res.json();
      // Back up the admin session so it can be restored from the view-as banner
      const adminToken = localStorage.getItem('token') || '';
      const adminUser = localStorage.getItem('user') || '';
      let adminId = '';
      try {
        adminId = (JSON.parse(adminUser) as { id?: string })?.id ?? '';
      } catch { /* ignore */ }
      localStorage.setItem('impersonate_backup_token', adminToken);
      localStorage.setItem('impersonate_backup_user', adminUser);
      localStorage.setItem('impersonate_backup_admin_id', adminId);
      // Switch to the target user session
      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ id: data.user.id, name: data.user.name ?? data.user.email, email: data.user.email, role: data.user.role })
      );
      localStorage.setItem(
        'impersonating',
        JSON.stringify({ id: data.user.id, name: data.user.name ?? data.user.email, email: data.user.email })
      );
      router.push('/app');
    } catch (err) {
      console.error('[Admin] Impersonate failed:', err);
      alert("Impossible de lancer le mode visualisation");
    } finally {
      setImpersonating(false);
    }
  }, [user, userId, router]);

  const [editModalOpen, setEditModalOpen] = useState(false);

  // Tutor conversation modal state
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    topic: string | null;
    source: string;
    user: { name: string; email: string } | null;
    messages: { id: string; role: string; content: string; createdAt: string }[];
  } | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const openChat = async (sessionId: string, topic: string | null, source: string) => {
    setSelectedChat({ id: sessionId, topic, source, user: null, messages: [] });
    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/analytics/chat-sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const session = await res.json();
      setSelectedChat({
        id: session.id,
        topic: session.topic,
        source: session.source,
        user: session.user ? { name: session.user.name, email: session.user.email } : null,
        messages: (session.messages ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      });
    } catch (err) {
      console.error('Failed to load chat session:', err);
      setSelectedChat(null);
    } finally {
      setChatLoading(false);
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        router.push('/auth/admin-login');
        return;
      }
      if (res.status === 404) {
        setError('Utilisateur non trouvé');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setUser(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Échec du chargement de l'utilisateur`);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // Deep-link: auto-open a tutor conversation when arriving with ?chat=<sessionId>
  const chatOpenedRef = useRef(false);
  useEffect(() => {
    if (loading || !user || chatOpenedRef.current) return;
    const chatParam = new URLSearchParams(window.location.search).get('chat');
    if (chatParam) {
      chatOpenedRef.current = true;
      openChat(chatParam, null, 'tutor');
      // Clean the URL so a refresh doesn't re-open
      router.replace(`/admin/users/${userId}`, { scroll: false });
    }
  }, [loading, user, userId, router]);

  if (loading) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <div className="skeleton w-32 h-5 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-48 rounded-card" />
            <div className="skeleton h-64 rounded-card" />
          </div>
          <div className="skeleton h-48 rounded-card" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="skeleton w-40 h-5 rounded" />
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red" />
          </div>
          <h2 className="text-lg font-medium text-text-primary mb-1">Utilisateur non trouvé</h2>
          <p className="text-sm text-text-secondary">{error ?? `Cet utilisateur n'existe pas.`}</p>
          <button onClick={() => router.push('/admin/users')} className="mt-4 px-4 py-2 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors">
            Retour aux utilisateurs
          </button>
        </div>
      </div>
    );
  }

  const sub = user.subscription;
  const passRate = user.passRate ?? 0;
  const avgScore = user.avgScore ?? 0;

  return (
    <div className="p-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin/users" className="text-text-tertiary hover:text-text-primary transition-colors">
          Utilisateurs
        </Link>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary font-medium">{user.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="xl" />
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{user.name}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getRoleColor(user.role)}`}>
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getSubscriptionColor(sub?.plan ?? 'FREE')}`}>
                {sub?.plan ?? 'FREE'}
              </span>
              {sub?.status && (
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusColor(sub.status)}`}>
                  {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                </span>
              )}
              {!user.isActive && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded border text-amber bg-amber/10 border-amber/20">
                  Suspendu
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImpersonate}
            disabled={impersonating}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {impersonating ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Voir comme utilisateur
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue hover:bg-blue/90 border border-transparent hover:border-blue/20 rounded-btn transition-colors"
          >
            <Settings2 size={14} />
            Modifier l'utilisateur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileTextIcon size={14} className="text-blue" />
                <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Examens passés</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{user._count?.examAttempts ?? 0}</p>
            </div>
            <div className="bg-card border border-border rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-cyan" />
                <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Score moyen</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{avgScore > 0 ? `${avgScore.toFixed(1)}%` : '—'}</p>
            </div>
            <div className="bg-card border border-border rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={14} className="text-green" />
                <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Taux de réussite</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{passRate > 0 ? `${passRate.toFixed(0)}%` : '—'}</p>
            </div>
            <div className="bg-card border border-border rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-amber" />
                <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Jours d'étude</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{user.studyStreak ?? 0}d</p>
            </div>
          </div>

          {/* Exam Progress — per-exam statistics */}
          {user.examProgress && user.examProgress.length > 0 && (
            <div className="bg-card border border-border rounded-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <BarChart3 size={15} className="text-blue" />
                <h2 className="text-base font-semibold text-text-primary">Progrès par examen</h2>
              </div>
              <div className="divide-y divide-border">
                {user.examProgress.map((exam) => {
                  const bestPct = exam.bestScore;
                  const avgPct = Math.round(exam.avgScore);
                  const lastPct = Math.round(exam.lastScore);
                  const barWidth = Math.min(100, avgPct);

                  return (
                    <div key={exam.examId} className="px-6 py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{exam.examName}</p>
                          <p className="text-[11px] text-text-tertiary">{exam.examCode} · {exam.totalAttempts} tentative{exam.totalAttempts > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          {/* Trend indicator */}
                          <div className={`flex items-center gap-1 text-xs font-medium ${
                            exam.trend === 'up' ? 'text-green' : exam.trend === 'down' ? 'text-red' : 'text-text-tertiary'
                          }`}>
                            {exam.trend === 'up' ? <ChevronUp size={14} /> : exam.trend === 'down' ? <ChevronDown size={14} /> : <Minus size={14} />}
                            {exam.trend === 'up' ? 'Progrès' : exam.trend === 'down' ? 'Baisse' : 'Stable'}
                          </div>
                          {/* Last result badge */}
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            exam.lastPassed
                              ? 'text-green bg-green/10 border border-green/20'
                              : 'text-red bg-red/10 border border-red/20'
                          }`}>
                            {exam.lastPassed ? 'Réussi' : 'Échec'}
                          </span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-hover rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              avgPct >= 70 ? 'bg-green' : avgPct >= 50 ? 'bg-amber' : 'bg-red'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-3 text-xs shrink-0">
                          <span className="text-text-tertiary">Moy. <strong className="text-text-primary">{avgPct}%</strong></span>
                          <span className="text-text-tertiary">Meilleur <strong className="text-text-primary">{Math.round(exam.bestScore)}%</strong></span>
                        </div>
                      </div>

                      {/* Mini score history */}
                      {exam.recentScores.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[10px] text-text-tertiary mr-1">Derniers:</span>
                          {exam.recentScores.slice(0, 6).map((s, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                                s.passed
                                  ? 'bg-green/10 text-green'
                                  : 'bg-red/10 text-red'
                              }`}
                              title={`${Math.round(s.score)}% — ${new Date(s.completedAt).toLocaleDateString('fr-CA')}`}
                            >
                              {Math.round(s.score)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student dashboard preview — what the student sees on /app */}
          {user.dashboardStats && (
            <StudentDashboardPreview stats={user.dashboardStats} />
          )}

          {/* Exam History */}
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">Historique des examens</h2>
              <p className="text-xs text-text-tertiary mt-0.5">5 dernières tentatives</p>
            </div>
            {user.examAttempts && user.examAttempts.length > 0 ? (
              <div className="divide-y divide-border">
                {user.examAttempts.slice(0, 5).map((attempt) => {
                  const pct = attempt.totalQuestions > 0
                    ? (attempt.correctCount / attempt.totalQuestions) * 100
                    : 0;
                  const passed = pct >= 70;
                  return (
                    <div key={attempt.id} className="flex items-center gap-4 px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        passed ? 'bg-green/10' : 'bg-red/10'
                      }`}>
                        {passed
                          ? <CheckCircle size={14} className="text-green" />
                          : <X size={14} className="text-red" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          {attempt.exam?.name ?? attempt.examId}
                        </p>
                        <p className="text-[11px] text-text-tertiary">
                          {formatDateTime(attempt.completedAt)} · {formatTimeSpent(attempt.timeSpent)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${passed ? 'text-green' : 'text-red'}`}>
                          {pct.toFixed(0)}%
                        </p>
                        <p className="text-[10px] text-text-tertiary">
                          {attempt.correctCount}/{attempt.totalQuestions}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileTextIcon size={24} className="text-text-tertiary mb-2" />
                <p className="text-sm text-text-tertiary">Aucune tentative d'examen</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">Activité récente</h2>
              <p className="text-xs text-text-tertiary mt-0.5">10 dernières actions</p>
            </div>
            {user.recentActivity && user.recentActivity.length > 0 ? (
              <div className="divide-y divide-border">
                {user.recentActivity.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 px-6 py-3">
                    <Clock size={13} className="text-text-tertiary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary">
                        {log.action.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">
                        {formatDateTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Clock size={24} className="text-text-tertiary mb-2" />
                <p className="text-sm text-text-tertiary">Aucune activité enregistrée</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile info */}
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-text-primary">Profil</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-text-tertiary" />
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Email</p>
                  <p className="text-sm text-text-primary">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-text-tertiary" />
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Rôle</p>
                  <p className="text-sm text-text-primary">{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-text-tertiary" />
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Inscrit</p>
                  <p className="text-sm text-text-primary">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-text-tertiary" />
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Dernière activité</p>
                  <p className="text-sm text-text-primary">{formatRelativeTime(user.lastActiveAt ?? user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tutor conversations */}
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <MessageSquare size={15} className="text-cyan" />
              <h2 className="text-base font-semibold text-text-primary">Conversations tuteur récentes</h2>
            </div>
            {user.chatSessions && user.chatSessions.length > 0 ? (
              <div className="divide-y divide-border">
                {user.chatSessions.map((cs) => (
                  <button
                    key={cs.id}
                    onClick={() => openChat(cs.id, cs.topic, cs.source)}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-hover transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={13} className="text-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-cyan transition-colors">
                        {cs.topic || (cs.source === 'admin-questions' ? 'Questions admin' : 'Conversation tuteur')}
                      </p>
                      <p className="text-[11px] text-text-tertiary">
                        {cs._count.messages} message{cs._count.messages > 1 ? 's' : ''} · {formatRelativeTime(cs.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare size={24} className="text-text-tertiary mb-2" />
                <p className="text-sm text-text-tertiary">Aucune conversation tuteur</p>
              </div>
            )}
          </div>

          {/* Subscription */}
          <div className="bg-card border border-border rounded-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-primary">Abonnement</h2>
                <CreditCard size={16} className="text-text-tertiary" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getSubscriptionColor(sub?.plan ?? 'FREE')}`}>
                      {sub?.plan ?? 'FREE'}
                    </span>
                  </div>
                </div>
                {sub && (
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusColor(sub.status)}`}>
                    {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
              {sub ? (
                <>
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Début de période</p>
                    <p className="text-sm text-text-primary mt-0.5">{formatDate(sub.currentPeriodStart)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Fin de période</p>
                    <p className="text-sm text-text-primary mt-0.5">{formatDate(sub.currentPeriodEnd)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wide">Renouvellement</p>
                    <p className="text-sm text-text-primary mt-0.5">
                      {new Date(sub.currentPeriodEnd) > new Date()
                        ? formatDate(sub.currentPeriodEnd)
                        : 'Expiré'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-text-tertiary">Aucun abonnement actif</p>
              )}
            </div>
          </div>

          {/* Admin Intelligence — metrics the student never sees */}
          {user.adminMetrics && (
            <AdminIntelligence metrics={user.adminMetrics} />
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        user={user}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={fetchUser}
      />

      {/* Tutor conversation modal */}
      {selectedChat && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedChat(null)}
        >
          <div
            className="bg-card border border-border rounded-card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={15} className="text-cyan" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {selectedChat.topic || (selectedChat.source === 'admin-questions' ? 'Questions admin' : 'Conversation tuteur')}
                  </p>
                  <p className="text-[11px] text-text-tertiary truncate">
                    {selectedChat.user?.name || selectedChat.user?.email || 'Utilisateur'} · {selectedChat.messages.length} message{selectedChat.messages.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {chatLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="text-text-tertiary animate-spin" />
                </div>
              ) : selectedChat.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare size={24} className="text-text-tertiary mb-2" />
                  <p className="text-sm text-text-tertiary">Aucun message dans cette session</p>
                </div>
              ) : (
                selectedChat.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-card px-4 py-3 border ${
                          isUser
                            ? 'bg-blue/10 border-blue/20'
                            : 'bg-hover border-border'
                        }`}
                      >
                        <p className={`text-[10px] font-medium uppercase tracking-wide mb-1.5 ${isUser ? 'text-blue' : 'text-cyan'}`}>
                          {isUser
                            ? selectedChat.user?.name || 'Étudiant'
                            : 'Tuteur IA'}
                          <span className="ml-2 normal-case tracking-normal text-text-tertiary font-normal">
                            {formatDateTime(msg.createdAt)}
                          </span>
                        </p>
                        {isUser ? (
                          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div
                            className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed [&_svg]:whitespace-normal"
                            dangerouslySetInnerHTML={{ __html: renderAIResponse(msg.content) }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline icon to avoid importing an extra component
function FileTextIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}
