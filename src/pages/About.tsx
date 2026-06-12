import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, BookOpen, Users } from "lucide-react";

const About = () => {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container py-20 md:py-28 max-w-3xl mx-auto text-center space-y-5 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-card">
            About
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Helping people understand the money side of healthcare.
          </h1>
          <p className="text-lg text-muted-foreground">
            Community Acquired Finance is written from the perspective of a bedside healthcare professional
            who got tired of watching patients, families, and coworkers feel blindsided by the financial side
            of care.
          </p>
        </div>
      </section>

      <section className="container py-20 max-w-3xl">
        <div className="prose prose-slate max-w-none space-y-6 text-foreground leading-relaxed">
          <p className="text-lg">
            The name is a nod to <em>community-acquired</em> diagnoses — the kinds of things people pick up
            just by living their lives. Financial confusion in healthcare works the same way: nobody hands
            out a manual, and the rules quietly affect everyone.
          </p>
          <p>
            This site exists to translate the confusing parts into plain English: paychecks, benefits,
            insurance, retirement accounts, Medicare, Medicaid, and hospital bills. Calculators show the
            numbers. Articles fill in the context. Nothing here is meant to push a product or scare you into
            a decision.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mt-12">
          {[
            { icon: Heart, t: "Credible", d: "Grounded in government, regulator, and reputable sources." },
            { icon: BookOpen, t: "Educational", d: "Built to teach — not to sell." },
            { icon: Users, t: "Humble", d: "Written from the bedside, not from a sales office." },
            { icon: Shield, t: "Safe", d: "No popups, no spam, no personalized financial advice." },
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

        <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> All content on Community Acquired Finance
          is for educational purposes only. It is not individualized financial, medical, tax, insurance, or
          legal advice. Always consult a qualified professional for decisions that affect your situation.
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/tools">Start with a calculator</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/articles">Read the articles</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
