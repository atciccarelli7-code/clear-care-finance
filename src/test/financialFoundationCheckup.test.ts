import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  FOUNDATION_HISTORY_LIMIT,
  FOUNDATION_STORAGE_KEY,
  calculateFinancialFoundation,
  clearFinancialFoundationSnapshots,
  loadFinancialFoundationSnapshots,
  saveFinancialFoundationSnapshot,
  type FinancialFoundationInputs,
} from "@/lib/financialFoundationCheckup";

const strongInputs: FinancialFoundationInputs = {
  monthlyEssentialExpenses: 4000,
  liquidSavings: 24000,
  debtAprBand: "none",
  retirementMatchStatus: "full",
  savingsAutomationBand: "over_twenty",
  protectionReviewStatus: "reviewed",
  plannedExpenseStatus: "funded",
};

const weakInputs: FinancialFoundationInputs = {
  monthlyEssentialExpenses: 4000,
  liquidSavings: 2000,
  debtAprBand: "over_15",
  retirementMatchStatus: "not_contributing",
  savingsAutomationBand: "none",
  protectionReviewStatus: "due",
  plannedExpenseStatus: "unfunded",
};

describe("Financial Foundation Checkup", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("produces a transparent strong-foundation result", () => {
    const result = calculateFinancialFoundation(strongInputs);

    expect(result.score).toBe(100);
    expect(result.scoreBucket).toBe("strong_foundation");
    expect(result.runwayMonths).toBe(6);
    expect(result.runwayBucket).toBe("six_plus");
    expect(result.domains).toHaveLength(5);
    expect(result.domains.every((domain) => domain.status === "strong")).toBe(true);
    expect(result.recommendedActionIds).toEqual(["wealth_investing_foundations"]);
  });

  it("prioritizes the major weak links without exceeding five actions", () => {
    const result = calculateFinancialFoundation(weakInputs);

    expect(result.score).toBe(16);
    expect(result.scoreBucket).toBe("stabilize");
    expect(result.runwayMonths).toBe(0.5);
    expect(result.runwayBucket).toBe("under_one");
    expect(result.recommendedActionIds).toEqual([
      "wealth_starter_reserve",
      "wealth_high_interest_debt",
      "wealth_capture_match",
      "wealth_cash_flow",
      "benefits_action_plan",
    ]);
  });

  it("stores only the eight most recent valid local snapshots", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-01T12:00:00.000Z"));

    for (let index = 0; index < FOUNDATION_HISTORY_LIMIT + 2; index += 1) {
      const inputs = { ...strongInputs, liquidSavings: 24000 + index * 1000 };
      const result = calculateFinancialFoundation(inputs);
      saveFinancialFoundationSnapshot(inputs, result);
      vi.setSystemTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
    }

    const history = loadFinancialFoundationSnapshots();
    expect(history).toHaveLength(FOUNDATION_HISTORY_LIMIT);
    expect(history[0].inputs.liquidSavings).toBe(33000);
    expect(history.at(-1)?.inputs.liquidSavings).toBe(26000);
  });

  it("rejects malformed storage and clears local history", () => {
    window.localStorage.setItem(FOUNDATION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, snapshots: [{ score: "bad" }] }));
    expect(loadFinancialFoundationSnapshots()).toEqual([]);

    const result = calculateFinancialFoundation(strongInputs);
    saveFinancialFoundationSnapshot(strongInputs, result);
    expect(loadFinancialFoundationSnapshots()).toHaveLength(1);

    clearFinancialFoundationSnapshots();
    expect(window.localStorage.getItem(FOUNDATION_STORAGE_KEY)).toBeNull();
  });
});
