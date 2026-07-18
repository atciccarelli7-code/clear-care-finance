import { z } from "zod";

export const patientEducationDependencyNodeTypeSchema = z.enum([
  "source",
  "claim",
  "content_block",
  "document",
  "asset",
  "package",
  "localization",
  "institution_overlay",
  "quality_report",
  "compiled_artifact",
  "integrity_manifest",
  "release_record",
  "authorization",
  "delivery_envelope",
  "distribution_record",
]);

export const patientEducationDependencyNodeSchema = z.object({
  nodeId: z.string().regex(/^CAF-PE-NODE-[A-Z0-9-]+$/),
  nodeType: patientEducationDependencyNodeTypeSchema,
  objectRef: z.string().trim().min(3).max(1000),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  organizationKey: z.string().regex(/^(?:CAF-GLOBAL|[A-Z0-9-]+)$/),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).optional(),
  riskTier: z.enum(["low", "moderate", "high", "critical"]),
  active: z.boolean(),
});

export const patientEducationDependencyEdgeSchema = z.object({
  edgeId: z.string().regex(/^CAF-PE-EDGE-[A-Z0-9-]+$/),
  fromNodeId: z.string().regex(/^CAF-PE-NODE-[A-Z0-9-]+$/),
  toNodeId: z.string().regex(/^CAF-PE-NODE-[A-Z0-9-]+$/),
  relationship: z.enum([
    "controls",
    "supports",
    "contains",
    "derived_from",
    "localizes",
    "configures",
    "validates",
    "compiles_to",
    "fingerprints",
    "authorizes",
    "delivers",
    "records",
  ]),
  required: z.boolean(),
});

export const patientEducationDependencyGraphSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  graphId: z.string().regex(/^CAF-PE-GRAPH-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  generatedAt: z.string().datetime(),
  nodes: z.array(patientEducationDependencyNodeSchema).min(1),
  edges: z.array(patientEducationDependencyEdgeSchema),
}).superRefine((value, context) => {
  const nodeIds = value.nodes.map((node) => node.nodeId);
  const edgeIds = value.edges.map((edge) => edge.edgeId);
  if (new Set(nodeIds).size !== nodeIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Dependency node IDs must be unique." });
  }
  if (new Set(edgeIds).size !== edgeIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Dependency edge IDs must be unique." });
  }
  const nodeIdSet = new Set(nodeIds);
  for (const node of value.nodes) {
    if (node.packageId !== value.packageId || node.packageVersion !== value.packageVersion) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Dependency node ${node.nodeId} belongs to a different package version.` });
    }
  }
  for (const edge of value.edges) {
    if (!nodeIdSet.has(edge.fromNodeId) || !nodeIdSet.has(edge.toNodeId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Dependency edge ${edge.edgeId} references an unknown node.` });
    }
    if (edge.fromNodeId === edge.toNodeId) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Dependency edge ${edge.edgeId} cannot reference the same node twice.` });
    }
  }

  const adjacency = new Map<string, string[]>();
  for (const nodeId of nodeIds) adjacency.set(nodeId, []);
  for (const edge of value.edges) adjacency.get(edge.fromNodeId)?.push(edge.toNodeId);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (hasCycle(next)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };
  if (nodeIds.some((nodeId) => hasCycle(nodeId))) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Patient education dependency graph must be acyclic." });
  }
});

export const patientEducationBlastRadiusActionSchema = z.enum([
  "verify_source",
  "reopen_evidence_review",
  "reclassify_change_risk",
  "reopen_clinical_review",
  "rerun_quality_analysis",
  "reapprove_localizations",
  "revalidate_institution_overlays",
  "recompile_artifacts",
  "regenerate_integrity_manifest",
  "revoke_prior_authorization",
  "reopen_release_gates",
  "suspend_distribution_assessment",
  "recall_assessment",
  "notify_affected_organizations",
]);

export const patientEducationBlastRadiusResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  graphId: z.string(),
  changedNodeIds: z.array(z.string()),
  affectedNodeIds: z.array(z.string()),
  affectedByType: z.record(patientEducationDependencyNodeTypeSchema, z.array(z.string())),
  highestRiskTier: z.enum(["low", "moderate", "high", "critical"]),
  requiredActions: z.array(patientEducationBlastRadiusActionSchema),
  affectedOrganizationKeys: z.array(z.string()),
  affectedLocales: z.array(z.string()),
});

const riskOrder = { low: 0, moderate: 1, high: 2, critical: 3 } as const;

const actionsByType: Record<z.infer<typeof patientEducationDependencyNodeTypeSchema>, z.infer<typeof patientEducationBlastRadiusActionSchema>[]> = {
  source: ["verify_source", "reopen_evidence_review", "reclassify_change_risk"],
  claim: ["reopen_evidence_review", "reopen_clinical_review", "reclassify_change_risk"],
  content_block: ["reopen_clinical_review", "rerun_quality_analysis", "reapprove_localizations"],
  document: ["rerun_quality_analysis", "reapprove_localizations", "revalidate_institution_overlays", "recompile_artifacts"],
  asset: ["recompile_artifacts", "regenerate_integrity_manifest", "reopen_release_gates"],
  package: ["reopen_release_gates", "recompile_artifacts", "regenerate_integrity_manifest"],
  localization: ["rerun_quality_analysis", "recompile_artifacts", "regenerate_integrity_manifest"],
  institution_overlay: ["revalidate_institution_overlays", "recompile_artifacts", "regenerate_integrity_manifest"],
  quality_report: ["rerun_quality_analysis", "revoke_prior_authorization", "reopen_release_gates"],
  compiled_artifact: ["recompile_artifacts", "regenerate_integrity_manifest", "revoke_prior_authorization"],
  integrity_manifest: ["regenerate_integrity_manifest", "revoke_prior_authorization"],
  release_record: ["revoke_prior_authorization", "reopen_release_gates", "suspend_distribution_assessment"],
  authorization: ["revoke_prior_authorization", "suspend_distribution_assessment"],
  delivery_envelope: ["suspend_distribution_assessment", "notify_affected_organizations"],
  distribution_record: ["suspend_distribution_assessment", "recall_assessment", "notify_affected_organizations"],
};

export const analyzePatientEducationBlastRadius = ({
  graph: rawGraph,
  changedNodeIds,
}: {
  graph: unknown;
  changedNodeIds: string[];
}) => {
  const graph = patientEducationDependencyGraphSchema.parse(rawGraph);
  const nodesById = new Map(graph.nodes.map((node) => [node.nodeId, node]));
  const unknown = changedNodeIds.filter((nodeId) => !nodesById.has(nodeId));
  if (unknown.length > 0) throw new Error(`Unknown changed dependency node(s): ${unknown.join(", ")}`);
  if (new Set(changedNodeIds).size !== changedNodeIds.length) throw new Error("Changed dependency node IDs must be unique.");

  const adjacency = new Map<string, string[]>();
  for (const edge of graph.edges) {
    const existing = adjacency.get(edge.fromNodeId) ?? [];
    existing.push(edge.toNodeId);
    adjacency.set(edge.fromNodeId, existing);
  }

  const affected = new Set(changedNodeIds);
  const queue = [...changedNodeIds];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (!affected.has(next)) {
        affected.add(next);
        queue.push(next);
      }
    }
  }

  const affectedNodes = [...affected].map((nodeId) => nodesById.get(nodeId)!).filter(Boolean);
  const affectedByType = Object.fromEntries(
    patientEducationDependencyNodeTypeSchema.options.map((nodeType) => [
      nodeType,
      affectedNodes.filter((node) => node.nodeType === nodeType).map((node) => node.nodeId).sort(),
    ]),
  );
  const requiredActions = new Set<z.infer<typeof patientEducationBlastRadiusActionSchema>>();
  for (const node of affectedNodes) actionsByType[node.nodeType].forEach((action) => requiredActions.add(action));
  if (affectedNodes.some((node) => node.riskTier === "critical") && affectedNodes.some((node) => node.nodeType === "distribution_record")) {
    requiredActions.add("recall_assessment");
  }
  const highestRiskTier = affectedNodes.reduce<"low" | "moderate" | "high" | "critical">(
    (highest, node) => riskOrder[node.riskTier] > riskOrder[highest] ? node.riskTier : highest,
    "low",
  );

  return patientEducationBlastRadiusResultSchema.parse({
    schemaVersion: "1.0.0",
    graphId: graph.graphId,
    changedNodeIds: [...changedNodeIds].sort(),
    affectedNodeIds: affectedNodes.map((node) => node.nodeId).sort(),
    affectedByType,
    highestRiskTier,
    requiredActions: [...requiredActions].sort(),
    affectedOrganizationKeys: [...new Set(affectedNodes.map((node) => node.organizationKey).filter((key) => key !== "CAF-GLOBAL"))].sort(),
    affectedLocales: [...new Set(affectedNodes.map((node) => node.locale).filter((locale): locale is string => Boolean(locale)))].sort(),
  });
};
