import { lazy, Suspense } from "react";

const WorkplaceBundle = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.ChildcareBenefitsDecisionGuidePage })));
const RothTraditional = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.RothTraditionalDecisionHelperPage })));
const DebtRetirement = lazy(() => import("@/pages/WorkplaceDecisionToolsBundle").then((module) => ({ default: module.DebtVsRetirementRouterPage })));
const MedicaidRouter = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.StateMedicaidLongTermCareRouterPage })));
const ObservationGuide = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.ObservationInpatientStatusGuidePage })));
const MedicareChecklist = lazy(() => import("@/pages/CareDecisionToolsBundle").then((module) => ({ default: module.MedicarePlanVerificationChecklistPage })));

const Loading = () => (
  <div className="container flex min-h-[45vh] items-center justify-center py-16" role="status" aria-live="polite">
    <span className="text-sm font-semibold text-muted-foreground">Loading decision guide…</span>
  </div>
);

export const RoadmapToolRouter = ({ slug }: { slug: string }) => {
  const page = (() => {
    switch (slug) {
      case "childcare-benefits-decision-guide": return <WorkplaceBundle />;
      case "roth-vs-traditional-decision-helper": return <RothTraditional />;
      case "debt-vs-retirement-router": return <DebtRetirement />;
      case "state-medicaid-long-term-care-router": return <MedicaidRouter />;
      case "observation-vs-inpatient-status-guide": return <ObservationGuide />;
      case "medicare-plan-verification-checklist": return <MedicareChecklist />;
      default: return null;
    }
  })();

  return page ? <Suspense fallback={<Loading />}>{page}</Suspense> : null;
};

export default RoadmapToolRouter;
