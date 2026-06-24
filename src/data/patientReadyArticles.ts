import type { Article } from "./articles";

const CMS_MEDICAL_BILL_RIGHTS = {
  name: "CMS",
  pageTitle: "Medical Bill Rights and No Surprises Act protections",
  url: "https://www.cms.gov/medical-bill-rights",
  note: "Federal overview of medical billing rights, No Surprises Act protections, good faith estimates, patient-provider disputes, and complaint options.",
};

const CMS_NO_SURPRISES = {
  name: "CMS",
  pageTitle: "No Surprise Billing",
  url: "https://www.cms.gov/nosurprises",
  note: "Federal No Surprises Act policy hub for consumer protections, provider requirements, and dispute resources.",
};

const CMS_HOSPITAL_PRICE_TRANSPARENCY = {
  name: "CMS",
  pageTitle: "Hospital Price Transparency",
  url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
  note: "CMS overview of hospital price transparency requirements, including machine-readable files and shoppable-service displays.",
};

const HEALTHCARE_GLOSSARY = {
  name: "HealthCare.gov",
  pageTitle: "Health insurance glossary",
  url: "https://www.healthcare.gov/glossary/",
  note: "Official Marketplace glossary for common health insurance terms.",
};

const HEALTHCARE_ALLOWED_AMOUNT = {
  name: "HealthCare.gov",
  pageTitle: "Allowed amount glossary",
  url: "https://www.healthcare.gov/glossary/allowed-amount/",
  note: "Official definition of the plan-recognized amount for covered health care services.",
};

const HEALTHCARE_NETWORK = {
  name: "HealthCare.gov",
  pageTitle: "Network glossary",
  url: "https://www.healthcare.gov/glossary/network/",
  note: "Official definition of a health plan provider network.",
};

const HEALTHCARE_PREAUTHORIZATION = {
  name: "HealthCare.gov",
  pageTitle: "Preauthorization glossary",
  url: "https://www.healthcare.gov/glossary/preauthorization/",
  note: "Official definition of preauthorization and reminder that authorization is not a payment guarantee.",
};

const HEALTHCARE_DEDUCTIBLE = {
  name: "HealthCare.gov",
  pageTitle: "Deductible glossary",
  url: "https://www.healthcare.gov/glossary/deductible/",
  note: "Official Marketplace definition for deductibles.",
};

const HEALTHCARE_COPAYMENT = {
  name: "HealthCare.gov",
  pageTitle: "Copayment glossary",
  url: "https://www.healthcare.gov/glossary/co-payment/",
  note: "Official Marketplace definition for fixed copayments.",
};

const HEALTHCARE_COINSURANCE = {
  name: "HealthCare.gov",
  pageTitle: "Coinsurance glossary",
  url: "https://www.healthcare.gov/glossary/co-insurance/",
  note: "Official Marketplace definition for percentage cost-sharing.",
};

const HEALTHCARE_OOP_MAX = {
  name: "HealthCare.gov",
  pageTitle: "Out-of-pocket maximum/limit glossary",
  url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/",
  note: "Official Marketplace definition for annual covered in-network cost limits.",
};

const KFF_HEALTH_CARE_DEBT = {
  name: "KFF",
  pageTitle: "KFF Health Care Debt Survey",
  url: "https://www.kff.org/health-costs/kff-health-care-debt-survey/",
  note: "Independent research on medical debt, affordability, and patient household impacts.",
};

const AP_MEDICAL_DEBT_RULE = {
  name: "Associated Press",
  pageTitle: "Federal judge reverses rule that would have removed medical debt from credit reports",
  url: "https://apnews.com/article/41f212ee6b89f9902deb267d75ab8443",
  note: "Current reporting that the 2025 CFPB medical-debt credit-reporting rule was overturned, so articles should avoid outdated blanket claims.",
};

export const PATIENT_READY_ARTICLES: Article[] = [
  {
    slug: "what-to-do-before-paying-medical-bill",
    title: "What To Do Before Paying a Large Medical Bill",
    category: "Hospital Bills",
    readTime: "7 min read",
    promise: "Use a simple checklist before paying a large, confusing, or unexpected medical bill.",
    audience: "Patients, families, caregivers, and healthcare workers helping someone respond to a large medical bill.",
    summary: "Before paying a large medical bill, confirm whether insurance has finished processing, compare the provider bill with the Explanation of Benefits, check the date of service and patient responsibility, ask for an itemized bill if something looks wrong, and ask about financial assistance before using a credit card or ignoring the balance.",
    body: [
      "A large medical bill can trigger panic. Some people pay immediately because they are afraid of collections. Others avoid the bill because it feels impossible. Neither reaction gives the patient much control.",
      "The better move is to turn the bill into a checklist. The goal is not to avoid a real balance. The goal is to avoid paying the wrong amount, paying before insurance finishes, missing financial assistance, or letting a fixable billing issue become harder to solve.",
      "This article is educational and not legal, medical, tax, or insurance advice. Plan documents, state rules, provider policies, and insurer decisions can change the answer. Use this as a practical script for what to verify next."
    ],
    sections: [
      {
        title: "Claim status",
        definition: "The stage of the bill after the provider sends the claim to insurance for processing.",
        keyPoints: [
          "If insurance was used, ask whether the claim was submitted and whether processing is complete.",
          "A provider statement may arrive before the insurer finishes reviewing the claim.",
          "If the claim is still pending, ask the billing office whether the balance is final or should be placed on hold."
        ],
        watchOut: "Do not assume the first provider statement is the final patient responsibility when the EOB has not arrived yet."
      },
      {
        title: "Explanation of Benefits",
        definition: "The insurer's explanation of how a claim was processed. It is usually not the bill itself.",
        keyPoints: [
          "Match the EOB to the provider bill by patient, provider, date of service, and service description.",
          "Compare billed charge, allowed amount, insurance payment, adjustment, denial, and patient responsibility.",
          "If the provider bill asks for more than the EOB says you owe, call before paying."
        ],
        watchOut: "The number that matters most is usually patient responsibility after insurance processing, not the original billed charge."
      },
      {
        title: "Itemized bill",
        definition: "A more detailed bill that lists services, supplies, medications, tests, and charges.",
        keyPoints: [
          "Ask for one when the balance is large, confusing, duplicated, or hard to match to the visit.",
          "Use it to identify duplicate charges, services you do not recognize, or separate bills that may still be coming.",
          "An itemized bill is useful, but it still needs to be compared with insurance processing."
        ]
      },
      {
        title: "Financial assistance",
        definition: "A hospital program that may reduce or forgive eligible bills under the hospital's policy.",
        keyPoints: [
          "Ask for the financial assistance policy, plain-language summary, and application.",
          "Insured patients may still qualify depending on the policy.",
          "Ask whether the policy applies to the hospital bill only or also to separate physician, radiology, anesthesia, pathology, or lab bills."
        ],
        watchOut: "A payment plan spreads the bill out. Financial assistance may reduce the bill. Ask about both before using high-interest credit."
      },
      {
        title: "Call script",
        keyPoints: [
          "Has insurance finished processing this claim?",
          "Which EOB matches this bill?",
          "Can you send an itemized bill?",
          "Does this provider participate with my plan?",
          "Is any part of the claim denied or out-of-network?",
          "Is financial assistance available?",
          "Can the account be paused while I review the EOB or assistance application?"
        ]
      }
    ],
    example: {
      title: "A bill that should not be paid yet",
      body: "A patient receives a $3,600 hospital bill after an ER visit, but no EOB has arrived. Instead of paying immediately, the patient calls billing to confirm whether insurance has finished processing, requests an itemized bill, then calls the insurer to confirm patient responsibility, network status, deductible, copay, coinsurance, and any denial reason."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Paying before insurance finishes processing.",
      "Comparing the provider bill to the wrong EOB.",
      "Using a credit card before asking about financial assistance or no-interest payment plans.",
      "Ignoring bills until they become harder to dispute.",
      "Throwing away EOBs, bills, receipts, letters, and call notes."
    ],
    takeaway: "Before paying a large bill, verify claim status, compare the bill to the EOB, ask for an itemized bill when needed, check financial assistance, and document every call.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, CMS_NO_SURPRISES, HEALTHCARE_ALLOWED_AMOUNT],
  },
  {
    slug: "good-faith-estimate",
    title: "Good Faith Estimate Explained",
    category: "Hospital Bills",
    readTime: "5 min read",
    promise: "Understand when a Good Faith Estimate can help uninsured or self-pay patients before scheduled care.",
    audience: "Uninsured patients, self-pay patients, caregivers, and families scheduling care without using insurance.",
    summary: "A Good Faith Estimate is a written estimate of expected charges that usually matters when a patient does not have insurance or chooses not to use insurance. Providers usually must give one when care is scheduled in advance or when the patient asks. If the final bill is at least $400 more than the estimate, the patient may be able to use the federal patient-provider dispute process.",
    body: [
      "A Good Faith Estimate is meant to give self-pay or uninsured patients a written starting point before scheduled care.",
      "It is not the same as insurance approval, and it is not a perfect guarantee that every related cost will be exactly right. But it gives the patient something concrete to save, compare, question, and use if the final bill is much higher than expected.",
      "The key is to ask before scheduled care, save the document, and compare the final bill carefully."
    ],
    sections: [
      {
        title: "Good Faith Estimate",
        definition: "A written estimate of expected charges for scheduled or requested care, usually for patients who are uninsured or choosing not to use insurance.",
        keyPoints: [
          "It is most relevant for scheduled care, not emergency care.",
          "Patients can ask for one.",
          "The estimate should be saved with bills, receipts, and appointment documents."
        ],
        watchOut: "A Good Faith Estimate is not the same thing as an insurance preauthorization or a guarantee that every separate provider will bill exactly as expected."
      },
      {
        title: "Self-pay or uninsured",
        definition: "A patient either has no insurance or chooses not to use insurance for that service.",
        keyPoints: [
          "The estimate right usually applies when insurance is not being used.",
          "Patients using insurance should still ask for cost estimates, but those estimates are handled through plan and provider rules.",
          "The final personal cost can still depend on who provides the service and what is included."
        ]
      },
      {
        title: "The $400 dispute threshold",
        definition: "A federal dispute process may be available when the final bill is at least $400 more than the Good Faith Estimate.",
        keyPoints: [
          "Compare the final bill to the saved estimate.",
          "Keep the estimate, final bill, and all communication.",
          "Review the CMS dispute process before paying or ignoring a much higher balance."
        ],
        watchOut: "Do not assume every surprise bill qualifies. The dispute process has rules, timelines, and documentation requirements."
      },
      {
        title: "Questions to ask",
        keyPoints: [
          "Can I get a Good Faith Estimate?",
          "Which providers and services are included?",
          "Could separate facility, physician, anesthesia, imaging, lab, pathology, or supply bills arrive?",
          "What is not included in the estimate?",
          "Who do I contact if the final bill is much higher?"
        ]
      }
    ],
    example: {
      title: "The estimate that matters later",
      body: "A self-pay patient schedules an outpatient procedure and receives a Good Faith Estimate for $1,200. The final bill is $1,750. Because the bill is $550 higher than the estimate, the patient should save both documents and review whether the federal dispute process applies."
    },
    commonMistakes: [
      "Not asking for an estimate before scheduled self-pay care.",
      "Throwing away the estimate.",
      "Assuming the estimate is insurance approval.",
      "Assuming every unexpected bill qualifies for dispute.",
      "Waiting too long to act after receiving a much higher final bill."
    ],
    takeaway: "For uninsured or self-pay scheduled care, ask for a Good Faith Estimate, save it, and compare it to the final bill. A bill at least $400 higher may deserve dispute-process review.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, CMS_NO_SURPRISES],
  },
  {
    slug: "no-surprises-act-explained",
    title: "No Surprises Act: What It Does and Does Not Protect You From",
    category: "Insurance",
    readTime: "6 min read",
    promise: "Separate real surprise-billing protections from normal deductibles, copays, and coinsurance.",
    audience: "Patients and families worried about unexpected out-of-network medical bills.",
    summary: "The No Surprises Act protects many patients from certain unexpected out-of-network bills, including emergency room visits, certain non-emergency services connected to in-network facilities, and air ambulance services. It does not make all medical care cheap, erase normal cost-sharing, or apply to every bill that feels surprising.",
    body: [
      "A bill can be surprising for two different reasons: it may be legally protected surprise billing, or it may simply be expensive under the plan's normal rules.",
      "The No Surprises Act helps with important unexpected out-of-network billing situations, but it does not erase deductibles, copays, coinsurance, non-covered services, or every network problem.",
      "The practical move is to ask the insurer and provider whether the bill was processed under No Surprises Act protections before paying a suspicious out-of-network balance."
    ],
    sections: [
      {
        title: "No Surprises Act",
        definition: "A federal law that protects many patients from certain unexpected out-of-network medical bills.",
        keyPoints: [
          "It went into effect on January 1, 2022.",
          "It applies to most types of health insurance.",
          "It can protect emergency care and certain non-emergency out-of-network services at in-network facilities.",
          "It also includes air ambulance services."
        ],
        watchOut: "Normal in-network deductible, copay, and coinsurance can still apply."
      },
      {
        title: "Balance billing",
        definition: "When a provider bills the patient for the difference between the provider charge and the amount the plan paid or allowed.",
        keyPoints: [
          "Federal protections may limit certain unexpected out-of-network balance bills.",
          "Out-of-network status should be checked by claim, provider, facility, and service type.",
          "The EOB should show how the claim was processed."
        ],
        watchOut: "Do not assume a bill is legal or illegal from the amount alone. Ask how the claim was processed."
      },
      {
        title: "What it does not do",
        keyPoints: [
          "It does not eliminate normal plan cost-sharing.",
          "It does not make non-covered care covered.",
          "It does not always cover ground ambulance bills.",
          "It does not replace the need to compare the provider bill with the EOB."
        ]
      },
      {
        title: "What to do with a suspected surprise bill",
        keyPoints: [
          "Ask the insurer whether the claim should be protected under the No Surprises Act.",
          "Ask the provider why the bill was treated as out-of-network.",
          "Request the EOB, claim number, provider tax ID, and date of service.",
          "Use CMS complaint resources if the answer does not make sense."
        ]
      }
    ],
    example: {
      title: "The out-of-network anesthesia bill",
      body: "A patient has surgery at an in-network hospital. The hospital processes in network, but a separate out-of-network anesthesiology group sends a large bill. The patient should ask whether No Surprises Act protections apply before paying the out-of-network balance."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Assuming every large bill violates the No Surprises Act.",
      "Assuming the law removes normal deductibles and coinsurance.",
      "Ignoring a bill that may need to be challenged.",
      "Not asking whether the provider was processed as in network or out of network.",
      "Forgetting that ground ambulance bills are a major gap unless state rules apply."
    ],
    takeaway: "The No Surprises Act protects important unexpected out-of-network billing situations, but it does not erase every medical bill. Ask whether the claim should be protected before paying a suspicious out-of-network balance.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, CMS_NO_SURPRISES],
  },
  {
    slug: "how-to-read-health-insurance-plan",
    title: "How To Read Your Health Insurance Plan Before You Need It",
    category: "Insurance",
    readTime: "6 min read",
    promise: "Know the few plan numbers and rules that matter before a stressful medical event happens.",
    audience: "Workers, patients, families, and caregivers choosing or reviewing health insurance coverage.",
    summary: "To understand a health plan before you need care, focus on the premium, deductible, copays, coinsurance, out-of-pocket maximum, provider network, prescription coverage, emergency rules, and prior authorization. You do not need to memorize the full plan document; you need to know where the expensive traps are likely to appear.",
    body: [
      "Most people read their health plan after something stressful happens. That is the hardest time to learn insurance vocabulary.",
      "A better approach is to pull out the few numbers and rules that drive real-life cost: what comes out of your paycheck, what you may owe when care happens, which providers are covered, and what approvals are required.",
      "This turns health insurance from a wall of paperwork into a shorter decision checklist."
    ],
    sections: [
      {
        title: "Premium vs. care costs",
        definition: "The premium keeps coverage active; deductible, copays, and coinsurance affect what you pay when you use care.",
        keyPoints: [
          "A low premium is not automatically the cheapest plan.",
          "The deductible matters if you need more than routine care.",
          "The out-of-pocket maximum matters in a bad health year."
        ],
        watchOut: "Premium-only comparisons can hide expensive deductibles, networks, and drug costs."
      },
      {
        title: "Network",
        definition: "The doctors, hospitals, labs, pharmacies, and facilities that contract with the plan.",
        keyPoints: [
          "Check your primary care provider, specialists, preferred hospital, labs, imaging centers, and pharmacies.",
          "A facility and a specific clinician group can be treated differently.",
          "Out-of-network care may cost more or may not be covered except in emergencies or protected situations."
        ]
      },
      {
        title: "Prescription coverage",
        definition: "The plan's rules for covered medications, pharmacy networks, tiers, copays, coinsurance, and prior authorization.",
        keyPoints: [
          "Search the formulary for medications you actually use.",
          "Check preferred pharmacies and mail-order rules.",
          "Look for prior authorization, step therapy, or quantity limits."
        ]
      },
      {
        title: "Services to price-check first",
        keyPoints: [
          "Primary care and specialist visits.",
          "Urgent care and emergency care.",
          "Labs and imaging.",
          "Planned procedures or surgeries.",
          "Pregnancy, chronic disease care, therapy, infusions, and specialty medications.",
          "Durable medical equipment and home services."
        ]
      },
      {
        title: "Plan review checklist",
        keyPoints: [
          "Find the premium, deductible, and out-of-pocket maximum.",
          "Write down copays and coinsurance for common services.",
          "Check provider and facility network status.",
          "Check medication coverage.",
          "Look for prior authorization requirements.",
          "Save the plan documents where you can find them later."
        ]
      }
    ],
    example: {
      title: "Two plans that look different only after care happens",
      body: "Plan A has a lower monthly premium but a higher deductible and higher out-of-pocket maximum. Plan B has a higher premium but lower cost exposure if a surgery or expensive medication is likely. The better plan depends on expected care, cash flow, network, prescriptions, and risk tolerance."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Choosing the lowest premium without checking the deductible.",
      "Not checking whether current doctors and hospitals are in network.",
      "Forgetting to review prescription coverage.",
      "Assuming urgent care, ER, imaging, and labs all cost the same.",
      "Ignoring prior authorization until the appointment is already scheduled."
    ],
    takeaway: "Read the plan for cost drivers, not every legal detail. Know the premium, deductible, copays, coinsurance, out-of-pocket maximum, network, prescriptions, and prior authorization rules before care is urgent.",
    sources: [HEALTHCARE_GLOSSARY, HEALTHCARE_NETWORK, HEALTHCARE_PREAUTHORIZATION, HEALTHCARE_OOP_MAX],
  },
  {
    slug: "what-counts-toward-out-of-pocket-maximum",
    title: "What Counts Toward Your Out-of-Pocket Maximum?",
    category: "Insurance",
    readTime: "5 min read",
    promise: "Understand what usually counts toward the yearly cap — and what may not count at all.",
    audience: "Patients and families trying to understand the yearly cap on covered health care costs.",
    summary: "Your out-of-pocket maximum is the most you pay in a plan year for covered in-network services before your plan pays 100% of covered benefits. Deductibles, copays, and coinsurance for covered in-network care usually count. Premiums, non-covered services, out-of-network care, and amounts above the allowed amount may not count the same way.",
    body: [
      "The out-of-pocket maximum is one of the most important numbers in a health plan, but it is often misunderstood.",
      "It is not a cap on every healthcare-related dollar. It is usually a cap on covered in-network cost-sharing under the plan's rules.",
      "That distinction matters when patients are comparing plans, preparing for surgery, tracking a difficult year, or deciding when to schedule care."
    ],
    sections: [
      {
        title: "What usually counts",
        keyPoints: [
          "Deductible payments for covered in-network care.",
          "Copays for covered in-network services.",
          "Coinsurance for covered in-network services.",
          "Some prescription drug cost-sharing, depending on the plan."
        ]
      },
      {
        title: "What usually does not count",
        keyPoints: [
          "Monthly premiums.",
          "Non-covered services.",
          "Many out-of-network costs, depending on the plan.",
          "Amounts above the allowed amount when balance billing is allowed.",
          "Costs for services that do not follow plan rules, such as missing a required prior authorization."
        ],
        watchOut: "The out-of-pocket maximum is a powerful protection, but it is not always the true worst-case cost for every possible health-related expense."
      },
      {
        title: "Allowed amount",
        definition: "The amount the plan recognizes for a covered service.",
        keyPoints: [
          "Your deductible and coinsurance are often calculated from the allowed amount.",
          "The allowed amount may be far lower than the provider's billed charge.",
          "Out-of-network charges can work differently."
        ]
      },
      {
        title: "What to track",
        keyPoints: [
          "Deductible paid so far.",
          "Copays paid so far.",
          "Coinsurance paid so far.",
          "Whether each service was covered and in-network.",
          "The insurer's running total toward the out-of-pocket maximum.",
          "Whether the plan has separate in-network and out-of-network limits."
        ]
      }
    ],
    example: {
      title: "The premium does not help you reach the cap",
      body: "A patient has a $6,500 out-of-pocket maximum. They pay $2,000 in deductible, $800 in copays, and $1,700 in coinsurance for covered in-network care, totaling $4,500 toward the maximum. If they also pay $3,000 in premiums during the year, those premiums usually do not count toward the $6,500 cap."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Thinking premiums count toward the out-of-pocket maximum.",
      "Assuming out-of-network care counts the same as in-network care.",
      "Assuming non-covered services count.",
      "Not checking the insurer's accumulated total during the year.",
      "Forgetting the maximum resets each plan year."
    ],
    takeaway: "The out-of-pocket maximum usually protects covered in-network cost-sharing. Track deductible, copays, and coinsurance, but do not assume premiums, non-covered care, or out-of-network costs count the same way.",
    sources: [HEALTHCARE_OOP_MAX, HEALTHCARE_DEDUCTIBLE, HEALTHCARE_COPAYMENT, HEALTHCARE_COINSURANCE, HEALTHCARE_ALLOWED_AMOUNT],
  },
  {
    slug: "hospital-price-transparency-patient-cost",
    title: "Hospital Price Transparency: Helpful, But Not the Same as What You'll Owe",
    category: "Hospital Bills",
    readTime: "6 min read",
    promise: "Use hospital price transparency without confusing posted prices with your personal final bill.",
    audience: "Patients and families trying to estimate hospital costs before scheduled care.",
    summary: "Hospital price transparency rules require hospitals to post certain pricing information online, including machine-readable files and consumer-friendly shoppable-service displays. That information can help patients compare prices, but it is not always the same as a specific insured patient's final out-of-pocket cost. Insurance coverage, network status, deductible, copay, coinsurance, allowed amount, and prior authorization still matter.",
    body: [
      "Patients want one simple answer: what will this cost me? Hospital price transparency can help, but it does not always give the personal answer people expect.",
      "A hospital may post prices for items and services, but an insured patient's final responsibility is usually shaped by the health plan's rules.",
      "Use price transparency information as a starting point, then confirm coverage, network status, authorization, and cost-sharing with the hospital and insurer."
    ],
    sections: [
      {
        title: "Hospital price transparency",
        definition: "Federal rules requiring hospitals to make certain pricing information available online.",
        keyPoints: [
          "Hospitals must provide a comprehensive machine-readable file with items and services.",
          "Hospitals must also provide a consumer-friendly display of shoppable services.",
          "The goal is to make comparison and pre-care estimates easier."
        ],
        watchOut: "Posted price information is not always the same as your final personal responsibility."
      },
      {
        title: "Why your bill can differ",
        keyPoints: [
          "Your plan may have a negotiated allowed amount.",
          "Your deductible may not be met yet.",
          "Copays or coinsurance may apply.",
          "The facility, clinician, lab, or imaging group may have different network status.",
          "The service may require prior authorization.",
          "The final service may differ from the planned service."
        ]
      },
      {
        title: "When this helps most",
        keyPoints: [
          "Scheduled imaging.",
          "Elective outpatient procedures.",
          "Lab work or shoppable services.",
          "Comparing sites of care before non-emergency treatment.",
          "Asking better questions during a hospital estimate call."
        ]
      },
      {
        title: "Questions to ask after finding a posted price",
        keyPoints: [
          "Is the facility in network?",
          "Is the ordering provider in network?",
          "Does my plan cover this service?",
          "Is prior authorization required?",
          "What is the allowed amount?",
          "How much deductible remains?",
          "Will I owe a copay or coinsurance?"
        ]
      }
    ],
    example: {
      title: "The posted imaging price",
      body: "A patient finds a posted price for an outpatient MRI. The price is useful, but the patient still needs to ask whether the facility is in network, whether prior authorization is required, what the plan's allowed amount is, and how much deductible remains."
    },
    relatedCalculator: { label: "Health Insurance Visit Cost Calculator", href: "/tools#insurance" },
    commonMistakes: [
      "Assuming the posted hospital price equals the final patient bill.",
      "Forgetting to check whether the facility is in network.",
      "Not asking about prior authorization.",
      "Comparing prices without checking what insurance will allow.",
      "Assuming the same service has the same patient cost at every site of care."
    ],
    takeaway: "Hospital price transparency is useful, but it is not the same as a personalized insured-patient bill estimate. Use it with network, coverage, deductible, copay, coinsurance, allowed amount, and authorization checks.",
    sources: [CMS_HOSPITAL_PRICE_TRANSPARENCY, CMS_MEDICAL_BILL_RIGHTS, HEALTHCARE_ALLOWED_AMOUNT, HEALTHCARE_PREAUTHORIZATION],
  },
  {
    slug: "medical-bill-sent-to-collections",
    title: "Medical Bill Sent to Collections: What Happens Next?",
    category: "Hospital Bills",
    readTime: "7 min read",
    promise: "Know what to verify when a medical bill reaches collections, without paying blindly or ignoring it.",
    audience: "Patients and families worried about medical debt, collections letters, and credit-reporting consequences.",
    summary: "If a medical bill is sent to collections, take it seriously but verify it before paying. Confirm the provider, date of service, amount, insurance processing, EOB patient responsibility, and whether financial assistance is still available. Medical-debt credit-reporting rules have changed and remain policy-sensitive, so patients should avoid blanket assumptions and check current federal, state, and credit-bureau rules.",
    body: [
      "A collections letter can feel like a threat, especially when the original medical bill was confusing or never clearly resolved.",
      "Ignoring it is risky. Paying blindly is also risky. The safer first move is to verify what the debt is, who is collecting it, whether insurance processed it correctly, and whether the original provider can still review assistance or billing errors.",
      "This article is educational, not legal advice. Collections, credit reporting, state protections, and hospital financial assistance rules can vary and can change."
    ],
    sections: [
      {
        title: "First verification step",
        definition: "Confirm the bill is real, accurate, and tied to a specific provider and date of service.",
        keyPoints: [
          "Save the collections letter.",
          "Identify the original provider, date of service, account number, and amount.",
          "Compare the amount with prior bills, EOBs, receipts, and portal messages.",
          "Ask for written debt validation if needed."
        ],
        watchOut: "Do not pay just because a balance reached collections. Confirm the debt first."
      },
      {
        title: "Insurance review",
        keyPoints: [
          "Was insurance billed?",
          "Did insurance finish processing?",
          "Which EOB matches the collection balance?",
          "Was any part denied, out-of-network, miscoded, or not authorized?",
          "Does the patient responsibility match the amount being collected?"
        ]
      },
      {
        title: "Financial assistance review",
        keyPoints: [
          "Call the original hospital or provider, not only the collector.",
          "Ask whether financial assistance can still apply.",
          "Ask whether the account can be recalled, paused, corrected, or reviewed.",
          "Keep copies of applications, letters, bills, EOBs, and call notes."
        ],
        watchOut: "Do not assume collections means assistance is impossible. Ask the original provider."
      },
      {
        title: "Credit-reporting caution",
        definition: "Medical-debt credit rules have changed over time and can depend on current federal policy, state law, and credit-bureau practices.",
        keyPoints: [
          "Do not assume medical debt can never affect credit.",
          "Do not assume every old article about medical debt credit reporting is still current.",
          "Check current rules before making payment or settlement decisions based only on credit-reporting expectations.",
          "Consider nonprofit credit counseling or legal aid if the balance is large, disputed, or unaffordable."
        ],
        watchOut: "As of this article pass, the broad 2025 CFPB medical-debt credit-reporting rule had been overturned by a federal judge, so the site avoids outdated blanket claims."
      },
      {
        title: "Action checklist",
        keyPoints: [
          "Save every letter and bill.",
          "Verify the provider, date of service, and amount.",
          "Compare with the EOB and original bill.",
          "Ask for written validation when needed.",
          "Call the original provider about insurance and financial assistance.",
          "Document every call and deadline.",
          "Get qualified help if the bill is large, disputed, or unaffordable."
        ]
      }
    ],
    example: {
      title: "The collections letter with no EOB match",
      body: "A patient receives a collections letter for $780 from a hospital visit six months ago. Before paying, they identify the date of service, request validation, pull the insurer EOB, and call the hospital billing office to ask whether the claim was processed correctly and whether financial assistance can still be reviewed."
    },
    commonMistakes: [
      "Ignoring a collections letter.",
      "Paying without confirming the debt.",
      "Assuming the amount is correct because it reached collections.",
      "Assuming medical debt can never affect credit.",
      "Putting the balance on a high-interest credit card before asking about hospital options.",
      "Not checking state-specific protections or current credit-reporting rules."
    ],
    takeaway: "If a medical bill reaches collections, verify first, document everything, compare the debt with the original bill and EOB, ask about financial assistance, and check current credit-reporting rules before making assumptions.",
    sources: [CMS_MEDICAL_BILL_RIGHTS, KFF_HEALTH_CARE_DEBT, AP_MEDICAL_DEBT_RULE],
  },
];
