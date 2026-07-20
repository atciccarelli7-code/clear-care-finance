import type { Article } from "./articles";
import type { Source } from "./sources";

const source = (name: string, pageTitle: string, url: string, note: string): Source => ({ name, pageTitle, url, note });

const AHRQ_IDEAL = source(
  "AHRQ",
  "Care Transitions From Hospital to Home: IDEAL Discharge Planning",
  "https://www.ahrq.gov/patient-safety/patients-families/engagingfamilies/strategy4/index.html",
  "Federal patient-safety framework for medication review, warning signs, follow-up, test results, plain language, and patient/family participation in discharge planning.",
);

const AHRQ_TRANSITIONS = source(
  "AHRQ",
  "Transitions of Care",
  "https://www.ahrq.gov/topics/transitions-care.html",
  "Federal collection of tools for safer handoffs from one care setting to another.",
);

const MEDLINE_BLOOD_THINNERS = source(
  "MedlinePlus",
  "Blood Thinners",
  "https://medlineplus.gov/bloodthinners.html",
  "National Library of Medicine overview of anticoagulant and antiplatelet medicines.",
);

const MEDLINE_COPD_DISCHARGE = source(
  "MedlinePlus",
  "Chronic obstructive pulmonary disease — adults — discharge",
  "https://medlineplus.gov/ency/patientinstructions/000009.htm",
  "National Library of Medicine discharge education for adults recovering after a COPD-related hospital stay.",
);

const NHLBI_COPD = source(
  "NHLBI",
  "COPD Treatment",
  "https://www.nhlbi.nih.gov/health/copd/treatment",
  "National Heart, Lung, and Blood Institute overview of COPD medicines, inhalers, rehabilitation, and treatment planning.",
);

const AHA_HEART_FAILURE = source(
  "American Heart Association",
  "Managing Heart Failure Symptoms",
  "https://www.heart.org/en/health-topics/heart-failure/warning-signs-of-heart-failure/managing-heart-failure-symptoms",
  "Current patient guidance on tracking heart-failure symptoms and reporting changes to the treating team.",
);

const AHA_HEART_FAILURE_CHANGES = source(
  "American Heart Association",
  "Physical Changes to Report for Heart Failure",
  "https://www.heart.org/en/health-topics/heart-failure/living-with-heart-failure-and-managing-advanced-hf/physical-changes-to-report-for-heart-failure",
  "Patient guidance on consistent weight tracking and changes that should be discussed with the treating team.",
);

const MEDLINE_OXYGEN_HOME = source(
  "MedlinePlus",
  "Using oxygen at home",
  "https://medlineplus.gov/ency/patientinstructions/000048.htm",
  "National Library of Medicine guidance on oxygen equipment, backup planning, travel, and following the prescribed flow setting.",
);

const MEDLINE_OXYGEN_SAFETY = source(
  "MedlinePlus",
  "Oxygen safety",
  "https://medlineplus.gov/ency/patientinstructions/000049.htm",
  "National Library of Medicine fire-safety guidance for home oxygen.",
);

const MEDLINE_NEBULIZER = source(
  "MedlinePlus",
  "How to use a nebulizer",
  "https://medlineplus.gov/ency/patientinstructions/000006.htm",
  "National Library of Medicine overview of nebulizer setup, use, cleaning, storage, and equipment support.",
);

const commonAuthor = "Andrew Ciccarelli, BSN, RN";
const commonReviewNote = "Consumer education conversion reviewed for source quality, plain-language boundaries, privacy, and exclusion of individualized treatment instructions. No independent physician or pharmacist review is claimed.";

export const CONSUMER_PATIENT_GUIDE_ARTICLES: Article[] = [
  {
    slug: "safe-hospital-discharge-first-72-hours",
    title: "Safe Hospital Discharge and the First 72 Hours at Home",
    category: "Hospital & Patient Guide",
    readTime: "9 min read",
    publishedAt: "2026-07-19",
    lastReviewedAt: "2026-07-19",
    nextReviewAt: "2027-01-19",
    timeSensitive: true,
    reviewScope: "Discharge preparation, medication reconciliation, follow-up ownership, pending results, equipment and supply continuity, caregiver capacity, and current AHRQ transition-of-care resources.",
    updateNote: commonReviewNote,
    promise: "Use one practical plan to verify medicines, follow-up, equipment, home support, and unresolved questions before the first night at home.",
    audience: "Patients, caregivers, and families preparing to leave a hospital, observation unit, rehabilitation setting, or emergency department.",
    summary: "A safe discharge is more than receiving papers. Before leaving, confirm which written medication list controls, what happens tonight, who owns each follow-up item, how pending results will reach you, whether prescriptions and equipment are actually available, and what to do when part of the plan fails. This guide organizes questions and responsibilities; the treating team’s written instructions control.",
    body: [
      "Hospital discharge is a transfer of responsibility from a staffed care setting to the patient, family, outpatient clinicians, pharmacy, equipment suppliers, and community services. The plan can look complete on paper while still failing at home because a prescription is unavailable, equipment has not arrived, transportation is missing, or nobody is assigned to a pending result.",
      "AHRQ’s IDEAL discharge framework emphasizes including patients and families, reviewing medicines, highlighting warning signs, explaining test results, arranging follow-up, using plain language, and checking understanding. You can use those same ideas to organize the final conversation without entering personal health information into this website.",
    ],
    sections: [
      {
        title: "The most important thing",
        definition: "Before leaving, identify the final written plan and make sure every unresolved item has a named owner, contact route, and backup plan.",
        keyPoints: [
          "Ask which medication list is final and which earlier lists should be ignored.",
          "Confirm what must happen tonight, tomorrow, and during the first three days.",
          "Write down who owns pending tests, referrals, appointments, prescriptions, equipment, and services.",
          "Do not assume a referral, authorization, prescription, ride, or equipment order is complete until the receiving party confirms it.",
        ],
      },
      {
        title: "Medicines before the first night",
        keyPoints: [
          "Separate medicines into new, changed, continued, stopped, and temporarily held.",
          "Verify the exact next dose from the treating team’s final instructions; do not reconstruct the schedule from memory.",
          "Confirm the pharmacy has the prescription, the medicine is affordable, and an after-hours problem has a contact route.",
          "Ask what to do when the discharge list conflicts with a bottle, portal, prior list, or verbal instruction.",
        ],
        watchOut: "Do not start, stop, skip, double, substitute, or restart a medicine based on this page. Resolve conflicts with the prescribing or discharging team.",
      },
      {
        title: "Follow-up and pending results",
        keyPoints: [
          "Record the purpose, timing, location, and responsible clinician for each appointment or laboratory test.",
          "Ask who will review results that are still pending and how you will be contacted.",
          "Confirm which clinician is responsible if symptoms, access, or instructions change before the appointment.",
          "If no primary care or specialist appointment exists, ask who is responsible for helping arrange it.",
        ],
      },
      {
        title: "Make the home plan real",
        keyPoints: [
          "Check stairs, mobility, food, electricity, bathroom access, sleep location, caregiver capacity, and transportation.",
          "Confirm equipment delivery, supplier phone numbers, consumable supplies, backup power, and safe storage.",
          "Clarify what home health, rehabilitation, skilled care, or caregiver support will actually provide—and when it starts.",
          "Name a backup person or service when the expected caregiver, supplier, ride, or agency cannot help.",
        ],
      },
      {
        title: "When the plan breaks",
        keyPoints: [
          "A missing medicine, delayed equipment delivery, unavailable appointment, conflicting instruction, or failed service is a problem to escalate—not something to silently work around.",
          "Use the discharge contact, prescribing team, pharmacy, supplier, insurer, or on-call service listed in the written plan.",
          "Keep written notices and reference numbers for coverage or authorization problems.",
          "Use emergency services for an emergency; this guide cannot determine the urgency of a specific symptom.",
        ],
      },
      {
        title: "Patient and caregiver self-check",
        keyPoints: [
          "Can I explain the three most important actions for tonight and tomorrow?",
          "Can I point to the final medicine list and explain what changed?",
          "Do I know who owns each appointment, pending result, prescription, and equipment need?",
          "Do I know which written contact route to use when the plan fails?",
        ],
      },
    ],
    questionsHeading: "Questions to ask before leaving",
    questionsToAsk: [
      "Which document is the final plan for home?",
      "What changed today, and what is still pending?",
      "What should happen tonight, tomorrow, and during the first 72 hours?",
      "Who owns each pending result, referral, prescription, equipment order, and follow-up appointment?",
      "What is the backup plan if the pharmacy, supplier, ride, caregiver, or agency cannot deliver?",
      "Which contact should we use after hours, and when should emergency services be used?",
    ],
    commonMistakes: [
      "Assuming an order means the pharmacy, supplier, facility, or agency has accepted it.",
      "Leaving with several medication lists without identifying the final one.",
      "Treating a pending result or referral as complete without a named owner.",
      "Planning for the ideal home situation without a backup for transportation, power, food, mobility, or caregiving.",
    ],
    takeaway: "A discharge plan is ready only when the patient or caregiver can find the final instructions, obtain the needed medicines and equipment, identify every follow-up owner, and know how to escalate a failed part of the plan.",
    sources: [AHRQ_IDEAL, AHRQ_TRANSITIONS],
    author: commonAuthor,
  },
  {
    slug: "blood-thinner-safety-before-going-home",
    title: "Blood Thinner Safety: What to Verify Before Going Home",
    category: "Hospital & Patient Guide",
    readTime: "8 min read",
    publishedAt: "2026-07-19",
    lastReviewedAt: "2026-07-19",
    nextReviewAt: "2026-10-19",
    timeSensitive: true,
    reviewScope: "General anticoagulant and antiplatelet education, medication identity, discharge verification, access planning, procedure communication, and explicit withholding of product-specific dosing and missed-dose instructions.",
    updateNote: commonReviewNote,
    promise: "Prepare the exact questions and written information needed to use a prescribed blood thinner safely without guessing at medicine-specific rules.",
    audience: "Patients and caregivers leaving care with an anticoagulant or antiplatelet medicine, or with uncertainty about whether one should continue at home.",
    summary: "“Blood thinner” can refer to different anticoagulant and antiplatelet medicines. Their indications, schedules, interactions, monitoring, procedure plans, and missed-dose instructions are not interchangeable. Before leaving, match the plan to the exact label, write down the reason and responsible prescriber, confirm access and follow-up, and ask where the medicine-specific instructions are located. Never invent a universal missed-dose or restart rule.",
    body: [
      "Blood thinners reduce the body’s ability to form harmful clots, but different products work in different ways. A familiar brand name does not make two medicines interchangeable, and the correct instructions depend on the exact prescription and clinical situation.",
      "This page is a preparation checklist. It intentionally does not provide product-specific doses, missed-dose directions, procedure hold times, restart timing, monitoring thresholds, or individualized emergency triage.",
    ],
    sections: [
      {
        title: "The most important thing",
        definition: "Match the final plan to the exact medicine name, strength, form, label, schedule, reason, and prescriber before leaving.",
        keyPoints: [
          "Ask whether the medicine is an anticoagulant, antiplatelet medicine, or something else.",
          "Confirm why it is prescribed and whether the plan is temporary or ongoing.",
          "Use only the medicine-specific instructions supplied by the treating team, pharmacist, and official labeling.",
          "Keep the prescribing team, pharmacy, and after-hours contact information with the medication list.",
        ],
      },
      {
        title: "Write down the exact plan",
        keyPoints: [
          "Exact generic and brand name, strength, dosage form, schedule, and next planned dose.",
          "Reason for treatment and which clinician is responsible for future changes.",
          "Any required laboratory, follow-up, refill, or monitoring plan.",
          "The exact source to use for a late or missed dose—without guessing or borrowing instructions from another product.",
        ],
        watchOut: "Do not stop, restart, double, split, substitute, or change a blood thinner based on this website or another person’s instructions.",
      },
      {
        title: "Medication and supplement review",
        keyPoints: [
          "Give the team a complete list of prescriptions, nonprescription medicines, vitamins, and supplements.",
          "Ask before adding pain relievers, cold products, supplements, or another medicine that could affect bleeding or clotting.",
          "Clarify whether an antiplatelet medicine such as aspirin is part of the same plan or a separate decision.",
          "Use one current medication list across the patient, caregiver, pharmacy, and clinicians.",
        ],
      },
      {
        title: "Procedures, dental work, falls, and injuries",
        keyPoints: [
          "Tell clinicians and dental professionals the exact medicine before a procedure or new prescription.",
          "Ask which clinician has authority to give hold or restart instructions.",
          "Ask the treating team for a written plan for falls, head impacts, injuries, and concerning bleeding.",
          "Do not use a universal procedure, injury, or bleeding rule; the medicine and patient-specific circumstances matter.",
        ],
      },
      {
        title: "Access and continuity",
        keyPoints: [
          "Confirm the pharmacy has the prescription and the patient can afford and obtain it before the next planned dose.",
          "Ask about prior authorization, quantity limits, refill timing, and who handles a denial or delay.",
          "Do not ration, stretch, or silently interrupt treatment because of cost or access; contact the responsible team promptly.",
          "Carry an updated medication list or wallet card when the treating team recommends one.",
        ],
      },
      {
        title: "Know the communication plan",
        keyPoints: [
          "Which number handles a late or missed dose?",
          "Which number handles a refill or coverage failure?",
          "Which clinician handles procedure questions?",
          "Which written instructions describe urgent and emergency concerns for this exact patient and product?",
        ],
      },
    ],
    questionsHeading: "Questions to ask the nurse, prescriber, or pharmacist",
    questionsToAsk: [
      "What is the exact medicine, strength, schedule, next dose, and reason?",
      "Who is responsible for future changes and refills?",
      "Where are the medicine-specific late or missed-dose instructions?",
      "What medicines, supplements, procedures, or dental work require a call first?",
      "What written plan should we follow after a fall, head impact, injury, or bleeding concern?",
      "What is the backup plan if the prescription is unavailable, unaffordable, or denied?",
    ],
    commonMistakes: [
      "Using a missed-dose rule from a different blood thinner.",
      "Assuming aspirin and anticoagulants are interchangeable.",
      "Stopping or restarting for a procedure without instructions from the responsible clinician.",
      "Leaving without a refill, affordability, monitoring, or after-hours plan.",
    ],
    takeaway: "Blood-thinner safety starts with exact medication identity and a written, product-specific plan from the treating team. This guide helps organize the questions; it does not supply dosing, missed-dose, procedure, or emergency instructions.",
    sources: [MEDLINE_BLOOD_THINNERS, AHRQ_IDEAL],
    author: commonAuthor,
  },
  {
    slug: "copd-recovery-after-hospital",
    title: "COPD Recovery After a Hospital Visit",
    category: "Hospital & Patient Guide",
    readTime: "8 min read",
    publishedAt: "2026-07-19",
    lastReviewedAt: "2026-07-19",
    nextReviewAt: "2027-01-19",
    timeSensitive: true,
    reviewScope: "COPD discharge preparation, medication and inhaler identity, equipment technique, activity progression, oxygen context, follow-up, and access continuity using current federal patient sources.",
    updateNote: commonReviewNote,
    promise: "Organize the medicines, inhalers, equipment, recovery plan, follow-up, and access questions that matter after a COPD-related hospital visit.",
    audience: "Adults recovering after a COPD flare or respiratory hospital visit, plus caregivers helping with the first days at home.",
    summary: "COPD discharge plans may include changed inhalers, a nebulizer, short-course medicines, oxygen, activity guidance, and follow-up. Before leaving, identify which inhaler is used for which purpose, demonstrate the exact device, write down stop dates and follow-up, confirm supplies and oxygen instructions, and ask what changes should be reported to the treating team. Do not change oxygen flow or medicine use based on this page.",
    body: [
      "A COPD flare can leave a patient with several devices and medicines that look similar but serve different purposes. The safest preparation step is to match every item to the final written plan and demonstrate the exact technique before leaving.",
      "Recovery can be uneven. The treating team should define the patient-specific activity, oxygen, medicine, and follow-up plan. This guide focuses on organization and verification rather than diagnosis or treatment changes.",
    ],
    sections: [
      {
        title: "The most important thing",
        definition: "Match each inhaler, nebulizer medicine, oxygen instruction, short-course medicine, and follow-up item to the final written plan.",
        keyPoints: [
          "Separate quick-relief and maintenance medicines using the exact labels supplied by the team.",
          "Ask the patient to show the technique with the actual inhaler, spacer, or nebulizer.",
          "Write down start and stop dates for short-course medicines when applicable.",
          "Confirm which clinician handles worsening breathing, refills, and equipment problems.",
        ],
      },
      {
        title: "Device technique and supplies",
        keyPoints: [
          "Bring the actual inhalers, spacer, nebulizer parts, and oxygen equipment to teaching when possible.",
          "Ask the nurse, respiratory therapist, pharmacist, or clinician to watch the technique rather than relying only on verbal explanation.",
          "Confirm cleaning, drying, storage, replacement parts, filters, and supplier support for the exact device.",
          "Check that medicine counters, vials, tubing, masks, mouthpieces, and electricity needs are understood.",
        ],
      },
      {
        title: "Recovery and activity",
        keyPoints: [
          "Ask how activity should restart and whether pulmonary rehabilitation or therapy is recommended.",
          "Use the treating team’s plan for pacing, rest, breathing techniques, and mobility support.",
          "Ask what level of breathlessness is expected during recovery and what change should prompt a call.",
          "Confirm transportation and physical access to follow-up appointments.",
        ],
      },
      {
        title: "Oxygen and positive-airway-pressure questions",
        keyPoints: [
          "Confirm whether oxygen is prescribed, when it should be used, the exact equipment, and the responsible supplier.",
          "Do not change oxygen flow or mode without the prescribing team’s instructions.",
          "Ask whether CPAP, BiPAP, or another nighttime device should continue and what equipment or mask support is available.",
          "Confirm backup power and a contact plan for equipment failure.",
        ],
      },
      {
        title: "Access and follow-up",
        keyPoints: [
          "Verify the pharmacy has every prescribed medicine and that insurance or affordability barriers are addressed.",
          "Confirm primary-care and pulmonary follow-up, plus any respiratory-therapy or rehabilitation referral.",
          "Ask who reviews new oxygen needs and whether reassessment is planned.",
          "Keep supplier, pharmacy, clinic, and after-hours numbers together.",
        ],
      },
      {
        title: "Changes to report",
        definition: "Use the patient-specific written plan and contact the treating team about worsening or unexpected changes.",
        keyPoints: [
          "Breathing becoming harder, faster, or different from the expected recovery pattern.",
          "New confusion, unusual drowsiness, chest discomfort, inability to use equipment, or a medicine problem.",
          "Running out of medicine, oxygen, electricity, or supplies.",
          "Emergency symptoms require emergency services; this page cannot classify a specific symptom.",
        ],
      },
    ],
    questionsHeading: "Questions to ask before going home",
    questionsToAsk: [
      "Which medicine or device is for quick relief, and which is maintenance?",
      "Can you watch me use each inhaler, spacer, or nebulizer?",
      "What are the written start and stop dates for short-course medicines?",
      "What activity and recovery plan should I follow?",
      "Do I need oxygen or a nighttime breathing device, and who supports the equipment?",
      "Who should I call if breathing, medicine access, or equipment does not match the plan?",
    ],
    commonMistakes: [
      "Treating every inhaler as interchangeable.",
      "Leaving without demonstrating the exact device technique.",
      "Changing oxygen flow independently.",
      "Assuming the pharmacy, oxygen supplier, or rehabilitation referral is complete without confirmation.",
    ],
    takeaway: "A workable COPD recovery plan connects the exact medicines and devices with demonstrated technique, recovery expectations, oxygen and equipment support, follow-up, and a clear contact plan when something changes.",
    sources: [MEDLINE_COPD_DISCHARGE, NHLBI_COPD, MEDLINE_NEBULIZER, MEDLINE_OXYGEN_HOME],
    author: commonAuthor,
  },
  {
    slug: "heart-failure-plan-after-discharge",
    title: "Heart Failure: Understanding the Plan After Discharge",
    category: "Hospital & Patient Guide",
    readTime: "8 min read",
    publishedAt: "2026-07-19",
    lastReviewedAt: "2026-07-19",
    nextReviewAt: "2027-01-19",
    timeSensitive: true,
    reviewScope: "Heart-failure discharge preparation, medication changes, consistent symptom and weight tracking, individualized diet and fluid instructions, laboratory and follow-up ownership, and current AHA patient guidance.",
    updateNote: commonReviewNote,
    promise: "Turn a complicated heart-failure discharge plan into a clear list of medicines, daily tracking, follow-up, and questions for the treating team.",
    audience: "People leaving care with heart failure and caregivers helping organize daily management and follow-up.",
    summary: "Heart-failure plans often combine changed medicines, laboratory monitoring, daily weight and symptom tracking, diet or fluid instructions, and early follow-up. The exact thresholds and treatment changes must come from the treating team. Before leaving, write down what changed, use one consistent tracking routine, identify which changes to report, and confirm who handles medicine adjustments, laboratory results, and access problems.",
    body: [
      "Heart failure does not mean the heart has stopped. It means the heart needs support to meet the body’s needs. Symptoms and treatment plans vary, so the safest consumer guide focuses on understanding the written plan rather than supplying universal thresholds or medication changes.",
      "The American Heart Association recommends tracking changes in symptoms and working with the care team to know what to monitor and report. Caregivers may notice changes such as confusion, swelling, sleep difficulty, or reduced activity before the patient does.",
    ],
    sections: [
      {
        title: "The most important thing",
        definition: "Know what changed, what should be tracked each day, and which clinician is responsible for adjusting the plan.",
        keyPoints: [
          "Compare the final medication list with the pre-hospital list.",
          "Write down the purpose of each medicine and when follow-up laboratory work is required.",
          "Use the same daily tracking routine recommended by the treating team.",
          "Keep the individualized report thresholds and contact numbers with the tracker.",
        ],
      },
      {
        title: "Medicines and laboratory follow-up",
        keyPoints: [
          "Separate new, changed, continued, stopped, and temporarily held medicines.",
          "Ask which medicine changes depend on blood pressure, kidney function, electrolytes, symptoms, or follow-up laboratory results.",
          "Do not self-adjust a diuretic or another heart medicine unless the treating team has supplied a specific written plan.",
          "Confirm who reviews laboratory results and who calls with changes.",
        ],
      },
      {
        title: "A consistent tracking routine",
        keyPoints: [
          "Ask whether daily weight, symptoms, blood pressure, pulse, swelling, sleep, appetite, or activity should be tracked.",
          "Use the same scale and a consistent morning routine when daily weights are part of the plan.",
          "Record changes rather than relying on memory.",
          "Use the patient-specific thresholds supplied by the care team; this page intentionally does not create universal cutoffs.",
        ],
      },
      {
        title: "Diet, fluid, and activity",
        keyPoints: [
          "Ask for the patient-specific sodium and fluid instructions rather than assuming one restriction applies to everyone.",
          "Clarify how the plan fits the patient’s kidney function, appetite, diabetes, medications, and other conditions.",
          "Ask how activity should restart and whether cardiac rehabilitation, therapy, or mobility support is recommended.",
          "Plan for groceries, food preparation, transportation, and caregiver support.",
        ],
      },
      {
        title: "Follow-up ownership",
        keyPoints: [
          "Confirm the first primary-care or cardiology appointment and its purpose.",
          "Write down who manages refills, laboratory orders, weight or symptom calls, and after-hours concerns.",
          "Ask what to do when a medicine is unaffordable, unavailable, or denied.",
          "Confirm how pending tests or imaging results will be communicated.",
        ],
      },
      {
        title: "Changes to report",
        keyPoints: [
          "New or worsening shortness of breath, swelling, sleep difficulty, fatigue, appetite change, confusion, dizziness, or another change listed by the treating team.",
          "A weight change that crosses the individualized report threshold supplied by the care team.",
          "A missed medicine, refill failure, conflicting instruction, or inability to complete monitoring.",
          "Use emergency services for an emergency; this page cannot determine the urgency of a specific symptom.",
        ],
      },
    ],
    questionsHeading: "Questions to ask before discharge",
    questionsToAsk: [
      "What changed in the medicine plan, and why?",
      "Which daily measurements or symptoms should be tracked?",
      "What exact change should be reported, and to which number?",
      "What sodium, fluid, and activity instructions apply to this patient?",
      "Which laboratory tests are needed, and who reviews the results?",
      "Who handles refills, access problems, and after-hours questions?",
    ],
    commonMistakes: [
      "Using a universal weight, fluid, or blood-pressure threshold instead of the patient-specific plan.",
      "Self-adjusting a diuretic without written instructions.",
      "Tracking numbers without knowing who receives them or what action follows.",
      "Leaving laboratory, refill, and appointment responsibilities unassigned.",
    ],
    takeaway: "A heart-failure discharge plan works when the patient and caregiver understand the medicine changes, use a consistent tracking routine, know the individualized report thresholds, and can reach the clinician responsible for adjustments and follow-up.",
    sources: [AHA_HEART_FAILURE, AHA_HEART_FAILURE_CHANGES, AHRQ_IDEAL],
    author: commonAuthor,
  },
  {
    slug: "new-home-oxygen-nebulizer-guide",
    title: "New Home Oxygen and Nebulizer Guide",
    category: "Hospital & Patient Guide",
    readTime: "9 min read",
    publishedAt: "2026-07-19",
    lastReviewedAt: "2026-07-19",
    nextReviewAt: "2027-01-19",
    timeSensitive: true,
    reviewScope: "Home oxygen identity and prescribed settings, fire and trip safety, supplier and backup planning, nebulizer setup and cleaning, travel and power questions, and current MedlinePlus patient guidance.",
    updateNote: commonReviewNote,
    promise: "Prepare the equipment, safety, supplier, backup-power, cleaning, and follow-up questions needed before the first night with home oxygen or a nebulizer.",
    audience: "Patients and caregivers leaving care with new or changed home oxygen, a nebulizer, or both.",
    summary: "Home oxygen and nebulizers require more than an order. Before leaving, identify the exact equipment and prescribed setting, confirm delivery and backup plans, understand fire and trip safety, demonstrate setup and cleaning, keep supplier contacts available, and know who to call when the equipment or breathing plan does not work. Do not change oxygen flow or mix nebulizer medicines based on this page.",
    body: [
      "Oxygen may come from tanks, liquid systems, or concentrators, and each setup has different power, travel, refill, and backup needs. A nebulizer turns liquid medicine into a mist and requires the correct medicine, parts, cleaning method, and maintenance plan.",
      "The exact order, manufacturer instructions, respiratory-therapy teaching, and treating team’s written plan control. This guide helps organize the handoff and does not replace equipment-specific or medicine-specific instructions.",
    ],
    sections: [
      {
        title: "The most important thing",
        definition: "Know the exact equipment, prescribed setting and schedule, supplier, backup plan, and safety rules before the first night at home.",
        keyPoints: [
          "Match the delivered oxygen device and nebulizer to the written order.",
          "Ask the patient or caregiver to demonstrate setup, use, shutdown, and backup steps.",
          "Keep supplier, respiratory team, prescriber, and emergency contacts available.",
          "Do not change oxygen flow, device mode, schedule, or nebulizer medicine without instructions from the responsible clinician.",
        ],
      },
      {
        title: "Oxygen identity and backup planning",
        keyPoints: [
          "Write down the equipment type, prescribed use, supplier, delivery schedule, and maintenance contact.",
          "Ask how to tell when a tank is low or a concentrator is not functioning.",
          "Confirm backup oxygen and a plan for power failure, evacuation, travel, and time away from home.",
          "Tell household members how to contact the supplier and where backup equipment is stored.",
        ],
      },
      {
        title: "Fire, heat, and trip safety",
        keyPoints: [
          "Oxygen supports combustion, so smoking and open flames must be kept away from oxygen use and storage.",
          "Follow the supplier and fire-safety instructions for distance from heat, sparks, stoves, candles, and electrical equipment.",
          "Secure tanks as instructed and route tubing to reduce falls and entanglement.",
          "Use smoke detectors and the home emergency plan recommended by the treating team, supplier, and local safety authorities.",
        ],
      },
      {
        title: "Nebulizer setup and cleaning",
        keyPoints: [
          "Use only the medicine and amount supplied in the patient-specific prescription.",
          "Follow the manufacturer and clinician instructions for assembly, mask or mouthpiece use, cleaning, drying, storage, and filter replacement.",
          "Do not mix medicines unless the prescriber or pharmacist explicitly says the combination is appropriate.",
          "Contact the provider or equipment supplier when the machine, tubing, cup, mask, mouthpiece, or filter is not working correctly.",
        ],
      },
      {
        title: "Skin, nose, mobility, and daily use",
        keyPoints: [
          "Ask about dryness, skin pressure, tubing comfort, and products that are safe to use around oxygen.",
          "Confirm how equipment should be used during sleep, walking, bathing, transportation, and appointments.",
          "Plan enough tubing or portable supply without creating trip hazards.",
          "Ask whether respiratory therapy, home health, or supplier follow-up is expected.",
        ],
      },
      {
        title: "When equipment or the plan fails",
        keyPoints: [
          "Check the written equipment troubleshooting steps and contact the supplier or treating team.",
          "Do not compensate for a suspected equipment problem by changing the oxygen setting independently.",
          "Keep the backup supply and outage plan accessible.",
          "Use emergency services for an emergency; this guide cannot determine the urgency of a specific breathing problem.",
        ],
      },
    ],
    questionsHeading: "Questions to ask before equipment arrives or before going home",
    questionsToAsk: [
      "What exact oxygen device, setting, schedule, and backup supply were ordered?",
      "Who delivers, maintains, and replaces the equipment and supplies?",
      "What should we do during a power failure, evacuation, trip, or equipment malfunction?",
      "Can you watch us set up and clean the exact nebulizer?",
      "Which products, flames, heat sources, and household activities are unsafe around oxygen?",
      "Who should we call when breathing or the equipment does not match the written plan?",
    ],
    commonMistakes: [
      "Changing oxygen flow without the prescriber’s instructions.",
      "Assuming an equipment order guarantees delivery before the patient arrives home.",
      "Using oxygen near smoking, flames, heat, or sparks.",
      "Mixing nebulizer medicines or using cleaning instructions from a different device.",
      "Leaving without backup power, portable supply, supplier contacts, or replacement supplies.",
    ],
    takeaway: "A safe home equipment plan connects the exact prescription with delivered equipment, demonstrated technique, fire and trip safety, cleaning, backup power and oxygen, supplier support, and a clear escalation route.",
    sources: [MEDLINE_OXYGEN_HOME, MEDLINE_OXYGEN_SAFETY, MEDLINE_NEBULIZER],
    author: commonAuthor,
  },
];

export const CONSUMER_PATIENT_GUIDE_CARDS = CONSUMER_PATIENT_GUIDE_ARTICLES.map((article) => ({
  id: article.slug,
  title: article.title,
  summary: article.promise,
  route: `/articles/${article.slug}`,
  reviewStatus: "RN-authored · authoritative sources · no independent physician or pharmacist review claimed",
}));
