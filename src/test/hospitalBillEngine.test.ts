import { describe, expect, it } from 'vitest';
import { adjudicateHospitalBill, COVERAGE_PRESETS, dollarsToCents, ledgerReconciles, presetInput, type HospitalBillInput } from '../lib/hospitalBillEngine';
import { hospitalBillScenarios, scenarioGrossCents } from '../data/hospitalBillScenarios';

function model(overrides: Partial<HospitalBillInput> = {}) {
  return adjudicateHospitalBill({ ...presetInput('ppo', 3505500), allowedCents: 1500000, ...overrides });
}

describe('hospital bill financial rules', () => {
  it('independently reconciles PPO: 1500 deductible + 20% of 13500 = 4200', () => {
    const r = model();
    expect(r.status).toBe('modeled');
    expect(r.ledger).toMatchObject({ charges: 3505500, allowed: 1500000, contractualAdjustment: 2005500, deductible: 150000, coinsurance: 270000, patientResponsibility: 420000, primaryPayment: 1080000 });
    expect(ledgerReconciles(r.ledger!)).toBe(true);
  });
  it.each([
    [{ deductibleSatisfiedCents: 150000 }, 300000],
    [{ deductibleCents: 2000000 }, 600000],
    [{ coinsurancePercent: 0 }, 150000],
    [{ coinsurancePercent: 100 }, 600000],
    [{ oopSpentCents: 600000 }, 0],
    [{ oopSpentCents: 550000 }, 50000],
    [{ allowedCents: 100000 }, 100000],
  ] as Array<[Partial<HospitalBillInput>, number]>)('applies deductible and OOP boundaries %j', (input, patient) => {
    expect(model(input).ledger?.patientResponsibility).toBe(patient);
  });
  it('shares annual commercial accumulators across facility and professional claims', () => {
    const r = model({ allowedCents: 100000, professional: { chargesCents: 200000, allowedCents: 100000 } });
    expect(r.facility?.deductible).toBe(100000);
    expect(r.professional).toMatchObject({ deductible: 50000, coinsurance: 10000, patientResponsibility: 60000 });
    expect(r.ledger?.patientResponsibility).toBe(160000);
    expect(r.remainingDeductibleCents).toBe(0);
  });
  it('models Part A once per benefit period and separately from annual Part B', () => {
    const r = model({ coverage: 'medicare', professional: { chargesCents: 200000, allowedCents: 100000 } });
    expect(r.facility?.patientResponsibility).toBe(173600);
    expect(r.professional).toMatchObject({ deductible: 28300, coinsurance: 14340, patientResponsibility: 42640 });
    expect(model({ coverage: 'medicare', partADeductiblePaid: true }).facility?.patientResponsibility).toBe(0);
    expect(model({ coverage: 'medicare' }).facility?.patientResponsibility).toBe(173600);
    expect(model({ coverage: 'medicare', year: 2027 }).facility?.patientResponsibility).toBe(177600);
  });
  it('calculates days 61–90 and reserve days only when crossed', () => {
    const r = model({ coverage: 'medicare', days: 3, priorBenefitDays: 89, partADeductiblePaid: true });
    expect(r.facility?.coinsurance).toBe(43400 + 2 * 86800);
    expect(r.remainingReserveDays).toBe(58);
    expect(model({ coverage: 'medicare', days: 2, priorBenefitDays: 59, partADeductiblePaid: true }).facility?.coinsurance).toBe(43400);
  });
  it('does not invent results after lifetime reserve exhaustion', () => {
    expect(model({ coverage: 'medicare', days: 3, priorBenefitDays: 89, lifetimeReserveDaysRemaining: 1 }).status).toBe('unsupported');
    expect(model({ coverage: 'medigap-g', days: 151 }).status).toBe('unsupported');
  });
  it('Plan G covers Part A and Part B coinsurance but not Part B deductible', () => {
    const r = model({ coverage: 'medigap-g', professional: { chargesCents: 200000, allowedCents: 100000 } });
    expect(r.facility).toMatchObject({ primaryPayment: 1326400, secondaryPayment: 173600, patientResponsibility: 0 });
    expect(r.professional).toMatchObject({ secondaryPayment: 14340, patientResponsibility: 28300 });
    expect(r.ledger?.patientResponsibility).toBe(28300);
  });
  it('QMB protection never fabricates a Medicaid payment', () => {
    const r = model({ coverage: 'dual-qmb', professional: { chargesCents: 200000, allowedCents: 100000 } });
    expect(r.ledger).toMatchObject({ secondaryPayment: 0, protectedWriteOff: 216240, patientResponsibility: 0 });
    expect(ledgerReconciles(r.ledger!)).toBe(true);
  });
  it('daily MA copays stop after specified days and at annual remaining limit', () => {
    expect(model({ coverage: 'medicare-advantage', days: 10 }).facility?.copay).toBe(175000);
    expect(model({ coverage: 'medicare-advantage', days: 10, oopSpentCents: 550000 }).facility?.copay).toBe(50000);
  });
  it('uses explicit Medicaid copay and hypothetical payment basis', () => {
    expect(model({ coverage: 'medicaid' }).ledger?.patientResponsibility).toBe(0);
    expect(model({ coverage: 'medicaid', admissionCopayCents: 1000 }).ledger?.patientResponsibility).toBe(1000);
  });
  it('separates self-pay discount, assistance and patient payment', () => {
    const r = model({ coverage: 'uninsured', chargesCents: 100000, allowedCents: 100000, selfPayDiscountPercent: 30, assistancePercent: 50, patientPaidCents: 5000 });
    expect(r.ledger).toMatchObject({ charges: 100000, allowed: 70000, contractualAdjustment: 30000, primaryPayment: 0, assistance: 35000, patientResponsibility: 35000, patientPaid: 5000, balance: 30000 });
  });
  it('applies explicit secondary payment before assistance without double counting', () => {
    const r = model({ secondaryPaymentCents: 200000, assistancePercent: 50, patientPaidCents: 10000 });
    expect(r.ledger).toMatchObject({ secondaryPayment: 200000, assistance: 110000, patientResponsibility: 110000, patientPaid: 10000, balance: 100000 });
  });
  it.each([
    { allowedCents: -1 }, { days: 0 }, { coinsurancePercent: 101 }, { assistancePercent: NaN },
    { chargesCents: Infinity }, { deductibleCents: 1.5 }, { oopSpentCents: 600001 },
    { allowedCents: 99999999 }, { deductibleSatisfiedCents: 200000 },
    { secondaryPaymentCents: 99999999 }, { patientPaidCents: 99999999 },
    { coverage: 'medicare', allowedCents: 100 },
  ] as Array<Partial<HospitalBillInput>>)('rejects invalid or contradictory inputs %j', input => {
    expect(model(input).status).toBe('invalid');
  });
  it('does not automatically balance bill protected out-of-network services', () => {
    expect(model({ network: 'out-of-network-protected' }).ledger).toEqual(model().ledger);
    expect(model({ network: 'out-of-network-unprotected' }).status).toBe('unsupported');
  });
  it('rounds cents consistently, including a zero-value claim', () => {
    expect(dollarsToCents(1.005)).toBe(101);
    expect(model({ coverage: 'ppo', chargesCents: 0, allowedCents: 0 }).ledger?.balance).toBe(0);
    expect(model({ allowedCents: 10001, deductibleSatisfiedCents: 150000, coinsurancePercent: 33.33 }).ledger?.coinsurance).toBe(3333);
    expect(() => dollarsToCents(-1)).toThrow();
  });
  it('reconciles many benefit/charge combinations for every coverage preset', () => {
    for (const preset of COVERAGE_PRESETS) for (const charges of [2000000, 3505500, 10000000]) for (const assistancePercent of [0, 33.33, 100]) for (const oopSpentCents of [0, 599999, 600000]) {
      const r = adjudicateHospitalBill({ ...presetInput(preset.id, charges), assistancePercent, oopSpentCents: Math.min(oopSpentCents, presetInput(preset.id, charges).oopMaxCents) });
      expect(r.status).toBe('modeled');
      expect(ledgerReconciles(r.ledger!)).toBe(true);
      expect(r.ledger!.balance).toBeLessThanOrEqual(r.ledger!.allowed);
    }
  });
  it('keeps each researched inpatient scenario balanced with optional professional accounts in both years', () => {
    for (const scenario of hospitalBillScenarios.filter(s => s.classification === 'inpatient')) for (const year of [2026, 2027] as const) for (const preset of COVERAGE_PRESETS) {
      const commercial = ['ppo', 'hdhp', 'marketplace', 'medicare-advantage'].includes(preset.id);
      const input = {
        ...presetInput(preset.id, scenarioGrossCents(scenario), scenario.inpatientDays, year),
        allowedCents: Math.min(scenarioGrossCents(scenario), Math.round(scenario.illustrativeAllowedCents * (commercial ? 1.8 : 1))),
        professional: { chargesCents: scenario.professionalChargesCents, allowedCents: scenario.professionalAllowedCents },
      };
      const r = adjudicateHospitalBill(input);
      expect(r.status).toBe('modeled');
      expect(ledgerReconciles(r.ledger!)).toBe(true);
      expect(ledgerReconciles(r.facility!)).toBe(true);
      expect(ledgerReconciles(r.professional!)).toBe(true);
      expect(r.ledger!.charges).toBe(scenarioGrossCents(scenario) + scenario.professionalChargesCents);
      expect(r.ledger!.balance).toBe(r.facility!.balance + r.professional!.balance);
      if (preset.id === 'medicare') expect(r.facility!.patientResponsibility).toBe(year === 2026 ? 173600 : 177600);
      if (preset.id === 'medigap-g') expect(r.facility!.patientResponsibility).toBe(0);
      if (preset.id === 'dual-qmb') expect(r.ledger!.secondaryPayment).toBe(0);
    }
  });
  it('does not apply an annual commercial limit to Original Medicare cost sharing', () => {
    const r = model({ coverage: 'medicare', days: 10, priorBenefitDays: 60, partADeductiblePaid: true, oopMaxCents: 0 });
    expect(r.ledger?.patientResponsibility).toBe(434000);
    expect(r.remainingOopCents).toBeUndefined();
  });
  it('never assigns the benefit-period deductible twice because an earlier account remains unpaid', () => {
    const r = model({ coverage: 'medicare', priorBenefitDays: 4, partADeductiblePaid: false });
    expect(r.facility?.deductible).toBe(0);
    expect(r.facility?.patientResponsibility).toBe(0);
  });
  it('rejects a reserve bank incompatible with earlier covered reserve days', () => {
    expect(model({ coverage: 'medicare', priorBenefitDays: 100, lifetimeReserveDaysRemaining: 60 }).status).toBe('invalid');
    expect(model({ coverage: 'medicare', priorBenefitDays: 100, lifetimeReserveDaysRemaining: 50 }).status).toBe('modeled');
  });
  it('uses exactly the remaining lifetime reserve day without silently resetting the lifetime bank', () => {
    const input = { coverage: 'medicare' as const, days: 1, priorBenefitDays: 90, partADeductiblePaid: true, lifetimeReserveDaysRemaining: 1 };
    expect(model(input)).toMatchObject({ status: 'modeled', remainingReserveDays: 0 });
    expect(model({ ...input, lifetimeReserveDaysRemaining: 0 }).status).toBe('unsupported');
    expect(model({ ...input, year: 2027 }).facility?.coinsurance).toBe(88800);
  });
  it('does not cap valid commercial liability at the chart’s historical $10,000 scale', () => {
    const r = model({ chargesCents: 4000000, allowedCents: 4000000, deductibleCents: 4000000, oopMaxCents: 4000000 });
    expect(r.ledger?.patientResponsibility).toBe(4000000);
    expect(r.ledger?.primaryPayment).toBe(0);
  });
  it('reconciles deterministic mixed inputs, contributions, assistance and payments in exact cents', () => {
    let seed = 194291;
    const random = (max: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
    for (let i = 0; i < 300; i++) {
      const coverage = COVERAGE_PRESETS[i % COVERAGE_PRESETS.length].id;
      const charges = 5000000 + random(5000000);
      const input = {
        ...presetInput(coverage, charges), allowedCents: 1000000 + random(3000000),
        professional: { chargesCents: 500000, allowedCents: 100000 + random(300000) },
        coinsurancePercent: random(10001) / 100,
        assistancePercent: random(10001) / 100,
        deductibleSatisfiedCents: random(150001),
        oopSpentCents: random(600001),
      };
      const before = adjudicateHospitalBill({ ...input, assistancePercent: 0 });
      expect(before.status).toBe('modeled');
      const secondaryPaymentCents = Math.floor(before.ledger!.patientResponsibility / 3);
      const withAssistance = adjudicateHospitalBill({ ...input, secondaryPaymentCents });
      expect(withAssistance.status).toBe('modeled');
      const patientPaidCents = Math.floor(withAssistance.ledger!.patientResponsibility / 2);
      const r = adjudicateHospitalBill({ ...input, secondaryPaymentCents, patientPaidCents });
      expect(r.status).toBe('modeled');
      expect(ledgerReconciles(r.ledger!)).toBe(true);
      expect(r.ledger!.patientResponsibility).toBeLessThanOrEqual(before.ledger!.patientResponsibility);
      expect(r.ledger!.balance + r.ledger!.patientPaid).toBe(r.ledger!.patientResponsibility);
      expect(r.ledger!.primaryPayment).toBe(before.ledger!.primaryPayment);
    }
  });
});
