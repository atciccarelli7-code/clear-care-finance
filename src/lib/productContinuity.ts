import {
  BENEFITS_COMMAND_CENTER_UPDATED_EVENT,
  loadBenefitsWorkspace,
} from "@/lib/benefitsCommandCenter";
import {
  FOUNDATION_UPDATED_EVENT,
  loadFinancialFoundationSnapshots,
} from "@/lib/financialFoundationCheckup";
import {
  NAVIGATOR_PLAN_UPDATED_EVENT,
  loadStoredNavigatorPlan,
} from "@/lib/financialNavigator";

export type ProductContinuityId = "my_plan" | "foundation_checkup" | "benefits_command_center";

export interface ProductContinuityItem {
  id: ProductContinuityId;
  title: string;
  summary: string;
  href: string;
  actionLabel: string;
  updatedAt: string;
}

export const PRODUCT_CONTINUITY_EVENTS = [
  NAVIGATOR_PLAN_UPDATED_EVENT,
  FOUNDATION_UPDATED_EVENT,
  BENEFITS_COMMAND_CENTER_UPDATED_EVENT,
] as const;

export const PRODUCT_CONTINUITY_DISMISS_KEY = "caf-saved-progress-dismissed-v1";

const safeTimestamp = (value: string | undefined) => {
  if (!value) return new Date(0).toISOString();
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date(0).toISOString();
};

export const getProductContinuityItems = (): ProductContinuityItem[] => {
  if (typeof window === "undefined") return [];

  const items: ProductContinuityItem[] = [];
  const plan = loadStoredNavigatorPlan();
  if (plan) {
    const total = plan.actionIds.length;
    const completed = plan.completedActionIds.length;
    const pending = Math.max(total - completed, 0);
    items.push({
      id: "my_plan",
      title: "My Plan",
      summary: pending === 0
        ? `All ${total} saved action${total === 1 ? " is" : "s are"} marked complete.`
        : `${completed} of ${total} saved actions complete.`,
      href: "/start-here#my-plan",
      actionLabel: pending === 0 ? "Review My Plan" : "Continue My Plan",
      updatedAt: safeTimestamp(plan.savedAt),
    });
  }

  const snapshots = loadFinancialFoundationSnapshots();
  if (snapshots.length) {
    items.push({
      id: "foundation_checkup",
      title: "Financial Foundation Checkup",
      summary: snapshots.length === 1
        ? "One local checkup is ready for a future comparison."
        : `${snapshots.length} local checkups are saved for progress comparisons.`,
      href: "/start-here#financial-foundation-checkup",
      actionLabel: "Review or repeat checkup",
      updatedAt: safeTimestamp(snapshots[0]?.savedAt),
    });
  }

  const workspace = loadBenefitsWorkspace();
  if (workspace) {
    const packageCount = workspace.packages.length;
    items.push({
      id: "benefits_command_center",
      title: "Benefits Command Center",
      summary: `${packageCount} benefits package${packageCount === 1 ? "" : "s"} saved in this browser.`,
      href: "/tools/benefits-command-center",
      actionLabel: packageCount > 1 ? "Continue package comparison" : "Continue benefits review",
      updatedAt: safeTimestamp(workspace.savedAt),
    });
  }

  return items.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
};

export const isProductContinuityDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(PRODUCT_CONTINUITY_DISMISS_KEY) === "true";
  } catch {
    return false;
  }
};

export const dismissProductContinuityForSession = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PRODUCT_CONTINUITY_DISMISS_KEY, "true");
  } catch {
    // The summary can still be dismissed in React state when session storage is unavailable.
  }
};
