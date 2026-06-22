export const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export const percentage = (value: number) => Math.min(nonNegative(value), 100);

export interface ContributionInputs {
  annualGoal: number;
  yearToDate: number;
  paychecksRemaining: number;
  grossPayPerPaycheck: number;
  employerMatchPercentage: number;
}

export const calculateContributionGoal = (inputs: ContributionInputs) => {
  const annualGoal = nonNegative(inputs.annualGoal);
  const yearToDate = nonNegative(inputs.yearToDate);
  const paychecksRemaining = Math.floor(nonNegative(inputs.paychecksRemaining));
  const grossPayPerPaycheck = nonNegative(inputs.grossPayPerPaycheck);
  const employerMatchPercentage = percentage(inputs.employerMatchPercentage);
  const remainingContribution = Math.max(annualGoal - yearToDate, 0);
  const requiredPerPaycheck = paychecksRemaining > 0
    ? remainingContribution / paychecksRemaining
    : 0;
  const requiredPercentage = grossPayPerPaycheck > 0
    ? (requiredPerPaycheck / grossPayPerPaycheck) * 100
    : 0;
  const achievable = remainingContribution === 0 || (
    paychecksRemaining > 0 &&
    grossPayPerPaycheck > 0 &&
    requiredPerPaycheck <= grossPayPerPaycheck
  );
  const estimatedEmployerMatch = grossPayPerPaycheck *
    (Math.min(employerMatchPercentage, requiredPercentage) / 100) *
    paychecksRemaining;

  return {
    remainingContribution,
    requiredPerPaycheck,
    requiredPercentage,
    achievable,
    appearsUnrealistic: requiredPercentage > 50,
    estimatedEmployerMatch,
  };
};

export type InsuranceStatus = "insured" | "uninsured" | "medicare" | "medicaid" | "unsure";

export interface HospitalBillInputs {
  billedCharge: number;
  deductibleRemaining: number;
  coinsurancePercentage: number;
  copay: number;
  outOfPocketMaxRemaining: number;
  amountAlreadyPaid: number;
  insuranceStatus: InsuranceStatus;
}

export const calculateHospitalBill = (inputs: HospitalBillInputs) => {
  const billedCharge = nonNegative(inputs.billedCharge);
  const amountAlreadyPaid = nonNegative(inputs.amountAlreadyPaid);
  const remainingCharge = Math.max(billedCharge - amountAlreadyPaid, 0);

  if (inputs.insuranceStatus === "uninsured") {
    return {
      remainingCharge,
      deductibleApplied: 0,
      coinsuranceEstimate: 0,
      copayEstimate: 0,
      estimatedBeforeCap: remainingCharge,
      patientResponsibility: remainingCharge,
      outOfPocketCapEffect: 0,
    };
  }

  const deductibleBeforeCap = Math.min(nonNegative(inputs.deductibleRemaining), remainingCharge);
  const afterDeductible = Math.max(remainingCharge - deductibleBeforeCap, 0);
  const coinsuranceBeforeCap = afterDeductible * (percentage(inputs.coinsurancePercentage) / 100);
  const copayBeforeCap = nonNegative(inputs.copay);
  const estimatedBeforeCap = Math.min(
    deductibleBeforeCap + coinsuranceBeforeCap + copayBeforeCap,
    remainingCharge,
  );
  const outOfPocketMaxRemaining = nonNegative(inputs.outOfPocketMaxRemaining);
  const patientResponsibility = outOfPocketMaxRemaining > 0
    ? Math.min(estimatedBeforeCap, outOfPocketMaxRemaining)
    : estimatedBeforeCap;

  const deductibleApplied = Math.min(deductibleBeforeCap, patientResponsibility);
  const afterDeductibleCap = Math.max(patientResponsibility - deductibleApplied, 0);
  const coinsuranceEstimate = Math.min(coinsuranceBeforeCap, afterDeductibleCap);
  const copayEstimate = Math.min(
    copayBeforeCap,
    Math.max(afterDeductibleCap - coinsuranceEstimate, 0),
  );

  return {
    remainingCharge,
    deductibleApplied,
    coinsuranceEstimate,
    copayEstimate,
    estimatedBeforeCap,
    patientResponsibility,
    outOfPocketCapEffect: Math.max(estimatedBeforeCap - patientResponsibility, 0),
  };
};

export interface MedicareCostInputs {
  monthlyPartBPremium: number;
  annualPartBDeductible: number;
  prescriptionsPerMonth: number;
  averagePrescriptionCost: number;
  expectedDoctorVisits: number;
  averageApprovedVisitAmount: number;
  coinsurancePercentage: number;
}

export const calculateMedicareCosts = (inputs: MedicareCostInputs) => {
  const annualPartBPremium = nonNegative(inputs.monthlyPartBPremium) * 12;
  const annualPrescriptionCost = nonNegative(inputs.prescriptionsPerMonth) *
    nonNegative(inputs.averagePrescriptionCost) * 12;
  const visitCoinsurance = nonNegative(inputs.expectedDoctorVisits) *
    nonNegative(inputs.averageApprovedVisitAmount) *
    (percentage(inputs.coinsurancePercentage) / 100);
  const annualPartBDeductible = nonNegative(inputs.annualPartBDeductible);

  return {
    annualPartBPremium,
    annualPartBDeductible,
    annualPrescriptionCost,
    visitCoinsurance,
    estimatedAnnualCost: annualPartBPremium + annualPartBDeductible + annualPrescriptionCost + visitCoinsurance,
  };
};

export interface EmergencyFundInputs {
  rentMortgage: number;
  food: number;
  transportation: number;
  insurance: number;
  minimumDebtPayments: number;
  utilities: number;
  otherEssentials: number;
  desiredMonths: number;
  currentSavings: number;
  monthlySavings: number;
}

export const calculateEmergencyFund = (inputs: EmergencyFundInputs) => {
  const essentialMonthlyExpenses = [
    inputs.rentMortgage,
    inputs.food,
    inputs.transportation,
    inputs.insurance,
    inputs.minimumDebtPayments,
    inputs.utilities,
    inputs.otherEssentials,
  ].reduce((sum, value) => sum + nonNegative(value), 0);
  const targetFund = essentialMonthlyExpenses * nonNegative(inputs.desiredMonths);
  const currentSavings = nonNegative(inputs.currentSavings);
  const remainingAmount = Math.max(targetFund - currentSavings, 0);
  const monthlySavings = nonNegative(inputs.monthlySavings);

  return {
    essentialMonthlyExpenses,
    targetFund,
    fundingPercentage: targetFund > 0 ? Math.min((currentSavings / targetFund) * 100, 100) : 100,
    remainingAmount,
    monthsToTarget: remainingAmount === 0 ? 0 : monthlySavings > 0 ? remainingAmount / monthlySavings : null,
  };
};

export interface SavingsRateInputs {
  takeHomePay: number;
  fixedExpenses: number;
  variableExpenses: number;
  retirementContributions: number;
  extraDebtPayments: number;
  cashSavings: number;
}

export type SavingsRateBand = "fragile" | "starting" | "solid" | "strong" | "aggressive";

export const getSavingsRateBand = (rate: number): SavingsRateBand => {
  if (rate < 5) return "fragile";
  if (rate < 10) return "starting";
  if (rate < 20) return "solid";
  if (rate < 35) return "strong";
  return "aggressive";
};

export const calculateSavingsRate = (inputs: SavingsRateInputs) => {
  const takeHomePay = nonNegative(inputs.takeHomePay);
  const cashSavings = nonNegative(inputs.cashSavings);
  const retirementContributions = nonNegative(inputs.retirementContributions);
  const extraDebtPayments = nonNegative(inputs.extraDebtPayments);
  const wealthBuilding = cashSavings + retirementContributions + extraDebtPayments;
  const cashSavingsRate = takeHomePay > 0 ? (cashSavings / takeHomePay) * 100 : 0;
  const totalWealthBuildingRate = takeHomePay > 0 ? (wealthBuilding / takeHomePay) * 100 : 0;
  const monthlyCashFlow = takeHomePay
    - nonNegative(inputs.fixedExpenses)
    - nonNegative(inputs.variableExpenses)
    - cashSavings
    - extraDebtPayments;

  return {
    cashSavingsRate,
    totalWealthBuildingRate,
    annualCashSavings: cashSavings * 12,
    annualWealthBuilding: wealthBuilding * 12,
    monthlyCashFlow,
    band: getSavingsRateBand(cashSavingsRate),
  };
};

export interface CafeSpendingInputs {
  coffeeCost: number;
  coffeePerWeek: number;
  mealCost: number;
  mealsPerWeek: number;
  snackCost: number;
  snacksPerWeek: number;
  workWeeks: number;
  weeklyAmountReplaced: number;
}

export const calculateCafeSpending = (inputs: CafeSpendingInputs) => {
  const weeklySpending =
    nonNegative(inputs.coffeeCost) * nonNegative(inputs.coffeePerWeek) +
    nonNegative(inputs.mealCost) * nonNegative(inputs.mealsPerWeek) +
    nonNegative(inputs.snackCost) * nonNegative(inputs.snacksPerWeek);
  const workWeeks = nonNegative(inputs.workWeeks);
  const annualSpending = weeklySpending * workWeeks;
  const weeklyAmountReplaced = Math.min(nonNegative(inputs.weeklyAmountReplaced), weeklySpending);

  return {
    weeklySpending,
    monthlySpending: annualSpending / 12,
    annualSpending,
    potentialAnnualSavings: weeklyAmountReplaced * workWeeks,
  };
};

export interface OvertimeInputs {
  baseHourlyRate: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  taxWithholdingPercentage: number;
  weeksWorked: number;
  extraSpendingPerWeek: number;
  recoveryCostPerWeek: number;
}

export const calculateOvertime = (inputs: OvertimeInputs) => {
  const weeksWorked = nonNegative(inputs.weeksWorked);
  const grossOvertimePay = nonNegative(inputs.baseHourlyRate) *
    nonNegative(inputs.overtimeHoursPerWeek) *
    nonNegative(inputs.overtimeMultiplier) *
    weeksWorked;
  const estimatedWithholding = grossOvertimePay * (percentage(inputs.taxWithholdingPercentage) / 100);
  const estimatedAfterTaxPay = grossOvertimePay - estimatedWithholding;
  const lifestyleLeakage = (
    nonNegative(inputs.extraSpendingPerWeek) + nonNegative(inputs.recoveryCostPerWeek)
  ) * weeksWorked;

  return {
    grossOvertimePay,
    estimatedWithholding,
    estimatedAfterTaxPay,
    lifestyleLeakage,
    netBenefit: estimatedAfterTaxPay - lifestyleLeakage,
  };
};

export interface LoanPaymentInputs {
  principal: number;
  annualInterestRate: number;
  termYears: number;
}

export const calculateLoanPayment = (inputs: LoanPaymentInputs) => {
  const principal = nonNegative(inputs.principal);
  const annualInterestRate = nonNegative(inputs.annualInterestRate);
  const termYears = Math.max(nonNegative(inputs.termYears), 0.1);
  const paymentCount = termYears * 12;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const monthlyPayment = monthlyInterestRate > 0
    ? (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -paymentCount))
    : principal / paymentCount;
  const totalPaid = monthlyPayment * paymentCount;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest: Math.max(totalPaid - principal, 0),
  };
};
