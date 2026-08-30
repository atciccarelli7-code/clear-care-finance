import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles, Users, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Quote } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Article } from "@/data/articles";
import { ARTICLE_VOICE_NOTES } from "@/data/articleVoiceNotes";
import { OPEN_ENROLLMENT_ARTICLE_SLUGS } from "@/data/openEnrollmentPath";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { NextStepCards, type NextStepCard } from "@/components/shared/NextStepCards";
import { DirectionalActionLink, DirectionalNextActions } from "@/components/shared/DirectionalNextActions";
import { ContentFreshness } from "@/components/shared/ContentFreshness";
import { EditorialTransparency } from "@/components/shared/EditorialTransparency";
import { Button } from "@/components/ui/button";
import { isArticleDraft } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";
import { trackGrowthEvent } from "@/lib/growthAnalytics";
import { HOSPITAL_GUIDE_ROUTE, getHospitalGuideResourceByArticleSlug } from "@/data/hospitalPatientGuide";
import {
  audienceForArticleCategory,
  decisionCategoryForArticleCategory,
  getArticleHeroAction,
  isPriorityDirectionalArticle,
  resolveDirectionalDestination,
} from "@/lib/directionalCtaRoutes";

const Section = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) => (
  <div className="space-y-2.5 md:space-y-3">
    <div className="flex items-center gap-2.5 md:gap-3">
      <div className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary-soft text-primary shrink-0">
        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </div>
      <h2 className="font-display text-lg md:text-2xl font-bold">{title}</h2>
    </div>
    <div className="text-[0.95rem] md:text-base text-muted-foreground leading-[1.65] md:leading-relaxed space-y-3 md:space-y-4 pl-0 md:pl-12">{children}</div>
  </div>
);

const getArticleNextSteps = (
  slug: string,
  category: string,
  relatedCalculator: { label: string; href: string } | undefined,
  articleCatalog: Article[],
): NextStepCard[] => {
  const priorityActionOverrides: Record<string, NextStepCard[]> = {
    "20-dollar-tylenol-hospital-prices": [
      { eyebrow: "Read the working number", title: "Allowed Amount on a Medical Bill", description: "Separate the provider's billed charge from the amount the plan recognizes when it processes a covered claim.", href: "/articles/allowed-amount-medical-bills", cta: "Understand allowed amount" },
      { eyebrow: "Check the documents", title: "EOB-to-Bill Match Checker", description: "Compare the provider bill with the allowed amount, insurer payment, adjustment, and patient responsibility on the final EOB.", href: "/tools/eob-to-bill-match-checker", cta: "Match EOB and bill" },
      { eyebrow: "Large or confusing balance", title: "Medical Bill Review Toolkit", description: "Organize the itemized bill, EOB, network questions, assistance options, calls, and follow-up before paying.", href: "/insurance/medical-bill-review-toolkit", cta: "Review the bill" },
    ],
    "what-nonprofit-hospital-actually-means": [
      { eyebrow: "Keep learning", title: "Hospital Economics Hub", description: "Follow the money, staffing, capacity, and payment concepts that shape what hospitals do.", href: "/topics/hospital-economics", cta: "Explore hospital economics" },
      { eyebrow: "Patient protection", title: "Hospital Financial Assistance", description: "Find an official hospital policy and prepare the application and verification questions before paying a large bill.", href: "/medical-bills/financial-assistance", cta: "Find a policy" },
      { eyebrow: "How CAF checks claims", title: "Research and Editorial Methodology", description: "See how CAF separates founder perspective, primary evidence, editorial judgment, and corrections.", href: "/methodology", cta: "Review the method" },
    ],
    "why-hospitals-care-about-length-of-stay": [
      { eyebrow: "The next bottleneck", title: "Why “Just Send Them to Rehab” Is Not That Simple", description: "See the clinical, facility, payer, authorization, capacity, and logistics gates between recommendation and transfer.", href: "/articles/why-just-send-them-to-rehab-is-not-simple", cta: "Follow the rehab chain" },
      { eyebrow: "Prepare the transition", title: "Hospital-to-Home Coverage Navigator", description: "Organize the likely post-hospital setting, coverage questions, authorization steps, and backup plan.", href: "/insurance/hospital-discharge-coverage", cta: "Build a transition plan" },
      { eyebrow: "Full patient journey", title: "Hospital & Patient Guide", description: "Connect the hospital stay, medicines, discharge, equipment, follow-up, coverage, and bills.", href: "/patients-families/hospital-guide", cta: "Open the guide" },
    ],
    "why-just-send-them-to-rehab-is-not-simple": [
      { eyebrow: "Build the next-step plan", title: "Hospital-to-Home Coverage Navigator", description: "Identify the recommended setting, controlling coverage path, authorization status, barriers, and safe backup questions.", href: "/insurance/hospital-discharge-coverage", cta: "Open the navigator" },
      { eyebrow: "Status can change coverage", title: "Observation vs. Inpatient Status", description: "Understand why hospital nights do not always count as inpatient days and how that can affect Original Medicare SNF coverage.", href: "/articles/observation-vs-inpatient-status", cta: "Check hospital status" },
      { eyebrow: "Authorization delayed or denied", title: "Prior Authorization Next-Step Guide", description: "Prepare the written-decision, criteria, documentation, contact, and appeal questions for the payer and clinical team.", href: "/tools/prior-authorization-next-step-guide", cta: "Prepare next steps" },
    ],
    "allowed-amount-medical-bills": [
      { eyebrow: "Why the charge looks strange", title: "The $20 Tylenol Isn’t Really About the Tylenol", description: "Follow one hospital line item through gross charge, payer rules, payment, and patient responsibility.", href: "/articles/20-dollar-tylenol-hospital-prices", cta: "See the price layers" },
      { eyebrow: "Check the documents", title: "EOB-to-Bill Match Checker", description: "Compare the allowed amount, insurer payment, adjustments, and patient responsibility with the provider bill.", href: "/tools/eob-to-bill-match-checker", cta: "Match EOB and bill" },
      { eyebrow: "Large or confusing balance", title: "Medical Bill Review Toolkit", description: "Organize the itemized bill, EOB, network questions, assistance options, and follow-up before paying.", href: "/insurance/medical-bill-review-toolkit", cta: "Review the bill" },
    ],
    "facility-fee-vs-professional-fee": [
      { eyebrow: "Understand the price layers", title: "The $20 Tylenol Isn’t Really About the Tylenol", description: "See why a charge, negotiated amount, payment, patient balance, and hospital cost are not the same number.", href: "/articles/20-dollar-tylenol-hospital-prices", cta: "Follow the money" },
      { eyebrow: "Check the processed claim", title: "How to Read an EOB", description: "Identify separate providers, allowed amounts, insurer payments, adjustments, and patient responsibility.", href: "/articles/how-to-read-an-eob", cta: "Read the EOB" },
      { eyebrow: "Review multiple bills", title: "Medical Bill Review Toolkit", description: "Reconcile facility and professional claims before paying a large or unexpected balance.", href: "/insurance/medical-bill-review-toolkit", cta: "Review the bills" },
    ],
    "observation-vs-inpatient-status": [
      { eyebrow: "Why status can affect the next setting", title: "Why “Just Send Them to Rehab” Is Not That Simple", description: "Connect hospital status to the clinical, facility, payer, authorization, and bed gates behind post-acute placement.", href: "/articles/why-just-send-them-to-rehab-is-not-simple", cta: "Follow the rehab chain" },
      { eyebrow: "Prepare the transition", title: "Hospital-to-Home Coverage Navigator", description: "Organize the recommended setting, coverage path, authorization status, unresolved barriers, and safe backup questions.", href: "/insurance/hospital-discharge-coverage", cta: "Build the plan" },
      { eyebrow: "Medicare context", title: "Medicare, Medicaid, and Long-Term Care Hub", description: "Review Original Medicare, Medicare Advantage, skilled care, custodial care, and post-hospital cost questions.", href: "/medicare-care-costs", cta: "Open the hub" },
    ],
    "how-to-read-an-eob": [
      { eyebrow: "Check the bill", title: "EOB-to-Bill Match Checker", description: "Compare the provider bill against the allowed amount, insurer payment, adjustment, and patient responsibility.", href: "/tools/eob-to-bill-match-checker", cta: "Match EOB and bill" },
      { eyebrow: "Estimate exposure", title: "Out-of-Pocket Max Estimator", description: "Estimate how much covered in-network cost-sharing room may remain this plan year.", href: "/tools/out-of-pocket-max-estimator", cta: "Estimate the cap" },
      { eyebrow: "Review the full balance", title: "Medical Bill Review Toolkit", description: "Organize the bill, EOB, assistance questions, calls, and follow-up record before paying.", href: "/insurance/medical-bill-review-toolkit", cta: "Review the bill" },
    ],
    "deductible-copay-coinsurance-out-of-pocket-max": [
      { eyebrow: "Run the math", title: "Health Insurance Visit Cost Calculator", description: "Estimate patient cost using deductible, copay, coinsurance, allowed amount, and out-of-pocket maximum details.", href: "/tools/health-insurance-visit-cost-calculator", cta: "Estimate visit cost" },
      { eyebrow: "Cost ceiling", title: "Out-of-Pocket Max Estimator", description: "Estimate how much covered in-network cost-sharing room may remain this year.", href: "/tools/out-of-pocket-max-estimator", cta: "Estimate cap room" },
      { eyebrow: "Choosing a plan", title: "Open Enrollment Guide", description: "Compare premiums, bad-year exposure, HSA/FSA choices, and paycheck impact before choosing benefits.", href: "/open-enrollment", cta: "Compare plans" },
    ],
    "how-hospital-403b-matching-works": [
      { eyebrow: "Run the paycheck math", title: "403(b) Paycheck Contribution Calculator", description: "Estimate your contribution and employer match after verifying the plan formula and vesting rules.", href: "/tools/403b-paycheck-calculator", cta: "Calculate each paycheck" },
      { eyebrow: "Choose a contribution", title: "How much should a nurse put in a 403(b)?", description: "Choose a sustainable starting contribution without creating avoidable paycheck stress.", href: "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck", cta: "Choose a starting rate" },
      { eyebrow: "Complete benefits picture", title: "Healthcare Worker Benefits Blueprint", description: "Connect retirement value to health coverage, tax accounts, and the rest of the employer package.", href: "/tools/healthcare-worker-benefits-blueprint", cta: "Build the blueprint" },
    ],
    "how-much-should-a-nurse-put-in-403b-per-paycheck": [
      { eyebrow: "Run the paycheck math", title: "403(b) Paycheck Contribution Calculator", description: "Estimate your per-paycheck contribution, take-home impact, and employer match before changing payroll.", href: "/tools/403b-paycheck-calculator", cta: "Calculate each paycheck" },
      { eyebrow: "Verify employer value", title: "How does a hospital 403(b) match work?", description: "Decode the match formula, eligible pay, vesting, payroll timing, and related employer contributions.", href: "/articles/how-hospital-403b-matching-works", cta: "Understand the match" },
      { eyebrow: "Choose tax treatment", title: "Roth vs. traditional 403(b) for healthcare workers", description: "Compare current take-home pay, current tax savings, and future tax flexibility.", href: "/articles/roth-vs-traditional-403b-healthcare-workers", cta: "Compare tax treatment" },
    ],
    "check-hospital-financial-assistance-before-paying": [
      { eyebrow: "Check eligibility", title: "Hospital Financial Assistance & Medical Bill Relief Finder", description: "Find the hospital's official policy, compare a broad income range with published thresholds, and build a verification checklist before paying.", href: "/tools/financial-assistance-checklist", cta: "Check assistance steps" },
      { eyebrow: "Review the whole balance", title: "Medical Bill Review Flow", description: "Identify the document, match it to insurance records, request missing details, and decide which question to ask next.", href: "/tools/medical-bill-review-flow", cta: "Review the bill" },
      { eyebrow: "Official policy sources", title: "Hospital Financial Assistance Hub", description: "Search CAF's source-backed hospital policy records and open the controlling policy or application.", href: "/medical-bills/financial-assistance", cta: "Find a hospital policy" },
    ],
  };
  if (priorityActionOverrides[slug]) return priorityActionOverrides[slug];

  const hospitalGuideResource = getHospitalGuideResourceByArticleSlug(slug);
  if (hospitalGuideResource) {
    const relatedArticle = hospitalGuideResource.relatedArticles[0];
    const relatedArticleData = relatedArticle?.startsWith("/articles/")
      ? articleCatalog.find((article) => `/articles/${article.slug}` === relatedArticle)
      : undefined;

    return [
      {
        eyebrow: "Hospital journey",
        title: "Hospital & Patient Guide",
        description: "See what commonly happens before, during, and after a hospital stay—and where bills and coverage fit.",
        href: HOSPITAL_GUIDE_ROUTE,
        cta: "Open the guide",
      },
      ...(relatedArticleData
        ? [{
            eyebrow: "Related explanation",
            title: relatedArticleData.title,
            description: relatedArticleData.promise,
            href: `/articles/${relatedArticleData.slug}`,
            cta: "Read next",
          }]
        : []),
      {
        eyebrow: "Patient pathways",
        title: "Choose another patient or caregiver need",
        description: "Go to discharge, medical bills, denied care, Medicare and Medicaid, medication coverage, or long-term-care planning.",
        href: "/patients-families",
        cta: "View patient pathways",
      },
    ];
  }

  if (slug === "what-employer-benefit-changes-should-i-compare") {
    return [
      {
        eyebrow: "Full package",
        title: "Open the Benefits Command Center",
        description: "Compare pay, health coverage, retirement, protection, time off, and employer value as one compensation system.",
        href: "/tools/benefits-command-center",
        cta: "Open Command Center",
      },
      {
        eyebrow: "Health plans",
        title: "Compare true annual plan cost",
        description: "Use premiums, expected care, employer funding, and bad-year exposure after identifying what changed.",
        href: "/tools/open-enrollment-true-cost-calculator",
        cta: "Compare health plans",
      },
      {
        eyebrow: "Complete path",
        title: "Use the open-enrollment guide",
        description: "Review medical, tax-advantaged, protection, and supplemental benefits before submitting elections.",
        href: "/open-enrollment",
        cta: "Open enrollment guide",
      },
    ];
  }

  if (slug === "how-to-read-an-eob") {
    return [
      {
        eyebrow: "Check the bill",
        title: "Use the EOB-to-Bill Match Checker",
        description: "Compare the provider bill against the allowed amount, insurance payment, and patient responsibility.",
        href: "/tools#eob-bill-match",
        cta: "Check bill vs EOB",
      },
      {
        eyebrow: "Estimate exposure",
        title: "Estimate out-of-pocket max impact",
        description: "See whether the claim may bring you closer to the plan's yearly cost-sharing cap.",
        href: "/tools/out-of-pocket-max-estimator",
        cta: "Estimate the cap",
      },
      {
        eyebrow: "Still confused",
        title: "Open the insurance hub",
        description: "Use the benefits and insurance hub to find the next article, checklist, or calculator.",
        href: "/insurance",
        cta: "Go to hub",
      },
    ];
  }

  if (slug === "deductible-copay-coinsurance-out-of-pocket-max") {
    return [
      {
        eyebrow: "Run the math",
        title: "Health Insurance Visit Cost Calculator",
        description: "Estimate visit cost using premium, deductible, copay, coinsurance, allowed amount, and OOP max details.",
        href: "/tools#insurance",
        cta: "Estimate visit cost",
      },
      {
        eyebrow: "Cost ceiling",
        title: "Out-of-Pocket Max Estimator",
        description: "Estimate how much covered in-network cost-sharing room may remain this year.",
        href: "/tools/out-of-pocket-max-estimator",
        cta: "Estimate cap room",
      },
      {
        eyebrow: "Choosing a plan",
        title: "Open Enrollment Guide",
        description: "Compare premiums, bad-year exposure, HSA/FSA choices, and paycheck impact before choosing benefits.",
        href: "/open-enrollment",
        cta: "Compare plans",
      },
    ];
  }

  if (category === "Open Enrollment") {
    return [
      {
        eyebrow: "Calculator",
        title: relatedCalculator?.label ?? "Open Enrollment True Cost Calculator",
        description: "Compare premiums, expected care, employer account money, and bad-year exposure before choosing a plan.",
        href: relatedCalculator?.href ?? "/tools#open-enrollment",
        cta: "Open calculator",
      },
      {
        eyebrow: "Estimate exposure",
        title: "Out-of-Pocket Max Estimator",
        description: "Use this when you want to understand how much covered in-network cost-sharing room may remain.",
        href: "/tools/out-of-pocket-max-estimator",
        cta: "Estimate OOP max",
      },
      {
        eyebrow: "Related reading",
        title: "Open Enrollment Guide",
        description: "Go back to the full ordered article path, tools, and final checklist.",
        href: "/open-enrollment",
        cta: "Open guide",
      },
    ];
  }

  if (category === "Build Wealth") {
    if (slug === "cash-vs-investing-when-you-feel-behind") {
      return [
        {
          eyebrow: "Next decision",
          title: "The Healthcare Worker Money Map",
          description: "Put cash, debt, retirement, and investing into one order of operations.",
          href: "/articles/healthcare-worker-money-map",
          cta: "Read the map",
        },
        {
          eyebrow: "Investing",
          title: "Invest Without Picking Stocks",
          description: "Use broad, automated investing for dollars that do not need to stay liquid.",
          href: "/articles/how-healthcare-workers-can-invest-without-picking-stocks",
          cta: "Learn investing",
        },
        {
          eyebrow: "Hub",
          title: "Build Wealth Hub",
          description: "Return to the full worker money, investing, savings rate, and FI path.",
          href: "/build-wealth",
          cta: "Open hub",
        },
      ];
    }

    if (slug === "can-you-live-off-dividends-passive-income-guide") {
      return [
        {
          eyebrow: "FI math",
          title: "Can Healthcare Workers Reach FI?",
          description: "Translate the passive-income dream into savings rate, asset base, and timeline decisions.",
          href: "/articles/can-healthcare-workers-reach-financial-independence",
          cta: "Read FI guide",
        },
        {
          eyebrow: "Investing basics",
          title: "Invest Without Picking Stocks",
          description: "Focus on total return and diversification before chasing income yield.",
          href: "/articles/how-healthcare-workers-can-invest-without-picking-stocks",
          cta: "Learn investing",
        },
        {
          eyebrow: "Tool",
          title: relatedCalculator?.label ?? "403(b) Calculator",
          description: "Run the contribution math that builds the asset base passive income eventually requires.",
          href: relatedCalculator?.href ?? "/tools#403b",
          cta: "Open calculator",
        },
      ];
    }

    if (slug === "money-stress-after-hard-shift") {
      return [
        {
          eyebrow: "System",
          title: "The Healthcare Worker Money Map",
          description: "Replace panic money decisions with a repeatable order of operations.",
          href: "/articles/healthcare-worker-money-map",
          cta: "Read the map",
        },
        {
          eyebrow: "Spending pattern",
          title: "Savings Rate That Changes Your Life",
          description: "Separate relief purchases that help from leakage that keeps you stuck.",
          href: "/articles/savings-rate-that-actually-changes-your-life",
          cta: "Build flexibility",
        },
        {
          eyebrow: "Career pressure",
          title: "Earn More Without Burning Out",
          description: "Use income growth as leverage, not just another source of exhaustion.",
          href: "/articles/earn-more-without-burning-out-bedside",
          cta: "Build income",
        },
      ];
    }

    return [
      {
        eyebrow: "Hub",
        title: "Build Wealth Hub",
        description: "Return to the full worker money, investing, savings rate, and FI path.",
        href: "/build-wealth",
        cta: "Open hub",
      },
      {
        eyebrow: "Tool",
        title: relatedCalculator?.label ?? "Calculator Library",
        description: "Turn the article into a number with a related paycheck, savings, or retirement tool.",
        href: relatedCalculator?.href ?? "/tools",
        cta: "Open tool",
      },
      {
        eyebrow: "Next guide",
        title: "Cash vs Investing When You Feel Behind",
        description: "Balance liquidity, known expenses, and long-term compounding without becoming cash-poor.",
        href: "/articles/cash-vs-investing-when-you-feel-behind",
        cta: "Find balance",
      },
    ];
  }

  if (category === "Hospital Bills") {
    return [
      {
        eyebrow: "Bill review",
        title: "Medical Bill Review Toolkit",
        description: "Walk through the practical steps before paying a large or confusing medical balance.",
        href: "/insurance/medical-bill-review-toolkit",
        cta: "Review bill",
      },
      {
        eyebrow: "EOB basics",
        title: "How to Read an EOB",
        description: "Use the insurer's explanation to understand allowed amount, adjustments, and patient responsibility.",
        href: "/articles/how-to-read-an-eob",
        cta: "Read EOB guide",
      },
      {
        eyebrow: "Hospital journey",
        title: "Hospital & Patient Guide",
        description: "Connect the bill to what happened during the stay, the discharge plan, and the relevant coverage questions.",
        href: HOSPITAL_GUIDE_ROUTE,
        cta: "Open the guide",
      },
    ];
  }

  if (category === "Insurance" || category === "Workplace Benefits") {
    return [
      {
        eyebrow: "Decision hub",
        title: "Benefits and Insurance Tools",
        description: "Pick the situation first: EOB, bill, open enrollment, spouse coverage, prescriptions, or prior authorization.",
        href: "/insurance",
        cta: "Open hub",
      },
      {
        eyebrow: "Calculator library",
        title: "Open the relevant calculator",
        description: "Jump directly to plan comparison, OOP max, HSA/FSA, paycheck impact, or supplemental benefits tools.",
        href: relatedCalculator?.href ?? "/tools",
        cta: "Open tool",
      },
      {
        eyebrow: "Open enrollment",
        title: "Open Enrollment Guide",
        description: "Use this when the question affects next year's benefit elections or payroll deductions.",
        href: "/open-enrollment",
        cta: "Open guide",
      },
    ];
  }

  if (relatedCalculator) {
    return [
      {
        eyebrow: "Try the tool",
        title: relatedCalculator.label,
        description: "Use the related calculator to turn the article into a practical estimate.",
        href: relatedCalculator.href,
        cta: "Open calculator",
      },
      {
        eyebrow: "More tools",
        title: "Calculator Library",
        description: "Browse the full calculator and checklist library for related decisions.",
        href: "/tools",
        cta: "Browse tools",
      },
      {
        eyebrow: "More reading",
        title: "Article Library",
        description: "Find the next plain-English guide by topic or search.",
        href: "/articles",
        cta: "Browse articles",
      },
    ];
  }

  return [
    {
      eyebrow: "More tools",
      title: "Calculator Library",
      description: "Use a calculator or checklist to turn the explanation into a practical next step.",
      href: "/tools",
      cta: "Browse tools",
    },
    {
      eyebrow: "More articles",
      title: "Article Library",
      description: "Keep learning with plain-English guides organized by topic.",
      href: "/articles",
      cta: "Browse articles",
    },
  ];
};

type OrderedArticleStep = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const getOpenEnrollmentOrderedStep = (slug: string, articleCatalog: Article[]): OrderedArticleStep | null => {
  const index = OPEN_ENROLLMENT_ARTICLE_SLUGS.indexOf(slug as typeof OPEN_ENROLLMENT_ARTICLE_SLUGS[number]);
  if (index === -1) return null;

  const nextSlug = OPEN_ENROLLMENT_ARTICLE_SLUGS[index + 1];
  const nextArticle = nextSlug ? articleCatalog.find((article) => article.slug === nextSlug) : null;

  if (nextArticle) {
    return {
      eyebrow: `Next in the open enrollment path · ${index + 2} of ${OPEN_ENROLLMENT_ARTICLE_SLUGS.length}`,
      title: nextArticle.title,
      description: nextArticle.promise,
      href: `/articles/${nextArticle.slug}`,
      cta: "Next article",
    };
  }

  return {
    eyebrow: "Final step in the open enrollment path",
    title: "Finish with the open enrollment checklist",
    description: "You reached the end of the article sequence. Use the checklist to review your benefits before submitting elections.",
    href: "/open-enrollment#final-checklist",
    cta: "Open final checklist",
  };
};

export const ArticlePageView = ({ article, articleCatalog = [] }: { article: Article; articleCatalog?: Article[] }) => {
  useSeo({
    title: article.title,
    description: article.description ?? article.promise,
    canonicalPath: `/articles/${article.slug}`,
    type: "article",
    author: article.author,
  });

  const voiceNote = ARTICLE_VOICE_NOTES[article.slug];
  const showOutOfPocketMaxTool = ["how-to-read-an-eob", "deductible-copay-coinsurance-out-of-pocket-max"].includes(article.slug);
  const nextSteps = getArticleNextSteps(article.slug, article.category, article.relatedCalculator, articleCatalog);
  const orderedOpenEnrollmentStep = getOpenEnrollmentOrderedStep(article.slug, articleCatalog);
  const usesDirectionalHandoff = isPriorityDirectionalArticle(article.slug);
  const heroAction = getArticleHeroAction(article.slug);
  const directionalContext = {
    audienceSegment: audienceForArticleCategory(article.category),
    decisionCategory: decisionCategoryForArticleCategory(article.category),
    originPath: `/articles/${article.slug}`,
  } as const;
  const directionalPrimary = orderedOpenEnrollmentStep
    ? {
        id: `article_${article.slug}_next_primary`,
        title: orderedOpenEnrollmentStep.title,
        description: orderedOpenEnrollmentStep.description,
        href: orderedOpenEnrollmentStep.href,
        label: orderedOpenEnrollmentStep.cta,
        eyebrow: orderedOpenEnrollmentStep.eyebrow,
        availabilityStatus: "available" as const,
      }
    : nextSteps[0]
      ? {
          id: `article_${article.slug}_next_primary`,
          title: nextSteps[0].title,
          description: nextSteps[0].description,
          href: resolveDirectionalDestination(nextSteps[0].href),
          label: nextSteps[0].cta ?? `Go to ${nextSteps[0].title}`,
          eyebrow: nextSteps[0].eyebrow,
          availabilityStatus: "available" as const,
        }
      : null;
  const directionalRelated = (orderedOpenEnrollmentStep ? nextSteps : nextSteps.slice(1)).map((step, index) => ({
    id: `article_${article.slug}_next_related_${index + 1}`,
    title: step.title,
    description: step.description,
    href: resolveDirectionalDestination(step.href),
    label: step.cta ?? `Go to ${step.title}`,
    eyebrow: step.eyebrow,
    availabilityStatus: "available" as const,
  }));
  if (isArticleDraft(article)) {
    return (
      <>
        <PageHero
          eyebrow={`${article.category} · Coming soon`}
          title={article.title}
          description="This guide is still being reviewed and completed. It is not being presented as finished educational content yet."
        />
        <section className="container max-w-3xl py-12 md:py-16">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card md:p-10">
            <h2 className="font-display text-2xl font-bold">This article is still in progress.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              We would rather publish a complete, source-backed guide than fill the page with unfinished copy.
              Published articles and calculators remain available while this one is completed.
            </p>
            <Button asChild variant="soft" className="mt-6">
              <Link to="/articles"><ArrowLeft className="h-4 w-4" /> Browse published articles</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title} description={article.promise}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
        </div>
        {heroAction && (
          <Button asChild variant="hero">
            <DirectionalActionLink
              action={heroAction}
              actionTier="primary"
              context={{ ...directionalContext, placementId: "article_hero" }}
            >
              {heroAction.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </DirectionalActionLink>
          </Button>
        )}
      </PageHero>

      <article className="container max-w-3xl py-8 md:py-16 space-y-8 md:space-y-12">
        <ContentFreshness
          publishedAt={article.publishedAt}
          lastReviewedAt={article.lastReviewedAt}
          rulesEffectiveAt={article.rulesEffectiveAt}
          nextReviewAt={article.nextReviewAt}
          timeSensitive={article.timeSensitive}
          reviewScope={article.reviewScope}
          updateNote={article.updateNote}
        />
        <EditorialTransparency author={article.author} reviewer={article.reviewer} />
        <Section icon={Users} title="Who this is for">
          <p>{article.audience}</p>
        </Section>

        <Section icon={Sparkles} title="60-second summary">
          <p className="text-foreground/90">{article.summary}</p>
        </Section>

        {voiceNote && (
          <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5 shadow-card md:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                <Quote className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{voiceNote.eyebrow}</div>
                <h2 className="font-display text-lg font-bold text-foreground md:text-xl">{voiceNote.title}</h2>
                <p className="text-[0.95rem] leading-[1.65] text-muted-foreground md:text-base">{voiceNote.body}</p>
              </div>
            </div>
          </div>
        )}

        {article.systemMap && (
          <section className="rounded-3xl border border-primary/20 bg-primary-soft/25 p-5 shadow-card md:p-7" aria-labelledby="article-system-map-heading">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How the system moves</div>
              <h2 id="article-system-map-heading" className="mt-2 font-display text-xl font-bold text-foreground md:text-2xl">
                {article.systemMap.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{article.systemMap.description}</p>
            </div>
            <ol className="mt-6 grid gap-3 md:grid-cols-2">
              {article.systemMap.steps.map((step, index) => (
                <li key={step.title} className="relative rounded-2xl border border-border bg-background/90 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {article.editorialSections && article.editorialSections.length > 0 ? (
          <div className="space-y-10 md:space-y-14">
            {article.editorialSections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[0.98rem] leading-[1.75] text-muted-foreground md:text-base">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <ul className="space-y-2.5 pt-1">
                      {section.keyPoints.map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.callout && (
                    <aside className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-4 text-sm leading-relaxed md:p-5 md:text-base">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{section.callout.label}</div>
                      <p className="mt-2 text-foreground/90">{section.callout.body}</p>
                    </aside>
                  )}
                </div>
              </section>
            ))}
          </div>
        ) : article.sections && article.sections.length > 0 ? (
          <Section icon={BookOpen} title="Fact sheet">
            <div className="grid gap-4 md:gap-5">
              {article.sections.map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-3">
                  <h3 className="font-display text-base md:text-lg font-bold text-foreground">{s.title}</h3>
                  {s.definition && (
                    <p className="text-[0.95rem] md:text-base text-muted-foreground leading-[1.65]">{s.definition}</p>
                  )}
                  {s.keyPoints && s.keyPoints.length > 0 && (
                    <ul className="space-y-2">
                      {s.keyPoints.map((p, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[0.95rem] md:text-base text-muted-foreground leading-[1.6]">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.watchOut && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 md:p-4 flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm md:text-[0.95rem] text-foreground/90 leading-[1.6]">
                        <span className="font-semibold text-destructive">Watch out: </span>{s.watchOut}
                      </div>
                    </div>
                  )}
                  {s.example && (
                    <div className="rounded-xl border border-border bg-muted/30 p-3 md:p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">Example</div>
                      <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-[1.6]">{s.example}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section icon={Clock} title="Plain-English explanation">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Section>
        )}

        {article.systemLens && (
          <section className="space-y-5" aria-labelledby="article-system-lens-heading">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The CAF system lens</div>
              <h2 id="article-system-lens-heading" className="mt-2 font-display text-xl font-bold text-foreground md:text-2xl">
                {article.systemLens.title ?? "Where the incentives collide"}
              </h2>
              {article.systemLens.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{article.systemLens.description}</p>}
            </div>
            <dl className="grid gap-3 md:grid-cols-2">
              {article.systemLens.items.map((item) => (
                <div key={item.question} className="rounded-2xl border border-border bg-card p-4 md:p-5">
                  <dt className="font-display text-base font-bold text-foreground">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {article.example && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Healthcare-specific example</div>
            <h3 className="font-display text-lg font-bold mb-2">{article.example.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{article.example.body}</p>
          </div>
        )}

        {article.comparisonTable && (
          <Section icon={BookOpen} title="Quick comparison table">
            <div
              className="overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="region"
              aria-label={`${article.title} quick comparison table`}
              tabIndex={0}
            >
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Quick comparison table for {article.title}</caption>
                <thead className="bg-muted/50 text-foreground"><tr>{article.comparisonTable.headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-bold">{header}</th>)}</tr></thead>
                <tbody>{article.comparisonTable.rows.map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-4 py-3 align-top leading-relaxed">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </Section>
        )}

        {article.numberedSteps && (
          <Section icon={CheckCircle2} title="A practical review process">
            <ol className="list-decimal space-y-3 pl-5">{article.numberedSteps.map((step) => <li key={step} className="pl-1">{step}</li>)}</ol>
          </Section>
        )}

        {article.questionsToAsk && (
          <Section icon={Users} title={article.questionsHeading ?? "Questions to ask HR or the plan administrator"}>
            <ul className="space-y-2">{article.questionsToAsk.map((question) => <li key={question} className="flex items-start gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{question}</span></li>)}</ul>
          </Section>
        )}

        {article.relatedCalculator && !heroAction && (
          <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Related tool</div>
              <h3 className="font-display text-lg font-bold">{article.relatedCalculator.label}</h3>
            </div>
            <Button asChild variant="hero">
              <Link to={article.relatedCalculator.href} onClick={() => article.slug === "what-employer-benefit-changes-should-i-compare" && trackGrowthEvent("acquisition_tool_cta_selected", { entry_surface: "acquisition_article", destination_id: "benefits_change_detector" })}>Open tool <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        )}

        {showOutOfPocketMaxTool && (
          <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 md:p-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Estimate the cap</div>
              <h3 className="font-display text-lg font-bold">Out-of-Pocket Max Estimate Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use this after you know the allowed amount, deductible remaining, copays, coinsurance, and what has already counted toward the plan maximum.
              </p>
            </div>
            <Button asChild variant="hero">
              <Link to="/tools/out-of-pocket-max-estimator">Open estimator <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        )}

        {article.commonMistakes && article.commonMistakes.length > 0 && (
          <Section icon={AlertTriangle} title="Common mistakes">
            <ul className="space-y-2">
              {article.commonMistakes.map((m) => (
                <li key={m} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section icon={CheckCircle2} title="Key takeaway">
          <p className="text-foreground font-medium">{article.takeaway}</p>
        </Section>

        {orderedOpenEnrollmentStep && !usesDirectionalHandoff && (
          <section className="rounded-[1.75rem] border border-primary/20 bg-primary-soft/35 p-5 shadow-card md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{orderedOpenEnrollmentStep.eyebrow}</div>
                <h2 className="mt-2 font-display text-xl font-bold leading-tight md:text-2xl">{orderedOpenEnrollmentStep.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{orderedOpenEnrollmentStep.description}</p>
              </div>
              <Button asChild variant="hero" className="shrink-0">
                <Link to={orderedOpenEnrollmentStep.href}>{orderedOpenEnrollmentStep.cta} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </section>
        )}

        {usesDirectionalHandoff && directionalPrimary ? (
          <DirectionalNextActions
            eyebrow="Recommended next action"
            title="Turn this explanation into the next decision"
            description="Start with the most relevant action for this topic. Related paths stay available without competing with the recommended move."
            primary={directionalPrimary}
            related={directionalRelated}
            context={{
              ...directionalContext,
              placementId: "article_next_action",
            }}
          />
        ) : (
          <NextStepCards
            eyebrow={orderedOpenEnrollmentStep ? "Tools and related reading" : "Keep going"}
            title={orderedOpenEnrollmentStep ? "Want to run the numbers instead?" : "Next useful step"}
            description={orderedOpenEnrollmentStep ? "After the next article, you can also jump into a calculator or return to the full open enrollment path." : "Move from reading to action with the related checklist, calculator, or decision hub."}
            cards={nextSteps}
          />
        )}

        {article.sources.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl md:text-2xl font-bold">Sources</h2>
            <SourceList sources={article.sources} />
          </div>
        )}

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/articles"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          </Button>
        </div>
      </article>
    </>
  );
};

export default ArticlePageView;
