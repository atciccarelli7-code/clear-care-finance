import { describe, expect, it } from "vitest";
import {
  calculateCompensation,
  compareCompensation,
  createDefaultCompensationInput,
  type CompensationInput,
} from "@/lib/totalCompensation";

const hourlyOffer = (overrides: Partial<CompensationInput> = {}): CompensationInput => ({
  ...createDefaultCompensationInput("Bedside RN", "hourly"),
  hourlyRate: 40,
  scheduledHoursPerWeek: 36,
  weeksWorkedPerYear: 50,
  overtimeHoursPerWeek: 4,
  overtimeMultiplier: 1.5,
  differentialPerHour: 5,
  differentialHoursPerWeek: 24,
  annualBonus: 1000,
  employerRetirementPercent: 4,
  employerHsaHraContribution: 500,
  paidTimeOffHours: 72,
  annualEmployeeHealthPremium: 2400,
  annualCommuteCost: 2000,
  payPeriodsPerYear: 26,
  qualityOfLife: {
    ...createDefaultCompensationInput("Bedside RN", "hourly").qualityOfLife,
    workdaysPerWeek: 3,
  },
  ...overrides,
});

const salaryOffer = (overrides: Partial<CompensationInput> = {}): CompensationInput => ({
  ...createDefaultCompensationInput("Clinical Specialist", "salary"),
  annualSalary: 95000,
  scheduledHoursPerWeek: 40,
  weeksWorkedPerYear: 52,
  annualBonus: 5000,
  employerRetirementPercent: 6,
  employerHsaHraContribution: 1000,
  additionalBenefitValue: 1500,
  paidTimeOffHours: 120,
  annualEmployeeHealthPremium: 3600,
  annualCommuteCost: 5000,
  unpaidHoursPerWeek: 3,
  payPeriodsPerYear: 24,
  qualityOfLife: {
    ...createDefaultCompensationInput("Clinical Specialist", "salary").qualityOfLife,
    workdaysPerWeek: 5,
  },
  ...overrides,
});

describe("calculateCompensation", () => {
  it("calculates hourly base, overtime, and differentials", () => {
    const result = calculateCompensation(hourlyOffer());

    expect(result.baseAnnualCash).toBe(72000);
    expect(result.overtimePay).toBe(12000);
    expect(result.differentialPay).toBe(6000);
    expect(result.annualCashCompensation).toBe(91000);
  });

  it("calculates employer retirement contributions from base pay", () => {
    const result = calculateCompensation(hourlyOffer());
    expect(result.employerRetirementContribution).toBe(2880);
  });

  it("shows and includes PTO value for hourly roles", () => {
    const result = calculateCompensation(hourlyOffer({ overtimeHoursPerWeek: 0, differentialHoursPerWeek: 0 }));
    expect(result.ptoValue).toBe(2880);
    expect(result.employerBenefitValue).toBe(6260);
  });

  it("does not double count PTO inside annual salary", () => {
    const result = calculateCompensation(salaryOffer());
    expect(result.ptoValue).toBeCloseTo(5480.77, 2);
    expect(result.employerBenefitValue).toBe(8200);
  });

  it("subtracts insurance and commute costs", () => {
    const result = calculateCompensation(salaryOffer());
    expect(result.annualEmployeeCosts).toBe(8600);
    expect(result.totalEstimatedCompensation).toBe(108200);
    expect(result.totalAfterSelectedCosts).toBe(99600);
  });

  it("uses actual hours when unpaid salaried work is entered", () => {
    const result = calculateCompensation(salaryOffer());
    expect(result.scheduledAnnualHours).toBe(2080);
    expect(result.actualAnnualHours).toBe(2236);
    expect(result.effectiveCompensationPerActualHour).toBeLessThan(result.effectiveCompensationPerScheduledHour);
  });

  it("calculates per-paycheck and per-workday values", () => {
    const result = calculateCompensation(hourlyOffer());
    expect(result.perPaycheckAfterCosts).toBeCloseTo(result.totalAfterSelectedCosts / 26, 2);
    expect(result.perScheduledWorkdayAfterCosts).toBeCloseTo(result.totalAfterSelectedCosts / 150, 2);
  });

  it("treats negative and non-finite values as zero", () => {
    const result = calculateCompensation(
      hourlyOffer({
        hourlyRate: -50,
        annualBonus: Number.NaN,
        annualCommuteCost: Number.POSITIVE_INFINITY,
      }),
    );

    expect(result.baseAnnualCash).toBe(0);
    expect(result.annualEmployeeCosts).toBe(2400);
    expect(Number.isFinite(result.totalAfterSelectedCosts)).toBe(true);
  });

  it("handles zero hours without producing Infinity", () => {
    const result = calculateCompensation(hourlyOffer({ scheduledHoursPerWeek: 0, overtimeHoursPerWeek: 0 }));
    expect(result.effectiveCompensationPerScheduledHour).toBe(0);
    expect(result.effectiveCompensationPerActualHour).toBe(0);
  });

  it("rounds monetary outputs consistently", () => {
    const result = calculateCompensation(hourlyOffer({ hourlyRate: 37.333, scheduledHoursPerWeek: 37.5, weeksWorkedPerYear: 51 }));
    expect(result.baseAnnualCash).toBe(71399.36);
  });
});

describe("compareCompensation", () => {
  it("calculates annual, monthly, paycheck, and workday differences", () => {
    const comparison = compareCompensation(hourlyOffer(), salaryOffer());

    expect(comparison.annualDifference).toBeCloseTo(
      comparison.offerB.totalAfterSelectedCosts - comparison.offerA.totalAfterSelectedCosts,
      2,
    );
    expect(comparison.monthlyDifference).toBeCloseTo(comparison.annualDifference / 12, 2);
    expect(Number.isFinite(comparison.paycheckDifference)).toBe(true);
    expect(Number.isFinite(comparison.scheduledWorkdayDifference)).toBe(true);
  });

  it("identifies when cash and total compensation leaders differ", () => {
    const cashHeavy = salaryOffer({ name: "Cash-heavy offer", annualSalary: 105000, employerRetirementPercent: 0, annualEmployeeHealthPremium: 10000 });
    const benefitHeavy = salaryOffer({ name: "Benefit-heavy offer", annualSalary: 99000, employerRetirementPercent: 12, employerHsaHraContribution: 3000, annualEmployeeHealthPremium: 1000 });
    const comparison = compareCompensation(cashHeavy, benefitHeavy);

    expect(comparison.higherCashOfferName).toBe("Cash-heavy offer");
    expect(comparison.higherTotalOfferName).toBe("Benefit-heavy offer");
    expect(comparison.summary).toContain("pays more in direct cash");
  });

  it("produces a break-even salary for the lower salary offer", () => {
    const comparison = compareCompensation(
      salaryOffer({ name: "Offer A", annualSalary: 80000, employerRetirementPercent: 0 }),
      salaryOffer({ name: "Offer B", annualSalary: 100000, employerRetirementPercent: 0 }),
    );

    expect(comparison.breakEven.lowerOfferName).toBe("Offer A");
    expect(comparison.breakEven.requiredAnnualSalary).toBeGreaterThan(80000);
    expect(comparison.breakEven.requiredHourlyRate).toBeNull();
  });

  it("produces a break-even hourly rate for the lower hourly offer", () => {
    const comparison = compareCompensation(
      hourlyOffer({ name: "Offer A", hourlyRate: 30, overtimeHoursPerWeek: 0, differentialHoursPerWeek: 0 }),
      hourlyOffer({ name: "Offer B", hourlyRate: 45, overtimeHoursPerWeek: 0, differentialHoursPerWeek: 0 }),
    );

    expect(comparison.breakEven.requiredHourlyRate).toBeGreaterThan(30);
    expect(comparison.breakEven.requiredAnnualSalary).toBeNull();
  });

  it("uses a close-call summary when the difference is under three percent", () => {
    const comparison = compareCompensation(
      salaryOffer({ name: "Offer A", annualSalary: 95000 }),
      salaryOffer({ name: "Offer B", annualSalary: 96000 }),
    );

    expect(comparison.summary).toContain("financial difference is modest");
  });
});
