export const MEDICAL_BILL_TRACKER_STORAGE_KEY = "caf-medical-bill-tracker-v1";

export const CONTACT_TYPES = [
  "provider_billing",
  "insurer_or_plan",
  "hospital_financial_assistance",
  "collection_agency",
  "employer_plan_administrator",
  "government_help_desk",
  "other",
] as const;

export const OUTCOME_TYPES = [
  "information_received",
  "documents_requested",
  "claim_or_bill_under_review",
  "correction_or_resubmission_requested",
  "financial_assistance_application",
  "appeal_or_dispute_started",
  "payment_arrangement_discussed",
  "no_resolution",
] as const;

export const STATUS_TYPES = [
  "open",
  "waiting_for_documents",
  "waiting_for_response",
  "appeal_or_dispute_pending",
  "financial_assistance_pending",
  "resolved",
] as const;

export const DOCUMENT_TYPES = [
  "itemized_bill",
  "eob_or_msn",
  "written_claim_status",
  "denial_or_adverse_notice",
  "financial_assistance_policy",
  "financial_assistance_application",
  "appeal_instructions",
  "account_status_confirmation",
] as const;

export type MedicalBillContactType = (typeof CONTACT_TYPES)[number];
export type MedicalBillOutcomeType = (typeof OUTCOME_TYPES)[number];
export type MedicalBillStatus = (typeof STATUS_TYPES)[number];
export type MedicalBillDocumentType = (typeof DOCUMENT_TYPES)[number];

export type MedicalBillTrackerEntry = {
  id: string;
  contactDate: string;
  contactType: MedicalBillContactType;
  departmentRole: string;
  representativeId: string;
  callReference: string;
  outcome: MedicalBillOutcomeType;
  documentsRequested: MedicalBillDocumentType[];
  promisedAction: string;
  expectedResponseDate: string;
  appealDeadline: string;
  followUpDate: string;
  status: MedicalBillStatus;
  createdAt: string;
  updatedAt: string;
};

export type MedicalBillTrackerDraft = Omit<MedicalBillTrackerEntry, "id" | "createdAt" | "updatedAt">;

const isAllowed = <T extends readonly string[]>(value: unknown, values: T): value is T[number] =>
  typeof value === "string" && values.includes(value as T[number]);

const cleanText = (value: unknown, max = 80) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

const cleanDate = (value: unknown) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  return value;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createMedicalBillTrackerEntry = (
  draft: MedicalBillTrackerDraft,
  now = new Date(),
): MedicalBillTrackerEntry => {
  const timestamp = now.toISOString();
  return {
    id: makeId(),
    contactDate: cleanDate(draft.contactDate),
    contactType: isAllowed(draft.contactType, CONTACT_TYPES) ? draft.contactType : "other",
    departmentRole: cleanText(draft.departmentRole, 60),
    representativeId: cleanText(draft.representativeId, 40),
    callReference: cleanText(draft.callReference, 60),
    outcome: isAllowed(draft.outcome, OUTCOME_TYPES) ? draft.outcome : "no_resolution",
    documentsRequested: Array.from(
      new Set((draft.documentsRequested || []).filter((item): item is MedicalBillDocumentType => isAllowed(item, DOCUMENT_TYPES))),
    ),
    promisedAction: cleanText(draft.promisedAction, 100),
    expectedResponseDate: cleanDate(draft.expectedResponseDate),
    appealDeadline: cleanDate(draft.appealDeadline),
    followUpDate: cleanDate(draft.followUpDate),
    status: isAllowed(draft.status, STATUS_TYPES) ? draft.status : "open",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const normalizeMedicalBillTrackerEntries = (value: unknown): MedicalBillTrackerEntry[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object") return [];
    const record = candidate as Record<string, unknown>;
    const contactType = isAllowed(record.contactType, CONTACT_TYPES) ? record.contactType : null;
    const outcome = isAllowed(record.outcome, OUTCOME_TYPES) ? record.outcome : null;
    const status = isAllowed(record.status, STATUS_TYPES) ? record.status : null;
    if (!contactType || !outcome || !status) return [];

    return [{
      id: cleanText(record.id, 100) || makeId(),
      contactDate: cleanDate(record.contactDate),
      contactType,
      departmentRole: cleanText(record.departmentRole, 60),
      representativeId: cleanText(record.representativeId, 40),
      callReference: cleanText(record.callReference, 60),
      outcome,
      documentsRequested: Array.from(
        new Set(
          (Array.isArray(record.documentsRequested) ? record.documentsRequested : []).filter(
            (item): item is MedicalBillDocumentType => isAllowed(item, DOCUMENT_TYPES),
          ),
        ),
      ),
      promisedAction: cleanText(record.promisedAction, 100),
      expectedResponseDate: cleanDate(record.expectedResponseDate),
      appealDeadline: cleanDate(record.appealDeadline),
      followUpDate: cleanDate(record.followUpDate),
      status,
      createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date(0).toISOString(),
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date(0).toISOString(),
    }];
  });
};

export const parseMedicalBillTrackerEntries = (raw: string | null): MedicalBillTrackerEntry[] => {
  if (!raw) return [];
  try {
    return normalizeMedicalBillTrackerEntries(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const sortMedicalBillTrackerEntries = (entries: MedicalBillTrackerEntry[]) =>
  [...entries].sort((a, b) => {
    const aDate = a.followUpDate || a.appealDeadline || a.expectedResponseDate || a.contactDate || "9999-12-31";
    const bDate = b.followUpDate || b.appealDeadline || b.expectedResponseDate || b.contactDate || "9999-12-31";
    return aDate.localeCompare(bDate) || b.updatedAt.localeCompare(a.updatedAt);
  });

const titleCase = (value: string) => value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

export const exportMedicalBillTrackerText = (entries: MedicalBillTrackerEntry[]) => {
  const lines = [
    "Medical Bill Call and Deadline Tracker",
    "Educational organization tool — verify all deadlines with written notices and official sources.",
    "",
  ];

  sortMedicalBillTrackerEntries(entries).forEach((entry, index) => {
    lines.push(`Entry ${index + 1}`);
    lines.push(`Contact date: ${entry.contactDate || "Not recorded"}`);
    lines.push(`Contact type: ${titleCase(entry.contactType)}`);
    if (entry.departmentRole) lines.push(`Department or role: ${entry.departmentRole}`);
    if (entry.representativeId) lines.push(`Representative initials or ID: ${entry.representativeId}`);
    if (entry.callReference) lines.push(`Call reference: ${entry.callReference}`);
    lines.push(`Outcome: ${titleCase(entry.outcome)}`);
    if (entry.documentsRequested.length) lines.push(`Documents requested: ${entry.documentsRequested.map(titleCase).join(", ")}`);
    if (entry.promisedAction) lines.push(`Promised next action: ${entry.promisedAction}`);
    if (entry.expectedResponseDate) lines.push(`Expected response: ${entry.expectedResponseDate}`);
    if (entry.appealDeadline) lines.push(`Appeal or dispute deadline: ${entry.appealDeadline}`);
    if (entry.followUpDate) lines.push(`Follow-up date: ${entry.followUpDate}`);
    lines.push(`Status: ${titleCase(entry.status)}`);
    lines.push("");
  });

  return lines.join("\n").trim();
};
