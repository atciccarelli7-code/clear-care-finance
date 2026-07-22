import type { Article } from "./articles";
import {
  DIAGNOSIS_GUIDE_EDITORIAL_GATES,
  DIAGNOSIS_GUIDE_PILOTS,
  DIAGNOSIS_GUIDE_SECTIONS,
} from "./diagnosisGuideFramework";
import { HEART_FAILURE_GUIDE_ROUTE } from "./heartFailureGuide";

const heartFailurePilot = DIAGNOSIS_GUIDE_PILOTS[0];

export const DIAGNOSIS_EXPLAINED_ARTICLE: Article = {
  slug: "diagnosis-explained",
  title: "Diagnosis, Explained: Our Plain-English Guide System",
  category: "Patients & Caregivers",
  readTime: "7 min read",
  publishedAt: "2026-07-22",
  lastReviewedAt: "2026-07-22",
  nextReviewAt: "2026-10-22",
  timeSensitive: false,
  reviewScope: "Editorial and safety framework, plus the current development status of the complete Heart Failure, Explained clinical-review preview.",
  author: "Andrew Ciccarelli, BSN, RN",
  promise: "See the exact format Community Acquired Finance uses to explain diagnoses clearly without becoming a symptom checker or attempting to diagnose the reader.",
  description: "The RN-designed format, publication gates, and current heart-failure clinical-review preview for future plain-English diagnosis guides.",
  audience: "Patients and caregivers who already received a diagnosis and want a clearer explanation before their next conversation with the care team.",
  summary: "Diagnosis, Explained is a governed patient-education system. The reader brings the diagnosis. Each guide explains what it means, what it does not automatically mean, possible contributing causes, common evaluation, treatment goals, why medications may be prescribed, daily monitoring, warning signs, and questions to ask. The system does not collect symptoms, interpret individual test results, recommend a diagnosis, or direct an individual treatment plan. The first complete product preview—Heart Failure, Explained—is built and source-checked but remains noindex and ad-free while independent clinical review is pending.",
  body: [
    "A diagnosis can be medically accurate and still leave a patient or family member confused. The purpose of Diagnosis, Explained is to close that understanding gap without replacing the clinician who made the diagnosis.",
    "This is deliberately not a symptom checker. Readers should arrive with a diagnosis they were already given. The guide then provides a calm, organized explanation they can read, print, discuss with family, and use to prepare questions for their own care team.",
    "Every diagnosis guide uses the same structure, sourcing rules, medication boundaries, emergency-language rules, authorship details, review dates, and clinical-review requirements.",
    "The first complete product preview is Heart Failure, Explained. Its definitions, classifications, tests, medication-purpose cards, daily plan, warning signs, and source set are built. It remains clearly labeled as a clinical-review preview and will not be opened to search indexing until an independent qualified reviewer verifies the condition-specific content.",
  ],
  sections: DIAGNOSIS_GUIDE_SECTIONS.map((section) => ({
    title: section.title,
    definition: section.purpose,
    keyPoints: [...section.prompts],
    ...("safetyBoundary" in section ? { watchOut: section.safetyBoundary } : {}),
  })),
  example: {
    title: `First complete preview: ${heartFailurePilot.diagnosis}`,
    body: `${heartFailurePilot.intendedAudience} Scope: ${heartFailurePilot.scope} Current status: ${heartFailurePilot.status}. The preview is available for product and clinical review, but it is not represented as a finalized clinical handout.`,
  },
  relatedCalculator: { label: "Open Heart Failure, Explained", href: HEART_FAILURE_GUIDE_ROUTE },
  commonMistakes: [
    "Starting with a symptom quiz that encourages the site to infer a diagnosis.",
    "Using generic medication lists without explaining why the exact treatment differs by type, severity, comorbidities, and test results.",
    "Presenting possible causes as though the website knows what caused one person's condition.",
    "Burying emergency warning signs inside long paragraphs.",
    "Publishing a medically polished page without visible sources, author information, review dates, or a named clinical-review process.",
    "Using a disclaimer to excuse individualized or prescriptive language that should not be on the page in the first place.",
  ],
  questionsHeading: "What every guide must help the reader ask",
  questionsToAsk: [
    "What type, stage, or severity of this diagnosis do I have?",
    "What do you think caused or contributed to it in my situation?",
    "What is each treatment or medication intended to accomplish?",
    "What should I monitor at home, and what changes should I report?",
    "Which symptoms mean I should call, seek urgent evaluation, or call 911?",
    "What follow-up visits, laboratory work, imaging, rehabilitation, equipment, or specialist care do I need?",
    "What cost, transportation, medication-access, caregiving, or home-safety barriers should we address now?",
  ],
  takeaway: "The product is not an online diagnostician. It is a governed patient-education system: arrive with a diagnosis, leave with a clear mental model, better questions, and a safer understanding of what must still come from the treating clinician.",
  sources: [
    {
      name: "Centers for Disease Control and Prevention",
      pageTitle: "Plain Language Materials & Resources",
      url: "https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html",
      note: "Official plain-language guidance used to shape familiar wording, readable structure, and actionable health information.",
    },
    {
      name: "Agency for Healthcare Research and Quality",
      pageTitle: "Health Literacy Universal Precautions Toolkit, 3rd Edition",
      url: "https://www.ahrq.gov/health-literacy/improve/precautions/toolkit.html",
      note: "Framework for reducing healthcare complexity and supporting understanding across health-literacy levels.",
    },
    {
      name: "Agency for Healthcare Research and Quality",
      pageTitle: "Use the Teach-Back Method: Tool 5",
      url: "https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html",
      note: "Official teach-back guidance supporting the comprehension checks planned for each diagnosis guide.",
    },
    {
      name: "MedlinePlus / National Library of Medicine",
      pageTitle: "Evaluating Health Information",
      url: "https://medlineplus.gov/evaluatinghealthinformation.html",
      note: "Public guidance on transparent authorship, sourcing, update dates, purpose, and privacy when evaluating online health information.",
    },
  ],
};

export const DIAGNOSIS_EXPLAINED_EDITORIAL_GATES = [...DIAGNOSIS_GUIDE_EDITORIAL_GATES];
