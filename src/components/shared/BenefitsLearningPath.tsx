import { Link } from "react-router-dom";
import { ArrowRight, BadgeDollarSign, HeartPulse, ShieldCheck, Signpost } from "lucide-react";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const pathways = [
  {
    id: "prepare",
    icon: Signpost,
    eyebrow: "1 · Prepare before HR",
    title: "Decide what matters before plan names compete for attention",
    description: "Create a private, goal-first blueprint, then use the Benefits Command Center to organize the employer's actual package.",
    links: [
      ["Benefits Blueprint", "/tools/healthcare-worker-benefits-blueprint", "benefits_blueprint", "tool"],
      ["Benefits Command Center", "/tools/benefits-command-center", "benefits_command_center", "tool"],
      ["Workplace benefits definitions", "/articles/workplace-benefits-definitions", "workplace_benefits_definitions", "resource"],
    ],
  },
  {
    id: "retirement",
    icon: BadgeDollarSign,
    eyebrow: "2 · Retirement",
    title: "Find the match, set a sustainable contribution, then choose tax treatment",
    description: "Separate the employer formula, paycheck impact, Roth-versus-traditional decision, investments, fees, and beneficiaries.",
    links: [
      ["Hospital 403(b) matching", "/articles/how-hospital-403b-matching-works", "hospital_403b_matching", "resource"],
      ["403(b) paycheck calculator", "/tools/403b-paycheck-calculator", "retirement_paycheck_calculator", "tool"],
      ["Roth vs. traditional 403(b)", "/articles/roth-vs-traditional-403b-healthcare-workers", "roth_traditional_403b", "resource"],
    ],
  },
  {
    id: "health_plan",
    icon: HeartPulse,
    eyebrow: "3 · Health plan",
    title: "Compare the total year, not only the payroll deduction",
    description: "Use premiums, employer money, expected care, networks, prescriptions, and bad-year exposure to compare the real choices.",
    links: [
      ["True Cost Calculator", "/tools/open-enrollment-true-cost-calculator", "open_enrollment_true_cost", "tool"],
      ["HSA vs. FSA", "/articles/hsa-vs-fsa-healthcare-workers", "hsa_fsa", "resource"],
      ["Read the SBC", "/insurance/how-to-read-an-sbc", "summary_benefits_coverage", "resource"],
    ],
  },
  {
    id: "protect",
    icon: ShieldCheck,
    eyebrow: "4 · Protect and finish",
    title: "Check income protection, life coverage, beneficiaries, and the receipt",
    description: "The final enrollment screen should confirm more than medical coverage. Save proof of every submitted election.",
    links: [
      ["Disability insurance guide", "/articles/disability-insurance-healthcare-workers-open-enrollment", "disability_insurance", "resource"],
      ["Employer life insurance", "/articles/employer-life-insurance-open-enrollment", "employer_life_insurance", "resource"],
      ["Beneficiary checklist", "/articles/beneficiaries-open-enrollment-checklist", "beneficiary_checklist", "resource"],
    ],
  },
] as const;

export const BenefitsLearningPath = () => (
  <section aria-labelledby="benefits-learning-path-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Healthcare-worker benefits authority path</p>
      <h2 id="benefits-learning-path-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Move through benefits in decision order</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">Start with priorities, run the controlling numbers, protect the paycheck, and save the final elections. Each step uses an existing canonical tool or guide.</p>
    </div>

    <ol className="mt-8 grid gap-5 lg:grid-cols-2">
      {pathways.map((pathway) => {
        const Icon = pathway.icon;
        return (
          <li key={pathway.id} className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{pathway.eyebrow}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{pathway.title}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pathway.description}</p>
            <div className="mt-5 space-y-2">
              {pathway.links.map(([label, href, destinationId, type]) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => trackGrowthEvent(type === "tool" ? "hub_to_tool_clicked" : "hub_to_resource_clicked", {
                    entry_surface: "hub",
                    problem_category: "workplace_benefits_path",
                    destination_id: destinationId,
                    handoff_id: type,
                  })}
                  className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold transition-smooth hover:border-primary/40 hover:text-primary"
                >
                  {label}<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);

export default BenefitsLearningPath;
