import {
  accessResponseSchema,
  premiumModuleDefinitionSchema,
  workspaceRecordSchema,
  workspaceStateSchema,
  type AccessStatus,
  type PremiumModuleDefinition,
  type PremiumModuleKey,
  type WorkspaceRecord,
  type WorkspaceState,
} from "./contracts.js";

const jsonHeaders = { "Content-Type": "application/json" };

export class PremiumApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

const readJson = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new PremiumApiError(
      typeof payload.message === "string" ? payload.message : "The request could not be completed.",
      response.status,
      typeof payload.code === "string" ? payload.code : undefined,
    );
  }
  return payload;
};

export const getAccessStatus = async (token?: string): Promise<AccessStatus> => {
  const response = await fetch("/api/access/healthcare-worker-benefits-decision-system", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  const payload = accessResponseSchema.parse(await readJson(response));
  return payload.status;
};

export const getPremiumModule = async (key: PremiumModuleKey, token: string): Promise<PremiumModuleDefinition> => {
  const response = await fetch(`/api/premium/content?productKey=healthcare-worker-benefits-decision-system&moduleKey=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return premiumModuleDefinitionSchema.parse(await readJson(response));
};

export const listWorkspaces = async (token: string): Promise<WorkspaceRecord[]> => {
  const response = await fetch("/api/workspaces", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await readJson(response);
  return workspaceRecordSchema.array().parse(payload.workspaces);
};

export const createWorkspace = async (token: string, title: string): Promise<WorkspaceRecord> => {
  const response = await fetch("/api/workspaces", {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title }),
  });
  const payload = await readJson(response);
  return workspaceRecordSchema.parse(payload.workspace);
};

export const getWorkspace = async (token: string, id: string): Promise<WorkspaceRecord> => {
  const response = await fetch(`/api/workspaces/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const payload = await readJson(response);
  return workspaceRecordSchema.parse(payload.workspace);
};

export const saveWorkspace = async (token: string, id: string, state: WorkspaceState): Promise<WorkspaceRecord> => {
  const response = await fetch(`/api/workspaces/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ state: workspaceStateSchema.parse(state) }),
  });
  const payload = await readJson(response);
  return workspaceRecordSchema.parse(payload.workspace);
};
