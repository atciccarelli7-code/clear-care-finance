import { ADDITIONAL_DIAGNOSIS_GUIDES } from "@/data/conditionGuideCatalog";
import { resolveSeoMeta, type SeoJsonLd, type SeoRouteMeta } from "@/lib/seoRegistry";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const normalizePath = (pathname: string) => pathname.replace(/[?#].*|\/+$/g, "") || "/";
const noindex = "noindex, nofollow, noarchive";
const indexed = "index, follow, max-image-preview:large";
const diagnosisPrefix = "/patients-families/diagnosis-explained/";

export const BENEFITS_DECISION_OFFER_PATH = "/products/healthcare-worker-benefits-decision-system" as const;

export const BENEFITS_DECISION_OFFER_META: SeoRouteMeta = {
  title: "Healthcare Worker Benefits Decision System Early Access",
  description: "Review the proposed $29 one-time Open Enrollment Workspace and join a no-charge, price-qualified early-access test. Free CAF education and public tools remain free.",
  canonicalPath: BENEFITS_DECISION_OFFER_PATH,
  robots: noindex,
  jsonLd: [],
};

const diagnosisGuideOverrides = Object.fromEntries(
  ADDITIONAL_DIAGNOSIS_GUIDES.map((guide) => [
    guide.route,
    {
      title: guide.shortTitle,
      description: `${guide.scope} Source checked and nurse reviewed.`,
      robots: indexed,
    },
  ]),
) as Record<string, Pick<SeoRouteMeta, "title" | "description" | "robots">>;

const overrides: Record<string, Pick<SeoRouteMeta, "title" | "description" | "robots">> = {
  "/": {
    title: "Healthcare Financial Education and Decision Support",
    description: "Free RN-led guides, calculators, and checklists for healthcare workers, patients, and caregivers, plus a healthcare-worker benefits decision system in development.",
  },
  "/start-here": {
    title: "Financial Navigator: Build Your Next Money Action Plan",
    description: "Build one private, prioritized action plan for cash, debt, retirement, workplace benefits, healthcare costs, Medicare, Medicaid, or a healthcare-career decision.",
  },
  "/healthcare-workers": {
    title: "Healthcare Worker Benefits, Pay, and Financial Decisions",
    description: "Use free healthcare-worker benefits, compensation, retirement, paycheck, and open-enrollment resources, and preview CAF's planned Benefits Decision System.",
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
    title: "Free Financial Calculators, Checklists, and Decision Tools",
    description: "Browse free calculators, checklists, comparisons, and guides for benefits, medical bills, Medicare, student loans, retirement, and everyday money.",
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
  "/sign-in": {
    title: "Secure Account Sign In",
    description: "Sign in to Community Acquired Finance account-based applications.",
    robots: noindex,
  },
  "/account": {
    title: "Account",
    description: "Manage secure Community Acquired Finance account access.",
    robots: noindex,
  },
  "/access-processing": {
    title: "Access Processing",
    description: "Check server-verified product access status.",
    robots: noindex,
  },
  [`${diagnosisPrefix}heart-failure`]: {
    title: "Heart Failure, Explained",
    description: "A structured, plain-English, nurse-reviewed heart-failure guide covering types, causes, tests, treatment goals, medication purpose, home monitoring, warning signs, and care-team questions.",
    robots: indexed,
  },
  [`${diagnosisPrefix}copd`]: {
    title: "COPD, Explained",
    description: "A structured, plain-English, nurse-reviewed COPD guide covering spirometry, lung-disease patterns, inhaler purpose and technique, pulmonary rehabilitation, oxygen, flare-ups, warning signs, and care-team questions.",
    robots: indexed,
  },
  ...diagnosisGuideOverrides,
};

const benefitsCommandCenterMeta: SeoRouteMeta = {
  title: "Free Workplace Benefits Comparison",
  description: "Build or preview a free Benefits Receipt that compares pay, health-plan exposure, retirement benefits, paid leave, employer contributions, vesting, and hidden benefits.",
  canonicalPath: "/tools/benefits-command-center",
  robots: indexed,
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: "Free Workplace Benefits Comparison", item: `${SITE_URL}/tools/benefits-command-center` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Workplace Benefits Comparison",
      description: "Build or preview a free Benefits Receipt that compares pay, health-plan exposure, retirement benefits, paid leave, employer contributions, vesting, and hidden benefits.",
      url: `${SITE_URL}/tools/benefits-command-center`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ],
};

const diagnosisGuideJsonLd = (path: string, title: string, description: string): SeoJsonLd[] => [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Patients & Caregivers", item: `${SITE_URL}/patients-families` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}${path}` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: title,
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: `${SITE_URL}${path}`,
    audience: { "@type": "Patient" },
    author: {
      "@type": "Person",
      name: "Andrew Ciccarelli, BSN, RN",
      url: `${SITE_URL}/about`,
      jobTitle: "Registered Nurse",
    },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  },
];

const updateJsonLd = (jsonLd: SeoJsonLd[] | undefined, title: string, description: string) =>
  jsonLd?.map((item) => {
    const type = item["@type"];
    if (type === "WebSite") return { ...item, description: "RN-led healthcare financial education and decision support for healthcare workers, patients, and caregivers." };
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
  if (path === BENEFITS_DECISION_OFFER_PATH) return BENEFITS_DECISION_OFFER_META;
  if (path === "/app" || path.startsWith("/app/")) {
    return {
      title: "Benefits Decision Application",
      description: "Private account-based decision workspace.",
      canonicalPath: path,
      robots: noindex,
      jsonLd: [],
    };
  }
  if (path === benefitsCommandCenterMeta.canonicalPath) return benefitsCommandCenterMeta;
  const base = resolveSeoMeta(path);
  const override = overrides[path];
  if (!override) return base;
  const isDiagnosisGuide = path.startsWith(diagnosisPrefix);
  return {
    ...base,
    ...override,
    jsonLd: isDiagnosisGuide
      ? diagnosisGuideJsonLd(path, override.title, override.description)
      : updateJsonLd(base.jsonLd, override.title, override.description),
  };
};
