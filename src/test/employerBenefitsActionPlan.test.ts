import { describe, expect, it } from "vitest";
import {
  BENEFIT_LIMITS_2026,
  calculateAnnualPay,
  calculateEmployerBenefitsActionPlan,
  type EmployerBenefitsInput,
} from "@/lib/employerBenefitsActionPlan";

const baseInput = (): EmployerBenefitsInput => ({
  pay: { basis: "salary", annualSalary: 80_000, hourlyRate: null, hoursPerWeek: null, frequency: "biweekly" },
  retirement: {
    planType: "403b",
    employeeContributionPercent: 6,
    matchType: "percent-of-contribution",
    matchRatePercent: 50,
    matchCeilingPercent: 6,
    vestingStatus: "fully-vested",
    taxTreatment: "traditional",
  },
  health: {
    premiumPerPaycheck: 120,
    deductible: 2_000,
    outOfPocketMaximum: 6_000,
    copayOrCoinsurance: "$30 primary care",
    coverageTier: "employee",
    hsaEligible: "yes",
    networkType: "hdhp",
  },
  hsa: { employeeAnnualContribution: 3_400, employerAnnualContribution: 1_000, coverage: "self-only" },
});

describe("employer benefits calculations", () => {
  it("calculates salaried pay, per-check contributions, and a common partial match", () => {
    const plan = calculateEmployerBenefitsActionPlan(baseInput());
    expect(plan.annualPay).toBe(80_000);
    expect(plan.retirement.employeeAnnual).toBe(4_800);
    expect(plan.retirement.employeePerPaycheck).toBeCloseTo(184.62, 2);
    expect(plan.retirement.estimatedEmployerMatch).toBe(2_400);
    expect(plan.retirement.capturesStatedMatch).toBe(true);
    expect(plan.knownAnnualEmployerValue).toBe(3_400);
  });

  it("annualizes hourly pay and identifies an uncaptured dollar-for-dollar match", () => {
    const input = baseInput();
    input.pay = { basis: "hourly", annualSalary: null, hourlyRate: 35, hoursPerWeek: 36, frequency: "weekly" };
    input.retirement.employeeContributionPercent = 3;
    input.retirement.matchRatePercent = 100;
    input.retirement.matchCeilingPercent = 6;
    const plan = calculateEmployerBenefitsActionPlan(input);
    expect(calculateAnnualPay(input.pay)).toBe(65_520);
    expect(plan.retirement.employeePerPaycheck).toBeCloseTo(37.8, 2);
    expect(plan.retirement.estimatedEmployerMatch).toBeCloseTo(1_965.6, 2);
    expect(plan.retirement.capturesStatedMatch).toBe(false);
    expect(plan.doThisFirst).toContain("capture the stated full employer match");
  });

  it("turns unknown match information into a verification step instead of false precision", () => {
    const input = baseInput();
    input.retirement.matchType = "not-sure";
    input.retirement.matchRatePercent = null;
    input.retirement.matchCeilingPercent = null;
    const plan = calculateEmployerBenefitsActionPlan(input);
    expect(plan.retirement.estimatedEmployerMatch).toBeNull();
    expect(plan.retirement.capturesStatedMatch).toBeNull();
    expect(plan.retirement.missing).toContain("employer match formula");
    expect(plan.questionsForHr.join(" ")).toContain("exact employer match formula");
  });

  it("uses both employee and employer HSA contributions for self-only and family limits", () => {
    const selfOnly = calculateEmployerBenefitsActionPlan(baseInput());
    expect(selfOnly.hsa.limit).toBe(BENEFIT_LIMITS_2026.hsa.selfOnly);
    expect(selfOnly.hsa.totalContributions).toBe(4_400);
    expect(selfOnly.hsa.remainingRoom).toBe(0);

    const familyInput = baseInput();
    familyInput.hsa = { employeeAnnualContribution: 6_750, employerAnnualContribution: 1_000, coverage: "family" };
    const family = calculateEmployerBenefitsActionPlan(familyInput);
    expect(family.hsa.limit).toBe(BENEFIT_LIMITS_2026.hsa.family);
    expect(family.hsa.remainingRoom).toBe(1_000);
  });

  it("warns about HSA uncertainty and possible excess contributions", () => {
    const uncertain = baseInput();
    uncertain.health.hsaEligible = "not-sure";
    expect(calculateEmployerBenefitsActionPlan(uncertain).hsa.remainingRoom).toBeNull();
    expect(calculateEmployerBenefitsActionPlan(uncertain).hsa.warning).toContain("eligibility is uncertain");

    const excess = baseInput();
    excess.hsa.employeeAnnualContribution = 4_000;
    excess.hsa.employerAnnualContribution = 1_000;
    const plan = calculateEmployerBenefitsActionPlan(excess);
    expect(plan.hsa.possibleExcess).toBe(600);
    expect(plan.doThisFirst).toContain("Pause and verify HSA eligibility");
  });

  it("does not count unvested match as known employee-owned employer value", () => {
    const input = baseInput();
    input.retirement.vestingStatus = "not-fully-vested";
    const plan = calculateEmployerBenefitsActionPlan(input);
    expect(plan.retirement.estimatedEmployerMatch).toBe(2_400);
    expect(plan.knownAnnualEmployerValue).toBe(1_000);
    expect(plan.flags.join(" ")).toContain("not yet be employee-owned");
  });

  it("flags boundary and invalid inputs without producing misleading numbers", () => {
    const input = baseInput();
    input.pay.annualSalary = -1;
    input.retirement.employeeContributionPercent = 101;
    input.health.deductible = 7_000;
    input.health.outOfPocketMaximum = 6_000;
    const plan = calculateEmployerBenefitsActionPlan(input);
    expect(plan.annualPay).toBeNull();
    expect(plan.retirement.employeeAnnual).toBeNull();
    expect(plan.validationIssues).toHaveLength(3);
    expect(plan.flags.join(" ")).toContain("internally inconsistent");
  });
});
