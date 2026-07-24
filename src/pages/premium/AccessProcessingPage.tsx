import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, CircleX, LoaderCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccessStatus } from "@/premium/apiClient";
import type { AccessStatus } from "@/premium/contracts";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

export default function AccessProcessingPage() {
  const auth = usePremiumAuth();
  const [status, setStatus] = useState<AccessStatus>("processing");

  useEffect(() => {
    if (auth.status === "unavailable") {
      setStatus("configuration_unavailable");
      return undefined;
    }
    if (auth.status !== "signed_in" || !auth.accessToken || auth.isDevelopmentDemo) {
      setStatus(auth.isDevelopmentDemo ? "configuration_unavailable" : "signed_out");
      return undefined;
    }
    let active = true;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const next = await getAccessStatus(auth.accessToken);
        if (active) setStatus(next);
        if (active && next === "processing" && attempts < 20) window.setTimeout(check, 3000);
      } catch {
        if (active) setStatus("configuration_unavailable");
      }
    };
    void check();
    return () => { active = false; };
  }, [auth.accessToken, auth.isDevelopmentDemo, auth.status]);

  const displays: Record<AccessStatus, { icon: typeof LoaderCircle; title: string; body: string }> = {
    processing: { icon: LoaderCircle, title: "Access is processing", body: "The server has not confirmed a valid entitlement yet. This page checks again automatically." },
    active: { icon: CircleCheck, title: "Access granted", body: "The verified entitlement is active. You can open the decision system." },
    not_purchased: { icon: CircleX, title: "Payment incomplete", body: "No successful verified purchase is attached to this account." },
    revoked: { icon: CircleX, title: "Access is not active", body: "The entitlement has been revoked or refunded." },
    signed_out: { icon: ShieldAlert, title: "Sign in required", body: "Sign in with the account associated with the purchase before checking access." },
    configuration_unavailable: { icon: ShieldAlert, title: "Access service unavailable", body: "Checkout and entitlement activation are not currently configured." },
  };
  const display = displays[status];
  const Icon = display.icon;

  return (
    <main id="main-content" className="grid min-h-screen place-items-center bg-[#f3f7f4] px-4 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-border bg-white p-8 text-center shadow-card" aria-live="polite">
        <Icon className={`mx-auto h-12 w-12 text-primary ${status === "processing" ? "animate-spin motion-reduce:animate-none" : ""}`} />
        <h1 className="mt-5 font-display text-3xl font-bold">{display.title}</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">{display.body}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {status === "active" && <Button asChild><Link to="/app/benefits-decision">Open system</Link></Button>}
          {status === "signed_out" && <Button asChild><Link to="/sign-in">Sign in</Link></Button>}
          <Button asChild variant="outline"><Link to="/contact">Contact support</Link></Button>
        </div>
      </section>
    </main>
  );
}
