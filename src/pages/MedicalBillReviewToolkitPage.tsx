import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileCheck2,
  FileQuestion,
  FileText,
  Landmark,
  Mail,
  PhoneCall,
  Printer,
  Receipt,
  Scale,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { MedicalBillCaseDashboard } from "@/components/medical-bill-case-dashboard";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

type RouteId = "eob" | "hospital" | "professional" | "denial" | "assistance" | "collections" | "mismatch" | "none";

type DocumentRoute = {
  id: RouteId;
  title: string;
  short: string;
  icon: typeof FileText;
  classification: string;
  not: string;
  checks: readonly string[];
  mistakes: readonly string[];
  questions: readonly string[];
  next: string;
  href: string;
  cta: string;
  official: string;
  officialLabel: string;
};

const documentRoutes: readonly DocumentRoute[] = [
  {
    id: "eob",
    title: "Explanation of Benefits",
    short: "Usually an insurer explanation, not a request for payment.",
    icon: FileCheck2,
    classification: "A payer document showing claim processing, allowed amounts, plan payment, and possible patient responsibility.",
    not: "It is generally not the provider's bill, even when it lists a patient-responsibility amount.",
    checks: ["Match the service date and provider.", "Find claim status, allowed amount, plan payment, and patient responsibility.", "Locate the matching provider bill before paying from the EOB alone."],
    mistakes: ["Paying from the EOB instead of the provider bill.", "Treating a pending or denied claim as final."],
    questions: ["Has the provider sent a matching bill?", "Do the patient-responsibility amounts match?"],
    next: "Match the EOB and provider bill line by line.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Compare the EOB and bill",
    official: "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
    officialLabel: "CMS EOB guide",
  },
  {
    id: "hospital",
    title: "Hospital or facility bill",
    short: "A request for payment from the hospital organization.",
    icon: Receipt,
    classification: "A facility bill that may cover room, supplies, equipment, and institutional services.",
    not: "It may not include physicians, anesthesia, laboratory, imaging, pathology, or ambulance charges.",
    checks: ["Confirm the related claim was processed.", "Compare the balance with the EOB or Medicare notice.", "Request an itemized bill and written financial-assistance policy when needed."],
    mistakes: ["Assuming one visit creates only one bill.", "Starting a long payment plan before checking assistance."],
    questions: ["Which services and clinicians are included?", "Can the account be held during review?"],
    next: "Use the guided review before treating the first balance as final.",
    href: "/tools/medical-bill-review-flow",
    cta: "Start the bill review",
    official: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS hospital requirements",
  },
  {
    id: "professional",
    title: "Physician or professional bill",
    short: "A separate bill from a clinician or professional group.",
    icon: Stethoscope,
    classification: "A professional-services bill that can arrive separately from the hospital or facility bill.",
    not: "A separate bill is not automatically a duplicate; first identify the billing entity and service.",
    checks: ["Identify the billing group and service date.", "Find the matching payer claim.", "Check network processing and patient responsibility."],
    mistakes: ["Calling the hospital about an independent-group bill.", "Assuming an unfamiliar group name proves fraud."],
    questions: ["What service does the group say it provided?", "Which payer claim matches it?"],
    next: "Identify the bill owner, then compare it with the payer explanation.",
    href: "/articles/why-one-hospital-visit-can-create-multiple-bills",
    cta: "See why one visit creates multiple bills",
    official: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "denial",
    title: "Denial or authorization notice",
    short: "A written decision with a reason, instructions, and often a deadline.",
    icon: AlertTriangle,
    classification: "A notice explaining why a claim, service, medication, or authorization was not approved as submitted.",
    not: "It is not always the last available decision, but review rights depend on the plan and notice.",
    checks: ["Read the exact reason.", "Locate the appeal or review deadline.", "Identify missing documentation and who must submit it."],
    mistakes: ["Calling before reading the notice.", "Using a generic appeal without following the stated process."],
    questions: ["What exact evidence or step is missing?", "What submission method and deadline apply?"],
    next: "Organize the notice, deadline, and provider-plan questions before responding.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Build the next-step plan",
    official: "https://www.healthcare.gov/appeal-insurance-company-decision/",
    officialLabel: "HealthCare.gov appeals",
  },
  {
    id: "assistance",
    title: "Financial-assistance paperwork",
    short: "A hospital-specific application or policy for eligible charges.",
    icon: ClipboardCheck,
    classification: "A process that may consider income, household, insurance status, services, and hospital policy rules.",
    not: "It is not a universal guarantee and may not cover every professional group from the visit.",
    checks: ["Request the written policy and plain-language summary.", "Confirm covered entities and services.", "List documents, submission steps, and review timing."],
    mistakes: ["Assuming insurance makes you ineligible.", "Submitting documents without keeping a dated copy."],
    questions: ["Will collection activity pause during review?", "Can assistance apply to paid or collection accounts?"],
    next: "Gather the policy, application, document list, and account-hold instructions.",
    href: "/articles/check-hospital-financial-assistance-before-paying",
    cta: "Open the assistance guide",
    official: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS Section 501(r)",
  },
  {
    id: "collections",
    title: "Collections letter or warning",
    short: "A time-sensitive notice about an unpaid balance.",
    icon: PhoneCall,
    classification: "A notice that a provider or collection company says a balance remains unpaid.",
    not: "It does not eliminate the need to verify the original bill, claim processing, disputes, or assistance status.",
    checks: ["Identify the original creditor and balance.", "Gather prior bills, EOBs, disputes, and assistance records.", "Read every deadline and verify current rights."],
    mistakes: ["Ignoring a legitimate deadline.", "Sharing medical details when only account verification is needed."],
    questions: ["What original creditor and balance are identified?", "Is another review still unresolved?"],
    next: "Verify the account and preserve written records before choosing a response.",
    href: "/tools/medical-bill-review-flow",
    cta: "Organize the review",
    official: "https://www.consumerfinance.gov/consumer-tools/medical-debt/",
    officialLabel: "CFPB medical-debt resources",
  },
  {
    id: "mismatch",
    title: "Documents do not match",
    short: "The EOB, bill, or portal shows inconsistent numbers or statuses.",
    icon: Scale,
    classification: "A reconciliation problem that may involve timing, different billing entities, claim status, adjustments, network status, or authorization.",
    not: "A mismatch alone does not prove an error or determine what is owed.",
    checks: ["Match service dates and billing entities.", "Confirm processed, pending, adjusted, or denied status.", "Ask the owner of the inconsistent number for a written explanation."],
    mistakes: ["Comparing unrelated claim lines.", "Calling several organizations without assigning the next action."],
    questions: ["Which exact line or amount conflicts?", "Is the mismatch temporary or final?"],
    next: "Use the comparison checker and save a structured case summary.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Compare the documents",
    official: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "none",
    title: "No document yet",
    short: "Prepare before a bill or EOB arrives.",
    icon: FileQuestion,
    classification: "A preparation stage for saving estimates, authorization details, expected billing groups, and contact information.",
    not: "A verbal quote or estimate is not always the final processed patient responsibility.",
    checks: ["Save written estimates and authorizations.", "Ask which groups may bill separately.", "Know where payer explanations and billing contacts will appear."],
    mistakes: ["Relying only on a verbal estimate.", "Assuming every clinician shares the facility's network status."],
    questions: ["Which organizations may bill separately?", "What written cost or coverage information is available now?"],
    next: "Prepare a document folder and review the first payer explanation before paying.",
    href: "/articles/questions-to-ask-before-a-medical-appointment-cost",
    cta: "Prepare for medical costs",
    official: "https://www.cms.gov/medical-bill-rights/help/guides/good-faith-estimate",
    officialLabel: "CMS estimate guide",
  },
];

const beforePay = [
  "Identify the document before acting on it.",
  "Match the patient, date, provider, and service.",
  "Confirm the payer processed the claim.",
  "Compare billed charge, allowed amount, adjustments, plan payment, and patient responsibility.",
  "Separate facility and professional bills.",
  "Request an itemized bill when the balance is unclear or unexpected.",
  "Check network and current surprise-billing protections when relevant.",
  "Check hospital financial assistance before a long payment plan or high-interest debt.",
  "Organize denial reasons, instructions, and deadlines exactly as written.",
  "Record every call, promise, document, and follow-up date.",
] as const;

const patterns = [
  ["One visit, several bills", "Facility, physician, laboratory, imaging, anesthesia, pathology, and ambulance organizations may bill separately."],
  ["EOB versus bill", "The payer explanation describes claim processing; the provider bill requests payment. Compare them."],
  ["Billed versus allowed", "The billed charge is submitted by the provider. The allowed amount is recognized under the plan's rules."],
  ["Pending, denied, adjusted", "A pending claim is not final. A denial needs its written reason. Adjustments can change the provider balance."],
] as const;

const officialSources = [
  ["CMS Medical Bill Rights", "https://www.cms.gov/medical-bill-rights"],
  ["CMS Explanation of Benefits", "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits"],
  ["HealthCare.gov Appeals", "https://www.healthcare.gov/appeal-insurance-company-decision/"],
  ["IRS Tax-Exempt Hospital Requirements", "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r"],
  ["CFPB Medical Debt Resources", "https://www.consumerfinance.gov/consumer-tools/medical-debt/"],
  ["Medicare Appeals", "https://www.medicare.gov/claims-appeals/how-do-i-file-an-appeal"],
] as const;

const MedicalBillReviewToolkitPage = () => {
  const [routeId, setRouteId] = useState<RouteId | null>(null);
  const route = useMemo(() => documentRoutes.find((item) => item.id === routeId) ?? null, [routeId]);

  useSeo({
    title: "Medical Bill Response System",
    description: "Identify an EOB, medical bill, denial, assistance form, or collection notice and follow an RN-led, privacy-minimized review sequence before paying.",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
  });

  useEffect(() => {
    trackSiteEvent("medical_bill_hub_view", { event_category: "medical_bill", entry_surface: "response_system" });
  }, []);

  const chooseRoute = (id: RouteId) => {
    setRouteId(id);
    trackSiteEvent("document_router_start", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("document_router_result_type", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("document_router_complete", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("tool_completion", { event_category: "medical_bill", tool_id: "document_router" });
    requestAnimationFrame(() => document.getElementById("document-result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const trackOfficial = (id: string) => trackSiteEvent("official_source_click", { event_category: "medical_bill", resource_id: id });
  const print = () => {
    trackSiteEvent("print_or_save_action", { event_category: "medical_bill", action_type: "page_print" });
    window.print();
  };

  return (
    <>
      <PageHero eyebrow="RN-led healthcare money navigation" title="Medical Bill Response System" description="Identify the document, check the claim story, organize the next call, and verify the correct official source before treating a balance as final.">
        <Button asChild variant="hero" size="lg"><a href="#document-router">Identify my document <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="/downloads/medical-bill-response-pack.html" onClick={() => trackSiteEvent("response_pack_download", { event_category: "medical_bill", asset_id: "medical_bill_response_pack" })}><Download className="h-4 w-4" /> Open response pack</a></Button>
      </PageHero>

      <main className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">Start with the document, not the dollar amount.</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">An EOB is generally not a bill. Do not ignore a legitimate deadline, but do not assume every first balance is final. Identify the document, confirm processing, and keep a dated record.</p></div>
            <ul className="space-y-3 rounded-3xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
              {["Do not enter names, diagnoses, member IDs, claim numbers, account numbers, or other protected information.", "This system organizes questions and records; it does not decide coverage, coding, liability, collectibility, or what you owe.", "Use written notices, plan documents, hospital policies, and current official sources for final verification."].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="document-router" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Step 1" title="What document are you holding?" description="Choose the closest match for the first checks, common mistakes, questions, and safest next action." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documentRoutes.map((item) => {
              const Icon = item.icon;
              const active = routeId === item.id;
              return <button key={item.id} type="button" aria-pressed={active} onClick={() => chooseRoute(item.id)} className={`min-h-44 rounded-3xl border p-5 text-left shadow-card transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? "border-primary bg-primary-soft/40" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"}`}><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-display text-lg font-bold leading-tight">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.short}</p></button>;
            })}
          </div>

          {route && <article id="document-result" aria-live="polite" className="mt-8 scroll-mt-24 rounded-[2rem] border border-primary/25 bg-card p-5 shadow-hover md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-primary">Document classification</div><h2 className="mt-2 font-display text-3xl font-bold">{route.title}</h2><p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">What it generally is:</strong> {route.classification}</p><p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">What it is not:</strong> {route.not}</p></div><Button type="button" variant="outline" onClick={print}><Printer className="h-4 w-4" /> Print or save result</Button></div>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">First three checks</CardTitle></CardHeader><CardContent><ol className="space-y-3 text-sm text-muted-foreground">{route.checks.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{item}</li>)}</ol></CardContent></Card>
              <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">Common mistakes</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm text-muted-foreground">{route.mistakes.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}</ul></CardContent></Card>
              <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">Questions to ask</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm text-muted-foreground">{route.questions.map((item) => <li key={item} className="flex gap-2"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></CardContent></Card>
            </div>
            <div className="mt-6 rounded-3xl border border-primary/20 bg-primary-soft/30 p-5"><div className="text-xs font-bold uppercase tracking-[.14em] text-primary">Safest next action</div><p className="mt-2 font-semibold">{route.next}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero"><Link to={route.href}>{route.cta} <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild variant="outline"><a href={route.official} target="_blank" rel="noreferrer" onClick={() => trackOfficial(route.id)}>{route.officialLabel} <ExternalLink className="h-4 w-4" /></a></Button></div></div>
          </article>}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] shadow-card"><CardHeader><ClipboardCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl md:text-3xl">Before you pay</CardTitle><CardDescription>Stop at the first point where the documents stop matching.</CardDescription></CardHeader><CardContent><ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">{beforePay.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{item}</li>)}</ol></CardContent></Card>
          <div><SectionHeading eyebrow="What the numbers mean" title="Common billing patterns" description="Several documents can be legitimate and still require reconciliation." /><div className="grid gap-4 sm:grid-cols-2">{patterns.map(([title, body]) => <div key={title} className="rounded-3xl border border-border bg-card p-5 shadow-card"><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}</div></div>
        </section>

        <MedicalBillCaseDashboard />

        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><Download className="h-7 w-7 text-primary" /><h2 className="mt-4 font-display text-3xl font-bold">Medical Bill Response Pack</h2><p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">Open the printable first-15-minute checklist, EOB-to-bill worksheet, call log, itemized-bill request script, assistance checklist, denial organizer, deadline tracker, and questions-before-paying sheet.</p><p className="mt-3 text-xs text-muted-foreground">Free, advertisement-free, and designed for paper or browser print/save-as-PDF.</p></div><div className="flex flex-col gap-3"><Button asChild variant="hero" size="lg"><a href="/downloads/medical-bill-response-pack.html" onClick={() => trackSiteEvent("response_pack_download", { event_category: "medical_bill", asset_id: "medical_bill_response_pack" })}><Download className="h-4 w-4" /> Open printable pack</a></Button><Button asChild variant="outline" size="lg"><Link to="/newsletter" onClick={() => { trackSiteEvent("medical_bill_email_signup", { event_category: "medical_bill", entry_surface: "response_system" }); trackSiteEvent("premium_pack_interest", { event_category: "medical_bill", offer_id: "response_pack_updates" }); }}><Mail className="h-4 w-4" /> Get toolkit updates</Link></Button></div></div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="rounded-[2rem] shadow-card"><CardHeader><Stethoscope className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl">RN perspective</CardTitle></CardHeader><CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground"><p>Clinical care, discharge planning, insurance processing, and billing often move through different teams on different timelines. A patient may leave with a clinical plan and receive separate administrative documents days or weeks later.</p><p>That fragmentation makes document organization essential: identify each document, determine who owns the next action, and keep a dated record until the claim and account status align.</p><p className="text-xs">Andrew Ciccarelli, BSN, RN contributes bedside and discharge-process perspective. Billing and coverage guidance is anchored to official sources.</p></CardContent></Card>
          <div><SectionHeading eyebrow="Official verification" title="Use the written notice and controlling source" description="A general guide cannot replace plan documents, hospital policies, state rules, or an official determination." /><div className="grid gap-4 md:grid-cols-2">{officialSources.map(([title, href]) => { const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "_"); return <a key={href} href={href} target="_blank" rel="noreferrer" onClick={() => trackOfficial(id)} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:border-primary/30"><Landmark className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">{title}</h3><div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open official source <ExternalLink className="h-4 w-4" /></div></a>; })}</div></div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-2"><div><div className="font-bold text-foreground">Author and review</div><p className="mt-2">Andrew Ciccarelli, BSN, RN. Published July 2026. Last source review: July 20, 2026, against linked CMS, HealthCare.gov, IRS, Medicare, and CFPB materials.</p></div><div><div className="font-bold text-foreground">Review scope and limits</div><p className="mt-2">Reviewed for patient-education clarity and consistency with linked official guidance. Not reviewed for state-specific legal advice. This page does not decide coverage, coding, medical necessity, liability, collectibility, appeal success, or what a person owes.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-5 text-xs"><Link className="font-semibold text-primary hover:underline" to="/methodology">Sources and methodology</Link><Link className="font-semibold text-primary hover:underline" to="/editorial-policy">Editorial policy</Link><Link className="font-semibold text-primary hover:underline" to="/disclosures">Disclosures</Link><Link className="font-semibold text-primary hover:underline" to="/contact">Corrections and contact</Link></div>
        </section>
      </main>
    </>
  );
};

export default MedicalBillReviewToolkitPage;
