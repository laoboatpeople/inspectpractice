'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle,
  Layers,
  Users,
  CreditCard,
  Mail,
  MessageSquare,
  ThumbsUp,
  Settings,
  X,
} from 'lucide-react';
import { UserMenu } from '@/components/ui/UserMenu';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Exams', href: '/admin/exams', icon: FileText },
  { label: 'Questions', href: '/admin/questions', icon: BookOpen },
  { label: 'Review', href: '/admin/questions/review', icon: CheckCircle },
  { label: 'AI Generator', href: '/admin/questions/generate', icon: Sparkles },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Contact', href: '/admin/contact-messages', icon: MessageSquare },
  { label: 'Feedback', href: '/admin/feedback', icon: ThumbsUp },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <nav className="flex flex-col h-full bg-[#0A0E1A] border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-border">
        <Link href="/app" className="flex items-center gap-3 group">
          <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-9 w-auto flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text-primary leading-none group-hover:text-blue transition-colors">Inspect Practice</p>
            <p className="text-[10px] text-text-tertiary mt-0.5">ICC Exam Prep</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {(() => {
          const activeHref = [...NAV_ITEMS]
            .sort((a, b) => b.href.length - a.href.length)
            .find(({ href }) => pathname === href || pathname.startsWith(`${href}/`))?.href;

          return NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-blue/10 text-blue border border-blue/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                )}
              >
                <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
                {label}
              </Link>
            );
          });
        })()}
      </div>

      {/* Footer user */}
      <div className="px-5 py-4 border-t border-border">
        <UserMenu
          user={{
            name: user?.name ?? 'Admin',
            email: user?.email ?? '',
          }}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  );
}
