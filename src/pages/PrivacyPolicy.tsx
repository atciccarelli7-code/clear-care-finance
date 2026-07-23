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
      <PageHero eyebrow="Privacy" title="Privacy Policy" description="How Community Acquired Finance handles guided-tool answers, customer accounts, purchases, analytics, advertising technology, cookies, and privacy choices." />

      <section className="container max-w-3xl py-12 md:py-16 space-y-6" aria-label="Privacy policy details">
        <p className="text-sm text-muted-foreground">Effective date: July 23, 2026</p>

        <Section title="Overview">
          <p>Community Acquired Finance is an independent educational website about personal finance, workplace benefits, healthcare costs, insurance, Medicare, Medicaid, and related money topics. We aim to collect as little personal information as reasonably possible while providing articles, calculators, guided decision tools, and source-backed explanations.</p>
          <p>The site uses hosting and security logs, Vercel performance products, Google Analytics subject to the privacy choice described below, and conditional Google advertising technology on some ordinary pages. Sensitive guided tools and paid workspaces are intentionally excluded from the site&apos;s managed AdSense loading system.</p>
        </Section>

        <Section title="Who operates this site">
          <p>Community Acquired Finance is not a hospital, insurer, government agency, financial advisory firm, law firm, tax firm, brokerage, benefits administrator, or medical practice.</p>
          <p>Privacy and correction requests may be sent through the Contact page. Do not send protected health information, account credentials, government identification numbers, insurance member IDs, medical records, tax records, or other sensitive information through ordinary email.</p>
        </Section>

        <Section title="Information you provide directly">
          <p>If you voluntarily use a contact, newsletter, customer-access, or purchase feature, the site may receive the information you submit, such as an email address, name, message, subscription preference, or account-access request.</p>
          <p>Do not submit Social Security numbers, payment card numbers, bank or brokerage account numbers, passwords, claim documents, medical records, diagnosis details, employer-confidential documents, beneficiary details, or other sensitive personal information.</p>
        </Section>

        <Section title="Guided tools and calculator answers">
          <p>The Medicare and Medicaid Eligibility Check, Healthcare Worker Benefits Blueprint, Employer Benefits Action Plan, Healthcare Worker Total Compensation Comparison, paid workspace calculations, and similar tools are designed to keep answer values in local browser state unless a feature clearly says otherwise. Their answer values are not intentionally transmitted to or stored by Community Acquired Finance.</p>
          <p>Copying, printing, downloading, sharing, or entering the same information into another website is controlled by the user and may create records outside this site. General page-view, device, performance, hosting, security, or consent-state information may still be processed as described below, but the site does not intentionally attach answer-level fields to analytics events.</p>
        </Section>

        <Section title="Premium purchases, customer accounts, and entitlements">
          <p>When paid commerce is activated, checkout is processed by the identified third-party payment provider. Community Acquired Finance does not intentionally receive or store full payment-card numbers. The processor may provide the purchase email, order and variant identifiers, payment status, test-mode status, purchase and update timestamps, refund status, and other information needed to verify the transaction and provide access.</p>
          <p>Premium access uses passwordless email links. One-time access tokens and session tokens are generated randomly; server-side storage uses hashed token identifiers. The browser receives an HTTP-only session cookie. Access links expire after 15 minutes and are designed for one use. Sessions currently expire after 30 days and can be ended by signing out.</p>
          <p>The account store is limited to the product entitlement, purchase and update-period dates, access status, product version, completed module identifiers, last-viewed module, and generic checklist completion. It is not designed to store pay amounts, employer names, medical details, benefit values, free-text notes, uploaded documents, or personalized calculator inputs.</p>
          <p>Free-text workspace notes and draft calculations stay in the browser&apos;s local storage. They remain on that device until the user clears them, deletes saved workspace data through the access page, clears browser data, or the browser removes them. Printing or saving a PDF creates a separate local file controlled by the user.</p>
        </Section>

        <Section title="Data deletion and reset">
          <p>An authenticated premium customer can delete synchronized module progress and generic checklist state from the secure access page. That control also removes paid-workspace notes stored by this site in the current browser. Deleting progress does not delete the purchase record or revoke product access because the entitlement record is needed to honor the purchase, process refunds, prevent fraud, and maintain transaction records.</p>
          <p>Requests concerning account email, purchase records, access, correction, or legally applicable deletion rights may be sent through the Contact page. Identity verification may be required. Some transaction records may need to be retained for tax, accounting, fraud-prevention, dispute, or legal reasons.</p>
        </Section>

        <Section title="Information collected automatically">
          <p>Hosting, security, analytics, email, account-storage, payment, and performance providers may automatically process technical information such as IP address, browser and device type, operating system, pages visited, referring page, approximate location derived from IP address, timestamps, response performance, email-delivery status, checkout events, and diagnostic or security logs.</p>
          <p>Vercel hosts the site and provides Analytics and Speed Insights. Google Analytics code is loaded only after a visitor chooses Allow analytics. Advertising personalization signals remain disabled through this site&apos;s Google Analytics configuration.</p>
        </Section>

        <Section title="Privacy choices and Google Consent Mode">
          <p>The site provides a privacy-choice panel with two options: Necessary only and Allow analytics. The choice is stored in the browser so it can be applied on later visits. The panel can be reopened from the Privacy choices button.</p>
          <p>Necessary only keeps Google analytics storage, advertising storage, advertising user data, and advertising personalization denied, and the site does not download the Google Analytics library. Allow analytics grants Google Analytics storage and loads Google Analytics, while advertising storage, advertising user data, and advertising personalization remain denied through this site&apos;s consent controls.</p>
          <p>Site-generated analytics event URLs are reduced to an origin and pathname before they enter the analytics data layer. Query strings and URL fragments are not intentionally included in page-view, destination-path, or outbound-link event fields.</p>
          <p>Necessary hosting, transaction, account-access, security, and diagnostic records may continue because they are required to operate and protect the service. The site does not intentionally send guided-tool answers, employer or role names, salary or wage amounts, benefit amounts, commute details, names, email addresses, income, health status, free-text notes, or other sensitive form entries as analytics event properties.</p>
        </Section>

        <Section title="Google advertising technology">
          <p>On pages that are not designated as ad-free, the site may conditionally load Google AdSense technology. Google and other authorized advertising vendors may use cookies or similar technologies to serve, limit, measure, or personalize ads when permitted by applicable consent signals and law.</p>
          <p>Paid product pages and authenticated premium workspaces are designated ad-free. Advertising does not control product logic, source selection, rankings, calculations, or editorial conclusions.</p>
        </Section>

        <Section title="How information may be used">
          <p>Information may be used to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Operate, secure, troubleshoot, and maintain the website and customer workspace.</li>
            <li>Verify purchases, create or revoke entitlements, deliver access links, process refunds, and recover access.</li>
            <li>Save the minimal progress state a customer chooses to synchronize.</li>
            <li>Measure performance and understand which pages or product steps are useful.</li>
            <li>Improve articles, guided tools, calculators, accessibility, navigation, and paid products.</li>
            <li>Respond to voluntary messages and manage subscriptions.</li>
            <li>Serve or measure limited, contextual, or other permitted advertising where enabled.</li>
            <li>Detect abuse, fraud, malware, unauthorized access, or technical failures.</li>
            <li>Comply with legal, tax, accounting, and contractual obligations.</li>
          </ul>
        </Section>

        <Section title="Service providers and sharing">
          <p>Information may be processed by service providers used to host, secure, measure, email, store account state, process payments, and operate the site. The premium architecture currently anticipates Vercel for hosting, a Vercel Marketplace or Upstash Redis service for minimal account state, Resend for access-email delivery, and Lemon Squeezy for checkout and transaction status. A provider is not treated as active merely because it is named here; commerce remains disabled until the relevant integration is configured and validated.</p>
          <p>Information may also be disclosed when required by law, to protect users or the site, to enforce terms, to resolve disputes, or as part of a legitimate transfer of the website. Community Acquired Finance does not sell personal information directly. Some laws may define certain advertising or analytics disclosures as a sale or sharing even when no money is exchanged; applicable controls should be added before those activities are enabled where required.</p>
        </Section>

        <Section title="U.S. state and international privacy rights">
          <p>Depending on location and whether a law applies to this site, users may have rights to request access, correction, deletion, portability, restriction, objection, or information about personal data processing, and may have rights to opt out of certain targeted advertising, sale, or sharing.</p>
          <p>Privacy requests may be sent through the Contact page. Identity verification may be required before completing a legally protected request.</p>
        </Section>

        <Section title="HIPAA and medical privacy">
          <p>Community Acquired Finance is not intended to receive protected health information and does not provide a secure patient, insurer, employer, or clinician communication channel. The premium workspace does not claim HIPAA compliance. Do not submit medical records, claim documents, diagnosis details, insurance ID numbers, patient account numbers, or other protected health information.</p>
        </Section>

        <Section title="Data retention and security">
          <p>Purchase and entitlement records may be retained as needed to provide access, honor update terms, process refunds, maintain tax and accounting records, resolve disputes, and prevent fraud. Minimal progress remains until the customer deletes it or the service&apos;s retention policy requires removal. Access tokens expire automatically; session records expire according to the session period. Technical logs, analytics records, consent preferences, and service-provider records may be retained for operational, measurement, security, legal, or troubleshooting purposes.</p>
          <p>No website can guarantee perfect security. Users should avoid providing information the site does not request and does not need.</p>
        </Section>

        <Section title="Children's privacy">
          <p>This site is intended for a general adult audience and is not designed for children under 13. We do not knowingly collect personal information directly from children under 13.</p>
        </Section>

        <Section title="Third-party links">
          <p>Articles and source lists link to government agencies, research organizations, plan resources, and other third-party websites. Community Acquired Finance does not control their content, privacy practices, security, accessibility, or availability after a user leaves this site.</p>
        </Section>

        <Section title="Policy updates">
          <p>This policy may be updated when the site&apos;s tools, customer products, analytics, advertising, forms, vendors, or legal obligations change. The effective date above should be revised when material changes are made.</p>
        </Section>

        <DisclaimerBox />
        <div className="pt-4"><Button asChild variant="soft"><Link to="/about">Back to About / Sources</Link></Button></div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
