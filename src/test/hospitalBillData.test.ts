import { describe, expect, it } from 'vitest';
import rawSnapshot from '../../docs/data/hospital-bill/cms-2024-charlotte.json';
import { hospitalBenchmarks, hospitalBillSources } from '@/data/hospitalBillSources';
import { hospitalBillScenarios, scenarioGrossCents } from '@/data/hospitalBillScenarios';
import { adjudicateHospitalBill, COVERAGE_PRESETS, ledgerReconciles, presetInput } from '@/lib/hospitalBillEngine';

describe('hospital bill evidence and scenario integrity', () => {
  it('preserves the independently retrieved CMS amounts and record provenance without conflating payment fields', () => {
    const records = rawSnapshot.queries.flatMap(query => query.rows);
    expect(records).toHaveLength(4);
    expect(hospitalBenchmarks).toHaveLength(records.length);
    for (const record of records) {
      const published = hospitalBenchmarks.find(row => row.recordId === record.record_id);
      expect(published).toBeDefined();
      expect(published).toMatchObject({
        ccn: record.values.Rndrng_Prvdr_CCN,
        hospital: record.values.Rndrng_Prvdr_Org_Name,
        drg: record.values.DRG_Cd,
        discharges: Number(record.values.Tot_Dschrgs),
        averageCoveredCharges: Number(record.values.Avg_Submtd_Cvrd_Chrg),
        averageTotalPayments: Number(record.values.Avg_Tot_Pymt_Amt),
        averageMedicarePayments: Number(record.values.Avg_Mdcr_Pymt_Amt),
        sourceUrl: record.source_url,
        publishedAt: record.publication_date,
        reportingYear: Number(record.reporting_period.slice(0, 4)),
      });
      expect(published!.averageTotalPayments).toBeGreaterThanOrEqual(published!.averageMedicarePayments);
      expect(published!.discharges).toBeGreaterThan(10);
      expect(published!.ccn).toMatch(/^\d{6}$/);
    }
    const pneumonia = hospitalBenchmarks.find(row => row.ccn === '340053' && row.drg === '194');
    expect(pneumonia!.averageMedicarePayments).toBe(5686.375);
    expect(pneumonia!.averageMedicarePayments).not.toBe(7541 - 1736);
  });

  it('does not silently mix comparison years or datasets within a displayed DRG', () => {
    for (const drg of new Set(hospitalBenchmarks.map(row => row.drg))) {
      const rows = hospitalBenchmarks.filter(row => row.drg === drg);
      expect(rows.length).toBeGreaterThan(1);
      expect(new Set(rows.map(row => row.ccn)).size).toBe(rows.length);
      expect(new Set(rows.map(row => row.reportingYear)).size).toBe(1);
      expect(new Set(rows.map(row => row.datasetVersion)).size).toBe(1);
      expect(new Set(rows.map(row => row.description)).size).toBe(1);
    }
    expect(rawSnapshot.queries.every(query => !query.has_more && !query.pagination_limited && !query.truncated_values)).toBe(true);
  });

  it('requires complete source references and keeps observation outside inpatient benchmarks', () => {
    const ids = hospitalBillSources.map(source => source.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const source of hospitalBillSources) {
      expect(new URL(source.url).protocol).toBe('https:');
      expect(source.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.scope.length).toBeGreaterThan(20);
      expect(source.limitations.length).toBeGreaterThan(20);
    }
    for (const scenario of hospitalBillScenarios) {
      for (const sourceId of scenario.sourceIds) expect(ids).toContain(sourceId);
      if (scenario.benchmarkDrg) expect(hospitalBenchmarks.some(row => row.drg === scenario.benchmarkDrg)).toBe(true);
      if (scenario.classification === 'observation') {
        expect(scenario.inpatientDays).toBe(0);
        expect(scenario.benchmarkDrg).toBeUndefined();
        expect(scenario.limitations.join(' ')).toContain('No Original Medicare outpatient facility estimate');
      }
      expect(scenario.limitations.join(' ')).toContain('fictional');
      expect(scenario.items.every(line => Number.isSafeInteger(line.unitChargeCents) && line.unitChargeCents >= 0 && Number.isInteger(line.quantity) && line.quantity > 0)).toBe(true);
      expect(new Set(scenario.items.map(line => line.id)).size).toBe(scenario.items.length);
      expect(scenario.illustrativeAllowedCents).toBeLessThanOrEqual(scenarioGrossCents(scenario));
    }
  });

  it('reconciles every complete inpatient story and coverage arrangement with separate professional claims', () => {
    for (const scenario of hospitalBillScenarios.filter(value => value.classification === 'inpatient')) {
      const dateDays = (Date.parse(scenario.dates.discharge) - Date.parse(scenario.dates.admission)) / 86_400_000;
      expect(scenario.inpatientDays).toBe(dateDays);
      for (const coverage of COVERAGE_PRESETS) for (const year of [2026, 2027] as const) {
        const result = adjudicateHospitalBill({
          ...presetInput(coverage.id, scenarioGrossCents(scenario), scenario.inpatientDays, year),
          allowedCents: scenario.illustrativeAllowedCents,
          professional: { chargesCents: scenario.professionalChargesCents, allowedCents: scenario.professionalAllowedCents },
        });
        expect(result.status, `${scenario.id}/${coverage.id}/${year}`).toBe('modeled');
        expect(ledgerReconciles(result.facility!)).toBe(true);
        expect(ledgerReconciles(result.professional!)).toBe(true);
        expect(ledgerReconciles(result.ledger!)).toBe(true);
        expect(result.ledger!.charges).toBe(scenarioGrossCents(scenario) + scenario.professionalChargesCents);
      }
    }
    const original = hospitalBillScenarios.find(scenario => scenario.id === 'pneumonia')!;
    const delayed = hospitalBillScenarios.find(scenario => scenario.id === 'delayed-discharge')!;
    expect(scenarioGrossCents(original)).toBe(3_505_500);
    expect(scenarioGrossCents(delayed)).toBeGreaterThan(scenarioGrossCents(original));
    expect(delayed.illustrativeAllowedCents).toBe(original.illustrativeAllowedCents);
    expect(delayed.limitations.join(' ')).toContain('counterfactual');
  });
});
