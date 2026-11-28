/** Educational, covered-service models. Every monetary value is integer US cents.
 * No CMS aggregate is converted into a patient's allowed amount or payer payment.
 */
export type CoverageId = 'medicare' | 'medigap-g' | 'medicare-advantage' | 'ppo' | 'hdhp' | 'marketplace' | 'medicaid' | 'dual-qmb' | 'uninsured';
export type BillYear = 2026 | 2027;

export const MEDICARE_RULES = {
  2026: { partADeductibleCents: 173600, day61To90Cents: 43400, reserveDayCents: 86800, partBDeductibleCents: 28300 },
  2027: { partADeductibleCents: 177600, day61To90Cents: 44400, reserveDayCents: 88800, partBDeductibleCents: 29200 },
} as const;
export const MEDICARE_RULES_SOURCE = {
  url: 'https://www.medicare.gov/basics/costs/medicare-costs',
  verified: '2026-11-27',
  effective: { 2026: '2026-01-01', 2027: '2027-01-01' },
};

export interface HospitalBillInput {
  coverage: CoverageId;
  year: BillYear;
  chargesCents: number;
  /** Hypothetical covered facility payment basis, never a CMS average claim. */
  allowedCents: number;
  days: number;
  deductibleCents: number;
  deductibleSatisfiedCents: number;
  coinsurancePercent: number;
  oopMaxCents: number;
  oopSpentCents: number;
  admissionCopayCents: number;
  dailyCopayCents: number;
  dailyCopayDays: number;
  /** Original Medicare: days used earlier in this same benefit period. */
  priorBenefitDays: number;
  /** Already satisfied/assigned in this period, whether or not the patient paid the prior bill. */
  partADeductiblePaid: boolean;
  lifetimeReserveDaysRemaining: number;
  partBDeductibleSatisfiedCents: number;
  /** Only a verified or explicitly hypothetical secondary contribution. */
  secondaryPaymentCents: number;
  assistancePercent: number;
  selfPayDiscountPercent: number;
  patientPaidCents: number;
  network: 'in-network' | 'out-of-network-protected' | 'out-of-network-unprotected';
  professional?: { chargesCents: number; allowedCents: number };
}

export interface BillLedger {
  charges: number;
  allowed: number;
  contractualAdjustment: number;
  /** Cost-sharing components BEFORE secondary payment, assistance, or QMB protection. */
  deductible: number;
  copay: number;
  coinsurance: number;
  primaryPayment: number;
  secondaryPayment: number;
  /** QMB cost sharing that may not be billed; does not assert a Medicaid cash payment. */
  protectedWriteOff: number;
  assistance: number;
  patientResponsibility: number;
  patientPaid: number;
  balance: number;
}

export interface BillResult {
  status: 'modeled' | 'invalid' | 'unsupported';
  ledger?: BillLedger;
  facility?: BillLedger;
  professional?: BillLedger;
  errors: string[];
  notes: string[];
  remainingDeductibleCents?: number;
  remainingOopCents?: number;
  remainingReserveDays?: number;
}

export const COVERAGE_PRESETS: ReadonlyArray<{ id: CoverageId; label: string; description: string }> = [
  { id: 'medicare', label: 'Original Medicare', description: 'Covered inpatient Part A services; benefit-period rules. No annual out-of-pocket maximum.' },
  { id: 'medigap-g', label: 'Original Medicare + Plan G', description: 'Standard Plan G, not high-deductible Plan G. Covers Part A cost sharing; not the Part B deductible. Premiums excluded.' },
  { id: 'medicare-advantage', label: 'Medicare Advantage — example', description: 'Hypothetical $350/day for days 1–5, then $0; $6,000 remaining annual limit. Check the actual Evidence of Coverage.' },
  { id: 'ppo', label: 'Employer PPO — example', description: 'Hypothetical $1,500 individual deductible, 20% coinsurance, $6,000 annual out-of-pocket maximum.' },
  { id: 'hdhp', label: 'Employer HDHP — example', description: 'Hypothetical $3,000 individual deductible, 20% coinsurance, $7,000 annual out-of-pocket maximum.' },
  { id: 'marketplace', label: 'Marketplace — example', description: 'Hypothetical $5,000 individual deductible, 30% coinsurance, $9,000 annual out-of-pocket maximum. Cost-sharing reductions and actual plans vary.' },
  { id: 'medicaid', label: 'Medicaid — covered-service example', description: 'Illustrative $0 covered inpatient copay, not a national Medicaid benefit or eligibility determination. State and program rules vary.' },
  { id: 'dual-qmb', label: 'Medicare + Medicaid (QMB)', description: 'For Qualified Medicare Beneficiaries, Medicare-covered cost sharing cannot be billed, even when Medicaid pays nothing.' },
  { id: 'uninsured', label: 'Uninsured / self-pay — example', description: 'Illustrative discount and assistance only; no hospital-specific cash price or eligibility claim.' },
];

export function presetInput(coverage: CoverageId, chargesCents: number, days = 4, year: BillYear = 2026): HospitalBillInput {
  return {
    coverage, year, chargesCents, days,
    allowedCents: Math.round(chargesCents * (['medicare', 'medigap-g', 'dual-qmb', 'medicaid'].includes(coverage) ? 0.3 : 0.55)),
    deductibleCents: coverage === 'hdhp' ? 300000 : coverage === 'marketplace' ? 500000 : 150000,
    deductibleSatisfiedCents: 0,
    coinsurancePercent: coverage === 'marketplace' ? 30 : 20,
    oopMaxCents: coverage === 'hdhp' ? 700000 : coverage === 'marketplace' ? 900000 : 600000,
    oopSpentCents: 0, admissionCopayCents: 0, dailyCopayCents: 35000, dailyCopayDays: 5,
    priorBenefitDays: 0, partADeductiblePaid: false, lifetimeReserveDaysRemaining: 60,
    partBDeductibleSatisfiedCents: 0, secondaryPaymentCents: 0,
    assistancePercent: 0, selfPayDiscountPercent: 30, patientPaidCents: 0, network: 'in-network',
  };
}

export function dollarsToCents(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > 10_000_000) throw new RangeError('Enter a dollar amount from 0 to 10,000,000.');
  return Math.round((value + Number.EPSILON) * 100);
}
export function formatBillMoney(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

const MONEY_KEYS = ['chargesCents', 'allowedCents', 'deductibleCents', 'deductibleSatisfiedCents', 'oopMaxCents', 'oopSpentCents', 'admissionCopayCents', 'dailyCopayCents', 'partBDeductibleSatisfiedCents', 'secondaryPaymentCents', 'patientPaidCents'] as const;
const MEDICARE_IDS: CoverageId[] = ['medicare', 'medigap-g', 'dual-qmb'];
const percent = (amount: number, rate: number) => Math.round(amount * rate / 100);

function validate(input: HospitalBillInput): string[] {
  const errors: string[] = [];
  if (!COVERAGE_PRESETS.some(p => p.id === input.coverage)) errors.push('Choose a supported coverage arrangement.');
  if (input.year !== 2026 && input.year !== 2027) errors.push('Only verified 2026 and 2027 Medicare parameters are supported.');
  for (const key of MONEY_KEYS) if (!Number.isSafeInteger(input[key]) || input[key] < 0 || input[key] > 1_000_000_000) errors.push(`${key}: enter whole cents from 0 to 1,000,000,000.`);
  for (const key of ['coinsurancePercent', 'assistancePercent', 'selfPayDiscountPercent'] as const) if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > 100) errors.push(`${key}: enter a percentage from 0 to 100.`);
  for (const [key, max] of [['days', 365], ['priorBenefitDays', 150], ['lifetimeReserveDaysRemaining', 60], ['dailyCopayDays', 365]] as const) if (!Number.isInteger(input[key]) || input[key] < (key === 'days' ? 1 : 0) || input[key] > max) errors.push(`${key}: unsupported day count.`);
  if (typeof input.partADeductiblePaid !== 'boolean') errors.push('Specify whether the Part A deductible was already paid in this benefit period.');
  if (MEDICARE_IDS.includes(input.coverage) && input.lifetimeReserveDaysRemaining > 60 - Math.max(0, input.priorBenefitDays - 90)) errors.push('Unused reserve days exceed the lifetime bank remaining after the entered prior covered inpatient days.');
  if (!['in-network', 'out-of-network-protected', 'out-of-network-unprotected'].includes(input.network)) errors.push('Choose a supported network status.');
  if (input.allowedCents > input.chargesCents) errors.push('This model requires the allowed amount to be no greater than charges.');
  if (input.deductibleSatisfiedCents > input.deductibleCents) errors.push('Deductible already satisfied cannot exceed the annual deductible.');
  if (input.oopSpentCents > input.oopMaxCents) errors.push('Prior out-of-pocket spending cannot exceed the annual limit.');
  if (input.professional) {
    for (const key of ['chargesCents', 'allowedCents'] as const) if (!Number.isSafeInteger(input.professional[key]) || input.professional[key] < 0 || input.professional[key] > 1_000_000_000) errors.push(`professional.${key}: enter valid whole cents.`);
    if (input.professional.allowedCents > input.professional.chargesCents) errors.push('Professional allowed amount cannot exceed professional charges in this model.');
  }
  return errors;
}

function ledger(charges: number, allowed: number): BillLedger {
  return { charges, allowed, contractualAdjustment: charges - allowed, deductible: 0, copay: 0, coinsurance: 0, primaryPayment: 0, secondaryPayment: 0, protectedWriteOff: 0, assistance: 0, patientResponsibility: 0, patientPaid: 0, balance: 0 };
}

/** Exact ledger identity, with cost-sharing breakdowns excluded from cash totals. */
export function ledgerReconciles(value: BillLedger): boolean {
  return Object.values(value).every(n => Number.isSafeInteger(n) && n >= 0)
    && value.charges === value.contractualAdjustment + value.primaryPayment + value.secondaryPayment + value.protectedWriteOff + value.assistance + value.patientPaid + value.balance
    && value.allowed === value.primaryPayment + value.secondaryPayment + value.protectedWriteOff + value.assistance + value.patientResponsibility
    && value.patientResponsibility === value.patientPaid + value.balance;
}

export function adjudicateHospitalBill(input: HospitalBillInput): BillResult {
  const errors = validate(input);
  const notes = ['Educational simulation of covered services, not an actual payer adjudication or personal estimate. All allowed amounts and nonstatutory plan benefits are hypothetical.'];
  if (errors.length) return { status: 'invalid', errors, notes };
  if (input.network === 'out-of-network-unprotected') return { status: 'unsupported', errors: ['Unprotected out-of-network benefits and possible balance bills require the actual plan and applicable law; this model does not estimate them.'], notes };
  if (input.network === 'out-of-network-protected') notes.push('Protected encounter assumes applicable in-network cost-sharing treatment. Verify No Surprises Act eligibility; protections do not apply to every service, including most ground ambulances.');
  const rules = MEDICARE_RULES[input.year];
  if (input.partBDeductibleSatisfiedCents > rules.partBDeductibleCents && MEDICARE_IDS.includes(input.coverage)) return { status: 'invalid', errors: ['Part B deductible already satisfied exceeds the verified annual deductible.'], notes };
  const facilityAllowed = input.coverage === 'uninsured' ? input.chargesCents - percent(input.chargesCents, input.selfPayDiscountPercent) : input.allowedCents;
  const facility = ledger(input.chargesCents, facilityAllowed);
  const professional = input.professional ? ledger(input.professional.chargesCents, input.coverage === 'uninsured' ? input.professional.chargesCents - percent(input.professional.chargesCents, input.selfPayDiscountPercent) : input.professional.allowedCents) : undefined;
  let deductibleRemaining = input.deductibleCents - input.deductibleSatisfiedCents;
  let oopRemaining = input.oopMaxCents - input.oopSpentCents;
  let reserveRemaining = input.lifetimeReserveDaysRemaining;

  if (MEDICARE_IDS.includes(input.coverage)) {
    const firstDay = input.priorBenefitDays + 1;
    const lastDay = input.priorBenefitDays + input.days;
    const days61To90 = Math.max(0, Math.min(lastDay, 90) - Math.max(firstDay, 61) + 1);
    const reserveDays = Math.max(0, lastDay - Math.max(firstDay, 91) + 1);
    if (reserveDays > reserveRemaining || lastDay > 150) return { status: 'unsupported', errors: ['This stay exceeds available Medicare lifetime reserve days. Full-cost exposure and Medigap additional hospital-day benefits are outside this model.'], notes };
    reserveRemaining -= reserveDays;
    facility.deductible = input.partADeductiblePaid || input.priorBenefitDays > 0 ? 0 : rules.partADeductibleCents;
    facility.coinsurance = days61To90 * rules.day61To90Cents + reserveDays * rules.reserveDayCents;
    if (facility.deductible + facility.coinsurance > facility.allowed) return { status: 'invalid', errors: ['The hypothetical facility payment basis is below statutory Part A cost sharing. Increase that basis or revise the modeled stay.'], notes };
    facility.primaryPayment = facility.allowed - facility.deductible - facility.coinsurance;
    facility.patientResponsibility = facility.deductible + facility.coinsurance;
    if (professional) {
      professional.deductible = Math.min(professional.allowed, rules.partBDeductibleCents - input.partBDeductibleSatisfiedCents);
      professional.coinsurance = percent(professional.allowed - professional.deductible, 20);
      professional.patientResponsibility = professional.deductible + professional.coinsurance;
      professional.primaryPayment = professional.allowed - professional.patientResponsibility;
    }
    if (input.coverage === 'medigap-g') {
      facility.secondaryPayment = facility.patientResponsibility;
      facility.patientResponsibility = 0;
      if (professional) {
        professional.secondaryPayment = professional.coinsurance;
        professional.patientResponsibility = professional.deductible;
      }
      notes.push('Standard Plan G is modeled for Medicare-covered, assigned services during covered Part A days. Premiums, high-deductible Plan G, excess charges, and additional 365 hospital days are excluded.');
    }
    if (input.coverage === 'dual-qmb') {
      for (const claim of [facility, professional].filter((v): v is BillLedger => Boolean(v))) {
        claim.protectedWriteOff = claim.patientResponsibility;
        claim.patientResponsibility = 0;
      }
      notes.push('QMB protected cost sharing is shown as a nonbillable reduction, not an invented Medicaid payment. Actual secondary payment may differ; total provider collections cannot be inferred.');
    }
    notes.push('Part A deductible is per benefit period, not per year. A new benefit period can start after 60 consecutive days without inpatient hospital care or skilled SNF care. This input models one stay in one benefit period; separate new periods must be modeled separately. Original Medicare has no annual out-of-pocket maximum.');
    if (input.priorBenefitDays > 0) notes.push('Earlier covered inpatient days in this same benefit period already incurred its Part A deductible. This stay does not incur a second deductible even if the earlier account remains unpaid.');
    notes.push('Professional services are a separate Part B model assuming assignment, the standard deductible and 20% coinsurance; preventive/lab exceptions, excess charges and other benefit-specific rules are excluded.');
  } else if (input.coverage === 'uninsured') {
    for (const claim of [facility, professional].filter((v): v is BillLedger => Boolean(v))) claim.patientResponsibility = claim.allowed;
    notes.push('The price reduction is a hypothetical self-pay discount, not a contractual adjustment, verified cash price, or financial-assistance determination. No insurer payment is assumed.');
  } else if (input.coverage === 'medicaid') {
    facility.copay = Math.min(facility.allowed, input.admissionCopayCents);
    facility.patientResponsibility = facility.copay;
    facility.primaryPayment = facility.allowed - facility.copay;
    if (professional) professional.primaryPayment = professional.allowed;
    notes.push('Medicaid example assumes covered, enrolled-provider services and the entered facility copay; professional copay is $0 in this example. It is not a national rule. State, eligibility, service and managed-care rules vary.');
  } else {
    for (const claim of [facility, professional].filter((v): v is BillLedger => Boolean(v))) {
      if (input.coverage === 'medicare-advantage' && claim === facility) {
        claim.copay = Math.min(claim.allowed, oopRemaining, input.admissionCopayCents + input.dailyCopayCents * Math.min(input.days, input.dailyCopayDays));
      } else {
        claim.deductible = Math.min(claim.allowed, deductibleRemaining, oopRemaining);
        deductibleRemaining -= claim.deductible;
        claim.copay = Math.min(claim.allowed - claim.deductible, Math.max(0, oopRemaining - claim.deductible), claim === facility ? input.admissionCopayCents : 0);
        claim.coinsurance = Math.min(percent(claim.allowed - claim.deductible - claim.copay, input.coinsurancePercent), Math.max(0, oopRemaining - claim.deductible - claim.copay));
      }
      claim.patientResponsibility = claim.deductible + claim.copay + claim.coinsurance;
      oopRemaining -= claim.patientResponsibility;
      claim.primaryPayment = claim.allowed - claim.patientResponsibility;
    }
    notes.push('Individual accumulators only. Covered, in-network cost sharing counts toward the entered annual out-of-pocket maximum. Premiums, excluded services, family aggregate/embedded rules and benefit-specific exceptions are outside this model.');
    if (input.coverage === 'medicare-advantage') notes.push('Medicare Advantage facility daily-copay example is separate from Original Medicare Part A rules. Optional professional services use the entered deductible and coinsurance. This is a hypothetical benefit design, not a named plan.');
  }

  const claims = [facility, professional].filter((v): v is BillLedger => Boolean(v));
  let secondaryRemaining = input.secondaryPaymentCents;
  let paidRemaining = input.patientPaidCents;
  const liabilityBeforeExtra = claims.reduce((sum, claim) => sum + claim.patientResponsibility, 0);
  if (secondaryRemaining > liabilityBeforeExtra) return { status: 'invalid', errors: ['Additional secondary payment cannot exceed remaining patient cost sharing.'], notes };
  for (const claim of claims) {
    const secondary = Math.min(secondaryRemaining, claim.patientResponsibility);
    claim.secondaryPayment += secondary;
    secondaryRemaining -= secondary;
    claim.patientResponsibility -= secondary;
    claim.assistance = percent(claim.patientResponsibility, input.assistancePercent);
    claim.patientResponsibility -= claim.assistance;
    claim.patientPaid = Math.min(paidRemaining, claim.patientResponsibility);
    paidRemaining -= claim.patientPaid;
    claim.balance = claim.patientResponsibility - claim.patientPaid;
  }
  if (paidRemaining > 0) return { status: 'invalid', errors: ['Patient payments exceed modeled patient responsibility. Refunds and credit balances are outside this model.'], notes };
  const total = claims.reduce((sum, claim) => {
    for (const key of Object.keys(sum) as Array<keyof BillLedger>) sum[key] += claim[key];
    return sum;
  }, ledger(0, 0));
  if (!claims.every(ledgerReconciles) || !ledgerReconciles(total)) return { status: 'invalid', errors: ['The financial ledger did not reconcile.'], notes };
  if (input.assistancePercent > 0) notes.push('Assistance is hypothetical forgiveness of remaining patient liability, not additional insurer revenue; actual eligibility and covered providers require the hospital policy.');
  return { status: 'modeled', ledger: total, facility, professional, errors: [], notes,
    remainingDeductibleCents: MEDICARE_IDS.includes(input.coverage) || input.coverage === 'uninsured' || input.coverage === 'medicaid' ? undefined : deductibleRemaining,
    remainingOopCents: MEDICARE_IDS.includes(input.coverage) || input.coverage === 'uninsured' || input.coverage === 'medicaid' ? undefined : oopRemaining,
    remainingReserveDays: MEDICARE_IDS.includes(input.coverage) ? reserveRemaining : undefined,
  };
}
