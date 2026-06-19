import { BadgeCheck, CalendarDays, FileText, UserRound } from "lucide-react";
import { site } from "@/config/site";
import type { Source } from "@/data/sources";
import { DisclaimerBox } from "./DisclaimerBox";
import { SourceList } from "./SourceList";

type ArticleTrustBlockProps = {
  reviewedDate?: string;
  sources?: Source[];
  className?: string;
};

export const ArticleTrustBlock = ({ reviewedDate = "June 2026", sources = [], className }: ArticleTrustBlockProps) => {
  return (
    <section className={className} aria-labelledby="trust-block-title">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <BadgeCheck className="h-3.5 w-3.5" /> Source-backed education
          </div>
          <h2 id="trust-block-title" className="font-display text-xl font-bold md:text-2xl">
            Author, review, and sources
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This section is meant to make the trust layer visible: who wrote it, how it was checked, and where the core information came from.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <UserRound className="mb-3 h-5 w-5 text-primary" />
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Author</div>
            <div className="mt-1 font-semibold text-foreground">{site.authorName}, {site.authorCredentials}</div>
            <p className="mt-1 text-sm text-muted-foreground">{site.authorRole}</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <CalendarDays className="mb-3 h-5 w-5 text-primary" />
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reviewed / updated</div>
            <div className="mt-1 font-semibold text-foreground">{reviewedDate}</div>
            <p className="mt-1 text-sm text-muted-foreground">Rules, costs, and plan details can change.</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <FileText className="mb-3 h-5 w-5 text-primary" />
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How this was created</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Written and edited for plain-English education, then checked against the cited sources below.
            </p>
          </div>
        </div>

        {sources.length > 0 && <SourceList sources={sources} title="Sources" />}

        <DisclaimerBox />
      </div>
    </section>
  );
};
