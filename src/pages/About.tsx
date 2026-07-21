import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, HandHeart, LineChart, Shield, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";
import { AUTHOR_NAME } from "@/lib/seoRegistry";

const About = () => {
  useSeo({
    title: "About Andrew Ciccarelli, RN, BSN",
    description:
      "Community Acquired Finance is written by Andrew Ciccarelli, RN, BSN, using bedside, charge, and admissions-discharge-transfer nursing experience to explain healthcare and personal-finance decisions.",
    canonicalPath: "/about",
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://communityacquiredfinance.com/about#andrew-ciccarelli",
      name: AUTHOR_NAME,
      url: "https://communityacquiredfinance.com/about",
      jobTitle: "Registered Nurse",
      worksFor: {
        "@type": "Organization",
        name: "Community Acquired Finance",
        url: "https://communityacquiredfinance.com",
      },
      knowsAbout: ["bedside nursing", "care transitions", "discharge education", "health insurance cost sharing", "healthcare worker benefits", "plain-English healthcare financial education"],
    }],
  });

  const allSources = Object.values(SOURCE_PRESETS);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Healthcare money explained by someone who sees the confusion up close."
        description="Community Acquired Finance is built by Andrew Ciccarelli, RN, BSN, for patients, caregivers, healthcare workers, and anyone who needs a calmer way to understand financial and healthcare decisions."
      >
        <Button asChild variant="hero" size="lg"><Link to="/#decision-concierge">Start with one question</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/methodology">Sources and methodology</Link></Button>
      </PageHero>

      <section className="container max-w-5xl space-y-12 py-12 md:py-16">
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="surface-trust rounded-3xl p-6 md:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-trust shadow-sm">
              <Stethoscope className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-trust">Founder</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Andrew Ciccarelli, RN, BSN</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Registered nurse with verified bedside, charge, and admissions-discharge-transfer experience. Founder and primary author of Community Acquired Finance.
            </p>
            <p className="mt-4 border-t border-trust/20 pt-4 text-xs leading-relaxed text-muted-foreground">
              No professional photograph is shown because the site does not currently include an approved founder image. CAF does not substitute a stock or synthetic person for human authority.
            </p>
          </aside>

          <article aria-labelledby="origin-heading">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why CAF exists</div>
            <h2 id="origin-heading" className="mt-2 font-display text-3xl font-bold tracking-tight">The information existed. The usable explanation often did not.</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {[
                ["What I repeatedly observed", "Patients, families, and healthcare workers were expected to understand medication access, discharge logistics, insurance rules, bills, benefits, retirement accounts, and total compensation while already under time pressure."],
                ["Why people remained confused", "Responsibility was distributed across clinicians, pharmacies, case managers, insurers, employers, suppliers, agencies, and official documents. Each party could explain one part without giving the person a coherent next action."],
                ["Why I built CAF", "I wanted a calm layer that helps people recognize the real question, prepare the right documents, ask the right person, and see what must be verified before a problem becomes urgent."],
                ["What CAF can and cannot do", "CAF can provide source-backed education, fixed-choice tools, calculations, checklists, and action plans. It cannot diagnose, make coverage or eligibility determinations, provide individualized financial or legal advice, or replace controlling documents and qualified professionals."],
              ].map(([title, body]) => (
                <section key={title} className="grid gap-2 py-5 sm:grid-cols-[0.55fr_1.45fr] sm:gap-6">
                  <h3 className="font-display text-base font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </section>
              ))}
            </div>
          </article>
        </div>

        <details className="group rounded-2xl border border-border bg-card p-5 open:border-primary/30 md:p-6">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            Read Andrew’s longer founder story
            <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-5 space-y-4 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              Early in nursing, I was hesitant, slow, and focused on completing the task directly in front of me. Becoming a charge nurse and an admissions, discharge, and transfer nurse widened that view. I began working more directly with pharmacists, physicians, and case managers and learning how medication access, insurance rules, post-hospital services, family readiness, and clinical plans collide during a real care transition.
            </p>
            <p>
              Discharge education taught me that a clinically sound plan can still fail when a medication is unaffordable, coverage is misunderstood, equipment is delayed, or a family does not know which question to ask. I kept learning alongside the people I was educating. Over time, helping someone understand the system became as important to me as explaining the immediate care task.
            </p>
            <p>
              My interest in finance came from my Nonno. He introduced me to the stock market by showing me a notebook filled with stock purchases from his early years in America after immigrating from Italy. That notebook made finance feel personal. It was not about getting rich quickly. It was about decisions, discipline, ownership, and building something stable over time.
            </p>
            <p>
              I saw a similar prevention gap among coworkers. Questions about a 403(b), employer match, insurance elections, and total compensation often surfaced only after money had already been left on the table. CAF combines those two worlds: the nursing view of where healthcare systems become confusing and the finance view of how early, understandable decisions can compound for or against a household.
            </p>
          </div>
        </details>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            [Stethoscope, "RN context where it matters", "Bedside and care-transition observations are used only when they improve practical judgment. They do not expand Andrew’s credential beyond nursing."],
            [BookOpen, "Plain English before depth", "CAF starts with the answer, tradeoff, action, or question to ask. Methodology and technical detail remain available without dominating the first screen."],
            [LineChart, "Finance without sales pressure", "No scare tactics, fake urgency, invented social proof, or claim that one product fixes every household. Advertising must remain separate from guidance."],
          ].map(([Icon, title, body]) => (
            <article key={title as string} className="border-l-2 border-primary/20 pl-5">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-bold">{title as string}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body as string}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="surface-neutral rounded-3xl p-6 md:p-8">
            <SectionHeading eyebrow="Why the name" title="Community Acquired Finance" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The name is a nod to <em>community-acquired</em> diagnoses—the kinds of things people pick up just by living their lives. Healthcare finance confusion works the same way. Nobody hands out a clean manual, but the rules still affect everyone.
              </p>
              <p>
                CAF translates paychecks, workplace benefits, insurance, retirement accounts, Medicare, Medicaid, hospital bills, discharge coverage, and the everyday decisions that build or drain financial margin.
              </p>
            </div>
          </div>

          <div className="surface-success rounded-3xl p-6 md:p-8">
            <HandHeart className="h-6 w-6 text-success" aria-hidden="true" />
            <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-success">Product standard</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">A calm second brain for stressful healthcare money decisions.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The goal is not to replace a professional, plan document, benefits office, Medicare.gov, or billing department. The goal is to help people understand enough to ask better questions, avoid obvious mistakes, and feel less lost before they act.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8" aria-labelledby="credential-boundary-heading">
          <div className="flex items-start gap-4">
            <Shield className="mt-1 h-6 w-6 shrink-0 text-caution" aria-hidden="true" />
            <div>
              <h2 id="credential-boundary-heading" className="font-display text-2xl font-bold">Credential and editorial boundary</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                My RN and BSN credentials support the bedside and healthcare-navigation perspective. They do not make me a CFP professional, attorney, tax preparer, insurance producer, Medicare representative, fiduciary, benefits administrator, physician, or pharmacist. Pages identify sources and review status; no independent professional review is implied unless a qualified reviewer is named.
              </p>
              <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
                <li className="border-l-2 border-border pl-3">Use official and reputable sources for program rules, taxes, retirement accounts, insurance, and healthcare costs.</li>
                <li className="border-l-2 border-border pl-3">Separate education from advertising, sponsorships, affiliates, and lead generation.</li>
                <li className="border-l-2 border-border pl-3">Avoid plan rankings and one-size-fits-all recommendations when the answer depends on personal facts.</li>
                <li className="border-l-2 border-border pl-3">Return users to the live source, plan, provider, employer, agency, or qualified professional when verification matters.</li>
              </ul>
            </div>
          </div>
        </section>

        <div id="sources" className="scroll-mt-24">
          <SectionHeading eyebrow="Sources" title="Where the information comes from" description="Core sources used across CAF. Individual articles and tools include more specific source notes and review dates when needed." />
          <SourceList sources={allSources} />
        </div>

        <DisclaimerBox />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg"><Link to="/#decision-concierge">Start with the Decision Concierge</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/methodology">Sources and methodology</Link></Button>
          <Button asChild variant="soft" size="lg"><Link to="/contact">Contact</Link></Button>
        </div>
      </section>
    </>
  );
};

export default About;
