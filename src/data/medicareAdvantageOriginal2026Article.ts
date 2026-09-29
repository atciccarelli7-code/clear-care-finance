import type { Article } from "./articles";

export const MEDICARE_ADVANTAGE_ORIGINAL_2026_ARTICLE: Article = {
  slug: "medicare-advantage-vs-original-medicare-2026",
  title: "Medicare Advantage vs Original Medicare in 2026",
  category: "Medicare",
  readTime: "8 min read",
  promise: "Compare Medicare Advantage and Original Medicare using the 2026 costs, network rules, prior authorization friction, and patient-centered questions that families should check before choosing coverage.",
  audience: "Older adults, caregivers, patients, families, and healthcare workers helping someone compare Medicare Advantage, Original Medicare, Part D, and Medigap options for 2026.",
  summary: "Medicare Advantage and Original Medicare are two different ways to receive Medicare coverage. Medicare Advantage may bundle drug coverage and extra benefits, and it must cap covered Part A and Part B out-of-pocket costs. Original Medicare usually offers broader doctor and hospital choice, but it does not have a built-in yearly out-of-pocket maximum unless the person has Medigap, Medicaid, employer retiree coverage, union coverage, or another supplement. In 2026, the decision should come down to doctors, hospitals, medications, premiums, out-of-pocket exposure, prior authorization rules, travel needs, post-hospital care, and whether the person can afford the plan if they actually get sick.",
  topCallout: {
    label: "2027 plan-year note",
    body: "As of September 29, 2026, CMS has not yet announced the official 2027 Part B standard premium or deductible. The 2026 Part B figures below remain the current official amounts for 2026.",
  },
  body: [
    "Medicare Advantage is not automatically better because it has a low premium. Original Medicare is not automatically safer unless the person understands the cost-sharing and supplemental coverage gap.",
    "The useful question is not which option sounds better in a brochure. The useful question is which coverage structure works when the patient needs specialists, hospital care, expensive medications, rehab, skilled nursing, home health, durable medical equipment, or care away from home.",
    "This guide is educational only. Medicare costs, provider networks, drug formularies, prior authorization rules, supplemental benefits, Medigap availability, Medicaid eligibility, and local plan details vary by plan, county, state, year, and personal situation. Use official Medicare resources, plan documents, and local counseling before enrolling."
  ],
  sections: [
    {
      title: "The 2026 headline",
      definition: "Medicare Advantage is the private-plan alternative to Original Medicare, and it now covers more than half of eligible Medicare beneficiaries.",
      keyPoints: [
        "KFF reports that 55% of eligible Medicare beneficiaries — about 35 million people with both Medicare Part A and Part B — are enrolled in Medicare Advantage in 2026.",
        "That makes Medicare Advantage a mainstream Medicare path, not a niche option.",
        "Popularity does not mean a plan is the right fit for every patient.",
        "The decision should be based on total cost, provider access, medications, prior authorization, travel, and post-hospital needs."
      ],
      watchOut: "A plan can be popular nationally and still be a poor fit for one patient’s doctors, hospital system, prescriptions, or county."
    },
    {
      title: "Original Medicare",
      definition: "The federal Medicare program made up of Part A hospital insurance and Part B medical insurance.",
      keyPoints: [
        "Usually lets a person use any doctor or hospital that accepts Medicare anywhere in the United States.",
        "Usually does not require Medicare Advantage-style referrals for specialists.",
        "Part B-covered services commonly leave the patient paying 20% of the Medicare-approved amount after the deductible unless supplemental coverage helps.",
        "Original Medicare does not include a built-in yearly out-of-pocket maximum for Part A and Part B services by itself.",
        "Many people add a standalone Part D drug plan and may consider Medigap, Medicaid, employer retiree coverage, or union coverage to reduce cost exposure."
      ],
      watchOut: "Original Medicare without a supplement can leave repeated deductibles and coinsurance with no built-in annual cap."
    },
    {
      title: "Medicare Advantage",
      definition: "A private Medicare-approved plan, also called Part C, that provides Part A and Part B benefits through the plan instead of direct Original Medicare billing.",
      keyPoints: [
        "Plans must cover medically necessary services that Original Medicare covers, but they can use networks, referrals, prior authorization, and plan-specific cost-sharing.",
        "Most plans include Part D prescription drug coverage, so the person may not need a separate drug plan.",
        "Many plans advertise extra benefits such as dental, vision, hearing, over-the-counter allowances, transportation, meals, or fitness benefits.",
        "Medicare Advantage plans must have a yearly out-of-pocket limit for covered Part A and Part B services.",
        "The patient usually still pays the Part B premium even when the Medicare Advantage plan has a $0 premium."
      ],
      watchOut: "A $0 premium can still come with copays, coinsurance, drug costs, network restrictions, and a meaningful bad-year out-of-pocket limit."
    },
    {
      title: "2026 cost numbers to know",
      definition: "The Medicare choice should be tested against real 2026 premiums, deductibles, and out-of-pocket exposure — not only monthly premiums.",
      keyPoints: [
        "CMS says the 2026 standard Part B premium is $202.90 per month and the annual Part B deductible is $283.",
        "CMS says the 2026 Part A inpatient hospital deductible is $1,736 per benefit period.",
        "CMS says 2026 skilled nursing facility coinsurance is $217 per day for days 21 through 100 of covered extended care services in a benefit period.",
        "KFF reports the 2026 average Medicare Advantage out-of-pocket limit is $5,421 for in-network services and $9,825 for in-network plus out-of-network services combined for PPOs.",
        "KFF reports that 2026 Medicare Advantage limits may not exceed $9,250 for in-network services and $13,900 for in-network plus out-of-network services combined."
      ],
      watchOut: "The worst-case year matters. A low monthly premium can still be stressful if the patient hits repeated copays, drug costs, hospital costs, or the plan’s out-of-pocket limit."
    },
    {
      title: "Doctor and hospital access",
      definition: "Provider access is one of the most practical differences between the two Medicare paths.",
      keyPoints: [
        "Original Medicare generally allows care from any doctor or hospital that takes Medicare in the United States.",
        "Medicare Advantage often requires the patient to use doctors, hospitals, pharmacies, rehab facilities, skilled nursing facilities, home health agencies, and DME suppliers in the plan’s network or service area for non-emergency care.",
        "Some PPO plans allow out-of-network care, but usually at higher cost and still subject to plan rules.",
        "Families should check the actual provider directory and then call key offices directly because directories can be outdated."
      ],
      watchOut: "Network problems usually show up when someone is sick, hospitalized, needs rehab, or needs a specialist — not when they are healthy and shopping plans."
    },
    {
      title: "Prior authorization",
      definition: "Prior authorization means the plan may require approval before it will cover certain services or medications.",
      keyPoints: [
        "KFF reports that nearly all Medicare Advantage enrollees, 99%, are in plans requiring prior authorization for some services in 2026.",
        "KFF reports prior authorization is especially common for higher-cost services such as inpatient hospital stays, skilled nursing facility stays, Part B drugs, and home health services.",
        "Traditional Medicare generally does not require prior authorization for services in the same way Medicare Advantage plans often do.",
        "Prior authorization can affect timing, discharge planning, rehab placement, home health approval, imaging, procedures, medications, and durable medical equipment."
      ],
      watchOut: "A medically reasonable care plan can still be delayed, denied, redirected, or shortened by authorization rules."
    },
    {
      title: "Drug coverage and Part D",
      definition: "Prescription drug coverage can be separate with Original Medicare or bundled into many Medicare Advantage plans.",
      keyPoints: [
        "Original Medicare usually needs a separate Part D plan for outpatient prescription drugs.",
        "Many Medicare Advantage plans include Part D drug coverage, often called MA-PD plans.",
        "Every medication should be checked by exact name, dose, tier, preferred pharmacy, mail-order option, quantity limit, step therapy rule, and prior authorization rule.",
        "KFF notes that Part D spending has a separate out-of-pocket limit of $2,100 in 2026."
      ],
      watchOut: "A plan can look good on medical costs and still be a bad fit if one expensive medication is poorly covered."
    },
    {
      title: "Dental, vision, hearing, and extras",
      definition: "Extra benefits can be useful, but the details are often narrower than the marketing language suggests.",
      keyPoints: [
        "Medicare Advantage plans often advertise dental, vision, hearing, over-the-counter, transportation, meals, or fitness benefits.",
        "Original Medicare generally does not cover most routine dental, vision, or hearing benefits by itself.",
        "Extra benefits may have networks, annual dollar caps, frequency limits, prior authorization, exclusions, or specific vendors.",
        "A dental benefit that covers cleanings may not meaningfully cover crowns, implants, dentures, or major dental work."
      ],
      watchOut: "Do not trade away provider access or medication coverage for an extra benefit unless the extra benefit is specific, valuable, and usable."
    },
    {
      title: "Medigap comparison",
      definition: "Medigap is private supplemental insurance that works with Original Medicare, not Medicare Advantage.",
      keyPoints: [
        "Medigap can help pay some Original Medicare deductibles, copays, and coinsurance depending on the policy.",
        "Medigap does not replace a Part D drug plan.",
        "A person generally cannot use Medigap to pay Medicare Advantage cost-sharing.",
        "Switching from Medicare Advantage back to Original Medicare plus Medigap later may involve underwriting or limited availability depending on timing and state rules."
      ],
      watchOut: "The Medigap decision is partly a timing decision. Do not assume someone can easily add Medigap later at the same price or with the same protections."
    },
    {
      title: "What I would check before choosing",
      definition: "The practical choice is the plan structure that works under stress, not the plan that looks simplest on the first page of the brochure.",
      keyPoints: [
        "Are the patient’s primary doctor, specialists, hospital system, preferred pharmacy, rehab facilities, home health agencies, and DME suppliers covered?",
        "Are all medications covered at a reasonable cost?",
        "What is the realistic bad-year cost if the patient is hospitalized or needs rehab?",
        "Is prior authorization required for imaging, procedures, Part B drugs, SNF care, home health, or equipment?",
        "Does the person travel, split time between states, or rely on out-of-area specialists?",
        "Can the person afford the premium plus the likely cost-sharing, not just the premium?"
      ],
      watchOut: "The best plan is not universal. It is patient-specific, medication-specific, provider-specific, county-specific, and year-specific."
    }
    {
      title: "Enrollment timing: what to do before December 7",
      definition: "Medicare Open Enrollment runs October 15 through December 7, 2026. Changes made during this period for 2027 coverage generally take effect January 1, 2027.",
      keyPoints: [
        "Recheck the 2027 provider network for the doctors, hospitals, pharmacies, rehab facilities, home health agencies, and DME suppliers the person expects to use.",
        "Recheck every recurring prescription on the 2027 formulary, including drug tier, preferred pharmacy, quantity limits, step therapy, and prior authorization.",
        "Review the plan’s 2027 prior-authorization and referral rules for services the person is likely to need.",
        "Compare the 2027 medical maximum out-of-pocket, copays, coinsurance, premiums, and supplemental benefits with the current plan rather than assuming the 2026 amounts carry forward.",
        "CMS set the 2027 defined-standard Part D deductible at $700 and the annual Part D out-of-pocket threshold at $2,400. A specific Part D or MA-PD plan may use a lower deductible, so verify the plan’s actual 2027 design."
      ],
      watchOut: "Open Enrollment is a comparison window, not a reason to switch automatically. A plan that worked in 2026 may still fit in 2027, but networks, formularies, benefits, and cost-sharing should be rechecked before December 7."
    },
  ],
  example: {
    title: "The plan that looked cheap until discharge",
    body: "A patient chooses a low-premium Medicare Advantage HMO because the primary doctor is in-network and the plan includes dental and vision benefits. Later, after a hospitalization, the family wants a specific rehab facility, but the facility is out-of-network and skilled nursing placement requires prior authorization. The premium was low, but the real issue became discharge friction, network fit, and approval timing."
  },
  relatedCalculator: { label: "Medicare Advantage Plan Helper", href: "/tools/medicare-advantage-plan-helper" },
  closingAction: {
    title: "Test the plan against the care you actually use",
    body: "Use the Medicare Advantage Plan Helper to put provider access, prescriptions, prior-authorization rules, and out-of-pocket exposure in one place. It does not choose a Medicare path for you; it makes the tradeoffs easier to verify before enrollment. Confirm final 2027 details with Medicare.gov and the plan’s current documents.",
    href: "/tools/medicare-advantage-plan-helper",
    cta: "Open the plan helper",
  },
  commonMistakes: [
    "Choosing a Medicare Advantage plan because the premium is low without checking the plan’s max out-of-pocket exposure.",
    "Assuming Original Medicare has an annual out-of-pocket maximum by itself.",
    "Forgetting that Medicare Advantage networks can affect hospitals, specialists, rehab, home health, pharmacies, and equipment suppliers.",
    "Assuming dental, vision, or hearing benefits are unlimited just because they are listed in the plan summary.",
    "Ignoring prior authorization until the patient needs imaging, rehab, home health, a procedure, or an expensive drug.",
    "Assuming Medigap can be added later without timing or underwriting concerns."
  ],
  takeaway: "For 2026, compare Medicare Advantage and Original Medicare by stress-testing the bad year: doctors, hospitals, prescriptions, prior authorization, rehab needs, travel, Part B premium, supplemental coverage, and maximum out-of-pocket exposure. The better choice is the one that still works when the patient actually needs care.",
  sources: [
    {
      name: "Medicare.gov",
      pageTitle: "Compare Original Medicare & Medicare Advantage",
      url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
      note: "Official Medicare comparison of provider access, referrals, costs, drug coverage, and out-of-pocket limits."
    },
    {
      name: "CMS",
      pageTitle: "2026 Medicare Parts A & B Premiums and Deductibles",
      url: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
      note: "Official 2026 Part A and Part B premium, deductible, and coinsurance amounts."
    },
    {
      name: "KFF",
      pageTitle: "Medicare Advantage in 2026: Enrollment Update and Key Trends",
      url: "https://www.kff.org/medicare/medicare-advantage-in-2026-enrollment-update-and-key-trends/",
      note: "Independent analysis of 2026 Medicare Advantage enrollment and market trends."
    },
    {
      name: "KFF",
      pageTitle: "Medicare Advantage in 2026: Premiums, Out-of-Pocket Limits, Supplemental Benefits, and Prior Authorization",
      url: "https://www.kff.org/medicare/medicare-advantage-in-2026-premiums-out-of-pocket-limits-supplemental-benefits-and-prior-authorization/",
      note: "Independent analysis of 2026 Medicare Advantage premiums, out-of-pocket limits, supplemental benefits, and prior authorization requirements."
    },
    {
      name: "Medicare.gov",
      pageTitle: "Medicare Plan Finder",
      url: "https://www.medicare.gov/plan-compare/",
      note: "Official tool to compare live Medicare Advantage, Part D, and Medigap options by location and medications."
    },
    {
      name: "Medicare.gov",
      pageTitle: "How Medigap works",
      url: "https://www.medicare.gov/health-drug-plans/medigap/basics/how-medigap-works",
      note: "Official explanation of how Medicare Supplement insurance works with Original Medicare."
    },
    {
      name: "Medicare.gov",
      pageTitle: "Medicare Open Enrollment",
      url: "https://www.medicare.gov/health-drug-plans/open-enrollment",
      note: "Official Medicare dates and effective-date guidance for October 15 through December 7 Open Enrollment and January 1 coverage changes."
    },
    {
      name: "CMS",
      pageTitle: "Announcement of Calendar Year (CY) 2027 Medicare Advantage Capitation Rates and Part C and Part D Payment Policies",
      url: "https://www.cms.gov/files/document/2027-announcement.pdf",
      note: "Official 2027 Part D defined-standard benefit parameters, including the $700 deductible and $2,400 annual out-of-pocket threshold."
    },
    {
      name: "CMS",
      pageTitle: "2026 Medicare Trustees Report",
      url: "https://www.cms.gov/oact/tr/2026",
      note: "CMS report distinguishing estimated future Part B financing from official beneficiary premium rates; official 2027 Part B premium and deductible had not been announced as of September 29, 2026."
    },
  ],
};
