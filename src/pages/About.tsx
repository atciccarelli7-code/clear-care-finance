import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, BookOpen, Users, Stethoscope, LineChart } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";

const About = () => {
  useSeo({
    title: "About Andrew Ciccarelli, RN, BSN",
    description: "Community Acquired Finance is written by Andrew Ciccarelli, RN, BSN, a bedside nurse with a passion for plain-English healthcare finance education.",
    canonicalPath: "/about",
  });

  const allSources = Object.values(SOURCE_PRESETS);
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Healthcare money explained from the bedside."
        description="Community Acquired Finance helps healthcare workers, patients, families, and caregivers understand benefits, insurance, hospital bills, Medicare, Medicaid, retirement, and paychecks in plain English."
      />

      <section className="container py-12 md:py-16 max-w-4xl space-y-12">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg text-foreground">
                My name is <strong>Andrew Ciccarelli, RN, BSN</strong>. I am a bedside nurse with a real passion for finance.
              </p>
              <p>
                Nursing and service have always been close to home for me. My sister and my aunt are nurses, both of my parents worked as teachers, and my dad later became a principal. I grew up around people who spent their careers helping others through complicated, stressful, and important moments.
              </p>
              <p>
                My interest in finance came from my Nonno. He introduced me to the stock market by showing me a notebook filled with stock purchases from his early years in America after immigrating from Italy. That notebook made money feel less abstract to me. It showed me that personal finance is not just numbers on a screen. It is decisions, discipline, and a way to build stability over time.
              </p>
              <p>
                As a nurse, I have seen how confusing the money side of healthcare can be for workers, patients, families, and caregivers. Healthcare workers are trying to understand paychecks, benefits, overtime, retirement accounts, taxes, and insurance. Patients and families are trying to understand hospital bills, coverage rules, deductibles, Medicare, Medicaid, and what care may actually cost.
              </p>
              <p>
                Community Acquired Finance is my attempt to make those decisions easier to understand. The goal is not to sound like a hospital policy manual, a brokerage brochure, or an insurance packet. The goal is to explain healthcare money in plain English so real people can ask better questions before money leaves their paycheck, bank account, retirement plan, or household.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { icon: Heart, t: "Written from the bedside", d: "Built by a nurse who has seen how financial confusion hits workers, patients, and families." },
            { icon: BookOpen, t: "Plain-English first", d: "Articles use definitions, fact sheets, examples, common mistakes, and calculators." },
            { icon: LineChart, t: "Finance without sales pressure", d: "No scare tactics, no product pushing, no pretending one answer fits everyone." },
            { icon: Shield, t: "Educational boundaries", d: "General education only — not personal medical, financial, tax, legal, or insurance advice." },
            { icon: Users, t: "Built for real people", d: "Healthcare workers, patients, spouses, adult children, caregivers, and anyone trying to decode a bill or benefit." },
            { icon: Shield, t: "Source-backed", d: "Uses government, official program, plan-rule, and reputable research sources whenever possible." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-border bg-card p-6 shadow-card flex gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-bold mb-1">{i.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{i.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-primary/20 bg-primary-soft/30 p-6 md:p-8">
          <SectionHeading eyebrow="Why the name" title="Community Acquired Finance" />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The name is a nod to <em>community-acquired</em> diagnoses — the kinds of things people pick up just by living their lives. Healthcare finance confusion works the same way. Nobody hands out a clean manual, but the rules still affect everyone.
            </p>
            <p>
              This site exists to translate the confusing parts: paychecks, workplace benefits, insurance, retirement accounts, Medicare, Medicaid, hospital bills, discharge coverage, and the everyday spending decisions that build or drain financial margin.
            </p>
          </div>
        </div>

        <div id="sources" className="scroll-mt-24">
          <SectionHeading eyebrow="Sources" title="Where the information comes from" description="Core sources used across the site. Individual articles include more specific source notes when needed." />
          <SourceList sources={allSources} />
        </div>

        <DisclaimerBox />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/open-enrollment">Open enrollment guide</Link>
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
