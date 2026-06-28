import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

export type NextStepCard = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  cta?: string;
};

interface NextStepCardsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards: NextStepCard[];
  columns?: "two" | "three" | "four";
}

const gridClass = {
  two: "md:grid-cols-2",
  three: "md:grid-cols-2 lg:grid-cols-3",
  four: "md:grid-cols-2 lg:grid-cols-4",
};

export const NextStepCards = ({
  eyebrow = "Next step",
  title = "Keep going with the right next move",
  description = "Use the next article, checklist, or calculator based on the question you are trying to answer.",
  cards,
  columns = "three",
}: NextStepCardsProps) => {
  if (!cards.length) return null;

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-card md:p-7">
      <div className="mb-6 flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary ring-1 ring-primary/10">
          <Compass className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</div>
          <h2 className="mt-1 font-display text-xl font-bold leading-tight md:text-2xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className={`grid gap-4 ${gridClass[columns]}`}>
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            to={card.href}
            className="group rounded-2xl border border-border bg-background/70 p-4 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card md:p-5"
          >
            {card.eyebrow && (
              <div className="mb-2 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{card.eyebrow}</div>
            )}
            <h3 className="font-display text-lg font-bold leading-tight text-foreground">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              {card.cta ?? "Open"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NextStepCards;
