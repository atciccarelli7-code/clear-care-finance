import { useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorFormula } from "@/components/shared/CalculatorFormula";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(Number.isFinite(value) ? value : 0);

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

export const BackupCareCostPlanner = () => {
  const [riskShifts, setRiskShifts] = useState("6");
  const [backupRate, setBackupRate] = useState("25");
  const [backupCost, setBackupCost] = useState("85");
  const [emergencyMultiplier, setEmergencyMultiplier] = useState("1.5");
  const [extraShiftGross, setExtraShiftGross] = useState("540");
  const [estimatedTaxRate, setEstimatedTaxRate] = useState("28");
  const [extraFoodTransport, setExtraFoodTransport] = useState("35");

  const expectedEvents = num(riskShifts) * (num(backupRate) / 100);
  const normalMonthlyCost = expectedEvents * num(backupCost);
  const emergencyMonthlyCost = expectedEvents * num(backupCost) * num(emergencyMultiplier);
  const annualNormalCost = normalMonthlyCost * 12;
  const cushionTarget = Math.max(num(backupCost) * num(emergencyMultiplier) + num(extraFoodTransport), emergencyMonthlyCost * 2);
  const afterTaxShiftPay = num(extraShiftGross) * (1 - num(estimatedTaxRate) / 100);
  const netPickupValue = afterTaxShiftPay - num(backupCost) - num(extraFoodTransport);

  const verdict =
    netPickupValue > afterTaxShiftPay * 0.65
      ? "The pickup shift still looks strong after backup-care costs."
      : netPickupValue > 0
        ? "The pickup shift may still help, but the hidden care costs matter."
        : "The backup-care costs may wipe out the pickup shift value on these inputs.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="min-w-0 space-y-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Risky shifts per month" value={riskShifts} onChange={setRiskShifts} helper="Shifts likely to run late, change, or need backup." />
            <CalculatorInput label="Shifts needing backup" suffix="%" value={backupRate} onChange={setBackupRate} helper="Your rough share of risky shifts that turn into a backup need." />
            <CalculatorInput label="Typical backup cost" prefix="$" value={backupCost} onChange={setBackupCost} helper="Late pickup, sitter, pet care, ride, meal, or similar." />
            <CalculatorInput label="Emergency cost multiplier" value={emergencyMultiplier} onChange={setEmergencyMultiplier} step="0.1" helper="Use more than 1 when last-minute care costs extra." />
            <CalculatorInput label="Extra shift gross pay" prefix="$" value={extraShiftGross} onChange={setExtraShiftGross} helper="Gross pay for one optional pickup shift." />
            <CalculatorInput label="Estimated tax rate" suffix="%" value={estimatedTaxRate} onChange={setEstimatedTaxRate} helper="Federal, payroll, state, and local estimate." />
            <CalculatorInput label="Extra food or transport" prefix="$" value={extraFoodTransport} onChange={setExtraFoodTransport} helper="Hidden costs created by the longer day." />
          </div>
          <CalculatorFormula
            items={[
              "Expected backup events = risky shifts x backup percentage",
              "Normal monthly backup cost = expected events x typical backup cost",
              "Emergency monthly backup cost = normal monthly cost x emergency multiplier",
              "Pickup shift value = after-tax shift pay - backup cost - extra food or transport",
            ]}
            note="This is planning math for a household cushion, not a recommendation to take or skip a shift."
          />
        </div>
        <div className="min-w-0 space-y-3 lg:col-span-2">
          <CalculatorResult label="Expected backup events" value={`${formatNumber(expectedEvents)} / month`} />
          <CalculatorResult label="Normal monthly backup cost" value={formatUSD(normalMonthlyCost)} emphasis="primary" />
          <CalculatorResult label="Emergency monthly estimate" value={formatUSD(emergencyMonthlyCost)} emphasis="accent" />
          <CalculatorResult label="Annual normal-cost estimate" value={formatUSD(annualNormalCost)} />
          <CalculatorResult label="Starter cushion target" value={formatUSD(cushionTarget)} emphasis="primary" />
          <CalculatorResult label="Net pickup-shift value" value={formatUSD(netPickupValue)} emphasis="accent" />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};

export const HealthcareDiscountValueChecker = () => {
  const [regularPrice, setRegularPrice] = useState("180");
  const [discountPercent, setDiscountPercent] = useState("15");
  const [extraFees, setExtraFees] = useState("12");
  const [verificationTime, setVerificationTime] = useState("20");
  const [timeValue, setTimeValue] = useState("25");
  const [plannedBudget, setPlannedBudget] = useState("180");
  const [alternativesPrice, setAlternativesPrice] = useState("165");

  const discountSavings = num(regularPrice) * (num(discountPercent) / 100);
  const finalPrice = Math.max(num(regularPrice) - discountSavings + num(extraFees), 0);
  const timeCost = (num(verificationTime) / 60) * num(timeValue);
  const netVsRegular = num(regularPrice) - finalPrice - timeCost;
  const netVsAlternative = num(alternativesPrice) - finalPrice - timeCost;
  const budgetImpact = finalPrice - num(plannedBudget);
  const effectiveDiscount = num(regularPrice) > 0 ? ((num(regularPrice) - finalPrice) / num(regularPrice)) * 100 : 0;

  const verdict =
    budgetImpact > 0
      ? "The discounted purchase is still above the planned budget."
      : netVsAlternative > 0
        ? "The healthcare-worker discount beats the alternative after fees and time."
        : "The discount may not beat the cheaper alternative once fees and time are counted.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="min-w-0 space-y-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Regular price" prefix="$" value={regularPrice} onChange={setRegularPrice} helper="Price before the healthcare-worker discount." />
            <CalculatorInput label="Discount" suffix="%" value={discountPercent} onChange={setDiscountPercent} helper="Use the actual discount, not the advertised maximum." />
            <CalculatorInput label="Shipping, fees, or membership" prefix="$" value={extraFees} onChange={setExtraFees} helper="Add costs required to get the discount." />
            <CalculatorInput label="Verification time" suffix="min" value={verificationTime} onChange={setVerificationTime} helper="Time spent proving eligibility or managing the deal." />
            <CalculatorInput label="Value of your time" prefix="$" value={timeValue} onChange={setTimeValue} helper="Hourly value for friction math." />
            <CalculatorInput label="Planned budget" prefix="$" value={plannedBudget} onChange={setPlannedBudget} helper="What you already meant to spend." />
            <CalculatorInput label="Best alternative price" prefix="$" value={alternativesPrice} onChange={setAlternativesPrice} helper="A normal sale, used item, or no-discount competitor." />
          </div>
          <CalculatorFormula
            items={[
              "Discount savings = regular price x discount percentage",
              "Final price = regular price - discount savings + required fees",
              "Time cost = verification minutes / 60 x hourly value of time",
              "Net value = comparison price - final price - time cost",
            ]}
            note="The best discount is usually on something you already planned to buy."
          />
        </div>
        <div className="min-w-0 space-y-3 lg:col-span-2">
          <CalculatorResult label="Discount savings" value={formatUSD(discountSavings)} />
          <CalculatorResult label="Final price after fees" value={formatUSD(finalPrice)} emphasis="primary" />
          <CalculatorResult label="Effective discount" value={`${formatNumber(effectiveDiscount)}%`} />
          <CalculatorResult label="Time cost" value={formatUSD(timeCost)} />
          <CalculatorResult label="Net vs regular price" value={formatUSD(netVsRegular)} emphasis="accent" />
          <CalculatorResult label="Net vs best alternative" value={formatUSD(netVsAlternative)} emphasis="primary" />
          <CalculatorResult label="Budget impact" value={formatUSD(budgetImpact)} />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};

export const PostShiftRecoveryBudgetCalculator = () => {
  const [shiftsPerMonth, setShiftsPerMonth] = useState("14");
  const [unplannedSpend, setUnplannedSpend] = useState("28");
  const [plannedRecovery, setPlannedRecovery] = useState("12");
  const [setupCost, setSetupCost] = useState("90");
  const [redirectPercent, setRedirectPercent] = useState("70");

  const currentMonthly = num(shiftsPerMonth) * num(unplannedSpend);
  const plannedMonthly = num(shiftsPerMonth) * num(plannedRecovery);
  const monthlyFreedBeforeSetup = Math.max(currentMonthly - plannedMonthly, 0);
  const firstMonthFreed = monthlyFreedBeforeSetup - num(setupCost);
  const annualFreed = monthlyFreedBeforeSetup * 12 - num(setupCost);
  const redirectedMonthly = monthlyFreedBeforeSetup * (num(redirectPercent) / 100);
  const sixMonthRedirect = redirectedMonthly * 6 - num(setupCost);

  const verdict =
    monthlyFreedBeforeSetup > 100
      ? "A planned recovery default could free up meaningful monthly cash without relying on willpower after a shift."
      : monthlyFreedBeforeSetup > 0
        ? "The savings are modest, but a planned default may still reduce stress spending."
        : "The planned default costs as much as the current pattern. Use this for comfort, not savings.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="min-w-0 space-y-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Hard shifts per month" value={shiftsPerMonth} onChange={setShiftsPerMonth} helper="Shifts where tired spending tends to happen." />
            <CalculatorInput label="Unplanned spend per shift" prefix="$" value={unplannedSpend} onChange={setUnplannedSpend} helper="Takeout, snacks, delivery, impulse carts, or similar." />
            <CalculatorInput label="Planned recovery cost" prefix="$" value={plannedRecovery} onChange={setPlannedRecovery} helper="Pre-planned meal, snack, transport, or comfort default." />
            <CalculatorInput label="One-time setup cost" prefix="$" value={setupCost} onChange={setSetupCost} helper="Groceries, containers, freezer meals, app blockers, or other setup." />
            <CalculatorInput label="Redirected to savings or debt" suffix="%" value={redirectPercent} onChange={setRedirectPercent} helper="Share of freed cash you actually move somewhere useful." />
          </div>
          <CalculatorFormula
            items={[
              "Current monthly pattern = hard shifts x unplanned spend per shift",
              "Planned monthly recovery cost = hard shifts x planned recovery cost",
              "Monthly cash freed = current monthly pattern - planned monthly recovery cost",
              "Six-month redirect = monthly cash freed x redirect percentage x 6 - one-time setup cost",
            ]}
            note="The goal is a kinder default after hard shifts, not a perfect zero-spend rule."
          />
        </div>
        <div className="min-w-0 space-y-3 lg:col-span-2">
          <CalculatorResult label="Current monthly pattern" value={formatUSD(currentMonthly)} emphasis="primary" />
          <CalculatorResult label="Planned monthly default" value={formatUSD(plannedMonthly)} />
          <CalculatorResult label="Monthly cash freed" value={formatUSD(monthlyFreedBeforeSetup)} emphasis="accent" />
          <CalculatorResult label="First-month change" value={formatUSD(firstMonthFreed)} />
          <CalculatorResult label="Annual cash freed" value={formatUSD(annualFreed)} emphasis="primary" />
          <CalculatorResult label="Six-month redirected amount" value={formatUSD(sixMonthRedirect)} />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};
