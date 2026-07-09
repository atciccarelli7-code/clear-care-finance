import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const generatedPath = (...parts) => path.join(repoRoot, "docs/generated", ...parts);
const docsPath = (...parts) => path.join(repoRoot, "docs", ...parts);
const publicPath = (...parts) => path.join(repoRoot, "public", ...parts);

const defaultPageThemeMap = {
  1: { eyebrow: "Start here", icon: "1", theme: "start", cues: ["Identify the question", "Check the rule", "Save the source"] },
  2: { eyebrow: "Avoid assumptions", icon: "!", theme: "warning", cues: ["Name the risk", "Ask for proof", "Write it down"] },
  3: { eyebrow: "Program map", icon: "M", theme: "program", cues: ["Sort the program", "Confirm the source", "Check the fit"] },
  4: { eyebrow: "Decision point", icon: "4", theme: "coverage", cues: ["Compare paths", "Check timing", "Ask what changes"] },
  5: { eyebrow: "Timing check", icon: "5", theme: "status", cues: ["Name the window", "Find the notice", "Save the date"] },
  6: { eyebrow: "Paper trail", icon: "D", theme: "pathway", cues: ["Gather documents", "Verify authority", "Track the answer"] },
  7: { eyebrow: "Care or coverage", icon: "7", theme: "rehab", cues: ["Name the need", "Check the program", "Ask the next step"] },
  8: { eyebrow: "After the first answer", icon: "8", theme: "home", cues: ["Watch notices", "Respond quickly", "Keep receipts"] },
  9: { eyebrow: "Mistakes to avoid", icon: "!", theme: "billing", cues: ["Do not assume", "Check deadlines", "Ask for help"] },
  10: { eyebrow: "Call scripts", icon: "?", theme: "scripts", cues: ["Call the right place", "Use the script", "Document the answer"] },
};

export const quickGuideDefinitions = {
  "hospital-discharge-medicare-quick-guide": {
    id: "hospital-discharge-medicare-quick-guide",
    title: "The Hospital Discharge & Medicare Quick Guide",
    subtitle: "A plain-English printable reference for families before discharge, rehab, home support, long-term care, or a confusing bill.",
    slug: "hospital-discharge-medicare-quick-guide",
    sourceManuscriptPath: docsPath("medicare-medicaid-quick-guide-pre-pdf-manuscript.md"),
    outputHtmlPath: generatedPath("medicare-medicaid-quick-guide", "hospital-discharge-medicare-quick-guide-preflight.html"),
    outputPdfPath: generatedPath("medicare-medicaid-quick-guide", "hospital-discharge-medicare-quick-guide-preflight.pdf"),
    publicPdfPath: publicPath("guides", "hospital-discharge-medicare-quick-guide.pdf"),
    publicReleaseAllowed: true,
    routeMetadata: {
      hubPath: "/guides",
      landingPath: "/guides/medicare-medicaid-rehab-long-term-care",
      publicPdfPath: "/guides/hospital-discharge-medicare-quick-guide.pdf",
      status: "public-launch-review",
    },
    coverEyebrow: "Printable hospital-family reference",
    coverChips: ["Status", "Payer", "Notice", "Deadline", "Next call"],
    coverPathway: [
      ["1", "Status", "What is the official status?"],
      ["2", "Payer", "Which coverage path applies?"],
      ["3", "Notice", "What written document explains it?"],
      ["4", "Deadline", "What changes today or this week?"],
      ["5", "Next call", "Who can verify in writing?"],
    ],
    pageThemeMap: {
      ...defaultPageThemeMap,
      2: { eyebrow: "Avoid costly assumptions", icon: "!", theme: "warning", cues: ["Separate the issues", "Ask for proof", "Confirm deadlines"] },
      3: { eyebrow: "Status check", icon: "H", theme: "status", cues: ["Ask current status", "Confirm start time", "Save notices"] },
      4: { eyebrow: "Rehab review", icon: "R", theme: "rehab", cues: ["Document skill", "Confirm facility", "Track appeal deadline"] },
      5: { eyebrow: "Home support", icon: "H", theme: "home", cues: ["Name the service", "Confirm agency", "Ask payment path"] },
      6: { eyebrow: "Equipment and authorization", icon: "D", theme: "coverage", cues: ["Check order", "Confirm supplier", "Track authorization"] },
      7: { eyebrow: "Medicare vs Medicaid", icon: "M", theme: "program", cues: ["Sort care type", "Check state rules", "Ask before private pay"] },
      8: { eyebrow: "Bill check", icon: "B", theme: "billing", cues: ["Match documents", "Ask why owed", "Correct or appeal"] },
      9: { eyebrow: "Plan decisions", icon: "A", theme: "warning", cues: ["Check network", "Track authorization", "Get appeal path"] },
      10: { eyebrow: "Call scripts", icon: "?", theme: "scripts", cues: ["Use short questions", "Write it down", "Escalate carefully"] },
    },
    requiredSourceCues: ["Medicare.gov", "Medicaid.gov", "CMS", "HealthCare.gov", "SHIP", "official source map", "full guide"],
  },
  "medicare-sign-up-quick-guide": {
    id: "medicare-sign-up-quick-guide",
    title: "The Turning 65 Medicare Sign-Up Quick Guide",
    subtitle: "A calm checklist for checking Medicare timing, sign-up paths, employer coverage, and next questions before enrolling.",
    slug: "medicare-sign-up-quick-guide",
    sourceManuscriptPath: docsPath("medicare-sign-up-quick-guide-pre-pdf-manuscript.md"),
    outputHtmlPath: generatedPath("medicare-sign-up-quick-guide", "medicare-sign-up-quick-guide-preflight.html"),
    outputPdfPath: generatedPath("medicare-sign-up-quick-guide", "medicare-sign-up-quick-guide-preflight.pdf"),
    publicPdfPath: null,
    publicReleaseAllowed: false,
    routeMetadata: {
      hubPath: "/guides",
      landingPath: null,
      publicPdfPath: null,
      status: "preflight-only",
    },
    coverEyebrow: "Preflight enrollment handout",
    coverChips: ["Timing", "Parts", "Employer", "Forms", "Next call"],
    coverPathway: [
      ["1", "Timing", "Which enrollment window applies?"],
      ["2", "Coverage", "What coverage do you have today?"],
      ["3", "Parts", "Which Medicare parts are in scope?"],
      ["4", "Forms", "Which official path or form applies?"],
      ["5", "Help", "Who can verify before you enroll?"],
    ],
    pageThemeMap: defaultPageThemeMap,
    requiredSourceCues: ["Medicare.gov", "Social Security", "CMS", "SHIP"],
  },
  "medicaid-application-quick-guide": {
    id: "medicaid-application-quick-guide",
    title: "The Medicaid Application Quick Guide",
    subtitle: "A state-cautious checklist for applying, responding to document requests, and preserving notices and deadlines.",
    slug: "medicaid-application-quick-guide",
    sourceManuscriptPath: docsPath("medicaid-application-quick-guide-pre-pdf-manuscript.md"),
    outputHtmlPath: generatedPath("medicaid-application-quick-guide", "medicaid-application-quick-guide-preflight.html"),
    outputPdfPath: generatedPath("medicaid-application-quick-guide", "medicaid-application-quick-guide-preflight.pdf"),
    publicPdfPath: null,
    publicReleaseAllowed: false,
    routeMetadata: {
      hubPath: "/guides",
      landingPath: null,
      publicPdfPath: null,
      status: "preflight-only",
    },
    coverEyebrow: "Preflight application handout",
    coverChips: ["Apply", "State rules", "Documents", "Notices", "Appeal"],
    coverPathway: [
      ["1", "Where", "Which application path applies?"],
      ["2", "Category", "Which state eligibility category fits?"],
      ["3", "Proof", "Which documents are requested?"],
      ["4", "Notice", "What deadline is in writing?"],
      ["5", "Next step", "Who can verify or help?"],
    ],
    pageThemeMap: defaultPageThemeMap,
    requiredSourceCues: ["Medicaid.gov", "HealthCare.gov", "Medicare.gov", "state Medicaid agency"],
  },
};

export const allQuickGuideIds = Object.keys(quickGuideDefinitions);

export const getQuickGuideDefinition = (id) => {
  const definition = quickGuideDefinitions[id];
  if (!definition) {
    throw new Error(`Unknown quick guide id "${id}". Known ids: ${allQuickGuideIds.join(", ")}`);
  }

  return definition;
};

export const resolveQuickGuideIds = (args = []) => {
  if (args.length === 0) return ["hospital-discharge-medicare-quick-guide"];
  if (args.includes("all") || args.includes("--all")) return allQuickGuideIds;
  return args.map((id) => getQuickGuideDefinition(id).id);
};
