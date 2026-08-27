import { assetSrc, type ManifestAsset } from "@/lib/tools/manifest";

/**
 * A post as the Instagram PROFILE GRID shows it.
 *
 * THE CELL IS 3:4, NOT THE POST'S RATIO, and that distinction has already cost a
 * shipped mistake. Instagram's grid crops every thumbnail to 3:4 (a change from
 * square in January 2025), so a 4:5 deck cover loses 34px from each side here —
 * 1080 down to 1013 — while a 3:4 upload fills the cell untouched.
 *
 * menzi's own preview page had this at 4/5 until 2026-08-23, which made it a
 * picture of the SLIDE rather than a picture of the GRID: a 4:5 tile in a 4:5
 * box crops to nothing, so the mock showed every post whole and agreed with
 * itself no matter what was uploaded. The pinned row shipped visibly clipped on
 * the real grid while that page rendered it perfectly.
 *
 * So: fixed 3:4 box, `object-cover`, and the crop is the information.
 */
export function GridTile({ asset, alt }: { asset: ManifestAsset; alt: string }) {
  const src = assetSrc(asset, "thumb");
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#111]">
      {/* eslint-disable-next-line @next/next/no-img-element -- the blob host is
          configured at runtime, so next/image's build-time remotePatterns can't
          know it. An internal tool over ~4MB of webp does not need the loader. */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}
