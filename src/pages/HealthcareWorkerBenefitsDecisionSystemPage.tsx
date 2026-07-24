import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  Check,
  CircleHelp,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  Printer,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackSiteEvent } from "@/lib/analytics";

const modules = [
  ["Define the decision", "Roles, deadline, priorities, constraints, and must-have requirements."],
  ["Compare compensation", "Hourly or salary pay, annual hours, overtime, differentials, call, bonus, and holiday assumptions."],
  ["Value workplace benefits", "Known, estimated, unknown, conditional, and non-cash employer value."],
  ["Stress-test health-plan exposure", "Low-, expected-, and high-use planning scenarios."],
  ["Evaluate retirement benefits", "Match, nonelective contributions, eligibility, vesting, and forfeiture risk."],
  ["Measure schedule and career tradeoffs", "Transparent user ratings for time, burden, predictability, development, and quality of life."],
  ["Build the verification list", "Professional questions routed to the source that can answer them."],
  ["Generate the decision brief", "A dated, printable record of the comparison, unknowns, assumptions, and user-selected decision."],
] as const;

const statusItems = [
  ["Product type", "Interactive decision system"],
  ["Access model", "Account-based"],
  ["Output", "Printable decision brief"],
  ["Current status", "Private build and early-access preparation"],
  ["Expected price", "$29 one time — target only"],
  ["Checkout", "Not enabled"],
] as const;

export default function HealthcareWorkerBenefitsDecisionSystemPage() {
  useEffect(() => {
    trackSiteEvent("premium_product_page_viewed", {
      event_category: "premium_system",
      product_key: "healthcare-worker-benefits-decision-system",
    });
  }, []);

  return (
    <>
      <header className="overflow-hidden border-b border-border bg-[#f1f6f2]">
        <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfd2c5] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#07543d]"><ShieldCheck className="h-3.5 w-3.5" /> Interactive decision workspace</div>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-[-.04em] text-[#183326] md:text-7xl">Healthcare Worker Benefits Decision System</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#53645a] md:text-xl">A structured, saved process for comparing two healthcare roles or offers across compensation, benefits, health-plan risk, retirement, schedule, and career tradeoffs—then resolving what is still unknown.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <a href="#early-access" onClick={() => trackSiteEvent("premium_early_access_selected", { event_category: "premium_system", action_type: "early_access" })}>Join the early-access list <ArrowRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#system-preview" onClick={() => trackSiteEvent("premium_system_preview_viewed", { event_category: "premium_system", preview_type: "interface" })}>See how it works</a>
              </Button>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Account creation, paid access, and checkout are not available today. No payment information is collected, and joining the list does not create a purchase or reservation.</p>
          </div>
          <aside className="rounded-[2rem] border border-[#cfdbd2] bg-[#073b2d] p-7 text-white shadow-card md:p-9" aria-label="Current product status">
            <div className="flex items-center justify-between gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><LockKeyhole className="h-5 w-5" /></span><span className="rounded-full bg-amber-200 px-3 py-1.5 text-xs font-bold text-amber-950">Checkout disabled</span></div>
            <h2 className="mt-6 font-display text-3xl font-bold">Build status, stated plainly</h2>
            <dl className="mt-6 divide-y divide-white/15">
              {statusItems.map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-3 text-sm"><dt className="text-emerald-100/75">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
            </dl>
            <p className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-emerald-50/80">The expected price is a planning target, not an active offer. Final terms, support, privacy, refund policy, and price must be approved and displayed before payment is enabled.</p>
          </aside>
        </div>
      </header>

      <section className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-primary">The decision problem</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">The highest salary can still be the weaker offer.</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Healthcare work combines pay rules, unpredictable hours, differentials, call, coverage exposure, employer contributions, vesting, paid time, physical and emotional burden, commute, and career trajectory. The system keeps those facts visible without collapsing subjective choices into a false “perfect” score.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Calculator, "Compare transparently", "Separate base compensation, conditional assumptions, benefits, healthcare exposure, and retirement value."],
            [CircleHelp, "Preserve unknowns", "Do not guess. Incomplete facts become clear questions for HR, recruiters, administrators, and plan documents."],
            [FileText, "Finish with a record", "Review observations and accepted tradeoffs, record your own final decision, and print a dated brief."],
          ].map(([Icon, title, body]) => {
            const CardIcon = Icon as typeof Calculator;
            return <article key={String(title)} className="rounded-3xl border border-border bg-white p-6 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary"><CardIcon className="h-5 w-5" /></span><h3 className="mt-5 font-display text-2xl font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(body)}</p></article>;
          })}
        </div>
      </section>

      <section id="system-preview" className="border-y border-border bg-[#eef3ef] py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Representative interface preview</div>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">One major decision at a time.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">The application uses an account-based workspace, a clear module sequence, saved progress, visible assumptions, accessible forms, and a browser-printable final brief. The preview shows the interaction model, not the protected question library.</p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                [LayoutDashboard, "Resume a saved workspace across supported devices after secure backend activation."],
                [Scale, "See calculations and the assumptions that produced them."],
                [Printer, "Print the final decision brief without making PDF files the product."],
              ].map(([Icon, text]) => {
                const ItemIcon = Icon as typeof LayoutDashboard;
                return <li key={String(text)} className="flex gap-3 rounded-2xl border border-border bg-white p-4"><ItemIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{String(text)}</span></li>;
              })}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#c7d7cc] bg-white shadow-card" aria-label="Representative decision workspace preview">
            <div className="flex items-center justify-between border-b border-border bg-[#073b2d] px-5 py-4 text-white"><div className="flex items-center gap-3 font-display font-bold"><BriefcaseBusiness className="h-5 w-5" /> Benefits Decision System</div><span className="rounded-full bg-white/10 px-3 py-1 text-xs">Illustrative preview</span></div>
            <div className="grid md:grid-cols-[220px_1fr]">
              <div className="border-r border-border bg-[#f8faf8] p-4">
                <div className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Progress</div>
                <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 w-[38%] rounded-full bg-primary" /></div>
                <div className="mt-4 space-y-2">{modules.slice(0, 5).map(([title], index) => <div key={title} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${index === 2 ? "bg-[#e1efe7] text-[#07543d]" : ""}`}><span className={`grid h-5 w-5 place-items-center rounded-full ${index < 2 ? "bg-primary text-white" : "border border-border"}`}>{index < 2 ? <Check className="h-3 w-3" /> : index + 1}</span>{title}</div>)}</div>
              </div>
              <div className="p-5 md:p-8">
                <div className="text-xs font-bold uppercase tracking-[.14em] text-primary">Module 3 of 8</div>
                <h3 className="mt-2 font-display text-3xl font-bold">Value workplace benefits</h3>
                <p className="mt-2 text-sm text-muted-foreground">Classify each item before treating it as comparable financial value.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {["Option A", "Option B"].map((option) => <div key={option} className="rounded-2xl border border-border p-4"><div className="font-display text-lg font-bold">{option}</div><div className="mt-4 space-y-3">{["Employer health contribution", "Retirement value", "Paid time off"].map((label) => <div key={label}><div className="text-xs font-semibold">{label}</div><div className="mt-1 h-10 rounded-lg border border-border bg-muted/20" /></div>)}</div></div>)}
                </div>
                <div className="mt-5 rounded-2xl bg-[#eff6f1] p-4 text-xs leading-relaxed text-[#315447]">Known value, estimated value, unknown value, non-cash value, and verification needs stay distinct.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20" aria-labelledby="modules-heading">
        <div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Workflow</div><h2 id="modules-heading" className="mt-3 font-display text-4xl font-bold tracking-tight">Eight connected modules</h2><p className="mt-4 leading-relaxed text-muted-foreground">The public outline shows what the system covers. Detailed prompts, professional question sets, saved user data, and generated outputs stay behind authenticated entitlement checks.</p></div>
        <ol className="mt-9 grid gap-4 md:grid-cols-2">
          {modules.map(([title, body], index) => <li key={title} className="grid grid-cols-[44px_1fr] gap-4 rounded-3xl border border-border bg-white p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#073b2d] font-display font-bold text-white">{index + 1}</span><div><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div></li>)}
        </ol>
      </section>

      <section className="border-y border-border bg-[#073b2d] py-14 text-white md:py-20">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div><HeartPulse className="h-7 w-7 text-emerald-200" /><h2 className="mt-4 font-display text-4xl font-bold">Privacy by data minimization</h2><p className="mt-4 max-w-2xl leading-relaxed text-emerald-50/80">The first release will not accept document uploads. Users will be reminded to enter only the figures and generic notes needed to model an employment and benefits decision.</p></div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6"><h3 className="font-display text-2xl font-bold">Do not enter or upload</h3><p className="mt-3 text-sm leading-relaxed text-emerald-50/80">Social Security numbers, financial account or card numbers, insurance member IDs, medical records, diagnoses, claim documents, identifying EOBs, paystubs, full statements, protected health information, or confidential employer documents.</p><p className="mt-4 text-sm leading-relaxed text-emerald-50/80">The system is educational. It does not replace employment, tax, legal, benefits, insurance, retirement-plan, or medical advice.</p></div>
        </div>
      </section>

      <section id="early-access" className="container py-14 md:py-20">
        <NewsletterSignup
          source="benefits-decision-system-early-access"
          emailType="benefits-system-interest"
          title="Get notified when secure early access opens"
          description="Receive product-status updates for the Healthcare Worker Benefits Decision System. Checkout is not enabled, and no payment or purchase obligation is created."
          buttonLabel="Join the early-access list"
          successMessage="You are on the early-access list. No payment was collected."
          limitedSuccessMessage="Your early-access interest was saved. No payment was collected."
        />
      </section>
    </>
  );
}
