import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ClipboardCheck,
  FileText,
  HeartPulse,
  HelpCircle,
  Hospital,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const guideChapters = [
  "Medicare vs Medicaid in plain English",
  "Original Medicare vs Medicare Advantage",
  "Rehab after a hospital stay",
  "Skilled nursing facility care",
  "Home health and durable medical equipment",
  "Long-term care and custodial care",
  "Dual eligibility",
  "Prior authorization and denials",
  "Bills, EOBs, Medicare Summary Notices, and questions to ask",
];

const calculatorLinks = [
  {
    title: "Medicare cost exposure tool",
    description: "Estimate Part B, hospital, SNF, drug, Medigap, or Medicare Advantage cost exposure.",
    href: "/medicare-care-costs#cost-estimator",
  },
  {
    title: "EOB-to-bill match checker",
    description: "Compare a medical bill against the explanation of benefits before paying blindly.",
    href: "/tools/eob-to-bill-match-checker",
  },
  {
    title: "Out-of-pocket max estimator",
    description: "Understand how deductibles, coinsurance, copays, and max out-of-pocket limits interact.",
    href: "/tools/out-of-pocket-max-estimator",
  },
  {
    title: "Medicare Advantage plan helper",
    description: "Organize plan questions around networks, prior authorization, drug coverage, and cost exposure.",
    href: "/tools/medicare-advantage-plan-helper",
  },
];

const articleLinks = [
  {
    title: "Does Medicare cover long-term care?",
    href: "/articles/does-medicare-cover-long-term-care",
  },
  {
    title: "Does Medicare cover rehab after a hospital stay?",
    href: "/articles/does-medicare-cover-rehab-after-hospital-stay",
  },
  {
    title: "Medicare vs Medicaid: what is the difference?",
    href: "/articles/medicare-vs-medicaid-what-is-the-difference",
  },
  {
    title: "What does Medicare not cover?",
    href: "/articles/what-does-medicare-not-cover",
  },
  {
    title: "Why do I still owe money with Medicare?",
    href: "/articles/why-do-i-still-owe-money-with-medicare",
  },
  {
    title: "Prior authorization explained",
    href: "/articles/prior-authorization-explained",
  },
  {
    title: "How to read an EOB",
    href: "/articles/how-to-read-an-eob",
  },
  {
    title: "Observation vs inpatient status",
    href: "/articles/observation-vs-inpatient-status",
  },
];

const proofPoints = [
  {
    icon: Hospital,
    title: "Built around discharge confusion",
    body: "The guide focuses on the moment families actually need help: hospital discharge, rehab, home health, long-term care, and bills.",
  },
  {
    icon: ClipboardCheck,
    title: "Questions before decisions",
    body: "Each section turns coverage confusion into practical questions to ask Medicare, Medicaid, the plan, the facility, or the billing office.",
  },
  {
    icon: ShieldCheck,
    title: "Source-review boundary",
    body: "The public download is held until final source review is complete. The page connects readers to live tools and articles now.",
  },
];

const MedicareMedicaidGuideLandingPage = () => {
  useSeo({
    title: "Free Medicare, Medicaid, Rehab, and Long-Term Care Family Guide | Community Acquired Finance",
    description:
      "A plain-English Medicare and Medicaid guide landing page for patients, caregivers, and families facing hospital discharge, rehab, long-term care, and medical bill questions.",
    canonical: "/guides/medicare-medicaid-rehab-long-term-care",
  });

  return (
    <main>
      <PageHero
        eyebrow="Free guide in source review"
        title="The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care"
        description="A plain-English guide for patients, caregivers, and families trying to understand discharge planning, rehab coverage, long-term care, Medicaid, and medical bills."
      >
        <Button size="lg" disabled aria-disabled="true" title="The final downloadable PDF is not public yet.">
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
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} className="rounded-3xl border-border/80 shadow-card">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-display text-xl leading-tight">{point.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{point.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">What the guide will cover</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                The downloadable PDF is being held until the source notes and fact-check gaps are complete. The planned guide is organized around real family questions, not generic Medicare definitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {guideChapters.map((chapter) => (
                  <div key={chapter} className="rounded-2xl border border-border bg-background/60 p-4 text-sm font-medium leading-snug">
                    {chapter}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 bg-primary-soft/40 shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Who this is for</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Start here if someone in your family is hospitalized, being discharged, considering rehab, receiving home health, facing nursing home questions, or trying to understand why Medicare paid but a balance remains.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                This page is educational only. It does not determine Medicare coverage, Medicaid eligibility, discharge safety, legal strategy, plan choice, or whether a specific bill is correct.
              </p>
              <p>
                Use the tools and articles below to understand the question, then verify your situation with Medicare, Medicaid, the plan, the facility, the billing office, SHIP, or a qualified professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Use now"
            title="Calculators connected to the guide"
            description="The guide will point back to these tools so families can move from explanation to a practical next question."
            centered
          />
          <div className="grid gap-5 md:grid-cols-2">
            {calculatorLinks.map((tool) => (
              <Card key={tool.href} className="rounded-3xl border-border/80 shadow-card">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <CardTitle className="font-display text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="soft">
                    <Link to={tool.href}>
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
          description="These pages support the guide while the downloadable PDF goes through final source review."
          centered
        />
        <div className="grid gap-4 md:grid-cols-2">
          {articleLinks.map((article) => (
            <Link
              key={article.href}
              to={article.href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-sm transition-smooth hover:border-primary/40 hover:shadow-card"
            >
              <span>{article.title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-smooth group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24">
        <Card className="rounded-3xl border-border/80 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <HeartPulse className="h-5 w-5" />
            </div>
            <CardTitle className="font-display text-2xl">Why the download is not live yet</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The guide is intended to be printable and shareable. That means it needs a higher bar than a normal web article.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The manuscript and print layout are drafted, but final publication should wait until missing official sources are added for dual eligibility, Medicare Summary Notices, EOB/billing details, observation notices, appeals, Medicare Advantage prior authorization, and state Medicaid/LTSS verification.
            </p>
            <p>
              That source-review step protects the trust of the guide and keeps Community Acquired Finance from publishing something that feels rushed, salesy, or loosely sourced.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link to="/methodology">
                  Review methodology
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/disclosures">
                  Read disclosures
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default MedicareMedicaidGuideLandingPage;
