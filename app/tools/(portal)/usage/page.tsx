import type { Metadata } from "next";
import {
  hitRate,
  loadUsage,
  perCall,
  perKPrompt,
  type UsageBucket,
  type UsageSnapshot,
} from "@/lib/tools/usage";

export const metadata: Metadata = { title: "Usage · Tools" };
/** The snapshot changes only when it is republished; nothing here is per-request. */
export const revalidate = 300;

const usd = (v: number | null, digits = 2) =>
  v === null ? "—" : `$${v.toFixed(digits)}`;
const int = (v: number | null) => (v === null ? "—" : Math.round(v).toLocaleString());
/**
 * A rate, or an explicit blank. NEVER "0%" for an unmeasured bucket — the whole
 * point of `cacheReported` is that a provider's silence and a genuine zero are
 * different findings, and collapsing them here would undo it at the last step.
 */
const pct = (v: number | null, digits = 1) => (v === null ? "—" : `${(v * 100).toFixed(digits)}%`);
const ms = (v: number | null) => (v === null ? "—" : `${Math.round(v)}ms`);

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs uppercase tracking-wide text-[--color-muted]">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
      {hint ? <div className="text-xs text-[--color-muted] mt-1">{hint}</div> : null}
    </div>
  );
}

/** A section that says what it is even when it has nothing in it. */
function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold mb-1">{title}</h2>
      {note ? <p className="text-xs text-[--color-muted] mb-3 max-w-3xl leading-relaxed">{note}</p> : null}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

const th = "text-left font-medium text-[--color-muted] py-2 px-3 whitespace-nowrap";
const td = "py-2 px-3 tabular-nums whitespace-nowrap";

/** The share of a bar, for the one visual that earns its space: relative cost. */
function CostBar({ value, max }: { value: number; max: number }) {
  const share = max > 0 ? Math.max(0.005, value / max) : 0;
  return (
    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden" aria-hidden>
      <div className="h-full rounded-full bg-[--color-brand]" style={{ width: `${share * 100}%` }} />
    </div>
  );
}

function Totals({ s }: { s: UsageSnapshot }) {
  const t = s.totals;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Spend" value={usd(t.usd)} hint={`${s.windowDays} days`} />
      <Stat label="Calls" value={int(t.calls)} hint={`${usd(perCall(t), 4)} each`} />
      <Stat
        label="Tokens in / out"
        value={`${int(t.prompt)} / ${int(t.completion)}`}
        hint={`${usd(perKPrompt(t), 4)} per 1k in`}
      />
      <Stat
        label="Cache hit"
        value={pct(hitRate(t))}
        hint={
          t.cacheReported < t.calls
            ? `${int(t.calls - t.cacheReported)} calls did not report it`
            : "of input tokens"
        }
      />
    </div>
  );
}

function Cutover({ s }: { s: UsageSnapshot }) {
  const { before, after, comparison: c, cutover, windowDays } = s.cache;
  return (
    <Panel
      title="Prompt caching"
      note={`Matched ${windowDays.toFixed(1)}-day windows either side of ${cutover}, the day caching began to hit. The windows are the same length on purpose: a longer "before" makes both totals meaningless while the table still looks fair. Read the rate — total spend answers a different question, because a cache does not hold usage still.`}
    >
      <table className="text-sm min-w-full">
        <thead>
          <tr className="border-b border-border">
            <th className={th}>Window</th>
            <th className={th}>Calls</th>
            <th className={th}>Input</th>
            <th className={th}>Cached</th>
            <th className={th}>Hit</th>
            <th className={th}>Cost</th>
            <th className={th}>$/call</th>
            <th className={th}>$/1k in</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Before", b: before },
            { label: "After", b: after },
          ].map(({ label, b }) => (
            <tr key={label} className="border-b border-border/50">
              <td className={`${td} font-medium`}>{label}</td>
              <td className={td}>{int(b.calls)}</td>
              <td className={td}>{int(b.prompt)}</td>
              <td className={td}>{int(b.cached)}</td>
              <td className={td}>{pct(hitRate(b))}</td>
              <td className={td}>{usd(b.usd)}</td>
              <td className={td}>{usd(perCall(b), 4)}</td>
              <td className={td}>{usd(perKPrompt(b), 4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {c.rateChange !== null ? (
        <p className="text-sm mt-3 leading-relaxed">
          Cost per 1k input tokens{" "}
          <strong className="text-[--color-text]">
            {c.rateChange >= 0 ? "+" : ""}
            {(c.rateChange * 100).toFixed(1)}%
          </strong>
          . Input volume {c.volumeRatio?.toFixed(2)}× against spend {c.spendRatio?.toFixed(2)}× — the same volume at
          the old rate would have cost {usd(c.wouldHaveCost)} against {usd(after.usd)} actual,{" "}
          <strong className="text-[--color-text]">{usd(c.saved)}</strong> not spent.
        </p>
      ) : null}
    </Panel>
  );
}

export default async function UsagePage() {
  const result = await loadUsage();

  if (!result.ok) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold mb-3">Usage</h1>
        <p className="text-sm text-[--color-muted] leading-relaxed">
          {result.error.kind === "unconfigured"
            ? "No BLOB_READ_WRITE_TOKEN is set on this deployment, so the snapshot cannot be read."
            : result.error.detail}
        </p>
        <p className="text-sm text-[--color-muted] mt-3 leading-relaxed">
          The snapshot is published from the menzi repo:{" "}
          <code className="text-xs">USE_PROD_DB=true bun run scripts/usage-publish.ts</code>
        </p>
      </div>
    );
  }

  const s = result.snapshot;
  const maxTaskCost = Math.max(0, ...s.byTask.map((t) => t.usd));
  const maxDayCost = Math.max(0, ...s.daily.map((d) => d.usd));
  const uncached = s.byTask.filter((t) => hitRate(t) === 0 && t.prompt > 50_000);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold">Usage</h1>
        <p className="text-xs text-[--color-muted]">
          {/* A snapshot with no date is indistinguishable from a live view that
              has quietly stopped updating. */}
          {s.database === "production" ? "Production" : "Dev branch"} · snapshot taken{" "}
          {new Date(s.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <div className="mt-6">
        <Totals s={s} />
      </div>

      {uncached.length > 0 ? (
        <p className="mt-6 rounded-xl border border-border p-4 text-sm leading-relaxed">
          <strong className="text-[--color-text]">Not caching:</strong>{" "}
          {uncached.map((t) => t.route).join(", ")}. These reported the cache field and returned zero, so it is a
          measured miss rather than a blind spot — worth a look, since other tasks on the same models hit above 80%.
        </p>
      ) : null}

      <Cutover s={s} />

      <Panel title="By task" note="What each kind of call costs, and how much of its prompt is being reused.">
        <table className="text-sm min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Task</th>
              <th className={th}>Calls</th>
              <th className={th}>Input</th>
              <th className={th}>Output</th>
              <th className={th}>Hit</th>
              <th className={th}>Cost</th>
              <th className={th}>$/call</th>
              <th className={th}>p95</th>
              <th className={th}>Fails</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {s.byTask.map((t) => (
              <tr key={t.route} className="border-b border-border/50">
                <td className={`${td} font-medium`}>{t.route}</td>
                <td className={td}>{int(t.calls)}</td>
                <td className={td}>{int(t.prompt)}</td>
                <td className={td}>{int(t.completion)}</td>
                <td className={td}>{pct(hitRate(t))}</td>
                <td className={td}>{usd(t.usd, 4)}</td>
                <td className={td}>{usd(perCall(t), 5)}</td>
                <td className={td}>{ms(t.p95Ms)}</td>
                <td className={td}>{t.failures > 0 ? t.failures : "—"}</td>
                <td className={td}>
                  <CostBar value={t.usd} max={maxTaskCost} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel
        title="By model"
        note="The model asked for, and the one that actually served — a fallback hop shows up as a second row."
      >
        <table className="text-sm min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Asked</th>
              <th className={th}>Served</th>
              <th className={th}>Calls</th>
              <th className={th}>Input</th>
              <th className={th}>Output</th>
              <th className={th}>Hit</th>
              <th className={th}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {s.byModel.map((m) => (
              <tr key={`${m.model}→${m.servingModel ?? "?"}`} className="border-b border-border/50">
                <td className={`${td} font-medium`}>{m.model}</td>
                <td className={td}>
                  {m.servingModel === null ? (
                    <span className="text-[--color-muted]">—</span>
                  ) : m.servingModel === m.model ? (
                    <span className="text-[--color-muted]">same</span>
                  ) : (
                    m.servingModel
                  )}
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
      </Panel>

      <Panel title="Daily" note={`Every day in the ${s.windowDays}-day window.`}>
        <table className="text-sm min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Day</th>
              <th className={th}>Calls</th>
              <th className={th}>Input</th>
              <th className={th}>Output</th>
              <th className={th}>Hit</th>
              <th className={th}>Cost</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody>
            {s.daily.map((d) => (
              <tr key={d.day} className="border-b border-border/50">
                <td className={`${td} font-medium`}>{d.day}</td>
                <td className={td}>{int(d.calls)}</td>
                <td className={td}>{int(d.prompt)}</td>
                <td className={td}>{int(d.completion)}</td>
                <td className={td}>{pct(hitRate(d))}</td>
                <td className={td}>{usd(d.usd, 4)}</td>
                <td className={td}>
                  <CostBar value={d.usd} max={maxDayCost} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel
        title="Voice"
        note="A separate ledger, counted in ElevenLabs credits rather than tokens — there is no per-call dollar figure to report here."
      >
        {s.voice.byRoute.length === 0 ? (
          <p className="text-sm text-[--color-muted]">No voice calls in this window.</p>
        ) : (
          <table className="text-sm min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Route</th>
                <th className={th}>Modality</th>
                <th className={th}>Calls</th>
                <th className={th}>Credits</th>
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
