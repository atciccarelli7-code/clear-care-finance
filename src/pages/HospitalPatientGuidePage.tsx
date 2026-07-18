import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  Bed,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  HeartPulse,
  Home,
  Pill,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import DischargeReadinessSystem from "@/components/patients/DischargeReadinessSystem";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import {
  HOSPITAL_GUIDE_OFFICIAL_RESOURCES,
  HOSPITAL_GUIDE_RESOURCES,
  HOSPITAL_GUIDE_STAGES,
  getHospitalGuideResourcesForStage,
  type HospitalGuidePageRole,
  type HospitalGuideStageId,
} from "@/data/hospitalPatientGuide";

const stageIcons: Record<HospitalGuideStageId, LucideIcon> = {
  before_hospital: ClipboardList,
  during_stay: Bed,
  medications_treatments: Pill,
  discharge_recovery: Home,
  bills_coverage: BadgeDollarSign,
};

const roleLabels: Record<HospitalGuidePageRole, string> = {
  hub: "Hub",
  article: "Explanation",
  guide: "Guide",
  tool: "Guided tool",
  checklist: "Checklist",
  printable: "Printable",
  "official-resource": "Official resource",
};

const trackStage = (stageId: HospitalGuideStageId) =>
  trackSiteEvent("patient_guide_stage_selected", { stage_id: stageId, item_id: stageId });

const trackResource = (stageId: HospitalGuideStageId, itemId: string, destinationPath: string) =>
  trackSiteEvent("patient_guide_resource_selected", {
    stage_id: stageId,
    item_id: itemId,
    destination_path: destinationPath,
  });

const featuredResources = HOSPITAL_GUIDE_RESOURCES.filter(
  (resource) => resource.availability === "new" && resource.launchStatus === "published",
);

const practicalToolIds = new Set([
  "observation_inpatient_tool",
  "discharge_coverage_guide",
  "discharge_medicare_checklist",
  "medical_bill_toolkit",
]);

type RnInsight = {
  id: string;
  stageId: HospitalGuideStageId;
  title: string;
  body: string;
  question: string;
  route: string;
  cta: string;
};

const rnInsights: RnInsight[] = [
  {
    id: "rn_discharge_handoff",
    stageId: "discharge_recovery",
    title: "Discharge is a handoff assembled by several people",
    body: "The medication list, therapy recommendation, equipment plan, follow-up schedule, and insurance status may be updated by different clinicians at different times. A rushed or inconsistent instruction is not proof that nobody cared; it is a reason to compare the final written plan line by line before leaving.",
    question: "Ask: What changed today, what is still pending, and which written document is the final plan for home?",
    route: "/insurance/hospital-discharge-coverage",
    cta: "Use the discharge guide",
  },
  {
    id: "rn_therapy_documentation",
    stageId: "discharge_recovery",
    title: "Therapy participation helps show what level of care is safe",
    body: "Physical and occupational therapy assessments often help support recommendations for short-term rehabilitation, home health, equipment, or a home discharge. The recommendation must reflect what the patient can actually do now, not only what was possible before the illness or on a better day.",
    question: "Ask: Has function changed since the last assessment, and does the current therapy documentation match the proposed destination?",
    route: "/articles/does-medicare-cover-rehab-after-hospital-stay",
    cta: "Understand rehab coverage",
  },
  {
    id: "rn_denial_documentation",
    stageId: "bills_coverage",
    title: "A denial may reflect the record the payer reviewed",
    body: "Coverage decisions often depend on the clinical criteria, orders, therapy notes, nursing observations, and provider documentation submitted with the request. When the patient's condition or function changes, an updated assessment can matter. A verbal no should be translated into the written reason, the evidence used, and the available review path.",
    question: "Ask: What exact criteria were not met, which notes were reviewed, and can updated documentation, peer-to-peer review, or an expedited appeal apply?",
    route: "/tools/prior-authorization-next-step-guide",
    cta: "Build a denial response",
  },
  {
    id: "rn_medication_followup",
    stageId: "medications_treatments",
    title: "Questioning a medication is different from losing the follow-up plan",
    body: "It is reasonable to ask why a medication is recommended, discuss alternatives, or decide to revisit the choice. The safety problem is leaving without knowing which laboratory test, symptom, home reading, or follow-up appointment will reopen the decision and who is responsible for it.",
    question: "Ask: If we wait or decline today, what monitoring and follow-up keeps this decision from being forgotten?",
    route: "/articles/why-did-the-hospital-stop-or-change-my-home-medications",
    cta: "Prepare medication questions",
  },
];

const HospitalPatientGuidePage = () => (
  <>
    <nav className="container py-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li><Link className="rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to="/">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link className="rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to="/patients-families">Patients &amp; Caregivers</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-semibold text-foreground">Hospital &amp; Patient Guide</li>
      </ol>
    </nav>

    <PageHero
      eyebrow="Hospital & Patient Guide"
      title="Understand what is happening, what comes next, and what to ask."
      description="RN-led, source-checked guidance for understanding a hospital stay, medications, discharge planning, insurance coverage, and medical bills."
    >
      <Button asChild variant="hero" size="lg">
        <a href="#during_stay" onClick={() => trackStage("during_stay")}>I am in the hospital now <ArrowRight className="h-4 w-4" /></a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <a href="#discharge_recovery" onClick={() => trackStage("discharge_recovery")}>Discharge is approaching</a>
      </Button>
    </PageHero>

    <div>
      <section className="container py-12 md:py-16" aria-labelledby="situation-heading">
        <SectionHeading
          centered
          eyebrow="Choose the moment"
          title="What situation are you in?"
          description="Pick the closest stage. You can move forward or backward without filling out a form or entering medical details."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HOSPITAL_GUIDE_STAGES.map((stage) => {
            const Icon = stageIcons[stage.id];
            return (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                onClick={() => trackStage(stage.id)}
                className="group flex min-h-32 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-xs font-bold text-muted-foreground">Stage {stage.number}</span>
                </div>
                <span className="mt-4 font-display text-base font-bold leading-tight text-foreground">{stage.shortTitle}</span>
                <span className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.prompt}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/70 bg-primary-soft/25">
        <div className="container py-12 md:py-16">
          <SectionHeading
            eyebrow="Start with the explanation"
            title="Two common bedside questions, answered carefully"
            description="These guides combine privacy-minimized bedside perspective with current authoritative sources without making a patient-specific treatment recommendation."
          />
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {featuredResources.map((resource) => (
              <Link
                key={resource.id}
                to={resource.canonicalRoute}
                onClick={() => trackResource(resource.stageId, resource.id, resource.canonicalRoute)}
                className="group rounded-3xl border border-primary/20 bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Stethoscope className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">New · RN-led</span>
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">{resource.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{resource.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">{resource.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16" aria-labelledby="rn-insights-heading">
        <SectionHeading
          centered
          eyebrow="From the bedside"
          title="Four system truths families often learn too late"
          description="These privacy-minimized RN lessons explain where communication, documentation, participation, and follow-up change the practical outcome. They are prompts for better questions, not patient-specific conclusions."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {rnInsights.map((insight) => {
            const Icon = stageIcons[insight.stageId];
            return (
              <article key={insight.id} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  RN bedside lesson
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">{insight.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{insight.body}</p>
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary-soft/25 p-4 text-sm font-semibold leading-relaxed text-foreground">
                  {insight.question}
                </div>
                <Link
                  to={insight.route}
                  onClick={() => trackResource(insight.stageId, insight.id, insight.route)}
                  className="mt-5 inline-flex items-center gap-2 rounded font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {insight.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <DischargeReadinessSystem />

      <section className="container space-y-12 py-12 md:space-y-16 md:py-20" aria-labelledby="journey-heading">
        <SectionHeading
          centered
          eyebrow="The hospital journey"
          title="Five stages, one connected guide"
          description="Each stage gives a short explanation and links to the canonical article, guide, checklist, or tool. Existing URLs are preserved."
        />

        {HOSPITAL_GUIDE_STAGES.map((stage) => {
          const Icon = stageIcons[stage.id];
          const resources = getHospitalGuideResourcesForStage(stage.id);
          return (
            <section key={stage.id} id={stage.id} className="scroll-mt-24 rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8" aria-labelledby={`${stage.id}-heading`}>
              <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-10">
                <div>
                  <div className="flex items-center gap-3 text-sm font-bold text-primary"><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft"><Icon className="h-5 w-5" aria-hidden="true" /></span> Stage {stage.number}</div>
                  <h2 id={`${stage.id}-heading`} className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">{stage.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{stage.description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {resources.map((resource) => (
                    <Link
                      key={resource.id}
                      to={resource.canonicalRoute}
                      onClick={() => trackResource(stage.id, resource.id, resource.canonicalRoute)}
                      className="group flex min-h-40 flex-col rounded-2xl border border-border bg-background p-5 transition-smooth hover:border-primary/35 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">{roleLabels[resource.pageRole]}{resource.availability === "new" ? " · New" : ""}</div>
                      <h3 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">{resource.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">{resource.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </section>

      <section className="border-y border-border/70 bg-muted/25">
        <div className="container py-12 md:py-16">
          <SectionHeading
            centered
            eyebrow="Practical tools"
            title="Use a checklist when the next step matters more than another article"
            description="These tools organize fixed questions and links. They do not ask for names, diagnoses, medication uploads, claim numbers, or other protected health information."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {HOSPITAL_GUIDE_RESOURCES.filter((resource) => practicalToolIds.has(resource.id)).map((resource) => (
              <Link
                key={resource.id}
                to={resource.canonicalRoute}
                onClick={() => trackResource(resource.stageId, resource.id, resource.canonicalRoute)}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-bold leading-tight">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">{resource.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></div>
            <h2 className="mt-5 font-display text-2xl font-bold">Questions to ask before discharge</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {[
                "What has to be true before discharge, and what still needs to happen today?",
                "Which medicines are new, stopped, changed, or restarting—and when is the next dose?",
                "What symptoms or changes should prompt a call, a same-day visit, or emergency help?",
                "Which facility, agency, pharmacy, supplier, or transport company has actually accepted the referral?",
                "What has insurance approved, what could the patient owe, and what is the backup plan if coverage or availability changes?",
                "Which follow-up appointments, laboratory tests, equipment deliveries, and written notices should be in hand before leaving?",
              ].map((question) => <li key={question} className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{question}</span></li>)}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></div>
            <h2 className="mt-5 font-display text-2xl font-bold">Verify important details with official sources</h2>
            <div className="mt-5 grid gap-3">
              {HOSPITAL_GUIDE_OFFICIAL_RESOURCES.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackSiteEvent("patient_guide_official_resource_clicked", { item_id: resource.id, destination_path: resource.href })}
                  className="group rounded-2xl border border-border bg-background p-4 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="flex items-start justify-between gap-3 font-bold text-foreground">{resource.title}<ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /></span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{resource.description}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-16 md:pb-20">
        <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <HeartPulse className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-display text-2xl font-bold">Nurse-led education, not a substitute for the bedside team</h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Written by Andrew Ciccarelli, BSN, RN, using privacy-minimized bedside and discharge patterns to identify the questions families most often need. Current authoritative sources support factual claims. No physician or independent credentialed medical review is claimed for this release. Hospital policy, clinical judgment, payer rules, and patient circumstances can differ.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="soft"><Link to="/methodology"><BookOpenCheck className="h-4 w-4" /> Review the editorial method</Link></Button>
                <Button asChild variant="outline"><Link to="/patients-families">Back to all patient pathways</Link></Button>
                <Button asChild variant="outline"><Link to="/for-organizations/patient-education-systems" onClick={() => trackSiteEvent("patient_guide_institutional_demo_selected", { item_id: "hospital_patient_guide_pilot" })}>Hospital leader? Review the five-package demo <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
        </div>
        <DisclaimerBox className="mt-5" />
      </section>
    </div>
  </>
);

export default HospitalPatientGuidePage;
