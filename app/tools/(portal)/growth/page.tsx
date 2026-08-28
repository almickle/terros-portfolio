import type { Metadata } from "next";
import { loadGrowth } from "@/lib/tools/growth.server";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Growth · Tools" };
export const revalidate = 300;

export default async function GrowthPage() {
  const result = await loadGrowth();
  if (!result.ok) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold mb-3">Growth</h1>
        <p className="text-sm text-[--color-muted] leading-relaxed">
          {result.error.kind === "unconfigured"
            ? "No BLOB_READ_WRITE_TOKEN is set on this deployment, so the snapshot cannot be read."
            : result.error.detail}
        </p>
        <p className="text-sm text-[--color-muted] mt-3 leading-relaxed">
          Published from the menzi repo:{" "}
          <code className="text-xs">USE_PROD_DB=true bun run scripts/growth-publish.ts</code>
        </p>
      </div>
    );
  }
  return <Dashboard snapshot={result.snapshot} />;
}
