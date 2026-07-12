import { lazy, Suspense } from "react";
import { CalcCafe, CalcMedicare } from "@/components/calculators/Calculators";
import HealthInsuranceVisitCostCalculator from "@/components/calculators/HealthInsuranceVisitCostCalculator";
import HsaFsaDecisionHelper from "@/components/calculators/HsaFsaDecisionHelper";
import {
  HospitalBillChecklistTool,
  OpenEnrollmentChecklistTool,
} from "@/components/calculators/LaunchChecklistTools";
import CalcLoanPayment from "@/components/calculators/LoanPayment";
import {
  OpenEnrollmentPaycheckImpactCalculator,
  SupplementalBenefitsDecisionHelper,
} from "@/components/calculators/OpenEnrollmentTools";
import CalcOvertimeDeduction from "@/components/calculators/OvertimeDeduction";
import {
  PSLFProgressEstimator,
  PrivateLoanPayoffCalculator,
  StudentLoanPathFinder,
} from "@/components/calculators/StudentLoanTools";
import type { ToolComponentKey } from "@/data/tools";

const FinancialAssistanceScreeningTool = lazy(
  () => import("@/components/calculators/FinancialAssistanceScreeningTool"),
);

const ToolLoadingFallback = () => (
  <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-muted/20 p-6" role="status">
    <span className="text-sm font-semibold text-muted-foreground">Loading tool…</span>
  </div>
);

export const ToolRenderer = ({ componentKey }: { componentKey: ToolComponentKey }) => {
  switch (componentKey) {
    case "openEnrollmentChecklist":
      return <OpenEnrollmentChecklistTool />;
    case "paycheckImpact":
      return <OpenEnrollmentPaycheckImpactCalculator />;
    case "supplementalBenefits":
      return <SupplementalBenefitsDecisionHelper />;
    case "hsaFsa":
      return <HsaFsaDecisionHelper />;
    case "hospitalBillChecklist":
      return <HospitalBillChecklistTool />;
    case "financialAssistanceChecklist":
      return (
        <Suspense fallback={<ToolLoadingFallback />}>
          <FinancialAssistanceScreeningTool />
        </Suspense>
      );
    case "insuranceVisitCost":
      return <HealthInsuranceVisitCostCalculator />;
    case "overtimeDeduction":
      return <CalcOvertimeDeduction />;
    case "studentLoanPath":
      return <StudentLoanPathFinder />;
    case "privateLoanPayoff":
      return <PrivateLoanPayoffCalculator />;
    case "pslfProgress":
      return <PSLFProgressEstimator />;
    case "loanPayment":
      return <CalcLoanPayment />;
    case "medicareCost":
      return <CalcMedicare />;
    case "cafeSavings":
      return <CalcCafe />;
    default:
      return null;
  }
};
