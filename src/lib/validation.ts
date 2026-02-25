import { z } from "zod";

const VALID_PROCESS_VALUES = [
  "approvals",
  "key_people",
  "no_standards",
  "rework",
  "redundant_steps",
] as const;

const VALID_OPERATION_VALUES = [
  "data_reentry",
  "spreadsheets",
  "no_integration",
  "data_inconsistency",
] as const;

const VALID_DOCUMENT_VALUES = [
  "high_doc_volume",
  "manual_routing",
  "doc_loss",
  "compliance_difficulty",
] as const;

const VALID_COMMUNICATION_VALUES = [
  "manual_comms",
  "poor_tracking",
  "repetitive_queries",
  "slow_reports",
  "no_realtime_data",
] as const;

export const scanRequestSchema = z.object({
  answers: z.object({
    processes: z.array(z.enum(VALID_PROCESS_VALUES)).max(5),
    operations: z.array(z.enum(VALID_OPERATION_VALUES)).max(4),
    documents: z.array(z.enum(VALID_DOCUMENT_VALUES)).max(4),
    communication: z.array(z.enum(VALID_COMMUNICATION_VALUES)).max(5),
  }),
  problemText: z.string().max(500).optional().default(""),
  companySize: z.enum(["1-50", "51-200", "201-500", "501-1000", "1000+"]),
  area: z.enum(["operations", "financial", "it", "commercial", "hr", "other"]),
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  email: z.string().email().max(200),
  lgpdConsent: z.literal(true),
});

export const leadRequestSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  email: z.string().email().max(200),
  whatsapp: z.string().max(20).optional().default(""),
  consent: z.literal(true),
  resultId: z.string().min(1).max(50),
});

export const llmOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  signals: z.array(z.string().max(200)).min(2).max(5),
  automations: z
    .array(
      z.object({
        title: z.string().max(100),
        rationale: z.string().max(300),
        first_step: z.string().max(300),
        sap_solution: z.string().max(100),
      }),
    )
    .min(3)
    .max(5),
  impacts: z.array(z.string().max(200)).min(2).max(4),
  executive_summary: z.string().max(1000),
});

export type ScanRequestInput = z.infer<typeof scanRequestSchema>;
export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
export type LLMOutputValidated = z.infer<typeof llmOutputSchema>;
