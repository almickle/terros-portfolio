/**
 * The tools portals, and which of them exist yet.
 *
 * ONE LIST, because the sidebar and the index page are two views of the same
 * fact and the way that goes wrong is a nav entry pointing at a page nobody
 * built. `status` is what keeps the planned ones honest: they are listed
 * because the shell was built to take them, and listing them as though they
 * were finished would make the portal lie about itself on its own front page.
 */
export type PortalStatus = "live" | "planned";

export interface Portal {
  slug: string;
  href: string;
  name: string;
  description: string;
  status: PortalStatus;
}

export const PORTALS: Portal[] = [
  {
    slug: "posts",
    href: "/tools/posts",
    name: "Mock posts",
    description:
      "Every social post as it will actually appear, with the authored content behind it and each platform variation at its true ratio.",
    status: "live",
  },
  {
    slug: "usage",
    href: "/tools/usage",
    name: "Usage",
    description:
      "What production actually costs — every LLM call by task and model, input and output tokens, cache hit rates, and the voice ledger beside them.",
    status: "live",
  },
  {
    slug: "growth",
    href: "/tools/growth",
    name: "Growth",
    description:
      "Where learners come from and what they do once here — the three campaigns, self-reported channels against Apple's own attribution, daily actives, and the onboarding funnel.",
    status: "live",
  },
  {
    slug: "design",
    href: "/tools/design",
    name: "Design system",
    description: "The tokens, type ramp and components the apps are actually built from.",
    status: "planned",
  },
  {
    slug: "learning",
    href: "/tools/learning",
    name: "Learning metrics",
    description:
      "How learners are performing in aggregate — review yields, retention, and whether a shipped change moved them.",
    status: "planned",
  },
];

export const livePortals = () => PORTALS.filter((p) => p.status === "live");
