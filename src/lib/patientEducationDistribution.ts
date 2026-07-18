import {
  patientEducationPackageSchema,
  type PatientEducationPackage,
} from "@/lib/patientEducationPackageContract";

export type PatientEducationDistributionMode =
  | "controlled_preview"
  | "institutional_delivery"
  | "internal_governance";

export type PatientEducationDistributionAsset = {
  assetId: string;
  type: PatientEducationPackage["assets"][number]["type"];
  title: string;
  audience: PatientEducationPackage["assets"][number]["audience"];
  formats: PatientEducationPackage["assets"][number]["formats"];
  version: string;
  localizationRequired: boolean;
  patientSpecificFieldsAllowed: boolean;
  containsClinicalInstructions: boolean;
};

export type PatientEducationDistributionManifest = {
  schemaVersion: "1.0.0";
  distributionMode: PatientEducationDistributionMode;
  generatedAt: string;
  package: {
    packageId: string;
    title: string;
    shortTitle: string;
    description: string;
    clinicalDomains: string[];
    intendedAudiences: string[];
    careSettings: string[];
    ageGroup: PatientEducationPackage["ageGroup"];
    language: string;
    riskTier: PatientEducationPackage["riskTier"];
    status: PatientEducationPackage["status"];
    version: string;
  };
  assets: PatientEducationDistributionAsset[];
  releaseSummary: {
    sourceDossierStatus: PatientEducationPackage["sourceDossierStatus"];
    gates: PatientEducationPackage["releaseGates"];
    requiredReviewRoles: Array<{
      roleId: string;
      roleLabel: string;
      discipline: string;
      approvalScope: string;
      status: PatientEducationPackage["requiredReviewRoles"][number]["status"];
      approvedVersion?: string;
      reviewedAt?: string;
      expiresAt?: string;
    }>;
    lastClinicalReviewAt?: string;
    nextClinicalReviewAt?: string;
  };
  localization: Array<{
    fieldId: string;
    label: string;
    category: PatientEducationPackage["localizationFields"][number]["category"];
    requiredForRelease: boolean;
    populatedBy: PatientEducationPackage["localizationFields"][number]["populatedBy"];
    allowsPhi: boolean;
    storageBoundary: string;
  }>;
  claimsBoundary: string[];
  correctionRoute: PatientEducationPackage["correctionRoute"];
  withheld: string[];
};

const institutionReadyStatuses = new Set<PatientEducationPackage["status"]>([
  "pilot_ready",
  "released",
]);

const previewAllowedAssetTypes = new Set<PatientEducationPackage["assets"][number]["type"]>([
  "quick_start",
  "clinician_reference",
  "implementation_workflow",
  "feedback_tool",
]);

const assertInstitutionReady = (packageValue: PatientEducationPackage) => {
  if (!institutionReadyStatuses.has(packageValue.status)) {
    throw new Error("Institutional delivery requires a pilot-ready or released package.");
  }
  const failedGate = Object.entries(packageValue.releaseGates).find(([, status]) => status !== "passed");
  if (failedGate) throw new Error(`Institutional delivery is blocked by release gate: ${failedGate[0]}.`);
  const unapprovedRole = packageValue.requiredReviewRoles.find((role) => role.required && role.status !== "approved");
  if (unapprovedRole) throw new Error(`Institutional delivery is blocked by required review role: ${unapprovedRole.roleId}.`);
};

const sanitizeReviewRoles = (
  roles: PatientEducationPackage["requiredReviewRoles"],
  mode: PatientEducationDistributionMode,
): PatientEducationDistributionManifest["releaseSummary"]["requiredReviewRoles"] => roles.map((role) => ({
  roleId: role.roleId,
  roleLabel: role.roleLabel,
  discipline: role.discipline,
  approvalScope: role.approvalScope,
  status: mode === "controlled_preview" && role.status === "approved" ? "assigned" : role.status,
  ...(mode !== "controlled_preview" && role.approvedVersion ? { approvedVersion: role.approvedVersion } : {}),
  ...(mode !== "controlled_preview" && role.reviewedAt ? { reviewedAt: role.reviewedAt } : {}),
  ...(mode !== "controlled_preview" && role.expiresAt ? { expiresAt: role.expiresAt } : {}),
}));

const sanitizeAssets = (
  assets: PatientEducationPackage["assets"],
  mode: PatientEducationDistributionMode,
): PatientEducationDistributionAsset[] => assets
  .filter((asset) => {
    if (mode !== "controlled_preview") return true;
    return asset.publicDistributionAllowed && !asset.containsClinicalInstructions && previewAllowedAssetTypes.has(asset.type);
  })
  .map((asset) => ({
    assetId: asset.assetId,
    type: asset.type,
    title: asset.title,
    audience: [...asset.audience],
    formats: [...asset.formats],
    version: asset.version,
    localizationRequired: asset.localizationRequired,
    patientSpecificFieldsAllowed: mode === "controlled_preview" ? false : asset.patientSpecificFieldsAllowed,
    containsClinicalInstructions: asset.containsClinicalInstructions,
  }));

const sanitizeLocalization = (
  fields: PatientEducationPackage["localizationFields"],
  mode: PatientEducationDistributionMode,
): PatientEducationDistributionManifest["localization"] => fields
  .filter((field) => mode !== "controlled_preview" || !field.allowsPhi)
  .map((field) => ({
    fieldId: field.fieldId,
    label: field.label,
    category: field.category,
    requiredForRelease: field.requiredForRelease,
    populatedBy: field.populatedBy,
    allowsPhi: mode === "controlled_preview" ? false : field.allowsPhi,
    storageBoundary: field.storageBoundary,
  }));

export const buildPatientEducationDistributionManifest = (
  value: unknown,
  mode: PatientEducationDistributionMode,
  generatedAt = new Date().toISOString(),
): PatientEducationDistributionManifest => {
  const packageValue = patientEducationPackageSchema.parse(value);

  if (mode === "controlled_preview" && packageValue.publicStatus === "private") {
    throw new Error("Controlled preview export requires package publicStatus to be controlled_preview or public.");
  }
  if (mode === "institutional_delivery") assertInstitutionReady(packageValue);

  const withheld = [
    "Reviewer identities and contact information",
    "Evidence dossier contents and restricted source files",
    "Client contracts, pricing, and commercial terms",
    "Patient, employee, member, and clinician identifiers",
  ];

  if (mode === "controlled_preview") {
    withheld.push(
      "Restricted clinical-instruction assets",
      "Patient-specific and PHI-capable localization fields",
      "Hospital contacts, policies, formularies, and customizations",
      "Approval dates and reviewer provenance",
    );
  }

  return {
    schemaVersion: "1.0.0",
    distributionMode: mode,
    generatedAt,
    package: {
      packageId: packageValue.packageId,
      title: packageValue.title,
      shortTitle: packageValue.shortTitle,
      description: packageValue.description,
      clinicalDomains: [...packageValue.clinicalDomains],
      intendedAudiences: [...packageValue.intendedAudiences],
      careSettings: [...packageValue.careSettings],
      ageGroup: packageValue.ageGroup,
      language: packageValue.language,
      riskTier: packageValue.riskTier,
      status: packageValue.status,
      version: packageValue.version,
    },
    assets: sanitizeAssets(packageValue.assets, mode),
    releaseSummary: {
      sourceDossierStatus: mode === "controlled_preview" ? "not_started" : packageValue.sourceDossierStatus,
      gates: mode === "controlled_preview"
        ? Object.fromEntries(Object.keys(packageValue.releaseGates).map((gate) => [gate, "not_started"])) as PatientEducationPackage["releaseGates"]
        : packageValue.releaseGates,
      requiredReviewRoles: sanitizeReviewRoles(packageValue.requiredReviewRoles, mode),
      ...(mode !== "controlled_preview" && packageValue.lastClinicalReviewAt ? { lastClinicalReviewAt: packageValue.lastClinicalReviewAt } : {}),
      ...(mode !== "controlled_preview" && packageValue.nextClinicalReviewAt ? { nextClinicalReviewAt: packageValue.nextClinicalReviewAt } : {}),
    },
    localization: sanitizeLocalization(packageValue.localizationFields, mode),
    claimsBoundary: [...packageValue.claimsBoundary],
    correctionRoute: {
      ownerRole: packageValue.correctionRoute.ownerRole,
      severityModel: [...packageValue.correctionRoute.severityModel],
      recallCapable: packageValue.correctionRoute.recallCapable,
      customerNotificationRequiredFor: [...packageValue.correctionRoute.customerNotificationRequiredFor],
    },
    withheld,
  };
};
