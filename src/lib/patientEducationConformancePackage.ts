import { createHash } from "node:crypto";
import { z } from "zod";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const patientEducationConformanceScenarioTypeSchema = z.enum([
  "success",
  "validation_failure",
  "tamper_detection",
  "cross_organization_block",
  "expired_or_stale_block",
  "separation_of_duties_block",
  "privacy_block",
  "incident_escalation",
  "suspension_or_recall",
  "restore_failure",
  "migration_failure",
  "policy_drift_block",
  "bundle_withheld",
]);

export const patientEducationConformanceScenarioSchema = z.object({
  scenarioId: z.string().regex(/^CAF-PE-CONFORMANCE-SCENARIO-[A-Z0-9-]+$/),
  capabilityId: z.string().regex(/^[a-z0-9-]+$/),
  scenarioType: patientEducationConformanceScenarioTypeSchema,
  title: z.string().trim().min(3).max(500),
  fixtureRef: z.string().trim().min(3).max(1000),
  expectedDecision: z.string().trim().min(2).max(200),
  expectedFindingCodes: z.array(z.string().regex(/^[A-Z0-9-]+$/)),
  executionStatus: z.enum(["not_run", "passed", "failed"]),
  executionEvidenceRef: z.string().trim().min(3).max(1000).optional(),
  containsOnlySyntheticData: z.literal(true),
  patientCareUseProhibited: z.literal(true),
}).superRefine((value, context) => {
  if (value.executionStatus === "passed" && !value.executionEvidenceRef) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Passed conformance scenario ${value.scenarioId} requires execution evidence.` });
  }
  if (value.scenarioType !== "success" && value.expectedFindingCodes.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Adversarial conformance scenario ${value.scenarioId} requires expected finding codes.` });
  }
});

export const patientEducationConformanceCapabilitySchema = z.object({
  capabilityId: z.string().regex(/^[a-z0-9-]+$/),
  implementationRef: z.string().trim().min(3).max(1000),
  testRef: z.string().trim().min(3).max(1000),
  publicProofRef: z.string().trim().min(3).max(1000).optional(),
  sourceClassification: z.enum(["public_safe_contract", "private_operational_required"]),
  positiveScenarioIds: z.array(z.string().regex(/^CAF-PE-CONFORMANCE-SCENARIO-[A-Z0-9-]+$/)).min(1),
  adversarialScenarioIds: z.array(z.string().regex(/^CAF-PE-CONFORMANCE-SCENARIO-[A-Z0-9-]+$/)).min(1),
  status: z.enum(["implemented", "partially_implemented", "planned"]),
});

export const patientEducationConformanceArtifactSchema = z.object({
  artifactId: z.string().regex(/^CAF-PE-CONFORMANCE-ARTIFACT-[A-Z0-9-]+$/),
  path: z.string().trim().min(3).max(1000),
  mimeType: z.string().trim().min(3).max(200),
  sha256: sha256Schema,
  byteLength: z.number().int().positive(),
  classification: z.enum(["public_safe", "private_synthetic"]),
  containsOnlySyntheticData: z.literal(true),
  patientCareUseProhibited: z.literal(true),
});

export const patientEducationConformancePackageUnsignedSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  conformancePackageId: z.string().regex(/^CAF-PE-CONFORMANCE-PACKAGE-[A-Z0-9-]+$/),
  conformanceVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  syntheticPackageId: z.string().regex(/^CAF-PE-SYNTHETIC-[A-Z0-9-]+$/),
  syntheticOrganizationKey: z.literal("SYNTHETIC-HOSPITAL"),
  generatedAt: z.string().datetime(),
  sourceCommitSha: z.string().regex(/^[a-f0-9]{40}$/),
  capabilities: z.array(patientEducationConformanceCapabilitySchema).min(1),
  scenarios: z.array(patientEducationConformanceScenarioSchema).min(1),
  artifacts: z.array(patientEducationConformanceArtifactSchema).min(1),
  requiredCriticalScenarioTypes: z.array(patientEducationConformanceScenarioTypeSchema).min(1),
  publicClaimsBoundary: z.array(z.string().trim().min(10).max(1000)).min(1),
  containsClinicalPatientInstructions: z.literal(false),
  containsRealOrganizationData: z.literal(false),
  containsPatientData: z.literal(false),
  containsReviewerIdentity: z.literal(false),
  suitableForPatientCare: z.literal(false),
}).superRefine((value, context) => {
  const capabilityIds = value.capabilities.map((capability) => capability.capabilityId);
  const scenarioIds = value.scenarios.map((scenario) => scenario.scenarioId);
  const artifactIds = value.artifacts.map((artifact) => artifact.artifactId);
  const artifactPaths = value.artifacts.map((artifact) => artifact.path);
  if (new Set(capabilityIds).size !== capabilityIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Conformance capability IDs must be unique." });
  if (new Set(scenarioIds).size !== scenarioIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Conformance scenario IDs must be unique." });
  if (new Set(artifactIds).size !== artifactIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Conformance artifact IDs must be unique." });
  if (new Set(artifactPaths).size !== artifactPaths.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Conformance artifact paths must be unique." });
  const scenarioIdSet = new Set(scenarioIds);
  for (const capability of value.capabilities) {
    for (const scenarioId of [...capability.positiveScenarioIds, ...capability.adversarialScenarioIds]) {
      if (!scenarioIdSet.has(scenarioId)) context.addIssue({ code: z.ZodIssueCode.custom, message: `Capability ${capability.capabilityId} references unknown scenario ${scenarioId}.` });
    }
  }
  const capabilityIdSet = new Set(capabilityIds);
  for (const scenario of value.scenarios) {
    if (!capabilityIdSet.has(scenario.capabilityId)) context.addIssue({ code: z.ZodIssueCode.custom, message: `Scenario ${scenario.scenarioId} references unknown capability ${scenario.capabilityId}.` });
  }
});

export const patientEducationConformancePackageSchema = patientEducationConformancePackageUnsignedSchema.extend({
  conformancePackageSha256: sha256Schema,
});

export const patientEducationConformanceFindingSchema = z.object({
  code: z.string().regex(/^CONFORMANCE-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking"]),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  capabilityId: z.string().optional(),
  scenarioId: z.string().optional(),
});

export const patientEducationConformanceEvaluationSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  conformancePackageId: z.string(),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["conformant", "blocked"]),
  capabilityCount: z.number().int().nonnegative(),
  scenarioCount: z.number().int().nonnegative(),
  passedScenarioCount: z.number().int().nonnegative(),
  findings: z.array(patientEducationConformanceFindingSchema),
  missingCapabilityIds: z.array(z.string()),
  missingCriticalScenarioTypes: z.array(patientEducationConformanceScenarioTypeSchema),
});

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalize(nested)]));
  }
  return value;
};
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(canonicalize(value)), "utf8").digest("hex");

export const buildPatientEducationConformancePackage = (input: unknown) => {
  const value = patientEducationConformancePackageUnsignedSchema.parse(input);
  const normalized = {
    ...value,
    capabilities: [...value.capabilities].sort((left, right) => left.capabilityId.localeCompare(right.capabilityId)),
    scenarios: [...value.scenarios].sort((left, right) => left.scenarioId.localeCompare(right.scenarioId)),
    artifacts: [...value.artifacts].sort((left, right) => left.path.localeCompare(right.path)),
    requiredCriticalScenarioTypes: [...value.requiredCriticalScenarioTypes].sort(),
  };
  return patientEducationConformancePackageSchema.parse({ ...normalized, conformancePackageSha256: digest(normalized) });
};

const finding = (code: string, severity: "warning" | "blocking", message: string, remediation: string, refs: { capabilityId?: string; scenarioId?: string } = {}) => ({
  code,
  severity,
  message,
  remediation,
  ...refs,
});

export const evaluatePatientEducationConformancePackage = ({
  conformancePackage: rawPackage,
  requiredCapabilityIds,
  evaluatedAt = new Date().toISOString(),
}: {
  conformancePackage: unknown;
  requiredCapabilityIds: string[];
  evaluatedAt?: string;
}) => {
  const conformancePackage = patientEducationConformancePackageSchema.parse(rawPackage);
  const findings: z.infer<typeof patientEducationConformanceFindingSchema>[] = [];
  const { conformancePackageSha256, ...unsigned } = conformancePackage;
  if (digest(unsigned) !== conformancePackageSha256) {
    findings.push(finding("CONFORMANCE-PACKAGE-HASH-MISMATCH", "blocking", "Conformance package digest does not match its canonical contents.", "Regenerate the conformance package from exact synthetic fixtures."));
  }

  const capabilityIdSet = new Set(conformancePackage.capabilities.map((capability) => capability.capabilityId));
  const missingCapabilityIds = requiredCapabilityIds.filter((capabilityId) => !capabilityIdSet.has(capabilityId));
  for (const capabilityId of missingCapabilityIds) {
    findings.push(finding("CONFORMANCE-CAPABILITY-MISSING", "blocking", `Required capability ${capabilityId} is missing.`, "Add implementation, tests, and both positive and adversarial scenarios.", { capabilityId }));
  }

  const scenarioById = new Map(conformancePackage.scenarios.map((scenario) => [scenario.scenarioId, scenario]));
  for (const capability of conformancePackage.capabilities) {
    if (capability.status !== "implemented") {
      findings.push(finding("CONFORMANCE-CAPABILITY-NOT-IMPLEMENTED", "blocking", `Capability ${capability.capabilityId} is ${capability.status}.`, "Complete the public-safe contract and adversarial validation before claiming conformance.", { capabilityId: capability.capabilityId }));
    }
    const positive = capability.positiveScenarioIds.map((scenarioId) => scenarioById.get(scenarioId)).filter(Boolean);
    const adversarial = capability.adversarialScenarioIds.map((scenarioId) => scenarioById.get(scenarioId)).filter(Boolean);
    if (!positive.some((scenario) => scenario?.scenarioType === "success" && scenario.executionStatus === "passed")) {
      findings.push(finding("CONFORMANCE-POSITIVE-SCENARIO-NOT-PASSED", "blocking", `Capability ${capability.capabilityId} lacks a passed success scenario.`, "Run and preserve a synthetic success-path execution.", { capabilityId: capability.capabilityId }));
    }
    if (!adversarial.some((scenario) => scenario?.scenarioType !== "success" && scenario.executionStatus === "passed")) {
      findings.push(finding("CONFORMANCE-ADVERSARIAL-SCENARIO-NOT-PASSED", "blocking", `Capability ${capability.capabilityId} lacks a passed adversarial scenario.`, "Run and preserve a synthetic failure-path execution.", { capabilityId: capability.capabilityId }));
    }
  }

  for (const scenario of conformancePackage.scenarios) {
    if (scenario.executionStatus !== "passed") {
      findings.push(finding("CONFORMANCE-SCENARIO-NOT-PASSED", "blocking", `Scenario ${scenario.scenarioId} is ${scenario.executionStatus}.`, "Resolve the scenario and attach successful execution evidence.", { scenarioId: scenario.scenarioId }));
    }
  }

  const presentScenarioTypes = new Set(conformancePackage.scenarios.map((scenario) => scenario.scenarioType));
  const missingCriticalScenarioTypes = conformancePackage.requiredCriticalScenarioTypes.filter((scenarioType) => !presentScenarioTypes.has(scenarioType));
  for (const scenarioType of missingCriticalScenarioTypes) {
    findings.push(finding("CONFORMANCE-CRITICAL-SCENARIO-TYPE-MISSING", "blocking", `Critical scenario type ${scenarioType} is absent.`, "Add and pass a synthetic scenario for this failure class."));
  }

  if (conformancePackage.artifacts.some((artifact) => !artifact.path.includes("synthetic") && artifact.classification === "private_synthetic")) {
    findings.push(finding("CONFORMANCE-SYNTHETIC-ARTIFACT-PATH-UNCLEAR", "warning", "A private synthetic artifact path is not clearly marked synthetic.", "Use explicit synthetic path naming to prevent operational confusion."));
  }

  return patientEducationConformanceEvaluationSchema.parse({
    schemaVersion: "1.0.0",
    conformancePackageId: conformancePackage.conformancePackageId,
    evaluatedAt,
    decision: findings.some((item) => item.severity === "blocking") ? "blocked" : "conformant",
    capabilityCount: conformancePackage.capabilities.length,
    scenarioCount: conformancePackage.scenarios.length,
    passedScenarioCount: conformancePackage.scenarios.filter((scenario) => scenario.executionStatus === "passed").length,
    findings,
    missingCapabilityIds,
    missingCriticalScenarioTypes,
  });
};
