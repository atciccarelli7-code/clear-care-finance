export type EmployerBenefitsSourceContextSource = {
  sourceId: string;
  title: string;
  url: string;
  audience: string | null;
  planYearLabel: string | null;
  planYearStart: number | null;
  planYearEnd: number | null;
  stateRegion: string | null;
  documentType: string;
};

export type EmployerBenefitsSourceContext = {
  schemaVersion: 1;
  systemId: string;
  systemName: string;
  city: string | null;
  state: string | null;
  selectedSource: EmployerBenefitsSourceContextSource | null;
  savedAt: string;
};

export const EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY = "caf-employer-benefits-source-context-v1";
export const EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT = "caf-employer-benefits-source-context-updated";

const isSafePublicUrl = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    return parsed.protocol === "https:"
      && !parsed.username
      && !parsed.password
      && host !== "localhost"
      && !host.endsWith(".local");
  } catch {
    return false;
  }
};

export const saveEmployerBenefitsSourceContext = (context: EmployerBenefitsSourceContext) => {
  if (typeof window === "undefined") return context;
  window.localStorage.setItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY, JSON.stringify(context));
  window.dispatchEvent(new CustomEvent(EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT));
  return context;
};

export const loadEmployerBenefitsSourceContext = (): EmployerBenefitsSourceContext | null => {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY) || "null") as EmployerBenefitsSourceContext | null;
    if (
      !parsed
      || parsed.schemaVersion !== 1
      || typeof parsed.systemId !== "string"
      || typeof parsed.systemName !== "string"
    ) return null;
    if (parsed.selectedSource && !isSafePublicUrl(parsed.selectedSource.url)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearEmployerBenefitsSourceContext = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EMPLOYER_BENEFITS_SOURCE_CONTEXT_UPDATED_EVENT));
};
