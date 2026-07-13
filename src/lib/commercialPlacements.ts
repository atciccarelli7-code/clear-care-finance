import { isAdEligiblePath } from "@/lib/routeAwareAdSense";

export type CommercialPlacementKind = "display_ad" | "sponsor" | "affiliate";
export type CommercialPlacementStatus = "disabled" | "testing" | "active" | "expired";
export type CommercialRouteGroup = "articles" | "topics" | "reviewed_guides";

export type CommercialPlacement = Readonly<{
  id: string;
  kind: CommercialPlacementKind;
  status: CommercialPlacementStatus;
  routeGroups: readonly CommercialRouteGroup[];
  partnerId?: string;
  campaignId?: string;
  destinationUrl?: string;
  disclosureLabel?: string;
  startsAt?: string;
  endsAt?: string;
}>;

export const COMMERCIAL_LINK_REL = "sponsored nofollow noopener";

// The registry intentionally starts empty. Revenue surfaces must be added through
// a reviewed code change; no route becomes commercial merely because a component
// or third-party script exists elsewhere in the application.
export const COMMERCIAL_PLACEMENTS = [] as const satisfies readonly CommercialPlacement[];

const FIXED_ID_PATTERN = /^[a-z][a-z0-9_]{2,63}$/;

const normalizePathname = (pathname: string) => {
  try {
    return new URL(pathname, "https://communityacquiredfinance.com").pathname.replace(/\/+$/, "") || "/";
  } catch {
    return pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  }
};

export const getCommercialRouteGroup = (pathname: string): CommercialRouteGroup | null => {
  const normalized = normalizePathname(pathname);

  if (!isAdEligiblePath(normalized)) return null;
  if (normalized.startsWith("/articles/")) return "articles";
  if (normalized.startsWith("/topics/")) return "topics";
  return "reviewed_guides";
};

export const isCommerciallyEligiblePath = (pathname: string) => getCommercialRouteGroup(pathname) !== null;

const parseTime = (value?: string) => {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
};

export const isCommercialPlacementLive = (placement: CommercialPlacement, now: Date = new Date()) => {
  if (placement.status !== "active") return false;

  const nowTime = now.getTime();
  const startsAt = parseTime(placement.startsAt);
  const endsAt = parseTime(placement.endsAt);

  if (startsAt !== undefined && (Number.isNaN(startsAt) || nowTime < startsAt)) return false;
  if (endsAt !== undefined && (Number.isNaN(endsAt) || nowTime > endsAt)) return false;

  return true;
};

export const getCommercialPlacementsForPath = (
  pathname: string,
  now: Date = new Date(),
  registry: readonly CommercialPlacement[] = COMMERCIAL_PLACEMENTS,
) => {
  const routeGroup = getCommercialRouteGroup(pathname);
  if (!routeGroup) return [];

  return registry.filter(
    (placement) => placement.routeGroups.includes(routeGroup) && isCommercialPlacementLive(placement, now),
  );
};

const isHttpsUrl = (value?: string) => {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export const validateCommercialPlacementRegistry = (
  registry: readonly CommercialPlacement[] = COMMERCIAL_PLACEMENTS,
) => {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const placement of registry) {
    if (!FIXED_ID_PATTERN.test(placement.id)) {
      errors.push(`${placement.id || "<missing>"}: placement id must be a fixed lowercase identifier.`);
    }

    if (seenIds.has(placement.id)) {
      errors.push(`${placement.id}: duplicate placement id.`);
    }
    seenIds.add(placement.id);

    if (placement.routeGroups.length === 0) {
      errors.push(`${placement.id}: at least one reviewed route group is required.`);
    }

    const activationReady = placement.status === "testing" || placement.status === "active";
    if (activationReady) {
      if (!placement.partnerId || !FIXED_ID_PATTERN.test(placement.partnerId)) {
        errors.push(`${placement.id}: testing or active placements require a fixed partnerId.`);
      }
      if (!placement.campaignId || !FIXED_ID_PATTERN.test(placement.campaignId)) {
        errors.push(`${placement.id}: testing or active placements require a fixed campaignId.`);
      }
      if (!isHttpsUrl(placement.destinationUrl)) {
        errors.push(`${placement.id}: testing or active placements require an HTTPS destinationUrl.`);
      }
      if (!placement.disclosureLabel?.trim()) {
        errors.push(`${placement.id}: testing or active placements require an adjacent disclosure label.`);
      }
    }

    const startsAt = parseTime(placement.startsAt);
    const endsAt = parseTime(placement.endsAt);

    if (Number.isNaN(startsAt)) errors.push(`${placement.id}: startsAt must be a valid date.`);
    if (Number.isNaN(endsAt)) errors.push(`${placement.id}: endsAt must be a valid date.`);
    if (
      startsAt !== undefined &&
      endsAt !== undefined &&
      !Number.isNaN(startsAt) &&
      !Number.isNaN(endsAt) &&
      startsAt >= endsAt
    ) {
      errors.push(`${placement.id}: startsAt must be earlier than endsAt.`);
    }
  }

  return errors;
};

export const assertCommercialPlacementRegistry = (
  registry: readonly CommercialPlacement[] = COMMERCIAL_PLACEMENTS,
) => {
  const errors = validateCommercialPlacementRegistry(registry);
  if (errors.length > 0) {
    throw new Error(`Invalid commercial placement registry:\n${errors.join("\n")}`);
  }
  return true;
};
