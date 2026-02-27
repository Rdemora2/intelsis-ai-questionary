export interface LeadFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  companySize: string;
  motivator: string;
  sapModules: string[];
  challenges: string;
  demoInterest: boolean;
  techHelp: boolean;
  techHelpText: string;
}

export interface LeadRequest extends LeadFormData {
  consent: boolean;
}

export const SAP_MODULES = [
  { id: "sap-s4hana", label: "SAP S/4HANA" },
  { id: "sap-s4hana-public", label: "SAP S/4HANA Public Edition" },
  { id: "sap-analytics", label: "SAP Analytics Cloud" },
  { id: "sap-successfactors", label: "SAP SuccessFactors" },
  { id: "sap-ariba", label: "SAP Ariba" },
  { id: "sap-concur", label: "SAP Concur" },
  { id: "sap-fieldglass", label: "SAP Fieldglass" },
  { id: "sap-ehs", label: "SAP EHS" },
  { id: "sap-btp", label: "SAP BTP" },
  { id: "sap-joule", label: "Inteligência Artificial (Joule)" },
] as const;

export const COMPANY_SIZES = [
  { value: "startup", label: "Startup (1-50 funcionários)" },
  { value: "small", label: "Pequena (51-200 funcionários)" },
  { value: "medium", label: "Média (201-1000 funcionários)" },
  { value: "large", label: "Grande (1001-5000 funcionários)" },
  { value: "enterprise", label: "Corporação (5000+ funcionários)" },
] as const;

export const MOTIVATORS = [
  {
    value: "purchase-process",
    label: "Estou em processo de compra de uma solução SAP",
  },
  {
    value: "new-technologies",
    label: "Tenho interesse nas novas tecnologias da SAP",
  },
] as const;

export const CHALLENGES = [
  { value: "digital-transformation", label: "Transformação Digital" },
  { value: "process-optimization", label: "Otimização de Processos" },
  { value: "data-analysis", label: "Análise de Dados" },
  { value: "cloud-migration", label: "Migração para Nuvem" },
  { value: "supply-chain", label: "Gestão da Cadeia de Suprimentos" },
  { value: "talent-management", label: "Gestão de Talentos" },
  {
    value: "health-safety-environment",
    label: "Gestão de Saúde, Segurança e Meio Ambiente",
  },
  { value: "other", label: "Outro" },
] as const;

export const COMPANY_SIZE_LABELS: Record<string, string> = {
  startup: "Startup (1-50)",
  small: "Pequena (51-200)",
  medium: "Média (201-1000)",
  large: "Grande (1001-5000)",
  enterprise: "Corporação (5000+)",
};

export const MOTIVATOR_LABELS: Record<string, string> = {
  "purchase-process": "Processo de compra SAP",
  "new-technologies": "Interesse em novas tecnologias",
};

export const CHALLENGE_LABELS: Record<string, string> = {
  "digital-transformation": "Transformação Digital",
  "process-optimization": "Otimização de Processos",
  "data-analysis": "Análise de Dados",
  "cloud-migration": "Migração para Nuvem",
  "supply-chain": "Gestão da Cadeia de Suprimentos",
  "talent-management": "Gestão de Talentos",
  "health-safety-environment": "Saúde, Segurança e Meio Ambiente",
  other: "Outro",
};
