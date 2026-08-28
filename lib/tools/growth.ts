/**
 * The growth snapshot, as this site reads it.
 *
 * Published from the menzi repo into the private store, exactly like the usage
 * snapshot — see `usage.ts` for why the portals read a published object rather
 * than querying production. Types and pure helpers only; the read lives in
 * `growth.server.ts`, or the blob SDK follows these into the browser bundle.
 *
 * The backend owns the shape (`src/lib/growthSnapshot.ts`); this is a copy
 * across a repo boundary and is rendered defensively.
 */

export const GROWTH_PATH = "growth/snapshot.json";

export type SourceKind = "tracked" | "channel" | "other" | "unknown" | "not-asked";

export interface SourceRow {
  source: string;
  kind: SourceKind;
  accounts: number;
  paying: number;
}

export interface FunnelStage {
  stage: string;
  devices: number;
  lost: number;
  stepConversion: number | null;
  overallConversion: number | null;
}

export interface GrowthSnapshot {
  generatedAt: string;
  database: "production" | "dev branch";
  windowDays: number;
  people: {
    accounts: number;
    guests: number;
    newAccounts: number;
    dau: number;
    wau: number;
    mau: number;
    byTier: Array<{ tier: string; accounts: number }>;
  };
  activity: Array<{ day: string; users: number }>;
  signups: Array<{ day: string; accounts: number }>;
  sources: {
    rows: SourceRow[];
    answered: number;
    unknown: number;
    notAsked: number;
  };
  appleAds: {
    rows: Array<{
      attributed: boolean;
      campaignId: number | null;
      adGroupId: number | null;
      keywordId: number | null;
      countryOrRegion: string | null;
      conversionType: string | null;
      accounts: number;
    }>;
    attributed: number;
    organic: number;
  };
  funnel: { stages: FunnelStage[]; devices: number; readable: boolean };
}

/**
 * A share of a stated denominator — NULL when there is nothing to divide by.
 *
 * Never 0. At this scale that distinction is most of the honesty on the page:
 * "nobody came from Reddit, out of twelve answers" is a finding, and "nobody
 * has answered yet" is not, and only one of them is 0%.
 */
export function share(part: number, whole: number): number | null {
  return whole > 0 ? part / whole : null;
}

/** The onboarding stage names, minus the prefix every one of them carries. */
export function stageLabel(stage: string): string {
  return stage.replace(/^onboarding_/, "").replace(/_/g, " ");
}
