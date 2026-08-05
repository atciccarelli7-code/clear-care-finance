import { lazy, Suspense, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackSiteEvent } from "@/lib/analytics";
import { getEvidenceSessionId } from "@/lib/firstPartyEvidence";
import { cn } from "@/lib/utils";

const OFFER_VERSION = "benefits_offer_29_v1";
const OFFER_PRICE_CENTS = 2900;
const OFFER_SOURCE = "total_compensation_comparison";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const testCheckoutDisplayEnabled = import.meta.env.VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED === "true";
const LazyPremiumTestCheckoutPanel = testCheckoutDisplayEnabled
  ? lazy(() => import("@/components/premium/PremiumTestCheckoutPanel").then(({ PremiumTestCheckoutPanel }) => ({ default: PremiumTestCheckoutPanel })))
  : null;

type InterestResult = {
  ok?: boolean;
  saved?: boolean;
  emailDelivered?: boolean;
  contactSaved?: boolean;
  warning?: string;
  code?: string;
  message?: string;
};

const EarlyAccessCommitmentForm = () => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [priceCommitment, setPriceCommitment] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    if (!priceCommitment || !emailConsent) {
      setStatus("error");
      setMessage("Confirm both statements before joining the early-access list.");
      return;
    }

    const sessionId = getEvidenceSessionId();
    if (!sessionId) {
      setStatus("error");
      setMessage("Refresh the page and try again.");
      return;
    }

    setStatus("loading");
    trackSiteEvent("benefits_offer_commitment_submit", {
      event_category: "benefits_system_validation",
      source_surface: OFFER_SOURCE,
      product_key: "healthcare-worker-benefits-decision-system",
      offer_version: OFFER_VERSION,
      price_cents: OFFER_PRICE_CENTS,
    });

    try {
      const response = await fetch("/api/benefits-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: normalizedEmail,
          emailConsent,
          priceCommitment,
          website,
          sessionId,
          offerVersion: OFFER_VERSION,
          priceCents: OFFER_PRICE_CENTS,
          source: OFFER_SOURCE,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as InterestResult;
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.message ?? "Early-access interest could not be saved. Try again in a minute.");
      }

      setStatus("success");
      setMessage(
        result.emailDelivered === false
          ? "Your $29 early-access interest is saved. Confirmation email delivery is still being finalized. No payment was collected."
          : "Your $29 early-access interest is saved. Check your inbox for confirmation. No payment was collected.",
      );
      trackSiteEvent("benefits_offer_commitment_saved", {
        event_category: "benefits_system_validation",
        source_surface: OFFER_SOURCE,
        product_key: "healthcare-worker-benefits-decision-system",
        offer_version: OFFER_VERSION,
        price_cents: OFFER_PRICE_CENTS,
      });
      setEmail("");
      setPriceCommitment(false);
      setEmailConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Early-access interest could not be saved.");
      trackSiteEvent("benefits_offer_commitment_error", {
        event_category: "benefits_system_validation",
        source_surface: OFFER_SOURCE,
        product_key: "healthcare-worker-benefits-decision-system",
        offer_version: OFFER_VERSION,
      });
    }
  };

  return (
    <section id="early-access" className="scroll-mt-28 rounded-3xl border border-primary/20 bg-primary-soft/25 p-5 shadow-card md:p-8" aria-labelledby="benefits-early-access-title">
      <div className="grid min-w-0 gap-7 lg:grid-cols-[1fr_430px] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <MailCheck className="h-4 w-4" aria-hidden="true" />
            Price-qualified early access
          </div>
          <h2 id="benefits-early-access-title" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Would you seriously consider this at $29 one time?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Joining tells CAF that the described decision-completion system may be worth $29 to you. It does not create a purchase, reservation, account, entitlement, or obligation.
          </p>
          <div className="flex items-start gap-2 rounded-2xl border border-border bg-card/80 p-4 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span>Enter only an email address. Do not send employer documents, benefit amounts, medical information, member IDs, account credentials, or payment information.</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            See the <Link to="/privacy-policy" className="font-semibold text-primary underline-offset-4 hover:underline">Privacy Policy</Link> and <Link to="/terms-of-use" className="font-semibold text-primary underline-offset-4 hover:underline">Terms of Use</Link>. You can unsubscribe through any email or request deletion through the Contact page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm" noValidate>
          <div className="space-y-2">
            <Label htmlFor="benefits-early-access-email" className="text-sm font-semibold">Email address</Label>
            <Input
              id="benefits-early-access-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="hidden" aria-hidden="true">
            <Label htmlFor="benefits-early-access-website">Website</Label>
            <Input
              id="benefits-early-access-website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={priceCommitment}
              onChange={(event) => setPriceCommitment(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary"
            />
            <span><strong className="text-foreground">Price confirmation:</strong> Based on the description above, I would seriously consider paying $29 one time if the product launches.</span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={(event) => setEmailConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary"
            />
            <span><strong className="text-foreground">Email consent:</strong> I agree to receive confirmation and product-specific early-access or launch updates from Community Acquired Finance. I can unsubscribe anytime.</span>
          </label>

          <Button type="submit" variant="hero" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Saving interest…" : "Join the $29 early-access list"}
          </Button>

          <p className="text-center text-xs font-semibold text-muted-foreground">No card. No checkout. No charge.</p>

          {message && (
            <p role="status" aria-live="polite" className={cn("text-sm font-medium", status === "success" ? "text-primary" : "text-destructive")}>{message}</p>
          )}
        </form>
      </div>
    </section>
  );
};

const TestCheckoutLoadingState = () => (
  <section className="rounded-3xl border border-sky-300 bg-sky-50 p-6 shadow-card" role="status">
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
      <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      Loading the protected Stripe test certification panel…
    </div>
  </section>
);

export const BenefitsEarlyAccessForm = () => {
  if (!LazyPremiumTestCheckoutPanel) return <EarlyAccessCommitmentForm />;
  return (
    <Suspense fallback={<TestCheckoutLoadingState />}>
      <LazyPremiumTestCheckoutPanel />
    </Suspense>
  );
};
