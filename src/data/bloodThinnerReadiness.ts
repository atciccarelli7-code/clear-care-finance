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

export const bloodThinnerMedications: MedicationBranch[] = [
  {
    id: "apixaban",
    name: "Apixaban",
    form: "tablet",
    sourceId: "SRC-APL-001",
    sourceLabel: "Current DailyMed apixaban labeling, version 38",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a454cd24-0c6d-46e8-b1e4-197388606175&version=38",
    claimIds: ["BT-APL-001", "BT-APL-002", "BT-APL-003"],
    howToTake: ["Take it exactly as written on the final medication list.", "Do not stop it without talking with the prescribing team."],
    missedDose: ["Take a missed dose as soon as possible on the same day.", "Resume the usual twice-daily schedule. Do not double the dose."],
    monitoring: ["Know who to call about bleeding, injury, procedures, refills, or conflicting instructions."],
  },
  {
    id: "rivaroxaban",
    name: "Rivaroxaban",
    form: "tablet",
    sourceId: "SRC-RIV-001",
    sourceLabel: "Current DailyMed rivaroxaban labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=10db92f9-2300-4a80-836b-673e1ae91610",
    claimIds: ["BT-RIV-001", "BT-RIV-002", "BT-RIV-003", "BT-RIV-004"],
    howToTake: ["The strength and schedule determine the food and missed-dose instructions.", "The 15 mg and 20 mg tablets are taken with food. The 2.5 mg and 10 mg tablets may be taken with or without food."],
    missedDose: ["Choose the exact prescribed regimen below. The branches are not interchangeable."],
    monitoring: ["Do not stop it without talking with the prescribing team."],
  },
  {
    id: "dabigatran",
    name: "Dabigatran capsules",
    form: "capsule",
    sourceId: "SRC-DAB-001",
    sourceLabel: "Current DailyMed dabigatran capsule Medication Guide",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/medguide.cfm?setid=ba74e3cd-b06f-4145-b284-5fd6b84ff3c9",
    claimIds: ["BT-DAB-001", "BT-DAB-002", "BT-DAB-003"],
    howToTake: ["Swallow the capsule whole. Do not break, chew, or empty the pellets from the capsule.", "Keep it in the original bottle or blister package according to the product instructions."],
    missedDose: ["Take a missed dose as soon as you remember if the next dose is more than 6 hours away.", "Skip it if the next dose is less than 6 hours away. Do not take two doses at the same time."],
    monitoring: ["Confirm that the product-specific storage instructions were reviewed before discharge."],
  },
  {
    id: "edoxaban",
    name: "Edoxaban",
    form: "tablet",
    sourceId: "SRC-EDO-001",
    sourceLabel: "Current DailyMed edoxaban labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e77d3400-56ad-11e3-949a-0800200c9a66",
    claimIds: ["BT-EDO-001", "BT-EDO-002"],
    howToTake: ["Take it once daily exactly as written, with or without food.", "Do not stop it without talking with the prescribing team."],
    missedDose: ["Take the missed dose as soon as possible on the same day.", "Resume the usual schedule the next day. Do not double the dose."],
    monitoring: ["Know who owns refills, procedure questions, and after-hours concerns."],
  },
  {
    id: "warfarin",
    name: "Warfarin",
    form: "tablet",
    sourceId: "SRC-WAR-001",
    sourceLabel: "Current DailyMed warfarin labeling",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=558b7a0d-5490-4c1b-802e-3ab3f1efe760",
    claimIds: ["BT-WAR-001", "BT-WAR-002", "BT-WAR-003"],
    howToTake: ["Use only the latest written dose plan from the team managing warfarin.", "The dose is individualized using INR results. Do not copy another person's schedule."],
    missedDose: ["Take the missed dose as soon as possible on the same day.", "Do not take a double dose the next day. Contact the warfarin team when the written plan says to do so."],
    monitoring: ["Confirm the next INR, the team that receives the result, and the current written dose plan."],
  },
  {
    id: "enoxaparin",
    name: "Enoxaparin prefilled syringe",
    form: "prefilled syringe",
    sourceId: "SRC-ENO-001",
    sourceLabel: "Current DailyMed enoxaparin labeling, version 31",
    sourceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=5017a927-2a24-4f27-89f9-27c805bf7d59&version=31",
    claimIds: ["BT-ENO-001", "BT-ENO-002", "BT-ENO-003", "BT-ENO-004"],
    howToTake: ["Use the exact prefilled syringe and injection plan provided by the care team.", "Do not expel the air bubble before injecting. Do not inject through clothing or rub the site afterward.", "Activate the safety mechanism and place the used syringe directly into an appropriate sharps container."],
    missedDose: ["This review candidate does not provide a generic missed-dose rule for enoxaparin.", "Use the organization-approved, prescription-specific instruction or contact the responsible clinician or pharmacist."],
    monitoring: ["The patient or caregiver must show the complete injection and sharps-disposal sequence before discharge."],
  },
];

export type RivaroxabanRegimenId = "twice_daily_2_5" | "twice_daily_15" | "once_daily_10_15_20";

export const rivaroxabanRegimens: Record<RivaroxabanRegimenId, { label: string; instruction: string }> = {
  twice_daily_2_5: {
    label: "2.5 mg twice daily",
    instruction: "Skip the missed 2.5 mg dose and take the next 2.5 mg dose at the usual time.",
  },
  twice_daily_15: {
    label: "15 mg twice daily during the initial treatment period",
    instruction: "Take it as soon as possible on the same day. Two 15 mg tablets may be taken together to make sure two tablets are taken that day, then continue the usual schedule.",
  },
  once_daily_10_15_20: {
    label: "10 mg, 15 mg, or 20 mg once daily",
    instruction: "Take the missed dose as soon as possible on the same day. Do not take more than one dose in one day; resume the usual schedule the next day.",
  },
};

export const sharedBloodThinnerSafety = [
  "Use the exact medicine, strength, schedule, reason, and next dose on the final medication list.",
  "Do not stop, restart, double, or change the medicine unless the responsible clinician gives a new plan.",
  "Check before starting over-the-counter medicines, vitamins, supplements, dental work, surgery, or another procedure.",
  "Use the organization's approved plan after a fall, head injury, or bleeding concern. Call emergency services for uncontrolled major bleeding, fainting, sudden severe headache or weakness, or vomiting or coughing blood.",
] as const;

export type BarrierId = "medicine_in_hand" | "cost_coverage" | "transport" | "language_access" | "caregiver_support" | "follow_up";

export const dischargeBarriers: Record<BarrierId, { label: string; owner: string; response: string }> = {
  medicine_in_hand: { label: "Medicine or supplies are not in hand", owner: "Nurse + pharmacy", response: "Confirm dispensing, availability, first dose, and a safe backup before discharge." },
  cost_coverage: { label: "Cost, coverage, or authorization problem", owner: "Pharmacy + case management", response: "Escalate affordability or authorization and document the safe interim plan." },
  transport: { label: "No reliable way to reach pharmacy, lab, or follow-up", owner: "Case management", response: "Arrange transport or an approved alternative and name who will confirm it." },
  language_access: { label: "Interpreter or accessible format is still needed", owner: "Nurse + language/accessibility services", response: "Provide qualified interpretation or the required accessible format, then repeat teach-back." },
  caregiver_support: { label: "Patient cannot safely manage the plan alone", owner: "Nurse + case management", response: "Confirm a trained caregiver or escalate the discharge destination and support plan." },
  follow_up: { label: "Follow-up, monitoring, or after-hours owner is unclear", owner: "Discharging team", response: "Name the responsible service, contact route, timing, and backup." },
};

export const teachBackTasks = [
  { id: "medicine_match", label: "Point to the exact medicine, strength, reason, schedule, and next dose on the final list." },
  { id: "missed_dose", label: "Use the matching medicine card to explain what to do if a dose is missed." },
  { id: "bleeding_injury", label: "Explain the approved bleeding, fall, head-injury, and emergency plan." },
  { id: "continuity", label: "Explain who owns refills, monitoring, procedures, follow-up, and after-hours questions." },
] as const;

export type TeachBackTaskId = (typeof teachBackTasks)[number]["id"];

export const bloodThinnerProof = {
  candidateId: "CAF-PE-ANTICOAG-ADULT-EN-PACKAGE-001-V0.3-RC1",
  version: "0.3-RC1",
  lastEvidenceReview: "2026-07-18",
  releaseStatus: "clinical_review_required",
  patientUseStatus: "NOT APPROVED FOR PATIENT USE",
  generalClaimIds: ["BT-COM-001", "BT-COM-002", "BT-COM-003", "BT-COM-004", "BT-COM-005", "BT-COM-006", "BT-COM-007"],
  openDecisionIds: Array.from({ length: 12 }, (_, index) => `BT-DEC-${String(index + 1).padStart(3, "0")}`),
} as const;
