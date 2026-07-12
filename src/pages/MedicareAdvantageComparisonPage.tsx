import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Hospital,
  Info,
  Pill,
  ShieldCheck,
  Stethoscope,
  WalletCards,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSeo } from "@/lib/seo";

type PlanType = "HMO" | "PPO" | "HMO-POS" | "Original Medicare + Medigap";

type PlanArchetype = {
  id: string;
  label: string;
  planType: PlanType;
  premiumSignal: string;
  outOfPocketSignal: string;
  drugCoverage: string;
  networkFlexibility: string;
  priorAuthorization: string;
  referrals: string;
  extraBenefits: string;
  clearCareTake: string;
  healthcareWorkerNote: string;
  bestUseCase: string[];
  verifyBeforeEnroll: string[];
};

const planArchetypes: PlanArchetype[] = [
  {
    id: "local-hmo-low-premium",
    label: "Low-premium local HMO archetype",
    planType: "HMO",
    premiumSignal: "$0 or low monthly premium",
    outOfPocketSignal: "Usually has an annual medical max out-of-pocket, but only inside plan rules",
    drugCoverage: "Often bundled, but formulary and pharmacy rules still matter",
    networkFlexibility: "Lowest flexibility; usually strongest when care stays inside one local network",
    priorAuthorization: "Common for higher-cost imaging, procedures, post-acute care, DME, and selected medications",
    referrals: "PCP coordination and specialist referrals may apply",
    extraBenefits: "Dental, vision, hearing, OTC, transportation, meals, or fitness benefits may be advertised",
    clearCareTake:
      "This can look attractive because the premium is simple. The real question is whether the patient can live comfortably inside the network and authorization process during a serious illness or hospital discharge.",
    healthcareWorkerNote:
      "From the hospital side, the friction usually appears when a patient needs rehab, skilled nursing, home health, DME, advanced imaging, or a specialist outside the preferred network.",
    bestUseCase: [
      "The patient already uses one local hospital system and all key doctors are in-network.",
      "The patient values a low monthly premium more than broad provider flexibility.",
      "The medication list is stable and confirmed on the plan formulary.",
    ],
    verifyBeforeEnroll: [
      "Primary care, specialists, hospital system, labs, imaging centers, pharmacies, SNFs, rehab, home health, and DME vendors.",
      "Drug tiers, quantity limits, step therapy, prior authorization, and preferred pharmacy pricing.",
      "Whether emergency, urgent, and travel coverage rules are clear enough for the patient’s real life.",
    ],
  },
  {
    id: "regional-ppo-flexibility",
    label: "Regional PPO flexibility archetype",
    planType: "PPO",
    premiumSignal: "May have a $0, low, or moderate monthly premium",
    outOfPocketSignal: "Usually separates in-network and combined/out-of-network exposure",
    drugCoverage: "Often bundled, but still verify every medication and pharmacy",
    networkFlexibility: "More flexible than an HMO, but not unlimited access",
    priorAuthorization: "Still possible even when referrals are not required",
    referrals: "Specialist referrals are often less restrictive than HMO rules",
    extraBenefits: "Extra benefits may be similar to HMO offerings but vary by plan and county",
    clearCareTake:
      "A PPO may reduce some network anxiety, but it is not a blank check. Out-of-network care can cost more, and the plan can still require authorization for expensive services.",
    healthcareWorkerNote:
      "PPO flexibility can help families, but discharge planning still depends on which facilities accept the plan, whether authorization is required, and how quickly the insurer responds.",
    bestUseCase: [
      "The patient has multiple specialists or wants more provider flexibility.",
      "The patient travels or splits time between nearby service areas.",
      "The patient can tolerate potentially higher out-of-pocket exposure for added flexibility.",
    ],
    verifyBeforeEnroll: [
      "In-network and out-of-network max out-of-pocket limits.",
      "Whether out-of-network doctors actually accept the plan and whether authorization still applies.",
      "Hospital, specialist, pharmacy, and post-acute facility participation.",
    ],
  },
  {
    id: "hmo-pos-middle-ground",
    label: "HMO-POS middle-ground archetype",
    planType: "HMO-POS",
    premiumSignal: "Often low premium, but details vary",
    outOfPocketSignal: "Usually depends heavily on whether care is inside or outside the core network",
    drugCoverage: "May be bundled; verify formulary and pharmacy rules",
    networkFlexibility: "Some point-of-service flexibility, but not the same as a PPO",
    priorAuthorization: "Likely for selected higher-cost services and post-acute care",
    referrals: "May require PCP coordination or service-specific rules",
    extraBenefits: "May advertise the same extras as other Medicare Advantage plans",
    clearCareTake:
      "This can be misunderstood. HMO-POS sounds flexible, but the useful question is exactly which services can go outside the network, at what cost, and with what approval.",
    healthcareWorkerNote:
      "Families should not assume the POS feature solves discharge or specialist-access problems. Read the Evidence of Coverage before relying on out-of-network access.",
    bestUseCase: [
      "The patient mostly uses one local network but wants limited backup flexibility.",
      "The patient is willing to read the POS rules carefully.",
      "The patient has predictable medications and routine care needs.",
    ],
    verifyBeforeEnroll: [
      "Which services are actually available outside the core network.",
      "Whether specialist visits need PCP coordination, referrals, or plan authorization.",
      "Dental, vision, OTC, hearing, meal, transportation, and annual benefit caps.",
    ],
  },
  {
    id: "original-medicare-medigap",
    label: "Original Medicare + Medigap comparison point",
    planType: "Original Medicare + Medigap",
    premiumSignal: "Usually higher monthly premium because Medigap and Part D may be separate",
    outOfPocketSignal: "Medigap can reduce Original Medicare cost-sharing depending on the policy",
    drugCoverage: "Usually needs separate Part D coverage",
    networkFlexibility: "Broadest provider flexibility when clinicians accept Medicare",
    priorAuthorization: "Generally less managed-care authorization than Medicare Advantage, though rules still exist",
    referrals: "Usually no Medicare Advantage-style PCP gatekeeping",
    extraBenefits: "Usually fewer extras such as dental, vision, OTC, and gym benefits",
    clearCareTake:
      "This option may look expensive monthly but can be cleaner for patients who value provider flexibility and less managed-care friction. Timing matters because Medigap enrollment protections are not always available later.",
    healthcareWorkerNote:
      "For patients with complex specialist needs, repeated admissions, or major travel, the practical value may be access and fewer network surprises rather than advertised extras.",
    bestUseCase: [
      "The patient strongly values provider flexibility.",
      "The patient expects specialist-heavy care or frequent travel.",
      "The patient can afford separate premiums and understands Medigap enrollment timing.",
    ],
    verifyBeforeEnroll: [
      "Medigap availability, enrollment rights, underwriting risk, and premium trajectory.",
      "Separate Part D plan coverage for every medication.",
      "Whether preferred doctors and hospitals accept Medicare.",
    ],
  },
];

const comparisonRows: { label: string; key: keyof PlanArchetype }[] = [
  { label: "Premium signal", key: "premiumSignal" },
  { label: "Out-of-pocket exposure", key: "outOfPocketSignal" },
  { label: "Drug coverage", key: "drugCoverage" },
  { label: "Network flexibility", key: "networkFlexibility" },
  { label: "Prior authorization", key: "priorAuthorization" },
  { label: "Referral rules", key: "referrals" },
  { label: "Extra benefits", key: "extraBenefits" },
];

const sources = [
  {
    title: "Medicare.gov — Compare Original Medicare and Medicare Advantage",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
  },
  {
    title: "Medicare.gov — Medicare Plan Finder",
    url: "https://www.medicare.gov/plan-compare/",
  },
  {
    title: "Medicare.gov — How to compare health and drug plans",
    url: "https://www.medicare.gov/health-drug-plans/health-plans",
  },
  {
    title: "CMS — Medicare Advantage and Part D performance data",
    url: "https://www.cms.gov/medicare/health-drug-plans/part-c-d-performance-data",
  },
  {
    title: "KFF — Medicare Advantage enrollment and key trends",
    url: "https://www.kff.org/medicare/issue-brief/medicare-advantage-in-2025-enrollment-update-and-key-trends/",
  },
];

const Badge = ({ children, tone = "blue" }: { children: string; tone?: "blue" | "green" | "amber" | "slate" }) => {
  const toneClasses = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{children}</span>;
};

const RealityCheckCard = ({ icon: Icon, title, body }: { icon: typeof WalletCards; title: string; body: string }) => (
  <Card className="rounded-3xl border-border/80 shadow-card">
    <CardHeader>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
        <Icon className="h-5 w-5" />
      </div>
      <CardTitle className="font-display text-xl">{title}</CardTitle>
      <CardDescription className="text-sm leading-relaxed">{body}</CardDescription>
    </CardHeader>
  </Card>
);

const ArchetypeCard = ({ plan }: { plan: PlanArchetype }) => (
  <Card className="overflow-hidden rounded-3xl border-border/80 shadow-card">
    <CardHeader className="space-y-5 p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Educational archetype</div>
          <CardTitle className="font-display text-2xl leading-tight md:text-3xl">{plan.label}</CardTitle>
          <CardDescription className="text-base">Use this to understand plan tradeoffs, not to choose a live plan.</CardDescription>
        </div>
        <Badge tone={plan.planType === "HMO" ? "green" : plan.planType === "Original Medicare + Medigap" ? "slate" : "blue"}>{plan.planType}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Premium</div>
          <div className="mt-2 text-base font-bold">{plan.premiumSignal}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Out-of-pocket</div>
          <div className="mt-2 text-base font-bold">Verify worst-case cost</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Network</div>
          <div className="mt-2 text-base font-bold">{plan.planType === "PPO" ? "More flexible" : plan.planType === "HMO" ? "Strictest" : "Read rules"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drugs</div>
          <div className="mt-2 text-base font-bold">Formulary matters</div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-5 pt-0 md:p-6 md:pt-0">
      <Accordion type="single" collapsible className="rounded-2xl border border-border/80 px-4">
        <AccordionItem value="details">
          <AccordionTrigger className="text-left text-base font-bold">Details to compare</AccordionTrigger>
          <AccordionContent>
            <dl className="grid gap-3 text-sm">
              <div className="rounded-xl border border-border/70 bg-background/50 p-3"><dt className="font-semibold text-muted-foreground">Network flexibility</dt><dd className="mt-1 text-foreground">{plan.networkFlexibility}</dd></div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3"><dt className="font-semibold text-muted-foreground">Prior authorization</dt><dd className="mt-1 text-foreground">{plan.priorAuthorization}</dd></div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3"><dt className="font-semibold text-muted-foreground">Referral rules</dt><dd className="mt-1 text-foreground">{plan.referrals}</dd></div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3"><dt className="font-semibold text-muted-foreground">Extra benefits</dt><dd className="mt-1 text-foreground">{plan.extraBenefits}</dd></div>
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="take" className="border-b-0">
          <AccordionTrigger className="text-left text-base font-bold">Our take</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary"><ShieldCheck className="h-4 w-4" /> Clear Care take</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{plan.clearCareTake}</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900"><Stethoscope className="h-4 w-4" /> Healthcare worker note</div>
                  <p className="text-sm leading-relaxed text-amber-950/80">{plan.healthcareWorkerNote}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-bold">May fit when</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.bestUseCase.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-bold">Verify before enrolling</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.verifyBeforeEnroll.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>{item}</span></li>)}
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

const ComparisonTable = () => (
  <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
    <div className="border-b border-border bg-muted/40 p-5">
      <h3 className="font-display text-2xl font-bold">Side-by-side educational comparison</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">This table compares plan structures. It is not a ranking, quote, endorsement, or live plan listing.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <caption className="sr-only">Educational Medicare coverage comparison table</caption>
        <thead>
          <tr className="border-b border-border bg-background/70">
            <th scope="col" className="w-48 p-4 font-bold">Criteria</th>
            {planArchetypes.map((plan) => <th key={plan.id} scope="col" className="min-w-52 p-4 align-top font-bold"><div>{plan.label}</div><div className="mt-1 text-xs font-semibold text-primary">{plan.planType}</div></th>)}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label} className="border-b border-border/70 last:border-0">
              <th scope="row" className="bg-muted/30 p-4 align-top font-semibold text-muted-foreground">{row.label}</th>
              {planArchetypes.map((plan) => <td key={`${plan.id}-${row.label}`} className="p-4 align-top leading-relaxed text-foreground">{plan[row.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MedicareAdvantageComparisonPage = () => {
  useSeo({
    title: "Compare Medicare Advantage Plans",
    description:
      "An educational Medicare Advantage comparison page explaining premiums, max out-of-pocket limits, HMO vs PPO rules, drug coverage, networks, prior authorization, and patient-centered plan tradeoffs.",
    canonicalPath: "/insurance/medicare-advantage",
  });

  return (
    <>
      <PageHero
        eyebrow="Medicare Advantage"
        title="Compare Medicare Advantage Plans Without Getting Sold To"
        description="A plain-English comparison framework for patients and caregivers who need to look past premiums, TV ads, and extra benefits before checking live plan details."
      >
        <Button asChild variant="hero" size="lg"><a href="#archetypes">Compare plan structures <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="outline" size="lg"><a href="#sources">Check official sources</a></Button>
      </PageHero>

      <div className="container min-w-0 space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="grid gap-5 md:grid-cols-3" aria-label="Key Medicare Advantage comparison reminders">
          {[
            { icon: ShieldCheck, title: "Educational only", body: "No Apply Now button, no universal best-plan ranking, no insurer logo placement, and no live plan quotes." },
            { icon: Hospital, title: "Network first", body: "The practical plan is the one that works with the patient’s doctors, hospital system, rehab options, pharmacies, and medications." },
            { icon: FileText, title: "Verify locally", body: "Real Medicare Advantage details change by ZIP code, county, plan year, provider network, pharmacy, and medication list." },
          ].map((item) => (
            <Card key={item.title} className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><item.icon className="h-5 w-5" /></div>
                <CardTitle className="font-display text-xl">{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-7" aria-label="Plan detail disclaimer">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm"><AlertTriangle className="h-5 w-5" /></div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-amber-950">These are plan archetypes, not live plan quotes.</h2>
              <p className="max-w-4xl text-sm leading-relaxed text-amber-950/80 md:text-base">
                Use this page to learn how to compare coverage structures. Do not enroll based on these examples. Check Medicare.gov, the plan’s Evidence of Coverage, provider directory, pharmacy network, drug formulary, and local SHIP counseling before making a decision.
              </p>
            </div>
          </div>
        </section>

        <section id="archetypes" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Plan structure comparison" title="Look past the premium and compare the patient experience" description="These neutral archetypes show what patients and caregivers should verify before choosing a Medicare Advantage plan or comparing Original Medicare with Medigap." />
          <div className="grid gap-6">
            {planArchetypes.map((plan) => <ArchetypeCard key={plan.id} plan={plan} />)}
          </div>
        </section>

        <ComparisonTable />

        <section id="reality-check" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Patient reality check" title="What insurance marketing may not emphasize" description="The extras can be useful, but expensive problems usually come from networks, drugs, authorization, post-acute care, and worst-case out-of-pocket exposure." />
          <div className="grid gap-5 md:grid-cols-2">
            <RealityCheckCard icon={WalletCards} title="$0 premium does not mean $0 healthcare cost" body="A low premium can still come with copays, coinsurance, drug costs, and a meaningful max out-of-pocket limit." />
            <RealityCheckCard icon={Hospital} title="Network restrictions matter most during serious illness" body="Check the hospital system, specialists, labs, imaging centers, pharmacies, rehab facilities, skilled nursing facilities, and DME vendors the patient would actually use." />
            <RealityCheckCard icon={ClipboardCheck} title="Prior authorization can shape the care timeline" body="Advanced imaging, procedures, post-acute rehab, skilled nursing facility care, DME, and some drugs may require plan approval." />
            <RealityCheckCard icon={Pill} title="Medication math changes by plan and pharmacy" body="Verify each medication by name, dose, tier, preferred pharmacy, mail-order option, quantity limit, step therapy, and prior authorization rule." />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-label="Methodology and disclosure">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">What we score conceptually</CardTitle>
              <CardDescription className="text-base leading-relaxed">A useful Medicare comparison should give more weight to patient friction than to marketing perks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  ["Doctor and hospital network", "25%"],
                  ["Max out-of-pocket exposure", "20%"],
                  ["Drug coverage clarity", "15%"],
                  ["Prior authorization burden", "15%"],
                  ["Specialist access and referral rules", "10%"],
                  ["Rehab, SNF, home health, and DME friction", "10%"],
                  ["Extra benefits", "5%"],
                ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/50 p-3"><span className="text-sm font-medium text-muted-foreground">{label}</span><span className="text-sm font-bold text-foreground">{value}</span></div>)}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary"><Info className="h-5 w-5" /></div>
              <CardTitle className="font-display text-2xl">Important disclosure</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Clear Care Finance is using this page to teach a comparison process. It does not sell Medicare plans, provide enrollment advice, rank insurers, or display live plan listings. Plan availability and details vary by ZIP code, county, year, providers, pharmacies, medications, and individual health needs.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Before you enroll</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Use Medicare.gov as the source of truth</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">Use this page to understand the tradeoffs, then verify real doctors, drugs, pharmacies, hospitals, estimated costs, and plan documents in official tools.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button asChild variant="hero" size="lg"><a href="https://www.medicare.gov/plan-compare/" target="_blank" rel="noreferrer">Open Medicare Plan Finder <ExternalLink className="h-4 w-4" /></a></Button>
              <Button asChild variant="outline" size="lg"><Link to="/topics/medicare-medicaid">Medicare & Medicaid guide</Link></Button>
            </div>
          </div>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Sources" title="Source notes for this page" description="Use these sources to verify plan rules, compare live plans, and review Medicare Advantage quality information." />
          <Card className="mx-auto max-w-3xl rounded-3xl border-border/80 shadow-card">
            <CardContent className="p-5 md:p-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                {sources.map((source) => (
                  <li key={source.url} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <a className="font-medium text-primary underline-offset-4 hover:underline" href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink className="inline h-3.5 w-3.5" /></a>
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

export default MedicareAdvantageComparisonPage;
