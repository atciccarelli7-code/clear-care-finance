import type { Article } from "./articles";
import { ARTICLES as BASE_ARTICLES } from "./articles";
import { SOURCE_PRESETS } from "./sources";

const PUBLISHED_ARTICLE_OVERRIDES: Article[] = [
  {
    slug: "medicare-options-explained",
    title: "Medicare Options Explained",
    category: "Medicare",
    readTime: "7 min read",
    promise: "Understand Original Medicare, Medicare Advantage, Part D, Medigap, and Medicaid without getting buried in insurance language.",
    audience: "Older adults, caregivers, healthcare workers, and families comparing Medicare options or helping someone enroll.",
    summary: "Medicare is not one simple plan. Original Medicare is Part A and Part B through the federal government. Medicare Advantage, also called Part C, is a private plan alternative for receiving Part A and Part B benefits. Part D helps pay for outpatient prescription drugs. Medigap can help pay some Original Medicare cost-sharing. Medicaid is separate and may help people with limited income, resources, or long-term care needs.",
    body: [
      "Medicare helps pay for healthcare, but it does not make healthcare free.",
      "The key decision is usually structure first: Original Medicare, often paired with Part D and possibly Medigap, or a Medicare Advantage plan that bundles Part A and Part B benefits through a private plan.",
      "This guide is educational. Medicare costs, plan networks, drug formularies, supplemental coverage, Medicaid eligibility, and long-term care rules can vary by plan, state, county, timing, and personal situation."
    ],
    sections: [
      {
        title: "Original Medicare",
        definition: "The federal Medicare program made up of Part A hospital insurance and Part B medical insurance.",
        keyPoints: [
          "Usually lets a person see any doctor or hospital that accepts Medicare nationwide.",
          "Often paired with a standalone Part D prescription drug plan.",
          "May be paired with a Medigap policy to reduce some Original Medicare cost-sharing.",
          "Does not have a built-in yearly out-of-pocket maximum for Part A and Part B services by itself."
        ],
        watchOut: "Original Medicare without Medigap, Medicaid, employer retiree coverage, or another supplement can leave repeated deductibles and coinsurance exposure."
      },
      {
        title: "Medicare Advantage",
        definition: "A private Medicare-approved plan, also called Part C, that provides Part A and Part B benefits through the plan.",
        keyPoints: [
          "Must cover medically necessary services that Original Medicare covers.",
          "Often uses provider networks, referrals, prior authorization, and plan-specific cost-sharing.",
          "Often includes Part D drug coverage and may include extra dental, vision, hearing, transportation, or fitness benefits.",
          "Has a yearly limit on what the person pays for covered Medicare services."
        ],
        watchOut: "A low premium does not automatically mean low total cost. Check doctors, hospitals, prescriptions, network rules, prior authorization, travel coverage, and maximum out-of-pocket exposure."
      },
      {
        title: "Part D",
        definition: "Medicare outpatient prescription drug coverage, offered through private plans.",
        keyPoints: [
          "Can be a standalone plan with Original Medicare.",
          "Can be bundled into many Medicare Advantage plans.",
          "Plans vary by premium, deductible, copay, coinsurance, pharmacy network, and formulary.",
          "Medication lists should be checked every year because plan details can change."
        ],
        watchOut: "A drug that is affordable under one plan may be expensive or restricted under another."
      },
      {
        title: "Medigap",
        definition: "Private supplemental insurance that works with Original Medicare to help pay some deductibles, copays, and coinsurance.",
        keyPoints: [
          "Works with Original Medicare, not Medicare Advantage.",
          "Does not replace a Part D drug plan.",
          "Can reduce some cost-sharing exposure for services Medicare covers.",
          "Availability and underwriting rules can depend on timing and state rules."
        ],
        watchOut: "Medigap helps with covered Original Medicare cost-sharing. It generally does not turn non-covered long-term custodial care into covered care."
      },
      {
        title: "Medicaid",
        definition: "A joint federal-state program for people who qualify under state income, resource, disability, family status, or medical need rules.",
        keyPoints: [
          "Separate from Medicare.",
          "May help with premiums, deductibles, coinsurance, or services Medicare does not fully cover for people who qualify.",
          "May help with long-term services and supports under state rules.",
          "People with both Medicare and Medicaid are often called dual eligible."
        ],
        watchOut: "Medicaid eligibility and covered services vary by state, so families should verify with official state Medicaid resources."
      },
      {
        title: "The long-term care gap",
        definition: "The mismatch between needing daily help and having Medicare coverage for that help.",
        keyPoints: [
          "Medicare may cover limited skilled care when strict rules are met.",
          "Medicare generally does not pay for most long-term custodial care.",
          "Custodial care includes help with bathing, dressing, toileting, meals, supervision, and transportation over time.",
          "Medicaid may become important when long-term care is the real need."
        ],
        watchOut: "A person can genuinely need help and still have that help fall outside Medicare coverage."
      }
    ],
    example: {
      title: "Two Medicare paths",
      body: "One person chooses Original Medicare plus Part D and Medigap because they travel often and want broad provider access. Another chooses Medicare Advantage because their doctors are in-network, the plan includes drugs, and they value a single plan with a covered-service out-of-pocket limit. Neither choice is automatically better. The better fit depends on doctors, medications, costs, travel, plan rules, and long-term care risk."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools#medicare" },
    commonMistakes: [
      "Assuming Medicare means care is free.",
      "Choosing Medicare Advantage without checking doctors, hospitals, drugs, referrals, prior authorization, and travel coverage.",
      "Using Original Medicare without understanding deductibles, coinsurance, and the lack of a built-in yearly Part A and Part B out-of-pocket cap.",
      "Assuming Medigap works with Medicare Advantage.",
      "Assuming Medicare pays for most long-term custodial care."
    ],
    takeaway: "Pick the Medicare structure first, then compare specific plan details. The right choice is the one that fits the person’s providers, prescriptions, health needs, travel habits, total yearly cost, and long-term care risk.",
    sources: [
      SOURCE_PRESETS.medicareCosts,
      SOURCE_PRESETS.medicareCompareOriginalAdvantage,
      SOURCE_PRESETS.medicareMedigap,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.kffMedicareCoverageSnapshot
    ],
  },
  {
    slug: "discharge-coverage-guide",
    title: "Discharge Coverage Guide",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Understand which post-hospital costs Medicare may cover after discharge — and which questions families should ask early.",
    audience: "Patients, caregivers, bedside clinicians, case managers, and families planning a hospital discharge.",
    summary: "Start with the care setting the team recommends. For a facility transfer, confirm the type of facility, who can accept the patient, and which coverage rules apply. For a discharge home, verify home health, equipment, medication access, and help with daily tasks separately. Hospital admission status is especially important when checking Original Medicare coverage for a skilled nursing facility.",
    body: [
      "A hospital discharge can feel like the end of the emergency, but financially it is often the beginning of a new set of questions.",
      "Families may hear words like skilled nursing, home health, durable medical equipment, observation, inpatient, custodial care, prior authorization, and discharge appeal while they are already tired and overwhelmed.",
      "This guide is educational. Medicare, Medicaid, Medicare Advantage plans, employer plans, and state programs can apply different rules. Always verify patient-specific details with the care team, insurer, Medicare resources, plan documents, and the billing office."
    ],
    sections: [
      {
        title: "Discharge planning",
        definition: "The process of deciding where the patient goes after the hospital and what support is needed next.",
        keyPoints: [
          "Discharge planning should start before the patient is ready to leave.",
          "The medical question is what the patient needs.",
          "The coverage question is what the payer will approve and pay for.",
          "Those two answers do not always match."
        ],
        watchOut: "A discharge plan can be medically reasonable and still not fully covered by Medicare, Medicaid, or a private plan."
      },
      {
        title: "Skilled care",
        definition: "Care that must be performed by, or supervised by, licensed medical or therapy professionals.",
        keyPoints: [
          "Examples include wound care, IV medications, skilled nursing, physical therapy, occupational therapy, and speech therapy.",
          "Medicare may cover skilled care when specific rules are met.",
          "Documentation matters because payers need to see why care is skilled and medically necessary."
        ],
        watchOut: "The payer usually looks for a skilled need, not just general weakness or safety concern."
      },
      {
        title: "Custodial care",
        definition: "Help with daily living, such as bathing, dressing, toileting, meals, transportation, supervision, or staying safe at home.",
        keyPoints: [
          "Custodial care may be very necessary.",
          "It is often the type of care families most urgently need after discharge.",
          "Medicare generally does not pay for most long-term custodial care.",
          "Families may need to consider Medicaid, private pay, family caregiving, community resources, or long-term care insurance if already purchased."
        ],
        watchOut: "A person can be unsafe living alone and still not qualify for Medicare-paid long-term custodial care."
      },
      {
        title: "Hospital status",
        definition: "The billing category for the hospital stay, such as inpatient, observation, or outpatient.",
        keyPoints: [
          "A patient may sleep in a hospital bed and still be considered outpatient or observation.",
          "A formal inpatient order matters for some Medicare coverage questions.",
          "Status can affect whether a skilled nursing facility stay is covered after discharge."
        ],
        watchOut: "Do not rely on the room, length of stay, or how sick the patient looked. Ask directly about hospital status."
      },
      {
        title: "Common post-discharge needs",
        keyPoints: [
          "Skilled nursing facility or short-term rehab.",
          "Home health nursing or therapy.",
          "Durable medical equipment such as walkers, wheelchairs, oxygen, or hospital beds.",
          "Prescription medications, transportation, home aide services, or family caregiving.",
          "Long-term custodial care if the patient cannot safely manage daily life."
        ]
      },
      {
        title: "Questions to ask before discharge",
        keyPoints: [
          "Is the recommended care skilled care or custodial care?",
          "Is the patient inpatient, observation, or outpatient?",
          "Does the patient meet Medicare’s requirements for the recommended service?",
          "Is prior authorization required?",
          "Is the facility, agency, or supplier in-network?",
          "What will the patient owe per day, per visit, or per item?",
          "What happens if coverage is denied or stops early?"
        ]
      }
    ],
    example: {
      title: "A home discharge with two separate coverage checks",
      body: "Suppose the team recommends home physical therapy and a walker. Ask the discharge team which home health agency accepted the referral, when it expects to start, and whom to call if the visit is delayed. Ask separately who is supplying the walker, when it will be available, and what the supplier and plan say you may owe. Medicare home health and equipment can have different costs and requirements. If the walker is needed to get inside safely, tell the discharge team that it needs to be available for the trip home."
    },
    commonMistakes: [
      "Assuming discharge needs are automatically covered.",
      "Confusing skilled care with custodial care.",
      "Waiting until discharge day to ask about inpatient versus observation status.",
      "Assuming Medicare pays for long-term nursing home care.",
      "Assuming home health means full-time help at home.",
      "Forgetting to ask about Medicare Advantage prior authorization."
    ],
    takeaway: "Hospital discharge is where medical need, insurance rules, family support, and available providers collide. Ask early what is covered, what is not covered, what the patient may owe, and what the backup plan is.",
    sources: [
      SOURCE_PRESETS.medicareSnf,
      SOURCE_PRESETS.medicareHomeHealth,
      SOURCE_PRESETS.medicareDme,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.medicareMedigapHowWorks
    ],
  },
  {
    slug: "short-term-rehab-after-hospital",
    title: "Short-Term Rehab After the Hospital: How to Compare Facilities",
    reviewScope: "Facility capability, admission availability, coverage verification, and transfer planning.",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Compare what each facility can provide, whether it can admit the patient, and what still has to happen before transfer.",
    audience: "Patients, caregivers, families comparing discharge options, bedside clinicians, and case managers.",
    summary: "Ask which setting the team means by rehab. A skilled nursing facility (SNF) and an inpatient rehabilitation facility (IRF) have different Medicare coverage rules. Once you know the setting, compare facilities on care capability, availability, coverage, cost and transfer timing.",
    body: [],
    editorialSections: [
      {
        title: "Start with the care the patient needs",
        paragraphs: [
          "Ask the discharge team to name the setting and the specific care it needs to provide. A skilled nursing facility and an inpatient rehabilitation facility serve different needs. Ask which services the recommended setting must be equipped to provide.",
          "Ask each facility whether it can deliver the actual care described in the referral. An opening alone tells you little about whether the facility has the staff, equipment or services the patient needs.",
        ],
      },
      {
        title: "Compare two replies to the same referral",
        paragraphs: [
          "Suppose the hospital recommends a skilled nursing facility for wound care and therapy. Facility A confirms it can provide both, but has no staffed bed until Tuesday. Facility B has a bed tomorrow and can provide therapy, but has not confirmed it can manage the wound. Ask case management to verify the earliest appropriate admission and whether a backup referral is active.",
          "If a facility confirms care and a bed, check coverage and cost with the facility and the plan. Ask whether authorization is required, whether it has been issued and what the patient may owe. Confirm how the records, medicines and transportation will reach the receiving facility.",
        ],
      },
      {
        title: "Make the plan for when rehab ends",
        paragraphs: [
          "Ask when the facility will reassess the patient and what help may still be needed at home. If covered care could end before a workable home plan is in place, ask who will coordinate the next setting, what it could cost and which payer or program would need to make a decision.",
        ],
      },
    ],
    commonMistakes: [
      "Assuming Medicare always pays for rehab after a hospital stay.",
      "Confusing observation status with inpatient status.",
      "Believing Medicare automatically covers 100 SNF days.",
      "Confusing short-term skilled rehab with long-term nursing home care.",
      "Not checking Medicare Advantage prior authorization and network rules.",
      "Waiting until coverage stops to ask about Medicaid or private-pay costs."
    ],
    takeaway: "Compare facilities by what they can safely provide, when they can admit, which costs are verified and who owns the next step.",
    sources: [
      SOURCE_PRESETS.medicareSnf,
      {
        name: "Medicare.gov",
        pageTitle: "Inpatient rehabilitation care",
        url: "https://www.medicare.gov/coverage/inpatient-rehabilitation-care",
      },
      SOURCE_PRESETS.medicareMedigapCompareBenefits,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicaidLtss
    ],
  },
  {
    slug: "home-health-after-discharge",
    title: "Home Health After Discharge",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Plan who will help between Medicare home health visits, especially on the first night and during the first week.",
    audience: "Patients and caregivers planning a hospital discharge home.",
    summary: "A home health nurse or therapist can help during scheduled visits. Before going home, ask when the agency expects to start and who will cover the tasks the patient cannot safely do between visits.",
    body: [],
    lastReviewedAt: "2026-11-15",
    nextReviewAt: "2027-05-15",
    reviewScope: "Medicare home health eligibility, discharge planning and North Carolina and VA home support options.",
    editorialSections: [
      {
        title: "Who will be there at 10 p.m.?",
        paragraphs: [
          "When a family hears that home health is coming, I understand the relief. A scheduled visit can be a real part of the plan. As a case manager, I also want to know who will be there when the person needs help getting to the bathroom that night.",
          "Take a hypothetical week with ten hours of visits. That leaves 158 hours between or outside visits. Those hours include time the person may be able to manage on their own. Mark the times they need help and see whether the visits and available caregivers cover those tasks.",
          "Bring a specific gap back to the discharge team. For example, “My mother needs someone beside her to get to the bathroom, and nobody can be there after 6 p.m.” That gives the team a concrete problem to address while discussing the discharge plan.",
        ],
        keyPoints: [
          "Arrival: who will help the patient get inside, and will any equipment they need already be there?",
          "First night: who can help at the times the patient needs it, and who is the backup?",
          "First week: which agency accepted the referral, when is the first confirmed visit, and who can help in the meantime?",
        ],
      },
      {
        title: "Check what the agency has confirmed",
        paragraphs: [
          "In the workflow I use, I check whether an agency has accepted the referral and whether the chosen agency has been selected to provide care. If the team thinks the agency accepted but the agency is still reviewing, I document the agency’s current status and update the physician and nurse. I tell the family what is pending without guessing why.",
          "Before leaving, ask which agency accepted, what service starts first and whether the visit is confirmed or still an estimated window. Get the agency’s phone number and ask who to contact if the visit does not happen. If help is needed before that visit, tell the discharge team which task and time still need a plan.",
        ],
      },
      {
        title: "What Medicare home health can cover",
        paragraphs: [
          "Medicare generally requires a qualifying skilled need and homebound status, a clinician's order, and care through a Medicare-certified agency. Using a walker can help explain why leaving home is difficult. Eligibility depends on the whole situation. Covered services can include part-time or intermittent skilled nursing, qualifying therapies, and limited aide care alongside qualifying skilled services.",
          "Medicare's home health benefit excludes round-the-clock home care, meal delivery, homemaker services unrelated to the care plan, and personal care when that is the only help needed. If the person needs those services, tell the team exactly what help and hours are missing.",
        ],
      },
      {
        title: "Options to check in the Charlotte area",
        paragraphs: [
          "Start with the person's ZIP code, coverage, and the tasks and hours they need help with. Ask each program about eligibility, availability, and start dates before relying on it for a discharge plan.",
        ],
        keyPoints: [
          "PACE: for eligible adults age 55 or older who need a nursing-home level of care, live in a participating service area, and can live safely in the community with help. The North Carolina directory lists PACE of the Southern Piedmont in Charlotte. Confirm the address with the program.",
          "NC Medicaid Personal Care Services: ask about an assessment for help with tasks such as bathing, dressing, or toileting.",
          "NC Medicaid Private Duty Nursing: ask the medical team about this benefit if the person has complex needs requiring ongoing skilled nursing at home.",
          "VA Homemaker and Home Health Aide care: ask the VA team about community-care eligibility, clinical requirements, and local availability.",
        ],
      },
    ],
    takeaway: "Confirm which visits are arranged, then put a person or service next to each task that needs help between visits. Tell the care team where the plan still has a gap.",
    sources: [
      SOURCE_PRESETS.medicareHomeHealth,
      { name: "Electronic Code of Federal Regulations", pageTitle: "42 CFR 482.43 — Discharge planning", url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43" },
      { name: "NC Medicaid", pageTitle: "Program of All-Inclusive Care for the Elderly (PACE)", url: "https://medicaid.ncdhhs.gov/beneficiaries/long-term-services-and-supports/program-all-inclusive-care-elderly" },
      { name: "NC Medicaid", pageTitle: "PACE organizations and service areas", url: "https://medicaid.ncdhhs.gov/ncpace-service-area/download?attachment=" },
      { name: "NC Medicaid", pageTitle: "Personal Care Services", url: "https://medicaid.ncdhhs.gov/beneficiaries/long-term-services-and-supports/personal-care-services" },
      { name: "NC Medicaid", pageTitle: "Private Duty Nursing", url: "https://medicaid.ncdhhs.gov/beneficiaries/long-term-services-and-supports/private-duty-nursing" },
      { name: "U.S. Department of Veterans Affairs", pageTitle: "Homemaker and Home Health Aide Care", url: "https://www.va.gov/geriatrics/guide/longtermcare/homemaker_and_home_health_aide_care.asp" },
    ],
  },
  {
    slug: "durable-medical-equipment-after-discharge",
    title: "Durable Medical Equipment After Discharge",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Learn how walkers, wheelchairs, oxygen, hospital beds, and other equipment may be covered after discharge.",
    audience: "Patients, caregivers, families planning discharge, bedside clinicians, and case managers.",
    summary: "Durable medical equipment, or DME, is reusable medical equipment needed at home. Medicare may cover medically necessary DME when rules are met. The equipment usually needs a provider order, medical necessity, home use, and a Medicare-enrolled supplier. Helpful equipment, convenience items, and home modifications are not automatically covered.",
    body: [
      "Equipment can be the difference between a safe discharge and a chaotic one.",
      "But durable medical equipment is not covered just because it would be helpful. Coverage usually depends on medical necessity, orders, documentation, home-use rules, supplier rules, and plan cost-sharing.",
      "Families should ask about the equipment order, supplier, assignment or network status, prior authorization, rent-versus-buy rules, delivery timing, and what the patient may owe."
    ],
    sections: [
      {
        title: "Durable medical equipment",
        definition: "Reusable medical equipment used for a medical reason, usually at home, and expected to last over time.",
        keyPoints: [
          "Examples may include walkers, wheelchairs, commodes, oxygen equipment, hospital beds, CPAP supplies, crutches, canes, and other medically necessary equipment.",
          "DME must generally be durable, medically necessary, useful because of illness or injury, used in the home, and expected to last.",
          "It is usually covered under Medicare Part B rules, not automatically covered because the patient was hospitalized.",
          "The exact item, supplier, documentation, and plan rules matter."
        ],
        watchOut: "Helpful is not the same as covered. Medicare generally looks for medical necessity and home-use criteria."
      },
      {
        title: "Provider order",
        definition: "The clinician’s order and documentation explaining why the equipment is medically necessary.",
        keyPoints: [
          "A provider may need to document the diagnosis, functional limitation, home need, and expected duration.",
          "Higher-level equipment may require stronger documentation.",
          "Missing or weak documentation can delay approval or delivery.",
          "The order often needs to go to a supplier that meets Medicare or plan requirements."
        ],
        watchOut: "Equipment can be delayed even when everyone agrees it is needed if the order or documentation is incomplete."
      },
      {
        title: "Supplier rules",
        definition: "Coverage and cost can depend on whether the supplier participates with Medicare, accepts assignment, or is in-network with the plan.",
        keyPoints: [
          "Original Medicare patients should ask whether the supplier accepts Medicare assignment.",
          "Medicare Advantage patients may need an in-network supplier and prior authorization.",
          "A non-participating supplier can create higher costs or upfront payment issues.",
          "Delivery timing can depend on supplier availability and insurance approval."
        ],
        watchOut: "Before accepting equipment, ask who the supplier is and what the patient may owe."
      },
      {
        title: "Rent vs. buy",
        definition: "Some equipment is purchased, some is rented, and some may become owned after a rental period.",
        keyPoints: [
          "Oxygen, hospital beds, wheelchairs, and other equipment may have rental rules.",
          "Rental billing can continue over time.",
          "Repairs, replacement, accessories, and supplies may have separate rules.",
          "Patients should ask whether the item is rented, purchased, or capped rental."
        ],
        watchOut: "A monthly rental can surprise families who expected a one-time equipment charge."
      },
      {
        title: "DME vs. home modification",
        definition: "DME is medical equipment; home modifications are changes to the home environment.",
        keyPoints: [
          "Examples of home modifications include ramps, grab bars, stair lifts, bathroom renovation, widened doorways, and long-term safety changes.",
          "These may be extremely helpful but are often not covered by Medicare as DME.",
          "Medicaid waivers, Veterans benefits, community programs, or private pay may apply in some cases.",
          "Families should separate equipment needed now from home changes needed for long-term safety."
        ],
        watchOut: "A safer home may require both covered DME and non-covered home modifications."
      },
      {
        title: "Questions to ask before discharge",
        keyPoints: [
          "What equipment is medically necessary for discharge?",
          "Has the provider written the order?",
          "Which supplier is being used?",
          "Does the supplier accept Medicare assignment or participate with the plan?",
          "Is prior authorization needed?",
          "Is the item rented or purchased?",
          "What will the patient owe?",
          "When will the equipment be delivered?"
        ]
      }
    ],
    example: {
      title: "The walker is easy; the hospital bed is not",
      body: "A patient needs a walker and a hospital bed before going home. The walker is straightforward, but the bed requires stronger documentation, supplier coordination, delivery timing, and cost-sharing review. The family should ask about orders, supplier assignment, rental billing, delivery, and backup plans before discharge day."
    },
    commonMistakes: [
      "Assuming every helpful item is covered.",
      "Forgetting to ask whether the supplier accepts Medicare assignment.",
      "Not checking Medicare Advantage network or prior authorization rules.",
      "Assuming a hospital discharge automatically makes equipment free.",
      "Confusing DME with home modifications.",
      "Waiting until the day of discharge to solve equipment delivery."
    ],
    takeaway: "Medicare may cover medically necessary durable medical equipment for use at home, but coverage depends on orders, documentation, home-use rules, supplier rules, and cost-sharing. Ask early what is covered, what is not covered, when it will arrive, and what the patient may owe.",
    sources: [SOURCE_PRESETS.medicareDme, SOURCE_PRESETS.medicaidLtss, SOURCE_PRESETS.medicareMedigapHowWorks],
  },
  {
    slug: "long-term-care-and-custodial-care",
    title: "Long-Term Care and Custodial Care",
    category: "Medicare",
    readTime: "7 min read",
    promise: "Learn why Medicare usually does not pay for long-term daily help — and why Medicaid planning may matter.",
    audience: "Adult children, caregivers, older adults, and healthcare workers explaining long-term care basics to families.",
    summary: "Long-term care usually means ongoing help with daily living. Custodial care means help with bathing, dressing, toileting, eating, mobility, meals, transportation, or supervision. Medicare generally does not cover most long-term custodial care. Medicaid may help for people who qualify under state rules, but eligibility and services vary by state.",
    body: [
      "One of the most expensive Medicare surprises is learning that medically necessary care and daily living help are not treated the same way.",
      "A person can need serious help at home or in a facility and still not have that help covered by Medicare if the need is mainly custodial rather than skilled.",
      "This is why long-term care planning matters before a crisis. The decisions are easier when a family has time to understand the difference between Medicare, Medicaid, savings, family caregiving, community programs, and private long-term care options."
    ],
    sections: [
      {
        title: "Long-term care",
        definition: "Ongoing help for someone who cannot safely manage daily life because of age, illness, disability, cognitive decline, or functional limits.",
        keyPoints: [
          "Can happen at home, in the community, in assisted living, in memory care, or in a nursing facility.",
          "May involve medical and non-medical support.",
          "Often first appears during a hospital discharge crisis.",
          "Can become expensive because it requires ongoing labor, supervision, housing, or facility support."
        ],
        watchOut: "Long-term care need is not the same as Medicare coverage."
      },
      {
        title: "Custodial care",
        definition: "Help with activities of daily living and basic safety needs.",
        keyPoints: [
          "Examples include bathing, dressing, toileting, eating, transferring, meals, transportation, medication reminders, housekeeping, and supervision.",
          "Custodial care may be essential for safety and dignity.",
          "It is often what families mean when they say someone cannot live alone anymore.",
          "Medicare generally does not pay for most long-term custodial care."
        ],
        watchOut: "A person can truly need help and still have that help fall outside Medicare’s long-term coverage."
      },
      {
        title: "Skilled care",
        definition: "Medical or therapy care that must be performed by, or supervised by, licensed professionals or trained technical personnel.",
        keyPoints: [
          "Examples include skilled nursing, wound care, IV medications, physical therapy, occupational therapy, and speech therapy.",
          "Medicare may cover skilled care when specific requirements are met.",
          "Skilled care is usually tied to recovery, treatment, monitoring, or therapy goals.",
          "Skilled care can be short-term; custodial care can be ongoing."
        ],
        watchOut: "Short-term skilled nursing facility rehab is not the same thing as long-term custodial nursing home care."
      },
      {
        title: "Why Medicare usually does not pay",
        definition: "Medicare is health insurance for covered medical services, not a general long-term daily-care program.",
        keyPoints: [
          "Medicare may cover hospital care, doctor visits, outpatient care, skilled nursing facility care under rules, home health under rules, hospice, and other covered services.",
          "Medicare generally does not pay simply because someone is unsafe alone or needs daily help.",
          "Dementia supervision, bathing help, meal support, transportation, and long-term placement are often custodial issues."
        ],
        watchOut: "Medically ready for discharge does not mean fully independent or that Medicare will pay for long-term care."
      },
      {
        title: "Medicaid",
        definition: "A joint federal-state program that may help pay for long-term care for people who qualify under state financial and medical rules.",
        keyPoints: [
          "Often the primary public payer for long-term services and supports.",
          "Eligibility may depend on income, assets/resources, medical need, nursing facility level of care, state rules, and other requirements.",
          "May cover nursing facility care or home and community-based services.",
          "Rules and availability vary by state."
        ],
        watchOut: "Medicaid is not automatic. Planning, paperwork, eligibility review, and state-specific rules matter."
      },
      {
        title: "Questions families should ask early",
        keyPoints: [
          "Is this short-term skilled care or long-term custodial care?",
          "What specific skilled need exists right now?",
          "If Medicare will not pay, what payer options exist?",
          "Could Medicaid eligibility apply?",
          "What state Medicaid rules matter here?",
          "What is the private-pay cost?",
          "What happens while Medicaid is pending?"
        ]
      }
    ],
    example: {
      title: "After rehab ends",
      body: "An older adult has a covered skilled rehab stay after surgery. Therapy improves, and skilled coverage ends. The person still needs help bathing, dressing, cooking, and getting to the bathroom safely. Those needs may be custodial. Medicare may stop paying even though the person still needs daily help, so the family has to plan for home caregivers, facility costs, Medicaid eligibility, or other supports."
    },
    commonMistakes: [
      "Assuming Medicare pays for long-term nursing home care.",
      "Assuming Medigap covers long-term custodial care.",
      "Confusing short-term skilled rehab with long-term care.",
      "Waiting until a crisis to discuss Medicaid eligibility.",
      "Assuming home health means full-time home care.",
      "Underestimating the burden on family caregivers.",
      "Ignoring home safety until discharge is urgent."
    ],
    takeaway: "Long-term care is not about whether someone deserves help. The issue is that Medicare generally does not pay for most long-term custodial care. For many families, the realistic payer options are private pay, Medicaid if eligible, long-term care insurance if already purchased, Veterans benefits if available, family support, and community programs.",
    sources: [
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.medicareMedigapHowWorks,
      SOURCE_PRESETS.kffMedicaid101
    ],
  },
  {
    slug: "medicaid-dual-eligibility-ltss",
    title: "How Do You Qualify for Medicaid? Income, Disability and Long-Term Care",
    category: "Medicaid",
    readTime: "6 min read",
    promise: "See whose income counts, when Medicaid looks at assets, and what North Carolina checks before covering nursing home care.",
    audience: "Adults checking Medicaid eligibility, families planning a hospital discharge, and caregivers comparing long-term care options.",
    summary: "To qualify for Medicaid, you must meet your state’s rules for an eligibility group. Most children, pregnant people, parents and expansion adults are screened using tax-based household and income rules without an asset test. People applying based on age, blindness or disability usually follow different rules. If you need nursing home care or long-term help at home, ask what the specific service requires in addition to your Medicaid eligibility.",
    body: [],
    editorialSections: [
      {
        title: "How much can you make and still qualify for Medicaid?",
        paragraphs: [
          "The limit depends on your state, household size and eligibility group. The income rules for an adult applying through expansion may differ from those for a child, someone who is pregnant, or someone applying based on disability. The expansion pathway uses modified adjusted gross income (MAGI). The state typically starts with tax filing relationships when deciding who belongs in your household, with exceptions. The people who live at your address and the people Medicaid counts can be different.",
          "If you receive disability benefits, tell the state which kind. Social Security Disability Insurance (SSDI) generally counts in MAGI, including the non-taxable portion. Supplemental Security Income (SSI) is excluded from MAGI. Other Medicaid pathways use different rules, so give the agency information about both benefits if you receive them.",
        ],
      },
      {
        title: "What are the North Carolina Medicaid income limits?",
        paragraphs: [
          "The chart shows North Carolina’s April 2026 income standard for adult expansion, generally for ages 19 through 64. It lists the base standard at 133% of the federal poverty level and the separate five-percentage-point disregard. For example, NC Medicaid’s consumer guide lists about $1,835 per month for an adult in a household of one. If you are close to the limit, ask county DSS what income it counts and whether the disregard applies.",
          "The chart applies to this expansion group. Children, pregnancy coverage and Medicaid based on age or disability have their own rules. Check the official state eligibility page for current residency and immigration rules and for the community engagement requirements scheduled to start in January 2027 for certain applicants and members.",
        ],
      },
      {
        title: "Can you get Medicaid if you have a disability or receive SSDI?",
        paragraphs: [
          "You can ask the state to check every pathway that fits. SSDI is a cash benefit and does not automatically enroll you in Medicaid. A person whose disability claim is pending might still qualify under an income-based group. If you receive SSI, many states link Medicaid enrollment to the SSI decision and some handle it through a separate state process.",
          "When the state reviews someone based on disability, blindness or age 65 and older, it usually uses a non-MAGI category. It may review countable assets as well as income. Ask which category the worker is using and what proof of disability or resources it requires.",
        ],
      },
      {
        title: "Does Medicaid count savings, a car, or a house?",
        paragraphs: [
          "MAGI groups have no asset test. If your category has one, the state applies rules about which assets count, which are excluded and how ownership is treated. Nursing facility and certain home-based programs may also review transfers and apply protections for a spouse who remains at home. Before selling or transferring property, verify the rules for the program you are applying to.",
        ],
      },
      {
        title: "What qualifies someone for Medicaid nursing home care?",
        paragraphs: [
          "Ask two questions early: which Medicaid category covers the person, and has the person met the nursing facility’s level-of-care criteria? In North Carolina, county DSS needs documentation of the level-of-care decision. Depending on the person’s coverage, other financial reviews can apply. For example, the state’s guidance distinguishes MAGI from non-MAGI members when DSS calculates what a resident contributes toward care.",
          "A family can map this into three calls. Ask DSS about the eligibility category and any missing documents. Ask the discharge team or health plan who is handling the level-of-care review. Ask the nursing facility whether it can meet the person’s needs, whether it has an available Medicaid bed, and how it handles a pending decision. For care at home, ask about the specific home-based service and whether a slot or provider is available.",
        ],
      },
      {
        title: "Can you have Medicare and Medicaid, and how do you apply?",
        paragraphs: [
          "Yes. A person can have both, often called dual eligibility. Medicare generally pays first for Medicare-covered services. Medicaid may help with premiums, cost sharing, or services Medicare does not cover, depending on the category. If you want help with Medicare costs, ask about Medicare Savings Programs and whether you also qualify for full Medicaid.",
          "You can apply year-round. In North Carolina, use ePASS or contact your county Department of Social Services. If you need nursing facility care or ongoing services at home, say that when you apply. Keep a copy of the application and ask when you should expect follow-up. The state makes the decision.",
        ],
      },
    ],
    example: {
      title: "North Carolina discharge example",
      body: "Imagine a 62-year-old patient who already has Medicaid through expansion and can no longer live safely alone. The care team still needs to check whether the patient meets nursing facility level of care and find a facility that can accept them. County DSS can verify the Medicaid category and say which financial rules apply to that category. The family can ask who owns each step and what remains unresolved before discharge.",
    },
    relatedCalculator: { label: "Check possible Medicare and Medicaid pathways", href: "/tools/medicare-medicaid-eligibility-check" },
    takeaway: "Ask the state which Medicaid group it is screening you under. If you need nursing home care or long-term help at home, also ask who confirms the care requirement and when the needed service can start.",
    sources: [
      SOURCE_PRESETS.medicaidEligibility,
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.cmsMedicaidCoordination,
      { name: "HealthCare.gov", pageTitle: "What to include in household income", url: "https://www.healthcare.gov/income-and-household-information/income/", note: "MAGI income sources, including SSDI and SSI." },
      { name: "Social Security Administration", pageTitle: "SSI and other government programs", url: "https://www.ssa.gov/ssi/text-other-ussi.htm", note: "How SSI and Medicaid enrollment are linked, with state differences." },
      { name: "NC Medicaid", pageTitle: "Current eligibility rules", url: "https://medicaid.ncdhhs.gov/eligibility", note: "Eligibility groups, state rules and community engagement guidance." },
      { name: "NC Medicaid", pageTitle: "2026 Medicaid expansion income standards (MA-3321)", url: "https://policies.ncdhhs.gov/wp-content/uploads/MA-3321-MAGI-Income-2.pdf", note: "April 1, 2026 monthly standards and five-percentage-point disregard." },
      { name: "NC Medicaid", pageTitle: "How to apply", url: "https://medicaid.ncdhhs.gov/apply", note: "Application options, including ePASS and county DSS." },
      { name: "NC Medicaid", pageTitle: "Nursing facility process for county DSS", url: "https://medicaid.ncdhhs.gov/nc-medicaid-direct-and-nc-medicaid-managed-carenursing-facility-local-dss-process/open", note: "Level-of-care documentation and patient monthly liability by eligibility category." },
    ],
  },
  {
    slug: "plain-english-glossary",
    title: "Plain-English Healthcare Finance Glossary",
    category: "Insurance",
    readTime: "6 min read",
    promise: "Insurance and Medicare terms defined like a human, not like a benefits packet.",
    audience: "Patients, caregivers, healthcare workers, and anyone trying to understand an insurance plan, hospital bill, EOB, or Medicare decision.",
    summary: "Most healthcare money confusion starts with vocabulary. Premium, deductible, copay, coinsurance, out-of-pocket maximum, allowed amount, in-network, out-of-network, HMO, PPO, prior authorization, formulary, Original Medicare, Part A, Part B, Medicare Advantage, Part D, Medigap, Medicaid, dual eligible, and long-term care all mean different things. Once the words are clear, the documents get less intimidating.",
    body: [
      "This glossary is the reusable vocabulary layer for Community Acquired Finance.",
      "The goal is not to sound like an insurance company. The goal is to explain the words the way a nurse, patient, spouse, adult child, or caregiver would actually need them explained.",
      "Definitions are educational and simplified. Your exact costs and coverage still depend on plan documents, official program rules, provider network status, and the service being billed."
    ],
    sections: [
      {
        title: "Premium",
        definition: "The amount paid to keep insurance active, usually monthly.",
        keyPoints: [
          "You pay the premium even if you do not use care.",
          "Premiums are separate from deductibles, copays, coinsurance, and non-covered costs.",
          "A low premium can still come with high costs when care is used."
        ],
        example: "A $150 monthly premium costs $1,800 per year before any visits, prescriptions, or procedures."
      },
      {
        title: "Deductible",
        definition: "The amount you usually pay for covered services before the plan starts sharing many costs.",
        keyPoints: [
          "Some services may be covered before the deductible.",
          "Some copays may apply even before the deductible is met.",
          "Deductibles usually reset each plan year."
        ],
        example: "If the deductible is $2,000, you may pay the first $2,000 of many covered services yourself before coinsurance starts."
      },
      {
        title: "Copay",
        definition: "A fixed amount you pay for a covered service or prescription.",
        keyPoints: [
          "Usually a set dollar amount.",
          "Often used for office visits, urgent care, emergency visits, or prescriptions.",
          "May or may not apply before the deductible depending on the plan."
        ],
        example: "$30 for a primary care visit, $60 for a specialist visit, or $15 for a generic prescription."
      },
      {
        title: "Coinsurance",
        definition: "Your percentage share of a covered service after deductible rules apply.",
        keyPoints: [
          "Usually based on the plan’s allowed amount, not the provider’s sticker price.",
          "Can become expensive for hospital stays, imaging, surgery, infusions, or specialty care.",
          "Often continues until the out-of-pocket maximum is reached for covered in-network care."
        ],
        example: "If the allowed amount is $1,000 and your coinsurance is 20%, you may owe $200 after deductible rules are met."
      },
      {
        title: "Out-of-pocket maximum",
        definition: "The most you pay for covered services in a plan year before the plan pays 100% of covered benefits for the rest of that year.",
        keyPoints: [
          "Usually applies to covered in-network care.",
          "Premiums usually do not count.",
          "Non-covered services, many out-of-network costs, and amounts above the allowed amount may not count."
        ],
        watchOut: "This is not always a true worst-case number for everything healthcare-related. It is a covered-care plan-year limit."
      },
      {
        title: "Allowed amount",
        definition: "The plan-approved price for a covered service.",
        keyPoints: [
          "Bills are often based on this number, not the provider’s sticker price.",
          "Deductible, copay, and coinsurance calculations often use the allowed amount.",
          "Out-of-network billing can work differently."
        ],
        example: "A doctor may bill $300, but the plan’s allowed amount may be $160."
      },
      {
        title: "Network terms",
        definition: "Words that describe whether providers contract with the plan.",
        keyPoints: [
          "In-network means the provider has a contract with your plan.",
          "Out-of-network means the provider does not have that contract.",
          "HMO plans usually require staying in-network except for emergencies.",
          "PPO plans usually offer more provider flexibility, often at higher cost."
        ],
        watchOut: "A hospital can be in-network while a specific clinician, group, lab, imaging center, or facility charge creates a different billing issue."
      },
      {
        title: "Prior authorization and formulary",
        definition: "Plan rules that can affect whether a service or medication is covered.",
        keyPoints: [
          "Prior authorization means the plan wants approval before it pays for a service, medication, test, or procedure.",
          "A formulary is the plan’s covered drug list and pricing structure.",
          "A medically recommended service can still be delayed, denied, or priced differently under plan rules.",
          "Drug formularies and pharmacy networks can change by plan year."
        ],
        watchOut: "Recommended by a clinician is not always the same as approved by the plan."
      },
      {
        title: "Medicare terms",
        definition: "The core Medicare words people most often mix up.",
        keyPoints: [
          "Original Medicare is Part A plus Part B through the federal government.",
          "Part A is hospital insurance.",
          "Part B is medical insurance for doctor, outpatient, preventive, equipment, and other covered services.",
          "Medicare Advantage, also called Part C, is a private plan alternative for receiving Part A and Part B benefits.",
          "Part D helps pay for outpatient prescription drugs.",
          "Medigap is supplemental insurance for Original Medicare cost-sharing."
        ],
        watchOut: "Medigap is for Original Medicare, not Medicare Advantage."
      },
      {
        title: "Medicaid, dual eligible, and long-term care",
        definition: "Terms that matter when Medicare alone does not solve the cost or care problem.",
        keyPoints: [
          "Medicaid is income/resource-based assistance with state-specific rules.",
          "Dual eligible means a person has both Medicare and Medicaid.",
          "Long-term care means ongoing help with daily living over time.",
          "Medicare generally does not cover most long-term custodial care.",
          "Medicaid may help with long-term services and supports for people who qualify."
        ],
        watchOut: "A service can be necessary for safety and still not be covered by Medicare."
      }
    ],
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Thinking the premium is the full price of insurance.",
      "Ignoring the deductible, coinsurance, and out-of-pocket maximum.",
      "Assuming in-network applies to every person or service involved in a visit.",
      "Confusing Medicare Advantage with Medigap.",
      "Assuming Medicare covers most long-term daily care.",
      "Using an EOB like it is the final bill without comparing it to the provider bill."
    ],
    takeaway: "Most insurance confusion gets easier once you can separate premium, deductible, copay, coinsurance, allowed amount, network status, and out-of-pocket maximum. For Medicare, separate Original Medicare, Medicare Advantage, Part D, Medigap, Medicaid, and long-term care before comparing plans.",
    sources: [
      SOURCE_PRESETS.healthcareGovPremium,
      SOURCE_PRESETS.healthcareGovDeductible,
      SOURCE_PRESETS.healthcareGovCopayment,
      SOURCE_PRESETS.healthcareGovCoinsurance,
      SOURCE_PRESETS.healthcareGovOutOfPocketMax,
      SOURCE_PRESETS.healthcareGovHmo,
      SOURCE_PRESETS.medicareCompareOriginalAdvantage,
      SOURCE_PRESETS.medicareCosts,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.kffMedicareCoverageSnapshot
    ],
  },
  {
    slug: "hospital-cafe-habit",
    title: "Your Hospital Café Habit Might Be Quietly Eating Your Savings Rate",
    category: "Spending",
    readTime: "5 min read",
    promise: "A non-shaming way to see how shift coffee, snacks, and lunches add up over a year.",
    audience: "Healthcare workers who feel like money disappears between paychecks, especially during stressful stretches of shifts.",
    summary: "The point is not that healthcare workers should never buy coffee or lunch. The point is that repeated convenience purchases can become a hidden monthly bill. If a few shift purchases cost $20 to $35 per shift and you work several shifts a week, the yearly total can reach thousands of dollars. Awareness lets you choose which purchases are worth it and which ones are just stress autopilot.",
    body: [
      "Hospital work is stressful. A coffee, protein snack, cafeteria lunch, or post-shift takeout can feel like a small reward after taking care of everyone else.",
      "That is not a moral failure. The problem is when the spending is invisible. Small purchases feel harmless one at a time, but they can quietly become a real line item in your budget.",
      "The goal is not to ban joy. The goal is to decide on purpose."
    ],
    sections: [
      {
        title: "The hospital café tax",
        definition: "The recurring cost of convenience food and drinks during shifts.",
        keyPoints: [
          "Coffee, energy drinks, snacks, lunch, and dessert can stack quickly.",
          "The purchase usually feels small because it happens during a hard shift.",
          "The monthly total matters more than any single coffee."
        ],
        watchOut: "If the same purchases happen every shift, treat them like a recurring bill, not a random expense."
      },
      {
        title: "Savings rate",
        definition: "The percentage of income you keep instead of spending.",
        keyPoints: [
          "Raising savings rate does not always require a huge raise.",
          "Reducing repeated spending can free up cash for emergency savings, debt payoff, or investing.",
          "The best spending cuts are usually the ones you barely miss."
        ],
        watchOut: "Do not cut the one purchase that genuinely helps you get through a shift if it prevents a much bigger post-shift spending spiral."
      },
      {
        title: "A realistic middle ground",
        keyPoints: [
          "Bring coffee most shifts, buy café coffee on the hardest shifts.",
          "Pack a protein snack before a long shift.",
          "Keep one emergency meal at work if possible.",
          "Set a weekly shift-spending number instead of relying on willpower.",
          "Move the saved amount automatically so it does not disappear elsewhere."
        ]
      }
    ],
    example: {
      title: "Four shifts a week",
      body: "A nurse spends $6 on coffee, $5 on a snack, and $13 on lunch during four shifts each week. That is $24 per shift, about $96 per week, and roughly $400 per month before any post-shift takeout. Cutting that in half could free up about $200 per month without requiring a second job."
    },
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Thinking small purchases do not matter because each one is under $15.",
      "Trying to eliminate every treat and then rebounding into bigger spending.",
      "Buying food because nothing was packed, not because the purchase was worth it.",
      "Tracking groceries but ignoring work-shift spending.",
      "Not redirecting the saved money to a specific goal."
    ],
    takeaway: "You do not need to shame yourself out of every coffee. Run the number, decide what is worth keeping, and redirect the difference toward a goal that makes future shifts less stressful.",
    sources: [SOURCE_PRESETS.bls, SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "healthcare-worker-discounts",
    title: "Healthcare Worker Discounts and Perks Directory",
    category: "Workplace Benefits",
    readTime: "4 min read",
    promise: "Use healthcare discounts without letting them become an excuse to buy things you did not need.",
    audience: "Healthcare workers who want legitimate discounts but do not want a spammy affiliate list.",
    summary: "Healthcare worker discounts can be useful, but only when they reduce the cost of something you already planned to buy. The safest approach is to verify eligibility through reputable programs, compare the final price, watch shipping and subscription terms, and avoid buying just because a discount exists.",
    body: [
      "A healthcare worker discount is only a win if it lowers the price of something you already wanted or needed.",
      "Many discount lists become shopping traps. They make you feel like you are saving money while nudging you toward purchases that were never in your plan.",
      "This guide is intentionally not a spammy coupon wall. It is a filter for using discounts wisely."
    ],
    sections: [
      {
        title: "Legitimate verification",
        definition: "A process that confirms healthcare-worker status before giving access to a discount.",
        keyPoints: [
          "Some retailers use verification services rather than asking for hospital details directly.",
          "Use official retailer pages or reputable verification platforms.",
          "Avoid websites that ask for unnecessary personal information or look unrelated to the brand."
        ],
        watchOut: "Do not upload work IDs or personal documents to random coupon sites. Verify that the site is legitimate first."
      },
      {
        title: "Final price matters",
        definition: "The price after discount, shipping, fees, taxes, subscriptions, and return rules.",
        keyPoints: [
          "A 20% discount can still be worse than another store’s regular price.",
          "Subscription renewals can erase the benefit of a one-time discount.",
          "Return shipping and restocking fees matter."
        ],
        watchOut: "Compare the final checkout price, not the advertised discount percentage."
      },
      {
        title: "Best categories to check",
        keyPoints: [
          "Work shoes and scrubs you would buy anyway.",
          "Phone plans and internet service if the discount is recurring.",
          "Gym or wellness benefits if you already use them.",
          "Travel, hotels, or rental cars when the final price beats other options.",
          "Professional education, certifications, or exam prep when relevant."
        ]
      },
      {
        title: "Skip the discount when",
        keyPoints: [
          "You would not buy the item without the discount.",
          "The item requires a subscription you may forget to cancel.",
          "The return policy is weak.",
          "The discount requires more personal information than seems necessary.",
          "A normal sale elsewhere is cheaper."
        ]
      }
    ],
    example: {
      title: "Discount that actually helps",
      body: "A nurse needs new work shoes and already planned to spend about $120. A verified healthcare discount brings a durable pair to $96 with free returns. That is a real win. Buying a $180 jacket because it is discounted to $140 is not the same thing if the jacket was never part of the plan."
    },
    commonMistakes: [
      "Treating discounts as income instead of lower prices.",
      "Buying something only because healthcare workers get a deal.",
      "Ignoring shipping, tax, return rules, and subscription renewals.",
      "Assuming a verified discount is automatically the best available price.",
      "Giving sensitive information to questionable coupon sites."
    ],
    takeaway: "Use healthcare discounts as a price reducer, not a shopping trigger. The best discount is on something you already planned to buy, at a final price that beats the alternatives.",
    sources: [SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "burnout-overspending-overeating",
    title: "Burnout, Overspending, and Overeating After Hard Shifts",
    category: "Spending",
    readTime: "6 min read",
    promise: "Understand why hard shifts can trigger expensive or unhealthy coping patterns — without shame.",
    audience: "Healthcare workers whose hardest money and food decisions happen after stressful shifts.",
    summary: "After a hard shift, the brain wants relief. Spending, takeout, alcohol, snacks, and online shopping can become fast ways to feel better. The solution is not shame or perfect discipline. The solution is to build recovery defaults before the shift: food ready, money rules simple, friction on impulse purchases, and a plan for real rest.",
    body: [
      "Healthcare workers often make their worst financial decisions when they are the most exhausted.",
      "After a 12-hour shift, it is normal to want relief. The problem is when relief always comes through spending, overeating, alcohol, or impulse ordering that creates more stress later.",
      "This guide is educational and not medical or mental health advice. If stress, alcohol use, eating patterns, anxiety, depression, or burnout feel unmanageable, use professional support and workplace resources."
    ],
    sections: [
      {
        title: "Burnout spending",
        definition: "Spending used as immediate relief after stress, fatigue, or emotional overload.",
        keyPoints: [
          "It often happens after long shifts, conflict, understaffing, or emotionally heavy care.",
          "The purchase may feel deserved in the moment but frustrating later.",
          "Common examples include takeout, delivery apps, online shopping, convenience snacks, and alcohol."
        ],
        watchOut: "The goal is not to remove every comfort. It is to separate planned recovery from automatic spending."
      },
      {
        title: "Decision fatigue",
        definition: "The worn-down feeling after making too many decisions or managing too much stress.",
        keyPoints: [
          "After a hard shift, the easiest choice usually wins.",
          "If the easiest choice is delivery, scrolling, or impulse shopping, that becomes the default.",
          "Better defaults beat willpower."
        ],
        watchOut: "Do not expect post-shift discipline to solve a system you can design before the shift."
      },
      {
        title: "Recovery budget",
        definition: "A planned amount of money for rest, convenience, and comfort that does not sabotage bigger goals.",
        keyPoints: [
          "Choose a weekly number for takeout, coffee, or treats.",
          "Use it without guilt when it is planned.",
          "Stop treating every hard shift as a blank check."
        ],
        watchOut: "A recovery budget should reduce shame and surprise, not become another strict rule you hate."
      },
      {
        title: "Better defaults",
        keyPoints: [
          "Keep one easy meal at home for post-shift nights.",
          "Pack a protein snack or drink before work.",
          "Put a 24-hour delay on nonessential online purchases after bad shifts.",
          "Move savings automatically on payday before shift stress hits.",
          "Plan one real recovery activity that does not require spending."
        ]
      }
    ],
    example: {
      title: "The post-shift loop",
      body: "A respiratory therapist leaves work drained, orders $28 of delivery, buys a few online items while scrolling, and feels guilty the next morning. A better system is not shame. It is a freezer meal, a planned $40 weekly convenience budget, app notifications turned off, and a rule that nonessential purchases wait until after sleep."
    },
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools#cafe" },
    commonMistakes: [
      "Calling it laziness when it is often exhaustion and stress.",
      "Trying to cut every comfort instead of planning better ones.",
      "Leaving food decisions until after the shift.",
      "Shopping online immediately after emotionally hard shifts.",
      "Ignoring burnout until it becomes a financial, health, or relationship problem."
    ],
    takeaway: "Hard shifts create predictable weak points. Build defaults before the shift, budget for reasonable comfort, and make the expensive impulse choice less automatic.",
    sources: [SOURCE_PRESETS.federalReserve],
  },
];

const overrideSlugs = new Set(PUBLISHED_ARTICLE_OVERRIDES.map((article) => article.slug));

export const SITE_ARTICLES: Article[] = [
  ...BASE_ARTICLES.filter((article) => !overrideSlugs.has(article.slug)),
  ...PUBLISHED_ARTICLE_OVERRIDES,
];

export const articles = SITE_ARTICLES;
