export interface BenefitsCommandCenterEntryConfig {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  sampleButtonLabel?: string;
  entrySurface: "homepage" | "start_here" | "tools" | "healthcare_workers" | "insurance" | "open_enrollment" | "related_tool";
}

export const BENEFITS_COMMAND_CENTER_ENTRY_ROUTES: Record<string, BenefitsCommandCenterEntryConfig> = {
  "/start-here": {
    eyebrow: "Deep workplace-finance workspace",
    title: "Turn the Navigator plan into a complete Benefits Receipt",
    description: "Build compensation, health-plan, retirement, paid-leave, hidden-benefit, and job-structure details in one private workspace.",
    buttonLabel: "Open Benefits Command Center",
    sampleButtonLabel: "Preview a completed Receipt",
    entrySurface: "start_here",
  },
  "/tools": {
    eyebrow: "Flagship workplace tool",
    title: "Build the entire package—not another isolated calculation",
    description: "Combine offer comparison, open enrollment, employer contributions, hidden benefits, and verification questions into one decision workspace.",
    buttonLabel: "Build my benefits package",
    sampleButtonLabel: "See the sample first",
    entrySurface: "tools",
  },
  "/insurance": {
    eyebrow: "Connect coverage to compensation",
    title: "Put the health plan inside the complete benefits package",
    description: "Compare premiums and cost exposure alongside retirement contributions, PTO, employer money, and the rest of the job offer.",
    buttonLabel: "Open package workspace",
    entrySurface: "insurance",
  },
  "/healthcare-workers": {
    eyebrow: "Healthcare-worker compensation",
    title: "Build the package behind the hourly rate or salary",
    description: "Include overtime, differentials, call, retirement, health coverage, paid leave, commute, and quality-of-life tradeoffs.",
    buttonLabel: "Build my package",
    sampleButtonLabel: "Compare sample healthcare jobs",
    entrySurface: "healthcare_workers",
  },
  "/open-enrollment": {
    eyebrow: "Before submitting elections",
    title: "Compare the health plan inside the full employer-benefits picture",
    description: "Model health-plan scenarios, employer HSA or HRA money, retirement capture, tax accounts, protection benefits, and unresolved HR questions.",
    buttonLabel: "Open Command Center",
    entrySurface: "open_enrollment",
  },
  "/tools/healthcare-worker-total-compensation-comparison": {
    eyebrow: "Continue beyond compensation",
    title: "Turn this job comparison into a complete Benefits Receipt",
    description: "Add health-plan exposure, retirement capture, paid leave, hidden benefits, vesting, and verification questions to the two-offer decision.",
    buttonLabel: "Build complete packages",
    sampleButtonLabel: "View sample comparison",
    entrySurface: "related_tool",
  },
  "/tools/healthcare-worker-benefits-blueprint": {
    eyebrow: "Move from goals to plan details",
    title: "Build the actual package after setting the Benefits Blueprint",
    description: "Use the Blueprint to define priorities, then enter the employer numbers and generate a decision-ready receipt.",
    buttonLabel: "Build actual package",
    entrySurface: "related_tool",
  },
  "/tools/employer-benefits-action-plan": {
    eyebrow: "Expand the action plan",
    title: "See how employer benefits affect total package value",
    description: "Connect the checklist to compensation, healthcare exposure, paid leave, uncaptured matching, hidden benefits, and job tradeoffs.",
    buttonLabel: "Open full workspace",
    entrySurface: "related_tool",
  },
  "/tools/403b-paycheck-calculator": {
    eyebrow: "Retirement is one part of compensation",
    title: "Place the 403(b) decision inside the entire benefits package",
    description: "Compare employer matching and vesting alongside health costs, paid leave, cash compensation, and other employer-paid value.",
    buttonLabel: "Build Benefits Receipt",
    entrySurface: "related_tool",
  },
  "/tools/open-enrollment-true-cost-calculator": {
    eyebrow: "Continue the plan comparison",
    title: "Add the health-plan result to the complete employer package",
    description: "Compare healthcare exposure alongside retirement, compensation, leave, protection benefits, family support, and schedule tradeoffs.",
    buttonLabel: "Open Benefits Command Center",
    entrySurface: "related_tool",
  },
};

export const hasBenefitsCommandCenterEntry = (pathname: string) => Boolean(BENEFITS_COMMAND_CENTER_ENTRY_ROUTES[pathname]);
