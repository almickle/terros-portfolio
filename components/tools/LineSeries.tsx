"use client";

/**
 * The shared line series for the tools portals.
 *
 * ONE COMPONENT, because a second copy is how two dashboards end up drawing the
 * same fact differently — and the gap that matters here is not cosmetic: the
 * null-breaks-the-line rule below is a claim about the data, and a copy that
 * quietly plotted zero instead would be making a different one.
 */

/**
 * A line series, hand-drawn in SVG.
 *
 * No chart dependency: this is one polyline and an area fill, and a library
 * would be 40kB of client JavaScript to draw it. The viewBox is fixed and the
 * SVG scales, so it is responsive without measuring anything.
 *
 * A NULL POINT BREAKS THE LINE rather than plotting zero. On the cache series
 * that is the whole point — a day where no call reported the field is a day we
 * cannot see, and joining across it would draw a confident line through a gap.
 */
export function LineSeries({
  points,
  format,
  accent = "var(--color-brand)",
}: {
  points: { day: string; value: number | null }[];
  format: (v: number) => string;
  accent?: string;
}) {
  const W = 720;
  const H = 140;
  const pad = { top: 8, right: 4, bottom: 18, left: 4 };
  const values = points.map((p) => p.value).filter((v): v is number => v !== null);
  if (values.length === 0) {
    return <p className="text-sm text-[--color-muted]">Nothing to plot in this window.</p>;
  }
  const max = Math.max(...values);
  const min = 0;
  const x = (i: number) =>
    pad.left + (points.length <= 1 ? 0 : (i / (points.length - 1)) * (W - pad.left - pad.right));
  const y = (v: number) =>
    pad.top + (1 - (max === min ? 0 : (v - min) / (max - min))) * (H - pad.top - pad.bottom);

  // Runs of consecutive non-null points — each becomes its own polyline, which
  // is what makes a gap read as a gap.
  const runs: { i: number; v: number }[][] = [];
  let run: { i: number; v: number }[] = [];
  points.forEach((p, i) => {
    if (p.value === null) {
      if (run.length) runs.push(run);
      run = [];
    } else run.push({ i, v: p.value });
  });
  if (run.length) runs.push(run);

  const last = points[points.length - 1];
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={`Trend across ${points.length} days, peak ${format(max)}`}>
        <line x1={pad.left} y1={y(max)} x2={W - pad.right} y2={y(max)}
          stroke="currentColor" strokeOpacity={0.12} strokeDasharray="3 4" />
        {runs.map((r, ri) => (
          <g key={ri}>
            {r.length > 1 ? (
              <>
                <polygon
                  points={`${x(r[0]!.i)},${H - pad.bottom} ${r.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")} ${x(r[r.length - 1]!.i)},${H - pad.bottom}`}
                  fill={accent}
                  fillOpacity={0.1}
                />
                <polyline
                  points={r.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <circle cx={x(r[0]!.i)} cy={y(r[0]!.v)} r={2} fill={accent} />
            )}
          </g>
        ))}
        {points.map((p, i) =>
          p.value === null ? null : (
            // Native tooltips: no hover state, no client geometry, works on
            // keyboard focus in every browser that shows title text.
            <circle key={p.day} cx={x(i)} cy={y(p.value)} r={6} fill="transparent">
              <title>{`${p.day} · ${format(p.value)}`}</title>
            </circle>
          )
        )}
        <text x={pad.left} y={H - 4} className="fill-current" fontSize="10" opacity={0.5}>
          {points[0]?.day}
        </text>
        <text x={W - pad.right} y={H - 4} textAnchor="end" className="fill-current" fontSize="10" opacity={0.5}>
          {last?.day}
        </text>
      </svg>
      <figcaption className="text-xs text-[--color-muted] mt-1">
        peak {format(max)}
        {last && last.value !== null ? ` · latest ${format(last.value)}` : ""}
      </figcaption>
    </figure>
  );
}
