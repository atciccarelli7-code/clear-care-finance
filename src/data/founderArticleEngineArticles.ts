import type { Article } from "./articles";
import type { Source } from "./sources";

const AUTHOR = "Andrew Ciccarelli, BSN, RN";
const PUBLISHED_AT = "2026-09-03";

const cmsEmtala: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Emergency Medical Treatment & Labor Act (EMTALA)",
  url: "https://www.cms.gov/medicare/regulations-guidance/legislation/emergency-medical-treatment-labor-act",
  note: "Official scope of hospital emergency screening, stabilizing-treatment, and appropriate-transfer obligations regardless of ability to pay.",
};

const medpacHospitals2026: Source = {
  name: "Medicare Payment Advisory Commission",
  pageTitle: "Hospital inpatient and outpatient services — March 2026 Report to Congress",
  url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch3_MedPAC_Report_To_Congress_SEC.pdf",
  note: "Current federal analysis of hospital capacity, access, payment, margins, quality, capital conditions, safety-net policy, and rural emergency hospital standby payments.",
};

const medpacDataBook2026: Source = {
  name: "Medicare Payment Advisory Commission",
  pageTitle: "Health Care Spending and the Medicare Program — July 2026 Data Book, Section 6",
  url: "https://www.medpac.gov/wp-content/uploads/2026/07/July2026_MedPAC_DataBook_Sec6_SEC.pdf",
  note: "Federal tables distinguishing all-payer total, all-payer operating, and fee-for-service Medicare hospital margins, including variation by ownership and geography.",
};

const ahaCosts2026: Source = {
  name: "American Hospital Association",
  pageTitle: "Costs of Caring: Challenges Facing America’s Hospitals as They Care for Patients in 2026",
  url: "https://www.aha.org/system/files/media/file/2026/03/Costs-of-Caring-2026.pdf",
  note: "Hospital-industry perspective on continuous readiness, labor, technology, supplies, and administrative burden; used as disclosed stakeholder context rather than neutral proof of payment adequacy.",
};

const gaoHospitalPrices: Source = {
  name: "U.S. Government Accountability Office",
  pageTitle: "Health Care Transparency: CMS Needs More Information on Hospital Pricing Data Completeness and Accuracy",
  url: "https://files.gao.gov/reports/GAO-25-106995/index.html",
  note: "Nonpartisan federal review of hospital price transparency, private-plan price growth, data usability, and enforcement limitations.",
};

const cmsIpps: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Acute Inpatient Prospective Payment System",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps",
  note: "Official explanation of base rates, MS-DRG weights, wage adjustment, disproportionate-share and teaching adjustments, and unusually costly outlier cases.",
};

const cmsIppsGuide: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "IPPS and MS-DRG overview",
  url: "https://www.cms.gov/cms-guide-medical-technology-companies-and-other-interested-parties/payment/ipps",
  note: "Plain-language CMS explanation of how inpatient cases are assigned to MS-DRGs and how relative weights represent expected resource use.",
};

const cmsCostReports: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Healthcare Provider Cost Report Information System (HCRIS)",
  url: "https://www.cms.gov/data-research/statistics-trends-and-reports/cost-reports",
  note: "Official description of hospital cost-report data, including facility, utilization, cost-center, Medicare settlement, and financial-statement information and CMS's interpretation disclaimer.",
};

const crossSubsidyResearch: Source = {
  name: "David, Lindrooth, Helmchen, and Burns",
  pageTitle: "Do Hospitals Cross Subsidize?",
  url: "https://www.nber.org/papers/w17300",
  note: "Peer-reviewed health-economics research using specialty-hospital entry in Arizona and Colorado to test whether changes in profitable service volume affected hospitals' provision of services considered unprofitable; useful but geographically and historically bounded.",
};

const healthcareGovPreauthorization: Source = {
  name: "HealthCare.gov",
  pageTitle: "Preauthorization — glossary",
  url: "https://www.healthcare.gov/glossary/preauthorization/",
  note: "Official definition of preauthorization and warning that authorization is not a promise the plan will cover the cost.",
};

const cmsPriorAuthorizationRule: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F) — fact sheet",
  url: "https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f",
  note: "Official scope, 2026 process requirements, decision timeframes for covered non-drug requests, denial-reason rules, reporting, and later API requirements for specified impacted payers.",
};

const federalPriorAuthorizationRule: Source = {
  name: "Federal Register",
  pageTitle: "Advancing Interoperability and Improving Prior Authorization Processes",
  url: "https://www.federalregister.gov/documents/2024/02/08/2024-00895/medicare-and-medicaid-programs-patient-protection-and-affordable-care-act-advancing-interoperability",
  note: "Controlling final-rule text, public comments, payer scope, implementation dates, and CMS's stated reasons for the prior-authorization process changes.",
};

const oigPriorAuthorization: Source = {
  name: "HHS Office of Inspector General",
  pageTitle: "Some Medicare Advantage Organization Denials of Prior Authorization Requests Raise Concerns",
  url: "https://oig.hhs.gov/reports/all/2022/some-medicare-advantage-organization-denials-of-prior-authorization-requests-raise-concerns-about-beneficiary-access-to-medically-necessary-care/",
  note: "Federal oversight review of a one-week 2019 sample from 15 large Medicare Advantage organizations; the limited sample supports concern, not a current all-market denial rate.",
};

const medpacMedicareAdvantage2026: Source = {
  name: "Medicare Payment Advisory Commission",
  pageTitle: "The Medicare Advantage program — March 2026 Report to Congress",
  url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch12_MedPAC_Report_To_Congress_SEC.pdf",
  note: "Current federal description of Medicare Advantage networks and utilization-management tools, including prior authorization used to evaluate medical necessity before plan coverage.",
};

const medicareAppeals: Source = {
  name: "Medicare.gov",
  pageTitle: "Filing an appeal",
  url: "https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals",
  note: "Official overview of Medicare coverage and payment appeals, plan-specific instructions, supporting information, and fast-appeal rights for certain ending services.",
};

export const FOUNDER_ARTICLE_ENGINE_ARTICLES: Article[] = [
  {
    slug: "hospitals-are-businesses-and-public-utilities",
    title: "Hospitals Are Businesses. Why We Ask Them to Behave Like Public Utilities",
    category: "Hospital Economics",
    readTime: "12 min read",
    promise: "Hospitals must finance payroll, technology, debt, and continuous readiness while communities expect an emergency front door that does not begin with ability to pay.",
    description: "Why hospitals operate as businesses while carrying public-infrastructure expectations—and why that tension explains behavior without excusing every hospital decision.",
    audience: "Patients, families, healthcare workers, hospital leaders, and policy-minded readers trying to understand why a socially essential institution still talks about margin, capacity, payer mix, and financial sustainability.",
    summary: "Hospitals are not legally public utilities, and not every hospital has the same mission or ownership. The comparison describes a real contradiction: communities expect continuous emergency capability and reliable access, while hospitals must earn or receive enough money to staff that capability, replace equipment, service debt, and survive. EMTALA creates important emergency screening and stabilization duties regardless of ability to pay, but it is not a promise of every kind of free care. Financial viability explains why hospitals measure margin and protect capacity. It does not excuse high prices, weak staffing, aggressive collection, market power, or choices that put growth ahead of patient and community need.",
    body: [
      "A hospital can be a business without being only a business.",
      "That is the central tension in Andrew's manuscript. A hospital buys labor, drugs, equipment, utilities, insurance, technology, and debt financing in ordinary markets. At the same time, the public expects it to remain ready for emergencies before the institution knows who will arrive, what the patient will need, or how the care will be paid.",
      "The useful question is not whether hospitals are businesses. It is what kind of obligations, incentives, and scrutiny should follow when a business is also essential civic infrastructure.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-09-03",
    nextReviewAt: "2027-03-03",
    reviewScope: "Current EMTALA scope, 2024 hospital capacity and margin evidence, 2026 Medicare payment analysis, continuous-readiness stakeholder evidence, hospital price transparency, and the limits of the public-utility analogy.",
    author: AUTHOR,
    systemMap: {
      title: "The hospital has to be ready before the revenue is known",
      description: "The order varies by encounter and payer, but hospital readiness and emergency obligations often precede final payment.",
      steps: [
        { title: "Capacity exists before the patient arrives", body: "Staff, pharmacy, imaging, laboratories, security, utilities, equipment, supplies, on-call specialists, and backup systems must be available before demand is certain." },
        { title: "Emergency duties begin before payment is settled", body: "At covered hospitals, EMTALA requires an appropriate medical screening examination and, when an emergency medical condition exists, stabilizing treatment within capability or an appropriate transfer regardless of ability to pay." },
        { title: "Different rules determine payment", body: "Medicare, Medicaid, commercial plans, uninsured payment, public subsidies, grants, and other sources use different prices, eligibility rules, adjustments, and collection paths." },
        { title: "The result funds—or constrains—the next round of readiness", body: "Positive operating results can support payroll, reserves, facilities, technology, and future capacity. Persistent shortfalls can force cuts, subsidy, conversion, merger, or closure." },
      ],
    },
    editorialSections: [
      {
        title: "The grocery-store thought experiment exposes the contradiction",
        paragraphs: [
          "Andrew's rough draft asks readers to imagine demanding groceries before the store knows whether anyone will pay. The analogy is intentionally imperfect. Food stores do not carry the same emergency screening and stabilization duties as covered hospitals, and hospital payment is far more fragmented than a checkout transaction. That is why the comparison is useful: it reveals how unusual the hospital's position is.",
          "A hospital must operate as an employer, borrower, purchaser, landlord, technology organization, regulated provider, and billing enterprise. Yet a person arriving with a possible emergency medical condition is not simply a shopper comparing an optional purchase. Illness changes bargaining power, timing, information, and the consequence of walking away.",
          "This is the manuscript's strongest original tension: healthcare workers and patients benefit from understanding that a hospital is a business; hospital leaders benefit from remembering that it is not just a business.",
        ],
        callout: {
          label: "Founder reasoning",
          body: "Money is not the mission of bedside care, but money keeps the staff, equipment, and capacity available to perform that care. The ethical question begins after that fact—not before it.",
        },
      },
      {
        title: "“Public utility” is an analogy, not a legal classification",
        paragraphs: [
          "Hospitals are not one legal type. They can be nonprofit, for-profit, government-owned, critical access, teaching, safety-net, rural emergency, specialty, or part of a larger system. Calling them public-utility-like does not convert them into regulated electric companies or erase those differences.",
          "The analogy points to readiness and dependence. A community does not want emergency capability created only after enough profitable demand appears. It wants the capability available when the car crash, sepsis, stroke, delivery, disaster, or other emergency happens.",
          "Federal policy sometimes recognizes standby cost explicitly. MedPAC reported that rural emergency hospitals received fixed monthly Medicare payments intended to help cover standby costs in addition to payment for services. That model does not apply to every hospital, but it makes the underlying problem visible: readiness itself has value even when a bed, scanner, or team is not occupied every minute.",
        ],
      },
      {
        title: "EMTALA creates a real obligation—and a narrower one than many people assume",
        paragraphs: [
          "CMS explains that Medicare-participating hospitals with emergency services must provide an appropriate medical screening examination when a person requests examination or treatment for a possible emergency medical condition, regardless of ability to pay. If an emergency medical condition exists, the hospital must offer stabilizing treatment within its capability or arrange an appropriate transfer.",
          "That is a major access protection. It is not a universal federal promise that every hospital must provide every requested service, complete all treatment without charge, accept every non-emergency transfer, or erase the resulting bill. The obligation is tied to emergency screening, stabilization, and appropriate transfer under defined conditions.",
          "This qualification matters because overstatement weakens the real argument. The hospital's front door can be legally different from most businesses without the institution becoming financially indifferent or every form of care becoming guaranteed.",
        ],
        callout: {
          label: "Fact-check correction",
          body: "The manuscript's “care before bank balance” idea survives, but only with EMTALA's actual scope. Emergency access protection is not the same thing as universal hospital coverage or free care.",
        },
      },
      {
        title: "One national margin cannot describe every hospital",
        paragraphs: [
          "MedPAC reported that IPPS hospitals' all-payer operating margin reached 6.5 percent in fiscal year 2024. The same federal data show large differences: for-profit hospitals had higher aggregate operating margins than nonprofit hospitals, and metropolitan hospitals had higher margins than hospitals in rural nonmicropolitan areas.",
          "MedPAC also reported a negative aggregate fee-for-service Medicare margin while finding that beneficiaries maintained good access overall and that the median relatively efficient hospital was much closer to break-even on Medicare. These statements can all be true because they answer different questions about payer, hospital group, efficiency, geography, and accounting definition.",
          "The honest conclusion is neither “hospitals are broke” nor “hospitals are swimming in money.” Some institutions have substantial financial strength. Others operate with little room for error. Aggregate financial pressure can be real without validating every lobbying number or every management choice.",
        ],
      },
      {
        title: "Business constraints explain decisions; they do not settle whether those decisions are good",
        paragraphs: [
          "A hospital may protect cash, staffing, high-margin services, bond ratings, and payer contracts because losing financial viability can eventually reduce care. Leaders also choose executive compensation, staffing models, collection practices, service lines, acquisitions, capital projects, and how aggressively to negotiate commercial prices.",
          "GAO found that rising hospital prices contributed to a nearly 50 percent increase in private health-plan spending from 2012 through 2022 and documented persistent concerns about whether public price files were complete and usable. MedPAC continues to recommend site-neutral payment changes for selected services when safe and appropriate. Those findings complicate any story in which hospitals are only passive victims of costs and payment rules.",
          "Market leverage can help an institution finance capacity. It can also raise premiums, employer spending, taxes, and patient costs. A mission statement does not make that tradeoff disappear. The same hospital can be essential to its community and still deserve scrutiny for how it uses bargaining power.",
        ],
        callout: {
          label: "Strongest counterargument",
          body: "“Hospitals are businesses” is an explanation, not an acquittal. Financial survival and public accountability have to be evaluated together.",
        },
      },
      {
        title: "A better argument asks what must remain available and who should finance it",
        paragraphs: [
          "If a community expects trauma response, obstetrics, psychiatric evaluation, intensive care, emergency surgery, or other continuous capability, the cost does not disappear during quiet hours. The funding can come through service payments, higher prices elsewhere, direct public support, tax preference, philanthropy, cross-subsidy, or some combination. Each method moves cost and risk to different people.",
          "That makes “should hospitals make money?” too blunt. Better questions are which capabilities the community needs, what it costs to keep them safely staffed, who benefits, who pays, whether the payment method rewards useful readiness, and what accountability accompanies the money.",
          "For patients and workers, this lens makes hospital behavior more legible without requiring sympathy for every institutional decision. For leaders and policymakers, it prevents “mission” from becoming a substitute for transparent evidence about prices, access, staffing, quality, and use of surplus.",
        ],
      },
    ],
    systemLens: {
      title: "Who pays for readiness?",
      description: "Continuous capability is shared infrastructure, but the financing arrives through fragmented rules and institutions.",
      items: [
        { question: "Who makes the rule?", answer: "Congress, CMS, states, regulators, accreditors, hospital boards, and payers shape different access, safety, payment, and reporting obligations." },
        { question: "Who pays?", answer: "Public programs, commercial plans, employers, patients, taxpayers, donors, and governments finance different pieces at different rates." },
        { question: "Who carries the financial risk?", answer: "Hospitals carry fixed readiness and uncompensated-care risk; payers carry covered-service risk; patients carry cost sharing and noncoverage; communities carry closure or service-loss risk." },
        { question: "Who performs the work?", answer: "Clinical, operational, technical, environmental, security, administrative, and support teams maintain the capability before, during, and after an encounter." },
        { question: "Who absorbs failure?", answer: "Patients can lose access, workers can absorb unsafe strain, hospitals can lose viability, purchasers can face higher prices, and neighboring facilities can inherit displaced demand." },
      ],
    },
    comparisonTable: {
      headers: ["Statement", "What it gets right", "What it misses"],
      rows: [
        ["Hospitals are businesses", "They must obtain revenue, pay expenses, manage capital, and remain solvent", "Illness, emergency duties, public subsidy, and community dependence make the market unusual"],
        ["Hospitals are public infrastructure", "Readiness and local access have value beyond one billable encounter", "Hospitals are not one legal type or universally financed like regulated utilities"],
        ["A positive margin is necessary", "Surplus can support reserves, debt, facilities, workforce, and future care", "It does not prove prices, staffing, collections, acquisitions, or allocation choices are fair"],
        ["A low margin proves underpayment", "Some hospitals and payer categories face genuine shortfalls", "Accounting definitions, efficiency, market power, service mix, geography, and subsidies change the result"],
      ],
    },
    questionsHeading: "Questions that make the contradiction testable",
    questionsToAsk: [
      "Which capability is the hospital being asked to keep continuously available?",
      "Is the cited margin operating, total, payer-specific, service-line, or case-level?",
      "What public support, tax preference, special payment, or commercial pricing helps finance readiness?",
      "What evidence shows the community is receiving access, staffing, quality, or financial-assistance value in return?",
      "Which constraint is externally imposed, and which part is a hospital leadership choice?",
      "Who bears the cost if the service is reduced or the hospital closes?",
    ],
    commonMistakes: [
      "Treating the public-utility comparison as a legal classification.",
      "Describing EMTALA as a guarantee of every kind of free hospital care.",
      "Using one national margin to describe every hospital.",
      "Assuming financial necessity makes every price or management choice reasonable.",
      "Demanding permanent readiness without identifying a sustainable financing mechanism.",
    ],
    takeaway: "Hospitals live inside a contradiction: they must behave like financially viable enterprises while communities depend on them as always-available infrastructure. Understanding that contradiction should produce better questions about readiness, payment, prices, staffing, and accountability—not a simple verdict that hospitals are either villains or charities.",
    sources: [cmsEmtala, medpacHospitals2026, medpacDataBook2026, ahaCosts2026, gaoHospitalPrices],
  },
  {
    slug: "prior-authorization-explained",
    title: "Your Doctor Recommended It. Why That Still Isn’t a Coverage Decision",
    category: "Insurance",
    readTime: "12 min read",
    promise: "A clinical recommendation starts the care plan; coverage can still depend on benefits, criteria, documentation, network, site, timing, and prior authorization.",
    description: "What prior authorization actually decides, why doctor-recommended care may still be pending or denied, which 2026 federal process rules apply, and what to ask next.",
    audience: "Patients, families, healthcare workers, and clinicians trying to understand why a recommended test, drug, procedure, device, post-acute service, or site of care has not yet become approved coverage.",
    summary: "A clinician recommends what they believe is medically appropriate. A health plan makes a separate coverage decision under the benefit, applicable law, contract, medical-necessity criteria, and prior-authorization process. Prior authorization is not the same as the clinical recommendation, and even an authorization is not a guarantee of final payment. The request can be unsubmitted, pending, missing information, approved, redirected, partially approved, or denied. Some CMS-regulated non-drug requests now have federal 2026 decision-time and denial-reason requirements, but the rule does not govern every payer or every drug request. The useful next step is to identify the exact gate, obtain the reference and written reason, and use the plan-specific resubmission, expedited-review, peer-to-peer, or appeal path when appropriate.",
    body: [
      "A doctor's recommendation answers a clinical question. Insurance approval answers a coverage question.",
      "Those questions overlap, but they are not controlled by the same person, evidence, or rules. A recommendation may still need documentation, benefit verification, network alignment, site approval, prior authorization, and final claim processing.",
      "The safest way to navigate a delay is to stop calling everything 'insurance' and identify the exact status, decision-maker, missing information, rule, deadline, and next review path.",
    ],
    publishedAt: "2026-06-01",
    lastReviewedAt: "2026-09-03",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2026-12-03",
    timeSensitive: true,
    updateNote: "Rebuilt on 2026-09-03 as a founder-led, source-backed explanation while preserving the original canonical URL.",
    reviewScope: "Current preauthorization definition, CMS-0057-F payer and service scope, 2026 process requirements, Medicare Advantage utilization management, HHS OIG denial evidence and limitations, payment boundaries, and appeal pathways.",
    author: AUTHOR,
    systemMap: {
      title: "A recommendation has to pass several different gates",
      description: "Not every service requires every step, and emergency rules can differ. The map prevents one unresolved gate from being mistaken for a final clinical verdict.",
      steps: [
        { title: "Clinical recommendation", body: "The treating clinician identifies a test, treatment, medication, device, setting, or service they believe is appropriate for the patient." },
        { title: "Coverage and authorization review", body: "The plan checks benefit terms, exclusions, medical-necessity criteria, prior treatment, documentation, codes, site, provider, network, and any prior-authorization requirement." },
        { title: "Delivery and acceptance", body: "The provider, facility, pharmacy, supplier, or post-acute setting must be able and willing to furnish the exact approved service at the approved time and location." },
        { title: "Claim and patient cost", body: "Eligibility, authorization details, coding, network status, deductible, copay, coinsurance, and final claim processing still affect payment and patient responsibility." },
      ],
    },
    editorialSections: [
      {
        title: "The clinician and the payer are answering different questions",
        paragraphs: [
          "Andrew's manuscript keeps circling a practical contradiction: the person most qualified to recommend care may not control whether the benefit will pay for that care. The physician, advanced-practice clinician, therapist, pharmacist, or other treating professional supplies clinical judgment. The payer applies a separate financial and contractual framework.",
          "That does not mean the payer is practicing bedside medicine or that the clinician controls the benefit. It means the patient is standing between two decisions that use some of the same medical facts for different purposes.",
          "HealthCare.gov defines preauthorization as a plan decision that a service, treatment plan, prescription drug, or durable medical equipment is medically necessary before coverage. It also warns that preauthorization is not a promise the plan will cover the cost. That last sentence is easy to miss and central to the whole mechanism.",
        ],
        callout: {
          label: "Founder observation",
          body: "A clinical order can be clear while the payment path remains unresolved. Calling both things “approved” hides the person or rule that still controls the next step.",
        },
      },
      {
        title: "“Pending” can hide several different failures",
        paragraphs: [
          "A request cannot be reviewed if it was never submitted. A submitted request can wait for records. A plan can ask for a prior test, treatment trial, diagnosis detail, code, site-of-care change, or clinician response. A facility can wait for authorization while the payer believes it is waiting for the facility. The patient may hear only that approval is pending.",
          "The first useful task is status reconciliation: who submitted what, on which date, for which exact service, provider, facility, and date range; what reference number exists; what the plan's system says now; and whether any document or response is missing.",
          "A pending request is not a denial. A request for more information is not an approval. A verbal statement is not necessarily the controlling written decision. Those distinctions determine the next action.",
        ],
      },
      {
        title: "Prior authorization has a legitimate purpose—and a serious failure mode",
        paragraphs: [
          "The strongest case for prior authorization is not that insurers should second-guess every clinician. It is that a payer responsible for a defined pool of money needs a way to check whether a requested service meets coverage and medical-necessity rules, whether a less risky or lower-cost covered alternative should be tried first, and whether the proposed setting is appropriate.",
          "MedPAC describes Medicare Advantage enrollees as accepting networks and utilization-management tools such as prior authorization to evaluate medical necessity before plan coverage. Used well, utilization review can reduce unnecessary or misdirected spending and preserve resources for covered care.",
          "The failure mode is delay or denial that is not well matched to the controlling rules or the patient's facts. HHS OIG physician reviewers found that 13 percent of denied prior-authorization requests in their sample met Medicare coverage rules. The sample covered one week in June 2019 and 15 large Medicare Advantage organizations; it is not a 2026 national denial rate for every plan. It is evidence that erroneous or overly restrictive denials can occur and can impede medically necessary care.",
        ],
        callout: {
          label: "What the evidence changed",
          body: "The defensible thesis is not “prior authorization is always wrong.” It is that a legitimate coverage tool needs timely decisions, transparent reasons, accurate criteria, and a usable correction path because the cost of error can be clinical as well as administrative.",
        },
      },
      {
        title: "The 2026 federal deadlines are important—but not universal",
        paragraphs: [
          "Beginning January 1, 2026, CMS-0057-F requires specified impacted payers to meet process requirements for prior authorization of non-drug items and services. For the decision-time provision, covered payers generally must send decisions within 72 hours for expedited requests and seven calendar days for standard requests. The rule also requires a specific reason for denials and public reporting of certain metrics.",
          "The scope matters. The rule covers defined Medicare Advantage and Medicaid/CHIP payers and programs; the decision-time requirement excludes qualified health plan issuers on the federally facilitated exchanges, and the 2024 final rule's prior-authorization process provisions do not apply to drug requests. Other federal rules, state laws, plan contracts, accreditation standards, or program rules may set different or shorter timelines.",
          "Technology requirements also have a separate schedule. CMS finalized 2027 compliance for the prior-authorization application programming interface while retaining 2026 dates for the specified process improvements. A faster electronic pipe does not itself decide whether the underlying coverage criterion is correct.",
        ],
      },
      {
        title: "Approval still does not answer every payment question",
        paragraphs: [
          "An authorization can be tied to an exact code, quantity, date range, provider, facility, drug, device, or site of care. If the delivered service differs, the authorization expires, eligibility changes, the provider is out of network, or the claim is coded differently, final payment can still change.",
          "Patients may also owe deductible, copay, or coinsurance for an authorized covered service. Authorization answers whether a specified request cleared a plan gate; it does not necessarily quote the final bill.",
          "Before scheduled care, the practical verification is three-part: authorization status, network status, and expected patient cost. In an emergency or when delay could jeopardize health, seeking necessary clinical care and asking about expedited pathways may be more important than waiting for a routine administrative sequence. CAF cannot determine urgency for an individual patient.",
        ],
      },
      {
        title: "A denial should become a document, not a vague message",
        paragraphs: [
          "A useful denial record identifies the exact requested service, the reason, the coverage policy or criterion, the evidence reviewed, the missing information if any, and the deadline and method for the next step. The treating office may be able to submit missing records, correct a code, request peer-to-peer review, explain why an alternative is unsuitable, or file an appeal.",
          "Appeal rights depend on the type of plan and decision. Medicare.gov explains that people can appeal Medicare or plan refusals to cover or pay for a service, item, supply, or drug and that plan materials and written notices control the specific process. Employer plans, Medicaid programs, Marketplace plans, and other commercial coverage use different paths; state insurance departments may also have a role.",
          "The goal is not to make the patient personally litigate medical necessity. It is to give the clinical team, plan, and patient the same factual record so the next reviewer can resolve the actual dispute.",
        ],
      },
    ],
    systemLens: {
      title: "Who controls each part of the decision?",
      description: "A single word—approval—can conceal several separate authorities.",
      items: [
        { question: "Who recommends the care?", answer: "The treating clinician applies professional judgment to the patient's condition, goals, alternatives, benefits, and risks." },
        { question: "Who defines the benefit?", answer: "Law, program rules, the employer or plan sponsor, and the insurance contract determine covered categories, exclusions, cost sharing, and review rights." },
        { question: "Who authorizes coverage?", answer: "The payer or its delegate applies the relevant benefit and medical-necessity criteria to the submitted request." },
        { question: "Who can deliver it?", answer: "A provider, facility, pharmacy, supplier, or post-acute organization must have the capability, capacity, contract, and acceptance needed to furnish the care." },
        { question: "Who absorbs a bad handoff?", answer: "The patient can wait or pay; clinicians and staff can repeat work; a hospital can hold the patient or lose payment; the payer can incur avoidable downstream cost." },
      ],
    },
    example: {
      title: "The recommended scan with three unresolved gates",
      body: "In this hypothetical example, a clinician recommends a non-emergency scan. The ordering office has not yet sent the clinical note, the plan requires authorization at an in-network imaging center, and the scheduled facility is outside the approved network. The recommendation is real, but the request, site, and payment path are not aligned. The next step is not to debate whether the doctor ‘really ordered it’; it is to confirm submission, obtain the plan's status and written requirements, and align the authorized service and site—or use the appropriate expedited or appeal path if delay is unsafe.",
    },
    relatedCalculator: { label: "Prior Authorization Next-Step Guide", href: "/tools/prior-authorization-next-step-guide" },
    numberedSteps: [
      "Write down the exact service, drug, device, setting, provider, facility, and requested timing.",
      "Ask the ordering office whether authorization is required, when it was submitted, and for the reference number.",
      "Ask the plan for the exact status: not received, pending, waiting for information, approved, partially approved, redirected, cancelled, or denied.",
      "If information is missing, identify the exact document, code, prior treatment, or clinician response and who will send it.",
      "If denied, obtain the written reason, policy or criterion, evidence reviewed, and deadline for resubmission, peer-to-peer review, expedited review, or appeal.",
      "Confirm that the approved service, provider, location, date range, and quantity match the actual plan, then separately verify network status and expected patient cost.",
    ],
    questionsHeading: "Questions that identify the real authorization status",
    questionsToAsk: [
      "Was the exact request submitted, and what is the reference number?",
      "Which plan entity or reviewer has the request now?",
      "What is the required decision date under this plan and request type?",
      "Is any clinical note, result, code, prior treatment, or form missing?",
      "Which written coverage policy or criterion is being applied?",
      "Does delay qualify for expedited review based on the treating clinician's judgment and the plan's rules?",
      "What resubmission, peer-to-peer, internal appeal, external review, or program-specific appeal route applies?",
      "If approved, which service, provider, facility, date range, and quantity does the authorization actually cover?",
    ],
    commonMistakes: [
      "Assuming a clinician's order is also a coverage approval.",
      "Assuming the plan is reviewing a request before confirming it was submitted.",
      "Treating every pending or missing-information request as a final denial.",
      "Quoting the 72-hour or seven-day CMS timeframes as if they govern every payer and every drug request.",
      "Assuming authorization guarantees network status, zero patient cost, or final claim payment.",
      "Appealing a vague verbal message without obtaining the written reason and controlling instructions.",
    ],
    takeaway: "A clinical recommendation and a coverage decision are different steps. Name the exact gate, reconcile the submitted request with the plan's record, insist on a specific written reason when coverage is denied, and use the plan- and program-specific review path rather than treating “insurance said no” as the end of the explanation.",
    sources: [healthcareGovPreauthorization, cmsPriorAuthorizationRule, federalPriorAuthorizationRule, oigPriorAuthorization, medpacMedicareAdvantage2026, medicareAppeals],
  },
  {
    slug: "hospital-profitable-unprofitable-service",
    title: "How a Hospital Can Be Profitable Overall and Still Lose Money on a Service",
    category: "Hospital Economics",
    readTime: "11 min read",
    promise: "Overall margin, payer margin, service-line economics, and the result of one patient stay are different calculations—and they can point in opposite directions.",
    description: "Why a profitable hospital can still report losses for a payer, service line, or patient stay, how Medicare prospective payment works, and why cross-subsidy is not automatic.",
    audience: "Patients, healthcare workers, journalists, and policy-minded readers trying to interpret claims that a hospital, payer category, service, or individual stay made or lost money.",
    summary: "A hospital's overall margin combines many patients, services, payers, subsidies, and expenses. It does not reveal whether one service line or one stay was profitable. Medicare generally pays acute inpatient facility services prospectively using an MS-DRG-adjusted base payment plus applicable adjustments rather than reimbursing every routine item at its actual cost. A case that costs less than payment contributes positively; a case that costs more can lose money, subject to adjustments such as outlier payment. Hospitals may use strength in one part of the portfolio to support another, but public accounting cannot prove that every profitable service cross-subsidizes every essential one. Cost allocation, contract variation, market power, management choices, and hospital-specific circumstances matter.",
    body: [
      "Hospital profitability is not one number.",
      "The institution can report a positive overall operating margin while a payer category, service line, or individual stay produces a shortfall. The reverse can also occur. Each calculation uses a different numerator, denominator, boundary, and allocation of shared cost.",
      "Understanding those layers explains why hospitals pay close attention to payer mix and service mix without turning every claim of underpayment or cross-subsidy into a fact.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: PUBLISHED_AT,
    nextReviewAt: "2027-03-03",
    reviewScope: "Current Medicare IPPS mechanics and adjustments, 2024 hospital margin evidence, HCRIS cost-report scope and limitations, hospital price transparency, service-line profitability research, and the limits of cross-subsidy claims.",
    author: AUTHOR,
    systemMap: {
      title: "One hospital contains several financial ledgers",
      description: "These are analytic layers, not necessarily separate published books. Moving between them without changing the label creates misleading conclusions.",
      steps: [
        { title: "Case result", body: "Compare payment attributable to one encounter with the direct and allocated resources attributed to that encounter." },
        { title: "Service-line result", body: "Combine many cases and shared resources within a clinical or operational line such as emergency, medicine, surgery, obstetrics, or behavioral health." },
        { title: "Payer result", body: "Combine services for Medicare, Medicaid, commercial plans, uninsured patients, or another payer grouping under different payment rules." },
        { title: "Hospital result", body: "Combine patient-service revenue, subsidies, and operating expenses; a total margin can also include investment and donation income that operating margin excludes." },
      ],
    },
    editorialSections: [
      {
        title: "The founder's fixed-payment example needed one important correction",
        paragraphs: [
          "Andrew's draft uses a simple example: if a hospital receives a set amount for a stay, spending less than that amount can produce margin and spending more can produce a loss. The underlying insight is sound. The original wording made the payment sound like a single price privately agreed between every insurer and hospital.",
          "For many acute inpatient fee-for-service Medicare stays, the facility payment instead begins with a federally administered prospective-payment formula. CMS assigns the case to a Medicare Severity Diagnosis Related Group based on documented diagnoses, procedures, complicating conditions, age, sex, and discharge status. A relative weight is applied to a base rate, with hospital- and case-specific adjustments.",
          "Commercial insurers, Medicare Advantage plans, Medicaid programs, and special hospital types can use different payment methods. A case-rate example is therefore a teaching model, not a universal description of every hospital contract.",
        ],
        callout: {
          label: "Founder insight, professionally corrected",
          body: "The payment and the cost of care are separate numbers. The same payment method can produce a positive result on one case and a shortfall on another because the patient's needs and the hospital's resource use are not identical.",
        },
      },
      {
        title: "Medicare prospective payment is fixed in advance—but not flat",
        paragraphs: [
          "Under the inpatient prospective payment system, CMS multiplies an adjusted base rate by the case's MS-DRG relative weight. The base rate can be adjusted for local wages. Qualifying hospitals can receive additional disproportionate-share or teaching payments, and hospitals may receive additional payment for qualifying unusually costly outlier cases.",
          "That means two stays that sound similar in ordinary language may not receive the same payment, and two stays in the same MS-DRG may still cost the hospital different amounts. Length of stay, staffing intensity, complications, drugs, implants, tests, specialist involvement, and discharge barriers can change resource use even when routine items are bundled into the prospective payment.",
          "Prospective payment intentionally creates an efficiency incentive: if the hospital can deliver safe, appropriate care for less than the payment, it retains the difference; if ordinary costs exceed payment, the hospital bears the shortfall unless another adjustment applies. That incentive is one reason length of stay and documentation matter, but it does not mean every additional day is avoidable or every lower-cost stay is better.",
        ],
      },
      {
        title: "The national numbers show why the level of analysis matters",
        paragraphs: [
          "MedPAC's July 2026 Data Book reported that IPPS hospitals had a 6.5 percent all-payer operating margin in fiscal year 2024. In the same dataset, the aggregate fee-for-service Medicare margin was substantially negative. Those figures do not cancel each other out. One combines operating revenue from all payers and sources; the other isolates an analytically constructed Medicare result.",
          "Variation within each aggregate was also substantial. For-profit, nonprofit, metropolitan, and rural hospital groups had different results. The median hospital and aggregate hospital sector are not interchangeable, and a national payer margin cannot prove what happened at a specific institution or service.",
          "The important lesson is grammatical as much as financial: whenever someone says “the hospital lost money,” ask which hospital, which period, which payer, which service, which accounting definition, and whether investment income or public support is included.",
        ],
      },
      {
        title: "Service-line profit is partly an allocation decision",
        paragraphs: [
          "A hospital shares buildings, nursing administration, pharmacy systems, information technology, laboratories, environmental services, security, finance, human resources, and other infrastructure across many services. To calculate service-line or case cost, some of those shared expenses have to be allocated.",
          "CMS cost reports contain costs and charges by cost center, Medicare settlement data, utilization, facility characteristics, and financial-statement information. They are invaluable for national and hospital-level analysis. CMS also warns that derived conclusions from HCRIS should not be attributed to CMS, and the public data do not reproduce every internal managerial-accounting decision.",
          "A service can look different under contribution margin, which focuses on revenue minus costs that change with volume, and fully allocated margin, which also assigns a share of overhead. Neither measure is automatically dishonest. They answer different management questions. Trouble begins when the measure is not named or a shared-cost allocation is presented as a directly observed fact.",
        ],
      },
      {
        title: "Cross-subsidy can happen, but it is not a moral receipt",
        paragraphs: [
          "Hospitals can use strength in one service, payer group, investment portfolio, subsidy, or geographic market to support weaker parts of the organization. Research by David and colleagues found that general hospitals most exposed to new cardiac specialty-hospital competition reduced services the study classified as unprofitable and expanded a service considered profitable. That supports the plausibility of cross-subsidy across services.",
          "The study used hospitals in Arizona and Colorado and older data around a specific market shock. It does not prove that every hospital today cross-subsidizes the same services, that every high commercial price funds access, or that extra margin is always directed to bedside capacity.",
          "The stronger conclusion is conditional: a financially strong portfolio can create room to support a weak service, and losing a profitable source can change what the hospital is willing or able to maintain. Whether the subsidy actually occurs is an empirical governance question.",
        ],
        callout: {
          label: "Strongest counterargument",
          body: "A hospital can cite an unprofitable service while choosing not to support it, and it can invoke cross-subsidy without showing where surplus went. Financial possibility is not proof of community benefit.",
        },
      },
      {
        title: "Why the distinction changes real decisions",
        paragraphs: [
          "Service economics can influence which programs a hospital expands, markets, reduces, subsidizes, or closes; which clinicians it recruits; how much capacity it staffs; and where it seeks higher payment. A service can be clinically important and financially unattractive. Another can be profitable and still deliver real value.",
          "The risk is allowing profitability to become a substitute for clinical and community priorities. The opposite risk is pretending finances are irrelevant until a service disappears. Good governance makes the tradeoff visible: what the service contributes, what it costs under more than one measure, who relies on it, what alternative exists, and what source of support is being used.",
          "For patients, this explains why a hospital's impressive annual result does not make every bill fictitious and why a claim of service-line loss does not settle whether the price is fair. For workers, it explains why one busy unit can still face budget pressure. For journalists and policymakers, it is a warning to match the conclusion to the accounting level.",
        ],
      },
    ],
    systemLens: {
      title: "Where can the surplus or shortfall go?",
      description: "A financial result at one layer can be offset, allocated, or retained elsewhere; the path should be demonstrated rather than assumed.",
      items: [
        { question: "Who sets payment?", answer: "CMS and legislatures set public-program frameworks; states administer Medicaid within federal rules; commercial contracts and plan designs set other terms." },
        { question: "Who assigns cost?", answer: "Hospital accounting systems assign direct and shared expenses using defined methods; public cost reports apply standardized reporting instructions." },
        { question: "Who chooses the portfolio?", answer: "Hospital boards and leaders decide which services, facilities, staffing models, partnerships, and investments the organization will maintain within legal and contractual constraints." },
        { question: "Who can cross-subsidize?", answer: "A hospital or system with positive contribution elsewhere may have room to support a weaker service, but the amount and destination require hospital-specific evidence." },
        { question: "Who absorbs a shortfall?", answer: "The hospital can accept lower margin, seek higher payment or subsidy, reduce other spending, change the service, shift work, merge, or close; patients, workers, purchasers, and communities can each bear consequences." },
      ],
    },
    example: {
      title: "Two hypothetical stays under one prospective-payment category",
      body: "Assume two cases at the same hospital receive the same simplified $18,000 prospective facility payment after applicable ordinary adjustments. One patient uses an estimated $13,000 in direct and allocated resources; the other uses $24,000 after a longer, more complex course. The first contributes $5,000 and the second falls short by $6,000 under this simplified accounting. A real claim could have a different MS-DRG, wage or hospital adjustment, transfer policy, new-technology payment, or qualifying outlier payment. The example shows why payment and cost can diverge; it does not reproduce a real contract or patient bill.",
    },
    comparisonTable: {
      headers: ["Financial layer", "Question it answers", "What it cannot prove alone"],
      rows: [
        ["Case", "Did attributed payment exceed attributed cost for this encounter?", "Whether the service line or hospital is financially strong"],
        ["Service line", "Did a defined clinical or operational portfolio cover its direct or allocated costs?", "Whether every case or payer inside the line was profitable"],
        ["Payer", "How did attributed revenue from one payer group compare with attributed costs?", "What happened at every hospital or whether another payer literally funded the gap"],
        ["Hospital operating margin", "Did operating revenue exceed operating expense for the organization and period?", "Whether investments, donations, one service, or one patient drove the total"],
      ],
    },
    questionsHeading: "Questions to ask whenever someone cites hospital profit or loss",
    questionsToAsk: [
      "Is the number case-level, service-line, payer-specific, hospital-wide, or system-wide?",
      "Is it operating margin, total margin, contribution margin, or fully allocated margin?",
      "Which time period, hospitals, and patient population are included?",
      "Which direct and shared costs are assigned, and by what method?",
      "Are public subsidies, supplemental payments, investment income, donations, or tax effects included?",
      "What evidence shows a profitable area actually supports the service being discussed?",
      "What access, quality, workforce, and patient-cost consequences follow from the financial decision?",
    ],
    commonMistakes: [
      "Treating an overall hospital margin as the result for every service or stay.",
      "Assuming all insurers use Medicare's MS-DRG payment method.",
      "Treating a prospective payment as a reimbursement of the hospital's exact cost.",
      "Ignoring outlier and hospital-specific adjustments when explaining Medicare IPPS.",
      "Presenting allocated service-line cost as if it were entirely direct and observable.",
      "Assuming a potential cross-subsidy proves where the hospital actually spent its surplus.",
    ],
    takeaway: "Hospital profitability depends on the level being measured. An institution can be profitable overall while a payer, service, or stay loses money, but that fact neither validates every price nor proves every surplus funds essential care. Name the accounting layer, payment method, allocation rules, and demonstrated use of the money before drawing the conclusion.",
    sources: [medpacDataBook2026, medpacHospitals2026, cmsIpps, cmsIppsGuide, cmsCostReports, crossSubsidyResearch, gaoHospitalPrices],
  },
];
