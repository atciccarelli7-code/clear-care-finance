import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  PhoneCall,
  Printer,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trackSiteEvent } from "@/lib/analytics";
import {
  buildPriorAuthorizationPlan,
  type PriorAuthorizationAnswers,
  type PriorAuthorizationPlan,
} from "@/lib/priorAuthorizationGuide";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

type QuestionKey = keyof PriorAuthorizationAnswers;

type QuestionOption = {
  value: string;
  label: string;
  helper: string;
};

type Question = {
  key: QuestionKey;
  eyebrow: string;
  title: string;
  why: string;
  options: QuestionOption[];
};

const TOOL_ID = "prior-authorization-next-step-guide";

const questions: Question[] = [
  {
    key: "coverageType",
    eyebrow: "Coverage",
    title: "What coverage is handling this request?",
    why: "Appeal rights, decision windows, contacts, and written notices differ by coverage type.",
    options: [
      { value: "medicare-advantage", label: "Medicare Advantage", helper: "A private Medicare plan, sometimes with Part D drug coverage included." },
      { value: "original-medicare", label: "Original Medicare", helper: "Federal Medicare Parts A and B, with or without separate Medigap or Part D." },
      { value: "medicaid", label: "Medicaid", helper: "State Medicaid fee-for-service or a Medicaid managed care plan." },
      { value: "employer-commercial", label: "Employer or commercial plan", helper: "Coverage through work, a union, COBRA, or an individual policy outside the Marketplace." },
      { value: "marketplace", label: "Marketplace plan", helper: "Coverage purchased through HealthCare.gov or a state Marketplace." },
      { value: "not-sure", label: "Not sure", helper: "Use the insurance card and plan documents to identify the exact coverage pathway first." },
    ],
  },
  {
    key: "requestType",
    eyebrow: "Request",
    title: "What needs authorization or coverage review?",
    why: "Drug requests use pharmacy and formulary rules. Medical services use different authorization and appeal processes.",
    options: [
      { value: "medication", label: "Medication", helper: "A prescription, dose, quantity, formulary exception, or step-therapy issue." },
      { value: "imaging-test", label: "Imaging or test", helper: "MRI, CT, PET, sleep study, genetic test, lab, or another diagnostic service." },
      { value: "procedure-surgery", label: "Procedure or surgery", helper: "An outpatient procedure, surgery, infusion, injection, or facility service." },
      { value: "therapy-post-acute", label: "Therapy, rehab, SNF, or post-acute care", helper: "Physical, occupational, speech, inpatient rehab, skilled nursing, or another post-hospital service." },
      { value: "equipment-supply", label: "Equipment or supply", helper: "Durable medical equipment, prosthetic, orthotic, device, or recurring supply." },
      { value: "other", label: "Other service", helper: "Use this when none of the categories above describe the request." },
    ],
  },
  {
    key: "status",
    eyebrow: "Process stage",
    title: "What is the current status?",
    why: "The next action depends on whether the request was never submitted, is pending, needs records, or has a formal denial.",
    options: [
      { value: "not-submitted", label: "The provider has not submitted it", helper: "The process has not started or no confirmation number exists." },
      { value: "pending", label: "Submitted and pending", helper: "The plan or review vendor says a decision has not been made." },
      { value: "more-information", label: "More information was requested", helper: "The plan wants records, codes, treatment history, or another missing item." },
      { value: "written-denial", label: "Denied in writing", helper: "A letter, portal notice, fax, EOB, or formal adverse decision explains the denial." },
      { value: "verbal-only", label: "Someone verbally said it will not be covered", helper: "You do not yet have a written decision with an appeal path." },
      { value: "not-sure", label: "Not sure", helper: "The provider and plan may be describing the stage differently." },
    ],
  },
  {
    key: "pendingDuration",
    eyebrow: "Elapsed time",
    title: "How long has the complete request been pending?",
    why: "The clock may begin only when the correct reviewer considers the request complete. A missing item can change the timeline.",
    options: [
      { value: "under-72-hours", label: "Less than 72 hours", helper: "This may still be within an urgent or standard review window, depending on the request." },
      { value: "three-to-seven-days", label: "Three to seven calendar days", helper: "Confirm whether the request is urgent, non-urgent, complete, and covered by a specific rule." },
      { value: "over-seven-days", label: "More than seven calendar days", helper: "Request an immediate status explanation, but do not assume a violation until the controlling rule is verified." },
      { value: "not-sure", label: "Not sure", helper: "Ask for the received date, completion date, and reference number." },
    ],
  },
  {
    key: "urgency",
    eyebrow: "Clinical urgency",
    title: "Could waiting seriously harm health or recovery?",
    why: "Expedited review is based on clinical risk from delay. The treating clinician usually needs to document that risk.",
    options: [
      { value: "routine", label: "Routine", helper: "The request matters, but the clinician has not said that normal review timing creates serious jeopardy." },
      { value: "serious-jeopardy", label: "Delay could seriously jeopardize life, health, or recovery", helper: "The clinician believes waiting could cause serious harm or reduce the ability to regain maximum function." },
      { value: "not-sure", label: "Not sure", helper: "Ask the treating clinician whether an expedited request is clinically supportable." },
    ],
  },
  {
    key: "writtenNotice",
    eyebrow: "Written record",
    title: "Do you have a written notice?",
    why: "The written notice should identify the formal status, reason, criteria, deadline, and next review or appeal step.",
    options: [
      { value: "yes", label: "Yes", helper: "Keep every page, envelope, portal screenshot, fax, and reference number." },
      { value: "no", label: "No", helper: "Request the written decision or written request for information before relying on a phone summary." },
      { value: "not-sure", label: "Not sure", helper: "Check the plan portal, mail, provider fax, EOB, or Medicare notice." },
    ],
  },
  {
    key: "denialReason",
    eyebrow: "Reason",
    title: "What reason was given?",
    why: "The reason determines whether the next move is more records, clinical criteria, a drug exception, network correction, or a formal appeal.",
    options: [
      { value: "medical-necessity", label: "Medical necessity or coverage criteria", helper: "The plan says the clinical policy or criteria were not met." },
      { value: "missing-documentation", label: "Missing clinical documentation", helper: "Records, test results, treatment history, or supporting notes are incomplete." },
      { value: "drug-rule", label: "Formulary, step therapy, or drug rule", helper: "The medication is non-formulary, requires alternatives, or exceeds a plan limit." },
      { value: "network-referral", label: "Network, referral, or site-of-care issue", helper: "The provider, facility, referral, or location does not meet the plan rule." },
      { value: "excluded-benefit", label: "Excluded or not a covered benefit", helper: "The plan says the service is outside the benefit package rather than medically unnecessary." },
      { value: "administrative", label: "Administrative, coding, or member-information problem", helper: "The issue may involve codes, dates, member data, provider data, or submission destination." },
      { value: "not-stated", label: "Not stated or not sure", helper: "Request the specific reason and exact criteria used before deciding how to respond." },
    ],
  },
  {
    key: "providerAction",
    eyebrow: "Provider action",
    title: "What is the provider doing now?",
    why: "Prior authorization usually requires the ordering clinician or staff to submit records, correct the request, or address clinical criteria.",
    options: [
      { value: "resubmitting", label: "Resubmitting or correcting the request", helper: "Confirm whether this creates a new request number or keeps the original request open." },
      { value: "peer-to-peer", label: "Peer-to-peer offered or scheduled", helper: "Ask which criteria, records, and deadline apply to the clinician discussion." },
      { value: "supporting-records", label: "Supporting note or records were supplied", helper: "Confirm receipt and whether the plan now considers the request complete." },
      { value: "none", label: "No current provider action", helper: "Identify who in the office must own the next submission, documentation, or appeal step." },
      { value: "not-sure", label: "Not sure", helper: "Call the ordering office and ask for the authorization team or referral coordinator." },
    ],
  },
  {
    key: "serviceTiming",
    eyebrow: "Timing of care",
    title: "Has the service already happened?",
    why: "After care occurs, the issue may become a retroactive authorization, claim denial, EOB, or bill review rather than only prospective approval.",
    options: [
      { value: "prospective", label: "No, the service is still upcoming", helper: "The immediate goal is a decision before the appointment, procedure, medication, or transfer." },
      { value: "already-received", label: "Yes, the service already happened", helper: "Gather the claim, EOB or Medicare notice, provider bill, and any retroactive review information." },
      { value: "not-sure", label: "Not sure how the plan classified it", helper: "Ask whether the plan is reviewing authorization, a claim, or both." },
    ],
  },
];

const answerLabels = Object.fromEntries(
  questions.flatMap((question) => question.options.map((option) => [`${question.key}:${option.value}`, option.label])),
);

const activeQuestionsFor = (answers: PriorAuthorizationAnswers) =>
  questions.filter((question) => question.key !== "pendingDuration" || answers.status === "pending");

const resultAsText = (result: PriorAuthorizationPlan) => [
  result.stageTitle,
  "",
  "DO THIS FIRST",
  result.firstAction,
  "",
  "WHY THIS APPLIES",
  ...result.why.map((item) => `- ${item}`),
  "",
  "VERIFY",
  ...result.verify.map((item) => `- ${item}`),
  "",
  "ASK THE PROVIDER",
  ...result.providerQuestions.map((item) => `- ${item}`),
  "",
  "ASK THE PLAN",
  ...result.planQuestions.map((item) => `- ${item}`),
  "",
  "GATHER",
  ...result.documents.map((item) => `- ${item}`),
  ...(result.urgentOrAppeal.length ? ["", "URGENT REVIEW OR APPEAL", ...result.urgentOrAppeal.map((item) => `- ${item}`)] : []),
  "",
  result.disclaimer,
].join("\n");

const ListSection = ({ title, icon: Icon, items }: { title: string; icon: typeof ClipboardCheck; items: string[] }) => {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl"><Icon className="h-5 w-5 text-primary" /> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function PriorAuthorizationNextStepGuidePage() {
  useSeo({
    title: "Prior Authorization Next-Step Guide",
    description: "Answer plain-English questions about a delayed, pending, or denied prior authorization and get a qualified next-step plan with official sources.",
    canonicalPath: "/tools/prior-authorization-next-step-guide",
  });

  const [answers, setAnswers] = useState<PriorAuthorizationAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<PriorAuthorizationPlan | null>(null);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const completed = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const activeQuestions = useMemo(() => activeQuestionsFor(answers), [answers]);
  const safeIndex = Math.min(stepIndex, activeQuestions.length - 1);
  const question = activeQuestions[safeIndex];
  const selectedValue = question ? answers[question.key] : undefined;
  const progress = result ? 100 : ((safeIndex + 1) / activeQuestions.length) * 100;

  const choose = (key: QuestionKey, value: string) => {
    if (!started.current) {
      started.current = true;
      trackSiteEvent("tool_start", { event_category: "tools", tool_id: TOOL_ID, tool_label: "Prior Authorization Next-Step Guide" });
    }

    setAnswers((current) => {
      const next = { ...current, [key]: value } as PriorAuthorizationAnswers;
      if (key === "status" && value !== "pending") next.pendingDuration = "not-applicable";
      return next;
    });
  };

  const next = () => {
    if (!selectedValue) return;
    if (safeIndex < activeQuestions.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    const nextResult = buildPriorAuthorizationPlan(answers);
    setResult(nextResult);
    if (!completed.current) {
      completed.current = true;
      trackSiteEvent("tool_complete", { event_category: "tools", tool_id: TOOL_ID, tool_label: "Prior Authorization Next-Step Guide" });
    }
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const back = () => {
    if (result) {
      setResult(null);
      setStepIndex(activeQuestions.length - 1);
      return;
    }
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const restart = () => {
    setAnswers({});
    setStepIndex(0);
    setResult(null);
    setCopied(false);
    started.current = false;
    completed.current = false;
    trackSiteEvent("tool_result_action", { event_category: "tools", tool_id: TOOL_ID, action: "restart" });
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(resultAsText(result));
    setCopied(true);
    trackSiteEvent("tool_result_action", { event_category: "tools", tool_id: TOOL_ID, action: "copy" });
    window.setTimeout(() => setCopied(false), 2500);
  };

  const printResult = () => {
    trackSiteEvent("tool_result_action", { event_category: "tools", tool_id: TOOL_ID, action: "print" });
    window.print();
  };

  return (
    <>
      <PageHero
        eyebrow="Guided decision tool"
        title="My prior authorization is delayed or denied. What should I do next?"
        description="Answer the questions your plan and provider will use to identify the process stage. The result explains who to call, what to ask, what to gather, and which official rules still need verification."
      />

      <main className="container max-w-5xl space-y-8 py-8 md:py-14">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Tool safeguards">
          <Card><CardHeader><ShieldCheck className="h-6 w-6 text-primary" /><CardTitle className="text-lg">Private by design</CardTitle><CardDescription>Your answers stay in this browser session. They are not uploaded or included in analytics.</CardDescription></CardHeader></Card>
          <Card><CardHeader><Stethoscope className="h-6 w-6 text-primary" /><CardTitle className="text-lg">Clinical urgency comes from the clinician</CardTitle><CardDescription>The tool can raise an expedited-review question but cannot decide whether a case is medically urgent.</CardDescription></CardHeader></Card>
          <Card><CardHeader><FileText className="h-6 w-6 text-primary" /><CardTitle className="text-lg">The written notice controls</CardTitle><CardDescription>Plan type, notice language, service type, and state or federal rules can change the pathway and deadline.</CardDescription></CardHeader></Card>
        </section>

        {!result && question && (
          <section className="mx-auto max-w-3xl space-y-5" aria-labelledby="question-title">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <span>Question {safeIndex + 1} of {activeQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} aria-label={`Question ${safeIndex + 1} of ${activeQuestions.length}`} />
            </div>

            <Card className="overflow-hidden border-primary/20 shadow-card">
              <CardHeader className="bg-primary-soft/35">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{question.eyebrow}</div>
                <CardTitle id="question-title" className="text-2xl md:text-3xl">{question.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed md:text-base"><strong className="text-foreground">Why this matters:</strong> {question.why}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6">
                {question.options.map((option) => {
                  const selected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => choose(question.key, option.value)}
                      aria-pressed={selected}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected ? "border-primary bg-primary-soft shadow-sm" : "border-border bg-background hover:border-primary/35 hover:bg-muted/30",
                      )}
                    >
                      <span className="flex items-start gap-3">
                        <span className={cn("mt-1 h-4 w-4 shrink-0 rounded-full border-2", selected ? "border-primary bg-primary ring-4 ring-primary/10" : "border-muted-foreground/45")} />
                        <span>
                          <span className="block font-bold text-foreground">{option.label}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{option.helper}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={back} disabled={safeIndex === 0} className="sm:min-w-32"><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button type="button" variant="hero" onClick={next} disabled={!selectedValue} className="sm:min-w-44">
                {safeIndex === activeQuestions.length - 1 ? "Build my next steps" : "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {result && (
          <section ref={resultRef} tabIndex={-1} className="space-y-6 outline-none print:space-y-4" aria-labelledby="result-title">
            <Card className="border-primary/30 bg-primary-soft/30 shadow-card">
              <CardHeader>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your qualified pathway</div>
                <CardTitle id="result-title" className="text-2xl md:text-3xl">{result.stageTitle}</CardTitle>
                <CardDescription>Based on the process details you selected—not a coverage or legal determination.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-primary/25 bg-background p-5">
                  <div className="mb-2 flex items-center gap-2 font-bold text-primary"><ArrowRight className="h-5 w-5" /> Do this first</div>
                  <p className="leading-relaxed text-foreground">{result.firstAction}</p>
                </div>
                <div className="flex flex-col gap-3 print:hidden sm:flex-row">
                  <Button type="button" variant="hero" onClick={copyResult}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy action plan"}</Button>
                  <Button type="button" variant="outline" onClick={printResult}><Printer className="h-4 w-4" /> Print</Button>
                  <Button type="button" variant="ghost" onClick={back}><ArrowLeft className="h-4 w-4" /> Review answers</Button>
                  <Button type="button" variant="ghost" onClick={restart}><RefreshCcw className="h-4 w-4" /> Start over</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <ListSection title="Why this result applies" icon={ClipboardCheck} items={result.why} />
              <ListSection title="What must still be verified" icon={AlertTriangle} items={result.verify} />
              <ListSection title="Questions for the provider" icon={Stethoscope} items={result.providerQuestions} />
              <ListSection title="Questions for the plan" icon={PhoneCall} items={result.planQuestions} />
              <ListSection title="Documents and reference numbers" icon={FileText} items={result.documents} />
              <ListSection title="Urgent review or appeal pathway" icon={ShieldCheck} items={result.urgentOrAppeal} />
            </div>

            <Card className="print:hidden">
              <CardHeader>
                <CardTitle className="text-xl">Your answers</CardTitle>
                <CardDescription>Use this summary when the provider and plan describe the request differently.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {activeQuestions.map((item) => {
                  const value = answers[item.key];
                  if (!value || value === "not-applicable") return null;
                  return (
                    <div key={item.key} className="rounded-xl border border-border bg-muted/25 p-3">
                      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.eyebrow}</div>
                      <div className="mt-1 font-semibold text-foreground">{answerLabels[`${item.key}:${value}`] ?? value}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="print:hidden">
              <CardHeader>
                <CardTitle className="text-xl">Continue with the relevant guide</CardTitle>
                <CardDescription>These links deepen the specific pathway without replacing the official notice or plan rules.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {result.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => trackSiteEvent("tool_result_action", { event_category: "tools", tool_id: TOOL_ID, action: "related_link" })}
                    className="group rounded-2xl border border-border p-4 transition-smooth hover:border-primary/30 hover:bg-primary-soft/25"
                  >
                    <div className="font-bold text-foreground group-hover:text-primary">{link.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Open guide <ArrowRight className="h-4 w-4" /></div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-destructive/25 bg-destructive/5">
              <CardContent className="flex items-start gap-3 p-5 text-sm leading-relaxed text-foreground md:text-base">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <p>{result.disclaimer}</p>
              </CardContent>
            </Card>

            <section aria-labelledby="official-sources-title" className="space-y-4">
              <div>
                <h2 id="official-sources-title" className="font-display text-2xl font-bold">Official controlling sources</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use the source that matches the coverage type. State Medicaid rules, plan documents, and the written notice may be more specific.</p>
              </div>
              <SourceList sources={result.sources} />
            </section>
          </section>
        )}

        {!result && (
          <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/25 p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Educational only.</strong> This guide does not decide whether a service is medically necessary, covered, urgent, approved, appealable, or payable. Do not delay emergency care while using an insurance tool. For an immediate medical emergency, call 911 or seek emergency care.
          </section>
        )}
      </main>
    </>
  );
}
