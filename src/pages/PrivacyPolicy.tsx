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
        description="How Community Acquired Finance handles guided-tool answers, analytics, advertising technology, cookies, and privacy choices."
      />

      <section className="container max-w-3xl py-12 md:py-16 space-y-6" aria-label="Privacy policy details">
        <p className="text-sm text-muted-foreground">Effective date: July 11, 2026</p>

        <Section title="Overview">
          <p>
            Community Acquired Finance is an independent educational website about healthcare money topics. We aim to collect as little personal information as reasonably possible while providing articles, calculators, guided decision tools, and source-backed explanations.
          </p>
          <p>
            The site currently uses hosting and security logs, Vercel performance products, Google Analytics subject to the privacy choice described below, and conditional Google advertising technology on some ordinary pages. Sensitive guided tools are intentionally excluded from the site&apos;s managed AdSense loading system.
          </p>
        </Section>

        <Section title="Who operates this site">
          <p>
            Community Acquired Finance is not a hospital, insurer, government agency, financial advisory firm, law firm, tax firm, brokerage, benefits administrator, or medical practice.
          </p>
          <p>
            Privacy and correction requests may be sent through the Contact page. Do not send protected health information, account credentials, government identification numbers, insurance member IDs, medical records, tax records, or other sensitive information through ordinary email.
          </p>
        </Section>

        <Section title="Information you provide directly">
          <p>
            If you voluntarily use a contact or newsletter feature, the site may receive the information you submit, such as an email address, name, message, or subscription preference.
          </p>
          <p>
            Do not submit Social Security numbers, payment card numbers, bank or brokerage account numbers, passwords, claim documents, medical records, diagnosis details, employer-confidential information, or other sensitive personal information.
          </p>
        </Section>

        <Section title="Guided tools and calculator answers">
          <p>
            The Medicare and Medicaid Eligibility Check, Healthcare Worker Benefits Blueprint, Employer Benefits Action Plan, Healthcare Worker Total Compensation Comparison, and similar calculators are designed to keep answer values in local browser state. Their answer values are not intentionally transmitted to or stored by Community Acquired Finance.
          </p>
          <p>
            Copying, printing, downloading, sharing, or entering the same information into another website is controlled by the user and may create records outside this site. General page-view, device, performance, hosting, security, or consent-state information may still be processed as described below, but the site does not intentionally attach answer-level fields to analytics events.
          </p>
        </Section>

        <Section title="Information collected automatically">
          <p>
            Hosting, security, analytics, and performance providers may automatically process technical information such as IP address, browser and device type, operating system, pages visited, referring page, approximate location derived from IP address, timestamps, response performance, and diagnostic or security logs.
          </p>
          <p>
            Vercel hosts the site and provides Analytics and Speed Insights. Google Analytics code is loaded only after a visitor chooses Allow analytics. Advertising personalization signals remain disabled through this site&apos;s Google Analytics configuration.
          </p>
        </Section>

        <Section title="Privacy choices and Google Consent Mode">
          <p>
            The site provides a privacy-choice panel with two options: Necessary only and Allow analytics. The choice is stored in the browser so it can be applied on later visits. The panel can be reopened from the Privacy choices button in the footer.
          </p>
          <p>
            Necessary only keeps Google analytics storage, advertising storage, advertising user data, and advertising personalization denied, and the site does not download the Google Analytics library. Allow analytics grants Google Analytics storage and loads Google Analytics, while advertising storage, advertising user data, and advertising personalization remain denied through this site&apos;s consent controls.
          </p>
          <p>
            Necessary hosting, security, and diagnostic logs may continue because they are required to operate and protect the site. Vercel performance products may process limited technical data as described by Vercel. The site does not intentionally send guided-tool answer values, employer or role names, salary or wage amounts, benefit amounts, commute details, names, email addresses, income, health status, or other sensitive form entries as analytics event properties.
          </p>
        </Section>

        <Section title="Google advertising technology">
          <p>
            On pages that are not designated as ad-free, the site may conditionally load Google AdSense technology. Google and other authorized advertising vendors may use cookies or similar technologies to serve, limit, measure, or personalize ads when permitted by the applicable consent signals and law.
          </p>
          <p>
            Google&apos;s use of advertising cookies can enable Google and its partners to serve ads based on visits to this site or other sites. Users may manage personalized advertising through Google&apos;s Ads Settings and may use industry opt-out tools where available.
          </p>
          <p>
            This site&apos;s own privacy panel does not grant advertising personalization consent. Personalized advertising for visitors in the EEA, United Kingdom, or Switzerland must not be enabled unless an appropriate Google-certified consent management platform and any other required controls are configured.
          </p>
        </Section>

        <Section title="How information may be used">
          <p>Information may be used to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Operate, secure, troubleshoot, and maintain the website.</li>
            <li>Measure performance and understand which pages are useful.</li>
            <li>Improve articles, guided tools, calculators, accessibility, and navigation.</li>
            <li>Respond to voluntary messages and manage subscriptions.</li>
            <li>Serve or measure limited, contextual, or other permitted advertising where enabled.</li>
            <li>Detect abuse, fraud, malware, or technical failures.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="How information may be shared">
          <p>
            Information may be processed by service providers that host, secure, analyze, or operate the site, including Vercel and Google products used on the site. It may also be disclosed when required by law, to protect users or the site, or as part of a legitimate transfer of the website.
          </p>
          <p>
            Community Acquired Finance does not sell personal information directly. Some privacy laws may define certain advertising or analytics disclosures as a sale or sharing even when no money is exchanged; applicable opt-out or consent controls should be added before those activities are enabled where required.
          </p>
        </Section>

        <Section title="U.S. state and international privacy rights">
          <p>
            Depending on location and whether a law applies to this site, users may have rights to request access, correction, deletion, portability, restriction, objection, or information about personal data processing, and may have rights to opt out of certain targeted advertising, sale, or sharing.
          </p>
          <p>
            Privacy requests may be sent through the Contact page. Identity verification may be required before completing a legally protected request.
          </p>
        </Section>

        <Section title="HIPAA and medical privacy">
          <p>
            Community Acquired Finance is not intended to receive protected health information and does not provide a secure patient, insurer, or employer communication channel. Do not submit medical records, claim documents, diagnosis details, insurance ID numbers, patient account numbers, or other protected health information.
          </p>
        </Section>

        <Section title="Data retention and security">
          <p>
            Technical logs, analytics records, consent preferences, and service-provider records may be retained for operational, measurement, security, legal, or troubleshooting purposes. Voluntary messages and subscription records may be retained as needed to provide the requested service.
          </p>
          <p>
            No website can guarantee perfect security. Users should avoid providing information the site does not request and does not need.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            This site is intended for a general adult audience and is not designed for children under 13. We do not knowingly collect personal information directly from children under 13.
          </p>
        </Section>

        <Section title="Third-party links">
          <p>
            Articles and source lists link to government agencies, research organizations, plan resources, and other third-party websites. Community Acquired Finance does not control their content, privacy practices, security, accessibility, or availability after a user leaves this site.
          </p>
        </Section>

        <Section title="Policy updates">
          <p>
            This policy may be updated when the site&apos;s tools, analytics, advertising, forms, vendors, or legal obligations change. The effective date above should be revised when material changes are made.
          </p>
        </Section>

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/about">Back to About / Sources</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
