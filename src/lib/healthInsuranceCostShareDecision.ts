import type { DecisionOutcomeView } from "@/lib/decisionOutcome";

export type HealthInsuranceCostRule =
  | "copay_not_subject_to_deductible"
  | "deductible_then_coinsurance"
  | "deductible_then_copay"
  | "unknown_or_other";

export type HealthInsuranceNetworkStatus =
  | "covered_in_network"
  | "unknown_or_out_of_network";

export type HealthInsuranceCostShareDecisionState =
  | "verify_plan_rule"
  | "verify_network_or_coverage"
  | "out_of_pocket_cap_likely_limits"
  | "copay_applies"
  | "deductible_applies_first"
  | "post_deductible_cost_sharing"
  | "insufficient_information";

export type HealthInsuranceCostShareDecisionInput = {
  monthlyPremium: number;
  annualDeductible: number;
  deductibleMet: number;
  outOfPocketMaximum: number;
  outOfPocketMet: number;
  allowedAmountPerVisit: number;
  numberOfVisits: number;
  costRule: HealthInsuranceCostRule;
  copayPerVisit?: number;
  coinsurancePercent?: number;
  networkStatus: HealthInsuranceNetworkStatus;
  generatedAt?: Date;
};

export type HealthInsuranceCostShareValidationError = {
  field: string;
  code: string;
  message: string;
};

export type HealthInsuranceCostShareDecision = {
  state: HealthInsuranceCostShareDecisionState;
  errors: HealthInsuranceCostShareValidationError[];
  annualPremium: number;
  totalAllowedAmount: number;
  remainingDeductibleBeforeCare: number;
  remainingOutOfPocketBeforeCare: number;
  deductibleApplied: number | null;
  copayApplied: number | null;
  coinsuranceApplied: number | null;
  estimatedPatientCostBeforeCap: number | null;
  estimatedPatientCost: number | null;
  capProtection: number | null;
  remainingOutOfPocketAfterCare: number | null;
  estimatedAnnualPremiumPlusCare: number | null;
  view: DecisionOutcomeView<HealthInsuranceCostShareDecisionState>;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const money = (value: number) => currency.format(Number.isFinite(value) ? value : 0);
const percent = (value: number) => `${Number(value.toFixed(2))}%`;
const finite = (value: number) => Number.isFinite(value);

const validate = (input: HealthInsuranceCostShareDecisionInput) => {
  const errors: HealthInsuranceCostShareValidationError[] = [];
  const bounded = (
    field: string,
    value: number | undefined,
    minimum: number,
    maximum: number,
    message: string,
  ) => {
    if (value === undefined || !finite(value) || value < minimum || value > maximum) {
      errors.push({ field, code: `invalid_${field}`, message });
    }
  };

  bounded("monthlyPremium", input.monthlyPremium, 0, 100_000, "Enter a monthly premium from $0 to $100,000.");
  bounded("annualDeductible", input.annualDeductible, 0, 1_000_000, "Enter an annual deductible from $0 to $1,000,000.");
  bounded("deductibleMet", input.deductibleMet, 0, 1_000_000, "Enter deductible progress from $0 to $1,000,000.");
  bounded("outOfPocketMaximum", input.outOfPocketMaximum, 0.01, 1_000_000, "Enter an out-of-pocket maximum greater than $0.");
  bounded("outOfPocketMet", input.outOfPocketMet, 0, 1_000_000, "Enter out-of-pocket progress from $0 to $1,000,000.");
  bounded("allowedAmountPerVisit", input.allowedAmountPerVisit, 0.01, 1_000_000, "Enter an allowed amount greater than $0.");
  bounded("numberOfVisits", input.numberOfVisits, 1, 1_000, "Enter between 1 and 1,000 visits.");

  if (finite(input.numberOfVisits) && !Number.isInteger(input.numberOfVisits)) {
    errors.push({ field: "numberOfVisits", code: "visits_must_be_whole", message: "Enter a whole number of visits." });
  }
  if (finite(input.deductibleMet) && finite(input.annualDeductible) && input.deductibleMet > input.annualDeductible) {
    errors.push({ field: "deductibleMet", code: "deductible_progress_exceeds_deductible", message: "Deductible progress cannot exceed the annual deductible." });
  }
  if (finite(input.outOfPocketMet) && finite(input.outOfPocketMaximum) && input.outOfPocketMet > input.outOfPocketMaximum) {
    errors.push({ field: "outOfPocketMet", code: "oop_progress_exceeds_maximum", message: "Out-of-pocket progress cannot exceed the out-of-pocket maximum." });
  }

  if (input.costRule === "copay_not_subject_to_deductible" || input.costRule === "deductible_then_copay") {
    bounded("copayPerVisit", input.copayPerVisit, 0, 1_000_000, "Enter a copay from $0 to $1,000,000.");
  }
  if (input.costRule === "deductible_then_coinsurance") {
    bounded("coinsurancePercent", input.coinsurancePercent, 0, 100, "Enter coinsurance from 0% to 100%.");
  }

  return errors;
};

const costRuleLabel = (input: HealthInsuranceCostShareDecisionInput) => {
  if (input.costRule === "copay_not_subject_to_deductible") {
    return `${money(input.copayPerVisit ?? 0)} copay per visit; service not subject to the deductible`;
  }
  if (input.costRule === "deductible_then_coinsurance") {
    return `Pay the allowed amount until the deductible is met, then ${percent(input.coinsurancePercent ?? 0)} coinsurance`;
  }
  if (input.costRule === "deductible_then_copay") {
    return `Pay the allowed amount until the deductible is met, then ${money(input.copayPerVisit ?? 0)} per visit`;
  }
  return "Unknown, combined, separate, or otherwise unsupported cost-sharing rule";
};

const calculateDeductibleThenCopay = (
  input: HealthInsuranceCostShareDecisionInput,
  remainingDeductible: number,
) => {
  let deductibleApplied = 0;
  let copayApplied = 0;
  let deductibleLeft = remainingDeductible;

  for (let visit = 0; visit < input.numberOfVisits; visit += 1) {
    if (deductibleLeft <= 0) {
      copayApplied += Math.min(input.copayPerVisit ?? 0, input.allowedAmountPerVisit);
      continue;
    }

    const deductibleForVisit = Math.min(deductibleLeft, input.allowedAmountPerVisit);
    deductibleApplied += deductibleForVisit;
    deductibleLeft -= deductibleForVisit;

    if (deductibleForVisit < input.allowedAmountPerVisit) {
      copayApplied += Math.min(input.copayPerVisit ?? 0, input.allowedAmountPerVisit - deductibleForVisit);
    }
  }

  return { deductibleApplied, copayApplied };
};

const determineState = (
  input: HealthInsuranceCostShareDecisionInput,
  remainingDeductible: number,
  capProtection: number | null,
): HealthInsuranceCostShareDecisionState => {
  if (input.costRule === "unknown_or_other") return "verify_plan_rule";
  if (input.networkStatus !== "covered_in_network") return "verify_network_or_coverage";
  if ((capProtection ?? 0) > 0) return "out_of_pocket_cap_likely_limits";
  if (input.costRule === "copay_not_subject_to_deductible") return "copay_applies";
  if (remainingDeductible > 0) return "deductible_applies_first";
  return "post_deductible_cost_sharing";
};

const stateCopy: Record<HealthInsuranceCostShareDecisionState, {
  label: string;
  interpretation: string;
  firstAction: string;
  reason: string;
  changingAssumption: string;
  caution: string;
}> = {
  verify_plan_rule: {
    label: "Verify how this service is actually cost-shared",
    interpretation: "The estimate stops because the plan rule is unknown, combined, or different from the supported copay and deductible models.",
    firstAction: "Open the current Summary of Benefits and Coverage and find the exact row for this service.",
    reason: "A deductible, copay, and coinsurance should not be added together automatically when the plan may apply them in different sequences.",
    changingAssumption: "Selecting a supported rule after confirming whether the service has a copay, is subject to the deductible, or uses coinsurance.",
    caution: "Do not use a generic cost-sharing formula when the SBC or insurer portal lists a service-specific rule.",
  },
  verify_network_or_coverage: {
    label: "Confirm coverage and network status before relying on the cap",
    interpretation: "A preliminary cost-share estimate may be possible, but the in-network out-of-pocket maximum should not be applied to care that is out of network, not covered, or still uncertain.",
    firstAction: "Confirm the provider, facility, service, and authorization status with the plan before the visit.",
    reason: "The out-of-pocket maximum generally protects covered in-network cost sharing, not every charge a provider may bill.",
    changingAssumption: "Confirming that the service and all involved providers are covered and in network.",
    caution: "Facility, professional, laboratory, imaging, anesthesia, and medication charges can follow separate network and cost-sharing rules.",
  },
  out_of_pocket_cap_likely_limits: {
    label: "The remaining out-of-pocket limit may cap this estimate",
    interpretation: "The modeled covered in-network cost sharing exceeds the remaining out-of-pocket room, so the plan-year limit may reduce the amount owed for covered benefits.",
    firstAction: "Verify the current out-of-pocket accumulator and confirm every expected charge counts toward the same in-network limit.",
    reason: "The estimated patient cost before the cap is higher than the entered remaining out-of-pocket amount.",
    changingAssumption: "A different accumulator balance, separate individual or family limit, excluded service, or out-of-network charge could change the protection.",
    caution: "Premiums, non-covered services, out-of-network care, balance bills, and costs above the allowed amount may not count toward the limit.",
  },
  copay_applies: {
    label: "A fixed copay appears to drive the visit estimate",
    interpretation: "Under the selected rule, each covered in-network visit uses the entered copay instead of first applying the deductible.",
    firstAction: "Confirm that the copay applies to this exact service and that no separate facility, test, or professional charge is expected.",
    reason: "The selected service rule is a fixed copay that is not subject to the deductible.",
    changingAssumption: "A deductible requirement, separate charge, different provider type, or different network tier could change the result.",
    caution: "A copay shown for an office visit may not include labs, imaging, procedures, medications, or a hospital facility fee.",
  },
  deductible_applies_first: {
    label: "The remaining deductible appears to drive the estimate",
    interpretation: "Under the selected rule, some or all of the allowed amount is paid before post-deductible copay or coinsurance begins.",
    firstAction: "Check the latest deductible accumulator and obtain an allowed-amount estimate for the specific service and provider.",
    reason: "The entered deductible has remaining room and the selected service is subject to it.",
    changingAssumption: "New claims, a different allowed amount, a service-specific deductible exception, or a different cost-sharing row could change the estimate.",
    caution: "The provider's billed charge is not the same as the plan's allowed amount, and pending claims can change the accumulator.",
  },
  post_deductible_cost_sharing: {
    label: "Post-deductible cost sharing appears to drive the estimate",
    interpretation: "The entered deductible is already met, so the selected copay or coinsurance rule is the main modeled patient responsibility before the out-of-pocket limit.",
    firstAction: "Confirm the current accumulator and the service-specific copay or coinsurance percentage before scheduling or paying.",
    reason: "The entered deductible has no remaining balance under the selected service rule.",
    changingAssumption: "A separate deductible, a reset plan year, a different network tier, or a service-specific exception could change the result.",
    caution: "A family plan may have individual and family accumulators, and separate prescription or out-of-network deductibles may apply.",
  },
  insufficient_information: {
    label: "Correct the highlighted plan assumptions before using the estimate",
    interpretation: "One or more values are missing, outside the supported range, or internally inconsistent.",
    firstAction: "Return to the form and replace defaults with values from the current SBC, insurer portal, EOB, or provider estimate.",
    reason: "The calculator did not have enough valid information to produce a bounded cost-share estimate.",
    changingAssumption: "Valid premium, deductible, accumulator, allowed-amount, visit-count, and service-rule values will allow the estimate to run.",
    caution: "Do not use a partial or defaulted result to approve care, waive an appeal, or pay a bill.",
  },
};

export const evaluateHealthInsuranceCostShareDecision = (
  input: HealthInsuranceCostShareDecisionInput,
): HealthInsuranceCostShareDecision => {
  const errors = validate(input);
  const generatedAt = input.generatedAt ?? new Date();
  const annualPremium = errors.length ? 0 : input.monthlyPremium * 12;
  const totalAllowedAmount = errors.length ? 0 : input.allowedAmountPerVisit * input.numberOfVisits;
  const remainingDeductibleBeforeCare = errors.length
    ? 0
    : Math.max(input.annualDeductible - input.deductibleMet, 0);
  const remainingOutOfPocketBeforeCare = errors.length
    ? 0
    : Math.max(input.outOfPocketMaximum - input.outOfPocketMet, 0);

  let deductibleApplied: number | null = null;
  let copayApplied: number | null = null;
  let coinsuranceApplied: number | null = null;
  let estimatedPatientCostBeforeCap: number | null = null;

  if (!errors.length && input.costRule !== "unknown_or_other") {
    if (input.costRule === "copay_not_subject_to_deductible") {
      deductibleApplied = 0;
      coinsuranceApplied = 0;
      copayApplied = Math.min(input.copayPerVisit ?? 0, input.allowedAmountPerVisit) * input.numberOfVisits;
      estimatedPatientCostBeforeCap = copayApplied;
    } else if (input.costRule === "deductible_then_coinsurance") {
      deductibleApplied = Math.min(totalAllowedAmount, remainingDeductibleBeforeCare);
      const amountAfterDeductible = Math.max(totalAllowedAmount - deductibleApplied, 0);
      copayApplied = 0;
      coinsuranceApplied = amountAfterDeductible * ((input.coinsurancePercent ?? 0) / 100);
      estimatedPatientCostBeforeCap = deductibleApplied + coinsuranceApplied;
    } else {
      const calculated = calculateDeductibleThenCopay(input, remainingDeductibleBeforeCare);
      deductibleApplied = calculated.deductibleApplied;
      copayApplied = calculated.copayApplied;
      coinsuranceApplied = 0;
      estimatedPatientCostBeforeCap = deductibleApplied + copayApplied;
    }
  }

  const capCanApply = !errors.length
    && input.costRule !== "unknown_or_other"
    && input.networkStatus === "covered_in_network";
  const estimatedPatientCost = estimatedPatientCostBeforeCap === null
    ? null
    : capCanApply
      ? Math.min(estimatedPatientCostBeforeCap, remainingOutOfPocketBeforeCare)
      : estimatedPatientCostBeforeCap;
  const capProtection = estimatedPatientCostBeforeCap === null || estimatedPatientCost === null || !capCanApply
    ? null
    : Math.max(estimatedPatientCostBeforeCap - estimatedPatientCost, 0);
  const remainingOutOfPocketAfterCare = estimatedPatientCost === null || !capCanApply
    ? null
    : Math.max(remainingOutOfPocketBeforeCare - estimatedPatientCost, 0);
  const estimatedAnnualPremiumPlusCare = estimatedPatientCost === null
    ? null
    : annualPremium + estimatedPatientCost;

  const state: HealthInsuranceCostShareDecisionState = errors.length
    ? "insufficient_information"
    : determineState(input, remainingDeductibleBeforeCare, capProtection);
  const copy = stateCopy[state];
  const estimatedCostValue = estimatedPatientCost === null ? "Not estimated" : money(estimatedPatientCost);
  const beforeCapValue = estimatedPatientCostBeforeCap === null ? "Not estimated" : money(estimatedPatientCostBeforeCap);
  const capProtectionValue = capProtection === null ? "Not applied" : money(capProtection);
  const annualTotalValue = estimatedAnnualPremiumPlusCare === null ? "Not estimated" : money(estimatedAnnualPremiumPlusCare);

  const view: DecisionOutcomeView<HealthInsuranceCostShareDecisionState> = {
    generatedAt: generatedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    stateId: state,
    stateLabel: copy.label,
    interpretation: copy.interpretation,
    primaryReason: copy.reason,
    changingAssumption: copy.changingAssumption,
    primaryCaution: copy.caution,
    additionalCautions: [
      "This models one service pattern. Separate facility, professional, laboratory, imaging, anesthesia, medication, and out-of-network charges may follow different rules.",
      "The insurer's current claim accumulator and the plan's allowed amount control; provider charges and estimates may differ.",
      "Prior authorization, medical-necessity, referral, network-tier, and coverage exclusions can change whether the plan pays.",
    ],
    firstAction: copy.firstAction,
    actionSequence: [
      "Open the current Summary of Benefits and Coverage and find the exact row for the service.",
      "Confirm the provider and facility network status, required authorization, allowed amount, and current deductible and out-of-pocket accumulators.",
      "Compare the processed EOB with the provider bill before paying a final balance.",
    ],
    verificationChecklist: [
      "Exact service-specific rule: copay, deductible then coinsurance, deductible then copay, or another structure",
      "Covered benefit, in-network provider, in-network facility, and any required referral or prior authorization",
      "Current allowed amount or a plan-recognized estimate rather than the provider's billed charge",
      "Current individual and family deductible and out-of-pocket accumulator balances",
      "Whether separate professional, facility, laboratory, imaging, anesthesia, drug, or equipment claims are expected",
    ],
    assumptions: [
      { label: "Service rule", value: costRuleLabel(input), detail: "User-selected assumption; verify against the current SBC and insurer portal." },
      { label: "Coverage and network", value: input.networkStatus === "covered_in_network" ? "Covered and in network" : "Unknown or out of network" },
      { label: "Allowed amount per visit", value: money(input.allowedAmountPerVisit) },
      { label: "Number of visits", value: `${input.numberOfVisits}` },
      { label: "Deductible progress", value: `${money(input.deductibleMet)} of ${money(input.annualDeductible)}` },
      { label: "Out-of-pocket progress", value: `${money(input.outOfPocketMet)} of ${money(input.outOfPocketMaximum)}` },
      { label: "Monthly premium", value: money(input.monthlyPremium), detail: "Included in annual coverage cost but not in the out-of-pocket limit." },
    ],
    metricGroups: [
      {
        title: "Estimated patient cost for the entered care",
        metrics: [
          { label: "Total allowed amount", value: money(totalAllowedAmount), detail: "Allowed amount entered × number of visits." },
          { label: "Deductible applied", value: deductibleApplied === null ? "Not estimated" : money(deductibleApplied) },
          { label: "Copays applied", value: copayApplied === null ? "Not estimated" : money(copayApplied) },
          { label: "Coinsurance applied", value: coinsuranceApplied === null ? "Not estimated" : money(coinsuranceApplied) },
          { label: "Patient cost before OOP cap", value: beforeCapValue },
          { label: "Estimated patient cost", value: estimatedCostValue, emphasis: state === "verify_plan_rule" ? "caution" : "primary" },
          { label: "Amount limited by entered OOP cap", value: capProtectionValue, detail: capCanApply ? "Covered in-network estimate only." : "Cap not applied until coverage and network are confirmed." },
          { label: "OOP room after entered care", value: remainingOutOfPocketAfterCare === null ? "Not estimated" : money(remainingOutOfPocketAfterCare) },
        ],
      },
      {
        title: "Annual coverage context",
        metrics: [
          { label: "Annual premium", value: money(annualPremium), detail: "Premiums generally do not count toward the out-of-pocket maximum." },
          { label: "Annual premium + entered care", value: annualTotalValue, emphasis: "supporting" },
        ],
      },
    ],
    portableSummary: [
      "Community Acquired Finance — patient cost-share decision summary",
      `Outcome: ${copy.label}`,
      `Service rule entered: ${costRuleLabel(input)}`,
      `Coverage and network: ${input.networkStatus === "covered_in_network" ? "Covered and in network" : "Unknown or out of network"}`,
      `Allowed amount per visit: ${money(input.allowedAmountPerVisit)}`,
      `Number of visits: ${input.numberOfVisits}`,
      `Remaining deductible before care: ${money(remainingDeductibleBeforeCare)}`,
      `Remaining out-of-pocket room before care: ${money(remainingOutOfPocketBeforeCare)}`,
      `Estimated patient cost before cap: ${beforeCapValue}`,
      `Estimated patient cost: ${estimatedCostValue}`,
      `Estimated annual premium plus entered care: ${annualTotalValue}`,
      `First action: ${copy.firstAction}`,
      "Verify the exact service row in the current SBC, network and authorization status, allowed amount, accumulators, processed EOB, and provider bill.",
      "Educational estimate only. The plan document, insurer's claim processing, and final EOB control.",
    ].join("\n"),
    educationalLimitation: "This educational estimate does not determine coverage, medical necessity, network status, authorization, claim adjudication, balance-billing rights, appeal rights, or the amount ultimately owed. The current plan documents, insurer records, processed EOB, and provider bill control.",
  };

  return {
    state,
    errors,
    annualPremium,
    totalAllowedAmount,
    remainingDeductibleBeforeCare,
    remainingOutOfPocketBeforeCare,
    deductibleApplied,
    copayApplied,
    coinsuranceApplied,
    estimatedPatientCostBeforeCap,
    estimatedPatientCost,
    capProtection,
    remainingOutOfPocketAfterCare,
    estimatedAnnualPremiumPlusCare,
    view,
  };
};
