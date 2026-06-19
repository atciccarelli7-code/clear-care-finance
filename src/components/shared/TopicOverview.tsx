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
    <div className="min-w-0 space-y-10">
      <div className="mx-auto max-w-2xl min-w-0 break-words">
        <div className="mb-4 inline-flex max-w-full break-words rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
          Start here
        </div>
        <div className="space-y-3 text-left min-w-0">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-foreground leading-relaxed break-words">
              {p}
            </p>
          ))}
        </div>
      </div>

      {definitions.length > 0 && (
        <div className="min-w-0">
          <SectionHeading centered eyebrow="Key definitions" title="The vocabulary you need" />
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {definitions.map((d) => (
              <DefinitionCard key={d.term} {...d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
