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
      description="Plain-English guidance for understanding your hospital stay, medications, discharge plan, insurance coverage, and medical bills."
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
            description="These new guides explain common hospital practice without making a patient-specific treatment recommendation."
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
                Written by Andrew Ciccarelli, BSN, RN, using bedside questions as topic inputs and current authoritative sources for factual claims. No physician or independent credentialed medical review is claimed for this release. Hospital policy, clinical judgment, payer rules, and patient circumstances can differ.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="soft"><Link to="/methodology"><BookOpenCheck className="h-4 w-4" /> Review the editorial method</Link></Button>
                <Button asChild variant="outline"><Link to="/patients-families">Back to all patient pathways</Link></Button>
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
