'use client';

import { useScrollReveal } from '@/components/hooks/useScrollReveal';

export default function ScrollReveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal${inView ? ' in-view' : ''} ${className}`}>
      {children}
    </div>
  );
}
