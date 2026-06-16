import { DefinitionCard } from "./DefinitionCard";
import { SectionHeading } from "./SectionHeading";

interface TopicOverviewProps {
  startHere: string;
  definitions: { term: string; meaning: string }[];
}

export const TopicOverview = ({ startHere, definitions }: TopicOverviewProps) => {
  // Split start-here text into shorter scannable paragraphs.
  const paragraphs = startHere
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .reduce<string[]>((acc, sentence) => {
      const last = acc[acc.length - 1];
      if (last && (last + " " + sentence).length < 180) {
        acc[acc.length - 1] = last + " " + sentence;
      } else {
        acc.push(sentence);
      }
      return acc;
    }, []);

  return (
    <div className="space-y-10">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
          Start here
        </div>
        <div className="space-y-3 text-left">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-foreground leading-relaxed">
              {p}
            </p>
          ))}
        </div>
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
};
