import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileQuestion,
  HeartPulse,
  Home,
  Hospital,
  PhoneCall,
  Printer,
  Shield,
  Stethoscope,
  Truck,
  WalletCards,
  Walker,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

type Tone = "blue" | "green" | "amber" | "slate";
type NeedId = "walker" | "snf" | "homeHealth" | "oxygen" | "wound" | "transport" | "custodial" | "meds";

type DischargeInput = {
  payer: "medicare" | "ma" | "commercial" | "medicaid" | "unknown";
  destination: "home" | "snf" | "inpatientRehab" | "assistedLiving" | "unknown";
  authStatus: "approved" | "pending" | "denied" | "unknown";
  networkStatus: "confirmed" | "notConfirmed" | "outOfNetwork" | "unknown";
  needs: Record<NeedId, boolean>;
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20";

const Badge = ({ children, tone = "blue" }: { children: string; tone?: Tone }) => {
  const tones: Record<Tone, string> = {
    blue: "border-primary/20 bg-primary-soft text-primary",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-border bg-muted text-muted-foreground",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
};

const coverageReasons = [
  {
    title: "Walker, wheelchair, commode, hospital bed, oxygen, or other DME",
    plain: "The equipment usually has to be medically necessary, ordered by a clinician, appropriate for home use, and supplied by a covered/in-network supplier.",
    whyDenied: "The order may be missing, the documentation may not support medical necessity, the supplier may be out of network, or the item may not meet the plan's DME definition.",
    ask: "Who ordered it? What diagnosis and documentation were sent? Which supplier is in network? Is this rental or purchase? What is the patient cost?",
    icon: Walker,
  },
  {
    title: "STR / SNF after the hospital",
    plain: "Skilled nursing facility coverage is usually for skilled rehab or skilled nursing needs, not simply because someone is weak, unsafe alone, or needs help with daily activities.",
    whyDenied: "Insurance may decide the patient does not meet skilled criteria, prior authorization may be pending or denied, the facility may be out of network, or the patient may have used available covered days/benefits.",
    ask: "What skilled need was submitted? How many days were approved? What is the copay per day? What happens if therapy says progress has plateaued?",
    icon: Hospital,
  },
  {
    title: "Home health nursing or therapy",
    plain: "Home health usually requires skilled need and a homebound-style standard. It is not the same as 24-hour care, meals, housekeeping, or long-term custodial help.",
    whyDenied: "The patient may not meet skilled need or homebound criteria, the agency may be out of network, visits may be limited, or the plan may require authorization.",
    ask: "Which agency accepted the case? How many visits are expected? Which services are covered? What is not covered?",
    icon: Home,
  },
  {
    title: "Transportation home or to rehab",
    plain: "Ambulance or medical transport coverage usually depends on medical necessity, destination, network rules, and whether a lower level of transportation would be safe.",
    whyDenied: "A stretcher or ambulance ride may be considered convenience transportation if documentation does not support medical need.",
    ask: "What level of transport is medically necessary? Was authorization required? Is the transport company in network? What could the bill be if denied?",
    icon: Truck,
  },
  {
    title: "Custodial care, aides, supervision, meals, and long-term help",
    plain: "Many families expect insurance to cover help at home because discharge feels unsafe. Health insurance often covers skilled care, not long-term daily living support by itself.",
    whyDenied: "Bathing, dressing, toileting, supervision, meal prep, and housekeeping may be considered custodial/personal care rather than skilled medical care.",
    ask: "Is this skilled care, custodial care, or both? Are Medicaid, VA benefits, private pay aides, family caregiving, or community resources realistic options?",
    icon: HeartPulse,
  },
];

const futurePlanChecks = [
  "During open enrollment, compare post-acute rehab rules, DME coverage, home health coverage, prior authorization rules, and network access — not only the premium.",
  "For Medicare Advantage, check whether preferred hospitals, SNFs, home health agencies, DME suppliers, and specialists are in network before a crisis.",
  "For commercial plans, review the Summary of Benefits and Coverage for rehabilitation services, habilitation services, home health care, DME, ambulance, and out-of-network rules.",
  "For families with declining mobility or chronic illness, ask whether long-term care planning, Medicaid planning, caregiver support, or private-pay backup resources are needed before hospitalization.",
];

const sourceLinks = [
  ["Medicare.gov — Durable medical equipment coverage", "https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage"],
  ["Medicare.gov — Skilled nursing facility care", "https://www.medicare.gov/coverage/skilled-nursing-facility-care"],
  ["Medicare.gov — Home health services", "https://www.medicare.gov/coverage/home-health-services"],
  ["HealthCare.gov — Glossary of health coverage and medical terms", "https://www.healthcare.gov/sbc-glossary/"],
  ["HealthCare.gov — Appealing a health plan decision", "https://www.healthcare.gov/appeal-insurance-company-decision/"],
];

const needLabels: { id: NeedId; label: string }[] = [
  { id: "walker", label: "Walker, wheelchair, commode, hospital bed, or DME" },
  { id: "snf", label: "Short-term rehab / skilled nursing facility" },
  { id: "homeHealth", label: "Home health nursing, PT, OT, or speech therapy" },
  { id: "oxygen", label: "Oxygen or respiratory equipment" },
  { id: "wound", label: "Wound care or dressing supplies" },
  { id: "transport", label: "Ambulance, wheelchair van, or stretcher transport" },
  { id: "custodial", label: "Help bathing, dressing, toileting, meals, or supervision" },
  { id: "meds", label: "New medications, pharmacy access, or prior authorization" },
];

const destinationLabels: Record<DischargeInput["destination"], string> = {
  home: "Home",
  snf: "Skilled nursing facility / short-term rehab",
  inpatientRehab: "Inpatient rehabilitation facility",
  assistedLiving: "Assisted living or long-term care setting",
  unknown: "Not sure yet",
};

const payerLabels: Record<DischargeInput["payer"], string> = {
  medicare: "Original Medicare",
  ma: "Medicare Advantage",
  commercial: "Commercial / employer plan",
  medicaid: "Medicaid or dual coverage",
  unknown: "Not sure yet",
};

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) => (
  <label className="block rounded-2xl border border-border bg-background/60 p-4">
    <span className="text-sm font-bold text-foreground">{label}</span>
    <select className={`${inputClass} mt-3`} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>{optionLabel}</option>
      ))}
    </select>
  </label>
);

const ExplanationCard = ({ item }: { item: (typeof coverageReasons)[number] }) => {
  const Icon = item.icon;

  return (
    <Card className="rounded-3xl border-border/80 shadow-card">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="font-display text-2xl leading-tight">{item.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{item.plain}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <div className="mb-1 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Why it may be denied</div>
          {item.whyDenied}
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-950">
          <div className="mb-1 flex items-center gap-2 font-bold"><PhoneCall className="h-4 w-4" /> What to ask</div>
          {item.ask}
        </div>
      </CardContent>
    </Card>
  );
};

const HospitalDischargeCoveragePage = () => {
  useSeo({
    title: "Hospital Discharge Coverage Guide for Families",
    description:
      "A family-facing guide to insurance coverage at hospital discharge, including DME, walkers, short-term rehab, SNF days, home health, oxygen, transportation, prior authorization, and custodial care gaps.",
    canonicalPath: "/insurance/hospital-discharge-coverage",
  });

  const [input, setInput] = useState<DischargeInput>({
    payer: "unknown",
    destination: "home",
    authStatus: "unknown",
    networkStatus: "unknown",
    needs: {
      walker: true,
      snf: false,
      homeHealth: true,
      oxygen: false,
      wound: false,
      transport: false,
      custodial: false,
      meds: false,
    },
  });

  const checklist = useMemo(() => {
    const items = [
      `Confirm the expected discharge destination: ${destinationLabels[input.destination]}.`,
      `Confirm the payer being used for discharge services: ${payerLabels[input.payer]}.`,
      input.authStatus === "approved"
        ? "Save the authorization number, approved service, approved dates, and approved provider/facility."
        : "Ask whether prior authorization is required, submitted, pending, denied, or not started.",
      input.networkStatus === "confirmed"
        ? "Save the in-network facility, agency, supplier, pharmacy, and transportation names."
        : "Ask whether the SNF/rehab facility, home health agency, DME supplier, pharmacy, and transport provider are in network.",
      "Ask whether the discharge need is skilled care, custodial care, or both.",
      "Ask what is covered, what is not covered, how long approval lasts, and what the estimated patient cost could be.",
      "Ask for the backup plan if the first facility, agency, supplier, or authorization request fails.",
    ];

    if (input.needs.walker) items.push("For DME: ask who is writing the order, which supplier will fill it, whether it is rent or purchase, and whether delivery can happen before discharge.");
    if (input.needs.snf) items.push("For STR/SNF: ask how many days are approved, what skilled need supports the stay, what the daily copay is, and what happens if progress stalls.");
    if (input.needs.homeHealth) items.push("For home health: ask which agency accepted the referral, what visits are ordered, and whether the patient meets the plan's skilled/homebound requirements.");
    if (input.needs.custodial) items.push("For personal care needs: ask directly whether insurance covers aide hours, supervision, meals, toileting, bathing, or dressing help — many plans do not cover this by itself.");
    if (input.needs.transport) items.push("For transport: ask what level of transportation is medically necessary, who documents it, and what happens if the payer denies it after the ride.");
    if (input.needs.meds) items.push("For medications: confirm pharmacy access, formulary status, prior authorization, dose limits, and whether the first fill is affordable today.");

    return items;
  }, [input]);

  const callScript = `I am trying to understand discharge coverage, not argue with the discharge plan. Can you tell me what level of care is being recommended, what insurance has approved or denied, whether the provider or supplier is in network, what documentation is missing, what the patient cost could be, and what backup options we have if coverage does not come through before discharge?`;

  return (
    <>
      <PageHero
        eyebrow="Hospital discharge"
        title="When Insurance Says No at Discharge: A Family Guide"
        description="Understand why a walker, short-term rehab bed, home health visit, oxygen setup, transport, or aide support may not be covered — and what to ask before discharge day."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#coverage-checklist">Build checklist <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#why-denied">Why coverage gets denied</a>
        </Button>
      </PageHero>

      <main className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Bedside reality</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-amber-950">“Medically ready” does not always mean “coverage is ready.”</h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-950/80 md:text-base">
                Hospitals decide when someone no longer needs inpatient hospital care. Insurance decides what post-hospital services it will pay for. Facilities, home health agencies, DME suppliers, and transport companies may each have their own acceptance, authorization, and network steps.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "A safe discharge plan is not always a fully covered discharge plan.",
                "A case manager may be reporting a payer rule, not making a personal judgment.",
                "A denial can be about documentation, medical necessity, network, authorization, or exhausted benefits.",
                "Families should ask for the rule underneath the answer, not just accept the one-sentence denial.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-amber-200 bg-white/75 p-4 text-sm font-semibold text-amber-950 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Simple map"
            title="What insurance may cover after discharge"
            description="Families usually need to separate skilled care, equipment, transportation, medications, and long-term daily help. They are not covered the same way."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Stethoscope, "Skilled care", "PT, OT, speech therapy, skilled nursing, wound care, injections, monitoring, or other medically necessary skilled services."],
              [Walker, "Equipment", "Walkers, wheelchairs, commodes, hospital beds, oxygen, and other DME usually need orders, documentation, and a covered supplier."],
              [Home, "Home support", "Home health may cover skilled visits, but it usually does not mean 24-hour care, housekeeping, meals, or supervision."],
              [WalletCards, "Patient cost", "Approval does not always mean free. Copays, coinsurance, deductibles, daily SNF costs, and noncovered items may still apply."],
            ].map(([Icon, title, body]) => {
              const TypedIcon = Icon as typeof Stethoscope;
              return (
                <Card key={title as string} className="rounded-3xl border-border/80 shadow-card">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <TypedIcon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">{title as string}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{body as string}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="why-denied" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Why the answer may be no"
            title="Common discharge coverage problems"
            description="Use these explanations when a family is told a walker, STR bed, home health referral, transport, or aide support is not covered."
          />
          <div className="space-y-5">
            {coverageReasons.map((item) => <ExplanationCard key={item.title} item={item} />)}
          </div>
        </section>

        <section id="coverage-checklist" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Checklist builder"
            title="Build a discharge coverage checklist"
            description="Fill in what you know. The output gives families practical questions for case management, the insurer, the receiving facility, the DME supplier, or the home health agency."
          />
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl border-border/80 shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Discharge details</CardTitle>
                <CardDescription>Use best available information. Unknown is acceptable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SelectField
                  label="Main payer"
                  value={input.payer}
                  onChange={(value) => setInput((current) => ({ ...current, payer: value as DischargeInput["payer"] }))}
                  options={[["unknown", "Not sure yet"], ["medicare", "Original Medicare"], ["ma", "Medicare Advantage"], ["commercial", "Commercial / employer plan"], ["medicaid", "Medicaid or dual coverage"]]}
                />
                <SelectField
                  label="Expected destination"
                  value={input.destination}
                  onChange={(value) => setInput((current) => ({ ...current, destination: value as DischargeInput["destination"] }))}
                  options={[["home", "Home"], ["snf", "Skilled nursing facility / short-term rehab"], ["inpatientRehab", "Inpatient rehabilitation facility"], ["assistedLiving", "Assisted living or long-term care setting"], ["unknown", "Not sure yet"]]}
                />
                <SelectField
                  label="Authorization status"
                  value={input.authStatus}
                  onChange={(value) => setInput((current) => ({ ...current, authStatus: value as DischargeInput["authStatus"] }))}
                  options={[["unknown", "Not sure"], ["approved", "Approved"], ["pending", "Pending"], ["denied", "Denied"]]}
                />
                <SelectField
                  label="Network status"
                  value={input.networkStatus}
                  onChange={(value) => setInput((current) => ({ ...current, networkStatus: value as DischargeInput["networkStatus"] }))}
                  options={[["unknown", "Not sure"], ["confirmed", "Confirmed in network"], ["notConfirmed", "Not confirmed"], ["outOfNetwork", "Out of network"]]}
                />
                <div className="space-y-2">
                  <span className="text-sm font-bold text-foreground">Known discharge needs</span>
                  <div className="grid gap-2">
                    {needLabels.map((need) => (
                      <label key={need.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/60 p-3 text-sm">
                        <input
                          className="mt-1 h-4 w-4 rounded border-border"
                          type="checkbox"
                          checked={Boolean(input.needs[need.id])}
                          onChange={(event) => setInput((current) => ({ ...current, needs: { ...current.needs, [need.id]: event.target.checked } }))}
                        />
                        <span className="font-medium leading-relaxed text-foreground">{need.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
              <CardHeader>
                <Badge tone={input.authStatus === "approved" ? "green" : input.authStatus === "denied" ? "amber" : "blue"}>Family checklist</Badge>
                <CardTitle className="font-display text-2xl">Questions to ask before discharge</CardTitle>
                <CardDescription>Save names, dates, times, reference numbers, authorization numbers, and copies of notices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {checklist.map((item) => (
                    <li key={item} className="flex gap-2">
                      <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl border border-primary/20 bg-card p-4 text-sm leading-relaxed text-foreground">
                  <div className="mb-1 font-bold">Call script</div>
                  {callScript}
                </div>
                <Button type="button" variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" /> Print/save checklist
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Prevent the next crisis"
            title="Coverage changes to consider later"
            description="Families cannot always fix the current discharge problem during a hospital stay. But they can use the experience to choose better coverage or plan cash resources later."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {futurePlanChecks.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-card">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-border/80 shadow-card">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <FileQuestion className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">If coverage is denied</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Ask for the denial reason in writing, the appeal process, whether expedited review is available, what documentation is missing, and whether the provider can request peer-to-peer review if medically appropriate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/insurance/prior-authorization-guide">Open prior authorization guide</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-primary/20 bg-primary-soft/30 shadow-card">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-2xl">Choosing coverage later</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Use the commercial or Medicare comparison tools later to compare rehab, home health, DME, network, authorization, and bad-year exposure before the next hospitalization.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero"><Link to="/insurance/commercial-insurance-comparison">Commercial comparison</Link></Button>
              <Button asChild variant="outline"><Link to="/medicare-care-costs">Medicare cost hub</Link></Button>
            </CardContent>
          </Card>
        </section>

        <section id="sources" className="scroll-mt-24">
          <SectionHeading centered eyebrow="Sources" title="Where to verify details" description="Use this guide to organize the conversation. Use live plan documents, plan representatives, notices, and official sources before making care or payment decisions." />
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
      </main>
    </>
  );
};

export default HospitalDischargeCoveragePage;
