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
        <h2 className="text-base font-semibold mb-2">No manifest configured</h2>
        <p className="text-sm text-[--color-muted] leading-relaxed mb-4">
          This portal reads a manifest published from the menzi repo. Point it at one:
        </p>
        <pre className="rounded-md bg-background border border-border p-3 text-xs font-mono overflow-x-auto">
{`# published (normal)
MARKETING_MANIFEST_URL=https://<store>.public.blob.vercel-storage.com/marketing/manifest.json

# or straight off disk, before any storage exists
MARKETING_MANIFEST_URL=../menzi/marketing/out/manifest.json
MARKETING_ASSET_BASE=http://localhost:8100`}
        </pre>
        <p className="text-xs text-[--color-muted] leading-relaxed mt-4">
          Generate it with <code className="font-mono">bun run marketing/manifest.ts</code>, and the web
          images with <code className="font-mono">bun run marketing/publish.ts --dry</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 max-w-2xl">
      <h2 className="text-base font-semibold text-destructive mb-2">Couldn&rsquo;t read the manifest</h2>
      <p className="text-sm text-[--color-muted] leading-relaxed">
        <code className="font-mono text-xs">MARKETING_MANIFEST_URL</code> is set, but fetching it failed.
      </p>
      <p className="mt-3 font-mono text-xs text-destructive/90">{error.detail}</p>
    </div>
  );
}
