import { describe, expect, it } from "vitest";
import { emptyWorkspaceState } from "@/premium/contracts";
import { applyConfirmedLocalBenefitsFacts } from "@/premium/localBenefitsSource";
import type { ExtractedBenefitFact } from "@/premium/documentIntakeContracts";

const fact = (overrides: Partial<ExtractedBenefitFact> & Pick<ExtractedBenefitFact, "key" | "label" | "value" | "unit">): ExtractedBenefitFact => ({
  confidence: "high",
  ...overrides,
});

describe("browser-local benefits source mapping", () => {
  it("maps confirmed plan facts into one workspace option without retaining raw source text", () => {
    const rawSourceText = "Medical premium $100 per paycheck and deductible $2,000";
    const result = applyConfirmedLocalBenefitsFacts({
      state: emptyWorkspaceState(),
      target: "optionA",
      payPeriodsPerYear: 26,
      sourceCategory: "medical_plan_summary",
      facts: [
        fact({ key: "employee_premium", label: "Employee medical premium", value: 100, unit: "usd", cadence: "per_pay_period" }),
        fact({ key: "deductible", label: "Deductible", value: 2000, unit: "usd", cadence: "annual" }),
        fact({ key: "out_of_pocket_maximum", label: "Out-of-pocket maximum", value: 6000, unit: "usd", cadence: "annual" }),
        fact({ key: "employer_hsa_or_hra_contribution", label: "Employer HSA contribution", value: 750, unit: "usd", cadence: "annual" }),
      ],
    });

    expect(result.state.answers["health-plan-exposure.optionA.annual-premium"]).toBe(2600);
    expect(result.state.answers["health-plan-exposure.optionA.deductible"]).toBe(2000);
    expect(result.state.answers["health-plan-exposure.optionA.oop-max"]).toBe(6000);
    expect(result.state.answers["health-plan-exposure.optionA.employer-account"]).toBe(750);
    expect(result.state.answers["source-assistant.optionA.confirmed-fact-keys"]).toEqual([
      "employee_premium",
      "deductible",
      "out_of_pocket_maximum",
      "employer_hsa_or_hra_contribution",
    ]);
    expect(JSON.stringify(result.state)).not.toContain(rawSourceText);
    expect(JSON.stringify(result.state)).not.toContain("fileName");
  });

  it("annualizes monthly premiums but refuses a per-pay-period premium without a confirmed cadence count", () => {
    const monthly = applyConfirmedLocalBenefitsFacts({
      state: emptyWorkspaceState(),
      target: "optionB",
      sourceCategory: "benefits_guide",
      facts: [fact({ key: "employee_premium", label: "Premium", value: 125, unit: "usd", cadence: "monthly" })],
    });
    expect(monthly.state.answers["health-plan-exposure.optionB.annual-premium"]).toBe(1500);

    const incomplete = applyConfirmedLocalBenefitsFacts({
      state: emptyWorkspaceState(),
      target: "optionA",
      sourceCategory: "benefits_guide",
      facts: [fact({ key: "employee_premium", label: "Premium", value: 125, unit: "usd", cadence: "per_pay_period" })],
    });
    expect(incomplete.appliedFactKeys).toEqual([]);
    expect(incomplete.skippedFactKeys).toEqual(["employee_premium"]);
    expect(incomplete.state.answers["health-plan-exposure.optionA.annual-premium"]).toBeUndefined();
  });

  it("maps retirement facts and turns vesting duration into an explicit verification item", () => {
    const result = applyConfirmedLocalBenefitsFacts({
      state: emptyWorkspaceState(),
      target: "optionB",
      sourceCategory: "retirement_summary",
      facts: [
        fact({ key: "retirement_match_percent", label: "Employer match", value: 6, unit: "percent", cadence: "not_applicable" }),
        fact({ key: "retirement_vesting_years", label: "Vesting", value: 3, unit: "years", cadence: "not_applicable" }),
      ],
    });

    expect(result.state.answers["retirement-benefits.optionB.match-percent"]).toBe(6);
    expect(result.state.answers["retirement-benefits.optionB.vesting-years-source"]).toBe(3);
    expect(result.state.answers["verification-list.shared.verification-notes"]).toContain("Option B");
    expect(result.state.answers["verification-list.shared.verification-notes"]).toContain("3-year vesting schedule");
    expect(result.state.assumptions).toContain(
      "Source assistance was performed in the browser. Only user-confirmed structured values were saved; raw text and file contents were not retained.",
    );
  });
});
