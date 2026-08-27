import { Counts } from "@/components/tools/Counts";
import { Badge } from "@/components/ui/badge";
import type { ManifestRecipe, ManifestVariant } from "@/lib/tools/manifest";

/**
 * The developer view: what was authored, with no artwork in the way.
 *
 * The slide table is the substance. Layout name, accent, the eyebrow/display/
 * body actually written, and which app-preview capture the slide asks for —
 * every one of which currently lives only inside a `.mjs` file on one machine.
 * Reading a deck's argument without opening six PNGs is the thing this view is
 * for.
 */
export function ContentTable({ recipe, variants }: { recipe: ManifestRecipe; variants: ManifestVariant[] }) {
  return (
    <div className="space-y-10">
      {recipe.slides.length ? (
        <section>
          <h3 className="mb-3 text-xs uppercase tracking-wider text-[--color-muted]">
            Slides · {recipe.slides.length}
          </h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60 text-left">
                  <Th className="w-10">#</Th>
                  <Th className="w-28">Layout</Th>
                  <Th className="w-32">Accent</Th>
                  <Th>Copy</Th>
                  <Th className="w-40">Capture</Th>
                </tr>
              </thead>
              <tbody>
                {recipe.slides.map((slide) => (
                  <tr key={slide.index} className="border-b border-border/60 last:border-0 align-top">
                    <Td className="font-mono text-xs text-[--color-muted]">{slide.index}</Td>
                    <Td className="font-mono text-xs">{slide.layout}</Td>
                    <Td>
                      {slide.accent ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                          {/* The swatch is the resolved hue from the token package —
                              an accent name alone doesn't tell you the deck walks
                              through four different colours. */}
                          {slide.hue ? (
                            <span
                              className="inline-block size-3 rounded-full border border-white/15"
                              style={{ backgroundColor: slide.hue }}
                            />
                          ) : null}
                          {slide.accent}
                        </span>
                      ) : (
                        <span className="text-[--color-muted]">—</span>
                      )}
                    </Td>
                    <Td>
                      <div className="space-y-1.5 max-w-xl">
                        {slide.eyebrow ? (
                          <p className="text-[11px] uppercase tracking-wider text-[--color-muted]">
                            {slide.eyebrow}
                          </p>
                        ) : null}
                        {slide.display ? (
                          <p className="font-medium whitespace-pre-line leading-snug">{slide.display}</p>
                        ) : null}
                        {slide.body ? (
                          <p className="text-[--color-muted] leading-relaxed">{slide.body}</p>
                        ) : null}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {slide.seal ? <Tag>seal {slide.seal}</Tag> : null}
                          {slide.logo ? <Tag>logo {slide.logo}</Tag> : null}
                          {slide.cta ? <Tag>cta {slide.cta}</Tag> : null}
                        </div>
                      </div>
                    </Td>
                    <Td className="font-mono text-xs text-[--color-muted]">
                      {slide.device ? (
                        <>
                          {slide.device.shot}
                          {slide.device.side ? ` · ${slide.device.side}` : ""}
                        </>
                      ) : (
                        "—"
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {variants.map((variant) => (
        <section key={variant.platform}>
          <div className="mb-3 flex flex-wrap items-baseline gap-3">
            <h3 className="text-xs uppercase tracking-wider text-[--color-muted]">{variant.label}</h3>
            {variant.copy.authored === false ? (
              // Borrowed copy is not the finished thing, and presenting the loan
              // as authored is how it never gets written. See reddit.ts.
              <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-400">
                borrowing the Instagram caption
              </Badge>
            ) : null}
          </div>
          <div className="rounded-lg border border-border p-4 space-y-4">
            <Counts counts={variant.copy.counts} />
            {variant.copy.title ? (
              <Field label="Title">
                <p className="font-medium leading-snug">{variant.copy.title}</p>
              </Field>
            ) : null}
            {variant.copy.caption ? (
              <Field label="Caption">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[--color-muted]">
                  {variant.copy.caption}
                </pre>
              </Field>
            ) : null}
            {variant.copy.body ? (
              <Field label="Body">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[--color-muted]">
                  {variant.copy.body}
                </pre>
              </Field>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wider text-[--color-muted] ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 ${className ?? ""}`}>{children}</td>;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-[--color-muted]">
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-[--color-muted]">{label}</p>
      {children}
    </div>
  );
}
