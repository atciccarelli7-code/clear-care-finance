import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardCheck, Copy, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  patientEducationFocuses,
  patientEducationModules,
  patientEducationScales,
  patientEducationSettings,
  patientEducationTimelines,
  type PatientEducationFocusId,
  type PatientEducationModuleId,
  type PatientEducationScaleId,
  type PatientEducationSettingId,
  type PatientEducationTimelineId,
} from "@/data/patientEducationOffering";
import {
  buildPatientEducationPilotPlan,
  patientEducationPilotPlanToText,
  type PatientEducationPilotInput,
} from "@/lib/patientEducationPilot";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

type PilotDraft = Partial<PatientEducationPilotInput>;

const selectClassName =
  "mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

export const PatientEducationPilotBuilder = () => {
  const [draft, setDraft] = useState<PilotDraft>({});
  const [submitted, setSubmitted] = useState<PatientEducationPilotInput | null>(null);
  const [feedback, setFeedback] = useState("");
  const started = useRef(false);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const plan = useMemo(() => (submitted ? buildPatientEducationPilotPlan(submitted) : null), [submitted]);

  const update = <Key extends keyof PatientEducationPilotInput>(key: Key, value: PatientEducationPilotInput[Key]) => {
    if (!started.current) {
      trackGrowthEvent("organization_brief_started", { entry_surface: "patient_education_systems", action_id: "pilot_builder" });
      started.current = true;
    }
    setDraft((current) => ({ ...current, [key]: value }));
    setSubmitted(null);
    setFeedback("");
  };

  const isComplete = Boolean(draft.setting && draft.module && draft.scale && draft.timeline && draft.focus);

  const buildPlan = () => {
    if (!isComplete) return;
    const input = draft as PatientEducationPilotInput;
    setSubmitted(input);
    trackGrowthEvent("organization_brief_completed", { entry_surface: "patient_education_systems", action_id: input.module });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const copyPlan = async () => {
    if (!submitted || !plan) return;
    try {
      await navigator.clipboard.writeText(patientEducationPilotPlanToText(submitted, plan));
      setFeedback("Pilot brief copied. Keep it non-identifying and complete local clinical, legal, privacy, security, and accessibility review before use.");
      trackGrowthEvent("organization_program_plan_action", { entry_surface: "patient_education_systems", action_id: "copy_pilot_brief" });
    } catch {
      setFeedback("Copy was blocked by the browser. Use Print or save as PDF instead.");
    }
  };

  const printPlan = () => {
    trackGrowthEvent("organization_program_plan_action", { entry_surface: "patient_education_systems", action_id: "print_pilot_brief" });
    window.print();
  };

  const reset = () => {
    setDraft({});
    setSubmitted(null);
    setFeedback("");
    started.current = false;
    trackGrowthEvent("organization_program_plan_action", { entry_surface: "patient_education_systems", action_id: "reset_pilot_brief" });
  };

  return (
    <section id="pilot-builder" className="scroll-mt-28 rounded-[2rem] border border-primary/20 bg-primary-soft/20 p-5 shadow-card md:p-8" aria-labelledby="pilot-builder-title">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Private pilot scoping tool</div>
          <h2 id="pilot-builder-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Build a non-identifying pilot starting brief.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Choose five fixed options. The tool assembles a proposed guide package, accountable team, implementation sequence, measures, prerequisites, and claims boundaries.
          </p>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-background/80 p-4 text-sm leading-relaxed">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p><strong>No patient information and no free text.</strong> Selections remain in this browser tab. They are not saved, added to the URL, or sent as answer-level analytics.</p>
            </div>
          </div>
        </div>

        <form className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6" onSubmit={(event) => { event.preventDefault(); buildPlan(); }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Care setting
              <select className={selectClassName} value={draft.setting ?? ""} onChange={(event) => update("setting", event.target.value as PatientEducationSettingId)}>
                <option value="" disabled>Select one</option>
                {patientEducationSettings.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              First flagship module
              <select className={selectClassName} value={draft.module ?? ""} onChange={(event) => update("module", event.target.value as PatientEducationModuleId)}>
                <option value="" disabled>Select one</option>
                {patientEducationModules.map((option) => <option key={option.id} value={option.id}>{option.shortTitle}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Pilot scale
              <select className={selectClassName} value={draft.scale ?? ""} onChange={(event) => update("scale", event.target.value as PatientEducationScaleId)}>
                <option value="" disabled>Select one</option>
                {patientEducationScales.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Planning horizon
              <select className={selectClassName} value={draft.timeline ?? ""} onChange={(event) => update("timeline", event.target.value as PatientEducationTimelineId)}>
                <option value="" disabled>Select one</option>
                {patientEducationTimelines.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Primary evaluation focus
              <select className={selectClassName} value={draft.focus ?? ""} onChange={(event) => update("focus", event.target.value as PatientEducationFocusId)}>
                <option value="" disabled>Select one</option>
                {patientEducationFocuses.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="hero" disabled={!isComplete}>Build pilot brief <ArrowRight className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
          </div>
        </form>
      </div>

      {plan && submitted && (
        <div className="mt-8 rounded-[2rem] border border-border bg-background p-5 md:p-8" aria-live="polite">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary"><ClipboardCheck className="h-4 w-4" /> Proposed pilot starting brief</div>
              <h3 ref={resultRef} tabIndex={-1} className="mt-4 rounded font-display text-2xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-3xl">{plan.title}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{plan.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border border-border px-3 py-1">Risk tier: {plan.module.riskTier}</span>
                <span className="rounded-full border border-border px-3 py-1">Status: {plan.module.status}</span>
                {plan.module.clinicalDomains.map((domain) => <span key={domain} className="rounded-full border border-border px-3 py-1">{domain}</span>)}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col print:hidden">
              <Button type="button" onClick={copyPlan}><Copy className="h-4 w-4" /> Copy brief</Button>
              <Button type="button" variant="outline" onClick={printPlan}><Printer className="h-4 w-4" /> Print or save PDF</Button>
            </div>
          </div>
          {feedback && <p className="mt-4 text-sm font-semibold text-primary" role="status">{feedback}</p>}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Proposed package</div>
              <ul className="mt-4 space-y-3">
                {plan.packageAssets.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}
              </ul>
            </section>
            <section>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Required team</div>
              <ul className="mt-4 space-y-3">
                {plan.stakeholders.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}
              </ul>
            </section>
          </div>

          <section className="mt-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Implementation sequence</div>
            <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {plan.phases.map((item) => (
                <li key={item.phase} className="rounded-2xl border border-border p-4">
                  <div className="font-display text-lg font-bold">{item.phase}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.action}</p>
                  <p className="mt-3 text-xs leading-relaxed"><strong>Decision evidence:</strong> {item.evidence}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <details className="rounded-2xl border border-border p-5" open>
              <summary className="cursor-pointer font-display text-lg font-bold">Pilot measures</summary>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{plan.measures.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
            <details className="rounded-2xl border border-border p-5">
              <summary className="cursor-pointer font-display text-lg font-bold">Prerequisites</summary>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{plan.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
            <details className="rounded-2xl border border-border p-5 lg:col-span-2">
              <summary className="cursor-pointer font-display text-lg font-bold">Privacy, clinical, and claims boundaries</summary>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">{plan.boundaries.map((item) => <li key={item} className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul>
            </details>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-primary-soft/35 p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <p className="max-w-2xl text-sm leading-relaxed"><strong>Ready for a controlled discovery conversation?</strong> Share this brief internally, identify the accountable sponsor and required reviewers, then contact CAF without patient, employee, plan, or case-specific information.</p>
            <Button asChild variant="hero" className="shrink-0"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "patient_education_systems", action_id: "pilot_brief" })}>Request pilot review <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      )}
    </section>
  );
};
