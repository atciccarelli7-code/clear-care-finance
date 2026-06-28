import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Hospital,
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
    title: "Check what you actually may owe before paying.",
    body: "Compare the provider bill to the insurer's Explanation of Benefits, allowed amount, insurance payment, and patient responsibility.",
    href: "/insurance/medical-bill-review-toolkit",
    cta: "Review a medical bill",
    icon: Receipt,
  },
  {
    eyebrow: "Open enrollment",
    title: "Compare benefits by total cost, not paycheck deduction only.",
    body: "Estimate premiums, deductible exposure, out-of-pocket maximum risk, employer HSA/HRA money, medications, and paycheck impact.",
    href: "/open-enrollment",
    cta: "Open the benefits guide",
    icon: ClipboardCheck,
  },
  {
    eyebrow: "Medicare decisions",
    title: "Separate plan marketing from the details that matter in a bad year.",
    body: "Check doctors, hospitals, drugs, network rules, prior authorization, maximum out-of-pocket exposure, and Medigap timing.",
    href: "/insurance/medicare-advantage",
    cta: "Compare Medicare options",
    icon: HeartPulse,
  },
];

const toolCards: HubCard[] = [
  {
    eyebrow: "Bill review",
    title: "EOB-to-Bill Match Checker",
    body: "A quick checklist for spotting mismatches between an insurer explanation and a provider payment request.",
    href: "/tools#eob-bill-match",
    cta: "Open checker",
    icon: Receipt,
  },
  {
    eyebrow: "Plan comparison",
    title: "Open Enrollment True Cost Calculator",
    body: "Compare two health plans by annual premium, expected care, employer account money, and bad-year exposure.",
    href: "/tools#open-enrollment",
    cta: "Run comparison",
    icon: Shield,
  },
  {
    eyebrow: "Payroll",
    title: "Open Enrollment Paycheck Impact Calculator",
    body: "Estimate how medical, dental, vision, HSA/FSA, disability, life, and supplemental benefits may affect take-home pay.",
    href: "/tools#paycheck-impact",
    cta: "Estimate paycheck impact",
    icon: WalletCards,
  },
  {
    eyebrow: "Add-on policies",
    title: "Supplemental Benefits Decision Helper",
    body: "Evaluate accident, critical illness, and hospital indemnity policies against premium, emergency fund, and likely payout.",
    href: "/tools#supplemental-benefits",
    cta: "Check add-ons",
    icon: BadgeCheck,
  },
  {
    eyebrow: "Tax accounts",
    title: "HSA vs FSA Decision Helper",
    body: "Compare tax savings, employer HSA money, HDHP risk, FSA forfeiture risk, and expected healthcare spending.",
    href: "/tools#hsa-fsa",
    cta: "Compare accounts",
    icon: FileText,
  },
  {
    eyebrow: "Medicare",
    title: "Medicare Advantage Plan Type Helper",
    body: "A plain-English helper for comparing HMO, PPO, HMO-POS, and Original Medicare plus Medigap tradeoffs.",
    href: "/tools/medicare-advantage-plan-helper",
    cta: "Use helper",
    icon: HeartPulse,
  },
];

const questionClusters: HubCard[] = [
  {
    eyebrow: "Insurance basics",
    title: "Deductible, copay, coinsurance, and out-of-pocket max",
    body: "The four numbers that decide what covered care may cost and why covered does not always mean free.",
    href: "/articles/deductible-copay-coinsurance-out-of-pocket-max",
    cta: "Read plain-English guide",
    icon: Shield,
  },
  {
    eyebrow: "EOB confusion",
    title: "How to read an Explanation of Benefits",
    body: "Understand billed charges, allowed amount, adjustments, insurance payment, denial language, and patient responsibility.",
    href: "/articles/how-to-read-an-eob",
    cta: "Read EOB guide",
    icon: Receipt,
  },
  {
    eyebrow: "Family coverage",
    title: "Should you use your spouse's health insurance?",
    body: "Compare spouse surcharge rules, family deductibles, child coverage, networks, medications, and two-employer plan choices.",
    href: "/articles/spouse-family-health-insurance-open-enrollment",
    cta: "Compare household coverage",
    icon: Hospital,
  },
  {
    eyebrow: "Supplemental policies",
    title: "Accident, critical illness, and hospital indemnity",
    body: "Decide whether these policies are real protection or just another paycheck leak.",
    href: "/articles/accident-critical-illness-hospital-indemnity-open-enrollment",
    cta: "Review supplemental coverage",
    icon: BadgeCheck,
  },
  {
    eyebrow: "Medications",
    title: "Check prescriptions before picking a plan",
    body: "Look for formularies, tiers, preferred pharmacies, prior authorization, step therapy, quantity limits, and specialty costs.",
    href: "/insurance/medication-coverage-checklist",
    cta: "Open medication checklist",
    icon: Pill,
  },
  {
    eyebrow: "Care delays",
    title: "Prior authorization survival guide",
    body: "Use call scripts and checklists when imaging, procedures, medications, rehab, DME, or home health are delayed.",
    href: "/insurance/prior-authorization-guide",
    cta: "Open prior auth guide",
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
      "Plain-English benefits and insurance tools for EOBs, medical bills, open enrollment, out-of-pocket costs, spouse coverage, supplemental policies, prescriptions, prior authorization, and Medicare decisions.",
    canonicalPath: "/insurance",
  });

  return (
    <>
      <PageHero
        eyebrow="Benefits & Insurance"
        title="Understand what the plan, bill, or benefits portal is really saying."
        description="Start with the question in front of you: a confusing EOB, a hospital bill, open enrollment, spouse coverage, prescriptions, prior authorization, or Medicare plan choice."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/tools#eob-bill-match">Check an EOB vs bill</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tools#open-enrollment">Compare health plans</Link>
          </Button>
        </div>
      </PageHero>

      <main className="container space-y-16 py-12 md:py-16">
        <section>
          <SectionHeading
            centered
            eyebrow="Start here"
            title="Pick the situation, then use the tool"
            description="Most people do not need a textbook. They need the next correct question to ask before money leaves the account or benefits are locked in for a year."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {situationCards.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/30 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why this cluster matters</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Benefits and insurance are where healthcare finance gets confusing fastest.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                This section is built around practical decisions: what a covered service may cost, whether a bill matches the EOB, what a bad health year could cost, whether add-on policies are worth buying, and what questions patients should ask before care gets expensive.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Covered does not always mean free.",
                "An EOB is usually not a bill.",
                "Lowest premium is not always lowest total cost.",
                "Supplemental policies are not major medical insurance.",
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
            eyebrow="Fast tools"
            title="Calculators and checklists for high-friction decisions"
            description="These are the tools most aligned with benefits confusion, medical bill review, and insurance choice."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {toolCards.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Question clusters"
            title="Build understanding around the exact questions people search"
            description="Each guide should answer one confusing benefits or insurance problem, then move the reader into the relevant calculator or checklist."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {questionClusters.map((card) => (
              <CardLink key={card.href} card={card} />
            ))}
          </div>
        </section>

        <Card className="rounded-3xl border-amber-200 bg-amber-50 shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-amber-950">Use this before making a benefits or insurance decision</CardTitle>
            <CardDescription className="text-base leading-relaxed text-amber-950/80">
              The site is educational and cannot verify a live plan, claim, network, formulary, or authorization status. Always confirm with the insurer, employer benefits portal, Medicare.gov, state Medicaid agency, provider billing office, or official plan documents before acting.
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
