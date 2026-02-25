import { LEVEL_LABELS } from "@/types";
import type { Automation } from "@/types";

interface ResultViewProps {
  level: string;
  score: number;
  signals: string[];
  automations: Automation[];
  impacts: string[];
  executiveSummary: string;
}

function LevelBadge({ level, score }: { level: string; score: number }) {
  const colors: Record<string, string> = {
    LOW: "bg-brand-500/15 text-brand-400 border-brand-500/30",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    HIGH: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  const descriptions: Record<string, string> = {
    LOW: "Há oportunidades pontuais de automação para ganhos rápidos",
    MEDIUM:
      "Diversas áreas podem se beneficiar de automação com retorno significativo",
    HIGH: "Potencial elevado — automação pode transformar a eficiência operacional",
  };

  return (
    <div className="text-center mb-6">
      <p className="text-sm text-surface-400 mb-2">Potencial de automação</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-surface-500 text-sm">/100</span>
      </div>
      <span
        className={`inline-block rounded-full border px-5 py-1.5 text-sm font-semibold mt-2 ${
          colors[level] || colors.MEDIUM
        }`}
      >
        {LEVEL_LABELS[level] || level}
      </span>
      <p className="text-xs text-surface-500 mt-2 max-w-xs mx-auto">
        {descriptions[level] || descriptions.MEDIUM}
      </p>
    </div>
  );
}

function SapBadge({ solution }: { solution: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-400">
      <svg
        className="h-3 w-3 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {solution}
    </span>
  );
}

export default function ResultView({
  level,
  score,
  signals,
  automations,
  impacts,
  executiveSummary,
}: ResultViewProps) {
  return (
    <div className="space-y-6">
      <LevelBadge level={level} score={score} />

      <div className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <p className="text-sm text-surface-300 leading-relaxed">
          {executiveSummary}
        </p>
      </div>

      <div className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wide mb-3">
          Sinais identificados na operação
        </h2>
        <ul className="space-y-2">
          {signals.map((signal, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-surface-300"
            >
              <span className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-brand-400" />
              {signal}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wide mb-3 px-1">
          Oportunidades de automação com SAP
        </h2>
        <div className="space-y-3">
          {automations.map((auto, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5"
            >
              <div className="flex flex-col gap-2 mb-3">
                <h3 className="font-semibold text-white text-sm">
                  {auto.title}
                </h3>
                {auto.sap_solution && <SapBadge solution={auto.sap_solution} />}
              </div>
              <p className="text-sm text-surface-400 mb-3">{auto.rationale}</p>
              <div className="flex items-start gap-2 rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-2">
                <span className="text-brand-400 font-medium text-xs mt-0.5">
                  →
                </span>
                <p className="text-xs text-brand-300 font-medium">
                  {auto.first_step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-wide mb-3">
          Impactos esperados
        </h2>
        <ul className="space-y-2">
          {impacts.map((impact, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-surface-300"
            >
              <span className="mt-1 flex-shrink-0 text-brand-400">✓</span>
              {impact}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
