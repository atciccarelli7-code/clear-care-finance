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
import { formatCurrency, formatPercent, parseCalculatorValue } from "@/lib/calculator-format";
import { calculateSavingsRate, type SavingsRateBand } from "@/lib/calculator-math";

const DEFAULTS = {
  takeHomePay: "5200",
  fixedExpenses: "2800",
  variableExpenses: "1200",
  retirementContributions: "350",
  extraDebtPayments: "200",
  cashSavings: "600",
};

const BAND_COPY: Record<SavingsRateBand, { label: string; meaning: string }> = {
  fragile: {
    label: "Under 5%: limited margin",
    meaning: "There may not be much room for a surprise right now. Even a small automatic amount can be a useful next step.",
  },
  starting: {
    label: "5-10%: starting point",
    meaning: "You are creating some margin. Consistency matters more than forcing a large jump during an expensive season.",
  },
  solid: {
    label: "10-20%: solid",
    meaning: "This pace can support near-term resilience and longer-term goals when it is sustainable.",
  },
  strong: {
    label: "20-35%: strong",
    meaning: "A meaningful share of take-home pay is moving toward future goals. Check that the pace still leaves room for rest and normal life.",
  },
  aggressive: {
    label: "35%+: aggressive",
    meaning: "This is a high savings pace. Confirm that it reflects stable income and a sustainable plan rather than chronic overtime or skipped needs.",
  },
};

export const CalcSavingsRate = () => {
  const { fields, updateField, reset } = useCalculatorFields(DEFAULTS);
  const result = calculateSavingsRate({
    takeHomePay: parseCalculatorValue(fields.takeHomePay),
    fixedExpenses: parseCalculatorValue(fields.fixedExpenses),
    variableExpenses: parseCalculatorValue(fields.variableExpenses),
    retirementContributions: parseCalculatorValue(fields.retirementContributions),
    extraDebtPayments: parseCalculatorValue(fields.extraDebtPayments),
    cashSavings: parseCalculatorValue(fields.cashSavings),
  });
  const band = BAND_COPY[result.band];

  return (
    <>
      <CalculatorFormLayout
        onReset={reset}
        inputTitle="One typical month"
        inputs={(
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorInput label="Monthly take-home pay" prefix="$" value={fields.takeHomePay} onChange={(value) => updateField("takeHomePay", value)} helper="Pay deposited after taxes and payroll deductions." />
            <CalculatorInput label="Fixed expenses" prefix="$" value={fields.fixedExpenses} onChange={(value) => updateField("fixedExpenses", value)} helper="Housing, insurance, minimum debt payments, and other repeating bills." />
            <CalculatorInput label="Variable expenses" prefix="$" value={fields.variableExpenses} onChange={(value) => updateField("variableExpenses", value)} helper="Food, fuel, personal spending, and other changing costs." />
            <CalculatorInput label="Retirement contributions (optional)" prefix="$" value={fields.retirementContributions} onChange={(value) => updateField("retirementContributions", value)} helper="Monthly 403(b), 401(k), IRA, or similar contributions." required={false} />
            <CalculatorInput label="Extra debt payments (optional)" prefix="$" value={fields.extraDebtPayments} onChange={(value) => updateField("extraDebtPayments", value)} helper="Amount above required minimum payments." required={false} />
            <CalculatorInput label="Cash savings and investing" prefix="$" value={fields.cashSavings} onChange={(value) => updateField("cashSavings", value)} helper="Emergency savings, brokerage investing, or other after-paycheck saving." />
          </div>
        )}
        results={(
          <>
            <CalculatorResult label="Cash savings rate" value={formatPercent(result.cashSavingsRate)} emphasis="primary" />
            <CalculatorResult label="Total wealth-building rate" value={formatPercent(result.totalWealthBuildingRate)} helper="Cash savings plus retirement and extra debt payoff, divided by take-home pay." emphasis="accent" />
            <CalculatorResult label="Estimated annual cash savings" value={formatCurrency(result.annualCashSavings)} />
            <CalculatorResult label="Estimated annual wealth building" value={formatCurrency(result.annualWealthBuilding)} />
            <CalculatorMeaning><strong className="text-foreground">{band.label}.</strong> {band.meaning}</CalculatorMeaning>
            {result.monthlyCashFlow < 0 ? (
              <CalculatorNotice tone="caution">
                The expenses, cash savings, and extra debt payments entered exceed take-home pay by about {formatCurrency(Math.abs(result.monthlyCashFlow))} per month. Check for double counting or reduce the planned amounts.
              </CalculatorNotice>
            ) : (
              <CalculatorNotice>
                About {formatCurrency(result.monthlyCashFlow)} remains after the entered expenses, cash savings, and extra debt payments. Retirement may already be withheld before take-home pay.
              </CalculatorNotice>
            )}
          </>
        )}
      />
      <CalculatorDetails
        example={<>A respiratory therapist saving $600 from $5,200 of take-home pay has an 11.5% cash savings rate. Adding $350 of retirement contributions and $200 of extra debt payoff produces a 22.1% total wealth-building rate.</>}
        assumptions={[
          "Cash savings rate equals monthly cash savings divided by take-home pay.",
          "Total wealth-building rate adds retirement contributions and extra debt payoff to cash savings.",
          "Retirement contributions may be deducted before take-home pay, so the total rate is a planning ratio rather than an accounting measure.",
          "The interpretation ranges are guideposts, not grades or universal requirements.",
        ]}
        sources={[SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.investorGov]}
        relatedTools={[
          { label: "Emergency fund", href: "/tools/emergency-fund" },
          { label: "403(b) contribution", href: "/tools/403b-contribution" },
        ]}
      />
    </>
  );
};

export default CalcSavingsRate;
