import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, description, centered, className }: SectionHeadingProps) => (
  <div className={cn("mb-10 min-w-0 space-y-3 break-words", centered && "mx-auto max-w-2xl text-center", className)}>
    {eyebrow && (
      <div className={cn("flex max-w-full items-center gap-3", centered && "justify-center")}>
        <span className="h-px w-7 shrink-0 bg-primary/35" aria-hidden="true" />
        <span className="max-w-full break-words text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </span>
        {centered && <span className="h-px w-7 shrink-0 bg-primary/35" aria-hidden="true" />}
      </div>
    )}
    <h2 className="font-display text-3xl font-bold tracking-tight break-words md:text-4xl">{title}</h2>
    {description && <p className="text-base leading-relaxed text-muted-foreground break-words md:text-lg">{description}</p>}
  </div>
);