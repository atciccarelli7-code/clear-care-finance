import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADSENSE_SCRIPT_ID,
  ADSENSE_SCRIPT_SRC,
  isAdEligiblePath,
  isAdFreePath,
  syncAdSenseForPath,
} from "@/lib/routeAwareAdSense";

const REVIEWED_ARTICLE_PATH = "/articles/how-to-read-an-eob";
const UNREVIEWED_ARTICLE_PATH = "/articles/what-does-medicare-not-cover";
const ELIGIBILITY_PATH = "/tools/medicare-medicaid-eligibility-check";
const BLUEPRINT_PATH = "/tools/healthcare-worker-benefits-blueprint";
const ACTION_PLAN_PATH = "/tools/employer-benefits-action-plan";
const PRIOR_AUTH_PATH = "/tools/prior-authorization-next-step-guide";
const TOTAL_COMPENSATION_PATH = "/tools/healthcare-worker-total-compensation-comparison";
const LEGACY_PRIOR_AUTH_PATH = "/insurance/prior-authorization-guide";

const removeManagedScript = () => {
  document.getElementById(ADSENSE_SCRIPT_ID)?.remove();
};

afterEach(() => {
  removeManagedScript();
});

describe("route-aware AdSense guard", () => {
  it("keeps every tool route ad-free, including future tool routes", () => {
    for (const path of [
      ELIGIBILITY_PATH,
      BLUEPRINT_PATH,
      ACTION_PLAN_PATH,
      PRIOR_AUTH_PATH,
      TOTAL_COMPENSATION_PATH,
      "/tools",
      "/tools/future-tool",
    ]) {
      expect(isAdFreePath(path)).toBe(true);
      expect(isAdFreePath(`${path}/`)).toBe(true);
      expect(isAdEligiblePath(path)).toBe(false);
    }
  });

  it.each([
    ["home", "/"],
    ["start page", "/start-here"],
    ["article index", "/articles"],
    ["topic index", "/topics"],
    ["individual topic guide", "/topics/retirement-accounts"],
    ["broad hub", "/medicare-care-costs"],
    ["hospital patient guide", "/patients-families/hospital-guide"],
    ["new clinical blood-thinner article", "/articles/why-am-i-getting-a-blood-thinner-in-the-hospital"],
    ["new clinical medication-change article", "/articles/why-did-the-hospital-stop-or-change-my-home-medications"],
    ["unreviewed article", UNREVIEWED_ARTICLE_PATH],
    ["newsletter", "/newsletter"],
    ["contact", "/contact"],
    ["organization pilot", "/for-organizations"],
    ["about", "/about"],
    ["methodology", "/methodology"],
    ["editorial policy", "/editorial-policy"],
    ["disclosures", "/disclosures"],
    ["privacy policy", "/privacy-policy"],
    ["terms", "/terms-of-use"],
    ["printable checklist", "/insurance/hospital-discharge-coverage/printable"],
    ["unknown route", "/not-a-real-route"],
  ])("keeps the %s screen ad-free", (_label, path) => {
    expect(isAdFreePath(path)).toBe(true);
    expect(syncAdSenseForPath(path, `https://communityacquiredfinance.com${path}`)).toBe("blocked");
    expect(document.getElementById(ADSENSE_SCRIPT_ID)).toBeNull();
  });

  it.each([
    ["reviewed EOB article", REVIEWED_ARTICLE_PATH],
    ["reviewed Medicare guide article", "/articles/medicare-options-explained"],
    ["reviewed retirement article", "/articles/how-hospital-403b-matching-works"],
  ])("allows AdSense only on explicitly reviewed publisher-content: %s", (_label, path) => {
    expect(isAdEligiblePath(path)).toBe(true);
    expect(isAdFreePath(path)).toBe(false);
  });

  it("loads the managed script once on eligible publisher-content", () => {
    expect(syncAdSenseForPath(REVIEWED_ARTICLE_PATH, `https://communityacquiredfinance.com${REVIEWED_ARTICLE_PATH}`)).toBe("loaded");
    expect(
      syncAdSenseForPath(
        "/articles/medicare-options-explained",
        "https://communityacquiredfinance.com/articles/medicare-options-explained",
      ),
    ).toBe("present");

    const script = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("src", ADSENSE_SCRIPT_SRC);
    expect(script).toHaveAttribute("crossorigin", "anonymous");
    expect(script).not.toHaveAttribute("data-caf-managed");
    expect(document.querySelectorAll(`#${ADSENSE_SCRIPT_ID}`)).toHaveLength(1);
  });

  it.each([
    ["eligibility checker", ELIGIBILITY_PATH],
    ["benefits blueprint", BLUEPRINT_PATH],
    ["employer benefits action plan", ACTION_PLAN_PATH],
    ["prior authorization guide", PRIOR_AUTH_PATH],
    ["total compensation comparison", TOTAL_COMPENSATION_PATH],
    ["tool library", "/tools"],
    ["privacy policy", "/privacy-policy"],
    ["unreviewed article", UNREVIEWED_ARTICLE_PATH],
  ])("requests a clean reload when navigation enters the ad-free %s after AdSense loaded", (_label, path) => {
    syncAdSenseForPath(REVIEWED_ARTICLE_PATH, `https://communityacquiredfinance.com${REVIEWED_ARTICLE_PATH}`);
    const replaceLocation = vi.fn();
    const target = `https://communityacquiredfinance.com${path}`;

    const action = syncAdSenseForPath(path, target, { replaceLocation });

    expect(action).toBe("reload");
    expect(replaceLocation).toHaveBeenCalledOnce();
    expect(replaceLocation).toHaveBeenCalledWith(target);
  });

  it("keeps an ad-free to ad-free transition clean without forcing a reload", () => {
    const replaceLocation = vi.fn();

    expect(
      syncAdSenseForPath("/tools", "https://communityacquiredfinance.com/tools", { replaceLocation }),
    ).toBe("blocked");
    expect(
      syncAdSenseForPath("/privacy-policy", "https://communityacquiredfinance.com/privacy-policy", {
        replaceLocation,
      }),
    ).toBe("blocked");
    expect(replaceLocation).not.toHaveBeenCalled();
    expect(document.getElementById(ADSENSE_SCRIPT_ID)).toBeNull();
  });

  it("redirects legacy client navigation to the canonical prior authorization tool", () => {
    const replaceLocation = vi.fn();

    const action = syncAdSenseForPath(
      LEGACY_PRIOR_AUTH_PATH,
      `https://communityacquiredfinance.com${LEGACY_PRIOR_AUTH_PATH}?source=hub#start`,
      { replaceLocation },
    );

    expect(action).toBe("reload");
    expect(replaceLocation).toHaveBeenCalledWith(`https://communityacquiredfinance.com${PRIOR_AUTH_PATH}`);
    expect(document.getElementById(ADSENSE_SCRIPT_ID)).toBeNull();
  });
});
