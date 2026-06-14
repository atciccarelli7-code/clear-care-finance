import { DefinitionCard } from "./DefinitionCard";
import { SectionHeading } from "./SectionHeading";

interface TopicOverviewProps {
  startHere: string;
  definitions: { term: string; meaning: string }[];
}

export const TopicOverview = ({ startHere, definitions }: TopicOverviewProps) => (
  <div className="space-y-10">
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-block px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
        Start here
      </div>
      <p className="text-lg md:text-xl text-foreground leading-relaxed text-balance">{startHere}</p>
    </div>

    {definitions.length > 0 && (
      <div>
        <SectionHeading centered eyebrow="Key definitions" title="The vocabulary you need" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {definitions.map((d) => (
            <DefinitionCard key={d.term} {...d} />
          ))}
        </div>
      </div>
    )}
  </div>
);
