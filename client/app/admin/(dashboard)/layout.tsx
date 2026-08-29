'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/auth/admin-login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR') {
          router.replace('/app');
          return;
        }
      } catch {
        router.replace('/auth/admin-login');
        return;
      }
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-primary text-text-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless toggled */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex-shrink-0 bg-[#0A0E1A] border-r border-border ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-secondary">
          {children}
        </main>
      </div>
    </div>
  );
}
