import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  FileCheck2,
  Printer,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  buildHospitalToHomeBrief,
  hospitalToHomeBriefText,
  isMedicareCoverage,
  needsAuthorizationQuestion,
  serviceLabels,
  type AcceptanceStatus,
  type AuthorizationStatus,
  type CoverageType,
  type DischargeDestination,
  type DischargeTiming,
  type HelperRole,
  type HospitalStatus,
  type HospitalToHomeAnswers,
  type NoticeStatus,
  type PrimaryConcern,
  type ServiceNeed,
} from "@/lib/hospitalToHomeDecision";
import { removeDecisionRecord, loadDecisionWorkspace, upsertDecisionRecord } from "@/lib/decisionWorkspace";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";

const JOURNEY = {
  journey_key: "hospital_to_home",
  surface: "hospital_guide",
  variant: "flagship_funnel_v1",
} as const;
const RECORD_ID = "hospital-discharge-primary";

type StepId = "helper" | "timing" | "coverage" | "destination" | "status" | "services" | "authorization" | "acceptance" | "notice" | "concern";

const initialAnswers = (): HospitalToHomeAnswers => ({ services: [] });

const optionClass = (selected: boolean) => `min-h-16 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-primary bg-primary-soft/50 ring-2 ring-primary/15" : "border-border bg-background hover:border-primary/35 hover:bg-muted/40"}`;

const Choice = ({ selected, onClick, title, body }: { selected: boolean; onClick: () => void; title: string; body?: string }) => (
  <button type="button" aria-pressed={selected} onClick={onClick} className={optionClass(selected)}>
    <span className="flex items-start gap-3">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
      <span>
        <span className="block text-sm font-bold text-foreground">{title}</span>
        {body && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{body}</span>}
      </span>
    </span>
  </button>
);

const Question = ({ title, why, children }: { title: string; why: string; children: ReactNode }) => (
  <div>
    <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
    <div className="mt-3 rounded-xl border border-primary/15 bg-primary-soft/25 p-3 text-sm leading-relaxed text-muted-foreground">
      <strong className="text-foreground">Why this matters: </strong>{why}
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">{children}</div>
  </div>
);

const stepPhase = (index: number, total: number) => index >= total - 2 ? "build_action_plan" : index === 0 ? "name_question" : "narrow_answer";

const officialSources = [
  ["Medicare — inpatient or outpatient status", "https://www.medicare.gov/coverage/inpatient-hospital-care/inpatient-outpatient-status"],
  ["Medicare — skilled nursing facility care", "https://www.medicare.gov/coverage/skilled-nursing-facility-care"],
  ["Medicare — home health services", "https://www.medicare.gov/coverage/home-health-services"],
  ["Medicare — durable medical equipment", "https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage"],
  ["Medicare — appeals and fast appeals", "https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals"],
  ["Medicare Care Compare", "https://www.medicare.gov/care-compare/"],
] as const;

export const HospitalToHomeNavigator = () => {
  const [answers, setAnswers] = useState<HospitalToHomeAnswers>(initialAnswers);
  const [currentStep, setCurrentStep] = useState<StepId>("helper");
  const [servicesConfirmed, setServicesConfirmed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const existing = loadDecisionWorkspace().records.find((item) => item.id === RECORD_ID);
    return existing?.outstandingActions.filter((item) => item.status === "complete" && item.id.startsWith("h2h-")).map((item) => item.id.replace(/^h2h-/, "")) ?? [];
  });
  const [statusMessage, setStatusMessage] = useState("");
  const startedRef = useRef(false);
  const resultRef = useRef<HTMLParagraphElement>(null);

  const steps = useMemo<StepId[]>(() => [
    "helper",
    "timing",
    "coverage",
    "destination",
    ...(isMedicareCoverage(answers.coverage) ? ["status" as const] : []),
    "services",
    ...(needsAuthorizationQuestion(answers) ? ["authorization" as const] : []),
    "acceptance",
    "notice",
    "concern",
  ], [answers]);
  const stepIndex = Math.max(steps.indexOf(currentStep), 0);
  const brief = useMemo(() => buildHospitalToHomeBrief(answers), [answers]);

  useEffect(() => {
    trackJourneyEvent("journey_viewed", { ...JOURNEY, phase: "name_question", step_index: 0 });
  }, []);

  useEffect(() => {
    if (showResult) window.setTimeout(() => resultRef.current?.focus(), 0);
  }, [showResult]);

  const isComplete = () => {
    if (currentStep === "helper") return Boolean(answers.helperRole);
    if (currentStep === "timing") return Boolean(answers.timing);
    if (currentStep === "coverage") return Boolean(answers.coverage);
    if (currentStep === "destination") return Boolean(answers.destination);
    if (currentStep === "status") return Boolean(answers.hospitalStatus);
    if (currentStep === "services") return servicesConfirmed;
    if (currentStep === "authorization") return Boolean(answers.authorization);
    if (currentStep === "acceptance") return Boolean(answers.acceptance);
    if (currentStep === "notice") return Boolean(answers.notice);
    return Boolean(answers.concern);
  };

  const next = () => {
    if (!isComplete()) return;
    if (!startedRef.current) {
      startedRef.current = true;
      trackJourneyEvent("journey_started", { ...JOURNEY, phase: "name_question", step_index: 0 });
    }
    trackJourneyEvent("journey_step_completed", {
      ...JOURNEY,
      phase: stepPhase(stepIndex, steps.length),
      step_index: stepIndex + 1,
    });
    if (stepIndex === steps.length - 1) {
      setShowResult(true);
      trackJourneyEvent("journey_result_reached", { ...JOURNEY, phase: "result", step_index: steps.length });
      return;
    }
    setCurrentStep(steps[stepIndex + 1]);
    setStatusMessage("");
  };

  const back = () => {
    if (showResult) {
      setShowResult(false);
      setStatusMessage("");
      return;
    }
    if (stepIndex === 0) return;
    trackJourneyEvent("journey_back_selected", { ...JOURNEY, phase: stepPhase(stepIndex, steps.length), step_index: stepIndex });
    setCurrentStep(steps[stepIndex - 1]);
    setStatusMessage("");
  };

  const patch = <Key extends keyof HospitalToHomeAnswers>(key: Key, value: HospitalToHomeAnswers[Key]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStatusMessage("");
  };

  const toggleService = (service: ServiceNeed) => {
    setServicesConfirmed(true);
    setAnswers((current) => ({
      ...current,
      services: current.services.includes(service) ? current.services.filter((item) => item !== service) : [...current.services, service],
    }));
  };

  const saveBrief = () => {
    upsertDecisionRecord(loadDecisionWorkspace(), {
      id: RECORD_ID,
      journeyId: "hospital-discharge",
      fixedCategory: "Hospital-to-Home Coverage & Cost",
      destinationRoute: "/insurance/hospital-discharge-coverage",
      completedSteps: completedTaskIds,
      outstandingActions: brief.tasks.map((item) => ({
        id: `h2h-${item.id}`,
        category: item.priority,
        label: item.title,
        owner: item.owner,
        destinationRoute: item.destinationRoute,
        status: completedTaskIds.includes(item.id) ? "complete" as const : "open" as const,
      })),
      verificationStatus: completedTaskIds.length === brief.tasks.length ? "verified" : "in_progress",
    });
    trackJourneyEvent("journey_result_saved", { ...JOURNEY, phase: "result", step_index: steps.length });
    setStatusMessage("Saved to My Decision Plan in this browser.");
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(hospitalToHomeBriefText(brief));
      setStatusMessage("Brief copied. Review it before sharing.");
      trackJourneyEvent("journey_result_copied", { ...JOURNEY, phase: "result", step_index: steps.length });
    } catch {
      setStatusMessage("Copy was blocked by this browser. Use Print / save as PDF instead.");
    }
  };

  const printBrief = () => {
    trackJourneyEvent("journey_result_printed", { ...JOURNEY, phase: "result", step_index: steps.length });
    window.print();
  };

  const restart = () => {
    if (!window.confirm("Clear these selections and build a new brief? Your separately saved Decision Plan will remain until you clear it.")) return;
    setAnswers(initialAnswers());
    setServicesConfirmed(false);
    setCurrentStep("helper");
    setShowResult(false);
    setStatusMessage("");
    startedRef.current = false;
    trackJourneyEvent("journey_restarted", { ...JOURNEY, phase: "name_question", step_index: 0 });
  };

  const clearSaved = () => {
    if (!window.confirm("Remove the saved hospital-to-home plan from this browser?")) return;
    removeDecisionRecord(loadDecisionWorkspace(), RECORD_ID);
    setCompletedTaskIds([]);
    setStatusMessage("Saved plan removed from this browser.");
  };

  const toggleTask = (id: string) => setCompletedTaskIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const renderQuestion = () => {
    if (currentStep === "helper") return (
      <Question title="Who is using this brief?" why="The action owner changes when the patient is acting alone, a caregiver is coordinating, or another advocate is helping.">
        {([
          ["patient", "I am the patient", "I am preparing for my own discharge."],
          ["caregiver", "I am a family member or caregiver", "I am coordinating or confirming the plan."],
          ["advocate", "I am another helper or advocate", "I am helping organize questions and next steps."],
        ] as Array<[HelperRole, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.helperRole === value} onClick={() => patch("helperRole", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "timing") return (
      <Question title="When is discharge expected?" why="Items that are unresolved today need a different priority than follow-up after the patient is already home.">
        {([
          ["today", "Today", "Use the brief for a same-day team review."],
          ["one-two-days", "Within one or two days", "Confirm ownership and decision timing now."],
          ["later", "More than two days away", "Use the time to close coverage and acceptance gaps."],
          ["already-home", "The patient is already home", "Focus on failed handoffs, cost, and follow-up."],
        ] as Array<[DischargeTiming, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.timing === value} onClick={() => patch("timing", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "coverage") return (
      <Question title="Which coverage is expected to pay?" why="Hospital status, network, authorization, supplier, cost-sharing, and appeal rules depend on the controlling coverage.">
        {([
          ["original-medicare", "Original Medicare", "Medicare Part A and/or Part B, with or without separate supplemental coverage."],
          ["medicare-advantage", "Medicare Advantage", "A private Medicare plan may use plan-specific networks and authorization."],
          ["commercial", "Employer, Marketplace, or other commercial plan", "Use the current plan's network and coverage documents."],
          ["medicaid-dual", "Medicaid or Medicare + Medicaid", "Benefits and service pathways can be state- and plan-specific."],
          ["uninsured", "No confirmed health coverage", "Ask about public programs, facility assistance, and private-pay estimates."],
          ["unknown", "Not sure yet", "The brief will make payer identification a first action."],
        ] as Array<[CoverageType, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.coverage === value} onClick={() => patch("coverage", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "destination") return (
      <Question title="What destination is being proposed?" why="A recommendation, payer approval, and an accepting facility or agency are separate decisions.">
        {([
          ["home", "Home without ordered home health", "Family, outpatient, or community support may still be needed."],
          ["home-health", "Home with home health", "Confirm the accepting agency, ordered services, and first visit."],
          ["snf", "Skilled nursing / short-term rehab", "Confirm skilled need, covered days, daily cost, and acceptance."],
          ["inpatient-rehab", "Inpatient rehabilitation", "Confirm clinical acceptance, authorization, network, and cost."],
          ["long-term-setting", "Assisted living or longer-term setting", "Separate skilled benefits from custodial or long-term funding."],
          ["unknown", "Not decided yet", "The brief will make destination and alternatives an unresolved item."],
        ] as Array<[DischargeDestination, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.destination === value} onClick={() => patch("destination", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "status") return (
      <Question title="What is the current hospital status?" why="For Medicare, inpatient versus outpatient/observation status can affect cost and may affect standard Original Medicare SNF coverage.">
        {([
          ["inpatient", "Inpatient admission confirmed", "A clinician's formal inpatient order is documented."],
          ["observation", "Outpatient / observation", "Staying overnight does not by itself establish inpatient status."],
          ["changed-to-observation", "Changed from inpatient to observation", "Ask for the Medicare Change of Status Notice and appeal instructions."],
          ["unknown", "Not sure", "Ask utilization review or case management to confirm in writing."],
        ] as Array<[HospitalStatus, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.hospitalStatus === value} onClick={() => patch("hospitalStatus", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "services") return (
      <Question title="Which handoffs matter for this discharge?" why="Choose only known needs. The brief will assign the relevant verification steps and skip the rest.">
        {(Object.entries(serviceLabels) as Array<[ServiceNeed, string]>).map(([value, label]) => <Choice key={value} selected={answers.services.includes(value)} onClick={() => toggleService(value)} title={label[0].toUpperCase() + label.slice(1)} />)}
        <Choice selected={servicesConfirmed && answers.services.length === 0} onClick={() => { setServicesConfirmed(true); patch("services", []); }} title="No specific service is identified yet" body="Continue with destination, coverage, acceptance, notice, and cost questions." />
      </Question>
    );
    if (currentStep === "authorization") return (
      <Question title="What is the authorization status?" why="A referral or clinical recommendation does not establish payer approval, approved dates, or an approved provider.">
        {([
          ["approved", "Approved", "Still verify service, dates, provider, cost, and what happens next."],
          ["pending", "Submitted and pending", "Get the reference number, missing items, owner, and expected decision time."],
          ["denied", "Denied", "Use the written reason, deadline, and review path."],
          ["not-started", "Required but not started", "Identify who submits the complete request today."],
          ["not-required", "Plan says authorization is not required", "Ask how that answer is documented and whether network rules still apply."],
          ["unknown", "Not sure", "Ask whether each service requires authorization."],
        ] as Array<[AuthorizationStatus, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.authorization === value} onClick={() => patch("authorization", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "acceptance") return (
      <Question title="Have the receiving services accepted and scheduled?" why="Referral sent, insurance approved, in network, clinically accepted, and scheduled are different states.">
        {([
          ["confirmed", "Everything is accepted and scheduled", "Confirm dates, delivery or start time, and patient cost."],
          ["partial", "Some items are confirmed", "The brief will focus on the remaining handoffs."],
          ["not-confirmed", "Nothing is fully confirmed", "Ask who owns each pending referral or delivery."],
          ["declined", "A facility, agency, or supplier declined", "Ask why and how the search or backup plan changes."],
          ["not-applicable", "No receiving service is expected", "Follow-up, medications, transportation, and caregiver readiness may still matter."],
        ] as Array<[AcceptanceStatus, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.acceptance === value} onClick={() => patch("acceptance", value)} title={title} body={body} />)}
      </Question>
    );
    if (currentStep === "notice") return (
      <Question title="Is there a written denial or coverage notice?" why="The exact notice controls the reason, dates, deadline, and whether an appeal or fast appeal may apply.">
        {([
          ["written-denial", "Written denial", "Use the exact service, reason, dates, and deadline."],
          ["coverage-ending", "Notice that covered services will end", "Read the setting-specific fast-appeal instructions immediately."],
          ["moon-or-status-change", "MOON or Medicare status-change notice", "Hospital status and appeal questions belong in the brief."],
          ["verbal-only", "Only a verbal answer", "Ask for the controlling written notice or plan language."],
          ["none", "No denial or notice", "Coverage and cost still need final verification."],
          ["unknown", "Not sure", "Ask which notices should have been provided."],
        ] as Array<[NoticeStatus, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.notice === value} onClick={() => patch("notice", value)} title={title} body={body} />)}
      </Question>
    );
    return (
      <Question title="What is the biggest unresolved concern?" why="The brief puts this concern near the top without asking for diagnoses, medication names, member IDs, claim numbers, or medical records.">
        {([
          ["leaving-before-ready", "The patient may leave before the plan is executable", "Request a same-day review of unresolved handoffs."],
          ["coverage-delay", "Coverage or authorization is delayed", "Name the request, reference, missing evidence, owner, and timing."],
          ["unexpected-cost", "An unexpected bill or private-pay cost", "Verify every billing entity and service-specific cost."],
          ["caregiver-gap", "The home plan assumes help that is not available", "Make the tasks, hours, and limitations explicit."],
          ["medication-access", "A medication may be unavailable or unaffordable", "Confirm stock, coverage, authorization, and today’s price."],
          ["appeal", "A denial or appeal deadline", "Work from the written notice and setting-specific deadline."],
        ] as Array<[PrimaryConcern, string, string]>).map(([value, title, body]) => <Choice key={value} selected={answers.concern === value} onClick={() => patch("concern", value)} title={title} body={body} />)}
      </Question>
    );
  };

  if (showResult) return (
    <section id="decision-outcome-hospital-to-home" className="scroll-mt-24 print:scroll-mt-0" aria-labelledby="hospital-to-home-result-title">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Button type="button" variant="ghost" onClick={back}><ArrowLeft className="h-4 w-4" />Review answers</Button>
          <Button type="button" variant="ghost" onClick={restart}><RotateCcw className="h-4 w-4" />Build another brief</Button>
        </div>
        <Card className="rounded-[2rem] border-primary/20 shadow-card print:border-0 print:shadow-none">
          <CardHeader className="border-b border-border/70 bg-primary-soft/25 p-5 md:p-8 print:bg-white print:p-0 print:pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><FileCheck2 className="h-4 w-4" />Personalized result</div>
            <CardTitle ref={resultRef} tabIndex={-1} id="hospital-to-home-result-title" className="font-display text-3xl leading-tight outline-none md:text-4xl">Discharge Coverage &amp; Cost Brief</CardTitle>
            <CardDescription className="max-w-4xl text-base leading-relaxed">{brief.summary}</CardDescription>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
              Educational decision support—not a coverage guarantee, medical discharge decision, legal opinion, or appeal filing. Verify every live rule, cost, deadline, and care decision with the controlling organization.
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-5 md:p-8 print:p-0 print:pt-5">
            <section aria-labelledby="brief-risks-title">
              <h3 id="brief-risks-title" className="flex items-center gap-2 font-display text-2xl font-bold"><AlertTriangle className="h-5 w-5 text-amber-700" />Priority risks</h3>
              {brief.risks.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{brief.risks.map((item) => (
                <article key={item.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                  <div className="font-bold">{item.title}</div><p className="mt-1">{item.detail}</p><span className="mt-3 inline-flex rounded-full border border-amber-300 px-2 py-0.5 text-xs font-bold">{item.evidenceType}</span>
                </article>
              ))}</div> : <p className="mt-3 text-sm text-muted-foreground">No branch-specific risk was identified. Final coverage, acceptance, cost, and backup plans still need official verification.</p>}
            </section>

            <section aria-labelledby="brief-actions-title">
              <h3 id="brief-actions-title" className="flex items-center gap-2 font-display text-2xl font-bold"><UserRoundCheck className="h-5 w-5 text-primary" />Prioritized next actions</h3>
              <p className="mt-2 text-sm text-muted-foreground">Check items as they are completed, then save the task state in this browser.</p>
              <div className="mt-4 space-y-3">{brief.tasks.map((item, index) => {
                const complete = completedTaskIds.includes(item.id);
                return (
                  <article key={item.id} className={`rounded-2xl border p-4 ${complete ? "border-emerald-200 bg-emerald-50" : "border-border bg-background"}`}>
                    <div className="flex items-start gap-3">
                      <button type="button" aria-label={`${complete ? "Mark incomplete" : "Mark complete"}: ${item.title}`} aria-pressed={complete} onClick={() => toggleTask(item.id)} className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${complete ? "border-emerald-700 bg-emerald-700 text-white" : "border-border bg-card"}`}>
                        {complete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-foreground">{item.title}</h4>
                          <span className="rounded-full border border-primary/20 bg-primary-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">{item.priority.replace("-", " ")}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.action}</p>
                        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                          <div><dt className="font-bold text-foreground">Owner</dt><dd className="mt-0.5 text-muted-foreground">{item.owner}</dd></div>
                          <div><dt className="font-bold text-foreground">Why sequenced here</dt><dd className="mt-0.5 text-muted-foreground">{item.why}</dd></div>
                        </dl>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-muted-foreground">{item.evidenceType}</span>
                          {item.destinationRoute && <Link className="text-xs font-bold text-primary underline-offset-4 hover:underline" to={item.destinationRoute} onClick={() => trackJourneyEvent("journey_handoff_opened", { ...JOURNEY, phase: "handoff", step_index: steps.length })}>Open related CAF guide <ArrowRight className="inline h-3.5 w-3.5" /></Link>}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}</div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5" aria-labelledby="brief-cost-title">
                <h3 id="brief-cost-title" className="font-display text-xl font-bold text-amber-950">Potential unexpected-cost warnings</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950/85">{brief.unexpectedCostWarnings.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{item}</li>)}</ul>
              </section>
              <section className="rounded-2xl border border-border bg-muted/30 p-5" aria-labelledby="brief-unresolved-title">
                <h3 id="brief-unresolved-title" className="font-display text-xl font-bold">Still unresolved</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{brief.unresolvedItems.map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul>
              </section>
            </div>

            <section aria-labelledby="brief-sources-title">
              <h3 id="brief-sources-title" className="font-display text-2xl font-bold">Verify with authoritative sources</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{officialSources.map(([title, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" onClick={() => trackJourneyEvent("journey_handoff_opened", { ...JOURNEY, phase: "handoff", step_index: steps.length })} className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm font-bold text-primary hover:border-primary/35 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {title}<ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              ))}</div>
            </section>

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap print:hidden">
              <Button type="button" variant="hero" onClick={saveBrief}><Save className="h-4 w-4" />Save task state</Button>
              <Button type="button" variant="outline" onClick={copyBrief}><ClipboardCopy className="h-4 w-4" />Copy brief</Button>
              <Button type="button" variant="outline" onClick={printBrief}><Printer className="h-4 w-4" />Print / save as PDF</Button>
              <Button type="button" variant="ghost" onClick={clearSaved}><Trash2 className="h-4 w-4" />Clear saved plan</Button>
            </div>
            <p aria-live="polite" className="min-h-5 text-sm font-semibold text-primary print:hidden">{statusMessage}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  return (
    <section id="coverage-checklist" className="scroll-mt-24" aria-labelledby="hospital-to-home-title">
      <Card className="overflow-hidden rounded-[2rem] border-primary/20 shadow-card">
        <CardHeader className="border-b border-border/70 bg-primary-soft/25 p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Guided hospital-to-home navigator</div>
              <CardTitle id="hospital-to-home-title" className="mt-2 font-display text-3xl leading-tight md:text-4xl">Build a Discharge Coverage &amp; Cost Brief</CardTitle>
            </div>
            <span className="rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-bold text-primary">About 5 minutes</span>
          </div>
          <CardDescription className="max-w-4xl text-base leading-relaxed">Answer one decision at a time. You may choose “not sure.” CAF will turn the known facts and unknowns into sequenced verification tasks with an owner for each action.</CardDescription>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950"><strong>Privacy boundary:</strong> fixed choices stay in this page while you build the brief. Do not enter names, diagnoses, member IDs, Medicare numbers, claim numbers, medication names, medical records, or account information. Only generic task status is saved if you choose Save.</div>
        </CardHeader>
        <CardContent className="p-5 md:p-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground"><span>Step {stepIndex + 1} of {steps.length}</span><span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span></div>
            <Progress value={((stepIndex + 1) / steps.length) * 100} aria-label={`Hospital-to-home brief progress: step ${stepIndex + 1} of ${steps.length}`} />
          </div>
          {renderQuestion()}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
            <Button type="button" variant="ghost" onClick={back} disabled={stepIndex === 0}><ArrowLeft className="h-4 w-4" />Back</Button>
            <Button type="button" variant="hero" onClick={next} disabled={!isComplete()}>{stepIndex === steps.length - 1 ? <><FileCheck2 className="h-4 w-4" />Build my brief</> : <>Continue<ArrowRight className="h-4 w-4" /></>}</Button>
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm font-semibold text-primary">{statusMessage}</p>
        </CardContent>
      </Card>
    </section>
  );
};
