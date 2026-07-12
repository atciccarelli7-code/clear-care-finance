import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles, Users, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Quote } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ALL_ARTICLES } from "@/data/allArticles";
import { ARTICLE_VOICE_NOTES } from "@/data/articleVoiceNotes";
import { OPEN_ENROLLMENT_ARTICLE_SLUGS } from "@/data/openEnrollmentPath";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { NextStepCards, type NextStepCard } from "@/components/shared/NextStepCards";
import { ContentFreshness } from "@/components/shared/ContentFreshness";
import { Button } from "@/components/ui/button";
import { isArticleDraft } from "@/lib/article-status";
import { useSeo } from "@/lib/seo";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

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

const getArticleNextSteps = (slug: string, category: string, relatedCalculator?: { label: string; href: string }): NextStepCard[] => {
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
        eyebrow: "Calculator",
        title: relatedCalculator?.label ?? "Health Insurance Visit Cost Calculator",
        description: "Turn the insurance terms into a rough dollar estimate before deciding what to question next.",
        href: relatedCalculator?.href ?? "/tools#insurance",
        cta: "Open calculator",
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

const getOpenEnrollmentOrderedStep = (slug: string): OrderedArticleStep | null => {
  const index = OPEN_ENROLLMENT_ARTICLE_SLUGS.indexOf(slug as typeof OPEN_ENROLLMENT_ARTICLE_SLUGS[number]);
  if (index === -1) return null;

  const nextSlug = OPEN_ENROLLMENT_ARTICLE_SLUGS[index + 1];
  const nextArticle = nextSlug ? ALL_ARTICLES.find((article) => article.slug === nextSlug) : null;

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

const ArticlePage = () => {
  const { slug = "" } = useParams();
  const article = ALL_ARTICLES.find((a) => a.slug === slug);

  useSeo({
    title: article?.title ?? "Article",
    description: article?.description ?? article?.promise ?? "Plain-English healthcare finance article from Community Acquired Finance.",
    canonicalPath: article ? `/articles/${article.slug}` : "/articles",
    type: "article",
    author: article?.author,
  });

  if (!article) return <Navigate to="/articles" replace />;

  const voiceNote = ARTICLE_VOICE_NOTES[article.slug];
  const showOutOfPocketMaxTool = ["how-to-read-an-eob", "deductible-copay-coinsurance-out-of-pocket-max"].includes(article.slug);
  const nextSteps = getArticleNextSteps(article.slug, article.category, article.relatedCalculator);
  const orderedOpenEnrollmentStep = getOpenEnrollmentOrderedStep(article.slug);

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
        {(article.author || article.reviewer) && (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            {article.author && <div><span className="font-semibold text-foreground">Written by:</span> {article.author}</div>}
            {article.reviewer && <div><span className="font-semibold text-foreground">Reviewed by:</span> {article.reviewer}</div>}
          </div>
        )}
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

        {article.sections && article.sections.length > 0 ? (
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

        {article.example && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Healthcare-specific example</div>
            <h3 className="font-display text-lg font-bold mb-2">{article.example.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{article.example.body}</p>
          </div>
        )}

        {article.comparisonTable && (
          <Section icon={BookOpen} title="Quick comparison table">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted/50 text-foreground"><tr>{article.comparisonTable.headers.map((header) => <th key={header} className="px-4 py-3 font-bold">{header}</th>)}</tr></thead>
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
          <Section icon={Users} title="Questions to ask HR or the plan administrator">
            <ul className="space-y-2">{article.questionsToAsk.map((question) => <li key={question} className="flex items-start gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{question}</span></li>)}</ul>
          </Section>
        )}

        {article.relatedCalculator && (
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

        {orderedOpenEnrollmentStep && (
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

        <NextStepCards
          eyebrow={orderedOpenEnrollmentStep ? "Tools and related reading" : "Keep going"}
          title={orderedOpenEnrollmentStep ? "Want to run the numbers instead?" : "Next useful step"}
          description={orderedOpenEnrollmentStep ? "After the next article, you can also jump into a calculator or return to the full open enrollment path." : "Move from reading to action with the related checklist, calculator, or decision hub."}
          cards={nextSteps}
        />

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

export default ArticlePage;
