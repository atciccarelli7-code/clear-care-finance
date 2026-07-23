import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, Download, FileText, History, LayoutDashboard, Library, ListChecks, Loader2, LockKeyhole, LogOut, Menu, Printer, RefreshCw, Save, ShieldCheck, Square, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";

type Module = {
  id: string;
  number: string;
  part: string;
  title: string;
  purpose: string;
  orientation: string;
  framingQuestions: string[];
  comparisonFields: string[];
  actions: string[];
  professionalQuestions: string[];
  completionCriteria: string[];
  relatedModuleIds: string[];
  sourceIds: string[];
};

type Source = { id: string; agency: string; title: string; url: string };
type Product = {
  id: string;
  name: string;
  sourceEditionName: string;
  version: string;
  sourceVersion: string;
  sourceReviewDate: string;
  audience: string;
  outcome: string;
  purchaseModel: { type: string; automaticRenewal: boolean; access: string; updates: string; ads: boolean };
  privacy: { savedToAccount: string[]; keptInBrowser: string[]; prohibited: string[] };
  modules: Module[];
  sources: Source[];
  updateHistory: Array<{ version: string; date: string; type: string; summary: string }>;
  limitation: string;
};
type Progress = { completedModuleIds: string[]; activeModuleId: string; completedTaskIds: string[]; updatedAt: string };
type WorkspacePayload = { product: Product; progress: Progress; access: { purchasedAt: string; updatesUntil: string; accessStatus: string; testMode: boolean } };
type WorkspaceView = "dashboard" | "sources" | "updates" | string;

const DOCUMENT_TASKS = [
  { id: "document:offer", label: "Written offer, role description, or current pay record" },
  { id: "document:rates", label: "Correct plan-year premium rate sheet" },
  { id: "document:sbc", label: "Summary of Benefits and Coverage for each medical plan" },
  { id: "document:retirement", label: "Retirement SPD, match formula, eligibility, and vesting" },
  { id: "document:leave", label: "PTO, leave, disability, holiday, and scheduling policies" },
  { id: "document:repayment", label: "Every sign-on, tuition, relocation, or retention agreement" },
];

const noteKey = (productId: string, moduleId: string) => `caf-premium-note:${productId}:${moduleId}`;

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function ProgressRing({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid h-24 w-24 place-items-center rounded-full" style={{ background: `conic-gradient(#0b6b4f ${safe}%, #dce7df ${safe}% 100%)` }} role="img" aria-label={`${safe}% complete`}>
      <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-white text-center"><span className="font-display text-2xl font-bold text-[#12372b]">{safe}%</span></div>
    </div>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6"><div className="font-semibold">{title}</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>;
}

export default function PremiumHealthcareBenefitsWorkspacePage() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<WorkspacePayload | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<WorkspaceView>("dashboard");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [printScope, setPrintScope] = useState<"current" | "summary">("current");
  const initialLoad = useRef(true);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/premium-workspace", { credentials: "include", cache: "no-store" });
      if (response.status === 401 || response.status === 403) {
        navigate(`/premium/access?state=${response.status === 401 ? "expired" : "purchase-required"}`, { replace: true });
        return;
      }
      if (!response.ok) throw new Error("The secure workspace could not be loaded.");
      const next = await response.json() as WorkspacePayload;
      setPayload(next);
      setProgress(next.progress);
      setView((current) => current === "dashboard" ? "dashboard" : next.progress.activeModuleId);
      const storedNotes: Record<string, string> = {};
      next.product.modules.forEach((module) => { storedNotes[module.id] = window.localStorage.getItem(noteKey(next.product.id, module.id)) || ""; });
      setNotes(storedNotes);
      trackSiteEvent("premium_dashboard_viewed", { event_category: "premium", product_id: next.product.id, product_version: next.product.version });
      const priorVisit = window.localStorage.getItem(`caf-premium-visit:${next.product.id}`);
      if (priorVisit) trackSiteEvent("premium_return_visit", { event_category: "premium", product_id: next.product.id, return_window: "known_browser" });
      window.localStorage.setItem(`caf-premium-visit:${next.product.id}`, new Date().toISOString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The secure workspace could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.dataset.premiumRoute = "true";
    const robots = document.querySelector('meta[name="robots"]') || document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }));
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    void loadWorkspace();
    return () => { delete document.documentElement.dataset.premiumRoute; };
  }, [loadWorkspace]);

  useEffect(() => {
    if (!progress || !payload || initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const handle = window.setTimeout(async () => {
      setSaving(true);
      try {
        const response = await fetch("/api/premium-workspace", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progress),
        });
        if (!response.ok) throw new Error();
      } catch {
        setError("Progress could not be synchronized. Your browser notes remain local.");
      } finally {
        setSaving(false);
      }
    }, 450);
    return () => window.clearTimeout(handle);
  }, [payload, progress]);

  const product = payload?.product;
  const modules = product?.modules || [];
  const activeModule = modules.find((module) => module.id === view) || null;
  const completed = progress?.completedModuleIds || [];
  const percent = modules.length ? Math.round((completed.length / modules.length) * 100) : 0;
  const nextModule = modules.find((module) => !completed.includes(module.id)) || modules[modules.length - 1];
  const sourceMap = useMemo(() => new Map((product?.sources || []).map((source) => [source.id, source])), [product]);

  const updateProgress = (patch: Partial<Progress>) => {
    setProgress((current) => current ? { ...current, ...patch, updatedAt: new Date().toISOString() } : current);
  };

  const openModule = (moduleId: string) => {
    setView(moduleId);
    setMenuOpen(false);
    updateProgress({ activeModuleId: moduleId });
    trackSiteEvent("premium_module_started", { event_category: "premium", product_id: product?.id, module_id: moduleId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleModule = (moduleId: string) => {
    const isComplete = completed.includes(moduleId);
    const completedModuleIds = isComplete ? completed.filter((id) => id !== moduleId) : [...completed, moduleId];
    updateProgress({ completedModuleIds, activeModuleId: isComplete ? moduleId : (modules.find((module) => !completedModuleIds.includes(module.id))?.id || moduleId) });
    trackSiteEvent(isComplete ? "premium_module_reopened" : "premium_module_completed", { event_category: "premium", product_id: product?.id, module_id: moduleId });
  };

  const toggleTask = (taskId: string) => {
    const current = progress?.completedTaskIds || [];
    updateProgress({ completedTaskIds: current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId] });
  };

  const updateNote = (moduleId: string, value: string) => {
    setNotes((current) => ({ ...current, [moduleId]: value }));
    if (product) window.localStorage.setItem(noteKey(product.id, moduleId), value);
  };

  const copyQuestions = async (module: Module) => {
    await navigator.clipboard.writeText(`${module.title}\n\n${module.professionalQuestions.map((question, index) => `${index + 1}. ${question}`).join("\n")}`);
    trackSiteEvent("premium_question_list_generated", { event_category: "premium", product_id: product?.id, module_id: module.id });
  };

  const printWorkspace = (scope: "current" | "summary") => {
    setPrintScope(scope);
    trackSiteEvent("premium_pdf_generated", { event_category: "premium", product_id: product?.id, output_type: scope === "summary" ? "decision_summary" : "current_module" });
    window.setTimeout(() => window.print(), 50);
  };

  const downloadTextSummary = () => {
    if (!product || !progress) return;
    const lines = [
      "COMMUNITY ACQUIRED FINANCE",
      product.name,
      `Product version: ${product.version}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Progress: ${completed.length} of ${modules.length} modules complete`,
      "",
      ...modules.flatMap((module) => [
        `${module.number} — ${module.title}`,
        `Status: ${completed.includes(module.id) ? "Complete" : "Open"}`,
        notes[module.id] ? `Private browser note: ${notes[module.id]}` : "Private browser note: None recorded",
        "",
      ]),
      "LIMITATION",
      product.limitation,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `CAF-healthcare-benefits-decision-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    trackSiteEvent("premium_summary_exported", { event_category: "premium", product_id: product.id, output_type: "local_text" });
  };

  const logout = async () => {
    await fetch("/api/premium-session", { method: "DELETE", credentials: "include" }).catch(() => undefined);
    navigate("/premium/access", { replace: true });
  };

  if (loading) return <div className="grid min-h-[70vh] place-items-center bg-[#f4f6f2]"><div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 text-sm font-semibold shadow-card" role="status"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading secure workspace…</div></div>;
  if (!payload || !progress || !product) return <div className="bg-[#f4f6f2] py-20"><div className="container max-w-2xl"><div className="rounded-3xl border border-border bg-white p-8 text-center shadow-card"><LockKeyhole className="mx-auto h-10 w-10 text-primary" /><h1 className="mt-5 font-display text-3xl font-bold">Workspace unavailable</h1><p className="mt-3 text-muted-foreground">{error || "The protected product could not be loaded."}</p><div className="mt-6 flex justify-center gap-3"><Button onClick={() => void loadWorkspace()}><RefreshCw className="h-4 w-4" /> Retry</Button><Button asChild variant="outline"><Link to="/premium/access">Access page</Link></Button></div></div></div></div>;

  return (
    <div className={`min-h-screen bg-[#f4f6f2] text-[#183326] ${printScope === "summary" ? "premium-print-summary" : "premium-print-current"}`}>
      <style>{`@media print{header,footer,.premium-no-print{display:none!important}.premium-shell{display:block!important}.premium-print-surface{box-shadow:none!important;border:0!important;padding:0!important}.premium-print-only{display:block!important}.premium-screen-only{display:none!important}.premium-print-summary .premium-shell{display:none!important}.premium-print-current .premium-print-only{display:none!important}body{background:#fff!important}.premium-module-page{break-before:page}.premium-module-page:first-child{break-before:auto}a{color:#183326!important;text-decoration:none!important}}@media screen{.premium-print-only{display:none!important}}`}</style>
      <header className="premium-no-print sticky top-0 z-40 border-b border-[#cfdbd2] bg-white/95 backdrop-blur">
        <div className="container flex min-h-16 max-w-[1500px] items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle workspace navigation">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold uppercase tracking-[.14em] text-primary">CAF private client workspace</div><div className="truncate text-sm font-semibold">{product.name}</div></div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">{saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing</> : <><Save className="h-3.5 w-3.5" /> Progress synced</>}</div>
          <Button variant="ghost" size="sm" onClick={() => printWorkspace("summary")}><Printer className="h-4 w-4" /><span className="hidden sm:inline">Print summary</span></Button>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out"><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="premium-shell container grid max-w-[1500px] gap-6 py-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-8">
        <aside className={`${menuOpen ? "block" : "hidden"} premium-no-print lg:block`}>
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-[#cfdbd2] bg-white p-3 shadow-sm">
            <button onClick={() => { setView("dashboard"); setMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${view === "dashboard" ? "bg-[#e1efe7] text-[#07543d]" : "hover:bg-muted/50"}`}><LayoutDashboard className="h-4 w-4" /> Dashboard</button>
            <div className="my-3 border-t border-border" />
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">Decision modules</div>
            <nav aria-label="Premium modules" className="space-y-1">
              {modules.map((module) => {
                const isComplete = completed.includes(module.id);
                const isActive = view === module.id;
                return <button key={module.id} onClick={() => openModule(module.id)} className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isActive ? "bg-[#e1efe7] text-[#07543d]" : "hover:bg-muted/50"}`}><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${isComplete ? "bg-[#0b6b4f] text-white" : "border border-border bg-white"}`}>{isComplete ? <Check className="h-3.5 w-3.5" /> : module.number}</span><span><span className="block font-semibold leading-tight">{module.title}</span><span className="mt-1 block text-xs text-muted-foreground">{module.part}</span></span></button>;
              })}
            </nav>
            <div className="my-3 border-t border-border" />
            <button onClick={() => { setView("sources"); setMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${view === "sources" ? "bg-[#e1efe7] text-[#07543d]" : "hover:bg-muted/50"}`}><Library className="h-4 w-4" /> Source library</button>
            <button onClick={() => { setView("updates"); setMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${view === "updates" ? "bg-[#e1efe7] text-[#07543d]" : "hover:bg-muted/50"}`}><History className="h-4 w-4" /> Update history</button>
          </div>
        </aside>

        <section className="min-w-0">
          {error && <div className="premium-no-print mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="alert">{error}</div>}

          {view === "dashboard" && (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-[2rem] border border-[#cfdbd2] bg-[#073b2d] p-7 text-white shadow-card md:p-10">
                <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Edition {product.version} · Source reviewed {formatDate(product.sourceReviewDate)}</div><h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Make the decision auditable—not merely intuitive.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50/85">{product.outcome}</p></div>
                  <div className="flex items-center gap-5 rounded-3xl border border-white/15 bg-white/5 p-5"><ProgressRing value={percent} /><div><div className="text-sm text-emerald-100">Overall progress</div><div className="mt-1 text-2xl font-bold">{completed.length} of {modules.length}</div><div className="mt-1 text-xs text-emerald-100/75">modules complete</div></div></div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3"><Button className="bg-white text-[#073b2d] hover:bg-emerald-50" onClick={() => openModule(progress.activeModuleId || nextModule.id)}>Continue where you left off <ArrowRight className="h-4 w-4" /></Button><Button variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => printWorkspace("summary")}><Printer className="h-4 w-4" /> Print / save decision summary</Button></div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-[#cfdbd2] bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Access status</div><div className="mt-4 text-xl font-bold">Active purchased edition</div><p className="mt-2 text-sm text-muted-foreground">Purchased {formatDate(payload.access.purchasedAt)}</p>{payload.access.testMode && <span className="mt-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">Test-mode entitlement</span>}</div>
                <div className="rounded-3xl border border-[#cfdbd2] bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-primary" /> Included updates</div><div className="mt-4 text-xl font-bold">Through {formatDate(payload.access.updatesUntil)}</div><p className="mt-2 text-sm text-muted-foreground">No automatic renewal. Continued access applies to the purchased edition.</p></div>
                <div className="rounded-3xl border border-[#cfdbd2] bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-primary" /> Saved-data boundary</div><div className="mt-4 text-xl font-bold">Progress only</div><p className="mt-2 text-sm text-muted-foreground">Notes and calculator inputs stay in this browser and are not transmitted to CAF.</p></div>
              </section>

              <section className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-primary">Recommended next step</div><h2 className="mt-2 font-display text-3xl font-bold">{nextModule.number}. {nextModule.title}</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{nextModule.purpose}</p></div><Button onClick={() => openModule(nextModule.id)}>Open module <ChevronRight className="h-4 w-4" /></Button></div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                <div className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-primary" /><h2 className="font-display text-2xl font-bold">Controlling-document checklist</h2></div><p className="mt-2 text-sm text-muted-foreground">Record document names and effective dates in your local notes. Do not upload confidential files.</p><div className="mt-5 space-y-2">{DOCUMENT_TASKS.map((task) => { const checked = progress.completedTaskIds.includes(task.id); return <button key={task.id} onClick={() => toggleTask(task.id)} className="flex w-full items-start gap-3 rounded-2xl border border-border p-4 text-left hover:bg-muted/30"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${checked ? "border-primary bg-primary text-white" : "border-border bg-white"}`}>{checked && <Check className="h-3.5 w-3.5" />}</span><span className={`text-sm ${checked ? "text-muted-foreground line-through" : "font-medium"}`}>{task.label}</span></button>; })}</div></div>
                <div className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" /><h2 className="font-display text-2xl font-bold">Outputs</h2></div><div className="mt-5 space-y-3"><Button variant="outline" className="min-h-12 w-full justify-start" onClick={() => printWorkspace("summary")}><Printer className="h-4 w-4" /> Print or save the dated election summary</Button><Button variant="outline" className="min-h-12 w-full justify-start" onClick={downloadTextSummary}><Download className="h-4 w-4" /> Download local text backup</Button><Button variant="outline" className="min-h-12 w-full justify-start" onClick={() => setView("sources")}><BookOpen className="h-4 w-4" /> Review source library</Button></div><div className="mt-5 rounded-2xl bg-[#f2f6f3] p-4 text-xs leading-relaxed text-muted-foreground">Print output is generated in your browser. Use the system print dialog to save a PDF. CAF does not receive the private notes included in that output.</div></div>
              </section>

              <section className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">All modules</h2><span className="text-sm text-muted-foreground">{completed.length} complete</span></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{modules.map((module) => { const isComplete = completed.includes(module.id); return <button key={module.id} onClick={() => openModule(module.id)} className="group rounded-2xl border border-border p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[.12em] text-primary">{module.number} · {module.part}</span>{isComplete ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground/50" />}</div><h3 className="mt-3 font-display text-xl font-bold">{module.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{module.purpose}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Open <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span></button>; })}</div></section>
            </div>
          )}

          {activeModule && (
            <article className="premium-print-surface rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-9">
              <div className="premium-no-print flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5"><button className="text-sm font-semibold text-primary hover:underline" onClick={() => setView("dashboard")}>← Dashboard</button><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => printWorkspace("current")}><Printer className="h-4 w-4" /> Print module</Button><Button size="sm" variant={completed.includes(activeModule.id) ? "outline" : "default"} onClick={() => toggleModule(activeModule.id)}>{completed.includes(activeModule.id) ? <><RefreshCw className="h-4 w-4" /> Reopen module</> : <><Check className="h-4 w-4" /> Mark complete</>}</Button></div></div>
              <div className="mt-7"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Module {activeModule.number} / {activeModule.part}</div><h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{activeModule.title}</h1><p className="mt-5 max-w-4xl text-lg leading-relaxed text-muted-foreground">{activeModule.purpose}</p></div>

              <div className="mt-8 rounded-3xl border border-[#c8dcd0] bg-[#eff6f1] p-6"><div className="text-sm font-bold text-[#07543d]">Orientation</div><p className="mt-2 leading-relaxed text-[#315447]">{activeModule.orientation}</p></div>

              <section className="mt-9"><h2 className="font-display text-2xl font-bold">Three questions that frame the decision</h2><ol className="mt-4 grid gap-3 md:grid-cols-3">{activeModule.framingQuestions.map((question, index) => <li key={question} className="rounded-2xl border border-border bg-[#fbfcfa] p-5"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#073b2d] text-xs font-bold text-white">{index + 1}</span><p className="mt-4 text-sm font-semibold leading-relaxed">{question}</p></li>)}</ol></section>

              <section className="mt-9 grid gap-7 xl:grid-cols-[1.05fr_.95fr]"><div><h2 className="font-display text-2xl font-bold">Comparison record</h2><p className="mt-2 text-sm text-muted-foreground">Use current written terms. Keep unknown fields unresolved instead of filling them with optimistic assumptions.</p><div className="mt-4 overflow-hidden rounded-2xl border border-border"><table className="w-full border-collapse text-sm"><thead className="bg-[#f2f6f3] text-left"><tr><th className="px-4 py-3">Decision factor</th><th className="px-4 py-3">Option A</th><th className="px-4 py-3">Option B / source</th></tr></thead><tbody>{activeModule.comparisonFields.map((field) => <tr key={field} className="border-t border-border"><th className="px-4 py-3 text-left font-semibold">{field}</th><td className="px-4 py-3 text-muted-foreground">Record locally</td><td className="px-4 py-3 text-muted-foreground">Verified / Estimated / Assumed / Unresolved</td></tr>)}</tbody></table></div></div><div><h2 className="font-display text-2xl font-bold">Close the module</h2><div className="mt-4 space-y-3">{activeModule.actions.map((action) => <div key={action} className="flex gap-3 rounded-2xl border border-border p-4"><ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span className="text-sm leading-relaxed">{action}</span></div>)}</div></div></section>

              <section className="mt-9 rounded-3xl border border-border bg-[#fbfcfa] p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">Copy-ready questions</h2><p className="mt-2 text-sm text-muted-foreground">Send only the questions you need. Do not email confidential documents to CAF.</p></div><Button className="premium-no-print" variant="outline" size="sm" onClick={() => void copyQuestions(activeModule)}><ClipboardCheck className="h-4 w-4" /> Copy questions</Button></div><ol className="mt-5 space-y-3">{activeModule.professionalQuestions.map((question, index) => <li key={question} className="flex gap-3 text-sm leading-relaxed"><span className="font-bold text-primary">{index + 1}.</span><span>{question}</span></li>)}</ol></section>

              <section className="mt-9"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">Private decision note</h2><p className="mt-2 text-sm text-muted-foreground">Stored only in this browser. It is not synchronized to your account or analytics.</p></div><LockKeyhole className="h-5 w-5 text-primary" /></div><textarea value={notes[activeModule.id] || ""} onChange={(event) => updateNote(activeModule.id, event.target.value.slice(0, 8000))} className="premium-no-print mt-4 min-h-44 w-full resize-y rounded-2xl border border-border bg-white p-4 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Record your election, decisive reasons, source names and effective dates, accepted tradeoffs, unresolved facts, actions, reversal conditions, and review date. Do not enter sensitive identifiers or upload documents." /><div className="premium-print-only mt-4 min-h-24 whitespace-pre-wrap rounded-2xl border border-border p-4 text-sm">{notes[activeModule.id] || "No private browser note recorded."}</div></section>

              <section className="mt-9 grid gap-6 lg:grid-cols-2"><div><h2 className="font-display text-2xl font-bold">Completion state</h2><div className="mt-4 space-y-2">{activeModule.completionCriteria.map((criterion) => <div key={criterion} className="flex items-start gap-3 rounded-2xl border border-border p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span className="text-sm leading-relaxed">{criterion}</span></div>)}</div></div><div><h2 className="font-display text-2xl font-bold">Sources and related modules</h2>{activeModule.sourceIds.length ? <div className="mt-4 space-y-2">{activeModule.sourceIds.map((id) => { const source = sourceMap.get(id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-border p-4 text-sm hover:border-primary/30"><span className="font-semibold">{source.agency}</span><span className="mt-1 block text-muted-foreground">{source.title}</span></a> : null; })}</div> : <EmptyPanel title="Controlling documents first" body="This module depends primarily on the exact employer plan, certificate, policy, agreement, directory, or written response rather than one universal federal source." />}<div className="premium-no-print mt-4 flex flex-wrap gap-2">{activeModule.relatedModuleIds.map((id) => { const module = modules.find((candidate) => candidate.id === id); return module ? <Button key={id} variant="outline" size="sm" onClick={() => openModule(id)}>{module.number}. {module.title}</Button> : null; })}</div></div></section>

              <div className="premium-no-print mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><Button variant="outline" onClick={() => setView("dashboard")}>Return to dashboard</Button><Button onClick={() => toggleModule(activeModule.id)}>{completed.includes(activeModule.id) ? "Reopen module" : "Mark module complete"}</Button></div>
            </article>
          )}

          {view === "sources" && <section className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-9"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Governed source library</div><h1 className="mt-3 font-display text-4xl font-bold">Sources support the framework. Your documents control your decision.</h1><p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">Federal sources explain broad rules and concepts. The exact offer, Summary Plan Description, Summary of Benefits and Coverage, policy, certificate, provider directory, formulary, repayment agreement, and written employer response control the facts that apply to a specific workplace decision.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{product.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border p-5 hover:border-primary/30"><div className="text-xs font-bold uppercase tracking-[.12em] text-primary">{source.agency}</div><div className="mt-2 font-display text-xl font-bold">{source.title}</div><div className="mt-3 text-sm font-semibold text-primary">Open official source ↗</div></a>)}</div><div className="mt-8 rounded-3xl bg-[#eff6f1] p-6 text-sm leading-relaxed"><strong>Source review date:</strong> {formatDate(product.sourceReviewDate)}. Recheck year-specific limits and time-sensitive figures before acting.</div></section>}

          {view === "updates" && <section className="rounded-[2rem] border border-[#cfdbd2] bg-white p-6 shadow-sm md:p-9"><div className="text-xs font-bold uppercase tracking-[.16em] text-primary">Product governance</div><h1 className="mt-3 font-display text-4xl font-bold">Update history</h1><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Substantive changes affect decision logic, content, sources, or outputs. Cosmetic changes do not extend the included update period.</p><div className="mt-8 space-y-4">{product.updateHistory.map((update) => <article key={`${update.version}-${update.date}`} className="grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-[150px_1fr]"><div><div className="font-display text-2xl font-bold">v{update.version}</div><div className="mt-1 text-sm text-muted-foreground">{formatDate(update.date)}</div><span className="mt-3 inline-flex rounded-full bg-[#e1efe7] px-2.5 py-1 text-xs font-bold text-[#07543d]">{update.type}</span></div><p className="text-sm leading-relaxed text-muted-foreground">{update.summary}</p></article>)}</div><div className="mt-8 rounded-3xl border border-border bg-[#fbfcfa] p-6"><div className="font-semibold">Your included update period</div><p className="mt-2 text-sm text-muted-foreground">Substantive updates included through {formatDate(payload.access.updatesUntil)}. There is no automatic renewal.</p></div></section>}
        </section>
      </div>

      <section className={`premium-print-only ${printScope === "summary" ? "block" : "hidden"}`}>
        <div className="mb-8 border-b-2 border-[#183326] pb-5"><div className="text-xs font-bold uppercase tracking-[.16em]">Community Acquired Finance · Private client decision record</div><h1 className="mt-3 text-3xl font-bold">{product.name}</h1><p className="mt-2 text-sm">Version {product.version} · Generated {new Date().toLocaleString()}</p></div>
        {modules.map((module) => <section key={module.id} className="premium-module-page py-5"><div className="text-xs font-bold uppercase">Module {module.number} · {module.part}</div><h2 className="mt-2 text-2xl font-bold">{module.title}</h2><p className="mt-2 text-sm">Status: {completed.includes(module.id) ? "Complete" : "Open"}</p><h3 className="mt-5 font-bold">Private browser note</h3><div className="mt-2 whitespace-pre-wrap rounded border p-4 text-sm">{notes[module.id] || "No private browser note recorded."}</div></section>)}
        <div className="premium-module-page py-5"><h2 className="text-2xl font-bold">Important limitation</h2><p className="mt-3 text-sm leading-relaxed">{product.limitation}</p><p className="mt-4 text-sm">Source edition reviewed {formatDate(product.sourceReviewDate)}. Retain controlling documents outside CAF.</p></div>
      </section>
    </div>
  );
}
