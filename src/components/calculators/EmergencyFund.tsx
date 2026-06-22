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
import { formatCurrency, formatMonths, formatPercent, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateEmergencyFund } from "@/lib/calculator-math";

const DEFAULTS = {
  rentMortgage: "1400",
  food: "500",
  transportation: "350",
  insurance: "250",
  minimumDebtPayments: "300",
  utilities: "250",
  otherEssentials: "150",
  desiredMonths: "3",
  currentSavings: "2500",
  monthlySavings: "500",
};

export const CalcEmergencyFund = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateEmergencyFund({
    rentMortgage: parseCalculatorValue(fields.rentMortgage),
    food: parseCalculatorValue(fields.food),
    transportation: parseCalculatorValue(fields.transportation),
    insurance: parseCalculatorValue(fields.insurance),
    minimumDebtPayments: parseCalculatorValue(fields.minimumDebtPayments),
    utilities: parseCalculatorValue(fields.utilities),
    otherEssentials: parseCalculatorValue(fields.otherEssentials),
    desiredMonths: parseCalculatorValue(fields.desiredMonths),
    currentSavings: parseCalculatorValue(fields.currentSavings),
    monthlySavings: parseCalculatorValue(fields.monthlySavings),
  });

  const interpretation = result.remainingAmount === 0
    ? "The savings entered cover the target. Keep the money accessible and revisit the total when essential costs change."
    : `Your current savings cover ${formatPercent(result.fundingPercentage)} of the target. At the monthly pace entered, the remaining gap could take about ${formatMonths(result.monthsToTarget).toLowerCase()}.`;

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputTitle="Monthly essentials and savings"
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Rent or mortgage" prefix="$" value={fields.rentMortgage} onChange={(value) => updateField("rentMortgage", value)} helper="Monthly housing payment." />
            <CalculatorInput label="Food and groceries" prefix="$" value={fields.food} onChange={(value) => updateField("food", value)} helper="Essential groceries and basic household food." />
            <CalculatorInput label="Transportation" prefix="$" value={fields.transportation} onChange={(value) => updateField("transportation", value)} helper="Transit, fuel, required parking, and basic vehicle costs." />
            <CalculatorInput label="Insurance" prefix="$" value={fields.insurance} onChange={(value) => updateField("insurance", value)} helper="Required health, auto, home, or renter coverage." />
            <CalculatorInput label="Minimum debt payments" prefix="$" value={fields.minimumDebtPayments} onChange={(value) => updateField("minimumDebtPayments", value)} helper="Required minimums, not optional extra payoff." />
            <CalculatorInput label="Utilities" prefix="$" value={fields.utilities} onChange={(value) => updateField("utilities", value)} helper="Power, water, phone, and essential internet." />
            <CalculatorInput label="Other essentials" prefix="$" value={fields.otherEssentials} onChange={(value) => updateField("otherEssentials", value)} helper="Childcare, medications, caregiving, or other must-pay costs." />
            <CalculatorInput label="Desired months of expenses" suffix="months" value={fields.desiredMonths} onChange={(value) => updateField("desiredMonths", value)} helper="A personal planning target, not a universal rule." step="1" />
            <CalculatorInput label="Current emergency savings" prefix="$" value={fields.currentSavings} onChange={(value) => updateField("currentSavings", value)} helper="Cash reserved for genuine emergencies." />
            <CalculatorInput label="Monthly amount available to save" prefix="$" value={fields.monthlySavings} onChange={(value) => updateField("monthlySavings", value)} helper="A realistic repeatable amount; enter 0 if unsure." />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Essential monthly expenses" value={formatCurrency(result.essentialMonthlyExpenses)} />
            <CalculatorResult label="Target emergency fund" value={formatCurrency(result.targetFund)} emphasis="primary" />
            <CalculatorResult label="Current funding" value={formatPercent(result.fundingPercentage)} />
            <CalculatorResult label="Remaining amount needed" value={formatCurrency(result.remainingAmount)} />
            <CalculatorResult label="Estimated time to target" value={formatMonths(result.monthsToTarget)} emphasis="accent" />
            <CalculatorMeaning>{interpretation}</CalculatorMeaning>
            <CalculatorNotice>
              Healthcare work can bring schedule changes, overtime dependence, injury, burnout, or time away for caregiving. A smaller first milestone can still create useful breathing room.
            </CalculatorNotice>
          </>
        )}
      />
      <CalculatorDetails
        example={<>With $3,200 of monthly essentials and a three-month goal, the target is $9,600. Starting with $2,500 and adding $500 monthly would close the $7,100 gap in about 15 months.</>}
        assumptions={[
          "Only essential expenses are included; discretionary spending is excluded.",
          "The monthly savings amount stays consistent and earns no investment return.",
          "The target is based on the number of months you choose, not a required benchmark.",
          "Emergency savings should generally remain accessible rather than depend on market gains.",
        ]}
        sources={[SOURCE_PRESETS.cfpbEmergencyFund, SOURCE_PRESETS.federalReserve]}
        relatedTools={[
          { label: "Savings rate", href: "/tools/savings-rate" },
          { label: "Overtime tradeoff", href: "/tools/overtime-burnout" },
        ]}
      />
    </>
  );
};

export default CalcEmergencyFund;
