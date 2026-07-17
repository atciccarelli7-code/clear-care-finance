import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  HeartPulse,
  Hospital,
  Pill,
  Printer,
  Receipt,
  Shield,
  Stethoscope,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSeo } from "@/lib/seo";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

type Tone = "blue" | "green" | "amber" | "slate";
type Option = { id: string; label: string };
type Source = { title: string; url: string };

const Badge = ({ children, tone = "blue" }: { children: string; tone?: Tone }) => {
  const tones: Record<Tone, string> = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
};

const SoftWarning = ({ title, body }: { title: string; body: string }) => (
  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-amber-950">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-950/80">{body}</p>
      </div>
    </div>
  </div>
);

const SourceBox = ({ sources }: { sources: Source[] }) => (
  <section id="sources" className="scroll-mt-24">
    <SectionHeading centered eyebrow="Sources" title="Where to verify details" description="Use official sources and plan documents before making coverage decisions." />
    <Card className="mx-auto max-w-3xl rounded-3xl shadow-card">
      <CardContent className="p-5 md:p-6">
        <ol className="space-y-3 text-sm text-muted-foreground">
          {sources.map((source) => (
            <li key={source.url} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <a className="font-medium text-primary underline-offset-4 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                {source.title} <ExternalLink className="inline h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  </section>
);

const ToolLinkGrid = () => (
  <section aria-label="Related insurance decision tools">
    <SectionHeading centered eyebrow="Related tools" title="Insurance decision tools" description="Use these together when comparing coverage, bills, medications, and post-hospital care." />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[
        ["Medicare Advantage helper", "/tools/medicare-advantage-plan-helper"],
        ["Prior authorization guide", "/tools/prior-authorization-next-step-guide"],
        ["Hospital discharge coverage", "/insurance/hospital-discharge-coverage"],
        ["Medication coverage checklist", "/insurance/medication-coverage-checklist"],
        ["Medical bill review toolkit", "/insurance/medical-bill-review-toolkit"],
        ["Medicare Advantage vs Medigap", "/insurance/medicare-advantage-vs-medigap"],
      ].map(([title, href]) => (
        <Link key={href} to={href} className="rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover">
          <div className="text-sm font-bold text-foreground">{title}</div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary">
            Open tool <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      ))}
    </div>
  </section>
);

const printPage = () => window.print();

export const MedicareAdvantagePlanHelper = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  useSeo({
    title: "Medicare Advantage Plan Type Decision Helper",
    description: "A plain-English Medicare Advantage plan type helper for comparing HMO, PPO, HMO-POS, Original Medicare with Medigap, and when to pause for individualized help.",
    canonicalPath: "/tools/medicare-advantage-plan-helper",
  });

  const questions: Option[] = [
    { id: "specialists", label: "Multiple specialists or frequent specialist visits" },
    { id: "travel", label: "Travel often or split time between locations" },
    { id: "oneSystem", label: "Doctors are mostly tied to one local hospital system" },
    { id: "highUse", label: "Possible surgery, chemo, dialysis, rehab, home health, or frequent imaging" },
    { id: "expensiveMeds", label: "Expensive or numerous prescriptions" },
    { id: "comfortableRules", label: "Comfortable with referrals and prior authorization" },
    { id: "keepDoctor", label: "Keeping a specific doctor or hospital matters more than a low premium" },
    { id: "limitedIncome", label: "Limited income/resources; may need Medicaid, Extra Help, or SHIP counseling" },
  ];

  const result = useMemo(() => {
    const needsFlexibility = Number(answers.specialists) + Number(answers.travel) + Number(answers.highUse) + Number(answers.keepDoctor);
    const managedCareComfort = answers.oneSystem && answers.comfortableRules;

    if (answers.limitedIncome) {
      return {
        label: "Pause and verify help options first",
        tone: "amber" as Tone,
        why: ["Limited income/resources may change the right next step.", "Medicaid, Medicare Savings Programs, Extra Help, and SHIP counseling may matter before choosing a plan type."],
        verify: ["State Medicaid or Medicare Savings Program eligibility.", "Extra Help for Part D drug costs.", "Local SHIP counseling before enrollment."],
      };
    }

    if (needsFlexibility >= 3) {
      return {
        label: "Compare PPO and Original Medicare + Medigap carefully",
        tone: "blue" as Tone,
        why: ["Your answers suggest provider flexibility, specialist access, or serious-care access may matter.", "A low premium may be less important than network breadth, authorization friction, and worst-case cost."],
        verify: ["Every doctor, hospital, rehab option, pharmacy, and medication.", "Prior authorization rules for imaging, procedures, post-acute care, DME, and drugs.", "Whether Medigap enrollment timing or underwriting affects availability."],
      };
    }

    if (managedCareComfort) {
      return {
        label: "HMO or HMO-POS may be reasonable to compare",
        tone: "green" as Tone,
        why: ["Your care appears concentrated in one system and you are comfortable with managed-care rules.", "The plan still needs a strong local network and clear medication coverage."],
        verify: ["Primary care, specialists, hospital system, labs, imaging centers, pharmacies, and post-acute providers.", "Referral and prior authorization requirements.", "Drug formulary, tiers, quantity limits, step therapy, and preferred pharmacy pricing."],
      };
    }

    return {
      label: "Compare HMO, PPO, and HMO-POS side by side",
      tone: "blue" as Tone,
      why: ["Your answers do not point cleanly to one plan type.", "The practical answer depends on doctors, hospitals, medications, pharmacy, county, and plan year."],
      verify: ["Local plan availability by ZIP code/county.", "Provider directory and drug formulary.", "Max out-of-pocket exposure in a normal year and a bad year."],
    };
  }, [answers]);

  return (
    <>
      <PageHero eyebrow="Decision helper" title="Medicare Advantage Plan Type Decision Helper" description="A quick educational tool to help patients compare HMO, PPO, HMO-POS, and Original Medicare + Medigap tradeoffs before checking live plan details." />
      <div className="container space-y-16 py-12 md:py-16">
        <SoftWarning title="Educational only" body="This tool does not recommend a plan or replace Medicare.gov, official plan documents, licensed counseling, SHIP, or individualized advice." />
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Check what matters</CardTitle>
              <CardDescription>Choose the statements that apply. The result explains what to compare next.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.map((question) => (
                <label key={question.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/50 p-4 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border"
                    checked={Boolean(answers[question.id])}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.checked }))}
                  />
                  <span className="font-medium text-foreground">{question.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <Badge tone={result.tone}>Educational result</Badge>
              <CardTitle className="font-display text-3xl">{result.label}</CardTitle>
              <CardDescription>Use this as a comparison direction, not an enrollment recommendation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold">Why this appeared</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.why.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold">Verify before enrolling</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.verify.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
                <Button asChild variant="hero"><Link to="/insurance/medicare-advantage">Compare plan structures</Link></Button>
                <Button asChild variant="outline"><a href="https://www.medicare.gov/plan-compare/" target="_blank" rel="noreferrer">Open Medicare Plan Finder</a></Button>
              </div>
            </CardContent>
          </Card>
        </section>
        <ToolLinkGrid />
      </div>
    </>
  );
};

export const PriorAuthorizationGuide = () => {
  const [service, setService] = useState("MRI of the lumbar spine");
  const [provider, setProvider] = useState("ordering provider's office");
  const [insurance, setInsurance] = useState("insurance plan");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");

  useSeo({
    title: "Prior Authorization Survival Guide",
    description: "Plain-English prior authorization guide with call scripts, checklists, and questions for patients dealing with insurance delays.",
    canonicalPath: "/tools/prior-authorization-next-step-guide",
  });

  const script = `I am calling about prior authorization for ${service || "my service or medication"}. The request was submitted by ${provider || "my provider"}${date ? ` on ${date}` : ""}. Can you confirm whether ${insurance || "the insurance plan"} received the request, the reference number, what information is missing, the expected decision date, and whether this can be marked urgent if medically appropriate?`;

  const statusNotes: Record<string, string[]> = {
    pending: ["Confirm the request is in the insurer system and get a reference number.", "Ask the expected decision date and whether anything is missing."],
    denied: ["Ask for the exact denial language and appeal instructions.", "Ask the provider whether clinical notes, peer-to-peer review, or an appeal can be submitted."],
    missing: ["Ask exactly what document, code, clinical note, or form is missing.", "After the provider sends it, call back and confirm it was received."],
    urgent: ["Ask what criteria are needed for expedited review and who can request it.", "Document symptoms, dates, names, and reference numbers."],
  };

  return (
    <>
      <PageHero eyebrow="Insurance guide" title="Prior Authorization Survival Guide" description="What to ask when insurance delays imaging, procedures, medications, rehab, skilled nursing, home health, DME, or other care." />
      <div className="container space-y-16 py-12 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Call script generator</CardTitle>
              <CardDescription>Fill in what you know. Save names, dates, times, and reference numbers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="space-y-2"><span className="text-sm font-semibold">Service or medication</span><input className={inputClass} value={service} onChange={(event) => setService(event.target.value)} /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Provider office</span><input className={inputClass} value={provider} onChange={(event) => setProvider(event.target.value)} /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Insurance company/plan</span><input className={inputClass} value={insurance} onChange={(event) => setInsurance(event.target.value)} /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Submitted date</span><input className={inputClass} value={date} onChange={(event) => setDate(event.target.value)} placeholder="Example: January 8" /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Current issue</span><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="pending">Pending</option><option value="denied">Denied</option><option value="missing">Missing information</option><option value="urgent">Urgent</option></select></label>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Script to use</CardTitle>
              <CardDescription>Copy this into a note before calling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-primary/20 bg-card p-4 text-sm leading-relaxed text-foreground">{script}</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {statusNotes[status].map((item) => <li key={item} className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
              </ul>
              <Button type="button" variant="outline" onClick={printPage}><Printer className="h-4 w-4" /> Print/save</Button>
            </CardContent>
          </Card>
        </section>
        <ToolLinkGrid />
        <SourceBox sources={[{ title: "Healthcare.gov — Health insurance rights and appeals", url: "https://www.healthcare.gov/appeal-insurance-company-decision/" }, { title: "Medicare.gov — Appeals", url: "https://www.medicare.gov/claims-appeals/how-do-i-file-an-appeal" }]} />
      </div>
    </>
  );
};

export const HospitalDischargeCoverageGuide = () => {
  const [destination, setDestination] = useState("home");
  const [needs, setNeeds] = useState<Record<string, boolean>>({ pt: true });
  const [approved, setApproved] = useState("unsure");
  const [network, setNetwork] = useState("unsure");

  useSeo({
    title: "Hospital Discharge Coverage Guide",
    description: "A plain-English hospital discharge coverage checklist for SNF, inpatient rehab, home health, DME, oxygen, transportation, and skilled vs custodial care.",
    canonicalPath: "/insurance/hospital-discharge-coverage",
  });

  const needLabels: Option[] = [
    { id: "pt", label: "PT/OT/ST therapy" },
    { id: "oxygen", label: "Oxygen or respiratory equipment" },
    { id: "walker", label: "Walker, wheelchair, hospital bed, or DME" },
    { id: "wound", label: "Wound care or supplies" },
    { id: "homeHealth", label: "Home health nursing or therapy" },
    { id: "transport", label: "Ambulance or medical transportation" },
  ];

  const checklist = [
    `Ask case management what level of care is being recommended after discharge: ${destination}.`,
    approved !== "yes" ? "Ask whether insurance has approved the next level of care and what is still pending." : "Save the approval details, authorization number, and approved dates.",
    network !== "yes" ? "Ask whether the facility, agency, equipment company, pharmacy, and transportation provider are in-network." : "Save the in-network confirmation and provider names.",
    "Ask whether the need is considered skilled care, custodial care, or both.",
    "Ask what services are covered, for how long, and what copays/coinsurance may apply.",
    ...needLabels.filter((need) => needs[need.id]).map((need) => `Verify coverage and delivery timing for ${need.label.toLowerCase()}.`),
  ];

  return (
    <>
      <PageHero eyebrow="Hospital discharge" title="Hospital Discharge Coverage Guide" description="A checklist for families trying to understand rehab, skilled nursing, home health, equipment, oxygen, wound care, and transportation before leaving the hospital." />
      <div className="container space-y-16 py-12 md:py-16">
        <SoftWarning title="Medically ready does not always mean coverage is approved" body="Hospitals, insurers, facilities, and equipment companies may all have separate steps. Ask for the plan, authorization status, network status, and backup options before discharge day." />
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">Build your discharge checklist</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <label className="space-y-2"><span className="text-sm font-semibold">Expected destination</span><select className={inputClass} value={destination} onChange={(event) => setDestination(event.target.value)}><option value="home">Home</option><option value="skilled nursing facility">Skilled nursing facility</option><option value="inpatient rehab">Inpatient rehab</option><option value="assisted living">Assisted living</option><option value="unsure">Unsure</option></select></label>
              <div className="space-y-2"><span className="text-sm font-semibold">Needs after discharge</span>{needLabels.map((need) => <label key={need.id} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={Boolean(needs[need.id])} onChange={(event) => setNeeds((current) => ({ ...current, [need.id]: event.target.checked }))} />{need.label}</label>)}</div>
              <label className="space-y-2"><span className="text-sm font-semibold">Insurance approved?</span><select className={inputClass} value={approved} onChange={(event) => setApproved(event.target.value)}><option value="unsure">Unsure</option><option value="yes">Yes</option><option value="no">No/pending</option></select></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Provider/facility in-network?</span><select className={inputClass} value={network} onChange={(event) => setNetwork(event.target.value)}><option value="unsure">Unsure</option><option value="yes">Yes</option><option value="no">No/pending</option></select></label>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">Questions to ask</CardTitle><CardDescription>Use this with case management, insurance, and the receiving provider.</CardDescription></CardHeader>
            <CardContent><ul className="space-y-3 text-sm text-muted-foreground">{checklist.map((item) => <li key={item} className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><Button className="mt-5" type="button" variant="outline" onClick={printPage}><Printer className="h-4 w-4" /> Print/save</Button></CardContent>
          </Card>
        </section>
        <SourceBox sources={[{ title: "Medicare.gov — Skilled nursing facility care", url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care" }, { title: "Medicare.gov — Home health services", url: "https://www.medicare.gov/coverage/home-health-services" }, { title: "Medicare.gov — Durable medical equipment", url: "https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage" }]} />
      </div>
    </>
  );
};

export const MedicationCoverageChecklist = () => {
  const [coverageChecks, setCoverageChecks] = useState<Record<string, string>>({ formulary: "unsure", pharmacy: "unsure", cost: "unsure" });
  const [flags, setFlags] = useState<Record<string, boolean>>({ priorAuth: true });

  useSeo({
    title: "Medication Coverage Checklist",
    description: "A structured medication coverage checklist for checking formulary, tiers, pharmacy network, prior authorization, step therapy, and quantity limits before choosing a health plan.",
    canonicalPath: "/insurance/medication-coverage-checklist",
  });

  const redFlags = [
    coverageChecks.formulary === "not-covered" && "The medication may be excluded or non-formulary. Ask the prescriber and plan about the exceptions process or covered alternatives.",
    coverageChecks.pharmacy === "out-of-network" && "The selected pharmacy may not receive preferred or in-network pricing under the plan.",
    coverageChecks.cost === "not-checked" && "The current plan-year price and applicable cost-sharing have not been verified.",
    flags.priorAuth && "Prior authorization may delay fills unless the prescriber submits documentation.",
    flags.stepTherapy && "Step therapy may require trying a different medication first.",
    flags.quantity && "Quantity limits may block the prescribed dose or refill timing.",
    flags.brand && "Brand-only medications can have high cost-sharing or coverage restrictions.",
  ].filter(Boolean) as string[];

  return (
    <>
      <PageHero eyebrow="Prescription checklist" title="Medication Coverage Checklist" description="Privately verify each medication's formulary status, tier, pharmacy, cost, and restrictions before choosing a health plan." />
      <div className="container space-y-16 py-12 md:py-16">
        <SoftWarning title="Keep medication details private" body="CAF does not need a medication name, dose, diagnosis, pharmacy, price, plan name, or member identifier. Keep those details in your own records and use this fixed-choice checklist to organize what to verify in the plan formulary, insurer portal, Medicare Plan Finder, pharmacy, or prescriber's office." />

        <section className="rounded-3xl border border-primary/20 bg-primary-soft/30 p-5 shadow-card md:p-8" aria-labelledby="rn-medication-access-lesson">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-primary">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">From discharge education</div>
              <h2 id="rn-medication-access-lesson" className="mt-2 font-display text-2xl font-bold tracking-tight">A medication plan is not complete until access is realistic.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                I have cared for patients who were rationing important medications because the cost looked impossible, even though coverage or assistance questions were still unresolved. The safer response is not to promise a discount. It is to identify the barrier early and verify the formulary, tier, pharmacy, authorization rules, plan-year cost sharing, covered alternatives, and legitimate assistance options with the people who control them.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">Private verification status</CardTitle><CardDescription>Choose only a status. Do not enter a medication or personal health detail.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                ["formulary", "Formulary status", [["unsure", "Not checked"], ["covered", "Listed as covered"], ["not-covered", "Not covered / not listed"]]],
                ["pharmacy", "Pharmacy network", [["unsure", "Not checked"], ["preferred", "Preferred or in-network"], ["out-of-network", "Not preferred / out-of-network"]]],
                ["cost", "Current plan-year cost", [["unsure", "Not checked"], ["checked", "Verified with plan or pharmacy"], ["not-checked", "Price still needs verification"]]],
              ].map(([id, label, options]) => (
                <label key={id as string} className="space-y-2">
                  <span className="text-sm font-semibold">{label as string}</span>
                  <select className={inputClass} value={coverageChecks[id as string]} onChange={(event) => setCoverageChecks((current) => ({ ...current, [id as string]: event.target.value }))}>
                    {(options as string[][]).map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}
                  </select>
                </label>
              ))}
              <div className="grid gap-2 sm:grid-cols-2">{[["priorAuth", "Prior authorization"], ["stepTherapy", "Step therapy"], ["quantity", "Quantity limit"], ["brand", "Brand/generic issue"]].map(([id, label]) => <label key={id} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={Boolean(flags[id])} onChange={(event) => setFlags((current) => ({ ...current, [id]: event.target.checked }))} />{label}</label>)}</div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">What to verify</CardTitle><CardDescription>Use the exact medication details only in a trusted plan, pharmacy, or prescriber workflow.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <ul className="space-y-3 text-sm text-muted-foreground">{["Exact medication name, dose, and formulation.", "Formulary tier and whether generic substitution applies.", "Preferred pharmacy, standard pharmacy, and mail-order pricing.", "Prior authorization, step therapy, quantity limits, and refill timing.", "What changes if the plan year changes."].map((item) => <li key={item} className="flex gap-2"><Pill className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
              {redFlags.length > 0 && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-950">Red flags</h3><ul className="mt-2 space-y-2 text-sm text-amber-950/80">{redFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul></div>}
              <div className="flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero"><Link to="/insurance/medicare-advantage">Back to plan comparison</Link></Button><Button asChild variant="outline"><Link to="/open-enrollment">Open Enrollment guide</Link></Button></div>
            </CardContent>
          </Card>
        </section>
        <SourceBox sources={[{ title: "HealthCare.gov — Getting prescription medications", url: "https://www.healthcare.gov/using-marketplace-coverage/prescription-medications/" }, { title: "CMS — Pharmaceutical manufacturer patient assistance programs", url: "https://www.cms.gov/medicare/coverage/prescription-drug-coverage/patient-assistance-program" }, { title: "Medicare.gov — Medicare Plan Finder", url: "https://www.medicare.gov/plan-compare/" }, { title: "Medicare.gov — Prescription Payment Plan", url: "https://www.medicare.gov/prescription-payment-plan" }]} />
      </div>
    </>
  );
};

export const MedicalBillReviewToolkit = () => {
  const [bill, setBill] = useState("1200");
  const [answers, setAnswers] = useState<Record<string, string>>({ eob: "no", match: "unsure", network: "unsure", itemized: "no", assistance: "no", collections: "no" });

  useSeo({
    title: "Medical Bill Review Toolkit",
    description: "A patient-friendly medical bill review toolkit with itemized bill, EOB, financial assistance, insurance processing, and appeal call scripts.",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
  });

  const nextSteps = [
    answers.eob !== "yes" && "Wait for or request the Explanation of Benefits before assuming the balance is final.",
    answers.itemized !== "yes" && "Request an itemized bill from the hospital or provider before paying a large balance.",
    answers.match !== "yes" && "Compare the provider bill against the EOB allowed amount and patient responsibility.",
    answers.network !== "yes" && "Ask whether the provider was processed as in-network and whether surprise billing protections may apply.",
    answers.assistance !== "yes" && "Ask about hospital financial assistance, charity care, payment plans, and discounts.",
    answers.collections === "yes" && "Ask for written validation, pause auto-pay, and keep a record of every call and document.",
  ].filter(Boolean) as string[];

  const billingScript = `I am calling about a medical bill for ${bill ? `$${bill}` : "my balance"}. Before I pay, I need to confirm whether insurance has fully processed the claim, request an itemized bill, check whether the balance matches the EOB, and ask whether financial assistance or a coding review is available.`;

  return (
    <>
      <PageHero eyebrow="Medical bills" title="Medical Bill Review / Appeal Toolkit" description="A practical checklist for reviewing a hospital or provider bill before paying a large or confusing balance." />
      <div className="container space-y-16 py-12 md:py-16">
        <SoftWarning title="Do not ignore bills, but do not assume the first number is final" body="For large balances, confirm the EOB, itemized bill, insurance processing, network status, and financial assistance options before paying when possible." />
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="rounded-3xl shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">Bill review inputs</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <label className="space-y-2"><span className="text-sm font-semibold">Bill amount</span><input className={inputClass} value={bill} onChange={(event) => setBill(event.target.value)} /></label>
              {[["eob", "Received an EOB?"], ["match", "Bill matches EOB?"], ["network", "Provider in-network?"], ["itemized", "Requested itemized bill?"], ["assistance", "Asked about financial assistance?"], ["collections", "Bill in collections?"]].map(([id, label]) => <label key={id} className="space-y-2"><span className="text-sm font-semibold">{label}</span><select className={inputClass} value={answers[id]} onChange={(event) => setAnswers((current) => ({ ...current, [id]: event.target.value }))}><option value="unsure">Unsure</option><option value="yes">Yes</option><option value="no">No</option></select></label>)}
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader><CardTitle className="font-display text-2xl">Next steps</CardTitle></CardHeader>
            <CardContent className="space-y-5"><ul className="space-y-3 text-sm text-muted-foreground">{nextSteps.map((step) => <li key={step} className="flex gap-2"><Receipt className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{step}</li>)}</ul><div className="rounded-2xl border border-primary/20 bg-card p-4 text-sm leading-relaxed">{billingScript}</div><Button type="button" variant="outline" onClick={printPage}><Printer className="h-4 w-4" /> Print/save</Button></CardContent>
          </Card>
        </section>
        <SourceBox sources={[{ title: "CMS — Hospital price transparency", url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency" }, { title: "Healthcare.gov — Appealing a health plan decision", url: "https://www.healthcare.gov/appeal-insurance-company-decision/" }, { title: "CMS — No Surprises Act", url: "https://www.cms.gov/nosurprises" }]} />
      </div>
    </>
  );
};

export const HealthcareWorkerPaycheckTools = () => {
  useSeo({
    title: "Healthcare Worker Paycheck Tools",
    description: "A hub of paycheck, overtime, retirement, savings, and benefit tools for nurses and healthcare workers.",
    canonicalPath: "/healthcare-workers/paycheck-tools",
  });

  const tools = [
    ["403(b) paycheck contribution", "/tools#403b", "See paycheck contribution, annual amount, and rough employer match."],
    ["Overtime deduction estimator", "/tools#overtime", "Estimate qualifying overtime premium and rough federal tax savings."],
    ["Hospital cafe savings", "/tools#cafe", "See how daily convenience spending affects savings rate."],
    ["Open enrollment paycheck impact", "/tools#paycheck-impact", "Estimate how benefit elections may change take-home pay."],
    ["HSA vs FSA decision helper", "/tools#hsa-fsa", "Compare tax savings, forfeiture risk, and plan fit."],
  ];

  return (
    <>
      <PageHero eyebrow="Healthcare worker money" title="Healthcare Worker Paycheck Tools" description="Your paycheck is the engine. Benefits, overtime, differentials, tax accounts, and retirement elections all change what actually lands in your bank account." />
      <div className="container space-y-16 py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(([title, href, body]) => (
            <Link key={title} to={href} className="rounded-3xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover">
              <WalletCards className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Open</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export const MedicareAdvantageVsMedigap = () => {
  useSeo({
    title: "Medicare Advantage vs Medigap",
    description: "A plain-English comparison of Medicare Advantage and Original Medicare plus Medigap tradeoffs.",
    canonicalPath: "/insurance/medicare-advantage-vs-medigap",
  });

  const rows = [
    ["Monthly premium", "Often lower, but varies by county and plan.", "Often higher because Medigap and Part D premiums are separate."],
    ["Network flexibility", "Usually plan-network based; HMO/PPO rules matter.", "Original Medicare is generally broader for providers who accept Medicare."],
    ["Prior authorization", "More likely for selected services and post-acute care.", "Usually less plan-managed for Medicare-covered services."],
    ["Drug coverage", "Often included in MA-PD plans.", "Usually requires separate Part D plan."],
    ["Out-of-pocket predictability", "Has a plan max out-of-pocket for Part A/B covered services.", "Depends on Medigap plan design and premiums."],
    ["Travel", "Emergency/urgent rules and network access vary.", "Often stronger domestic flexibility; foreign travel depends on coverage."],
  ];

  return (
    <>
      <PageHero eyebrow="Medicare comparison" title="Medicare Advantage vs Medigap" description="The real tradeoff is usually lower premium and extra benefits versus provider flexibility, prior authorization, and supplemental coverage cost." />
      <div className="container space-y-16 py-12 md:py-16">
        <SoftWarning title="Do not treat either option as universally best" body="The better fit depends on doctors, hospitals, prescriptions, travel, income, Medigap enrollment timing, state rules, and risk tolerance." />
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full text-left text-sm">
              <thead><tr className="border-b border-border bg-muted/40"><th className="p-4">Question</th><th className="p-4">Medicare Advantage</th><th className="p-4">Original Medicare + Medigap</th></tr></thead>
              <tbody>{rows.map(([label, ma, medigap]) => <tr key={label} className="border-b border-border/70 last:border-0"><th className="bg-muted/20 p-4 align-top font-semibold">{label}</th><td className="p-4 align-top text-muted-foreground">{ma}</td><td className="p-4 align-top text-muted-foreground">{medigap}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <ToolLinkGrid />
        <SourceBox sources={[{ title: "Medicare.gov — Compare Original Medicare and Medicare Advantage", url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage" }, { title: "Medicare.gov — Medigap", url: "https://www.medicare.gov/health-drug-plans/medigap" }]} />
      </div>
    </>
  );
};

export const InsuranceMarketingRealityPage = () => {
  useSeo({
    title: "What Medicare Advantage Marketing May Not Emphasize",
    description: "A balanced, practical article on what Medicare Advantage marketing may highlight and what patients still need to verify.",
    canonicalPath: "/insurance/what-medicare-advantage-marketing-may-not-emphasize",
  });

  const items = [
    ["$0 premium", "A $0 premium can still include copays, coinsurance, drug costs, and a meaningful out-of-pocket limit."],
    ["Extra benefits", "Dental, vision, hearing, OTC, transportation, and fitness benefits can have limits, networks, and annual caps."],
    ["Big provider names", "A provider appearing somewhere in a directory does not always mean every location, specialist, facility, or service is in-network."],
    ["Simple enrollment", "The hard part is verifying doctors, hospitals, pharmacies, prescriptions, referrals, and prior authorization before care gets expensive."],
  ];

  return (
    <>
      <PageHero eyebrow="Insurance marketing" title="What Medicare Advantage Marketing May Not Emphasize" description="Marketing often highlights benefits. Patients still need to verify the less exciting details before choosing a plan." />
      <div className="container space-y-16 py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(([title, body]) => <Card key={title} className="rounded-3xl shadow-card"><CardHeader><Badge tone="amber">Check this</Badge><CardTitle className="font-display text-2xl">{title}</CardTitle><CardDescription className="text-base leading-relaxed">{body}</CardDescription></CardHeader></Card>)}
        </div>
        <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-5 shadow-card">
          <AccordionItem value="balanced"><AccordionTrigger className="text-left font-display text-xl font-bold">Balanced take</AccordionTrigger><AccordionContent><p className="text-sm leading-relaxed text-muted-foreground">Medicare Advantage can be a reasonable fit for some people. The point is not to avoid it automatically. The point is to compare the plan based on the care you might need in a bad year, not only the benefits that look attractive during a healthy year.</p></AccordionContent></AccordionItem>
        </Accordion>
        <ToolLinkGrid />
      </div>
    </>
  );
};

export const InsuranceDecisionToolsIndex = () => {
  useSeo({
    title: "Insurance Decision Tools",
    description: "Clear Care Finance insurance decision tools for Medicare Advantage, prior authorization, discharge coverage, medication coverage, and medical bills.",
    canonicalPath: "/insurance",
  });

  return (
    <>
      <PageHero eyebrow="Insurance tools" title="Insurance Decision Tools" description="Patient- and caregiver-friendly tools for the coverage decisions that usually get confusing when care is expensive or time-sensitive." />
      <div className="container space-y-16 py-12 md:py-16">
        <ToolLinkGrid />
      </div>
    </>
  );
};
