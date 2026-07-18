import { describe, expect, it } from "vitest";
import {
  appendPatientEducationGovernanceEvent,
  createPatientEducationGovernanceLedger,
  verifyPatientEducationGovernanceLedger,
} from "@/lib/patientEducationGovernanceLedger";

const packageId = "CAF-PE-DEMO-SAFETY";

const createLedger = () => createPatientEducationGovernanceLedger({
  ledgerId: "CAF-PE-LEDGER-DEMO-SAFETY",
  packageId,
  createdAt: "2026-07-18T12:00:00.000Z",
});

describe("patientEducationGovernanceLedger", () => {
  it("creates a chronological SHA-256 event chain", async () => {
    const created = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-CREATED",
      eventType: "source_created",
      occurredAt: "2026-07-18T12:05:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Content author",
      actorRef: "role://content-author",
      reason: "Create a synthetic source document.",
      evidenceRefs: [],
      payload: { documentId: "CAF-PE-DOC-DEMO-QUICK-START", version: "1.0.0" },
    });
    const reviewed = await appendPatientEducationGovernanceEvent(created, {
      eventId: "CAF-PE-AUDIT-DEMO-REVIEWED",
      eventType: "review_approved",
      occurredAt: "2026-07-18T12:10:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      documentId: "CAF-PE-DOC-DEMO-QUICK-START",
      actorRole: "Health literacy reviewer",
      reason: "Approve the synthetic document for engine testing.",
      evidenceRefs: ["CAF-PE-QA-DEMO"],
      payload: { decision: "approved", scope: "health_literacy" },
    });

    expect(reviewed.events).toHaveLength(2);
    expect(reviewed.events[0].previousEventHash).toBeNull();
    expect(reviewed.events[1].previousEventHash).toBe(reviewed.events[0].eventHash);
    expect(reviewed.events.every((event) => /^[a-f0-9]{64}$/.test(event.eventHash))).toBe(true);
    await expect(verifyPatientEducationGovernanceLedger(reviewed)).resolves.toEqual({ valid: true, issues: [] });
  });

  it("produces the same payload hash for semantically identical object key order", async () => {
    const first = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-FIRST",
      eventType: "qa_generated",
      occurredAt: "2026-07-18T12:05:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Automated QA engine",
      reason: "Generate QA evidence.",
      evidenceRefs: [],
      payload: { b: 2, a: 1 },
    });
    const second = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-SECOND",
      eventType: "qa_generated",
      occurredAt: "2026-07-18T12:05:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Automated QA engine",
      reason: "Generate QA evidence.",
      evidenceRefs: [],
      payload: { a: 1, b: 2 },
    });

    expect(first.events[0].payloadHash).toBe(second.events[0].payloadHash);
  });

  it("detects retrospective event mutation", async () => {
    const ledger = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-TAMPER",
      eventType: "authorization_evaluated",
      occurredAt: "2026-07-18T12:05:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Release authority",
      reason: "Evaluate a synthetic authorization request.",
      evidenceRefs: [],
      payload: { decision: "blocked" },
    });
    const tampered = {
      ...ledger,
      events: ledger.events.map((event) => ({ ...event, reason: "Retrospectively changed reason." })),
    };

    const result = await verifyPatientEducationGovernanceLedger(tampered);
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(["Event hash mismatch: CAF-PE-AUDIT-DEMO-TAMPER"]);
  });

  it("rejects duplicate event IDs", async () => {
    const ledger = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-DUPLICATE",
      eventType: "source_created",
      occurredAt: "2026-07-18T12:05:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Content author",
      reason: "Create a synthetic source.",
      evidenceRefs: [],
      payload: { version: 1 },
    });

    await expect(appendPatientEducationGovernanceEvent(ledger, {
      eventId: "CAF-PE-AUDIT-DEMO-DUPLICATE",
      eventType: "source_changed",
      occurredAt: "2026-07-18T12:06:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Content author",
      reason: "Attempt a duplicate event.",
      evidenceRefs: [],
      payload: { version: 2 },
    })).rejects.toThrow("Duplicate governance event ID");
  });

  it("rejects nonchronological append operations", async () => {
    const ledger = await appendPatientEducationGovernanceEvent(createLedger(), {
      eventId: "CAF-PE-AUDIT-DEMO-LATER",
      eventType: "source_created",
      occurredAt: "2026-07-18T12:10:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Content author",
      reason: "Create the later event.",
      evidenceRefs: [],
      payload: {},
    });

    await expect(appendPatientEducationGovernanceEvent(ledger, {
      eventId: "CAF-PE-AUDIT-DEMO-EARLIER",
      eventType: "source_changed",
      occurredAt: "2026-07-18T12:09:00.000Z",
      packageId,
      packageVersion: "1.0.0",
      actorRole: "Content author",
      reason: "Attempt an out-of-order event.",
      evidenceRefs: [],
      payload: {},
    })).rejects.toThrow("chronologically");
  });
});
