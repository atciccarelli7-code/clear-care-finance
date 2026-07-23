import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  FileHeart,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { PAID_PRODUCTS } from "@/data/paidProducts";

const benefitsProduct = PAID_PRODUCTS.find(
  (product) => product.id === "healthcare_worker_career_benefits_decision_system",
)!;

const medicalBillProduct = PAID_PRODUCTS.find(
  (product) => product.id === "medical_bill_response_resolution_system",
)!;

const productStandards = [
  {
    icon: FileHeart,
    title: "Keep the useful foundation free",
    body: "Core explanations, official-source links, calculators, and essential action tools remain available without payment.",
  },
  {
    icon: LockKeyhole,
    title: "Keep sensitive work local",
    body: "Products are designed for local files and print. CAF does not ask users to upload paystubs, benefit statements, bills, EOBs, or medical records.",
  },
  {
    icon: FileCheck2,
    title: "Show the terms before checkout",
    body: "Price, delivery, refund, licensing, privacy, support, and accessibility expectations must be visible before any payment is collected.",
  },
  {
    icon: ShieldCheck,
    title: "State the limits plainly",
    body: "Every system organizes decisions and next actions. None replaces controlling documents, individualized professional advice, or qualified review.",
  },
] as const;

const ProductStudioPage = () => (
  <>
    <PageHero
      eyebrow="CAF product studio"
      title="Practical systems for healthcare money decisions. No mystery checkout."
      description="Community Acquired Finance turns the site's strongest free tools into focused, reusable workflows. Products move from private build to paid validation only when the files, terms, delivery, privacy, support, and evidence are ready."
    >
      <Button asChild variant="hero" size="lg">
        <Link to="/products/healthcare-worker-benefits-decision-pack">
          Review the $29 paid pilot <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/insurance/medical-bill-review-toolkit">Use the free Medical Bill Response System</Link>
      </Button>
    </PageHero>

    <div className="container min-w-0 space-y-14 py-12 md:space-y-20 md:py-16">
      <section aria-labelledby="available-products-title">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Available now</div>
          <h2 id="available-products-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Clear status, clear next action
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A public page is not the same as a finished commercial launch. Each offering below states what someone can use today and what remains unavailable.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] border border-primary/25 bg-card shadow-card">
            <div className="border-b border-border bg-primary-soft/30 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Paid-pilot interest
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground">
                  Checkout off
                </span>
              </div>
              <BriefcaseBusiness className="mt-7 h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-3xl font-bold">{benefitsProduct.validationOffer?.name}</h3>
              <p className="mt-3 text-sm font-semibold text-primary">For nurses and other employed healthcare workers</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{benefitsProduct.promise}</p>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Target price", "$29 one time"],
                  ["Format", "PDF + spreadsheet"],
                  ["Current action", "Join interest list"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                    <div className="mt-2 font-display text-lg font-bold">{value}</div>
                  </div>
                ))}
              </div>
              <ul className="grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                {[
                  "Compare two offers and annual benefits",
                  "Stress-test low-, expected-, and high-use health-plan years",
                  "Review retirement match, eligibility, and vesting",
                  "Turn unresolved facts into written HR questions",
                ].map((item) => (
                  <li key={item} className="border-l-2 border-primary/25 pl-3">{item}</li>
                ))}
              </ul>
              <Button asChild variant="hero" className="w-full sm:w-auto">
                <Link to="/products/healthcare-worker-benefits-decision-pack">
                  See the scope and representative previews <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Joining records consented interest only. No payment, reservation, or purchase obligation is created.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
            <div className="border-b border-border bg-muted/25 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-success">
                  <ReceiptText className="h-3.5 w-3.5" aria-hidden="true" />
                  Free system live
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground">
                  Expanded paid files private
                </span>
              </div>
              <ReceiptText className="mt-7 h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-3xl font-bold">{medicalBillProduct.shortName}</h3>
              <p className="mt-3 text-sm font-semibold text-primary">For patients, caregivers, spouses, and adult children</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{medicalBillProduct.promise}</p>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Current price", "Free"],
                  ["Account", "Not required"],
                  ["Current action", "Build next steps"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                    <div className="mt-2 font-display text-lg font-bold">{value}</div>
                  </div>
                ))}
              </div>
              <ul className="grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                {[
                  "Identify the document before acting",
                  "Compare an EOB with a provider bill",
                  "Prepare provider and insurer questions",
                  "Organize assistance, appeal, and escalation paths",
                ].map((item) => (
                  <li key={item} className="border-l-2 border-primary/25 pl-3">{item}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero">
                  <Link to="/insurance/medical-bill-review-toolkit">
                    Open the free system <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/tools/medical-bill-review-flow">Use the guided review flow</Link>
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The expanded commercial workbook remains private. CAF does not present private build completion as product validation or availability.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-10" aria-labelledby="product-standard-title">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Product standard</div>
          <h2 id="product-standard-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            What CAF must earn before asking for payment
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A polished page is not enough. Paid access requires a useful product, honest boundaries, controlled delivery, tested support, and evidence that the buyer understands what they are getting.
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {productStandards.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-background p-5">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="release-ladder-title">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Release ladder</div>
          <h2 id="release-ladder-title" className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Build privately. Validate truthfully. Launch deliberately.
          </h2>
          <ol className="mt-7 space-y-4">
            {[
              ["01", "Private build", "Create and quality-check the complete files without exposing masters or enabling commerce."],
              ["02", "Interest validation", "Show representative scope, a real target price, and the exact fact that no payment is collected."],
              ["03", "Operating validation", "Test checkout, receipt, delivery, refund, support, privacy, accessibility, and analytics end to end."],
              ["04", "Commercial launch", "Enable payment only after the operating gates and explicit launch approval are recorded."],
            ].map(([number, title, body]) => (
              <li key={number} className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:gap-5">
                <span className="font-display text-2xl font-bold text-primary">{number}</span>
                <div><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p></div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit rounded-[2rem] border border-primary/25 bg-primary-soft/25 p-6 shadow-card md:p-8">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">Need a broader program?</div>
          <h2 className="mt-3 font-display text-3xl font-bold">For employers and healthcare organizations</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            CAF also develops source-backed education and implementation support for organizations. Institutional work follows separate scoping, review, privacy, accessibility, and approval controls.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="hero"><Link to="/for-organizations">Review organization offerings <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/methodology">Read sources and methodology</Link></Button>
            <Button asChild variant="outline"><Link to="/contact">Contact CAF</Link></Button>
          </div>
        </aside>
      </section>
    </div>
  </>
);

export default ProductStudioPage;
