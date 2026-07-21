import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Compass, ExternalLink, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DecisionConcierge } from "@/components/growth/DecisionConcierge";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackHomepageNavigation } from "@/lib/analytics";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const browsePaths = [
  ["Money & retirement", "/build-wealth", "Saving, debt, investing, workplace accounts, and financial independence."],
  ["Benefits & insurance", "/insurance", "Health plans, workplace benefits, prior authorization, and medical costs."],
  ["Hospital & patient help", "/patients-families/hospital-guide", "RN-led preparation for discharge, caregiving, medicines, equipment, and coverage barriers."],
  ["Medicare & Medicaid", "/medicare-care-costs", "Program basics, enrollment preparation, costs, and official verification."],
] as const;

const Index = () => (
  <>
    <PageHero
      eyebrow="Plain-English financial decision support"
      title="Make the next money or healthcare decision clearer."
      description="Start with one short routing question. CAF will keep your goal visible, take you to the experience responsible for the answer, and show the first real-world action before optional reading."
    >
      <Button asChild variant="hero" size="lg">
        <a
          href="#decision-concierge"
          onClick={() => {
            trackGrowthEvent("home_primary_cta_clicked", { entry_surface: "home", action_id: "decision_concierge" });
            trackHomepageNavigation("hero_action", "decision_concierge");
          }}
        >
          Help me choose where to start <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="ghost" size="lg">
        <a
          href="#browse-by-topic"
          onClick={() => {
            trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "browse_topics" });
            trackHomepageNavigation("hero_action", "browse_topics");
          }}
        >
          I prefer to browse
        </a>
      </Button>
    </PageHero>

    <section id="decision-concierge" className="container min-w-0 scroll-mt-24 py-10 md:py-14">
      <DecisionConcierge entrySurface="home" compact />
    </section>

    <section className="border-y border-border bg-card/25 py-12 md:py-16" aria-labelledby="how-caf-works-heading">
      <div className="container max-w-5xl min-w-0">
        <SectionHeading
          centered
          eyebrow="One question to one action"
          title="Know what the experience will do before you begin."
          description="CAF separates routing, the guided answer, and official verification so each screen has one clear job."
        />
        <ol className="mt-9 grid gap-8 md:grid-cols-3">
          {[
            [Compass, "1", "Name the question", "Choose from fixed, plain-English options. No account or private case narrative is required."],
            [CheckCircle2, "2", "Finish the guided answer", "The destination keeps your original goal visible and produces a result or action plan—not another catalog."],
            [ExternalLink, "3", "Verify and act", "See the first practical action and the official source, document, office, or professional that controls the final decision."],
          ].map(([Icon, number, title, description]) => (
            <li key={number as string} className="relative border-l-2 border-primary/20 pl-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {number as string}
                </span>
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{title as string}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description as string}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section id="browse-by-topic" className="container min-w-0 scroll-mt-24 py-14 md:py-18" aria-labelledby="browse-heading">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Prefer to browse?</div>
          <h2 id="browse-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">Open the part of CAF that matches your job.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The full education library remains available without requiring the Concierge. These links are intentionally quieter than the guided start.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/tools">Browse all calculators and guides</Link>
          </Button>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {browsePaths.map(([title, href, description]) => (
            <Link
              key={href}
              to={href}
              className="group grid min-h-20 gap-1 py-4 pr-2 transition hover:bg-muted/20 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_auto] sm:items-center sm:gap-5 sm:pl-3"
              onClick={() => trackHomepageNavigation("browse_path", title, href)}
            >
              <span className="font-display text-base font-bold text-foreground">{title}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
              <ArrowRight className="hidden h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-background/55 py-10" aria-labelledby="human-trust-heading">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trust-soft text-trust">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="human-trust-heading" className="font-display text-xl font-bold">Built from nursing experience, checked against controlling sources.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Andrew Ciccarelli, RN, BSN built CAF after repeatedly seeing patients, caregivers, and healthcare workers expected to make consequential financial and care-transition decisions without a usable explanation. CAF prepares questions and actions; official documents, agencies, plans, providers, employers, and qualified professionals still control.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4 text-sm font-semibold">
            <Link to="/about" className="text-primary underline-offset-4 hover:underline">About Andrew</Link>
            <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Sources</Link>
            <Link to="/privacy-policy" className="text-primary underline-offset-4 hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-20">
      <NewsletterSignup
        source="home"
        title="Get one clear financial email each month"
        description="A calm monthly note on workplace benefits, healthcare costs, retirement, insurance, Medicare, Medicaid, and useful new tools."
        buttonLabel="Join the monthly list"
      />
    </section>
  </>
);

export default Index;
