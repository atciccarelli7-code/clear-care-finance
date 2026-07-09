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
    subtitle: "A plain-English printable guide for families trying to understand discharge, rehab, home care, long-term care, plan decisions, and confusing bills.",
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
    coverEyebrow: "Printable article-style guide",
    coverChips: ["Status", "Payer", "Notice", "Deadline", "Next call"],
    coverPathway: [
      ["1", "Plan", "What is being recommended?"],
      ["2", "Payer", "Who is expected to pay?"],
      ["3", "Paper", "What document explains it?"],
      ["4", "Deadline", "What changes soon?"],
      ["5", "Next call", "Who can verify it?"],
    ],
    pageThemeMap: {
      ...defaultPageThemeMap,
      1: { eyebrow: "Before discharge", icon: "1", theme: "start", cues: ["Plan", "Payer", "Paper"] },
      2: { eyebrow: "Hospital status", icon: "2", theme: "status", cues: ["Status", "Timing", "Notice"] },
      3: { eyebrow: "Rehab or SNF", icon: "3", theme: "rehab", cues: ["Skilled need", "Facility", "Authorization"] },
      4: { eyebrow: "Home health", icon: "4", theme: "home", cues: ["Service", "Agency", "Safety"] },
      5: { eyebrow: "Equipment and medication", icon: "5", theme: "coverage", cues: ["Order", "Supplier", "Timing"] },
      6: { eyebrow: "Medicare vs Medicaid", icon: "6", theme: "program", cues: ["Care type", "Program", "State rules"] },
      7: { eyebrow: "Plan decision", icon: "7", theme: "warning", cues: ["Decision", "Notice", "Appeal"] },
      8: { eyebrow: "Medical bills", icon: "8", theme: "billing", cues: ["Bill", "MSN/EOB", "Review"] },
      9: { eyebrow: "Paper trail", icon: "9", theme: "pathway", cues: ["Save", "Log", "Deadline"] },
      10: { eyebrow: "Calls and scripts", icon: "10", theme: "scripts", cues: ["Ask", "Record", "Escalate"] },
    },
    requiredSourceCues: ["Medicare.gov", "Medicaid.gov", "CMS", "HealthCare.gov", "SHIP", "official source map", "full guide"],
  },
  "medicare-sign-up-quick-guide": {
    id: "medicare-sign-up-quick-guide",
    title: "The Turning 65 Medicare Sign-Up Quick Guide",
    subtitle: "A plain-English preflight guide for checking Medicare timing, Part A/B enrollment, employer coverage, drug coverage, plan choices, and what proof to keep.",
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
    coverEyebrow: "Preflight article-style guide",
    coverChips: ["Timing", "Parts", "Employer", "Forms", "Next call"],
    coverPathway: [
      ["1", "Timing", "Do I sign up now or wait?"],
      ["2", "Coverage", "What coverage do I have today?"],
      ["3", "Parts", "Which Medicare parts are in scope?"],
      ["4", "Proof", "What documents should I keep?"],
      ["5", "Next call", "Who can verify it?"],
    ],
    pageThemeMap: defaultPageThemeMap,
    requiredSourceCues: ["Medicare.gov", "Social Security", "CMS", "SHIP"],
  },
  "medicaid-application-quick-guide": {
    id: "medicaid-application-quick-guide",
    title: "The Medicaid Application Quick Guide",
    subtitle: "A state-cautious preflight guide for finding the right application path, gathering proof, tracking notices, and asking better Medicaid questions.",
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
    coverEyebrow: "Preflight article-style guide",
    coverChips: ["Apply", "State rules", "Documents", "Notices", "Appeal"],
    coverPathway: [
      ["1", "State", "Which agency controls this?"],
      ["2", "Category", "Which Medicaid path applies?"],
      ["3", "Proof", "What documents are needed?"],
      ["4", "Notice", "What deadline is in writing?"],
      ["5", "Next call", "Who can verify or help?"],
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
