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
  <section className={cn("relative w-full min-w-0 overflow-hidden bg-gradient-hero border-b border-border/60", className)}>
    <div className="absolute -top-32 -left-32 h-96 w-96 max-w-full rounded-full bg-primary/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-40 -right-32 h-96 w-96 max-w-full rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
    <div className="container relative mx-auto max-w-3xl min-w-0 space-y-5 py-16 text-center animate-fade-up md:py-24">
      {eyebrow && (
        <span className="inline-block max-w-full break-words rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {eyebrow}
        </span>
      )}
      <h1 className="mx-auto max-w-full font-display text-2xl font-extrabold tracking-tight leading-[1.15] text-balance break-words sm:text-3xl md:text-5xl md:leading-[1.1]">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed text-balance break-words">
          {description}
        </p>
      )}
      {children && <div className="pt-2 flex w-full min-w-0 flex-col sm:flex-row items-center justify-center gap-3">{children}</div>}
    </div>
  </section>
);
