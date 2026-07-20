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
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MedicalBillCaseDashboard } from "@/components/medical-bill-case-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

const documentRoutes = [
  {
    id: "eob",
    title: "Explanation of Benefits",
    short: "Usually an insurer explanation, not a request for payment.",
    icon: FileCheck2,
    whatItIs: "A claim-processing explanation from a health plan showing what was billed, what the plan allowed or paid, and what may be assigned to you.",
    whatItIsNot: "It is generally not the provider's bill, even when it shows a patient-responsibility amount.",
    checks: [
      "Confirm the date of service and provider match the care you received.",
      "Find the claim status, allowed amount, plan payment, and patient responsibility.",
      "Wait for or locate the matching provider bill before paying from the EOB alone.",
    ],
    mistakes: ["Paying from the EOB instead of the provider bill.", "Assuming a pending or denied claim is the final outcome."],
    questions: ["Has the provider sent a matching bill?", "Does the provider balance equal the EOB patient responsibility?"],
    nextAction: "Match the EOB to the provider bill line by line.",
    internalHref: "/tools/eob-to-bill-match-checker",
    internalLabel: "Use the EOB-to-Bill Match Checker",
    officialHref: "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
    officialLabel: "CMS EOB guide",
  },
  {
    id: "hospital_bill",
    title: "Hospital or facility bill",
    short: "A bill for the facility, supplies, and services billed by the hospital organization.",
    icon: Receipt,
    whatItIs: "A request for payment from a hospital or facility. It may be only one of several bills from the same visit.",
    whatItIsNot: "It may not include physician, anesthesia, laboratory, imaging, ambulance, or other professional charges.",
    checks: [
      "Confirm the insurer or program has processed the related claim.",
      "Compare the bill's patient balance with the EOB or Medicare Summary Notice.",
      "Request an itemized bill and the written financial-assistance policy when needed.",
    ],
    mistakes: ["Assuming one hospital visit creates only one bill.", "Starting a long payment plan before checking financial assistance."],
    questions: ["Which services and clinicians are included in this bill?", "Can the account be held while a review or assistance application is pending?"],
    nextAction: "Use the guided bill-review flow before treating the first balance as final.",
    internalHref: "/tools/medical-bill-review-flow",
    internalLabel: "Start the guided bill review",
    officialHref: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS nonprofit-hospital requirements",
  },
  {
    id: "professional_bill",
    title: "Physician or professional bill",
    short: "A separate bill from a physician group or other professional who participated in the visit.",
    icon: Stethoscope,
    whatItIs: "A professional-services bill that can arrive separately from the hospital or facility bill.",
    whatItIsNot: "A separate bill does not automatically mean it is a duplicate; confirm the billing entity and service first.",
    checks: [
      "Identify the billing group and the service date.",
      "Find the matching claim on the EOB or plan portal.",
      "Check network processing and whether the amount matches the payer explanation.",
    ],
    mistakes: ["Calling the hospital about a bill owned by an independent group.", "Assuming an unfamiliar group name means the charge is fraudulent."],
    questions: ["What service does this billing group say it provided?", "Which claim or EOB entry matches this bill?"],
    nextAction: "Identify the owner of the bill, then compare it with the payer explanation.",
    internalHref: "/articles/why-one-hospital-visit-can-create-multiple-bills",
    internalLabel: "See why one visit creates multiple bills",
    officialHref: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "denial",
    title: "Denial or prior-authorization notice",
    short: "A written decision that usually includes a reason, instructions, and a deadline.",
    icon: AlertTriangle,
    whatItIs: "A notice explaining why a claim, service, medication, or authorization was not approved as submitted.",
    whatItIsNot: "It is not always the final possible decision, but available review or appeal rights depend on the plan and notice.",
    checks: [
      "Read the exact reason code and plain-language explanation.",
      "Locate the appeal, reconsideration, or external-review deadline.",
      "Ask what documentation or authorization is missing and who must submit it.",
    ],
    mistakes: ["Calling before reading the written reason.", "Using a generic appeal letter without following the notice's process."],
    questions: ["What exact evidence or administrative step is missing?", "What submission method and deadline does the notice require?"],
    nextAction: "Organize the notice, deadline, and provider-plan questions before responding.",
    internalHref: "/tools/prior-authorization-next-step-guide",
    internalLabel: "Build a denial or authorization plan",
    officialHref: "https://www.healthcare.gov/appeal-insurance-company-decision/",
    officialLabel: "HealthCare.gov appeals overview",
  },
  {
    id: "assistance",
    title: "Financial-assistance paperwork",
    short: "An application or policy for reducing eligible hospital charges based on the hospital's rules.",
    icon: ClipboardCheck,
    whatItIs: "A hospital-specific process that may evaluate income, household, insurance status, service type, or other eligibility factors.",
    whatItIsNot: "It is not a universal guarantee, and hospital policies may not cover every professional bill from the same visit.",
    checks: [
      "Request the written policy and plain-language summary.",
      "Confirm which hospital entities and services are covered.",
      "List required documents, submission instructions, and review timelines.",
    ],
    mistakes: ["Assuming insurance makes you ineligible without reading the policy.", "Submitting documents without keeping a dated copy."],
    questions: ["Will collection activity pause while the application is reviewed?", "Can assistance apply to recently paid or collection accounts?"],
    nextAction: "Gather the written policy, application, required documents, and account-hold instructions.",
    internalHref: "/articles/check-hospital-financial-assistance-before-paying",
    internalLabel: "Open the financial-assistance guide",
    officialHref: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS Section 501(r) information",
  },
  {
    id: "collections",
    title: "Collections letter or warning",
    short: "A time-sensitive notice about an unpaid balance or collection activity.",
    icon: PhoneCall,
    whatItIs: "A notice that a provider or collection company says a balance remains unpaid.",
    whatItIsNot: "It does not remove the need to verify the original bill, insurance processing, disputes, assistance status, and the collector's written information.",
    checks: [
      "Identify the original creditor and account status without sharing unnecessary medical details.",
      "Gather prior EOBs, bills, disputes, assistance applications, and written responses.",
      "Read every deadline and verify current consumer-rights information.",
    ],
    mistakes: ["Ignoring a legitimate written deadline.", "Discussing sensitive medical details when only account verification is needed."],
    questions: ["What original balance and creditor does the notice identify?", "Is a billing review, appeal, or assistance request still unresolved?"],
    nextAction: "Verify the account and preserve every written record before choosing a response.",
    internalHref: "/tools/medical-bill-review-flow",
    internalLabel: "Organize the collection-related bill review",
    officialHref: "https://www.consumerfinance.gov/consumer-tools/medical-debt/",
    officialLabel: "CFPB medical-debt resources",
  },
  {
    id: "mismatch",
    title: "Several documents do not match",
    short: "The EOB, bill, portal, or separate provider documents tell different stories.",
    icon: Scale,
    whatItIs: "A document-reconciliation problem that may involve timing, claim processing, network status, adjustments, or different billing entities.",
    whatItIsNot: "A mismatch does not by itself prove an error or determine what is owed.",
    checks: [
      "Line up service dates, billing entities, claim references, and patient-responsibility amounts.",
      "Confirm whether each claim is processed, pending, adjusted, or denied.",
      "Ask the organization that owns the inconsistent number for a written explanation.",
    ],
    mistakes: ["Comparing unrelated claim lines.", "Calling multiple organizations without documenting who owns the next action."],
    questions: ["Which exact line or amount conflicts?", "Is the mismatch caused by timing or a final processed decision?"],
    nextAction: "Use the comparison checker and save a structured case summary.",
    internalHref: "/tools/eob-to-bill-match-checker",
    internalLabel: "Compare the EOB and bill",
    officialHref: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "no_document",
    title: "No document yet",
    short: "You are preparing before a bill or EOB arrives.",
    icon: FileQuestion,
    whatItIs: "A preparation stage where you can organize expected providers, insurance information, estimates, and contact details.",
    whatItIsNot: "An estimate or verbal quote is not always the final processed patient responsibility.",
    checks: [
      "Save any estimate, authorization, referral, and network confirmation.",
      "Ask which facility and professional groups may bill separately.",
      "Know where to find the plan's EOBs and the provider's billing contact.",
    ],
    mistakes: ["Relying on a verbal estimate without saving written details.", "Assuming every clinician at a facility shares the same network status."],
    questions: ["Which organizations may send separate claims or bills?", "What written estimate or coverage information is available now?"],
    nextAction: "Prepare a simple record folder and review the first payer document before paying a provider balance.",
    internalHref: "/articles/questions-to-ask-before-a-medical-appointment-cost",
    internalLabel: "Prepare for medical costs",
    officialHref: "https://www.cms.gov/medical-bill-rights/help/guides/good-faith-estimate",
    officialLabel: "CMS good-faith-estimate guide",
  },
] as const;

const beforePaySteps = [
  "Identify the document before acting on it.",
  "Match the patient, date of service, provider, and service description.",
  "Confirm the insurer, Medicare, Medicaid, or plan processed the claim.",
  "Compare billed charge, allowed amount, adjustments, plan payment, and patient responsibility.",
  "Separate facility charges from professional, lab, imaging, anesthesia, pathology, and ambulance charges.",
  "Request an itemized bill when the balance is large, unclear, or unexpected.",
  "Check network and current surprise-billing protections when relevant.",
  "Check hospital financial assistance before committing to a long payment plan or high-interest debt.",
  "Organize any denial reason, appeal instruction, and deadline exactly as written.",
  "Record dates, departments, reference numbers, promises, and follow-up deadlines.",
];

const billingPatterns = [
  ["One visit, several bills", "A hospital, physician group, laboratory, imaging group, anesthesia group, pathology group, or ambulance service may bill separately."],
  ["Billed charge vs. allowed amount", "The billed charge is the provider's submitted amount. The allowed amount is the plan's recognized amount for a covered service under its rules."],
  ["EOB vs. provider bill", "The payer explanation describes claim processing. The provider bill requests payment. Compare them before paying."],
  ["Deductible, copay, coinsurance", "These are different forms of cost sharing. The EOB should show how the plan assigned the processed claim."],
  ["Pending, denied, adjusted", "A pending claim is not final. A denial needs the written reason and instructions. An adjustment may change the provider's submitted charge."],
  ["Contractual adjustment", "For an in-network processed claim, the provider bill should generally reflect the plan's processing and applicable contractual adjustments."],
] as const;

const escalationPaths = [
  ["Provider billing office", "Itemized bill, duplicate or missing charge detail, account hold, correction, payment status."],
  ["Insurer or plan member services", "Claim status, allowed amount, network processing, denial reason, appeal instructions."],
  ["Hospital financial-assistance office", "Written policy, application, required documents, covered entities, account-hold process."],
  ["Ordering or treating office", "Prior authorization, referral, medical-necessity documentation, resubmission ownership."],
  ["Employer benefits or plan administrator", "Employer-plan documents, eligibility, administrator contacts, escalation pathways."],
  ["State insurance regulator", "State-regulated plan complaints and state-specific consumer-assistance routing."],
  ["CMS, HealthCare.gov, or CFPB", "Federal medical-bill rights, applicable appeal information, and medical-debt consumer resources."],
] as const;

const officialResources = [
  ["CMS - Medical Bill Rights", "Federal information about surprise bills, good-faith estimates, complaints, and dispute pathways.", "https://www.cms.gov/medical-bill-rights"],
  ["CMS - Explanation of Benefits", "A plain-language guide to reading an EOB and comparing it with a bill.", "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits"],
  ["HealthCare.gov - Appeals", "Official overview of internal appeals and external review for applicable health plans.", "https://www.healthcare.gov/appeal-insurance-company-decision/"],
  ["IRS - Tax-exempt hospitals", "Federal information about Section 501(r) financial-assistance and billing requirements.", "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r"],
  ["CFPB - Medical debt", "Current consumer-finance information about medical debt, collections, credit reports, and disputes.", "https://www.consumerfinance.gov/consumer-tools/medical-debt/"],
  ["Medicare.gov - Appeals", "Official Medicare appeal pathways and notice-based instructions.", "https://www.medicare.gov/claims-appeals/how-do-i-file-an-appeal"],
] as const;

const MedicalBillReviewToolkitPage = () => {
  const [selectedId, setSelectedId] = useState<(typeof documentRoutes)[number]["id"] | null>(null);
  const selectedRoute = useMemo(() => documentRoutes.find((route) => route.id === selectedId) ?? null, [selectedId]);

  useSeo({
    title: "Medical Bill Response System",
    description: "Identify an EOB, hospital bill, professional bill, denial, assistance form, or collection notice; then follow a private, RN-led review sequence before paying.",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
  });

  useEffect(() => {
    trackSiteEvent("medical_bill_hub_view", { event_category: "medical_bill", entry_surface: "response_system" });
  }, []);

  const chooseRoute = (id: (typeof documentRoutes)[number]["id"]) => {
    setSelectedId(id);
    trackSiteEvent("document_router_start", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("document_router_result_type", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("document_router_complete", { event_category: "medical_bill", route_type: id });
    trackSiteEvent("tool_completion", { event_category: "medical_bill", tool_id: "document_router" });
    window.requestAnimationFrame(() => document.getElementById("document-result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const trackPack = () => trackSiteEvent("response_pack_download", { event_category: "medical_bill", asset_id: "medical_bill_response_pack" });
  const trackPrint = () => {
    trackSiteEvent("print_or_save_action", { event_category: "medical_bill", action_type: "page_print" });
    window.print();
  };
  const trackOfficial = (resourceId: string) => trackSiteEvent("official_source_click", { event_category: "medical_bill", resource_id: resourceId });
  const trackEmail = () => {
    trackSiteEvent("medical_bill_email_signup", { event_category: "medical_bill", entry_surface: "response_system" });
    trackSiteEvent("premium_pack_interest", { event_category: "medical_bill", offer_id: "response_pack_updates" });
  };

  return (
    <>
      <PageHero
        eyebrow="RN-led healthcare money navigation"
        title="Medical Bill Response System"
        description="Identify the document, check the claim story, organize the next call, and use the correct official source before treating a balance as final."
      >
        <Button asChild variant="hero" size="lg"><a href="#document-router">Identify my document <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="/downloads/medical-bill-response-pack.pdf" download onClick={trackPack}><Download className="h-4 w-4" /> Download response pack</a></Button>
      </PageHero>

      <main className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">Start with the document, not the dollar amount.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                An EOB is generally not a bill. A first provider balance may arrive before every claim or adjustment is complete. Do not ignore a legitimate deadline, but do not assume every first document is a final determination. Keep copies and record every call.
              </p>
            </div>
            <ul className="space-y-3 rounded-3xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground md:p-6">
              {[
                "Do not enter names, diagnoses, member IDs, claim numbers, account numbers, or other protected information into this site.",
                "This system organizes questions and documents; it does not decide coverage, coding, legal liability, or what you owe.",
                "Use the written notice, plan documents, hospital policy, and current official sources for final verification.",
              ].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="document-router" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Step 1" title="What document are you holding?" description="Choose the closest match. The result gives the first checks, common mistakes, questions to ask, and the safest next action." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documentRoutes.map((route) => {
              const Icon = route.icon;
              const active = selectedId === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseRoute(route.id)}
                  className={`min-h-44 rounded-3xl border p-5 text-left shadow-card transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? "border-primary bg-primary-soft/40" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-tight text-foreground">{route.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{route.short}</p>
                </button>
              );
            })}
          </div>

          {selectedRoute && (
            <article id="document-result" className="mt-8 scroll-mt-24 rounded-[2rem] border border-primary/25 bg-card p-5 shadow-hover md:p-8" aria-live="polite">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Document classification</div>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">{selectedRoute.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base"><strong className="text-foreground">What it generally is:</strong> {selectedRoute.whatItIs}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base"><strong className="text-foreground">What it is not:</strong> {selectedRoute.whatItIsNot}</p>
                </div>
                <Button type="button" variant="outline" onClick={trackPrint}><Printer className="h-4 w-4" /> Print or save result</Button>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">First three checks</CardTitle></CardHeader><CardContent><ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">{selectedRoute.checks.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{item}</li>)}</ol></CardContent></Card>
                <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">Common mistakes</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">{selectedRoute.mistakes.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}</ul></CardContent></Card>
                <Card className="rounded-3xl"><CardHeader><CardTitle className="font-display text-xl">Questions to ask</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">{selectedRoute.questions.map((item) => <li key={item} className="flex gap-2"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></CardContent></Card>
              </div>

              <div className="mt-6 rounded-3xl border border-primary/20 bg-primary-soft/30 p-5 md:p-6">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Safest next action</div>
                <p className="mt-2 text-base font-semibold leading-relaxed text-foreground">{selectedRoute.nextAction}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="hero"><Link to={selectedRoute.internalHref}>{selectedRoute.internalLabel} <ArrowRight className="h-4 w-4" /></Link></Button>
                  <Button asChild variant="outline"><a href={selectedRoute.officialHref} target="_blank" rel="noreferrer" onClick={() => trackOfficial(selectedRoute.id)}>{selectedRoute.officialLabel} <ExternalLink className="h-4 w-4" /></a></Button>
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] shadow-card">
            <CardHeader><ClipboardCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl md:text-3xl">Before you pay</CardTitle><CardDescription>Use this sequence in order. Stop and clarify the first point where the documents stop matching.</CardDescription></CardHeader>
            <CardContent><ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">{beforePaySteps.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{item}</li>)}</ol></CardContent>
          </Card>
          <div>
            <SectionHeading eyebrow="What the numbers mean" title="Common billing patterns" description="These distinctions explain why several documents can be correct yet still require reconciliation." />
            <div className="grid gap-4 sm:grid-cols-2">
              {billingPatterns.map(([title, body]) => <div key={title} className="rounded-3xl border border-border bg-card p-5 shadow-card"><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
            </div>
          </div>
        </section>

        <MedicalBillCaseDashboard />

        <section className="rounded-[2rem] border border-border bg-muted/25 p-5 md:p-8">
          <SectionHeading centered eyebrow="Escalation map" title="Contact the organization that owns the next action" description="Ask for written explanations and preserve reference numbers. Do not send protected health information unless the organization securely requires it for its official process." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {escalationPaths.map(([title, body]) => <div key={title} className="rounded-3xl border border-border bg-card p-5"><PhoneCall className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Download className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Medical Bill Response Pack</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">Print the first-15-minute checklist, EOB-to-bill worksheet, call log, itemized-bill request script, financial-assistance checklist, denial organizer, deadline tracker, and questions-before-paying sheet. The worksheets intentionally avoid prompts for protected health information.</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Free, advertisement-free, and designed for paper or local PDF storage.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild variant="hero" size="lg"><a href="/downloads/medical-bill-response-pack.pdf" download onClick={trackPack}><Download className="h-4 w-4" /> Download free PDF</a></Button>
              <Button asChild variant="outline" size="lg"><Link to="/newsletter" onClick={trackEmail}><Mail className="h-4 w-4" /> Get future toolkit updates</Link></Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="rounded-[2rem] shadow-card">
            <CardHeader><Stethoscope className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl">RN perspective</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>During a hospital stay, clinical care, discharge planning, insurance processing, and billing frequently move through different teams on different timelines. Patients may leave with a clear clinical plan but still receive separate administrative documents days or weeks later.</p>
              <p>That fragmentation is why document organization matters. The safest workflow is to identify each document, determine which organization owns the next action, and keep a dated record until the written claim and account status align.</p>
              <p className="text-xs">Andrew Ciccarelli, BSN, RN contributes bedside and discharge-process perspective. Factual billing and coverage guidance is anchored to official sources.</p>
            </CardContent>
          </Card>
          <div>
            <SectionHeading eyebrow="Official verification" title="Use the written notice and current controlling source" description="A general guide cannot replace plan documents, hospital policies, state rules, or an official determination." />
            <div className="grid gap-4 md:grid-cols-2">
              {officialResources.map(([title, body, href]) => {
                const resourceId = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 60);
                return <a key={href} href={href} target="_blank" rel="noreferrer" onClick={() => trackOfficial(resourceId)} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover"><Landmark className="h-5 w-5 text-primary" /><h3 className="mt-3 font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p><div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open official source <ExternalLink className="h-4 w-4" /></div></a>;
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div><div className="font-bold text-foreground">Author and review</div><p className="mt-2">Andrew Ciccarelli, BSN, RN. Published July 2026. Last updated and source-reviewed July 20, 2026 against current CMS, HealthCare.gov, IRS, Medicare, and CFPB materials.</p></div>
            <div><div className="font-bold text-foreground">Review scope and limits</div><p className="mt-2">Reviewed for patient-education clarity and consistency with linked official guidance. Not reviewed for state-specific legal advice. This page does not decide coverage, coding, medical necessity, legal liability, collectibility, appeal success, or what a person owes.</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 text-xs"><Link className="font-semibold text-primary hover:underline" to="/methodology">Sources and methodology</Link><Link className="font-semibold text-primary hover:underline" to="/editorial-policy">Editorial policy</Link><Link className="font-semibold text-primary hover:underline" to="/disclosures">Disclosures</Link><Link className="font-semibold text-primary hover:underline" to="/contact">Corrections and contact</Link></div>
        </section>
      </main>
    </>
  );
};

export default MedicalBillReviewToolkitPage;
