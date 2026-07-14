import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Calculator,
  Check,
  ExternalLink,
  HeartPulse,
  Laptop,
  Search,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  Tag,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { PageHero } from "@/components/shared/PageHero";
import { RelatedArticles } from "@/components/shared/RelatedArticles";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import {
  HEALTHCARE_DISCOUNT_SOURCES,
  HEALTHCARE_WORKER_DISCOUNTS,
  type DiscountCategory,
} from "@/data/healthcareWorkerDiscounts";
import { trackSiteEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const REVIEW_DATE = "July 13, 2026";
const SHORTLIST_KEY = "caf-healthcare-discount-shortlist";

type FilterCategory = "All" | DiscountCategory;

const categoryOptions: FilterCategory[] = [
  "All",
  "Shift shoes & apparel",
  "Phone & technology",
  "Home & recovery",
  "Discount directories",
];

const categoryIcons = {
  "Shift shoes & apparel": Shirt,
  "Phone & technology": Smartphone,
  "Home & recovery": HeartPulse,
  "Discount directories": BadgeCheck,
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const parseMoney = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const HealthcareWorkerDiscountsPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterCategory>("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [shortlistLoaded, setShortlistLoaded] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState("160");
  const [discountPercent, setDiscountPercent] = useState("15");
  const [fees, setFees] = useState("0");
  const [alternativePrice, setAlternativePrice] = useState("");
  const [plannedPurchase, setPlannedPurchase] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SHORTLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch {
      // Shortlisting is optional and must never interrupt the page.
    } finally {
      setShortlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!shortlistLoaded) return;
    try {
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(savedIds));
    } catch {
      // Local storage may be unavailable in privacy-focused browser modes.
    }
  }, [savedIds, shortlistLoaded]);

  const filteredOffers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return HEALTHCARE_WORKER_DISCOUNTS.filter((offer) => {
      if (category !== "All" && offer.category !== category) return false;
      if (showSavedOnly && !savedIds.includes(offer.id)) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        offer.brand,
        offer.discountLabel,
        offer.summary,
        offer.bestFor,
        offer.eligibility,
        offer.verification,
        offer.category,
        ...offer.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [category, query, savedIds, showSavedOnly]);

  const featuredOffers = HEALTHCARE_WORKER_DISCOUNTS.filter((offer) => offer.featured);

  const price = parseMoney(purchasePrice);
  const percentage = Math.min(100, parseMoney(discountPercent));
  const addedFees = parseMoney(fees);
  const comparisonPrice = alternativePrice.trim() ? parseMoney(alternativePrice) : null;
  const discountedSubtotal = price * (1 - percentage / 100);
  const finalDiscountedPrice = discountedSubtotal + addedFees;
  const netSavings = price - finalDiscountedPrice;
  const alternativeDifference = comparisonPrice === null ? null : comparisonPrice - finalDiscountedPrice;

  const realityMessage = useMemo(() => {
    if (!plannedPurchase) {
      return {
        tone: "warning",
        title: "The strongest discount is skipping the purchase.",
        body: "A healthcare badge does not turn an unplanned purchase into savings.",
      };
    }

    if (comparisonPrice !== null && finalDiscountedPrice > comparisonPrice) {
      return {
        tone: "warning",
        title: "The cheaper alternative still wins.",
        body: `The verified offer costs ${moneyFormatter.format(finalDiscountedPrice - comparisonPrice)} more after fees.`,
      };
    }

    if (netSavings <= 0) {
      return {
        tone: "warning",
        title: "Fees erased the discount.",
        body: "Check shipping, subscriptions, taxes, required memberships, and return costs before paying.",
      };
    }

    if (netSavings < 10) {
      return {
        tone: "neutral",
        title: "Real savings, but modest.",
        body: "The offer may still be useful, but convenience and return terms could matter more than the coupon.",
      };
    }

    return {
      tone: "positive",
      title: "This looks like genuine savings.",
      body: "You planned the purchase, accounted for fees, and checked a realistic alternative.",
    };
  }, [comparisonPrice, finalDiscountedPrice, netSavings, plannedPurchase]);

  const toggleSaved = (offerId: string) => {
    const isSaved = savedIds.includes(offerId);
    setSavedIds((current) => (isSaved ? current.filter((id) => id !== offerId) : [...current, offerId]));
    trackSiteEvent("discount_shortlist_toggle", {
      event_category: "discounts",
      brand_id: offerId,
      saved_state: !isSaved,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setShowSavedOnly(false);
  };

  return (
    <>
      <PageHero
        eyebrow="For healthcare workers · Reviewed 2026"
        title="Healthcare Worker Discounts & Perks (2026)"
        description="A useful, slightly fun directory of discounts for nurses, clinicians, and hospital employees—built to help you save on things you already needed, not invent reasons to shop."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#discount-directory">
            Browse verified offers <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#reality-check">Run the discount reality check</a>
        </Button>
      </PageHero>

      <section className="container min-w-0 py-6 md:py-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Direct official links. No affiliate ranking.</p>
              <p className="text-sm text-muted-foreground">
                Offers were reviewed on {REVIEW_DATE}. Discounts, eligibility, and exclusions can change without notice.
              </p>
            </div>
          </div>
          <a
            href="#how-verification-works"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            How verification works
          </a>
        </div>
      </section>

      <section className="container min-w-0 py-10 md:py-14">
        <SectionHeading
          centered
          eyebrow="The shift report"
          title="Three rules before you use the badge"
          description="Healthcare-worker discounts are best when they reduce an expense—not when they create one."
        />
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-primary/20 bg-primary-soft/50 p-6 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <WalletCards className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold">Recurring savings beat coupon theater</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A phone-plan discount that lowers twelve monthly bills can matter more than 20% off something you did not need.
            </p>
          </article>
          <article className="rounded-3xl border border-secondary/20 bg-secondary/5 p-6 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <Check className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold">Compare the final price</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Include shipping, fees, subscriptions, excluded products, returns, and the price at another retailer.
            </p>
          </article>
          <article className="rounded-3xl border border-amber-300/50 bg-amber-50 p-6 shadow-card dark:border-amber-700/40 dark:bg-amber-950/20">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold">Use the fun perk guilt-free</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Planned purchase, fair price, useful item? Take the discount. You earned the tiny victory.
            </p>
          </article>
        </div>
      </section>

      <section className="container min-w-0 py-8 md:py-12">
        <div className="rounded-[2rem] border border-border bg-gradient-to-br from-card via-card to-primary-soft/40 p-6 shadow-card md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Worth checking first</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                The offers most likely to create real value
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Selected for recurring impact, broad healthcare eligibility, or practical shift use—not for the biggest-looking percentage.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {featuredOffers.map((offer) => {
              const Icon = categoryIcons[offer.category];
              return (
                <article key={offer.id} className="rounded-2xl border border-border bg-background/80 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">{offer.brand}</h3>
                        <p className="text-xs font-semibold text-muted-foreground">{offer.status}</p>
                      </div>
                    </div>
                    <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-label="Official source reviewed" />
                  </div>
                  <p className="mt-4 font-semibold text-foreground">{offer.discountLabel}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{offer.bestFor}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="discount-directory" className="container min-w-0 scroll-mt-24 py-12 md:py-16">
        <SectionHeading
          centered
          eyebrow="Healthcare discount directory"
          title="Find the perk that fits your actual purchase"
          description="Search by brand, role, product, or verification method. Save a shortlist locally on this device while you compare."
        />

        <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search healthcare worker discounts</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try nurse, shoes, hospital employee, phone, ID.me…"
                className="h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <button
              type="button"
              onClick={() => setShowSavedOnly((current) => !current)}
              aria-pressed={showSavedOnly}
              className={cn(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition",
                showSavedOnly
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {showSavedOnly ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              My shortlist ({savedIds.length})
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter discounts by category">
            {categoryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setCategory(option);
                  trackSiteEvent("discount_category_filter", {
                    event_category: "discounts",
                    discount_category: option,
                  });
                }}
                aria-pressed={category === option}
                className={cn(
                  "rounded-full border px-3 py-2 text-sm font-semibold transition",
                  category === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-6xl items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{filteredOffers.length}</strong> of {HEALTHCARE_WORKER_DISCOUNTS.length} reviewed resources
          </p>
          {(query || category !== "All" || showSavedOnly) && (
            <button type="button" onClick={clearFilters} className="font-semibold text-primary hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {filteredOffers.length > 0 ? (
          <div className="mx-auto mt-6 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => {
              const Icon = categoryIcons[offer.category];
              const isSaved = savedIds.includes(offer.id);

              return (
                <article
                  key={offer.id}
                  className="group flex min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-xl font-extrabold">{offer.brand}</h3>
                        <p className="text-xs font-semibold text-muted-foreground">Reviewed {offer.reviewedAt}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSaved(offer.id)}
                      aria-label={isSaved ? `Remove ${offer.brand} from shortlist` : `Save ${offer.brand} to shortlist`}
                      aria-pressed={isSaved}
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition",
                        isSaved
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary",
                      )}
                    >
                      {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">{offer.category}</span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {offer.status}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-bold leading-snug text-foreground">{offer.discountLabel}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{offer.summary}</p>

                  <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
                    <div>
                      <dt className="font-bold text-foreground">Best use</dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{offer.bestFor}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">Who may qualify</dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{offer.eligibility}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-foreground">Verification</dt>
                      <dd className="mt-1 leading-relaxed text-muted-foreground">{offer.verification}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground">Before checkout: </span>
                    {offer.finePrint}
                  </div>

                  <div className="mt-auto pt-5">
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackSiteEvent("healthcare_discount_click", {
                            event_category: "discounts",
                            brand_id: offer.id,
                            discount_category: offer.category,
                            destination_url: offer.url,
                          })
                        }
                      >
                        Check official offer <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <Tag className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-bold">No matching discounts yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a broader role or product term, or clear the current filters.
            </p>
            <Button type="button" variant="soft" className="mt-5" onClick={clearFilters}>
              Show all offers
            </Button>
          </div>
        )}
      </section>

      <section id="reality-check" className="scroll-mt-24 border-y border-border bg-muted/35 py-14 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            centered
            eyebrow="Mini tool"
            title="The discount reality check"
            description="See what the offer saves after fees—and whether the non-discounted alternative is still cheaper."
          />

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold">Run the numbers</h3>
                  <p className="text-sm text-muted-foreground">No information leaves your device.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold">
                  Planned item price
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={purchasePrice}
                      onChange={(event) => setPurchasePrice(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-border bg-background pl-8 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>

                <label className="space-y-2 text-sm font-semibold">
                  Discount percentage
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      inputMode="decimal"
                      value={discountPercent}
                      onChange={(event) => setDiscountPercent(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-border bg-background px-4 pr-9 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </label>

                <label className="space-y-2 text-sm font-semibold">
                  Shipping, fees, or membership cost
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={fees}
                      onChange={(event) => setFees(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-border bg-background pl-8 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>

                <label className="space-y-2 text-sm font-semibold">
                  Cheaper alternative price <span className="font-normal text-muted-foreground">(optional)</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={alternativePrice}
                      onChange={(event) => setAlternativePrice(event.target.value)}
                      placeholder="140"
                      className="h-12 w-full rounded-2xl border border-border bg-background pl-8 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-bold">Would you buy this without the healthcare-worker discount?</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannedPurchase(true)}
                    aria-pressed={plannedPurchase}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                      plannedPurchase
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    Yes, it was planned
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlannedPurchase(false)}
                    aria-pressed={!plannedPurchase}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                      !plannedPurchase
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-border text-muted-foreground hover:border-amber-400",
                    )}
                  >
                    No, the deal created it
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <WalletCards className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold">Your actual result</h3>
                  <p className="text-sm text-muted-foreground">Discount percentage is not the same as dollars saved.</p>
                </div>
              </div>

              <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Discounted subtotal</dt>
                  <dd className="mt-2 font-display text-2xl font-extrabold">{moneyFormatter.format(discountedSubtotal)}</dd>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Final price after fees</dt>
                  <dd className="mt-2 font-display text-2xl font-extrabold">{moneyFormatter.format(finalDiscountedPrice)}</dd>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Net savings</dt>
                  <dd className={cn("mt-2 font-display text-2xl font-extrabold", netSavings >= 0 ? "text-primary" : "text-destructive")}>
                    {moneyFormatter.format(netSavings)}
                  </dd>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Versus alternative</dt>
                  <dd className="mt-2 font-display text-2xl font-extrabold">
                    {alternativeDifference === null
                      ? "Not entered"
                      : alternativeDifference >= 0
                        ? `${moneyFormatter.format(alternativeDifference)} cheaper`
                        : `${moneyFormatter.format(Math.abs(alternativeDifference))} more`}
                  </dd>
                </div>
              </dl>

              <div
                className={cn(
                  "mt-6 rounded-2xl border p-5",
                  realityMessage.tone === "positive" && "border-primary/25 bg-primary-soft/60",
                  realityMessage.tone === "neutral" && "border-border bg-muted/50",
                  realityMessage.tone === "warning" && "border-amber-300 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-950/20",
                )}
              >
                <p className="font-display text-lg font-extrabold">{realityMessage.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{realityMessage.body}</p>
              </div>

              <p className="mt-auto pt-6 text-xs leading-relaxed text-muted-foreground">
                This is a simple shopping comparison, not a guarantee that an offer will apply. Taxes are excluded because they vary and often apply after discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-verification-works" className="container min-w-0 scroll-mt-24 py-14 md:py-20">
        <SectionHeading
          centered
          eyebrow="Verification without the weirdness"
          title="Why the brand asks for your work information"
          description="Most standing healthcare-worker programs use ID.me, SheerID, a professional license, a work email, or an employment document to confirm eligibility."
        />

        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <BadgeCheck className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Start at the official brand page</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use the links in this directory or navigate directly to the retailer. Avoid random coupon pages asking for credentials.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <Laptop className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Expect a work email or document</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Verification may be instant, or the provider may request a badge, paystub, license, or other proof with unnecessary details covered.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Read the brand's eligibility list</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              “Healthcare worker” can mean nurses only, licensed clinicians, medical providers, or all hospital employees depending on the company.
            </p>
          </article>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-primary/20 bg-primary-soft/40 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-display text-xl font-bold">Privacy rule of thumb</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Submit only what the official verification flow requests. Cover unrelated account numbers, balances, diagnoses, or personal information when a document can be safely redacted. Community Acquired Finance never receives or stores your verification documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/35 py-14 md:py-20">
        <div className="container min-w-0">
          <SectionHeading
            centered
            eyebrow="Quick answers"
            title="Healthcare discount questions people actually ask"
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              {
                question: "Do all hospital employees qualify?",
                answer:
                  "No. Some brands explicitly include hospital employees, while others limit eligibility to licensed nurses, physicians, medical providers, EMTs, or first responders. Check the official eligibility list before creating an account or uploading documentation.",
              },
              {
                question: "Can I stack a healthcare discount with a sale code?",
                answer:
                  "Usually not, although some programs allow the verified discount on already-reduced items or alongside a membership benefit. Compare both checkout paths because the public promotion can be better than the professional discount.",
              },
              {
                question: "Why did verification fail even though I work in healthcare?",
                answer:
                  "Your exact job title may not be in the brand's eligible group, your work email may not match the employer database, or the verification provider may need a clearer document. Use the provider's support process rather than sending credentials to the retailer through an unrelated channel.",
              },
              {
                question: "Are these affiliate links?",
                answer:
                  "No. This page links directly to official brand or verification-program pages. Community Acquired Finance does not currently receive a commission when you use these links.",
              },
              {
                question: "What is the best healthcare-worker discount?",
                answer:
                  "The one attached to a purchase or bill you already planned. Recurring phone-plan savings can have the highest annual impact, while a shoe discount can be valuable when you genuinely need a replacement pair for work.",
              },
            ].map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-card p-5 shadow-card">
                <summary className="cursor-pointer list-none font-display text-lg font-bold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-primary transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-14 md:py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-gradient-to-br from-primary-soft/70 via-card to-secondary/10 p-7 shadow-card md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The bigger financial move</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                Use the perk, then go back to the benefits that move thousands—not tens.
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                A shoe discount is fun. Your employer match, health-plan choice, HSA, 403(b), overtime pattern, and recurring bills usually create much larger long-term impact.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild variant="hero">
                <Link to="/topics/workplace-benefits">
                  Review workplace benefits <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tools">Browse financial tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container min-w-0 py-12">
        <RelatedArticles slugs={["healthcare-worker-discounts"]} />
      </section>

      <section id="sources" className="container min-w-0 scroll-mt-24 py-14 md:py-20">
        <SectionHeading
          centered
          eyebrow="Official sources"
          title="Where every offer should be verified"
          description="Retailer programs change frequently. Use the official page to confirm eligibility, exclusions, and the current checkout price."
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-6">
          <SourceList sources={HEALTHCARE_DISCOUNT_SOURCES} />
          <DisclaimerBox />
        </div>
      </section>
    </>
  );
};

export default HealthcareWorkerDiscountsPage;
