import { describe, expect, it } from "vitest";
import { buildDecisionTrace } from "@/premium/decisionTrace";
import {
  ancillaryKeys,
  createOpenEnrollmentPilotState,
  documentKeys,
} from "@/premium/openEnrollmentPilot";

const completedState = () => {
  const state = createOpenEnrollmentPilotState();
  state.eventType = "annual";
  state.deadline = "2026-11-15";
  state.coverageTier = "employee-only";
  state.otherCoverageAvailable = "no";
  state.healthcareUse = "expected";
  state.decisionPriority = "balanced";
  documentKeys.forEach((key) => { state.documents[key] = "ready"; });
  state.plans.a = {
    label: "Plan A",
    annualPremium: 2400,
    deductible: 1500,
    coinsurancePercent: 20,
    outOfPocketMaximum: 5000,
    employerAccountContribution: 500,
    expectedAllowedCosts: 3000,
    networkStatus: "confirmed",
    prescriptionStatus: "confirmed",
  };
  state.plans.b = {
    label: "Plan B",
    annualPremium: 4200,
    deductible: 500,
    coinsurancePercent: 10,
    outOfPocketMaximum: 3000,
    employerAccountContribution: 0,
    expectedAllowedCosts: 3000,
    networkStatus: "confirmed",
    prescriptionStatus: "confirmed",
  };
  state.medicalElection = "a";
  state.accountElection = "hsa";
  state.annualAccountContribution = 2000;
  state.dependentCareFsa = "not-offered";
  state.payPeriods = 26;
  ancillaryKeys.forEach((key) => { state.ancillary[key] = "decline"; });
  state.ancillary.dental = "enroll";
  state.ancillaryAnnualPremium = 360;
  state.retirementOffered = "yes";
  state.eligibleCompensation = 80000;
  state.employeeContributionPercent = 6;
  state.retirementMatchStatus = "known";
  state.matchRatePercent = 100;
  state.matchLimitPercent = 6;
  state.vestedPercent = 100;
  return state;
};

describe("benefits decision trace", () => {
  it("starts in verification-required status and exposes source gaps", () => {
    const trace = buildDecisionTrace(createOpenEnrollmentPilotState());
    expect(trace.status).toBe("verification-required");
    expect(trace.sourceCoverage.unknown).toBe(documentKeys.length);
    expect(trace.changeTriggers.some((item) => item.includes("Status has not been confirmed"))).toBe(true);
    expect(trace.verificationItems.length).toBeGreaterThan(0);
  });

  it("distinguishes a complete provisional plan from an acknowledged supported record", () => {
    const state = completedState();
    const provisional = buildDecisionTrace(state);
    expect(provisional.status).toBe("provisional");
    expect(provisional.sourceCoverage.ready).toBe(documentKeys.length);
    expect(provisional.verificationItems).toHaveLength(0);

    state.finalReviewAcknowledged = true;
    const supported = buildDecisionTrace(state);
    expect(supported.status).toBe("supported");
    expect(supported.label).toBe("Supported planning record");
    expect(supported.summary).toContain("Official enrollment materials");
  });

  it("downgrades the trace when a source or consequential network fact needs verification", () => {
    const state = completedState();
    state.documents["drug-network-resources"] = "missing";
    state.plans.a.networkStatus = "verify";
    state.finalReviewAcknowledged = true;

    const trace = buildDecisionTrace(state);
    expect(trace.status).toBe("verification-required");
    expect(trace.sourceCoverage.missing).toBe(1);
    expect(trace.changeTriggers.some((item) => item.includes("Prescription formulary"))).toBe(true);
    expect(trace.changeTriggers.some((item) => item.includes("in network"))).toBe(true);
  });

  it("documents bounded assumptions instead of producing a false precision score", () => {
    const trace = buildDecisionTrace(completedState());
    expect(trace.assumptions.some((item) => item.includes("copays"))).toBe(true);
    expect(trace.assumptions.some((item) => item.includes("not take-home pay"))).toBe(true);
    expect(trace).not.toHaveProperty("confidenceScore");
  });
});
