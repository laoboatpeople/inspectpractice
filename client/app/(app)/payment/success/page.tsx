'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function PaymentSuccessPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-card border border-border rounded-card p-8 md:p-12 text-center max-w-md w-full"
      >
        {/* Green checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
          className="w-20 h-20 mx-auto rounded-full bg-green/10 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={48} className="text-green" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('payment_success')}
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          {t('payment_successDesc')}
        </p>

        {/* Action */}
        <Link
          href="/app"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-btn bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors"
        >
          {t('payment_startPracticing')}
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}
