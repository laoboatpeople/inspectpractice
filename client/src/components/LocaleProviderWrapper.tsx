"use client";

import { useLocale } from "@/src/contexts/LocaleContext";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

export default function LocaleProviderWrapper({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const messages = locale === 'en' ? en : fr;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
