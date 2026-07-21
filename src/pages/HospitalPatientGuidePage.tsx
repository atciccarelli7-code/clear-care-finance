import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Copy,
  HeartPulse,
  Home,
  Pill,
  ShieldCheck,
  Stethoscope,
  Wind,
} from "lucide-react";
import DischargeReadinessSystem from "@/components/patients/DischargeReadinessSystem";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { CONSUMER_PATIENT_GUIDE_CARDS } from "@/data/consumerPatientGuideArticles";
import { trackSiteEvent } from "@/lib/analytics";

const guideIcons = [ClipboardList, Pill, Wind, HeartPulse, Home] as const;

type HelpModeId = "leaving" | "blocked" | "caregiving" | "medicines" | "coverage";

type HelpMode = {
  id: HelpModeId;
  label: string;
  answer: string;
  why: string;
  actions: [string, string, string];
  questions: [string, string, string];
  primaryLabel: string;
  primaryHref: string;
  guideIds?: string[];
  verification: string;
};

const HELP_MODES: HelpMode[] = [
  {
    id: "leaving",
    label: "Leaving the hospital",
    answer: "Before leaving, identify the final written plan, what must happen during the first night, and one owner for every unresolved item.",
    why: "A discharge can look complete on paper while a prescription, follow-up, ride, equipment delivery, pending result, or home support is still missing.",
    actions: [
      "Find the final discharge instructions and final medication list.",
      "Confirm prescriptions, equipment, transportation, and the first follow-up are actually available.",
      "Write down the contact and backup plan for anything still pending.",
    ],
    questions: [
      "Which document is the final plan for home?",
      "What has to happen tonight, tomorrow, and during the first 72 hours?",
      "Who owns each pending result, referral, prescription, equipment order, or appointment?",
    ],
    primaryLabel: "Open the first 72 hours guide",
    primaryHref: "/articles/safe-hospital-discharge-first-72-hours",
    guideIds: ["safe-hospital-discharge-first-72-hours"],
    verification: "The treating team’s written discharge instructions and medication list control.",
  },
  {
    id: "blocked",
    label: "Something is blocking discharge",
    answer: "A patient can be medically ready and still lack a safe, workable discharge plan. Name the barrier and identify the person, payer, supplier, or organization responsible for resolving it.",
    why: "Placement, authorization, equipment, medication access, transportation, caregiver capacity, and home services are separate operational problems with different owners.",
    actions: [
      "Select every unresolved barrier in the discharge readiness checklist.",
      "Ask which team or organization owns each barrier and what evidence is still missing.",
      "Ask for the interim mobility, therapy, medication, and safety plan while logistics are delayed.",
    ],
    questions: [
      "What exactly is preventing discharge today?",
      "Is the barrier a clinical recommendation, payer authorization, receiving-facility acceptance, or practical home limitation?",
      "What is the next escalation step, who owns it, and when should we expect an update?",
    ],
    primaryLabel: "Identify the discharge barriers",
    primaryHref: "#discharge-readiness",
    verification: "The treating team, payer, supplier, and receiving organization each control different parts of the final plan.",
  },
  {
    id: "caregiving",
    label: "Caring for someone at home",
    answer: "Build a first-72-hours plan that separates what the patient can do, what the caregiver is expected to do, and who to contact when part of the plan fails.",
    why: "Families are often handed instructions without a realistic check of transportation, mobility, food, equipment, medication access, sleep, or caregiver capacity.",
    actions: [
      "Review the plan together and use teach-back: explain tonight’s and tomorrow’s actions in your own words.",
      "Confirm the caregiver can safely perform each expected task and has the needed supplies.",
      "Save the after-hours contacts and a backup plan for medication, equipment, transportation, or symptom questions.",
    ],
    questions: [
      "What am I expected to do, and what should a licensed clinician, supplier, or agency do?",
      "What would make this home plan unsafe or unrealistic?",
      "Which number should I call after hours when the plan does not work?",
    ],
    primaryLabel: "Build the first 72 hours plan",
    primaryHref: "/articles/safe-hospital-discharge-first-72-hours",
    guideIds: ["safe-hospital-discharge-first-72-hours"],
    verification: "The treating team must confirm the patient-specific care plan and whether caregiver training is complete.",
  },
  {
    id: "medicines",
    label: "Medicines or equipment",
    answer: "Use the exact written prescription, label, equipment order, and treating-team instructions. Do not reconstruct medication or oxygen instructions from memory or from a general website.",
    why: "Medication names, schedules, missed-dose rules, oxygen settings, equipment supplies, and troubleshooting instructions are not interchangeable.",
    actions: [
      "Match every new, changed, continued, stopped, or held medicine to the final written list.",
      "Confirm the pharmacy or equipment supplier has accepted the order and can deliver before it is needed.",
      "Record the product-specific contact for a late dose, refill, device problem, supply failure, or coverage delay.",
    ],
    questions: [
      "Which exact written list and label control?",
      "When will the medicine, oxygen, nebulizer, or supplies be physically available?",
      "Who should we contact for product-specific instructions or a failed delivery?",
    ],
    primaryLabel: "See medicine and equipment guides",
    primaryHref: "#medicine-equipment-guides",
    guideIds: ["blood-thinner-safety-before-going-home", "new-home-oxygen-nebulizer-guide"],
    verification: "The prescribing team, pharmacist, equipment supplier, and written product instructions control the exact patient-specific directions.",
  },
  {
    id: "coverage",
    label: "Coverage or bills",
    answer: "Separate what is clinically recommended from what the payer authorizes, what a supplier or facility accepts, and what the patient may owe.",
    why: "A referral or order does not prove authorization, network status, acceptance, delivery, or final financial responsibility.",
    actions: [
      "Identify the exact service, item, facility, or document creating the question.",
      "Ask the payer or benefits office what rule, notice, authorization, or appeal path controls.",
      "Keep written notices, names, dates, reference numbers, estimates, EOBs, MSNs, and itemized bills together.",
    ],
    questions: [
      "Has the payer authorized this exact service, supplier, facility, and date?",
      "Has the receiving organization or supplier accepted the patient or order?",
      "What written notice explains the decision, cost, denial, or appeal deadline?",
    ],
    primaryLabel: "Open discharge coverage guidance",
    primaryHref: "/insurance/hospital-discharge-coverage",
    verification: "The current plan documents, payer, Medicare or Medicaid agency, provider, supplier, and written notices control coverage and liability.",
  },
];

const relatedHelp = [
  [BadgeDollarSign, "Hospital discharge coverage", "Rehabilitation, home health, equipment, prescriptions, authorization, and backup care.", "/insurance/hospital-discharge-coverage"],
  [ShieldCheck, "Medicare discharge checklist", "Hospital status, skilled-care requirements, networks, authorization, costs, and notices.", "/tools/hospital-discharge-medicare-checklist"],
  [BookOpenCheck, "Medical Bill Response System", "Identify the document, compare payer and provider information, and build the next actions.", "/insurance/medical-bill-review-toolkit"],
  [Stethoscope, "Observation versus inpatient status", "Understand why hospital location does not determine admission status or coverage.", "/articles/observation-vs-inpatient-status"],
] as const;

const HospitalPatientGuidePage = () => {
  const [selectedId, setSelectedId] = useState<HelpModeId | null>(null);
  const [copied, setCopied] = useState(false);
  const selected = HELP_MODES.find((mode) => mode.id === selectedId) ?? null;
  const selectedGuides = useMemo(
    () => selected?.guideIds?.flatMap((id) => {
      const guide = CONSUMER_PATIENT_GUIDE_CARDS.find((item) => item.id === id);
      return guide ? [guide] : [];
    }) ?? [],
    [selected],
  );

  const chooseMode = (id: HelpModeId) => {
    setSelectedId(id);
    setCopied(false);
    trackSiteEvent("patient_guide_mode_selected", { mode_id: id });
  };

  const copyPlan = async () => {
    if (!selected) return;
    const text = [
      `HOSPITAL & PATIENT GUIDE — ${selected.label.toUpperCase()}`,
      "",
      selected.answer,
      "",
      "NEXT THREE ACTIONS",
      ...selected.actions.map((item) => `- ${item}`),
      "",
      "QUESTIONS TO ASK",
      ...selected.questions.map((item) => `- ${item}`),
      "",
      `VERIFY: ${selected.verification}`,
      "",
      "Community Acquired Finance provides general education only. The treating team and controlling official sources make patient-specific decisions.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackSiteEvent("patient_guide_plan_copied", { mode_id: selected.id });
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <nav className="container py-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/patients-families" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Patients &amp; Caregivers</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-foreground">Hospital &amp; Patient Guide</li>
        </ol>
      </nav>

      <PageHero
        eyebrow="Hospital & Patient Guide"
        title="What do you need help with right now?"
        description="Choose the immediate problem. You will see one plain-English starting point, three actions, three questions to ask, and the source or team that must verify the final plan."
      >
        <Button asChild variant="hero" size="lg"><a href="#help-mode-selector">Choose my situation <ArrowRight className="h-4 w-4" /></a></Button>
        <Button asChild variant="ghost" size="lg"><a href="#all-hospital-resources">Browse all resources</a></Button>
      </PageHero>

      <section className="border-b border-trust/20 bg-trust-soft/70 py-4" aria-labelledby="guide-boundary-title">
        <div className="container flex max-w-5xl items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-trust" aria-hidden="true" />
          <div>
            <h2 id="guide-boundary-title" className="font-display text-base font-bold">Preparation, not personalized medical instructions</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">The treating team’s written instructions control. CAF does not diagnose, change treatment, set oxygen flow, provide medication doses or missed-dose rules, or decide whether a symptom is an emergency.</p>
          </div>
        </div>
      </section>

      <section id="help-mode-selector" className="container max-w-6xl scroll-mt-24 py-12 md:py-16" aria-labelledby="mode-selector-title">
        <SectionHeading
          centered
          eyebrow="Choose one immediate need"
          title="Start with the operational problem—not the medical vocabulary."
          description="These fixed choices stay in this browser session. No name, diagnosis, policy number, claim detail, or free-text medical information is requested."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Choose what you need help with right now">
          {HELP_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={selectedId === mode.id}
              onClick={() => chooseMode(mode.id)}
              className={`min-h-16 rounded-xl border p-4 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selectedId === mode.id
                  ? "border-action bg-action text-action-foreground"
                  : "border-border bg-card hover:border-action/40 hover:bg-action-soft/35"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {!selected && (
          <div className="mt-6 surface-neutral rounded-2xl p-5 text-center text-sm text-muted-foreground">
            Choose the closest situation above. You can change it at any time.
          </div>
        )}

        {selected && (
          <article className="mt-7 overflow-hidden rounded-3xl border border-success/30 bg-card shadow-card" aria-live="polite">
            <div className="surface-success border-x-0 border-t-0 p-5 md:p-7">
              <div className="semantic-label flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Your starting point</div>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight md:text-3xl">{selected.answer}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">{selected.why}</p>
            </div>

            <div className="grid gap-0 lg:grid-cols-2">
              <section className="p-5 md:p-7" aria-labelledby="mode-actions-heading">
                <div className="semantic-label text-action">Your next three actions</div>
                <ol id="mode-actions-heading" className="mt-4 space-y-4">
                  {selected.actions.map((action, index) => (
                    <li key={action} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-action text-xs font-extrabold text-action-foreground">{index + 1}</span>
                      <span className="pt-0.5 text-sm font-semibold leading-relaxed text-foreground">{action}</span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="border-t border-border bg-neutral-soft/55 p-5 md:p-7 lg:border-l lg:border-t-0" aria-labelledby="mode-questions-heading">
                <div className="semantic-label text-neutral">Questions to ask</div>
                <ul id="mode-questions-heading" className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                  {selected.questions.map((question) => <li key={question} className="border-l-2 border-neutral/25 pl-3">{question}</li>)}
                </ul>
              </section>
            </div>

            <div className="border-t border-border p-5 md:p-7">
              <div className="surface-caution rounded-2xl p-4">
                <div className="semantic-label text-caution">Verify before acting</div>
                <p className="mt-2 text-sm font-semibold leading-relaxed">{selected.verification}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild><a href={selected.primaryHref}>{selected.primaryLabel} <ArrowRight className="h-4 w-4" /></a></Button>
                <Button type="button" variant="outline" onClick={copyPlan}><Copy className="h-4 w-4" /> {copied ? "Action plan copied" : "Copy questions and actions"}</Button>
                <Button type="button" variant="ghost" onClick={() => { setSelectedId(null); setCopied(false); }}>Choose a different situation</Button>
              </div>
              <div role="status" className="sr-only" aria-live="polite">{copied ? "Action plan copied to clipboard." : ""}</div>
            </div>
          </article>
        )}

        {selectedGuides.length > 0 && (
          <section id="medicine-equipment-guides" className="mt-8 scroll-mt-24" aria-labelledby="selected-guides-heading">
            <div className="semantic-label text-muted-foreground">Guides that match this situation</div>
            <h2 id="selected-guides-heading" className="mt-2 font-display text-2xl font-bold">Open only the guide you need.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {selectedGuides.map((guide) => (
                <Link key={guide.id} to={guide.route} className="group border-y border-border py-5 transition hover:bg-muted/20 sm:px-4">
                  <h3 className="font-display text-lg font-bold">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      {selectedId === "blocked" && <DischargeReadinessSystem />}

      <section id="all-hospital-resources" className="container max-w-6xl scroll-mt-24 py-12 md:py-16" aria-labelledby="all-resources-heading">
        <div className="mb-6">
          <div className="semantic-label text-optional">Optional depth</div>
          <h2 id="all-resources-heading" className="mt-2 font-display text-3xl font-bold">Browse the full Hospital &amp; Patient Guide only when useful.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">The selected mode stays above. These sections preserve the complete source-backed library without showing every pathway at once.</p>
        </div>

        <div className="space-y-4">
          <details className="group rounded-2xl border border-border bg-card p-5 open:border-action/30 md:p-6">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
              All five patient and caregiver guides
              <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-6 grid gap-5 border-t border-border pt-6 md:grid-cols-2 xl:grid-cols-5">
              {CONSUMER_PATIENT_GUIDE_CARDS.map((guide, index) => {
                const Icon = guideIcons[index] ?? CheckCircle2;
                return (
                  <article key={guide.id} className="flex flex-col border-l-2 border-border pl-4">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-lg font-bold leading-tight">{guide.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
                    <Link to={guide.route} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Read the guide <ArrowRight className="h-4 w-4" /></Link>
                  </article>
                );
              })}
            </div>
          </details>

          {selectedId !== "blocked" && (
            <details className="group rounded-2xl border border-border bg-card p-5 open:border-action/30 md:p-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                Discharge barriers and family question checklist
                <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="mt-6 -mx-5 -mb-5 border-t border-border md:-mx-6 md:-mb-6"><DischargeReadinessSystem /></div>
            </details>
          )}

          <details className="group rounded-2xl border border-border bg-card p-5 open:border-action/30 md:p-6">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
              Costs, coverage, and related help
              <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedHelp.map(([Icon, title, description, route]) => (
                <Link key={route} to={route} className="group border-l-2 border-border pl-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Open resource <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="container max-w-4xl pb-16 md:pb-20">
        <div className="surface-trust rounded-2xl p-5 md:p-6">
          <h2 className="font-display text-xl font-bold">How to judge each guide</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Look for the named author and credentials, published and reviewed dates, review scope, limitations, authoritative source links, and correction route. No independent clinical review is implied unless a qualified reviewer is explicitly named.</p>
        </div>
        <div className="mt-5"><DisclaimerBox /></div>
      </section>
    </>
  );
};

export default HospitalPatientGuidePage;
