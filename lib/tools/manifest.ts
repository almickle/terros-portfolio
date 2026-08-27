/**
 * The marketing manifest — the portal's whole data source.
 *
 * Written by `marketing/manifest.ts` in the menzi repo and uploaded by
 * `marketing/publish.ts`. These types mirror it; they are duplicated rather
 * than shared because the two repos have no build relationship and a package
 * boundary between a private monorepo and a public marketing site would be more
 * machinery than the contract is worth. The cost is real, so: **if a field here
 * disagrees with menzi's `manifest.ts`, that file wins.**
 *
 * FETCHED AT REQUEST TIME, NOT BAKED AT BUILD TIME. That is the point of the
 * whole arrangement — re-rendering a deck in menzi and re-publishing updates
 * this portal with no deploy here. A build-time import would put a deploy
 * between the work and being able to look at it, which is the problem the
 * portal exists to solve.
 */
import { readFile } from "node:fs/promises";
import { MANIFEST_PATH, blobToken, readBlob, tokenProblem } from "@/lib/tools/blob";

export type Platform = "instagram" | "reddit" | "stories" | "pinned";

export interface ManifestCanvas {
  width: number;
  height: number;
  /** Reduced, e.g. "4:5". */
  ratio: string;
  /** width / height — lay variations out at true relative scale with this. */
  aspect: number;
}

export interface ManifestAsset {
  file: string;
  /** Path relative to the render's `out/`, e.g. "01-srs/01-statement.png". */
  path: string;
  /** `post` is uploaded; `review` is only ever looked at. */
  role: "post" | "review";
  width: number;
  height: number;
  bytes: number;
}

export interface ManifestSlide {
  index: number;
  layout: string;
  accent?: string;
  hue?: string;
  eyebrow?: string;
  display?: string;
  body?: string;
  cta?: string;
  device?: { shot: string; side?: string };
  seal?: string;
  logo?: string;
}

export interface ManifestCount {
  label: string;
  chars: number;
  /** Absent means informational — must not be drawn as a gauge. */
  limit?: number;
}

export interface ManifestVariant {
  platform: Platform;
  label: string;
  canvas: ManifestCanvas;
  assets: ManifestAsset[];
  copy: {
    title?: string;
    body?: string;
    caption?: string;
    hashtags?: string[];
    counts: ManifestCount[];
    /** False when this platform borrows another's copy rather than owning it. */
    authored?: boolean;
  };
  problems: string[];
}

export interface ManifestRecipe {
  slug: string;
  title: string;
  accent?: string;
  background?: string;
  seal?: string;
  slides: ManifestSlide[];
  variants: ManifestVariant[];
  shots: string[];
  problems: string[];
}

export interface Manifest {
  generatedAt: string;
  limits: {
    instagram: { slides: number; caption: number; hashtags: number };
    house: { hashtags: number };
    reddit: Record<string, number>;
    storySafe: { top: number; bottom: number };
  };
  recipes: ManifestRecipe[];
  problems: string[];
}

/** Why the portal has nothing to show — distinguished so it can say which. */
export type ManifestFailure =
  | { kind: "unconfigured" }
  | { kind: "unreachable"; detail: string };

export type ManifestResult = { ok: true; manifest: Manifest } | { ok: false; error: ManifestFailure };

/**
 * Load the manifest.
 *
 * Two sources, and the ordinary one is the store: a private blob read with
 * `BLOB_READ_WRITE_TOKEN`, at a pathname both sides hold as a constant. There is
 * no URL to configure, because a private blob has none.
 *
 * `MARKETING_MANIFEST_URL` overrides it with an http URL or a local file, which
 * is a development affordance rather than a fallback — it runs the whole portal
 * against `marketing/out/manifest.json` with no store at all.
 */
export async function loadManifest(): Promise<ManifestResult> {
  const source = process.env.MARKETING_MANIFEST_URL;

  try {
    // Local override first, and it is a development affordance, not a fallback:
    // it lets the whole portal run against marketing/out/manifest.json with no
    // store at all. Production sets no such variable and takes the branch below.
    if (source) {
      if (/^https?:\/\//.test(source)) {
        const res = await fetch(source, { next: { revalidate: 60 } });
        if (!res.ok) return { ok: false, error: { kind: "unreachable", detail: `${res.status} ${res.statusText}` } };
        return { ok: true, manifest: (await res.json()) as Manifest };
      }
      return { ok: true, manifest: JSON.parse(await readFile(source, "utf8")) as Manifest };
    }

    const token = blobToken();
    if (!token) return { ok: false, error: { kind: "unconfigured" } };

    // Checked before the read, so a malformed token is reported as the
    // configuration mistake it is rather than surfacing as undici's
    // "invalid header value", which names neither the variable nor the cause.
    const problem = tokenProblem(token);
    if (problem) return { ok: false, error: { kind: "unreachable", detail: problem } };

    const result = await readBlob(MANIFEST_PATH);
    if (!result || result.statusCode !== 200) {
      return {
        ok: false,
        error: { kind: "unreachable", detail: `${MANIFEST_PATH} is not in the store — has publish.ts run?` },
      };
    }
    return { ok: true, manifest: (await new Response(result.stream).json()) as Manifest };
  } catch (e) {
    return { ok: false, error: { kind: "unreachable", detail: e instanceof Error ? e.message : String(e) } };
  }
}

/**
 * Where an asset's image comes from.
 *
 * A ROUTE ON THIS SITE, not a blob URL. The store is private, so a browser
 * cannot read it directly — `/api/tools/asset` checks the same tools cookie the
 * rest of the portal is behind and streams the object through. One gate covering
 * both the pages and the pictures, rather than a password on the pages and open
 * URLs underneath them.
 *
 * `MARKETING_ASSET_BASE` skips the proxy entirely for local development, where
 * the images are served off disk by any static server and there is no store.
 */
export function assetSrc(asset: ManifestAsset, size: "full" | "thumb"): string {
  const base = process.env.MARKETING_ASSET_BASE;
  if (base) return `${base.replace(/\/$/, "")}/${size}/${asset.path.replace(/\.png$/, ".webp")}`;
  return `/api/tools/asset?size=${size}&path=${encodeURIComponent(asset.path)}`;
}

/** Postable frames only — what a mockup should ever show. */
export const postable = (assets: ManifestAsset[]) => assets.filter((a) => a.role === "post");

/** Every problem attached to a recipe, wherever it is attached. */
export const recipeProblems = (recipe: ManifestRecipe): string[] => [
  ...recipe.problems,
  ...recipe.variants.flatMap((v) => v.problems),
];

/** A count that has a limit and has exceeded it. */
export const isOverLimit = (count: ManifestCount) => count.limit !== undefined && count.chars > count.limit;

/**
 * A count that has a limit and does not MEET it.
 *
 * Separate from over-limit because the house hashtag rule is an equality, not a
 * ceiling: five exactly, so a post that quietly drops to three is a problem the
 * same way six would be. See HOUSE in menzi's marketing/index.mjs.
 */
export const isUnderTarget = (count: ManifestCount) =>
  count.label === "hashtags" && count.limit !== undefined && count.chars < count.limit;
