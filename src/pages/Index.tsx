import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  HeartPulse,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DecisionConcierge } from "@/components/growth/DecisionConcierge";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackHomepageNavigation } from "@/lib/analytics";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const flagshipJourneys = [
  {
    id: "workplace_benefits",
    icon: BriefcaseBusiness,
    eyebrow: "Workplace benefits and job value",
    title: "See the complete package behind the paycheck",
    description: "Use the Benefits Command Center to separate guaranteed cash, variable pay, employer contributions, employee costs, health-plan exposure, vesting, estimates, and qualitative benefits.",
    href: "/tools/benefits-command-center?mode=build#benefits-command-center-workspace",
    cta: "Build my benefits package",
    supporting: [
      ["Preview a sample Receipt", "/tools/benefits-command-center?mode=sample-receipt#benefits-command-center-workspace"],
      ["Compare two sample jobs", "/tools/benefits-command-center?mode=compare-samples#benefits-command-center-workspace"],
    ],
  },
  {
    id: "healthcare_costs",
    icon: ReceiptText,
    eyebrow: "Healthcare costs and medical bills",
    title: "Prepare before care and review what arrives after",
    description: "Organize cost and coverage questions before an appointment, understand prior authorization, then review bills and payer documents without sending case details to CAF.",
    href: "/tools/medical-appointment-cost-preparation",
    cta: "Prepare for healthcare costs",
    supporting: [
      ["Prior authorization next steps", "/tools/prior-authorization-next-step-guide"],
      ["Medical Bill Review Toolkit", "/insurance/medical-bill-review-toolkit"],
    ],
  },
  {
    id: "medicare_discharge",
    icon: HeartPulse,
    eyebrow: "Medicare, Medicaid, and discharge",
    title: "Find the right starting point and verify it officially",
    description: "Screen possible coverage pathways, learn the Medicare and Medicaid structure, prepare for discharge questions, and continue to the government or program source that controls.",
    href: "/tools/medicare-medicaid-eligibility-check",
    cta: "Check possible coverage paths",
    supporting: [
      ["Medicare and Medicaid hub", "/medicare-care-costs"],
      ["Hospital discharge checklist", "/tools/hospital-discharge-medicare-checklist"],
    ],
  },
] as const;

const depthLinks = [
  ["Retirement and investing", "/build-wealth", "Workplace accounts, investing, debt, and financial independence."],
  ["Student loan decisions", "/student-loans", "Repayment priorities and links to controlling federal resources."],
  ["Financial topics and articles", "/topics", "Browse the full education library without crowding the homepage."],
] as const;

const Index = () => (
  <>
    <PageHero
      eyebrow="Plain-English financial decision support"
      title="Make the next money or healthcare decision clearer."
      description="Start with a short routing question before a confusing bill, discharge, benefits deadline, or retirement gap becomes urgent. General retirement, investing, debt, insurance, and student-loan education remains available in the full library."
    >
      <Button asChild variant="hero" size="lg">
        <a
          href="#decision-concierge"
          onClick={() => {
            trackGrowthEvent("home_primary_cta_clicked", { entry_surface: "home", action_id: "decision_concierge" });
            trackHomepageNavigation("hero_action", "decision_concierge");
          }}
        >
          Help me choose where to start <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link
          to="/tools"
          onClick={() => {
            trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "tools_library" });
            trackHomepageNavigation("hero_action", "tools_library", "/tools");
          }}
        >
          Browse all tools
        </Link>
      </Button>
    </PageHero>

    <section id="decision-concierge" className="container min-w-0 scroll-mt-24 py-10 md:py-12">
      <DecisionConcierge entrySurface="home" compact />
    </section>

    <section className="border-y border-border bg-card/25 py-14 md:py-20" aria-labelledby="flagship-journeys-heading">
      <div className="container min-w-0">
        <SectionHeading
          centered
          eyebrow="Three primary journeys"
          title="Choose the decision—not a catalog."
          description="Each journey has one clear first step and a short sequence of supporting tools."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {flagshipJourneys.map(({ id, icon: Icon, eyebrow, title, description, href, cta, supporting }) => (
            <article key={id} className="flex min-w-0 flex-col rounded-3xl border border-border bg-card p-6 shadow-card">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-secondary">{eyebrow}</div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <Button asChild className="mt-6 w-full">
                <Link
                  to={href}
                  onClick={() => trackGrowthEvent("flagship_journey_opened", { entry_surface: "home", destination_id: id })}
                >
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {supporting.map(([label, path]) => (
                  <Link key={path} to={path} className="flex min-h-10 items-center justify-between gap-3 rounded-lg px-2 text-sm font-semibold text-muted-foreground hover:bg-muted/40 hover:text-primary">
                    {label}<ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-20" aria-labelledby="trust-heading">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Trust boundary</div>
          <h2 id="trust-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Useful without asking for your private story.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">CAF is shaped by bedside, charge, and admissions-discharge-transfer nursing experience, then checked against authoritative sources. Official documents, agencies, providers, plans, employers, and qualified professionals still control material decisions.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/methodology" className="text-primary hover:underline">Review sources</Link>
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy policy</Link>
            <Link to="/disclosures" className="text-primary hover:underline">Disclosures</Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            [ShieldCheck, "RN-led", "Care-transition context without clinical advice."],
            [BookOpenCheck, "Source-backed", "Official references and visible limitations."],
            [LockKeyhole, "Privacy-minimized", "No account or sensitive case narrative required."],
            [CheckCircle2, "Educational only", "Preparation and math—not an official determination."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-bold">{title as string}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-background/55 py-14 md:py-20" aria-labelledby="depth-heading">
      <div className="container min-w-0">
        <SectionHeading eyebrow="More financial education" title="The depth is still here when you need it." description="Use the full libraries for general financial questions and focused single-purpose tasks." />
        <div className="grid gap-4 md:grid-cols-3">
          {depthLinks.map(([title, href, description]) => (
            <Link key={href} to={href} className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/35 hover:shadow-card">
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open resource <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link to="/topics">Browse topics</Link></Button>
          <Button asChild variant="outline"><Link to="/articles">Browse articles</Link></Button>
          <Button asChild variant="outline"><Link to="/guides">Browse quick guides</Link></Button>
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-20">
      <NewsletterSignup
        source="home"
        title="Get one clear financial email each month"
        description="A calm monthly note on workplace benefits, healthcare costs, retirement, insurance, Medicare, Medicaid, and useful new tools."
        buttonLabel="Join the monthly list"
      />
    </section>
  </>
);

export default Index;
