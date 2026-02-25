import type { LLMInput, LLMOutput } from "@/types";

const THEME_AUTOMATIONS: Record<string, { title: string; rationale: string; first_step: string; sap_solution: string }> = {
  approvals: {
    title: "Automação de workflows de aprovação",
    rationale: "Fluxos de aprovação manuais representam uma excelente oportunidade de ganho de agilidade, com rastreabilidade completa e escalonamento automático",
    first_step: "Mapear os 3 fluxos de aprovação mais frequentes e configurar regras de escalonamento automático com notificações em tempo real",
    sap_solution: "SAP Build Process Automation",
  },
  document_processing: {
    title: "Gestão documental inteligente com rastreabilidade",
    rationale: "A digitalização do ciclo documental pode trazer ganhos expressivos de rastreabilidade, conformidade e velocidade de acesso à informação",
    first_step: "Catalogar os tipos documentais mais recorrentes (NFs, contratos, pedidos) e implementar captura digital com indexação automática e controle de versão",
    sap_solution: "SAP Document Management",
  },
  reporting: {
    title: "Dashboards e relatórios em tempo real",
    rationale: "Relatórios automatizados e dashboards interativos permitem decisões mais rápidas e baseadas em dados sempre atualizados",
    first_step: "Identificar os 5 relatórios gerenciais mais solicitados e criar dashboards interativos com atualização automática e alertas inteligentes",
    sap_solution: "SAP Analytics Cloud",
  },
  integration: {
    title: "Integração entre sistemas e eliminação de redigitação",
    rationale: "Conectar os sistemas da empresa via API reduz significativamente o esforço manual e garante consistência dos dados entre plataformas",
    first_step: "Listar os sistemas que trocam dados manualmente, priorizar as integrações por volume e criticidade, e implementar conectores via API",
    sap_solution: "SAP Integration Suite",
  },
  master_data_quality: {
    title: "Governança e padronização de dados mestres",
    rationale: "Dados mestres bem governados são a base para relatórios confiáveis, processos fluidos e decisões seguras em toda a organização",
    first_step: "Definir regras de validação para os campos mais críticos (clientes, materiais, centros de custo) e implementar checagem automática na entrada de dados",
    sap_solution: "SAP Master Data Governance",
  },
  customer_service: {
    title: "Central de solicitações com rastreamento inteligente",
    rationale: "Um portal centralizado de atendimento com SLA e notificações automáticas eleva a experiência de clientes e áreas internas",
    first_step: "Implementar portal de solicitações com status em tempo real, SLA configurável e notificações automáticas para clientes e responsáveis",
    sap_solution: "SAP Service Cloud",
  },
  process_optimization: {
    title: "Mapeamento e redesenho de processos críticos",
    rationale: "O mapeamento estruturado dos processos atuais revela oportunidades de simplificação, padronização e automação com impacto direto na produtividade",
    first_step: "Mapear os 3 processos mais críticos com process mining, identificar oportunidades de simplificação e documentar procedimentos padrão otimizados",
    sap_solution: "SAP Signavio",
  },
  ai_assistants: {
    title: "Assistente de IA para demandas repetitivas",
    rationale: "Automatizar respostas e demandas recorrentes libera o time para focar em atividades de maior valor estratégico e analítico",
    first_step: "Catalogar as 20 perguntas e solicitações mais frequentes e implementar um assistente inteligente com acesso à base de conhecimento corporativa",
    sap_solution: "SAP Business AI (Joule)",
  },
};

const FALLBACK_IMPACTS: Record<string, string[]> = {
  LOW: [
    "Ganho de agilidade nos processos identificados com automações de rápida implementação",
    "Maior visibilidade sobre o status das operações via dashboards integrados",
    "Liberação de tempo da equipe para atividades de maior valor estratégico",
  ],
  MEDIUM: [
    "Aceleração significativa de processos manuais com automação inteligente",
    "Maior rastreabilidade e governança operacional via plataforma integrada SAP",
    "Liberação de capacidade da equipe para atividades estratégicas e analíticas",
  ],
  HIGH: [
    "Aceleração expressiva de processos-chave com workflows automatizados e integração entre sistemas",
    "Evolução da gestão documental, de aprovações e de dados mestres com ganho mensurável de produtividade",
    "Fortalecimento da operação com processos mais resilientes, padronizados e escaláveis",
  ],
};

const FALLBACK_SUMMARIES: Record<string, string> = {
  LOW: "A análise identificou oportunidades pontuais de automação que podem trazer ganhos rápidos com soluções SAP de implementação ágil. Recomendamos priorizar as áreas identificadas para iniciar a jornada de evolução digital.",
  MEDIUM: "O diagnóstico revelou um conjunto relevante de oportunidades de automação com alto potencial de ganho. As soluções SAP recomendadas podem gerar resultados expressivos de produtividade em curto prazo, com retorno visível já nas primeiras semanas.",
  HIGH: "A operação apresenta um cenário muito favorável para transformação digital, com múltiplos processos que se beneficiariam de automação e integração. A implementação das soluções SAP recomendadas pode elevar significativamente a produtividade e a capacidade de escala do negócio.",
};

export function generateFallback(input: LLMInput): LLMOutput {
  const fb = input._fallback;

  const automations = fb.themes
    .slice(0, 5)
    .map((theme) => THEME_AUTOMATIONS[theme])
    .filter(Boolean);

  while (automations.length < 3) {
    const remaining = Object.entries(THEME_AUTOMATIONS).find(
      ([key]) => !fb.themes.includes(key) && !automations.find((a) => a.title === THEME_AUTOMATIONS[key].title)
    );
    if (remaining) {
      automations.push(remaining[1]);
    } else {
      break;
    }
  }

  return {
    score: fb.score,
    level: fb.level as "LOW" | "MEDIUM" | "HIGH",
    signals: fb.signals.slice(0, 5),
    automations,
    impacts: FALLBACK_IMPACTS[fb.level] || FALLBACK_IMPACTS.MEDIUM,
    executive_summary: FALLBACK_SUMMARIES[fb.level] || FALLBACK_SUMMARIES.MEDIUM,
  };
}
