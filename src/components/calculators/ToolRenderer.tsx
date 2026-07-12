import { CalcCafe, CalcMedicare } from "@/components/calculators/Calculators";
import HealthInsuranceVisitCostCalculator from "@/components/calculators/HealthInsuranceVisitCostCalculator";
import HsaFsaDecisionHelper from "@/components/calculators/HsaFsaDecisionHelper";
import {
  FinancialAssistanceChecklist,
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
      return <FinancialAssistanceChecklist />;
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
