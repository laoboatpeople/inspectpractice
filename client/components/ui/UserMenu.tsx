'use client';

import * as React from 'react';
import { cn } from './utils';
import { LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
  onProfile?: () => void;
  loading?: boolean;
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  onProfile,
  loading = false,
  className,
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = React.useMemo(() => {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
    closeMenu();
  };

  const handleProfile = () => {
    router.push('/admin/profile');
    closeMenu();
  };

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const handler = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          closeMenu();
        }
      };
      document.addEventListener('click', handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', () => {});
    };
  }, [isOpen]);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className={cn(
          'flex items-center gap-3 rounded-card px-3 py-2 transition-colors w-full',
          'hover:bg-[var(--bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
          loading && 'opacity-50'
        )}
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-blue)] text-sm font-medium text-white">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                initials
              )}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] bg-[var(--accent-green)]" />
        </div>

        {/* User info */}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate w-full">{user.name}</span>
          <span className="text-xs text-[var(--text-tertiary)] truncate w-full">{user.email}</span>
        </div>

        {/* Dropdown arrow */}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[var(--text-tertiary)] transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown menu - inline styles to ensure visibility */}
      {isOpen ? (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: '4px',
          }}
        >
          {/* User info header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '4px 0' }}>
            <button
              type="button"
              onClick={handleProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 16px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User style={{ width: 16, height: 16, flexShrink: 0 }} />
              Profile
            </button>
          </div>

          {/* Logout */}
          <div style={{ padding: '4px 0', borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#EF4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut style={{ width: 16, height: 16, flexShrink: 0 }} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export { UserMenu };
