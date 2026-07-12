import { useMemo, useState } from "react";
import { ClipboardCheck, Copy, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDecisionWorkspace, removeDecisionRecord, upsertDecisionRecord } from "@/lib/decisionWorkspace";

const options = {
  document: ["not_sure", "provider_bill", "eob_or_msn", "denial_notice", "collection_notice", "estimate"],
  payer: ["unknown", "commercial", "medicare", "medicare_advantage", "medicaid", "self_pay"],
  problem: ["unknown", "not_processed", "bill_eob_mismatch", "network", "authorization", "duplicate", "affordability", "collections"],
  status: ["organizing", "waiting_provider", "waiting_payer", "appeal_pending", "assistance_pending", "resolved"],
  owner: ["provider_billing", "insurance_plan", "ordering_provider", "financial_assistance", "appeals", "patient_family"],
} as const;

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const MedicalBillCaseDashboard = () => {
  const existing = useMemo(() => loadDecisionWorkspace().records.find((item) => item.id === "medical-bill-primary"), []);
  const [documentCategory, setDocumentCategory] = useState("not_sure");
  const [payerCategory, setPayerCategory] = useState("unknown");
  const [problemCategory, setProblemCategory] = useState("unknown");
  const [status, setStatus] = useState(existing?.verificationStatus === "verified" ? "resolved" : "organizing");
  const [owner, setOwner] = useState("patient_family");
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [saved, setSaved] = useState(Boolean(existing));

  const missing = [documentCategory === "not_sure" ? "Identify the document before deciding whether payment is due." : "", payerCategory === "unknown" ? "Identify which payer processed or should process the claim." : "", problemCategory === "unknown" ? "Classify the issue after comparing the bill with the payer explanation." : ""].filter(Boolean);
  const next = status === "resolved" ? "Save the written resolution and final zero or corrected balance confirmation." : owner === "provider_billing" ? "Ask the provider billing office for an itemized bill and claim-processing explanation." : owner === "insurance_plan" ? "Ask the plan for claim status, allowed amount, denial reason, and written appeal instructions." : owner === "ordering_provider" ? "Ask the ordering office what authorization or documentation was submitted and what remains missing." : owner === "financial_assistance" ? "Request the written financial-assistance policy, application, required documents, and account-hold process." : owner === "appeals" ? "Follow the written notice and verify the appeal deadline and submission method." : "Gather the bill, EOB or MSN, denial notices, and every deadline before the next call.";

  const save = () => {
    const workspace = loadDecisionWorkspace();
    upsertDecisionRecord(workspace, { id: "medical-bill-primary", journeyId: "medical-bills", fixedCategory: "Medical Bill Resolution", destinationRoute: "/insurance/medical-bill-review-toolkit", completedSteps: [documentCategory, payerCategory, problemCategory].filter((item) => !["not_sure", "unknown"].includes(item)), outstandingActions: [{ id: "medical-bill-next", category: problemCategory, label: next, owner, dueDate: dueDate || undefined, status: status === "resolved" ? "complete" : "open" }], verificationStatus: status === "resolved" ? "verified" : "in_progress", dueDate: dueDate || undefined });
    setSaved(true);
  };
  const clear = () => { removeDecisionRecord(loadDecisionWorkspace(), "medical-bill-primary"); setSaved(false); };
  const copy = () => navigator.clipboard.writeText(["Medical Bill Resolution Case", `Document: ${label(documentCategory)}`, `Payer: ${label(payerCategory)}`, `Problem: ${label(problemCategory)}`, `Status: ${label(status)}`, `Next owner: ${label(owner)}`, dueDate ? `Deadline/follow-up: ${dueDate}` : "", `Next action: ${next}`, ...missing.map((item) => `Missing: ${item}`)].filter(Boolean).join("\n"));

  const select = (title: string, value: string, values: readonly string[], onChange: (value: string) => void) => <label className="space-y-2"><span className="text-sm font-bold">{title}</span><select className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>;

  return <section className="scroll-mt-24"><Card className="rounded-[2rem] border-primary/20 shadow-card"><CardHeader><ClipboardCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl md:text-3xl">Medical Bill Case Dashboard</CardTitle><CardDescription>Keep one structured, local-only status view. Do not enter names, diagnoses, provider names, claim numbers, member IDs, account numbers, procedures, or medical notes.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{select("Document category", documentCategory, options.document, setDocumentCategory)}{select("Payer category", payerCategory, options.payer, setPayerCategory)}{select("Problem category", problemCategory, options.problem, setProblemCategory)}{select("Case status", status, options.status, setStatus)}{select("Who owns the next action?", owner, options.owner, setOwner)}<label className="space-y-2"><span className="text-sm font-bold">Appeal or follow-up date</span><input type="date" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label></div><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-primary/20 bg-primary-soft/25 p-5"><div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Next action</div><p className="mt-2 text-sm leading-relaxed">{next}</p></div><div className="rounded-2xl border border-border p-5"><div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Still missing</div>{missing.length ? <ul className="mt-2 space-y-2 text-sm text-muted-foreground">{missing.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">The basic case categories are identified. Continue with the written notice and official verification.</p>}</div></div><div className="flex flex-col gap-3 sm:flex-row print:hidden"><Button type="button" variant="hero" onClick={save}><Save className="h-4 w-4" />{saved ? "Update My Plan" : "Save to My Plan"}</Button><Button type="button" variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy case summary</Button><Button type="button" variant="ghost" onClick={clear}><Trash2 className="h-4 w-4" />Clear saved case</Button></div></CardContent></Card></section>;
};
