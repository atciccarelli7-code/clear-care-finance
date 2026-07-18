import { describe, expect, it } from "vitest";
import {
  appendPatientEducationReleaseEvent,
  validatePatientEducationReleaseRecord,
  type PatientEducationReleaseRecord,
} from "@/lib/patientEducationReleaseRegistry";

const base: PatientEducationReleaseRecord = {
  schemaVersion: "1.0.0",
  packageId: "CAF-PE-BLOOD-THINNERS",
  packageVersion: "1.0.0",
  status: "draft",
  contentHash: "a".repeat(64),
  createdAt: "2026-07-18T12:00:00.000Z",
  updatedAt: "2026-07-18T12:00:00.000Z",
  events: [{
    eventId: "CAF-PE-EVENT-CREATED-001",
    eventType: "created",
    occurredAt: "2026-07-18T12:00:00.000Z",
    actorRole: "Product owner",
    reason: "Initial controlled package record created.",
    evidenceRefs: [],
  }],
};

describe("patient education release registry", () => {
  it("moves a package into pilot-ready state with an auditable event", () => {
    const next = appendPatientEducationReleaseEvent(base, {
      eventId: "CAF-PE-EVENT-PILOT-001",
      eventType: "pilot_authorized",
      occurredAt: "2026-07-20T12:00:00.000Z",
      actorRole: "Release authority",
      reason: "All documented pilot release gates were approved.",
      evidenceRefs: ["gate-register-v1"],
    }, "pilot_ready");

    expect(next.status).toBe("pilot_ready");
    expect(next.effectiveAt).toBe("2026-07-20T12:00:00.000Z");
    expect(next.events).toHaveLength(2);
  });

  it("rejects a released record without a released event", () => {
    expect(validatePatientEducationReleaseRecord({
      ...base,
      status: "released",
      effectiveAt: "2026-07-20T12:00:00.000Z",
    }).success).toBe(false);
  });

  it("requires explicit recall instructions for recalled content", () => {
    expect(validatePatientEducationReleaseRecord({ ...base, status: "recalled" }).success).toBe(false);

    const recalled = {
      ...base,
      status: "recalled",
      updatedAt: "2026-07-21T12:00:00.000Z",
      recall: {
        severity: "critical",
        initiatedAt: "2026-07-21T12:00:00.000Z",
        reason: "Safety-critical statement requires immediate replacement.",
        affectedAssets: ["CAF-PE-BLOOD-THINNERS-FULL"],
        requiredAction: "Stop distribution and replace every controlled copy.",
      },
      events: [...base.events, {
        eventId: "CAF-PE-EVENT-RECALL-001",
        eventType: "recalled",
        occurredAt: "2026-07-21T12:00:00.000Z",
        actorRole: "Clinical governance lead",
        reason: "Safety-critical statement requires immediate replacement.",
        evidenceRefs: ["incident-review-001"],
      }],
    };
    expect(validatePatientEducationReleaseRecord(recalled).success).toBe(true);
  });
});
