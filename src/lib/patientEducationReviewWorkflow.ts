import { z } from "zod";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const roleIdSchema = z.string().regex(/^[a-z0-9_]+$/);

export const patientEducationReviewDisciplineSchema = z.enum([
  "evidence",
  "nursing",
  "clinical_specialty",
  "pharmacy",
  "health_literacy",
  "accessibility",
  "privacy",
  "security",
  "localization_language",
  "localization_clinical_equivalence",
  "institution_implementation",
  "patient_testing",
  "release_authority",
]);

export const patientEducationReviewTaskSchema = z.object({
  taskId: z.string().regex(/^CAF-PE-REVIEW-TASK-[A-Z0-9-]+$/),
  discipline: patientEducationReviewDisciplineSchema,
  requiredRoleIds: z.array(roleIdSchema).min(1),
  minimumApprovals: z.number().int().positive().max(10),
  requireDistinctPrincipals: z.boolean(),
  dependsOnTaskIds: z.array(z.string().regex(/^CAF-PE-REVIEW-TASK-[A-Z0-9-]+$/)),
  status: z.enum(["not_started", "ready", "in_review", "changes_required", "approved", "rejected", "expired", "reopened"]),
  dueAt: z.string().datetime(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  sourceObjectRefs: z.array(z.string().trim().min(3).max(1000)).min(1),
  evidenceRefs: z.array(z.string().trim().min(3).max(1000)),
  findings: z.array(z.object({
    findingId: z.string().regex(/^CAF-PE-REVIEW-FINDING-[A-Z0-9-]+$/),
    severity: z.enum(["comment", "warning", "blocking"]),
    objectRef: z.string().trim().min(3).max(1000),
    message: z.string().trim().min(3).max(3000),
    requiredChange: z.string().trim().min(3).max(3000).optional(),
    status: z.enum(["open", "resolved", "accepted_risk"]),
    resolutionRef: z.string().trim().min(3).max(1000).optional(),
  })),
  approvals: z.array(z.object({
    approvalId: z.string().regex(/^CAF-PE-REVIEW-APPROVAL-[A-Z0-9-]+$/),
    principalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
    roleId: roleIdSchema,
    principalType: z.literal("human"),
    decision: z.enum(["approved", "rejected", "changes_required"]),
    rationale: z.string().trim().min(3).max(3000),
    decidedAt: z.string().datetime(),
    contentHash: sha256Schema,
  })),
}).superRefine((value, context) => {
  if (value.dependsOnTaskIds.includes(value.taskId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Review task ${value.taskId} cannot depend on itself.` });
  }
  const findingIds = value.findings.map((finding) => finding.findingId);
  if (new Set(findingIds).size !== findingIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Review task ${value.taskId} finding IDs must be unique.` });
  }
  const approvalIds = value.approvals.map((approval) => approval.approvalId);
  if (new Set(approvalIds).size !== approvalIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Review task ${value.taskId} approval IDs must be unique.` });
  }
  if (value.status === "approved") {
    if (!value.completedAt) context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved task ${value.taskId} requires completedAt.` });
    if (value.findings.some((finding) => finding.severity === "blocking" && finding.status !== "resolved")) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved task ${value.taskId} cannot retain unresolved blocking findings.` });
    }
  }
  if (["in_review", "changes_required", "approved", "rejected", "expired", "reopened"].includes(value.status) && !value.startedAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Review task ${value.taskId} status ${value.status} requires startedAt.` });
  }
});

export const patientEducationReviewWorkflowSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  workflowId: z.string().regex(/^CAF-PE-REVIEW-WORKFLOW-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  contentHash: sha256Schema,
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  targetStatus: z.enum(["pilot_ready", "released"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.enum(["draft", "active", "changes_required", "approved", "rejected", "expired", "suspended"]),
  tasks: z.array(patientEducationReviewTaskSchema).min(1),
  reopenEvents: z.array(z.object({
    eventId: z.string().regex(/^CAF-PE-REVIEW-REOPEN-[A-Z0-9-]+$/),
    occurredAt: z.string().datetime(),
    reasonType: z.enum(["content_change", "evidence_change", "source_retraction", "qa_regression", "localization_change", "overlay_change", "incident", "approval_expiration", "policy_change"]),
    reason: z.string().trim().min(3).max(3000),
    affectedTaskIds: z.array(z.string().regex(/^CAF-PE-REVIEW-TASK-[A-Z0-9-]+$/)).min(1),
    previousContentHash: sha256Schema,
    nextContentHash: sha256Schema,
    actorPrincipalId: z.string().regex(/^CAF-PE-PRINCIPAL-[A-Z0-9-]+$/),
  })),
}).superRefine((value, context) => {
  const taskIds = value.tasks.map((task) => task.taskId);
  if (new Set(taskIds).size !== taskIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Review workflow task IDs must be unique." });
  }
  const taskIdSet = new Set(taskIds);
  for (const task of value.tasks) {
    for (const dependencyId of task.dependsOnTaskIds) {
      if (!taskIdSet.has(dependencyId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Review task ${task.taskId} depends on unknown task ${dependencyId}.` });
      }
    }
  }
  const adjacency = new Map<string, string[]>();
  for (const task of value.tasks) adjacency.set(task.taskId, task.dependsOnTaskIds);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (taskId: string): boolean => {
    if (visiting.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    visiting.add(taskId);
    for (const dependency of adjacency.get(taskId) ?? []) if (hasCycle(dependency)) return true;
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  };
  if (taskIds.some((taskId) => hasCycle(taskId))) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Review task dependencies must be acyclic." });
  }
  const reopenEventIds = value.reopenEvents.map((event) => event.eventId);
  if (new Set(reopenEventIds).size !== reopenEventIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Review reopen event IDs must be unique." });
  }
  for (const event of value.reopenEvents) {
    if (event.previousContentHash === event.nextContentHash) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Review reopen event ${event.eventId} must change the content hash.` });
    }
    for (const taskId of event.affectedTaskIds) {
      if (!taskIdSet.has(taskId)) context.addIssue({ code: z.ZodIssueCode.custom, message: `Review reopen event ${event.eventId} references unknown task ${taskId}.` });
    }
  }
});

export const patientEducationReviewWorkflowFindingSchema = z.object({
  code: z.string().regex(/^REVIEW-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking"]),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  taskId: z.string().optional(),
});

export const patientEducationReviewWorkflowEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  workflowId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["approved", "blocked", "in_progress"]),
  findings: z.array(patientEducationReviewWorkflowFindingSchema),
  readyTaskIds: z.array(z.string()),
  overdueTaskIds: z.array(z.string()),
  verifiedApprovalIds: z.array(z.string()),
  verifiedPrincipalIds: z.array(z.string()),
});

const finding = (code: string, severity: "warning" | "blocking", message: string, remediation: string, taskId?: string) => ({
  code,
  severity,
  message,
  remediation,
  ...(taskId ? { taskId } : {}),
});

export const evaluatePatientEducationReviewWorkflow = ({
  workflow: rawWorkflow,
  evaluatedAt = new Date().toISOString(),
}: {
  workflow: unknown;
  evaluatedAt?: string;
}) => {
  const workflow = patientEducationReviewWorkflowSchema.parse(rawWorkflow);
  const findings: z.infer<typeof patientEducationReviewWorkflowFindingSchema>[] = [];
  const taskById = new Map(workflow.tasks.map((task) => [task.taskId, task]));
  const verifiedApprovalIds = new Set<string>();
  const verifiedPrincipalIds = new Set<string>();
  const readyTaskIds: string[] = [];
  const overdueTaskIds: string[] = [];

  for (const task of workflow.tasks) {
    const dependenciesApproved = task.dependsOnTaskIds.every((dependencyId) => taskById.get(dependencyId)?.status === "approved");
    if (dependenciesApproved && ["not_started", "ready", "reopened"].includes(task.status)) readyTaskIds.push(task.taskId);
    if (!dependenciesApproved && ["in_review", "approved"].includes(task.status)) {
      findings.push(finding(
        "REVIEW-DEPENDENCY-NOT-APPROVED",
        "blocking",
        `Task ${task.taskId} began or completed before every dependency was approved.`,
        "Reopen the task and complete all dependency reviews first.",
        task.taskId,
      ));
    }
    if (!task.completedAt && new Date(task.dueAt) < new Date(evaluatedAt)) {
      overdueTaskIds.push(task.taskId);
      findings.push(finding("REVIEW-TASK-OVERDUE", "warning", `Review task ${task.taskId} is overdue.`, "Escalate the review owner and update the release schedule.", task.taskId));
    }

    if (task.status === "approved") {
      const validApprovals = task.approvals.filter((approval) =>
        approval.decision === "approved"
        && approval.contentHash === workflow.contentHash
        && task.requiredRoleIds.includes(approval.roleId),
      );
      const distinctPrincipals = new Set(validApprovals.map((approval) => approval.principalId));
      const count = task.requireDistinctPrincipals ? distinctPrincipals.size : validApprovals.length;
      if (count < task.minimumApprovals) {
        findings.push(finding(
          "REVIEW-APPROVAL-QUORUM-NOT-MET",
          "blocking",
          `Task ${task.taskId} requires ${task.minimumApprovals} valid approval(s); ${count} were verified.`,
          "Obtain the remaining exact-hash approvals from authorized human reviewers.",
          task.taskId,
        ));
      } else {
        validApprovals.forEach((approval) => {
          verifiedApprovalIds.add(approval.approvalId);
          verifiedPrincipalIds.add(approval.principalId);
        });
      }
      if (task.approvals.some((approval) => approval.decision !== "approved")) {
        findings.push(finding("REVIEW-CONFLICTING-DECISION-PRESENT", "blocking", `Task ${task.taskId} retains a rejection or change request.`, "Resolve the conflicting decision and issue a new immutable approval record.", task.taskId));
      }
      if (task.approvals.some((approval) => approval.contentHash !== workflow.contentHash)) {
        findings.push(finding("REVIEW-CONTENT-HASH-MISMATCH", "blocking", `Task ${task.taskId} contains approval for a different content hash.`, "Reopen review and approve the exact current candidate.", task.taskId));
      }
    }

    if (["changes_required", "rejected", "expired", "reopened"].includes(task.status)) {
      findings.push(finding(
        `REVIEW-TASK-${task.status.replaceAll("_", "-").toUpperCase()}`,
        "blocking",
        `Task ${task.taskId} is ${task.status}.`,
        "Complete remediation and obtain a new exact-version approval.",
        task.taskId,
      ));
    }
  }

  const allApproved = workflow.tasks.every((task) => task.status === "approved");
  if (workflow.status === "approved" && !allApproved) {
    findings.push(finding("REVIEW-WORKFLOW-PREMATURELY-APPROVED", "blocking", "Workflow is approved while one or more tasks are not approved.", "Complete every required task before workflow approval."));
  }
  if (workflow.status === "approved" && workflow.reopenEvents.some((event) => event.nextContentHash === workflow.contentHash)) {
    const reopenedTaskIds = new Set(workflow.reopenEvents.filter((event) => event.nextContentHash === workflow.contentHash).flatMap((event) => event.affectedTaskIds));
    const stillOldApproval = workflow.tasks.some((task) => reopenedTaskIds.has(task.taskId) && task.status !== "approved");
    if (stillOldApproval) findings.push(finding("REVIEW-REOPENED-TASKS-INCOMPLETE", "blocking", "Workflow is approved while reopened tasks remain incomplete.", "Complete every task reopened for the current content hash."));
  }

  const decision = findings.some((item) => item.severity === "blocking")
    ? "blocked"
    : allApproved && workflow.status === "approved"
      ? "approved"
      : "in_progress";

  return patientEducationReviewWorkflowEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    workflowId: workflow.workflowId,
    evaluatedAt,
    decision,
    findings,
    readyTaskIds: readyTaskIds.sort(),
    overdueTaskIds: overdueTaskIds.sort(),
    verifiedApprovalIds: [...verifiedApprovalIds].sort(),
    verifiedPrincipalIds: [...verifiedPrincipalIds].sort(),
  });
};

export const reopenPatientEducationReviewTasks = ({
  workflow: rawWorkflow,
  event: rawEvent,
}: {
  workflow: unknown;
  event: unknown;
}) => {
  const workflow = patientEducationReviewWorkflowSchema.parse(rawWorkflow);
  const eventSchema = patientEducationReviewWorkflowSchema.shape.reopenEvents.element;
  const event = eventSchema.parse(rawEvent);
  const affected = new Set(event.affectedTaskIds);
  return patientEducationReviewWorkflowSchema.parse({
    ...workflow,
    contentHash: event.nextContentHash,
    updatedAt: event.occurredAt,
    status: "active",
    tasks: workflow.tasks.map((task) => affected.has(task.taskId)
      ? {
        ...task,
        status: "reopened",
        completedAt: undefined,
        approvals: [],
      }
      : task),
    reopenEvents: [...workflow.reopenEvents, event],
  });
};
