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
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools/medicare-cost-exposure" },
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
    summary: "Discharge planning is not just a clinical handoff. It can also decide what Medicare may or may not cover next. Skilled nursing facility coverage, home health, durable medical equipment, therapy, medications, and custodial help all follow different rules. The most important early question is whether the patient is inpatient, observation, or outpatient, because status can affect post-hospital coverage.",
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
      title: "A discharge that changes the bill",
      body: "A patient spends two nights in the hospital after a fall and then needs rehab. The family assumes the rehab stay is covered because the patient was in a hospital bed. Before discharge, the case manager explains that the stay was observation, not inpatient. That distinction can affect whether Medicare covers the skilled nursing facility stay."
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
    title: "Short-Term Rehab After the Hospital",
    category: "Medicare",
    readTime: "6 min read",
    promise: "Learn what Medicare and Medicaid may cover when a patient needs rehab after hospitalization.",
    audience: "Patients, caregivers, families comparing discharge options, bedside clinicians, and case managers.",
    summary: "Short-term rehab usually means skilled nursing facility care after a hospital stay. Medicare may cover it for a limited time when specific rules are met, but the patient usually needs a skilled nursing or therapy need, qualifying timing, and a Medicare-certified facility. Observation status, Medicare Advantage prior authorization, daily copays, and the difference between skilled care and custodial care can change the answer.",
    body: [
      "Short-term rehab can be one of Medicare’s most useful post-hospital benefits, but it is not automatic and it is not unlimited nursing home coverage.",
      "The central question is whether the patient needs skilled recovery care that meets coverage rules, not simply whether the patient is weak, scared, or unsafe alone.",
      "Families should ask about hospital status, skilled need, facility certification, plan network rules, prior authorization, daily costs, and what happens if coverage stops before home is safe."
    ],
    sections: [
      {
        title: "Short-term rehab",
        definition: "A temporary skilled nursing facility stay meant to help a patient recover after illness, injury, surgery, stroke, infection, fall, or hospitalization.",
        keyPoints: [
          "Often called SNF care or skilled nursing facility care.",
          "May include skilled nursing, physical therapy, occupational therapy, speech therapy, medications, meals, and facility supplies.",
          "The goal is usually recovery, stabilization, function improvement, or a safe transition to a lower level of care.",
          "It is not the same as permanent room-and-board nursing home care."
        ],
        watchOut: "Needs rehab does not automatically mean Medicare will pay."
      },
      {
        title: "Skilled nursing facility",
        definition: "A Medicare-certified facility that can provide skilled nursing or therapy services after a qualifying hospital stay or qualifying event.",
        keyPoints: [
          "The facility must be able to provide the skilled services the patient needs.",
          "Original Medicare coverage depends on Medicare rules and available benefit days.",
          "Medicare Advantage plans may require network placement and prior authorization.",
          "Families should ask whether the facility is Medicare-certified and in-network if applicable."
        ],
        watchOut: "A facility can accept a patient clinically but still create insurance or network issues."
      },
      {
        title: "Skilled care requirement",
        definition: "The patient must need care that requires licensed nursing or therapy professionals or trained technical personnel.",
        keyPoints: [
          "Examples can include daily skilled therapy, wound care, IV medications, injections, skilled monitoring, complex teaching, or therapy after a medical event.",
          "Help with bathing, dressing, toileting, eating, or supervision may be necessary but is not automatically skilled care.",
          "Continued coverage depends on continued skilled need and documentation."
        ],
        watchOut: "Weakness and safety concerns matter, but Medicare coverage usually depends on skilled need, not custodial need alone."
      },
      {
        title: "Inpatient vs. observation status",
        definition: "Hospital status that can affect whether Original Medicare covers skilled nursing facility care after discharge.",
        keyPoints: [
          "Original Medicare generally requires a qualifying inpatient hospital stay for SNF coverage.",
          "Time in observation or the emergency room before inpatient admission generally does not count the same way.",
          "A patient may stay overnight in the hospital without being formally admitted as inpatient.",
          "Families should ask about status early."
        ],
        watchOut: "Three nights in the hospital is not always the same as a qualifying inpatient hospital stay."
      },
      {
        title: "What coverage may look like",
        definition: "Original Medicare Part A may cover SNF care for a limited time when all coverage requirements are met.",
        keyPoints: [
          "Coverage is tied to benefit periods and available SNF days.",
          "The patient does not automatically get 100 days.",
          "Medigap may help with some Original Medicare SNF coinsurance depending on the policy.",
          "Medicare Advantage plans may approve an initial stay and reassess continued authorization."
        ],
        watchOut: "Up to 100 days means only if requirements continue to be met."
      },
      {
        title: "When Medicaid may matter",
        definition: "Medicaid may become important if short-term rehab ends but the patient cannot safely return home and qualifies under state rules.",
        keyPoints: [
          "Medicaid may help with nursing facility care or home and community-based services for eligible people.",
          "Eligibility depends on state financial and medical rules.",
          "Application, documentation, and level-of-care review may be required.",
          "Medicaid planning should start early if long-term care may be needed."
        ],
        watchOut: "Medicaid is not automatic, and facilities may handle Medicaid-pending cases differently."
      }
    ],
    example: {
      title: "Coverage stops before independence returns",
      body: "A patient improves enough that skilled therapy coverage ends, but they still need help bathing, toileting, preparing meals, and getting safely to the bathroom. That remaining need may be custodial. The family may need to plan for home support, private pay, Medicaid eligibility, or a different level of care."
    },
    commonMistakes: [
      "Assuming Medicare always pays for rehab after a hospital stay.",
      "Confusing observation status with inpatient status.",
      "Believing Medicare automatically covers 100 SNF days.",
      "Confusing short-term skilled rehab with long-term nursing home care.",
      "Not checking Medicare Advantage prior authorization and network rules.",
      "Waiting until coverage stops to ask about Medicaid or private-pay costs."
    ],
    takeaway: "Short-term rehab is skilled recovery care, not unlimited long-term care. Ask early about hospital status, skilled need, facility certification, network rules, prior authorization, daily costs, and the backup plan if coverage ends.",
    sources: [
      SOURCE_PRESETS.medicareSnf,
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
    promise: "Understand what Medicare home health can help with after discharge — and what it usually does not replace.",
    audience: "Patients, caregivers, families planning a discharge home, bedside clinicians, and case managers.",
    summary: "Home health is skilled care delivered at home. Medicare-covered home health is usually part-time or intermittent, not full-time caregiving. A patient generally needs a provider order, a skilled need, homebound status, and a Medicare-certified home health agency. If the real need is daily custodial help, meals, supervision, or 24-hour care, families need a separate plan.",
    body: [
      "Home health can make a discharge home safer, but it is often misunderstood.",
      "Families may hear home health and imagine a caregiver staying for hours. Medicare home health usually means intermittent skilled visits, such as nursing or therapy, when coverage requirements are met.",
      "Before going home, ask exactly what services were ordered, which agency accepted the referral, when the first visit will happen, and what support is not included."
    ],
    sections: [
      {
        title: "Home health",
        definition: "Skilled nursing, therapy, or related medical support provided in the patient’s home after an illness, injury, hospitalization, or decline.",
        keyPoints: [
          "May help a patient recover, maintain function, or slow decline.",
          "May include nursing, physical therapy, occupational therapy, speech therapy, medical social services, limited aide support, supplies, or equipment tied to the care plan.",
          "Usually ordered by a clinician and delivered by a Medicare-certified home health agency.",
          "Not the same as having someone stay with the patient all day."
        ],
        watchOut: "Medicare home health usually means intermittent skilled visits, not full-time supervision."
      },
      {
        title: "Skilled need",
        definition: "A medical or therapy need that requires licensed professionals or trained technical personnel.",
        keyPoints: [
          "Examples include wound care, medication teaching, IV or nutrition therapy, monitoring an unstable condition, physical therapy, occupational therapy, or speech therapy.",
          "The skilled need supports Medicare home health coverage.",
          "Documentation should explain why the care is skilled and medically necessary."
        ],
        watchOut: "Needing help at home is not always the same as having a Medicare-covered skilled home health need."
      },
      {
        title: "Homebound status",
        definition: "A coverage requirement meaning leaving home is difficult, medically discouraged, or requires help, equipment, special transportation, or considerable effort.",
        keyPoints: [
          "A patient can leave home occasionally and still be considered homebound in some situations.",
          "The issue is whether leaving home is difficult because of illness, injury, weakness, equipment needs, or safety limitations.",
          "Homebound status must be supported by clinical documentation."
        ],
        watchOut: "Homebound does not mean the person is literally never allowed to leave the house."
      },
      {
        title: "What may be covered",
        keyPoints: [
          "Part-time or intermittent skilled nursing visits.",
          "Physical therapy, occupational therapy, or speech-language pathology.",
          "Medical social services.",
          "Part-time or intermittent home health aide care when tied to covered skilled services.",
          "Medical supplies related to covered care."
        ],
        watchOut: "Ask how many visits are expected. A referral for home health does not mean daily help."
      },
      {
        title: "What Medicare usually does not replace",
        keyPoints: [
          "24-hour-a-day care at home.",
          "Meal delivery.",
          "Homemaker services like shopping and cleaning when unrelated to the care plan.",
          "Custodial or personal care when that is the only care needed.",
          "Long-term supervision for dementia or safety needs."
        ],
        watchOut: "A patient may need these supports, but Medicare home health may not be the payer."
      },
      {
        title: "Medicaid and home support",
        definition: "Medicaid may help cover home and community-based services for people who qualify under state rules.",
        keyPoints: [
          "Some programs help with personal care, aides, adult day services, or other long-term supports.",
          "Eligibility may depend on income, resources, disability, age, functional need, and state program availability.",
          "Waiting lists may apply in some programs."
        ],
        watchOut: "Medicaid can be important for long-term help at home, but it is state-specific and not automatic."
      }
    ],
    example: {
      title: "Home health is not a sitter",
      body: "A patient is discharged with nursing and physical therapy visits. The family expects someone to be there every day to help with meals, bathroom trips, and supervision. The agency explains that Medicare home health covers intermittent skilled visits, not all-day caregiving. The family still needs a separate plan for daily support."
    },
    commonMistakes: [
      "Assuming home health means full-time help at home.",
      "Confusing skilled visits with private-duty caregiving.",
      "Waiting until discharge day to ask when the first visit will happen.",
      "Assuming aide help is covered even when there is no skilled need.",
      "Underestimating how much supervision the patient needs.",
      "Forgetting to ask what is not covered."
    ],
    takeaway: "Home health can be a strong discharge support, but it is not full-time home care. If the real need is daily custodial help, meals, supervision, homemaker support, or 24-hour care, families need a separate plan.",
    sources: [SOURCE_PRESETS.medicareHomeHealth, SOURCE_PRESETS.medicaidLtss],
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
    title: "Medicaid, Dual Eligibility, and LTSS",
    category: "Medicaid",
    readTime: "6 min read",
    promise: "Understand where Medicaid fits when Medicare does not cover the long-term care a family hoped for.",
    audience: "Patients, caregivers, bedside clinicians, case managers, and families facing long-term care or discharge planning decisions.",
    summary: "Medicaid is often the long-term care safety net families discover only after Medicare says no. Some people have both Medicare and Medicaid, often called dual eligible. Medicare usually pays first for Medicare-covered services, while Medicaid may help with premiums, cost-sharing, long-term services and supports, nursing facility care, or home and community-based services for people who qualify under state rules.",
    body: [
      "Many families do not learn about Medicaid long-term care until a crisis.",
      "A loved one is medically ready to leave the hospital, but they are not safe alone. Medicare may not pay for long-term custodial care. A short-term rehab stay may not be approved, or coverage may stop. Private-pay nursing home or home care may be unaffordable.",
      "That is when Medicaid becomes part of the conversation. Medicaid can be powerful, but it is complicated, state-specific, document-heavy, and not automatic."
    ],
    sections: [
      {
        title: "Medicare vs. Medicaid",
        definition: "Medicare is mainly health insurance for older adults and some younger people with disabilities or certain conditions; Medicaid is a joint federal-state program for people who qualify under state rules.",
        keyPoints: [
          "Medicare eligibility is not usually based on income.",
          "Medicaid eligibility can depend on income, resources, disability, age, family status, and medical need.",
          "Some people have both programs.",
          "The programs can work together but do not cover the same things in the same way."
        ],
        watchOut: "Do not assume Medicare and Medicaid are interchangeable just because the names sound similar."
      },
      {
        title: "Dual eligible",
        definition: "A person enrolled in both Medicare and Medicaid.",
        keyPoints: [
          "Medicare generally pays first for Medicare-covered services.",
          "Medicaid may help with costs Medicare does not cover or does not fully cover, depending on eligibility category and state rules.",
          "Dual eligibility can affect premiums, deductibles, copays, coinsurance, transportation, home services, nursing facility care, and plan options.",
          "Details vary by state and plan."
        ],
        watchOut: "Dual eligible does not mean every service is automatically covered without rules, networks, or paperwork."
      },
      {
        title: "LTSS",
        definition: "Long-term services and supports that help people with chronic illness, disability, aging-related needs, or functional limitations live safely over time.",
        keyPoints: [
          "Can include nursing facility care, personal care assistance, adult day services, home and community-based services, waiver programs, case management, respite care, or self-directed care options.",
          "The exact services depend on the state and program.",
          "Some programs may have waiting lists or service limits.",
          "Eligibility can involve both financial and functional review."
        ],
        watchOut: "LTSS is the long-term care world. It is different from a short-term Medicare-covered rehab stay."
      },
      {
        title: "Medicaid nursing facility coverage",
        definition: "Medicaid may cover nursing facility care for people who meet financial and medical eligibility requirements.",
        keyPoints: [
          "Different from Medicare short-term skilled nursing facility coverage.",
          "May apply when a person needs long-term care and qualifies under state rules.",
          "Facilities may have Medicaid beds, Medicaid-pending policies, and documentation requirements.",
          "Private-pay costs may apply while eligibility is pending."
        ],
        watchOut: "A family may need to ask which facilities accept Medicaid or Medicaid pending before a crisis discharge."
      },
      {
        title: "Medicaid is not instant",
        definition: "Eligibility can take time and require documentation.",
        keyPoints: [
          "Families may need proof of income, bank statements, resource information, insurance information, identity documents, medical records, level-of-care assessments, spousal information, and transfer history.",
          "Hospital financial counseling, case management, social work, the state Medicaid agency, Area Agency on Aging, SHIP counselors, or elder law attorneys may be useful depending on the issue.",
          "Rushed asset transfers or spend-down decisions can create problems."
        ],
        watchOut: "This site should not be used as Medicaid planning advice. State-specific rules and qualified help matter."
      },
      {
        title: "Questions to ask case management",
        keyPoints: [
          "Is this a Medicare skilled care issue or a Medicaid long-term care issue?",
          "Does the patient already have Medicaid?",
          "Could they qualify?",
          "Does the patient need a nursing facility level-of-care assessment?",
          "Which facilities accept Medicaid or Medicaid pending?",
          "Is home and community-based care possible?",
          "Are there waiting lists?",
          "Who helps with the application and documents?"
        ]
      }
    ],
    example: {
      title: "When Medicare says no",
      body: "A patient no longer qualifies for skilled rehab but cannot safely live alone. The family cannot afford private-pay care for months. The discharge conversation shifts from Medicare skilled coverage to Medicaid long-term services and supports, state eligibility, facility acceptance, documents, and a realistic transition plan."
    },
    commonMistakes: [
      "Waiting until discharge day to ask whether Medicaid may apply.",
      "Assuming Medicaid approval is immediate.",
      "Assuming every facility accepts Medicaid pending.",
      "Confusing Medicare short-term rehab with Medicaid long-term care.",
      "Making rushed spend-down or asset-transfer decisions without qualified advice.",
      "Assuming home and community-based services are always available right away."
    ],
    takeaway: "Medicare may cover short-term skilled recovery care. Medicaid may cover long-term services and supports for people who qualify under state rules. Understanding that difference makes discharge and long-term care conversations more honest and less shocking.",
    sources: [
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.medicaidEligibility,
      SOURCE_PRESETS.cmsMedicaidCoordination,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicareSnf,
      SOURCE_PRESETS.kffMedicaid101,
      SOURCE_PRESETS.kffMedicareCoverageSnapshot
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
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools/insurance-visit-cost" },
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
    slug: "how-to-pick-retirement-investments-at-work",
    title: "How to Pick Retirement Investments at Work",
    category: "Retirement",
    readTime: "7 min read",
    promise: "A practical framework for choosing funds inside a workplace 403(b) or similar retirement plan.",
    audience: "Healthcare workers who enrolled in a workplace retirement plan and now need to choose investments without becoming a finance expert.",
    summary: "The simplest retirement investing decision for many workers is a low-cost target-date fund that roughly matches their expected retirement year. Another simple approach is a diversified mix of broad index funds. The biggest mistakes are not investing contributions, missing the employer match, paying high fees without understanding them, and changing investments based on short-term market fear.",
    body: [
      "Choosing investments inside a 403(b), 401(k), or similar workplace plan can feel harder than signing up for the plan itself.",
      "Most employees are not given a class on expense ratios, target-date funds, asset allocation, bonds, index funds, or default investments. They are just handed a fund menu and expected to choose.",
      "This guide is educational, not individualized investment advice. The right choice depends on your goals, age, risk tolerance, other accounts, plan options, and whether you need help from a qualified professional."
    ],
    sections: [
      {
        title: "Start with the employer match",
        definition: "The employer match is money your employer may contribute when you contribute enough under plan rules.",
        keyPoints: [
          "Missing a match is one of the most expensive workplace benefit mistakes.",
          "Match formulas are plan-specific, so read your benefits guide.",
          "The match is separate from the investments you choose."
        ],
        watchOut: "Contributing money is not the same as investing it. Make sure contributions are actually going into the intended fund, not sitting in a default cash option."
      },
      {
        title: "Target-date fund",
        definition: "A diversified fund designed around an expected retirement year, such as 2055 or 2060.",
        keyPoints: [
          "It usually holds a mix of stocks and bonds.",
          "It generally becomes more conservative as the target year approaches.",
          "It can be a simple one-fund default for people who do not want to manage a portfolio manually."
        ],
        watchOut: "Compare fees. Target-date funds can be low-cost or expensive depending on the plan and provider."
      },
      {
        title: "Broad index funds",
        definition: "Funds that track large parts of the market rather than trying to pick individual winners.",
        keyPoints: [
          "Examples may include U.S. stock index, international stock index, and bond index funds.",
          "They are often lower cost than actively managed funds.",
          "They require the worker to choose and maintain an allocation."
        ],
        watchOut: "Simple does not mean risk-free. Stock index funds can fall sharply in bad markets."
      },
      {
        title: "Expense ratio",
        definition: "The annual cost of owning a fund, shown as a percentage of assets.",
        keyPoints: [
          "Lower fees leave more return in your account over time.",
          "A small-looking percentage can matter over decades.",
          "Compare similar funds before choosing."
        ],
        watchOut: "Do not assume the fund with the longest name or best recent performance is the best option. Fees and diversification matter."
      },
      {
        title: "Decision checklist",
        keyPoints: [
          "Am I contributing enough to capture the match, if available?",
          "Are my contributions invested, not parked in cash by accident?",
          "Is there a low-cost target-date fund that fits my timeline?",
          "If building my own mix, am I diversified across major asset classes?",
          "Do I understand the expense ratios?",
          "Can I stick with this during market declines?"
        ]
      }
    ],
    example: {
      title: "A simple nurse-friendly setup",
      body: "A 28-year-old hospital employee opens the 403(b) menu and sees 30 funds. Instead of picking five random funds based on recent returns, they look for a low-cost target-date fund near their expected retirement year. They choose one diversified fund, confirm future contributions are invested there, and review once or twice a year instead of reacting to every market headline."
    },
    relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-contribution" },
    commonMistakes: [
      "Missing the employer match.",
      "Assuming enrollment automatically means the money is invested well.",
      "Picking funds based only on recent performance.",
      "Ignoring expense ratios.",
      "Changing the whole portfolio every time the market falls."
    ],
    takeaway: "For many healthcare workers, a low-cost target-date fund or a simple diversified index-fund mix is enough. The priority is contributing consistently, capturing the match when available, keeping fees reasonable, and avoiding emotional changes.",
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.federalReserve],
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
    relatedCalculator: { label: "Hospital Café Savings Rate Calculator", href: "/tools/hospital-cafe-savings" },
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
    relatedCalculator: { label: "Healthcare Worker Discount Value Checker", href: "/tools/healthcare-worker-discount-value" },
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
    relatedCalculator: { label: "Post-Shift Recovery Budget Calculator", href: "/tools/post-shift-recovery-budget" },
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
