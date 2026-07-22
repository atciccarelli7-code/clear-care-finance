export const DIAGNOSIS_EXPLAINED_ROUTE = "/articles/diagnosis-explained";

export type DiagnosisGuideStatus = "planned" | "drafting" | "clinical-review" | "published";

export type DiagnosisGuideSectionDefinition = {
  id: string;
  title: string;
  purpose: string;
  prompts: string[];
  safetyBoundary?: string;
};

export type DiagnosisGuidePilot = {
  slug: string;
  diagnosis: string;
  status: DiagnosisGuideStatus;
  intendedAudience: string;
  scope: string;
};

export const DIAGNOSIS_GUIDE_SECTIONS = [
  {
    id: "plain-english-meaning",
    title: "What this diagnosis means in plain English",
    purpose: "Give the reader a usable mental model before introducing medical vocabulary.",
    prompts: [
      "What is happening in the body?",
      "Why does it matter?",
      "What is the shortest accurate explanation a patient could repeat to a family member?",
    ],
    safetyBoundary: "Explain the diagnosis already given by a clinician. Do not infer whether the reader has it.",
  },
  {
    id: "what-it-does-not-mean",
    title: "What it does not automatically mean",
    purpose: "Correct common catastrophic or misleading assumptions without minimizing the condition.",
    prompts: [
      "Which words in the diagnosis are commonly misunderstood?",
      "What conclusions should a patient not jump to?",
      "Which important differences depend on type, severity, testing, or the individual situation?",
    ],
  },
  {
    id: "possible-causes",
    title: "What can contribute to it",
    purpose: "Describe common causes and contributing conditions without pretending the list identifies the reader's cause.",
    prompts: [
      "What are the major cause categories?",
      "Can several factors contribute at the same time?",
      "What testing may be needed before clinicians can identify a cause?",
    ],
    safetyBoundary: "Use qualified language such as can, may, and sometimes. Never tell a reader what caused their condition.",
  },
  {
    id: "types-and-differences",
    title: "The main types and why they matter",
    purpose: "Show why two people with the same broad diagnosis may receive different explanations or treatment plans.",
    prompts: [
      "What clinically meaningful subtypes exist?",
      "How are they usually distinguished?",
      "Which treatment or monitoring differences are important enough for a patient to understand?",
    ],
  },
  {
    id: "clinical-evaluation",
    title: "How clinicians usually evaluate it",
    purpose: "Explain the purpose of common examinations, laboratory tests, imaging, and follow-up rather than listing unexplained test names.",
    prompts: [
      "What question is each common test trying to answer?",
      "Which findings can change the care plan?",
      "What follow-up testing or monitoring may occur?",
    ],
  },
  {
    id: "treatment-goals",
    title: "What treatment is trying to accomplish",
    purpose: "Start with treatment goals so medications, procedures, and lifestyle recommendations make sense together.",
    prompts: [
      "Is treatment aimed at symptoms, disease progression, complications, survival, or an underlying cause?",
      "Which goals are immediate and which are long term?",
      "Why can the treatment plan differ between patients?",
    ],
    safetyBoundary: "Describe possible treatment strategies. Do not recommend a treatment for the reader.",
  },
  {
    id: "medication-purpose",
    title: "Why a medication might be prescribed",
    purpose: "Translate medication classes into the job each medicine may perform in the care plan.",
    prompts: [
      "What does this medication class do in plain English?",
      "Is it mainly for symptom relief, risk reduction, disease modification, or another goal?",
      "What may the care team monitor after starting or adjusting it?",
      "What questions should the patient ask about the exact medicine they were prescribed?",
    ],
    safetyBoundary: "Never tell readers to start, stop, skip, increase, decrease, or substitute medication.",
  },
  {
    id: "daily-life-and-monitoring",
    title: "What daily life and monitoring may involve",
    purpose: "Prepare patients and caregivers for the practical work that can follow a diagnosis.",
    prompts: [
      "What symptoms, measurements, habits, equipment, or appointments may matter?",
      "Which instructions must come from the person's own care team?",
      "What barriers should a patient raise early, such as cost, transportation, mobility, or medication access?",
    ],
  },
  {
    id: "warning-signs",
    title: "When to call, seek urgent care, or call 911",
    purpose: "Separate routine follow-up from urgent changes and emergencies using authoritative condition-specific guidance.",
    prompts: [
      "Which changes should be reported promptly?",
      "Which symptoms need urgent same-day evaluation?",
      "Which symptoms are emergencies?",
    ],
    safetyBoundary: "Emergency language must be specific, prominently displayed, source-backed, and clinically reviewed.",
  },
  {
    id: "questions-to-ask",
    title: "Questions to ask the care team",
    purpose: "Help the reader leave an appointment with the information needed to understand and follow the plan.",
    prompts: [
      "What type or stage do I have?",
      "What do you think caused or contributed to it?",
      "What is each treatment supposed to accomplish?",
      "What should I monitor, and what changes should I report?",
      "What follow-up, laboratory work, imaging, or specialist care do I need?",
    ],
  },
  {
    id: "teach-back",
    title: "A plain-English teach-back check",
    purpose: "Help the reader test whether the explanation is understandable enough to use.",
    prompts: [
      "Can I explain the diagnosis in my own words?",
      "Can I explain why I take each prescribed medication?",
      "Do I know what to monitor and when to get help?",
      "Do I know which questions are still unanswered?",
    ],
  },
  {
    id: "sources-and-review",
    title: "Sources, author, reviewer, and update status",
    purpose: "Make trust visible instead of asking the reader to assume the page is current and clinically sound.",
    prompts: [
      "Who wrote the guide and what is their role?",
      "Who clinically reviewed it?",
      "Which guidelines, government sources, and professional organizations support it?",
      "When was it published, reviewed, and scheduled for its next review?",
    ],
  },
] as const satisfies readonly DiagnosisGuideSectionDefinition[];

export const DIAGNOSIS_GUIDE_EDITORIAL_GATES = [
  "The page explains a diagnosis the reader already received; it does not diagnose symptoms or test results.",
  "Every clinical claim is supported by authoritative, condition-appropriate sources.",
  "Medication content explains purpose and monitoring without directing medication changes.",
  "Urgent and emergency warning signs are visibly separated and clinically reviewed.",
  "Important differences by type, stage, severity, comorbidity, age, pregnancy status, or kidney and liver function are acknowledged when relevant.",
  "The page identifies its author, clinical reviewer, publication date, last review date, next review date, and review scope.",
  "The guide uses short sections, familiar language, defined medical terms, and actionable questions.",
  "The page requests no symptoms, laboratory values, medication list, diagnosis history, or other personal health information.",
] as const;

export const DIAGNOSIS_GUIDE_PILOTS = [
  {
    slug: "heart-failure",
    diagnosis: "Heart failure",
    status: "drafting",
    intendedAudience: "Adults who have received a heart-failure diagnosis, plus family members and caregivers.",
    scope: "Plain-English meaning, major types, possible contributing causes, common evaluation, treatment goals, medication purpose, home monitoring, warning signs, and care-team questions.",
  },
] as const satisfies readonly DiagnosisGuidePilot[];
