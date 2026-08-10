import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { PiggyBank, ShieldCheck } from "lucide-react";
import { DecisionOutcomePanel } from "@/components/shared/DecisionOutcomePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import {
  retirement403bDecisionProduct,
  RETIREMENT_403B_DECISION_ID,
} from "@/data/retirement403bDecisionProduct";
import { createDecisionOutcomeAnalytics } from "@/lib/decisionOutcomeAnalytics";
import { trackJourneyEvent } from "@/lib/journeyAnalytics";
import {
  evaluateRetirement403bDecision,
  type Retirement403bContributionType,
  type Retirement403bDecision,
  type Retirement403bMatchFormula,
  type Retirement403bValidationError,
} from "@/lib/retirement403bDecision";

type FormValues = {
  hourlyWage: string;
  hoursPerWeek: string;
  paychecksPerYear: string;
  employeeContributionPercent: string;
  contributionType: Retirement403bContributionType;
  estimatedFederalMarginalRatePercent: string;
  matchFormula: Retirement403bMatchFormula;
  employerMatchRatePercent: string;
  employerMatchCapPercent: string;
  employerNonElectivePercent: string;
};

const INITIAL_VALUES: FormValues = {
  hourlyWage: "45",
  hoursPerWeek: "36",
  paychecksPerYear: "26",
  employeeContributionPercent: "8",
  contributionType: "traditional",
  estimatedFederalMarginalRatePercent: "22",
  matchFormula: "unknown_or_tiered",
  employerMatchRatePercent: "50",
  employerMatchCapPercent: "6",
  employerNonElectivePercent: "3",
};

const JOURNEY = {
  journey_key: "paycheck_403b",
  surface: "benefits",
  variant: "flagship_funnel_v1",
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const toNumber = (value: string) => value.trim() === "" ? Number.NaN : Number(value);
const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format(Number.isFinite(value) ? value : 0);
const payFrequencyLabel = (paychecksPerYear: string) => {
  if (paychecksPerYear === "52") return "Weekly (52 paychecks/year)";
  if (paychecksPerYear === "26") return "Biweekly (26 paychecks/year)";
  if (paychecksPerYear === "24") return "Semi-monthly (24 paychecks/year)";
  return "Monthly (12 paychecks/year)";
};
const fieldError = (errors: Retirement403bValidationError[], field: string) =>
  errors.find((error) => error.field === field)?.message;

const NumberField = ({
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
        <Input
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
          className={`${prefix ? "pl-8" : ""} ${suffix ? "pr-14" : ""} ${error ? "border-danger" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p id={errorId} role="alert" className="text-xs font-semibold leading-relaxed text-danger">{error}</p>}
    </div>
  );
};

const SelectField = ({
  id,
  label,
  helper,
  value,
  onChange,
  children,
}: {
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
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={helperId}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {children}
      </select>
    </div>
  );
};

export const Calc403bEmailEstimate = () => {
  const location = useLocation();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [decision, setDecision] = useState<Retirement403bDecision | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [focusKey, setFocusKey] = useState(0);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const journeyStartedRef = useRef(false);
  const analytics = useMemo(() => createDecisionOutcomeAnalytics(RETIREMENT_403B_DECISION_ID), []);

  useEffect(() => {
    trackJourneyEvent("journey_viewed", { ...JOURNEY, phase: "name_question", step_index: 0 });
  }, []);

  const markStarted = () => {
    analytics.track("decision_calculator_started", {}, { dedupe: true });
    if (journeyStartedRef.current) return;
    journeyStartedRef.current = true;
    trackJourneyEvent("journey_started", { ...JOURNEY, phase: "name_question", step_index: 0 });
  };
  const clearStaleResult = () => {
    if (decision) analytics.track("decision_assumptions_edited", { action_id: "edit" }, { dedupe: true });
    setDecision(null);
    setCopyStatus("idle");
    setStatus("idle");
    setMessage("");
  };

  const updateValue = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    markStarted();
    clearStaleResult();
    setValues((current) => ({ ...current, [key]: value }));
  };

  const buildDecision = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markStarted();
    const nextDecision = evaluateRetirement403bDecision({
      hourlyWage: toNumber(values.hourlyWage),
      hoursPerWeek: toNumber(values.hoursPerWeek),
      paychecksPerYear: toNumber(values.paychecksPerYear),
      employeeContributionPercent: toNumber(values.employeeContributionPercent),
      contributionType: values.contributionType,
      estimatedFederalMarginalRatePercent: values.contributionType === "traditional"
        ? toNumber(values.estimatedFederalMarginalRatePercent)
        : 0,
      matchFormula: values.matchFormula,
      employerMatchRatePercent: values.matchFormula === "partial_match_up_to"
        ? toNumber(values.employerMatchRatePercent)
        : undefined,
      employerMatchCapPercent: values.matchFormula === "full_match_up_to" || values.matchFormula === "partial_match_up_to"
        ? toNumber(values.employerMatchCapPercent)
        : undefined,
      employerNonElectivePercent: values.matchFormula === "non_elective"
        ? toNumber(values.employerNonElectivePercent)
        : undefined,
    });

    setDecision(nextDecision);
    setCopyStatus("idle");
    setFocusKey((key) => key + 1);
    analytics.track("decision_recommendation_reached", {}, { dedupe: true });
    if (nextDecision.errors.length) {
      analytics.track("decision_validation_blocked", { block_id: nextDecision.errors[0].code }, { dedupe: true });
    } else {
      analytics.track("decision_valid_result_reached", {}, { dedupe: true });
      trackJourneyEvent("journey_result_reached", { ...JOURNEY, phase: "result", step_index: 1 });
    }
  };

  const restart = () => {
    analytics.track("decision_journey_restarted", { action_id: "restart" });
    trackJourneyEvent("journey_restarted", { ...JOURNEY, phase: "name_question", step_index: 0 });
    analytics.resetTransitions();
    journeyStartedRef.current = false;
    setValues(INITIAL_VALUES);
    setDecision(null);
    setCopyStatus("idle");
    setStatus("idle");
    setMessage("");
    requestAnimationFrame(() => document.getElementById("calc403b-hourly-wage")?.focus());
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
      trackJourneyEvent("journey_result_copied", { ...JOURNEY, phase: "result", step_index: 1 });
    } catch {
      setCopyStatus("failed");
    }
  };

  const print = () => {
    analytics.track("decision_portable_output_used", { action_id: "print" });
    trackJourneyEvent("journey_result_printed", { ...JOURNEY, phase: "result", step_index: 1 });
    window.print();
  };

  const sendEstimate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!decision || decision.errors.length) return;
    const cleanEmail = email.trim().toLowerCase();
    setMessage("");

    if (!emailPattern.test(cleanEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setMessage("Check the consent box before sending.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "403b-estimate",
          source: "403b-calculator",
          email: cleanEmail,
          firstName: firstName.trim(),
          consent,
          website,
          estimate: {
            hourly: formatCurrency(toNumber(values.hourlyWage)),
            hoursWeek: `${values.hoursPerWeek} hours/week`,
            payFrequency: payFrequencyLabel(values.paychecksPerYear),
            contributionPercent: `${values.employeeContributionPercent}%`,
            employerMatchPercent: decision.view.assumptions.find((assumption) => assumption.label === "Employer formula")?.value ?? "Not estimated—verify the plan formula",
            contributionType: values.contributionType === "traditional" ? "Traditional" : "Roth",
            grossPerCheck: formatCurrency(decision.grossPaycheck),
            employeePerCheck: formatCurrency(decision.employeeContributionPerPaycheck),
            annualEmployee: formatCurrency(decision.annualEmployeeContribution),
            annualEmployer: decision.annualEmployerContribution === null ? "Not estimated" : formatCurrency(decision.annualEmployerContribution),
            totalRetirement: decision.annualTotalContribution === null ? "Not estimated" : formatCurrency(decision.annualTotalContribution),
            taxableReduction: formatCurrency(values.contributionType === "traditional" ? decision.annualEmployeeContribution : 0),
            estimatedTaxSavings: formatCurrency(decision.estimatedAnnualFederalTaxReduction),
          },
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "Email failed.");

      setStatus("success");
      setMessage("Sent. Check your inbox for the estimate.");
      setEmail("");
      setFirstName("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Email failed. Try again in a minute.");
    }
  };

  const errors = decision?.state === "insufficient_information" ? decision.errors : [];

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={buildDecision} onFocusCapture={markStarted} className="space-y-6 print:hidden" noValidate>
        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="calc403b-pay-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action-soft text-action"><PiggyBank className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="semantic-label text-action">Step 1</p>
              <h2 id="calc403b-pay-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Estimate the employee contribution</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use base pay and a normal schedule. Do not enter your name, employee ID, account number, or employer name.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField id="calc403b-hourly-wage" label="Hourly wage" helper="Base hourly rate used as eligible pay for this estimate." prefix="$" value={values.hourlyWage} onChange={(value) => updateValue("hourlyWage", value)} error={fieldError(errors, "hourlyWage")} max="10000" />
            <NumberField id="calc403b-hours-week" label="Hours per week" helper="Typical scheduled hours, not an unusually high overtime week." value={values.hoursPerWeek} onChange={(value) => updateValue("hoursPerWeek", value)} error={fieldError(errors, "hoursPerWeek")} max="168" />
            <SelectField id="calc403b-paychecks" label="Pay frequency" helper="Choose the number of paychecks expected each year." value={values.paychecksPerYear} onChange={(value) => updateValue("paychecksPerYear", value)}>
              <option value="52">Weekly (52)</option>
              <option value="26">Biweekly (26)</option>
              <option value="24">Semi-monthly (24)</option>
              <option value="12">Monthly (12)</option>
            </SelectField>
            <NumberField id="calc403b-contribution" label="Your contribution" helper="Percentage of eligible pay sent to the 403(b)." suffix="%" value={values.employeeContributionPercent} onChange={(value) => updateValue("employeeContributionPercent", value)} error={fieldError(errors, "employeeContributionPercent")} max="100" />
            <SelectField id="calc403b-contribution-type" label="Contribution type" helper="Traditional contributions generally reduce current federal taxable income; Roth contributions do not." value={values.contributionType} onChange={(value) => updateValue("contributionType", value as Retirement403bContributionType)}>
              <option value="traditional">Traditional</option>
              <option value="roth">Roth</option>
            </SelectField>
            {values.contributionType === "traditional" && (
              <NumberField id="calc403b-tax-rate" label="Estimated federal marginal rate" helper="Illustrative federal rate only; this is not a tax-return calculation." suffix="%" value={values.estimatedFederalMarginalRatePercent} onChange={(value) => updateValue("estimatedFederalMarginalRatePercent", value)} error={fieldError(errors, "estimatedFederalMarginalRatePercent")} max="100" />
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="calc403b-match-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trust-soft text-trust"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="semantic-label text-trust">Step 2</p>
              <h2 id="calc403b-match-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Enter the actual employer-contribution formula</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A label such as “6% match” is not enough. Use the current Summary Plan Description or benefits guide.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <SelectField id="calc403b-match-formula" label="Employer contribution formula" helper="Choose unknown when the formula is tiered, discretionary, unclear, or depends on details not represented here." value={values.matchFormula} onChange={(value) => updateValue("matchFormula", value as Retirement403bMatchFormula)}>
                <option value="unknown_or_tiered">Unknown, tiered, discretionary, or other formula</option>
                <option value="full_match_up_to">Employer matches 100% up to a percentage of pay</option>
                <option value="partial_match_up_to">Employer matches part of each dollar up to a contribution percentage</option>
                <option value="non_elective">Employer contributes a percentage whether or not I contribute</option>
              </SelectField>
            </div>

            {values.matchFormula === "full_match_up_to" && (
              <NumberField id="calc403b-match-cap" label="Employee contribution eligible for the match" helper="Example: enter 6 when the employer matches dollar for dollar on the first 6% of pay contributed." suffix="% of pay" value={values.employerMatchCapPercent} onChange={(value) => updateValue("employerMatchCapPercent", value)} error={fieldError(errors, "employerMatchCapPercent")} max="100" />
            )}

            {values.matchFormula === "partial_match_up_to" && (
              <>
                <NumberField id="calc403b-match-rate" label="Employer contribution per dollar contributed" helper="Enter 50 for a 50-cent employer contribution per $1 contributed." suffix="%" value={values.employerMatchRatePercent} onChange={(value) => updateValue("employerMatchRatePercent", value)} error={fieldError(errors, "employerMatchRatePercent")} max="100" />
                <NumberField id="calc403b-match-cap" label="Employee contribution eligible for the partial match" helper="Example: enter 6 when the partial match applies to the first 6% of pay contributed." suffix="% of pay" value={values.employerMatchCapPercent} onChange={(value) => updateValue("employerMatchCapPercent", value)} error={fieldError(errors, "employerMatchCapPercent")} max="100" />
              </>
            )}

            {values.matchFormula === "non_elective" && (
              <NumberField id="calc403b-non-elective" label="Employer non-elective contribution" helper="Percentage of eligible pay contributed without requiring an employee deferral." suffix="% of pay" value={values.employerNonElectivePercent} onChange={(value) => updateValue("employerNonElectivePercent", value)} error={fieldError(errors, "employerNonElectivePercent")} max="100" />
            )}
          </div>

          {values.matchFormula === "unknown_or_tiered" && (
            <div className="mt-5 rounded-2xl border border-caution/25 bg-caution-soft/45 p-4 text-sm leading-relaxed text-muted-foreground">
              The result will intentionally omit an employer-contribution estimate and provide a verification checklist. This prevents a generic percentage from overstating compensation.
            </div>
          )}

          <Button type="submit" variant="hero" className="mt-6 w-full sm:w-auto">Build my 403(b) decision outcome</Button>
        </section>
      </form>

      {decision && (
        <DecisionOutcomePanel
          definition={retirement403bDecisionProduct}
          outcome={decision.view}
          sourceRoute={location.pathname}
          copyStatus={copyStatus}
          onCopy={copy}
          onPrint={print}
          onEdit={edit}
          onRestart={restart}
          onResourceOpen={(resourceId) => analytics.track("decision_neutral_resource_opened", { resource_id: resourceId })}
          focusKey={focusKey}
        />
      )}

      {decision && !decision.errors.length && (
        <form onSubmit={sendEstimate} className="space-y-3 rounded-2xl border border-primary/20 bg-primary-soft/35 p-4 print:hidden">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Optional portable copy</div>
            <h3 className="mt-1 font-display text-lg font-bold">Email this 403(b) estimate</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Email is optional. Submitting sends your email address and the displayed estimate fields to CAF&apos;s email provider for delivery; ordinary calculator use does not send those values.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc403b-first-name" className="text-xs font-semibold">First name</Label>
            <Input id="calc403b-first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Optional" autoComplete="given-name" maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc403b-email" className="text-xs font-semibold">Email</Label>
            <Input id="calc403b-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" maxLength={254} required />
          </div>
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="calc403b-website">Website</Label>
            <Input id="calc403b-website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border bg-card/70 p-3 text-xs leading-relaxed text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-primary" />
            <span>I agree to receive this estimate and educational emails. I can unsubscribe anytime.</span>
          </label>
          <Button type="submit" variant="hero" className="w-full" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Email my estimate"}</Button>
          {message && <p role={status === "error" ? "alert" : "status"} className={`text-sm font-medium ${status === "success" ? "text-primary" : "text-destructive"}`}>{message}</p>}
        </form>
      )}

      <DisclaimerBox short />
    </div>
  );
};
