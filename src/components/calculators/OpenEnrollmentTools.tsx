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

const PlanInputs = ({
  label,
  premium,
  setPremium,
  expectedOop,
  setExpectedOop,
  oopMax,
  setOopMax,
  employerMoney,
  setEmployerMoney,
}: {
  label: string;
  premium: string;
  setPremium: (value: string) => void;
  expectedOop: string;
  setExpectedOop: (value: string) => void;
  oopMax: string;
  setOopMax: (value: string) => void;
  employerMoney: string;
  setEmployerMoney: (value: string) => void;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-card">
    <h3 className="font-display text-lg font-bold">{label}</h3>
    <CalculatorInput label="Premium per paycheck" prefix="$" value={premium} onChange={setPremium} helper="Employee share only." />
    <CalculatorInput label="Expected medical spending" prefix="$" value={expectedOop} onChange={setExpectedOop} helper="Your expected out-of-pocket care cost before premiums." />
    <CalculatorInput label="In-network out-of-pocket max" prefix="$" value={oopMax} onChange={setOopMax} helper="Do not include premiums." />
    <CalculatorInput label="Employer HSA/HRA money" prefix="$" value={employerMoney} onChange={setEmployerMoney} helper="Annual employer account contribution or credit." />
  </div>
);

export const OpenEnrollmentTrueCostCalculator = () => {
  const [payPeriods, setPayPeriods] = useState("26");
  const [aPremium, setAPremium] = useState("120");
  const [aExpected, setAExpected] = useState("1600");
  const [aOopMax, setAOopMax] = useState("5000");
  const [aEmployer, setAEmployer] = useState("0");
  const [bPremium, setBPremium] = useState("70");
  const [bExpected, setBExpected] = useState("2300");
  const [bOopMax, setBOopMax] = useState("7000");
  const [bEmployer, setBEmployer] = useState("750");

  const periods = num(payPeriods) || 26;
  const aPremiumAnnual = num(aPremium) * periods;
  const bPremiumAnnual = num(bPremium) * periods;
  const aExpectedTotal = aPremiumAnnual + Math.max(num(aExpected) - num(aEmployer), 0);
  const bExpectedTotal = bPremiumAnnual + Math.max(num(bExpected) - num(bEmployer), 0);
  const aWorstCase = aPremiumAnnual + Math.max(num(aOopMax) - num(aEmployer), 0);
  const bWorstCase = bPremiumAnnual + Math.max(num(bOopMax) - num(bEmployer), 0);
  const expectedWinner = aExpectedTotal <= bExpectedTotal ? "Plan A" : "Plan B";
  const worstWinner = aWorstCase <= bWorstCase ? "Plan A" : "Plan B";
  const expectedGap = Math.abs(aExpectedTotal - bExpectedTotal);
  const worstGap = Math.abs(aWorstCase - bWorstCase);

  const verdict = expectedWinner === worstWinner
    ? `${expectedWinner} looks stronger on both expected cost and worst-case exposure.`
    : `${expectedWinner} looks cheaper in an expected year, but ${worstWinner} has the lower worst-case exposure. Decide based on cash cushion and health risk.`;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <CalculatorInput label="Pay periods per year" value={payPeriods} onChange={setPayPeriods} helper="Most biweekly workers use 26." />
          <div className="grid gap-5 md:grid-cols-2">
            <PlanInputs label="Plan A" premium={aPremium} setPremium={setAPremium} expectedOop={aExpected} setExpectedOop={setAExpected} oopMax={aOopMax} setOopMax={setAOopMax} employerMoney={aEmployer} setEmployerMoney={setAEmployer} />
            <PlanInputs label="Plan B" premium={bPremium} setPremium={setBPremium} expectedOop={bExpected} setExpectedOop={setBExpected} oopMax={bOopMax} setOopMax={setBOopMax} employerMoney={bEmployer} setEmployerMoney={setBEmployer} />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-3">
          <CalculatorResult label="Plan A expected yearly cost" value={formatUSD(aExpectedTotal)} emphasis="primary" />
          <CalculatorResult label="Plan B expected yearly cost" value={formatUSD(bExpectedTotal)} emphasis="primary" />
          <CalculatorResult label="Expected-year gap" value={formatUSD(expectedGap)} />
          <CalculatorResult label="Plan A worst-case exposure" value={formatUSD(aWorstCase)} emphasis="accent" />
          <CalculatorResult label="Plan B worst-case exposure" value={formatUSD(bWorstCase)} emphasis="accent" />
          <CalculatorResult label="Worst-case gap" value={formatUSD(worstGap)} />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};

export const OpenEnrollmentPaycheckImpactCalculator = () => {
  const [payPeriods, setPayPeriods] = useState("26");
  const [medical, setMedical] = useState("120");
  const [dental, setDental] = useState("12");
  const [vision, setVision] = useState("5");
  const [hsaFsa, setHsaFsa] = useState("75");
  const [retirement, setRetirement] = useState("150");
  const [taxRate, setTaxRate] = useState("25");
  const [disability, setDisability] = useState("10");
  const [life, setLife] = useState("4");
  const [supplemental, setSupplemental] = useState("18");

  const periods = num(payPeriods) || 26;
  const pretax = num(medical) + num(dental) + num(vision) + num(hsaFsa) + num(retirement);
  const afterTax = num(disability) + num(life) + num(supplemental);
  const taxSavings = pretax * (num(taxRate) / 100);
  const paycheckImpact = pretax + afterTax - taxSavings;
  const annualImpact = paycheckImpact * periods;
  const grossDeductions = pretax + afterTax;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Pay periods per year" value={payPeriods} onChange={setPayPeriods} helper="Most biweekly workers use 26." />
          <CalculatorInput label="Estimated tax rate" suffix="%" value={taxRate} onChange={setTaxRate} helper="Combined federal, state, and payroll estimate." />
          <CalculatorInput label="Medical premium" prefix="$" value={medical} onChange={setMedical} helper="Per paycheck." />
          <CalculatorInput label="Dental premium" prefix="$" value={dental} onChange={setDental} helper="Per paycheck." />
          <CalculatorInput label="Vision premium" prefix="$" value={vision} onChange={setVision} helper="Per paycheck." />
          <CalculatorInput label="HSA or FSA contribution" prefix="$" value={hsaFsa} onChange={setHsaFsa} helper="Per paycheck." />
          <CalculatorInput label="Retirement contribution" prefix="$" value={retirement} onChange={setRetirement} helper="Per paycheck pre-tax estimate." />
          <CalculatorInput label="Disability premium" prefix="$" value={disability} onChange={setDisability} helper="Often after-tax if employee-paid, but check your plan." />
          <CalculatorInput label="Supplemental life" prefix="$" value={life} onChange={setLife} helper="Per paycheck." />
          <CalculatorInput label="Accident / critical / hospital plans" prefix="$" value={supplemental} onChange={setSupplemental} helper="Total per paycheck." />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <CalculatorResult label="Gross paycheck deductions" value={formatUSD(grossDeductions)} />
          <CalculatorResult label="Estimated tax savings" value={formatUSD(taxSavings)} emphasis="accent" />
          <CalculatorResult label="Estimated take-home reduction" value={formatUSD(paycheckImpact)} emphasis="primary" />
          <CalculatorResult label="Annual take-home impact" value={formatUSD(annualImpact)} emphasis="primary" />
          <CalculatorMeaning>Use this before submitting elections. The benefit page may show deductions, but this estimates the paycheck impact after pre-tax savings.</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};

export const SupplementalBenefitsDecisionHelper = () => {
  const [payPeriods, setPayPeriods] = useState("26");
  const [accident, setAccident] = useState("8");
  const [critical, setCritical] = useState("12");
  const [hospital, setHospital] = useState("10");
  const [emergencyFund, setEmergencyFund] = useState("3000");
  const [deductible, setDeductible] = useState("3000");
  const [oopMax, setOopMax] = useState("7000");
  const [triggerChance, setTriggerChance] = useState("10");
  const [likelyPayout, setLikelyPayout] = useState("2000");

  const periods = num(payPeriods) || 26;
  const annualPremium = (num(accident) + num(critical) + num(hospital)) * periods;
  const expectedPayout = num(likelyPayout) * (num(triggerChance) / 100);
  const medicalGap = Math.max(Math.min(num(oopMax), num(deductible)) - num(emergencyFund), 0);
  const netExpected = expectedPayout - annualPremium;
  const verdict = netExpected > 0
    ? "The expected payout is higher than the annual premium on these assumptions. Still check exclusions and exact benefit triggers."
    : medicalGap > 0 && annualPremium < medicalGap * 0.35
      ? "This may be reasonable as temporary gap protection, but building cash is still the cleaner long-term solution."
      : "This looks more like optional peace-of-mind coverage than a clear financial win.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Pay periods per year" value={payPeriods} onChange={setPayPeriods} helper="Most biweekly workers use 26." />
          <CalculatorInput label="Accident plan premium" prefix="$" value={accident} onChange={setAccident} helper="Per paycheck." />
          <CalculatorInput label="Critical illness premium" prefix="$" value={critical} onChange={setCritical} helper="Per paycheck." />
          <CalculatorInput label="Hospital indemnity premium" prefix="$" value={hospital} onChange={setHospital} helper="Per paycheck." />
          <CalculatorInput label="Emergency fund" prefix="$" value={emergencyFund} onChange={setEmergencyFund} helper="Cash available for a medical year." />
          <CalculatorInput label="Health plan deductible" prefix="$" value={deductible} onChange={setDeductible} helper="In-network deductible." />
          <CalculatorInput label="Health plan out-of-pocket max" prefix="$" value={oopMax} onChange={setOopMax} helper="In-network max, premiums excluded." />
          <CalculatorInput label="Chance one policy pays" suffix="%" value={triggerChance} onChange={setTriggerChance} helper="Your rough annual probability estimate." />
          <CalculatorInput label="Likely payout if triggered" prefix="$" value={likelyPayout} onChange={setLikelyPayout} helper="Read the policy schedule, not the marketing headline." />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <CalculatorResult label="Annual premiums" value={formatUSD(annualPremium)} emphasis="primary" />
          <CalculatorResult label="Expected payout value" value={formatUSD(expectedPayout)} />
          <CalculatorResult label="Estimated emergency-fund gap" value={formatUSD(medicalGap)} emphasis="accent" />
          <CalculatorResult label="Expected payout minus premium" value={formatUSD(netExpected)} />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
    </div>
  );
};
