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

const clampPercent = (value: string) => Math.min(Math.max(num(value), 0), 100);

const InfoBox = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">{title}</div>
    <ul className="space-y-1.5 text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

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
  <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
    <h3 className="font-display text-lg font-bold">{label}</h3>
    <CalculatorInput label="Premium per paycheck" prefix="$" value={premium} onChange={setPremium} helper="Employee share only." />
    <CalculatorInput label="Expected medical cost" prefix="$" value={expectedOop} onChange={setExpectedOop} helper="Expected covered in-network cost-sharing before premiums." />
    <CalculatorInput label="In-network out-of-pocket max" prefix="$" value={oopMax} onChange={setOopMax} helper="Covered in-network cap. Do not include premiums." />
    <CalculatorInput label="Employer HSA/HRA money" prefix="$" value={employerMoney} onChange={setEmployerMoney} helper="Annual employer contribution or plan credit." />
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
  const aExpectedCare = Math.min(num(aExpected), num(aOopMax));
  const bExpectedCare = Math.min(num(bExpected), num(bOopMax));
  const aExpectedTotal = aPremiumAnnual + Math.max(aExpectedCare - num(aEmployer), 0);
  const bExpectedTotal = bPremiumAnnual + Math.max(bExpectedCare - num(bEmployer), 0);
  const aWorstCase = aPremiumAnnual + Math.max(num(aOopMax) - num(aEmployer), 0);
  const bWorstCase = bPremiumAnnual + Math.max(num(bOopMax) - num(bEmployer), 0);
  const expectedWinner = aExpectedTotal <= bExpectedTotal ? "Plan A" : "Plan B";
  const worstWinner = aWorstCase <= bWorstCase ? "Plan A" : "Plan B";
  const expectedGap = Math.abs(aExpectedTotal - bExpectedTotal);
  const worstGap = Math.abs(aWorstCase - bWorstCase);
  const premiumGap = Math.abs(aPremiumAnnual - bPremiumAnnual);
  const lowerPremiumPlan = aPremiumAnnual <= bPremiumAnnual ? "Plan A" : "Plan B";

  const verdict = expectedWinner === worstWinner
    ? `${expectedWinner} looks stronger on both expected cost and bad-year exposure.`
    : `${expectedWinner} looks cheaper in an expected year, but ${worstWinner} has the lower bad-year exposure. Decide based on cash cushion, medication risk, and how much uncertainty you can handle.`;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <CalculatorInput label="Pay periods per year" value={payPeriods} onChange={setPayPeriods} helper="Most biweekly workers use 26." />
          <div className="grid gap-5 md:grid-cols-2">
            <PlanInputs label="Plan A" premium={aPremium} setPremium={setAPremium} expectedOop={aExpected} setExpectedOop={setAExpected} oopMax={aOopMax} setOopMax={setAOopMax} employerMoney={aEmployer} setEmployerMoney={setAEmployer} />
            <PlanInputs label="Plan B" premium={bPremium} setPremium={setBPremium} expectedOop={bExpected} setExpectedOop={setBExpected} oopMax={bOopMax} setOopMax={setBOopMax} employerMoney={bEmployer} setEmployerMoney={setBEmployer} />
          </div>
          <InfoBox
            title="How this comparison works"
            items={[
              "Expected total = annual employee premium + expected covered care cost - employer HSA/HRA money.",
              "Expected covered care is capped at the in-network out-of-pocket max so a typo does not overstate the expected-year estimate.",
              "Bad-year exposure = annual employee premium + in-network out-of-pocket max - employer HSA/HRA money.",
              "Lowest premium is not automatically the best plan if the deductible, network, prescriptions, or OOP max are materially worse.",
            ]}
          />
        </div>
        <div className="space-y-3 lg:col-span-2">
          <CalculatorResult label="Plan A expected yearly cost" value={formatUSD(aExpectedTotal)} emphasis="primary" />
          <CalculatorResult label="Plan B expected yearly cost" value={formatUSD(bExpectedTotal)} emphasis="primary" />
          <CalculatorResult label="Expected-year gap" value={formatUSD(expectedGap)} helper={`${expectedWinner} is lower on this expected-use estimate.`} />
          <CalculatorResult label="Plan A bad-year exposure" value={formatUSD(aWorstCase)} emphasis="accent" />
          <CalculatorResult label="Plan B bad-year exposure" value={formatUSD(bWorstCase)} emphasis="accent" />
          <CalculatorResult label="Bad-year gap" value={formatUSD(worstGap)} helper={`${worstWinner} is lower if covered in-network costs hit the cap.`} />
          <CalculatorResult label="Annual premium gap" value={formatUSD(premiumGap)} helper={`${lowerPremiumPlan} has the lower paycheck premium before care is used.`} />
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
  const taxSavings = pretax * (clampPercent(taxRate) / 100);
  const paycheckImpact = Math.max(pretax + afterTax - taxSavings, 0);
  const annualImpact = paycheckImpact * periods;
  const grossDeductions = pretax + afterTax;
  const annualGrossDeductions = grossDeductions * periods;
  const annualTaxSavings = taxSavings * periods;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
          <CalculatorInput label="Pay periods per year" value={payPeriods} onChange={setPayPeriods} helper="Most biweekly workers use 26." />
          <CalculatorInput label="Estimated tax rate" suffix="%" value={taxRate} onChange={setTaxRate} helper="Combined federal, state, and payroll estimate." />
          <CalculatorInput label="Medical premium" prefix="$" value={medical} onChange={setMedical} helper="Per paycheck, usually pre-tax if payroll deducted." />
          <CalculatorInput label="Dental premium" prefix="$" value={dental} onChange={setDental} helper="Per paycheck." />
          <CalculatorInput label="Vision premium" prefix="$" value={vision} onChange={setVision} helper="Per paycheck." />
          <CalculatorInput label="HSA or FSA contribution" prefix="$" value={hsaFsa} onChange={setHsaFsa} helper="Per paycheck." />
          <CalculatorInput label="Retirement contribution" prefix="$" value={retirement} onChange={setRetirement} helper="Per paycheck pre-tax estimate." />
          <CalculatorInput label="Disability premium" prefix="$" value={disability} onChange={setDisability} helper="Often after-tax if employee-paid, but check your plan." />
          <CalculatorInput label="Supplemental life" prefix="$" value={life} onChange={setLife} helper="Per paycheck." />
          <CalculatorInput label="Accident / critical / hospital plans" prefix="$" value={supplemental} onChange={setSupplemental} helper="Total per paycheck." />
        </div>
        <div className="space-y-3 lg:col-span-2">
          <CalculatorResult label="Gross deductions per paycheck" value={formatUSD(grossDeductions)} />
          <CalculatorResult label="Estimated tax savings per paycheck" value={formatUSD(taxSavings)} emphasis="accent" />
          <CalculatorResult label="Estimated take-home reduction" value={formatUSD(paycheckImpact)} emphasis="primary" />
          <CalculatorResult label="Annual take-home impact" value={formatUSD(annualImpact)} emphasis="primary" />
          <CalculatorResult label="Annual gross deductions" value={formatUSD(annualGrossDeductions)} />
          <CalculatorResult label="Annual estimated tax savings" value={formatUSD(annualTaxSavings)} />
          <CalculatorMeaning>
            Use this before submitting benefits. The benefits portal may show deductions one line at a time; this stacks them into the approximate paycheck effect after pre-tax savings.
          </CalculatorMeaning>
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
  const expectedPayout = num(likelyPayout) * (clampPercent(triggerChance) / 100);
  const deductibleGap = Math.max(num(deductible) - num(emergencyFund), 0);
  const badYearGap = Math.max(num(oopMax) - num(emergencyFund), 0);
  const netExpected = expectedPayout - annualPremium;
  const premiumCouldAddToCash = annualPremium;
  const premiumAsShareOfGap = badYearGap > 0 ? annualPremium / badYearGap : 0;

  const verdict = netExpected > 0
    ? "The expected payout is higher than the annual premium on these assumptions. Still check exclusions, waiting periods, and exact benefit triggers."
    : badYearGap > 0 && premiumAsShareOfGap < 0.25
      ? "This may be temporary gap protection if your cash cushion is thin, but building cash is still the cleaner long-term fix."
      : "This looks more like optional peace-of-mind coverage than a clear financial win. Read the benefit schedule before buying.";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
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
        <div className="space-y-3 lg:col-span-2">
          <CalculatorResult label="Annual supplemental premiums" value={formatUSD(annualPremium)} emphasis="primary" />
          <CalculatorResult label="Expected payout value" value={formatUSD(expectedPayout)} helper="Likely payout × chance of triggering one covered benefit." />
          <CalculatorResult label="Expected payout minus premium" value={formatUSD(netExpected)} />
          <CalculatorResult label="Deductible cash gap" value={formatUSD(deductibleGap)} />
          <CalculatorResult label="Bad-year cash gap" value={formatUSD(badYearGap)} emphasis="accent" />
          <CalculatorResult label="Cash buffer if you skipped coverage" value={formatUSD(premiumCouldAddToCash)} helper="One year of premiums redirected to savings." />
          <CalculatorMeaning>{verdict}</CalculatorMeaning>
          <DisclaimerBox short />
        </div>
      </div>
      <InfoBox
        title="What to verify before buying"
        items={[
          "Whether the policy pays cash directly to you or pays providers.",
          "Exactly which diagnoses, admissions, injuries, observation stays, or ICU days trigger payment.",
          "Waiting periods, exclusions, pre-existing condition rules, and recurrence limits.",
          "Whether the same premium would do more good in an HSA, FSA, emergency fund, or debt payoff plan.",
        ]}
      />
    </div>
  );
};
