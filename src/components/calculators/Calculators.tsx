import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorInput, CalculatorSelectField } from "@/components/shared/CalculatorInput";
import { CalculatorResult } from "@/components/shared/CalculatorResult";
import { CalculatorMeaning } from "@/components/shared/CalculatorCard";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import {
  calculateHealthInsuranceEstimate,
  type InsuranceCostShareMode,
} from "@/lib/calculators";

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
  const [deductibleMet, setDeductibleMet] = useState("0");
  const [costShareMode, setCostShareMode] = useState<InsuranceCostShareMode>("coinsurance");
  const [copay, setCopay] = useState("30");
  const [coinsurance, setCoinsurance] = useState("20");
  const [allowed, setAllowed] = useState("220");
  const [visits, setVisits] = useState("6");
  const [outOfPocketMaximum, setOutOfPocketMaximum] = useState("6000");
  const [outOfPocketMet, setOutOfPocketMet] = useState("0");

  const estimate = calculateHealthInsuranceEstimate({
    monthlyPremium: num(premium),
    annualDeductible: num(deductible),
    deductibleMet: num(deductibleMet),
    costShareMode,
    copayPerVisit: num(copay),
    coinsuranceRate: num(coinsurance),
    allowedAmountPerVisit: num(allowed),
    visits: num(visits),
    outOfPocketMaximum: num(outOfPocketMaximum),
    outOfPocketMet: num(outOfPocketMet),
  });

  const {
    annualPremium,
    totalAllowed,
    deductibleCost,
    postDeductibleCost,
    medicalCostSharing,
    insurancePays,
    totalAnnualCost,
    remainingOutOfPocket,
  } = estimate;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <CalculatorInput
            label="Monthly premium"
            prefix="$"
            value={premium}
            onChange={setPremium}
            min={0}
            step="0.01"
            helper="Paid for coverage each month. Premiums do not count toward the out-of-pocket maximum."
          />
          <CalculatorInput
            label="Annual deductible"
            prefix="$"
            value={deductible}
            onChange={setDeductible}
            min={0}
            step="0.01"
            helper="Amount the plan requires before this estimate applies post-deductible cost sharing."
          />
          <CalculatorInput
            label="Deductible already met"
            prefix="$"
            value={deductibleMet}
            onChange={setDeductibleMet}
            min={0}
            max={Math.max(0, num(deductible))}
            step="0.01"
            helper="Use the current amount shown by your insurer; it cannot exceed the annual deductible here."
          />
          <CalculatorSelectField
            label="After-deductible cost sharing"
            helper="Choose one simplified method for these visits so copay and coinsurance are not double-counted."
          >
            <Select value={costShareMode} onValueChange={(value) => setCostShareMode(value as InsuranceCostShareMode)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="coinsurance">Coinsurance percentage</SelectItem>
                <SelectItem value="copay">Flat copay per visit</SelectItem>
              </SelectContent>
            </Select>
          </CalculatorSelectField>
          {costShareMode === "coinsurance" ? (
            <CalculatorInput
              label="Coinsurance after deductible"
              suffix="%"
              value={coinsurance}
              onChange={setCoinsurance}
              min={0}
              max={100}
              step="0.1"
              helper="Your percentage of the remaining allowed amount after the deductible."
            />
          ) : (
            <CalculatorInput
              label="Copay after deductible"
              prefix="$"
              value={copay}
              onChange={setCopay}
              min={0}
              step="0.01"
              helper="Flat amount per modeled visit after the deductible; capped at that visit's remaining allowed amount."
            />
          )}
          <CalculatorInput
            label="Allowed amount per visit"
            prefix="$"
            value={allowed}
            onChange={setAllowed}
            min={0}
            step="0.01"
            helper="The in-network negotiated amount, not the provider's billed charge."
          />
          <CalculatorInput
            label="Number of visits"
            value={visits}
            onChange={setVisits}
            min={0}
            step="1"
            helper="Whole visits expected during the plan year."
          />
          <CalculatorInput
            label="In-network out-of-pocket maximum"
            prefix="$"
            value={outOfPocketMaximum}
            onChange={setOutOfPocketMaximum}
            min={0}
            step="0.01"
            helper="Enter 0 if unknown. Premiums and non-covered or out-of-network charges are not included."
          />
          <CalculatorInput
            label="Out-of-pocket maximum already met"
            prefix="$"
            value={outOfPocketMet}
            onChange={setOutOfPocketMet}
            min={0}
            max={Math.max(0, num(outOfPocketMaximum))}
            step="0.01"
            helper="Use the current in-network amount reported by your insurer, which usually includes deductible payments."
          />
        </div>

        <div className="rounded-2xl bg-muted/30 border border-border p-5 text-sm leading-relaxed">
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Simplified calculation model</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Annual premium = monthly premium × 12 and stays separate from medical cost sharing.</li>
            <li>Each visit's allowed amount first applies to the remaining deductible.</li>
            <li>After the deductible, the selected copay or coinsurance applies — never both.</li>
            <li>New medical cost sharing stops at the remaining in-network out-of-pocket maximum.</li>
            <li>Patient cost sharing + insurer payment = modeled allowed charges.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground/80">
            This assumes the deductible applies to every modeled visit before one uniform cost-sharing method.
            Real plans may exempt services from the deductible or use different copays and coinsurance by service.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult
          label="Annual premium"
          value={formatUSD(annualPremium)}
          helper="Shown separately; premiums do not count toward the out-of-pocket maximum."
        />
        <CalculatorResult label="Modeled allowed charges" value={formatUSD(totalAllowed)} />
        <CalculatorResult label="Deductible portion you pay" value={formatUSD(deductibleCost)} />
        <CalculatorResult
          label={costShareMode === "copay" ? "Copay portion you pay" : "Coinsurance portion you pay"}
          value={formatUSD(postDeductibleCost)}
        />
        <CalculatorResult label="Modeled medical cost sharing" value={formatUSD(medicalCostSharing)} emphasis="primary" />
        <CalculatorResult label="Estimated insurer payment" value={formatUSD(insurancePays)} />
        <CalculatorResult
          label="Premium + modeled medical cost sharing"
          value={formatUSD(totalAnnualCost)}
          emphasis="accent"
        />
        <CalculatorResult
          label="Remaining in-network out-of-pocket room"
          value={remainingOutOfPocket === null ? "Not calculated" : formatUSD(remainingOutOfPocket)}
          helper={remainingOutOfPocket === null
            ? "No cap was applied because the out-of-pocket maximum was entered as $0."
            : "Based on the amount already met plus the visits modeled here."}
        />
        <CalculatorMeaning>
          This is a planning estimate, not a bill prediction. Actual costs depend on plan rules, network status,
          covered services, allowed amounts, pharmacy costs, claim order, and insurer processing.
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
