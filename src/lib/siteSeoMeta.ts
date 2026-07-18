import { resolveSeoMeta, type SeoJsonLd, type SeoRouteMeta } from "@/lib/seoRegistry";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};

const overrides: Record<string, Pick<SeoRouteMeta, "title" | "description">> = {
  "/": {
    title: "Financial Clarity from Retirement to Healthcare Costs",
    description:
      "Plain-English guides and calculators for retirement, investing, workplace benefits, insurance, medical bills, Medicare, and Medicaid—with an RN's healthcare perspective.",
  },
  "/start-here": {
    title: "Financial Navigator and Financial Foundation Checkup",
    description:
      "Build a private financial action plan, measure cash resilience, debt, retirement capture, savings consistency, and protection, and track progress over time.",
  },
  "/build-wealth": {
    title: "Financial Independence, Retirement, and Investing",
    description:
      "Build a practical plan for cash, debt, retirement contributions, diversified investing, and long-term financial independence.",
  },
  "/open-enrollment": {
    title: "Open Enrollment and Workplace Benefits Guide",
    description:
      "Compare premiums, deductibles, networks, prescriptions, HSAs, FSAs, supplemental benefits, retirement options, and paycheck impact before choosing benefits.",
  },
  "/tools": {
    title: "Financial Calculators and Decision Tools",
    description:
      "Use free calculators and guided tools for retirement contributions, workplace benefits, insurance costs, medical bills, Medicare, and hospital discharge decisions.",
  },
  "/articles": {
    title: "Financial Education Articles",
    description:
      "Browse source-backed articles about retirement, investing, credit, workplace benefits, insurance, medical bills, Medicare, Medicaid, and healthcare finances.",
  },
  "/topics": {
    title: "Financial and Healthcare Topic Guides",
    description:
      "Explore organized guides for retirement accounts, workplace benefits, health insurance, medical costs, Medicare, Medicaid, and hospital economics.",
  },
  "/newsletter": {
    title: "Community Acquired Finance Newsletter",
    description:
      "Get practical, low-frequency updates on retirement, workplace benefits, insurance, medical bills, Medicare, Medicaid, and new financial tools.",
  },
};

const benefitsCommandCenterMeta: SeoRouteMeta = {
  title: "Benefits Command Center: Compare Pay and Workplace Benefits",
  description:
    "Preview a sample Benefits Receipt, then build and compare pay, health plans, retirement benefits, PTO, employer contributions, vesting, and hidden benefits privately.",
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
      description:
        "Preview a sample Benefits Receipt, then build and compare pay, health plans, retirement benefits, PTO, employer contributions, vesting, and hidden benefits privately.",
      url: `${SITE_URL}/tools/benefits-command-center`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ],
};

const patientEducationSystemsMeta: SeoRouteMeta = {
  title: "Hospital Patient Education Systems and Discharge Guides",
  description:
    "Review CAF Patient Education Systems: an RN-designed, clinically governed hospital-to-home education product with patient guides, teach-back, operational continuity, institutional customization, and measurable pilots.",
  canonicalPath: "/for-organizations/patient-education-systems",
  robots: "index, follow, max-image-preview:large",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "For Organizations", item: `${SITE_URL}/for-organizations` },
        { "@type": "ListItem", position: 3, name: "Patient Education Systems", item: `${SITE_URL}/for-organizations/patient-education-systems` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "CAF Patient Education Systems",
      description:
        "An RN-designed, clinically governed hospital-to-home education product with patient guides, teach-back, operational continuity, institutional customization, and measurable pilots.",
      url: `${SITE_URL}/for-organizations/patient-education-systems`,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ],
};

const updateJsonLd = (jsonLd: SeoJsonLd[] | undefined, title: string, description: string) =>
  jsonLd?.map((item) => {
    const type = item["@type"];
    if (type === "WebSite") {
      return {
        ...item,
        description:
          "Plain-English financial education for everyone, with specialized clarity around healthcare costs, insurance, Medicare, and Medicaid.",
      };
    }

    if (type === "CollectionPage" || type === "WebPage" || type === "WebApplication") {
      return { ...item, name: title, description };
    }

    return item;
  });

export const resolveSiteSeoMeta = (pathname: string): SeoRouteMeta => {
  const path = normalizePath(pathname);
  if (path === benefitsCommandCenterMeta.canonicalPath) return benefitsCommandCenterMeta;
  if (path === patientEducationSystemsMeta.canonicalPath) return patientEducationSystemsMeta;

  const base = resolveSeoMeta(path);
  const override = overrides[path];
  if (!override) return base;

  return {
    ...base,
    ...override,
    jsonLd: updateJsonLd(base.jsonLd, override.title, override.description),
  };
};
