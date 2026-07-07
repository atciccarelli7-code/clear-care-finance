import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ClipboardCheck,
  FileQuestion,
  FileText,
  HandCoins,
  HeartPulse,
  HelpCircle,
  Hospital,
  ListChecks,
  ReceiptText,
  Scale,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type SituationPath = {
  id: string;
  number: string;
  shortLabel: string;
  icon: LucideIcon;
  title: string;
  description: string;
  thingsToKnow: string[];
  questionsToAsk: string[];
  tools: { label: string; href: string }[];
  articles: { label: string; href: string }[];
  sourceNote: string;
};

const calculators = [
  ["Medicare cost exposure tool", "/medicare-care-costs#cost-estimator"],
  ["EOB-to-bill match checker", "/tools/eob-to-bill-match-checker"],
  ["Out-of-pocket max estimator", "/tools/out-of-pocket-max-estimator"],
  ["Medicare Advantage plan helper", "/tools/medicare-advantage-plan-helper"],
] as const;

const commonQuestions = [
  ["Does Medicare cover long-term care?", "/articles/does-medicare-cover-long-term-care"],
  ["Does Medicare cover rehab after a hospital stay?", "/articles/does-medicare-cover-rehab-after-hospital-stay"],
  ["Why do I still owe money if Medicare paid?", "/articles/why-do-i-still-owe-money-with-medicare"],
  ["What is the difference between Medicare and Medicaid?", "/articles/medicare-vs-medicaid-what-is-the-difference"],
  ["What is observation status?", "/articles/observation-vs-inpatient-status"],
  ["What is prior authorization?", "/articles/prior-authorization-explained"],
  ["What should I ask before discharge?", "/articles/discharge-coverage-guide"],
  ["What should I compare before paying a bill?", "/articles/how-to-read-an-eob"],
] as const;

const situationPaths: SituationPath[] = [
  {
    id: "discharge",
    number: "01",
    shortLabel: "Hospital discharge",
    icon: Hospital,
    title: "I’m being discharged from the hospital",
    description:
      "Start with hospital status, destination, skilled need, payer, authorization, and written notices. Discharge planning is not just a location decision; it is also a coverage and documentation decision.",
    thingsToKnow: [
      "Inpatient, outpatient, and observation status can matter for the next step.",
      "A recommended discharge plan is not the same as payer approval.",
      "Written notices, reference numbers, and appeal deadlines matter.",
    ],
    questionsToAsk: [
      "Is the patient inpatient, outpatient, or observation?",
      "What skilled care is being ordered and who documented it?",
      "What happens if coverage is denied or ends?",
    ],
    tools: [{ label: "Medicare cost tool", href: "/medicare-care-costs#cost-estimator" }],
    articles: [
      { label: "Discharge coverage guide", href: "/articles/discharge-coverage-guide" },
      { label: "Observation vs inpatient status", href: "/articles/observation-vs-inpatient-status" },
    ],
    sourceNote: "Built from the discharge, SNF, home health, DME, MOON, and appeals source notes in the guide manuscript.",
  },
  {
    id: "rehab-coverage",
    number: "02",
    shortLabel: "Rehab coverage",
    icon: Stethoscope,
    title: "I’m confused about rehab coverage",
    description:
      "Rehab coverage depends on setting, skilled need, facility rules, plan rules, and cost-sharing. A doctor or therapist recommendation is important, but it does not automatically mean the payer has approved the stay.",
    thingsToKnow: [
      "Short-term skilled rehab is different from long-term custodial care.",
      "Original Medicare and Medicare Advantage can operate differently.",
      "If coverage is denied or ending, appeal instructions and deadlines matter.",
    ],
    questionsToAsk: [
      "Is this SNF rehab, inpatient rehab, home health, or outpatient therapy?",
      "Is prior authorization required and approved?",
      "What daily cost or coinsurance could apply?",
    ],
    tools: [{ label: "Medicare cost tool", href: "/medicare-care-costs#cost-estimator" }],
    articles: [
      { label: "Rehab after a hospital stay", href: "/articles/does-medicare-cover-rehab-after-hospital-stay" },
      { label: "Short-term rehab after hospital", href: "/articles/short-term-rehab-after-hospital" },
    ],
    sourceNote: "Grounded in Medicare.gov skilled nursing facility, cost, Medicare Advantage, and appeals sources.",
  },
  {
    id: "long-term-care",
    number: "03",
    shortLabel: "Long-term care",
    icon: HeartPulse,
    title: "My parent may need long-term care",
    description:
      "This is where families often confuse Medicare and Medicaid. Medicare generally does not pay for most long-term custodial care, while Medicaid may become relevant for eligible people under state rules.",
    thingsToKnow: [
      "Needing help with daily living is real, but it is not always Medicare-covered.",
      "Medicaid long-term services and supports are state-specific.",
      "Estate recovery and spousal impoverishment are caution topics, not DIY planning areas.",
    ],
    questionsToAsk: [
      "Is the main need skilled care or custodial care?",
      "Which state Medicaid agency applies?",
      "Should we ask SHIP, aging resources, or an elder-law attorney for guidance?",
    ],
    tools: [{ label: "Medicare cost tool", href: "/medicare-care-costs#cost-estimator" }],
    articles: [
      { label: "Does Medicare cover long-term care?", href: "/articles/does-medicare-cover-long-term-care" },
      { label: "Medicaid, dual eligibility, and LTSS", href: "/articles/medicaid-dual-eligibility-ltss" },
    ],
    sourceNote: "Grounded in Medicare.gov long-term care and Medicaid.gov LTSS, eligibility, estate recovery, and spousal impoverishment sources.",
  },
  {
    id: "medical-bill",
    number: "04",
    shortLabel: "Medical bill",
    icon: ReceiptText,
    title: "I got a confusing medical bill",
    description:
      "Do not assume the bill is right, and do not assume it is wrong. First match the provider bill against the Medicare Summary Notice, Explanation of Benefits, or plan paperwork.",
    thingsToKnow: [
      "A Medicare Summary Notice is not a bill.",
      "One episode of care can create multiple bills from different providers.",
      "Covered does not always mean free; cost-sharing can still apply.",
    ],
    questionsToAsk: [
      "What date of service and provider is this bill for?",
      "What did Medicare or the plan pay?",
      "Why is this amount listed as patient responsibility?",
    ],
    tools: [
      { label: "EOB-to-bill checker", href: "/tools/eob-to-bill-match-checker" },
      { label: "Out-of-pocket max estimator", href: "/tools/out-of-pocket-max-estimator" },
    ],
    articles: [
      { label: "Why do I still owe money with Medicare?", href: "/articles/why-do-i-still-owe-money-with-medicare" },
      { label: "How to read an EOB", href: "/articles/how-to-read-an-eob" },
    ],
    sourceNote: "Built from Medicare Summary Notice, appeals, Medicare costs, and health insurance glossary source notes.",
  },
  {
    id: "medicare-advantage",
    number: "05",
    shortLabel: "Medicare Advantage",
    icon: ShieldCheck,
    title: "I have Medicare Advantage",
    description:
      "Medicare Advantage is still Medicare, but it can involve networks, plan rules, and prior authorization. This path helps families ask process questions without turning into anti-plan or sales language.",
    thingsToKnow: [
      "A clinician recommendation and plan approval are separate steps.",
      "Some services or supplies may require prior authorization.",
      "A denial or payment decision should come with appeal information.",
    ],
    questionsToAsk: [
      "Is this provider or facility in-network?",
      "Was authorization submitted and approved?",
      "What is the appeal deadline if denied?",
    ],
    tools: [{ label: "Medicare Advantage plan helper", href: "/tools/medicare-advantage-plan-helper" }],
    articles: [
      { label: "Prior authorization explained", href: "/articles/prior-authorization-explained" },
      { label: "Medicare Advantage comparison", href: "/insurance/medicare-advantage" },
    ],
    sourceNote: "Grounded in Medicare.gov Medicare Advantage comparison, plan options, appeals, and CMS managed care appeals guidance.",
  },
  {
    id: "medicare-vs-medicaid",
    number: "06",
    shortLabel: "Medicare vs Medicaid",
    icon: Scale,
    title: "I’m trying to understand Medicare vs Medicaid",
    description:
      "Start here when the words sound similar but the problem is different. Medicare is federal health insurance; Medicaid is state-administered assistance under federal rules.",
    thingsToKnow: [
      "Medicare and Medicaid answer different questions.",
      "Some people have both programs and are called dually eligible.",
      "State Medicaid rules matter for long-term services and supports.",
    ],
    questionsToAsk: [
      "Does the person have Medicare, Medicaid, both, or neither?",
      "Is this medical care, skilled care, or long-term daily support?",
      "Which official source or agency can verify the answer?",
    ],
    tools: [{ label: "Medicare care cost hub", href: "/medicare-care-costs" }],
    articles: [
      { label: "Medicare vs Medicaid", href: "/articles/medicare-vs-medicaid-what-is-the-difference" },
      { label: "Medicare options explained", href: "/articles/medicare-options-explained" },
    ],
    sourceNote: "Grounded in Medicare.gov basics, Medicaid.gov eligibility policy, Medicaid.gov LTSS, and CMS coordination sources.",
  },
  {
    id: "dual-eligibility",
    number: "07",
    shortLabel: "Medicaid help",
    icon: HandCoins,
    title: "I need help with Medicaid or dual eligibility",
    description:
      "This path is for families trying to understand Medicaid help, Medicare Savings Programs, QMB, dual eligibility, and long-term services and supports. It points people to state verification, not eligibility promises.",
    thingsToKnow: [
      "Medicaid rules vary by state and eligibility category.",
      "Medicare Savings Programs may help eligible people with some Medicare costs.",
      "Full Medicaid and limited Medicaid help are not the same thing.",
    ],
    questionsToAsk: [
      "Does the person have full Medicaid or limited Medicaid help?",
      "Is the person enrolled in QMB, SLMB, QI, or QDWI?",
      "Which state Medicaid office or SHIP contact can verify this?",
    ],
    tools: [{ label: "Medicare care cost hub", href: "/medicare-care-costs" }],
    articles: [
      { label: "Medicaid and dual eligibility", href: "/articles/medicaid-dual-eligibility-ltss" },
      { label: "Medicare vs Medicaid", href: "/articles/medicare-vs-medicaid-what-is-the-difference" },
    ],
    sourceNote: "Built from CMS Medicare-Medicaid coordination, Medicare Savings Program, QMB, and Medicaid.gov eligibility sources.",
  },
  {
    id: "definitions",
    number: "08",
    shortLabel: "Definitions",
    icon: BookOpenCheck,
    title: "I just want the plain-English definitions",
    description:
      "Use this if you are overwhelmed and need the vocabulary first. Definitions should help you ask better questions, not make you feel like you need to become an insurance expert.",
    thingsToKnow: [
      "Deductible, copay, coinsurance, and out-of-pocket max are not the same thing.",
      "MSN, EOB, provider bill, and plan denial are different documents.",
      "Definitions are a starting point; plan documents and official sources still control your situation.",
    ],
    questionsToAsk: [
      "Which word or document is confusing me right now?",
      "Is this a coverage question, billing question, or eligibility question?",
      "Who can verify the official answer?",
    ],
    tools: [{ label: "Glossary", href: "/glossary" }],
    articles: [
      { label: "Plain-English glossary", href: "/articles/plain-english-glossary" },
      { label: "Deductible, copay, coinsurance, out-of-pocket max", href: "/articles/deductible-copay-coinsurance-out-of-pocket-max" },
    ],
    sourceNote: "Grounded in the guide glossary, HealthCare.gov glossary terms, Medicare.gov, Medicaid.gov, and CMS source notes.",
  },
];

const useSteps = [
  ["Pick your situation", "Start with the card closest to what is happening right now."],
  ["Read the 3 things to know", "Get the basic coverage frame before calling anyone."],
  ["Use the tool or article", "Estimate exposure, compare a bill, or read the linked plain-English explanation."],
  ["Verify before deciding", "Confirm with Medicare, Medicaid, your plan, the facility, billing office, SHIP, or a qualified professional."],
] as const;

const comparisonCards = [
  {
    title: "Medicare vs Medicaid",
    leftLabel: "Medicare",
    leftText: "Federal health insurance, usually tied to age, disability, or certain conditions.",
    rightLabel: "Medicaid",
    rightText: "State-administered assistance under federal rules; often important for eligible people needing long-term services and supports.",
  },
  {
    title: "Skilled care vs custodial care",
    leftLabel: "Skilled care",
    leftText: "Care that requires nursing or therapy skill and documentation.",
    rightLabel: "Custodial care",
    rightText: "Ongoing help with daily living, such as bathing, dressing, toileting, meals, supervision, and transportation.",
  },
] as const;

const miniFlows = [
  {
    icon: ClipboardCheck,
    title: "Before discharge",
    steps: ["Confirm hospital status", "Ask what skilled need is documented", "Verify payer and authorization", "Ask what happens if coverage ends"],
  },
  {
    icon: ReceiptText,
    title: "Before paying a bill",
    steps: ["Match date of service", "Compare bill to MSN or EOB", "Ask why amount is patient responsibility", "Ask about appeal, rebill, or financial assistance"],
  },
  {
    icon: SearchCheck,
    title: "Before assuming Medicaid help",
    steps: ["Identify the state agency", "Confirm full vs limited help", "Ask about LTSS rules", "Get professional help for legal planning questions"],
  },
] as const;

const MedicareMedicaidGuideLandingPage = () => {
  useSeo({
    title: "Free Medicare, Medicaid, Rehab, and Long-Term Care Family Guide",
    description:
      "A visual Medicare and Medicaid guide hub for patients, caregivers, and families facing discharge, rehab, long-term care, Medicaid, Medicare Advantage, and medical bill questions.",
    canonicalPath: "/guides/medicare-medicaid-rehab-long-term-care",
  });

  return (
    <main>
      <PageHero
        eyebrow="Free guide hub in source review"
        title="Medicare, Medicaid, rehab, long-term care, and bills — organized by the situation you’re facing"
        description="A visual, plain-English starting point for patients, caregivers, families, and healthcare workers trying to ask better questions during discharge planning, rehab decisions, long-term care conversations, Medicare Advantage issues, Medicaid questions, and medical bill confusion."
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

      <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14" aria-label="How to use this page">
        <div className="grid gap-4 md:grid-cols-4">
          {useSteps.map(([title, description], index) => (
            <Card key={title} className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <CardTitle className="font-display text-lg">{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-10 md:pb-14" aria-label="Situation shortcuts">
        <Card className="rounded-3xl border-border/80 bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">Jump to the section that matches your situation</CardTitle>
            <CardDescription>
              The full guide hub is detailed. These shortcuts reduce scrolling on mobile and help families start with the right question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {situationPaths.map((path) => (
                <a
                  key={path.id}
                  href={`#${path.id}`}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-smooth hover:border-primary/40 hover:bg-primary-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="mr-2 text-xs font-bold text-primary">{path.number}</span>
                  {path.shortLabel}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 py-12 md:py-16" aria-label="Choose your situation">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Choose your situation"
            title="Start where the family actually is"
            description="Each path gives you the core concept, the first questions to ask, and the tool or article that fits the moment."
            centered
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {situationPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card key={path.title} id={path.id} className="scroll-mt-24 rounded-3xl border-border/80 bg-card shadow-card">
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Path {path.number}</p>
                        <CardTitle className="font-display text-xl leading-tight md:text-2xl">{path.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-relaxed md:text-base">{path.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-background/70 p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                          <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />3 things to know
                        </h3>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {path.thingsToKnow.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/70 p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                          <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />3 questions to ask
                        </h3>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {path.questionsToAsk.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Related tools</p>
                        <div className="flex flex-wrap gap-2">
                          {path.tools.map((tool) => (
                            <Button key={tool.href} asChild variant="soft" size="sm">
                              <Link to={tool.href}>{tool.label}</Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Related reading</p>
                        <div className="flex flex-wrap gap-2">
                          {path.articles.map((article) => (
                            <Button key={article.href} asChild variant="outline" size="sm">
                              <Link to={article.href}>{article.label}</Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Source/trust note: </span>
                      {path.sourceNote}
                    </div>

                    <Button asChild variant="ghost" size="sm" className="px-0">
                      <a href="#download-status">
                        Jump to guide status
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <SectionHeading
          eyebrow="Visual shortcuts"
          title="Two comparisons families usually need first"
          description="These are not full rules. They are fast orientation cards that point you toward the right next question."
          centered
        />
        <div className="grid gap-6 md:grid-cols-2">
          {comparisonCards.map((card) => (
            <Card key={card.title} className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-2xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-primary-soft/60 p-4">
                  <p className="mb-2 text-sm font-bold text-primary">{card.leftLabel}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.leftText}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary-soft/60 p-4">
                  <p className="mb-2 text-sm font-bold text-secondary">{card.rightLabel}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.rightText}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Mini checklists"
            title="Three quick flows for stressful moments"
            description="These do not replace official answers. They help you structure the next phone call, discharge conversation, or billing review."
            centered
          />
          <div className="grid gap-5 md:grid-cols-3">
            {miniFlows.map((flow) => {
              const Icon = flow.icon;
              return (
                <Card key={flow.title} className="rounded-3xl border-border/80 shadow-card">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="font-display text-xl">{flow.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {flow.steps.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs font-bold text-primary ring-1 ring-border">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <SectionHeading
          eyebrow="Common family questions"
          title="The questions people search when they are already stressed"
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
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16" id="download-status">
        <Card className="rounded-3xl border-border/80 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <FileQuestion className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Why the download is not live yet</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              The manuscript, source review, print workflow, and artifact workflow are built, but the final public PDF is intentionally held until the generated artifact passes manual visual, mobile, print, and QR review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="mb-2 text-sm font-bold text-foreground">What is ready now</p>
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <li>Guide landing hub</li>
                  <li>Connected tools and articles</li>
                  <li>Source-reviewed manuscript workflow</li>
                  <li>Internal PDF artifact workflow</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="mb-2 text-sm font-bold text-foreground">What must happen before release</p>
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <li>Run the GitHub Actions PDF artifact workflow</li>
                  <li>Inspect the PDF on desktop and mobile</li>
                  <li>Print sample pages in black and white</li>
                  <li>Generate and test final QR codes later</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
              Educational only. Not medical, legal, tax, insurance, Medicaid planning, or individualized financial advice. Not affiliated with or endorsed by any hospital, employer, insurer, Medicare, Medicaid, CMS, state agency, or professional organization.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" disabled title="The final downloadable PDF is not public yet.">
                <FileText className="h-4 w-4" />
                Download guide — source review in progress
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
      </section>

      <section className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24">
        <Card className="rounded-3xl border-border/80 bg-primary-soft/30 shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Built to help families ask better questions</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              This page is designed as a calm first stop, not a sales funnel. Use it to organize the problem, identify the right document or payer, and verify the answer with the official source or professional who actually controls the decision.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
};

export default MedicareMedicaidGuideLandingPage;
