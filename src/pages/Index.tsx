import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  ExternalLink,
  HeartPulse,
  LockKeyhole,
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

const FLAGSHIP_PREVIEW_PATH = "/healthcare-workers#benefits-decision-system";

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
      eyebrow="Free education + one decision system"
      title="Learn the decision for free. Use one system when you need help finishing it."
      description="Community Acquired Finance provides public guides, calculators, and checklists for healthcare workers, patients, and caregivers. The first paid flagship will coordinate the complete healthcare-worker benefits decision in one workspace."
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
          to={FLAGSHIP_PREVIEW_PATH}
          onClick={() => {
            trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "benefits_decision_system" });
            trackHomepageNavigation("hero_action", "benefits_decision_system", FLAGSHIP_PREVIEW_PATH);
          }}
        >
          Preview the Benefits Decision System
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

    <section className="border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="free-paid-heading">
      <div className="container max-w-6xl min-w-0">
        <SectionHeading
          centered
          eyebrow="One platform, two layers"
          title="Free decision preparation. Paid decision completion."
          description="The business model is designed to preserve useful public education while charging only when CAF coordinates a larger, reusable workflow."
        />
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Learn and prepare for free</div>
            <h2 id="free-paid-heading" className="mt-2 font-display text-2xl font-bold">Understand one question and take the next bounded step.</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>• Plain-English articles, glossary entries, and official verification links</li>
              <li>• Calculators, checklists, comparisons, and guided decision helpers</li>
              <li>• Enrollment, billing, coverage, and patient-safety deadlines</li>
              <li>• Meaningful results without an account or purchase</li>
            </ul>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/tools">Browse all free tools</Link>
            </Button>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-primary-soft/20 p-6 shadow-card md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold text-primary">Checkout off</span>
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Coordinate and finish the decision</div>
            <h2 className="mt-2 font-display text-2xl font-bold">The Healthcare Worker Benefits Decision System</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The first paid workflow will connect employer-specific plan rules, medical and prescription costs, HSA/HRA/FSA choices, retirement, protection benefits, deadlines, missing information, saved progress, and a printable decision brief.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Planned early-access test: <strong className="text-foreground">$29 one time</strong>. The system is visible for preview, but it is not available for purchase yet.
            </p>
            <Button asChild className="mt-6">
              <Link to={FLAGSHIP_PREVIEW_PATH}>See the flagship preview <ArrowRight className="h-4 w-4" /></Link>
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
        description="CAF separates routing, the guided answer, paid coordination, and official verification so each screen has one clear job."
      />
      <ol className="mt-9 grid gap-8 md:grid-cols-3">
        {[
          [Compass, "1", "Start with your goal", "Choose from fixed, plain-English options. No account or private case narrative is required to use the free layer."],
          [CheckCircle2, "2", "Finish the right level of help", "Use a free result for a bounded question or preview the paid system when several connected benefit decisions must be coordinated."],
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
