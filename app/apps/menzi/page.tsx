import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/lib/button-variants";

export const metadata: Metadata = {
  title: "Menzi — Mandarin Chinese for Serious Learners",
  description:
    "Menzi is a depth-first iOS Mandarin app combining SM-2 spaced repetition with AI-powered speaking, listening, and writing practice.",
};

const modes = [
  {
    name: "Hanzi Mode",
    description:
      "See a character, type the pinyin. Builds the critical reading-to-pronunciation link that most apps skip.",
  },
  {
    name: "Pinyin Mode",
    description:
      "See pinyin, write a sentence using the word. Forces active recall and production, not just recognition.",
  },
  {
    name: "Learn Mode",
    description:
      "New vocabulary arrives with AI-generated explanations, example sentences, and context before entering your review queue.",
  },
  {
    name: "Speaking Mode",
    description:
      "Real-time voice conversation with an AI tutor constrained to your vocabulary — you'll never encounter a word you haven't learned.",
  },
  {
    name: "Listening Mode",
    description:
      "Comprehensible input sentences generated from your own deck, read aloud by a natural voice. Ear training at exactly your level.",
  },
  {
    name: "Constructs Mode",
    description:
      "A grammar pattern library with sentence construction exercises graded by AI. Progress is tracked per pattern, separate from vocabulary.",
  },
];

const tiers = [
  {
    name: "Standard",
    price: "Free to try",
    description:
      "Access to all six learning modes with a standard credit allocation — enough for a consistent daily practice.",
    features: ["All six modes", "SM-2 scheduling", "Standard credit allocation"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Subscription",
    description:
      "The same full feature set with a larger credit pool — designed for learners who use Speaking and Listening Mode heavily.",
    features: ["All six modes", "SM-2 scheduling", "Higher credit allocation"],
    highlighted: true,
  },
];

export default function MenziPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">iOS</Badge>
          <Badge variant="secondary">Available on the App Store</Badge>
        </div>
        <h1 className="text-5xl font-bold mb-4">Menzi</h1>
        <p className="text-xl text-[--color-muted] leading-relaxed mb-8">
          A serious Mandarin Chinese learning app that combines spaced repetition
          with AI-powered practice — personalized to your exact vocabulary.
        </p>
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Download on the App Store ↗
        </a>
      </div>

      <Separator className="mb-20" />

      {/* Learning Modalities */}
      <section className="mb-20">
        <p className="text-xs font-medium text-[--color-brand] tracking-widest uppercase mb-2">
          Learning Modalities
        </p>
        <h2 className="text-2xl font-bold mb-8">Six ways to learn</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <Card key={mode.name} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-semibold mb-1">{mode.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {mode.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* SM-2 callout */}
      <section className="mb-20">
        <Card className="bg-card border-border p-8">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-[--color-brand-dim] flex items-center justify-center shrink-0">
              <span className="text-[--color-brand] text-sm font-bold">∞</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Built on proven science</h2>
              <p className="text-sm text-[--color-muted] leading-relaxed max-w-2xl">
                Menzi uses the SM-2 spaced repetition algorithm to schedule every card
                at exactly the right moment. Each response is scored 1–5 — by you for
                quick reviews, or by AI for written and spoken answers — so the
                schedule adapts to how well you actually know each word.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="mb-20" />

      {/* Pricing */}
      <section>
        <p className="text-xs font-medium text-[--color-brand] tracking-widest uppercase mb-2">
          Pricing
        </p>
        <h2 className="text-2xl font-bold mb-8">Simple tiers</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.highlighted
                  ? "border-[--color-brand] bg-[--color-brand-dim]"
                  : "bg-card border-border"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base font-bold">{tier.name}</CardTitle>
                  {tier.highlighted && <Badge>Most popular</Badge>}
                </div>
                <p className="text-xs text-[--color-muted] mb-3">{tier.price}</p>
                <CardDescription className="text-sm leading-relaxed mb-4">
                  {tier.description}
                </CardDescription>
                <ul className="space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[--color-muted]">
                      <span className="text-[--color-brand]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
