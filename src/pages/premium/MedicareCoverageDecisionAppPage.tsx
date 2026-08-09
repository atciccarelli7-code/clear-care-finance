import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackSiteEvent } from "@/lib/analytics";
import { createMedicareWorkspace, deleteMedicareWorkspace, getMedicareWorkspace, listMedicareWorkspaces, saveMedicareWorkspace } from "@/medicare/apiClient";
import type { MedicareCoverageState, MedicareWorkspaceRecord } from "@/medicare/contracts";
import { MedicareCoverageDecisionSystem } from "@/pages/MedicareCoverageDecisionPage";
import { usePremiumAuth } from "@/premium/auth/AuthProvider";

const WorkspaceList = ({ workspaces, onCreate, onDelete, busy }: { workspaces: MedicareWorkspaceRecord[]; onCreate: () => void; onDelete: (id: string) => void; busy: boolean }) => {
  return <main id="main-content" className="min-h-screen bg-[#f3f7f4] px-4 py-10"><div className="mx-auto max-w-3xl"><Link to="/products/medicare-coverage-decision-system" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="h-4 w-4" />Public Medicare system</Link><Card className="mt-6 rounded-[2rem] shadow-card"><CardHeader><ShieldCheck className="h-10 w-10 text-primary" /><CardTitle className="font-display text-3xl">Saved Medicare workspaces</CardTitle><CardDescription className="text-base leading-relaxed">Store permitted decision preferences, generic candidate structures, verification statuses, cost figures, and completion state. Workspace names are generated to avoid collecting provider, medication, beneficiary, diagnosis, or plan details.</CardDescription></CardHeader><CardContent className="space-y-6"><Button className="min-h-12" disabled={busy} onClick={onCreate}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Plus className="h-4 w-4" />}Create Medicare workspace</Button>{workspaces.length === 0 ? <p className="rounded-2xl bg-muted/40 p-5 text-muted-foreground">No saved Medicare workspace yet.</p> : <ul className="space-y-3">{workspaces.map((workspace) => <li key={workspace.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><Link to={`/app/medicare-coverage-decision/${workspace.id}`} className="font-bold text-primary hover:underline">{workspace.title}</Link><p className="mt-1 text-sm text-muted-foreground">{workspace.progressPercent}% reviewed · updated {new Date(workspace.updatedAt).toLocaleDateString()}</p></div><Button variant="ghost" size="sm" className="min-h-11" aria-label={`Delete ${workspace.title}`} onClick={() => onDelete(workspace.id)}><Trash2 className="h-4 w-4" />Delete</Button></li>)}</ul>}</CardContent></Card></div></main>;
};

export default function MedicareCoverageDecisionAppPage() {
  const auth = usePremiumAuth();
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<MedicareWorkspaceRecord[]>([]);
  const [workspace, setWorkspace] = useState<MedicareWorkspaceRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");
  const saveTimer = useRef<number | null>(null);

  useEffect(() => { trackSiteEvent("medicare_paid_workspace_interest", { event_category: "medicare_decision", interest_type: "workspace_route" }); }, []);

  useEffect(() => {
    if (!auth.accessToken || auth.isDevelopmentDemo) {
      if (auth.isDevelopmentDemo) setStatus("error");
      return;
    }
    let active = true;
    const load = workspaceId ? getMedicareWorkspace(auth.accessToken, workspaceId) : listMedicareWorkspaces(auth.accessToken);
    void load.then((result) => {
      if (!active) return;
      if (Array.isArray(result)) setWorkspaces(result);
      else setWorkspace(result);
      setStatus("ready");
    }).catch(() => active && setStatus("error"));
    return () => { active = false; };
  }, [auth.accessToken, auth.isDevelopmentDemo, workspaceId]);

  const create = async () => {
    if (!auth.accessToken) return;
    setStatus("saving");
    try {
      const created = await createMedicareWorkspace(auth.accessToken);
      trackSiteEvent("premium_workspace_created", { event_category: "premium_system", product_key: "medicare-coverage-decision-system" });
      navigate(`/app/medicare-coverage-decision/${created.id}`);
    } catch { setStatus("error"); }
  };

  const remove = async (id: string) => {
    if (!auth.accessToken || !window.confirm("Delete this Medicare workspace? This cannot be undone.")) return;
    try {
      await deleteMedicareWorkspace(auth.accessToken, id);
      setWorkspaces((current) => current.filter((item) => item.id !== id));
    } catch { setStatus("error"); }
  };

  const queueSave = useCallback((nextState: MedicareCoverageState) => {
    if (!auth.accessToken || !workspaceId) return;
    setStatus("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void saveMedicareWorkspace(auth.accessToken!, workspaceId, nextState)
        .then((saved) => { setWorkspace(saved); setStatus("saved"); })
        .catch(() => setStatus("error"));
    }, 800);
  }, [auth.accessToken, workspaceId]);

  useEffect(() => () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); }, []);

  if (auth.isDevelopmentDemo) return <main id="main-content" className="min-h-screen bg-[#f3f7f4]"><div className="medicare-no-print border-b border-sky-200 bg-sky-50 px-4 py-3 text-center text-sm font-bold text-sky-950">Development-only browser demo · no account, entitlement, payment, or cloud persistence</div><MedicareCoverageDecisionSystem persistenceLabel="Development-only browser state" showProductIntro={false} /></main>;
  if (status === "loading") return <main id="main-content" className="grid min-h-screen place-items-center bg-[#f3f7f4]"><div role="status" className="flex items-center gap-3 font-bold"><LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" />Loading secure Medicare workspace…</div></main>;
  if (!workspaceId) return <WorkspaceList workspaces={workspaces} onCreate={create} onDelete={remove} busy={status === "saving"} />;
  if (!workspace || status === "error") return <main id="main-content" className="grid min-h-screen place-items-center bg-[#f3f7f4] px-4"><Card className="max-w-lg"><CardHeader><CardTitle>Workspace unavailable</CardTitle><CardDescription>The workspace could not be loaded or saved. No browser fallback was activated.</CardDescription></CardHeader><CardContent><Button asChild><Link to="/app/medicare-coverage-decision">Return to workspaces</Link></Button></CardContent></Card></main>;

  return <main id="main-content" className="min-h-screen bg-[#f3f7f4]"><div className="medicare-no-print border-b border-border bg-white"><div className="container flex min-h-16 items-center justify-between gap-4"><Link to="/app/medicare-coverage-decision" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="h-4 w-4" />All Medicare workspaces</Link><span className="text-sm font-semibold text-muted-foreground" role="status" aria-live="polite">{status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Secure workspace"}</span></div></div><MedicareCoverageDecisionSystem key={workspace.id} initialState={workspace.state} onStateChange={queueSave} persistenceLabel="Secure account workspace" showProductIntro={false} /></main>;
}
