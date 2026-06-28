import { useMemo, useState } from "react";
import { CalculatorInput } from "@/components/shared/CalculatorInput";
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const selectClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const OutOfPocketMaxEstimator = () => {
  const [oopMax, setOopMax] = useState("6500");
  const [oopMet, setOopMet] = useState("1200");
  const [remainingDeductible, setRemainingDeductible] = useState("800");
  const [allowedAmount, setAllowedAmount] = useState("4000");
  const [expectedCopays, setExpectedCopays] = useState("120");
  const [coinsurance, setCoinsurance] = useState("20");
  const [coverageStatus, setCoverageStatus] = useState("covered-in-network");

  const result = useMemo(() => {
    const oopMaxN = Math.max(0, num(oopMax));
    const oopMetN = clamp(num(oopMet), 0, oopMaxN || Number.MAX_SAFE_INTEGER);
    const remainingOopBeforeCare = Math.max(oopMaxN - oopMetN, 0);
    const remainingDeductibleN = Math.max(0, num(remainingDeductible));
    const allowedAmountN = Math.max(0, num(allowedAmount));
    const expectedCopaysN = Math.max(0, num(expectedCopays));
    const coinsuranceRate = clamp(num(coinsurance), 0, 100) / 100;
    const capApplies = coverageStatus === "covered-in-network";

    const towardDeductible = Math.min(allowedAmountN, remainingDeductibleN);
    const afterDeductibleAllowed = Math.max(allowedAmountN - towardDeductible, 0);
    const coinsuranceCost = afterDeductibleAllowed * coinsuranceRate;
    const estimatedCostBeforeCap = towardDeductible + coinsuranceCost + expectedCopaysN;
    const estimatedPatientPays = capApplies
      ? Math.min(estimatedCostBeforeCap, remainingOopBeforeCare)
      : estimatedCostBeforeCap;
    const newlyCountsTowardOop = capApplies ? Math.min(estimatedCostBeforeCap, remainingOopBeforeCare) : 0;
    const estimatedOopMetAfterCare = capApplies ? Math.min(oopMetN + newlyCountsTowardOop, oopMaxN) : oopMetN;
    const remainingOopAfterCare = Math.max(oopMaxN - estimatedOopMetAfterCare, 0);
    const protectedByCap = capApplies ? Math.max(estimatedCostBeforeCap - estimatedPatientPays, 0) : 0;
    const capReached = capApplies && remainingOopBeforeCare > 0 && estimatedCostBeforeCap >= remainingOopBeforeCare;

    return {
      capApplies,
      capReached,
      towardDeductible,
      coinsuranceCost,
      estimatedCostBeforeCap,
      estimatedPatientPays,
      newlyCountsTowardOop,
      estimatedOopMetAfterCare,
      remainingOopBeforeCare,
      remainingOopAfterCare,
      protectedByCap,
    };
  }, [allowedAmount, coinsurance, coverageStatus, expectedCopays, oopMax, oopMet, remainingDeductible]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorInput
            label="Plan year out-of-pocket maximum"
            prefix="$"
            value={oopMax}
            onChange={setOopMax}
            helper="The covered in-network yearly ceiling listed in the plan documents."
          />
          <CalculatorInput
            label="Already counted toward OOP max"
            prefix="$"
            value={oopMet}
            onChange={setOopMet}
            helper="Use your insurer portal or latest EOB, not just bills paid."
          />
          <CalculatorInput
            label="Remaining deductible"
            prefix="$"
            value={remainingDeductible}
            onChange={setRemainingDeductible}
            helper="How much deductible remains before coinsurance rules apply."
          />
          <CalculatorInput
            label="Expected allowed amount"
            prefix="$"
            value={allowedAmount}
            onChange={setAllowedAmount}
            helper="Use the plan allowed amount if known, not the provider sticker price."
          />
          <CalculatorInput
            label="Expected copays"
            prefix="$"
            value={expectedCopays}
            onChange={setExpectedCopays}
            helper="Total copays expected for this care episode or year."
          />
          <CalculatorInput
            label="Coinsurance after deductible"
            suffix="%"
            value={coinsurance}
            onChange={setCoinsurance}
            helper="Your percentage share after deductible rules are met."
          />
          <label className="min-w-0 space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-foreground">Coverage status</span>
            <select className={selectClass} value={coverageStatus} onChange={(event) => setCoverageStatus(event.target.value)}>
              <option value="covered-in-network">Covered in-network care</option>
              <option value="not-covered-in-network">Out-of-network, denied, or not clearly covered</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Most out-of-pocket maximum protections apply to covered in-network care. Out-of-network or denied care can work differently.
            </p>
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-relaxed">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">How this estimate works</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Remaining OOP room = plan out-of-pocket maximum - amount already counted.</li>
            <li>Deductible portion = expected allowed amount up to the remaining deductible.</li>
            <li>Coinsurance portion = remaining allowed amount after deductible × coinsurance rate.</li>
            <li>Estimated patient cost = deductible portion + coinsurance + expected copays, capped at remaining OOP room when covered in-network.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground/80">
            Premiums, non-covered services, balance billing, out-of-network care, and charges above the allowed amount may not count toward the out-of-pocket maximum.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <CalculatorResult label="Remaining OOP room before care" value={formatUSD(result.remainingOopBeforeCare)} />
        <CalculatorResult label="Deductible portion" value={formatUSD(result.towardDeductible)} />
        <CalculatorResult label="Coinsurance portion" value={formatUSD(result.coinsuranceCost)} />
        <CalculatorResult
          label="Estimated patient responsibility"
          value={formatUSD(result.estimatedPatientPays)}
          emphasis="primary"
          helper={result.capApplies ? "Capped by remaining covered in-network OOP room." : "Cap not applied because coverage is not clearly covered in-network."}
        />
        <CalculatorResult label="New amount counted toward OOP max" value={formatUSD(result.newlyCountsTowardOop)} />
        <CalculatorResult label="Estimated OOP max remaining after care" value={formatUSD(result.remainingOopAfterCare)} emphasis="accent" />
        {result.protectedByCap > 0 && (
          <CalculatorResult
            label="Estimated amount limited by the cap"
            value={formatUSD(result.protectedByCap)}
            helper="This is the amount the cap may prevent you from paying for covered in-network allowed charges."
          />
        )}
        <CalculatorMeaning>
          {result.capApplies
            ? result.capReached
              ? "This care could push the patient to the plan's covered in-network out-of-pocket maximum. Verify with the insurer before paying a large bill."
              : "This estimate suggests some out-of-pocket room may remain after the expected care. Check the insurer portal because EOB timing can lag."
            : "The out-of-pocket max may not protect this estimate if the service is denied, out-of-network, non-covered, or billed above the allowed amount."}
        </CalculatorMeaning>
        <DisclaimerBox short />
      </div>
    </div>
  );
};

export default OutOfPocketMaxEstimator;
