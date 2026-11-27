import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";
import { useSeo } from "@/lib/seo";

/** Server-rendered metadata remains immediate; navigation metadata loads off the entry path. */
export default function RouteSeo() {
  const location = useLocation();
  const meta = useMemo(() => resolveSiteSeoMeta(location.pathname), [location.pathname]);
  useSeo(meta);
  return null;
}
