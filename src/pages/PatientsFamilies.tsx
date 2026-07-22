import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, HeartPulse, Home, Pill, Receipt, Scale, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PATIENT_GATEWAY_JOURNEYS } from "@/data/hospitalPatientGuide";
import { DIAGNOSIS_EXPLAINED_ROUTE } from "@/data/diagnosisGuideFramework";
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
    <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/75 via-card to-card shadow-card">
      <div className="grid gap-6 p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm" aria-hidden="true">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">New patient-education foundation</div>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Diagnosis, Explained</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Bring a diagnosis you already received. These future guides will explain what it means, what it does not automatically mean, possible contributing causes, common evaluation, treatment goals, medication purpose, warning signs, and questions for your care team—without attempting to diagnose you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">No symptom checker</span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">No personal health data</span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Clinical review required</span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">Heart failure pilot in development</span>
          </div>
        </div>
        <Button asChild variant="accent" size="lg" className="w-full md:w-auto">
          <Link
            to={DIAGNOSIS_EXPLAINED_ROUTE}
            onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: "diagnosis_explained_foundation", stage_id: "understand_diagnosis", destination_path: DIAGNOSIS_EXPLAINED_ROUTE })}
          >
            Preview the guide system <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>

  <section className="container py-16 md:py-20">
    <SectionHeading centered eyebrow="Choose the situation" title="Go directly to the decision you need to make" description="Each starting point connects privacy-minimized bedside insight, plain-English explanation, a guided tool or checklist, practical actions, and official verification." />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PATIENT_GATEWAY_JOURNEYS.map((journey, index) => (
        <TopicCard
          key={journey.id}
          icon={journeyIcons[journey.id]}
          title={journey.title}
          description={journey.description}
          href={journey.href}
          cta={journey.cta}
          accent={index % 2 === 0 ? "green" : undefined}
        />
      ))}
    </div>
    <div className="mt-8 rounded-2xl border border-border bg-muted/25 p-5 text-sm leading-relaxed text-muted-foreground">
      <Shield className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
      Andrew Ciccarelli, RN, BSN contributes bedside and discharge perspective; authoritative sources support factual claims. These pathways provide general education and question prompts. They do not determine diagnosis, treatment, coverage, eligibility, appeal rights, or what a patient owes.
    </div>
  </section>
</>;

export default PatientsFamilies;
