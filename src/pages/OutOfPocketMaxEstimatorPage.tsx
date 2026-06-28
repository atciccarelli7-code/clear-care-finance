import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Receipt, Shield } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OutOfPocketMaxEstimator from "@/components/calculators/OutOfPocketMaxEstimator";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";

const relatedLinks = [
  ["How to Read an Explanation of Benefits", "Use the EOB to find allowed amount, insurance payment, and what the insurer says may be owed.", "/articles/how-to-read-an-eob"],
  ["Deductible, Copay, Coinsurance, and Out-of-Pocket Max", "Review the core terms behind the calculator before comparing plans or bills.", "/articles/deductible-copay-coinsurance-out-of-pocket-max"],
  ["Open Enrollment Guide", "Use the out-of-pocket maximum as the bad-year number when comparing benefit choices.", "/open-enrollment"],
  ["Benefits and Insurance Hub", "Return to the insurance decision cluster for EOBs, bills, prescriptions, spouse coverage, and Medicare choices.", "/insurance"],
];

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

        <section>
          <SectionHeading centered eyebrow="Use with these pages" title="Internal links for the benefits and insurance cluster" description="This calculator sits between the educational articles and the practical bill-review tools." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map(([title, body, href]) => (
              <Link key={href} to={href} className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover">
                <Receipt className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></div>
              </Link>
            ))}
          </div>
        </section>

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
