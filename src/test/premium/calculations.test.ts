import { describe, expect, it } from "vitest";
import {
  calculateAnnualCompensation,
  calculateBenefitValue,
  calculateHealthPlanScenarios,
  calculateProgress,
  calculateRetirementValue,
  calculateTransparentTradeoffScore,
  generateDecisionObservations,
} from "@/premium/calculations";
import { emptyWorkspaceState } from "@/premium/contracts";

describe("premium decision calculations", () => {
  it("separates base and conditional compensation", () => {
    const result = calculateAnnualCompensation({
      payType: "hourly",
      basePay: 40,
      annualHours: 2_000,
      overtimeHours: 100,
      overtimeMultiplier: 1.5,
      shiftDifferentialPerHour: 4,
      differentialHours: 500,
      bonus: 1_000,
      callPay: 2_000,
      weekendHolidayPay: 500,
    });
    expect(result.base).toBe(80_000);
    expect(result.overtime).toBe(6_000);
    expect(result.shiftDifferential).toBe(2_000);
    expect(result.conditional).toBe(11_500);
    expect(result.estimatedAnnualGross).toBe(91_500);
  });

  it("keeps known, estimated, unknown, and non-cash benefits distinct", () => {
    expect(calculateBenefitValue([
      { amount: 5_000, valueType: "known" },
      { amount: 2_000, valueType: "estimated", requiresVerification: true },
      { valueType: "unknown" },
      { valueType: "non-cash" },
    ])).toEqual({
      known: 5_000,
      estimated: 2_000,
      unknownCount: 1,
      nonCashCount: 1,
      verificationCount: 2,
    });
  });

  it("caps health-plan scenarios at entered out-of-pocket exposure", () => {
    const result = calculateHealthPlanScenarios({
      annualEmployeePremium: 2_400,
      deductible: 1_500,
      coinsurancePercent: 20,
      copays: 200,
      outOfPocketMaximum: 5_000,
      employerAccountContribution: 1_000,
      expectedAllowedCosts: 5_000,
    });
    expect(result.lowUse).toBe(1_600);
    expect(result.expectedUse).toBe(3_800);
    expect(result.highUse).toBe(6_400);
    expect(result.warning).toMatch(/do not determine official coverage/i);
  });

  it("distinguishes immediately vested and conditional retirement value", () => {
    const result = calculateRetirementValue({
      eligibleCompensation: 100_000,
      employeeContributionPercent: 6,
      matchPercent: 100,
      matchLimitPercent: 4,
      nonelectivePercent: 2,
      vestedPercent: 50,
      waitingPeriodMonths: 6,
    });
    expect(result.employerMatch).toBe(4_000);
    expect(result.nonelective).toBe(2_000);
    expect(result.annualEmployerValue).toBe(6_000);
    expect(result.immediatelyVestedValue).toBe(3_000);
    expect(result.conditionalUnvestedValue).toBe(3_000);
    expect(result.potentialForfeitureRisk).toBe(true);
  });

  it("shows the subjective score formula and progress denominator", () => {
    const score = calculateTransparentTradeoffScore([
      { id: "schedule", importance: 5, optionA: 4, optionB: 2 },
      { id: "career", importance: 1, optionA: 2, optionB: 5 },
    ]);
    expect(score.optionA).toBeCloseTo(22 / 6);
    expect(score.optionB).toBeCloseTo(15 / 6);
    expect(score.formula).toMatch(/organizing aid/i);
    expect(calculateProgress(["define-decision", "compare-compensation"])).toBe(25);
  });

  it("generates transparent incomplete-state observations", () => {
    const state = emptyWorkspaceState();
    state.answers["define-decision.shared.deadline"] = "unknown";
    const observations = generateDecisionObservations(state);
    expect(observations.some((item) => item.text.includes("need verification"))).toBe(true);
    expect(observations.some((item) => item.text.includes("No final"))).toBe(true);
  });
});
