import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, LucideIcon } from "lucide-react";
import { ToolEducationPanel } from "@/components/shared/ToolEducationPanel";
import { DirectionalNextActions } from "@/components/shared/DirectionalNextActions";
import { trackSiteEvent } from "@/lib/siteAnalytics";
import type { DirectionalCtaContext } from "@/lib/directionalCta";

interface CalculatorCardProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  relatedArticle?: { label: string; href: string };
  children: ReactNode;
}

type CalculatorNextStep = {
  label: string;
  href: string;
  helper?: string;
  cta?: string;
};

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
            onClick={() => trackSiteEvent("related_article_click", { event_category: "calculator", link_text: relatedArticle.label, link_url: relatedArticle.href })}
            className="mt-4 inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full bg-background/80 px-3 py-2 text-sm font-bold text-primary shadow-sm ring-1 ring-border transition-smooth hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="truncate">Read: {relatedArticle.label}</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
        <ToolEducationPanel title={title} />
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

export const CalculatorNextSteps = ({
  steps,
  directionalContext,
  idPrefix = "calculator_related",
}: {
  steps: CalculatorNextStep[];
  directionalContext?: DirectionalCtaContext;
  idPrefix?: string;
}) => directionalContext && steps[0] ? (
  <div className="mt-4">
    <DirectionalNextActions
      eyebrow="After this tool"
      title="Use the result in your next decision"
      description="Start with the closest related action. The other tools remain available as quieter alternatives."
      primary={{
        id: `${idPrefix}_primary`,
        title: steps[0].label,
        description: steps[0].helper,
        href: steps[0].href,
        label: steps[0].cta ?? `Use ${steps[0].label}`,
        availabilityStatus: "available",
      }}
      related={steps.slice(1).map((step, index) => ({
        id: `${idPrefix}_related_${index + 1}`,
        title: step.label,
        description: step.helper,
        href: step.href,
        label: step.cta ?? `Use ${step.label}`,
        availabilityStatus: "available",
      }))}
      context={directionalContext}
    />
  </div>
) : (
  <div className="mt-4 min-w-0 rounded-2xl border border-border bg-background/70 p-4 break-words md:p-5">
    <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-secondary">What to do next</div>
    <div className="grid gap-2">
      {steps.map((step) => (
        <Link
          key={`${step.href}-${step.label}`}
          to={step.href}
          onClick={() => trackSiteEvent("calculator_next_step_click", { event_category: "calculator", link_text: step.label, link_url: step.href })}
          className="group rounded-xl border border-border bg-card px-3 py-3 transition-smooth hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 text-sm font-bold text-foreground">
            <span>{step.label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
          </div>
          {step.helper && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.helper}</p>}
        </Link>
      ))}
    </div>
  </div>
);
