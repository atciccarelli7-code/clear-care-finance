import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  HeartPulse,
  Hospital,
  Network,
  Pill,
  Shield,
  Stethoscope,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type Tone = "blue" | "green" | "amber" | "slate";

type PlanTypeCard = {
  name: string;
  plainEnglish: string;
  usuallyBetterFor: string;
  watchFor: string;
  network: string;
  referral: string;
  outOfNetwork: string;
  tone: Tone;
  icon: LucideIcon;
};

const Badge = ({ children, tone = "blue" }: { children: string; tone?: Tone }) => {
  const tones: Record<Tone, string> = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
};

const planTypes: PlanTypeCard[] = [
  {
    name: "PPO",
    plainEnglish: "Usually the most flexible network style. You can often see out-of-network providers, but you usually pay more.",
    usuallyBetterFor: "People who want flexibility, travel often, see specialists, or do not want referral friction.",
    watchFor: "Higher premiums, separate out-of-network deductibles, and confusing allowed amounts.",
    network: "Flexible",
    referral: "Usually no referral",
    outOfNetwork: "Usually covered at higher cost",
    tone: "green",
    icon: Network,
  },
  {
    name: "HMO",
    plainEnglish: "Usually a tighter network. Care is generally centered around in-network doctors and facilities.",
    usuallyBetterFor: "People whose doctors and hospitals are clearly in network and who want lower premiums or more coordinated care.",
    watchFor: "Out-of-network care is often not covered except emergencies, and referrals may be required.",
    network: "Tighter",
    referral: "Often required",
    outOfNetwork: "Usually emergency only",
    tone: "amber",
    icon: Hospital,
  },
  {
    name: "EPO",
    plainEnglish: "A middle ground: usually no primary-care referral requirement, but non-emergency out-of-network care is often not covered.",
    usuallyBetterFor: "People comfortable staying inside one network who still want less referral friction than an HMO.",
    watchFor: "The provider directory matters. If a key doctor or hospital is outside the network, the plan may not work well.",
    network: "Tighter",
    referral: "Often no referral",
    outOfNetwork: "Usually emergency only",
    tone: "blue",
    icon: Shield,
  },
  {
    name: "POS",
    plainEnglish: "A hybrid plan. You pay less in network, may have some out-of-network coverage, and often need referrals.",
    usuallyBetterFor: "People who like a primary-care gatekeeper but want some out-of-network option.",
    watchFor: "Referral rules and out-of-network costs can make the plan harder to use than it looks.",
    network: "Moderate",
    referral: "Usually required",
    outOfNetwork: "Sometimes covered at higher cost",
    tone: "blue",
    icon: ClipboardCheck,
  },
  {
    name: "HDHP / HSA-eligible plan",
    plainEnglish: "A high-deductible health plan can pair with an HSA if it meets IRS rules. Premiums may be lower, but you may pay more before coverage kicks in.",
    usuallyBetterFor: "People with emergency savings, employer HSA money, low expected care, or a long-term HSA strategy.",
    watchFor: "A low premium can hide a large deductible. Expensive medications or recurring care can change the answer fast.",
    network: "Varies",
    referral: "Varies",
    outOfNetwork: "Varies by plan",
    tone: "slate",
    icon: WalletCards,
  },
];

const metalRows = [
  ["Bronze", "Lower premium", "Higher deductible/cost-sharing", "People who want lower monthly cost and can handle more upfront risk."],
  ["Silver", "Middle ground", "Moderate deductible/cost-sharing", "People who may qualify for cost-sharing reductions or want a balanced option."],
  ["Gold", "Higher premium", "Lower deductible/cost-sharing", "People who expect more care and prefer more predictable costs."],
  ["Platinum", "Highest premium", "Lowest cost-sharing", "People with heavy expected care where available and affordable."],
];

const carrierCategories = [
  {
    title: "National commercial carriers",
    body: "Large insurers may have broad employer relationships and national network branding. The real question is still your specific plan network, employer contract, and formulary.",
    icon: Building2,
  },
  {
    title: "Blue Cross / Blue Shield plans",
    body: "Blue plans can be strong regionally, but they are not one identical national product. Local plan details and network contracts matter.",
    icon: Shield,
  },
  {
    title: "Integrated delivery systems",
    body: "Some plans are closely tied to a health system. They can feel coordinated when you stay inside the system and restrictive when you do not.",
    icon: Hospital,
  },
  {
    title: "Employer self-funded plans",
    body: "Many employer plans use a carrier as the administrator, but the employer may be the one funding claims. The logo alone does not tell you the rules.",
    icon: Stethoscope,
  },
];

const sourceLinks = [
  ["HealthCare.gov — Health insurance plan and network types", "https://www.healthcare.gov/choose-a-plan/plan-types/"],
  ["HealthCare.gov — Bronze, Silver, Gold, and Platinum categories", "https://www.healthcare.gov/choose-a-plan/plans-categories/"],
  ["HealthCare.gov — Total costs for health care", "https://www.healthcare.gov/choose-a-plan/your-total-costs/"],
  ["CMS — Summary of Benefits and Coverage resources", "https://www.cms.gov/cciio/resources/forms-reports-and-other-resources/summary-of-benefits-and-coverage-and-uniform-glossary"],
];

const HealthInsurancePlanTypesPage = () => {
  useSeo({
    title: "Health Insurance Plan Types Explained",
    description:
      "A plain-English guide to HMO, PPO, EPO, POS, HDHP, HSA-eligible plans, metal levels, carrier differences, and what to verify before comparing commercial insurance plans.",
    canonicalPath: "/insurance/health-insurance-plan-types",
  });

  return (
    <>
      <PageHero
        eyebrow="Commercial insurance basics"
        title="HMO, PPO, EPO, HDHP: What the Plan Names Actually Mean"
        description="Start here before using the comparison calculator. The insurer logo matters less than the plan type, network, deductible, drug coverage, and rules for getting care."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#plan-types">Compare plan types <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/insurance/commercial-insurance-comparison">Use the calculator</Link>
        </Button>
      </PageHero>

      <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-primary/15 bg-primary-soft/25 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The simplest answer</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">There are real differences, but usually not by insurer logo alone.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                UnitedHealthcare, Aetna, Cigna, Blue Cross, Kaiser, Humana, Oscar, and regional carriers can all look very different depending on the exact employer plan, Marketplace plan, ZIP code, provider network, drug formulary, and prior authorization rules. A carrier name is not enough to judge a plan.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "First compare plan type: HMO, PPO, EPO, POS, HDHP.",
                "Then compare total cost: premium, deductible, copays, coinsurance, out-of-pocket max.",
                "Then verify doctors, hospitals, drugs, referrals, and prior authorization.",
                "Only then does the carrier brand become useful context.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-primary/15 bg-card p-4 text-sm font-semibold text-foreground shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plan-types" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Plan type cheat sheet"
            title="The main commercial plan types"
            description="This is the easier front door before asking someone to fill in every calculator field."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {planTypes.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.name} className="rounded-3xl border-border/80 shadow-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <Badge tone={plan.tone}>{plan.name}</Badge>
                          <CardTitle className="mt-2 font-display text-2xl">{plan.plainEnglish}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Network</div>
                        <div className="mt-2 font-semibold">{plan.network}</div>
                      </div>
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Referrals</div>
                        <div className="mt-2 font-semibold">{plan.referral}</div>
                      </div>
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Out of network</div>
                        <div className="mt-2 font-semibold">{plan.outOfNetwork}</div>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-950">
                        <div className="mb-1 flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" /> Often better for</div>
                        {plan.usuallyBetterFor}
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                        <div className="mb-1 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Watch for</div>
                        {plan.watchFor}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Metal levels"
            title="Bronze, Silver, Gold, and Platinum are cost-sharing labels — not quality labels"
            description="A Gold plan is not automatically a better doctor network than a Silver plan. The metal level mostly describes how the cost is split between you and the plan for covered care."
          />
          <Card className="overflow-hidden rounded-3xl border-border/80 shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">Health insurance metal level comparison</caption>
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="p-4 font-bold">Category</th>
                    <th scope="col" className="p-4 font-bold">Premium pattern</th>
                    <th scope="col" className="p-4 font-bold">Cost-sharing pattern</th>
                    <th scope="col" className="p-4 font-bold">Plain-English use case</th>
                  </tr>
                </thead>
                <tbody>
                  {metalRows.map(([category, premium, sharing, useCase]) => (
                    <tr key={category} className="border-t border-border">
                      <th scope="row" className="p-4 font-display text-lg font-bold">{category}</th>
                      <td className="p-4 text-muted-foreground">{premium}</td>
                      <td className="p-4 text-muted-foreground">{sharing}</td>
                      <td className="p-4 text-muted-foreground">{useCase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Carrier differences"
            title="What can differ between commercial insurance companies?"
            description="There can be meaningful differences, but they are usually local and plan-specific. Use the carrier name as a clue, not a conclusion."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {carrierCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="rounded-3xl border-border/80 shadow-card">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">{category.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{category.body}</CardDescription>
                  </CardHeader>
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
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Before choosing</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-amber-950">The five checks that matter more than the logo</h2>
            </div>
            <ol className="grid gap-3">
              {[
                "Are your doctors and hospitals in network for this exact plan year?",
                "Are your medications covered, and what tier are they on?",
                "Does the deductible apply before copays for visits, drugs, labs, imaging, or therapy?",
                "Do referrals, prior authorization, step therapy, or quantity limits apply?",
                "What is the realistic bad-year exposure: premium plus out-of-pocket maximum minus employer HSA/HRA money?",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-amber-200 bg-white/75 p-4 text-sm leading-relaxed text-amber-950">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-extrabold text-amber-800">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
                <HeartPulse className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Ready for numbers?</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                After you understand the plan type, use the calculator to compare normal-year cost, bad-year exposure, and verification risk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="hero">
                <Link to="/insurance/commercial-insurance-comparison#comparison-tool">Open comparison calculator</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Pill className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Medication users should be extra careful</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                For people with expensive or recurring medications, the formulary, tier, specialty pharmacy rules, prior authorization, and step therapy can matter more than the premium.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/insurance/medication-coverage-checklist">Medication checklist</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Sources" title="Where to verify details" description="Use this page as a plain-English guide. Use current plan documents and official sources to verify live benefits." />
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

export default HealthInsurancePlanTypesPage;
