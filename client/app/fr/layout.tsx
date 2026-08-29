'use client';

import { useEffect } from 'react';

/**
 * French locale layout.
 * Sets <html lang="fr"> on mount via client-side script (Next.js limitation:
 * root layout hardcodes lang="en" and child layouts cannot redefine <html>).
 * Also overrides metadata — note: page.tsx metadata overrides this further.
 */
export default function FrLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'fr';
  }, []);

  return <>{children}</>;
}
