import { z } from "zod";

const VALID_SAP_MODULES = [
  "sap-s4hana",
  "sap-s4hana-public",
  "sap-analytics",
  "sap-successfactors",
  "sap-ariba",
  "sap-concur",
  "sap-fieldglass",
  "sap-ehs",
  "sap-btp",
  "sap-joule",
] as const;

const VALID_COMPANY_SIZES = [
  "startup",
  "small",
  "medium",
  "large",
  "enterprise",
] as const;

const VALID_MOTIVATORS = ["purchase-process", "new-technologies"] as const;

const VALID_CHALLENGES = [
  "digital-transformation",
  "process-optimization",
  "data-analysis",
  "cloud-migration",
  "supply-chain",
  "talent-management",
  "health-safety-environment",
  "other",
] as const;

export const leadRequestSchema = z.object({
  fullName: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(20),
  jobTitle: z.string().min(2).max(100),
  companySize: z.enum(VALID_COMPANY_SIZES),
  motivator: z.enum(VALID_MOTIVATORS),
  sapModules: z.array(z.enum(VALID_SAP_MODULES)).min(1).max(10),
  challenges: z.enum(VALID_CHALLENGES),
  demoInterest: z.boolean(),
  techHelp: z.boolean(),
  techHelpText: z.string().max(500).optional().default(""),
  consent: z.literal(true),
});

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
