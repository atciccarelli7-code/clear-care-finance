import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, PlayCircle, ShieldCheck } from "lucide-react";
import { BenefitsEarlyAccessForm } from "@/components/premium/BenefitsEarlyAccessForm";
import { OpenEnrollmentPilot } from "@/components/premium/OpenEnrollmentPilot";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { PAID_PRODUCTS } from "@/data/paidProducts";
import { recordBenefitsOfferCta, recordBenefitsOfferView } from "@/lib/firstPartyEvidence";

const product = PAID_PRODUCTS.find((entry) => entry.id === "healthcare-worker-benefits-decision-system");

const freeLayer = [
  "Plain-English benefits education, glossary definitions, and official verification links",
  "Open-enrollment deadlines, warnings, and document-preparation guidance",
  "Public calculators, checklists, comparisons, and the focused workplace-benefits tool",
  "Healthcare-worker compensation, retirement, paycheck, and career-decision resources",
  "Patient, caregiver, medical-bill, Medicare, Medicaid, and discharge resources",
];

const pilotWorkflow = [
  "Identify the enrollment event and deadline",
  "Confirm household coverage and decision priorities",
  "Inventory controlling documents and missing information",
  "Compare medical-plan and prescription exposure",
  "Review HSA, HRA, FSA, and dependent-care choices",
  "Review dental, vision, disability, life, and supplemental benefits",
  "Set retirement contributions and inspect employer value",
  "Generate the verification list and printable Benefits Decision Brief",
];

const premiumBoundary = [
  "Authenticated, entitlement-protected decision workspaces",
  "Resumable progress and protected cloud persistence for confirmed structured values",
  "Browser-local source assistance that discards raw text and stores no document files",
  "Webhook-driven access architecture for a one-time $29 product",
  "Printable Benefits Decision Brief and final employer-portal checklist",
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
    recordBenefitsOfferView();
  }, []);

  const openCommitmentForm = () => {
    recordBenefitsOfferCta();
    document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("benefits-early-access-email")?.focus(), 450);
  };

  const openPilot = () => {
    trackPilotStart();
    document.getElementById("guided-pilot")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const trackPilotStart = () => {
    void import("@/lib/analytics").then(({ trackSiteEvent }) => {
      trackSiteEvent("benefits_pilot_started", { event_category: "premium_system", pilot_version: 1 });
    });
  };

  if (!product) return null;

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="Working end-to-end pilot"
          title="A complete benefits decision system—not another disconnected free calculator."
          description="Try the working open-enrollment journey now. The premium release is being prepared as a $29 account workspace that saves confirmed structured values, preserves verification tasks, and produces a retained election plan without storing benefits documents or raw source text."
        >
          <Button type="button" variant="hero" size="lg" onClick={openPilot}>
            Try the guided pilot <PlayCircle className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={openCommitmentForm}>
            I would consider it at $29 <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/tools/benefits-command-center">Use the free benefits comparison</Link>
          </Button>
        </PageHero>

        <section className="container min-w-0 py-10 md:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: PlayCircle,
                title: "Working product journey",
                body: "The pilot carries a user from the enrollment trigger through a printable election plan. It is a functional product-validation build, not merely a workflow mockup.",
              },
              {
                icon: LockKeyhole,
                title: "Premium foundation built",
                body: "Account authentication, entitlement-protected workspaces, structured cloud persistence, and Stripe checkout architecture exist behind release gates. Live payment and public paid access remain off.",
              },
              {
                icon: ShieldCheck,
                title: "Privacy-minimized by design",
                body: "The first paid release stores confirmed plan values and broad preferences only. Benefits files and raw copied text remain on the user’s device and are discarded after local review.",
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
          <div className="container grid min-w-0 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Always free</div>
              <h2 className="mt-2 font-display text-2xl font-bold">Learn and prepare without paying</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                CAF will not charge merely to explain a deductible, locate an official source, identify a deadline, or provide a transparent single-purpose calculation.
              </p>
              <ul className="mt-6 space-y-3">
                {freeLayer.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-primary/25 bg-primary-soft/20 p-6 shadow-card md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">$29 one time</div>
              <h2 className="mt-2 font-display text-2xl font-bold">Pay for coordination, continuity, and completion</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The paid boundary is not access to basic education. It is an account-based system that preserves progress, coordinates every material election, keeps unresolved questions visible, and produces a retained Benefits Decision Brief. The workspace and entitlement foundation are built; checkout remains disabled during prelaunch certification.
              </p>
              <ul className="mt-6 space-y-3">
                {premiumBoundary.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container min-w-0 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">End-to-end workflow</div>
                <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Eight guided stages from scattered plan information to one election plan</h2>
                <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                  {pilotWorkflow.map((module, index) => (
                    <li key={module} className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                      <span className="mr-2 font-bold text-primary">{index + 1}.</span>{module}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
                <h2 className="font-display text-xl font-bold">Best fit for this system</h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>• You are preparing for annual enrollment, new-hire enrollment, or a qualifying life event.</li>
                  <li>• Your employer offers several plans or benefit categories.</li>
                  <li>• You want to preserve assumptions and unresolved questions instead of rebuilding the analysis every year.</li>
                  <li>• You are willing to confirm structured values rather than send CAF confidential or individualized documents.</li>
                  <li>• A printable verification and election plan would be useful before submitting choices.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <OpenEnrollmentPilot onCommitment={openCommitmentForm} />

      <div className="print:hidden">
        <section className="container min-w-0 py-14 md:py-20">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Important limits</div>
              <h2 className="mt-2 font-display text-2xl font-bold">What $29 would not buy</h2>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {notIncluded.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">{item}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.limitations}</p>
            </div>

            <BenefitsEarlyAccessForm />

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <h2 className="font-display text-xl font-bold">Prefer to stay entirely in the free layer?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Use the focused benefits comparison, open-enrollment guide, benefits blueprint, action plan, and public calculators. Early access is optional and does not change those resources.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="soft"><Link to="/tools/benefits-command-center">Free benefits comparison</Link></Button>
                <Button asChild variant="outline"><Link to="/open-enrollment">Free open-enrollment guide</Link></Button>
                <Button asChild variant="outline"><Link to="/healthcare-workers">Healthcare-worker hub</Link></Button>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 text-sm leading-relaxed text-muted-foreground">
              <FileCheck2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              The system intentionally stops before the employer portal. Users must review the official confirmation screen, submit through the employer or benefits administrator, and retain proof of the elections.
            </div>

            <DisclaimerBox />
          </div>
        </section>
      </div>
    </>
  );
};

export default BenefitsDecisionOfferPage;
