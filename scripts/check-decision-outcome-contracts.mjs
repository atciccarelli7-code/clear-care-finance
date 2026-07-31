import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const [tools, product, domain, analytics, commercial, freshness, sources] = await Promise.all([
  read("src/data/tools.ts"),
  read("src/data/privateStudentLoanDecisionProduct.ts"),
  read("src/lib/privateStudentLoanDecision.ts"),
  read("src/lib/decisionOutcomeAnalytics.ts"),
  read("src/lib/studentLoanCommercialHandoff.ts"),
  read("src/components/shared/RouteFreshness.tsx"),
  read("src/data/sources.ts"),
]);

const failures = [];
const requireText = (source, token, message) => { if (!source.includes(token)) failures.push(message); };

requireText(tools, 'decisionProductId?: DecisionProductDefinition["decisionIdentifier"]', "ToolDefinition must retain the typed decision-product reference.");
requireText(tools, 'decisionProductId: "private_student_loan_payoff"', "Private student-loan tool must declare its decision product.");
for (const field of [
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
]) requireText(product, `${field}:`, `Decision product is missing ${field}.`);

requireText(product, "verify_loan_type_first", "Loan-type verification state is required.");
requireText(product, "lower_payment_higher_total_cost", "Lower-payment/higher-cost state is required.");
requireText(product, "requiresVerifiedConfiguration: true", "Commercial configuration must be verified.");
requireText(commercial, "if (!config || config.enabled !== true", "Commercial resolver must fail closed when configuration is absent or disabled.");
requireText(commercial, "context.loanType !== \"private\"", "Commercial resolver must require private loans.");
requireText(commercial, "globalDisclosureConfirmed", "Commercial resolver must require disclosure confirmation.");
requireText(analytics, "ALLOWED_KEYS", "Decision analytics must use an exact property allowlist.");
if (analytics.includes('"loan_type"') || analytics.includes('"recommendation_state"')) failures.push("Decision analytics must not transmit selected loan type or recommendation state.");
if (domain.includes("studentLoanCommercialHandoff") || domain.includes("PARTNER")) failures.push("Recommendation logic must remain independent from commercial configuration.");
requireText(freshness, '"/tools/private-student-loan-payoff-calculator"', "Decision route freshness metadata is required.");
for (const sourceKey of ["federalStudentAidDashboard", "cfpbStudentLoanRefinance", "cfpbPrivateStudentLoans"]) requireText(sources, `${sourceKey}:`, `Publication source registry is missing ${sourceKey}.`);

if (failures.length) {
  console.error(`Decision outcome contract check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Decision outcome contracts passed.");
