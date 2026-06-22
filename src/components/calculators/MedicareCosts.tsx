import { CalculatorInput } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { CalculatorDetails, CalculatorFormLayout, CalculatorNotice } from "@/components/shared/CalculatorLayout";
import { SOURCE_PRESETS } from "@/data/sources";
import { useCalculatorFields } from "@/hooks/use-calculator-fields";
import { formatCurrency, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateMedicareCosts } from "@/lib/calculator-math";

const DEFAULTS = {
  monthlyPartBPremium: "202.90",
  annualPartBDeductible: "283",
  prescriptionsPerMonth: "3",
  averagePrescriptionCost: "15",
  expectedDoctorVisits: "10",
  averageApprovedVisitAmount: "50",
  coinsurancePercentage: "20",
};

export const CalcMedicare = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateMedicareCosts({
    monthlyPartBPremium: parseCalculatorValue(fields.monthlyPartBPremium),
    annualPartBDeductible: parseCalculatorValue(fields.annualPartBDeductible),
    prescriptionsPerMonth: parseCalculatorValue(fields.prescriptionsPerMonth),
    averagePrescriptionCost: parseCalculatorValue(fields.averagePrescriptionCost),
    expectedDoctorVisits: parseCalculatorValue(fields.expectedDoctorVisits),
    averageApprovedVisitAmount: parseCalculatorValue(fields.averageApprovedVisitAmount),
    coinsurancePercentage: parseCalculatorValue(fields.coinsurancePercentage),
  });

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Monthly Part B premium" prefix="$" value={fields.monthlyPartBPremium} onChange={(value) => updateField("monthlyPartBPremium", value)} helper="Use the amount on your current Medicare notice; income adjustments can change it." step="0.01" />
            <CalculatorInput label="Annual Part B deductible" prefix="$" value={fields.annualPartBDeductible} onChange={(value) => updateField("annualPartBDeductible", value)} helper="Replace the default when Medicare publishes a new plan-year amount." />
            <CalculatorInput label="Prescriptions per month" value={fields.prescriptionsPerMonth} onChange={(value) => updateField("prescriptionsPerMonth", value)} helper="Number of prescription fills in a typical month." step="1" />
            <CalculatorInput label="Average cost per prescription" prefix="$" value={fields.averagePrescriptionCost} onChange={(value) => updateField("averagePrescriptionCost", value)} helper="Your estimated out-of-pocket amount per fill." step="0.01" />
            <CalculatorInput label="Expected doctor visits" value={fields.expectedDoctorVisits} onChange={(value) => updateField("expectedDoctorVisits", value)} helper="Routine and specialist visits over one year." step="1" />
            <CalculatorInput label="Average Medicare-approved amount per visit" prefix="$" value={fields.averageApprovedVisitAmount} onChange={(value) => updateField("averageApprovedVisitAmount", value)} helper="The approved amount used to calculate cost sharing, not the provider's charge." />
            <CalculatorInput label="Visit coinsurance" suffix="%" value={fields.coinsurancePercentage} onChange={(value) => updateField("coinsurancePercentage", value)} helper="Use the share shown in your coverage information." max={100} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Annual Part B premium" value={formatCurrency(result.annualPartBPremium)} />
            <CalculatorResult label="Annual Part B deductible" value={formatCurrency(result.annualPartBDeductible)} />
            <CalculatorResult label="Annual prescriptions" value={formatCurrency(result.annualPrescriptionCost)} />
            <CalculatorResult label="Visit coinsurance share" value={formatCurrency(result.visitCoinsurance)} />
            <CalculatorResult label="Estimated yearly Medicare cost" value={formatCurrency(result.estimatedAnnualCost)} emphasis="primary" />
            <CalculatorMeaning>
              This is a directional budget estimate for the entries above, not a complete Medicare cost projection or coverage decision.
            </CalculatorMeaning>
            <CalculatorNotice tone="caution">
              Actual costs depend on Original Medicare, Medicare Advantage, Part D, Medigap, provider participation, covered services, hospital care, and plan-specific limits.
            </CalculatorNotice>
          </>
        )}
      />
      <CalculatorDetails
        example={<>A $202.90 monthly premium is $2,434.80 per year. Add the deductible, estimated prescription costs, and visit coinsurance to build a simple annual planning number.</>}
        assumptions={[
          "The full Part B deductible is included even if it may not be reached.",
          "Prescription use and per-fill cost stay constant each month.",
          "Each doctor visit uses the same approved amount and coinsurance percentage.",
          "Hospital, dental, vision, long-term care, and many plan-specific costs are excluded.",
        ]}
        sources={[SOURCE_PRESETS.medicare, SOURCE_PRESETS.medicareParts]}
        relatedTools={[
          { label: "Hospital bill estimate", href: "/tools/hospital-bill" },
          { label: "Emergency fund", href: "/tools/emergency-fund" },
        ]}
      />
    </>
  );
};

export default CalcMedicare;
