import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, BookOpen, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useSeo } from "@/lib/seo";

const Newsletter = () => {
  useSeo({
    title: "Community Acquired Finance Newsletter",
    description:
      "One healthcare-system explanation each month from Andrew Ciccarelli, RN, BSN: hospital money, insurance rules, and care transitions, with primary sources.",
    canonicalPath: "/newsletter",
  });

  return (
    <>
      <PageHero
        eyebrow="Monthly newsletter"
        title="Understand the machinery behind healthcare, once a month."
        description="One strong healthcare-system explanation each month from Andrew Ciccarelli, RN, BSN—with sources, practical context, and a useful next read."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#join-newsletter">Join the monthly list <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#example-articles">Read a few examples</a>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Mail className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Low-frequency, not noisy</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Roughly one thoughtful explanation a month about how American healthcare works, with a related article to keep reading.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Stethoscope className="mb-4 h-7 w-7 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Written by Andrew</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Andrew Ciccarelli, RN, BSN connects nursing and care-transition experience to the money, incentives, and rules behind care. <Link className="text-primary underline" to="/about">Meet the author</Link>.
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
            title="One useful explanation of how healthcare works"
            description="Each issue is designed to be short enough to read quickly and useful enough to save."
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              "A founder-led explanation of a healthcare-system question",
              "Primary sources behind the explanation",
              "A related article that follows the next system mechanism",
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

      <section id="example-articles" className="container scroll-mt-24 py-12 md:py-16">
        <NextStepCards
          eyebrow="A few examples"
          title="The questions CAF follows"
          description="Start with Andrew’s hospital-system explanations. Founder observations shape the questions; primary sources support the factual claims."
          columns="two"
          cards={[
            { title: "The $20 Tylenol Isn’t Really About the Tylenol", description: "Why a hospital line-item charge is different from cost, payment, and the patient’s responsibility.", href: "/articles/20-dollar-tylenol-hospital-prices", cta: "Read the article" },
            { title: "Why Hospitals Care So Much About Length of Stay", description: "How payment, staffed beds, discharge barriers, and patient safety connect.", href: "/articles/why-hospitals-care-about-length-of-stay", cta: "Read the article" },
            { title: "What a Nonprofit Hospital Actually Is (and Isn’t)", description: "What tax status explains—and what it does not explain—about hospital money.", href: "/articles/what-nonprofit-hospital-actually-means", cta: "Read the article" },
            { title: "“Home With Family” Is Not a Free Care Plan", description: "The work, coordination, and risk that can move from a hospital to a household.", href: "/articles/home-with-family-is-not-a-free-care-plan", cta: "Read the article" },
          ]}
        />
      </section>

      <section id="join-newsletter" className="container scroll-mt-24 py-12 md:py-16">
        <NewsletterSignup
          source="newsletter-page"
          title="Get the next explanation in your inbox"
          description="Join Andrew’s monthly CAF newsletter about hospital money, insurance rules, and care transitions—with sources and a useful next read."
          buttonLabel="Join the monthly list"
        />
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Keep reading</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Read the publication at your own pace.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">
                Every article is available without joining the email list. Explore hospital economics, insurance, and the work behind care transitions.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/articles"><BookOpen className="h-4 w-4" /> Browse articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
