import { AlertTriangle, Info, ListChecks } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TOOL_EDUCATION_BY_TITLE } from "@/data/toolEducation";

const educationCards = [
  { key: "purpose", label: "Purpose", icon: Info },
  { key: "readResult", label: "How to read the result", icon: ListChecks },
  { key: "beforeActing", label: "Before acting", icon: AlertTriangle },
] as const;

export const ToolEducationPanel = ({ title }: { title: string }) => {
  const education = TOOL_EDUCATION_BY_TITLE[title];
  if (!education) return null;

  return (
    <Accordion type="single" collapsible className="mt-5 rounded-2xl border border-border bg-background/70 px-4 shadow-sm">
      <AccordionItem value="tool-context" className="border-0">
        <AccordionTrigger className="py-4 text-left text-sm font-bold text-foreground hover:no-underline">
          Understand this tool
        </AccordionTrigger>
        <AccordionContent className="pb-5 pt-0">
          <div className="grid gap-3 md:grid-cols-3">
            {educationCards.map(({ key, label, icon: Icon }) => (
              <div key={key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{education[key]}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ToolEducationPanel;
