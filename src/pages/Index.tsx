import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  ExternalLink,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackHomepageNavigation } from "@/lib/analytics";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const BENEFITS_SYSTEM_PATH = "/products/healthcare-worker-benefits-decision-system";
const FINANCIAL_ASSISTANCE_PATH = "/medical-bills/financial-assistance";

const decisionPaths = [
  {
    icon: Wallet,
    title: "Healthcare-worker pay and benefits",
    href: "/healthcare-workers",
    description: "Open enrollment, retirement plans, compensation, job offers, paycheck decisions, and the financial tradeoffs of healthcare work.",
  },
  {
    icon: HeartPulse,
    title: "Patient and caregiver decisions",
    href: "/patients-families",
    description: "Prepare for discharge, medicines, equipment, follow-up, medical bills, coverage barriers, and caregiving handoffs.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance and healthcare costs",
    href: "/insurance",
    description: "Understand plan documents, networks, prior authorization, cost sharing, prescriptions, EOBs, and medical bills.",
  },
  {
    icon: BookOpenCheck,
    title: "Medicare and Medicaid",
    href: "/medicare-care-costs",
    description: "Prepare for enrollment, costs, coverage verification, hospital-to-home questions, and official next steps.",
  },
] as const;

const Index = () => (
  <>
    <PageHero
      eyebrow="RN-led healthcare financial decision support"
      title="Make the next money or healthcare decision clearer."
      description="Use free, source-backed guides, calculators, checklists, and guided workflows built for healthcare workers, patients, and caregivers. Start with the decision in front of you and leave with a practical next step."
    >
      <Button asChild variant="hero" size="lg">
        <Link
          to="/start-here"
          onClick={() => {
            trackGrowthEvent("home_primary_cta_clicked", { entry_surface: "home", action_id: "start_here" });
            trackHomepageNavigation("hero_action", "start_here", "/start-here");
          }}
        >
          Help me find where to start <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link
          to={BENEFITS_SYSTEM_PATH}
          onClick={() => {
            trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "benefits_decision_system" });
            trackHomepageNavigation("hero_action", "benefits_decision_system", BENEFITS_SYSTEM_PATH);
          }}
        >
          Open the Benefits Decision System
        </Link>
      </Button>
    </PageHero>

    <section className="container min-w-0 py-14 md:py-20" aria-labelledby="decisions-heading">
      <SectionHeading
        centered
        eyebrow="Decisions CAF helps with"
        title="Start with the real decision—not a category name."
        description="Choose the situation in front of you. Each path leads to a focused explanation, calculator, checklist, or guided workflow."
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {decisionPaths.map(({ icon: Icon, title, href, description }) => (
          <Link
            key={href}
            to={href}
            onClick={() => trackHomepageNavigation("decision_path", title, href)}
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
              Open this path <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="guided-workflows-heading">
      <div className="container max-w-6xl min-w-0">
        <SectionHeading
          centered
          eyebrow="Guided workflows available now"
          title="Go beyond reading when the decision needs a process."
          description="These workflows organize the inputs, unknowns, calculations, verification steps, and next actions without pretending CAF replaces the official source."
        />
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-primary/25 bg-primary-soft/20 p-6 shadow-card md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold text-primary">Free · available now</span>
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">For healthcare workers</div>
            <h2 id="guided-workflows-heading" className="mt-2 font-display text-2xl font-bold">Healthcare Worker Benefits Decision System</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Work through an enrollment event in eight guided stages: household needs, controlling documents, medical-plan exposure, tax-advantaged accounts, other benefits, retirement, unresolved questions, and a printable Benefits Decision Brief.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Progress stays in your browser. No account, payment, confidential document upload, or cloud storage is required for this public workflow.
            </p>
            <Button asChild className="mt-6">
              <Link to={BENEFITS_SYSTEM_PATH}>Start the Benefits Decision System <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </article>

          <article className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">Free · available now</span>
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">For medical bills</div>
            <h2 className="mt-2 font-display text-2xl font-bold">Hospital Financial Assistance & Medical Bill Relief Finder</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Screen common financial-assistance pathways, identify the documents and questions to gather, and build an action plan before paying or giving up on a hospital bill.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Results are educational and source-backed, not an eligibility determination. Hospital policies and current program rules still control.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to={FINANCIAL_ASSISTANCE_PATH}>Check financial-assistance options <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </article>
        </div>
      </div>
    </section>

    <section className="container max-w-5xl min-w-0 py-14 md:py-20" aria-labelledby="how-caf-works-heading">
      <SectionHeading
        centered
        eyebrow="From question to action"
        title="Know what each experience will do before you begin."
        description="CAF separates routing, guided decision support, and official verification so each screen has one clear job."
      />
      <ol className="mt-9 grid gap-8 md:grid-cols-3">
        {[
          [Compass, "1", "Start with your goal", "Choose from fixed, plain-English options. No account or private case narrative is required to use the public site."],
          [CheckCircle2, "2", "Use the right level of help", "Read a focused guide, run a calculator, or complete a guided workflow when several connected decisions need to be organized."],
          [ExternalLink, "3", "Verify and act", "See the practical next action and the official document, plan, agency, employer, provider, or professional that controls the final decision."],
        ].map(([Icon, number, title, description]) => (
          <li key={number as string} className="relative border-l-2 border-primary/20 pl-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                {number as string}
              </span>
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">{title as string}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description as string}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="border-y border-border bg-background/55 py-10" aria-labelledby="human-trust-heading">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trust-soft text-trust">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="human-trust-heading" className="font-display text-xl font-bold">Built from nursing experience, checked against controlling sources.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Andrew Ciccarelli, RN, BSN built CAF after repeatedly seeing patients, caregivers, and healthcare workers expected to make consequential financial and care-transition decisions without a usable explanation. CAF prepares questions and actions; official documents, agencies, plans, providers, employers, and qualified professionals still control.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4 text-sm font-semibold">
            <Link to="/about" className="text-primary underline-offset-4 hover:underline">About Andrew</Link>
            <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Sources</Link>
            <Link to="/privacy-policy" className="text-primary underline-offset-4 hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-20">
      <NewsletterSignup
        source="home"
        title="Get one clear healthcare-finance email each month"
        description="A calm monthly note on workplace benefits, healthcare costs, retirement, insurance, Medicare, Medicaid, and useful new tools."
        buttonLabel="Join the monthly list"
      />
    </section>
  </>
);

export default Index;