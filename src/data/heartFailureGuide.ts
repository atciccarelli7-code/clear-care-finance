import type { Source } from "./sources";

export const HEART_FAILURE_GUIDE_ROUTE = "/patients-families/diagnosis-explained/heart-failure";

export type HeartFailureTest = {
  name: string;
  plainName?: string;
  questionAnswered: string;
  whatToKnow: string;
};

export type HeartFailureMedicationGroup = {
  id: string;
  name: string;
  commonName?: string;
  examples: string[];
  job: string;
  whyItMayBeUsed: string;
  whatTheTeamMayMonitor: string[];
  questionsToAsk: string[];
  importantBoundary: string;
};

export type HeartFailureActionLevel = {
  id: "emergency" | "same-day" | "steady";
  label: string;
  instruction: string;
  signs: string[];
  verification: string;
};

export const HEART_FAILURE_GUIDE = {
  status: "clinical-review" as const,
  title: "Heart Failure, Explained",
  subtitle: "A calm, plain-English guide for adults who have already received a heart-failure diagnosis and the people helping them.",
  shortTitle: "Heart Failure, Explained",
  updatedAt: "2026-07-22",
  nextReviewAt: "2026-08-22",
  reviewScope:
    "Adult heart-failure definition, ejection-fraction phenotype, stage, functional class, causes, diagnostic evaluation, treatment goals, medication purpose, devices, home monitoring, warning signs, and care-team questions. Independent clinical review is still pending.",
  audience:
    "Adults who have been told they have heart failure, congestive heart failure, HFrEF, HFpEF, or improved ejection fraction, plus family members and caregivers.",
  boundary:
    "This guide explains a diagnosis already made by a clinician. It does not determine whether someone has heart failure, interpret an individual test result, select treatment, or provide medication doses or dose-change instructions.",
  quickExplanation: {
    title: "The 30-second explanation",
    body:
      "Heart failure does not mean the heart has stopped. It means the heart cannot fill or pump well enough to meet the body's needs without causing problems. Blood and fluid may back up into the lungs or other tissues, while the body may receive less effective blood flow.",
    repeatBack:
      "A simple way to say it: My heart is still working, but it is having trouble filling, pumping, or keeping up without creating extra pressure or fluid buildup.",
  },
  doesNotMean: [
    "It does not automatically mean the heart is about to stop.",
    "It does not mean every person has a weak squeeze. Some people have a preserved ejection fraction but abnormal filling or pressure.",
    "It does not mean everyone receives the same medication plan, sodium limit, fluid limit, device, or prognosis.",
    "An improved ejection fraction does not automatically mean the underlying condition is cured or that treatment should be stopped.",
  ],
  terms: [
    {
      term: "Heart failure",
      meaning: "A clinical syndrome in which the heart cannot fill or pump effectively enough without producing symptoms, signs, or abnormal pressures.",
    },
    {
      term: "Congestive heart failure (CHF)",
      meaning: "A commonly used term that emphasizes congestion or fluid buildup. Not every person with heart failure has obvious congestion all the time.",
    },
    {
      term: "Ejection fraction (EF)",
      meaning: "The percentage of blood pushed out of the left ventricle with each squeeze. It is useful, but it is only one part of the diagnosis.",
    },
    {
      term: "Guideline-directed medical therapy (GDMT)",
      meaning: "Medication groups supported by professional guidelines for eligible patients. The exact combination depends on the type of heart failure and the person's overall health.",
    },
  ],
  types: [
    {
      name: "Reduced ejection fraction",
      abbreviation: "HFrEF",
      plainEnglish: "The main pumping chamber has a weakened squeeze.",
      whyItMatters:
        "This category has a well-established group of heart-protective medications. Diuretics may be added when fluid is building up.",
    },
    {
      name: "Preserved ejection fraction",
      abbreviation: "HFpEF",
      plainEnglish: "The squeeze percentage may look preserved, but the heart may be stiff, fill poorly, or require abnormally high pressure to fill.",
      whyItMatters:
        "Treatment often focuses on congestion, blood pressure, rhythm problems, kidney and metabolic conditions, and other contributing causes.",
    },
    {
      name: "Improved ejection fraction",
      abbreviation: "HFimpEF",
      plainEnglish: "The ejection fraction was previously reduced and later improved.",
      whyItMatters:
        "Improvement is meaningful, but it is not automatically the same as cure. The treating team decides whether long-term therapy should continue.",
    },
  ],
  typeNote:
    "Current 2026 professional consensus groups heart failure into reduced, preserved, and improved ejection-fraction categories rather than treating one rigid number as the complete diagnosis. Some reports and older resources may also use mildly reduced ejection fraction or left-sided and right-sided labels.",
  classificationSystems: [
    {
      name: "Type or phenotype",
      examples: "HFrEF, HFpEF, or HFimpEF",
      questionAnswered: "How is the heart filling or pumping, and how has ejection fraction changed over time?",
    },
    {
      name: "Stage",
      examples: "A, B, C, or D",
      questionAnswered: "Where is the person in the heart-failure continuum, from risk through advanced disease?",
    },
    {
      name: "Functional class",
      examples: "NYHA class I, II, III, or IV",
      questionAnswered: "How much do current symptoms limit ordinary physical activity?",
    },
  ],
  classificationNote:
    "These systems are related but not interchangeable. A person can have one ejection-fraction phenotype, an A-to-D stage, and an NYHA functional class at the same time. Ask the care team which labels apply and what each one changes about the plan.",
  causes: [
    {
      title: "Reduced blood flow or heart-muscle injury",
      examples: "Coronary artery disease, a previous heart attack, or another injury that damages heart muscle.",
    },
    {
      title: "Long-term pressure or workload",
      examples: "High blood pressure or conditions that make the heart pump against greater resistance.",
    },
    {
      title: "Valve or structural problems",
      examples: "A narrowed or leaking valve, congenital heart disease, or another structural abnormality.",
    },
    {
      title: "Heart-muscle disease",
      examples: "Inherited cardiomyopathy, inflammation or infection, pregnancy-related disease, infiltrative disease, alcohol, recreational drugs, or some cancer treatments.",
    },
    {
      title: "Rhythm and electrical problems",
      examples: "A persistently fast, slow, or irregular rhythm can cause or worsen heart failure in some people.",
    },
    {
      title: "Metabolic and whole-body contributors",
      examples: "Diabetes, obesity, kidney disease, sleep apnea, thyroid disease, anemia, and other conditions may contribute to risk, symptoms, or treatment complexity.",
    },
  ],
  causeBoundary:
    "A list of possible causes cannot identify what caused one person's heart failure. Several factors may be present at the same time, and additional testing may be needed.",
  tests: [
    {
      name: "History and physical examination",
      questionAnswered: "What symptoms, risk factors, congestion signs, rhythm findings, or valve clues are present?",
      whatToKnow: "The clinician may listen to the heart and lungs and check neck veins, legs, abdomen, blood pressure, heart rate, and oxygen level.",
    },
    {
      name: "Blood tests",
      plainName: "Kidney, electrolyte, blood-count, thyroid, liver, and heart-stress tests",
      questionAnswered: "Is there evidence of heart strain, another cause, or a problem that changes medication safety?",
      whatToKnow: "BNP or NT-proBNP can support the evaluation, while kidney function and potassium often influence medication decisions.",
    },
    {
      name: "Electrocardiogram",
      plainName: "ECG or EKG",
      questionAnswered: "What is the heart's rhythm and electrical pattern?",
      whatToKnow: "It can show a rhythm problem, prior injury pattern, conduction delay, or another clue, but it does not describe pumping strength by itself.",
    },
    {
      name: "Chest X-ray",
      questionAnswered: "Is the heart enlarged or is fluid visible in the lungs?",
      whatToKnow: "A normal X-ray does not answer every heart-failure question, and other lung conditions can also cause abnormal findings.",
    },
    {
      name: "Echocardiogram",
      plainName: "Heart ultrasound",
      questionAnswered: "How well do the chambers squeeze and relax, how do the valves work, and what is the ejection fraction?",
      whatToKnow: "This is one of the central tests for classifying heart failure, but the full report matters more than one EF number.",
    },
    {
      name: "Additional testing when needed",
      plainName: "Stress testing, CT, MRI, angiography, hemodynamic testing, or biopsy",
      questionAnswered: "Is there blocked blood flow, a specific heart-muscle disease, an abnormal pressure pattern, or another treatable cause?",
      whatToKnow: "Not every person needs every test. The suspected cause and the information still missing determine what comes next.",
    },
  ] satisfies HeartFailureTest[],
  treatmentGoals: [
    { title: "Relieve congestion", explanation: "Reduce extra fluid so breathing, swelling, sleep, and activity may improve." },
    { title: "Reduce the heart's workload", explanation: "Lower harmful pressure or hormone signals and make it easier for the heart to move blood." },
    { title: "Protect the heart over time", explanation: "Use evidence-based treatment to slow progression and reduce the chance of hospitalization or other complications when appropriate." },
    { title: "Treat the cause and related conditions", explanation: "Address blocked arteries, valve disease, blood pressure, rhythm problems, diabetes, kidney disease, sleep apnea, or another contributor." },
    { title: "Preserve function and quality of life", explanation: "Support safe activity, rehabilitation, sleep, nutrition, emotional health, and the person's goals of care." },
  ],
  reducedEfFoundation:
    "For many eligible people with reduced ejection fraction, guideline-directed therapy includes four heart-protective medication groups: an ARNI, ACE inhibitor, or ARB; an evidence-based beta blocker; a mineralocorticoid receptor antagonist; and an SGLT2 inhibitor. A diuretic may be added when fluid retention is present. This is a framework, not a medication recommendation for an individual reader.",
  medications: [
    {
      id: "diuretics",
      name: "Diuretics",
      commonName: "Water pills",
      examples: ["Furosemide (Lasix)", "Torsemide (Demadex)", "Bumetanide (Bumex)"],
      job: "Help the kidneys remove extra sodium and water through urination.",
      whyItMayBeUsed: "Reducing congestion can ease swelling and make breathing more comfortable when fluid is building up.",
      whatTheTeamMayMonitor: ["Daily weight and swelling", "Blood pressure", "Kidney function", "Sodium, potassium, and magnesium"],
      questionsToAsk: [
        "When should I take this exact medicine?",
        "What weight or symptom change should I report?",
        "When are my next kidney and electrolyte tests?",
        "What should I do if I cannot take it as prescribed?",
      ],
      importantBoundary: "Do not take an extra dose, skip a dose, or change the schedule based only on a general weight change unless your own written action plan says to do so.",
    },
    {
      id: "arni-ace-arb",
      name: "ARNI, ACE inhibitor, or ARB",
      commonName: "Blood-vessel and heart-protection medicines",
      examples: ["Sacubitril/valsartan (Entresto)", "Lisinopril", "Valsartan or losartan"],
      job: "Relax blood vessels and change hormone signals that can increase pressure, fluid retention, and strain on the heart.",
      whyItMayBeUsed: "In selected heart-failure types, these medicines can protect the heart and reduce worsening over time.",
      whatTheTeamMayMonitor: ["Blood pressure", "Kidney function", "Potassium", "Cough, swelling, dizziness, or other side effects"],
      questionsToAsk: [
        "Which medication group am I taking and why?",
        "Is this replacing another ACE inhibitor, ARB, or ARNI?",
        "When should kidney function and potassium be checked?",
        "Which side effects need a prompt call?",
      ],
      importantBoundary: "These groups are not automatically taken together. Transitions and combinations must be managed by the prescriber.",
    },
    {
      id: "beta-blockers",
      name: "Evidence-based beta blockers",
      commonName: "Heart-rate and heart-protection medicines",
      examples: ["Carvedilol", "Metoprolol succinate", "Bisoprolol"],
      job: "Slow the heart and reduce the effect of stress hormones so it can work more efficiently over time.",
      whyItMayBeUsed: "Certain beta blockers help eligible people with reduced ejection fraction live longer and stay out of the hospital.",
      whatTheTeamMayMonitor: ["Heart rate", "Blood pressure", "Fatigue or dizziness", "Breathing symptoms and fluid status"],
      questionsToAsk: [
        "Which exact beta blocker and formulation was prescribed?",
        "What heart rate or blood pressure should prompt a call?",
        "What should I expect while the dose is adjusted?",
        "Who should I contact if fatigue or dizziness interferes with daily life?",
      ],
      importantBoundary: "Not every beta blocker has the same heart-failure evidence, and the dose is usually adjusted gradually by the care team.",
    },
    {
      id: "mra",
      name: "Mineralocorticoid receptor antagonists",
      commonName: "Aldosterone blockers",
      examples: ["Spironolactone (Aldactone)", "Eplerenone (Inspra)"],
      job: "Block a hormone that promotes sodium retention and harmful changes in the heart.",
      whyItMayBeUsed: "For eligible patients, these medicines can protect the heart and reduce hospitalization risk.",
      whatTheTeamMayMonitor: ["Potassium", "Kidney function", "Blood pressure", "Medication-specific side effects"],
      questionsToAsk: [
        "How soon do I need potassium and kidney testing?",
        "Should I avoid potassium supplements or salt substitutes?",
        "Which symptoms should I report?",
        "Does kidney disease change whether this medicine is appropriate?",
      ],
      importantBoundary: "These medicines can raise potassium. Do not add potassium supplements or change dietary restrictions without individualized guidance.",
    },
    {
      id: "sglt2",
      name: "SGLT2 inhibitors",
      commonName: "Heart-and-kidney protection medicines first developed for diabetes",
      examples: ["Empagliflozin (Jardiance)", "Dapagliflozin (Farxiga)", "Sotagliflozin (Inpefa)"],
      job: "Change how the kidneys handle glucose and sodium and produce beneficial heart and kidney effects that go beyond blood-sugar control.",
      whyItMayBeUsed: "Eligible people with heart failure may benefit even if they do not have diabetes, including a lower risk of heart-failure hospitalization.",
      whatTheTeamMayMonitor: ["Kidney function", "Blood pressure and volume status", "Genital or urinary infection symptoms", "Illness, fasting, or procedure-related instructions"],
      questionsToAsk: [
        "Why is this being prescribed if I do not have diabetes?",
        "What side effects should I report?",
        "What instructions apply before surgery, fasting, or a serious illness?",
        "How does this fit with my diuretic and kidney function?",
      ],
      importantBoundary: "The prescriber must provide medicine-specific sick-day and procedure instructions. Do not create those instructions from a general guide.",
    },
    {
      id: "selected-additional",
      name: "Selected additional medicines",
      examples: ["Hydralazine with isosorbide dinitrate", "Digoxin", "Ivabradine", "Vericiguat", "Anticoagulants for another indication"],
      job: "Address a particular blood-pressure, rhythm, symptom, clotting, or high-risk heart-failure problem.",
      whyItMayBeUsed: "These medicines are generally used for selected situations rather than as the same default plan for everyone.",
      whatTheTeamMayMonitor: ["The reason the medicine was selected", "Drug-specific laboratory tests", "Heart rate or blood pressure", "Interactions and side effects"],
      questionsToAsk: [
        "What exact problem is this medicine treating?",
        "Is it treating heart failure itself or another condition such as atrial fibrillation or coronary disease?",
        "What monitoring does this medicine require?",
        "What happens if cost or access prevents me from filling it?",
      ],
      importantBoundary: "Blood thinners and cholesterol medicines are not automatically heart-failure treatments; they are used when another diagnosis or risk makes them appropriate.",
    },
  ] satisfies HeartFailureMedicationGroup[],
  procedures: [
    { name: "Treat blocked arteries or valve disease", explanation: "Angioplasty, bypass surgery, or valve repair or replacement may treat a cause or major contributor when testing supports it." },
    { name: "Implantable cardioverter-defibrillator (ICD)", explanation: "Monitors for dangerous rhythms and can deliver therapy or a shock. It prevents certain rhythm-related deaths but does not directly remove fluid or make every person feel better." },
    { name: "Cardiac resynchronization therapy (CRT)", explanation: "Coordinates the lower chambers when electrical delay causes them to squeeze out of sync. Only selected people meet the criteria." },
    { name: "Ventricular assist device or heart transplant", explanation: "Advanced options for selected people with severe heart failure after specialized evaluation." },
    { name: "Palliative care", explanation: "Can be added at any serious stage to improve symptoms, decision support, and quality of life; it is not limited to the final days of life." },
  ],
  dailyPlan: [
    { title: "Take the written medication plan literally", details: "Use the current medication list and pharmacy labels. Ask why every medicine was started, stopped, held, or changed." },
    { title: "Track weight consistently", details: "Use the same scale and a consistent time and clothing routine. Follow the weight threshold provided by the care team rather than inventing a dose change." },
    { title: "Watch breathing, swelling, sleep, activity, appetite, and thinking", details: "Small changes can be easier to recognize when they are written down. A caregiver may notice confusion or functional decline first." },
    { title: "Know the individualized sodium and fluid plan", details: "Too much sodium can worsen fluid retention, but the correct sodium and fluid limits differ. Ask for actual daily targets instead of assuming everyone needs the same restriction." },
    { title: "Build safe activity back into life", details: "Ask what activity is safe now and whether cardiac rehabilitation or a structured walking plan is appropriate." },
    { title: "Check nonprescription medicines and supplements", details: "Some pain medicines, supplements, and salt substitutes can worsen heart failure or interact with treatment. Review them with a clinician or pharmacist." },
    { title: "Raise practical barriers early", details: "Tell the team about cost, transportation, pharmacy access, mobility, food, scale access, caregiver capacity, depression, or difficulty following the plan." },
  ],
  actionPlan: [
    {
      id: "emergency",
      label: "Call 911 or emergency services now",
      instruction: "Do not use the website to decide whether these are safe to watch at home.",
      signs: [
        "Chest pain or pressure",
        "Fainting or severe weakness",
        "A rapid or irregular heartbeat together with shortness of breath, chest pain, or fainting",
        "Sudden, severe shortness of breath with white or pink foamy mucus",
      ],
      verification: "Emergency guidance is anchored to American Heart Association warning-sign education. Local emergency services and the treating team control the response.",
    },
    {
      id: "same-day",
      label: "Contact the heart-failure or medical team promptly",
      instruction: "Use the number and thresholds in the person's written action plan. If the team cannot be reached and the person is rapidly worsening, seek urgent evaluation.",
      signs: [
        "Any new symptom or a sudden worsening of usual symptoms",
        "New or worsening shortness of breath with activity or inability to lie flat",
        "Increasing swelling in the legs, feet, abdomen, or other tissues",
        "A rapid weight increase; many action plans use more than 2 to 3 pounds in 24 hours or 5 pounds in a week, but the personal threshold may differ",
        "New confusion, marked dizziness, worsening appetite, or a major drop in usual activity",
        "A medication, refill, cost, or side-effect problem that prevents the written plan from being followed",
      ],
      verification: "American Heart Association patient guidance supports tracking symptom and weight changes, but the care team must provide the exact thresholds and after-hours instructions for the individual patient.",
    },
    {
      id: "steady",
      label: "Continue the plan and keep tracking",
      instruction: "Stable does not mean finished. Continue treatment, monitoring, and scheduled follow-up.",
      signs: [
        "Breathing, swelling, sleep, appetite, activity, and weight remain near the person's usual baseline",
        "Medicines are available and being taken as written",
        "The patient knows the next appointment and laboratory dates",
        "The patient and caregiver know whom to call if the pattern changes",
      ],
      verification: "A written heart-failure action plan from the treating team should replace generic thresholds whenever available.",
    },
  ] satisfies HeartFailureActionLevel[],
  questions: [
    "What type of heart failure do I have, and what does my ejection fraction mean in context?",
    "What stage and NYHA functional class apply to me, and what does each label change about the plan?",
    "What do you think caused or contributed to my heart failure?",
    "Which medicines are mainly removing fluid, and which are protecting my heart over time?",
    "What exact weight, breathing, swelling, blood-pressure, or heart-rate change should make me call?",
    "What sodium and fluid targets apply to me?",
    "When are my next kidney, potassium, magnesium, or other laboratory tests?",
    "What activity is safe, and should I attend cardiac rehabilitation?",
    "Do any over-the-counter pain medicines, supplements, or salt substitutes conflict with my plan?",
    "What should I do if cost, transportation, pharmacy access, or caregiving makes the plan unrealistic?",
    "What is the after-hours plan, and which symptoms mean call 911?",
  ],
  teachBack: [
    "I can explain heart failure without saying the heart has stopped.",
    "I know my heart-failure type, stage, and functional class—or I know which of those questions remain unanswered.",
    "I can explain what my ejection fraction does and does not tell me.",
    "I can explain the job of each medication in my own words.",
    "I know what I am supposed to track at home.",
    "I know which changes require a prompt call and which require 911.",
    "I know the next laboratory test, appointment, and unresolved barrier.",
  ],
  sources: [
    {
      name: "American Heart Association, American College of Cardiology, European Society of Cardiology, and World Heart Federation",
      pageTitle: "Second Universal Definition of Heart Failure (2026)",
      url: "https://professional.heart.org/en/science-news/expert-consensus-document-second-universal-definition-of-heart-failure-2026",
      note: "Primary professional framework for heart-failure definition, the A-to-D continuum, and reduced, preserved, and improved ejection-fraction categories.",
    },
    {
      name: "American Heart Association / American College of Cardiology / Heart Failure Society of America",
      pageTitle: "2022 Guideline for the Management of Heart Failure",
      url: "https://professional.heart.org/en/science-news/2022-guideline-for-the-management-of-heart-failure",
      note: "Primary professional guideline supporting staging, treatment goals, medication classes, devices, and disease-management principles.",
    },
    {
      name: "American College of Cardiology",
      pageTitle: "2024 Expert Consensus Decision Pathway for Treatment of HFrEF",
      url: "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2024/03/06/19/22/2024-acc-expert-consensus-hfref",
      note: "Current practical pathway supporting the four foundational medication groups and sequencing for eligible people with reduced ejection fraction.",
    },
    {
      name: "American College of Cardiology",
      pageTitle: "2023 Expert Consensus Decision Pathway on Management of HFpEF",
      url: "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2023/04/17/16/40/2023-acc-expert-consensus-on-hfpef",
      note: "Primary practical pathway for preserved-ejection-fraction diagnosis, comorbidity management, and current treatment framing.",
    },
    {
      name: "American Heart Association",
      pageTitle: "Classes and Stages of Heart Failure",
      url: "https://www.heart.org/en/health-topics/heart-failure/what-is-heart-failure/classes-of-heart-failure",
      note: "Patient-facing distinction between A-to-D stage and NYHA functional class; last reviewed May 21, 2025.",
    },
    {
      name: "American Heart Association",
      pageTitle: "Medications Used to Treat Heart Failure",
      url: "https://www.heart.org/en/health-topics/heart-failure/treatment-options-for-heart-failure/medications-used-to-treat-heart-failure",
      note: "Patient-facing descriptions and examples of major heart-failure medication groups.",
    },
    {
      name: "American Heart Association",
      pageTitle: "Heart Failure Signs and Symptoms",
      url: "https://www.heart.org/en/health-topics/heart-failure/warning-signs-of-heart-failure",
      note: "Primary patient-facing support for warning signs, symptom tracking, and common weight-change thresholds.",
    },
    {
      name: "National Heart, Lung, and Blood Institute",
      pageTitle: "Heart Failure: Treatment and Living With Heart Failure",
      url: "https://www.nhlbi.nih.gov/health/heart-failure/treatment",
      note: "Supplemental federal lifestyle and living-with information. Because the page was last updated in 2022, it is not used as the authority for current medication or HFpEF treatment claims.",
    },
    {
      name: "Mayo Clinic",
      pageTitle: "Heart failure: Diagnosis and treatment",
      url: "https://www.mayoclinic.org/diseases-conditions/heart-failure/diagnosis-treatment/drc-20373148",
      note: "Secondary patient reference used as an external coverage benchmark for tests, medications, devices, home care, and appointment preparation.",
    },
  ] satisfies Source[],
};
