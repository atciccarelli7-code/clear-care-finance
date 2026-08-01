import { defineDecisionProduct } from "@/lib/decisionOutcome";
import type { Retirement403bDecisionState } from "@/lib/retirement403bDecision";

export const RETIREMENT_403B_DECISION_ID = "retirement_403b_contribution";

export const retirement403bDecisionProduct = defineDecisionProduct<Retirement403bDecisionState>({
  decisionIdentifier: RETIREMENT_403B_DECISION_ID,
  decisionBeingCompleted: "Estimate a 403(b) payroll contribution and determine whether the entered employer formula appears to be fully captured or still requires verification.",
  eligibleAudience: [
    "Healthcare workers with access to a 403(b) plan",
    "Workers verifying a common matching or non-elective employer contribution formula",
  ],
  resultType: "calculation-and-recommendation",
  recommendationStates: [
    { id: "verify_match_formula", label: "Verify the employer formula" },
    { id: "below_full_match", label: "Below the stated full-match threshold" },
    { id: "capturing_full_match", label: "Capturing the stated full match" },
    { id: "non_elective_contribution", label: "Non-elective employer contribution" },
    { id: "no_employer_contribution_identified", label: "No employer contribution identified" },
    { id: "insufficient_information", label: "Insufficient information" },
  ],
  verificationRequirements: [
    { id: "plan_formula", label: "Exact formula in the current Summary Plan Description or benefits guide" },
    { id: "eligible_compensation", label: "Eligible compensation definition, including overtime, bonuses, and differentials" },
    { id: "payroll_timing", label: "Per-paycheck funding and annual true-up rules" },
    { id: "vesting", label: "Eligibility and vesting schedule" },
  ],
  requiredCautions: [
    { id: "formula_boundary", label: "A generic match percentage can materially overstate employer contributions" },
    { id: "cash_flow", label: "A contribution increase must remain affordable" },
    { id: "tax_boundary", label: "Tax effects are illustrative and incomplete" },
    { id: "plan_controls", label: "The plan document and payroll records control" },
  ],
  officialResources: [
    {
      id: "irs_403b_written_plan",
      label: "IRS: Written plan document requirement for 403(b) plans",
      url: "https://www.irs.gov/retirement-plans/written-plan-document-requirement-for-403b-plans",
      publisher: "Internal Revenue Service",
      purpose: "Confirm that the written 403(b) plan document controls plan terms and operation.",
    },
    {
      id: "dol_retirement_plan_guide",
      label: "Department of Labor: What You Should Know About Your Retirement Plan",
      url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan",
      publisher: "U.S. Department of Labor",
      purpose: "Review Summary Plan Description, vesting, plan-feature, and participant-rights concepts.",
    },
  ],
  portableOutputCapabilities: {
    copy: true,
    print: true,
    localSave: false,
    restart: true,
  },
  myPlanSupport: { enabled: false },
  analyticsEvents: [
    "decision_calculator_started",
    "decision_valid_result_reached",
    "decision_recommendation_reached",
    "decision_portable_output_used",
    "decision_assumptions_edited",
    "decision_journey_restarted",
    "decision_neutral_resource_opened",
    "decision_validation_blocked",
  ],
  monetizationEligibility: {
    allowed: false,
    requiresVerifiedConfiguration: true,
    eligibleStateIds: [],
  },
  disclosureRequirements: [],
  noncommercialAlternatives: [
    {
      id: "caf_403b_matching_guide",
      label: "CAF: How hospital 403(b) matching works",
      url: "https://communityacquiredfinance.com/articles/how-hospital-403b-matching-works",
      publisher: "Community Acquired Finance",
      purpose: "Use a healthcare-worker-focused explanation before changing a payroll election.",
    },
  ],
  sourceFreshnessRequirements: [
    { sourceId: "irs_403b_written_plan", reviewedOn: "2026-08-01", reviewBy: "2027-08-01" },
    { sourceId: "dol_retirement_plan_guide", reviewedOn: "2026-08-01", reviewBy: "2027-08-01" },
  ],
  releaseConstraints: [
    "Unknown, tiered, discretionary, or true-up-dependent formulas must fail closed without an employer-contribution estimate.",
    "Financial inputs, formula assumptions, and calculated values must not be transmitted through analytics.",
    "The independent result must remain complete without affiliate, premium, account, email, or backend activation.",
    "Canonical route, sitemap, indexability, and AdSense treatment remain unchanged.",
  ],
});
