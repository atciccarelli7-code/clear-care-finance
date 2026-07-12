import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Printer,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { SaveNavigatorAction } from "@/components/navigator/SaveNavigatorAction";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import {
  buildFinancialAssistanceScreening,
  DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS,
  type FinancialAssistanceAnswers,
  type FinancialAssistanceScreeningResult,
} from "@/lib/financialAssistance";
import { trackSiteEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const TOOL_ID = "financial-assistance-checklist";
const SOURCE_ROUTE = "/tools/financial-assistance-checklist";

type Question = {
  key: keyof FinancialAssistanceAnswers;
  label: string;
  helper: string;
  options: Array<{ value: string; label: string }>;
};

const questions: Question[] = [
  {
    key: "billSource",
    label: "Who issued the bill?",
    helper: "Hospital policies may not include separately billing physicians, laboratories, imaging groups, ambulance services, or other clinicians.",
    options: [
      { value: "hospital", label: "Hospital or facility" },
      { value: "outside_clinician", label: "Outside clinician or separately billing group" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "insuranceStatus",
    label: "Has insurance finished processing the claim?",
    helper: "A pending or rejected claim can make the current balance incomplete.",
    options: [
      { value: "processed", label: "Yes, processing appears complete" },
      { value: "pending", label: "No, pending or not fully processed" },
      { value: "uninsured", label: "No insurance or self-pay" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "affordability",
    label: "How would paying this balance affect the household?",
    helper: "Use a broad category. Do not enter an exact income, balance, diagnosis, or account number.",
    options: [
      { value: "unaffordable", label: "Would disrupt essentials, require high-interest debt, or drain necessary savings" },
      { value: "difficult", label: "Would create meaningful financial strain" },
      { value: "manageable", label: "Manageable without major hardship" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "collectionStatus",
    label: "What is the account status?",
    helper: "Do not ignore a written deadline while asking for assistance or clarification.",
    options: [
      { value: "current", label: "Current bill" },
      { value: "past_due", label: "Past due" },
      { value: "collections", label: "Collection activity has started" },
      { value: "paid", label: "Already paid recently" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "nonprofitStatus",
    label: "Is the hospital nonprofit?",
    helper: "Nonprofit hospitals have specific federal financial-assistance policy requirements, but assistance may also exist elsewhere.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "policyStatus",
    label: "Have you found the written financial-assistance policy?",
    helper: "The exact written policy controls household definitions, documentation, covered bills, deadlines, and appeal options.",
    options: [
      { value: "found", label: "Yes" },
      { value: "not_found", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "applicationStatus",
    label: "Where are you in the application process?",
    helper: "Keep proof of requests, submissions, reference numbers, and written decisions.",
    options: [
      { value: "not_requested", label: "Application not requested" },
      { value: "requested", label: "Application requested but not submitted" },
      { value: "submitted", label: "Application submitted" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
];

const resultAsText = (result: FinancialAssistanceScreeningResult) => [
  result.heading,
  result.summary,
  "",
  "WHY THIS PATH APPLIES",
  ...result.reasons.map((item) => `- ${item}`),
  "",
  "DO NOW",
  ...result.doNow.map((item) => `- ${item}`),
  "",
  "VERIFY",
  ...result.verify.map((item) => `- ${item}`),
  "",
  "DOCUMENTS TO GATHER",
  ...result.documents.map((item) => `- ${item}`),
  "",
  "IMPORTANT LIMITS",
  ...result.cautions.map((item) => `- ${item}`),
  "",
  "Official verification: request the hospital's written policy and use IRS Section 501(r), CMS medical-bill rights, the insurer, and applicable state resources as needed.",
].join("\n");

const ResultList = ({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof ClipboardCheck;
}) => {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" /> {title}
      </h3>
      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const FinancialAssistanceScreeningTool = () => {
  const [answers, setAnswers] = useState<FinancialAssistanceAnswers>(DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS);
  const [result, setResult] = useState<FinancialAssistanceScreeningResult | null>(null);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    resultRef.current?.focus();
  }, [result]);

  const updateAnswer = (key: keyof FinancialAssistanceAnswers, value: string) => {
    if (!started.current) {
      started.current = true;
      trackSiteEvent("tool_start", {
        event_category: "tools",
        tool_id: TOOL_ID,
        tool_label: "Financial Assistance Screening Guide",
      });
    }

    setAnswers((current) => ({ ...current, [key]: value } as FinancialAssistanceAnswers));
    setResult(null);
    setCopied(false);
  };

  const generateResult = () => {
    const nextResult = buildFinancialAssistanceScreening(answers);
    setResult(nextResult);
    trackSiteEvent("tool_complete", {
      event_category: "tools",
      tool_id: TOOL_ID,
      tool_label: "Financial Assistance Screening Guide",
    });
  };

  const reset = () => {
    setAnswers(DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS);
    setResult(null);
    setCopied(false);
    started.current = false;
    trackSiteEvent("tool_result_action", {
      event_category: "tools",
      tool_id: TOOL_ID,
      action: "reset",
    });
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(resultAsText(result));
      setCopied(true);
      trackSiteEvent("tool_result_action", {
        event_category: "tools",
        tool_id: TOOL_ID,
        action: "copy_success",
      });
    } catch {
      setCopied(false);
      trackSiteEvent("tool_result_action", {
        event_category: "tools",
        tool_id: TOOL_ID,
        action: "copy_blocked",
      });
    }
  };

  const printResult = () => {
    trackSiteEvent("tool_result_action", {
      event_category: "tools",
      tool_id: TOOL_ID,
      action: "print",
    });
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/15 bg-primary-soft/25 p-4 text-sm leading-relaxed text-muted-foreground md:p-5">
        <strong className="text-foreground">Use broad answers only.</strong> This tool does not need a hospital name, patient name, exact income, diagnosis, insurance ID, account number, claim number, or medical details. Answers remain in this page&apos;s temporary browser state and are not added to My Plan.
      </div>

      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          generateResult();
        }}
      >
        {questions.map((question) => {
          const helperId = `${question.key}-helper`;
          return (
            <div key={question.key} className="rounded-2xl border border-border bg-background/70 p-4 md:p-5">
              <label htmlFor={question.key} className="block text-sm font-bold text-foreground md:text-base">
                {question.label}
              </label>
              <p id={helperId} className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
                {question.helper}
              </p>
              <select
                id={question.key}
                value={answers[question.key]}
                aria-describedby={helperId}
                onChange={(event) => updateAnswer(question.key, event.target.value)}
                className="mt-3 min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {question.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          );
        })}

        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <Button type="submit" size="lg">Build my screening plan</Button>
          <Button type="button" variant="outline" size="lg" onClick={reset}>
            <RefreshCcw className="h-4 w-4" /> Start over
          </Button>
        </div>
      </form>

      {result && (
        <div ref={resultRef} tabIndex={-1} className="space-y-5 outline-none" aria-live="polite">
          <section
            className={cn(
              "rounded-3xl border p-5 shadow-card md:p-7",
              result.level === "strong_reason" && "border-amber-300 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/20",
              result.level === "possible_reason" && "border-primary/25 bg-primary-soft/30",
              result.level === "verify_first" && "border-border bg-muted/30",
            )}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Qualified screening direction</p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground">{result.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{result.summary}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <ResultList title="Why this path applies" items={result.reasons} icon={ShieldCheck} />
            <ResultList title="Do now" items={result.doNow} icon={ClipboardCheck} />
            <ResultList title="Verify" items={result.verify} icon={CheckCircle2} />
            <ResultList title="Documents to gather" items={result.documents} icon={FileText} />
          </div>

          <section className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/20 md:p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" /> Important limits
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {result.cautions.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <h3 className="font-display text-lg font-bold text-foreground">Official verification resources</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The hospital&apos;s written policy and the specific bill control. These sources explain federal nonprofit-hospital requirements and medical-bill rights; state rules and the hospital policy may add protections or procedures.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href="https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-primary hover:border-primary/30"
              >
                IRS: Section 501(r) hospital requirements
              </a>
              <a
                href="https://www.cms.gov/medical-bill-rights"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-primary hover:border-primary/30"
              >
                CMS: Medical bill rights
              </a>
            </div>
          </section>

          <SaveNavigatorAction
            recommendationId="cost_financial_assistance"
            sourceRoute={SOURCE_ROUTE}
            title="Save the assistance review as a next step"
            description="Only the fixed action is saved. The answers above, bill status, and affordability category are not stored in My Plan."
          />

          <div className="flex flex-col gap-3 sm:flex-row print:hidden">
            <Button type="button" onClick={copyResult}>
              <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy plan"}
            </Button>
            <Button type="button" variant="outline" onClick={printResult}>
              <Printer className="h-4 w-4" /> Print or save as PDF
            </Button>
            <Button type="button" variant="ghost" onClick={reset}>
              <RefreshCcw className="h-4 w-4" /> Start over
            </Button>
          </div>
        </div>
      )}

      <DisclaimerBox />
    </div>
  );
};

export default FinancialAssistanceScreeningTool;
