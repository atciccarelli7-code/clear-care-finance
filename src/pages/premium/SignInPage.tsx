import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { KeyRound, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

export default function SignInPage() {
  const auth = usePremiumAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    trackSiteEvent("premium_sign_in_started", { event_category: "premium_system", interaction_state: "page_view" });
  }, []);

  if (auth.status === "signed_in" && !auth.isDevelopmentDemo) return <Navigate to="/app/benefits-decision" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = await auth.requestMagicLink(email);
    setMessage(result.message);
    setBusy(false);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f3f7f4] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-lg">
        <Link to="/products/healthcare-worker-benefits-decision-system" className="text-sm font-semibold text-primary hover:underline">← Product overview</Link>
        <section className="mt-7 rounded-[2rem] border border-border bg-white p-7 shadow-card md:p-10" aria-labelledby="sign-in-heading">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><KeyRound className="h-6 w-6" /></span>
          <h1 id="sign-in-heading" className="mt-5 font-display text-4xl font-bold tracking-tight">Secure account access</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">The intended sign-in method is an email magic link. Product access is checked separately on the server after authentication.</p>

          {auth.status === "unavailable" ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5" role="status">
              <div className="flex items-center gap-2 font-bold text-amber-950"><LockKeyhole className="h-4 w-4" /> Access is not yet available</div>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">{auth.message}</p>
              <Button asChild className="mt-5"><Link to="/products/healthcare-worker-benefits-decision-system">See current availability</Link></Button>
            </div>
          ) : auth.isDevelopmentDemo ? (
            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5" role="status">
              <div className="font-bold text-sky-950">Development-only demo session</div>
              <p className="mt-2 text-sm leading-relaxed text-sky-900">No real account, payment, entitlement, or cloud workspace exists in this mode.</p>
              <Button asChild className="mt-5"><Link to="/app/benefits-decision">Open local demo</Link></Button>
            </div>
          ) : (
            <form className="mt-7 space-y-4" onSubmit={submit}>
              <label htmlFor="account-email" className="block text-sm font-semibold">Email address</label>
              <div className="flex min-h-12 items-center rounded-xl border border-border px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input id="account-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
              </div>
              <Button className="min-h-12 w-full" disabled={busy}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Email a secure sign-in link</Button>
            </form>
          )}
          {message && <p className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm" role="status" aria-live="polite">{message}</p>}
          <div className="mt-7 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            Do not send sensitive personal, medical, insurance, banking, or employer information through sign-in or support messages.
          </div>
        </section>
      </div>
    </main>
  );
}
