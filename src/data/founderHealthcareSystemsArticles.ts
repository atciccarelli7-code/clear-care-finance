import type { Article } from "./articles";
import type { Source } from "./sources";

const AUTHOR = "Andrew Ciccarelli, BSN, RN";
const PUBLISHED_AT = "2026-08-30";

const cmsEmtala: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Emergency Medical Treatment & Labor Act (EMTALA)",
  url: "https://www.cms.gov/medicare/regulations-guidance/legislation/emergency-medical-treatment-labor-act",
  note: "Official federal explanation of hospital emergency-screening, stabilizing-treatment, and appropriate-transfer obligations regardless of ability to pay.",
};

const ahrqEmergencyDepartment: Source = {
  name: "Agency for Healthcare Research and Quality",
  pageTitle: "Emergency Department",
  url: "https://www.ahrq.gov/topics/emergency-department.html",
  note: "Federal research hub linking the 2025 AHRQ technical report on emergency-department boarding and related patient-safety evidence.",
};

const ahrqBoardingFindings: Source = {
  name: "Agency for Healthcare Research and Quality",
  pageTitle: "AHRQ Report Identifies Strategies To Reduce Emergency Department Boarding",
  url: "https://www.ahrq.gov/news/newsletters/e-newsletter/951.html",
  note: "Official summary defining boarding and explaining that its causes and solutions often sit at hospital and health-system level rather than inside the emergency department alone.",
};

const federalDischargePlanning: Source = {
  name: "Electronic Code of Federal Regulations",
  pageTitle: "42 CFR 482.43 — Condition of participation: Discharge planning",
  url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
  note: "Current federal hospital discharge-planning requirements covering patient goals, caregiver participation, post-hospital needs, service availability, access, and plan updates.",
};

const medpacHospitalCapacity: Source = {
  name: "Medicare Payment Advisory Commission",
  pageTitle: "Hospital inpatient and outpatient services — March 2026 Report to Congress",
  url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch3_MedPAC_Report_To_Congress_SEC.pdf",
  note: "Primary federal analysis of 2024 hospital capacity, occupancy variation, access, margins, Medicare payment, costs, quality, and capital conditions.",
};

const blsUnpaidEldercare: Source = {
  name: "U.S. Bureau of Labor Statistics",
  pageTitle: "Unpaid Eldercare in the United States — 2023–2024",
  url: "https://www.bls.gov/news.release/pdf/elcare.pdf",
  note: "Current American Time Use Survey estimates for the number of unpaid eldercare providers, frequency and duration of care, work status, and the activities that care includes.",
};

const ahrqIdealDischarge: Source = {
  name: "Agency for Healthcare Research and Quality",
  pageTitle: "IDEAL Discharge Planning: Care Transitions From Hospital to Home",
  url: "https://www.ahrq.gov/patient-safety/patients-families/engagingfamilies/strategy4/index.html",
  note: "Federal patient-safety framework for treating patients and families as discharge-planning partners and making life at home, medicines, warning signs, results, and follow-up explicit.",
};

const medicareHomeHealth: Source = {
  name: "Medicare.gov",
  pageTitle: "Home health services",
  url: "https://www.medicare.gov/coverage/home-health-services",
  note: "Official coverage boundaries for intermittent skilled home health, aide care, 24-hour care, meals, homemaker services, and custodial or personal care.",
};

const aclFamilyCaregiverSupport: Source = {
  name: "Administration for Community Living",
  pageTitle: "National Family Caregiver Support Program",
  url: "https://acl.gov/programs/support-caregivers/national-family-caregiver-support-program",
  note: "Current federal overview of information, training, respite, counseling, and supplemental supports available through state and local caregiver programs.",
};

const dolFamilyCaregiverLeave: Source = {
  name: "U.S. Department of Labor",
  pageTitle: "Information on the Family and Medical Leave Act for family caregivers",
  url: "https://www.dol.gov/agencies/whd/fmla/family-caregiver",
  note: "Official explanation of qualifying family-caregiver leave, including the eligibility and relationship limits on federal job-protected leave.",
};

export const FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES: Article[] = [
  {
    slug: "why-hospitals-become-the-systems-shock-absorber",
    title: "Why the Hospital Becomes the System’s Shock Absorber",
    category: "Hospital Economics",
    readTime: "11 min read",
    promise: "When another part of the care system cannot absorb a problem, the hospital often inherits the visible consequence—even when it did not create the original failure.",
    description: "Why hospitals absorb failures in access, behavioral health, post-acute care, transportation, coverage, and caregiving—and where the hospital still owns the bottleneck.",
    audience: "Patients, families, healthcare workers, and policy-minded readers trying to understand why emergency departments board patients and why medically finished care can remain operationally stuck.",
    summary: "Hospitals function as a shock absorber because their emergency departments must screen and stabilize emergencies, their staffed beds hold patients who cannot yet move to the next safe setting, and the next service may be unavailable, unwilling, unaffordable, out of network, or still awaiting authorization. The hospital did not necessarily create the original access failure, but it often contains the consequence. That does not excuse poor internal flow: staffing, bed management, discharge practice, and hospital decisions can also create or worsen the bottleneck.",
    body: [
      "The hospital is where many failures elsewhere in healthcare become visible at the same time.",
      "A patient may arrive through an emergency department because primary care was unavailable, behavioral-health capacity was scarce, home support collapsed, or a chronic problem became acute. After treatment, the hospital may remain responsible while a safe next setting, service, payer decision, transport plan, or caregiver plan is unresolved.",
      "Calling the hospital a shock absorber is an interpretation, not a claim that hospitals are blameless. It is a way to trace where unresolved risk and work land—and to ask which part of the system could have absorbed them earlier or more safely.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-30",
    nextReviewAt: "2027-02-28",
    reviewScope: "EMTALA access obligations, 2025 AHRQ emergency-department boarding findings, current federal discharge-planning requirements, and 2024 MedPAC capacity evidence.",
    author: AUTHOR,
    systemMap: {
      title: "How a problem moves until somebody can hold it",
      description: "The exact chain differs by patient and community. This map shows why the hospital often contains the consequence of a failure that began somewhere else.",
      steps: [
        { title: "A need outruns the available alternative", body: "Primary care, behavioral-health treatment, home support, transportation, post-acute capacity, coverage, or another service may be unavailable or too slow for the problem in front of the person." },
        { title: "The hospital evaluates and stabilizes", body: "The emergency department has distinct federal screening and stabilization obligations, and the hospital can supply around-the-clock clinical capability that most settings do not maintain." },
        { title: "The next handoff must actually work", body: "A discharge destination still needs clinical fit, access, staff, equipment, payer alignment, transport, and a plan the patient or caregiver can carry out." },
        { title: "Until the handoff works, the burden stays somewhere", body: "The patient may wait in an emergency or inpatient bed; the family may absorb the work at home; or another organization may accept the clinical and financial risk." },
      ],
    },
    editorialSections: [
      {
        title: "The hospital is where unresolved problems become visible",
        paragraphs: [
          "Andrew's manuscript keeps returning to the same bedside observation: the acute hospital is asked to contain problems that do not fit neatly inside acute medicine. A person can need housing stability, dementia supervision, psychiatric placement, dialysis transportation, medication access, a skilled facility, oxygen, or a caregiver who is physically able to help. The hospital may diagnose and treat the acute illness without being able to manufacture those missing resources.",
          "That is the sense in which the hospital acts as a shock absorber. The original shock may begin in outpatient access, insurance design, the labor market, long-term care, behavioral health, transportation, or the limits of a household. The hospital becomes the place where the consequence can no longer remain hidden.",
          "This is a system interpretation grounded in clinical and operational experience. It is not a claim that every emergency visit was preventable, every delay came from outside the hospital, or every hospital handled the problem well.",
        ],
        callout: {
          label: "Founder observation",
          body: "The institution holding the problem is often mistaken for the institution that created the whole problem. Sometimes those are the same organization. Often they are not.",
        },
      },
      {
        title: "The emergency department has a different front-door obligation",
        paragraphs: [
          "Under EMTALA, Medicare-participating hospitals that offer emergency services must provide an appropriate medical screening examination when a person requests examination or treatment for a possible emergency medical condition, regardless of ability to pay. If an emergency medical condition is found, the hospital must provide stabilizing treatment within its capability or arrange an appropriate transfer.",
          "That obligation does not make the emergency department a substitute for primary care, housing, long-term services, outpatient psychiatry, or a functioning post-acute network. It does make the hospital one of the few places required to receive and evaluate a crisis before the payment question is resolved.",
          "The result is a mismatch: the front door is comparatively open, while the doors needed for the next step may depend on capacity, eligibility, contracts, staffing, authorization, geography, and the ability of another organization to accept risk.",
        ],
      },
      {
        title: "Emergency-department boarding is usually an output problem",
        paragraphs: [
          "AHRQ defines emergency-department boarding as the period after a decision to admit when no appropriate inpatient bed is available and the patient remains in the emergency department. Its 2025 summit report treated boarding as a hospital- and health-system-level problem, not something the emergency department can solve by simply working faster.",
          "When an admitted patient occupies an emergency bay, that room and its staff are less available for the next ambulance or walk-in emergency. AHRQ's report links boarding with serious patient, workforce, cost, and public-safety consequences. The important mechanism is flow: a blocked exit from one level of care can reach backward to people who have not entered it yet.",
          "National averages can hide this. MedPAC reported an aggregate hospital occupancy rate of 71 percent for fiscal year 2024, alongside wide variation across hospitals; its count also does not establish whether a particular bed was staffed or appropriate for a particular patient. A telemetry bed, psychiatric bed, pediatric bed, intensive-care bed, and ordinary licensed bed are not interchangeable at 2 a.m.",
        ],
        callout: {
          label: "What the evidence changed",
          body: "The manuscript's 'hospital absorbs the failure' idea is strongest when framed as a flow and risk-transfer mechanism—not as proof that every crowded emergency department was caused by too few licensed beds.",
        },
      },
      {
        title: "A patient can be medically ready while the transition is not ready",
        paragraphs: [
          "Acute-care need and discharge readiness overlap, but they are not identical. A patient may no longer need hospital-level treatment while still needing a service, setting, device, medication, ride, or amount of help that has not been secured.",
          "Federal hospital discharge-planning rules require an effective process that includes the patient and caregivers or support people as active partners. For patients who need a discharge-planning evaluation, the hospital must evaluate likely post-hospital services and determine the availability of and access to appropriate services. The rule requires a real planning process; it cannot create a staffed facility bed, make an insurer authorize care, or make an unwilling or unable relative into a safe caregiver.",
          "This is why 'discharge order written' and 'handoff complete' should not be treated as the same event. The useful questions are which acute need remains, which transition barrier remains, who controls it, and what safe alternative exists if the preferred plan cannot happen.",
        ],
      },
      {
        title: "Readiness is expensive even when no dramatic procedure is happening",
        paragraphs: [
          "Hospitals maintain labor, pharmacy, imaging, laboratories, security, utilities, environmental services, equipment, blood, supplies, and on-call clinical capability around the clock. Much of that cost exists so the institution can respond before it knows which patient or payer will arrive.",
          "Payment does not arrive as one clean reimbursement for 'being the community shock absorber.' Medicare, Medicaid, commercial insurers, patient payments, public subsidies, grants, and other revenue streams apply different rules. Some services and patients generate positive contribution; others do not. The hospital still has to decide which capacity to maintain and how much financial risk it can carry.",
          "That tension explains behavior; it does not justify every decision. A hospital can rationally protect capacity and still make a poor staffing choice. It can provide a socially essential service and still deserve scrutiny about prices, executive priorities, debt collection, capital projects, and whether savings are reaching patients and workers.",
        ],
      },
      {
        title: "The strongest counterargument: sometimes the hospital owns the bottleneck",
        paragraphs: [
          "It would be too convenient to blame every delay on insurers, nursing homes, government, or families. Hospitals choose staffing models, operating-room schedules, discharge routines, weekend coverage, bed-management practices, capital allocation, transfer relationships, and which service lines to maintain. Weak internal coordination can keep a medically ready patient in a bed or an admitted patient in the emergency department.",
          "AHRQ's framing supports this challenge: boarding requires organization-wide and system-level solutions. Calling the hospital a shock absorber should widen accountability, not erase the hospital's part of it.",
          "The fair conclusion is conditional. Sometimes the hospital is absorbing a failure created elsewhere. Sometimes it is amplifying that failure. Often both are true at once.",
        ],
      },
      {
        title: "What patients, families, and healthcare workers can ask",
        paragraphs: [
          "When care feels stuck, replace the vague word 'system' with named actors. Is the unresolved step medical, operational, financial, contractual, or logistical? Is the patient waiting for a physician decision, a staffed bed, a facility acceptance, an insurance authorization, equipment, transport, or a caregiver plan? Who owns the next action, and when will it be revisited?",
          "For healthcare workers, the same questions can separate a unit-level symptom from its upstream cause. For patients and families, they create a usable picture without requiring them to solve institutional capacity themselves.",
          "CAF cannot decide whether a patient should be admitted, transferred, or discharged. The treating team, hospital process, receiving organization, payer rules, and applicable rights control the individual decision. The value of the shock-absorber lens is seeing where the work and risk actually landed.",
        ],
        keyPoints: [
          "What exact step is unresolved?",
          "Who has authority to resolve it?",
          "Is the problem lack of clinical fit, staffed capacity, coverage, authorization, transport, or home support?",
          "What is the safe backup if the preferred route remains unavailable?",
          "What part of this delay can the hospital change directly?",
        ],
      },
    ],
    systemLens: {
      title: "Who owns a problem that crosses organizational lines?",
      description: "The same delay can involve a different rule-maker, payer, risk-holder, worker, and person absorbing the failure.",
      items: [
        { question: "Who makes the rule?", answer: "Congress, CMS, state regulators, health plans, hospitals, professional standards, and receiving organizations may each control a different gate." },
        { question: "Who pays?", answer: "Medicare, Medicaid, commercial plans, public programs, hospitals, patients, and families can finance different slices; no single payer necessarily funds the whole transition." },
        { question: "Who carries the financial risk?", answer: "Hospitals carry readiness and delay costs; payers carry covered-service risk; receiving providers carry acceptance and payment risk; patients carry cost-sharing and noncoverage risk." },
        { question: "Who performs the work?", answer: "Emergency and inpatient teams, case managers, payer reviewers, post-acute staff, transport services, patients, and families perform separate parts of the handoff." },
        { question: "Who absorbs the consequence?", answer: "The waiting patient, the next person boarding in the emergency department, bedside staff, the hospital, and the family can all absorb a failure that began elsewhere." },
      ],
    },
    relatedCalculator: { label: "Hospital-to-Home Coverage Navigator", href: "/insurance/hospital-discharge-coverage" },
    questionsHeading: "Questions that identify the real bottleneck",
    questionsToAsk: [
      "What exact clinical or operational milestone is still open?",
      "Which person or organization controls the next decision?",
      "Has the receiving service accepted the patient, or is it only a referral?",
      "Is coverage approved, denied, or still pending—and what written notice applies?",
      "What safe alternative is available if the preferred plan cannot happen?",
      "Which part of the delay is inside the hospital's direct control?",
    ],
    commonMistakes: [
      "Blaming the emergency department for every boarding delay.",
      "Assuming a licensed or empty room is a staffed, appropriate bed.",
      "Treating 'medically ready' as proof that every transition resource is ready.",
      "Using the shock-absorber idea to excuse poor hospital flow, staffing, or discharge practice.",
      "Assuming one payer, provider, or family member controls the entire handoff.",
    ],
    takeaway: "The hospital often contains problems that began elsewhere because it has an open emergency front door, staffed clinical capability, and responsibility until a safe handoff works. Understanding that mechanism should widen accountability—not turn the hospital into either a villain or an innocent bystander.",
    sources: [cmsEmtala, ahrqEmergencyDepartment, ahrqBoardingFindings, federalDischargePlanning, medpacHospitalCapacity],
  },
  {
    slug: "home-with-family-is-not-a-free-care-plan",
    title: "“Home With Family” Is Not a Free Care Plan",
    category: "Patients & Caregivers",
    readTime: "11 min read",
    promise: "A discharge home can move medication, transportation, monitoring, daily care, coordination, and financial risk outside the hospital; the work does not disappear.",
    description: "What 'home with family' can require after discharge, what Medicare home health does not replace, and how to make the hidden caregiver plan explicit.",
    audience: "Patients, relatives, friends, healthcare workers, and discharge teams trying to turn a vague home plan into specific tasks, limits, coverage questions, and backup support.",
    summary: "Home with family can be the safest and most humane plan, but it is not automatically a staffed or cost-free plan. Families may absorb medication management, meals, transportation, mobility help, appointments, monitoring, insurance calls, supervision, and the risk of missing work. Medicare home health can cover qualifying intermittent skilled services, but it does not pay for round-the-clock care, meal delivery, unrelated homemaker work, or personal care when that is the only need. A sound discharge plan names the work, confirms who can safely do it, separates covered services from unpaid care, and creates a backup when family capacity is limited.",
    body: [
      "'Home with family' sounds like a destination. Operationally, it can be a care model.",
      "The hospital may stop providing the room, nursing presence, meals, medication administration, mobility help, monitoring, transportation coordination, and around-the-clock backup. Some of that work moves to agencies or outpatient clinicians. Much of it may move to the patient and family.",
      "That transfer can be appropriate and wanted. The mistake is treating willingness, time, physical ability, training, job flexibility, transportation, and money as if they appear automatically when the discharge destination says home.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-30",
    rulesEffectiveAt: "2026-08-30",
    nextReviewAt: "2026-11-30",
    timeSensitive: true,
    reviewScope: "2023–2024 BLS unpaid eldercare data, current federal discharge-planning requirements, AHRQ patient-family transition guidance, Medicare home-health limits, caregiver support, and FMLA boundaries.",
    author: AUTHOR,
    systemMap: {
      title: "Where the work goes when the destination is home",
      description: "Discharge changes the setting and the staffing model. It does not erase the tasks needed to keep the plan working.",
      steps: [
        { title: "The acute hospital job ends", body: "The treating team decides hospital-level treatment or monitoring is no longer required and writes the next plan." },
        { title: "Paid services cover selected pieces", body: "Home health, therapy, equipment suppliers, pharmacies, outpatient clinicians, transportation, or paid aides may handle specific tasks if ordered, available, and covered or purchased." },
        { title: "The remaining work moves to the household", body: "Medication routines, meals, rides, supervision, mobility help, scheduling, warning-sign monitoring, and insurance follow-up may become patient or caregiver work." },
        { title: "Any gap becomes risk", body: "If no willing and capable person or service owns a task, the plan can fail through missed medicines, falls, delayed follow-up, caregiver injury, unpaid bills, or a return to acute care." },
      ],
    },
    editorialSections: [
      {
        title: "A destination is not the same as a staffing plan",
        paragraphs: [
          "Andrew's care-transition notes return to a phrase that sounds reassuring in a chart or handoff: home with family. The phrase can hide the central operational question—what, exactly, is the family being asked to do?",
          "At home, the work may include obtaining medicines, understanding a changed medication list, preparing meals, helping with toileting or bathing, managing stairs, arranging rides, watching for warning signs, scheduling follow-up, handling equipment, calling an insurer, supervising dementia, and staying available when something changes. Not every discharge includes all of this, and a general article cannot tell a particular family which clinical tasks are safe for it to perform.",
          "The point is not to turn normal family help into a pathology. It is to stop treating the household as an invisible pool of unlimited labor.",
        ],
        callout: {
          label: "Founder observation",
          body: "When a plan says 'family can help,' the next sentence should identify the task, the time, the training, the physical demand, the cost, and the backup—not merely the relationship.",
        },
      },
      {
        title: "Unpaid does not mean costless",
        paragraphs: [
          "The Bureau of Labor Statistics estimated that 38.2 million people age 15 and older provided unpaid eldercare in 2023–2024. On a given day, 28 percent of those eldercare providers performed care and spent an average of 3.9 hours doing it. More than half provided care at least several times a week, and one quarter provided it daily.",
          "That dataset has an important boundary: it covers unpaid care for someone age 65 or older who needs help because of a condition related to aging. It does not measure every kind of family caregiving or prove how much work followed a hospital discharge. It does show that unpaid care is a large, recurring labor system—not a rare favor.",
          "Among employed eldercare providers who performed care on an average day, BLS measured 2.8 hours of eldercare. Time is only one cost. Care can also require travel, missed shifts, equipment, home changes, food, paid backup, physical labor, emotional attention, and financial administration.",
        ],
      },
      {
        title: "Medicare home health is not round-the-clock replacement care",
        paragraphs: [
          "For people who meet the requirements, Medicare can cover medically necessary part-time or intermittent skilled nursing, therapy, medical social services, supplies, and certain part-time or intermittent aide care tied to concurrent skilled services. That can be consequential support.",
          "Medicare.gov also states what the benefit does not pay for: 24-hour-a-day care at home, home meal delivery, homemaker services unrelated to the care plan, or custodial or personal care such as bathing and dressing when that is the only care needed. Medicare Advantage coverage and cost details should be checked with the plan.",
          "This is where a common misunderstanding begins. A person can qualify for a nurse or therapist visit and still need help during the many hours when no professional is in the home. 'Home health ordered' does not answer who handles meals, nighttime supervision, toileting, transportation, or the next fall risk.",
        ],
        callout: {
          label: "Coverage boundary",
          body: "A covered visit is not the same thing as continuous presence. Ask what the agency will do, how often it will come, when service will begin, and who owns the work between visits.",
        },
      },
      {
        title: "Federal rules require planning, but rules cannot manufacture capacity",
        paragraphs: [
          "Federal hospital conditions of participation require discharge planning to focus on the patient's goals and preferences and include caregivers or support people as active partners. When a discharge-planning evaluation is required, it must consider likely post-hospital services and determine the availability of and access to appropriate services.",
          "AHRQ's IDEAL discharge framework similarly tells hospitals to include the patient and family as full partners, describe what life at home will be like, review medicines, discuss warning signs, explain results, arrange follow-up, use plain language, and listen to the family's concerns.",
          "Those requirements matter, but neither a regulation nor a checklist creates a home health opening, accessible transportation, paid leave, a safe apartment, a trained caregiver, or money for uncovered help. A plan can meet a documentation requirement and still fail in practice if the assumed work has no realistic owner.",
        ],
      },
      {
        title: "A relative is not automatically available, willing, or able",
        paragraphs: [
          "Relationship does not establish capacity. A spouse may have a disability. An adult child may live two hours away, work nights, lack paid leave, care for children, or be physically unable to transfer another adult. A friend may be willing to check in but unable to provide personal care. The patient may prefer privacy or may not want a particular relative involved.",
          "Some eligible employees can use federal FMLA leave to care for a spouse, child, or parent with a serious health condition. Eligibility, employer coverage, family relationship, certification, and other requirements apply, and FMLA generally provides job protection rather than a new source of pay. State programs or employer policies may be broader.",
          "The practical planning unit is therefore not 'family.' It is a named person who has agreed to a named task, understands it, can perform it safely, and has a backup. If that person does not exist, the gap should be visible before discharge rather than discovered at home.",
        ],
      },
      {
        title: "The strongest counterargument: home with family can be an excellent plan",
        paragraphs: [
          "Home is not a second-rate destination. Many people prefer familiar surroundings, sleep better there, regain ordinary routines, avoid institutional risks, and receive meaningful support from people they trust. Families often know the person's baseline and notice changes that a new facility would miss.",
          "The problem is not family care. The problem is using affection as a substitute for capacity analysis. A plan can respect the patient's preference for home and still say that a transfer requires two people, that overnight supervision is unavailable, that a medication is unaffordable, or that the only caregiver must return to work.",
          "Nor does every gap mean the hospital is dumping a patient. Coverage limits, workforce shortages, geography, patient choice, service eligibility, and the absence of a public long-term-care benefit can constrain every participant. A good plan makes those constraints explicit and looks for the safest feasible combination of professional services, equipment, patient ability, community support, paid help, and family help.",
        ],
      },
      {
        title: "Turn 'home with family' into a written care plan",
        paragraphs: [
          "List the work by time horizon. What must happen before leaving the hospital? What happens tonight? What happens tomorrow morning? What must happen during the first week? Separate clinical tasks from daily-living tasks and administrative tasks.",
          "For every task, identify the person or service responsible, the training or instruction required, when it begins, how often it happens, what it costs, and the backup if it fails. Do not improvise medication changes, oxygen settings, wound care, transfer techniques, or other patient-specific clinical instructions from a general website; ask the treating team to teach and document the exact plan.",
          "Then make the gaps visible. 'Nobody can safely help with stairs after 6 p.m.' is actionable. 'Family will manage' is not. CAF's Hospital-to-Home navigator can organize the setting, coverage, authorization, equipment, transport, and caregiver questions without collecting health details.",
        ],
        keyPoints: [
          "What tasks are expected between professional visits?",
          "Who has agreed to each task and been shown how to do it safely?",
          "When will each paid service actually start?",
          "Which costs are covered, which are patient costs, and which become unpaid family labor?",
          "What is the after-hours and backup plan if the caregiver or service is unavailable?",
        ],
      },
      {
        title: "Where families can look for support",
        paragraphs: [
          "The Administration for Community Living's National Family Caregiver Support Program funds state and local services that can include information, assistance accessing services, counseling, training, support groups, respite, and limited supplemental services. Availability and eligibility vary locally; the program is a route to investigate, not a promise that every gap will be filled.",
          "The hospital team, insurer or Medicare plan, home health agency, Area Agency on Aging, state Medicaid agency, employer leave office, community organizations, and local transportation programs may control different pieces. Ask each organization only for the piece it can actually verify.",
          "A family should not have to pretend it can provide a level of care it cannot safely provide. Naming a limit is not abandonment. It is information the transition plan needs.",
        ],
      },
    ],
    systemLens: {
      title: "Who pays when care moves home?",
      description: "The discharge order may be singular, but the home plan is financed and staffed in pieces.",
      items: [
        { question: "Who makes the rule?", answer: "CMS, Medicare, Medicaid, health plans, state programs, hospitals, employers, and service agencies set different coverage, leave, eligibility, and discharge requirements." },
        { question: "Who pays?", answer: "A payer may cover specific skilled services or equipment; patients may pay cost sharing or private help; public programs may assist; families often contribute unpaid time and out-of-pocket spending." },
        { question: "Who carries the financial risk?", answer: "Patients and households carry uncovered-care, missed-work, and contingency risk; agencies and providers carry service and payment risk; hospitals carry failed-transition and readmission consequences." },
        { question: "Who performs the work?", answer: "Nurses, therapists, aides, clinicians, suppliers, transport workers, patients, relatives, friends, and advocates perform different pieces—often on different schedules." },
        { question: "Who absorbs the consequence?", answer: "When a task has no realistic owner, the patient may go without help, a caregiver may become overwhelmed or injured, or the person may return to emergency or inpatient care." },
      ],
    },
    comparisonTable: {
      headers: ["Part of the home plan", "What a covered service may do", "What still needs an explicit owner"],
      rows: [
        ["Skilled home health", "Intermittent qualifying nursing, therapy, social work, supplies, or related aide services", "Care between visits, service start date, after-hours concerns, and tasks outside the order"],
        ["Medication plan", "Prescriber, pharmacy, or nurse explains the written regimen and access steps", "Pickup, organization, reminders, affordability, refills, and who calls when instructions conflict"],
        ["Mobility and personal care", "Therapy or trained staff may assess and teach safe techniques", "Daily transfers, bathing, toileting, stairs, supervision, caregiver physical capacity, and backup help"],
        ["Follow-up and logistics", "Clinicians and agencies provide appointments, orders, or referrals", "Transportation, scheduling, time off work, records, insurance calls, and what happens when a service is delayed"],
      ],
    },
    relatedCalculator: { label: "Hospital-to-Home Coverage Navigator", href: "/insurance/hospital-discharge-coverage" },
    questionsHeading: "Questions before a discharge home",
    questionsToAsk: [
      "What exact help will the patient need tonight, tomorrow, and during the first week?",
      "Which tasks require a licensed professional or patient-specific training?",
      "Who has agreed to each nonprofessional task, and can that person do it safely?",
      "When will home health, equipment, medicines, therapy, and follow-up actually begin?",
      "What does insurance cover, and what remains unpaid or out of pocket?",
      "What is the backup if the caregiver, agency, equipment, transport, or medication plan fails?",
    ],
    commonMistakes: [
      "Treating the word 'family' as proof of time, skill, strength, money, or consent.",
      "Assuming home health means someone will be present all day.",
      "Leaving the caregiver to discover the medication, mobility, or equipment plan after discharge.",
      "Equating a preference for home with an obligation to accept an unsafe plan.",
      "Blaming one hospital or insurer for every gap in the long-term-care and home-support system.",
    ],
    takeaway: "Home with family can be a strong plan when the tasks, training, coverage, capacity, and backup are real. The honest version names the unpaid work instead of hiding it inside the word 'family.'",
    sources: [blsUnpaidEldercare, federalDischargePlanning, ahrqIdealDischarge, medicareHomeHealth, aclFamilyCaregiverSupport, dolFamilyCaregiverLeave],
  },
];
