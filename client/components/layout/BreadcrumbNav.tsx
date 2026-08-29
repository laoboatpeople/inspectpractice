'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const routes: Record<string, string> = {
  // English
  '/': 'Home',
  '/faq': 'FAQ',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
  '/about': 'About',
  '/blog': 'Blog',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/study-checklist': 'Study Checklist',
  '/free-icc-practice-questions': 'Free Practice Questions',
  '/icc-resources': 'Resources',
  '/icc-certification-guide': 'ICC Certification Guide',
  // French
  '/fr': 'Accueil',
  '/fr/faq': 'FAQ',
  '/fr/pricing': 'Tarifs',
  '/fr/contact': 'Contact',
  '/fr/about': 'À propos',
  '/fr/blog': 'Blog',
  '/fr/privacy': 'Politique de confidentialité',
  '/fr/terms': 'Conditions d\'utilisation',
};

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');

  // Only show on marketing pages
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/app') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/test') ||
    pathname.startsWith('/quiz') ||
    pathname.startsWith('/results') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/exams') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/tutor') ||
    pathname.startsWith('/subscription')
  ) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  // Build breadcrumbs from path segments
  let currentPath = '';
  for (const segment of segments) {
    currentPath += '/' + segment;
    const label = routes[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbs.push({ label, href: currentPath });
  }

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label={isFr ? 'Fil d\'Ariane' : 'Breadcrumb'} className="max-w-4xl mx-auto px-6 pt-6">
      <ol className="flex items-center gap-2 text-xs text-[#64748B]">
        <li>
          <Link href={isFr ? '/fr' : '/'} className="hover:text-[#94A3B8] transition-colors">{isFr ? 'Accueil' : 'Home'}</Link>
        </li>
        {breadcrumbs.filter(b => b.href !== '/' && b.href !== '/fr' && b.href !== '/fr/').map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span>/</span>
            {i === breadcrumbs.filter(b => b.href !== '/' && b.href !== '/fr' && b.href !== '/fr/').length - 1 ? (
              <span className="text-[#94A3B8]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-[#94A3B8] transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
