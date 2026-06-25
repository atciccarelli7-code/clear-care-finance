import type { ToolComponentKey } from "@/data/tools";
import { Calc403b, CalcInsurance, CalcMedicare, CalcCafe } from "@/components/calculators/Calculators";
import CalcLoanPayment from "@/components/calculators/LoanPayment";
import CalcOvertimeDeduction from "@/components/calculators/OvertimeDeduction";
import HsaFsaDecisionHelper from "@/components/calculators/HsaFsaDecisionHelper";
import {
  OpenEnrollmentPaycheckImpactCalculator,
  OpenEnrollmentTrueCostCalculator,
  SupplementalBenefitsDecisionHelper,
} from "@/components/calculators/OpenEnrollmentTools";
import {
  EobBillMatchChecker,
  FinancialAssistanceChecklist,
  HospitalBillChecklistTool,
  OpenEnrollmentChecklistTool,
} from "@/components/calculators/LaunchChecklistTools";

export const ToolRenderer = ({ toolKey }: { toolKey: ToolComponentKey }) => {
  switch (toolKey) {
    case "openEnrollmentChecklist":
      return <OpenEnrollmentChecklistTool />;
    case "hospitalBillReview":
      return <HospitalBillChecklistTool />;
    case "eobBillMatch":
      return <EobBillMatchChecker />;
    case "financialAssistanceChecklist":
      return <FinancialAssistanceChecklist />;
    case "calc403b":
      return <Calc403b />;
    case "overtimeDeduction":
      return <CalcOvertimeDeduction />;
    case "insuranceVisitCost":
      return <CalcInsurance />;
    case "openEnrollmentTrueCost":
      return <OpenEnrollmentTrueCostCalculator />;
    case "openEnrollmentPaycheckImpact":
      return <OpenEnrollmentPaycheckImpactCalculator />;
    case "supplementalBenefits":
      return <SupplementalBenefitsDecisionHelper />;
    case "hsaVsFsa":
      return <HsaFsaDecisionHelper />;
    case "medicareCostExposure":
      return <CalcMedicare />;
    case "hospitalCafeSavings":
      return <CalcCafe />;
    case "studentLoanPayment":
      return <CalcLoanPayment />;
    default:
      return null;
  }
};
