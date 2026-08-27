/**
 * Reading the private marketing store.
 *
 * The assets are uploaded with `access: "private"` because the manifest carries
 * every caption and Reddit title in the series, unposted ones included — a
 * public blob would have put the most sensitive artefact in this whole system
 * outside the password that exists to protect it.
 *
 * The cost is that nothing loads by URL any more: every read needs the token, so
 * it happens on the server and images are proxied. That is the trade, and it is
 * the reason `assetSrc` returns a route on this site rather than a blob URL.
 */
import { get } from "@vercel/blob";

/** Where everything lives in the store — the same prefix `publish.ts` writes. */
export const BLOB_PREFIX = "marketing";

/** The manifest's pathname. A constant on both sides, so nothing has to be told it. */
export const MANIFEST_PATH = `${BLOB_PREFIX}/manifest.json`;

export const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN;

/**
 * An asset's key in the store, derived from the manifest's own `path`.
 *
 * ONE RULE, MIRRORED from publish.ts's `keyFor`. The manifest deliberately
 * carries no URLs — a path is a durable fact about the render, a URL is a
 * property of wherever it was last sent — so this is what turns one into the
 * other, and it is the only place that knows how.
 */
export function assetKey(size: "full" | "thumb", path: string): string {
  return `${BLOB_PREFIX}/${size}/${path.replace(/\.png$/, ".webp")}`;
}

/** Fetch one object. Null when it isn't there, which the caller renders as a 404. */
export async function readBlob(pathname: string) {
  const token = blobToken();
  if (!token) return null;
  return get(pathname, { access: "private", token });
}
