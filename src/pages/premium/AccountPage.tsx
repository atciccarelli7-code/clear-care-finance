import { Link } from "react-router-dom";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

export default function AccountPage() {
  const auth = usePremiumAuth();
  return (
    <main id="main-content" className="min-h-screen bg-[#f3f7f4] px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-white p-7 shadow-card md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><UserRound className="h-6 w-6" /></span>
        <h1 className="mt-5 font-display text-4xl font-bold">Account</h1>
        {auth.status === "signed_in" ? (
          <>
            <div className="mt-6 rounded-2xl border border-border bg-muted/20 p-5">
              <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Signed in</div>
              <p className="mt-2 text-sm text-muted-foreground">{auth.email}</p>
              {auth.isDevelopmentDemo && <p className="mt-3 text-xs font-semibold text-sky-800">Development-only demo; no production account exists.</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link to="/app/benefits-decision">Open decision system</Link></Button>
              <Button variant="outline" onClick={() => void auth.signOut()} disabled={auth.isDevelopmentDemo}><LogOut className="h-4 w-4" /> Sign out</Button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <p className="text-muted-foreground">{auth.message || "Sign in to view account access."}</p>
            <Button asChild className="mt-5"><Link to="/sign-in">Open sign-in</Link></Button>
          </div>
        )}
      </section>
    </main>
  );
}
