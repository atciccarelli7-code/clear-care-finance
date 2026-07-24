import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenCheck,
  CheckCircle2,
  CircleDollarSign,
  FileLock2,
  FlaskConical,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  PAID_PRODUCT_BUNDLE,
  PAID_PRODUCT_LAUNCH_GATES,
  PAID_PRODUCTS,
} from "@/data/paidProducts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusLabel = (status: string) => {
  if (status === "private_ready") return "Private build ready";
  if (status === "launch_ready") return "Approved for launch";
  return "Live";
};

const PrivatePaidProductsLabPage = () => (
  <>
    <PageHero
      eyebrow="Private product laboratory"
      title="Two complete paid systems, prepared without enabling commerce."
      description="This feature-gated workspace summarizes Community Acquired Finance’s direct-to-consumer foundations. Checkout is hard-disabled. The Benefits Decision System uses the repository’s Supabase and Stripe architecture; protected module content remains outside public assets."
    >
      <Button asChild variant="outline" size="lg">
        <Link to="/tools">Return to public tools</Link>
      </Button>
    </PageHero>

    <div className="container min-w-0 space-y-12 py-10 md:space-y-16 md:py-16">
      <section className="grid gap-4 md:grid-cols-4" aria-label="Private product safeguards">
        {[
          {
            icon: LockKeyhole,
            title: "Feature gated",
            body: "The route exists only when the private product-lab environment flag is enabled.",
          },
          {
            icon: CircleDollarSign,
            title: "Checkout disabled",
            body: "No buy, payment, or checkout action is rendered from the current product state.",
          },
          {
            icon: FileLock2,
            title: "Masters remain private",
            body: "Full paid content stays outside unrestricted public website downloads.",
          },
          {
            icon: ShieldCheck,
            title: "Free guidance protected",
            body: "Essential education, official sources, and core decision tools remain free.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-8" aria-labelledby="product-portfolio-title">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Private portfolio</div>
          <h2 id="product-portfolio-title" className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Products substantial enough to justify a one-time price
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Each system combines existing CAF decision tools with a deeper, reusable workflow, printable records, scripts, and execution controls. The paid layer adds organization and follow-through rather than withholding essential rights or basic answers.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          {PAID_PRODUCTS.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
              <div className="border-b border-border bg-primary-soft/25 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                    {statusLabel(product.status)}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground">
                    Checkout off
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold md:text-3xl">{product.name}</h3>
                <p className="mt-3 text-sm font-semibold text-primary">{product.audience}</p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.promise}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Planned standard</div>
                    <div className="mt-1 font-display text-2xl font-bold">{currency.format(product.standardPrice)}</div>
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-background px-4 py-3">
                    <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary">Launch validation</div>
                    <div className="mt-1 font-display text-2xl font-bold">{currency.format(product.launchPrice)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-6 md:p-8">
                <div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h4 className="font-display text-xl font-bold">Included deliverables</h4>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {product.includedAssets.map((asset) => (
                      <div key={asset} className="flex items-start gap-2 rounded-2xl border border-border bg-background p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-sm leading-relaxed">{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h4 className="font-display text-xl font-bold">Premium workflow</h4>
                  </div>
                  <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                    {product.premiumModules.map((module, index) => (
                      <li key={module} className="flex items-start gap-3 rounded-2xl bg-muted/25 p-3 text-sm leading-relaxed">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <span>{module}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold">Public foundation that remains free</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.publicFoundation.map((resource) => (
                      <Button key={resource.href} asChild variant="outline" size="sm">
                        <Link to={resource.href}>{resource.label} <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary-soft/20 p-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h4 className="font-bold">Launch control</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Checkout configuration is server controlled. The current catalog keeps status at <code>{product.status}</code>, checkout disabled, and the checkout URL empty.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">{product.limitations}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/20 p-6 shadow-card md:p-10" aria-labelledby="bundle-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
              Planned bundle
            </div>
            <h2 id="bundle-title" className="mt-3 font-display text-3xl font-bold">{PAID_PRODUCT_BUNDLE.name}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Both complete systems for households that need to manage a healthcare career decision and medical-cost administration. Bundle delivery remains disabled with the individual products.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Standard</div>
              <div className="mt-1 font-display text-3xl font-bold">{currency.format(PAID_PRODUCT_BUNDLE.standardPrice)}</div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background p-4">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Launch</div>
              <div className="mt-1 font-display text-3xl font-bold">{currency.format(PAID_PRODUCT_BUNDLE.launchPrice)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-10" aria-labelledby="launch-gates-title">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Release governance</div>
            <h2 id="launch-gates-title" className="mt-2 font-display text-3xl font-bold">Every gate must pass before commerce exists</h2>
          </div>
        </div>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {PAID_PRODUCT_LAUNCH_GATES.map((gate, index) => (
            <li key={gate} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
              <span className="text-sm leading-relaxed">{gate}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/25 dark:text-amber-100">
          <strong>Current decision:</strong> build and validate privately. Do not enable Stripe checkout, seed active protected content, or switch either catalog status until authentication, entitlement, refund, privacy, support, and owner-authorization gates pass.
        </div>
      </section>

      <DisclaimerBox />
    </div>
  </>
);

export default PrivatePaidProductsLabPage;
