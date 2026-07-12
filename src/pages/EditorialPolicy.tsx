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
        description="How Community Acquired Finance approaches sources, accuracy, conflicts, advertising, and educational boundaries."
      />

      <div className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Purpose">
          <p>
            Community Acquired Finance explains healthcare money topics in plain English for healthcare workers, patients, and caregivers. The goal is clarity, not fear, clicks, product sales, or pretending that a complex plan-specific decision has one universal answer.
          </p>
        </Section>

        <Section title="Audience">
          <p>
            The site is written for general education. Readers may include nurses, healthcare workers, patients, caregivers, families, and people comparing benefits or bills. Articles should assume the reader is smart but busy, stressed, and not trained in insurance or finance terminology.
          </p>
        </Section>

        <Section title="Source standards">
          <p>
            We prefer primary and high-quality sources: Medicare.gov, Medicaid.gov, CMS, IRS, BLS, HealthCare.gov, Federal Reserve, state agencies, plan documents, and reputable nonpartisan research organizations.
          </p>
          <p>
            When a topic depends on plan-specific rules, state rules, employer policies, current law, or individual facts, articles should say so instead of pretending one answer applies to everyone.
          </p>
        </Section>

        <Section title="Article structure">
          <p>
            Articles should be practical and scannable. Preferred structure includes a clear promise, audience, short summary, plain-English definitions, fact-sheet sections, examples, common mistakes, takeaway, related calculator when useful, and source notes.
          </p>
          <p>
            Content should avoid filler, keyword stuffing, copied content, exaggerated claims, and generic finance material that does not help healthcare workers, patients, or caregivers make sense of a real decision.
          </p>
        </Section>

        <Section title="Educational boundaries">
          <p>
            Articles and calculators are educational. They should help readers ask better questions, understand terms, compare documents, and recognize common mistakes. They should not tell a reader what plan, investment, treatment, legal strategy, tax move, insurance decision, or billing dispute strategy is right for their specific situation.
          </p>
        </Section>

        <Section title="YMYL care standard">
          <p>
            Healthcare finance can affect medical access, insurance coverage, retirement decisions, taxes, debt, and family caregiving. Content should therefore be careful, modest, source-backed, and transparent about uncertainty. The site should not use urgency, fear, shame, or unrealistic promises to push readers into decisions.
          </p>
        </Section>

        <Section title="Corrections and updates">
          <p>
            Healthcare finance rules change. If a page is updated, the goal is to improve accuracy, clarity, source quality, usefulness, or readability. Readers should still verify important decisions with official sources and qualified professionals.
          </p>
          <p>
            If a material error is discovered, the page should be corrected promptly. When appropriate, the article should explain that the rule, number, or interpretation changed.
          </p>
        </Section>

        <Section title="Advertising and conflicts">
          <p>
            Ads, sponsorships, affiliate links, and paid partnerships should not control article conclusions, calculator logic, source selection, rankings, or recommendations. If monetization relationships are added, they should be disclosed clearly and kept separate from educational content.
          </p>
          <p>
            Ads should be distinguishable from content and navigation. The site should not ask users to click ads, suggest that ad clicks support a cause, label ads deceptively, or place ads where they could be mistaken for menu links, downloads, calculators, source citations, or recommended articles.
          </p>
        </Section>

        <Section title="Affiliate and sponsorship review">
          <p>
            If affiliate links or sponsored content are added in the future, the relationship should be disclosed near the relevant content in plain language. Sponsored content should still meet the site's source, clarity, and reader-safety standards.
          </p>
        </Section>

        <Section title="AI-assisted workflow">
          <p>
            Drafting, editing, coding, formatting, and research organization may be assisted by AI tools. Content should still be reviewed for accuracy, plain-English usefulness, source quality, and alignment with the site's educational purpose before publication.
          </p>
          <p>
            AI-assisted drafting should not be used to create unsupported facts, fake citations, copied material, fabricated personal experience, or articles designed mainly to satisfy search engines or ad networks.
          </p>
        </Section>

        <Section title="Reader safety">
          <p>
            Pages should avoid scare tactics, exaggerated promises, misleading certainty, or pressure-based language. Healthcare money decisions can be stressful enough without making readers feel trapped, ashamed, or manipulated.
          </p>
        </Section>

        <Section title="Independence">
          <p>
            Community Acquired Finance is independent educational content unless a future page clearly states otherwise. It is not an official Medicare, Medicaid, hospital, insurer, employer, brokerage, bank, or government website.
          </p>
        </Section>

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/about">Back to About / Sources</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditorialPolicy;
