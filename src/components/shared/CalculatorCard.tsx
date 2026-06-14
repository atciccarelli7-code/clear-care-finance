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
  <div className="rounded-3xl border border-border bg-card/60 backdrop-blur shadow-card overflow-hidden">
    <div className="p-6 md:p-8 border-b border-border/60 flex flex-col md:flex-row md:items-start gap-5">
      <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        {eyebrow && (
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
        {relatedArticle && (
          <Link
            to={relatedArticle.href}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            Read: {relatedArticle.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </div>
);

export const CalculatorMeaning = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-2xl bg-muted/30 border border-border p-5">
    <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">What this means</div>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);
