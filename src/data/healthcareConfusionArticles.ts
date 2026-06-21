import type { Article } from "./articles";

const CMS_MEDICAL_BILL_RIGHTS = {
  name: "CMS",
  pageTitle: "Medical Bill Rights and No Surprises Act protections",
  url: "https://www.cms.gov/medical-bill-rights",
  note: "Federal overview of surprise billing protections, good faith estimates, and complaint options."
};

const CMS_KNOW_RIGHTS = {
  name: "CMS",
  pageTitle: "Know Your Rights: No Surprises Act",
  url: "https://www.cms.gov/medical-bill-rights/know-your-rights",
  note: "Explains when federal surprise billing protections apply and key exceptions."
};

const MEDICARE_HOSPITAL_BENEFITS = {
  name: "Medicare.gov",
  pageTitle: "Medicare Hospital Benefits",
  url: "https://www.medicare.gov/publications/11435-Medicare-Hospital-Benefits.pdf",
  note: "Official Medicare fact sheet explaining inpatient, outpatient, and observation status."
};

const HEALTHCARE_ALLOWED_AMOUNT = {
  name: "HealthCare.gov",
  pageTitle: "Allowed amount glossary",
  url: "https://www.healthcare.gov/glossary/allowed-amount/",
  note: "Official definition of allowed amount for covered health care services."
};

const HEALTHCARE_BALANCE_BILLING = {
  name: "HealthCare.gov",
  pageTitle: "Balance billing glossary",
  url: "https://www.healthcare.gov/glossary/balance-billing/",
  note: "Official definition of balance billing and its relationship to allowed amounts."
};

const HEALTHCARE_PREAUTHORIZATION = {
  name: "HealthCare.gov",
  pageTitle: "Preauthorization glossary",
  url: "https://www.healthcare.gov/glossary/preauthorization/",
  note: "Official definition of preauthorization and warning that approval is not a payment guarantee."
};

const HEALTHCARE_NETWORK = {
  name: "HealthCare.gov",
  pageTitle: "Network glossary",
  url: "https://www.healthcare.gov/glossary/network/",
  note: "Official definition of health plan provider networks."
};

const IRS_FAP = {
  name: "IRS",
  pageTitle: "Financial assistance policy and emergency medical care policy - Section 501(r)(4)",
  url: "https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4",
  note: "Official nonprofit hospital financial assistance policy requirements."
};

const IRS_LIMITATION_ON_CHARGES = {
  name: "IRS",
  pageTitle: "Limitation on charges - Section 501(r)(5)",
  url: "https://www.irs.gov/charities-non-profits/limitation-on-charges-section-501r5",
  note: "Official rules limiting charges for FAP-eligible patients at charitable hospitals."
};

const IRS_BILLING_COLLECTIONS = {
  name: "IRS",
  pageTitle: "Billing and collections - Section 501(r)(6)",
  url: "https://www.irs.gov/charities-non-profits/billing-and-collections-section-501r6",
  note: "Official rules on reasonable efforts before certain extraordinary collection actions."
};

const CMS_HOSPITAL_PRICE_TRANSPARENCY = {
  name: "CMS",
  pageTitle: "Hospital Price Transparency",
  url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
  note: "CMS overview of hospital price transparency requirements for standard charges and shoppable services."
};

export const HEALTHCARE_CONFUSION_ARTICLES: Article[] = [
  {
    slug: "why-one-hospital-visit-can-create-multiple-bills",
    title: "Why One Hospital Visit Can Create Multiple Bills",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Understand why a single ER visit, surgery, or hospital stay can produce separate bills from different groups.",
    audience: "Patients, caregivers, and healthcare workers explaining why one episode of care can create more than one medical bill.",
    summary: "A hospital visit is often not billed like one simple purchase. The facility may bill for the hospital space, supplies, equipment, nursing support, labs, imaging, medications, and overhead. Clinicians or outside groups may bill separately for professional work, interpretation, anesthesia, pathology, ambulance transport, or follow-up services. A second bill is not automatically a duplicate, but it should match the date, provider, service, and Explanation of Benefits.",
    body: [
      "A hospital visit can feel like one event to the patient, but the billing system may treat it as several connected services.",
      "That is why one ER visit, surgery, or admission can create multiple bills from the hospital, emergency physician group, anesthesiology group, radiology group, lab, pathology group, ambulance company, or a separate outpatient department.",
      "The practical rule is not to panic and not to pay blindly. Match each bill to the date of service, provider name, service description, insurance Explanation of Benefits, and patient responsibility."
    ],
    sections: [
      {
        title: "The core idea",
        definition: "One visit can involve more than one billing entity.",
        keyPoints: [
          "The hospital or facility may bill for the building, staff support, equipment, supplies, medications, and facility resources.",
          "A clinician group may bill separately for professional services.",
          "Radiology, anesthesia, pathology, lab, or ambulance services may generate separate claims.",
          "Separate bills can arrive weeks apart."
        ],
        watchOut: "Do not assume every second bill is a duplicate, but do not pay it until it matches the EOB."
      },
      {
        title: "Common bills after one visit",
        keyPoints: [
          "Hospital or facility bill.",
          "Emergency physician, hospitalist, surgeon, or APP professional bill.",
          "Radiology bill for reading an X-ray, CT, MRI, or ultrasound.",
          "Anesthesia bill for procedures or surgery.",
          "Pathology or lab bill for testing or tissue interpretation.",
          "Ambulance bill if transport was involved."
        ]
      },
      {
        title: "How to check whether it is legitimate",
        keyPoints: [
          "Match the date of service.",
          "Match the provider or facility name.",
          "Match the insurance claim or EOB when available.",
          "Compare billed charge, allowed amount, insurance payment, adjustment, and patient responsibility.",
          "Ask whether the bill is facility, professional, lab, imaging, anesthesia, pathology, or transport."
        ]
      },
      {
        title: "Why this feels unfair",
        definition: "The patient experiences one event, while the billing system separates organizations, contracts, provider groups, and claim types.",
        keyPoints: [
          "The bedside experience is simple: you got care in one place.",
          "The payment system is not simple: several entities may have provided billable services.",
          "Insurance may process each claim separately with different cost-sharing rules.",
          "A delayed bill can feel like a surprise even when it relates to the same original visit."
        ],
        watchOut: "The emotional reaction is understandable. The next step is documentation, not automatic payment."
      }
    ],
    example: {
      title: "A simple ER example",
      body: "A patient goes to the ER for abdominal pain. They receive a facility charge, an emergency clinician bill, a CT scan facility charge, a radiologist interpretation bill, lab charges, and a medication charge. The visit was one experience, but the claims can come from several billing entities."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Assuming every separate bill is a duplicate.",
      "Paying a provider bill before insurance finishes processing.",
      "Ignoring small separate bills until they become collections issues.",
      "Comparing a provider bill to the wrong EOB.",
      "Forgetting ambulance, radiology, anesthesia, pathology, or lab bills can arrive separately."
    ],
    takeaway: "One hospital visit can create multiple bills because multiple entities may be involved in the care. Match each bill to the EOB before paying, and ask what type of bill it is.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_BALANCE_BILLING, CMS_KNOW_RIGHTS]
  },
  {
    slug: "facility-fee-vs-professional-fee",
    title: "Facility Fee vs Professional Fee: Why You May Get Charged Twice",
    category: "Hospital Bills",
    readTime: "5 min read",
    promise: "Separate the building charge from the clinician charge so hospital bills make more sense.",
    audience: "Patients and healthcare workers who see separate hospital and clinician bills for the same encounter.",
    summary: "A facility fee is the charge from the hospital, outpatient department, surgery center, or clinic setting. A professional fee is the charge for the clinician's work. A patient may receive both because the facility and the clinician are often paid through separate claims. The important question is not whether two bills exist. The important question is whether each bill matches the service provided, the insurance EOB, and the plan's allowed amount.",
    body: [
      "The phrase facility fee sounds like a made-up charge, but it reflects a real structure in healthcare billing.",
      "The facility bill is tied to the location and resources used. The professional bill is tied to the clinician's work. A hospital outpatient clinic, ER, imaging center, or procedure area may create both.",
      "This does not mean the bill is automatically correct. It means the patient should know what each charge is supposed to represent before disputing or paying it."
    ],
    sections: [
      {
        title: "Facility fee",
        definition: "The facility's charge for the care setting and resources used during the visit.",
        keyPoints: [
          "Can apply in hospital outpatient departments, emergency departments, surgery centers, infusion areas, imaging departments, and procedure areas.",
          "May reflect room use, equipment, nursing support, supplies, medications, registration, and overhead.",
          "Often appears on a hospital or facility statement."
        ],
        watchOut: "A clinic inside a hospital system may bill differently from an independent physician office."
      },
      {
        title: "Professional fee",
        definition: "The clinician's charge for evaluation, management, interpretation, procedure work, or medical decision-making.",
        keyPoints: [
          "Can come from a physician, APP, radiologist, anesthesiologist, pathologist, surgeon, hospitalist, or emergency clinician group.",
          "May arrive separately from the hospital bill.",
          "Insurance may process it under a different claim number than the facility charge."
        ]
      },
      {
        title: "Why both can happen",
        keyPoints: [
          "The facility and clinician may be separate billing entities.",
          "A hospital owns or operates the care setting, while a clinician group bills for professional work.",
          "A radiologist may bill for interpreting an image even if the hospital billed for performing the image.",
          "An anesthesiologist may bill separately from the operating room or facility charge."
        ]
      },
      {
        title: "What to ask before paying",
        keyPoints: [
          "Is this the facility fee or professional fee?",
          "Which date of service does it match?",
          "Which EOB matches this claim?",
          "Was the provider in-network?",
          "What is the allowed amount and patient responsibility?",
          "Is financial assistance available for this bill?"
        ]
      }
    ],
    example: {
      title: "Imaging bill example",
      body: "A patient gets a CT scan at a hospital outpatient department. The hospital may bill for the scanner, staff, contrast, supplies, and facility resources. A radiologist may bill separately for reading the CT and writing the report."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Calling every two-part bill a duplicate without checking the billing entity.",
      "Ignoring professional bills that arrive after the hospital bill.",
      "Assuming a facility fee means the clinician was paid already.",
      "Paying before comparing both claims to their EOBs.",
      "Forgetting to ask whether hospital financial assistance applies to the facility bill and which outside groups are excluded."
    ],
    takeaway: "A facility fee and professional fee can both relate to the same visit. The patient should verify what each bill represents, whether insurance processed it correctly, and whether assistance or correction is available.",
    sources: [HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_BALANCE_BILLING, CMS_MEDICAL_BILL_RIGHTS, CMS_HOSPITAL_PRICE_TRANSPARENCY]
  },
  {
    slug: "observation-vs-inpatient-status",
    title: "Observation vs Inpatient Status: The Hospital Word That Can Change the Bill",
    category: "Medicare",
    readTime: "7 min read",
    promise: "Understand why staying overnight does not always mean a patient was formally admitted as an inpatient.",
    audience: "Patients, caregivers, healthcare workers, and families trying to understand hospital status, Medicare cost-sharing, and discharge planning.",
    summary: "Hospital status matters. A patient can spend the night in the hospital and still be considered outpatient under observation status if a formal inpatient admission order was not written. That distinction can affect Medicare cost-sharing and whether a later skilled nursing facility stay qualifies under Medicare rules. Families should ask early: Is the patient inpatient, outpatient, or under observation? What date and time did inpatient admission start, if it started at all?",
    body: [
      "Observation status is one of the most confusing hospital terms because it conflicts with common sense.",
      "Most people think sleeping in a hospital bed means inpatient admission. Medicare's own hospital benefits materials warn that a person may still be considered outpatient even after spending the night in the hospital if the doctor has not written an inpatient admission order.",
      "This matters most when the patient may need skilled nursing facility care after discharge or when the family is trying to understand Part A versus Part B cost-sharing."
    ],
    sections: [
      {
        title: "Inpatient status",
        definition: "A formal hospital admission that starts when a doctor writes an order admitting the patient as an inpatient and the hospital formally admits the patient.",
        keyPoints: [
          "Usually paid under Medicare Part A for covered hospital services.",
          "The day before discharge is generally the last inpatient day.",
          "Inpatient days can matter for certain post-hospital skilled nursing facility coverage rules.",
          "The status should be documented, not assumed."
        ]
      },
      {
        title: "Observation status",
        definition: "Outpatient hospital services used to help the doctor decide whether the patient needs inpatient admission or can be discharged.",
        keyPoints: [
          "Can occur in the emergency department or another hospital area.",
          "The patient may be in a hospital bed and still be outpatient.",
          "Medicare Part B cost-sharing may apply to outpatient hospital services.",
          "Observation time generally does not count the same as formal inpatient admission for Medicare SNF coverage rules."
        ],
        watchOut: "Do not use overnight stay as the test. Ask what the official status is."
      },
      {
        title: "Why families should ask early",
        keyPoints: [
          "Discharge planning may depend on whether Medicare sees the stay as inpatient or outpatient.",
          "The patient may need rehab, SNF care, home health, or DME after leaving.",
          "The status can affect how hospital services are billed.",
          "Changing status later can be difficult, so ask while the patient is still there."
        ]
      },
      {
        title: "Questions to ask",
        keyPoints: [
          "Is the patient inpatient, outpatient, or observation?",
          "Was a formal inpatient order written?",
          "What date and time did inpatient status begin?",
          "Could the status affect skilled nursing facility coverage?",
          "Who can explain the billing and discharge implications?",
          "Can case management or utilization review explain the status decision?"
        ]
      }
    ],
    example: {
      title: "Overnight but outpatient",
      body: "A Medicare patient goes to the ER, is moved to a hospital bed, receives labs and imaging, and stays overnight. The family assumes the patient was admitted. Later, they learn the stay was observation status, which is outpatient, because there was no formal inpatient admission order."
    },
    relatedCalculator: { label: "Medicare Cost Exposure Tool", href: "/tools#medicare" },
    commonMistakes: [
      "Assuming overnight equals inpatient.",
      "Waiting until discharge day to ask about status.",
      "Assuming the room location proves the billing status.",
      "Confusing medical seriousness with Medicare billing classification.",
      "Planning SNF placement without asking whether Medicare coverage criteria are met."
    ],
    takeaway: "Hospital status is not based only on where the patient sleeps. Ask whether the patient is inpatient, outpatient, or observation, and ask early enough for the answer to matter.",
    sources: [MEDICARE_HOSPITAL_BENEFITS]
  },
  {
    slug: "in-network-hospital-out-of-network-bills",
    title: "In-Network Hospital Does Not Always Mean Every Bill Is In-Network",
    category: "Insurance",
    readTime: "6 min read",
    promise: "Understand why separate clinicians or services can create network surprises even when the hospital itself is covered.",
    audience: "Patients, caregivers, and healthcare workers trying to understand network status, balance billing, and surprise bill protections.",
    summary: "A hospital can be in-network while a specific clinician group, ambulance service, lab, anesthesiology group, radiology group, or pathology group is separate. Federal No Surprises Act protections can limit certain unexpected out-of-network bills for emergency care, certain non-emergency care at in-network facilities, and air ambulance services, but not every situation is protected. Ground ambulance bills are a major exception unless state law applies.",
    body: [
      "Network status is not always one clean yes or no. A hospital, doctor group, lab, ambulance company, imaging group, and anesthesia group may each have different contracts.",
      "That is why a patient can choose an in-network hospital and still receive a bill connected to a separate out-of-network entity.",
      "Federal surprise billing protections help in important situations, but patients still need to understand the remaining gaps and compare every bill to the EOB."
    ],
    sections: [
      {
        title: "Network",
        definition: "The group of doctors, hospitals, pharmacies, and other providers that contract with a health plan.",
        keyPoints: [
          "In-network care usually costs less because the provider has a contract with the plan.",
          "Out-of-network care may cost more or may not be covered except in certain situations.",
          "Different entities involved in one visit can have different network status.",
          "The network question should be asked by provider, facility, and service type."
        ]
      },
      {
        title: "Why an in-network hospital can still create surprises",
        keyPoints: [
          "The emergency physician group may be separate from the hospital.",
          "The anesthesiology group may have a separate contract.",
          "Radiology or pathology interpretation may be billed by another group.",
          "Ambulance services may not be contracted with the same plan.",
          "A lab or imaging site may be billed differently than expected."
        ]
      },
      {
        title: "Where federal protections may help",
        keyPoints: [
          "Emergency room visits are a major No Surprises Act protection category for many privately insured patients.",
          "Some non-emergency out-of-network care connected to an in-network hospital, hospital outpatient department, or ambulatory surgical center may be protected.",
          "Air ambulance services are included in federal protections.",
          "Patients can submit complaints when they believe the rules were not followed."
        ],
        watchOut: "Ground ambulance services are generally not covered by federal No Surprises Act protections unless a state law has different rules."
      },
      {
        title: "What to do with a surprise network bill",
        keyPoints: [
          "Compare the bill to the EOB.",
          "Ask whether the claim should be protected under the No Surprises Act.",
          "Ask the insurer to reprocess if it looks incorrectly treated as out-of-network.",
          "Ask the provider for the claim number, tax ID, and network explanation.",
          "Use CMS complaint resources if the bill appears to violate federal protections."
        ]
      }
    ],
    example: {
      title: "The in-network ER with a separate bill",
      body: "A patient goes to an in-network ER. The hospital bill processes in-network, but a separate physician group sends a higher out-of-network bill. Depending on the facts, the patient may have No Surprises Act protections and should ask the insurer and provider to review the claim before paying."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Assuming one network check covers every provider involved.",
      "Paying an out-of-network bill before asking whether surprise billing protections apply.",
      "Ignoring ground ambulance exceptions.",
      "Assuming a denied or out-of-network claim is always final.",
      "Not calling both the insurer and the billing provider."
    ],
    takeaway: "In-network facility status is important, but it does not automatically answer every network question. Separate groups can bill separately, and surprise billing protections should be checked before paying. ",
    sources: [CMS_KNOW_RIGHTS, CMS_MEDICAL_BILL_RIGHTS, HEALTHCARE_NETWORK, HEALTHCARE_BALANCE_BILLING]
  },
  {
    slug: "allowed-amount-medical-bills",
    title: "Allowed Amount: The Number That Actually Matters on a Medical Bill",
    category: "Insurance",
    readTime: "5 min read",
    promise: "Learn why the billed charge is not always the number your insurance uses to calculate your share.",
    audience: "Patients, caregivers, and healthcare workers trying to understand EOBs, hospital bills, and negotiated insurance pricing.",
    summary: "The allowed amount is the amount the health plan recognizes for a covered service. It can be much lower than the provider's original billed charge. Deductibles, copays, coinsurance, insurance payment, write-offs, and patient responsibility are often calculated from the allowed amount rather than the sticker price. If the provider bill does not match the EOB patient responsibility, call before paying.",
    body: [
      "The allowed amount is one of the most important numbers on an EOB, but most people skip over it.",
      "A provider may bill one number. The plan may allow another. The patient's share is usually calculated through plan rules using the allowed amount, not simply the original billed charge.",
      "Understanding this one line can prevent overpayment, panic, and incorrect assumptions about what a medical service really cost under the plan."
    ],
    sections: [
      {
        title: "Allowed amount",
        definition: "The plan-approved or recognized amount for a covered service.",
        keyPoints: [
          "May also be called eligible expense, payment allowance, or negotiated rate depending on the document.",
          "Can be lower than the provider's original billed charge.",
          "Deductible, coinsurance, and plan payment often flow from this number.",
          "The allowed amount may work differently for out-of-network care."
        ]
      },
      {
        title: "Billed charge",
        definition: "The amount the provider initially submits before insurance adjustments.",
        keyPoints: [
          "This can look much higher than the allowed amount.",
          "It is not automatically the amount the patient owes.",
          "The EOB should show how insurance adjusted the charge.",
          "The provider bill should generally line up with the final patient responsibility after processing."
        ],
        watchOut: "Do not pay a billed charge just because it appears first. Wait for insurance processing when possible."
      },
      {
        title: "Balance billing",
        definition: "When a provider bills the patient for the difference between the provider charge and the allowed amount.",
        keyPoints: [
          "A preferred or in-network provider may not balance bill for covered services under normal plan contract rules.",
          "Out-of-network situations can be more complicated.",
          "Federal surprise billing protections may apply in certain emergency and facility-based situations.",
          "The EOB should help identify what the plan says the patient owes."
        ]
      },
      {
        title: "How to read the EOB math",
        keyPoints: [
          "Start with billed charge.",
          "Find the allowed amount.",
          "Look for plan discount or adjustment.",
          "Check insurance paid.",
          "Check patient responsibility.",
          "Compare patient responsibility to the provider bill."
        ]
      }
    ],
    example: {
      title: "The bill is not the allowed amount",
      body: "A hospital bills $5,000. The plan allowed amount is $1,800. Insurance pays $1,200 and assigns $600 to the patient. The patient should not assume they owe $5,000. The key number to compare with the provider bill is the $600 patient responsibility shown on the EOB."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Reacting to the billed charge before insurance processing.",
      "Ignoring the allowed amount line on the EOB.",
      "Paying the provider more than the EOB says is patient responsibility without asking why.",
      "Confusing insurance adjustment with insurance payment.",
      "Assuming the allowed amount works the same out-of-network as in-network."
    ],
    takeaway: "The billed charge gets attention, but the allowed amount usually drives the insurance math. Match the provider bill to the EOB before paying. ",
    sources: [HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_BALANCE_BILLING, CMS_MEDICAL_BILL_RIGHTS]
  },
  {
    slug: "prior-authorization-explained",
    title: "Prior Authorization: Why Doctor-Recommended Does Not Always Mean Insurance-Approved",
    category: "Insurance",
    readTime: "6 min read",
    promise: "Understand why a recommended test, drug, procedure, or piece of equipment may still need plan approval.",
    audience: "Patients, caregivers, and healthcare workers explaining delays, denials, and approval requirements for covered care.",
    summary: "Prior authorization, also called preauthorization, prior approval, or precertification, is a health plan decision that a service, treatment, prescription drug, or durable medical equipment is medically necessary before the plan agrees to cover it. It may be required before certain non-emergency services. Even an authorization is not always a guarantee that the plan will pay the full cost, because eligibility, coding, network status, deductible, and final claim processing still matter.",
    body: [
      "Prior authorization is one of the most frustrating parts of healthcare because it separates clinical recommendation from payment approval.",
      "A clinician can recommend an MRI, medication, home oxygen, CPAP, surgery, infusion, rehab stay, or durable medical equipment. The health plan may still require review before it agrees the service meets plan rules.",
      "The practical question is not only whether the clinician thinks it is needed. It is whether the payer has approved it under the plan's coverage rules and what cost-sharing still applies."
    ],
    sections: [
      {
        title: "Prior authorization",
        definition: "A health plan decision that a service, treatment plan, prescription drug, or DME is medically necessary before the plan covers it.",
        keyPoints: [
          "Also called preauthorization, prior approval, or precertification.",
          "Often applies to expensive imaging, procedures, medications, home services, equipment, and facility care.",
          "Usually does not apply the same way in emergencies.",
          "Approval does not always guarantee final payment."
        ],
        watchOut: "Doctor-recommended and insurance-approved are not the same step."
      },
      {
        title: "Why it delays care",
        keyPoints: [
          "The provider may need to submit records, diagnosis codes, clinical notes, and medical necessity documentation.",
          "The insurer may request more information.",
          "A request can be approved, denied, partially approved, or redirected to a different service or site of care.",
          "Timing can affect discharge planning, imaging, procedures, medications, home health, rehab, or DME."
        ]
      },
      {
        title: "Approval is not a blank check",
        keyPoints: [
          "The patient may still owe deductible, copay, or coinsurance.",
          "The provider and facility still need to be in-network when required.",
          "The final claim must be coded and billed correctly.",
          "The patient must still be eligible and covered on the date of service.",
          "A different service than the one approved may process differently."
        ]
      },
      {
        title: "What to ask",
        keyPoints: [
          "Does this require prior authorization?",
          "Who is responsible for submitting it?",
          "Has it been approved, denied, or still pending?",
          "What service, date range, provider, and location were approved?",
          "What is the authorization number?",
          "What will I owe after deductible, copay, or coinsurance?"
        ]
      }
    ],
    example: {
      title: "The MRI that is ordered but not approved yet",
      body: "A clinician orders an MRI for back pain. The imaging center schedules it, but the insurer requires prior authorization. If the patient gets the MRI before approval, the plan may deny or delay payment. The safer path is to confirm the authorization number, approved location, and expected patient cost before the appointment when possible."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Assuming an order means insurance approval.",
      "Assuming authorization means the service is free.",
      "Not checking whether the approved site is in-network.",
      "Not getting the authorization number.",
      "Forgetting that approval can be limited by date range, service code, or provider."
    ],
    takeaway: "Prior authorization is the payer's approval step, not the clinician's recommendation. Confirm approval, location, date range, and expected cost before scheduled care when possible.",
    sources: [HEALTHCARE_PREAUTHORIZATION, HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_NETWORK]
  },
  {
    slug: "check-hospital-financial-assistance-before-paying",
    title: "Before You Pay a Hospital Bill, Check Financial Assistance",
    category: "Hospital Bills",
    readTime: "7 min read",
    promise: "Know when to ask for charity care or financial assistance before draining savings or using a credit card.",
    audience: "Patients, families, caregivers, and healthcare workers helping someone respond to a large hospital bill.",
    summary: "Many nonprofit hospitals must have a written financial assistance policy for emergency and other medically necessary care. The policy must explain who qualifies, how to apply, how amounts are calculated, and which providers are covered or not covered. Patients should ask for the financial assistance policy, plain-language summary, application, itemized bill, and EOB before paying a large balance. Do not assume a payment plan is the same as financial assistance.",
    body: [
      "A large hospital bill can make people panic and reach for a credit card. That can be a mistake.",
      "Before paying a major hospital balance, patients should check whether the hospital has a financial assistance policy, whether they might qualify, whether the bill has fully processed through insurance, and whether separate clinician bills are covered by the same policy.",
      "This article is not legal advice and does not guarantee eligibility. It is a checklist for asking the right questions before money leaves the bank account."
    ],
    sections: [
      {
        title: "Financial assistance policy",
        definition: "A hospital policy explaining when free or discounted medically necessary care may be available.",
        keyPoints: [
          "Nonprofit hospitals subject to Section 501(r) must establish a written financial assistance policy.",
          "The policy must explain eligibility criteria and how to apply.",
          "It must explain how amounts charged to patients are calculated.",
          "It must list providers delivering emergency or medically necessary care in the facility and state which are covered by the policy and which are not."
        ],
        watchOut: "A hospital financial assistance policy may not cover every outside physician group that bills separately."
      },
      {
        title: "Ask before paying",
        keyPoints: [
          "Can I get the financial assistance policy and plain-language summary?",
          "Can I get the application?",
          "Is this bill fully processed by insurance?",
          "Can I get an itemized bill?",
          "Does assistance apply to this specific bill and provider?",
          "Could separate physician, radiology, anesthesia, pathology, or lab bills qualify?",
          "Would a payment plan prevent or delay financial assistance review?"
        ]
      },
      {
        title: "Payment plan vs financial assistance",
        definition: "A payment plan spreads the bill out. Financial assistance may reduce the bill if the patient qualifies.",
        keyPoints: [
          "A payment plan can help cash flow but may not reduce the total balance.",
          "Financial assistance may discount or forgive eligible balances under the policy.",
          "A patient can ask about both, but should not confuse one for the other.",
          "The best first step is usually to understand eligibility before committing to payments."
        ]
      },
      {
        title: "Collection risk",
        keyPoints: [
          "Hospitals subject to Section 501(r) have billing and collection requirements.",
          "The rules address reasonable efforts before certain extraordinary collection actions.",
          "Patients should keep copies of applications, bills, EOBs, letters, and call notes.",
          "Ignoring the bill is risky even if the bill feels unfair."
        ],
        watchOut: "Do not disappear. Call, document, and apply if the balance is unaffordable."
      }
    ],
    example: {
      title: "The credit card mistake",
      body: "A patient receives a $3,800 hospital bill after insurance. Before putting it on a credit card, they request the hospital's financial assistance application, itemized bill, and EOB match. They learn they qualify for a partial discount. The balance is reduced before any payment plan is arranged."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Putting a large hospital bill on a credit card before asking about assistance.",
      "Assuming a payment plan is the only option.",
      "Not asking whether separate provider bills are covered by the hospital policy.",
      "Applying without keeping copies of documents.",
      "Ignoring deadlines, letters, or collection notices."
    ],
    takeaway: "Before paying a large hospital balance, ask for financial assistance, an itemized bill, the EOB, and the list of covered providers. A payment plan spreads cost out; assistance may reduce it.",
    sources: [IRS_FAP, IRS_LIMITATION_ON_CHARGES, IRS_BILLING_COLLECTIONS, CMS_MEDICAL_BILL_RIGHTS]
  }
];
