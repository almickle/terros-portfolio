import { Badge } from "@/components/ui/badge";

/**
 * What the validators found.
 *
 * `postProblems`, `redditProblems` and `storyProblems` have existed in the
 * render pipeline for as long as the decks have, and until now they have only
 * ever printed to a terminal — read once at render time and never again. This
 * is the first thing that puts them next to the artwork they are about.
 *
 * Silence is shown as silence, not as nothing: a recipe with no problems says
 * so, because "no badge" is indistinguishable from "not checked".
 */
export function ProblemBadge({ problems, quiet = false }: { problems: string[]; quiet?: boolean }) {
  if (!problems.length) {
    return quiet ? null : (
      <Badge variant="outline" className="border-border text-[--color-muted]">
        clean
      </Badge>
    );
  }
  return (
    <Badge className="border-destructive/40 bg-destructive/15 text-destructive">
      {problems.length} problem{problems.length === 1 ? "" : "s"}
    </Badge>
  );
}

export function ProblemList({ problems }: { problems: string[] }) {
  if (!problems.length) return null;
  return (
    <ul className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm space-y-1.5">
      {problems.map((problem) => (
        <li key={problem} className="text-destructive/90 leading-relaxed">
          {problem}
        </li>
      ))}
    </ul>
  );
}
