import type { Metadata } from "next";
import { loadUsage } from "@/lib/tools/usage.server";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Usage · Tools" };
/** The snapshot changes only when it is republished; nothing here is per-request. */
export const revalidate = 300;

/**
 * The server half: read the snapshot, hand it over.
 *
 * The filters are client state, so the tables and the trend lines live in a
 * client component — but the READ stays here, because the store is private and
 * its token must never reach a browser. The whole snapshot is small enough
 * (single-digit KB) to ship as props rather than paginating it behind an API.
 */
export default async function UsagePage() {
  const result = await loadUsage();

  if (!result.ok) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold mb-3">Usage</h1>
        <p className="text-sm text-[--color-muted] leading-relaxed">
          {result.error.kind === "unconfigured"
            ? "No BLOB_READ_WRITE_TOKEN is set on this deployment, so the snapshot cannot be read."
            : result.error.detail}
        </p>
        <p className="text-sm text-[--color-muted] mt-3 leading-relaxed">
          The snapshot is published from the menzi repo:{" "}
          <code className="text-xs">USE_PROD_DB=true bun run scripts/usage-publish.ts</code>
        </p>
      </div>
    );
  }

  return <Dashboard snapshot={result.snapshot} />;
}
