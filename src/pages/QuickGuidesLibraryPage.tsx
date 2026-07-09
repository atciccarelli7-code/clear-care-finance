import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, ClipboardCheck, FileText, HeartHandshake, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const liveGuides = [
  {
    title: "The Hospital Discharge & Medicare Quick Guide",
    status: "Live guide landing page and PDF",
    description:
      "A printable first-stop guide for discharge, observation status, rehab, home health, equipment, long-term care, Medicaid questions, Medicare Advantage plan decisions, and confusing medical bills.",
    href: "/guides/hospital-discharge-medicare",
    cta: "Open guide page",
  },
] as const;

const nextGuides = [
  {
    title: "The Turning 65 Medicare Sign-Up Quick Guide",
    status: "Manuscript in build",
    description:
      "A calm checklist for people approaching 65 who need to know when to sign up for Part A and Part B, what to ask if they are still working, and where to verify before enrolling.",
    source:
      "Grounded in Medicare.gov sign-up, initial enrollment period, special enrollment period, coverage-start, and Social Security/CMS form guidance.",
  },
  {
    title: "The Medicaid Application Quick Guide",
    status: "Manuscript in build",
    description:
      "A practical guide for applying for Medicaid or CHIP, identifying the right state agency or Marketplace path, gathering documents, and knowing what to do after approval, denial, or a request for proof.",
    source:
      "Grounded in HealthCare.gov Medicaid/CHIP application guidance, Medicaid.gov eligibility materials, and state-specific verification guardrails.",
  },
  {
    title: "Medicare or Medicaid? Start Here Quick Guide",
    status: "Planned",
    description:
      "A bridge guide for people who are not sure whether their question is about Medicare, Medicaid, Medicare Advantage, Marketplace coverage, or long-term services and supports.",
    source: "Designed to prevent people from starting with the wrong program or payer assumption.",
  },
  {
    title: "Still Working at 65? Medicare Questions to Ask",
    status: "Planned",
    description:
      "A focused guide for people with employer coverage, spouse coverage, COBRA, retiree coverage, Marketplace coverage, VA/TRICARE, or HSA concerns around Medicare timing.",
    source: "Will use Medicare.gov Part A/B Special Enrollment Period and employer coverage guidance.",
  },
] as const;

const standards = [
  "One direct answer before details.",
  "No plan recommendations, affiliate language, rankings, or lead forms.",
  "Official-source notes on every guide page.",
  "Evergreen wording unless current-year numbers are freshly verified.",
  "PDF artifact, desktop review, phone review, and black-and-white print review before public download.",
] as const;

const QuickGuidesLibraryPage = () => {
  useSeo({
    title: "Quick Guides for Medicare, Medicaid, Discharge, and Medical Bills",
    description:
      "A growing library of plain-English healthcare finance quick guides for Medicare, Medicaid, hospital discharge, rehab, long-term care, and confusing medical bills.",
    canonicalPath: "/guides",
  });

  return (
    <main>
      <PageHero
        eyebrow="Printable healthcare-finance guides"
        title="Quick guides for the moments when healthcare paperwork gets confusing"
        description="Short, calm, source-grounded guides for families, patients, caregivers, and healthcare workers. Each guide is built to answer one practical question: what should I check next?"
      >
        <Button asChild size="lg">
          <Link to="/guides/hospital-discharge-medicare">
            Start with discharge guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/medicare-care-costs#cost-estimator">Use Medicare cost tool</Link>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Live guides">
        <SectionHeading
          eyebrow="Available now"
          title="Live quick guides"
          description="These are the guides with a public hub or PDF path available for launch review."
          centered
        />
        <div className="grid gap-5 md:grid-cols-2">
          {liveGuides.map((guide) => (
            <Card key={guide.title} className="rounded-3xl border-border/80 bg-card shadow-card">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{guide.status}</p>
                <CardTitle className="font-display text-2xl leading-tight">{guide.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={guide.href}>
                    {guide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Next guides">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Next build queue"
            title="The next quick guides should answer enrollment questions"
            description="Medicare and Medicaid sign-up questions have high search intent, but they also need careful state, employer, timing, and documentation guardrails."
            centered
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {nextGuides.map((guide) => (
              <Card key={guide.title} className="rounded-3xl border-border/80 bg-card shadow-card">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    {guide.status === "Planned" ? <ClipboardCheck className="h-5 w-5" aria-hidden="true" /> : <BookOpenCheck className="h-5 w-5" aria-hidden="true" />}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{guide.status}</p>
                  <CardTitle className="font-display text-xl leading-tight md:text-2xl">{guide.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed md:text-base">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm leading-relaxed text-muted-foreground">
                    {guide.source}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Guide standards">
        <Card className="rounded-3xl border-border/80 bg-card shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Quick guide quality standard</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              These guides should feel simple enough for a stressed family member and careful enough for a healthcare worker to respect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {standards.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="rounded-3xl border-border/80 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">The library goal</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Build a trustworthy guide shelf: Medicare sign-up, Medicaid application, discharge, rehab, long-term care, medical bills, and employer coverage. The design should stay simple; the depth should come from better questions, better source notes, and better next steps.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default QuickGuidesLibraryPage;
