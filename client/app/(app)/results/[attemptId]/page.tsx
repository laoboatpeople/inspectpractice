'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const { t } = useLocale();

  useEffect(() => {
    // Simple version: redirect to dashboard with a success message
    // via URL params. The dashboard can pick this up to show a toast.
    router.replace(
      `/dashboard?attemptComplete=${encodeURIComponent(attemptId)}`
    );
  }, [attemptId, router]);

  useEffect(() => {
    document.title = `${t('results_title')} | Inspect Practice`;
  }, [t]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 size={32} className="text-blue animate-spin" />
        <p className="text-sm text-text-secondary">{t('results_loading')}</p>
      </motion.div>
    </div>
  );
}
