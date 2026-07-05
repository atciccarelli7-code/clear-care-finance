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

const Disclosures = () => {
  return (
    <>
      <PageHero
        eyebrow="Disclosures"
        title="Disclosures & Disclaimers"
        description="Clear boundaries around education, ads, affiliate relationships, calculators, and professional advice."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: July 5, 2026</p>

        <Section title="Educational information only">
          <p>
            Community Acquired Finance provides general educational information. The site is not financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice.
          </p>
          <p>
            Articles and calculators are meant to help readers understand terms, documents, tradeoffs, and questions to ask. They are not instructions for what any specific person should do.
          </p>
        </Section>

        <Section title="No professional relationship">
          <p>
            Using this site does not create a professional relationship with a financial advisor, attorney, tax professional, insurance broker, clinician, billing advocate, fiduciary, or any other professional.
          </p>
        </Section>

        <Section title="Healthcare and emergency disclaimer">
          <p>
            The site does not provide diagnosis, treatment, triage, medical advice, or emergency instructions. If you believe you may have a medical emergency, contact emergency services or a qualified healthcare professional through appropriate channels.
          </p>
        </Section>

        <Section title="Calculator disclosures">
          <p>
            Calculators are simplified estimates. They may use assumptions, rounded numbers, incomplete inputs, or generic rules. Actual costs, taxes, investment outcomes, benefits, premiums, payments, and insurance responsibilities can differ materially.
          </p>
          <p>
            Verify all important decisions with plan documents, official sources, billing offices, benefits departments, insurers, tax professionals, legal professionals, financial professionals, or other qualified sources.
          </p>
        </Section>

        <Section title="Advertising disclosure">
          <p>
            The site may display advertising in the future. Ads should be clearly distinguishable from educational content, navigation, calculator tools, source links, and article recommendations.
          </p>
          <p>
            Readers should never be asked to click ads to support the site. Ads should not be labeled in a deceptive way, placed where they look like navigation, or used to pressure readers into decisions.
          </p>
        </Section>

        <Section title="Affiliate and sponsorship disclosure">
          <p>
            The site does not currently use affiliate links or sponsored recommendations. If affiliate links, referral links, paid placements, or sponsored content are added later, the relationship should be disclosed clearly near the relevant content.
          </p>
          <p>
            Any future affiliate or sponsorship relationship should not control article conclusions, source selection, calculator logic, or whether a topic is covered.
          </p>
        </Section>

        <Section title="Monetization standards">
          <p>
            Community Acquired Finance may earn revenue from advertising, sponsorships, affiliate links, referral relationships, downloadable resources, or other clearly labeled business relationships in the future.
          </p>
          <p>
            Monetized content should remain separable from editorial content. Compensation should not change calculator formulas, source selection, educational conclusions, or whether a reader is told to verify details with official sources and plan documents.
          </p>
          <p>
            If a page compares products, plans, vendors, or services and compensation may apply, that relationship should be disclosed on or near the page before a reader relies on the comparison.
          </p>
        </Section>

        <Section title="Product and employer references">
          <p>
            Articles may discuss general types of accounts, plans, insurers, employers, benefits, products, agencies, or vendors for educational purposes. Mentioning a product, employer, website, or agency is not an endorsement unless clearly stated.
          </p>
        </Section>

        <Section title="AI-assisted work disclosure">
          <p>
            AI tools may assist with drafting, editing, coding, formatting, and organizing research. AI assistance should not replace review for source quality, accuracy, clarity, reader safety, and educational usefulness.
          </p>
        </Section>

        <Section title="Accuracy and updates">
          <p>
            Healthcare finance rules change, and plan-specific details matter. The site may contain errors or become outdated. Readers should verify important details before acting.
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

export default Disclosures;
