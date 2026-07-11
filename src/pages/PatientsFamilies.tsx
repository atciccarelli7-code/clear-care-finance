import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { HeartPulse, Shield, Receipt, Building2, ArrowRight, ClipboardCheck } from "lucide-react";

const PatientsFamilies = () => {
  return (
    <>
      <PageHero
        eyebrow="For patients, families & caregivers"
        title="Healthcare costs explained before they become a crisis."
        description="Insurance terms, medical bills, Medicare, Medicaid, and hospital costs — in language a normal human can understand."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/insurance/medical-bill-review-toolkit">Review a medical bill <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/topics/medicare-medicaid">Open the Medicare & Medicaid guide</Link>
        </Button>
      </PageHero>

      <section className="container py-16 md:py-20">
        <SectionHeading
          centered
          eyebrow="Topics for you"
          title="Start with the decision in front of you"
          description="Use the bill hub for a confusing balance, the review flow when you are not sure what to do next, or the Medicare and insurance guides for coverage questions."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TopicCard icon={Receipt} title="Medical Bill Review Toolkit" description="Identify the document, compare the claim story, check assistance, and track calls and deadlines before treating the first balance as final." href="/insurance/medical-bill-review-toolkit" cta="Review a medical bill" accent="green" />
          <TopicCard icon={ClipboardCheck} title="Medical Bill Review Flow" description="Answer plain-English questions and get a checklist for documents, billing calls, payer questions, and financial assistance." href="/tools/medical-bill-review-flow" cta="Build the next-step plan" />
          <TopicCard icon={HeartPulse} title="Medicare & Medicaid" description="Two programs, one letter apart, very different jobs." href="/topics/medicare-medicaid" cta="Open guide" accent="green" />
          <TopicCard icon={Shield} title="What Medicare Advantage marketing may not emphasize" description="Review networks, prior authorization, post-acute care, drug coverage, and out-of-pocket exposure before relying on extra-benefit advertising." href="/insurance/what-medicare-advantage-marketing-may-not-emphasize" cta="Read the reality check" />
          <TopicCard icon={Shield} title="Health Insurance" description="Premiums, deductibles, copays, coinsurance — translated." href="/topics/health-insurance" cta="Open guide" />
          <TopicCard icon={Receipt} title="Patient Medical Costs" description="EOBs, itemized bills, hospital charges, and the questions to ask before paying." href="/topics/patient-medical-costs" cta="Browse the topic" accent="green" />
          <TopicCard icon={Building2} title="Hospital Economics" description="Why hospital prices are confusing — facility fees, contracts, and price lists." href="/topics/hospital-economics" cta="Open guide" />
        </div>
      </section>
    </>
  );
};

export default PatientsFamilies;
