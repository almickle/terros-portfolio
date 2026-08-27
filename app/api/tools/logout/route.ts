/**
 * Drop the session cookie.
 *
 * POST only, and outside /tools for the same reason as the login route: it has
 * to work whether or not the cookie is currently valid. A GET here would let any
 * `<img src>` on any page sign you out.
 */
import { NextResponse, type NextRequest } from "next/server";
import { TOOLS_COOKIE } from "@/lib/tools/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/tools/login", request.url), { status: 303 });
  response.cookies.delete(TOOLS_COOKIE);
  return response;
}
