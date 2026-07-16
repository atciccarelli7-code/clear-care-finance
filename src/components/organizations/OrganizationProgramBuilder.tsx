import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, FileCheck2, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  organizationAudiences,
  organizationPriorities,
  organizationProfiles,
  organizationTimelines,
  type OrganizationAudienceId,
  type OrganizationPriorityId,
  type OrganizationProfileId,
  type OrganizationTimelineId,
} from "@/data/organizationOffering";
import {
  buildOrganizationProgramPlan,
  organizationProgramPlanToText,
  type OrganizationProgramBuilderInput,
} from "@/lib/organizationProgramBuilder";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

type BuilderDraft = Partial<OrganizationProgramBuilderInput>;

const selectClassName = "mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring";

export const OrganizationProgramBuilder = () => {
  const [draft, setDraft] = useState<BuilderDraft>({});
  const [submitted, setSubmitted] = useState<OrganizationProgramBuilderInput | null>(null);
  const [feedback, setFeedback] = useState("");
  const started = useRef(false);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const plan = useMemo(() => submitted ? buildOrganizationProgramPlan(submitted) : null, [submitted]);

  const update = <Key extends keyof OrganizationProgramBuilderInput>(key: Key, value: OrganizationProgramBuilderInput[Key]) => {
    if (!started.current) {
      trackGrowthEvent("organization_program_builder_started", { entry_surface: "organization" });
      started.current = true;
    }
    setDraft((current) => ({ ...current, [key]: value }));
    setSubmitted(null);
    setFeedback("");
  };

  const isComplete = Boolean(draft.profile && draft.audience && draft.priority && draft.timeline);

  const buildPlan = () => {
    if (!isComplete) return;
    const input = draft as OrganizationProgramBuilderInput;
    setSubmitted(input);
    trackGrowthEvent("organization_program_plan_created", { entry_surface: "organization", action_id: "program_brief" });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const copyPlan = async () => {
    if (!submitted || !plan) return;
    try {
      await navigator.clipboard.writeText(organizationProgramPlanToText(submitted, plan));
      setFeedback("Program brief copied. Remove anything sensitive before sharing it outside your organization.");
      trackGrowthEvent("organization_program_plan_action", { entry_surface: "organization", action_id: "copy" });
    } catch {
      setFeedback("Copy was blocked by the browser. Use Print or save as PDF instead.");
    }
  };

  const printPlan = () => {
    trackGrowthEvent("organization_program_plan_action", { entry_surface: "organization", action_id: "print" });
    window.print();
  };

  const reset = () => {
    setDraft({});
    setSubmitted(null);
    setFeedback("");
    started.current = false;
    trackGrowthEvent("organization_program_plan_action", { entry_surface: "organization", action_id: "reset" });
  };

  return (
    <section id="program-builder" className="scroll-mt-28 rounded-[2rem] border border-primary/20 bg-primary-soft/20 p-5 shadow-card md:p-8" aria-labelledby="program-builder-title">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Private program planner</div>
          <h2 id="program-builder-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Build a review-ready starting brief.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Choose four fixed options. The planner assembles a program, implementation sequence, team, measurement boundary, and due-diligence starting point from products that are live today.</p>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-background/80 p-4 text-sm leading-relaxed">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p><strong>No names, employer identifiers, patient details, plan data, or free text.</strong> Selections remain in this browser tab, are not added to the URL or saved, and are not sent as answer-level analytics.</p>
            </div>
          </div>
        </div>

        <form className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6" onSubmit={(event) => { event.preventDefault(); buildPlan(); }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Organization type
              <select className={selectClassName} value={draft.profile ?? ""} onChange={(event) => update("profile", event.target.value as OrganizationProfileId)}>
                <option value="" disabled>Select one</option>
                {organizationProfiles.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Primary audience
              <select className={selectClassName} value={draft.audience ?? ""} onChange={(event) => update("audience", event.target.value as OrganizationAudienceId)}>
                <option value="" disabled>Select one</option>
                {organizationAudiences.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              First priority
              <select className={selectClassName} value={draft.priority ?? ""} onChange={(event) => update("priority", event.target.value as OrganizationPriorityId)}>
                <option value="" disabled>Select one</option>
                {organizationPriorities.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Planning horizon
              <select className={selectClassName} value={draft.timeline ?? ""} onChange={(event) => update("timeline", event.target.value as OrganizationTimelineId)}>
                <option value="" disabled>Select one</option>
                {organizationTimelines.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="hero" disabled={!isComplete}>Build program brief <ArrowRight className="h-4 w-4" /></Button>
            <Button type="button" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
          </div>
        </form>
      </div>

      {plan && submitted && (
        <div className="mt-8 rounded-[2rem] border border-border bg-background p-5 md:p-8" aria-live="polite">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary"><FileCheck2 className="h-4 w-4" /> Recommended starting brief</div>
              <h3 ref={resultRef} tabIndex={-1} className="mt-4 rounded font-display text-2xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-3xl">{plan.title}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{plan.summary}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col print:hidden">
              <Button type="button" onClick={copyPlan}><Copy className="h-4 w-4" /> Copy brief</Button>
              <Button type="button" variant="outline" onClick={printPlan}><Printer className="h-4 w-4" /> Print or save PDF</Button>
            </div>
          </div>
          {feedback && <p className="mt-4 text-sm font-semibold text-primary" role="status">{feedback}</p>}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Participant pathway</div>
              <div className="mt-3 space-y-3">
                {plan.primaryProgram.modules.map((module, index) => (
                  <Link key={module.href} to={module.href} className="group flex gap-4 rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:bg-primary-soft/15" onClick={() => trackGrowthEvent("organization_resource_opened", { entry_surface: "organization", destination_id: plan.primaryProgram.id, action_id: `module_${index + 1}` })}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">{index + 1}</span>
                    <span><strong className="block text-sm group-hover:text-primary">{module.title}</strong><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{module.description}</span></span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Included organization deliverables</div>
              <ul className="mt-4 space-y-3">
                {plan.primaryProgram.organizationDeliverables.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}
              </ul>
              {plan.supportingPrograms.length > 0 && <div className="mt-6 rounded-2xl bg-muted/60 p-4"><div className="text-sm font-bold">Possible second phase</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.supportingPrograms.map((item) => item.title).join(" and ")}. Add only after the first audience and learning question are working.</p></div>}
            </div>
          </div>

          <div className="mt-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Implementation path</div>
            <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {plan.launchPlan.map((item) => <li key={item.phase} className="rounded-2xl border border-border p-4"><div className="font-display text-lg font-bold">{item.phase}</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.action}</p><p className="mt-3 text-xs leading-relaxed"><strong>Decision evidence:</strong> {item.evidence}</p></li>)}
            </ol>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <details className="rounded-2xl border border-border p-5" open><summary className="cursor-pointer font-display text-lg font-bold">Accountable team</summary><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{plan.stakeholders.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <details className="rounded-2xl border border-border p-5"><summary className="cursor-pointer font-display text-lg font-bold">Measurement and claims boundary</summary><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{plan.measurement.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <details className="rounded-2xl border border-border p-5 lg:col-span-2"><summary className="cursor-pointer font-display text-lg font-bold">Privacy and scope guardrails</summary><ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">{plan.guardrails.map((item) => <li key={item} className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}</ul></details>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-primary-soft/35 p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <p className="max-w-2xl text-sm leading-relaxed"><strong>Ready for a scoped review?</strong> Share the non-sensitive brief internally, identify the accountable owner, then contact CAF without including employee, patient, plan, medical, or financial details.</p>
            <Button asChild variant="hero" className="shrink-0"><Link to="/contact" onClick={() => trackGrowthEvent("organization_contact_selected", { entry_surface: "organization", cta_type: "program_review" })}>Request program review <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      )}
    </section>
  );
};
