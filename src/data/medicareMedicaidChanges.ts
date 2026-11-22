// Editorial records: dates never automatically promote a proposal or scheduled policy.
export const CHANGES_LAST_VERIFIED = "2026-11-22";
export const CHANGES_NEXT_REVIEW = "2026-12-11";
export const CHANGES_PATH = "/medicare-medicaid-changes";
export type ChangeStatus = "Effective" | "Final — upcoming" | "Scheduled — state decision pending" | "Proposed";
export type ChangeScope = "Medicare provider payments" | "Medicare costs & plans" | "Federal Medicaid" | "North Carolina Medicaid";
export type PolicyChange = {
  id: string;
  title: string;
  scope: ChangeScope;
  status: ChangeStatus;
  date: string;
  effectiveDate: string;
  who: string;
  changed: string;
  implication: string;
  action: string;
  sources: { label: string; url: string }[];
  verifiedAt: string;
  archived?: boolean;
  supersededBy?: string;
};

export const POLICY_SOURCES = {
  ipps: { label: "CMS: FY 2027 inpatient and LTCH final rule", url: "https://www.cms.gov/newsroom/fact-sheets/fy-2027-hospital-inpatient-prospective-payment-system-long-term-care-hospital-prospective-payment" },
  ippsRule: { label: "Federal Register: CMS-1849-F", url: "https://www.federalregister.gov/d/2026-15833" },
  snf: { label: "CMS: FY 2027 skilled nursing final rule", url: "https://www.cms.gov/newsroom/fact-sheets/fiscal-year-2027-skilled-nursing-facility-prospective-payment-system-final-rule-cms-1843-f" },
  snfRule: { label: "Federal Register: SNF final rule", url: "https://www.govinfo.gov/content/pkg/FR-2026-07-31/pdf/2026-15562.pdf" },
  immigration: { label: "CMS: section 71109 guidance (PDF)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/sho26001.pdf" },
  ncImmigration: { label: "NC Medicaid: immigration status and eligibility", url: "https://medicaid.ncdhhs.gov/about-nc-medicaid/eligibility/immigration-status-and-eligibility-nc-medicaid" },
  costs: { label: "CMS: final 2027 premiums and deductibles", url: "https://www.cms.gov/newsroom/fact-sheets/2027-medicare-parts-b-premiums-deductibles" },
  medicareCosts: { label: "Medicare.gov: beneficiary costs", url: "https://www.medicare.gov/basics/costs/medicare-costs" },
  partD: { label: "CMS: 2027 benefit parameters, Table V-6 (PDF)", url: "https://www.cms.gov/files/document/2027-announcement.pdf" },
  drugCosts: { label: "Medicare.gov: Part D costs", url: "https://www.medicare.gov/health-drug-plans/part-d/basics/costs" },
  negotiated: { label: "CMS: selected drugs and negotiated prices", url: "https://www.cms.gov/initiatives/medicare-prescription-drug-affordability/overview/medicare-drug-price-negotiation-program/selected-drugs-negotiated-prices" },
  ma: { label: "CMS: contract year 2027 MA and Part D final rule", url: "https://www.cms.gov/newsroom/fact-sheets/contract-year-2027-Medicare-advantage-part-d-final-rule" },
  renewals: { label: "CMS: six-month renewal guidance (PDF)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/smd26001.pdf" },
  engagement: { label: "Federal Register: community engagement interim final rule", url: "https://www.govinfo.gov/content/pkg/FR-2026-06-03/html/2026-11094.htm" },
  transition: { label: "CMS: November 13 hold harmless guidance (PDF)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/smd26006.pdf" },
  nc: { label: "NC Medicaid: changes in 2026–27", url: "https://medicaid.ncdhhs.gov/beneficiaries/medicaid-is-changing" },
  ncWork: { label: "NC Medicaid: work rules and exclusions", url: "https://medicaid.ncdhhs.gov/beneficiaries/impact-hr-1-and-federal-changes-medicaid/work-and-community-engagement-requirement" },
  retroactive: { label: "CMS: November 18 eligibility guidance, slides 26–30 (PDF)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/cib111826.pdf" },
  homeHealth: { label: "Federal Register: CY 2027 home health final rule", url: "https://www.govinfo.gov/content/pkg/FR-2026-11-09/html/2026-22750.htm" },
  physician: { label: "CMS: CY 2027 physician fee schedule final rule", url: "https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2027-medicare-physician-fee-schedule-final-rule" },
  roadmap: { label: "CMS: Medicaid implementation roadmap (PDF)", url: "https://www.medicaid.gov/medicaid/downloads/detailed-timeline-view.pdf" },
  proposed: { label: "CMS: November 20 CY 2028 proposal", url: "https://www.cms.gov/newsroom/fact-sheets/contract-year-2028-policy-technical-changes-medicare-advantage-program-medicare-prescription-drug" },
};
const s = POLICY_SOURCES;
export const POLICY_CHANGES: PolicyChange[] = [
  {
    id: "fy2027-hospital-payments", title: "Hospital payment year changed; patient deductibles did not reset in October",
    scope: "Medicare provider payments", status: "Effective", date: "2026-10-01", effectiveDate: "October 1, 2026 — FY 2027 discharges; individual provisions have separate dates",
    who: "Acute inpatient hospitals paid under IPPS and long-term care hospitals paid under LTCH PPS; Original Medicare payment systems.",
    changed: "CMS finalized a 2.3% IPPS rate update for hospitals meeting quality-reporting and electronic-record requirements. The LTCH standard rate also receives a 2.3% update. These are base-rate updates, not a guarantee that every hospital’s total payment rises equally.",
    implication: "CAF’s care-transition lens: a payment rule helps explain institutional incentives. It does not establish that a particular patient must leave sooner, qualifies for rehab, or owes a new deductible.",
    action: "For a discharge, ask separately about inpatient status, covered services, authorization and the receiving facility. Use the January entry below for beneficiary cost changes.",
    sources: [s.ipps, s.ippsRule], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "fy2027-snf", title: "Skilled nursing facility payment rates updated",
    scope: "Medicare provider payments", status: "Effective", date: "2026-10-01", effectiveDate: "October 1, 2026 — FY 2027",
    who: "Skilled nursing facilities paid under Medicare’s SNF prospective payment system.",
    changed: "The final SNF PPS base-rate update is 2.4%, before facility-specific adjustments. This is provider reimbursement, not an expansion of the patient’s covered days.",
    implication: "A rate increase is not an available rehab bed or an acceptance letter. The practical discharge question remains whether a facility can meet the person’s needs and accept their coverage.",
    action: "Confirm clinical acceptance, coverage and any plan authorization before arranging the transfer. Do not infer a personal copay from the provider percentage.",
    sources: [s.snf, s.snfRule], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "noncitizen-federal", title: "Federal funding narrowed for some noncitizens’ full Medicaid coverage",
    scope: "Federal Medicaid", status: "Effective", date: "2026-10-01", effectiveDate: "October 1, 2026",
    who: "Certain noncitizens applying for or enrolled in federally funded Medicaid or CHIP; immigration category and exceptions matter.",
    changed: "Section 71109 restricts federal matching funds for full benefits to specified immigration categories, with exceptions. A federal funding restriction is not a statement that every noncitizen loses all care; state-funded programs and emergency coverage require separate checks.",
    implication: "A coverage interruption can unsettle prescriptions and follow-up care. The individual notice and the state’s eligibility decision matter more than a headline about immigration status.",
    action: "Ask the state agency to review the person’s actual category and notice. For North Carolina, read the separate entry below.",
    sources: [s.immigration], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "noncitizen-nc", title: "North Carolina changed which noncitizens can receive full Medicaid",
    scope: "North Carolina Medicaid", status: "Effective", date: "2026-10-01", effectiveDate: "October 1, 2026 — North Carolina",
    who: "NC applicants and members whose immigration category no longer qualifies; this does not affect every noncitizen.",
    changed: "NC lists lawful permanent residents (often subject to a five-year wait), Cuban/Haitian entrants, COFA migrants, and certain lawfully residing children and pregnant/postpartum people among groups that may qualify. Regular eligibility rules still apply. Emergency Medicaid remains a separate, limited pathway.",
    implication: "Do not assume the same rule applies to everyone in a household, or that emergency coverage replaces ongoing treatment coverage.",
    action: "Contact local DSS about status, exceptions and alternatives. Read the appeal instructions and deadlines in any adverse notice; seek help before a follow-up appointment or medication supply is interrupted.",
    sources: [s.ncImmigration], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-medicare-costs", title: "Final 2027 Medicare premiums and cost sharing",
    scope: "Medicare costs & plans", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "January 1, 2027 — calendar year",
    who: "People with Part B and people receiving covered Original Medicare Part A services; supplemental coverage and assistance can change what a person actually pays.",
    changed: "Standard Part B premium: $209.40/month (2026: $202.90). Part B annual deductible: $292 (2026: $283). Part A inpatient deductible: $1,776 per benefit period (2026: $1,736). Covered SNF days 21–100: $222/day (2026: $217). Higher-income premiums and other cost-sharing amounts are in the CMS tables.",
    implication: "A benefit-period deductible is different from an annual deductible. A long stay crossing New Year’s needs a benefit-period review, not an assumption that January always starts a new hospital deductible.",
    action: "Check your own premium notice, supplement, Medicaid assistance and plan documents. MA medical copays follow the plan; these Original Medicare amounts are not a universal MA copay schedule.",
    sources: [s.costs, s.medicareCosts], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-part-d", title: "Part D’s covered-drug spending cap rises to $2,400",
    scope: "Medicare costs & plans", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "January 1, 2027",
    who: "People with Medicare Part D, including drug coverage in Medicare Advantage; Extra Help and plan design can lower costs.",
    changed: "The annual out-of-pocket threshold becomes $2,400, up from $2,100 in 2026. The maximum defined-standard deductible is $700, up from $615; a plan may charge less. The cap concerns covered Part D drugs, not premiums, all healthcare spending, or Part B drugs.",
    implication: "The annual ceiling does not tell a family what the first pharmacy pickup will cost. Formulary placement, the deductible and assistance still matter at discharge.",
    action: "Compare the exact drugs, doses and pharmacies in Medicare Plan Finder. Confirm coverage restrictions and an affordable first fill before leaving the hospital.",
    sources: [s.partD, s.drugCosts], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-negotiated-drugs", title: "Negotiated prices begin for the second group of 15 Part D drugs",
    scope: "Medicare costs & plans", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "January 1, 2027 — initial price applicability year 2027",
    who: "Medicare enrollees using selected, covered Part D drugs; not every prescription or every indication.",
    changed: "CMS’s negotiated maximum fair prices for the second cycle take effect. The official selected-drug list identifies the products included.",
    implication: "A negotiated price is not a promised personal copay or a new coverage entitlement for every use of a drug.",
    action: "Look up the specific product on CMS’s list, then verify its formulary coverage, indication restrictions and expected cost with your plan and pharmacy.",
    sources: [s.negotiated], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-ma-part-d", title: "The 2027 MA/Part D final rule carries forward the redesigned drug benefit",
    scope: "Medicare costs & plans", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "Contract year 2027; Star Ratings provisions have separate measurement and rating years",
    who: "Medicare Advantage and Part D organizations and their members; individual plan benefits vary.",
    changed: "CMS codifies the Part D redesign for 2027 and beyond, including no coverage-gap phase and no enrollee cost sharing in the catastrophic phase. This continues earlier reforms; it is not a new benefit invented for 2027. The rule also changes Star Ratings; a rating year is not necessarily the year care was measured.",
    implication: "National regulations and your plan’s annual changes are different layers. A national rule alone does not confirm next year’s network, drug coverage or rehab authorization.",
    action: "Read the Annual Notice of Change and 2027 Evidence of Coverage. Check doctors, facilities, drugs and authorization rules directly; compare plans at Medicare.gov before the December 7 annual enrollment deadline where applicable.",
    sources: [s.ma, { label: "Medicare.gov: plan review and enrollment dates", url: "https://www.medicare.gov/health-drug-plans/open-enrollment" }], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-renewals", title: "Six-month renewals apply to the Medicaid expansion adult group",
    scope: "Federal Medicaid", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "Renewals initiated on or after January 1, 2027",
    who: "The Medicaid expansion adult group, with statutory exceptions, including American Indians/Alaska Natives. Not all Medicaid members or all adults.",
    changed: "Federal law requires eligibility renewals every six months for this group instead of annually. Renewal and community-engagement checks are distinct requirements. An exclusion from work rules does not by itself answer which renewal schedule applies.",
    implication: "More renewal points mean more opportunities for an eligible person to miss a request. For care transitions, confirm coverage and who receives the notices early.",
    action: "Update contact details and follow your own renewal notice. NC describes the expansion renewal change on its changes page; do not assume every member must submit a new form on January 1.",
    sources: [s.renewals, s.nc], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-community-engagement", title: "Medicaid work rules: January implementation, optional enforcement transition",
    scope: "Federal Medicaid", status: "Scheduled — state decision pending", date: "2027-01-01", effectiveDate: "January 1, 2027 implementation; optional CMS-approved state hold harmless period through June 30, 2027",
    who: "Certain expansion and similar demonstration adults ages 19–64; exclusions and exceptions apply. Medicare entitlement is among the exclusions.",
    changed: "The law and interim final rule require qualifying activity, deemed compliance or an exclusion for applicable adults. On November 13, CMS offered states an optional, approved transition: they must still assess compliance but may suspend community-engagement-based denials and disenrollments through June 30. Other eligibility rules still apply.",
    implication: "Neither ‘everyone loses coverage January 1’ nor ‘the rule is delayed nationwide until July’ is accurate. CMS also acknowledges a court-vacated portion of the regulations; medical-frailty details need current guidance.",
    action: "Check your state’s current implementation notice and exclusion rules. States seeking the January transition are asked to notify CMS by December 11. Keep responding to renewal and other eligibility requests.",
    sources: [s.engagement, s.transition], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-nc-work", title: "NC still describes a January 1 start; its federal transition election is unverified",
    scope: "North Carolina Medicaid", status: "Scheduled — state decision pending", date: "2027-01-01", effectiveDate: "January 1, 2027 in NC guidance; enforcement timing needs confirmation after November 13 federal guidance",
    who: "Applicable NC Medicaid expansion adults. NC lists exclusions including Medicare qualification, pregnancy/postpartum status, certain caregivers and disability-related categories.",
    changed: "NC’s current page describes qualifying activity, half-time school or an earnings route, along with exclusions and hardship exceptions. We did not verify an NC election or CMS approval of the new optional hold harmless period as of November 22. The state page predates that federal guidance.",
    implication: "Treat NC’s published start date and the new federal option as two separate facts. Do not assume a particular termination date or ask a Medicare beneficiary to meet expansion work rules.",
    action: "Ask local DSS whether the requirement applies and what proof is needed. Save relevant records, update contact information in ePASS, and act on notices. Do not cancel coverage based on this summary.",
    sources: [s.ncWork, s.transition], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-retroactive", title: "Less time to cover bills from before a Medicaid application",
    scope: "Federal Medicaid", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "Applications made on or after January 1, 2027",
    who: "Applicants seeking retroactive Medicaid coverage, including NC; eligibility group, eligibility in the earlier month and existing demonstration waivers matter.",
    changed: "The statutory maximum becomes one month before the application month for people enrolled in the expansion adult group, and two months for other applicable groups. Existing waivers may be narrower; this is not guaranteed payment of every earlier bill. CMS’s November 18 guidance distinguishes these enacted limits from implementing regulatory policies it intends to propose.",
    implication: "Waiting to apply can leave older hospital or post-acute bills outside the window. An application date is part of the discharge financial plan.",
    action: "Seek application help promptly and ask about prior-month eligibility and covered bills. NC confirms the one-/two-month change; obtain a determination rather than assuming later enrollment will erase past debt.",
    sources: [s.retroactive, s.nc], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2027-calendar-provider", title: "Home health and physician payment rules run on the calendar year",
    scope: "Medicare provider payments", status: "Final — upcoming", date: "2027-01-01", effectiveDate: "January 1, 2027 for home health payment provisions; physician provisions on or after January 1 as specified",
    who: "Medicare home health agencies and clinicians billing the physician fee schedule; individual provisions have their own scope.",
    changed: "CMS issued the CY 2027 home health and physician fee schedule final rules in November. Their payment updates belong to January, unlike the October hospital/SNF cycle. This entry tracks the payment calendar, not every provision in either rule.",
    implication: "A payment update does not promise daily home visits or a covered service for a specific patient. Agency acceptance and an actual start-of-care date still need confirmation.",
    action: "Before discharge, confirm the accepting agency, ordered services, start date and who covers the gaps between visits. Check the exact rule provision before applying a payment change to care.",
    sources: [s.homeHealth, s.physician], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2028-cjr", title: "Expanded joint-replacement payment model is scheduled for 2028",
    scope: "Medicare provider payments", status: "Final — upcoming", date: "2028-01-01", effectiveDate: "January 1, 2028 — CJR-X",
    who: "Original Medicare lower-extremity joint-replacement episodes within the expanded model’s scope; not every surgery or payer.",
    changed: "The FY 2027 inpatient final rule finalizes a nationwide mandatory expanded Comprehensive Care for Joint Replacement model, CJR-X, beginning in 2028. Publication in an October-cycle rule does not make this provision effective in October 2026.",
    implication: "CAF will follow what episode accountability means for post-acute coordination. A model start date alone does not establish an individual discharge destination.",
    action: "For current surgery, use the coverage and discharge plan in force now. Recheck the model’s final requirements before the 2028 start.",
    sources: [s.ipps, s.ippsRule], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2028-medicaid-cost-sharing", title: "Later Medicaid cost-sharing changes are not a January 2027 copay rule",
    scope: "Federal Medicaid", status: "Final — upcoming", date: "2028-10-01", effectiveDate: "October 1, 2028 — statutory implementation schedule",
    who: "Certain expansion adults; details and exceptions require provision-specific and state implementation review.",
    changed: "CMS’s implementation roadmap places section 71120 cost-sharing changes in October 2028. They should not be bundled into the January 2027 renewal or work-rule rollout.",
    implication: "Families need dates attached to each obligation. Combining future changes into one alarming deadline makes it harder to act on the notice that actually matters.",
    action: "Follow current state cost-sharing notices. Reverify the law, implementation guidance and NC policy before adding dollar amounts or predicting a personal copay.",
    sources: [s.roadmap], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2028-ma-proposal", title: "A new 2028 MA/Part D proposal is open policy, not current coverage",
    scope: "Medicare costs & plans", status: "Proposed", date: "2028-01-01", effectiveDate: "Proposed CY 2028 changes; model dates extend later and depend on finalization",
    who: "MA/Part D organizations and potentially their enrollees; applicability depends on what CMS ultimately finalizes.",
    changed: "CMS issued CMS-4214-P2 on November 20. Proposals include a healthy-food standard for supplemental benefits and changes to plan administration. A proposed MA competition model would begin in 2029, with a proposed 2027 preparation period.",
    implication: "A proposed food benefit standard or model is not a benefit available on a member’s card today. Proposed and final provisions can differ.",
    action: "Use current plan documents for care decisions. Follow the official proposal and any eventual final rule; no enrollment change is warranted solely because of this proposal.",
    sources: [s.proposed], verifiedAt: CHANGES_LAST_VERIFIED,
  },
  {
    id: "2026-part-d-archive", title: "2026 Part D baseline: $2,100 threshold and $615 standard deductible",
    scope: "Medicare costs & plans", status: "Effective", date: "2026-01-01", effectiveDate: "January 1–December 31, 2026",
    who: "People with covered Part D drugs in the 2026 benefit year.",
    changed: "The 2026 out-of-pocket threshold is $2,100 and the defined-standard deductible is $615. These remain the 2026 figures; the 2027 amounts above do not apply early.",
    implication: "Historical amounts help explain a bill or plan comparison from the correct year. An archive label does not mean the rule has stopped applying during its stated period.",
    action: "Use the year of coverage when reviewing a claim. See the 2027 entry for the next benefit year.",
    sources: [s.partD], verifiedAt: CHANGES_LAST_VERIFIED, archived: true, supersededBy: "2027-part-d",
  },
];

export const CHANGE_SCOPES: ChangeScope[] = ["Medicare provider payments", "Medicare costs & plans", "Federal Medicaid", "North Carolina Medicaid"];
export const CHANGE_STATUSES: ChangeStatus[] = ["Effective", "Final — upcoming", "Scheduled — state decision pending", "Proposed"];

export function filterPolicyChanges(entries: PolicyChange[], query: string, scope = "All", status = "All") {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((entry) => (scope === "All" || entry.scope === scope) && (status === "All" || entry.status === status) && words.every((word) => [entry.title, entry.scope, entry.status, entry.effectiveDate, entry.who, entry.changed, entry.implication, entry.action].join(" ").toLocaleLowerCase().includes(word)));
}
