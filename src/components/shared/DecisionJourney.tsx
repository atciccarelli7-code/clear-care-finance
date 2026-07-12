import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, ExternalLink, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DecisionJourneyHeader = ({ eyebrow, title, description, canonicalPath }: { eyebrow: string; title: string; description: string; canonicalPath?: string }) => (
  <div className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-5 shadow-card md:p-8">
    <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
    <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
    {canonicalPath && <div className="mt-4 text-xs font-semibold text-muted-foreground">Canonical pathway: <code>{canonicalPath}</code></div>}
  </div>
);

export const DecisionJourneyProgress = ({ labels, activeIndex }: { labels: string[]; activeIndex: number }) => (
  <ol className="grid gap-2 sm:grid-cols-5" aria-label="Decision journey progress">
    {labels.map((label, index) => (
      <li key={label} className={`rounded-xl border p-3 text-xs font-semibold ${index <= activeIndex ? "border-primary/30 bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>
        <span className="flex items-center gap-2">{index < activeIndex ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}{label}</span>
      </li>
    ))}
  </ol>
);

export const ImmediateAnswer = ({ title = "Immediate answer", children }: { title?: string; children: React.ReactNode }) => (
  <Card className="border-primary/25 bg-primary-soft/25 shadow-card">
    <CardHeader><CardTitle className="font-display text-2xl">{title}</CardTitle></CardHeader>
    <CardContent className="text-sm leading-relaxed text-foreground md:text-base">{children}</CardContent>
  </Card>
);

export const ActionPlanSection = ({ title = "Action plan", items }: { title?: string; items: string[] }) => (
  <Card className="shadow-card">
    <CardHeader><CardTitle className="font-display text-2xl">{title}</CardTitle><CardDescription>Work in this order and verify each material decision.</CardDescription></CardHeader>
    <CardContent><ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">{items.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{index + 1}</span><span>{item}</span></li>)}</ol></CardContent>
  </Card>
);

export const OfficialVerificationPanel = ({ links }: { links: Array<{ label: string; url: string; description?: string }> }) => (
  <Card className="shadow-card">
    <CardHeader><ShieldCheck className="h-6 w-6 text-primary" /><CardTitle className="font-display text-2xl">Official verification and escalation</CardTitle><CardDescription>Use the page that controls the rule, deadline, or enrollment action.</CardDescription></CardHeader>
    <CardContent className="grid gap-3 sm:grid-cols-2">{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-border p-4 transition hover:border-primary/35"><span className="flex items-center justify-between gap-3 font-bold text-foreground">{link.label}<ExternalLink className="h-4 w-4 text-primary" /></span>{link.description && <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{link.description}</span>}</a>)}</CardContent>
  </Card>
);

export const ContinueJourneyCard = ({ href, eyebrow, title, description }: { href: string; eyebrow: string; title: string; description: string }) => (
  <Link to={href} className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
    <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</div><div className="mt-2 font-display text-xl font-bold">{title}</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
  </Link>
);

export const SaveToMyPlanAction = ({ onSave, saved }: { onSave: () => void; saved: boolean }) => <Button type="button" variant={saved ? "outline" : "hero"} onClick={onSave}><Save className="h-4 w-4" />{saved ? "Saved to My Plan" : "Save to My Plan"}</Button>;

export const JourneyStatusBadge = ({ status }: { status: "not_started" | "in_progress" | "verified" | "not_applicable" }) => <span className="inline-flex rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-bold text-primary">{status.replaceAll("_", " ")}</span>;
