"use client";

import { useState } from "react";
import {
  hitRate,
  perCall,
  perKPrompt,
  type UsageBucket,
  type UsageSnapshot,
} from "@/lib/tools/usage";
import { cn } from "@/lib/utils";

const usd = (v: number | null, digits = 2) => (v === null ? "—" : `$${v.toFixed(digits)}`);
const int = (v: number | null) => (v === null ? "—" : Math.round(v).toLocaleString());
/** Never "0%" for an unmeasured bucket — see `cacheReported`. */
const pct = (v: number | null, digits = 1) => (v === null ? "—" : `${(v * 100).toFixed(digits)}%`);
const ms = (v: number | null) => (v === null ? "—" : `${Math.round(v)}ms`);

const th = "text-left font-medium text-[--color-muted] py-2 px-3 whitespace-nowrap";
const td = "py-2 px-3 tabular-nums whitespace-nowrap";

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-[--color-muted]">{label}</span>
      <div className="inline-flex rounded-lg border border-border p-0.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={o.value === value}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-colors",
              o.value === value
                ? "bg-[--color-brand] text-white"
                : "text-[--color-muted] hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs uppercase tracking-wide text-[--color-muted]">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
      {hint ? <div className="text-xs text-[--color-muted] mt-1">{hint}</div> : null}
    </div>
  );
}

function Panel({ title, note, right, children }: {
  title: string;
  note?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
        <h2 className="text-base font-semibold">{title}</h2>
        {right}
      </div>
      {note ? <p className="text-xs text-[--color-muted] mb-3 max-w-3xl leading-relaxed">{note}</p> : null}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function CostBar({ value, max }: { value: number; max: number }) {
  const share = max > 0 ? Math.max(0.005, value / max) : 0;
  return (
    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden" aria-hidden>
      <div className="h-full rounded-full bg-[--color-brand]" style={{ width: `${share * 100}%` }} />
    </div>
  );
}

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
function LineSeries({
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

export function Dashboard({ snapshot: s }: { snapshot: UsageSnapshot }) {
  const windows = s.windows ?? [];
  // Default to the middle window when there is one: 7 days is noisy on a
  // low-volume day and 90 is where the stale rows live.
  const [days, setDays] = useState<number>(windows[Math.min(1, windows.length - 1)]?.days ?? 30);
  const [modelScope, setModelScope] = useState<"active" | "all">("active");

  const w = windows.find((x) => x.days === days) ?? windows[windows.length - 1];
  if (!w) return <p className="text-sm text-[--color-muted]">This snapshot carries no windows — republish it.</p>;

  const t: UsageBucket = w.totals;
  const daily = s.daily.slice(-days);
  const models = modelScope === "active" ? w.byModel.filter((m) => m.active) : w.byModel;
  const hiddenModels = w.byModel.length - w.byModel.filter((m) => m.active).length;
  const maxTaskCost = Math.max(0, ...w.byTask.map((x) => x.usd));
  const uncached = w.byTask.filter((x) => hitRate(x) === 0 && x.prompt > 50_000);

  const timeFilter = (
    <Segmented
      label="Window"
      value={days}
      onChange={setDays}
      options={windows.map((x) => ({ value: x.days, label: `${x.days}d` }))}
    />
  );

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold">Usage</h1>
        <p className="text-xs text-[--color-muted]">
          {s.database === "production" ? "Production" : "Dev branch"} · snapshot taken{" "}
          {new Date(s.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <div className="mt-5">{timeFilter}</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <Stat label="Spend" value={usd(t.usd)} hint={`last ${days} days`} />
        <Stat label="Calls" value={int(t.calls)} hint={`${usd(perCall(t), 4)} each`} />
        <Stat label="Tokens in / out" value={`${int(t.prompt)} / ${int(t.completion)}`} hint={`${usd(perKPrompt(t), 4)} per 1k in`} />
        <Stat
          label="Cache hit"
          value={pct(hitRate(t))}
          hint={t.cacheReported < t.calls ? `${int(t.calls - t.cacheReported)} calls did not report it` : "of input tokens"}
        />
      </div>

      {uncached.length > 0 ? (
        <p className="mt-6 rounded-xl border border-border p-4 text-sm leading-relaxed">
          <strong className="text-[--color-text]">Not caching:</strong> {uncached.map((x) => x.route).join(", ")}. These
          reported the cache field and returned zero, so it is a measured miss rather than a blind spot — worth a look,
          since other tasks on the same models hit above 80%.
        </p>
      ) : null}

      <Panel title="Spend per day" note={`Every day in the selected window. Hover a point for the figure.`}>
        <LineSeries points={daily.map((d) => ({ day: d.day, value: d.usd }))} format={(v) => usd(v, 2)} />
      </Panel>

      <Panel
        title="Cache hit per day"
        note="Share of input tokens served from cache. The line BREAKS on a day when no call reported the field — that is a day we cannot see, and joining across it would draw a confident line through a gap."
      >
        <LineSeries
          points={daily.map((d) => ({ day: d.day, value: hitRate(d) }))}
          format={(v) => pct(v)}
          accent="var(--color-text)"
        />
      </Panel>

      <Panel title="By task" note="What each kind of call costs, and how much of its prompt is being reused." right={timeFilter}>
        <table className="text-sm min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Task</th><th className={th}>Calls</th><th className={th}>Input</th>
              <th className={th}>Output</th><th className={th}>Hit</th><th className={th}>Cost</th>
              <th className={th}>$/call</th><th className={th}>p95</th><th className={th}>Fails</th><th className={th} />
            </tr>
          </thead>
          <tbody>
            {w.byTask.map((x) => (
              <tr key={x.route} className="border-b border-border/50">
                <td className={`${td} font-medium`}>{x.route}</td>
                <td className={td}>{int(x.calls)}</td>
                <td className={td}>{int(x.prompt)}</td>
                <td className={td}>{int(x.completion)}</td>
                <td className={td}>{pct(hitRate(x))}</td>
                <td className={td}>{usd(x.usd, 4)}</td>
                <td className={td}>{usd(perCall(x), 5)}</td>
                <td className={td}>{ms(x.p95Ms)}</td>
                <td className={td}>{x.failures > 0 ? x.failures : "—"}</td>
                <td className={td}><CostBar value={x.usd} max={maxTaskCost} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel
        title="By model"
        note="Active means the task registry could route to it today — not that it was used recently. A model we moved off keeps its history here and stops being active."
        right={
          <div className="flex items-center gap-4 flex-wrap">
            <Segmented
              label="Models"
              value={modelScope}
              onChange={setModelScope}
              options={[{ value: "active" as const, label: "Active" }, { value: "all" as const, label: "All" }]}
            />
            {timeFilter}
          </div>
        }
      >
        <table className="text-sm min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Asked</th><th className={th}>Served</th><th className={th}>Calls</th>
              <th className={th}>Input</th><th className={th}>Output</th><th className={th}>Hit</th><th className={th}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={`${m.model}→${m.servingModel ?? "?"}`} className="border-b border-border/50">
                <td className={`${td} font-medium`}>{m.model}</td>
                <td className={td}>
                  {m.servingModel === null ? <span className="text-[--color-muted]">—</span>
                    : m.servingModel === m.model ? <span className="text-[--color-muted]">same</span>
                    : m.servingModel}
                </td>
                <td className={td}>{int(m.calls)}</td>
                <td className={td}>{int(m.prompt)}</td>
                <td className={td}>{int(m.completion)}</td>
                <td className={td}>{pct(hitRate(m))}</td>
                <td className={td}>{usd(m.usd, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {modelScope === "active" && hiddenModels > 0 ? (
          <p className="text-xs text-[--color-muted] mt-2">
            {hiddenModels} retired model {hiddenModels === 1 ? "row is" : "rows are"} hidden. Their spend is still in the
            totals above — this filter changes the table, not the arithmetic.
          </p>
        ) : null}
      </Panel>

      <Panel title="Voice" note="A separate ledger, counted in ElevenLabs credits rather than tokens — there is no per-call dollar figure to report.">
        {s.voice.byRoute.length === 0 ? (
          <p className="text-sm text-[--color-muted]">No voice calls in this window.</p>
        ) : (
          <table className="text-sm min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Route</th><th className={th}>Modality</th><th className={th}>Calls</th><th className={th}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {s.voice.byRoute.map((v) => (
                <tr key={`${v.route}·${v.modality}`} className="border-b border-border/50">
                  <td className={`${td} font-medium`}>{v.route}</td>
                  <td className={td}>{v.modality}</td>
                  <td className={td}>{int(v.calls)}</td>
                  <td className={td}>{int(v.credits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
