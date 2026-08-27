import type { Metadata } from "next";
import { buttonVariants } from "@/lib/button-variants";

export const metadata: Metadata = {
  title: "Sign in",
  // Belt and braces alongside robots.ts: nothing under /tools should ever be
  // indexed, and the login page is the only one a crawler can actually reach.
  robots: { index: false, follow: false },
};

export default async function ToolsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; unconfigured?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-sm mx-auto px-6 py-32">
      <p className="text-xs font-medium text-[--color-brand] tracking-widest uppercase mb-3">
        Internal
      </p>
      <h1 className="text-2xl font-bold mb-2">Developer tools</h1>
      <p className="text-sm text-[--color-muted] mb-8">
        Not part of the public site.
      </p>

      {params.unconfigured ? (
        // The operator's error, not the visitor's — so it says what to do rather
        // than apologising. The gate is closed either way.
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive mb-1">Not configured</p>
          <p className="text-[--color-muted]">
            Set <code className="font-mono text-xs">TOOLS_PASSWORD</code> (and ideally{" "}
            <code className="font-mono text-xs">TOOLS_SECRET</code>) in the environment. Until then
            these pages stay locked.
          </p>
        </div>
      ) : (
        <form action="/api/tools/login" method="POST" className="flex flex-col gap-3">
          <input type="hidden" name="next" value={params.next ?? "/tools"} />
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {params.error ? (
            <p className="text-sm text-destructive">That password didn&rsquo;t work.</p>
          ) : null}
          <button type="submit" className={buttonVariants({ size: "lg" })}>
            Sign in
          </button>
        </form>
      )}
    </div>
  );
}
