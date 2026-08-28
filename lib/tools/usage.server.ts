import { readFile } from "node:fs/promises";

import { blobToken, readBlob, tokenProblem } from "@/lib/tools/blob";
import { USAGE_PATH, type UsageSnapshot } from "@/lib/tools/usage";

/**
 * Reading the usage snapshot — the SERVER half.
 *
 * Split from `usage.ts` because the dashboard is a client component and imports
 * the types and rate helpers from there. Kept together, the blob SDK and this
 * file's `node:fs` read follow them into the browser bundle and the build fails
 * on an unhandled scheme. The token must never reach a browser regardless, so
 * the split is the correct shape and not merely the one that compiles.
 */
export type UsageResult =
  | { ok: true; snapshot: UsageSnapshot }
  | { ok: false; error: { kind: "unconfigured" | "unreachable"; detail?: string } };

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
