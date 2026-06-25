import type { Topic } from "./topics";
import { Brain } from "lucide-react";
import { SOURCE_PRESETS } from "./sources";

// Financial literacy topic for healthcare workers
export const financialLiteracyTopic: Topic = {
  slug: "financial-literacy",
  category: "Behavior & Burnout",
  icon: Brain,
  title: "Financial Literacy",
  promise: "Why money skills matter for your career and mental health",
  startHere:
    "Financial literacy — understanding budgeting, debt, savings, and investing — is critical for healthcare professionals. This guide summarizes research on financial literacy among healthcare providers and offers practical steps to build your skills.",
  definitions: [
    {
      term: "Financial literacy",
      meaning:
        "The ability to understand and use financial concepts like budgeting, saving, investing, and managing debt.",
    },
    {
      term: "Budget",
      meaning:
        "A plan for your income and expenses that helps you control where your money goes.",
    },
  ],
  factSheet: {
    eyebrow: "Financial literacy fact sheet",
    title: "Why it matters",
    description:
      "Research and surveys highlight gaps in financial literacy and the impact of healthcare costs.",
    items: [
      {
        title: "Low financial literacy among providers",
        definition:
          "A systematic review found that financial literacy among medical students, junior professionals, and even senior healthcare leaders is often suboptimal.",
        bullets: [
          "Financial literacy depends on factors like age, gender, qualification, and income【743147831202420†L153-L175】.",
        ],
      },
      {
        title: "Cost affects patients and providers",
        definition:
          "High healthcare costs lead many adults to delay care and alter medication use.",
        bullets: [
          "Nearly 18% of U.S. adults said their health worsened because they skipped or delayed care【643559570147308†L325-L334】.",
          "About 43% of adults did not take their medications as prescribed due to cost【643559570147308†L347-L355】.",
        ],
      },
    ],
  },
  calculator: {
    key: "calc403b",
    title: "Retirement Contribution Calculator",
    description:
      "Model how increasing your paycheck contribution affects your annual total and employer match.",
  },
  relatedArticleSlugs: ["financial-literacy-healthcare-workers"],
  sources: [
    SOURCE_PRESETS.financialLiteracyProviders,
    SOURCE_PRESETS.kffAmericansHealthcareCosts,
  ],
};
