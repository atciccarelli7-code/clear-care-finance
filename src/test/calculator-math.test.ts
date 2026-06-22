import { describe, expect, it } from "vitest";
import {
  calculateCafeSpending,
  calculateContributionGoal,
  calculateEmergencyFund,
  calculateHospitalBill,
  calculateLoanPayment,
  calculateMedicareCosts,
  calculateOvertime,
  calculateSavingsRate,
} from "@/lib/calculator-math";

describe("calculator formulas", () => {
  it("calculates the 403(b) amount needed per remaining paycheck", () => {
    const result = calculateContributionGoal({
      annualGoal: 12_000,
      yearToDate: 3_000,
      paychecksRemaining: 18,
      grossPayPerPaycheck: 2_800,
      employerMatchPercentage: 4,
    });

    expect(result.requiredPerPaycheck).toBe(500);
    expect(result.requiredPercentage).toBeCloseTo(17.857, 3);
    expect(result.achievable).toBe(true);
    expect(result.estimatedEmployerMatch).toBe(2_016);
  });

  it("flags a contribution goal that exceeds available gross pay", () => {
    const result = calculateContributionGoal({
      annualGoal: 20_000,
      yearToDate: 0,
      paychecksRemaining: 2,
      grossPayPerPaycheck: 2_000,
      employerMatchPercentage: 0,
    });

    expect(result.achievable).toBe(false);
    expect(result.requiredPerPaycheck).toBe(10_000);
  });

  it("applies deductible, coinsurance, copay, and the out-of-pocket cap", () => {
    const result = calculateHospitalBill({
      billedCharge: 5_000,
      deductibleRemaining: 1_000,
      coinsurancePercentage: 20,
      copay: 50,
      outOfPocketMaxRemaining: 1_500,
      amountAlreadyPaid: 0,
      insuranceStatus: "insured",
    });

    expect(result.estimatedBeforeCap).toBe(1_850);
    expect(result.patientResponsibility).toBe(1_500);
    expect(result.outOfPocketCapEffect).toBe(350);
    expect(result.deductibleApplied + result.coinsuranceEstimate + result.copayEstimate).toBe(1_500);
  });

  it("treats the remaining billed charge as the uninsured estimate", () => {
    const result = calculateHospitalBill({
      billedCharge: 2_000,
      deductibleRemaining: 500,
      coinsurancePercentage: 20,
      copay: 30,
      outOfPocketMaxRemaining: 1_000,
      amountAlreadyPaid: 300,
      insuranceStatus: "uninsured",
    });

    expect(result.patientResponsibility).toBe(1_700);
    expect(result.deductibleApplied).toBe(0);
  });

  it("calculates an emergency fund target and timeline", () => {
    const result = calculateEmergencyFund({
      rentMortgage: 1_400,
      food: 500,
      transportation: 350,
      insurance: 250,
      minimumDebtPayments: 300,
      utilities: 250,
      otherEssentials: 150,
      desiredMonths: 3,
      currentSavings: 2_500,
      monthlySavings: 500,
    });

    expect(result.essentialMonthlyExpenses).toBe(3_200);
    expect(result.targetFund).toBe(9_600);
    expect(result.remainingAmount).toBe(7_100);
    expect(result.monthsToTarget).toBe(14.2);
  });

  it("calculates cash and total wealth-building rates", () => {
    const result = calculateSavingsRate({
      takeHomePay: 5_200,
      fixedExpenses: 2_800,
      variableExpenses: 1_200,
      retirementContributions: 350,
      extraDebtPayments: 200,
      cashSavings: 600,
    });

    expect(result.cashSavingsRate).toBeCloseTo(11.538, 3);
    expect(result.totalWealthBuildingRate).toBeCloseTo(22.115, 3);
    expect(result.annualCashSavings).toBe(7_200);
    expect(result.band).toBe("solid");
  });

  it("annualizes cafe purchases and a chosen weekly replacement", () => {
    const result = calculateCafeSpending({
      coffeeCost: 4.5,
      coffeePerWeek: 3,
      mealCost: 12,
      mealsPerWeek: 2,
      snackCost: 3,
      snacksPerWeek: 3,
      workWeeks: 48,
      weeklyAmountReplaced: 15,
    });

    expect(result.weeklySpending).toBe(46.5);
    expect(result.annualSpending).toBe(2_232);
    expect(result.potentialAnnualSavings).toBe(720);
  });

  it("calculates overtime pay after withholding and lifestyle leakage", () => {
    const result = calculateOvertime({
      baseHourlyRate: 45,
      overtimeHoursPerWeek: 8,
      overtimeMultiplier: 1.5,
      taxWithholdingPercentage: 25,
      weeksWorked: 48,
      extraSpendingPerWeek: 60,
      recoveryCostPerWeek: 40,
    });

    expect(result.grossOvertimePay).toBe(25_920);
    expect(result.estimatedAfterTaxPay).toBe(19_440);
    expect(result.lifestyleLeakage).toBe(4_800);
    expect(result.netBenefit).toBe(14_640);
  });

  it("calculates Medicare budget components", () => {
    const result = calculateMedicareCosts({
      monthlyPartBPremium: 200,
      annualPartBDeductible: 250,
      prescriptionsPerMonth: 2,
      averagePrescriptionCost: 10,
      expectedDoctorVisits: 5,
      averageApprovedVisitAmount: 100,
      coinsurancePercentage: 20,
    });

    expect(result.estimatedAnnualCost).toBe(2_990);
  });

  it("uses standard amortization for a fixed-rate loan", () => {
    const result = calculateLoanPayment({
      principal: 20_000,
      annualInterestRate: 7,
      termYears: 10,
    });

    expect(result.monthlyPayment).toBeCloseTo(232.22, 2);
    expect(result.totalInterest).toBeGreaterThan(7_800);
  });
});
