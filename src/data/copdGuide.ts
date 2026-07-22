import type { Source } from "./sources";

export const COPD_GUIDE_ROUTE = "/patients-families/diagnosis-explained/copd";

export type CopdTest = {
  name: string;
  plainName?: string;
  questionAnswered: string;
  whatToKnow: string;
};

export type CopdMedicationGroup = {
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

export type CopdActionLevel = {
  id: "emergency" | "same-day" | "steady";
  label: string;
  instruction: string;
  signs: string[];
  verification: string;
};

export const COPD_GUIDE = {
  status: "clinical-review" as const,
  title: "COPD, Explained",
  subtitle:
    "A calm, plain-English guide for adults who have already received a COPD diagnosis and the people helping them.",
  shortTitle: "COPD, Explained",
  updatedAt: "2026-07-22",
  nextReviewAt: "2026-08-22",
  reviewScope:
    "Adult COPD meaning, common disease patterns, risk factors, spirometry and other evaluation, treatment goals, inhaler purpose, inhaler technique, pulmonary rehabilitation, oxygen therapy, flare-up planning, warning signs, and care-team questions. Independent clinical review is still pending.",
  audience:
    "Adults who have been told they have chronic obstructive pulmonary disease, emphysema, chronic bronchitis, or COPD, plus family members and caregivers.",
  boundary:
    "This guide explains a diagnosis already made by a clinician. It does not determine whether someone has COPD, interpret an individual spirometry result, select an inhaler, prescribe oxygen, set oxygen flow, or provide medication doses or flare-up treatment instructions.",
  quickExplanation: {
    title: "The 30-second explanation",
    body:
      "COPD is a long-term lung condition in which damaged or narrowed airways make it harder to move air out of the lungs. Air can become trapped, breathing takes more work, and coughing, mucus, wheezing, or shortness of breath may limit activity. Emphysema and chronic bronchitis are common patterns within COPD.",
    repeatBack:
      "A simple way to say it: My lungs have lasting airflow blockage, so getting air out takes more work and I may have coughing, mucus, wheezing, or shortness of breath.",
  },
  doesNotMean: [
    "It does not mean only people who currently smoke can have COPD. Former smoking, secondhand smoke, workplace exposures, air pollution, asthma history, genetics, and other factors can contribute.",
    "It does not automatically mean a person needs home oxygen. Oxygen is prescribed when measured oxygen levels and the clinical situation show that it is needed.",
    "It does not mean every inhaler works the same way. Rescue and maintenance medicines have different jobs, and inhaler devices require different techniques.",
    "COPD is chronic, but symptoms, activity tolerance, flare-up risk, and quality of life can often improve with treatment, rehabilitation, exposure reduction, and a workable action plan.",
  ],
  terms: [
    {
      term: "COPD",
      meaning:
        "Chronic obstructive pulmonary disease: a long-term condition with persistent airflow blockage that makes breathing harder.",
    },
    {
      term: "Emphysema",
      meaning:
        "Damage to the walls of the tiny air sacs can reduce elastic recoil and trap air in the lungs.",
    },
    {
      term: "Chronic bronchitis",
      meaning:
        "A clinical pattern involving long-term cough and mucus production. It can occur within COPD, but the exact diagnosis belongs to the treating clinician.",
    },
    {
      term: "Exacerbation or flare-up",
      meaning:
        "A period when breathing symptoms become worse than the person's usual baseline and may require a change in the clinician-directed treatment plan.",
    },
  ],
  patterns: [
    {
      name: "Airway-predominant or chronic-bronchitis pattern",
      shortLabel: "More airway inflammation and mucus",
      plainEnglish:
        "The breathing tubes may be inflamed, narrowed, and producing more mucus, leading to cough, phlegm, wheezing, and airflow blockage.",
      whyItMatters:
        "Mucus burden, flare-up history, inhaler response, infections, and other findings may influence the care plan.",
    },
    {
      name: "Emphysema-predominant pattern",
      shortLabel: "More air-sac damage and air trapping",
      plainEnglish:
        "Damage to the tiny air sacs and loss of elastic recoil can make it difficult to empty the lungs fully.",
      whyItMatters:
        "Imaging, oxygen levels, exercise limitation, and selected advanced treatments may become especially relevant.",
    },
    {
      name: "Mixed or overlapping features",
      shortLabel: "Several patterns at once",
      plainEnglish:
        "Many people have both airway disease and emphysema, and some also have asthma-like or other overlapping features.",
      whyItMatters:
        "The label alone does not select treatment. Symptoms, spirometry, flare-up history, blood tests, other conditions, and response to therapy all matter.",
    },
  ],
  patternNote:
    "COPD is not divided into one simple set of types that predicts every treatment decision. Clinicians combine symptoms, spirometry, prior flare-ups, oxygen status, imaging, blood eosinophils when relevant, other diseases, and the person's goals.",
  causes: [
    {
      title: "Tobacco smoke",
      examples:
        "Current or previous cigarette smoking is a major cause. Cigars, pipes, and repeated secondhand-smoke exposure can also contribute.",
    },
    {
      title: "Workplace dusts, fumes, and chemicals",
      examples:
        "Long-term exposure in mining, construction, manufacturing, agriculture, transportation, healthcare, and other settings may contribute.",
    },
    {
      title: "Indoor and outdoor air pollution",
      examples:
        "Repeated exposure to polluted air, smoke from fires, or smoke from cooking and heating fuels can damage the lungs over time.",
    },
    {
      title: "Asthma and airway history",
      examples:
        "Long-standing asthma or abnormal lung development may increase later COPD risk in some people.",
    },
    {
      title: "Alpha-1 antitrypsin deficiency",
      examples:
        "An inherited condition can cause COPD at a younger age or with less smoking exposure and may also affect the liver.",
    },
    {
      title: "More than one contributor",
      examples:
        "Smoking, occupational exposure, asthma, infections, genetics, aging, and social or environmental conditions may interact.",
    },
  ],
  causeBoundary:
    "A list of common contributors cannot identify what caused one person's COPD. The care team uses exposure history, age, family history, spirometry, imaging, and selected testing to assess likely contributors.",
  tests: [
    {
      name: "Spirometry",
      plainName: "The main breathing test used to confirm persistent airflow obstruction",
      questionAnswered:
        "How much air can the person force out, how quickly can they blow it out, and does persistent airflow obstruction remain after an airway-opening medicine?",
      whatToKnow:
        "The test requires a strong, complete effort and may be repeated before and after a bronchodilator. The report must be interpreted with symptoms, exposure history, age, test quality, and the full clinical picture.",
    },
    {
      name: "Pulse oximetry",
      plainName: "A fingertip oxygen reading",
      questionAnswered:
        "Is the blood oxygen level low at rest or during a particular activity?",
      whatToKnow:
        "A single home or clinic reading can be affected by device accuracy, circulation, movement, nail products, and other factors. Oxygen treatment decisions require clinician assessment and sometimes confirmatory testing.",
    },
    {
      name: "Chest X-ray or CT scan",
      questionAnswered:
        "Is there emphysema, another lung problem, a complication, or a different explanation for the symptoms?",
      whatToKnow:
        "Imaging can support evaluation and identify other conditions, but a scan by itself does not replace spirometry for confirming COPD.",
    },
    {
      name: "Blood tests or arterial blood gas",
      questionAnswered:
        "Are oxygen, carbon dioxide, red-blood-cell, infection, or other findings affecting the plan?",
      whatToKnow:
        "An arterial blood gas is usually reserved for selected situations. Routine laboratory testing depends on symptoms, severity, medicines, and other health conditions.",
    },
    {
      name: "Alpha-1 antitrypsin testing",
      plainName: "A blood test for an inherited COPD risk",
      questionAnswered:
        "Could alpha-1 antitrypsin deficiency be contributing to lung disease?",
      whatToKnow:
        "Testing is especially important to discuss with the care team when COPD occurs younger than expected, runs in the family, has limited exposure history, or occurs with liver disease.",
    },
    {
      name: "Walking or exercise assessment",
      questionAnswered:
        "How do breathing, oxygen level, heart rate, and functional ability change during activity?",
      whatToKnow:
        "Results may help guide pulmonary rehabilitation, activity planning, oxygen evaluation, and the search for other causes of exercise limitation.",
    },
  ] satisfies CopdTest[],
  treatmentGoals: [
    {
      title: "Open the airways",
      explanation:
        "Bronchodilators relax muscles around the airways so air can move more freely and breathing may feel easier.",
    },
    {
      title: "Reduce flare-ups",
      explanation:
        "Maintenance medicines, vaccines, exposure reduction, rehabilitation, and a written action plan can help reduce risk or severity.",
    },
    {
      title: "Preserve activity and independence",
      explanation:
        "Pulmonary rehabilitation, exercise training, breathing strategies, nutrition, and energy conservation can improve daily function.",
    },
    {
      title: "Slow preventable damage",
      explanation:
        "Stopping smoking and reducing harmful dust, fume, and pollution exposure are central parts of treatment without assigning blame.",
    },
    {
      title: "Treat low oxygen or advanced disease",
      explanation:
        "Oxygen and selected procedures are used only when clinical measurements and eligibility criteria show that they may help.",
    },
  ],
  medications: [
    {
      id: "short-acting-bronchodilators",
      name: "Short-acting bronchodilators",
      commonName: "Rescue or quick-relief inhalers",
      examples: ["Albuterol", "Levalbuterol", "Ipratropium", "Albuterol plus ipratropium"],
      job:
        "Relax airway muscles relatively quickly to help relieve sudden or intermittent breathlessness or wheezing.",
      whyItMayBeUsed:
        "A clinician may prescribe one for symptoms or include it in a written flare-up plan. The exact medicine, device, timing, and maximum use are patient-specific.",
      whatTheTeamMayMonitor: [
        "How often it is needed and whether use is increasing",
        "Whether symptoms improve after correct use",
        "Tremor, fast heartbeat, dry mouth, urinary or eye concerns when relevant",
        "Whether inhaler or nebulizer technique is delivering the medicine correctly",
      ],
      questionsToAsk: [
        "Is this my rescue medicine?",
        "Show me exactly how and when to use this device.",
        "What does my written plan say if it is not helping?",
        "When does frequent use mean I should call the care team?",
      ],
      importantBoundary:
        "Do not use a general website to set the dose, frequency, maximum daily use, nebulizer schedule, or emergency plan. Follow the exact prescription and written COPD action plan.",
    },
    {
      id: "long-acting-bronchodilators",
      name: "Long-acting bronchodilators",
      commonName: "Maintenance or controller inhalers",
      examples: ["LAMA medicines", "LABA medicines", "LAMA/LABA combinations"],
      job:
        "Keep the airways more open over many hours to reduce everyday symptoms and improve breathing function.",
      whyItMayBeUsed:
        "They are commonly used as regular maintenance treatment when symptoms are persistent or flare-up risk is important.",
      whatTheTeamMayMonitor: [
        "Daily symptoms, activity tolerance, and rescue-inhaler use",
        "Flare-ups, urgent visits, and hospitalizations",
        "Dry mouth, urinary difficulty, tremor, palpitations, or other adverse effects",
        "Device technique, adherence, affordability, and refill access",
      ],
      questionsToAsk: [
        "Is this a maintenance medicine I take even when I feel well?",
        "Which device steps are essential for this exact inhaler?",
        "How will we know whether it is helping?",
        "What should I do if cost or device difficulty makes it hard to use consistently?",
      ],
      importantBoundary:
        "Maintenance inhalers are not interchangeable with rescue inhalers. Do not substitute devices or change the schedule without the prescriber or pharmacist.",
    },
    {
      id: "inhaled-steroid-combinations",
      name: "Inhaled corticosteroid-containing treatment",
      commonName: "An inhaled steroid, usually combined with long-acting bronchodilators",
      examples: ["LABA/ICS combinations", "LAMA/LABA/ICS triple therapy"],
      job:
        "Reduce airway inflammation for selected patients, usually as part of combination maintenance therapy.",
      whyItMayBeUsed:
        "A clinician may consider it when flare-up history, blood eosinophils, asthma features, current treatment, and other risks suggest potential benefit. It is not automatically appropriate for every person with COPD.",
      whatTheTeamMayMonitor: [
        "Flare-up frequency and breathing symptoms",
        "Pneumonia risk and respiratory infections",
        "Thrush, mouth irritation, bruising, or voice changes",
        "Whether mouth rinsing and device technique are correct",
      ],
      questionsToAsk: [
        "Why is an inhaled steroid included in my plan?",
        "What benefit are we expecting and what risks apply to me?",
        "Should I rinse my mouth after this inhaler?",
        "How will we reassess whether I still need this combination?",
      ],
      importantBoundary:
        "Do not start, stop, or remove the steroid component based on a general guide. The balance of benefit and pneumonia or other risks is individualized.",
    },
    {
      id: "flare-up-medicines",
      name: "Short courses used during some flare-ups",
      commonName: "Steroid tablets and, in selected cases, antibiotics",
      examples: ["Systemic corticosteroids", "Antibiotics when bacterial infection is suspected"],
      job:
        "Treat increased airway inflammation or a suspected bacterial trigger during a clinician-recognized exacerbation.",
      whyItMayBeUsed:
        "Some written action plans instruct patients to contact the care team or begin a specifically prescribed course when defined changes occur.",
      whatTheTeamMayMonitor: [
        "Whether symptoms are improving or urgent evaluation is needed",
        "Blood glucose, mood, sleep, swelling, stomach, or infection concerns with steroids",
        "Allergies, interactions, side effects, and whether antibiotics are actually indicated",
        "Frequency of repeated courses, which may signal uncontrolled disease or another problem",
      ],
      questionsToAsk: [
        "What exact changes activate my written flare-up plan?",
        "Do I call before starting the medicine?",
        "How long should the prescribed course last?",
        "Which symptoms mean the plan is failing and I need urgent care?",
      ],
      importantBoundary:
        "Never self-start leftover steroids or antibiotics unless the treating clinician has provided a current, explicit written plan for that exact medicine and situation.",
    },
    {
      id: "selected-add-on-therapies",
      name: "Selected add-on medicines",
      commonName: "Specialist or phenotype-directed options",
      examples: ["Ensifentrine", "Roflumilast", "Selected long-term antibiotic strategies", "Selected biologic therapy"],
      job:
        "Target persistent symptoms, inflammation, mucus, or repeated flare-ups when standard inhaled treatment is not enough for a carefully selected patient.",
      whyItMayBeUsed:
        "These options apply to narrower clinical situations and require review of prior flare-ups, chronic bronchitis, eosinophils, infections, weight, mood, interactions, cost, and other factors.",
      whatTheTeamMayMonitor: [
        "Whether symptoms or flare-ups meaningfully improve",
        "Medicine-specific gastrointestinal, weight, mood, infection, heart-rhythm, or injection-related concerns",
        "Interactions, affordability, access, and treatment burden",
        "Whether the person's COPD pattern still matches the reason for treatment",
      ],
      questionsToAsk: [
        "What feature of my COPD makes this option relevant?",
        "What outcome are we trying to improve?",
        "What side effects and follow-up are specific to this medicine?",
        "What would make us stop or change the plan?",
      ],
      importantBoundary:
        "These are selected therapies, not a checklist of medicines every person with COPD should receive. A qualified prescriber must determine eligibility and monitoring.",
    },
  ] satisfies CopdMedicationGroup[],
  supportiveTreatments: [
    {
      name: "Pulmonary rehabilitation",
      explanation:
        "A supervised program combining exercise training, breathing strategies, education, and support. It can improve daily function, confidence, and quality of life even when spirometry does not return to normal.",
    },
    {
      name: "Smoking-cessation support",
      explanation:
        "Counseling, medications, and practical support can reduce ongoing lung damage. Education should help without blame or shame.",
    },
    {
      name: "Vaccination and infection prevention",
      explanation:
        "Recommended respiratory vaccines and early communication about infections can reduce preventable complications. The exact vaccine schedule depends on age, health history, and current guidance.",
    },
    {
      name: "Oxygen therapy",
      explanation:
        "Oxygen treats measured low blood oxygen, not breathlessness by itself. The prescription includes when to use it and the flow setting. Oxygen creates a serious fire risk around smoking, flames, sparks, and flammable products.",
    },
    {
      name: "Selected procedures or surgery",
      explanation:
        "Bronchoscopic valves, lung-volume-reduction procedures, bullectomy, or transplant may be considered for a small group after specialized testing and optimized medical care.",
    },
  ],
  inhalerPrinciples: [
    "Bring every inhaler, spacer, and nebulizer setup to visits so the team can identify duplicates and watch the technique.",
    "Ask the clinician, respiratory therapist, nurse, or pharmacist to demonstrate the exact device and then watch you teach it back.",
    "Dry-powder, metered-dose, soft-mist, and nebulized devices are not used the same way.",
    "A medicine cannot work reliably if the device is empty, expired, blocked, unaffordable, or used with the wrong breathing pattern.",
    "Ask for an alternative device when hand strength, coordination, cognition, vision, breath strength, or cost makes the current device unrealistic.",
  ],
  oxygenPrinciples: [
    "Use oxygen only at the flow and times written on the prescription unless the treating team changes it.",
    "Do not smoke or allow smoking, flames, sparks, or flammable materials near oxygen equipment.",
    "Know the supplier's number, backup power or cylinder plan, travel plan, and what to do if equipment fails.",
    "A pulse-oximeter number should be interpreted using the person's written plan and clinician instructions, not a generic internet threshold alone.",
  ],
  dailyPlan: [
    {
      title: "Know rescue versus maintenance",
      details:
        "Keep one current written medication list. Label which medicine is for quick relief, which is taken regularly, and which steps belong only to the written flare-up plan.",
    },
    {
      title: "Use the device correctly",
      details:
        "Review technique regularly. Check dose counters, cleaning, priming, spacer use, replacement dates, and whether the device still fits the person's abilities.",
    },
    {
      title: "Track the usual baseline",
      details:
        "Notice the person's usual breathing, cough, mucus, activity, sleep, and rescue-medicine use so a meaningful change is easier to recognize.",
    },
    {
      title: "Build activity safely",
      details:
        "Use the clinician's activity plan and pulmonary rehabilitation when available. Pacing, rest breaks, breathing techniques, and strength training may improve function.",
    },
    {
      title: "Reduce avoidable exposure",
      details:
        "Address smoking, secondhand smoke, workplace hazards, indoor fumes, wildfire smoke, and poor air quality using realistic protection and cessation resources.",
    },
    {
      title: "Keep the flare-up plan available",
      details:
        "The plan should identify baseline care, prompt-contact changes, emergency signs, exact prescribed medicines, after-hours contacts, and when to seek urgent evaluation.",
    },
    {
      title: "Surface practical barriers early",
      details:
        "Tell the care team about inhaler cost, pharmacy access, oxygen electricity needs, transportation, housing, food, anxiety, depression, mobility, cognition, or caregiver limits.",
    },
  ],
  actionPlan: [
    {
      id: "emergency",
      label: "Call 911 or seek emergency help now",
      instruction:
        "Severe breathing difficulty or other emergency signs should not be managed only with a website or routine message. Follow the emergency instructions in the written COPD plan.",
      signs: [
        "Severe shortness of breath at rest, inability to catch the breath, or difficulty speaking because of breathlessness",
        "Blue or gray lips, fingertips, or nails",
        "New confusion, unusual sleepiness, fainting, or difficulty staying alert",
        "Severe chest pain, coughing up blood, or a very fast heartbeat with severe breathing symptoms",
        "The prescribed rescue plan is not helping and breathing continues to worsen",
      ],
      verification:
        "Emergency services and the treating team determine the cause and treatment. Do not drive yourself when severe breathing difficulty, confusion, fainting, or other emergency signs are present.",
    },
    {
      id: "same-day",
      label: "Follow the written plan and contact the care team promptly",
      instruction:
        "A noticeable change from the usual COPD baseline may represent a flare-up or another illness. Use the patient-specific action plan and contact instructions.",
      signs: [
        "More shortness of breath, wheezing, cough, or chest tightness than usual",
        "More mucus, thicker mucus, or a change in mucus color",
        "Needing the prescribed rescue medicine more often than the person's usual pattern",
        "Fever, chills, new fatigue, reduced activity, poor sleep, or difficulty eating and drinking",
        "New oxygen concerns, equipment failure, or readings outside the range addressed in the written plan",
      ],
      verification:
        "The clinician decides whether symptoms represent a COPD exacerbation, pneumonia, heart problem, blood clot, medication effect, or another cause and whether testing or treatment should change.",
    },
    {
      id: "steady",
      label: "Continue the stable-day plan",
      instruction:
        "When breathing, cough, mucus, activity, and rescue-medicine use remain near the person's usual baseline, continue the written maintenance plan and scheduled follow-up.",
      signs: [
        "Maintenance medicines are available and used with the correct device technique",
        "Breathing and activity are near the person's usual baseline",
        "The rescue medicine is used within the expected pattern in the written plan",
        "Oxygen, when prescribed, is used at the prescribed setting with fire-safety precautions",
        "Pulmonary rehabilitation, activity, vaccines, exposure reduction, and follow-up are addressed",
      ],
      verification:
        "The treating team defines the person's baseline, follow-up schedule, oxygen target, and written green-zone plan.",
    },
  ] satisfies CopdActionLevel[],
  questions: [
    "Was my COPD diagnosis confirmed with good-quality spirometry, and what do the results mean in plain English?",
    "What pattern of COPD do you think I have, and what other conditions may be affecting my breathing?",
    "Which inhaler is my rescue medicine, which is maintenance, and what is the job of each one?",
    "Can you watch me use every inhaler and nebulizer and correct my technique?",
    "Would a spacer, different inhaler device, or nebulized option be easier or more reliable for me?",
    "What is my written flare-up plan, including whom to call after hours and when to call 911?",
    "Do I qualify for pulmonary rehabilitation, and how can I access it?",
    "Do I need oxygen? Which measurements support it, and exactly when and at what prescribed flow should I use it?",
    "Should I be tested for alpha-1 antitrypsin deficiency or another contributor?",
    "Which vaccines and exposure-reduction steps apply to me?",
    "What cost, pharmacy, transportation, electricity, housing, mobility, mood, or caregiver barriers should we solve now?",
  ],
  teachBack: [
    "I can explain COPD in my own words without saying that every person has the same lung damage or treatment.",
    "I can identify my rescue medicine, maintenance medicine, and any medicine reserved for my written flare-up plan.",
    "I can demonstrate the correct technique for each inhaler, spacer, or nebulizer I use.",
    "I can describe my usual breathing baseline and the changes that require a prompt call or emergency help.",
    "If I use oxygen, I know the prescribed setting, when to use it, fire-safety rules, supplier contact, and backup plan.",
    "I know which questions remain unanswered and which practical barriers could make the plan fail at home.",
  ],
  sources: [
    {
      name: "Global Initiative for Chronic Obstructive Lung Disease (GOLD)",
      pageTitle: "2026 GOLD Report and Pocket Guide",
      url: "https://goldcopd.org/2026-gold-report-and-pocket-guide/",
      note: "Current evidence-based strategy for COPD diagnosis, assessment, pharmacologic and nonpharmacologic management, exacerbations, and patient education.",
    },
    {
      name: "National Heart, Lung, and Blood Institute",
      pageTitle: "COPD Diagnosis",
      url: "https://www.nhlbi.nih.gov/health/copd/diagnosis",
      note: "Federal patient guidance on spirometry, clinical history, imaging, blood testing, and alpha-1 antitrypsin deficiency.",
    },
    {
      name: "National Heart, Lung, and Blood Institute",
      pageTitle: "COPD Treatment",
      url: "https://www.nhlbi.nih.gov/health/copd/treatment",
      note: "Federal patient guidance on bronchodilators, anti-inflammatory treatment, inhaler technique, pulmonary rehabilitation, oxygen, and selected procedures.",
    },
    {
      name: "National Heart, Lung, and Blood Institute",
      pageTitle: "Pulmonary Rehabilitation",
      url: "https://www.nhlbi.nih.gov/health/pulmonary-rehabilitation",
      note: "Federal overview of supervised exercise, breathing strategies, education, nutrition, and psychological support.",
    },
    {
      name: "Centers for Disease Control and Prevention",
      pageTitle: "About COPD",
      url: "https://www.cdc.gov/copd/about/index.html",
      note: "Federal overview of COPD meaning, common symptoms, causes, prevention, vaccination, rehabilitation, and oxygen treatment.",
    },
    {
      name: "American Lung Association",
      pageTitle: "COPD Action Plan and Management Tools",
      url: "https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd/living-with-copd/copd-management-tools",
      note: "Patient-facing green, yellow, and red action-plan structure and escalation examples; updated January 20, 2026.",
    },
  ] satisfies Source[],
};
