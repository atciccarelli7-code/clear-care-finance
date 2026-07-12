import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, Copy, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDecisionWorkspace, upsertDecisionRecord } from "@/lib/decisionWorkspace";

const ownerOptions = ["hospital_case_management", "treating_clinician", "insurance_plan", "receiving_facility", "home_health_agency", "dme_supplier", "pharmacy", "transportation_provider", "patient_family", "state_community_program"] as const;
const baseTasks = [
  ["destination", "Confirm the expected discharge destination and backup destination."],
  ["authorization", "Confirm authorization status, reference, approved dates, and appeal deadline."],
  ["network", "Confirm network status for the facility, agency, supplier, pharmacy, and transport provider."],
  ["acceptance", "Confirm clinical acceptance, financial acceptance, bed or start date, and required arrival documents."],
  ["equipment", "Confirm equipment orders, supplier, delivery timing, rental or purchase, and patient cost."],
  ["medications", "Confirm medication access, formulary status, prior authorization, first-fill location, and affordability."],
  ["transportation", "Confirm transportation level, medical-necessity documentation, provider, time, and estimated cost."],
  ["caregiver", "Confirm which daily-care needs the family must provide or arrange privately."],
  ["followup", "Confirm follow-up appointments, contact numbers, and what symptoms require urgent escalation."],
] as const;

const humanize = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const DischargeCommandCenter = () => {
  const existing = useMemo(() => loadDecisionWorkspace().records.find((item) => item.id === "hospital-discharge-primary"), []);
  const [completed, setCompleted] = useState<string[]>(existing?.completedSteps ?? []);
  const [owner, setOwner] = useState<(typeof ownerOptions)[number]>("hospital_case_management");
  const [appealDate, setAppealDate] = useState(existing?.dueDate ?? "");
  const [saved, setSaved] = useState(Boolean(existing));
  const outstanding = baseTasks.filter(([id]) => !completed.includes(id));
  const riskFlags = [!completed.includes("authorization") ? "Authorization is not documented as complete." : "", !completed.includes("network") ? "Network status is not documented as complete." : "", !completed.includes("caregiver") ? "Daily caregiver needs may remain uncovered or unassigned." : "", appealDate ? `A controlling date is entered: ${appealDate}. Verify it against the written notice.` : "No appeal or follow-up date has been entered."].filter(Boolean);
  const toggle = (id: string) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const summary = ["Hospital Discharge Command Center", ...baseTasks.map(([id, text]) => `- [${completed.includes(id) ? "x" : " "}] ${text}`), `Current next owner: ${humanize(owner)}`, appealDate ? `Appeal/follow-up date: ${appealDate}` : "", ...riskFlags.map((item) => `Risk: ${item}`)].filter(Boolean).join("\n");
  const save = () => { upsertDecisionRecord(loadDecisionWorkspace(), { id: "hospital-discharge-primary", journeyId: "hospital-discharge", fixedCategory: "Hospital Discharge", destinationRoute: "/insurance/hospital-discharge-coverage", completedSteps: completed, outstandingActions: outstanding.map(([id, label]) => ({ id: `discharge-${id}`, category: id, label, owner, dueDate: appealDate || undefined, status: "open" as const })), verificationStatus: outstanding.length ? "in_progress" : "verified", dueDate: appealDate || undefined }); setSaved(true); };
  return <section className="scroll-mt-24"><Card className="rounded-[2rem] border-primary/20 shadow-card"><CardHeader><ClipboardCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl md:text-3xl">Hospital Discharge Command Center</CardTitle><CardDescription>Use this local-only task view during case-management and family meetings. Do not enter names, diagnoses, member IDs, medical-record numbers, claim numbers, or clinical notes.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="grid gap-3 md:grid-cols-2">{baseTasks.map(([id, text]) => <button key={id} type="button" onClick={() => toggle(id)} aria-pressed={completed.includes(id)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left text-sm leading-relaxed transition ${completed.includes(id) ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`}><CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${completed.includes(id) ? "text-emerald-700" : "text-muted-foreground/40"}`} />{text}</button>)}</div><div className="grid gap-4 md:grid-cols-2"><label className="space-y-2"><span className="text-sm font-bold">Who owns the next unresolved action?</span><select className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" value={owner} onChange={(event) => setOwner(event.target.value as (typeof ownerOptions)[number])}>{ownerOptions.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}</select></label><label className="space-y-2"><span className="text-sm font-bold">Appeal or follow-up date</span><input type="date" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" value={appealDate} onChange={(event) => setAppealDate(event.target.value)} /></label></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="font-display text-lg font-bold text-amber-950">Today-before-discharge risk flags</div><ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950/85">{riskFlags.map((item) => <li key={item}>• {item}</li>)}</ul></div><div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="button" variant="hero" onClick={save}><Save className="h-4 w-4" />{saved ? "Update My Plan" : "Save to My Plan"}</Button><Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(summary)}><Copy className="h-4 w-4" />Copy meeting sheet</Button><Button type="button" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button></div></CardContent></Card></section>;
};
