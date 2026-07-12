import { beforeEach, describe, expect, it } from "vitest";
import { sanitizeEventProperties } from "@/lib/analytics";
import {
  BENEFITS_COMMAND_CENTER_STORAGE_KEY,
  calculateBenefitsReceipt,
  compareBenefitsPackages,
  loadBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  SAMPLE_BEDSIDE_RN_PACKAGE_ID,
  SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID,
  SAMPLE_HOSPITAL_RN_PACKAGE_ID,
  activateSampleWorkspace,
  buildBenefitsActivationEventProperties,
  createFreshUserWorkspace,
  createSampleComparisonWorkspace,
  createSampleReceiptWorkspace,
  getSampleBenefitsComparison,
  getSampleBenefitsReceipt,
  isBenefitsWorkspacePristine,
  isSampleBenefitsPackage,
} from "@/lib/benefitsCommandCenterActivation";

describe("Benefits Command Center activation samples", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates a realistic fictional RN package through the production schema and Receipt engine", () => {
    const workspace = createSampleReceiptWorkspace();
    expect(workspace.schemaVersion).toBe(1);
    expect(workspace.packages).toHaveLength(1);
    expect(workspace.packages[0].id).toBe(SAMPLE_HOSPITAL_RN_PACKAGE_ID);
    expect(workspace.packages[0].label).toMatch(/sample hospital rn package/i);
    expect(isSampleBenefitsPackage(workspace.packages[0])).toBe(true);

    const receipt = calculateBenefitsReceipt(workspace.packages[0]);
    expect(receipt.compensation.baseAnnualCash).toBeGreaterThan(0);
    expect(receipt.compensation.overtimePay).toBeGreaterThan(0);
    expect(receipt.compensation.differentialPay).toBeGreaterThan(0);
    expect(receipt.retirement.totalEmployerRetirementContribution).toBeGreaterThan(0);
    expect(receipt.unvestedValue).toBeGreaterThan(0);
    expect(receipt.selectedHealthPlan?.employerAccountContribution).toBeGreaterThan(0);
    expect(receipt.verificationQuestions.length).toBeGreaterThan(2);

    const serialized = JSON.stringify(workspace).toLowerCase();
    expect(serialized).not.toContain("novant");
    expect(serialized).not.toContain("atrium");
    expect(serialized).not.toContain("aetna");
    expect(serialized).not.toContain("unitedhealth");
  });

  it("uses the real comparison engine without creating a universal winner", () => {
    const workspace = createSampleComparisonWorkspace();
    expect(workspace.packages.map((item) => item.id)).toEqual([
      SAMPLE_BEDSIDE_RN_PACKAGE_ID,
      SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID,
    ]);

    const comparison = compareBenefitsPackages(workspace.packages[0], workspace.packages[1]);
    expect(comparison.packageA.compensation.annualCashCompensation).toBeGreaterThan(0);
    expect(comparison.packageB.compensation.annualCashCompensation).toBeGreaterThan(0);
    expect(comparison.classifications.length).toBeGreaterThan(0);
    expect(JSON.stringify(comparison).toLowerCase()).not.toContain('"winner"');
    expect(comparison.uncertaintySummary.length).toBeGreaterThan(0);
  });

  it("exposes stable precomputed sample outputs through the production calculators", () => {
    const receipt = getSampleBenefitsReceipt();
    const comparison = getSampleBenefitsComparison();
    expect(receipt.packageId).toBe(SAMPLE_HOSPITAL_RN_PACKAGE_ID);
    expect(receipt.estimatedValueAfterSelectedCosts).toBeGreaterThan(0);
    expect(comparison.packageA.packageId).toBe(SAMPLE_BEDSIDE_RN_PACKAGE_ID);
    expect(comparison.packageB.packageId).toBe(SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID);
  });

  it("loads samples locally and resets safely to a pristine user workspace", () => {
    activateSampleWorkspace("sample_comparison");
    expect(loadBenefitsWorkspace()?.packages).toHaveLength(2);
    expect(window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY)).toContain(SAMPLE_BEDSIDE_RN_PACKAGE_ID);

    const fresh = createFreshUserWorkspace();
    expect(fresh.packages).toHaveLength(1);
    expect(fresh.packages.some(isSampleBenefitsPackage)).toBe(false);
    expect(isBenefitsWorkspacePristine(fresh)).toBe(true);
  });

  it("builds analytics properties from fixed categorical fields only", () => {
    const properties = buildBenefitsActivationEventProperties({
      entrySurface: "homepage",
      activationPath: "sample_receipt",
      moduleId: "receipt",
      packageCount: 1,
      completionBand: "76_100",
    });

    expect(properties).toEqual({
      event_category: "tools",
      tool_id: "benefits_command_center",
      entry_surface: "homepage",
      activation_path: "sample_receipt",
      module_id: "receipt",
      package_count: 1,
      completion_band: "76_100",
    });

    const sanitized = sanitizeEventProperties({
      ...properties,
      salary: 100_000,
      premium_amount: 400,
      employer_name: "Should be removed",
      free_text: "A user-entered note",
    });
    expect(sanitized.salary).toBeUndefined();
    expect(sanitized.premium_amount).toBeUndefined();
    expect(sanitized.employer_name).toBeUndefined();
    expect(sanitized.free_text).toBe("A user-entered note");
    expect(JSON.stringify(properties)).not.toMatch(/salary|premium|deductible|commute|employer_name/i);
  });
});
