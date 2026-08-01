import type { DecisionOutcomeView } from "@/lib/decisionOutcome";

export type Retirement403bMatchFormula =
  | "full_match_up_to"
  | "partial_match_up_to"
  | "non_elective"
  | "unknown_or_tiered";

export type Retirement403bContributionType = "traditional" | "roth";

export type Retirement403bDecisionState =
  | "verify_match_formula"
  | "below_full_match"
  | "capturing_full_match"
  | "non_elective_contribution"
  | "no_employer_contribution_identified"
  | "insufficient_information";

export type Retirement403bDecisionInput = {
  hourlyWage: number;
  hoursPerWeek: number;
  paychecksPerYear: number;
  employeeContributionPercent: number;
  contributionType: Retirement403bContributionType;
  estimatedFederalMarginalRatePercent: number;
  matchFormula: Retirement403bMatchFormula;
  employerMatchRatePercent?: number;
  employerMatchCapPercent?: number;
  employerNonElectivePercent?: number;
  generatedAt?: Date;
};

export type Retirement403bValidationError = {
  field: string;
  code: string;
  message: string;
};

export type Retirement403bDecision = {
  state: Retirement403bDecisionState;
  errors: Retirement403bValidationError[];
  annualEligiblePay: number;
  grossPaycheck: number;
  employeeContributionPerPaycheck: number;
  annualEmployeeContribution: number;
  annualEmployerContribution: number | null;
  annualTotalContribution: number | null;
  estimatedAnnualFederalTaxReduction: number;
  view: DecisionOutcomeView<Retirement403bDecisionState>;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percent = (value: number) => `${Number(value.toFixed(2))}%`;
const money = (value: number) => currency.format(Number.isFinite(value) ? value : 0);
const finite = (value: number) => Number.isFinite(value);

const validate = (input: Retirement403bDecisionInput) => {
  const errors: Retirement403bValidationError[] = [];
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

  bounded("hourlyWage", input.hourlyWage, 0.01, 10_000, "Enter an hourly wage greater than $0.");
  bounded("hoursPerWeek", input.hoursPerWeek, 0.01, 168, "Enter weekly hours between 0 and 168.");
  bounded("paychecksPerYear", input.paychecksPerYear, 1, 365, "Choose a valid number of paychecks per year.");
  bounded("employeeContributionPercent", input.employeeContributionPercent, 0, 100, "Enter a contribution percentage from 0% to 100%.");
  bounded(
    "estimatedFederalMarginalRatePercent",
    input.estimatedFederalMarginalRatePercent,
    0,
    100,
    "Enter an estimated federal marginal rate from 0% to 100%.",
  );

  if (input.matchFormula === "full_match_up_to") {
    bounded("employerMatchCapPercent", input.employerMatchCapPercent, 0, 100, "Enter the percentage of pay eligible for a dollar-for-dollar match.");
  }

  if (input.matchFormula === "partial_match_up_to") {
    bounded("employerMatchRatePercent", input.employerMatchRatePercent, 0, 100, "Enter how many cents the employer contributes per dollar contributed.");
    bounded("employerMatchCapPercent", input.employerMatchCapPercent, 0, 100, "Enter the employee contribution percentage eligible for the partial match.");
  }

  if (input.matchFormula === "non_elective") {
    bounded("employerNonElectivePercent", input.employerNonElectivePercent, 0, 100, "Enter the non-elective employer contribution percentage.");
  }

  return errors;
};

const formulaLabel = (input: Retirement403bDecisionInput) => {
  if (input.matchFormula === "full_match_up_to") {
    return `Employer matches 100% of contributions up to ${percent(input.employerMatchCapPercent ?? 0)} of eligible pay`;
  }
  if (input.matchFormula === "partial_match_up_to") {
    return `Employer matches ${percent(input.employerMatchRatePercent ?? 0)} of contributions up to ${percent(input.employerMatchCapPercent ?? 0)} of eligible pay`;
  }
  if (input.matchFormula === "non_elective") {
    return `Employer contributes ${percent(input.employerNonElectivePercent ?? 0)} of eligible pay whether or not the employee contributes`;
  }
  return "Unknown, tiered, discretionary, true-up dependent, or otherwise unsupported formula";
};

const determineState = (
  input: Retirement403bDecisionInput,
  annualEmployerContribution: number | null,
): Retirement403bDecisionState => {
  if (input.matchFormula === "unknown_or_tiered") return "verify_match_formula";
  if (input.matchFormula === "non_elective") {
    return (annualEmployerContribution ?? 0) > 0
      ? "non_elective_contribution"
      : "no_employer_contribution_identified";
  }

  const matchCap = input.employerMatchCapPercent ?? 0;
  const matchRate = input.matchFormula === "full_match_up_to"
    ? 100
    : input.employerMatchRatePercent ?? 0;
  if (matchCap <= 0 || matchRate <= 0) return "no_employer_contribution_identified";

  return input.employeeContributionPercent < matchCap
    ? "below_full_match"
    : "capturing_full_match";
};

const stateCopy: Record<Retirement403bDecisionState, {
  label: string;
  interpretation: string;
  firstAction: string;
  reason: string;
  changingAssumption: string;
  caution: string;
}> = {
  verify_match_formula: {
    label: "Verify the employer formula before relying on a match estimate",
    interpretation: "The calculator can estimate common formulas, but an unknown, tiered, discretionary, or true-up-dependent plan cannot be reduced safely to one generic match percentage.",
    firstAction: "Open the Summary Plan Description or current benefits guide and copy the exact employer-contribution formula.",
    reason: "No employer contribution is displayed because the selected formula requires plan-specific details the calculator does not have.",
    changingAssumption: "Selecting a supported formula after confirming the match rate, contribution cap, eligible compensation, and true-up rules.",
    caution: "Do not assume a portal label such as “6% match” means the employer contributes 6% of pay.",
  },
  below_full_match: {
    label: "You may be contributing below the stated full-match threshold",
    interpretation: "Under the formula entered, increasing the employee contribution toward the match cap may increase the estimated employer contribution.",
    firstAction: "Confirm the formula and payroll-period rules, then test the smallest affordable contribution increase.",
    reason: "The entered employee contribution percentage is below the entered percentage of pay eligible for matching contributions.",
    changingAssumption: "A different plan formula, ineligible compensation, a per-paycheck limit, a true-up, or a contribution increase could change the result.",
    caution: "A match is valuable, but do not create missed bills, high-interest debt, or an inadequate emergency reserve to pursue it.",
  },
  capturing_full_match: {
    label: "You appear to be capturing the full stated match",
    interpretation: "Under the formula entered, the employee contribution reaches the entered match cap. More employee contributions may still support retirement goals, but they do not increase this modeled employer match.",
    firstAction: "Verify the latest paycheck and plan document before treating the estimate as confirmed compensation.",
    reason: "The entered employee contribution equals or exceeds the portion of pay eligible for the entered matching formula.",
    changingAssumption: "Eligible-pay exclusions, a different matching rate, per-paycheck funding, vesting, a true-up, or plan amendments could change the employer amount.",
    caution: "This estimate does not determine annual contribution-limit compliance, investment selection, vesting, or whether overtime and bonuses are eligible pay.",
  },
  non_elective_contribution: {
    label: "The entered employer contribution does not depend on your deferral rate",
    interpretation: "A non-elective contribution is modeled as a percentage of eligible pay whether or not the employee contributes.",
    firstAction: "Confirm eligibility, vesting, eligible compensation, and whether the contribution is guaranteed or discretionary.",
    reason: "The selected formula is an employer non-elective contribution rather than a matching contribution.",
    changingAssumption: "Eligibility, service requirements, discretionary funding, eligible compensation, or a different plan formula could change the result.",
    caution: "Do not describe a non-elective contribution as a match; the employee-contribution decision should be evaluated separately.",
  },
  no_employer_contribution_identified: {
    label: "No employer contribution is produced by the entered formula",
    interpretation: "The entered formula or percentages produce an estimated employer contribution of $0.",
    firstAction: "Check whether the plan truly has no employer contribution or whether a rate, cap, eligibility rule, or plan term was entered incorrectly.",
    reason: "The supported formula calculated no employer contribution from the current assumptions.",
    changingAssumption: "A corrected formula, nonzero rate, nonzero cap, or confirmed non-elective contribution could change the result.",
    caution: "A zero estimate is not proof that the employer offers no retirement contribution.",
  },
  insufficient_information: {
    label: "Correct the highlighted assumptions before using the estimate",
    interpretation: "One or more values are missing, outside the supported range, or inconsistent with the selected formula.",
    firstAction: "Return to the calculator and correct the highlighted fields using payroll and plan documents.",
    reason: "The calculator did not have enough valid information to create a reliable estimate.",
    changingAssumption: "Valid wage, schedule, payroll-frequency, contribution, tax-rate, and formula values will allow the estimate to run.",
    caution: "Do not use a partial or defaulted result for a payroll election.",
  },
};

export const evaluateRetirement403bDecision = (
  input: Retirement403bDecisionInput,
): Retirement403bDecision => {
  const errors = validate(input);
  const generatedAt = input.generatedAt ?? new Date();
  const annualEligiblePay = errors.length ? 0 : input.hourlyWage * input.hoursPerWeek * 52;
  const grossPaycheck = errors.length ? 0 : annualEligiblePay / input.paychecksPerYear;
  const annualEmployeeContribution = errors.length ? 0 : annualEligiblePay * (input.employeeContributionPercent / 100);
  const employeeContributionPerPaycheck = errors.length ? 0 : annualEmployeeContribution / input.paychecksPerYear;

  let annualEmployerContribution: number | null = null;
  if (!errors.length) {
    if (input.matchFormula === "full_match_up_to") {
      annualEmployerContribution = annualEligiblePay * (Math.min(input.employeeContributionPercent, input.employerMatchCapPercent ?? 0) / 100);
    } else if (input.matchFormula === "partial_match_up_to") {
      annualEmployerContribution = annualEligiblePay
        * (Math.min(input.employeeContributionPercent, input.employerMatchCapPercent ?? 0) / 100)
        * ((input.employerMatchRatePercent ?? 0) / 100);
    } else if (input.matchFormula === "non_elective") {
      annualEmployerContribution = annualEligiblePay * ((input.employerNonElectivePercent ?? 0) / 100);
    }
  }

  const annualTotalContribution = annualEmployerContribution === null
    ? null
    : annualEmployeeContribution + annualEmployerContribution;
  const estimatedAnnualFederalTaxReduction = input.contributionType === "traditional" && !errors.length
    ? annualEmployeeContribution * (input.estimatedFederalMarginalRatePercent / 100)
    : 0;
  const state: Retirement403bDecisionState = errors.length
    ? "insufficient_information"
    : determineState(input, annualEmployerContribution);
  const copy = stateCopy[state];
  const employerMetric = annualEmployerContribution === null
    ? "Not estimated"
    : money(annualEmployerContribution);
  const totalMetric = annualTotalContribution === null ? "Not estimated" : money(annualTotalContribution);

  const view: DecisionOutcomeView<Retirement403bDecisionState> = {
    generatedAt: generatedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    stateId: state,
    stateLabel: copy.label,
    interpretation: copy.interpretation,
    primaryReason: copy.reason,
    changingAssumption: copy.changingAssumption,
    primaryCaution: copy.caution,
    additionalCautions: [
      "The plan document and payroll records control; this calculator does not verify plan eligibility or legal compliance.",
      "Employer contributions may depend on each paycheck, annual true-ups, service, vesting, eligible compensation, or discretionary funding.",
      "Traditional contribution tax effects are estimates and exclude state taxes, credits, deductions, payroll taxes, and individual circumstances.",
    ],
    firstAction: copy.firstAction,
    actionSequence: [
      "Locate the current Summary Plan Description, benefits guide, and latest paystub.",
      "Confirm the employer rate, employee contribution cap, eligible compensation, payroll-period rule, true-up, and vesting schedule.",
      "Only then update the payroll election and confirm the next employer deposit against the plan formula.",
    ],
    verificationChecklist: [
      "Exact employer formula and whether it is matching, non-elective, tiered, or discretionary",
      "Employee contribution percentage required for the maximum employer contribution",
      "Whether overtime, differentials, bonuses, and other compensation are eligible",
      "Whether matching occurs each paycheck and whether an annual true-up applies",
      "Vesting schedule, eligibility date, and any service requirement",
    ],
    assumptions: [
      { label: "Hourly wage", value: money(input.hourlyWage) },
      { label: "Hours per week", value: `${input.hoursPerWeek}` },
      { label: "Paychecks per year", value: `${input.paychecksPerYear}` },
      { label: "Employee contribution", value: percent(input.employeeContributionPercent) },
      { label: "Contribution type", value: input.contributionType === "traditional" ? "Traditional" : "Roth" },
      { label: "Employer formula", value: formulaLabel(input), detail: "User-selected assumption; verify against the current plan document." },
    ],
    metricGroups: [
      {
        title: "Estimated paycheck and annual contributions",
        metrics: [
          { label: "Estimated gross paycheck", value: money(grossPaycheck) },
          { label: "Employee contribution per paycheck", value: money(employeeContributionPerPaycheck), emphasis: "primary" },
          { label: "Annual employee contribution", value: money(annualEmployeeContribution) },
          { label: "Estimated annual employer contribution", value: employerMetric, emphasis: state === "verify_match_formula" ? "caution" : "supporting" },
          { label: "Estimated total annual contribution", value: totalMetric },
          { label: "Estimated federal taxable-income reduction", value: money(input.contributionType === "traditional" ? annualEmployeeContribution : 0), detail: "Traditional contribution estimate only." },
          { label: "Estimated federal tax reduction", value: money(estimatedAnnualFederalTaxReduction), detail: "Illustrative marginal-rate estimate, not a tax return calculation." },
        ],
      },
    ],
    portableSummary: [
      "Community Acquired Finance — 403(b) contribution decision summary",
      `Outcome: ${copy.label}`,
      `Employer formula entered: ${formulaLabel(input)}`,
      `Estimated gross paycheck: ${money(grossPaycheck)}`,
      `Employee contribution per paycheck: ${money(employeeContributionPerPaycheck)}`,
      `Annual employee contribution: ${money(annualEmployeeContribution)}`,
      `Estimated annual employer contribution: ${employerMetric}`,
      `Estimated total annual contribution: ${totalMetric}`,
      `First action: ${copy.firstAction}`,
      "Verify the current plan document, eligible compensation, per-paycheck rules, true-up, and vesting before changing payroll.",
      "Educational estimate only. The plan document and payroll records control.",
    ].join("\n"),
    educationalLimitation: "This is a general educational estimate, not tax, legal, investment, fiduciary, or individualized benefits advice. It does not determine plan eligibility, contribution-limit compliance, investment performance, or the actual employer deposit.",
  };

  return {
    state,
    errors,
    annualEligiblePay,
    grossPaycheck,
    employeeContributionPerPaycheck,
    annualEmployeeContribution,
    annualEmployerContribution,
    annualTotalContribution,
    estimatedAnnualFederalTaxReduction,
    view,
  };
};
