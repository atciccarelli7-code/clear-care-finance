import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, FileCheck2, Layers3, PlayCircle, ReceiptText, Scale } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";

const NationalEmployerDirectory = lazy(() => import("@/components/benefits/NationalEmployerDirectory"));
const EmployerBenefitsNavigator = lazy(() => import("@/components/benefits/EmployerBenefitsNavigator"));
const BenefitsCommandCenterActivation = lazy(() => import("@/components/benefits/BenefitsCommandCenterActivation"));

const entryModes = [
  {
    icon: BriefcaseBusiness,
    title: "Build my own package",
    body: "Open a fresh local workspace and enter broad compensation and benefits estimates.",
    href: "/tools/benefits-command-center?mode=build#benefits-command-center-workspace",
    state: "start_own",
  },
  {
    icon: ReceiptText,
    title: "Explore a sample Benefits Receipt",
    body: "Inspect a fictional completed package before entering your own information.",
    href: "/tools/benefits-command-center?mode=sample-receipt#benefits-command-center-workspace",
    state: "sample_receipt",
  },
  {
    icon: Scale,
    title: "Compare two sample jobs",
    body: "Review a fictional bedside and clinical-role comparison using the same calculation engine.",
    href: "/tools/benefits-command-center?mode=compare-samples#benefits-command-center-workspace",
    state: "sample_comparison",
  },
  {
    icon: PlayCircle,
    title: "Take the guided tour",
    body: "See how the free comparison works before entering any values.",
    href: "/tools/benefits-command-center?mode=tour#benefits-command-center-workspace",
    state: "tour",
  },
] as const;

const sources = [
  {
    name: "U.S. Bureau of Labor Statistics",
    title: "Employer Costs for Employee Compensation",
    url: "https://www.bls.gov/news.release/ecec.toc.htm",
  },
  {
    name: "HealthCare.gov",
    title: "Your Total Costs for Health Care",
    url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/",
  },
  {
    name: "Internal Revenue Service",
    title: "Retirement Topics — Contributions",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
  },
  {
    name: "U.S. Department of Labor",
    title: "What You Should Know About Your Retirement Plan",
    url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan",
  },
] as const;

const BenefitsCommandCenterPage = () => (
  <>
    <div className="print:hidden">
      <PageHero
        eyebrow="Free workplace-benefits comparison"
        title="Start with your employer. Finish with a clearer benefits decision."
        description="Search the national healthcare-system directory, preserve the plan year and employee group, inspect whether current official documents are available, and build a Benefits Receipt that separates compensation, health-plan exposure, employer retirement money, paid leave, hidden benefits, vesting, employee costs, and quality-of-life tradeoffs."
      >
        <Button asChild size="lg">
          <a href="#national-employer-directory-title">
            Find my employer <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link
            to="/tools/benefits-command-center?mode=build#benefits-command-center-workspace"
            state={{ activation: "start_own", entrySurface: "command_center" }}
          >
            Enter everything manually
          </Link>
        </Button>
      </PageHero>

      <Suspense fallback={<div className="container flex min-h-[420px] items-center justify-center py-10 text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading the national employer directory…</div>}>
        <NationalEmployerDirectory />
      </Suspense>

      <Suspense fallback={<div className="container flex min-h-[520px] items-center justify-center py-10 text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading the reviewed employer source registry…</div>}>
        <EmployerBenefitsNavigator />
      </Suspense>

      <section className="container min-w-0 pt-4" aria-labelledby="full-system-preview-heading">
        <div className="grid gap-5 rounded-3xl border border-primary/20 bg-primary-soft/20 p-6 shadow-card md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
            <Layers3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">National directory versus reviewed package</div>
            <h2 id="full-system-preview-heading" className="mt-2 font-display text-2xl font-bold tracking-tight">
              Need to coordinate the full open-enrollment decision?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This focused comparison remains free. Every AHRQ-listed healthcare system can now begin a manual workspace. Reviewed employer-specific prefills remain deliberately narrower: they require current documents, the correct employee population, structured extraction, and fact-level review. The planned paid system will add prescription and network checks, saved accounts, deadlines, verification workflow, and a final election brief. Checkout remains off.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/healthcare-workers#benefits-decision-system">Preview the full system</Link>
          </Button>
        </div>
      </section>

      <section id="entry-modes" className="container min-w-0 scroll-mt-24 py-10 md:py-14" aria-labelledby="entry-modes-title">
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Choose another way to begin</div>
          <h2 id="entry-modes-title" className="mt-2 font-display text-2xl font-bold md:text-3xl">Four direct entry modes remain available.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Mode names are fixed and URL-safe. Package values and answers never enter the URL.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {entryModes.map(({ icon: Icon, title, body, href, state }) => (
            <Link
              key={title}
              to={href}
              state={{ activation: state, entrySurface: "command_center" }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/35 hover:shadow-hover"
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open mode <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-muted/20 p-5 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
          <p><strong className="text-foreground">Have nearby:</strong> a written offer or compensation statement, benefits rates, an SBC, retirement match and vesting terms, and leave policies.</p>
          <p><strong className="text-foreground">Keep it private:</strong> employer and plan names may be used for source matching, but do not enter member IDs, claims, medical information, account credentials, or other sensitive identifiers.</p>
          <p><strong className="text-foreground">Calculated:</strong> entered cash, employee costs, selected health-plan scenarios, retirement contributions, and reasonable known values.</p>
          <p><strong className="text-foreground">Kept qualitative:</strong> schedule, flexibility, career trajectory, protection, family support, uncertainty, and anything not verified.</p>
        </div>
      </section>
    </div>

    <section id="benefits-command-center-workspace" className="container min-w-0 scroll-mt-28 pb-12 print:pb-0 md:pb-16">
      <Suspense fallback={<div className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-border bg-card text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading the free benefits comparison…</div>}>
        <BenefitsCommandCenterActivation />
      </Suspense>
    </section>

    <div className="print:hidden">
      <section className="border-y border-border bg-card/35 py-14 md:py-20">
        <div className="container grid min-w-0 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How the free workspace thinks</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">A structured comparison—not one inflated total.</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p><strong className="text-foreground">Cash compensation</strong> separates base pay, realistic overtime, differentials, bonuses, and other entered cash.</p>
              <p><strong className="text-foreground">Health-plan scenarios</strong> combine payroll premiums, selected cost sharing, out-of-pocket limits, and employer HSA or HRA funding.</p>
              <p><strong className="text-foreground">Retirement value</strong> distinguishes employee contributions, estimated employer matching, non-elective contributions, uncaptured matching, and unvested value.</p>
              <p><strong className="text-foreground">Comparison mode</strong> reports differences and uncertainty instead of declaring a universal winner.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 shadow-card">
            <FileCheck2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">What it cannot determine</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>• Official eligibility, coverage, tax, vesting, or overtime status</li>
              <li>• Whether a plan covers a specific clinician, prescription, or service</li>
              <li>• Whether one job is personally or professionally best</li>
              <li>• Exact take-home pay or future employer policy changes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-14 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Authoritative references</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Verify material decisions at the source.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{source.name}</div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">{source.title}</h3>
                </a>
              ))}
            </div>
          </div>

          <DisclaimerBox />
        </div>
      </section>
    </div>
  </>
);

export default BenefitsCommandCenterPage;
