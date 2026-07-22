import { useState, type FormEvent } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackSiteEvent } from "@/lib/analytics";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApiResult = {
  ok?: boolean;
  saved?: boolean;
  emailDelivered?: boolean;
  sequenceStatus?: string;
  warning?: string;
  error?: string;
};

type MedicalBillInterestFormProps = {
  source?: string;
  mode?: "interest" | "sequence";
};

export function MedicalBillInterestForm({
  source = "medical-bill-product-foundation",
  mode = "interest",
}: MedicalBillInterestFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isSequence = mode === "sequence";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!emailPattern.test(cleanEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setMessage(
        isSequence
          ? "Check the consent box before starting the email path."
          : "Check the consent box before joining the early-access list.",
      );
      return;
    }

    setStatus("loading");
    trackSiteEvent(isSequence ? "medical_bill_email_sequence_submit" : "premium_interest_submit", {
      event_category: "medical_bill_product",
      source,
      offer_id: "expanded_medical_bill_response_workbook",
    });

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          firstName: firstName.trim(),
          consent,
          website,
          source,
          type: isSequence ? "medical-bill-sequence" : "medical-bill-product-interest",
        }),
      });

      const result = (await response.json().catch(() => ({}))) as ApiResult;
      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result.error ?? "Signup could not be completed. Try again in a minute.");
      }

      setStatus("success");
      if (isSequence) {
        setMessage(
          result.emailDelivered === false
            ? "Your signup was saved. Email delivery is still being finalized."
            : "You are on the medical-bill list. Check your inbox for the first response email.",
        );
        trackSiteEvent("free_pack_email_signup", {
          event_category: "medical_bill_product",
          source,
        });
        trackSiteEvent("medical_bill_email_sequence_start", {
          event_category: "medical_bill_product",
          source,
          sequence_status: result.sequenceStatus ?? "first_email_only",
        });
      } else {
        setMessage(
          result.emailDelivered === false
            ? "Your interest was saved. Email delivery is still being finalized."
            : "You’re on the workbook early-access list. No payment was collected.",
        );
      }
      setEmail("");
      setFirstName("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Signup failed. Try again in a minute.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">
            {isSequence ? "Keep the response sequence for your next billing call" : "Join the workbook early-access list"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isSequence
              ? "Educational emails only. No payment and no document upload."
              : "No payment. No document upload. No individualized advice."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`medical-bill-first-name-${source}`}>First name</Label>
          <Input
            id={`medical-bill-first-name-${source}`}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Optional"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`medical-bill-email-${source}`}>Email</Label>
          <Input
            id={`medical-bill-email-${source}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor={`medical-bill-website-${source}`}>Website</Label>
        <Input
          id={`medical-bill-website-${source}`}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary"
        />
        <span>
          {isSequence
            ? "I agree to receive educational medical-bill emails from Community Acquired Finance. I can unsubscribe anytime."
            : "I agree to receive educational medical-bill organization emails and product-development updates from Community Acquired Finance. I can unsubscribe anytime."}
        </span>
      </label>

      <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>Do not send bills, account numbers, diagnoses, member IDs, claim numbers, or other protected information.</span>
      </div>

      <Button type="submit" variant="hero" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : isSequence ? "Start the medical-bill email path" : "Join early access"}
      </Button>

      {message && (
        <p role="status" aria-live="polite" className={`text-sm font-medium ${status === "success" ? "text-primary" : "text-destructive"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
