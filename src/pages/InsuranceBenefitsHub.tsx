import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Hospital,
  Network,
  Pill,
  Receipt,
  Shield,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

type HubCard = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

type Pathway = {
  title: string;
  body: string;
  steps: { label: string; href: string }[];
};

const decisionPathways: Pathway[] = [
  {
    title: "Leaving the hospital",
    body: "Use when the family is hearing no walker, no STR days, pending authorization, home health confusion, or unclear discharge coverage.",
    steps: [
      { label: "Discharge coverage guide", href: "/insurance/hospital-discharge-coverage" },
      { label: "Printable discharge checklist", href: "/insurance/hospital-discharge-coverage/printable" },
      { label: "Prior authorization guide", href: "/tools/prior-authorization-next-step-guide" },
    ],
  },
  {
    title: "Choosing a commercial plan",
    body: "Use before open enrollment decisions, especially when someone is comparing employer plans, Marketplace plans, medications, or network tradeoffs.",
    steps: [
      { label: "Plan types guide", href: "/insurance/health-insurance-plan-types" },
      { label: "How to read an SBC", href: "/insurance/how-to-read-an-sbc" },
      { label: "Commercial comparison framework", href: "/insurance/commercial-insurance-comparison" },
    ],
  },
  {
    title: "Bill or claim confusion",
    body: "Use after care when the patient receives an EOB, provider bill, deductible surprise, facility-fee question, or out-of-pocket maximum concern.",
    steps: [
      { label: "How to read an EOB", href: "/articles/how-to-read-an-eob" },
      { label: "Deductible and out-of-pocket max basics", href: "/articles/deductible-copay-coinsurance-out-of-pocket-max" },
      { label: "Facility fee vs professional fee", href: "/articles/facility-fee-vs-professional-fee" },
      { label: "Medical bill review toolkit", href: "/insurance/medical-bill-review-toolkit" },
      { label: "EOB-to-bill checker", href: "/tools#eob-bill-match" },
      { label: "Out-of-pocket max estimator", href: "/tools/out-of-pocket-max-estimator" },
    ],
  },
];

const situationCards: HubCard[] = [
  {
    eyebrow: "Medical bill or EOB",
    title: "Check the bill before paying.",
    body: "Match the provider bill to the insurer explanation, allowed amount, insurance payment, and patient responsibility.",
    href: "/insurance/medical-bill-review-toolkit",
    cta: "Review a medical bill",
    icon: Receipt,
  },
  {
    eyebrow: "Hospital discharge",
    title: "Coverage is unclear before leaving the hospital.",
    body: "Understand DME, walkers, STR/SNF, home health, transport, custodial care gaps, authorizations, and backup questions.",
    href: "/insurance/hospital-discharge-coverage",
    cta: "Understand discharge coverage",
    icon: Hospital,
  },
  {
    eyebrow: "Open enrollment",
    title: "Compare benefits by total cost.",
    body: "Look past the paycheck deduction and compare premium, deductible exposure, medication costs, tax accounts, and bad-year risk.",
    href: "/open-enrollment",
    cta: "Open benefits guide",
    icon: ClipboardCheck,
  },
  {
    eyebrow: "Plan names",
    title: "Understand HMO, PPO, EPO, POS, and HDHP first.",
    body: "Use the plain-English guide before entering numbers into a calculator or judging a plan by the insurance company logo.",
    href: "/insurance/health-insurance-plan-types",
    cta: "Learn plan types",
    icon: Network,
  },
  {
    eyebrow: "SBC guide",
    title: "Read the Summary of Benefits and Coverage before comparing plans.",
    body: "Use the SBC guide to spot premium, deductible, out-of-pocket max, exclusions, prescriptions, network rules, and authorization traps.",
    href: "/insurance/how-to-read-an-sbc",
    cta: "Read an SBC",
    icon: FileText,
  },
  {
    eyebrow: "Commercial insurance",
    title: "Compare employer or Marketplace plans without stale rankings.",
    body: "Use a manual framework to compare total cost, bad-year exposure, network fit, medication coverage, and prior authorization risk.",
    href: "/insurance/commercial-insurance-comparison",
    cta: "Compare plan options",
    icon: Shield,
  },
  {
    eyebrow: "Medicare decisions",
    title: "Understand Medicare, Medicaid, and long-term care costs.",
    body: "Use the decision hub to estimate Medicare cost risk, separate program rules, and spot the long-term care gap before a crisis.",
    href: "/medicare-care-costs",
    cta: "Open Medicare hub",
    icon: HeartPulse,
  },
];

const primaryTools: HubCard[] = [
  {
    eyebrow: "Beginner-friendly",
    title: "Health Insurance Plan Types Guide",
    body: "Start with HMO, PPO, EPO, POS, HDHP, metal levels, and what actually differs between carrier logos.",
    href: "/insurance/health-insurance-plan-types",
    cta: "Start here",
    icon: Network,
  },
  {
    eyebrow: "Hospital discharge",
    title: "Printable Discharge Checklist",
    body: "Print or save a one-page family checklist for DME, STR/SNF, home health, authorization, network status, patient cost, and backup plans.",
    href: "/insurance/hospital-discharge-coverage/printable",
    cta: "Print checklist",
    icon: Hospital,
  },
  {
    eyebrow: "Hospital discharge",
    title: "Discharge Coverage Checklist",
    body: "Build a family checklist for DME, short-term rehab, home health, oxygen, transport, authorizations, and noncovered care gaps.",
    href: "/insurance/hospital-discharge-coverage#coverage-checklist",
    cta: "Build checklist",
    icon: Hospital,
  },
  {
    eyebrow: "Best first tool",
    title: "EOB-to-Bill Match Checker",
    body: "Use when the insurer explanation and provider bill do not obviously match.",
    href: "/tools#eob-bill-match",
    cta: "Open checker",
    icon: Receipt,
  },
  {
    eyebrow: "Best first tool",
    title: "Commercial Insurance Comparison Framework",
    body: "Compare employer or Marketplace plans by premium, deductible, out-of-pocket max, network fit, medications, and bad-year exposure.",
    href: "/insurance/commercial-insurance-comparison#comparison-tool",
    cta: "Compare plans",
    icon: Shield,
  },
  {
    eyebrow: "Best first tool",
    title: "Open Enrollment True Cost Calculator",
    body: "Compare two health plans by annual premium, expected care, employer account money, and bad-year exposure.",
    href: "/tools#open-enrollment",
    cta: "Run comparison",
    icon: Shield,
  },
  {
    eyebrow: "Medicare",
    title: "Medicare Out-of-Pocket Risk Estimator",
    body: "Estimate Part B premiums, hospital exposure, skilled nursing coinsurance, drug costs, Medigap premiums, and Medicare Advantage copays.",
    href: "/medicare-care-costs#cost-estimator",
    cta: "Estimate Medicare risk",
    icon: HeartPulse,
  },
  {
    eyebrow: "Cost ceiling",
    title: "Out-of-Pocket Max Estimator",
    body: "Estimate how close covered in-network care could bring someone to the yearly cost-sharing cap.",
    href: "/tools/out-of-pocket-max-estimator",
    cta: "Estimate cap",
    icon: Shield,
  },
  {
    eyebrow: "Payroll",
    title: "Open Enrollment Paycheck Impact Calculator",
    body: "Estimate how benefit elections may affect take-home pay before the first plan-year paycheck arrives.",
    href: "/tools#paycheck-impact",
    cta: "Estimate paycheck",
    icon: WalletCards,
  },
];

const deeperQuestions: HubCard[] = [
  {
    eyebrow: "Insurance basics",
    title: "Deductible, copay, coinsurance, and out-of-pocket max",
    body: "The four numbers that decide what covered care may cost.",
    href: "/articles/deductible-copay-coinsurance-out-of-pocket-max",
    cta: "Read basics",
    icon: Shield,
  },
  {
    eyebrow: "Plan documents",
    title: "How to read a Summary of Benefits and Coverage",
    body: "Learn which SBC rows matter before choosing a plan or using the commercial comparison builder.",
    href: "/insurance/how-to-read-an-sbc",
    cta: "Read SBC guide",
    icon: FileText,
  },
  {
    eyebrow: "Family coverage",
    title: "Should you use your spouse's health insurance?",
    body: "Compare spouse surcharge rules, family deductibles, child coverage, networks, medications, and two-employer plan choices.",
    href: "/articles/spouse-family-health-insurance-open-enrollment",
    cta: "Compare coverage",
    icon: Hospital,
  },
  {
    eyebrow: "Post-hospital care",
    title: "Why discharge coverage gets denied",
    body: "Use this when a family is told there are no STR days, no covered walker, no home aide coverage, or authorization is pending.",
    href: "/insurance/hospital-discharge-coverage#why-denied",
    cta: "See denial reasons",
    icon: Hospital,
  },
  {
    eyebrow: "Medications",
    title: "Check prescriptions before picking a plan",
    body: "Look for formularies, tiers, preferred pharmacies, prior authorization, step therapy, and specialty costs.",
    href: "/articles/prescription-coverage-open-enrollment-checklist",
    cta: "Open checklist",
    icon: Pill,
  },
  {
    eyebrow: "Add-on policies",
    title: "Accident, critical illness, and hospital indemnity",
    body: "Decide whether supplemental policies are useful protection or another paycheck leak.",
    href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment",
    cta: "Review add-ons",
    icon: BadgeCheck,
  },
  {
    eyebrow: "Tax accounts",
    title: "HSA vs FSA Decision Helper",
    body: "Compare tax savings, employer HSA money, HDHP risk, and FSA forfeiture risk.",
    href: "/tools#hsa-fsa",
    cta: "Compare accounts",
    icon: FileText,
  },
  {
    eyebrow: "Care delays",
    title: "Prior authorization survival guide",
    body: "Use call scripts and checklists when a medication, imaging test, procedure, rehab stay, DME, or equipment request is delayed.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Open guide",
    icon: ClipboardCheck,
  },
];

const CardLink = ({ card, section }: { card: HubCard; section: string }) => {
  const Icon = card.icon;

  return (
    <Link
      to={card.href}
      onClick={() => trackSiteEvent("pathway_click", { page: "insurance_hub", section, destination: card.href, label: card.title })}
      className="group rounded-3xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover md:p-6"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{card.eyebrow}</div>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight text-foreground">{card.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
        {card.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

const PathwayCard = ({ pathway }: { pathway: Pathway }) => (
  <Card className="rounded-3xl border-border/80 shadow-card">
    <CardHeader>
      <BadgeCheck className="mb-2 h-5 w-5 text-primary" />
      <CardTitle className="font-display text-2xl leading-tight">{pathway.title}</CardTitle>
      <CardDescription className="text-sm leading-relaxed">{pathway.body}</CardDescription>
    </CardHeader>
    <CardContent>
      <ol className="space-y-3">
        {pathway.steps.map((step, index) => (
          <li key={step.href}>
            <Link
              to={step.href}
              onClick={() => trackSiteEvent("pathway_click", { page: "insurance_hub", pathway: pathway.title, destination: step.href, label: step.label })}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3 text-sm font-semibold text-foreground transition-smooth hover:border-primary/40 hover:bg-primary-soft/30"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">{index + 1}</span>
              <span className="flex-1">{step.label}</span>
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
);

export const InsuranceBenefitsHub = () => {
  useSeo({
    title: "Benefits and Insurance Tools",
    description:
      "Plain-English benefits and insurance tools for EOBs, medical bills, discharge coverage, plan types, commercial insurance comparisons, open enrollment, out-of-pocket costs, spouse coverage, supplemental policies, prescriptions, prior authorization, Medicare, Medicaid, and long-term care decisions.",
    canonicalPath: "/insurance",
  });

  return (
    <>
      <PageHero
        eyebrow="Benefits & Insurance"
        title="Pick the situation first. Then use the right tool."
        description="Use this hub when a bill, discharge plan, benefit choice, plan type, commercial comparison, prescription, prior authorization, Medicare decision, or long-term care cost question needs a practical next step."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/insurance/hospital-discharge-coverage" onClick={() => trackSiteEvent("pathway_click", { page: "insurance_hub", section: "hero", destination: "discharge" })}>Discharge coverage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/insurance/health-insurance-plan-types" onClick={() => trackSiteEvent("pathway_click", { page: "insurance_hub", section: "hero", destination: "plan_types" })}>Learn plan types</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/insurance/commercial-insurance-comparison" onClick={() => trackSiteEvent("pathway_click", { page: "insurance_hub", section: "hero", destination: "commercial_comparison" })}>Compare health plans</Link>
          </Button>
        </div>
      </PageHero>

      <main className="container space-y-14 py-12 md:py-16">
        <section>
          <SectionHeading
            centered
            eyebrow="Highest-value paths"
            title="Use the site like a decision tree"
            description="These paths connect the strongest pages so a visitor can move from a stressful situation to the right checklist, calculator, or verification step."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {decisionPathways.map((pathway) => (
              <PathwayCard key={pathway.title} pathway={pathway} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Start here"
            title="What decision are you facing?"
            description="Most people do not need every insurance article. They need the correct first move for the problem in front of them."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {situationCards.map((card) => (
              <CardLink key={card.href} card={card} section="situation" />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Primary tools"
            title="Use these when you need numbers or a checklist"
            description="Start with the situation. Then move into bills, discharge coverage, commercial plan comparison, Medicare risk, bad-year exposure, and paycheck impact."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {primaryTools.map((card) => (
              <CardLink key={card.href} card={card} section="primary_tools" />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Plain-English reminders</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Four things to verify before acting</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                The site can help you organize the question. The final answer still comes from the insurer, plan document, employer portal, Medicare.gov, state Medicaid agency, case management team, provider billing office, or receiving provider.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Covered does not always mean free.",
                "An EOB is usually not a bill.",
                "Lowest premium is not always lowest total cost.",
                "Networks, formularies, discharge rules, and authorization rules can change by plan year.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm font-semibold text-foreground shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="More specific questions"
            title="Go deeper only when the question fits"
            description="Use these after the first step, or when you already know the specific insurance issue you are dealing with."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {deeperQuestions.map((card) => (
              <CardLink key={card.href} card={card} section="deeper_questions" />
            ))}
          </div>
        </section>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Educational, not a live benefit verification</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Use these pages to understand the decision, organize questions, and spot what needs verification. Confirm live plan, claim, network, formulary, authorization, discharge, and billing details before acting.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/methodology">Read methodology</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/disclosures">Read disclosures</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default InsuranceBenefitsHub;
