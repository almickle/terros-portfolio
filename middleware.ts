/**
 * The gate on /tools — everything under it is internal.
 *
 * Middleware rather than a per-page check, because a per-page check is a thing
 * somebody forgets to add to page eleven. The matcher is the enumeration, and
 * it is one line.
 *
 * Runs on the Edge runtime: see lib/tools/auth.ts for why the crypto in here is
 * Web Crypto and not `node:crypto`.
 */
import { NextResponse, type NextRequest } from "next/server";
import { TOOLS_COOKIE, toolsConfig, verifyToken } from "@/lib/tools/auth";

export async function middleware(request: NextRequest) {
  const config = toolsConfig();

  // Unconfigured is LOCKED, not open. A deployment missing TOOLS_PASSWORD must
  // not quietly serve internal pages to the public web; the login page renders
  // the reason so the operator sees it instead of a blank 404.
  if (!config) {
    return NextResponse.rewrite(new URL("/tools/login?unconfigured=1", request.url));
  }

  const ok = await verifyToken(request.cookies.get(TOOLS_COOKIE)?.value, config.secret);
  if (ok) return NextResponse.next();

  const login = new URL("/tools/login", request.url);
  // Carry where they were going, so a bookmarked deep link survives the login.
  if (request.nextUrl.pathname !== "/tools") login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  /**
   * Everything under /tools EXCEPT the login page and its route handler — those
   * two have to be reachable by someone who has not signed in yet, which is the
   * one thing this matcher must get right.
   */
  matcher: ["/tools", "/tools/((?!login).*)"],
};
