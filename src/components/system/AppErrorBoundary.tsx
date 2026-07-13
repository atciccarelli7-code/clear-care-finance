import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  classifyRuntimeFailure,
  getRuntimeBuildId,
  prepareAutomaticRuntimeRecovery,
  type RuntimeFailureType,
  type RuntimeRecoveryStorage,
} from "@/lib/runtimeRecovery";

type AppErrorBoundaryProps = {
  children: ReactNode;
  reloadPage?: () => void;
  getPathname?: () => string;
  getBuildId?: () => string;
  storage?: RuntimeRecoveryStorage;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  failureType: RuntimeFailureType | null;
};

const initialState: AppErrorBoundaryState = {
  hasError: false,
  failureType: null,
};

const browserPathname = () => (typeof window === "undefined" ? "/" : window.location.pathname);

const browserBuildId = () => {
  if (typeof document === "undefined") return "unknown-build";
  return getRuntimeBuildId(document);
};

const browserStorage = (): RuntimeRecoveryStorage | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
};

const browserReload = () => {
  if (typeof window !== "undefined") window.location.reload();
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state = initialState;

  private automaticReloadStarted = false;

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      failureType: classifyRuntimeFailure(error),
    };
  }

  componentDidCatch(error: unknown, _errorInfo: ErrorInfo) {
    if (this.automaticReloadStarted) return;

    const storage = this.props.storage ?? browserStorage();
    if (!storage) return;

    const shouldReload = prepareAutomaticRuntimeRecovery({
      error,
      pathname: (this.props.getPathname ?? browserPathname)(),
      buildId: (this.props.getBuildId ?? browserBuildId)(),
      storage,
    });

    if (!shouldReload) return;
    this.automaticReloadStarted = true;
    (this.props.reloadPage ?? browserReload)();
  }

  private reloadPage = () => {
    (this.props.reloadPage ?? browserReload)();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const chunkFailure = this.state.failureType === "chunk_load";

    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6" id="main-content">
        <section
          className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-6 text-center shadow-card sm:p-10"
          role="alert"
          aria-live="assertive"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft font-display text-sm font-extrabold text-primary">
            CAF
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">Recovery mode</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">We couldn&apos;t finish loading this page.</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
            {chunkFailure
              ? "The site may have been updated while this page was open. Reload to use the latest version."
              : "This page stopped unexpectedly. Reload the page or return to Start Here to continue from a stable entry point."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={this.reloadPage}
            >
              Reload page
            </button>
            <a
              href="/start-here"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold transition hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Go to Start Here
            </a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Unsaved in-progress answers may need to be entered again. Error details are not displayed or transmitted from this recovery screen.
          </p>
        </section>
      </main>
    );
  }
}
