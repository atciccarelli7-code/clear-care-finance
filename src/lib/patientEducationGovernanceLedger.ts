import { z } from "zod";
import { sha256Hex } from "@/lib/patientEducationIntegrityManifest";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const patientEducationGovernanceEventTypeSchema = z.enum([
  "source_created",
  "source_changed",
  "evidence_linked",
  "qa_generated",
  "review_submitted",
  "review_approved",
  "review_rejected",
  "localization_applied",
  "institution_overlay_applied",
  "artifact_compiled",
  "integrity_manifest_generated",
  "authorization_evaluated",
  "pilot_distributed",
  "production_distributed",
  "correction_opened",
  "distribution_suspended",
  "content_recalled",
  "content_retired",
]);

export const patientEducationGovernanceEventSchema = z.object({
  eventId: z.string().regex(/^CAF-PE-AUDIT-[A-Z0-9-]+$/),
  sequence: z.number().int().positive(),
  eventType: patientEducationGovernanceEventTypeSchema,
  occurredAt: z.string().datetime(),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/).optional(),
  actorRole: z.string().trim().min(2).max(160),
  actorRef: z.string().trim().min(2).max(300).optional(),
  reason: z.string().trim().min(3).max(2000),
  evidenceRefs: z.array(z.string().trim().min(2).max(500)),
  payloadHash: sha256Schema,
  previousEventHash: sha256Schema.nullable(),
  eventHash: sha256Schema,
});

export const patientEducationGovernanceLedgerSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  ledgerId: z.string().regex(/^CAF-PE-LEDGER-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  createdAt: z.string().datetime(),
  events: z.array(patientEducationGovernanceEventSchema),
}).superRefine((value, context) => {
  for (let index = 0; index < value.events.length; index += 1) {
    const event = value.events[index];
    if (event.sequence !== index + 1) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Governance event sequence must be contiguous at ${event.eventId}.` });
    }
    if (event.packageId !== value.packageId) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Governance event ${event.eventId} belongs to another package.` });
    }
    const expectedPrevious = index === 0 ? null : value.events[index - 1].eventHash;
    if (event.previousEventHash !== expectedPrevious) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Governance event ${event.eventId} has an invalid previous-event hash.` });
    }
    if (index > 0 && event.occurredAt < value.events[index - 1].occurredAt) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Governance event ${event.eventId} is not chronological.` });
    }
  }
});

export type PatientEducationGovernanceEvent = z.infer<typeof patientEducationGovernanceEventSchema>;
export type PatientEducationGovernanceLedger = z.infer<typeof patientEducationGovernanceLedgerSchema>;
export type PatientEducationGovernanceEventInput = Omit<
  PatientEducationGovernanceEvent,
  "sequence" | "payloadHash" | "previousEventHash" | "eventHash"
> & {
  payload: unknown;
};

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
};

const canonicalEventPayload = (event: Omit<PatientEducationGovernanceEvent, "eventHash">) => JSON.stringify(canonicalize(event));

export const createPatientEducationGovernanceLedger = ({
  ledgerId,
  packageId,
  createdAt,
}: {
  ledgerId: string;
  packageId: string;
  createdAt: string;
}): PatientEducationGovernanceLedger => patientEducationGovernanceLedgerSchema.parse({
  schemaVersion: "1.0.0",
  ledgerId,
  packageId,
  createdAt,
  events: [],
});

export const appendPatientEducationGovernanceEvent = async (
  ledgerInput: unknown,
  eventInput: PatientEducationGovernanceEventInput,
): Promise<PatientEducationGovernanceLedger> => {
  const ledger = patientEducationGovernanceLedgerSchema.parse(ledgerInput);
  if (eventInput.packageId !== ledger.packageId) {
    throw new Error(`Governance event package ${eventInput.packageId} does not match ledger package ${ledger.packageId}.`);
  }
  if (ledger.events.some((event) => event.eventId === eventInput.eventId)) {
    throw new Error(`Duplicate governance event ID: ${eventInput.eventId}.`);
  }
  const lastEvent = ledger.events.at(-1);
  if (lastEvent && eventInput.occurredAt < lastEvent.occurredAt) {
    throw new Error("Governance events must be appended chronologically.");
  }

  const payloadHash = await sha256Hex(JSON.stringify(canonicalize(eventInput.payload)));
  const eventWithoutHash: Omit<PatientEducationGovernanceEvent, "eventHash"> = {
    eventId: eventInput.eventId,
    sequence: ledger.events.length + 1,
    eventType: eventInput.eventType,
    occurredAt: eventInput.occurredAt,
    packageId: eventInput.packageId,
    packageVersion: eventInput.packageVersion,
    ...(eventInput.documentId ? { documentId: eventInput.documentId } : {}),
    actorRole: eventInput.actorRole,
    ...(eventInput.actorRef ? { actorRef: eventInput.actorRef } : {}),
    reason: eventInput.reason,
    evidenceRefs: [...eventInput.evidenceRefs],
    payloadHash,
    previousEventHash: lastEvent?.eventHash ?? null,
  };
  const event: PatientEducationGovernanceEvent = patientEducationGovernanceEventSchema.parse({
    ...eventWithoutHash,
    eventHash: await sha256Hex(canonicalEventPayload(eventWithoutHash)),
  });

  return patientEducationGovernanceLedgerSchema.parse({
    ...ledger,
    events: [...ledger.events, event],
  });
};

export const verifyPatientEducationGovernanceLedger = async (ledgerInput: unknown) => {
  const parsed = patientEducationGovernanceLedgerSchema.safeParse(ledgerInput);
  if (!parsed.success) {
    return {
      valid: false,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const issues: string[] = [];
  for (const event of parsed.data.events) {
    const { eventHash, ...eventWithoutHash } = event;
    const recalculated = await sha256Hex(canonicalEventPayload(eventWithoutHash));
    if (eventHash !== recalculated) issues.push(`Event hash mismatch: ${event.eventId}`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};
