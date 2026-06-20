import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

const num = (s: string, fallback = 0) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : fallback;
};

type FilingStatus = "single" | "joint" | "marriedSeparate";

const filingRules = {
  single: { label: "Single / Head of household", cap: 12500, threshold: 150000, eligible: true },
  joint: { label: "Married filing jointly", cap: 25000, threshold: 300000, eligible: true },
  marriedSeparate: { label: "Married filing separately", cap: 0, threshold: 0, eligible: false },
};

const CalcOvertimeDeduction = () => {
  const [hourly, setHourly] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("8");
  const [weeks, setWeeks] = useState("20");
  const [multiplier, setMultiplier] = useState("1.5");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [magi, setMagi] = useState("85000");
  const [federalRate, setFederalRate] = useState("22");

  const hourlyN = Math.max(0, num(hourly));
  const overtimeHoursN = Math.max(0, num(overtimeHours));
  const weeksN = Math.max(0, num(weeks));
  const multiplierN = Math.max(1, num(multiplier, 1.5));
  const federalRateN = Math.max(0, num(federalRate));
  const magiN = Math.max(0, num(magi));
  const rule = filingRules[filingStatus];

  const annualOvertimeHours = overtimeHoursN * weeksN;
  const annualGrossOvertimePay = hourlyN * multiplierN * annualOvertimeHours;
  const flsaPremium = hourlyN * 0.5 * annualOvertimeHours;
  const prePhaseoutDeduction = rule.eligible ? Math.min(flsaPremium, rule.cap) : 0;
  const possibleTaxSavings = prePhaseoutDeduction * (federalRateN / 100);
  const overThreshold = rule.eligible && magiN > rule.threshold;
  const extraEmployerPremium = Math.max(annualGrossOvertimePay - hourlyN * 1.5 * annualOvertimeHours, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Regular hourly rate" prefix="$" value={hourly} onChange={setHourly} helper="Your regular base hourly rate before overtime." />
          <CalculatorInput label="Qualifying OT hours / week" value={overtimeHours} onChange={setOvertimeHours} helper="Hours over 40 in a workweek that may be FLSA overtime." />
          <CalculatorInput label="Weeks with overtime" value={weeks} onChange={setWeeks} helper="How many weeks this year you expect those overtime hours." />
          <CalculatorInput label="Actual overtime multiplier" value={multiplier} onChange={setMultiplier} step="0.1" suffix="x" helper="Most time-and-a-half overtime is 1.5x. Some shifts may pay more." />
          <CalculatorSelectField label="Filing status" helper="The OBBB deduction cap depends on filing status.">
            <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single / Head of household</SelectItem>
                <SelectItem value="joint">Married filing jointly</SelectItem>
                <SelectItem value="marriedSeparate">Married filing separately</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorInput label="Estimated MAGI" prefix="$" value={magi} onChange={setMagi} helper="Used only to flag possible phaseout risk." />
          <CalculatorInput label="Estimated federal marginal rate" suffix="%" value={federalRate} onChange={setFederalRate} helper="Used to estimate income-tax savings from the deduction." />
        </div>

        <div className="rounded-2xl bg-muted/30 border border-border p-5 text-sm leading-relaxed">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">How this is calculated</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Annual overtime hours = qualifying overtime hours/week × weeks with overtime</li>
            <li>Estimated FLSA overtime premium = regular hourly rate × 0.5 × annual overtime hours</li>
            <li>Potential deduction before MAGI phaseout = lesser of estimated premium or the annual cap</li>
            <li>Estimated federal tax savings = potential deduction × federal marginal tax rate</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground/80">
            This estimates the federal income-tax deduction only. It does not estimate Social Security tax, Medicare tax, state tax, local tax, withholding timing, or every tax-return limitation.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Annual overtime hours" value={`${annualOvertimeHours.toLocaleString()} hrs`} />
        <CalculatorResult label="Gross overtime pay" value={formatUSD(annualGrossOvertimePay)} helper="Total pay for the overtime hours at the selected multiplier." />
        <CalculatorResult label="Estimated qualifying premium" value={formatUSD(flsaPremium)} emphasis="primary" helper="Usually the 0.5x premium, not the full 1.5x overtime hour." />
        <CalculatorResult label="Deduction cap" value={formatUSD(rule.cap)} helper={rule.label} />
        <CalculatorResult
          label="Potential deduction before MAGI phaseout"
          value={formatUSD(prePhaseoutDeduction)}
          emphasis="accent"
          helper={rule.eligible ? "This is capped and may be further reduced if your income is above the phaseout threshold." : "Married filing separately is generally not eligible under the IRS summary."}
        />
        <CalculatorResult
          label="Estimated federal tax savings"
          value={formatUSD(possibleTaxSavings)}
          helper="Rough estimate before any MAGI phaseout, credits, withholding effects, or tax software adjustments."
        />
        {extraEmployerPremium > 0 && (
          <CalculatorResult
            label="Extra premium above 1.5x"
            value={formatUSD(extraEmployerPremium)}
            helper="This shows pay above time-and-a-half. The calculator does not treat this extra employer premium as qualified FLSA overtime premium."
          />
        )}
        {overThreshold && (
          <CalculatorMeaning>
            Your estimated MAGI is above the IRS phaseout threshold for this filing status. The calculator shows the pre-phaseout deduction, so the real deduction may be lower.
          </CalculatorMeaning>
        )}
        {!rule.eligible && (
          <CalculatorMeaning>
            The IRS summary says married taxpayers generally must file jointly to claim the deduction. Use this as a planning prompt, not a tax filing answer.
          </CalculatorMeaning>
        )}
        <CalculatorMeaning>
          For healthcare workers, the key point is the half-time overtime premium. The regular-rate portion of the overtime hour is still normal taxable wage income.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export default CalcOvertimeDeduction;
