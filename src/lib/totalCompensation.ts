export type PayType = "hourly" | "salary";

export type QualityOfLifeInput = {
  workdaysPerWeek: number;
  weekends: string;
  nights: string;
  holidays: string;
  onCall: string;
  commuteMinutesPerWorkday: number;
  schedulePredictability: string;
  flexibility: string;
  physicalDemand: string;
  travel: string;
  careerDevelopment: string;
};

export type CompensationInput = {
  name: string;
  payType: PayType;
  hourlyRate: number;
  annualSalary: number;
  scheduledHoursPerWeek: number;
  weeksWorkedPerYear: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  differentialPerHour: number;
  differentialHoursPerWeek: number;
  annualBonus: number;
  signOnBonusAnnualized: number;
  holidayAndSpecialtyPay: number;
  employerRetirementPercent: number;
  employerRetirementFixed: number;
  employerHsaHraContribution: number;
  additionalBenefitValue: number;
  paidTimeOffHours: number;
  annualEmployeeHealthPremium: number;
  annualDentalVisionPremium: number;
  annualCommuteCost: number;
  annualParkingAndTolls: number;
  unpaidHoursPerWeek: number;
  payPeriodsPerYear: number;
  qualityOfLife: QualityOfLifeInput;
};

export type CompensationResult = {
  baseAnnualCash: number;
  overtimePay: number;
  differentialPay: number;
  annualCashCompensation: number;
  employerRetirementContribution: number;
  employerHsaHraContribution: number;
  additionalBenefitValue: number;
  ptoValue: number;
  employerBenefitValue: number;
  annualEmployeeCosts: number;
  totalEstimatedCompensation: number;
  totalAfterSelectedCosts: number;
  scheduledAnnualHours: number;
  actualAnnualHours: number;
  effectiveCompensationPerScheduledHour: number;
  effectiveCompensationPerActualHour: number;
  perMonthAfterCosts: number;
  perPaycheckAfterCosts: number;
  perScheduledWorkdayAfterCosts: number;
};

export type BreakEvenResult = {
  lowerOfferName: string;
  targetOfferName: string;
  requiredBaseAnnualCash: number;
  requiredHourlyRate: number | null;
  requiredAnnualSalary: number | null;
};

export type ComparisonResult = {
  offerA: CompensationResult;
  offerB: CompensationResult;
  annualDifference: number;
  monthlyDifference: number;
  paycheckDifference: number;
  scheduledWorkdayDifference: number;
  higherTotalOfferName: string;
  higherCashOfferName: string;
  summary: string;
  breakEven: BreakEvenResult;
};

const finiteNonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);
const safeDiv = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export const getHourlyEquivalent = (input: CompensationInput) => {
  if (input.payType === "hourly") return finiteNonNegative(input.hourlyRate);
  const scheduledHours = finiteNonNegative(input.scheduledHoursPerWeek) * finiteNonNegative(input.weeksWorkedPerYear);
  return safeDiv(finiteNonNegative(input.annualSalary), scheduledHours);
};

export const calculateCompensation = (input: CompensationInput): CompensationResult => {
  const weeks = finiteNonNegative(input.weeksWorkedPerYear);
  const scheduledHoursPerWeek = finiteNonNegative(input.scheduledHoursPerWeek);
  const scheduledAnnualHours = scheduledHoursPerWeek * weeks;
  const hourlyEquivalent = getHourlyEquivalent(input);

  const baseAnnualCash =
    input.payType === "salary"
      ? finiteNonNegative(input.annualSalary)
      : finiteNonNegative(input.hourlyRate) * scheduledAnnualHours;

  const overtimePay =
    input.payType === "hourly"
      ? finiteNonNegative(input.hourlyRate) * Math.max(finiteNonNegative(input.overtimeMultiplier), 1) * finiteNonNegative(input.overtimeHoursPerWeek) * weeks
      : 0;

  const differentialPay = finiteNonNegative(input.differentialPerHour) * finiteNonNegative(input.differentialHoursPerWeek) * weeks;
  const annualCashCompensation =
    baseAnnualCash +
    overtimePay +
    differentialPay +
    finiteNonNegative(input.annualBonus) +
    finiteNonNegative(input.signOnBonusAnnualized) +
    finiteNonNegative(input.holidayAndSpecialtyPay);

  const employerRetirementContribution =
    finiteNonNegative(input.employerRetirementFixed) +
    baseAnnualCash * (finiteNonNegative(input.employerRetirementPercent) / 100);

  const employerHsaHraContribution = finiteNonNegative(input.employerHsaHraContribution);
  const additionalBenefitValue = finiteNonNegative(input.additionalBenefitValue);
  const ptoValue = hourlyEquivalent * finiteNonNegative(input.paidTimeOffHours);

  // Annual salary normally already includes paid leave. Hourly roles may receive PTO as additional paid hours.
  const ptoIncludedInEconomicValue = input.payType === "hourly" ? ptoValue : 0;
  const employerBenefitValue = employerRetirementContribution + employerHsaHraContribution + additionalBenefitValue + ptoIncludedInEconomicValue;

  const annualEmployeeCosts =
    finiteNonNegative(input.annualEmployeeHealthPremium) +
    finiteNonNegative(input.annualDentalVisionPremium) +
    finiteNonNegative(input.annualCommuteCost) +
    finiteNonNegative(input.annualParkingAndTolls);

  const totalEstimatedCompensation = annualCashCompensation + employerBenefitValue;
  const totalAfterSelectedCosts = totalEstimatedCompensation - annualEmployeeCosts;
  const actualAnnualHours = scheduledAnnualHours + finiteNonNegative(input.unpaidHoursPerWeek) * weeks;
  const workdaysPerYear = finiteNonNegative(input.qualityOfLife.workdaysPerWeek) * weeks;

  return {
    baseAnnualCash: roundMoney(baseAnnualCash),
    overtimePay: roundMoney(overtimePay),
    differentialPay: roundMoney(differentialPay),
    annualCashCompensation: roundMoney(annualCashCompensation),
    employerRetirementContribution: roundMoney(employerRetirementContribution),
    employerHsaHraContribution: roundMoney(employerHsaHraContribution),
    additionalBenefitValue: roundMoney(additionalBenefitValue),
    ptoValue: roundMoney(ptoValue),
    employerBenefitValue: roundMoney(employerBenefitValue),
    annualEmployeeCosts: roundMoney(annualEmployeeCosts),
    totalEstimatedCompensation: roundMoney(totalEstimatedCompensation),
    totalAfterSelectedCosts: roundMoney(totalAfterSelectedCosts),
    scheduledAnnualHours: roundMoney(scheduledAnnualHours),
    actualAnnualHours: roundMoney(actualAnnualHours),
    effectiveCompensationPerScheduledHour: roundMoney(safeDiv(totalAfterSelectedCosts, scheduledAnnualHours)),
    effectiveCompensationPerActualHour: roundMoney(safeDiv(totalAfterSelectedCosts, actualAnnualHours)),
    perMonthAfterCosts: roundMoney(totalAfterSelectedCosts / 12),
    perPaycheckAfterCosts: roundMoney(safeDiv(totalAfterSelectedCosts, finiteNonNegative(input.payPeriodsPerYear))),
    perScheduledWorkdayAfterCosts: roundMoney(safeDiv(totalAfterSelectedCosts, workdaysPerYear)),
  };
};

const calculateRequiredBase = (input: CompensationInput, targetTotalAfterCosts: number) => {
  const current = calculateCompensation(input);
  const percentMultiplier = 1 + finiteNonNegative(input.employerRetirementPercent) / 100;
  const baseDependentPtoMultiplier =
    input.payType === "hourly" && input.scheduledHoursPerWeek > 0 && input.weeksWorkedPerYear > 0
      ? finiteNonNegative(input.paidTimeOffHours) / (input.scheduledHoursPerWeek * input.weeksWorkedPerYear)
      : 0;
  const totalBaseMultiplier = percentMultiplier + baseDependentPtoMultiplier;
  const nonBaseNet = current.totalAfterSelectedCosts - current.baseAnnualCash * totalBaseMultiplier;
  return Math.max(0, safeDiv(targetTotalAfterCosts - nonBaseNet, totalBaseMultiplier));
};

export const compareCompensation = (offerAInput: CompensationInput, offerBInput: CompensationInput): ComparisonResult => {
  const offerA = calculateCompensation(offerAInput);
  const offerB = calculateCompensation(offerBInput);
  const annualDifference = roundMoney(offerB.totalAfterSelectedCosts - offerA.totalAfterSelectedCosts);
  const higherIsB = annualDifference >= 0;
  const higherInput = higherIsB ? offerBInput : offerAInput;
  const lowerInput = higherIsB ? offerAInput : offerBInput;
  const higherResult = higherIsB ? offerB : offerA;
  const lowerResult = higherIsB ? offerA : offerB;
  const higherTotalOfferName = higherInput.name || (higherIsB ? "Offer B" : "Offer A");
  const lowerOfferName = lowerInput.name || (higherIsB ? "Offer A" : "Offer B");
  const cashHigherIsB = offerB.annualCashCompensation >= offerA.annualCashCompensation;
  const higherCashOfferName = (cashHigherIsB ? offerBInput.name : offerAInput.name) || (cashHigherIsB ? "Offer B" : "Offer A");
  const absoluteDifference = Math.abs(annualDifference);
  const relativeDifference = safeDiv(absoluteDifference, Math.max(higherResult.totalAfterSelectedCosts, 1));

  let summary: string;
  if (relativeDifference < 0.03) {
    summary = `The estimated financial difference is modest. ${higherTotalOfferName} is ahead by about $${Math.round(absoluteDifference).toLocaleString()} per year, so schedule, call burden, commute, and career trajectory may reasonably decide the choice.`;
  } else if (higherCashOfferName !== higherTotalOfferName) {
    summary = `${higherCashOfferName} pays more in direct cash, but ${higherTotalOfferName} has the higher estimated total after selected benefits and work-related costs.`;
  } else {
    summary = `${higherTotalOfferName} has the higher estimated annual value after selected benefits and work-related costs by about $${Math.round(absoluteDifference).toLocaleString()}.`;
  }

  const requiredBaseAnnualCash = calculateRequiredBase(lowerInput, higherResult.totalAfterSelectedCosts);
  const denominator = finiteNonNegative(lowerInput.scheduledHoursPerWeek) * finiteNonNegative(lowerInput.weeksWorkedPerYear);

  return {
    offerA,
    offerB,
    annualDifference,
    monthlyDifference: roundMoney(annualDifference / 12),
    paycheckDifference: roundMoney(
      safeDiv(offerB.totalAfterSelectedCosts, finiteNonNegative(offerBInput.payPeriodsPerYear)) -
        safeDiv(offerA.totalAfterSelectedCosts, finiteNonNegative(offerAInput.payPeriodsPerYear)),
    ),
    scheduledWorkdayDifference: roundMoney(offerB.perScheduledWorkdayAfterCosts - offerA.perScheduledWorkdayAfterCosts),
    higherTotalOfferName,
    higherCashOfferName,
    summary,
    breakEven: {
      lowerOfferName,
      targetOfferName: higherTotalOfferName,
      requiredBaseAnnualCash: roundMoney(requiredBaseAnnualCash),
      requiredHourlyRate: lowerInput.payType === "hourly" ? roundMoney(safeDiv(requiredBaseAnnualCash, denominator)) : null,
      requiredAnnualSalary: lowerInput.payType === "salary" ? roundMoney(requiredBaseAnnualCash) : null,
    },
  };
};

export const createDefaultCompensationInput = (name: string, payType: PayType = "hourly"): CompensationInput => ({
  name,
  payType,
  hourlyRate: payType === "hourly" ? 36 : 0,
  annualSalary: payType === "salary" ? 90000 : 0,
  scheduledHoursPerWeek: payType === "hourly" ? 36 : 40,
  weeksWorkedPerYear: 52,
  overtimeHoursPerWeek: 0,
  overtimeMultiplier: 1.5,
  differentialPerHour: 0,
  differentialHoursPerWeek: 0,
  annualBonus: 0,
  signOnBonusAnnualized: 0,
  holidayAndSpecialtyPay: 0,
  employerRetirementPercent: 3,
  employerRetirementFixed: 0,
  employerHsaHraContribution: 0,
  additionalBenefitValue: 0,
  paidTimeOffHours: payType === "hourly" ? 72 : 120,
  annualEmployeeHealthPremium: 0,
  annualDentalVisionPremium: 0,
  annualCommuteCost: 0,
  annualParkingAndTolls: 0,
  unpaidHoursPerWeek: 0,
  payPeriodsPerYear: 26,
  qualityOfLife: {
    workdaysPerWeek: payType === "hourly" ? 3 : 5,
    weekends: "Not entered",
    nights: "Not entered",
    holidays: "Not entered",
    onCall: "Not entered",
    commuteMinutesPerWorkday: 0,
    schedulePredictability: "Not entered",
    flexibility: "Not entered",
    physicalDemand: "Not entered",
    travel: "Not entered",
    careerDevelopment: "Not entered",
  },
});
