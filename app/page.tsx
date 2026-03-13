import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppScreenshotCarousel } from "@/components/AppScreenshotCarousel";
import {
  BrainCircuit,
  Mic,
  Headphones,
  BookOpen,
  PenLine,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  Clock,
  UserCheck,
} from "lucide-react";

const modes = [
  {
    icon: PenLine,
    name: "Hanzi Mode",
    description:
      "See a character, type the pinyin. Builds the reading-to-pronunciation link most apps skip.",
  },
  {
    icon: BookOpen,
    name: "Pinyin Mode",
    description:
      "See pinyin, write a sentence. Forces active production — not just passive recognition.",
  },
  {
    icon: Sparkles,
    name: "Learn Mode",
    description:
      "New words arrive with AI-generated explanations and example sentences before entering your queue.",
  },
  {
    icon: Mic,
    name: "Speaking Mode",
    description:
      "Real-time voice conversation with an AI tutor constrained to your vocabulary — no unfamiliar words.",
  },
  {
    icon: Headphones,
    name: "Listening Mode",
    description:
      "Comprehensible input sentences generated from your own deck, read aloud at exactly your level.",
  },
  {
    icon: LayoutGrid,
    name: "Constructs Mode",
    description:
      "Grammar pattern library with AI-graded sentence construction exercises, tracked per pattern.",
  },
];

const pillars = [
  {
    icon: BrainCircuit,
    title: "SM-2 spaced repetition",
    body: "The classic algorithm schedules every card at the exact right interval — reviews compound, never pile up.",
  },
  {
    icon: Sparkles,
    title: "AI-personalized practice",
    body: "Every LLM interaction is shaped by your vocabulary deck and performance data, so feedback is always relevant.",
  },
  {
    icon: Clock,
    title: "Efficient review sessions",
    body: "Cards are scored 1–5 with natural language feedback. Spend your time on what you actually need to drill.",
  },
  {
    icon: UserCheck,
    title: "Vocabulary-constrained AI",
    body: "Speaking and Listening modes stay within your known words — comprehensible input at your level, always.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -top-32 flex items-start justify-center overflow-hidden"
        >
          <div className="h-[480px] w-[680px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative max-w-2xl">
          <Badge variant="secondary" className="mb-5 gap-1.5 text-primary border-primary/30 bg-primary/10">
            <Sparkles className="size-3" />
            Now on the App Store
          </Badge>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-5">
            Purposeful apps
            <br />
            for serious learners.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
            We build depth-first tools for people who want to genuinely master
            hard skills — starting with Mandarin Chinese.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/apps" className={buttonVariants({ size: "lg" })}>
              Browse apps
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/apps/menzi" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Learn about Menzi
            </Link>
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Featured app ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-2">
              Featured App
            </p>
            <h2 className="text-3xl font-bold">Menzi</h2>
            <p className="text-muted-foreground mt-1.5">
              Mandarin Chinese for iOS — serious learning, serious tools.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline">iOS</Badge>
            <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
              Available
            </Badge>
          </div>
        </div>

        {/* Mode grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {modes.map(({ icon: Icon, name, description }) => (
            <Card key={name} className="bg-card/50 border-border/60 hover:border-primary/40 hover:bg-card transition-all duration-200 group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle className="text-sm">{name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Link
            href="/apps/menzi"
            className={buttonVariants({ variant: "ghost" }) + " text-primary hover:text-primary hover:bg-primary/10"}
          >
            Full app details
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Screenshot carousel ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 overflow-hidden">
        <div className="mb-10">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-2">
            App Preview
          </p>
          <h2 className="text-2xl font-bold">See every mode in action</h2>
        </div>
        <AppScreenshotCarousel />
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Why it works ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">
          Approach
        </p>
        <h2 className="text-2xl font-bold mb-10">Why it works</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-primary/10 text-primary h-fit">
                <Icon className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Start learning Mandarin today</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Download Menzi on iOS and build a vocabulary that actually sticks.
          </p>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Download on the App Store
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
