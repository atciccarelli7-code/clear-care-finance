import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, FileCheck2, PlayCircle, ReceiptText, Scale, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";

const BenefitsCommandCenterActivation = lazy(() => import("@/components/benefits/BenefitsCommandCenterActivation"));

const sources = [
  {
    name: "U.S. Bureau of Labor Statistics",
    title: "Employer Costs for Employee Compensation",
    url: "https://www.bls.gov/news.release/ecec.toc.htm",
    note: "Official context for treating wages and employer-paid benefits as separate components of compensation.",
  },
  {
    name: "HealthCare.gov",
    title: "Your Total Costs for Health Care",
    url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/",
    note: "Official explanation that premiums and costs when care is received both matter when comparing health coverage.",
  },
  {
    name: "Internal Revenue Service",
    title: "Retirement Topics — Contributions",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
    note: "Official background on employee and employer contributions to workplace retirement plans.",
  },
  {
    name: "U.S. Department of Labor",
    title: "What You Should Know About Your Retirement Plan",
    url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan",
    note: "Official guidance on plan documents, vesting, benefit statements, and participant rights.",
  },
];

const BenefitsCommandCenterPage = () => (
  <>
    <div className="print:hidden">
      <PageHero
        eyebrow="CAF Benefits Command Center"
        title="Understand what your job is actually worth—not just what it pays."
        description="Build or preview a complete Benefits Receipt that separates compensation, health-plan exposure, employer retirement money, paid leave, hidden benefits, vesting, employee costs, and quality-of-life tradeoffs."
      >
        <Button asChild size="lg">
          <Link
            to="/tools/benefits-command-center?mode=build#benefits-command-center-workspace"
            state={{ activation: "start_own", entrySurface: "command_center" }}
          >
            Build my package <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#entry-modes">See all starting modes</a>
        </Button>
      </PageHero>

      <section id="entry-modes" className="container min-w-0 scroll-mt-24 py-10 md:py-14" aria-labelledby="entry-modes-title">
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Choose how to begin</div>
          <h2 id="entry-modes-title" className="mt-2 font-display text-2xl font-bold md:text-3xl">Four distinct starting points—no blank detour.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Mode names are fixed and URL-safe. Package values and answers never enter the URL.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: BriefcaseBusiness,
              title: "Build my own package",
              body: "Open a fresh local workspace in creation mode.",
              href: "/tools/benefits-command-center?mode=build#benefits-command-center-workspace",
              state: "start_own",
            },
            {
              icon: ReceiptText,
              title: "Explore a sample Benefits Receipt",
              body: "Open the fictional package and its completed Receipt.",
              href: "/tools/benefits-command-center?mode=sample-receipt#benefits-command-center-workspace",
              state: "sample_receipt",
            },
            {
              icon: Scale,
              title: "Compare two sample jobs",
              body: "Open the fictional bedside and clinical-role comparison.",
              href: "/tools/benefits-command-center?mode=compare-samples#benefits-command-center-workspace",
              state: "sample_comparison",
            },
            {
              icon: PlayCircle,
              title: "Take the guided tour",
              body: "Start the product tour at step one before entering data.",
              href: "/tools/benefits-command-center?mode=tour#benefits-command-center-workspace",
              state: "tour",
            },
          ].map(({ icon: Icon, title, body, href, state }) => (
            <Link key={title} to={href} state={{ activation: state, entrySurface: "command_center" }} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/35 hover:shadow-hover">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open mode <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-muted/20 p-5 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
          <p><strong className="text-foreground">Have nearby:</strong> a written offer or compensation statement, benefits rates, an SBC, retirement match and vesting terms, and leave policies. Use broad estimates when documents are unavailable.</p>
          <p><strong className="text-foreground">Do not enter:</strong> employer or plan names, account or member IDs, diagnoses, claims, documents, or other identifying details. Dollar estimates stay in this browser and can be cleared from the workspace.</p>
          <p><strong className="text-foreground">Calculated:</strong> entered cash, selected employee costs, health-plan scenarios, retirement contributions, and reasonable known values.</p>
          <p><strong className="text-foreground">Kept qualitative:</strong> schedule, flexibility, career trajectory, protection, family support, uncertainty, and anything not verified.</p>
        </div>
      </section>
    </div>

    <section id="benefits-command-center-workspace" className="container min-w-0 scroll-mt-28 pb-12 print:pb-0 md:pb-16">
      <Suspense fallback={<div className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-border bg-card text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading Benefits Command Center…</div>}>
        <BenefitsCommandCenterActivation />
      </Suspense>
    </section>

    <div className="print:hidden">
      <section className="border-y border-border bg-card/35 py-14 md:py-20">
        <div className="container grid min-w-0 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How the workspace thinks</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">A structured decision model—not one inflated total.</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p><strong className="text-foreground">Cash compensation</strong> separates base pay, realistic overtime, differentials, bonuses, and other entered cash.</p>
              <p><strong className="text-foreground">Health-plan scenarios</strong> combine payroll premiums, selected cost-sharing assumptions, out-of-pocket limits, and employer HSA or HRA funding. Network and prescription verification remain separate.</p>
              <p><strong className="text-foreground">Retirement value</strong> distinguishes employee contributions, estimated employer matching, non-elective contributions, uncaptured matching, and unvested employer value.</p>
              <p><strong className="text-foreground">Paid leave and hidden benefits</strong> receive a dollar estimate only when reasonable. Protection, family, schedule, and career benefits can remain qualitative.</p>
              <p><strong className="text-foreground">Comparison mode</strong> reports differences and uncertainty instead of declaring a universal winner.</p>
              <p><strong className="text-foreground">Activation examples</strong> use fictional healthcare roles and the real calculation engine so visitors can inspect a completed Receipt before entering their own information.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 shadow-card">
            <FileCheck2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">Best documents to have nearby</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>• Written offer or current compensation statement</li>
              <li>• Benefits rate sheet for the correct coverage tier</li>
              <li>• Summary of Benefits and Coverage</li>
              <li>• Retirement match and vesting language</li>
              <li>• PTO, holiday, call, travel, and schedule policies</li>
              <li>• Disability, life, tuition, childcare, and reimbursement summaries</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-14 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">What it can clarify</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>• How much compensation depends on overtime or variable pay</li>
                <li>• How health premiums and worst-case exposure change package economics</li>
                <li>• Whether entered retirement contributions capture the full match</li>
                <li>• Which benefits are available but unused</li>
                <li>• Which questions still require HR or plan-document verification</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <FileCheck2 className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">What it cannot determine</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>• Official eligibility, coverage, tax, vesting, or overtime status</li>
                <li>• Whether a health plan covers a specific clinician, drug, or service</li>
                <li>• Whether one job is personally or professionally best</li>
                <li>• Exact take-home pay or individualized insurance needs</li>
                <li>• Future bonuses, overtime availability, or employer policy changes</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Use the right level of detail</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">The Command Center integrates the decision; focused tools still do one job faster.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                ["Benefits Blueprint", "Set a goal-first action order before collecting plan numbers.", "/tools/healthcare-worker-benefits-blueprint"],
                ["Employer Benefits Action Plan", "Create a short post-offer or annual-review checklist.", "/tools/employer-benefits-action-plan"],
                ["Benefits Change Detector", "Find what changed between two enrollment years.", "/tools/benefits-change-detector"],
                ["Open Enrollment True Cost", "Compare health-plan premiums and care-cost exposure quickly.", "/tools/open-enrollment-true-cost-calculator"],
                ["403(b) Paycheck Calculator", "Translate one contribution choice into paycheck and annual amounts.", "/tools/403b-paycheck-calculator"],
                ["Total Compensation Comparison", "Run a fast two-job comparison before building full packages.", "/tools/healthcare-worker-total-compensation-comparison"],
              ].map(([title, body, href]) => (
                <Link key={href} to={href} className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/35 hover:shadow-card">
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open focused tool <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Authoritative references</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Verify material decisions at the source.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{source.name}</div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">{source.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{source.note}</p>
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
