import { cn } from "@/lib/utils";
import { isOverLimit, isUnderTarget, type ManifestCount } from "@/lib/tools/manifest";

/**
 * The counted things on one platform.
 *
 * A COUNT WITHOUT A LIMIT IS NOT A GAUGE. Instagram caps the caption; Reddit
 * caps the TITLE and leaves the body open — so a Reddit body is rendered as a
 * plain number with nothing to be "out of". Sharing one chars/limit pair across
 * platforms is what once displayed a perfectly good 533-character Reddit body as
 * 533/300, over a limit that was never its own.
 *
 * The hashtag rule reads in BOTH directions, which is why under-target is its
 * own state: the house rule is exactly five, not at most five, so three is as
 * much a problem as six and a plain ceiling gauge would show it as healthy.
 */
export function Counts({ counts }: { counts: ManifestCount[] }) {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2">
      {counts.map((count) => {
        const over = isOverLimit(count);
        const under = isUnderTarget(count);
        return (
          <div key={count.label} className="flex items-baseline gap-1.5">
            <dt className="text-xs uppercase tracking-wider text-[--color-muted]">{count.label}</dt>
            <dd
              className={cn(
                "font-mono text-sm tabular-nums",
                over || under ? "text-destructive" : "text-foreground"
              )}
            >
              {count.chars}
              {count.limit !== undefined ? (
                <span className={cn("text-[--color-muted]", (over || under) && "text-destructive/70")}>
                  /{count.limit}
                </span>
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
