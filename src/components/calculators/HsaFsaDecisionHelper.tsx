import { useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
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

  const tax = Math.min(num(taxRate), 100) / 100;
  const predictableExpenses = num(expenses);
  const hsaTaxSavings = eligible ? num(hsaContribution) * tax : 0;
  const hsaGrossValue = eligible ? num(employerHsa) + num(premiumSavings) + hsaTaxSavings : 0;
  const uncoveredDeductibleRisk = eligible ? Math.max(num(extraDeductibleRisk) - num(cashCushion), 0) : 0;
  const riskAdjustedHsaValue = hsaGrossValue - uncoveredDeductibleRisk;
  const fsaTaxSavings = num(fsaContribution) * tax;
  const fsaProtectedByUseOrCarryover = predictableExpenses + num(fsaCarryover);
  const possibleFsaForfeit = Math.max(num(fsaContribution) - fsaProtectedByUseOrCarryover, 0);
  const fsaNetValue = fsaTaxSavings - possibleFsaForfeit;
  const cashCushionAfterRisk = Math.max(num(cashCushion) - num(extraDeductibleRisk), 0);

  const verdict = !eligible
    ? "HSA contributions usually require HSA-eligible HDHP coverage, so the FSA path is the usable tax-account option based on what you entered."
    : riskAdjustedHsaValue > fsaNetValue + 500 && num(cashCushion) >= num(extraDeductibleRisk) * 0.75
      ? "The HSA path looks stronger on these assumptions, mainly because of employer money, premium savings, tax savings, and enough cash cushion."
      : fsaNetValue > riskAdjustedHsaValue + 250 || num(cashCushion) < num(extraDeductibleRisk) * 0.5
        ? "The FSA or lower-risk plan may be safer if the HDHP creates too much cash-flow risk."
        : "The math is close. Compare plan documents, medication costs, provider network, and your cash cushion before choosing.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
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
            <CalculatorInput label="FSA carryover or grace room" prefix="$" value={fsaCarryover} onChange={setFsaCarryover} helper="Use $0 if no carryover or grace-period protection is available." />
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">How this is calculated</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>HSA value = employer HSA money + HDHP premium savings + estimated tax savings.</li>
              <li>Risk-adjusted HSA value subtracts deductible exposure not covered by your cash cushion.</li>
              <li>FSA net value = estimated tax savings - possible forfeited dollars.</li>
              <li>FSA forfeiture risk falls when predictable expenses and carryover/grace-period protection are high.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <CalculatorResult label="HSA tax savings" value={formatUSD(hsaTaxSavings)} />
          <CalculatorResult label="HSA value before risk" value={formatUSD(hsaGrossValue)} emphasis="primary" />
          <CalculatorResult label="Uncovered deductible risk" value={formatUSD(uncoveredDeductibleRisk)} />
          <CalculatorResult label="Risk-adjusted HSA value" value={formatUSD(riskAdjustedHsaValue)} emphasis="accent" />
          <CalculatorResult label="FSA tax savings" value={formatUSD(fsaTaxSavings)} />
          <CalculatorResult label="Possible FSA forfeiture" value={formatUSD(possibleFsaForfeit)} />
          <CalculatorResult label="Estimated FSA net value" value={formatUSD(fsaNetValue)} emphasis="primary" />
          <CalculatorResult label="Cash left after deductible shock" value={formatUSD(cashCushionAfterRisk)} helper="Cash cushion minus extra deductible risk." />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">What to verify</div>
        <h3 className="mb-2 font-display text-xl font-bold">The account type is only one part of the decision.</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For HSAs, compare fees, cash yield, investment access, debit-card access, transfer rules, and employer payroll integration. For FSAs, compare carryover, grace period, runout deadline, receipt rules, claims workflow, debit-card limits, and whether predictable expenses justify the election.
        </p>
      </div>
    </div>
  );
};

export default HsaFsaDecisionHelper;
