import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  PhoneCall,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { SelectQuestion } from "@/components/shared/DecisionResultPanel";
import { Button } from "@/components/ui/button";
import {
  buildMedicalAppointmentCostPlan,
  createMedicalAppointmentCostPlanText,
  DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS,
  type MedicalAppointmentCostAnswers,
} from "@/lib/medicalAppointmentCostPreparation";
import {
  PREVENTIVE_COST_TOOL_ID,
  trackPreventiveCostEvent,
  type PreventiveCostHandoffId,
} from "@/lib/preventiveCostAnalytics";
import { useSeo } from "@/lib/seo";

const STATUS_OPTIONS = [
  { value: "needs-check", label: "Needs verification" },
  { value: "confirmed", label: "Confirmed" },
  { value: "not-applicable", label: "Not applicable" },
];

const STEPS = [
  { id: "situation", label: "Care situation" },
  { id: "preparation", label: "What is verified" },
  { id: "next_call", label: "Next call" },
] as const;

const OFFICIAL_HANDOFFS: Array<{
  id: PreventiveCostHandoffId;
  title: string;
  description: string;
  href: string;
}> = [
  {
    id: "good_faith_estimate",
    title: "Good Faith Estimate rights",
    description: "CMS guidance for people who are uninsured or choose not to use insurance for scheduled care.",
    href: "https://www.cms.gov/medical-bill-rights/help/guides/good-faith-estimate",
  },
  {
    id: "consumer_rights",
    title: "Medical-bill consumer protections",
    description: "Official federal information about surprise bills, complaints, and dispute pathways.",
    href: "https://www.cms.gov/medical-bill-rights",
  },
  {
    id: "hospital_price_transparency",
    title: "Hospital price transparency",
    description: "CMS explanation of hospital machine-readable files and consumer-friendly displays.",
    href: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
  },
];

const trackHandoff = (handoffId: PreventiveCostHandoffId) => {
  trackPreventiveCostEvent("preventive_cost_handoff_opened", {
    tool_id: PREVENTIVE_COST_TOOL_ID,
    handoff_id: handoffId,
  });
};

export const MedicalAppointmentCostPreparationPage = () => {
  useSeo({
    title: "Medical Appointment Cost Preparation Tool",
    description: "Prepare questions about networks, authorizations, estimates, facility fees, separate bills, financial assistance, and post-visit bill review before planned care.",
    canonicalPath: "/tools/medical-appointment-cost-preparation",
  });

  const [answers, setAnswers] = useState<MedicalAppointmentCostAnswers>(DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS);
  const [step, setStep] = useState(0);
  const [planVisible, setPlanVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const viewedRef = useRef(false);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const plan = useMemo(() => buildMedicalAppointmentCostPlan(answers), [answers]);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackPreventiveCostEvent("preventive_cost_tool_viewed", { tool_id: PREVENTIVE_COST_TOOL_ID });
  }, []);

  const markStarted = (stageId: "situation" | "preparation" | "next_call") => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackPreventiveCostEvent("preventive_cost_tool_started", {
      tool_id: PREVENTIVE_COST_TOOL_ID,
      stage_id: stageId,
    });
  };

  const update = <K extends keyof MedicalAppointmentCostAnswers>(key: K, value: MedicalAppointmentCostAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setPlanVisible(false);
    setCopied(false);
    markStarted(STEPS[step]?.id ?? "situation");
  };

  const next = () => {
    markStarted(STEPS[step].id);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const buildPlan = () => {
    markStarted("next_call");
    setPlanVisible(true);
    if (!completedRef.current) {
      completedRef.current = true;
      trackPreventiveCostEvent("preventive_cost_tool_completed", {
        tool_id: PREVENTIVE_COST_TOOL_ID,
        stage_id: "plan",
      });
    }
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const trackAction = (actionId: "copy" | "print" | "reset" | "my_plan") => {
    trackPreventiveCostEvent("preventive_cost_plan_action", {
      tool_id: PREVENTIVE_COST_TOOL_ID,
      action_id: actionId,
    });
  };

  const copyPlan = async () => {
    trackAction("copy");
    try {
      await navigator.clipboard.writeText(createMedicalAppointmentCostPlanText(plan));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    trackAction("reset");
    setAnswers(DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS);
    setStep(0);
    setPlanVisible(false);
    setCopied(false);
    startedRef.current = false;
    completedRef.current = false;
    window.setTimeout(() => document.getElementById("cost-preparation-form")?.focus(), 0);
  };

  return (
    <>
      <PageHero
        eyebrow="Before planned medical care"
        title="Medical Appointment Cost Preparation"
        description="Build a private, practical list of questions for the provider and health plan before a visit, test, treatment, or procedure."
      />

      <div className="container max-w-5xl space-y-8 py-10 md:py-16">
        <section className="rounded-2xl border border-primary/20 bg-primary-soft/25 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Private by design</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use broad categories only. Do not enter names, diagnoses, medications, member IDs, account numbers, dates of birth, claim numbers, or dollar amounts. Answers stay in this browser tab and are not saved in the URL or My Plan.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 dark:border-amber-800 dark:bg-amber-950/20">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" /> Urgent or emergency care
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Do not delay emergency or urgently needed care to research cost, obtain an estimate, or resolve an insurance question. This tool is for preparation when it is safe to use.
          </p>
        </section>

        <section
          id="cost-preparation-form"
          tabIndex={-1}
          className="rounded-3xl border border-border bg-card p-5 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-7"
          aria-labelledby="cost-preparation-heading"
        >
          <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step {step + 1} of {STEPS.length}</p>
              <h2 id="cost-preparation-heading" className="mt-1 font-display text-2xl font-bold text-foreground">{STEPS[step].label}</h2>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">About 4–7 minutes</p>
          </div>

          <div className="mt-5" role="progressbar" aria-label="Cost preparation progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
            <ol className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted-foreground" aria-hidden="true">
              {STEPS.map((item, index) => <li key={item.id} className={index <= step ? "text-primary" : undefined}>{item.label}</li>)}
            </ol>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {step === 0 && (
              <>
                <SelectQuestion id="care-timing" label="How soon is the care?" helper="Choose a broad timing category. This is not medical triage." value={answers.timing} onChange={(value) => update("timing", value as MedicalAppointmentCostAnswers["timing"])} options={[
                  { value: "not-sure", label: "Not sure" }, { value: "planned", label: "Planned, not yet scheduled" }, { value: "scheduled-soon", label: "Scheduled or expected soon" }, { value: "urgent-or-emergency", label: "Urgent or emergency" },
                ]} />
                <SelectQuestion id="care-setting" label="What setting is expected?" helper="The setting can affect network, facility-fee, authorization, and separate-bill questions." value={answers.setting} onChange={(value) => update("setting", value as MedicalAppointmentCostAnswers["setting"])} options={[
                  { value: "not-sure", label: "Not sure" }, { value: "clinician-office", label: "Clinician office" }, { value: "hospital-outpatient", label: "Hospital outpatient department" }, { value: "ambulatory-surgery", label: "Surgery center or hospital procedure" }, { value: "imaging-laboratory", label: "Imaging or laboratory" }, { value: "therapy", label: "Therapy or recurring treatment" }, { value: "urgent-emergency", label: "Urgent care or emergency department" },
                ]} />
                <SelectQuestion id="coverage-situation" label="What coverage situation applies?" helper="Do not enter a plan name, member ID, or identifying information." value={answers.coverage} onChange={(value) => update("coverage", value as MedicalAppointmentCostAnswers["coverage"])} options={[
                  { value: "other-not-sure", label: "Other or not sure" }, { value: "private", label: "Employer or individual private insurance" }, { value: "medicare", label: "Medicare" }, { value: "medicaid", label: "Medicaid" }, { value: "uninsured-self-pay", label: "Uninsured or choosing self-pay" },
                ]} />
              </>
            )}

            {step === 1 && (
              <>
                <SelectQuestion id="network-status" label="Network status" helper="Have both the facility and separately billing professionals been verified?" value={answers.networkStatus} onChange={(value) => update("networkStatus", value as MedicalAppointmentCostAnswers["networkStatus"])} options={STATUS_OPTIONS} />
                <SelectQuestion id="authorization-status" label="Authorization or referral" helper="Approval is useful preparation, but it is not a guarantee of payment." value={answers.authorizationStatus} onChange={(value) => update("authorizationStatus", value as MedicalAppointmentCostAnswers["authorizationStatus"])} options={STATUS_OPTIONS} />
                <SelectQuestion id="estimate-status" label="Written estimate" helper="An estimate may omit services and does not guarantee the final price." value={answers.estimateStatus} onChange={(value) => update("estimateStatus", value as MedicalAppointmentCostAnswers["estimateStatus"])} options={STATUS_OPTIONS} />
                <SelectQuestion id="facility-fee-status" label="Facility fee" helper="Hospital outpatient and provider-based settings may bill a facility charge separately." value={answers.facilityFeeStatus} onChange={(value) => update("facilityFeeStatus", value as MedicalAppointmentCostAnswers["facilityFeeStatus"])} options={STATUS_OPTIONS} />
                <SelectQuestion id="separate-bills-status" label="Possible separate bills" helper="Consider anesthesia, pathology, radiology, laboratory, interpretation, equipment, and other professional services." value={answers.separateBillsStatus} onChange={(value) => update("separateBillsStatus", value as MedicalAppointmentCostAnswers["separateBillsStatus"])} options={STATUS_OPTIONS} />
              </>
            )}

            {step === 2 && (
              <>
                <SelectQuestion id="next-call-owner" label="Who is the most likely next call?" helper="The plan will still include both provider and health-plan questions." value={answers.nextCallOwner} onChange={(value) => update("nextCallOwner", value as MedicalAppointmentCostAnswers["nextCallOwner"])} options={[
                  { value: "not-sure", label: "Not sure" }, { value: "provider", label: "Provider or facility" }, { value: "health-plan", label: "Insurer or health plan" }, { value: "both", label: "Both" },
                ]} />
                <div className="rounded-2xl border border-primary/15 bg-primary-soft/20 p-5">
                  <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">What the plan will organize</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Questions, fixed call scripts, documents to retain, separate bills to verify, payment and assistance questions, and what to do after the EOB or bill arrives.</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
            {step > 0 && <Button type="button" variant="outline" onClick={() => setStep((current) => current - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>}
            {step < STEPS.length - 1
              ? <Button type="button" onClick={next}>Continue <ArrowRight className="h-4 w-4" /></Button>
              : <Button type="button" onClick={buildPlan}>Build my cost preparation plan <ArrowRight className="h-4 w-4" /></Button>}
          </div>
        </section>

        {planVisible && (
          <div className="space-y-5" aria-live="polite">
            <section className="rounded-3xl border border-primary/25 bg-primary-soft/30 p-5 shadow-card md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Cost Preparation Plan</p>
              <h2 ref={resultRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold leading-tight text-foreground outline-none md:text-3xl">{plan.headline}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{plan.summary}</p>
              {plan.urgentCareNotice && <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">{plan.urgentCareNotice}</p>}
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              {plan.sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-foreground">{section.title}</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {section.items.map((item) => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
                  </ul>
                </section>
              ))}
            </div>

            <section className="rounded-2xl border border-primary/20 bg-card p-5 shadow-sm md:p-6">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-foreground"><PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" /> Fixed call scripts</h3>
              <p className="mt-2 text-sm text-muted-foreground">These scripts contain no personal information. Add only the minimum details needed when you contact the responsible organization.</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{plan.callScripts.map((script) => <li key={script} className="rounded-xl bg-muted/40 p-4">{script}</li>)}</ul>
            </section>

            <section className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 dark:border-amber-800 dark:bg-amber-950/20">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" /> Important limits</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{plan.limits.map((item) => <li key={item}>• {item}</li>)}</ul>
            </section>

            <SaveNavigatorAction
              recommendationId="cost_prepare_care"
              sourceRoute="/tools/medical-appointment-cost-preparation"
              title="Save the fixed preparation step in My Plan"
              description="Only the fixed action is saved. Your care setting, coverage category, verification statuses, and generated plan are not stored in My Plan."
              onAdded={() => trackAction("my_plan")}
            />

            <div className="flex flex-col gap-3 sm:flex-row print:hidden">
              <Button type="button" onClick={copyPlan}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy plan"}</Button>
              <Button type="button" variant="outline" onClick={() => { trackAction("print"); window.print(); }}><Printer className="h-4 w-4" /> Print or save as PDF</Button>
              <Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Start over</Button>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Official verification and next steps</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Rules and prices can change. Use current official guidance and the documents that control the specific service.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link onClick={() => trackHandoff("medical_bill_toolkit")} to="/insurance/medical-bill-review-toolkit" className="rounded-xl border border-primary/20 bg-primary-soft/20 p-4 hover:border-primary/40">
              <span className="flex items-start justify-between gap-2 text-sm font-bold text-primary">Medical Bill Review Toolkit<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Continue here after an EOB, Medicare notice, Medicaid notice, or bill arrives.</span>
            </Link>
            {OFFICIAL_HANDOFFS.map((item) => (
              <a key={item.id} onClick={() => trackHandoff(item.id)} href={item.href} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-background p-4 hover:border-primary/30">
                <span className="flex items-start justify-between gap-2 text-sm font-bold text-primary">{item.title}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Source review: July 16, 2026. The Good Faith Estimate and No Surprises pathways have eligibility limits; verify the current official CMS guidance for the specific situation.</p>
        </section>

        <DisclaimerBox />
      </div>
    </>
  );
};

export default MedicalAppointmentCostPreparationPage;
