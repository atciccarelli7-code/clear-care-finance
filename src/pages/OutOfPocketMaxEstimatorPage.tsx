import { Link } from "react-router-dom";
import { CheckCircle2, Shield } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { SourceList } from "@/components/shared/SourceList";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OutOfPocketMaxEstimator from "@/components/calculators/OutOfPocketMaxEstimator";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";

const reminders = [
  "The out-of-pocket maximum usually applies to covered in-network services under the plan's rules.",
  "Premiums usually do not count toward the out-of-pocket maximum.",
  "Out-of-network care, denied services, non-covered services, and charges above the allowed amount may work differently.",
  "Insurer portals and EOBs can lag, so verify the latest amount counted toward the maximum before acting on a large balance.",
];

const OutOfPocketMaxEstimatorPage = () => {
  useSeo({
    title: "Out-of-Pocket Max Estimate Calculator",
    description: "Estimate how close a health plan member may be to the out-of-pocket maximum using allowed amount, deductible remaining, copays, coinsurance, and amount already counted.",
    canonicalPath: "/tools/out-of-pocket-max-estimator",
  });

  return (
    <>
      <PageHero
        eyebrow="Insurance calculator"
        title="Out-of-Pocket Max Estimate Calculator"
        description="Estimate how much covered in-network care may cost before the plan's out-of-pocket maximum starts limiting cost-sharing."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><Link to="/articles/how-to-read-an-eob">Read an EOB first</Link></Button>
          <Button asChild variant="outline"><Link to="/tools#eob-bill-match">Compare EOB vs bill</Link></Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <CalculatorCard
          icon={Shield}
          eyebrow="Estimate, then verify"
          title="How close are you to the out-of-pocket max?"
          description="Use this for covered in-network cost-sharing estimates. It is not a quote, bill review, or coverage guarantee."
          relatedArticle={{ label: "Deductible, Copay, Coinsurance, and Out-of-Pocket Max", href: "/articles/deductible-copay-coinsurance-out-of-pocket-max" }}
        >
          <OutOfPocketMaxEstimator />
        </CalculatorCard>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Interpretation</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">What the estimate can and cannot tell you</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                The calculator organizes the core math: what has already counted, how much room remains under the cap, and how deductible, copays, and coinsurance could apply to expected care. The insurer still controls claim processing.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {reminders.map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <NextStepCards
          eyebrow="After the estimate"
          title="What should you check next?"
          description="The useful next step depends on whether you are looking at a bill, reading an EOB, or choosing a plan."
          columns="four"
          cards={[
            {
              eyebrow: "EOB first",
              title: "How to Read an EOB",
              description: "Find allowed amount, plan payment, adjustments, and patient responsibility before paying.",
              href: "/articles/how-to-read-an-eob",
              cta: "Read guide",
            },
            {
              eyebrow: "Bill review",
              title: "EOB-to-Bill Match Checker",
              description: "Compare the insurer explanation with the provider bill and identify mismatches.",
              href: "/tools#eob-bill-match",
              cta: "Check bill",
            },
            {
              eyebrow: "Plan choice",
              title: "Open Enrollment Guide",
              description: "Use OOP max as the bad-year number when comparing health plan choices.",
              href: "/open-enrollment",
              cta: "Compare plans",
            },
            {
              eyebrow: "More help",
              title: "Benefits and Insurance Hub",
              description: "Return to the main decision hub for EOBs, bills, prescriptions, prior auth, and Medicare choices.",
              href: "/insurance",
              cta: "Open hub",
            },
          ]}
        />

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sources to verify the rule</CardTitle>
            <CardDescription>Use official plan documents and insurer claim records for final decisions. These sources explain the terms used by the calculator.</CardDescription>
          </CardHeader>
          <CardContent>
            <SourceList sources={[SOURCE_PRESETS.healthcareGovOutOfPocketMax, SOURCE_PRESETS.healthcareGovDeductible, SOURCE_PRESETS.healthcareGovCoinsurance]} />
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default OutOfPocketMaxEstimatorPage;
