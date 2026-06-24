import { useState } from "react";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

type FilingStatus = "single" | "married" | "head";
type AccountType = "403b" | "401k" | "457b" | "ira" | "unsure";
type MatchMode = "percent" | "dollars";
type MatchTreatment = "traditional" | "roth";
type ResultEmphasis = "primary" | "accent" | "muted";

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const formatSignedUSD = (value: number) => {
  const absValue = formatUSD(Math.abs(value));
  if (!Number.isFinite(value) || Math.abs(value) < 1) return "$0";
  return value > 0 ? `+${absValue}` : `-${absValue}`;
};

const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format((Number.isFinite(value) ? value : 0) / 100);

const num = (value: string, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const nonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
const percent = (value: number) => Math.min(nonNegative(value), 100);

const futureValueAnnual = (annualContribution: number, yearsUntilRetirement: number, annualReturnPct: number) => {
  const contribution = nonNegative(annualContribution);
  const years = Math.floor(nonNegative(yearsUntilRetirement));
  const annualReturn = percent(annualReturnPct) / 100;

  if (years === 0 || contribution === 0) return 0;
  if (annualReturn === 0) return contribution * years;

  return contribution * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
};

const accountTypeLabels: Record<AccountType, string> = {
  "403b": "403(b)",
  "401k": "401(k)",
  "457b": "457(b)",
  ira: "IRA",
  unsure: "unsure",
};

const filingStatusLabels: Record<FilingStatus, string> = {
  single: "single",
  married: "married filing jointly",
  head: "head of household",
};

const Select = ({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    {children}
  </select>
);

const RothTraditionalDecisionCalculator = () => {
  const [annualGrossIncome, setAnnualGrossIncome] = useState("82000");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [currentFederalTaxRate, setCurrentFederalTaxRate] = useState("22");
  const [currentStateTaxRate, setCurrentStateTaxRate] = useState("4");
  const [retirementFederalTaxRate, setRetirementFederalTaxRate] = useState("12");
  const [retirementStateTaxRate, setRetirementStateTaxRate] = useState("3");
  const [annualContribution, setAnnualContribution] = useState("6500");
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState("25");
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState("6");
  const [accountType, setAccountType] = useState<AccountType>("403b");
  const [matchMode, setMatchMode] = useState<MatchMode>("percent");
  const [matchValue, setMatchValue] = useState("4");
  const [matchTreatment, setMatchTreatment] = useState<MatchTreatment>("traditional");

  const income = nonNegative(num(annualGrossIncome));
  const contribution = Math.min(nonNegative(num(annualContribution)), income);
  const currentCombinedTaxRate = Math.min(percent(num(currentFederalTaxRate)) + percent(num(currentStateTaxRate)), 100);
  const retirementCombinedTaxRate = Math.min(percent(num(retirementFederalTaxRate)) + percent(num(retirementStateTaxRate)), 100);
  const years = Math.floor(nonNegative(num(yearsUntilRetirement)));
  const annualReturn = percent(num(expectedAnnualReturn));
  const matchEstimate = matchMode === "percent"
    ? income * (percent(num(matchValue)) / 100)
    : nonNegative(num(matchValue));

  const traditionalCurrentYearTaxSavings = contribution * (currentCombinedTaxRate / 100);
  const rothCurrentYearTaxCost = traditionalCurrentYearTaxSavings;
  const futureValue = futureValueAnnual(contribution, years, annualReturn);
  const traditionalFutureTaxDrag = futureValue * (retirementCombinedTaxRate / 100);
  const traditionalAfterTaxValue = Math.max(futureValue - traditionalFutureTaxDrag, 0);
  const rothQualifiedValue = futureValue;
  const rothMinusTraditional = rothQualifiedValue - traditionalAfterTaxValue;
  const matchFutureValue = futureValueAnnual(matchEstimate, years, annualReturn);
  const matchFutureTaxDrag = matchTreatment === "traditional" ? matchFutureValue * (retirementCombinedTaxRate / 100) : 0;
  const matchAfterTaxValue = Math.max(matchFutureValue - matchFutureTaxDrag, 0);
  const taxRateSpread = retirementCombinedTaxRate - currentCombinedTaxRate;

  const signal = Math.abs(taxRateSpread) <= 3
    ? "Too close to call"
    : taxRateSpread > 0
      ? "Lean Roth"
      : "Lean Traditional";
  const signalEmphasis: ResultEmphasis = signal === "Lean Roth" ? "primary" : signal === "Lean Traditional" ? "accent" : "muted";

  const interpretation = signal === "Lean Traditional"
    ? "Traditional may look better when your current tax rate is higher than your expected retirement tax rate. The current tax break can matter, especially during high-overtime or high-income years."
    : signal === "Lean Roth"
      ? "Roth may look better when your current tax rate is lower than your expected future tax rate, or when tax-free flexibility is valuable."
      : "If the result is close, savings rate, employer match, fees, diversification, plan rules, and consistency may matter more than trying to perfectly predict future taxes.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Annual gross income" prefix="$" value={annualGrossIncome} onChange={setAnnualGrossIncome} helper="Before taxes, insurance, retirement contributions, and other payroll deductions." />
            <CalculatorSelectField label="Filing status" helper="Used as context only; this tool uses your entered marginal tax-rate estimates.">
              <Select value={filingStatus} onChange={(value) => setFilingStatus(value as FilingStatus)}>
                <option value="single">Single</option>
                <option value="married">Married filing jointly</option>
                <option value="head">Head of household</option>
              </Select>
            </CalculatorSelectField>
            <CalculatorInput label="Current federal marginal tax rate estimate" suffix="%" value={currentFederalTaxRate} onChange={setCurrentFederalTaxRate} helper="Use your best estimate for the next dollar of income, not your average tax rate." />
            <CalculatorInput label="Current state income tax rate estimate" suffix="%" value={currentStateTaxRate} onChange={setCurrentStateTaxRate} helper="Use 0 if your state has no income tax or you want to ignore state tax." />
            <CalculatorInput label="Expected retirement federal tax rate estimate" suffix="%" value={retirementFederalTaxRate} onChange={setRetirementFederalTaxRate} helper="This is an assumption. Future tax laws and income can change." />
            <CalculatorInput label="Expected retirement state tax rate estimate" suffix="%" value={retirementStateTaxRate} onChange={setRetirementStateTaxRate} helper="Use 0 if you expect no state income tax in retirement." />
            <CalculatorInput label="Annual contribution amount" prefix="$" value={annualContribution} onChange={setAnnualContribution} helper="Employee contribution amount to compare as Traditional or Roth." />
            <CalculatorInput label="Years until retirement" value={yearsUntilRetirement} onChange={setYearsUntilRetirement} helper="Whole years are used in the estimate." />
            <CalculatorInput label="Expected annual return before taxes" suffix="%" value={expectedAnnualReturn} onChange={setExpectedAnnualReturn} helper="Investment returns are not guaranteed." />
            <CalculatorSelectField label="Account type" helper="Plan rules vary by employer and account type.">
              <Select value={accountType} onChange={(value) => setAccountType(value as AccountType)}>
                <option value="403b">403(b)</option>
                <option value="401k">401(k)</option>
                <option value="457b">457(b)</option>
                <option value="ira">IRA</option>
                <option value="unsure">Unsure</option>
              </Select>
            </CalculatorSelectField>
            <CalculatorSelectField label="Employer match input" helper="Enter an annual dollar estimate or a simple percent of gross income.">
              <Select value={matchMode} onChange={(value) => setMatchMode(value as MatchMode)}>
                <option value="percent">Match percentage</option>
                <option value="dollars">Annual dollar estimate</option>
              </Select>
            </CalculatorSelectField>
            <CalculatorInput label={matchMode === "percent" ? "Employer match percentage" : "Employer match estimate"} prefix={matchMode === "dollars" ? "$" : undefined} suffix={matchMode === "percent" ? "%" : undefined} value={matchValue} onChange={setMatchValue} helper="Simplified estimate. Vesting, caps, and formulas vary by plan." />
            <CalculatorSelectField label="Employer match tax treatment" helper="Many employer contributions are pre-tax/traditional, but plan rules can differ.">
              <Select value={matchTreatment} onChange={(value) => setMatchTreatment(value as MatchTreatment)}>
                <option value="traditional">Treat match as traditional/pre-tax</option>
                <option value="roth">Treat match as Roth/after-tax</option>
              </Select>
            </CalculatorSelectField>
          </div>

          <div className="rounded-2xl border border-secondary/35 bg-secondary-soft p-5 text-sm leading-relaxed">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Employer match note</div>
            <p className="text-muted-foreground">
              Employer contributions are often treated as pre-tax/traditional even if you choose Roth employee contributions. Verify your own {accountTypeLabels[accountType]} plan documents, payroll election page, and vesting rules.
            </p>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <CalculatorResult label="Decision signal" value={signal} emphasis={signalEmphasis} helper={`Current combined estimate: ${formatPercent(currentCombinedTaxRate)}. Retirement combined estimate: ${formatPercent(retirementCombinedTaxRate)}.`} />
          <CalculatorResult label="Estimated current tax savings from Traditional" value={formatUSD(traditionalCurrentYearTaxSavings)} emphasis="primary" helper="Contribution multiplied by current combined marginal tax-rate assumption." />
          <CalculatorResult label="Estimated after-tax cost of Roth today" value={formatUSD(rothCurrentYearTaxCost)} helper="Compared with making the same contribution pre-tax." />
          <CalculatorResult label="Estimated future account value before retirement taxes" value={formatUSD(futureValue)} helper="Employee contribution stream only; before withdrawal taxes." />
          <CalculatorResult label="Estimated Traditional after-tax retirement value" value={formatUSD(traditionalAfterTaxValue)} emphasis={signal === "Lean Traditional" ? "accent" : "muted"} helper="Future value minus estimated future tax drag." />
          <CalculatorResult label="Estimated Roth retirement value under qualified-withdrawal assumption" value={formatUSD(rothQualifiedValue)} emphasis={signal === "Lean Roth" ? "accent" : "muted"} helper="Qualified Roth withdrawals may be tax-free if IRS rules are met." />
          <CalculatorResult label="Roth minus after-tax Traditional estimate" value={formatSignedUSD(rothMinusTraditional)} helper="This does not model investing the Traditional tax savings." />
          <CalculatorMeaning>{interpretation}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Model limits</div>
          <h3 className="font-display text-lg font-bold">Educational, not exact.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This is not a perfect lifetime tax model. Tax laws, IRS limits, plan rules, state taxes, withdrawal rules, and personal circumstances can change.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Match estimate</div>
          <h3 className="font-display text-lg font-bold">Estimated after-tax match value: {formatUSD(matchAfterTaxValue)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This separate estimate uses an annual match of {formatUSD(matchEstimate)} and the selected match tax treatment.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Source notes</div>
          <h3 className="font-display text-lg font-bold">Verify current IRS and plan rules.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sources: IRS retirement plan guidance and IRS designated Roth account FAQs. The example assumes {filingStatusLabels[filingStatus]} filing status only as context.</p>
        </div>
      </div>
    </div>
  );
};

export default RothTraditionalDecisionCalculator;
