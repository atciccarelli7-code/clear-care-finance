import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, PlayCircle, ShieldCheck } from "lucide-react";
import { OpenEnrollmentPilot } from "@/components/premium/OpenEnrollmentPilot";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  "Identify the enrollment event and deadline",
  "Confirm household coverage and decision priorities",
  "Inventory controlling documents and missing information",
  "Compare medical-plan and prescription exposure",
  "Review HSA, HRA, FSA, and dependent-care choices",
  "Review dental, vision, disability, life, and supplemental benefits",
  "Set retirement contributions and inspect employer value",
  "Generate the verification list and printable Benefits Decision Brief",
];

const notIncluded = [
  "No employer enrollment submission or official eligibility determination",
  "No individualized insurance, legal, tax, medical, or investment advice",
  "No prediction of claims, taxes, savings, approval, or coverage",
  "No server document uploads, medical-record storage, member IDs, claim files, credentials, or payment-card collection",
  "No live support, negotiation, plan administration, or employer endorsement",
];

const BenefitsDecisionOfferPage = () => {
  useEffect(() => {
    const makeScrollableRegionsKeyboardAccessible = () => {
      document.querySelectorAll<HTMLElement>("#guided-pilot .overflow-x-auto").forEach((region) => {
        region.tabIndex = 0;
        region.setAttribute("role", "region");
        region.setAttribute("aria-label", "Scrollable benefits source-readiness table");
      });
    };

    makeScrollableRegionsKeyboardAccessible();
    const workflow = document.getElementById("guided-pilot");
    if (!workflow) return undefined;

    const observer = new MutationObserver(makeScrollableRegionsKeyboardAccessible);
    observer.observe(workflow, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const openSystem = () => {
    document.getElementById("guided-pilot")?.scrollIntoView({ behavior: "smooth", block: "start" });
    void import("@/lib/analytics").then(({ trackSiteEvent }) => {
      trackSiteEvent("benefits_pilot_started", { event_category: "premium_system", pilot_version: 1 });
    });
  };

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="Healthcare Worker Benefits Decision System"
          title="Work through open enrollment one decision at a time."
          description="Use eight guided stages to organize the deadline, household needs, plan costs, accounts, other benefits, retirement choices, unresolved questions, and a printable Benefits Decision Brief. Progress stays in this browser."
        >
          <Button type="button" variant="hero" size="lg" onClick={openSystem}>
            Start the guided system <PlayCircle className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/tools/benefits-command-center">Use the focused benefits comparison <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </Button>
        </PageHero>

        <section className="container min-w-0 py-10 md:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: PlayCircle,
                title: "Complete guided workflow",
                body: "Move from the enrollment trigger through the final verification checklist and printable election plan without rebuilding the decision in a spreadsheet.",
              },
              {
                icon: FileCheck2,
                title: "Unknowns stay visible",
                body: "Missing plan facts, unresolved network questions, and source gaps become explicit verification tasks instead of disappearing inside an estimate.",
              },
              {
                icon: ShieldCheck,
                title: "Privacy-minimized by design",
                body: "The public workflow stays in your browser. Do not enter confidential documents, member IDs, claims, diagnoses, account credentials, or payment information.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="mt-3 font-display text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/35 py-14 md:py-20">
          <div className="container grid min-w-0 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Eight-stage workflow</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">From scattered plan information to one reviewable election plan</h2>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {workflowSteps.map((step, index) => (
                  <li key={step} className="rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                    <span className="mr-2 font-bold text-primary">{index + 1}.</span>{step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
              <h2 className="font-display text-xl font-bold">Have these nearby before you begin</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>• The current benefits guide and enrollment deadline</li>
                <li>• Medical-plan premiums, deductible, out-of-pocket maximum, network, and prescription information</li>
                <li>• HSA, HRA, FSA, dependent-care, and employer contribution details</li>
                <li>• Retirement match, contribution, and vesting terms</li>
                <li>• Dental, vision, disability, life, and supplemental-benefit information</li>
              </ul>
              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary-soft/20 p-4 text-xs leading-relaxed text-muted-foreground">
                Official employer, carrier, and plan documents control. Use broad plan labels only; keep sensitive identifiers and confidential documents out of the workflow.
              </div>
            </div>
          </div>
        </section>
      </div>

      <OpenEnrollmentPilot />

      <div className="print:hidden">
        <section className="container min-w-0 py-14 md:py-20">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Important limits</div>
              <h2 className="mt-2 font-display text-2xl font-bold">What this system does not do</h2>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {notIncluded.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-xl font-bold">Need a smaller benefits tool instead?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Use the focused benefits comparison, open-enrollment guide, benefits blueprint, action plan, and public calculators when you only need one bounded answer.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="soft"><Link to="/tools/benefits-command-center">Benefits comparison</Link></Button>
                <Button asChild variant="outline"><Link to="/open-enrollment">Open-enrollment guide</Link></Button>
                <Button asChild variant="outline"><Link to="/healthcare-workers">Healthcare-worker hub</Link></Button>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 text-sm leading-relaxed text-muted-foreground">
              <FileCheck2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              The system intentionally stops before the employer portal. Review the official confirmation screen, submit through the employer or benefits administrator, and retain proof of the elections.
            </div>

            <DisclaimerBox />
          </div>
        </section>
      </div>
    </>
  );
};

export default BenefitsDecisionOfferPage;
