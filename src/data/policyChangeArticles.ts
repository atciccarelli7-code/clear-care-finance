import type { Article } from "./articles";
import { POLICY_SOURCES } from "./medicareMedicaidChanges";

// Preserve the published URL. The evergreen hub owns the evolving timeline.
export const JANUARY_2027_MEDICARE_MEDICAID_CHANGES_ARTICLE: Article = {
  slug: "medicare-medicaid-changes-january-2027",
  title: "January Policy Changes and Care Transitions",
  category: "Medicare & Medicaid",
  readTime: "5 min read",
  lastReviewedAt: "2026-11-22",
  nextReviewAt: "2026-12-11",
  timeSensitive: true,
  reviewScope: "Care-transition context; current dates and statuses live in the central changes hub.",
  updateNote: "Revised November 22: replaced the generalized rollout summary with care-transition context and primary sources. Medicaid enforcement has a state-selected transition option; NC adoption remains unverified.",
  promise: "Care-transition questions to ask when healthcare policy changes.",
  audience: "Patients, caregivers, nurses, case managers and social workers preparing for care across a benefit-year change.",
  summary: "January brings several separate changes, not one universal Medicare/Medicaid switch. Beneficiary costs, plan-year coverage, Medicaid renewals and application rules affect different people. The care-transition question is which rule controls the next step, who must act and what needs confirmation before care moves to the next setting.",
  body: [
    "A policy announcement becomes useful when it answers a concrete question: Can this person get the next prescription? Has the receiving facility accepted the coverage? Who will receive the Medicaid renewal notice?",
    "This article explains that care-transition lens. CAF's Medicare & Medicaid Changes hub maintains the dated entries, official citations and current verification gaps. Use that hub as the timeline.",
    "Provider reimbursement, beneficiary cost sharing and state eligibility are different layers. A payment update does not establish a new patient deductible or a right to rehab. A national regulation does not confirm an individual plan's network."
  ],
  sections: [
    {
      title: "Separate the payer, the benefit and the paperwork",
      definition: "A workable discharge plan needs clinical readiness and a confirmed next step.",
      keyPoints: [
        "Identify the program covering the service: Original Medicare, Medicare Advantage, Medicaid or another payer.",
        "Confirm what the receiving provider has agreed to provide, when care starts and whether authorization is complete.",
        "Identify who handles applications, renewals and document requests. Give that person the written instructions and deadline.",
        "If care crosses a benefit-year boundary, ask which year's costs and plan documents govern each service."
      ],
      watchOut: "An insurance card, a referral and an accepting provider are three different things. Verify each part."
    },
    {
      title: "The Medicaid work rule does not apply to every member",
      definition: "Community-engagement requirements concern certain expansion and similar demonstration adults, with exclusions and exceptions.",
      keyPoints: [
        "Medicare entitlement is an exclusion. Do not tell a Medicare beneficiary that expansion work rules automatically apply because the person also has Medicaid.",
        "November federal guidance offers an optional, CMS-approved enforcement transition. Assessment obligations and other eligibility rules remain.",
        "NC's published start date and its election of the federal option are separate checks. CAF has not verified an NC election as of this review.",
        "Work-rule exclusions and renewal frequency are different questions. Ask the agency which requirement applies."
      ],
      watchOut: "A headline is not an eligibility determination. Respond to notices and follow appeal instructions in an adverse decision."
    },
    {
      title: "Application timing belongs in the financial care plan",
      keyPoints: [
        "The retroactive Medicaid coverage window changes for applications beginning in 2027. The central hub separates expansion and other-group limits.",
        "Eligibility must be established for the relevant months; retroactive coverage does not automatically pay every earlier bill.",
        "Seek application assistance promptly. Waiting for placement can also change the months of bills that can be considered.",
        "Keep the application receipt, notices and a list of outstanding provider bills. Share records through official agency channels."
      ]
    },
    {
      title: "Make the next step specific",
      keyPoints: [
        "For medication: confirm the covered product, pharmacy, restrictions and first-fill cost.",
        "For rehab: confirm acceptance, authorization, covered level of care and expected family responsibility.",
        "For home care: confirm the start date and who helps between visits.",
        "For Medicaid: confirm the responsible contact, actual deadline and whether an exclusion or assistance pathway needs review."
      ],
      watchOut: "These are planning questions, not predictions that a rule will cause a particular person to lose coverage or wait longer for discharge."
    }
  ],
  takeaway: "Put the rule next to the care task it affects. Confirm the payer, date, responsible person and next action. Use the central hub for current policy status and the agency or plan for an individual determination.",
  sources: [POLICY_SOURCES.transition, POLICY_SOURCES.ncWork, POLICY_SOURCES.retroactive, POLICY_SOURCES.medicareCosts].map((source) => ({ name: new URL(source.url).hostname, pageTitle: source.label, url: source.url })),
};
