import { z } from "zod";
import {
  patientEducationInstitutionOverlaySchema,
  type PatientEducationInstitutionOverlay,
} from "@/lib/patientEducationInstitutionOverlay";
import {
  patientEducationLocalizationPackageSchema,
  type PatientEducationLocalizationPackage,
} from "@/lib/patientEducationLocalizationContract";
import {
  patientEducationQualityReportSchema,
  type PatientEducationQualityReport,
} from "@/lib/patientEducationQualityContract";
import {
  patientEducationReleaseRecordSchema,
  type PatientEducationReleaseRecord,
} from "@/lib/patientEducationReleaseRegistry";

const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
const localeSchema = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);

export const patientEducationAuthorizationGateStatusSchema = z.enum([
  "pending",
  "passed",
  "blocked",
  "not_required",
]);

export const patientEducationReleaseAuthorizationRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  authorizationId: z.string().regex(/^CAF-PE-AUTH-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  requestedStatus: z.enum(["pilot_ready", "released"]),
  contentHash: hashSchema,
  evaluatedAt: z.string().datetime(),
  documents: z.array(z.object({
    documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
    documentVersion: semverSchema,
    sourceLanguage: localeSchema,
    deliveryLanguage: localeSchema,
    required: z.boolean(),
  })).min(1),
  requiredOverlayFieldIds: z.array(z.string().regex(/^[a-z0-9][a-z0-9_-]*$/)),
  gates: z.object({
    evidence: patientEducationAuthorizationGateStatusSchema,
    clinicalReview: patientEducationAuthorizationGateStatusSchema,
    healthLiteracy: patientEducationAuthorizationGateStatusSchema,
    accessibility: patientEducationAuthorizationGateStatusSchema,
    patientTesting: patientEducationAuthorizationGateStatusSchema,
    institutionalLocalization: patientEducationAuthorizationGateStatusSchema,
    privacySecurity: patientEducationAuthorizationGateStatusSchema,
    outputIntegrity: patientEducationAuthorizationGateStatusSchema,
  }),
  qualityReports: z.array(patientEducationQualityReportSchema),
  localizationPackages: z.array(patientEducationLocalizationPackageSchema),
  institutionOverlay: patientEducationInstitutionOverlaySchema.optional(),
  releaseRecord: patientEducationReleaseRecordSchema,
}).superRefine((value, context) => {
  const documentKeys = value.documents.map((document) => `${document.documentId}:${document.documentVersion}:${document.deliveryLanguage}`);
  if (new Set(documentKeys).size !== documentKeys.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Authorization documents must be unique by document, version, and delivery language." });
  }
  if (new Set(value.requiredOverlayFieldIds).size !== value.requiredOverlayFieldIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Required overlay field IDs must be unique." });
  }
});

export const patientEducationReleaseAuthorizationFindingSchema = z.object({
  code: z.string().regex(/^AUTH-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking"]),
  message: z.string().trim().min(1),
  remediation: z.string().trim().min(1),
  documentId: z.string().optional(),
});

export const patientEducationReleaseAuthorizationResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  authorizationId: z.string().regex(/^CAF-PE-AUTH-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  requestedStatus: z.enum(["pilot_ready", "released"]),
  evaluatedAt: z.string().datetime(),
  decision: z.enum(["authorized", "blocked"]),
  findings: z.array(patientEducationReleaseAuthorizationFindingSchema),
  verifiedDocumentKeys: z.array(z.string()),
  verifiedLocalizationIds: z.array(z.string()),
  verifiedOverlayId: z.string().optional(),
  releaseRecordHash: hashSchema,
});

export type PatientEducationReleaseAuthorizationRequest = z.infer<typeof patientEducationReleaseAuthorizationRequestSchema>;
export type PatientEducationReleaseAuthorizationResult = z.infer<typeof patientEducationReleaseAuthorizationResultSchema>;

const finding = (
  code: string,
  message: string,
  remediation: string,
  documentId?: string,
): z.infer<typeof patientEducationReleaseAuthorizationFindingSchema> => ({
  code,
  severity: "blocking",
  message,
  remediation,
  ...(documentId ? { documentId } : {}),
});

const isExpired = (expiresAt: string | undefined, evaluatedAt: string) =>
  Boolean(expiresAt && new Date(expiresAt) <= new Date(evaluatedAt));

const findQualityReport = (
  reports: PatientEducationQualityReport[],
  documentId: string,
  documentVersion: string,
  locale: string,
) => reports.find((report) =>
  report.documentId === documentId
  && report.documentVersion === documentVersion
  && report.locale === locale,
);

const findLocalization = (
  localizations: PatientEducationLocalizationPackage[],
  documentId: string,
  sourceAssetVersion: string,
  sourceLanguage: string,
  targetLanguage: string,
) => localizations.find((localization) =>
  localization.documentId === documentId
  && localization.sourceAssetVersion === sourceAssetVersion
  && localization.sourceLanguage === sourceLanguage
  && localization.targetLanguage === targetLanguage,
);

const validateReleaseRecord = (
  record: PatientEducationReleaseRecord,
  request: PatientEducationReleaseAuthorizationRequest,
  findings: PatientEducationReleaseAuthorizationResult["findings"],
) => {
  if (record.packageId !== request.packageId || record.packageVersion !== request.packageVersion) {
    findings.push(finding(
      "AUTH-RELEASE-RECORD-VERSION-MISMATCH",
      "The release record does not match the requested package and version.",
      "Use a release record created for this exact package version.",
    ));
  }
  if (record.contentHash !== request.contentHash) {
    findings.push(finding(
      "AUTH-CONTENT-HASH-MISMATCH",
      "The release record content hash does not match the authorization request.",
      "Rebuild the package, regenerate its content hash, and repeat all version-bound checks.",
    ));
  }
  if (record.status !== request.requestedStatus) {
    findings.push(finding(
      "AUTH-RELEASE-STATUS-MISMATCH",
      `Release record status ${record.status} does not equal requested status ${request.requestedStatus}.`,
      "Complete the required release-ledger transition before requesting authorization.",
    ));
  }
  if (isExpired(record.expiresAt, request.evaluatedAt)) {
    findings.push(finding(
      "AUTH-RELEASE-RECORD-EXPIRED",
      "The release record has expired.",
      "Reopen review and issue a new approved release record.",
    ));
  }
  if (!record.effectiveAt || new Date(record.effectiveAt) > new Date(request.evaluatedAt)) {
    findings.push(finding(
      "AUTH-RELEASE-NOT-EFFECTIVE",
      "The release record is not effective at the evaluation time.",
      "Use the approved effective date or defer distribution until it becomes effective.",
    ));
  }
};

export const authorizePatientEducationRelease = (
  input: unknown,
): PatientEducationReleaseAuthorizationResult => {
  const request = patientEducationReleaseAuthorizationRequestSchema.parse(input);
  const findings: PatientEducationReleaseAuthorizationResult["findings"] = [];
  const verifiedDocumentKeys: string[] = [];
  const verifiedLocalizationIds: string[] = [];

  validateReleaseRecord(request.releaseRecord, request, findings);

  for (const [gateName, status] of Object.entries(request.gates)) {
    if (status !== "passed" && status !== "not_required") {
      findings.push(finding(
        `AUTH-GATE-${gateName.replace(/[A-Z]/g, (letter) => `-${letter}`).toUpperCase()}-${status.toUpperCase()}`,
        `Required authorization gate ${gateName} is ${status}.`,
        "Resolve the gate and attach its approved evidence before authorizing distribution.",
      ));
    }
  }

  for (const document of request.documents) {
    if (!document.required) continue;
    const documentKey = `${document.documentId}:${document.documentVersion}:${document.deliveryLanguage}`;
    const report = findQualityReport(
      request.qualityReports,
      document.documentId,
      document.documentVersion,
      document.deliveryLanguage,
    );
    if (!report) {
      findings.push(finding(
        "AUTH-QUALITY-REPORT-MISSING",
        `No quality report exists for ${documentKey}.`,
        "Generate and approve a quality report for the exact document version and delivery language.",
        document.documentId,
      ));
    } else if (report.packageId !== request.packageId || report.packageVersion !== request.packageVersion) {
      findings.push(finding(
        "AUTH-QUALITY-PACKAGE-MISMATCH",
        `The quality report for ${documentKey} belongs to a different package version.`,
        "Regenerate quality analysis from the exact package version being authorized.",
        document.documentId,
      ));
    } else if (report.releaseDecision !== "passed") {
      findings.push(finding(
        "AUTH-QUALITY-NOT-PASSED",
        `The quality report for ${documentKey} is ${report.releaseDecision}.`,
        "Resolve all blocking findings and obtain every required human approval.",
        document.documentId,
      ));
    } else {
      verifiedDocumentKeys.push(documentKey);
    }

    if (document.deliveryLanguage !== document.sourceLanguage) {
      const localization = findLocalization(
        request.localizationPackages,
        document.documentId,
        document.documentVersion,
        document.sourceLanguage,
        document.deliveryLanguage,
      );
      if (!localization) {
        findings.push(finding(
          "AUTH-LOCALIZATION-MISSING",
          `No localization package exists for ${documentKey}.`,
          "Create a localization package linked to the exact source document version.",
          document.documentId,
        ));
      } else if (localization.status !== "approved") {
        findings.push(finding(
          "AUTH-LOCALIZATION-NOT-APPROVED",
          `Localization ${localization.localizationId} is ${localization.status}.`,
          "Complete language, clinical-equivalence, and health-literacy review.",
          document.documentId,
        ));
      } else {
        verifiedLocalizationIds.push(localization.localizationId);
      }
    }
  }

  let verifiedOverlayId: string | undefined;
  if (request.requiredOverlayFieldIds.length > 0) {
    const overlay = request.institutionOverlay;
    if (!overlay) {
      findings.push(finding(
        "AUTH-INSTITUTION-OVERLAY-MISSING",
        "Institution-specific fields are required but no overlay was supplied.",
        "Provide an approved, version-matched institution overlay.",
      ));
    } else {
      if (overlay.packageId !== request.packageId || overlay.packageVersion !== request.packageVersion) {
        findings.push(finding(
          "AUTH-INSTITUTION-OVERLAY-VERSION-MISMATCH",
          "The institution overlay does not match the requested package version.",
          "Regenerate and approve the overlay for this exact package version.",
        ));
      }
      if (overlay.status !== "approved") {
        findings.push(finding(
          "AUTH-INSTITUTION-OVERLAY-NOT-APPROVED",
          `Institution overlay ${overlay.overlayId} is ${overlay.status}.`,
          "Complete institutional approval before delivery.",
        ));
      }
      if (new Date(overlay.effectiveAt) > new Date(request.evaluatedAt) || isExpired(overlay.expiresAt, request.evaluatedAt)) {
        findings.push(finding(
          "AUTH-INSTITUTION-OVERLAY-INACTIVE",
          "The institution overlay is not active at the evaluation time.",
          "Use an active approved overlay or correct its governed effective period.",
        ));
      }
      const availableFields = new Set(overlay.fields.map((field) => field.fieldId));
      const missingFields = request.requiredOverlayFieldIds.filter((fieldId) => !availableFields.has(fieldId));
      if (missingFields.length > 0) {
        findings.push(finding(
          "AUTH-INSTITUTION-OVERLAY-FIELDS-MISSING",
          `Required overlay field(s) are missing: ${missingFields.join(", ")}.`,
          "Populate and approve every required non-PHI institution field.",
        ));
      }
      if (
        overlay.packageId === request.packageId
        && overlay.packageVersion === request.packageVersion
        && overlay.status === "approved"
        && new Date(overlay.effectiveAt) <= new Date(request.evaluatedAt)
        && !isExpired(overlay.expiresAt, request.evaluatedAt)
        && missingFields.length === 0
      ) {
        verifiedOverlayId = overlay.overlayId;
      }
    }
  }

  return patientEducationReleaseAuthorizationResultSchema.parse({
    schemaVersion: "1.0.0",
    authorizationId: request.authorizationId,
    packageId: request.packageId,
    packageVersion: request.packageVersion,
    requestedStatus: request.requestedStatus,
    evaluatedAt: request.evaluatedAt,
    decision: findings.some((item) => item.severity === "blocking") ? "blocked" : "authorized",
    findings,
    verifiedDocumentKeys,
    verifiedLocalizationIds,
    ...(verifiedOverlayId ? { verifiedOverlayId } : {}),
    releaseRecordHash: request.releaseRecord.contentHash,
  });
};

export const assertPatientEducationReleaseAuthorized = (
  request: PatientEducationReleaseAuthorizationRequest,
) => {
  const result = authorizePatientEducationRelease(request);
  if (result.decision !== "authorized") {
    const codes = result.findings.map((item) => item.code).join(", ");
    throw new Error(`Patient education release authorization blocked: ${codes}`);
  }
  return result;
};
