import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRightLeft, BriefcaseBusiness, CheckCircle2, Copy, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  compareCompensation,
  createDefaultCompensationInput,
  type ComparisonResult,
  type CompensationInput,
  type PayType,
  type QualityOfLifeInput,
} from "@/lib/totalCompensation";

const TOOL_ID = "healthcare_worker_total_compensation";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultOfferA = createDefaultCompensationInput("Current or bedside role", "hourly");
const defaultOfferB = createDefaultCompensationInput("New or non-bedside offer", "salary");

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const NumberField = ({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
  help,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  help?: string;
}) => (
  <label htmlFor={id} className="block min-w-0 space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <span className="flex min-w-0 items-center rounded-xl border border-border bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      {prefix && <span className="shrink-0 pl-3 text-sm font-semibold text-muted-foreground" aria-hidden="true">{prefix}</span>}
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(parseNumber(event.target.value))}
        className="h-11 min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm font-medium text-foreground outline-none"
      />
      {suffix && <span className="shrink-0 pr-3 text-xs font-semibold text-muted-foreground">{suffix}</span>}
    </span>
    {help && <span className="block text-xs leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const TextField = ({ id, label, value, onChange, help }: { id: string; label: string; value: string; onChange: (value: string) => void; help?: string }) => (
  <label htmlFor={id} className="block min-w-0 space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value.slice(0, 80))}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
    {help && <span className="block text-xs leading-relaxed text-muted-foreground">{help}</span>}
  </label>
);

const SelectField = ({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (value: string) => void }) => (
  <label htmlFor={id} className="block space-y-1.5">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const OfferEditor = ({
  prefix,
  offer,
  onChange,
  onQualityChange,
}: {
  prefix: "a" | "b";
  offer: CompensationInput;
  onChange: (patch: Partial<CompensationInput>) => void;
  onQualityChange: (patch: Partial<QualityOfLifeInput>) => void;
}) => {
  const setPayType = (payType: PayType) => {
    const defaults = createDefaultCompensationInput(offer.name, payType);
    onChange({
      payType,
      scheduledHoursPerWeek: defaults.scheduledHoursPerWeek,
      hourlyRate: payType === "hourly" ? offer.hourlyRate || defaults.hourlyRate : 0,
      annualSalary: payType === "salary" ? offer.annualSalary || defaults.annualSalary : 0,
      qualityOfLife: { ...offer.qualityOfLife, workdaysPerWeek: defaults.qualityOfLife.workdaysPerWeek },
    });
  };

  return (
    <fieldset className="min-w-0 space-y-6 rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
      <legend className="px-2 font-display text-lg font-bold text-foreground">{prefix === "a" ? "Role A" : "Role B"}</legend>

      <TextField id={`${prefix}-name`} label="Role or offer name" value={offer.name} onChange={(name) => onChange({ name })} />

      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Pay structure</span>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={`${offer.name} pay structure`}>
          {(["hourly", "salary"] as PayType[]).map((payType) => (
            <button
              key={payType}
              type="button"
              aria-pressed={offer.payType === payType}
              onClick={() => setPayType(payType)}
              className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition ${offer.payType === payType ? "border-primary bg-primary-soft text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`}
            >
              {payType === "hourly" ? "Hourly" : "Salary"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {offer.payType === "hourly" ? (
          <NumberField id={`${prefix}-hourly-rate`} label="Hourly rate" value={offer.hourlyRate} onChange={(hourlyRate) => onChange({ hourlyRate })} prefix="$" step="0.01" />
        ) : (
          <NumberField id={`${prefix}-annual-salary`} label="Annual salary" value={offer.annualSalary} onChange={(annualSalary) => onChange({ annualSalary })} prefix="$" />
        )}
        <NumberField id={`${prefix}-hours`} label="Scheduled hours per week" value={offer.scheduledHoursPerWeek} onChange={(scheduledHoursPerWeek) => onChange({ scheduledHoursPerWeek })} suffix="hours" step="0.5" />
        <NumberField id={`${prefix}-weeks`} label="Paid work weeks per year" value={offer.weeksWorkedPerYear} onChange={(weeksWorkedPerYear) => onChange({ weeksWorkedPerYear })} suffix="weeks" help="Use 52 when salary or hourly pay continues through paid leave; use fewer weeks when unpaid time is expected." />
        <NumberField id={`${prefix}-bonus`} label="Expected annual bonus" value={offer.annualBonus} onChange={(annualBonus) => onChange({ annualBonus })} prefix="$" />
      </div>

      {offer.payType === "hourly" && (
        <div className="grid gap-4 rounded-2xl border border-border bg-muted/25 p-4 sm:grid-cols-2">
          <NumberField id={`${prefix}-ot-hours`} label="Expected overtime hours per week" value={offer.overtimeHoursPerWeek} onChange={(overtimeHoursPerWeek) => onChange({ overtimeHoursPerWeek })} suffix="hours" step="0.5" />
          <NumberField id={`${prefix}-ot-multiplier`} label="Overtime multiplier" value={offer.overtimeMultiplier} onChange={(overtimeMultiplier) => onChange({ overtimeMultiplier })} suffix="× rate" step="0.1" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField id={`${prefix}-diff`} label="Shift or specialty differential" value={offer.differentialPerHour} onChange={(differentialPerHour) => onChange({ differentialPerHour })} prefix="$" suffix="per hour" step="0.01" />
        <NumberField id={`${prefix}-diff-hours`} label="Differential hours per week" value={offer.differentialHoursPerWeek} onChange={(differentialHoursPerWeek) => onChange({ differentialHoursPerWeek })} suffix="hours" step="0.5" />
        <NumberField id={`${prefix}-health-premium`} label="Your annual health premium" value={offer.annualEmployeeHealthPremium} onChange={(annualEmployeeHealthPremium) => onChange({ annualEmployeeHealthPremium })} prefix="$" help="Use your payroll deduction multiplied by the number of paychecks." />
        <NumberField id={`${prefix}-retirement-percent`} label="Employer retirement contribution" value={offer.employerRetirementPercent} onChange={(employerRetirementPercent) => onChange({ employerRetirementPercent })} suffix="% of base pay" step="0.1" />
        <NumberField id={`${prefix}-pto`} label="Paid time off" value={offer.paidTimeOffHours} onChange={(paidTimeOffHours) => onChange({ paidTimeOffHours })} suffix="hours" help="Shown separately. Salary PTO is not added again to total compensation because annual salary usually already includes it." />
        <NumberField id={`${prefix}-pay-periods`} label="Paychecks per year" value={offer.payPeriodsPerYear} onChange={(payPeriodsPerYear) => onChange({ payPeriodsPerYear })} suffix="paychecks" />
      </div>

      <details
        className="group rounded-2xl border border-border bg-background"
        onToggle={(event) => {
          if ((event.currentTarget as HTMLDetailsElement).open) {
            trackSiteEvent("tool_optional_section_opened", { event_category: "tools", tool_id: TOOL_ID, section: "advanced_compensation" });
          }
        }}
      >
        <summary className="cursor-pointer list-none px-4 py-4 text-sm font-bold text-foreground marker:hidden">
          <span className="flex items-center justify-between gap-3">
            Add advanced benefits and work costs
            <span className="text-xs font-semibold text-primary group-open:hidden">Show</span>
            <span className="hidden text-xs font-semibold text-primary group-open:inline">Hide</span>
          </span>
        </summary>
        <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
          <NumberField id={`${prefix}-fixed-retirement`} label="Fixed employer retirement contribution" value={offer.employerRetirementFixed} onChange={(employerRetirementFixed) => onChange({ employerRetirementFixed })} prefix="$" />
          <NumberField id={`${prefix}-hsa`} label="Employer HSA or HRA contribution" value={offer.employerHsaHraContribution} onChange={(employerHsaHraContribution) => onChange({ employerHsaHraContribution })} prefix="$" />
          <NumberField id={`${prefix}-additional-benefits`} label="Other benefits you can reasonably value" value={offer.additionalBenefitValue} onChange={(additionalBenefitValue) => onChange({ additionalBenefitValue })} prefix="$" help="Examples: tuition assistance you expect to use, certification reimbursement, or employer-paid benefits with a known value." />
          <NumberField id={`${prefix}-signon`} label="Annualized sign-on bonus" value={offer.signOnBonusAnnualized} onChange={(signOnBonusAnnualized) => onChange({ signOnBonusAnnualized })} prefix="$" help="Divide a one-time bonus across the period you must remain employed to keep it." />
          <NumberField id={`${prefix}-holiday`} label="Holiday, charge, call, or specialty pay" value={offer.holidayAndSpecialtyPay} onChange={(holidayAndSpecialtyPay) => onChange({ holidayAndSpecialtyPay })} prefix="$" suffix="per year" />
          <NumberField id={`${prefix}-dental`} label="Your annual dental and vision premiums" value={offer.annualDentalVisionPremium} onChange={(annualDentalVisionPremium) => onChange({ annualDentalVisionPremium })} prefix="$" />
          <NumberField id={`${prefix}-commute`} label="Estimated annual commuting cost" value={offer.annualCommuteCost} onChange={(annualCommuteCost) => onChange({ annualCommuteCost })} prefix="$" help="Use your own estimate for fuel, wear, transit, or rideshare. The tool does not assume an IRS mileage rate." />
          <NumberField id={`${prefix}-parking`} label="Parking and tolls" value={offer.annualParkingAndTolls} onChange={(annualParkingAndTolls) => onChange({ annualParkingAndTolls })} prefix="$" suffix="per year" />
          <NumberField id={`${prefix}-unpaid-hours`} label="Unpaid work outside scheduled hours" value={offer.unpaidHoursPerWeek} onChange={(unpaidHoursPerWeek) => onChange({ unpaidHoursPerWeek })} suffix="hours/week" step="0.5" help="Useful for salaried roles with charting, email, travel, or administrative work outside the stated schedule." />
        </div>
      </details>

      <details
        className="group rounded-2xl border border-border bg-background"
        onToggle={(event) => {
          if ((event.currentTarget as HTMLDetailsElement).open) {
            trackSiteEvent("tool_optional_section_opened", { event_category: "tools", tool_id: TOOL_ID, section: "quality_of_life" });
          }
        }}
      >
        <summary className="cursor-pointer list-none px-4 py-4 text-sm font-bold text-foreground marker:hidden">
          <span className="flex items-center justify-between gap-3">
            Add quality-of-life details
            <span className="text-xs font-semibold text-primary group-open:hidden">Show</span>
            <span className="hidden text-xs font-semibold text-primary group-open:inline">Hide</span>
          </span>
        </summary>
        <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
          <NumberField id={`${prefix}-workdays`} label="Scheduled workdays per week" value={offer.qualityOfLife.workdaysPerWeek} onChange={(workdaysPerWeek) => onQualityChange({ workdaysPerWeek })} suffix="days" step="0.5" />
          <NumberField id={`${prefix}-commute-minutes`} label="Round-trip commute time" value={offer.qualityOfLife.commuteMinutesPerWorkday} onChange={(commuteMinutesPerWorkday) => onQualityChange({ commuteMinutesPerWorkday })} suffix="minutes/workday" />
          <SelectField id={`${prefix}-weekends`} label="Weekends" value={offer.qualityOfLife.weekends} options={["Not entered", "None", "Occasional", "Frequent", "Most weekends"]} onChange={(weekends) => onQualityChange({ weekends })} />
          <SelectField id={`${prefix}-nights`} label="Night shifts" value={offer.qualityOfLife.nights} options={["Not entered", "None", "Occasional", "Frequent", "Primarily nights"]} onChange={(nights) => onQualityChange({ nights })} />
          <SelectField id={`${prefix}-holidays`} label="Holiday requirement" value={offer.qualityOfLife.holidays} options={["Not entered", "None", "Rotating", "Several each year", "Frequent"]} onChange={(holidays) => onQualityChange({ holidays })} />
          <SelectField id={`${prefix}-oncall`} label="On-call burden" value={offer.qualityOfLife.onCall} options={["Not entered", "None", "Light", "Moderate", "Heavy"]} onChange={(onCall) => onQualityChange({ onCall })} />
          <SelectField id={`${prefix}-predictability`} label="Schedule predictability" value={offer.qualityOfLife.schedulePredictability} options={["Not entered", "Very predictable", "Mostly predictable", "Variable", "Highly unpredictable"]} onChange={(schedulePredictability) => onQualityChange({ schedulePredictability })} />
          <SelectField id={`${prefix}-flexibility`} label="Remote or schedule flexibility" value={offer.qualityOfLife.flexibility} options={["Not entered", "High", "Moderate", "Limited", "None"]} onChange={(flexibility) => onQualityChange({ flexibility })} />
          <SelectField id={`${prefix}-physical`} label="Physical demand" value={offer.qualityOfLife.physicalDemand} options={["Not entered", "Low", "Moderate", "High", "Very high"]} onChange={(physicalDemand) => onQualityChange({ physicalDemand })} />
          <SelectField id={`${prefix}-travel`} label="Travel requirement" value={offer.qualityOfLife.travel} options={["Not entered", "None", "Local", "Regional", "Frequent overnight"]} onChange={(travel) => onQualityChange({ travel })} />
          <SelectField id={`${prefix}-career`} label="Career-development potential" value={offer.qualityOfLife.careerDevelopment} options={["Not entered", "Strong", "Moderate", "Limited", "Unclear"]} onChange={(careerDevelopment) => onQualityChange({ careerDevelopment })} />
        </div>
      </details>
    </fieldset>
  );
};

const ResultTable = ({ comparison, offerA, offerB }: { comparison: ComparisonResult; offerA: CompensationInput; offerB: CompensationInput }) => {
  const rows = [
    ["Base annual cash", comparison.offerA.baseAnnualCash, comparison.offerB.baseAnnualCash],
    ["Overtime pay", comparison.offerA.overtimePay, comparison.offerB.overtimePay],
    ["Shift and specialty differential", comparison.offerA.differentialPay, comparison.offerB.differentialPay],
    ["Total direct cash compensation", comparison.offerA.annualCashCompensation, comparison.offerB.annualCashCompensation],
    ["Employer retirement contribution", comparison.offerA.employerRetirementContribution, comparison.offerB.employerRetirementContribution],
    ["Employer HSA or HRA contribution", comparison.offerA.employerHsaHraContribution, comparison.offerB.employerHsaHraContribution],
    ["Other estimated employer benefits", comparison.offerA.additionalBenefitValue, comparison.offerB.additionalBenefitValue],
    ["PTO value shown", comparison.offerA.ptoValue, comparison.offerB.ptoValue],
    ["Selected employee and work costs", -comparison.offerA.annualEmployeeCosts, -comparison.offerB.annualEmployeeCosts],
    ["Estimated annual value after selected costs", comparison.offerA.totalAfterSelectedCosts, comparison.offerB.totalAfterSelectedCosts],
  ] as const;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <caption className="sr-only">Total compensation comparison between {offerA.name} and {offerB.name}</caption>
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold text-foreground">Component</th>
            <th scope="col" className="px-4 py-3 text-right font-bold text-foreground">{offerA.name || "Role A"}</th>
            <th scope="col" className="px-4 py-3 text-right font-bold text-foreground">{offerB.name || "Role B"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, a, b], index) => (
            <tr key={label} className={index === rows.length - 1 ? "border-t-2 border-primary/30 bg-primary-soft/30" : "border-t border-border"}>
              <th scope="row" className="px-4 py-3 font-semibold text-foreground">{label}</th>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{currency.format(a)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{currency.format(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const QualityTable = ({ offerA, offerB }: { offerA: CompensationInput; offerB: CompensationInput }) => {
  const rows = [
    ["Workdays per week", String(offerA.qualityOfLife.workdaysPerWeek || "Not entered"), String(offerB.qualityOfLife.workdaysPerWeek || "Not entered")],
    ["Weekends", offerA.qualityOfLife.weekends, offerB.qualityOfLife.weekends],
    ["Nights", offerA.qualityOfLife.nights, offerB.qualityOfLife.nights],
    ["Holidays", offerA.qualityOfLife.holidays, offerB.qualityOfLife.holidays],
    ["On-call burden", offerA.qualityOfLife.onCall, offerB.qualityOfLife.onCall],
    ["Round-trip commute", offerA.qualityOfLife.commuteMinutesPerWorkday ? `${offerA.qualityOfLife.commuteMinutesPerWorkday} minutes` : "Not entered", offerB.qualityOfLife.commuteMinutesPerWorkday ? `${offerB.qualityOfLife.commuteMinutesPerWorkday} minutes` : "Not entered"],
    ["Schedule predictability", offerA.qualityOfLife.schedulePredictability, offerB.qualityOfLife.schedulePredictability],
    ["Flexibility", offerA.qualityOfLife.flexibility, offerB.qualityOfLife.flexibility],
    ["Physical demand", offerA.qualityOfLife.physicalDemand, offerB.qualityOfLife.physicalDemand],
    ["Travel", offerA.qualityOfLife.travel, offerB.qualityOfLife.travel],
    ["Career development", offerA.qualityOfLife.careerDevelopment, offerB.qualityOfLife.careerDevelopment],
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <caption className="sr-only">Non-financial quality-of-life comparison</caption>
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold text-foreground">Factor</th>
            <th scope="col" className="px-4 py-3 font-bold text-foreground">{offerA.name || "Role A"}</th>
            <th scope="col" className="px-4 py-3 font-bold text-foreground">{offerB.name || "Role B"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, a, b]) => (
            <tr key={label} className="border-t border-border">
              <th scope="row" className="px-4 py-3 font-semibold text-foreground">{label}</th>
              <td className="px-4 py-3 text-muted-foreground">{a}</td>
              <td className="px-4 py-3 text-muted-foreground">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const buildCopyText = (comparison: ComparisonResult, offerA: CompensationInput, offerB: CompensationInput) => {
  const breakEven = comparison.breakEven.requiredHourlyRate !== null
    ? `${comparison.breakEven.lowerOfferName} would need about ${currencyPrecise.format(comparison.breakEven.requiredHourlyRate)} per hour in base pay to match ${comparison.breakEven.targetOfferName}, assuming the other entered factors stay the same.`
    : `${comparison.breakEven.lowerOfferName} would need about ${currency.format(comparison.breakEven.requiredAnnualSalary ?? 0)} in annual base salary to match ${comparison.breakEven.targetOfferName}, assuming the other entered factors stay the same.`;

  return [
    "Healthcare Worker Total Compensation Comparison",
    `Generated ${new Date().toLocaleDateString()}`,
    "",
    `${offerA.name}: ${currency.format(comparison.offerA.totalAfterSelectedCosts)} estimated annual value after selected costs (${currencyPrecise.format(comparison.offerA.effectiveCompensationPerActualHour)} per actual hour).`,
    `${offerB.name}: ${currency.format(comparison.offerB.totalAfterSelectedCosts)} estimated annual value after selected costs (${currencyPrecise.format(comparison.offerB.effectiveCompensationPerActualHour)} per actual hour).`,
    "",
    comparison.summary,
    breakEven,
    "",
    "Verify salary or rate, overtime eligibility, bonus conditions, retirement vesting, health premiums, PTO rules, sign-on repayment terms, schedule, call, and travel requirements with the employer before deciding.",
    "Educational estimate only. Not financial, tax, legal, employment, insurance, or benefits advice.",
  ].join("\n");
};

const TotalCompensationComparison = () => {
  const [offerA, setOfferA] = useState(defaultOfferA);
  const [offerB, setOfferB] = useState(defaultOfferB);
  const [comparison, setComparison] = useState<ComparisonResult>(() => compareCompensation(defaultOfferA, defaultOfferB));
  const [copied, setCopied] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    trackSiteEvent("tool_opened", { event_category: "tools", tool_id: TOOL_ID });
  }, []);

  const updateOffer = (side: "a" | "b", patch: Partial<CompensationInput>) => {
    if (side === "a") setOfferA((current) => ({ ...current, ...patch }));
    else setOfferB((current) => ({ ...current, ...patch }));
  };

  const updateQuality = (side: "a" | "b", patch: Partial<QualityOfLifeInput>) => {
    if (side === "a") setOfferA((current) => ({ ...current, qualityOfLife: { ...current.qualityOfLife, ...patch } }));
    else setOfferB((current) => ({ ...current, qualityOfLife: { ...current.qualityOfLife, ...patch } }));
  };

  const compare = () => {
    setComparison(compareCompensation(offerA, offerB));
    trackSiteEvent("tool_comparison_completed", { event_category: "tools", tool_id: TOOL_ID, comparison_type: `${offerA.payType}_vs_${offerB.payType}` });
    window.setTimeout(() => resultHeadingRef.current?.focus(), 0);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(comparison, offerA, offerB));
      setCopied(true);
      trackSiteEvent("tool_result_copied", { event_category: "tools", tool_id: TOOL_ID });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const printSummary = () => {
    trackSiteEvent("tool_print_opened", { event_category: "tools", tool_id: TOOL_ID });
    window.print();
  };

  const breakEvenText = comparison.breakEven.requiredHourlyRate !== null
    ? `${currencyPrecise.format(comparison.breakEven.requiredHourlyRate)} per hour`
    : `${currency.format(comparison.breakEven.requiredAnnualSalary ?? 0)} annual salary`;

  return (
    <div className="min-w-0 space-y-10">
      <section aria-labelledby="comparison-inputs" className="space-y-6 print:hidden">
        <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 id="comparison-inputs" className="font-display text-xl font-bold text-foreground">Compare the whole offer, not just the headline salary</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your entries stay in this browser session. Raw salary, employer, benefit, commute, and schedule answers are not added to analytics or URLs.</p>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <OfferEditor prefix="a" offer={offerA} onChange={(patch) => updateOffer("a", patch)} onQualityChange={(patch) => updateQuality("a", patch)} />
          <OfferEditor prefix="b" offer={offerB} onChange={(patch) => updateOffer("b", patch)} onQualityChange={(patch) => updateQuality("b", patch)} />
        </div>

        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-card">
          <ArrowRightLeft className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="font-display text-2xl font-bold">Ready to compare?</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">The calculation separates cash pay, employer-funded benefits, selected costs, effective hourly value, and non-financial tradeoffs. It does not automatically declare one role better.</p>
          <Button type="button" variant="hero" size="lg" onClick={compare}>Compare total compensation</Button>
        </div>
      </section>

      <section aria-labelledby="comparison-results" className="space-y-8 rounded-3xl border border-border bg-card p-5 shadow-card md:p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Comparison result</div>
            <h2 id="comparison-results" ref={resultHeadingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold outline-none md:text-3xl">{comparison.summary}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Generated {new Date().toLocaleDateString()}. Re-run the comparison after changing inputs.</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="outline" onClick={copySummary}><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy summary"}</Button>
            <Button type="button" variant="outline" onClick={printSummary}><Printer className="h-4 w-4" /> Print or save PDF</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          {[
            { label: offerA.name || "Role A", value: comparison.offerA.totalAfterSelectedCosts, detail: `${currencyPrecise.format(comparison.offerA.effectiveCompensationPerActualHour)} per actual hour` },
            { label: offerB.name || "Role B", value: comparison.offerB.totalAfterSelectedCosts, detail: `${currencyPrecise.format(comparison.offerB.effectiveCompensationPerActualHour)} per actual hour` },
            { label: "Annual difference (B − A)", value: comparison.annualDifference, detail: `${currency.format(comparison.monthlyDifference)} per month` },
            { label: "Break-even base pay", value: comparison.breakEven.requiredBaseAnnualCash, detail: breakEvenText },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">{item.label}</div>
              <div className="mt-2 font-display text-2xl font-bold tabular-nums text-foreground">{currency.format(item.value)}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold">Compensation breakdown</h3>
          <ResultTable comparison={comparison} offerA={offerA} offerB={offerB} />
          <p className="text-xs leading-relaxed text-muted-foreground">PTO is displayed for both roles. It is added to estimated economic value for hourly roles and not added again for salaried roles because annual salary normally already includes paid leave.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Per month after selected costs", comparison.offerA.perMonthAfterCosts, comparison.offerB.perMonthAfterCosts],
            ["Per paycheck after selected costs", comparison.offerA.perPaycheckAfterCosts, comparison.offerB.perPaycheckAfterCosts],
            ["Per scheduled workday", comparison.offerA.perScheduledWorkdayAfterCosts, comparison.offerB.perScheduledWorkdayAfterCosts],
          ].map(([label, a, b]) => (
            <div key={String(label)} className="rounded-2xl border border-border bg-muted/25 p-4">
              <h3 className="text-sm font-bold text-foreground">{label}</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between gap-4"><span>{offerA.name}</span><strong className="text-foreground">{currency.format(Number(a))}</strong></div>
                <div className="flex justify-between gap-4"><span>{offerB.name}</span><strong className="text-foreground">{currency.format(Number(b))}</strong></div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-secondary/30 bg-secondary-soft/30 p-5">
          <div className="flex items-start gap-3">
            <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
            <div>
              <h3 className="font-display text-lg font-bold">Break-even estimate</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">{comparison.breakEven.lowerOfferName}</strong> would need approximately <strong className="text-foreground">{breakEvenText}</strong> in base pay to match <strong className="text-foreground">{comparison.breakEven.targetOfferName}</strong>, assuming all other entered overtime, differentials, benefits, premiums, and work costs remain unchanged.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold">Quality-of-life factors — not scored</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">These factors are intentionally shown side by side rather than converted into an arbitrary score. Decide which tradeoffs matter most to your health, family, and career.</p>
          <QualityTable offerA={offerA} offerB={offerB} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><CheckCircle2 className="h-5 w-5 text-primary" /> Questions to verify with HR or the recruiter</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• Is the role exempt or non-exempt, and how is overtime calculated?</li>
              <li>• Which differentials, bonuses, and callback payments are guaranteed versus discretionary?</li>
              <li>• What compensation is eligible for the retirement match, and when does it vest?</li>
              <li>• What are the employee premiums for the exact coverage tier you need?</li>
              <li>• Are PTO, holidays, education benefits, and sign-on bonuses subject to waiting periods or repayment terms?</li>
              <li>• What schedule, weekend, holiday, travel, and on-call requirements are written into the role?</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-300/60 bg-amber-50/60 p-5 dark:bg-amber-950/10">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><AlertTriangle className="h-5 w-5 text-amber-700" /> Important limitations</h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• This is a pretax economic comparison, not a take-home-pay estimate.</li>
              <li>• Benefits are only as accurate as the values entered and may have eligibility or vesting conditions.</li>
              <li>• Pension value, equity compensation, taxes, licensing costs, and employer-specific rules may require separate analysis.</li>
              <li>• The tool does not decide whether a role is legally exempt from overtime or whether a bonus repayment term is enforceable.</li>
            </ul>
          </div>
        </div>

        <p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Educational estimate only:</strong> This calculator is not financial, tax, legal, employment, insurance, benefits, or medical advice. Employer documents and written offer terms control. Verify important details with HR, the recruiter, payroll, plan documents, and qualified professionals.</p>
      </section>
    </div>
  );
};

export default TotalCompensationComparison;
