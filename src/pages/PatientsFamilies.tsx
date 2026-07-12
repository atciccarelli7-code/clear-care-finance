import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { AlertTriangle, ArrowRight, ClipboardCheck, HeartPulse, Home, Pill, Receipt, Scale, Shield } from "lucide-react";

const PatientsFamilies = () => <>
  <PageHero eyebrow="For patients, families & caregivers" title="Start with the problem in front of you." description="Use a complete decision path for a confusing bill, denied care, hospital discharge, Medicare enrollment, Medicaid help, medication coverage, or long-term-care planning.">
    <Button asChild variant="hero" size="lg"><Link to="/insurance/medical-bill-review-toolkit">Review a medical bill <ArrowRight className="h-4 w-4" /></Link></Button>
    <Button asChild variant="outline" size="lg"><Link to="/medicare-care-costs/turning-65">Build a Medicare timeline</Link></Button>
  </PageHero>
  <section className="container py-16 md:py-20">
    <SectionHeading centered eyebrow="Choose the situation" title="Go directly to the decision you need to make" description="Each starting point connects explanation, a guided tool or checklist, practical actions, and official verification." />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <TopicCard icon={Receipt} title="I received a confusing medical bill" description="Identify the document, compare the claim story, check financial assistance, and track calls and deadlines." href="/insurance/medical-bill-review-toolkit" cta="Open Medical Bill Resolution Center" accent="green" />
      <TopicCard icon={AlertTriangle} title="Care is delayed or denied" description="Organize the notice, urgency, provider action, plan questions, documents, appeal checks, and official controlling source." href="/tools/prior-authorization-next-step-guide" cta="Build the next-step plan" />
      <TopicCard icon={Home} title="A hospital discharge is approaching" description="Coordinate destination, rehab, home health, equipment, medications, transportation, authorization, and backup care." href="/insurance/hospital-discharge-coverage" cta="Open Discharge Command Center" accent="green" />
      <TopicCard icon={HeartPulse} title="I am approaching age 65" description="Build a qualified timeline for enrollment, active employment, employer size, HSA, drug coverage, spouse coverage, and Medigap timing." href="/medicare-care-costs/turning-65" cta="Build Medicare timeline" />
      <TopicCard icon={Scale} title="Could Medicare or Medicaid help?" description="Screen possible Medicare, Medicaid, Medicare Savings Program, dual-eligibility, disability, and long-term-care pathways." href="/tools/medicare-medicaid-eligibility-check" cta="Check possible pathways" accent="green" />
      <TopicCard icon={Shield} title="I need to compare Medicare options" description="Compare Original Medicare, Medicare Advantage, Medigap, provider access, prescriptions, authorization, and bad-year exposure." href="/insurance/medicare-advantage" cta="Compare coverage structures" />
      <TopicCard icon={Pill} title="A medication may not be covered" description="Check the formulary, tier, pharmacy, prior authorization, quantity limit, step therapy, and estimated cost." href="/insurance/medication-coverage-checklist" cta="Open medication checklist" />
      <TopicCard icon={ClipboardCheck} title="My family may need long-term care" description="Separate skilled care from custodial care, screen Medicaid pathways, and identify when state or professional help is required." href="/articles/does-medicare-cover-long-term-care" cta="Start long-term-care planning" accent="green" />
    </div>
  </section>
</>;

export default PatientsFamilies;
