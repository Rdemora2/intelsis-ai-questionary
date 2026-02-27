import Link from "next/link";
import AdminTable from "@/components/AdminTable";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <div className="mx-auto w-full max-w-6xl px-4 pt-5 pb-2">
        <Link
          href="/"
          className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
        >
          ← Início
        </Link>
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 py-4">
        <h1 className="text-xl font-bold text-white mb-4">Painel de Leads</h1>
        <AdminTable />
      </main>
    </div>
  );
}
