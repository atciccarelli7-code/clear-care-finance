import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, ClipboardCopy, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buyerOrganizationTypes,
  buyerOwnerCoverage,
  buyerPilotSettings,
  buyerPriorities,
  buyerPrivacyBoundaries,
  buyerReviewStages,
  buyerRoles,
  buildCareReadinessBuyerBrief,
  careReadinessBuyerBriefToText,
  type CareReadinessBuyerBriefInput,
} from "@/lib/careReadinessBuyerBrief";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const selectClassName =
  "mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

type BuyerBriefDraft = Partial<CareReadinessBuyerBriefInput>;

export const CareReadinessBuyerBrief = () => {
  const [draft, setDraft] = useState<BuyerBriefDraft>({});
  const [submitted, setSubmitted] = useState<CareReadinessBuyerBriefInput | null>(null);
  const [feedback, setFeedback] = useState("");
  const started = useRef(false);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const plan = useMemo(() => (submitted ? buildCareReadinessBuyerBrief(submitted) : null), [submitted]);

  const update = <Key extends keyof CareReadinessBuyerBriefInput>(key: Key, value: CareReadinessBuyerBriefInput[Key]) => {
    if (!started.current) {
      trackGrowthEvent("organization_brief_started", { entry_surface: "blood_thinner_readiness", action_id: "controlled_buyer_brief" });
      started.current = true;
    }
    setDraft((current) => ({ ...current, [key]: value }));
    setSubmitted(null);
    setFeedback("");
  };

  const isComplete = Boolean(
    draft.organizationType && draft.role && draft.pilotSetting && draft.priority && draft.reviewStage && draft.ownerCoverage && draft.privacyBoundary,
  );

  const buildBrief = () => {
    if (!isComplete) return;
    const input = draft as CareReadinessBuyerBriefInput;
    setSubmitted(input);
    trackGrowthEvent("organization_brief_completed", { entry_surface: "blood_thinner_readiness", action_id: input.reviewStage });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const copyBrief = async () => {
    if (!submitted || !plan) return;
    try {
      await navigator.clipboard.writeText(careReadinessBuyerBriefToText(submitted, plan));
      setFeedback("Controlled review brief copied. Keep the email non-identifying and do not attach patient, employee, plan, or confidential records.");
      trackGrowthEvent("organization_program_plan_action", { entry_surface: "blood_thinner_readiness", action_id: "copy_controlled_buyer_brief" });
    } catch {
      setFeedback("Copy was blocked by the browser. Print or save the page instead.");
    }
  };

  const reset = () => {
    setDraft({});
    setSubmitted(null);
    setFeedback("");
    started.current = false;
    trackGrowthEvent("organization_program_plan_action", { entry_surface: "blood_thinner_readiness", action_id: "reset_controlled_buyer_brief" });
  };

  return (
    <section id="buyer-brief" className="mx-auto max-w-7xl rounded-[2rem] border border-primary/20 bg-primary-soft/20 p-5 shadow-card md:p-8" aria-labelledby="buyer-brief-title">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Controlled hospital review intake</div>
          <h2 id="buyer-brief-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Determine the next safe institutional step.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Choose seven fixed options. The brief identifies whether the organization is ready only for problem discovery, a cross-functional controlled review, or a potential design-partner pathway.
          </p>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-background/80 p-4 text-sm leading-relaxed">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p><strong>No free text and no PHI.</strong> Do not send patient records, medication orders, case narratives, screenshots, claims, contracts, or confidential files. Fixed choices remain in this browser tab.</p>
            </div>
          </div>
        </div>

        <form className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6" onSubmit={(event) => { event.preventDefault(); buildBrief(); }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Organization type
              <select className={selectClassName} value={draft.organizationType ?? ""} onChange={(event) => update("organizationType", event.target.value as CareReadinessBuyerBriefInput["organizationType"])}>
                <option value="" disabled>Select one</option>
                {buyerOrganizationTypes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Your role
              <select className={selectClassName} value={draft.role ?? ""} onChange={(event) => update("role", event.target.value as CareReadinessBuyerBriefInput["role"])}>
                <option value="" disabled>Select one</option>
                {buyerRoles.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              First setting
              <select className={selectClassName} value={draft.pilotSetting ?? ""} onChange={(event) => update("pilotSetting", event.target.value as CareReadinessBuyerBriefInput["pilotSetting"])}>
                <option value="" disabled>Select one</option>
                {buyerPilotSettings.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Primary decision problem
              <select className={selectClassName} value={draft.priority ?? ""} onChange={(event) => update("priority", event.target.value as CareReadinessBuyerBriefInput["priority"])}>
                <option value="" disabled>Select one</option>
                {buyerPriorities.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Current review stage
              <select className={selectClassName} value={draft.reviewStage ?? ""} onChange={(event) => update("reviewStage", event.target.value as CareReadinessBuyerBriefInput["reviewStage"])}>
                <option value="" disabled>Select one</option>
                {buyerReviewStages.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Internal owner coverage
              <select className={selectClassName} value={draft.ownerCoverage ?? ""} onChange={(event) => update("ownerCoverage", event.target.value as CareReadinessBuyerBriefInput["ownerCoverage"])}>
                <option value="" disabled>Select one</option>
                {buyerOwnerCoverage.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Privacy boundary
              <select className={selectClassName} value={draft.privacyBoundary ?? ""} onChange={(event) => update("privacyBoundary", event.target.value as CareReadinessBuyerBriefInput["privacyBoundary"])}>
                <option value="" disabled>Confirmation required</option>
                {buyerPrivacyBoundaries.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="hero" disabled={!isComplete}>Build controlled review brief <ArrowRight className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
          </div>
        </form>
      </div>

      {plan && submitted && (
        <div className="mt-8 rounded-[2rem] border border-border bg-background p-5 md:p-8" aria-live="polite">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Building2 className="h-4 w-4" /> Controlled review result</div>
              <h3 ref={resultRef} tabIndex={-1} className="mt-4 rounded font-display text-2xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-3xl">{plan.label}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{plan.summary}</p>
            </div>
            <Button type="button" onClick={copyBrief} className="print:hidden"><ClipboardCopy className="h-4 w-4" /> Copy brief</Button>
          </div>

          {feedback && <p className="mt-4 text-sm font-semibold text-primary" role="status">{feedback}</p>}

          <div className="mt-7 rounded-2xl border border-primary/20 bg-primary-soft/25 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Recommended next step</div>
            <p className="mt-2 leading-relaxed">{plan.nextStep}</p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <section>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Required attendees</div>
              <ul className="mt-4 space-y-3">{plan.requiredAttendees.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul>
            </section>
            <section>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Prerequisites</div>
              <ul className="mt-4 space-y-3">{plan.prerequisites.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul>
            </section>
          </div>

          <details className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950" open>
            <summary className="cursor-pointer font-display text-lg font-bold">Stop conditions</summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{plan.stopConditions.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
          <details className="mt-4 rounded-2xl border border-border p-5">
            <summary className="cursor-pointer font-display text-lg font-bold">Privacy, clinical, and commercial boundaries</summary>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{plan.boundaries.map((item) => <li key={item} className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul>
          </details>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-primary-soft/35 p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <p className="max-w-2xl text-sm leading-relaxed"><strong>Use the copied brief for a controlled inquiry.</strong> Identify the accountable sponsor and required reviewers before attaching any internal material.</p>
            <Button asChild variant="hero" className="shrink-0"><Link to="/contact#organization-review" onClick={() => trackGrowthEvent("organization_contact_opened", { entry_surface: "blood_thinner_readiness", action_id: plan.status })}>Request controlled review <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      )}
    </section>
  );
};
