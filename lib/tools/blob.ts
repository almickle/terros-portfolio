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

/**
 * The store token, cleaned.
 *
 * TRIMMED BECAUSE A PASTED SECRET PICKS THINGS UP. A trailing newline survives a
 * copy out of a dashboard and into an environment variable, is invisible
 * everywhere you would look for it — including in the error it causes — and
 * makes the value illegal as an HTTP header. It cost a debugging session: the
 * token was byte-identical to one working locally, and the deployed copy still
 * failed, because local `.env` parsing trims and a dashboard paste does not.
 */
export function blobToken(): string | undefined {
  const raw = process.env.BLOB_READ_WRITE_TOKEN;
  if (!raw) return undefined;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").trim();
  return cleaned || undefined;
}

/**
 * Why this token cannot be used, in words — or null if it can.
 *
 * The underlying failure is `Headers.append: "Bearer …" is an invalid header
 * value`, which names neither the variable nor the cause and prints the offending
 * character invisibly. Anything that reaches this point is a configuration
 * mistake, so it is worth saying which one.
 */
export function tokenProblem(token: string): string | null {
  if (!/^[\x21-\x7e]+$/.test(token)) {
    return "BLOB_READ_WRITE_TOKEN contains a character that cannot go in an HTTP header — usually a newline or space picked up when the value was pasted. Re-paste it with no trailing whitespace.";
  }
  if (!token.startsWith("vercel_blob_rw_")) {
    return "BLOB_READ_WRITE_TOKEN does not look like a Blob read-write token; those start with `vercel_blob_rw_`. BLOB_STORE_ID and BLOB_WEBHOOK_PUBLIC_KEY are different values and will not work here.";
  }
  return null;
}

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
  if (!token || tokenProblem(token)) return null;
  return get(pathname, { access: "private", token });
}
