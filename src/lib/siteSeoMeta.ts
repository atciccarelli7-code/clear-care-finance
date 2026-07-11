import { resolveSeoMeta, type SeoJsonLd, type SeoRouteMeta } from "@/lib/seoRegistry";

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

    if (type === "CollectionPage" || type === "WebPage") {
      return { ...item, name: title, description };
    }

    return item;
  });

export const resolveSiteSeoMeta = (pathname: string): SeoRouteMeta => {
  const base = resolveSeoMeta(pathname);
  const override = overrides[normalizePath(pathname)];
  if (!override) return base;

  return {
    ...base,
    ...override,
    jsonLd: updateJsonLd(base.jsonLd, override.title, override.description),
  };
};
