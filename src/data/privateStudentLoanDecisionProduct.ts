import { defineDecisionProduct } from "@/lib/decisionOutcome";
import type { PrivateStudentLoanRecommendationState } from "@/lib/privateStudentLoanDecision";

export const PRIVATE_STUDENT_LOAN_DECISION_ID = "private_student_loan_payoff";

export const privateStudentLoanDecisionProduct = defineDecisionProduct<PrivateStudentLoanRecommendationState>({
  decisionIdentifier: PRIVATE_STUDENT_LOAN_DECISION_ID,
  decisionBeingCompleted: "Choose a responsible next step for a confirmed private student loan after comparing payoff and complete refinance-quote terms.",
  eligibleAudience: ["Borrowers with confirmed private student loans", "Federal, mixed, or uncertain borrowers who need a loan-type verification boundary"],
  resultType: "calculation-and-recommendation",
  recommendationStates: [
    { id: "verify_loan_type_first", label: "Verify loan type first" },
    { id: "continue_current_plan", label: "Continue current plan" },
    { id: "accelerate_repayment", label: "Accelerate repayment" },
    { id: "seek_compare_refinance_quotes", label: "Seek and compare refinance quotes" },
    { id: "quoted_refinance_may_reduce_total_cost", label: "A quoted refinance may reduce total cost" },
    { id: "lower_payment_higher_total_cost", label: "Lower payment, but higher total cost" },
    { id: "do_not_refinance_based_on_quote", label: "Do not refinance based on this quote" },
    { id: "insufficient_information", label: "Insufficient information" },
  ],
  verificationRequirements: [
    { id: "loan_type", label: "Confirm that every loan included in a refinance comparison is private." },
    { id: "current_documents", label: "Review the current statement and promissory note." },
    { id: "final_disclosure", label: "Compare the final lender disclosure with the entered quote." },
  ],
  requiredCautions: [
    { id: "federal_protections", label: "Federal-to-private refinancing can permanently remove federal protections and programs." },
    { id: "total_cost", label: "A lower monthly payment can cost more over a longer term." },
    { id: "rate_and_fees", label: "Rate type, fees, and final terms can reverse an apparent benefit." },
    { id: "lender_terms", label: "Hardship, cosigner, servicing, and prepayment terms require document review." },
  ],
  officialResources: [
    {
      id: "fsa_dashboard",
      label: "Check federal loan records",
      url: "https://studentaid.gov/dashboard/",
      publisher: "Federal Student Aid",
      purpose: "Identify federal loans before entering a private-loan refinance path.",
    },
    {
      id: "cfpb_refinance_guide",
      label: "Review refinance tradeoffs",
      url: "https://www.consumerfinance.gov/ask-cfpb/should-i-consolidate-refinance-student-loans-en-561/",
      publisher: "Consumer Financial Protection Bureau",
      purpose: "Review federal/private boundaries, term, rate-type, and total-cost tradeoffs.",
    },
    {
      id: "cfpb_private_loans",
      label: "Review private-loan repayment options",
      url: "https://www.consumerfinance.gov/paying-for-college/repay-student-debt/private-student-loans/",
      publisher: "Consumer Financial Protection Bureau",
      purpose: "Understand that private-loan relief and protections depend on lender terms.",
    },
  ],
  portableOutputCapabilities: { copy: true, print: true, localSave: true, restart: true },
  myPlanSupport: { enabled: true, recommendationId: "wealth_student_loans" },
  analyticsEvents: [
    "decision_calculator_started",
    "decision_valid_result_reached",
    "decision_loan_type_selected",
    "decision_recommendation_reached",
    "decision_quote_comparison_started",
    "decision_quote_comparison_completed",
    "decision_portable_output_used",
    "decision_my_plan_action_saved",
    "decision_neutral_resource_opened",
    "decision_commercial_handoff_shown",
    "decision_commercial_handoff_used",
    "decision_assumptions_edited",
    "decision_journey_restarted",
    "decision_validation_blocked",
  ],
  monetizationEligibility: {
    allowed: true,
    requiresVerifiedConfiguration: true,
    eligibleStateIds: ["seek_compare_refinance_quotes", "quoted_refinance_may_reduce_total_cost"],
  },
  disclosureRequirements: [
    "Show a clear compensation disclosure adjacent to any commercial link.",
    "Keep the independent result and neutral alternative complete and visually primary.",
    "Do not show a commercial path for federal, mixed, uncertain, or unverified debt.",
  ],
  noncommercialAlternatives: [
    {
      id: "compare_independently",
      label: "Compare complete quotes independently",
      url: "https://www.consumerfinance.gov/paying-for-college/choose-a-student-loan/",
      publisher: "Consumer Financial Protection Bureau",
      purpose: "Use a neutral checklist for rate, term, fees, and credit-inquiry questions.",
    },
  ],
  sourceFreshnessRequirements: [
    { sourceId: "CAF-E-003", reviewedOn: "2026-07-31", reviewBy: "2027-01-31" },
  ],
  releaseConstraints: [
    "The recommendation engine must not import commercial configuration.",
    "Commercial handoff configuration must fail closed unless relationship, URL, freshness, and disclosure controls pass.",
    "Federal, mixed, and uncertain loan types must remain in the verification state.",
    "No user-entered or derived financial value may enter analytics, URLs, My Plan storage, or external requests.",
    "The route remains permanently ad-free under the current publication policy.",
  ],
});
