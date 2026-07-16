import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  CheckSquare,
  History,
  LockKeyhole,
  X,
} from "lucide-react";
import { trackSiteEvent } from "@/lib/analytics";
import {
  PRODUCT_CONTINUITY_EVENTS,
  dismissProductContinuityForSession,
  getProductContinuityItems,
  isProductContinuityDismissed,
  type ProductContinuityId,
  type ProductContinuityItem,
} from "@/lib/productContinuity";

const itemIcons: Record<ProductContinuityId, typeof CheckSquare> = {
  my_plan: CheckSquare,
  foundation_checkup: History,
  benefits_command_center: BriefcaseBusiness,
  benefits_change_review: ClipboardCheck,
};

const formatUpdatedDate = (iso: string) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(iso));

export const ContinueWhereYouLeftOff = ({ sourceRoute }: { sourceRoute: string }) => {
  const [items, setItems] = useState<ProductContinuityItem[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const trackedView = useRef(false);

  useEffect(() => {
    const refresh = () => setItems(getProductContinuityItems());
    setDismissed(isProductContinuityDismissed());
    refresh();

    PRODUCT_CONTINUITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    window.addEventListener("storage", refresh);
    return () => {
      PRODUCT_CONTINUITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (dismissed || !items.length || trackedView.current) return;
    trackedView.current = true;
    trackSiteEvent("saved_progress_summary_viewed", {
      event_category: "continuity",
      source_route: sourceRoute,
    });
  }, [dismissed, items.length, sourceRoute]);

  if (dismissed || !items.length) return null;

  const dismiss = () => {
    dismissProductContinuityForSession();
    setDismissed(true);
    trackSiteEvent("saved_progress_summary_dismissed", {
      event_category: "continuity",
      source_route: sourceRoute,
    });
  };

  return (
    <section className="border-b border-border bg-primary-soft/35 print:hidden" aria-labelledby="saved-progress-heading">
      <div className="container py-4 md:py-5">
        <div className="rounded-3xl border border-primary/20 bg-card p-4 shadow-card md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Saved only in this browser
              </div>
              <h2 id="saved-progress-heading" className="mt-2 font-display text-xl font-bold md:text-2xl">
                Continue where you left off
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Resume saved actions or local work without an account. No entered financial values are shown here.
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Dismiss saved progress for this browser session"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = itemIcons[item.id] ?? History;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() =>
                    trackSiteEvent("saved_progress_item_opened", {
                      event_category: "continuity",
                      source_route: sourceRoute,
                      item_id: item.id,
                      destination_path: item.href,
                    })
                  }
                  className="group flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-background p-4 transition-smooth hover:border-primary/35 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold text-foreground">{item.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.summary}</span>
                    <span className="mt-2 block text-[0.7rem] font-semibold text-muted-foreground">
                      Updated {formatUpdatedDate(item.updatedAt)}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      {item.actionLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinueWhereYouLeftOff;
