import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADSENSE_SCRIPT_ID,
  ADSENSE_SCRIPT_SRC,
  isAdFreePath,
  syncAdSenseForPath,
} from "@/lib/routeAwareAdSense";

const ELIGIBILITY_PATH = "/tools/medicare-medicaid-eligibility-check";
const BLUEPRINT_PATH = "/tools/healthcare-worker-benefits-blueprint";
const ACTION_PLAN_PATH = "/tools/employer-benefits-action-plan";

const removeManagedScript = () => {
  document.getElementById(ADSENSE_SCRIPT_ID)?.remove();
};

afterEach(() => {
  removeManagedScript();
});

describe("route-aware AdSense guard", () => {
  it("recognizes sensitive tools with or without a trailing slash", () => {
    for (const path of [ELIGIBILITY_PATH, BLUEPRINT_PATH, ACTION_PLAN_PATH]) {
      expect(isAdFreePath(path)).toBe(true);
      expect(isAdFreePath(`${path}/`)).toBe(true);
    }
    expect(isAdFreePath("/tools")).toBe(false);
  });

  it.each([
    ["eligibility checker", ELIGIBILITY_PATH],
    ["benefits blueprint", BLUEPRINT_PATH],
    ["employer benefits action plan", ACTION_PLAN_PATH],
  ])("does not load AdSense on a direct %s visit", (_label, path) => {
    const action = syncAdSenseForPath(path, `https://communityacquiredfinance.com${path}`);

    expect(action).toBe("blocked");
    expect(document.getElementById(ADSENSE_SCRIPT_ID)).toBeNull();
  });

  it("loads the managed script once on ordinary pages", () => {
    expect(syncAdSenseForPath("/tools", "https://communityacquiredfinance.com/tools")).toBe("loaded");
    expect(syncAdSenseForPath("/articles", "https://communityacquiredfinance.com/articles")).toBe("present");

    const script = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("src", ADSENSE_SCRIPT_SRC);
    expect(script).toHaveAttribute("crossorigin", "anonymous");
    expect(document.querySelectorAll(`#${ADSENSE_SCRIPT_ID}`)).toHaveLength(1);
  });

  it.each([
    ["eligibility checker", ELIGIBILITY_PATH],
    ["benefits blueprint", BLUEPRINT_PATH],
    ["employer benefits action plan", ACTION_PLAN_PATH],
  ])("requests a clean reload when navigation enters the %s after AdSense loaded", (_label, path) => {
    syncAdSenseForPath("/", "https://communityacquiredfinance.com/");
    const replaceLocation = vi.fn();
    const target = `https://communityacquiredfinance.com${path}`;

    const action = syncAdSenseForPath(path, target, { replaceLocation });

    expect(action).toBe("reload");
    expect(replaceLocation).toHaveBeenCalledOnce();
    expect(replaceLocation).toHaveBeenCalledWith(target);
  });
});
