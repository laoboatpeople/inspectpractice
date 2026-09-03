'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Globe,
  Clock,
  FileText,
  Shuffle,
  Bell,
  MailCheck,
  BellRing,
  Shield,
  Key,
  Timer,
  AlertTriangle,
  Download,
  Trash2,
  RotateCcw,
  Loader2,
  Check,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface SettingsData {
  organization: {
    name: string;
    email: string;
    timezone: string;
  };
  examDefaults: {
    passingScore: number;
    timeLimit: number;
    questionsPerSimulation: number;
    randomizeOrder: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    welcomeEmail: boolean;
    reminderEmails: boolean;
    adminNewUserAlert: boolean;
    adminNotificationEmail: string;
  };
  security: {
    sessionTimeout: number;
    requireEmailVerification: boolean;
    apiKeys: Array<{ id: string; name: string; key: string; createdAt: string }>;
  };
}

const TIMEZONES = [
  'America/Toronto',
  'America/Vancouver',
  'America/Edmonton',
  'America/Winnipeg',
  'America/Halifax',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-blue' : 'bg-border'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [org, setOrg] = useState({ name: '', email: '', timezone: 'America/Toronto' });
  const [examDefaults, setExamDefaults] = useState({
    passingScore: 70,
    timeLimit: 60,
    questionsPerSimulation: 50,
    randomizeOrder: false,
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    welcomeEmail: true,
    reminderEmails: true,
    adminNewUserAlert: true,
    adminNotificationEmail: 'chuck.onekeo@gmail.com',
  });
  const [security, setSecurity] = useState({
    sessionTimeout: 60,
    requireEmailVerification: false,
  });

  // API keys visibility
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Danger zone modals
  const [clearDataModal, setClearDataModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/admin-login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setOrg(json.organization);
      setExamDefaults(json.examDefaults);
      setNotifications(json.notifications);
      setSecurity(json.security);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (section: 'organization' | 'examDefaults' | 'notifications' | 'security') => {
    const token = localStorage.getItem('token');
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const body: Record<string, unknown> = {};
      if (section === 'organization') body.organization = org;
      if (section === 'examDefaults') body.examDefaults = examDefaults;
      if (section === 'notifications') body.notifications = notifications;
      if (section === 'security') body.security = security;

      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspectpractice-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings/clear-test-data`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setClearDataModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (resetStep < 2) {
      setResetStep((s) => s + 1);
      setResetConfirmText('');
      return;
    }
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings/reset`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResetModal(false);
      setResetStep(0);
      setResetConfirmText('');
      fetchSettings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && data === null) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-blue animate-spin" />
          <p className="text-sm text-text-secondary">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Paramètres</h1>
        <p className="text-sm text-text-secondary mt-1">Gérer la configuration et les préférences de la plateforme</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-green/10 border border-green/20 rounded-card text-sm text-green">
          <Check size={15} />
          Paramètres enregistrés avec succès
        </div>
      )}

      <div className="space-y-6">
        {/* Organization */}
        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-blue" />
            <h2 className="text-base font-semibold text-text-primary">Organisation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Nom de l'organisation
              </label>
              <input
                type="text"
                value={org.name}
                onChange={(e) => setOrg((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} />
                  Email de contact
                </span>
              </label>
              <input
                type="email"
                value={org.email}
                onChange={(e) => setOrg((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Globe size={12} />
                  Fuseau horaire
                </span>
              </label>
              <select
                value={org.timezone}
                onChange={(e) => setOrg((prev) => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary focus:outline-none focus:border-blue"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleSave('organization')}
              disabled={saving}
              className="px-5 py-2.5 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Enregistrer l'organisation"}
            </button>
          </div>
        </div>

        {/* Exam Defaults */}
        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={16} className="text-cyan" />
            <h2 className="text-base font-semibold text-text-primary">Valeurs par défaut des examens</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Score de passage par défaut (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={examDefaults.passingScore}
                onChange={(e) =>
                  setExamDefaults((prev) => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))
                }
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  Limite de temps par défaut (minutes)
                </span>
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={examDefaults.timeLimit}
                onChange={(e) =>
                  setExamDefaults((prev) => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))
                }
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Questions par simulation
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={examDefaults.questionsPerSimulation}
                onChange={(e) =>
                  setExamDefaults((prev) => ({ ...prev, questionsPerSimulation: parseInt(e.target.value) || 50 }))
                }
                className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary focus:outline-none focus:border-blue"
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Shuffle size={12} />
                    Ordre aléatoire
                  </span>
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">Mélanger les questions à chaque tentative</p>
              </div>
              <Toggle
                checked={examDefaults.randomizeOrder}
                onChange={(v) => setExamDefaults((prev) => ({ ...prev, randomizeOrder: v }))}
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleSave('examDefaults')}
              disabled={saving}
              className="px-5 py-2.5 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Enregistrer les valeurs d'examen"}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-amber" />
            <h2 className="text-base font-semibold text-text-primary">Paramètres de notification</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-secondary">Notifications par e-mail</p>
                <p className="text-xs text-text-tertiary mt-0.5">Activer ou désactiver toutes les notifications par e-mail</p>
              </div>
              <Toggle
                checked={notifications.emailNotifications}
                onChange={(v) => setNotifications((prev) => ({ ...prev, emailNotifications: v }))}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <MailCheck size={12} />
                    E-mail de bienvenue à l'inscription
                  </span>
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">Envoyer un e-mail de bienvenue lors de l'inscription</p>
              </div>
              <Toggle
                checked={notifications.welcomeEmail}
                onChange={(v) => setNotifications((prev) => ({ ...prev, welcomeEmail: v }))}
                disabled={!notifications.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <BellRing size={12} />
                    E-mails de rappel
                  </span>
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">Envoyer des e-mails de rappel pour les examens/abonnements</p>
              </div>
              <Toggle
                checked={notifications.reminderEmails}
                onChange={(v) => setNotifications((prev) => ({ ...prev, reminderEmails: v }))}
                disabled={!notifications.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue/10 text-blue">
                    <Bell size={12} />
                  </span>
                  Alerte admin nouvelle inscription
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">Notifier l'administrateur à chaque nouvelle inscription</p>
              </div>
              <Toggle
                checked={notifications.adminNewUserAlert}
                onChange={(v) => setNotifications((prev) => ({ ...prev, adminNewUserAlert: v }))}
                disabled={!notifications.emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="text-xs text-text-tertiary mb-1">Email de notification admin</p>
                <input
                  type="email"
                  value={notifications.adminNotificationEmail}
                  onChange={(e) => setNotifications((prev) => ({ ...prev, adminNotificationEmail: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-border rounded-input text-sm focus:outline-none focus:border-blue"
                  style={{ backgroundColor: '#FFFFFF', color: '#102631' }}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleSave('notifications')}
              disabled={saving}
              className="px-5 py-2.5 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Enregistrer les paramètres de notification"}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-red" />
            <h2 className="text-base font-semibold text-text-primary">Sécurité</h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Timer size={12} />
                    Expiration de session (minutes)
                  </span>
                </label>
                <input
                  type="number"
                  min={5}
                  max={480}
                  value={security.sessionTimeout}
                  onChange={(e) =>
                    setSecurity((prev) => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 60 }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-input text-sm text-text-primary focus:outline-none focus:border-blue"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-secondary">Exiger la vérification par e-mail</p>
                <p className="text-xs text-text-tertiary mt-0.5">Les utilisateurs doivent vérifier leur e-mail avant d'accéder à la plateforme</p>
              </div>
              <Toggle
                checked={security.requireEmailVerification}
                onChange={(v) => setSecurity((prev) => ({ ...prev, requireEmailVerification: v }))}
              />
            </div>

            {/* API Keys */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-1.5">
                <Key size={12} />
                Clés API
              </p>
              {data?.security.apiKeys && data.security.apiKeys.length > 0 ? (
                <div className="space-y-2">
                  {data.security.apiKeys.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-border rounded-btn"
                    >
                      <div>
                        <p className="text-sm text-text-primary font-medium">{k.name}</p>
                        <p className="text-xs text-text-tertiary">
                          Créée le {new Date(k.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-text-secondary font-mono bg-secondary px-2 py-1 rounded">
                          {visibleKeys.has(k.id) ? k.key : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => {
                            const next = new Set(visibleKeys);
                            if (next.has(k.id)) next.delete(k.id);
                            else next.add(k.id);
                            setVisibleKeys(next);
                          }}
                          className="text-text-tertiary hover:text-text-primary transition-colors"
                        >
                          {visibleKeys.has(k.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-tertiary py-3">Aucune clé API configurée</p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => handleSave('security')}
              disabled={saving}
              className="px-5 py-2.5 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Enregistrer les paramètres de sécurité"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red/30 rounded-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={16} className="text-red" />
            <h2 className="text-base font-semibold text-red">Zone de danger</h2>
          </div>

          <div className="space-y-4">
            {/* Export data */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Exporter toutes les données</p>
                <p className="text-xs text-text-tertiary mt-0.5">Télécharger toutes les données de la plateforme au format JSON</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-btn text-sm text-text-primary hover:bg-hover transition-colors"
              >
                <Download size={14} />
                Exporter
              </button>
            </div>

            {/* Clear test data */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Effacer les données de test</p>
                <p className="text-xs text-text-tertiary mt-0.5">Supprimer tous les utilisateurs de test et les tentatives d'examen</p>
              </div>
              <button
                onClick={() => setClearDataModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red/30 rounded-btn text-sm text-red hover:bg-red/10 transition-colors"
              >
                <Trash2 size={14} />
                Effacer les données
              </button>
            </div>

            {/* Reset platform */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Réinitialiser la plateforme</p>
                <p className="text-xs text-text-tertiary mt-0.5">Effacer toutes les données et restaurer les valeurs par défaut</p>
              </div>
              <button
                onClick={() => { setResetModal(true); setResetStep(0); setResetConfirmText(''); }}
                className="flex items-center gap-2 px-4 py-2 border border-red/30 rounded-btn text-sm text-red hover:bg-red/10 transition-colors"
              >
                <RotateCcw size={14} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Data Modal */}
      {clearDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-card p-6 w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">Effacer les données de test</h3>
              <button onClick={() => setClearDataModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Cela supprimera définitivement tous les utilisateurs de test, les tentatives d'examen et les journaux d'activité. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setClearDataModal(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-btn text-sm text-text-primary hover:bg-hover"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Platform Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-card p-6 w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-red">Reset Platform</h3>
              <button onClick={() => setResetModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              {resetStep === 0 && 'This will permanently wipe ALL platform data including users, subscriptions, questions, exams, and settings.'}
              {resetStep === 1 && 'Are you absolutely sure? Type "RESET" to confirm this destructive action.'}
              {resetStep === 2 && 'Final confirmation required. This operation cannot be reversed.'}
            </p>

            {resetStep >= 1 && (
              <input
                type="text"
                placeholder={resetStep === 1 ? 'Type RESET to confirm' : 'Type RESET again'}
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-red/30 rounded-input text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-red mb-4"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setResetModal(false); setResetStep(0); setResetConfirmText(''); }}
                className="flex-1 px-4 py-2.5 border border-border rounded-btn text-sm text-text-primary hover:bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={
                  actionLoading ||
                  (resetStep === 1 && resetConfirmText !== 'RESET') ||
                  (resetStep === 2 && resetConfirmText !== 'RESET')
                }
                className="flex-1 px-4 py-2.5 bg-red text-white rounded-btn text-sm hover:bg-red/90 disabled:opacity-60"
              >
                {actionLoading ? (
                  <Loader2 size={14} className="animate-spin mx-auto" />
                ) : resetStep < 2 ? (
                  'Continue'
                ) : (
                  'Reset Platform'
                )}
              </button>
            </div>

            {resetStep < 2 && (
              <p className="text-xs text-text-tertiary text-center mt-3">
                Step {resetStep + 1} of 3
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}