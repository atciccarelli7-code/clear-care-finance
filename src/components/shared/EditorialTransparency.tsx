import { Link } from "react-router-dom";
import { BadgeCheck, BookOpenCheck, UserRound } from "lucide-react";
import { AUTHOR_NAME } from "@/lib/seoRegistry";

type EditorialTransparencyProps = {
  author?: string;
  reviewer?: string;
};

export const EditorialTransparency = ({ author = AUTHOR_NAME, reviewer }: EditorialTransparencyProps) => (
  <aside className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground" aria-label="Article authorship and review">
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-start gap-2.5">
        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <div className="font-semibold text-foreground">Written by</div>
          <Link to="/about" className="font-medium text-primary underline-offset-4 hover:underline">{author}</Link>
          <p className="mt-1 text-xs">RN perspective shaped by bedside, charge, and admissions-discharge-transfer work; not financial-planner, attorney, tax-preparer, insurer, or benefits-administrator credentials.</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        {reviewer ? <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
        <div>
          <div className="font-semibold text-foreground">Review status</div>
          <p>{reviewer ?? "Source-checked through the CAF editorial process; no separate credentialed professional reviewer is claimed."}</p>
          <Link to="/methodology" className="mt-1 inline-block text-xs font-semibold text-primary underline-offset-4 hover:underline">How sources and corrections work</Link>
        </div>
      </div>
    </div>
  </aside>
);
