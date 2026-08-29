'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/admin-login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Échec du chargement du profil');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setName(data.name || '');
        setEmail(data.email || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Échec de la mise à jour du profil');

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user || { name, email }));
      setUser((prev) => (prev ? { ...prev, name, email } : null));
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch {
      setMessage({ type: 'error', text: 'Échec de la mise à jour du profil. Veuillez réessayer.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    setChangingPassword(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage({ type: 'error', text: data.message || 'Échec du changement de mot de passe.' });
        return;
      }

      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordMessage({ type: 'error', text: 'Échec du changement de mot de passe. Veuillez réessayer.' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Profil</h1>
        <p className="text-sm text-text-secondary mt-1">Gérer les informations de votre compte</p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue flex items-center justify-center text-white text-xl font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-green" />
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">{user?.name || 'Admin'}</p>
            <p className="text-sm text-text-tertiary">{user?.email || ''}</p>
            {user?.role && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium uppercase tracking-wide bg-purple/20 text-purple rounded">
                {user.role}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-btn bg-blue/10 flex-shrink-0">
              <User size={16} className="text-blue" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-text-tertiary">ID du compte</p>
              <p className="text-sm font-mono text-text-secondary truncate">{user?.id || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-btn bg-purple/10 flex-shrink-0">
              <Shield size={16} className="text-purple" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-text-tertiary">Rôle</p>
              <p className="text-sm text-text-secondary truncate">{user?.role || 'Admin'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-card border border-border rounded-card p-6">
        <h2 className="text-base font-semibold text-text-primary mb-6">Informations du compte</h2>

        {message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 mb-6 rounded-btn text-sm ${
              message.type === 'success'
                ? 'bg-green/10 border border-green/20 text-green'
                : 'bg-red/10 border border-red/20 text-red'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Nom complet
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-btn text-sm text-text-primary bg-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                style={{ backgroundColor: '#0A0E1A', color: '#F8FAFC', WebkitTextFillColor: '#F8FAFC', caretColor: '#F8FAFC' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-btn text-sm text-text-primary bg-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                style={{ backgroundColor: '#0A0E1A', color: '#F8FAFC', WebkitTextFillColor: '#F8FAFC', caretColor: '#F8FAFC' }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-btn transition-colors"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Enregistrement...
                </span>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-card p-6">
        <h2 className="text-base font-semibold text-text-primary mb-6">Changer le mot de passe</h2>

        {passwordMessage && (
          <div
            className={`flex items-center gap-3 px-4 py-3 mb-6 rounded-btn text-sm ${
              passwordMessage.type === 'success'
                ? 'bg-green/10 border border-green/20 text-green'
                : 'bg-red/10 border border-red/20 text-red'
            }`}
          >
            {passwordMessage.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
              <input
                id="currentPassword"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 border border-border rounded-btn text-sm text-text-primary bg-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                style={{ backgroundColor: '#0A0E1A', color: '#F8FAFC', WebkitTextFillColor: '#F8FAFC', caretColor: '#F8FAFC' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
              <input
                id="newPassword"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-9 pr-10 py-2.5 border border-border rounded-btn text-sm text-text-primary bg-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                style={{ backgroundColor: '#0A0E1A', color: '#F8FAFC', WebkitTextFillColor: '#F8FAFC', caretColor: '#F8FAFC' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              />
              <input
                id="confirmPassword"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-9 pr-10 py-2.5 border border-border rounded-btn text-sm text-text-primary bg-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors"
                style={{ backgroundColor: '#0A0E1A', color: '#F8FAFC', WebkitTextFillColor: '#F8FAFC', caretColor: '#F8FAFC' }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-btn transition-colors"
            >
              {changingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Modification en cours...
                </span>
              ) : (
                'Changer le mot de passe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
