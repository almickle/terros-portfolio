import type { ManifestFailure } from "@/lib/tools/manifest";

/**
 * Why there is nothing to show.
 *
 * The two failures are told apart on purpose. "Not configured" is a setup step
 * the operator has not done; "unreachable" is something that was working and is
 * not. Collapsing them into one empty state would make a broken publish look
 * like a fresh install, and the fix for each is completely different.
 */
export function ManifestState({ error }: { error: ManifestFailure }) {
  if (error.kind === "unconfigured") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 max-w-2xl">
        <h2 className="text-base font-semibold mb-2">No store configured</h2>
        <p className="text-sm text-[--color-muted] leading-relaxed mb-4">
          This portal reads a private Blob store that menzi publishes to. It needs the same
          read-write token that <code className="font-mono text-xs">marketing/publish.ts</code> uploads
          with — one variable, no URL:
        </p>
        <pre className="rounded-md bg-background border border-border p-3 text-xs font-mono overflow-x-auto">
{`BLOB_READ_WRITE_TOKEN=vercel_blob_rw_…

# Connecting the Blob store to this Vercel project sets it for you.
# BLOB_STORE_ID and BLOB_WEBHOOK_PUBLIC_KEY are different values
# and are not used here.`}
        </pre>
        <p className="text-xs text-[--color-muted] leading-relaxed mt-4">
          To run with no store at all, point{" "}
          <code className="font-mono">MARKETING_MANIFEST_URL</code> at{" "}
          <code className="font-mono">marketing/out/manifest.json</code> on disk and{" "}
          <code className="font-mono">MARKETING_ASSET_BASE</code> at a static server over{" "}
          <code className="font-mono">marketing/out/web</code>.
        </p>
      </div>
    );
  }

  // Deliberately does NOT name a variable. This branch used to say
  // "MARKETING_MANIFEST_URL is set, but fetching it failed" — which was true
  // when a URL was the only source and became a lie the day the store went
  // private, sending someone to check a variable they had never set while the
  // real cause sat in the line underneath.
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 max-w-2xl">
      <h2 className="text-base font-semibold text-destructive mb-2">Couldn&rsquo;t read the manifest</h2>
      <p className="text-sm text-[--color-muted] leading-relaxed">
        The store is configured, but reading{" "}
        <code className="font-mono text-xs">marketing/manifest.json</code> out of it failed:
      </p>
      <p className="mt-3 text-sm text-destructive/90 leading-relaxed">{error.detail}</p>
    </div>
  );
}
