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
}

export const TopicCard = ({ icon: Icon, title, description, href, cta, accent = "blue", className }: TopicCardProps) => {
  const iconBg = accent === "blue" ? "bg-primary-soft text-primary" : "bg-secondary-soft text-secondary";

  const content = (
    <div
      className={cn(
        "group relative h-full w-full min-w-0 break-words rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth sm:p-7",
        href && "hover:-translate-y-1 hover:shadow-hover hover:border-primary/30 cursor-pointer",
        className,
      )}
    >
      <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl mb-5 shrink-0", iconBg)}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl font-bold mb-2 break-words">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed break-words">{description}</p>
      {cta && (
        <div className="mt-5 inline-flex max-w-full min-w-0 flex-wrap items-center gap-1.5 break-words text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
          {cta} <ArrowRight className="h-4 w-4 shrink-0" />
        </div>
      )}
    </div>
  );

  return href ? <Link to={href} className="block h-full min-w-0 max-w-full">{content}</Link> : content;
};
