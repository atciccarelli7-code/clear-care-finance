import { lazy, Suspense } from "react";
import { DecisionJourneyAnalyticsBoundary } from "@/components/readiness/DecisionJourneyAnalyticsBoundary";
import type { ReadinessJourneyId } from "@/lib/decisionJourneyAnalytics";

const WorkplaceBundle = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.ChildcareBenefitsDecisionGuidePage })));
const RothTraditional = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.RothTraditionalDecisionHelperPage })));
const DebtRetirement = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.DebtVsRetirementRouterPage })));
const MedicaidRouter = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.StateMedicaidLongTermCareRouterPage })));
const ObservationGuide = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.ObservationInpatientStatusGuidePage })));
const MedicareChecklist = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.MedicarePlanVerificationChecklistPage })));
const MedicalCostPreparation = lazy(() => import("@/pages/MedicalAppointmentCostPreparationPage"));
const PrivatePaidProductsLab = lazy(() => import("@/pages/PrivatePaidProductsLabPage"));

const Loading = () => (
  <div className="container flex min-h-[45vh] items-center justify-center py-16" role="status" aria-live="polite">
    <span className="text-sm font-semibold text-muted-foreground">Loading decision guide…</span>
  </div>
);

const analyticsIdForSlug = (slug: string): ReadinessJourneyId | null => {
  switch (slug) {
    case "roth-vs-traditional-decision-helper":
      return "roth_traditional";
    case "debt-vs-retirement-router":
      return "debt_retirement";
    case "observation-vs-inpatient-status-guide":
      return "observation_status";
    case "medicare-plan-verification-checklist":
      return "medicare_plan_verification";
    default:
      return null;
  }
};

export const RoadmapToolRouter = ({ slug }: { slug: string }) => {
  const page = (() => {
    switch (slug) {
      case "childcare-benefits-decision-guide": return <WorkplaceBundle />;
      case "roth-vs-traditional-decision-helper": return <RothTraditional />;
      case "debt-vs-retirement-router": return <DebtRetirement />;
      case "state-medicaid-long-term-care-router": return <MedicaidRouter />;
      case "observation-vs-inpatient-status-guide": return <ObservationGuide />;
      case "medicare-plan-verification-checklist": return <MedicareChecklist />;
      case "medical-appointment-cost-preparation": return <MedicalCostPreparation />;
      case "private-paid-product-lab": return <PrivatePaidProductsLab />;
      default: return null;
    }
  })();

  if (!page) return null;

  const journeyId = analyticsIdForSlug(slug);
  const content = journeyId
    ? <DecisionJourneyAnalyticsBoundary journeyId={journeyId}>{page}</DecisionJourneyAnalyticsBoundary>
    : page;

  return <Suspense fallback={<Loading />}>{content}</Suspense>;
};

export default RoadmapToolRouter;
