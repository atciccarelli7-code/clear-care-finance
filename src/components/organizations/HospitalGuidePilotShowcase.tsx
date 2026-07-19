import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCheck, HeartHandshake, Printer, Settings2, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hospitalGuidePilotPreviews, type HospitalGuidePilotId } from "@/data/hospitalGuidePilot";
import { trackSiteEvent } from "@/lib/analytics";

type PreviewView = "patient" | "caregiver" | "nurse" | "customize";

const viewConfig: { id: PreviewView; label: string; icon: typeof Users }[] = [
  { id: "patient", label: "Patient sees", icon: Stethoscope },
  { id: "caregiver", label: "Caregiver sees", icon: HeartHandshake },
  { id: "nurse", label: "Nurse uses", icon: ClipboardCheck },
  { id: "customize", label: "Hospital customizes", icon: Settings2 },
];

const listForView = (view: PreviewView, preview: (typeof hospitalGuidePilotPreviews)[number]) => {
  if (view === "caregiver") return preview.caregiverSees;
  if (view === "nurse") return preview.nurseUses;
  if (view === "customize") return preview.customizable;
  return preview.patientSees;
};

const actionStyles = [
  "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-50",
  "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/35 dark:text-amber-50",
  "border-orange-300 bg-orange-50 text-orange-950 dark:border-orange-800 dark:bg-orange-950/35 dark:text-orange-50",
  "border-red-300 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950/35 dark:text-red-50",
] as const;

export const HospitalGuidePilotShowcase = () => {
  const [activeId, setActiveId] = useState<HospitalGuidePilotId>(hospitalGuidePilotPreviews[0].id);
  const [view, setView] = useState<PreviewView>("patient");
  const preview = hospitalGuidePilotPreviews.find((item) => item.id === activeId) ?? hospitalGuidePilotPreviews[0];

  const selectPreview = (id: HospitalGuidePilotId) => {
    setActiveId(id);
    setView("patient");
    trackSiteEvent("sample_guide_opened", { item_id: id, guide_id: id });
  };

  const selectView = (nextView: PreviewView) => {
    setView(nextView);
    if (nextView === "caregiver") trackSiteEvent("caregiver_section_viewed", { item_id: activeId, guide_id: activeId });
    if (nextView === "nurse") trackSiteEvent("teach_back_preview_viewed", { item_id: activeId, guide_id: activeId });
  };

  const printPreview = () => {
    trackSiteEvent("printable_guide_selected", { item_id: activeId, guide_id: activeId });
    window.print();
  };

  return (
    <section id="pilot-packages" className="hospital-guide-pilot-demo scroll-mt-28 border-y border-border bg-card/30 py-14 md:py-20" aria-labelledby="pilot-packages-title">
      <div className="container max-w-7xl">
        <div className="max-w-4xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Five-package controlled demonstration</div>
          <h2 id="pilot-packages-title" className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">See the patient, caregiver, nurse, and customization layers together.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">These are substantial product previews, not complete licensable guides or approved clinical handouts. Each package uses the same structure while keeping medicine-, device-, condition-, and hospital-specific decisions inside qualified review.</p>
        </div>

        <nav className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5 print:hidden" aria-label="Pilot guide packages">
          {hospitalGuidePilotPreviews.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === activeId}
              onClick={() => selectPreview(item.id)}
              className={`min-h-36 rounded-2xl border p-4 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${item.id === activeId ? "border-primary bg-primary text-primary-foreground shadow-card" : "border-border bg-background hover:border-primary/40 hover:shadow-sm"}`}
            >
              <span className={`text-xs font-bold uppercase tracking-[0.14em] ${item.id === activeId ? "text-primary-foreground/75" : "text-primary"}`}>Package {index + 1}</span>
              <span className="mt-3 block font-display text-lg font-bold leading-tight">{item.shortTitle}</span>
              <span className={`mt-2 block text-xs leading-relaxed ${item.id === activeId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.status}</span>
            </button>
          ))}
        </nav>

        <article className="mt-7 rounded-[2rem] border border-primary/20 bg-background p-5 shadow-card print:mt-0 print:border-0 print:p-0 print:shadow-none md:p-8" aria-live="polite">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-primary">{preview.status}</span>
                <span className="rounded-full border border-border px-3 py-1">{preview.riskTier} risk</span>
                <span className="rounded-full border border-border px-3 py-1">Controlled public preview</span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">{preview.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{preview.audience}</p>
              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary-soft/25 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">The most important thing</div>
                <p className="mt-2 font-display text-xl font-bold leading-snug">{preview.primaryAction}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">What this package proves</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{preview.purpose}</p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong>Review status:</strong> {preview.reviewNote}</p>
              <Button type="button" variant="outline" className="mt-5 print:hidden" onClick={printPreview}><Printer className="h-4 w-4" /> Print this sample view</Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 print:hidden" role="tablist" aria-label="Package perspectives">
            {viewConfig.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => selectView(id)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />{label}
              </button>
            ))}
          </div>

          <section className="mt-5 rounded-2xl border border-border bg-card p-5 print:break-inside-avoid" role="tabpanel" aria-label={viewConfig.find((item) => item.id === view)?.label}>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{viewConfig.find((item) => item.id === view)?.label}</div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {listForView(view, preview).map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}
            </ul>
          </section>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-2xl border border-border p-5 print:break-inside-avoid">
              <h4 className="font-display text-xl font-bold">One-page quick-guide sample</h4>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed">
                {preview.quickChecklist.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span>{item}</li>)}
              </ol>
            </section>
            <section className="rounded-2xl border border-border p-5 print:break-inside-avoid">
              <h4 className="font-display text-xl font-bold">Action and warning-sign sample</h4>
              <p className="mt-2 text-sm text-muted-foreground">Words and borders carry meaning in addition to color. The guide does not diagnose the cause of a symptom.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {preview.actionLevels.map((level, index) => <div key={level.label} className={`rounded-xl border p-4 text-sm ${actionStyles[index]}`}><div className="font-bold">{level.label}</div><p className="mt-1 leading-relaxed opacity-90">{level.description}</p></div>)}
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-border p-5 print:break-inside-avoid">
              <h4 className="font-display text-xl font-bold">Teach-back sample</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">“We want to be sure we explained this clearly. Please show or explain the plan in your own words.”</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{preview.teachBack.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="rounded-2xl border border-border p-5 print:break-inside-avoid">
              <h4 className="font-display text-xl font-bold">Source and review marker</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Current authoritative source families used in the private claim dossiers:</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{preview.sourceLabels.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Version 0.4 review · Last reviewed July 18, 2026 · Not approved for patient use · Full claim records and reviewer materials withheld from the public site.</p>
            </section>
          </div>
          {preview.id === "blood_thinners" && (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary-soft/20 p-5 print:hidden">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Working flagship pilot</div>
              <h4 className="mt-2 font-display text-xl font-bold">Do more than preview a handout.</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Run the exact-medication, teach-back, barrier-resolution, completion, and handoff workflow using synthetic choices.</p>
              <Button asChild className="mt-4"><Link to="/for-organizations/patient-education-systems/blood-thinner-readiness">Open Blood Thinner Discharge Readiness</Link></Button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
