import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileCheck2,
  FileQuestion,
  FileText,
  Landmark,
  Pencil,
  PhoneCall,
  Printer,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Trash2,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import {
  CONTACT_TYPES,
  DOCUMENT_TYPES,
  MEDICAL_BILL_TRACKER_STORAGE_KEY,
  OUTCOME_TYPES,
  STATUS_TYPES,
  createMedicalBillTrackerEntry,
  exportMedicalBillTrackerText,
  parseMedicalBillTrackerEntries,
  sortMedicalBillTrackerEntries,
  type MedicalBillDocumentType,
  type MedicalBillTrackerDraft,
  type MedicalBillTrackerEntry,
} from "@/lib/medicalBillTracker";
import { useSeo } from "@/lib/seo";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const textareaClass =
  "min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelize = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("Eob Or Msn", "EOB or MSN");

const emptyDraft = (): MedicalBillTrackerDraft => ({
  contactDate: "",
  contactType: "provider_billing",
  departmentRole: "billing_office",
  representativeId: "",
  callReference: "",
  outcome: "information_received",
  documentsRequested: [],
  promisedAction: "send_document",
  expectedResponseDate: "",
  appealDeadline: "",
  followUpDate: "",
  status: "open",
});

const documentPaths = [
  {
    id: "provider_bill",
    title: "Medical bill",
    body: "Start by confirming insurance processed the claim and the amount matches the payer explanation.",
    href: "/tools/medical-bill-review-flow",
    cta: "Review the bill",
    icon: Receipt,
  },
  {
    id: "eob_or_msn",
    title: "EOB or Medicare Summary Notice",
    body: "Use the payer document to find the allowed amount, payment, denial language, and patient responsibility.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Match it to the bill",
    icon: FileCheck2,
  },
  {
    id: "denial_notice",
    title: "Denial or adverse-benefit notice",
    body: "Read the exact reason, deadline, and appeal instructions before choosing a response.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Find the next step",
    icon: AlertTriangle,
  },
  {
    id: "collection_notice",
    title: "Collection or past-due notice",
    body: "Verify the original balance, account status, prior disputes, assistance review, and written deadlines promptly.",
    href: "#call-tracker",
    cta: "Track contacts and dates",
    icon: CalendarClock,
  },
  {
    id: "estimate",
    title: "Estimate or good-faith estimate",
    body: "Compare the estimate with the final bill and use current CMS rights resources when the rules may apply.",
    href: "https://www.cms.gov/medical-bill-rights",
    cta: "Check official rights",
    icon: FileText,
    external: true,
  },
  {
    id: "not_sure",
    title: "Not sure what the document is",
    body: "Identify the sender, whether payment is requested, and whether the document says EOB, MSN, bill, denial, or collection notice.",
    href: "/tools/medical-bill-review-flow",
    cta: "Use the identification flow",
    icon: FileQuestion,
  },
] as const;

const problemPaths = [
  ["bill_eob_mismatch", "Bill does not match the EOB", "/tools/eob-to-bill-match-checker", "Compare patient responsibility, allowed amount, adjustments, and insurer payment."],
  ["insurance_not_processed", "Insurance has not processed the claim", "/tools/medical-bill-review-flow", "Confirm claim status before treating the provider balance as final."],
  ["multiple_bills", "Multiple bills arrived from one visit", "/articles/why-one-hospital-visit-can-create-multiple-bills", "Separate facility, physician, lab, imaging, anesthesia, pathology, and ambulance billing."],
  ["facility_fee", "A facility fee is confusing", "/articles/facility-fee-vs-professional-fee", "Understand institutional versus professional charges."],
  ["network_issue", "The hospital was in-network but a bill was not", "/articles/in-network-hospital-out-of-network-bills", "Review current surprise-billing protections and plan processing."],
  ["observation_status", "Observation versus inpatient status changed the cost", "/articles/observation-vs-inpatient-status", "Understand why hospital status can affect Medicare and plan cost-sharing."],
  ["prior_authorization", "Prior authorization is involved", "/tools/prior-authorization-next-step-guide", "Organize the notice, provider questions, plan questions, and deadline checks."],
  ["financial_hardship", "The balance is unaffordable", "/articles/check-hospital-financial-assistance-before-paying", "Check financial assistance and discounts before committing to a long payment arrangement."],
] as const;

const toolPaths = [
  {
    title: "Medical Bill Review Flow",
    use: "Use when you are unsure what document you have, who to call first, or what to request.",
    href: "/tools/medical-bill-review-flow",
    cta: "Organize the situation",
  },
  {
    title: "EOB-to-Bill Match Checker",
    use: "Use when you have both documents and want to compare the claim story before paying.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Compare the documents",
  },
  {
    title: "Out-of-Pocket Max Estimator",
    use: "Use when you want to understand remaining covered, in-network cost-sharing exposure for the plan year.",
    href: "/tools/out-of-pocket-max-estimator",
    cta: "Estimate plan-year exposure",
  },
  {
    title: "Prior Authorization Next-Step Guide",
    use: "Use when a delayed, pending, or denied authorization affects care or claim processing.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Build the authorization plan",
  },
] as const;

const officialResources = [
  {
    title: "CMS — Medical bill rights",
    body: "Federal information about surprise bills, good-faith estimates, complaints, and dispute pathways.",
    href: "https://www.cms.gov/medical-bill-rights",
  },
  {
    title: "CMS — No Surprises Act",
    body: "Federal protections for certain emergency and out-of-network services; not every unexpected bill is covered.",
    href: "https://www.cms.gov/nosurprises",
  },
  {
    title: "IRS — Requirements for tax-exempt hospitals",
    body: "Section 501(r) requirements covering financial-assistance policies, charge limits, and billing-and-collection practices.",
    href: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
  },
  {
    title: "HealthCare.gov — Appeal a plan decision",
    body: "Official overview of internal appeals and external review for applicable health plans.",
    href: "https://www.healthcare.gov/appeal-insurance-company-decision/",
  },
  {
    title: "Medicare.gov — File an appeal",
    body: "Official Medicare appeal pathways and notice-based instructions.",
    href: "https://www.medicare.gov/claims-appeals/how-do-i-file-an-appeal",
  },
  {
    title: "CFPB — Medical debt resources",
    body: "Current consumer-finance information about medical debt, collections, credit reports, and disputes.",
    href: "https://www.consumerfinance.gov/consumer-tools/medical-debt/",
  },
] as const;

const departmentOptions = [
  "billing_office",
  "claims_department",
  "member_services",
  "financial_assistance",
  "appeals_or_grievances",
  "collections",
  "employer_benefits",
  "government_help_desk",
  "other",
];

const promisedActions = [
  "send_document",
  "review_claim_or_bill",
  "correct_or_resubmit",
  "call_back",
  "mail_written_notice",
  "process_financial_assistance",
  "review_appeal_or_dispute",
  "no_commitment",
];

const MedicalBillReviewToolkitPage = () => {
  const [entries, setEntries] = useState<MedicalBillTrackerEntry[]>([]);
  const [draft, setDraft] = useState<MedicalBillTrackerDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useSeo({
    title: "Medical Bill Review Toolkit",
    description: "Review a medical bill against the EOB, allowed amount, insurance payment, network status, and financial assistance options before paying.",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
  });

  useEffect(() => {
    try {
      setEntries(parseMedicalBillTrackerEntries(window.localStorage.getItem(MEDICAL_BILL_TRACKER_STORAGE_KEY)));
    } catch {
      setEntries([]);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem(MEDICAL_BILL_TRACKER_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Local storage is optional. The rest of the toolkit remains usable without it.
    }
  }, [entries, hasLoaded]);

  const sortedEntries = useMemo(() => sortMedicalBillTrackerEntries(entries), [entries]);

  const trackPath = (itemId: string, destinationPath: string) => {
    trackSiteEvent("medical_bill_path_selected", {
      event_category: "medical_bill",
      item_id: itemId,
      destination_path: destinationPath,
    });
  };

  const resetDraft = () => {
    setDraft(emptyDraft());
    setEditingId(null);
  };

  const saveEntry = () => {
    const created = createMedicalBillTrackerEntry(draft);
    if (editingId) {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === editingId
            ? { ...created, id: entry.id, createdAt: entry.createdAt, updatedAt: new Date().toISOString() }
            : entry,
        ),
      );
      trackSiteEvent("medical_bill_tracker_updated", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker" });
    } else {
      setEntries((current) => [...current, created]);
      trackSiteEvent("medical_bill_tracker_created", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker" });
    }
    resetDraft();
  };

  const editEntry = (entry: MedicalBillTrackerEntry) => {
    setDraft({
      contactDate: entry.contactDate,
      contactType: entry.contactType,
      departmentRole: entry.departmentRole,
      representativeId: entry.representativeId,
      callReference: entry.callReference,
      outcome: entry.outcome,
      documentsRequested: entry.documentsRequested,
      promisedAction: entry.promisedAction,
      expectedResponseDate: entry.expectedResponseDate,
      appealDeadline: entry.appealDeadline,
      followUpDate: entry.followUpDate,
      status: entry.status,
    });
    setEditingId(entry.id);
    document.getElementById("tracker-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (editingId === id) resetDraft();
    trackSiteEvent("medical_bill_tracker_deleted", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker" });
  };

  const copyTracker = async () => {
    try {
      await navigator.clipboard.writeText(exportMedicalBillTrackerText(entries));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      trackSiteEvent("medical_bill_tracker_exported", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker", export_type: "copy" });
    } catch {
      setCopied(false);
    }
  };

  const clearTracker = () => {
    if (!window.confirm("Clear every locally saved tracker entry on this device?")) return;
    setEntries([]);
    resetDraft();
    trackSiteEvent("medical_bill_tracker_cleared", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker" });
  };

  const toggleDocument = (document: MedicalBillDocumentType) => {
    setDraft((current) => ({
      ...current,
      documentsRequested: current.documentsRequested.includes(document)
        ? current.documentsRequested.filter((item) => item !== document)
        : [...current.documentsRequested, document],
    }));
  };

  return (
    <>
      <PageHero
        eyebrow="Medical bills"
        title="Review a medical bill before treating the first balance as final."
        description="Confirm the claim was processed, compare the bill with the EOB or Medicare notice, request missing detail, identify the exact problem, and document every next step."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#start-here">Start the review</a></Button>
          <Button asChild variant="outline"><Link to="/tools/medical-bill-review-flow">Use the guided flow</Link></Button>
          <Button asChild variant="outline"><a href="#call-tracker">Track calls and deadlines</a></Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm"><AlertTriangle className="h-6 w-6" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold text-amber-950">Do not ignore a legitimate deadline—but do not assume every first bill is ready to pay.</h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-amber-950/80 md:text-base">
                Bills, EOBs, Medicare Summary Notices, denials, estimates, and collection notices do different jobs. Confirm what the document is, whether the payer processed the claim, what the written notice says, and whether financial assistance or an appeal deadline matters. This toolkit organizes the review; it does not determine coverage, coding correctness, legal liability, or whether a balance is officially owed.
              </p>
            </div>
          </div>
        </section>

        <section id="start-here" className="scroll-mt-24">
          <SectionHeading centered eyebrow="First decision" title="What did you receive?" description="Choose the closest document or situation. Each path leads to a different first action." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentPaths.map((item) => {
              const Icon = item.icon;
              const className = "group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover md:p-6";
              const content = (
                <>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
                  <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">{item.cta} {item.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</div>
                </>
              );

              return item.external ? (
                <a key={item.id} className={className} href={item.href} target="_blank" rel="noreferrer" onClick={() => trackPath(item.id, item.href)}>{content}</a>
              ) : item.href.startsWith("#") ? (
                <a key={item.id} className={className} href={item.href} onClick={() => trackPath(item.id, item.href)}>{content}</a>
              ) : (
                <Link key={item.id} className={className} to={item.href} onClick={() => trackPath(item.id, item.href)}>{content}</Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <ClipboardCheck className="mb-2 h-6 w-6 text-primary" />
              <CardTitle className="font-display text-2xl">The minimum review before paying</CardTitle>
              <CardDescription>Work in this order. Stop and get clarification when the documents do not tell the same story.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Gather the provider bill and every page of the payer explanation.",
                  "Confirm the patient, date of service, provider, and claim or account reference match.",
                  "Confirm insurance, Medicare, Medicaid, or the plan has processed the claim.",
                  "Compare billed charge, allowed amount, adjustments, plan payment, and patient responsibility.",
                  "Request an itemized bill when the balance is large, unclear, or unexpected.",
                  "Identify whether the issue is processing, network, authorization, denial, duplicate billing, or affordability.",
                  "Ask the correct organization for a written explanation or correction.",
                  "Check financial assistance before committing to a long payment arrangement for a hospital balance.",
                  "Write down every date, department, reference number, promise, and deadline.",
                  "Follow the written notice and verify appeal, dispute, payment, and collection deadlines.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span><span>{item}</span></li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div>
            <SectionHeading eyebrow="Problem paths" title="Go directly to the issue that does not line up" description="These pages stay separate because each answers a different question." />
            <div className="grid gap-3 sm:grid-cols-2">
              {problemPaths.map(([id, title, href, body]) => (
                <Link key={id} to={href} onClick={() => trackPath(id, href)} className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-smooth hover:border-primary/35 hover:shadow-card">
                  <h3 className="font-display text-lg font-bold leading-tight text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading centered eyebrow="Choose the right tool" title="The tools are connected, but they do different jobs" description="Start with the narrowest tool that matches the problem in front of you." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {toolPaths.map((tool) => (
              <Link key={tool.href} to={tool.href} onClick={() => trackPath(tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "_"), tool.href)} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover">
                <h3 className="font-display text-xl font-bold text-foreground">{tool.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.use}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">{tool.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/35 p-5 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <WalletCards className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Check hospital financial assistance before draining savings or using high-interest debt.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Tax-exempt hospitals subject to Internal Revenue Code section 501(r) must maintain financial-assistance and emergency-care policies, limit certain charges for eligible patients, and make reasonable efforts to determine eligibility before extraordinary collection actions. Eligibility and covered providers vary by hospital, so request the exact written policy and application.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero"><Link to="/articles/check-hospital-financial-assistance-before-paying">Open the assistance guide</Link></Button>
                <Button asChild variant="outline"><a href="https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r" target="_blank" rel="noreferrer">Verify IRS requirements <ExternalLink className="h-4 w-4" /></a></Button>
              </div>
            </div>
            <Card className="rounded-3xl bg-card shadow-card">
              <CardHeader><CardTitle className="font-display text-2xl">Questions for the billing office</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {[
                    "Can you send the written financial-assistance policy and plain-language summary?",
                    "Which hospital and professional bills are covered by the policy?",
                    "What income, household, residency, insurance, or service rules apply?",
                    "What documents are required, and can missing documents be added later?",
                    "Can the account be placed on hold while the application or billing review is pending?",
                    "Could assistance apply to a recently paid bill or an account already sent to collections?",
                  ].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="call-tracker" className="scroll-mt-24">
          <SectionHeading centered eyebrow="New local-only tool" title="Medical Bill Call and Deadline Tracker" description="Keep a structured paper trail without uploading a bill, EOB, diagnosis, claim number, member ID, or account number." />

          <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-950 md:p-6">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><p><strong>Private by design:</strong> entries stay in this browser's local storage. Typed fields are not sent to analytics. Use representative initials or a call-center ID, and enter only a call reference—not a claim, member, medical-record, or account number. Avoid diagnoses, procedure names, and personal medical notes.</p></div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <Card id="tracker-form" className="scroll-mt-28 rounded-3xl shadow-card">
              <CardHeader>
                <PhoneCall className="mb-2 h-6 w-6 text-primary" />
                <CardTitle className="font-display text-2xl">{editingId ? "Edit tracker entry" : "Add a tracker entry"}</CardTitle>
                <CardDescription>Use structured categories. Verify every date against the written notice or official portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-semibold">Contact date</span><input type="date" className={inputClass} value={draft.contactDate} onChange={(event) => setDraft((current) => ({ ...current, contactDate: event.target.value }))} /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Contact type</span><select className={inputClass} value={draft.contactType} onChange={(event) => setDraft((current) => ({ ...current, contactType: event.target.value as MedicalBillTrackerDraft["contactType"] }))}>{CONTACT_TYPES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</select></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Department or role</span><select className={inputClass} value={draft.departmentRole} onChange={(event) => setDraft((current) => ({ ...current, departmentRole: event.target.value }))}>{departmentOptions.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</select></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Representative initials or ID</span><input className={inputClass} value={draft.representativeId} maxLength={40} placeholder="Optional — no full name needed" onChange={(event) => setDraft((current) => ({ ...current, representativeId: event.target.value }))} /></label>
                  <label className="space-y-2 sm:col-span-2"><span className="text-sm font-semibold">Call reference</span><input className={inputClass} value={draft.callReference} maxLength={60} placeholder="Optional call reference only — not a claim, member, or account number" onChange={(event) => setDraft((current) => ({ ...current, callReference: event.target.value }))} /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Outcome</span><select className={inputClass} value={draft.outcome} onChange={(event) => setDraft((current) => ({ ...current, outcome: event.target.value as MedicalBillTrackerDraft["outcome"] }))}>{OUTCOME_TYPES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</select></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Promised next action</span><select className={inputClass} value={draft.promisedAction} onChange={(event) => setDraft((current) => ({ ...current, promisedAction: event.target.value }))}>{promisedActions.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</select></label>
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold">Documents requested</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {DOCUMENT_TYPES.map((document) => (
                      <label key={document} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/60 p-3 text-sm text-muted-foreground">
                        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border" checked={draft.documentsRequested.includes(document)} onChange={() => toggleDocument(document)} />
                        <span>{labelize(document)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-semibold">Expected response date</span><input type="date" className={inputClass} value={draft.expectedResponseDate} onChange={(event) => setDraft((current) => ({ ...current, expectedResponseDate: event.target.value }))} /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Appeal or dispute deadline</span><input type="date" className={inputClass} value={draft.appealDeadline} onChange={(event) => setDraft((current) => ({ ...current, appealDeadline: event.target.value }))} /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Follow-up date</span><input type="date" className={inputClass} value={draft.followUpDate} onChange={(event) => setDraft((current) => ({ ...current, followUpDate: event.target.value }))} /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold">Status</span><select className={inputClass} value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as MedicalBillTrackerDraft["status"] }))}>{STATUS_TYPES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</select></label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="button" onClick={saveEntry}>{editingId ? "Update entry" : "Save on this device"}</Button>
                  <Button type="button" variant="outline" onClick={resetDraft}><RotateCcw className="h-4 w-4" /> Reset form</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-card print:shadow-none">
              <CardHeader>
                <CalendarClock className="mb-2 h-6 w-6 text-primary" />
                <CardTitle className="font-display text-2xl">Your locally saved timeline</CardTitle>
                <CardDescription>{entries.length ? `${entries.length} structured ${entries.length === 1 ? "entry" : "entries"}, ordered by the next actionable date.` : "No entries yet. Add the first contact or deadline on the left."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">The tracker is empty. It will remain empty unless you choose to save an entry on this device.</div>
                ) : (
                  sortedEntries.map((entry) => (
                    <article key={entry.id} className="rounded-2xl border border-border bg-background/60 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{labelize(entry.contactType)} · {entry.contactDate || "Date not recorded"}</div>
                          <h3 className="mt-2 font-display text-lg font-bold">{labelize(entry.outcome)}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">Status: {labelize(entry.status)}</p>
                        </div>
                        <div className="flex gap-2 print:hidden">
                          <Button type="button" variant="outline" size="sm" onClick={() => editEntry(entry)}><Pencil className="h-4 w-4" /> Edit</Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeEntry(entry.id)}><Trash2 className="h-4 w-4" /> Delete</Button>
                        </div>
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        {entry.departmentRole && <div><dt className="font-semibold text-foreground">Department</dt><dd className="text-muted-foreground">{labelize(entry.departmentRole)}</dd></div>}
                        {entry.callReference && <div><dt className="font-semibold text-foreground">Call reference</dt><dd className="break-words text-muted-foreground">{entry.callReference}</dd></div>}
                        {entry.promisedAction && <div><dt className="font-semibold text-foreground">Promised action</dt><dd className="text-muted-foreground">{labelize(entry.promisedAction)}</dd></div>}
                        {entry.expectedResponseDate && <div><dt className="font-semibold text-foreground">Expected response</dt><dd className="text-muted-foreground">{entry.expectedResponseDate}</dd></div>}
                        {entry.appealDeadline && <div><dt className="font-semibold text-foreground">Appeal/dispute deadline</dt><dd className="font-semibold text-amber-800">{entry.appealDeadline}</dd></div>}
                        {entry.followUpDate && <div><dt className="font-semibold text-foreground">Follow up</dt><dd className="font-semibold text-primary">{entry.followUpDate}</dd></div>}
                      </dl>
                      {entry.documentsRequested.length > 0 && <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Documents:</strong> {entry.documentsRequested.map(labelize).join(", ")}</p>}
                    </article>
                  ))
                )}

                <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row print:hidden">
                  <Button type="button" variant="outline" disabled={!entries.length} onClick={copyTracker}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy timeline"}</Button>
                  <Button type="button" variant="outline" disabled={!entries.length} onClick={() => { window.print(); trackSiteEvent("medical_bill_tracker_exported", { event_category: "medical_bill", tool_id: "medical_bill_call_tracker", export_type: "print" }); }}><Printer className="h-4 w-4" /> Print or save PDF</Button>
                  <Button type="button" variant="outline" disabled={!entries.length} onClick={clearTracker}><Trash2 className="h-4 w-4" /> Clear local data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading centered eyebrow="Official verification" title="Use the written notice and current official source" description="A general guide cannot replace plan documents, hospital policies, state rules, or an official determination." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {officialResources.map((resource) => (
              <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent("medical_bill_official_resource_clicked", { event_category: "medical_bill", resource_id: resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 64), destination_url: resource.href })} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover">
                <Landmark className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{resource.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{resource.body}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Open official source <ExternalLink className="h-4 w-4" /></div>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground md:p-8">
          <strong className="text-foreground">Scope:</strong> Community Acquired Finance provides educational organization tools. This page does not decide whether a service is covered, medically necessary, coded correctly, protected by law, appealable, collectible, or payable. Verify urgent deadlines and account status with the written notice, provider, insurer or plan, Medicare, Medicaid, employer plan administrator, collection agency, government help desk, or a qualified professional.
        </section>
      </main>
    </>
  );
};

export default MedicalBillReviewToolkitPage;
