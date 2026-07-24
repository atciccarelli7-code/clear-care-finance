import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, LoaderCircle, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccessStatus, PremiumApiError } from "../apiClient.js";
import type { AccessStatus } from "../contracts.js";
import { usePremiumAuth } from "./AuthProvider.js";

const StateCard = ({ icon: Icon, title, body, action }: { icon: typeof LockKeyhole; title: string; body: string; action?: ReactNode }) => (
  <main id="main-content" className="grid min-h-screen place-items-center bg-[#f3f7f4] px-4 py-12">
    <section className="w-full max-w-xl rounded-[2rem] border border-border bg-white p-7 shadow-card md:p-10" aria-live="polite">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-6 w-6" /></span>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
      <p className="mt-7 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Community Acquired Finance never grants product access from a browser flag, URL parameter, or payment-success page.
      </p>
    </section>
  </main>
);

export const ProtectedPremiumRoute = ({ children }: { children: ReactNode }) => {
  const auth = usePremiumAuth();
  const location = useLocation();
  const [access, setAccess] = useState<AccessStatus | "loading">("loading");

  useEffect(() => {
    if (auth.status === "loading") return;
    if (auth.isDevelopmentDemo) {
      setAccess("active");
      return;
    }
    if (auth.status === "unavailable") {
      setAccess("configuration_unavailable");
      return;
    }
    if (auth.status === "signed_out" || !auth.accessToken) {
      setAccess("signed_out");
      return;
    }
    let active = true;
    void getAccessStatus(auth.accessToken)
      .then((status) => active && setAccess(status))
      .catch((error) => {
        if (!active) return;
        setAccess(error instanceof PremiumApiError && error.status === 401 ? "signed_out" : "configuration_unavailable");
      });
    return () => {
      active = false;
    };
  }, [auth.accessToken, auth.isDevelopmentDemo, auth.status]);

  if (auth.status === "loading" || access === "loading") {
    return <StateCard icon={LoaderCircle} title="Checking secure access" body="Verifying the account and product entitlement…" />;
  }
  if (access === "configuration_unavailable") {
    return <StateCard icon={AlertTriangle} title="Access is not yet available" body={auth.message || "Secure authentication and entitlement services are being prepared. No premium information is available from this route."} action={<Button asChild><Link to="/products/healthcare-worker-benefits-decision-system">View product status</Link></Button>} />;
  }
  if (access === "signed_out") {
    return <StateCard icon={LockKeyhole} title="Sign in to continue" body="This application requires a verified account and product entitlement." action={<Button asChild><Link to="/sign-in" state={{ from: location.pathname }}>Open secure sign-in</Link></Button>} />;
  }
  if (access === "processing") {
    return <StateCard icon={LoaderCircle} title="Access is processing" body="A verified payment event has not finished creating the entitlement. This page will not unlock until the server confirms access." action={<Button asChild><Link to="/access-processing">Check access status</Link></Button>} />;
  }
  if (access === "revoked") {
    return <StateCard icon={AlertTriangle} title="Access is not active" body="This entitlement has been revoked or refunded. Contact support if you believe this is an error." action={<Button asChild><Link to="/contact">Contact support</Link></Button>} />;
  }
  if (access === "not_purchased") {
    return <StateCard icon={LockKeyhole} title="Product access is required" body="No active entitlement is attached to this account. Checkout is not currently available." action={<Button asChild><Link to="/products/healthcare-worker-benefits-decision-system">Review current availability</Link></Button>} />;
  }
  return <>{children}</>;
};
