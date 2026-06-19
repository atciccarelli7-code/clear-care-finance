interface DefinitionCardProps {
  term: string;
  meaning: string;
}

export const DefinitionCard = ({ term, meaning }: DefinitionCardProps) => (
  <div className="min-w-0 break-words rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:border-primary/30">
    <div className="font-display font-bold text-foreground mb-1.5 break-words">{term}</div>
    <p className="text-sm text-muted-foreground leading-relaxed break-words">{meaning}</p>
  </div>
);
