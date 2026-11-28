import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";
import { useSeo } from "@/lib/seo";

/** Keeps document metadata synchronized during client navigation. */
export default function RouteSeo() {
  const location = useLocation();
  const meta = useMemo(() => resolveSiteSeoMeta(location.pathname), [location.pathname]);
  useSeo(meta);
  return null;
}
