import type { Metadata } from "next";
import { LocaleProvider } from "@/src/contexts/LocaleContext";
import { StickyCtaBanner } from "@/components/marketing/StickyCtaBanner";

export const metadata: Metadata = {
  title: "Inspect Practice - AI-Powered ICC Exam Preparation",
  description: "Train smarter, certify faster. The AI-powered web app built for modern building inspectors pursuing ICC certification.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      {children}
      <StickyCtaBanner />
    </LocaleProvider>
  );
}
