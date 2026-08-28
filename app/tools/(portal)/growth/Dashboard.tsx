"use client";

import { LineSeries } from "@/components/tools/LineSeries";
import { share, stageLabel, type GrowthSnapshot, type SourceRow } from "@/lib/tools/growth";

const int = (v: number) => v.toLocaleString();
/** Null is a dash, never 0% — see `share`. */
const pct = (v: number | null, digits = 0) => (v === null ? "—" : `${(v * 100).toFixed(digits)}%`);

const th = "text-left font-medium text-[--color-muted] py-2 px-3 whitespace-nowrap";
const td = "py-2 px-3 tabular-nums whitespace-nowrap";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs uppercase tracking-wide text-[--color-muted]">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}</div>
      {hint ? <div className="text-xs text-[--color-muted] mt-1">{hint}</div> : null}
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold mb-1">{title}</h2>
      {note ? <p className="text-xs text-[--color-muted] mb-3 max-w-3xl leading-relaxed">{note}</p> : null}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Bar({ value, max, muted = false }: { value: number; max: number; muted?: boolean }) {
  const w = max > 0 ? Math.max(value > 0 ? 0.02 : 0, value / max) : 0;
  return (
    <div className="h-1.5 w-28 rounded-full bg-muted overflow-hidden" aria-hidden>
      <div
        className={`h-full rounded-full ${muted ? "bg-[--color-muted]" : "bg-[--color-brand]"}`}
        style={{ width: `${w * 100}%` }}
      />
    </div>
  );
}

/**
 * A campaign row.
 *
 * The tracked campaigns are marked and kept even at zero — a channel we are
 * spending on that produced nobody is the most important line here, and it is
 * exactly the one a table built from the data alone cannot contain.
 */
function SourceTable({ rows, answered }: { rows: SourceRow[]; answered: number }) {
  const max = Math.max(0, ...rows.map((r) => r.accounts));
  return (
    <table className="text-sm min-w-full">
      <thead>
        <tr className="border-b border-border">
          <th className={th}>Channel</th>
          <th className={th}>Accounts</th>
          <th className={th}>Share of answers</th>
          <th className={th}>Paying</th>
          <th className={th} />
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.source} className="border-b border-border/50">
            <td className={`${td} font-medium`}>
              {r.kind === "tracked" ? (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[--color-brand] mr-2 align-middle" aria-hidden />
              ) : null}
              {r.source}
              {r.kind === "other" ? (
                <span className="text-[--color-muted] text-xs ml-2">a channel the list is missing</span>
              ) : null}
            </td>
            <td className={td}>{int(r.accounts)}</td>
            <td className={td}>{pct(share(r.accounts, answered))}</td>
            <td className={td}>{r.paying > 0 ? int(r.paying) : "—"}</td>
            <td className={td}>
              <Bar value={r.accounts} max={max} muted={r.kind !== "tracked"} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Dashboard({ snapshot: s }: { snapshot: GrowthSnapshot }) {
  const p = s.people;
  const paying = p.byTier.filter((t) => t.tier !== "free").reduce((n, t) => n + t.accounts, 0);
  const maxStage = s.funnel.stages[0]?.devices ?? 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold">Growth</h1>
        <p className="text-xs text-[--color-muted]">
          {s.database === "production" ? "Production" : "Dev branch"} · snapshot taken{" "}
          {new Date(s.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Stat label="Accounts" value={int(p.accounts)} hint={`${int(p.guests)} guests not counted`} />
        <Stat label="New" value={int(p.newAccounts)} hint={`in ${s.windowDays} days`} />
        <Stat label="Active" value={`${int(p.dau)} / ${int(p.wau)} / ${int(p.mau)}`} hint="day / week / month" />
        <Stat
          label="Paying"
          value={int(paying)}
          hint={p.byTier.map((t) => `${t.tier} ${t.accounts}`).join(" · ")}
        />
      </div>

      <Panel
        title="Where they say they came from"
        note={`Self-reported at signup, and the only instrument that reaches word of mouth or ChatGPT — Apple can only see its own ads. The three campaigns are marked and kept even at zero, because a channel we are spending on that produced nobody is the row worth seeing. Shares are of the ${s.sources.answered} accounts that named something.`}
      >
        <SourceTable rows={s.sources.rows} answered={s.sources.answered} />
        <p className="text-xs text-[--color-muted] mt-3 leading-relaxed">
          {int(s.sources.answered)} answered · {int(s.sources.unknown)} asked and did not say ·{" "}
          {int(s.sources.notAsked)} never asked. Those last two are different things, and neither is a channel: one is
          a refusal, the other is an account that predates the prompt or has not reached it. Only the refusal belongs
          in a response rate, and neither belongs in the table above — which is why the shares there sum to 100%.
        </p>
      </Panel>

      <Panel
        title="Apple Ads"
        note="Apple's own attribution, which is a different instrument from the answers above and worth having precisely because the two can disagree. Absence of a row is neither attributed nor organic — it means we never got an answer."
      >
        {s.appleAds.rows.length === 0 ? (
          <p className="text-sm text-[--color-muted]">No attribution rows yet.</p>
        ) : (
          <table className="text-sm min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Result</th>
                <th className={th}>Campaign</th>
                <th className={th}>Ad group</th>
                <th className={th}>Keyword</th>
                <th className={th}>Country</th>
                <th className={th}>Type</th>
                <th className={th}>Accounts</th>
              </tr>
            </thead>
            <tbody>
              {s.appleAds.rows.map((r, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className={`${td} font-medium`}>{r.attributed ? "attributed" : "organic"}</td>
                  <td className={td}>{r.campaignId ?? "—"}</td>
                  <td className={td}>{r.adGroupId ?? "—"}</td>
                  <td className={td}>{r.keywordId ?? "—"}</td>
                  <td className={td}>{r.countryOrRegion ?? "—"}</td>
                  <td className={td}>{r.conversionType ?? "—"}</td>
                  <td className={td}>{int(r.accounts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Panel title="Active users per day" note="Distinct accounts that opened the app, from the presence stamp rather than an event.">
        <LineSeries points={s.activity.map((d) => ({ day: d.day, value: d.users }))} format={(v) => `${Math.round(v)} active`} />
      </Panel>

      <Panel title="New accounts per day" note="Only days with a signup appear — this is the raw series, not a filled calendar.">
        <LineSeries
          points={s.signups.map((d) => ({ day: d.day, value: d.accounts }))}
          format={(v) => `${Math.round(v)} new`}
          accent="var(--color-text)"
        />
      </Panel>

      <Panel
        title="Onboarding funnel"
        note="Distinct devices, back-filled so a device that reached a later stage counts at every earlier one — without that, one dropped telemetry write produces a funnel that grows in the middle. There is no abandonment event and there never will be: leaving does not run code, so abandonment is the absence of the next stage."
      >
        {!s.funnel.readable ? (
          <p className="text-sm leading-relaxed rounded-xl border border-border p-4">
            <strong className="text-[--color-text]">Too early to read.</strong>{" "}
            {s.funnel.devices === 1 ? "One device has" : `${int(s.funnel.devices)} devices have`} reported so far. These events ship with the app, so the table
            fills as the build carrying them reaches people — percentages over this few would look like findings and
            be noise.
          </p>
        ) : (
          <table className="text-sm min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Stage</th>
                <th className={th}>Devices</th>
                <th className={th}>Lost</th>
                <th className={th}>Step</th>
                <th className={th}>Overall</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {s.funnel.stages.map((st) => (
                <tr key={st.stage} className="border-b border-border/50">
                  <td className={`${td} font-medium`}>{stageLabel(st.stage)}</td>
                  <td className={td}>{int(st.devices)}</td>
                  <td className={td}>{st.lost > 0 ? int(st.lost) : "—"}</td>
                  <td className={td}>{pct(st.stepConversion)}</td>
                  <td className={td}>{pct(st.overallConversion)}</td>
                  <td className={td}>
                    <Bar value={st.devices} max={maxStage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
