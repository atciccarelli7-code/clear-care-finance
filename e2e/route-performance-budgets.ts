export type RoutePerformanceBudget = {
  group: "entry_hub" | "flagship_journey" | "calculator_workspace" | "article_topic" | "medicare_cost_hub" | "trust_legal";
  path: string;
  lcpMs: number;
  cls: number;
  longTaskMs: number;
  javascriptBytes: number;
  totalBytes: number;
  requestCount: number;
};

// Calibrated July 16, 2026 from a clean production-style local build at 390px.
// Budgets add route-specific variance headroom to catch regressions; they are not field Core Web Vitals claims.
export const ROUTE_PERFORMANCE_BUDGETS: RoutePerformanceBudget[] = [
  { group: "entry_hub", path: "/", lcpMs: 900, cls: 0.05, longTaskMs: 400, javascriptBytes: 390_000, totalBytes: 410_000, requestCount: 52 },
  { group: "flagship_journey", path: "/tools/medical-appointment-cost-preparation", lcpMs: 650, cls: 0.05, longTaskMs: 300, javascriptBytes: 270_000, totalBytes: 290_000, requestCount: 45 },
  { group: "calculator_workspace", path: "/start-here", lcpMs: 900, cls: 0.05, longTaskMs: 450, javascriptBytes: 250_000, totalBytes: 270_000, requestCount: 40 },
  { group: "article_topic", path: "/articles/deductible-copay-coinsurance-out-of-pocket-max", lcpMs: 900, cls: 0.05, longTaskMs: 750, javascriptBytes: 590_000, totalBytes: 630_000, requestCount: 40 },
  { group: "medicare_cost_hub", path: "/medicare-care-costs", lcpMs: 950, cls: 0.05, longTaskMs: 500, javascriptBytes: 210_000, totalBytes: 230_000, requestCount: 28 },
  { group: "trust_legal", path: "/disclosures", lcpMs: 500, cls: 0.05, longTaskMs: 250, javascriptBytes: 190_000, totalBytes: 210_000, requestCount: 18 },
];
