import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PAID_PRODUCTS } from "@/data/paidProducts";
import { useSeo } from "@/lib/seo";

const product = PAID_PRODUCTS.find((item) => item.id === "healthcare-worker-benefits-decision-system");

const paidValue = [
  {
    icon: ClipboardCheck,
    title: "One connected workspace",
    description: "Coordinate medical, prescription, HSA or HRA, FSA, retirement, disability, life, supplemental-benefit, dependent, and paycheck decisions instead of reviewing them in isolation.",
  },
  {
    icon: FileSearch,
    title: "Source-status controls",
    description: "Mark important facts as verified, estimated, missing, conflicting, or requiring confirmation from HR, the plan, or the controlling document.",
  },
  {
    icon: Scale,
    title: "Scenario and tradeoff review",
    description: "Compare expected use, higher-use exposure, employer contributions, network constraints, and benefit tradeoffs without pretending one plan is universally best.",
  },
  {
    icon: BookOpenCheck,
    title: "A decision brief you can use",
    description: "Finish with a printable record of the decision, assumptions, elections, unresolved questions, deadlines, and official verification steps.",
  },
] as const;

const previewSteps = [
  "Identify the enrollment decision and the deadline.",
  "Enter the employer-defined eligibility and coverage details that apply to you.",
  "Compare medical and prescription costs with employer account funding.",
  "Review retirement, disability, life, supplemental benefits, dependents, and beneficiaries.",
  "Separate verified facts from estimates and unresolved questions.",
  "Generate a verification-ready election and decision brief.",
] as const;

const BenefitsDecisionSystemPreviewPage = () => {
  useSeo({
    title: "Healthcare Worker Benefits Decision System Preview",
    description: "Preview the planned Open Enrollment Workspace for healthcare workers. Free education and calculators remain public; the paid system coordinates the complete benefits decision.",
    canonicalPath: "/products/healthcare-worker-benefits-decision-system",
    robots: "noindex, nofollow, noarchive",
  });

  return (
    <>
      <PageHero
        eyebrow="Healthcare Worker Benefits Decision System"
        title="Turn open enrollment into one documented decision."
        description="CAF's free guides and calculators help with individual questions. The planned Open Enrollment Workspace coordinates the full decision—costs, benefits, missing information, deadlines, and the final verification list—in one place."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/open-enrollment">
            Use the free open-enrollment guide <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools">Browse free benefits tools</Link>
        </Button>
      </PageHero>

      <section className="container max-w-5xl min-w-0 py-10 md:py-14" aria-labelledby="preview-status-heading">
        <div className="grid gap-6 rounded-3xl border border-primary/25 bg-primary-soft/25 p-6 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Product preview
            </div>
            <h2 id="preview-status-heading" className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              One paid flagship. No checkout yet.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              This is the single paid system CAF is preparing first. The planned early-access test is <strong className="text-foreground">$29 one time</strong>, but the product is not available for purchase and no payment information is collected on this page.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background px-5 py-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <LockKeyhole className="h-4 w-4 text-primary" aria-hidden="true" /> Checkout off
            </div>
            <p className="mt-1 max-w-[18rem] leading-relaxed text-muted-foreground">Demand validation and production-access gates come before any sale.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="paid-value-heading">
        <div className="container max-w-6xl min-w-0">
          <SectionHeading
            centered
            eyebrow="What the paid layer adds"
            title="Coordination and completion—not hidden basic information."
            description="The paid workspace is valuable because it connects several benefit decisions, preserves the work, exposes uncertainty, and produces a usable final record."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {paidValue.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-border bg-background p-6 shadow-card">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-6xl min-w-0 py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Planned workflow</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">What the Open Enrollment Workspace will help you finish.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              The first version uses structured manual entry rather than document upload. That keeps the scope understandable, reduces privacy risk, and makes every important assumption visible.
            </p>
            <ol className="mt-6 space-y-3">
              {previewSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-xl border border-border bg-card/55 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-sm leading-relaxed text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Representative output</div>
            <h2 className="mt-2 font-display text-2xl font-bold">A Benefits Decision Brief</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The final brief will summarize the user's own entries and clearly separate conclusions from items that still require official confirmation.
            </p>
            <div className="mt-6 space-y-4">
              {[
                ["Decision", "Selected medical plan and coverage tier, with the reason it currently fits the entered assumptions."],
                ["Estimated annual exposure", "Payroll premiums, expected medical and prescription spending, and employer account funding."],
                ["Other elections", "HSA/FSA approach, retirement contribution needed for the match, disability and supplemental-benefit review."],
                ["Still verify", "Providers, prescriptions, spouse rules, eligibility, deadlines, evidence requirements, and conflicting plan language."],
                ["Next actions", "A short sequence for HR, carrier, pharmacy, beneficiary, and enrollment-system follow-up."],
              ].map(([label, description]) => (
                <div key={label} className="border-l-2 border-primary/25 pl-4">
                  <h3 className="text-sm font-bold text-foreground">{label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background/55 py-14" aria-labelledby="free-layer-heading">
        <div className="container max-w-6xl min-w-0">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> The free layer stays useful
              </div>
              <h2 id="free-layer-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Start without paying.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                Definitions, deadlines, official verification links, basic calculators, and single-purpose decision helpers remain public. Purchase will never be required to access controlling information or a basic result.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(product?.publicFoundation ?? []).map((resource) => (
                <Link key={resource.href} to={resource.href} className="group rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/35 hover:shadow-card">
                  <h3 className="font-display text-lg font-bold">{resource.label}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open free resource <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl min-w-0 py-14 md:py-20">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-trust-soft text-trust">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Trust, privacy, and verification boundaries</h2>
              <div className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
                <p><strong className="text-foreground">No document upload in version one.</strong> Users enter only the structured facts needed for the decision.</p>
                <p><strong className="text-foreground">No medical records or account credentials.</strong> CAF does not need member IDs, claim numbers, diagnoses, or employer-login details.</p>
                <p><strong className="text-foreground">Official sources still control.</strong> The employer enrollment system, plan documents, carrier, HR, and applicable agencies determine final eligibility and coverage.</p>
                <p><strong className="text-foreground">No purchase today.</strong> Checkout, entitlements, and paid access remain disabled until later validation and release gates pass.</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                <Link to="/privacy-policy" className="text-primary underline-offset-4 hover:underline">Privacy policy</Link>
                <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Sources and methodology</Link>
                <Link to="/disclosures" className="text-primary underline-offset-4 hover:underline">Limitations and disclosures</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <DisclaimerBox />
        </div>
      </section>
    </>
  );
};

export default BenefitsDecisionSystemPreviewPage;
