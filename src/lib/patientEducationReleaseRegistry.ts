import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const dateTimeSchema = z.string().datetime();

export const patientEducationReleaseStatusSchema = z.enum([
  "draft",
  "in_review",
  "pilot_ready",
  "released",
  "suspended",
  "recalled",
  "retired",
]);

export const patientEducationReleaseEventSchema = z.object({
  eventId: z.string().regex(/^CAF-PE-EVENT-[A-Z0-9-]+$/),
  eventType: z.enum([
    "created",
    "submitted_for_review",
    "gate_approved",
    "gate_reopened",
    "pilot_authorized",
    "released",
    "corrected",
    "suspended",
    "recalled",
    "retired",
  ]),
  occurredAt: dateTimeSchema,
  actorRole: z.string().trim().min(2).max(160),
  reason: z.string().trim().min(3).max(2000),
  evidenceRefs: z.array(z.string().trim().min(2).max(500)),
});

export const patientEducationReleaseRecordSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  status: patientEducationReleaseStatusSchema,
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  effectiveAt: dateTimeSchema.optional(),
  expiresAt: dateTimeSchema.optional(),
  supersedesVersion: semverSchema.optional(),
  recall: z.object({
    severity: z.enum(["advisory", "important", "critical"]),
    initiatedAt: dateTimeSchema,
    reason: z.string().trim().min(3).max(2000),
    affectedAssets: z.array(z.string().trim().min(2).max(300)).min(1),
    requiredAction: z.string().trim().min(3).max(2000),
  }).optional(),
  events: z.array(patientEducationReleaseEventSchema).min(1),
}).superRefine((value, context) => {
  const eventIds = value.events.map((event) => event.eventId);
  if (new Set(eventIds).size !== eventIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Release event IDs must be unique." });
  }

  const sorted = [...value.events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  if (JSON.stringify(sorted.map((event) => event.eventId)) !== JSON.stringify(value.events.map((event) => event.eventId))) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Release events must be chronological." });
  }

  if (["pilot_ready", "released"].includes(value.status) && !value.effectiveAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `${value.status} records require effectiveAt.` });
  }

  if (value.status === "released" && !value.events.some((event) => event.eventType === "released")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Released records require a released event." });
  }

  if (value.status === "recalled" && !value.recall) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recalled records require recall instructions." });
  }

  if (value.status !== "recalled" && value.recall) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recall instructions are only valid for recalled records." });
  }

  if (value.expiresAt && value.effectiveAt && value.expiresAt <= value.effectiveAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "expiresAt must be later than effectiveAt." });
  }
});

export type PatientEducationReleaseRecord = z.infer<typeof patientEducationReleaseRecordSchema>;

export const validatePatientEducationReleaseRecord = (value: unknown) =>
  patientEducationReleaseRecordSchema.safeParse(value);

export const appendPatientEducationReleaseEvent = (
  record: PatientEducationReleaseRecord,
  event: z.infer<typeof patientEducationReleaseEventSchema>,
  nextStatus: z.infer<typeof patientEducationReleaseStatusSchema>,
): PatientEducationReleaseRecord => patientEducationReleaseRecordSchema.parse({
  ...record,
  status: nextStatus,
  updatedAt: event.occurredAt,
  events: [...record.events, event],
  effectiveAt: ["pilot_ready", "released"].includes(nextStatus) ? record.effectiveAt ?? event.occurredAt : record.effectiveAt,
});
