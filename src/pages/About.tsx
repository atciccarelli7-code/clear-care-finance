import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, BookOpen, Users } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const About = () => {
  return (
    <>
      <PageHero
        eyebrow="About / Sources"
        title="Helping people understand the money side of healthcare."
        description="Community Acquired Finance is written from the perspective of a bedside healthcare professional who got tired of watching patients, families, and coworkers feel blindsided by the financial side of care."
      />

      <section className="container py-16 max-w-3xl">
        <div className="prose prose-invert max-w-none space-y-6 text-foreground leading-relaxed">
          <p className="text-lg">
            The name is a nod to <em>community-acquired</em> diagnoses — the kinds of things people pick up
            just by living their lives. Financial confusion in healthcare works the same way: nobody hands
            out a manual, and the rules quietly affect everyone.
          </p>
          <p className="text-muted-foreground">This site is for healthcare workers, patients, families, and caregivers. It translates pay, benefits, retirement accounts, insurance, Medicare, Medicaid, hospital bills, and healthcare financial systems into plain English.</p>
          <p className="text-muted-foreground">We use official government sources first, then reputable nonprofit and research sources when they add useful context. Nothing here provides individualized advice, pushes a product, or uses fear to force a decision.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mt-12">
          {[
            { icon: Heart, t: "Credible", d: "Grounded in government and reputable sources." },
            { icon: BookOpen, t: "Educational", d: "Built to teach — not to sell." },
            { icon: Users, t: "Humble", d: "Written from the bedside, not a sales office." },
            { icon: Shield, t: "Safe", d: "No popups, no spam, no personalized advice." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-border bg-card p-6 shadow-card flex gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-bold mb-1">{i.t}</div>
                <p className="text-sm text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div id="sources" className="mt-16 scroll-mt-24">
          <SectionHeading eyebrow="Sources" title="Official sources first" description="Each article links to its supporting sources. The full source directory explains what we prioritize and why." />
          <Button asChild variant="soft"><Link to="/sources">Browse source directory</Link></Button>
        </div>

        <div className="mt-12">
          <DisclaimerBox />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/tools">Open a calculator</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/articles">Read articles</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
