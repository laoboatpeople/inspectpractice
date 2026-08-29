'use client';

import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu } from 'lucide-react';

const routeTitles: Record<string, { title: string; isId?: boolean }[]> = {
  '/admin': [{ title: 'Dashboard' }],
  '/admin/exams': [{ title: 'Exams' }],
  '/admin/exams/[id]': [{ title: 'Exams' }, { title: 'Details', isId: true }],
  '/admin/users': [{ title: 'Users' }],
  '/admin/users/[id]': [{ title: 'Users' }, { title: 'Details', isId: true }],
  '/admin/questions': [{ title: 'Questions' }],
  '/admin/questions/generate': [{ title: 'Questions' }, { title: 'Generate' }],
  '/admin/questions/review': [{ title: 'Questions' }, { title: 'Review' }],
  '/admin/subscriptions': [{ title: 'Subscriptions' }],
  '/admin/settings': [{ title: 'Settings' }],
  '/admin/profile': [{ title: 'Profile' }],
  '/admin/ai-generator': [{ title: 'AI Generator' }],
};

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string }[] = [];

  // Try to find a matching route in our titles map
  const matchedRoute = Object.keys(routeTitles).find(route => {
    const routeSegments = route.split('/').filter(Boolean);
    if (routeSegments.length !== segments.length) return false;
    return routeSegments.every((rs, idx) => {
      if (rs.startsWith('[')) return true; // Dynamic segment matches anything
      return rs === segments[idx];
    });
  });

  if (matchedRoute) {
    // Use predefined titles, excluding ID placeholders for display
    breadcrumbs.push(...routeTitles[matchedRoute]
      .filter(rb => !rb.isId)
      .map(rb => ({ label: rb.title })));
  } else {
    // Fallback: capitalize segments
    breadcrumbs.push(...segments.map(segment => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    })));
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-primary flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="lg:hidden mr-2 p-1 text-text-secondary hover:text-text-primary transition-colors">
            <Menu size={18} />
          </button>
        )}
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-text-tertiary" />
            <span className={index === breadcrumbs.length - 1 ? 'text-text-primary font-medium' : ''}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-btn text-text-secondary hover:text-text-primary hover:bg-hover transition-colors">
          <Bell size={16} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue" />
        </button>
      </div>
    </header>
  );
}
