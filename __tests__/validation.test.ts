import { describe, it, expect } from "vitest";
import { leadRequestSchema } from "@/lib/validation";

describe("leadRequestSchema", () => {
  const validLead = {
    fullName: "João Silva",
    company: "Empresa XYZ",
    email: "joao@empresa.com",
    phone: "11999999999",
    jobTitle: "Diretor de TI",
    companySize: "medium" as const,
    motivator: "new-technologies" as const,
    sapModules: ["sap-s4hana", "sap-analytics"],
    challenges: "digital-transformation" as const,
    demoInterest: true,
    techHelp: false,
    consent: true as const,
  };

  it("accepts valid lead", () => {
    const result = leadRequestSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("rejects consent=false", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short fullName", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      fullName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short phone", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      phone: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid companySize", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      companySize: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid motivator", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      motivator: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty sapModules", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      sapModules: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid sapModule value", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      sapModules: ["invalid-module"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid challenges", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      challenges: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing jobTitle", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      jobTitle: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid company sizes", () => {
    for (const size of ["startup", "small", "medium", "large", "enterprise"]) {
      const result = leadRequestSchema.safeParse({
        ...validLead,
        companySize: size,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid challenges", () => {
    for (const challenge of [
      "digital-transformation",
      "process-optimization",
      "data-analysis",
      "cloud-migration",
      "supply-chain",
      "talent-management",
      "health-safety-environment",
      "other",
    ]) {
      const result = leadRequestSchema.safeParse({
        ...validLead,
        challenges: challenge,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts techHelpText when techHelp is true", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      techHelp: true,
      techHelpText: "Preciso de ajuda com infraestrutura de rede",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty techHelpText", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      techHelp: false,
      techHelpText: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects techHelpText longer than 500 chars", () => {
    const result = leadRequestSchema.safeParse({
      ...validLead,
      techHelp: true,
      techHelpText: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("defaults techHelpText to empty string when omitted", () => {
    const result = leadRequestSchema.safeParse(validLead);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.techHelpText).toBe("");
    }
  });

  it("accepts all valid SAP modules", () => {
    for (const mod of [
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
    ]) {
      const result = leadRequestSchema.safeParse({
        ...validLead,
        sapModules: [mod],
      });
      expect(result.success).toBe(true);
    }
  });
});
