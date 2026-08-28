import { readFile } from "node:fs/promises";

import { blobToken, readBlob, tokenProblem } from "@/lib/tools/blob";
import { GROWTH_PATH, type GrowthSnapshot } from "@/lib/tools/growth";

/**
 * Reading the growth snapshot — the SERVER half, split from `growth.ts` for the
 * reason `usage.server.ts` records: the dashboard is a client component, and the
 * blob SDK and this `node:fs` read must not follow its types into the browser.
 */
export type GrowthResult =
  | { ok: true; snapshot: GrowthSnapshot }
  | { ok: false; error: { kind: "unconfigured" | "unreachable"; detail?: string } };

export async function loadGrowth(): Promise<GrowthResult> {
  const source = process.env.GROWTH_SNAPSHOT_URL;
  try {
    if (source) {
      if (/^https?:\/\//.test(source)) {
        const res = await fetch(source, { next: { revalidate: 60 } });
        if (!res.ok) return { ok: false, error: { kind: "unreachable", detail: `${res.status} ${res.statusText}` } };
        return { ok: true, snapshot: (await res.json()) as GrowthSnapshot };
      }
      return { ok: true, snapshot: JSON.parse(await readFile(source, "utf8")) as GrowthSnapshot };
    }
    const token = blobToken();
    if (!token) return { ok: false, error: { kind: "unconfigured" } };
    const problem = tokenProblem(token);
    if (problem) return { ok: false, error: { kind: "unreachable", detail: problem } };
    const result = await readBlob(GROWTH_PATH);
    if (!result || result.statusCode !== 200) {
      return {
        ok: false,
        error: { kind: "unreachable", detail: `${GROWTH_PATH} is not in the store — has growth-publish.ts run?` },
      };
    }
    return { ok: true, snapshot: (await new Response(result.stream).json()) as GrowthSnapshot };
  } catch (e) {
    return { ok: false, error: { kind: "unreachable", detail: e instanceof Error ? e.message : String(e) } };
  }
}
