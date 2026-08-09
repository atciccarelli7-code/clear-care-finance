import { describe, expect, it } from "vitest";
import { emptyMedicareCoverageState, medicareCoverageStateSchema } from "@/medicare/contracts";
import { calculateMedicareCandidateCost, evaluateMedicareArchitecture, verificationSummary } from "@/lib/medicareCoverageDecision";

const answeredBase = () => {
  const state = emptyMedicareCoverageState();
  state.situation.creditableDrugCoverage = "yes";
  state.situation.limitedIncomeHelp = "no";
  state.priorities = {
    providerFreedom: "medium",
    specialistAccess: "medium",
    travelFlexibility: "medium",
    predictableCosts: "medium",
    lowerFixedPremium: "medium",
    integratedBenefits: "medium",
    networkTolerance: "medium",
    referralTolerance: "medium",
    priorAuthorizationTolerance: "medium",
  };
  return state;
};

describe("Medicare coverage architecture personas", () => {
  it("A: points provider-flexibility priorities toward broad-access structures without recommending a plan", () => {
    const state = answeredBase();
    state.priorities.providerFreedom = "high";
    state.priorities.specialistAccess = "high";
    state.priorities.travelFlexibility = "high";
    state.priorities.networkTolerance = "low";
    state.priorities.priorAuthorizationTolerance = "low";
    expect(evaluateMedicareArchitecture(state)).toMatchObject({ result: "original-first", blockers: [] });
  });

  it("B: says Medicare Advantage deserves investigation for a local network-comfortable person", () => {
    const state = answeredBase();
    state.priorities.lowerFixedPremium = "high";
    state.priorities.integratedBenefits = "high";
    state.priorities.networkTolerance = "high";
    state.priorities.referralTolerance = "high";
    state.priorities.priorAuthorizationTolerance = "high";
    expect(evaluateMedicareArchitecture(state)).toMatchObject({ result: "advantage-first", blockers: [] });
  });

  it("C: withholds a coverage conclusion until heavy prescription needs are officially verified", () => {
    const state = answeredBase();
    state.prescriptions.costConcern = "high";
    state.prescriptions.recurringPrescriptions = "yes";
    expect(evaluateMedicareArchitecture(state)).toMatchObject({ result: "verification-required" });
    expect(evaluateMedicareArchitecture(state).blockers.join(" ")).toMatch(/Plan Finder/i);
  });

  it("D: routes a person working past 65 with HSA questions to timing verification", () => {
    const state = answeredBase();
    state.situation.context = "retiring-after-65";
    state.situation.coverageSource = "active-employer";
    state.situation.hsaContributions = "yes";
    expect(evaluateMedicareArchitecture(state)).toMatchObject({ result: "verification-required" });
    expect(evaluateMedicareArchitecture(state).blockers.join(" ")).toMatch(/HSA timing/i);
  });

  it("E: exposes Medicaid, Medicare Savings Program, and Extra Help investigation without a SNP recommendation", () => {
    const state = answeredBase();
    state.situation.limitedIncomeHelp = "yes";
    const result = evaluateMedicareArchitecture(state);
    expect(result.assistancePathway).toBe(true);
    expect(result.headline).not.toMatch(/SNP|special needs plan/i);
  });

  it("F: blocks an assumed MA-to-Original equivalence until Medigap rights are verified", () => {
    const state = answeredBase();
    state.situation.context = "already-enrolled";
    state.situation.currentArchitecture = "medicare-advantage";
    state.situation.coverageChangeInterest = "consider-original";
    expect(evaluateMedicareArchitecture(state).blockers.join(" ")).toMatch(/Medigap availability.*guaranteed-issue.*underwriting/i);
  });

  it("does not impose the MA-to-Original warning when the current MA user is reviewing that same structure", () => {
    const state = answeredBase();
    state.situation.context = "already-enrolled";
    state.situation.currentArchitecture = "medicare-advantage";
    state.situation.coverageChangeInterest = "stay-review";
    expect(evaluateMedicareArchitecture(state).blockers.join(" ")).not.toMatch(/Medigap availability/i);
  });

  it("G: returns an explicit insufficient-information state", () => {
    const result = evaluateMedicareArchitecture(emptyMedicareCoverageState());
    expect(result.result).toBe("verification-required");
    expect(result.blockers.join(" ")).toMatch(/Not enough preference information/i);
  });

  it("H: organizes a caregiver decision without any beneficiary identifier field", () => {
    const state = answeredBase();
    state.situation.context = "caregiver";
    expect(evaluateMedicareArchitecture(state).headline).toBeTruthy();
    expect(Object.keys(state.situation).join(" ")).not.toMatch(/medicare number|member id|social security|beneficiary identifier/i);
  });
});

describe("Medicare candidate cost scenarios", () => {
  it("shows fixed, expected, and MA higher-use exposure only from entered values", () => {
    const state = emptyMedicareCoverageState();
    const candidate = state.candidates[0];
    candidate.structure = "medicare-advantage-ppo";
    candidate.cost.partBMonthlyPremium = 202.9;
    candidate.cost.additionalMonthlyPremium = 25;
    candidate.cost.expectedMedicalCostSharing = 1_000;
    candidate.cost.expectedAnnualDrugCost = 600;
    candidate.cost.medicalMaximumOutOfPocket = 6_000;
    expect(calculateMedicareCandidateCost(candidate)).toMatchObject({
      fixedAnnualPremiums: 2734.8,
      expectedUse: 4334.8,
      higherUse: 9334.8,
    });
  });

  it("does not fabricate an Original Medicare maximum exposure", () => {
    const candidate = emptyMedicareCoverageState().candidates[0];
    candidate.structure = "original-with-medigap";
    candidate.cost.partBMonthlyPremium = 202.9;
    candidate.cost.medigapMonthlyPremium = 180;
    expect(calculateMedicareCandidateCost(candidate).higherUse).toBeNull();
  });

  it("requires every structure-specific premium instead of treating a missing premium as zero", () => {
    const candidate = emptyMedicareCoverageState().candidates[0];
    candidate.structure = "original-with-medigap";
    candidate.cost.partBMonthlyPremium = 202.9;
    candidate.cost.medigapMonthlyPremium = 180;
    expect(calculateMedicareCandidateCost(candidate).fixedAnnualPremiums).toBeNull();
    candidate.cost.partDMonthlyPremium = 0;
    expect(calculateMedicareCandidateCost(candidate).fixedAnnualPremiums).toBeCloseTo(4594.8, 2);
  });
});

describe("Medicare candidate evidence ledger", () => {
  it("stores only a bounded source category and ISO checked date", () => {
    const state = emptyMedicareCoverageState();
    const candidate = state.candidates[0];
    candidate.verification.providers = "confirmed";
    candidate.evidenceSources.providers = "provider-confirmation";
    candidate.evidenceDates.providers = "2026-08-09";
    expect(verificationSummary(candidate)).toMatchObject({
      resolved: 1,
      evidenceRecorded: 1,
      evidenceDated: 1,
    });
    expect(medicareCoverageStateSchema.safeParse(state).success).toBe(true);
  });

  it("rejects free-form or malformed evidence values", () => {
    const state = emptyMedicareCoverageState();
    state.candidates[0].evidenceSources.providers = "provider-confirmation";
    state.candidates[0].evidenceDates.providers = "not-a-date";
    expect(medicareCoverageStateSchema.safeParse(state).success).toBe(false);
  });
});
