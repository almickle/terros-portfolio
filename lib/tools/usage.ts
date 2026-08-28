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
 * THE SHAPE IS OWNED BY THE BACKEND (`src/lib/usageSnapshot.ts`), and these
 * types are a copy across a repo boundary. They are therefore read as a
 * CONTRACT, not as a guarantee: a field the publisher stops sending arrives as
 * undefined, so everything below is rendered defensively and a missing section
 * reads as "not published" rather than crashing the page.
 */
import { blobToken, readBlob, tokenProblem } from "@/lib/tools/blob";

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

export interface UsageSnapshot {
  generatedAt: string;
  database: "production" | "dev branch";
  windowDays: number;
  totals: UsageBucket;
  daily: Array<{ day: string } & UsageBucket>;
  byTask: Array<{ route: string; avgMs: number | null; p95Ms: number | null } & UsageBucket>;
  byModel: Array<{ model: string; servingModel: string | null } & UsageBucket>;
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

export type UsageResult =
  | { ok: true; snapshot: UsageSnapshot }
  | { ok: false; error: { kind: "unconfigured" | "unreachable"; detail?: string } };

/** Share of input tokens served from cache — null when nothing reported it. */
export function hitRate(b: UsageBucket): number | null {
  if (!b || b.cacheReported === 0 || b.prompt <= 0) return null;
  return b.cached / b.prompt;
}

export const perCall = (b: UsageBucket): number | null => (b.calls > 0 ? b.usd / b.calls : null);
export const perKPrompt = (b: UsageBucket): number | null => (b.prompt > 0 ? (b.usd / b.prompt) * 1000 : null);

/**
 * Load the snapshot. Mirrors `loadManifest` — including the local override,
 * which runs the whole page against a `--dry` build with no store at all.
 */
export async function loadUsage(): Promise<UsageResult> {
  const source = process.env.USAGE_SNAPSHOT_URL;
  try {
    if (source) {
      if (/^https?:\/\//.test(source)) {
        const res = await fetch(source, { next: { revalidate: 60 } });
        if (!res.ok) return { ok: false, error: { kind: "unreachable", detail: `${res.status} ${res.statusText}` } };
        return { ok: true, snapshot: (await res.json()) as UsageSnapshot };
      }
      const { readFile } = await import("node:fs/promises");
      return { ok: true, snapshot: JSON.parse(await readFile(source, "utf8")) as UsageSnapshot };
    }

    const token = blobToken();
    if (!token) return { ok: false, error: { kind: "unconfigured" } };
    const problem = tokenProblem(token);
    if (problem) return { ok: false, error: { kind: "unreachable", detail: problem } };

    const result = await readBlob(USAGE_PATH);
    if (!result || result.statusCode !== 200) {
      return {
        ok: false,
        error: { kind: "unreachable", detail: `${USAGE_PATH} is not in the store — has usage-publish.ts run?` },
      };
    }
    return { ok: true, snapshot: (await new Response(result.stream).json()) as UsageSnapshot };
  } catch (e) {
    return { ok: false, error: { kind: "unreachable", detail: e instanceof Error ? e.message : String(e) } };
  }
}
