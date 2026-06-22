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
import { formatCurrency, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateHospitalBill, type InsuranceStatus } from "@/lib/calculator-math";

const DEFAULTS = {
  billedCharge: "5000",
  deductibleRemaining: "1000",
  coinsurancePercentage: "20",
  copay: "50",
  outOfPocketMaxRemaining: "2500",
  amountAlreadyPaid: "0",
  insuranceStatus: "insured",
};

export const CalcInsurance = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const insuranceStatus = fields.insuranceStatus as InsuranceStatus;
  const result = calculateHospitalBill({
    billedCharge: parseCalculatorValue(fields.billedCharge),
    deductibleRemaining: parseCalculatorValue(fields.deductibleRemaining),
    coinsurancePercentage: parseCalculatorValue(fields.coinsurancePercentage),
    copay: parseCalculatorValue(fields.copay),
    outOfPocketMaxRemaining: parseCalculatorValue(fields.outOfPocketMaxRemaining),
    amountAlreadyPaid: parseCalculatorValue(fields.amountAlreadyPaid),
    insuranceStatus,
  });

  const interpretation = insuranceStatus === "uninsured"
    ? `Without insurance terms entered, the estimate starts with the remaining billed charge of ${formatCurrency(result.patientResponsibility)}. Ask for an itemized bill and the provider's self-pay or financial-assistance options.`
    : `Based on these inputs, the patient share could be about ${formatCurrency(result.patientResponsibility)}. Treat the billed charge as a placeholder until the insurer's allowed amount and explanation of benefits are available.`;

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorSelect
              label="Insurance status"
              value={fields.insuranceStatus}
              onChange={(value) => updateField("insuranceStatus", value)}
              helper="This changes how the estimate is interpreted."
              options={[
                { value: "insured", label: "Insured" },
                { value: "uninsured", label: "Uninsured" },
                { value: "medicare", label: "Medicare" },
                { value: "medicaid", label: "Medicaid" },
                { value: "unsure", label: "Not sure" },
              ]}
            />
            <CalculatorInput label="Estimated billed charge" prefix="$" value={fields.billedCharge} onChange={(value) => updateField("billedCharge", value)} helper="Use an estimate or billed amount. It may be higher than the negotiated allowed amount." />
            <CalculatorInput label="Deductible remaining" prefix="$" value={fields.deductibleRemaining} onChange={(value) => updateField("deductibleRemaining", value)} helper="How much deductible is left for the plan year." />
            <CalculatorInput label="Coinsurance" suffix="%" value={fields.coinsurancePercentage} onChange={(value) => updateField("coinsurancePercentage", value)} helper="Your percentage after the deductible, such as 20%." max={100} />
            <CalculatorInput label="Copay" prefix="$" value={fields.copay} onChange={(value) => updateField("copay", value)} helper="A flat service fee, if your plan uses one here." />
            <CalculatorInput label="Out-of-pocket max remaining" prefix="$" value={fields.outOfPocketMaxRemaining} onChange={(value) => updateField("outOfPocketMaxRemaining", value)} helper="Enter 0 if unknown. Only covered, in-network spending generally counts." />
            <CalculatorInput label="Already paid for this service (optional)" prefix="$" value={fields.amountAlreadyPaid} onChange={(value) => updateField("amountAlreadyPaid", value)} helper="Payments already made toward this specific service." required={false} />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Estimated patient responsibility" value={formatCurrency(result.patientResponsibility)} emphasis="primary" />
            <CalculatorResult label="Applied to deductible" value={formatCurrency(result.deductibleApplied)} />
            <CalculatorResult label="Coinsurance estimate" value={formatCurrency(result.coinsuranceEstimate)} />
            <CalculatorResult label="Copay estimate" value={formatCurrency(result.copayEstimate)} />
            <CalculatorResult
              label="Out-of-pocket max cap effect"
              value={formatCurrency(result.outOfPocketCapEffect)}
              helper={result.outOfPocketCapEffect > 0 ? "Estimated reduction from the remaining cap entered." : "No cap reduction appears in this scenario."}
              emphasis={result.outOfPocketCapEffect > 0 ? "accent" : "muted"}
            />
            <CalculatorMeaning>{interpretation}</CalculatorMeaning>
            <CalculatorNotice tone="caution">
              Real bills can differ because of network status, coding, negotiated rates, prior authorization, non-covered services, and separate facility, professional, lab, imaging, or anesthesia bills.
            </CalculatorNotice>
            {insuranceStatus === "medicare" || insuranceStatus === "medicaid" ? (
              <CalculatorNotice>
                {insuranceStatus === "medicare"
                  ? "Medicare cost sharing depends on Original Medicare, Medicare Advantage, supplemental coverage, assignment, and the service setting."
                  : "Medicaid benefits and permitted cost sharing vary by state and eligibility group. This commercial-plan style estimate may not match your coverage."}
              </CalculatorNotice>
            ) : null}
          </>
        )}
      />
      <CalculatorDetails
        example={<>For a $5,000 service with $1,000 of deductible left, 20% coinsurance, and a $50 copay, the simple estimate is $1,850 before any out-of-pocket cap reduces it.</>}
        assumptions={[
          "The billed charge is used as a stand-in for the allowed amount; actual negotiated rates may be lower.",
          "The deductible is applied first, followed by coinsurance and then any copay entered.",
          "An out-of-pocket maximum only caps this estimate when a positive remaining amount is entered.",
          "Premiums, non-covered care, and other bills are not included.",
        ]}
        sources={[SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.cmsMedicalBills]}
        relatedTools={[
          { label: "Emergency fund", href: "/tools/emergency-fund" },
          { label: "Medicare cost tool", href: "/tools/medicare-costs" },
        ]}
      />
    </>
  );
};

export default CalcInsurance;
