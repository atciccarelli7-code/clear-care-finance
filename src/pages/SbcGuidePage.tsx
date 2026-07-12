import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Hospital,
  Pill,
  Printer,
  Shield,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

const sections = [
  {
    title: "Coverage period and plan type",
    why: "Make sure you are reading the right plan year, employer plan, Marketplace plan, tier, and network type before comparing anything else.",
    ask: "Is this the exact plan I can enroll in, for the exact year and coverage tier I need?",
    icon: FileText,
  },
  {
    title: "Premium, deductible, and out-of-pocket max",
    why: "Premium is the entry fee. The deductible and out-of-pocket max tell you how much risk remains if care gets expensive.",
    ask: "What is the normal-year cost and what is the bad-year exposure?",
    icon: WalletCards,
  },
  {
    title: "Common medical events",
    why: "The SBC examples are useful for pattern recognition, but they are not a guarantee of your exact bill.",
    ask: "Which services apply before or after the deductible, and are there separate drug or facility rules?",
    icon: ClipboardCheck,
  },
  {
    title: "Excluded services and limitations",
    why: "This is where a plan can look fine until someone needs rehab, DME, infertility care, bariatrics, hearing, dental, or out-of-network care.",
    ask: "What services are excluded, limited, or only covered with prior authorization?",
    icon: AlertTriangle,
  },
  {
    title: "Network and referral rules",
    why: "The SBC gives the structure, but provider directories and plan documents confirm whether your doctor, hospital, facility, lab, or pharmacy fits.",
    ask: "Are my must-keep providers in network for this exact plan year?",
    icon: Hospital,
  },
  {
    title: "Drug coverage and prior authorization",
    why: "The premium can be irrelevant if a medication is non-formulary, specialty-tier, step-therapy only, or requires preauthorization.",
    ask: "Are my medications covered, what tier are they on, and what restrictions apply?",
    icon: Pill,
  },
];

const redFlags = [
  "The SBC says a service is covered, but the provider directory or formulary has not been checked.",
  "A low premium plan has a high deductible, high out-of-pocket max, or limited network.",
  "The plan has separate drug, family, out-of-network, or specialty deductibles.",
  "A needed medication has prior authorization, step therapy, quantity limits, or specialty pharmacy rules.",
  "The plan covers therapy, rehab, DME, or home health but only with strict visit limits or authorization.",
  "The user assumes the insurance company logo means the same rules as last year or another employer's plan.",
];

const sourceLinks = [
  ["CMS — Summary of Benefits and Coverage resources", "https://www.cms.gov/cciio/resources/forms-reports-and-other-resources/summary-of-benefits-and-coverage-and-uniform-glossary"],
  ["HealthCare.gov — Glossary of health coverage and medical terms", "https://www.healthcare.gov/sbc-glossary/"],
  ["HealthCare.gov — Total health care costs", "https://www.healthcare.gov/choose-a-plan/your-total-costs/"],
  ["HealthCare.gov — Plan and network types", "https://www.healthcare.gov/choose-a-plan/plan-types/"],
];

const SbcGuidePage = () => {
  useSeo({
    title: "How to Read a Summary of Benefits and Coverage",
    description:
      "A plain-English guide to reading a Summary of Benefits and Coverage, including premiums, deductibles, out-of-pocket maximums, exclusions, networks, prescriptions, and prior authorization.",
    canonicalPath: "/insurance/how-to-read-an-sbc",
  });

  const handlePrint = () => {
    trackSiteEvent("print_click", { page: "sbc_guide", item: "sbc_reader_checklist" });
    window.print();
  };

  return (
    <>
      <PageHero
        eyebrow="Commercial insurance"
        title="How to Read a Summary of Benefits and Coverage"
        description="The SBC is the cleanest starting point for comparing health plans — but it is only useful if you know which rows deserve attention before enrollment."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#sbc-map" onClick={() => trackSiteEvent("checklist_click", { page: "sbc_guide", destination: "sbc_map" })}>
            Read the map <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Print checklist
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/insurance/commercial-insurance-comparison" onClick={() => trackSiteEvent("pathway_click", { page: "sbc_guide", destination: "commercial_comparison" })}>
            Use comparison tool
          </Link>
        </Button>
      </PageHero>

      <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The simple rule</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Use the SBC to narrow the decision. Use live plan documents to verify it.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                The SBC is standardized enough to compare plans quickly. It is not the final source for every network, formulary, authorization, or billing rule. Treat it as the front door, not the whole house.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Start with the coverage period and plan name.",
                "Compare premium plus bad-year exposure.",
                "Find exclusions and services needing authorization.",
                "Verify doctors, hospitals, pharmacies, and medications separately.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm font-semibold text-foreground shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sbc-map" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="SBC map"
            title="The rows that deserve the most attention"
            description="Use this when comparing employer plans, Marketplace plans, or spouse/family coverage options."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="rounded-3xl border-border/80 shadow-card">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">{section.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{section.why}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl border border-primary/20 bg-primary-soft/25 p-4 text-sm leading-relaxed text-foreground">
                      <div className="mb-1 font-bold">Ask</div>
                      {section.ask}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Red flags</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-amber-950">When the SBC is not enough</h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-950/80 md:text-base">
                These are the moments where a plan can look cheap or comprehensive on paper but still fail the household in real life.
              </p>
            </div>
            <ul className="grid gap-3">
              {redFlags.map((flag) => (
                <li key={flag} className="flex gap-3 rounded-2xl border border-amber-200 bg-white/75 p-4 text-sm leading-relaxed text-amber-950">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <Shield className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="font-display text-2xl">Ready to compare plans?</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Use the commercial comparison framework after reading the SBC. It turns the important rows into normal-year cost, bad-year exposure, and verification flags.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="hero">
                <Link to="/insurance/commercial-insurance-comparison#comparison-tool" onClick={() => trackSiteEvent("calculator_start", { page: "sbc_guide", calculator: "commercial_comparison" })}>
                  Open comparison builder
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <Pill className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="font-display text-2xl">Medication users need a separate check</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                The SBC may not show the full pharmacy story. Check the formulary, tier, preferred pharmacy, prior authorization, step therapy, and specialty pharmacy rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/insurance/medication-coverage-checklist" onClick={() => trackSiteEvent("checklist_click", { page: "sbc_guide", checklist: "medication_coverage" })}>
                  Medication checklist
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Sources" title="Where to verify terms" description="Use this page as a reader guide. Use current SBCs, plan documents, provider directories, formularies, and official sources before choosing coverage." />
          <Card className="mx-auto max-w-3xl rounded-3xl border-border/80 shadow-card">
            <CardContent className="p-5 md:p-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                {sourceLinks.map(([title, url]) => (
                  <li key={url} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <a className="font-medium text-primary underline-offset-4 hover:underline" href={url} target="_blank" rel="noreferrer">
                      {title} <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
};

export default SbcGuidePage;
