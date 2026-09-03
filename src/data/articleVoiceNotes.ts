export type ArticleVoiceNote = {
  eyebrow: string;
  title: string;
  body: string;
};

export const ARTICLE_VOICE_NOTES: Record<string, ArticleVoiceNote> = {
  "hospitals-are-businesses-and-public-utilities": {
    eyebrow: "From Andrew's manuscript",
    title: "A hospital can be a business without being only a business.",
    body: "I started with a grocery-store thought experiment because the contradiction is easier to see outside healthcare. Hospitals must pay for staff, equipment, technology, buildings, and everything required to stay ready. But when someone arrives with an emergency, we do not want the first question to be whether the transaction is profitable. Understanding the business constraint should make the public mission more concrete, not less important.",
  },
  "prior-authorization-explained": {
    eyebrow: "From inside the handoff",
    title: "A recommendation starts the coverage process; it does not finish it.",
    body: "A clinician can be clear about the next medically appropriate step while the payer, provider, facility, pharmacy, or supplier still has a separate decision to make. I have learned to stop using the word ‘approval’ by itself. The useful question is who approved what: the clinical plan, the benefit, the authorization, the receiving service, or the final claim.",
  },
  "hospital-profitable-unprofitable-service": {
    eyebrow: "From Andrew's payment-system notes",
    title: "The payment and the cost of the care are not the same number.",
    body: "The fixed-payment example was how I first made hospital economics understandable to myself: if payment is set through a case-based method, one stay can use fewer resources than the payment and another can use more. The researched version is more complicated—Medicare adjusts payment, other payers use different contracts, and shared costs must be allocated—but the core lesson holds. ‘The hospital made money’ is incomplete until we say at which level.",
  },
  "why-hospitals-become-the-systems-shock-absorber": {
    eyebrow: "From inside patient flow",
    title: "The place holding the problem did not always create the whole problem.",
    body: "I have watched the hospital absorb consequences from outside its walls: a missing post-acute bed, delayed authorization, no safe ride, limited home support, or a service the next setting could not provide. The hospital still owns its staffing and flow decisions. But if we only blame the room where the delay becomes visible, we miss the rule, payment, capacity, or handoff that sent the problem there.",
  },
  "home-with-family-is-not-a-free-care-plan": {
    eyebrow: "From care-transition work",
    title: "The word ‘family’ can hide an entire staffing plan.",
    body: "I have heard discharge plans compressed into phrases like ‘home with family’ when the real plan included medicines, rides, meals, mobility help, appointments, supervision, equipment, and somebody staying available when the plan changed. Family care can be exactly what a person wants. It still has to be named, taught, agreed to, and backed up like real work.",
  },
  "20-dollar-tylenol-hospital-prices": {
    eyebrow: "From inside the hospital system",
    title: "The clinician giving the medication usually cannot quote the financial result.",
    body: "I work inside a hospital system, and even I do not routinely see what patients eventually see on the financial side. The nurse can verify the medication, explain why it is being given, and watch whether it helps. That does not mean the nurse can see the payer contract, the allowed amount, the claim adjustments, or the final patient responsibility. The $20 Tylenol is really a story about those disconnected layers.",
  },
  "what-nonprofit-hospital-actually-means": {
    eyebrow: "The contradiction behind the label",
    title: "Public expectations meet business constraints.",
    body: "American hospitals are often expected to behave like public institutions while operating inside labor, debt, insurance, and capital markets. That does not excuse every charge, collection decision, expansion, or executive salary. It does explain why 'nonprofit' cannot mean 'financially indifferent.' A hospital can need a positive margin and still deserve hard questions about how it earns and uses that margin.",
  },
  "why-hospitals-care-about-length-of-stay": {
    eyebrow: "From patient-flow work",
    title: "A bed is staffed capacity, not furniture.",
    body: "An empty room does not necessarily mean the hospital can safely place the next patient there. The room needs the right nursing capacity, equipment, monitoring, unit capability, and support services. When a safe discharge is delayed, the consequence can travel backward through the hospital until an admitted patient is waiting in the emergency department for the staffed bed that has not opened yet.",
  },
  "observation-vs-inpatient-status": {
    eyebrow: "From the patient side of classification",
    title: "The room can look the same while the coverage category changes.",
    body: "A patient can see the same bed, wristband, nurse, meals, tests, and hospital name while Medicare sees outpatient observation rather than inpatient admission. That disconnect is why status must be asked, documented, and connected to the actual plan—not guessed from how serious the stay felt or how many nights passed.",
  },
  "why-just-send-them-to-rehab-is-not-simple": {
    eyebrow: "From care-transition work",
    title: "A recommendation starts the process; it does not finish it.",
    body: "A physician order is not a reservation. A referral is not an acceptance. Insurance coverage is not a bed. A bed is not necessarily a staffed bed. Families often hear 'rehab is recommended' as if the destination has been decided. Inside the process, that sentence is the beginning of several separate clinical, coverage, facility, and logistics decisions.",
  },
  "deductible-copay-coinsurance-out-of-pocket-max": {
    eyebrow: "A de-identified bedside lesson",
    title: "Medication affordability can be a coverage-literacy problem.",
    body: "I cared for a patient who was rationing important medications because the monthly prices looked impossible. The missing question was whether the prescriptions were covered, which costs counted toward the plan's out-of-pocket limit, and what the total plan-year exposure could be. The lesson is not that every drug becomes free after a certain payment. It is that nobody should abandon a prescribed medication before verifying the formulary, pharmacy network, cost-sharing accumulator, and available assistance with the plan, pharmacist, and prescriber.",
  },
  "prescription-coverage-open-enrollment-checklist": {
    eyebrow: "From discharge education",
    title: "Affordability belongs in the medication-safety conversation.",
    body: "A medication list is not a workable discharge plan if the patient cannot obtain the medications on it. I learned to treat cost and coverage as practical safety questions: Is the drug covered? Is this the required pharmacy? Does it need authorization? Is there a covered alternative or a legitimate assistance pathway? Those questions should be answered before a refill becomes an emergency, not after doses have already been skipped.",
  },
  "how-hospital-403b-matching-works": {
    eyebrow: "From conversations with hospital coworkers",
    title: "The match is easy to overlook when the paycheck feels more urgent.",
    body: "I kept finding that coworkers were willing to save but had never been shown how the hospital match, vesting rules, and contribution election fit together. The useful conversation was rarely about choosing a perfect percentage. It was about finding the actual match formula, contributing enough to capture available employer value when feasible, confirming the money was invested, and building from there without creating a paycheck crisis.",
  },
  "medicare-medicaid-changes-january-2027": {
    eyebrow: "From the discharge-planning side",
    title: "Policy details can affect discharge planning.",
    body: "In the hospital, Medicaid can affect discharge options, long-term care placement, transportation, medications, home support, and patient cost-sharing. This article is meant to help readers understand the January 2027 changes before they show up as paperwork questions or coverage checks.",
  },
  "workplace-benefits-definitions": {
    eyebrow: "From the hospital side",
    title: "Benefits are part of your paycheck, even when they do not feel like it.",
    body: "As a bedside RN, I have seen how easy it is to focus only on hourly pay and ignore the benefits screen until open enrollment is almost over. The boring choices — health plan, disability coverage, beneficiaries, 403(b) contribution, and match — can matter as much as an extra shift. This article is meant to make those choices feel less like HR paperwork and more like part of your real compensation.",
  },
  "how-to-pick-retirement-investments-at-work": {
    eyebrow: "From my own 403(b) learning curve",
    title: "The hard part is not becoming an investing expert. It is avoiding the obvious mistakes.",
    body: "I learned this while trying to make sense of my own hospital retirement plan. Most healthcare workers are not handed a clean investing lesson after orientation. We get a fund menu, a match formula, and a lot of jargon. The practical goal is simple: capture the match when possible, make sure the money is actually invested, keep fees reasonable, and choose something you can stick with when the market is ugly.",
  },
  "use-credit-cards-without-credit-card-debt": {
    eyebrow: "From a simple credit-card rule",
    title: "There is no ego in personal finance.",
    body: "A rewards card is not impressive if the balance creates stress or interest. A low-limit secured card, a bank-linked credit-builder product, or even staying with debit can be the smarter choice while the routine is being built. The objective is not to prove that you can manage the largest limit. It is to build credit without creating a new monthly problem.",
  },
  "hospital-cafe-habit": {
    eyebrow: "From 12-hour shifts",
    title: "The coffee is not the enemy. Invisible autopilot spending is.",
    body: "This article comes from real hospital life: long shifts, quick breaks, stress, and the feeling that a coffee or cafeteria lunch is the one small thing you get for yourself. That is valid. The point is not to shame the purchase. The point is to notice when the same small comfort becomes a recurring bill that quietly competes with your emergency fund, debt payoff, travel, or investing goals.",
  },
  "healthcare-worker-discounts": {
    eyebrow: "From a money-conscious healthcare worker",
    title: "A discount should lower a planned cost, not create a new one.",
    body: "Healthcare workers deserve perks. The trap is when a discount turns into permission to buy something you did not want ten minutes ago. I want this page to stay useful and clean — not a coupon wall, not a fake affiliate list, and not another reason for exhausted workers to spend more after a hard week.",
  },
  "burnout-overspending-overeating": {
    eyebrow: "From bedside burnout",
    title: "Hard shifts create predictable weak points.",
    body: "After charge shifts, staffing problems, family complaints, admissions, discharges, and emotionally heavy days, willpower is usually not at full strength. That does not make someone lazy or irresponsible. It means the plan has to be built before the shift: food available, money moved automatically, easy recovery options, and friction around the purchases that feel good for ten minutes but create stress the next morning.",
  },
  "backup-care-plans-for-busy-healthcare-workers": {
    eyebrow: "From shift-work reality",
    title: "Backup care is part of the real cost of working in healthcare.",
    body: "Healthcare schedules do not always respect daycare pickup, pet medication, family routines, or the plan you made at the start of the week. This is not about making life perfectly optimized. It is about having a simple backup plan before a late shift, overtime call, or bad day forces you to solve everything while exhausted.",
  },
  "why-er-visit-is-expensive": {
    eyebrow: "From inside the hospital system",
    title: "One visit can become many bills.",
    body: "From the clinical side, an ER visit can look like one encounter. From the billing side, it can turn into a facility charge, clinician bill, lab claim, imaging claim, medication charge, supply charge, and insurance cost-sharing. That disconnect is why patients can feel blindsided even when the care was appropriate. The goal here is not to scare people away from emergency care. It is to help them understand what they are looking at before paying a confusing balance.",
  },
  "how-to-read-an-eob": {
    eyebrow: "Plain-English billing habit",
    title: "Do not pay the scary number first.",
    body: "A lot of medical billing anxiety comes from seeing a large number before knowing what insurance actually allowed, paid, denied, or assigned to the patient. The practical habit is simple: match the provider bill to the EOB by date, provider, allowed amount, insurance payment, and patient responsibility before you pay a large or confusing balance.",
  },
  "obbb-overtime-tax-deduction-healthcare-workers": {
    eyebrow: "From healthcare-worker overtime reality",
    title: "Overtime can help, but the headline needs to be accurate.",
    body: "Hospital workers know overtime is not abstract. It is another 12-hour shift, a short-staffed weekend, a charge shift, a holiday, or a pickup shift when the unit needs help. The OBBB overtime deduction may make qualifying overtime more valuable after federal income tax, but it does not make every overtime dollar tax-free. This article keeps the focus on the practical piece healthcare workers need to understand: the extra half-time premium.",
  },
};
