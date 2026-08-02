import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  CheckSquare,
  History,
  LockKeyhole,
  Trash2,
} from "lucide-react";
import { trackSiteEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PRODUCT_CONTINUITY_EVENTS,
  getProductContinuityItems,
  removeProductContinuityItem,
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
  const [open, setOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<ProductContinuityItem | null>(null);
  const trackedView = useRef(false);

  useEffect(() => {
    const refresh = () => setItems(getProductContinuityItems());
    refresh();

    PRODUCT_CONTINUITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, refresh));
    window.addEventListener("storage", refresh);
    return () => {
      PRODUCT_CONTINUITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, refresh));
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (!open || !items.length || trackedView.current) return;
    trackedView.current = true;
    trackSiteEvent("saved_progress_summary_viewed", {
      event_category: "continuity",
      source_route: sourceRoute,
    });
  }, [items.length, open, sourceRoute]);

  if (!items.length) return null;

  const removeItem = () => {
    if (!pendingRemoval) return;
    removeProductContinuityItem(pendingRemoval.id);
    setItems(getProductContinuityItems());
    trackSiteEvent("saved_progress_item_removed", {
      event_category: "continuity",
      source_route: sourceRoute,
      item_id: pendingRemoval.id,
    });
    setPendingRemoval(null);
  };

  return (
    <section className="border-b border-border bg-card/45 print:hidden" aria-label="Saved work">
      <div className="container flex justify-end py-2.5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
              <History className="h-4 w-4" aria-hidden="true" /> Continue saved work
              <span className="sr-only"> ({items.length} saved {items.length === 1 ? "item" : "items"})</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[min(42rem,90vh)] max-w-2xl overflow-y-auto rounded-2xl p-5 sm:p-6">
            <DialogHeader>
              <div className="inline-flex items-center gap-2 pr-8 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Saved only in this browser
              </div>
              <DialogTitle className="font-display text-2xl">Continue saved work</DialogTitle>
              <DialogDescription>
                Choose what to resume. Summaries never reveal entered financial values.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-3">
              {items.map((item) => {
                const Icon = itemIcons[item.id] ?? History;
                return (
                  <article key={item.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
                        <p className="mt-2 text-[0.7rem] font-semibold text-muted-foreground">Updated {formatUpdatedDate(item.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button asChild size="sm">
                        <Link
                          to={item.href}
                          onClick={() => {
                            setOpen(false);
                            trackSiteEvent("saved_progress_item_opened", {
                              event_category: "continuity",
                              source_route: sourceRoute,
                              item_id: item.id,
                              destination_path: item.href,
                            });
                          }}
                        >
                          Resume <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setPendingRemoval(item)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                        <span className="sr-only"> {item.title}</span>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(pendingRemoval)} onOpenChange={(next) => !next && setPendingRemoval(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this saved work?</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingRemoval ? `${pendingRemoval.title} will be deleted from this browser. This cannot be undone.` : "This saved work will be deleted from this browser."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep saved work</AlertDialogCancel>
              <AlertDialogAction onClick={removeItem}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};

export default ContinueWhereYouLeftOff;
