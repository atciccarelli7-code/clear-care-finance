import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Calculator, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useSeo } from "@/lib/seo";

const Newsletter = () => {
  useSeo({
    title: "Community Acquired Finance Monthly Newsletter",
    description:
      "Join Community Acquired Finance Monthly for one practical email about healthcare-worker paychecks, benefits, insurance, debt, calculators, and healthcare costs.",
    canonicalPath: "/newsletter",
  });

  return (
    <>
      <PageHero
        eyebrow="Monthly newsletter"
        title="One useful healthcare-money email each month."
        description="Community Acquired Finance Monthly helps healthcare workers and patients make better decisions about paychecks, benefits, insurance, debt, and healthcare costs — without spam or sales pressure."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#join-newsletter">Join the monthly list <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/healthcare-workers">Start with the hub</Link>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Mail className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Monthly, not noisy</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The first issue is planned for August 1. The goal is one practical email, not another inbox problem.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Stethoscope className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Healthcare-specific</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Built around the financial decisions healthcare workers and patients actually face: benefits, insurance, bills, and workplace plans.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Education only</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No individualized advice, no scare tactics, no popups. Just clear explanations and links back to tools you can use.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/35 py-14 md:py-16">
        <div className="container">
          <SectionHeading
            centered
            eyebrow="What you’ll get"
            title="A simple monthly money map"
            description="Each issue should be short enough to read quickly and useful enough to save."
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              "One plain-English healthcare money topic",
              "One calculator or checklist to try",
              "One patient or insurance insight",
              "One practical action step for the month",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-5 shadow-sm">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join-newsletter" className="container scroll-mt-24 py-12 md:py-16">
        <NewsletterSignup
          source="newsletter-page"
          title="Join Community Acquired Finance Monthly"
          description="Get the August 1 issue and future monthly notes on healthcare-worker paychecks, benefits, insurance, debt, calculators, and healthcare costs."
          buttonLabel="Join the August 1 list"
        />
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Before the first issue</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Use the tools now, get the monthly guide later.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">
                The newsletter points back to practical calculators and guides. Start with the current tool library while the August 1 issue is being prepared.
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
