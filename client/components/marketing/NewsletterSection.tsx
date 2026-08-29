"use client";

import { useState, FormEvent } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const pathname = usePathname();
  const isFr = pathname.startsWith('/fr');
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale: isFr ? 'fr' : 'en' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || (isFr ? 'Vous êtes abonné à la newsletter !' : 'You have been subscribed to the newsletter!'));
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || (isFr ? 'Quelque chose s\'est mal passé. Veuillez réessayer.' : 'Something went wrong. Please try again.'));
      }
    } catch {
      setStatus("error");
      setMessage(isFr ? 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.' : 'Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="py-16 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-transparent" />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <Mail className="w-4 h-4 text-[#C8102E]" />
          <span className="text-sm text-[#94A3B8]">{isFr ? 'Infolettre' : 'Newsletter'}</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-[#F8FAFC]">
          {isFr ? 'Restez informé' : 'Stay in the loop'}
        </h3>
        <p className="text-[#94A3B8] mb-8 text-sm md:text-base">
          {isFr ? 'Abonnez-vous et recevez gratuitement la checklist de préparation ICC 30 jours, des conseils d\'examen et des ressources d\'étude.' : 'Subscribe and get the free 30-Day ICC Exam Prep Checklist, exam tips, and study resources delivered to your inbox.'}
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-[#10B981]" />
            </div>
            <p className="text-[#F8FAFC] font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? 'vous@courriel.com' : 'you@email.com'}
                required
                disabled={status === "loading"}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#C8102E]/50 focus:ring-1 focus:ring-[#C8102E]/30 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-[#C8102E] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isFr ? 'Abonnement en cours...' : 'Subscribing...'}
                </>
              ) : (
                isFr ? "S'abonner" : "Subscribe"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">{message}</p>
        )}
      </div>
    </section>
  );
}
