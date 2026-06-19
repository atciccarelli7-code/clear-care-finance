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

const PrivacyPolicy = () => {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        description="How Community Acquired Finance handles privacy, cookies, calculators, and advertising disclosures."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Overview">
          <p>
            Community Acquired Finance is an educational website. We aim to collect as little personal information as possible while providing articles, calculators, glossary pages, and source-backed explanations.
          </p>
          <p>
            This policy is written for the website experience. If the site later adds email forms, analytics, advertising, or other services, this policy should be reviewed and updated before launch.
          </p>
        </Section>

        <Section title="Information you enter into calculators">
          <p>
            The calculators are intended for educational estimates. They are not designed to collect medical records, protected health information, Social Security numbers, account numbers, payment card numbers, or other sensitive personal information.
          </p>
          <p>
            Do not enter private medical, financial, insurance, or employment information that is not needed to use a calculator. Calculator results are estimates and should be verified with official plan documents, benefits departments, insurers, billing offices, tax professionals, or other qualified sources.
          </p>
        </Section>

        <Section title="Cookies and advertising">
          <p>
            This site may use cookies or similar technologies if advertising, analytics, or embedded third-party services are added. Cookies can help measure visits, remember preferences, or serve ads.
          </p>
          <p>
            If this site displays Google ads, third-party vendors including Google may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables Google and its partners to serve ads based on visits to this site and other sites on the internet.
          </p>
          <p>
            Users can opt out of personalized advertising through Google's Ads Settings. Users may also visit industry opt-out tools such as aboutads.info where available.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            Articles and source lists link to official agencies, research organizations, plan resources, and other third-party websites. We do not control those websites, their privacy practices, or their content after you leave this site.
          </p>
        </Section>

        <Section title="Advertising and affiliates">
          <p>
            The site is designed to avoid spammy monetization. If ads, sponsorships, or affiliate relationships are added later, they should be disclosed clearly and should not affect the educational conclusions of an article.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            This site is intended for a general adult audience and is not designed for children under 13. We do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="Policy updates">
          <p>
            This policy may be updated as the site changes. The effective date above should be revised when material changes are made.
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

export default PrivacyPolicy;
