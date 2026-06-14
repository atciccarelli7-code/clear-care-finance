import type { GlossaryEntry } from "@/data/glossary";

export const GlossaryTerm = ({ entry }: { entry: GlossaryEntry }) => (
  <div className="rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/40">
    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
      <h3 className="font-display text-lg font-bold">{entry.term}</h3>
      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{entry.category}</span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{entry.definition}</p>
    {entry.example && (
      <p className="text-sm text-foreground/80 leading-relaxed mt-2 italic">{entry.example}</p>
    )}
  </div>
);
