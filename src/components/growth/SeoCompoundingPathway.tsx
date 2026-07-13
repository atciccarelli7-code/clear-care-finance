import { NextStepCards } from "@/components/shared/NextStepCards";
import {
  getVisibleCompoundingCards,
  type CompoundingPathwayCard,
  type SeoCompoundingPathway,
} from "@/data/seoCompoundingPathways";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

interface SeoCompoundingPathwayProps {
  pathway: SeoCompoundingPathway;
  currentPath: string;
  surface: "article" | "hub";
  contained?: boolean;
}

const eventNameFor = (surface: "article" | "hub", card: CompoundingPathwayCard) => {
  if (surface === "article") {
    return card.destinationType === "tool" ? "article_to_tool_clicked" : "article_to_related_article_clicked";
  }
  return card.destinationType === "tool" ? "hub_to_tool_clicked" : "hub_to_resource_clicked";
};

export const SeoCompoundingPathway = ({ pathway, currentPath, surface, contained = false }: SeoCompoundingPathwayProps) => {
  const cards = getVisibleCompoundingCards(pathway, currentPath, 4);
  if (!cards.length) return null;

  const content = (
    <NextStepCards
      eyebrow={pathway.eyebrow}
      title={pathway.title}
      description={pathway.description}
      cards={cards}
      columns="four"
      onCardOpen={(selectedCard) => {
        const card = cards.find((candidate) => candidate.href === selectedCard.href);
        if (!card) return;
        trackGrowthEvent(eventNameFor(surface, card), {
          entry_surface: surface,
          problem_category: pathway.id,
          destination_id: card.destinationId,
          handoff_id: card.destinationType,
        });
      }}
    />
  );

  if (contained) return content;

  return (
    <div className="container mt-10 md:mt-14" aria-label={`${pathway.title} pathway`}>
      {content}
    </div>
  );
};

export default SeoCompoundingPathway;
