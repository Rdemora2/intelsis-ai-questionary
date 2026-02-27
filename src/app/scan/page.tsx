import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-2">
        <Link
          href="/"
          className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
        >
          ← Início
        </Link>
      </div>
      <main className="mx-auto w-full max-w-lg px-4 py-4">
        <LeadForm />
      </main>

      {/* Rodapé */}
      <footer className="text-center py-8 text-xs text-surface-500 space-y-1">
        <p>Grupo Intelsis • Oportunidades SAP</p>
        <p>grupointelsis.com.br</p>
      </footer>
    </div>
  );
}
