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
  url?: string;
  thumbUrl?: string;
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
 * `MARKETING_MANIFEST_URL` takes an http(s) URL — normally the published blob —
 * or a local filesystem path. The local form is not a leftover: it lets the
 * whole portal be run against `marketing/out/manifest.json` before any storage
 * exists, which is how this gets verified without provisioning anything.
 *
 * Revalidated rather than cached forever, so a re-publish shows up on its own.
 */
export async function loadManifest(): Promise<ManifestResult> {
  const source = process.env.MARKETING_MANIFEST_URL;
  if (!source) return { ok: false, error: { kind: "unconfigured" } };

  try {
    if (/^https?:\/\//.test(source)) {
      const res = await fetch(source, { next: { revalidate: 60 } });
      if (!res.ok) return { ok: false, error: { kind: "unreachable", detail: `${res.status} ${res.statusText}` } };
      return { ok: true, manifest: (await res.json()) as Manifest };
    }
    return { ok: true, manifest: JSON.parse(await readFile(source, "utf8")) as Manifest };
  } catch (e) {
    return { ok: false, error: { kind: "unreachable", detail: e instanceof Error ? e.message : String(e) } };
  }
}

/**
 * Where an asset's image actually lives.
 *
 * A published manifest carries absolute URLs. A LOCAL one carries none by
 * design — a path is a durable fact about the render and a URL is a property of
 * wherever it was last sent — so `MARKETING_ASSET_BASE` supplies the origin for
 * a local run, pointed at a static server over `marketing/out/web`.
 */
export function assetSrc(asset: ManifestAsset, size: "full" | "thumb"): string | null {
  const published = size === "thumb" ? asset.thumbUrl : asset.url;
  if (published) return published;
  const base = process.env.MARKETING_ASSET_BASE;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${size}/${asset.path.replace(/\.png$/, ".webp")}`;
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
