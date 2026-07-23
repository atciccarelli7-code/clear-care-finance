import { ADDITIONAL_DIAGNOSIS_GUIDES } from "@/data/conditionGuideCatalog";
import { resolveSeoMeta, type SeoJsonLd, type SeoRouteMeta } from "@/lib/seoRegistry";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};

const diagnosisGuideOverrides = Object.fromEntries(
  ADDITIONAL_DIAGNOSIS_GUIDES.map((guide) => [
    guide.route,
    {
      title: guide.shortTitle,
      description: `${guide.scope} Source checked and nurse reviewed.`,
      robots: "index, follow, max-image-preview:large",
    },
  ]),
) as Record<string, Pick<SeoRouteMeta, "title" | "description" | "robots">>;

const overrides: Record<string, Pick<SeoRouteMeta, "title" | "description" | "robots">> = {
  "/": {
    title: "Financial Clarity from Retirement to Healthcare Costs",
    description: "Plain-English guides and calculators for retirement, investing, workplace benefits, insurance, medical bills, Medicare, and Medicaid—with an RN's healthcare perspective.",
  },
  "/start-here": {
    title: "Financial Navigator: Build Your Next Money Action Plan",
    description: "Build one private, prioritized action plan for cash, debt, retirement, workplace benefits, healthcare costs, Medicare, Medicaid, or a healthcare-career decision.",
  },
  "/build-wealth": {
    title: "Financial Independence, Retirement, and Investing",
    description: "Build a practical plan for cash, debt, retirement contributions, diversified investing, and long-term financial independence.",
  },
  "/open-enrollment": {
    title: "Open Enrollment and Workplace Benefits Guide",
    description: "Compare premiums, deductibles, networks, prescriptions, HSAs, FSAs, supplemental benefits, retirement options, and paycheck impact before choosing benefits.",
  },
  "/tools": {
    title: "Financial Calculators, Checklists, and Decision Tools",
    description: "Choose a guided financial starting point or browse calculators, checklists, comparisons, and guides for benefits, medical bills, Medicare, student loans, retirement, and everyday money.",
  },
  "/articles": {
    title: "Financial Education Articles",
    description: "Browse source-backed articles about retirement, investing, credit, workplace benefits, insurance, medical bills, Medicare, Medicaid, and healthcare finances.",
  },
  "/topics": {
    title: "Financial and Healthcare Topic Guides",
    description: "Explore organized guides for retirement accounts, workplace benefits, health insurance, medical costs, Medicare, Medicaid, and hospital economics.",
  },
  "/newsletter": {
    title: "Community Acquired Finance Newsletter",
    description: "Get practical, low-frequency updates on retirement, workplace benefits, insurance, medical bills, Medicare, Medicaid, and new financial tools.",
  },
  "/insurance/medical-bill-review-toolkit": {
    title: "Medical Bill Response System",
    description: "Identify an EOB, medical bill, denial, financial-assistance form, or collection notice and follow an RN-led, privacy-minimized review sequence before paying.",
  },
  "/patients-families/diagnosis-explained/heart-failure": {
    title: "Heart Failure, Explained",
    description: "A structured, plain-English, nurse-reviewed heart-failure guide covering types, causes, tests, treatment goals, medication purpose, home monitoring, warning signs, and care-team questions.",
    robots: "index, follow, max-image-preview:large",
  },
  "/patients-families/diagnosis-explained/copd": {
    title: "COPD, Explained",
    description: "A structured, plain-English, nurse-reviewed COPD guide covering spirometry, lung-disease patterns, inhaler purpose and technique, pulmonary rehabilitation, oxygen, flare-ups, warning signs, and care-team questions.",
    robots: "index, follow, max-image-preview:large",
  },
  ...diagnosisGuideOverrides,
};

const benefitsCommandCenterMeta: SeoRouteMeta = {
  title: "Benefits Command Center: Compare Pay and Workplace Benefits",
  description: "Preview a sample Benefits Receipt, then build and compare pay, health plans, retirement benefits, PTO, employer contributions, vesting, and hidden benefits privately.",
  canonicalPath: "/tools/benefits-command-center",
  robots: "index, follow, max-image-preview:large",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: "Benefits Command Center", item: `${SITE_URL}/tools/benefits-command-center` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Benefits Command Center: Compare Pay and Workplace Benefits",
      description: "Preview a sample Benefits Receipt, then build and compare pay, health plans, retirement benefits, PTO, employer contributions, vesting, and hidden benefits privately.",
      url: `${SITE_URL}/tools/benefits-command-center`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ],
};

const updateJsonLd = (jsonLd: SeoJsonLd[] | undefined, title: string, description: string) =>
  jsonLd?.map((item) => {
    const type = item["@type"];
    if (type === "WebSite") return { ...item, description: "Plain-English financial education for everyone, with specialized clarity around healthcare costs, insurance, Medicare, and Medicaid." };
    if (type === "BreadcrumbList" && Array.isArray(item.itemListElement)) {
      const entries = item.itemListElement as Array<Record<string, unknown>>;
      return {
        ...item,
        itemListElement: entries.map((entry, index) =>
          index === entries.length - 1 ? { ...entry, name: title } : entry,
        ),
      };
    }
    if (type === "CollectionPage" || type === "WebPage" || type === "WebApplication") return { ...item, name: title, description };
    return item;
  });

export const resolveSiteSeoMeta = (pathname: string): SeoRouteMeta => {
  const path = normalizePath(pathname);
  if (path === benefitsCommandCenterMeta.canonicalPath) return benefitsCommandCenterMeta;
  const base = resolveSeoMeta(path);
  const override = overrides[path];
  if (!override) return base;
  return { ...base, ...override, jsonLd: updateJsonLd(base.jsonLd, override.title, override.description) };
};
