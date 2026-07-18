import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";
import {
  compilePatientEducationReleaseBundle,
  type PatientEducationReleaseBundle,
} from "@/lib/patientEducationBundleCompiler";
import {
  buildPatientEducationIntegrityManifest,
  verifyPatientEducationIntegrityManifest,
  type PatientEducationIntegrityManifest,
} from "@/lib/patientEducationIntegrityManifest";
import {
  applyPatientEducationInstitutionOverlay,
} from "@/lib/patientEducationInstitutionOverlayCompiler";
import {
  patientEducationInstitutionOverlaySchema,
  type PatientEducationInstitutionOverlay,
} from "@/lib/patientEducationInstitutionOverlay";
import {
  applyPatientEducationLocalization,
  patientEducationLocalizationPackageSchema,
  type PatientEducationLocalizationPackage,
} from "@/lib/patientEducationLocalizationContract";
import {
  patientEducationPackageSchema,
  type PatientEducationPackage,
} from "@/lib/patientEducationPackageContract";
import {
  analyzePatientEducationQuality,
  type PatientEducationQualityEngineOptions,
} from "@/lib/patientEducationQualityEngine";
import {
  patientEducationQualityReportSchema,
  type PatientEducationQualityReport,
} from "@/lib/patientEducationQualityContract";
import {
  assertPatientEducationPrivacyBoundary,
  scanPatientEducationDocumentPrivacy,
  scanPatientEducationOverlayPrivacy,
  type PatientEducationPrivacyScanResult,
} from "@/lib/patientEducationPrivacyBoundary";
import {
  authorizePatientEducationRelease,
  type PatientEducationReleaseAuthorizationRequest,
  type PatientEducationReleaseAuthorizationResult,
} from "@/lib/patientEducationReleaseAuthorization";
import type { PatientEducationReleaseRecord } from "@/lib/patientEducationReleaseRegistry";

export type PatientEducationPreparedDocument = {
  sourceDocumentId: string;
  sourceLanguage: string;
  deliveryLanguage: string;
  document: PatientEducationContentDocument;
  localizationId?: string;
  overlayId?: string;
  privacyScan: PatientEducationPrivacyScanResult;
  qualityReport: PatientEducationQualityReport;
};

export type PatientEducationReleaseCandidate = {
  schemaVersion: "1.0.0";
  candidateId: string;
  generatedAt: string;
  packageValue: PatientEducationPackage;
  mode: "controlled_preview" | "institutional_delivery" | "internal_governance";
  preparedDocuments: PatientEducationPreparedDocument[];
  bundle: PatientEducationReleaseBundle;
  integrityManifest: PatientEducationIntegrityManifest;
  localizationPackages: PatientEducationLocalizationPackage[];
  institutionOverlay?: PatientEducationInstitutionOverlay;
};

export type PreparePatientEducationReleaseCandidateInput = {
  candidateId: string;
  packageValue: unknown;
  documents: unknown[];
  mode: PatientEducationReleaseCandidate["mode"];
  generatedAt?: string;
  deliveryLanguages?: Record<string, string>;
  localizationPackages?: unknown[];
  institutionOverlay?: unknown;
  qualityOptionsByDocumentId?: Record<string, PatientEducationQualityEngineOptions>;
};

const findLocalization = (
  packages: PatientEducationLocalizationPackage[],
  document: PatientEducationContentDocument,
  deliveryLanguage: string,
) => packages.find((localization) =>
  localization.documentId === document.documentId
  && localization.sourceLanguage === document.language
  && localization.targetLanguage === deliveryLanguage
  && localization.sourceAssetVersion === document.assetVersion,
);

const documentDeclaresOverlayField = (
  document: PatientEducationContentDocument,
  fieldId: string,
) => document.blocks.some((block) =>
  block.type === "personalization" && block.fields.some((field) => field.fieldId === fieldId),
);

export const preparePatientEducationReleaseCandidate = async ({
  candidateId,
  packageValue: rawPackage,
  documents: rawDocuments,
  mode,
  generatedAt = new Date().toISOString(),
  deliveryLanguages = {},
  localizationPackages: rawLocalizations = [],
  institutionOverlay: rawOverlay,
  qualityOptionsByDocumentId = {},
}: PreparePatientEducationReleaseCandidateInput): Promise<PatientEducationReleaseCandidate> => {
  if (!/^CAF-PE-CANDIDATE-[A-Z0-9-]+$/.test(candidateId)) {
    throw new Error("Patient education candidateId must use the CAF-PE-CANDIDATE-* format.");
  }

  const packageValue = patientEducationPackageSchema.parse(rawPackage);
  const sourceDocuments = rawDocuments.map((document) => patientEducationContentDocumentSchema.parse(document));
  const localizationPackages = rawLocalizations.map((localization) => patientEducationLocalizationPackageSchema.parse(localization));
  const institutionOverlay = rawOverlay ? patientEducationInstitutionOverlaySchema.parse(rawOverlay) : undefined;

  if (institutionOverlay) {
    assertPatientEducationPrivacyBoundary(scanPatientEducationOverlayPrivacy(
      institutionOverlay,
      mode === "controlled_preview" ? "controlled_preview" : "institutional_delivery",
    ));
  }

  const preparedDocuments: PatientEducationPreparedDocument[] = [];
  for (const sourceDocument of sourceDocuments) {
    assertPatientEducationPrivacyBoundary(scanPatientEducationDocumentPrivacy(sourceDocument, "caf_source_repository"));
    const deliveryLanguage = deliveryLanguages[sourceDocument.documentId] ?? sourceDocument.language;
    let document = sourceDocument;
    let localizationId: string | undefined;
    let overlayId: string | undefined;

    if (deliveryLanguage !== sourceDocument.language) {
      const localization = findLocalization(localizationPackages, sourceDocument, deliveryLanguage);
      if (!localization) {
        throw new Error(`Missing exact localization for ${sourceDocument.documentId} ${sourceDocument.language} to ${deliveryLanguage}.`);
      }
      document = applyPatientEducationLocalization(sourceDocument, localization);
      localizationId = localization.localizationId;
    }

    if (institutionOverlay && institutionOverlay.locale === document.language) {
      const declaredFieldIds = institutionOverlay.fields
        .map((field) => field.fieldId)
        .filter((fieldId) => documentDeclaresOverlayField(document, fieldId));
      if (declaredFieldIds.length > 0) {
        const applied = applyPatientEducationInstitutionOverlay(document, institutionOverlay, {
          evaluatedAt: generatedAt,
          requiredFieldIds: declaredFieldIds,
          allowUnusedFields: true,
        });
        document = applied.document;
        overlayId = applied.overlayId;
      }
    }

    const privacyContext = mode === "controlled_preview" ? "controlled_preview" : "institutional_delivery";
    const privacyScan = scanPatientEducationDocumentPrivacy(document, privacyContext);
    if (mode !== "controlled_preview") assertPatientEducationPrivacyBoundary(privacyScan);

    const generatedQualityReport = analyzePatientEducationQuality(document, {
      ...qualityOptionsByDocumentId[sourceDocument.documentId],
      generatedAt,
    });
    const qualityReport = patientEducationQualityReportSchema.parse({
      ...generatedQualityReport,
      packageVersion: packageValue.version,
    });

    preparedDocuments.push({
      sourceDocumentId: sourceDocument.documentId,
      sourceLanguage: sourceDocument.language,
      deliveryLanguage,
      document,
      ...(localizationId ? { localizationId } : {}),
      ...(overlayId ? { overlayId } : {}),
      privacyScan,
      qualityReport,
    });
  }

  const bundle = compilePatientEducationReleaseBundle({
    packageValue,
    documents: preparedDocuments.map((prepared) => prepared.document),
    mode,
    generatedAt,
  });
  const integrityManifest = await buildPatientEducationIntegrityManifest(bundle);

  return {
    schemaVersion: "1.0.0",
    candidateId,
    generatedAt,
    packageValue,
    mode,
    preparedDocuments,
    bundle,
    integrityManifest,
    localizationPackages,
    ...(institutionOverlay ? { institutionOverlay } : {}),
  };
};

export type AuthorizePreparedPatientEducationCandidateInput = {
  candidate: PatientEducationReleaseCandidate;
  authorizationId: string;
  requestedStatus: "pilot_ready" | "released";
  evaluatedAt: string;
  releaseRecord: PatientEducationReleaseRecord;
  gates: PatientEducationReleaseAuthorizationRequest["gates"];
  requiredOverlayFieldIds?: string[];
};

export type AuthorizedPatientEducationDelivery = {
  decision: "authorized";
  authorization: PatientEducationReleaseAuthorizationResult;
  bundle: PatientEducationReleaseBundle;
  integrityManifest: PatientEducationIntegrityManifest;
  qualityReports: PatientEducationQualityReport[];
};

export type BlockedPatientEducationDelivery = {
  decision: "blocked";
  authorization: PatientEducationReleaseAuthorizationResult;
  integrityManifest: PatientEducationIntegrityManifest;
  qualityReports: PatientEducationQualityReport[];
};

export const authorizePreparedPatientEducationCandidate = async ({
  candidate,
  authorizationId,
  requestedStatus,
  evaluatedAt,
  releaseRecord,
  gates,
  requiredOverlayFieldIds = [],
}: AuthorizePreparedPatientEducationCandidateInput): Promise<
  AuthorizedPatientEducationDelivery | BlockedPatientEducationDelivery
> => {
  if (candidate.mode !== "institutional_delivery") {
    throw new Error("Formal pilot or release authorization requires an institutional-delivery candidate.");
  }

  const integrityVerification = await verifyPatientEducationIntegrityManifest(
    candidate.bundle,
    candidate.integrityManifest,
  );
  if (!integrityVerification.valid) {
    throw new Error(`Patient education candidate integrity verification failed: ${integrityVerification.issues.join(", ")}`);
  }

  const distributedDocumentIds = new Set(candidate.bundle.artifacts.map((artifact) => artifact.documentId));
  const requiredDocuments = candidate.preparedDocuments
    .filter((prepared) => distributedDocumentIds.has(prepared.document.documentId))
    .map((prepared) => ({
      documentId: prepared.document.documentId,
      documentVersion: prepared.document.assetVersion,
      sourceLanguage: prepared.sourceLanguage,
      deliveryLanguage: prepared.deliveryLanguage,
      required: true,
    }));

  const authorization = authorizePatientEducationRelease({
    schemaVersion: "1.0.0",
    authorizationId,
    packageId: candidate.packageValue.packageId,
    packageVersion: candidate.packageValue.version,
    requestedStatus,
    contentHash: candidate.integrityManifest.canonicalBundleSha256,
    evaluatedAt,
    documents: requiredDocuments,
    requiredOverlayFieldIds,
    gates,
    qualityReports: candidate.preparedDocuments.map((prepared) => prepared.qualityReport),
    localizationPackages: candidate.localizationPackages,
    ...(candidate.institutionOverlay ? { institutionOverlay: candidate.institutionOverlay } : {}),
    releaseRecord,
  });

  const qualityReports = candidate.preparedDocuments.map((prepared) => prepared.qualityReport);
  if (authorization.decision === "blocked") {
    return {
      decision: "blocked",
      authorization,
      integrityManifest: candidate.integrityManifest,
      qualityReports,
    };
  }

  return {
    decision: "authorized",
    authorization,
    bundle: candidate.bundle,
    integrityManifest: candidate.integrityManifest,
    qualityReports,
  };
};
