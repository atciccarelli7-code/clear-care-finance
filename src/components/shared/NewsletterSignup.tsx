import { useState, type FormEvent } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackSiteEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type NewsletterEmailType =
  | "newsletter"
  | "medical-bill-sequence"
  | "medical-bill-product-interest"
  | "benefits-system-interest";

type NewsletterSignupProps = {
  className?: string;
  compact?: boolean;
  source?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  emailType?: NewsletterEmailType;
  successMessage?: string;
  limitedSuccessMessage?: string;
};

type NewsletterSignupResult = {
  ok?: boolean;
  saved?: boolean;
  emailDelivered?: boolean;
  sequenceStatus?: "not_applicable" | "first_email_only" | "provider_automation_required";
  warning?: string;
  error?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trackNewsletterEvent = (
  eventName: string,
  source: string,
  emailType: NewsletterEmailType,
) =>
  trackSiteEvent(eventName, {
    event_category:
      emailType === "newsletter"
        ? "newsletter"
        : emailType === "benefits-system-interest"
          ? "benefits_system_validation"
          : "medical_bill_product",
    source,
    email_type: emailType,
  });

export function NewsletterSignup({
  className,
  compact = false,
  source = "site",
  title = "Get the Monthly Money Map",
  description = "One practical monthly email for healthcare workers and patients trying to make better decisions about paychecks, benefits, insurance, debt, and healthcare costs.",
  buttonLabel = "Join the monthly list",
  emailType = "newsletter",
  successMessage,
  limitedSuccessMessage,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const displayDescription = description.replace(/\bweekly\b/gi, "monthly");
  const emailLabel = emailType === "newsletter"
    ? "Monthly email"
    : emailType === "benefits-system-interest"
      ? "Early-access updates"
      : "Medical-bill email";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    trackNewsletterEvent("newsletter_signup_submit", source, emailType);

    const cleanEmail = email.trim().toLowerCase();
    if (!emailPattern.test(cleanEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      trackNewsletterEvent("newsletter_signup_error", source, emailType);
      return;
    }

    if (!consent) {
      setStatus("error");
      setMessage("Check the consent box before signing up.");
      trackNewsletterEvent("newsletter_signup_error", source, emailType);
      return;
    }

    setStatus("loading");

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
          type: emailType,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as NewsletterSignupResult;

      if (!response.ok || result.ok !== true || result.saved !== true) {
        throw new Error(result?.error ?? "Signup could not be completed. Try again in a minute.");
      }

      setStatus("success");
      const defaultSuccess =
        emailType === "medical-bill-sequence"
          ? "You are on the medical-bill list. Check your inbox for the first response-system email."
          : emailType === "medical-bill-product-interest"
            ? "You are on the workbook launch list. No payment was collected."
            : emailType === "benefits-system-interest"
              ? "You are on the early-access list. No payment was collected."
            : "You are in. Check your inbox for the Healthcare Worker Money Map.";
      const defaultLimited =
        emailType === "medical-bill-product-interest"
          ? "Your workbook interest was saved. Email delivery is still pending external sender verification."
          : emailType === "benefits-system-interest"
            ? "Your early-access interest was saved. Email delivery is still pending external sender verification."
          : "You are on the list. Welcome email delivery is still being finalized.";

      setMessage(
        result.emailDelivered === false
          ? limitedSuccessMessage ?? defaultLimited
          : successMessage ?? defaultSuccess,
      );
      trackNewsletterEvent("newsletter_signup_success", source, emailType);

      if (emailType === "medical-bill-sequence") {
        trackSiteEvent("free_pack_email_signup", {
          event_category: "medical_bill_product",
          source_surface: source,
        });
        trackSiteEvent("medical_bill_email_sequence_start", {
          event_category: "medical_bill_product",
          source_surface: source,
          sequence_status: result.sequenceStatus ?? "first_email_only",
        });
      }

      if (emailType === "medical-bill-product-interest") {
        trackSiteEvent("premium_interest_submit", {
          event_category: "medical_bill_product",
          source_surface: source,
          product_id: "expanded_medical_bill_response_workbook",
        });
      }

      if (emailType === "benefits-system-interest") {
        trackSiteEvent("premium_early_access_selected", {
          event_category: "benefits_system_validation",
          source_surface: source,
          product_key: "healthcare-worker-benefits-decision-system",
        });
      }

      setEmail("");
      setFirstName("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Signup failed. Try again in a minute.");
      trackNewsletterEvent("newsletter_signup_error", source, emailType);
    }
  };

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-primary-soft/25 p-5 md:p-7",
        !compact && "md:p-8",
        className,
      )}
      aria-labelledby={`newsletter-signup-${source}`}
    >
      <div className={cn("grid min-w-0 gap-6", compact ? "" : "lg:grid-cols-[1fr_420px] lg:items-center")}>
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{emailLabel}</span>
          </div>
          <h2 id={`newsletter-signup-${source}`} className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{displayDescription}</p>
          <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>No spam, no popups, no individualized advice. Educational emails only. Unsubscribe anytime.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-3 rounded-lg border border-border bg-card/90 p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`newsletter-first-name-${source}`} className="text-sm font-semibold">First name</Label>
              <Input
                id={`newsletter-first-name-${source}`}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Optional"
                autoComplete="given-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`newsletter-email-${source}`} className="text-sm font-semibold">Email</Label>
              <Input
                id={`newsletter-email-${source}`}
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
            <Label htmlFor={`newsletter-website-${source}`}>Website</Label>
            <Input id={`newsletter-website-${source}`} value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary"
            />
            <span>I agree to receive educational emails from Community Acquired Finance. I can unsubscribe anytime.</span>
          </label>

          <Button type="submit" variant="hero" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : buttonLabel}
          </Button>

          {message && (
            <p role="status" aria-live="polite" className={cn("text-sm font-medium", status === "success" ? "text-primary" : "text-destructive")}>{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
