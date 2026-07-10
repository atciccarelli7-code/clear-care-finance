import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  applyPrivacyConsent,
  OPEN_PRIVACY_CHOICES_EVENT,
  readPrivacyConsent,
  type PrivacyConsentChoice,
} from "@/lib/privacyConsent";

export const PrivacyChoices = () => {
  const [open, setOpen] = useState(() => readPrivacyConsent() === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_PRIVACY_CHOICES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PRIVACY_CHOICES_EVENT, reopen);
  }, []);

  const choose = (choice: PrivacyConsentChoice) => {
    applyPrivacyConsent(choice);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="privacy-choices-title"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[80] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-hover md:bottom-4 md:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="privacy-choices-title" className="font-display text-base font-bold text-foreground md:text-lg">
            Privacy choices
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Necessary site technology stays on. You may allow Google Analytics storage to help us understand which pages are useful.
            Advertising storage and personalization remain denied by this site’s consent controls.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button type="button" size="sm" onClick={() => choose("analytics")}>
              Allow analytics
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => choose("necessary")}>
              Necessary only
            </Button>
            <Link to="/privacy-policy" className="px-2 py-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Read the Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
