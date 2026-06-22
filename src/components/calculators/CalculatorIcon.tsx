import {
  ChartNoAxesCombined,
  Clock3,
  Coffee,
  CreditCard,
  HeartPulse,
  PiggyBank,
  Shield,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { CalculatorIconName } from "@/data/calculators";

export const CALCULATOR_ICONS: Record<CalculatorIconName, LucideIcon> = {
  wallet: Wallet,
  shield: Shield,
  heart: HeartPulse,
  coffee: Coffee,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
  chart: ChartNoAxesCombined,
  clock: Clock3,
};
