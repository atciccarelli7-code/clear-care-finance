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
    expect(result.hrQuestions).toHaveLength(5);
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
    expect(result.hsaGuidance).toContain(BENEFITS_LIMITS_2026.hsaSelfOnly.toLocaleString());
    expect(result.hsaGuidance).not.toContain("catch-up");
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
    expect(result.hsaGuidance).toContain("$1,000 HSA catch-up");
  });

  it("prioritizes flexibility signals for high-use regular care", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      healthcareUse: "high",
      regularCare: "yes",
      flexibility: "essential",
      hsaComfort: "no",
      costPreference: "predictable-costs",
    });

    expect(result.planArchetypes[0].id).toBe("ppo");
    expect(result.planArchetypes[0].reason).toContain("broad provider");
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
  });

  it("creates copy-friendly text with the educational guardrail", () => {
    const text = blueprintToText(buildBenefitsBlueprint(baseAnswers));

    expect(text).toContain("Healthcare Worker Benefits Blueprint");
    expect(text).toContain("Health-plan archetypes to compare");
    expect(text).toContain("Educational planning only");
  });
});
