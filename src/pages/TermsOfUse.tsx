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

        <Section title="Acceptance of these terms">
          <p>
            By using Community Acquired Finance, you agree to these Terms of Use. If you do not agree, do not use the site.
          </p>
          <p>
            These terms are intended to set boundaries for an educational website. They do not replace advice from a qualified professional or official plan, government, employer, insurer, or billing source.
          </p>
        </Section>

        <Section title="Educational use only">
          <p>
            Community Acquired Finance provides general educational information about healthcare finance, insurance, Medicare, Medicaid, workplace benefits, retirement accounts, hospital bills, and related money topics.
          </p>
          <p>
            The site does not provide individualized financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice. You are responsible for verifying details with official sources, plan documents, benefits departments, insurers, billing offices, government agencies, and qualified professionals.
          </p>
        </Section>

        <Section title="No professional relationship">
          <p>
            Using this site does not create a financial advisor-client relationship, attorney-client relationship, clinician-patient relationship, insurance broker relationship, tax professional relationship, fiduciary relationship, or any other professional relationship.
          </p>
        </Section>

        <Section title="No emergency or medical-care instructions">
          <p>
            This site does not provide diagnosis, treatment, triage, or emergency medical instructions. If you believe you may have a medical emergency, contact emergency services or a qualified healthcare professional through appropriate channels.
          </p>
        </Section>

        <Section title="Calculator estimates">
          <p>
            Calculators are simplified educational tools. They may use assumptions, rounded numbers, and user-entered values. Actual results can differ because of plan rules, taxes, employer policies, insurance contracts, billing practices, interest rates, investment performance, benefit limits, and other facts not captured by a calculator.
          </p>
          <p>
            Do not rely on a calculator result as the sole basis for a financial, medical, insurance, employment, tax, legal, or benefits decision.
          </p>
        </Section>

        <Section title="Sources, accuracy, and updates">
          <p>
            We try to use official or reputable sources and explain uncertainty plainly. Healthcare finance rules can change, and plan-specific details matter. Content may become outdated, incomplete, or may not apply to your situation.
          </p>
          <p>
            You should verify important decisions with current official sources, your own plan documents, your employer, your insurer, Medicare, Medicaid, billing offices, and qualified professionals.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            The site links to external websites for source material and further reading. We do not control third-party websites and are not responsible for their content, policies, security, availability, accuracy, or changes after you leave this site.
          </p>
        </Section>

        <Section title="Advertising, sponsorships, and conflicts">
          <p>
            If advertising, sponsorships, affiliate links, or paid partnerships are added later, they should be clearly disclosed. Advertising should not control educational conclusions, calculator logic, source selection, or article recommendations.
          </p>
          <p>
            Users should never be asked to click ads to support the site. Ads should be labeled clearly and should not be disguised as navigation, downloads, recommendations, or source links.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            Unless otherwise noted, the site's original writing, structure, design, and educational materials are owned by Community Acquired Finance or its owner. You may link to pages for personal, educational, or noncommercial reference, but you may not copy, scrape, republish, or sell substantial portions of the site without permission.
          </p>
        </Section>

        <Section title="Responsible use">
          <p>
            Do not use this site to submit sensitive personal information, protected health information, account numbers, Social Security numbers, payment card numbers, confidential employment information, or private plan documents.
          </p>
          <p>
            Do not use the site to violate laws, interfere with the site's operation, scrape content at scale, attempt unauthorized access, introduce malware, or misrepresent the site's content as personalized professional advice.
          </p>
        </Section>

        <Section title="No guarantee">
          <p>
            The site is provided as-is for educational purposes. We do not guarantee that the site will be error-free, uninterrupted, complete, current, secure, or appropriate for any specific use.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, Community Acquired Finance and its owner are not liable for losses or damages arising from use of the site, reliance on educational content, calculator estimates, third-party links, outdated information, technical errors, or decisions made after reading the site.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            These terms may be updated as the site changes. The effective date above should be revised when material changes are made.
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
