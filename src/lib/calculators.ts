export type InsuranceCostShareMode = "copay" | "coinsurance";

export interface HealthInsuranceEstimateInput {
  monthlyPremium: number;
  annualDeductible: number;
  deductibleMet: number;
  costShareMode: InsuranceCostShareMode;
  copayPerVisit: number;
  coinsuranceRate: number;
  allowedAmountPerVisit: number;
  visits: number;
  outOfPocketMaximum: number;
  outOfPocketMet: number;
}

export interface HealthInsuranceEstimate {
  annualPremium: number;
  totalAllowed: number;
  deductibleCost: number;
  postDeductibleCost: number;
  medicalCostSharing: number;
  insurancePays: number;
  totalAnnualCost: number;
  remainingDeductible: number;
  remainingOutOfPocket: number | null;
}

const nonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export const calculateHealthInsuranceEstimate = (
  input: HealthInsuranceEstimateInput,
): HealthInsuranceEstimate => {
  const monthlyPremium = nonNegative(input.monthlyPremium);
  const annualDeductible = nonNegative(input.annualDeductible);
  const deductibleMet = Math.min(nonNegative(input.deductibleMet), annualDeductible);
  const copayPerVisit = nonNegative(input.copayPerVisit);
  const coinsuranceRate = clamp(nonNegative(input.coinsuranceRate), 0, 100) / 100;
  const allowedAmountPerVisit = nonNegative(input.allowedAmountPerVisit);
  const visits = Math.floor(nonNegative(input.visits));
  const outOfPocketMaximum = nonNegative(input.outOfPocketMaximum);
  const hasOutOfPocketMaximum = outOfPocketMaximum > 0;
  const outOfPocketMet = hasOutOfPocketMaximum
    ? Math.min(nonNegative(input.outOfPocketMet), outOfPocketMaximum)
    : 0;

  let remainingDeductible = annualDeductible - deductibleMet;
  let remainingOutOfPocket = hasOutOfPocketMaximum
    ? outOfPocketMaximum - outOfPocketMet
    : Number.POSITIVE_INFINITY;
  let deductibleCost = 0;
  let postDeductibleCost = 0;
  let insurancePays = 0;

  for (let visit = 0; visit < visits; visit += 1) {
    const deductibleForVisit = Math.min(allowedAmountPerVisit, remainingDeductible);
    remainingDeductible -= deductibleForVisit;

    const afterDeductible = allowedAmountPerVisit - deductibleForVisit;
    const postDeductibleForVisit =
      input.costShareMode === "copay"
        ? Math.min(copayPerVisit, afterDeductible)
        : afterDeductible * coinsuranceRate;

    const appliedDeductible = Math.min(deductibleForVisit, remainingOutOfPocket);
    remainingOutOfPocket -= appliedDeductible;

    const appliedPostDeductible = Math.min(postDeductibleForVisit, remainingOutOfPocket);
    remainingOutOfPocket -= appliedPostDeductible;

    const patientPaysForVisit = appliedDeductible + appliedPostDeductible;
    deductibleCost += appliedDeductible;
    postDeductibleCost += appliedPostDeductible;
    insurancePays += allowedAmountPerVisit - patientPaysForVisit;
  }

  const annualPremium = monthlyPremium * 12;
  const totalAllowed = allowedAmountPerVisit * visits;
  const medicalCostSharing = deductibleCost + postDeductibleCost;

  return {
    annualPremium,
    totalAllowed,
    deductibleCost,
    postDeductibleCost,
    medicalCostSharing,
    insurancePays,
    totalAnnualCost: annualPremium + medicalCostSharing,
    remainingDeductible,
    remainingOutOfPocket: hasOutOfPocketMaximum ? remainingOutOfPocket : null,
  };
};
