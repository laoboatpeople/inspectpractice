'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  MessageSquare,
  CreditCard,
  Plane,
  LogOut,
  User,
  ChevronRight,
  Menu,
  X,
  Eye,
} from 'lucide-react';
import type { UserProfile } from '@/types/student';
import { useLocale } from '@/src/contexts/LocaleContext';

const NAV_ITEMS = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/theory', label: 'Theory', icon: BookMarked },
  { href: '/exams', label: 'Exams', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [impersonation, setImpersonation] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('impersonating');
      if (raw) setImpersonation(JSON.parse(raw));
    } catch { /* ignore malformed */ }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUser();
  }, [router]);

  async function fetchUser() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    router.push('/auth/login');
  }

  // Exit view-as mode: restore the admin session (if backed up) and go back to admin
  function handleExitImpersonation() {
    const adminToken = localStorage.getItem('impersonate_backup_token');
    const adminUser = localStorage.getItem('impersonate_backup_user');
    const adminId = localStorage.getItem('impersonate_backup_admin_id') || '';
    if (adminToken) localStorage.setItem('token', adminToken);
    if (adminUser) localStorage.setItem('user', adminUser);
    localStorage.removeItem('impersonating');
    localStorage.removeItem('impersonate_backup_token');
    localStorage.removeItem('impersonate_backup_user');
    localStorage.removeItem('impersonate_backup_admin_id');
    setImpersonation(null);
    router.push(adminId ? `/admin/users/${adminId}` : '/admin');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Plane size={32} className="text-blue animate-pulse" />
          <p className="text-text-secondary text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary text-text-primary">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0A0E1A] border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link href="/app" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
                <Plane size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">Inspect Practice</span>
            </Link>
            <button
              className="lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              const labelKey = item.href === '/app' ? 'dashboard'
                : item.href === '/theory' ? 'theory'
                : item.href === '/exams' ? 'exams'
                : item.href === '/tutor' ? 'aiTutor'
                : item.href === '/subscription' ? 'subscription'
                : 'profile';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue/10 text-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                  }`}
                >
                  <Icon size={18} />
                  <span>{t(labelKey)}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center">
                <User size={14} className="text-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-tertiary truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-red hover:bg-red/5 transition-colors"
            >
              <LogOut size={16} />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-primary border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          {impersonation && (
            <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10">
              <div className="flex items-center gap-2.5 text-sm text-[#F59E0B] min-w-0">
                <Eye size={16} className="flex-shrink-0" />
                <span className="truncate">
                  {`View-as mode — viewing ${impersonation.name}'s dashboard (${impersonation.email})`}
                </span>
              </div>
              <button
                onClick={handleExitImpersonation}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F59E0B] hover:bg-[#D97706] text-white transition-colors"
              >
                <X size={13} />
                {'Exit view-as'}
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
