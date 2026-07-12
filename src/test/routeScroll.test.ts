import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToHashTarget } from "@/lib/routeScroll";

describe("scrollToHashTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("scrolls to an existing decoded target", () => {
    const target = document.createElement("section");
    target.id = "my-plan";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    const cleanup = scrollToHashTarget("#my-plan");

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    cleanup();
  });

  it("waits for a lazy target to appear and then disconnects", async () => {
    const cleanup = scrollToHashTarget("#financial-foundation-checkup");
    const target = document.createElement("section");
    target.id = "financial-foundation-checkup";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    await Promise.resolve();
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    cleanup();
  });

  it("ignores empty hashes safely", () => {
    expect(() => scrollToHashTarget("")()).not.toThrow();
  });
});
