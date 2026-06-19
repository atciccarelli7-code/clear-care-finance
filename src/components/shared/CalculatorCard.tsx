import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  relatedArticle?: { label: string; href: string };
  children: ReactNode;
}

export const CalculatorCard = ({
  icon: Icon = Calculator,
  eyebrow,
  title,
  description,
  relatedArticle,
  children,
}: CalculatorCardProps) => (
  <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-border bg-card/60 shadow-card backdrop-blur">
    <div className="flex min-w-0 flex-col gap-5 border-b border-border/60 p-6 md:flex-row md:items-start md:p-8">
      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:flex">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1 break-words">
        {eyebrow && (
          <span className="mb-2 inline-block max-w-full break-words rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-xl md:text-2xl font-bold break-words">{title}</h2>
        <p className="mt-1 text-sm md:text-base text-muted-foreground break-words">{description}</p>
        {relatedArticle && (
          <Link
            to={relatedArticle.href}
            className="mt-3 inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 break-words text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            Read: {relatedArticle.label} <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </div>
    </div>
    <div className="min-w-0 p-6 md:p-8">{children}</div>
  </div>
);

export const CalculatorMeaning = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 min-w-0 rounded-2xl bg-muted/30 border border-border p-5 break-words">
    <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">What this means</div>
    <p className="text-sm text-muted-foreground leading-relaxed break-words">{children}</p>
  </div>
);
