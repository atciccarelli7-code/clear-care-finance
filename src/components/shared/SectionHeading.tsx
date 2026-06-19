import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, description, centered, className }: SectionHeadingProps) => (
  <div className={cn("mb-12 min-w-0 space-y-3 break-words", centered && "text-center mx-auto max-w-2xl", className)}>
    {eyebrow && (
      <div className={cn("inline-flex max-w-full min-w-0", centered && "justify-center w-full")}>
        <span className="inline-block max-w-full break-words rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
          {eyebrow}
        </span>
      </div>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight break-words">{title}</h2>
    {description && <p className="text-lg text-muted-foreground leading-relaxed break-words">{description}</p>}
  </div>
);
