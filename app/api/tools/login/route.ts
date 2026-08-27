/**
 * Exchange the shared password for a signed cookie.
 *
 * Deliberately OUTSIDE /tools, so the middleware matcher never has to carve out
 * an exception for the one endpoint that must be reachable without a session.
 * A carve-out in a security matcher is a thing that gets widened later.
 */
import { NextResponse, type NextRequest } from "next/server";
import { TOOLS_COOKIE, issueToken, toolsConfig } from "@/lib/tools/auth";

/** Only ever redirect within this site — an open redirect on a login endpoint
 *  is how a phishing link borrows a real domain. */
function safeNext(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/tools") && !path.startsWith("//") ? path : "/tools";
}

export async function POST(request: NextRequest) {
  const config = toolsConfig();
  if (!config) {
    return NextResponse.redirect(new URL("/tools/login?unconfigured=1", request.url), { status: 303 });
  }

  const form = await request.formData();
  const submitted = form.get("password");
  const next = safeNext(form.get("next"));

  if (typeof submitted !== "string" || submitted !== config.password) {
    // No detail about WHY, and the same response for a missing and a wrong
    // password — there is exactly one account here, so any distinction is a
    // free hint.
    return NextResponse.redirect(new URL("/tools/login?error=1", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  response.cookies.set(TOOLS_COOKIE, await issueToken(config.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
