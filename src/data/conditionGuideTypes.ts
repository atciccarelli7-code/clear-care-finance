import type { Source } from "./sources";

export type ConditionGuideTest = {
  name: string;
  plainName?: string;
  questionAnswered: string;
  whatToKnow: string;
};

export type ConditionGuideMedicationGroup = {
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

export type ConditionGuideActionLevel = {
  id: "emergency" | "same-day" | "steady";
  label: string;
  instruction: string;
  signs: string[];
  verification: string;
};

export type ConditionGuidePattern = {
  name: string;
  shortLabel: string;
  plainEnglish: string;
  whyItMatters: string;
};

export type ConditionGuide = {
  slug: string;
  route: string;
  status: "clinical-review";
  title: string;
  subtitle: string;
  shortTitle: string;
  diagnosisName: string;
  updatedAt: string;
  nextReviewAt: string;
  reviewScope: string;
  audience: string;
  boundary: string;
  quickExplanation: {
    title: string;
    body: string;
    repeatBack: string;
  };
  doesNotMean: string[];
  terms: Array<{ term: string; meaning: string }>;
  patternEyebrow: string;
  patternTitle: string;
  patternDescription: string;
  patterns: ConditionGuidePattern[];
  patternNote: string;
  causes: Array<{ title: string; examples: string }>;
  causeBoundary: string;
  tests: ConditionGuideTest[];
  treatmentGoals: Array<{ title: string; explanation: string }>;
  treatmentNote?: string;
  medications: ConditionGuideMedicationGroup[];
  procedures: Array<{ name: string; explanation: string }>;
  dailyPlan: Array<{ title: string; details: string }>;
  actionPlan: ConditionGuideActionLevel[];
  questions: string[];
  teachBack: string[];
  sources: Source[];
  benchmarkName: string;
  benchmarkUrl: string;
  printBoundary: string;
};
