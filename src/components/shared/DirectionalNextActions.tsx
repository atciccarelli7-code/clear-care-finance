import { ArrowRight, Compass } from "lucide-react";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  trackDirectionalCta,
  type CtaActionTier,
  type DirectionalCtaAction,
  type DirectionalCtaContext,
} from "@/lib/directionalCta";

type DirectionalNextActionsProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primary: DirectionalCtaAction;
  secondary?: DirectionalCtaAction;
  related?: DirectionalCtaAction[];
  context: DirectionalCtaContext;
};

type DirectionalActionLinkProps = {
  action: DirectionalCtaAction;
  actionTier: CtaActionTier;
  context: DirectionalCtaContext;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const DirectionalActionLink = forwardRef<HTMLAnchorElement, DirectionalActionLinkProps>(({
  action,
  actionTier,
  context,
  children,
  onClick,
  ...anchorProps
}, ref) => {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) trackDirectionalCta(action, actionTier, context);
  };
  if (action.href.startsWith("#")) return <a {...anchorProps} ref={ref} href={action.href} onClick={handleClick}>{children}</a>;
  if (/^https?:\/\//i.test(action.href)) {
    return <a {...anchorProps} ref={ref} href={action.href} target="_blank" rel="noreferrer" onClick={handleClick}>{children}</a>;
  }
  return <Link {...anchorProps} ref={ref} to={action.href} onClick={handleClick}>{children}</Link>;
});
DirectionalActionLink.displayName = "DirectionalActionLink";

export const DirectionalNextActions = ({
  eyebrow = "Recommended next action",
  title,
  description,
  primary,
  secondary,
  related = [],
  context,
}: DirectionalNextActionsProps) => (
  <section className="rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary-soft/45 via-card to-card p-5 shadow-card md:p-7">
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</div>
        <h2 className="mt-1 font-display text-xl font-bold leading-tight md:text-2xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>

    <div className="mt-6 rounded-2xl border border-primary/20 bg-card p-4 shadow-sm md:p-5">
      {primary.eyebrow && <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{primary.eyebrow}</div>}
      <h3 className="mt-1 font-display text-lg font-bold text-foreground">{primary.title}</h3>
      {primary.description && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{primary.description}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button asChild variant="hero">
          <DirectionalActionLink action={primary} actionTier="primary" context={context}>
            {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </DirectionalActionLink>
        </Button>
        {secondary && (
          <Button asChild variant="outline">
            <DirectionalActionLink action={secondary} actionTier="secondary" context={context}>
              {secondary.label}
            </DirectionalActionLink>
          </Button>
        )}
      </div>
    </div>

    {related.length > 0 && (
      <div className="mt-5 border-t border-border/80 pt-4">
        <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Other useful paths</div>
        <ul className="mt-2 divide-y divide-border/70" aria-label="Other useful paths">
          {related.map((action) => (
            <li key={action.id}>
              <DirectionalActionLink action={action} actionTier="related" context={context}>
                <span className="group flex items-center justify-between gap-4 py-3 text-sm font-semibold text-foreground hover:text-primary">
                  <span>
                    {action.title}
                    {action.description && <span className="mt-0.5 block text-xs font-normal leading-relaxed text-muted-foreground">{action.description}</span>}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </DirectionalActionLink>
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export default DirectionalNextActions;
