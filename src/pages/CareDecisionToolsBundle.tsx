import { useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { DecisionResultPanel, DecisionToolIntro, SelectQuestion, decisionResultToText } from "@/components/shared/DecisionResultPanel";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { OFFICIAL_ELIGIBILITY_SOURCES, STATE_MEDICAID_LINKS } from "@/data/medicareMedicaidEligibilityData";
import {
  buildMedicaidRoutingResult,
  buildObservationResult,
  DEFAULT_MEDICAID_ROUTING_ANSWERS,
  DEFAULT_OBSERVATION_ANSWERS,
  type DecisionResult,
  type MedicaidRoutingAnswers,
  type ObservationAnswers,
} from "@/lib/roadmapDecisionTools";
import { useSeo } from "@/lib/seo";

const YES_NO_NOT_SURE = [
  { value: "not-sure", label: "Not sure" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const OfficialSources = ({ sources }: { sources: Array<{ label: string; href: string; note: string }> }) => (
  <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /> Official verification</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {sources.map((source) => (
        <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-background px-4 py-3 hover:border-primary/30">
          <span className="flex items-start justify-between gap-2 text-sm font-bold text-primary">{source.label}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{source.note}</span>
        </a>
      ))}
    </div>
  </section>
);

const useQualifiedResult = <T,>(initial: T, build: (answers: T) => DecisionResult, officialNote: string) => {
  const [answers, setAnswers] = useState(initial);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof T>(key: K, value: T[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult(null);
    setCopied(false);
  };
  const generate = () => {
    setResult(build(answers));
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };
  const reset = () => { setAnswers(initial); setResult(null); setCopied(false); };
  const copy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(decisionResultToText(result, officialNote)); setCopied(true); }
    catch { setCopied(false); }
  };
  return { answers, result, copied, resultRef, update, generate, reset, copy };
};

export const StateMedicaidLongTermCareRouterPage = () => {
  useSeo({ title: "State Medicaid and Long-Term Care Program Router", description: "Choose a state and care need to find the official Medicaid, Medicare cost-help, nursing-facility, or home-care starting point without an eligibility claim.", canonicalPath: "/tools/state-medicaid-long-term-care-router" });
  const [answers, setAnswers] = useState(DEFAULT_MEDICAID_ROUTING_ANSWERS);
  const [result, setResult] = useState<ReturnType<typeof buildMedicaidRoutingResult> | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof MedicaidRoutingAnswers>(key: K, value: MedicaidRoutingAnswers[K]) => { setAnswers((current) => ({ ...current, [key]: value })); setResult(null); setCopied(false); };
  const generate = () => { setResult(buildMedicaidRoutingResult(answers)); window.setTimeout(() => resultRef.current?.focus(), 0); };
  const reset = () => { setAnswers(DEFAULT_MEDICAID_ROUTING_ANSWERS); setResult(null); setCopied(false); };
  const copy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(decisionResultToText(result, "The selected state's official Medicaid agency and current written program rules control.")); setCopied(true); }
    catch { setCopied(false); }
  };

  return (
    <>
      <PageHero eyebrow="State-aware care financing" title="State Medicaid and Long-Term Care Program Router" description="Identify the official state starting point for health coverage, Medicare cost help, nursing-facility Medicaid, or home- and community-based services—without a false national eligibility result." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">No exact assets, income, diagnoses, or identifying data.</strong> This route distinguishes program categories and agencies. The state still applies financial, functional, residency, transfer, and program rules.</DecisionToolIntro>
        <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); generate(); }}>
          <SelectQuestion id="medicaid-state" label="State of residence" helper="The official agency, application, program names, and available services are state specific." value={answers.state} onChange={(value) => update("state", value as MedicaidRoutingAnswers["state"])} options={[{ value: "", label: "Choose a state" }, ...STATE_MEDICAID_LINKS.map((state) => ({ value: state.code, label: state.name }))]} />
          <SelectQuestion id="medicaid-need" label="Primary help being investigated" helper="Choose the closest need; the state may screen more than one program." value={answers.need} onChange={(value) => update("need", value as MedicaidRoutingAnswers["need"])} options={[
            { value: "not-sure", label: "Not sure" },
            { value: "health-coverage", label: "Ordinary Medicaid or CHIP health coverage" },
            { value: "medicare-cost-help", label: "Help with Medicare premiums or cost sharing" },
            { value: "nursing-facility", label: "Nursing-facility or institutional long-term care" },
            { value: "home-community", label: "Home- and community-based care or waiver services" },
            { value: "caregiver-planning", label: "Caregiver planning, respite, or aging/disability supports" },
          ]} />
          <SelectQuestion id="medicaid-medicare" label="Is Medicare already active?" helper="Medicare cost assistance and dual eligibility use different pathways from ordinary Medicaid coverage." value={answers.medicare} onChange={(value) => update("medicare", value as MedicaidRoutingAnswers["medicare"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="medicaid-ltss" label="Is ongoing help with daily activities, supervision, or long-term support involved?" helper="Functional need can matter as much as financial eligibility for long-term services and supports." value={answers.longTermNeed} onChange={(value) => update("longTermNeed", value as MedicaidRoutingAnswers["longTermNeed"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="medicaid-setting" label="Preferred care setting to investigate" helper="A preference does not guarantee that a program, provider, or service slot is available." value={answers.settingPreference} onChange={(value) => update("settingPreference", value as MedicaidRoutingAnswers["settingPreference"])} options={[
            { value: "not-sure", label: "Not sure" }, { value: "home", label: "Home or community" }, { value: "facility", label: "Nursing facility" }, { value: "either", label: "Compare both" },
          ]} />
          <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="submit" size="lg">Build state routing plan</Button><Button type="button" variant="outline" size="lg" onClick={reset}>Start over</Button></div>
        </form>

        {result && <div ref={resultRef} tabIndex={-1} className="outline-none"><DecisionResultPanel result={result} copied={copied} onCopy={copy} onPrint={() => window.print()} onReset={reset}>
          <OfficialSources sources={[
            ...(result.officialUrl ? [{ label: result.agencyName ?? "Official state Medicaid agency", href: result.officialUrl, note: `Official ${result.stateName ?? "state"} Medicaid starting point.` }] : []),
            { label: "Medicaid.gov state contacts", href: OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.url, note: "Federal directory for official Medicaid and CHIP contacts." },
            { label: "Medicaid long-term services and supports", href: OFFICIAL_ELIGIBILITY_SOURCES.medicaidLongTermCare.url, note: "Federal overview of institutional and home/community long-term services." },
            { label: "Medicare Savings Programs", href: OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.url, note: "Official Medicare overview of state programs that may help with Medicare costs." },
          ]} />
          <SaveNavigatorAction recommendationId="cost_program_guide" sourceRoute="/tools/state-medicaid-long-term-care-router" title="Save the state-program verification step" description="Only the fixed program-review action is saved. State, care setting, Medicare status, and support needs are not stored in My Plan." />
        </DecisionResultPanel></div>}
        <section className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"><Link className="font-bold text-primary" to="/tools/medicare-medicaid-eligibility-check">Open the broader Medicare and Medicaid Eligibility Check</Link> for age, disability, Medicare, ordinary Medicaid, and cost-assistance pathways.</section>
        <DisclaimerBox />
      </div>
    </>
  );
};

export const ObservationInpatientStatusGuidePage = () => {
  useSeo({ title: "Observation vs Inpatient Hospital Status Guide", description: "Prepare the status, notice, Medicare, skilled nursing, discharge, and appeal questions to ask without determining official hospital status or coverage.", canonicalPath: "/tools/observation-vs-inpatient-status-guide" });
  const tool = useQualifiedResult(DEFAULT_OBSERVATION_ANSWERS, buildObservationResult, "The hospital order, written notice, payer, and official appeal instructions control.");

  return (
    <>
      <PageHero eyebrow="Hospital-status decision support" title="Observation vs Inpatient Status Guide" description="Prepare the questions that clarify the written hospital order, cost-sharing pathway, skilled-care implications, and any urgent deadline." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">Location is not status.</strong> A person can stay overnight in a hospital bed and still be treated as an outpatient. This guide does not determine medical necessity, coverage, appeal rights, or what is owed.</DecisionToolIntro>
        <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); tool.generate(); }}>
          <SelectQuestion id="observation-coverage" label="Coverage category" helper="Original Medicare, Medicare Advantage, and commercial plans may apply different cost and post-acute rules." value={tool.answers.coverage} onChange={(value) => tool.update("coverage", value as ObservationAnswers["coverage"])} options={[
            { value: "not-sure", label: "Not sure" }, { value: "original-medicare", label: "Original Medicare" }, { value: "medicare-advantage", label: "Medicare Advantage" }, { value: "commercial", label: "Employer, marketplace, or commercial insurance" }, { value: "other", label: "Other coverage or self-pay" },
          ]} />
          <SelectQuestion id="observation-status" label="Status reported by the hospital" helper="Use Not confirmed unless the current order was verified." value={tool.answers.reportedStatus} onChange={(value) => tool.update("reportedStatus", value as ObservationAnswers["reportedStatus"])} options={[
            { value: "not-confirmed", label: "Not confirmed" }, { value: "inpatient", label: "Inpatient admission" }, { value: "observation", label: "Observation" }, { value: "outpatient", label: "Other outpatient status" },
          ]} />
          <SelectQuestion id="observation-notice" label="Written status notice" helper="Original Medicare observation stays may require the Medicare Outpatient Observation Notice when federal conditions are met." value={tool.answers.writtenNotice} onChange={(value) => tool.update("writtenNotice", value as ObservationAnswers["writtenNotice"])} options={[
            { value: "not-sure", label: "Not sure" }, { value: "received", label: "Received" }, { value: "not-received", label: "Not received" }, { value: "not-applicable", label: "Told it does not apply" },
          ]} />
          <SelectQuestion id="observation-discharge" label="Is discharge expected soon?" helper="Status and post-acute coverage questions are easier to resolve before discharge when possible." value={tool.answers.dischargeSoon} onChange={(value) => tool.update("dischargeSoon", value as ObservationAnswers["dischargeSoon"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="observation-snf" label="Is skilled nursing or inpatient rehabilitation being considered?" helper="The payer may apply qualifying-stay, authorization, network, and clinical rules." value={tool.answers.skilledFacility} onChange={(value) => tool.update("skilledFacility", value as ObservationAnswers["skilledFacility"])} options={YES_NO_NOT_SURE} />
          <SelectQuestion id="observation-deadline" label="Is there an active appeal, discharge, or review deadline?" helper="Use the written notice for the exact date, time, and phone number." value={tool.answers.activeDeadline} onChange={(value) => tool.update("activeDeadline", value as ObservationAnswers["activeDeadline"])} options={YES_NO_NOT_SURE} />
          <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="submit" size="lg">Build status-verification plan</Button><Button type="button" variant="outline" size="lg" onClick={tool.reset}>Start over</Button></div>
        </form>
        {tool.result && <div ref={tool.resultRef} tabIndex={-1} className="outline-none"><DecisionResultPanel result={tool.result} copied={tool.copied} onCopy={tool.copy} onPrint={() => window.print()} onReset={tool.reset}>
          <OfficialSources sources={[
            { label: "CMS Medicare Outpatient Observation Notice", href: "https://www.cms.gov/medicare/forms-notices/beneficiary-notices-initiative/ffs-moon", note: "Official CMS notice resources and instructions for applicable Original Medicare observation services." },
            { label: "Medicare skilled nursing facility coverage", href: "https://www.medicare.gov/coverage/skilled-nursing-facility-care", note: "Official coverage requirements and cost information for skilled nursing facility care." },
            { label: "Hospital Discharge Command Center", href: "/insurance/hospital-discharge-coverage", note: "Coordinate rehabilitation, home health, equipment, medication, transportation, and payer verification." },
          ]} />
          <SaveNavigatorAction recommendationId="cost_discharge" sourceRoute="/tools/observation-vs-inpatient-status-guide" title="Save the status and discharge review" description="Only the fixed discharge-checklist action is saved. Coverage, reported status, notice, and facility plans are not stored in My Plan." />
        </DecisionResultPanel></div>}
        <DisclaimerBox />
      </div>
    </>
  );
};

type ChecklistStatus = "unconfirmed" | "confirmed" | "not-applicable";
type ChecklistItem = { id: string; category: string; prompt: string; verification: string };

const MEDICARE_CHECKLIST: ChecklistItem[] = [
  { id: "providers", category: "Doctors and hospitals", prompt: "Preferred doctors, specialists, and hospitals were checked", verification: "Confirm directly with the provider and the plan; a directory alone may be outdated." },
  { id: "travel", category: "Doctors and hospitals", prompt: "Travel, second-home, and out-of-area care needs were reviewed", verification: "Compare routine, urgent, emergency, and follow-up rules outside the service area." },
  { id: "formulary", category: "Prescriptions", prompt: "Every recurring prescription was checked on the current formulary", verification: "Confirm tier, restrictions, alternatives, quantity limits, and effective date." },
  { id: "pharmacy", category: "Prescriptions", prompt: "Preferred and mail-order pharmacy rules were compared", verification: "Verify retail, preferred, standard, specialty, and mail-order pricing." },
  { id: "authorization", category: "Plan rules", prompt: "Prior authorization, referral, and step-therapy rules were reviewed", verification: "Use the Evidence of Coverage and ask how active authorizations transfer on January 1." },
  { id: "costs", category: "Costs", prompt: "Premium, deductible, copays, coinsurance, and worst-year exposure were compared", verification: "Use the Annual Notice of Change, Evidence of Coverage, and Medicare Plan Finder." },
  { id: "moop", category: "Costs", prompt: "Medicare Advantage maximum out-of-pocket exposure was identified", verification: "Original Medicare has no annual out-of-pocket maximum unless supplemental coverage applies." },
  { id: "medigap", category: "Coverage structure", prompt: "Medigap availability and underwriting or guaranteed-issue questions were verified", verification: "Rules vary by timing and state; do not assume a future switch is guaranteed." },
  { id: "supplemental", category: "Supplemental benefits", prompt: "Dental, vision, hearing, transportation, food, fitness, and allowance limits were read", verification: "Confirm provider network, dollar cap, frequency, exclusions, and whether the benefit changes next year." },
  { id: "anoc", category: "Annual changes", prompt: "The Annual Notice of Change was reviewed", verification: "Compare next year's premiums, cost sharing, network, formulary, authorization, and benefits." },
  { id: "ship", category: "Independent help", prompt: "SHIP or another independent verification resource was considered", verification: "SHIP provides free state-based Medicare counseling; licensed agents may represent a limited set of plans." },
  { id: "enrollment", category: "Enrollment", prompt: "The correct enrollment period and effective date were confirmed", verification: "Use Medicare.gov, Social Security, SHIP, and the official plan enrollment confirmation." },
];

export const MedicarePlanVerificationChecklistPage = () => {
  useSeo({ title: "Medicare Plan Verification Checklist", description: "Prepare provider, prescription, authorization, cost, travel, supplemental-benefit, and enrollment questions before choosing Medicare coverage.", canonicalPath: "/tools/medicare-plan-verification-checklist" });
  const [statuses, setStatuses] = useState<Record<string, ChecklistStatus>>(() => Object.fromEntries(MEDICARE_CHECKLIST.map((item) => [item.id, "unconfirmed"])));
  const [copied, setCopied] = useState(false);
  const counts = useMemo(() => ({ confirmed: Object.values(statuses).filter((value) => value === "confirmed").length, total: MEDICARE_CHECKLIST.length }), [statuses]);
  const grouped = useMemo(() => [...new Set(MEDICARE_CHECKLIST.map((item) => item.category))], []);

  const copy = async () => {
    const text = [
      "MEDICARE PLAN VERIFICATION CHECKLIST",
      `Confirmed: ${counts.confirmed} of ${counts.total}`,
      "",
      ...MEDICARE_CHECKLIST.flatMap((item) => [`[${statuses[item.id]}] ${item.prompt}`, `Verify: ${item.verification}`, ""]),
      "This checklist does not recommend a plan or determine coverage. Verify through Medicare.gov, plan documents, providers, pharmacies, SHIP, and official enrollment confirmation.",
    ].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };
  const reset = () => { setStatuses(Object.fromEntries(MEDICARE_CHECKLIST.map((item) => [item.id, "unconfirmed"]))); setCopied(false); };

  return (
    <>
      <PageHero eyebrow="Plan-comparison preparation" title="Medicare Plan Verification Checklist" description="Prepare before using Medicare Plan Finder, calling SHIP, speaking with a licensed agent, comparing plan documents, or enrolling." />
      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <DecisionToolIntro><strong className="text-foreground">No plan, carrier, provider, or medication names are stored.</strong> Mark each category confirmed, unconfirmed, or not applicable. This checklist does not rank Original Medicare, Medicare Advantage, Medigap, or Part D options.</DecisionToolIntro>
        <section className="rounded-3xl border border-primary/20 bg-primary-soft/25 p-5 md:p-7" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Verification progress</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">{counts.confirmed} of {counts.total} confirmed</h2>
          <p className="mt-2 text-sm text-muted-foreground">Unconfirmed items are questions to take to Medicare Plan Finder, SHIP, the plan, provider, or pharmacy—not automatic reasons to reject a plan.</p>
        </section>

        {grouped.map((category) => (
          <section key={category} className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
            <h2 className="font-display text-xl font-bold text-foreground">{category}</h2>
            <div className="mt-4 space-y-4">
              {MEDICARE_CHECKLIST.filter((item) => item.category === category).map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-background/70 p-4">
                  <label htmlFor={`status-${item.id}`} className="block text-sm font-bold text-foreground">{item.prompt}</label>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.verification}</p>
                  <select id={`status-${item.id}`} value={statuses[item.id]} onChange={(event) => setStatuses((current) => ({ ...current, [item.id]: event.target.value as ChecklistStatus }))} className="mt-3 min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground sm:max-w-xs">
                    <option value="unconfirmed">Needs verification</option><option value="confirmed">Confirmed</option><option value="not-applicable">Not applicable</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        ))}

        <OfficialSources sources={[
          { label: "Medicare Plan Finder", href: "https://www.medicare.gov/plan-compare/", note: "Official plan comparison, drug, pharmacy, and estimated-cost tool." },
          { label: "Find local SHIP counseling", href: "https://www.shiphelp.org/", note: "Free state-based Medicare counseling and assistance." },
          { label: "Medicare coverage choices", href: "https://www.medicare.gov/health-drug-plans/health-plans/your-coverage-options", note: "Official overview of Original Medicare and Medicare Advantage choices." },
          { label: "Turning 65 timeline", href: "/medicare-care-costs/turning-65", note: "Connect enrollment timing, employer coverage, HSA, Part D, Medigap, and IRMAA questions." },
        ]} />
        <SaveNavigatorAction recommendationId="cost_program_guide" sourceRoute="/tools/medicare-plan-verification-checklist" title="Save the Medicare verification step" description="Only the fixed Medicare-program review action is saved. Checklist statuses and plan-comparison details are not stored in My Plan." />
        <div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="button" onClick={copy}><CheckCircle2 className="h-4 w-4" /> {copied ? "Copied" : "Copy checklist"}</Button><Button type="button" variant="outline" onClick={() => window.print()}>Print or save as PDF</Button><Button type="button" variant="ghost" onClick={reset}>Reset</Button></div>
        <DisclaimerBox />
      </div>
    </>
  );
};
