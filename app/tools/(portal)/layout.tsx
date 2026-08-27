import Link from "next/link";
import { PORTALS } from "@/lib/tools/portals";
import { cn } from "@/lib/utils";

/**
 * The shell every portal renders inside — and ONLY the portals.
 *
 * A route group, so the login page (a sibling under /tools) does not inherit it.
 * It used to: someone who had not signed in was shown a full navigation sidebar
 * and a "Sign out" button.
 *
 * Built once, for four portals rather than one. The mock-post view is the only
 * live one today; the other three are listed here from the start because a
 * sidebar that grows an entry per portal is how each of them ends up inventing
 * its own navigation.
 */
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div className="flex items-baseline gap-3">
          <Link href="/tools" className="text-sm font-semibold tracking-wide hover:text-[--color-brand] transition-colors">
            Tools
          </Link>
          <span className="text-xs text-[--color-muted]">Internal · not part of the public site</span>
        </div>
        {/* A POST, not a link — a GET sign-out can be fired by any image tag. */}
        <form action="/api/tools/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-[--color-muted] hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <nav className="md:w-44 shrink-0">
          <ul className="flex md:flex-col gap-1 overflow-x-auto">
            {PORTALS.map((portal) => (
              <li key={portal.slug}>
                {portal.status === "live" ? (
                  <Link
                    href={portal.href}
                    className="block rounded-lg px-3 py-2 text-sm whitespace-nowrap text-[--color-muted] hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {portal.name}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm whitespace-nowrap",
                      "text-[--color-muted]/45 cursor-default"
                    )}
                    title="Not built yet"
                  >
                    {portal.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
