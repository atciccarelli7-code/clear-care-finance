import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { CalculatorDetails, CalculatorFormLayout, CalculatorNotice } from "@/components/shared/CalculatorLayout";
import { SOURCE_PRESETS } from "@/data/sources";
import { useCalculatorFields } from "@/hooks/use-calculator-fields";
import { formatCurrency, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateLoanPayment } from "@/lib/calculator-math";

const DEFAULTS = {
  principal: "20000",
  annualInterestRate: "7",
  termYears: "10",
};

export const CalcLoanPayment = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateLoanPayment({
    principal: parseCalculatorValue(fields.principal),
    annualInterestRate: parseCalculatorValue(fields.annualInterestRate),
    termYears: parseCalculatorValue(fields.termYears),
  });

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Loan amount" prefix="$" value={fields.principal} onChange={(value) => updateField("principal", value)} helper="Current principal to be repaid." />
            <CalculatorInput label="Annual interest rate" suffix="%" value={fields.annualInterestRate} onChange={(value) => updateField("annualInterestRate", value)} helper="Fixed yearly rate used for the estimate." step="0.01" />
            <CalculatorInput label="Repayment term" suffix="years" value={fields.termYears} onChange={(value) => updateField("termYears", value)} helper="Number of years of equal monthly payments." step="0.5" min={0.1} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Monthly payment" value={formatCurrency(result.monthlyPayment, 2)} emphasis="primary" />
            <CalculatorResult label="Total paid" value={formatCurrency(result.totalPaid, 2)} />
            <CalculatorResult label="Total interest" value={formatCurrency(result.totalInterest, 2)} />
            <CalculatorMeaning>
              A longer term usually lowers the monthly payment but increases total interest. Compare the monthly fit and the full cost together.
            </CalculatorMeaning>
            <CalculatorNotice>
              This assumes a fixed rate and equal monthly payments. Servicer rules, fees, capitalization, income-driven plans, forgiveness, deferment, and variable rates can change actual costs.
            </CalculatorNotice>
          </>
        )}
      />
      <CalculatorDetails
        example={<>A $20,000 balance at 7% over 10 years is about $232 per month and about $27,866 total, assuming equal monthly payments and no fees.</>}
        assumptions={[
          "The interest rate stays fixed for the full term.",
          "Payments are made monthly and on time.",
          "No fees, capitalization events, subsidies, or forgiveness are included.",
          "A zero interest rate divides principal evenly across the repayment term.",
        ]}
        sources={[SOURCE_PRESETS.studentAidLoanSimulator]}
        relatedTools={[
          { label: "Savings rate", href: "/tools/savings-rate" },
          { label: "Emergency fund", href: "/tools/emergency-fund" },
        ]}
      />
    </>
  );
};

export default CalcLoanPayment;
