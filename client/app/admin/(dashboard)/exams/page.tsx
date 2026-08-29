'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  X,
  AlertCircle,
  RefreshCw,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import type { Exam } from '@/types';

const COUNTRY_OPTIONS = [
  { value: '', label: 'Tous les pays' },
  { value: 'CA', label: 'Canada (CA)' },
  { value: 'US', label: 'États-Unis (US)' },
  { value: 'GB', label: 'Royaume-Uni (GB)' },
  { value: 'AU', label: 'Australia (AU)' },
  { value: 'EU', label: 'Europe (EU)' },
  { value: 'NZ', label: 'New Zealand (NZ)' },
  { value: 'SG', label: 'Singapore (SG)' },
];

const ACTIVE_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'true', label: 'Actif' },
  { value: 'false', label: 'Inactif' },
];

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-hover flex items-center justify-center mb-4">
        <FileText size={24} className="text-text-tertiary" />
      </div>
      <h2 className="text-lg font-medium text-text-primary mb-1">Aucun examen trouvé</h2>
      <p className="text-sm text-text-secondary max-w-sm text-center">
        {hasFilters
          ? 'Aucun examen ne correspond à vos filtres. Essayez de modifier vos critères de recherche.'
          : `Aucun examen n'a encore été créé. Créez votre premier examen pour commencer.`}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 bg-blue text-white rounded-btn text-sm font-medium hover:bg-blue/90 transition-colors"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}

interface CreateExamModalProps {
  onClose: () => void;
  onCreated: (exam: Exam) => void;
}

function CreateExamModal({ onClose, onCreated }: CreateExamModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('CA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: code.trim(), name: name.trim(), description: description.trim(), country }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || `HTTP ${res.status}`);
      }
      const exam = await res.json();
      onCreated(exam);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Échec de la création de l'examen`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Plus size={14} className="text-blue" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Créer un examen</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-btn text-text-tertiary hover:text-text-primary hover:bg-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red/10 border border-red/20 rounded text-sm text-red">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Code <span className="text-red">*</span>
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ex. M1, M2, S1"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Name <span className="text-red">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. M1 — Cellule"
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle..."
              rows={3}
              className="w-full px-3 py-2 bg-hover border border-border rounded-btn text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Country
            </label>
            <Select
              options={COUNTRY_OPTIONS.filter((c) => c.value !== '').map((c) => ({ value: c.value, label: c.label }))}
              value={country}
              onChange={(val) => setCountry(val)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !code.trim() || !name.trim()} loading={loading}>
              Créer un examen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [countryFilter, setCountryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const [showCreate, setShowCreate] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/auth/admin-login'); return; }

      const params = new URLSearchParams();
      if (countryFilter) params.set('country', countryFilter);
      if (activeFilter) params.set('isActive', activeFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams?${params}`,
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
      setExams(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du chargement des examens');
    } finally {
      setLoading(false);
    }
  }, [countryFilter, activeFilter, router]);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleToggleActive = async (exam: Exam) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/exams/${exam.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !exam.isActive }),
        }
      );
      if (res.ok) {
        setExams((prev) =>
          prev.map((e) => (e.id === exam.id ? { ...e, isActive: !e.isActive } : e))
        );
      }
    } catch { /* silently fail */ }
  };

  const hasFilters = !!countryFilter || !!activeFilter;

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Exams</h1>
          <p className="text-sm text-text-secondary mt-1">
            {exams.length > 0
              ? `${exams.length} examen${exams.length !== 1 ? 's' : ''} configuré${exams.length !== 1 ? 's' : ''}`
              : `Gérez vos modules d'examen et chapitres`}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={15} />
          Créer un examen
        </Button>
      </div>

      {/* Filters bar */}
      <div className="bg-card border border-border rounded-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Country filter */}
          <Select
            options={COUNTRY_OPTIONS}
            value={countryFilter}
            onChange={(val) => { setCountryFilter(val); }}
            placeholder="Tous les pays"
            className="min-w-[160px]"
          />

          {/* Active filter */}
          <Select
            options={ACTIVE_OPTIONS}
            value={activeFilter}
            onChange={(val) => { setActiveFilter(val); }}
            placeholder="Tous les statuts"
            className="min-w-[140px]"
          />

          {/* Effacer les filtres */}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => { setCountryFilter(''); setActiveFilter(''); }}>
              <X size={13} />
              Effacer
            </Button>
          )}

          {/* Refresh */}
          <Button variant="ghost" size="sm" onClick={fetchExams} disabled={loading} className="ml-auto">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchExams} className="ml-auto underline hover:no-underline">Réessayer</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        {loading && exams.length === 0 ? (
          /* Skeleton rows */
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5">
                <div className="skeleton h-4 w-16 rounded" />
                <div className="skeleton h-4 w-48 rounded" />
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-5 w-16 rounded" />
                <div className="skeleton h-4 w-12 rounded" />
                <div className="skeleton h-4 w-12 rounded" />
                <div className="skeleton h-8 w-20 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={() => { setCountryFilter(''); setActiveFilter(''); }} />
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[100px_1fr_100px_80px_90px_90px_140px] gap-4 px-6 py-3 border-b border-border bg-hover/50">
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Code</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Nom</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Pays</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Actif</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Chapitres</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">Questions</span>
              <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide text-right">Actions</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-border">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col lg:grid lg:grid-cols-[100px_1fr_100px_80px_90px_90px_140px] gap-2 lg:gap-4 px-6 py-4 hover:bg-hover/30 transition-colors"
                >
                  {/* Code */}
                  <div className="flex items-center">
                    <span className="text-sm font-mono font-medium text-blue">{exam.code}</span>
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/exams/${exam.id}?edit=true`)}
                      className="text-sm text-text-primary font-medium truncate hover:text-blue transition-colors text-left"
                    >
                      {exam.name}
                    </button>
                    {exam.description && (
                      <p className="text-[11px] text-text-tertiary truncate mt-0.5">{exam.description}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-xs text-text-secondary">{exam.country}</span>
                  </div>

                  {/* Active */}
                  <div className="hidden lg:flex items-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded border ${
                        exam.isActive
                          ? 'text-green bg-green/10 border-green/20'
                          : 'text-text-tertiary bg-hover border-border'
                      }`}
                    >
                      {exam.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  {/* Chapters */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-sm text-text-secondary">{exam._count?.chapters ?? '—'}</span>
                  </div>

                  {/* Questions */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-sm text-text-secondary">{exam._count?.questions ?? '—'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:justify-end flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/exams/${exam.id}?edit=true`)}>
                      <Edit2 size={13} />
                      <span className="hidden sm:inline">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(exam)}
                    >
                      {exam.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      <span className="hidden sm:inline">{exam.isActive ? 'Désactiver' : 'Activer'}</span>
                    </Button>
                  </div>

                  {/* Mobile summary */}
                  <div className="flex items-center gap-3 lg:hidden text-[11px] text-text-tertiary">
                    <span>{exam.country}</span>
                    <span>·</span>
                    <span>{exam._count?.chapters ?? 0} ch</span>
                    <span>·</span>
                    <span>{exam._count?.questions ?? 0} q</span>
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        exam.isActive ? 'text-green bg-green/10 border-green/20' : 'text-text-tertiary bg-hover border-border'
                      }`}
                    >
                      {exam.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreate && (
        <CreateExamModal
          onClose={() => setShowCreate(false)}
          onCreated={(exam) => {
            setExams((prev) => [...prev, exam]);
            router.push(`/admin/exams/${exam.id}`);
          }}
        />
      )}
    </div>
  );
}
