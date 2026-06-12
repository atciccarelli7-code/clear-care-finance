import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/shared/TopicCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { HeartPulse, Shield, FileText, Receipt, Home, ArrowRight } from "lucide-react";

const PatientsFamilies = () => {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container py-20 md:py-28 text-center max-w-3xl mx-auto space-y-5 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-secondary shadow-card">
            For patients, families & caregivers
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Healthcare costs explained before they become a crisis.
          </h1>
          <p className="text-lg text-muted-foreground">
            Insurance terms, Medicare, Medicaid, and hospital bills — in language a normal human can understand.
          </p>
          <div className="pt-2">
            <Button asChild variant="accent" size="lg">
              <Link to="/tools">Try the Medicare Cost Estimator <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <SectionHeading
          centered
          eyebrow="Topics"
          title="What every patient and caregiver should know"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: HeartPulse, title: "Medicare basics", description: "Parts A, B, C, and D — what each one actually covers and when to sign up.", accent: "green" as const },
            { icon: Shield, title: "Medicaid basics", description: "Who qualifies, how it differs from Medicare, and what it pays for.", accent: "green" as const },
            { icon: FileText, title: "Insurance terms", description: "Deductibles, copays, coinsurance, networks — translated into normal English." },
            { icon: Receipt, title: "Hospital bills", description: "Why bills are confusing, what an EOB really means, and what to ask before paying." },
            { icon: Home, title: "Long-term care planning reminders", description: "The conversations and paperwork that are easier to handle before they're urgent.", accent: "green" as const },
            { icon: ArrowRight, title: "Estimate Medicare costs", description: "A simple calculator for premiums, deductibles, and coinsurance.", href: "/tools" },
          ].map((t) => (
            <TopicCard key={t.title} {...t} href={t.href} cta={t.href ? "Open calculator" : undefined} />
          ))}
        </div>
      </section>
    </>
  );
};

export default PatientsFamilies;
