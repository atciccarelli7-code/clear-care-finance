import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const [
  tools,
  studentProduct,
  studentDomain,
  retirementProduct,
  retirementDomain,
  retirementCalculator,
  healthProduct,
  healthDomain,
  healthCalculator,
  healthBrowserTest,
  analytics,
  commercial,
  freshness,
  sources,
  outcomePanel,
  seoRegistry,
  printCss,
  printPdfTest,
] = await Promise.all([
  read("src/data/tools.ts"),
  read("src/data/privateStudentLoanDecisionProduct.ts"),
  read("src/lib/privateStudentLoanDecision.ts"),
  read("src/data/retirement403bDecisionProduct.ts"),
  read("src/lib/retirement403bDecision.ts"),
  read("src/components/calculators/Calc403bEmailEstimate.tsx"),
  read("src/data/healthInsuranceCostShareDecisionProduct.ts"),
  read("src/lib/healthInsuranceCostShareDecision.ts"),
  read("src/components/calculators/HealthInsuranceVisitCostCalculator.tsx"),
  read("e2e/health-insurance-cost-share-decision-outcome.spec.ts"),
  read("src/lib/decisionOutcomeAnalytics.ts"),
  read("src/lib/studentLoanCommercialHandoff.ts"),
  read("src/components/shared/RouteFreshness.tsx"),
  read("src/data/sources.ts"),
  read("src/components/shared/DecisionOutcomePanel.tsx"),
  read("src/lib/seoRegistry.ts"),
  read("src/print.css"),
  read("e2e/print-pdf-certification.spec.ts"),
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
requireText(tools, 'decisionProductId: "retirement_403b_contribution"', "403(b) tool must declare its decision product.");
requireText(tools, 'decisionProductId: "health_insurance_cost_share"', "Patient cost-share tool must declare its decision product.");
requireText(tools, "model common employer formulas", "403(b) directory copy must describe the explicit formula workflow.");
requireText(tools, "Estimate covered in-network patient responsibility", "Patient cost-share directory copy must describe the bounded service-rule workflow.");

for (const [name, product] of [
  ["Private student-loan", studentProduct],
  ["403(b)", retirementProduct],
  ["Patient cost-share", healthProduct],
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
requireText(retirementDomain, "The Summary Plan Description and payroll records control.", "403(b) outcomes must visibly identify the controlling plan and payroll records.");
if (retirementDomain.includes("studentLoanCommercialHandoff") || retirementDomain.includes("PARTNER")) {
  failures.push("403(b) recommendation logic must remain independent from commercial configuration.");
}

requireText(retirementCalculator, "formatCurrency", "403(b) portable email values must remain human-readable currency.");
requireText(retirementCalculator, "payFrequencyLabel", "403(b) portable email must retain a readable pay-frequency label.");
requireText(retirementCalculator, 'assumption.label === "Employer formula"', "403(b) portable email must use the rendered employer-formula assumption rather than an internal enum.");
if (retirementCalculator.includes("employerMatchPercent: values.matchFormula")) failures.push("403(b) email payload must not expose the internal formula enum.");
if (retirementCalculator.includes("decisionSummary: decision.view.portableSummary")) failures.push("403(b) email payload must remain bounded to the established estimate schema until the endpoint is hardened.");

for (const state of [
  "verify_plan_rule",
  "verify_network_or_coverage",
  "out_of_pocket_cap_likely_limits",
  "copay_applies",
  "deductible_applies_first",
  "post_deductible_cost_sharing",
  "insufficient_information",
]) requireText(healthProduct, state, `Patient cost-share decision product is missing ${state}.`);
requireText(healthProduct, "allowed: false", "Patient cost-share product must remain noncommercial.");
requireText(healthDomain, 'costRule === "unknown_or_other"', "Unknown service rules must have an explicit fail-closed branch.");
requireText(healthDomain, "estimatedPatientCost: number | null", "Patient cost must support a fail-closed null state.");
requireText(healthDomain, 'networkStatus === "covered_in_network"', "Out-of-pocket cap logic must require confirmed covered in-network status.");
requireText(healthDomain, "Math.min(estimatedPatientCostBeforeCap, remainingOutOfPocketBeforeCare)", "Confirmed covered in-network cost sharing must be bounded by remaining out-of-pocket room.");
requireText(healthDomain, "A deductible, copay, and coinsurance should not be added together automatically", "Patient cost-share outcome must explain the corrected model boundary.");
requireText(healthDomain, "processed EOB", "Patient cost-share outcome must identify the processed EOB boundary.");
requireText(healthCalculator, "Do not enter a name, member ID, diagnosis, account number, or claim number", "Patient cost-share form must state the sensitive-data boundary.");
requireText(healthBrowserTest, "#decision-outcome-health_insurance_cost_share", "Patient cost-share browser certification must verify portable print output.");
if (healthDomain.includes("CommercialHandoff") || healthDomain.includes("PARTNER")) failures.push("Patient cost-share recommendation logic must remain independent from commercial configuration.");

requireText(analytics, "ALLOWED_KEYS", "Decision analytics must use an exact property allowlist.");
if (analytics.includes('"loan_type"') || analytics.includes('"recommendation_state"')) failures.push("Decision analytics must not transmit selected loan type or recommendation state.");
if (studentDomain.includes("studentLoanCommercialHandoff") || studentDomain.includes("PARTNER")) failures.push("Recommendation logic must remain independent from commercial configuration.");
requireText(freshness, '"/tools/private-student-loan-payoff-calculator"', "Private student-loan route freshness metadata is required.");
requireText(freshness, '"/tools/403b-paycheck-calculator"', "403(b) route freshness metadata is required.");
requireText(freshness, '"/tools/health-insurance-visit-cost-calculator"', "Patient cost-share route freshness metadata is required.");
for (const sourceKey of ["federalStudentAidDashboard", "cfpbStudentLoanRefinance", "cfpbPrivateStudentLoans"]) requireText(sources, `${sourceKey}:`, `Publication source registry is missing ${sourceKey}.`);
requireText(outcomePanel, "definition.decisionIdentifier", "Shared outcome DOM identity must be derived from the product definition.");
if (outcomePanel.includes('id="private-loan-decision-outcome"')) failures.push("Shared outcome renderer must not retain a private-loan-only DOM identifier.");
if (outcomePanel.includes("student-loan review") || outcomePanel.includes("student-loan review action")) failures.push("Shared outcome renderer must not retain student-loan-only My Plan copy.");

requireText(printCss, 'body:has([id^="decision-outcome-"]) main *', "Print CSS must detect every Decision Outcome product through the generic ID prefix.");
requireText(printPdfTest, '"#decision-outcome-private_student_loan_payoff"', "Private-loan PDF certification must target the product-derived outcome ID.");
requireText(printPdfTest, '"403b-formula-verification-decision"', "403(b) unknown-formula PDF certification is required.");
requireText(printPdfTest, '"403b-partial-match-decision"', "403(b) supported partial-match PDF certification is required.");
requireText(printPdfTest, '"#decision-outcome-retirement_403b_contribution"', "403(b) PDF certification must target the product-derived outcome ID.");
const retirementPdfTestCount = (printPdfTest.match(/test\("generate 403\(b\) decision outcome PDFs"/g) ?? []).length;
if (retirementPdfTestCount !== 1) failures.push(`403(b) PDF certification must be declared exactly once; found ${retirementPdfTestCount}.`);
if (printCss.includes('[id^="decision-outcome-"] > article::before')) failures.push("Decision Outcome print styles must not add a duplicate synthetic heading above the product title.");
if (printCss.includes("#private-loan-decision-outcome") || printPdfTest.includes('"#private-loan-decision-outcome"')) failures.push("Legacy private-loan-only print selectors must not remain.");

requireText(seoRegistry, 'title: "403(b) Paycheck and Employer Match Calculator"', "403(b) prerender title must match the corrected product.");
requireText(seoRegistry, "model common employer matching or non-elective formulas", "403(b) prerender description must describe explicit employer formulas.");
requireText(seoRegistry, 'title: "Patient Cost Share Calculator"', "Patient cost-share prerender title is required.");
requireText(seoRegistry, "deductible, copay or coinsurance rule", "Patient cost-share prerender description must match service-rule intent.");
if (seoRegistry.includes('description: "Estimate your 403(b) contribution per paycheck, annual contribution, employer match, and progress toward the annual contribution limit."')) failures.push("Legacy generic 403(b) prerender description must not remain.");

if (failures.length) {
  console.error(`Decision outcome contract check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Decision outcome contracts passed for private student loans, 403(b), and patient cost sharing.");
