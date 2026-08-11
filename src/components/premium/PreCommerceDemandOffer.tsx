import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, FolderSync, MailCheck, Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getEvidenceSessionId,
  getPreCommerceEvidenceClass,
  recordPreCommerceCommitmentStarted,
  recordPreCommerceOfferEngagement,
  recordPreCommerceOfferView,
} from "@/lib/firstPartyEvidence";
import { BENEFITS_WORKSPACE_OFFER } from "@/lib/preCommerceOfferContract";
import { PRIVACY_CONSENT_CHANGED_EVENT } from "@/lib/privacyConsent";
import { cn } from "@/lib/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CommitmentResult = {
  ok?: boolean;
  saved?: boolean;
  emailDelivered?: boolean;
  message?: string;
};

const freeValue = [
  "The complete eight-stage browser-local open-enrollment workflow",
  "Two-medical-plan comparison, visible unknowns, and verification checklist",
  "Benefits Decision Brief, printing, and official-source verification",
];

const proposedPremiumValue = [
  "Account-based saving across devices and multiple named decision workspaces",
  "Deeper two-option comparison across compensation, benefits, health plans, retirement, and schedule",
  "A structured evidence ledger and consolidated advanced Decision Brief",
];

export const PreCommerceDemandOffer = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [priceCommitment, setPriceCommitment] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const recordView = () => recordPreCommerceOfferView();
    recordView();
    window.addEventListener(PRIVACY_CONSENT_CHANGED_EVENT, recordView);
    return () => window.removeEventListener(PRIVACY_CONSENT_CHANGED_EVENT, recordView);
  }, []);

  const openDetails = () => {
    setDetailsOpen(true);
    recordPreCommerceOfferEngagement();
  };

  const openCommitment = () => {
    setFormOpen(true);
    recordPreCommerceCommitmentStarted();
  };

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
      setMessage("Confirm the price statement and product-specific email consent.");
      return;
    }

    const sessionId = getEvidenceSessionId();
    if (!sessionId) {
      setStatus("error");
      setMessage("Refresh the page and try again.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/precommerce-commitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          offerKey: BENEFITS_WORKSPACE_OFFER.offerKey,
          email: normalizedEmail,
          emailConsent,
          priceCommitment,
          sessionId,
          evidenceClass: getPreCommerceEvidenceClass(),
          website,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as CommitmentResult;
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.message ?? "Your price-qualified interest could not be recorded. Try again in a minute.");
      }

      setStatus("success");
      setMessage(
        result.emailDelivered === false
          ? "Your price-qualified stated intent is recorded. No payment was collected; confirmation email delivery is still being finalized."
          : "Your price-qualified stated intent is recorded. Check your inbox for confirmation. No payment was collected.",
      );
      setEmail("");
      setPriceCommitment(false);
      setEmailConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your price-qualified interest could not be recorded.");
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-primary/25 bg-primary-soft/20 p-5 shadow-card print:hidden md:p-7" aria-labelledby="precommerce-offer-title">
      <div className="flex items-start gap-3">
        <FolderSync className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Optional paid-workspace research</div>
          <h5 id="precommerce-offer-title" className="mt-2 font-display text-2xl font-bold">Would a $29 one-time Benefits Decision Workspace make future decisions easier?</h5>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The decision plan above remains free. CAF is testing whether a separate account-based workspace for saved, repeat, and deeper comparisons would be worth paying for.
          </p>
        </div>
      </div>

      {!detailsOpen ? (
        <div className="mt-5">
          <Button type="button" variant="outline" onClick={openDetails} aria-expanded="false">
            Review exactly what $29 would add <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">No card. No checkout. No charge. No reservation. No obligation.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-950"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />Free today and staying free</div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-emerald-950">{freeValue.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-background p-5">
              <div className="flex items-center gap-2 text-sm font-bold"><Scale className="h-5 w-5 text-primary" aria-hidden="true" />Proposed $29 workspace</div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">{proposedPremiumValue.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span>This describes a proposed product, not something available to buy. It would not submit elections or replace official employer, carrier, plan, tax, legal, medical, or investment guidance.</span>
          </div>

          {!formOpen ? (
            <div>
              <Button type="button" onClick={openCommitment} aria-expanded="false">I would seriously consider this at $29</Button>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Opening the form is not a commitment and does not reserve access.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid min-w-0 gap-5 rounded-2xl border border-border bg-background p-5 lg:grid-cols-[1fr_1.2fr]" noValidate>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold"><MailCheck className="h-5 w-5 text-primary" aria-hidden="true" />Record price-qualified stated intent</div>
                <div className="space-y-2">
                  <Label htmlFor="precommerce-email">Email address</Label>
                  <Input id="precommerce-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required />
                </div>
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="precommerce-website">Website</Label>
                  <Input id="precommerce-website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">Enter only an email address. Do not send plan, employer, medical, financial, account, or payment information.</p>
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" checked={priceCommitment} onChange={(event) => setPriceCommitment(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary" />
                  <span><strong className="text-foreground">Price confirmation:</strong> Based on the workspace described here, I would seriously consider paying $29 one time if it launches.</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" checked={emailConsent} onChange={(event) => setEmailConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary" />
                  <span><strong className="text-foreground">Separate email consent:</strong> I agree to receive confirmation and product-specific follow-up about this Benefits Decision Workspace. I can unsubscribe anytime.</span>
                </label>
                <Button type="submit" className="w-full" disabled={status === "loading"}>{status === "loading" ? "Recording stated intent…" : "Record my price-qualified interest"}</Button>
                <p className="text-center text-xs font-semibold text-muted-foreground">No card. No checkout. No charge. No purchase or reservation.</p>
                {message && <p role="status" aria-live="polite" className={cn("text-sm font-medium", status === "success" ? "text-primary" : "text-destructive")}>{message}</p>}
                <p className="text-xs leading-relaxed text-muted-foreground">See the <Link to="/privacy-policy" className="font-semibold text-primary underline-offset-4 hover:underline">Privacy Policy</Link>. This is stated intent, not confirmed willingness to pay or revenue.</p>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};
