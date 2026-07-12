import { beforeEach, describe, expect, it } from "vitest";
import {
  BENEFITS_COMMAND_CENTER_STORAGE_KEY,
  createDefaultBenefitsPackage,
  saveBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  FOUNDATION_STORAGE_KEY,
  calculateFinancialFoundation,
  saveFinancialFoundationSnapshot,
  type FinancialFoundationInputs,
} from "@/lib/financialFoundationCheckup";
import {
  NAVIGATOR_STORAGE_KEY,
  addNavigatorAction,
} from "@/lib/financialNavigator";
import {
  PRODUCT_CONTINUITY_DISMISS_KEY,
  dismissProductContinuityForSession,
  getProductContinuityItems,
  isProductContinuityDismissed,
} from "@/lib/productContinuity";

const foundationInputs: FinancialFoundationInputs = {
  monthlyEssentialExpenses: 4000,
  liquidSavings: 12000,
  debtAprBand: "under_8",
  retirementMatchStatus: "partial",
  savingsAutomationBand: "ten_to_twenty",
  protectionReviewStatus: "partial",
  plannedExpenseStatus: "funded",
};

describe("product continuity summaries", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("summarizes all local products without exposing entered values or package labels", () => {
    addNavigatorAction("wealth_starter_reserve");

    const foundationResult = calculateFinancialFoundation(foundationInputs);
    saveFinancialFoundationSnapshot(foundationInputs, foundationResult);

    const benefitsPackage = createDefaultBenefitsPackage("private-package", "Private Employer Package", "salary");
    benefitsPackage.compensation.annualSalary = 85000;
    saveBenefitsWorkspace({
      schemaVersion: 1,
      mode: "current_package",
      packages: [benefitsPackage],
      activePackageId: benefitsPackage.id,
      comparisonPackageIds: [benefitsPackage.id],
      savedAt: new Date().toISOString(),
    });

    const items = getProductContinuityItems();
    expect(new Set(items.map((item) => item.id))).toEqual(new Set([
      "my_plan",
      "foundation_checkup",
      "benefits_command_center",
    ]));
    expect(items.find((item) => item.id === "my_plan")?.href).toBe("/start-here#my-plan");
    expect(items.find((item) => item.id === "foundation_checkup")?.href).toBe("/start-here#financial-foundation-checkup");
    expect(items.find((item) => item.id === "benefits_command_center")?.href).toBe("/tools/benefits-command-center");

    const serialized = JSON.stringify(items);
    expect(serialized).not.toContain("Private Employer Package");
    expect(serialized).not.toContain("85000");
    expect(serialized).not.toContain("12000");
    expect(serialized).not.toContain("4000");
  });

  it("rejects malformed local product state instead of surfacing a broken resume prompt", () => {
    window.localStorage.setItem(NAVIGATOR_STORAGE_KEY, "{bad-json");
    window.localStorage.setItem(FOUNDATION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, snapshots: [{ score: "bad" }] }));
    window.localStorage.setItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, packages: "bad" }));

    expect(getProductContinuityItems()).toEqual([]);
  });

  it("dismisses the summary only for the current browser session", () => {
    expect(isProductContinuityDismissed()).toBe(false);
    dismissProductContinuityForSession();
    expect(isProductContinuityDismissed()).toBe(true);
    expect(window.sessionStorage.getItem(PRODUCT_CONTINUITY_DISMISS_KEY)).toBe("true");
  });
});
