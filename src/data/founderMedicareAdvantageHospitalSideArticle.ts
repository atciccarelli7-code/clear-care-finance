import type { Article } from "./articles";

export const FOUNDER_MEDICARE_ADVANTAGE_HOSPITAL_SIDE_ARTICLE: Article = {
  slug: "what-medicare-advantage-looks-like-from-hospital-side",
  title: "What Medicare Advantage Looks Like From the Hospital Side",
  category: "Medicare & Medicaid",
  readTime: "12 min read",
  publishedAt: "2026-09-29",
  lastReviewedAt: "2026-09-29",
  rulesEffectiveAt: "2026-09-29",
  nextReviewAt: "2027-01-15",
  timeSensitive: true,
  reviewScope: "Current Original Medicare versus Medicare Advantage structure, Medicare Advantage payment mechanics, provider-network and prior-authorization differences, and HHS-OIG findings on post-acute authorization denials and appeals.",
  updateNote: "Publication version incorporates a September 2026 fact-check and reframes the piece as a hospital-side operational perspective rather than a universal plan recommendation.",
  author: "Andrew Ciccarelli, BSN, RN",
  promise: "A case-manager view of what changes when a Medicare patient needs rehab, post-acute care, equipment, or another service that has to move through a private Medicare Advantage plan.",
  audience: "Older adults, caregivers, healthcare workers, and families comparing Medicare coverage who want to understand what Medicare Advantage can look like after a patient is already sick and inside the healthcare system.",
  summary: "Medicare Advantage can offer real advantages: an annual out-of-pocket limit for covered Medicare services, bundled drug coverage in many plans, and extra benefits. But from the hospital side, another part of the product becomes visible: networks, prior authorization, plan-specific criteria, appeals, and the need to coordinate the next site of care through a private insurer. Original Medicare has its own major weaknesses, especially uncapped Part A and Part B out-of-pocket exposure without supplemental coverage. The point of this article is not that one structure is always better. It is that Medicare should be judged in a bad health year, not only by the premium and extras that are easiest to compare while someone is healthy.",
  body: [
    "From the hospital side, Medicare Advantage and Original Medicare can behave very differently when a patient needs the next layer of care."
  ],
  editorialSections: [
    {
      title: "The plan brochure and the hospital see different parts of the same product",
      paragraphs: [
        "When people shop for Medicare coverage, the most visible features are usually the easiest ones to market: the monthly premium, dental or vision benefits, drug coverage, fitness benefits, and the annual out-of-pocket limit.",
        "Those are real benefits, and they matter.",
        "But that is not the part of Medicare Advantage I notice most when I am working inside the hospital.",
        "I notice it when the patient is medically improving but still needs something next: short-term rehabilitation, a skilled nursing facility, home health, durable medical equipment, a specialty service, or another level of post-acute care.",
        "That is where the administrative architecture of the coverage becomes visible.",
        "Original Medicare generally lets a patient use any doctor or hospital that accepts Medicare and, in most cases, does not require prior authorization for covered services and supplies. Medicare Advantage plans may use provider networks and may require prior authorization before certain services are covered.",
        "That difference can be mostly invisible when someone is healthy. It becomes very visible when the patient is in a hospital bed and the next decision cannot happen until another organization reviews the request."
      ]
    },
    {
      title: "Rehab is where the difference becomes hard to ignore",
      paragraphs: [
        "Post-hospital rehabilitation is one of the clearest places to see this.",
        "A physician may agree that a patient no longer needs acute hospital care. Therapy may recommend rehabilitation. The family may agree. A facility may even be clinically interested.",
        "That still does not necessarily mean the transfer can happen.",
        "With Medicare Advantage, the plan may need to authorize the requested post-acute service and the receiving facility may need to be in-network. The hospital then has to coordinate documentation, payer review, facility acceptance, bed availability, transportation, and timing.",
        "Prior authorization is not the only reason a discharge can be delayed. A facility can be full. A patient can be too medically complex for a particular site. Transportation can fail. The family can change the plan. The hospital can still be waiting on a piece of clinical information.",
        "But prior authorization adds another gate that does not usually exist in the same way under Original Medicare.",
        "That is not a philosophical distinction. It is an operational one. Somebody has to submit the request. Somebody has to review it. Somebody has to communicate the decision. And if the answer is no, somebody has to decide whether to appeal, pursue a different setting, or build a new discharge plan."
      ]
    },
    {
      title: "A denial is not the same thing as proof that the care was unnecessary",
      paragraphs: [
        "This is where the evidence matters.",
        "In 2022, the HHS Office of Inspector General reviewed a sample of prior-authorization denials from 15 large Medicare Advantage organizations. OIG estimated that 13% of the denied requests actually met Medicare coverage rules. The services in those cases likely would have been approved under Original Medicare.",
        "The report included post-acute facility care among the services involved. In some cases, the Medicare Advantage organization said the request lacked enough documentation, while OIG reviewers concluded that the existing medical record was already sufficient to support medical necessity.",
        "That does not mean 13% of every Medicare Advantage denial is wrong today. The review looked at a sample from 2019, and plan rules and federal requirements have continued to change.",
        "It does mean something narrower and important: a denial cannot automatically be interpreted as proof that the requested care failed Medicare coverage rules."
      ],
      callout: {
        label: "The distinction",
        body: "Medical need, Medicare coverage rules, a Medicare Advantage plan's review process, and the plan's initial decision are related. They are not interchangeable."
      }
    },
    {
      title: "The newer skilled-nursing data make the hospital-side concern more current",
      paragraphs: [
        "HHS-OIG published another report in June 2026 focused specifically on Medicare Advantage requests for skilled nursing facility admission.",
        "Across 19 Medicare Advantage organizations, 12% of SNF admission requests in June 2024 were denied. Denial rates varied widely by organization, from 0.4% to 23%.",
        "Only 18% of those denials were appealed. Among the denials that were appealed, the Medicare Advantage organizations overturned 95% in favor of the enrollee.",
        "That number needs careful interpretation. Appealed cases are a selected subset, and an appeal may include new information. OIG did not conclude that 95% of every initial SNF denial was improper.",
        "Still, OIG itself said the extremely high overturn rate indicates that some enrollees were initially denied medically necessary care and raises concerns about denials that were never appealed.",
        "For a hospital case manager or family, that matters because the cost of an initial denial is not only theoretical. It can mean another appeal, another day waiting, a search for a different facility, a changed discharge plan, or a family trying to understand why the recommended next step is suddenly uncertain."
      ]
    },
    {
      title: "Inpatient rehabilitation shows the same issue in a different form",
      paragraphs: [
        "A separate 2026 HHS-OIG report looked at prior-authorization requests for long-term acute care hospitals and inpatient rehabilitation facilities.",
        "Among the 19 Medicare Advantage organizations reviewed, the three largest by enrollment denied those requests at higher rates than most of their peers in June 2024.",
        "When denials were appealed, the organizations collectively overturned 36% of long-term acute care hospital denials and 43% of inpatient rehabilitation facility denials. OIG also found wide variation between organizations.",
        "Again, the correct conclusion is not that every denial was wrong or that every patient should have received the requested setting.",
        "The more defensible conclusion is that Medicare Advantage organizations can reach meaningfully different decisions around post-acute care, and some initial decisions are later reversed.",
        "That is the part families rarely see when they are comparing premiums at the kitchen table."
      ]
    },
    {
      title: "Why would a private Medicare plan create more review in the first place?",
      paragraphs: [
        "Because Medicare Advantage is not simply Original Medicare with a different logo.",
        "CMS pays Medicare Advantage organizations a monthly amount for each enrolled beneficiary, adjusted in part for health status and expected cost. The plan then administers the Medicare benefit under federal rules.",
        "That structure gives plans a reason to manage utilization. If a service is unnecessary, duplicative, outside the covered benefit, or could be delivered appropriately in a less intensive setting, reviewing it can protect both the program and the plan from unnecessary spending.",
        "That is the strongest counterargument to treating every authorization requirement as inherently bad.",
        "Healthcare does contain low-value care. More care is not always better care. A utilization-management process can have a legitimate purpose.",
        "But there is an unavoidable tension: the same organization responsible for paying for covered care is also operating a system designed to decide when requested care qualifies. Risk adjustment, quality rules, appeals, CMS oversight, and benefit requirements all complicate that incentive, so it would be too simplistic to say that every denial is motivated by profit.",
        "The more useful question is whether the review process reliably distinguishes unnecessary care from covered, medically necessary care without creating avoidable barriers.",
        "The OIG findings are important because they show that this process does not always get the first decision right."
      ]
    },
    {
      title: "The network matters more when the patient becomes complicated",
      paragraphs: [
        "Networks are another difference that can feel abstract until the patient needs a very specific kind of care.",
        "A primary-care physician being in-network does not necessarily tell you whether the preferred hospital, cardiologist, cancer center, skilled nursing facility, inpatient rehab facility, home-health agency, or equipment supplier will also work cleanly with the plan.",
        "From the hospital side, a discharge plan is not just a recommendation. It has to become an executable plan.",
        "A facility has to accept the patient clinically. It has to have the right capabilities. It has to have a bed. And under many Medicare Advantage arrangements, it also has to fit the plan's network and authorization rules.",
        "Original Medicare generally offers broader provider choice because the patient can use doctors and hospitals that take Medicare across the United States. That broader access is one reason some people value it.",
        "But broader access does not erase Original Medicare's financial weaknesses."
      ]
    },
    {
      title: "Traditional Medicare is not the flawless alternative",
      paragraphs: [
        "This article would be misleading if it stopped with Medicare Advantage friction and treated Original Medicare as the easy answer.",
        "Original Medicare has no built-in annual limit on what a beneficiary can pay out of pocket for Part A and Part B services. After the Part B deductible, patients commonly owe 20% of the Medicare-approved amount for Part B-covered services. Hospital and skilled-nursing cost sharing can create additional exposure.",
        "That is why many people using Original Medicare also carry Medigap, Medicaid, employer or retiree coverage, or another form of supplemental coverage.",
        "Medicare Advantage, by contrast, must include a yearly limit on what the enrollee pays for covered Medicare services. Many plans also bundle Part D drug coverage and may provide extra benefits that Original Medicare does not routinely cover.",
        "Those are not trivial advantages.",
        "The tradeoff is that Medicare Advantage can place more of the care journey inside plan networks, authorization rules, and plan-specific administration.",
        "So the real comparison is not 'private plan bad, government plan good.' It is one set of protections and constraints versus another."
      ]
    },
    {
      title: "The shipping-insurance analogy is closer to how I think about it",
      paragraphs: [
        "I keep coming back to a shipping analogy.",
        "If I am mailing something ordinary and easily replaceable, I might choose the cheapest shipping option and accept a little more uncertainty.",
        "If I am shipping something extremely valuable, the calculus changes. I may willingly pay more for insurance, tracking, signature requirements, and a process that reduces the risk of a disastrous problem.",
        "Healthcare for older adults feels closer to the second situation.",
        "The point is not that Original Medicare by itself is a paid guarantee. It is not. Original Medicare can leave substantial cost exposure, which is why supplemental coverage matters so much.",
        "The analogy is about what people are actually buying when they pay more for a coverage structure with broader provider access and supplemental protection: less friction and less uncertainty in the scenarios that matter most.",
        "That does not make Medicare Advantage irrational. A Medicare Advantage plan may be less expensive, more convenient, and an excellent fit for a particular person.",
        "It means the value of insurance should be judged partly by how it performs when the expensive, complicated event actually happens."
      ]
    },
    {
      title: "The used-car analogy has the same lesson",
      paragraphs: [
        "Another way to think about it is buying a car.",
        "A lower sticker price can be a great deal. But the sticker price is not the entire ownership experience.",
        "You would still want to know the warranty, repair history, parts availability, service network, expected maintenance, and what happens if something major breaks.",
        "Medicare coverage deserves the same kind of stress test.",
        "The monthly premium is the sticker price.",
        "The rest of the ownership experience is what happens when you need specialists, hospitalization, rehabilitation, home health, equipment, expensive drugs, travel coverage, or an appeal.",
        "A lower upfront price can still be the right choice. It is just incomplete information."
      ]
    },
    {
      title: "This is your health. The bad year matters more than the easy year.",
      paragraphs: [
        "The strangest part of shopping for health insurance is that people often evaluate it during a healthy month.",
        "But Medicare is coverage for a stage of life when healthcare needs generally become more important, not less.",
        "That is why I think the correct stress test is the bad year.",
        "What happens if you are hospitalized?",
        "What happens if you need a specialist who is not nearby?",
        "What happens if therapy recommends rehab?",
        "What happens if the first facility is out-of-network?",
        "What happens if authorization is denied?",
        "What happens if you need home health, oxygen, a wheelchair, an expensive Part B drug, or repeated outpatient care?",
        "What is your realistic financial exposure?",
        "Those questions do not produce one universal answer. They produce a better decision."
      ]
    },
    {
      title: "What the hospital side adds to the Medicare conversation",
      paragraphs: [
        "I do not think Medicare Advantage should be judged only by its worst authorization stories. I also do not think it should be judged only by its premium and extra benefits.",
        "The hospital sees a part of the product that is easy to miss before enrollment: whether the coverage structure helps or complicates the movement from one level of care to the next.",
        "Original Medicare is not free, and without supplemental coverage it can expose a patient to serious out-of-pocket costs.",
        "Medicare Advantage can cap covered Medicare cost sharing and bundle useful benefits, but it can also insert networks and authorization into decisions that become urgent when someone is sick.",
        "That is the tradeoff I wish more families could see before they are forced to learn it during a hospitalization.",
        "If you are comparing the two structures, do not ask only, 'What does this cost me while I am healthy?'",
        "Also ask, 'What does this coverage require from me when I actually need care?'"
      ]
    }
  ],
  systemLens: {
    title: "What changes depending on the Medicare structure?",
    description: "The patient may need the same clinical care, but the path from recommendation to delivery can involve different financial and administrative gates.",
    items: [
      {
        question: "Who pays?",
        answer: "Under Original Medicare, Medicare generally pays providers directly under federal payment rules. Under Medicare Advantage, CMS pays a private Medicare Advantage organization to administer covered Part A and Part B benefits for its enrollees."
      },
      {
        question: "Who controls access?",
        answer: "Clinical need starts with the treating team, but Medicare coverage rules, plan networks, prior authorization, facility acceptance, and provider capacity can all determine whether the proposed next step actually happens."
      },
      {
        question: "Who carries financial risk?",
        answer: "Original Medicare beneficiaries can face uncapped Part A and Part B out-of-pocket exposure without supplemental coverage. Medicare Advantage plans must cap covered Medicare-service out-of-pocket spending, while the plan also manages the cost of covered care."
      },
      {
        question: "Who absorbs the operational work?",
        answer: "Patients, families, hospitals, case managers, providers, receiving facilities, and plan staff all absorb pieces of the coordination burden when authorization, network, documentation, or appeal steps are required."
      }
    ]
  },
  questionsHeading: "Questions to ask before choosing or renewing a Medicare plan",
  questionsToAsk: [
    "If I need short-term rehab or skilled nursing after a hospitalization, is prior authorization required?",
    "Which hospitals, specialists, skilled nursing facilities, inpatient rehab facilities, home-health agencies, and equipment suppliers are in-network?",
    "What happens if the recommended facility is out-of-network or has no bed?",
    "What is the plan's annual out-of-pocket limit for covered Medicare services, and what costs do not count toward it?",
    "If I use Original Medicare, what supplemental coverage will protect me from uncapped Part A and Part B cost sharing?",
    "What is the process and deadline for an expedited appeal if post-acute care is denied?",
    "How does the coverage work when I travel or spend part of the year in another state?",
    "What are my exact prescription-drug and Part B drug costs under this coverage?"
  ],
  commonMistakes: [
    "Comparing Medicare plans only by monthly premium.",
    "Assuming a therapy or physician recommendation automatically creates coverage for post-acute care.",
    "Assuming an initial authorization denial proves the requested care was not medically necessary.",
    "Checking the primary-care doctor but not the hospital, specialists, rehab facilities, home health, and equipment network.",
    "Treating Original Medicare as financially complete without understanding Medigap or other supplemental coverage.",
    "Waiting until a hospitalization to learn the plan's appeal and post-acute authorization rules."
  ],
  takeaway: "Medicare Advantage and Original Medicare solve different problems. Medicare Advantage can provide an out-of-pocket limit, bundled coverage, and extra benefits, while adding plan networks and prior-authorization processes that become especially visible during hospitalization and post-acute care. Original Medicare generally offers broader provider access and less prior-authorization friction, but can leave major uncapped cost exposure without supplemental coverage. Judge either structure by the bad health year, not just the healthy-month premium.",
  sources: [
    {
      name: "Medicare.gov",
      pageTitle: "Compare Original Medicare & Medicare Advantage",
      url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
      note: "Official comparison of provider access, referrals, prior authorization, premiums, supplemental coverage, and out-of-pocket limits."
    },
    {
      name: "Centers for Medicare & Medicaid Services",
      pageTitle: "Report to Congress: Risk Adjustment in Medicare Advantage",
      url: "https://www.cms.gov/files/document/report-congress-risk-adjustment-medicare-advantage-december-2024.pdf",
      note: "Official explanation of Medicare Advantage capitation and risk adjustment, including how monthly plan payments account for expected beneficiary costs."
    },
    {
      name: "HHS Office of Inspector General",
      pageTitle: "Some Medicare Advantage Organization Denials of Prior Authorization Requests Raise Concerns About Beneficiary Access to Medically Necessary Care",
      url: "https://oig.hhs.gov/reports/all/2022/some-medicare-advantage-organization-denials-of-prior-authorization-requests-raise-concerns-about-beneficiary-access-to-medically-necessary-care/",
      note: "2022 OIG review estimating that 13% of sampled denied prior-authorization requests met Medicare coverage rules."
    },
    {
      name: "HHS Office of Inspector General",
      pageTitle: "Medicare Advantage Organizations Overturned Nearly All Appealed Prior Authorization Denials for Skilled Nursing Facility Admission",
      url: "https://www.oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
      note: "June 2026 OIG findings on SNF denial rates, appeals, overturns, contractor variation, and limits of interpreting appealed cases."
    },
    {
      name: "HHS Office of Inspector General",
      pageTitle: "The Three Largest Medicare Advantage Organizations Denied Requests for Long-Term Acute Care and Inpatient Rehabilitation at Some of the Highest Rates",
      url: "https://oig.hhs.gov/reports/all/2026/the-three-largest-medicare-advantage-organizations-denied-requests-for-long-term-acute-care-and-inpatient-rehabilitation-at-some-of-the-highest-rates/",
      note: "June 2026 OIG analysis of LTCH and inpatient-rehabilitation prior-authorization denial and appeal patterns across 19 Medicare Advantage organizations."
    },
    {
      name: "Medicare.gov",
      pageTitle: "Medicare costs",
      url: "https://www.medicare.gov/basics/costs/medicare-costs",
      note: "Official Medicare cost guidance, including Original Medicare's lack of a yearly out-of-pocket limit without supplemental coverage."
    }
  ]
};
