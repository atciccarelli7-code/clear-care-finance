import type { Article } from "./articles";
import { SOURCE_PRESETS } from "./sources";

export const JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE: Article = {
  slug: "medicare-medicaid-changes-january-2027",
  title: "Medicare and Medicaid Changes Coming January 1, 2027",
  category: "Medicare & Medicaid",
  readTime: "8 min read",
  promise: "A plain-English guide to the 2027 Medicaid eligibility rollout and why Medicare patients, caregivers, and hospitals should still pay attention.",
  audience: "Patients, caregivers, healthcare workers, case managers, social workers, discharge planners, and families trying to understand the 2027 Medicare and Medicaid policy environment.",
  summary: "The major January 1, 2027 change is mainly a Medicaid eligibility and paperwork change. Some adults will need to meet or document qualifying monthly activity, while states will need to verify eligibility more often. Medicare is less directly changed for most current beneficiaries, but the Medicaid shift still matters for dual-eligible patients, long-term care, rural hospitals, and discharge planning.",
  body: [
    "This article is forward-looking. The rules have not fully taken effect yet, and federal guidance, state implementation, and court challenges may change details before or after January 1, 2027.",
    "The biggest change is not a new Medicare benefit. It is a Medicaid eligibility and verification shift. Medicare beneficiaries should still care because many low-income Medicare patients also rely on Medicaid for premiums, cost-sharing, long-term care, transportation, or home-based support.",
    "The broad direction is tighter eligibility verification, more documentation, and more state-level administration."
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
        "Medicare is not being redesigned for most current beneficiaries, but Medicaid changes can still affect Medicare patients who are dual eligible."
      ],
      watchOut: "Rules can vary by state, and many details may change as states build their systems."
    },
    {
      title: "What is changing in Medicaid",
      definition: "Medicaid is moving toward more frequent verification and more conditions for some adults to keep coverage.",
      keyPoints: [
        "Some adults may need to prove qualifying activity or an exemption.",
        "Some eligibility checks may happen twice per year instead of once per year.",
        "Some enrollees may face more service-level cost-sharing.",
        "Shorter retroactive coverage windows can matter if someone applies after care already happened.",
        "States will carry more paperwork, technology, and communication work."
      ],
      watchOut: "The practical risk is not only failing the rule. It is missing a form, notice, upload, address update, or exemption step."
    },
    {
      title: "What is changing in Medicare",
      definition: "For most Medicare beneficiaries, the January 1 change is not a broad Medicare benefit redesign.",
      keyPoints: [
        "Medicare and Medicaid remain separate programs.",
        "Medicare is mainly age or disability-based federal insurance.",
        "Medicaid is income and need-based assistance administered by states within federal rules.",
        "Dual-eligible patients may feel Medicaid changes even if their Medicare card stays the same.",
        "Hospitals and long-term care providers may feel Medicaid changes through coverage gaps, delayed placement, and payment pressure."
      ],
      watchOut: "A Medicare card does not solve every cost-sharing or long-term care problem. Many people need Medicaid to fill gaps."
    },
    {
      title: "What patients and caregivers should do now",
      keyPoints: [
        "Keep address, phone, email, and household information updated with the state Medicaid agency.",
        "Open renewal and verification notices quickly.",
        "Save proof of work, school, volunteering, caregiving, disability, pregnancy, postpartum status, medical frailty, or other possible exemption status.",
        "Ask for help early if Medicaid may be needed for discharge, long-term care, home care, or transportation.",
        "Do not wait until discharge day or a renewal deadline to fix a coverage issue."
      ]
    },
    {
      title: "Why healthcare workers should care",
      keyPoints: [
        "Case management and social work may see more renewal and verification problems.",
        "Bedside workers may hear more confusion from patients and families about coverage changes.",
        "Discharge planning can become harder when Medicaid coverage is delayed, paused, or uncertain.",
        "Rural hospitals and safety-net hospitals may face more financial pressure if coverage gaps increase."
      ],
      watchOut: "This is not only a policy story. It can become a bedside workflow story."
    }
  ],
  example: {
    title: "How this could show up in real life",
    body: "A patient has Medicare and Medicaid. Medicare helps with hospital and doctor coverage, but Medicaid helps with long-term care, premiums, transportation, or other support. If Medicaid paperwork fails in 2027, the patient may still have Medicare, but the discharge plan, facility placement, home support, or out-of-pocket cost picture can change quickly."
  },
  relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools#medicare" },
  commonMistakes: [
    "Thinking the January 1 change is mainly a new Medicare benefit.",
    "Assuming every Medicaid enrollee has the same requirement.",
    "Ignoring exemption paperwork because the person seems obviously exempt.",
    "Waiting until discharge day or renewal deadline to ask for help.",
    "Forgetting that Medicaid changes can affect Medicare patients who are dual eligible."
  ],
  takeaway: "The January 1, 2027 story is bigger than one rule. Medicaid is becoming more conditional and more verification-heavy. For patients and caregivers, preparation means documentation and early help. For healthcare workers, the practical impact may show up in discharge planning, coverage gaps, long-term care access, and patient confusion.",
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
