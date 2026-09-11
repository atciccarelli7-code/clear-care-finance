import type { Article } from "./articles";
import type { Source } from "./sources";

const AUTHOR = "Andrew Ciccarelli, BSN, RN";
const PUBLISHED_AT = "2026-09-10";

const cmsIpps: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Acute Inpatient Prospective Payment System",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps",
  note: "Official Medicare overview of acute inpatient prospective payment, MS-DRGs, hospital payment adjustments, and related payment programs.",
};

const cmsIppsFinal2026: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "FY 2026 IPPS Final Rule Home Page",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2026-ipps-final-rule-home-page",
  note: "Current FY 2026 inpatient payment tables, including MS-DRG relative weights, length-of-stay statistics, and payment-adjustment files.",
};

const cmsReadmissions: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Readmissions Reduction Program",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/hospital-readmissions-reduction-program-hrrp",
  note: "Official Medicare description of excess-readmission payment reductions, which are capped at three percent for applicable hospitals.",
};

const cmsHac: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital-Acquired Condition Reduction Program",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/hospital-acquired-condition-reduction-program-hacrp",
  note: "Official Medicare program linking inpatient quality to payment through a one-percent reduction for hospitals in the worst-performing quartile on selected hospital-acquired-condition measures.",
};

const cmsVbp: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Value-Based Purchasing",
  url: "https://www.cms.gov/medicare/quality/value-based-programs/hospital-purchasing",
  note: "Official Medicare explanation of the two-percent base operating MS-DRG withhold and redistribution based on quality, safety, patient experience, mortality, and efficiency measures.",
};

const cmsPriceTransparency: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Price Transparency: Hospitals",
  url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/hospitals",
  note: "Current federal definitions for gross charges, discounted cash prices, payer-specific negotiated charges, and de-identified negotiated price fields.",
};

const cmsOpps: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Outpatient Prospective Payment System",
  url: "https://www.cms.gov/cms-guide-medical-technology-companies-and-other-interested-parties/payment/opps",
  note: "Official explanation of Medicare outpatient hospital payment through OPPS and Ambulatory Payment Classifications, showing that inpatient and outpatient hospital payment systems differ.",
};

const macpacHospitalPayments: Source = {
  name: "Medicaid and CHIP Payment and Access Commission",
  pageTitle: "Medicaid Base and Supplemental Payments to Hospitals",
  url: "https://www.macpac.gov/publication/medicaid-base-and-supplemental-payments-to-hospitals/",
  note: "Federal advisory commission analysis showing that Medicaid hospital payment methods and the mix of base, supplemental, and managed-care directed payments vary substantially by state.",
};

export const FOUNDER_HOSPITAL_MONEY_ARTICLES: Article[] = [
  {
    slug: "how-a-hospital-actually-makes-money",
    title: "How a Hospital Actually Makes Money",
    category: "Hospital Economics",
    readTime: "13 min read",
    promise: "Hospital economics are not a cash register that rings every time a nurse gives a medication. Case-based payment, daily operating cost, quality penalties, payer contracts, and discharge pressure all collide inside the same stay.",
    description: "How hospitals actually get paid: Medicare MS-DRGs, length of stay, quality penalties, negotiated prices, Medicaid variation, and why good care and hospital economics sometimes point in the same direction.",
    audience: "Patients and families who wonder whether hospitals make more money by doing more, healthcare workers who see length-of-stay pressure without seeing the payment system behind it, and anyone trying to understand why hospital care behaves like both medicine and a business.",
    summary: "For many Original Medicare acute inpatient stays, the hospital facility is paid prospectively for the discharge based largely on the MS-DRG and payment adjustments—not by simply collecting every line-item charge on the bill. That creates a real incentive to diagnose, treat, coordinate, and discharge efficiently because additional hospital days continue consuming labor and capacity. But Medicare also reduces payment for excess readmissions, poor hospital-acquired-condition performance, and other quality failures. The useful lesson is not that hospitals make money by kicking patients out. It is that American hospital payment rewards a complicated combination of efficiency, accurate classification, quality, capacity management, and payer-specific reimbursement.",
    body: [
      "A hospital bill can make it look like every medication, test, and extra night is another sale. That is not a good description of how much of inpatient hospital payment actually works.",
      "For many Original Medicare acute inpatient stays, CMS generally pays the hospital a prospectively determined amount for the discharge based on the MS-DRG and other adjustments. The hospital still has to absorb the resources used while the patient remains there, subject to important exceptions such as outlier payments.",
      "That is why length of stay matters financially, but Medicare also creates payment consequences for excess readmissions, hospital-acquired conditions, and quality performance. The incentive is more complicated than simply getting the patient out as fast as possible.",
      "The same room, nurse, diagnosis, and treatment can also have different economics under Medicare, Medicaid, commercial insurance, or self-pay arrangements. Understanding the payment path helps explain why hospital operations can feel strange from the bedside.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: PUBLISHED_AT,
    nextReviewAt: "2027-03-10",
    reviewScope: "Medicare IPPS and MS-DRG mechanics, FY 2026 length-of-stay tables, readmission and quality payment programs, hospital price-transparency definitions, Medicare outpatient payment, and Medicaid hospital-payment variation.",
    author: AUTHOR,
    systemMap: {
      title: "How one inpatient stay turns into hospital economics",
      description: "The clinical stay and the financial settlement are connected, but they are not the same thing as the line-item charges a patient may later see.",
      steps: [
        {
          title: "The patient is admitted and treated",
          body: "The hospital provides nursing, medications, diagnostics, procedures, therapy, case management, support services, and the staffed capacity needed for the stay.",
        },
        {
          title: "The case is classified",
          body: "For many Original Medicare acute inpatient stays, diagnoses, procedures, severity, discharge status, and other claim information help determine the MS-DRG and payment adjustments.",
        },
        {
          title: "The payer applies its payment rules",
          body: "Medicare uses its statutory payment systems; Medicaid methods vary by state; commercial insurers use negotiated arrangements; the gross charge is not automatically the amount collected.",
        },
        {
          title: "The margin depends on payment and resources used",
          body: "Revenue is compared with the labor, supplies, capacity, capital, and other costs required to provide the hospitalization. Efficient care can improve both patient flow and hospital economics when it remains safe.",
        },
      ],
    },
    editorialSections: [
      {
        title: "It looks like a cash register from the outside",
        paragraphs: [
          "If you have ever looked at a hospital bill, you could pretty easily assume hospitals make money one thing at a time.",
          "You get a medication. Charge. You get a CT scan. Charge. You get blood work. Charge. You stay another night. Another charge.",
          "So from the outside, it can look like the hospital makes more money every time something happens to you.",
          "But that is not really how a lot of hospital economics works.",
          "For many acute inpatient stays under Original Medicare, the hospital facility is paid through the Inpatient Prospective Payment System. CMS assigns the case to a Medicare Severity Diagnosis-Related Group, or MS-DRG, and calculates a prospective payment using that classification plus a long list of adjustments. That is very different from simply taking every charge on the statement and collecting it as revenue.",
          "And once you understand that, a lot of what happens inside a hospital starts making more sense. Because economically, a hospital stay can start to feel a little bit like a race against the clock.",
        ],
        callout: {
          label: "The first thing to separate",
          body: "A hospital charge, a payer's negotiated amount, a Medicare payment, the patient's responsibility, and the hospital's cost are different numbers. A bill can show one without telling you the others.",
        },
      },
      {
        title: "The clock starts when you get admitted",
        paragraphs: [
          "Imagine the hospital is going to receive a certain amount of money for taking care of a certain type of hospitalization.",
          "Obviously, the real payment system is much more complicated than that. Medicare adjusts inpatient payment for things like the MS-DRG, local wage differences, teaching status, care for low-income patients, unusually costly cases, and other policy rules. Very expensive cases can also qualify for additional outlier payments.",
          "But the basic idea matters: there is revenue associated with the hospitalization, while the hospital keeps using resources every day the patient remains there.",
          "The nurses still have to be there. The patient may still need medications, meals, labs, imaging, oxygen, physical therapy, respiratory therapy, pharmacy, case management, specialists, housekeeping, and everything else that goes into taking care of someone in a hospital.",
          "Not every one of those costs appears from scratch because the patient stayed one extra night. Hospitals have enormous fixed and semi-fixed costs. But another day still uses staff time, supplies, support services, and—maybe most importantly—staffed capacity.",
          "So let's say, purely as an illustration, that a certain kind of hospitalization usually takes around four days. Day five comes. The hospital does not necessarily receive another full case payment just because the patient stayed one more night. But the hospital is still using resources and still has that bed occupied.",
          "That is why hospitals care so much about length of stay.",
          "CMS even publishes geometric and arithmetic mean lengths of stay for MS-DRGs in its annual inpatient payment tables. That does not mean there is a magical national break-even day where every hospital starts losing money. There isn't. It does show that length of stay is deeply embedded in how inpatient hospital care is measured and financed.",
          "If a patient can get the correct diagnosis, receive the correct treatment, recover, and safely leave on day four instead of day five, that can be financially better for the hospital.",
          "One day probably does not sound like much. Multiply an avoidable extra day across hundreds or thousands of admissions. Now it matters a lot.",
        ],
      },
      {
        title: "Does that mean the hospital is trying to kick you out?",
        paragraphs: [
          "This is where things get uncomfortable.",
          "Because once you tell somebody that hospitals care about length of stay, the first reaction is usually something like: So they make more money if they get me out faster?",
          "Broadly speaking, under a case-based payment system, controlling the resources used during the hospitalization absolutely matters.",
          "But that does not automatically mean: The hospital is going to deny me necessary care just to save money.",
          "Those are very different claims.",
          "Medicare's payment system also puts financial pressure in the opposite direction. The Hospital Readmissions Reduction Program can reduce payments to hospitals with excess readmissions, with the reduction capped at three percent. The Hospital-Acquired Condition Reduction Program cuts Medicare payments by one percent for hospitals in the worst-performing quartile on its selected measures. And the Hospital Value-Based Purchasing Program withholds two percent of participating hospitals' base operating MS-DRG payments and redistributes that money according to quality and cost performance.",
          "So the incentive is not simply: Get the patient out.",
          "It is closer to: Take care of the patient efficiently, avoid preventable complications, do not keep them unnecessarily, and preferably do not have them come right back.",
          "Much easier said than done.",
        ],
        callout: {
          label: "The more honest version",
          body: "Hospital payment rewards efficiency, but Medicare also attaches money to readmissions, safety, and quality. A premature discharge can be bad care and bad economics.",
        },
      },
      {
        title: "Sometimes the hospital making more money and the patient getting better are the same goal",
        paragraphs: [
          "Imagine two hospitals taking care of the same patient.",
          "At the first hospital, it takes two days to figure out what is really wrong. Testing gets delayed. Maybe a specialist does not get involved until later. Physical therapy does not see the patient until day three. Nobody really starts planning for discharge until the patient is almost ready to leave. Now the patient stays six days.",
          "At the second hospital, things move faster. They identify the diagnosis earlier. They start the correct treatment earlier. Physical therapy evaluates the patient sooner. Medications get sorted out. Case management starts figuring out whether the patient is going home, needs rehab, needs oxygen, needs equipment, needs home health, or needs help from family.",
          "Instead of waiting until the last day to ask all of those questions, they start earlier. The patient safely leaves on day four.",
          "Which hospital did a better job? Probably the second one.",
          "And the second hospital probably used fewer resources taking care of that patient too.",
          "That is what makes hospital economics so interesting to me. Good care and financially efficient care are not always fighting against each other. Sometimes they are actually pointing in the same direction.",
          "Getting the diagnosis right early is good for the patient. Starting treatment early is good for the patient. Preventing complications is good for the patient. Getting somebody moving instead of letting them stay in bed for days is often good for the patient. Planning for discharge early is good for the patient. Getting somebody safely home instead of keeping them in an acute-care hospital when they no longer need hospital-level care is usually good for the patient too.",
          "All of those things can also improve the economics of the hospitalization.",
          "That does not automatically make the financial incentive evil. It just makes the whole thing more complicated.",
        ],
      },
      {
        title: "Think about a restaurant",
        paragraphs: [
          "I keep coming back to restaurants when I think about healthcare economics.",
          "A good restaurant wants you to enjoy your meal. They want the food to be good. They want you to come back. They also want to make money.",
          "Nobody thinks those two things are automatically contradictory. A restaurant can care about giving you a good experience and still care about how much the food costs, how many employees are working, how efficiently the kitchen operates, and how many customers it can serve.",
          "Healthcare obviously has much higher stakes. You are not ordering a cheeseburger. You may be extremely sick. You may be scared. You may have no idea what is happening. You may have almost no ability to comparison shop. You may not know the price beforehand. And in an emergency, you probably are not sitting in the ambulance comparing hospital reimbursement contracts.",
          "So I am not saying healthcare is the same as going out to dinner. It isn't.",
          "But the basic economic idea is still there. Organizations generally do better when they produce a valuable outcome efficiently.",
          "A hospital is trying to do that in an environment where the product happens to be taking care of sick human beings.",
          "If it can diagnose you correctly, treat you correctly, and get you safely home faster, that can be good for you and good for the hospital.",
          "That sounds almost too convenient. Sometimes it is. Sometimes it isn't.",
        ],
      },
      {
        title: "Where it gets messy",
        paragraphs: [
          "The problem is that once something becomes a metric, people start chasing the metric.",
          "Hospitals want shorter lengths of stay. They want beds available. They want patients moving through the system. They do not want somebody occupying an acute-care bed for three extra days when that person no longer needs acute hospital care.",
          "Most of the time, that makes sense.",
          "But patients are not spreadsheets.",
          "Somebody can technically be medically stable and still have a terrible discharge plan. Maybe their family does not feel comfortable taking care of them. Maybe they cannot walk well. Maybe they need oxygen. Maybe they need rehab. Maybe insurance has not approved rehab. Maybe nobody at home can safely help them. Maybe they need dialysis arrangements. Maybe they need equipment that has not arrived. Maybe a facility declined them.",
          "Maybe the plan looks perfectly reasonable on paper and is going to be a disaster when that person actually gets home.",
          "That is where the incentives start getting uncomfortable.",
          "The hospital may be looking at the patient and thinking: This person no longer needs an acute-care hospital.",
          "The patient or family may be thinking: There is absolutely no way we are ready to leave.",
          "And sometimes both sides are right.",
          "That is the strange part.",
        ],
      },
      {
        title: "A hospital bed is an extremely expensive place to solve a non-hospital problem",
        paragraphs: [
          "Hospitals are designed to take care of sick people who need hospital-level care.",
          "That means nurses around the clock. Doctors. Respiratory therapists. Pharmacists. Laboratory services. Imaging. Food. Housekeeping. Security. Monitoring. Emergency equipment. Backup systems. All of it.",
          "If somebody no longer needs that level of care, keeping them there can become an incredibly expensive way to solve whatever problem is preventing them from leaving.",
          "And sometimes that problem has almost nothing to do with the original disease anymore.",
          "The pneumonia might be better. The patient might no longer need IV medications. Their oxygen requirement may have improved. The hospital problem may essentially be solved. But the patient is still sitting there.",
          "Maybe they are waiting on a rehab bed. Maybe they are waiting for insurance authorization. Maybe they need home oxygen delivered. Maybe the family is trying to figure out how they are actually going to provide care. Maybe they need transportation. Maybe every facility in the area has declined the referral.",
          "This is where hospital economics runs directly into the problems of the rest of the healthcare system.",
          "The hospital is ready to stop being the hospital. But there is nowhere for the patient to go.",
          "And until something changes, the hospital keeps absorbing the problem.",
        ],
      },
      {
        title: "So how does a hospital actually make money?",
        paragraphs: [
          "This is where the answer gets annoying, because there is not one answer.",
          "Hospitals do not have one universal price, and they do not get paid the same way for every patient.",
          "Even Medicare uses different payment systems depending on the setting. Most acute inpatient hospital care is paid through IPPS and MS-DRGs. Hospital outpatient services generally fall under a separate system called OPPS, where services are grouped into Ambulatory Payment Classifications.",
          "Commercial insurance adds another layer because hospitals and insurers negotiate rates and contracts. Federal hospital price-transparency rules now require hospitals to publicly report several different kinds of standard charges, including gross charges, discounted cash prices, payer-specific negotiated charges, and de-identified minimum and maximum negotiated charges.",
          "Think about what that means. The giant number on the hospital bill is not automatically the amount the hospital expects to collect.",
          "Medicaid adds another layer. MACPAC notes that states have broad flexibility in how they pay hospitals and that Medicaid hospital payments can include different combinations of base payments, supplemental payments, and managed-care directed payments.",
          "So the same hospital room, the same nurse, the same medication, and even the same diagnosis can have very different economics depending on who is paying and under what payment rules.",
          "That is one of the weirdest parts of American healthcare.",
          "The hospital is not simply selling healthcare at one price. It is operating inside a giant web of government payment rules, insurance contracts, negotiated prices, quality incentives, supplemental payments, and patient cost sharing.",
        ],
      },
      {
        title: "Why the diagnosis and documentation matter financially too",
        paragraphs: [
          "This is another part that can look ridiculous from the outside. Why does everybody care so much about exactly what the diagnosis is? Why does documentation matter?",
          "Because under Medicare's MS-DRG system, the clinical story represented in the claim helps determine how the inpatient stay is classified and paid. Diagnoses, procedures, severity, and other case characteristics matter to the grouping and payment process.",
          "That does not mean the hospital gets to invent a diagnosis because one pays better. The documentation is supposed to accurately represent what is actually happening clinically.",
          "But it does mean accurately identifying how sick somebody really is matters financially as well as clinically.",
          "A patient with a straightforward hospitalization is not expected to consume the same resources as somebody with major complications and multiple serious conditions. Which, when you think about it, makes sense.",
          "The strange part is how much of healthcare economics depends on turning messy human illness into standardized codes and categories.",
        ],
      },
      {
        title: "The part people do not like talking about",
        paragraphs: [
          "I think people sometimes want healthcare to be completely separated from money.",
          "I understand why. When you are sick, you want to believe every decision happening around you is based entirely on what is best for you. And the clinical decision should be centered on the patient.",
          "But the system surrounding that decision absolutely has financial incentives.",
          "Hospitals care about patients. They also care about money. Nurses care about patients. Doctors care about patients. Case managers care about patients. And the organizations employing all of those people still have budgets, expenses, debt, payroll, performance goals, and financial pressure.",
          "Those things exist at the same time.",
          "Sometimes the incentives work beautifully. The hospital wants to diagnose you quickly. You want to be diagnosed quickly. The hospital wants the correct treatment started sooner. So do you. The hospital wants to prevent complications. You definitely want to prevent complications. The hospital wants to avoid an unnecessary readmission. So do you. The hospital wants you to safely leave sooner. Most patients do not want to spend an extra three days in the hospital either.",
          "Everybody wins.",
          "But sometimes the financial incentive and the human reality do not line up perfectly. Sometimes the patient is medically ready and socially nowhere near ready. Sometimes the family cannot do what the discharge plan assumes they can do. Sometimes the cheaper next level of care is delayed while the patient remains in the most expensive setting.",
          "That is where healthcare gets complicated.",
          "I do not think the lesson is that hospitals are greedy. I also do not think the lesson is that money has nothing to do with your care. Both explanations are too easy.",
          "Hospitals are trying to take care of people inside a system that also requires them to survive financially. Sometimes those two goals work perfectly together. Sometimes they do not.",
          "Understanding the money does not make the care less meaningful. It just helps explain why the system behaves the way it does.",
          "Capitalism is a weird thing, huh?",
        ],
        callout: {
          label: "My bottom line",
          body: "The useful question is not whether hospitals care about money. They do. The useful question is whether a specific financial incentive is pushing care toward a safer, more efficient outcome—or away from one.",
        },
      },
    ],
    systemLens: {
      title: "Who controls the money around a hospital stay?",
      items: [
        {
          question: "Who sets the payment rules?",
          answer: "Congress, CMS, state Medicaid programs, and private payer contracts all influence hospital payment. No single payment formula governs every patient.",
        },
        {
          question: "Who pays?",
          answer: "Depending on the case, payment can come from Medicare, Medicaid, commercial insurers, employers, patients, supplemental programs, or combinations of them.",
        },
        {
          question: "Who carries the financial risk?",
          answer: "The hospital carries cost and capacity risk when care uses more resources than expected; payers carry contractual risk; patients carry cost-sharing and access risk.",
        },
        {
          question: "Who performs the work?",
          answer: "Clinical teams, support services, coders, utilization review, case management, revenue cycle, finance, and payer teams all touch different parts of the same hospitalization.",
        },
        {
          question: "Who absorbs failure?",
          answer: "A delayed diagnosis can extend the stay, a premature transition can harm the patient or lead to readmission, and a blocked discharge can leave the hospital holding an expensive problem that another setting is not yet ready to accept.",
        },
      ],
    },
    questionsHeading: "Questions that make the economics easier to understand",
    questionsToAsk: [
      "Am I looking at a gross charge, a negotiated amount, an insurer payment, or my actual responsibility?",
      "Is this an inpatient hospital stay or an outpatient service, and which payment system applies?",
      "What is still medically necessary today, and what part of the stay is now waiting on a nonacute barrier?",
      "If discharge is delayed, is the barrier clinical readiness, payer authorization, facility acceptance, equipment, transportation, or caregiver capacity?",
      "If I am worried the discharge is unsafe, what specific clinical or practical concern needs to be addressed before I leave?",
    ],
    commonMistakes: [
      "Assuming every line-item charge is money the hospital actually collects.",
      "Assuming every insurer pays hospitals through the same DRG formula Medicare uses for many acute inpatient stays.",
      "Treating a shorter length of stay as automatically better or automatically unsafe.",
      "Assuming an extra day creates another full hospital payment under Medicare IPPS.",
      "Ignoring readmission, safety, and quality payment incentives when discussing pressure to discharge.",
      "Assuming a medically stable patient automatically has a workable next destination.",
    ],
    takeaway: "Hospital economics are not a simple choice between caring about patients and caring about money. Payment, cost, quality, capacity, and discharge all push on the same stay. The goal should be accurate care delivered efficiently enough that the patient can leave safely—not a longer stay because the system is slow and not a shorter stay because a metric became more important than the person.",
    sources: [
      cmsIpps,
      cmsIppsFinal2026,
      cmsReadmissions,
      cmsHac,
      cmsVbp,
      cmsPriceTransparency,
      cmsOpps,
      macpacHospitalPayments,
    ],
  },
];
