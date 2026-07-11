import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileCheck2, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";

const TotalCompensationComparison = lazy(() => import("@/components/calculators/TotalCompensationComparison"));

const sources = [
  {
    name: "U.S. Bureau of Labor Statistics",
    title: "Employer Costs for Employee Compensation",
    url: "https://www.bls.gov/news.release/ecec.toc.htm",
    note: "Official context for treating wages and employer-paid benefits as separate parts of compensation.",
  },
  {
    name: "U.S. Department of Labor",
    title: "Overtime Pay",
    url: "https://www.dol.gov/agencies/whd/overtime",
    note: "Official overview of federal overtime requirements for covered, non-exempt employees.",
  },
  {
    name: "Internal Revenue Service",
    title: "Retirement Topics — Contributions",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
    note: "Official background on employee and employer contributions to workplace retirement plans.",
  },
  {
    name: "HealthCare.gov",
    title: "Your Total Costs for Health Care",
    url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/",
    note: "Official explanation that premiums and out-of-pocket costs both matter when comparing coverage.",
  },
];

const HealthcareWorkerTotalCompensationPage = () => (
  <>
    <PageHero
      eyebrow="Healthcare worker job offers"
      title="Compare two jobs by total compensation — not salary alone."
      description="Estimate cash pay, overtime, differentials, employer benefits, insurance premiums, commuting costs, effective hourly value, and the base pay needed to break even."
    >
      <Button asChild variant="outline" size="lg">
        <Link to="/articles/how-healthcare-workers-should-compare-job-offers">Read the comparison guide <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </PageHero>

    <section className="container min-w-0 py-10 md:py-14">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Calculator,
            title: "Financial comparison",
            body: "Separate base pay, overtime, differentials, bonuses, employer retirement money, health premiums, PTO, and work-related costs.",
          },
          {
            icon: FileCheck2,
            title: "Break-even pay",
            body: "Estimate the salary or hourly rate the lower-value offer would need to match the higher-value offer while holding other inputs constant.",
          },
          {
            icon: ShieldCheck,
            title: "Private by design",
            body: "Entries remain in local browser state. Raw employer names, salary figures, benefit amounts, and schedule answers are not sent to analytics.",
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

    <section className="container min-w-0 pb-12 md:pb-16">
      <Suspense fallback={<div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-border bg-card text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">Loading comparison tool…</div>}>
        <TotalCompensationComparison />
      </Suspense>
    </section>

    <section className="border-y border-border bg-card/35 py-14 md:py-18">
      <div className="container grid min-w-0 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How the estimate works</div>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Transparent assumptions instead of a mystery score</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p><strong className="text-foreground">Direct cash compensation</strong> includes base pay, expected overtime for hourly roles, entered differentials, bonuses, annualized sign-on value, and other specialty pay.</p>
            <p><strong className="text-foreground">Employer-funded benefits</strong> include the entered retirement contribution, HSA or HRA contribution, and additional benefits the user can reasonably value.</p>
            <p><strong className="text-foreground">Selected costs</strong> include employee health, dental, and vision premiums plus entered commuting, parking, and toll costs.</p>
            <p><strong className="text-foreground">PTO</strong> is shown for both offers. It is added to estimated value for hourly roles and not added again for salary roles because annual salary generally already includes paid leave.</p>
            <p><strong className="text-foreground">Break-even pay</strong> holds the other entered factors constant. It is a planning estimate, not a prediction of taxes, negotiation results, or legal entitlement.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-background p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Best documents to have nearby</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>• Written offer or current compensation statement</li>
            <li>• Paystub showing overtime and differential rules</li>
            <li>• Benefits rate sheet for the correct coverage tier</li>
            <li>• Retirement match, non-elective contribution, and vesting language</li>
            <li>• PTO, holiday, call, travel, and schedule policies</li>
            <li>• Sign-on bonus agreement and repayment period</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-18">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Common questions</div>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">What this tool can and cannot tell you</h2>
        </div>
        <div className="space-y-4">
          {[
            ["Does the higher total automatically mean the better job?", "No. The estimate shows measurable economic differences. Schedule, physical demands, call, family needs, career trajectory, leadership quality, and personal fit remain separate decisions."],
            ["Why is paid time off handled differently for salary and hourly roles?", "Annual salary normally continues while a salaried employee takes paid leave, so adding PTO value again would usually double count it. Hourly PTO may represent additional paid hours beyond worked hours."],
            ["Does the result estimate take-home pay?", "No. The tool is a pretax total-compensation comparison. It does not calculate federal, state, local, payroll, or benefit-tax treatment."],
            ["Can the tool determine whether a role qualifies for overtime?", "No. Exempt and non-exempt status depends on applicable law and the actual job duties and pay arrangement. Verify the written classification with the employer and use official Department of Labor guidance when needed."],
          ].map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <summary className="cursor-pointer font-display text-base font-bold text-foreground">{question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <h2 className="font-display text-xl font-bold">Authoritative references</h2>
          <ul className="mt-5 space-y-4">
            {sources.map((source) => (
              <li key={source.url} className="rounded-2xl border border-border bg-background p-4">
                <a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.name}: {source.title}</a>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{source.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <DisclaimerBox />
      </div>
    </section>
  </>
);

export default HealthcareWorkerTotalCompensationPage;
