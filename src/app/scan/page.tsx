import Link from "next/link";
import ScanForm from "@/components/ScanForm";

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-2">
        <Link href="/" className="text-sm text-surface-400 hover:text-brand-400 transition-colors">
          ← Início
        </Link>
      </div>
      <main className="mx-auto w-full max-w-lg px-4 py-4">
        <ScanForm />
      </main>
    </div>
  );
}
