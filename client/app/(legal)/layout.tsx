export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#102631] font-sans">
      {children}
    </div>
  );
}
