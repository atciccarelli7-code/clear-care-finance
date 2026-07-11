export type DebtAprBand = "none" | "under_8" | "eight_to_fifteen" | "over_15" | "unsure";
export type RetirementMatchStatus = "full" | "partial" | "not_contributing" | "not_offered" | "unsure";
export type SavingsAutomationBand = "none" | "irregular" | "under_ten" | "ten_to_twenty" | "over_twenty" | "unsure";
export type ProtectionReviewStatus = "reviewed" | "partial" | "due" | "unsure";
export type PlannedExpenseStatus = "none" | "funded" | "partly_funded" | "unfunded" | "unsure";
export type FoundationDomainId = "cash" | "debt" | "retirement" | "automation" | "protection";
export type FoundationDomainStatus = "strong" | "building" | "priority";
export type FoundationScoreBucket = "strong_foundation" | "building" | "attention" | "stabilize";
export type FoundationRunwayBucket = "under_one" | "one_to_three" | "three_to_six" | "six_plus" | "not_calculated";

export interface FinancialFoundationInputs {
  monthlyEssentialExpenses: number;
  liquidSavings: number;
  debtAprBand: DebtAprBand;
  retirementMatchStatus: RetirementMatchStatus;
  savingsAutomationBand: SavingsAutomationBand;
  protectionReviewStatus: ProtectionReviewStatus;
  plannedExpenseStatus: PlannedExpenseStatus;
}

export interface FoundationDomainResult {
  id: FoundationDomainId;
  label: string;
  score: number;
  maxScore: number;
  status: FoundationDomainStatus;
  explanation: string;
}

export interface FinancialFoundationResult {
  score: number;
  scoreBucket: FoundationScoreBucket;
  runwayMonths: number | null;
  runwayBucket: FoundationRunwayBucket;
  statusLabel: string;
  summary: string;
  domains: FoundationDomainResult[];
  recommendedActionIds: string[];
}

export interface FinancialFoundationSnapshot {
  schemaVersion: 1;
  savedAt: string;
  score: number;
  scoreBucket: FoundationScoreBucket;
  runwayMonths: number | null;
  runwayBucket: FoundationRunwayBucket;
  domainScores: Record<FoundationDomainId, number>;
  inputs: FinancialFoundationInputs;
}

interface FinancialFoundationHistory {
  schemaVersion: 1;
  snapshots: FinancialFoundationSnapshot[];
}

export const FOUNDATION_STORAGE_KEY = "caf-financial-foundation-checkup-v1";
export const FOUNDATION_HISTORY_LIMIT = 8;
export const FOUNDATION_UPDATED_EVENT = "caf-financial-foundation-checkup-updated";

export const DEFAULT_FOUNDATION_INPUTS: FinancialFoundationInputs = {
  monthlyEssentialExpenses: 0,
  liquidSavings: 0,
  debtAprBand: "unsure",
  retirementMatchStatus: "unsure",
  savingsAutomationBand: "unsure",
  protectionReviewStatus: "unsure",
  plannedExpenseStatus: "unsure",
};

const validDebtBands: DebtAprBand[] = ["none", "under_8", "eight_to_fifteen", "over_15", "unsure"];
const validMatchStatuses: RetirementMatchStatus[] = ["full", "partial", "not_contributing", "not_offered", "unsure"];
const validAutomationBands: SavingsAutomationBand[] = ["none", "irregular", "under_ten", "ten_to_twenty", "over_twenty", "unsure"];
const validProtectionStatuses: ProtectionReviewStatus[] = ["reviewed", "partial", "due", "unsure"];
const validPlannedExpenseStatuses: PlannedExpenseStatus[] = ["none", "funded", "partly_funded", "unfunded", "unsure"];
const domainIds: FoundationDomainId[] = ["cash", "debt", "retirement", "automation", "protection"];
const scoreBuckets: FoundationScoreBucket[] = ["strong_foundation", "building", "attention", "stabilize"];
const runwayBuckets: FoundationRunwayBucket[] = ["under_one", "one_to_three", "three_to_six", "six_plus", "not_calculated"];

const safeMoney = (value: number) => (Number.isFinite(value) && value >= 0 ? value : 0);
const roundOne = (value: number) => Math.round(value * 10) / 10;

const domainStatus = (score: number, maxScore: number): FoundationDomainStatus => {
  const ratio = maxScore ? score / maxScore : 0;
  if (ratio >= 0.8) return "strong";
  if (ratio >= 0.5) return "building";
  return "priority";
};

const scoreBucketFor = (score: number): FoundationScoreBucket => {
  if (score >= 85) return "strong_foundation";
  if (score >= 65) return "building";
  if (score >= 45) return "attention";
  return "stabilize";
};

const runwayBucketFor = (runwayMonths: number | null): FoundationRunwayBucket => {
  if (runwayMonths === null) return "not_calculated";
  if (runwayMonths < 1) return "under_one";
  if (runwayMonths < 3) return "one_to_three";
  if (runwayMonths < 6) return "three_to_six";
  return "six_plus";
};

const resultCopy = (bucket: FoundationScoreBucket) => {
  if (bucket === "strong_foundation") {
    return {
      statusLabel: "Strong foundation",
      summary: "Your core systems look durable. Maintain them and direct new capacity toward long-term flexibility rather than adding complexity.",
    };
  }
  if (bucket === "building") {
    return {
      statusLabel: "Building well",
      summary: "The foundation is working, but one or two weak links still deserve attention before you optimize the rest.",
    };
  }
  if (bucket === "attention") {
    return {
      statusLabel: "Needs focused attention",
      summary: "The foundation is workable but exposed. Start with the lowest-scoring domain and make one repeatable improvement at a time.",
    };
  }
  return {
    statusLabel: "Stabilize first",
    summary: "Prioritize liquidity, expensive debt, available employer compensation, and a repeatable savings system before pursuing more advanced goals.",
  };
};

export const calculateFinancialFoundation = (rawInputs: FinancialFoundationInputs): FinancialFoundationResult => {
  const inputs: FinancialFoundationInputs = {
    ...rawInputs,
    monthlyEssentialExpenses: safeMoney(rawInputs.monthlyEssentialExpenses),
    liquidSavings: safeMoney(rawInputs.liquidSavings),
  };

  const runwayMonths = inputs.monthlyEssentialExpenses > 0
    ? roundOne(inputs.liquidSavings / inputs.monthlyEssentialExpenses)
    : null;

  const runwayScore = runwayMonths === null
    ? 0
    : runwayMonths >= 6
      ? 20
      : runwayMonths >= 3
        ? 17
        : runwayMonths >= 1
          ? 11
          : runwayMonths > 0
            ? 5
            : 0;

  const plannedExpenseScore: Record<PlannedExpenseStatus, number> = {
    none: 5,
    funded: 5,
    partly_funded: 3,
    unfunded: 0,
    unsure: 2,
  };

  const debtScore: Record<DebtAprBand, number> = {
    none: 20,
    under_8: 16,
    eight_to_fifteen: 10,
    over_15: 3,
    unsure: 8,
  };

  const retirementScore: Record<RetirementMatchStatus, number> = {
    full: 20,
    partial: 13,
    not_contributing: 4,
    not_offered: 12,
    unsure: 7,
  };

  const automationScore: Record<SavingsAutomationBand, number> = {
    none: 0,
    irregular: 6,
    under_ten: 11,
    ten_to_twenty: 16,
    over_twenty: 20,
    unsure: 5,
  };

  const protectionScore: Record<ProtectionReviewStatus, number> = {
    reviewed: 15,
    partial: 10,
    due: 4,
    unsure: 3,
  };

  const domainValues: Array<Omit<FoundationDomainResult, "status">> = [
    {
      id: "cash",
      label: "Cash resilience",
      score: runwayScore + plannedExpenseScore[inputs.plannedExpenseStatus],
      maxScore: 25,
      explanation: runwayMonths === null
        ? "Enter monthly essential expenses to calculate cash runway."
        : `Liquid savings cover about ${runwayMonths.toFixed(1)} month${runwayMonths === 1 ? "" : "s"} of essential expenses, before considering any planned large expense.`,
    },
    {
      id: "debt",
      label: "Costly debt exposure",
      score: debtScore[inputs.debtAprBand],
      maxScore: 20,
      explanation: inputs.debtAprBand === "none"
        ? "No high-cost debt was identified in this checkup."
        : "The highest borrowing-cost band determines how urgently debt competes with saving and investing.",
    },
    {
      id: "retirement",
      label: "Employer retirement capture",
      score: retirementScore[inputs.retirementMatchStatus],
      maxScore: 20,
      explanation: inputs.retirementMatchStatus === "not_offered"
        ? "No employer match was reported, so the score does not treat an unavailable benefit as a failure."
        : "This domain measures whether available employer retirement compensation is being captured and understood.",
    },
    {
      id: "automation",
      label: "Savings consistency",
      score: automationScore[inputs.savingsAutomationBand],
      maxScore: 20,
      explanation: "A recurring savings or investing system is weighted more heavily than occasional transfers because repeatability compounds.",
    },
    {
      id: "protection",
      label: "Protection review",
      score: protectionScore[inputs.protectionReviewStatus],
      maxScore: 15,
      explanation: "Health coverage, disability protection, life insurance needs, beneficiaries, and basic documents should be reviewed periodically and after major life changes.",
    },
  ];

  const domains = domainValues.map((domain) => ({
    ...domain,
    status: domainStatus(domain.score, domain.maxScore),
  }));

  const score = domains.reduce((total, domain) => total + domain.score, 0);
  const scoreBucket = scoreBucketFor(score);
  const recommendedActionIds: string[] = [];
  const addAction = (id: string) => {
    if (!recommendedActionIds.includes(id)) recommendedActionIds.push(id);
  };

  if (domains.find((domain) => domain.id === "cash")!.score < 20) addAction("wealth_starter_reserve");
  if (domains.find((domain) => domain.id === "debt")!.score < 16) addAction("wealth_high_interest_debt");
  if (domains.find((domain) => domain.id === "retirement")!.score < 16) addAction("wealth_capture_match");
  if (domains.find((domain) => domain.id === "automation")!.score < 16) addAction("wealth_cash_flow");
  if (domains.find((domain) => domain.id === "protection")!.score < 12) addAction("benefits_action_plan");
  if (!recommendedActionIds.length) addAction("wealth_investing_foundations");

  const copy = resultCopy(scoreBucket);
  return {
    score,
    scoreBucket,
    runwayMonths,
    runwayBucket: runwayBucketFor(runwayMonths),
    statusLabel: copy.statusLabel,
    summary: copy.summary,
    domains,
    recommendedActionIds: recommendedActionIds.slice(0, 5),
  };
};

const isValidInputs = (value: unknown): value is FinancialFoundationInputs => {
  if (!value || typeof value !== "object") return false;
  const inputs = value as Partial<FinancialFoundationInputs>;
  return typeof inputs.monthlyEssentialExpenses === "number"
    && Number.isFinite(inputs.monthlyEssentialExpenses)
    && inputs.monthlyEssentialExpenses >= 0
    && typeof inputs.liquidSavings === "number"
    && Number.isFinite(inputs.liquidSavings)
    && inputs.liquidSavings >= 0
    && validDebtBands.includes(inputs.debtAprBand as DebtAprBand)
    && validMatchStatuses.includes(inputs.retirementMatchStatus as RetirementMatchStatus)
    && validAutomationBands.includes(inputs.savingsAutomationBand as SavingsAutomationBand)
    && validProtectionStatuses.includes(inputs.protectionReviewStatus as ProtectionReviewStatus)
    && validPlannedExpenseStatuses.includes(inputs.plannedExpenseStatus as PlannedExpenseStatus);
};

const isValidSnapshot = (value: unknown): value is FinancialFoundationSnapshot => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<FinancialFoundationSnapshot>;
  const domainScores = snapshot.domainScores;
  return snapshot.schemaVersion === 1
    && typeof snapshot.savedAt === "string"
    && typeof snapshot.score === "number"
    && snapshot.score >= 0
    && snapshot.score <= 100
    && scoreBuckets.includes(snapshot.scoreBucket as FoundationScoreBucket)
    && (snapshot.runwayMonths === null || (typeof snapshot.runwayMonths === "number" && Number.isFinite(snapshot.runwayMonths) && snapshot.runwayMonths >= 0))
    && runwayBuckets.includes(snapshot.runwayBucket as FoundationRunwayBucket)
    && Boolean(domainScores)
    && domainIds.every((id) => typeof domainScores?.[id] === "number")
    && isValidInputs(snapshot.inputs);
};

const emitUpdated = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(FOUNDATION_UPDATED_EVENT));
};

export const loadFinancialFoundationSnapshots = (): FinancialFoundationSnapshot[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FOUNDATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<FinancialFoundationHistory>;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.snapshots)) return [];
    return parsed.snapshots.filter(isValidSnapshot).slice(0, FOUNDATION_HISTORY_LIMIT);
  } catch {
    return [];
  }
};

export const saveFinancialFoundationSnapshot = (
  inputs: FinancialFoundationInputs,
  result: FinancialFoundationResult,
): FinancialFoundationSnapshot => {
  const snapshot: FinancialFoundationSnapshot = {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    score: result.score,
    scoreBucket: result.scoreBucket,
    runwayMonths: result.runwayMonths,
    runwayBucket: result.runwayBucket,
    domainScores: Object.fromEntries(result.domains.map((domain) => [domain.id, domain.score])) as Record<FoundationDomainId, number>,
    inputs: {
      ...inputs,
      monthlyEssentialExpenses: safeMoney(inputs.monthlyEssentialExpenses),
      liquidSavings: safeMoney(inputs.liquidSavings),
    },
  };

  if (typeof window !== "undefined") {
    const history: FinancialFoundationHistory = {
      schemaVersion: 1,
      snapshots: [snapshot, ...loadFinancialFoundationSnapshots()].slice(0, FOUNDATION_HISTORY_LIMIT),
    };
    window.localStorage.setItem(FOUNDATION_STORAGE_KEY, JSON.stringify(history));
    emitUpdated();
  }

  return snapshot;
};

export const clearFinancialFoundationSnapshots = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FOUNDATION_STORAGE_KEY);
  emitUpdated();
};
