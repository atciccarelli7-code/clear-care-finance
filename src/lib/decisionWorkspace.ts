export const DECISION_WORKSPACE_STORAGE_KEY = "caf:decision-workspace";
export const DECISION_WORKSPACE_VERSION = 1;
export const MAX_DECISION_RECORDS = 50;
export const MAX_DECISION_ACTIONS = 40;

export type VerificationStatus = "not_started" | "in_progress" | "verified" | "not_applicable";
export type DecisionActionStatus = "open" | "complete" | "blocked";

export type DecisionAction = {
  id: string;
  category: string;
  label: string;
  destinationRoute?: string;
  owner?: string;
  dueDate?: string;
  status: DecisionActionStatus;
};

export type DecisionRecord = {
  id: string;
  journeyId: string;
  fixedCategory: string;
  destinationRoute: string;
  completedSteps: string[];
  outstandingActions: DecisionAction[];
  verificationStatus: VerificationStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type DecisionWorkspace = {
  version: number;
  records: DecisionRecord[];
  updatedAt: string;
};

const now = () => new Date().toISOString();
const clean = (value: unknown, max = 100) => typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";
const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
const validVerification = (value: unknown): VerificationStatus => ["not_started", "in_progress", "verified", "not_applicable"].includes(String(value)) ? value as VerificationStatus : "not_started";
const validActionStatus = (value: unknown): DecisionActionStatus => ["open", "complete", "blocked"].includes(String(value)) ? value as DecisionActionStatus : "open";

const parseAction = (value: unknown): DecisionAction | null => {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const id = clean(raw.id, 80);
  const label = clean(raw.label, 180);
  if (!id || !label) return null;
  return {
    id,
    category: clean(raw.category, 60) || "general",
    label,
    destinationRoute: clean(raw.destinationRoute, 180) || undefined,
    owner: clean(raw.owner, 80) || undefined,
    dueDate: validDate(raw.dueDate),
    status: validActionStatus(raw.status),
  };
};

const parseRecord = (value: unknown): DecisionRecord | null => {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const id = clean(raw.id, 80);
  const journeyId = clean(raw.journeyId, 80);
  const destinationRoute = clean(raw.destinationRoute, 180);
  if (!id || !journeyId || !destinationRoute.startsWith("/")) return null;
  return {
    id,
    journeyId,
    fixedCategory: clean(raw.fixedCategory, 80) || journeyId,
    destinationRoute,
    completedSteps: Array.isArray(raw.completedSteps) ? raw.completedSteps.map((item) => clean(item, 80)).filter(Boolean).slice(0, 30) : [],
    outstandingActions: Array.isArray(raw.outstandingActions) ? raw.outstandingActions.map(parseAction).filter((item): item is DecisionAction => Boolean(item)).slice(0, MAX_DECISION_ACTIONS) : [],
    verificationStatus: validVerification(raw.verificationStatus),
    dueDate: validDate(raw.dueDate),
    createdAt: clean(raw.createdAt, 40) || now(),
    updatedAt: clean(raw.updatedAt, 40) || now(),
  };
};

export const createEmptyDecisionWorkspace = (): DecisionWorkspace => ({ version: DECISION_WORKSPACE_VERSION, records: [], updatedAt: now() });

export const parseDecisionWorkspace = (rawValue: string | null): DecisionWorkspace => {
  if (!rawValue) return createEmptyDecisionWorkspace();
  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    const rawRecords = Array.isArray(parsed.records) ? parsed.records : [];
    return {
      version: DECISION_WORKSPACE_VERSION,
      records: rawRecords.map(parseRecord).filter((item): item is DecisionRecord => Boolean(item)).slice(0, MAX_DECISION_RECORDS),
      updatedAt: clean(parsed.updatedAt, 40) || now(),
    };
  } catch {
    return createEmptyDecisionWorkspace();
  }
};

export const loadDecisionWorkspace = (): DecisionWorkspace => {
  if (typeof window === "undefined") return createEmptyDecisionWorkspace();
  return parseDecisionWorkspace(window.localStorage.getItem(DECISION_WORKSPACE_STORAGE_KEY));
};

export const saveDecisionWorkspace = (workspace: DecisionWorkspace): DecisionWorkspace => {
  const safe: DecisionWorkspace = {
    version: DECISION_WORKSPACE_VERSION,
    records: workspace.records.map(parseRecord).filter((item): item is DecisionRecord => Boolean(item)).slice(0, MAX_DECISION_RECORDS),
    updatedAt: now(),
  };
  if (typeof window !== "undefined") window.localStorage.setItem(DECISION_WORKSPACE_STORAGE_KEY, JSON.stringify(safe));
  return safe;
};

export const upsertDecisionRecord = (workspace: DecisionWorkspace, record: Omit<DecisionRecord, "createdAt" | "updatedAt"> & Partial<Pick<DecisionRecord, "createdAt" | "updatedAt">>): DecisionWorkspace => {
  const existing = workspace.records.find((item) => item.id === record.id);
  const candidate = parseRecord({ ...record, createdAt: existing?.createdAt ?? record.createdAt ?? now(), updatedAt: now() });
  if (!candidate) return workspace;
  return saveDecisionWorkspace({ ...workspace, records: [candidate, ...workspace.records.filter((item) => item.id !== candidate.id)] });
};

export const removeDecisionRecord = (workspace: DecisionWorkspace, id: string): DecisionWorkspace => saveDecisionWorkspace({ ...workspace, records: workspace.records.filter((item) => item.id !== id) });
export const clearDecisionWorkspace = (): DecisionWorkspace => saveDecisionWorkspace(createEmptyDecisionWorkspace());

export const exportDecisionWorkspaceText = (workspace: DecisionWorkspace) => [
  "Community Acquired Finance — My Decision Plan",
  "Educational planning summary. Verify decisions with official sources and controlling documents.",
  "",
  ...workspace.records.flatMap((record) => [
    `${record.fixedCategory} — ${record.verificationStatus.replaceAll("_", " ")}`,
    `Continue: ${record.destinationRoute}`,
    ...(record.dueDate ? [`Due: ${record.dueDate}`] : []),
    ...record.outstandingActions.map((action) => `- [${action.status === "complete" ? "x" : " "}] ${action.label}${action.owner ? ` — ${action.owner}` : ""}${action.dueDate ? ` (${action.dueDate})` : ""}`),
    "",
  ]),
].join("\n");
