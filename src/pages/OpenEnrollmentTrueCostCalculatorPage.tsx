import { useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, Receipt, Shield } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenEnrollmentTrueCostCalculator } from "@/components/calculators/OpenEnrollmentTools";
import { SOURCE_PRESETS } from "@/data/sources";
import { trackToolEvent } from "@/lib/siteAnalytics";
import { useSeo } from "@/lib/seo";

const decisionChecks = [
  "Use annual premium, not only the per-paycheck deduction.",
  "Compare expected-use cost and bad-year exposure separately.",
  "Subtract employer HSA or HRA money when it truly offsets costs.",
  "Verify network, plan rules, and covered services before choosing.",
];

const OpenEnrollmentTrueCostCalculatorPage = () => {
  const hasTrackedStart = useRef(false);

  useSeo({
    title: "Health Plan True Cost Calculator",
    description: "Compare two health plans by annual premiums, expected care costs, employer HSA or HRA money, and bad-year out-of-pocket exposure before open enrollment.",
    canonicalPath: "/tools/open-enrollment-true-cost-calculator",
  });

  const trackStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackToolEvent("calculator_start", "open-enrollment-true-cost", "Open Enrollment True Cost Calculator");
  };

  return (
    <>
      <PageHero
        eyebrow="Open enrollment calculator"
        title="Health Plan True Cost Calculator"
        description="Compare two health plans by yearly premiums, expected costs, employer HSA/HRA money, and bad-year exposure before you submit benefits."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#calculator">Run the calculator</a></Button>
          <Button asChild variant="outline"><Link to="/open-enrollment">Open enrollment guide</Link></Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <section id="calculator" className="scroll-mt-24">
          <CalculatorCard
            icon={Shield}
            eyebrow="Plan comparison"
            title="Compare total yearly cost, not just the paycheck deduction"
            description="Enter the premium per paycheck, expected costs, out-of-pocket max, and employer HSA/HRA money for two plans."
            relatedArticle={{ label: "Premium, Deductible, and Out-of-Pocket Max", href: "/articles/premium-deductible-out-of-pocket-open-enrollment" }}
          >
            <div onFocusCapture={trackStart} onClickCapture={trackStart}>
              <OpenEnrollmentTrueCostCalculator />
            </div>
          </CalculatorCard>
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How to use the result</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">The cheapest premium is not always the cheapest plan</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Open enrollment portals often emphasize the paycheck deduction because it is easy to display. A better comparison also includes the deductible, expected use, network quality, employer contributions, and the worst-case covered in-network ceiling.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {decisionChecks.map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <NextStepCards
          eyebrow="After the comparison"
          title="Finish the open enrollment decision"
          description="A lower total-cost estimate is useful, but it should not be the only screen before submitting benefit elections."
          columns="four"
          cards={[
            { eyebrow: "Checklist", title: "Open Enrollment Guide", description: "Use the ordered guide before submitting health, tax account, disability, life, and supplemental elections.", href: "/open-enrollment", cta: "Open guide" },
            { eyebrow: "Bad year", title: "Out-of-Pocket Max Estimator", description: "Stress-test how a large covered in-network claim could move you toward the yearly cap.", href: "/tools/out-of-pocket-max-estimator", cta: "Estimate exposure" },
            { eyebrow: "Paycheck", title: "Paycheck Impact Calculator", description: "Estimate how benefit elections may change take-home pay after pre-tax and after-tax deductions.", href: "/tools#paycheck-impact", cta: "Check paycheck" },
            { eyebrow: "Plan rules", title: "Medication Coverage Checklist", description: "Verify formulary tiers, prior authorization, quantity limits, and preferred pharmacy pricing.", href: "/insurance/medication-coverage-checklist", cta: "Check coverage" },
          ]}
        />

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sources to verify the terms</CardTitle>
            <CardDescription>Use your employer plan documents and insurer directories for final decisions. These official sources define key cost terms used in the calculator.</CardDescription>
          </CardHeader>
          <CardContent>
            <SourceList sources={[SOURCE_PRESETS.healthcareGovPremium, SOURCE_PRESETS.healthcareGovDeductible, SOURCE_PRESETS.healthcareGovOutOfPocketMax]} />
          </CardContent>
        </Card>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-soft text-secondary"><ClipboardCheck className="h-6 w-6" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold">Need the full tool library?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Return to all calculators for HSA/FSA choices, supplemental benefits, bills, Medicare, student loans, and healthcare-worker pay.</p>
            </div>
            <Button asChild variant="soft"><Link to="/tools"><Receipt className="h-4 w-4" /> Browse tools</Link></Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default OpenEnrollmentTrueCostCalculatorPage;
