import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { NextStepCards, type NextStepCard } from "@/components/shared/NextStepCards";
import { SourceList } from "@/components/shared/SourceList";
import type { Source } from "@/data/sources";

type ArticleFooterProps = {
  nextSteps: NextStepCard[];
  sources: Source[];
  orderedPath?: boolean;
};

export function ArticleFooter({ nextSteps, sources, orderedPath = false }: ArticleFooterProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      <NextStepCards
        eyebrow={orderedPath ? "Tools and related reading" : "Keep going"}
        title={orderedPath ? "Want to run the numbers instead?" : "Next useful step"}
        description={orderedPath ? "After the next article, you can also jump into a calculator or return to the full path." : "Move from reading to action with the related checklist, calculator, or decision hub."}
        cards={nextSteps}
      />

      {sources.length > 0 && (
        <div id="sources" className="space-y-4 scroll-mt-24">
          <h2 className="font-display text-xl font-bold md:text-2xl">Sources</h2>
          <SourceList sources={sources} />
        </div>
      )}

      <DisclaimerBox />

      <div className="pt-1">
        <Button asChild variant="soft">
          <Link to="/articles"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        </Button>
      </div>
    </div>
  );
}
