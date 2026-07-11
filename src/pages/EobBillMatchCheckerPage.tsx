import { useRef } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, FileText, Receipt } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { SourceList } from "@/components/shared/SourceList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EobBillMatchChecker } from "@/components/calculators/LaunchChecklistTools";
import { SOURCE_PRESETS } from "@/data/sources";
import { trackToolEvent } from "@/lib/siteAnalytics";
import { useSeo } from "@/lib/seo";

const mismatchSignals = [
  "The date of service, provider, or patient name does not match.",
  "The bill asks for more than the insurer-listed patient responsibility.",
  "The adjustment, allowed amount, or insurer payment is missing or unclear.",
  "A denial, authorization issue, or network issue is not explained clearly.",
];

const EobBillMatchCheckerPage = () => {
  const hasTrackedStart = useRef(false);

  useSeo({
    title: "EOB-to-Bill Match Checker",
    description: "Compare a provider bill with the insurer Explanation of Benefits before paying a confusing medical balance.",
    canonicalPath: "/tools/eob-to-bill-match-checker",
  });

  const trackStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackToolEvent("calculator_start", "eob-bill-match", "EOB-to-Bill Match Checker");
  };

  return (
    <>
      <PageHero
        eyebrow="Medical bill checklist"
        title="EOB-to-Bill Match Checker"
        description="Use this checklist before paying a confusing provider bill. Match the provider bill to the insurer explanation and flag anything worth asking about."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero"><a href="#checker">Start the checklist</a></Button>
          <Button asChild variant="outline"><Link to="/tools/medical-bill-review-flow">Use full bill review flow</Link></Button>
          <Button asChild variant="outline"><Link to="/articles/how-to-read-an-eob">Read the EOB guide</Link></Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <section id="checker" className="scroll-mt-24">
          <CalculatorCard
            icon={Receipt}
            eyebrow="Bill review"
            title="Compare the bill against the EOB before paying"
            description="Check whether the people, dates, providers, billed charge, allowed amount, insurer payment, adjustment, and patient responsibility line up."
            relatedArticle={{ label: "How to Read an EOB", href: "/articles/how-to-read-an-eob" }}
          >
            <div onFocusCapture={trackStart} onClickCapture={trackStart}>
              <EobBillMatchChecker />
            </div>
          </CalculatorCard>
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">When to pause</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-amber-950">A mismatch is a reason to ask questions before paying</h2>
              <p className="mt-4 text-sm leading-relaxed text-amber-950/80 md:text-base">
                This tool does not decide whether a bill is correct. It helps organize the first pass so a billing call can focus on the exact part that does not line up.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {mismatchSignals.map((item) => (
                <div key={item} className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-relaxed text-amber-950 shadow-sm">
                  <AlertTriangle className="mb-3 h-5 w-5 text-amber-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <NextStepCards
          eyebrow="After the match check"
          title="Choose the next practical step"
          description="The right next step depends on whether the problem is the insurer explanation, the provider bill, affordability, or pressure to pay."
          columns="four"
          cards={[
            { eyebrow: "Flow", title: "Medical Bill Review Flow", description: "Use the broader workflow if you are not sure what document you have, what to request, or whether to pause before paying.", href: "/tools/medical-bill-review-flow", cta: "Review bill" },
            { eyebrow: "EOB", title: "How to Read an EOB", description: "Find allowed amount, adjustment, plan payment, denial language, and patient responsibility.", href: "/articles/how-to-read-an-eob", cta: "Read guide" },
            { eyebrow: "Hub", title: "Medical Bill Review Toolkit", description: "Use the complete hub for itemized bills, financial assistance, official resources, and problem-specific pathways.", href: "/insurance/medical-bill-review-toolkit", cta: "Open toolkit" },
            { eyebrow: "Track", title: "Call and Deadline Tracker", description: "Keep a local-only timeline of departments, call references, requested documents, promised actions, and follow-up dates.", href: "/insurance/medical-bill-review-toolkit#call-tracker", cta: "Track follow-up" },
          ]}
        />

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sources to verify the terms</CardTitle>
            <CardDescription>Use your insurer EOB, provider bill, and plan documents for final decisions. These official sources define several terms that often appear on EOBs and bills.</CardDescription>
          </CardHeader>
          <CardContent>
            <SourceList sources={[SOURCE_PRESETS.healthcareGovDeductible, SOURCE_PRESETS.healthcareGovCoinsurance, SOURCE_PRESETS.healthcareGovOutOfPocketMax]} />
          </CardContent>
        </Card>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><CheckCircle2 className="h-6 w-6" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold">Need the full tool library?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Return to all calculators and checklists for insurance choices, bills, Medicare, student loans, and healthcare-worker pay.</p>
            </div>
            <Button asChild variant="soft"><Link to="/tools"><FileText className="h-4 w-4" /> Browse tools</Link></Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default EobBillMatchCheckerPage;
