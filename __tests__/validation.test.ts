import { describe, it, expect } from "vitest";
import { scanRequestSchema, leadRequestSchema, llmOutputSchema } from "@/lib/validation";

describe("scanRequestSchema", () => {
  const validBase = {
    name: "João Silva",
    company: "Empresa XYZ",
    email: "joao@empresa.com",
    lgpdConsent: true as const,
  };

  it("accepts valid input", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: ["approvals", "rework"],
        operations: ["data_reentry"],
        documents: [],
        communication: ["slow_reports"],
      },
      problemText: "Temos problemas com retrabalho",
      companySize: "51-200",
      area: "operations",
      ...validBase,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty optional problemText", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: [],
        operations: [],
        documents: [],
        communication: [],
      },
      companySize: "1-50",
      area: "it",
      ...validBase,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid process values", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: ["invalid_value"],
        operations: [],
        documents: [],
        communication: [],
      },
      companySize: "1-50",
      area: "it",
      ...validBase,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid company size", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: [],
        operations: [],
        documents: [],
        communication: [],
      },
      companySize: "10000",
      area: "it",
      ...validBase,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid area", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: [],
        operations: [],
        documents: [],
        communication: [],
      },
      companySize: "1-50",
      area: "invalid",
      ...validBase,
    });
    expect(result.success).toBe(false);
  });

  it("truncates problemText at 500 chars", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: [],
        operations: [],
        documents: [],
        communication: [],
      },
      problemText: "a".repeat(501),
      companySize: "1-50",
      area: "it",
      ...validBase,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing companySize", () => {
    const result = scanRequestSchema.safeParse({
      answers: {
        processes: [],
        operations: [],
        documents: [],
        communication: [],
      },
      area: "it",
      ...validBase,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = scanRequestSchema.safeParse({
      answers: { processes: [], operations: [], documents: [], communication: [] },
      companySize: "1-50",
      area: "it",
      company: "Test",
      email: "a@b.com",
      lgpdConsent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects lgpdConsent=false", () => {
    const result = scanRequestSchema.safeParse({
      answers: { processes: [], operations: [], documents: [], communication: [] },
      companySize: "1-50",
      area: "it",
      name: "Ana",
      company: "Test",
      email: "ana@test.com",
      lgpdConsent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email in scan", () => {
    const result = scanRequestSchema.safeParse({
      answers: { processes: [], operations: [], documents: [], communication: [] },
      companySize: "1-50",
      area: "it",
      name: "Ana",
      company: "Test",
      email: "not-an-email",
      lgpdConsent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("leadRequestSchema", () => {
  it("accepts valid lead", () => {
    const result = leadRequestSchema.safeParse({
      name: "João Silva",
      company: "Empresa XYZ",
      email: "joao@empresa.com",
      whatsapp: "11999999999",
      consent: true,
      resultId: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts lead without whatsapp", () => {
    const result = leadRequestSchema.safeParse({
      name: "Maria",
      company: "ACME",
      email: "maria@acme.com",
      consent: true,
      resultId: "def456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects consent=false", () => {
    const result = leadRequestSchema.safeParse({
      name: "Ana",
      company: "Test",
      email: "ana@test.com",
      consent: false,
      resultId: "xyz",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = leadRequestSchema.safeParse({
      name: "Pedro",
      company: "Test",
      email: "not-an-email",
      consent: true,
      resultId: "xyz",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = leadRequestSchema.safeParse({
      name: "A",
      company: "Test",
      email: "a@test.com",
      consent: true,
      resultId: "xyz",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing resultId", () => {
    const result = leadRequestSchema.safeParse({
      name: "Ana",
      company: "Test",
      email: "ana@test.com",
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("llmOutputSchema", () => {
  it("accepts valid LLM output", () => {
    const result = llmOutputSchema.safeParse({
      score: 65,
      level: "HIGH",
      signals: ["Signal 1", "Signal 2"],
      automations: [
        { title: "Auto 1", rationale: "Reason 1", first_step: "Step 1", sap_solution: "SAP Build Process Automation" },
        { title: "Auto 2", rationale: "Reason 2", first_step: "Step 2", sap_solution: "SAP Integration Suite" },
        { title: "Auto 3", rationale: "Reason 3", first_step: "Step 3", sap_solution: "SAP Analytics Cloud" },
      ],
      impacts: ["Impact 1", "Impact 2", "Impact 3"],
      executive_summary: "Summary text here.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects too few automations", () => {
    const result = llmOutputSchema.safeParse({
      score: 40,
      level: "MEDIUM",
      signals: ["Signal 1", "Signal 2"],
      automations: [
        { title: "Auto 1", rationale: "Reason 1", first_step: "Step 1", sap_solution: "SAP Signavio" },
      ],
      impacts: ["Impact 1", "Impact 2"],
      executive_summary: "Summary.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too few signals", () => {
    const result = llmOutputSchema.safeParse({
      score: 30,
      level: "MEDIUM",
      signals: ["Only one"],
      automations: [
        { title: "A1", rationale: "R1", first_step: "S1", sap_solution: "SAP Build Process Automation" },
        { title: "A2", rationale: "R2", first_step: "S2", sap_solution: "SAP Integration Suite" },
        { title: "A3", rationale: "R3", first_step: "S3", sap_solution: "SAP Analytics Cloud" },
      ],
      impacts: ["I1", "I2"],
      executive_summary: "Summary.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing executive_summary", () => {
    const result = llmOutputSchema.safeParse({
      signals: ["S1", "S2"],
      automations: [
        { title: "A1", rationale: "R1", first_step: "S1", sap_solution: "SAP Build Process Automation" },
        { title: "A2", rationale: "R2", first_step: "S2", sap_solution: "SAP Integration Suite" },
        { title: "A3", rationale: "R3", first_step: "S3", sap_solution: "SAP Analytics Cloud" },
      ],
      impacts: ["I1", "I2"],
    });
    expect(result.success).toBe(false);
  });
});
