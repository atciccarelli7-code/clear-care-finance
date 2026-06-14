import type { CalculatorKey } from "@/data/topics";
import { Calc403b, CalcInsurance, CalcMedicare, CalcCafe } from "./Calculators";

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
    default:
      return null;
  }
};
