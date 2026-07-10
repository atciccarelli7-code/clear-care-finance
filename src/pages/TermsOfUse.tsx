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
        description="Plain-English boundaries for using Community Acquired Finance, its articles, calculators, and guided tools."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: July 10, 2026</p>

        <Section title="Acceptance of these terms">
          <p>
            By using Community Acquired Finance, you agree to these Terms of Use. If you do not agree, do not use the site.
          </p>
          <p>
            These terms set boundaries for an educational website. They do not replace current official guidance, controlling plan documents, contracts, laws, regulations, or advice from a qualified professional.
          </p>
        </Section>

        <Section title="Educational use only">
          <p>
            Community Acquired Finance provides general educational information about healthcare finance, insurance, Medicare, Medicaid, workplace benefits, retirement accounts, investing basics, hospital bills, and related money topics.
          </p>
          <p>
            The site does not provide individualized financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice.
          </p>
        </Section>

        <Section title="No official determination">
          <p>
            Site tools do not enroll users, approve coverage, authorize care, decide claims, establish eligibility, determine medical necessity, calculate an official tax liability, or make a binding decision for Medicare, Medicaid, an insurer, employer, retirement plan, HSA, provider, billing office, or government agency.
          </p>
          <p>
            A result is a planning aid based on the information entered. The applicable agency, insurer, employer, plan administrator, provider, law, contract, and current documents control.
          </p>
        </Section>

        <Section title="No professional relationship">
          <p>
            Using this site does not create a financial advisor-client, investment adviser-client, fiduciary, attorney-client, clinician-patient, insurance producer, tax professional, billing advocate, benefits administrator, or other professional relationship.
          </p>
        </Section>

        <Section title="No emergency or medical-care instructions">
          <p>
            This site does not provide diagnosis, treatment, triage, or emergency medical instructions. If you believe you may have a medical emergency, contact emergency services or a qualified healthcare professional through appropriate channels.
          </p>
        </Section>

        <Section title="Calculator and guided-tool estimates">
          <p>
            Tools may use assumptions, rounded values, broad categories, incomplete inputs, and general rules. Actual results can differ because of plan language, laws, state rules, taxes, employer policies, insurance contracts, billing practices, interest rates, market performance, benefit limits, and facts not captured by the tool.
          </p>
          <p>
            Do not rely on a site result as the sole basis for a financial, medical, insurance, employment, tax, legal, billing, eligibility, authorization, or benefits decision.
          </p>
        </Section>

        <Section title="User inputs and privacy">
          <p>
            Do not enter protected health information, Social Security numbers, insurance member IDs, account credentials, payment card numbers, private medical records, tax records, or confidential employment documents into the site.
          </p>
          <p>
            Some guided tools are designed to keep answers in local browser state, but technical logs and general analytics or performance information may still be processed as described in the Privacy Policy.
          </p>
        </Section>

        <Section title="Sources, accuracy, and updates">
          <p>
            We aim to use current official or reputable sources, identify uncertainty, and correct material errors. Information can still be incomplete, outdated, or inapplicable to a particular person, plan, state, provider, employer, or claim.
          </p>
          <p>
            Verify important decisions with current official sources, plan documents, agencies, insurers, benefits departments, billing entities, providers, and qualified professionals.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            External links are provided for verification and further reading. Community Acquired Finance does not control and is not responsible for third-party content, policies, security, accessibility, accuracy, availability, or later changes.
          </p>
        </Section>

        <Section title="Advertising, sponsorships, and conflicts">
          <p>
            Advertising may appear on ordinary pages and should remain clearly separate from educational content and navigation. Sensitive guided tools may be intentionally ad-free.
          </p>
          <p>
            Any future sponsorship, affiliate, referral, or paid relationship should be disclosed and should not control calculator logic, source selection, rankings, or editorial conclusions.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            Unless otherwise noted, the site&apos;s original writing, structure, design, code, and educational materials are owned by Community Acquired Finance or its owner. You may link to pages for personal, educational, or noncommercial reference, but may not copy, scrape, republish, or sell substantial portions without permission.
          </p>
        </Section>

        <Section title="Responsible use">
          <p>
            Do not use the site to violate law, interfere with operation, attempt unauthorized access, introduce malware, scrape at scale, impersonate the site, or present its educational content as an official or individualized professional determination.
          </p>
        </Section>

        <Section title="No guarantee">
          <p>
            The site is provided as-is for educational purposes. We do not guarantee that it will be error-free, uninterrupted, complete, current, secure, indexed by a search engine, or appropriate for a specific use.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, Community Acquired Finance and its owner are not liable for losses or damages arising from use of the site, reliance on educational content or estimates, third-party links, outdated information, technical errors, or decisions made after using the site.
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
