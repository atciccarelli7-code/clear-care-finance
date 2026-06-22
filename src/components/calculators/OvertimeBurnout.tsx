import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import {
  CalculatorDetails,
  CalculatorFormLayout,
  CalculatorNotice,
} from "@/components/shared/CalculatorLayout";
import { SOURCE_PRESETS } from "@/data/sources";
import { useCalculatorFields } from "@/hooks/use-calculator-fields";
import { formatCurrency, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateOvertime } from "@/lib/calculator-math";

const DEFAULTS = {
  baseHourlyRate: "45",
  overtimeHoursPerWeek: "8",
  overtimeMultiplier: "1.5",
  taxWithholdingPercentage: "25",
  weeksWorked: "48",
  extraSpendingPerWeek: "60",
  recoveryCostPerWeek: "40",
};

export const CalcOvertime = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateOvertime({
    baseHourlyRate: parseCalculatorValue(fields.baseHourlyRate),
    overtimeHoursPerWeek: parseCalculatorValue(fields.overtimeHoursPerWeek),
    overtimeMultiplier: parseCalculatorValue(fields.overtimeMultiplier),
    taxWithholdingPercentage: parseCalculatorValue(fields.taxWithholdingPercentage),
    weeksWorked: parseCalculatorValue(fields.weeksWorked),
    extraSpendingPerWeek: parseCalculatorValue(fields.extraSpendingPerWeek),
    recoveryCostPerWeek: parseCalculatorValue(fields.recoveryCostPerWeek),
  });

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputTitle="Overtime pattern"
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Base hourly rate" prefix="$" value={fields.baseHourlyRate} onChange={(value) => updateField("baseHourlyRate", value)} helper="Regular hourly pay before differentials." step="0.01" />
            <CalculatorInput label="Overtime hours per week" value={fields.overtimeHoursPerWeek} onChange={(value) => updateField("overtimeHoursPerWeek", value)} helper="Average extra hours in a week when you work overtime." step="0.5" />
            <CalculatorInput label="Overtime multiplier" suffix="x" value={fields.overtimeMultiplier} onChange={(value) => updateField("overtimeMultiplier", value)} helper="Often 1.5, but contracts and local rules differ." step="0.1" />
            <CalculatorInput label="Estimated tax withholding" suffix="%" value={fields.taxWithholdingPercentage} onChange={(value) => updateField("taxWithholdingPercentage", value)} helper="A rough withholding estimate, not your final tax rate." max={100} />
            <CalculatorInput label="Weeks worked" value={fields.weeksWorked} onChange={(value) => updateField("weeksWorked", value)} helper="Number of weeks this overtime pattern lasts." step="1" max={52} />
            <CalculatorInput label="Extra spending after overtime per week" prefix="$" value={fields.extraSpendingPerWeek} onChange={(value) => updateField("extraSpendingPerWeek", value)} helper="Takeout, convenience purchases, rideshare, or other overtime-linked spending." required={false} />
            <CalculatorInput label="Recovery costs per week" prefix="$" value={fields.recoveryCostPerWeek} onChange={(value) => updateField("recoveryCostPerWeek", value)} helper="Optional paid help, missed-cancellation fees, or recovery spending." required={false} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Gross overtime pay" value={formatCurrency(result.grossOvertimePay)} />
            <CalculatorResult label="Estimated after-tax overtime pay" value={formatCurrency(result.estimatedAfterTaxPay)} emphasis="primary" />
            <CalculatorResult label="Estimated lifestyle leakage" value={formatCurrency(result.lifestyleLeakage)} helper="Extra spending plus recovery costs across the weeks entered." />
            <CalculatorResult label="Estimated net benefit" value={formatCurrency(result.netBenefit)} emphasis="accent" />
            <CalculatorMeaning>
              The net estimate is the money left after rough withholding and the overtime-linked costs entered. It does not assign a dollar value to sleep, health, relationships, or clinical risk.
            </CalculatorMeaning>
            <CalculatorNotice tone="caution">
              Financial gain should be weighed against sleep, fatigue, burnout, health, commute safety, and patient safety. A positive number does not mean the schedule is safe or sustainable.
            </CalculatorNotice>
          </>
        )}
      />
      <CalculatorDetails
        example={<>At $45 per hour, eight overtime hours per week at 1.5x for 48 weeks produces about $25,920 gross. With 25% withholding and $100 of weekly overtime-linked costs, the estimated net benefit is $14,640.</>}
        assumptions={[
          "Gross overtime pay equals base rate times overtime multiplier times overtime hours times weeks.",
          "Withholding is a simple percentage estimate and may not equal final tax owed.",
          "Extra spending and recovery costs repeat every overtime week.",
          "Shift differentials, bonuses, pension effects, benefit changes, and non-financial costs are excluded.",
        ]}
        sources={[SOURCE_PRESETS.dolOvertime, SOURCE_PRESETS.nioshWorkHours]}
        relatedTools={[
          { label: "Savings rate", href: "/tools/savings-rate" },
          { label: "Emergency fund", href: "/tools/emergency-fund" },
        ]}
      />
    </>
  );
};

export default CalcOvertime;
