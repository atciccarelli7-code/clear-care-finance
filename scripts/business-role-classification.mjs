export const BUSINESS_ROLES = Object.freeze({
  FREE_ACQUISITION: "free_acquisition",
  FREE_TRUST_AND_EDUCATION: "free_trust_and_education",
  FREE_QUALIFICATION: "free_qualification",
  PAID_PRODUCT_MODULE_CANDIDATE: "paid_product_module_candidate",
  SHARED_PRODUCT_INFRASTRUCTURE: "shared_product_infrastructure",
  CONSOLIDATION_CANDIDATE: "archive_merge_redirect_remove_candidate",
});

const trustRoutes = new Set([
  "/about",
  "/accessibility",
  "/contact",
  "/disclosures",
  "/editorial-policy",
  "/methodology",
  "/privacy-policy",
  "/terms-of-use",
]);

const freeAcquisitionRoutes = new Set([
  "/",
  "/articles",
  "/build-wealth",
  "/guides",
  "/healthcare-workers",
  "/healthcare-workers/career-decisions",
  "/healthcare-workers/paycheck-tools",
  "/insurance",
  "/medicare-care-costs",
  "/newsletter",
  "/patients-families",
  "/patients-families/hospital-guide",
  "/student-loans",
  "/tools",
  "/topics",
]);

const flagshipQualificationRoutes = new Set([
  "/start-here",
  "/open-enrollment",
  "/insurance/commercial-insurance-comparison",
  "/insurance/health-insurance-plan-types",
  "/insurance/how-to-read-an-sbc",
  "/topics/health-insurance",
  "/topics/retirement-accounts",
  "/topics/workplace-benefits",
  "/tools/healthcare-worker-total-compensation-comparison",
  "/tools/roth-vs-traditional-decision-helper",
]);

const paidModuleCandidateRoutes = new Set([
  "/tools/403b-paycheck-calculator",
  "/tools/benefits-change-detector",
  "/tools/childcare-benefits-decision-guide",
  "/tools/employer-benefits-action-plan",
  "/tools/health-insurance-visit-cost-calculator",
  "/tools/healthcare-worker-benefits-blueprint",
  "/tools/hsa-vs-fsa-decision-helper",
  "/tools/open-enrollment-final-checklist",
  "/tools/open-enrollment-paycheck-impact-calculator",
  "/tools/open-enrollment-true-cost-calculator",
  "/tools/out-of-pocket-max-estimator",
  "/tools/supplemental-benefits-decision-helper",
]);

const patientPublicInterestPrefixes = [
  "/insurance/medical-bill-review-toolkit",
  "/insurance/hospital-discharge-coverage",
  "/insurance/medicare-advantage",
  "/insurance/medicare-advantage-vs-medigap",
  "/insurance/medication-coverage-checklist",
  "/insurance/what-medicare-advantage-marketing-may-not-emphasize",
  "/medicare-care-costs/",
  "/patients-families/",
  "/tools/eob-to-bill-match-checker",
  "/tools/financial-assistance-checklist",
  "/tools/hospital-bill-review-checklist",
  "/tools/hospital-discharge-medicare-checklist",
  "/tools/medical-appointment-cost-preparation",
  "/tools/medical-bill-review-flow",
  "/tools/medicare-",
  "/tools/observation-vs-inpatient-status-guide",
  "/tools/prior-authorization-next-step-guide",
  "/tools/state-medicaid-long-term-care-router",
];

const openEnrollmentArticleSignals = [
  "open-enrollment",
  "beneficiar",
  "dental-vision-insurance",
  "disability-insurance-healthcare-workers",
  "employer-life-insurance",
  "health-fsa",
  "hsa-vs-fsa",
  "how-hospital-403b",
  "how-much-should-a-nurse-put-in-403b",
  "network-checklist",
  "premium-deductible-out-of-pocket",
  "prescription-coverage",
  "roth-vs-traditional-403b",
  "spouse-family-health-insurance",
  "what-employer-benefit-changes",
  "workplace-benefits-definitions",
  "accident-critical-illness-hospital-indemnity",
];

const consolidationRoutes = new Map([
  [
    "/tools/benefits-command-center",
    {
      phase_2_action: "merge_into_open_enrollment_qualification_path",
      rationale:
        "The route overlaps with the Benefits Blueprint, Employer Benefits Action Plan, open-enrollment hub, and flagship workspace. Preserve useful logic, but stop presenting a parallel named system.",
      verification_status: "founder_architecture_decision",
    },
  ],
  [
    "/articles/plain-english-glossary",
    {
      phase_2_action: "merge_or_redirect_to_canonical_glossary_after_search_review",
      rationale:
        "CAF already has a canonical /glossary experience. Retain only one primary glossary destination while preserving any proven search equity.",
      verification_status: "requires_search_and_redirect_review",
    },
  ],
  [
    "/articles/discharge-coverage-guide",
    {
      phase_2_action: "merge_with_hospital_discharge_coverage_cluster_after_content_review",
      rationale:
        "The article substantially overlaps the dedicated discharge coverage guide and hospital-to-home journey. Consolidate hierarchy before considering a URL change.",
      verification_status: "requires_content_and_search_review",
    },
  ],
]);

const startsWithAny = (route, prefixes) => prefixes.some((prefix) => route.startsWith(prefix));
const includesAny = (value, signals) => signals.some((signal) => value.includes(signal));

const result = ({
  business_role,
  public_access_decision,
  flagship_relationship,
  phase_2_action,
  rationale,
  verification_status = "confirmed_from_current_route_inventory",
}) => ({
  business_role,
  public_access_decision,
  flagship_relationship,
  phase_2_action,
  rationale,
  verification_status,
});

export function classifyBusinessRole(row) {
  const route = String(row.route ?? "").trim();
  const routeClass = String(row.route_class ?? "").trim();
  const primaryIntent = String(row.primary_intent ?? "").trim();

  if (!route.startsWith("/")) {
    throw new Error(`Invalid route in business-role inventory: ${route || "<empty>"}`);
  }

  const consolidation = consolidationRoutes.get(route);
  if (consolidation) {
    return result({
      business_role: BUSINESS_ROLES.CONSOLIDATION_CANDIDATE,
      public_access_decision: "remain_available_until_redirect_or_merge_is_approved",
      flagship_relationship: route.includes("benefits-command-center")
        ? "overlapping_flagship_qualification_surface"
        : "none",
      ...consolidation,
    });
  }

  if (primaryIntent === "Page Not Found") {
    return result({
      business_role: BUSINESS_ROLES.CONSOLIDATION_CANDIDATE,
      public_access_decision: "verify_route_before_any_destructive_change",
      flagship_relationship: route.includes("benefits") ? "possible_flagship_support" : "none",
      phase_2_action: "repair_metadata_or_route_then_reclassify",
      rationale:
        "The canonical inventory resolves this route with Page Not Found metadata. Treat it as a route-integrity defect until live behavior, content ownership, and redirect requirements are verified.",
      verification_status: "requires_live_route_and_seo_registry_verification",
    });
  }

  if (trustRoutes.has(route)) {
    return result({
      business_role: BUSINESS_ROLES.FREE_TRUST_AND_EDUCATION,
      public_access_decision: "remain_free_and_ad_free",
      flagship_relationship: "trust_boundary_for_all_products",
      phase_2_action: "retain_without_conversion_pressure",
      rationale:
        "Trust, legal, privacy, accessibility, editorial, and source-governance information must remain public and independent of purchase.",
    });
  }

  if (paidModuleCandidateRoutes.has(route)) {
    return result({
      business_role: BUSINESS_ROLES.PAID_PRODUCT_MODULE_CANDIDATE,
      public_access_decision: "keep_current_single_purpose_version_free",
      flagship_relationship: "reuse_logic_inside_open_enrollment_workspace",
      phase_2_action: "retain_free_route_and_add_contextual_flagship_handoff",
      rationale:
        "The public route solves one bounded problem. Its logic or checklist becomes more valuable when coordinated with other benefit categories, saved work, source status, and a decision brief.",
    });
  }

  if (flagshipQualificationRoutes.has(route)) {
    return result({
      business_role: BUSINESS_ROLES.FREE_QUALIFICATION,
      public_access_decision: "remain_free",
      flagship_relationship: "direct_flagship_qualification_or_preview",
      phase_2_action: "clarify_free_result_then_offer_flagship_preview",
      rationale:
        "This route helps a user identify the decision, understand required inputs, or decide whether a coordinated open-enrollment workspace is relevant.",
    });
  }

  if (routeClass === "article") {
    if (includesAny(route, openEnrollmentArticleSignals)) {
      return result({
        business_role: BUSINESS_ROLES.FREE_QUALIFICATION,
        public_access_decision: "remain_free",
        flagship_relationship: "supports_open_enrollment_decision_preparation",
        phase_2_action: "retain_article_and_add_one_relevant_flagship_handoff",
        rationale:
          "The article explains a benefit decision that belongs in the flagship workflow, but foundational education and safety-critical facts remain free.",
      });
    }

    return result({
      business_role: BUSINESS_ROLES.FREE_TRUST_AND_EDUCATION,
      public_access_decision: "remain_free",
      flagship_relationship: "supporting_education_or_future_journey",
      phase_2_action: "retain_and_group_under_free_education",
      rationale:
        "The article provides public education and trust value. It should not be paywalled merely because CAF is becoming product-led.",
    });
  }

  if (startsWithAny(route, patientPublicInterestPrefixes)) {
    return result({
      business_role: BUSINESS_ROLES.FREE_TRUST_AND_EDUCATION,
      public_access_decision: "remain_free_and_ad_free_when_current_governance_requires",
      flagship_relationship: "none",
      phase_2_action: "retain_in_patient_caregiver_free_layer",
      rationale:
        "Medical-bill, Medicare, Medicaid, discharge, prior-authorization, and patient-safety workflows remain public-interest education rather than a second paid system.",
    });
  }

  if (routeClass === "tool") {
    return result({
      business_role: BUSINESS_ROLES.FREE_QUALIFICATION,
      public_access_decision: "remain_free",
      flagship_relationship: route.includes("student-loan") || route.includes("total-compensation")
        ? "future_adjacent_product_evidence"
        : "demonstrates_decision_support_capability",
      phase_2_action: "retain_as_free_single_purpose_tool",
      rationale:
        "Single-purpose calculations and bounded decision helpers stay free. They create trust, complete a small task, and reveal when a larger coordinated workflow may be useful.",
    });
  }

  if (freeAcquisitionRoutes.has(route) || routeClass === "topic") {
    return result({
      business_role: BUSINESS_ROLES.FREE_ACQUISITION,
      public_access_decision: "remain_free",
      flagship_relationship: route.includes("healthcare-workers") || route === "/"
        ? "primary_audience_acquisition"
        : "supports_broader_platform_acquisition",
      phase_2_action: "organize_under_decision_first_free_navigation",
      rationale:
        "The route attracts or routes an audience into CAF's free decision-preparation layer without requiring a purchase.",
    });
  }

  if (route === "/glossary" || routeClass === "hub_or_guide") {
    return result({
      business_role: BUSINESS_ROLES.FREE_TRUST_AND_EDUCATION,
      public_access_decision: "remain_free",
      flagship_relationship: route.includes("insurance") ? "supporting_flagship_education" : "supporting_platform_education",
      phase_2_action: "retain_and_place_under_free_resources_or_trust",
      rationale:
        "The route provides foundational education, official-source navigation, or a public guide that should remain independent of purchase.",
    });
  }

  return result({
    business_role: BUSINESS_ROLES.FREE_TRUST_AND_EDUCATION,
    public_access_decision: "remain_free_pending_specific_reclassification",
    flagship_relationship: "none",
    phase_2_action: "retain_and_review_during_phase_2",
    rationale:
      "Fail-safe classification keeps unrecognized public routes free until a deliberate route-level decision is recorded.",
    verification_status: "fail_safe_default_requires_review",
  });
}

export const SUPPLEMENTAL_ROUTE_ASSETS = Object.freeze([
  {
    route: "/products/healthcare-worker-benefits-decision-system",
    route_class: "product_preview",
    audience: "healthcare_workers",
    primary_intent: "Healthcare Worker Benefits Decision System preview",
    ...result({
      business_role: BUSINESS_ROLES.FREE_QUALIFICATION,
      public_access_decision: "remain_noindex_or_bounded_until_demand_gate_passes",
      flagship_relationship: "single_visible_paid_flagship_preview",
      phase_2_action: "rename_and_reframe_as_open_enrollment_workspace_preview",
      rationale:
        "The public product surface explains the outcome, boundary, price hypothesis, privacy posture, and early-access commitment without enabling checkout.",
      verification_status: "confirmed_from_premium_foundation_and_founder_direction",
    }),
  },
  {
    route: "/products/healthcare-worker-benefits-decision-pack",
    route_class: "legacy_redirect",
    audience: "healthcare_workers",
    primary_intent: "Legacy product redirect",
    ...result({
      business_role: BUSINESS_ROLES.CONSOLIDATION_CANDIDATE,
      public_access_decision: "preserve_permanent_redirect",
      flagship_relationship: "legacy_flagship_name",
      phase_2_action: "retain_redirect_only",
      rationale: "The document-first product identity is retired; preserve route equity through the existing redirect.",
      verification_status: "confirmed_from_premium_foundation",
    }),
  },
  ...[
    "/sign-in",
    "/account",
    "/access-processing",
    "/app",
    "/app/benefits-decision",
    "/app/benefits-decision/new",
    "/app/benefits-decision/:workspaceId",
  ].map((route) => ({
    route,
    route_class: route.startsWith("/app") ? "private_workspace" : "account_access",
    audience: "healthcare_workers",
    primary_intent: "Paid workspace infrastructure",
    ...result({
      business_role: BUSINESS_ROLES.SHARED_PRODUCT_INFRASTRUCTURE,
      public_access_decision: "remain_private_noindex_no_store_and_fail_closed",
      flagship_relationship: "paid_flagship_infrastructure",
      phase_2_action: "do_not_promote_until_auth_persistence_and_demand_gates_pass",
      rationale:
        "Authentication, account, entitlement, and workspace routes are infrastructure rather than educational inventory. Checkout and paid access remain disabled.",
      verification_status: "confirmed_from_premium_architecture",
    }),
  })),
]);
