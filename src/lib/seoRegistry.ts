import { ALL_ARTICLES } from "@/data/allArticles";
import { TOPICS } from "@/data/topics";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export type SeoJsonLd = Record<string, unknown>;

export type SeoRouteMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
  author?: string;
  robots?: string;
  jsonLd?: SeoJsonLd[];
};

type StaticPageMeta = {
  title: string;
  description: string;
  kind?: "page" | "tool" | "collection";
};

export const AUTHOR_NAME = "Andrew Ciccarelli, BSN, RN";
export const AUTHOR_PATH = "/about";

const organizationJsonLd: SeoJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
};

const websiteJsonLd: SeoJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "RN-led, plain-English financial education for healthcare workers, patients, families, and caregivers.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

const STATIC_PAGE_META: Record<string, StaticPageMeta> = {
  "/": {
    title: "Healthcare Money Explained Clearly",
    description: "RN-led guides and calculators for medical bills, insurance, Medicare, Medicaid, workplace benefits, retirement, and healthcare-worker pay.",
    kind: "collection",
  },
  "/start-here": {
    title: "Start Here",
    description: "Choose a practical starting point for medical bills, healthcare-worker finances, insurance benefits, Medicare, Medicaid, or retirement decisions.",
  },
  "/healthcare-workers": {
    title: "Financial Guides for Healthcare Workers",
    description: "Plain-English guidance for healthcare-worker paychecks, benefits, retirement accounts, burnout spending, career flexibility, and wealth building.",
    kind: "collection",
  },
  "/healthcare-workers/paycheck-tools": {
    title: "Healthcare Worker Paycheck Tools",
    description: "Use RN-focused paycheck, overtime, retirement contribution, and savings tools built for healthcare workers.",
    kind: "tool",
  },
  "/healthcare-workers/career-decisions": {
    title: "Healthcare Career Decision Center",
    description: "Compare healthcare roles using total compensation, schedule, call, travel, career trajectory, transition risks, negotiation questions, and actions before resigning.",
    kind: "tool",
  },
  "/build-wealth": {
    title: "Build Wealth as a Healthcare Worker",
    description: "A practical path for healthcare workers to organize cash, debt, retirement contributions, investing, and financial independence.",
    kind: "collection",
  },
  "/patients-families": {
    title: "Medical Cost Guides for Patients and Families",
    description: "Understand medical bills, EOBs, insurance rules, Medicare, Medicaid, discharge costs, and financial assistance in plain English.",
    kind: "collection",
  },
  "/student-loans": {
    title: "Student Loan Guide for Healthcare Workers",
    description: "A practical overview of student loan payment decisions, refinancing tradeoffs, and repayment planning for healthcare workers.",
  },
  "/open-enrollment": {
    title: "Open Enrollment Guide for Healthcare Workers",
    description: "Compare premiums, deductibles, networks, prescriptions, HSAs, FSAs, supplemental benefits, and paycheck impact before choosing coverage.",
    kind: "collection",
  },
  "/insurance": {
    title: "Health Insurance and Workplace Benefits",
    description: "Decision tools and plain-English guides for health insurance, open enrollment, EOBs, medical bills, prior authorization, and workplace benefits.",
    kind: "collection",
  },
  "/insurance/health-insurance-plan-types": {
    title: "Health Insurance Plan Types Explained",
    description: "Compare HMO, PPO, EPO, POS, HDHP, and other health insurance plan structures without insurance jargon.",
  },
  "/insurance/how-to-read-an-sbc": {
    title: "How to Read a Summary of Benefits and Coverage",
    description: "Learn how to read an SBC, including premiums, deductibles, copays, coinsurance, networks, exclusions, and coverage examples.",
  },
  "/insurance/commercial-insurance-comparison": {
    title: "Health Insurance Comparison Framework",
    description: "Compare health plans by total cost, network, prescriptions, prior authorization, and worst-case exposure without insurer rankings or sales pressure.",
  },
  "/medicare-care-costs": {
    title: "Medicare, Medicaid, and Long-Term Care Cost Hub",
    description: "Understand Medicare, Medicaid, Medigap, Medicare Advantage, cost exposure, skilled care, custodial care, and long-term care planning.",
    kind: "tool",
  },
  "/medicare-care-costs/turning-65": {
    title: "Turning 65 Medicare Enrollment Pathway",
    description: "Build a qualified Medicare enrollment timeline using current coverage, active employment, employer size, HSA, prescription coverage, spouse coverage, and official next steps.",
    kind: "tool",
  },
  "/guides": {
    title: "Healthcare Finance Quick Guides",
    description: "Download and use concise, source-backed guides for Medicare, Medicaid, hospital discharge, medical bills, and healthcare financial decisions.",
    kind: "collection",
  },
  "/guides/hospital-discharge-medicare": {
    title: "Hospital Discharge, Medicare, and Long-Term Care Guide",
    description: "A practical guide for patients, caregivers, and healthcare workers navigating rehab, home health, equipment, Medicare, Medicaid, and long-term care after discharge.",
  },
  "/insurance/medicare-advantage": {
    title: "Medicare Advantage Comparison Guide",
    description: "Compare Medicare Advantage with Original Medicare using networks, prior authorization, drug coverage, benefits, and maximum out-of-pocket exposure.",
  },
  "/insurance/prior-authorization-guide": {
    title: "Prior Authorization Guide",
    description: "Understand prior authorization, common delays, documentation needs, denials, appeals, and practical next steps for patients and clinicians.",
  },
  "/insurance/hospital-discharge-coverage": {
    title: "Hospital Discharge Coverage Guide",
    description: "Check coverage questions for rehab, skilled nursing, home health, equipment, transportation, prescriptions, and post-hospital care.",
  },
  "/insurance/hospital-discharge-coverage/printable": {
    title: "Printable Hospital Discharge Coverage Checklist",
    description: "Print a practical checklist for Medicare status, authorization, networks, rehab, home health, equipment, medications, and backup care planning.",
  },
  "/insurance/medication-coverage-checklist": {
    title: "Medication Coverage Checklist",
    description: "Check formularies, tiers, pharmacies, prior authorization, quantity limits, step therapy, and estimated prescription costs.",
  },
  "/insurance/medical-bill-review-toolkit": {
    title: "Medical Bill Review Toolkit",
    description: "Review a medical bill against the EOB, allowed amount, insurance payment, coding, network status, and financial assistance options before paying.",
    kind: "tool",
  },
  "/insurance/medicare-advantage-vs-medigap": {
    title: "Medicare Advantage vs Medigap",
    description: "Compare Medicare Advantage and Original Medicare with Medigap by provider access, premiums, cost-sharing, travel, networks, and underwriting considerations.",
  },
  "/insurance/what-medicare-advantage-marketing-may-not-emphasize": {
    title: "What Medicare Advantage Marketing May Not Emphasize",
    description: "Review networks, prior authorization, post-acute care, drug coverage, travel, and maximum out-of-pocket exposure before choosing a plan.",
  },
  "/tools": {
    title: "Healthcare Finance Calculators and Checklists",
    description: "Free calculators and decision tools for 403(b) contributions, health insurance costs, medical bills, Medicare, open enrollment, and hospital discharge.",
    kind: "collection",
  },
  "/tools/hospital-discharge-medicare-checklist": {
    title: "Hospital Discharge Medicare Checklist",
    description: "Use a step-by-step checklist to verify hospital status, rehab eligibility, authorization, networks, costs, and post-discharge coverage.",
    kind: "tool",
  },
  "/tools/medical-bill-review-flow": {
    title: "Medical Bill Review Flow",
    description: "Work through a confusing medical bill step by step using the EOB, itemized charges, network status, insurer processing, and financial assistance.",
    kind: "tool",
  },
  "/tools/healthcare-worker-benefits-blueprint": {
    title: "Healthcare Worker Benefits Blueprint",
    description: "Build a goal-first workplace benefits blueprint for retirement contributions, health-plan fit, HSA questions, coverage tier, and open enrollment.",
    kind: "tool",
  },
  "/tools/employer-benefits-action-plan": {
    title: "Employer Benefits Action Plan",
    description: "Combine employer retirement, health insurance, and HSA details into a prioritized, plain-English benefits action plan without connecting an HR portal.",
    kind: "tool",
  },
  "/tools/medicare-medicaid-eligibility-check": {
    title: "Medicare and Medicaid Eligibility Check",
    description: "Check possible Medicare, Medicaid, Medicare Savings Program, dual-eligibility, disability, pregnancy, child, and long-term-care pathways, then verify with official agencies.",
    kind: "tool",
  },
  "/tools/prior-authorization-next-step-guide": {
    title: "Prior Authorization Next-Step Guide",
    description: "Answer plain-English questions about a delayed, pending, or denied prior authorization and get a qualified action plan with provider questions, plan questions, documents, appeal checks, and official sources.",
    kind: "tool",
  },
  "/tools/healthcare-worker-total-compensation-comparison": {
    title: "Healthcare Worker Total Compensation Calculator",
    description: "Compare two healthcare jobs using salary or hourly pay, overtime, shift differentials, employer benefits, insurance premiums, commuting costs, PTO, and effective hourly value.",
    kind: "tool",
  },
  "/tools/403b-paycheck-calculator": {
    title: "403(b) Paycheck Contribution Calculator",
    description: "Estimate your 403(b) contribution per paycheck, annual contribution, employer match, and progress toward the annual contribution limit.",
    kind: "tool",
  },
  "/tools/open-enrollment-true-cost-calculator": {
    title: "Open Enrollment True Cost Calculator",
    description: "Compare health plans using premiums, expected care, employer contributions, deductible exposure, and worst-case annual cost.",
    kind: "tool",
  },
  "/tools/eob-to-bill-match-checker": {
    title: "EOB to Medical Bill Match Checker",
    description: "Compare a provider bill with an Explanation of Benefits to identify mismatched patient responsibility, allowed amounts, and insurer payments.",
    kind: "tool",
  },
  "/tools/out-of-pocket-max-estimator": {
    title: "Out-of-Pocket Maximum Estimator",
    description: "Estimate remaining covered in-network cost-sharing exposure using deductible, copays, coinsurance, and current out-of-pocket progress.",
    kind: "tool",
  },
  "/tools/medicare-advantage-plan-helper": {
    title: "Medicare Advantage Plan Comparison Helper",
    description: "Organize doctors, hospitals, prescriptions, networks, authorization rules, extra benefits, and maximum out-of-pocket exposure before comparing plans.",
    kind: "tool",
  },
  "/articles": {
    title: "Healthcare Finance Articles",
    description: "Browse RN-led, source-backed articles about medical bills, insurance, Medicare, Medicaid, retirement, workplace benefits, and healthcare-worker finances.",
    kind: "collection",
  },
  "/topics": {
    title: "Healthcare Finance Topic Guides",
    description: "Explore organized topic guides for Medicare, Medicaid, workplace benefits, retirement accounts, health insurance, medical costs, and hospital economics.",
    kind: "collection",
  },
  "/glossary": {
    title: "Healthcare Finance Glossary",
    description: "Plain-English definitions for health insurance, Medicare, Medicaid, medical billing, retirement accounts, workplace benefits, and hospital finance terms.",
  },
  "/newsletter": {
    title: "Community Acquired Finance Newsletter",
    description: "Get practical, low-frequency updates on healthcare-worker finances, medical bills, insurance, benefits, Medicare, and new calculators.",
  },
  "/about": {
    title: "About Community Acquired Finance",
    description: "Learn why Andrew Ciccarelli, BSN, RN created an RN-led financial literacy resource for healthcare workers, patients, families, and caregivers.",
  },
  "/contact": {
    title: "Contact Community Acquired Finance",
    description: "Contact Community Acquired Finance with feedback, corrections, topic suggestions, partnership questions, or accessibility concerns.",
  },
  "/methodology": {
    title: "Research and Editorial Methodology",
    description: "See how Community Acquired Finance selects sources, checks claims, updates educational content, and separates editorial judgment from monetization.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Read the Community Acquired Finance privacy policy.",
  },
  "/terms-of-use": {
    title: "Terms of Use",
    description: "Read the Community Acquired Finance terms of use and educational limitations.",
  },
  "/editorial-policy": {
    title: "Editorial Policy",
    description: "Review the editorial standards for accuracy, sourcing, independence, corrections, and healthcare financial education.",
  },
  "/disclosures": {
    title: "Disclosures",
    description: "Review educational, financial, medical, advertising, affiliate, and conflict-of-interest disclosures for Community Acquired Finance.",
  },
  "/accessibility": {
    title: "Accessibility Statement",
    description: "Read the Community Acquired Finance accessibility statement and contact information for reporting barriers.",
  },
};

export const STATIC_INDEXABLE_ROUTES = Object.keys(STATIC_PAGE_META);

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};

const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>): SeoJsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

const pageJsonLd = (path: string, meta: StaticPageMeta): SeoJsonLd => {
  if (meta.kind === "tool") {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: meta.title,
      description: meta.description,
      url: absoluteUrl(path),
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": meta.kind === "collection" ? "CollectionPage" : "WebPage",
    name: meta.title,
    description: meta.description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
};

export const getIndexableRoutes = () => {
  const routes = [
    ...STATIC_INDEXABLE_ROUTES,
    ...TOPICS.map((topic) => `/topics/${topic.slug}`),
    ...ALL_ARTICLES.map((article) => `/articles/${article.slug}`),
  ];

  return Array.from(new Set(routes.map(normalizePath)));
};

export const resolveSeoMeta = (pathname: string): SeoRouteMeta => {
  const path = normalizePath(pathname);

  if (path.startsWith("/articles/")) {
    const slug = path.slice("/articles/".length);
    const article = ALL_ARTICLES.find((candidate) => candidate.slug === slug);

    if (article) {
      const description = article.description ?? article.promise;
      return {
        title: article.title,
        description,
        canonicalPath: path,
        type: "article",
        author: AUTHOR_NAME,
        robots: "index, follow, max-image-preview:large",
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description,
            mainEntityOfPage: absoluteUrl(path),
            url: absoluteUrl(path),
            articleSection: article.category,
            author: {
              "@type": "Person",
              name: AUTHOR_NAME,
              url: absoluteUrl(AUTHOR_PATH),
              jobTitle: "Registered Nurse",
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.svg`,
              },
            },
          },
        ],
      };
    }
  }

  if (path.startsWith("/topics/")) {
    const slug = path.slice("/topics/".length);
    const topic = TOPICS.find((candidate) => candidate.slug === slug);

    if (topic) {
      return {
        title: `${topic.title} Guide`,
        description: topic.promise,
        canonicalPath: path,
        robots: "index, follow, max-image-preview:large",
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
            { name: topic.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: topic.title,
            description: topic.promise,
            url: absoluteUrl(path),
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
          },
        ],
      };
    }
  }

  const staticMeta = STATIC_PAGE_META[path];
  if (staticMeta) {
    const breadcrumbs = path === "/" ? [] : [{ name: "Home", path: "/" }, { name: staticMeta.title, path }];

    return {
      title: staticMeta.title,
      description: staticMeta.description,
      canonicalPath: path,
      robots: "index, follow, max-image-preview:large",
      jsonLd: path === "/" ? [organizationJsonLd, websiteJsonLd, pageJsonLd(path, staticMeta)] : [breadcrumbJsonLd(breadcrumbs), pageJsonLd(path, staticMeta)],
    };
  }

  return {
    title: "Page Not Found",
    description: "The requested page could not be found.",
    canonicalPath: path,
    robots: "noindex, nofollow",
    jsonLd: [],
  };
};
