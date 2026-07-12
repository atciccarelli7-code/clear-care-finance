import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = async (relativePath) => readFile(path.join(root, relativePath), "utf8");
const write = async (relativePath, content) => writeFile(path.join(root, relativePath), content, "utf8");
const replaceOnce = (content, search, replacement, label) => {
  if (content.includes(replacement)) return content;
  if (!content.includes(search)) throw new Error(`Could not patch ${label}`);
  return content.replace(search, replacement);
};

// Article metadata model.
{
  const file = "src/data/articles.ts";
  let content = await read(file);
  content = replaceOnce(content,
`  sources: Source[];
  description?: string;             // backward-compat for cards`,
`  sources: Source[];
  publishedAt?: string;
  lastReviewedAt?: string;
  rulesEffectiveAt?: string;
  nextReviewAt?: string;
  timeSensitive?: boolean;
  reviewScope?: string;
  updateNote?: string;
  description?: string;             // backward-compat for cards`,
"article freshness fields");
  content = replaceOnce(content,
`    readTime: "6 min read",
    promise: "Understand the difference between Original Medicare, Medicare Advantage, Part D, and Medigap — in plain English.",`,
`    readTime: "6 min read",
    publishedAt: "2026-06-01",
    lastReviewedAt: "2026-07-12",
    rulesEffectiveAt: "2026-01-01",
    nextReviewAt: "2026-10-01",
    timeSensitive: true,
    reviewScope: "2026 Medicare structure, enrollment cautions, cost-sharing distinctions, and official source links.",
    promise: "Understand the difference between Original Medicare, Medicare Advantage, Part D, and Medigap — in plain English.",`,
"Medicare article freshness metadata");
  await write(file, content);
}

// Shared article freshness display.
{
  const file = "src/pages/ArticlePage.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`import { NextStepCards, type NextStepCard } from "@/components/shared/NextStepCards";`,
`import { NextStepCards, type NextStepCard } from "@/components/shared/NextStepCards";
import { ContentFreshness } from "@/components/shared/ContentFreshness";`,
"ArticlePage freshness import");
  content = replaceOnce(content,
`      <article className="container max-w-3xl py-8 md:py-16 space-y-8 md:space-y-12">
        <Section icon={Users} title="Who this is for">`,
`      <article className="container max-w-3xl py-8 md:py-16 space-y-8 md:space-y-12">
        <ContentFreshness
          publishedAt={article.publishedAt}
          lastReviewedAt={article.lastReviewedAt}
          rulesEffectiveAt={article.rulesEffectiveAt}
          nextReviewAt={article.nextReviewAt}
          timeSensitive={article.timeSensitive}
          reviewScope={article.reviewScope}
          updateNote={article.updateNote}
        />
        <Section icon={Users} title="Who this is for">`,
"ArticlePage freshness component");
  await write(file, content);
}

// Route-level freshness for major time-sensitive hubs and tools.
{
  const file = "src/components/layout/Layout.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`import { PrivacyChoices } from "@/components/shared/PrivacyChoices";`,
`import { PrivacyChoices } from "@/components/shared/PrivacyChoices";
import { RouteFreshness } from "@/components/shared/RouteFreshness";`,
"Layout freshness import");
  content = replaceOnce(content,
`      <SiteTrustBar />
      <main id="main-content"`,
`      <SiteTrustBar />
      <RouteFreshness />
      <main id="main-content"`,
"Layout freshness render");
  await write(file, content);
}

// Application routes and preloaders.
{
  const file = "src/App.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`const loadMedicareCareCostHub = () => import("./pages/MedicareCareCostHub.tsx");`,
`const loadMedicareCareCostHub = () => import("./pages/MedicareCareCostHub.tsx");
const loadTurning65MedicarePage = () => import("./pages/Turning65MedicarePage.tsx");
const loadHealthcareCareerDecisionCenterPage = () => import("./pages/HealthcareCareerDecisionCenterPage.tsx");`,
"App loaders");
  content = replaceOnce(content,
`const MedicareCareCostHub = lazy(loadMedicareCareCostHub);`,
`const MedicareCareCostHub = lazy(loadMedicareCareCostHub);
const Turning65MedicarePage = lazy(loadTurning65MedicarePage);
const HealthcareCareerDecisionCenterPage = lazy(loadHealthcareCareerDecisionCenterPage);`,
"App lazy pages");
  content = replaceOnce(content,
`  if (pathname === "/medicare-care-costs") return loadMedicareCareCostHub;`,
`  if (pathname === "/medicare-care-costs") return loadMedicareCareCostHub;
  if (pathname === "/medicare-care-costs/turning-65") return loadTurning65MedicarePage;
  if (pathname === "/healthcare-workers/career-decisions") return loadHealthcareCareerDecisionCenterPage;`,
"App route preloader");
  content = replaceOnce(content,
`            <Route path="/build-wealth" element={<BuildWealthHub />} />`,
`            <Route path="/build-wealth" element={<BuildWealthHub />} />
            <Route path="/healthcare-workers/career-decisions" element={<HealthcareCareerDecisionCenterPage />} />`,
"career route");
  content = replaceOnce(content,
`            <Route path="/medicare-care-costs" element={<MedicareCareCostHub />} />`,
`            <Route path="/medicare-care-costs" element={<MedicareCareCostHub />} />
            <Route path="/medicare-care-costs/turning-65" element={<Turning65MedicarePage />} />`,
"turning 65 route");
  await write(file, content);
}

// SEO registry and generated sitemap inclusion.
{
  const file = "src/lib/seoRegistry.ts";
  let content = await read(file);
  content = replaceOnce(content,
`  "/medicare-care-costs": {
    title: "Medicare, Medicaid, and Long-Term Care Cost Hub",
    description: "Understand Medicare, Medicaid, Medigap, Medicare Advantage, cost exposure, skilled care, custodial care, and long-term care planning.",
    kind: "tool",
  },`,
`  "/medicare-care-costs": {
    title: "Medicare, Medicaid, and Long-Term Care Cost Hub",
    description: "Understand Medicare, Medicaid, Medigap, Medicare Advantage, cost exposure, skilled care, custodial care, and long-term care planning.",
    kind: "tool",
  },
  "/medicare-care-costs/turning-65": {
    title: "Turning 65 Medicare Enrollment Pathway",
    description: "Build a qualified Medicare enrollment timeline using current coverage, active employment, employer size, HSA, prescription coverage, spouse coverage, and official next steps.",
    kind: "tool",
  },`,
"turning 65 SEO entry");
  content = replaceOnce(content,
`  "/healthcare-workers/paycheck-tools": {
    title: "Healthcare Worker Paycheck Tools",
    description: "Use RN-focused paycheck, overtime, retirement contribution, and savings tools built for healthcare workers.",
    kind: "tool",
  },`,
`  "/healthcare-workers/paycheck-tools": {
    title: "Healthcare Worker Paycheck Tools",
    description: "Use RN-focused paycheck, overtime, retirement contribution, and savings tools built for healthcare workers.",
    kind: "tool",
  },
  "/healthcare-workers/career-decisions": {
    title: "Healthcare Career Decision Center",
    description: "Compare healthcare roles using total compensation, schedule, call, travel, career trajectory, transition risks, negotiation questions, and actions before resigning.",
    kind: "tool",
  },`,
"career SEO entry");
  await write(file, content);
}

// Audience-first navigation.
{
  const file = "src/components/layout/Header.tsx";
  let content = await read(file);
  content = content.replace(new RegExp("const nav = \\[\\s\\S]*?\\];\\n\\nconst secondaryNav = \\[\\s\\S]*?\\];"), `const nav = [
  { to: "/start-here", label: "Start Here" },
  { to: "/healthcare-workers", label: "Healthcare Workers" },
  { to: "/patients-families", label: "Patients & Caregivers" },
  { to: "/build-wealth", label: "Money & Retirement" },
  { to: "/insurance", label: "Benefits & Insurance" },
  { to: "/medicare-care-costs", label: "Medicare & Medicaid" },
];

const secondaryNav = [
  { to: "/tools", label: "Tools" },
  { to: "/articles", label: "Articles" },
  { to: "/healthcare-workers/career-decisions", label: "Career Decisions" },
  { to: "/guides", label: "Quick Guides" },
  { to: "/open-enrollment", label: "Open Enrollment" },
  { to: "/student-loans", label: "Student Loans" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
];`);
  await write(file, content);
}

{
  const file = "src/components/layout/MobileBottomNav.tsx";
  let content = await read(file);
  content = content.replace(`import { BookOpen, Calculator, FileText, HeartPulse, type LucideIcon } from "lucide-react";`, `import { Calculator, Compass, HeartPulse, ShieldCheck, type LucideIcon } from "lucide-react";`);
  content = content.replace(/const items: MobileNavItem\[] = \[[\s\S]*?\];/, `const items: MobileNavItem[] = [
  { to: "/start-here", label: "Start", icon: Compass },
  { to: "/tools", label: "Tools", icon: Calculator },
  { to: "/insurance", label: "Benefits", icon: ShieldCheck },
  { to: "/medicare-care-costs", label: "Medicare", icon: HeartPulse },
];`);
  await write(file, content);
}

// Canonical pathway entry from the Medicare hub.
{
  const file = "src/pages/MedicareCareCostHub.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`        <Button asChild variant="outline" size="lg">
          <a href="#caregiver-checklist">Open caregiver checklist</a>
        </Button>`,
`        <Button asChild variant="outline" size="lg">
          <Link to="/medicare-care-costs/turning-65">Turning 65 timeline</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#caregiver-checklist">Open caregiver checklist</a>
        </Button>`,
"Medicare hub turning 65 CTA");
  await write(file, content);
}

// Integrate shared case and task workspaces into existing canonical routes.
{
  const file = "src/pages/MedicalBillReviewToolkitPage.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`import { PageHero } from "@/components/shared/PageHero";`,
`import { PageHero } from "@/components/shared/PageHero";
import { MedicalBillCaseDashboard } from "@/components/medical-bill-case-dashboard";`,
"medical bill dashboard import");
  content = replaceOnce(content, `      </main>`, `        <MedicalBillCaseDashboard />
      </main>`, "medical bill dashboard render");
  await write(file, content);
}

{
  const file = "src/pages/HospitalDischargeCoveragePage.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`import { PageHero } from "@/components/shared/PageHero";`,
`import { PageHero } from "@/components/shared/PageHero";
import { DischargeCommandCenter } from "@/components/discharge-command-center";`,
"discharge command center import");
  content = replaceOnce(content, `      </main>`, `        <DischargeCommandCenter />
      </main>`, "discharge command center render");
  await write(file, content);
}

{
  const file = "src/pages/StudentLoans.tsx";
  let content = await read(file);
  content = replaceOnce(content,
`import CalcLoanPayment from "@/components/calculators/LoanPayment";`,
`import CalcLoanPayment from "@/components/calculators/LoanPayment";
import { StudentLoanPriorityBridge } from "@/components/student-loan-priority-bridge";`,
"student-loan bridge import");
  content = replaceOnce(content,
`      <section className="container pb-10 md:pb-14">`,
`      <StudentLoanPriorityBridge />

      <section className="container pb-10 md:pb-14">`,
"student-loan bridge render");
  await write(file, content);
}

// Clarify that the existing Benefits Command Center is the open-enrollment receipt workspace.
{
  const file = "src/components/benefits/BenefitsCommandCenterWorkspace.tsx";
  let content = await read(file);
  content = content.replace(`{ id: "open_enrollment", label: "Complete open enrollment", description: "Compare plan economics and organize election questions before the deadline." }`, `{ id: "open_enrollment", label: "Complete open enrollment", description: "Compare plan economics, verify elections, and produce a printable Benefits Election Receipt before the deadline." }`);
  await write(file, content);
}

// Production build and test gates.
{
  const file = "package.json";
  const pkg = JSON.parse(await read(file));
  pkg.scripts["content:freshness-check"] = "node scripts/check-content-freshness.mjs";
  if (!pkg.scripts.build.includes("check-content-freshness.mjs")) pkg.scripts.build = pkg.scripts.build.replace("node scripts/check-publication-readiness.mjs &&", "node scripts/check-publication-readiness.mjs && node scripts/check-content-freshness.mjs &&");
  if (!pkg.scripts.test.includes("content:freshness-check")) pkg.scripts.test = pkg.scripts.test.replace("npm run trust:check &&", "npm run trust:check && npm run content:freshness-check &&");
  await write(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

console.log("Decision journey implementation patched routes, navigation, content metadata, canonical integrations, and build checks.");
