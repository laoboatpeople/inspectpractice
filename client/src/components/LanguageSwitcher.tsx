"use client";

import { useLocale } from "@/src/contexts/LocaleContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-all duration-200"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "en" ? "FR" : "EN"}
    </button>
  );
}
