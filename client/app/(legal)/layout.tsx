export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans">
      {children}
    </div>
  );
}
