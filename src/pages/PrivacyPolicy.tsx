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
        description="How Community Acquired Finance handles privacy, cookies, calculators, advertising, and user rights."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Overview">
          <p>
            Community Acquired Finance is an educational website about healthcare money topics. We aim to collect as little personal information as possible while providing articles, calculators, glossary pages, and source-backed explanations.
          </p>
          <p>
            This policy explains what information may be collected, how it may be used, how advertising cookies may work if ads are added, and what choices users may have. This policy should be reviewed again before any email forms, analytics, advertising scripts, consent tools, account features, or comment features are added.
          </p>
        </Section>

        <Section title="Who operates this site">
          <p>
            Community Acquired Finance is an independent educational website. It is not a hospital, insurer, government agency, financial advisory firm, law firm, tax firm, or medical practice.
          </p>
          <p>
            Privacy requests, correction requests, and source questions can be sent to the official Community Acquired Finance inbox listed on the Contact page. Do not send sensitive medical, financial, insurance, employment, tax, legal, or account information through email.
          </p>
        </Section>

        <Section title="Information you provide directly">
          <p>
            The current site is designed primarily for reading articles and using calculators. If future contact forms, newsletter forms, comments, surveys, or account features are added, the site may collect the information a user submits, such as a name, email address, message, preference, or question.
          </p>
          <p>
            Users should not submit protected health information, Social Security numbers, insurance member IDs, account numbers, payment card numbers, employer confidential information, medical records, claim documents, tax records, or other sensitive information through the website.
          </p>
        </Section>

        <Section title="Calculator information">
          <p>
            Calculators are intended for educational estimates. They are not designed to collect or store sensitive personal information. Calculator inputs should be treated as examples or estimates, not as records, advice, or a complete financial picture.
          </p>
          <p>
            Do not enter private medical, financial, insurance, employment, or account information that is not needed to use a calculator. Calculator results are estimates and should be verified with official plan documents, benefits departments, insurers, billing offices, tax professionals, legal professionals, financial professionals, or other qualified sources.
          </p>
        </Section>

        <Section title="Information collected automatically">
          <p>
            Like most websites, this site or its hosting, security, analytics, or advertising providers may collect technical information automatically. This may include IP address, browser type, device type, operating system, pages visited, referring pages, approximate location derived from IP address, date and time of visit, and diagnostic or security logs.
          </p>
          <p>
            If analytics are added, they should be configured to avoid collecting unnecessary personal information. If advertising is added, additional cookie, device, and interest-based advertising data may be processed by advertising partners under their own policies.
          </p>
        </Section>

        <Section title="Cookies and similar technologies">
          <p>
            Cookies and similar technologies may be used to operate the website, remember preferences, understand site performance, prevent abuse, support analytics, or serve ads if advertising is enabled.
          </p>
          <p>
            Users can usually control cookies through browser settings. Blocking some cookies may affect site functionality or advertising personalization.
          </p>
        </Section>

        <Section title="Google advertising cookies">
          <p>
            If this site displays Google ads, third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites.
          </p>
          <p>
            Google's use of advertising cookies enables Google and its partners to serve ads based on visits to this site and other sites on the internet. Users may opt out of personalized advertising by visiting Google's Ads Settings. Users may also visit aboutads.info to opt out of some third-party vendors' use of cookies for personalized advertising where available.
          </p>
          <p>
            If third-party ad networks or vendors beyond Google are used, this policy should be updated to identify those vendors or link to a current vendor list and explain available opt-out choices.
          </p>
        </Section>

        <Section title="How information may be used">
          <p>Information may be used to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Operate, maintain, and secure the website.</li>
            <li>Improve articles, calculators, navigation, and performance.</li>
            <li>Understand which pages are useful to readers.</li>
            <li>Respond to voluntary messages if contact features are added.</li>
            <li>Display, measure, or personalize ads if advertising is enabled.</li>
            <li>Detect fraud, abuse, security issues, or technical problems.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="How information may be shared">
          <p>
            Information may be shared with service providers that help host, secure, analyze, or operate the website; advertising or analytics providers if those tools are added; legal or safety authorities when required; or successor entities if the website is transferred.
          </p>
          <p>
            This site does not currently sell personal information directly. If advertising or analytics tools are added, some privacy laws may treat certain targeted advertising, cookie sharing, or cross-context behavioral advertising as a "sale" or "sharing" of personal information. If that applies, the site should add the required opt-out mechanism before those tools are enabled.
          </p>
        </Section>

        <Section title="Do Not Sell or Share / targeted advertising choices">
          <p>
            The site does not currently provide a separate targeted-advertising opt-out control because no ad units or advertising scripts are intentionally included at this stage. Before personalized advertising, retargeting, or cross-context behavioral advertising is enabled, the site should add an appropriate cookie consent or opt-out mechanism where required by law.
          </p>
          <p>
            Users can also use browser privacy controls, Global Privacy Control where supported, Google's Ads Settings, and industry opt-out tools where available.
          </p>
        </Section>

        <Section title="U.S. state privacy rights">
          <p>
            Depending on where a user lives and whether a privacy law applies to this website, users may have rights to request access, correction, deletion, portability, or information about personal data processing, and may have rights to opt out of certain targeted advertising, sale, or sharing of personal information.
          </p>
          <p>
            Privacy-related questions can be sent through the Contact page. If the site begins collecting contact information, analytics identifiers, advertising identifiers, or other personal information at scale, additional privacy request, consent, or opt-out mechanisms may be added where required.
          </p>
        </Section>

        <Section title="International users">
          <p>
            If users access the site from outside the United States, their information may be processed in the United States or other locations where service providers operate. Users in some regions, including the EEA, UK, and similar jurisdictions, may have rights to access, correct, delete, restrict, object to, or request portability of certain personal data.
          </p>
          <p>
            If the site begins using analytics, ads, or email forms for international audiences, a consent and data-rights workflow should be reviewed before launch.
          </p>
        </Section>

        <Section title="HIPAA and medical privacy">
          <p>
            Community Acquired Finance is an educational website and is not intended to receive protected health information. The site is not a substitute for communicating with a healthcare provider, insurer, plan administrator, or billing office through their secure channels.
          </p>
          <p>
            Do not submit medical records, claim documents, diagnosis details, insurance ID numbers, patient account numbers, or other protected health information through this website.
          </p>
        </Section>

        <Section title="Data retention and security">
          <p>
            Technical logs and service-provider records may be retained for operational, security, legal, or troubleshooting purposes. If contact forms or email features are added, messages may be retained long enough to respond and maintain site records.
          </p>
          <p>
            No website can guarantee perfect security. Users should avoid submitting sensitive information that the site does not request and does not need.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            This site is intended for a general adult audience and is not designed for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            Articles and source lists link to official agencies, research organizations, plan resources, and other third-party websites. We do not control those websites, their privacy practices, security, or content after you leave this site.
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
