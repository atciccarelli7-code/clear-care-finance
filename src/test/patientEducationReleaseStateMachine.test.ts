import { describe, expect, it } from "vitest";
import {
  canTransitionPatientEducationRelease,
  transitionPatientEducationReleaseRecord,
} from "@/lib/patientEducationReleaseStateMachine";

const baseRecord = {
  schemaVersion: "1.0.0" as const,
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  status: "draft" as const,
  contentHash: "a".repeat(64),
  createdAt: "2026-07-18T12:00:00.000Z",
  updatedAt: "2026-07-18T12:00:00.000Z",
  events: [
    {
      eventId: "CAF-PE-EVENT-STATE-CREATED",
      eventType: "created" as const,
      occurredAt: "2026-07-18T12:00:00.000Z",
      actorRole: "Product owner",
      reason: "Create the release record.",
      evidenceRefs: [],
    },
  ],
};

describe("patientEducationReleaseStateMachine", () => {
  it("supports the governed draft to review to pilot to release path", () => {
    const inReview = transitionPatientEducationReleaseRecord(baseRecord, {
      eventId: "CAF-PE-EVENT-STATE-REVIEW",
      eventType: "submitted_for_review",
      occurredAt: "2026-07-18T12:10:00.000Z",
      actorRole: "Product owner",
      reason: "Submit the package for review.",
      evidenceRefs: [],
    }, "in_review");

    const pilotReady = transitionPatientEducationReleaseRecord(inReview, {
      eventId: "CAF-PE-EVENT-STATE-PILOT",
      eventType: "pilot_authorized",
      occurredAt: "2026-07-18T12:20:00.000Z",
      actorRole: "Release authority",
      reason: "Authorize the controlled pilot.",
      evidenceRefs: ["CAF-PE-AUTH-DEMO"],
    }, "pilot_ready");

    const released = transitionPatientEducationReleaseRecord(pilotReady, {
      eventId: "CAF-PE-EVENT-STATE-RELEASED",
      eventType: "released",
      occurredAt: "2026-07-18T12:30:00.000Z",
      actorRole: "Release authority",
      reason: "Authorize production distribution.",
      evidenceRefs: ["CAF-PE-INTEGRITY-DEMO"],
    }, "released");

    expect(released.status).toBe("released");
    expect(released.effectiveAt).toBe("2026-07-18T12:20:00.000Z");
    expect(released.events.map((event) => event.eventType)).toEqual([
      "created",
      "submitted_for_review",
      "pilot_authorized",
      "released",
    ]);
  });

  it("blocks a draft from jumping directly to release", () => {
    expect(() => transitionPatientEducationReleaseRecord(baseRecord, {
      eventId: "CAF-PE-EVENT-STATE-ILLEGAL-RELEASE",
      eventType: "released",
      occurredAt: "2026-07-18T12:10:00.000Z",
      actorRole: "Release authority",
      reason: "Attempt an illegal direct release.",
      evidenceRefs: [],
    }, "released")).toThrow("Illegal patient education release transition");
  });

  it("requires event type and target status to agree", () => {
    expect(() => transitionPatientEducationReleaseRecord(baseRecord, {
      eventId: "CAF-PE-EVENT-STATE-WRONG-TARGET",
      eventType: "submitted_for_review",
      occurredAt: "2026-07-18T12:10:00.000Z",
      actorRole: "Product owner",
      reason: "Attempt an inconsistent transition.",
      evidenceRefs: [],
    }, "retired")).toThrow("requires status in_review");
  });

  it("requires recall instructions and keeps recalled versions terminal", () => {
    const released = {
      ...baseRecord,
      status: "released" as const,
      updatedAt: "2026-07-18T12:30:00.000Z",
      effectiveAt: "2026-07-18T12:30:00.000Z",
      events: [
        ...baseRecord.events,
        {
          eventId: "CAF-PE-EVENT-STATE-RELEASE-FIXTURE",
          eventType: "released" as const,
          occurredAt: "2026-07-18T12:30:00.000Z",
          actorRole: "Release authority",
          reason: "Create a released-state fixture.",
          evidenceRefs: [],
        },
      ],
    };

    expect(() => transitionPatientEducationReleaseRecord(released, {
      eventId: "CAF-PE-EVENT-STATE-RECALL-NO-INSTRUCTIONS",
      eventType: "recalled",
      occurredAt: "2026-07-18T12:40:00.000Z",
      actorRole: "Safety authority",
      reason: "Recall without instructions.",
      evidenceRefs: [],
    }, "recalled")).toThrow("requires recall instructions");

    const recalled = transitionPatientEducationReleaseRecord(released, {
      eventId: "CAF-PE-EVENT-STATE-RECALLED",
      eventType: "recalled",
      occurredAt: "2026-07-18T12:40:00.000Z",
      actorRole: "Safety authority",
      reason: "Recall the affected version.",
      evidenceRefs: ["SAFETY-CASE-DEMO"],
    }, "recalled", {
      recall: {
        severity: "critical",
        initiatedAt: "2026-07-18T12:40:00.000Z",
        reason: "A synthetic critical safety defect was identified.",
        affectedAssets: ["CAF-PE-DEMO-FULL-GUIDE"],
        requiredAction: "Stop distribution and replace the affected version.",
      },
    });

    expect(recalled.status).toBe("recalled");
    expect(canTransitionPatientEducationRelease("recalled", "released")).toBe(false);
    expect(() => transitionPatientEducationReleaseRecord(recalled, {
      eventId: "CAF-PE-EVENT-STATE-REENTER",
      eventType: "released",
      occurredAt: "2026-07-18T12:50:00.000Z",
      actorRole: "Release authority",
      reason: "Attempt to re-enter circulation.",
      evidenceRefs: [],
    }, "released")).toThrow("Illegal patient education release transition");
  });

  it("permits same-state correction events only in governed states", () => {
    const released = {
      ...baseRecord,
      status: "released" as const,
      updatedAt: "2026-07-18T12:30:00.000Z",
      effectiveAt: "2026-07-18T12:30:00.000Z",
      events: [
        ...baseRecord.events,
        {
          eventId: "CAF-PE-EVENT-STATE-CORRECTION-FIXTURE",
          eventType: "released" as const,
          occurredAt: "2026-07-18T12:30:00.000Z",
          actorRole: "Release authority",
          reason: "Create a released fixture.",
          evidenceRefs: [],
        },
      ],
    };

    const corrected = transitionPatientEducationReleaseRecord(released, {
      eventId: "CAF-PE-EVENT-STATE-CORRECTED",
      eventType: "corrected",
      occurredAt: "2026-07-18T12:35:00.000Z",
      actorRole: "Correction owner",
      reason: "Record a non-state-changing correction event.",
      evidenceRefs: ["CHANGE-REPORT-DEMO"],
    }, "released");
    expect(corrected.status).toBe("released");
    expect(corrected.events.at(-1)?.eventType).toBe("corrected");
  });
});
