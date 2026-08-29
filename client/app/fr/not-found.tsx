import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page non trouvée — Inspect Practice',
  description: 'La page que vous recherchez n\'existe pas. Parcourez nos ressources d\'examen ICC, nos questions d\'entraînement et nos guides d\'étude.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/fr" className="flex items-center gap-2">
            <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-7 w-auto" />
            <span className="font-bold text-lg">Inspect Practice</span>
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="text-8xl font-bold bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold mb-3">Page non trouvée</h1>
          <p className="text-[#94A3B8] mb-8">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
            Laissez-nous vous remettre sur la bonne voie.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link href="/fr" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">🏠 Accueil</h3>
              <p className="text-xs text-[#64748B]">Retour à la page d&apos;accueil de Inspect Practice</p>
            </Link>
            <Link href="/fr/blog" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📝 Questions d&apos;entraînement</h3>
              <p className="text-xs text-[#64748B]">Questions pratiques ICC de style à livre ouvert</p>
            </Link>
            <Link href="/fr/blog" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📚 Blog et ressources</h3>
              <p className="text-xs text-[#64748B]">Guides de certification, navigation dans les codes et conseils</p>
            </Link>
            <Link href="/fr/blog/icc-exam-study-plan" className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <h3 className="font-semibold text-sm mb-1">📋 Plan d&apos;étude</h3>
              <p className="text-xs text-[#64748B]">Plan de préparation ICC de 12 semaines</p>
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/auth/login" className="px-6 py-3 rounded-lg bg-[#C8102E] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors">
              Commencer gratuitement
            </Link>
            <Link href="/fr/contact" className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/[0.05] text-[#F8FAFC] text-sm font-medium transition-colors">
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-[#64748B]">
          <p>&copy; {new Date().getFullYear()} Inspect Practice. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
