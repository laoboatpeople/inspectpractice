'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Sparkles,
  Star,
  Infinity,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { UserProfile } from '@/types/student';
import { getMe, createCheckoutSession, cancelSubscription } from '@/lib/student-api';
import { useLocale } from '@/src/contexts/LocaleContext';

// ─── Types ───────────────────────────────────────────────────

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  name: string;
  price: string;
  periodKey?: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
  badge?: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0',
    description: 'freeDesc',
    features: [
      { text: 'oneCategory', included: true },
      { text: 'basicStats', included: true },
      { text: 'standardExplanations', included: true },
      { text: 'freeFiftyTutor', included: true },
    ],
  },
  {
    id: 'MONTHLY',
    name: 'Monthly',
    price: '$29.99',
    periodKey: 'perMonth',
    description: 'monthlyDesc',
    features: [
      { text: 'allCategories', included: true },
      { text: 'progressTracking', included: true },
      { text: 'unlimitedAiTutor', included: true },
      { text: 'unlimitedExams', included: true },
      { text: 'detailedExplanations', included: true },
    ],
    highlighted: false,
  },
  {
    id: 'YEARLY',
    name: 'Yearly',
    price: '$99',
    periodKey: 'perYear',
    description: 'yearlyDesc',
    features: [
      { text: 'allCategories', included: true },
      { text: 'progressTracking', included: true },
      { text: 'unlimitedAiTutor', included: true },
      { text: 'unlimitedExams', included: true },
      { text: 'detailedExplanations', included: true },
    ],
    highlighted: true,
    badge: 'Best Value',
  },
  {
    id: 'LIFETIME',
    name: 'Lifetime',
    price: '$199',
    periodKey: 'oneTime',
    description: 'lifetimeDesc',
    features: [
      { text: 'allCategories', included: true },
      { text: 'progressTracking', included: true },
      { text: 'unlimitedAiTutor', included: true },
      { text: 'unlimitedExams', included: true },
      { text: 'detailedExplanations', included: true },
    ],
    highlighted: false,
  },
];

// ─── Skeleton ────────────────────────────────────────────────

function PlansSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-card p-6">
          <div className="h-4 w-20 bg-border rounded mb-4" />
          <div className="h-8 w-24 bg-border rounded mb-2" />
          <div className="h-3 w-32 bg-border rounded mb-6" />
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <div key={j} className="h-4 w-full bg-border rounded" />
            ))}
          </div>
          <div className="h-10 w-full bg-border rounded-btn" />
        </div>
      ))}
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="h-14 w-14 rounded-full bg-red/10 flex items-center justify-center">
        <XCircle size={28} className="text-red" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-text-primary">
          {t('somethingWentWrong')}
        </h3>
        <p className="text-sm text-text-secondary mt-1 max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-btn bg-card border border-border text-text-primary text-sm font-medium hover:bg-hover transition-colors"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}

// ─── Plan Card ───────────────────────────────────────────────

function PlanCard({
  plan,
  currentPlan,
  onSubscribe,
  subscribing,
}: {
  plan: PricingPlan;
  currentPlan: string | null;
  onSubscribe: (planId: 'MONTHLY' | 'YEARLY' | 'LIFETIME') => void;
  subscribing: 'MONTHLY' | 'YEARLY' | 'LIFETIME' | null;
}) {
  const { t } = useLocale();
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.id === 'FREE';
  const showSubscribe = !isFree && !isCurrentPlan;

  const planNameKey = plan.id.toLowerCase();
  const planDescKey = plan.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card border rounded-card p-6 flex flex-col transition-all duration-200 ${
        plan.highlighted
          ? 'border-blue/50 ring-1 ring-blue/40 shadow-xl shadow-blue/10 scale-[1.02] md:scale-105 z-10 bg-gradient-to-b from-blue/[0.08] via-card to-card'
          : 'border-border hover:border-blue/30 hover:shadow-lg hover:shadow-black/30'
      } ${isCurrentPlan && !plan.highlighted ? 'border-green/40' : ''}`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue to-cyan text-white text-[10px] font-semibold uppercase tracking-wider shadow-md shadow-blue/40">
            <Star size={10} className="fill-current" />
            {t('bestValue')}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              plan.id === 'LIFETIME' ? 'bg-purple/15 text-purple' : 'bg-blue/15 text-blue'
            }`}
          >
            {plan.id === 'FREE' ? (
              <Sparkles size={18} />
            ) : plan.id === 'MONTHLY' || plan.id === 'YEARLY' ? (
              <Star size={18} />
            ) : (
              <Infinity size={18} />
            )}
          </div>
          {isCurrentPlan && !plan.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green/10 text-green text-[10px] font-semibold uppercase tracking-wider border border-green/20">
              <CheckCircle2 size={10} />
              {t('currentPlan')}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          {t(planNameKey)}
        </h3>
        <div className="flex items-baseline gap-1 my-3">
          <span
            className={`text-4xl font-extrabold tracking-tight ${
              plan.highlighted ? 'text-blue' : 'text-text-primary'
            }`}
          >
            {plan.price}
          </span>
          {plan.periodKey && (
            <span className="text-sm text-text-tertiary">{t(plan.periodKey)}</span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed">{t(planDescKey)}</p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            {feature.included ? (
              <CheckCircle2 size={14} className="text-green mt-0.5 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-text-tertiary/30 mt-0.5 shrink-0" />
            )}
            <span
              className={
                feature.included
                  ? 'text-text-secondary'
                  : 'text-text-tertiary line-through'
              }
            >
              {t(feature.text)}
            </span>
          </li>
        ))}
      </ul>

      {/* Action */}
      {isCurrentPlan && (
        <div className="w-full py-2.5 rounded-btn bg-green/10 border border-green/20 text-green text-sm font-medium text-center">
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} />
            {t('currentPlan')}
          </span>
        </div>
      )}

      {showSubscribe && (
        <button
          onClick={() => onSubscribe(plan.id as 'MONTHLY' | 'YEARLY' | 'LIFETIME')}
          disabled={subscribing === plan.id}
          className={`group w-full flex items-center justify-center gap-2 py-2.5 rounded-btn text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            plan.highlighted
              ? 'bg-gradient-to-r from-blue to-cyan text-white shadow-md shadow-blue/25 hover:shadow-lg hover:shadow-blue/40 hover:brightness-110'
              : 'bg-blue text-white hover:bg-blue/90'
          }`}
        >
          {subscribing === plan.id ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t('redirecting')}
            </>
          ) : (
            <>
              {t('subscribe')}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

// ─── Main Subscription Page ──────────────────────────────────

export default function SubscriptionPage() {
  const { t } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<'MONTHLY' | 'YEARLY' | 'LIFETIME' | null>(
    null
  );

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('somethingWentWrong')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `${t('subscriptionTitle')} | Inspect Practice`;
    loadUser();
  }, [t]);

  const handleSubscribe = async (plan: 'MONTHLY' | 'YEARLY' | 'LIFETIME') => {
    setSubscribing(plan);
    setError(null);
    try {
      const session = await createCheckoutSession(plan);
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('failedCreateCheckout')
      );
      setSubscribing(null);
    }
  };

  const [cancelling, setCancelling] = useState(false);
  const handleCancel = async () => {
    if (!confirm(t('confirmCancel'))) return;
    setCancelling(true);
    setError(null);
    try {
      await cancelSubscription();
      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedCancelSub'));
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = user?.subscription?.plan || 'FREE';

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {t('subscriptionTitle')}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {t('choosePlan')}
            </p>
          </div>
        </div>
        <PlansSkeleton />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error && !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {t('subscriptionTitle')}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {t('choosePlan')}
            </p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadUser} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            <span className="bg-gradient-to-r from-blue to-cyan bg-clip-text text-transparent">
              {t('subscriptionTitle')}
            </span>
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            {t('choosePlan')}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border self-start md:self-auto">
          <CreditCard size={16} className="text-blue" />
          <span className="text-xs text-text-secondary font-medium">{t('currentPlan')}:</span>
          <span className="text-xs font-bold text-text-primary">
            {t(currentPlan.toLowerCase() + 'Plan')}
          </span>
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red/10 border border-red/20 text-red text-sm"
        >
          <XCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            onSubscribe={handleSubscribe}
            subscribing={subscribing}
          />
        ))}
      </div>

      {/* Cancel subscription */}
      {currentPlan !== 'FREE' && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red/70 hover:text-red border border-red/20 hover:border-red/40 rounded-btn transition-colors disabled:opacity-50"
          >
            {cancelling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <XCircle size={14} />
            )}
            {cancelling ? t('cancelling') : t('cancelSubscription')}
          </button>
        </div>
      )}

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 text-xs text-text-tertiary mt-6"
      >
        <ShieldCheck size={14} className="text-green shrink-0" />
        <span>{t('subscriptionFooter')}</span>
      </motion.div>
    </div>
  );
}
