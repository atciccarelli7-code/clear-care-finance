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

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const HealthInsuranceVisitCostCalculator = () => {
  const [premium, setPremium] = useState("180");
  const [deductible, setDeductible] = useState("1500");
  const [deductibleMet, setDeductibleMet] = useState("0");
  const [oopMax, setOopMax] = useState("6000");
  const [oopMet, setOopMet] = useState("0");
  const [copay, setCopay] = useState("30");
  const [coinsurance, setCoinsurance] = useState("20");
  const [allowed, setAllowed] = useState("220");
  const [visits, setVisits] = useState("6");

  const premiumN = num(premium);
  const deductibleN = num(deductible);
  const deductibleMetN = Math.min(num(deductibleMet), deductibleN);
  const oopMaxN = num(oopMax);
  const oopMetN = oopMaxN > 0 ? Math.min(num(oopMet), oopMaxN) : 0;
  const copayN = num(copay);
  const coinsuranceRate = clampPercent(num(coinsurance)) / 100;
  const allowedN = num(allowed);
  const visitsN = num(visits);

  const annualPremium = premiumN * 12;
  const totalAllowed = allowedN * visitsN;
  const remainingDeductible = Math.max(deductibleN - deductibleMetN, 0);
  const remainingOopRoom = oopMaxN > 0 ? Math.max(oopMaxN - oopMetN, 0) : Number.POSITIVE_INFINITY;
  const towardDeductible = Math.min(totalAllowed, remainingDeductible);
  const afterDeductible = Math.max(totalAllowed - towardDeductible, 0);
  const coinsuranceCost = afterDeductible * coinsuranceRate;
  const copayCost = copayN * visitsN;
  const patientCostBeforeCap = towardDeductible + coinsuranceCost + copayCost;
  const patientPays = Math.min(patientCostBeforeCap, remainingOopRoom);
  const capProtection = Math.max(patientCostBeforeCap - patientPays, 0);
  const estimatedOopMetAfter = oopMaxN > 0 ? Math.min(oopMetN + patientPays, oopMaxN) : patientPays;
  const remainingOopAfter = oopMaxN > 0 ? Math.max(oopMaxN - estimatedOopMetAfter, 0) : 0;
  const totalAnnualCost = annualPremium + patientPays;

  const interpretation = remainingOopRoom === 0
    ? "The plan appears to have no remaining covered in-network out-of-pocket room. Verify with the insurer before assuming a bill should be zero."
    : capProtection > 0
      ? "The expected care appears large enough that the out-of-pocket maximum may limit additional covered in-network cost-sharing."
      : "This estimate does not reach the out-of-pocket maximum, so deductible, copay, and coinsurance rules still matter.";

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-5 lg:col-span-3">
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorInput label="Monthly premium" prefix="$" value={premium} onChange={setPremium} helper="What you pay each month for coverage." />
          <CalculatorInput label="Annual deductible" prefix="$" value={deductible} onChange={setDeductible} helper="Amount you may pay before insurance shares many costs." />
          <CalculatorInput label="Deductible already met" prefix="$" value={deductibleMet} onChange={setDeductibleMet} helper="Use your insurer portal or latest EOB." />
          <CalculatorInput label="Out-of-pocket maximum" prefix="$" value={oopMax} onChange={setOopMax} helper="Covered in-network yearly cap, premiums excluded." />
          <CalculatorInput label="OOP max already met" prefix="$" value={oopMet} onChange={setOopMet} helper="Amount already counted toward the plan cap." />
          <CalculatorInput label="Copay per visit" prefix="$" value={copay} onChange={setCopay} helper="Flat fee per visit, if applicable." />
          <CalculatorInput label="Coinsurance" suffix="%" value={coinsurance} onChange={setCoinsurance} helper="Your share after deductible." />
          <CalculatorInput label="Allowed amount / visit" prefix="$" value={allowed} onChange={setAllowed} helper="Negotiated or plan-recognized price per visit." />
          <CalculatorInput label="Number of visits" value={visits} onChange={setVisits} helper="Expected visits this year." />
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">How this is calculated</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Remaining deductible = annual deductible minus deductible already met.</li>
            <li>Patient cost before cap = deductible portion + coinsurance + copays.</li>
            <li>Estimated patient cost is limited by remaining covered in-network OOP room.</li>
            <li>Premiums are added separately because they usually do not count toward the OOP maximum.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3 lg:col-span-2">
        <CalculatorResult label="Remaining deductible" value={formatUSD(remainingDeductible)} />
        <CalculatorResult label="Patient cost before cap" value={formatUSD(patientCostBeforeCap)} />
        <CalculatorResult label="Estimated patient pays" value={formatUSD(patientPays)} emphasis="primary" />
        <CalculatorResult label="Amount limited by OOP cap" value={formatUSD(capProtection)} helper="Covered in-network estimate only." />
        <CalculatorResult label="OOP max remaining after care" value={formatUSD(remainingOopAfter)} emphasis="accent" />
        <CalculatorResult label="Annual premium" value={formatUSD(annualPremium)} />
        <CalculatorResult label="Estimated total annual cost" value={formatUSD(totalAnnualCost)} emphasis="primary" />
        <CalculatorMeaning>{interpretation}</CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export default HealthInsuranceVisitCostCalculator;
