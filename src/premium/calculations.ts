import { premiumModuleKeys, type PremiumModuleKey, type WorkspaceState } from "./contracts.js";

const finite = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export type CompensationInputs = {
  payType: "hourly" | "salary";
  basePay: number;
  annualHours?: number;
  overtimeHours?: number;
  overtimeMultiplier?: number;
  shiftDifferentialPerHour?: number;
  differentialHours?: number;
  bonus?: number;
  callPay?: number;
  weekendHolidayPay?: number;
};

export const calculateAnnualCompensation = (input: CompensationInputs) => {
  const annualHours = input.payType === "hourly" ? Math.max(0, finite(input.annualHours)) : 0;
  const base = input.payType === "salary" ? Math.max(0, finite(input.basePay)) : Math.max(0, finite(input.basePay)) * annualHours;
  const overtime =
    input.payType === "hourly"
      ? Math.max(0, finite(input.overtimeHours)) * Math.max(0, finite(input.basePay)) * Math.max(1, finite(input.overtimeMultiplier) || 1.5)
      : 0;
  const shiftDifferential = Math.max(0, finite(input.shiftDifferentialPerHour)) * Math.max(0, finite(input.differentialHours));
  const conditional = overtime + shiftDifferential + Math.max(0, finite(input.bonus)) + Math.max(0, finite(input.callPay)) + Math.max(0, finite(input.weekendHolidayPay));
  const warnings = [
    ...(input.payType === "hourly" && annualHours === 0 ? ["Expected annual hours are required for an hourly estimate."] : []),
    ...(conditional > base && base > 0 ? ["Conditional compensation is larger than base compensation; verify the assumptions before relying on this estimate."] : []),
  ];
  return { base, overtime, shiftDifferential, conditional, estimatedAnnualGross: base + conditional, warnings };
};

export type BenefitValue = {
  amount?: number;
  valueType: "known" | "estimated" | "unknown" | "non-cash";
  requiresVerification?: boolean;
};

export const calculateBenefitValue = (items: BenefitValue[]) => ({
  known: items.filter((item) => item.valueType === "known").reduce((total, item) => total + Math.max(0, finite(item.amount)), 0),
  estimated: items.filter((item) => item.valueType === "estimated").reduce((total, item) => total + Math.max(0, finite(item.amount)), 0),
  unknownCount: items.filter((item) => item.valueType === "unknown").length,
  nonCashCount: items.filter((item) => item.valueType === "non-cash").length,
  verificationCount: items.filter((item) => item.requiresVerification || item.valueType === "unknown").length,
});

export type HealthPlanInput = {
  annualEmployeePremium: number;
  deductible: number;
  coinsurancePercent: number;
  copays: number;
  outOfPocketMaximum: number;
  employerAccountContribution: number;
  expectedAllowedCosts: number;
};

export const calculateHealthPlanScenarios = (input: HealthPlanInput) => {
  const premium = Math.max(0, finite(input.annualEmployeePremium));
  const employer = Math.max(0, finite(input.employerAccountContribution));
  const deductible = Math.max(0, finite(input.deductible));
  const oopMax = Math.max(0, finite(input.outOfPocketMaximum));
  const coinsurance = Math.min(100, Math.max(0, finite(input.coinsurancePercent))) / 100;
  const copays = Math.max(0, finite(input.copays));
  const expectedAllowed = Math.max(0, finite(input.expectedAllowedCosts));
  const expectedCostShare = Math.min(oopMax, Math.min(expectedAllowed, deductible) + Math.max(0, expectedAllowed - deductible) * coinsurance + copays);
  const annual = (costShare: number) => Math.max(0, premium + Math.max(0, costShare) - employer);
  return {
    lowUse: annual(copays),
    expectedUse: annual(expectedCostShare),
    highUse: annual(oopMax),
    warning: "Planning estimates do not determine official coverage, network status, medical necessity, claim liability, or plan interpretation.",
  };
};

export type RetirementInput = {
  eligibleCompensation: number;
  employeeContributionPercent: number;
  matchPercent: number;
  matchLimitPercent: number;
  nonelectivePercent: number;
  vestedPercent: number;
  waitingPeriodMonths?: number;
};

export const calculateRetirementValue = (input: RetirementInput) => {
  const compensation = Math.max(0, finite(input.eligibleCompensation));
  const employeeRate = Math.max(0, finite(input.employeeContributionPercent)) / 100;
  const matchRate = Math.max(0, finite(input.matchPercent)) / 100;
  const limitRate = Math.max(0, finite(input.matchLimitPercent)) / 100;
  const nonelectiveRate = Math.max(0, finite(input.nonelectivePercent)) / 100;
  const eligibleEmployeeContribution = compensation * Math.min(employeeRate, limitRate);
  const employerMatch = eligibleEmployeeContribution * matchRate;
  const nonelective = compensation * nonelectiveRate;
  const annualEmployerValue = employerMatch + nonelective;
  const vestedPercent = Math.min(100, Math.max(0, finite(input.vestedPercent)));
  const immediatelyVestedValue = annualEmployerValue * (vestedPercent / 100);
  return {
    employeeContribution: compensation * employeeRate,
    employerMatch,
    nonelective,
    annualEmployerValue,
    immediatelyVestedValue,
    conditionalUnvestedValue: annualEmployerValue - immediatelyVestedValue,
    potentialForfeitureRisk: vestedPercent < 100 || Math.max(0, finite(input.waitingPeriodMonths)) > 0,
  };
};

export type TradeoffRating = { id: string; importance: number; optionA: number; optionB: number };

export const calculateTransparentTradeoffScore = (ratings: TradeoffRating[]) => {
  const normalized = ratings.map((rating) => ({
    ...rating,
    importance: Math.min(5, Math.max(0, finite(rating.importance))),
    optionA: Math.min(5, Math.max(0, finite(rating.optionA))),
    optionB: Math.min(5, Math.max(0, finite(rating.optionB))),
  }));
  const totalWeight = normalized.reduce((total, rating) => total + rating.importance, 0);
  const weightedA = normalized.reduce((total, rating) => total + rating.optionA * rating.importance, 0);
  const weightedB = normalized.reduce((total, rating) => total + rating.optionB * rating.importance, 0);
  return {
    optionA: totalWeight ? weightedA / totalWeight : 0,
    optionB: totalWeight ? weightedB / totalWeight : 0,
    formula: "Each rating (0–5) × its stated importance (0–5), divided by total importance. This is an organizing aid, not an objective verdict.",
    rows: normalized,
  };
};

export const calculateProgress = (completed: PremiumModuleKey[]) =>
  Math.round((new Set(completed).size / premiumModuleKeys.length) * 100);

export type DecisionObservation = { level: "information" | "warning"; text: string };

export const generateDecisionObservations = (state: WorkspaceState): DecisionObservation[] => {
  const observations: DecisionObservation[] = [];
  const unknownCount = Object.entries(state.answers).filter(([, value]) => value === "" || value === null || value === "unknown").length;
  if (unknownCount > 0) observations.push({ level: "warning", text: `${unknownCount} recorded item${unknownCount === 1 ? "" : "s"} still need verification.` });
  if (state.completedModuleKeys.length < premiumModuleKeys.length - 1) observations.push({ level: "information", text: "The comparison remains incomplete until the core modules are reviewed." });
  if (!state.finalDecision.trim()) observations.push({ level: "information", text: "No final user-selected decision has been recorded." });
  return observations;
};
