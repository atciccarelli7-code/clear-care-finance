import registryJson from "@/data/employer-benefits-registry.json";

export type EmployerBenefitsDocumentType =
  | "benefits_guide"
  | "medical_sbc"
  | "employee_rate_sheet"
  | "retirement_summary"
  | "annual_change_notice"
  | "formulary"
  | "provider_network"
  | "other";

export type EmployerBenefitsSourceReviewStatus =
  | "official_source_located"
  | "metadata_reviewed"
  | "facts_extracted"
  | "verified_for_guidance";

export type EmployerBenefitsPackageStatus =
  | "source_collection_needed"
  | "source_collection_in_progress"
  | "review_in_progress"
  | "ready_for_guided_entry"
  | "retired";

export type EmployerBenefitsAvailability =
  | "source_collection_needed"
  | "partial_sources"
  | "ready_for_guided_entry";

export interface EmployerBenefitsSource {
  id: string;
  documentType: EmployerBenefitsDocumentType;
  title: string;
  url: string;
  officialDomain: string;
  reviewStatus: EmployerBenefitsSourceReviewStatus;
  retrievedAt: string;
}

export interface EmployerBenefitsPackage {
  id: string;
  planYear: number;
  populationLabel: string;
  status: EmployerBenefitsPackageStatus;
  sources: EmployerBenefitsSource[];
}

export interface EmployerBenefitsEmployeeClass {
  id: string;
  label: string;
}

export interface EmployerBenefitsEmployer {
  slug: string;
  name: string;
  aliases: string[];
  regions: string[];
  defaultPlanYear: number;
  availability: EmployerBenefitsAvailability;
  employeeClasses: EmployerBenefitsEmployeeClass[];
  packages: EmployerBenefitsPackage[];
}

export interface EmployerBenefitsRegistry {
  schemaVersion: 1;
  lastReviewedAt: string;
  coreDocumentTypes: EmployerBenefitsDocumentType[];
  employers: EmployerBenefitsEmployer[];
}

export interface EmployerBenefitsReadiness {
  locatedCoreDocumentCount: number;
  requiredCoreDocumentCount: number;
  completenessPercent: number;
  missingCoreDocumentTypes: EmployerBenefitsDocumentType[];
  canPrefillVerifiedFacts: boolean;
  label: string;
}

export interface EmployerBenefitsWorkspaceContext {
  schemaVersion: 1;
  employerSlug: string;
  employerName: string;
  packageId: string;
  planYear: number;
  employeeClassId: string;
  employeeClassLabel: string;
  populationLabel: string;
  sourceStatus: EmployerBenefitsPackageStatus;
  savedAt: string;
}

export const EMPLOYER_BENEFITS_CONTEXT_STORAGE_KEY = "caf-employer-benefits-context-v1";

export const employerBenefitsRegistry = registryJson as EmployerBenefitsRegistry;

export const employerBenefitsDocumentLabels: Record<EmployerBenefitsDocumentType, string> = {
  benefits_guide: "Benefits guide",
  medical_sbc: "Medical-plan SBC",
  employee_rate_sheet: "Employee premium rate sheet",
  retirement_summary: "Retirement-plan summary",
  annual_change_notice: "Annual change notice",
  formulary: "Prescription formulary",
  provider_network: "Provider-network reference",
  other: "Other official source",
};

export const getEmployerBenefitsEmployer = (slug: string) =>
  employerBenefitsRegistry.employers.find((employer) => employer.slug === slug);

export const searchEmployerBenefitsEmployers = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return employerBenefitsRegistry.employers;
  return employerBenefitsRegistry.employers.filter((employer) =>
    [employer.name, ...employer.aliases, ...employer.regions]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
};

export const getEmployerPackageReadiness = (benefitsPackage: EmployerBenefitsPackage): EmployerBenefitsReadiness => {
  const locatedTypes = new Set(
    benefitsPackage.sources
      .filter((source) => source.reviewStatus !== undefined)
      .map((source) => source.documentType),
  );
  const missingCoreDocumentTypes = employerBenefitsRegistry.coreDocumentTypes.filter(
    (documentType) => !locatedTypes.has(documentType),
  );
  const locatedCoreDocumentCount = employerBenefitsRegistry.coreDocumentTypes.length - missingCoreDocumentTypes.length;
  const requiredCoreDocumentCount = employerBenefitsRegistry.coreDocumentTypes.length;
  const completenessPercent = Math.round((locatedCoreDocumentCount / Math.max(requiredCoreDocumentCount, 1)) * 100);
  const canPrefillVerifiedFacts =
    benefitsPackage.status === "ready_for_guided_entry"
    && benefitsPackage.sources.some((source) => source.reviewStatus === "verified_for_guidance");

  return {
    locatedCoreDocumentCount,
    requiredCoreDocumentCount,
    completenessPercent,
    missingCoreDocumentTypes,
    canPrefillVerifiedFacts,
    label: canPrefillVerifiedFacts
      ? "Verified employer data ready"
      : locatedCoreDocumentCount > 0
        ? "Official sources located; extraction still in progress"
        : "Core source collection needed",
  };
};

export const createEmployerBenefitsWorkspaceContext = ({
  employer,
  benefitsPackage,
  employeeClass,
}: {
  employer: EmployerBenefitsEmployer;
  benefitsPackage: EmployerBenefitsPackage;
  employeeClass: EmployerBenefitsEmployeeClass;
}): EmployerBenefitsWorkspaceContext => ({
  schemaVersion: 1,
  employerSlug: employer.slug,
  employerName: employer.name,
  packageId: benefitsPackage.id,
  planYear: benefitsPackage.planYear,
  employeeClassId: employeeClass.id,
  employeeClassLabel: employeeClass.label,
  populationLabel: benefitsPackage.populationLabel,
  sourceStatus: benefitsPackage.status,
  savedAt: new Date().toISOString(),
});

export const saveEmployerBenefitsWorkspaceContext = (context: EmployerBenefitsWorkspaceContext) => {
  if (typeof window === "undefined") return context;
  window.localStorage.setItem(EMPLOYER_BENEFITS_CONTEXT_STORAGE_KEY, JSON.stringify(context));
  return context;
};

export const loadEmployerBenefitsWorkspaceContext = (): EmployerBenefitsWorkspaceContext | null => {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(EMPLOYER_BENEFITS_CONTEXT_STORAGE_KEY) || "null");
    if (!parsed || parsed.schemaVersion !== 1 || typeof parsed.employerSlug !== "string") return null;
    return parsed as EmployerBenefitsWorkspaceContext;
  } catch {
    return null;
  }
};
