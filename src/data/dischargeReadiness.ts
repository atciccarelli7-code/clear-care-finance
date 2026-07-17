export type DischargeBarrierCategoryId =
  | "coordination_logistics"
  | "coverage_authorization"
  | "equipment_medications"
  | "education_decisions"
  | "caregiver_home_safety"
  | "placement_capacity";

export type DischargeBarrier = {
  id: string;
  categoryId: DischargeBarrierCategoryId;
  title: string;
  whyItMatters: string;
  question: string;
  teams: string[];
};

export type FamilyQuestionGroup = {
  id: string;
  title: string;
  description: string;
  questions: string[];
};

export type CareTeamResponsibility = {
  id: string;
  role: string;
  usuallyHandles: string;
  importantLimit: string;
};

export const DISCHARGE_BARRIER_CATEGORIES = [
  {
    id: "coordination_logistics",
    title: "Coordination and logistics",
    description: "Transportation, timing, housing, and other practical arrangements can remain unresolved after the medical plan is ready.",
  },
  {
    id: "coverage_authorization",
    title: "Coverage and authorization",
    description: "A recommendation from the care team does not automatically mean the payer has approved the next level of care.",
  },
  {
    id: "equipment_medications",
    title: "Equipment and medication access",
    description: "A safe plan may depend on complete orders, an accepting supplier or pharmacy, delivery timing, and an affordable patient cost.",
  },
  {
    id: "education_decisions",
    title: "Teaching and decisions",
    description: "Patients and caregivers need a usable written plan and enough information to make time-sensitive decisions about the next setting.",
  },
  {
    id: "caregiver_home_safety",
    title: "Caregiver support and home safety",
    description: "A patient can be medically ready to leave while the proposed home plan is still unrealistic or unsafe.",
  },
  {
    id: "placement_capacity",
    title: "Facility and service availability",
    description: "Facilities and agencies make their own acceptance decisions based on capacity, network, clinical needs, documentation, and available staffing.",
  },
] as const;

export const DISCHARGE_READINESS_BARRIERS: DischargeBarrier[] = [
  {
    id: "transport_not_confirmed",
    categoryId: "coordination_logistics",
    title: "Transportation is not confirmed",
    whyItMatters: "A ride, wheelchair van, stretcher transport, ambulance, or receiving-party handoff may require separate scheduling and cost verification.",
    question: "Who is providing transportation, at what time, and has the receiving destination confirmed that arrival window?",
    teams: ["Case management", "Nursing", "Transport provider", "Patient or caregiver"],
  },
  {
    id: "shelter_or_housing_unavailable",
    categoryId: "coordination_logistics",
    title: "The proposed shelter or housing option is unavailable",
    whyItMatters: "Shelter hours, eligibility, bed availability, transportation, and medical needs can make a same-day placement impossible.",
    question: "Which housing options have been contacted, what requirement is blocking acceptance, and what is the safest backup plan?",
    teams: ["Social work", "Case management", "Community agencies", "Patient"],
  },
  {
    id: "authorization_pending",
    categoryId: "coverage_authorization",
    title: "Insurance authorization is still pending",
    whyItMatters: "Rehabilitation, skilled nursing, home services, equipment, or transportation may require payer review before the receiving organization can proceed.",
    question: "What service is awaiting authorization, when was the complete request submitted, and who is following up today?",
    teams: ["Case management", "Provider team", "Payer", "Receiving organization"],
  },
  {
    id: "dme_order_incomplete",
    categoryId: "equipment_medications",
    title: "The equipment order is incomplete or does not match the need",
    whyItMatters: "A supplier may need a complete order, qualifying documentation, measurements, oxygen details, accessories, delivery location, and coverage information.",
    question: "Exactly which equipment and accessories are required, who accepted the order, and when will everything be delivered?",
    teams: ["Provider team", "Therapy", "Case management", "DME supplier"],
  },
  {
    id: "medication_unaffordable",
    categoryId: "equipment_medications",
    title: "A discharge medication is unaffordable or unavailable",
    whyItMatters: "The written medication plan is not usable when the pharmacy cannot fill it, the cost is too high, or the patient does not understand what changed.",
    question: "Has the prescription been priced and confirmed in stock, and what covered alternative or assistance path is available if cost is a barrier?",
    teams: ["Prescriber", "Pharmacist", "Case management", "Payer", "Patient"],
  },
  {
    id: "teaching_not_completed",
    categoryId: "education_decisions",
    title: "Patient or caregiver teaching is not complete",
    whyItMatters: "Medication changes, wound care, equipment, mobility precautions, symptom monitoring, and follow-up instructions may require demonstration and teach-back.",
    question: "What must the patient or caregiver be able to explain or demonstrate before leaving, and who will complete that teaching?",
    teams: ["Nursing", "Therapy", "Pharmacy", "Provider team", "Patient or caregiver"],
  },
  {
    id: "rehab_decision_pending",
    categoryId: "education_decisions",
    title: "The patient has not decided whether to accept rehabilitation",
    whyItMatters: "Placement searches, authorization, transportation, and backup planning can stall while the patient weighs benefits, risks, cost, and preferences.",
    question: "What level of care is being recommended, why, what alternatives exist, and what decision deadline affects the available options?",
    teams: ["Patient or surrogate", "Provider team", "Therapy", "Case management"],
  },
  {
    id: "caregiver_unavailable",
    categoryId: "caregiver_home_safety",
    title: "The expected caregiver is unavailable or cannot provide the required help",
    whyItMatters: "The plan may assume help with transfers, medications, meals, supervision, equipment, transportation, or appointments that is not actually available.",
    question: "What exact tasks and hours of support does the plan assume, and has the caregiver agreed that those expectations are realistic?",
    teams: ["Patient and caregiver", "Nursing", "Therapy", "Case management"],
  },
  {
    id: "unsafe_without_covered_services",
    categoryId: "caregiver_home_safety",
    title: "The patient does not qualify for the requested service but may not be safe alone",
    whyItMatters: "Clinical need, service eligibility, insurance coverage, and the amount of daily help required are different questions. A coverage denial does not solve the safety problem.",
    question: "Which need is not covered, what safety risk remains, and what family, community, private-pay, appeal, or alternative-care options are being considered?",
    teams: ["Provider team", "Therapy", "Case management", "Payer", "Patient or caregiver"],
  },
  {
    id: "no_accepting_facility",
    categoryId: "placement_capacity",
    title: "No facility or agency has accepted the referral",
    whyItMatters: "A referral can be declined because of bed or staffing capacity, network status, care complexity, medication cost, equipment needs, documentation, geography, or other admission criteria.",
    question: "Which organizations were contacted, why did each decline or remain pending, and how is the search or backup plan changing?",
    teams: ["Case management", "Receiving facilities or agencies", "Payer", "Provider team"],
  },
];

export const FAMILY_HOSPITAL_QUESTION_GROUPS: FamilyQuestionGroup[] = [
  {
    id: "understand_the_stay",
    title: "Understand the hospitalization",
    description: "Start with the reason for admission, the current plan, and the most important next relationship.",
    questions: [
      "What led to this hospitalization, and what problem is the team treating now?",
      "What is the current care plan, and what needs to improve or be completed next?",
      "Which follow-up clinician or appointment is the highest priority after discharge?",
    ],
  },
  {
    id: "medications_and_tests",
    title: "Clarify medications and tests",
    description: "Separate what is new or temporary from what must continue after discharge.",
    questions: [
      "Which medications are new, stopped, changed, or temporary, and why?",
      "Which laboratory tests or scans have been completed, what were the key findings, and which should be repeated?",
    ],
  },
  {
    id: "interdisciplinary_discharge",
    title: "Prepare with the full care team",
    description: "Discharge planning depends on more than one conversation with one discipline.",
    questions: [
      "Can we review discharge needs with the interdisciplinary team, including nursing, the provider team, therapy, pharmacy, and case management as applicable?",
      "Are physical therapy and occupational therapy ordered, and should either evaluate current function before the destination is finalized?",
    ],
  },
  {
    id: "communication_access",
    title: "Create a communication plan",
    description: "Agree on how the family will receive updates without assuming every discipline rounds at the same time.",
    questions: [
      "How can I make sure I am updated when the plan changes?",
      "Is there a patient portal or other secure way to review results, notes, appointments, and discharge instructions?",
      "What time does the primary medical team usually round, and when is the best time to be available?",
      "Who should call me with major updates after today, and is my contact information and permission to discuss care documented correctly?",
    ],
  },
  {
    id: "support_recovery",
    title: "Support recovery",
    description: "Ask for specific actions the patient can safely take rather than a vague instruction to do more.",
    questions: [
      "What can the patient safely do independently today to support mobility, breathing, nutrition, sleep, learning, or recovery?",
    ],
  },
];

export const CARE_TEAM_RESPONSIBILITY_MAP: CareTeamResponsibility[] = [
  {
    id: "bedside_nurse",
    role: "Bedside nurse",
    usuallyHandles: "Ongoing assessment, medication administration, bedside teaching, symptom escalation, care coordination, and translating the current plan into practical next steps.",
    importantLimit: "The nurse often cannot independently place medical orders, approve coverage, guarantee facility acceptance, or determine the final discharge destination.",
  },
  {
    id: "provider_team",
    role: "Hospitalist or primary medical team",
    usuallyHandles: "Diagnosis and treatment decisions, medical orders, consultations, documentation of medical necessity, and the determination that hospital-level care is no longer required.",
    importantLimit: "Medical readiness does not guarantee that insurance, equipment, transportation, placement, medication access, or home support is complete.",
  },
  {
    id: "therapy",
    role: "Physical and occupational therapy",
    usuallyHandles: "Assessment of mobility, transfers, daily activities, equipment needs, caregiver training needs, and recommendations about the safest functional setting.",
    importantLimit: "A therapy recommendation supports planning but does not itself guarantee payer approval, facility acceptance, or service availability.",
  },
  {
    id: "case_management_social_work",
    role: "Case management and social work",
    usuallyHandles: "Referrals, placement searches, authorization coordination, transportation and resource planning, and communication with payers, facilities, agencies, and families.",
    importantLimit: "They coordinate the process but cannot force an insurer, facility, agency, shelter, supplier, or caregiver to approve or accept the plan.",
  },
  {
    id: "pharmacy",
    role: "Pharmacist and dispensing pharmacy",
    usuallyHandles: "Medication reconciliation support, interaction and safety review, coverage or stock questions, patient education, dispensing, and possible alternatives for the prescriber to consider.",
    importantLimit: "The pharmacy cannot independently change the prescribed treatment plan and may still need payer approval, a new prescription, or additional documentation.",
  },
  {
    id: "payer",
    role: "Insurance plan or payer",
    usuallyHandles: "Coverage determinations, prior authorization, network rules, cost sharing, benefit limits, and review or appeal pathways under the applicable plan.",
    importantLimit: "A coverage decision is not the same as a complete clinical or home-safety plan. Written reasons and current plan documents matter.",
  },
  {
    id: "receiving_organization",
    role: "Facility, home-health agency, or equipment supplier",
    usuallyHandles: "Its own referral review, capacity and staffing decision, network participation, admission or delivery requirements, and the services it can actually provide.",
    importantLimit: "A hospital referral is a request, not proof that the organization has accepted the patient or scheduled the service.",
  },
  {
    id: "patient_family",
    role: "Patient, family, and caregiver",
    usuallyHandles: "Sharing baseline function and home realities, identifying affordability or transportation barriers, participating in teaching, choosing among available options, and confirming what support is truly possible.",
    importantLimit: "Families should not be expected to silently absorb a plan they cannot safely or realistically carry out; concerns need to be stated early and specifically.",
  },
];

export const getDischargeBarriersForCategory = (categoryId: DischargeBarrierCategoryId) =>
  DISCHARGE_READINESS_BARRIERS.filter((barrier) => barrier.categoryId === categoryId);
