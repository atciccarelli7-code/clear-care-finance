import { describe, expect, it } from "vitest";
import {
  amortizeFixedPayment,
  calculateMonthlyPayment,
  evaluatePrivateStudentLoanDecision,
  evaluatePrivateStudentLoanQuotes,
  type PrivateStudentLoanDecisionInput,
} from "@/lib/privateStudentLoanDecision";

const baseInput: PrivateStudentLoanDecisionInput = {
  loanType: "private",
  principal: 45_000,
  currentApr: 9,
  statedRemainingTermMonths: 138,
  currentMonthlyPayment: 525,
  additionalMonthlyPayment: 0,
  lumpSum: 0,
  quoteMode: "none",
  generatedAt: new Date("2026-07-31T12:00:00Z"),
};

describe("private student-loan amortization", () => {
  it("reconciles the ordinary current schedule and uses a smaller final payment", () => {
    const result = amortizeFixedPayment(45_000, 9, 525);
    expect(result.payoffSafe).toBe(true);
    expect(result.months).toBe(138);
    expect(result.totalInterest).toBeCloseTo(27_343.62, 1);
    expect(result.schedule.at(-1)?.payment).toBeLessThan(525);
    expect(result.schedule.at(-1)?.remainingBalance).toBe(0);
  });

  it("models zero APR and a near-zero balance without fabricating precision", () => {
    expect(calculateMonthlyPayment(1_200, 0, 12)).toBe(100);
    const result = amortizeFixedPayment(0.01, 0, 10);
    expect(result.months).toBe(1);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayments).toBeCloseTo(0.01, 8);
  });

  it("marks a payment at or below monthly interest as not payoff-safe", () => {
    expect(amortizeFixedPayment(10_000, 60, 500).payoffSafe).toBe(false);
    expect(amortizeFixedPayment(10_000, 60, 750).payoffSafe).toBe(true);
  });
});

describe("private student-loan recommendation states", () => {
  it.each(["federal", "mixed", "uncertain"] as const)("blocks %s debt at loan-type verification", (loanType) => {
    const decision = evaluatePrivateStudentLoanDecision({ loanType, generatedAt: baseInput.generatedAt });
    expect(decision.state).toBe("verify_loan_type_first");
    expect(decision.refinanceComparison).toBeUndefined();
    expect(decision.view.firstAction).toMatch(/Federal Student Aid dashboard/i);
  });

  it("continues the current plan when no extra payment or quote is supplied", () => {
    const decision = evaluatePrivateStudentLoanDecision(baseInput);
    expect(decision.state).toBe("continue_current_plan");
    expect(decision.errors).toEqual([]);
    expect(decision.currentPlan?.months).toBe(138);
  });

  it("recommends acceleration only when entered extra payments save time and interest", () => {
    const decision = evaluatePrivateStudentLoanDecision({ ...baseInput, additionalMonthlyPayment: 250 });
    expect(decision.state).toBe("accelerate_repayment");
    expect(decision.plannedCurrentLoan?.months).toBe(77);
    expect(decision.plannedCurrentLoan?.totalInterest).toBeCloseTo(14_306.6, 1);
    expect(decision.timeSavedFromAdditionalPayments).toBe(61);
    expect(decision.interestSavedFromAdditionalPayments).toBeCloseTo(13_037.02, 1);
  });

  it("requests complete quotes rather than treating an advertised rate as a quote", () => {
    const decision = evaluatePrivateStudentLoanDecision({ ...baseInput, quoteMode: "seek" });
    expect(decision.state).toBe("seek_compare_refinance_quotes");
    expect(decision.refinanceComparison).toBeUndefined();
  });

  it("finds a fixed-rate quote that may reduce total cost after fees", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      quoteMode: "compare",
      quote: { apr: 6.5, rateType: "fixed", termMonths: 120, fees: 500 },
    });
    expect(decision.state).toBe("quoted_refinance_may_reduce_total_cost");
    expect(decision.refinanceComparison?.monthlyPayment).toBeCloseTo(510.96, 1);
    expect(decision.refinanceComparison?.totalCostDifference).toBeLessThan(0);
    expect(decision.refinanceComparison?.breakEvenMonth).not.toBeNull();
  });

  it("exposes a lower-payment, higher-total-cost term extension", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      quoteMode: "compare",
      quote: { apr: 8.5, rateType: "fixed", termMonths: 240, fees: 0 },
    });
    expect(decision.state).toBe("lower_payment_higher_total_cost");
    expect(decision.refinanceComparison?.paymentDifference).toBeLessThan(0);
    expect(decision.refinanceComparison?.totalCostDifference).toBeGreaterThan(0);
    expect(decision.view.primaryCaution).toMatch(/monthly-payment relief/i);
  });

  it("rejects a higher-APR quote instead of clamping the loss to zero", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      additionalMonthlyPayment: 250,
      quoteMode: "compare",
      quote: { apr: 12, rateType: "fixed", termMonths: 84, fees: 0 },
    });
    expect(decision.state).toBe("do_not_refinance_based_on_quote");
    expect(decision.refinanceComparison?.totalCostDifference).toBeGreaterThan(0);
    expect(decision.view.interpretation).toMatch(/increases estimated financing cost/i);
  });

  it("flags a nominally lower rate as lower-payment/higher-cost when fees eliminate savings", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      quoteMode: "compare",
      quote: { apr: 6.5, rateType: "fixed", termMonths: 120, fees: 15_000 },
    });
    expect(decision.state).toBe("lower_payment_higher_total_cost");
    expect(decision.refinanceComparison?.totalCostDifference).toBeGreaterThan(0);
  });

  it("surfaces variable-rate uncertainty without treating the quote as fixed", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      quoteMode: "compare",
      quote: { apr: 5.5, rateType: "variable", termMonths: 120, fees: 0 },
    });
    expect(decision.state).toBe("quoted_refinance_may_reduce_total_cost");
    expect(decision.view.primaryCaution).toMatch(/variable/i);
    expect(decision.view.educationalLimitation).toMatch(/held constant/i);
  });

  it("treats an equivalent quote as no demonstrated refinance benefit", () => {
    const payment = calculateMonthlyPayment(45_000, 9, 138);
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      currentMonthlyPayment: payment,
      quoteMode: "compare",
      quote: { apr: 9, rateType: "fixed", termMonths: 138, fees: 0 },
    });
    expect(decision.state).toBe("do_not_refinance_based_on_quote");
    expect(decision.refinanceComparison?.totalCostDifference).toBeCloseTo(0, 6);
    expect(decision.view.interpretation).toMatch(/effectively equivalent/i);
  });

  it("keeps payoff-before-break-even quotes out of the reduce-cost state", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      currentMonthlyPayment: 2_500,
      statedRemainingTermMonths: 20,
      quoteMode: "compare",
      quote: { apr: 3, rateType: "fixed", termMonths: 240, fees: 3_000 },
    });
    expect(decision.refinanceComparison?.plannedPayoffBeforeBreakEven).toBe(true);
    expect(decision.state).not.toBe("quoted_refinance_may_reduce_total_cost");
  });

  it("fails closed when an extreme quoted rate and term cannot produce a payoff-safe schedule", () => {
    const decision = evaluatePrivateStudentLoanDecision({
      ...baseInput,
      quoteMode: "compare",
      quote: { apr: 100, rateType: "fixed", termMonths: 1_200, fees: 0 },
    });

    expect(decision.state).toBe("insufficient_information");
    expect(decision.errors.map((error) => error.code)).toContain("quote_payment_not_payoff_safe");
    expect(decision.refinanceComparison).toBeUndefined();
    expect(decision.view.metricGroups.map((group) => group.title)).not.toContain("Compared refinance quote");
    expect(decision.view.portableSummary).not.toContain("$0 total repayment");
  });

  it("supports multiple quote evaluations without quote-specific UI logic", () => {
    const decisions = evaluatePrivateStudentLoanQuotes(baseInput, [
      { apr: 6, rateType: "fixed", termMonths: 120, fees: 0 },
      { apr: 12, rateType: "fixed", termMonths: 120, fees: 0 },
    ]);
    expect(decisions).toHaveLength(2);
    expect(decisions[0].state).toBe("quoted_refinance_may_reduce_total_cost");
    expect(decisions[1].state).toBe("do_not_refinance_based_on_quote");
  });
});

describe("private student-loan validation and portable output", () => {
  it.each([
    { principal: 0 },
    { principal: -1 },
    { principal: Number.NaN },
    { currentApr: Number.POSITIVE_INFINITY },
    { currentApr: -1 },
    { currentMonthlyPayment: 0 },
    { additionalMonthlyPayment: -1 },
    { lumpSum: 50_000 },
    { statedRemainingTermMonths: 0 },
    { statedRemainingTermMonths: 12.5 },
  ])("fails closed for malformed or extreme input %#", (override) => {
    const decision = evaluatePrivateStudentLoanDecision({ ...baseInput, ...override });
    expect(decision.state).toBe("insufficient_information");
    expect(decision.errors.length).toBeGreaterThan(0);
  });

  it("rejects a missing complete quote", () => {
    const decision = evaluatePrivateStudentLoanDecision({ ...baseInput, quoteMode: "compare", quote: undefined });
    expect(decision.state).toBe("insufficient_information");
    expect(decision.errors.map((error) => error.code)).toContain("quote_required");
  });

  it("builds a dated, educational portable summary with assumptions and verification", () => {
    const decision = evaluatePrivateStudentLoanDecision({ ...baseInput, additionalMonthlyPayment: 250 });
    expect(decision.view.portableSummary).toContain("Generated: Jul 31, 2026");
    expect(decision.view.portableSummary).toContain("Current principal: $45,000");
    expect(decision.view.portableSummary).toContain("RECOMMENDATION STATE: Accelerate repayment");
    expect(decision.view.portableSummary).toContain("VERIFICATION CHECKLIST");
    expect(decision.view.portableSummary).toContain("Educational estimate only");
    expect(decision.view.portableSummary).not.toMatch(/name|email|account number/i);
  });
});
