import { describe, expect, it } from "vitest";
import {
  BENEFITS_LIMITS_2026,
  blueprintToText,
  buildBenefitsBlueprint,
  type BenefitsBlueprintAnswers,
} from "@/lib/benefitsBlueprint";

const baseAnswers: BenefitsBlueprintAnswers = {
  age: 30,
  targetRetirementAge: 65,
  payRange: "75-100",
  savingPriority: "balanced",
  riskTolerance: "moderate",
  costPreference: "balanced",
  healthcareUse: "moderate",
  regularCare: "no",
  flexibility: "helpful",
  hsaComfort: "maybe",
  coverageTier: "employee",
  employerMatch: "yes",
};

describe("buildBenefitsBlueprint", () => {
  it("produces a balanced planning range and match-first reminder", () => {
    const result = buildBenefitsBlueprint(baseAnswers);

    expect(result.contributionRange).toEqual({ minimum: 6, maximum: 10 });
    expect(result.approximateAnnualRange).toEqual({ minimum: 5_250, maximum: 8_750 });
    expect(result.matchReminder).toContain("full available match");
    expect(result.matchReminder).toContain("catch-up contributions apply only");
    expect(result.hrQuestions).toHaveLength(5);
    expect(result.hrQuestions[0]).toContain("15-year service catch-up");
  });

  it("moves an accelerated, shorter-horizon scenario higher without exceeding the guardrail", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      age: 50,
      targetRetirementAge: 62,
      savingPriority: "accelerate",
      riskTolerance: "growth",
      healthcareUse: "low",
      hsaComfort: "yes",
      costPreference: "lower-deductions",
    });

    expect(result.contributionRange).toEqual({ minimum: 13, maximum: 18 });
    expect(result.planArchetypes[0].id).toBe("hdhp-hsa");
    expect(result.planArchetypes[0].fitLabel).toBe("First archetype to inspect");
    expect(result.hsaGuidance).toContain(BENEFITS_LIMITS_2026.hsaSelfOnly.toLocaleString());
    expect(result.hsaGuidance).not.toContain("Medicare enrollment");
  });

  it("applies age-based 2026 catch-up limits without letting the annual estimate exceed them", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      age: 60,
      targetRetirementAge: 70,
      payRange: "150-plus",
      savingPriority: "accelerate",
      healthcareUse: "low",
      hsaComfort: "yes",
    });

    expect(result.applicableRetirementLimit).toBe(35_750);
    expect(result.approximateAnnualRange?.maximum).toBeLessThanOrEqual(35_750);
    expect(result.hsaGuidance).toContain("additional $1,000");
    expect(result.hsaGuidance).toContain("Medicare enrollment generally ends HSA contribution eligibility");
  });

  it("labels equal leading plan scores as a tie instead of manufacturing a winner", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      healthcareUse: "high",
      regularCare: "yes",
      flexibility: "not-sure",
      hsaComfort: "no",
      costPreference: "predictable-costs",
    });

    expect(result.planArchetypes[0].id).toBe("ppo");
    expect(result.planArchetypes[1].id).toBe("hmo");
    expect(result.planArchetypes[0].fitLabel).toBe("Top fit signal (tie)");
    expect(result.planArchetypes[1].fitLabel).toBe("Top fit signal (tie)");
    expect(result.planArchetypes[0].reason).toContain("higher healthcare use");
    expect(result.hsaGuidance).toContain("Compare the HSA option carefully");
  });

  it("turns unknown answers into verification steps instead of false certainty", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      payRange: "not-sure",
      savingPriority: "not-sure",
      riskTolerance: "not-sure",
      costPreference: "not-sure",
      healthcareUse: "not-sure",
      regularCare: "not-sure",
      flexibility: "not-sure",
      hsaComfort: "not-sure",
      coverageTier: "not-sure",
      employerMatch: "not-sure",
    });

    expect(result.approximateAnnualRange).toBeNull();
    expect(result.matchReminder).toContain("unresolved");
    expect(result.coverageTier).toContain("confirmed");
    expect(result.hsaGuidance).toContain("uncertain");
    expect(result.planArchetypes.every((plan) => plan.reason.includes("do not strongly favor"))).toBe(true);
    expect(result.planArchetypes.every((plan) => plan.fitLabel === "No clear fit signal")).toBe(true);
  });

  it("creates copy-friendly text with the educational guardrail", () => {
    const text = blueprintToText(buildBenefitsBlueprint(baseAnswers));

    expect(text).toContain("Healthcare Worker Benefits Blueprint");
    expect(text).toContain("Potential 2026 employee elective-deferral limit");
    expect(text).toContain("Health-plan archetypes to compare");
    expect(text).toContain("Educational planning only");
  });
});
