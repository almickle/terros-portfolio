import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/lib/button-variants";

export const metadata: Metadata = {
  title: "Menzi — Mandarin Chinese for Serious Learners",
  description:
    "Menzi teaches Mandarin with spaced repetition, and every review asks you to produce the language rather than recognize it. A language model grades what you write and say.",
};

const modes = [
  {
    name: "Pinyin",
    description:
      "You're given a word and you write a real sentence with it. A language model grades the sentence on meaning and on grammar, separately, and that grade schedules the word's next review.",
  },
  {
    name: "Hanzi",
    description:
      "See a character, type the reading. Builds the character-to-pronunciation link that recognition drills never reach.",
  },
  {
    name: "Speak",
    description:
      "Hold the button and say the word. Scored by Azure's Mandarin pronunciation assessment — tone-aware, with accuracy and fluency broken out, and an A/B replay against a native reference.",
  },
  {
    name: "Listen",
    description:
      "Type what you hear, from natural generated audio built around the vocabulary you're working on.",
  },
  {
    name: "Grammar",
    description:
      "Patterns are spaced-repetition items in their own right, drilled by translation in both directions, with their own practice regiment and progress.",
  },
  {
    name: "Immersion",
    description:
      "Chat in Chinese by text or voice with every sentence graded, and read stories generated from the words you already know, with read-along audio.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "No card required",
    description:
      "The whole app, with smaller monthly allowances. Every mode, all four axes, the full HSK dictionary.",
    features: ["Every learning mode", "Four-axis scheduling", "Monthly AI + audio allowance"],
    highlighted: false,
  },
  {
    name: "Menzi Pro",
    price: "$19.99 / month",
    description:
      "For daily practice. 20M AI credits and 30 minutes of audio each month — the headroom that matters if you lean on speaking, conversation and generated stories.",
    features: ["20M AI credits per month", "30 minutes of audio per month", "Cancel any time in the App Store"],
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
              <h2 className="text-sm font-semibold mb-2">Spaced repetition, without the self-grading</h2>
              <p className="text-sm text-[--color-muted] leading-relaxed max-w-2xl">
                SM-2 is the right framework for memory, which is why it has outlasted every trend.
                But a flashcard can only ask &quot;did you know it?&quot;, and you are the one
                answering. Nobody can grade their own Chinese. Menzi keeps the framework and
                replaces the self-assessment with a language model that reads what you produced,
                so the schedule tracks what you can do rather than what looked familiar.
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
