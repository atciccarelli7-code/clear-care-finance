import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { HeartPulse, Shield, Receipt, Building2, ArrowRight } from "lucide-react";

const PatientsFamilies = () => {
  return (
    <>
      <PageHero
        eyebrow="For patients, families & caregivers"
        title="Healthcare costs explained before they become a crisis."
        description="Insurance terms, Medicare, Medicaid, and hospital bills — in language a normal human can understand."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/topics/medicare-medicaid">Open the Medicare & Medicaid guide <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools#medicare">Estimate Medicare costs</Link>
        </Button>
      </PageHero>

      <section className="container py-16 md:py-20">
        <SectionHeading
          centered
          eyebrow="Topics for you"
          title="What every patient and caregiver should know"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TopicCard icon={HeartPulse} title="Medicare & Medicaid" description="Two programs, one letter apart, very different jobs." href="/topics/medicare-medicaid" cta="Open guide" accent="green" />
          <TopicCard icon={Shield} title="Health Insurance" description="Premiums, deductibles, copays, coinsurance — translated." href="/topics/health-insurance" cta="Open guide" />
          <TopicCard icon={Receipt} title="Patient Medical Costs" description="EOBs, itemized bills, and what to ask before paying." href="/topics/patient-medical-costs" cta="Open guide" accent="green" />
          <TopicCard icon={Building2} title="Hospital Economics" description="Why hospital prices are confusing — facility fees, contracts, and price lists." href="/topics/hospital-economics" cta="Open guide" />
        </div>
      </section>
    </>
  );
};

export default PatientsFamilies;
