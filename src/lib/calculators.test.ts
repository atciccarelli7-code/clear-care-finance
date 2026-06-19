import { describe, expect, it } from "vitest";
import {
  calculateHealthInsuranceEstimate,
  type HealthInsuranceEstimateInput,
} from "./calculators";

const baseInput: HealthInsuranceEstimateInput = {
  monthlyPremium: 0,
  annualDeductible: 0,
  deductibleMet: 0,
  costShareMode: "coinsurance",
  copayPerVisit: 0,
  coinsuranceRate: 0,
  allowedAmountPerVisit: 0,
  visits: 0,
  outOfPocketMaximum: 0,
  outOfPocketMet: 0,
};

describe("calculateHealthInsuranceEstimate", () => {
  it("applies the deductible before coinsurance", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      annualDeductible: 1000,
      costShareMode: "coinsurance",
      coinsuranceRate: 20,
      allowedAmountPerVisit: 600,
      visits: 3,
    });

    expect(result.deductibleCost).toBe(1000);
    expect(result.postDeductibleCost).toBe(160);
    expect(result.medicalCostSharing).toBe(1160);
    expect(result.insurancePays).toBe(640);
    expect(result.totalAllowed).toBe(1800);
  });

  it("uses a copay instead of also charging coinsurance", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      costShareMode: "copay",
      copayPerVisit: 30,
      coinsuranceRate: 90,
      allowedAmountPerVisit: 200,
      visits: 3,
    });

    expect(result.postDeductibleCost).toBe(90);
    expect(result.medicalCostSharing).toBe(90);
    expect(result.insurancePays).toBe(510);
  });

  it("keeps premiums separate from medical cost sharing", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      monthlyPremium: 200,
      costShareMode: "coinsurance",
      coinsuranceRate: 20,
      allowedAmountPerVisit: 100,
      visits: 2,
    });

    expect(result.annualPremium).toBe(2400);
    expect(result.medicalCostSharing).toBe(40);
    expect(result.totalAnnualCost).toBe(2440);
  });

  it("caps new medical cost sharing at the remaining out-of-pocket maximum", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      annualDeductible: 1000,
      deductibleMet: 500,
      costShareMode: "coinsurance",
      coinsuranceRate: 20,
      allowedAmountPerVisit: 400,
      visits: 3,
      outOfPocketMaximum: 1000,
      outOfPocketMet: 900,
    });

    expect(result.medicalCostSharing).toBe(100);
    expect(result.insurancePays).toBe(1100);
    expect(result.remainingOutOfPocket).toBe(0);
  });

  it("treats zero out-of-pocket maximum as unknown and does not apply a cap", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      annualDeductible: 500,
      costShareMode: "coinsurance",
      coinsuranceRate: 20,
      allowedAmountPerVisit: 400,
      visits: 2,
      outOfPocketMaximum: 0,
    });

    expect(result.medicalCostSharing).toBe(560);
    expect(result.remainingOutOfPocket).toBeNull();
  });

  it("normalizes negative values, percentages, and fractional visit counts", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      monthlyPremium: -100,
      annualDeductible: -500,
      costShareMode: "coinsurance",
      coinsuranceRate: 150,
      allowedAmountPerVisit: 100,
      visits: 2.9,
    });

    expect(result.annualPremium).toBe(0);
    expect(result.totalAllowed).toBe(200);
    expect(result.medicalCostSharing).toBe(200);
    expect(result.insurancePays).toBe(0);
  });

  it("always reconciles patient and insurer payments to allowed charges", () => {
    const result = calculateHealthInsuranceEstimate({
      ...baseInput,
      annualDeductible: 750,
      deductibleMet: 200,
      costShareMode: "copay",
      copayPerVisit: 35,
      allowedAmountPerVisit: 275,
      visits: 7,
      outOfPocketMaximum: 1200,
      outOfPocketMet: 300,
    });

    expect(result.medicalCostSharing + result.insurancePays).toBeCloseTo(result.totalAllowed, 8);
  });
});
