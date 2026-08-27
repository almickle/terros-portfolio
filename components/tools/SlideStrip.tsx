import { assetSrc, postable, type ManifestVariant } from "@/lib/tools/manifest";
import { MissingTile } from "@/components/tools/GridTile";

/**
 * The slides in order, each at the ratio it was actually authored at.
 *
 * NOT cropped, unlike the grid tile — and the pairing is the point. A carousel
 * is READ IN THE FEED, where Instagram shows a post at whatever ratio it was
 * uploaded at; the grid is where it gets cut to 3:4. Showing both is what lets
 * someone see that a cover survives the crop and the artwork inside does not.
 *
 * Review artefacts are excluded here and shown separately: they are not frames
 * anyone uploads, so putting them in the strip would misrepresent the post's
 * length.
 */
export function SlideStrip({ variant }: { variant: ManifestVariant }) {
  const slides = postable(variant.assets);
  const review = variant.assets.filter((a) => a.role === "review");

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {slides.map((asset, i) => {
          const src = assetSrc(asset, "full");
          return (
            <figure key={asset.path} className="shrink-0">
              <div
                className="overflow-hidden rounded-lg border border-border bg-[#111]"
                style={{ aspectRatio: variant.canvas.aspect, height: 420 }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`${variant.label} slide ${i + 1}`} className="h-full w-full object-contain" />
                ) : (
                  <MissingTile />
                )}
              </div>
              <figcaption className="mt-1.5 flex items-baseline justify-between gap-3 font-mono text-[11px] text-[--color-muted]">
                <span>{asset.file}</span>
                <span className="tabular-nums">
                  {asset.width}×{asset.height}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {review.length ? (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[--color-muted]">
            Review only — never uploaded
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {review.map((asset) => {
              const src = assetSrc(asset, "full");
              return (
                <figure key={asset.path} className="shrink-0">
                  <div className="overflow-hidden rounded-lg border border-dashed border-border bg-[#111]" style={{ height: 260 }}>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={asset.file} className="h-full w-auto object-contain" />
                    ) : (
                      <MissingTile />
                    )}
                  </div>
                  <figcaption className="mt-1.5 font-mono text-[11px] text-[--color-muted]">
                    {asset.file} · {asset.width}×{asset.height}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
