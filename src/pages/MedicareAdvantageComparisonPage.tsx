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
import { cn } from "@/lib/utils";

type PlanType = "HMO" | "PPO" | "HMO-POS";

type PlanComparison = {
  id: string;
  provider: string;
  planName: string;
  planType: PlanType;
  monthlyPremium: string;
  maxOutOfPocket: string;
  drugCoverage: string;
  pcpRequired: string;
  specialistReferral: string;
  networkFlexibility: string;
  priorAuthorization: string;
  starRating: string;
  extraBenefits: string[];
  badges: string[];
  clearCareTake: string;
  healthcareWorkerNote: string;
  goodFit: string[];
  checkBeforeEnroll: string[];
};

const samplePlans: PlanComparison[] = [
  {
    id: "uhc-style-hmo",
    provider: "UnitedHealthcare-style example",
    planName: "Medicare Advantage HMO sample",
    planType: "HMO",
    monthlyPremium: "$0 sample premium",
    maxOutOfPocket: "$4,900 sample in-network limit",
    drugCoverage: "Included in this sample",
    pcpRequired: "Usually yes",
    specialistReferral: "Often yes",
    networkFlexibility: "Lowest flexibility. Confirm every doctor, hospital, lab, imaging center, and pharmacy before enrolling.",
    priorAuthorization: "Likely for higher-cost services such as imaging, post-acute rehab, DME, and selected procedures.",
    starRating: "CMS Star Rating placeholder",
    extraBenefits: ["Dental allowance", "Vision/hearing benefits", "OTC card", "Fitness benefit"],
    badges: ["HMO", "$0 premium example", "Drug coverage included", "Check network first"],
    clearCareTake:
      "This sample plan may look attractive for someone who is comfortable staying inside one network and wants predictable routine-care access. The tradeoff is less flexibility when a specialist, hospital, rehab facility, or pharmacy is outside the plan network.",
    healthcareWorkerNote:
      "In a hospital discharge situation, the practical question is not just the premium. Ask whether the plan commonly requires authorization for skilled nursing facility placement, inpatient rehab, home health, durable medical equipment, and advanced imaging.",
    goodFit: [
      "Patient has stable doctors who are all in-network.",
      "Patient rarely travels for care.",
      "Patient values low monthly premium more than provider flexibility.",
    ],
    checkBeforeEnroll: [
      "Primary care doctor, specialists, hospital system, lab, imaging center, and preferred pharmacy.",
      "Medication formulary, drug tiers, quantity limits, step therapy, and prior authorization rules.",
      "Rehab, skilled nursing facility, home health, and durable medical equipment network rules.",
    ],
  },
  {
    id: "humana-style-ppo",
    provider: "Humana-style example",
    planName: "Medicare Advantage PPO sample",
    planType: "PPO",
    monthlyPremium: "$18 sample premium",
    maxOutOfPocket: "$5,800 in-network / $9,900 combined sample limit",
    drugCoverage: "Included in this sample",
    pcpRequired: "Usually no",
    specialistReferral: "Usually no",
    networkFlexibility: "More flexible than an HMO, but out-of-network care can cost more and may still have plan rules.",
    priorAuthorization: "Still possible for expensive services even when referrals are not required.",
    starRating: "CMS Star Rating placeholder",
    extraBenefits: ["Preventive dental", "Eyewear allowance", "Hearing aid allowance", "Transportation benefit"],
    badges: ["PPO", "More network flexibility", "Drug coverage included", "Verify out-of-network costs"],
    clearCareTake:
      "This sample plan may fit someone who wants more provider flexibility than an HMO but still wants Medicare Advantage extras. The main risk is assuming PPO means unlimited access. The plan can still have networks, higher out-of-network costs, and authorization requirements.",
    healthcareWorkerNote:
      "PPO flexibility helps, but families should still verify the exact hospital system and post-acute facilities. A patient can be medically ready for discharge while the family waits on network placement or authorization decisions.",
    goodFit: [
      "Patient wants more specialist flexibility.",
      "Patient splits time between nearby service areas.",
      "Patient can tolerate higher worst-case cost for added flexibility.",
    ],
    checkBeforeEnroll: [
      "Separate in-network and out-of-network max out-of-pocket limits.",
      "Whether out-of-network doctors accept the plan and what prior authorization still applies.",
      "Drug plan pharmacy network and mail-order pricing.",
    ],
  },
  {
    id: "aetna-style-hmo-pos",
    provider: "Aetna-style example",
    planName: "Medicare Advantage HMO-POS sample",
    planType: "HMO-POS",
    monthlyPremium: "$0 sample premium",
    maxOutOfPocket: "$5,500 sample in-network limit",
    drugCoverage: "Included in this sample",
    pcpRequired: "Usually yes",
    specialistReferral: "Varies by service",
    networkFlexibility: "Some point-of-service flexibility, but the details matter. Do not assume PPO-like access.",
    priorAuthorization: "Likely for selected higher-cost care, post-acute services, and non-routine services.",
    starRating: "CMS Star Rating placeholder",
    extraBenefits: ["Dental network benefit", "Routine vision", "OTC benefit", "Meal support after hospitalization"],
    badges: ["HMO-POS", "$0 premium example", "Some out-of-network flexibility", "Read plan documents"],
    clearCareTake:
      "This sample plan sits between a stricter HMO and a PPO. It can be reasonable if the core network is strong, but the point-of-service details are easy to misunderstand. Read the evidence of coverage before relying on out-of-network access.",
    healthcareWorkerNote:
      "The phrase HMO-POS can sound flexible, but the patient experience depends on which services are allowed out of network, what approval is needed, and how high the cost-sharing becomes when care leaves the core network.",
    goodFit: [
      "Patient mostly uses one local system but wants limited backup flexibility.",
      "Patient has predictable medications and routine care needs.",
      "Patient is willing to read network and POS rules carefully.",
    ],
    checkBeforeEnroll: [
      "Which services are actually available out of network under POS rules.",
      "Whether specialist visits require PCP coordination or referrals.",
      "Dental, vision, OTC, and meal benefits limits, networks, and annual caps.",
    ],
  },
  {
    id: "blue-cross-style-ppo",
    provider: "Blue Cross-style example",
    planName: "Medicare Advantage PPO sample",
    planType: "PPO",
    monthlyPremium: "$39 sample premium",
    maxOutOfPocket: "$4,700 in-network / $8,900 combined sample limit",
    drugCoverage: "Included in this sample",
    pcpRequired: "Usually no",
    specialistReferral: "Usually no",
    networkFlexibility: "Moderate to high flexibility, depending on the local provider network and plan contract.",
    priorAuthorization: "Possible for imaging, procedures, hospital-related services, rehab, and DME.",
    starRating: "CMS Star Rating placeholder",
    extraBenefits: ["Comprehensive dental option", "Vision allowance", "Hearing support", "Fitness benefit"],
    badges: ["PPO", "Lower sample MOOP", "Drug coverage included", "Compare premium vs risk"],
    clearCareTake:
      "This sample plan trades a higher monthly premium for a lower sample in-network max out-of-pocket. That can make sense for someone who expects meaningful medical use, but only if the doctors, hospital, prescriptions, and pharmacies line up.",
    healthcareWorkerNote:
      "A lower max out-of-pocket can matter more than a $0 premium when someone has cancer care, cardiac care, repeated admissions, therapy needs, or expensive drugs. The network and drug formulary still decide whether the math works.",
    goodFit: [
      "Patient expects specialist-heavy care.",
      "Patient wants PPO access but cares about limiting worst-case exposure.",
      "Patient has verified major medications and hospitals in advance.",
    ],
    checkBeforeEnroll: [
      "Whether the premium is worth the lower sample in-network max out-of-pocket.",
      "Whether high-use specialists and hospitals are in-network.",
      "Prior authorization requirements for chronic-condition services and advanced imaging.",
    ],
  },
];

const marketingRealityChecks = [
  {
    icon: WalletCards,
    title: "$0 premium does not mean $0 healthcare cost",
    body: "A low premium can still come with copays, coinsurance, drug costs, and a meaningful max out-of-pocket limit.",
  },
  {
    icon: Hospital,
    title: "Network restrictions matter most during serious illness",
    body: "Check the hospital system, specialists, labs, imaging centers, pharmacies, rehab facilities, and skilled nursing facilities you would actually use.",
  },
  {
    icon: ClipboardCheck,
    title: "Prior authorization can shape the care timeline",
    body: "Advanced imaging, procedures, post-acute rehab, skilled nursing facility care, DME, and some drugs may require plan approval.",
  },
  {
    icon: Pill,
    title: "Medication math changes by plan and pharmacy",
    body: "Verify each medication by name, dose, tier, preferred pharmacy, mail-order option, quantity limit, step therapy, and prior authorization rule.",
  },
];

const comparisonRows = [
  { label: "Monthly premium", key: "monthlyPremium" as const },
  { label: "Max out-of-pocket", key: "maxOutOfPocket" as const },
  { label: "Drug coverage", key: "drugCoverage" as const },
  { label: "PCP required", key: "pcpRequired" as const },
  { label: "Specialist referral", key: "specialistReferral" as const },
  { label: "Network flexibility", key: "networkFlexibility" as const },
  { label: "Prior authorization", key: "priorAuthorization" as const },
  { label: "Star rating", key: "starRating" as const },
];

const sources = [
  {
    title: "Medicare.gov — How to compare health and drug plans",
    url: "https://www.medicare.gov/health-drug-plans/health-plans",
  },
  {
    title: "Medicare.gov — Compare Original Medicare and Medicare Advantage",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
  },
  {
    title: "Medicare.gov — Medicare Plan Finder",
    url: "https://www.medicare.gov/plan-compare/",
  },
  {
    title: "CMS — Medicare Advantage and Part D Star Ratings",
    url: "https://www.cms.gov/medicare/health-drug-plans/part-c-d-performance-data",
  },
  {
    title: "KFF — Medicare Advantage research and analysis",
    url: "https://www.kff.org/medicare/issue-brief/medicare-advantage-in-2025-enrollment-update-and-key-trends/",
  },
];

const Badge = ({ children, tone = "blue" }: { children: string; tone?: "blue" | "green" | "amber" | "slate" }) => {
  const tones = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid gap-1 rounded-xl border border-border/70 bg-background/50 p-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
    <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground">{value}</dd>
  </div>
);

const RnTakePanel = ({ take, note }: { take: string; note: string }) => (
  <div className="grid gap-4 lg:grid-cols-2">
    <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
        <ShieldCheck className="h-4 w-4" /> Clear Care take
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{take}</p>
    </div>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
        <Stethoscope className="h-4 w-4" /> Healthcare worker note
      </div>
      <p className="text-sm leading-relaxed text-amber-950/80">{note}</p>
    </div>
  </div>
);

const PlanComparisonCard = ({ plan }: { plan: PlanComparison }) => (
  <Card className="overflow-hidden rounded-3xl border-border/80 shadow-card">
    <CardHeader className="space-y-5 p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Sample plan card</div>
          <CardTitle className="font-display text-2xl leading-tight md:text-3xl">{plan.provider}</CardTitle>
          <CardDescription className="text-base">{plan.planName}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge tone="green">{plan.planType}</Badge>
          <Badge tone="slate">{plan.starRating}</Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Premium</div>
          <div className="mt-2 text-lg font-bold">{plan.monthlyPremium}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Max out-of-pocket</div>
          <div className="mt-2 text-lg font-bold">{plan.maxOutOfPocket}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drug coverage</div>
          <div className="mt-2 text-lg font-bold">{plan.drugCoverage}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Network</div>
          <div className="mt-2 text-lg font-bold">{plan.planType === "PPO" ? "More flexible" : "Stricter"}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {plan.badges.map((badge) => (
          <Badge key={badge} tone={badge.includes("Check") || badge.includes("Verify") || badge.includes("Read") ? "amber" : "blue"}>
            {badge}
          </Badge>
        ))}
      </div>
    </CardHeader>

    <CardContent className="p-5 pt-0 md:p-6 md:pt-0">
      <Accordion type="single" collapsible className="rounded-2xl border border-border/80 px-4">
        <AccordionItem value="details">
          <AccordionTrigger className="text-left text-base font-bold">Plan details</AccordionTrigger>
          <AccordionContent>
            <dl className="grid gap-3">
              <InfoRow label="PCP required" value={plan.pcpRequired} />
              <InfoRow label="Specialist referral" value={plan.specialistReferral} />
              <InfoRow label="Network flexibility" value={plan.networkFlexibility} />
              <InfoRow label="Prior authorization" value={plan.priorAuthorization} />
              <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                <dt className="text-sm font-semibold text-muted-foreground">Extra benefits to verify</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {plan.extraBenefits.map((benefit) => (
                    <Badge key={benefit} tone="slate">{benefit}</Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="take" className="border-b-0">
          <AccordionTrigger className="text-left text-base font-bold">Our take</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5">
              <RnTakePanel take={plan.clearCareTake} note={plan.healthcareWorkerNote} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-bold">Potential fit</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.goodFit.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-bold">Check before enrolling</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.checkBeforeEnroll.map((item) => (
                      <li key={item} className="flex gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <span>{item}</span>
                      </li>
                    ))}
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

const PlanComparisonTable = ({ plans }: { plans: PlanComparison[] }) => (
  <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
    <div className="border-b border-border bg-muted/40 p-5">
      <h3 className="font-display text-2xl font-bold">Side-by-side sample comparison</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Use this as a reading layout, not a recommendation engine. Live plan details must be checked by ZIP code and plan year.
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <caption className="sr-only">Sample Medicare Advantage plan comparison table</caption>
        <thead>
          <tr className="border-b border-border bg-background/70">
            <th scope="col" className="w-48 p-4 font-bold">Criteria</th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col" className="min-w-52 p-4 align-top font-bold">
                <div>{plan.provider}</div>
                <div className="mt-1 text-xs font-semibold text-primary">{plan.planType}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label} className="border-b border-border/70 last:border-0">
              <th scope="row" className="bg-muted/30 p-4 align-top font-semibold text-muted-foreground">{row.label}</th>
              {plans.map((plan) => (
                <td key={`${plan.id}-${row.label}`} className="p-4 align-top leading-relaxed text-foreground">
                  {plan[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PatientRealityCheck = () => (
  <section id="reality-check" className="scroll-mt-24">
    <SectionHeading
      centered
      eyebrow="Patient reality check"
      title="What insurance marketing may not emphasize"
      description="The extras can be useful, but the expensive problems usually come from networks, drugs, authorization, post-acute care, and worst-case out-of-pocket exposure."
    />
    <div className="grid gap-5 md:grid-cols-2">
      {marketingRealityChecks.map((item) => (
        <Card key={item.title} className="rounded-3xl border-border/80 shadow-card">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <item.icon className="h-5 w-5" />
            </div>
            <CardTitle className="font-display text-xl">{item.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">{item.body}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  </section>
);

const MethodologyDisclosure = () => (
  <section id="methodology" className="scroll-mt-24">
    <SectionHeading
      centered
      eyebrow="Methodology & disclosure"
      title="How to read this comparison"
      description="Clear Care Finance is using this page to teach the comparison process, not to sell or rank Medicare plans."
    />
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-3xl border-border/80 shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-2xl">What we score conceptually</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            A good Medicare Advantage comparison should give more weight to patient friction than to marketing perks.
          </CardDescription>
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
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/50 p-3">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
            <Info className="h-5 w-5" />
          </div>
          <CardTitle className="font-display text-2xl">Important disclaimer</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Sample cards on this page are placeholders. They are not live plan listings, quotes, endorsements, or enrollment advice. Plan availability and details vary by ZIP code, county, year, doctors, hospitals, pharmacies, medications, and individual health needs. Verify details on Medicare.gov, official plan documents, and through your local SHIP program before enrolling.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </section>
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
        title="Compare Medicare Advantage Plans: What Patients Should Check Before Enrolling"
        description="A plain-English comparison layout for patients and caregivers who want to look past the sales pitch and check the details that matter in real care."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#sample-plans">Compare sample plan cards <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#methodology">Methodology & disclosure</a>
        </Button>
      </PageHero>

      <main className="container min-w-0 space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="grid gap-5 md:grid-cols-3" aria-label="Key Medicare Advantage comparison reminders">
          {[
            {
              icon: ShieldCheck,
              title: "Educational only",
              body: "No Apply Now button, no universal best-plan ranking, and no claim that these are live plan details.",
            },
            {
              icon: Hospital,
              title: "Network first",
              body: "The most important plan is the one your doctors, hospital system, rehab options, pharmacies, and drugs actually work with.",
            },
            {
              icon: FileText,
              title: "Verify locally",
              body: "Medicare Advantage details change by ZIP code, county, plan year, provider network, pharmacy, and medication list.",
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-display text-xl">{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-7" aria-label="Plan detail disclaimer">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-amber-950">These are sample cards, not live plan quotes.</h2>
              <p className="max-w-4xl text-sm leading-relaxed text-amber-950/80 md:text-base">
                Use this page to learn how to compare Medicare Advantage plans. Do not enroll based on these examples. Check Medicare.gov, the plan's Evidence of Coverage, provider directories, pharmacy network, drug formulary, and local SHIP counseling before making a decision.
              </p>
            </div>
          </div>
        </section>

        <section id="sample-plans" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Sample comparison cards"
            title="Look past the premium and compare the patient experience"
            description="These cards show the kind of details patients and caregivers should verify before choosing a Medicare Advantage plan."
          />
          <div className="grid gap-6">
            {samplePlans.map((plan) => (
              <PlanComparisonCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <PlanComparisonTable plans={samplePlans} />

        <PatientRealityCheck />

        <section className="rounded-3xl border border-primary/20 bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Before you enroll</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Use Medicare.gov as the source of truth</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                The useful workflow is simple: compare here to understand the tradeoffs, then verify your real doctors, drugs, pharmacies, hospitals, and estimated costs in the official tools and plan documents.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button asChild variant="hero" size="lg">
                <a href="https://www.medicare.gov/plan-compare/" target="_blank" rel="noreferrer">
                  Open Medicare Plan Finder <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/topics/medicare-medicaid">Medicare & Medicaid guide</Link>
              </Button>
            </div>
          </div>
        </section>

        <MethodologyDisclosure />

        <section id="sources" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Sources"
            title="Source notes for this page"
            description="Use these sources to verify plan rules, compare live plans, and review Medicare Advantage quality information."
          />
          <Card className="mx-auto max-w-3xl rounded-3xl border-border/80 shadow-card">
            <CardContent className="p-5 md:p-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                {sources.map((source) => (
                  <li key={source.url} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <a className="font-medium text-primary underline-offset-4 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.title} <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default MedicareAdvantageComparisonPage;
