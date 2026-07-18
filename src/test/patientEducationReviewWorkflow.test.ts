import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationReviewWorkflow,
  reopenPatientEducationReviewTasks,
} from "@/lib/patientEducationReviewWorkflow";

const contentHash = "a".repeat(64);

const task = (
  suffix: string,
  discipline: "evidence" | "clinical_specialty" | "health_literacy" | "release_authority",
  requiredRoleId: string,
  dependsOnTaskIds: string[],
) => ({
  taskId: `CAF-PE-REVIEW-TASK-${suffix}`,
  discipline,
  requiredRoleIds: [requiredRoleId],
  minimumApprovals: 1,
  requireDistinctPrincipals: true,
  dependsOnTaskIds,
  status: "approved" as const,
  dueAt: "2026-07-19T20:00:00.000Z",
  startedAt: "2026-07-18T18:00:00.000Z",
  completedAt: "2026-07-18T19:00:00.000Z",
  sourceObjectRefs: [`source://${suffix.toLowerCase()}`],
  evidenceRefs: [`evidence://${suffix.toLowerCase()}`],
  findings: [],
  approvals: [
    {
      approvalId: `CAF-PE-REVIEW-APPROVAL-${suffix}`,
      principalId: `CAF-PE-PRINCIPAL-${suffix}`,
      roleId: requiredRoleId,
      principalType: "human" as const,
      decision: "approved" as const,
      rationale: `Synthetic ${discipline} review approved.`,
      decidedAt: "2026-07-18T19:00:00.000Z",
      contentHash,
    },
  ],
});

const evidenceTask = task("EVIDENCE", "evidence", "evidence_reviewer", []);
const clinicalTask = task("CLINICAL", "clinical_specialty", "clinical_reviewer", [evidenceTask.taskId]);
const literacyTask = task("LITERACY", "health_literacy", "health_literacy_reviewer", [clinicalTask.taskId]);
const releaseTask = task("RELEASE", "release_authority", "release_authority", [clinicalTask.taskId, literacyTask.taskId]);

const workflow = {
  schemaVersion: "1.0.0" as const,
  workflowId: "CAF-PE-REVIEW-WORKFLOW-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  contentHash,
  organizationKey: "DEMO-HOSPITAL",
  targetStatus: "pilot_ready" as const,
  createdAt: "2026-07-18T17:00:00.000Z",
  updatedAt: "2026-07-18T19:00:00.000Z",
  status: "approved" as const,
  tasks: [evidenceTask, clinicalTask, literacyTask, releaseTask],
  reopenEvents: [],
};

describe("patientEducationReviewWorkflow", () => {
  it("approves a dependency-ordered, exact-hash review workflow", () => {
    const result = evaluatePatientEducationReviewWorkflow({
      workflow,
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    });
    expect(result.decision).toBe("approved");
    expect(result.findings).toEqual([]);
    expect(result.verifiedApprovalIds).toHaveLength(4);
  });

  it("blocks approval before dependencies are approved", () => {
    const result = evaluatePatientEducationReviewWorkflow({
      workflow: {
        ...workflow,
        status: "active" as const,
        tasks: workflow.tasks.map((reviewTask) => reviewTask.taskId === evidenceTask.taskId
          ? {
            ...reviewTask,
            status: "in_review" as const,
            completedAt: undefined,
            approvals: [],
          }
          : reviewTask),
      },
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "REVIEW-DEPENDENCY-NOT-APPROVED" }),
    ]));
  });

  it("blocks stale approvals for a different content hash", () => {
    const result = evaluatePatientEducationReviewWorkflow({
      workflow: {
        ...workflow,
        tasks: workflow.tasks.map((reviewTask) => reviewTask.taskId === clinicalTask.taskId
          ? {
            ...reviewTask,
            approvals: reviewTask.approvals.map((approval) => ({ ...approval, contentHash: "b".repeat(64) })),
          }
          : reviewTask),
      },
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "REVIEW-CONTENT-HASH-MISMATCH" }),
      expect.objectContaining({ code: "REVIEW-APPROVAL-QUORUM-NOT-MET" }),
    ]));
  });

  it("reopens affected tasks and clears prior approvals after a content change", () => {
    const nextHash = "c".repeat(64);
    const reopened = reopenPatientEducationReviewTasks({
      workflow,
      event: {
        eventId: "CAF-PE-REVIEW-REOPEN-DEMO",
        occurredAt: "2026-07-18T20:30:00.000Z",
        reasonType: "content_change",
        reason: "Synthetic clinical block changed and requires repeat review.",
        affectedTaskIds: [clinicalTask.taskId, literacyTask.taskId, releaseTask.taskId],
        previousContentHash: contentHash,
        nextContentHash: nextHash,
        actorPrincipalId: "CAF-PE-PRINCIPAL-AUTHOR",
      },
    });
    expect(reopened.contentHash).toBe(nextHash);
    expect(reopened.status).toBe("active");
    for (const taskId of [clinicalTask.taskId, literacyTask.taskId, releaseTask.taskId]) {
      const reopenedTask = reopened.tasks.find((reviewTask) => reviewTask.taskId === taskId);
      expect(reopenedTask?.status).toBe("reopened");
      expect(reopenedTask?.approvals).toEqual([]);
    }
    expect(evaluatePatientEducationReviewWorkflow({ workflow: reopened, evaluatedAt: "2026-07-18T21:00:00.000Z" }).decision).toBe("blocked");
  });

  it("rejects cyclic review dependencies", () => {
    expect(() => evaluatePatientEducationReviewWorkflow({
      workflow: {
        ...workflow,
        tasks: workflow.tasks.map((reviewTask) => reviewTask.taskId === evidenceTask.taskId
          ? { ...reviewTask, dependsOnTaskIds: [releaseTask.taskId] }
          : reviewTask),
      },
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    })).toThrow(/acyclic/i);
  });
});
