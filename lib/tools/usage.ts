/**
 * The production-usage snapshot, as this site reads it.
 *
 * PUBLISHED, NOT QUERIED. `apps/backend/scripts/usage-publish.ts` in the menzi
 * repo builds this object straight out of the production ledgers and writes it
 * to the same private store the marketing manifest uses. This site never sees a
 * database credential and the API grows no authenticated surface for a
 * dashboard to read — the cost is that the page is as fresh as the last publish,
 * which is why `generatedAt` is rendered rather than hidden.
 *
 * TYPES AND ARITHMETIC ONLY — no reader lives here, and that is not tidiness.
 * The dashboard is a client component and imports this module for `hitRate` and
 * the row types; anything server-only in the same file (the blob SDK, a
 * `node:fs` read) is pulled into the browser bundle with them and the build
 * fails on an unhandled scheme. `usage.server.ts` holds the read.
 *
 * THE SHAPE IS OWNED BY THE BACKEND (`src/lib/usageSnapshot.ts`), and these
 * types are a copy across a repo boundary. They are therefore read as a
 * CONTRACT, not as a guarantee: a field the publisher stops sending arrives as
 * undefined, so everything below is rendered defensively and a missing section
 * reads as "not published" rather than crashing the page.
 */
/** Where the publisher writes it. A constant on both sides. */
export const USAGE_PATH = "usage/snapshot.json";

export interface UsageBucket {
  calls: number;
  /** Input tokens. */
  prompt: number;
  /** Output tokens. */
  completion: number;
  /** How much of `prompt` the provider served from cache. */
  cached: number;
  /**
   * How many of these calls reported the cache field at all.
   *
   * Below `calls` means part of the bucket is unmeasured. Zero means all of it
   * is — and that is why `hitRate` returns null rather than 0: a provider that
   * does not report the split is not a provider that never caches, and showing
   * both as "0%" would bury a real bug under another provider's silence.
   */
  cacheReported: number;
  usd: number;
  failures: number;
}

export interface WindowComparison {
  rateChange: number | null;
  wouldHaveCost: number | null;
  saved: number | null;
  volumeRatio: number | null;
  spendRatio: number | null;
}

/**
 * `models` is a LIST because a route legitimately has more than one — a
 * fallback hop, or a tier change part-way through the window. Sorted by cost,
 * so the first is the one that mattered and the rest are worth a tooltip.
 */
export type TaskRow = {
  route: string;
  avgMs: number | null;
  p95Ms: number | null;
  models: Array<{ model: string; calls: number; usd: number }>;
} & UsageBucket;

/**
 * `active` is membership in the backend's task registry — a model the router
 * could pick TODAY — not "used recently". A model we moved off keeps its history
 * and stops being active, which is the whole distinction the filter offers.
 */
export type ModelRow = { model: string; servingModel: string | null; active: boolean } & UsageBucket;

export interface UsageWindow {
  days: number;
  totals: UsageBucket;
  byTask: TaskRow[];
  byModel: ModelRow[];
}

export interface UsageSnapshot {
  generatedAt: string;
  database: "production" | "dev branch";
  windowDays: number;
  /** Offered windows, narrowest first — the time filter is this list. */
  windows: UsageWindow[];
  daily: Array<{ day: string } & UsageBucket>;
  cache: {
    cutover: string;
    windowDays: number;
    before: UsageBucket;
    after: UsageBucket;
    comparison: WindowComparison;
  };
  voice: {
    totals: { calls: number; credits: number };
    byRoute: Array<{ route: string; modality: string; calls: number; credits: number }>;
  };
}

/** Share of input tokens served from cache — null when nothing reported it. */
export function hitRate(b: UsageBucket): number | null {
  if (!b || b.cacheReported === 0 || b.prompt <= 0) return null;
  return b.cached / b.prompt;
}

export const perCall = (b: UsageBucket): number | null => (b.calls > 0 ? b.usd / b.calls : null);
export const perKPrompt = (b: UsageBucket): number | null => (b.prompt > 0 ? (b.usd / b.prompt) * 1000 : null);
