import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Calculator, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalBillProductFoundation } from "@/components/medical-bill/MedicalBillProductFoundation";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useSeo } from "@/lib/seo";

const Newsletter = () => {
  useSeo({
    title: "Community Acquired Finance Monthly Newsletter",
    description:
      "Join Community Acquired Finance Monthly for practical updates on healthcare-worker paychecks, benefits, insurance, medical bills, calculators, and healthcare costs.",
    canonicalPath: "/newsletter",
  });

  return (
    <>
      <PageHero
        eyebrow="Monthly newsletter"
        title="Practical healthcare-money guidance, once a month."
        description="Get concise educational updates for healthcare workers, patients, caregivers, and families—without spam, sales pressure, or individualized advice."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#join-newsletter">Join the monthly list <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#medical-bill-resources">Open free medical-bill resources</a>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Mail className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Low-frequency, not noisy</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Practical notes, updated guides, and useful tools only when there is something worth reading or using.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Stethoscope className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Healthcare-specific</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Built around decisions healthcare workers, patients, and caregivers actually face: benefits, insurance, bills, and care transitions.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Educational and privacy-conscious</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No document uploads, manufactured urgency, or hidden sales funnel. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/35 py-14 md:py-16">
        <div className="container">
          <SectionHeading
            centered
            eyebrow="What you’ll get"
            title="A practical healthcare-money update"
            description="Each issue is designed to be short enough to read quickly and useful enough to save."
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              "One plain-English healthcare money topic",
              "One calculator, checklist, or decision tool",
              "One patient, caregiver, or insurance workflow",
              "One practical action to take or question to verify",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-5 shadow-sm">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MedicalBillProductFoundation />

      <section id="join-newsletter" className="container scroll-mt-24 py-12 md:py-16">
        <NewsletterSignup
          source="newsletter-page"
          title="Join Community Acquired Finance updates"
          description="Get low-frequency notes on healthcare-worker paychecks, benefits, insurance, medical bills, Medicare, Medicaid, calculators, and practical decision tools."
          buttonLabel="Join the update list"
        />
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Use the resources directly</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Every core guide and calculator is available without joining the email list.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">
                Browse the site whenever you need a paycheck calculator, benefits checklist, medical-bill workflow, Medicare explanation, or patient-care guide.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/tools"><Calculator className="h-4 w-4" /> Browse tools</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
