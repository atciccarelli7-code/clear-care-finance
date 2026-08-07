import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  hospitalFinancialAssistancePolicies,
  hospitalPolicyBySlug,
  type HospitalFinancialAssistancePolicy,
} from "@/data/hospitalFinancialAssistancePolicies";
import { trackSiteEvent } from "@/lib/analytics";
import { HHS_2026_POVERTY_GUIDELINES } from "@/lib/hospitalFinancialAssistance";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { useSeo } from "@/lib/seo";

const TOOL_ROUTE = "/tools/financial-assistance-checklist";
const NATIONAL_ROUTE = "/medical-bills/financial-assistance";
const NC_ROUTE = "/hospital-financial-assistance/north-carolina";
const REVIEW_DATE = "August 6, 2026";

const supportingResources = [
  { title: "Request and review an itemized hospital bill", href: "/tools/medical-bill-review-flow", description: "Organize charges, dates, providers, insurance processing, and questions before paying." },
  { title: "Compare an EOB with a provider bill", href: "/tools/eob-to-bill-match-checker", description: "Check whether the final patient responsibility matches the insurer's explanation." },
  { title: "Financial assistance before paying", href: "/articles/check-hospital-financial-assistance-before-paying", description: "Understand the difference between assistance, a payment plan, and a separately billing provider." },
  { title: "Facility fee versus professional fee", href: "/articles/facility-fee-vs-professional-fee", description: "Separate the hospital charge from clinician and ancillary bills." },
  { title: "Why one visit creates multiple bills", href: "/articles/why-one-hospital-visit-can-create-multiple-bills", description: "Map the facility, clinician, radiology, lab, anesthesia, and ambulance billing entities." },
  { title: "Medical Bill Response System", href: "/insurance/medical-bill-review-toolkit", description: "Use the broader bill-review path when the problem is not limited to financial assistance." },
];

const trackLanding = (surfaceId: string) => {
  trackSiteEvent("product_landing_view", {
    event_category: "decision_products",
    tool_id: "hospital-financial-assistance-finder",
    surface_id: surfaceId,
  });
};

const ToolCta = ({ label = "Find a hospital policy" }: { label?: string }) => (
  <Button asChild variant="hero" size="lg">
    <Link to={TOOL_ROUTE}>{label} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
  </Button>
);

const ResourceGrid = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {supportingResources.map((resource) => (
      <Link key={`${resource.href}-${resource.title}`} to={resource.href} onClick={() => trackSiteEvent("supporting_resource_clicked", { event_category: "decision_products", tool_id: "hospital-financial-assistance-finder", destination_path: resource.href })} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/35 hover:shadow-card">
        <div className="flex items-start justify-between gap-3">
          <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold">{resource.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      </Link>
    ))}
  </div>
);

const PolicyCard = ({ policy }: { policy: HospitalFinancialAssistancePolicy }) => {
  const free = Math.max(policy.freeCareThresholdFpl.insured ?? 0, policy.freeCareThresholdFpl.uninsured ?? 0);
  const discount = Math.max(policy.discountedCareThresholdFpl.insured ?? 0, policy.discountedCareThresholdFpl.uninsured ?? 0);
  return (
    <Link to={`/hospital-financial-assistance/${policy.slug}`} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/35 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Building2 className="h-5 w-5" aria-hidden="true" /></div>
        <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs font-bold text-muted-foreground">{policy.stateCode}</span>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{policy.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {free ? `Published free-care screening range through ${free}% FPG.` : discount ? `Published assistance screening range through ${discount}% FPG.` : "Current policy and application found; numerical threshold requires direct verification."}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Review policy details <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
    </Link>
  );
};

export const HospitalFinancialAssistanceHubPage = () => {
  useEffect(() => trackLanding("national_hub"), []);
  return (
    <>
      <PageHero eyebrow="Hospital bills · Source-backed decision product" title="Hospital Financial Assistance & Medical Bill Relief Finder" description="Find a hospital's official financial-assistance policy, compare a broad household-income range with published thresholds, and build a documentation and verification plan before paying or ignoring a large hospital bill.">
        <ToolCta label="Start the hospital finder" />
        <Button asChild variant="outline" size="lg"><Link to={NC_ROUTE}>North Carolina policies</Link></Button>
      </PageHero>

      <div className="container space-y-14 py-10 md:space-y-18 md:py-16">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">The answer near the top</p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">A large hospital bill should be checked against the hospital's current policy before it becomes high-interest debt.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">Many nonprofit hospital policies publish free-care, discounted-care, hardship, and application rules. The official policy can also say which facilities, services, and providers are excluded. The finder uses a broad, non-identifying income range and never states that a person definitively qualifies.</p>
          </div>
          <div className="grid gap-3">
            {[
              "Choose a state and hospital from the verified launch set.",
              "Use 2026 HHS poverty guidelines for a broad income-band comparison.",
              "Review missing information, provider exclusions, deadlines, and collection warnings.",
              "Open the official policy and application, then print or download the action plan.",
            ].map((item, index) => <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><p className="text-sm leading-relaxed text-muted-foreground">{item}</p></div>)}
          </div>
        </section>

        <section aria-labelledby="verified-policy-set">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Verified launch set</p>
            <h2 id="verified-policy-set" className="mt-2 font-display text-3xl font-bold">18 hospital and health-system policy records</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">Each published page below has an official source, retrieval date, material limitations, and a direct policy or application path. A page does not infer a missing threshold. Additional hospitals should be added only after the same review is completed.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hospitalFinancialAssistancePolicies.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div><ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" /><h2 className="mt-3 font-display text-xl font-bold">No eligibility promises</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The result says an entered range appears within a published band. The hospital makes the final determination.</p></div>
            <div><Search className="h-6 w-6 text-primary" aria-hidden="true" /><h2 className="mt-3 font-display text-xl font-bold">Missing terms stay missing</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Unknown deadlines, thresholds, provider participation, and hardship terms are shown as verification items.</p></div>
            <div><ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" /><h2 className="mt-3 font-display text-xl font-bold">No PHI collection</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The public finder does not ask for names, diagnoses, records, account numbers, Social Security numbers, or bill uploads.</p></div>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Supporting medical-bill actions</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Complete the bill review around the application</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">Financial assistance does not replace insurance processing, itemized-bill review, provider matching, appeal deadlines, or collection-response steps.</p>
          <div className="mt-7"><ResourceGrid /></div>
        </section>

        <section className="rounded-[2rem] border border-primary/25 bg-primary-soft/30 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Build the next action</p><h2 className="mt-2 font-display text-2xl font-bold">Use one question at a time, then verify every controlling term.</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">The action plan includes entered facts, a bounded policy finding, documents, questions, missing information, official links, sources, last-reviewed dates, and limitations.</p></div>
          <div className="mt-5 shrink-0 md:mt-0"><ToolCta label="Start the finder" /></div>
        </section>

        <section className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Sources and freshness:</strong> hospital terms come from the official policy, application, or financial-assistance page linked on each record. Federal screening math uses the <a className="font-bold text-primary underline-offset-4 hover:underline" href={HHS_2026_POVERTY_GUIDELINES.sourceUrl} target="_blank" rel="noreferrer">2026 HHS poverty guidelines</a>. Last reviewed {REVIEW_DATE}. Next scheduled review: January 2027, or earlier when a source changes.</p>
        </section>
      </div>
    </>
  );
};

export const NorthCarolinaFinancialAssistancePage = () => {
  const policies = hospitalFinancialAssistancePolicies.filter((policy) => policy.stateCode === "NC");
  useEffect(() => trackLanding("north_carolina_hub"), []);
  return (
    <>
      <PageHero eyebrow="North Carolina · Hospital financial assistance" title="North Carolina Hospital Financial Assistance Policies" description="Compare current official policy and application links for major North Carolina health systems, understand the statewide medical-debt protections, and build a hospital-specific action plan.">
        <ToolCta label="Check a North Carolina hospital" />
        <Button asChild variant="outline" size="lg"><Link to={NATIONAL_ROUTE}>National hub</Link></Button>
      </PageHero>
      <div className="container space-y-14 py-10 md:py-16">
        <section className="rounded-[2rem] border border-primary/25 bg-primary-soft/30 p-6 shadow-card md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Current statewide floor</p>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Participating North Carolina acute-care hospitals adopted standardized discounts for insured and uninsured residents.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-5"><div className="text-2xl font-bold text-foreground">100%</div><p className="mt-1 text-sm text-muted-foreground">discount below 200% FPG</p></div>
            <div className="rounded-2xl border border-border bg-background p-5"><div className="text-2xl font-bold text-foreground">At least 75%</div><p className="mt-1 text-sm text-muted-foreground">discount from 200–250% FPG</p></div>
            <div className="rounded-2xl border border-border bg-background p-5"><div className="text-2xl font-bold text-foreground">At least 50%</div><p className="mt-1 text-sm text-muted-foreground">discount from 250–300% FPG</p></div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">NCDHHS says all 99 eligible acute-care hospitals joined the medical-debt program. The current program also describes presumptive eligibility, debt-relief, credit-reporting, and collection protections. The exact bill, facility, service, residency, date, and hospital policy still require verification.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline"><a href="https://www.ncdhhs.gov/medicaldebt" target="_blank" rel="noreferrer">NCDHHS medical-debt program <ExternalLink className="h-4 w-4" /></a></Button>
            <Button asChild variant="outline"><a href="https://www.ncdhhs.gov/hospital-financial-assistance-policies/open" target="_blank" rel="noreferrer">NCDHHS hospital policy list <ExternalLink className="h-4 w-4" /></a></Button>
          </div>
        </section>

        <section>
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Reviewed system records</p><h2 className="mt-2 font-display text-3xl font-bold">Major North Carolina hospital systems</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">These pages add system-specific policy, application, provider, contact, documentation, hardship, and limitation details to the statewide rules.</p></div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{policies.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}</div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" /><h2 className="mt-3 font-display text-2xl font-bold">If a bill is already in collections</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Tell the hospital and collector that financial-assistance review is being requested. Ask what can be paused and get the answer in writing. Do not ignore a lawsuit, validation, appeal, or payment deadline while the application is pending.</p></div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><MapPin className="h-6 w-6 text-primary" aria-hidden="true" /><h2 className="mt-3 font-display text-2xl font-bold">If insurance processing is the problem</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">North Carolina Department of Insurance Consumer Services and Health Insurance Smart NC can help with regulated insurance questions, denials, and external review. Call 855-408-1212 or use the official NCDOI site.</p><a href="https://www.ncdoi.gov/contact/contact-ncdoi" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open NCDOI contact options <ExternalLink className="h-4 w-4" /></a></div>
        </section>

        <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Related actions</p><h2 className="mt-2 font-display text-3xl font-bold">Review the bill as well as the policy</h2><div className="mt-7"><ResourceGrid /></div></section>

        <section className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground"><p><strong className="text-foreground">Review record:</strong> Statewide program and eight major-system records reviewed {REVIEW_DATE}. Hospital pages disclose missing terms and link to controlling sources. Next scheduled review: January 2027, or earlier after an NCDHHS or hospital-policy change.</p></section>
      </div>
    </>
  );
};

const thresholdText = (policy: HospitalFinancialAssistancePolicy, type: "free" | "discounted") => {
  const thresholds = type === "free" ? policy.freeCareThresholdFpl : policy.discountedCareThresholdFpl;
  if (thresholds.insured === null && thresholds.uninsured === null) return "Not established in this record — verify directly";
  if (thresholds.insured === thresholds.uninsured) return `Through ${thresholds.insured}% FPG for the published screening category`;
  return `Insured: ${thresholds.insured === null ? "verify" : `${thresholds.insured}% FPG`}; uninsured: ${thresholds.uninsured === null ? "verify" : `${thresholds.uninsured}% FPG`}`;
};

const DetailList = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof CheckCircle2 }) => (
  <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
    <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Icon className="h-5 w-5 text-primary" aria-hidden="true" />{title}</h2>
    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{items.map((item) => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}</ul>
  </section>
);

export const HospitalFinancialAssistancePolicyPage = () => {
  const { hospitalSlug = "" } = useParams();
  const policy = hospitalPolicyBySlug.get(hospitalSlug);

  useSeo(policy ? {
    title: `${policy.name} Financial Assistance Policy & Income Limits`,
    description: `Review ${policy.name}'s official financial-assistance policy, published income ranges, application, documents, provider limits, contact information, and verification steps.`,
    canonicalPath: `/hospital-financial-assistance/${policy.slug}`,
    robots: "index, follow, max-image-preview:large",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Hospital Financial Assistance", item: `${SITE_URL}${NATIONAL_ROUTE}` },
        { "@type": "ListItem", position: 3, name: policy.name, item: `${SITE_URL}/hospital-financial-assistance/${policy.slug}` },
      ] },
      { "@context": "https://schema.org", "@type": "WebPage", name: `${policy.name} Financial Assistance Policy`, description: `Official-source review of ${policy.name}'s financial-assistance policy, application, income ranges, provider limits, and verification steps.`, url: `${SITE_URL}/hospital-financial-assistance/${policy.slug}`, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, dateModified: policy.sourceRetrievedAt },
    ],
  } : {
    title: "Hospital Policy Not Found",
    description: "Browse verified hospital financial-assistance policies.",
    canonicalPath: NATIONAL_ROUTE,
    robots: "noindex, nofollow",
  });

  useEffect(() => {
    if (policy) trackLanding(`policy_${policy.slug}`);
  }, [policy]);

  if (!policy) return <Navigate to={NATIONAL_ROUTE} replace />;

  const reviewLabel = policy.reviewStatus === "verified_primary_source" ? "Primary-source review complete" : "Direct verification required";
  return (
    <>
      <PageHero eyebrow={`${policy.state} · Hospital policy record`} title={`${policy.name} Financial Assistance Policy & Application`} description={`Use the official ${policy.name} policy and application links, review published income ranges and provider limitations, then build a qualified action plan. This page does not determine eligibility.`}>
        <ToolCta label={`Check ${policy.name}`} />
        <Button asChild variant="outline" size="lg"><a href={policy.applicationUrl} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent("application_clicked", { event_category: "decision_products", tool_id: "hospital-financial-assistance-finder", policy_id: policy.slug, surface_id: "policy_page" })}>Official application <ExternalLink className="h-4 w-4" /></a></Button>
      </PageHero>

      <div className="container space-y-12 py-10 md:py-16">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Policy at a glance">
          {[
            ["Free-care range", thresholdText(policy, "free")],
            ["Discounted-care range", thresholdText(policy, "discounted")],
            ["Insured patients", policy.insuredPatientsMayQualify === "yes" ? "May qualify under published terms" : policy.insuredPatientsMayQualify === "limited" ? "Limited circumstances — verify" : "Requires direct verification"],
            ["Review status", reviewLabel],
          ].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-2 text-sm font-bold leading-relaxed text-foreground">{value}</div></div>)}
        </section>

        {policy.stateCode === "NC" ? <section className="rounded-2xl border border-primary/25 bg-primary-soft/30 p-5 md:p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">North Carolina statewide program</p><h2 className="mt-2 font-display text-xl font-bold">Statewide participating-hospital discounts may be more important than an older or incomplete system summary.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">NCDHHS publishes a 100% discount below 200% FPG, at least 75% from 200–250%, and at least 50% from 250–300% for insured and uninsured North Carolina residents at participating acute-care hospitals. Verify that the facility, service, and bill fall within the current state program and hospital policy.</p><a href="https://www.ncdhhs.gov/medicaldebt" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Verify with NCDHHS <ExternalLink className="h-4 w-4" /></a></section> : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h2 className="font-display text-2xl font-bold">What the official source currently supports</h2><dl className="mt-5 space-y-4 text-sm">
            <div><dt className="font-bold text-foreground">Facilities covered</dt><dd className="mt-1 text-muted-foreground">{policy.facilitiesCovered.join(" ")}</dd></div>
            <div><dt className="font-bold text-foreground">Policy effective date</dt><dd className="mt-1 text-muted-foreground">{policy.policyEffectiveDate ?? "Not established in this record — verify current revision"}</dd></div>
            <div><dt className="font-bold text-foreground">Application deadline or lookback</dt><dd className="mt-1 text-muted-foreground">{policy.applicationDeadline ?? "No universal deadline verified from the source. Ask in writing."}</dd></div>
            <div><dt className="font-bold text-foreground">Presumptive eligibility</dt><dd className="mt-1 text-muted-foreground">{policy.presumptiveEligibility ?? "Not established in this record — ask whether the account was screened automatically."}</dd></div>
            <div><dt className="font-bold text-foreground">Hardship or catastrophic review</dt><dd className="mt-1 text-muted-foreground">{policy.hardshipProvision ?? "No specific hardship formula recorded — request the current policy term."}</dd></div>
          </dl></div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h2 className="font-display text-2xl font-bold">Contact and submit</h2><div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><strong className="text-foreground">Financial counseling phone</strong><br />{policy.phone ?? "Not verified — use the official policy page"}</div></div>
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><strong className="text-foreground">Mailing or submission address</strong><br />{policy.mailingAddress ?? "Not verified — use the current application"}</div></div>
            <div className="flex items-start gap-3"><FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><strong className="text-foreground">Translations recorded</strong><br />{policy.translations.join(", ")}</div></div>
          </div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Button asChild><a href={policy.policyUrl} target="_blank" rel="noreferrer">Official policy <ExternalLink className="h-4 w-4" /></a></Button><Button asChild variant="outline"><a href={policy.applicationUrl} target="_blank" rel="noreferrer">Official application <ExternalLink className="h-4 w-4" /></a></Button></div></div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <DetailList title="Documents to prepare" items={policy.requiredDocumentation} icon={FileText} />
          <DetailList title="Providers included" items={policy.providersIncluded} icon={CheckCircle2} />
          <DetailList title="Provider and service exclusions" items={policy.providersExcluded} icon={AlertTriangle} />
          <DetailList title="Plain-language limitations" items={policy.limitations} icon={ShieldCheck} />
        </div>

        <section className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 text-amber-950 md:p-6"><h2 className="flex items-center gap-2 font-display text-xl font-bold"><AlertTriangle className="h-5 w-5" aria-hidden="true" />Collections and deadline warning</h2><p className="mt-3 text-sm leading-relaxed">{policy.collectionsLanguage ?? "The reviewed source did not establish one account-hold rule. Ask the hospital and any collector in writing what can pause during a complete application."} Do not ignore a lawsuit, validation, appeal, authorization, or payment deadline.</p></section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Evidence record</p><h2 className="mt-2 font-display text-3xl font-bold">Official sources used</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{policy.sources.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/35"><span className="flex items-start justify-between gap-3 font-display text-lg font-bold text-foreground">{item.label}<ExternalLink className="h-4 w-4 shrink-0 text-primary" /></span><span className="mt-2 block text-sm text-muted-foreground">{item.publisher}{item.effectiveDate ? ` · Effective ${item.effectiveDate}` : ""}<br />Retrieved {item.retrievedAt}</span><span className="mt-3 block text-xs leading-relaxed text-muted-foreground">Supports: {item.supports}</span></a>)}</div>
        </section>

        <section className="rounded-[2rem] border border-primary/25 bg-primary-soft/30 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Turn the policy into an action plan</p><h2 className="mt-2 font-display text-2xl font-bold">Compare a broad income range without sending sensitive answers to analytics.</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">The finder adds the bill stage, documentation checklist, provider warning, questions, missing information, and printable result.</p></div><div className="mt-5 shrink-0 md:mt-0"><ToolCta label={`Check ${policy.name}`} /></div></section>

        <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Related medical-bill actions</p><h2 className="mt-2 font-display text-3xl font-bold">Verify the bill around the application</h2><div className="mt-7"><ResourceGrid /></div></section>

        <section className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground"><p><strong className="text-foreground">Review record:</strong> Official source retrieved {policy.sourceRetrievedAt}. {reviewLabel}. Next scheduled review: January 2027, or earlier when the official source changes. This educational page does not determine eligibility, legal rights, insurance coverage, or whether a balance is owed.</p></section>
      </div>
    </>
  );
};
