import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  Check,
  FileCheck2,
  FileQuestion,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { PAID_PRODUCTS } from "@/data/paidProducts";
import { trackBenefitsPackEvent } from "@/lib/benefitsPackAnalytics";

const product = PAID_PRODUCTS.find((candidate) => candidate.id === "healthcare_worker_career_benefits_decision_system")!;

const included = [
  "Two-offer job comparison with salary, hourly pay, overtime, shift differentials, bonuses, and other compensation",
  "Employer retirement contribution, match, eligibility, and vesting review",
  "Health-plan comparison across premium, deductible, out-of-pocket maximum, HSA, FSA, and employer funding",
  "Open-enrollment and annual benefits review workflow",
  "Student-loan and employer educational-assistance verification questions",
  "Schedule, commute, call, travel, PTO, leave, disability, and repayment-risk audit",
  "Document-collection checklist, HR question bank, written-verification tracker, and negotiation prompts",
  "Final decision summary plus reusable annual action plan",
];

const previews = [
  {
    id: "offer_compare",
    eyebrow: "Worksheet preview",
    title: "Compare the whole offer",
    description: "Put pay, employer-funded benefits, recurring costs, schedule burden, and unresolved facts next to each other without turning the result into a mystery score.",
    rows: ["Cash compensation", "Employer-funded value", "Time and schedule burden", "Items still unverified"],
  },
  {
    id: "health_plan_scenarios",
    eyebrow: "Spreadsheet preview",
    title: "Stress-test health-plan costs",
    description: "Use low-, expected-, and high-use scenarios after copying the correct plan-year numbers from the Summary of Benefits and Coverage and employer materials.",
    rows: ["Annual premiums", "Expected cost sharing", "Employer HSA or HRA funds", "Worst-case exposure"],
  },
  {
    id: "decision_summary",
    eyebrow: "Decision memo preview",
    title: "Finish with a written decision",
    description: "Record the preferred option, decisive facts, assumptions, tradeoffs, remaining questions, and actions required before accepting or resigning.",
    rows: ["Preferred option", "Decisive reasons", "Assumptions to verify", "Next actions and dates"],
  },
];

const officialSources = [
  ["U.S. Department of Labor", "Saving Matters: workplace retirement basics", "https://www.savingmatters.dol.gov/employees.htm"],
  ["U.S. Department of Labor", "Summary Plan Description glossary", "https://webapps.dol.gov/elaws/ebsa/health/glossary.htm?wd=SPD"],
  ["Internal Revenue Service", "403(b) contribution limits", "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits"],
  ["Internal Revenue Service", "Employer educational-assistance programs", "https://www.irs.gov/newsroom/employers-may-help-with-college-expenses-through-educational-assistance-programs"],
  ["HealthCare.gov", "Summary of Benefits and Coverage", "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/"],
  ["Federal Student Aid", "Student-loan forgiveness overview", "https://studentaid.gov/articles/student-loan-forgiveness/"],
] as const;

const HealthcareWorkerBenefitsDecisionPackPage = () => {
  useEffect(() => {
    trackBenefitsPackEvent("benefits_pack_page_viewed", { surface: "product_page" });
  }, []);

  return (
    <>
      <header className="border-b border-border bg-gradient-to-br from-primary-soft/70 via-background to-secondary-soft/45">
        <div className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">$29 paid-pilot validation</div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Healthcare Worker Benefits Decision Pack
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              A focused PDF and spreadsheet system for comparing two healthcare jobs, reviewing annual benefits, documenting HR answers, and finishing with one written decision.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
              {["One-time target price: $29", "PDF + spreadsheet", "No account required", "No payment collected yet"].map((label) => (
                <span key={label} className="rounded-full border border-border bg-card px-3 py-2">{label}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <a href="#paid-pilot" onClick={() => trackBenefitsPackEvent("benefits_pack_paid_pilot_cta_clicked", { surface: "product_page" })}>
                  Join the $29 paid-pilot list <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#previews" onClick={() => trackBenefitsPackEvent("benefits_pack_preview_opened", { surface: "product_page", preview_id: "overview" })}>See representative previews</a>
              </Button>
            </div>
          </div>

          <aside className="rounded-3xl border border-primary/20 bg-card p-7 shadow-card" aria-label="Paid pilot status">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><LockKeyhole className="h-5 w-5" aria-hidden="true" /></div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">Current status</div>
            <h2 className="mt-2 font-display text-2xl font-bold">Built for validation. Checkout off.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The product files and checkout connection point are being prepared, but payment remains disabled until hosted delivery, refund, support, privacy, and test-transaction gates pass.
            </p>
            <p className="mt-4 rounded-2xl bg-muted/45 p-4 text-xs leading-relaxed text-muted-foreground">
              Joining this list records interest only. It does not reserve a copy, create a purchase obligation, or collect card information.
            </p>
          </aside>
        </div>
      </header>

      <>
        <section className="container py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The job to be done</div>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Turn scattered benefit documents into one auditable decision</h2>
            <p className="mt-4 text-muted-foreground">The pack adds reusable organization and decision support. Current rules, plan terms, eligibility, networks, costs, and employer promises still come from official sources and controlling employer documents.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [BriefcaseBusiness, "Compare offers", "Separate base pay, differentials, employer-funded value, recurring costs, schedule burden, and unresolved facts."],
              [Calculator, "Review benefits", "Work through retirement, health plans, tax-advantaged accounts, leave, protection benefits, and education assistance."],
              [FileCheck2, "Document the decision", "Convert open questions into written HR requests, then record the final choice, tradeoffs, and next actions."],
            ].map(([Icon, title, body]) => {
              const CardIcon = Icon as typeof BriefcaseBusiness;
              return <article key={String(title)} className="rounded-2xl border border-border bg-card p-6 shadow-card"><CardIcon className="h-5 w-5 text-primary" aria-hidden="true" /><h3 className="mt-4 font-display text-xl font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{String(body)}</p></article>;
            })}
          </div>
        </section>

        <section className="border-y border-border bg-card/35 py-14 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Included in the paid pilot</div><h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">One lean pack, not a course or subscription</h2><p className="mt-4 text-muted-foreground">Designed to be printed, marked up, reused at open enrollment, and updated when a job offer changes.</p></div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {included.map((item) => <li key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
        </section>

        <section id="previews" className="container py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center"><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Representative previews</div><h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">See the system before joining</h2><p className="mt-4 text-muted-foreground">These previews show the structure without publishing the complete paid files.</p></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {previews.map((preview) => <article key={preview.id} className="rounded-3xl border border-border bg-card p-6 shadow-card" onClick={() => trackBenefitsPackEvent("benefits_pack_preview_opened", { surface: "preview", preview_id: preview.id })}><div className="rounded-2xl border border-border bg-muted/25 p-4"><div className="h-2 w-20 rounded-full bg-primary" />{preview.rows.map((row) => <div key={row} className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 text-xs"><span>{row}</span><span className="h-2 w-12 rounded-full bg-border" /></div>)}</div><div className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{preview.eyebrow}</div><h3 className="mt-2 font-display text-xl font-bold">{preview.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{preview.description}</p></article>)}
          </div>
        </section>

        <section className="border-y border-border bg-primary-soft/25 py-14 md:py-20">
          <div className="container grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><Scale className="h-5 w-5 text-primary" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold">What it does not do</h2><ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">{["Recommend a specific employer, plan, account, loan strategy, or contribution amount", "Interpret plan documents as legal, tax, insurance, investment, or employment advice", "Determine overtime classification, eligibility, network coverage, taxes, or benefit entitlement", "Predict negotiation results, healthcare use, investment returns, loan forgiveness, or career satisfaction", "Replace the Summary Plan Description, Summary of Benefits and Coverage, plan contract, written offer, or qualified professional advice"].map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true">—</span><span>{item}</span></li>)}</ul></article>
            <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold">Privacy and purchase terms</h2><div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground"><p>The pack is designed for local files and print. Do not send Community Acquired Finance offer letters, paystubs, benefit statements, medical details, student-loan account numbers, or other sensitive documents.</p><p>The target paid-pilot price is a one-time $29 purchase. Final delivery, refund, support, licensing, and payment terms will be shown before any future checkout. No checkout is active on this page.</p><p>Community Acquired Finance will not report a purchase, paid conversion, or revenue event unless a verified processor transaction exists.</p></div></article>
          </div>
        </section>

        <section id="paid-pilot" className="container py-14 md:py-20">
          <NewsletterSignup source="benefits-decision-pack-product-page" emailType="benefits-pack-interest" title="Interested enough to pay $29? Join the paid-pilot list." description="Use this consented list to signal genuine purchase interest. No payment is collected today. You will receive an update only after checkout, delivery, refund, privacy, and support gates are verified." buttonLabel="Join the $29 paid-pilot list" successMessage="You are on the $29 paid-pilot list. No payment was collected." />
        </section>

        <section className="container pb-14 md:pb-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><FileQuestion className="h-5 w-5 text-primary" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold">Official sources and controlling documents</h2><ul className="mt-5 space-y-4">{officialSources.map(([agency, title, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{agency}: {title}</a></li>)}</ul><p className="mt-5 text-xs leading-relaxed text-muted-foreground">Rules and plan-year limits change. Verify current law and the employer's actual documents before acting.</p></article>
            <aside className="rounded-3xl border border-border bg-muted/25 p-7"><h2 className="font-display text-2xl font-bold">Prefer the free foundation?</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The site’s core explanations, sources, calculators, and benefits tools remain free. The paid-pilot pack tests whether an integrated reusable workflow is worth $29.</p><div className="mt-6 space-y-3"><Button asChild variant="outline" className="w-full justify-between"><Link to="/tools/healthcare-worker-total-compensation-comparison">Compare two offers <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild variant="outline" className="w-full justify-between"><Link to="/tools/healthcare-worker-benefits-blueprint">Build a benefits blueprint <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild variant="outline" className="w-full justify-between"><Link to="/open-enrollment">Use the open-enrollment guide <ArrowRight className="h-4 w-4" /></Link></Button></div></aside>
          </div>
        </section>
      </>
    </>
  );
};

export default HealthcareWorkerBenefitsDecisionPackPage;
