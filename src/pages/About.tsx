import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, BookOpen, Users, Stethoscope, LineChart, HandHeart, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";

const About = () => {
  useSeo({
    title: "About Andrew Ciccarelli, RN, BSN",
    description:
      "Community Acquired Finance is written by Andrew Ciccarelli, RN, BSN, a bedside nurse building plain-English healthcare finance education for workers, patients, families, and caregivers.",
    canonicalPath: "/about",
  });

  const allSources = Object.values(SOURCE_PRESETS);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Healthcare money explained by someone who sees the confusion up close."
        description="Community Acquired Finance is built by Andrew Ciccarelli, RN, BSN, to help healthcare workers, patients, families, and caregivers understand the financial side of healthcare without sales pressure or jargon."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/insurance">Explore insurance tools</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/methodology">Sources and methodology</Link>
        </Button>
      </PageHero>

      <section className="container max-w-5xl space-y-12 py-12 md:py-16">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="rounded-3xl border border-primary/15 bg-primary-soft/35 p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Founder note</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Andrew Ciccarelli, RN, BSN</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Bedside nurse. Finance nerd. Building a practical education site for the money questions healthcare creates.
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg text-foreground">
                My name is <strong>Andrew Ciccarelli, RN, BSN</strong>. I am a bedside nurse, and I built Community Acquired Finance because healthcare creates financial decisions that most people are expected to understand with almost no clear explanation.
              </p>
              <p>
                I have watched patients and families try to make sense of bills, deductibles, discharge plans, insurance rules, Medicare, Medicaid, medication coverage, and what care might actually cost. I have also watched healthcare workers try to decode paychecks, overtime, retirement plans, taxes, benefits, student loans, and insurance decisions while working stressful jobs.
              </p>
              <p>
                That gap bothered me. The financial side of healthcare is not a side issue. It affects whether people feel safe going home, whether a family understands a bill, whether a worker chooses the right benefits, and whether someone can build long-term stability while caring for other people.
              </p>
              <p>
                My interest in finance came from my Nonno. He introduced me to the stock market by showing me a notebook filled with stock purchases from his early years in America after immigrating from Italy. That notebook made finance feel personal to me. It was not about getting rich quickly. It was about decisions, discipline, ownership, and building something stable over time.
              </p>
              <p>
                This site combines those two worlds: the bedside view of how confusing healthcare can be, and the finance view of how much small decisions can compound for or against a household.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Heart,
              t: "Written from the bedside",
              d: "Built by a nurse who sees how financial confusion hits workers, patients, and families in real life.",
            },
            {
              icon: BookOpen,
              t: "Plain-English first",
              d: "Articles and tools use definitions, examples, checklists, calculators, and simple tradeoffs before technical detail.",
            },
            {
              icon: LineChart,
              t: "Finance without sales pressure",
              d: "No scare tactics, no pretending one product fixes everything, and no hiding the useful part behind a lead form.",
            },
            {
              icon: Shield,
              t: "Clear boundaries",
              d: "General education only — not personal medical, financial, tax, legal, insurance, or enrollment advice.",
            },
            {
              icon: Users,
              t: "Built for real households",
              d: "Healthcare workers, spouses, adult children, caregivers, patients, and anyone trying to decode a bill or benefit.",
            },
            {
              icon: ClipboardCheck,
              t: "Source-backed",
              d: "Government, official program, plan-rule, and reputable research sources are used whenever possible.",
            },
          ].map((i) => (
            <div key={i.t} className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="mb-1 font-display font-bold">{i.t}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-primary/20 bg-primary-soft/30 p-6 md:p-8">
            <SectionHeading eyebrow="Why the name" title="Community Acquired Finance" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The name is a nod to <em>community-acquired</em> diagnoses — the kinds of things people pick up just by living their lives. Healthcare finance confusion works the same way. Nobody hands out a clean manual, but the rules still affect everyone.
              </p>
              <p>
                This site exists to translate the confusing parts: paychecks, workplace benefits, insurance, retirement accounts, Medicare, Medicaid, hospital bills, discharge coverage, and the everyday money decisions that build or drain financial margin.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <HandHeart className="h-5 w-5" />
            </div>
            <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">What I want this site to feel like</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">A calm second brain for stressful healthcare money decisions.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The goal is not to replace a professional, a plan document, a benefits office, Medicare.gov, or a billing department. The goal is to help people understand enough to ask better questions, avoid obvious mistakes, and feel less lost before they make a decision.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <SectionHeading eyebrow="Trust standards" title="How I try to keep this useful" />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Use official and reputable sources when explaining program rules, taxes, retirement accounts, insurance, and healthcare costs.",
              "Separate education from advertising, sponsorships, or monetization if those are added later.",
              "Avoid plan rankings, product recommendations, or one-size-fits-all advice when the right answer depends on personal details.",
              "Push users back to live plan documents, provider directories, formularies, billing offices, benefits teams, Medicare.gov, Medicaid agencies, or licensed professionals when verification matters.",
            ].map((standard) => (
              <div key={standard} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{standard}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="sources" className="scroll-mt-24">
          <SectionHeading eyebrow="Sources" title="Where the information comes from" description="Core sources used across the site. Individual articles include more specific source notes when needed." />
          <SourceList sources={allSources} />
        </div>

        <DisclaimerBox />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <Link to="/insurance/health-insurance-plan-types">Health insurance plan types</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/methodology">Sources and methodology</Link>
          </Button>
          <Button asChild variant="soft" size="lg">
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
