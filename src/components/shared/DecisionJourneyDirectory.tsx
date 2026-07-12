import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const journeys = [
  {
    eyebrow: "Healthcare career",
    title: "Compare a role and control the transition",
    description: "Connect total compensation, benefits, schedule, call, career trajectory, negotiation questions, and actions before resigning.",
    href: "/healthcare-workers/career-decisions",
  },
  {
    eyebrow: "Medicare plan decision",
    title: "Review what Medicare Advantage marketing may not emphasize",
    description: "Check networks, authorization, post-acute providers, drug coverage, travel, and maximum out-of-pocket exposure before relying on extra benefits.",
    href: "/insurance/what-medicare-advantage-marketing-may-not-emphasize",
  },
  {
    eyebrow: "Medical bill",
    title: "Resolve a confusing medical bill",
    description: "Identify the document, compare the claim story, check assistance and appeal routes, and track calls and deadlines.",
    href: "/insurance/medical-bill-review-toolkit",
  },
  {
    eyebrow: "Turning 65",
    title: "Build a Medicare enrollment timeline",
    description: "Organize active employment, employer size, HSA, drug coverage, spouse coverage, and official enrollment actions.",
    href: "/medicare-care-costs/turning-65",
  },
] as const;

export const DecisionJourneyDirectory = () => (
  <section className="container py-12 md:py-16" aria-labelledby="decision-journey-directory-title">
    <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card md:p-8">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Complete decision pathways</div>
        <h2 id="decision-journey-directory-title" className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">Continue with the situation that matches your problem</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">These routes connect explanation, personalized support, a concrete action plan, and official verification rather than leaving the visitor at an isolated article.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {journeys.map((journey) => (
          <Link key={journey.href} to={journey.href} className="group rounded-2xl border border-border bg-background/70 p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary">{journey.eyebrow}</div>
            <h3 className="mt-2 font-display text-lg font-bold">{journey.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{journey.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Open pathway <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
