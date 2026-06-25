import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorFormula } from "@/components/shared/CalculatorFormula";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0,
  );

const num = (s: string, fallback = 0) => {
  const n = parseFloat(s);
  return isFinite(n) ? n : fallback;
};

/* ============= 403(b) Paycheck Contribution ============= */
export const Calc403b = () => {
  const [hourly, setHourly] = useState("45");
  const [hoursWeek, setHoursWeek] = useState("36");
  const [freq, setFreq] = useState("26"); // pay periods/yr
  const [pct, setPct] = useState("8");
  const [matchPct, setMatchPct] = useState("4");
  const [type, setType] = useState<"traditional" | "roth">("traditional");
  const [taxBracket, setTaxBracket] = useState("22");

  const hourlyN = Math.max(0, num(hourly));
  const hoursWeekN = Math.max(0, num(hoursWeek));
  const freqN = Math.max(1, num(freq, 26));
  const pctN = Math.max(0, num(pct));
  const matchPctN = Math.max(0, num(matchPct));

  const weeksPerPeriod = 52 / freqN;
  const grossPerCheck = hourlyN * hoursWeekN * weeksPerPeriod;
  const employeePerCheck = grossPerCheck * (pctN / 100);
  const annualEmployee = employeePerCheck * freqN;
  const effectiveMatch = Math.min(matchPctN, pctN);
  const employerPerCheck = grossPerCheck * (effectiveMatch / 100);
  const annualEmployer = employerPerCheck * freqN;
  const totalRetirement = annualEmployee + annualEmployer;
  const taxableReduction = type === "traditional" ? annualEmployee : 0;
  const estTaxSavings = type === "traditional" ? annualEmployee * (Math.max(0, num(taxBracket)) / 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Hourly wage" prefix="$" value={hourly} onChange={setHourly} helper="Base hourly rate." />
          <CalculatorInput label="Hours per week" value={hoursWeek} onChange={setHoursWeek} helper="Typical scheduled hours." />
          <CalculatorSelectField label="Pay frequency" helper="Most hospitals pay biweekly.">
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="52">Weekly (52)</SelectItem>
                <SelectItem value="26">Bi-weekly (26)</SelectItem>
                <SelectItem value="24">Semi-monthly (24)</SelectItem>
                <SelectItem value="12">Monthly (12)</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          <CalculatorInput label="Your contribution %" suffix="%" value={pct} onChange={setPct} helper="Portion of each paycheck going to your 403(b)." />
          <CalculatorInput label="Employer match %" suffix="%" value={matchPct} onChange={setMatchPct} helper="Max % of pay your employer matches." />
          <CalculatorSelectField label="Contribution type" helper="Traditional = pre-tax. Roth = after-tax.">
            <Select value={type} onValueChange={(v) => setType(v as "traditional" | "roth")}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional (pre-tax)</SelectItem>
                <SelectItem value="roth">Roth (after-tax)</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          {type === "traditional" && (
            <CalculatorInput label="Estimated tax bracket" suffix="%" value={taxBracket} onChange={setTaxBracket} helper="Rough federal marginal rate — for tax-savings estimate only." />
          )}
        </div>

        <div className="rounded-2xl bg-muted/30 border border-border p-5 text-sm leading-relaxed">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">How this is calculated</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Gross paycheck = hourly wage × hours/week × (52 ÷ pay periods/year)</li>
            <li>Employee contribution / paycheck = gross paycheck × contribution %</li>
            <li>Annual employee contribution = contribution/paycheck × pay periods/year</li>
            <li>Employer match = gross paycheck × min(match %, contribution %), annualized</li>
            <li>Total annual savings = employee contribution + employer match</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground/80">
            Actual tax impact depends on federal, state, and payroll taxes, other deductions, and your full tax situation. This is an educational estimate, not tax advice.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Estimated gross paycheck" value={formatUSD(grossPerCheck)} />
        <CalculatorResult label="Employee contribution / paycheck" value={formatUSD(employeePerCheck)} />
        <CalculatorResult label="Annual employee contribution" value={formatUSD(annualEmployee)} emphasis="primary" />
        <CalculatorResult label="Estimated employer match (yearly)" value={formatUSD(annualEmployer)} />
        <CalculatorResult label="Total retirement savings / year" value={formatUSD(totalRetirement)} emphasis="accent" />
        <CalculatorResult
          label="Estimated taxable income reduction"
          value={formatUSD(taxableReduction)}
          helper={type === "traditional"
            ? "Equals your annual pre-tax contribution. Roth contributions would show $0 here."
            : "Roth contributions are after-tax, so current taxable income is not reduced."}
        />
        {type === "traditional" && (
          <CalculatorResult
            label="Estimated tax savings"
            value={formatUSD(estTaxSavings)}
            helper="Rough estimate = pre-tax contribution × marginal rate. Actual savings vary."
          />
        )}
        <CalculatorMeaning>
          Contributing enough to get the full match is usually the single highest-return move available in a workplace plan.
          This is an educational estimate — actual paychecks include differentials, overtime, and other deductions.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

/* ============= Insurance Visit Cost ============= */
export const CalcInsurance = () => {
  const [premium, setPremium] = useState("180");
  const [deductible, setDeductible] = useState("1500");
  const [met, setMet] = useState("0");
  const [copay, setCopay] = useState("30");
  const [coins, setCoins] = useState("20");
  const [allowed, setAllowed] = useState("220");
  const [visits, setVisits] = useState("6");
  const [oopMax, setOopMax] = useState("6000");

  const premiumN = num(premium);
  const deductibleN = num(deductible);
  const metN = num(met);
  const copayN = num(copay);
  const coinsN = num(coins);
  const allowedN = num(allowed);
  const visitsN = num(visits);
  const oopMaxN = num(oopMax);

  const annualPremium = premiumN * 12;
  const remainingDeductible = Math.max(deductibleN - metN, 0);
  const totalAllowed = allowedN * visitsN;
  const towardDeductible = Math.min(totalAllowed, remainingDeductible);
  const afterDeductible = Math.max(totalAllowed - towardDeductible, 0);
  const coinsCost = afterDeductible * (coinsN / 100);
  const copayCost = copayN * visitsN;
  let patientPays = towardDeductible + coinsCost + copayCost;
  if (oopMaxN > 0) patientPays = Math.min(patientPays, oopMaxN);
  const insurancePays = Math.max(totalAllowed - (towardDeductible + coinsCost), 0);
  const totalAnnual = annualPremium + patientPays;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Monthly premium" prefix="$" value={premium} onChange={setPremium} helper="What you pay each month for coverage." />
          <CalculatorInput label="Annual deductible" prefix="$" value={deductible} onChange={setDeductible} helper="Amount you pay before insurance starts paying." />
          <CalculatorInput label="Deductible already met" prefix="$" value={met} onChange={setMet} helper="Amount counted toward this year's deductible." />
          <CalculatorInput label="Copay per visit" prefix="$" value={copay} onChange={setCopay} helper="Flat fee per visit." />
          <CalculatorInput label="Coinsurance" suffix="%" value={coins} onChange={setCoins} helper="Your share after deductible." />
          <CalculatorInput label="Allowed amount / visit" prefix="$" value={allowed} onChange={setAllowed} helper="Negotiated price per visit." />
          <CalculatorInput label="Number of visits" value={visits} onChange={setVisits} helper="Expected visits this year." />
          <CalculatorInput label="Out-of-pocket maximum" prefix="$" value={oopMax} onChange={setOopMax} helper="Worst-case in-network ceiling." />
        </div>
        <CalculatorFormula
          items={[
            "Annual premium = monthly premium x 12",
            "Remaining deductible = annual deductible - deductible already met, floored at $0",
            "Total allowed amount = allowed amount per visit x number of visits",
            "Patient care cost = deductible portion + coinsurance after deductible + copays",
            "Estimated total annual cost = annual premium + patient care cost",
          ]}
          note="This assumes in-network care. It does not model denied claims, noncovered care, balance billing, prior authorization, or separate facility/provider bills."
        />
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="You pay" value={formatUSD(patientPays)} emphasis="primary" />
        <CalculatorResult label="Insurance pays" value={formatUSD(insurancePays)} />
        <CalculatorResult label="Annual premium" value={formatUSD(annualPremium)} />
        <CalculatorResult label="Estimated total annual cost" value={formatUSD(totalAnnual)} emphasis="accent" />
        <CalculatorMeaning>
          "Total annual cost" is what the plan really costs you this year — premiums plus what you pay at the point of care.
          Compare this across plans, not just the premium.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

/* ============= Medicare Cost Exposure ============= */
export const CalcMedicare = () => {
  const [partB, setPartB] = useState("202.90");
  const [deductible, setDeductible] = useState("283");
  const [rxPerMonth, setRxPerMonth] = useState("3");
  const [rxCost, setRxCost] = useState("15");
  const [visits, setVisits] = useState("10");
  const [visitAmount, setVisitAmount] = useState("50");
  const [coins, setCoins] = useState("20");

  const annualPremium = num(partB) * 12;
  const annualRx = num(rxPerMonth) * num(rxCost) * 12;
  const visitShare = num(visits) * num(visitAmount) * (num(coins) / 100);
  const total = annualPremium + num(deductible) + visitShare + annualRx;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Monthly Part B premium" prefix="$" value={partB} onChange={setPartB} helper="2026 standard is about $202.90. Yours may differ — editable." />
          <CalculatorInput label="Annual Part B deductible" prefix="$" value={deductible} onChange={setDeductible} helper="2026 estimate is about $283. Editable." />
          <CalculatorInput label="Prescriptions per month" value={rxPerMonth} onChange={setRxPerMonth} helper="How many fills you expect monthly." />
          <CalculatorInput label="Avg cost per prescription" prefix="$" value={rxCost} onChange={setRxCost} helper="Rough out-of-pocket per fill." />
          <CalculatorInput label="Expected doctor visits" value={visits} onChange={setVisits} helper="Routine + specialist visits per year." />
          <CalculatorInput label="Avg Medicare-approved amount per visit" prefix="$" value={visitAmount} onChange={setVisitAmount} helper="Approved amount Medicare uses to calculate your 20%." />
          <CalculatorInput label="Coinsurance" suffix="%" value={coins} onChange={setCoins} helper="Typically 20% for Part B." />
        </div>

        <div className="rounded-2xl bg-muted/30 border border-border p-5 text-sm leading-relaxed">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">How this is calculated</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Annual Part B premium = monthly Part B premium × 12</li>
            <li>Annual prescriptions = prescriptions/month × avg prescription cost × 12</li>
            <li>Visit coinsurance = expected visits × avg Medicare-approved amount × coinsurance %</li>
            <li>Estimated yearly cost = Part B premium + deductible + prescriptions + visit coinsurance</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground/80">
            This is an educational estimate, not a quote. It does not include every possible Medicare, Medicare Advantage, Medigap, Part D, hospital, or long-term care cost.
          </p>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Annual Part B premium" value={formatUSD(annualPremium)} />
        <CalculatorResult label="Annual prescriptions" value={formatUSD(annualRx)} />
        <CalculatorResult label="Visit coinsurance share" value={formatUSD(visitShare)} />
        <CalculatorResult label="Estimated yearly Medicare cost" value={formatUSD(total)} emphasis="accent" />
        <CalculatorMeaning>
          Your actual cost depends on whether you have Original Medicare, Medicare Advantage (Part C — a private plan alternative for receiving Part A and Part B benefits), or a Medigap supplement. This is a directional estimate, not a quote.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

/* ============= Hospital Café Savings Rate ============= */
export const CalcCafe = () => {
  const [coffee, setCoffee] = useState("4");
  const [snack, setSnack] = useState("3");
  const [lunch, setLunch] = useState("11");
  const [shifts, setShifts] = useState("3");
  const [home, setHome] = useState("4");
  const [years, setYears] = useState("10");
  const [returnPct, setReturnPct] = useState("7");

  const perShift = num(coffee) + num(snack) + num(lunch);
  const homePerShift = num(home);
  const shiftsN = num(shifts);
  const weekly = perShift * shiftsN;
  const monthly = weekly * 4.33;
  const annual = weekly * 52;
  const homeAnnual = homePerShift * shiftsN * 52;
  const potentialSavings = Math.max(annual - homeAnnual, 0);

  const r = num(returnPct) / 100;
  const yrs = num(years);
  const monthlyContribution = potentialSavings / 12;
  // Future value of monthly contributions
  const months = yrs * 12;
  const monthlyR = r / 12;
  const futureValue =
    monthlyR > 0 ? monthlyContribution * ((Math.pow(1 + monthlyR, months) - 1) / monthlyR) : monthlyContribution * months;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput label="Coffee" prefix="$" value={coffee} onChange={setCoffee} helper="What you usually spend on a shift coffee." />
          <CalculatorInput label="Snack / treat" prefix="$" value={snack} onChange={setSnack} helper="The chips, bar, or pastry." />
          <CalculatorInput label="Lunch" prefix="$" value={lunch} onChange={setLunch} helper="Café or to-go lunch cost." />
          <CalculatorInput label="Shifts per week" value={shifts} onChange={setShifts} helper="Days you usually buy food at work." />
          <CalculatorInput label="Bring-from-home alternative" prefix="$" value={home} onChange={setHome} helper="What a home-packed version would cost." />
          <CalculatorInput label="Investing time horizon" suffix="yrs" value={years} onChange={setYears} helper="If you redirected the savings." />
          <CalculatorInput label="Assumed return" suffix="%" value={returnPct} onChange={setReturnPct} helper="Rough long-term stock-market average." />
        </div>
        <CalculatorFormula
          items={[
            "Per-shift cafe spend = coffee + snack/treat + lunch",
            "Weekly spend = per-shift cafe spend x shifts per week",
            "Potential annual savings = annual cafe spend - annual bring-from-home cost, floored at $0",
            "Invested value uses monthly contributions and the assumed annual return entered above",
          ]}
          note="The investing example assumes steady monthly contributions and a constant return. Real markets do not move that cleanly."
        />
      </div>
      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Weekly spend at work" value={formatUSD(weekly)} />
        <CalculatorResult label="Monthly spend" value={formatUSD(monthly)} />
        <CalculatorResult label="Annual spend" value={formatUSD(annual)} emphasis="primary" />
        <CalculatorResult label="Potential annual savings" value={formatUSD(potentialSavings)} helper="If you brought the alternative from home." />
        <CalculatorResult label={`Invested over ${yrs} years`} value={formatUSD(futureValue)} emphasis="accent" />
        <CalculatorMeaning>
          This isn't about giving up coffee. It's about seeing the number. Awareness is the lever — what you do with it is yours.
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};
