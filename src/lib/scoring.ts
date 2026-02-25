import type { ScanAnswers, ScoringResult } from "@/types";

// --- Weights calibrated for 18 items (total ≈ 200) ---
const WEIGHTS: Record<string, number> = {
  // Processos & Pessoas
  approvals: 12,
  key_people: 10,
  no_standards: 11,
  rework: 14,
  redundant_steps: 9,
  // Dados & Sistemas
  data_reentry: 14,
  spreadsheets: 13,
  no_integration: 12,
  data_inconsistency: 11,
  // Documentos & Compliance
  high_doc_volume: 10,
  manual_routing: 11,
  doc_loss: 13,
  compliance_difficulty: 9,
  // Comunicação & Indicadores
  manual_comms: 8,
  poor_tracking: 11,
  repetitive_queries: 10,
  slow_reports: 12,
  no_realtime_data: 10,
};

const MAX_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

const SIGNAL_LABELS: Record<string, string> = {
  approvals: "Fluxos de aprovação com alto potencial de automação",
  key_people:
    "Processos concentrados em pessoas-chave com oportunidade de padronização",
  no_standards:
    "Espaço para padronização e documentação de processos operacionais",
  rework:
    "Oportunidade de reduzir retrabalho com validação e automação de dados",
  redundant_steps:
    "Etapas que podem ser simplificadas ou automatizadas nos fluxos",
  data_reentry:
    "Potencial de eliminar redigitação manual com integração entre sistemas",
  spreadsheets:
    "Controles em planilhas que podem migrar para plataforma integrada",
  no_integration:
    "Oportunidade de conectar sistemas corporativos via integração nativa",
  data_inconsistency:
    "Dados que se beneficiariam de governança e sincronização automatizada",
  high_doc_volume:
    "Volume documental que pode ser otimizado com gestão digital",
  manual_routing: "Encaminhamento de documentos com potencial de automação",
  doc_loss: "Gestão documental que pode ganhar rastreabilidade e segurança",
  compliance_difficulty:
    "Oportunidade de fortalecer conformidade com automação de controles",
  manual_comms:
    "Comunicação com clientes e fornecedores que pode ser automatizada",
  poor_tracking: "Rastreabilidade de solicitações com espaço para evolução",
  repetitive_queries:
    "Demandas recorrentes que podem ser atendidas por assistente inteligente",
  slow_reports: "Relatórios gerenciais com potencial de automação e tempo real",
  no_realtime_data:
    "Oportunidade de ter dados em tempo real para decisões mais ágeis",
};

const THEME_MAP: Record<string, string[]> = {
  approvals: ["approvals"],
  key_people: ["process_optimization"],
  no_standards: ["process_optimization"],
  rework: ["master_data_quality"],
  redundant_steps: ["process_optimization"],
  data_reentry: ["integration"],
  spreadsheets: ["integration"],
  no_integration: ["integration"],
  data_inconsistency: ["master_data_quality"],
  high_doc_volume: ["document_processing"],
  manual_routing: ["document_processing"],
  doc_loss: ["document_processing"],
  compliance_difficulty: ["document_processing", "process_optimization"],
  manual_comms: ["customer_service"],
  poor_tracking: ["customer_service"],
  repetitive_queries: ["customer_service", "ai_assistants"],
  slow_reports: ["reporting"],
  no_realtime_data: ["reporting", "integration"],
};

const KEYWORD_PATTERNS = [
  "retrabalho",
  "manual",
  "lento",
  "demora",
  "planilha",
  "erro",
  "duplica",
  "perd",
  "atraso",
  "gargalo",
  "papel",
  "email",
  "e-mail",
  "ineficien",
  "falha",
  "integra",
  "sistema",
  "automati",
  "repetitiv",
  "controle",
];

// Larger companies amplify the same pain points
const SIZE_MULTIPLIER: Record<string, number> = {
  "1-50": 1.0,
  "51-200": 1.05,
  "201-500": 1.12,
  "501-1000": 1.18,
  "1000+": 1.25,
};

function calculateKeywordBonus(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let bonus = 0;
  for (const keyword of KEYWORD_PATTERNS) {
    if (lower.includes(keyword)) {
      bonus += 2;
    }
  }
  return Math.min(bonus, 10);
}

export function calculateScore(
  answers: ScanAnswers,
  problemText?: string,
  companySize?: string,
): ScoringResult {
  const allSelected = [
    ...answers.processes,
    ...answers.operations,
    ...answers.documents,
    ...(answers.communication || []),
  ];

  let rawScore = 0;
  for (const item of allSelected) {
    rawScore += WEIGHTS[item] || 0;
  }

  const normalizedScore = Math.round((rawScore / MAX_WEIGHT) * 100);
  const bonus = calculateKeywordBonus(problemText || "");
  const multiplier = SIZE_MULTIPLIER[companySize || ""] || 1.0;
  const finalScore = Math.min(
    Math.round((normalizedScore + bonus) * multiplier),
    100,
  );

  let level: "LOW" | "MEDIUM" | "HIGH";
  if (finalScore <= 25) {
    level = "LOW";
  } else if (finalScore <= 55) {
    level = "MEDIUM";
  } else {
    level = "HIGH";
  }

  const sortedItems = allSelected
    .filter((item) => WEIGHTS[item])
    .sort((a, b) => (WEIGHTS[b] || 0) - (WEIGHTS[a] || 0));

  const signals = sortedItems
    .slice(0, 5)
    .map((item) => SIGNAL_LABELS[item] || item);

  const themeCount: Record<string, number> = {};
  for (const item of allSelected) {
    const themes = THEME_MAP[item] || [];
    for (const theme of themes) {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    }
  }

  const themes = Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme);

  return { score: finalScore, level, signals, themes };
}

export function getScoreLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score <= 25) return "LOW";
  if (score <= 55) return "MEDIUM";
  return "HIGH";
}
