import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const [
  tools,
  studentProduct,
  studentDomain,
  retirementProduct,
  retirementDomain,
  analytics,
  commercial,
  freshness,
  sources,
  outcomePanel,
] = await Promise.all([
  read("src/data/tools.ts"),
  read("src/data/privateStudentLoanDecisionProduct.ts"),
  read("src/lib/privateStudentLoanDecision.ts"),
  read("src/data/retirement403bDecisionProduct.ts"),
  read("src/lib/retirement403bDecision.ts"),
  read("src/lib/decisionOutcomeAnalytics.ts"),
  read("src/lib/studentLoanCommercialHandoff.ts"),
  read("src/components/shared/RouteFreshness.tsx"),
  read("src/data/sources.ts"),
  read("src/components/shared/DecisionOutcomePanel.tsx"),
]);

const failures = [];
const requireText = (source, token, message) => { if (!source.includes(token)) failures.push(message); };
const requiredDefinitionFields = [
  "decisionIdentifier",
  "decisionBeingCompleted",
  "eligibleAudience",
  "resultType",
  "recommendationStates",
  "verificationRequirements",
  "requiredCautions",
  "officialResources",
  "portableOutputCapabilities",
  "myPlanSupport",
  "analyticsEvents",
  "monetizationEligibility",
  "disclosureRequirements",
  "noncommercialAlternatives",
  "sourceFreshnessRequirements",
  "releaseConstraints",
];

requireText(tools, 'decisionProductId?: DecisionProductDefinition["decisionIdentifier"]', "ToolDefinition must retain the typed decision-product reference.");
requireText(tools, 'decisionProductId: "private_student_loan_payoff"', "Private student-loan tool must declare its decision product.");

for (const [name, product] of [
  ["Private student-loan", studentProduct],
  ["403(b)", retirementProduct],
]) {
  for (const field of requiredDefinitionFields) {
    requireText(product, `${field}:`, `${name} decision product is missing ${field}.`);
  }
}

requireText(studentProduct, "verify_loan_type_first", "Loan-type verification state is required.");
requireText(studentProduct, "lower_payment_higher_total_cost", "Lower-payment/higher-cost state is required.");
requireText(studentProduct, "requiresVerifiedConfiguration: true", "Commercial configuration must be verified.");
requireText(commercial, "if (!config || config.enabled !== true", "Commercial resolver must fail closed when configuration is absent or disabled.");
requireText(commercial, "context.loanType !== \"private\"", "Commercial resolver must require private loans.");
requireText(commercial, "globalDisclosureConfirmed", "Commercial resolver must require disclosure confirmation.");

for (const state of [
  "verify_match_formula",
  "below_full_match",
  "capturing_full_match",
  "non_elective_contribution",
  "no_employer_contribution_identified",
  "insufficient_information",
]) requireText(retirementProduct, state, `403(b) decision product is missing ${state}.`);
requireText(retirementProduct, "allowed: false", "403(b) product must remain noncommercial.");
requireText(retirementDomain, 'matchFormula === "unknown_or_tiered"', "Unknown or tiered 403(b) formulas must have an explicit branch.");
requireText(retirementDomain, 'annualEmployerContribution: number | null', "403(b) employer contribution must support a fail-closed null state.");
requireText(retirementDomain, 'return "verify_match_formula"', "Unknown 403(b) formulas must return the verification state.");
requireText(retirementDomain, 'annualEmployerContribution = annualEligiblePay', "Supported 403(b) formulas must be calculated from eligible pay.");
if (retirementDomain.includes("studentLoanCommercialHandoff") || retirementDomain.includes("PARTNER")) {
  failures.push("403(b) recommendation logic must remain independent from commercial configuration.");
}

requireText(analytics, "ALLOWED_KEYS", "Decision analytics must use an exact property allowlist.");
if (analytics.includes('"loan_type"') || analytics.includes('"recommendation_state"')) failures.push("Decision analytics must not transmit selected loan type or recommendation state.");
if (studentDomain.includes("studentLoanCommercialHandoff") || studentDomain.includes("PARTNER")) failures.push("Recommendation logic must remain independent from commercial configuration.");
requireText(freshness, '"/tools/private-student-loan-payoff-calculator"', "Private student-loan route freshness metadata is required.");
for (const sourceKey of ["federalStudentAidDashboard", "cfpbStudentLoanRefinance", "cfpbPrivateStudentLoans"]) requireText(sources, `${sourceKey}:`, `Publication source registry is missing ${sourceKey}.`);
requireText(outcomePanel, "definition.decisionIdentifier", "Shared outcome DOM identity must be derived from the product definition.");
if (outcomePanel.includes('id="private-loan-decision-outcome"')) failures.push("Shared outcome renderer must not retain a private-loan-only DOM identifier.");
if (outcomePanel.includes("student-loan review") || outcomePanel.includes("student-loan review action")) failures.push("Shared outcome renderer must not retain student-loan-only My Plan copy.");

if (failures.length) {
  console.error(`Decision outcome contract check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Decision outcome contracts passed for private student loans and 403(b) contribution decisions.");
