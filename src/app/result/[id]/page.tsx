import { notFound } from "next/navigation";
import Link from "next/link";
import ResultView from "@/components/ResultView";
import { prisma } from "@/lib/prisma";
import type { Automation } from "@/types";

interface ResultPageProps {
  params: { id: string };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const result = await prisma.scanResult.findUnique({
    where: { id: params.id },
  });

  if (!result) {
    notFound();
  }

  let signals: string[] = [];
  let automations: Automation[] = [];
  let impacts: string[] = [];

  try {
    signals = JSON.parse(result.signals);
  } catch {
    signals = [];
  }

  try {
    automations = JSON.parse(result.automations);
  } catch {
    automations = [];
  }

  try {
    impacts = JSON.parse(result.impacts);
  } catch {
    impacts = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-2">
        <Link href="/" className="text-sm text-surface-400 hover:text-brand-400 transition-colors">
          ← Início
        </Link>
      </div>
      <main className="mx-auto w-full max-w-lg px-4 py-4 space-y-8">
        <ResultView
          level={result.level}
          score={result.score}
          signals={signals}
          automations={automations}
          impacts={impacts}
          executiveSummary={result.executiveSummary}
        />

        <div className="text-center py-4 space-y-4">
          <a
            href="https://grupointelsis.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full max-w-xs rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-300 transition-all duration-200"
          >
            Fale com um especialista Intelsis →
          </a>
          <Link
            href="/"
            className="inline-block rounded-xl border border-surface-600 px-6 py-3 text-sm font-medium text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
          >
            ← Novo diagnóstico
          </Link>
        </div>
      </main>
    </div>
  );
}
