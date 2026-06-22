import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { CalculatorDetails, CalculatorFormLayout } from "@/components/shared/CalculatorLayout";
import { SOURCE_PRESETS } from "@/data/sources";
import { useCalculatorFields } from "@/hooks/use-calculator-fields";
import { formatCurrency, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateCafeSpending } from "@/lib/calculator-math";

const DEFAULTS = {
  coffeeCost: "4.50",
  coffeePerWeek: "3",
  mealCost: "12",
  mealsPerWeek: "2",
  snackCost: "3",
  snacksPerWeek: "3",
  workWeeks: "48",
  weeklyAmountReplaced: "15",
};

export const CalcCafe = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateCafeSpending({
    coffeeCost: parseCalculatorValue(fields.coffeeCost),
    coffeePerWeek: parseCalculatorValue(fields.coffeePerWeek),
    mealCost: parseCalculatorValue(fields.mealCost),
    mealsPerWeek: parseCalculatorValue(fields.mealsPerWeek),
    snackCost: parseCalculatorValue(fields.snackCost),
    snacksPerWeek: parseCalculatorValue(fields.snacksPerWeek),
    workWeeks: parseCalculatorValue(fields.workWeeks),
    weeklyAmountReplaced: parseCalculatorValue(fields.weeklyAmountReplaced),
  });

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputTitle="A typical work week"
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Coffee or drink cost" prefix="$" value={fields.coffeeCost} onChange={(value) => updateField("coffeeCost", value)} helper="Average price for one drink." step="0.01" />
            <CalculatorInput label="Drinks purchased per week" value={fields.coffeePerWeek} onChange={(value) => updateField("coffeePerWeek", value)} helper="Count a normal work week, not the busiest one." step="1" />
            <CalculatorInput label="Cafeteria meal cost" prefix="$" value={fields.mealCost} onChange={(value) => updateField("mealCost", value)} helper="Average price for one meal." step="0.01" />
            <CalculatorInput label="Meals purchased per week" value={fields.mealsPerWeek} onChange={(value) => updateField("mealsPerWeek", value)} helper="Include takeout bought mainly because of a shift." step="1" />
            <CalculatorInput label="Snack or treat cost" prefix="$" value={fields.snackCost} onChange={(value) => updateField("snackCost", value)} helper="Average price for one snack." step="0.01" />
            <CalculatorInput label="Snacks purchased per week" value={fields.snacksPerWeek} onChange={(value) => updateField("snacksPerWeek", value)} helper="Use a typical week." step="1" />
            <CalculatorInput label="Work weeks per year" value={fields.workWeeks} onChange={(value) => updateField("workWeeks", value)} helper="Use 48 if you want to allow roughly four weeks away from work." step="1" max={52} />
            <CalculatorInput label="Weekly amount replaced by food from home" prefix="$" value={fields.weeklyAmountReplaced} onChange={(value) => updateField("weeklyAmountReplaced", value)} helper="The spending you could avoid after accounting for food brought from home." required={false} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Weekly spending" value={formatCurrency(result.weeklySpending, 2)} />
            <CalculatorResult label="Average monthly spending" value={formatCurrency(result.monthlySpending)} />
            <CalculatorResult label="Annual spending" value={formatCurrency(result.annualSpending)} emphasis="primary" />
            <CalculatorResult label="Potential annual savings" value={formatCurrency(result.potentialAnnualSavings)} emphasis="accent" helper="Based only on the weekly amount you chose to replace." />
            <CalculatorMeaning>
              Healthcare work is demanding, and a coffee or meal can be practical comfort, not a character flaw. The useful question is whether this total matches what you want your money to do.
            </CalculatorMeaning>
          </>
        )}
      />
      <CalculatorDetails
        example={<>Three $4.50 drinks, two $12 meals, and three $3 snacks total $46.50 per week. Across 48 work weeks, that is about $2,232. Replacing $15 per week would keep about $720 per year available for another goal.</>}
        assumptions={[
          "Each purchase category uses the same average price throughout the year.",
          "Monthly spending equals annual spending divided by 12, which smooths out schedule changes.",
          "Potential savings use the weekly replacement amount you enter and do not assume every purchase disappears.",
          "No investment return or inflation is projected.",
        ]}
        sources={[SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.bls]}
        relatedTools={[
          { label: "Savings rate", href: "/tools/savings-rate" },
          { label: "Emergency fund", href: "/tools/emergency-fund" },
        ]}
      />
    </>
  );
};

export default CalcCafe;
