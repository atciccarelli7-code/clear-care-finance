import type { Article } from "./articles";
import type { Source } from "./sources";

const AUTHOR = "Andrew Ciccarelli, BSN, RN";
const PUBLISHED_AT = "2026-08-29";

const cmsPriceTransparency: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Price Transparency: Hospitals",
  url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/hospitals",
  note: "Current federal definitions for gross charges, discounted cash prices, payer-specific negotiated charges, and consumer-friendly shoppable-service information.",
};

const cmsEobGuide: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "How to read a health insurance explanation of benefits",
  url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/medical-bill-guides-resources/how-read-health-insurance-explanation-benefits",
  note: "Official distinction among provider charges, allowed charges, insurer payment, and the amount a patient may owe.",
};

const cmsIpps: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Inpatient Prospective Payment System (IPPS)",
  url: "https://www.cms.gov/cms-guide-medical-technology-companies-and-other-interested-parties/payment/ipps",
  note: "Current overview of Medicare per-discharge hospital payments, MS-DRGs, bundled facility services, and payment adjustments.",
};

const randHospitalPrices: Source = {
  name: "RAND",
  pageTitle: "Prices Paid to Hospitals by Private Health Plans",
  url: "https://www.rand.org/pubs/research_reports/RRA1144-2-v2.html",
  note: "Claims-based research showing wide variation in commercial hospital prices and how the 2022 study compared them with Medicare payment levels.",
};

const medpacHospitalChapter: Source = {
  name: "Medicare Payment Advisory Commission",
  pageTitle: "Hospital inpatient and outpatient services — March 2026 Report to Congress",
  url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch3_MedPAC_Report_To_Congress_SEC.pdf",
  note: "Primary federal analysis of 2024 hospital capacity, margins, Medicare payments, costs, access, quality, and capital conditions.",
};

const irsHospitalRequirements: Source = {
  name: "Internal Revenue Service",
  pageTitle: "Charitable hospitals — general requirements for tax exemption under Section 501(c)(3)",
  url: "https://www.irs.gov/charities-non-profits/charitable-hospitals-general-requirements-for-tax-exemption-under-section-501c3",
  note: "Official explanation of the community-benefit standard, private-inurement prohibition, and permissible use of hospital surplus funds.",
};

const irs501r: Source = {
  name: "Internal Revenue Service",
  pageTitle: "Requirements for 501(c)(3) hospitals under the Affordable Care Act — Section 501(r)",
  url: "https://www.irs.gov/charities-non-profits/charitable-organizations/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
  note: "Official overview of the additional federal requirements that tax-exempt hospital organizations must meet.",
};

const irsCommunityNeeds: Source = {
  name: "Internal Revenue Service",
  pageTitle: "Community health needs assessment for charitable hospital organizations — Section 501(r)(3)",
  url: "https://www.irs.gov/charities-non-profits/community-health-needs-assessment-for-charitable-hospital-organizations-section-501r3",
  note: "Official requirement for a community health needs assessment at least once every three years and an implementation strategy.",
};

const irsFinancialAssistance: Source = {
  name: "Internal Revenue Service",
  pageTitle: "Financial assistance policy and emergency medical care policy — Section 501(r)(4)",
  url: "https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4",
  note: "Official requirements for written hospital financial-assistance and emergency-care policies.",
};

const irsScheduleH: Source = {
  name: "Internal Revenue Service",
  pageTitle: "Section 501(r) reporting",
  url: "https://www.irs.gov/charities-non-profits/section-501r-reporting",
  note: "Official explanation of Form 990 Schedule H reporting for hospital policies, activities, and community benefit.",
};

const ahrqBoarding: Source = {
  name: "Agency for Healthcare Research and Quality",
  pageTitle: "AHRQ Report Identifies Strategies To Reduce Emergency Department Boarding",
  url: "https://www.ahrq.gov/news/newsletters/e-newsletter/951.html",
  note: "Federal summary defining ED boarding and explaining why causes and solutions extend beyond the emergency department.",
};

const cmsReadmissions: Source = {
  name: "Centers for Medicare & Medicaid Services",
  pageTitle: "Hospital Readmissions Reduction Program",
  url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/hospital-readmissions-reduction-program-hrrp",
  note: "Current description of Medicare's readmission measures and payment reductions, which are capped at 3 percent.",
};

const medicareSnf: Source = {
  name: "Medicare.gov",
  pageTitle: "Skilled nursing facility care",
  url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care",
  note: "Current Original Medicare conditions, timing, costs, observation-status warning, and limited-duration coverage for skilled nursing facility care.",
};

const medicareIrf: Source = {
  name: "Medicare.gov",
  pageTitle: "Inpatient rehabilitation care coverage",
  url: "https://www.medicare.gov/coverage/inpatient-rehabilitation-care",
  note: "Official Medicare overview of medically necessary inpatient rehabilitation facility care and patient cost-sharing.",
};

const oigSnfPriorAuthorization: Source = {
  name: "HHS Office of Inspector General",
  pageTitle: "Medicare Advantage Organizations Overturned Nearly All Appealed Prior Authorization Denials for Skilled Nursing Facility Admission",
  url: "https://oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
  note: "June 2026 federal evaluation of June 2024 SNF prior-authorization decisions across 19 Medicare Advantage organizations.",
};

const oigIrfPriorAuthorization: Source = {
  name: "HHS Office of Inspector General",
  pageTitle: "The Three Largest Medicare Advantage Organizations Denied Requests for Long-Term Acute Care and Inpatient Rehabilitation at Some of the Highest Rates",
  url: "https://oig.hhs.gov/reports/all/2026/the-three-largest-medicare-advantage-organizations-denied-requests-for-long-term-acute-care-and-inpatient-rehabilitation-at-some-of-the-highest-rates/",
  note: "June 2026 federal evaluation of variation in inpatient rehabilitation and long-term acute-care prior-authorization denials and overturns.",
};

export const FOUNDER_HOSPITAL_ECONOMICS_ARTICLES: Article[] = [
  {
    slug: "20-dollar-tylenol-hospital-prices",
    title: "The $20 Tylenol Isn’t Really About the Tylenol",
    category: "Hospital Prices",
    readTime: "10 min read",
    promise: "A hospital line-item charge is only one layer of the price—and usually not the amount the hospital collects or the patient ultimately owes.",
    description: "Why a hospital Tylenol charge is not the pill's true cost: understand gross charges, negotiated rates, insurer payment, patient responsibility, and hospital cost.",
    audience: "Patients staring at a strange hospital bill, healthcare workers who cannot see the financial side of care, and anyone trying to understand why hospital prices do not behave like normal retail prices.",
    summary: "There is no single hospital price for Tylenol. The $20 figure in this headline illustrates a confusing line-item charge; it is not a national average or a quoted price for your care. A charge does not tell you the hospital's acquisition cost, the insurer's negotiated amount, the insurer's payment, or the patient's final responsibility. Hospital care produces several different money numbers for the same encounter. Under Medicare's inpatient payment system, most facility services are bundled into a per-discharge payment based on the case's MS-DRG and adjustments; commercial contracts vary. The practical task is to identify which number you are looking at before deciding what it means.",
    body: [
      "A hospital charge for a common medication can look outrageous because the line item is easy to compare with a drugstore price. That comparison exposes a real transparency problem, but it does not reveal what the hospital was paid or what the patient owes.",
      "One encounter can produce a gross charge, a discounted cash price, a payer-specific negotiated amount, an insurer payment, a patient-responsibility amount, and an internal hospital cost. Those numbers answer different questions.",
      "Medicare usually pays acute inpatient hospital facility services through a prospective per-discharge system. Commercial insurance contracts do not all copy that model, and professional services may be billed separately.",
      "Before paying a confusing balance, match the provider bill to the final EOB and identify the allowed amount, insurer payment, adjustments, and patient responsibility.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-29",
    nextReviewAt: "2027-02-28",
    reviewScope: "Hospital price-transparency definitions, EOB terminology, Medicare inpatient payment, commercial-price evidence, and practical bill-review boundaries.",
    author: AUTHOR,
    systemMap: {
      title: "One clinical encounter, several money numbers",
      description: "The number printed next to a medication is near the beginning of the financial process—not necessarily the end.",
      steps: [
        { title: "Hospital charge", body: "The hospital records a gross line-item charge from its charge structure and submits detailed claim information." },
        { title: "Payer rules", body: "The insurer or public program applies the contract, fee schedule, bundled-payment method, coverage terms, and network rules." },
        { title: "Payment", body: "The payer determines the recognized amount and what it will pay the facility; this may be far below the gross charge." },
        { title: "Patient responsibility", body: "Deductible, copay, coinsurance, noncovered services, network status, and other rules shape what the patient may owe." },
      ],
    },
    editorialSections: [
      {
        title: "Imagine ordering dinner without a usable price",
        paragraphs: [
          "Imagine sitting down at a restaurant and asking the server what the steak costs. The server can explain the meal and bring it safely to the table, but cannot tell you the price. The chef knows how to cook it, not how your dining plan processes it. The meal arrives. Later, a statement lists the steak, napkin, utensils, seasonings, kitchen time, and a restaurant charge—then another company decides what each line means for you.",
          "Make sense? No? Welcome to healthcare costs.",
          "The analogy is imperfect, because a hospital is not a restaurant and emergency care is not an ordinary shopping decision. But it captures the disorienting part: the clinicians delivering care are often separated from the contracts and benefit rules that determine the financial result. I work inside a hospital system, and I still do not routinely see what a patient eventually sees on the financial side.",
        ],
        callout: {
          label: "The central mistake",
          body: "A charge is not automatically a cost, a negotiated price, a payment, or a debt. Treating those words as synonyms makes every later explanation harder.",
        },
      },
      {
        title: "The line item is a signal, not a complete explanation",
        paragraphs: [
          "The medication itself may be inexpensive. The hospital's work around medication use is not: pharmacy verification, secure storage, prescribing systems, nurse administration, allergy checks, documentation, barcode scanning, clinical monitoring, and the ability to deliver care around the clock all require people and infrastructure.",
          "That does not prove that any specific markup is fair. It means the price printed next to one pill cannot be reverse-engineered into a clean measure of what the pill cost the hospital or what the entire system should charge. Hospitals use charge structures for claims and accounting, but the relationship among a line-item charge, underlying cost, and collected payment is neither simple nor consistent across hospitals and payers.",
          "CMS now requires most hospitals to publish several kinds of standard charges, including gross charges, discounted cash prices, payer-specific negotiated charges, and de-identified minimum and maximum negotiated charges. The existence of multiple federally defined price fields is itself evidence that there is no single hospital price.",
        ],
      },
      {
        title: "The five numbers readers most often confuse",
        paragraphs: [
          "The gross charge is the hospital's undiscounted list amount. A discounted cash price is what the hospital has established for a person paying cash or cash equivalent. A payer-specific negotiated charge reflects an agreement with a particular payer and plan. The allowed amount on an EOB is the amount the plan recognizes for the covered service under its rules. Insurer payment and patient responsibility then divide that recognized amount according to the benefit design.",
          "Hospital cost is another number entirely. It refers to resources used to provide care and keep the organization operating. Public cost reports and internal accounting can estimate costs, but a patient's charge line is not a receipt showing the hospital's acquisition cost plus a retail markup.",
          "For an in-network claim, a patient often should focus first on the final EOB's allowed amount, insurer payment, adjustment, and patient responsibility. But gross charges can still matter, especially for uninsured or self-pay patients, out-of-network situations, and bills processed incorrectly. The right lesson is not to ignore charges; it is to identify their role.",
        ],
      },
      {
        title: "Inpatient payment makes the pill-versus-price comparison even stranger",
        paragraphs: [
          "For most acute inpatient stays in Original Medicare, the hospital does not receive a separate final payment for every pill, meal, or nursing task. CMS generally pays the facility a predetermined amount for the discharge. The case is assigned to an MS-DRG using diagnoses, procedures, complicating conditions, age, sex, and discharge status, and the payment is then adjusted for factors such as local wages, teaching status, care for low-income patients, and unusually costly outlier cases.",
          "That does not mean 'the diagnosis is the bill.' The hospital still submits a detailed claim, some items can be paid outside the bundle, clinicians are generally paid separately for professional services, and a patient's cost sharing follows its own rules. Commercial insurers may use DRGs, per-diem rates, case rates, fee schedules, negotiated packages, or combinations. A Medicare explanation should never be silently generalized to every payer.",
          "The result is a system in which the visible Tylenol charge can be real, yet still be a poor description of the transaction that financially settled the stay.",
        ],
        callout: {
          label: "Important boundary",
          body: "A dramatic line-item charge can deserve scrutiny without proving that the hospital collected that amount or earned that amount as profit.",
        },
      },
      {
        title: "What price transparency solves—and what it does not",
        paragraphs: [
          "Price-transparency files and estimator tools can help reveal cash prices and negotiated rates for scheduled services. RAND's national employer-claims study also demonstrates that commercial prices vary widely and, in its 2022 data, averaged well above what Medicare would have paid for the same services at the same facilities.",
          "But emergency care, a changing clinical plan, separate professional bills, benefit accumulators, and contract complexity still make an exact patient estimate difficult. A posted price is more useful when the service is schedulable, the billing codes are known, every relevant provider is identified, and the insurer can confirm how the claim will process.",
          "Transparency is necessary. It is not the same as a simple retail market—and it does not make the bedside nurse, physician, or pharmacist the person who can quote the final bill.",
        ],
      },
      {
        title: "How to read the bill without learning hospital accounting",
        paragraphs: [
          "You do not need to defend the charge or accuse everyone of fraud. Start by naming the document and the number. A pre-service estimate, hospital itemized statement, claim, EOB, and collection notice are not interchangeable.",
          "For a large or confusing insured balance, wait for the final EOB when safe to do so, compare dates and providers, and match the allowed amount, insurer payment, adjustments, and patient responsibility to the provider bill. Ask for an itemized bill if you only received a summary. If the processing or network status looks wrong, contact the plan and provider billing office. If the amount is unaffordable, check the hospital's financial-assistance policy before assuming the balance is final.",
          "Do not delay emergency care to comparison shop. For planned care, ask the facility and insurer for estimates and confirm which clinicians or groups may bill separately.",
        ],
        keyPoints: [
          "Name the document before interpreting the number.",
          "Match the provider bill to the final EOB rather than paying the largest number on sight.",
          "Ask whether the service was in network, covered, bundled, denied, or still pending.",
          "Use the hospital's official financial-assistance pathway if cost is a barrier.",
        ],
      },
    ],
    systemLens: {
      title: "Who controls each layer of the hospital price?",
      description: "No single person controls the entire transaction, which is why the explanation fragments so easily.",
      items: [
        { question: "Who makes the rule?", answer: "Government programs, hospital policy, payer contracts, benefit documents, network terms, and billing law all set different parts of the process." },
        { question: "Who pays?", answer: "A public program or insurer may pay the facility, while the patient or supplemental coverage may owe cost sharing. The mix differs by claim." },
        { question: "Who carries the risk?", answer: "Hospitals risk providing care for less than its cost; payers risk spending above premiums or budgets; patients risk cost sharing and errors they cannot see in advance." },
        { question: "Who performs the work?", answer: "Clinicians, pharmacy, revenue-cycle, coding, registration, utilization, and payer teams each perform one part—usually without a full view of the others." },
        { question: "Who absorbs the failure?", answer: "Patients face confusing balances, clinicians field questions they cannot answer, and administrative teams spend time repairing claims and explanations." },
      ],
    },
    comparisonTable: {
      headers: ["Number", "What it means", "What it does not prove"],
      rows: [
        ["Gross charge", "The hospital's undiscounted list charge for an item or service.", "What the insurer paid, what the patient owes, or what the item cost the hospital."],
        ["Negotiated / allowed amount", "The contract- or plan-recognized amount used to process the covered claim.", "That the whole amount came from the insurer; patient cost sharing may be part of it."],
        ["Insurer payment", "What the plan paid on the processed claim.", "The hospital's total revenue for every related service or the patient's final balance."],
        ["Patient responsibility", "The amount assigned to the patient under the processed claim and benefit rules.", "That the bill is error-free or that financial assistance is unavailable."],
        ["Hospital cost", "An accounting estimate of resources used to provide and support care.", "A price that appears directly and cleanly on the patient's bill."],
      ],
    },
    relatedCalculator: { label: "EOB-to-Bill Match Checker", href: "/tools/eob-to-bill-match-checker" },
    commonMistakes: [
      "Calling every number on a statement 'the cost.'",
      "Assuming a high line-item charge is exactly what the insurer or patient paid.",
      "Assuming a low insurer payment means the patient owes the entire remaining gross charge.",
      "Generalizing Medicare's inpatient DRG payment model to every hospital, payer, service, and claim.",
      "Paying a large insured balance before comparing it with the final EOB and checking assistance options.",
    ],
    takeaway: "The $20 Tylenol is useful because it exposes how little a hospital charge explains by itself. The better question is: which financial layer am I looking at, who set it, and what does the final EOB say I actually owe?",
    sources: [cmsPriceTransparency, cmsEobGuide, cmsIpps, randHospitalPrices, medpacHospitalChapter],
  },
  {
    slug: "what-nonprofit-hospital-actually-means",
    title: "What a Nonprofit Hospital Actually Is (and Isn’t)",
    category: "Hospital Economics",
    readTime: "9 min read",
    promise: "Nonprofit describes a hospital’s ownership, tax, and public-purpose obligations—not a promise to avoid surpluses, bills, executive pay, or hard financial choices.",
    description: "Understand what nonprofit hospital status means, why tax-exempt hospitals can earn surpluses, what Section 501(r) requires, and how to evaluate the claim.",
    audience: "Patients, healthcare workers, community members, and journalists trying to understand how a hospital can be tax-exempt, earn a surplus, pay executives, send bills, and still call itself nonprofit.",
    summary: "A tax-exempt nonprofit hospital generally has no shareholders entitled to its net earnings and must operate for public rather than private interests. It can still charge for care, pay reasonable compensation, borrow money, build reserves, and finish a year with revenue above expenses. Federal law adds hospital-specific duties, including a community health needs assessment, written financial-assistance and emergency-care policies, limits on charges for eligible patients, billing-and-collection rules, and public Schedule H reporting. The label explains a legal structure and set of obligations; it does not, by itself, prove that every price, compensation decision, collection practice, or community-benefit claim is fair.",
    body: [
      "Nonprofit does not mean the hospital must end every year at zero. It means there are no private owners or shareholders entitled to receive the organization's net earnings.",
      "The hospital can earn a surplus and use it for facilities, equipment, reserves, debt service, patient care, education, or research in furtherance of its exempt purpose.",
      "Tax-exempt hospitals also face federal community-benefit and Section 501(r) obligations, including financial-assistance, community-needs, charge-limitation, and billing rules.",
      "The label is not a moral score. Readers should examine Form 990, Schedule H, audited financial statements, the community health needs assessment, and the financial-assistance policy.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-29",
    nextReviewAt: "2027-02-28",
    reviewScope: "Federal 501(c)(3) hospital requirements, Section 501(r), Schedule H, use of surplus, compensation boundaries, and 2024 MedPAC hospital-margin context.",
    author: AUTHOR,
    systemMap: {
      title: "What happens when a nonprofit hospital earns more than it spends",
      description: "The absence of shareholders changes where net earnings can go; it does not eliminate the need for positive cash flow or public accountability.",
      steps: [
        { title: "Revenue comes in", body: "Payments may come from Medicare, Medicaid, commercial plans, patients, grants, donations, and other operating activity." },
        { title: "The hospital pays costs", body: "Payroll, supplies, medications, purchased services, technology, facilities, insurance, debt, and other expenses consume revenue." },
        { title: "A surplus or deficit remains", body: "Revenue above operating expense creates an operating surplus; a shortfall creates a loss. Results vary sharply among hospitals and years." },
        { title: "Net earnings stay with the mission", body: "A tax-exempt hospital cannot distribute net earnings to private shareholders; surplus can support care, reserves, facilities, equipment, education, and research." },
      ],
    },
    editorialSections: [
      {
        title: "Nonprofit is not the same as government-run, charitable in every interaction, or free",
        paragraphs: [
          "The word nonprofit sounds like a description of emotion or intent. Legally, it is closer to a description of ownership and permitted use of earnings. A private nonprofit hospital is not automatically a government hospital. It may compete with for-profit hospitals, negotiate hard with insurers, pursue growth, issue debt, collect patient balances, and pay executives and clinicians.",
          "The key structural distinction is that it does not have private shareholders who are entitled to receive the organization's net earnings. Under federal tax law, the organization must serve public rather than private interests, and its earnings cannot inure to private individuals. Reasonable compensation for work is allowed; excess benefits and private inurement are not.",
          "That distinction matters, but it does not settle every argument about fairness. A legal structure can create obligations without guaranteeing that every decision will feel charitable at the bedside or on a bill.",
        ],
        callout: {
          label: "Plain-English definition",
          body: "A nonprofit hospital can make money. It cannot operate to distribute that money as profit to private owners or shareholders.",
        },
      },
      {
        title: "Why a nonprofit hospital still needs a positive margin",
        paragraphs: [
          "Hospitals have to meet payroll, replace imaging equipment, maintain buildings, buy medications and supplies, fund cybersecurity, absorb emergencies, comply with regulation, and borrow for long-lived projects. A hospital that exactly breaks even in a good year has little room for a bad payer mix, a cyberattack, a staffing shock, a major capital repair, or a sudden drop in volume.",
          "This does not mean every hospital needs the same margin or that growth should always outrank staffing and access. It means 'positive margin' and 'public purpose' are not opposites. Financial durability is one way an essential institution stays available.",
          "MedPAC's March 2026 report illustrates why national hospital finance cannot be reduced to one number. In fiscal year 2024, the hospitals in its analysis had a 6.5 percent all-payer operating margin in aggregate, while the aggregate margin on fee-for-service Medicare inpatient and outpatient services was negative 12.1 percent. Those are different measures across a national group, not proof that every Medicare patient loses money or every hospital is thriving. They show that payer, service, efficiency, geography, and hospital mix matter.",
        ],
      },
      {
        title: "What tax-exempt hospitals owe in return",
        paragraphs: [
          "Federal tax exemption is not simply a title a hospital chooses. The IRS applies a community-benefit standard and requires the organization to serve public rather than private interests. The IRS lists factors such as an emergency room open to all, a community board, an open medical staff, participation in public insurance programs, and use of surplus to improve patient care, facilities, training, education, and research. No one factor automatically decides the result.",
          "Section 501(r) adds hospital-specific rules. A tax-exempt hospital facility must conduct a community health needs assessment at least once every three years and adopt an implementation strategy. It must maintain written financial-assistance and emergency medical care policies, limit amounts charged to patients eligible for assistance, and follow rules governing extraordinary collection actions.",
          "Hospital organizations report policies, activities, and community-benefit information on Form 990 Schedule H. Those filings are imperfect but useful. They let the public examine charity care, means-tested government programs, community health improvement, education, research, subsidized services, and other reported activities rather than relying only on brand language.",
        ],
      },
      {
        title: "A surplus can be necessary without making every use of money defensible",
        paragraphs: [
          "The nonprofit debate often collapses into two claims: either the hospital must be benevolent because it is nonprofit, or the designation is meaningless because the hospital charges money and pays executives. Both are too easy.",
          "Hospitals need capable leadership, and tax law permits reasonable compensation. Communities are still entitled to ask whether compensation was independently approved, whether comparability data were appropriate, whether charity-care screening works, whether eligible patients are pursued for payment, and whether capital expansion reflects community need. A positive margin can fund safer care; it can also be deployed in ways the public reasonably questions.",
          "The honest position is not to excuse every hospital decision. It is to separate the need for financial viability from the quality of the choices made with that viability.",
        ],
        callout: {
          label: "The tension",
          body: "American hospitals are expected to behave like public institutions while operating inside business, labor, debt, and insurance markets. The conflict is real even when a specific hospital deserves criticism.",
        },
      },
      {
        title: "How to evaluate a nonprofit hospital without guessing",
        paragraphs: [
          "Start with the legal entity, because a health system can contain nonprofit, for-profit, foundation, joint-venture, and physician entities. Then read the latest Form 990 and Schedule H, audited financial statements, community health needs assessment, implementation strategy, and financial-assistance policy. Compare several years when possible; a single surplus or deficit can be driven by unusual events.",
          "Look separately at operating results, investment and donation income, debt, days cash on hand, capital spending, executive compensation, charity care, bad debt, reported community benefit, and the services the hospital subsidizes. Ask what changed. A large system can be financially strong overall while an individual hospital, service line, or rural facility is fragile.",
          "Finally, connect the documents to the patient experience. A generous policy that is hard to find or hard to use is not the same as an effective assistance program. A strong margin does not prove overcharging, and a weak margin does not excuse poor billing practices.",
        ],
        keyPoints: [
          "Confirm which legal entity owns and operates the hospital.",
          "Read Form 990, Schedule H, audited financial statements, the CHNA, and the financial-assistance policy together.",
          "Separate operating margin from total margin and one facility from the whole system.",
          "Compare written obligations with how patients can actually access them.",
        ],
      },
    ],
    systemLens: {
      title: "The nonprofit hospital bargain",
      items: [
        { question: "Who makes the rule?", answer: "Congress and the IRS set federal tax-exemption and Section 501(r) requirements; states may add licensing, tax, charity-care, and reporting duties." },
        { question: "Who pays?", answer: "Patients, employers, insurers, Medicare, Medicaid, taxpayers, donors, and communities all fund different parts of hospital activity." },
        { question: "Who carries the risk?", answer: "The hospital carries operating and capital risk; patients carry affordability risk; communities carry access risk if essential services shrink or close." },
        { question: "Who performs the work?", answer: "Clinical teams deliver care while finance, revenue-cycle, compliance, community-benefit, and governance teams translate the legal and financial structure into operations." },
        { question: "Who absorbs the failure?", answer: "Patients can face debt, staff can face cuts, and communities can lose access when financial policy or public obligations fail." },
      ],
    },
    comparisonTable: {
      headers: ["Question", "Tax-exempt nonprofit hospital", "For-profit hospital"],
      rows: [
        ["Who owns the residual value?", "No private shareholders are entitled to net earnings; assets are dedicated to exempt purposes.", "Owners or shareholders can receive economic returns, subject to law and corporate decisions."],
        ["Can it earn more than it spends?", "Yes. An annual surplus does not by itself defeat exemption.", "Yes. Profit is an explicit ownership return and capital objective."],
        ["Can it pay executives and clinicians?", "Yes, including reasonable compensation; private inurement and excess benefits are restricted.", "Yes, under ordinary corporate, compensation, and regulatory rules."],
        ["Hospital-specific federal charity obligations", "Section 501(r) adds CHNA, financial-assistance, charge-limitation, and collection requirements for applicable facilities.", "Not subject to Section 501(r) as a tax-exempt hospital, though other federal and state duties still apply."],
        ["Does the label prove fair prices or practices?", "No.", "No."],
      ],
    },
    questionsHeading: "Documents and questions that reveal more than the label",
    questionsToAsk: [
      "What is the exact nonprofit legal entity, and which facilities or subsidiaries does it include?",
      "What do the latest Form 990, Schedule H, and audited financial statements show across several years?",
      "Where is the hospital's financial-assistance policy, and how are patients screened before collections?",
      "What needs did the latest community health needs assessment identify, and what did the implementation strategy fund?",
      "How were executive compensation and major capital projects approved?",
    ],
    commonMistakes: [
      "Treating nonprofit as a promise that care is free or the hospital cannot earn a surplus.",
      "Treating one national average as the financial condition of every hospital.",
      "Calling all positive cash flow 'profit paid to owners.'",
      "Assuming tax exemption makes every price, collection practice, or compensation decision appropriate.",
      "Reading community-benefit totals without checking definitions, access, and local need.",
    ],
    takeaway: "Nonprofit is a meaningful legal and ownership structure with real public obligations, but it is not a character certificate. Evaluate the hospital’s finances, assistance policy, community benefit, governance, and patient experience together.",
    sources: [irsHospitalRequirements, irs501r, irsCommunityNeeds, irsFinancialAssistance, irsScheduleH, medpacHospitalChapter],
  },
  {
    slug: "why-hospitals-care-about-length-of-stay",
    title: "Why Hospitals Care So Much About Length of Stay",
    category: "Hospital Operations",
    readTime: "10 min read",
    promise: "Length of stay sits where clinical safety, staffed capacity, payment, and discharge barriers collide—so one delayed discharge can affect patients far beyond one room.",
    description: "Why hospitals track length of stay: patient safety, staffed-bed capacity, Medicare DRG payment, discharge barriers, ED boarding, and readmission risk.",
    audience: "Patients and families hearing that discharge is the goal, healthcare workers navigating patient flow, and readers who want to understand why hospitals track length of stay without assuming every discharge is financially motivated.",
    summary: "Hospitals care about length of stay because every additional day can expose a patient to hospital risks, consume scarce staffed capacity, add operating cost, and delay care for someone waiting in the emergency department. Medicare's inpatient system generally pays the facility per discharge rather than per individual item or day, so extra days often add cost without creating a new base payment; commercial contracts vary. At the same time, hospitals face quality, readmission, and safety incentives that make a premature discharge costly and harmful. The real objective should be the shortest safe stay—not the shortest stay at any cost.",
    body: [
      "Length of stay is the time between admission and discharge, but the number sits at the intersection of several different systems.",
      "A hospital bed is not just furniture. It is a room plus nursing capacity, support staff, equipment, specialty capability, cleaning, and the ability to safely accept the next patient.",
      "Under Medicare IPPS, most inpatient facility payment is predetermined per discharge, while each additional day still consumes labor and resources. Other payers use other contract models.",
      "Hospitals also face readmission, quality, and safety consequences, so efficient flow cannot mean discharging a patient before a safe plan exists.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-29",
    nextReviewAt: "2027-02-28",
    reviewScope: "2024 hospital capacity and margin evidence, Medicare IPPS and readmission incentives, AHRQ ED boarding findings, and discharge-safety boundaries.",
    author: AUTHOR,
    systemMap: {
      title: "How one delayed discharge can reach the emergency department",
      description: "The effect is not automatic in every hospital, but this is the common operational chain when a system is already tight.",
      steps: [
        { title: "A patient no longer needs acute hospital treatment", body: "The clinical team may consider the patient medically ready, while a safe destination, service, authorization, caregiver plan, or transport remains unresolved." },
        { title: "The staffed bed remains occupied", body: "The room cannot safely take the next patient until discharge, turnover, and staffing requirements are complete." },
        { title: "An admitted patient waits in the ED", body: "When no appropriate inpatient bed is available, a patient who has been admitted may board in the emergency department." },
        { title: "The delay spreads", body: "ED rooms, nurses, ambulance handoffs, transfers, procedures, and later admissions can all face additional pressure." },
      ],
    },
    editorialSections: [
      {
        title: "The hospital sees a clock; the patient sees a life interrupted",
        paragraphs: [
          "To a patient or family, the length-of-stay conversation can sound like: Why are you trying to push us out? That fear deserves respect. Discharge can mean new medications, equipment, transportation, a home that is not ready, an exhausted family, or a rehabilitation decision nobody expected to make this week.",
          "To the hospital, length of stay is also a measure of whether acute care, diagnostics, consultations, and discharge planning are moving without preventable delay. A day that adds necessary treatment is different from a day spent waiting for an authorization, a dialysis-capable facility, a caregiver decision, oxygen delivery, or transportation.",
          "The useful question is not whether the hospital wants the bed back. Of course it does. The useful question is whether the patient still needs acute hospital care, whether the next setting is safe, and what exactly is preventing the transition.",
        ],
        callout: {
          label: "The right target",
          body: "The goal should be the shortest safe stay—not the shortest possible stay and not an extra hospital day simply because the next system is difficult to arrange.",
        },
      },
      {
        title: "A bed is scarce staffed capacity, not furniture",
        paragraphs: [
          "An empty room does not always mean an available bed. The hospital may lack the right nurse staffing, monitored capacity, isolation setup, specialty service, equipment, environmental-services turnover, or unit capability for the patient who needs admission. The relevant resource is a safe staffed bed for this patient at this moment.",
          "MedPAC reported about 674,000 hospital beds and a 71 percent aggregate occupancy rate in fiscal year 2024, but its own data show substantial variation: 5 percent of hospitals were below 13 percent while another 5 percent were above 90 percent. The measure also counts inpatient beds regardless of how much of the time they were staffed. A national average cannot tell a family whether an ICU, telemetry, psychiatric, pediatric, or medical-surgical bed is available locally tonight.",
          "That is how a hospital can have dark rooms and still board admitted patients in the emergency department. Capacity is local, timed, specialized, and labor-dependent.",
        ],
      },
      {
        title: "Length of stay changes the hospital’s economics",
        paragraphs: [
          "For most Original Medicare acute inpatient stays, the hospital facility receives a prospectively determined payment for the discharge based on the MS-DRG and adjustments. The payment reflects average resources for similar cases rather than reimbursing every actual day or item. If a stay continues because a nonacute barrier remains, the hospital often continues paying for nursing, meals, pharmacy, housekeeping, space, and overhead without receiving another base payment for each extra day. Exception and outlier rules matter, and the exact economics differ by case.",
          "Commercial contracts can pay by DRG, case rate, per diem, fee schedule, percent of charges, or other arrangements. Medicaid programs vary by state. It is inaccurate to say every hospital is always paid one fixed amount or that every additional day is unreimbursed.",
          "Still, the general incentive is clear: hospitals have financial reasons to avoid preventable days and operational reasons to make capacity available for the next patient. Those incentives can align with patient welfare when the extra day provides no acute benefit. They can become dangerous when a metric outruns clinical judgment or when the next setting is unsafe.",
        ],
      },
      {
        title: "The system also punishes unsafe or low-quality discharge",
        paragraphs: [
          "Through the Hospital Readmissions Reduction Program, CMS can reduce eligible hospitals' fee-for-service base operating DRG payments for excess readmissions, with reductions capped at 3 percent. Medicare also links inpatient payment to quality and hospital-acquired conditions through other programs.",
          "More important than the payment formula, an avoidable readmission can harm the patient and consume even more capacity. Medication errors, missing follow-up, unavailable equipment, caregiver confusion, or an unrealistic plan can turn a fast discharge into a failed transition.",
          "This is why the crude story—hospitals make money by throwing patients out—is incomplete. Hospitals face pressure in both directions: move care forward and protect the bed, but do not create a preventable return or unsafe outcome. Those incentives do not guarantee the right decision. They explain why good discharge planning is part of clinical quality, not merely logistics.",
        ],
        callout: {
          label: "Nuance that matters",
          body: "A shorter stay is not automatically better. A longer stay is not automatically safer. The comparison must be between the patient's acute-care need and the safety and availability of the next plan.",
        },
      },
      {
        title: "Why the emergency department feels the failure first",
        paragraphs: [
          "AHRQ defines ED boarding as the period after a decision to admit when no inpatient bed is available. Its 2025 technical work emphasized that the causes often originate at the hospital or health-system level and require solutions beyond the ED. Boarding is associated with delayed care, errors, worse outcomes, staff strain, and public-safety consequences.",
          "The bottleneck may be upstream or downstream: a surge of illness, limited inpatient staffing, delayed tests, operating-room schedules, slow consultation, late transportation, post-acute shortages, insurer authorization, long-term-care barriers, or too few community services. Telling the emergency department to work faster does not create a staffed inpatient bed or a rehabilitation placement.",
          "One delayed discharge does not single-handedly cause a crowded ED. But in a hospital already near its functional limit, many unresolved transitions accumulate. Patient flow is a system property.",
        ],
      },
      {
        title: "What families can ask when discharge feels rushed or stuck",
        paragraphs: [
          "Ask the team to separate the medical plan from the transition plan. What acute treatment or monitoring is still required? What does 'medically ready' mean in this case? What destination is being recommended, and why is it safe? Which barrier remains: clinical acceptance, insurance authorization, facility availability, equipment, medication access, transport, or caregiver capacity?",
          "Then ask who owns the next action and when it will be revisited. A general answer such as 'waiting on rehab' can hide several different steps. A specific answer—therapy documentation was sent, two facilities declined, authorization is pending with reference number X—creates a usable picture.",
          "If the plan feels unsafe, say why in concrete terms and ask for the concern to be addressed. CAF cannot determine whether a person should remain hospitalized; the treating team, hospital process, payer rules, available services, and applicable appeal rights control.",
        ],
        keyPoints: [
          "What acute-care need remains today?",
          "What nonmedical or post-acute barrier is delaying the next safe setting?",
          "Who owns that step, and what has already been submitted or declined?",
          "What backup plan is clinically acceptable if the preferred plan remains unavailable?",
        ],
      },
    ],
    systemLens: {
      title: "Why length of stay becomes everyone’s problem",
      items: [
        { question: "Who makes the rule?", answer: "Clinicians set medical readiness; hospitals set operational processes; payers set coverage and authorization rules; facilities set acceptance criteria." },
        { question: "Who pays?", answer: "Payment depends on payer and contract. Medicare IPPS generally pays per discharge; other arrangements may pay differently." },
        { question: "Who carries the risk?", answer: "Patients carry safety risk, hospitals carry cost and quality risk, staff carry workload risk, and people waiting for care carry delay risk." },
        { question: "Who performs the work?", answer: "Nurses, physicians, therapists, case managers, social workers, pharmacists, transport, environmental services, facilities, and payer teams move the transition." },
        { question: "Who absorbs the failure?", answer: "The patient may remain in the wrong setting, the family may become the backup system, and the ED may hold the next admitted patient." },
      ],
    },
    questionsHeading: "Questions that separate safe discharge from throughput pressure",
    questionsToAsk: [
      "What specific acute treatment, monitoring, or diagnostic work still requires the hospital?",
      "What does 'medically ready for discharge' mean for this patient today?",
      "What barrier remains, and which person or organization owns the next step?",
      "What backup setting or service would be safe if the preferred plan is unavailable?",
      "What notice, authorization, or appeal deadline should the patient or representative understand?",
    ],
    commonMistakes: [
      "Assuming every empty room is a safely staffed bed for any patient.",
      "Assuming every extra day creates another full day of reimbursement.",
      "Assuming every shorter stay is efficient or every longer stay is safer.",
      "Blaming the emergency department for a boarding problem created elsewhere in the system.",
      "Using 'medically ready' as if it means the home, facility, equipment, coverage, and caregiver plan are already solved.",
    ],
    takeaway: "Hospitals track length of stay because time in a staffed bed affects safety, cost, capacity, and everyone waiting behind that patient. The ethical objective is efficient care plus a safe transition—not a discharge clock detached from the person.",
    sources: [cmsIpps, medpacHospitalChapter, ahrqBoarding, cmsReadmissions, cmsPriceTransparency],
  },
  {
    slug: "why-just-send-them-to-rehab-is-not-simple",
    title: "Why “Just Send Them to Rehab” Is Not That Simple",
    category: "Hospital Discharge",
    readTime: "11 min read",
    promise: "A rehab recommendation starts a chain of clinical review, facility acceptance, coverage rules, authorization, staffing, and logistics—it does not reserve a bed.",
    description: "Why hospital rehab placement takes time: IRF vs SNF, therapy documentation, facility acceptance, Medicare rules, prior authorization, beds, and appeals.",
    audience: "Hospital patients, family caregivers, healthcare workers, and anyone who has heard that rehabilitation is recommended and wondered why the transfer still has not happened.",
    summary: "'Rehab' can mean an inpatient rehabilitation facility, a skilled nursing facility, home health, or outpatient therapy. A doctor or therapist can recommend a level of care, but the receiving facility still evaluates clinical fit and capability; the payer applies coverage, network, and authorization rules; and an appropriate staffed bed must be available. For Original Medicare SNF coverage, specific conditions generally include a qualifying three-day inpatient hospital stay, timely transfer, a daily skilled need, and a Medicare-certified facility, subject to exceptions. Medicare Advantage and commercial plans may use prior authorization and different network rules. A recommendation is important evidence—not a reservation, acceptance, or payment guarantee.",
    body: [
      "The word rehab hides several different care settings with different clinical intensity, coverage rules, and staffing.",
      "A physician order or therapy recommendation begins the placement process. It does not guarantee that a facility accepts the referral, a payer authorizes care, or a suitable staffed bed exists.",
      "Original Medicare's skilled nursing facility benefit has specific conditions, including a qualifying inpatient stay in most cases; observation time generally does not count toward that three-day requirement.",
      "Ask which level of rehab is recommended, what documentation was sent, which facilities can meet the need, what the payer decided, and what safe backup plan exists.",
    ],
    publishedAt: PUBLISHED_AT,
    lastReviewedAt: "2026-08-29",
    rulesEffectiveAt: "2026-08-29",
    nextReviewAt: "2026-11-30",
    timeSensitive: true,
    reviewScope: "Current Original Medicare SNF and inpatient rehabilitation coverage, Medicare Advantage prior-authorization evidence, facility-acceptance limits, and discharge-planning safeguards.",
    author: AUTHOR,
    systemMap: {
      title: "Recommendation to transfer: the steps between hospital and rehab",
      description: "Each step answers a different question. A 'yes' at one step does not automatically answer the next.",
      steps: [
        { title: "Clinical recommendation", body: "The hospital team documents functional limits, medical needs, therapy findings, and the level of care it believes is appropriate." },
        { title: "Referral and facility review", body: "Potential facilities review whether they can safely meet the patient's clinical, therapy, medication, equipment, and staffing needs." },
        { title: "Coverage and authorization", body: "The payer applies benefit rules, medical-necessity criteria, network terms, and any prior-authorization process." },
        { title: "Bed, staff, and logistics", body: "An appropriate staffed bed, required services, patient/family agreement, records, medications, and transportation must line up for transfer." },
      ],
    },
    editorialSections: [
      {
        title: "The word rehab is doing too much work",
        paragraphs: [
          "A family may say rehab and picture one place where a patient gets stronger before coming home. The healthcare system hears several different benefits and settings. An inpatient rehabilitation facility provides an intensive hospital level of rehabilitation with physician supervision and coordinated therapy. A skilled nursing facility provides short-term skilled nursing or therapy at a lower intensity. Home health brings qualifying skilled services to a homebound patient. Outpatient therapy assumes the person can live safely outside an institution and travel for treatment.",
          "Those settings are not interchangeable, and the fanciest or most intensive option is not automatically the safest or most appropriate. The right setting depends on medical stability, functional goals, therapy tolerance, nursing needs, cognition, behavior, equipment, medications, caregiver support, and what services are realistically available.",
          "Before arguing about a specific building, ask which level of care is being recommended and what problem that level is meant to solve.",
        ],
        callout: {
          label: "A phrase worth remembering",
          body: "A physician order is not a reservation. A referral is not an acceptance. Insurance coverage is not a bed. A bed is not necessarily a staffed bed.",
        },
      },
      {
        title: "The clinical team recommends; the receiving facility decides whether it can accept",
        paragraphs: [
          "Hospital physicians, nurses, and therapists document why a patient cannot safely return to the prior setting and what rehabilitation or skilled care may be needed. That recommendation matters. It does not make the receiving facility responsible for accepting every referral.",
          "The facility reviews whether the patient meets its clinical criteria and whether it can provide the required care. A facility may lack a staffed bed, isolation capacity, dialysis access, bariatric equipment, respiratory support, medication capability, behavioral resources, specialty follow-up, or a contract with the payer. A bed listed in a directory is not proof of capability today.",
          "Facilities can also reach different conclusions from the same referral. One decline does not prove no facility can help; one acceptance does not prove the payer will authorize or the patient will have no cost sharing.",
        ],
      },
      {
        title: "Original Medicare SNF coverage has a specific checklist",
        paragraphs: [
          "For the Original Medicare skilled nursing facility benefit, Medicare.gov states that Part A coverage generally requires a medically necessary inpatient hospital stay of at least three consecutive days, not counting the discharge day; entry to the SNF within a short time, generally 30 days; a need for daily skilled nursing or therapy related to the qualifying stay; available Part A days; and care in a Medicare-certified SNF. Observation and emergency-department time before formal inpatient admission generally do not count toward the three-day requirement.",
          "There are exceptions and alternate pathways. Certain Accountable Care Organizations may use an approved three-day-rule waiver, and Medicare Advantage plans may waive the three-day minimum. Coverage is limited and cost sharing changes over a benefit period. A recommendation for 'rehab' does not make long-term custodial care a Medicare benefit.",
          "Inpatient rehabilitation facility coverage is a different benefit. Medicare describes it as medically necessary intensive rehabilitation after serious illness, injury, or surgery, with coordinated care and physician supervision. Do not apply the SNF checklist to an IRF or assume an IRF recommendation is a SNF acceptance.",
        ],
        callout: {
          label: "Status can matter",
          body: "Under Original Medicare, several nights in the hospital do not necessarily create a qualifying SNF stay if the patient was receiving outpatient observation services rather than admitted as an inpatient. Always verify the written status and current coverage path.",
        },
      },
      {
        title: "Prior authorization can become the invisible wall",
        paragraphs: [
          "Medicare Advantage and many commercial plans may require prior authorization for post-acute care. The plan or its contractor reviews submitted clinical documentation against coverage and medical-necessity criteria. A pending request can delay a transfer even when the hospital and facility agree on the destination. A denial can shift the conversation to a different level of care, a peer-to-peer review, an appeal, or a backup plan.",
          "A 2026 HHS OIG evaluation gives a carefully bounded example. Across 19 Medicare Advantage organizations in June 2024, 12 percent of skilled nursing facility admission requests were denied. Enrollees and providers appealed 18 percent of those denials; when appealed, 95 percent were overturned in the enrollee's favor. OIG said the high overturn rate raised concerns about initial denials and those never appealed.",
          "That finding does not mean 95 percent of all rehab denials everywhere are wrong. It applies to appealed SNF denials in a defined month, payer group, and Medicare Advantage sample. A companion OIG review found wide variation in inpatient rehabilitation denial and overturn rates. The defensible lesson is narrower: get the decision and reason in writing, identify who issued it, and ask promptly what review or appeal path applies.",
        ],
      },
      {
        title: "Why 'waiting on placement' can take days",
        paragraphs: [
          "Placement is not one phone call. Records may need updating. Therapy notes may need a current functional picture. A facility may request clarification about medications, wounds, oxygen, dialysis, behavior, or follow-up. The payer may request more documentation. The preferred facility may be out of network or full. Transportation may need special equipment. The family may need time to compare options or decide whether it can provide a safe alternative.",
          "Each delay keeps the patient in an acute hospital bed that may no longer be the best clinical setting, while another admitted patient may wait for that capacity. That creates pressure, but pressure is not permission to invent a safe plan. The hospital should keep treating active needs and revisiting alternatives; the family should receive specific information rather than the vague phrase 'insurance is the problem.'",
          "Good case management turns the problem into named steps: recommended level, referrals sent, facilities accepted or declined, authorization status, barriers, patient choice, transport, and backup plan.",
        ],
      },
      {
        title: "Questions that turn a vague delay into an actionable plan",
        paragraphs: [
          "Ask the team which setting is being recommended—IRF, SNF, home health, outpatient therapy, or another level—and what clinical criteria support it. Ask which referrals were sent, which facilities can meet the specific needs, and why any facility declined. Ask whether prior authorization is required, when it was submitted, who is reviewing it, and whether there is a reference number or written determination.",
          "If the payer denies the request, ask for the exact reason, the coverage criteria used, the deadline, and who can initiate an expedited or standard appeal. If no facility is available, ask what safe alternatives the team considers clinically acceptable and what additional support each alternative would require.",
          "Do not assume a facility is covered because it accepted the referral, or that it can meet the patient's needs because it appears in a directory. Confirm network status, expected patient cost, services, medication capability, transportation, and availability with the plan and facility.",
        ],
        keyPoints: [
          "Name the level of care, not just 'rehab.'",
          "Separate clinical recommendation, facility acceptance, and payer approval.",
          "Get denials and appeal instructions in writing when possible.",
          "Ask for the safest realistic backup plan before the preferred plan fails.",
        ],
      },
    ],
    systemLens: {
      title: "Why nobody can promise rehab alone",
      items: [
        { question: "Who makes the rule?", answer: "Medicare, Medicaid, the health plan, contracts, facility criteria, and clinical standards each control a different gate." },
        { question: "Who pays?", answer: "The payer may cover eligible skilled or rehabilitation care under plan terms; the patient may owe deductibles, copays, coinsurance, noncovered days, or services." },
        { question: "Who carries the risk?", answer: "The facility carries clinical and payment risk, the hospital carries delay and capacity risk, and the patient carries safety, cost, and choice risk." },
        { question: "Who performs the work?", answer: "Patients, families, therapists, nurses, physicians, case managers, facility liaisons, payer reviewers, pharmacies, and transport teams all have steps." },
        { question: "Who absorbs the failure?", answer: "The patient may stay in the wrong setting or go home with an unrealistic plan; the family may become unpaid infrastructure; the hospital and ED absorb the delay." },
      ],
    },
    comparisonTable: {
      headers: ["Setting", "Usually means", "What still must line up"],
      rows: [
        ["Inpatient rehabilitation facility (IRF)", "Intensive inpatient rehabilitation with coordinated care and physician supervision.", "Medical necessity, ability to participate, facility acceptance, payer authorization or coverage, network, and bed."],
        ["Skilled nursing facility (SNF)", "Short-term skilled nursing and/or therapy in a Medicare-certified nursing facility when coverage conditions are met.", "Skilled need, qualifying coverage path, certification, acceptance, authorization or plan rules, network, and bed."],
        ["Home health", "Intermittent skilled care at home for a person who meets the applicable coverage requirements.", "Safe home setting, homebound and skilled-need rules where applicable, agency capacity, orders, equipment, and caregiver reality."],
        ["Outpatient therapy", "Therapy visits while the person lives outside an institution.", "Safe living arrangement, transportation, appointment access, coverage, and ability to manage between visits."],
      ],
    },
    relatedCalculator: { label: "Hospital-to-Home Coverage Navigator", href: "/insurance/hospital-discharge-coverage" },
    questionsHeading: "Questions for the hospital, facility, and payer",
    questionsToAsk: [
      "Which level of rehabilitation or skilled care is recommended, and what criteria support it?",
      "Which facilities received the referral, and can they meet this patient's specific clinical and medication needs?",
      "Is prior authorization required, when was it submitted, and what is the reference number or written status?",
      "If the request or referral was declined, what exact reason was given and what review or appeal deadline applies?",
      "What safe backup plan is available if the preferred facility, authorization, or bed does not materialize?",
      "What network status, cost sharing, transportation, and family work should be verified before transfer?",
    ],
    commonMistakes: [
      "Using 'rehab' as if IRF, SNF, home health, and outpatient therapy were the same benefit.",
      "Treating a clinical recommendation as a facility acceptance or insurance guarantee.",
      "Assuming three hospital nights automatically satisfy Original Medicare's three-day inpatient requirement.",
      "Assuming a listed bed is staffed, clinically appropriate, in network, and still available.",
      "Letting a verbal denial or vague pending status pass without asking for the exact decision, reason, and deadline.",
    ],
    takeaway: "Rehab placement is a chain, not an order: clinical recommendation, complete referral, facility capability and acceptance, payer rules, an appropriate staffed bed, and safe logistics must all line up. Name the broken link before deciding what to do next.",
    sources: [medicareSnf, medicareIrf, oigSnfPriorAuthorization, oigIrfPriorAuthorization, ahrqBoarding],
  },
];
