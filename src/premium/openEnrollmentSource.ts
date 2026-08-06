import {
  benefitDocumentKindSchema,
  extractedBenefitFactSchema,
  type BenefitDocumentKind,
  type ExtractedBenefitFact,
  type ExtractedBenefitFactKey,
} from "@/premium/documentIntakeContracts";
import {
  type OpenEnrollmentPilotState,
} from "@/premium/openEnrollmentPilot";

export type OpenEnrollmentSourceTarget = "a" | "b";

export type ApplyOpenEnrollmentSourceResult = {
  state: OpenEnrollmentPilotState;
  appliedFactKeys: ExtractedBenefitFactKey[];
  skippedFactKeys: ExtractedBenefitFactKey[];
};

const annualizePremium = (fact: ExtractedBenefitFact, payPeriods: number | null) => {
  if (fact.cadence === "annual") return fact.value;
  if (fact.cadence === "monthly") return fact.value * 12;
  if (fact.cadence === "per_pay_period" && typeof payPeriods === "number" && payPeriods > 0) {
    return fact.value * payPeriods;
  }
  return null;
};

export const applyConfirmedOpenEnrollmentFacts = ({
  state,
  facts,
  target,
  sourceCategory,
}: {
  state: OpenEnrollmentPilotState;
  facts: ExtractedBenefitFact[];
  target: OpenEnrollmentSourceTarget;
  sourceCategory: BenefitDocumentKind;
}): ApplyOpenEnrollmentSourceResult => {
  const category = benefitDocumentKindSchema.parse(sourceCategory);
  const plan = { ...state.plans[target] };
  const next = {
    ...state,
    plans: { ...state.plans, [target]: plan },
    sourceAssistance: { ...state.sourceAssistance },
    finalReviewAcknowledged: false,
  };
  const appliedFactKeys: ExtractedBenefitFactKey[] = [];
  const skippedFactKeys: ExtractedBenefitFactKey[] = [];

  facts.map((fact) => extractedBenefitFactSchema.parse(fact)).forEach((fact) => {
    let applied = true;
    switch (fact.key) {
      case "employee_premium": {
        const annualPremium = annualizePremium(fact, state.payPeriods);
        if (annualPremium === null) applied = false;
        else plan.annualPremium = annualPremium;
        break;
      }
      case "deductible":
        plan.deductible = fact.value;
        break;
      case "out_of_pocket_maximum":
        plan.outOfPocketMaximum = fact.value;
        break;
      case "employer_hsa_or_hra_contribution":
        plan.employerAccountContribution = fact.value;
        break;
      case "retirement_match_percent":
        next.retirementOffered = "yes";
        next.retirementMatchStatus = "known";
        next.matchRatePercent = fact.value;
        break;
      case "retirement_vesting_years":
        applied = false;
        break;
    }
    (applied ? appliedFactKeys : skippedFactKeys).push(fact.key);
  });

  if (appliedFactKeys.length) {
    next.sourceAssistance[target] = {
      sourceCategory: category,
      factKeys: [...new Set(appliedFactKeys)],
      confirmedAt: new Date().toISOString(),
    };
  }

  return { state: next, appliedFactKeys, skippedFactKeys };
};
