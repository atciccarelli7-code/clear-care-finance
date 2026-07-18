import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const dimensionValueSchema = z.string().trim().min(1).max(300);

export const patientEducationOperationalEventTypeSchema = z.enum([
  "compile_succeeded",
  "compile_failed",
  "integrity_verification_succeeded",
  "integrity_verification_failed",
  "authorization_succeeded",
  "authorization_blocked",
  "delivery_accepted",
  "delivery_rejected",
  "delivery_revoked",
  "evidence_check_on_time",
  "evidence_check_overdue",
  "access_allowed",
  "access_blocked",
  "control_notice_issued",
  "control_notice_acknowledged_on_time",
  "control_notice_acknowledgment_overdue",
  "migration_succeeded",
  "migration_failed",
  "backup_verified",
  "restore_test_succeeded",
  "restore_test_failed",
]);

export const patientEducationOperationalEventSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  eventId: z.string().regex(/^CAF-PE-OPS-EVENT-[A-Z0-9-]+$/),
  eventType: patientEducationOperationalEventTypeSchema,
  occurredAt: z.string().datetime(),
  environment: z.enum(["test", "preview", "production"]),
  component: z.enum([
    "compiler",
    "integrity",
    "authorization",
    "delivery",
    "evidence_monitor",
    "access_control",
    "recall_control",
    "migration",
    "backup_restore",
  ]),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/).optional(),
  packageVersion: semverSchema.optional(),
  operationRef: z.string().trim().min(3).max(500),
  outcomeCode: z.string().regex(/^[A-Z0-9_]+$/),
  durationMs: z.number().int().nonnegative().max(86_400_000).optional(),
  aggregateCount: z.number().int().nonnegative().max(1_000_000_000).optional(),
  dimensions: z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), dimensionValueSchema),
  containsPatientLevelData: z.literal(false),
  containsFreeTextCaseNarrative: z.literal(false),
}).superRefine((value, context) => {
  if ((value.packageId && !value.packageVersion) || (!value.packageId && value.packageVersion)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Operational events must include both packageId and packageVersion or neither." });
  }
  const forbiddenKey = /(patient|mrn|dob|birth|encounter|member|subscriber|claim|diagnosis|medication|prescription|name|email|phone|address|case|narrative|note|message)/i;
  for (const key of Object.keys(value.dimensions)) {
    if (forbiddenKey.test(key)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Operational dimension ${key} may contain patient-level or free-text data.` });
    }
  }
});

export const patientEducationOperationalObjectiveSchema = z.object({
  objectiveId: z.string().regex(/^CAF-PE-SLO-[A-Z0-9-]+$/),
  metric: z.enum([
    "compile_success_rate",
    "integrity_success_rate",
    "authorization_success_rate",
    "delivery_acceptance_rate",
    "evidence_check_on_time_rate",
    "control_notice_ack_on_time_rate",
    "restore_test_success_rate",
  ]),
  minimumPercent: z.number().min(0).max(100),
  minimumSampleSize: z.number().int().positive().max(1_000_000),
  severityOnBreach: z.enum(["warning", "critical"]),
});

export const patientEducationOperationalSloPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-SLO-POLICY-[A-Z0-9-]+$/),
  windowStart: z.string().datetime(),
  windowEnd: z.string().datetime(),
  objectives: z.array(patientEducationOperationalObjectiveSchema).min(1),
}).superRefine((value, context) => {
  if (new Date(value.windowEnd) <= new Date(value.windowStart)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "SLO window end must occur after its start." });
  }
  const metricIds = value.objectives.map((objective) => objective.metric);
  if (new Set(metricIds).size !== metricIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "SLO metrics must be unique within a policy." });
  }
});

export const patientEducationOperationalMetricResultSchema = z.object({
  objectiveId: z.string(),
  metric: patientEducationOperationalObjectiveSchema.shape.metric,
  numerator: z.number().int().nonnegative(),
  denominator: z.number().int().nonnegative(),
  observedPercent: z.number().min(0).max(100).optional(),
  minimumPercent: z.number().min(0).max(100),
  status: z.enum(["insufficient_data", "met", "breached"]),
  severityOnBreach: z.enum(["warning", "critical"]),
});

export const patientEducationOperationalHealthResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string(),
  evaluatedAt: z.string().datetime(),
  state: z.enum(["healthy", "degraded", "critical"]),
  metrics: z.array(patientEducationOperationalMetricResultSchema),
  incidentRequired: z.boolean(),
  breachedObjectiveIds: z.array(z.string()),
  excludedEventIds: z.array(z.string()),
});

const metricEventPairs = {
  compile_success_rate: { positive: ["compile_succeeded"], negative: ["compile_failed"] },
  integrity_success_rate: { positive: ["integrity_verification_succeeded"], negative: ["integrity_verification_failed"] },
  authorization_success_rate: { positive: ["authorization_succeeded"], negative: ["authorization_blocked"] },
  delivery_acceptance_rate: { positive: ["delivery_accepted"], negative: ["delivery_rejected"] },
  evidence_check_on_time_rate: { positive: ["evidence_check_on_time"], negative: ["evidence_check_overdue"] },
  control_notice_ack_on_time_rate: { positive: ["control_notice_acknowledged_on_time"], negative: ["control_notice_acknowledgment_overdue"] },
  restore_test_success_rate: { positive: ["restore_test_succeeded"], negative: ["restore_test_failed"] },
} as const;

export const evaluatePatientEducationOperationalHealth = ({
  events: rawEvents,
  policy: rawPolicy,
  evaluatedAt = new Date().toISOString(),
}: {
  events: unknown[];
  policy: unknown;
  evaluatedAt?: string;
}) => {
  const events = rawEvents.map((event) => patientEducationOperationalEventSchema.parse(event));
  const policy = patientEducationOperationalSloPolicySchema.parse(rawPolicy);
  if (new Set(events.map((event) => event.eventId)).size !== events.length) {
    throw new Error("Operational event IDs must be unique.");
  }
  const inWindow = events.filter((event) =>
    new Date(event.occurredAt) >= new Date(policy.windowStart)
    && new Date(event.occurredAt) < new Date(policy.windowEnd),
  );
  const excludedEventIds = events.filter((event) => !inWindow.includes(event)).map((event) => event.eventId).sort();

  const metrics = policy.objectives.map((objective) => {
    const pair = metricEventPairs[objective.metric];
    const relevant = inWindow.filter((event) =>
      (pair.positive as readonly string[]).includes(event.eventType)
      || (pair.negative as readonly string[]).includes(event.eventType),
    );
    const eventWeight = (event: z.infer<typeof patientEducationOperationalEventSchema>) => event.aggregateCount ?? 1;
    const numerator = relevant
      .filter((event) => (pair.positive as readonly string[]).includes(event.eventType))
      .reduce((sum, event) => sum + eventWeight(event), 0);
    const denominator = relevant.reduce((sum, event) => sum + eventWeight(event), 0);
    const observedPercent = denominator > 0 ? Number(((numerator / denominator) * 100).toFixed(4)) : undefined;
    const status = denominator < objective.minimumSampleSize
      ? "insufficient_data"
      : observedPercent! >= objective.minimumPercent
        ? "met"
        : "breached";
    return patientEducationOperationalMetricResultSchema.parse({
      objectiveId: objective.objectiveId,
      metric: objective.metric,
      numerator,
      denominator,
      ...(observedPercent === undefined ? {} : { observedPercent }),
      minimumPercent: objective.minimumPercent,
      status,
      severityOnBreach: objective.severityOnBreach,
    });
  });

  const breached = metrics.filter((metric) => metric.status === "breached");
  const state = breached.some((metric) => metric.severityOnBreach === "critical")
    ? "critical"
    : breached.length > 0
      ? "degraded"
      : "healthy";

  return patientEducationOperationalHealthResultSchema.parse({
    schemaVersion: "1.0.0",
    policyId: policy.policyId,
    evaluatedAt,
    state,
    metrics,
    incidentRequired: state === "critical",
    breachedObjectiveIds: breached.map((metric) => metric.objectiveId).sort(),
    excludedEventIds,
  });
};
