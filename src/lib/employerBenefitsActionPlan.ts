export const BENEFIT_LIMITS_2026 = {
  year: 2026,
  retirementElectiveDeferral: 24_500,
  hsa: {
    selfOnly: 4_400,
    family: 8_750,
  },
} as const;

export type PayBasis = "salary" | "hourly";
export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export type RetirementPlanType = "403b" | "401k" | "other" | "not-sure";
export type MatchFormulaType = "percent-of-contribution" | "no-match" | "not-sure";
export type VestingStatus = "fully-vested" | "not-fully-vested" | "not-sure";
export type TaxTreatment = "traditional" | "roth" | "split" | "not-sure";
export type CoverageTier = "employee" | "employee-spouse" | "employee-children" | "family" | "not-sure";
export type YesNoUnknown = "yes" | "no" | "not-sure";
export type NetworkType = "ppo" | "hmo" | "epo" | "hdhp" | "other" | "not-sure";
export type HsaCoverage = "self-only" | "family" | "not-sure";

export interface EmployerBenefitsInput {
  pay: {
    basis: PayBasis;
    annualSalary: number | null;
    hourlyRate: number | null;
    hoursPerWeek: number | null;
    frequency: PayFrequency;
  };
  retirement: {
    planType: RetirementPlanType;
    employeeContributionPercent: number | null;
    matchType: MatchFormulaType;
    matchRatePercent: number | null;
    matchCeilingPercent: number | null;
    vestingStatus: VestingStatus;
    taxTreatment: TaxTreatment;
  };
  health: {
    premiumPerPaycheck: number | null;
    deductible: number | null;
    outOfPocketMaximum: number | null;
    copayOrCoinsurance: string | null;
    coverageTier: CoverageTier;
    hsaEligible: YesNoUnknown;
    networkType: NetworkType;
  };
  hsa: {
    employeeAnnualContribution: number | null;
    employerAnnualContribution: number | null;
    coverage: HsaCoverage;
  };
}

export interface EmployerBenefitsActionPlan {
  annualPay: number | null;
  payPeriods: number;
  retirement: {
    employeePerPaycheck: number | null;
    employeeAnnual: number | null;
    estimatedEmployerMatch: number | null;
    capturesStatedMatch: boolean | null;
    missing: string[];
    assumptions: string[];
  };
  health: {
    annualPremium: number | null;
    deductible: number | null;
    outOfPocketMaximum: number | null;
    warning: string;
  };
  hsa: {
    limit: number | null;
    totalContributions: number | null;
    remainingRoom: number | null;
    possibleExcess: number | null;
    warning: string | null;
  };
  knownAnnualEmployerValue: number;
  employerValueParts: string[];
  doThisFirst: string;
  flags: string[];
  questionsForHr: string[];
  documentsToKeep: string[];
  whatThisMeans: string;
  validationIssues: string[];
}

const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

const isFiniteNonNegative = (value: number | null): value is number =>
  value !== null && Number.isFinite(value) && value >= 0;

const isFinitePositive = (value: number | null): value is number =>
  value !== null && Number.isFinite(value) && value > 0;

const unique = (items: string[]) => Array.from(new Set(items));

export const getPayPeriods = (frequency: PayFrequency) => PAY_PERIODS[frequency];

export const calculateAnnualPay = (input: EmployerBenefitsInput["pay"]): number | null => {
  if (input.basis === "salary") return isFinitePositive(input.annualSalary) ? input.annualSalary : null;
  if (!isFinitePositive(input.hourlyRate) || !isFinitePositive(input.hoursPerWeek) || input.hoursPerWeek > 168) return null;
  return input.hourlyRate * input.hoursPerWeek * 52;
};

export const getInputValidationIssues = (input: EmployerBenefitsInput): string[] => {
  const issues: string[] = [];
  if (calculateAnnualPay(input.pay) === null) issues.push("Enter valid positive pay information before relying on the estimates.");
  if (input.retirement.employeeContributionPercent !== null && (!isFiniteNonNegative(input.retirement.employeeContributionPercent) || input.retirement.employeeContributionPercent > 100)) {
    issues.push("Employee retirement contribution must be between 0% and 100%.");
  }
  if (input.retirement.matchRatePercent !== null && (!isFiniteNonNegative(input.retirement.matchRatePercent) || input.retirement.matchRatePercent > 500)) {
    issues.push("Employer match rate must be between 0% and 500%.");
  }
  if (input.retirement.matchCeilingPercent !== null && (!isFiniteNonNegative(input.retirement.matchCeilingPercent) || input.retirement.matchCeilingPercent > 100)) {
    issues.push("Employer match ceiling must be between 0% and 100% of pay.");
  }
  const moneyValues = [
    input.health.premiumPerPaycheck,
    input.health.deductible,
    input.health.outOfPocketMaximum,
    input.hsa.employeeAnnualContribution,
    input.hsa.employerAnnualContribution,
  ];
  if (moneyValues.some((value) => value !== null && !isFiniteNonNegative(value))) issues.push("Dollar amounts cannot be negative or invalid.");
  if (
    isFiniteNonNegative(input.health.deductible) &&
    isFiniteNonNegative(input.health.outOfPocketMaximum) &&
    input.health.outOfPocketMaximum < input.health.deductible
  ) {
    issues.push("The entered out-of-pocket maximum is lower than the deductible. Recheck the plan documents.");
  }
  return issues;
};

export const calculateEmployerBenefitsActionPlan = (input: EmployerBenefitsInput): EmployerBenefitsActionPlan => {
  const annualPay = calculateAnnualPay(input.pay);
  const payPeriods = getPayPeriods(input.pay.frequency);
  const validationIssues = getInputValidationIssues(input);
  const contributionPercent = input.retirement.employeeContributionPercent;
  const validContributionPercent = contributionPercent !== null && contributionPercent >= 0 && contributionPercent <= 100;
  const employeeAnnual = annualPay !== null && validContributionPercent
    ? Math.min((annualPay * contributionPercent) / 100, BENEFIT_LIMITS_2026.retirementElectiveDeferral)
    : null;
  const employeePerPaycheck = employeeAnnual === null ? null : employeeAnnual / payPeriods;

  const retirementMissing: string[] = [];
  const retirementAssumptions: string[] = [
    `Uses ${payPeriods} pay periods and the ${BENEFIT_LIMITS_2026.year} base elective-deferral limit of $${BENEFIT_LIMITS_2026.retirementElectiveDeferral.toLocaleString()}.`,
    "The employer match estimate assumes the stated formula applies to annual eligible pay; payroll timing, true-up rules, and plan compensation definitions can change the result.",
  ];
  if (annualPay === null) retirementMissing.push("valid annualized pay");
  if (!validContributionPercent) retirementMissing.push("current contribution percentage");
  if (input.retirement.planType === "not-sure") retirementMissing.push("retirement plan type");

  let estimatedEmployerMatch: number | null = null;
  let capturesStatedMatch: boolean | null = null;
  if (input.retirement.matchType === "no-match") {
    estimatedEmployerMatch = 0;
    capturesStatedMatch = true;
  } else if (input.retirement.matchType === "not-sure") {
    retirementMissing.push("employer match formula");
  } else {
    const rate = input.retirement.matchRatePercent;
    const ceiling = input.retirement.matchCeilingPercent;
    if (!isFiniteNonNegative(rate)) retirementMissing.push("match rate");
    if (!isFiniteNonNegative(ceiling)) retirementMissing.push("match ceiling");
    if (annualPay !== null && validContributionPercent && isFiniteNonNegative(rate) && isFiniteNonNegative(ceiling)) {
      const actualDeferralPercent = annualPay === 0 || employeeAnnual === null ? 0 : (employeeAnnual / annualPay) * 100;
      const matchedDeferralPercent = Math.min(actualDeferralPercent, ceiling);
      estimatedEmployerMatch = annualPay * (matchedDeferralPercent / 100) * (rate / 100);
      capturesStatedMatch = actualDeferralPercent + 0.0001 >= ceiling;
    }
  }

  const annualPremium = isFiniteNonNegative(input.health.premiumPerPaycheck)
    ? input.health.premiumPerPaycheck * payPeriods
    : null;
  const deductible = isFiniteNonNegative(input.health.deductible) ? input.health.deductible : null;
  const outOfPocketMaximum = isFiniteNonNegative(input.health.outOfPocketMaximum) ? input.health.outOfPocketMaximum : null;

  const hsaLimit = input.hsa.coverage === "self-only"
    ? BENEFIT_LIMITS_2026.hsa.selfOnly
    : input.hsa.coverage === "family"
      ? BENEFIT_LIMITS_2026.hsa.family
      : null;
  const employeeHsa = isFiniteNonNegative(input.hsa.employeeAnnualContribution) ? input.hsa.employeeAnnualContribution : null;
  const employerHsa = isFiniteNonNegative(input.hsa.employerAnnualContribution) ? input.hsa.employerAnnualContribution : null;
  const totalHsa = employeeHsa !== null && employerHsa !== null ? employeeHsa + employerHsa : null;
  const remainingHsa = input.health.hsaEligible === "yes" && hsaLimit !== null && totalHsa !== null
    ? Math.max(hsaLimit - totalHsa, 0)
    : null;
  const possibleExcess = input.health.hsaEligible === "yes" && hsaLimit !== null && totalHsa !== null
    ? Math.max(totalHsa - hsaLimit, 0)
    : null;

  let hsaWarning: string | null = null;
  if (input.health.hsaEligible === "not-sure") hsaWarning = "HSA eligibility is uncertain. Verify that the plan is HSA-eligible before treating this as available contribution room.";
  if (input.health.hsaEligible === "no" && ((employeeHsa ?? 0) > 0 || (employerHsa ?? 0) > 0)) hsaWarning = "The plan is marked not HSA-eligible, but HSA contributions were entered. Verify eligibility before contributing.";
  if (possibleExcess !== null && possibleExcess > 0) hsaWarning = `Entered employee plus employer contributions exceed the ${BENEFIT_LIMITS_2026.year} base limit by about $${Math.round(possibleExcess).toLocaleString()}. Verify eligibility, timing, and any age-55 catch-up before acting.`;
  if (hsaLimit !== null && totalHsa === null && input.health.hsaEligible === "yes") hsaWarning = "Contribution room cannot be estimated until both employee and employer HSA deposits are known. Employer deposits count toward the same annual limit.";

  const flags: string[] = [];
  if (input.retirement.matchType === "not-sure") flags.push("Employer match formula is unknown, so a possibly valuable benefit cannot be checked yet.");
  if (capturesStatedMatch === false) flags.push("The entered contribution appears below the stated match ceiling, so part of the potential employer match may be uncaptured.");
  if ((estimatedEmployerMatch ?? 0) > 0 && input.retirement.vestingStatus !== "fully-vested") flags.push("Some or all estimated employer match may not yet be employee-owned because vesting is incomplete or unknown.");
  if (input.health.hsaEligible === "not-sure") flags.push("HSA eligibility is unknown. Do not assume that an HSA contribution is permitted.");
  if (input.health.hsaEligible === "yes" && input.hsa.employerAnnualContribution === null) flags.push("Employer HSA funding is unknown and may be a missed employer contribution or an input needed for the IRS limit check.");
  if ((possibleExcess ?? 0) > 0) flags.push("Entered HSA contributions may exceed the current-year base limit.");
  if (annualPremium === null) flags.push("Annual employee premium cannot be calculated until the per-paycheck deduction is known.");
  if (deductible !== null && outOfPocketMaximum !== null && outOfPocketMaximum < deductible) flags.push("The health-plan cost figures appear internally inconsistent; recheck the Summary of Benefits and Coverage.");

  const questionsForHr: string[] = [];
  if (input.retirement.planType === "not-sure") questionsForHr.push("What workplace retirement plan do I have, and where is the Summary Plan Description?");
  if (input.retirement.matchType === "not-sure") questionsForHr.push("What is the exact employer match formula, match ceiling, and per-paycheck or annual true-up rule?");
  if (input.retirement.vestingStatus === "not-sure") questionsForHr.push("What is the vesting schedule, and how much of the employer contribution is vested today?");
  if (input.retirement.taxTreatment === "not-sure") questionsForHr.push("Does the plan allow traditional, Roth, or split contributions, and how is my current election labeled?");
  if (input.health.premiumPerPaycheck === null) questionsForHr.push("What is my employee premium per paycheck for the selected coverage tier?");
  if (input.health.hsaEligible === "not-sure") questionsForHr.push("Is this specific plan HSA-eligible, and where is that stated in the plan documents?");
  if (input.health.networkType === "not-sure") questionsForHr.push("What network or plan type applies, and what are the out-of-network rules?");
  if (input.health.copayOrCoinsurance === null) questionsForHr.push("Where can I find copays, coinsurance, prescription tiers, and services subject to the deductible?");
  if (input.hsa.employerAnnualContribution === null) questionsForHr.push("Does the employer deposit money into the HSA, how much, and when does it arrive?");
  if (input.hsa.coverage === "not-sure" && input.health.hsaEligible === "yes") questionsForHr.push("For HSA contribution-limit purposes, is my coverage self-only or family coverage?");

  const employerValueParts: string[] = [];
  let knownAnnualEmployerValue = 0;
  if (estimatedEmployerMatch !== null && estimatedEmployerMatch > 0 && input.retirement.vestingStatus === "fully-vested") {
    knownAnnualEmployerValue += estimatedEmployerMatch;
    employerValueParts.push("estimated fully vested employer retirement match");
  }
  if (input.health.hsaEligible === "yes" && employerHsa !== null) {
    knownAnnualEmployerValue += employerHsa;
    employerValueParts.push("entered employer HSA contribution");
  }

  let doThisFirst = "Open the plan documents and verify the numbers before changing any election.";
  if ((possibleExcess ?? 0) > 0 || (input.health.hsaEligible === "no" && ((employeeHsa ?? 0) > 0 || (employerHsa ?? 0) > 0))) {
    doThisFirst = "Pause and verify HSA eligibility and contribution totals before making another HSA contribution.";
  } else if (input.retirement.matchType === "not-sure") {
    doThisFirst = "Find the exact employer retirement match formula and match ceiling in the HR portal or Summary Plan Description.";
  } else if (capturesStatedMatch === false) {
    doThisFirst = "Check whether you can afford to raise the retirement contribution enough to capture the stated full employer match.";
  } else if ((estimatedEmployerMatch ?? 0) > 0 && input.retirement.vestingStatus === "not-sure") {
    doThisFirst = "Verify the vesting schedule before counting the employer match as money you own.";
  } else if (input.health.hsaEligible === "not-sure") {
    doThisFirst = "Verify whether this exact health plan is HSA-eligible before using the HSA estimate.";
  } else if (validationIssues.length > 0) {
    doThisFirst = "Correct the flagged input before relying on the calculated amounts.";
  }

  const reliablePieces = [employeeAnnual, annualPremium, estimatedEmployerMatch, remainingHsa].filter((value) => value !== null).length;
  const whatThisMeans = reliablePieces >= 3
    ? "You have enough entered detail to see the paycheck, match, premium, and HSA pieces together. Use the action order to resolve remaining uncertainty, then confirm every election against the official plan documents."
    : "This is a partial map, not a complete valuation. The missing fields are useful: they identify exactly what to find in the HR portal or ask HR before making an election.";

  return {
    annualPay,
    payPeriods,
    retirement: {
      employeePerPaycheck,
      employeeAnnual,
      estimatedEmployerMatch,
      capturesStatedMatch,
      missing: unique(retirementMissing),
      assumptions: retirementAssumptions,
    },
    health: {
      annualPremium,
      deductible,
      outOfPocketMaximum,
      warning: "Do not add the deductible to the out-of-pocket maximum. The deductible is generally part of, not on top of, the in-network out-of-pocket maximum; premiums are separate.",
    },
    hsa: {
      limit: hsaLimit,
      totalContributions: totalHsa,
      remainingRoom: remainingHsa,
      possibleExcess,
      warning: hsaWarning,
    },
    knownAnnualEmployerValue,
    employerValueParts,
    doThisFirst,
    flags: unique(flags),
    questionsForHr: unique(questionsForHr).slice(0, 8),
    documentsToKeep: [
      "Summary Plan Description for the retirement plan",
      "Retirement match formula and vesting schedule",
      "Summary of Benefits and Coverage for the health plan",
      "Health-plan rate sheet showing employee premiums by coverage tier",
      "HSA eligibility notice and employer contribution schedule",
      "Confirmation pages for elections and contribution changes",
      "Recent pay stub showing benefit deductions",
    ],
    whatThisMeans,
    validationIssues,
  };
};
