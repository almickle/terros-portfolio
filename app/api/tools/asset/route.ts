/**
 * Stream one marketing asset out of the private store.
 *
 * The store is private, so a browser cannot read it directly — this is what
 * makes the images visible to someone who has signed in and to nobody else. One
 * gate covering both the pages and the pictures, rather than a password on the
 * pages and open URLs underneath them.
 *
 * IT CHECKS THE COOKIE ITSELF rather than being added to the middleware matcher.
 * That matcher is deliberately narrow — /tools, minus the login page — and
 * widening a security matcher to admit an API route is how it stops describing
 * anything. This route is the only one under /api/tools that must be
 * authenticated, so it says so in its own body.
 */
import { NextResponse, type NextRequest } from "next/server";
import { TOOLS_COOKIE, toolsConfig, verifyToken } from "@/lib/tools/auth";
import { assetKey, readBlob } from "@/lib/tools/blob";

/** The only two sizes publish.ts writes. Anything else is a probe, not a typo. */
const SIZES = new Set(["full", "thumb"]);

export async function GET(request: NextRequest) {
  const config = toolsConfig();
  if (!config || !(await verifyToken(request.cookies.get(TOOLS_COOKIE)?.value, config.secret))) {
    return new NextResponse("Not authorised", { status: 401 });
  }

  const size = request.nextUrl.searchParams.get("size") ?? "";
  const path = request.nextUrl.searchParams.get("path") ?? "";
  if (!SIZES.has(size)) return new NextResponse("Bad size", { status: 400 });

  // The path becomes a store key, so it is constrained rather than trusted: a
  // signed-in visitor still must not be able to walk out of the marketing prefix
  // into the rest of the store by asking for "../".
  if (!path || path.includes("..") || path.startsWith("/") || !path.endsWith(".png")) {
    return new NextResponse("Bad path", { status: 400 });
  }

  const blob = await readBlob(assetKey(size as "full" | "thumb", path));
  if (!blob || blob.statusCode !== 200) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType ?? "image/webp",
      // Private to this viewer's browser, never a shared cache — the whole point
      // is that these bytes are not public.
      "Cache-Control": "private, max-age=3600",
    },
  });
}
