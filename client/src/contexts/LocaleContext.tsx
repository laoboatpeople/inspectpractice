"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { getTranslation } from "@/src/i18n/translations";

type Locale = "en" | "fr";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = "inspectpractice:locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // English-only site: locale is always "en" (no persistence, no toggle)

  const setLocale = useCallback((_newLocale: Locale) => {
    setLocaleState("en");
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState("en");
  }, []);

  return (
    <LocaleContext.Provider value={{ 
      locale, 
      setLocale, 
      toggleLocale,
      t: (path: string, vars?: Record<string, string | number>) => getTranslation(locale, path, vars),
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export type { Locale };
