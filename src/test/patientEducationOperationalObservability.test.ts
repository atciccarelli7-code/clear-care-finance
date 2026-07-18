import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationOperationalHealth,
  patientEducationOperationalEventSchema,
} from "@/lib/patientEducationOperationalObservability";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-SLO-POLICY-DEMO",
  windowStart: "2026-07-18T00:00:00.000Z",
  windowEnd: "2026-07-19T00:00:00.000Z",
  objectives: [
    {
      objectiveId: "CAF-PE-SLO-INTEGRITY",
      metric: "integrity_success_rate" as const,
      minimumPercent: 99,
      minimumSampleSize: 5,
      severityOnBreach: "critical" as const,
    },
    {
      objectiveId: "CAF-PE-SLO-RECALL-ACK",
      metric: "control_notice_ack_on_time_rate" as const,
      minimumPercent: 95,
      minimumSampleSize: 2,
      severityOnBreach: "critical" as const,
    },
    {
      objectiveId: "CAF-PE-SLO-DELIVERY",
      metric: "delivery_acceptance_rate" as const,
      minimumPercent: 90,
      minimumSampleSize: 10,
      severityOnBreach: "warning" as const,
    },
  ],
};

const event = (
  suffix: string,
  eventType:
    | "integrity_verification_succeeded"
    | "integrity_verification_failed"
    | "control_notice_acknowledged_on_time"
    | "control_notice_acknowledgment_overdue"
    | "delivery_accepted"
    | "delivery_rejected",
  aggregateCount = 1,
) => ({
  schemaVersion: "1.0.0" as const,
  eventId: `CAF-PE-OPS-EVENT-${suffix}`,
  eventType,
  occurredAt: "2026-07-18T12:00:00.000Z",
  environment: "production" as const,
  component: eventType.startsWith("integrity")
    ? "integrity" as const
    : eventType.startsWith("control")
      ? "recall_control" as const
      : "delivery" as const,
  organizationKey: "DEMO-HOSPITAL",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  operationRef: `operation://${suffix.toLowerCase()}`,
  outcomeCode: eventType.toUpperCase(),
  aggregateCount,
  dimensions: {
    channel: eventType.startsWith("delivery") ? "patient_portal" : "governance",
  },
  containsPatientLevelData: false as const,
  containsFreeTextCaseNarrative: false as const,
});

describe("patientEducationOperationalObservability", () => {
  it("reports healthy objectives and insufficient data without manufacturing a breach", () => {
    const result = evaluatePatientEducationOperationalHealth({
      events: [
        event("INTEGRITY-OK", "integrity_verification_succeeded", 100),
        event("ACK-OK", "control_notice_acknowledged_on_time", 20),
        event("DELIVERY-OK", "delivery_accepted", 100),
      ],
      policy,
      evaluatedAt: "2026-07-19T00:05:00.000Z",
    });
    expect(result.state).toBe("healthy");
    expect(result.incidentRequired).toBe(false);
    expect(result.metrics.every((metric) => metric.status === "met")).toBe(true);
  });

  it("opens a critical incident when integrity verification degrades", () => {
    const result = evaluatePatientEducationOperationalHealth({
      events: [
        event("INTEGRITY-OK", "integrity_verification_succeeded", 98),
        event("INTEGRITY-FAIL", "integrity_verification_failed", 2),
        event("ACK-OK", "control_notice_acknowledged_on_time", 20),
        event("DELIVERY-OK", "delivery_accepted", 100),
      ],
      policy,
      evaluatedAt: "2026-07-19T00:05:00.000Z",
    });
    expect(result.state).toBe("critical");
    expect(result.incidentRequired).toBe(true);
    expect(result.breachedObjectiveIds).toContain("CAF-PE-SLO-INTEGRITY");
  });

  it("treats overdue recall acknowledgment as critical", () => {
    const result = evaluatePatientEducationOperationalHealth({
      events: [
        event("INTEGRITY-OK", "integrity_verification_succeeded", 100),
        event("ACK-OK", "control_notice_acknowledged_on_time", 19),
        event("ACK-OVERDUE", "control_notice_acknowledgment_overdue", 1),
        event("DELIVERY-OK", "delivery_accepted", 100),
      ],
      policy,
      evaluatedAt: "2026-07-19T00:05:00.000Z",
    });
    expect(result.state).toBe("critical");
    expect(result.breachedObjectiveIds).toContain("CAF-PE-SLO-RECALL-ACK");
  });

  it("returns insufficient data for objectives below their minimum sample size", () => {
    const result = evaluatePatientEducationOperationalHealth({
      events: [event("DELIVERY-SMALL", "delivery_rejected", 2)],
      policy,
      evaluatedAt: "2026-07-19T00:05:00.000Z",
    });
    const deliveryMetric = result.metrics.find((metric) => metric.metric === "delivery_acceptance_rate");
    expect(deliveryMetric?.status).toBe("insufficient_data");
    expect(result.state).toBe("healthy");
  });

  it("excludes events outside the policy window", () => {
    const outside = {
      ...event("OUTSIDE", "integrity_verification_failed", 50),
      occurredAt: "2026-07-17T23:59:59.000Z",
    };
    const result = evaluatePatientEducationOperationalHealth({
      events: [outside, event("INSIDE", "integrity_verification_succeeded", 100)],
      policy,
      evaluatedAt: "2026-07-19T00:05:00.000Z",
    });
    expect(result.excludedEventIds).toEqual([outside.eventId]);
    expect(result.state).toBe("healthy");
  });

  it("rejects telemetry dimensions capable of carrying patient-level data", () => {
    const result = patientEducationOperationalEventSchema.safeParse({
      ...event("UNSAFE", "delivery_accepted"),
      dimensions: {
        patient_name: "Synthetic Person",
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/patient-level/i);
  });
});
