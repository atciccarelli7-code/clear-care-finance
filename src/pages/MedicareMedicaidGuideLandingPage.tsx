import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Hospital,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const quickGuideHref = "/guides/hospital-discharge-medicare-quick-guide.pdf";

const whoThisIsFor = [
  "You’re helping a parent after a hospital stay.",
  "You’re the family member everyone expects to understand the insurance.",
  "You’re younger, busy, and suddenly dealing with Medicare words.",
  "You work in healthcare and want a plain-English way to explain the money side.",
  "You got a bill, denial, or discharge plan and need to know what to ask next.",
] as const;

const quickChecks = [
  ["Status", "Ask whether the patient is inpatient, outpatient, or observation."],
  ["Payer", "Identify Original Medicare, Medicare Advantage, Medicaid, both, or another payer."],
  ["Approval", "Ask if care is covered, pending, denied, ending, or waiting on authorization."],
  ["Documents", "Match what you were told to the notice, MSN, EOB, bill, or plan document."],
  ["Next call", "Write down who answered, what they said, the date, reference number, and deadline."],
] as const;

const situationCards = [
  {
    icon: Hospital,
    title: "Discharge or observation status",
    description: "Start by confirming the official hospital status, where the patient is going next, and who has actually approved payment.",
    questions: ["Is the patient inpatient, outpatient, or observation?", "What care is ordered after discharge?", "Who is expected to pay?"],
    href: "/articles/discharge-coverage-guide",
  },
  {
    icon: ShieldCheck,
    title: "Rehab, SNF, or plan authorization",
    description: "A clinician recommendation and payer approval are separate. Ask whether skilled need, facility fit, and authorization are documented.",
    questions: ["What skilled service is documented?", "Has authorization been approved or denied?", "What is the appeal deadline?"],
    href: "/articles/does-medicare-cover-rehab-after-hospital-stay",
  },
  {
    icon: ReceiptText,
    title: "Confusing medical bill",
    description: "Do not pay a confusing balance until the bill matches the processed claim story from the MSN, EOB, or plan paperwork.",
    questions: ["What date of service is this for?", "Does it match the MSN or EOB?", "Why is this patient responsibility?"],
    href: "/articles/why-do-i-still-owe-money-with-medicare",
  },
  {
    icon: BookOpenCheck,
    title: "Medicare, Medicaid, and long-term care",
    description: "Medicare, Medicaid, skilled care, and custodial long-term care answer different questions. Start by naming the program and the type of help needed.",
    questions: ["Does the person have Medicare, Medicaid, both, or neither?", "Is this skilled care or daily living help?", "Which state agency or SHIP contact can verify it?"],
    href: "/articles/medicare-vs-medicaid-what-is-the-difference",
  },
] as const;

const tools = [
  ["Medicare cost exposure tool", "/medicare-care-costs#cost-estimator"],
  ["EOB-to-bill match checker", "/tools/eob-to-bill-match-checker"],
  ["Out-of-pocket max estimator", "/tools/out-of-pocket-max-estimator"],
  ["Medicare Advantage plan helper", "/tools/medicare-advantage-plan-helper"],
] as const;

const commonQuestions = [
  ["Does Medicare cover long-term nursing home care?", "/articles/does-medicare-cover-long-term-care"],
  ["Does Medicare pay for rehab after a hospital stay?", "/articles/does-medicare-cover-rehab-after-hospital-stay"],
  ["Why do I still owe money with Medicare?", "/articles/why-do-i-still-owe-money-with-medicare"],
  ["What is the difference between Medicare and Medicaid?", "/articles/medicare-vs-medicaid-what-is-the-difference"],
  ["What does observation status mean?", "/articles/observation-vs-inpatient-status"],
  ["What does prior authorization mean?", "/articles/prior-authorization-explained"],
] as const;

const MedicareMedicaidGuideLandingPage = () => {
  useSeo({
    title: "Help a Parent With Medicare, Medicaid, Rehab, or Long-Term Care",
    description:
      "A plain-English Medicare and Medicaid guide hub for families helping a parent with discharge, rehab, nursing home care, Medicare Advantage, Medicaid, and confusing medical bills.",
    canonicalPath: "/guides/medicare-medicaid-rehab-long-term-care",
  });

  return (
    <main>
      <PageHero
        eyebrow="For the family member trying to figure this out"
        title="Trying to help a parent through Medicare, Medicaid, rehab, long-term care, or a confusing hospital bill?"
        description="Start with the downloadable Quick Guide, then use the tools and articles below to go deeper. The goal is not to make you an insurance expert; it is to help you ask the right question before discharge, rehab, long-term care, Medicaid, or billing decisions move too fast."
      >
        <Button asChild size="lg">
          <a href={quickGuideHref} download>
            <FileText className="h-4 w-4" />
            Download the Quick Guide
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/medicare-care-costs#cost-estimator">
            Use the Medicare cost tool
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14" aria-label="Who this guide hub is for">
        <Card className="rounded-3xl border-border/80 bg-card shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Who this is really for</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The person with Medicare may not be the person searching. A lot of the time, the viewer is the son, daughter, spouse, nurse, or friend trying to translate the system fast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {whoThisIsFor.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Five checks">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Use this first"
            title="The five checks that make the guide easier"
            description="Before you get lost in Medicare, Medicaid, or facility rules, slow the situation down into five practical checks."
            centered
          />
          <div className="grid gap-4 md:grid-cols-5">
            {quickChecks.map(([title, description], index) => (
              <Card key={title} className="rounded-3xl border-border/80 shadow-card">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <CardTitle className="text-base leading-snug">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-16" aria-label="Choose your situation">
        <SectionHeading
          eyebrow="Start with the problem in front of you"
          title="What are you dealing with right now?"
          description="Pick the closest situation. Each card gives you the plain-English frame and the first questions to ask."
          centered
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {situationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="rounded-3xl border-border/80 bg-card shadow-card">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl leading-tight md:text-2xl">{card.title}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-relaxed md:text-base">{card.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />3 questions to ask
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {card.questions.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={card.href}>
                      Read related article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Download status">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-display text-2xl">Download the Quick Guide</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                The public Quick Guide PDF is available for launch review. Use it as a fast, printable starting point before discharge, rehab, long-term care, Medicaid, or medical-bill conversations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="mb-2 text-sm font-bold text-foreground">What is ready now</p>
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <li>Viewer-first Quick Guide PDF</li>
                    <li>Public PDF path in the site repository</li>
                    <li>Connected tools and articles</li>
                    <li>Artifact workflow for repeatable PDF generation</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="mb-2 text-sm font-bold text-foreground">What still gets reviewed</p>
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <li>Desktop and phone readability</li>
                    <li>Black-and-white print quality</li>
                    <li>Direct production PDF URL after merge</li>
                    <li>Sitemap and QR destinations after URL testing</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                Educational only. Not medical, legal, tax, insurance, Medicaid planning, or individualized financial advice. Not affiliated with or endorsed by any hospital, employer, insurer, Medicare, Medicaid, CMS, state agency, or professional organization.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href={quickGuideHref} download>
                    <FileText className="h-4 w-4" />
                    Download the Quick Guide
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/medicare-care-costs#cost-estimator">
                    Use Medicare cost tool
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to="/disclosures">Read disclosures</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-label="Connected tools">
        <SectionHeading
          eyebrow="Use next"
          title="Tools connected to the guide"
          description="Use the guide to understand what to ask, then use the tools to estimate exposure, compare documents, or organize the next step."
          centered
        />
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map(([title, href]) => (
            <Card key={href} className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Calculator className="h-4 w-4" aria-hidden="true" />
                </div>
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
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Common questions">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Common family questions"
            title="The things people search when they are suddenly responsible for helping"
            description="Start with the question closest to yours, then use the linked article or tool to go one level deeper."
            centered
          />
          <div className="grid gap-4 md:grid-cols-2">
            {commonQuestions.map(([title, href]) => (
              <Link
                key={href}
                to={href}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-sm transition-smooth hover:border-primary/40 hover:shadow-card"
              >
                <span>{title}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <Card className="rounded-3xl border-border/80 bg-primary-soft/30 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
              <ListChecks className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Built for the person who has to figure it out</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              This page is designed as a calm first stop for the family member translating the system. Use it to organize the problem, identify the right document or payer, and verify the answer with the official source or professional who actually controls the decision.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
};

export default MedicareMedicaidGuideLandingPage;
