import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ContentTable } from "@/components/tools/ContentTable";
import { GridTile } from "@/components/tools/GridTile";
import { ManifestState } from "@/components/tools/ManifestState";
import { ProblemBadge, ProblemList } from "@/components/tools/Problems";
import { SlideStrip } from "@/components/tools/SlideStrip";
import { VariantCompare } from "@/components/tools/VariantCompare";
import { loadManifest, postable, recipeProblems, type Platform } from "@/lib/tools/manifest";

const TABS = [
  { id: "mockup", label: "Mockup" },
  { id: "content", label: "Content" },
  { id: "variations", label: "Variations" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string; platform?: string }>;
}) {
  const [{ slug }, query, result] = await Promise.all([params, searchParams, loadManifest()]);

  if (!result.ok) return <ManifestState error={result.error} />;

  const recipe = result.manifest.recipes.find((r) => r.slug === slug);
  if (!recipe) notFound();

  const tab: Tab = TABS.some((t) => t.id === query.tab) ? (query.tab as Tab) : "mockup";
  const variant =
    recipe.variants.find((v) => v.platform === (query.platform as Platform)) ?? recipe.variants[0];
  const problems = recipeProblems(recipe);
  const href = (next: Partial<{ tab: string; platform: string }>) => {
    const search = new URLSearchParams();
    const t = next.tab ?? tab;
    const p = next.platform ?? variant.platform;
    if (t !== "mockup") search.set("tab", t);
    if (p !== recipe.variants[0].platform) search.set("platform", p);
    const qs = search.toString();
    return `/tools/posts/${recipe.slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <Link href="/tools/posts" className="text-xs text-[--color-muted] hover:text-foreground transition-colors">
        ← All posts
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{recipe.title}</h1>
          <p className="mt-1 font-mono text-xs text-[--color-muted]">
            {recipe.slug}
            {recipe.accent ? ` · ${recipe.accent}` : ""}
            {recipe.background ? ` · ${recipe.background}` : ""}
            {recipe.seal ? ` · 印 ${recipe.seal}` : ""}
          </p>
        </div>
        <ProblemBadge problems={problems} />
      </div>

      {problems.length ? (
        <div className="mb-6">
          <ProblemList problems={problems} />
        </div>
      ) : null}

      <nav className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={href({ tab: t.id })}
            className={
              t.id === tab
                ? "-mb-px border-b-2 border-[--color-brand] px-3 py-2 text-sm font-medium"
                : "-mb-px border-b-2 border-transparent px-3 py-2 text-sm text-[--color-muted] hover:text-foreground transition-colors"
            }
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* The platform switch belongs to Mockup and Content, which show ONE
          variant. Variations is the view that shows all of them at once, so a
          selector there would be selecting from what is already on screen. */}
      {tab !== "variations" && recipe.variants.length > 1 ? (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {recipe.variants.map((v) => (
            <Link
              key={v.platform}
              href={href({ platform: v.platform })}
              className={
                v.platform === variant.platform
                  ? "rounded-lg border border-[--color-brand]/50 bg-[--color-brand]/10 px-2.5 py-1 text-xs"
                  : "rounded-lg border border-border px-2.5 py-1 text-xs text-[--color-muted] hover:text-foreground transition-colors"
              }
            >
              {v.label}
              <span className="ml-1.5 font-mono text-[10px] text-[--color-muted]">{v.canvas.ratio}</span>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "mockup" ? (
        <div className="space-y-10">
          <section>
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="text-xs uppercase tracking-wider text-[--color-muted]">
                In the feed — uncropped
              </h2>
              <span className="font-mono text-[11px] text-[--color-muted]">
                {variant.canvas.ratio} · {variant.canvas.width}×{variant.canvas.height}
              </span>
            </div>
            <SlideStrip variant={variant} />
          </section>

          <section>
            <h2 className="mb-1 text-xs uppercase tracking-wider text-[--color-muted]">
              On the profile grid — cut to 3:4
            </h2>
            <p className="mb-3 max-w-xl text-xs leading-relaxed text-[--color-muted]">
              Instagram crops every grid thumbnail to 3:4, so a 4:5 slide loses 34px from each side
              here. This is the crop, not a preview of it.
            </p>
            <div className="grid w-full max-w-md grid-cols-3 gap-1">
              {postable(variant.assets)
                .slice(0, 6)
                .map((asset) => (
                  <GridTile key={asset.path} asset={asset} alt={asset.file} />
                ))}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "content" ? <ContentTable recipe={recipe} variants={[variant]} /> : null}

      {tab === "variations" ? <VariantCompare variants={recipe.variants} /> : null}

      {recipe.shots.length ? (
        <section className="mt-12 border-t border-border pt-6">
          <h2 className="mb-2 text-xs uppercase tracking-wider text-[--color-muted]">
            App captures this recipe depends on
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {recipe.shots.map((shot) => (
              <Badge key={shot} variant="outline" className="font-mono text-[10px] text-[--color-muted]">
                {shot}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
