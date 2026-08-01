import { describe, expect, it } from "vitest";
import {
  evaluateRetirement403bDecision,
  type Retirement403bDecisionInput,
} from "@/lib/retirement403bDecision";

const baseInput: Retirement403bDecisionInput = {
  hourlyWage: 45,
  hoursPerWeek: 36,
  paychecksPerYear: 26,
  employeeContributionPercent: 8,
  contributionType: "traditional",
  estimatedFederalMarginalRatePercent: 22,
  matchFormula: "full_match_up_to",
  employerMatchCapPercent: 6,
  generatedAt: new Date("2026-08-01T16:00:00Z"),
};

describe("403(b) employer-contribution formulas", () => {
  it("models a dollar-for-dollar match only up to the entered employee contribution cap", () => {
    const decision = evaluateRetirement403bDecision(baseInput);

    expect(decision.state).toBe("capturing_full_match");
    expect(decision.annualEligiblePay).toBeCloseTo(84_240, 2);
    expect(decision.grossPaycheck).toBeCloseTo(3_240, 2);
    expect(decision.annualEmployeeContribution).toBeCloseTo(6_739.2, 2);
    expect(decision.annualEmployerContribution).toBeCloseTo(5_054.4, 2);
    expect(decision.annualTotalContribution).toBeCloseTo(11_793.6, 2);
  });

  it("does not confuse a 50% match on the first 6% with a 6% employer contribution", () => {
    const decision = evaluateRetirement403bDecision({
      ...baseInput,
      matchFormula: "partial_match_up_to",
      employerMatchRatePercent: 50,
      employerMatchCapPercent: 6,
    });

    expect(decision.state).toBe("capturing_full_match");
    expect(decision.annualEmployerContribution).toBeCloseTo(2_527.2, 2);
    expect(decision.annualEmployerContribution).not.toBeCloseTo(5_054.4, 2);
  });

  it("identifies an employee contribution below the stated full-match threshold", () => {
    const decision = evaluateRetirement403bDecision({
      ...baseInput,
      employeeContributionPercent: 4,
    });

    expect(decision.state).toBe("below_full_match");
    expect(decision.annualEmployerContribution).toBeCloseTo(3_369.6, 2);
    expect(decision.view.firstAction).toMatch(/smallest affordable contribution increase/i);
  });

  it("models a non-elective contribution independently of the employee deferral", () => {
    const decision = evaluateRetirement403bDecision({
      ...baseInput,
      employeeContributionPercent: 0,
      matchFormula: "non_elective",
      employerMatchCapPercent: undefined,
      employerNonElectivePercent: 3,
    });

    expect(decision.state).toBe("non_elective_contribution");
    expect(decision.annualEmployeeContribution).toBe(0);
    expect(decision.annualEmployerContribution).toBeCloseTo(2_527.2, 2);
  });

  it("fails closed for unknown or tiered formulas instead of fabricating an employer estimate", () => {
    const decision = evaluateRetirement403bDecision({
      ...baseInput,
      matchFormula: "unknown_or_tiered",
      employerMatchCapPercent: undefined,
    });

    expect(decision.state).toBe("verify_match_formula");
    expect(decision.annualEmployerContribution).toBeNull();
    expect(decision.annualTotalContribution).toBeNull();
    expect(decision.view.metricGroups[0].metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Estimated annual employer contribution", value: "Not estimated" }),
    ]));
    expect(decision.view.portableSummary).toContain("Estimated annual employer contribution: Not estimated");
  });
});

describe("403(b) validation, tax boundary, and portable output", () => {
  it.each([
    { hourlyWage: 0 },
    { hoursPerWeek: 169 },
    { paychecksPerYear: 0 },
    { employeeContributionPercent: 101 },
    { estimatedFederalMarginalRatePercent: -1 },
  ])("fails closed for malformed base input %#", (override) => {
    const decision = evaluateRetirement403bDecision({ ...baseInput, ...override });
    expect(decision.state).toBe("insufficient_information");
    expect(decision.errors.length).toBeGreaterThan(0);
  });

  it("requires the fields belonging to the selected employer formula", () => {
    const partial = evaluateRetirement403bDecision({
      ...baseInput,
      matchFormula: "partial_match_up_to",
      employerMatchRatePercent: Number.NaN,
    });
    const nonElective = evaluateRetirement403bDecision({
      ...baseInput,
      matchFormula: "non_elective",
      employerMatchCapPercent: undefined,
      employerNonElectivePercent: Number.NaN,
    });

    expect(partial.state).toBe("insufficient_information");
    expect(partial.errors.map((error) => error.field)).toContain("employerMatchRatePercent");
    expect(nonElective.state).toBe("insufficient_information");
    expect(nonElective.errors.map((error) => error.field)).toContain("employerNonElectivePercent");
  });

  it("shows an illustrative federal tax reduction for Traditional but not Roth contributions", () => {
    const traditional = evaluateRetirement403bDecision(baseInput);
    const roth = evaluateRetirement403bDecision({ ...baseInput, contributionType: "roth" });

    expect(traditional.estimatedAnnualFederalTaxReduction).toBeCloseTo(1_482.624, 3);
    expect(roth.estimatedAnnualFederalTaxReduction).toBe(0);
  });

  it("builds a dated, educational summary with plan-document verification", () => {
    const decision = evaluateRetirement403bDecision(baseInput);

    expect(decision.view.portableSummary).toContain("403(b) contribution decision summary");
    expect(decision.view.portableSummary).toContain("Employer matches 100% of contributions up to 6% of eligible pay");
    expect(decision.view.portableSummary).toContain("Estimated annual employer contribution: $5,054");
    expect(decision.view.verificationChecklist).toEqual(expect.arrayContaining([
      expect.stringMatching(/eligible compensation/i),
      expect.stringMatching(/true-up/i),
      expect.stringMatching(/vesting/i),
    ]));
    expect(decision.view.educationalLimitation).toMatch(/not tax, legal, investment/i);
  });
});
