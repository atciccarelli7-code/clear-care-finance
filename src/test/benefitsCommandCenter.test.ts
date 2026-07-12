import { beforeEach, describe, expect, it } from "vitest";
import {
  BENEFITS_COMMAND_CENTER_STORAGE_KEY,
  calculateBenefitsReceipt,
  calculateHealthPlanScenario,
  calculateRetirementBenefits,
  clearBenefitsWorkspace,
  compareBenefitsPackages,
  createDefaultBenefitsPackage,
  createDefaultBenefitsWorkspace,
  loadBenefitsWorkspace,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import { NAVIGATOR_STORAGE_KEY, addNavigatorAction } from "@/lib/financialNavigator";

describe("CAF Benefits Command Center", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reuses the compensation engine for hourly pay, overtime, and differentials", () => {
    const benefitsPackage = createDefaultBenefitsPackage("rn-role", "RN role", "hourly");
    benefitsPackage.compensation.hourlyRate = 40;
    benefitsPackage.compensation.scheduledHoursPerWeek = 36;
    benefitsPackage.compensation.weeksWorkedPerYear = 52;
    benefitsPackage.compensation.overtimeHoursPerWeek = 4;
    benefitsPackage.compensation.overtimeMultiplier = 1.5;
    benefitsPackage.compensation.differentialPerHour = 3;
    benefitsPackage.compensation.differentialHoursPerWeek = 36;
    benefitsPackage.compensation.annualBonus = 2000;

    const receipt = calculateBenefitsReceipt(benefitsPackage);

    expect(receipt.compensation.baseAnnualCash).toBe(74880);
    expect(receipt.compensation.overtimePay).toBe(12480);
    expect(receipt.compensation.differentialPay).toBe(5616);
    expect(receipt.compensation.annualCashCompensation).toBe(94976);
  });

  it("shows low, moderate, and worst-case health-plan costs with employer account funding", () => {
    const benefitsPackage = createDefaultBenefitsPackage();
    const plan = benefitsPackage.healthPlans[0];
    Object.assign(plan, {
      employeePremiumPerPaycheck: 100,
      payPeriodsPerYear: 26,
      individualDeductible: 2000,
      coinsurancePercent: 20,
      primaryCareCopay: 25,
      specialistCopay: 50,
      urgentCareCopay: 75,
      individualOutOfPocketMax: 6000,
      employerHsaHraContribution: 1000,
    });

    const result = calculateHealthPlanScenario(plan);

    expect(result.annualPremium).toBe(2600);
    expect(result.lowUseNetAnnualCost).toBe(1900);
    expect(result.moderateUseNetAnnualCost).toBe(3235);
    expect(result.highUseNetAnnualCost).toBe(7600);
    expect(result.lowUseNetAnnualCost).toBeLessThan(result.moderateUseNetAnnualCost);
    expect(result.moderateUseNetAnnualCost).toBeLessThan(result.highUseNetAnnualCost);
  });

  it("calculates match capture, non-elective contributions, and vesting separately", () => {
    const result = calculateRetirementBenefits({
      planType: "403b",
      employeeContributionPercent: 4,
      employerMatchRatePercent: 100,
      employerMatchCapPercent: 6,
      employerNonElectivePercent: 2,
      employerFixedContribution: 0,
      vestingPercent: 50,
      trueUpStatus: "unsure",
      matchTiming: "unsure",
      rothAvailable: true,
      traditionalAvailable: true,
    }, 100000);

    expect(result.employeeContribution).toBe(4000);
    expect(result.estimatedEmployerMatch).toBe(4000);
    expect(result.maximumEmployerMatch).toBe(6000);
    expect(result.uncapturedEmployerMatch).toBe(2000);
    expect(result.employerNonElectiveContribution).toBe(2000);
    expect(result.totalEmployerRetirementContribution).toBe(6000);
    expect(result.vestedEmployerRetirementValue).toBe(3000);
    expect(result.unvestedEmployerRetirementValue).toBe(3000);
  });

  it("keeps variable cash, employee costs, employer value, and unvested value distinct", () => {
    const benefitsPackage = createDefaultBenefitsPackage("offer-a", "Offer A", "salary");
    benefitsPackage.compensation.annualSalary = 100000;
    benefitsPackage.compensation.annualBonus = 10000;
    benefitsPackage.compensation.annualDentalVisionPremium = 600;
    benefitsPackage.retirement.planType = "401k";
    benefitsPackage.retirement.employeeContributionPercent = 3;
    benefitsPackage.retirement.employerMatchRatePercent = 100;
    benefitsPackage.retirement.employerMatchCapPercent = 6;
    benefitsPackage.retirement.vestingPercent = 50;
    benefitsPackage.healthPlans[0].employeePremiumPerPaycheck = 150;
    benefitsPackage.healthPlans[0].payPeriodsPerYear = 26;
    benefitsPackage.healthPlans[0].individualOutOfPocketMax = 5000;
    benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "tuition_assistance")!.status = "enrolled";
    benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "tuition_assistance")!.annualKnownValue = 2000;

    const receipt = calculateBenefitsReceipt(benefitsPackage);

    expect(receipt.compensation.annualCashCompensation).toBe(110000);
    expect(receipt.annualEmployeeBenefitCosts).toBe(4500);
    expect(receipt.retirement.totalEmployerRetirementContribution).toBe(3000);
    expect(receipt.unvestedValue).toBe(1500);
    expect(receipt.knownHiddenBenefitValue).toBe(2000);
    expect(receipt.estimatedTotalPackageValue).toBe(115000);
    expect(receipt.estimatedValueAfterSelectedCosts).toBe(110500);
    expect(receipt.verificationQuestions).toContain("Does the retirement plan provide a year-end match true-up if contributions vary during the year?");
  });

  it("compares two packages using classifications and uncertainty instead of a universal winner", () => {
    const current = createDefaultBenefitsPackage("current", "Current job", "hourly");
    current.compensation.hourlyRate = 40;
    current.compensation.scheduledHoursPerWeek = 36;
    current.compensation.overtimeHoursPerWeek = 4;
    current.compensation.overtimeMultiplier = 1.5;
    current.workStructure.commuteMinutesPerWorkday = 50;

    const offer = createDefaultBenefitsPackage("offer", "New offer", "salary");
    offer.compensation.annualSalary = 95000;
    offer.retirement.planType = "401k";
    offer.retirement.employerNonElectivePercent = 5;
    offer.workStructure.commuteMinutesPerWorkday = 10;

    const comparison = compareBenefitsPackages(current, offer);

    expect(comparison.classifications.length).toBeGreaterThan(0);
    expect(comparison.classifications.some((item) => item.includes("shorter entered commute"))).toBe(true);
    expect(comparison.uncertaintySummary).toMatch(/verification|unverified/i);
    expect(comparison).not.toHaveProperty("winner");
  });

  it("validates local storage, limits packages, and clears all Command Center data", () => {
    const workspace = createDefaultBenefitsWorkspace();
    workspace.packages.push(
      createDefaultBenefitsPackage("offer-b", "Offer B", "salary"),
      createDefaultBenefitsPackage("offer-c", "Offer C", "salary"),
      createDefaultBenefitsPackage("offer-d", "Offer D", "salary"),
    );
    saveBenefitsWorkspace(workspace);

    const stored = loadBenefitsWorkspace();
    expect(stored?.packages).toHaveLength(3);
    expect(stored?.packages[0].label).toBe("Current package");

    window.localStorage.setItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, packages: [{ bad: true }] }));
    expect(loadBenefitsWorkspace()).toBeNull();

    saveBenefitsWorkspace(createDefaultBenefitsWorkspace());
    clearBenefitsWorkspace();
    expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY)).toBeNull();
  });

  it("persists only fixed Benefits Receipt actions into the existing My Plan schema", () => {
    const benefitsPackage = createDefaultBenefitsPackage("gaps", "Package with gaps", "salary");
    benefitsPackage.compensation.annualSalary = 90000;
    benefitsPackage.retirement.planType = "403b";
    benefitsPackage.retirement.employeeContributionPercent = 2;
    benefitsPackage.retirement.employerMatchRatePercent = 100;
    benefitsPackage.retirement.employerMatchCapPercent = 6;
    benefitsPackage.healthPlans[0].individualOutOfPocketMax = 6000;
    benefitsPackage.healthPlans[0].networkStatus = "not_verified";
    benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "long_term_disability")!.status = "unsure";

    const receipt = calculateBenefitsReceipt(benefitsPackage);
    receipt.recommendedActionIds.forEach((id) => addNavigatorAction(id));

    const storedPlan = JSON.parse(window.localStorage.getItem(NAVIGATOR_STORAGE_KEY) ?? "null") as { actionIds?: string[] } | null;
    expect(storedPlan?.actionIds).toEqual(receipt.recommendedActionIds);
    expect(JSON.stringify(storedPlan)).not.toContain("90000");
    expect(JSON.stringify(storedPlan)).not.toContain("Package with gaps");
  });
});
