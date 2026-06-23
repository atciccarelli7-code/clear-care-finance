import { useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

type CompareMode = "sameContribution" | "samePaycheckCost";
type TaxSavingsBehavior = "invested" | "spent";
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

const num = (value: string, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const futureValueMonthly = (monthlyContribution: number, years: number, annualReturnPct: number) => {
  const months = Math.max(0, Math.round(years * 12));
  const monthly = Math.max(0, monthlyContribution);
  if (months === 0 || monthly === 0) return 0;

  const monthlyRate = annualReturnPct / 100 / 12;
  if (Math.abs(monthlyRate) < 0.000001) return monthly * months;

  return monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
};

const ToggleButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-smooth ${
      active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

const RothTraditionalDecisionCalculator = () => {
  const [monthlyAmount, setMonthlyAmount] = useState("500");
  const [compareMode, setCompareMode] = useState<CompareMode>("sameContribution");
  const [currentTaxRate, setCurrentTaxRate] = useState("22");
  const [retirementTaxRate, setRetirementTaxRate] = useState("15");
  const [yearsInvested, setYearsInvested] = useState("30");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [taxSavingsBehavior, setTaxSavingsBehavior] = useState<TaxSavingsBehavior>("invested");

  const monthlyInput = Math.max(0, num(monthlyAmount));
  const currentTax = clamp(num(currentTaxRate) / 100, 0, 0.6);
  const retirementTax = clamp(num(retirementTaxRate) / 100, 0, 0.6);
  const years = Math.max(0, num(yearsInvested));
  const annualReturn = clamp(num(expectedReturn), -20, 20);

  const sameContributionMode = compareMode === "sameContribution";
  const rothMonthlyContribution = monthlyInput;
  const traditionalMonthlyContribution = sameContributionMode
    ? monthlyInput
    : currentTax >= 0.6
      ? monthlyInput / 0.4
      : monthlyInput / (1 - currentTax);

  const traditionalMonthlyTaxSavings = traditionalMonthlyContribution * currentTax;
  const rothMonthlyPaycheckCost = rothMonthlyContribution;
  const traditionalMonthlyPaycheckCost = Math.max(0, traditionalMonthlyContribution - traditionalMonthlyTaxSavings);
  const investedTaxSavingsMonthly =
    sameContributionMode && taxSavingsBehavior === "invested" ? traditionalMonthlyTaxSavings : 0;

  const rothFutureValue = futureValueMonthly(rothMonthlyContribution, years, annualReturn);
  const traditionalFutureValueBeforeTax = futureValueMonthly(traditionalMonthlyContribution, years, annualReturn);
  const traditionalFutureValueAfterTax = traditionalFutureValueBeforeTax * (1 - retirementTax);
  const sideAccountFutureValue = futureValueMonthly(investedTaxSavingsMonthly, years, annualReturn);
  const traditionalComparableValue = traditionalFutureValueAfterTax + sideAccountFutureValue;
  const difference = rothFutureValue - traditionalComparableValue;
  const differencePct = Math.abs(difference) / Math.max(rothFutureValue, traditionalComparableValue, 1);

  const verdict =
    differencePct < 0.03
      ? "Too close to call"
      : difference > 0
        ? "Lean Roth"
        : "Lean Traditional";

  const verdictEmphasis: ResultEmphasis = verdict === "Lean Roth" ? "primary" : verdict === "Lean Traditional" ? "accent" : "muted";

  const verdictExplanation =
    verdict === "Lean Roth"
      ? "Roth is favored on these assumptions because paying tax now appears cheaper than the estimated future tax cost of traditional withdrawals."
      : verdict === "Lean Traditional"
        ? "Traditional is favored on these assumptions because the current tax break and after-tax projection appear stronger than paying tax now."
        : "The projected difference is small. A split strategy may be reasonable because future tax rates, income, and retirement rules are uncertain.";

  const taxRateSignal =
    currentTax + 0.03 < retirementTax
      ? "Your future tax estimate is higher than today, which generally pushes the math toward Roth."
      : currentTax > retirementTax + 0.03
        ? "Your current tax estimate is higher than retirement, which generally pushes the math toward traditional."
        : "Your current and future tax estimates are close, so contribution rate and flexibility may matter more than a perfect tax-bucket answer.";

  const monthlyCashFlowGap = rothMonthlyPaycheckCost - traditionalMonthlyPaycheckCost;
  const cashFlowWarning =
    sameContributionMode && monthlyCashFlowGap > 25
      ? `For the same contribution amount, Roth costs about ${formatUSD(monthlyCashFlowGap)} more per month from take-home pay because it does not create the current tax break.`
      : "The paycheck-cost gap is small under the assumptions entered.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput
              label={sameContributionMode ? "Monthly contribution" : "Monthly paycheck cost"}
              prefix="$"
              value={monthlyAmount}
              onChange={setMonthlyAmount}
              helper={
                sameContributionMode
                  ? "Compare equal monthly contribution amounts."
                  : "Compare equal after-tax paycheck cost."
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Comparison mode</label>
              <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-background p-1 sm:grid-cols-2">
                <ToggleButton active={sameContributionMode} onClick={() => setCompareMode("sameContribution")}>
                  Same contribution
                </ToggleButton>
                <ToggleButton active={!sameContributionMode} onClick={() => setCompareMode("samePaycheckCost")}>
                  Same paycheck cost
                </ToggleButton>
              </div>
              <p className="text-xs text-muted-foreground">
                Same paycheck cost is usually the cleaner comparison because traditional contributions create current tax savings.
              </p>
            </div>

            <CalculatorInput
              label="Current marginal tax estimate"
              suffix="%"
              value={currentTaxRate}
              onChange={setCurrentTaxRate}
              helper="Use a rough combined federal + state marginal rate."
            />
            <CalculatorInput
              label="Estimated retirement tax rate"
              suffix="%"
              value={retirementTaxRate}
              onChange={setRetirementTaxRate}
              helper="Estimate the tax rate that may apply to future traditional withdrawals."
            />
            <CalculatorInput
              label="Years invested"
              value={yearsInvested}
              onChange={setYearsInvested}
              helper="Years until the money is used."
            />
            <CalculatorInput
              label="Expected annual return"
              suffix="%"
              value={expectedReturn}
              onChange={setExpectedReturn}
              helper="Long-term annual return assumption before fees and taxes."
            />

            {sameContributionMode && (
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-foreground">Traditional tax savings</label>
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-background p-1 sm:grid-cols-2">
                  <ToggleButton active={taxSavingsBehavior === "invested"} onClick={() => setTaxSavingsBehavior("invested")}>
                    Save or invest tax savings
                  </ToggleButton>
                  <ToggleButton active={taxSavingsBehavior === "spent"} onClick={() => setTaxSavingsBehavior("spent")}>
                    Spend tax savings
                  </ToggleButton>
                </div>
                <p className="text-xs text-muted-foreground">
                  Traditional looks stronger when the current tax savings are saved or invested instead of disappearing into spending.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">How this is calculated</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>Roth projection = after-tax contribution grown for the selected years.</li>
              <li>Traditional projection = pre-tax contribution grown, then reduced by the estimated retirement tax rate.</li>
              <li>Same contribution mode compares the same payroll contribution amount.</li>
              <li>Same paycheck-cost mode increases the traditional contribution so both choices feel similar in take-home pay.</li>
              <li>When selected, invested tax savings are projected as a separate side-account estimate.</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <CalculatorResult label="Decision signal" value={verdict} emphasis={verdictEmphasis} helper={taxRateSignal} />
          <CalculatorResult
            label="Roth future spendable estimate"
            value={formatUSD(rothFutureValue)}
            emphasis="primary"
            helper="Assumes qualified Roth withdrawals are tax-free."
          />
          <CalculatorResult
            label="Traditional comparable estimate"
            value={formatUSD(traditionalComparableValue)}
            emphasis="accent"
            helper="After estimated retirement tax, plus any invested tax-savings side account."
          />
          <CalculatorResult
            label="Projected difference"
            value={formatSignedUSD(difference)}
            helper="Positive favors Roth. Negative favors traditional. Small differences are treated as too close to call."
          />
          <CalculatorResult
            label="Roth monthly paycheck cost"
            value={formatUSD(rothMonthlyPaycheckCost)}
            helper="Roth contribution is after-tax for this simplified comparison."
          />
          <CalculatorResult
            label="Traditional monthly paycheck cost"
            value={formatUSD(traditionalMonthlyPaycheckCost)}
            helper={`Estimated current tax savings: ${formatUSD(traditionalMonthlyTaxSavings)} per month.`}
          />
          <CalculatorMeaning>
            {verdictExplanation} {cashFlowWarning}
          </CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Best use</div>
          <h3 className="font-display text-lg font-bold">Use this as a decision aid, not a prediction.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The calculator is most useful for comparing tax assumptions. It cannot know future tax law, investment returns, retirement income, or your exact withdrawal plan.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Healthcare worker note</div>
          <h3 className="font-display text-lg font-bold">Overtime years can change the answer.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Heavy overtime, charge pay, shift differentials, bonuses, and second jobs can make traditional contributions more attractive during higher-tax years.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">Practical rule</div>
          <h3 className="font-display text-lg font-bold">Too close usually means split.</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            If the output is close, splitting contributions between Roth and traditional can build tax flexibility without pretending you know the future perfectly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RothTraditionalDecisionCalculator;
