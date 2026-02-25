import { describe, it, expect } from "vitest";
import { calculateScore, getScoreLevel } from "@/lib/scoring";

describe("calculateScore", () => {
  it("returns score 0 and LOW for empty answers", () => {
    const result = calculateScore({
      processes: [],
      operations: [],
      documents: [],
      communication: [],
    });
    expect(result.score).toBe(0);
    expect(result.level).toBe("LOW");
    expect(result.signals).toHaveLength(0);
    expect(result.themes).toHaveLength(0);
  });

  it("returns HIGH for all checkboxes selected", () => {
    const result = calculateScore({
      processes: ["approvals", "rework", "key_people", "no_standards", "redundant_steps"],
      operations: ["data_reentry", "spreadsheets", "no_integration", "data_inconsistency"],
      documents: ["high_doc_volume", "manual_routing", "compliance_difficulty", "doc_loss"],
      communication: ["manual_comms", "poor_tracking", "repetitive_queries", "slow_reports", "no_realtime_data"],
    });
    expect(result.score).toBe(100);
    expect(result.level).toBe("HIGH");
    expect(result.signals.length).toBeLessThanOrEqual(5);
    expect(result.themes.length).toBeGreaterThan(0);
  });

  it("returns MEDIUM for moderate selection", () => {
    const result = calculateScore({
      processes: ["rework", "approvals", "key_people"],
      operations: ["data_reentry", "spreadsheets"],
      documents: [],
      communication: [],
    });
    expect(result.score).toBeGreaterThan(25);
    expect(result.score).toBeLessThanOrEqual(55);
    expect(result.level).toBe("MEDIUM");
  });

  it("applies company size multiplier", () => {
    const answers = {
      processes: ["approvals", "rework"],
      operations: ["data_reentry"],
      documents: [],
      communication: [],
    };
    const small = calculateScore(answers, "", "1-50");
    const large = calculateScore(answers, "", "1000+");
    expect(large.score).toBeGreaterThan(small.score);
  });

  it("includes keyword bonus from problem text", () => {
    const withoutText = calculateScore({
      processes: ["approvals"],
      operations: [],
      documents: [],
      communication: [],
    });
    const withText = calculateScore(
      { processes: ["approvals"], operations: [], documents: [], communication: [] },
      "temos muito retrabalho e demora nos processos manuais"
    );
    expect(withText.score).toBeGreaterThan(withoutText.score);
  });

  it("caps keyword bonus at 10", () => {
    const base = calculateScore({
      processes: ["approvals"],
      operations: [],
      documents: [],
      communication: [],
    });
    const boosted = calculateScore(
      { processes: ["approvals"], operations: [], documents: [], communication: [] },
      "retrabalho manual lento demora planilha erro duplica perda atraso gargalo papel email"
    );
    expect(boosted.score - base.score).toBeLessThanOrEqual(10);
  });

  it("caps total score at 100", () => {
    const result = calculateScore(
      {
        processes: ["approvals", "rework", "key_people", "no_standards", "redundant_steps"],
        operations: ["data_reentry", "spreadsheets", "no_integration", "data_inconsistency"],
        documents: ["high_doc_volume", "manual_routing", "compliance_difficulty", "doc_loss"],
        communication: ["manual_comms", "poor_tracking", "repetitive_queries", "slow_reports", "no_realtime_data"],
      },
      "retrabalho manual lento demora planilha erro"
    );
    expect(result.score).toBe(100);
  });

  it("returns correct themes for selected items", () => {
    const result = calculateScore({
      processes: ["approvals"],
      operations: [],
      documents: ["high_doc_volume", "manual_routing"],
      communication: ["slow_reports"],
    });
    expect(result.themes).toContain("approvals");
    expect(result.themes).toContain("reporting");
    expect(result.themes).toContain("document_processing");
  });

  it("sorts themes by frequency", () => {
    const result = calculateScore({
      processes: [],
      operations: [],
      documents: ["high_doc_volume", "manual_routing", "compliance_difficulty", "doc_loss"],
      communication: [],
    });
    expect(result.themes[0]).toBe("document_processing");
  });

  it("sorts signals by weight descending", () => {
    const result = calculateScore({
      processes: ["approvals", "rework"],
      operations: [],
      documents: [],
      communication: [],
    });
    expect(result.signals[0]).toContain("retrabalho");
    expect(result.signals[1]).toContain("aprovação");
  });
});

describe("getScoreLevel", () => {
  it("returns LOW for 0-25", () => {
    expect(getScoreLevel(0)).toBe("LOW");
    expect(getScoreLevel(25)).toBe("LOW");
  });

  it("returns MEDIUM for 26-55", () => {
    expect(getScoreLevel(26)).toBe("MEDIUM");
    expect(getScoreLevel(55)).toBe("MEDIUM");
  });

  it("returns HIGH for 56-100", () => {
    expect(getScoreLevel(56)).toBe("HIGH");
    expect(getScoreLevel(100)).toBe("HIGH");
  });
});
