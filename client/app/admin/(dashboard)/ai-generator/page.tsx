'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIGeneratorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/questions/generate');
  }, [router]);

  return null;
}
