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
  emergencyFund: "three-plus-months",
  highInterestDebt: "no",
  taxPriority: "balanced",
  protectionReview: "current",
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
    expect(result.priorityActions[0].id).toBe("match");
    expect(result.priorityActions.map((action) => action.id)).not.toContain("foundation");
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
      emergencyFund: "not-sure",
      highInterestDebt: "not-sure",
      taxPriority: "not-sure",
      protectionReview: "not-sure",
    });

    expect(result.approximateAnnualRange).toBeNull();
    expect(result.matchReminder).toContain("unresolved");
    expect(result.coverageTier).toContain("confirmed");
    expect(result.hsaGuidance).toContain("uncertain");
    expect(result.planArchetypes.every((plan) => plan.reason.includes("do not strongly favor"))).toBe(true);
    expect(result.planArchetypes.every((plan) => plan.fitLabel === "No clear fit signal")).toBe(true);
    expect(result.priorityActions.map((action) => action.id)).toContain("foundation");
    expect(result.priorityActions.map((action) => action.id)).toContain("protection");
  });

  it("prioritizes cash reserves and high-interest debt after the match decision", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      emergencyFund: "under-one-month",
      highInterestDebt: "yes",
      protectionReview: "needs-review",
    });

    expect(result.priorityActions.slice(0, 3).map((action) => action.id)).toEqual(["match", "foundation", "plan-math"]);
    expect(result.priorityActions.find((action) => action.id === "foundation")?.reason).toContain("High-interest debt");
    expect(result.priorityActions.map((action) => action.id)).toContain("protection");
  });

  it("qualifies the 2026 Roth catch-up rule when the broad pay and age signals overlap", () => {
    const result = buildBenefitsBlueprint({
      ...baseAnswers,
      age: 55,
      targetRetirementAge: 67,
      payRange: "150-plus",
      taxPriority: "lower-current-tax",
    });

    expect(result.taxGuidance).toContain("prior-year wages from the plan sponsor exceeded $150,000");
    expect(result.taxGuidance).toContain("broad pay range cannot determine");
  });

  it("creates copy-friendly text with the educational guardrail", () => {
    const text = blueprintToText(buildBenefitsBlueprint(baseAnswers));

    expect(text).toContain("Healthcare Worker Benefits Blueprint");
    expect(text).toContain("Potential 2026 employee elective-deferral limit");
    expect(text).toContain("Health-plan archetypes to compare");
    expect(text).toContain("Prioritized action plan");
    expect(text).toContain("Educational planning only");
  });
});
