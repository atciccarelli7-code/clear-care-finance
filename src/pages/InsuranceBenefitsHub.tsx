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
import { useSeo } from "@/lib/seo";

type HubCard = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

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
    eyebrow: "Family coverage",
    title: "Should you use your spouse's health insurance?",
    body: "Compare spouse surcharge rules, family deductibles, child coverage, networks, medications, and two-employer plan choices.",
    href: "/articles/spouse-family-health-insurance-open-enrollment",
    cta: "Compare coverage",
    icon: Hospital,
  },
  {
    eyebrow: "Medications",
    title: "Check prescriptions before picking a plan",
    body: "Look for formularies, tiers, preferred pharmacies, prior authorization, step therapy, and specialty costs.",
    href: "/insurance/medication-coverage-checklist",
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
    body: "Use call scripts and checklists when a medication, imaging test, procedure, or equipment request is delayed.",
    href: "/insurance/prior-authorization-guide",
    cta: "Open guide",
    icon: ClipboardCheck,
  },
];

const CardLink = ({ card }: { card: HubCard }) => {
  const Icon = card.icon;

  return (
    <Link
      to={card.href}
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

export const InsuranceBenefitsHub = () => {
  useSeo({
    title: "Benefits and Insurance Tools",
    description:
      "Plain-English benefits and insurance tools for EOBs, medical bills, plan types, commercial insurance comparisons, open enrollment, out-of-pocket costs, spouse coverage, supplemental policies, prescriptions, prior authorization, Medicare, Medicaid, and long-term care decisions.",
    canonicalPath: "/insurance",
  });

  return (
    <>
      <PageHero
        eyebrow="Benefits & Insurance"
        title="Pick the situation first. Then use the right tool."
        description="Use this hub when a bill, benefit choice, plan type, commercial comparison, prescription, prior authorization, Medicare decision, or long-term care cost question needs a practical next step."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/insurance/health-insurance-plan-types">Learn plan types</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/insurance/commercial-insurance-comparison">Compare health plans</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tools#eob-bill-match">Check a bill or EOB</Link>
          </Button>
        </div>
      </PageHero>

      <main className="container space-y-14 py-12 md:py-16">
        <section>
          <SectionHeading
            centered
            eyebrow="Start here"
            title="What decision are you facing?"
            description="Most people do not need every insurance article. They need the correct first move for the problem in front of them."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {situationCards.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Primary tools"
            title="Use these when you need numbers or a checklist"
            description="Start with plan types if the calculator feels intimidating. Then move into bills, commercial plan comparison, Medicare risk, bad-year exposure, and paycheck impact."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-7">
            {primaryTools.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Plain-English reminders</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Four things to verify before acting</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                The site can help you organize the question. The final answer still comes from the insurer, plan document, employer portal, Medicare.gov, state Medicaid agency, or provider billing office.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Covered does not always mean free.",
                "An EOB is usually not a bill.",
                "Lowest premium is not always lowest total cost.",
                "Networks, formularies, and authorization rules can change by plan year.",
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
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Educational, not a live benefit verification</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Use these pages to understand the decision, organize questions, and spot what needs verification. Confirm live plan, claim, network, formulary, authorization, and billing details before acting.
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
