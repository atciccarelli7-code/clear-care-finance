import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { AlertTriangle, ArrowRight, ClipboardCheck, HeartPulse, Home, Pill, Receipt, Scale, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PATIENT_GATEWAY_JOURNEYS } from "@/data/hospitalPatientGuide";
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
  <PageHero eyebrow="For patients, families & caregivers" title="Start with the situation in front of you." description="Understand a hospital stay, prepare for discharge, review a bill, respond to delayed care, or verify Medicare, Medicaid, medication, and long-term-care questions.">
    <Button asChild variant="hero" size="lg"><Link to="/patients-families/hospital-guide" onClick={() => trackSiteEvent("patient_guide_resource_selected", { item_id: "patient_gateway_hero", stage_id: "during_stay", destination_path: "/patients-families/hospital-guide" })}>Open Hospital &amp; Patient Guide <ArrowRight className="h-4 w-4" /></Link></Button>
    <Button asChild variant="outline" size="lg"><Link to="/insurance/medical-bill-review-toolkit">Review a medical bill</Link></Button>
  </PageHero>
  <section className="container py-16 md:py-20">
    <SectionHeading centered eyebrow="Choose the situation" title="Go directly to the decision you need to make" description="Each starting point connects explanation, a guided tool or checklist, practical actions, and official verification." />
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
      These pathways provide general education and question prompts. They do not determine diagnosis, treatment, coverage, eligibility, appeal rights, or what a patient owes.
    </div>
  </section>
</>;

export default PatientsFamilies;
