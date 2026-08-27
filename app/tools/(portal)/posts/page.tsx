import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GridTile } from "@/components/tools/GridTile";
import { ManifestState } from "@/components/tools/ManifestState";
import { ProblemBadge } from "@/components/tools/Problems";
import { loadManifest, postable, recipeProblems, type Platform } from "@/lib/tools/manifest";

/** The tabs, in the order the work actually happens. */
const PLATFORMS: Array<{ id: Platform | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "instagram", label: "Instagram" },
  { id: "reddit", label: "Reddit" },
  { id: "stories", label: "Stories" },
  { id: "pinned", label: "Pinned" },
];

/**
 * TABS AS A URL PARAM, not client state.
 *
 * The whole page is server-rendered off a manifest fetch, so a filter that lives
 * in the URL costs nothing, survives a reload, and can be linked to — "look at
 * the Reddit ones" is a message someone can send. Client state here would buy
 * a nicer transition and lose all three.
 */
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const [{ platform = "all" }, result] = await Promise.all([searchParams, loadManifest()]);

  if (!result.ok) {
    return (
      <div>
        <Header />
        <ManifestState error={result.error} />
      </div>
    );
  }

  const { manifest } = result;
  const recipes =
    platform === "all"
      ? manifest.recipes
      : manifest.recipes.filter((r) => r.variants.some((v) => v.platform === platform));

  return (
    <div>
      <Header generatedAt={manifest.generatedAt} problems={manifest.problems.length} />

      <nav className="flex gap-1 mb-8 border-b border-border">
        {PLATFORMS.map((tab) => {
          const count =
            tab.id === "all"
              ? manifest.recipes.length
              : manifest.recipes.filter((r) => r.variants.some((v) => v.platform === tab.id)).length;
          const active = tab.id === platform;
          return (
            <Link
              key={tab.id}
              href={tab.id === "all" ? "/tools/posts" : `/tools/posts?platform=${tab.id}`}
              className={
                active
                  ? "-mb-px border-b-2 border-[--color-brand] px-3 py-2 text-sm font-medium"
                  : "-mb-px border-b-2 border-transparent px-3 py-2 text-sm text-[--color-muted] hover:text-foreground transition-colors"
              }
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-[--color-muted] tabular-nums">{count}</span>
            </Link>
          );
        })}
      </nav>

      {manifest.problems.length ? (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs uppercase tracking-wider text-destructive/80 mb-2">Across the set</p>
          <ul className="text-sm space-y-1">
            {manifest.problems.map((p) => (
              <li key={p} className="text-destructive/90">
                {p}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => {
          // The cover of the variant being filtered on — so the Reddit tab shows
          // Reddit artwork rather than the Instagram cover of a post that also
          // has a Reddit gallery.
          const variant =
            recipe.variants.find((v) => v.platform === platform) ?? recipe.variants[0];
          const cover = postable(variant.assets)[0];
          const problems = recipeProblems(recipe);

          return (
            <Link key={recipe.slug} href={`/tools/posts/${recipe.slug}`} className="group block">
              {cover ? <GridTile asset={cover} alt={recipe.title} /> : null}
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:text-[--color-brand] transition-colors">
                    {recipe.title}
                  </p>
                  <p className="truncate font-mono text-xs text-[--color-muted]">{recipe.slug}</p>
                </div>
                <ProblemBadge problems={problems} quiet />
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {recipe.variants.map((v) => (
                  <Badge key={v.platform} variant="outline" className="text-[10px] text-[--color-muted]">
                    {v.canvas.ratio} · {postable(v.assets).length}
                  </Badge>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {recipes.length === 0 ? (
        <p className="text-sm text-[--color-muted]">Nothing rendered for this platform yet.</p>
      ) : null}
    </div>
  );
}

function Header({ generatedAt, problems }: { generatedAt?: string; problems?: number } = {}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Mock posts</h1>
      <p className="text-[--color-muted] mt-2 max-w-xl text-sm leading-relaxed">
        Every social post as it will actually appear, the content behind it, and each platform
        variation at its true ratio.
      </p>
      {generatedAt ? (
        <p className="mt-3 font-mono text-xs text-[--color-muted]">
          rendered {new Date(generatedAt).toLocaleString()}
          {problems ? ` · ${problems} set-level problem${problems === 1 ? "" : "s"}` : ""}
        </p>
      ) : null}
    </div>
  );
}
