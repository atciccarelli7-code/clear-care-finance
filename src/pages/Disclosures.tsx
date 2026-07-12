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
        description="Clear boundaries around education, guided tools, official determinations, advertising, sources, and professional advice."
      />

      <div className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: July 10, 2026</p>

        <Section title="Educational information only">
          <p>
            Community Acquired Finance provides general educational information. The site is not financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice.
          </p>
          <p>
            Articles and tools are designed to explain terms, documents, tradeoffs, possible pathways, and questions to ask. They are not individualized instructions for what a specific person should do.
          </p>
        </Section>

        <Section title="No official eligibility, coverage, or authorization determination">
          <p>
            Guided tools do not enroll anyone, approve benefits, authorize care, adjudicate a claim, establish medical necessity, determine tax treatment, or make an official Medicare, Medicaid, insurer, employer, retirement-plan, HSA, billing, or government decision.
          </p>
          <p>
            Official agencies, insurers, employers, plan administrators, healthcare providers, billing entities, contracts, statutes, regulations, and current plan documents control the actual result.
          </p>
        </Section>

        <Section title="No professional relationship">
          <p>
            Using this site does not create a relationship with a financial advisor, investment adviser, fiduciary, attorney, tax professional, insurance producer, clinician, billing advocate, benefits administrator, or any other professional.
          </p>
        </Section>

        <Section title="Healthcare and emergency disclaimer">
          <p>
            The site does not provide diagnosis, treatment, triage, medical advice, or emergency instructions. If you believe you may have a medical emergency, contact emergency services or a qualified healthcare professional through appropriate channels.
          </p>
        </Section>

        <Section title="Calculator and guided-tool limitations">
          <p>
            Tools are simplified educational estimates. They may use assumptions, rounded numbers, incomplete inputs, broad categories, or general rules. Actual eligibility, costs, taxes, investment outcomes, premiums, coverage, claim responsibility, authorization, and benefits can differ materially.
          </p>
          <p>
            Unknown information should remain unknown. A result labeled possible, likely, estimated, or worth verifying is not a guarantee. Verify important decisions with current official sources and the controlling documents.
          </p>
        </Section>

        <Section title="Advertising disclosure">
          <p>
            The site may display Google or other advertising on ordinary pages. Advertising should remain distinguishable from editorial content, navigation, calculators, source links, official resources, and recommended next steps.
          </p>
          <p>
            Sensitive guided tools may be intentionally ad-free. Readers are never asked to click ads to support the site, and ad placement should not pressure or mislead readers.
          </p>
        </Section>

        <Section title="Affiliate and sponsorship disclosure">
          <p>
            The site does not currently use affiliate links or sponsored recommendations. If affiliate links, referral relationships, paid placements, or sponsored content are introduced, the relationship should be disclosed clearly near the relevant content.
          </p>
          <p>
            Compensation should not control article conclusions, source selection, calculator logic, rankings, or whether a reader is told to verify information independently.
          </p>
        </Section>

        <Section title="Product, employer, and agency references">
          <p>
            Mentioning an employer, insurer, plan type, government agency, product, vendor, website, or service is for educational or source-reference purposes and is not an endorsement unless explicitly stated.
          </p>
          <p>
            Community Acquired Finance is independent and is not an official Medicare, Medicaid, CMS, IRS, hospital, insurer, employer, bank, brokerage, or government website.
          </p>
        </Section>

        <Section title="AI-assisted work disclosure">
          <p>
            AI tools may assist with drafting, editing, coding, formatting, testing, and organizing research. AI assistance does not replace human review for source quality, accuracy, clarity, legal and safety boundaries, and usefulness to the intended audience.
          </p>
          <p>
            Personal experience attributed to the author should come from the author. AI should not fabricate experience, sources, credentials, results, or certainty.
          </p>
        </Section>

        <Section title="Accuracy, dates, and updates">
          <p>
            Healthcare finance rules, tax limits, plan contracts, agency guidance, and laws change. Dates and reviewed-on notes indicate when a page was checked; they do not guarantee that every linked source or plan rule remains unchanged.
          </p>
          <p>
            Material errors should be corrected promptly. Pages should not receive a new date merely to appear fresh when the substance has not changed.
          </p>
        </Section>

        <Section title="External links">
          <p>
            External links are provided for verification and further reading. Community Acquired Finance does not control third-party content, privacy practices, security, accessibility, or availability.
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

export default Disclosures;
