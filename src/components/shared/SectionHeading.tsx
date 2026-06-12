import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, description, centered, className }: SectionHeadingProps) => (
  <div className={cn("mb-12 space-y-3", centered && "text-center mx-auto max-w-2xl", className)}>
    {eyebrow && (
      <div className={cn("inline-flex", centered && "justify-center w-full")}>
        <span className="inline-block px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold uppercase tracking-wider">
          {eyebrow}
        </span>
      </div>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
    {description && <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>}
  </div>
);
