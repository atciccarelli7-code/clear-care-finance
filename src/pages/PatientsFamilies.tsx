import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, HeartPulse, Home, Pill, Receipt, Scale, Shield, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PATIENT_GATEWAY_JOURNEYS } from "@/data/hospitalPatientGuide";
import { DIAGNOSIS_EXPLAINED_ROUTE } from "@/data/diagnosisGuideFramework";
import { HEART_FAILURE_GUIDE_ROUTE } from "@/data/heartFailureGuide";
import { COPD_GUIDE_ROUTE } from "@/data/copdGuide";
import { ADDITIONAL_DIAGNOSIS_GUIDES } from "@/data/conditionGuideCatalog";
import { trackSiteEvent } from "@/lib/analytics";

const journeyIcons: Record<(typeof PATIENT_GATEWAY_JOURNEYS)[number]["id"], LucideIcon> = {
  understand_hospital_stay: HeartPulse,
  prepare_discharge: Home,
  review_medical_bill: Receipt,
  respond_denied_care: AlertTriangle,
  understand_medicare_medicaid: Scale,
  check_medication_coverage: Pill,
  plan_long_term_care: ClipboardCheck,
};

const PatientsFamilies = () => <>
  <PageHero eyebrow="For patients, families & caregivers" title="Start with the situation in front of you." description="RN-led, source-checked pathways for understanding a diagnosis or hospital stay, preparing for discharge, reviewing a bill, responding to delayed care, and verifying Medicare, Medicaid, medication, and long-term-care questions.">
    <Button asChild variant="hero" size="lg"><Link to="/patients-families/hospital-guide" onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: "patient_gateway_hero", stage_id: "during_stay", destination_path: "/patients-families/hospital-guide" })}>Open Hospital &amp; Patient Guide <ArrowRight className="h-4 w-4" /></Link></Button>
    <Button asChild variant="outline" size="lg"><Link to="/insurance/medical-bill-review-toolkit" onClick={() => trackSiteEvent("supporting_article_to_hub_click", { event_category: "medical_bill", source_path: "/patients-families", destination_path: "/insurance/medical-bill-review-toolkit" })}>Open Medical Bill Response System</Link></Button>
  </PageHero>

  <section className="container pt-10 md:pt-14">
    <SectionHeading centered eyebrow="Diagnosis, Explained" title="Bring the diagnosis. Leave with a clearer mental model." description="Nine complete source-checked previews are available while independent clinical review remains pending. They do not diagnose symptoms, collect health details, or direct medication changes." />
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/75 via-card to-card p-6 shadow-card md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground" aria-hidden="true"><HeartPulse className="h-6 w-6" /></div>
        <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Complete preview</div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Heart Failure, Explained</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">Understand what heart failure means, phenotype, stage, functional class, possible causes, tests, treatment goals, medication jobs, home monitoring, warning signs, and care-team questions.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground"><span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Purpose-first medicines</span><span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Three-level action plan</span><span className="rounded-full border border-warning/30 bg-warning-soft/60 px-3 py-1.5">Clinical review pending</span></div>
        <Button asChild variant="accent" size="lg" className="mt-6 w-full sm:w-auto"><Link to={HEART_FAILURE_GUIDE_ROUTE} onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: "heart_failure_guide_preview", stage_id: "understand_diagnosis", destination_path: HEART_FAILURE_GUIDE_ROUTE })}>Open heart-failure preview <ArrowRight className="h-4 w-4" /></Link></Button>
      </article>

      <article className="overflow-hidden rounded-3xl border border-secondary/20 bg-gradient-to-br from-secondary-soft/65 via-card to-card p-6 shadow-card md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground" aria-hidden="true"><Wind className="h-6 w-6" /></div>
        <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-secondary">Complete preview</div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">COPD, Explained</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">Understand spirometry, common lung-disease patterns, rescue versus maintenance inhalers, device technique, pulmonary rehabilitation, oxygen, flare-up planning, warning signs, and care-team questions.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground"><span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Inhaler technique</span><span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Oxygen safety</span><span className="rounded-full border border-warning/30 bg-warning-soft/60 px-3 py-1.5">Clinical review pending</span></div>
        <Button asChild variant="accent" size="lg" className="mt-6 w-full sm:w-auto"><Link to={COPD_GUIDE_ROUTE} onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: "copd_guide_preview", stage_id: "understand_diagnosis", destination_path: COPD_GUIDE_ROUTE })}>Open COPD preview <ArrowRight className="h-4 w-4" /></Link></Button>
      </article>
    </div>

    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ADDITIONAL_DIAGNOSIS_GUIDES.map((guide) => (
        <article key={guide.slug} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary" aria-hidden="true"><BookOpen className="h-5 w-5" /></div>
          <div className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">Clinical-review preview</div>
          <h2 className="mt-2 font-display text-xl font-bold">{guide.shortTitle}</h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.scope}</p>
          <Button asChild variant="outline" className="mt-5 w-full justify-between"><Link to={guide.route} onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: `${guide.slug}_guide_preview`, stage_id: "understand_diagnosis", destination_path: guide.route })}>Open preview <ArrowRight className="h-4 w-4" /></Link></Button>
        </article>
      ))}
    </div>

    <div className="mt-5 flex justify-center"><Button asChild variant="ghost" size="sm"><Link to={DIAGNOSIS_EXPLAINED_ROUTE}><BookOpen className="h-4 w-4" /> View guide standards</Link></Button></div>
  </section>

  <section className="container py-16 md:py-20">
    <SectionHeading centered eyebrow="Choose the situation" title="Go directly to the decision you need to make" description="Each starting point connects privacy-minimized bedside insight, plain-English explanation, a guided tool or checklist, practical actions, and official verification." />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PATIENT_GATEWAY_JOURNEYS.map((journey, index) => (
        <TopicCard key={journey.id} icon={journeyIcons[journey.id]} title={journey.title} description={journey.description} href={journey.href} cta={journey.cta} accent={index % 2 === 0 ? "green" : undefined} />
      ))}
    </div>
    <div className="mt-8 rounded-2xl border border-border bg-muted/25 p-5 text-sm leading-relaxed text-muted-foreground">
      <Shield className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
      Andrew Ciccarelli, RN, BSN contributes bedside and discharge perspective; authoritative sources support factual claims. These pathways provide general education and question prompts. They do not determine diagnosis, treatment, coverage, eligibility, appeal rights, or what a patient owes.
    </div>
  </section>
</>;

export default PatientsFamilies;
