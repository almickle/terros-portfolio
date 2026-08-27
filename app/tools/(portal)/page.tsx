import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PORTALS } from "@/lib/tools/portals";

export default function ToolsIndexPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Developer tools</h1>
        <p className="text-[--color-muted] mt-2 max-w-xl text-sm leading-relaxed">
          Internal views over things that otherwise only exist on one machine.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PORTALS.map((portal) => {
          const body = (
            <Card
              className={
                portal.status === "live"
                  ? "h-full bg-card border-border transition-colors hover:border-[--color-brand]/50"
                  : "h-full bg-card/40 border-border/60"
              }
            >
              <CardHeader className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className={portal.status === "live" ? "text-base" : "text-base text-[--color-muted]"}>
                    {portal.name}
                  </CardTitle>
                  {portal.status === "planned" ? (
                    <Badge variant="outline" className="text-[--color-muted]">
                      Planned
                    </Badge>
                  ) : null}
                </div>
                <CardDescription className="text-sm leading-relaxed">{portal.description}</CardDescription>
              </CardHeader>
            </Card>
          );

          // A planned portal is not a link. Listing it says the shell was built
          // to take it; making it clickable would promise a page.
          return portal.status === "live" ? (
            <Link key={portal.slug} href={portal.href} className="block">
              {body}
            </Link>
          ) : (
            <div key={portal.slug}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
