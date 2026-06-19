import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-card">
    <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const EditorialPolicy = () => {
  return (
    <>
      <PageHero
        eyebrow="Editorial standards"
        title="Editorial Policy"
        description="How Community Acquired Finance approaches sources, accuracy, conflicts, and educational boundaries."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Purpose">
          <p>
            Community Acquired Finance explains healthcare money topics in plain English for healthcare workers, patients, and caregivers. The goal is clarity, not fear, clicks, or product sales.
          </p>
        </Section>

        <Section title="Source standards">
          <p>
            We prefer primary and high-quality sources: Medicare.gov, Medicaid.gov, CMS, IRS, BLS, HealthCare.gov, Federal Reserve, state agencies, plan documents, and reputable nonpartisan research organizations.
          </p>
          <p>
            When a topic depends on plan-specific rules, state rules, employer policies, or current law, articles should say so instead of pretending one answer applies to everyone.
          </p>
        </Section>

        <Section title="Educational boundaries">
          <p>
            Articles and calculators are educational. They should help readers ask better questions, understand terms, compare documents, and recognize common mistakes. They should not tell a reader what plan, investment, treatment, legal strategy, tax move, or insurance decision is right for their specific situation.
          </p>
        </Section>

        <Section title="Corrections and updates">
          <p>
            Healthcare finance rules change. If a page is updated, the goal is to improve accuracy, clarity, source quality, or readability. Readers should still verify important decisions with official sources and qualified professionals.
          </p>
        </Section>

        <Section title="Advertising and conflicts">
          <p>
            Ads, sponsorships, and affiliate relationships should not control article conclusions, calculator logic, or source selection. If monetization relationships are added, they should be disclosed clearly and kept separate from educational content.
          </p>
        </Section>

        <Section title="AI-assisted workflow">
          <p>
            Drafting, editing, coding, formatting, and research organization may be assisted by AI tools. Content should still be reviewed for accuracy, plain-English usefulness, source quality, and alignment with the site's educational purpose before publication.
          </p>
        </Section>

        <Section title="Reader safety">
          <p>
            Pages should avoid scare tactics, exaggerated promises, misleading certainty, or pressure-based language. Healthcare money decisions can be stressful enough without making readers feel trapped or ashamed.
          </p>
        </Section>

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/about">Back to About / Sources</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default EditorialPolicy;
