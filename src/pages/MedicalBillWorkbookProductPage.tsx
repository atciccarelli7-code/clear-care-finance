import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Download,
  ExternalLink,
  FileCheck2,
  LockKeyhole,
  Printer,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import {
  MEDICAL_BILL_FREE_PACK_ROUTE,
  MEDICAL_BILL_RESPONSE_SYSTEM_ROUTE,
  medicalBillWorkbook,
} from "@/data/productCatalog";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

const companionSteps = [
  "I identified the document in front of me.",
  "I checked whether the related claim is pending, processed, adjusted, or denied.",
  "I copied the next written deadline exactly.",
  "I identified the organization that owns the next action.",
  "I reduced the problem to one specific next request.",
] as const;

const freeItems = [
  "Document identification and the eight-route response system",
  "Essential rights and official-source links",
  "First checks, common mistakes, and safest next actions",
  "The 10-page Medical Bill Response Pack",
  "EOB, denial, financial-assistance, and prior-authorization explainers",
] as const;

const paidItems = [
  "32-page printable PDF and editable workbook",
  "Visit, bill, claim, and document-mapping worksheets",
  "Provider and insurer call preparation and logs",
  "Written-request, itemized-bill, and deadline templates",
  "Denial, authorization, assistance, collections, and caregiver organizers",
  "Bounded scenario pathways for common billing problems",
] as const;

const notFor = [
  "Determining the legally correct amount owed",
  "Reviewing medical coding or clinical records",
  "Negotiating with a provider or insurer for you",
  "Providing medical, legal, tax, insurance, or financial advice",
  "Guaranteeing a bill reduction, appeal result, or claim decision",
] as const;

const sourceLinks = [
  { label: "CMS Medical Bill Rights", href: "https://www.cms.gov/medical-bill-rights" },
  { label: "HealthCare.gov appeals", href: "https://www.healthcare.gov/appeal-insurance-company-decision/" },
  { label: "IRS nonprofit hospital requirements", href: "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r" },
  { label: "CFPB medical debt resources", href: "https://www.consumerfinance.gov/consumer-tools/medical-debt/" },
] as const;

const MedicalBillWorkbookProductPage = () => {
  const [completed, setCompleted] = useState<boolean[]>(() => companionSteps.map(() => false));
  const completionCount = useMemo(() => completed.filter(Boolean).length, [completed]);

  useSeo({
    title: "Expanded Medical Bill Response Workbook",
    description:
      "Preview a 32-page RN-led workbook for organizing medical bills, EOBs, calls, deadlines, assistance, denials, prior authorization, and caregiver coordination.",
    canonicalPath: medicalBillWorkbook.route,
  });

  useEffect(() => {
    trackSiteEvent("medical_bill_product_view", {
      event_category: "medical_bill_product",
      product_id: medicalBillWorkbook.id,
      checkout_state: medicalBillWorkbook.checkoutEnabled ? "enabled" : "interest_only",
    });
  }, []);

  const toggleStep = (index: number) => {
    setCompleted((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)));
  };

  const resetCompanion = () => setCompleted(companionSteps.map(() => false));

  const printCompanion = () => {
    trackSiteEvent("print_or_save_action", {
      event_category: "medical_bill_product",
      action_type: "browser_companion_print",
    });
    window.print();
  };

  const openFreePack = () => {
    trackSiteEvent("free_pack_download", {
      event_category: "medical_bill_product",
      source_surface: "product_page",
      asset_id: "medical_bill_response_pack",
    });
    window.open(MEDICAL_BILL_FREE_PACK_ROUTE, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <PageHero
        eyebrow="Optional organization upgrade"
        title="Expanded Medical Bill Response Workbook"
        description="A 32-page RN-led system for keeping bills, EOBs, calls, deadlines, written requests, assistance records, and caregiver handoffs organized—without putting essential guidance behind a paywall."
      >
        {medicalBillWorkbook.checkoutEnabled ? (
          <Button asChild variant="hero" size="lg">
            <a
              href={medicalBillWorkbook.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackSiteEvent("premium_checkout_start", {
                  event_category: "medical_bill_product",
                  product_id: medicalBillWorkbook.id,
                  price_usd: medicalBillWorkbook.priceUsd,
                })
              }
            >
              Buy securely for {medicalBillWorkbook.priceLabel.replace(" one-time", "")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button asChild variant="hero" size="lg">
            <a href="#launch-list">
              Join the launch list <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        )}
        <Button type="button" variant="outline" size="lg" onClick={openFreePack}>
          <Download className="h-4 w-4" /> Keep using the free pack
        </Button>
      </PageHero>

      <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-6 shadow-card md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Launch price test</div>
            <div className="mt-3 font-display text-5xl font-bold text-foreground">$24</div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">One-time purchase. No subscription.</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              This price is intentionally conservative while Community Acquired Finance validates whether readers value a deeper execution system. It is not a discount countdown and will not be presented with artificial scarcity.
            </p>
            <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Current checkout status:</strong>{" "}
              {medicalBillWorkbook.checkoutEnabled
                ? "A secure hosted checkout is configured. Card details are not collected by Community Acquired Finance."
                : "Checkout is not active. Joining the launch list does not create a purchase or payment obligation."}
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-3xl font-bold">The free system stays complete.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              The paid product adds organization and repeatable execution. It does not remove essential explanations, official sources, or safety guidance from the free site.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-muted/20 p-5">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Always free
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {freeItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-primary/20 bg-primary-soft/25 p-5">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <BookOpenCheck className="h-5 w-5 text-primary" /> Workbook value
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {paidItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="Representative preview"
            title="See the system before deciding"
            description="These six representative pages show the workbook’s structure. The public preview does not expose the full paid master file."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {medicalBillWorkbook.previewPages.map((page) => (
              <article
                key={page.number}
                className="group rounded-[1.75rem] border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover"
                onMouseEnter={() =>
                  trackSiteEvent("premium_product_preview", {
                    event_category: "medical_bill_product",
                    product_id: medicalBillWorkbook.id,
                    preview_page: page.number,
                  })
                }
              >
                <div className="rounded-2xl border border-border bg-[#fbfaf6] p-4">
                  <div className="h-2 w-20 rounded-full bg-primary/80" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-foreground/80" />
                  <div className="mt-2 h-2 w-full rounded bg-muted-foreground/20" />
                  <div className="mt-1.5 h-2 w-5/6 rounded bg-muted-foreground/20" />
                  <div className="mt-5 grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-8 rounded-sm border border-border ${index % 3 === 0 ? "bg-primary-soft/50" : "bg-white"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary">Page {page.number}</div>
                <h3 className="mt-2 font-display text-xl font-bold">{page.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{page.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            centered
            eyebrow="32-page scope"
            title="Built around the work people actually have to do"
            description="The workbook is organized by workflow rather than medical-billing vocabulary."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {medicalBillWorkbook.sections.map((section) => (
              <article key={section.title} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-2xl font-bold">{section.title}</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8 print:border-0 print:shadow-none">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Free browser companion</div>
              <h2 className="mt-2 font-display text-3xl font-bold">Reduce the issue to one next action</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                This checklist stays in your browser only. It does not request names, diagnoses, providers, claim numbers, bill amounts, or document text.
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button type="button" variant="outline" onClick={resetCompanion}>
                <RefreshCcw className="h-4 w-4" /> Reset
              </Button>
              <Button type="button" variant="outline" onClick={printCompanion}>
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {companionSteps.map((step, index) => (
              <label
                key={step}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/15 p-4 text-sm leading-relaxed"
              >
                <input
                  type="checkbox"
                  checked={completed[index]}
                  onChange={() => toggleStep(index)}
                  className="mt-0.5 h-5 w-5 accent-primary"
                />
                <span className={completed[index] ? "text-muted-foreground line-through" : "text-foreground"}>{step}</span>
              </label>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-primary-soft/35 p-4 text-sm font-semibold">
            {completionCount} of {companionSteps.length} control points documented.
          </div>
        </section>

        <section id="launch-list" className="scroll-mt-24 rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <LockKeyhole className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold">
                {medicalBillWorkbook.checkoutEnabled ? "Secure checkout is available" : "Join the product-validation list"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {medicalBillWorkbook.checkoutEnabled
                  ? "Checkout is handled by an external hosted provider. Community Acquired Finance does not collect or store payment-card details."
                  : "The workbook master and product experience are complete, but no payment processor has been authorized. Join the list to receive the launch notice and help validate demand without entering payment information."}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                No bill details, diagnoses, provider names, insurance information, or protected health information should be submitted.
              </p>
            </div>
            {medicalBillWorkbook.checkoutEnabled ? (
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="font-display text-4xl font-bold">{medicalBillWorkbook.priceLabel}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Final delivery, support, and refund terms are displayed before payment. The hosted provider supplies the receipt and secure delivery path.
                </p>
                <Button asChild variant="hero" size="lg" className="mt-5 w-full">
                  <a
                    href={medicalBillWorkbook.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackSiteEvent("premium_checkout_start", {
                        event_category: "medical_bill_product",
                        product_id: medicalBillWorkbook.id,
                        price_usd: medicalBillWorkbook.priceUsd,
                      })
                    }
                  >
                    Continue to secure checkout <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <NewsletterSignup
                source="medical-bill-workbook-product-page"
                emailType="medical-bill-product-interest"
                title="Get the launch notice"
                description="One confirmation email, then low-frequency updates about this workbook and related medical-bill tools."
                buttonLabel="Join the launch list"
                successMessage="You are on the workbook launch list. No payment was collected."
                limitedSuccessMessage="Your interest was saved. Email delivery is still pending external sender verification."
              />
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-2xl font-bold">Who this is not for</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {notFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1 text-primary">—</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-2xl font-bold">Refund and delivery standard</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              No purchase is currently available unless the secure checkout button is visible. At launch, the checkout page must display the controlling delivery and refund terms before payment. The planned minimum policy is a full refund for duplicate purchases, inaccessible or corrupted files, or a product that materially differs from the displayed description when reported within seven days.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Personal and household use only. Redistribution, resale, and institutional deployment require separate written permission.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-muted/20 p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Controlling sources remain outside the product</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Rules and processes change. The workbook routes users to current official sources instead of presenting itself as the final authority.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {sourceLinks.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-smooth hover:border-primary/40"
                onClick={() =>
                  trackSiteEvent("official_source_click", {
                    event_category: "medical_bill_product",
                    resource_id: source.label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
                  })
                }
              >
                {source.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </section>

        <DisclaimerBox>
          Educational organization tool only. It does not provide individualized medical, legal, tax, insurance, coding, credit, collection, or financial advice. It does not determine coverage, liability, collectibility, appeal success, or what a person owes. Review scope: RN-led patient-education clarity and comparison against the linked official sources; not independent legal or medical review.
        </DisclaimerBox>

        <div className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="outline">
            <Link to={MEDICAL_BILL_RESPONSE_SYSTEM_ROUTE}>Return to the free response system</Link>
          </Button>
          <div className="flex gap-4 text-sm font-semibold">
            <Link to="/terms-of-use" className="hover:text-primary">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-primary">Privacy</Link>
            <Link to="/contact" className="hover:text-primary">Corrections and support</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalBillWorkbookProductPage;
