import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const patientEducationPilotMetricSchema = z.enum([
  "eligible_encounters",
  "education_delivered",
  "education_completed",
  "teach_back_attempted",
  "teach_back_completed",
  "caregiver_included",
  "follow_up_scheduled",
  "support_contact_within_window",
  "emergency_visit_within_window",
  "readmission_within_window",
]);

export const patientEducationPilotAggregateSchema = z.object({
  metric: patientEducationPilotMetricSchema,
  count: z.number().int().nonnegative(),
  denominatorMetric: patientEducationPilotMetricSchema.optional(),
  observationWindowDays: z.number().int().positive().max(365).optional(),
  source: z.enum([
    "education_workflow",
    "ehr_aggregate_report",
    "patient_portal_aggregate",
    "manual_audit_aggregate",
    "claims_aggregate",
  ]),
  validationStatus: z.enum(["unvalidated", "reviewed", "validated"]),
  suppressed: z.boolean(),
});

export const patientEducationPilotAnalyticsBatchSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  batchId: z.string().regex(/^CAF-PE-MEASURE-[A-Z0-9-]+$/),
  pilotId: z.string().regex(/^CAF-PE-PILOT-[A-Z0-9-]+$/),
  organizationKey: z.string().regex(/^[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  reportingPeriod: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  }),
  cohort: z.object({
    cohortKey: z.string().regex(/^[A-Z0-9-]+$/),
    careSetting: z.enum(["inpatient", "observation", "emergency", "ambulatory", "post_acute", "mixed"]),
    implementationPhase: z.enum(["baseline", "pilot", "post_pilot"]),
    locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  }),
  minimumReportableCellSize: z.number().int().min(5).max(50).default(11),
  aggregates: z.array(patientEducationPilotAggregateSchema).min(1),
  privacyAttestation: z.object({
    containsPatientIdentifiers: z.literal(false),
    containsEncounterIdentifiers: z.literal(false),
    containsFreeText: z.literal(false),
    exactPatientTimestampsIncluded: z.literal(false),
    smallCellsSuppressed: z.boolean(),
    attestedByRole: z.string().trim().min(2).max(160),
    attestedAt: z.string().datetime(),
  }),
  interpretationBoundary: z.object({
    causalClaimAllowed: z.literal(false),
    statement: z.string().trim().min(10).max(1000),
  }),
}).superRefine((value, context) => {
  if (value.reportingPeriod.endDate < value.reportingPeriod.startDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Pilot reporting endDate must be on or after startDate." });
  }

  const metrics = value.aggregates.map((aggregate) => aggregate.metric);
  if (new Set(metrics).size !== metrics.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Pilot analytics metrics must be unique within a batch." });
  }

  const byMetric = new Map(value.aggregates.map((aggregate) => [aggregate.metric, aggregate]));
  for (const aggregate of value.aggregates) {
    if (aggregate.denominatorMetric && !byMetric.has(aggregate.denominatorMetric)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Missing denominator metric ${aggregate.denominatorMetric} for ${aggregate.metric}.` });
    }
    if (aggregate.denominatorMetric) {
      const denominator = byMetric.get(aggregate.denominatorMetric);
      if (denominator && aggregate.count > denominator.count) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `${aggregate.metric} count cannot exceed ${aggregate.denominatorMetric}.` });
      }
    }
    const isSmallCell = aggregate.count > 0 && aggregate.count < value.minimumReportableCellSize;
    if (isSmallCell && !aggregate.suppressed) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Small cell ${aggregate.metric} must be suppressed.` });
    }
    if (aggregate.suppressed && !value.privacyAttestation.smallCellsSuppressed) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Suppressed metrics require a positive smallCellsSuppressed attestation." });
    }
    const windowMetric = [
      "support_contact_within_window",
      "emergency_visit_within_window",
      "readmission_within_window",
    ].includes(aggregate.metric);
    if (windowMetric && !aggregate.observationWindowDays) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `${aggregate.metric} requires observationWindowDays.` });
    }
    if (!windowMetric && aggregate.observationWindowDays) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `${aggregate.metric} must not define observationWindowDays.` });
    }
  }
});

export type PatientEducationPilotAnalyticsBatch = z.infer<typeof patientEducationPilotAnalyticsBatchSchema>;

export type PatientEducationPilotMetricRate = {
  metric: z.infer<typeof patientEducationPilotMetricSchema>;
  count: number | null;
  denominatorMetric?: z.infer<typeof patientEducationPilotMetricSchema>;
  denominatorCount?: number;
  rate: number | null;
  suppressed: boolean;
};

export const calculatePatientEducationPilotRates = (
  batchInput: unknown,
): PatientEducationPilotMetricRate[] => {
  const batch = patientEducationPilotAnalyticsBatchSchema.parse(batchInput);
  const byMetric = new Map(batch.aggregates.map((aggregate) => [aggregate.metric, aggregate]));

  return batch.aggregates.map((aggregate) => {
    if (aggregate.suppressed) {
      return {
        metric: aggregate.metric,
        count: null,
        ...(aggregate.denominatorMetric ? { denominatorMetric: aggregate.denominatorMetric } : {}),
        rate: null,
        suppressed: true,
      };
    }
    const denominator = aggregate.denominatorMetric ? byMetric.get(aggregate.denominatorMetric) : undefined;
    const rate = denominator && denominator.count > 0
      ? Math.round((aggregate.count / denominator.count) * 1000) / 10
      : null;
    return {
      metric: aggregate.metric,
      count: aggregate.count,
      ...(aggregate.denominatorMetric ? { denominatorMetric: aggregate.denominatorMetric } : {}),
      ...(denominator ? { denominatorCount: denominator.count } : {}),
      rate,
      suppressed: false,
    };
  });
};

export const assertPatientEducationPilotAnalyticsSafe = (input: unknown) =>
  patientEducationPilotAnalyticsBatchSchema.parse(input);
