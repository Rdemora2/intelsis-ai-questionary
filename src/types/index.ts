export interface ScanAnswers {
  processes: string[];
  operations: string[];
  documents: string[];
  communication: string[];
}

export interface ScanRequest {
  answers: ScanAnswers;
  problemText?: string;
  companySize: string;
  area: string;
}

export interface Automation {
  title: string;
  rationale: string;
  first_step: string;
  sap_solution: string;
}

export interface ScanResponse {
  id: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  signals: string[];
  automations: Automation[];
  impacts: string[];
  executiveSummary: string;
  requestId: string;
}

export interface LeadRequest {
  name: string;
  company: string;
  email: string;
  whatsapp?: string;
  consent: boolean;
  resultId: string;
}

export interface LLMInput {
  selectedPains: string[];
  companySize: string;
  area: string;
  problemText: string;
  // deterministic fallback data (used only when LLM is unavailable)
  _fallback: {
    score: number;
    level: string;
    signals: string[];
    themes: string[];
  };
}

export interface LLMOutput {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  signals: string[];
  automations: Automation[];
  impacts: string[];
  executive_summary: string;
}

export interface ScoringResult {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  signals: string[];
  themes: string[];
}

export const LEVEL_LABELS: Record<string, string> = {
  LOW: "Pontual",
  MEDIUM: "Moderado",
  HIGH: "Transformacional",
};

export const AREA_LABELS: Record<string, string> = {
  operations: "Operações",
  financial: "Financeiro",
  it: "TI",
  commercial: "Comercial",
  hr: "RH",
  other: "Outro",
};

export const COMPANY_SIZE_OPTIONS = [
  "1-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const;

export const AREA_OPTIONS = [
  "operations",
  "financial",
  "it",
  "commercial",
  "hr",
  "other",
] as const;

export const PROCESS_CHECKBOXES = [
  { value: "approvals", label: "Aprovações dependem de e-mail, papel ou mensagens informais" },
  { value: "key_people", label: "Processos críticos dependem de pessoas-chave sem substituto" },
  { value: "no_standards", label: "Falta padronização — cada área executa de forma diferente" },
  { value: "rework", label: "Retrabalho frequente por erros manuais ou dados incorretos" },
  { value: "redundant_steps", label: "Existem etapas redundantes ou revisões dispensáveis nos fluxos" },
] as const;

export const OPERATION_CHECKBOXES = [
  { value: "data_reentry", label: "Dados são redigitados manualmente entre sistemas" },
  { value: "spreadsheets", label: "Planilhas paralelas compensam o que o sistema não cobre" },
  { value: "no_integration", label: "Sistemas não se comunicam — falta integração entre eles" },
  { value: "data_inconsistency", label: "Informações desatualizadas ou divergentes entre áreas" },
] as const;

export const DOCUMENT_CHECKBOXES = [
  { value: "high_doc_volume", label: "Alto volume de documentos processados manualmente (NFs, contratos, pedidos)" },
  { value: "manual_routing", label: "Documentos são encaminhados ou arquivados manualmente entre áreas" },
  { value: "doc_loss", label: "Perda, duplicação ou dificuldade para localizar documentos" },
  { value: "compliance_difficulty", label: "Dificuldade em atender auditorias, fiscalizações ou exigências regulatórias" },
] as const;

export const COMMUNICATION_CHECKBOXES = [
  { value: "manual_comms", label: "Comunicação com clientes/fornecedores é manual (e-mail, telefone, WhatsApp)" },
  { value: "poor_tracking", label: "Difícil rastrear o status de solicitações internas ou de clientes" },
  { value: "repetitive_queries", label: "Equipe gasta tempo respondendo perguntas e demandas repetitivas" },
  { value: "slow_reports", label: "Relatórios gerenciais demoram horas ou dias para ficarem prontos" },
  { value: "no_realtime_data", label: "Decisões baseadas em intuição, sem dados em tempo real sobre a operação" },
] as const;
