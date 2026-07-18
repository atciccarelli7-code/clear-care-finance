import {
  patientEducationReleaseEventSchema,
  patientEducationReleaseRecordSchema,
  patientEducationReleaseStatusSchema,
  type PatientEducationReleaseRecord,
} from "@/lib/patientEducationReleaseRegistry";
import { z } from "zod";

export type PatientEducationReleaseStatus = z.infer<typeof patientEducationReleaseStatusSchema>;
export type PatientEducationReleaseEvent = z.infer<typeof patientEducationReleaseEventSchema>;

const allowedTransitions: Record<PatientEducationReleaseStatus, PatientEducationReleaseStatus[]> = {
  draft: ["draft", "in_review", "retired"],
  in_review: ["draft", "in_review", "pilot_ready", "released", "suspended", "retired"],
  pilot_ready: ["in_review", "pilot_ready", "released", "suspended", "retired"],
  released: ["released", "in_review", "suspended", "recalled", "retired"],
  suspended: ["in_review", "suspended", "recalled", "retired"],
  recalled: ["recalled", "retired"],
  retired: ["retired"],
};

const expectedStatusByEvent: Partial<Record<PatientEducationReleaseEvent["eventType"], PatientEducationReleaseStatus>> = {
  created: "draft",
  submitted_for_review: "in_review",
  gate_reopened: "in_review",
  pilot_authorized: "pilot_ready",
  released: "released",
  suspended: "suspended",
  recalled: "recalled",
  retired: "retired",
};

const sameStatusEvents = new Set<PatientEducationReleaseEvent["eventType"]>([
  "gate_approved",
  "corrected",
]);

export type PatientEducationReleaseTransitionOptions = {
  recall?: PatientEducationReleaseRecord["recall"];
  effectiveAt?: string;
  expiresAt?: string;
};

export const transitionPatientEducationReleaseRecord = (
  recordInput: unknown,
  eventInput: unknown,
  nextStatusInput: unknown,
  options: PatientEducationReleaseTransitionOptions = {},
): PatientEducationReleaseRecord => {
  const record = patientEducationReleaseRecordSchema.parse(recordInput);
  const event = patientEducationReleaseEventSchema.parse(eventInput);
  const nextStatus = patientEducationReleaseStatusSchema.parse(nextStatusInput);

  if (record.events.some((existing) => existing.eventId === event.eventId)) {
    throw new Error(`Duplicate release event ID: ${event.eventId}.`);
  }
  const lastEvent = record.events.at(-1);
  if (lastEvent && event.occurredAt < lastEvent.occurredAt) {
    throw new Error("Release events must be appended chronologically.");
  }
  if (!allowedTransitions[record.status].includes(nextStatus)) {
    throw new Error(`Illegal patient education release transition: ${record.status} to ${nextStatus}.`);
  }

  const expectedStatus = expectedStatusByEvent[event.eventType];
  if (expectedStatus && expectedStatus !== nextStatus) {
    throw new Error(`Release event ${event.eventType} requires status ${expectedStatus}, not ${nextStatus}.`);
  }
  if (sameStatusEvents.has(event.eventType) && nextStatus !== record.status) {
    throw new Error(`Release event ${event.eventType} cannot change status from ${record.status} to ${nextStatus}.`);
  }
  if (!expectedStatus && !sameStatusEvents.has(event.eventType)) {
    throw new Error(`Release event ${event.eventType} has no transition policy.`);
  }

  if (event.eventType === "pilot_authorized" && record.status !== "in_review") {
    throw new Error("Pilot authorization requires an in_review release record.");
  }
  if (event.eventType === "released" && !["in_review", "pilot_ready"].includes(record.status)) {
    throw new Error("Production release requires an in_review or pilot_ready release record.");
  }
  if (event.eventType === "corrected" && !["in_review", "released", "suspended"].includes(record.status)) {
    throw new Error("A correction event requires an in_review, released, or suspended record.");
  }
  if (event.eventType === "recalled" && record.status !== "released" && record.status !== "suspended") {
    throw new Error("Recall requires a released or suspended record.");
  }
  if (nextStatus === "recalled" && !options.recall) {
    throw new Error("Recall transition requires recall instructions.");
  }
  if (nextStatus !== "recalled" && options.recall) {
    throw new Error("Recall instructions may be supplied only for a recalled transition.");
  }

  const effectiveAt = options.effectiveAt
    ?? (["pilot_ready", "released"].includes(nextStatus) ? record.effectiveAt ?? event.occurredAt : record.effectiveAt);
  const expiresAt = options.expiresAt ?? record.expiresAt;

  return patientEducationReleaseRecordSchema.parse({
    ...record,
    status: nextStatus,
    updatedAt: event.occurredAt,
    ...(effectiveAt ? { effectiveAt } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    ...(nextStatus === "recalled" ? { recall: options.recall } : {}),
    events: [...record.events, event],
  });
};

export const canTransitionPatientEducationRelease = (
  currentStatusInput: unknown,
  nextStatusInput: unknown,
) => {
  const currentStatus = patientEducationReleaseStatusSchema.parse(currentStatusInput);
  const nextStatus = patientEducationReleaseStatusSchema.parse(nextStatusInput);
  return allowedTransitions[currentStatus].includes(nextStatus);
};

export const patientEducationReleaseTransitionPolicy = Object.freeze(
  Object.fromEntries(
    Object.entries(allowedTransitions).map(([status, transitions]) => [status, Object.freeze([...transitions])]),
  ),
);
