import type { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  accent?: "blue" | "green";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const TopicCard = ({
  icon: Icon,
  title,
  description,
  href,
  cta,
  accent = "blue",
  className,
  onClick,
}: TopicCardProps) => {
  const iconBg = accent === "blue" ? "bg-primary-soft/75 text-primary" : "bg-secondary-soft/75 text-secondary";

  const content = (
    <div
      className={cn(
        "group relative h-full w-full min-w-0 break-words rounded-xl border border-border bg-card/75 p-6 transition-smooth sm:p-7",
        href && "hover:border-primary/35 hover:bg-card",
        className,
      )}
    >
      <div className={cn("mb-5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconBg)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mb-2 font-display text-xl font-bold leading-tight break-words">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground break-words">{description}</p>
      {cta && (
        <div className="mt-5 inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 break-words text-sm font-semibold text-primary">
          {cta} <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      )}
    </div>
  );

  return href ? (
    <Link
      to={href}
      onClick={onClick}
      className="block h-full min-w-0 max-w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {content}
    </Link>
  ) : (
    content
  );
};