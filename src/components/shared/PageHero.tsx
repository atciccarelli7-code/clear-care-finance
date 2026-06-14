import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const PageHero = ({ eyebrow, title, description, children, className }: PageHeroProps) => (
  <section className={cn("relative overflow-hidden bg-gradient-hero border-b border-border/60", className)}>
    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
    <div className="container relative py-16 md:py-24 text-center max-w-3xl mx-auto space-y-5 animate-fade-up">
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full bg-card/60 border border-border text-xs font-semibold text-primary backdrop-blur">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance">
        {title}
      </h1>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
          {description}
        </p>
      )}
      {children && <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">{children}</div>}
    </div>
  </section>
);
