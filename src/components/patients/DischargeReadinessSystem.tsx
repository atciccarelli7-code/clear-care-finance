import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  CARE_TEAM_RESPONSIBILITY_MAP,
  DISCHARGE_BARRIER_CATEGORIES,
  DISCHARGE_READINESS_BARRIERS,
  FAMILY_HOSPITAL_QUESTION_GROUPS,
  RN_DISCHARGE_PRINCIPLES,
  getDischargeBarriersForCategory,
} from "@/data/dischargeReadiness";

const DischargeReadinessSystem = () => {
  const [selectedBarrierIds, setSelectedBarrierIds] = useState<Set<string>>(() => new Set());

  const selectedBarriers = useMemo(
    () => DISCHARGE_READINESS_BARRIERS.filter((barrier) => selectedBarrierIds.has(barrier.id)),
    [selectedBarrierIds],
  );

  const toggleBarrier = (barrierId: string) => {
    setSelectedBarrierIds((current) => {
      const next = new Set(current);
      if (next.has(barrierId)) next.delete(barrierId);
      else next.add(barrierId);
      return next;
    });
  };

  return (
    <section id="discharge-readiness" className="scroll-mt-24 border-y border-border/70 bg-muted/20" aria-labelledby="discharge-readiness-heading">
      <div className="container py-12 md:py-16">
        <SectionHeading
          id="discharge-readiness-heading"
          centered
          eyebrow="Discharge readiness system"
          title="Find the barriers that can keep a medically ready patient from leaving safely"
          description="Select any issue that is still unresolved. The page will organize specific questions for the care team without asking for names, diagnoses, policy numbers, or other private medical information. Selections remain only in this browser session."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3" aria-label="RN discharge planning principles">
          {RN_DISCHARGE_PRINCIPLES.map((principle, index) => (
            <article key={principle.id} className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm md:p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-primary">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" /> RN principle
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-tight text-foreground">{principle.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-9 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {DISCHARGE_BARRIER_CATEGORIES.map((category) => {
              const barriers = getDischargeBarriersForCategory(category.id);
              return (
                <article key={category.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
                  <div className="mt-5 space-y-3">
                    {barriers.map((barrier) => {
                      const isSelected = selectedBarrierIds.has(barrier.id);
                      return (
                        <label
                          key={barrier.id}
                          className={`group block cursor-pointer rounded-2xl border p-4 transition-smooth focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                            isSelected ? "border-primary/45 bg-primary-soft/35" : "border-border bg-background hover:border-primary/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBarrier(barrier.id)}
                            className="sr-only"
                          />
                          <span className="flex items-start gap-3">
                            {isSelected ? (
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            ) : (
                              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            )}
                            <span>
                              <span className="block font-bold leading-snug text-foreground">{barrier.title}</span>
                              <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{barrier.whyItMatters}</span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-3xl border border-primary/20 bg-card p-5 shadow-card xl:sticky xl:top-24 md:p-6" aria-live="polite">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  Your question list
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
                  {selectedBarriers.length === 0
                    ? "No barriers selected"
                    : `${selectedBarriers.length} possible ${selectedBarriers.length === 1 ? "barrier" : "barriers"} to resolve`}
                </h3>
              </div>
              {selectedBarriers.length > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedBarrierIds(new Set())}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
                </Button>
              )}
            </div>

            {selectedBarriers.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/20 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Select any unresolved issue on the left. This is not a discharge clearance score; it is a structured way to identify who needs to answer what.
                </p>
              </div>
            ) : (
              <ol className="mt-5 space-y-4">
                {selectedBarriers.map((barrier, index) => (
                  <li key={barrier.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>
                      <div>
                        <h4 className="font-bold leading-snug text-foreground">{barrier.title}</h4>
                        <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">Ask: {barrier.question}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          People or organizations commonly involved: {barrier.teams.join(", ")}.
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-muted/25 p-4 text-sm leading-relaxed text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p>
                A patient may be medically ready to leave while logistics, funding, equipment, placement, teaching, or home support remain unresolved. If the destination is delayed, ask what safe mobility and therapy plan will protect function while the logistics are being resolved. Urgent safety concerns should be raised directly with the bedside team.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-14" aria-labelledby="family-questions-heading">
          <SectionHeading
            id="family-questions-heading"
            centered
            eyebrow="Family question checklist"
            title="Twelve questions to carry through the hospital stay"
            description="Use the sections that apply. The goal is not to demand one large meeting; it is to make sure the right discipline answers each question before the plan becomes urgent."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {FAMILY_HOSPITAL_QUESTION_GROUPS.map((group) => (
              <article key={group.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-tight text-foreground">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                  {group.questions.map((question, index) => (
                    <li key={question} className="flex items-start gap-2.5">
                      <span className="mt-0.5 font-bold text-primary">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14" aria-labelledby="care-team-map-heading">
          <SectionHeading
            id="care-team-map-heading"
            centered
            eyebrow="Who usually handles what?"
            title="The discharge plan is shared, but responsibility is not interchangeable"
            description="The bedside nurse is often the most visible coordinator, while orders, recommendations, authorization, acceptance, dispensing, delivery, and family decisions remain distributed across the system."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CARE_TEAM_RESPONSIBILITY_MAP.map((item) => (
              <details key={item.id} className="group rounded-3xl border border-border bg-card p-5 shadow-sm open:border-primary/30">
                <summary className="flex cursor-pointer list-none items-start gap-3 font-display text-lg font-bold leading-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <UsersRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 pt-2">{item.role}</span>
                  <span className="pt-2 text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <div className="mt-4 border-t border-border pt-4 text-sm leading-relaxed">
                  <p className="text-foreground"><strong>Usually handles:</strong> {item.usuallyHandles}</p>
                  <p className="mt-3 text-muted-foreground"><strong className="text-foreground">Important limit:</strong> {item.importantLimit}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DischargeReadinessSystem;
