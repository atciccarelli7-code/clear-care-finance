export const MedicareMedicaidVisualGuide = () => (
  <div className="min-w-0 space-y-6">
    <div className="max-w-3xl space-y-3">
      <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
        Visual guide
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        The parts that confuse people most
      </h2>
      <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
        A quick visual layer for plan structure, cost exposure, and planning questions.
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <article className="rounded-3xl border border-border bg-card p-5 shadow-card"><strong className="text-3xl text-primary">54%</strong><p className="mt-2 text-sm text-muted-foreground">Private-plan path share.</p></article>
      <article className="rounded-3xl border border-border bg-card p-5 shadow-card"><strong className="text-3xl text-primary">$202.90</strong><p className="mt-2 text-sm text-muted-foreground">Common monthly premium reference.</p></article>
      <article className="rounded-3xl border border-border bg-card p-5 shadow-card"><strong className="text-3xl text-primary">12.0M</strong><p className="mt-2 text-sm text-muted-foreground">People enrolled in both programs.</p></article>
    </div>
  </div>
);
