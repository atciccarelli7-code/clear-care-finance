import { CalculatorInput, CalculatorSelect } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import {
  CalculatorDetails,
  CalculatorFormLayout,
  CalculatorNotice,
} from "@/components/shared/CalculatorLayout";
import { SOURCE_PRESETS } from "@/data/sources";
import { useCalculatorFields } from "@/hooks/use-calculator-fields";
import { formatCurrency, formatPercent, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateContributionGoal } from "@/lib/calculator-math";

const DEFAULTS = {
  annualGoal: "12000",
  yearToDate: "3000",
  paychecksRemaining: "18",
  contributionType: "dollar",
  grossPayPerPaycheck: "2800",
  employerMatchPercentage: "4",
};

export const Calc403b = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateContributionGoal({
    annualGoal: parseCalculatorValue(fields.annualGoal),
    yearToDate: parseCalculatorValue(fields.yearToDate),
    paychecksRemaining: parseCalculatorValue(fields.paychecksRemaining),
    grossPayPerPaycheck: parseCalculatorValue(fields.grossPayPerPaycheck),
    employerMatchPercentage: parseCalculatorValue(fields.employerMatchPercentage),
  });

  const interpretation = result.remainingContribution === 0
    ? "You have already reached the annual goal entered. Check payroll and plan records before making another contribution."
    : result.achievable
      ? `To stay on pace, direct about ${formatCurrency(result.requiredPerPaycheck, 2)} from each remaining paycheck. ${
        fields.contributionType === "percentage"
          ? `That is roughly ${formatPercent(result.requiredPercentage)} of gross pay.`
          : "A payroll percentage may vary when overtime or differentials change gross pay."
      }`
      : "The remaining goal is larger than the gross pay available in the paychecks entered. Lower the goal, add paychecks, or verify the inputs.";

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Annual contribution goal" prefix="$" value={fields.annualGoal} onChange={(value) => updateField("annualGoal", value)} helper="Your employee contribution target for this calendar year." />
            <CalculatorInput label="Contributed year to date" prefix="$" value={fields.yearToDate} onChange={(value) => updateField("yearToDate", value)} helper="Use the employee contribution total on your latest pay stub." />
            <CalculatorInput label="Paychecks remaining" value={fields.paychecksRemaining} onChange={(value) => updateField("paychecksRemaining", value)} helper="Count checks that can still include a contribution." step="1" />
            <CalculatorSelect
              label="How payroll accepts contributions"
              value={fields.contributionType}
              onChange={(value) => updateField("contributionType", value)}
              helper="Choose the format you need for your payroll election."
              options={[
                { value: "dollar", label: "Dollar amount per paycheck" },
                { value: "percentage", label: "Percentage of gross pay" },
              ]}
            />
            <CalculatorInput label="Gross pay per paycheck" prefix="$" value={fields.grossPayPerPaycheck} onChange={(value) => updateField("grossPayPerPaycheck", value)} helper="Before taxes, insurance, retirement, and other deductions." />
            <CalculatorInput label="Employer match percentage (optional)" suffix="%" value={fields.employerMatchPercentage} onChange={(value) => updateField("employerMatchPercentage", value)} helper="Enter the maximum pay percentage your employer matches, if known." required={false} max={100} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Required per paycheck" value={formatCurrency(result.requiredPerPaycheck, 2)} emphasis="primary" />
            <CalculatorResult label="Estimated paycheck percentage" value={formatPercent(result.requiredPercentage)} helper="Required contribution divided by gross pay per paycheck." />
            <CalculatorResult label="Remaining annual contribution" value={formatCurrency(result.remainingContribution)} />
            <CalculatorResult
              label="Goal outlook"
              value={result.achievable ? "Appears achievable" : "Needs adjustment"}
              emphasis={result.achievable ? "accent" : "muted"}
            />
            {parseCalculatorValue(fields.employerMatchPercentage) > 0 ? (
              <CalculatorResult label="Estimated remaining employer match" value={formatCurrency(result.estimatedEmployerMatch)} helper="Simplified estimate; vesting and match formulas vary by plan." />
            ) : null}
            {!result.achievable || result.appearsUnrealistic ? (
              <CalculatorNotice tone="caution">
                {result.requiredPerPaycheck > parseCalculatorValue(fields.grossPayPerPaycheck)
                  ? "The required contribution exceeds gross pay per paycheck."
                  : "This would direct more than half of gross pay to the plan. Confirm that other deductions and take-home needs still fit."}
              </CalculatorNotice>
            ) : null}
            <CalculatorMeaning>{interpretation}</CalculatorMeaning>
            <CalculatorNotice>
              IRS contribution limits and plan rules change. Verify the current limit, catch-up eligibility, payroll cutoff dates, and match formula with the IRS and your plan administrator.
            </CalculatorNotice>
          </>
        )}
      />
      <CalculatorDetails
        example={<>A nurse with a $12,000 goal, $3,000 contributed, and 18 checks left would need about $500 per check. On $2,800 of gross pay, that is about 17.9%.</>}
        assumptions={[
          "The annual goal includes employee contributions only, not employer match.",
          "Each remaining paycheck has the same gross pay and can receive a contribution.",
          "The match estimate treats the entered match as a simple percentage of gross pay.",
          "The calculator does not enforce a current IRS or plan-specific contribution limit.",
        ]}
        sources={[SOURCE_PRESETS.irs]}
        relatedTools={[
          { label: "Savings rate", href: "/tools/savings-rate" },
          { label: "Emergency fund", href: "/tools/emergency-fund" },
        ]}
      />
    </>
  );
};

export default Calc403b;
