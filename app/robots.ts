import type { MetadataRoute } from "next";

/**
 * Keep /tools out of every index.
 *
 * The middleware already refuses anyone without a cookie, so this is not the
 * gate — it is what stops the login page (the one reachable URL under /tools)
 * from turning up in a search result and advertising that the rest is there.
 */
export default function robots(): MetadataRoute.Robots {
  // No `sitemap:` line, because there is no sitemap. Pointing crawlers at a URL
  // that 404s is worse than saying nothing — add one here the day app/sitemap.ts
  // exists, not before.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/tools", "/tools/", "/api/tools/"] }],
  };
}
