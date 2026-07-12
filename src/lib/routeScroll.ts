export const scrollToHashTarget = (hash: string, timeoutMs = 5000) => {
  if (typeof window === "undefined" || typeof document === "undefined" || !hash) return () => undefined;

  let decodedId = "";
  try {
    decodedId = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    decodedId = hash.replace(/^#/, "");
  }
  if (!decodedId) return () => undefined;

  let observer: MutationObserver | null = null;
  let timeoutId: number | null = null;
  let frameId: number | null = null;
  let cancelled = false;

  const scroll = () => {
    if (cancelled) return false;
    const target = document.getElementById(decodedId);
    if (!target) return false;
    frameId = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
    observer?.disconnect();
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    return true;
  };

  if (!scroll()) {
    observer = new MutationObserver(scroll);
    observer.observe(document.body, { childList: true, subtree: true });
    timeoutId = window.setTimeout(() => observer?.disconnect(), timeoutMs);
  }

  return () => {
    cancelled = true;
    observer?.disconnect();
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    if (frameId !== null) window.cancelAnimationFrame(frameId);
  };
};
