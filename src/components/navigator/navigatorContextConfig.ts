export interface NavigatorContextConfig {
  recommendationId: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
}

export const NAVIGATOR_CONTEXT_ACTIONS: Record<string, NavigatorContextConfig> = {
  "/insurance/medical-bill-review-toolkit": {
    recommendationId: "cost_deadline",
    eyebrow: "Continue the decision",
    title: "Add follow-up tracking to My Plan",
    description: "Keep the medical-bill calls, requested documents, promises, and deadlines connected to a broader financial action plan.",
    buttonLabel: "Add tracker action",
  },
  "/tools/medical-bill-review-flow": {
    recommendationId: "cost_confirm_processing",
    eyebrow: "Save the next step",
    title: "Add claim-processing review to My Plan",
    description: "Preserve this as an action you can complete after contacting the provider, insurer, Medicare, Medicaid, or plan administrator.",
    buttonLabel: "Add review action",
  },
  "/tools/eob-to-bill-match-checker": {
    recommendationId: "cost_compare_eob",
    eyebrow: "Save the next step",
    title: "Add the bill-and-EOB comparison to My Plan",
    description: "Keep the document comparison alongside any later billing, assistance, appeal, or follow-up actions.",
    buttonLabel: "Add comparison",
  },
  "/tools/healthcare-worker-total-compensation-comparison": {
    recommendationId: "career_total_comp",
    eyebrow: "Continue the career decision",
    title: "Add total-compensation comparison to My Plan",
    description: "Track the compensation, benefits, schedule, commute, and quality-of-life analysis as one decision rather than an isolated calculation.",
    buttonLabel: "Add comparison action",
  },
  "/tools/healthcare-worker-benefits-blueprint": {
    recommendationId: "benefits_blueprint",
    eyebrow: "Continue the benefits decision",
    title: "Add the Benefits Blueprint to My Plan",
    description: "Save the blueprint as a structured step before entering the employer portal or finalizing elections.",
    buttonLabel: "Add blueprint",
  },
  "/tools/employer-benefits-action-plan": {
    recommendationId: "benefits_action_plan",
    eyebrow: "Continue the benefits decision",
    title: "Add the employer-benefits checklist to My Plan",
    description: "Keep retirement, insurance, tax-account, and voluntary-benefit actions in one local workspace.",
    buttonLabel: "Add action plan",
  },
  "/tools/medicare-medicaid-eligibility-check": {
    recommendationId: "cost_program_guide",
    eyebrow: "Continue the coverage decision",
    title: "Add Medicare and Medicaid verification to My Plan",
    description: "Save the official-verification step without storing eligibility answers or personal details.",
    buttonLabel: "Add verification step",
  },
  "/build-wealth": {
    recommendationId: "wealth_starter_reserve",
    eyebrow: "Build a complete sequence",
    title: "Add the stabilize-first foundation to My Plan",
    description: "Turn the wealth hub into a trackable sequence across cash reserves, debt, workplace benefits, and investing.",
    buttonLabel: "Add foundation action",
  },
  "/insurance": {
    recommendationId: "benefits_sbc",
    eyebrow: "Build a benefits plan",
    title: "Add plan-document review to My Plan",
    description: "Start with the standardized coverage document, then connect the appropriate comparison or election tool.",
    buttonLabel: "Add SBC review",
  },
  "/healthcare-workers": {
    recommendationId: "career_transition_hub",
    eyebrow: "Build a career plan",
    title: "Add a healthcare-career transition step to My Plan",
    description: "Connect career trajectory, compensation, benefits, and quality-of-life decisions in one private workspace.",
    buttonLabel: "Add transition step",
  },
  "/patients-families": {
    recommendationId: "cost_toolkit",
    eyebrow: "Build a healthcare-cost plan",
    title: "Add the Medical Bill Review Toolkit to My Plan",
    description: "Save the medical-cost starting point and return to the specialized tools as the issue becomes clearer.",
    buttonLabel: "Add toolkit",
  },
  "/open-enrollment": {
    recommendationId: "benefits_deadline",
    eyebrow: "Protect the election",
    title: "Add the enrollment deadline check to My Plan",
    description: "Keep the controlling deadline and election constraints visible while comparing plans and benefits.",
    buttonLabel: "Add deadline check",
  },
  "/tools/403b-paycheck-calculator": {
    recommendationId: "wealth_capture_match",
    eyebrow: "Continue the retirement decision",
    title: "Add employer-match verification to My Plan",
    description: "Connect the paycheck estimate to the actual plan formula, vesting schedule, and next contribution action.",
    buttonLabel: "Add match check",
  },
};

export const hasNavigatorContextAction = (pathname: string) => Boolean(NAVIGATOR_CONTEXT_ACTIONS[pathname]);
