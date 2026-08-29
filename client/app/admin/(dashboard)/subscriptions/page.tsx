'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  RefreshCw,
  TrendingDown,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Shield,
  Check,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface SubscriptionUser {
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  userId: string;
  user: SubscriptionUser;
  plan: 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  status: string;
  startedAt: string;
  renewsAt: string;
  amount: number;
  cancelAtPeriodEnd: boolean;
  stripeSubId: string | null;
  stripeCustomerId: string | null;
}

interface Transaction {
  id: string;
  userId: string;
  user: SubscriptionUser;
  plan: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
}

interface SubscriptionsData {
  totalActive: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  churnRate: number;
  subscriptions: Subscription[];
  transactions: Transaction[];
  totalCount: number;
  page: number;
  totalPages: number;
  txTotalCount: number;
  txPage: number;
  txTotalPages: number;
}

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-text-tertiary',
  MONTHLY: 'bg-blue',
  LIFETIME: 'bg-purple',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green/10 text-green border-green/20',
  PAST_DUE: 'bg-amber/10 text-amber border-amber/20',
  CANCELLED: 'bg-red/10 text-red border-red/20',
};

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: ['1 catégorie d\'examen', 'Statistiques de base', 'Explications standards'],
  MONTHLY: ['Questions illimitées', 'Toutes les catégories d\'examen', 'Suivi de progression', 'Accès complet au tuteur IA', 'Examens illimités', 'Explications détaillées'],
  LIFETIME: ['Questions illimitées', 'Toutes les catégories d\'examen', 'Suivi de progression', 'Accès complet au tuteur IA', 'Examens illimités', 'Explications détaillées'],
};

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-6">
      <div className="skeleton h-4 w-24 rounded mb-3" />
      <div className="skeleton h-8 w-20 rounded mb-2" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${PLAN_COLORS[plan] ?? 'bg-text-tertiary'}`}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[status] ?? 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20'}`}
    >
      {status === 'ACTIVE' ? (
        <Check size={10} className="mr-1" />
      ) : status === 'PAST_DUE' ? (
        <AlertCircle size={10} className="mr-1" />
      ) : null}
      {status.replace('_', ' ')}
    </span>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [data, setData] = useState<SubscriptionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [txPage, setTxPage] = useState(1);

  // Modal
  const [cancelModal, setCancelModal] = useState<Subscription | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/admin-login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      params.set('txPage', String(txPage));
      params.set('txLimit', '10');
      if (filterStatus) params.set('status', filterStatus);
      if (filterPlan) params.set('plan', filterPlan);

      const res = await fetch(`${API_URL}/api/subscriptions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/admin-login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du chargement des abonnements');
    } finally {
      setLoading(false);
    }
  }, [page, txPage, filterStatus, filterPlan, router]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancel = async () => {
    if (!cancelModal) return;
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${cancelModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCancelModal(null);
      fetchSubscriptions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Annulation échouée');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubs = (data?.subscriptions ?? []).filter((sub) => {
    if (search) {
      const q = search.toLowerCase();
      if (!sub.user.name.toLowerCase().includes(q) && !sub.user.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const stats = [
    {
      label: 'Actifs totaux',
      value: data?.totalActive ?? '—',
      icon: Users,
      color: 'text-blue',
    },
    {
      label: 'Revenus mensuels',
      value: data ? `$${data.monthlyRevenue.toFixed(2)}` : '—',
      icon: DollarSign,
      color: 'text-green',
    },
    {
      label: 'Revenus à vie',
      value: data ? `$${data.yearlyRevenue.toFixed(2)}` : '—',
      icon: RefreshCw,
      color: 'text-cyan',
    },
  ];

  const isLoading = loading && data === null;

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Abonnements</h1>
        <p className="text-sm text-text-secondary mt-1">Gérer les plans d'abonnement et la facturation</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red/10 border border-red/20 rounded-card text-sm text-red">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-border rounded-card p-6 card-glow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-secondary text-sm">{label}</p>
                    <p className={`text-3xl font-bold text-text-primary mt-2 ${color}`}>{value}</p>
                  </div>
                  <Icon size={20} className={color} strokeWidth={1.75} />
                </div>
              </div>
            ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { plan: 'FREE', label: 'Free', price: '0 $', period: '', features: PLAN_FEATURES.FREE },
          { plan: 'MONTHLY', label: 'Monthly', price: '29.99 $', period: '/mois', features: PLAN_FEATURES.MONTHLY },
          { plan: 'LIFETIME', label: 'Lifetime', price: '199 $', period: ' unique', features: PLAN_FEATURES.LIFETIME },
        ].map(({ plan, label, price, period, features }) => (
          <div
            key={plan}
            className={`bg-card border rounded-card p-6 ${
              plan === 'LIFETIME' ? 'border-purple/40' : 'border-border'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <PlanBadge plan={label} />
              {plan === 'LIFETIME' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-purple/20 text-purple rounded">Meilleur rapport qualité-prix</span>
              )}
            </div>
            <p className="text-3xl font-bold text-text-primary">
              {price}
              <span className="text-sm font-normal text-text-secondary">{period}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Check size={13} className="text-green flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Active Subscriptions Table */}
      <div className="bg-card border border-border rounded-card overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Abonnements actifs</h2>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-input text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-blue"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-input text-sm text-white focus:outline-none focus:border-blue"
          >
            <option value="" className="bg-[#0A0E1A] text-white">Tous les statuts</option>
            <option value="ACTIVE" className="bg-[#0A0E1A] text-white">Actif</option>
            <option value="PAST_DUE" className="bg-[#0A0E1A] text-white">En retard</option>
            <option value="CANCELLED" className="bg-[#0A0E1A] text-white">Annulé</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => { setFilterPlan(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-[#0A0E1A] border border-[#2D3A52] rounded-input text-sm text-white focus:outline-none focus:border-blue"
          >
            <option value="" className="bg-[#0A0E1A] text-white">Tous les plans</option>
            <option value="FREE" className="bg-[#0A0E1A] text-white">Gratuit</option>
            <option value="MONTHLY" className="bg-[#0A0E1A] text-white">Mensuel</option>
            <option value="LIFETIME" className="bg-[#0A0E1A] text-white">À vie</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="skeleton h-3 w-40 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="py-12 text-center text-text-tertiary text-sm">Aucun abonnement trouvé</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Utilisateur</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Plan</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Statut</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Début</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Renouvellement</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Montant</th>
                    <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((sub) => (
                    <tr key={sub.id} className="border-b border-border hover:bg-hover transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/users/${sub.userId}`}
                          className="hover:underline"
                        >
                          <p className="text-text-primary font-medium">{sub.user.name}</p>
                          <p className="text-text-tertiary text-xs">{sub.user.email}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <PlanBadge plan={sub.plan} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {new Date(sub.startedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {new Date(sub.renewsAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {sub.amount === 0 ? '—' : `$${sub.amount.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const stripeId = sub.stripeSubId || sub.id;
                              window.open(`https://dashboard.stripe.com/subscriptions/${stripeId}`, '_blank');
                            }}
                            className="text-xs text-blue hover:text-blue/80 transition-colors"
                          >
                            Gérer
                          </button>
                          <span className="text-text-tertiary">·</span>
                          <button
                            onClick={() => setCancelModal(sub)}
                            className="text-xs text-red hover:text-red/80 transition-colors"
                          >
                            Annuler
                          </button>
                          {sub.amount > 0 && (
                            <>
                              <span className="text-text-tertiary">·</span>
                              <button
                                onClick={() => {
                                  if (confirm(`Rembourser l'abonnement de ${sub.user.name} ($${sub.amount.toFixed(2)}) ?`)) {
                                    const token = localStorage.getItem('token');
                                    fetch(`${API_URL}/api/subscriptions/${sub.id}/refund`, {
                                      method: 'POST',
                                      headers: { Authorization: `Bearer ${token}` },
                                    }).then((r) => {
                                      if (r.ok) fetchSubscriptions();
                                      else alert('Remboursement échoué');
                                    });
                                  }
                                }}
                                className="text-xs text-amber hover:text-amber/80 transition-colors"
                              >
                                Rembourser
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <p className="text-xs text-text-tertiary">
                  Page {data.page} sur {data.totalPages} · {data.totalCount} au total
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.page <= 1}
                    className="p-2 rounded-btn border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={data.page >= data.totalPages}
                    className="p-2 rounded-btn border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Transactions récentes</h2>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="skeleton h-3 w-40 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : data?.transactions && data.transactions.length === 0 ? (
          <div className="py-12 text-center text-text-tertiary text-sm">Aucune transaction pour le moment</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Utilisateur</th>
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Plan</th>
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Montant</th>
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Statut</th>
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-text-tertiary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.transactions ?? []).map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-hover transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${tx.userId}`}
                        className="hover:underline"
                      >
                        <p className="text-text-primary font-medium">{tx.user.name}</p>
                        <p className="text-text-tertiary text-xs">{tx.user.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge plan={tx.plan} />
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {tx.amount === 0 ? '—' : `$${tx.amount.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.status === 'succeeded'
                            ? 'bg-green/10 text-green border border-green/20'
                            : tx.status === 'failed'
                            ? 'bg-red/10 text-red border border-red/20'
                            : 'bg-amber/10 text-amber border border-amber/20'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'failed' ? (
                        <button
                          onClick={() => {
                            const token = localStorage.getItem('token');
                            fetch(`${API_URL}/api/subscriptions/retry-payment`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ transactionId: tx.id }),
                            }).then((r) => {
                              if (r.ok) fetchSubscriptions();
                              else alert('Nouvelle tentative échouée');
                            });
                          }}
                          className="text-xs text-blue hover:text-blue/80 transition-colors"
                        >
                          Réessayer
                        </button>
                      ) : (
                        <span className="text-xs text-text-tertiary">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Pagination */}
        {data && data.txTotalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-text-tertiary">
              Page {data.txPage} sur {data.txTotalPages} · {data.txTotalCount} au total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                disabled={data.txPage <= 1}
                className="p-2 rounded-btn border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setTxPage((p) => Math.min(data.txTotalPages, p + 1))}
                disabled={data.txPage >= data.txTotalPages}
                className="p-2 rounded-btn border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-card p-6 w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">Annuler l'abonnement</h3>
              <button
                onClick={() => setCancelModal(null)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Êtes-vous sûr de vouloir annuler l'abonnement{' '}
              <span className="text-text-primary font-medium">{cancelModal.user.name}</span> —{' '}
              <PlanBadge plan={cancelModal.plan} /> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-btn text-sm text-text-primary hover:bg-hover transition-colors"
              >
                Conserver l'abonnement
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red text-white rounded-btn text-sm hover:bg-red/90 transition-colors disabled:opacity-60"
              >
                {actionLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Annuler l'abonnement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}