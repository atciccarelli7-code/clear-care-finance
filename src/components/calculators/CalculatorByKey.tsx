import type { CalculatorKey } from "@/data/topics";
import { Calc403b } from "./ContributionGoal";
import { CalcCafe } from "./CafeSpending";
import { CalcEmergencyFund } from "./EmergencyFund";
import { CalcInsurance } from "./HospitalBillEstimator";
import { CalcMedicare } from "./MedicareCosts";
import { CalcOvertime } from "./OvertimeBurnout";
import { CalcSavingsRate } from "./SavingsRate";
import CalcLoanPayment from "./LoanPayment";

export const CalculatorByKey = ({ k }: { k: CalculatorKey }) => {
  switch (k) {
    case "calc403b":
      return <Calc403b />;
    case "calcInsurance":
      return <CalcInsurance />;
    case "calcMedicare":
      return <CalcMedicare />;
    case "calcCafe":
      return <CalcCafe />;
    case "calcLoan":
      return <CalcLoanPayment />;
    case "calcEmergencyFund":
      return <CalcEmergencyFund />;
    case "calcSavingsRate":
      return <CalcSavingsRate />;
    case "calcOvertime":
      return <CalcOvertime />;
    default:
      return null;
  }
};
