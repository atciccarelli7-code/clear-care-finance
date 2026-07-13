import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppErrorBoundary } from "@/components/system/AppErrorBoundary";
import type { RuntimeRecoveryStorage } from "@/lib/runtimeRecovery";

const createMemoryStorage = (): RuntimeRecoveryStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

const ThrowingChild = ({ error }: { error: Error }): JSX.Element => {
  throw error;
};

describe("AppErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    consoleErrorSpy.mockRestore();
  });

  it("replaces a render crash with an accessible recovery screen without exposing error details", () => {
    const reloadPage = vi.fn();
    render(
      <AppErrorBoundary
        reloadPage={reloadPage}
        storage={createMemoryStorage()}
        getPathname={() => "/tools/example"}
        getBuildId={() => "/assets/index-build-a.js"}
      >
        <ThrowingChild error={new Error("Private account 12345 failed to render")} />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "We couldn't finish loading this page." })).toBeInTheDocument();
    expect(screen.getByText(/This page stopped unexpectedly/)).toBeInTheDocument();
    expect(screen.queryByText(/Private account 12345/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Start Here" })).toHaveAttribute("href", "/start-here");

    fireEvent.click(screen.getByRole("button", { name: "Reload page" }));
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it("automatically reloads a recognized stale chunk only once for the same route and build", () => {
    const storage = createMemoryStorage();
    const firstReload = vi.fn();
    const chunkError = new Error("Failed to fetch dynamically imported module: /assets/ToolPage.js");

    render(
      <AppErrorBoundary
        reloadPage={firstReload}
        storage={storage}
        getPathname={() => "/tools/benefits-change-detector"}
        getBuildId={() => "/assets/index-build-a.js"}
      >
        <ThrowingChild error={chunkError} />
      </AppErrorBoundary>,
    );

    expect(firstReload).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/site may have been updated while this page was open/)).toBeInTheDocument();

    cleanup();
    const secondReload = vi.fn();
    render(
      <AppErrorBoundary
        reloadPage={secondReload}
        storage={storage}
        getPathname={() => "/tools/benefits-change-detector"}
        getBuildId={() => "/assets/index-build-a.js"}
      >
        <ThrowingChild error={chunkError} />
      </AppErrorBoundary>,
    );

    expect(secondReload).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
  });
});
