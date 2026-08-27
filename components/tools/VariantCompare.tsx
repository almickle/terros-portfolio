import { Counts } from "@/components/tools/Counts";
import { ProblemBadge } from "@/components/tools/Problems";
import { assetSrc, postable, type ManifestVariant } from "@/lib/tools/manifest";

/** Tallest variant renders at this many pixels; everything else scales from it. */
const TALLEST = 340;

/**
 * Every platform this recipe renders to, side by side AT TRUE RELATIVE SCALE.
 *
 * One scale factor across all of them, derived from the tallest canvas — so a
 * 4:5 deck, a 4:3 Reddit gallery and a 9:16 story are drawn in the proportions
 * they really stand in. Fitting each variant to an equal box would be tidier and
 * would destroy the only thing this view exists to show: that these are
 * genuinely different shapes, not one image cropped four ways.
 *
 * This is what "one recipe, several variations in various formats" actually
 * looks like — and the pipeline has been producing it for a while with nowhere
 * to see it.
 */
export function VariantCompare({ variants }: { variants: ManifestVariant[] }) {
  const scale = TALLEST / Math.max(...variants.map((v) => v.canvas.height));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-8">
        {variants.map((variant) => {
          const cover = postable(variant.assets)[0];
          const src = cover ? assetSrc(cover, "full") : null;
          return (
            <figure key={variant.platform} className="shrink-0">
              <div
                className="overflow-hidden rounded-lg border border-border bg-[#111]"
                style={{ width: variant.canvas.width * scale, height: variant.canvas.height * scale }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={variant.label} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <figcaption className="mt-2">
                <p className="text-sm font-medium">{variant.label}</p>
                <p className="font-mono text-[11px] text-[--color-muted] tabular-nums">
                  {variant.canvas.ratio} · {variant.canvas.width}×{variant.canvas.height} ·{" "}
                  {postable(variant.assets).length} frame
                  {postable(variant.assets).length === 1 ? "" : "s"}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((variant) => (
          <div key={variant.platform} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{variant.label}</p>
              <ProblemBadge problems={variant.problems} />
            </div>
            <Counts counts={variant.copy.counts} />
            {variant.problems.length ? (
              <ul className="mt-3 space-y-1 text-xs text-destructive/90">
                {variant.problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
