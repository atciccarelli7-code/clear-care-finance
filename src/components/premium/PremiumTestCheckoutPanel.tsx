// Nonproduction Stripe certification surface. It is intentionally not imported by the public pre-commerce offer.
import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, LoaderCircle, LockKeyhole, ShieldCheck, TestTube2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { createCheckoutSession, PremiumApiError } from "@/premium/apiClient";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";
import type { PremiumProductKey } from "@/premium/contracts";

const checkoutErrorMessage = (error: unknown) => {
  if (error instanceof PremiumApiError) {
    if (error.code === "authentication_required") return "Sign in before opening Stripe test Checkout.";
    if (error.code === "checkout_disabled") return "Test Checkout is not enabled on the server.";
    if (error.code === "stripe_configuration_unavailable") return "Stripe test configuration is incomplete.";
    return error.message;
  }
  return "Stripe test Checkout could not be opened.";
};

export const PremiumTestCheckoutPanel = ({
  productKey = "healthcare-worker-benefits-decision-system",
  productName = "Healthcare Worker Benefits Decision System",
}: {
  productKey?: PremiumProductKey;
  productName?: string;
}) => {
  const auth = usePremiumAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const startCheckout = async () => {
    if (!auth.accessToken || auth.status !== "signed_in" || auth.isDevelopmentDemo) return;
    setStatus("loading");
    setMessage("");
    trackSiteEvent("premium_test_checkout_started", {
      event_category: "premium_system",
      product_key: productKey,
      price_cents: 2900,
      stripe_environment: "test",
    });
    trackSiteEvent("checkout_start", { event_category: "premium_system", product_key: productKey, stripe_environment: "test" });
    try {
      const checkoutUrl = await createCheckoutSession(auth.accessToken, productKey);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setStatus("error");
      setMessage(checkoutErrorMessage(error));
      trackSiteEvent("premium_test_checkout_error", {
        event_category: "premium_system",
        product_key: productKey,
        error_code: error instanceof PremiumApiError ? error.code || "api_error" : "unknown",
      });
    }
  };

  return (
    <section id="test-purchase" className="scroll-mt-28 rounded-3xl border border-sky-300 bg-sky-50 p-5 shadow-card md:p-8" aria-labelledby="premium-test-checkout-title">
      <div className="grid min-w-0 gap-7 lg:grid-cols-[1fr_430px] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-800">
            <TestTube2 className="h-4 w-4" aria-hidden="true" />
            Protected test-mode certification
          </div>
          <h2 id="premium-test-checkout-title" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Certify the $29 {productName} purchase and entitlement flow
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 md:text-base">
            This panel appears only when a protected preview explicitly enables the browser test flag. Stripe must remain in test mode, so no real card can be charged and no production purchase is created.
          </p>
          <div className="flex items-start gap-2 rounded-2xl border border-sky-200 bg-white/80 p-4 text-sm leading-relaxed text-slate-700">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-800" aria-hidden="true" />
            <span>CAF receives Stripe customer and transaction references needed for entitlement processing. Card entry remains on Stripe-hosted Checkout; CAF does not receive or store the card number.</span>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
            <li>• One-time test price: <strong>$29</strong></li>
            <li>• Account required before Checkout</li>
            <li>• Verified webhook grants a <code>test</code> entitlement</li>
            <li>• Refund and revocation must remove access during certification</li>
          </ul>
        </div>

        <div className="min-w-0 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          {auth.status === "loading" ? (
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700" role="status">
              <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Checking the test account session…
            </div>
          ) : auth.status === "unavailable" ? (
            <div role="status">
              <div className="flex items-center gap-2 font-bold text-slate-900"><LockKeyhole className="h-4 w-4" /> Test account service unavailable</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">Authentication is not configured for this deployment. The server will not create a Checkout session.</p>
            </div>
          ) : auth.isDevelopmentDemo ? (
            <div role="status">
              <div className="flex items-center gap-2 font-bold text-slate-900"><LockKeyhole className="h-4 w-4" /> Local demo cannot purchase</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">Development-demo sessions have no real account, Stripe customer, entitlement, or cloud workspace.</p>
            </div>
          ) : auth.status === "signed_out" ? (
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900"><LockKeyhole className="h-4 w-4" /> Sign in before the test purchase</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">The magic link returns to the protected workspace. After sign-in, return to this protected preview to continue the test purchase.</p>
              <Button asChild className="mt-5 w-full"><Link to="/sign-in" state={{ productKey }}>Sign in for test Checkout</Link></Button>
            </div>
          ) : (
            <div>
              <div className="font-bold text-slate-900">Signed in as {auth.email || "test account"}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">The server—not this page—selects the product, Stripe price, success URL, cancel URL, and entitlement metadata.</p>
              <Button type="button" className="mt-5 w-full" onClick={() => void startCheckout()} disabled={status === "loading"}>
                {status === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
                {status === "loading" ? "Opening Stripe test Checkout…" : "Open Stripe test Checkout — $29"}
              </Button>
            </div>
          )}
          <p className="mt-4 text-center text-xs font-semibold text-sky-900">Test mode only · No real charge · No production access</p>
          {message && <p className="mt-4 text-sm font-medium text-destructive" role="alert">{message}</p>}
        </div>
      </div>
    </section>
  );
};
