import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BookOpenCheck, Check, CheckCircle2, ClipboardCheck, LockKeyhole, Printer, RotateCcw, ShieldAlert, Users } from "lucide-react";
import {
  bloodThinnerMedications,
  bloodThinnerProof,
  dischargeBarriers,
  rivaroxabanRegimens,
  sharedBloodThinnerSafety,
  teachBackTasks,
  type BarrierId,
  type BloodThinnerMedicationId,
  type RivaroxabanRegimenId,
} from "@/data/bloodThinnerReadiness";
import {
  BLOOD_THINNER_STORAGE_KEY,
  evaluateBloodThinnerReadiness,
  initialBloodThinnerReadinessState,
  parseStoredReadinessState,
  trackBloodThinnerReadinessEvent,
  type BarrierStatus,
  type BloodThinnerReadinessState,
  type TeachBackResult,
} from "@/lib/bloodThinnerReadiness";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const stages: { id: BloodThinnerReadinessState["stage"]; label: string; short: string }[] = [
  { id: "medicine", label: "Match the medicine", short: "Medicine" },
  { id: "learn", label: "Review the plan", short: "Plan" },
  { id: "teach_back", label: "Demonstrate understanding", short: "Teach-back" },
  { id: "barriers", label: "Resolve real-world barriers", short: "Barriers" },
  { id: "handoff", label: "Review the handoff", short: "Handoff" },
];

const teachBackLabels: Record<TeachBackResult, string> = {
  unassessed: "Not assessed",
  passed: "Passed without prompting",
  passed_after_reteach: "Passed after re-teaching",
  blocked: "Did not pass - handoff blocked",
};

const barrierStatusLabels: Record<BarrierStatus, string> = {
  identified: "Identified - action needed",
  resolved: "Resolved",
  open_with_safe_backup: "Open with safe named backup",
  unresolved_stop: "Unresolved - stop discharge handoff",
};

const StatusPanel = ({ state }: { state: BloodThinnerReadinessState }) => {
  const evaluation = evaluateBloodThinnerReadiness(state);
  const className = evaluation.status === "demonstrated"
    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
    : evaluation.status === "blocked"
      ? "border-red-300 bg-red-50 text-red-950"
      : "border-amber-300 bg-amber-50 text-amber-950";

  return (
    <aside className={`rounded-2xl border p-5 ${className}`} aria-live="polite" data-testid="readiness-status">
      <div className="flex items-start gap-3">
        {evaluation.status === "demonstrated" ? <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" /> : <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />}
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em]">Workflow status</div>
          <h2 className="mt-1 font-display text-2xl font-bold">{evaluation.label}</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {evaluation.status === "demonstrated"
              ? "All modeled checks passed. This is a workflow demonstration, not clinical approval or an authorization to discharge."
              : `${evaluation.blockers.length} required check${evaluation.blockers.length === 1 ? "" : "s"} remain.`}
          </p>
        </div>
      </div>
    </aside>
  );
};

export const BloodThinnerReadinessWorkflow = () => {
  const [state, setState] = useState<BloodThinnerReadinessState>(() => {
    if (typeof window === "undefined") return initialBloodThinnerReadinessState();
    return parseStoredReadinessState(window.sessionStorage.getItem(BLOOD_THINNER_STORAGE_KEY)) ?? initialBloodThinnerReadinessState();
  });
  const previousStatus = useRef(evaluateBloodThinnerReadiness(state).status);
  const selectedMedication = useMemo(() => bloodThinnerMedications.find((item) => item.id === state.medicationId) ?? null, [state.medicationId]);
  const evaluation = useMemo(() => evaluateBloodThinnerReadiness(state), [state]);

  useEffect(() => {
    window.sessionStorage.setItem(BLOOD_THINNER_STORAGE_KEY, JSON.stringify(state));
    if (previousStatus.current !== evaluation.status) {
      trackBloodThinnerReadinessEvent("care_readiness_status_changed", {
        status_id: evaluation.status,
        barrier_count: evaluation.barrierCount,
        teach_back_passed_count: evaluation.passedTeachBack,
      });
      previousStatus.current = evaluation.status;
    }
  }, [evaluation, state]);

  const updateState = (updates: Partial<BloodThinnerReadinessState>) => setState((current) => ({ ...current, ...updates }));
  const selectStage = (stage: BloodThinnerReadinessState["stage"]) => {
    updateState({ stage });
    trackBloodThinnerReadinessEvent("care_readiness_stage_viewed", { stage_id: stage, mode_id: state.mode });
  };
  const selectMedication = (medicationId: BloodThinnerMedicationId) => {
    updateState({ medicationId, rivaroxabanRegimenId: medicationId === "rivaroxaban" ? state.rivaroxabanRegimenId : null });
    trackBloodThinnerReadinessEvent("care_readiness_started", { stage_id: "medicine", mode_id: state.mode });
  };
  const reset = () => {
    const next = initialBloodThinnerReadinessState();
    setState(next);
    window.sessionStorage.removeItem(BLOOD_THINNER_STORAGE_KEY);
    trackBloodThinnerReadinessEvent("care_readiness_reset");
  };
  const print = () => {
    if (!selectedMedication || (selectedMedication.id === "rivaroxaban" && !state.rivaroxabanRegimenId)) return;
    trackBloodThinnerReadinessEvent("care_readiness_printed", { status_id: evaluation.status });
    window.print();
  };

  const setTeachBack = (id: (typeof teachBackTasks)[number]["id"], result: TeachBackResult) =>
    updateState({ teachBack: { ...state.teachBack, [id]: result } });
  const setBarrier = (id: BarrierId, included: boolean) => {
    const barriers = { ...state.barriers };
    if (included) barriers[id] = "identified";
    else delete barriers[id];
    updateState({ barriers });
  };
  const setBarrierStatus = (id: BarrierId, status: BarrierStatus) => updateState({ barriers: { ...state.barriers, [id]: status } });

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="print:hidden">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950">
            <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><p><strong>Synthetic review only.</strong> Do not enter names, dates, doses, record numbers, or other patient information. Fixed-choice progress stays only in this browser tab and is never sent as answer-level analytics.</p></div>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Choose workflow view">
            <Button type="button" variant={state.mode === "staff" ? "default" : "outline"} onClick={() => updateState({ mode: "staff" })}><ClipboardCheck className="h-4 w-4" /> Staff-guided</Button>
            <Button type="button" variant={state.mode === "patient_caregiver" ? "default" : "outline"} onClick={() => updateState({ mode: "patient_caregiver" })}><Users className="h-4 w-4" /> Patient & caregiver</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="Discharge readiness steps" className="self-start rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-24">
            <ol className="space-y-2">
              {stages.map((stage, index) => (
                <li key={stage.id}>
                  <button type="button" onClick={() => selectStage(stage.id)} aria-current={state.stage === stage.id ? "step" : undefined} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${state.stage === stage.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${state.stage === stage.id ? "bg-primary-foreground text-primary" : "bg-primary-soft text-primary"}`}>{index + 1}</span>
                    <span>{stage.short}</span>
                  </button>
                </li>
              ))}
            </ol>
            <Button type="button" variant="ghost" className="mt-3 w-full" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset review</Button>
          </nav>

          <div>
            <StatusPanel state={state} />

            {state.stage === "medicine" && (
              <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7" aria-labelledby="medicine-title">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step 1 of 5</div>
                <h2 id="medicine-title" className="mt-2 font-display text-3xl font-bold">Match the exact medicine before teaching.</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">These cards are not interchangeable. Staff must match the bottle, package, or syringe to the final medication list. If the product or instructions conflict, stop and clarify.</p>
                <fieldset className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <legend className="sr-only">Choose the exact blood thinner</legend>
                  {bloodThinnerMedications.map((medication) => (
                    <button key={medication.id} type="button" aria-pressed={state.medicationId === medication.id} onClick={() => selectMedication(medication.id)} className={`min-h-24 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${state.medicationId === medication.id ? "border-primary bg-primary-soft/40 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}>
                      <span className="font-display text-xl font-bold">{medication.name}</span><span className="mt-1 block text-sm text-muted-foreground">{medication.form}</span>
                    </button>
                  ))}
                </fieldset>

                {state.medicationId === "rivaroxaban" && (
                  <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
                    <Label htmlFor="rivaroxaban-regimen" className="font-bold">Select the exact rivaroxaban regimen</Label>
                    <p className="mt-1 text-sm">The missed-dose branches differ. Do not continue without the exact prescribed schedule.</p>
                    <Select value={state.rivaroxabanRegimenId ?? undefined} onValueChange={(value) => updateState({ rivaroxabanRegimenId: value as RivaroxabanRegimenId })}>
                      <SelectTrigger id="rivaroxaban-regimen" className="mt-3 min-h-11 bg-white"><SelectValue placeholder="Choose exact regimen" /></SelectTrigger>
                      <SelectContent>{Object.entries(rivaroxabanRegimens).map(([id, regimen]) => <SelectItem key={id} value={id}>{regimen.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mt-6 space-y-4 rounded-2xl border border-border p-5">
                  <h3 className="font-display text-xl font-bold">Staff-only reconciliation hard stops</h3>
                  <div className="flex items-start gap-3"><Checkbox id="reconciled" checked={state.reconciliationConfirmed} onCheckedChange={(checked) => updateState({ reconciliationConfirmed: checked === true })} /><Label htmlFor="reconciled" className="leading-relaxed">I am simulating that the exact medicine, strength, reason, dose, schedule, next dose, duration, prescriber, pharmacy, and follow-up were reconciled against the final medication list.</Label></div>
                  <div className="flex items-start gap-3"><Checkbox id="local-plan" checked={state.localActionPlanConfirmed} onCheckedChange={(checked) => updateState({ localActionPlanConfirmed: checked === true })} /><Label htmlFor="local-plan" className="leading-relaxed">I am simulating that the organization-approved bleeding, fall/head-injury, procedure, daytime, and after-hours plan is available.</Label></div>
                </div>
              </section>
            )}

            {state.stage === "learn" && (
              <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7" aria-labelledby="learn-title">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step 2 of 5</div>
                <h2 id="learn-title" className="mt-2 font-display text-3xl font-bold">Review one safety core and one matching medicine card.</h2>
                {!selectedMedication ? <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950"><AlertTriangle className="inline h-5 w-5" /> Select the exact medicine in step 1 before using this section.</div> : (
                  <div className="mt-6 grid gap-5 xl:grid-cols-2">
                    <article className="rounded-2xl border border-border p-5">
                      <h3 className="font-display text-2xl font-bold">Safety steps for every blood thinner</h3>
                      <ul className="mt-4 space-y-3">{sharedBloodThinnerSafety.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul>
                    </article>
                    <article className="rounded-2xl border-2 border-primary/40 bg-primary-soft/15 p-5">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Matching card</div>
                      <h3 className="mt-2 font-display text-2xl font-bold">{selectedMedication.name}</h3>
                      <h4 className="mt-5 font-bold">How to take it</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">{selectedMedication.howToTake.map((item) => <li key={item}>{item}</li>)}</ul>
                      <h4 className="mt-5 font-bold">If a dose is missed</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">{selectedMedication.missedDose.map((item) => <li key={item}>{item}</li>)}{selectedMedication.id === "rivaroxaban" && state.rivaroxabanRegimenId && <li className="font-semibold">{rivaroxabanRegimens[state.rivaroxabanRegimenId].instruction}</li>}</ul>
                      <h4 className="mt-5 font-bold">Monitoring and continuity</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">{selectedMedication.monitoring.map((item) => <li key={item}>{item}</li>)}</ul>
                      <a href={selectedMedication.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-primary underline underline-offset-4">Review official labeling source</a>
                    </article>
                  </div>
                )}
              </section>
            )}

            {state.stage === "teach_back" && (
              <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7" aria-labelledby="teach-back-title">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step 3 of 5</div>
                <h2 id="teach-back-title" className="mt-2 font-display text-3xl font-bold">Ask. Listen. Re-teach. Check again.</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">“I want to be sure I explained this clearly. Please show me or explain the plan in your own words.” A wrong answer tests the explanation, not the patient.</p>
                <div className="mt-6 space-y-4">
                  {teachBackTasks.map((task, index) => (
                    <article key={task.id} className="rounded-2xl border border-border p-5">
                      <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">{index + 1}</span><h3 className="font-bold leading-relaxed">{task.label}</h3></div>
                      {state.mode === "staff" ? (
                        <div className="mt-4"><Label htmlFor={`teach-${task.id}`} className="sr-only">Result for {task.label}</Label><Select value={state.teachBack[task.id]} onValueChange={(value) => setTeachBack(task.id, value as TeachBackResult)}><SelectTrigger id={`teach-${task.id}`} className="min-h-11"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(teachBackLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
                      ) : <p className="mt-3 text-sm text-muted-foreground">A staff member records the result after listening and re-teaching if needed.</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {state.stage === "barriers" && (
              <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7" aria-labelledby="barriers-title">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step 4 of 5</div>
                <h2 id="barriers-title" className="mt-2 font-display text-3xl font-bold">Make the plan work outside the hospital.</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Select every barrier that applies in this synthetic review. Each one gets a recommended owner, action, and visible status. An unresolved stop prevents completion.</p>
                <div className="mt-6 space-y-4">
                  {(Object.entries(dischargeBarriers) as [BarrierId, (typeof dischargeBarriers)[BarrierId]][]).map(([id, barrier]) => {
                    const included = state.barriers[id] !== undefined;
                    return <article key={id} className={`rounded-2xl border p-5 ${included ? "border-primary/40 bg-primary-soft/10" : "border-border"}`}>
                      <div className="flex items-start gap-3"><Checkbox id={`barrier-${id}`} checked={included} disabled={state.mode !== "staff"} onCheckedChange={(checked) => setBarrier(id, checked === true)} /><div><Label htmlFor={`barrier-${id}`} className="font-bold leading-relaxed">{barrier.label}</Label><p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong>Recommended owner:</strong> {barrier.owner}<br /><strong>Next action:</strong> {barrier.response}</p></div></div>
                      {included && state.mode === "staff" && <div className="mt-4"><Label htmlFor={`barrier-status-${id}`} className="sr-only">Status for {barrier.label}</Label><Select value={state.barriers[id]} onValueChange={(value) => setBarrierStatus(id, value as BarrierStatus)}><SelectTrigger id={`barrier-status-${id}`} className="min-h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(barrierStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>}
                    </article>;
                  })}
                </div>
                {Object.keys(state.barriers).length === 0 && <p className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-sm"><strong>No barrier selected.</strong> Staff should still ask directly; “not disclosed” is not the same as “none.”</p>}
              </section>
            )}

            {state.stage === "handoff" && (
              <section className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-7" aria-labelledby="handoff-title">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step 5 of 5</div>
                <h2 id="handoff-title" className="mt-2 font-display text-3xl font-bold">A visible stop-or-go handoff.</h2>
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <article className="rounded-2xl border border-border p-5"><h3 className="font-display text-xl font-bold">Required checks</h3><ul className="mt-4 space-y-3 text-sm">{[
                    [Boolean(selectedMedication), "Exact medicine branch selected"],
                    [state.medicationId !== "rivaroxaban" || Boolean(state.rivaroxabanRegimenId), "Exact regimen branch selected when required"],
                    [state.reconciliationConfirmed, "Final medication list reconciled"],
                    [state.localActionPlanConfirmed, "Local response and contact plan available"],
                    [evaluation.passedTeachBack === teachBackTasks.length, "All teach-back tasks passed"],
                    [!Object.values(state.barriers).some((value) => value === "identified" || value === "unresolved_stop"), "Every identified barrier resolved or has a safe backup"],
                  ].map(([passed, label]) => <li key={String(label)} className="flex gap-3"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{passed ? "✓" : "!"}</span>{label as string}</li>)}</ul></article>
                  <article className="rounded-2xl border border-border p-5"><h3 className="font-display text-xl font-bold">Open items</h3>{evaluation.blockers.length ? <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{evaluation.blockers.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-4 text-sm leading-relaxed">No modeled blocker remains. The organization’s clinical judgment, discharge policy, final orders, and release approvals still control.</p>}</article>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button type="button" onClick={print} disabled={!selectedMedication || (selectedMedication.id === "rivaroxaban" && !state.rivaroxabanRegimenId)}><Printer className="h-4 w-4" /> Print patient-facing review sample</Button>
                  <Button type="button" variant="outline" onClick={() => selectStage(evaluation.blockers.some((item) => item.includes("teach-back")) ? "teach_back" : "medicine")}>Return to required checks</Button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Printing is blocked until a matching medicine branch is selected. The printout excludes workflow status, teach-back results, and barrier data; patient-specific fields remain blank.</p>
              </section>
            )}

            <section className="mt-6 rounded-3xl border border-border bg-muted/30 p-5" aria-labelledby="proof-title">
              <div className="flex gap-3"><BookOpenCheck className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div><h2 id="proof-title" className="font-display text-xl font-bold">Evidence and release proof</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Candidate {bloodThinnerProof.candidateId} · evidence reviewed {bloodThinnerProof.lastEvidenceReview} · {bloodThinnerProof.generalClaimIds.length} shared claim records · {bloodThinnerProof.openDecisionIds.length} open clinical decisions · <strong>{bloodThinnerProof.patientUseStatus}</strong>.</p>{selectedMedication && <p className="mt-2 text-sm">This card maps to {selectedMedication.claimIds.join(", ")} and <a className="font-bold text-primary underline underline-offset-4" href={selectedMedication.sourceUrl} target="_blank" rel="noreferrer">{selectedMedication.sourceLabel}</a>.</p>}<a href="/patient-education/demo/blood-thinner-readiness-proof.json" className="mt-3 inline-flex text-sm font-bold text-primary underline underline-offset-4">Inspect the public-safe proof record</a></div></div>
            </section>
          </div>
        </div>
      </div>

      <article className="hidden print:block print:text-black" aria-label="Blood thinner safety plan printable review sample">
        <div className="border-b-4 border-black pb-4"><div className="text-sm font-bold">REVIEW SAMPLE · NOT APPROVED FOR PATIENT USE</div><h1 className="mt-2 text-3xl font-bold">Your blood thinner safety plan</h1><p className="mt-2">Use only with the final medication list and the instructions from your care team.</p></div>
        <section className="mt-6"><h2 className="text-xl font-bold">Your matching medicine card: {selectedMedication?.name ?? "Not selected"}</h2><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><p><strong>Strength:</strong> ____________________</p><p><strong>Reason:</strong> ____________________</p><p><strong>Dose and schedule:</strong> ____________________</p><p><strong>Next dose:</strong> ____________________</p><p><strong>Prescribing team:</strong> ____________________</p><p><strong>Pharmacy:</strong> ____________________</p></div></section>
        <section className="mt-6"><h2 className="text-xl font-bold">Important safety steps</h2><ul className="mt-2 list-disc space-y-2 pl-6 text-sm">{sharedBloodThinnerSafety.map((item) => <li key={item}>{item}</li>)}</ul></section>
        {selectedMedication && <section className="mt-6 break-inside-avoid"><h2 className="text-xl font-bold">How to use {selectedMedication.name}</h2><ul className="mt-2 list-disc space-y-2 pl-6 text-sm">{[...selectedMedication.howToTake, ...selectedMedication.missedDose, ...(selectedMedication.id === "rivaroxaban" && state.rivaroxabanRegimenId ? [rivaroxabanRegimens[state.rivaroxabanRegimenId].instruction] : []), ...selectedMedication.monitoring].map((item) => <li key={item}>{item}</li>)}</ul></section>}
        <section className="mt-6 break-inside-avoid"><h2 className="text-xl font-bold">Who to contact</h2><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><p><strong>Daytime questions:</strong> ____________________</p><p><strong>After hours:</strong> ____________________</p><p><strong>Monitoring/follow-up:</strong> ____________________</p><p><strong>Procedure questions:</strong> ____________________</p></div><div className="mt-4 border-2 border-black p-3 text-sm"><strong>Emergency plan supplied by:</strong> ____________________<br /><strong>Local approved instructions:</strong> ______________________________________________</div></section>
        <footer className="mt-8 border-t border-black pt-3 text-xs"><p>{bloodThinnerProof.candidateId} · version {bloodThinnerProof.version} · evidence reviewed {bloodThinnerProof.lastEvidenceReview}</p><p className="mt-1 font-bold">Supplemental internal review sample. It does not replace FDA labeling, final orders, clinical judgment, or emergency care.</p></footer>
      </article>
    </div>
  );
};
