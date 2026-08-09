import { MEDICARE_PRODUCT_KEY, medicareCoverageStateSchema, medicareWorkspaceRecordSchema, type MedicareCoverageState, type MedicareWorkspaceRecord } from "./contracts.js";
import { PremiumApiError } from "@/premium/apiClient";

const jsonHeaders = { "Content-Type": "application/json" };

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

export const listMedicareWorkspaces = async (token: string): Promise<MedicareWorkspaceRecord[]> => {
  const response = await fetch(`/api/workspaces?productKey=${encodeURIComponent(MEDICARE_PRODUCT_KEY)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await readJson(response);
  return medicareWorkspaceRecordSchema.array().parse(payload.workspaces);
};

export const createMedicareWorkspace = async (token: string): Promise<MedicareWorkspaceRecord> => {
  const response = await fetch("/api/workspaces", {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    credentials: "same-origin",
    body: JSON.stringify({ productKey: MEDICARE_PRODUCT_KEY }),
  });
  const payload = await readJson(response);
  return medicareWorkspaceRecordSchema.parse(payload.workspace);
};

export const getMedicareWorkspace = async (token: string, id: string): Promise<MedicareWorkspaceRecord> => {
  const response = await fetch(`/api/workspaces/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await readJson(response);
  return medicareWorkspaceRecordSchema.parse(payload.workspace);
};

export const saveMedicareWorkspace = async (token: string, id: string, state: MedicareCoverageState): Promise<MedicareWorkspaceRecord> => {
  const response = await fetch(`/api/workspaces/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    credentials: "same-origin",
    body: JSON.stringify({ state: medicareCoverageStateSchema.parse(state) }),
  });
  const payload = await readJson(response);
  return medicareWorkspaceRecordSchema.parse(payload.workspace);
};

export const deleteMedicareWorkspace = async (token: string, id: string) => {
  const response = await fetch(`/api/workspaces/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "same-origin",
  });
  await readJson(response);
};
