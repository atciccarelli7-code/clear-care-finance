import { useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorFormula } from "@/components/shared/CalculatorFormula";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const HsaFsaDecisionHelper = () => {
  const [eligible, setEligible] = useState(true);
  const [expenses, setExpenses] = useState("1800");
  const [hsaContribution, setHsaContribution] = useState("2000");
  const [fsaContribution, setFsaContribution] = useState("1500");
  const [employerHsa, setEmployerHsa] = useState("750");
  const [premiumSavings, setPremiumSavings] = useState("1200");
  const [extraDeductibleRisk, setExtraDeductibleRisk] = useState("2500");
  const [taxRate, setTaxRate] = useState("25");
  const [fsaCarryover, setFsaCarryover] = useState("680");
  const [cashCushion, setCashCushion] = useState("5000");

  const tax = num(taxRate) / 100;
  const hsaTaxSavings = eligible ? num(hsaContribution) * tax : 0;
  const hsaValue = eligible ? num(employerHsa) + num(premiumSavings) + hsaTaxSavings : 0;
  const uncoveredDeductibleRisk = eligible ? Math.max(num(extraDeductibleRisk) - num(cashCushion), 0) : 0;
  const riskAdjustedHsaValue = hsaValue - uncoveredDeductibleRisk;
  const fsaTaxSavings = num(fsaContribution) * tax;
  const possibleFsaForfeit = Math.max(num(fsaContribution) - num(expenses) - num(fsaCarryover), 0);
  const fsaNetValue = fsaTaxSavings - possibleFsaForfeit;

  const verdict = !eligible
    ? "FSA is the usable option based on what you entered."
    : riskAdjustedHsaValue > fsaNetValue + 500 && num(cashCushion) >= num(extraDeductibleRisk) * 0.75
      ? "The HSA path looks stronger on these assumptions."
      : fsaNetValue > riskAdjustedHsaValue + 250 || num(cashCushion) < num(extraDeductibleRisk) * 0.5
        ? "The FSA or lower-risk plan may be safer."
        : "The math is close. Compare plan documents carefully.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">HSA-eligible HDHP?</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-1">
                <button type="button" onClick={() => setEligible(true)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${eligible ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Yes</button>
                <button type="button" onClick={() => setEligible(false)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${!eligible ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>No</button>
              </div>
              <p className="text-xs text-muted-foreground">HSA contributions generally require HSA-eligible HDHP coverage.</p>
            </div>
            <CalculatorInput label="Predictable eligible expenses" prefix="$" value={expenses} onChange={setExpenses} helper="Expenses you can reasonably predict this year." />
            <CalculatorInput label="Your HSA contribution" prefix="$" value={hsaContribution} onChange={setHsaContribution} helper="Annual amount you would add to the HSA." />
            <CalculatorInput label="Your FSA contribution" prefix="$" value={fsaContribution} onChange={setFsaContribution} helper="Annual amount you would elect for the FSA." />
            <CalculatorInput label="Employer HSA money" prefix="$" value={employerHsa} onChange={setEmployerHsa} helper="Annual employer contribution." />
            <CalculatorInput label="HDHP premium savings" prefix="$" value={premiumSavings} onChange={setPremiumSavings} helper="Annual premium savings versus another plan." />
            <CalculatorInput label="Extra deductible risk" prefix="$" value={extraDeductibleRisk} onChange={setExtraDeductibleRisk} helper="Added deductible exposure versus the safer plan." />
            <CalculatorInput label="Cash cushion" prefix="$" value={cashCushion} onChange={setCashCushion} helper="Cash available for a higher-cost medical year." />
            <CalculatorInput label="Estimated tax rate" suffix="%" value={taxRate} onChange={setTaxRate} helper="Combined federal, state, and payroll estimate." />
            <CalculatorInput label="FSA carryover allowed" prefix="$" value={fsaCarryover} onChange={setFsaCarryover} helper="Use $0 if no carryover is allowed." />
          </div>
          <CalculatorFormula
            items={[
              "HSA tax savings = your HSA contribution x estimated tax rate, if HSA-eligible",
              "HSA value before risk = employer HSA money + premium savings + HSA tax savings",
              "Uncovered deductible risk = extra deductible risk - cash cushion, floored at $0",
              "FSA net value = FSA tax savings - possible forfeiture",
            ]}
            note="HSA and FSA eligibility, contribution limits, carryover, and grace-period rules can change. Confirm the current plan-year rules before choosing."
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <CalculatorResult label="HSA tax savings" value={formatUSD(hsaTaxSavings)} />
          <CalculatorResult label="HSA value before risk" value={formatUSD(hsaValue)} emphasis="primary" />
          <CalculatorResult label="Uncovered deductible risk" value={formatUSD(uncoveredDeductibleRisk)} />
          <CalculatorResult label="Risk-adjusted HSA value" value={formatUSD(riskAdjustedHsaValue)} emphasis="accent" />
          <CalculatorResult label="FSA tax savings" value={formatUSD(fsaTaxSavings)} />
          <CalculatorResult label="Possible FSA forfeiture" value={formatUSD(possibleFsaForfeit)} />
          <CalculatorResult label="Estimated FSA net value" value={formatUSD(fsaNetValue)} emphasis="primary" />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Provider comparison</div>
        <h3 className="font-display text-xl font-bold mb-2">HSA providers are easier to shop than FSA providers.</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For HSAs, compare fees, investment options, cash yield, debit-card access, transfers, and employer payroll integration. Fidelity and Lively are common individual HSA options. HealthEquity and Optum are common employer benefit platforms. For FSAs, the employer usually chooses the administrator, so compare plan rules: carryover, grace period, claims workflow, receipt requirements, debit card, app quality, and runout deadline.
        </p>
      </div>
    </div>
  );
};

export default HsaFsaDecisionHelper;
