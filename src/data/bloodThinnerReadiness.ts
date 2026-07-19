export type BloodThinnerMedicationId =
  | "apixaban"
  | "rivaroxaban"
  | "dabigatran"
  | "edoxaban"
  | "warfarin"
  | "enoxaparin";

export type MedicationBranch = {
  id: BloodThinnerMedicationId;
  name: string;
  form: string;
  sourceId: string;
  sourceLabel: string;
  sourceUrl: string;
  claimIds: string[];
  howToTake: string[];
  missedDose: string[];
  monitoring: string[];
};

const publicPreviewInstructions = {
  howToTake: [
    "This public demonstration verifies that the exact medicine branch is selected before education begins.",
    "Medication-specific administration instructions remain in the controlled private package and require qualified review and hospital approval before use.",
  ],
  missedDose: [
    "Exact missed-dose instructions are intentionally withheld from the public demonstration.",
    "A licensed pilot must bind the selected medicine and regimen to the hospital-approved medication card before discharge teaching.",
  ],
  monitoring: [
    "The hospital must localize monitoring, refills, procedures, daytime questions, and after-hours ownership before release.",
  ],
} as const;

export const bloodThinnerMedications: MedicationBranch[] = [
  {
    id: "apixaban",
    name: "Apixaban",
    form: "tablet",
    sourceId: "SRC-APL-001",
    sourceLabel: "Current DailyMed apixaban labeling, version 38",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a454cd24-0c6d-46e8-b1e4-197388606175&version=38",
    claimIds: ["BT-APL-001", "BT-APL-002", "BT-APL-003"],
    howToTake: [...publicPreviewInstructions.howToTake],
    missedDose: [...publicPreviewInstructions.missedDose],
    monitoring: [...publicPreviewInstructions.monitoring],
  },
  {
    id: "rivaroxaban",
    name: "Rivaroxaban",
    form: "tablet",
    sourceId: "SRC-RIV-001",
    sourceLabel: "Current DailyMed rivaroxaban labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=10db92f9-2300-4a80-836b-673e1ae91610",
    claimIds: ["BT-RIV-001", "BT-RIV-002", "BT-RIV-003", "BT-RIV-004"],
    howToTake: [...publicPreviewInstructions.howToTake],
    missedDose: [
      "The public workflow demonstrates that rivaroxaban requires an exact regimen branch before readiness can be assessed.",
      "The corresponding regimen-specific instruction remains withheld in the controlled private package.",
    ],
    monitoring: [...publicPreviewInstructions.monitoring],
  },
  {
    id: "dabigatran",
    name: "Dabigatran capsules",
    form: "capsule",
    sourceId: "SRC-DAB-001",
    sourceLabel: "Current DailyMed dabigatran capsule Medication Guide",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/medguide.cfm?setid=ba74e3cd-b06f-4145-b284-5fd6b84ff3c9",
    claimIds: ["BT-DAB-001", "BT-DAB-002", "BT-DAB-003"],
    howToTake: [...publicPreviewInstructions.howToTake],
    missedDose: [...publicPreviewInstructions.missedDose],
    monitoring: [...publicPreviewInstructions.monitoring],
  },
  {
    id: "edoxaban",
    name: "Edoxaban",
    form: "tablet",
    sourceId: "SRC-EDO-001",
    sourceLabel: "Current DailyMed edoxaban labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e77d3400-56ad-11e3-949a-0800200c9a66",
    claimIds: ["BT-EDO-001", "BT-EDO-002"],
    howToTake: [...publicPreviewInstructions.howToTake],
    missedDose: [...publicPreviewInstructions.missedDose],
    monitoring: [...publicPreviewInstructions.monitoring],
  },
  {
    id: "warfarin",
    name: "Warfarin",
    form: "tablet",
    sourceId: "SRC-WAR-001",
    sourceLabel: "Current DailyMed warfarin labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=558b7a0d-5490-4c1b-802e-3ab3f1efe760",
    claimIds: ["BT-WAR-001", "BT-WAR-002", "BT-WAR-003"],
    howToTake: [...publicPreviewInstructions.howToTake],
    missedDose: [...publicPreviewInstructions.missedDose],
    monitoring: [
      "The controlled package requires the hospital to localize the current written dose plan, monitoring owner, next monitoring event, and after-hours route.",
    ],
  },
  {
    id: "enoxaparin",
    name: "Enoxaparin prefilled syringe",
    form: "prefilled syringe",
    sourceId: "SRC-ENO-001",
    sourceLabel: "Current DailyMed enoxaparin labeling, version 31",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=5017a927-2a24-4f27-89f9-27c805bf7d59&version=31",
    claimIds: ["BT-ENO-001", "BT-ENO-002", "BT-ENO-003", "BT-ENO-004"],
    howToTake: [
      "The public demonstration shows that an injection-capable branch requires a separate show-me competency workflow.",
      "Exact technique and sharps instructions remain in the controlled private package pending qualified review and hospital approval.",
    ],
    missedDose: [...publicPreviewInstructions.missedDose],
    monitoring: [
      "A licensed pilot must require the patient or caregiver to demonstrate the hospital-approved injection and disposal sequence before readiness is marked demonstrated.",
    ],
  },
];

export type RivaroxabanRegimenId = "twice_daily_2_5" | "twice_daily_15" | "once_daily_10_15_20";

export const rivaroxabanRegimens: Record<RivaroxabanRegimenId, { label: string; instruction: string }> = {
  twice_daily_2_5: {
    label: "2.5 mg twice daily",
    instruction: "The exact regimen-specific instruction is withheld from this public demonstration and remains release-blocked in the controlled private package.",
  },
  twice_daily_15: {
    label: "15 mg twice daily during the initial treatment period",
    instruction: "The exact regimen-specific instruction is withheld from this public demonstration and remains release-blocked in the controlled private package.",
  },
  once_daily_10_15_20: {
    label: "10 mg, 15 mg, or 20 mg once daily",
    instruction: "The exact regimen-specific instruction is withheld from this public demonstration and remains release-blocked in the controlled private package.",
  },
};

export const sharedBloodThinnerSafety = [
  "Match the exact medicine and regimen to the final medication list before teaching begins.",
  "Use only the hospital-approved medication card, action plan, and contact routes supplied for the licensed package.",
  "Stop the workflow when instructions conflict, required local fields are missing, or the exact medicine cannot be confirmed.",
  "This public demonstration does not provide patient-use instructions, medical advice, emergency guidance, or authorization to discharge.",
] as const;

export type BarrierId = "medicine_in_hand" | "cost_coverage" | "transport" | "language_access" | "caregiver_support" | "follow_up";

export const dischargeBarriers: Record<BarrierId, { label: string; owner: string; response: string }> = {
  medicine_in_hand: { label: "Medicine or supplies are not in hand", owner: "Nurse + pharmacy", response: "Confirm availability and assign an accountable owner and safe backup before the handoff can proceed." },
  cost_coverage: { label: "Cost, coverage, or authorization problem", owner: "Pharmacy + case management", response: "Escalate the access barrier and document an organization-approved safe plan." },
  transport: { label: "No reliable way to reach pharmacy, lab, or follow-up", owner: "Case management", response: "Arrange an approved option and name who will confirm it." },
  language_access: { label: "Interpreter or accessible format is still needed", owner: "Nurse + language/accessibility services", response: "Provide the required service or format, then repeat the readiness check." },
  caregiver_support: { label: "Patient cannot safely manage the plan alone", owner: "Nurse + case management", response: "Confirm trained support or escalate the discharge plan through the organization’s approved process." },
  follow_up: { label: "Follow-up, monitoring, or after-hours owner is unclear", owner: "Discharging team", response: "Name the responsible service, contact route, timing, and backup." },
};

export const teachBackTasks = [
  { id: "medicine_match", label: "Point to the exact medicine, strength, reason, schedule, and next dose on the final list." },
  { id: "missed_dose", label: "Use the matching hospital-approved medicine card to locate the medication-specific instruction." },
  { id: "bleeding_injury", label: "Locate and explain the organization-approved urgent-action and emergency plan." },
  { id: "continuity", label: "Explain who owns refills, monitoring, procedures, follow-up, and after-hours questions." },
] as const;

export type TeachBackTaskId = (typeof teachBackTasks)[number]["id"];

export const bloodThinnerProof = {
  candidateId: "CAF-PE-ANTICOAG-ADULT-EN-PACKAGE-001-V1.0-RC1",
  version: "1.0-RC1",
  lastEvidenceReview: "2026-07-18",
  sourceBundleSha256: "c04c961344f82a4359f1b149836b34a302e459300f02e263fe4358a8096d3248",
  sourceBundleDistribution: "private_controlled",
  releaseStatus: "clinical_review_required",
  patientUseStatus: "NOT APPROVED FOR PATIENT USE",
  generalClaimIds: ["BT-COM-001", "BT-COM-002", "BT-COM-003", "BT-COM-004", "BT-COM-005", "BT-COM-006", "BT-COM-007"],
  openDecisionIds: Array.from({ length: 12 }, (_, index) => `BT-DEC-${String(index + 1).padStart(3, "0")}`),
} as const;
