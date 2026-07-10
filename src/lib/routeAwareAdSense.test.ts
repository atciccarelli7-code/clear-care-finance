import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADSENSE_SCRIPT_ID,
  ADSENSE_SCRIPT_SRC,
  isAdFreePath,
  syncAdSenseForPath,
} from "@/lib/routeAwareAdSense";

const removeManagedScript = () => {
  document.getElementById(ADSENSE_SCRIPT_ID)?.remove();
};

afterEach(() => {
  removeManagedScript();
});

describe("route-aware AdSense guard", () => {
  it("recognizes the eligibility checker with or without a trailing slash", () => {
    expect(isAdFreePath("/tools/medicare-medicaid-eligibility-check")).toBe(true);
    expect(isAdFreePath("/tools/medicare-medicaid-eligibility-check/")).toBe(true);
    expect(isAdFreePath("/tools")).toBe(false);
  });

  it("does not load AdSense on a direct eligibility-check visit", () => {
    const action = syncAdSenseForPath(
      "/tools/medicare-medicaid-eligibility-check",
      "https://communityacquiredfinance.com/tools/medicare-medicaid-eligibility-check",
    );

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

  it("requests a clean reload when navigation enters the ad-free route after AdSense loaded", () => {
    syncAdSenseForPath("/", "https://communityacquiredfinance.com/");
    const replaceLocation = vi.fn();
    const target = "https://communityacquiredfinance.com/tools/medicare-medicaid-eligibility-check";

    const action = syncAdSenseForPath(
      "/tools/medicare-medicaid-eligibility-check",
      target,
      { replaceLocation },
    );

    expect(action).toBe("reload");
    expect(replaceLocation).toHaveBeenCalledOnce();
    expect(replaceLocation).toHaveBeenCalledWith(target);
  });
});
