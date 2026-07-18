import { describe, expect, it } from "vitest";
import {
  calculatePatientEducationPilotRates,
  patientEducationPilotAnalyticsBatchSchema,
} from "@/lib/patientEducationPilotAnalyticsContract";

const batch = {
  schemaVersion: "1.0.0" as const,
  batchId: "CAF-PE-MEASURE-DEMO-JULY",
  pilotId: "CAF-PE-PILOT-DEMO",
  organizationKey: "DEMO-HOSPITAL",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  reportingPeriod: {
    startDate: "2026-07-01",
    endDate: "2026-07-31",
  },
  cohort: {
    cohortKey: "OBSERVATION-UNIT-AGGREGATE",
    careSetting: "observation" as const,
    implementationPhase: "pilot" as const,
    locale: "en-US",
  },
  minimumReportableCellSize: 11,
  aggregates: [
    {
      metric: "eligible_encounters" as const,
      count: 120,
      source: "ehr_aggregate_report" as const,
      validationStatus: "validated" as const,
      suppressed: false,
    },
    {
      metric: "education_delivered" as const,
      count: 96,
      denominatorMetric: "eligible_encounters" as const,
      source: "education_workflow" as const,
      validationStatus: "validated" as const,
      suppressed: false,
    },
    {
      metric: "teach_back_completed" as const,
      count: 72,
      denominatorMetric: "education_delivered" as const,
      source: "education_workflow" as const,
      validationStatus: "reviewed" as const,
      suppressed: false,
    },
    {
      metric: "readmission_within_window" as const,
      count: 8,
      denominatorMetric: "eligible_encounters" as const,
      observationWindowDays: 30,
      source: "ehr_aggregate_report" as const,
      validationStatus: "unvalidated" as const,
      suppressed: true,
    },
  ],
  privacyAttestation: {
    containsPatientIdentifiers: false as const,
    containsEncounterIdentifiers: false as const,
    containsFreeText: false as const,
    exactPatientTimestampsIncluded: false as const,
    smallCellsSuppressed: true,
    attestedByRole: "Privacy and analytics reviewer",
    attestedAt: "2026-08-01T12:00:00.000Z",
  },
  interpretationBoundary: {
    causalClaimAllowed: false as const,
    statement: "These aggregate pilot observations do not establish that the education package caused any clinical outcome change.",
  },
};

describe("patientEducationPilotAnalyticsContract", () => {
  it("accepts aggregate-only pilot measurement with small-cell suppression", () => {
    expect(patientEducationPilotAnalyticsBatchSchema.safeParse(batch).success).toBe(true);
  });

  it("calculates only non-suppressed aggregate rates", () => {
    const rates = calculatePatientEducationPilotRates(batch);
    expect(rates.find((metric) => metric.metric === "education_delivered")).toEqual({
      metric: "education_delivered",
      count: 96,
      denominatorMetric: "eligible_encounters",
      denominatorCount: 120,
      rate: 80,
      suppressed: false,
    });
    expect(rates.find((metric) => metric.metric === "teach_back_completed")?.rate).toBe(75);
    expect(rates.find((metric) => metric.metric === "readmission_within_window")).toEqual({
      metric: "readmission_within_window",
      count: null,
      denominatorMetric: "eligible_encounters",
      rate: null,
      suppressed: true,
    });
  });

  it("rejects unsuppressed small cells", () => {
    const unsafe = {
      ...batch,
      aggregates: batch.aggregates.map((metric) => metric.metric === "readmission_within_window"
        ? { ...metric, suppressed: false }
        : metric),
    };
    const result = patientEducationPilotAnalyticsBatchSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toContain("must be suppressed");
  });

  it("rejects outcome metrics without an explicit observation window", () => {
    const unsafe = {
      ...batch,
      aggregates: batch.aggregates.map((metric) => metric.metric === "readmission_within_window"
        ? { ...metric, observationWindowDays: undefined }
        : metric),
    };
    const result = patientEducationPilotAnalyticsBatchSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toContain("requires observationWindowDays");
  });

  it("rejects a numerator larger than its denominator", () => {
    const unsafe = {
      ...batch,
      aggregates: batch.aggregates.map((metric) => metric.metric === "education_delivered"
        ? { ...metric, count: 121 }
        : metric),
    };
    const result = patientEducationPilotAnalyticsBatchSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toContain("cannot exceed");
  });

  it("rejects missing denominator metrics", () => {
    const unsafe = {
      ...batch,
      aggregates: batch.aggregates.filter((metric) => metric.metric !== "eligible_encounters"),
    };
    const result = patientEducationPilotAnalyticsBatchSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toContain("Missing denominator metric");
  });

  it("makes patient identifiers structurally impossible in the attestation", () => {
    const unsafe = {
      ...batch,
      privacyAttestation: {
        ...batch.privacyAttestation,
        containsPatientIdentifiers: true,
      },
    };
    expect(patientEducationPilotAnalyticsBatchSchema.safeParse(unsafe).success).toBe(false);
  });
});
