import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BriefcaseBusiness, Calculator, Check, ClipboardCheck, Clock3, FileCheck2, FileText, KeyRound, LayoutDashboard, LockKeyhole, Printer, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackSiteEvent } from "@/lib/analytics";

const modules = [
  ["01", "Employment pay structure"], ["02", "Total compensation"], ["03", "Medical insurance"], ["04", "Dental insurance"],
  ["05", "Vision insurance"], ["06", "HSA, FSA & HRA elections"], ["07", "Retirement plan identification"], ["08", "Retirement contribution election"],
  ["09", "PTO & leave"], ["10", "Disability, life & protection elections"], ["11", "Schedule & controlled time"], ["12", "Repayment risk"],
  ["13", "Career fit & employment risk"], ["14", "Integrated decision board"],
] as const;

const officialSources = [
  ["U.S. Bureau of Labor Statistics", "Employer Costs for Employee Compensation", "https://www.bls.gov/news.release/ecec.toc.htm"],
  ["U.S. Department of Labor", "What You Should Know About Your Retirement Plan", "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan"],
  ["Internal Revenue Service", "403(b) contribution limits", "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-403b-contribution-limits"],
  ["HealthCare.gov", "Summary of Benefits and Coverage", "https://www.healthcare.gov/health-care-law-protections/summary-of-benefits-and-coverage/"],
] as const;

type ProductConfig = { commerceEnabled?: boolean; products?: Array<{ productId?: string; checkoutEnabled?: boolean; productStatus?: string }> };

export default function HealthcareWorkerBenefitsDecisionPackPage() {
  const [config, setConfig] = useState<ProductConfig | null>(null);

  useEffect(() => {
    trackSiteEvent("premium_product_page_viewed", { event_category: "premium", product_id: "healthcare_compensation_benefits_decision_book" });
    void fetch("/api/product-config", { cache: "no-store" }).then((response) => response.json()).then(setConfig).catch(() => setConfig({ commerceEnabled: false }));
  }, []);

  const checkoutEnabled = Boolean(config?.commerceEnabled && config.products?.some((product) => product.productId === "healthcare_compensation_benefits_decision_book" && product.checkoutEnabled));

  return (
    <>
      <header className="overflow-hidden border-b border-border bg-[#f4f6f2]">
        <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfd2c5] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#07543d]"><ShieldCheck className="h-3.5 w-3.5" /> CAF private client decision system</div>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-[-.04em] text-[#183326] md:text-7xl">Healthcare Compensation & Benefits Decision Workspace</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#53645a] md:text-xl">For nurses and other healthcare professionals evaluating a job offer, a current role, or annual benefit elections. Turn scattered documents and uncertain tradeoffs into one documented decision.</p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-[#41584d]">
              {["One-time purchase", "Secure customer account", "14 decision modules", "12 months of updates", "No automatic renewal", "No advertising inside"].map((label) => <span key={label} className="rounded-full border border-[#cfdbd2] bg-white px-3 py-2">{label}</span>)}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg"><Link to="/premium/access" onClick={() => trackSiteEvent("premium_primary_cta_clicked", { event_category: "premium", product_id: "healthcare_compensation_benefits_decision_book", cta_state: checkoutEnabled ? "checkout_ready" : "access_preview" })}>{checkoutEnabled ? "Purchase and open workspace" : "Review secure access"} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><a href="#workspace-preview">Preview the system</a></Button>
            </div>
            {!checkoutEnabled && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Checkout remains closed until merchant approval, entitlement storage, access email, webhook, refund, support, and production test gates pass. No card information is collected by CAF while those gates are incomplete.</p>}
          </div>

          <aside className="rounded-[2rem] border border-[#cfdbd2] bg-[#073b2d] p-7 text-white shadow-card md:p-9" aria-label="Product purchase terms">
            <div className="flex items-center justify-between gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><LockKeyhole className="h-5 w-5" /></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${checkoutEnabled ? "bg-emerald-200 text-emerald-950" : "bg-amber-200 text-amber-950"}`}>{checkoutEnabled ? "Secure checkout active" : "Commerce default-deny"}</span></div>
            <div className="mt-7 text-sm text-emerald-100">Launch price</div><div className="mt-1 font-display text-5xl font-bold">$29</div><p className="mt-3 text-sm leading-relaxed text-emerald-50/80">Planned one-time launch price. Standard price documented at $39. Final price and governing terms are displayed before payment.</p>
            <div className="my-6 border-t border-white/15" />
            <ul className="space-y-3 text-sm">{["Continued access to the purchased edition while the service remains available", "Substantive product updates for 12 months from verified purchase", "No subscription and no automatic renewal", "Print current modules and save a dated decision summary as PDF", "Secure email access recovery tied to the checkout email"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>{item}</span></li>)}</ul>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-relaxed text-emerald-50/75">Refund eligibility and procedure must be shown at checkout and in CAF purchase terms before commerce is enabled. Until that policy is approved and published, the payment endpoint remains unavailable.</div>
          </aside>
        </div>
      </header>

      <section className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">The problem it solves</div><h2 className="mt-3 font-display text-4xl font-bold tracking-tight">A job offer is not one number. A benefits election is not one premium.</h2><p className="mt-5 text-lg leading-relaxed text-muted-foreground">Healthcare compensation combines guaranteed pay, uncertain hours, differentials, employer contributions, health-plan access, controlled time, leave, vesting, repayment obligations, and career risk. The workspace separates those decisions without collapsing them into a misleading score.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [BriefcaseBusiness, "Build the real package", "Separate guaranteed cash, conditional pay, employer-funded value, employee costs, vesting, and schedule burden."],
            [ClipboardCheck, "Verify what controls", "Turn missing facts into written questions tied to the correct offer, policy, SBC, SPD, certificate, directory, or agreement."],
            [FileCheck2, "Finish with one record", "Document the election, decisive reason, source, confidence, accepted tradeoff, open item, deadline, and review date."],
          ].map(([Icon, title, body]) => { const CardIcon = Icon as typeof BriefcaseBusiness; return <article key={String(title)} className="rounded-3xl border border-border bg-card p-6 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary"><CardIcon className="h-5 w-5" /></span><h3 className="mt-5 font-display text-2xl font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(body)}</p></article>; })}
        </div>
      </section>

      <section id="workspace-preview" className="border-y border-border bg-[#eef3ef] py-14 md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-24"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Web-native by design</div><h2 className="mt-3 font-display text-4xl font-bold tracking-tight">A workspace you can return to—not a PDF trapped in a browser tab.</h2><p className="mt-5 leading-relaxed text-muted-foreground">The canonical v3.0 Decision Book remains the substantive source. The paid web product adds orientation, progress, module relationships, access recovery, saved completion, source governance, print controls, and a dated integrated decision output.</p><div className="mt-7 space-y-3">{[
              [LayoutDashboard, "Premium dashboard", "Continue where you left off, see completion, outstanding documents, access status, and update coverage."],
              [KeyRound, "Secure repeat access", "Passwordless email sessions and server-verified entitlements—not a downloadable link shared in page source."],
              [Printer, "Print and PDF outputs", "Print an individual module or save the personalized decision summary as a dated PDF from the browser."],
              [ShieldCheck, "Minimized saved data", "Only completion and generic tasks sync. Free-text notes and calculation inputs remain in the browser."],
            ].map(([Icon, title, body]) => { const RowIcon = Icon as typeof LayoutDashboard; return <div key={String(title)} className="flex gap-4 rounded-2xl border border-[#cfdbd2] bg-white p-5"><RowIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><div className="font-semibold">{String(title)}</div><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{String(body)}</p></div></div>; })}</div></div>

            <div className="rounded-[2rem] border border-[#c8d6cc] bg-white p-5 shadow-card md:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-5"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-primary">Sample module preview</div><div className="mt-1 font-display text-2xl font-bold">03. Medical insurance</div></div><span className="rounded-full bg-[#e1efe7] px-3 py-1.5 text-xs font-bold text-[#07543d]">Protected workspace pattern</span></div>
              <div className="mt-6 rounded-2xl border border-[#c8dcd0] bg-[#eff6f1] p-5"><div className="text-sm font-bold text-[#07543d]">Orientation</div><p className="mt-2 text-sm leading-relaxed text-[#315447]">Premium is only one part of cost. Verify the exact plan, coverage tier, network, formulary, deductible structure, employer funding, and out-of-pocket exposure.</p></div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">{["Can you reach the clinicians and facilities that matter?", "What is the annual cost under low, expected, and high use?", "Which plan rules could materially change the result?"].map((question, index) => <div key={question} className="rounded-2xl border border-border p-4"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#073b2d] text-xs font-bold text-white">{index + 1}</span><p className="mt-3 text-sm font-semibold leading-relaxed">{question}</p></div>)}</div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-border"><div className="grid grid-cols-[1.15fr_.85fr_.85fr] bg-[#f2f6f3] px-4 py-3 text-xs font-bold"><span>Decision factor</span><span>Option A</span><span>Option B</span></div>{["Annual payroll premium", "Deductible structure", "Out-of-pocket maximum", "Employer HSA or HRA funding", "Network and formulary"].map((row) => <div key={row} className="grid grid-cols-[1.15fr_.85fr_.85fr] border-t border-border px-4 py-3 text-xs"><span className="font-semibold">{row}</span><span className="text-muted-foreground">Record locally</span><span className="text-muted-foreground">Verify source</span></div>)}</div>
              <div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Copy-ready questions</span><span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Local private note</span><span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Completion state</span><span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Sources nearby</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Included system</div><h2 className="mt-3 font-display text-4xl font-bold">Fourteen modular decisions. One integrated answer.</h2><p className="mt-5 leading-relaxed text-muted-foreground">Section numbers are navigation, not a required sequence. A buyer focused only on medical coverage can complete Module 03 and the medical line of Module 14 without working through every compensation module first.</p></div><div className="grid gap-3 sm:grid-cols-2">{modules.map(([number, title]) => <div key={number} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{number}</span><span className="font-semibold">{title}</span></div>)}</div></div>
      </section>

      <section className="border-y border-border bg-card/35 py-14 md:py-20">
        <div className="container grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><BookOpen className="h-5 w-5 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold">What remains free</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">CAF articles, glossary pages, official-source links, general calculators, the Benefits Command Center, and foundational job-offer and benefits education remain available without purchase.</p><Button asChild variant="outline" className="mt-6"><Link to="/tools/benefits-command-center">Open the free foundation</Link></Button></article>
          <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><Sparkles className="h-5 w-5 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold">What the purchase adds</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The integrated 14-module workflow, protected repeat access, source-aware decision records, progress, copy-ready professional questions, update history, private browser notes, and printable personalized outputs.</p></article>
          <article className="rounded-3xl border border-border bg-card p-7 shadow-card"><Scale className="h-5 w-5 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold">What it does not do</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">It does not recommend an employer or plan, determine eligibility or coverage, interpret contracts, predict healthcare use or career satisfaction, calculate official tax liability, or replace qualified professional advice.</p></article>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9"><ShieldCheck className="h-6 w-6 text-primary" /><h2 className="mt-5 font-display text-3xl font-bold">Privacy and data handling</h2><ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">{["Account data is limited to purchase entitlement, session, module completion, last-viewed module, generic tasks, and product version.", "Calculator inputs, draft comparisons, and free-text notes stay in the browser unless the buyer deliberately prints or saves them.", "CAF does not request Social Security numbers, Medicare IDs, banking credentials, medical records, insurance portal credentials, beneficiary details, or employer documents.", "The product does not claim HIPAA compliance and should not be used to store protected health information."].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul><div className="mt-6 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/privacy-policy">Privacy policy</Link></Button><Button asChild variant="outline"><Link to="/terms-of-use">Terms of use</Link></Button></div></article>
          <article className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9"><FileText className="h-6 w-6 text-primary" /><h2 className="mt-5 font-display text-3xl font-bold">Sources, creation, and review</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Created by Andrew Ciccarelli, RN, BSN, using healthcare-workforce context and authoritative sources. The current source edition is v3.0, reviewed July 23, 2026. Employer documents remain controlling. Independent legal, tax, insurance, benefits, and accessibility review are not implied unless specifically documented.</p><ul className="mt-6 space-y-3">{officialSources.map(([agency, title, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">{agency}: {title}</a></li>)}</ul></article>
        </div>
      </section>

      <section className="bg-[#073b2d] py-14 text-white md:py-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-center"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Secure customer journey</div><h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight">Purchase once. Activate the account. Return when the decision changes.</h2><p className="mt-5 max-w-3xl leading-relaxed text-emerald-50/80">Checkout completion is verified server-side. A success URL alone cannot unlock content. The purchase email receives passwordless access, and the server rechecks the entitlement before returning any premium module content.</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-white text-[#073b2d] hover:bg-emerald-50"><Link to="/premium/access">Open secure access <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"><a href="#interest">Launch-notice list</a></Button></div></div><div className="grid gap-3">{["1. Visit product page", "2. Complete secure one-time checkout", "3. Verify payment by webhook", "4. Receive passwordless account access", "5. Resume progress on later visits"].map((step) => <div key={step} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold">{step}</div>)}</div></div>
      </section>

      {!checkoutEnabled && <section id="interest" className="container py-14 md:py-20"><NewsletterSignup source="healthcare-compensation-benefits-workspace" emailType="benefits-pack-interest" title="Receive one launch notice when secure checkout is authorized" description="No payment is collected here. The notice is sent only after commerce, refund, support, privacy, delivery, and test-transaction gates are verified." buttonLabel="Join the launch-notice list" successMessage="You are on the launch-notice list. No payment was collected." /></section>}

      <section className="container pb-14 md:pb-20"><div className="rounded-[2rem] border border-border bg-[#f4f6f2] p-7 md:p-9"><div className="flex items-start gap-4"><Calculator className="mt-1 h-6 w-6 shrink-0 text-primary" /><div><h2 className="font-display text-2xl font-bold">Educational limitations</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The workspace organizes facts supplied by the buyer and helps create better questions. It is not individualized financial, legal, tax, employment, insurance, investment, or medical advice. Current law, official guidance, written offers, plan documents, contracts, agencies, insurers, employers, administrators, and qualified professionals control material decisions.</p></div></div></div></section>
    </>
  );
}
