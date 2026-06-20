import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

export const JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE: Article = {
  slug: "medicare-medicaid-changes-january-2027",
  title: "Medicare and Medicaid Changes Scheduled for January 1, 2027",
  category: "Medicare & Medicaid",
  readTime: "8 min read",
  promise: "A plain-English guide to the scheduled 2027 Medicaid eligibility rollout and the practical areas Medicare patients, caregivers, and hospitals should watch.",
  audience: "Patients, caregivers, healthcare workers, case managers, social workers, discharge planners, and families trying to understand the 2027 Medicare and Medicaid policy environment.",
  summary: "The major January 1, 2027 change is mainly a Medicaid eligibility and verification change. Some adults will need to meet or document qualifying monthly activity, while states will need to verify eligibility more often. Medicare is less directly changed for most current beneficiaries, but Medicaid changes can still matter for dual-eligible patients, long-term care, hospital discharge planning, transportation, and cost-sharing support.",
  body: [
    "This article is forward-looking. The rules have not fully taken effect yet, and federal guidance and state implementation details may change before or after January 1, 2027.",
    "The scheduled change is not a broad new Medicare benefit. It is mainly a Medicaid eligibility and verification change. Medicare beneficiaries may still be affected if they also rely on Medicaid for premiums, cost-sharing, long-term care, transportation, or home-based support.",
    "This article focuses on what the rule does, which groups may be affected, what paperwork may be involved, and what practical effects patients, caregivers, and healthcare workers may see."
  ],
  sections: [
    {
      title: "The quick answer",
      definition: "January 1, 2027 is the scheduled start date for a major Medicaid work or community-engagement rollout for certain adults.",
      keyPoints: [
        "The commonly reported standard is 80 hours per month of qualifying activity.",
        "Qualifying activity may include work, school, job training, volunteering, or similar activity.",
        "The rules are aimed at certain adults ages 19 to 64, not every Medicaid enrollee.",
        "States are expected to verify eligibility at least every six months.",
        "Medicare is not being broadly redesigned for most current beneficiaries, but Medicaid changes can still affect Medicare patients who are dual eligible."
      ],
      watchOut: "Rules can vary by state, and details may change as states build their systems."
    },
    {
      title: "What is changing in Medicaid",
      definition: "Medicaid is adding more frequent verification and activity documentation for some adults.",
      keyPoints: [
        "Some adults may need to show qualifying activity or an exemption.",
        "Some eligibility checks may happen twice per year instead of once per year.",
        "Some enrollees may face more service-level cost-sharing.",
        "Shorter retroactive coverage windows can matter if someone applies after care already happened.",
        "States will need to handle more eligibility, communication, and documentation work."
      ],
      watchOut: "A person may qualify but still need to complete forms, notices, uploads, address updates, or exemption steps on time."
    },
    {
      title: "What is changing in Medicare",
      definition: "For most Medicare beneficiaries, the January 1 change is not a broad Medicare benefit redesign.",
      keyPoints: [
        "Medicare and Medicaid remain separate programs.",
        "Medicare is mainly age or disability-based federal insurance.",
        "Medicaid is income and need-based assistance administered by states within federal rules.",
        "Dual-eligible patients may feel Medicaid changes even if their Medicare card stays the same.",
        "Hospitals and long-term care providers may see effects through coverage checks, placement planning, and payment workflows."
      ],
      watchOut: "A Medicare card does not solve every cost-sharing or long-term care need. Some Medicare beneficiaries also rely on Medicaid to fill gaps."
    },
    {
      title: "Possible effects for patients and caregivers",
      keyPoints: [
        "More attention to renewal notices, verification letters, and state Medicaid communication.",
        "More need to keep address, phone, email, and household information updated with the state Medicaid agency.",
        "More need to save documents related to work, school, volunteering, caregiving, disability, pregnancy, postpartum status, medical frailty, or other possible exemption status.",
        "Possible delays if Medicaid is needed for discharge planning, long-term care, home care, or transportation.",
        "More confusion for families when a person has both Medicare and Medicaid."
      ]
    },
    {
      title: "Possible effects for healthcare workers",
      keyPoints: [
        "Case management and social work may see more renewal and verification questions.",
        "Bedside workers may hear more patient and family questions about Medicaid notices or coverage status.",
        "Discharge planning may require earlier checks when Medicaid is part of the plan.",
        "Hospitals that care for many Medicaid or uninsured patients may need to monitor coverage gaps and eligibility timing."
      ],
      watchOut: "The practical role is usually to connect patients with case management, social work, the state Medicaid agency, SHIP counselors, or other trusted enrollment help."
    }
  ],
  example: {
    title: "How this could show up in real life",
    body: "A patient has Medicare and Medicaid. Medicare helps with hospital and doctor coverage, but Medicaid helps with long-term care, premiums, transportation, or other support. If Medicaid paperwork is incomplete in 2027, the patient may still have Medicare, but the discharge plan, facility placement, home support, or out-of-pocket cost picture can change."
  },
  relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools#medicare" },
  commonMistakes: [
    "Thinking the January 1 change is mainly a new Medicare benefit.",
    "Assuming every Medicaid enrollee has the same requirement.",
    "Assuming exemption paperwork is unnecessary because the person seems obviously exempt.",
    "Waiting until discharge day or renewal deadline to ask for help.",
    "Forgetting that Medicaid changes can affect Medicare patients who are dual eligible."
  ],
  takeaway: "The January 1, 2027 change is mainly about Medicaid eligibility, verification, and documentation. For patients and caregivers, the practical step is to keep contact information current, open notices quickly, and save documentation. For healthcare workers, the practical effect may appear in discharge planning, coverage checks, long-term care access, and patient questions.",
  sources: [
    SOURCE_PRESETS.reutersMedicaidWorkRequirements2027,
    SOURCE_PRESETS.kiplingerObbbMedicareMedicaid,
    SOURCE_PRESETS.investopediaObbbMedicaid,
    SOURCE_PRESETS.medicaidEligibility,
    SOURCE_PRESETS.medicaidLtss,
    SOURCE_PRESETS.cmsMedicaidCoordination,
    SOURCE_PRESETS.medicareLongTermCare,
    SOURCE_PRESETS.kffMedicareCoverageSnapshot
  ],
};
