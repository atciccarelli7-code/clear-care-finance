import { useLocation } from "react-router-dom";
import { ContentFreshness, type ContentFreshnessProps } from "./ContentFreshness";

const ROUTE_FRESHNESS: Record<string, ContentFreshnessProps> = {
  "/medicare-care-costs": {
    lastReviewedAt: "2026-07-12",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "2026 Medicare cost anchors, program distinctions, official-source links, and educational limitations.",
  },
  "/medicare-care-costs/turning-65": {
    publishedAt: "2026-07-12",
    lastReviewedAt: "2026-07-12",
    rulesEffectiveAt: "2026-07-12",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "Medicare.gov enrollment timing, active-employment questions, HSA warnings, Part D creditable coverage, and Medigap timing.",
  },
  "/student-loans": {
    lastReviewedAt: "2026-07-12",
    nextReviewAt: "2026-08-01",
    timeSensitive: true,
    reviewScope: "Program links, decision boundaries, and warnings to verify current federal repayment and application status before acting.",
    updateNote: "Federal repayment programs and HRSA application windows can change quickly; official program portals control.",
  },
  "/open-enrollment": {
    lastReviewedAt: "2026-07-12",
    nextReviewAt: "2026-09-01",
    timeSensitive: true,
    reviewScope: "Plan-comparison sequence, verification steps, and employer-election workflow.",
  },
  "/tools/employer-benefits-action-plan": {
    lastReviewedAt: "2026-07-10",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "2026 IRS retirement and HSA limits plus plan-document verification boundaries.",
  },
  "/tools/medicare-medicaid-eligibility-check": {
    lastReviewedAt: "2026-07-12",
    nextReviewAt: "2026-09-01",
    timeSensitive: true,
    reviewScope: "Federal screening rules and state-agency handoffs; state determinations remain controlling.",
  },
  "/tools/prior-authorization-next-step-guide": {
    lastReviewedAt: "2026-07-12",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "Coverage-type routing, notice-based escalation, and official appeal resources.",
  },
  "/insurance/hospital-discharge-coverage": {
    lastReviewedAt: "2026-07-12",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "Medicare discharge coverage anchors, skilled-versus-custodial distinctions, and payer verification steps.",
  },
  "/insurance/medical-bill-review-toolkit": {
    lastReviewedAt: "2026-07-12",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "Federal medical-bill rights resources, financial-assistance workflow, and safe local tracking boundaries.",
  },
};

export const RouteFreshness = () => {
  const { pathname } = useLocation();
  const freshness = ROUTE_FRESHNESS[pathname];
  if (!freshness) return null;
  return (
    <div className="container pt-5 print:hidden">
      <ContentFreshness {...freshness} compact />
    </div>
  );
};

export { ROUTE_FRESHNESS };
