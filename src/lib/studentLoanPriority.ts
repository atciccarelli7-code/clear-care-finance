export type StudentLoanPriorityInput = {
  loanType: "federal" | "private" | "both" | "unknown";
  aprBand: "under-4" | "4-7" | "over-7" | "unknown";
  fullMatchCaptured: "yes" | "no" | "unknown";
  emergencyFund: "under-1-month" | "1-3-months" | "3-plus-months" | "unknown";
  forgivenessPath: "yes" | "no" | "unknown";
  majorExpense: "yes" | "no" | "unknown";
  monthlySurplus: "under-250" | "250-750" | "over-750" | "unknown";
};

export const buildStudentLoanPriority = (input: StudentLoanPriorityInput) => {
  const priorities: string[] = [];
  const verify: string[] = [];
  if (input.emergencyFund === "under-1-month" || input.emergencyFund === "unknown") priorities.push("Protect a basic cash buffer before committing every available dollar to extra loan payments or long-term investing.");
  if (input.fullMatchCaptured === "no" || input.fullMatchCaptured === "unknown") priorities.push("Verify and capture the full employer retirement match before making an irreversible refinance or aggressive extra-payment decision.");
  if (input.loanType === "federal" || input.loanType === "both" || input.loanType === "unknown") verify.push("Confirm federal loan type, repayment plan, PSLF employer eligibility, payment count, and current federal program status before refinancing.");
  if (input.forgivenessPath === "yes" || input.forgivenessPath === "unknown") priorities.push("Preserve the federal-forgiveness option until eligibility, payment progress, and total projected cost are verified.");
  if (input.aprBand === "over-7" && input.forgivenessPath === "no") priorities.push("High-rate debt may deserve a larger share of surplus after the emergency buffer and employer match are protected.");
  if (input.majorExpense === "yes") priorities.push("Reserve cash for the known major expense rather than assuming invested money or refinancing proceeds will be available on schedule.");
  if (!priorities.length) priorities.push("Compare the guaranteed interest saved from extra payments with the uncertainty, taxes, liquidity, and time horizon of additional investing; a split allocation may be reasonable to model.");
  verify.push("Use Federal Student Aid for current repayment and forgiveness rules; use the private lender's written payoff and refinance disclosures for private debt.");
  return { first: priorities[0], priorities, verify, warning: "This framework does not calculate an optimal portfolio, tax strategy, forgiveness outcome, or refinance recommendation." };
};
