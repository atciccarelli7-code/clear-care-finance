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
      <PageHero eyebrow="Terms" title="Terms of Use" description="Plain-English boundaries for using Community Acquired Finance, its articles, calculators, customer accounts, and paid decision workspaces." />

      <div className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: July 23, 2026</p>

        <Section title="Acceptance of these terms">
          <p>By using Community Acquired Finance, you agree to these Terms of Use. If you do not agree, do not use the site or purchase a product.</p>
          <p>These terms set boundaries for an educational website and its digital products. They do not replace current official guidance, controlling plan documents, contracts, laws, regulations, checkout terms, or advice from a qualified professional.</p>
        </Section>

        <Section title="Educational use only">
          <p>Community Acquired Finance provides general educational information and decision-support organization about healthcare finance, insurance, Medicare, Medicaid, workplace benefits, retirement accounts, investing basics, hospital bills, compensation, employment tradeoffs, and related money topics.</p>
          <p>The site and paid products do not provide individualized financial, investment, tax, legal, insurance, medical, billing, employment, human-resources, or benefits advice.</p>
        </Section>

        <Section title="No official determination or professional relationship">
          <p>Site tools and paid workspaces do not enroll users, approve coverage, authorize care, decide claims, establish eligibility, determine medical necessity, calculate official tax liability, interpret a contract, or make a binding decision for an employer, insurer, retirement plan, HSA, provider, billing office, government agency, or customer.</p>
          <p>Using the site does not create a financial advisor-client, investment adviser-client, fiduciary, attorney-client, clinician-patient, insurance producer, tax professional, billing advocate, employment advisor, benefits administrator, or other professional relationship.</p>
        </Section>

        <Section title="Paid products and customer workspaces">
          <p>A paid purchase is for the product identified at checkout, delivered through the stated secure customer workspace and any included print or download outputs. A purchase is not a general payment to access the public website. Public CAF articles, glossary pages, general calculators, sources, and designated free tools remain separate from the purchased product.</p>
          <p>The Healthcare Compensation &amp; Benefits Decision Workspace uses a one-time purchase model. It does not automatically renew at launch. The customer receives continued access to the purchased edition while the service remains available and twelve months of substantive product updates from the verified purchase date. This is not a promise of indefinite lifetime updates, permanent hosting, or perpetual compatibility with every browser or device.</p>
          <p>Price, included files, access duration, update duration, support path, license scope, payment provider, and governing checkout terms must be displayed before payment. If those terms conflict with a general statement elsewhere on the site, the more specific checkout terms for that purchase control to the extent permitted by law.</p>
        </Section>

        <Section title="Checkout, payment confirmation, and account activation">
          <p>Checkout is processed by the identified third-party payment provider. Community Acquired Finance does not grant access merely because a browser reaches a success or return URL. Access is created only after server-side confirmation of a qualifying paid transaction for the correct product or through an authorized manual correction.</p>
          <p>The purchase email is used to activate and recover access. Customers are responsible for entering an email they control, maintaining access to that email, protecting one-time access links and active sessions, and promptly reporting suspected unauthorized use.</p>
          <p>Duplicate webhook deliveries do not create duplicate entitlements. Pending, failed, abandoned, mismatched, or unverified transactions do not grant access. A qualifying refund or authorized revocation may change or end access as described at checkout and by applicable law.</p>
        </Section>

        <Section title="Refunds, cancellations, and disputes">
          <p>The applicable refund eligibility, time period, procedure, exclusions, and effect on access must be disclosed at checkout before paid commerce is enabled. Community Acquired Finance does not state a refund window here because the final merchant and digital-product policy has not yet been approved and published.</p>
          <p>Until a complete refund and support policy is displayed in the live checkout flow and validated through a real test transaction and refund, the production payment endpoint remains intentionally disabled. When commerce is active, the checkout policy and applicable law govern refund requests. A completed refund may revoke the corresponding product entitlement.</p>
          <p>Customers should use the published support path before initiating a payment dispute when reasonably possible. Nothing in these terms limits non-waivable consumer rights.</p>
        </Section>

        <Section title="Product updates and versioning">
          <p>Substantive updates may correct or revise decision logic, source treatment, time-sensitive figures, modules, outputs, or material explanations. Cosmetic changes may alter wording, layout, accessibility, or performance without changing the substantive edition.</p>
          <p>The product may display an edition, product version, last substantive review date, relevant effective dates, and update history. Customers must still verify current law, plan-year limits, employer documents, contracts, networks, formularies, benefit rules, and professional guidance before acting.</p>
        </Section>

        <Section title="Customer data and prohibited information">
          <p>Do not enter protected health information, Social Security numbers, Medicare or insurance member IDs, account credentials, payment card numbers, bank details, private medical records, tax records, beneficiary details, or confidential employer documents into the site or paid workspace.</p>
          <p>Some guided tools and premium features keep notes and answer values in local browser storage. Minimal account progress may be stored as described in the Privacy Policy. Customers are responsible for the security of files they print, download, save, email, or share with a spouse, caregiver, advisor, clinician, employer, or family member.</p>
        </Section>

        <Section title="Calculator and guided-tool estimates">
          <p>Tools may use assumptions, rounded values, broad categories, incomplete inputs, and general rules. Actual results can differ because of plan language, laws, state rules, taxes, employer policies, insurance contracts, billing practices, interest rates, market performance, benefit limits, and facts not captured by the tool.</p>
          <p>Do not rely on a site result as the sole basis for a financial, medical, insurance, employment, tax, legal, billing, eligibility, authorization, compensation, or benefits decision.</p>
        </Section>

        <Section title="Account and access rules">
          <p>Customer access is for the purchaser and any use expressly permitted by the product license shown at checkout. Do not share access links, sessions, credentials, protected module content, or personalized exports in a way that circumvents the purchase terms or exposes another person&apos;s private information.</p>
          <p>Community Acquired Finance may suspend or revoke access when reasonably necessary to address a refund, chargeback, fraud, unauthorized sharing, abuse, security risk, legal obligation, or material violation of these terms. We should provide a reasonable correction path where appropriate.</p>
        </Section>

        <Section title="No emergency or medical-care instructions">
          <p>This site does not provide diagnosis, treatment, triage, or emergency medical instructions. If you believe you may have a medical emergency, contact emergency services or a qualified healthcare professional through appropriate channels.</p>
        </Section>

        <Section title="Sources, accuracy, and updates">
          <p>We aim to use current official or reputable sources, identify uncertainty, preserve the source material&apos;s limitations, and correct material errors. Information can still be incomplete, outdated, or inapplicable to a particular person, plan, state, provider, employer, role, or claim.</p>
          <p>Verify important decisions with current official sources, plan documents, agencies, insurers, benefits departments, payroll, human resources, billing entities, providers, and qualified professionals.</p>
        </Section>

        <Section title="Third-party services and links">
          <p>External links and third-party checkout, email, storage, analytics, hosting, and payment services are provided or used for defined functions. Community Acquired Finance does not control and is not responsible for third-party content, policies, security, accessibility, accuracy, availability, fees, or later changes, except to the extent responsibility cannot legally be disclaimed.</p>
        </Section>

        <Section title="Advertising, sponsorships, and conflicts">
          <p>Advertising may appear on ordinary public pages and should remain clearly separate from educational content and navigation. Authenticated paid workspaces are ad-free.</p>
          <p>Any sponsorship, affiliate, referral, or paid relationship should be disclosed and should not control calculator logic, source selection, rankings, or editorial conclusions.</p>
        </Section>

        <Section title="Intellectual property and permitted use">
          <p>Unless otherwise noted, the site&apos;s original writing, structure, design, code, educational materials, paid modules, workbooks, and exports are owned by Community Acquired Finance or its owner. A purchase grants the limited personal-use rights stated at checkout; it does not transfer ownership.</p>
          <p>You may link to public pages for personal, educational, or noncommercial reference, but may not copy, scrape, republish, sublicense, resell, distribute, expose, or create competing derivative products from substantial portions of the site or paid product without permission, except where law permits.</p>
        </Section>

        <Section title="Responsible use">
          <p>Do not use the site to violate law, interfere with operation, attempt unauthorized access, introduce malware, scrape at scale, impersonate the site, bypass a paywall, probe another customer&apos;s data, or present educational content as an official or individualized professional determination.</p>
        </Section>

        <Section title="No guarantee">
          <p>The site and products are provided as-is for educational purposes. We do not guarantee that they will be error-free, uninterrupted, complete, current, secure, indexed by a search engine, permanently available, compatible with every device, or appropriate for a specific use.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>To the fullest extent permitted by law, Community Acquired Finance and its owner are not liable for losses or damages arising from use of the site, paid products, estimates, third-party services, outdated information, technical errors, unauthorized local-file access, or decisions made after using the site. Nothing here excludes liability that cannot legally be excluded.</p>
        </Section>

        <Section title="Changes to these terms">
          <p>These terms may be updated as the site, products, providers, and legal obligations change. The effective date above should be revised when material changes are made. Material purchase terms already accepted remain subject to applicable law and the specific checkout terms for that transaction.</p>
        </Section>

        <DisclaimerBox />
        <div className="pt-4"><Button asChild variant="soft"><Link to="/about">Back to About / Sources</Link></Button></div>
      </div>
    </>
  );
};

export default TermsOfUse;
