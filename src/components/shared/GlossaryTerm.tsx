import type { GlossaryEntry } from "@/data/glossary";
import { Link } from "react-router-dom";

export const GlossaryTerm = ({ entry }: { entry: GlossaryEntry }) => (
  <div className="rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/40">
    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
      <h2 className="font-display text-lg font-bold">{entry.term}</h2>
      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{entry.category}</span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{entry.definition}</p>
    {entry.example && (
      <p className="text-sm text-foreground/80 leading-relaxed mt-2">{entry.example}</p>
    )}
    {(entry.next || entry.source) && (
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary">
        {entry.next && <Link className="font-semibold underline underline-offset-4" to={entry.next.href}>{entry.next.label}</Link>}
        {entry.source && <a className="underline underline-offset-4" href={entry.source.href}>{entry.source.label}</a>}
      </div>
    )}
  </div>
);
