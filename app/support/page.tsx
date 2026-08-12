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
    q: "What makes Menzi different from other flashcard apps?",
    a: "Most review is recognition — you see a word and decide whether you knew it. Menzi asks you to produce the language instead: you write a real sentence using the target word, and a language model reads it and grades it on two separate axes. Comprehension (did the meaning land) drives your review schedule and is graded once, on your honest first attempt. Correctness (is the Chinese actually grammatical) has to reach 5/5 before you move on, with unlimited attempts and the corrected sentence shown. So your score stays honest, and you don't advance with broken Chinese.",
  },
  {
    q: "What are the four axes?",
    a: "Reading a character, using a word, hearing it, and saying it are different skills, so Menzi schedules them separately. Every word has its own spaced-repetition state for meaning, reading, listening and speaking, and each one unlocks as your comprehension of that word grows. That's why a word can be solid in one mode and still due in another — 'I know this word' stops being a single number.",
  },
  {
    q: "How does the speaking practice work?",
    a: "In Speak review you hold the button and say the word. The recording is transcribed and scored by Microsoft Azure's pronunciation assessment for Mandarin, which is tone-aware — that's the part written practice can't reach. You get an accuracy, fluency and completeness breakdown, plus an A/B replay against a native reference. Your first take is the one that counts; re-records are practice.",
  },
  {
    q: "Can I talk to the tutor?",
    a: "Yes. In the Immersion tab, Chat is an open-ended conversation in Chinese. You can type, or hold the mic to speak and your recording is transcribed and answered with audio. Every Chinese sentence you send is graded like any other, so conversation counts as practice rather than sitting outside the system. It's turn-based — record, send, reply — not a live phone call.",
  },
  {
    q: "Where do the stories come from?",
    a: "They're generated from the words already in your deck, so what you read is genuinely comprehensible input rather than text pitched at an average learner. Stories come with read-along audio and tap-to-reveal pinyin, and they get harder as your vocabulary grows. You can also import your own audio and have it transcribed and segmented.",
  },
  {
    q: "Is grammar covered, or just vocabulary?",
    a: "Grammar patterns are spaced-repetition items in their own right, with their own practice regiment and progress tracking — not a side tab. Drills run in both directions: sometimes you render English into Chinese, sometimes you translate a Chinese sentence into English, and the grader knows which direction it asked for.",
  },
  {
    q: "How do I add my own words?",
    a: "Two ways. You can add a word directly from the Reference tab, which looks up the pinyin and meaning for you, and you can browse the full HSK dictionary there and add anything from it. Menzi also picks up words you use anywhere in the app and folds them into your backlog, so your word list reflects what you've actually encountered, not only what you formally studied.",
  },
  {
    q: "What does Menzi Pro include, and what's free?",
    a: "There is a free tier and one paid plan: Menzi Pro at $19.99 per month, which includes 20M AI credits and 30 minutes of audio each month. There is no annual option and no other tier. The free tier opens the whole app — every mode, all four axes, the full HSK dictionary — but its allowance is a one-time grant of 5M AI credits and 10 minutes of audio, roughly 150 graded sentences. It does not reset each month; it is there so you can try everything properly before deciding.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Subscriptions are managed by Apple, not by us. On your iPhone go to Settings, tap your name, then Subscriptions, and cancel there. You keep Pro access until the end of the billing period you've already paid for.",
  },
  {
    q: "How do I delete my account?",
    a: "In the app: Settings, scroll to the bottom, then Delete Account. If you have Face ID or Touch ID enrolled you'll be asked to re-authenticate first. It's immediate and permanent — your deck, review history, sessions and stories all go. If you'd rather we did it, email support and we'll action it within 30 days.",
  },
  {
    q: "Does Menzi work offline?",
    a: "No. Grading, conversation, audio and story generation all run server-side, so Menzi needs an internet connection.",
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
