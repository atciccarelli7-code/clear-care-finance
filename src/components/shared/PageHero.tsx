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
  <section className={cn("relative w-full min-w-0 overflow-hidden border-b border-border/70 bg-card/30", className)}>
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    <div className="container relative mx-auto max-w-4xl min-w-0 space-y-4 py-14 text-center animate-fade-up md:space-y-5 md:py-20">
      {eyebrow && (
        <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <span className="h-px w-7 bg-primary/35" aria-hidden="true" />
          <span className="max-w-full break-words">{eyebrow}</span>
          <span className="h-px w-7 bg-primary/35" aria-hidden="true" />
        </div>
      )}
      <h1 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-balance break-words md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground text-balance break-words md:text-lg">
          {description}
        </p>
      )}
      {children && (
        <div className="flex w-full min-w-0 flex-col items-center justify-center gap-3 pt-2 sm:flex-row md:pt-3">
          {children}
        </div>
      )}
    </div>
  </section>
);