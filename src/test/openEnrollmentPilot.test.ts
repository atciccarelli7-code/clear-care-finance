import { describe, expect, it } from "vitest";
import {
  ancillaryKeys,
  buildElectionPlan,
  createOpenEnrollmentPilotState,
  documentKeys,
  getMedicalRecommendation,
  getOpenEnrollmentProgress,
  getVerificationItems,
  isOpenEnrollmentStepComplete,
} from "@/premium/openEnrollmentPilot";

const completedFoundation = () => {
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
  state.ancillary.vision = "enroll";
  state.ancillaryAnnualPremium = 480;
  state.retirementOffered = "yes";
  state.eligibleCompensation = 80000;
  state.employeeContributionPercent = 6;
  state.retirementMatchStatus = "known";
  state.matchRatePercent = 100;
  state.matchLimitPercent = 6;
  state.vestedPercent = 100;
  return state;
};

describe("open enrollment pilot contract", () => {
  it("starts incomplete and measures useful completion rather than page views", () => {
    const state = createOpenEnrollmentPilotState();
    expect(getOpenEnrollmentProgress(state)).toBe(0);
    expect(isOpenEnrollmentStepComplete(state, "event")).toBe(false);
    expect(isOpenEnrollmentStepComplete(state, "review")).toBe(false);
  });

  it("keeps missing documents and verification choices visible without blocking progress", () => {
    const state = completedFoundation();
    state.documents["drug-network-resources"] = "missing";
    state.medicalElection = "verify";
    state.ancillary["long-term-disability"] = "verify";

    expect(isOpenEnrollmentStepComplete(state, "documents")).toBe(true);
    expect(isOpenEnrollmentStepComplete(state, "medical")).toBe(true);
    expect(isOpenEnrollmentStepComplete(state, "protection")).toBe(true);

    const items = getVerificationItems(state);
    expect(items.some((item) => item.includes("Prescription formulary"))).toBe(true);
    expect(items.some((item) => item.includes("medical-plan election"))).toBe(true);
    expect(items.some((item) => item.includes("long-term disability"))).toBe(true);
  });

  it("produces a bounded medical recommendation from the selected use scenario", () => {
    const result = getMedicalRecommendation(completedFoundation());
    expect(result.status).toBe("recommendation");
    expect(result.recommendedPlanId).toBe("a");
    expect(result.scenarioLabel).toBe("expected-use");
    expect(result.estimatedDifference).toBeGreaterThan(0);
    expect(result.explanation).toContain("Plan A");
  });

  it("fails into verification when network or prescription status is unresolved", () => {
    const state = completedFoundation();
    state.plans.a.networkStatus = "verify";
    const result = getMedicalRecommendation(state);
    expect(result.status).toBe("verification-first");
    expect(result.cautions.some((item) => item.includes("in network"))).toBe(true);
  });

  it("does not complete retirement when consequential inputs are missing", () => {
    const state = completedFoundation();
    state.eligibleCompensation = null;
    expect(isOpenEnrollmentStepComplete(state, "retirement")).toBe(false);
    expect(getVerificationItems(state).some((item) => item.includes("eligible compensation"))).toBe(true);

    state.eligibleCompensation = 80000;
    state.matchRatePercent = null;
    expect(isOpenEnrollmentStepComplete(state, "retirement")).toBe(false);
    expect(getVerificationItems(state).some((item) => item.includes("match rate"))).toBe(true);
  });

  it("builds a complete election plan without presenting payroll deductions as take-home pay", () => {
    const plan = buildElectionPlan(completedFoundation());
    expect(plan.medicalSelection).toBe("Plan A");
    expect(plan.accountSelection).toBe("HSA");
    expect(plan.retirementSelection).toContain("Contribute 6%");
    expect(plan.estimatedAnnualPayrollElections).toBe(9680);
    expect(plan.estimatedPerPaycheckElections).toBeCloseTo(372.31, 2);
    expect(plan.ancillarySelections).toHaveLength(ancillaryKeys.length);
  });

  it("reaches 100% only after the final review acknowledgement", () => {
    const state = completedFoundation();
    expect(getOpenEnrollmentProgress(state)).toBe(88);
    state.finalReviewAcknowledged = true;
    expect(getOpenEnrollmentProgress(state)).toBe(100);
  });
});
