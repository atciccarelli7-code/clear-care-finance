import { describe, expect, it } from "vitest";
import { evaluateHealthInsuranceCostShareDecision } from "@/lib/healthInsuranceCostShareDecision";

const baseInput = {
  monthlyPremium: 180,
  annualDeductible: 1_500,
  deductibleMet: 0,
  outOfPocketMaximum: 6_000,
  outOfPocketMet: 0,
  allowedAmountPerVisit: 1_000,
  numberOfVisits: 2,
  costRule: "deductible_then_coinsurance" as const,
  coinsurancePercent: 20,
  networkStatus: "covered_in_network" as const,
  generatedAt: new Date("2026-08-01T12:00:00-04:00"),
};

describe("health insurance cost-share decision", () => {
  it("fails closed when the service-specific plan rule is unknown", () => {
    const result = evaluateHealthInsuranceCostShareDecision({ ...baseInput, costRule: "unknown_or_other", coinsurancePercent: undefined });
    expect(result.state).toBe("verify_plan_rule");
    expect(result.estimatedPatientCost).toBeNull();
    expect(result.view.metricGroups[0].metrics.find((metric) => metric.label === "Estimated patient cost")?.value).toBe("Not estimated");
  });

  it("applies the deductible before coinsurance without adding a copay", () => {
    const result = evaluateHealthInsuranceCostShareDecision(baseInput);
    expect(result.state).toBe("deductible_applies_first");
    expect(result.deductibleApplied).toBe(1_500);
    expect(result.coinsuranceApplied).toBe(100);
    expect(result.copayApplied).toBe(0);
    expect(result.estimatedPatientCost).toBe(1_600);
  });

  it("limits confirmed covered in-network cost sharing to remaining out-of-pocket room", () => {
    const result = evaluateHealthInsuranceCostShareDecision({ ...baseInput, outOfPocketMet: 5_500 });
    expect(result.state).toBe("out_of_pocket_cap_likely_limits");
    expect(result.estimatedPatientCostBeforeCap).toBe(1_600);
    expect(result.estimatedPatientCost).toBe(500);
    expect(result.capProtection).toBe(1_100);
  });

  it("does not apply the cap when coverage or network status is uncertain", () => {
    const result = evaluateHealthInsuranceCostShareDecision({ ...baseInput, outOfPocketMet: 5_500, networkStatus: "unknown_or_out_of_network" });
    expect(result.state).toBe("verify_network_or_coverage");
    expect(result.estimatedPatientCost).toBe(1_600);
    expect(result.capProtection).toBeNull();
  });

  it("models a fixed copay without consuming the deductible", () => {
    const result = evaluateHealthInsuranceCostShareDecision({
      ...baseInput,
      allowedAmountPerVisit: 220,
      numberOfVisits: 6,
      costRule: "copay_not_subject_to_deductible",
      copayPerVisit: 30,
      coinsurancePercent: undefined,
    });
    expect(result.state).toBe("copay_applies");
    expect(result.deductibleApplied).toBe(0);
    expect(result.copayApplied).toBe(180);
    expect(result.estimatedPatientCost).toBe(180);
  });

  it("models a deductible-first copay one visit at a time", () => {
    const result = evaluateHealthInsuranceCostShareDecision({ ...baseInput, costRule: "deductible_then_copay", copayPerVisit: 30, coinsurancePercent: undefined });
    expect(result.deductibleApplied).toBe(1_500);
    expect(result.copayApplied).toBe(30);
    expect(result.estimatedPatientCost).toBe(1_530);
  });

  it("blocks internally inconsistent accumulator inputs", () => {
    const result = evaluateHealthInsuranceCostShareDecision({ ...baseInput, deductibleMet: 2_000, outOfPocketMet: 7_000 });
    expect(result.state).toBe("insufficient_information");
    expect(result.errors.map((error) => error.code)).toEqual(expect.arrayContaining([
      "deductible_progress_exceeds_deductible",
      "oop_progress_exceeds_maximum",
    ]));
    expect(result.estimatedPatientCost).toBeNull();
  });
});
