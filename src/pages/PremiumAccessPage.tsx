import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, KeyRound, LockKeyhole, Mail, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";

const PRODUCT_ID = "healthcare_compensation_benefits_decision_book";
const states: Record<string, { title: string; message: string }> = {
  purchased: { title: "Payment received", message: "Your purchase is confirmed only after the secure payment webhook creates your entitlement. Enter the checkout email to receive a one-time access link." },
  expired: { title: "That access link expired", message: "Request a new one-time link below. Access links expire after 15 minutes and can be used once." },
  "purchase-required": { title: "No active product access was found", message: "Sign in with the same email used at checkout. If the purchase was recent, the payment webhook may still be processing." },
  unavailable: { title: "Secure access is not configured", message: "The workspace remains closed until account storage and email delivery are operational." },
};

type SessionState = { signedIn: boolean; hasAccess?: boolean; commerceReady?: boolean; emailMasked?: string; accessStatus?: string };

export default function PremiumAccessPage() {
  const location = useLocation();
  const stateName = new URLSearchParams(location.search).get("state") || "";
  const notice = states[stateName];
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<SessionState | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.premiumRoute = "true";
    const robots = document.querySelector('meta[name="robots"]') || document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }));
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    void fetch("/api/premium-session", { credentials: "include", cache: "no-store" })
      .then((response) => response.json())
      .then((payload: SessionState) => setSession(payload))
      .catch(() => setSession({ signedIn: false, commerceReady: false }));
    trackSiteEvent("premium_access_page_viewed", { event_category: "premium", product_id: PRODUCT_ID });
    return () => { delete document.documentElement.dataset.premiumRoute; };
  }, []);

  const requestAccess = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/premium-magic-link", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      setMessage(payload.message || payload.error || "Check your email for a secure access link.");
      trackSiteEvent("premium_access_recovery_attempted", { event_category: "premium", product_id: PRODUCT_ID, output_type: response.ok ? "accepted" : "error" });
    } catch {
      setMessage("The access request could not be completed. Try again later.");
    } finally {
      setBusy(false);
    }
  };

  const beginCheckout = async () => {
    setCheckoutBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/premium-checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.checkoutUrl) {
        setMessage(payload.error || "Secure checkout is not active yet.");
        return;
      }
      trackSiteEvent("premium_checkout_initiated", { event_category: "premium", product_id: PRODUCT_ID });
      window.location.assign(payload.checkoutUrl);
    } catch {
      setMessage("Secure checkout could not be opened.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  const resetWorkspaceData = async () => {
    const confirmed = window.confirm("Delete synchronized module progress and private notes stored in this browser? Product access and purchase records will remain active.");
    if (!confirmed) return;
    setResetBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/premium-workspace", { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error();
      Object.keys(window.localStorage).filter((key) => key.startsWith(`caf-premium-note:${PRODUCT_ID}:`) || key === `caf-premium-visit:${PRODUCT_ID}`).forEach((key) => window.localStorage.removeItem(key));
      setMessage("Synchronized progress and this browser's private workspace notes were deleted. Purchase access was not changed.");
      trackSiteEvent("premium_progress_deleted", { event_category: "premium", product_id: PRODUCT_ID });
    } catch {
      setMessage("Workspace data could not be deleted. Try again after signing in with active access.");
    } finally {
      setResetBusy(false);
    }
  };

  return (
    <main className="bg-[#f4f6f2] py-10 md:py-16">
      <div className="container max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/products/healthcare-worker-benefits-decision-pack" className="text-sm font-semibold text-primary hover:underline">← Product overview</Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" /> Secure customer access</div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr]">
          <section className="rounded-[2rem] border border-border bg-[#073b2d] p-7 text-white shadow-card md:p-10">
            <div className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Community Acquired Finance private client workspace</div>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">Healthcare Compensation & Benefits Decision Workspace</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50/85 md:text-lg">A calm, documented system for evaluating pay, medical coverage, retirement, controlled time, leave, protection benefits, repayment risk, and career fit.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["One-time purchase", "No automatic renewal", "Twelve months of product updates", "No advertising inside the workspace", "Continued access to the purchased edition", "Print and save-to-PDF tools"].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" /><span>{item}</span></div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-emerald-200/20 bg-black/10 p-5 text-sm leading-relaxed text-emerald-50/80">
              <strong className="text-white">Privacy boundary:</strong> calculator inputs and free-text notes remain in your browser. The account stores only product access, module completion, last-viewed module, and generic task completion. Do not enter Social Security numbers, account IDs, medical records, banking credentials, or employer documents.
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-white p-6 shadow-card md:p-8" aria-labelledby="access-heading">
            {notice && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><div className="font-bold">{notice.title}</div><p className="mt-1 leading-relaxed">{notice.message}</p></div>}
            {session?.hasAccess && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="font-bold text-emerald-950">Active access · {session.emailMasked}</div>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900">Your verified entitlement is active. Open the workspace or manage the minimal saved state below.</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row"><Button asChild><Link to="/premium/healthcare-compensation-benefits">Open workspace <ArrowRight className="h-4 w-4" /></Link></Button><Button variant="outline" onClick={resetWorkspaceData} disabled={resetBusy}>{resetBusy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete saved progress</Button></div>
              </div>
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><KeyRound className="h-6 w-6" /></div>
            <h2 id="access-heading" className="mt-5 font-display text-3xl font-bold tracking-tight">Open or recover your workspace</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Use the exact email used at checkout. For privacy, the response is the same whether or not an account exists.</p>

            <form className="mt-6 space-y-4" onSubmit={requestAccess}>
              <label className="block space-y-2" htmlFor="premium-email">
                <span className="text-sm font-semibold">Purchase email</span>
                <span className="flex items-center rounded-xl border border-border bg-background px-3 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <input id="premium-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="you@example.com" />
                </span>
              </label>
              <Button type="submit" className="min-h-12 w-full" disabled={busy}>{busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Email a secure access link</Button>
            </form>

            {message && <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed" role="status" aria-live="polite">{message}</div>}

            <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground"><span className="h-px flex-1 bg-border" /> Need to purchase? <span className="h-px flex-1 bg-border" /></div>
            <Button type="button" variant="outline" className="min-h-12 w-full" onClick={beginCheckout} disabled={checkoutBusy}>{checkoutBusy ? <RefreshCw className="h-4 w-4 animate-spin" /> : null} Open secure one-time checkout <ArrowRight className="h-4 w-4" /></Button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Checkout remains unavailable until CAF’s merchant, entitlement storage, webhook, refund, support, and production validation gates are active. Reaching a success page never grants access by itself.</p>

            {session?.signedIn && !session.hasAccess && <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm">Signed in as {session.emailMasked}, but no active entitlement is attached to this account.</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
