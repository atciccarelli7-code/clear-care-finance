import type { DecisionOutcomeView } from "@/lib/decisionOutcome";

export type StudentLoanType = "private" | "federal" | "mixed" | "uncertain";
export type RefinanceRateType = "fixed" | "variable";
export type RefinanceQuoteMode = "none" | "seek" | "compare";

export type PrivateStudentLoanRecommendationState =
  | "verify_loan_type_first"
  | "continue_current_plan"
  | "accelerate_repayment"
  | "seek_compare_refinance_quotes"
  | "quoted_refinance_may_reduce_total_cost"
  | "lower_payment_higher_total_cost"
  | "do_not_refinance_based_on_quote"
  | "insufficient_information";

export type RefinanceQuoteInput = {
  apr: number;
  rateType: RefinanceRateType;
  termMonths: number;
  fees: number;
};

export type PrivateStudentLoanDecisionInput = {
  loanType: StudentLoanType;
  principal?: number;
  currentApr?: number;
  statedRemainingTermMonths?: number;
  currentMonthlyPayment?: number;
  additionalMonthlyPayment?: number;
  lumpSum?: number;
  quoteMode?: RefinanceQuoteMode;
  quote?: RefinanceQuoteInput;
  generatedAt?: Date;
};

export type LoanValidationCode =
  | "principal_required"
  | "principal_out_of_range"
  | "current_apr_required"
  | "current_apr_out_of_range"
  | "current_term_required"
  | "current_term_out_of_range"
  | "current_payment_required"
  | "current_payment_out_of_range"
  | "additional_payment_out_of_range"
  | "lump_sum_out_of_range"
  | "current_payment_not_payoff_safe"
  | "planned_payment_not_payoff_safe"
  | "quote_required"
  | "quote_apr_out_of_range"
  | "quote_term_out_of_range"
  | "quote_fees_out_of_range"
  | "quote_payment_not_payoff_safe";

export type LoanValidationError = {
  code: LoanValidationCode;
  field: string;
  message: string;
};

export type AmortizationMonth = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  cumulativeInterest: number;
};

export type AmortizationResult = {
  startingPrincipal: number;
  monthlyPayment: number;
  months: number;
  totalPayments: number;
  totalInterest: number;
  payoffSafe: boolean;
  schedule: AmortizationMonth[];
};

export type RefinanceComparison = {
  quote: RefinanceQuoteInput;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  paymentDifference: number;
  totalCostDifference: number;
  termDifferenceMonths: number;
  breakEvenMonth: number | null;
  plannedPayoffBeforeBreakEven: boolean;
  quotePlan: AmortizationResult;
};

export type PrivateStudentLoanDecision = {
  input: PrivateStudentLoanDecisionInput;
  generatedAt: Date;
  state: PrivateStudentLoanRecommendationState;
  errors: LoanValidationError[];
  currentPlan?: AmortizationResult;
  plannedCurrentLoan?: AmortizationResult;
  refinanceComparison?: RefinanceComparison;
  interestSavedFromAdditionalPayments?: number;
  timeSavedFromAdditionalPayments?: number;
  statedTermDifferenceMonths?: number;
  view: DecisionOutcomeView<PrivateStudentLoanRecommendationState>;
};

const MAX_PRINCIPAL = 10_000_000;
const MAX_APR = 100;
const MAX_TERM_MONTHS = 1_200;
const MAX_PAYMENT = 1_000_000;
const COST_TOLERANCE = 1;

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatLoanDuration = (months: number) => {
  if (!Number.isFinite(months)) return "Not payoff-safe";
  const wholeMonths = Math.max(0, Math.round(months));
  const years = Math.floor(wholeMonths / 12);
  const remainder = wholeMonths % 12;
  if (!years) return `${remainder} mo`;
  return remainder ? `${years} yr ${remainder} mo` : `${years} yr`;
};

export const formatEstimatedPayoffDate = (months: number, asOf: Date) => {
  const date = new Date(asOf.getFullYear(), asOf.getMonth(), 1);
  date.setMonth(date.getMonth() + Math.max(0, Math.round(months)));
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
};

export const calculateMonthlyPayment = (principal: number, apr: number, termMonths: number) => {
  if (!isFiniteNumber(principal) || principal < 0 || !isFiniteNumber(apr) || apr < 0 || !isFiniteNumber(termMonths) || termMonths <= 0) {
    return Number.NaN;
  }
  if (principal === 0) return 0;
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));
};

export const amortizeFixedPayment = (
  principal: number,
  apr: number,
  monthlyPayment: number,
  maxMonths = MAX_TERM_MONTHS,
): AmortizationResult => {
  const invalid = !isFiniteNumber(principal) || principal < 0 || !isFiniteNumber(apr) || apr < 0 || !isFiniteNumber(monthlyPayment) || monthlyPayment <= 0;
  if (invalid) {
    return { startingPrincipal: principal, monthlyPayment, months: 0, totalPayments: 0, totalInterest: 0, payoffSafe: false, schedule: [] };
  }
  if (principal === 0) {
    return { startingPrincipal: 0, monthlyPayment, months: 0, totalPayments: 0, totalInterest: 0, payoffSafe: true, schedule: [] };
  }

  const monthlyRate = apr / 100 / 12;
  let remaining = principal;
  let totalPayments = 0;
  let totalInterest = 0;
  const schedule: AmortizationMonth[] = [];

  for (let month = 1; month <= maxMonths; month += 1) {
    const interest = remaining * monthlyRate;
    if (monthlyRate > 0 && monthlyPayment <= interest) {
      return { startingPrincipal: principal, monthlyPayment, months: month - 1, totalPayments, totalInterest, payoffSafe: false, schedule };
    }
    const payment = Math.min(monthlyPayment, remaining + interest);
    const principalPaid = payment - interest;
    remaining = Math.max(0, remaining - principalPaid);
    totalPayments += payment;
    totalInterest += interest;
    schedule.push({
      month,
      payment,
      principal: principalPaid,
      interest,
      remainingBalance: remaining,
      cumulativeInterest: totalInterest,
    });
    if (remaining <= 0.005) {
      return { startingPrincipal: principal, monthlyPayment, months: month, totalPayments, totalInterest, payoffSafe: true, schedule };
    }
  }

  return { startingPrincipal: principal, monthlyPayment, months: maxMonths, totalPayments, totalInterest, payoffSafe: false, schedule };
};

const validatePrivateInputs = (input: PrivateStudentLoanDecisionInput) => {
  const errors: LoanValidationError[] = [];
  const add = (code: LoanValidationCode, field: string, message: string) => errors.push({ code, field, message });
  const { principal, currentApr, statedRemainingTermMonths, currentMonthlyPayment } = input;
  const additional = input.additionalMonthlyPayment ?? 0;
  const lump = input.lumpSum ?? 0;

  if (!isFiniteNumber(principal)) add("principal_required", "principal", "Enter a finite current principal balance.");
  else if (principal <= 0 || principal > MAX_PRINCIPAL) add("principal_out_of_range", "principal", "Enter a balance greater than $0 and no more than $10,000,000.");
  if (!isFiniteNumber(currentApr)) add("current_apr_required", "currentApr", "Enter a finite current APR.");
  else if (currentApr < 0 || currentApr > MAX_APR) add("current_apr_out_of_range", "currentApr", "Enter an APR from 0% through 100%.");
  if (!isFiniteNumber(statedRemainingTermMonths)) add("current_term_required", "statedRemainingTermMonths", "Enter the remaining term from the current statement.");
  else if (!Number.isInteger(statedRemainingTermMonths) || statedRemainingTermMonths < 1 || statedRemainingTermMonths > MAX_TERM_MONTHS) add("current_term_out_of_range", "statedRemainingTermMonths", "Enter a whole remaining term from 1 through 1,200 months.");
  if (!isFiniteNumber(currentMonthlyPayment)) add("current_payment_required", "currentMonthlyPayment", "Enter a finite current monthly payment.");
  else if (currentMonthlyPayment <= 0 || currentMonthlyPayment > MAX_PAYMENT) add("current_payment_out_of_range", "currentMonthlyPayment", "Enter a current payment greater than $0.");
  if (!isFiniteNumber(additional) || additional < 0 || additional > MAX_PAYMENT) add("additional_payment_out_of_range", "additionalMonthlyPayment", "Enter an additional payment from $0 through $1,000,000.");
  if (!isFiniteNumber(lump) || lump < 0 || (isFiniteNumber(principal) && lump > principal)) add("lump_sum_out_of_range", "lumpSum", "Enter a lump sum from $0 through the current balance.");

  if (input.quoteMode === "compare") {
    if (!input.quote) add("quote_required", "quote", "Enter the rate, term, rate type, and fees from an actual quote.");
    else {
      if (!isFiniteNumber(input.quote.apr) || input.quote.apr < 0 || input.quote.apr > MAX_APR) add("quote_apr_out_of_range", "quoteApr", "Enter a quoted APR from 0% through 100%.");
      if (!isFiniteNumber(input.quote.termMonths) || !Number.isInteger(input.quote.termMonths) || input.quote.termMonths < 1 || input.quote.termMonths > MAX_TERM_MONTHS) add("quote_term_out_of_range", "quoteTermMonths", "Enter a whole quoted term from 1 through 1,200 months.");
      if (!isFiniteNumber(input.quote.fees) || input.quote.fees < 0 || input.quote.fees > MAX_PRINCIPAL) add("quote_fees_out_of_range", "quoteFees", "Enter nonnegative lender or origination fees.");
    }
  }

  return errors;
};

const findFeeAdjustedBreakEven = (currentPlan: AmortizationResult, quotePlan: AmortizationResult, fee: number) => {
  if (fee === 0 && quotePlan.totalInterest <= currentPlan.totalInterest) return 0;
  const months = Math.max(currentPlan.schedule.length, quotePlan.schedule.length);
  for (let index = 0; index < months; index += 1) {
    const currentInterest = currentPlan.schedule[Math.min(index, currentPlan.schedule.length - 1)]?.cumulativeInterest ?? currentPlan.totalInterest;
    const quoteInterest = quotePlan.schedule[Math.min(index, quotePlan.schedule.length - 1)]?.cumulativeInterest ?? quotePlan.totalInterest;
    if (currentInterest - quoteInterest >= fee - 0.005) return index + 1;
  }
  return null;
};

const stateLabel: Record<PrivateStudentLoanRecommendationState, string> = {
  verify_loan_type_first: "Verify loan type first",
  continue_current_plan: "Continue current plan",
  accelerate_repayment: "Accelerate repayment",
  seek_compare_refinance_quotes: "Seek and compare refinance quotes",
  quoted_refinance_may_reduce_total_cost: "A quoted refinance may reduce total cost",
  lower_payment_higher_total_cost: "Lower payment, but higher total cost",
  do_not_refinance_based_on_quote: "Do not refinance based on this quote",
  insufficient_information: "Insufficient information",
};

const loanTypeLabel: Record<StudentLoanType, string> = {
  private: "Confirmed private loans only",
  federal: "Federal loans",
  mixed: "Mixed federal and private loans",
  uncertain: "Uncertain — verify first",
};

const buildAssumptions = (
  input: PrivateStudentLoanDecisionInput,
): DecisionOutcomeView<PrivateStudentLoanRecommendationState>["assumptions"] => {
  const assumptions: DecisionOutcomeView<PrivateStudentLoanRecommendationState>["assumptions"] = [
    { label: "Loan type", value: loanTypeLabel[input.loanType] },
  ];
  if (input.loanType !== "private") return assumptions;
  if (isFiniteNumber(input.principal)) assumptions.push({ label: "Current principal", value: money(input.principal) });
  if (isFiniteNumber(input.currentApr)) assumptions.push({ label: "Current APR", value: `${input.currentApr.toFixed(2)}%` });
  if (isFiniteNumber(input.statedRemainingTermMonths)) assumptions.push({ label: "Entered remaining term", value: formatLoanDuration(input.statedRemainingTermMonths) });
  if (isFiniteNumber(input.currentMonthlyPayment)) assumptions.push({ label: "Current monthly payment", value: money(input.currentMonthlyPayment) });
  if (isFiniteNumber(input.additionalMonthlyPayment)) assumptions.push({ label: "Additional monthly payment", value: money(input.additionalMonthlyPayment) });
  if (isFiniteNumber(input.lumpSum)) assumptions.push({ label: "One-time lump sum", value: money(input.lumpSum) });
  if (input.quoteMode === "compare" && input.quote) {
    if (isFiniteNumber(input.quote.apr)) assumptions.push({ label: "Quoted APR", value: `${input.quote.apr.toFixed(2)}%`, detail: `${input.quote.rateType === "fixed" ? "Fixed" : "Variable"} rate` });
    if (isFiniteNumber(input.quote.termMonths)) assumptions.push({ label: "Quoted term", value: formatLoanDuration(input.quote.termMonths) });
    if (isFiniteNumber(input.quote.fees)) assumptions.push({ label: "Quoted fees", value: money(input.quote.fees), detail: "Assumed paid upfront" });
  }
  return assumptions;
};

const buildMetricGroups = (
  decision: Omit<PrivateStudentLoanDecision, "view">,
): DecisionOutcomeView<PrivateStudentLoanRecommendationState>["metricGroups"] => {
  const { currentPlan, plannedCurrentLoan, refinanceComparison, generatedAt } = decision;
  const groups: DecisionOutcomeView<PrivateStudentLoanRecommendationState>["metricGroups"] = [];
  if (currentPlan) {
    groups.push({
      title: "Current schedule",
      metrics: [
        { label: "Monthly payment", value: money(currentPlan.monthlyPayment), emphasis: "primary" },
        { label: "Estimated payoff", value: formatLoanDuration(currentPlan.months), detail: formatEstimatedPayoffDate(currentPlan.months, generatedAt) },
        { label: "Remaining interest", value: money(currentPlan.totalInterest) },
        { label: "Remaining repayment", value: money(currentPlan.totalPayments) },
      ],
    });
  }
  if (plannedCurrentLoan && currentPlan && (decision.input.additionalMonthlyPayment || decision.input.lumpSum)) {
    groups.push({
      title: "Current loan with planned extra payments",
      metrics: [
        { label: "Planned monthly payment", value: money(plannedCurrentLoan.monthlyPayment), emphasis: "primary" },
        { label: "Estimated payoff", value: formatLoanDuration(plannedCurrentLoan.months), detail: formatEstimatedPayoffDate(plannedCurrentLoan.months, generatedAt) },
        { label: "Interest saved", value: money(decision.interestSavedFromAdditionalPayments ?? 0) },
        { label: "Time saved", value: formatLoanDuration(decision.timeSavedFromAdditionalPayments ?? 0) },
      ],
    });
  }
  if (refinanceComparison) {
    groups.push({
      title: "Compared refinance quote",
      metrics: [
        { label: "Estimated monthly payment", value: money(refinanceComparison.monthlyPayment), emphasis: "primary" },
        { label: "Quoted term", value: formatLoanDuration(refinanceComparison.quote.termMonths), detail: `${refinanceComparison.quote.rateType === "fixed" ? "Fixed" : "Variable"} rate` },
        { label: "Total repayment with fees", value: money(refinanceComparison.totalRepayment), detail: `${money(refinanceComparison.quote.fees)} assumed paid upfront` },
        { label: "Total interest", value: money(refinanceComparison.totalInterest) },
        { label: "Monthly payment difference", value: `${refinanceComparison.paymentDifference < 0 ? "−" : "+"}${money(Math.abs(refinanceComparison.paymentDifference))}` },
        { label: "Total-cost difference", value: `${refinanceComparison.totalCostDifference < 0 ? "−" : "+"}${money(Math.abs(refinanceComparison.totalCostDifference))}`, emphasis: refinanceComparison.totalCostDifference > 0 ? "caution" : "supporting" },
        { label: "Term difference", value: `${refinanceComparison.termDifferenceMonths < 0 ? "−" : "+"}${formatLoanDuration(Math.abs(refinanceComparison.termDifferenceMonths))}` },
        { label: "Fee-adjusted break-even", value: refinanceComparison.breakEvenMonth === null ? "Not reached" : refinanceComparison.breakEvenMonth === 0 ? "Immediate in this estimate" : formatLoanDuration(refinanceComparison.breakEvenMonth) },
      ],
    });
  }
  return groups;
};

const describeOutcome = (decision: Omit<PrivateStudentLoanDecision, "view">) => {
  const { state, input, currentPlan, plannedCurrentLoan, refinanceComparison, errors } = decision;
  const scheduleMismatch = Math.abs(decision.statedTermDifferenceMonths ?? 0) > 1;
  const rateCaution = refinanceComparison?.quote.rateType === "variable"
    ? "The quoted rate is variable. This estimate holds that APR constant, but the actual payment and total cost can rise."
    : undefined;
  const sharedVerification = [
    "Review the current promissory note and latest statement for APR, payment, remaining term, prepayment terms, and borrower protections.",
    "Confirm how extra payments are applied and request a dated payoff amount before sending a lump sum.",
    "For any quote, compare the final lender disclosure, rate type, fees, term, autopay conditions, quote expiration, credit inquiry, hardship terms, and cosigner terms.",
  ];
  const additionalCautions = [
    "Keep an emergency reserve before making an extra payment that would be difficult to reverse.",
    "A lower monthly payment can still cost more when the term is longer.",
    "Lender-specific hardship, deferment, forbearance, cosigner-release, and prepayment terms require direct document verification.",
    "This tool does not determine eligibility, approval, forgiveness, discharge, tax treatment, or legal rights.",
  ];
  if (scheduleMismatch) additionalCautions.unshift("The entered payment and APR do not reproduce the stated remaining term. Verify the statement before relying on the comparison.");
  if (rateCaution) additionalCautions.unshift(rateCaution);

  switch (state) {
    case "verify_loan_type_first":
      return {
        interpretation: "This private-loan decision path should pause until every included loan is confirmed as private.",
        primaryReason: input.loanType === "federal"
          ? "You identified federal loans. Moving federal debt into a private refinance can permanently remove federal protections and programs."
          : input.loanType === "mixed"
            ? "You identified a mix of federal and private loans. They must be separated before evaluating a private refinance."
            : "The loan type is uncertain, so a refinance recommendation would be unsafe.",
        changingAssumption: "A current federal aid record plus lender statements showing that the debt being modeled is entirely private would reopen the private-loan comparison.",
        primaryCaution: "Do not send federal, mixed, or unverified loans into a private refinance comparison.",
        firstAction: "Open your Federal Student Aid dashboard and current lender statements, then identify each loan as federal or private.",
        actionSequence: [
          "Verify each loan's owner and type in official records and current statements.",
          "Keep federal loans outside this private-loan refinance calculator.",
          "Return with only the confirmed private-loan balance and documents.",
        ],
        verificationChecklist: [
          "Federal Student Aid dashboard reviewed.",
          "Private lender statement or promissory note reviewed.",
          "Mixed balances separated before comparison.",
        ],
        additionalCautions,
      };
    case "insufficient_information":
      return {
        interpretation: "The calculator cannot produce a dependable payoff or quote comparison from the current entries.",
        primaryReason: errors[0]?.message ?? "One or more required assumptions are missing or outside the supported range.",
        changingAssumption: "Correcting the highlighted assumption can produce a new state.",
        primaryCaution: "Do not treat a validation failure or non-amortizing payment as a payoff estimate.",
        firstAction: "Compare each entry with the latest statement and correct the first highlighted field.",
        actionSequence: ["Correct the highlighted entries.", "Confirm the payment is greater than one month's interest.", "Build the result again."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "seek_compare_refinance_quotes":
      return {
        interpretation: "A real quote is needed before refinancing can be evaluated against the current plan.",
        primaryReason: "No complete lender quote was supplied, so rate, term, fees, rate type, and borrower protections cannot be compared.",
        changingAssumption: "An actual quote with all required terms could support a reduce-cost, higher-cost, or do-not-refinance state.",
        primaryCaution: "An advertised rate or monthly-payment estimate is not a complete quote.",
        firstAction: "Collect written quotes, then compare APR, rate type, term, fees, monthly payment, total repayment, and protections side by side.",
        actionSequence: ["Gather at least two written quotes without entering lender names here.", "Check fixed versus variable terms and every fee.", "Return to compare each complete quote independently."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "accelerate_repayment":
      return {
        interpretation: `The entered extra-payment plan shortens payoff by about ${formatLoanDuration(decision.timeSavedFromAdditionalPayments ?? 0)} and reduces estimated interest by about ${money(decision.interestSavedFromAdditionalPayments ?? 0)}.`,
        primaryReason: "The current loan remains payoff-safe and the optional extra payment reduces both modeled time and interest.",
        changingAssumption: "A less reliable monthly surplus, a smaller emergency reserve, or a verified lower-cost quote could change the priority.",
        primaryCaution: "Do not make recurring extra payments depend on overtime or shift income that may not continue.",
        firstAction: "Confirm how the servicer applies extra payments, then schedule an amount that leaves your emergency reserve intact.",
        actionSequence: ["Verify extra payments reduce principal and do not merely advance the due date.", "Keep the planned payment within dependable base cash flow.", "Recheck the payoff estimate after each statement change."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "quoted_refinance_may_reduce_total_cost":
      return {
        interpretation: `This quote is estimated to reduce financing cost by about ${money(Math.abs(refinanceComparison?.totalCostDifference ?? 0))} versus keeping the current loan with the entered extra-payment plan.`,
        primaryReason: "After including entered upfront fees, the quoted repayment is lower than the modeled current-loan repayment.",
        changingAssumption: "A changed final APR, variable-rate increase, added fee, lost borrower protection, or different term could reverse the result.",
        primaryCaution: rateCaution ?? "The math does not value current lender protections; verify them before replacing the loan.",
        firstAction: "Compare this estimate with the final lender disclosure and current promissory note before deciding.",
        actionSequence: ["Verify the final APR, rate type, term, fees, and monthly payment in writing.", "Compare hardship and cosigner terms with the current loan.", "Recalculate if any final term differs from the entered quote."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "lower_payment_higher_total_cost":
      return {
        interpretation: `The quote lowers the estimated monthly payment by about ${money(Math.abs(refinanceComparison?.paymentDifference ?? 0))}, but increases total financing cost by about ${money(refinanceComparison?.totalCostDifference ?? 0)}.`,
        primaryReason: "The payment falls because the quote changes the repayment schedule, while the longer or costlier structure increases lifetime cost.",
        changingAssumption: "A shorter term, lower final APR, or lower fees could change the total-cost result.",
        primaryCaution: "Monthly-payment relief and total-cost savings are different decisions.",
        firstAction: "Ask for a shorter-term or lower-cost quote and compare total repayment, not payment alone.",
        actionSequence: ["Confirm whether temporary cash-flow relief is the actual goal.", "Request a quote that does not extend repayment materially.", "Keep the neutral current-plan option visible in the comparison."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "do_not_refinance_based_on_quote":
      return {
        interpretation: refinanceComparison && Math.abs(refinanceComparison.totalCostDifference) <= COST_TOLERANCE
          ? "This quote is effectively equivalent in modeled total cost and does not establish a meaningful refinance benefit."
          : `This quote increases estimated financing cost by about ${money(refinanceComparison?.totalCostDifference ?? 0)} versus the entered current-loan plan.`,
        primaryReason: "The quoted rate, term, and fees do not produce a lower modeled total cost.",
        changingAssumption: "A verified lower APR, shorter term, or lower fee could produce a different comparison.",
        primaryCaution: rateCaution ?? "Do not replace existing terms without a measurable benefit that survives fees and document review.",
        firstAction: "Keep the current plan for now and reject or renegotiate this quote.",
        actionSequence: ["Save the quote terms for comparison.", "Request a materially better complete quote if refinancing is still a goal.", "Recheck current-loan protections before any future replacement."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
    case "continue_current_plan":
    default:
      if ((input.additionalMonthlyPayment ?? 0) > 0 || (input.lumpSum ?? 0) > 0) {
        return {
          interpretation: currentPlan ? `At the entered payment, the current loan is estimated to be repaid in ${formatLoanDuration(currentPlan.months)} with about ${money(currentPlan.totalInterest)} in remaining interest.` : "The current plan is the neutral starting point.",
          primaryReason: "The entered extra-payment plan does not reduce both the modeled payoff duration and remaining interest by a meaningful amount.",
          changingAssumption: "A larger dependable extra payment, a longer remaining schedule, or a positive APR could create a measurable payoff benefit.",
          primaryCaution: "Do not move cash from an emergency reserve for an extra payment that does not create a measurable benefit in this estimate.",
          firstAction: "Keep the current plan for now and verify the statement before changing the payment.",
          actionSequence: ["Confirm the statement values and remaining term.", "Keep the required payment and emergency reserve protected.", "Recalculate only if a dependable extra amount would materially change payoff."],
          verificationChecklist: sharedVerification,
          additionalCautions,
        };
      }
      return {
        interpretation: currentPlan ? `At the entered payment, the current loan is estimated to be repaid in ${formatLoanDuration(currentPlan.months)} with about ${money(currentPlan.totalInterest)} in remaining interest.` : "The current plan is the neutral starting point.",
        primaryReason: "No extra-payment plan or complete refinance quote creates a different decision state.",
        changingAssumption: "A dependable extra payment or a complete lower-cost quote could change the result.",
        primaryCaution: "The model assumes the APR and payment stay unchanged and excludes lender-specific protections or servicing changes.",
        firstAction: "Verify the current statement and keep making the required payment while deciding whether another goal warrants comparison.",
        actionSequence: ["Confirm the statement values and remaining term.", "Protect the required payment and emergency reserve.", "Return only when an extra-payment amount or complete quote is available."],
        verificationChecklist: sharedVerification,
        additionalCautions,
      };
  }
};

const createPortableSummary = (decision: Omit<PrivateStudentLoanDecision, "view">, description: ReturnType<typeof describeOutcome>) => {
  const { input, generatedAt, currentPlan, plannedCurrentLoan, refinanceComparison, state } = decision;
  const assumptions = input.loanType === "private" && isFiniteNumber(input.principal)
    ? [
        `Loan type: confirmed private`,
        `Current principal: ${money(input.principal)}`,
        `Current APR: ${input.currentApr?.toFixed(2)}%`,
        `Current remaining term entered: ${formatLoanDuration(input.statedRemainingTermMonths ?? 0)}`,
        `Current monthly payment: ${money(input.currentMonthlyPayment ?? 0)}`,
        `Additional monthly payment: ${money(input.additionalMonthlyPayment ?? 0)}`,
        `One-time lump sum: ${money(input.lumpSum ?? 0)}`,
      ]
    : [`Loan type entered: ${input.loanType}`];
  if (refinanceComparison) assumptions.push(
    `Compared quote: ${refinanceComparison.quote.apr.toFixed(2)}% ${refinanceComparison.quote.rateType}, ${formatLoanDuration(refinanceComparison.quote.termMonths)}, ${money(refinanceComparison.quote.fees)} fees`,
  );
  return [
    "COMMUNITY ACQUIRED FINANCE — PRIVATE STUDENT LOAN DECISION SUMMARY",
    `Generated: ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(generatedAt)}`,
    "",
    "ASSUMPTIONS",
    ...assumptions.map((item) => `- ${item}`),
    "",
    "CURRENT-PLAN RESULT",
    currentPlan ? `- ${formatLoanDuration(currentPlan.months)} estimated payoff; ${money(currentPlan.totalInterest)} remaining interest; ${money(currentPlan.totalPayments)} remaining repayment.` : "- Not calculated until the relevant loans are confirmed private.",
    plannedCurrentLoan && plannedCurrentLoan !== currentPlan ? `- With entered extra payments: ${formatLoanDuration(plannedCurrentLoan.months)}; ${money(plannedCurrentLoan.totalInterest)} interest.` : "",
    refinanceComparison ? `- Compared quote: ${money(refinanceComparison.monthlyPayment)}/month; ${money(refinanceComparison.totalRepayment)} total repayment including entered fees; ${money(refinanceComparison.totalInterest)} interest.` : "- No complete refinance quote compared.",
    "",
    `RECOMMENDATION STATE: ${stateLabel[state]}`,
    `KEY REASON: ${description.primaryReason}`,
    `PRIMARY CAUTION: ${description.primaryCaution}`,
    `FIRST ACTION: ${description.firstAction}`,
    "",
    "VERIFICATION CHECKLIST",
    ...description.verificationChecklist.map((item) => `- ${item}`),
    "",
    "LIMITATION",
    "Educational estimate only. Payments are modeled monthly; APRs are held constant; entered fees are paid upfront; the final payment is rounded only for display. Loan documents and final lender disclosures control.",
  ].filter(Boolean).join("\n");
};

export const evaluatePrivateStudentLoanDecision = (input: PrivateStudentLoanDecisionInput): PrivateStudentLoanDecision => {
  const generatedAt = input.generatedAt && !Number.isNaN(input.generatedAt.getTime()) ? new Date(input.generatedAt) : new Date();
  let errors: LoanValidationError[] = [];
  let currentPlan: AmortizationResult | undefined;
  let plannedCurrentLoan: AmortizationResult | undefined;
  let refinanceComparison: RefinanceComparison | undefined;
  let interestSavedFromAdditionalPayments: number | undefined;
  let timeSavedFromAdditionalPayments: number | undefined;
  let statedTermDifferenceMonths: number | undefined;

  if (input.loanType === "private") {
    errors = validatePrivateInputs(input);
    if (!errors.length) {
      const principal = input.principal as number;
      const currentApr = input.currentApr as number;
      const currentPayment = input.currentMonthlyPayment as number;
      const additional = input.additionalMonthlyPayment ?? 0;
      const lump = input.lumpSum ?? 0;
      currentPlan = amortizeFixedPayment(principal, currentApr, currentPayment);
      if (!currentPlan.payoffSafe) {
        errors.push({ code: "current_payment_not_payoff_safe", field: "currentMonthlyPayment", message: "The current payment does not repay the balance within the supported horizon or does not cover monthly interest." });
      } else {
        const remainingAfterLump = Math.max(0, principal - lump);
        plannedCurrentLoan = remainingAfterLump === 0
          ? { startingPrincipal: 0, monthlyPayment: currentPayment + additional, months: 0, totalPayments: 0, totalInterest: 0, payoffSafe: true, schedule: [] }
          : amortizeFixedPayment(remainingAfterLump, currentApr, currentPayment + additional);
        if (!plannedCurrentLoan.payoffSafe) {
          errors.push({ code: "planned_payment_not_payoff_safe", field: "additionalMonthlyPayment", message: "The planned payment does not repay the remaining balance within the supported horizon." });
        } else {
          interestSavedFromAdditionalPayments = Math.max(0, currentPlan.totalInterest - plannedCurrentLoan.totalInterest);
          timeSavedFromAdditionalPayments = Math.max(0, currentPlan.months - plannedCurrentLoan.months);
          statedTermDifferenceMonths = currentPlan.months - (input.statedRemainingTermMonths as number);
        }
      }

      if (!errors.length && input.quoteMode === "compare" && input.quote && plannedCurrentLoan) {
        const quotePrincipal = Math.max(0, principal - lump);
        const quotedPayment = calculateMonthlyPayment(quotePrincipal, input.quote.apr, input.quote.termMonths);
        const quotePlan = quotePrincipal === 0
          ? { startingPrincipal: 0, monthlyPayment: 0, months: 0, totalPayments: 0, totalInterest: 0, payoffSafe: true, schedule: [] }
          : amortizeFixedPayment(quotePrincipal, input.quote.apr, quotedPayment, input.quote.termMonths + 1);
        if (!Number.isFinite(quotedPayment) || !quotePlan.payoffSafe) {
          errors.push({
            code: "quote_payment_not_payoff_safe",
            field: "quoteTermMonths",
            message: "This rate and term do not produce a reliable payoff schedule within the supported model. Verify the quote or use a shorter term.",
          });
        } else {
          const totalRepayment = lump + quotePlan.totalPayments + input.quote.fees;
          const currentAlternativeRepayment = lump + plannedCurrentLoan.totalPayments;
          const breakEvenMonth = findFeeAdjustedBreakEven(plannedCurrentLoan, quotePlan, input.quote.fees);
          refinanceComparison = {
            quote: input.quote,
            monthlyPayment: quotedPayment,
            totalRepayment,
            totalInterest: quotePlan.totalInterest,
            paymentDifference: quotedPayment - plannedCurrentLoan.monthlyPayment,
            totalCostDifference: totalRepayment - currentAlternativeRepayment,
            termDifferenceMonths: quotePlan.months - plannedCurrentLoan.months,
            breakEvenMonth,
            plannedPayoffBeforeBreakEven: breakEvenMonth === null || breakEvenMonth > plannedCurrentLoan.months,
            quotePlan,
          };
        }
      }
    }
  }

  let state: PrivateStudentLoanRecommendationState;
  if (input.loanType !== "private") state = "verify_loan_type_first";
  else if (errors.length || !currentPlan || !plannedCurrentLoan) state = "insufficient_information";
  else if (input.quoteMode === "compare" && refinanceComparison) {
    if (refinanceComparison.paymentDifference < -COST_TOLERANCE && refinanceComparison.totalCostDifference > COST_TOLERANCE) state = "lower_payment_higher_total_cost";
    else if (refinanceComparison.totalCostDifference < -COST_TOLERANCE && !refinanceComparison.plannedPayoffBeforeBreakEven) state = "quoted_refinance_may_reduce_total_cost";
    else state = "do_not_refinance_based_on_quote";
  } else if (input.quoteMode === "seek") state = "seek_compare_refinance_quotes";
  else if (
    (timeSavedFromAdditionalPayments ?? 0) > 0
    && (interestSavedFromAdditionalPayments ?? 0) > COST_TOLERANCE
  ) state = "accelerate_repayment";
  else state = "continue_current_plan";

  const decisionWithoutView: Omit<PrivateStudentLoanDecision, "view"> = {
    input,
    generatedAt,
    state,
    errors,
    currentPlan,
    plannedCurrentLoan,
    refinanceComparison,
    interestSavedFromAdditionalPayments,
    timeSavedFromAdditionalPayments,
    statedTermDifferenceMonths,
  };
  const description = describeOutcome(decisionWithoutView);
  const view: DecisionOutcomeView<PrivateStudentLoanRecommendationState> = {
    generatedAt: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(generatedAt),
    stateId: state,
    stateLabel: stateLabel[state],
    interpretation: description.interpretation,
    primaryReason: description.primaryReason,
    changingAssumption: description.changingAssumption,
    primaryCaution: description.primaryCaution,
    additionalCautions: description.additionalCautions,
    firstAction: description.firstAction,
    actionSequence: description.actionSequence,
    verificationChecklist: description.verificationChecklist,
    assumptions: buildAssumptions(input),
    metricGroups: buildMetricGroups(decisionWithoutView),
    portableSummary: "",
    educationalLimitation: "Educational estimate only. Monthly payments and interest use a fixed monthly amortization model; entered lender fees are assumed paid upfront; variable APRs are held constant for illustration; final payments are rounded only for display. Current loan documents and final lender disclosures control.",
  };
  view.portableSummary = createPortableSummary(decisionWithoutView, description);
  return { ...decisionWithoutView, view };
};

export const evaluatePrivateStudentLoanQuotes = (
  input: Omit<PrivateStudentLoanDecisionInput, "quote" | "quoteMode">,
  quotes: RefinanceQuoteInput[],
) => quotes.map((quote) => evaluatePrivateStudentLoanDecision({ ...input, quoteMode: "compare", quote }));
