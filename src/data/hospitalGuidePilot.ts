export type HospitalGuidePilotId =
  | "copd_recovery"
  | "heart_failure"
  | "blood_thinners"
  | "home_oxygen"
  | "first_72_hours";

export type HospitalGuideActionLevel = {
  label: string;
  description: string;
};

export type HospitalGuidePilotPreview = {
  id: HospitalGuidePilotId;
  title: string;
  shortTitle: string;
  audience: string;
  status: "Clinical review candidate" | "Evidence development";
  riskTier: "High" | "Critical";
  purpose: string;
  primaryAction: string;
  patientSees: string[];
  caregiverSees: string[];
  nurseUses: string[];
  customizable: string[];
  quickChecklist: string[];
  teachBack: string[];
  actionLevels: HospitalGuideActionLevel[];
  sourceLabels: string[];
  reviewNote: string;
};

export const hospitalGuidePilotPreviews: HospitalGuidePilotPreview[] = [
  {
    id: "copd_recovery",
    title: "COPD Exacerbation and Recovery at Home",
    shortTitle: "COPD recovery",
    audience: "Adults leaving acute or observation care after a COPD flare and the caregivers supporting them.",
    status: "Evidence development",
    riskTier: "Critical",
    purpose: "Connect rescue and maintenance inhalers, nebulizer continuity, short-course medicines, oxygen or positive-airway-pressure context, recovery activity, warning levels, and access barriers.",
    primaryAction: "Match every inhaler, medicine, device, oxygen instruction, and follow-up step to the final written plan before leaving.",
    patientSees: ["Rescue versus maintenance medicine", "Exact-device show-me prompt", "Steroid and antibiotic stop-date fields", "Recovery, pulmonary rehabilitation, and follow-up prompts"],
    caregiverSees: ["Device and supply check", "Changes in breathing, alertness, sleep, and activity to notice", "Power, backup, transport, and after-hours contacts"],
    nurseUses: ["Final medication and device reconciliation", "Inhaler, spacer, and nebulizer show-me", "Access and referral readiness check", "Four-level escalation teach-back"],
    customizable: ["Exact medicines and devices", "Oxygen or PAP settings", "Individual symptom thresholds", "Local respiratory, pharmacy, and after-hours routes"],
    quickChecklist: ["Label rescue and maintenance devices", "Confirm exact next doses and stop dates", "Demonstrate every prescribed device", "Confirm medicine, supply, power, and follow-up ownership"],
    teachBack: ["Explain the rescue and maintenance plan", "Show the exact inhaler, spacer, or nebulizer technique", "State who to call when the plan is not working"],
    actionLevels: [
      { label: "Routine self-management", description: "Use each medicine and device exactly as written and follow the recovery plan." },
      { label: "Contact the care team", description: "Breathing or activity is moving away from the usual pattern, or a medicine, device, or appointment is unavailable." },
      { label: "Seek urgent evaluation", description: "Breathing keeps worsening despite the written plan or the responsible team cannot be reached." },
      { label: "Call 911 / emergency services", description: "Severe trouble breathing, fainting, blue or gray lips or face, severe chest pressure, or the individualized emergency signs." },
    ],
    sourceLabels: ["GOLD 2026", "National Heart, Lung, and Blood Institute", "MedlinePlus"],
    reviewNote: "Requires pulmonology, respiratory therapy, pharmacy, RN, health-literacy, accessibility, and patient/caregiver review. No universal oxygen or symptom threshold is supplied.",
  },
  {
    id: "heart_failure",
    title: "Heart Failure Discharge and Daily Management",
    shortTitle: "Heart failure",
    audience: "Adults leaving care with heart failure and the caregivers supporting daily management.",
    status: "Evidence development",
    riskTier: "Critical",
    purpose: "Coordinate daily weights and symptoms, medication categories, individualized sodium and fluid instructions, follow-up ownership, action zones, and access continuity.",
    primaryAction: "Know what changed, what to track each day, and which team is responsible for adjusting the plan.",
    patientSees: ["Consistent morning weight routine", "Plain-language medicine purposes", "Individual sodium and fluid fields", "Appointment, laboratory, and refill ownership"],
    caregiverSees: ["Breathing, swelling, sleep, confusion, appetite, and activity changes", "Medication and laboratory continuity", "Individual action threshold and contact routes"],
    nurseUses: ["Medication change reconciliation", "Weight and symptom teach-back", "Diet and fluid personalization check", "Follow-up and access failure check"],
    customizable: ["Weight and symptom thresholds", "Blood-pressure and pulse plan", "Sodium and fluid instructions", "Laboratory, pharmacy, and after-hours workflow"],
    quickChecklist: ["Use the same weight routine each morning", "Track only what the care team requested", "Do not self-adjust a diuretic", "Confirm medicines, labs, transport, and follow-up"],
    teachBack: ["Show the weight routine and individualized report threshold", "Explain the purpose and next dose of each medicine", "Explain when to call, seek urgent evaluation, or call emergency services"],
    actionLevels: [
      { label: "Routine self-management", description: "Use the daily weight, symptom, medicine, diet, fluid, and activity plan written by the care team." },
      { label: "Contact the care team", description: "A personalized threshold is crossed, symptoms change, or medicine, monitoring, or follow-up is unavailable." },
      { label: "Seek urgent evaluation", description: "Breathing or function is worsening, new confusion appears, or the team cannot manage the change by phone." },
      { label: "Call 911 / emergency services", description: "Severe trouble breathing, fainting, severe or persistent chest pressure, new stroke signs, or the individualized emergency signs." },
    ],
    sourceLabels: ["2022 AHA/ACC/HFSA heart-failure guideline", "American Heart Association"],
    reviewNote: "Requires heart-failure, pharmacy, dietitian, RN, health-literacy, accessibility, and patient/caregiver review. Weight, blood-pressure, pulse, sodium, and fluid thresholds stay blank until individualized.",
  },
  {
    id: "blood_thinners",
    title: "Blood Thinner Safety",
    shortTitle: "Blood thinners",
    audience: "Adults leaving care with an anticoagulant or antiplatelet medicine and their caregivers.",
    status: "Clinical review candidate",
    riskTier: "Critical",
    purpose: "Pair one safety core with the medication card that matches the exact bottle, package, or syringe—without a dangerous generic missed-dose rule.",
    primaryAction: "Use only the medicine card that matches the exact prescription label, strength, schedule, and product.",
    patientSees: ["Anticoagulant versus antiplatelet explanation", "Medicine-specific card architecture", "Bleeding, fall, procedure, and interaction prompts", "Wallet-card and refill-continuity concept"],
    caregiverSees: ["Exact medicine and next-dose match", "Bleeding and injury response plan", "Monitoring, refill, procedure, and after-hours ownership"],
    nurseUses: ["Exact product and regimen reconciliation", "Medication-specific missed-dose teach-back", "Injection show-back when applicable", "Access and procedure handoff"],
    customizable: ["Exact medication card", "Approved injury and bleeding action level", "Procedure contact workflow", "Monitoring, pharmacy, and after-hours routes"],
    quickChecklist: ["Match the card to the exact product", "Know the next dose and responsible team", "Do not stop, restart, double, or change it on your own", "Check before new medicines, supplements, dental work, or procedures"],
    teachBack: ["Point to the exact medicine, strength, next dose, and reason", "Use the matching card to explain a missed dose", "Explain the approved bleeding, fall, and procedure plan"],
    actionLevels: [
      { label: "Routine self-management", description: "Take only the exact written plan and keep monitoring, refill, and procedure contacts current." },
      { label: "Contact the care team", description: "A dose is late or missed, instructions conflict, or the medicine is unavailable, unaffordable, or denied." },
      { label: "Seek urgent evaluation", description: "Follow the approved urgent plan after a fall, injury, hit to the head, or concerning bleeding." },
      { label: "Call 911 / emergency services", description: "Uncontrolled major bleeding, fainting, sudden severe headache or weakness, vomiting or coughing blood, or the approved emergency signs." },
    ],
    sourceLabels: ["Current DailyMed product labeling", "AHRQ Blood Thinner Pills guide", "FDA sharps guidance"],
    reviewNote: "A private v0.3-RC1 review candidate includes six medication cards and a claim register. It remains blocked pending qualified review, exact product binding, local emergency decisions, accessibility evaluation, and user testing.",
  },
  {
    id: "home_oxygen",
    title: "New Home Oxygen and Nebulizer Use",
    shortTitle: "Home oxygen",
    audience: "Adults leaving care with new or changed oxygen, a nebulizer, or both, and their caregivers.",
    status: "Evidence development",
    riskTier: "Critical",
    purpose: "Clarify the prescribed setting, exact equipment, fire and trip safety, power and travel planning, nebulizer cleaning, supplier support, and escalation.",
    primaryAction: "Know the exact equipment, prescribed setting, supplier, backup plan, and safety rules before the first night at home.",
    patientSees: ["Equipment identity and prescribed-setting fields", "Fire, smoking, skin, nose, and tubing safety", "Power, travel, and backup checklist", "Nebulizer setup, cleaning, and supply plan"],
    caregiverSees: ["Alarm and backup show-me", "Home fire and trip-hazard check", "Delivery, maintenance, battery, tank, refill, and after-hours ownership"],
    nurseUses: ["Order-to-equipment reconciliation", "Oxygen and nebulizer show-me", "DME delivery and mobility check", "Power-failure and emergency teach-back"],
    customizable: ["Exact device, mode, flow, and schedule", "Individual saturation and symptom plan", "Supplier and maintenance contacts", "Power, travel, fire, and after-hours workflow"],
    quickChecklist: ["Use only the prescribed device, setting, mode, and schedule", "Keep oxygen away from smoking, flames, sparks, heat, and trip hazards", "Practice backup and power-failure steps", "Clean the exact nebulizer as instructed"],
    teachBack: ["Point to the exact setting, mode, device, and schedule", "Show the backup and alarm sequence", "Show nebulizer setup, cleaning, drying, and storage"],
    actionLevels: [
      { label: "Routine self-management", description: "Use and maintain equipment exactly as prescribed and taught." },
      { label: "Contact the care team", description: "Equipment, supplies, readings, skin comfort, delivery, or mobility support does not match the plan." },
      { label: "Seek urgent evaluation", description: "Breathing or alertness worsens, the plan is not working, or oxygen cannot be delivered and the team is unreachable." },
      { label: "Call 911 / emergency services", description: "Severe trouble breathing, fainting, blue or gray lips or face, severe chest pressure, fire, or the individualized emergency signs." },
    ],
    sourceLabels: ["American Thoracic Society home-oxygen guideline", "Medicare.gov oxygen coverage", "MedlinePlus nebulizer instructions"],
    reviewNote: "Requires pulmonology, respiratory therapy, DME, fire-safety, pharmacy, RN, accessibility, and user review. The exact device instructions and individualized oxygen order control.",
  },
  {
    id: "first_72_hours",
    title: "Safe Hospital Discharge and the First 72 Hours at Home",
    shortTitle: "First 72 hours",
    audience: "Adults leaving acute or observation care, caregivers, and the clinicians coordinating the transition.",
    status: "Evidence development",
    riskTier: "High",
    purpose: "Make the first night and next three days workable across medicines, pending results, appointments, mobility, equipment, food, electricity, services, caregivers, insurance, and warning signs.",
    primaryAction: "Before leaving, make sure the plan works in the real home—not only on paper—and give every unresolved item an owner.",
    patientSees: ["New, changed, continued, and stopped medication check", "First-night, 24-hour, and 72-hour checklists", "Appointments and pending-result ownership", "Home health, rehabilitation, skilled-care, and custodial-care distinctions"],
    caregiverSees: ["Home-entry, mobility, food, electricity, equipment, and task-capacity check", "Medication and appointment handoff", "Backup plan when caregiving or services fail"],
    nurseUses: ["Final-document reconciliation", "Medication, equipment, destination, and caregiver readiness", "Pending-result and follow-up handoff", "No-shame teach-back and unresolved-barrier escalation"],
    customizable: ["Diagnosis and restrictions", "Final medication plan", "Appointments and pending-result owners", "Local service, payer, pharmacy, supplier, and after-hours routes"],
    quickChecklist: ["Resolve conflicting final documents", "Confirm next doses and pharmacy access", "Make sure the home and caregiver plan works tonight", "Write every appointment, pending result, owner, contact, and backup deadline"],
    teachBack: ["Explain what changed and the first three priorities at home", "Show the final medication list and next doses", "State appointments, pending results, warning levels, and unresolved barriers"],
    actionLevels: [
      { label: "Routine self-management", description: "Follow the final plan and complete the first-night, 24-hour, and 72-hour checks." },
      { label: "Contact the care team", description: "A medicine, result, appointment, service, ride, food, electricity, caregiver, or safe home task is missing or instructions conflict." },
      { label: "Seek urgent evaluation", description: "A concerning change is worsening and the responsible team cannot safely manage it by phone." },
      { label: "Call 911 / emergency services", description: "Severe trouble breathing, severe chest pressure, new stroke signs, fainting, uncontrolled bleeding, severe allergic reaction, or the individualized emergency signs." },
    ],
    sourceLabels: ["AHRQ IDEAL Discharge Planning", "AHRQ Re-Engineered Discharge", "Medicare.gov home health and skilled nursing"],
    reviewNote: "Requires transitions-of-care, pharmacy, case management, therapy, RN, health-literacy, accessibility, and user review. Local medication, pending-result, post-acute, appeal, and after-hours workflows control.",
  },
];

