import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Menzi and other Terros Digital apps.",
};

const faqs = [
  {
    q: "How does spaced repetition work in Menzi?",
    a: "Menzi uses the SM-2 algorithm. After each review you rate your recall 1–5, and the algorithm schedules the next review accordingly — sooner for cards you struggled with, later for cards you know well. This compounds over time, so your review load stays manageable no matter how large your deck grows.",
  },
  {
    q: "What is Speaking Mode and what do I need for it?",
    a: "Speaking Mode is a real-time voice conversation with an AI tutor powered by ElevenLabs. The tutor is constrained to your vocabulary profile, so it won't use words you haven't learned. It requires a Pro subscription and a stable internet connection.",
  },
  {
    q: "How is Listening Mode different from Speaking Mode?",
    a: "Listening Mode is passive — the app generates short comprehensible input sentences from your own deck and reads them aloud. Speaking Mode is interactive — you speak and the AI responds in real time. Both require a Pro subscription.",
  },
  {
    q: "What are Constructs and how is progress tracked?",
    a: "Constructs are grammar patterns (e.g. 是…的, 把-sentences). Each one has a sentence construction exercise that you complete and submit. An LLM grades your response and provides feedback. Progress is tracked per pattern, independently of your flashcard deck.",
  },
  {
    q: "Can I import my own vocabulary?",
    a: "Custom import is on the roadmap. Currently, vocabulary is added through the app's built-in deck management — you can add words manually or accept suggestions from Learn Mode.",
  },
  {
    q: "What's the difference between Standard and Pro?",
    a: "Both tiers give you access to all six learning modes. The difference is credit allocation — Pro gives you a larger pool of credits, which matters most if you use Speaking Mode and Listening Mode heavily (both involve real-time voice generation via ElevenLabs). Standard is plenty for a consistent daily practice.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Subscriptions are managed through the App Store. Go to Settings → Apple ID → Subscriptions on your iPhone to cancel at any time. You retain Pro access until the end of the current billing period.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-14">
        <Badge variant="outline" className="mb-4">Help</Badge>
        <h1 className="text-4xl font-bold mb-4">Support</h1>
        <p className="text-[--color-muted]">
          Answers to common questions about Menzi and Terros Digital apps.
        </p>
      </div>

      {/* FAQ */}
      <section className="mb-16">
        <Accordion multiple={false} className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={i}>
              <AccordionTrigger className="text-sm font-semibold text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[--color-muted] leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact */}
      <Card className="bg-card border-border">
        <CardHeader className="p-8">
          <CardTitle className="text-sm font-semibold mb-2">Still need help?</CardTitle>
          <CardDescription className="text-sm leading-relaxed mb-4">
            If your question isn&apos;t answered above, reach out directly. We respond
            to all support emails within one business day.
          </CardDescription>
          <a
            href="mailto:support@terrosdigital.com"
            className={buttonVariants({ variant: "outline", size: "sm" }) + " w-fit"}
          >
            support@terrosdigital.com
          </a>
        </CardHeader>
      </Card>
    </div>
  );
}
