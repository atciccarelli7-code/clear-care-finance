import { describe, expect, it } from "vitest";
import { createOpenEnrollmentPilotState } from "@/premium/openEnrollmentPilot";
import { applyConfirmedOpenEnrollmentFacts } from "@/premium/openEnrollmentSource";
import type { ExtractedBenefitFact } from "@/premium/documentIntakeContracts";

const fact = (patch: Partial<ExtractedBenefitFact> & Pick<ExtractedBenefitFact, "key" | "label" | "value" | "unit">): ExtractedBenefitFact => ({
  cadence: "not_applicable",
  confidence: "high",
  ...patch,
});

describe("open-enrollment browser-local source assistance", () => {
  it("annualizes confirmed plan values, records provenance, and stores no raw text", () => {
    const state = createOpenEnrollmentPilotState();
    state.payPeriods = 26;
    const result = applyConfirmedOpenEnrollmentFacts({
      state,
      target: "a",
      sourceCategory: "medical_plan_summary",
      facts: [
        fact({ key: "employee_premium", label: "Employee premium", value: 125, unit: "usd", cadence: "per_pay_period" }),
        fact({ key: "deductible", label: "Deductible", value: 1500, unit: "usd", cadence: "annual" }),
        fact({ key: "out_of_pocket_maximum", label: "Out-of-pocket maximum", value: 5000, unit: "usd", cadence: "annual" }),
      ],
    });

    expect(result.state.plans.a.annualPremium).toBe(3250);
    expect(result.state.plans.a.deductible).toBe(1500);
    expect(result.state.plans.a.outOfPocketMaximum).toBe(5000);
    expect(result.state.documents["medical-sbcs"]).toBe("unknown");
    expect(result.state.sourceAssistance.a?.factKeys).toEqual([
      "employee_premium",
      "deductible",
      "out_of_pocket_maximum",
    ]);
    expect(JSON.stringify(result.state)).not.toContain("Employee premium $125");
  });

  it("does not guess an annual premium or vesting percentage when the source is ambiguous", () => {
    const state = createOpenEnrollmentPilotState();
    const result = applyConfirmedOpenEnrollmentFacts({
      state,
      target: "b",
      sourceCategory: "retirement_summary",
      facts: [
        fact({ key: "employee_premium", label: "Employee premium", value: 90, unit: "usd" }),
        fact({ key: "retirement_vesting_years", label: "Vesting period", value: 3, unit: "years" }),
      ],
    });

    expect(result.state.plans.b.annualPremium).toBeNull();
    expect(result.state.vestedPercent).toBeNull();
    expect(result.skippedFactKeys).toEqual(["employee_premium", "retirement_vesting_years"]);
  });

  it("maps a confirmed match rate but still requires the match limit and vested percentage", () => {
    const state = createOpenEnrollmentPilotState();
    const result = applyConfirmedOpenEnrollmentFacts({
      state,
      target: "a",
      sourceCategory: "retirement_summary",
      facts: [fact({ key: "retirement_match_percent", label: "Employer match", value: 100, unit: "percent" })],
    });

    expect(result.state.retirementOffered).toBe("yes");
    expect(result.state.retirementMatchStatus).toBe("known");
    expect(result.state.matchRatePercent).toBe(100);
    expect(result.state.matchLimitPercent).toBeNull();
    expect(result.state.vestedPercent).toBeNull();
  });
});
