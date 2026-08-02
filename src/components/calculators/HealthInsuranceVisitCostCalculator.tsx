import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ReceiptText, ShieldCheck } from "lucide-react";
import { DecisionOutcomePanel } from "@/components/shared/DecisionOutcomePanel";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  healthInsuranceCostShareDecisionProduct,
  HEALTH_INSURANCE_COST_SHARE_DECISION_ID,
} from "@/data/healthInsuranceCostShareDecisionProduct";
import { createDecisionOutcomeAnalytics } from "@/lib/decisionOutcomeAnalytics";
import {
  evaluateHealthInsuranceCostShareDecision,
  type HealthInsuranceCostRule,
  type HealthInsuranceCostShareDecision,
  type HealthInsuranceCostShareValidationError,
  type HealthInsuranceNetworkStatus,
} from "@/lib/healthInsuranceCostShareDecision";

type FormValues = {
  monthlyPremium: string;
  annualDeductible: string;
  deductibleMet: string;
  outOfPocketMaximum: string;
  outOfPocketMet: string;
  allowedAmountPerVisit: string;
  numberOfVisits: string;
  costRule: HealthInsuranceCostRule;
  copayPerVisit: string;
  coinsurancePercent: string;
  networkStatus: HealthInsuranceNetworkStatus;
};

const INITIAL_VALUES: FormValues = {
  monthlyPremium: "180",
  annualDeductible: "1500",
  deductibleMet: "0",
  outOfPocketMaximum: "6000",
  outOfPocketMet: "0",
  allowedAmountPerVisit: "220",
  numberOfVisits: "6",
  costRule: "unknown_or_other",
  copayPerVisit: "30",
  coinsurancePercent: "20",
  networkStatus: "unknown_or_out_of_network",
};

const toNumber = (value: string) => value.trim() === "" ? Number.NaN : Number(value);
const fieldError = (errors: HealthInsuranceCostShareValidationError[], field: string) =>
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
  children: ReactNode;
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

const HealthInsuranceVisitCostCalculator = () => {
  const location = useLocation();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [decision, setDecision] = useState<HealthInsuranceCostShareDecision | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [focusKey, setFocusKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const analytics = useMemo(() => createDecisionOutcomeAnalytics(HEALTH_INSURANCE_COST_SHARE_DECISION_ID), []);

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
  };

  const buildDecision = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markStarted();
    const nextDecision = evaluateHealthInsuranceCostShareDecision({
      monthlyPremium: toNumber(values.monthlyPremium),
      annualDeductible: toNumber(values.annualDeductible),
      deductibleMet: toNumber(values.deductibleMet),
      outOfPocketMaximum: toNumber(values.outOfPocketMaximum),
      outOfPocketMet: toNumber(values.outOfPocketMet),
      allowedAmountPerVisit: toNumber(values.allowedAmountPerVisit),
      numberOfVisits: toNumber(values.numberOfVisits),
      costRule: values.costRule,
      copayPerVisit: values.costRule === "copay_not_subject_to_deductible" || values.costRule === "deductible_then_copay"
        ? toNumber(values.copayPerVisit)
        : undefined,
      coinsurancePercent: values.costRule === "deductible_then_coinsurance"
        ? toNumber(values.coinsurancePercent)
        : undefined,
      networkStatus: values.networkStatus,
    });

    setDecision(nextDecision);
    setCopyStatus("idle");
    setFocusKey((key) => key + 1);
    analytics.track("decision_recommendation_reached", {}, { dedupe: true });
    if (nextDecision.errors.length) {
      analytics.track("decision_validation_blocked", { block_id: nextDecision.errors[0].code }, { dedupe: true });
    } else {
      analytics.track("decision_valid_result_reached", {}, { dedupe: true });
    }
  };

  const restart = () => {
    analytics.track("decision_journey_restarted", { action_id: "restart" });
    analytics.resetTransitions();
    setValues(INITIAL_VALUES);
    setDecision(null);
    setCopyStatus("idle");
    requestAnimationFrame(() => document.getElementById("cost-share-rule")?.focus());
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

  const errors = decision?.state === "insufficient_information" ? decision.errors : [];

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={buildDecision} onFocusCapture={markStarted} className="space-y-6 print:hidden" noValidate>
        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="cost-share-rule-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action-soft text-action"><ReceiptText className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="semantic-label text-action">Step 1</p>
              <h2 id="cost-share-rule-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Identify the service-specific plan rule</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use the exact row in your current Summary of Benefits and Coverage. This tool does not automatically add a deductible, copay, and coinsurance together.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <SelectField id="cost-share-rule" label="How does the plan describe this service?" helper="Choose only what the current plan document says for this exact service." value={values.costRule} onChange={(value) => updateValue("costRule", value as HealthInsuranceCostRule)}>
              <option value="unknown_or_other">I am not sure, or the rule is different</option>
              <option value="copay_not_subject_to_deductible">Fixed copay; deductible does not apply</option>
              <option value="deductible_then_coinsurance">Deductible first, then coinsurance</option>
              <option value="deductible_then_copay">Deductible first, then a copay</option>
            </SelectField>
            <SelectField id="cost-share-network" label="Coverage and network status" helper="The out-of-pocket maximum is applied only when covered in-network status is confirmed." value={values.networkStatus} onChange={(value) => updateValue("networkStatus", value as HealthInsuranceNetworkStatus)}>
              <option value="unknown_or_out_of_network">Unknown, not confirmed, or out of network</option>
              <option value="covered_in_network">Confirmed covered and in network</option>
            </SelectField>
            {(values.costRule === "copay_not_subject_to_deductible" || values.costRule === "deductible_then_copay") && (
              <NumberField id="cost-share-copay" label="Copay per visit" helper="Fixed amount listed for this exact service." prefix="$" value={values.copayPerVisit} onChange={(value) => updateValue("copayPerVisit", value)} error={fieldError(errors, "copayPerVisit")} max="1000000" />
            )}
            {values.costRule === "deductible_then_coinsurance" && (
              <NumberField id="cost-share-coinsurance" label="Coinsurance after deductible" helper="Your percentage of the allowed amount after the deductible is satisfied." suffix="%" value={values.coinsurancePercent} onChange={(value) => updateValue("coinsurancePercent", value)} error={fieldError(errors, "coinsurancePercent")} max="100" />
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-7" aria-labelledby="cost-share-plan-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trust-soft text-trust"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="semantic-label text-trust">Step 2</p>
              <h2 id="cost-share-plan-heading" className="mt-1 font-display text-xl font-bold text-foreground md:text-2xl">Enter plan-year progress and the allowed amount</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use the insurer portal, latest EOB, SBC, or a plan-recognized provider estimate. Do not enter a name, member ID, diagnosis, account number, or claim number.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField id="cost-share-premium" label="Monthly premium" helper="What you pay each month for coverage. Premiums are shown separately from cost sharing." prefix="$" value={values.monthlyPremium} onChange={(value) => updateValue("monthlyPremium", value)} error={fieldError(errors, "monthlyPremium")} max="100000" />
            <NumberField id="cost-share-allowed" label="Allowed amount per visit" helper="The plan-negotiated or recognized amount—not the provider's billed charge." prefix="$" value={values.allowedAmountPerVisit} onChange={(value) => updateValue("allowedAmountPerVisit", value)} error={fieldError(errors, "allowedAmountPerVisit")} max="1000000" />
            <NumberField id="cost-share-visits" label="Number of visits" helper="Whole number of similar visits using the same plan rule." value={values.numberOfVisits} onChange={(value) => updateValue("numberOfVisits", value)} error={fieldError(errors, "numberOfVisits")} min="1" max="1000" step="1" />
            <NumberField id="cost-share-deductible" label="Annual deductible" helper="Individual deductible that applies to this service and network tier." prefix="$" value={values.annualDeductible} onChange={(value) => updateValue("annualDeductible", value)} error={fieldError(errors, "annualDeductible")} max="1000000" />
            <NumberField id="cost-share-deductible-met" label="Deductible already met" helper="Current processed-claim accumulator—not a pending provider charge." prefix="$" value={values.deductibleMet} onChange={(value) => updateValue("deductibleMet", value)} error={fieldError(errors, "deductibleMet")} max="1000000" />
            <NumberField id="cost-share-oop-max" label="Out-of-pocket maximum" helper="Individual covered in-network plan-year limit that applies here." prefix="$" value={values.outOfPocketMaximum} onChange={(value) => updateValue("outOfPocketMaximum", value)} error={fieldError(errors, "outOfPocketMaximum")} max="1000000" />
            <NumberField id="cost-share-oop-met" label="Out-of-pocket amount already met" helper="Current processed-claim accumulator for the same limit." prefix="$" value={values.outOfPocketMet} onChange={(value) => updateValue("outOfPocketMet", value)} error={fieldError(errors, "outOfPocketMet")} max="1000000" />
          </div>
        </section>

        <div className="rounded-2xl border border-caution/25 bg-caution-soft/35 p-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Model boundary:</strong> This estimates one repeated service pattern. Separate facility, professional, laboratory, imaging, anesthesia, medication, equipment, and out-of-network claims may need separate estimates.
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto">Build my patient cost-share estimate</Button>
      </form>

      {decision && (
        <DecisionOutcomePanel
          definition={healthInsuranceCostShareDecisionProduct}
          outcome={decision.view}
          sourceRoute={location.pathname}
          copyStatus={copyStatus}
          onCopy={copy}
          onPrint={print}
          onEdit={edit}
          onRestart={restart}
          onResourceOpen={(resourceId) => analytics.track("decision_neutral_resource_opened", { action_id: "open", resource_id: resourceId })}
          focusKey={focusKey}
        >
          <DisclaimerBox />
        </DecisionOutcomePanel>
      )}
    </div>
  );
};

export default HealthInsuranceVisitCostCalculator;
