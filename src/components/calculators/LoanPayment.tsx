import { useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorFormula } from "@/components/shared/CalculatorFormula";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
    isFinite(n) ? n : 0,
  );

const num = (s: string, fallback = 0) => {
  const n = parseFloat(s);
  return isFinite(n) ? n : fallback;
};

export const CalcLoanPayment = () => {
  const [principal, setPrincipal] = useState("20000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");

  const principalN = Math.max(0, num(principal));
  const rateN = Math.max(0, num(rate));
  const yearsN = Math.max(0.1, num(years));

  const monthlyRate = rateN / 100 / 12;
  const n = yearsN * 12;

  const monthlyPayment =
    monthlyRate > 0 ? (principalN * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n)) : principalN / n;

  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principalN;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Loan amount" prefix="$" value={principal} onChange={setPrincipal} helper="Total loan principal." />
          <CalculatorInput label="Annual interest rate" suffix="%" value={rate} onChange={setRate} helper="Fixed yearly rate." />
          <CalculatorInput label="Term" suffix="yrs" value={years} onChange={setYears} helper="Loan term in years." />
        </div>
        <CalculatorFormula
          items={[
            "Monthly rate = annual interest rate / 12",
            "Number of payments = loan term in years x 12",
            "Monthly payment uses the standard fixed-rate amortization formula",
            "Total interest = total paid - original loan amount",
          ]}
          note="This does not model fees, deferment, variable rates, income-driven repayment, forgiveness, or prepayment."
        />
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Monthly payment" value={formatUSD(monthlyPayment)} emphasis="primary" />
        <CalculatorResult label="Total paid" value={formatUSD(totalPaid)} />
        <CalculatorResult label="Total interest" value={formatUSD(totalInterest)} />
        <CalculatorMeaning>
          This calculator assumes a fixed rate and equal payments. Actual loan costs may differ due to fees or variable rates.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export default CalcLoanPayment;
