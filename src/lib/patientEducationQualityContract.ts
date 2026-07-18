import { z } from "zod";

const scoreSchema = z.number().min(0).max(100);

export const patientEducationQualityFindingSchema = z.object({
  code: z.string().regex(/^QA-[A-Z0-9-]+$/),
  severity: z.enum(["info", "warning", "blocking"]),
  category: z.enum(["readability", "accessibility", "actionability", "numeracy", "clinical_safety", "localization", "structure"]),
  message: z.string().trim().min(1),
  blockId: z.string().optional(),
  remediation: z.string().trim().min(1),
});

export const patientEducationQualityReportSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  reportId: z.string().regex(/^CAF-PE-QA-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  documentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  generatedAt: z.string().datetime(),
  metrics: z.object({
    readingGrade: z.number().min(0).max(20),
    readingEase: scoreSchema,
    averageSentenceWords: z.number().positive(),
    passiveVoicePercent: z.number().min(0).max(100),
    actionabilityScore: scoreSchema,
    numeracyScore: scoreSchema,
    accessibilityScore: scoreSchema,
  }),
  thresholds: z.object({
    maximumReadingGrade: z.number().min(0).max(20),
    minimumReadingEase: scoreSchema,
    minimumActionabilityScore: scoreSchema,
    minimumNumeracyScore: scoreSchema,
    minimumAccessibilityScore: scoreSchema,
  }),
  findings: z.array(patientEducationQualityFindingSchema),
  humanReviews: z.object({
    healthLiteracy: z.enum(["not_started", "in_review", "approved", "rejected"]),
    accessibility: z.enum(["not_started", "in_review", "approved", "rejected"]),
    clinicalSafety: z.enum(["not_started", "in_review", "approved", "rejected"]),
  }),
  releaseDecision: z.enum(["blocked", "conditional", "passed"]),
}).superRefine((value, context) => {
  const metricFailures = [
    value.metrics.readingGrade > value.thresholds.maximumReadingGrade,
    value.metrics.readingEase < value.thresholds.minimumReadingEase,
    value.metrics.actionabilityScore < value.thresholds.minimumActionabilityScore,
    value.metrics.numeracyScore < value.thresholds.minimumNumeracyScore,
    value.metrics.accessibilityScore < value.thresholds.minimumAccessibilityScore,
  ].some(Boolean);
  const blockingFinding = value.findings.some((finding) => finding.severity === "blocking");
  const reviewsApproved = Object.values(value.humanReviews).every((status) => status === "approved");

  if (value.releaseDecision === "passed" && (metricFailures || blockingFinding || !reviewsApproved)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A passed quality report requires all thresholds, no blocking findings, and approved human reviews." });
  }
  if ((metricFailures || blockingFinding) && value.releaseDecision === "passed") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Threshold or blocking findings prevent release." });
  }
});

export type PatientEducationQualityReport = z.infer<typeof patientEducationQualityReportSchema>;
export const validatePatientEducationQualityReport = (value: unknown) => patientEducationQualityReportSchema.safeParse(value);
