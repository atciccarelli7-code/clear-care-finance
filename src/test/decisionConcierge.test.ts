import { describe, expect, it } from "vitest";
import { CONCIERGE_PROBLEM_OPTIONS, CONCIERGE_ROUTING_MAP, getConciergeResult, validateConciergeRoutingMap } from "@/lib/decisionConcierge";

describe("One-Minute Decision Concierge routing", () => {
  it("references only known canonical journeys, destinations, and My Plan actions", () => {
    expect(validateConciergeRoutingMap()).toEqual([]);
  });

  it("keeps every input fixed-choice and every category mapped", () => {
    expect(CONCIERGE_PROBLEM_OPTIONS).toHaveLength(13);
    expect(Object.keys(CONCIERGE_ROUTING_MAP).sort()).toEqual(CONCIERGE_PROBLEM_OPTIONS.map((option) => option.id).sort());
    expect(CONCIERGE_PROBLEM_OPTIONS.every((option) => /^[a-z_]+$/.test(option.id))).toBe(true);
  });

  it("produces a safe fallback for incomplete input", () => {
    const result = getConciergeResult({});
    expect(result.problem).toBe("not_sure");
    expect(result.destinationPath).toBe("/start-here");
  });

  it("makes benefits routing deadline-sensitive without inventing a new destination", () => {
    const result = getConciergeResult({ problem: "open_enrollment_changes", timing: "today" });
    expect(result.deadlineSensitive).toBe(true);
    expect(result.reason).toContain("controlling enrollment deadline");
    expect(result.destinationPath).toBe("/tools/benefits-change-detector");
  });

  it("routes an uncertain patient or caregiver directly into the canonical hospital guide", () => {
    const result = getConciergeResult({ problem: "not_sure", audience: "patient_caregiver" });
    expect(result.problem).toBe("help_family");
    expect(result.label).toBe("Hospital & Patient Guide");
    expect(result.destinationPath).toBe("/patients-families/hospital-guide");
  });
});
