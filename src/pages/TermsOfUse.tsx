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

const TermsOfUse = () => {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of Use"
        description="Plain-English boundaries for using Community Acquired Finance."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Educational use only">
          <p>
            Community Acquired Finance provides general educational information about healthcare finance, insurance, Medicare, Medicaid, workplace benefits, retirement accounts, hospital bills, and related money topics.
          </p>
          <p>
            The site does not provide individualized financial, investment, tax, legal, insurance, medical, billing, or benefits advice. You are responsible for verifying details with official sources, plan documents, benefits departments, insurers, billing offices, government agencies, and qualified professionals.
          </p>
        </Section>

        <Section title="No professional relationship">
          <p>
            Using this site does not create a financial advisor-client relationship, attorney-client relationship, clinician-patient relationship, insurance broker relationship, tax professional relationship, or any other professional relationship.
          </p>
        </Section>

        <Section title="Calculator estimates">
          <p>
            Calculators are simplified educational tools. They may use assumptions, rounded numbers, and user-entered values. Actual results can differ because of plan rules, taxes, employer policies, insurance contracts, billing practices, interest rates, market returns, and other facts not captured by a calculator.
          </p>
          <p>
            Do not rely on a calculator result as the sole basis for a financial, medical, insurance, employment, tax, or legal decision.
          </p>
        </Section>

        <Section title="Sources and accuracy">
          <p>
            We try to use official or reputable sources and explain uncertainty plainly. Healthcare finance rules can change, and plan-specific details matter. Content may become outdated or may not apply to your situation.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            The site links to external websites for source material and further reading. We do not control third-party websites and are not responsible for their content, policies, security, availability, or accuracy.
          </p>
        </Section>

        <Section title="Advertising, sponsorships, and conflicts">
          <p>
            If advertising, sponsorships, or affiliate relationships are added later, they should be clearly disclosed. Advertising should not control the educational conclusions of articles or calculators.
          </p>
        </Section>

        <Section title="No guarantee">
          <p>
            The site is provided as-is for educational purposes. We do not guarantee that the site will be error-free, uninterrupted, complete, current, or appropriate for any specific use.
          </p>
        </Section>

        <Section title="Responsible use">
          <p>
            Do not use this site to submit sensitive personal information, protected health information, account numbers, Social Security numbers, payment card numbers, or confidential employment information.
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

export default TermsOfUse;
