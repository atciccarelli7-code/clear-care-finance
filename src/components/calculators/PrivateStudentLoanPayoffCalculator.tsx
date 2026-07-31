import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, Calculator, ShieldCheck } from "lucide-react";
import { DecisionOutcomePanel, type CommercialHandoffView } from "@/components/shared/DecisionOutcomePanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { privateStudentLoanDecisionProduct, PRIVATE_STUDENT_LOAN_DECISION_ID } from "@/data/privateStudentLoanDecisionProduct";
import { createDecisionOutcomeAnalytics } from "@/lib/decisionOutcomeAnalytics";
import {
  evaluatePrivateStudentLoanDecision,
  type LoanValidationError,
  type PrivateStudentLoanDecision,
  type RefinanceQuoteMode,
  type RefinanceRateType,
  type StudentLoanType,
} from "@/lib/privateStudentLoanDecision";
import {
  readStudentLoanCommercialConfig,
  resolveStudentLoanCommercialHandoff,
} from "@/lib/studentLoanCommercialHandoff";

type FormValues = {
  principal: string;
  currentApr: string;
  currentTermMonths: string;
  currentPayment: string;
  additionalPayment: string;
  lumpSum: string;
  quoteMode: RefinanceQuoteMode;
  quoteApr: string;
  quoteRateType: RefinanceRateType;
  quoteTermMonths: string;
  quoteFees: string;
};

const INITIAL_VALUES: FormValues = {
  principal: "",
  currentApr: "",
  currentTermMonths: "",
  currentPayment: "",
  additionalPayment: "0",
  lumpSum: "0",
  quoteMode: "none",
  quoteApr: "",
  quoteRateType: "fixed",
  quoteTermMonths: "",
  quoteFees: "0",
};

const toNumber = (value: string) => value.trim() === "" ? Number.NaN : Number(value);

const Field = ({
  id,
  label,
  helper,
  value,
  onChange,
  error,
  prefix,
  suffix,
  min = "0",
  max,
  step = "any",
}: {
  id: string;
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  suffix?: string;
  min?: string;
  max?: string;
  step?: string;
}) => {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-foreground">{label}</Label>
      <p id={helperId} className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ""}`}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-2xl border bg-background px-3 text-base font-semibold tabular-nums shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${prefix ? "pl-8" : ""} ${suffix ? "pr-12" : ""} ${error ? "border-danger" : "border-border"}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p id={errorId} role="alert" className="text-xs font-semibold leading-relaxed text-danger">{error}</p>}
    </div>
  );
};

const SelectField = ({ id, label, helper, value, onChange, children }: {
  id: string;
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  const helperId = `${id}-helper`;
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-foreground">{label}</Label>
      <p id={helperId} className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-describedby={helperId} className="h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {children}
      </select>
    </div>
  );
};

const fieldError = (errors: LoanValidationError[], field: string) => errors.find((error) => error.field === field)?.message;

export const PrivateStudentLoanPayoffCalculator = () => {
  const location = useLocation();
  const [loanType, setLoanType] = useState<StudentLoanType>("uncertain");
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [decision, setDecision] = useState<PrivateStudentLoanDecision | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [focusKey, setFocusKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const analytics = useMemo(() => createDecisionOutcomeAnalytics(PRIVATE_STUDENT_LOAN_DECISION_ID), []);

  const markStarted = () => analytics.track("decision_calculator_started", {}, { dedupe: true });
  const clearStaleResult = () => {
    if (decision) analytics.track("decision_assumptions_edited", { action_id: "edit" }, { dedupe: true });
    setDecision(null);
    setCopyStatus("idle");
  };
  const updateValue = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    markStarted();
    clearStaleResult();
    setValues((current) => ({ ...current, [key]: value }));
    if (key === "quoteMode" && value === "compare") {
      analytics.track("decision_quote_comparison_started", {}, { dedupe: true });
    }
  };

  const selectLoanType = (value: StudentLoanType) => {
    markStarted();
    clearStaleResult();
    setLoanType(value);
    analytics.track("decision_loan_type_selected");
  };

  const buildDecision = (event: React.FormEvent) => {
    event.preventDefault();
    markStarted();
    const generatedAt = new Date();
    const nextDecision = loanType === "private"
      ? evaluatePrivateStudentLoanDecision({
          loanType,
          principal: toNumber(values.principal),
          currentApr: toNumber(values.currentApr),
          statedRemainingTermMonths: toNumber(values.currentTermMonths),
          currentMonthlyPayment: toNumber(values.currentPayment),
          additionalMonthlyPayment: toNumber(values.additionalPayment),
          lumpSum: toNumber(values.lumpSum),
          quoteMode: values.quoteMode,
          quote: values.quoteMode === "compare" ? {
            apr: toNumber(values.quoteApr),
            rateType: values.quoteRateType,
            termMonths: toNumber(values.quoteTermMonths),
            fees: toNumber(values.quoteFees),
          } : undefined,
          generatedAt,
        })
      : evaluatePrivateStudentLoanDecision({ loanType, generatedAt });

    setDecision(nextDecision);
    setCopyStatus("idle");
    setFocusKey((key) => key + 1);
    analytics.track("decision_recommendation_reached", {}, { dedupe: true });
    if (nextDecision.errors.length) {
      analytics.track("decision_validation_blocked", { block_id: nextDecision.errors[0].code }, { dedupe: true });
    } else {
      analytics.track("decision_valid_result_reached", {}, { dedupe: true });
      if (values.quoteMode === "compare") analytics.track("decision_quote_comparison_completed", {}, { dedupe: true });
    }
  };

  const restart = () => {
    analytics.track("decision_journey_restarted", { action_id: "restart" });
    analytics.resetTransitions();
    setLoanType("uncertain");
    setValues(INITIAL_VALUES);
    setDecision(null);
    setCopyStatus("idle");
    requestAnimationFrame(() => document.getElementById("private-loan-type")?.focus());
  };

  const edit = () => {
    analytics.track("decision_assumptions_edited", { action_id: "edit" }, { dedupe: true });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("input, select")?.focus());
  };

  const copy = async () => {
    if (!decision) return;
    try {
      await navigator.clipboard.writeText(decision.view.portableSummary);
      setCopyStatus("copied");
      analytics.track("decision_portable_output_used", { action_id: "copy" });
    } catch {
      setCopyStatus("failed");
    }
  };

  const print = () => {
    analytics.track("decision_portable_output_used", { action_id: "print" });
    window.print();
  };

  const commercialHandoff = useMemo<CommercialHandoffView | null>(() => {
    if (!decision) return null;
    const active = resolveStudentLoanCommercialHandoff(readStudentLoanCommercialConfig(), {
      loanType,
      recommendationState: decision.state,
    });
    if (!active) return null;
    return {
      partnerName: active.partnerName,
      url: active.url,
      disclosure: active.compensationDisclosure,
      onShown: () => analytics.track("decision_commercial_handoff_shown", { action_id: "shown" }, { dedupe: true }),
      onUsed: () => analytics.track("decision_commercial_handoff_used", { action_id: "used" }),
    };
  }, [analytics, decision, loanType]);

  const errors = decision?.state === "insufficient_information" ? decision.errors : [];
  const boundaryCopy = loanType === "federal"
    ? "Federal loans are not interchangeable with private loans. Refinancing them into a private loan can permanently remove federal protections and programs."
    : loanType === "mixed"
      ? "Separate federal and private balances before comparing private-loan payoff or refinance choices."
      : "Verify whether each loan is federal or private before entering a refinance-oriented path.";

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={buildDecision} onFocusCapture={markStarted} className="scroll-mt-24 space-y-6 print:hidden" noValidate>
        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="loan-type-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trust-soft text-trust"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="semantic-label text-trust">Step 1</p>
              <h2 id="loan-type-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Verify the loan type first</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use federal records plus current lender statements. Do not enter lender names, account numbers, or any identifying information here.</p>
            </div>
          </div>
          <div className="mt-5 max-w-xl">
            <SelectField id="private-loan-type" label="Which loans are included?" helper="Choose only after checking the relevant records." value={loanType} onChange={(value) => selectLoanType(value as StudentLoanType)}>
              <option value="uncertain">Uncertain — I need to verify</option>
              <option value="private">Confirmed private loans only</option>
              <option value="federal">Federal loans</option>
              <option value="mixed">A mix of federal and private loans</option>
            </SelectField>
          </div>

          {loanType !== "private" && (
            <div className="mt-5 rounded-2xl border border-caution/25 bg-caution-soft/45 p-4">
              <div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">{boundaryCopy}</p></div>
              <Button type="submit" className="mt-4">Show verification steps</Button>
            </div>
          )}
        </section>

        {loanType === "private" && (
          <>
            <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="current-plan-heading">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action-soft text-action"><Calculator className="h-5 w-5" aria-hidden="true" /></div>
                <div>
                  <p className="semantic-label text-action">Step 2</p>
                  <h2 id="current-plan-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Enter the current private-loan plan</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use the latest statement. The current payment drives the amortization; the entered remaining term is used as a cross-check.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="private-principal" label="Current principal balance" helper="Principal currently owed, not the original loan amount." prefix="$" value={values.principal} onChange={(value) => updateValue("principal", value)} error={fieldError(errors, "principal")} max="10000000" />
                <Field id="private-current-apr" label="Current APR" helper="Use the current annual percentage rate from the statement." suffix="%" value={values.currentApr} onChange={(value) => updateValue("currentApr", value)} error={fieldError(errors, "currentApr")} max="100" />
                <Field id="private-current-term" label="Current remaining term" helper="Months remaining according to the latest statement." suffix="months" value={values.currentTermMonths} onChange={(value) => updateValue("currentTermMonths", value)} error={fieldError(errors, "statedRemainingTermMonths")} min="1" max="1200" step="1" />
                <Field id="private-current-payment" label="Current monthly payment" helper="Required monthly payment from the latest statement." prefix="$" value={values.currentPayment} onChange={(value) => updateValue("currentPayment", value)} error={fieldError(errors, "currentMonthlyPayment")} max="1000000" />
                <Field id="private-additional-payment" label="Optional additional monthly payment" helper="Use dependable cash flow, not overtime that may disappear." prefix="$" value={values.additionalPayment} onChange={(value) => updateValue("additionalPayment", value)} error={fieldError(errors, "additionalMonthlyPayment")} max="1000000" />
                <Field id="private-lump-sum" label="Optional one-time lump sum" helper="Do not use cash needed for an emergency reserve." prefix="$" value={values.lumpSum} onChange={(value) => updateValue("lumpSum", value)} error={fieldError(errors, "lumpSum")} max="10000000" />
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="quote-heading">
              <p className="semantic-label text-action">Step 3</p>
              <h2 id="quote-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Choose whether to compare refinancing</h2>
              <div className="mt-5 max-w-2xl">
                <SelectField id="private-quote-mode" label="Refinance comparison" helper="Use a complete written quote, not an advertised rate." value={values.quoteMode} onChange={(value) => updateValue("quoteMode", value as RefinanceQuoteMode)}>
                  <option value="none">No quote — evaluate the current plan</option>
                  <option value="seek">I want to seek and compare quotes</option>
                  <option value="compare">I have a complete quote to compare</option>
                </SelectField>
              </div>
              {values.quoteMode === "compare" && (
                <div className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
                  <Field id="private-quote-apr" label="Quoted APR" helper="Use the actual APR in the quote, including any stated discount assumptions." suffix="%" value={values.quoteApr} onChange={(value) => updateValue("quoteApr", value)} error={fieldError(errors, "quoteApr")} max="100" />
                  <SelectField id="private-quote-rate-type" label="Quoted rate type" helper="Variable rates can change after closing." value={values.quoteRateType} onChange={(value) => updateValue("quoteRateType", value as RefinanceRateType)}>
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                  </SelectField>
                  <Field id="private-quote-term" label="Quoted refinance term" helper="Enter the full repayment term in months." suffix="months" value={values.quoteTermMonths} onChange={(value) => updateValue("quoteTermMonths", value)} error={fieldError(errors, "quoteTermMonths")} min="1" max="1200" step="1" />
                  <Field id="private-quote-fees" label="Lender or origination fees" helper="Enter all known upfront lender/origination fees. The model assumes they are paid upfront." prefix="$" value={values.quoteFees} onChange={(value) => updateValue("quoteFees", value)} error={fieldError(errors, "quoteFees")} max="10000000" />
                </div>
              )}
            </section>

            {errors.length > 0 && (
              <div role="alert" className="rounded-2xl border border-danger/25 bg-danger-soft p-4 text-sm leading-relaxed text-danger">
                <strong>Correct {errors.length === 1 ? "this entry" : "these entries"}:</strong>
                <ul className="mt-2 space-y-1">{errors.map((error) => <li key={error.code}>• {error.message}</li>)}</ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" size="lg">Build decision outcome</Button>
              <p className="text-xs leading-relaxed text-muted-foreground">Nothing entered here is sent to analytics, a lender, a URL, or My Plan.</p>
            </div>
          </>
        )}

        <details className="rounded-2xl border border-border bg-muted/20 p-4">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Calculation assumptions and rounding</summary>
          <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">Interest accrues monthly at APR ÷ 12. Payments occur monthly, the final payment is allowed to be smaller, and values are rounded only for display. The current schedule uses the entered payment; a refinance payment is calculated from its principal, APR, and term. Entered fees are treated as paid upfront. A variable APR is held constant only to make the estimate possible. No prepayment penalty, tax effect, approval, promotional-rate change, autopay change, or lender-specific protection is assumed.</p>
        </details>
      </form>

      {decision && (
        <DecisionOutcomePanel
          definition={privateStudentLoanDecisionProduct}
          outcome={decision.view}
          sourceRoute={location.pathname}
          copyStatus={copyStatus}
          onCopy={copy}
          onPrint={print}
          onEdit={edit}
          onRestart={restart}
          onMyPlanSaved={() => analytics.track("decision_my_plan_action_saved", { action_id: "save" })}
          onResourceOpen={(resourceId) => analytics.track("decision_neutral_resource_opened", { action_id: "open", resource_id: resourceId })}
          focusKey={focusKey}
          commercialHandoff={commercialHandoff}
        />
      )}
    </div>
  );
};
