import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, Calculator, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const calculators = [
  ["Medicare cost exposure tool", "/medicare-care-costs#cost-estimator"],
  ["EOB-to-bill match checker", "/tools/eob-to-bill-match-checker"],
  ["Out-of-pocket max estimator", "/tools/out-of-pocket-max-estimator"],
  ["Medicare Advantage plan helper", "/tools/medicare-advantage-plan-helper"],
] as const;

const articles = [
  ["Does Medicare cover long-term care?", "/articles/does-medicare-cover-long-term-care"],
  ["Does Medicare cover rehab after a hospital stay?", "/articles/does-medicare-cover-rehab-after-hospital-stay"],
  ["Medicare vs Medicaid: what is the difference?", "/articles/medicare-vs-medicaid-what-is-the-difference"],
  ["What does Medicare not cover?", "/articles/what-does-medicare-not-cover"],
  ["Why do I still owe money with Medicare?", "/articles/why-do-i-still-owe-money-with-medicare"],
  ["Prior authorization explained", "/articles/prior-authorization-explained"],
  ["How to read an EOB", "/articles/how-to-read-an-eob"],
  ["Observation vs inpatient status", "/articles/observation-vs-inpatient-status"],
] as const;

const MedicareMedicaidGuideLandingPage = () => {
  useSeo({
    title: "Free Medicare, Medicaid, Rehab, and Long-Term Care Family Guide",
    description:
      "A plain-English Medicare and Medicaid guide landing page for patients, caregivers, and families facing discharge, rehab, long-term care, and medical bill questions.",
    canonicalPath: "/guides/medicare-medicaid-rehab-long-term-care",
  });

  return (
    <main>
      <PageHero
        eyebrow="Free guide in source review"
        title="The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care"
        description="A plain-English guide for patients, caregivers, and families trying to understand discharge planning, rehab coverage, long-term care, Medicaid, and medical bills."
      >
        <Button size="lg" disabled title="The final downloadable PDF is not public yet.">
          <FileText className="h-4 w-4" />
          Download guide — source review in progress
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/medicare-care-costs#cost-estimator">
            Use the Medicare cost tool
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-primary" />
              <CardTitle className="font-display text-xl">Built for trust first</CardTitle>
              <CardDescription>
                The downloadable PDF is held until final source review is complete. The page connects readers to live tools and articles now.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <BookOpenCheck className="h-8 w-8 text-primary" />
              <CardTitle className="font-display text-xl">Not a generic Medicare summary</CardTitle>
              <CardDescription>
                The guide is organized around discharge, rehab, home health, long-term care, Medicaid, prior authorization, and medical bills.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <Calculator className="h-8 w-8 text-primary" />
              <CardTitle className="font-display text-xl">Connected to tools</CardTitle>
              <CardDescription>
                Each major guide topic points back to calculators and plain-English explainers for the next practical question.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Use now"
            title="Calculators connected to the guide"
            description="The final PDF will point back to these tools so families can move from explanation to a practical next question."
            centered
          />
          <div className="grid gap-4 md:grid-cols-2">
            {calculators.map(([title, href]) => (
              <Card key={href} className="rounded-3xl border-border/80 shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="soft">
                    <Link to={href}>
                      Open tool
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <SectionHeading
          eyebrow="Read now"
          title="Plain-English articles connected to the guide"
          description="These articles support the guide while the downloadable PDF goes through final source review."
          centered
        />
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map(([title, href]) => (
            <Link
              key={href}
              to={href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-sm transition-smooth hover:border-primary/40 hover:shadow-card"
            >
              <span>{title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-smooth group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24">
        <Card className="rounded-3xl border-border/80 shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Why the download is not live yet</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The manuscript and print layout are drafted, but final publication should wait until missing official sources are added for dual eligibility, Medicare Summary Notices, EOB/billing details, observation notices, appeals, Medicare Advantage prior authorization, and state Medicaid/LTSS verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/methodology">Review methodology</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/disclosures">Read disclosures</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default MedicareMedicaidGuideLandingPage;
