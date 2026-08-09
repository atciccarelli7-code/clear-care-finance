import type { MedicareCandidate, MedicareCoverageState, MedicareStageId } from "../medicare/contracts.js";

export type MedicareArchitectureResult = {
  result: "original-first" | "advantage-first" | "balanced" | "verification-required";
  headline: string;
  reasons: string[];
  blockers: string[];
  assistancePathway: boolean;
};

const high = (value: string) => value === "high";
const low = (value: string) => value === "low";

export const evaluateMedicareArchitecture = (state: MedicareCoverageState): MedicareArchitectureResult => {
  const reasons: string[] = [];
  const blockers: string[] = [];
  let originalScore = 0;
  let advantageScore = 0;

  if (high(state.priorities.providerFreedom)) { originalScore += 3; reasons.push("Broad provider choice is a high priority."); }
  if (high(state.priorities.specialistAccess)) { originalScore += 2; reasons.push("Direct specialist access matters strongly."); }
  if (high(state.priorities.travelFlexibility) || state.providers.splitResidence === "yes" || state.providers.routineCareAway === "yes") {
    originalScore += 3;
    reasons.push("Routine care across regions or travel flexibility matters.");
  }
  if (low(state.priorities.networkTolerance)) { originalScore += 2; reasons.push("There is low tolerance for managing a plan network."); }
  if (low(state.priorities.referralTolerance)) originalScore += 1;
  if (low(state.priorities.priorAuthorizationTolerance)) { originalScore += 2; reasons.push("There is low tolerance for prior authorization restrictions."); }

  if (high(state.priorities.lowerFixedPremium)) { advantageScore += 2; reasons.push("A lower additional fixed premium is a high priority."); }
  if (high(state.priorities.integratedBenefits)) { advantageScore += 1; reasons.push("Bundled coverage and benefits are preferred."); }
  if (high(state.priorities.networkTolerance)) { advantageScore += 2; reasons.push("A managed provider network is acceptable."); }
  if (high(state.priorities.referralTolerance)) advantageScore += 1;
  if (high(state.priorities.priorAuthorizationTolerance)) advantageScore += 1;

  const timingNeedsVerification =
    state.situation.context === "retiring-after-65" ||
    state.situation.hsaContributions === "yes" ||
    (state.situation.coverageSource === "active-employer" && state.situation.employerSize === "unsure") ||
    state.situation.creditableDrugCoverage === "unsure";
  if (timingNeedsVerification) blockers.push("Enrollment timing, employer coordination, HSA timing, or creditable drug coverage still needs official confirmation.");

  const heavyDrugNeed = state.prescriptions.specialtyMedication === "yes" || high(state.prescriptions.costConcern);
  const drugVerified = state.prescriptions.planFinderComplete === "yes" && state.prescriptions.formularyChecked === "yes" && state.prescriptions.pharmacyChecked === "yes";
  if (heavyDrugNeed && !drugVerified) blockers.push("Prescription coverage is decision-critical, but Plan Finder, formulary, and pharmacy verification are incomplete.");

  if (
    state.situation.currentArchitecture === "medicare-advantage" &&
    state.situation.context === "already-enrolled" &&
    state.situation.coverageChangeInterest === "consider-original"
  ) {
    blockers.push("Before assuming a switch to Original Medicare is financially equivalent, verify Medigap availability, guaranteed-issue rights, underwriting, timing, and state protections.");
  }

  const answeredPriorities = Object.values(state.priorities).filter((value) => value !== "unsure").length;
  if (answeredPriorities < 4) blockers.push("Not enough preference information is verified to favor either coverage structure.");

  if (blockers.length) {
    return {
      result: "verification-required",
      headline: "More verification is needed before one coverage structure deserves priority.",
      reasons,
      blockers,
      assistancePathway: state.situation.limitedIncomeHelp !== "no",
    };
  }
  if (originalScore >= advantageScore + 3) {
    return {
      result: "original-first",
      headline: "Your priorities point more strongly toward investigating Original Medicare with appropriate drug and supplemental coverage first.",
      reasons,
      blockers,
      assistancePathway: state.situation.limitedIncomeHelp === "yes",
    };
  }
  if (advantageScore >= originalScore + 3) {
    return {
      result: "advantage-first",
      headline: "A Medicare Advantage structure may be worth comparing first, but each candidate still requires provider, drug, cost, and rule verification.",
      reasons,
      blockers,
      assistancePathway: state.situation.limitedIncomeHelp === "yes",
    };
  }
  return {
    result: "balanced",
    headline: "Your answers do not clearly favor either coverage structure yet.",
    reasons,
    blockers,
    assistancePathway: state.situation.limitedIncomeHelp === "yes",
  };
};

const numberOrZero = (value: number | null) => value ?? 0;

export const calculateMedicareCandidateCost = (candidate: MedicareCandidate) => {
  const values = candidate.cost;
  const isAdvantage = candidate.structure.startsWith("medicare-advantage");
  const requiredPremiums = isAdvantage
    ? [values.partBMonthlyPremium, values.additionalMonthlyPremium]
    : candidate.structure === "original-with-part-d"
      ? [values.partBMonthlyPremium, values.partDMonthlyPremium]
      : candidate.structure === "original-with-medigap"
        ? [values.partBMonthlyPremium, values.partDMonthlyPremium, values.medigapMonthlyPremium]
        : candidate.structure === "original"
          ? [values.partBMonthlyPremium]
          : [];
  const premiumsComplete = requiredPremiums.length > 0 && requiredPremiums.every((value) => value !== null);
  const fixedAnnualPremiums = premiumsComplete
    ? requiredPremiums.reduce<number>((sum, value) => sum + numberOrZero(value), 0) * 12
    : null;
  const expectedKnown = values.expectedMedicalCostSharing !== null && values.expectedAnnualDrugCost !== null;
  const expectedUse = fixedAnnualPremiums !== null && expectedKnown
    ? fixedAnnualPremiums + numberOrZero(values.medicalDeductible) + numberOrZero(values.expectedMedicalCostSharing) + numberOrZero(values.expectedAnnualDrugCost) + numberOrZero(values.otherAnnualVerifiedCost)
    : null;
  const higherUse = fixedAnnualPremiums !== null && isAdvantage && values.medicalMaximumOutOfPocket !== null && values.expectedAnnualDrugCost !== null
    ? fixedAnnualPremiums + values.medicalMaximumOutOfPocket + values.expectedAnnualDrugCost + numberOrZero(values.otherAnnualVerifiedCost)
    : null;
  const limitations = [
    ...(fixedAnnualPremiums === null ? ["No premium total: choose a supported coverage structure and enter every applicable monthly premium, including an explicit $0 where verified."] : []),
    ...(!expectedKnown ? ["No expected-use total: expected medical and annual drug costs are incomplete."] : []),
    ...(!isAdvantage ? ["Original Medicare has no general annual medical out-of-pocket cap unless other coverage applies; this tool does not invent one."] : []),
    ...(isAdvantage && values.medicalMaximumOutOfPocket === null ? ["No higher-use total: the candidate's medical maximum out-of-pocket is not entered."] : []),
    "The expected annual drug cost should come from Medicare Plan Finder and already include the drug deductible; this calculator does not add the drug deductible a second time.",
    "Primary-care, specialist, inpatient, and outpatient entries are evidence fields; expected-use math adds the medical deductible to an annual medical cost-sharing estimate entered after that deductible and does not multiply visit assumptions for you.",
    "The higher-use Medicare Advantage scenario combines the medical maximum out-of-pocket with the entered expected annual drug cost; it is not a combined medical-and-drug maximum.",
    "Dental, vision, hearing, long-term custodial care, non-covered services, out-of-network exposure, and drug costs outside the entered estimate may not be captured.",
  ];
  return { fixedAnnualPremiums, expectedUse, higherUse, limitations };
};

export const verificationSummary = (candidate: MedicareCandidate) => {
  const statuses = Object.values(candidate.verification);
  const resolved = statuses.filter((value) => value === "confirmed" || value === "not-applicable").length;
  const changed = statuses.filter((value) => value === "changed-next-year").length;
  const needsSource = statuses.filter((value) => value === "source-needed" || value === "not-confirmed").length;
  const evidenceRecorded = Object.values(candidate.evidenceSources).filter((value) => value !== "not-recorded").length;
  const evidenceDated = Object.values(candidate.evidenceDates).filter(Boolean).length;
  return { total: statuses.length, resolved, changed, needsSource, evidenceRecorded, evidenceDated, complete: statuses.length > 0 && resolved === statuses.length };
};

export const medicareProgress = (completedStages: MedicareStageId[]) => Math.round((new Set(completedStages).size / 8) * 100);
