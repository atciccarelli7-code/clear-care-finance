import { defineDecisionProduct } from "@/lib/decisionOutcome";
import type { HealthInsuranceCostShareDecisionState } from "@/lib/healthInsuranceCostShareDecision";

export const HEALTH_INSURANCE_COST_SHARE_DECISION_ID = "health_insurance_cost_share";

export const healthInsuranceCostShareDecisionProduct = defineDecisionProduct<HealthInsuranceCostShareDecisionState>({
  decisionIdentifier: HEALTH_INSURANCE_COST_SHARE_DECISION_ID,
  decisionBeingCompleted: "Estimate patient cost sharing for a defined covered service without automatically combining deductible, copay, and coinsurance rules that may not apply together.",
  eligibleAudience: [
    "Patients and caregivers estimating covered in-network care",
    "Healthcare workers comparing job-based health plan cost sharing",
    "Anyone verifying deductible, copay, coinsurance, allowed amount, and out-of-pocket progress",
  ],
  resultType: "calculation-and-recommendation",
  recommendationStates: [
    { id: "verify_plan_rule", label: "Verify the service-specific plan rule" },
    { id: "verify_network_or_coverage", label: "Verify coverage and network status" },
    { id: "out_of_pocket_cap_likely_limits", label: "Out-of-pocket cap may limit cost" },
    { id: "copay_applies", label: "Fixed copay appears to apply" },
    { id: "deductible_applies_first", label: "Deductible appears to apply first" },
    { id: "post_deductible_cost_sharing", label: "Post-deductible cost sharing appears to apply" },
    { id: "insufficient_information", label: "Insufficient information" },
  ],
  verificationRequirements: [
    { id: "service_rule", label: "Exact service row in the current Summary of Benefits and Coverage" },
    { id: "network_coverage", label: "Covered benefit and in-network provider and facility status" },
    { id: "allowed_amount", label: "Plan allowed amount rather than provider billed charge" },
    { id: "accumulators", label: "Current deductible and out-of-pocket accumulator balances" },
    { id: "separate_claims", label: "Separate professional, facility, laboratory, imaging, anesthesia, drug, and equipment charges" },
  ],
  requiredCautions: [
    { id: "service_specific", label: "Cost-sharing rules are service specific" },
    { id: "oop_scope", label: "The out-of-pocket limit does not apply to every charge" },
    { id: "allowed_not_billed", label: "Allowed amount is not the provider billed charge" },
    { id: "eob_controls", label: "The processed EOB and plan records control" },
  ],
  officialResources: [
    {
      id: "healthcare_gov_coinsurance",
      label: "HealthCare.gov: Coinsurance",
      url: "https://www.healthcare.gov/glossary/co-insurance/",
      publisher: "HealthCare.gov",
      purpose: "Review how the allowed amount, deductible, and coinsurance interact.",
    },
    {
      id: "healthcare_gov_oop_max",
      label: "HealthCare.gov: Out-of-pocket maximum",
      url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/",
      publisher: "HealthCare.gov",
      purpose: "Confirm what generally counts toward the in-network out-of-pocket limit and what does not.",
    },
    {
      id: "cms_sbc",
      label: "CMS: Summary of Benefits and Coverage",
      url: "https://www.cms.gov/marketplace/health-plans-issuers/summary-benefits-coverage",
      publisher: "Centers for Medicare & Medicaid Services",
      purpose: "Find the standardized plan document used to verify service-specific cost sharing and limitations.",
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
      id: "caf_cost_sharing_guide",
      label: "CAF: Deductible, copay, coinsurance, and out-of-pocket maximum",
      url: "https://communityacquiredfinance.com/articles/deductible-copay-coinsurance-out-of-pocket-max",
      publisher: "Community Acquired Finance",
      purpose: "Use a plain-English guide to identify which plan term applies before estimating a service.",
    },
  ],
  sourceFreshnessRequirements: [
    { sourceId: "healthcare_gov_coinsurance", reviewedOn: "2026-08-01", reviewBy: "2027-02-01" },
    { sourceId: "healthcare_gov_oop_max", reviewedOn: "2026-08-01", reviewBy: "2027-02-01" },
    { sourceId: "cms_sbc", reviewedOn: "2026-08-01", reviewBy: "2027-02-01" },
  ],
  releaseConstraints: [
    "Unknown, combined, or unsupported service rules must fail closed without a patient-cost estimate.",
    "The out-of-pocket maximum must not be applied until covered in-network status is confirmed.",
    "Financial inputs, accumulator values, and calculated costs must not be transmitted through analytics.",
    "The independent result must remain complete without affiliate, premium, account, email, or backend activation.",
    "The existing canonical slug must remain stable.",
  ],
});
