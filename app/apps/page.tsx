import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Apps",
  description: "Apps by Terros Digital — purposeful tools for serious learners.",
};

const apps = [
  {
    slug: "menzi",
    name: "Menzi",
    tagline: "Mandarin Chinese for serious learners",
    description:
      "A depth-first iOS app combining SM-2 spaced repetition with AI-powered speaking, listening, and writing practice — personalized to your exact vocabulary level.",
    platform: "iOS",
    status: "Available",
  },
];

export default function AppsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="mb-14">
        <p className="text-xs font-medium text-[--color-brand] tracking-widest uppercase mb-3">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold">Our Apps</h1>
        <p className="text-[--color-muted] mt-3 max-w-lg">
          Every app we ship is built around a single, well-defined problem — with depth as the priority over breadth.
        </p>
      </div>

      <div className="grid gap-4">
        {apps.map((app) => (
          <Link key={app.slug} href={`/apps/${app.slug}`} className="group block">
            <Card className="bg-card border-border transition-colors hover:border-[--color-brand]/50">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CardTitle className="text-xl">{app.name}</CardTitle>
                    <Badge variant="outline">{app.platform}</Badge>
                    <Badge>{app.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-[--color-muted] mb-2">
                    {app.tagline}
                  </p>
                  <CardDescription className="text-sm leading-relaxed max-w-xl">
                    {app.description}
                  </CardDescription>
                </div>
                <span className="text-[--color-muted] group-hover:text-[--color-brand] transition-colors text-xl shrink-0">
                  →
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
