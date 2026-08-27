/**
 * The gate on /tools.
 *
 * ONE IMPLEMENTATION, TWO RUNTIMES, AND THAT IS THE WHOLE DESIGN CONSTRAINT.
 * Next middleware runs on the Edge runtime, where `node:crypto` does not exist;
 * the login route handler runs on Node. `crypto.subtle` is a global in both, so
 * signing and verifying are written against Web Crypto once rather than twice
 * against two APIs that would drift.
 *
 * A single shared password is the right weight for what is behind this today —
 * marketing mockups on a solo-run site. It is deliberately a seam: when the
 * learner-metrics portal arrives carrying real user data, this file is the one
 * thing that has to become real auth, and nothing above it has to change.
 */

export const TOOLS_COOKIE = "terros_tools";

/** Thirty days, matching how long anyone wants to go between logins. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

const hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

/**
 * Constant-time string comparison.
 *
 * Hand-written because Edge has no `timingSafeEqual`. Compares every character
 * whatever happens — an early return on the first mismatch is what makes a
 * signature check leakable one byte at a time.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** A cookie value: the expiry it is good until, and a signature over it. */
export async function issueToken(secret: string, now = Date.now()): Promise<string> {
  const expiry = String(now + TTL_MS);
  return `${expiry}.${await hmac(expiry, secret)}`;
}

/**
 * Is this cookie both intact and current?
 *
 * The expiry is INSIDE the signed payload, so a client cannot extend its own
 * session by editing the cookie — the signature is over the expiry itself.
 */
export async function verifyToken(token: string | undefined, secret: string, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (!safeEqual(signature, await hmac(expiry, secret))) return false;
  const at = Number(expiry);
  return Number.isFinite(at) && at > now;
}

/**
 * The configured secret and password, or null when the gate is not set up.
 *
 * NULL LOCKS THE DOOR, it does not open it. A missing `TOOLS_PASSWORD` in
 * production must not be a portal anyone can walk into, so every caller treats
 * "not configured" as "no entry" and says so plainly rather than failing open.
 */
export function toolsConfig(): { password: string; secret: string } | null {
  const password = process.env.TOOLS_PASSWORD;
  // Falls back to the password so the gate works with one variable set. It is a
  // real reduction in strength — the signing key and the shared secret become
  // the same string — so setting TOOLS_SECRET is worth it, and not setting it
  // must not be the difference between a gate and no gate.
  const secret = process.env.TOOLS_SECRET || password;
  if (!password || !secret) return null;
  return { password, secret };
}
