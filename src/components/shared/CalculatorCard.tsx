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
  <div className="w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-card">
    <div className="flex min-w-0 flex-col gap-4 border-b border-border/70 bg-gradient-to-br from-card via-card to-muted/20 p-5 md:flex-row md:items-start md:p-7">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary ring-1 ring-primary/10 md:h-12 md:w-12">
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      <div className="min-w-0 flex-1 break-words">
        {eyebrow && (
          <span className="mb-2 inline-flex max-w-full break-words rounded-full border border-secondary/15 bg-secondary-soft/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-secondary">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-xl font-bold leading-tight break-words md:text-2xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground break-words md:text-base">{description}</p>
        {relatedArticle && (
          <Link
            to={relatedArticle.href}
            className="mt-4 inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full bg-background/80 px-3 py-2 text-sm font-bold text-primary shadow-sm ring-1 ring-border transition-smooth hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="truncate">Read: {relatedArticle.label}</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </div>
    </div>
    <div className="min-w-0 p-5 md:p-7">{children}</div>
  </div>
);

export const CalculatorMeaning = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 min-w-0 rounded-2xl border border-primary/15 bg-primary-soft/35 p-4 break-words md:p-5">
    <div className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">What this means</div>
    <p className="text-sm leading-relaxed text-muted-foreground break-words">{children}</p>
  </div>
);
