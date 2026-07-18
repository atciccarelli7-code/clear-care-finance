import { describe, expect, it } from "vitest";
import {
  analyzePatientEducationBlastRadius,
  patientEducationDependencyGraphSchema,
} from "@/lib/patientEducationDependencyGraph";

const node = (
  suffix: string,
  nodeType: "source" | "claim" | "document" | "quality_report" | "compiled_artifact" | "integrity_manifest" | "release_record" | "authorization" | "delivery_envelope" | "distribution_record",
  organizationKey = "CAF-GLOBAL",
) => ({
  nodeId: `CAF-PE-NODE-${suffix}`,
  nodeType,
  objectRef: `synthetic://${suffix.toLowerCase()}`,
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  organizationKey,
  locale: "en-US",
  riskTier: nodeType === "source" || nodeType === "claim" ? "critical" as const : "high" as const,
  active: true,
});

const nodes = [
  node("SOURCE", "source"),
  node("CLAIM", "claim"),
  node("DOCUMENT", "document"),
  node("QA", "quality_report"),
  node("ARTIFACT", "compiled_artifact"),
  node("INTEGRITY", "integrity_manifest"),
  node("RELEASE", "release_record"),
  node("AUTH", "authorization"),
  node("ENVELOPE", "delivery_envelope", "DEMO-HOSPITAL"),
  node("DISTRIBUTION", "distribution_record", "DEMO-HOSPITAL"),
];

const relationships = [
  "controls",
  "controls",
  "validates",
  "compiles_to",
  "fingerprints",
  "authorizes",
  "authorizes",
  "delivers",
  "records",
] as const;

const graph = {
  schemaVersion: "1.0.0" as const,
  graphId: "CAF-PE-GRAPH-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  generatedAt: "2026-07-18T18:00:00.000Z",
  nodes,
  edges: nodes.slice(0, -1).map((current, index) => ({
    edgeId: `CAF-PE-EDGE-DEMO-${index + 1}`,
    fromNodeId: current.nodeId,
    toNodeId: nodes[index + 1].nodeId,
    relationship: relationships[index],
    required: true,
  })),
};

describe("patientEducationDependencyGraph", () => {
  it("traces a controlling source change through every distributed artifact", () => {
    const result = analyzePatientEducationBlastRadius({
      graph,
      changedNodeIds: ["CAF-PE-NODE-SOURCE"],
    });
    expect(result.affectedNodeIds).toHaveLength(nodes.length);
    expect(result.highestRiskTier).toBe("critical");
    expect(result.affectedOrganizationKeys).toEqual(["DEMO-HOSPITAL"]);
    expect(result.requiredActions).toEqual(expect.arrayContaining([
      "reopen_evidence_review",
      "reopen_clinical_review",
      "rerun_quality_analysis",
      "recompile_artifacts",
      "regenerate_integrity_manifest",
      "revoke_prior_authorization",
      "suspend_distribution_assessment",
      "recall_assessment",
      "notify_affected_organizations",
    ]));
  });

  it("limits an overlay-equivalent downstream change to affected descendants", () => {
    const result = analyzePatientEducationBlastRadius({
      graph,
      changedNodeIds: ["CAF-PE-NODE-ARTIFACT"],
    });
    expect(result.affectedNodeIds).not.toContain("CAF-PE-NODE-SOURCE");
    expect(result.affectedNodeIds).toContain("CAF-PE-NODE-DISTRIBUTION");
  });

  it("rejects cycles in the governance dependency graph", () => {
    const result = patientEducationDependencyGraphSchema.safeParse({
      ...graph,
      edges: [
        ...graph.edges,
        {
          edgeId: "CAF-PE-EDGE-CYCLE",
          fromNodeId: "CAF-PE-NODE-DISTRIBUTION",
          toNodeId: "CAF-PE-NODE-SOURCE",
          relationship: "controls",
          required: true,
        },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/acyclic/i);
  });

  it("rejects unknown changed nodes", () => {
    expect(() => analyzePatientEducationBlastRadius({
      graph,
      changedNodeIds: ["CAF-PE-NODE-MISSING"],
    })).toThrow(/unknown changed/i);
  });
});
